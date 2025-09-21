import { supabase } from "../../../lib/supabase/client";

export interface Goal {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  category?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  goal_type: 'outcome' | 'process' | 'habit';
  is_measurable: boolean;
  measurement_unit?: string;
  target_value?: number;
  current_value: number;
  start_date: string;
  target_date?: string;
  estimated_duration_days?: number;
  status: 'draft' | 'active' | 'paused' | 'completed' | 'abandoned';
  completion_percentage: number;
  why_important?: string;
  success_criteria: string[];
  potential_obstacles: string[];
  accountability_preferences: Record<string, any>;
  created_at: string;
  updated_at: string;
  completed_at?: string;
  last_progress_update?: string;
}

export interface ProgressUpdate {
  id: string;
  goal_id: string;
  user_id: string;
  progress_value?: number;
  progress_percentage: number;
  progress_note?: string;
  update_type: 'manual' | 'automatic' | 'ai_prompted';
  mood_rating?: number;
  confidence_rating?: number;
  challenges_faced: string[];
  wins_achieved: string[];
  lessons_learned?: string;
  next_steps: string[];
  ai_feedback?: string;
  ai_recommendations: string[];
  coaching_tone: 'supportive' | 'challenging' | 'analytical' | 'motivational';
  created_at: string;
}

export interface Milestone {
  id: string;
  goal_id: string;
  user_id: string;
  title: string;
  description?: string;
  target_value?: number;
  target_percentage: number;
  target_date?: string;
  is_completed: boolean;
  completed_at?: string;
  completed_value?: number;
  reward_type?: string;
  reward_description?: string;
  celebration_message?: string;
  created_at: string;
}

export interface GoalTemplate {
  id: string;
  title: string;
  description?: string;
  category?: string;
  goal_type: 'outcome' | 'process' | 'habit';
  template_data: Record<string, any>;
  difficulty_level: 'beginner' | 'medium' | 'advanced' | 'expert';
  estimated_duration_days?: number;
  usage_count: number;
  is_public: boolean;
  created_by?: string;
  coaching_prompts: Record<string, string>;
  accountability_suggestions: string[];
  created_at: string;
  updated_at: string;
}

export interface CheckIn {
  id: string;
  goal_id: string;
  user_id: string;
  accountability_id?: string;
  check_in_type: 'scheduled' | 'requested' | 'automatic' | 'milestone';
  status: 'pending' | 'completed' | 'skipped' | 'rescheduled';
  progress_since_last?: number;
  overall_progress_percentage?: number;
  user_satisfaction?: number;
  goal_adjustment_needed: boolean;
  reflection_data: Record<string, any>;
  user_notes?: string;
  partner_feedback?: string;
  ai_coaching_notes?: string;
  action_items: string[];
  commitments_made: string[];
  scheduled_for?: string;
  completed_at?: string;
  next_check_in?: string;
  created_at: string;
}

export interface GoalAnalytics {
  total_goals: number;
  active_goals: number;
  completed_goals: number;
  avg_completion_rate: number;
  goals_by_category: Record<string, number>;
  recent_progress_trend: Array<{
    date: string;
    updates: number;
    avg_progress: number;
  }>;
  milestone_completion_rate: number;
}

export class GoalTrackingService {

