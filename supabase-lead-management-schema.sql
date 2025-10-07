-- ============================================================================
-- SUPABASE SCHEMA FOR LEAD GENERATION & RELATIONSHIP MANAGEMENT SYSTEM
-- ============================================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 1. PROSPECT PROFILES TABLE
-- ============================================================================
CREATE TABLE prospect_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Contact Information
    email TEXT UNIQUE,
    name TEXT,
    phone TEXT,
    company TEXT,
    role TEXT,

    -- Qualification Data
    lead_score INTEGER DEFAULT 0,
    category TEXT CHECK (category IN (
        'enterprise_ai',
        'ministry_coaching',
        'investment_fund',
        'strategic_consulting',
        'speaking_engagement',
        'platform_user',
        'undetermined'
    )),
    tier TEXT CHECK (tier IN ('tier_1', 'tier_2', 'tier_3', 'tier_4')) DEFAULT 'tier_4',

    -- Behavioral Data
    interests TEXT[] DEFAULT '{}',
    page_views TEXT[] DEFAULT '{}',
    source TEXT,
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    utm_content TEXT,
    utm_term TEXT,

    -- Assessment Data
    assessment_data JSONB,
    form_data JSONB,

    -- Engagement Tracking
    status TEXT CHECK (status IN (
        'new',
        'qualified',
        'contacted',
        'nurturing',
        'opportunity',
        'closed'
    )) DEFAULT 'new',

    last_engagement_at TIMESTAMPTZ DEFAULT NOW(),
    booking_count INTEGER DEFAULT 0,
    email_opens INTEGER DEFAULT 0,
    email_clicks INTEGER DEFAULT 0,

    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    -- Indexes for performance
    CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Create indexes for common queries
CREATE INDEX idx_prospect_profiles_email ON prospect_profiles(email);
CREATE INDEX idx_prospect_profiles_category ON prospect_profiles(category);
CREATE INDEX idx_prospect_profiles_tier ON prospect_profiles(tier);
CREATE INDEX idx_prospect_profiles_lead_score ON prospect_profiles(lead_score);
CREATE INDEX idx_prospect_profiles_status ON prospect_profiles(status);
CREATE INDEX idx_prospect_profiles_source ON prospect_profiles(source);
CREATE INDEX idx_prospect_profiles_created_at ON prospect_profiles(created_at);

