import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { supabaseAdmin } from '../../../lib/supabase/server';
import crypto from 'crypto';
import { calculateLeadScore, type LeadScoringData } from '../../../lib/lead-scoring';

const resend = new Resend(process.env.RESEND_API_KEY || "placeholder-resend-key");

// Analyze responses to personalize recommendations
function analyzeResponses(responses: any, scores: Record<string, number>) {
  const insights: string[] = [];
  let calendarPriority: 'high' | 'medium' | 'low' = 'medium';
  let recommendedService: string = '';

  // Check AI usage level
  if (responses.ai_usage === 'No AI tools in use') {
    insights.push("You're starting from scratch - perfect time to build a solid foundation");
    recommendedService = 'AI Strategy Intensive ($5K-7K)';
    calendarPriority = 'high';
  } else if (responses.ai_usage === 'AI is central to our operations') {
    insights.push("You're already advanced - let's optimize and scale what's working");
    recommendedService = 'Monthly Retainer ($5K-10K/mo)';
    calendarPriority = 'high';
  }

  // Check if scores are uneven (indicates specific gaps)
  const scoreValues = [scores.current_state, scores.strategy_vision, scores.team_capabilities, scores.implementation];
  const maxScore = Math.max(...scoreValues);
  const minScore = Math.min(...scoreValues);

  if (maxScore - minScore > 30) {
    insights.push("Your scores show significant gaps between areas - we should address this");
    calendarPriority = 'high';
  }

  // Low strategy score = needs roadmap
  if (scores.strategy_vision < 50) {
    insights.push("Strategy & vision is your biggest opportunity for improvement");
    if (!recommendedService) recommendedService = 'AI Strategy Intensive ($5K-7K)';
  }

  // High overall but low implementation = ready to act
  if (scores.overall >= 60 && scores.implementation < 60) {
    insights.push("You're ready strategically but need help with execution");
    if (!recommendedService) recommendedService = '90-Day Implementation Partner ($15K-25K)';
    calendarPriority = 'high';
  }

  // Low overall = needs foundations
  if (scores.overall < 40) {
    if (!recommendedService) recommendedService = 'AI Strategy Intensive ($5K-7K)';
  }

  // High overall = needs scaling
  if (scores.overall >= 70) {
    insights.push("You're ahead of most companies - time to accelerate");
    if (!recommendedService) recommendedService = 'Full Implementation + Coaching ($35K-75K)';
    calendarPriority = 'high';
  }

  return {
    insights,
    calendarPriority,
    recommendedService: recommendedService || '90-Day Implementation Partner ($15K-25K)',
    bookingUrl: 'https://calendly.com/lorenzo-dc/ai-strategy-call' // Replace with your actual Calendly link
  };
}

