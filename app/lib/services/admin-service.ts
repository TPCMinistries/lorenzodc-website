import { supabase } // Supabase temporarily disabled for deployment

export interface AdminUser {
  id: string;
  user_id: string;
  admin_email: string;
  admin_name?: string;
  role: 'super_admin' | 'admin' | 'moderator' | 'support';
  permissions: Record<string, any>;
  can_manage_users: boolean;
  can_view_analytics: boolean;
  can_manage_content: boolean;
  can_manage_billing: boolean;
  can_manage_admins: boolean;
  is_active: boolean;
  last_login_at?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface AdminActivityLog {
  id: string;
  admin_id?: string;
  action: string;
  resource_type?: string;
  resource_id?: string;
  description?: string;
  metadata: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  severity: 'low' | 'info' | 'warning' | 'high' | 'critical';
  created_at: string;
}

export interface AnalyticsSnapshot {
  id: string;
  snapshot_date: string;
  snapshot_type: 'hourly' | 'daily' | 'weekly' | 'monthly';
  total_users: number;
  active_users_24h: number;
  active_users_7d: number;
  active_users_30d: number;
  new_signups_today: number;
  free_users: number;
  basic_subscribers: number;
  plus_subscribers: number;
  enterprise_subscribers: number;
  total_mrr: number;
  chat_messages_today: number;
  voice_messages_today: number;
  documents_uploaded_today: number;
  assessments_completed_today: number;
  active_goals: number;
  goals_completed_today: number;
  emails_sent_today: number;
  emails_opened_today: number;
  email_open_rate: number;
  trial_to_paid_conversions: number;
  conversion_rate: number;
  revenue_today: number;
  revenue_mtd: number;
  avg_customer_value: number;
  api_calls_today: number;
  avg_response_time_ms: number;
  error_rate: number;
  created_at: string;
}

export interface UserAnalytics {
  date: string;
  new_signups: number;
  active_users: number;
  churn_count: number;
  total_users: number;
  conversion_events: number;
}

export interface SubscriptionAnalytics {
  tier_id: string;
  subscriber_count: number;
  monthly_revenue: number;
  avg_customer_value: number;
  churn_rate: number;
}

export interface FeatureUsageAnalytics {
  feature_type: string;
  total_usage: number;
  unique_users: number;
  avg_per_user: number;
  growth_rate: number;
}

export interface UserManagementAction {
  id: string;
  admin_id?: string;
  target_user_id: string;
  action_type: 'suspend' | 'unsuspend' | 'delete' | 'reset_password' | 'change_subscription' | 'add_note';
  reason?: string;
  notes?: string;
  previous_state: Record<string, any>;
  new_state: Record<string, any>;
  status: 'pending' | 'completed' | 'failed' | 'rolled_back';
  created_at: string;
}

export interface FeatureFlag {
  id: string;
  flag_name: string;
  flag_description?: string;
  flag_type: 'boolean' | 'string' | 'number' | 'json';
  is_enabled: boolean;
  default_value: any;
  target_user_percentage: number;
  target_user_segments: string[];
  target_subscription_tiers: string[];
  is_ab_test: boolean;
  ab_test_variants: Record<string, any>;
  ab_test_traffic_split: Record<string, number>;
  created_by?: string;
  environment: 'development' | 'staging' | 'production';
  created_at: string;
  updated_at: string;
}

export interface SystemHealthCheck {
  id: string;
  check_name: string;
  check_type: 'database' | 'api' | 'external_service' | 'storage' | 'email';
  status: 'healthy' | 'warning' | 'critical' | 'unknown';
  response_time_ms?: number;
  error_message?: string;
  success_rate?: number;
  avg_response_time?: number;
  check_metadata: Record<string, any>;
  created_at: string;
}

export interface ActivityLog {
  id: string;
  user_id?: string;
  user_email?: string;
  action_type: string;
  entity_type: string;
  entity_id?: string;
  description?: string;
  metadata?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

export class AdminService {

  // Check if current user is admin
  static async isAdmin(): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { data, error } = await supabase
        .from('admin_users')
        .select('is_active')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .single();

      return !error && !!data;
    } catch (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
  }

