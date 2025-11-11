// Delete existing users and recreate them properly
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('URL:', supabaseUrl);
console.log('Key length:', supabaseServiceKey?.length);

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

async function recreateAdmins() {
  console.log('🚀 Deleting and recreating admin users...\n');

  // First, list all users to get their IDs
  const { data: allUsers, error: listError } = await supabaseAdmin.auth.admin.listUsers();

  if (listError) {
    console.error('❌ Error listing users:', listError);
    return;
  }

  console.log(`Found ${allUsers.users.length} total users\n`);

  // Delete existing admin users
  for (const email of ADMIN_EMAILS) {
    const existingUser = allUsers.users.find(u => u.email === email);

    if (existingUser) {
      console.log(`Deleting existing user: ${email}`);
      const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(existingUser.id);

      if (deleteError) {
        console.log(`  ❌ Delete failed:`, deleteError.message);
      } else {
        console.log(`  ✅ Deleted successfully`);
      }
    }
  }

  console.log('\n--- Creating fresh admin users ---\n');

  // Now create fresh users
  for (const email of ADMIN_EMAILS) {
    console.log(`Creating user: ${email}`);

    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password: ADMIN_PASSWORD,
      email_confirm: true,
      user_metadata: {
        role: 'admin'
      }
    });

    if (error) {
      console.log(`  ❌ Error:`, error.message);
    } else {
      console.log(`  ✅ Created successfully`);
      console.log(`     ID: ${data.user.id}`);
      console.log(`     Email confirmed: ${data.user.email_confirmed_at ? 'Yes' : 'No'}`);
    }
    console.log('');
  }

  console.log('✨ Done!');
  console.log('\nTry logging in at: https://lorenzodc.com/login');
  console.log('Email: lorenzo.d.chambers@gmail.com');
  console.log('Password: Prosperityismine1');
}

recreateAdmins();
