-- Personal AI Assessment Database Extension
-- Add to existing enhanced-schema.sql

-- 11. Assessment Results Table
CREATE TABLE IF NOT EXISTS assessment_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id UUID UNIQUE DEFAULT gen_random_uuid(), -- For anonymous users
  life_scores JSONB NOT NULL, -- {career: 7, health: 5, relationships: 8, etc}
  ai_readiness_score INTEGER CHECK (ai_readiness_score >= 1 AND ai_readiness_score <= 10),
  top_goals JSONB DEFAULT '[]', -- [goal1, goal2, goal3]
  biggest_obstacles JSONB DEFAULT '[]',
  pain_points JSONB DEFAULT '{}', -- {career: "lack of growth", health: "no energy"}
  improvement_priorities TEXT[] DEFAULT ARRAY[]::TEXT[],
  accountability_preference INTEGER CHECK (accountability_preference >= 1 AND accountability_preference <= 10),
  ai_comfort_level INTEGER CHECK (ai_comfort_level >= 1 AND ai_comfort_level <= 10),
  time_drains JSONB DEFAULT '[]', -- Tasks that consume 2+ hours weekly
  completed_at TIMESTAMP WITH TIME ZONE,
  assessment_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 12. Assessment Questions Template (for dynamic generation)
CREATE TABLE IF NOT EXISTS assessment_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL CHECK (category IN ('career', 'health', 'relationships', 'personal_development', 'financial', 'productivity', 'creativity', 'ai_readiness', 'goal_setting')),
  question_type TEXT NOT NULL CHECK (question_type IN ('rating', 'multiple_choice', 'text', 'checkbox')),
  question_text TEXT NOT NULL,
  question_subtext TEXT,
  options JSONB, -- For multiple choice questions
  order_index INTEGER NOT NULL,
  is_required BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 13. Assessment Progress Tracking (for multi-session completion)
CREATE TABLE IF NOT EXISTS assessment_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  current_step INTEGER DEFAULT 1,
  total_steps INTEGER DEFAULT 8,
  responses JSONB DEFAULT '{}',
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '7 days')
);

-- 14. Assessment-Generated Goals (links to user_goals)
CREATE TABLE IF NOT EXISTS assessment_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID REFERENCES assessment_results(id) ON DELETE CASCADE,
  goal_id UUID REFERENCES user_goals(id) ON DELETE CASCADE,
  generated_from_area TEXT NOT NULL,
  priority_rank INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for assessment tables
CREATE INDEX IF NOT EXISTS idx_assessment_results_user_id ON assessment_results(user_id);
CREATE INDEX IF NOT EXISTS idx_assessment_results_session_id ON assessment_results(session_id);
CREATE INDEX IF NOT EXISTS idx_assessment_progress_session_id ON assessment_progress(session_id);
CREATE INDEX IF NOT EXISTS idx_assessment_progress_user_id ON assessment_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_assessment_questions_category ON assessment_questions(category, order_index);

-- RLS Policies for assessment tables
ALTER TABLE assessment_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_goals ENABLE ROW LEVEL SECURITY;

-- Assessment Results Policies
CREATE POLICY "Users can manage their own assessment results" ON assessment_results
  FOR ALL USING (auth.uid() = user_id);

-- Assessment Progress Policies
CREATE POLICY "Users can manage their own assessment progress" ON assessment_progress
  FOR ALL USING (auth.uid() = user_id);

-- Assessment Goals Policies
CREATE POLICY "Users can manage their own assessment goals" ON assessment_goals
  FOR ALL USING (auth.uid() IN (
    SELECT user_id FROM assessment_results WHERE id = assessment_goals.assessment_id
  ));

-- Function to calculate overall life satisfaction from assessment
CREATE OR REPLACE FUNCTION calculate_life_satisfaction(life_scores_json JSONB)
RETURNS DECIMAL(3,1) AS $$
DECLARE
  total_score DECIMAL := 0;
  category_count INTEGER := 0;
  category_key TEXT;
  category_value NUMERIC;
BEGIN
  FOR category_key, category_value IN SELECT * FROM jsonb_each_text(life_scores_json)
  LOOP
    IF category_value IS NOT NULL AND category_value != '' THEN
      total_score := total_score + category_value::NUMERIC;
      category_count := category_count + 1;
    END IF;
  END LOOP;

  IF category_count = 0 THEN
    RETURN 0;
  END IF;

  RETURN ROUND(total_score / category_count, 1);
END;
$$ language 'plpgsql';

