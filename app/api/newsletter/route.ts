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

    // Send welcome email via N8N if webhook is configured
    if (process.env.N8N_EMAIL_WEBHOOK_URL) {
      try {
        await fetch(process.env.N8N_EMAIL_WEBHOOK_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.N8N_EMAIL_SECRET || ''}`,
          },
          body: JSON.stringify({
            type: 'newsletter_signup',
            email,
            leadMagnet,
            source,
            timestamp: new Date().toISOString()
          })
        });
      } catch (webhookError) {
        // Don't fail the whole request if webhook fails
        console.error('N8N webhook error:', webhookError);
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