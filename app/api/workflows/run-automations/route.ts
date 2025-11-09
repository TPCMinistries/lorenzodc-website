import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../lib/supabase/server';

/**
 * Run automated email workflows
 * This should be triggered by a cron job (e.g., Vercel Cron or GitHub Actions)
 * GET /api/workflows/run-automations?key=YOUR_SECRET_KEY
 */
export async function GET(request: NextRequest) {
  try {
    // Simple authentication via query parameter
    const { searchParams } = new URL(request.url);
    const apiKey = searchParams.get('key');

    if (apiKey !== process.env.WORKFLOW_SECRET_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const results = {
      welcome_sequence: 0,
      assessment_followup: 0,
      noncompleter_reengagement: 0,
      cold_reactivation: 0
    };

    // 1. Welcome Sequence - Day 3 reminder
    // Find newsletter signups who haven't completed assessment after 3 days
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    const { data: newsletterSignups } = await supabaseAdmin
      .from('newsletter_signups')
      .select('email, name, created_at')
      .lte('created_at', threeDaysAgo.toISOString());

    if (newsletterSignups) {
      for (const signup of newsletterSignups) {
        // Check if they completed assessment
        const { data: assessment } = await supabaseAdmin
          .from('ai_assessments')
          .select('id')
          .eq('email', signup.email)
          .single();

        if (!assessment) {
          // Check if we already sent this email
          const { data: existingEvent } = await supabaseAdmin
            .from('email_automation_events')
            .select('id')
            .eq('prospect_id', (await getProspectId(signup.email)))
            .eq('campaign_name', 'Welcome Sequence')
            .eq('event_data->>email_index', '1')
            .single();

          if (!existingEvent) {
            // Send day 3 reminder
            await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/email-automation/send-sequence`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                sequenceId: 'welcome_sequence',
                email: signup.email,
                emailIndex: 1, // Day 3 email
                templateData: {
                  name: signup.name || 'there'
                }
              })
            });
            results.welcome_sequence++;
          }
        }
      }
    }

    // 2. Welcome Sequence - Day 7 last chance
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const { data: oldSignups } = await supabaseAdmin
      .from('newsletter_signups')
      .select('email, name')
      .lte('created_at', sevenDaysAgo.toISOString());

    if (oldSignups) {
      for (const signup of oldSignups) {
        const { data: assessment } = await supabaseAdmin
          .from('ai_assessments')
          .select('id')
          .eq('email', signup.email)
          .single();

        if (!assessment) {
          const { data: existingEvent } = await supabaseAdmin
            .from('email_automation_events')
            .select('id')
            .eq('prospect_id', (await getProspectId(signup.email)))
            .eq('campaign_name', 'Welcome Sequence')
            .eq('event_data->>email_index', '2')
            .single();

          if (!existingEvent) {
            await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/email-automation/send-sequence`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                sequenceId: 'welcome_sequence',
                email: signup.email,
                emailIndex: 2, // Day 7 email
                templateData: {
                  name: signup.name || 'there'
                }
              })
            });
            results.welcome_sequence++;
          }
        }
      }
    }

    // 3. Assessment Follow-up - Day 1 personal review
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);

    const { data: recentAssessments } = await supabaseAdmin
      .from('ai_assessments')
      .select('*')
      .gte('created_at', oneDayAgo.toISOString())
      .lte('created_at', new Date().toISOString());

    if (recentAssessments) {
      for (const assessment of recentAssessments) {
        // Check if they booked a call (would be in booking_events table)
        const { data: booking } = await supabaseAdmin
          .from('booking_events')
          .select('id')
          .eq('prospect_id', (await getProspectId(assessment.email)))
          .single();

        if (!booking) {
          const { data: existingEvent } = await supabaseAdmin
            .from('email_automation_events')
            .select('id')
            .eq('prospect_id', (await getProspectId(assessment.email)))
            .eq('campaign_name', 'Assessment Follow-up')
            .eq('event_data->>email_index', '0')
            .single();

          if (!existingEvent) {
            await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/email-automation/send-sequence`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                sequenceId: 'assessment_followup',
                email: assessment.email,
                emailIndex: 0,
                templateData: {
                  name: assessment.name || 'there',
                  score: assessment.overall_score?.toString() || '0',
                  email: assessment.email,
                  personalized_insights: generateInsights(assessment),
                  recommendation_1: 'Start with quick wins in automation',
                  recommendation_2: 'Build an AI strategy roadmap',
                  recommendation_3: 'Train your team on AI fundamentals',
                  video_link: 'https://www.lorenzodc.com/videos/assessment-breakdown'
                }
              })
            });
            results.assessment_followup++;
          }
        }
      }
    }

    // 4. Assessment Follow-up - Day 4 case study
    const fourDaysAgo = new Date();
    fourDaysAgo.setDate(fourDaysAgo.getDate() - 4);

    const { data: olderAssessments } = await supabaseAdmin
      .from('ai_assessments')
      .select('*')
      .lte('created_at', fourDaysAgo.toISOString());

    if (olderAssessments) {
      for (const assessment of olderAssessments) {
        const { data: booking } = await supabaseAdmin
          .from('booking_events')
          .select('id')
          .eq('prospect_id', (await getProspectId(assessment.email)))
          .single();

        if (!booking) {
          const { data: existingEvent } = await supabaseAdmin
            .from('email_automation_events')
            .select('id')
            .eq('prospect_id', (await getProspectId(assessment.email)))
            .eq('campaign_name', 'Assessment Follow-up')
            .eq('event_data->>email_index', '1')
            .single();

          if (!existingEvent) {
            await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/email-automation/send-sequence`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                sequenceId: 'assessment_followup',
                email: assessment.email,
                emailIndex: 1,
                templateData: {
                  name: assessment.name || 'there',
                  score: assessment.overall_score?.toString() || '0'
                }
              })
            });
            results.assessment_followup++;
          }
        }
      }
    }

    // 5. Non-Completer Re-engagement - 14 days
    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

    const { data: inactiveSignups } = await supabaseAdmin
      .from('newsletter_signups')
      .select('email, name')
      .lte('created_at', fourteenDaysAgo.toISOString());

    if (inactiveSignups) {
      for (const signup of inactiveSignups) {
        const { data: assessment } = await supabaseAdmin
          .from('ai_assessments')
          .select('id')
          .eq('email', signup.email)
          .single();

        if (!assessment) {
          const { data: existingEvent } = await supabaseAdmin
            .from('email_automation_events')
            .select('id')
            .eq('prospect_id', (await getProspectId(signup.email)))
            .eq('campaign_name', 'Non-Completer Re-engagement')
            .single();

          if (!existingEvent) {
            await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/email-automation/send-sequence`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                sequenceId: 'noncompleter_reengagement',
                email: signup.email,
                emailIndex: 0,
                templateData: {
                  name: signup.name || 'there'
                }
              })
            });
            results.noncompleter_reengagement++;
          }
        }
      }
    }

    // 6. Cold Lead Reactivation - 60 days inactive
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    const { data: coldProspects } = await supabaseAdmin
      .from('prospect_profiles')
      .select('email, name')
      .lte('last_engagement_at', sixtyDaysAgo.toISOString())
      .neq('status', 'closed');

    if (coldProspects) {
      for (const prospect of coldProspects) {
        const { data: existingEvent } = await supabaseAdmin
          .from('email_automation_events')
          .select('id')
          .eq('prospect_id', (await getProspectId(prospect.email)))
          .eq('campaign_name', 'Cold Lead Reactivation')
          .gte('created_at', sixtyDaysAgo.toISOString())
          .single();

        if (!existingEvent) {
          await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/email-automation/send-sequence`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              sequenceId: 'cold_reactivation',
              email: prospect.email,
              emailIndex: 0,
              templateData: {
                name: prospect.name || 'there',
                email: prospect.email
              }
            })
          });
          results.cold_reactivation++;
        }
      }
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      results
    });

  } catch (error) {
    console.error('Workflow automation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper function to get prospect ID by email
async function getProspectId(email: string): Promise<string | null> {
  const { data } = await supabaseAdmin
    .from('prospect_profiles')
    .select('id')
    .eq('email', email)
    .single();

  return data?.id || null;
}

// Helper function to generate personalized insights
function generateInsights(assessment: any): string {
  const insights = [];
  const scores = assessment.scores || {};

  if (scores.strategy_vision < 50) {
    insights.push('<li>Your strategy score suggests you need a clearer AI roadmap</li>');
  }

  if (scores.implementation < 50) {
    insights.push('<li>Implementation readiness is your biggest opportunity</li>');
  }

  if (scores.team_capabilities < 50) {
    insights.push('<li>Team training would unlock significant value</li>');
  }

  const scoreValues = [
    scores.current_state || 0,
    scores.strategy_vision || 0,
    scores.team_capabilities || 0,
    scores.implementation || 0
  ];
  const maxScore = Math.max(...scoreValues);
  const minScore = Math.min(...scoreValues);

  if (maxScore - minScore > 30) {
    insights.push('<li>Your scores show gaps between areas - we should address this</li>');
  }

  return insights.length > 0
    ? `<ul>${insights.join('')}</ul>`
    : '<p>Your scores are well-balanced. Let\'s focus on scaling what\'s working.</p>';
}
