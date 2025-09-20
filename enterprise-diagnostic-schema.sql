-- Enterprise Diagnostic Database Schema
-- Add to existing enhanced-schema.sql

-- 15. Enterprise Assessments Table
CREATE TABLE IF NOT EXISTS enterprise_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id UUID UNIQUE DEFAULT gen_random_uuid(), -- For anonymous users

  -- Company Information
  company_name TEXT NOT NULL,
  industry TEXT NOT NULL,
  company_size TEXT NOT NULL CHECK (company_size IN ('1-10', '11-50', '51-200', '201-1000', '1000+')),
  annual_revenue_range TEXT CHECK (annual_revenue_range IN ('under-100k', '100k-1m', '1m-10m', '10m-100m', '100m+')),
  business_model TEXT,

  -- Team Structure
  team_structure JSONB DEFAULT '{}', -- {departments: [], team_sizes: {}}
  current_tools JSONB DEFAULT '[]', -- [tool1, tool2, tool3]

  -- Process Analysis
  workflow_pain_points JSONB DEFAULT '[]', -- [{process: "", time_spent: "", frustration_level: "", automation_potential: 0.8}]
  automation_opportunities JSONB DEFAULT '[]',
  decision_making_bottlenecks JSONB DEFAULT '[]',
  manual_processes JSONB DEFAULT '[]',

  -- AI Readiness Scores (1-100)
  technical_readiness_score INTEGER CHECK (technical_readiness_score >= 1 AND technical_readiness_score <= 100),
  cultural_readiness_score INTEGER CHECK (cultural_readiness_score >= 1 AND cultural_readiness_score <= 100),
  leadership_buy_in_score INTEGER CHECK (leadership_buy_in_score >= 1 AND leadership_buy_in_score <= 100),

  -- ROI Calculations
  potential_time_savings_hours INTEGER DEFAULT 0,
  potential_cost_savings_monthly DECIMAL(10,2) DEFAULT 0,
  implementation_complexity_score INTEGER CHECK (implementation_complexity_score >= 1 AND implementation_complexity_score <= 10),
  average_hourly_cost DECIMAL(8,2),

  -- Assessment Status
  completed_at TIMESTAMP WITH TIME ZONE,
  assessment_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 16. Enterprise Recommendations Table
CREATE TABLE IF NOT EXISTS enterprise_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID REFERENCES enterprise_assessments(id) ON DELETE CASCADE,
  category TEXT NOT NULL CHECK (category IN ('quick_wins', 'medium_term', 'strategic')),
  priority INTEGER NOT NULL CHECK (priority >= 1 AND priority <= 10),
  recommendation_text TEXT NOT NULL,
  estimated_impact TEXT NOT NULL CHECK (estimated_impact IN ('High', 'Medium', 'Low')),
  implementation_time TEXT NOT NULL,
  tools_required JSONB DEFAULT '[]',
  roi_potential DECIMAL(10,2),
  confidence_level INTEGER CHECK (confidence_level >= 1 AND confidence_level <= 100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 17. Enterprise Assessment Progress (for multi-session completion)
CREATE TABLE IF NOT EXISTS enterprise_assessment_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  current_step INTEGER DEFAULT 1,
  total_steps INTEGER DEFAULT 5,
  responses JSONB DEFAULT '{}',
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '14 days')
);

-- Indexes for enterprise tables
CREATE INDEX IF NOT EXISTS idx_enterprise_assessments_user_id ON enterprise_assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_enterprise_assessments_session_id ON enterprise_assessments(session_id);
CREATE INDEX IF NOT EXISTS idx_enterprise_assessments_company_size ON enterprise_assessments(company_size);
CREATE INDEX IF NOT EXISTS idx_enterprise_assessments_industry ON enterprise_assessments(industry);
CREATE INDEX IF NOT EXISTS idx_enterprise_recommendations_assessment_id ON enterprise_recommendations(assessment_id);
CREATE INDEX IF NOT EXISTS idx_enterprise_progress_session_id ON enterprise_assessment_progress(session_id);

