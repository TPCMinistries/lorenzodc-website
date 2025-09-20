import { supabase } from '../supabase/client';

export interface UsageLimits {
  tier_id: string;
  chat_messages_limit: number;
  voice_messages_limit: number;
  documents_limit: number;
  assessments_limit: number;
  api_requests_per_minute: number;
  features_enabled: string[];
  current_usage: {
    chat_messages_used: number;
    voice_messages_used: number;
    documents_uploaded: number;
    assessments_completed: number;
    month_year: string;
  };
}

export interface UsageStatus {
  canPerform: boolean;
  reason?: string;
  usage: {
    current: number;
    limit: number;
    percentage: number;
  };
  upgradeRequired?: boolean;
}

export type FeatureType = 'chat' | 'voice' | 'document' | 'assessment';

export class UsageTrackingService {

  // Get user's current usage limits and status
  static async getUserUsageLimits(): Promise<UsageLimits | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    try {
      const { data, error } = await supabase.rpc('get_user_usage_limits', {
        user_id_param: user.id
      });

      if (error) throw error;
      return data?.[0] || null;
    } catch (error) {
      console.error('Error fetching usage limits:', error);
      return null;
    }
  }

  // Check if user can perform a specific action
  static async canPerformAction(featureType: FeatureType): Promise<UsageStatus> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return {
        canPerform: false,
        reason: 'Authentication required',
        usage: { current: 0, limit: 0, percentage: 0 },
        upgradeRequired: true
      };
    }

    try {
      // Check if user can perform action
      const { data: canPerform, error } = await supabase.rpc('can_user_perform_action', {
        user_id_param: user.id,
        action_type: featureType
      });

      if (error) throw error;

      // Get detailed usage information
      const limits = await this.getUserUsageLimits();
      if (!limits) {
        return {
          canPerform: false,
          reason: 'Could not load usage limits',
          usage: { current: 0, limit: 0, percentage: 0 }
        };
      }

      const usage = this.getUsageForFeature(featureType, limits);

      if (!canPerform) {
        const reason = this.getBlockingReason(featureType, limits);
        return {
          canPerform: false,
          reason,
          usage,
          upgradeRequired: true
        };
      }

      return {
        canPerform: true,
        usage
      };

    } catch (error) {
      console.error('Error checking action permission:', error);
      return {
        canPerform: false,
        reason: 'Error checking permissions',
        usage: { current: 0, limit: 0, percentage: 0 }
      };
    }
  }

  // Track feature usage after action is performed
  static async trackUsage(
    featureType: FeatureType,
    action?: string,
    sessionId?: string,
    metadata?: Record<string, any>
  ): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    try {
      const { data, error } = await supabase.rpc('track_feature_usage', {
        user_id_param: user.id,
        feature_type_param: featureType,
        feature_action_param: action,
        session_id_param: sessionId,
        metadata_param: metadata || {}
      });

      return !error;
    } catch (error) {
      console.error('Error tracking usage:', error);
      return false;
    }
  }

  // Check API rate limit
  static async checkRateLimit(endpoint: string, method: string = 'POST'): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    try {
      const { data, error } = await supabase.rpc('check_api_rate_limit', {
        user_id_param: user.id,
        endpoint_param: endpoint,
        method_param: method
      });

      return !error && data;
    } catch (error) {
      console.error('Error checking rate limit:', error);
      return false;
    }
  }

  // Get usage statistics for display
  static async getUsageStats(): Promise<{
    chat: UsageStatus;
    voice: UsageStatus;
    document: UsageStatus;
    assessment: UsageStatus;
  } | null> {
    try {
      const [chat, voice, document, assessment] = await Promise.all([
        this.canPerformAction('chat'),
        this.canPerformAction('voice'),
        this.canPerformAction('document'),
        this.canPerformAction('assessment')
      ]);

      return { chat, voice, document, assessment };
    } catch (error) {
      console.error('Error getting usage stats:', error);
      return null;
    }
  }

  // Helper method to get usage for specific feature
  private static getUsageForFeature(featureType: FeatureType, limits: UsageLimits) {
    let current: number;
    let limit: number;

    switch (featureType) {
      case 'chat':
        current = limits.current_usage.chat_messages_used;
        limit = limits.chat_messages_limit;
        break;
      case 'voice':
        current = limits.current_usage.voice_messages_used;
        limit = limits.voice_messages_limit;
        break;
      case 'document':
        current = limits.current_usage.documents_uploaded;
        limit = limits.documents_limit;
        break;
      case 'assessment':
        current = limits.current_usage.assessments_completed;
        limit = limits.assessments_limit;
        break;
      default:
        current = 0;
        limit = 0;
    }

    const percentage = limit === -1 ? 0 : (current / limit) * 100;

    return {
      current,
      limit,
      percentage: Math.min(percentage, 100)
    };
  }

  // Helper method to get blocking reason
  private static getBlockingReason(featureType: FeatureType, limits: UsageLimits): string {
    // Check if feature is enabled for tier
    if (!limits.features_enabled.includes(featureType)) {
      const tierName = this.getTierDisplayName(limits.tier_id);
      return `${this.getFeatureDisplayName(featureType)} is not available in ${tierName}. Upgrade to access this feature.`;
    }

    // Check if limit is reached
    const usage = this.getUsageForFeature(featureType, limits);
    if (usage.limit !== -1 && usage.current >= usage.limit) {
      return `You've reached your monthly limit of ${usage.limit} ${this.getFeatureDisplayName(featureType).toLowerCase()}. Upgrade for more!`;
    }

    return 'Feature temporarily unavailable.';
  }

  // Helper methods for display names
  private static getTierDisplayName(tierId: string): string {
    switch (tierId) {
      case 'free': return 'Free Plan';
      case 'catalyst_basic': return 'Catalyst Basic';
      case 'catalyst_plus': return 'Catalyst Plus';
      case 'enterprise': return 'Enterprise';
      default: return 'Current Plan';
    }
  }

  private static getFeatureDisplayName(featureType: FeatureType): string {
    switch (featureType) {
      case 'chat': return 'Chat Messages';
      case 'voice': return 'Voice Messages';
      case 'document': return 'Document Upload';
      case 'assessment': return 'Assessments';
      default: return 'Feature';
    }
  }

  // Utility method to format usage display
  static formatUsageDisplay(usage: UsageStatus['usage']): string {
    if (usage.limit === -1) {
      return `${usage.current} used (unlimited)`;
    }
    return `${usage.current} / ${usage.limit} used`;
  }

  // Get usage color for UI
  static getUsageColor(percentage: number): string {
    if (percentage >= 90) return 'text-red-400';
    if (percentage >= 70) return 'text-yellow-400';
    return 'text-green-400';
  }

  // Check if user needs upgrade prompt
  static shouldShowUpgradePrompt(usage: UsageStatus): boolean {
    return !usage.canPerform && usage.upgradeRequired;
  }

  // Get next tier recommendation
  static getUpgradeRecommendation(currentTier: string, featureType: FeatureType): {
    tier: string;
    price: string;
    benefits: string[];
  } {
    switch (currentTier) {
      case 'free':
        if (featureType === 'document') {
          return {
            tier: 'Catalyst Plus',
            price: '$39/month',
            benefits: [
              'Unlimited document uploads',
              'Unlimited chat messages',
              'Premium voice features',
              'Advanced analytics'
            ]
          };
        }
        return {
          tier: 'Catalyst Basic',
          price: '$19/month',
          benefits: [
            '150 chat messages/month',
            '50 voice messages/month',
            '5 document uploads/month',
            'Basic analytics'
          ]
        };

      case 'catalyst_basic':
        return {
          tier: 'Catalyst Plus',
          price: '$39/month',
          benefits: [
            'Unlimited everything',
            'Premium voice options',
            'Advanced insights',
            'Priority support'
          ]
        };

      default:
        return {
          tier: 'Enterprise',
          price: '$297/month',
          benefits: [
            'Team management',
            'White-label options',
            'API access',
            'Custom integrations'
          ]
        };
    }
  }

  // Enhanced enforcement for chat messages
  static async canSendChatMessage(sessionId?: string): Promise<UsageStatus> {
    const status = await this.canPerformAction('chat');

    if (status.canPerform && sessionId) {
      // Track the usage immediately
      await this.trackUsage('chat', 'send_message', sessionId);
    }

    return status;
  }

  // Enhanced enforcement for voice messages
  static async canSendVoiceMessage(): Promise<UsageStatus> {
    return this.canPerformAction('voice');
  }

  // Enhanced enforcement for document upload
  static async canUploadDocument(): Promise<UsageStatus> {
    return this.canPerformAction('document');
  }

  // Enhanced enforcement for assessments
  static async canTakeAssessment(): Promise<UsageStatus> {
    return this.canPerformAction('assessment');
  }
}