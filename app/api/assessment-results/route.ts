import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { supabaseAdmin } from '../../../lib/supabase/server';
import crypto from 'crypto';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { email, name, company, responses, scores, timestamp } = await request.json();

    if (!email || !name || !scores) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Save assessment to database
    const { data: assessmentData, error: dbError } = await supabaseAdmin
      .from('ai_assessments')
      .insert({
        email,
        name,
        company,
        responses,
        scores,
        overall_score: scores.overall,
        created_at: timestamp
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      // Continue with email even if database fails
    }

    // Create user account automatically for assessment completers
    let userCreated = false;
    let tempPassword = '';
    try {
      // Generate a secure temporary password
      tempPassword = crypto.randomBytes(12).toString('base64').slice(0, 12);

      // Create the user account
      const { data: userData, error: userError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password: tempPassword,
        email_confirm: true, // Auto-confirm email for assessment users
        user_metadata: {
          name,
          company,
          source: 'ai_assessment',
          assessment_completed: true,
          assessment_score: scores.overall
        }
      });

      if (!userError && userData.user) {
        userCreated = true;
        console.log('User account created for assessment completer:', email);
      } else {
        console.log('User might already exist, continuing:', userError?.message);
      }
    } catch (error) {
      console.error('Error creating user account:', error);
      // Continue with email even if user creation fails
    }

    // Generate personalized report
    const report = generateReport(scores, name, company, userCreated, tempPassword, email);

    // Send results email
    const { data: emailData, error: emailError } = await resend.emails.send({
      from: 'Lorenzo DC <lorenzo@lorenzodc.com>',
      to: [email],
      subject: `🎯 ${name}, Your AI Readiness Report is Ready!`,
      html: report.html,
    });

    if (emailError) {
      console.error('Email error:', emailError);
      return NextResponse.json(
        { error: 'Failed to send results email' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Assessment completed and results sent',
      assessmentId: assessmentData?.id,
      emailId: emailData?.id,
      scores,
      userCreated,
      loginEmail: userCreated ? email : null
    });

  } catch (error) {
    console.error('Assessment results error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function generateReport(scores: Record<string, number>, name: string, company?: string, userCreated?: boolean, tempPassword?: string, email?: string) {
  const overallScore = scores.overall;
  const companyText = company ? ` at ${company}` : '';

  // Determine readiness level
  let readinessLevel = '';
  let readinessColor = '';
  let readinessDescription = '';
  let nextSteps: string[] = [];
  let timeframe = '';

  if (overallScore >= 80) {
    readinessLevel = 'AI-Ready Leader';
    readinessColor = '#10B981'; // green
    readinessDescription = 'You\'re in the top 10% of organizations. You\'re ready for advanced AI implementations.';
    timeframe = '30-60 days';
    nextSteps = [
      'Start with high-impact pilot projects',
      'Implement AI governance framework',
      'Scale successful pilots across organization',
      'Consider AI-first strategic initiatives'
    ];
  } else if (overallScore >= 60) {
    readinessLevel = 'AI-Ready Implementer';
    readinessColor = '#3B82F6'; // blue
    readinessDescription = 'You have solid foundations. Ready for strategic AI implementation.';
    timeframe = '60-90 days';
    nextSteps = [
      'Define clear AI strategy and ROI metrics',
      'Launch 2-3 focused pilot projects',
      'Invest in team training and capabilities',
      'Establish data quality processes'
    ];
  } else if (overallScore >= 40) {
    readinessLevel = 'AI Explorer';
    readinessColor = '#F59E0B'; // yellow
    readinessDescription = 'You\'re making progress but need more preparation before major AI initiatives.';
    timeframe = '90-120 days';
    nextSteps = [
      'Strengthen data organization and quality',
      'Upskill team with AI literacy training',
      'Start with simple automation tools',
      'Develop internal AI champion network'
    ];
  } else {
    readinessLevel = 'AI Beginner';
    readinessColor = '#EF4444'; // red
    readinessDescription = 'You\'re at the beginning of your AI journey. Focus on building foundations.';
    timeframe = '4-6 months';
    nextSteps = [
      'Begin with AI education and awareness',
      'Audit and organize your data assets',
      'Experiment with basic AI tools (ChatGPT, etc.)',
      'Create change management strategy'
    ];
  }

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Your AI Readiness Report</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">

      <!-- Header -->
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
        <h1 style="color: white; margin: 0; font-size: 28px;">🎯 Your AI Readiness Report</h1>
        <p style="color: #f0f0f0; margin: 10px 0 0 0; font-size: 16px;">Personalized for ${name}${companyText}</p>
      </div>

      <!-- Overall Score -->
      <div style="text-align: center; background: #f8f9fa; padding: 25px; border-radius: 12px; margin-bottom: 30px;">
        <div style="font-size: 48px; font-weight: bold; color: ${readinessColor}; margin-bottom: 10px;">
          ${overallScore}%
        </div>
        <h2 style="margin: 0; color: ${readinessColor}; font-size: 24px;">${readinessLevel}</h2>
        <p style="margin: 10px 0 0 0; font-size: 16px; color: #666;">${readinessDescription}</p>
      </div>

      <!-- Detailed Scores -->
      <div style="margin-bottom: 30px;">
        <h3 style="color: #333; margin-bottom: 20px;">📊 Your Detailed Scores</h3>

        <div style="margin-bottom: 15px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
            <span style="font-weight: 500;">Current AI State</span>
            <span style="color: #667eea; font-weight: bold;">${scores.current_state}%</span>
          </div>
          <div style="background: #e2e8f0; height: 8px; border-radius: 4px;">
            <div style="background: #667eea; height: 8px; border-radius: 4px; width: ${scores.current_state}%;"></div>
          </div>
        </div>

        <div style="margin-bottom: 15px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
            <span style="font-weight: 500;">Strategy & Vision</span>
            <span style="color: #667eea; font-weight: bold;">${scores.strategy_vision}%</span>
          </div>
          <div style="background: #e2e8f0; height: 8px; border-radius: 4px;">
            <div style="background: #667eea; height: 8px; border-radius: 4px; width: ${scores.strategy_vision}%;"></div>
          </div>
        </div>

        <div style="margin-bottom: 15px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
            <span style="font-weight: 500;">Team Capabilities</span>
            <span style="color: #667eea; font-weight: bold;">${scores.team_capabilities}%</span>
          </div>
          <div style="background: #e2e8f0; height: 8px; border-radius: 4px;">
            <div style="background: #667eea; height: 8px; border-radius: 4px; width: ${scores.team_capabilities}%;"></div>
          </div>
        </div>

        <div style="margin-bottom: 15px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
            <span style="font-weight: 500;">Implementation Readiness</span>
            <span style="color: #667eea; font-weight: bold;">${scores.implementation}%</span>
          </div>
          <div style="background: #e2e8f0; height: 8px; border-radius: 4px;">
            <div style="background: #667eea; height: 8px; border-radius: 4px; width: ${scores.implementation}%;"></div>
          </div>
        </div>
      </div>

      <!-- Next Steps -->
      <div style="background: #fff3cd; padding: 25px; border-radius: 8px; border: 1px solid #ffeaa7; margin-bottom: 25px;">
        <h3 style="margin-top: 0; color: #856404;">🚀 Your Next Steps (${timeframe})</h3>
        <ol style="margin: 0; padding-left: 20px;">
          ${nextSteps.map(step => `<li style="margin-bottom: 8px;">${step}</li>`).join('')}
        </ol>
      </div>

      ${userCreated && tempPassword ? `
      <!-- Login Credentials -->
      <div style="background: #e7f3ff; padding: 25px; border-radius: 8px; border-left: 4px solid #3b82f6; margin: 25px 0;">
        <h3 style="margin-top: 0; color: #1e40af;">🎉 Your AI Chat Account is Ready!</h3>
        <p style="margin: 10px 0; font-weight: bold;">We've created your personal AI chat account so you can get instant strategy guidance:</p>
        <div style="background: white; padding: 15px; border-radius: 5px; margin: 15px 0; border: 1px solid #3b82f6;">
          <p style="margin: 5px 0;"><strong>Login Email:</strong> ${email}</p>
          <p style="margin: 5px 0;"><strong>Temporary Password:</strong> ${tempPassword}</p>
        </div>
        <p style="margin: 10px 0; font-size: 14px; color: #666;">
          <em>Please change your password after your first login for security.</em>
        </p>
      </div>
      ` : ''}

      <!-- Call to Action -->
      <div style="text-align: center; margin: 30px 0;">
        <h3 style="color: #333; margin-bottom: 15px;">Ready to accelerate your AI journey?</h3>
        <a href="https://www.lorenzodc.com/chat" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block; margin: 5px;">
          ${userCreated ? 'Access Your AI Chat →' : 'Get AI Strategy Guidance →'}
        </a>
        <br>
        <a href="https://www.lorenzodc.com/contact" style="background: #f8f9fa; color: #667eea; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block; margin: 5px; border: 2px solid #667eea;">
          Book Strategy Call →
        </a>
      </div>

      <!-- Benchmark -->
      <div style="background: #e7f3ff; padding: 20px; border-radius: 8px; border-left: 4px solid #3b82f6; margin: 25px 0;">
        <h4 style="margin-top: 0; color: #1e40af;">📈 Understanding Your Score</h4>
        <p style="margin: 0;">AI Readiness benchmarks:</p>
        <ul style="margin: 10px 0; padding-left: 20px;">
          <li>Beginner: Below 40%</li>
          <li>Explorer: 40-59%</li>
          <li>Implementer: 60-79%</li>
          <li>AI Leader: 80%+</li>
          <li><strong>Your score: ${overallScore}%</strong></li>
        </ul>
      </div>

      <p style="margin-top: 30px;">
        Questions about your results? Hit reply - I personally read every response.
      </p>

      <p>
        Best,<br>
        <strong>Lorenzo Daughtry-Chambers</strong><br>
        <em>AI Strategy & Innovation</em>
      </p>

      <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">

      <div style="text-align: center; color: #666; font-size: 14px;">
        <p>This assessment was completed at <a href="https://www.lorenzodc.com" style="color: #667eea;">lorenzodc.com</a></p>
        <p>
          <a href="https://www.lorenzodc.com/chat" style="color: #667eea; text-decoration: none;">AI Chat</a> |
          <a href="https://www.lorenzodc.com/contact" style="color: #667eea; text-decoration: none;">Contact</a> |
          <a href="https://www.lorenzodc.com" style="color: #667eea; text-decoration: none;">Website</a>
        </p>
      </div>
    </body>
    </html>
  `;

  return { html };
}