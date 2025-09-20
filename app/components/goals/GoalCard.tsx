'use client';

import { useState } from 'react';
import { Goal, GoalTrackingService } from '../../lib/services/goal-tracking-v2';

interface GoalCardProps {
  goal: Goal;
  onUpdate: () => void;
}

export default function GoalCard({ goal, onUpdate }: GoalCardProps) {
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [progressValue, setProgressValue] = useState(goal.current_value);
  const [progressNote, setProgressNote] = useState('');
  const [moodRating, setMoodRating] = useState<number | undefined>();
  const [confidenceRating, setConfidenceRating] = useState<number | undefined>();
  const [updating, setUpdating] = useState(false);

  const handleProgressUpdate = async () => {
    if (!progressValue && progressValue !== 0) return;

    setUpdating(true);
    try {
      const success = await GoalTrackingService.updateProgress(
        goal.id,
        progressValue,
        progressNote || undefined,
        moodRating,
        confidenceRating
      );

      if (success) {
        // Trigger goal email automation for progress update
        await GoalTrackingService.triggerGoalEmailAutomation(
          goal.id,
          'goal_created', // Using existing event type
          {
            progress_update: true,
            new_progress: progressValue,
            mood: moodRating,
            confidence: confidenceRating
          }
        );

        setShowProgressModal(false);
        setProgressNote('');
        setMoodRating(undefined);
        setConfidenceRating(undefined);
        onUpdate();
      }
    } catch (error) {
      console.error('Error updating progress:', error);
    } finally {
      setUpdating(false);
    }
  };

  const handleStatusChange = async (newStatus: Goal['status']) => {
    try {
      const success = await GoalTrackingService.updateGoal(goal.id, { status: newStatus });
      if (success) {
        if (newStatus === 'completed') {
          await GoalTrackingService.triggerGoalEmailAutomation(
            goal.id,
            'goal_completed',
            { completion_date: new Date().toISOString() }
          );
        }
        onUpdate();
      }
    } catch (error) {
      console.error('Error updating goal status:', error);
    }
  };

  const daysRemaining = GoalTrackingService.calculateDaysRemaining(goal.target_date);
  const isOverdue = daysRemaining !== null && daysRemaining < 0;
  const isDueSoon = daysRemaining !== null && daysRemaining <= 7 && daysRemaining >= 0;

  return (
    <>
      <div className={`bg-slate-700/30 border rounded-xl p-6 transition-all duration-200 hover:border-slate-500/50 ${
        goal.status === 'completed' ? 'border-green-500/30 bg-green-500/5' :
        goal.status === 'paused' ? 'border-yellow-500/30' :
        isOverdue ? 'border-red-500/30' :
        'border-slate-600/30'
      }`}>
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">{GoalTrackingService.getCategoryIcon(goal.category || 'personal')}</span>
            <div>
              <h3 className="font-semibold text-white text-lg">{goal.title}</h3>
              {goal.category && (
                <span className="text-xs text-slate-400 capitalize">{goal.category}</span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-xs px-2 py-1 rounded ${GoalTrackingService.getPriorityColor(goal.priority)} bg-slate-800/50`}>
              {goal.priority}
            </span>
            <span className={`text-lg ${GoalTrackingService.getStatusColor(goal.status)}`}>
              {GoalTrackingService.getStatusIcon(goal.status)}
            </span>
          </div>
        </div>

        {/* Description */}
        {goal.description && (
          <p className="text-slate-300 text-sm mb-4 line-clamp-2">{goal.description}</p>
        )}

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-slate-400">Progress</span>
            <span className="text-sm font-medium text-white">
              {Math.round(goal.completion_percentage)}%
            </span>
          </div>
          <div className="w-full bg-slate-600 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all duration-300 ${GoalTrackingService.getProgressBarColor(goal.completion_percentage)}`}
              style={{ width: `${Math.min(goal.completion_percentage, 100)}%` }}
            />
          </div>
          {goal.is_measurable && (
            <div className="mt-2 text-xs text-slate-400">
              {GoalTrackingService.formatProgress(goal.current_value, goal.target_value, goal.measurement_unit)}
            </div>
          )}
        </div>

        {/* Target Date */}
        {goal.target_date && (
          <div className={`text-sm mb-4 ${
            isOverdue ? 'text-red-400' :
            isDueSoon ? 'text-yellow-400' :
            'text-slate-400'
          }`}>
            {isOverdue ? `Overdue by ${Math.abs(daysRemaining!)} days` :
             daysRemaining === 0 ? 'Due today' :
             daysRemaining === 1 ? 'Due tomorrow' :
             daysRemaining ? `${daysRemaining} days remaining` :
             `Target: ${new Date(goal.target_date).toLocaleDateString()}`
            }
          </div>
        )}

        {/* Why Important */}
        {goal.why_important && (
          <div className="mb-4 p-3 bg-slate-800/50 rounded-lg">
            <div className="text-xs text-slate-400 mb-1">Why this matters:</div>
            <div className="text-sm text-slate-300 line-clamp-2">{goal.why_important}</div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap gap-2 mt-4">
          {goal.status !== 'completed' && (
            <button
              onClick={() => setShowProgressModal(true)}
              className="px-3 py-2 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-colors text-sm"
            >
              Update Progress
            </button>
          )}

          {goal.status === 'active' && goal.completion_percentage < 100 && (
            <button
              onClick={() => handleStatusChange('completed')}
              className="px-3 py-2 bg-green-500/20 text-green-300 rounded-lg hover:bg-green-500/30 transition-colors text-sm"
            >
              Mark Complete
            </button>
          )}

          {goal.status === 'active' && (
            <button
              onClick={() => handleStatusChange('paused')}
              className="px-3 py-2 bg-yellow-500/20 text-yellow-300 rounded-lg hover:bg-yellow-500/30 transition-colors text-sm"
            >
              Pause
            </button>
          )}

          {goal.status === 'paused' && (
            <button
              onClick={() => handleStatusChange('active')}
              className="px-3 py-2 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-colors text-sm"
            >
              Resume
            </button>
          )}
        </div>

        {/* Last Update */}
        {goal.last_progress_update && (
          <div className="mt-4 pt-3 border-t border-slate-600/50 text-xs text-slate-500">
            Last updated: {new Date(goal.last_progress_update).toLocaleDateString()}
          </div>
        )}
      </div>

      {/* Progress Update Modal */}
      {showProgressModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-xl border border-slate-600 max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-white mb-4">Update Progress: {goal.title}</h3>

            {/* Progress Value */}
            {goal.is_measurable && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Current Progress {goal.measurement_unit && `(${goal.measurement_unit})`}
                </label>
                <input
                  type="number"
                  value={progressValue}
                  onChange={(e) => setProgressValue(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                  min="0"
                  max={goal.target_value}
                />
                {goal.target_value && (
                  <div className="mt-1 text-xs text-slate-400">
                    Target: {goal.target_value} {goal.measurement_unit}
                  </div>
                )}
              </div>
            )}

            {/* Progress Note */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Progress Note (Optional)
              </label>
              <textarea
                value={progressNote}
                onChange={(e) => setProgressNote(e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white resize-none"
                rows={3}
                placeholder="What progress have you made? Any challenges or wins?"
              />
            </div>

            {/* Mood Rating */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                How are you feeling about this goal? (Optional)
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(rating => (
                  <button
                    key={rating}
                    onClick={() => setMoodRating(rating === moodRating ? undefined : rating)}
                    className={`w-8 h-8 rounded-full border-2 transition-colors ${
                      moodRating === rating
                        ? 'border-blue-400 bg-blue-400/20 text-blue-300'
                        : 'border-slate-600 text-slate-400 hover:border-slate-500'
                    }`}
                  >
                    {rating}
                  </button>
                ))}
              </div>
              <div className="mt-1 text-xs text-slate-400">
                1 = Frustrated, 5 = Excited
              </div>
            </div>

            {/* Confidence Rating */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                How confident are you about achieving this goal? (Optional)
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(rating => (
                  <button
                    key={rating}
                    onClick={() => setConfidenceRating(rating === confidenceRating ? undefined : rating)}
                    className={`w-8 h-8 rounded-full border-2 transition-colors ${
                      confidenceRating === rating
                        ? 'border-green-400 bg-green-400/20 text-green-300'
                        : 'border-slate-600 text-slate-400 hover:border-slate-500'
                    }`}
                  >
                    {rating}
                  </button>
                ))}
              </div>
              <div className="mt-1 text-xs text-slate-400">
                1 = Not confident, 5 = Very confident
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowProgressModal(false)}
                className="flex-1 px-4 py-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleProgressUpdate}
                disabled={updating || (!progressValue && progressValue !== 0)}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {updating ? 'Updating...' : 'Update Progress'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}