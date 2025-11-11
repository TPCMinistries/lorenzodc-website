import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

/**
 * Check if the current user is an admin
 * GET /api/auth/check-admin
 */
export async function GET(request: NextRequest) {
  try {
    // TEMPORARY: Use cookie-based auth while Supabase auth is broken
    const cookieStore = cookies();
    const adminSession = cookieStore.get('admin-session');
    const adminEmail = cookieStore.get('admin-email');

    if (!adminSession || !adminEmail) {
      return NextResponse.json({ isAdmin: false, error: 'Not authenticated' }, { status: 401 });
    }

    // List of admin emails
    const adminEmails = [
      'lorenzo@lorenzodc.com',
      'lorenzo@theglobalenterprise.org',
      'lorenzo.d.chambers@gmail.com'
    ];

    // Check if user's email is in admin list
    const isAdmin = adminEmails.includes(adminEmail.value.toLowerCase());

    if (!isAdmin) {
      console.log(`Access denied for non-admin user: ${adminEmail.value}`);
      return NextResponse.json({ isAdmin: false, email: adminEmail.value }, { status: 403 });
    }

    return NextResponse.json({
      isAdmin: true,
      email: adminEmail.value,
      userId: adminSession.value
    });

  } catch (error) {
    console.error('Admin check error:', error);
    return NextResponse.json(
      { isAdmin: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
