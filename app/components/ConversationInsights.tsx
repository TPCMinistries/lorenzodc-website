'use client';

import { useState, useEffect } from 'react';
import { ConversationHistoryService, ConversationInsights as InsightsData } from '../lib/services/conversation-history';

interface ConversationInsightsProps {
  className?: string;
}

export default function ConversationInsights({ className = '' }: ConversationInsightsProps) {
  const [insights, setInsights] = useState<InsightsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'all'>('month');

  useEffect(() => {
    loadInsights();
  }, [timeframe]);

  const loadInsights = async () => {
    setLoading(true);
    try {
      const data = await ConversationHistoryService.getConversationInsights();
      setInsights(data);
    } catch (error) {
      console.error('Error loading conversation insights:', error);
    } finally {
      setLoading(false);
    }
  };

  const getEngagementLevel = (avgMessages: number): {
    level: string;
    color: string;
    description: string;
  } => {
    if (avgMessages >= 20) {
      return {
        level: 'Very High',
        color: 'text-emerald-400',
        description: 'Deep, meaningful conversations'
      };
    } else if (avgMessages >= 10) {
      return {
        level: 'High',
        color: 'text-blue-400',
        description: 'Good back-and-forth engagement'
      };
    } else if (avgMessages >= 5) {
      return {
        level: 'Moderate',
        color: 'text-yellow-400',
        description: 'Some interaction and follow-up'
      };
    } else {
      return {
        level: 'Light',
        color: 'text-slate-400',
        description: 'Brief interactions'
      };
    }
  };

  const getStreakDescription = (days: number): string => {
    if (days >= 30) return 'Amazing consistency! 🔥';
    if (days >= 14) return 'Great habit building! 💪';
    if (days >= 7) return 'Good momentum! 📈';
    if (days >= 3) return 'Getting started! 🌱';
    return 'Just beginning! ✨';
  };

  if (loading) {
    return (
      <div className={`bg-slate-800 rounded-xl border border-slate-600 p-6 ${className}`}>
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-3 text-slate-400">Loading insights...</span>
        </div>
      </div>
    );
  }

  if (!insights) {
    return (
      <div className={`bg-slate-800 rounded-xl border border-slate-600 p-6 ${className}`}>
        <div className="text-center text-slate-400">
          <div className="text-4xl mb-2">📊</div>
          <p>No conversation data available yet</p>
          <p className="text-sm mt-1">Start chatting to see your insights!</p>
        </div>
      </div>
    );
  }

  const engagement = getEngagementLevel(insights.avg_messages_per_session);

  return (
    <div className={`bg-slate-800 rounded-xl border border-slate-600 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-slate-600">
        <div>
          <h2 className="text-xl font-bold text-white mb-1">📊 Conversation Insights</h2>
          <p className="text-slate-400 text-sm">Your AI coaching journey overview</p>
        </div>

        {/* Timeframe Selector */}
        <div className="flex bg-slate-700 rounded-lg p-1">
          {[
            { key: 'week', label: '7D' },
            { key: 'month', label: '30D' },
            { key: 'all', label: 'All' }
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setTimeframe(key as any)}
              className={`px-3 py-1 text-xs rounded transition-colors ${
                timeframe === key
                  ? 'bg-blue-500 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Total Conversations */}
          <div className="bg-slate-700/30 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-400 mb-1">
              {insights.total_conversations}
            </div>
            <div className="text-slate-400 text-sm">Conversations</div>
          </div>

          {/* Total Messages */}
          <div className="bg-slate-700/30 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-emerald-400 mb-1">
              {insights.total_messages}
            </div>
            <div className="text-slate-400 text-sm">Messages</div>
          </div>

          {/* Average Session Length */}
          <div className="bg-slate-700/30 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-400 mb-1">
              {insights.avg_messages_per_session.toFixed(1)}
            </div>
            <div className="text-slate-400 text-sm">Avg per Chat</div>
          </div>

          {/* Active Days */}
          <div className="bg-slate-700/30 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-yellow-400 mb-1">
              {insights.conversation_streak_days}
            </div>
            <div className="text-slate-400 text-sm">Active Days</div>
          </div>
        </div>

        {/* Engagement Analysis */}
        <div className="bg-gradient-to-r from-slate-700/20 to-slate-700/40 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-white">Engagement Level</h3>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${engagement.color} bg-current bg-opacity-10`}>
              {engagement.level}
            </div>
          </div>
          <p className="text-slate-300 text-sm mb-2">{engagement.description}</p>

          {/* Progress Bar */}
          <div className="w-full bg-slate-600 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${
                engagement.level === 'Very High' ? 'bg-emerald-400' :
                engagement.level === 'High' ? 'bg-blue-400' :
                engagement.level === 'Moderate' ? 'bg-yellow-400' : 'bg-slate-400'
              }`}
              style={{
                width: `${Math.min((insights.avg_messages_per_session / 25) * 100, 100)}%`
              }}
            />
          </div>
        </div>

        {/* Activity Streak */}
        <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-400/20 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-white">Activity Streak</h3>
            <span className="text-2xl">🔥</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-3xl font-bold text-blue-400">
              {insights.conversation_streak_days}
            </div>
            <div>
              <div className="text-white font-medium">
                {insights.conversation_streak_days === 1 ? 'day' : 'days'} active
              </div>
              <div className="text-slate-400 text-sm">
                {getStreakDescription(insights.conversation_streak_days)}
              </div>
            </div>
          </div>
        </div>

        {/* Primary Topics */}
        {insights.primary_topics && insights.primary_topics.length > 0 && (
          <div>
            <h3 className="font-semibold text-white mb-3">💡 Your Main Topics</h3>
            <div className="flex flex-wrap gap-2">
              {insights.primary_topics.slice(0, 8).map((topic, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-slate-700 text-slate-300 rounded-full text-sm border border-slate-600"
                >
                  {topic}
                </span>
              ))}
              {insights.primary_topics.length > 8 && (
                <span className="px-3 py-1 bg-slate-600 text-slate-400 rounded-full text-sm">
                  +{insights.primary_topics.length - 8} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Most Active Day */}
        {insights.most_active_day && (
          <div className="bg-slate-700/30 rounded-lg p-4">
            <h3 className="font-semibold text-white mb-2">📅 Most Active Day</h3>
            <div className="flex items-center gap-3">
              <div className="text-2xl">📈</div>
              <div>
                <div className="text-white font-medium">{insights.most_active_day}</div>
                <div className="text-slate-400 text-sm">
                  Your peak conversation day
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Growth Insights */}
        <div className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-400/20 rounded-lg p-4">
          <h3 className="font-semibold text-white mb-3">🌱 Growth Insights</h3>
          <div className="space-y-2 text-sm">
            {insights.avg_messages_per_session >= 10 ? (
              <div className="flex items-center gap-2 text-emerald-400">
                <span>✅</span>
                <span>You're having meaningful, in-depth conversations</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-yellow-400">
                <span>💡</span>
                <span>Try asking follow-up questions for deeper insights</span>
              </div>
            )}

            {insights.conversation_streak_days >= 7 ? (
              <div className="flex items-center gap-2 text-emerald-400">
                <span>✅</span>
                <span>Great consistency! You're building a strong habit</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-blue-400">
                <span>🎯</span>
                <span>Aim for daily check-ins to maximize your growth</span>
              </div>
            )}

            {insights.total_conversations >= 10 ? (
              <div className="flex items-center gap-2 text-emerald-400">
                <span>✅</span>
                <span>You're exploring diverse topics and scenarios</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-purple-400">
                <span>🚀</span>
                <span>Try exploring different areas of coaching</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}