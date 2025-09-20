-- Learning Platform Database Schema
-- Complete learning management system with courses, modules, certificates

-- Learning categories for organizing courses
CREATE TABLE learning_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_name TEXT NOT NULL UNIQUE,
  category_slug TEXT NOT NULL UNIQUE,
  description TEXT,
  category_icon TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Main courses table
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_title TEXT NOT NULL,
  course_slug TEXT NOT NULL UNIQUE,
  short_description TEXT,
  detailed_description TEXT,
  course_image_url TEXT,
  category_id UUID REFERENCES learning_categories(id),
  instructor_name TEXT,
  instructor_bio TEXT,
  instructor_avatar_url TEXT,
  difficulty_level TEXT CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced', 'expert')) DEFAULT 'beginner',
  estimated_duration_minutes INTEGER DEFAULT 0,
  course_price DECIMAL(10,2) DEFAULT 0.00,
  subscription_tier TEXT CHECK (subscription_tier IN ('free', 'catalyst_basic', 'catalyst_plus', 'enterprise')) DEFAULT 'free',
  is_featured BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  learning_objectives TEXT[], -- Array of learning objectives
  prerequisites TEXT[], -- Array of prerequisites
  target_audience TEXT,
  tags TEXT[], -- Array of tags for search/filtering
  meta_keywords TEXT,
  meta_description TEXT,
  certificate_enabled BOOLEAN DEFAULT true,
  completion_certificate_template TEXT, -- Template for completion certificate
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Course modules (sections within courses)
CREATE TABLE course_modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  module_title TEXT NOT NULL,
  module_description TEXT,
  module_order INTEGER NOT NULL,
  estimated_duration_minutes INTEGER DEFAULT 0,
  is_required BOOLEAN DEFAULT true,
  unlock_criteria JSONB, -- Conditions to unlock this module
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Individual lessons within modules
CREATE TABLE course_lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID REFERENCES course_modules(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  lesson_title TEXT NOT NULL,
  lesson_slug TEXT NOT NULL,
  lesson_content TEXT, -- Markdown/HTML content
  lesson_type TEXT CHECK (lesson_type IN ('video', 'text', 'interactive', 'quiz', 'assignment', 'discussion')) DEFAULT 'text',
  video_url TEXT,
  video_duration_seconds INTEGER,
  lesson_order INTEGER NOT NULL,
  estimated_read_time_minutes INTEGER DEFAULT 5,
  is_optional BOOLEAN DEFAULT false,
  interactive_content JSONB, -- For interactive elements
  discussion_enabled BOOLEAN DEFAULT false,
  resources JSONB, -- Additional resources/downloads
  ai_coaching_prompts JSONB, -- AI coaching integration
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Quizzes and assessments within lessons
CREATE TABLE lesson_quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID REFERENCES course_lessons(id) ON DELETE CASCADE,
  quiz_title TEXT NOT NULL,
  quiz_description TEXT,
  quiz_type TEXT CHECK (quiz_type IN ('multiple_choice', 'true_false', 'fill_blank', 'essay', 'practical')) DEFAULT 'multiple_choice',
  passing_score INTEGER DEFAULT 70, -- Percentage needed to pass
  max_attempts INTEGER DEFAULT 3,
  time_limit_minutes INTEGER,
  is_required BOOLEAN DEFAULT true,
  questions JSONB NOT NULL, -- Quiz questions and answers
  ai_feedback_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- User course enrollments
CREATE TABLE course_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  enrollment_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  completion_date TIMESTAMP WITH TIME ZONE,
  completion_percentage DECIMAL(5,2) DEFAULT 0.00,
  last_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  current_lesson_id UUID REFERENCES course_lessons(id),
  is_completed BOOLEAN DEFAULT false,
  certificate_issued_at TIMESTAMP WITH TIME ZONE,
  certificate_id TEXT, -- Unique certificate identifier
  enrollment_source TEXT DEFAULT 'direct', -- How they enrolled
  notes TEXT,
  UNIQUE(user_id, course_id)
);

-- User progress tracking for lessons
CREATE TABLE lesson_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES course_lessons(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP WITH TIME ZONE,
  time_spent_seconds INTEGER DEFAULT 0,
  is_completed BOOLEAN DEFAULT false,
  completion_percentage DECIMAL(5,2) DEFAULT 0.00,
  notes TEXT,
  bookmarks JSONB, -- User bookmarks within the lesson
  ai_coaching_history JSONB, -- AI coaching interactions
  UNIQUE(user_id, lesson_id)
);

