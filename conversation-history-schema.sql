-- Conversation History Database Schema Extension
-- Add to existing enhanced-schema.sql

-- 25. Chat Sessions Table
CREATE TABLE IF NOT EXISTS chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Session metadata
  session_title TEXT, -- AI-generated from first message
  session_type TEXT DEFAULT 'coaching' CHECK (session_type IN ('coaching', 'assessment', 'document_chat', 'general')),

  -- Session stats
  message_count INTEGER DEFAULT 0,
  last_message_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  preview_text TEXT, -- First 100 chars for list view

  -- Context preservation
  context_summary TEXT, -- AI-generated summary of conversation context
  key_topics TEXT[] DEFAULT ARRAY[]::TEXT[], -- Extracted topics for search

  -- Session state
  is_active BOOLEAN DEFAULT true, -- Can be continued
  is_pinned BOOLEAN DEFAULT false, -- User can pin important conversations

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 26. Chat Messages Table
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Message content
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'voice', 'document_reference', 'assessment_result')),

  -- Message metadata
  metadata JSONB DEFAULT '{}', -- voice settings, document refs, assessment data, etc.
  tokens_used INTEGER, -- For usage tracking

  -- Context and references
  referenced_document_id UUID, -- If referencing a document
  referenced_assessment_id UUID, -- If referencing an assessment

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 27. Conversation Analytics Table
CREATE TABLE IF NOT EXISTS conversation_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE,

  -- Engagement metrics
  session_duration_minutes INTEGER, -- How long the conversation lasted
  user_satisfaction_score INTEGER CHECK (user_satisfaction_score BETWEEN 1 AND 5),
  conversation_depth INTEGER DEFAULT 0, -- Number of back-and-forth exchanges

  -- Content analysis
  primary_topic TEXT, -- Main discussion topic
  conversation_outcome TEXT, -- completed, abandoned, to_be_continued
  action_items_generated INTEGER DEFAULT 0,

  -- Premium feature usage
  features_used TEXT[] DEFAULT ARRAY[]::TEXT[], -- document_chat, assessments, etc.

  date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_chat_sessions_user_created ON chat_sessions(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_user_updated ON chat_sessions(user_id, updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_active ON chat_sessions(user_id, is_active, updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_type ON chat_sessions(session_type);

CREATE INDEX IF NOT EXISTS idx_chat_messages_session ON chat_messages(session_id, created_at);
CREATE INDEX IF NOT EXISTS idx_chat_messages_user ON chat_messages(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_messages_role ON chat_messages(session_id, role);

CREATE INDEX IF NOT EXISTS idx_conversation_analytics_user_date ON conversation_analytics(user_id, date DESC);

-- Full-text search for message content
CREATE INDEX IF NOT EXISTS idx_chat_messages_content_search ON chat_messages USING gin(to_tsvector('english', content));

-- RLS Policies
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_analytics ENABLE ROW LEVEL SECURITY;

-- Users can only access their own conversations
CREATE POLICY "Users can manage their own chat sessions" ON chat_sessions
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own chat messages" ON chat_messages
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own conversation analytics" ON conversation_analytics
  FOR SELECT USING (auth.uid() = user_id);

-- Function to auto-update session metadata when messages are added
CREATE OR REPLACE FUNCTION update_session_on_message()
RETURNS TRIGGER AS $$
BEGIN
  -- Update session stats
  UPDATE chat_sessions
  SET
    message_count = message_count + 1,
    last_message_at = NEW.created_at,
    updated_at = NEW.created_at,
    preview_text = CASE
      WHEN message_count = 0 AND NEW.role = 'user' THEN LEFT(NEW.content, 100)
      ELSE preview_text
    END
  WHERE id = NEW.session_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_session_metadata
  AFTER INSERT ON chat_messages
  FOR EACH ROW
  EXECUTE FUNCTION update_session_on_message();

-- Function to generate session title from first exchange
CREATE OR REPLACE FUNCTION generate_session_title(session_id_param UUID)
RETURNS TEXT AS $$
DECLARE
  first_user_message TEXT;
  generated_title TEXT;
BEGIN
  -- Get the first user message
  SELECT content INTO first_user_message
  FROM chat_messages
  WHERE session_id = session_id_param AND role = 'user'
  ORDER BY created_at ASC
  LIMIT 1;

  IF first_user_message IS NULL THEN
    RETURN 'New Conversation';
  END IF;

  -- Simple title generation (in production, you'd call AI API)
  generated_title := CASE
    WHEN first_user_message ILIKE '%goal%' OR first_user_message ILIKE '%objective%' THEN 'Goal Setting Discussion'
    WHEN first_user_message ILIKE '%business%' OR first_user_message ILIKE '%company%' THEN 'Business Strategy Chat'
    WHEN first_user_message ILIKE '%career%' OR first_user_message ILIKE '%job%' THEN 'Career Development'
    WHEN first_user_message ILIKE '%personal%' OR first_user_message ILIKE '%life%' THEN 'Personal Growth'
    WHEN first_user_message ILIKE '%document%' OR first_user_message ILIKE '%file%' THEN 'Document Analysis'
    WHEN first_user_message ILIKE '%assessment%' OR first_user_message ILIKE '%evaluation%' THEN 'Assessment Review'
    ELSE LEFT(first_user_message, 50) || CASE WHEN LENGTH(first_user_message) > 50 THEN '...' ELSE '' END
  END;

  RETURN generated_title;
END;
$$ LANGUAGE plpgsql;

-- Function to get user's conversation history with premium gating
CREATE OR REPLACE FUNCTION get_user_conversations(
  user_id_param UUID,
  limit_param INTEGER DEFAULT 50,
  offset_param INTEGER DEFAULT 0
)
RETURNS TABLE (
  id UUID,
  session_title TEXT,
  session_type TEXT,
  message_count INTEGER,
  last_message_at TIMESTAMP WITH TIME ZONE,
  preview_text TEXT,
  is_pinned BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE
) AS $$
DECLARE
  user_tier TEXT;
  history_cutoff TIMESTAMP WITH TIME ZONE;
BEGIN
  -- Get user's subscription tier
  SELECT s.tierId INTO user_tier
  FROM user_subscriptions s
  WHERE s.userId = user_id_param AND s.status = 'active'
  LIMIT 1;

  -- Determine history cutoff based on tier
  history_cutoff := CASE
    WHEN user_tier = 'catalyst_plus' OR user_tier = 'enterprise' THEN '1900-01-01'::timestamp -- Unlimited
    WHEN user_tier = 'catalyst_basic' THEN NOW() - INTERVAL '90 days' -- 90 days
    ELSE NOW() - INTERVAL '7 days' -- Free tier: 7 days
  END;

  RETURN QUERY
  SELECT
    cs.id,
    cs.session_title,
    cs.session_type,
    cs.message_count,
    cs.last_message_at,
    cs.preview_text,
    cs.is_pinned,
    cs.created_at
  FROM chat_sessions cs
  WHERE
    cs.user_id = user_id_param
    AND cs.created_at >= history_cutoff
  ORDER BY
    cs.is_pinned DESC, -- Pinned conversations first
    cs.updated_at DESC
  LIMIT limit_param
  OFFSET offset_param;
END;
$$ LANGUAGE plpgsql;

-- Function to search conversations
CREATE OR REPLACE FUNCTION search_conversations(
  user_id_param UUID,
  search_query TEXT,
  limit_param INTEGER DEFAULT 20
)
RETURNS TABLE (
  session_id UUID,
  session_title TEXT,
  message_content TEXT,
  message_created_at TIMESTAMP WITH TIME ZONE,
  relevance_rank REAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    cs.id,
    cs.session_title,
    cm.content,
    cm.created_at,
    ts_rank(to_tsvector('english', cm.content), plainto_tsquery('english', search_query)) as relevance
  FROM chat_sessions cs
  JOIN chat_messages cm ON cs.id = cm.session_id
  WHERE
    cs.user_id = user_id_param
    AND to_tsvector('english', cm.content) @@ plainto_tsquery('english', search_query)
  ORDER BY relevance DESC, cm.created_at DESC
  LIMIT limit_param;
END;
$$ LANGUAGE plpgsql;

-- Function to cleanup old conversations (for free users)
CREATE OR REPLACE FUNCTION cleanup_old_conversations()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  -- Delete conversations older than 7 days for free users
  WITH free_users AS (
    SELECT u.id as user_id
    FROM auth.users u
    LEFT JOIN user_subscriptions s ON u.id = s.userId AND s.status = 'active'
    WHERE s.userId IS NULL -- No active subscription = free user
  ),
  old_sessions AS (
    DELETE FROM chat_sessions cs
    USING free_users fu
    WHERE cs.user_id = fu.user_id
    AND cs.created_at < NOW() - INTERVAL '7 days'
    AND cs.is_pinned = false -- Don't delete pinned conversations
    RETURNING cs.id
  )
  SELECT COUNT(*) INTO deleted_count FROM old_sessions;

  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate conversation insights
CREATE OR REPLACE FUNCTION get_conversation_insights(user_id_param UUID)
RETURNS TABLE (
  total_conversations INTEGER,
  total_messages INTEGER,
  avg_messages_per_session DECIMAL,
  most_active_day TEXT,
  primary_topics TEXT[],
  conversation_streak_days INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(DISTINCT cs.id)::INTEGER as total_conversations,
    COUNT(cm.id)::INTEGER as total_messages,
    ROUND(COUNT(cm.id)::DECIMAL / NULLIF(COUNT(DISTINCT cs.id), 0), 2) as avg_messages_per_session,
    TO_CHAR(
      (SELECT DATE_TRUNC('day', cm2.created_at)
       FROM chat_messages cm2
       WHERE cm2.user_id = user_id_param
       GROUP BY DATE_TRUNC('day', cm2.created_at)
       ORDER BY COUNT(*) DESC
       LIMIT 1), 'Day'
    ) as most_active_day,
    ARRAY_AGG(DISTINCT unnest(cs.key_topics)) FILTER (WHERE unnest IS NOT NULL) as primary_topics,
    (SELECT COUNT(DISTINCT DATE(cm3.created_at))
     FROM chat_messages cm3
     WHERE cm3.user_id = user_id_param
     AND cm3.created_at >= CURRENT_DATE - INTERVAL '30 days'
    )::INTEGER as conversation_streak_days
  FROM chat_sessions cs
  LEFT JOIN chat_messages cm ON cs.id = cm.session_id
  WHERE cs.user_id = user_id_param;
END;
$$ LANGUAGE plpgsql;