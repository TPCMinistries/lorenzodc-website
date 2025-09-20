import { supabase } // Supabase temporarily disabled for deployment

export interface UsageData {
  userId: string;
  currentPeriodMessagesUsed: number;
  monthlyMessageLimit: number;
  canSendMessage: boolean;
  subscription?: {
    tierId: string;
    status: string;
    currentPeriodEnd: string;
  };
}

export class UsageTracker {

  // Get current user's usage data
  static async getCurrentUsage(): Promise<UsageData | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    try {
      // Get subscription info
      const { data: subscription } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('userId', user.id)
        .eq('status', 'active')
        .single();

      // Get usage info
      const { data: usage } = await supabase
        .from('user_usage')
        .select('*')
        .eq('userId', user.id)
        .single();

      const currentUsage = usage?.currentPeriodMessagesUsed || 0;

      // Determine message limits based on subscription
      let messageLimit = 15; // Free tier default
      if (subscription?.tierId === 'catalyst_basic') {
        messageLimit = 150;
      } else if (subscription?.tierId === 'catalyst_plus' || subscription?.tierId === 'enterprise') {
        messageLimit = -1; // Unlimited
      }

      return {
        userId: user.id,
        currentPeriodMessagesUsed: currentUsage,
        monthlyMessageLimit: messageLimit,
        canSendMessage: messageLimit === -1 || currentUsage < messageLimit,
        subscription: subscription ? {
          tierId: subscription.tierId,
          status: subscription.status,
          currentPeriodEnd: subscription.currentPeriodEnd
        } : undefined
      };
    } catch (error) {
      console.error('Error fetching usage data:', error);
      return null;
    }
  }

  // Check if user can send a message
  static async canSendMessage(): Promise<boolean> {
    const usage = await this.getCurrentUsage();
    return usage?.canSendMessage || false;
  }

  // Increment message usage
  static async incrementMessageUsage(): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    // Check if user can send message first
    const canSend = await this.canSendMessage();
    if (!canSend) {
      throw new Error('Message limit reached');
    }

    try {
      // Increment usage using database function
      const { error } = await supabase.rpc('increment_message_usage', {
        user_id: user.id
      });

      return !error;
    } catch (error) {
      console.error('Error incrementing message usage:', error);
      return false;
    }
  }

  // Get usage percentage for display
  static async getUsagePercentage(): Promise<number> {
    const usage = await this.getCurrentUsage();
    if (!usage) return 0;

    if (usage.monthlyMessageLimit === -1) return 0; // Unlimited

    return Math.round((usage.currentPeriodMessagesUsed / usage.monthlyMessageLimit) * 100);
  }

  // Get days until reset
  static async getDaysUntilReset(): Promise<number> {
    const usage = await this.getCurrentUsage();
    if (!usage?.subscription) {
      // Free tier resets monthly on signup anniversary
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return 30;

      const signupDate = new Date(user.created_at);
      const now = new Date();
      const nextReset = new Date(now.getFullYear(), now.getMonth() + 1, signupDate.getDate());

      return Math.ceil((nextReset.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    }

    // Subscription resets on period end
    const periodEnd = new Date(usage.subscription.currentPeriodEnd);
    const now = new Date();
    return Math.ceil((periodEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  }

  // Reset usage (called by webhook when subscription renews)
  static async resetUsage(userId: string): Promise<boolean> {
    try {
      const { error } = await supabase.rpc('reset_user_usage', {
        user_id: userId
      });

      return !error;
    } catch (error) {
      console.error('Error resetting usage:', error);
      return false;
    }
  }

  // Get user's subscription tier
  static async getSubscriptionTier(): Promise<string> {
    const usage = await this.getCurrentUsage();
    return usage?.subscription?.tierId || 'free';
  }

  // Check if user is on specific tier
  static async isOnTier(tierName: string): Promise<boolean> {
    const tier = await this.getSubscriptionTier();
    return tier === tierName;
  }

  // Get upgrade urgency message based on usage
  static async getUpgradeUrgency(): Promise<{
    level: 'none' | 'low' | 'medium' | 'high' | 'critical';
    message: string;
    showUpgrade: boolean;
  }> {
    const usage = await this.getCurrentUsage();
    if (!usage) {
      return { level: 'none', message: '', showUpgrade: false };
    }

    if (usage.monthlyMessageLimit === -1) {
      return { level: 'none', message: 'Unlimited usage', showUpgrade: false };
    }

    const percentage = (usage.currentPeriodMessagesUsed / usage.monthlyMessageLimit) * 100;
    const remaining = usage.monthlyMessageLimit - usage.currentPeriodMessagesUsed;

    if (percentage >= 100) {
      return {
        level: 'critical',
        message: 'Limit reached! Upgrade to continue chatting.',
        showUpgrade: true
      };
    } else if (percentage >= 90) {
      return {
        level: 'high',
        message: `Only ${remaining} messages left this month!`,
        showUpgrade: true
      };
    } else if (percentage >= 80) {
      return {
        level: 'medium',
        message: `${remaining} messages remaining this month`,
        showUpgrade: true
      };
    } else if (percentage >= 60) {
      return {
        level: 'low',
        message: `${remaining} messages left`,
        showUpgrade: false
      };
    }

    return { level: 'none', message: '', showUpgrade: false };
  }

  // Format usage display text
  static async getUsageDisplayText(): Promise<string> {
    const usage = await this.getCurrentUsage();
    if (!usage) return 'Unable to load usage';

    if (usage.monthlyMessageLimit === -1) {
      return 'Unlimited messages';
    }

    const remaining = usage.monthlyMessageLimit - usage.currentPeriodMessagesUsed;
    return `${remaining} of ${usage.monthlyMessageLimit} messages remaining`;
  }

  // Get feature access based on subscription
  static async getFeatureAccess(): Promise<{
    unlimitedMessages: boolean;
    goalTracking: boolean;
    advancedAnalytics: boolean;
    prioritySupport: boolean;
    teamFeatures: boolean;
    roiTools: boolean;
    monthlyStrategyCalls: boolean;
  }> {
    const tier = await this.getSubscriptionTier();

    const features = {
      unlimitedMessages: false,
      goalTracking: false,
      advancedAnalytics: false,
      prioritySupport: false,
      teamFeatures: false,
      roiTools: false,
      monthlyStrategyCalls: false,
    };

    switch (tier) {
      case 'catalyst_basic':
        features.goalTracking = true;
        break;
      case 'catalyst_plus':
        features.unlimitedMessages = true;
        features.goalTracking = true;
        features.advancedAnalytics = true;
        features.prioritySupport = true;
        break;
      case 'enterprise':
        features.unlimitedMessages = true;
        features.goalTracking = true;
        features.advancedAnalytics = true;
        features.prioritySupport = true;
        features.teamFeatures = true;
        features.roiTools = true;
        features.monthlyStrategyCalls = true;
        break;
    }

    return features;
  }
}