export async function POST(request: NextRequest) {
  try {
    const { email, name, company, responses, scores, timestamp } = await request.json();

    if (!email || !name || !scores) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Analyze specific responses for personalization
    const responseAnalysis = analyzeResponses(responses, scores);

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

    // Calculate and save lead score
    try {
      const leadScoringData: LeadScoringData = {
        assessmentCompleted: true,
        overallScore: scores.overall,
        scoreBreakdown: {
          current_state: scores.current_state,
          strategy_vision: scores.strategy_vision,
          team_capabilities: scores.team_capabilities,
          implementation: scores.implementation
        },
        daysSinceSignup: 0, // Just completed
        daysSinceAssessment: 0
      };

      const leadScore = calculateLeadScore(leadScoringData);

      // Save to prospect_profiles table
      await supabaseAdmin
        .from('prospect_profiles')
        .upsert({
          email,
          name,
          company,
          lead_score: leadScore.points,
          tier: getTierFromPriority(leadScore.priority),
          status: getStatusFromScore(leadScore.score),
          category: 'enterprise_ai',
          source: 'ai_assessment',
          assessment_data: { responses, scores },
          last_engagement_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'email',
          ignoreDuplicates: false
        });

      // Record scoring history
      const { data: prospectData } = await supabaseAdmin
        .from('prospect_profiles')
        .select('id')
        .eq('email', email)
        .single();

      if (prospectData) {
        await supabaseAdmin
          .from('lead_scoring_history')
          .insert({
            prospect_id: prospectData.id,
            score_change: leadScore.points,
            new_total_score: leadScore.points,
            reason: `Assessment completed: ${leadScore.score.toUpperCase()} lead (${leadScore.points} points)`,
            source_event: 'assessment_completed',
            event_data: {
              tags: leadScore.tags,
              priority: leadScore.priority,
              recommendedAction: leadScore.recommendedAction
            }
          });
      }

      console.log('Lead score calculated:', leadScore);
    } catch (error) {
      console.error('Error calculating lead score:', error);
      // Continue even if lead scoring fails
    }

    // Generate personalized report
    // NOTE: We do NOT create Supabase user accounts for assessment takers
    // Only admins need Supabase accounts. Assessment takers are just leads in prospect_profiles table.
    const report = generateReport(scores, name, company, email, responseAnalysis);

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
      scores
    });

  } catch (error) {
    console.error('Assessment results error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function generateReport(scores: Record<string, number>, name: string, company: string | undefined, email: string | undefined, analysis?: { insights: string[], calendarPriority: string, recommendedService: string, bookingUrl: string }) {
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

      ${analysis && analysis.insights.length > 0 ? `
      <!-- Personalized Insights -->
      <div style="background: #f0f9ff; padding: 25px; border-radius: 8px; border-left: 4px solid #0ea5e9; margin: 25px 0;">
        <h3 style="margin-top: 0; color: #0369a1;">💡 What I Noticed About Your Results</h3>
        <p style="margin: 10px 0;">Based on your specific answers, here's what stands out:</p>
        <ul style="margin: 10px 0; padding-left: 20px;">
          ${analysis.insights.map(insight => `<li style="margin-bottom: 8px; color: #0c4a6e;">${insight}</li>`).join('')}
        </ul>
        ${analysis.calendarPriority === 'high' ? `
        <p style="margin: 15px 0 10px 0; font-weight: bold; color: #0369a1;">
          Based on where you are, I'd recommend we talk soon to create your specific roadmap.
        </p>
        ` : ''}
      </div>
      ` : ''}

      ${analysis ? `
      <!-- Calendar Booking (Automated!) -->
      <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; border-radius: 12px; text-align: center; margin: 30px 0;">
        <h3 style="color: white; margin: 0 0 10px 0; font-size: 24px;">📅 Let's Discuss Your Strategy</h3>
        <p style="color: #d1fae5; margin: 0 0 20px 0; font-size: 16px;">
          15-minute complimentary call to review your results
        </p>
        <p style="color: white; margin: 0 0 25px 0; font-size: 14px;">
          Recommended: <strong>${analysis.recommendedService}</strong>
        </p>
        <a href="${analysis.bookingUrl}?name=${encodeURIComponent(name)}&email=${encodeURIComponent(email || '')}&score=${overallScore}"
           style="background: white; color: #059669; padding: 15px 35px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; font-size: 18px; box-shadow: 0 4px 6px rgba(0,0,0,0.2);">
          📅 Book Your Strategy Call Now →
        </a>
        <p style="color: #d1fae5; margin: 20px 0 0 0; font-size: 13px;">
          ${analysis.calendarPriority === 'high' ? '⚡ High-priority based on your assessment results' : 'No obligation • Just actionable insights'}
        </p>
      </div>
      ` : ''}

      <!-- Call to Action -->
      <div style="text-align: center; margin: 30px 0;">
        <h3 style="color: #333; margin-bottom: 15px;">Ready to accelerate your AI journey?</h3>
        <a href="https://www.lorenzodc.com/chat" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block; margin: 5px;">
          Get AI Strategy Guidance →
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

// Helper functions for lead scoring integration
function getTierFromPriority(priority: number): string {
  if (priority >= 5) return 'tier_1';
  if (priority >= 4) return 'tier_2';
  if (priority >= 3) return 'tier_3';
  return 'tier_4';
}

function getStatusFromScore(score: 'hot' | 'warm' | 'cold'): string {
  switch (score) {
    case 'hot': return 'opportunity';
    case 'warm': return 'qualified';
    case 'cold': return 'nurturing';
    default: return 'new';
  }
}