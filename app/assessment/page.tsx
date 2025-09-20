'use client';

import { useState, useEffect } from 'react';
// Supabase temporarily disabled for deployment
import { AssessmentService, AssessmentQuestion } from '../lib/services/assessment';
import { useRouter } from 'next/navigation';

interface AssessmentStep {
  category: string;
  questions: AssessmentQuestion[];
  title: string;
  description: string;
  icon: string;
}

export default function AssessmentPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [sessionId] = useState(() => AssessmentService.generateSessionId());
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [questions, setQuestions] = useState<Record<string, AssessmentQuestion[]>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const assessmentSteps: AssessmentStep[] = [
    {
      category: 'career',
      title: 'Career & Professional Life',
      description: 'Your work satisfaction and professional goals',
      icon: '💼',
      questions: []
    },
    {
      category: 'health',
      title: 'Health & Energy',
      description: 'Your physical wellbeing and vitality',
      icon: '🏃‍♀️',
      questions: []
    },
    {
      category: 'relationships',
      title: 'Relationships & Social Life',
      description: 'Your connections with family, friends, and community',
      icon: '👥',
      questions: []
    },
    {
      category: 'personal_development',
      title: 'Personal Growth',
      description: 'Your learning and self-improvement journey',
      icon: '🌱',
      questions: []
    },
    {
      category: 'financial',
      title: 'Financial Security',
      description: 'Your money management and financial future',
      icon: '💰',
      questions: []
    },
    {
      category: 'productivity',
      title: 'Daily Productivity',
      description: 'How you manage time and tasks',
      icon: '⚡',
      questions: []
    },
    {
      category: 'creativity',
      title: 'Creative & Personal Projects',
      description: 'Your hobbies and creative pursuits',
      icon: '🎨',
      questions: []
    },
    {
      category: 'ai_readiness',
      title: 'AI & Technology Readiness',
      description: 'Your comfort with AI tools and automation',
      icon: '🤖',
      questions: []
    },
    {
      category: 'goal_setting',
      title: 'Goal Setting & Priorities',
      description: 'Your approach to setting and achieving goals',
      icon: '🎯',
      questions: []
    }
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const initializeAssessment = async () => {
      try {
        // Check authentication
        const { data: { user } } = await supabase.auth.getUser();
        setIsAuthenticated(!!user);

        // Load questions
        const questionData = await AssessmentService.getAssessmentQuestions();
        setQuestions(questionData);

        // Populate questions in steps
        assessmentSteps.forEach(step => {
          step.questions = questionData[step.category] || [];
        });

        // Try to load saved progress
        const progress = await AssessmentService.getProgress(sessionId);
        if (progress) {
          setCurrentStep(progress.current_step);
          setResponses(progress.responses);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error initializing assessment:', error);
        setLoading(false);
      }
    };

    initializeAssessment();
  }, [sessionId]);

  const saveProgress = async () => {
    setSaving(true);
    try {
      await AssessmentService.saveProgress(sessionId, currentStep, responses);
    } catch (error) {
      console.error('Error saving progress:', error);
    }
    setSaving(false);
  };

  const handleResponse = (questionId: string, value: any) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const nextStep = async () => {
    await saveProgress();

    if (currentStep < assessmentSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Submit completed assessment
      setSaving(true);
      try {
        const result = await AssessmentService.submitAssessment(sessionId, responses);
        if (result) {
          router.push(`/assessment/results?session=${sessionId}`);
        }
      } catch (error) {
        console.error('Error submitting assessment:', error);
      }
      setSaving(false);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderQuestion = (question: AssessmentQuestion) => {
    const questionId = question.id;
    const currentValue = responses[questionId];

    switch (question.question_type) {
      case 'rating':
        return (
          <div key={questionId} className="space-y-4">
            <div>
              <h3 className="font-medium text-white mb-2">{question.question_text}</h3>
              {question.question_subtext && (
                <p className="text-sm text-slate-400 mb-4">{question.question_subtext}</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(value => (
                <button
                  key={value}
                  onClick={() => handleResponse(questionId, value)}
                  className={`w-10 h-10 rounded-full border-2 transition-all ${
                    currentValue === value
                      ? 'bg-purple-500 border-purple-400 text-white'
                      : 'border-slate-600 text-slate-400 hover:border-purple-400 hover:text-purple-300'
                  }`}
                >
                  {value}
                </button>
              ))}
            </div>
            <div className="flex justify-between text-xs text-slate-500">
              <span>Very Low</span>
              <span>Very High</span>
            </div>
          </div>
        );

      case 'multiple_choice':
        const options = question.options || [];
        return (
          <div key={questionId} className="space-y-4">
            <div>
              <h3 className="font-medium text-white mb-2">{question.question_text}</h3>
              {question.question_subtext && (
                <p className="text-sm text-slate-400 mb-4">{question.question_subtext}</p>
              )}
            </div>
            <div className="space-y-2">
              {options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleResponse(questionId, option)}
                  className={`w-full p-3 text-left rounded-lg border transition-all ${
                    currentValue === option
                      ? 'bg-purple-500/20 border-purple-400 text-purple-200'
                      : 'border-slate-600 text-slate-300 hover:border-purple-400 hover:bg-purple-500/10'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        );

      case 'checkbox':
        const checkboxOptions = question.options || [];
        const selectedValues = Array.isArray(currentValue) ? currentValue : [];
        return (
          <div key={questionId} className="space-y-4">
            <div>
              <h3 className="font-medium text-white mb-2">{question.question_text}</h3>
              {question.question_subtext && (
                <p className="text-sm text-slate-400 mb-4">{question.question_subtext}</p>
              )}
            </div>
            <div className="space-y-2">
              {checkboxOptions.map((option, index) => (
                <label
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-lg border border-slate-600 hover:border-purple-400 cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedValues.includes(option)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        handleResponse(questionId, [...selectedValues, option]);
                      } else {
                        handleResponse(questionId, selectedValues.filter(v => v !== option));
                      }
                    }}
                    className="rounded border-slate-600 text-purple-500 focus:ring-purple-500"
                  />
                  <span className="text-slate-300">{option}</span>
                </label>
              ))}
            </div>
          </div>
        );

      case 'text':
        return (
          <div key={questionId} className="space-y-4">
            <div>
              <h3 className="font-medium text-white mb-2">{question.question_text}</h3>
              {question.question_subtext && (
                <p className="text-sm text-slate-400 mb-4">{question.question_subtext}</p>
              )}
            </div>
            <textarea
              value={currentValue || ''}
              onChange={(e) => handleResponse(questionId, e.target.value)}
              className="w-full p-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-purple-400 focus:ring-1 focus:ring-purple-400 min-h-[120px]"
              placeholder="Share your thoughts..."
            />
          </div>
        );

      default:
        return null;
    }
  };

  // Show loading state until client-side hydration complete
  if (!mounted) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading your personalized assessment...</p>
        </div>
      </div>
    );
  }

  const currentStepData = assessmentSteps[currentStep];
  const progressPercentage = ((currentStep + 1) / assessmentSteps.length) * 100;

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Personal AI Assessment
          </h1>
          <p className="text-slate-400">
            Discover your potential and get personalized coaching insights
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-400">
              Step {currentStep + 1} of {assessmentSteps.length}
            </span>
            <span className="text-sm text-slate-400">
              {Math.round(progressPercentage)}% Complete
            </span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Current Step */}
        <div className="bg-slate-800 rounded-xl border border-slate-600 p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl">{currentStepData.icon}</span>
            <div>
              <h2 className="text-xl font-semibold text-white">{currentStepData.title}</h2>
              <p className="text-slate-400">{currentStepData.description}</p>
            </div>
          </div>

          <div className="space-y-8">
            {currentStepData.questions.map(question => renderQuestion(question))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className="px-6 py-3 text-slate-400 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Previous
          </button>

          <div className="flex items-center gap-2">
            {saving && (
              <div className="flex items-center gap-2 text-slate-400">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-500"></div>
                <span className="text-sm">Saving...</span>
              </div>
            )}
          </div>

          <button
            onClick={nextStep}
            disabled={saving}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-colors disabled:opacity-50"
          >
            {currentStep === assessmentSteps.length - 1 ? 'Complete Assessment' : 'Next →'}
          </button>
        </div>

        {/* Authentication Note */}
        {!isAuthenticated && (
          <div className="mt-6 p-4 bg-blue-500/10 border border-blue-400/20 rounded-lg">
            <p className="text-blue-300 text-sm text-center">
              💡 Sign up after completing to save your results and get personalized coaching
            </p>
          </div>
        )}
      </div>
    </div>
  );
}