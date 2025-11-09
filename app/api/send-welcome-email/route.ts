import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { email, leadMagnet, source } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Welcome email with AI Readiness Checklist
    const { data, error } = await resend.emails.send({
      from: 'Lorenzo DC <lorenzo@lorenzodc.com>',
      to: [email],
      subject: '🎯 Your AI Readiness Checklist is Here!',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Your AI Readiness Checklist</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🚀 Welcome to The Catalyst Path</h1>
            <p style="color: #f0f0f0; margin: 10px 0 0 0; font-size: 16px;">Your AI Strategy Journey Starts Now</p>
          </div>

          <h2 style="color: #333; margin-bottom: 20px;">Hi there! 👋</h2>

          <p>Thanks for joining The Catalyst Path! You've just taken the first step toward transforming your business with AI.</p>

          <div style="background: #f8f9fa; padding: 25px; border-radius: 8px; border-left: 4px solid #667eea; margin: 25px 0;">
            <h3 style="margin-top: 0; color: #667eea;">🎯 Your AI Readiness Checklist</h3>
            <p><strong>Here's what 500+ leaders use to evaluate their AI strategy:</strong></p>

            <div style="margin: 20px 0;">
              <h4>📊 Strategic Assessment:</h4>
              <ul>
                <li>Current process identification</li>
                <li>ROI calculation framework</li>
                <li>Risk assessment matrix</li>
                <li>Implementation timeline</li>
              </ul>
            </div>

            <div style="margin: 20px 0;">
              <h4>🛠️ Technical Readiness:</h4>
              <ul>
                <li>Data quality audit</li>
                <li>Infrastructure requirements</li>
                <li>Integration checkpoints</li>
                <li>Security protocols</li>
              </ul>
            </div>

            <div style="margin: 20px 0;">
              <h4>👥 Team Preparation:</h4>
              <ul>
                <li>Skills gap analysis</li>
                <li>Training requirements</li>
                <li>Change management plan</li>
                <li>Success metrics</li>
              </ul>
            </div>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="https://www.lorenzodc.com/ai-assessment" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
              Take Your Full AI Assessment →
            </a>
          </div>

          <div style="background: #fff3cd; padding: 20px; border-radius: 8px; border: 1px solid #ffeaa7; margin: 25px 0;">
            <h4 style="margin-top: 0; color: #856404;">💡 Next Steps:</h4>
            <ol>
              <li><strong>Review the checklist above</strong> - Rate your organization 1-10 in each area</li>
              <li><strong>Take the full assessment</strong> - Get your personalized AI strategy report</li>
              <li><strong>Book a strategy call</strong> - Let's discuss your specific opportunities</li>
            </ol>
          </div>

          <p>I'm here to help you navigate your AI transformation. Hit reply anytime with questions!</p>

          <p style="margin-top: 30px;">
            Best,<br>
            <strong>Lorenzo Daughtry-Chambers</strong><br>
            <em>AI Strategy & Innovation</em>
          </p>

          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">

          <div style="text-align: center; color: #666; font-size: 14px;">
            <p>You're receiving this because you signed up at <a href="https://www.lorenzodc.com" style="color: #667eea;">lorenzodc.com</a></p>
            <p>
              <a href="https://www.lorenzodc.com/chat" style="color: #667eea; text-decoration: none;">AI Chat</a> |
              <a href="https://www.lorenzodc.com/ai-assessment" style="color: #667eea; text-decoration: none;">Assessment</a> |
              <a href="https://www.lorenzodc.com/contact" style="color: #667eea; text-decoration: none;">Contact</a>
            </p>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Welcome email sent successfully',
      emailId: data?.id
    });

  } catch (error) {
    console.error('Welcome email error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}