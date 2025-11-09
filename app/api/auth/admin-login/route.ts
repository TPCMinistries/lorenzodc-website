import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import crypto from 'crypto';
import { supabaseAdmin } from '../../../../lib/supabase/server';

const resend = new Resend(process.env.RESEND_API_KEY);

// Authorized admin emails
const ADMIN_EMAILS = [
  'lorenzo@lorenzodc.com',
  'lorenzo@theglobalenterprise.org',
  'lorenzo.d.chambers@gmail.com'
];

/**
 * Send magic link for admin login
 * POST /api/auth/admin-login
 */
export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    // Check if email is authorized admin
    const isAdmin = ADMIN_EMAILS.includes(email.toLowerCase());

    if (!isAdmin) {
      console.log(`Unauthorized admin login attempt: ${email}`);
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const supabase = createRouteHandlerClient({ cookies });

    // Sign in with password
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Supabase login error:', error);
      return NextResponse.json({
        error: 'Invalid credentials'
      }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      message: 'Login successful',
      user: data.user
    });

  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
