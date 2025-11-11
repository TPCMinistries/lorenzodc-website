// One-time script to create admin users
// Run with: node scripts/seed-admins.js

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  console.error('Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local');
  process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const ADMIN_EMAILS = [
  'lorenzo@lorenzodc.com',
  'lorenzo@theglobalenterprise.org',
  'lorenzo.d.chambers@gmail.com'
];

const ADMIN_PASSWORD = 'Prosperityismine1';

async function seedAdmins() {
  console.log('🚀 Starting admin user creation...\n');

  for (const email of ADMIN_EMAILS) {
    try {
      console.log(`Creating user: ${email}`);

      // Try to create the user
      const { data, error } = await supabaseAdmin.auth.admin.createUser({
        email,
        password: ADMIN_PASSWORD,
        email_confirm: true,
        user_metadata: {
          role: 'admin'
        }
      });

      if (error) {
        // If user already exists, update their password
        if (error.message.includes('already registered')) {
          console.log(`  ⚠️  User exists, updating password...`);

          // Get user by email
          const { data: users } = await supabaseAdmin.auth.admin.listUsers();
          const existingUser = users.users.find(u => u.email === email);

          if (existingUser) {
            const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
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
              console.log(`  ❌ Update failed: ${updateError.message}`);
            } else {
              console.log(`  ✅ Password updated successfully`);
            }
          }
        } else {
          console.log(`  ❌ Error: ${error.message}`);
        }
      } else {
        console.log(`  ✅ User created successfully`);
        console.log(`     ID: ${data.user.id}`);
      }
      console.log('');
    } catch (err) {
      console.log(`  ❌ Exception: ${err.message}\n`);
    }
  }

  console.log('✨ Admin seeding complete!');
  console.log('\nYou can now login at https://lorenzodc.com/login with:');
  console.log('  Email: Any of the admin emails above');
  console.log('  Password: Prosperityismine1');
}

seedAdmins();