-- Function to generate personalized insights from assessment
CREATE OR REPLACE FUNCTION generate_assessment_insights(assessment_id_param UUID)
RETURNS TABLE (
  overall_score DECIMAL,
  strongest_area TEXT,
  weakest_area TEXT,
  improvement_potential TEXT,
  ai_coaching_readiness TEXT,
  recommended_focus_areas TEXT[]
) AS $$
DECLARE
  assessment_data RECORD;
  life_scores_data JSONB;
  max_score NUMERIC := 0;
  min_score NUMERIC := 10;
  max_area TEXT;
  min_area TEXT;
  category_key TEXT;
  category_value NUMERIC;
BEGIN
  -- Get assessment data
  SELECT * INTO assessment_data
  FROM assessment_results
  WHERE id = assessment_id_param;

  IF NOT FOUND THEN
    RETURN;
  END IF;

  life_scores_data := assessment_data.life_scores;

  -- Find strongest and weakest areas
  FOR category_key, category_value IN SELECT * FROM jsonb_each_text(life_scores_data)
  LOOP
    IF category_value::NUMERIC > max_score THEN
      max_score := category_value::NUMERIC;
      max_area := category_key;
    END IF;

    IF category_value::NUMERIC < min_score THEN
      min_score := category_value::NUMERIC;
      min_area := category_key;
    END IF;
  END LOOP;

  -- Return insights
  RETURN QUERY SELECT
    calculate_life_satisfaction(life_scores_data) as overall_score,
    max_area as strongest_area,
    min_area as weakest_area,
    CASE
      WHEN min_score <= 4 THEN 'High - significant room for improvement'
      WHEN min_score <= 6 THEN 'Moderate - good opportunities for growth'
      ELSE 'Low - fine-tuning and maintenance focus'
    END as improvement_potential,
    CASE
      WHEN assessment_data.ai_comfort_level >= 7 AND assessment_data.accountability_preference >= 7 THEN 'Excellent - ready for AI coaching'
      WHEN assessment_data.ai_comfort_level >= 5 AND assessment_data.accountability_preference >= 5 THEN 'Good - would benefit from AI coaching'
      ELSE 'Developing - AI coaching could help build habits'
    END as ai_coaching_readiness,
    ARRAY[min_area,
          CASE WHEN min_score < 6 THEN (
            SELECT key FROM jsonb_each_text(life_scores_data)
            WHERE value::NUMERIC < 6 AND key != min_area
            ORDER BY value::NUMERIC ASC LIMIT 1
          ) END]::TEXT[] as recommended_focus_areas;
END;
$$ language 'plpgsql';

-- Populate assessment questions
INSERT INTO assessment_questions (category, question_type, question_text, question_subtext, options, order_index) VALUES

-- Career & Business
('career', 'rating', 'How satisfied are you with your career trajectory?', 'Rate from 1 (very unsatisfied) to 10 (completely satisfied)', NULL, 1),
('career', 'text', 'What is your biggest professional frustration right now?', 'Be specific about what is holding you back', NULL, 2),
('career', 'multiple_choice', 'Which best describes your career goal for the next 2 years?', NULL, '["Promotion/advancement", "Career change", "Skill development", "Start own business", "Better work-life balance", "Higher income"]', 3),

-- Health & Energy
('health', 'rating', 'Rate your overall energy levels throughout the day', '1 = constantly tired, 10 = high energy all day', NULL, 1),
('health', 'multiple_choice', 'What health habit do you struggle with most?', NULL, '["Regular exercise", "Healthy eating", "Consistent sleep", "Stress management", "Drinking enough water", "Avoiding bad habits"]', 2),
('health', 'text', 'What stops you from maintaining healthy habits?', 'What are the main obstacles?', NULL, 3),

-- Relationships
('relationships', 'rating', 'How fulfilled are your personal relationships?', 'Include family, friends, romantic relationships', NULL, 1),
('relationships', 'multiple_choice', 'Where do you most need better communication?', NULL, '["With partner/spouse", "With family", "With friends", "At work", "Meeting new people", "Conflict resolution"]', 2),
('relationships', 'text', 'What relationship goal would improve your life most?', NULL, NULL, 3),

-- Personal Development
('personal_development', 'rating', 'How consistently do you learn new skills or grow personally?', '1 = never, 10 = constantly learning', NULL, 1),
('personal_development', 'text', 'What knowledge gap or skill frustrates you most?', 'What do you wish you knew how to do?', NULL, 2),
('personal_development', 'multiple_choice', 'What prevents you from learning more?', NULL, '["Lack of time", "Don''t know where to start", "Information overload", "Lack of motivation", "Too expensive", "No clear goal"]', 3),

-- Financial Security
('financial', 'rating', 'How confident are you about your financial future?', '1 = very worried, 10 = completely secure', NULL, 1),
('financial', 'multiple_choice', 'What money decision overwhelms you most?', NULL, '["Budgeting/spending", "Investing/saving", "Debt management", "Insurance decisions", "Major purchases", "Retirement planning"]', 2),
('financial', 'text', 'What would financial security look like for you?', 'Describe your financial goal', NULL, 3),

