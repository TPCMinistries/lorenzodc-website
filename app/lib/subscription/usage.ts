// import { supabase } from supabase - temporarily disabled for deployment
import { SubscriptionLimits, UsageStats, UserSubscription } from './types';
import { getTierById, FREE_TIER } from './tiers';

export async function getUserSubscription(userId: string): Promise<UserSubscription | null> {
  try {
    const { data, error } = await supabase
      .from('user_subscriptions')
      .select('*')
      .eq('userId', userId)
      .eq('status', 'active')
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching subscription:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in getUserSubscription:', error);
    return null;
  }
}

export async function getUserUsageStats(userId: string): Promise<UsageStats> {
  try {
    const { data, error } = await supabase
      .from('user_usage')
      .select('*')
      .eq('userId', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching usage stats:', error);
      return getDefaultUsageStats(userId);
    }

    return data || getDefaultUsageStats(userId);
  } catch (error) {
    console.error('Error in getUserUsageStats:', error);
    return getDefaultUsageStats(userId);
  }
}

function getDefaultUsageStats(userId: string): UsageStats {
  const now = new Date().toISOString();
  return {
    userId,
    currentPeriod: {
      messagesUsed: 0,
      voiceMinutesUsed: 0,
      lastResetDate: now,
    },
    allTime: {
      totalMessages: 0,
      totalVoiceMinutes: 0,
      memberSince: now,
    },
  };
}

export async function checkSubscriptionLimits(userId: string): Promise<SubscriptionLimits> {
  try {
    const [subscription, usage] = await Promise.all([
      getUserSubscription(userId),
      getUserUsageStats(userId),
    ]);

    const tier = subscription ? getTierById(subscription.tierId) : FREE_TIER;
    const { messageLimit, voiceMinutes } = tier.features;

    // Check if we need to reset usage (new billing period)
    const shouldReset = subscription ?
      shouldResetUsage(usage.currentPeriod.lastResetDate, subscription.currentPeriodStart) :
      shouldResetUsageForFree(usage.currentPeriod.lastResetDate);

    if (shouldReset) {
      await resetUsageStats(userId);
      usage.currentPeriod.messagesUsed = 0;
      usage.currentPeriod.voiceMinutesUsed = 0;
    }

    const remainingMessages = messageLimit === 'unlimited' ?
      'unlimited' :
      Math.max(0, messageLimit - usage.currentPeriod.messagesUsed);

    const remainingVoiceMinutes = voiceMinutes === 'unlimited' ?
      'unlimited' :
      Math.max(0, voiceMinutes - usage.currentPeriod.voiceMinutesUsed);

    const canSendMessage = messageLimit === 'unlimited' || usage.currentPeriod.messagesUsed < messageLimit;
    const canUseVoice = voiceMinutes === 'unlimited' || usage.currentPeriod.voiceMinutesUsed < voiceMinutes;

    const resetDate = subscription ?
      subscription.currentPeriodEnd :
      getNextFreeResetDate();

    return {
      canSendMessage,
      canUseVoice,
      remainingMessages,
      remainingVoiceMinutes,
      resetDate,
    };
  } catch (error) {
    console.error('Error checking subscription limits:', error);
    // Return conservative limits on error
    return {
      canSendMessage: false,
      canUseVoice: false,
      remainingMessages: 0,
      remainingVoiceMinutes: 0,
      resetDate: new Date().toISOString(),
    };
  }
}

export async function incrementMessageUsage(userId: string): Promise<void> {
  try {
    const { error } = await supabase.rpc('increment_message_usage', {
      user_id: userId
    });

    if (error) {
      console.error('Error incrementing message usage:', error);
    }
  } catch (error) {
    console.error('Error in incrementMessageUsage:', error);
  }
}

export async function incrementVoiceUsage(userId: string, minutes: number): Promise<void> {
  try {
    const { error } = await supabase.rpc('increment_voice_usage', {
      user_id: userId,
      minutes_used: minutes
    });

    if (error) {
      console.error('Error incrementing voice usage:', error);
    }
  } catch (error) {
    console.error('Error in incrementVoiceUsage:', error);
  }
}

async function resetUsageStats(userId: string): Promise<void> {
  try {
    const { error } = await supabase.rpc('reset_user_usage', {
      user_id: userId
    });

    if (error) {
      console.error('Error resetting usage stats:', error);
    }
  } catch (error) {
    console.error('Error in resetUsageStats:', error);
  }
}

function shouldResetUsage(lastResetDate: string, currentPeriodStart: string): boolean {
  const lastReset = new Date(lastResetDate);
  const periodStart = new Date(currentPeriodStart);
  return periodStart > lastReset;
}

function shouldResetUsageForFree(lastResetDate: string): boolean {
  const lastReset = new Date(lastResetDate);
  const now = new Date();
  const monthsSinceReset = (now.getTime() - lastReset.getTime()) / (1000 * 60 * 60 * 24 * 30);
  return monthsSinceReset >= 1;
}

function getNextFreeResetDate(): string {
  const now = new Date();
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());
  return nextMonth.toISOString();
}