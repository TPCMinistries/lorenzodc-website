'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase/client';
import {
  EnterpriseAssessmentService,
  EnterpriseAssessment,
  EnterpriseRecommendation,
  ROICalculation
} from '../../lib/services/enterprise-assessment';

function EnterpriseResultsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get('session');

  const [assessment, setAssessment] = useState<EnterpriseAssessment | null>(null);
  const [roiData, setRoiData] = useState<ROICalculation | null>(null);
  const [recommendations, setRecommendations] = useState<EnterpriseRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  useEffect(() => {
    const loadResults = async () => {
      if (!sessionId) {
        router.push('/enterprise-diagnostic');
        return;
      }

      try {
        // Check authentication
        const { data: { user } } = await supabase.auth.getUser();
        setIsAuthenticated(!!user);

        // Load assessment result
        const assessmentResult = await EnterpriseAssessmentService.getAssessmentResult(sessionId);
        if (!assessmentResult) {
          router.push('/enterprise-diagnostic');
          return;
        }

        setAssessment(assessmentResult);

        // Load ROI calculations and recommendations
        if (assessmentResult.id) {
          const [roiResult, recommendationsResult] = await Promise.all([
            EnterpriseAssessmentService.getROICalculation(assessmentResult.id),
            EnterpriseAssessmentService.getRecommendations(assessmentResult.id)
          ]);

          setRoiData(roiResult);
          setRecommendations(recommendationsResult);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error loading enterprise results:', error);
        setLoading(false);
      }
    };

    loadResults();
  }, [sessionId, router]);

  const handleUpgradeClick = (tier: 'plus' | 'pro') => {
    // In production, this would integrate with Stripe
    setShowUpgradeModal(true);
  };

  const getReadinessLevel = (score: number) => {
    if (score >= 80) return { level: 'Excellent', color: 'text-emerald-400', bgColor: 'bg-emerald-500/20' };
    if (score >= 60) return { level: 'Good', color: 'text-blue-400', bgColor: 'bg-blue-500/20' };
    if (score >= 40) return { level: 'Moderate', color: 'text-yellow-400', bgColor: 'bg-yellow-500/20' };
    return { level: 'Developing', color: 'text-orange-400', bgColor: 'bg-orange-500/20' };
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-400">Analyzing your enterprise data...</p>
        </div>
      </div>
    );
  }

  if (!assessment) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Assessment Not Found</h1>
          <p className="text-slate-400 mb-6">We couldn't find your enterprise assessment results.</p>
          <button
            onClick={() => router.push('/enterprise-diagnostic')}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Take Assessment
          </button>
        </div>
      </div>
    );
  }

  const technicalReadiness = getReadinessLevel(assessment.technical_readiness_score);
  const culturalReadiness = getReadinessLevel(assessment.cultural_readiness_score);
  const leadershipReadiness = getReadinessLevel(assessment.leadership_buy_in_score);

  const quickWins = recommendations.filter(r => r.category === 'quick_wins');
  const mediumTerm = recommendations.filter(r => r.category === 'medium_term');
  const strategic = recommendations.filter(r => r.category === 'strategic');

  return (
    <div className="min-h-screen bg-slate-900 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Enterprise AI Diagnostic Results
          </h1>
          <h2 className="text-2xl text-blue-400 mb-4">{assessment.company_name}</h2>
          <p className="text-slate-400">
            Your personalized AI transformation roadmap and ROI analysis
          </p>
        </div>

        {/* Executive Summary */}
        <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-400/20 rounded-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            📊 Executive Summary
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {roiData && (
              <>
                <div className="text-center">
                  <div className="text-3xl font-bold text-emerald-400 mb-2">
                    {formatCurrency(roiData.annual_savings)}
                  </div>
                  <p className="text-slate-300 font-medium">Annual Savings Potential</p>
                  <p className="text-slate-400 text-sm">Based on efficiency improvements</p>
                </div>

                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400 mb-2">
                    {roiData.payback_period_months.toFixed(1)} months
                  </div>
                  <p className="text-slate-300 font-medium">Payback Period</p>
                  <p className="text-slate-400 text-sm">Return on investment timeline</p>
                </div>

                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400 mb-2">
                    {formatPercentage(roiData.roi_percentage)}
                  </div>
                  <p className="text-slate-300 font-medium">ROI First Year</p>
                  <p className="text-slate-400 text-sm">After subscription costs</p>
                </div>

                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-400 mb-2">
                    {roiData.confidence_level}%
                  </div>
                  <p className="text-slate-300 font-medium">Confidence Level</p>
                  <p className="text-slate-400 text-sm">Based on readiness scores</p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* AI Readiness Scores */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-800 rounded-xl border border-slate-600 p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              🔧 Technical Readiness
            </h3>
            <div className="flex items-center gap-4">
              <div className="text-3xl font-bold text-blue-400">
                {assessment.technical_readiness_score}%
              </div>
              <div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${technicalReadiness.bgColor} ${technicalReadiness.color}`}>
                  {technicalReadiness.level}
                </div>
                <p className="text-slate-400 text-sm mt-1">Current tech stack & tools</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800 rounded-xl border border-slate-600 p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              👥 Cultural Readiness
            </h3>
            <div className="flex items-center gap-4">
              <div className="text-3xl font-bold text-purple-400">
                {assessment.cultural_readiness_score}%
              </div>
              <div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${culturalReadiness.bgColor} ${culturalReadiness.color}`}>
                  {culturalReadiness.level}
                </div>
                <p className="text-slate-400 text-sm mt-1">Team adoption & mindset</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800 rounded-xl border border-slate-600 p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              🎯 Leadership Buy-in
            </h3>
            <div className="flex items-center gap-4">
              <div className="text-3xl font-bold text-emerald-400">
                {assessment.leadership_buy_in_score}%
              </div>
              <div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${leadershipReadiness.bgColor} ${leadershipReadiness.color}`}>
                  {leadershipReadiness.level}
                </div>
                <p className="text-slate-400 text-sm mt-1">Executive support level</p>
              </div>
            </div>
          </div>
        </div>

        {/* Free vs Premium Content Divider */}
        <div className="border-t border-slate-700 pt-8 mb-8">
          <div className="text-center mb-6">
            <h2 className="text-xl text-white mb-2">🔓 Free Analysis Complete</h2>
            <p className="text-slate-400">Upgrade for detailed implementation roadmap and ROI breakdown</p>
          </div>
        </div>

        {/* Premium Upgrade Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Enterprise Plus */}
          <div className="bg-gradient-to-b from-blue-500/10 to-blue-600/5 border border-blue-400/30 rounded-xl p-8">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">Enterprise Plus</h3>
              <div className="text-4xl font-bold text-blue-400 mb-2">$297<span className="text-lg text-slate-400">/month</span></div>
              <p className="text-slate-300">Complete implementation roadmap</p>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <span className="text-blue-400 mt-1">✓</span>
                <div>
                  <p className="text-white font-medium">Detailed 90-Day Implementation Plan</p>
                  <p className="text-slate-400 text-sm">Step-by-step roadmap with timelines and milestones</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-blue-400 mt-1">✓</span>
                <div>
                  <p className="text-white font-medium">Custom ROI Breakdown</p>
                  <p className="text-slate-400 text-sm">Detailed financial projections and cost-benefit analysis</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-blue-400 mt-1">✓</span>
                <div>
                  <p className="text-white font-medium">Tool Recommendations & Integration Guides</p>
                  <p className="text-slate-400 text-sm">Specific software recommendations with setup instructions</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-blue-400 mt-1">✓</span>
                <div>
                  <p className="text-white font-medium">Risk Assessment & Mitigation</p>
                  <p className="text-slate-400 text-sm">Identify potential challenges and solutions</p>
                </div>
              </div>
            </div>

            <div className="bg-blue-500/10 rounded-lg p-4 mb-6">
              <p className="text-blue-300 text-sm text-center">
                💡 <strong>ROI Guarantee:</strong> Save 10X your subscription cost in month 1 or get your money back
              </p>
            </div>

            <button
              onClick={() => handleUpgradeClick('plus')}
              className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-200"
            >
              Unlock Enterprise Plus
            </button>
          </div>

          {/* Enterprise Pro */}
          <div className="bg-gradient-to-b from-purple-500/10 to-purple-600/5 border border-purple-400/30 rounded-xl p-8 relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                MOST POPULAR
              </span>
            </div>

            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">Enterprise Pro</h3>
              <div className="text-4xl font-bold text-purple-400 mb-2">$997<span className="text-lg text-slate-400">/month</span></div>
              <p className="text-slate-300">Full implementation support</p>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <span className="text-purple-400 mt-1">✓</span>
                <div>
                  <p className="text-white font-medium">Everything in Enterprise Plus</p>
                  <p className="text-slate-400 text-sm">All features from the Plus tier</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-purple-400 mt-1">✓</span>
                <div>
                  <p className="text-white font-medium">Monthly Strategy Calls</p>
                  <p className="text-slate-400 text-sm">1-on-1 sessions with AI implementation experts</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-purple-400 mt-1">✓</span>
                <div>
                  <p className="text-white font-medium">Hands-on Implementation Support</p>
                  <p className="text-slate-400 text-sm">Direct assistance with tool setup and integration</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-purple-400 mt-1">✓</span>
                <div>
                  <p className="text-white font-medium">Custom AI Solutions Development</p>
                  <p className="text-slate-400 text-sm">Bespoke AI tools built for your specific needs</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-purple-400 mt-1">✓</span>
                <div>
                  <p className="text-white font-medium">Team Training & Workshops</p>
                  <p className="text-slate-400 text-sm">Comprehensive AI literacy programs for your team</p>
                </div>
              </div>
            </div>

            <div className="bg-purple-500/10 rounded-lg p-4 mb-6">
              <p className="text-purple-300 text-sm text-center">
                🚀 <strong>Fast-Track Promise:</strong> Achieve full ROI within 90 days with dedicated support
              </p>
            </div>

            <button
              onClick={() => handleUpgradeClick('pro')}
              className="w-full px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
            >
              Unlock Enterprise Pro
            </button>
          </div>
        </div>

        {/* Quick Wins Preview */}
        {quickWins.length > 0 && (
          <div className="bg-slate-800 rounded-xl border border-slate-600 p-8 mb-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              ⚡ Quick Wins (Free Preview)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {quickWins.slice(0, 2).map((rec, index) => (
                <div key={index} className="bg-slate-700/50 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-white">{rec.recommendation_text}</h3>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      rec.estimated_impact === 'High' ? 'bg-emerald-500/20 text-emerald-400' :
                      rec.estimated_impact === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-slate-500/20 text-slate-400'
                    }`}>
                      {rec.estimated_impact} Impact
                    </span>
                  </div>
                  <p className="text-slate-400 text-sm mb-3">
                    ⏱️ Implementation: {rec.implementation_time}
                  </p>
                  <p className="text-emerald-400 font-medium">
                    💰 Potential ROI: {formatCurrency(rec.roi_potential)}/month
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-blue-500/10 border border-blue-400/20 rounded-lg text-center">
              <p className="text-blue-300 mb-3">
                <strong>Unlock your complete roadmap</strong> - See all {recommendations.length} personalized recommendations with detailed implementation guides
              </p>
              <button
                onClick={() => handleUpgradeClick('plus')}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
              >
                View Full Implementation Plan
              </button>
            </div>
          </div>
        )}

        {/* One-Time Strategy Sessions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Strategy Intensive */}
          <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/5 border border-emerald-400/30 rounded-xl p-6">
            <div className="text-center mb-4">
              <h3 className="text-xl font-bold text-white mb-2">Enterprise Strategy Intensive</h3>
              <div className="text-3xl font-bold text-emerald-400 mb-2">$1,997</div>
              <p className="text-slate-300 text-sm">One-time comprehensive assessment</p>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-start gap-2">
                <span className="text-emerald-400">✓</span>
                <span className="text-slate-300 text-sm">Complete organizational AI audit</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-emerald-400">✓</span>
                <span className="text-slate-300 text-sm">Custom 90-day implementation roadmap</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-emerald-400">✓</span>
                <span className="text-slate-300 text-sm">ROI projections & financial modeling</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-emerald-400">✓</span>
                <span className="text-slate-300 text-sm">Tool recommendations & vendor evaluation</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-emerald-400">✓</span>
                <span className="text-slate-300 text-sm">Executive presentation materials</span>
              </div>
            </div>

            <button className="w-full px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg font-semibold hover:from-emerald-600 hover:to-teal-600 transition-all duration-200">
              Book Strategy Intensive
            </button>
          </div>

          {/* Implementation Workshop */}
          <div className="bg-gradient-to-br from-orange-500/10 to-red-500/5 border border-orange-400/30 rounded-xl p-6">
            <div className="text-center mb-4">
              <h3 className="text-xl font-bold text-white mb-2">Implementation Workshop</h3>
              <div className="text-3xl font-bold text-orange-400 mb-2">$4,997</div>
              <p className="text-slate-300 text-sm">3-day intensive with your team</p>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-start gap-2">
                <span className="text-orange-400">✓</span>
                <span className="text-slate-300 text-sm">Everything in Strategy Intensive</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-orange-400">✓</span>
                <span className="text-slate-300 text-sm">3-day on-site implementation workshop</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-orange-400">✓</span>
                <span className="text-slate-300 text-sm">Team training & change management</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-orange-400">✓</span>
                <span className="text-slate-300 text-sm">Hands-on tool setup & integration</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-orange-400">✓</span>
                <span className="text-slate-300 text-sm">30-day follow-up support included</span>
              </div>
            </div>

            <button className="w-full px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-200">
              Book Implementation Workshop
            </button>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-xl border border-slate-600 p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Need Custom AI Transformation?</h2>
          <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
            For enterprise implementations requiring custom AI solutions, integration support, or organization-wide training programs.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">$5K - $25K</div>
              <p className="text-slate-400 text-sm">Custom AI Implementation</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">$10K - $50K</div>
              <p className="text-slate-400 text-sm">Speaking & Training</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-400">$500 - $2K/hr</div>
              <p className="text-slate-400 text-sm">Strategic Consulting</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all duration-200">
              Schedule Strategy Call
            </button>
            <button
              onClick={() => router.push('/contact')}
              className="px-8 py-3 bg-slate-700 border border-slate-600 text-white rounded-lg hover:bg-slate-600 transition-colors"
            >
              Contact Sales Team
            </button>
          </div>
        </div>

        {/* Authentication Prompt */}
        {!isAuthenticated && (
          <div className="mt-8 p-6 bg-green-500/10 border border-green-400/20 rounded-lg text-center">
            <p className="text-green-300 mb-4">
              🔒 <strong>Save Your Results:</strong> Create a free account to access your assessment anytime and receive updates on new AI opportunities.
            </p>
            <button
              onClick={() => router.push('/signup')}
              className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
            >
              Create Free Account
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function EnterpriseResultsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    }>
      <EnterpriseResultsContent />
    </Suspense>
  );
}