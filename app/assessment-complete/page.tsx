'use client';

import { useSearchParams } from 'next/navigation';

export default function AssessmentCompletePage() {
  const searchParams = useSearchParams();
  const overall = searchParams.get('overall');
  const currentState = searchParams.get('current_state');
  const strategyVision = searchParams.get('strategy_vision');
  const teamCapabilities = searchParams.get('team_capabilities');
  const implementation = searchParams.get('implementation');
  const name = searchParams.get('name');

  // Determine readiness level based on overall score
  const getReadinessLevel = (score: number) => {
    if (score >= 80) return { level: 'AI-Ready Leader', color: 'from-green-500 to-emerald-500', description: 'Top 10% - Ready for advanced AI implementations' };
    if (score >= 60) return { level: 'AI-Ready Implementer', color: 'from-blue-500 to-cyan-500', description: 'Solid foundations - Ready for strategic AI implementation' };
    if (score >= 40) return { level: 'AI Explorer', color: 'from-yellow-500 to-orange-500', description: 'Making progress - Need more preparation before major AI initiatives' };
    return { level: 'AI Beginner', color: 'from-red-500 to-pink-500', description: 'Beginning of AI journey - Focus on building foundations' };
  };

  const overallScore = overall ? parseInt(overall) : null;
  const readiness = overallScore ? getReadinessLevel(overallScore) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center space-y-6">

        {/* Success Animation */}
        <div className="relative">
          <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto animate-pulse">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full blur-xl animate-ping"></div>
        </div>

        {/* Instant Results */}
        {overallScore && readiness ? (
          <div className="space-y-6">
            <div className="space-y-4">
              <h1 className="text-2xl font-bold text-white">
                {name ? `${name}, your results are in!` : 'Your results are in!'}
              </h1>

              {/* Overall Score Display */}
              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                <div className="text-center space-y-4">
                  <div className={`text-6xl font-bold bg-gradient-to-r ${readiness.color} bg-clip-text text-transparent`}>
                    {overallScore}%
                  </div>
                  <div>
                    <h2 className={`text-xl font-bold bg-gradient-to-r ${readiness.color} bg-clip-text text-transparent`}>
                      {readiness.level}
                    </h2>
                    <p className="text-slate-300 text-sm mt-2">{readiness.description}</p>
                  </div>
                </div>
              </div>

              {/* Category Breakdown */}
              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 text-left">
                <h3 className="text-lg font-semibold text-cyan-400 mb-4">📊 Your Category Scores</h3>
                <div className="space-y-3">
                  {currentState && (
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Current AI State</span>
                      <span className="text-cyan-400 font-bold">{currentState}%</span>
                    </div>
                  )}
                  {strategyVision && (
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Strategy & Vision</span>
                      <span className="text-cyan-400 font-bold">{strategyVision}%</span>
                    </div>
                  )}
                  {teamCapabilities && (
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Team Capabilities</span>
                      <span className="text-cyan-400 font-bold">{teamCapabilities}%</span>
                    </div>
                  )}
                  {implementation && (
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Implementation Readiness</span>
                      <span className="text-cyan-400 font-bold">{implementation}%</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <p className="text-slate-400 text-sm">
              📧 Your detailed report with personalized recommendations is being sent to your email within 2 minutes.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              Assessment Complete! ✅
            </h1>
            <p className="text-slate-300 text-lg">
              Your personalized AI Readiness Report is being generated and will be in your inbox within 2 minutes.
            </p>
          </div>
        )}

        {/* What's Next */}
        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 text-left">
          <h3 className="text-lg font-semibold text-cyan-400 mb-3">📧 What's in your report:</h3>
          <ul className="space-y-2 text-slate-300">
            <li className="flex items-start">
              <span className="text-green-400 mr-2">•</span>
              Your overall AI readiness score
            </li>
            <li className="flex items-start">
              <span className="text-green-400 mr-2">•</span>
              Detailed breakdown by category
            </li>
            <li className="flex items-start">
              <span className="text-green-400 mr-2">•</span>
              Personalized next steps roadmap
            </li>
            <li className="flex items-start">
              <span className="text-green-400 mr-2">•</span>
              Industry benchmarking data
            </li>
          </ul>
        </div>

        {/* Call to Actions */}
        <div className="space-y-3">
          <a
            href="/chat"
            className="block w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 text-center"
          >
            🤖 Get AI Strategy Guidance
          </a>

          <a
            href="/contact"
            className="block w-full bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 text-center border border-slate-600"
          >
            📅 Book Strategy Call
          </a>

          <a
            href="/"
            className="block w-full text-slate-400 hover:text-white px-6 py-3 text-center transition-colors"
          >
            ← Back to Home
          </a>
        </div>

        {/* Tip */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
          <p className="text-blue-300 text-sm">
            💡 <strong>Pro tip:</strong> Check your spam folder if you don't see the email in 5 minutes.
            The report comes from lorenzo@lorenzodc.com
          </p>
        </div>

      </div>
    </div>
  );
}