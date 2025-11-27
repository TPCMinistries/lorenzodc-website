import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { supabaseAdmin } from '../../../lib/supabase/server';
import crypto from 'crypto';
import { calculateLeadScore, type LeadScoringData } from '../../../lib/lead-scoring';
import { generateNurtureSequence, type NurtureSequenceData } from '../../../lib/nurture-sequence';

const resend = new Resend(process.env.RESEND_API_KEY || "placeholder-resend-key");

// Industry-specific AI use cases and recommendations
const industryInsights: Record<string, { useCases: string[], resources: string, caseStudy: string }> = {
  'Technology / Software': {
    useCases: ['Automated code review & documentation', 'AI-powered customer support', 'Predictive analytics for product decisions'],
    resources: 'AI Integration Playbook for Tech Companies',
    caseStudy: 'How a SaaS company reduced support tickets by 60% with AI'
  },
  'Healthcare / Medical': {
    useCases: ['Patient intake automation', 'Medical documentation AI', 'Appointment scheduling optimization'],
    resources: 'HIPAA-Compliant AI Implementation Guide',
    caseStudy: 'How a medical practice saved 15 hours/week with AI workflows'
  },
  'Financial Services / Banking': {
    useCases: ['Automated compliance monitoring', 'Risk assessment AI', 'Customer onboarding automation'],
    resources: 'AI in Financial Services: Compliance & Efficiency',
    caseStudy: 'How a wealth management firm automated 80% of client reporting'
  },
  'Professional Services / Consulting': {
    useCases: ['Proposal generation AI', 'Research & analysis automation', 'Client communication optimization'],
    resources: 'AI Toolkit for Professional Services',
    caseStudy: 'How a consulting firm 3x\'d their proposal output with AI'
  },
  'Manufacturing / Industrial': {
    useCases: ['Predictive maintenance AI', 'Supply chain optimization', 'Quality control automation'],
    resources: 'Industry 4.0: AI Implementation Roadmap',
    caseStudy: 'How a manufacturer reduced downtime by 40% with predictive AI'
  },
  'Retail / E-commerce': {
    useCases: ['Personalized product recommendations', 'Inventory forecasting AI', 'Customer service chatbots'],
    resources: 'E-commerce AI Playbook',
    caseStudy: 'How an e-commerce brand increased AOV by 25% with AI personalization'
  },
  'Education / Training': {
    useCases: ['Personalized learning paths', 'Automated grading & feedback', 'Content creation AI'],
    resources: 'AI in Education: Implementation Guide',
    caseStudy: 'How an online course creator 5x\'d content production with AI'
  },
  'Ministry / Non-profit': {
    useCases: ['Donor communication automation', 'Event planning AI', 'Volunteer coordination'],
    resources: 'AI for Mission-Driven Organizations',
    caseStudy: 'How a ministry increased engagement 3x with AI-powered outreach'
  },
  'Other': {
    useCases: ['Process automation', 'Customer communication AI', 'Data analysis & insights'],
    resources: 'Universal AI Implementation Guide',
    caseStudy: 'How organizations are transforming with AI'
  }
};

// Challenge-specific solutions
const challengeSolutions: Record<string, { solution: string, firstStep: string, resource: string }> = {
  "Don't know where to start": {
    solution: 'Start with a focused AI audit of your highest-impact processes',
    firstStep: 'Identify 3 processes where you spend the most time on repetitive tasks',
    resource: 'AI Starter Kit: 5 Quick Wins for Any Business'
  },
  'Data is messy or scattered': {
    solution: 'Implement a data consolidation strategy before AI adoption',
    firstStep: 'Create an inventory of all your data sources and systems',
    resource: 'Data Readiness Checklist for AI Implementation'
  },
  'Team lacks AI skills': {
    solution: 'Start with no-code AI tools that require minimal technical knowledge',
    firstStep: 'Have each team member experiment with ChatGPT for one specific task',
    resource: 'AI Skills Bootcamp: From Zero to Productive in 2 Weeks'
  },
  'Hard to prove ROI': {
    solution: 'Focus on automating tasks with clear time/cost metrics first',
    firstStep: 'Track time spent on 3 repetitive tasks this week',
    resource: 'AI ROI Calculator & Business Case Template'
  },
  'Finding the right tools': {
    solution: 'Match tools to specific use cases rather than adopting platforms broadly',
    firstStep: 'List your top 5 pain points and research AI tools for each',
    resource: 'AI Tool Selection Guide: 50+ Tools Categorized by Use Case'
  },
  'Getting buy-in from leadership': {
    solution: 'Start with a small pilot project that shows quick wins',
    firstStep: 'Identify one process that leadership cares about and propose a 30-day AI pilot',
    resource: 'Executive AI Buy-In Presentation Template'
  }
};