-- Quiz attempts and results
CREATE TABLE quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  quiz_id UUID REFERENCES lesson_quizzes(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES course_lessons(id) ON DELETE CASCADE,
  attempt_number INTEGER NOT NULL,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP WITH TIME ZONE,
  score_percentage DECIMAL(5,2),
  is_passed BOOLEAN DEFAULT false,
  time_taken_seconds INTEGER,
  answers JSONB, -- User's answers
  ai_feedback JSONB, -- AI-generated feedback
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Course certificates issued to users
CREATE TABLE course_certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  certificate_id TEXT NOT NULL UNIQUE, -- Public-facing certificate ID
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  issued_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  certificate_data JSONB NOT NULL, -- Certificate details and verification data
  certificate_url TEXT, -- URL to view/download certificate
  is_verified BOOLEAN DEFAULT true,
  verification_hash TEXT, -- For certificate authenticity
  expiration_date TIMESTAMP WITH TIME ZONE, -- If certificates expire
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Learning paths (curated sequences of courses)
CREATE TABLE learning_paths (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  path_name TEXT NOT NULL,
  path_slug TEXT NOT NULL UNIQUE,
  path_description TEXT,
  path_image_url TEXT,
  difficulty_level TEXT CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced', 'expert')) DEFAULT 'beginner',
  estimated_duration_hours INTEGER DEFAULT 0,
  subscription_tier TEXT CHECK (subscription_tier IN ('free', 'catalyst_basic', 'catalyst_plus', 'enterprise')) DEFAULT 'free',
  is_featured BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT false,
  course_sequence JSONB NOT NULL, -- Ordered list of course IDs
  learning_objectives TEXT[],
  target_role TEXT, -- Target job role/position
  industry_focus TEXT,
  ai_personalization_enabled BOOLEAN DEFAULT true,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- User learning path enrollments
CREATE TABLE learning_path_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  path_id UUID REFERENCES learning_paths(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP WITH TIME ZONE,
  current_course_id UUID REFERENCES courses(id),
  completion_percentage DECIMAL(5,2) DEFAULT 0.00,
  is_completed BOOLEAN DEFAULT false,
  ai_recommendations JSONB, -- AI-generated recommendations
  UNIQUE(user_id, path_id)
);

-- Course reviews and ratings
CREATE TABLE course_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  review_title TEXT,
  review_text TEXT,
  is_recommended BOOLEAN,
  is_verified_completion BOOLEAN DEFAULT false, -- Only completed students
  helpful_votes INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  is_approved BOOLEAN DEFAULT false,
  moderation_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, course_id)
);

-- Discussion forums for courses
CREATE TABLE course_discussions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES course_lessons(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES course_discussions(id), -- For threaded discussions
  discussion_title TEXT,
  discussion_content TEXT NOT NULL,
  is_question BOOLEAN DEFAULT false,
  is_answered BOOLEAN DEFAULT false,
  accepted_answer_id UUID REFERENCES course_discussions(id),
  upvotes INTEGER DEFAULT 0,
  is_instructor_response BOOLEAN DEFAULT false,
  is_pinned BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- AI-powered learning analytics
CREATE TABLE learning_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  analytics_date DATE DEFAULT CURRENT_DATE,
  total_courses_enrolled INTEGER DEFAULT 0,
  total_courses_completed INTEGER DEFAULT 0,
  total_lessons_completed INTEGER DEFAULT 0,
  total_time_spent_minutes INTEGER DEFAULT 0,
  average_quiz_score DECIMAL(5,2),
  learning_streak_days INTEGER DEFAULT 0,
  preferred_learning_style TEXT,
  skill_assessments JSONB, -- AI-assessed skill levels
  learning_velocity DECIMAL(5,2), -- Lessons per day
  engagement_score DECIMAL(5,2), -- 0-100 engagement rating
  ai_recommendations JSONB, -- Personalized course recommendations
  learning_goals_progress JSONB, -- Progress toward learning goals
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, analytics_date)
);

