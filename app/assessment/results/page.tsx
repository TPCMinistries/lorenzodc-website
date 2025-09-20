'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
// import { supabase } from supabase - temporarily disabled for deployment
import { AssessmentService, AssessmentResult, AssessmentInsights } from '../../lib/services/assessment';

function AssessmentResultsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get('session');

  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [insights, setInsights] = useState<AssessmentInsights | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  useEffect(() => {
    const loadResults = async () => {
      if (!sessionId) {
        router.push('/assessment');
        return;
      }

      try {
        // Check authentication
        const { data: { user } } = await supabase.auth.getUser();
        setIsAuthenticated(!!user);

        // Load assessment result
        const assessmentResult = await AssessmentService.getAssessmentResult(sessionId);
        if (!assessmentResult) {
          router.push('/assessment');
          return;
        }

        setResult(assessmentResult);

        // Load insights if available
        if (assessmentResult.id) {
          const assessmentInsights = await AssessmentService.getAssessmentInsights(assessmentResult.id);
          setInsights(assessmentInsights);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error loading assessment results:', error);
        setLoading(false);
      }
    };

    loadResults();
  }, [sessionId, router]);

  const handleUpgradeClick = () => {
    setShowUpgradeModal(true);
  };

  const calculateOverallScore = () => {
    if (!result) return 0;
    const scores = Object.values(result.life_scores);
    const total = scores.reduce((sum, score) => sum + score, 0);
    return Math.round((total / scores.length) * 10) / 10;
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-emerald-400';
    if (score >= 6) return 'text-yellow-400';
    if (score >= 4) return 'text-orange-400';
    return 'text-red-400';
  };

  const getScoreGradient = (score: number) => {
    if (score >= 8) return 'from-emerald-500 to-green-500';
    if (score >= 6) return 'from-yellow-500 to-orange-500';
    if (score >= 4) return 'from-orange-500 to-red-500';
    return 'from-red-500 to-pink-500';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-slate-400">Analyzing your results...</p>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Assessment Not Found</h1>
          <p className="text-slate-400 mb-6">We couldn't find your assessment results.</p>
          <button
            onClick={() => router.push('/assessment')}
            className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
          >
            Take Assessment
          </button>
        </div>
      </div>
    );
  }

  const overallScore = calculateOverallScore();
  const upgradeHooks = AssessmentService.generateUpgradeHooks(result, insights);

  return (
    <div className="min-h-screen bg-slate-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Your Personal Assessment Results
          </h1>
          <p className="text-slate-400">
            Discover insights about your life and get personalized recommendations
          </p>
        </div>

        {/* Overall Score */}
        <div className="bg-slate-800 rounded-xl border border-slate-600 p-6 mb-6 text-center">
          <h2 className="text-xl font-semibold text-white mb-4">Overall Life Satisfaction</h2>
          <div className="relative w-32 h-32 mx-auto mb-4">
            <svg className="w-32 h-32 transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="56"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                className="text-slate-700"
              />
              <circle
                cx="64"
                cy="64"
                r="56"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${(overallScore / 10) * 351.86} 351.86`}
                className={`${getScoreColor(overallScore)}`}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`text-3xl font-bold ${getScoreColor(overallScore)}`}>
                {overallScore}
              </span>
            </div>
          </div>
          <p className="text-slate-400">Out of 10</p>
        </div>

        {/* Life Areas Breakdown */}
        <div className="bg-slate-800 rounded-xl border border-slate-600 p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-6">Life Areas Breakdown</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(result.life_scores).map(([area, score]) => (
              <div key={area} className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                <span className="text-slate-300 capitalize">
                  {area.replace('_', ' ')}
                </span>
                <div className="flex items-center gap-3">
                  <div className="w-24 bg-slate-600 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full bg-gradient-to-r ${getScoreGradient(score)}`}
                      style={{ width: `${(score / 10) * 100}%` }}
                    />
                  </div>
                  <span className={`font-semibold w-8 ${getScoreColor(score)}`}>
                    {score}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Insights */}
        {insights && (
          <div className="bg-slate-800 rounded-xl border border-slate-600 p-6 mb-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              🤖 AI-Generated Insights
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-emerald-400 mb-2">Your Strongest Area</h3>
                <p className="text-slate-300 capitalize">{insights.strongest_area}</p>
              </div>
              <div>
                <h3 className="font-medium text-orange-400 mb-2">Area for Growth</h3>
                <p className="text-slate-300 capitalize">{insights.weakest_area}</p>
              </div>
              <div>
                <h3 className="font-medium text-blue-400 mb-2">Improvement Potential</h3>
                <p className="text-slate-300">{insights.improvement_potential}</p>
              </div>
              <div>
                <h3 className="font-medium text-purple-400 mb-2">AI Coaching Readiness</h3>
                <p className="text-slate-300">{insights.ai_coaching_readiness}</p>
              </div>
            </div>
          </div>
        )}

        {/* Goals & Challenges */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Top Goals */}
          {result.top_goals.length > 0 && (
            <div className="bg-slate-800 rounded-xl border border-slate-600 p-6">
              <h2 className="text-xl font-semibold text-white mb-4">🎯 Your Top Goals</h2>
              <div className="space-y-3">
                {result.top_goals.slice(0, 3).map((goal, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <span className="text-purple-400 font-bold">{index + 1}.</span>
                    <span className="text-slate-300">{goal}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Biggest Obstacles */}
          {result.biggest_obstacles.length > 0 && (
            <div className="bg-slate-800 rounded-xl border border-slate-600 p-6">
              <h2 className="text-xl font-semibold text-white mb-4">⚠️ Key Obstacles</h2>
              <div className="space-y-3">
                {result.biggest_obstacles.slice(0, 3).map((obstacle, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <span className="text-orange-400">•</span>
                    <span className="text-slate-300">{obstacle}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Upgrade Options */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Subscription Option */}
          <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-400/20 rounded-xl p-6">
            <div className="text-center">
              <h2 className="text-xl font-bold text-white mb-2">Start AI Coaching</h2>
              <div className="text-3xl font-bold text-purple-400 mb-2">$19<span className="text-lg text-slate-400">/month</span></div>
              <p className="text-slate-300 mb-4">{upgradeHooks.primary}</p>

              <div className="space-y-3 mb-6">
                {upgradeHooks.features.slice(0, 4).map((feature, index) => (
                  <div key={index} className="flex items-start gap-2 text-sm text-slate-300">
                    <span className="text-purple-400 mt-0.5">✓</span>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={handleUpgradeClick}
                className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
              >
                Start Coaching ($19/mo)
              </button>

              <p className="text-xs text-purple-400/70 mt-3">
                $1 less than ChatGPT Plus • Remembers everything
              </p>
            </div>
          </div>

          {/* One-Time Strategy Session */}
          <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-400/20 rounded-xl p-6">
            <div className="text-center">
              <h2 className="text-xl font-bold text-white mb-2">Personal Strategy Session</h2>
              <div className="text-3xl font-bold text-emerald-400 mb-2">$197<span className="text-lg text-slate-400"> one-time</span></div>
              <p className="text-slate-300 mb-4">Deep-dive assessment with personalized roadmap</p>

              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-2 text-sm text-slate-300">
                  <span className="text-emerald-400 mt-0.5">✓</span>
                  <span>1-hour strategy call with AI expert</span>
                </div>
                <div className="flex items-start gap-2 text-sm text-slate-300">
                  <span className="text-emerald-400 mt-0.5">✓</span>
                  <span>Custom 90-day action plan</span>
                </div>
                <div className="flex items-start gap-2 text-sm text-slate-300">
                  <span className="text-emerald-400 mt-0.5">✓</span>
                  <span>Personalized tool recommendations</span>
                </div>
                <div className="flex items-start gap-2 text-sm text-slate-300">
                  <span className="text-emerald-400 mt-0.5">✓</span>
                  <span>Written strategic assessment report</span>
                </div>
              </div>

              <button className="w-full px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg font-semibold hover:from-emerald-600 hover:to-teal-600 transition-all duration-200">
                Book Strategy Session
              </button>

              <p className="text-xs text-emerald-400/70 mt-3">
                One-time investment • Immediate value
              </p>
            </div>
          </div>
        </div>

        {/* Try Free First */}
        <div className="text-center mb-6">
          <button
            onClick={() => router.push('/chat')}
            className="px-8 py-3 bg-slate-700 border border-slate-600 text-white rounded-lg hover:bg-slate-600 transition-colors"
          >
            Try Free Chat First (15 messages/month)
          </button>
        </div>

        {/* Action Items */}
        <div className="bg-slate-800 rounded-xl border border-slate-600 p-6">
          <h2 className="text-xl font-semibold text-white mb-4">🚀 Recommended Next Steps</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <span className="text-purple-400 font-bold">1.</span>
              <div>
                <span className="text-white font-medium">Start with your free chat sessions</span>
                <p className="text-slate-400 text-sm">Get familiar with AI coaching using your 15 free messages</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-purple-400 font-bold">2.</span>
              <div>
                <span className="text-white font-medium">Focus on your weakest area first</span>
                <p className="text-slate-400 text-sm">
                  Start with {insights?.weakest_area || 'the area that scored lowest'} for maximum impact
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-purple-400 font-bold">3.</span>
              <div>
                <span className="text-white font-medium">Set up goal tracking</span>
                <p className="text-slate-400 text-sm">Upgrade to Catalyst Plus for automated progress tracking</p>
              </div>
            </div>
          </div>
        </div>

        {/* Authentication Prompt */}
        {!isAuthenticated && (
          <div className="mt-6 p-4 bg-blue-500/10 border border-blue-400/20 rounded-lg text-center">
            <p className="text-blue-300 mb-4">
              💡 Create an account to save your assessment results and get personalized coaching
            </p>
            <button
              onClick={() => router.push('/signup')}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Sign Up Free
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AssessmentResultsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    }>
      <AssessmentResultsContent />
    </Suspense>
  );
}