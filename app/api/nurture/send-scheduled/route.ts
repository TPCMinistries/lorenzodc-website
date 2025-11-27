import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { supabaseAdmin } from '../../../../lib/supabase/server';

const resend = new Resend(process.env.RESEND_API_KEY || "placeholder-resend-key");

// Verify authorization for cron/webhook triggers
function verifyAuthorization(request: NextRequest): boolean {
  // Check Vercel Cron secret (sent automatically by Vercel)
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader === `Bearer ${cronSecret}`) {
    return true;
  }

  // Check custom webhook secret (for manual triggers / N8N)
  const webhookSecret = request.headers.get('x-webhook-secret');
  const expectedSecret = process.env.WEBHOOK_SHARED_SECRET;

  if (expectedSecret && webhookSecret === expectedSecret) {
    return true;
  }

  // In development, allow requests if no secrets configured
  if (process.env.NODE_ENV === 'development' && !cronSecret && !expectedSecret) {
    console.warn('No secrets configured - allowing request in development');
    return true;
  }

  return false;
}

// Main handler for sending scheduled emails
async function sendScheduledEmails(request: NextRequest) {
  // Verify authorization
  if (!verifyAuthorization(request)) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    // Get pending emails to send (batch of 50)
    const { data: pendingEmails, error: fetchError } = await supabaseAdmin
      .rpc('get_emails_to_send', { batch_size: 50 });

    if (fetchError) {
      console.error('Error fetching pending emails:', fetchError);
      return NextResponse.json(
        { error: 'Failed to fetch pending emails', details: fetchError.message },
        { status: 500 }
      );
    }

    if (!pendingEmails || pendingEmails.length === 0) {
      return NextResponse.json({
        message: 'No emails to send',
        sent: 0,
        failed: 0
      });
    }

    let sentCount = 0;
    let failedCount = 0;
    const results: Array<{ id: string; status: string; error?: string }> = [];

    // Process each email
    for (const email of pendingEmails) {
      try {
        // Send email via Resend
        const { data: emailData, error: emailError } = await resend.emails.send({
          from: 'Lorenzo DC <lorenzo@lorenzodc.com>',
          to: [email.prospect_email],
          subject: email.subject,
          html: email.html_content,
        });

        if (emailError) {
          throw new Error(emailError.message);
        }

        // Mark as sent
        await supabaseAdmin.rpc('mark_email_sent', { email_id: email.id });

        sentCount++;
        results.push({ id: email.id, status: 'sent' });

        // Track email event
        await supabaseAdmin
          .from('email_automation_events')
          .insert({
            email_address: email.prospect_email,
            event_type: 'sent',
            email_type: `nurture_email_${email.email_number}`,
            metadata: {
              subject: email.subject,
              sequence_type: email.sequence_type,
              resend_id: emailData?.id
            }
          });

        console.log(`Sent nurture email ${email.email_number} to ${email.prospect_email}`);

      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';

        // Mark as failed
        await supabaseAdmin.rpc('mark_email_failed', {
          email_id: email.id,
          error_msg: errorMessage
        });

        failedCount++;
        results.push({ id: email.id, status: 'failed', error: errorMessage });

        console.error(`Failed to send nurture email to ${email.prospect_email}:`, errorMessage);
      }

      // Small delay between emails to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    return NextResponse.json({
      message: `Processed ${pendingEmails.length} emails`,
      sent: sentCount,
      failed: failedCount,
      results
    });

  } catch (error) {
    console.error('Nurture email processing error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET endpoint - handles both Vercel Cron triggers and status checks
export async function GET(request: NextRequest) {
  // If authorized (Vercel Cron or webhook), process emails
  if (verifyAuthorization(request)) {
    return sendScheduledEmails(request);
  }

  // Otherwise, return status (for monitoring dashboards)
  try {
    const { count: pendingCount } = await supabaseAdmin
      .from('scheduled_emails')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending')
      .lte('scheduled_for', new Date().toISOString());

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { count: sentTodayCount } = await supabaseAdmin
      .from('scheduled_emails')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'sent')
      .gte('sent_at', today.toISOString());

    const { data: recentFailures } = await supabaseAdmin
      .from('scheduled_emails')
      .select('id, prospect_email, email_number, error_message, updated_at')
      .eq('status', 'failed')
      .order('updated_at', { ascending: false })
      .limit(5);

    return NextResponse.json({
      status: 'healthy',
      ready_to_send: pendingCount || 0,
      sent_today: sentTodayCount || 0,
      recent_failures: recentFailures || [],
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Status check error:', error);
    return NextResponse.json(
      { status: 'error', error: 'Failed to check status' },
      { status: 500 }
    );
  }
}

// POST endpoint - for manual triggers with webhook secret
export async function POST(request: NextRequest) {
  return sendScheduledEmails(request);
}
