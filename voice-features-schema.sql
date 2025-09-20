-- Voice Features Database Schema Extension
-- Add to existing conversation-history-schema.sql

-- 28. Voice Messages Table
CREATE TABLE IF NOT EXISTS voice_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE,
  message_id UUID REFERENCES chat_messages(id) ON DELETE CASCADE,

  -- Audio file details
  audio_file_url TEXT NOT NULL, -- Supabase Storage URL
  audio_file_size INTEGER NOT NULL, -- File size in bytes
  audio_duration_seconds DECIMAL(10,2) NOT NULL, -- Duration in seconds
  audio_format TEXT DEFAULT 'webm' CHECK (audio_format IN ('webm', 'mp3', 'wav', 'm4a')),

  -- Voice settings used
  voice_model TEXT NOT NULL DEFAULT 'tts-1', -- OpenAI TTS model
  voice_name TEXT NOT NULL DEFAULT 'alloy', -- OpenAI voice
  voice_speed DECIMAL(3,2) DEFAULT 1.0 CHECK (voice_speed BETWEEN 0.25 AND 4.0),

  -- Processing status
  status TEXT DEFAULT 'processing' CHECK (status IN ('processing', 'completed', 'failed')),
  error_message TEXT,

  -- Transcription (for voice input messages)
  transcribed_text TEXT, -- Original spoken text
  confidence_score DECIMAL(3,2), -- Transcription confidence (0-1)

  -- Message type
  message_type TEXT NOT NULL CHECK (message_type IN ('voice_input', 'voice_output')),

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  processed_at TIMESTAMP WITH TIME ZONE
);

-- 29. Voice Usage Tracking Table
CREATE TABLE IF NOT EXISTS voice_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Usage period
  usage_month DATE NOT NULL DEFAULT DATE_TRUNC('month', CURRENT_DATE),

  -- Usage counts
  voice_messages_count INTEGER DEFAULT 0,
  voice_input_count INTEGER DEFAULT 0, -- Spoken messages from user
  voice_output_count INTEGER DEFAULT 0, -- AI responses as voice
  total_audio_seconds DECIMAL(10,2) DEFAULT 0,

  -- Tier limits
  monthly_limit INTEGER DEFAULT 3, -- Based on user's subscription
  tier_id TEXT, -- Current subscription tier

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Ensure one record per user per month
  UNIQUE(user_id, usage_month)
);