  // Get all goals for user
  static async getUserGoals(status?: Goal['status']): Promise<Goal[]> {
    try {
      let query = supabase
        .from('user_goals')
        .select('*')
        .order('created_at', { ascending: false });

      if (status) {
        query = query.eq('status', status);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching user goals:', error);
      return [];
    }
  }

  // Create new goal
  static async createGoal(goalData: Partial<Goal>): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .from('user_goals')
        .insert([{
          title: goalData.title,
          description: goalData.description,
          category: goalData.category,
          priority: goalData.priority || 'medium',
          goal_type: goalData.goal_type || 'outcome',
          is_measurable: goalData.is_measurable || false,
          measurement_unit: goalData.measurement_unit,
          target_value: goalData.target_value,
          current_value: goalData.current_value || 0,
          start_date: goalData.start_date || new Date().toISOString().split('T')[0],
          target_date: goalData.target_date,
          estimated_duration_days: goalData.estimated_duration_days,
          why_important: goalData.why_important,
          success_criteria: goalData.success_criteria || [],
          potential_obstacles: goalData.potential_obstacles || [],
          accountability_preferences: goalData.accountability_preferences || {}
        }])
        .select('id')
        .single();

      if (error) throw error;
      return data?.id || null;
    } catch (error) {
      console.error('Error creating goal:', error);
      return null;
    }
  }

  // Create goal from template
  static async createGoalFromTemplate(
    templateId: string,
    customTitle?: string,
    customTargetValue?: number,
    customTargetDate?: string
  ): Promise<string | null> {
    try {
      const { data, error } = await supabase.rpc('create_goal_from_template', {
        template_id_param: templateId,
        user_id_param: (await supabase.auth.getUser()).data.user?.id,
        custom_title: customTitle,
        custom_target_value: customTargetValue,
        custom_target_date: customTargetDate
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating goal from template:', error);
      return null;
    }
  }

  // Update goal progress
  static async updateProgress(
    goalId: string,
    progressValue: number,
    progressNote?: string,
    moodRating?: number,
    confidenceRating?: number
  ): Promise<boolean> {
    try {
      const { data, error } = await supabase.rpc('update_goal_progress', {
        goal_id_param: goalId,
        user_id_param: (await supabase.auth.getUser()).data.user?.id,
        progress_value_param: progressValue,
        progress_note_param: progressNote,
        mood_rating_param: moodRating,
        confidence_rating_param: confidenceRating
      });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating goal progress:', error);
      return false;
    }
  }

  // Get goal progress updates
  static async getProgressUpdates(goalId: string): Promise<ProgressUpdate[]> {
    try {
      const { data, error } = await supabase
        .from('goal_progress_updates')
        .select('*')
        .eq('goal_id', goalId)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching progress updates:', error);
      return [];
    }
  }

  // Get milestones for goal
  static async getMilestones(goalId: string): Promise<Milestone[]> {
    try {
      const { data, error } = await supabase
        .from('goal_milestones')
        .select('*')
        .eq('goal_id', goalId)
        .order('target_percentage', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching milestones:', error);
      return [];
    }
  }

  // Create milestone
  static async createMilestone(milestoneData: Partial<Milestone>): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .from('goal_milestones')
        .insert([milestoneData])
        .select('id')
        .single();

      if (error) throw error;
      return data?.id || null;
    } catch (error) {
      console.error('Error creating milestone:', error);
      return null;
    }
  }

  // Get goal templates
  static async getGoalTemplates(category?: string): Promise<GoalTemplate[]> {
    try {
      let query = supabase
        .from('goal_templates')
        .select('*')
        .eq('is_public', true)
        .order('usage_count', { ascending: false });

      if (category) {
        query = query.eq('category', category);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching goal templates:', error);
      return [];
    }
  }

  // Get user analytics
  static async getUserAnalytics(timePeriodDays: number = 30): Promise<GoalAnalytics | null> {
    try {
      const { data, error } = await supabase.rpc('get_user_goal_analytics', {
        user_id_param: (await supabase.auth.getUser()).data.user?.id,
        time_period_days: timePeriodDays
      });

      if (error) throw error;
      return data?.[0] || null;
    } catch (error) {
      console.error('Error fetching user analytics:', error);
      return null;
    }
  }

  // Generate AI coaching prompt
  static async generateCoachingPrompt(
    goalId: string,
    context: string = 'progress_review'
  ): Promise<string | null> {
    try {
      const { data, error } = await supabase.rpc('generate_goal_coaching_prompt', {
        goal_id_param: goalId,
        user_id_param: (await supabase.auth.getUser()).data.user?.id,
        coaching_context: context
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error generating coaching prompt:', error);
      return null;
    }
  }

  // Create check-in
  static async createCheckIn(checkInData: Partial<CheckIn>): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .from('goal_check_ins')
        .insert([{
          ...checkInData,
          scheduled_for: checkInData.scheduled_for || new Date().toISOString(),
          status: 'pending'
        }])
        .select('id')
        .single();

      if (error) throw error;
      return data?.id || null;
    } catch (error) {
      console.error('Error creating check-in:', error);
      return null;
    }
  }

  // Complete check-in
  static async completeCheckIn(
    checkInId: string,
    reflection: Record<string, any>,
    actionItems: string[],
    commitments: string[]
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('goal_check_ins')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
          reflection_data: reflection,
          action_items: actionItems,
          commitments_made: commitments,
          next_check_in: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // Next week
        })
        .eq('id', checkInId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error completing check-in:', error);
      return false;
    }
  }

  // Get pending check-ins
  static async getPendingCheckIns(): Promise<CheckIn[]> {
    try {
      const { data, error } = await supabase
        .from('goal_check_ins')
        .select(`
          *,
          user_goals!inner(title, completion_percentage, status)
        `)
        .eq('status', 'pending')
        .lte('scheduled_for', new Date().toISOString())
        .order('scheduled_for', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching pending check-ins:', error);
      return [];
    }
  }

  // Update goal
  static async updateGoal(goalId: string, updates: Partial<Goal>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('user_goals')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', goalId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating goal:', error);
      return false;
    }
  }

  // Delete goal
  static async deleteGoal(goalId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('user_goals')
        .delete()
        .eq('id', goalId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting goal:', error);
      return false;
    }
  }

  // Helper functions for UI
  static getStatusColor(status: Goal['status']): string {
    switch (status) {
      case 'completed': return 'text-green-400';
      case 'active': return 'text-blue-400';
      case 'paused': return 'text-yellow-400';
      case 'abandoned': return 'text-red-400';
      default: return 'text-slate-400';
    }
  }

  static getStatusIcon(status: Goal['status']): string {
    switch (status) {
      case 'completed': return '✅';
      case 'active': return '🎯';
      case 'paused': return '⏸️';
      case 'abandoned': return '❌';
      default: return '📝';
    }
  }

  static getPriorityColor(priority: Goal['priority']): string {
    switch (priority) {
      case 'critical': return 'text-red-400';
      case 'high': return 'text-orange-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-green-400';
      default: return 'text-slate-400';
    }
  }

  static getCategoryIcon(category: string): string {
    switch (category) {
      case 'professional': return '💼';
      case 'personal': return '🎯';
      case 'health': return '💪';
      case 'learning': return '📚';
      case 'business': return '📈';
      default: return '⭐';
    }
  }

  static formatProgress(current: number, target?: number, unit?: string): string {
    if (!target) return `${current}${unit ? ' ' + unit : ''}`;
    return `${current}/${target}${unit ? ' ' + unit : ''}`;
  }

  static calculateDaysRemaining(targetDate?: string): number | null {
    if (!targetDate) return null;
    const target = new Date(targetDate);
    const now = new Date();
    const diffTime = target.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  static getProgressBarColor(percentage: number): string {
    if (percentage >= 90) return 'bg-green-400';
    if (percentage >= 70) return 'bg-blue-400';
    if (percentage >= 40) return 'bg-yellow-400';
    return 'bg-red-400';
  }

  // Integration with email automation
  static async triggerGoalEmailAutomation(
    goalId: string,
    eventType: 'goal_created' | 'milestone_reached' | 'goal_completed' | 'progress_stalled',
    metadata: Record<string, any> = {}
  ): Promise<void> {
    try {
      // This would integrate with our existing email automation service
      const response = await fetch('/api/webhooks/email-automation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: (await supabase.auth.getUser()).data.user?.id,
          event_type: 'goal_set', // Maps to existing email automation
          event_data: {
            goal_id: goalId,
            event_type: eventType,
            ...metadata
          },
          campaign_name: 'goal_accountability_sequence',
          immediate_send: eventType === 'goal_completed' || eventType === 'milestone_reached'
        })
      });

      if (!response.ok) {
        console.error('Failed to trigger goal email automation');
      }
    } catch (error) {
      console.error('Error triggering goal email automation:', error);
    }
  }
}