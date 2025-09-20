// Enhanced Catalyst AI Types for Goal Tracking & Life Coaching

export type SubscriptionTier = 'free' | 'catalyst_plus' | 'catalyst_pro';

export type CoachingStyle = 'supportive' | 'direct' | 'analytical' | 'motivational';

export type LifeCategory =
  | 'health'
  | 'career'
  | 'relationships'
  | 'learning'
  | 'finance'
  | 'creativity'
  | 'personal_growth'
  | 'hobbies'
  | 'travel'
  | 'business'
  | 'lifestyle'
  | 'mental_health';

export type GoalStatus = 'active' | 'completed' | 'paused' | 'archived';

export type PriorityLevel = 'low' | 'medium' | 'high';

export type SessionType = 'onboarding' | 'goal_coaching' | 'check_in' | 'general_chat' | 'problem_solving';

export type MessageType = 'text' | 'goal_update' | 'reflection' | 'action_plan' | 'check_in' | 'insight';

export type InsightType = 'pattern' | 'recommendation' | 'celebration' | 'warning' | 'trend';

export type FrequencyType = 'daily' | 'weekly' | 'monthly';

// Core User Types
export interface EnhancedUser {
  id: string;
  email: string;
  created_at: string;
  subscription_tier: SubscriptionTier;
  stripe_customer_id?: string;
  subscription_id?: string;
  chats_used_this_month: number;
  last_reset_date: string;
  preferred_coaching_style: CoachingStyle;
  timezone: string;
}

// Goal Management Types
export interface UserGoal {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  category: LifeCategory;
  target_date?: string;
  status: GoalStatus;
  progress_percentage: number;
  priority_level: PriorityLevel;
  created_at: string;
  updated_at: string;
}

export interface GoalWithProgress extends UserGoal {
  milestone_count: number;
  completed_milestones: number;
  recent_activity?: CoachingSession[];
  next_milestone?: GoalMilestone;
}

export interface GoalMilestone {
  id: string;
  goal_id: string;
  title: string;
  description?: string;
  target_date?: string;
  completed_at?: string;
  is_completed: boolean;
  created_at: string;
}

// Life Area Types
export interface LifeArea {
  id: string;
  user_id: string;
  area_name: string;
  current_focus?: string;
  satisfaction_level?: number;
  last_updated: string;
  created_at: string;
}

export interface LifeAreaWithGoals extends LifeArea {
  active_goals: UserGoal[];
  recent_progress: number; // Change in satisfaction over time
  goal_completion_rate: number;
}

// Coaching & Conversation Types
export interface CoachingSession {
  id: string;
  user_id: string;
  goal_id?: string;
  life_area_id?: string;
  conversation_summary?: string;
  action_items: ActionItem[];
  insights?: string;
  session_type: SessionType;
  topics_discussed: string[];
  mood_rating?: number;
  created_at: string;
  updated_at: string;
}

export interface ActionItem {
  id: string;
  description: string;
  due_date?: string;
  is_completed: boolean;
  priority: PriorityLevel;
  related_goal_id?: string;
}

export interface ChatMessage {
  id: string;
  session_id: string;
  user_id: string;
  role: 'user' | 'assistant';
  content: string;
  message_type: MessageType;
  mentioned_goals: string[];
  created_at: string;
}

export interface EnhancedChatMessage extends ChatMessage {
  goal_context?: UserGoal[];
  insights?: PersonalInsight[];
  action_suggestions?: ActionItem[];
}

// Personal Insights & Analytics
export interface PersonalInsight {
  id: string;
  user_id: string;
  insight_type: InsightType;
  title: string;
  description: string;
  related_goals: string[];
  confidence_score: number;
  is_read: boolean;
  created_at: string;
}

export interface LifeAnalytics {
  overall_life_satisfaction: number;
  most_improved_area: string;
  areas_needing_attention: string[];
  goal_completion_rate: number;
  consistency_score: number;
  momentum_trend: 'increasing' | 'stable' | 'decreasing';
}