-- Course completion requirements
CREATE TABLE course_completion_requirements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  requirement_type TEXT CHECK (requirement_type IN ('lesson_completion', 'quiz_passing', 'assignment_submission', 'project_completion', 'peer_review')) NOT NULL,
  requirement_details JSONB NOT NULL,
  is_required BOOLEAN DEFAULT true,
  weight_percentage DECIMAL(5,2) DEFAULT 0.00, -- Weight in overall completion
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance optimization
CREATE INDEX idx_courses_category_published ON courses(category_id, is_published);
CREATE INDEX idx_courses_subscription_tier ON courses(subscription_tier);
CREATE INDEX idx_course_modules_course_order ON course_modules(course_id, module_order);
CREATE INDEX idx_course_lessons_module_order ON course_lessons(module_id, lesson_order);
CREATE INDEX idx_course_enrollments_user ON course_enrollments(user_id);
CREATE INDEX idx_course_enrollments_completion ON course_enrollments(user_id, is_completed);
CREATE INDEX idx_lesson_progress_user_completion ON lesson_progress(user_id, is_completed);
CREATE INDEX idx_quiz_attempts_user_quiz ON quiz_attempts(user_id, quiz_id);
CREATE INDEX idx_course_certificates_user ON course_certificates(user_id);
CREATE INDEX idx_course_certificates_verification ON course_certificates(certificate_id, verification_hash);
CREATE INDEX idx_learning_analytics_user_date ON learning_analytics(user_id, analytics_date);
CREATE INDEX idx_course_reviews_course_rating ON course_reviews(course_id, rating);
CREATE INDEX idx_course_discussions_course_lesson ON course_discussions(course_id, lesson_id);

-- Row Level Security (RLS) Policies
ALTER TABLE learning_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_paths ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_path_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_discussions ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_completion_requirements ENABLE ROW LEVEL SECURITY;

-- Public access policies for published content
CREATE POLICY "Public can view published courses" ON courses FOR SELECT USING (is_published = true);
CREATE POLICY "Public can view active categories" ON learning_categories FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view published learning paths" ON learning_paths FOR SELECT USING (is_published = true);

-- User access policies
CREATE POLICY "Users can view their enrollments" ON course_enrollments FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view their progress" ON lesson_progress FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view their quiz attempts" ON quiz_attempts FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view their certificates" ON course_certificates FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view their learning analytics" ON learning_analytics FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their reviews" ON course_reviews FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can participate in discussions" ON course_discussions FOR ALL USING (auth.uid() = user_id);

-- Course access policies (based on enrollment)
CREATE POLICY "Enrolled users can view course modules" ON course_modules FOR SELECT
  USING (EXISTS (SELECT 1 FROM course_enrollments WHERE user_id = auth.uid() AND course_id = course_modules.course_id));

CREATE POLICY "Enrolled users can view course lessons" ON course_lessons FOR SELECT
  USING (EXISTS (SELECT 1 FROM course_enrollments WHERE user_id = auth.uid() AND course_id = course_lessons.course_id));

CREATE POLICY "Enrolled users can view lesson quizzes" ON lesson_quizzes FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM course_enrollments ce
    JOIN course_lessons cl ON ce.course_id = cl.course_id
    WHERE ce.user_id = auth.uid() AND cl.id = lesson_quizzes.lesson_id
  ));

-- Functions for course operations

-- Function to enroll user in a course
CREATE OR REPLACE FUNCTION enroll_user_in_course(
  p_user_id UUID,
  p_course_id UUID,
  p_enrollment_source TEXT DEFAULT 'direct'
)
RETURNS BOOLEAN AS $$
DECLARE
  course_subscription_tier TEXT;
  user_subscription_tier TEXT;
BEGIN
  -- Get course subscription requirement
  SELECT subscription_tier INTO course_subscription_tier
  FROM courses WHERE id = p_course_id AND is_published = true;

  IF course_subscription_tier IS NULL THEN
    RETURN FALSE; -- Course doesn't exist or isn't published
  END IF;

  -- Get user's subscription tier (assuming this exists in user metadata)
  SELECT COALESCE(raw_user_meta_data->>'subscription_tier', 'free') INTO user_subscription_tier
  FROM auth.users WHERE id = p_user_id;

  -- Check if user has access to this course
  IF NOT can_user_access_course(user_subscription_tier, course_subscription_tier) THEN
    RETURN FALSE; -- Insufficient subscription level
  END IF;

  -- Create enrollment record
  INSERT INTO course_enrollments (user_id, course_id, enrollment_source)
  VALUES (p_user_id, p_course_id, p_enrollment_source)
  ON CONFLICT (user_id, course_id) DO NOTHING;

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check course access based on subscription
CREATE OR REPLACE FUNCTION can_user_access_course(
  user_tier TEXT,
  course_tier TEXT
)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN CASE
    WHEN course_tier = 'free' THEN TRUE
    WHEN course_tier = 'catalyst_basic' AND user_tier IN ('catalyst_basic', 'catalyst_plus', 'enterprise') THEN TRUE
    WHEN course_tier = 'catalyst_plus' AND user_tier IN ('catalyst_plus', 'enterprise') THEN TRUE
    WHEN course_tier = 'enterprise' AND user_tier = 'enterprise' THEN TRUE
    ELSE FALSE
  END;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate course completion percentage
