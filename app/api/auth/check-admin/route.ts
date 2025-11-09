import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

/**
 * Check if the current user is an admin
 * GET /api/auth/check-admin
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    // Get the current user
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return NextResponse.json({ isAdmin: false, error: 'Not authenticated' }, { status: 401 });
    }

    // List of admin emails
    const adminEmails = [
      'lorenzo@lorenzodc.com',
      'lorenzo@theglobalenterprise.org',
      'lorenzo.d.chambers@gmail.com'
    ];

    // Check if user's email is in admin list
    const isAdmin = user.email ? adminEmails.includes(user.email.toLowerCase()) : false;

    if (!isAdmin) {
      console.log(`Access denied for non-admin user: ${user.email}`);
      return NextResponse.json({ isAdmin: false, email: user.email }, { status: 403 });
    }

    return NextResponse.json({
      isAdmin: true,
      email: user.email,
      userId: user.id
    });

  } catch (error) {
    console.error('Admin check error:', error);
    return NextResponse.json(
      { isAdmin: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
