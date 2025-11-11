// Simple script to create one admin user
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function createAdmin() {
  console.log('Creating admin user...\n');

  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email: 'lorenzo.d.chambers@gmail.com',
    password: 'Prosperityismine1',
    email_confirm: true,
    user_metadata: {
      role: 'admin'
    }
  });

  if (error) {
    console.log('❌ Error:', error);
    console.log('Full error:', JSON.stringify(error, null, 2));
  } else {
    console.log('✅ Success!');
    console.log('User:', data.user);
  }
}

createAdmin();
