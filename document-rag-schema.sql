-- Document RAG Database Schema Extension
-- Add to existing enhanced-schema.sql

-- Enable pgvector extension for vector storage
CREATE EXTENSION IF NOT EXISTS vector;

-- 18. User Documents Table
CREATE TABLE IF NOT EXISTS user_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Document metadata
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL, -- 'pdf', 'docx', 'txt', 'md'
  file_size INTEGER NOT NULL, -- in bytes
  file_url TEXT, -- Storage URL (Supabase Storage)

  -- Processing status
  status TEXT NOT NULL DEFAULT 'processing' CHECK (status IN ('processing', 'completed', 'failed', 'deleted')),
  error_message TEXT,

  -- Document content
  raw_text TEXT, -- Full extracted text
  summary TEXT, -- AI-generated summary
  key_insights JSONB DEFAULT '[]', -- AI-extracted insights

  -- Document categorization
  document_type TEXT, -- 'contract', 'financial', 'process', 'research', 'other'
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],

  -- Usage tracking
  chat_count INTEGER DEFAULT 0, -- How many times this doc was referenced in chat
  last_accessed TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Timestamps
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  processed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 19. Document Chunks Table (for RAG)
CREATE TABLE IF NOT EXISTS document_chunks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID REFERENCES user_documents(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Chunk data
  chunk_index INTEGER NOT NULL, -- Order within document
  content TEXT NOT NULL, -- Actual chunk text
  content_length INTEGER NOT NULL,

  -- Vector embedding for similarity search
  embedding vector(1536), -- OpenAI embedding size

  -- Metadata for context
  page_number INTEGER,
  section_title TEXT,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 20. Document Chat Sessions
CREATE TABLE IF NOT EXISTS document_chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  document_id UUID REFERENCES user_documents(id) ON DELETE CASCADE,

  -- Session metadata
  session_name TEXT,
  question_count INTEGER DEFAULT 0,

  -- Context tracking
  relevant_chunks UUID[] DEFAULT ARRAY[]::UUID[], -- Most referenced chunks
  key_topics TEXT[] DEFAULT ARRAY[]::TEXT[],

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 21. Document Chat Messages
CREATE TABLE IF NOT EXISTS document_chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES document_chat_sessions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  document_id UUID REFERENCES user_documents(id) ON DELETE CASCADE,

  -- Message content
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,

  -- RAG context
  source_chunks UUID[] DEFAULT ARRAY[]::UUID[], -- Which chunks were used
  similarity_scores DECIMAL[] DEFAULT ARRAY[]::DECIMAL[], -- Relevance scores
  context_used TEXT, -- Actual chunk content used for response

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 22. Document Processing Queue
CREATE TABLE IF NOT EXISTS document_processing_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID REFERENCES user_documents(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Processing details
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  priority INTEGER DEFAULT 1, -- Higher number = higher priority

  -- Processing steps
  steps_completed JSONB DEFAULT '[]', -- ['text_extraction', 'chunking', 'embedding', 'analysis']
  current_step TEXT,
  error_details JSONB,

  -- Resource usage
  processing_time_seconds INTEGER,
  token_count INTEGER, -- For embedding cost tracking

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_documents_user_id ON user_documents(user_id);
CREATE INDEX IF NOT EXISTS idx_user_documents_status ON user_documents(status);
CREATE INDEX IF NOT EXISTS idx_user_documents_type ON user_documents(document_type);
CREATE INDEX IF NOT EXISTS idx_user_documents_uploaded_at ON user_documents(uploaded_at DESC);

CREATE INDEX IF NOT EXISTS idx_document_chunks_document_id ON document_chunks(document_id);
CREATE INDEX IF NOT EXISTS idx_document_chunks_user_id ON document_chunks(user_id);
-- Vector similarity search index
CREATE INDEX IF NOT EXISTS idx_document_chunks_embedding ON document_chunks USING ivfflat (embedding vector_cosine_ops);

CREATE INDEX IF NOT EXISTS idx_document_chat_sessions_user_id ON document_chat_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_document_chat_sessions_document_id ON document_chat_sessions(document_id);

CREATE INDEX IF NOT EXISTS idx_document_chat_messages_session_id ON document_chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_document_chat_messages_document_id ON document_chat_messages(document_id);

CREATE INDEX IF NOT EXISTS idx_document_processing_queue_status ON document_processing_queue(status);
CREATE INDEX IF NOT EXISTS idx_document_processing_queue_priority ON document_processing_queue(priority DESC);

-- RLS Policies
ALTER TABLE user_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_chunks ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_processing_queue ENABLE ROW LEVEL SECURITY;

-- Users can only access their own documents
CREATE POLICY "Users can manage their own documents" ON user_documents
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can access their own document chunks" ON document_chunks
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own document chat sessions" ON document_chat_sessions
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own document chat messages" ON document_chat_messages
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own processing queue" ON document_processing_queue
  FOR SELECT USING (auth.uid() = user_id);

-- Function to search similar document chunks
CREATE OR REPLACE FUNCTION search_document_chunks(
  query_embedding vector(1536),
  user_id_param UUID,
  document_id_param UUID DEFAULT NULL,
  match_threshold FLOAT DEFAULT 0.7,
  match_count INT DEFAULT 10
)
RETURNS TABLE (
  chunk_id UUID,
  document_id UUID,
  content TEXT,
  similarity FLOAT,
  page_number INTEGER,
  section_title TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    dc.id,
    dc.document_id,
    dc.content,
    (1 - (dc.embedding <=> query_embedding)) AS similarity,
    dc.page_number,
    dc.section_title
  FROM document_chunks dc
  JOIN user_documents ud ON dc.document_id = ud.id
  WHERE
    dc.user_id = user_id_param
    AND (document_id_param IS NULL OR dc.document_id = document_id_param)
    AND ud.status = 'completed'
    AND (1 - (dc.embedding <=> query_embedding)) > match_threshold
  ORDER BY dc.embedding <=> query_embedding
  LIMIT match_count;
END;
$$ LANGUAGE plpgsql;

-- Function to get document insights
CREATE OR REPLACE FUNCTION get_document_insights(document_id_param UUID)
RETURNS TABLE (
  total_chunks INTEGER,
  avg_chunk_length INTEGER,
  key_topics TEXT[],
  summary TEXT,
  document_type TEXT,
  processing_status TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(dc.id)::INTEGER,
    AVG(dc.content_length)::INTEGER,
    ARRAY_AGG(DISTINCT unnest(ud.tags)) FILTER (WHERE unnest IS NOT NULL),
    ud.summary,
    ud.document_type,
    ud.status
  FROM user_documents ud
  LEFT JOIN document_chunks dc ON ud.id = dc.document_id
  WHERE ud.id = document_id_param
  GROUP BY ud.id, ud.summary, ud.document_type, ud.status;
END;
$$ LANGUAGE plpgsql;

-- Function to track document usage
CREATE OR REPLACE FUNCTION increment_document_usage(document_id_param UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE user_documents
  SET
    chat_count = chat_count + 1,
    last_accessed = NOW()
  WHERE id = document_id_param;
END;
$$ LANGUAGE plpgsql;

-- Function to clean up old processing queue entries
CREATE OR REPLACE FUNCTION cleanup_processing_queue()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM document_processing_queue
  WHERE
    status IN ('completed', 'failed')
    AND created_at < NOW() - INTERVAL '7 days';

  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically create processing queue entry
CREATE OR REPLACE FUNCTION create_processing_queue_entry()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO document_processing_queue (document_id, user_id, status)
  VALUES (NEW.id, NEW.user_id, 'pending');

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER document_processing_trigger
  AFTER INSERT ON user_documents
  FOR EACH ROW
  EXECUTE FUNCTION create_processing_queue_entry();

-- Create storage bucket for documents (run this in Supabase dashboard)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('user-documents', 'user-documents', false);