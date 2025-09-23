import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const { email, source, leadMagnet } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Store newsletter signup in Supabase
    const { data, error } = await supabaseAdmin
      .from('newsletter_signups')
      .insert({
        email,
        source: source || 'website',
        lead_magnet: leadMagnet || 'AI Strategy Newsletter',
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      // If it's a duplicate email, that's okay
      if (error.code === '23505') {
        return NextResponse.json({ message: 'Already subscribed!' });
      }
      throw error;
    }

    // Send welcome email via Resend
    if (process.env.RESEND_API_KEY) {
      try {
        await fetch(`${process.env.NEXTAUTH_URL || 'https://www.lorenzodc.com'}/api/send-welcome-email`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            leadMagnet,
            source
          })
        });
      } catch (emailError) {
        // Don't fail the whole request if email fails
        console.error('Welcome email error:', emailError);
      }
    }

    return NextResponse.json({
      message: 'Successfully subscribed!',
      data
    });

  } catch (error) {
    console.error('Newsletter signup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}