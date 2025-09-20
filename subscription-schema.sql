-- Subscription Management System Schema
-- Run this in your Supabase SQL Editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User Subscriptions Table
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  userId TEXT NOT NULL,
  tierId TEXT NOT NULL DEFAULT 'free',
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'past_due', 'incomplete')),
  currentPeriodStart TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  currentPeriodEnd TIMESTAMPTZ NOT NULL DEFAULT NOW() + INTERVAL '1 month',
  stripeSubscriptionId TEXT,
  stripeCustomerId TEXT,
  createdAt TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updatedAt TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE(userId, status) WHERE status = 'active'
);

-- User Usage Tracking Table
CREATE TABLE IF NOT EXISTS user_usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  userId TEXT NOT NULL UNIQUE,

  -- Current billing period usage
  currentPeriodMessagesUsed INTEGER NOT NULL DEFAULT 0,
  currentPeriodVoiceMinutesUsed DECIMAL(10,2) NOT NULL DEFAULT 0,
  lastResetDate TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- All-time usage stats
  totalMessages INTEGER NOT NULL DEFAULT 0,
  totalVoiceMinutes DECIMAL(10,2) NOT NULL DEFAULT 0,
  memberSince TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  updatedAt TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Usage Events Log (for analytics and debugging)
CREATE TABLE IF NOT EXISTS usage_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  userId TEXT NOT NULL,
  eventType TEXT NOT NULL CHECK (eventType IN ('message', 'voice')),
  amount DECIMAL(10,2) NOT NULL DEFAULT 1,
  metadata JSONB,
  createdAt TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_userId ON user_subscriptions(userId);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_status ON user_subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_stripe ON user_subscriptions(stripeSubscriptionId);
CREATE INDEX IF NOT EXISTS idx_user_usage_userId ON user_usage(userId);
CREATE INDEX IF NOT EXISTS idx_usage_events_userId ON usage_events(userId);
CREATE INDEX IF NOT EXISTS idx_usage_events_type ON usage_events(eventType);
CREATE INDEX IF NOT EXISTS idx_usage_events_created ON usage_events(createdAt);

-- Function to update the updatedAt timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updatedAt = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers to automatically update updatedAt
DROP TRIGGER IF EXISTS update_user_subscriptions_updated_at ON user_subscriptions;
CREATE TRIGGER update_user_subscriptions_updated_at
  BEFORE UPDATE ON user_subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_usage_updated_at ON user_usage;
CREATE TRIGGER update_user_usage_updated_at
  BEFORE UPDATE ON user_usage
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to increment message usage
CREATE OR REPLACE FUNCTION increment_message_usage(user_id TEXT)
RETURNS VOID AS $$
BEGIN
  INSERT INTO user_usage (userId, currentPeriodMessagesUsed, totalMessages)
  VALUES (user_id, 1, 1)
  ON CONFLICT (userId)
  DO UPDATE SET
    currentPeriodMessagesUsed = user_usage.currentPeriodMessagesUsed + 1,
    totalMessages = user_usage.totalMessages + 1,
    updatedAt = NOW();

  -- Log the usage event
  INSERT INTO usage_events (userId, eventType, amount)
  VALUES (user_id, 'message', 1);
END;
$$ LANGUAGE plpgsql;

-- Function to increment voice usage
CREATE OR REPLACE FUNCTION increment_voice_usage(user_id TEXT, minutes_used DECIMAL)
RETURNS VOID AS $$
BEGIN
  INSERT INTO user_usage (userId, currentPeriodVoiceMinutesUsed, totalVoiceMinutes)
  VALUES (user_id, minutes_used, minutes_used)
  ON CONFLICT (userId)
  DO UPDATE SET
    currentPeriodVoiceMinutesUsed = user_usage.currentPeriodVoiceMinutesUsed + minutes_used,
    totalVoiceMinutes = user_usage.totalVoiceMinutes + minutes_used,
    updatedAt = NOW();

  -- Log the usage event
  INSERT INTO usage_events (userId, eventType, amount)
  VALUES (user_id, 'voice', minutes_used);
END;
$$ LANGUAGE plpgsql;

-- Function to reset user usage for new billing period
CREATE OR REPLACE FUNCTION reset_user_usage(user_id TEXT)
RETURNS VOID AS $$
BEGIN
  UPDATE user_usage
  SET
    currentPeriodMessagesUsed = 0,
    currentPeriodVoiceMinutesUsed = 0,
    lastResetDate = NOW(),
    updatedAt = NOW()
  WHERE userId = user_id;

  -- If user doesn't exist, create them
  IF NOT FOUND THEN
    INSERT INTO user_usage (userId, lastResetDate)
    VALUES (user_id, NOW())
    ON CONFLICT (userId) DO NOTHING;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to clean up old usage events (run monthly)
CREATE OR REPLACE FUNCTION cleanup_old_usage_events()
RETURNS VOID AS $$
BEGIN
  DELETE FROM usage_events
  WHERE createdAt < NOW() - INTERVAL '6 months';
END;
$$ LANGUAGE plpgsql;

-- RLS Policies for security
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_events ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own subscription data
CREATE POLICY "Users can view own subscription" ON user_subscriptions
  FOR SELECT USING (userId = auth.uid()::text);

-- Allow users to read their own usage data
CREATE POLICY "Users can view own usage" ON user_usage
  FOR SELECT USING (userId = auth.uid()::text);

-- Allow users to view their own usage events
CREATE POLICY "Users can view own usage events" ON usage_events
  FOR SELECT USING (userId = auth.uid()::text);

-- Allow service role to manage all data (for backend operations)
CREATE POLICY "Service role full access subscriptions" ON user_subscriptions
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access usage" ON user_usage
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access events" ON usage_events
  FOR ALL USING (auth.role() = 'service_role');

-- Grant necessary permissions
GRANT ALL ON user_subscriptions TO authenticated;
GRANT ALL ON user_usage TO authenticated;
GRANT ALL ON usage_events TO authenticated;

GRANT ALL ON user_subscriptions TO service_role;
GRANT ALL ON user_usage TO service_role;
GRANT ALL ON usage_events TO service_role;