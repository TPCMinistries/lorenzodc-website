'use client';

import { useState } from 'react';
import { Goal, GoalTrackingService } from '../../lib/services/goal-tracking-v2';

interface CreateGoalModalProps {
  onClose: () => void;
  onGoalCreated: () => void;
}

export default function CreateGoalModal({ onClose, onGoalCreated }: CreateGoalModalProps) {
  const [formData, setFormData] = useState<Partial<Goal>>({
    title: '',
    description: '',
    category: 'personal',
    priority: 'medium',
    goal_type: 'outcome',
    is_measurable: false,
    measurement_unit: '',
    target_value: undefined,
    target_date: '',
    why_important: '',
    success_criteria: [],
    potential_obstacles: []
  });

  const [successCriteria, setSuccessCriteria] = useState<string[]>(['']);
  const [obstacles, setObstacles] = useState<string[]>(['']);
  const [creating, setCreating] = useState(false);

  const handleInputChange = (field: keyof Goal, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addSuccessCriterion = () => {
    setSuccessCriteria(prev => [...prev, '']);
  };

  const updateSuccessCriterion = (index: number, value: string) => {
    setSuccessCriteria(prev => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  const removeSuccessCriterion = (index: number) => {
    setSuccessCriteria(prev => prev.filter((_, i) => i !== index));
  };

  const addObstacle = () => {
    setObstacles(prev => [...prev, '']);
  };

  const updateObstacle = (index: number, value: string) => {
    setObstacles(prev => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  const removeObstacle = (index: number) => {
    setObstacles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title?.trim()) return;

    setCreating(true);
    try {
      const goalData: Partial<Goal> = {
        ...formData,
        success_criteria: successCriteria.filter(c => c.trim()),
        potential_obstacles: obstacles.filter(o => o.trim())
      };

      const goalId = await GoalTrackingService.createGoal(goalData);

      if (goalId) {
        // Trigger goal creation email automation
        await GoalTrackingService.triggerGoalEmailAutomation(
          goalId,
          'goal_created',
          {
            goal_title: formData.title,
            category: formData.category,
            target_date: formData.target_date
          }
        );

        onGoalCreated();
      }
    } catch (error) {
      console.error('Error creating goal:', error);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-800 rounded-xl border border-slate-600 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-600">
          <h2 className="text-2xl font-bold text-white">Create New Goal</h2>
          <p className="text-slate-400 mt-1">Set yourself up for success with a clear, actionable goal</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Basic Information</h3>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Goal Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 focus:outline-none"
                placeholder="e.g., Learn AI prompt engineering"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Description (Optional)
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 focus:outline-none resize-none"
                rows={3}
                placeholder="Provide more context about what you want to achieve..."
              />
            </div>

            {/* Category and Priority */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 focus:outline-none"
                >
                  <option value="personal">Personal</option>
                  <option value="professional">Professional</option>
                  <option value="health">Health & Fitness</option>
                  <option value="learning">Learning & Education</option>
                  <option value="business">Business</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Priority
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => handleInputChange('priority', e.target.value as Goal['priority'])}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 focus:outline-none"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
            </div>

            {/* Goal Type */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Goal Type
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['outcome', 'process', 'habit'] as const).map(type => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handleInputChange('goal_type', type)}
                    className={`p-3 rounded-lg border-2 transition-colors text-sm ${
                      formData.goal_type === type
                        ? 'border-blue-400 bg-blue-400/20 text-blue-300'
                        : 'border-slate-600 text-slate-400 hover:border-slate-500'
                    }`}
                  >
                    <div className="font-medium capitalize">{type}</div>
                    <div className="text-xs mt-1">
                      {type === 'outcome' && 'End result focused'}
                      {type === 'process' && 'Activity focused'}
                      {type === 'habit' && 'Routine building'}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Measurement */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Measurement</h3>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="is_measurable"
                checked={formData.is_measurable}
                onChange={(e) => handleInputChange('is_measurable', e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 rounded focus:ring-blue-500"
              />
              <label htmlFor="is_measurable" className="text-slate-300">
                This goal has measurable progress
              </label>
            </div>

            {formData.is_measurable && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Target Value
                  </label>
                  <input
                    type="number"
                    value={formData.target_value || ''}
                    onChange={(e) => handleInputChange('target_value', e.target.value ? Number(e.target.value) : undefined)}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 focus:outline-none"
                    placeholder="e.g., 50"
                    min="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Unit of Measurement
                  </label>
                  <input
                    type="text"
                    value={formData.measurement_unit}
                    onChange={(e) => handleInputChange('measurement_unit', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 focus:outline-none"
                    placeholder="e.g., prompts, hours, pounds"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Timeline */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Timeline</h3>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Target Completion Date (Optional)
              </label>
              <input
                type="date"
                value={formData.target_date}
                onChange={(e) => handleInputChange('target_date', e.target.value)}
                className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 focus:outline-none"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>

          {/* Motivation */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Motivation & Planning</h3>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Why is this goal important to you?
              </label>
              <textarea
                value={formData.why_important}
                onChange={(e) => handleInputChange('why_important', e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 focus:outline-none resize-none"
                rows={3}
                placeholder="This motivation will help you stay committed when things get tough..."
              />
            </div>

            {/* Success Criteria */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Success Criteria (What does success look like?)
              </label>
              <div className="space-y-2">
                {successCriteria.map((criterion, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={criterion}
                      onChange={(e) => updateSuccessCriterion(index, e.target.value)}
                      className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 focus:outline-none"
                      placeholder="e.g., Can write effective prompts consistently"
                    />
                    {successCriteria.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeSuccessCriterion(index)}
                        className="px-3 py-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addSuccessCriterion}
                  className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                >
                  + Add Success Criterion
                </button>
              </div>
            </div>

            {/* Potential Obstacles */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Potential Obstacles (What might get in the way?)
              </label>
              <div className="space-y-2">
                {obstacles.map((obstacle, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={obstacle}
                      onChange={(e) => updateObstacle(index, e.target.value)}
                      className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 focus:outline-none"
                      placeholder="e.g., Lack of time for practice"
                    />
                    {obstacles.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeObstacle(index)}
                        className="px-3 py-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addObstacle}
                  className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                >
                  + Add Potential Obstacle
                </button>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-6 border-t border-slate-600">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={creating || !formData.title?.trim()}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {creating ? 'Creating Goal...' : 'Create Goal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}