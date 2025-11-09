import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    // Fetch all AI assessments
    const { data: assessments, error } = await supabaseAdmin
      .from('ai_assessments')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching assessments:', error);
      return NextResponse.json(
        { error: 'Failed to fetch assessments' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      assessments: assessments || [],
      count: assessments?.length || 0
    });

  } catch (error) {
    console.error('AI assessments API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
