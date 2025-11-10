import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../lib/supabase/server';

const ADMIN_EMAILS = [
  'lorenzo@lorenzodc.com',
  'lorenzo@theglobalenterprise.org',
  'lorenzo.d.chambers@gmail.com'
];

const ADMIN_PASSWORD = 'Prosperityismine1';

/**
 * Temporary endpoint to seed admin users
 * POST /api/auth/seed-admins
 */
export async function POST(request: NextRequest) {
  try {
    const results = [];

    for (const email of ADMIN_EMAILS) {
      try {
        // Try to create the user with Supabase Admin API
        const { data, error } = await supabaseAdmin.auth.admin.createUser({
          email,
          password: ADMIN_PASSWORD,
          email_confirm: true,
          user_metadata: {
            role: 'admin'
          }
        });

        if (error) {
          // If user already exists, try to update their password
          if (error.message.includes('already registered')) {
            // Get user by email
            const { data: users } = await supabaseAdmin.auth.admin.listUsers();
            const existingUser = users.users.find(u => u.email === email);

            if (existingUser) {
              // Update password
              const { data: updateData, error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
                existingUser.id,
                {
                  password: ADMIN_PASSWORD,
                  email_confirm: true,
                  user_metadata: {
                    role: 'admin'
                  }
                }
              );

              if (updateError) {
                results.push({ email, status: 'error', message: updateError.message });
              } else {
                results.push({ email, status: 'updated', user: updateData.user });
              }
            }
          } else {
            results.push({ email, status: 'error', message: error.message });
          }
        } else {
          results.push({ email, status: 'created', user: data.user });
        }
      } catch (err: any) {
        results.push({ email, status: 'error', message: err.message });
      }
    }

    return NextResponse.json({
      success: true,
      results
    });

  } catch (error: any) {
    console.error('Seed admins error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
}
