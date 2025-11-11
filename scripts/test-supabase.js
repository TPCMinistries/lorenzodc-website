// Test Supabase connection
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('Supabase URL:', supabaseUrl ? '✅ Set' : '❌ Missing');
console.log('Service Key:', supabaseServiceKey ? '✅ Set (length: ' + supabaseServiceKey.length + ')' : '❌ Missing');

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function test() {
  try {
    console.log('\nTesting auth.admin.listUsers()...');
    const { data, error } = await supabaseAdmin.auth.admin.listUsers();

    if (error) {
      console.log('❌ Error:', error.message);
      console.log('Full error:', JSON.stringify(error, null, 2));
    } else {
      console.log('✅ Success! Found', data.users.length, 'users');
      data.users.forEach(user => {
        console.log('  -', user.email, '(ID:', user.id.substring(0, 8) + '...)');
      });
    }
  } catch (err) {
    console.log('❌ Exception:', err.message);
  }
}

test();
