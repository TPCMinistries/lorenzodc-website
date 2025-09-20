-- Admin Dashboard & Analytics Schema
-- Provides comprehensive business intelligence, user management, and platform oversight

-- 45. Admin Users & Roles
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Admin profile
  admin_email TEXT NOT NULL,
  admin_name TEXT,
  role TEXT DEFAULT 'admin' CHECK (role IN ('super_admin', 'admin', 'moderator', 'support')),

  -- Permissions
  permissions JSONB DEFAULT '{}', -- Granular permissions object
  can_manage_users BOOLEAN DEFAULT false,
  can_view_analytics BOOLEAN DEFAULT true,
  can_manage_content BOOLEAN DEFAULT false,
  can_manage_billing BOOLEAN DEFAULT false,
  can_manage_admins BOOLEAN DEFAULT false,

  -- Status
  is_active BOOLEAN DEFAULT true,
  last_login_at TIMESTAMP WITH TIME ZONE,
  created_by UUID REFERENCES admin_users(id),

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(user_id)
);

-- 46. Admin Activity Logs
CREATE TABLE IF NOT EXISTS admin_activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES admin_users(id) ON DELETE SET NULL,

  -- Activity details
  action TEXT NOT NULL, -- 'user_suspended', 'analytics_viewed', 'content_moderated', etc.
  resource_type TEXT, -- 'user', 'goal', 'subscription', 'content', etc.
  resource_id TEXT, -- ID of the affected resource

  -- Context
  description TEXT,
  metadata JSONB DEFAULT '{}', -- Additional context data
  ip_address INET,
  user_agent TEXT,

  -- Impact
  severity TEXT DEFAULT 'info' CHECK (severity IN ('low', 'info', 'warning', 'high', 'critical')),

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 47. Platform Analytics Snapshots
CREATE TABLE IF NOT EXISTS analytics_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Snapshot metadata
  snapshot_date DATE DEFAULT CURRENT_DATE,
  snapshot_type TEXT DEFAULT 'daily' CHECK (snapshot_type IN ('hourly', 'daily', 'weekly', 'monthly')),

  -- User metrics
  total_users INTEGER DEFAULT 0,
  active_users_24h INTEGER DEFAULT 0,
  active_users_7d INTEGER DEFAULT 0,
  active_users_30d INTEGER DEFAULT 0,
  new_signups_today INTEGER DEFAULT 0,

  -- Subscription metrics
  free_users INTEGER DEFAULT 0,
  basic_subscribers INTEGER DEFAULT 0,
  plus_subscribers INTEGER DEFAULT 0,
  enterprise_subscribers INTEGER DEFAULT 0,
  total_mrr DECIMAL(15,2) DEFAULT 0,

  -- Usage metrics
  chat_messages_today INTEGER DEFAULT 0,
  voice_messages_today INTEGER DEFAULT 0,
  documents_uploaded_today INTEGER DEFAULT 0,
  assessments_completed_today INTEGER DEFAULT 0,

  -- Goal metrics
  active_goals INTEGER DEFAULT 0,
  goals_completed_today INTEGER DEFAULT 0,

  -- Email metrics
  emails_sent_today INTEGER DEFAULT 0,
  emails_opened_today INTEGER DEFAULT 0,
  email_open_rate DECIMAL(5,2) DEFAULT 0,

  -- Conversion metrics
  trial_to_paid_conversions INTEGER DEFAULT 0,
  conversion_rate DECIMAL(5,2) DEFAULT 0,

  -- Financial metrics
  revenue_today DECIMAL(15,2) DEFAULT 0,
  revenue_mtd DECIMAL(15,2) DEFAULT 0,
  avg_customer_value DECIMAL(15,2) DEFAULT 0,

  -- System metrics
  api_calls_today INTEGER DEFAULT 0,
  avg_response_time_ms INTEGER DEFAULT 0,
  error_rate DECIMAL(5,2) DEFAULT 0,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(snapshot_date, snapshot_type)
);