-- RLS Policies for enterprise tables
ALTER TABLE enterprise_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_assessment_progress ENABLE ROW LEVEL SECURITY;

-- Enterprise Assessment Policies
CREATE POLICY "Users can manage their own enterprise assessments" ON enterprise_assessments
  FOR ALL USING (auth.uid() = user_id);

-- Enterprise Recommendations Policies
CREATE POLICY "Users can view their own enterprise recommendations" ON enterprise_recommendations
  FOR ALL USING (auth.uid() IN (
    SELECT user_id FROM enterprise_assessments WHERE id = enterprise_recommendations.assessment_id
  ));

-- Enterprise Progress Policies
CREATE POLICY "Users can manage their own enterprise progress" ON enterprise_assessment_progress
  FOR ALL USING (auth.uid() = user_id);

-- Function to calculate ROI metrics
CREATE OR REPLACE FUNCTION calculate_enterprise_roi(assessment_id_param UUID)
RETURNS TABLE (
  monthly_savings DECIMAL,
  annual_savings DECIMAL,
  payback_period_months DECIMAL,
  confidence_level INTEGER,
  roi_percentage DECIMAL
) AS $$
DECLARE
  assessment_data RECORD;
  time_savings_hours INTEGER;
  hourly_cost DECIMAL;
  monthly_cost_savings DECIMAL;
  annual_cost_savings DECIMAL;
  subscription_cost DECIMAL := 297; -- Enterprise Plus monthly cost
BEGIN
  -- Get assessment data
  SELECT * INTO assessment_data
  FROM enterprise_assessments
  WHERE id = assessment_id_param;

  IF NOT FOUND THEN
    RETURN;
  END IF;

  -- Calculate time savings and costs
  time_savings_hours := assessment_data.potential_time_savings_hours;
  hourly_cost := COALESCE(assessment_data.average_hourly_cost, 50); -- Default $50/hour

  -- Calculate monthly savings (assuming 4 weeks per month)
  monthly_cost_savings := time_savings_hours * hourly_cost * 4;
  annual_cost_savings := monthly_cost_savings * 12;

  -- Calculate confidence based on readiness scores
  DECLARE
    avg_readiness DECIMAL;
  BEGIN
    avg_readiness := (
      COALESCE(assessment_data.technical_readiness_score, 50) +
      COALESCE(assessment_data.cultural_readiness_score, 50) +
      COALESCE(assessment_data.leadership_buy_in_score, 50)
    ) / 3.0;

    RETURN QUERY SELECT
      monthly_cost_savings as monthly_savings,
      annual_cost_savings as annual_savings,
      CASE
        WHEN monthly_cost_savings > 0 THEN subscription_cost / monthly_cost_savings
        ELSE 12
      END as payback_period_months,
      ROUND(avg_readiness)::INTEGER as confidence_level,
      CASE
        WHEN subscription_cost > 0 THEN ROUND(((annual_cost_savings - (subscription_cost * 12)) / (subscription_cost * 12)) * 100, 1)
        ELSE 0
      END as roi_percentage;
  END;
END;
$$ language 'plpgsql';

-- Function to generate enterprise recommendations
CREATE OR REPLACE FUNCTION generate_enterprise_recommendations(assessment_id_param UUID)
RETURNS VOID AS $$
DECLARE
  assessment_data RECORD;
  rec_id UUID;
