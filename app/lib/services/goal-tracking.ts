import { supabase } from "../../../lib/supabase/client";
import type {
  UserGoal,
  GoalWithProgress,
  LifeArea,
  LifeAreaWithGoals,
  CoachingSession,
  PersonalInsight,
  GoalMilestone,
  HabitTracking,
  CheckInSchedule,
  LifeSatisfactionEntry,
  DashboardData,
  CoachingContext,
  LifeCategory,
  GoalStatus,
  PriorityLevel,
  SessionType,
  EnhancedUser
} from '../types/coaching';

export class GoalTrackingService {

  // User Management
  static async getCurrentUser(): Promise<EnhancedUser | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('Error fetching user details:', error);
      return null;
    }

    return data;
  }

  static async updateUserCoachingStyle(style: string): Promise<boolean> {
    const user = await this.getCurrentUser();
    if (!user) return false;

    const { error } = await supabase
      .from('users')
      .update({ preferred_coaching_style: style })
      .eq('id', user.id);

    return !error;
  }

  // Goal Management
  static async createGoal(goal: Partial<UserGoal>): Promise<UserGoal | null> {
    const user = await this.getCurrentUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('user_goals')
      .insert({
        ...goal,
        user_id: user.id
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating goal:', error);
      return null;
    }

    return data;
  }

  static async getUserGoals(status?: GoalStatus): Promise<UserGoal[]> {
    const user = await this.getCurrentUser();
    if (!user) return [];

    let query = supabase
      .from('user_goals')
      .select('*')
      .eq('user_id', user.id)
      .order('priority_level', { ascending: false })
      .order('created_at', { ascending: true });

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching goals:', error);
      return [];
    }

    return data || [];
  }

  static async getGoalsWithProgress(): Promise<GoalWithProgress[]> {
    const user = await this.getCurrentUser();
    if (!user) return [];

    const { data, error } = await supabase
      .rpc('get_user_active_goals', { user_uuid: user.id });

    if (error) {
      console.error('Error fetching goals with progress:', error);
      return [];
    }

    return data || [];
  }

  static async updateGoalProgress(goalId: string, progress: number): Promise<boolean> {
    const { error } = await supabase
      .from('user_goals')
      .update({
        progress_percentage: Math.max(0, Math.min(100, progress)),
        updated_at: new Date().toISOString()
      })
      .eq('id', goalId);

    return !error;
  }

  static async updateGoalStatus(goalId: string, status: GoalStatus): Promise<boolean> {
    const updates: any = {
      status,
      updated_at: new Date().toISOString()
    };

    if (status === 'completed') {
      updates.progress_percentage = 100;
    }

    const { error } = await supabase
      .from('user_goals')
      .update(updates)
      .eq('id', goalId);

    return !error;
  }

  // Goal Milestones
  static async createMilestone(milestone: Partial<GoalMilestone>): Promise<GoalMilestone | null> {
    const { data, error } = await supabase
      .from('goal_milestones')
      .insert(milestone)
      .select()
      .single();

    if (error) {
      console.error('Error creating milestone:', error);
      return null;
    }

    // Update goal progress based on milestones
    if (milestone.goal_id) {
      await this.calculateGoalProgressFromMilestones(milestone.goal_id);
    }

    return data;
  }

  static async getGoalMilestones(goalId: string): Promise<GoalMilestone[]> {
    const { data, error } = await supabase
      .from('goal_milestones')
      .select('*')
      .eq('goal_id', goalId)
      .order('target_date', { ascending: true });

    if (error) {
      console.error('Error fetching milestones:', error);
      return [];
    }

    return data || [];
  }

  static async completeMilestone(milestoneId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('goal_milestones')
      .update({
        is_completed: true,
        completed_at: new Date().toISOString()
      })
      .eq('id', milestoneId)
      .select()
      .single();

    if (error) {
      console.error('Error completing milestone:', error);
      return false;
    }

    // Update goal progress
    if (data.goal_id) {
      await this.calculateGoalProgressFromMilestones(data.goal_id);
    }

    return true;
  }

  private static async calculateGoalProgressFromMilestones(goalId: string): Promise<void> {
    const { data } = await supabase
      .rpc('calculate_goal_progress', { goal_uuid: goalId });
  }

  // Life Areas Management
  static async getLifeAreas(): Promise<LifeArea[]> {
    const user = await this.getCurrentUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('life_areas')
      .select('*')
      .eq('user_id', user.id)
      .order('area_name');

    if (error) {
      console.error('Error fetching life areas:', error);
      return [];
    }

    return data || [];
  }

  static async getLifeAreasWithGoals(): Promise<LifeAreaWithGoals[]> {
    const lifeAreas = await this.getLifeAreas();
    const goals = await this.getUserGoals('active');

    return lifeAreas.map(area => {
      const areaGoals = goals.filter(goal => {
        // Map life area names to goal categories
        const categoryMap: { [key: string]: LifeCategory[] } = {
          'Health & Fitness': ['health'],
          'Career & Business': ['career', 'business'],
          'Relationships': ['relationships'],
          'Learning & Growth': ['learning', 'personal_growth'],
          'Finance': ['finance'],
          'Creativity & Hobbies': ['creativity', 'hobbies'],
          'Lifestyle': ['lifestyle'],
          'Mental Health': ['mental_health']
        };

        const categories = categoryMap[area.area_name] || [];
        return categories.includes(goal.category);
      });

      const completedGoals = areaGoals.filter(g => g.status === 'completed').length;
      const totalGoals = areaGoals.length;

      return {
        ...area,
        active_goals: areaGoals,
        recent_progress: 0, // TODO: Calculate from satisfaction history
        goal_completion_rate: totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0
      };
    });
  }

  static async updateLifeAreaSatisfaction(areaId: string, satisfaction: number): Promise<boolean> {
    const { error } = await supabase
      .from('life_areas')
      .update({
        satisfaction_level: satisfaction,
        last_updated: new Date().toISOString()
      })
      .eq('id', areaId);

    // Also create a satisfaction entry for tracking
    if (!error) {
      await supabase
        .from('life_satisfaction_entries')
        .insert({
          life_area_id: areaId,
          satisfaction_score: satisfaction,
          created_at: new Date().toISOString()
        });
    }

    return !error;
  }

  // Coaching Sessions
  static async createCoachingSession(session: Partial<CoachingSession>): Promise<CoachingSession | null> {
    const user = await this.getCurrentUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('coaching_sessions')
      .insert({
        ...session,
        user_id: user.id
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating coaching session:', error);
      return null;
    }

    return data;
  }

  static async getRecentCoachingSessions(limit: number = 10): Promise<CoachingSession[]> {
    const user = await this.getCurrentUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('coaching_sessions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching coaching sessions:', error);
      return [];
    }

    return data || [];
  }

  static async updateSessionSummary(sessionId: string, summary: string, insights?: string): Promise<boolean> {
    const { error } = await supabase
      .from('coaching_sessions')
      .update({
        conversation_summary: summary,
        insights: insights,
        updated_at: new Date().toISOString()
      })
      .eq('id', sessionId);

    return !error;
  }

  // Personal Insights
  static async createInsight(insight: Partial<PersonalInsight>): Promise<PersonalInsight | null> {
    const user = await this.getCurrentUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('personal_insights')
      .insert({
        ...insight,
        user_id: user.id
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating insight:', error);
      return null;
    }

    return data;
  }

  static async getUnreadInsights(): Promise<PersonalInsight[]> {
    const user = await this.getCurrentUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('personal_insights')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_read', false)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching insights:', error);
      return [];
    }

    return data || [];
  }

  static async markInsightAsRead(insightId: string): Promise<boolean> {
    const { error } = await supabase
      .from('personal_insights')
      .update({ is_read: true })
      .eq('id', insightId);

    return !error;
  }

  // Dashboard Data
  static async getDashboardData(): Promise<DashboardData | null> {
    const user = await this.getCurrentUser();
    if (!user) return null;

    try {
      const [
        activeGoals,
        lifeAreas,
        recentInsights,
        recentSessions
      ] = await Promise.all([
        this.getGoalsWithProgress(),
        this.getLifeAreasWithGoals(),
        this.getUnreadInsights(),
        this.getRecentCoachingSessions(5)
      ]);

      // Calculate life analytics
      const totalGoals = activeGoals.length;
      const completedGoals = activeGoals.filter(g => g.status === 'completed').length;
      const avgSatisfaction = lifeAreas.reduce((sum, area) => sum + (area.satisfaction_level || 5), 0) / lifeAreas.length;

      return {
        user,
        active_goals: activeGoals,
        life_areas: lifeAreas,
        recent_insights: recentInsights,
        upcoming_check_ins: [], // TODO: Implement check-ins
        life_analytics: {
          overall_life_satisfaction: avgSatisfaction,
          most_improved_area: lifeAreas[0]?.area_name || '',
          areas_needing_attention: lifeAreas
            .filter(area => (area.satisfaction_level || 0) < 6)
            .map(area => area.area_name),
          goal_completion_rate: totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0,
          consistency_score: 75, // TODO: Calculate from habit data
          momentum_trend: 'stable' as const
        },
        habit_progress: [], // TODO: Implement habit tracking
        recent_sessions: recentSessions
      };
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      return null;
    }
  }

  // Coaching Context for AI
  static async getCoachingContext(): Promise<CoachingContext | null> {
    const user = await this.getCurrentUser();
    if (!user) return null;

    try {
      const [
        activeGoals,
        recentSessions,
        lifeAreas
      ] = await Promise.all([
        this.getGoalsWithProgress(),
        this.getRecentCoachingSessions(5),
        this.getLifeAreas()
      ]);

      // Build life satisfaction map
      const lifeSatisfaction: { [area: string]: number } = {};
      lifeAreas.forEach(area => {
        lifeSatisfaction[area.area_name] = area.satisfaction_level || 5;
      });

      // Calculate recent progress for each goal
      const recentProgress: { [goalId: string]: number } = {};
      activeGoals.forEach(goal => {
        recentProgress[goal.id] = goal.progress_percentage;
      });

      // Find upcoming deadlines
      const now = new Date();
      const upcomingDeadlines = activeGoals
        .filter(goal => goal.target_date)
        .map(goal => ({
          goal,
          days_until: Math.ceil((new Date(goal.target_date!).getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
        }))
        .filter(item => item.days_until > 0 && item.days_until <= 30)
        .sort((a, b) => a.days_until - b.days_until);

      return {
        user,
        active_goals: activeGoals,
        recent_sessions: recentSessions,
        life_satisfaction: lifeSatisfaction,
        recent_progress: recentProgress,
        upcoming_deadlines: upcomingDeadlines,
        action_items_due: [], // TODO: Extract from recent sessions
        conversation_history: [] // Will be populated by chat service
      };
    } catch (error) {
      console.error('Error building coaching context:', error);
      return null;
    }
  }

  // Analytics and Insights
  static async generatePersonalInsights(): Promise<PersonalInsight[]> {
    const context = await this.getCoachingContext();
    if (!context) return [];

    const insights: Partial<PersonalInsight>[] = [];

    // Analyze goal progress patterns
    const stagnantGoals = context.active_goals.filter(goal =>
      goal.progress_percentage < 25 &&
      new Date(goal.created_at).getTime() < Date.now() - (30 * 24 * 60 * 60 * 1000)
    );

    if (stagnantGoals.length > 0) {
      insights.push({
        insight_type: 'warning',
        title: 'Goals Need Attention',
        description: `${stagnantGoals.length} goals haven't made much progress in the last month. Consider breaking them down into smaller steps or reassessing priorities.`,
        related_goals: stagnantGoals.map(g => g.id),
        confidence_score: 0.8
      });
    }

    // Identify momentum patterns
    const highProgressGoals = context.active_goals.filter(goal => goal.progress_percentage > 75);
    if (highProgressGoals.length > 0) {
      insights.push({
        insight_type: 'celebration',
        title: 'Strong Momentum!',
        description: `You're making excellent progress on ${highProgressGoals.length} goals. Keep up the great work!`,
        related_goals: highProgressGoals.map(g => g.id),
        confidence_score: 0.9
      });
    }

    // Analyze life balance
    const lowSatisfactionAreas = Object.entries(context.life_satisfaction)
      .filter(([_, score]) => score < 6)
      .map(([area, _]) => area);

    if (lowSatisfactionAreas.length > 0) {
      insights.push({
        insight_type: 'recommendation',
        title: 'Life Balance Opportunity',
        description: `Consider setting goals in ${lowSatisfactionAreas.join(', ')} to improve overall life satisfaction.`,
        related_goals: [],
        confidence_score: 0.7
      });
    }

    // Create insights in database
    const createdInsights: PersonalInsight[] = [];
    for (const insight of insights) {
      const created = await this.createInsight(insight);
      if (created) {
        createdInsights.push(created);
      }
    }

    return createdInsights;
  }

  // Habit Tracking
  static async createHabit(habit: Partial<HabitTracking>): Promise<HabitTracking | null> {
    const user = await this.getCurrentUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('habit_tracking')
      .insert({
        ...habit,
        user_id: user.id
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating habit:', error);
      return null;
    }

    return data;
  }

  static async markHabitComplete(habitId: string): Promise<boolean> {
    const today = new Date().toISOString().split('T')[0];

    const { data: habit, error: fetchError } = await supabase
      .from('habit_tracking')
      .select('*')
      .eq('id', habitId)
      .single();

    if (fetchError || !habit) return false;

    // Calculate new streak
    const lastCompleted = habit.last_completed_date;
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    let newStreak = 1;
    if (lastCompleted === yesterdayStr) {
      newStreak = habit.current_streak + 1;
    } else if (lastCompleted === today) {
      // Already completed today
      return true;
    }

    const { error } = await supabase
      .from('habit_tracking')
      .update({
        current_streak: newStreak,
        longest_streak: Math.max(newStreak, habit.longest_streak),
        last_completed_date: today
      })
      .eq('id', habitId);

    return !error;
  }
}