'use client';
import { useState } from 'react';
import { UsageTracker } from '../lib/subscription/UsageTracker';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
}

export default function UpgradeModal({ isOpen, onClose, onUpgrade }: UpgradeModalProps) {
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleUpgrade = async () => {
    setLoading(true);

    try {
      // In production, this would integrate with Stripe
      await new Promise(resolve => setTimeout(resolve, 1500));

      UsageTracker.upgradeToPlus('demo_customer', 'demo_subscription');
      onUpgrade();
      onClose();
    } catch (error) {
      console.error('Upgrade failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl max-w-lg w-full p-6">
        <div className="text-center mb-6">
          <div className="text-4xl mb-4">🎯</div>
          <h2 className="text-2xl font-bold text-white mb-2">Better Than ChatGPT Plus</h2>
          <p className="text-slate-300 mb-3">
            Personal AI coaching that remembers your goals and helps you achieve them.
          </p>
          <div className="bg-emerald-500/10 border border-emerald-400/20 rounded-lg p-3">
            <p className="text-emerald-300 text-sm font-medium">
              💰 Start at $19/month vs ChatGPT Plus $20/month
            </p>
            <p className="text-emerald-400/70 text-xs">
              Personal AI coach that remembers everything
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-400/20 rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">Catalyst Basic</h3>
            <div className="text-right">
              <div className="text-3xl font-bold text-cyan-400">$19</div>
              <div className="text-sm text-slate-400">/month</div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-cyan-500/20 flex items-center justify-center mt-0.5">
                <span className="text-cyan-400 text-xs">🎯</span>
              </div>
              <div>
                <div className="text-white font-medium">Personal Goal Tracking & Accountability</div>
                <div className="text-slate-400 text-sm">I remember your goals and help you achieve them</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center mt-0.5">
                <span className="text-purple-400 text-xs">🧠</span>
              </div>
              <div>
                <div className="text-white font-medium">Enhanced Coaching Personality</div>
                <div className="text-slate-400 text-sm">Personalized responses based on your journey</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center mt-0.5">
                <span className="text-emerald-400 text-xs">📊</span>
              </div>
              <div>
                <div className="text-white font-medium">Progress Dashboard & Life Analytics</div>
                <div className="text-slate-400 text-sm">Visual progress tracking across all life areas</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-orange-500/20 flex items-center justify-center mt-0.5">
                <span className="text-orange-400 text-xs">✅</span>
              </div>
              <div>
                <div className="text-white font-medium">Smart Check-ins & Reminders</div>
                <div className="text-slate-400 text-sm">Proactive coaching to keep you on track</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-rose-500/20 flex items-center justify-center mt-0.5">
                <span className="text-rose-400 text-xs">💬</span>
              </div>
              <div>
                <div className="text-white font-medium">150 Coaching Conversations/Month</div>
                <div className="text-slate-400 text-sm">5 per day - upgrade to Plus for unlimited</div>
              </div>
            </div>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="bg-slate-700/30 rounded-lg p-4 mb-6">
          <h4 className="text-sm font-semibold text-white mb-3 text-center">Why Choose Catalyst Plus?</h4>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <div className="font-medium text-slate-300 mb-2">ChatGPT Plus ($20/month)</div>
              <div className="space-y-1 text-slate-400">
                <div>• Unlimited generic AI</div>
                <div>• No memory between chats</div>
                <div>• No goal tracking</div>
                <div>• No personalization</div>
              </div>
            </div>
            <div>
              <div className="font-medium text-cyan-300 mb-2">Catalyst Plus ($19/month)</div>
              <div className="space-y-1 text-cyan-400">
                <div>• Personal AI coach</div>
                <div>• Remembers everything</div>
                <div>• Goal tracking & accountability</div>
                <div>• Progress insights</div>
              </div>
            </div>
          </div>
          <div className="text-center mt-4 pt-3 border-t border-slate-600">
            <p className="text-emerald-400 text-sm font-medium">
              💡 More features for less money
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-slate-600 text-slate-300 rounded-xl hover:bg-slate-700 transition-colors"
          >
            Maybe Later
          </button>
          <button
            onClick={handleUpgrade}
            disabled={loading}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white rounded-xl font-medium disabled:opacity-50 transition-all duration-200"
          >
            {loading ? 'Processing...' : 'Upgrade to Plus'}
          </button>
        </div>

        <p className="text-xs text-slate-500 text-center mt-4">
          Cancel anytime • No long-term commitments • 30-day money-back guarantee
        </p>
      </div>
    </div>
  );
}