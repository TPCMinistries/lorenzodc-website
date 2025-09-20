-- Comprehensive Usage Tracking System
-- Prevents revenue bleeding by enforcing hard limits

-- 31. User Usage Tracking Table (Monthly Limits)
CREATE TABLE IF NOT EXISTS user_usage_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Time period
  month_year TEXT NOT NULL, -- Format: 'YYYY-MM'

  -- Feature usage counts
  chat_messages_used INTEGER DEFAULT 0,
  voice_messages_used INTEGER DEFAULT 0,
  documents_uploaded INTEGER DEFAULT 0,
  assessments_completed INTEGER DEFAULT 0,

  -- Subscription context
  tier_id TEXT, -- Current subscription tier
  tier_limits JSONB DEFAULT '{}', -- Store limits for this period

  -- Reset tracking
  last_reset_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Ensure one record per user per month
  UNIQUE(user_id, month_year)
);

-- 32. Usage Limits Configuration (Per Tier)
CREATE TABLE IF NOT EXISTS usage_limits_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tier_id TEXT NOT NULL UNIQUE,

  -- Chat limits
  chat_messages_limit INTEGER, -- -1 for unlimited
  voice_messages_limit INTEGER,

  -- Feature limits
  documents_limit INTEGER,
  assessments_limit INTEGER, -- Per month

  -- API rate limits (per minute)
  api_requests_per_minute INTEGER DEFAULT 60,

  -- Feature access
  features_enabled TEXT[] DEFAULT ARRAY[]::TEXT[],

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 33. API Request Log (Rate Limiting)
CREATE TABLE IF NOT EXISTS api_request_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Request details
  endpoint TEXT NOT NULL,
  method TEXT NOT NULL,
  ip_address INET,
  user_agent TEXT,

  -- Rate limiting
  minute_bucket TEXT, -- Format: 'YYYY-MM-DD-HH-MM'

  -- Response
  status_code INTEGER,
  response_time_ms INTEGER,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 34. Feature Usage Log (Detailed Tracking)
CREATE TABLE IF NOT EXISTS feature_usage_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Feature details
  feature_type TEXT NOT NULL, -- 'chat', 'voice', 'document', 'assessment'
  feature_action TEXT, -- 'send_message', 'upload_file', 'complete_assessment'

  -- Context
  session_id UUID,
  metadata JSONB DEFAULT '{}',

  -- Billing context
  tier_id TEXT,
  billable BOOLEAN DEFAULT true,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_usage_tracking_user_month ON user_usage_tracking(user_id, month_year);
CREATE INDEX IF NOT EXISTS idx_api_request_log_user_bucket ON api_request_log(user_id, minute_bucket);
CREATE INDEX IF NOT EXISTS idx_feature_usage_log_user_type ON feature_usage_log(user_id, feature_type, created_at DESC);

-- RLS Policies
ALTER TABLE user_usage_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_request_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE feature_usage_log ENABLE ROW LEVEL SECURITY;

-- Users can only see their own usage data
CREATE POLICY "Users can view their own usage tracking" ON user_usage_tracking
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own API logs" ON api_request_log
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own feature usage" ON feature_usage_log
  FOR SELECT USING (auth.uid() = user_id);

-- Insert default usage limits
INSERT INTO usage_limits_config (tier_id, chat_messages_limit, voice_messages_limit, documents_limit, assessments_limit, api_requests_per_minute, features_enabled) VALUES
('free', 15, 3, 0, 1, 30, ARRAY['chat', 'assessment']),
('catalyst_basic', 150, 50, 5, 3, 60, ARRAY['chat', 'voice', 'assessment', 'basic_analytics']),
('catalyst_plus', -1, -1, -1, -1, 120, ARRAY['chat', 'voice', 'documents', 'assessment', 'unlimited_history', 'premium_voices', 'insights']),
('enterprise', -1, -1, -1, -1, 300, ARRAY['chat', 'voice', 'documents', 'assessment', 'unlimited_history', 'premium_voices', 'insights', 'team_management', 'api_access'])
ON CONFLICT (tier_id) DO UPDATE SET
  chat_messages_limit = EXCLUDED.chat_messages_limit,
  voice_messages_limit = EXCLUDED.voice_messages_limit,
  documents_limit = EXCLUDED.documents_limit,
  assessments_limit = EXCLUDED.assessments_limit,
  api_requests_per_minute = EXCLUDED.api_requests_per_minute,
  features_enabled = EXCLUDED.features_enabled,
  updated_at = NOW();

-- Function to get user's current usage limits
CREATE OR REPLACE FUNCTION get_user_usage_limits(user_id_param UUID)
RETURNS TABLE (
  tier_id TEXT,
  chat_messages_limit INTEGER,
  voice_messages_limit INTEGER,
  documents_limit INTEGER,
  assessments_limit INTEGER,
  api_requests_per_minute INTEGER,
  features_enabled TEXT[],
  current_usage JSONB
) AS $$
DECLARE
  user_tier TEXT;
  current_month TEXT;
