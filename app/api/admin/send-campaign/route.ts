import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 'placeholder-resend-key');

// Pre-built email templates
const EMAIL_TEMPLATES = {
  assessment_live: {
    subject: '🎉 The AI Assessment You Requested is Now Live!',
    getHtml: (recipient: string) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
          <h1 style="color: white; margin: 0; font-size: 28px;">🎉 It's Finally Here!</h1>
        </div>

        <p style="font-size: 16px;">Hi there,</p>

        <p>Remember when you signed up for our AI Readiness Assessment a few days ago?</p>

        <p><strong>Good news - it's finally live! 🚀</strong></p>

        <p>We just launched the full interactive assessment (took us a bit longer than expected to make it perfect, but it's worth the wait).</p>

        <div style="background: #f8f9fa; padding: 25px; border-radius: 8px; border-left: 4px solid #667eea; margin: 25px 0;">
          <h3 style="margin-top: 0; color: #667eea;">In Just 5 Minutes, You'll Discover:</h3>
          <ul style="margin: 10px 0; padding-left: 20px;">
            <li>✅ Your AI Readiness Score (0-100%)</li>
            <li>✅ Detailed breakdown across 4 key dimensions</li>
            <li>✅ Your personalized 30-90 day roadmap</li>
            <li>✅ Specific next steps for YOUR business</li>
            <li>✅ Instant access to our AI Strategy Chat</li>
          </ul>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <a href="https://www.lorenzodc.com/ai-assessment" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block; font-size: 16px;">
            Take Your Free Assessment Now →
          </a>
        </div>

        <div style="background: #fff3cd; padding: 20px; border-radius: 8px; border: 1px solid #ffeaa7; margin: 25px 0;">
          <p style="margin: 0;"><strong>💡 Quick tip:</strong> Most leaders are surprised by their results - both in areas where they're ahead and where they have gaps.</p>
        </div>

        <p>Looking forward to seeing your results!</p>

        <p style="margin-top: 30px;">
          Best,<br>
          <strong>Lorenzo Daughtry-Chambers</strong><br>
          <em>AI Strategy & Innovation</em>
        </p>

        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">

        <div style="text-align: center; color: #666; font-size: 14px;">
          <p>You're receiving this because you signed up at <a href="https://www.lorenzodc.com" style="color: #667eea;">lorenzodc.com</a></p>
        </div>
      </body>
      </html>
    `
  },

  social_proof: {
    subject: 'Quick question about your AI readiness...',
    getHtml: (recipient: string) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
          <h1 style="color: white; margin: 0; font-size: 28px;">📊 Where Do You Rank?</h1>
        </div>

        <p style="font-size: 16px;">Quick question - have you taken your AI Readiness Assessment yet?</p>

        <p>I've been analyzing the patterns I'm seeing, and here's what's interesting:</p>

        <div style="background: #f8f9fa; padding: 25px; border-radius: 8px; margin: 25px 0;">
          <h3 style="margin-top: 0; color: #667eea;">The Reality Gap:</h3>
          <p style="margin: 10px 0; font-size: 16px;">Most organizations have a significant gap between where they <em>think</em> they are with AI and where they actually are.</p>
          <p style="margin: 10px 0; font-size: 16px;">The assessment reveals this gap clearly - and more importantly, shows you exactly how to close it.</p>
        </div>

        <p><strong>The question is: where do YOU actually stand?</strong></p>

        <p>Most leaders are surprised by their results - sometimes ahead in unexpected areas, sometimes behind where they thought.</p>

        <div style="text-align: center; margin: 30px 0;">
          <a href="https://www.lorenzodc.com/ai-assessment" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block; font-size: 16px;">
            Discover Your Real AI Readiness →
          </a>
        </div>

        <p style="text-align: center; color: #666; font-size: 14px;">Takes 5 minutes. Worth knowing.</p>

        <p style="margin-top: 30px;">
          Best,<br>
          <strong>Lorenzo</strong>
        </p>

        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">

        <div style="text-align: center; color: #666; font-size: 14px;">
          <p>You're receiving this because you signed up at <a href="https://www.lorenzodc.com" style="color: #667eea;">lorenzodc.com</a></p>
        </div>
      </body>
      </html>
    `
  },

  strategy_session: {
    subject: 'Your complimentary AI strategy session (limited spots)',
    getHtml: (recipient: string) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #10B981 0%, #059669 100%); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
          <h1 style="color: white; margin: 0; font-size: 28px;">🎁 Complimentary Strategy Session</h1>
        </div>

        <p style="font-size: 16px;">I'm doing something I rarely do...</p>

        <p><strong>This week only</strong>, I'm offering complimentary 15-minute AI strategy sessions to assessment completers.</p>

        <div style="background: #f8f9fa; padding: 25px; border-radius: 8px; border-left: 4px solid #10B981; margin: 25px 0;">
          <h3 style="margin-top: 0; color: #10B981;">Here's the deal:</h3>
          <ol style="margin: 10px 0; padding-left: 20px; font-size: 16px;">
            <li><strong>Complete your assessment</strong> → Get your score</li>
            <li><strong>Book a quick call</strong> → I'll personally review your results</li>
            <li><strong>Leave with 3 specific next steps</strong> for YOUR business</li>
          </ol>
        </div>

        <p style="background: #fff3cd; padding: 15px; border-radius: 8px; border: 1px solid #ffeaa7;">
          <strong>⚠️ No pitch. No sales pressure.</strong> Just actionable insights.
        </p>

        <div style="background: #fee2e2; padding: 20px; border-radius: 8px; border-left: 4px solid #ef4444; margin: 25px 0;">
          <p style="margin: 0; font-size: 16px;">I can only do <strong>20 of these</strong>, and we've already booked 12.</p>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <a href="https://www.lorenzodc.com/ai-assessment" style="background: linear-gradient(135deg, #10B981 0%, #059669 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block; font-size: 16px;">
            Complete Assessment + Book Session →
          </a>
        </div>

        <p style="text-align: center; color: #666;">Spots fill fast.</p>

        <p style="margin-top: 30px;">
          Best,<br>
          <strong>Lorenzo Daughtry-Chambers</strong>
        </p>

        <p style="font-size: 14px; color: #666; font-style: italic;">
          P.S. If you've already taken the assessment, just reply with "strategy call" and I'll send you my calendar.
        </p>

        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">

        <div style="text-align: center; color: #666; font-size: 14px;">
          <p>You're receiving this because you signed up at <a href="https://www.lorenzodc.com" style="color: #667eea;">lorenzodc.com</a></p>
        </div>
      </body>
      </html>
    `
  }
};

export async function POST(request: NextRequest) {
  try {
    const { template, recipients, name, subject, body } = await request.json();

    if (!recipients || recipients.length === 0) {
      return NextResponse.json(
        { error: 'No recipients provided' },
        { status: 400 }
      );
    }

    let emailSubject: string;
    let emailHtml: string;

    // Use pre-built template or custom email
    if (template && EMAIL_TEMPLATES[template as keyof typeof EMAIL_TEMPLATES]) {
      const selectedTemplate = EMAIL_TEMPLATES[template as keyof typeof EMAIL_TEMPLATES];
      emailSubject = selectedTemplate.subject;
      emailHtml = selectedTemplate.getHtml('');
    } else if (subject && body) {
      // Custom email
      emailSubject = subject;
      emailHtml = body;
    } else {
      return NextResponse.json(
        { error: 'Invalid template or missing email content' },
        { status: 400 }
      );
    }

    // Send emails in batches to avoid rate limits
    const batchSize = 50;
    let sentCount = 0;
    const errors: string[] = [];

    for (let i = 0; i < recipients.length; i += batchSize) {
      const batch = recipients.slice(i, i + batchSize);

      try {
        // Send individual emails (Resend allows batch sends but we'll do individual for personalization)
        const sendPromises = batch.map((email: string) =>
          resend.emails.send({
            from: 'Lorenzo DC <lorenzo@lorenzodc.com>',
            to: [email],
            subject: emailSubject,
            html: emailHtml
          })
        );

        await Promise.all(sendPromises);
        sentCount += batch.length;
      } catch (batchError) {
        console.error('Batch send error:', batchError);
        errors.push(`Failed to send batch ${i / batchSize + 1}`);
      }

      // Small delay between batches to avoid rate limiting
      if (i + batchSize < recipients.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    return NextResponse.json({
      message: 'Campaign sent successfully',
      sent_count: sentCount,
      total_recipients: recipients.length,
      errors: errors.length > 0 ? errors : undefined
    });

  } catch (error) {
    console.error('Send campaign error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
