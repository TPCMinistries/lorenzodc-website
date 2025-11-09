#!/usr/bin/env node
/**
 * Re-engagement Email Script
 * Sends "AI Assessment Now Live" email to existing newsletter subscribers
 *
 * Usage:
 *   node scripts/send-reengagement-email.js [--dry-run] [--limit=10]
 *
 * Options:
 *   --dry-run    Don't actually send, just show what would be sent
 *   --limit=N    Only send to first N subscribers (for testing)
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const { Resend } = require('resend');

// Parse command line arguments
const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');
const limitArg = args.find(arg => arg.startsWith('--limit='));
const limit = limitArg ? parseInt(limitArg.split('=')[1]) : null;

// Initialize clients
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const resendApiKey = process.env.RESEND_API_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

if (!resendApiKey || resendApiKey === 'your_resend_key') {
  console.error('❌ Missing or invalid RESEND_API_KEY in .env.local');
  console.error('   Update .env.local with your real Resend API key first');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const resend = new Resend(resendApiKey);

// Email template
function getReengagementEmailHTML() {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your AI Assessment is Now Live!</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
    <h1 style="color: white; margin: 0; font-size: 28px;">🎉 Your AI Assessment is Now Live!</h1>
    <p style="color: #f0f0f0; margin: 10px 0 0 0; font-size: 16px;">Ready to discover your AI readiness score?</p>
  </div>

  <h2 style="color: #333; margin-bottom: 20px;">Great news!</h2>

  <p>When you signed up for the AI Readiness Checklist, we were still finalizing the full assessment. It's now complete, and I think you'll find it incredibly valuable.</p>

  <div style="background: #f8f9fa; padding: 25px; border-radius: 8px; border-left: 4px solid #667eea; margin: 25px 0;">
    <h3 style="margin-top: 0; color: #667eea;">📊 What You'll Get:</h3>
    <ul style="margin: 15px 0; padding-left: 20px;">
      <li><strong>Your AI Readiness Score</strong> - 0-100% across 4 key dimensions</li>
      <li><strong>Personalized Roadmap</strong> - Specific next steps for your situation</li>
      <li><strong>Benchmark Comparison</strong> - See how you stack up vs 500+ assessments</li>
      <li><strong>Free AI Chat Access</strong> - Get instant strategic guidance</li>
    </ul>
  </div>

  <div style="background: #e7f3ff; padding: 20px; border-radius: 8px; margin: 25px 0;">
    <p style="margin: 0; color: #1e40af;"><strong>⏱️ Takes just 5 minutes</strong> to complete all 12 questions</p>
  </div>

  <div style="text-align: center; margin: 30px 0;">
    <a href="https://www.lorenzodc.com/ai-assessment" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block; font-size: 18px;">
      Take the Assessment Now →
    </a>
  </div>

  <div style="background: #fff3cd; padding: 20px; border-radius: 8px; border: 1px solid #ffeaa7; margin: 25px 0;">
    <h4 style="margin-top: 0; color: #856404;">💡 Why This Matters:</h4>
    <p style="margin: 5px 0;">Most organizations are flying blind when it comes to AI. This assessment gives you clarity on:</p>
    <ul style="margin: 10px 0; padding-left: 20px;">
      <li>Where you are vs where you need to be</li>
      <li>Your biggest opportunities and gaps</li>
      <li>The right timeline for your situation</li>
      <li>Realistic next steps (not generic advice)</li>
    </ul>
  </div>

  <p>Questions about the assessment? Hit reply - I personally read every response.</p>

  <p style="margin-top: 30px;">
    Best,<br>
    <strong>Lorenzo Daughtry-Chambers</strong><br>
    <em>AI Strategy & Innovation</em>
  </p>

  <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">

  <div style="text-align: center; color: #666; font-size: 14px;">
    <p>You're receiving this because you signed up at <a href="https://www.lorenzodc.com" style="color: #667eea;">lorenzodc.com</a></p>
    <p>
      <a href="https://www.lorenzodc.com/ai-assessment" style="color: #667eea; text-decoration: none;">Take Assessment</a> |
      <a href="https://www.lorenzodc.com/chat" style="color: #667eea; text-decoration: none;">AI Chat</a> |
      <a href="https://www.lorenzodc.com/contact" style="color: #667eea; text-decoration: none;">Contact</a>
    </p>
  </div>
</body>
</html>
  `;
}

async function getSubscribers() {
  try {
    console.log('🔍 Fetching newsletter subscribers...\n');

    let query = supabase
      .from('newsletter_signups')
      .select('*')
      .order('created_at', { ascending: false });

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error) {
      console.error('❌ Error fetching subscribers:', error.message);
      return [];
    }

    // Filter out test emails
    const realSubscribers = (data || []).filter(sub =>
      !sub.email.includes('test@') &&
      !sub.email.includes('example.com') &&
      sub.email !== 'lorenzo.d.chambers@gmail.com'
    );

    return realSubscribers;
  } catch (error) {
    console.error('❌ Unexpected error:', error);
    return [];
  }
}

async function sendReengagementEmail(email) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Lorenzo DC <lorenzo@lorenzodc.com>',
      to: [email],
      subject: '🎉 Your AI Assessment is Now Live!',
      html: getReengagementEmailHTML()
    });

    if (error) {
      console.error(`   ❌ Failed: ${error.message}`);
      return { success: false, error: error.message };
    }

    return { success: true, emailId: data?.id };
  } catch (error) {
    console.error(`   ❌ Failed: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function main() {
  console.log('╔═══════════════════════════════════════════════════════════╗');
  console.log('║     AI Assessment Re-engagement Email Campaign           ║');
  console.log('╚═══════════════════════════════════════════════════════════╝\n');

  if (isDryRun) {
    console.log('🧪 DRY RUN MODE - No emails will be sent\n');
  }

  if (limit) {
    console.log(`⚠️  LIMIT: Only processing first ${limit} subscribers\n`);
  }

  // Get subscribers
  const subscribers = await getSubscribers();

  if (subscribers.length === 0) {
    console.log('📭 No subscribers found');
    return;
  }

  console.log(`📊 Found ${subscribers.length} subscribers to contact\n`);
  console.log('═'.repeat(60));

  // Show preview
  console.log('\n📧 Email Preview:\n');
  console.log('From: Lorenzo DC <lorenzo@lorenzodc.com>');
  console.log('Subject: 🎉 Your AI Assessment is Now Live!');
  console.log('Content: [HTML email with re-engagement message]');
  console.log('\n' + '═'.repeat(60) + '\n');

  // Confirm before sending (if not dry run)
  if (!isDryRun) {
    console.log('⚠️  WARNING: This will send real emails!\n');
    console.log('Press Ctrl+C to cancel, or continue in 5 seconds...\n');
    await new Promise(resolve => setTimeout(resolve, 5000));
  }

  // Send emails
  let successCount = 0;
  let failCount = 0;

  console.log('📤 Sending emails...\n');

  for (let i = 0; i < subscribers.length; i++) {
    const subscriber = subscribers[i];
    const date = new Date(subscriber.created_at);

    console.log(`${i + 1}/${subscribers.length} - ${subscriber.email} (signed up ${date.toLocaleDateString()})`);

    if (isDryRun) {
      console.log('   ✅ Would send (dry run)');
      successCount++;
    } else {
      const result = await sendReengagementEmail(subscriber.email);

      if (result.success) {
        console.log(`   ✅ Sent (ID: ${result.emailId})`);
        successCount++;

        // Rate limiting - wait 100ms between emails
        await new Promise(resolve => setTimeout(resolve, 100));
      } else {
        console.log(`   ❌ Failed: ${result.error}`);
        failCount++;
      }
    }
  }

  // Summary
  console.log('\n' + '═'.repeat(60));
  console.log('\n📊 Campaign Summary:\n');
  console.log(`Total subscribers: ${subscribers.length}`);
  console.log(`✅ Successful: ${successCount}`);
  console.log(`❌ Failed: ${failCount}`);

  if (isDryRun) {
    console.log('\n🧪 This was a DRY RUN - no actual emails were sent');
    console.log('\nTo send for real, run: node scripts/send-reengagement-email.js');
  } else {
    console.log('\n✅ Campaign complete!');
    console.log('\n📊 Monitor results:');
    console.log('   - Resend dashboard: https://resend.com/emails');
    console.log('   - Check /admin/email-tracking for opens/clicks');
    console.log('   - Watch ai_assessments table for completions');
  }

  console.log('\n' + '═'.repeat(60) + '\n');
}

// Run the script
main().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