BEGIN
  -- Get current month
  current_month := TO_CHAR(CURRENT_DATE, 'YYYY-MM');

  -- Get user's subscription tier
  SELECT COALESCE(s.tierId, 'free') INTO user_tier
  FROM user_subscriptions s
  WHERE s.userId = user_id_param AND s.status = 'active'
  ORDER BY s.created_at DESC
  LIMIT 1;

  -- If no active subscription, default to free
  IF user_tier IS NULL THEN
    user_tier := 'free';
  END IF;

  RETURN QUERY
  SELECT
    ul.tier_id,
    ul.chat_messages_limit,
    ul.voice_messages_limit,
    ul.documents_limit,
    ul.assessments_limit,
    ul.api_requests_per_minute,
    ul.features_enabled,
    COALESCE(
      jsonb_build_object(
        'chat_messages_used', ut.chat_messages_used,
        'voice_messages_used', ut.voice_messages_used,
        'documents_uploaded', ut.documents_uploaded,
        'assessments_completed', ut.assessments_completed,
        'month_year', current_month
      ),
      jsonb_build_object(
        'chat_messages_used', 0,
        'voice_messages_used', 0,
        'documents_uploaded', 0,
        'assessments_completed', 0,
        'month_year', current_month
      )
    ) as current_usage
  FROM usage_limits_config ul
  LEFT JOIN user_usage_tracking ut ON ut.user_id = user_id_param AND ut.month_year = current_month
  WHERE ul.tier_id = user_tier;
END;
$$ LANGUAGE plpgsql;

-- Function to check if user can perform action
CREATE OR REPLACE FUNCTION can_user_perform_action(
  user_id_param UUID,
  action_type TEXT -- 'chat', 'voice', 'document', 'assessment'
)
RETURNS BOOLEAN AS $$
DECLARE
  user_limits RECORD;
  current_usage INTEGER;
  usage_limit INTEGER;
BEGIN
  -- Get user limits and current usage
  SELECT * INTO user_limits FROM get_user_usage_limits(user_id_param);

  IF user_limits IS NULL THEN
    RETURN false;
  END IF;

  -- Check if feature is enabled for user's tier
  IF NOT (action_type = ANY(user_limits.features_enabled)) THEN
    RETURN false;
  END IF;

  -- Check specific limits
  CASE action_type
    WHEN 'chat' THEN
      current_usage := (user_limits.current_usage->>'chat_messages_used')::INTEGER;
      usage_limit := user_limits.chat_messages_limit;
    WHEN 'voice' THEN
      current_usage := (user_limits.current_usage->>'voice_messages_used')::INTEGER;
      usage_limit := user_limits.voice_messages_limit;
    WHEN 'document' THEN
      current_usage := (user_limits.current_usage->>'documents_uploaded')::INTEGER;
      usage_limit := user_limits.documents_limit;
    WHEN 'assessment' THEN
      current_usage := (user_limits.current_usage->>'assessments_completed')::INTEGER;
      usage_limit := user_limits.assessments_limit;
    ELSE
      RETURN false;
  END CASE;

  -- -1 means unlimited
  IF usage_limit = -1 THEN
    RETURN true;
  END IF;

  -- Check if under limit
  RETURN current_usage < usage_limit;
END;
$$ LANGUAGE plpgsql;

-- Function to track feature usage
CREATE OR REPLACE FUNCTION track_feature_usage(
  user_id_param UUID,
  feature_type_param TEXT,
  feature_action_param TEXT DEFAULT NULL,
  session_id_param UUID DEFAULT NULL,
  metadata_param JSONB DEFAULT '{}'
)
RETURNS BOOLEAN AS $$
DECLARE
  current_month TEXT;
  user_tier TEXT;
BEGIN
  current_month := TO_CHAR(CURRENT_DATE, 'YYYY-MM');

  -- Get user tier
  SELECT COALESCE(s.tierId, 'free') INTO user_tier
  FROM user_subscriptions s
  WHERE s.userId = user_id_param AND s.status = 'active'
  ORDER BY s.created_at DESC
  LIMIT 1;

  -- Log feature usage
  INSERT INTO feature_usage_log (
    user_id,
    feature_type,
    feature_action,
    session_id,
    metadata,
    tier_id
  ) VALUES (
    user_id_param,
    feature_type_param,
    feature_action_param,
    session_id_param,
    metadata_param,
    user_tier
  );

  -- Update usage tracking
  INSERT INTO user_usage_tracking (
    user_id,
    month_year,
    chat_messages_used,
    voice_messages_used,
    documents_uploaded,
    assessments_completed,
    tier_id
  ) VALUES (
    user_id_param,
    current_month,
    CASE WHEN feature_type_param = 'chat' THEN 1 ELSE 0 END,
    CASE WHEN feature_type_param = 'voice' THEN 1 ELSE 0 END,
    CASE WHEN feature_type_param = 'document' THEN 1 ELSE 0 END,
    CASE WHEN feature_type_param = 'assessment' THEN 1 ELSE 0 END,
    user_tier
  )
  ON CONFLICT (user_id, month_year)
  DO UPDATE SET
    chat_messages_used = user_usage_tracking.chat_messages_used +
      CASE WHEN feature_type_param = 'chat' THEN 1 ELSE 0 END,
    voice_messages_used = user_usage_tracking.voice_messages_used +
      CASE WHEN feature_type_param = 'voice' THEN 1 ELSE 0 END,
    documents_uploaded = user_usage_tracking.documents_uploaded +
      CASE WHEN feature_type_param = 'document' THEN 1 ELSE 0 END,
    assessments_completed = user_usage_tracking.assessments_completed +
      CASE WHEN feature_type_param = 'assessment' THEN 1 ELSE 0 END,
    tier_id = user_tier,
    updated_at = NOW();

  RETURN true;