// Timeline-specific recommendations
const timelineRecommendations: Record<string, { approach: string, focus: string }> = {
  'ASAP - within 30 days': {
    approach: 'Quick Win Implementation',
    focus: 'Focus on 1-2 immediate automation opportunities using existing AI tools'
  },
  'Next quarter (60-90 days)': {
    approach: 'Strategic Foundation',
    focus: 'Build proper AI infrastructure while implementing first use cases'
  },
  'Within 6 months': {
    approach: 'Comprehensive Transformation',
    focus: 'Develop full AI strategy with multiple implementation phases'
  },
  'Within a year': {
    approach: 'Long-term AI Roadmap',
    focus: 'Build organizational AI capabilities and culture systematically'
  },
  'Just exploring for now': {
    approach: 'Education & Discovery',
    focus: 'Learn about AI possibilities and identify future opportunities'
  }
};

// Analyze responses to personalize recommendations
function analyzeResponses(responses: any, scores: Record<string, number>, extraData: any) {
  const insights: string[] = [];
  let calendarPriority: 'high' | 'medium' | 'low' = 'medium';
  let recommendedService: string = '';

  // Get industry-specific insights
  const industry = extraData.industry || 'Other';
  const industryData = industryInsights[industry] || industryInsights['Other'];

  // Get challenge-specific solution
  const challenge = extraData.biggestChallenge || "Don't know where to start";
  const challengeData = challengeSolutions[challenge] || challengeSolutions["Don't know where to start"];

  // Get timeline recommendation
  const timeline = extraData.timeline || 'Within 6 months';
  const timelineData = timelineRecommendations[timeline] || timelineRecommendations['Within 6 months'];

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

  // Urgency check
  if (timeline === 'ASAP - within 30 days' || timeline === 'Next quarter (60-90 days)') {
    calendarPriority = 'high';
    insights.push(`Your ${timeline.toLowerCase()} timeline means we should connect soon`);
  }

  // Team size check for service recommendation
  const teamSize = extraData.teamSize || '';
  if (teamSize === '200+ employees' || teamSize === '51-200 employees') {
    if (!recommendedService) recommendedService = 'Full Implementation + Coaching ($35K-75K)';
    calendarPriority = 'high';
  }

  // Role check
  const role = extraData.role || '';
  if (role === 'Founder / CEO / Owner' || role === 'C-Suite Executive (CTO, COO, etc.)') {
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
    bookingUrl: 'https://calendly.com/lorenzo-theglobalenterprise/ai-strategy-call',
    industryData,
    challengeData,
    timelineData,
    industry,
    challenge,
    timeline,
    teamSize,
    role
  };
}

