'use client';

import { useEffect, useState } from 'react';
import GoalDashboard from '../components/goals/GoalDashboard';
import { ConversionTrackingService } from '../lib/services/conversion-tracking';

export default function GoalsPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Track goals page view
  useEffect(() => {
    ConversionTrackingService.trackPageView(
      '/goals',
      undefined,
      {
        page_type: 'goal_dashboard',
        features: ['goal_tracking', 'progress_updates', 'ai_coaching']
      }
    );
  }, []);

  // Show loading state until client-side hydration complete
  if (!mounted) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -right-4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 -left-4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-0 right-1/3 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10">
        <div className="container mx-auto px-4 py-16">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent leading-tight mb-4">
              Your Goal Dashboard
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Transform your dreams into actionable plans with AI-powered goal tracking, progress accountability, and intelligent coaching.
            </p>
          </div>

          {/* Goal Dashboard Component */}
          <GoalDashboard className="max-w-7xl mx-auto" />

          {/* Features Section */}
          <div className="max-w-6xl mx-auto mt-16">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-3xl flex items-center justify-center text-3xl mx-auto mb-6">
                  🎯
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Smart Goal Setting</h3>
                <p className="text-slate-300">
                  Use proven templates or create custom goals with built-in success criteria and milestone planning.
                </p>
              </div>

              <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-violet-600 rounded-3xl flex items-center justify-center text-3xl mx-auto mb-6">
                  📈
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Progress Tracking</h3>
                <p className="text-slate-300">
                  Visual progress bars, milestone celebrations, and detailed analytics to keep you motivated and on track.
                </p>
              </div>

              <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-3xl flex items-center justify-center text-3xl mx-auto mb-6">
                  🤖
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">AI Coaching</h3>
                <p className="text-slate-300">
                  Personalized feedback, accountability check-ins, and intelligent recommendations to optimize your success.
                </p>
              </div>
            </div>
          </div>

          {/* Coming Soon Features */}
          <div className="max-w-4xl mx-auto mt-16 text-center">
            <h2 className="text-2xl font-bold text-white mb-6">🚀 Coming Soon</h2>
            <div className="grid md:grid-cols-2 gap-6 text-sm">
              <div className="bg-slate-800/30 border border-slate-700/30 rounded-xl p-4">
                <div className="font-semibold text-blue-300 mb-2">🤝 Accountability Partners</div>
                <p className="text-slate-400">
                  Connect with friends, mentors, or AI coaches for regular check-ins and mutual support.
                </p>
              </div>
              <div className="bg-slate-800/30 border border-slate-700/30 rounded-xl p-4">
                <div className="font-semibold text-purple-300 mb-2">📱 Mobile App & Notifications</div>
                <p className="text-slate-400">
                  Stay on track with smart reminders, progress notifications, and mobile-first experience.
                </p>
              </div>
              <div className="bg-slate-800/30 border border-slate-700/30 rounded-xl p-4">
                <div className="font-semibold text-green-300 mb-2">🏆 Achievement System</div>
                <p className="text-slate-400">
                  Unlock badges, celebrate streaks, and earn rewards for consistent progress and goal completions.
                </p>
              </div>
              <div className="bg-slate-800/30 border border-slate-700/30 rounded-xl p-4">
                <div className="font-semibold text-orange-300 mb-2">📊 Advanced Analytics</div>
                <p className="text-slate-400">
                  Deep insights into your goal patterns, success factors, and personalized optimization recommendations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}