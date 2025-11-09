import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { supabaseAdmin } from '../../../../lib/supabase/server';
import {
  emailSequences,
  getSequenceById,
  replacePlaceholders,
  type EmailSequence
} from '../../../../lib/email-sequences';

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Send an email from a sequence
 * POST /api/email-automation/send-sequence
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      sequenceId,
      email,
      emailIndex = 0,
      templateData = {}
    } = body;

    if (!sequenceId || !email) {
      return NextResponse.json(
        { error: 'Sequence ID and email are required' },
        { status: 400 }
      );
    }

    // Get the sequence
    const sequence = getSequenceById(sequenceId);
    if (!sequence) {
      return NextResponse.json(
        { error: 'Sequence not found' },
        { status: 404 }
      );
    }

    // Get the email template
    const emailTemplate = sequence.emails[emailIndex];
    if (!emailTemplate) {
      return NextResponse.json(
        { error: 'Email template not found' },
        { status: 404 }
      );
    }

    // Replace placeholders in subject and HTML
    const subject = replacePlaceholders(emailTemplate.subject, templateData);
    const html = replacePlaceholders(emailTemplate.html, templateData);

    // Send the email
    const { data: emailData, error: emailError } = await resend.emails.send({
      from: 'Lorenzo DC <lorenzo@lorenzodc.com>',
      to: [email],
      subject,
      html,
    });

    if (emailError) {
      console.error('Email send error:', emailError);
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      );
    }

    // Log the email automation event
    try {
      const { data: prospect } = await supabaseAdmin
        .from('prospect_profiles')
        .select('id')
        .eq('email', email)
        .single();

      if (prospect) {
        await supabaseAdmin
          .from('email_automation_events')
          .insert({
            prospect_id: prospect.id,
            event_type: 'nurturing_sequence',
            campaign_name: sequence.name,
            status: 'sent',
            sent_at: new Date().toISOString(),
            event_data: {
              sequence_id: sequenceId,
              email_index: emailIndex,
              template_data: templateData
            }
          });
      }
    } catch (dbError) {
      console.error('Error logging email event:', dbError);
      // Continue even if logging fails
    }

    return NextResponse.json({
      success: true,
      emailId: emailData?.id,
      sequenceId,
      emailIndex
    });

  } catch (error) {
    console.error('Email automation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Get available sequences
 * GET /api/email-automation/send-sequence
 */
export async function GET() {
  return NextResponse.json({
    sequences: emailSequences.map(seq => ({
      id: seq.id,
      name: seq.name,
      description: seq.description,
      trigger: seq.trigger,
      emailCount: seq.emails.length
    }))
  });
}
