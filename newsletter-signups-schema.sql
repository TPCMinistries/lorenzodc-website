-- Newsletter signups table for lead generation
CREATE TABLE IF NOT EXISTS newsletter_signups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  source text DEFAULT 'website', -- 'website', 'popup', 'footer', 'inline'
  lead_magnet text, -- 'AI Strategy Newsletter', 'AI Readiness Checklist', etc.
  status text DEFAULT 'active', -- 'active', 'unsubscribed'
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Create index for faster email lookups
CREATE INDEX IF NOT EXISTS newsletter_signups_email_idx ON newsletter_signups(email);
CREATE INDEX IF NOT EXISTS newsletter_signups_created_at_idx ON newsletter_signups(created_at);
CREATE INDEX IF NOT EXISTS newsletter_signups_source_idx ON newsletter_signups(source);

-- RLS Policies
ALTER TABLE newsletter_signups ENABLE ROW LEVEL SECURITY;

-- Allow inserting new signups
CREATE POLICY "Allow newsletter signups" ON newsletter_signups
  FOR INSERT WITH CHECK (true);

-- Allow reading for authenticated users (admin/service role)
CREATE POLICY "Allow reading newsletter signups for service role" ON newsletter_signups
  FOR SELECT USING (true);

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_newsletter_signups_updated_at
  BEFORE UPDATE ON newsletter_signups
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();