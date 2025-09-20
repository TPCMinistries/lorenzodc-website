export interface SubscriptionTier {
  id: string;
  name: string;
  price: number;
  interval: 'monthly' | 'yearly';
  features: {
    messageLimit: number | 'unlimited';
    voiceMinutes: number | 'unlimited';
    priority: 'standard' | 'high' | 'premium';
    advancedFeatures: boolean;
    coachingAccess: boolean;
    apiAccess: boolean;
  };
  stripeProductId?: string;
  stripePriceId?: string;
}

export interface UserSubscription {
  id: string;
  userId: string;
  tierId: string;
  status: 'active' | 'cancelled' | 'past_due' | 'incomplete';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  stripeSubscriptionId?: string;
  stripeCustomerId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UsageStats {
  userId: string;
  currentPeriod: {
    messagesUsed: number;
    voiceMinutesUsed: number;
    lastResetDate: string;
  };
  allTime: {
    totalMessages: number;
    totalVoiceMinutes: number;
    memberSince: string;
  };
}

export interface SubscriptionLimits {
  canSendMessage: boolean;
  canUseVoice: boolean;
  remainingMessages: number | 'unlimited';
  remainingVoiceMinutes: number | 'unlimited';
  resetDate: string;
}