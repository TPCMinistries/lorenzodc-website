-- Supabase Schema for Conversations
-- This file contains the SQL commands to create the conversations table
-- Run this in your Supabase SQL editor

-- Create conversations table
CREATE TABLE conversations (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  messages JSONB NOT NULL DEFAULT '[]'::jsonb,
  user_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index for better query performance
CREATE INDEX conversations_user_id_idx ON conversations (user_id);
CREATE INDEX conversations_updated_at_idx ON conversations (updated_at DESC);

-- Create trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_conversations_updated_at
  BEFORE UPDATE ON conversations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add Row Level Security (RLS) policies
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own conversations (if user_id is set)
CREATE POLICY "Users can view their own conversations"
  ON conversations FOR SELECT
  USING (user_id IS NULL OR user_id = auth.uid()::text);

-- Policy: Users can insert conversations
CREATE POLICY "Users can insert conversations"
  ON conversations FOR INSERT
  WITH CHECK (user_id IS NULL OR user_id = auth.uid()::text);

-- Policy: Users can update their own conversations
CREATE POLICY "Users can update their own conversations"
  ON conversations FOR UPDATE
  USING (user_id IS NULL OR user_id = auth.uid()::text);

-- Policy: Users can delete their own conversations
CREATE POLICY "Users can delete their own conversations"
  ON conversations FOR DELETE
  USING (user_id IS NULL OR user_id = auth.uid()::text);

-- Optional: Create a function to clean up old conversations (30 days)
CREATE OR REPLACE FUNCTION cleanup_old_conversations()
RETURNS void AS $$
BEGIN
  DELETE FROM conversations
  WHERE updated_at < NOW() - INTERVAL '30 days'
    AND user_id IS NULL; -- Only cleanup anonymous conversations
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;