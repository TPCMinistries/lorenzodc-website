import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase/server';

// Webhook endpoint for triggering email automation
export async function POST(request: NextRequest) {
  try {
    const {
      user_id,
      event_type,
      event_data = {},
      campaign_name,
      immediate_send = false
    } = await request.json();

    if (!user_id || !event_type) {
      return NextResponse.json(
        { error: 'user_id and event_type are required' },
        { status: 400 }
      );
    }

    // Trigger email automation in database
    const { data: automation_id, error } = await supabase.rpc('trigger_email_automation', {
      user_id_param: user_id,
      event_type_param: event_type,
      event_data_param: event_data,
      campaign_name_param: campaign_name
    });

    if (error) {
      console.error('Error triggering email automation:', error);
      return NextResponse.json(
        { error: 'Failed to trigger email automation' },
        { status: 500 }
      );
    }

    // If immediate send is requested, send webhook immediately
    if (immediate_send) {
      const sent = await sendToEmailProvider(automation_id, {
        user_id,
        event_type,
        event_data,
        campaign_name
      });

      return NextResponse.json({
        success: true,
        automation_id,
        webhook_sent: sent
      });
    }

    return NextResponse.json({
      success: true,
      automation_id,
      message: 'Email automation triggered successfully'
    });

  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Function to send webhook to email provider (n8n, ConvertKit, etc.)
async function sendToEmailProvider(
  automation_id: string,
  eventData: {
    user_id: string;
    event_type: string;
    event_data: any;
    campaign_name?: string;
  }
): Promise<boolean> {
  try {
    // Get user details and automation record
    const { data: automation } = await supabase
      .from('email_automation_events')
      .select('*')
      .eq('id', automation_id)
      .single();

    if (!automation) {
      console.error('Automation record not found:', automation_id);
      return false;
    }

    // Prepare webhook payload
    const webhookPayload = {
      user_id: eventData.user_id,
      user_email: automation.user_email,
      user_name: automation.user_name,
      event_type: eventData.event_type,
      event_data: eventData.event_data,
      subscription_tier: automation.subscription_tier,
      campaign_name: eventData.campaign_name,
      timestamp: new Date().toISOString(),
      automation_id: automation_id
    };

    // Send to email provider (n8n webhook)
    const webhookUrl = process.env.N8N_WEBHOOK_URL || automation.webhook_url;

    if (!webhookUrl) {
      console.error('No webhook URL configured');
      return false;
    }

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Webhook-Source': 'catalyst-ai',
        'X-Event-Type': eventData.event_type
      },
      body: JSON.stringify(webhookPayload)
    });

    const success = response.ok;

    // Update automation record with result
    await supabase
      .from('email_automation_events')
      .update({
        status: success ? 'sent' : 'failed',
        sent_at: success ? new Date().toISOString() : null,
        error_message: success ? null : `Webhook failed: ${response.status} ${response.statusText}`
      })
      .eq('id', automation_id);

    if (!success) {
      console.error('Webhook failed:', response.status, response.statusText);
    }

    return success;

  } catch (error) {
    console.error('Error sending webhook:', error);

    // Update automation record with error
    await supabase
      .from('email_automation_events')
      .update({
        status: 'failed',
        error_message: error.message
      })
      .eq('id', automation_id);

    return false;
  }
}

// GET endpoint to retrieve automation events (for admin/debugging)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const user_id = searchParams.get('user_id');
    const event_type = searchParams.get('event_type');
    const status = searchParams.get('status');

    let query = supabase
      .from('email_automation_events')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);

    if (user_id) {
      query = query.eq('user_id', user_id);
    }

    if (event_type) {
      query = query.eq('event_type', event_type);
    }

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch automation events' },
        { status: 500 }
      );
    }

    return NextResponse.json({ events: data });

  } catch (error) {
    console.error('Error fetching automation events:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}