import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../lib/supabase/server';

/**
 * Get all leads with scoring data
 * GET /api/admin/leads
 */
export async function GET(request: NextRequest) {
  try {
    // Get all prospects with lead scoring
    const { data: leads, error } = await supabaseAdmin
      .from('prospect_profiles')
      .select('*')
      .order('lead_score', { ascending: false });

    if (error) {
      console.error('Error fetching leads:', error);
      return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 });
    }

    // Get scoring history for recent leads
    const leadIds = leads.map(l => l.id);
    const { data: scoringHistory } = await supabaseAdmin
      .from('lead_scoring_history')
      .select('*')
      .in('prospect_id', leadIds)
      .order('created_at', { ascending: false });

    // Get email automation events
    const { data: emailEvents } = await supabaseAdmin
      .from('email_automation_events')
      .select('*')
      .in('prospect_id', leadIds)
      .order('created_at', { ascending: false });

    // Get booking events
    const { data: bookings } = await supabaseAdmin
      .from('booking_events')
      .select('*')
      .in('prospect_id', leadIds);

    // Enrich leads with additional data
    const enrichedLeads = leads.map(lead => ({
      ...lead,
      scoring_history: scoringHistory?.filter(s => s.prospect_id === lead.id) || [],
      email_events: emailEvents?.filter(e => e.prospect_id === lead.id) || [],
      bookings: bookings?.filter(b => b.prospect_id === lead.id) || []
    }));

    return NextResponse.json({
      leads: enrichedLeads,
      total: leads.length
    });

  } catch (error) {
    console.error('Error in admin leads API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Update lead status or tier
 * PATCH /api/admin/leads
 */
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { leadId, updates } = body;

    if (!leadId) {
      return NextResponse.json({ error: 'Lead ID is required' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('prospect_profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', leadId)
      .select()
      .single();

    if (error) {
      console.error('Error updating lead:', error);
      return NextResponse.json({ error: 'Failed to update lead' }, { status: 500 });
    }

    return NextResponse.json({ lead: data });

  } catch (error) {
    console.error('Error in admin leads PATCH:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
