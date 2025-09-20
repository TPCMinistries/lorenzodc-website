'use client';
import { useState, useEffect } from 'react';
import { DatabaseUsageTracker } from '../lib/subscription/database-usage';

interface UsageDisplayProps {
  userId: string | null;
  isAuthenticated: boolean;
  onUpgradeClick?: () => void;
}

export default function UsageDisplay({ userId, isAuthenticated, onUpgradeClick }: UsageDisplayProps) {
  const [usage, setUsage] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || !userId) {
      setUsage(null);
      setLoading(false);
      return;
    }

    const fetchUsage = async () => {
      try {
        const [subscription, usageData] = await Promise.all([
          DatabaseUsageTracker.getSubscription(),
          DatabaseUsageTracker.getUsage()
        ]);

        const chatStatus = await DatabaseUsageTracker.canUserChat();

        setUsage({
          subscription,
          usageData,
          chatStatus,
          isPremium: subscription?.tierId === 'plus'
        });
      } catch (error) {
        console.error('Error fetching usage:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsage();

    // Refresh usage every 30 seconds
    const interval = setInterval(fetchUsage, 30000);
    return () => clearInterval(interval);
  }, [userId, isAuthenticated]);

  if (!isAuthenticated || loading) {
    return null;
  }

  if (!usage) {
    return (
      <div className="text-xs text-slate-400">
        Loading usage...
      </div>
    );
  }

  const { chatStatus, isPremium, usageData } = usage;

  if (isPremium) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-400/20">
        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
        <div className="text-xs text-cyan-300 font-medium">
          ✨ Catalyst Plus - Unlimited
        </div>
        <div className="text-xs text-cyan-400/70 ml-1">
          ($19/mo)
        </div>
      </div>
    );
  }

  const used = chatStatus.used || 0;
  const limit = chatStatus.limit || 15; // Updated to match free tier limit
  const remaining = chatStatus.remaining || 0;
  const percentage = (used / limit) * 100;

  let statusColor = 'emerald';
  let statusText = '';
  if (percentage >= 100) {
    statusColor = 'red';
    statusText = 'Limit reached';
  } else if (percentage >= 80) {
    statusColor = 'orange';
    statusText = 'Almost full';
  } else if (percentage >= 60) {
    statusColor = 'yellow';
    statusText = 'Getting close';
  } else {
    statusColor = 'emerald';
    statusText = 'Good to go';
  }

  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-600/30">
      {/* Usage Bar */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <div className="text-xs text-slate-400">
            Messages
          </div>
          <div className="text-xs text-slate-300">
            {used}/{limit}
          </div>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-1.5">
          <div
            className={`h-1.5 rounded-full bg-${statusColor}-500 transition-all duration-300`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
      </div>

      {/* Status Indicator & Upgrade Button */}
      <div className="flex items-center gap-2">
        <div className="text-xs">
          {remaining > 0 ? (
            <span className="text-emerald-400">{remaining} left</span>
          ) : (
            <span className="text-red-400">Limit reached</span>
          )}
        </div>

        {/* Show upgrade button when getting close to limit (12/15 chats) or reached */}
        {onUpgradeClick && (percentage >= 80 || remaining === 0) && (
          <button
            onClick={onUpgradeClick}
            className="text-xs bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white px-2 py-1 rounded transition-all duration-200"
          >
            Upgrade
          </button>
        )}
      </div>
    </div>
  );
}