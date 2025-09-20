'use client';

import { useState, useEffect } from 'react';
// import { supabase } from supabase - temporarily disabled for deployment
import { EnterpriseAssessmentService, EnterpriseAssessmentQuestion } from '../lib/services/enterprise-assessment';
import { useRouter } from 'next/navigation';

interface AssessmentStep {
  category: string;
  questions: EnterpriseAssessmentQuestion[];
  title: string;
  description: string;
  icon: string;
}

export default function EnterpriseDiagnosticPage() {
  const router = useRouter();
  const [sessionId] = useState(() => EnterpriseAssessmentService.generateSessionId());
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const assessmentSteps: AssessmentStep[] = [
    {
      category: 'company_profile',
      title: 'Company Profile',
      description: 'Tell us about your business fundamentals',
      icon: '🏢',
      questions: []
    },
    {
      category: 'team_analysis',
      title: 'Team & Structure Analysis',
      description: 'How your team operates and communicates',
      icon: '👥',
      questions: []
    },
    {
      category: 'process_audit',
      title: 'Process Audit',
      description: 'Identify inefficiencies and bottlenecks',
      icon: '⚙️',
      questions: []
    },
    {
      category: 'ai_readiness',
      title: 'AI Readiness Assessment',
      description: 'Your organization\'s readiness for AI adoption',
      icon: '🤖',
      questions: []
    },
    {
      category: 'roi_inputs',
      title: 'ROI Calculation',
      description: 'Key metrics for calculating your potential savings',
      icon: '💰',
      questions: []
    }
  ];

  useEffect(() => {
    const initializeAssessment = async () => {
      try {
        // Check authentication
        const { data: { user } } = await supabase.auth.getUser();
        setIsAuthenticated(!!user);

        // Load questions and organize by category
        const allQuestions = EnterpriseAssessmentService.getAssessmentQuestions();

        assessmentSteps.forEach(step => {
          step.questions = allQuestions.filter(q => q.category === step.category);
        });

        // Try to load saved progress
        const progress = await EnterpriseAssessmentService.getProgress(sessionId);
        if (progress) {
          setCurrentStep(progress.current_step);
          setResponses(progress.responses);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error initializing enterprise assessment:', error);
        setLoading(false);
      }
    };

    initializeAssessment();
  }, [sessionId]);

  const saveProgress = async () => {
    setSaving(true);
    try {
      await EnterpriseAssessmentService.saveProgress(sessionId, currentStep, responses);
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
        const result = await EnterpriseAssessmentService.submitAssessment(sessionId, responses);
        if (result) {
          router.push(`/enterprise-diagnostic/results?session=${sessionId}`);
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

  const renderQuestion = (question: EnterpriseAssessmentQuestion) => {
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
                      ? 'bg-blue-500 border-blue-400 text-white'
                      : 'border-slate-600 text-slate-400 hover:border-blue-400 hover:text-blue-300'
                  }`}
                >
                  {value}
                </button>
              ))}
            </div>
            <div className="flex justify-between text-xs text-slate-500">
              <span>Strongly Disagree</span>
              <span>Strongly Agree</span>
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
                      ? 'bg-blue-500/20 border-blue-400 text-blue-200'
                      : 'border-slate-600 text-slate-300 hover:border-blue-400 hover:bg-blue-500/10'
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
                  className="flex items-center gap-3 p-3 rounded-lg border border-slate-600 hover:border-blue-400 cursor-pointer transition-colors"
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
                    className="rounded border-slate-600 text-blue-500 focus:ring-blue-500"
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
              className="w-full p-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 min-h-[120px]"
              placeholder="Describe in detail..."
            />
          </div>
        );

      case 'number':
        return (
          <div key={questionId} className="space-y-4">
            <div>
              <h3 className="font-medium text-white mb-2">{question.question_text}</h3>
              {question.question_subtext && (
                <p className="text-sm text-slate-400 mb-4">{question.question_subtext}</p>
              )}
            </div>
            <input
              type="number"
              value={currentValue || ''}
              onChange={(e) => handleResponse(questionId, Number(e.target.value))}
              className="w-full p-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
              placeholder="Enter amount"
            />
          </div>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading enterprise diagnostic...</p>
        </div>
      </div>
    );
  }

  const currentStepData = assessmentSteps[currentStep];
  const progressPercentage = ((currentStep + 1) / assessmentSteps.length) * 100;

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Enterprise AI Diagnostic
          </h1>
          <p className="text-xl text-slate-400">
            Discover your AI transformation potential and ROI opportunities
          </p>
          <p className="text-blue-400 text-sm mt-2">
            ⏱️ 5-7 minutes • 📊 Instant results • 🎯 Custom ROI analysis
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
          <div className="w-full bg-slate-700 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-blue-500 to-cyan-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>

          {/* Step indicators */}
          <div className="flex justify-between mt-4">
            {assessmentSteps.map((step, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm ${
                  index <= currentStep
                    ? 'bg-blue-500 border-blue-400 text-white'
                    : 'border-slate-600 text-slate-400'
                }`}>
                  {index + 1}
                </div>
                <span className={`text-xs mt-1 text-center max-w-16 ${
                  index === currentStep ? 'text-blue-400' : 'text-slate-500'
                }`}>
                  {step.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Current Step */}
        <div className="bg-slate-800 rounded-xl border border-slate-600 p-8 mb-6">
          <div className="flex items-center gap-4 mb-8">
            <span className="text-4xl">{currentStepData.icon}</span>
            <div>
              <h2 className="text-2xl font-semibold text-white">{currentStepData.title}</h2>
              <p className="text-slate-400 text-lg">{currentStepData.description}</p>
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
            className="px-8 py-3 text-slate-400 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            ← Previous
          </button>

          <div className="flex items-center gap-3">
            {saving && (
              <div className="flex items-center gap-2 text-slate-400">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                <span className="text-sm">Saving...</span>
              </div>
            )}
          </div>

          <button
            onClick={nextStep}
            disabled={saving}
            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 disabled:opacity-50 flex items-center gap-2"
          >
            {currentStep === assessmentSteps.length - 1 ? (
              <>
                Generate Report 📊
              </>
            ) : (
              <>
                Next →
              </>
            )}
          </button>
        </div>

        {/* Authentication Note */}
        {!isAuthenticated && (
          <div className="mt-8 p-6 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-400/20 rounded-lg text-center">
            <h3 className="text-blue-300 font-semibold mb-2">
              🎯 Get Your Complete ROI Analysis
            </h3>
            <p className="text-blue-300/80 mb-4">
              Sign up to save your assessment and receive detailed implementation roadmaps, cost-benefit analysis, and personalized recommendations worth $2,500.
            </p>
            <button
              onClick={() => router.push('/signup')}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
            >
              Get Free Account
            </button>
          </div>
        )}

        {/* Value Proposition */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
            <div className="text-2xl mb-2">⚡</div>
            <h4 className="font-semibold text-white mb-1">Instant ROI Analysis</h4>
            <p className="text-slate-400 text-sm">See your potential savings in real-time</p>
          </div>
          <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
            <div className="text-2xl mb-2">📋</div>
            <h4 className="font-semibold text-white mb-1">90-Day Roadmap</h4>
            <p className="text-slate-400 text-sm">Step-by-step implementation plan</p>
          </div>
          <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
            <div className="text-2xl mb-2">🎯</div>
            <h4 className="font-semibold text-white mb-1">Custom Strategy</h4>
            <p className="text-slate-400 text-sm">Tailored to your business needs</p>
          </div>
        </div>
      </div>
    </div>
  );
}