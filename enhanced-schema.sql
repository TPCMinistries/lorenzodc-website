-- Enhanced Catalyst AI Database Schema for Goal Tracking & Life Coaching

-- Update existing users table with new columns
ALTER TABLE users ADD COLUMN IF NOT EXISTS subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'catalyst_plus', 'catalyst_pro'));
ALTER TABLE users ADD COLUMN IF NOT EXISTS chats_used_this_month INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_reset_date DATE DEFAULT CURRENT_DATE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS preferred_coaching_style TEXT DEFAULT 'supportive' CHECK (preferred_coaching_style IN ('supportive', 'direct', 'analytical', 'motivational'));
ALTER TABLE users ADD COLUMN IF NOT EXISTS timezone TEXT DEFAULT 'UTC';

-- 1. User Goals Table
CREATE TABLE IF NOT EXISTS user_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('health', 'career', 'relationships', 'learning', 'finance', 'creativity', 'personal_growth', 'hobbies', 'travel', 'business', 'lifestyle', 'mental_health')),
  target_date DATE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused', 'archived')),
  progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  priority_level TEXT DEFAULT 'medium' CHECK (priority_level IN ('low', 'medium', 'high')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Life Areas Table
CREATE TABLE IF NOT EXISTS life_areas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  area_name TEXT NOT NULL,
  current_focus TEXT,
  satisfaction_level INTEGER CHECK (satisfaction_level >= 1 AND satisfaction_level <= 10),
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Coaching Sessions Table
CREATE TABLE IF NOT EXISTS coaching_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  goal_id UUID REFERENCES user_goals(id) ON DELETE SET NULL,
  life_area_id UUID REFERENCES life_areas(id) ON DELETE SET NULL,
  conversation_summary TEXT,
  action_items JSONB DEFAULT '[]',
  insights TEXT,
  session_type TEXT DEFAULT 'general_chat' CHECK (session_type IN ('onboarding', 'goal_coaching', 'check_in', 'general_chat', 'problem_solving')),
  topics_discussed TEXT[] DEFAULT ARRAY[]::TEXT[],
  mood_rating INTEGER CHECK (mood_rating >= 1 AND mood_rating <= 10),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Enhanced Chat Messages Table
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES coaching_sessions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'goal_update', 'reflection', 'action_plan', 'check_in', 'insight')),
  mentioned_goals UUID[] DEFAULT ARRAY[]::UUID[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Goal Milestones Table
CREATE TABLE IF NOT EXISTS goal_milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  goal_id UUID REFERENCES user_goals(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  target_date DATE,
  completed_at TIMESTAMP WITH TIME ZONE,
  is_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Personal Insights Table
CREATE TABLE IF NOT EXISTS personal_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  insight_type TEXT NOT NULL CHECK (insight_type IN ('pattern', 'recommendation', 'celebration', 'warning', 'trend')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  related_goals UUID[] DEFAULT ARRAY[]::UUID[],
  confidence_score DECIMAL(3,2) CHECK (confidence_score >= 0 AND confidence_score <= 1),
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Habit Tracking Table
CREATE TABLE IF NOT EXISTS habit_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  goal_id UUID REFERENCES user_goals(id) ON DELETE CASCADE,
  habit_name TEXT NOT NULL,
  target_frequency INTEGER DEFAULT 1, -- times per day/week
  frequency_type TEXT DEFAULT 'daily' CHECK (frequency_type IN ('daily', 'weekly', 'monthly')),
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_completed_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Progress Photos Table
CREATE TABLE IF NOT EXISTS progress_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  goal_id UUID REFERENCES user_goals(id) ON DELETE CASCADE,
  photo_url TEXT NOT NULL,
  caption TEXT,
  progress_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Life Satisfaction Tracking
CREATE TABLE IF NOT EXISTS life_satisfaction_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  life_area_id UUID REFERENCES life_areas(id) ON DELETE CASCADE,
  satisfaction_score INTEGER NOT NULL CHECK (satisfaction_score >= 1 AND satisfaction_score <= 10),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. Check-in Schedules
CREATE TABLE IF NOT EXISTS check_in_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  goal_id UUID REFERENCES user_goals(id) ON DELETE CASCADE,
  frequency TEXT NOT NULL CHECK (frequency IN ('daily', 'weekly', 'monthly')),
  time_of_day TIME,
  days_of_week INTEGER[] DEFAULT ARRAY[]::INTEGER[], -- 0=Sunday, 1=Monday, etc.
  last_check_in TIMESTAMP WITH TIME ZONE,
  next_check_in TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_goals_user_id ON user_goals(user_id);
CREATE INDEX IF NOT EXISTS idx_user_goals_status ON user_goals(status);
CREATE INDEX IF NOT EXISTS idx_user_goals_category ON user_goals(category);
CREATE INDEX IF NOT EXISTS idx_life_areas_user_id ON life_areas(user_id);
CREATE INDEX IF NOT EXISTS idx_coaching_sessions_user_id ON coaching_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_coaching_sessions_goal_id ON coaching_sessions(goal_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id ON chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id ON chat_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_personal_insights_user_id ON personal_insights(user_id);
CREATE INDEX IF NOT EXISTS idx_habit_tracking_user_id ON habit_tracking(user_id);
CREATE INDEX IF NOT EXISTS idx_life_satisfaction_user_id ON life_satisfaction_entries(user_id);

-- Enable Row Level Security
ALTER TABLE user_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE life_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE coaching_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE goal_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE personal_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE habit_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE life_satisfaction_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE check_in_schedules ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- User Goals
CREATE POLICY "Users can manage their own goals" ON user_goals
  FOR ALL USING (auth.uid() = user_id);

-- Life Areas
CREATE POLICY "Users can manage their own life areas" ON life_areas
  FOR ALL USING (auth.uid() = user_id);

-- Coaching Sessions
CREATE POLICY "Users can manage their own coaching sessions" ON coaching_sessions
  FOR ALL USING (auth.uid() = user_id);

-- Chat Messages
CREATE POLICY "Users can manage their own chat messages" ON chat_messages
  FOR ALL USING (auth.uid() = user_id);

-- Goal Milestones
CREATE POLICY "Users can manage their own goal milestones" ON goal_milestones
  FOR ALL USING (auth.uid() IN (
    SELECT user_id FROM user_goals WHERE id = goal_milestones.goal_id
  ));

-- Personal Insights
CREATE POLICY "Users can view their own insights" ON personal_insights
  FOR ALL USING (auth.uid() = user_id);

-- Habit Tracking
CREATE POLICY "Users can manage their own habits" ON habit_tracking
  FOR ALL USING (auth.uid() = user_id);

-- Progress Photos
CREATE POLICY "Users can manage their own progress photos" ON progress_photos
  FOR ALL USING (auth.uid() = user_id);

-- Life Satisfaction Entries
CREATE POLICY "Users can manage their own satisfaction entries" ON life_satisfaction_entries
  FOR ALL USING (auth.uid() = user_id);

-- Check-in Schedules
CREATE POLICY "Users can manage their own check-in schedules" ON check_in_schedules
  FOR ALL USING (auth.uid() = user_id);

-- Update trigger for updated_at columns
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_goals_updated_at
  BEFORE UPDATE ON user_goals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_coaching_sessions_updated_at
  BEFORE UPDATE ON coaching_sessions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to automatically create default life areas for new users
CREATE OR REPLACE FUNCTION create_default_life_areas()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO life_areas (user_id, area_name, satisfaction_level) VALUES
    (NEW.id, 'Health & Fitness', 5),
    (NEW.id, 'Career & Business', 5),
    (NEW.id, 'Relationships', 5),
    (NEW.id, 'Learning & Growth', 5),
    (NEW.id, 'Finance', 5),
    (NEW.id, 'Creativity & Hobbies', 5),
    (NEW.id, 'Lifestyle', 5),
    (NEW.id, 'Mental Health', 5);
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER create_default_life_areas_trigger
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION create_default_life_areas();

-- Function to calculate goal progress based on milestones
CREATE OR REPLACE FUNCTION calculate_goal_progress(goal_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
  total_milestones INTEGER;
  completed_milestones INTEGER;
  progress_percent INTEGER;
BEGIN
  SELECT COUNT(*) INTO total_milestones
  FROM goal_milestones
  WHERE goal_id = goal_uuid;

  IF total_milestones = 0 THEN
    RETURN 0;
  END IF;

  SELECT COUNT(*) INTO completed_milestones
  FROM goal_milestones
  WHERE goal_id = goal_uuid AND is_completed = TRUE;

  progress_percent := ROUND((completed_milestones::DECIMAL / total_milestones::DECIMAL) * 100);

  -- Update the goal's progress percentage
  UPDATE user_goals
  SET progress_percentage = progress_percent
  WHERE id = goal_uuid;

  RETURN progress_percent;
END;
$$ language 'plpgsql';

-- Function to get user's active goals with progress
CREATE OR REPLACE FUNCTION get_user_active_goals(user_uuid UUID)
RETURNS TABLE (
  id UUID,
  title TEXT,
  description TEXT,
  category TEXT,
  target_date DATE,
  progress_percentage INTEGER,
  priority_level TEXT,
  milestone_count BIGINT,
  completed_milestones BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    g.id,
    g.title,
    g.description,
    g.category,
    g.target_date,
    g.progress_percentage,
    g.priority_level,
    COALESCE(m.total_milestones, 0) as milestone_count,
    COALESCE(m.completed_milestones, 0) as completed_milestones
  FROM user_goals g
  LEFT JOIN (
    SELECT
      goal_id,
      COUNT(*) as total_milestones,
      COUNT(CASE WHEN is_completed THEN 1 END) as completed_milestones
    FROM goal_milestones
    GROUP BY goal_id
  ) m ON g.id = m.goal_id
  WHERE g.user_id = user_uuid AND g.status = 'active'
  ORDER BY g.priority_level DESC, g.created_at ASC;
END;
$$ language 'plpgsql';