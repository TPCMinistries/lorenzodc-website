'use client';

import { useState, useEffect } from 'react';
import { ConversationHistoryService } from '../lib/services/conversation-history';
import { useRouter } from 'next/navigation';

interface HistoryUpgradePromptProps {
  onClose?: () => void;
  trigger?: 'limit_reached' | 'history_cutoff' | 'feature_preview';
  className?: string;
}

export default function HistoryUpgradePrompt({
  onClose,
  trigger = 'limit_reached',
  className = ''
}: HistoryUpgradePromptProps) {
  const [retentionDays, setRetentionDays] = useState(7);
  const [canAccessFullHistory, setCanAccessFullHistory] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkHistoryAccess();
  }, []);

  const checkHistoryAccess = async () => {
    const [hasFullAccess, retention] = await Promise.all([
      ConversationHistoryService.canAccessFullHistory(),
      ConversationHistoryService.getHistoryRetentionDays()
    ]);

    setCanAccessFullHistory(hasFullAccess);
    setRetentionDays(retention);

    // Auto-hide if user already has full access
    if (hasFullAccess) {
      setIsVisible(false);
    }
  };

  const handleUpgrade = (plan: 'basic' | 'plus') => {
    router.push(`/pricing?plan=${plan}&feature=conversation_history`);
  };

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  const getPromptContent = () => {
    switch (trigger) {
      case 'limit_reached':
        return {
          icon: '⏳',
          title: 'Conversation History Limit Reached',
          description: `You've reached your ${retentionDays}-day conversation history limit. Older conversations will be automatically deleted.`,
          urgency: 'high'
        };

      case 'history_cutoff':
        return {
          icon: '📅',
          title: 'Some History No Longer Available',
          description: `Conversations older than ${retentionDays} days have been removed. Upgrade to keep all your conversations forever.`,
          urgency: 'medium'
        };

      case 'feature_preview':
      default:
        return {
          icon: '🚀',
          title: 'Unlock Unlimited Conversation History',
          description: 'Keep all your coaching conversations, insights, and progress forever with premium plans.',
          urgency: 'low'
        };
    }
  };

  if (!isVisible || canAccessFullHistory) {
    return null;
  }

  const content = getPromptContent();

  return (
    <div className={`${className}`}>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-slate-800 border border-slate-700 rounded-2xl max-w-lg w-full p-6 relative">
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Content */}
          <div className="text-center">
            <div className="text-4xl mb-4">{content.icon}</div>
            <h2 className="text-2xl font-bold text-white mb-4">{content.title}</h2>
            <p className="text-slate-300 mb-6">{content.description}</p>

            {/* Current Plan Status */}
            <div className={`mb-6 p-4 rounded-lg border ${
              content.urgency === 'high'
                ? 'bg-red-500/10 border-red-400/20'
                : content.urgency === 'medium'
                ? 'bg-yellow-500/10 border-yellow-400/20'
                : 'bg-blue-500/10 border-blue-400/20'
            }`}>
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className={`text-sm font-medium ${
                  content.urgency === 'high' ? 'text-red-400' :
                  content.urgency === 'medium' ? 'text-yellow-400' : 'text-blue-400'
                }`}>
                  Current Plan: {retentionDays === 7 ? 'Free' : retentionDays === 90 ? 'Basic' : 'Unknown'}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {retentionDays === -1 ? 'Unlimited' : `${retentionDays} days`} conversation history
              </p>
            </div>

            {/* Upgrade Options */}
            <div className="space-y-4 mb-6">
              {/* Basic Plan (if currently free) */}
              {retentionDays === 7 && (
                <div className="bg-slate-700/30 border border-slate-600 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-white">Catalyst Basic</h3>
                      <p className="text-sm text-slate-400">Perfect for regular users</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-white">$19</div>
                      <div className="text-xs text-slate-400">per month</div>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-green-400">✓</span>
                      <span className="text-slate-300">90 days conversation history</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-green-400">✓</span>
                      <span className="text-slate-300">150 AI coaching messages/month</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-green-400">✓</span>
                      <span className="text-slate-300">Personal assessments & insights</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleUpgrade('basic')}
                    className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
                  >
                    Upgrade to Basic
                  </button>
                </div>
              )}

              {/* Plus Plan (recommended) */}
              <div className="relative bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-400/30 rounded-lg p-4">
                {/* Recommended Badge */}
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-medium px-3 py-1 rounded-full">
                    RECOMMENDED
                  </span>
                </div>

                <div className="flex items-center justify-between mb-3 mt-2">
                  <div>
                    <h3 className="font-semibold text-white">Catalyst Plus</h3>
                    <p className="text-sm text-blue-300">Complete AI coaching suite</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-white">$39</div>
                    <div className="text-xs text-blue-300">per month</div>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-green-400">✓</span>
                    <span className="text-blue-100">Unlimited conversation history</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-green-400">✓</span>
                    <span className="text-blue-100">Unlimited AI coaching messages</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-green-400">✓</span>
                    <span className="text-blue-100">Document upload & AI analysis</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-green-400">✓</span>
                    <span className="text-blue-100">Advanced conversation insights</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-green-400">✓</span>
                    <span className="text-blue-100">Export & backup conversations</span>
                  </div>
                </div>

                <button
                  onClick={() => handleUpgrade('plus')}
                  className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 transition-all duration-200"
                >
                  Upgrade to Plus
                </button>
              </div>
            </div>

            {/* Alternative Actions */}
            <div className="flex gap-3">
              <button
                onClick={handleClose}
                className="flex-1 px-4 py-2 border border-slate-600 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors"
              >
                Maybe Later
              </button>
              <button
                onClick={() => router.push('/pricing')}
                className="flex-1 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
              >
                Compare All Plans
              </button>
            </div>

            {/* Value Proposition */}
            <div className="mt-6 pt-4 border-t border-slate-600">
              <p className="text-xs text-slate-400 text-center">
                💡 Your conversation history is your coaching journey. Keep it forever to track your growth and refer back to insights.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}