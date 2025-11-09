import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../lib/supabase/server';
import { calculateLeadScore, type LeadScoringData } from '../../../../lib/lead-scoring';

/**
 * Update lead score based on assessment and engagement data
 * POST /api/lead-scoring/update
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, scoringData } = body as { email: string; scoringData: LeadScoringData };

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Calculate lead score
    const scoreResult = calculateLeadScore(scoringData);

    // Upsert prospect profile with lead scoring data
    const { data: prospect, error: upsertError } = await supabaseAdmin
      .from('prospect_profiles')
      .upsert({
        email,
        lead_score: scoreResult.points,
        tier: getTierFromPriority(scoreResult.priority),
        status: getStatusFromScore(scoreResult.score),
        last_engagement_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'email',
        ignoreDuplicates: false
      })
      .select()
      .single();

    if (upsertError) {
      console.error('Error upserting prospect:', upsertError);
      return NextResponse.json({ error: 'Failed to update lead score' }, { status: 500 });
    }

    // Record scoring event in history
    const { error: historyError } = await supabaseAdmin
      .from('lead_scoring_history')
      .insert({
        prospect_id: prospect.id,
        score_change: scoreResult.points,
        new_total_score: scoreResult.points,
        reason: scoreResult.recommendedAction,
        source_event: scoringData.assessmentCompleted ? 'assessment_completed' : 'engagement_update',
        event_data: {
          tags: scoreResult.tags,
          priority: scoreResult.priority,
          score: scoreResult.score
        }
      });

    if (historyError) {
      console.error('Error recording score history:', historyError);
      // Continue even if history fails
    }

    return NextResponse.json({
      success: true,
      prospect_id: prospect.id,
      scoreResult
    });

  } catch (error) {
    console.error('Lead scoring error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Get lead score for a prospect
 * GET /api/lead-scoring/update?email=user@example.com
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Get prospect
    const { data: prospect, error } = await supabaseAdmin
      .from('prospect_profiles')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !prospect) {
      return NextResponse.json({ error: 'Prospect not found' }, { status: 404 });
    }

    // Get scoring history
    const { data: history } = await supabaseAdmin
      .from('lead_scoring_history')
      .select('*')
      .eq('prospect_id', prospect.id)
      .order('created_at', { ascending: false })
      .limit(10);

    return NextResponse.json({
      prospect,
      history: history || []
    });

  } catch (error) {
    console.error('Error fetching lead score:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper functions
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
