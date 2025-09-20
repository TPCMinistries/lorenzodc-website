import { supabase } // Supabase temporarily disabled for deployment

export class DatabaseUsageTracker {
  static async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  }

  static async getSubscription() {
    const user = await this.getCurrentUser();
    if (!user) return null;

    const { data } = await supabase
      .from('user_subscriptions')
      .select('*')
      .eq('userId', user.id)
      .eq('status', 'active')
      .single();

    return data;
  }

  static async getUsage() {
    const user = await this.getCurrentUser();
    if (!user) return null;

    const { data } = await supabase
      .from('user_usage')
      .select('*')
      .eq('userId', user.id)
      .single();

    return data;
  }

  static async canUserChat() {
    const subscription = await this.getSubscription();
    const usage = await this.getUsage();

    // Plus users have unlimited chats
    if (subscription?.tierId === 'plus') {
      return { canChat: true, remaining: 'unlimited' };
    }

    // Free users have 15 chats per month (matching our freemium model)
    const used = usage?.currentPeriodMessagesUsed || 0;
    const limit = 15;

    return {
      canChat: used < limit,
      remaining: Math.max(0, limit - used),
      used,
      limit
    };
  }

  static async incrementUsage() {
    const user = await this.getCurrentUser();
    if (!user) return false;

    try {
      // Call the database function to increment usage
      await supabase.rpc('increment_message_usage', {
        user_id: user.id
      });
      return true;
    } catch (error) {
      console.error('Error incrementing usage:', error);
      return false;
    }
  }

  static async upgradeToPlus(customerId: string, subscriptionId: string) {
    const user = await this.getCurrentUser();
    if (!user) return false;

    try {
      // Create or update subscription record
      const { error } = await supabase
        .from('user_subscriptions')
        .upsert({
          userId: user.id,
          tierId: 'plus',
          status: 'active',
          stripeCustomerId: customerId,
          stripeSubscriptionId: subscriptionId,
          currentPeriodStart: new Date().toISOString(),
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
        });

      if (error) throw error;

      // Reset usage for new subscription
      await supabase.rpc('reset_user_usage', {
        user_id: user.id
      });

      return true;
    } catch (error) {
      console.error('Error upgrading to plus:', error);
      return false;
    }
  }

  static async resetToFree() {
    const user = await this.getCurrentUser();
    if (!user) return false;

    try {
      // Remove active subscription
      await supabase
        .from('user_subscriptions')
        .update({ status: 'cancelled' })
        .eq('userId', user.id)
        .eq('status', 'active');

      // Reset usage
      await supabase.rpc('reset_user_usage', {
        user_id: user.id
      });

      return true;
    } catch (error) {
      console.error('Error resetting to free:', error);
      return false;
    }
  }
}