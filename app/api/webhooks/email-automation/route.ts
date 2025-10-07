import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase/client';

// Email automation webhook endpoint
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      user_id,
      event_type,
      event_data,
      campaign_name,
      immediate_send = true
    } = body;

    // Validate required fields
    if (!user_id || !event_type || !campaign_name) {
      return NextResponse.json(
        { error: 'Missing required fields: user_id, event_type, campaign_name' },
        { status: 400 }
      );
    }

    // Store the email automation event in Supabase
    const { data: emailEvent, error: emailError } = await supabase
      .from('email_automation_events')
      .insert({
        prospect_id: user_id,
        event_type,
        event_data,
        campaign_name,
        immediate_send,
        status: 'pending',
        scheduled_for: immediate_send ? new Date().toISOString() : null
      })
      .select()
      .single();

    if (emailError) {
      console.error('Error storing email event:', emailError);
      return NextResponse.json(
        { error: 'Failed to store email event' },
        { status: 500 }
      );
    }

    // Get prospect information for email personalization
    const { data: prospect, error: prospectError } = await supabase
      .from('prospect_profiles')
      .select('*')
      .eq('id', user_id)
      .single();

    if (prospectError || !prospect) {
      console.error('Error retrieving prospect:', prospectError);
      return NextResponse.json(
        { error: 'Prospect not found' },
        { status: 404 }
      );
    }

    // Trigger email automation based on platform
    const emailPlatform = process.env.EMAIL_PLATFORM || 'convertkit';
    let automationResult;

    switch (emailPlatform.toLowerCase()) {
      case 'convertkit':
        automationResult = await triggerConvertKitAutomation(prospect, emailEvent);
        break;
      case 'mailchimp':
        automationResult = await triggerMailchimpAutomation(prospect, emailEvent);
        break;
      case 'activecampaign':
        automationResult = await triggerActiveCampaignAutomation(prospect, emailEvent);
        break;
      default:
        automationResult = await triggerConvertKitAutomation(prospect, emailEvent);
    }

    // Update email event with automation result
    if (automationResult.success) {
      await supabase
        .from('email_automation_events')
        .update({
          status: 'sent',
          external_id: automationResult.external_id,
          sent_at: new Date().toISOString()
        })
        .eq('id', emailEvent.id);
    } else {
      await supabase
        .from('email_automation_events')
        .update({
          status: 'failed'
        })
        .eq('id', emailEvent.id);
    }

    return NextResponse.json({
      success: automationResult.success,
      email_event_id: emailEvent.id,
      external_id: automationResult.external_id,
      message: automationResult.message
    });

  } catch (error) {
    console.error('Email automation webhook error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// ConvertKit integration
async function triggerConvertKitAutomation(prospect: any, emailEvent: any) {
  const apiKey = process.env.CONVERTKIT_API_KEY;
  const apiSecret = process.env.CONVERTKIT_API_SECRET;

  if (!apiKey || !apiSecret) {
    console.error('ConvertKit API credentials not configured');
    return { success: false, message: 'ConvertKit credentials missing' };
  }

  try {
    // Map campaign names to ConvertKit automation IDs
    const automationMapping = getConvertKitAutomationMapping();
    const automationId = automationMapping[emailEvent.campaign_name as keyof typeof automationMapping];

    if (!automationId) {
      console.warn(`No ConvertKit automation found for campaign: ${emailEvent.campaign_name}`);
      return { success: false, message: 'Automation not found' };
    }

    // Add subscriber to ConvertKit
    const subscriberResponse = await fetch('https://api.convertkit.com/v3/subscribers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        api_key: apiKey,
        email: prospect.email,
        first_name: prospect.name,
        fields: {
          company: prospect.company,
          role: prospect.role,
          category: prospect.category,
          tier: prospect.tier,
          lead_score: prospect.lead_score.toString(),
          source: prospect.source
        }
      })
    });

    if (!subscriberResponse.ok) {
      throw new Error(`ConvertKit subscriber API error: ${subscriberResponse.statusText}`);
    }

    const subscriberData = await subscriberResponse.json();

    // Subscribe to automation
    const automationResponse = await fetch(`https://api.convertkit.com/v3/automations/${automationId}/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        api_key: apiKey,
        email: prospect.email
      })
    });

    if (!automationResponse.ok) {
      throw new Error(`ConvertKit automation API error: ${automationResponse.statusText}`);
    }

    const automationData = await automationResponse.json();

    return {
      success: true,
      external_id: subscriberData.subscription?.id || automationData.subscription?.id,
      message: 'ConvertKit automation triggered successfully'
    };

  } catch (error) {
    console.error('ConvertKit automation error:', error);
    return {
      success: false,
      message: `ConvertKit error: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

// Mailchimp integration
async function triggerMailchimpAutomation(prospect: any, emailEvent: any) {
  const apiKey = process.env.MAILCHIMP_API_KEY;
  const listId = process.env.MAILCHIMP_LIST_ID;
  const serverPrefix = apiKey?.split('-')[1];

  if (!apiKey || !listId) {
    console.error('Mailchimp API credentials not configured');
    return { success: false, message: 'Mailchimp credentials missing' };
  }

  try {
    // Add/update subscriber
    const subscriberResponse = await fetch(
      `https://${serverPrefix}.api.mailchimp.com/3.0/lists/${listId}/members`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email_address: prospect.email,
          status: 'subscribed',
          merge_fields: {
            FNAME: prospect.name?.split(' ')[0] || '',
            LNAME: prospect.name?.split(' ').slice(1).join(' ') || '',
            COMPANY: prospect.company || '',
            CATEGORY: prospect.category || '',
            TIER: prospect.tier || '',
            LEADSCORE: prospect.lead_score.toString()
          },
          tags: [emailEvent.campaign_name, prospect.category, prospect.tier]
        })
      }
    );

    if (!subscriberResponse.ok && subscriberResponse.status !== 400) {
      throw new Error(`Mailchimp API error: ${subscriberResponse.statusText}`);
    }

    const subscriberData = await subscriberResponse.json();

    // Trigger automation via tags or segments
    // Mailchimp automations are typically triggered by tags or list membership
    return {
      success: true,
      external_id: subscriberData.id,
      message: 'Mailchimp subscriber added with automation tags'
    };

  } catch (error) {
    console.error('Mailchimp automation error:', error);
    return {
      success: false,
      message: `Mailchimp error: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

// ActiveCampaign integration
async function triggerActiveCampaignAutomation(prospect: any, emailEvent: any) {
  const apiKey = process.env.ACTIVECAMPAIGN_API_KEY;
  const apiUrl = process.env.ACTIVECAMPAIGN_API_URL;

  if (!apiKey || !apiUrl) {
    console.error('ActiveCampaign API credentials not configured');
    return { success: false, message: 'ActiveCampaign credentials missing' };
  }

  try {
    // Add/update contact
    const contactResponse = await fetch(`${apiUrl}/api/3/contacts`, {
      method: 'POST',
      headers: {
        'Api-Token': apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contact: {
          email: prospect.email,
          firstName: prospect.name?.split(' ')[0] || '',
          lastName: prospect.name?.split(' ').slice(1).join(' ') || '',
          phone: prospect.phone || '',
          fieldValues: [
            {
              field: 'company',
              value: prospect.company || ''
            },
            {
              field: 'category',
              value: prospect.category || ''
            },
            {
              field: 'tier',
              value: prospect.tier || ''
            },
            {
              field: 'lead_score',
              value: prospect.lead_score.toString()
            }
          ]
        }
      })
    });

    if (!contactResponse.ok) {
      throw new Error(`ActiveCampaign contact API error: ${contactResponse.statusText}`);
    }

    const contactData = await contactResponse.json();
    const contactId = contactData.contact.id;

    // Get automation ID
    const automationMapping = getActiveCampaignAutomationMapping();
    const automationId = automationMapping[emailEvent.campaign_name as keyof typeof automationMapping];

    if (automationId) {
      // Add contact to automation
      await fetch(`${apiUrl}/api/3/contactAutomations`, {
        method: 'POST',
        headers: {
          'Api-Token': apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contactAutomation: {
            contact: contactId,
            automation: automationId
          }
        })
      });
    }

    return {
      success: true,
      external_id: contactId,
      message: 'ActiveCampaign automation triggered successfully'
    };

  } catch (error) {
    console.error('ActiveCampaign automation error:', error);
    return {
      success: false,
      message: `ActiveCampaign error: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

// Automation mapping configurations
function getConvertKitAutomationMapping() {
  return {
    'welcome_sequence': process.env.CONVERTKIT_WELCOME_AUTOMATION_ID,
    'enterprise_assessment_followup': process.env.CONVERTKIT_ENTERPRISE_AUTOMATION_ID,
    'personal_assessment_followup': process.env.CONVERTKIT_PERSONAL_AUTOMATION_ID,
    'divine_strategy_nurturing_sequence': process.env.CONVERTKIT_DIVINE_STRATEGY_AUTOMATION_ID,
    'enterprise_ai_nurturing_sequence': process.env.CONVERTKIT_ENTERPRISE_AI_AUTOMATION_ID,
    'investment_opportunity_sequence': process.env.CONVERTKIT_INVESTMENT_AUTOMATION_ID,
    'lead_magnet_ai_readiness_checklist_followup': process.env.CONVERTKIT_AI_CHECKLIST_AUTOMATION_ID,
    'lead_magnet_divine_strategy_guide_followup': process.env.CONVERTKIT_DIVINE_GUIDE_AUTOMATION_ID,
    'booking_preparation_executive_strategy': process.env.CONVERTKIT_EXECUTIVE_PREP_AUTOMATION_ID,
    'booking_preparation_divine_strategy': process.env.CONVERTKIT_DIVINE_PREP_AUTOMATION_ID,
    'booking_preparation_ai_implementation': process.env.CONVERTKIT_AI_PREP_AUTOMATION_ID,
    'booking_preparation_general_discovery': process.env.CONVERTKIT_GENERAL_PREP_AUTOMATION_ID
  };
}

function getActiveCampaignAutomationMapping() {
  return {
    'welcome_sequence': process.env.ACTIVECAMPAIGN_WELCOME_AUTOMATION_ID,
    'enterprise_assessment_followup': process.env.ACTIVECAMPAIGN_ENTERPRISE_AUTOMATION_ID,
    'personal_assessment_followup': process.env.ACTIVECAMPAIGN_PERSONAL_AUTOMATION_ID,
    'divine_strategy_nurturing_sequence': process.env.ACTIVECAMPAIGN_DIVINE_STRATEGY_AUTOMATION_ID,
    'enterprise_ai_nurturing_sequence': process.env.ACTIVECAMPAIGN_ENTERPRISE_AI_AUTOMATION_ID,
    'investment_opportunity_sequence': process.env.ACTIVECAMPAIGN_INVESTMENT_AUTOMATION_ID
  };
}