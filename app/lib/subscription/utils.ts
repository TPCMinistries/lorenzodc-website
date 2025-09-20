import { SubscriptionTier } from './types';

export function formatPrice(price: number, interval: 'monthly' | 'yearly' = 'monthly'): string {
  if (price === 0) return 'Free';

  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(price);

  return `${formatted}/${interval === 'monthly' ? 'mo' : 'yr'}`;
}

export function formatUsage(used: number, limit: number | 'unlimited', unit: string = ''): string {
  if (limit === 'unlimited') {
    return `${used.toLocaleString()}${unit} used`;
  }

  return `${used.toLocaleString()}${unit} / ${limit.toLocaleString()}${unit}`;
}

export function getUsagePercentage(used: number, limit: number | 'unlimited'): number {
  if (limit === 'unlimited') return 0;
  return Math.min((used / limit) * 100, 100);
}

export function isUsageNearLimit(used: number, limit: number | 'unlimited', threshold: number = 0.8): boolean {
  if (limit === 'unlimited') return false;
  return used / limit >= threshold;
}

export function calculateSavings(monthlyPrice: number, yearlyPrice: number): {
  amount: number;
  percentage: number;
} {
  const annualMonthlyPrice = monthlyPrice * 12;
  const savings = annualMonthlyPrice - yearlyPrice;
  const percentage = Math.round((savings / annualMonthlyPrice) * 100);

  return {
    amount: savings,
    percentage,
  };
}

export function getTierDisplayFeatures(tier: SubscriptionTier): string[] {
  const features: string[] = [];

  const { messageLimit, voiceMinutes, priority, advancedFeatures, coachingAccess, apiAccess } = tier.features;

  if (messageLimit === 'unlimited') {
    features.push('Unlimited messages');
  } else {
    features.push(`${messageLimit} messages/month`);
  }

  if (voiceMinutes === 'unlimited') {
    features.push('Unlimited voice');
  } else {
    features.push(`${voiceMinutes} voice minutes/month`);
  }

  if (priority === 'high') {
    features.push('High priority support');
  } else if (priority === 'premium') {
    features.push('Premium priority support');
  }

  if (advancedFeatures) {
    features.push('Advanced AI features');
  }

  if (coachingAccess) {
    features.push('Personal coaching access');
  }

  if (apiAccess) {
    features.push('API access');
  }

  return features;
}

export function getUpgradeRecommendation(
  currentTierId: string,
  messageUsage: number,
  voiceUsage: number
): { shouldUpgrade: boolean; recommendedTier: string; reason: string } | null {

  if (currentTierId === 'free') {
    if (messageUsage >= 15 || voiceUsage >= 4) {
      return {
        shouldUpgrade: true,
        recommendedTier: 'pro',
        reason: 'You\'re close to your free limits. Upgrade for more messages and voice time.',
      };
    }
  }

  if (currentTierId === 'pro') {
    if (messageUsage >= 400 || voiceUsage >= 50) {
      return {
        shouldUpgrade: true,
        recommendedTier: 'premium',
        reason: 'Upgrade to Premium for unlimited usage and premium features.',
      };
    }
  }

  return null;
}