CREATE OR REPLACE FUNCTION calculate_course_completion(
  p_user_id UUID,
  p_course_id UUID
)
RETURNS DECIMAL AS $$
DECLARE
  total_lessons INTEGER;
  completed_lessons INTEGER;
  completion_pct DECIMAL(5,2);
BEGIN
  -- Count total lessons in course
  SELECT COUNT(*) INTO total_lessons
  FROM course_lessons cl
  JOIN course_modules cm ON cl.module_id = cm.id
  WHERE cm.course_id = p_course_id;

  IF total_lessons = 0 THEN
    RETURN 100.00;
  END IF;

  -- Count completed lessons
  SELECT COUNT(*) INTO completed_lessons
  FROM lesson_progress lp
  JOIN course_lessons cl ON lp.lesson_id = cl.id
  WHERE lp.user_id = p_user_id
    AND cl.course_id = p_course_id
    AND lp.is_completed = true;

  completion_pct := (completed_lessons::DECIMAL / total_lessons::DECIMAL) * 100;

  -- Update enrollment record
  UPDATE course_enrollments
  SET completion_percentage = completion_pct,
      is_completed = (completion_pct >= 100.00),
      completion_date = CASE WHEN completion_pct >= 100.00 THEN CURRENT_TIMESTAMP ELSE NULL END
  WHERE user_id = p_user_id AND course_id = p_course_id;

  RETURN completion_pct;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to issue course certificate
CREATE OR REPLACE FUNCTION issue_course_certificate(
  p_user_id UUID,
  p_course_id UUID
)
RETURNS TEXT AS $$
DECLARE
  cert_id TEXT;
  user_email TEXT;
  user_name TEXT;
  course_title TEXT;
  certificate_data JSONB;
  verification_hash TEXT;
BEGIN
  -- Check if course is completed
  IF NOT EXISTS (
    SELECT 1 FROM course_enrollments
    WHERE user_id = p_user_id AND course_id = p_course_id AND is_completed = true
  ) THEN
    RETURN NULL; -- Course not completed
  END IF;

  -- Check if certificate already exists
  SELECT certificate_id INTO cert_id
  FROM course_certificates
  WHERE user_id = p_user_id AND course_id = p_course_id;

  IF cert_id IS NOT NULL THEN
    RETURN cert_id; -- Certificate already exists
  END IF;

  -- Generate unique certificate ID
  cert_id := 'CERT-' || UPPER(SUBSTRING(gen_random_uuid()::TEXT FROM 1 FOR 8));

  -- Get user and course details
  SELECT email, COALESCE(raw_user_meta_data->>'full_name', email)
  INTO user_email, user_name
  FROM auth.users WHERE id = p_user_id;

  SELECT course_title INTO course_title FROM courses WHERE id = p_course_id;

  -- Create certificate data
  certificate_data := jsonb_build_object(
    'certificate_id', cert_id,
    'user_name', user_name,
    'user_email', user_email,
    'course_title', course_title,
    'completion_date', CURRENT_TIMESTAMP,
    'issued_by', 'Catalyst AI Learning Platform'
  );

  -- Generate verification hash
  verification_hash := encode(digest(cert_id || user_email || course_title || CURRENT_TIMESTAMP::TEXT, 'sha256'), 'hex');

  -- Insert certificate record
  INSERT INTO course_certificates (
    certificate_id, user_id, course_id, certificate_data,
    verification_hash, certificate_url
  ) VALUES (
    cert_id, p_user_id, p_course_id, certificate_data,
    verification_hash, '/certificates/' || cert_id
  );

  -- Update enrollment record
  UPDATE course_enrollments
  SET certificate_issued_at = CURRENT_TIMESTAMP, certificate_id = cert_id
  WHERE user_id = p_user_id AND course_id = p_course_id;

  RETURN cert_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get personalized course recommendations
