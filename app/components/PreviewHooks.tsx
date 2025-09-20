'use client';

import { useState } from 'react';

interface PreviewHookProps {
  type: 'goal-tracking' | 'memory' | 'insights' | 'dashboard' | 'accountability';
  triggerText?: string;
  className?: string;
  onUpgradeClick: () => void;
}

export function PreviewHook({ type, triggerText, className = '', onUpgradeClick }: PreviewHookProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const previewContent = {
    'goal-tracking': {
      icon: '🎯',
      title: 'Goal Tracking Preview',
      description: 'See how Catalyst Plus would track and coach you through this goal',
      features: [
        'Automatic progress tracking',
        'Milestone breakdown and celebration',
        'Weekly accountability check-ins',
        'Personalized coaching based on your style'
      ],
      mockup: 'Goal: "Learn Spanish in 6 months"\n• Week 1: Complete Duolingo basics ✓\n• Week 2: Practice 30 min daily ⏳\n• Week 3: Watch Spanish Netflix...\n\nProgress: 12% complete\nNext check-in: Tomorrow'
    },
    'memory': {
      icon: '🧠',
      title: 'Conversation Memory Preview',
      description: 'This is how Catalyst Plus would remember our conversations',
      features: [
        'Remembers every conversation topic',
        'References past discussions naturally',
        'Builds on previous advice and insights',
        'Creates continuity across all chats'
      ],
      mockup: 'Previous Conversations:\n• Spanish learning goals (3 days ago)\n• Morning routine optimization (1 week ago)\n• Career transition planning (2 weeks ago)\n\n"How\'s that Spanish practice going that you mentioned?"'
    },
    'insights': {
      icon: '💡',
      title: 'Personal Insights Preview',
      description: 'AI-generated coaching insights based on your patterns',
      features: [
        'Pattern recognition across all goals',
        'Personalized recommendations',
        'Progress celebration and motivation',
        'Early warning for potential obstacles'
      ],
      mockup: '🎉 Insight: You\'re 3x more successful with goals that have daily habits\n\n💡 Recommendation: Break your big goals into daily actions\n\n⚠️ Alert: You haven\'t updated progress in 5 days'
    },
    'dashboard': {
      icon: '📊',
      title: 'Life Dashboard Preview',
      description: 'Visual progress tracking across all life areas',
      features: [
        'Life satisfaction wheel',
        'Goal progress visualization',
        'Momentum tracking and trends',
        'Areas needing attention alerts'
      ],
      mockup: 'Life Balance Score: 7.2/10\n\n📈 Improving: Health, Career\n📉 Needs attention: Relationships\n🎯 Active goals: 5\n🏆 Completed this month: 2'
    },
    'accountability': {
      icon: '✅',
      title: 'Accountability Coaching Preview',
      description: 'Proactive check-ins and progress accountability',
      features: [
        'Smart check-in reminders',
        'Progress accountability questions',
        'Celebration of wins and milestones',
        'Gentle nudges when falling behind'
      ],
      mockup: 'Weekly Check-in:\n"How did the Spanish practice go this week?"\n\n"I notice you missed 2 days - what got in the way?"\n\n"Let\'s adjust your schedule to make it more realistic."'
    }
  };

  const content = previewContent[type];

  return (
    <div className={`relative ${className}`}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-400/20 rounded-lg text-purple-300 hover:text-purple-200 transition-colors text-sm group"
      >
        <span>{content.icon}</span>
        <span>{triggerText || 'Preview Premium Feature'}</span>
        <span className="text-xs opacity-60">🔒</span>
        <span className="ml-1 transform transition-transform group-hover:scale-110">
          {isExpanded ? '▼' : '▶'}
        </span>
      </button>

      {/* Expanded Preview */}
      {isExpanded && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-slate-800 border border-purple-400/20 rounded-xl p-4 z-50 shadow-xl">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">{content.icon}</span>
            <div>
              <h4 className="font-semibold text-white">{content.title}</h4>
              <p className="text-xs text-slate-400">{content.description}</p>
            </div>
          </div>

          {/* Mock Feature Display */}
          <div className="bg-slate-900/50 rounded-lg p-3 mb-3 border border-slate-600/30">
            <pre className="text-xs text-slate-300 whitespace-pre-wrap font-mono">
              {content.mockup}
            </pre>
          </div>

          {/* Feature List */}
          <div className="space-y-1 mb-4">
            {content.features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2 text-xs text-slate-400">
                <span className="text-purple-400">✓</span>
                <span>{feature}</span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="flex gap-2">
            <button
              onClick={() => setIsExpanded(false)}
              className="flex-1 px-3 py-2 text-xs text-slate-400 hover:text-slate-300 transition-colors"
            >
              Close Preview
            </button>
            <button
              onClick={() => {
                setIsExpanded(false);
                onUpgradeClick();
              }}
              className="flex-1 px-3 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg text-xs font-medium hover:from-purple-600 hover:to-pink-600 transition-colors"
            >
              Unlock for $19/mo
            </button>
          </div>

          <div className="text-center mt-2">
            <p className="text-xs text-purple-400/70">
              $1 less than ChatGPT Plus
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// Quick preview banners for specific contexts
export function GoalPreviewBanner({ onUpgradeClick }: { onUpgradeClick: () => void }) {
  return (
    <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-400/20 rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🎯</span>
          <div>
            <h4 className="font-medium text-white">Track This Goal</h4>
            <p className="text-sm text-slate-400">With Catalyst Plus, I'd track this goal and check in on your progress</p>
          </div>
        </div>
        <button
          onClick={onUpgradeClick}
          className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg text-sm font-medium whitespace-nowrap"
        >
          Upgrade ($19/mo)
        </button>
      </div>
    </div>
  );
}

export function MemoryPreviewBanner({ onUpgradeClick }: { onUpgradeClick: () => void }) {
  return (
    <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-400/20 rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🧠</span>
          <div>
            <h4 className="font-medium text-white">I'd Remember This Forever</h4>
            <p className="text-sm text-slate-400">ChatGPT forgets when you close the tab. I remember everything.</p>
          </div>
        </div>
        <button
          onClick={onUpgradeClick}
          className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg text-sm font-medium whitespace-nowrap"
        >
          $19/mo vs ChatGPT's $20
        </button>
      </div>
    </div>
  );
}

export function ComparisonPreviewBanner({ onUpgradeClick }: { onUpgradeClick: () => void }) {
  return (
    <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-400/20 rounded-lg p-4 mb-4">
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">💡</span>
          <h4 className="font-medium text-white">Why pay more for less?</h4>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-slate-300 font-medium mb-1">ChatGPT Plus ($20/mo)</div>
            <div className="text-slate-400 space-y-1 text-xs">
              <div>• Generic AI responses</div>
              <div>• No memory between chats</div>
              <div>• No goal tracking</div>
            </div>
          </div>
          <div>
            <div className="text-emerald-300 font-medium mb-1">Catalyst Plus ($19/mo)</div>
            <div className="text-emerald-400 space-y-1 text-xs">
              <div>• Personal AI coach</div>
              <div>• Remembers everything</div>
              <div>• Goal tracking & accountability</div>
            </div>
          </div>
        </div>

        <button
          onClick={onUpgradeClick}
          className="w-full px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg text-sm font-medium"
        >
          Get More for Less → $19/month
        </button>
      </div>
    </div>
  );
}