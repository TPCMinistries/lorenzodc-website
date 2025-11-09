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

    // First, check if user exists and confirm their email
    try {
      const { data: users } = await supabaseAdmin.auth.admin.listUsers();
      const existingUser = users?.users?.find(u => u.email === email.toLowerCase());

      if (existingUser && !existingUser.email_confirmed_at) {
        // Confirm the user's email if not confirmed
        await supabaseAdmin.auth.admin.updateUserById(existingUser.id, {
          email_confirm: true
        });
        console.log('Auto-confirmed email for existing user:', email);
      }
    } catch (err) {
      console.error('Error checking/confirming user:', err);
      // Continue anyway
    }

    // Generate magic link using Supabase
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://www.lorenzodc.com'}/admin`,
        shouldCreateUser: false, // Don't create new users via OTP
      }
    });

    if (error) {
      console.error('Supabase OTP error:', error);
      return NextResponse.json({
        error: `Login failed: ${error.message}. Please contact support.`
      }, { status: 500 });
    }

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
