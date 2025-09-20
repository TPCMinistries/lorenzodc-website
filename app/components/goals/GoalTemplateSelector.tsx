'use client';

import { useState, useEffect } from 'react';
import { GoalTemplate, GoalTrackingService } from '../../lib/services/goal-tracking-v2';

interface GoalTemplateSelectorProps {
  onClose: () => void;
  onGoalCreated: () => void;
}

export default function GoalTemplateSelector({ onClose, onGoalCreated }: GoalTemplateSelectorProps) {
  const [templates, setTemplates] = useState<GoalTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState<GoalTemplate | null>(null);
  const [customTitle, setCustomTitle] = useState('');
  const [customTargetValue, setCustomTargetValue] = useState<number | undefined>();
  const [customTargetDate, setCustomTargetDate] = useState('');
  const [creating, setCreating] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string | 'all'>('all');

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    setLoading(true);
    try {
      const templatesData = await GoalTrackingService.getGoalTemplates();
      setTemplates(templatesData);
    } catch (error) {
      console.error('Error loading templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectTemplate = (template: GoalTemplate) => {
    setSelectedTemplate(template);
    setCustomTitle(template.title);
    setCustomTargetValue(template.template_data?.target_value);

    // Set default target date based on estimated duration
    if (template.estimated_duration_days) {
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() + template.estimated_duration_days);
      setCustomTargetDate(targetDate.toISOString().split('T')[0]);
    }
  };

  const handleCreateFromTemplate = async () => {
    if (!selectedTemplate) return;

    setCreating(true);
    try {
      const goalId = await GoalTrackingService.createGoalFromTemplate(
        selectedTemplate.id,
        customTitle !== selectedTemplate.title ? customTitle : undefined,
        customTargetValue,
        customTargetDate || undefined
      );

      if (goalId) {
        // Trigger goal creation email automation
        await GoalTrackingService.triggerGoalEmailAutomation(
          goalId,
          'goal_created',
          {
            template_used: selectedTemplate.title,
            goal_title: customTitle,
            category: selectedTemplate.category,
            target_date: customTargetDate
          }
        );

        onGoalCreated();
      }
    } catch (error) {
      console.error('Error creating goal from template:', error);
    } finally {
      setCreating(false);
    }
  };

  const filteredTemplates = templates.filter(template => {
    if (filterCategory !== 'all' && template.category !== filterCategory) return false;
    return true;
  });

  const categories = Array.from(new Set(templates.map(t => t.category).filter(Boolean)));

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-400 bg-green-500/20';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20';
      case 'advanced': return 'text-orange-400 bg-orange-500/20';
      case 'expert': return 'text-red-400 bg-red-500/20';
      default: return 'text-slate-400 bg-slate-500/20';
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
        <div className="bg-slate-800 rounded-xl border border-slate-600 p-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span className="ml-3 text-slate-400">Loading templates...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-800 rounded-xl border border-slate-600 max-w-6xl w-full max-h-[90vh] overflow-hidden flex">
        {/* Template Selection */}
        <div className={`${selectedTemplate ? 'w-1/2' : 'w-full'} border-r border-slate-600`}>
          <div className="p-6 border-b border-slate-600">
            <h2 className="text-2xl font-bold text-white">Goal Templates</h2>
            <p className="text-slate-400 mt-1">Choose a proven template to jumpstart your goal</p>
          </div>

          {/* Filter */}
          <div className="p-4 border-b border-slate-600">
            <div className="flex items-center gap-4">
              <label className="text-sm text-slate-400">Category:</label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-1 bg-slate-700 border border-slate-600 rounded text-slate-300 text-sm"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category} className="capitalize">
                    {category}
                  </option>
                ))}
              </select>
              <div className="ml-auto text-sm text-slate-400">
                {filteredTemplates.length} templates
              </div>
            </div>
          </div>

          {/* Templates List */}
          <div className="overflow-y-auto max-h-[calc(90vh-200px)] p-4">
            <div className="space-y-3">
              {filteredTemplates.map(template => (
                <button
                  key={template.id}
                  onClick={() => handleSelectTemplate(template)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
                    selectedTemplate?.id === template.id
                      ? 'border-blue-400 bg-blue-500/10'
                      : 'border-slate-600 hover:border-slate-500 bg-slate-700/30'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{GoalTrackingService.getCategoryIcon(template.category || 'personal')}</span>
                      <h3 className="font-semibold text-white">{template.title}</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-1 rounded ${getDifficultyColor(template.difficulty_level)}`}>
                        {template.difficulty_level}
                      </span>
                      <span className="text-xs text-slate-400">{template.usage_count} uses</span>
                    </div>
                  </div>

                  {template.description && (
                    <p className="text-slate-300 text-sm mb-2 line-clamp-2">
                      {template.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="capitalize">{template.category}</span>
                    {template.estimated_duration_days && (
                      <span>{template.estimated_duration_days} days</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Close button when no template selected */}
          {!selectedTemplate && (
            <div className="p-4 border-t border-slate-600">
              <button
                onClick={onClose}
                className="w-full px-4 py-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* Template Customization */}
        {selectedTemplate && (
          <div className="w-1/2 flex flex-col">
            <div className="p-6 border-b border-slate-600">
              <h3 className="text-xl font-bold text-white">Customize Your Goal</h3>
              <p className="text-slate-400 mt-1">Adapt this template to your needs</p>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Template Details */}
              <div className="p-4 bg-slate-700/30 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{GoalTrackingService.getCategoryIcon(selectedTemplate.category || 'personal')}</span>
                  <h4 className="font-semibold text-white">{selectedTemplate.title}</h4>
                </div>
                {selectedTemplate.description && (
                  <p className="text-slate-300 text-sm">{selectedTemplate.description}</p>
                )}
              </div>

              {/* Customization Form */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Goal Title
                  </label>
                  <input
                    type="text"
                    value={customTitle}
                    onChange={(e) => setCustomTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 focus:outline-none"
                  />
                </div>

                {selectedTemplate.template_data?.target_value && (
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Target Value {selectedTemplate.template_data.measurement_unit && `(${selectedTemplate.template_data.measurement_unit})`}
                    </label>
                    <input
                      type="number"
                      value={customTargetValue || ''}
                      onChange={(e) => setCustomTargetValue(e.target.value ? Number(e.target.value) : undefined)}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 focus:outline-none"
                      min="1"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Target Completion Date
                  </label>
                  <input
                    type="date"
                    value={customTargetDate}
                    onChange={(e) => setCustomTargetDate(e.target.value)}
                    className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 focus:outline-none"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>

              {/* Template Features */}
              <div className="space-y-4">
                <h4 className="font-semibold text-white">What's Included:</h4>

                {selectedTemplate.template_data?.success_criteria && (
                  <div>
                    <h5 className="text-sm font-medium text-slate-300 mb-2">Success Criteria:</h5>
                    <ul className="space-y-1">
                      {selectedTemplate.template_data.success_criteria.map((criterion: string, index: number) => (
                        <li key={index} className="text-sm text-slate-400 flex items-center gap-2">
                          <span className="text-green-400">✓</span>
                          {criterion}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedTemplate.template_data?.default_milestones && (
                  <div>
                    <h5 className="text-sm font-medium text-slate-300 mb-2">Milestone Plan:</h5>
                    <ul className="space-y-1">
                      {selectedTemplate.template_data.default_milestones.map((milestone: any, index: number) => (
                        <li key={index} className="text-sm text-slate-400 flex items-center gap-2">
                          <span className="text-blue-400">{milestone.percentage}%</span>
                          {milestone.title}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedTemplate.accountability_suggestions.length > 0 && (
                  <div>
                    <h5 className="text-sm font-medium text-slate-300 mb-2">Recommended Accountability:</h5>
                    <ul className="space-y-1">
                      {selectedTemplate.accountability_suggestions.map((suggestion, index) => (
                        <li key={index} className="text-sm text-slate-400 flex items-center gap-2">
                          <span className="text-purple-400">•</span>
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="p-3 bg-slate-900/50 rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <span className={`px-2 py-1 rounded text-xs ${getDifficultyColor(selectedTemplate.difficulty_level)}`}>
                      {selectedTemplate.difficulty_level}
                    </span>
                    {selectedTemplate.estimated_duration_days && (
                      <span className="text-slate-400">
                        ~{selectedTemplate.estimated_duration_days} days
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="p-6 border-t border-slate-600">
              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedTemplate(null)}
                  className="flex-1 px-4 py-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors"
                >
                  Back to Templates
                </button>
                <button
                  onClick={handleCreateFromTemplate}
                  disabled={creating || !customTitle.trim()}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {creating ? 'Creating Goal...' : 'Create Goal'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}