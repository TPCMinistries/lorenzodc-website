-- AI Assessments table for storing assessment results
CREATE TABLE IF NOT EXISTS ai_assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  name text NOT NULL,
  company text,
  responses jsonb NOT NULL DEFAULT '{}'::jsonb,
  scores jsonb NOT NULL DEFAULT '{}'::jsonb,
  overall_score integer NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS ai_assessments_email_idx ON ai_assessments(email);
CREATE INDEX IF NOT EXISTS ai_assessments_overall_score_idx ON ai_assessments(overall_score);
CREATE INDEX IF NOT EXISTS ai_assessments_created_at_idx ON ai_assessments(created_at);

-- RLS Policies
ALTER TABLE ai_assessments ENABLE ROW LEVEL SECURITY;

-- Allow inserting new assessments
CREATE POLICY "Allow assessment submissions" ON ai_assessments
  FOR INSERT WITH CHECK (true);

-- Allow reading for authenticated users (admin/service role)
CREATE POLICY "Allow reading assessments for service role" ON ai_assessments
  FOR SELECT USING (true);

-- Trigger to update updated_at
CREATE TRIGGER update_ai_assessments_updated_at
  BEFORE UPDATE ON ai_assessments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();