  // Get current admin user details
  static async getCurrentAdmin(): Promise<AdminUser | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting current admin:', error);
      return null;
    }
  }

  // Get latest analytics snapshot
  static async getLatestAnalytics(): Promise<AnalyticsSnapshot | null> {
    try {
      const { data, error } = await supabase
        .from('analytics_snapshots')
        .select('*')
        .eq('snapshot_type', 'daily')
        .order('snapshot_date', { ascending: false })
        .limit(1)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting latest analytics:', error);
      return null;
    }
  }

  // Get user analytics over time
  static async getUserAnalytics(
    startDate: string = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: string = new Date().toISOString().split('T')[0]
  ): Promise<UserAnalytics[]> {
    try {
      const { data, error } = await supabase.rpc('get_admin_user_analytics', {
        start_date: startDate,
        end_date: endDate
      });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting user analytics:', error);
      return [];
    }
  }

  // Get subscription revenue analytics
  static async getSubscriptionAnalytics(
    startDate: string = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: string = new Date().toISOString().split('T')[0]
  ): Promise<SubscriptionAnalytics[]> {
    try {
      const { data, error } = await supabase.rpc('get_subscription_revenue_analytics', {
        start_date: startDate,
        end_date: endDate
      });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting subscription analytics:', error);
      return [];
    }
  }

  // Get feature usage analytics
  static async getFeatureUsageAnalytics(timePeriodDays: number = 30): Promise<FeatureUsageAnalytics[]> {
    try {
      const { data, error } = await supabase.rpc('get_feature_usage_analytics', {
        time_period_days: timePeriodDays
      });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting feature usage analytics:', error);
      return [];
    }
  }

  // Get admin activity logs
  static async getActivityLogs(limit: number = 50): Promise<AdminActivityLog[]> {
    try {
      const { data, error } = await supabase
        .from('admin_activity_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting activity logs:', error);
      return [];
    }
  }

  // Log admin activity
  static async logActivity(
    action: string,
    resourceType?: string,
    resourceId?: string,
    description?: string,
    metadata: Record<string, any> = {}
  ): Promise<boolean> {
    try {
      const admin = await this.getCurrentAdmin();
      if (!admin) return false;

      const { error } = await supabase.rpc('log_admin_activity', {
        admin_user_id: admin.id,
        action_param: action,
        resource_type_param: resourceType,
        resource_id_param: resourceId,
        description_param: description,
        metadata_param: metadata
      });

      return !error;
    } catch (error) {
      console.error('Error logging admin activity:', error);
      return false;
    }
  }

  // Get all users with pagination
  static async getUsers(
    page: number = 1,
    limit: number = 50,
    search?: string,
    status?: string
  ): Promise<{ users: any[], totalCount: number }> {
    try {
      let query = supabase
        .from('auth.users')
        .select(`
          id,
          email,
          created_at,
          last_sign_in_at,
          email_confirmed_at,
          raw_user_meta_data,
          user_subscriptions!inner(tierId, status, created_at),
          user_goals(id, status),
          usage_tracking(feature_type, created_at)
        `, { count: 'exact' });

      if (search) {
        query = query.ilike('email', `%${search}%`);
      }

      const offset = (page - 1) * limit;
      query = query
        .range(offset, offset + limit - 1)
        .order('created_at', { ascending: false });

      const { data, error, count } = await query;

      if (error) throw error;

      return {
        users: data || [],
        totalCount: count || 0
      };
    } catch (error) {
      console.error('Error getting users:', error);
      return { users: [], totalCount: 0 };
    }
  }

  // Get user details
  static async getUserDetails(userId: string): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('auth.users')
        .select(`
          *,
          user_subscriptions(*),
          user_goals(*),
          usage_tracking(*),
          email_automation_events(*),
          lead_attribution(*)
        `)
        .eq('id', userId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting user details:', error);
      return null;
    }
  }

  // Suspend user
  static async suspendUser(userId: string, reason: string): Promise<boolean> {
    try {
      // Log the action
      await this.logActivity(
        'user_suspended',
        'user',
        userId,
        `User suspended: ${reason}`,
        { reason, suspended_at: new Date().toISOString() }
      );

      // Record in user management actions
      const { error } = await supabase
        .from('user_management_actions')
        .insert([{
          target_user_id: userId,
          action_type: 'suspend',
          reason: reason,
          previous_state: { status: 'active' },
          new_state: { status: 'suspended' }
        }]);

      if (error) throw error;

      // TODO: Implement actual user suspension (would need auth admin functions)
      return true;
    } catch (error) {
      console.error('Error suspending user:', error);
      return false;
    }
  }

  // Get feature flags
  static async getFeatureFlags(): Promise<FeatureFlag[]> {
    try {
      const { data, error } = await supabase
        .from('feature_flags')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting feature flags:', error);
      return [];
    }
  }

  // Create/update feature flag
  static async upsertFeatureFlag(flag: Partial<FeatureFlag>): Promise<boolean> {
    try {
      const admin = await this.getCurrentAdmin();
      if (!admin) return false;

      const { error } = await supabase
        .from('feature_flags')
        .upsert([{
          ...flag,
          created_by: admin.id,
          updated_at: new Date().toISOString()
        }]);

      if (error) throw error;

      await this.logActivity(
        'feature_flag_updated',
        'feature_flag',
        flag.flag_name,
        `Feature flag ${flag.is_enabled ? 'enabled' : 'disabled'}: ${flag.flag_name}`
      );

      return true;
    } catch (error) {
      console.error('Error upserting feature flag:', error);
      return false;
    }
  }

  // Get system health
  static async getSystemHealth(): Promise<SystemHealthCheck[]> {
    try {
      const { data, error } = await supabase
        .from('system_health_checks')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting system health:', error);
      return [];
    }
  }

  // Create daily analytics snapshot
  static async createDailySnapshot(): Promise<boolean> {
    try {
      const { error } = await supabase.rpc('create_daily_analytics_snapshot');
      if (error) throw error;

      await this.logActivity(
        'analytics_snapshot_created',
        'analytics',
        new Date().toISOString().split('T')[0],
        'Daily analytics snapshot created'
      );

      return true;
    } catch (error) {
      console.error('Error creating daily snapshot:', error);
      return false;
    }
  }

  // Get activity logs with filtering
  static async getActivityLogs(filters: {
    action_type?: string;
    entity_type?: string;
    date_filter?: string;
    user_id?: string;
    limit?: number;
  } = {}): Promise<ActivityLog[]> {
    try {
      const { data, error } = await supabase.rpc('get_admin_activity_logs', {
        action_type_filter: filters.action_type,
        entity_type_filter: filters.entity_type,
        date_filter: filters.date_filter || '7d',
        user_id_filter: filters.user_id,
        row_limit: filters.limit || 100
      });

      if (error) {
        console.error('Error fetching activity logs:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching activity logs:', error);
      return [];
    }
  }

  // Dashboard helper functions
  static formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }

  static formatNumber(num: number): string {
    return new Intl.NumberFormat('en-US').format(num);
  }

  static formatPercentage(value: number): string {
    return `${value.toFixed(1)}%`;
  }

  static getGrowthColor(rate: number): string {
    if (rate > 10) return 'text-green-400';
    if (rate > 0) return 'text-blue-400';
    if (rate > -10) return 'text-yellow-400';
    return 'text-red-400';
  }

  static getHealthStatusColor(status: string): string {
    switch (status) {
      case 'healthy': return 'text-green-400';
      case 'warning': return 'text-yellow-400';
      case 'critical': return 'text-red-400';
      default: return 'text-slate-400';
    }
  }

  static getRoleDisplayName(role: string): string {
    switch (role) {
      case 'super_admin': return 'Super Admin';
      case 'admin': return 'Admin';
      case 'moderator': return 'Moderator';
      case 'support': return 'Support';
      default: return 'User';
    }
  }

  static getSeverityColor(severity: string): string {
    switch (severity) {
      case 'critical': return 'text-red-400 bg-red-500/20';
      case 'high': return 'text-orange-400 bg-orange-500/20';
      case 'warning': return 'text-yellow-400 bg-yellow-500/20';
      case 'info': return 'text-blue-400 bg-blue-500/20';
      case 'low': return 'text-slate-400 bg-slate-500/20';
      default: return 'text-slate-400 bg-slate-500/20';
    }
  }
}