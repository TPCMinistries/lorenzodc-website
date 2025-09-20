-- Goal Tracking & Progress Accountability Schema
-- Enables users to set goals, track progress, and receive AI coaching accountability

-- 39. User Goals Table
CREATE TABLE IF NOT EXISTS user_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Goal details
  title TEXT NOT NULL,
  description TEXT,
  category TEXT, -- 'professional', 'personal', 'health', 'learning', 'business'
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),

  -- Goal type and structure
  goal_type TEXT DEFAULT 'outcome' CHECK (goal_type IN ('outcome', 'process', 'habit')),
  is_measurable BOOLEAN DEFAULT false,
  measurement_unit TEXT, -- 'hours', 'dollars', 'count', 'percentage', etc.
  target_value DECIMAL(15,2),
  current_value DECIMAL(15,2) DEFAULT 0,

  -- Timeframe
  start_date DATE DEFAULT CURRENT_DATE,
  target_date DATE,
  estimated_duration_days INTEGER,

  -- Progress tracking
  status TEXT DEFAULT 'active' CHECK (status IN ('draft', 'active', 'paused', 'completed', 'abandoned')),
  completion_percentage DECIMAL(5,2) DEFAULT 0 CHECK (completion_percentage >= 0 AND completion_percentage <= 100),

  -- AI coaching context
  why_important TEXT, -- Why this goal matters to the user
  success_criteria JSONB DEFAULT '[]', -- Array of specific criteria for success
  potential_obstacles JSONB DEFAULT '[]', -- Anticipated challenges
  accountability_preferences JSONB DEFAULT '{}', -- How user wants to be held accountable

  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  last_progress_update TIMESTAMP WITH TIME ZONE
);

