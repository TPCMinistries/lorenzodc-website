# Lead Generation System Setup Guide

This guide will help you implement the complete lead generation and relationship management system.

## 🗄️ 1. Supabase Database Setup

### Step 1: Create Supabase Project
1. Go to [supabase.com](https://supabase.com) and create a new project
2. Note your project URL and anon key
3. Add them to your `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### Step 2: Run Database Schema
1. Go to your Supabase dashboard → SQL Editor
2. Copy and run the entire `supabase-lead-management-schema.sql` file
3. This creates all tables, functions, views, and triggers

### Step 3: Configure Row Level Security (Optional)
If you want user-specific data access, uncomment the RLS policies in the schema.

## 📧 2. Email Automation Platform Integration

Choose one of these platforms and configure accordingly:

### Option A: ConvertKit (Recommended)
1. Sign up for [ConvertKit](https://convertkit.com)
2. Go to Account Settings → Advanced → API
3. Copy your API Key and API Secret
4. Create automations for each sequence:
   - Welcome Sequence
   - Enterprise Assessment Follow-up
   - Divine Strategy Nurturing
   - Lead Magnet Follow-ups
   - Booking Preparation sequences

5. Add environment variables:
```env
EMAIL_PLATFORM=convertkit
CONVERTKIT_API_KEY=your_api_key
CONVERTKIT_API_SECRET=your_api_secret

# Automation IDs (get these from ConvertKit automation URLs)
CONVERTKIT_WELCOME_AUTOMATION_ID=123456
CONVERTKIT_ENTERPRISE_AUTOMATION_ID=234567
CONVERTKIT_PERSONAL_AUTOMATION_ID=345678
CONVERTKIT_DIVINE_STRATEGY_AUTOMATION_ID=456789
CONVERTKIT_ENTERPRISE_AI_AUTOMATION_ID=567890
CONVERTKIT_INVESTMENT_AUTOMATION_ID=678901
CONVERTKIT_AI_CHECKLIST_AUTOMATION_ID=789012
CONVERTKIT_DIVINE_GUIDE_AUTOMATION_ID=890123
CONVERTKIT_EXECUTIVE_PREP_AUTOMATION_ID=901234
CONVERTKIT_DIVINE_PREP_AUTOMATION_ID=012345
CONVERTKIT_AI_PREP_AUTOMATION_ID=123450
CONVERTKIT_GENERAL_PREP_AUTOMATION_ID=234561
```

### Option B: Mailchimp
1. Sign up for [Mailchimp](https://mailchimp.com)
2. Go to Account → Extras → API Keys
3. Create an API key
4. Create audiences and automations

```env
EMAIL_PLATFORM=mailchimp
MAILCHIMP_API_KEY=your_api_key
MAILCHIMP_LIST_ID=your_list_id
```

### Option C: ActiveCampaign
1. Sign up for [ActiveCampaign](https://activecampaign.com)
2. Go to Settings → Developer
3. Copy your API URL and Key

```env
EMAIL_PLATFORM=activecampaign
ACTIVECAMPAIGN_API_KEY=your_api_key
ACTIVECAMPAIGN_API_URL=your_account_url

# Automation IDs
ACTIVECAMPAIGN_WELCOME_AUTOMATION_ID=1
ACTIVECAMPAIGN_ENTERPRISE_AUTOMATION_ID=2
ACTIVECAMPAIGN_PERSONAL_AUTOMATION_ID=3
ACTIVECAMPAIGN_DIVINE_STRATEGY_AUTOMATION_ID=4
ACTIVECAMPAIGN_ENTERPRISE_AI_AUTOMATION_ID=5
ACTIVECAMPAIGN_INVESTMENT_AUTOMATION_ID=6
```

## 🔗 3. Calendly Integration Setup

### Step 1: Create Multiple Calendly Event Types
Create these event types in your Calendly account:

1. **Executive Strategy Session** (60 min)
   - URL: `/executive-strategy-session`
   - For high-value prospects (Tier 1)

2. **Divine Strategy Session** (45 min)
   - URL: `/divine-strategy-session`
   - For ministry/coaching prospects

3. **AI Implementation Assessment** (45 min)
   - URL: `/ai-implementation-assessment`
   - For enterprise AI prospects

4. **Strategic Discovery Call** (30 min)
   - URL: `/discovery-call`
   - For general prospects

### Step 2: Update Environment Variables
```env
# Calendly URLs (update with your actual URLs)
CALENDLY_EXECUTIVE_URL=https://calendly.com/your-username/executive-strategy-session
CALENDLY_DIVINE_URL=https://calendly.com/your-username/divine-strategy-session
CALENDLY_AI_URL=https://calendly.com/your-username/ai-implementation-assessment
CALENDLY_DISCOVERY_URL=https://calendly.com/your-username/discovery-call
```

## 📊 4. Analytics Integration

### Google Analytics 4
```env
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### Facebook Pixel
```env
NEXT_PUBLIC_FACEBOOK_PIXEL_ID=123456789012345
```

### LinkedIn Insight Tag
```env
NEXT_PUBLIC_LINKEDIN_PARTNER_ID=123456
```

## 🚀 5. Code Updates Required

### Update Supabase Client Configuration
Ensure your `app/lib/supabase/client.ts` file has the correct configuration:

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

### Update Lead Qualification Service
Replace localStorage calls with Supabase calls in:
- `app/lib/services/lead-qualification.ts`
- `app/components/SmartBookingSystem.tsx`
- `app/components/EnhancedIntakeForm.tsx`
- `app/components/LeadMagnetDownload.tsx`

Example update:
```typescript
// OLD (localStorage)
static async storeProspectProfile(profile: ProspectProfile): Promise<boolean> {
  localStorage.setItem('prospect_profiles', JSON.stringify(profile));
  return true;
}

// NEW (Supabase)
static async storeProspectProfile(profile: ProspectProfile): Promise<boolean> {
  const { data, error } = await SupabaseProspectService.upsertProspect(profile);
  return !error;
}
```

## 🔄 6. Email Automation Sequences

### Sequence Structure (example for ConvertKit)

#### 1. Welcome Sequence (all new subscribers)
- **Day 0**: Welcome email with resources overview
- **Day 2**: Introduction to Divine Strategy framework
- **Day 5**: Case study or success story
- **Day 7**: Assessment invitation

#### 2. Enterprise Assessment Follow-up
- **Immediately**: Assessment results and personalized insights
- **Day 1**: AI readiness improvement recommendations
- **Day 3**: Case study relevant to their industry
- **Day 7**: Strategic consultation offer

#### 3. Lead Magnet Follow-ups
For each lead magnet, create a specific sequence:
- **Immediately**: Download confirmation and next steps
- **Day 1**: Implementation tips for the resource
- **Day 3**: Related case study or example
- **Day 7**: Strategic session offer

#### 4. Booking Preparation Sequences
- **Immediately**: Booking confirmation with preparation guide
- **Day before**: Reminder with meeting link and preparation checklist
- **1 hour before**: Final reminder (optional)

### 5. Nurturing Sequences by Category

#### Enterprise AI Prospects
- Weekly AI strategy insights
- Industry-specific case studies
- Technology trends and opportunities
- Implementation best practices

#### Ministry/Coaching Prospects
- Divine strategy principles
- Leadership development insights
- Ministry effectiveness tips
- Kingdom economics concepts

#### Investment Prospects
- Impact investing opportunities
- Kingdom economics updates
- Portfolio performance insights
- Strategic partnership opportunities

## 🧪 7. Testing the Implementation

### Step 1: Test Database Functions
```sql
-- Test prospect creation
SELECT upsert_prospect('test@example.com', 'Test User', 'Test Company', 'website');

-- Test lead scoring
SELECT update_lead_score(
  (SELECT id FROM prospect_profiles WHERE email = 'test@example.com'),
  25,
  'assessment_completed',
  '{"type": "enterprise"}'::jsonb
);

-- Test analytics
SELECT * FROM get_prospect_analytics();
```

### Step 2: Test Email Automation
1. Fill out a form on your website
2. Check Supabase to ensure prospect was created
3. Check your email platform to ensure automation was triggered
4. Verify email sequences are working

### Step 3: Test Lead Scoring
1. Complete various actions (assessments, downloads, page views)
2. Check `lead_scoring_history` table for score changes
3. Verify tier assignments are updating correctly

### Step 4: Test Booking System
1. Complete intake form
2. Verify Smart Booking recommendations
3. Test Calendly integration
4. Check booking events are recorded in database

## 📈 8. Monitoring and Optimization

### Key Metrics to Track
- Lead generation rate by source
- Lead scoring distribution
- Email open and click rates
- Conversion rate by prospect tier
- Booking-to-close rate
- Revenue per prospect category

### Regular Optimization Tasks
1. **Weekly**: Review high-value prospects and follow up
2. **Monthly**: Analyze email sequence performance
3. **Quarterly**: Update lead scoring criteria based on conversion data
4. **Ongoing**: A/B test email subject lines and content

## 🔒 9. Security Considerations

### Environment Variables
Never commit these to version control:
- API keys
- Database credentials
- Webhook secrets

### Database Security
- Enable RLS if handling sensitive data
- Use service role key only for server-side operations
- Regular backup of prospect data

### Email Compliance
- Include unsubscribe links in all emails
- Honor opt-out requests immediately
- Follow GDPR/CCPA guidelines for data handling

## 🆘 10. Troubleshooting

### Common Issues

#### Database Connection Issues
- Verify Supabase URL and keys
- Check if RLS policies are blocking access
- Ensure tables exist and have correct permissions

#### Email Automation Not Triggering
- Check webhook endpoint is accessible
- Verify API credentials for email platform
- Check automation IDs are correct
- Review email platform logs

#### Lead Scoring Not Working
- Check Supabase functions are created correctly
- Verify prospect_id is valid UUID
- Review lead_scoring_history table for errors

#### Booking System Issues
- Verify Calendly URLs are correct
- Check prospect qualification logic
- Ensure UTM parameters are being captured

### Support Resources
- Supabase Documentation: https://supabase.com/docs
- ConvertKit API Docs: https://developers.convertkit.com/
- Next.js Documentation: https://nextjs.org/docs

## ✅ Implementation Checklist

- [ ] Supabase project created and configured
- [ ] Database schema deployed successfully
- [ ] Email platform account setup and API configured
- [ ] Calendly event types created
- [ ] Environment variables configured
- [ ] Code updated to use Supabase instead of localStorage
- [ ] Email automation sequences created
- [ ] Testing completed for all major functions
- [ ] Analytics tracking verified
- [ ] Monitoring dashboard setup (optional)

Once completed, your lead generation system will automatically:
1. Qualify and categorize prospects
2. Recommend optimal booking types
3. Trigger personalized email sequences
4. Track engagement and lead scoring
5. Provide analytics for optimization

The system is designed to handle the breadth of your services while maximizing conversion rates and relationship quality!