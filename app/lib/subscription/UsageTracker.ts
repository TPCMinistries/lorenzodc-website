import { DatabaseUsageTracker } from './database-usage';

export class UsageTracker {
  static async upgradeToPlus(customerId: string, subscriptionId: string) {
    console.log(`Upgrading customer ${customerId} to Catalyst Plus with subscription ${subscriptionId}`);

    try {
      const success = await DatabaseUsageTracker.upgradeToPlus(customerId, subscriptionId);

      if (success) {
        // Trigger a page refresh to update the UI
        window.location.reload();
      } else {
        console.error('Failed to upgrade subscription');
      }
    } catch (error) {
      console.error('Error upgrading to plus:', error);
    }
  }

  static async getCurrentTier(): Promise<string> {
    try {
      const subscription = await DatabaseUsageTracker.getSubscription();
      return subscription?.tierId || 'free';
    } catch (error) {
      console.error('Error getting current tier:', error);
      return 'free';
    }
  }

  static async resetToFree() {
    try {
      const success = await DatabaseUsageTracker.resetToFree();

      if (success) {
        window.location.reload();
      } else {
        console.error('Failed to reset to free tier');
      }
    } catch (error) {
      console.error('Error resetting to free:', error);
    }
  }

  // Helper methods for backward compatibility
  static async canUserChat() {
    return await DatabaseUsageTracker.canUserChat();
  }

  static async incrementUsage() {
    return await DatabaseUsageTracker.incrementUsage();
  }
}