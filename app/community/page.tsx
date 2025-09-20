"use client";
import { useState, useEffect } from "react";
import { ConversionTrackingService } from "../lib/services/conversion-tracking";

export default function AILeadershipCommunity() {
  const foundersUrl = process.env.NEXT_PUBLIC_SKOOL_JOIN_URL || "#";
  const executiveUrl = "#"; // Will be set when executive mastermind is ready

  // Track page view
  useEffect(() => {
    ConversionTrackingService.trackPageView('/community', undefined, {
      page_type: 'community',
      community_type: 'dual_tier_leadership'
    });
  }, []);

  const handleFoundersClick = () => {
    ConversionTrackingService.trackConversion('lead', {
      event: 'founders_community_interest',
      content_type: 'community',
      content_category: 'founders_membership',
      metadata: {
        membership_tier: 'founders',
        monthly_value: 79
      }
    });
    window.open(foundersUrl, '_blank');
  };

  const handleExecutiveClick = () => {
    ConversionTrackingService.trackConversion('lead', {
      event: 'executive_mastermind_interest',
      content_type: 'community',
      content_category: 'executive_membership',
      metadata: {
        membership_tier: 'executive',
        monthly_value: 497
      }
    });
    // For now, redirect to calendly for executive inquiries
    window.open('https://calendly.com/lorenzo-theglobalenterprise/discovery-call?utm_source=executive_mastermind&utm_medium=community', '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -right-4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 -left-4 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10">
        <div className="container mx-auto px-4 py-16">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white via-blue-100 to-cyan-200 bg-clip-text text-transparent leading-tight mb-6">
              Choose Your AI Leadership Level
            </h1>
            <p className="text-2xl text-slate-300 max-w-4xl mx-auto mb-8">
              Join a community of leaders driving AI transformation. Select the tier that matches your organization's stage and needs.
            </p>
          </div>

          {/* Two-Tier Comparison */}
          <div className="grid lg:grid-cols-2 gap-8 mb-16">

            {/* Founders Community - Left */}
            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 hover:border-slate-600/50 transition-all duration-300">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-3xl flex items-center justify-center text-3xl mx-auto mb-4">
                  🚀
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">AI Founders Community</h2>
                <p className="text-slate-400">For growing businesses and entrepreneurs</p>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                  <p className="text-slate-300">Weekly AI briefings & action challenges</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                  <p className="text-slate-300">Template library (prompts, SOPs, blueprints)</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                  <p className="text-slate-300">Founder peer network & accountability</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                  <p className="text-slate-300">Q&A sessions and community support</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                  <p className="text-slate-300">AI implementation guides for small teams</p>
                </div>
              </div>

              <div className="border border-green-500/30 rounded-2xl p-6 mb-6 bg-green-500/5">
                <div className="text-center">
                  <div className="text-4xl font-bold text-white mb-2">$79/month</div>
                  <div className="text-slate-400 mb-2">Founders Tier</div>
                  <p className="text-slate-300 text-sm">
                    Perfect for startups and growing businesses ready to implement AI strategically.
                  </p>
                </div>
              </div>

              <div className="text-center mb-6">
                <div className="text-slate-400 text-sm mb-2">Ideal for:</div>
                <div className="text-slate-300 text-sm space-y-1">
                  <div>• Startup founders & entrepreneurs</div>
                  <div>• Small-medium business owners</div>
                  <div>• Teams under 50 employees</div>
                  <div>• AI budgets under $50K</div>
                </div>
              </div>

              <button
                onClick={handleFoundersClick}
                className="w-full px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-semibold rounded-2xl transition-all duration-200"
              >
                Join Founders Community
              </button>
            </div>

            {/* Executive Mastermind - Right */}
            <div className="bg-slate-800/50 backdrop-blur-xl border border-purple-500/30 rounded-3xl p-8 hover:border-purple-400/50 transition-all duration-300 relative">
              {/* Premium Badge */}
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <div className="bg-gradient-to-r from-purple-500 to-pink-600 px-4 py-1 rounded-full text-white text-sm font-semibold">
                  ⭐ PREMIUM
                </div>
              </div>

              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-3xl flex items-center justify-center text-3xl mx-auto mb-4">
                  👑
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">Executive AI Mastermind</h2>
                <p className="text-slate-400">For established enterprises and C-suite leaders</p>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
                  <p className="text-slate-300">Monthly strategic AI briefings & intelligence</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
                  <p className="text-slate-300">C-suite peer network & private discussions</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
                  <p className="text-slate-300">Board-ready templates & ROI frameworks</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
                  <p className="text-slate-300">Priority access to AI strategy consultants</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
                  <p className="text-slate-300">Enterprise implementation playbooks</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
                  <p className="text-slate-300">Quarterly mastermind calls with expert facilitators</p>
                </div>
              </div>

              <div className="border border-purple-500/30 rounded-2xl p-6 mb-6 bg-purple-500/5">
                <div className="text-center">
                  <div className="text-4xl font-bold text-white mb-2">$497/month</div>
                  <div className="text-slate-400 mb-2">Executive Tier</div>
                  <p className="text-slate-300 text-sm">
                    Less than 1% of your typical AI consultant hourly rate for ongoing strategic guidance.
                  </p>
                </div>
              </div>

              <div className="text-center mb-6">
                <div className="text-slate-400 text-sm mb-2">Designed for:</div>
                <div className="text-slate-300 text-sm space-y-1">
                  <div>• C-suite executives & VPs</div>
                  <div>• Enterprise teams 100+ employees</div>
                  <div>• AI transformation budgets $100K+</div>
                  <div>• Strategic decision makers</div>
                </div>
              </div>

              <button
                onClick={handleExecutiveClick}
                className="w-full px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-400 hover:to-pink-500 text-white font-semibold rounded-2xl transition-all duration-200"
              >
                Request Executive Invitation
              </button>
            </div>
          </div>

          {/* Value Ladder Callout */}
          <div className="text-center mb-16">
            <div className="bg-gradient-to-r from-slate-800/30 to-slate-700/30 backdrop-blur-xl border border-slate-600/30 rounded-2xl p-6 inline-block">
              <p className="text-slate-300 text-lg">
                <span className="text-cyan-400 font-semibold">💡 Not sure which tier?</span> Start with Founders Community and upgrade anytime as your AI initiatives scale.
              </p>
            </div>
          </div>

          {/* Success Stories */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-3xl p-8">
              <blockquote className="text-lg text-slate-300 mb-4 italic">
                "The founders community gave us the practical templates and peer support we needed to implement AI without breaking the bank."
              </blockquote>
              <div className="text-white font-semibold">– Tech Startup Founder</div>
              <div className="text-slate-400">Series A SaaS Company</div>
            </div>

            <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-3xl p-8">
              <blockquote className="text-lg text-slate-300 mb-4 italic">
                "The executive mastermind saved us 6 months of trial and error. The strategic frameworks were invaluable for our $2M AI transformation."
              </blockquote>
              <div className="text-white font-semibold">– Enterprise Executive</div>
              <div className="text-slate-400">Fortune 500 Technology Company</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
