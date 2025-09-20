'use client';

import { useState, useEffect } from 'react';
import { UsageTrackingService, UsageStatus } from '../lib/services/usage-tracking';
import { useRouter } from 'next/navigation';

interface UsageDashboardProps {
  onClose?: () => void;
  showUpgradePrompts?: boolean;
  className?: string;
}

interface UsageStats {
  chat: UsageStatus;
  voice: UsageStatus;
  document: UsageStatus;
  assessment: UsageStatus;
}

export default function UsageDashboard({
  onClose,
  showUpgradePrompts = true,
  className = ''
}: UsageDashboardProps) {
  const [usage, setUsage] = useState<UsageStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentTier, setCurrentTier] = useState<string>('free');
  const router = useRouter();

  useEffect(() => {
    loadUsageStats();
  }, []);

  const loadUsageStats = async () => {
    setLoading(true);
    try {
      const [stats, limits] = await Promise.all([
        UsageTrackingService.getUsageStats(),
        UsageTrackingService.getUserUsageLimits()
      ]);

      if (stats) {
        setUsage(stats);
      }

      if (limits) {
        setCurrentTier(limits.tier_id);
      }
    } catch (error) {
      console.error('Error loading usage stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = (tier: string) => {
    router.push(`/pricing?plan=${tier}&feature=usage_limits`);
  };

  const getFeatureIcon = (feature: string) => {
    switch (feature) {
      case 'chat': return '💬';
      case 'voice': return '🎙️';
      case 'document': return '📄';
      case 'assessment': return '📊';
      default: return '✨';
    }
  };

  const getFeatureName = (feature: string) => {
    switch (feature) {
      case 'chat': return 'Chat Messages';
      case 'voice': return 'Voice Messages';
      case 'document': return 'Document Uploads';
      case 'assessment': return 'Assessments';
      default: return 'Feature';
    }
  };

  const getTierName = (tier: string) => {
    switch (tier) {
      case 'free': return 'Free Plan';
      case 'catalyst_basic': return 'Catalyst Basic';
      case 'catalyst_plus': return 'Catalyst Plus';
      case 'enterprise': return 'Enterprise';
      default: return 'Current Plan';
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'free': return 'text-slate-400';
      case 'catalyst_basic': return 'text-blue-400';
      case 'catalyst_plus': return 'text-purple-400';
      case 'enterprise': return 'text-emerald-400';
      default: return 'text-slate-400';
    }
  };

  const getProgressBarColor = (percentage: number, canPerform: boolean) => {
    if (!canPerform) return 'bg-red-400';
    if (percentage >= 90) return 'bg-red-400';
    if (percentage >= 70) return 'bg-yellow-400';
    return 'bg-green-400';
  };

  const shouldShowUpgrade = (featureStatus: UsageStatus) => {
    return showUpgradePrompts && UsageTrackingService.shouldShowUpgradePrompt(featureStatus);
  };

  if (loading) {
    return (
      <div className={`bg-slate-800 rounded-xl border border-slate-600 p-6 ${className}`}>
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-3 text-slate-400">Loading usage statistics...</span>
        </div>
      </div>
    );
  }

  if (!usage) {
    return (
      <div className={`bg-slate-800 rounded-xl border border-slate-600 p-6 ${className}`}>
        <div className="text-center text-slate-400">
          <div className="text-4xl mb-2">📊</div>
          <p>Usage statistics not available</p>
        </div>
      </div>
    );
  }

  const anyLimitReached = Object.values(usage).some(status => !status.canPerform);

  return (
    <div className={`bg-slate-800 rounded-xl border border-slate-600 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-slate-600">
        <div>
          <h2 className="text-xl font-bold text-white mb-1">📊 Usage Dashboard</h2>
          <div className="flex items-center gap-2">
            <span className={`text-sm font-medium ${getTierColor(currentTier)}`}>
              {getTierName(currentTier)}
            </span>
            {anyLimitReached && (
              <span className="text-xs bg-red-500/20 text-red-300 px-2 py-0.5 rounded">
                Limits Reached
              </span>
            )}
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      <div className="p-6 space-y-6">
        {/* Feature Usage Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(usage).map(([feature, status]) => (
            <div
              key={feature}
              className={`p-4 rounded-lg border transition-all duration-200 ${
                status.canPerform
                  ? 'border-slate-600 bg-slate-700/30'
                  : 'border-red-400/30 bg-red-500/10'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{getFeatureIcon(feature)}</span>
                  <span className="font-medium text-white">{getFeatureName(feature)}</span>
                </div>
                {!status.canPerform && (
                  <span className="text-xs bg-red-500/20 text-red-300 px-2 py-0.5 rounded">
                    Limit Reached
                  </span>
                )}
              </div>

              {/* Usage Progress */}
              <div className="mb-3">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-400">
                    {UsageTrackingService.formatUsageDisplay(status.usage)}
                  </span>
                  {status.usage.limit !== -1 && (
                    <span className={UsageTrackingService.getUsageColor(status.usage.percentage)}>
                      {Math.round(status.usage.percentage)}%
                    </span>
                  )}
                </div>

                {status.usage.limit !== -1 && (
                  <div className="w-full bg-slate-600 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${getProgressBarColor(
                        status.usage.percentage,
                        status.canPerform
                      )}`}
                      style={{ width: `${Math.min(status.usage.percentage, 100)}%` }}
                    />
                  </div>
                )}

                {status.usage.limit === -1 && (
                  <div className="text-center text-green-400 text-sm font-medium">
                    ∞ Unlimited
                  </div>
                )}
              </div>

              {/* Error Message */}
              {!status.canPerform && status.reason && (
                <div className="text-red-300 text-xs mb-3 p-2 bg-red-500/10 rounded">
                  {status.reason}
                </div>
              )}

              {/* Individual Upgrade Button */}
              {shouldShowUpgrade(status) && (
                <button
                  onClick={() => {
                    const recommendation = UsageTrackingService.getUpgradeRecommendation(currentTier, feature as any);
                    const plan = recommendation.tier.includes('Plus') ? 'plus' : 'basic';
                    handleUpgrade(plan);
                  }}
                  className="w-full px-3 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs rounded font-medium hover:from-blue-600 hover:to-purple-600 transition-all duration-200"
                >
                  Upgrade for Unlimited
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Overall Status Summary */}
        <div className={`p-4 rounded-lg border ${
          anyLimitReached
            ? 'border-red-400/30 bg-red-500/10'
            : 'border-green-400/30 bg-green-500/10'
        }`}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">
              {anyLimitReached ? '⚠️' : '✅'}
            </span>
            <span className="font-medium text-white">
              {anyLimitReached ? 'Usage Limits Reached' : 'All Systems Go!'}
            </span>
          </div>
          <p className="text-sm text-slate-300">
            {anyLimitReached
              ? 'You\'ve reached limits on some features. Upgrade to continue using Catalyst AI without restrictions.'
              : 'You\'re within all usage limits. Continue enjoying your AI coaching experience!'
            }
          </p>
        </div>

        {/* Upgrade Recommendations */}
        {anyLimitReached && showUpgradePrompts && (
          <div className="space-y-4">
            <h3 className="font-semibold text-white">🚀 Recommended Upgrades</h3>

            {/* Basic Upgrade */}
            {currentTier === 'free' && (
              <div className="bg-slate-700/30 border border-slate-600 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-white">Catalyst Basic</h4>
                    <p className="text-sm text-slate-400">Perfect for regular users</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-white">$19</div>
                    <div className="text-xs text-slate-400">per month</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
                  <div className="flex items-center gap-1">
                    <span className="text-green-400">✓</span>
                    <span className="text-slate-300">150 chat messages</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-green-400">✓</span>
                    <span className="text-slate-300">50 voice messages</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-green-400">✓</span>
                    <span className="text-slate-300">5 document uploads</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-green-400">✓</span>
                    <span className="text-slate-300">3 assessments</span>
                  </div>
                </div>

                <button
                  onClick={() => handleUpgrade('basic')}
                  className="w-full px-4 py-2 bg-blue-500 text-white rounded font-medium hover:bg-blue-600 transition-colors"
                >
                  Upgrade to Basic
                </button>
              </div>
            )}

            {/* Plus Upgrade */}
            <div className="relative bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-400/30 rounded-lg p-4">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-medium px-3 py-1 rounded-full">
                  MOST POPULAR
                </span>
              </div>

              <div className="flex items-center justify-between mb-3 mt-2">
                <div>
                  <h4 className="font-semibold text-white">Catalyst Plus</h4>
                  <p className="text-sm text-blue-300">Complete AI coaching suite</p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-white">$39</div>
                  <div className="text-xs text-blue-300">per month</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
                <div className="flex items-center gap-1">
                  <span className="text-green-400">✓</span>
                  <span className="text-blue-100">Unlimited everything</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-green-400">✓</span>
                  <span className="text-blue-100">Premium voices</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-green-400">✓</span>
                  <span className="text-blue-100">Document analysis</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-green-400">✓</span>
                  <span className="text-blue-100">Advanced insights</span>
                </div>
              </div>

              <button
                onClick={() => handleUpgrade('plus')}
                className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded font-medium hover:from-blue-600 hover:to-purple-600 transition-all duration-200"
              >
                Upgrade to Plus
              </button>
            </div>
          </div>
        )}

        {/* View All Plans */}
        <div className="text-center pt-4 border-t border-slate-600">
          <button
            onClick={() => router.push('/pricing')}
            className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
          >
            View All Plans & Features →
          </button>
        </div>
      </div>
    </div>
  );
}