export async function POST(request: NextRequest) {
  try {
    const { email, name, industry, teamSize, role, biggestChallenge, timeline, responses, scores, timestamp } = await request.json();

    if (!email || !name || !scores) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Extra data from new questions
    const extraData = { industry, teamSize, role, biggestChallenge, timeline };

    // Analyze specific responses for personalization
    const responseAnalysis = analyzeResponses(responses, scores, extraData);

    // Save assessment to database
    const { data: assessmentData, error: dbError } = await supabaseAdmin
      .from('ai_assessments')
      .insert({
        email,
        name,
        company: industry, // Use industry as company identifier
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
          company: industry, // Use industry as company identifier
          role: role,
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
    const report = generateReport(scores, name, industry, email, responseAnalysis);

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

    // Schedule nurture sequence emails
    let nurtureScheduled = 0;
    try {
      const nurtureData: NurtureSequenceData = {
        email,
        name,
        industry: industry || 'Other',
        teamSize: teamSize || '',
        role: role || '',
        biggestChallenge: biggestChallenge || "Don't know where to start",
        timeline: timeline || 'Within 6 months',
        overallScore: scores.overall,
        scores: {
          current_state: scores.current_state,
          strategy_vision: scores.strategy_vision,
          team_capabilities: scores.team_capabilities,
          implementation: scores.implementation
        }
      };

      // Generate personalized nurture sequence
      const nurtureEmails = generateNurtureSequence(nurtureData);

      // Schedule the emails using Supabase function
      const { data: scheduleResult, error: scheduleError } = await supabaseAdmin
        .rpc('schedule_nurture_sequence', {
          p_email: email,
          p_name: name,
          p_assessment_id: assessmentData?.id || null,
          p_emails: JSON.stringify(nurtureEmails)
        });

      if (scheduleError) {
        console.error('Error scheduling nurture emails:', scheduleError);
        // Don't fail the request - initial email was sent successfully
      } else {
        nurtureScheduled = scheduleResult || nurtureEmails.length;
        console.log(`Scheduled ${nurtureScheduled} nurture emails for ${email}`);
      }
    } catch (nurtureError) {
      console.error('Error generating nurture sequence:', nurtureError);
      // Don't fail the request - initial email was sent successfully
    }

    return NextResponse.json({
      message: 'Assessment completed and results sent',
      assessmentId: assessmentData?.id,
      emailId: emailData?.id,
      nurtureEmailsScheduled: nurtureScheduled,
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

function generateReport(scores: Record<string, number>, name: string, company: string | undefined, email: string | undefined, analysis?: any) {
  const overallScore = scores.overall;
  const industryText = analysis?.industry ? ` in ${analysis.industry}` : '';

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
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">

      <!-- Header - Using solid color instead of gradient for email compatibility -->
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #667eea; border-radius: 10px; margin-bottom: 30px;">
        <tr>
          <td style="padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🎯 Your AI Readiness Report</h1>
            <p style="color: #f0f0f0; margin: 10px 0 0 0; font-size: 16px;">Personalized for ${name}${industryText}</p>
          </td>
        </tr>
      </table>

      <!-- Overall Score -->
      <table width="100%" cellpadding="0" cellspacing="0" style="background: #f8f9fa; border-radius: 12px; margin-bottom: 30px;">
        <tr>
          <td style="padding: 25px; text-align: center;">
            <div style="font-size: 48px; font-weight: bold; color: ${readinessColor}; margin-bottom: 10px;">
              ${overallScore}%
            </div>
            <h2 style="margin: 0; color: ${readinessColor}; font-size: 24px;">${readinessLevel}</h2>
            <p style="margin: 10px 0 0 0; font-size: 16px; color: #666;">${readinessDescription}</p>
          </td>
        </tr>
      </table>

      <!-- Detailed Scores - Using tables for email compatibility -->
      <div style="margin-bottom: 30px;">
        <h3 style="color: #333; margin-bottom: 20px;">📊 Your Detailed Scores</h3>

        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 15px;">
          <tr>
            <td style="font-weight: 500; padding-bottom: 5px;">Current AI State</td>
            <td style="color: #667eea; font-weight: bold; text-align: right; padding-bottom: 5px;">${scores.current_state}%</td>
          </tr>
          <tr>
            <td colspan="2" style="padding-bottom: 15px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background: #e2e8f0; height: 8px; border-radius: 4px;">
                <tr><td style="background: #667eea; width: ${scores.current_state}%; height: 8px; border-radius: 4px;"></td><td></td></tr>
              </table>
            </td>
          </tr>
        </table>

        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 15px;">
          <tr>
            <td style="font-weight: 500; padding-bottom: 5px;">Strategy & Vision</td>
            <td style="color: #667eea; font-weight: bold; text-align: right; padding-bottom: 5px;">${scores.strategy_vision}%</td>
          </tr>
          <tr>
            <td colspan="2" style="padding-bottom: 15px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background: #e2e8f0; height: 8px; border-radius: 4px;">
                <tr><td style="background: #667eea; width: ${scores.strategy_vision}%; height: 8px; border-radius: 4px;"></td><td></td></tr>
              </table>
            </td>
          </tr>
        </table>

        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 15px;">
          <tr>
            <td style="font-weight: 500; padding-bottom: 5px;">Team Capabilities</td>
            <td style="color: #667eea; font-weight: bold; text-align: right; padding-bottom: 5px;">${scores.team_capabilities}%</td>
          </tr>
          <tr>
            <td colspan="2" style="padding-bottom: 15px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background: #e2e8f0; height: 8px; border-radius: 4px;">
                <tr><td style="background: #667eea; width: ${scores.team_capabilities}%; height: 8px; border-radius: 4px;"></td><td></td></tr>
              </table>
            </td>
          </tr>
        </table>

        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 15px;">
          <tr>
            <td style="font-weight: 500; padding-bottom: 5px;">Implementation Readiness</td>
            <td style="color: #667eea; font-weight: bold; text-align: right; padding-bottom: 5px;">${scores.implementation}%</td>
          </tr>
          <tr>
            <td colspan="2" style="padding-bottom: 15px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background: #e2e8f0; height: 8px; border-radius: 4px;">
                <tr><td style="background: #667eea; width: ${scores.implementation}%; height: 8px; border-radius: 4px;"></td><td></td></tr>
              </table>
            </td>
          </tr>
        </table>
      </div>

      <!-- Next Steps -->
      <div style="background: #fff3cd; padding: 25px; border-radius: 8px; border: 1px solid #ffeaa7; margin-bottom: 25px;">
        <h3 style="margin-top: 0; color: #856404;">🚀 Your Next Steps (${timeframe})</h3>
        <ol style="margin: 0; padding-left: 20px;">
          ${nextSteps.map(step => `<li style="margin-bottom: 8px;">${step}</li>`).join('')}
        </ol>
      </div>

      ${analysis?.industryData ? `
      <!-- INDUSTRY-SPECIFIC AI USE CASES -->
      <div style="background: #f0fdf4; padding: 25px; border-radius: 8px; border-left: 4px solid #22c55e; margin: 25px 0;">
        <h3 style="margin-top: 0; color: #166534;">🏢 AI Opportunities for ${analysis.industry}</h3>
        <p style="margin: 10px 0; color: #166534;">Based on your industry, here are the highest-impact AI use cases:</p>
        <ul style="margin: 10px 0; padding-left: 20px;">
          ${analysis.industryData.useCases.map((useCase: string) => `<li style="margin-bottom: 8px; color: #15803d;"><strong>${useCase}</strong></li>`).join('')}
        </ul>
        <div style="background: white; padding: 15px; border-radius: 6px; margin-top: 15px;">
          <p style="margin: 0; font-size: 14px; color: #166534;">
            📖 <strong>Case Study:</strong> ${analysis.industryData.caseStudy}
          </p>
        </div>
      </div>
      ` : ''}

      ${analysis?.challengeData ? `
      <!-- YOUR BIGGEST CHALLENGE - SOLUTION -->
      <div style="background: #fef3c7; padding: 25px; border-radius: 8px; border-left: 4px solid #f59e0b; margin: 25px 0;">
        <h3 style="margin-top: 0; color: #92400e;">⚡ Solving: "${analysis.challenge}"</h3>
        <p style="margin: 10px 0; color: #92400e;">
          <strong>The Solution:</strong> ${analysis.challengeData.solution}
        </p>
        <div style="background: white; padding: 15px; border-radius: 6px; margin: 15px 0;">
          <p style="margin: 0 0 5px 0; font-size: 14px; color: #78350f;">
            <strong>🎯 Your First Step (This Week):</strong>
          </p>
          <p style="margin: 0; color: #92400e;">
            ${analysis.challengeData.firstStep}
          </p>
        </div>
        <p style="margin: 10px 0 0 0; font-size: 14px; color: #92400e;">
          📚 <strong>Free Resource:</strong> ${analysis.challengeData.resource}
        </p>
      </div>
      ` : ''}

      ${analysis?.timelineData ? `
      <!-- TIMELINE-BASED APPROACH -->
      <div style="background: #eff6ff; padding: 25px; border-radius: 8px; border-left: 4px solid #3b82f6; margin: 25px 0;">
        <h3 style="margin-top: 0; color: #1e40af;">📅 Your ${analysis.timeline} Plan</h3>
        <p style="margin: 10px 0;">
          <strong style="color: #1e40af;">Approach:</strong> <span style="color: #1e3a8a;">${analysis.timelineData.approach}</span>
        </p>
        <p style="margin: 10px 0; color: #1e3a8a;">
          <strong>Focus:</strong> ${analysis.timelineData.focus}
        </p>
      </div>
      ` : ''}

      ${analysis && analysis.insights.length > 0 ? `
      <!-- Personalized Insights -->
      <div style="background: #f0f9ff; padding: 25px; border-radius: 8px; border-left: 4px solid #0ea5e9; margin: 25px 0;">
        <h3 style="margin-top: 0; color: #0369a1;">💡 What I Noticed About Your Results</h3>
        <p style="margin: 10px 0;">Based on your specific answers, here's what stands out:</p>
        <ul style="margin: 10px 0; padding-left: 20px;">
          ${analysis.insights.map((insight: string) => `<li style="margin-bottom: 8px; color: #0c4a6e;">${insight}</li>`).join('')}
        </ul>
        ${analysis.calendarPriority === 'high' ? `
        <p style="margin: 15px 0 10px 0; font-weight: bold; color: #0369a1;">
          Based on where you are, I'd recommend we talk soon to create your specific roadmap.
        </p>
        ` : ''}
      </div>
      ` : ''}

      ${analysis ? `
      <!-- Calendar Booking - Using solid color for email compatibility -->
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #10b981; border-radius: 12px; margin: 30px 0;">
        <tr>
          <td style="padding: 30px; text-align: center;">
            <h3 style="color: white; margin: 0 0 10px 0; font-size: 24px;">📅 Let's Discuss Your Strategy</h3>
            <p style="color: #d1fae5; margin: 0 0 20px 0; font-size: 16px;">
              15-minute complimentary call to review your results
            </p>
            <p style="color: white; margin: 0 0 25px 0; font-size: 14px;">
              Recommended: <strong>${analysis.recommendedService}</strong>
            </p>
            <a href="${analysis.bookingUrl}?name=${encodeURIComponent(name)}&email=${encodeURIComponent(email || '')}&score=${overallScore}"
               style="background: white; color: #059669; padding: 15px 35px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; font-size: 18px;">
              📅 Book Your Strategy Call Now →
            </a>
            <p style="color: #d1fae5; margin: 20px 0 0 0; font-size: 13px;">
              ${analysis.calendarPriority === 'high' ? '⚡ High-priority based on your assessment results' : 'No obligation • Just actionable insights'}
            </p>
          </td>
        </tr>
      </table>
      ` : ''}

      <!-- Call to Action - Using solid colors for email compatibility -->
      <div style="text-align: center; margin: 30px 0;">
        <h3 style="color: #333; margin-bottom: 15px;">Ready to accelerate your AI journey?</h3>
        <a href="https://www.lorenzodc.com/chat" style="background-color: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block; margin: 5px;">
          Get AI Strategy Guidance →
        </a>
        <br><br>
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