-- Daily Productivity
('productivity', 'rating', 'How efficiently do you manage your daily tasks?', '1 = constantly behind, 10 = always on top of things', NULL, 1),
('productivity', 'text', 'What drains your time unnecessarily each week?', 'What takes 2+ hours that could be reduced?', NULL, 2),
('productivity', 'multiple_choice', 'What productivity challenge affects you most?', NULL, '["Procrastination", "Distractions", "Poor planning", "Too many commitments", "Lack of focus", "No clear priorities"]', 3),

-- Creative/Personal Projects
('creativity', 'rating', 'How much time do you have for personal interests and creativity?', '1 = no time at all, 10 = plenty of time', NULL, 1),
('creativity', 'text', 'What creative goal or personal project have you postponed?', NULL, NULL, 2),
('creativity', 'multiple_choice', 'What stops you from pursuing personal projects?', NULL, '["No time", "Lack of motivation", "Don''t know where to start", "Fear of not being good enough", "Too many other priorities", "Lack of resources"]', 3),

-- AI Readiness
('ai_readiness', 'text', 'Which tasks consume 2+ hours weekly that could potentially be automated or made more efficient?', 'Think about repetitive tasks, research, planning, etc.', NULL, 1),
('ai_readiness', 'rating', 'How comfortable are you with using AI tools?', '1 = never used any, 10 = use them daily', NULL, 2),
('ai_readiness', 'text', 'What is your biggest technology frustration?', 'What tech challenge slows you down?', NULL, 3),

-- Goal Setting
('goal_setting', 'checkbox', 'Pick your top 3 life improvements for the next 90 days', 'Select the areas you most want to focus on', '["Advance my career", "Improve my health/energy", "Strengthen relationships", "Learn new skills", "Get financially organized", "Be more productive", "Pursue creative projects", "Reduce stress"]', 1),
('goal_setting', 'text', 'What has stopped you from achieving similar goals before?', 'Be honest about past obstacles', NULL, 2),
('goal_setting', 'rating', 'How important is accountability in reaching your goals?', '1 = I work better alone, 10 = I need external accountability', NULL, 3);

-- Trigger to create goals from assessment results
CREATE OR REPLACE FUNCTION create_goals_from_assessment()
RETURNS TRIGGER AS $$
DECLARE
  goal_text TEXT;
  goal_area TEXT;
  priority_rank INTEGER := 1;
BEGIN
  -- Create goals from top_goals array
  FOR goal_text IN SELECT jsonb_array_elements_text(NEW.top_goals)
  LOOP
    -- Determine life area based on goal content (simplified mapping)
    goal_area := CASE
      WHEN goal_text ILIKE '%career%' OR goal_text ILIKE '%work%' OR goal_text ILIKE '%job%' THEN 'career'
      WHEN goal_text ILIKE '%health%' OR goal_text ILIKE '%fitness%' OR goal_text ILIKE '%exercise%' THEN 'health'
      WHEN goal_text ILIKE '%relationship%' OR goal_text ILIKE '%family%' OR goal_text ILIKE '%friend%' THEN 'relationships'
      WHEN goal_text ILIKE '%learn%' OR goal_text ILIKE '%skill%' OR goal_text ILIKE '%education%' THEN 'learning'
      WHEN goal_text ILIKE '%money%' OR goal_text ILIKE '%financial%' OR goal_text ILIKE '%save%' THEN 'finance'
      WHEN goal_text ILIKE '%creative%' OR goal_text ILIKE '%art%' OR goal_text ILIKE '%hobby%' THEN 'creativity'
      ELSE 'personal_growth'
    END;

    -- Only create goals for authenticated users
    IF NEW.user_id IS NOT NULL THEN
      INSERT INTO user_goals (
        user_id,
        title,
        description,
        category,
        priority_level,
        created_from_assessment,
        target_date
      ) VALUES (
        NEW.user_id,
        goal_text,
        'Goal created from Personal AI Assessment',
        goal_area,
        CASE priority_rank WHEN 1 THEN 'high' WHEN 2 THEN 'medium' ELSE 'low' END,
        TRUE,
        CURRENT_DATE + INTERVAL '90 days'
      );

      priority_rank := priority_rank + 1;
    END IF;
  END LOOP;

  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER create_goals_from_assessment_trigger
  AFTER INSERT ON assessment_results
  FOR EACH ROW
  WHEN (NEW.completed_at IS NOT NULL AND jsonb_array_length(NEW.top_goals) > 0)
  EXECUTE FUNCTION create_goals_from_assessment();