// Habit Tracking Types
export interface HabitTracking {
  id: string;
  user_id: string;
  goal_id: string;
  habit_name: string;
  target_frequency: number;
  frequency_type: FrequencyType;
  current_streak: number;
  longest_streak: number;
  last_completed_date?: string;
  created_at: string;
}

export interface HabitProgress {
  habit: HabitTracking;
  completion_rate: number;
  recent_performance: boolean[]; // Last 30 days
  trend: 'improving' | 'stable' | 'declining';
}

// Progress Tracking Types
export interface ProgressPhoto {
  id: string;
  user_id: string;
  goal_id: string;
  photo_url: string;
  caption?: string;
  progress_notes?: string;
  created_at: string;
}

export interface LifeSatisfactionEntry {
  id: string;
  user_id: string;
  life_area_id: string;
  satisfaction_score: number;
  notes?: string;
  created_at: string;
}

// Check-in & Reminder Types
export interface CheckInSchedule {
  id: string;
  user_id: string;
  goal_id: string;
  frequency: FrequencyType;
  time_of_day?: string;
  days_of_week: number[];
  last_check_in?: string;
  next_check_in?: string;
  is_active: boolean;
  created_at: string;
}

// Dashboard & UI Types
export interface DashboardData {
  user: EnhancedUser;
  active_goals: GoalWithProgress[];
  life_areas: LifeAreaWithGoals[];
  recent_insights: PersonalInsight[];
  upcoming_check_ins: CheckInSchedule[];
  life_analytics: LifeAnalytics;
  habit_progress: HabitProgress[];
  recent_sessions: CoachingSession[];
}

export interface LifeWheelData {
  area: string;
  current_satisfaction: number;
  goal_count: number;
  progress_trend: number;
  color: string;
}

// Goal Setting & Onboarding Types
export interface OnboardingStep {
  step: number;
  title: string;
  description: string;
  component: string;
  is_completed: boolean;
  data?: any;
}

export interface GoalWizardData {
  selected_life_areas: LifeCategory[];
  goals: Partial<UserGoal>[];
  milestones: { [goalId: string]: Partial<GoalMilestone>[] };
  check_in_preferences: {
    frequency: FrequencyType;
    time_of_day: string;
    coaching_style: CoachingStyle;
  };
  current_state: {
    [category: string]: {
      current_level: number;
      motivation: string;
      obstacles: string[];
    };
  };
}

// AI Coaching Context Types
export interface CoachingContext {
  user: EnhancedUser;
  active_goals: GoalWithProgress[];
  recent_sessions: CoachingSession[];
  current_mood?: number;
  life_satisfaction: { [area: string]: number };
  recent_progress: { [goalId: string]: number };
  upcoming_deadlines: { goal: UserGoal; days_until: number }[];
  action_items_due: ActionItem[];
  conversation_history: ChatMessage[];
}

export interface AIPersonalityPrompt {
  system_prompt: string;
  context_summary: string;
  goal_awareness: string;
  recent_progress: string;
  coaching_style_instructions: string;
  current_focus_areas: string[];
}

// API Response Types
export interface GoalResponse {
  success: boolean;
  data?: UserGoal;
  error?: string;
}

export interface SessionResponse {
  success: boolean;
  data?: CoachingSession;
  insights?: PersonalInsight[];
  action_items?: ActionItem[];
  error?: string;
}

export interface ChatResponse {
  success: boolean;
  message?: EnhancedChatMessage;
  session_id?: string;
  goal_updates?: { [goalId: string]: number };
  new_insights?: PersonalInsight[];
  error?: string;
}

