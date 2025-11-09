import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    // Fetch all newsletter signups
    const { data: signups, error } = await supabaseAdmin
      .from('newsletter_signups')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching signups:', error);
      return NextResponse.json(
        { error: 'Failed to fetch signups' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      signups: signups || [],
      count: signups?.length || 0
    });

  } catch (error) {
    console.error('Newsletter signups API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