BEGIN
  -- Get assessment data
  SELECT * INTO assessment_data
  FROM enterprise_assessments
  WHERE id = assessment_id_param;

  IF NOT FOUND THEN
    RETURN;
  END IF;

  -- Clear existing recommendations
  DELETE FROM enterprise_recommendations WHERE assessment_id = assessment_id_param;

  -- Quick Wins (based on company size and common pain points)
  INSERT INTO enterprise_recommendations (
    assessment_id, category, priority, recommendation_text, estimated_impact,
    implementation_time, tools_required, roi_potential, confidence_level
  ) VALUES
  (assessment_id_param, 'quick_wins', 10,
   'Implement AI-powered email automation for customer inquiries',
   'High', '1-2 weeks', '["Customer service AI", "Email automation"]', 2500.00, 85),

  (assessment_id_param, 'quick_wins', 9,
   'Deploy AI meeting summaries and action item extraction',
   'Medium', '1 week', '["Meeting AI", "Note-taking tools"]', 1200.00, 90),

  (assessment_id_param, 'quick_wins', 8,
   'Automate report generation with AI data analysis',
   'High', '2-3 weeks', '["BI tools", "AI analytics"]', 3000.00, 80);

  -- Medium Term (based on technical readiness)
  IF assessment_data.technical_readiness_score >= 60 THEN
    INSERT INTO enterprise_recommendations (
      assessment_id, category, priority, recommendation_text, estimated_impact,
      implementation_time, tools_required, roi_potential, confidence_level
    ) VALUES
    (assessment_id_param, 'medium_term', 7,
     'Implement AI-powered workflow automation across departments',
     'High', '1-3 months', '["Workflow automation", "Process mining"]', 8000.00, 75),

    (assessment_id_param, 'medium_term', 6,
     'Deploy predictive analytics for business forecasting',
     'Medium', '2-4 months', '["Predictive analytics", "ML platforms"]', 5000.00, 70);
  END IF;

  -- Strategic Initiatives (based on company size and leadership buy-in)
  IF assessment_data.leadership_buy_in_score >= 70 AND assessment_data.company_size IN ('201-1000', '1000+') THEN
    INSERT INTO enterprise_recommendations (
      assessment_id, category, priority, recommendation_text, estimated_impact,
      implementation_time, tools_required, roi_potential, confidence_level
    ) VALUES
    (assessment_id_param, 'strategic', 5,
     'Establish AI Center of Excellence for enterprise-wide transformation',
     'High', '6-12 months', '["AI platform", "Training programs", "Change management"]', 25000.00, 65),

    (assessment_id_param, 'strategic', 4,
     'Implement AI-driven customer experience personalization',
     'High', '3-6 months', '["Personalization engine", "Customer data platform"]', 15000.00, 70);
  END IF;

END;
$$ language 'plpgsql';

-- Trigger to automatically generate recommendations
CREATE OR REPLACE FUNCTION trigger_generate_enterprise_recommendations()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.completed_at IS NOT NULL AND OLD.completed_at IS NULL THEN
    PERFORM generate_enterprise_recommendations(NEW.id);
  END IF;
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER enterprise_recommendations_trigger
  AFTER UPDATE ON enterprise_assessments
  FOR EACH ROW
  EXECUTE FUNCTION trigger_generate_enterprise_recommendations();

-- Function to calculate implementation complexity
CREATE OR REPLACE FUNCTION calculate_implementation_complexity(
  technical_score INTEGER,
  cultural_score INTEGER,
  company_size TEXT,
  current_tools_count INTEGER
) RETURNS INTEGER AS $$
BEGIN
  DECLARE
    complexity_score INTEGER := 5; -- Base complexity
  BEGIN
    -- Adjust based on technical readiness (lower readiness = higher complexity)
    complexity_score := complexity_score + (10 - (technical_score / 10));

    -- Adjust based on cultural readiness
    complexity_score := complexity_score + (10 - (cultural_score / 10));

    -- Adjust based on company size (larger = more complex)
    CASE company_size
      WHEN '1-10' THEN complexity_score := complexity_score - 2;
      WHEN '11-50' THEN complexity_score := complexity_score - 1;
      WHEN '51-200' THEN complexity_score := complexity_score + 0;
      WHEN '201-1000' THEN complexity_score := complexity_score + 1;
      WHEN '1000+' THEN complexity_score := complexity_score + 2;
    END CASE;

    -- Adjust based on current tools (more tools = more integration complexity)
    complexity_score := complexity_score + (current_tools_count / 3);

    -- Ensure score is within bounds
    complexity_score := GREATEST(1, LEAST(10, complexity_score));

    RETURN complexity_score;
  END;
END;
$$ language 'plpgsql';