-- ============================================================================
-- 2. LEAD ATTRIBUTION TRACKING
-- ============================================================================
CREATE TABLE lead_attribution (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    prospect_id UUID REFERENCES prospect_profiles(id) ON DELETE CASCADE,

    -- UTM Parameters
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    utm_content TEXT,
    utm_term TEXT,

    -- Traffic Data
    referrer TEXT,
    landing_page TEXT,
    device_type TEXT CHECK (device_type IN ('desktop', 'mobile', 'tablet')),
    ip_address INET,
    user_agent TEXT,

    -- Session Data
    session_id TEXT,
    visit_count INTEGER DEFAULT 1,

    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_lead_attribution_prospect_id ON lead_attribution(prospect_id);
CREATE INDEX idx_lead_attribution_utm_source ON lead_attribution(utm_source);
CREATE INDEX idx_lead_attribution_utm_campaign ON lead_attribution(utm_campaign);

-- ============================================================================
-- 3. EMAIL AUTOMATION EVENTS
-- ============================================================================
CREATE TABLE email_automation_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    prospect_id UUID REFERENCES prospect_profiles(id) ON DELETE CASCADE,

    -- Event Details
    event_type TEXT CHECK (event_type IN (
        'assessment_completed',
        'upgrade_completed',
        'trial_started',
        'goal_set',
        'document_uploaded',
        'conversation_milestone',
        'nurturing_sequence',
        'lead_magnet_downloaded',
        'booking_confirmed'
    )),

    campaign_name TEXT NOT NULL,
    event_data JSONB,

    -- Delivery Status
    status TEXT CHECK (status IN ('pending', 'sent', 'delivered', 'opened', 'clicked', 'failed')) DEFAULT 'pending',
    immediate_send BOOLEAN DEFAULT true,

    -- Email Platform Data
    email_platform TEXT DEFAULT 'convertkit', -- or 'mailchimp', 'activecampaign', etc.
    external_id TEXT, -- ID from email platform

    -- Timestamps
    scheduled_for TIMESTAMPTZ DEFAULT NOW(),
    sent_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ,
    opened_at TIMESTAMPTZ,
    clicked_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_email_events_prospect_id ON email_automation_events(prospect_id);
CREATE INDEX idx_email_events_event_type ON email_automation_events(event_type);
CREATE INDEX idx_email_events_campaign_name ON email_automation_events(campaign_name);
CREATE INDEX idx_email_events_status ON email_automation_events(status);
CREATE INDEX idx_email_events_scheduled_for ON email_automation_events(scheduled_for);

-- ============================================================================
-- 4. LEAD SCORING HISTORY
-- ============================================================================
CREATE TABLE lead_scoring_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    prospect_id UUID REFERENCES prospect_profiles(id) ON DELETE CASCADE,

    score_change INTEGER NOT NULL,
    new_total_score INTEGER NOT NULL,
    reason TEXT NOT NULL,

    -- Context Data
    source_event TEXT, -- 'assessment_completed', 'page_view', 'email_click', etc.
    event_data JSONB,

    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_lead_scoring_prospect_id ON lead_scoring_history(prospect_id);
CREATE INDEX idx_lead_scoring_reason ON lead_scoring_history(reason);
CREATE INDEX idx_lead_scoring_created_at ON lead_scoring_history(created_at);

-- ============================================================================
-- 5. SOCIAL MEDIA CONVERSIONS
-- ============================================================================
CREATE TABLE social_conversions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    prospect_id UUID REFERENCES prospect_profiles(id) ON DELETE CASCADE,

    -- Platform Data
    platform TEXT CHECK (platform IN ('facebook', 'google', 'linkedin', 'twitter')) NOT NULL,
    event_type TEXT CHECK (event_type IN ('signup', 'assessment', 'purchase', 'lead', 'add_to_cart', 'initiate_checkout', 'view_content')) NOT NULL,

    -- Conversion Data
    event_value DECIMAL(10,2) DEFAULT 0,
    currency TEXT DEFAULT 'USD',

    -- Platform Response
    platform_response JSONB,
    success BOOLEAN DEFAULT true,

    -- Metadata
    metadata JSONB,

    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_social_conversions_prospect_id ON social_conversions(prospect_id);
CREATE INDEX idx_social_conversions_platform ON social_conversions(platform);
CREATE INDEX idx_social_conversions_event_type ON social_conversions(event_type);

-- ============================================================================
-- 6. BOOKING EVENTS
-- ============================================================================
CREATE TABLE booking_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    prospect_id UUID REFERENCES prospect_profiles(id) ON DELETE CASCADE,

    -- Booking Details
    call_type TEXT CHECK (call_type IN (
        'executive_strategy',
        'divine_strategy',
        'ai_implementation',
        'general_discovery'
    )) NOT NULL,

    calendly_url TEXT,
    calendly_event_id TEXT,

    -- Estimated Values
    estimated_value DECIMAL(10,2) DEFAULT 0,
    actual_value DECIMAL(10,2),

    -- Status Tracking
    status TEXT CHECK (status IN ('scheduled', 'confirmed', 'completed', 'cancelled', 'no_show')) DEFAULT 'scheduled',

    -- Preparation
    preparation_guide_sent BOOLEAN DEFAULT false,
    reminder_sent BOOLEAN DEFAULT false,

    -- Meeting Data
    scheduled_for TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,

    -- Notes and Outcomes
    meeting_notes TEXT,
    next_steps TEXT,
    outcome TEXT CHECK (outcome IN ('qualified', 'proposal_sent', 'closed_won', 'closed_lost', 'follow_up')),

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_booking_events_prospect_id ON booking_events(prospect_id);
CREATE INDEX idx_booking_events_call_type ON booking_events(call_type);
CREATE INDEX idx_booking_events_status ON booking_events(status);
CREATE INDEX idx_booking_events_scheduled_for ON booking_events(scheduled_for);

-- ============================================================================
-- 7. LEAD MAGNETS TRACKING
-- ============================================================================
CREATE TABLE lead_magnet_downloads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    prospect_id UUID REFERENCES prospect_profiles(id) ON DELETE CASCADE,

    -- Magnet Details
    magnet_type TEXT CHECK (magnet_type IN (
        'ai_readiness_checklist',
        'divine_strategy_guide',
        'kingdom_economics_framework',
        'enterprise_transformation_blueprint'
    )) NOT NULL,

    -- Download Data
    download_url TEXT,
    ip_address INET,
    user_agent TEXT,

    -- Follow-up Tracking
    follow_up_sequence_triggered BOOLEAN DEFAULT false,
    sequence_name TEXT,

    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_lead_magnets_prospect_id ON lead_magnet_downloads(prospect_id);
CREATE INDEX idx_lead_magnets_magnet_type ON lead_magnet_downloads(magnet_type);
CREATE INDEX idx_lead_magnets_created_at ON lead_magnet_downloads(created_at);

-- ============================================================================
-- FUNCTIONS FOR AUTOMATION
-- ============================================================================

-- Function to update prospect lead score
CREATE OR REPLACE FUNCTION update_lead_score(
    user_id_param UUID,
    score_change INTEGER,
    reason TEXT,
    event_data JSONB DEFAULT NULL
) RETURNS INTEGER AS $$
DECLARE
    new_score INTEGER;
BEGIN
    -- Update the prospect's lead score
    UPDATE prospect_profiles
    SET
        lead_score = lead_score + score_change,
        updated_at = NOW(),
        last_engagement_at = NOW()
    WHERE id = user_id_param
    RETURNING lead_score INTO new_score;

    -- Record the scoring event
    INSERT INTO lead_scoring_history (
        prospect_id,
        score_change,
        new_total_score,
        reason,
        event_data
    ) VALUES (
        user_id_param,
        score_change,
        new_score,
        reason,
        event_data
    );

    RETURN new_score;
END;
$$ LANGUAGE plpgsql;

-- Function to track lead attribution
CREATE OR REPLACE FUNCTION track_lead_attribution(
    user_id_param UUID,
    utm_data JSONB,
    traffic_data JSONB
) RETURNS BOOLEAN AS $$
BEGIN
    INSERT INTO lead_attribution (
        prospect_id,
        utm_source,
        utm_medium,
        utm_campaign,
        utm_content,
        utm_term,
        referrer,
        landing_page,
        device_type,
        ip_address,
        user_agent
    ) VALUES (
        user_id_param,
        utm_data->>'utm_source',
        utm_data->>'utm_medium',
        utm_data->>'utm_campaign',
        utm_data->>'utm_content',
        utm_data->>'utm_term',
        traffic_data->>'referrer',
        traffic_data->>'landing_page',
        traffic_data->>'device_type',
        CAST(traffic_data->>'ip_address' AS INET),
        traffic_data->>'user_agent'
    );

    RETURN TRUE;
EXCEPTION WHEN OTHERS THEN
    RETURN FALSE;
END;
$$ LANGUAGE plpgsql;

-- Function to track social media conversions
CREATE OR REPLACE FUNCTION track_social_conversion(
    user_id_param UUID,
    platform_param TEXT,
    event_type_param TEXT,
    event_value_param DECIMAL DEFAULT 0,
    metadata_param JSONB DEFAULT NULL
) RETURNS BOOLEAN AS $$
BEGIN
    INSERT INTO social_conversions (
        prospect_id,
        platform,
        event_type,
        event_value,
        metadata
    ) VALUES (
        user_id_param,
        platform_param,
        event_type_param,
        event_value_param,
        metadata_param
    );

    RETURN TRUE;
EXCEPTION WHEN OTHERS THEN
    RETURN FALSE;
END;
$$ LANGUAGE plpgsql;

-- Function to get prospect analytics
CREATE OR REPLACE FUNCTION get_prospect_analytics(
    date_from TIMESTAMPTZ DEFAULT NOW() - INTERVAL '30 days',
    date_to TIMESTAMPTZ DEFAULT NOW()
) RETURNS TABLE (
    total_prospects BIGINT,
    new_prospects BIGINT,
    qualified_prospects BIGINT,
    bookings_scheduled BIGINT,
    average_lead_score NUMERIC,
    top_source TEXT,
    conversion_rate NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        COUNT(*)::BIGINT as total_prospects,
        COUNT(*) FILTER (WHERE created_at >= date_from)::BIGINT as new_prospects,
        COUNT(*) FILTER (WHERE lead_score >= 25)::BIGINT as qualified_prospects,
        (SELECT COUNT(*) FROM booking_events WHERE created_at >= date_from AND created_at <= date_to)::BIGINT as bookings_scheduled,
        ROUND(AVG(lead_score), 2) as average_lead_score,
        (SELECT source FROM prospect_profiles WHERE created_at >= date_from GROUP BY source ORDER BY COUNT(*) DESC LIMIT 1) as top_source,
        CASE
            WHEN COUNT(*) > 0 THEN ROUND((COUNT(*) FILTER (WHERE booking_count > 0)::NUMERIC / COUNT(*)::NUMERIC) * 100, 2)
            ELSE 0
        END as conversion_rate
    FROM prospect_profiles
    WHERE created_at <= date_to;
END;
$$ LANGUAGE plpgsql;

-- Function to get prospect by email or create new one
CREATE OR REPLACE FUNCTION upsert_prospect(
    email_param TEXT,
    name_param TEXT DEFAULT NULL,
    company_param TEXT DEFAULT NULL,
    source_param TEXT DEFAULT 'website'
) RETURNS UUID AS $$
DECLARE
    prospect_id UUID;
BEGIN
    -- Try to find existing prospect
    SELECT id INTO prospect_id
    FROM prospect_profiles
    WHERE email = email_param;

    -- If found, update last engagement
    IF prospect_id IS NOT NULL THEN
        UPDATE prospect_profiles
        SET
            last_engagement_at = NOW(),
            updated_at = NOW(),
            name = COALESCE(name_param, name),
            company = COALESCE(company_param, company)
        WHERE id = prospect_id;

        RETURN prospect_id;
    END IF;

    -- If not found, create new prospect
    INSERT INTO prospect_profiles (
        email,
        name,
        company,
        source
    ) VALUES (
        email_param,
        name_param,
        company_param,
        source_param
    ) RETURNING id INTO prospect_id;

    RETURN prospect_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- ROW LEVEL SECURITY (OPTIONAL)
-- ============================================================================

-- Enable RLS if you want row-level security
-- ALTER TABLE prospect_profiles ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE lead_attribution ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE email_automation_events ENABLE ROW LEVEL SECURITY;

-- Create policies based on your authentication needs
-- Example: Allow authenticated users to see all records
-- CREATE POLICY "Allow authenticated users" ON prospect_profiles
--     FOR ALL USING (auth.role() = 'authenticated');

-- ============================================================================
-- VIEWS FOR REPORTING
-- ============================================================================

-- Prospect summary view
CREATE VIEW prospect_summary AS
SELECT
    p.*,
    la.utm_source as first_utm_source,
    la.utm_campaign as first_utm_campaign,
    la.referrer as first_referrer,
    COUNT(eae.id) as email_events_count,
    COUNT(be.id) as total_bookings,
    COUNT(lmd.id) as lead_magnets_downloaded,
    MAX(eae.opened_at) as last_email_opened,
    MAX(be.scheduled_for) as next_scheduled_call
FROM prospect_profiles p
LEFT JOIN lead_attribution la ON p.id = la.prospect_id
LEFT JOIN email_automation_events eae ON p.id = eae.prospect_id
LEFT JOIN booking_events be ON p.id = be.prospect_id
LEFT JOIN lead_magnet_downloads lmd ON p.id = lmd.prospect_id
GROUP BY p.id, la.utm_source, la.utm_campaign, la.referrer;

-- High-value prospects view
CREATE VIEW high_value_prospects AS
SELECT *
FROM prospect_summary
WHERE tier IN ('tier_1', 'tier_2')
   OR lead_score >= 30
   OR total_bookings > 0
ORDER BY lead_score DESC, created_at DESC;

-- Recent activity view
CREATE VIEW recent_activity AS
SELECT
    'prospect_created' as activity_type,
    p.id as prospect_id,
    p.name,
    p.email,
    p.created_at as activity_date,
    jsonb_build_object('category', p.category, 'source', p.source) as activity_data
FROM prospect_profiles p
WHERE p.created_at >= NOW() - INTERVAL '7 days'

UNION ALL

SELECT
    'email_event' as activity_type,
    eae.prospect_id,
    p.name,
    p.email,
    eae.created_at as activity_date,
    jsonb_build_object('event_type', eae.event_type, 'campaign', eae.campaign_name) as activity_data
FROM email_automation_events eae
JOIN prospect_profiles p ON eae.prospect_id = p.id
WHERE eae.created_at >= NOW() - INTERVAL '7 days'

UNION ALL

SELECT
    'booking_event' as activity_type,
    be.prospect_id,
    p.name,
    p.email,
    be.created_at as activity_date,
    jsonb_build_object('call_type', be.call_type, 'status', be.status) as activity_data
FROM booking_events be
JOIN prospect_profiles p ON be.prospect_id = p.id
WHERE be.created_at >= NOW() - INTERVAL '7 days'

ORDER BY activity_date DESC;

-- ============================================================================
-- TRIGGERS FOR AUTOMATIC UPDATES
-- ============================================================================

-- Update updated_at timestamp automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply the trigger to relevant tables
CREATE TRIGGER update_prospect_profiles_updated_at
    BEFORE UPDATE ON prospect_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_email_events_updated_at
    BEFORE UPDATE ON email_automation_events
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_booking_events_updated_at
    BEFORE UPDATE ON booking_events
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- INITIAL DATA SETUP
-- ============================================================================

-- Insert some initial campaign templates (optional)
-- INSERT INTO email_automation_events (prospect_id, event_type, campaign_name, status, event_data)
-- VALUES (uuid_generate_v4(), 'trial_started', 'welcome_sequence', 'pending', '{}');

COMMIT;