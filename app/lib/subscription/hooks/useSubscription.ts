'use client';

import { useState, useEffect } from 'react';
import { SubscriptionLimits, UserSubscription, UsageStats } from '../types';
import { checkSubscriptionLimits, getUserSubscription, getUserUsageStats } from '../usage';
import { getTierById, FREE_TIER } from '../tiers';

interface UseSubscriptionReturn {
  subscription: UserSubscription | null;
  limits: SubscriptionLimits | null;
  usage: UsageStats | null;
  tier: any;
  isLoading: boolean;
  isFreeTier: boolean;
  canSendMessage: boolean;
  canUseVoice: boolean;
  refreshSubscription: () => Promise<void>;
}

export function useSubscription(userId: string | null): UseSubscriptionReturn {
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [limits, setLimits] = useState<SubscriptionLimits | null>(null);
  const [usage, setUsage] = useState<UsageStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const tier = subscription ? getTierById(subscription.tierId) : FREE_TIER;
  const isFreeTier = !subscription || subscription.tierId === 'free';

  const refreshSubscription = async () => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);

      const [subscriptionData, limitsData, usageData] = await Promise.all([
        getUserSubscription(userId),
        checkSubscriptionLimits(userId),
        getUserUsageStats(userId),
      ]);

      setSubscription(subscriptionData);
      setLimits(limitsData);
      setUsage(usageData);
    } catch (error) {
      console.error('Error refreshing subscription:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshSubscription();
  }, [userId]);

  return {
    subscription,
    limits,
    usage,
    tier,
    isLoading,
    isFreeTier,
    canSendMessage: limits?.canSendMessage ?? false,
    canUseVoice: limits?.canUseVoice ?? false,
    refreshSubscription,
  };
}