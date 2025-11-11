import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import crypto from 'crypto';
import { supabaseAdmin } from '../../../../lib/supabase/server';

const resend = new Resend(process.env.RESEND_API_KEY || "placeholder-resend-key");

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

    // TEMPORARY: Simple password check bypass while Supabase auth is broken
    // TODO: Remove this once Supabase auth is fixed
    const TEMP_ADMIN_PASSWORD = 'Prosperityismine1';

    if (password === TEMP_ADMIN_PASSWORD) {
      // Create a temporary session token
      const sessionToken = crypto.randomBytes(32).toString('hex');

      // Set session cookie
      const response = NextResponse.json({
        success: true,
        message: 'Login successful (temporary auth)',
        user: {
          email,
          id: crypto.createHash('sha256').update(email).digest('hex'),
          role: 'admin'
        }
      });

      response.cookies.set('admin-session', sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7 // 7 days
      });

      response.cookies.set('admin-email', email, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7 // 7 days
      });

      return response;
    }

    return NextResponse.json({
      error: 'Invalid credentials'
    }, { status: 401 });

  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