CREATE OR REPLACE FUNCTION get_course_recommendations(
  p_user_id UUID,
  p_limit INTEGER DEFAULT 10
)
RETURNS TABLE (
  course_id UUID,
  course_title TEXT,
  relevance_score DECIMAL,
  recommendation_reason TEXT
) AS $$
BEGIN
  RETURN QUERY
  WITH user_interests AS (
    -- Get user's learning patterns
    SELECT ARRAY_AGG(DISTINCT c.tags) as completed_tags,
           ARRAY_AGG(DISTINCT c.category_id) as completed_categories,
           AVG(cr.rating) as avg_rating_given
    FROM course_enrollments ce
    JOIN courses c ON ce.course_id = c.id
    LEFT JOIN course_reviews cr ON cr.course_id = c.id AND cr.user_id = p_user_id
    WHERE ce.user_id = p_user_id AND ce.is_completed = true
  ),
  recommendations AS (
    SELECT
      c.id as course_id,
      c.course_title,
      -- Simple relevance scoring based on tags and category overlap
      CASE
        WHEN c.category_id = ANY(SELECT UNNEST(completed_categories) FROM user_interests) THEN 0.8
        ELSE 0.4
      END +
      CASE
        WHEN c.tags && (SELECT completed_tags FROM user_interests) THEN 0.6
        ELSE 0.0
      END +
      -- Boost highly rated courses
      CASE
        WHEN (SELECT AVG(rating) FROM course_reviews WHERE course_id = c.id) >= 4.5 THEN 0.3
        WHEN (SELECT AVG(rating) FROM course_reviews WHERE course_id = c.id) >= 4.0 THEN 0.2
        ELSE 0.0
      END as relevance_score,
      'Based on your completed courses and interests' as recommendation_reason
    FROM courses c
    WHERE c.is_published = true
      AND NOT EXISTS (
        SELECT 1 FROM course_enrollments
        WHERE user_id = p_user_id AND course_id = c.id
      )
  )
  SELECT r.course_id, r.course_title, r.relevance_score, r.recommendation_reason
  FROM recommendations r
  ORDER BY r.relevance_score DESC, RANDOM() -- Add randomness for diversity
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION enroll_user_in_course TO authenticated;
GRANT EXECUTE ON FUNCTION calculate_course_completion TO authenticated;
GRANT EXECUTE ON FUNCTION issue_course_certificate TO authenticated;
GRANT EXECUTE ON FUNCTION get_course_recommendations TO authenticated;
GRANT EXECUTE ON FUNCTION can_user_access_course TO authenticated;

-- Insert sample data
INSERT INTO learning_categories (category_name, category_slug, description, category_icon, display_order) VALUES
('AI Strategy', 'ai-strategy', 'Learn how to develop and implement AI strategies for your business', '🧠', 1),
('Leadership', 'leadership', 'Executive leadership skills for the AI era', '👑', 2),
('Technology', 'technology', 'Technical deep-dives into AI and emerging technologies', '⚡', 3),
('Business Transformation', 'business-transformation', 'Transform your organization with AI and digital tools', '🚀', 4),
('Data & Analytics', 'data-analytics', 'Master data-driven decision making and analytics', '📊', 5);

-- Sample courses
INSERT INTO courses (course_title, course_slug, short_description, detailed_description, category_id, instructor_name, difficulty_level, estimated_duration_minutes, subscription_tier, is_published, is_featured, learning_objectives, prerequisites, target_audience)
SELECT
  'AI Strategy Fundamentals',
  'ai-strategy-fundamentals',
  'Master the foundations of AI strategy for business leaders',
  'This comprehensive course covers everything you need to know about developing and implementing AI strategies in your organization. Learn from real-world case studies and expert insights.',
  id,
  'Dr. Sarah Chen',
  'beginner',
  180,
  'catalyst_basic',
  true,
  true,
  ARRAY['Understand AI fundamentals', 'Develop AI strategy framework', 'Implement AI governance', 'Measure AI ROI'],
  ARRAY['Basic business knowledge', '2+ years management experience'],
  'Business leaders, executives, and strategy professionals'
FROM learning_categories WHERE category_slug = 'ai-strategy';

-- Trigger to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add update triggers to relevant tables
CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_course_modules_updated_at BEFORE UPDATE ON course_modules
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_course_lessons_updated_at BEFORE UPDATE ON course_lessons
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_learning_categories_updated_at BEFORE UPDATE ON learning_categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_learning_paths_updated_at BEFORE UPDATE ON learning_paths
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();