// Life Category Configurations
export const LIFE_CATEGORIES: Record<LifeCategory, {
  name: string;
  icon: string;
  description: string;
  example_goals: string[];
  color: string;
}> = {
  health: {
    name: 'Health & Fitness',
    icon: '💪',
    description: 'Exercise, nutrition, wellness',
    example_goals: ['Lose 20 pounds by summer', 'Run a 5K', 'Meal prep consistently'],
    color: 'emerald'
  },
  career: {
    name: 'Career & Business',
    icon: '💼',
    description: 'Professional growth, skills, income',
    example_goals: ['Get promoted', 'Learn Python', 'Start a side business'],
    color: 'blue'
  },
  relationships: {
    name: 'Relationships',
    icon: '❤️',
    description: 'Family, friends, dating, social connections',
    example_goals: ['Improve communication with partner', 'Make 3 new friends'],
    color: 'pink'
  },
  learning: {
    name: 'Learning & Growth',
    icon: '🧠',
    description: 'New skills, education, personal development',
    example_goals: ['Learn Spanish', 'Read 24 books this year', 'Take online course'],
    color: 'purple'
  },
  finance: {
    name: 'Finance',
    icon: '💰',
    description: 'Budgeting, investing, financial freedom',
    example_goals: ['Save $10k emergency fund', 'Invest 15% of income', 'Pay off debt'],
    color: 'green'
  },
  creativity: {
    name: 'Creativity & Hobbies',
    icon: '🎨',
    description: 'Art, music, crafts, side projects',
    example_goals: ['Paint 12 artworks', 'Learn guitar', 'Write a novel'],
    color: 'orange'
  },
  personal_growth: {
    name: 'Personal Growth',
    icon: '🌱',
    description: 'Habits, mindfulness, self-improvement',
    example_goals: ['Meditate daily', 'Wake up at 6am', 'Journal regularly'],
    color: 'teal'
  },
  hobbies: {
    name: 'Hobbies',
    icon: '🎯',
    description: 'Recreation, entertainment, passions',
    example_goals: ['Learn photography', 'Join hiking group', 'Master chess'],
    color: 'indigo'
  },
  travel: {
    name: 'Travel',
    icon: '✈️',
    description: 'Adventures, exploration, experiences',
    example_goals: ['Visit 5 countries', 'Take family vacation', 'Learn travel skills'],
    color: 'cyan'
  },
  business: {
    name: 'Business',
    icon: '🚀',
    description: 'Entrepreneurship, leadership, innovation',
    example_goals: ['Launch startup', 'Increase revenue 50%', 'Build team'],
    color: 'violet'
  },
  lifestyle: {
    name: 'Lifestyle',
    icon: '🏠',
    description: 'Home, organization, daily routines',
    example_goals: ['Organize home', 'Create morning routine', 'Reduce screen time'],
    color: 'amber'
  },
  mental_health: {
    name: 'Mental Health',
    icon: '🧘',
    description: 'Stress management, therapy, well-being',
    example_goals: ['Reduce anxiety', 'Practice mindfulness', 'Improve sleep'],
    color: 'rose'
  }
};

export const COACHING_STYLES: Record<CoachingStyle, {
  name: string;
  description: string;
  prompt_style: string;
}> = {
  supportive: {
    name: 'Gentle and Encouraging',
    description: 'Warm, understanding, focuses on positive reinforcement',
    prompt_style: 'Be warm, empathetic, and encouraging. Celebrate small wins and provide gentle guidance when facing setbacks.'
  },
  direct: {
    name: 'Direct and Challenging',
    description: 'Straightforward, honest, pushes for accountability',
    prompt_style: 'Be direct and honest about progress. Challenge them to push harder and hold them accountable to their commitments.'
  },
  analytical: {
    name: 'Analytical and Strategic',
    description: 'Data-driven, logical, focuses on systems and processes',
    prompt_style: 'Provide data-driven insights, break down complex goals into systematic steps, and focus on measurable progress.'
  },
  motivational: {
    name: 'Motivational and Energetic',
    description: 'High-energy, inspiring, focuses on big picture vision',
    prompt_style: 'Be energetic and inspiring. Connect their daily actions to their bigger vision and keep them motivated about their potential.'
  }
};