-- 40. Goal Progress Updates
CREATE TABLE IF NOT EXISTS goal_progress_updates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  goal_id UUID REFERENCES user_goals(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Progress data
  progress_value DECIMAL(15,2), -- Current progress toward target
  progress_percentage DECIMAL(5,2), -- Calculated percentage
  progress_note TEXT, -- User's reflection on progress

  -- Context
  update_type TEXT DEFAULT 'manual' CHECK (update_type IN ('manual', 'automatic', 'ai_prompted')),
  mood_rating INTEGER CHECK (mood_rating >= 1 AND mood_rating <= 5), -- How user feels about progress
  confidence_rating INTEGER CHECK (confidence_rating >= 1 AND confidence_rating <= 5), -- Confidence in achieving goal

  -- Challenges and wins
  challenges_faced JSONB DEFAULT '[]',
  wins_achieved JSONB DEFAULT '[]',
  lessons_learned TEXT,
  next_steps JSONB DEFAULT '[]',

  -- AI coaching
  ai_feedback TEXT, -- AI-generated feedback on this update
  ai_recommendations JSONB DEFAULT '[]', -- Specific AI recommendations
  coaching_tone TEXT DEFAULT 'supportive' CHECK (coaching_tone IN ('supportive', 'challenging', 'analytical', 'motivational')),

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 41. Goal Milestones
CREATE TABLE IF NOT EXISTS goal_milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  goal_id UUID REFERENCES user_goals(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Milestone details
  title TEXT NOT NULL,
  description TEXT,
  target_value DECIMAL(15,2), -- Value at which this milestone is achieved
  target_percentage DECIMAL(5,2), -- Percentage of goal completion
  target_date DATE,

  -- Status
  is_completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  completed_value DECIMAL(15,2), -- Actual value when completed

  -- Rewards and recognition
  reward_type TEXT, -- 'celebration', 'treat', 'break', 'share'
  reward_description TEXT,
  celebration_message TEXT, -- Custom message for when milestone is hit

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Ensure milestones are ordered logically
  CONSTRAINT milestone_percentage_valid CHECK (target_percentage > 0 AND target_percentage <= 100)
);

-- 42. Goal Accountability Partners
CREATE TABLE IF NOT EXISTS goal_accountability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  goal_id UUID REFERENCES user_goals(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Partner details
  partner_type TEXT DEFAULT 'ai' CHECK (partner_type IN ('ai', 'human', 'group')),
  partner_name TEXT,
  partner_email TEXT,
  partner_relationship TEXT, -- 'friend', 'colleague', 'mentor', 'coach', 'ai_coach'

  -- Accountability settings
  check_in_frequency TEXT DEFAULT 'weekly' CHECK (check_in_frequency IN ('daily', 'weekly', 'biweekly', 'monthly')),
  check_in_day_of_week INTEGER, -- 0=Sunday, 6=Saturday
  check_in_time TIME,
  communication_method TEXT DEFAULT 'email' CHECK (communication_method IN ('email', 'sms', 'app_notification', 'call')),

  -- Permissions
  can_view_progress BOOLEAN DEFAULT true,
  can_comment BOOLEAN DEFAULT true,
  can_suggest_changes BOOLEAN DEFAULT false,

  -- Status
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_check_in TIMESTAMP WITH TIME ZONE
);

-- 43. Goal Check-in Sessions
CREATE TABLE IF NOT EXISTS goal_check_ins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  goal_id UUID REFERENCES user_goals(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  accountability_id UUID REFERENCES goal_accountability(id),

  -- Check-in details
  check_in_type TEXT DEFAULT 'scheduled' CHECK (check_in_type IN ('scheduled', 'requested', 'automatic', 'milestone')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'skipped', 'rescheduled')),

  -- Progress assessment
  progress_since_last DECIMAL(15,2),
  overall_progress_percentage DECIMAL(5,2),
  user_satisfaction INTEGER CHECK (user_satisfaction >= 1 AND user_satisfaction <= 5),
  goal_adjustment_needed BOOLEAN DEFAULT false,

  -- Reflection questions and answers
  reflection_data JSONB DEFAULT '{}', -- Structured Q&A responses
  user_notes TEXT,
  partner_feedback TEXT,
  ai_coaching_notes TEXT,

  -- Action items
  action_items JSONB DEFAULT '[]', -- Next steps agreed upon
  commitments_made JSONB DEFAULT '[]', -- Specific commitments for next period

  -- Scheduling
  scheduled_for TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  next_check_in TIMESTAMP WITH TIME ZONE,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 44. Goal Templates
CREATE TABLE IF NOT EXISTS goal_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Template details
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  goal_type TEXT DEFAULT 'outcome',

  -- Template structure
  template_data JSONB DEFAULT '{}', -- Default values, milestones, success criteria
  difficulty_level TEXT DEFAULT 'medium' CHECK (difficulty_level IN ('beginner', 'medium', 'advanced', 'expert')),
  estimated_duration_days INTEGER,

  -- Usage tracking
  usage_count INTEGER DEFAULT 0,
  is_public BOOLEAN DEFAULT true,
  created_by UUID REFERENCES auth.users(id),

  -- AI coaching prompts
  coaching_prompts JSONB DEFAULT '{}', -- AI prompts specific to this goal type
  accountability_suggestions JSONB DEFAULT '[]', -- Suggested accountability approaches

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_goals_user_status ON user_goals(user_id, status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_goals_category ON user_goals(category, status);
CREATE INDEX IF NOT EXISTS idx_goal_progress_goal_date ON goal_progress_updates(goal_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_goal_milestones_goal ON goal_milestones(goal_id, target_percentage);
CREATE INDEX IF NOT EXISTS idx_goal_checkins_scheduled ON goal_check_ins(scheduled_for) WHERE status = 'pending';
CREATE INDEX IF NOT EXISTS idx_goal_accountability_active ON goal_accountability(user_id, is_active);

-- RLS Policies
ALTER TABLE user_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE goal_progress_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE goal_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE goal_accountability ENABLE ROW LEVEL SECURITY;
ALTER TABLE goal_check_ins ENABLE ROW LEVEL SECURITY;
ALTER TABLE goal_templates ENABLE ROW LEVEL SECURITY;

-- Users can only access their own goals
CREATE POLICY "Users can manage their own goals" ON user_goals
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own progress updates" ON goal_progress_updates
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own milestones" ON goal_milestones
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own accountability" ON goal_accountability
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own check-ins" ON goal_check_ins
  FOR ALL USING (auth.uid() = user_id);

-- Public goal templates are viewable by all, private ones only by creator
CREATE POLICY "Public goal templates are viewable" ON goal_templates
  FOR SELECT USING (is_public = true OR auth.uid() = created_by);

CREATE POLICY "Users can create goal templates" ON goal_templates
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own templates" ON goal_templates
  FOR UPDATE USING (auth.uid() = created_by);

-- Functions for goal management

-- Function to create a goal from template
CREATE OR REPLACE FUNCTION create_goal_from_template(
  template_id_param UUID,
  user_id_param UUID,
  custom_title TEXT DEFAULT NULL,
  custom_target_value DECIMAL DEFAULT NULL,
  custom_target_date DATE DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  template_record goal_templates%ROWTYPE;
  new_goal_id UUID;
  template_data JSONB;
BEGIN
  -- Get template
  SELECT * INTO template_record FROM goal_templates WHERE id = template_id_param;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Goal template not found';
  END IF;

  -- Update usage count
  UPDATE goal_templates SET usage_count = usage_count + 1 WHERE id = template_id_param;

  -- Create goal from template
  INSERT INTO user_goals (
    user_id,
    title,
    description,
    category,
    goal_type,
    target_value,
    target_date,
    estimated_duration_days,
    success_criteria,
    accountability_preferences
  ) VALUES (
    user_id_param,
    COALESCE(custom_title, template_record.title),
    template_record.description,
    template_record.category,
    template_record.goal_type,
    COALESCE(custom_target_value, (template_record.template_data->>'target_value')::DECIMAL),
    COALESCE(custom_target_date, CURRENT_DATE + INTERVAL '1 day' * template_record.estimated_duration_days),
    template_record.estimated_duration_days,
    COALESCE(template_record.template_data->'success_criteria', '[]'),
    COALESCE(template_record.template_data->'accountability_preferences', '{}')
  ) RETURNING id INTO new_goal_id;

  -- Create default milestones if specified in template
  IF template_record.template_data ? 'default_milestones' THEN
    INSERT INTO goal_milestones (goal_id, user_id, title, target_percentage, description)
    SELECT
      new_goal_id,
      user_id_param,
      milestone->>'title',
      (milestone->>'percentage')::DECIMAL,
      milestone->>'description'
    FROM jsonb_array_elements(template_record.template_data->'default_milestones') AS milestone;
  END IF;

  RETURN new_goal_id;
END;
$$ LANGUAGE plpgsql;

-- Function to update goal progress
CREATE OR REPLACE FUNCTION update_goal_progress(
  goal_id_param UUID,
  user_id_param UUID,
  progress_value_param DECIMAL,
  progress_note_param TEXT DEFAULT NULL,
  mood_rating_param INTEGER DEFAULT NULL,
  confidence_rating_param INTEGER DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  goal_record user_goals%ROWTYPE;
  new_percentage DECIMAL;
  update_id UUID;
  milestone_record goal_milestones%ROWTYPE;
BEGIN
  -- Get current goal
  SELECT * INTO goal_record FROM user_goals WHERE id = goal_id_param AND user_id = user_id_param;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Goal not found';
  END IF;

  -- Calculate new percentage
  IF goal_record.target_value > 0 THEN
    new_percentage = LEAST(100, (progress_value_param / goal_record.target_value) * 100);
  ELSE
    new_percentage = 0;
  END IF;

  -- Insert progress update
  INSERT INTO goal_progress_updates (
    goal_id,
    user_id,
    progress_value,
    progress_percentage,
    progress_note,
    mood_rating,
    confidence_rating,
    update_type
  ) VALUES (
    goal_id_param,
    user_id_param,
    progress_value_param,
    new_percentage,
    progress_note_param,
    mood_rating_param,
    confidence_rating_param,
    'manual'
  ) RETURNING id INTO update_id;

  -- Update goal current value and percentage
  UPDATE user_goals SET
    current_value = progress_value_param,
    completion_percentage = new_percentage,
    last_progress_update = NOW(),
    updated_at = NOW(),
    status = CASE
      WHEN new_percentage >= 100 THEN 'completed'
      WHEN status = 'draft' THEN 'active'
      ELSE status
    END,
    completed_at = CASE
      WHEN new_percentage >= 100 THEN NOW()
      ELSE completed_at
    END
  WHERE id = goal_id_param;

  -- Check for milestone achievements
  FOR milestone_record IN
    SELECT * FROM goal_milestones
    WHERE goal_id = goal_id_param
    AND is_completed = false
    AND target_percentage <= new_percentage
    ORDER BY target_percentage
  LOOP
    UPDATE goal_milestones SET
      is_completed = true,
      completed_at = NOW(),
      completed_value = progress_value_param
    WHERE id = milestone_record.id;

    -- Trigger celebration/notification (could integrate with email automation)
    -- This could trigger email automation for milestone celebrations
  END LOOP;

  RETURN update_id;
END;
$$ LANGUAGE plpgsql;

-- Function to get goal analytics for user
CREATE OR REPLACE FUNCTION get_user_goal_analytics(
  user_id_param UUID,
  time_period_days INTEGER DEFAULT 30
)
RETURNS TABLE (
  total_goals INTEGER,
  active_goals INTEGER,
  completed_goals INTEGER,
  avg_completion_rate DECIMAL,
  goals_by_category JSONB,
  recent_progress_trend JSONB,
  milestone_completion_rate DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  WITH goal_stats AS (
    SELECT
      COUNT(*)::INTEGER as total_goals,
      COUNT(*) FILTER (WHERE status = 'active')::INTEGER as active_goals,
      COUNT(*) FILTER (WHERE status = 'completed')::INTEGER as completed_goals,
      AVG(completion_percentage) as avg_completion_rate
    FROM user_goals
    WHERE user_id = user_id_param
    AND created_at >= CURRENT_DATE - INTERVAL '1 day' * time_period_days
  ),
  category_stats AS (
    SELECT jsonb_object_agg(category, goal_count) as goals_by_category
    FROM (
      SELECT category, COUNT(*) as goal_count
      FROM user_goals
      WHERE user_id = user_id_param
      AND created_at >= CURRENT_DATE - INTERVAL '1 day' * time_period_days
      GROUP BY category
    ) t
  ),
  progress_trend AS (
    SELECT jsonb_agg(
      jsonb_build_object(
        'date', created_at::date,
        'updates', update_count,
        'avg_progress', avg_progress
      ) ORDER BY created_at::date
    ) as recent_progress_trend
    FROM (
      SELECT
        created_at::date,
        COUNT(*) as update_count,
        AVG(progress_percentage) as avg_progress
      FROM goal_progress_updates gpu
      JOIN user_goals ug ON gpu.goal_id = ug.id
      WHERE ug.user_id = user_id_param
      AND gpu.created_at >= CURRENT_DATE - INTERVAL '1 day' * time_period_days
      GROUP BY created_at::date
    ) t
  ),
  milestone_stats AS (
    SELECT
      CASE
        WHEN COUNT(*) = 0 THEN 0
        ELSE (COUNT(*) FILTER (WHERE is_completed))::DECIMAL / COUNT(*) * 100
      END as milestone_completion_rate
    FROM goal_milestones gm
    JOIN user_goals ug ON gm.goal_id = ug.id
    WHERE ug.user_id = user_id_param
  )
  SELECT
    gs.total_goals,
    gs.active_goals,
    gs.completed_goals,
    ROUND(gs.avg_completion_rate, 2),
    COALESCE(cs.goals_by_category, '{}'::jsonb),
    COALESCE(pt.recent_progress_trend, '[]'::jsonb),
    ROUND(ms.milestone_completion_rate, 2)
  FROM goal_stats gs
  CROSS JOIN category_stats cs
  CROSS JOIN progress_trend pt
  CROSS JOIN milestone_stats ms;
END;
$$ LANGUAGE plpgsql;

-- Function to generate AI coaching prompts
CREATE OR REPLACE FUNCTION generate_goal_coaching_prompt(
  goal_id_param UUID,
  user_id_param UUID,
  coaching_context TEXT DEFAULT 'progress_review'
)
RETURNS TEXT AS $$
DECLARE
  goal_record user_goals%ROWTYPE;
  recent_progress goal_progress_updates%ROWTYPE;
  coaching_prompt TEXT;
BEGIN
  -- Get goal details
  SELECT * INTO goal_record FROM user_goals WHERE id = goal_id_param AND user_id = user_id_param;
  IF NOT FOUND THEN
    RETURN 'Goal not found';
  END IF;

  -- Get most recent progress update
  SELECT * INTO recent_progress
  FROM goal_progress_updates
  WHERE goal_id = goal_id_param
  ORDER BY created_at DESC
  LIMIT 1;

  -- Generate context-specific coaching prompt
  coaching_prompt := CASE coaching_context
    WHEN 'progress_review' THEN
      'You are an AI goal coach. Review this goal and provide supportive, actionable feedback:' ||
      E'\n\nGoal: ' || goal_record.title ||
      E'\nDescription: ' || COALESCE(goal_record.description, 'No description provided') ||
      E'\nTarget: ' || COALESCE(goal_record.target_value::TEXT || ' ' || COALESCE(goal_record.measurement_unit, 'units'), 'Not specified') ||
      E'\nCurrent Progress: ' || goal_record.completion_percentage || '% (' || goal_record.current_value || ')' ||
      E'\nTarget Date: ' || COALESCE(goal_record.target_date::TEXT, 'Not set') ||
      E'\nWhy Important: ' || COALESCE(goal_record.why_important, 'Not specified') ||
      CASE WHEN recent_progress.progress_note IS NOT NULL THEN
        E'\nRecent Update: ' || recent_progress.progress_note ||
        E'\nMood Rating: ' || COALESCE(recent_progress.mood_rating::TEXT, 'Not rated') || '/5' ||
        E'\nConfidence Rating: ' || COALESCE(recent_progress.confidence_rating::TEXT, 'Not rated') || '/5'
      ELSE ''
      END ||
      E'\n\nProvide: 1) Celebration of progress made 2) Specific next steps 3) Potential obstacles and solutions 4) Motivation based on their "why"'

    WHEN 'milestone_celebration' THEN
      'Celebrate this milestone achievement with enthusiasm and help plan next steps:' ||
      E'\n\nGoal: ' || goal_record.title ||
      E'\nProgress: ' || goal_record.completion_percentage || '% complete' ||
      E'\nProvide an enthusiastic celebration and suggest how to maintain momentum.'

    WHEN 'accountability_check' THEN
      'You are conducting an accountability check-in. Be supportive but direct:' ||
      E'\n\nGoal: ' || goal_record.title ||
      E'\nLast Update: ' || COALESCE(goal_record.last_progress_update::TEXT, 'No recent updates') ||
      E'\nProgress: ' || goal_record.completion_percentage || '%' ||
      E'\nAsk about progress, challenges, and commitments for the next period.'

    ELSE 'Provide general coaching support for this goal: ' || goal_record.title
  END;

  RETURN coaching_prompt;
END;
$$ LANGUAGE plpgsql;

-- Insert some default goal templates
INSERT INTO goal_templates (title, description, category, goal_type, template_data, difficulty_level, estimated_duration_days, coaching_prompts) VALUES
('Learn AI Prompt Engineering', 'Master the art of crafting effective AI prompts for better results', 'learning', 'process',
 '{"target_value": 50, "measurement_unit": "prompts", "success_criteria": ["Write 50 effective prompts", "Get consistently good AI responses", "Understand prompt patterns"], "default_milestones": [{"title": "First 10 prompts", "percentage": 20, "description": "Write your first 10 working prompts"}, {"title": "Halfway point", "percentage": 50, "description": "25 prompts with good results"}, {"title": "Expert level", "percentage": 100, "description": "50 prompts mastered"}]}',
 'beginner', 30,
 '{"progress_review": "Focus on prompt quality and AI response effectiveness", "accountability_check": "Ask about specific prompts tried and results achieved"}'
),
('Implement AI Workflow Automation', 'Automate 3 repetitive business processes using AI tools', 'professional', 'outcome',
 '{"target_value": 3, "measurement_unit": "workflows", "success_criteria": ["Identify 3 automatable processes", "Implement working solutions", "Measure time savings"], "default_milestones": [{"title": "First automation", "percentage": 33, "description": "Complete first workflow automation"}, {"title": "Two down, one to go", "percentage": 67, "description": "Two automations working"}, {"title": "Full automation suite", "percentage": 100, "description": "All three workflows automated"}]}',
 'medium', 60,
 '{"progress_review": "Focus on ROI and time savings achieved", "accountability_check": "Review specific automations and measure impact"}'
),
('Build AI-Enhanced Personal Brand', 'Grow professional presence using AI-generated content and insights', 'professional', 'outcome',
 '{"target_value": 1000, "measurement_unit": "followers", "success_criteria": ["Consistent AI-assisted content", "Engagement growth", "Thought leadership recognition"], "default_milestones": [{"title": "Content system setup", "percentage": 25, "description": "AI content creation system working"}, {"title": "Growing audience", "percentage": 50, "description": "500 new engaged followers"}, {"title": "Thought leader", "percentage": 100, "description": "1000+ followers and regular engagement"}]}',
 'medium', 90,
 '{"progress_review": "Review content quality and audience engagement metrics", "accountability_check": "Check posting consistency and audience growth"}'
);