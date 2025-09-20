'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../lib/hooks/useAuth';
import { GoalTrackingService } from '../lib/services/goal-tracking';
import { LIFE_CATEGORIES, COACHING_STYLES } from '../lib/types/coaching';
import type { LifeCategory, CoachingStyle, UserGoal, GoalMilestone } from '../lib/types/coaching';

interface OnboardingData {
  selectedLifeAreas: LifeCategory[];
  goals: Array<{
    category: LifeCategory;
    title: string;
    description: string;
    currentState: number;
    motivation: string;
    obstacles: string;
    successDefinition: string;
    targetDate: string;
    priority: 'low' | 'medium' | 'high';
    milestones: string[];
  }>;
  coachingStyle: CoachingStyle;
  checkInFrequency: 'daily' | 'weekly' | 'monthly';
}

export default function OnboardingPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<OnboardingData>({
    selectedLifeAreas: [],
    goals: [],
    coachingStyle: 'supportive',
    checkInFrequency: 'weekly'
  });
  const [loading, setLoading] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, authLoading, router]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-slate-300">Loading...</div>
        </div>
      </div>
    );
  }

  const totalSteps = 6;

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateData = (updates: Partial<OnboardingData>) => {
    setData(prev => ({ ...prev, ...updates }));
  };

  const completeOnboarding = async () => {
    setLoading(true);
    try {
      // Update user's coaching style
      await GoalTrackingService.updateUserCoachingStyle(data.coachingStyle);

      // Create goals
      for (const goalData of data.goals) {
        const goal = await GoalTrackingService.createGoal({
          title: goalData.title,
          description: goalData.description,
          category: goalData.category,
          target_date: goalData.targetDate,
          priority_level: goalData.priority,
          status: 'active',
          progress_percentage: 0
        });

        // Create milestones for the goal
        if (goal && goalData.milestones.length > 0) {
          for (let i = 0; i < goalData.milestones.length; i++) {
            const milestone = goalData.milestones[i];
            const targetDate = new Date(goalData.targetDate);
            targetDate.setMonth(targetDate.getMonth() - (goalData.milestones.length - i - 1));

            await GoalTrackingService.createMilestone({
              goal_id: goal.id,
              title: milestone,
              target_date: targetDate.toISOString().split('T')[0],
              is_completed: false
            });
          }
        }
      }

      // Create initial coaching session
      await GoalTrackingService.createCoachingSession({
        session_type: 'onboarding',
        conversation_summary: `User completed onboarding and set up ${data.goals.length} goals across ${data.selectedLifeAreas.length} life areas.`,
        topics_discussed: ['goal_setting', 'life_areas', 'coaching_preferences'],
        insights: `User prefers ${data.coachingStyle} coaching style and wants ${data.checkInFrequency} check-ins.`
      });

      router.push('/dashboard');
    } catch (error) {
      console.error('Error completing onboarding:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Header */}
      <div className="border-b border-slate-700/50 bg-slate-900/95 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Catalyst AI Setup
            </h1>
          </div>

          {/* Progress Bar */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-400">Step {currentStep} of {totalSteps}</span>
            <div className="w-32 bg-slate-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-cyan-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {currentStep === 1 && (
          <LifeAreaSelection
            selectedAreas={data.selectedLifeAreas}
            onUpdate={(areas) => updateData({ selectedLifeAreas: areas })}
            onNext={nextStep}
          />
        )}

        {currentStep === 2 && (
          <GoalDefinition
            selectedAreas={data.selectedLifeAreas}
            goals={data.goals}
            onUpdate={(goals) => updateData({ goals })}
            onNext={nextStep}
            onPrev={prevStep}
          />
        )}

        {currentStep === 3 && (
          <CurrentStateAssessment
            goals={data.goals}
            onUpdate={(goals) => updateData({ goals })}
            onNext={nextStep}
            onPrev={prevStep}
          />
        )}

        {currentStep === 4 && (
          <SuccessDefinition
            goals={data.goals}
            onUpdate={(goals) => updateData({ goals })}
            onNext={nextStep}
            onPrev={prevStep}
          />
        )}

        {currentStep === 5 && (
          <TimelineAndMilestones
            goals={data.goals}
            onUpdate={(goals) => updateData({ goals })}
            onNext={nextStep}
            onPrev={prevStep}
          />
        )}

        {currentStep === 6 && (
          <CoachingPreferences
            coachingStyle={data.coachingStyle}
            checkInFrequency={data.checkInFrequency}
            onUpdate={(updates) => updateData(updates)}
            onComplete={completeOnboarding}
            onPrev={prevStep}
            loading={loading}
          />
        )}
      </div>
    </div>
  );
}