-- 30. Voice Preferences Table
CREATE TABLE IF NOT EXISTS voice_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Voice settings
  preferred_voice TEXT DEFAULT 'alloy',
  voice_speed DECIMAL(3,2) DEFAULT 1.0 CHECK (voice_speed BETWEEN 0.25 AND 4.0),
  auto_play_responses BOOLEAN DEFAULT true,

  -- Input preferences
  auto_send_on_voice_complete BOOLEAN DEFAULT true,
  voice_input_timeout_seconds INTEGER DEFAULT 3,

  -- Quality preferences
  audio_quality TEXT DEFAULT 'standard' CHECK (audio_quality IN ('standard', 'hd')),
  preferred_audio_format TEXT DEFAULT 'webm',

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- One preference record per user
  UNIQUE(user_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_voice_messages_user_id ON voice_messages(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_voice_messages_session_id ON voice_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_voice_messages_status ON voice_messages(status);

CREATE INDEX IF NOT EXISTS idx_voice_usage_user_month ON voice_usage(user_id, usage_month);
CREATE INDEX IF NOT EXISTS idx_voice_usage_tier ON voice_usage(tier_id, usage_month);

CREATE INDEX IF NOT EXISTS idx_voice_preferences_user_id ON voice_preferences(user_id);

-- RLS Policies
ALTER TABLE voice_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE voice_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE voice_preferences ENABLE ROW LEVEL SECURITY;

-- Users can only access their own voice data
CREATE POLICY "Users can manage their own voice messages" ON voice_messages
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own voice usage" ON voice_usage
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own voice preferences" ON voice_preferences
  FOR ALL USING (auth.uid() = user_id);

-- Function to get user's voice tier and limits
CREATE OR REPLACE FUNCTION get_user_voice_limits(user_id_param UUID)
RETURNS TABLE (
  tier_id TEXT,
  monthly_limit INTEGER,
  available_voices TEXT[],
  quality_options TEXT[],
  current_usage INTEGER,
  can_use_voice BOOLEAN
) AS $$
DECLARE
  user_tier TEXT;
  current_month_usage INTEGER;
BEGIN
  -- Get user's subscription tier
  SELECT s.tierId INTO user_tier
  FROM user_subscriptions s
  WHERE s.userId = user_id_param AND s.status = 'active'
  ORDER BY s.created_at DESC
  LIMIT 1;

  -- Get current month usage
  SELECT COALESCE(vu.voice_messages_count, 0) INTO current_month_usage
  FROM voice_usage vu
  WHERE vu.user_id = user_id_param
  AND vu.usage_month = DATE_TRUNC('month', CURRENT_DATE);

  -- Default to free tier if no subscription
  IF user_tier IS NULL THEN
    user_tier := 'free';
  END IF;

  RETURN QUERY
  SELECT
    user_tier,
    CASE
      WHEN user_tier = 'catalyst_plus' OR user_tier = 'enterprise' THEN -1 -- Unlimited
      WHEN user_tier = 'catalyst_basic' THEN 50
      ELSE 3 -- Free tier
    END as monthly_limit,
    CASE
      WHEN user_tier = 'catalyst_plus' OR user_tier = 'enterprise' THEN
        ARRAY['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer']
      WHEN user_tier = 'catalyst_basic' THEN
        ARRAY['alloy', 'echo', 'fable']
      ELSE
        ARRAY['alloy'] -- Free tier gets basic voice only
    END as available_voices,
    CASE
      WHEN user_tier = 'catalyst_plus' OR user_tier = 'enterprise' THEN
        ARRAY['standard', 'hd']
      ELSE
        ARRAY['standard']
    END as quality_options,
    COALESCE(current_month_usage, 0) as current_usage,
    CASE
      WHEN user_tier = 'catalyst_plus' OR user_tier = 'enterprise' THEN true -- Unlimited
      WHEN user_tier = 'catalyst_basic' THEN COALESCE(current_month_usage, 0) < 50
      ELSE COALESCE(current_month_usage, 0) < 3 -- Free tier
    END as can_use_voice;
END;
$$ LANGUAGE plpgsql;

-- Function to track voice usage
CREATE OR REPLACE FUNCTION track_voice_usage(
  user_id_param UUID,
  message_type_param TEXT,
  duration_seconds_param DECIMAL DEFAULT 0
)
RETURNS BOOLEAN AS $$
DECLARE
  current_month DATE;
  user_tier TEXT;
  monthly_limit INTEGER;
BEGIN
  current_month := DATE_TRUNC('month', CURRENT_DATE);

  -- Get user's current tier and limits
  SELECT tier_id, monthly_limit
  INTO user_tier, monthly_limit
  FROM get_user_voice_limits(user_id_param);

  -- Insert or update usage record
  INSERT INTO voice_usage (user_id, usage_month, voice_messages_count, voice_input_count, voice_output_count, total_audio_seconds, tier_id, monthly_limit)
  VALUES (
    user_id_param,
    current_month,
    1,
    CASE WHEN message_type_param = 'voice_input' THEN 1 ELSE 0 END,
    CASE WHEN message_type_param = 'voice_output' THEN 1 ELSE 0 END,
    duration_seconds_param,
    user_tier,
    monthly_limit
  )
  ON CONFLICT (user_id, usage_month)
  DO UPDATE SET
    voice_messages_count = voice_usage.voice_messages_count + 1,
    voice_input_count = voice_usage.voice_input_count +
      CASE WHEN message_type_param = 'voice_input' THEN 1 ELSE 0 END,
    voice_output_count = voice_usage.voice_output_count +
      CASE WHEN message_type_param = 'voice_output' THEN 1 ELSE 0 END,
    total_audio_seconds = voice_usage.total_audio_seconds + duration_seconds_param,
    updated_at = NOW();

  RETURN true;
END;
$$ LANGUAGE plpgsql;

-- Function to check if user can send voice message
CREATE OR REPLACE FUNCTION can_send_voice_message(user_id_param UUID)
RETURNS BOOLEAN AS $$
DECLARE
  can_use BOOLEAN;
BEGIN
  SELECT can_use_voice INTO can_use
  FROM get_user_voice_limits(user_id_param);

  RETURN COALESCE(can_use, false);
END;
$$ LANGUAGE plpgsql;

-- Function to get user's voice preferences with defaults
CREATE OR REPLACE FUNCTION get_user_voice_preferences(user_id_param UUID)
RETURNS TABLE (
  preferred_voice TEXT,
  voice_speed DECIMAL,
  auto_play_responses BOOLEAN,
  auto_send_on_voice_complete BOOLEAN,
  voice_input_timeout_seconds INTEGER,
  audio_quality TEXT,
  preferred_audio_format TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COALESCE(vp.preferred_voice, 'alloy'),
    COALESCE(vp.voice_speed, 1.0),
    COALESCE(vp.auto_play_responses, true),
    COALESCE(vp.auto_send_on_voice_complete, true),
    COALESCE(vp.voice_input_timeout_seconds, 3),
    COALESCE(vp.audio_quality, 'standard'),
    COALESCE(vp.preferred_audio_format, 'webm')
  FROM voice_preferences vp
  WHERE vp.user_id = user_id_param

  UNION ALL

  -- Return defaults if no preferences exist
  SELECT 'alloy', 1.0, true, true, 3, 'standard', 'webm'
  WHERE NOT EXISTS (
    SELECT 1 FROM voice_preferences WHERE user_id = user_id_param
  )

  LIMIT 1;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update chat_messages metadata when voice message is created
CREATE OR REPLACE FUNCTION update_message_voice_metadata()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the corresponding chat message with voice metadata
  UPDATE chat_messages
  SET
    message_type = CASE
      WHEN NEW.message_type = 'voice_input' THEN 'voice'
      WHEN NEW.message_type = 'voice_output' THEN 'voice'
      ELSE message_type
    END,
    metadata = metadata || jsonb_build_object(
      'voice_message_id', NEW.id,
      'audio_duration', NEW.audio_duration_seconds,
      'voice_name', NEW.voice_name,
      'audio_url', NEW.audio_file_url
    )
  WHERE id = NEW.message_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER voice_message_metadata_trigger
  AFTER INSERT OR UPDATE ON voice_messages
  FOR EACH ROW
  EXECUTE FUNCTION update_message_voice_metadata();

-- Create storage bucket for voice messages (run this in Supabase dashboard)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('voice-messages', 'voice-messages', false);