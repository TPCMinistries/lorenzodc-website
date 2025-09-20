import { SubscriptionTier } from './types';

export const SUBSCRIPTION_TIERS: Record<string, SubscriptionTier> = {
  free: {
    id: 'free',
    name: 'Free',
    price: 0,
    interval: 'monthly',
    features: {
      messageLimit: 20,
      voiceMinutes: 5,
      priority: 'standard',
      advancedFeatures: false,
      coachingAccess: false,
      apiAccess: false,
    },
  },

  plus: {
    id: 'plus',
    name: 'Catalyst Plus',
    price: 19,
    interval: 'monthly',
    features: {
      messageLimit: 'unlimited',
      voiceMinutes: 'unlimited',
      priority: 'high',
      advancedFeatures: true,
      coachingAccess: true,
      apiAccess: true,
    },
    stripeProductId: process.env.STRIPE_PLUS_PRODUCT_ID,
    stripePriceId: process.env.STRIPE_PLUS_PRICE_ID,
  },
};

export const FREE_TIER = SUBSCRIPTION_TIERS.free;
export const DEFAULT_TIER_ID = 'free';

export function getTierById(tierId: string): SubscriptionTier {
  return SUBSCRIPTION_TIERS[tierId] || FREE_TIER;
}

export function getAllTiers(): SubscriptionTier[] {
  return Object.values(SUBSCRIPTION_TIERS);
}

export function getPaidTiers(): SubscriptionTier[] {
  return getAllTiers().filter(tier => tier.id !== 'free');
}

export function getMonthlyTiers(): SubscriptionTier[] {
  return getAllTiers().filter(tier => tier.interval === 'monthly');
}

export function getYearlyTiers(): SubscriptionTier[] {
  return getAllTiers().filter(tier => tier.interval === 'yearly');
}