-- 48. User Management Views
CREATE TABLE IF NOT EXISTS user_management_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES admin_users(id) ON DELETE SET NULL,
  target_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Action details
  action_type TEXT NOT NULL CHECK (action_type IN ('suspend', 'unsuspend', 'delete', 'reset_password', 'change_subscription', 'add_note')),
  reason TEXT,
  notes TEXT,

  -- Previous state (for rollback)
  previous_state JSONB DEFAULT '{}',
  new_state JSONB DEFAULT '{}',

  -- Status
  status TEXT DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed', 'rolled_back')),

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 49. Feature Flags & A/B Tests
CREATE TABLE IF NOT EXISTS feature_flags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Flag details
  flag_name TEXT NOT NULL UNIQUE,
  flag_description TEXT,
  flag_type TEXT DEFAULT 'boolean' CHECK (flag_type IN ('boolean', 'string', 'number', 'json')),

  -- Configuration
  is_enabled BOOLEAN DEFAULT false,
  default_value JSONB DEFAULT 'false',

  -- Targeting
  target_user_percentage DECIMAL(5,2) DEFAULT 0, -- 0-100
  target_user_segments JSONB DEFAULT '[]', -- Array of user segments
  target_subscription_tiers JSONB DEFAULT '[]', -- Array of subscription tiers

  -- A/B Testing
  is_ab_test BOOLEAN DEFAULT false,
  ab_test_variants JSONB DEFAULT '{}', -- Object with variant configurations
  ab_test_traffic_split JSONB DEFAULT '{}', -- Traffic allocation per variant

  -- Metadata
  created_by UUID REFERENCES admin_users(id),
  environment TEXT DEFAULT 'production' CHECK (environment IN ('development', 'staging', 'production')),

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 50. System Health Monitoring
CREATE TABLE IF NOT EXISTS system_health_checks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Check details
  check_name TEXT NOT NULL,
  check_type TEXT NOT NULL CHECK (check_type IN ('database', 'api', 'external_service', 'storage', 'email')),

  -- Results
  status TEXT NOT NULL CHECK (status IN ('healthy', 'warning', 'critical', 'unknown')),
  response_time_ms INTEGER,
  error_message TEXT,

  -- Metrics
  success_rate DECIMAL(5,2),
  avg_response_time DECIMAL(10,2),

  -- Context
  check_metadata JSONB DEFAULT '{}',

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_admin_activity_logs_admin_id ON admin_activity_logs(admin_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_activity_logs_action ON admin_activity_logs(action, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_snapshots_date ON analytics_snapshots(snapshot_date DESC, snapshot_type);
CREATE INDEX IF NOT EXISTS idx_user_management_actions_user ON user_management_actions(target_user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_system_health_checks_status ON system_health_checks(check_type, status, created_at DESC);

-- RLS Policies
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_management_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE feature_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_health_checks ENABLE ROW LEVEL SECURITY;

-- Only admin users can access admin tables
CREATE POLICY "Admin users only" ON admin_users
  FOR ALL USING (
    EXISTS(
      SELECT 1 FROM admin_users au
      WHERE au.user_id = auth.uid() AND au.is_active = true
    )
  );

CREATE POLICY "Admins can view activity logs" ON admin_activity_logs
  FOR SELECT USING (
    EXISTS(
      SELECT 1 FROM admin_users au
      WHERE au.user_id = auth.uid() AND au.is_active = true
    )
  );

CREATE POLICY "Admins can view analytics" ON analytics_snapshots
  FOR SELECT USING (
    EXISTS(
      SELECT 1 FROM admin_users au
      WHERE au.user_id = auth.uid() AND au.is_active = true AND au.can_view_analytics = true
    )
  );

-- Admin Functions

-- Function to create daily analytics snapshot
CREATE OR REPLACE FUNCTION create_daily_analytics_snapshot()
RETURNS UUID AS $$
DECLARE
  snapshot_id UUID;
  today DATE := CURRENT_DATE;
  yesterday DATE := CURRENT_DATE - INTERVAL '1 day';
BEGIN
  -- Check if snapshot already exists for today
  SELECT id INTO snapshot_id FROM analytics_snapshots
  WHERE snapshot_date = today AND snapshot_type = 'daily';

  IF snapshot_id IS NOT NULL THEN
    RETURN snapshot_id;
  END IF;

  -- Create new snapshot
  INSERT INTO analytics_snapshots (
    snapshot_date,
    snapshot_type,
    total_users,
    active_users_24h,
    active_users_7d,
    active_users_30d,
    new_signups_today,
    free_users,
    basic_subscribers,
    plus_subscribers,
    enterprise_subscribers,
    chat_messages_today,
    voice_messages_today,
    documents_uploaded_today,
    assessments_completed_today,
    active_goals,
    goals_completed_today
  )
  SELECT
    today,
    'daily',
    (SELECT COUNT(*) FROM auth.users WHERE created_at <= NOW()),
    (SELECT COUNT(DISTINCT user_id) FROM usage_tracking WHERE created_at >= yesterday),
    (SELECT COUNT(DISTINCT user_id) FROM usage_tracking WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'),
    (SELECT COUNT(DISTINCT user_id) FROM usage_tracking WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'),
    (SELECT COUNT(*) FROM auth.users WHERE created_at >= today),
    (SELECT COUNT(*) FROM auth.users u WHERE NOT EXISTS(SELECT 1 FROM user_subscriptions s WHERE s.userId = u.id AND s.status = 'active')),
    (SELECT COUNT(*) FROM user_subscriptions WHERE tierId = 'catalyst_basic' AND status = 'active'),
    (SELECT COUNT(*) FROM user_subscriptions WHERE tierId = 'catalyst_plus' AND status = 'active'),
    (SELECT COUNT(*) FROM user_subscriptions WHERE tierId = 'enterprise' AND status = 'active'),
    (SELECT COUNT(*) FROM usage_tracking WHERE feature_type = 'chat' AND created_at >= today),
    (SELECT COUNT(*) FROM usage_tracking WHERE feature_type = 'voice' AND created_at >= today),
    (SELECT COUNT(*) FROM usage_tracking WHERE feature_type = 'document' AND created_at >= today),
    (SELECT COUNT(*) FROM usage_tracking WHERE feature_type = 'assessment' AND created_at >= today),
    (SELECT COUNT(*) FROM user_goals WHERE status = 'active'),
    (SELECT COUNT(*) FROM user_goals WHERE status = 'completed' AND completed_at >= today)
  RETURNING id INTO snapshot_id;

  RETURN snapshot_id;
END;
$$ LANGUAGE plpgsql;

-- Function to get user analytics for admin dashboard
CREATE OR REPLACE FUNCTION get_admin_user_analytics(
  start_date DATE DEFAULT CURRENT_DATE - INTERVAL '30 days',
  end_date DATE DEFAULT CURRENT_DATE
)
RETURNS TABLE (
  date DATE,
  new_signups INTEGER,
  active_users INTEGER,
  churn_count INTEGER,
  total_users INTEGER,
  conversion_events INTEGER
) AS $$
BEGIN
  RETURN QUERY
  WITH date_series AS (
    SELECT generate_series(start_date, end_date, '1 day'::interval)::date AS date
  ),
  daily_signups AS (
    SELECT
      created_at::date AS date,
      COUNT(*) AS new_signups
    FROM auth.users
    WHERE created_at::date BETWEEN start_date AND end_date
    GROUP BY created_at::date
  ),
  daily_active AS (
    SELECT
      created_at::date AS date,
      COUNT(DISTINCT user_id) AS active_users
    FROM usage_tracking
    WHERE created_at::date BETWEEN start_date AND end_date
    GROUP BY created_at::date
  )
  SELECT
    ds.date,
    COALESCE(ds_signup.new_signups, 0)::INTEGER,
    COALESCE(da.active_users, 0)::INTEGER,
    0::INTEGER AS churn_count, -- TODO: Implement churn calculation
    (SELECT COUNT(*) FROM auth.users WHERE created_at::date <= ds.date)::INTEGER AS total_users,
    0::INTEGER AS conversion_events -- TODO: Implement conversion events
  FROM date_series ds
  LEFT JOIN daily_signups ds_signup ON ds.date = ds_signup.date
  LEFT JOIN daily_active da ON ds.date = da.date
  ORDER BY ds.date;
END;
$$ LANGUAGE plpgsql;

-- Function to get subscription revenue analytics
CREATE OR REPLACE FUNCTION get_subscription_revenue_analytics(
  start_date DATE DEFAULT CURRENT_DATE - INTERVAL '30 days',
  end_date DATE DEFAULT CURRENT_DATE
)
RETURNS TABLE (
  tier_id TEXT,
  subscriber_count INTEGER,
  monthly_revenue DECIMAL,
  avg_customer_value DECIMAL,
  churn_rate DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    s.tierId,
    COUNT(*)::INTEGER AS subscriber_count,
    SUM(
      CASE s.tierId
        WHEN 'catalyst_basic' THEN 19.00
        WHEN 'catalyst_plus' THEN 39.00
        WHEN 'enterprise' THEN 199.00
        ELSE 0
      END
    ) AS monthly_revenue,
    AVG(
      CASE s.tierId
        WHEN 'catalyst_basic' THEN 19.00
        WHEN 'catalyst_plus' THEN 39.00
        WHEN 'enterprise' THEN 199.00
        ELSE 0
      END
    ) AS avg_customer_value,
    0.0::DECIMAL AS churn_rate -- TODO: Calculate actual churn rate
  FROM user_subscriptions s
  WHERE s.status = 'active'
    AND s.created_at BETWEEN start_date AND end_date + INTERVAL '1 day'
  GROUP BY s.tierId
  ORDER BY monthly_revenue DESC;
END;
$$ LANGUAGE plpgsql;

-- Function to get feature usage analytics
CREATE OR REPLACE FUNCTION get_feature_usage_analytics(
  time_period_days INTEGER DEFAULT 30
)
RETURNS TABLE (
  feature_type TEXT,
  total_usage INTEGER,
  unique_users INTEGER,
  avg_per_user DECIMAL,
  growth_rate DECIMAL
) AS $$
DECLARE
  start_date DATE := CURRENT_DATE - INTERVAL '1 day' * time_period_days;
  comparison_start DATE := start_date - INTERVAL '1 day' * time_period_days;
BEGIN
  RETURN QUERY
  WITH current_period AS (
    SELECT
      ut.feature_type,
      COUNT(*) AS total_usage,
      COUNT(DISTINCT ut.user_id) AS unique_users
    FROM usage_tracking ut
    WHERE ut.created_at >= start_date
    GROUP BY ut.feature_type
  ),
  previous_period AS (
    SELECT
      ut.feature_type,
      COUNT(*) AS total_usage
    FROM usage_tracking ut
    WHERE ut.created_at BETWEEN comparison_start AND start_date
    GROUP BY ut.feature_type
  )
  SELECT
    cp.feature_type,
    cp.total_usage::INTEGER,
    cp.unique_users::INTEGER,
    CASE
      WHEN cp.unique_users > 0 THEN ROUND(cp.total_usage::DECIMAL / cp.unique_users, 2)
      ELSE 0::DECIMAL
    END AS avg_per_user,
    CASE
      WHEN pp.total_usage > 0 THEN ROUND(((cp.total_usage - pp.total_usage)::DECIMAL / pp.total_usage) * 100, 2)
      ELSE 0::DECIMAL
    END AS growth_rate
  FROM current_period cp
  LEFT JOIN previous_period pp ON cp.feature_type = pp.feature_type
  ORDER BY cp.total_usage DESC;
END;
$$ LANGUAGE plpgsql;

-- Function to log admin activity
CREATE OR REPLACE FUNCTION log_admin_activity(
  admin_user_id UUID,
  action_param TEXT,
  resource_type_param TEXT DEFAULT NULL,
  resource_id_param TEXT DEFAULT NULL,
  description_param TEXT DEFAULT NULL,
  metadata_param JSONB DEFAULT '{}'
)
RETURNS UUID AS $$
DECLARE
  log_id UUID;
BEGIN
  INSERT INTO admin_activity_logs (
    admin_id,
    action,
    resource_type,
    resource_id,
    description,
    metadata,
    ip_address,
    severity
  ) VALUES (
    admin_user_id,
    action_param,
    resource_type_param,
    resource_id_param,
    description_param,
    metadata_param,
    inet_client_addr(),
    CASE
      WHEN action_param IN ('user_deleted', 'admin_created', 'subscription_cancelled') THEN 'high'
      WHEN action_param IN ('user_suspended', 'content_moderated') THEN 'warning'
      ELSE 'info'
    END
  ) RETURNING id INTO log_id;

  RETURN log_id;
END;
$$ LANGUAGE plpgsql;

-- Insert initial admin user (replace with actual admin email)
-- INSERT INTO admin_users (user_id, admin_email, admin_name, role, can_manage_users, can_view_analytics, can_manage_content, can_manage_billing, can_manage_admins)
-- VALUES (
--   (SELECT id FROM auth.users WHERE email = 'admin@catalystai.com' LIMIT 1),
--   'admin@catalystai.com',
--   'System Administrator',
--   'super_admin',
--   true,
--   true,
--   true,
--   true,
--   true
-- );

-- Function to get admin activity logs with filtering
CREATE OR REPLACE FUNCTION get_admin_activity_logs(
  action_type_filter TEXT DEFAULT NULL,
  entity_type_filter TEXT DEFAULT NULL,
  date_filter TEXT DEFAULT '7d',
  user_id_filter UUID DEFAULT NULL,
  row_limit INTEGER DEFAULT 100
)
RETURNS TABLE (
  id UUID,
  user_id UUID,
  user_email TEXT,
  action_type TEXT,
  entity_type TEXT,
  entity_id TEXT,
  description TEXT,
  metadata JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE
) AS $$
DECLARE
  date_threshold TIMESTAMP WITH TIME ZONE;
BEGIN
  -- Calculate date threshold based on filter
  date_threshold := CASE
    WHEN date_filter = '1d' THEN CURRENT_TIMESTAMP - INTERVAL '1 day'
    WHEN date_filter = '7d' THEN CURRENT_TIMESTAMP - INTERVAL '7 days'
    WHEN date_filter = '30d' THEN CURRENT_TIMESTAMP - INTERVAL '30 days'
    WHEN date_filter = '90d' THEN CURRENT_TIMESTAMP - INTERVAL '90 days'
    ELSE CURRENT_TIMESTAMP - INTERVAL '7 days'
  END;

  RETURN QUERY
  SELECT
    al.id,
    al.user_id,
    COALESCE(au.email, 'Unknown User') as user_email,
    al.action_type,
    al.entity_type,
    al.entity_id,
    al.description,
    al.metadata,
    al.ip_address,
    al.user_agent,
    al.created_at
  FROM admin_activity_logs al
  LEFT JOIN auth.users au ON al.user_id = au.id
  WHERE
    al.created_at >= date_threshold
    AND (action_type_filter IS NULL OR al.action_type = action_type_filter)
    AND (entity_type_filter IS NULL OR al.entity_type = entity_type_filter)
    AND (user_id_filter IS NULL OR al.user_id = user_id_filter)
  ORDER BY al.created_at DESC
  LIMIT row_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users (admin check will be done in app)
GRANT EXECUTE ON FUNCTION get_admin_activity_logs TO authenticated;

-- Trigger to create daily snapshots automatically
CREATE OR REPLACE FUNCTION trigger_daily_snapshot()
RETURNS TRIGGER AS $$
BEGIN
  -- This would be called by a cron job or scheduled task
  PERFORM create_daily_analytics_snapshot();
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;