// Step 1: Life Area Selection
function LifeAreaSelection({
  selectedAreas,
  onUpdate,
  onNext
}: {
  selectedAreas: LifeCategory[];
  onUpdate: (areas: LifeCategory[]) => void;
  onNext: () => void;
}) {
  const toggleArea = (category: LifeCategory) => {
    if (selectedAreas.includes(category)) {
      onUpdate(selectedAreas.filter(a => a !== category));
    } else {
      onUpdate([...selectedAreas, category]);
    }
  };

  return (
    <div className="text-center">
      <h2 className="text-4xl font-bold mb-4">Let's set up your personal goals</h2>
      <p className="text-xl text-slate-400 mb-8 max-w-2xl mx-auto">
        Choose the life areas where you'd like to focus your energy and create meaningful progress.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {Object.entries(LIFE_CATEGORIES).map(([key, category]) => (
          <button
            key={key}
            onClick={() => toggleArea(key as LifeCategory)}
            className={`p-6 rounded-2xl border-2 transition-all duration-200 text-left group hover:scale-105 ${
              selectedAreas.includes(key as LifeCategory)
                ? 'border-cyan-400 bg-cyan-500/10 shadow-lg shadow-cyan-500/20'
                : 'border-slate-600 hover:border-slate-500 bg-slate-800/50'
            }`}
          >
            <div className="text-3xl mb-3">{category.icon}</div>
            <h3 className="font-semibold text-white mb-2">{category.name}</h3>
            <p className="text-sm text-slate-400 mb-3">{category.description}</p>
            <div className="text-xs text-slate-500">
              Examples: {category.example_goals.slice(0, 2).join(', ')}
            </div>
          </button>
        ))}
      </div>

      <button
        onClick={onNext}
        disabled={selectedAreas.length === 0}
        className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Continue with {selectedAreas.length} area{selectedAreas.length !== 1 ? 's' : ''} →
      </button>
    </div>
  );
}

