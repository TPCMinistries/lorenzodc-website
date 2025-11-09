import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import crypto from 'crypto';

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
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Check if email is authorized admin
    const isAdmin = ADMIN_EMAILS.includes(email.toLowerCase());

    if (!isAdmin) {
      console.log(`Unauthorized admin login attempt: ${email}`);
      return NextResponse.json(
        { error: 'This email is not authorized for admin access' },
        { status: 403 }
      );
    }

    const supabase = createRouteHandlerClient({ cookies });

    // Generate magic link using Supabase (but we'll send it via Resend)
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://www.lorenzodc.com'}/admin`,
      }
    });

    if (error) {
      console.error('Supabase OTP error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Note: Supabase will send the email automatically through their system
    // To fully customize, you'd need to disable Supabase emails and implement custom token system

    return NextResponse.json({
      success: true,
      message: 'Check your email for the login link'
    });

  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
