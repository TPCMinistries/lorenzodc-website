'use client';

import { useState, useEffect } from 'react';
import { GoalTrackingService, Goal, GoalAnalytics } from '../../lib/services/goal-tracking-v2';
import GoalCard from './GoalCard';
import CreateGoalModal from './CreateGoalModal';
import GoalTemplateSelector from './GoalTemplateSelector';

interface GoalDashboardProps {
  className?: string;
}

export default function GoalDashboard({ className = '' }: GoalDashboardProps) {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [analytics, setAnalytics] = useState<GoalAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [filterStatus, setFilterStatus] = useState<Goal['status'] | 'all'>('all');
  const [filterCategory, setFilterCategory] = useState<string | 'all'>('all');

  useEffect(() => {
    loadGoals();
    loadAnalytics();
  }, []);

  const loadGoals = async () => {
    setLoading(true);
    try {
      const goalsData = await GoalTrackingService.getUserGoals();
      setGoals(goalsData);
    } catch (error) {
      console.error('Error loading goals:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAnalytics = async () => {
    try {
      const analyticsData = await GoalTrackingService.getUserAnalytics(30);
      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Error loading analytics:', error);
    }
  };

  const handleGoalCreated = () => {
    setShowCreateModal(false);
    setShowTemplates(false);
    loadGoals();
    loadAnalytics();
  };

  const handleGoalUpdated = () => {
    loadGoals();
    loadAnalytics();
  };

  const filteredGoals = goals.filter(goal => {
    if (filterStatus !== 'all' && goal.status !== filterStatus) return false;
    if (filterCategory !== 'all' && goal.category !== filterCategory) return false;
    return true;
  });

  const categories = Array.from(new Set(goals.map(g => g.category).filter(Boolean)));

  if (loading) {
    return (
      <div className={`bg-slate-800 rounded-xl border border-slate-600 p-6 ${className}`}>
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-3 text-slate-400">Loading your goals...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-slate-800 rounded-xl border border-slate-600 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-slate-600">
        <div>
          <h2 className="text-xl font-bold text-white mb-1">🎯 Goal Dashboard</h2>
          <p className="text-slate-400 text-sm">Track your progress and achieve your dreams</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowTemplates(true)}
            className="px-4 py-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors"
          >
            Browse Templates
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200"
          >
            + New Goal
          </button>
        </div>
      </div>

      {/* Analytics Overview */}
      {analytics && (
        <div className="p-6 border-b border-slate-600">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{analytics.active_goals}</div>
              <div className="text-sm text-slate-400">Active Goals</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{analytics.completed_goals}</div>
              <div className="text-sm text-slate-400">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">{Math.round(analytics.avg_completion_rate)}%</div>
              <div className="text-sm text-slate-400">Avg Progress</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">{Math.round(analytics.milestone_completion_rate)}%</div>
              <div className="text-sm text-slate-400">Milestones Hit</div>
            </div>
          </div>

          {/* Progress by Category */}
          {Object.keys(analytics.goals_by_category).length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm font-medium text-slate-300 mb-2">Goals by Category</h3>
              <div className="flex flex-wrap gap-2">
                {Object.entries(analytics.goals_by_category).map(([category, count]) => (
                  <div
                    key={category}
                    className="flex items-center gap-2 px-3 py-1 bg-slate-700 rounded-full text-sm"
                  >
                    <span>{GoalTrackingService.getCategoryIcon(category)}</span>
                    <span className="text-slate-300 capitalize">{category}</span>
                    <span className="text-slate-400">({count})</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Filters */}
      <div className="p-6 border-b border-slate-600">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm text-slate-400">Status:</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-3 py-1 bg-slate-700 border border-slate-600 rounded text-slate-300 text-sm"
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="paused">Paused</option>
              <option value="draft">Draft</option>
            </select>
          </div>

          {categories.length > 0 && (
            <div className="flex items-center gap-2">
              <label className="text-sm text-slate-400">Category:</label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-1 bg-slate-700 border border-slate-600 rounded text-slate-300 text-sm"
              >
                <option value="all">All</option>
                {categories.map(category => (
                  <option key={category} value={category} className="capitalize">
                    {category}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="ml-auto text-sm text-slate-400">
            {filteredGoals.length} of {goals.length} goals
          </div>
        </div>
      </div>

      {/* Goals Grid */}
      <div className="p-6">
        {filteredGoals.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-xl font-bold text-white mb-2">
              {goals.length === 0 ? 'Ready to Set Your First Goal?' : 'No Goals Match Filters'}
            </h3>
            <p className="text-slate-400 mb-6 max-w-md mx-auto">
              {goals.length === 0
                ? 'Transform your dreams into actionable plans with AI-powered goal tracking and accountability.'
                : 'Try adjusting your filters to see more goals, or create a new one.'
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => setShowTemplates(true)}
                className="px-6 py-3 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors"
              >
                Browse Goal Templates
              </button>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200"
              >
                Create Custom Goal
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGoals.map(goal => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onUpdate={handleGoalUpdated}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      {showCreateModal && (
        <CreateGoalModal
          onClose={() => setShowCreateModal(false)}
          onGoalCreated={handleGoalCreated}
        />
      )}

      {showTemplates && (
        <GoalTemplateSelector
          onClose={() => setShowTemplates(false)}
          onGoalCreated={handleGoalCreated}
        />
      )}
    </div>
  );
}