// Step 2: Goal Definition
function GoalDefinition({
  selectedAreas,
  goals,
  onUpdate,
  onNext,
  onPrev
}: {
  selectedAreas: LifeCategory[];
  goals: OnboardingData['goals'];
  onUpdate: (goals: OnboardingData['goals']) => void;
  onNext: () => void;
  onPrev: () => void;
}) {
  const [currentGoalIndex, setCurrentGoalIndex] = useState(0);

  // Initialize goals for selected areas
  useEffect(() => {
    const initialGoals = selectedAreas.map(area => ({
      category: area,
      title: '',
      description: '',
      currentState: 1,
      motivation: '',
      obstacles: '',
      successDefinition: '',
      targetDate: '',
      priority: 'medium' as const,
      milestones: []
    }));

    if (goals.length === 0) {
      onUpdate(initialGoals);
    }
  }, [selectedAreas, goals.length, onUpdate]);

  const updateCurrentGoal = (updates: Partial<OnboardingData['goals'][0]>) => {
    const newGoals = [...goals];
    newGoals[currentGoalIndex] = { ...newGoals[currentGoalIndex], ...updates };
    onUpdate(newGoals);
  };

  const currentGoal = goals[currentGoalIndex];
  const category = currentGoal ? LIFE_CATEGORIES[currentGoal.category] : null;

  if (!currentGoal || !category) return null;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">
          Define your {category.name} goal
        </h2>
        <p className="text-slate-400">
          Goal {currentGoalIndex + 1} of {goals.length}
        </p>
      </div>

      <div className="bg-slate-800/50 rounded-2xl p-8 space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Goal Title</label>
          <input
            type="text"
            value={currentGoal.title}
            onChange={(e) => updateCurrentGoal({ title: e.target.value })}
            placeholder="e.g., Lose 20 pounds by summer"
            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Detailed Description</label>
          <textarea
            value={currentGoal.description}
            onChange={(e) => updateCurrentGoal({ description: e.target.value })}
            placeholder="What specific outcome do you want to achieve? Be as detailed as possible..."
            rows={4}
            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
          <div className="text-xs text-slate-500 mt-1">
            {currentGoal.description.length}/500 characters
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Priority Level</label>
          <div className="flex gap-3">
            {(['low', 'medium', 'high'] as const).map(priority => (
              <button
                key={priority}
                onClick={() => updateCurrentGoal({ priority })}
                className={`px-4 py-2 rounded-lg capitalize transition-all duration-200 ${
                  currentGoal.priority === priority
                    ? 'bg-cyan-500 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                {priority}
              </button>
            ))}
          </div>
        </div>

        <div className="text-sm text-slate-400 bg-slate-700/50 rounded-lg p-4">
          <strong>Examples for {category.name}:</strong>
          <ul className="mt-2 space-y-1">
            {category.example_goals.map((example, i) => (
              <li key={i}>• {example}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <button
          onClick={onPrev}
          className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition-all duration-200"
        >
          ← Back
        </button>

        <div className="flex gap-3">
          {currentGoalIndex > 0 && (
            <button
              onClick={() => setCurrentGoalIndex(currentGoalIndex - 1)}
              className="px-6 py-3 bg-slate-600 hover:bg-slate-500 text-white rounded-xl transition-all duration-200"
            >
              Previous Goal
            </button>
          )}

          {currentGoalIndex < goals.length - 1 ? (
            <button
              onClick={() => setCurrentGoalIndex(currentGoalIndex + 1)}
              disabled={!currentGoal.title.trim()}
              className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next Goal →
            </button>
          ) : (
            <button
              onClick={onNext}
              disabled={!currentGoal.title.trim()}
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Step 3: Current State Assessment
function CurrentStateAssessment({
  goals,
  onUpdate,
  onNext,
  onPrev
}: {
  goals: OnboardingData['goals'];
  onUpdate: (goals: OnboardingData['goals']) => void;
  onNext: () => void;
  onPrev: () => void;
}) {
  const updateGoal = (index: number, updates: Partial<OnboardingData['goals'][0]>) => {
    const newGoals = [...goals];
    newGoals[index] = { ...newGoals[index], ...updates };
    onUpdate(newGoals);
  };

  const allCompleted = goals.every(goal =>
    goal.currentState > 0 && goal.motivation.trim() && goal.obstacles.trim()
  );

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">Current State & Motivation</h2>
        <p className="text-slate-400">
          Help me understand where you are now and what drives you
        </p>
      </div>

      <div className="space-y-8">
        {goals.map((goal, index) => (
          <div key={index} className="bg-slate-800/50 rounded-2xl p-6">
            <h3 className="text-xl font-semibold mb-4 text-cyan-300">{goal.title}</h3>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-3">
                  Where are you now with this goal? (1-10 scale)
                </label>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-slate-400">Starting out</span>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={goal.currentState}
                    onChange={(e) => updateGoal(index, { currentState: parseInt(e.target.value) })}
                    className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-sm text-slate-400">Very advanced</span>
                  <span className="bg-cyan-500 text-white px-2 py-1 rounded text-sm font-medium min-w-[2rem] text-center">
                    {goal.currentState}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  What's motivating you to achieve this goal?
                </label>
                <textarea
                  value={goal.motivation}
                  onChange={(e) => updateGoal(index, { motivation: e.target.value })}
                  placeholder="Share your deeper motivation - what will achieving this goal mean for you?"
                  rows={3}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  What's been holding you back?
                </label>
                <textarea
                  value={goal.obstacles}
                  onChange={(e) => updateGoal(index, { obstacles: e.target.value })}
                  placeholder="Time constraints, lack of knowledge, motivation issues, etc."
                  rows={2}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between mt-8">
        <button
          onClick={onPrev}
          className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition-all duration-200"
        >
          ← Back
        </button>

        <button
          onClick={onNext}
          disabled={!allCompleted}
          className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue →
        </button>
      </div>
    </div>
  );
}

// Step 4: Success Definition
function SuccessDefinition({
  goals,
  onUpdate,
  onNext,
  onPrev
}: {
  goals: OnboardingData['goals'];
  onUpdate: (goals: OnboardingData['goals']) => void;
  onNext: () => void;
  onPrev: () => void;
}) {
  const updateGoal = (index: number, updates: Partial<OnboardingData['goals'][0]>) => {
    const newGoals = [...goals];
    newGoals[index] = { ...newGoals[index], ...updates };
    onUpdate(newGoals);
  };

  const allCompleted = goals.every(goal => goal.successDefinition.trim());

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">Define Success</h2>
        <p className="text-slate-400">
          How will you know when you've achieved each goal?
        </p>
      </div>

      <div className="space-y-8">
        {goals.map((goal, index) => (
          <div key={index} className="bg-slate-800/50 rounded-2xl p-6">
            <h3 className="text-xl font-semibold mb-4 text-cyan-300">{goal.title}</h3>

            <div>
              <label className="block text-sm font-medium mb-2">
                What does success look like for this goal?
              </label>
              <textarea
                value={goal.successDefinition}
                onChange={(e) => updateGoal(index, { successDefinition: e.target.value })}
                placeholder="Describe specific, measurable outcomes that will indicate you've achieved this goal..."
                rows={4}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />
              <div className="text-xs text-slate-500 mt-2">
                💡 Make it specific and measurable. Examples: "Weigh 150 lbs", "Complete 10K run in under 60 minutes", "Save $5,000"
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between mt-8">
        <button
          onClick={onPrev}
          className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition-all duration-200"
        >
          ← Back
        </button>

        <button
          onClick={onNext}
          disabled={!allCompleted}
          className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue →
        </button>
      </div>
    </div>
  );
}

// Step 5: Timeline & Milestones
function TimelineAndMilestones({
  goals,
  onUpdate,
  onNext,
  onPrev
}: {
  goals: OnboardingData['goals'];
  onUpdate: (goals: OnboardingData['goals']) => void;
  onNext: () => void;
  onPrev: () => void;
}) {
  const updateGoal = (index: number, updates: Partial<OnboardingData['goals'][0]>) => {
    const newGoals = [...goals];
    newGoals[index] = { ...newGoals[index], ...updates };
    onUpdate(newGoals);
  };

  const addMilestone = (goalIndex: number) => {
    const newGoals = [...goals];
    newGoals[goalIndex].milestones.push('');
    onUpdate(newGoals);
  };

  const updateMilestone = (goalIndex: number, milestoneIndex: number, value: string) => {
    const newGoals = [...goals];
    newGoals[goalIndex].milestones[milestoneIndex] = value;
    onUpdate(newGoals);
  };

  const removeMilestone = (goalIndex: number, milestoneIndex: number) => {
    const newGoals = [...goals];
    newGoals[goalIndex].milestones.splice(milestoneIndex, 1);
    onUpdate(newGoals);
  };

  const allCompleted = goals.every(goal => goal.targetDate);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">Timeline & Milestones</h2>
        <p className="text-slate-400">
          Break down your goals into manageable milestones
        </p>
      </div>

      <div className="space-y-8">
        {goals.map((goal, goalIndex) => (
          <div key={goalIndex} className="bg-slate-800/50 rounded-2xl p-6">
            <h3 className="text-xl font-semibold mb-4 text-cyan-300">{goal.title}</h3>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Target completion date
                </label>
                <input
                  type="date"
                  value={goal.targetDate}
                  onChange={(e) => updateGoal(goalIndex, { targetDate: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  className="bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Milestones (optional but recommended)
                </label>
                <div className="space-y-3">
                  {goal.milestones.map((milestone, milestoneIndex) => (
                    <div key={milestoneIndex} className="flex gap-2">
                      <input
                        type="text"
                        value={milestone}
                        onChange={(e) => updateMilestone(goalIndex, milestoneIndex, e.target.value)}
                        placeholder={`Milestone ${milestoneIndex + 1}`}
                        className="flex-1 bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                      />
                      <button
                        onClick={() => removeMilestone(goalIndex, milestoneIndex)}
                        className="px-3 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                      >
                        ✕
                      </button>
                    </div>
                  ))}

                  <button
                    onClick={() => addMilestone(goalIndex)}
                    className="w-full py-2 border-2 border-dashed border-slate-600 rounded-lg text-slate-400 hover:border-slate-500 hover:text-slate-300 transition-colors"
                  >
                    + Add milestone
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between mt-8">
        <button
          onClick={onPrev}
          className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition-all duration-200"
        >
          ← Back
        </button>

        <button
          onClick={onNext}
          disabled={!allCompleted}
          className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue →
        </button>
      </div>
    </div>
  );
}

// Step 6: Coaching Preferences
function CoachingPreferences({
  coachingStyle,
  checkInFrequency,
  onUpdate,
  onComplete,
  onPrev,
  loading
}: {
  coachingStyle: CoachingStyle;
  checkInFrequency: 'daily' | 'weekly' | 'monthly';
  onUpdate: (updates: Partial<OnboardingData>) => void;
  onComplete: () => void;
  onPrev: () => void;
  loading: boolean;
}) {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">Coaching Preferences</h2>
        <p className="text-slate-400">
          How would you like Catalyst AI to support and coach you?
        </p>
      </div>

      <div className="bg-slate-800/50 rounded-2xl p-8 space-y-8">
        <div>
          <label className="block text-sm font-medium mb-4">
            Preferred coaching style
          </label>
          <div className="space-y-3">
            {Object.entries(COACHING_STYLES).map(([key, style]) => (
              <button
                key={key}
                onClick={() => onUpdate({ coachingStyle: key as CoachingStyle })}
                className={`w-full p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                  coachingStyle === key
                    ? 'border-cyan-400 bg-cyan-500/10'
                    : 'border-slate-600 hover:border-slate-500 bg-slate-700/30'
                }`}
              >
                <div className="font-medium text-white mb-1">{style.name}</div>
                <div className="text-sm text-slate-400">{style.description}</div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-4">
            Check-in frequency
          </label>
          <div className="grid grid-cols-3 gap-3">
            {(['daily', 'weekly', 'monthly'] as const).map(frequency => (
              <button
                key={frequency}
                onClick={() => onUpdate({ checkInFrequency: frequency })}
                className={`p-4 rounded-xl border-2 text-center transition-all duration-200 capitalize ${
                  checkInFrequency === frequency
                    ? 'border-cyan-400 bg-cyan-500/10 text-cyan-300'
                    : 'border-slate-600 hover:border-slate-500 text-slate-300'
                }`}
              >
                {frequency}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-slate-700/50 rounded-lg p-4">
          <h4 className="font-medium text-white mb-2">🎉 You're all set!</h4>
          <p className="text-sm text-slate-400">
            Catalyst AI will now provide personalized coaching based on your goals and preferences.
            You can always adjust these settings later in your dashboard.
          </p>
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <button
          onClick={onPrev}
          disabled={loading}
          className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition-all duration-200 disabled:opacity-50"
        >
          ← Back
        </button>

        <button
          onClick={onComplete}
          disabled={loading}
          className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white rounded-xl font-medium transition-all duration-200 disabled:opacity-50 flex items-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Setting up...
            </>
          ) : (
            'Complete Setup 🚀'
          )}
        </button>
      </div>
    </div>
  );
}