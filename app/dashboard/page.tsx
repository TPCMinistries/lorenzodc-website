'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../lib/hooks/useAuth';
import { GoalTrackingService } from '../lib/services/goal-tracking';
import { LIFE_CATEGORIES } from '../lib/types/coaching';
import type { DashboardData, UserGoal, LifeArea, PersonalInsight } from '../lib/types/coaching';

export default function DashboardPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedGoal, setSelectedGoal] = useState<UserGoal | null>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, authLoading, router]);

  // Load dashboard data
  useEffect(() => {
    if (isAuthenticated) {
      loadDashboardData();
    }
  }, [isAuthenticated]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const data = await GoalTrackingService.getDashboardData();
      setDashboardData(data);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateGoalProgress = async (goalId: string, progress: number) => {
    await GoalTrackingService.updateGoalProgress(goalId, progress);
    await loadDashboardData(); // Refresh data
  };

  const markInsightAsRead = async (insightId: string) => {
    await GoalTrackingService.markInsightAsRead(insightId);
    await loadDashboardData(); // Refresh data
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-slate-300">Loading your dashboard...</div>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🎯</div>
          <h2 className="text-2xl font-bold mb-4">Welcome to Your Catalyst Dashboard</h2>
          <p className="text-slate-400 mb-8 max-w-md">
            Let's set up your first goals to start your personalized coaching journey.
          </p>
          <button
            onClick={() => router.push('/onboarding')}
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white rounded-xl font-medium transition-all duration-200"
          >
            Set Up Your Goals
          </button>
        </div>
      </div>
    );
  }

  const { user, active_goals, life_areas, recent_insights, life_analytics } = dashboardData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Header */}
      <div className="border-b border-slate-700/50 bg-slate-900/95 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Your Life Dashboard
            </h1>
            <p className="text-slate-400 text-sm">Track your progress across all areas of life</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/chat')}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white rounded-xl transition-all duration-200"
            >
              💬 Chat with Catalyst
            </button>
            <button
              onClick={() => router.push('/onboarding')}
              className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition-all duration-200"
            >
              ➕ Add Goals
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Life Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Overall Progress */}
          <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">📊</span>
              </div>
              <div>
                <h3 className="font-semibold text-white">Overall Progress</h3>
                <p className="text-sm text-slate-400">Your life journey</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-400">Life Satisfaction</span>
                <span className="text-lg font-bold text-cyan-400">{life_analytics.overall_life_satisfaction.toFixed(1)}/10</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-400">Goal Completion</span>
                <span className="text-lg font-bold text-emerald-400">{life_analytics.goal_completion_rate.toFixed(0)}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-400">Momentum</span>
                <span className={`text-sm font-medium ${
                  life_analytics.momentum_trend === 'increasing' ? 'text-emerald-400' :
                  life_analytics.momentum_trend === 'stable' ? 'text-yellow-400' : 'text-red-400'
                }`}>
                  {life_analytics.momentum_trend === 'increasing' ? '📈 Rising' :
                   life_analytics.momentum_trend === 'stable' ? '➡️ Stable' : '📉 Declining'}
                </span>
              </div>
            </div>
          </div>

          {/* Active Goals Summary */}
          <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">🎯</span>
              </div>
              <div>
                <h3 className="font-semibold text-white">Active Goals</h3>
                <p className="text-sm text-slate-400">Current focus areas</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-400">Total Goals</span>
                <span className="text-lg font-bold text-white">{active_goals.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-400">High Priority</span>
                <span className="text-lg font-bold text-orange-400">{active_goals.filter(g => g.priority_level === 'high').length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-400">Near Completion</span>
                <span className="text-lg font-bold text-emerald-400">{active_goals.filter(g => g.progress_percentage > 75).length}</span>
              </div>
            </div>
          </div>

          {/* Insights */}
          <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">💡</span>
              </div>
              <div>
                <h3 className="font-semibold text-white">Personal Insights</h3>
                <p className="text-sm text-slate-400">AI-powered coaching</p>
              </div>
            </div>
            <div className="space-y-2">
              {recent_insights.length > 0 ? (
                recent_insights.slice(0, 2).map(insight => (
                  <div
                    key={insight.id}
                    onClick={() => markInsightAsRead(insight.id)}
                    className="p-3 bg-slate-700/30 rounded-lg cursor-pointer hover:bg-slate-700/50 transition-colors"
                  >
                    <div className="flex items-start gap-2">
                      <span className="text-xs">
                        {insight.insight_type === 'celebration' ? '🎉' :
                         insight.insight_type === 'warning' ? '⚠️' :
                         insight.insight_type === 'recommendation' ? '💡' : '📈'}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{insight.title}</p>
                        <p className="text-xs text-slate-400 line-clamp-2">{insight.description}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-400">No new insights yet. Keep working on your goals!</p>
              )}
            </div>
          </div>
        </div>

        {/* Life Areas Wheel */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Life Satisfaction Wheel */}
          <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
            <h3 className="text-xl font-semibold text-white mb-6">Life Balance Overview</h3>
            <div className="grid grid-cols-2 gap-4">
              {life_areas.map((area, index) => {
                const category = Object.entries(LIFE_CATEGORIES).find(([_, cat]) => cat.name === area.area_name);
                const color = category ? category[1].color : 'slate';
                const satisfaction = area.satisfaction_level || 5;

                return (
                  <div key={area.id} className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg">
                    <div className="text-2xl">{category ? category[1].icon : '📋'}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-white truncate">{area.area_name}</span>
                        <span className="text-sm text-slate-400">{satisfaction}/10</span>
                      </div>
                      <div className="w-full bg-slate-600 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full bg-gradient-to-r transition-all duration-300 ${
                            satisfaction >= 8 ? 'from-emerald-500 to-green-500' :
                            satisfaction >= 6 ? 'from-yellow-500 to-orange-500' :
                            'from-red-500 to-pink-500'
                          }`}
                          style={{ width: `${satisfaction * 10}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Goals Progress */}
          <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Goal Progress</h3>
              <button
                onClick={() => router.push('/onboarding')}
                className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                + Add Goal
              </button>
            </div>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {active_goals.length > 0 ? active_goals.map(goal => (
                <div
                  key={goal.id}
                  onClick={() => setSelectedGoal(goal)}
                  className="p-4 bg-slate-700/30 rounded-lg cursor-pointer hover:bg-slate-700/50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-white truncate">{goal.title}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      goal.priority_level === 'high' ? 'bg-red-500/20 text-red-400' :
                      goal.priority_level === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-blue-500/20 text-blue-400'
                    }`}>
                      {goal.priority_level}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-slate-600 rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-300"
                        style={{ width: `${goal.progress_percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-slate-400">{goal.progress_percentage}%</span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-slate-500 capitalize">{goal.category}</span>
                    {goal.target_date && (
                      <span className="text-xs text-slate-500">
                        Due: {new Date(goal.target_date).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              )) : (
                <div className="text-center py-8">
                  <div className="text-4xl mb-3">🎯</div>
                  <p className="text-slate-400 mb-4">No goals set yet</p>
                  <button
                    onClick={() => router.push('/onboarding')}
                    className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-lg text-sm"
                  >
                    Set Your First Goal
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Areas Needing Attention */}
        {life_analytics.areas_needing_attention.length > 0 && (
          <div className="bg-amber-500/10 border border-amber-400/20 rounded-2xl p-6 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">⚠️</span>
              <div>
                <h3 className="font-semibold text-amber-300">Areas Needing Attention</h3>
                <p className="text-sm text-amber-400/70">Consider setting goals in these areas to improve life balance</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {life_analytics.areas_needing_attention.map(area => (
                <span
                  key={area}
                  className="px-3 py-1 bg-amber-500/20 text-amber-300 rounded-full text-sm"
                >
                  {area}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Goal Detail Modal */}
      {selectedGoal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl max-w-lg w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">{selectedGoal.title}</h3>
              <button
                onClick={() => setSelectedGoal(null)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-2">Description</label>
                <p className="text-white">{selectedGoal.description || 'No description provided'}</p>
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-2">Progress</label>
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-slate-700 rounded-full h-3">
                    <div
                      className="h-3 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500"
                      style={{ width: `${selectedGoal.progress_percentage}%` }}
                    />
                  </div>
                  <span className="text-white font-medium">{selectedGoal.progress_percentage}%</span>
                </div>
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-2">Update Progress</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={selectedGoal.progress_percentage}
                  onChange={(e) => {
                    const newProgress = parseInt(e.target.value);
                    setSelectedGoal(prev => prev ? { ...prev, progress_percentage: newProgress } : null);
                  }}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setSelectedGoal(null)}
                  className="flex-1 px-4 py-2 border border-slate-600 text-slate-300 rounded-xl hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (selectedGoal) {
                      updateGoalProgress(selectedGoal.id, selectedGoal.progress_percentage);
                      setSelectedGoal(null);
                    }
                  }}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-xl font-medium transition-colors"
                >
                  Update Progress
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}