END;
$$ LANGUAGE plpgsql;

-- Function to check API rate limit
CREATE OR REPLACE FUNCTION check_api_rate_limit(
  user_id_param UUID,
  endpoint_param TEXT,
  method_param TEXT DEFAULT 'POST',
  ip_address_param INET DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
  minute_bucket TEXT;
  current_requests INTEGER;
  rate_limit INTEGER;
BEGIN
  -- Generate minute bucket
  minute_bucket := TO_CHAR(NOW(), 'YYYY-MM-DD-HH24-MI');

  -- Get user's rate limit
  SELECT ul.api_requests_per_minute INTO rate_limit
  FROM get_user_usage_limits(user_id_param) ul;

  IF rate_limit IS NULL THEN
    rate_limit := 30; -- Default limit
  END IF;

  -- Count requests in current minute
  SELECT COUNT(*) INTO current_requests
  FROM api_request_log
  WHERE user_id = user_id_param AND minute_bucket = minute_bucket;

  -- Log this request
  INSERT INTO api_request_log (
    user_id,
    endpoint,
    method,
    ip_address,
    minute_bucket
  ) VALUES (
    user_id_param,
    endpoint_param,
    method_param,
    ip_address_param,
    minute_bucket
  );

  -- Check if under limit
  RETURN current_requests < rate_limit;
END;
$$ LANGUAGE plpgsql;

-- Function to reset monthly usage (run via cron)
CREATE OR REPLACE FUNCTION reset_monthly_usage()
RETURNS INTEGER AS $$
DECLARE
  reset_count INTEGER;
  current_month TEXT;
BEGIN
  current_month := TO_CHAR(CURRENT_DATE, 'YYYY-MM');

  -- Reset usage for users who haven't been reset this month
  UPDATE user_usage_tracking
  SET
    chat_messages_used = 0,
    voice_messages_used = 0,
    documents_uploaded = 0,
    assessments_completed = 0,
    last_reset_date = CURRENT_DATE,
    updated_at = NOW()
  WHERE
    month_year != current_month
    OR last_reset_date != CURRENT_DATE
    OR last_reset_date IS NULL;

  GET DIAGNOSTICS reset_count = ROW_COUNT;

  RETURN reset_count;
END;
$$ LANGUAGE plpgsql;

-- Function to get usage analytics for admin
CREATE OR REPLACE FUNCTION get_usage_analytics(
  start_date DATE DEFAULT CURRENT_DATE - INTERVAL '30 days',
  end_date DATE DEFAULT CURRENT_DATE
)
RETURNS TABLE (
  tier_id TEXT,
  total_users INTEGER,
  avg_chat_messages DECIMAL,
  avg_voice_messages DECIMAL,
  avg_documents DECIMAL,
  avg_assessments DECIMAL,
  limit_breaches INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    ut.tier_id,
    COUNT(DISTINCT ut.user_id)::INTEGER as total_users,
    AVG(ut.chat_messages_used) as avg_chat_messages,
    AVG(ut.voice_messages_used) as avg_voice_messages,
    AVG(ut.documents_uploaded) as avg_documents,
    AVG(ut.assessments_completed) as avg_assessments,
    COUNT(*)::INTEGER FILTER (
      WHERE (ul.chat_messages_limit > 0 AND ut.chat_messages_used >= ul.chat_messages_limit)
      OR (ul.voice_messages_limit > 0 AND ut.voice_messages_used >= ul.voice_messages_limit)
      OR (ul.documents_limit > 0 AND ut.documents_uploaded >= ul.documents_limit)
    ) as limit_breaches
  FROM user_usage_tracking ut
  LEFT JOIN usage_limits_config ul ON ut.tier_id = ul.tier_id
  WHERE ut.created_at BETWEEN start_date AND end_date
  GROUP BY ut.tier_id;
END;
$$ LANGUAGE plpgsql;