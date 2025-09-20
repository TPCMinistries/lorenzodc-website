-- Email Automation & Lead Tracking Schema
-- Captures leads and triggers automated email sequences

-- 35. Email Automation Events Table
CREATE TABLE IF NOT EXISTS email_automation_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Event details
  event_type TEXT NOT NULL, -- 'assessment_completed', 'upgrade_completed', 'trial_started', 'goal_set'
  event_data JSONB DEFAULT '{}', -- Assessment results, subscription details, etc.

  -- Email automation context
  email_campaign TEXT, -- 'welcome_sequence', 'assessment_followup', 'upgrade_sequence'
  email_provider TEXT DEFAULT 'n8n', -- 'n8n', 'convertkit', 'mailchimp'
  webhook_url TEXT,

  -- Processing status
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed', 'skipped')),
  sent_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,

  -- User context at time of event
  user_email TEXT,
  user_name TEXT,
  subscription_tier TEXT,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 36. Lead Scoring & Attribution Table
CREATE TABLE IF NOT EXISTS lead_attribution (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Attribution data
  utm_source TEXT, -- 'facebook', 'google', 'linkedin', 'organic'
  utm_medium TEXT, -- 'cpc', 'social', 'email', 'referral'
  utm_campaign TEXT,
  utm_content TEXT,
  utm_term TEXT,

  -- Traffic source
  referrer_url TEXT,
  landing_page TEXT,
  ip_address INET,
  user_agent TEXT,
  device_type TEXT, -- 'desktop', 'mobile', 'tablet'

  -- Lead scoring
  lead_score INTEGER DEFAULT 0,
  lead_temperature TEXT DEFAULT 'cold' CHECK (lead_temperature IN ('cold', 'warm', 'hot', 'qualified')),

  -- Conversion tracking
  first_visit_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  conversion_event TEXT, -- 'signup', 'assessment', 'subscription', 'upgrade'
  conversion_value DECIMAL(10,2) DEFAULT 0,
  conversion_at TIMESTAMP WITH TIME ZONE,

  -- Contact preferences
  email_consent BOOLEAN DEFAULT false,
  marketing_consent BOOLEAN DEFAULT false,
  phone_consent BOOLEAN DEFAULT false,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 37. Social Media Conversion Tracking
CREATE TABLE IF NOT EXISTS social_conversions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Platform specific tracking
  platform TEXT NOT NULL, -- 'facebook', 'google', 'linkedin', 'twitter'
  pixel_id TEXT, -- Facebook Pixel ID, Google Analytics ID, etc.
  conversion_event TEXT NOT NULL, -- 'ViewContent', 'Lead', 'Purchase', 'CompleteRegistration'

  -- Event data
  event_value DECIMAL(10,2),
  event_currency TEXT DEFAULT 'USD',
  event_metadata JSONB DEFAULT '{}',

  -- Attribution
  click_id TEXT, -- fbclid, gclid, etc.
  campaign_id TEXT,
  ad_group_id TEXT,
  ad_id TEXT,

  -- Tracking status
  sent_to_platform BOOLEAN DEFAULT false,
  sent_at TIMESTAMP WITH TIME ZONE,
  platform_response JSONB,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 38. Email Campaign Performance
CREATE TABLE IF NOT EXISTS email_campaign_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Campaign details
  campaign_name TEXT NOT NULL,
  email_provider TEXT NOT NULL,
  campaign_type TEXT, -- 'welcome', 'nurture', 'conversion', 'retention'

  -- Performance metrics (updated via webhooks)
  emails_sent INTEGER DEFAULT 0,
  emails_delivered INTEGER DEFAULT 0,
  emails_opened INTEGER DEFAULT 0,
  emails_clicked INTEGER DEFAULT 0,
  emails_bounced INTEGER DEFAULT 0,
  emails_unsubscribed INTEGER DEFAULT 0,

  -- Conversion metrics
  conversions INTEGER DEFAULT 0,
  conversion_value DECIMAL(10,2) DEFAULT 0,

  -- Time period
  date DATE DEFAULT CURRENT_DATE,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(campaign_name, email_provider, date)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_email_automation_events_user_type ON email_automation_events(user_id, event_type, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_email_automation_events_status ON email_automation_events(status, created_at);

CREATE INDEX IF NOT EXISTS idx_lead_attribution_user_id ON lead_attribution(user_id);
CREATE INDEX IF NOT EXISTS idx_lead_attribution_utm_source ON lead_attribution(utm_source, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_lead_attribution_conversion ON lead_attribution(conversion_event, conversion_at DESC);

CREATE INDEX IF NOT EXISTS idx_social_conversions_platform ON social_conversions(platform, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_social_conversions_user_id ON social_conversions(user_id);

-- RLS Policies
ALTER TABLE email_automation_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_attribution ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_conversions ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_campaign_stats ENABLE ROW LEVEL SECURITY;

-- Users can only see their own data
CREATE POLICY "Users can view their own email events" ON email_automation_events
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own attribution data" ON lead_attribution
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own social conversions" ON social_conversions
  FOR SELECT USING (auth.uid() = user_id);

-- Admins can view campaign stats (no RLS policy needed for stats table)

-- Function to trigger email automation
CREATE OR REPLACE FUNCTION trigger_email_automation(
  user_id_param UUID,
  event_type_param TEXT,
  event_data_param JSONB DEFAULT '{}',
  campaign_name_param TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  automation_id UUID;
  user_email TEXT;
  user_name TEXT;
  current_tier TEXT;
  webhook_url TEXT;
BEGIN
  -- Get user details
  SELECT
    COALESCE(u.email, '') as email,
    COALESCE(u.raw_user_meta_data->>'full_name', u.email) as name
  INTO user_email, user_name
  FROM auth.users u
  WHERE u.id = user_id_param;

  -- Get current subscription tier
  SELECT COALESCE(s.tierId, 'free') INTO current_tier
  FROM user_subscriptions s
  WHERE s.userId = user_id_param AND s.status = 'active'
  ORDER BY s.created_at DESC
  LIMIT 1;

  -- Determine webhook URL based on event type
  webhook_url := CASE event_type_param
    WHEN 'assessment_completed' THEN 'https://your-n8n-instance.com/webhook/assessment-completed'
    WHEN 'upgrade_completed' THEN 'https://your-n8n-instance.com/webhook/upgrade-completed'
    WHEN 'trial_started' THEN 'https://your-n8n-instance.com/webhook/trial-started'
    WHEN 'goal_set' THEN 'https://your-n8n-instance.com/webhook/goal-set'
    ELSE 'https://your-n8n-instance.com/webhook/general-event'
  END;

  -- Create automation event
  INSERT INTO email_automation_events (
    user_id,
    event_type,
    event_data,
    email_campaign,
    webhook_url,
    user_email,
    user_name,
    subscription_tier
  ) VALUES (
    user_id_param,
    event_type_param,
    event_data_param,
    campaign_name_param,
    webhook_url,
    user_email,
    user_name,
    current_tier
  ) RETURNING id INTO automation_id;

  RETURN automation_id;
END;
$$ LANGUAGE plpgsql;

-- Function to track lead attribution
CREATE OR REPLACE FUNCTION track_lead_attribution(
  user_id_param UUID,
  utm_data JSONB DEFAULT '{}',
  traffic_data JSONB DEFAULT '{}'
)
RETURNS UUID AS $$
DECLARE
  attribution_id UUID;
BEGIN
  INSERT INTO lead_attribution (
    user_id,
    utm_source,
    utm_medium,
    utm_campaign,
    utm_content,
    utm_term,
    referrer_url,
    landing_page,
    ip_address,
    user_agent,
    device_type
  ) VALUES (
    user_id_param,
    utm_data->>'utm_source',
    utm_data->>'utm_medium',
    utm_data->>'utm_campaign',
    utm_data->>'utm_content',
    utm_data->>'utm_term',
    traffic_data->>'referrer',
    traffic_data->>'landing_page',
    CAST(traffic_data->>'ip_address' AS INET),
    traffic_data->>'user_agent',
    traffic_data->>'device_type'
  ) RETURNING id INTO attribution_id;

  RETURN attribution_id;
END;
$$ LANGUAGE plpgsql;

-- Function to update lead score
CREATE OR REPLACE FUNCTION update_lead_score(
  user_id_param UUID,
  score_change INTEGER,
  reason TEXT DEFAULT NULL
)
RETURNS INTEGER AS $$
DECLARE
  new_score INTEGER;
  new_temperature TEXT;
BEGIN
  -- Update lead score
  UPDATE lead_attribution
  SET
    lead_score = lead_score + score_change,
    updated_at = NOW()
  WHERE user_id = user_id_param
  RETURNING lead_score INTO new_score;

  -- Determine temperature based on score
  new_temperature := CASE
    WHEN new_score >= 80 THEN 'qualified'
    WHEN new_score >= 60 THEN 'hot'
    WHEN new_score >= 30 THEN 'warm'
    ELSE 'cold'
  END;

  -- Update temperature
  UPDATE lead_attribution
  SET lead_temperature = new_temperature
  WHERE user_id = user_id_param;

  RETURN new_score;
END;
$$ LANGUAGE plpgsql;

-- Function to track social media conversion
CREATE OR REPLACE FUNCTION track_social_conversion(
  user_id_param UUID,
  platform_param TEXT,
  event_type_param TEXT,
  event_value_param DECIMAL DEFAULT 0,
  metadata_param JSONB DEFAULT '{}'
)
RETURNS UUID AS $$
DECLARE
  conversion_id UUID;
BEGIN
  INSERT INTO social_conversions (
    user_id,
    platform,
    conversion_event,
    event_value,
    event_metadata,
    click_id,
    campaign_id
  ) VALUES (
    user_id_param,
    platform_param,
    event_type_param,
    event_value_param,
    metadata_param,
    metadata_param->>'click_id',
    metadata_param->>'campaign_id'
  ) RETURNING id INTO conversion_id;

  RETURN conversion_id;
END;
$$ LANGUAGE plpgsql;

-- Function to get lead analytics
CREATE OR REPLACE FUNCTION get_lead_analytics(
  start_date DATE DEFAULT CURRENT_DATE - INTERVAL '30 days',
  end_date DATE DEFAULT CURRENT_DATE
)
RETURNS TABLE (
  utm_source TEXT,
  total_leads INTEGER,
  converted_leads INTEGER,
  conversion_rate DECIMAL,
  avg_lead_score DECIMAL,
  total_conversion_value DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    la.utm_source,
    COUNT(*)::INTEGER as total_leads,
    COUNT(*) FILTER (WHERE la.conversion_at IS NOT NULL)::INTEGER as converted_leads,
    ROUND(
      COUNT(*) FILTER (WHERE la.conversion_at IS NOT NULL)::DECIMAL /
      NULLIF(COUNT(*), 0) * 100,
      2
    ) as conversion_rate,
    ROUND(AVG(la.lead_score), 2) as avg_lead_score,
    SUM(COALESCE(la.conversion_value, 0)) as total_conversion_value
  FROM lead_attribution la
  WHERE la.created_at BETWEEN start_date AND end_date
  GROUP BY la.utm_source
  ORDER BY total_leads DESC;
END;
$$ LANGUAGE plpgsql;