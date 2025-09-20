"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ConversionTrackingService } from "../../lib/services/conversion-tracking";

export default function DivineStrategyPage() {
  // Track page view
  useEffect(() => {
    ConversionTrackingService.trackPageView('/lorenzo/divine-strategy', undefined, {
      page_type: 'service_page',
      service_type: 'divine_strategy_coaching',
      platform: 'lorenzo_site'
    });
  }, []);

  const handleCTAClick = (action: string) => {
    ConversionTrackingService.trackConversion('lead', {
      event: action,
      content_type: 'divine_strategy_cta',
      content_category: 'coaching_services',
      metadata: {
        service_tier: action.includes('assessment') ? 'entry' : action.includes('strategy_call') ? 'premium' : 'standard'
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      {/* Animated divine background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -right-4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 -left-4 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>

        {/* Geometric divine elements */}
        <div className="absolute top-20 left-20 text-amber-500/20 text-6xl">◆</div>
        <div className="absolute bottom-40 right-40 text-amber-500/20 text-4xl">◈</div>
      </div>


      <div className="relative z-10">

        <div className="container mx-auto px-4 pt-40 pb-20">
          {/* Hero Section */}
          <div className="max-w-4xl mx-auto text-center mb-20">
            <h1 className="text-5xl md:text-6xl font-bold mb-8 leading-tight">
              <span className="bg-gradient-to-r from-amber-300 via-white to-cyan-200 bg-clip-text text-transparent">
                Systematic Implementation
              </span>
              <br />
              <span className="bg-gradient-to-r from-white via-amber-100 to-amber-300 bg-clip-text text-transparent">
                of Your Divine Assignment
              </span>
            </h1>

            <p className="text-2xl text-slate-300 leading-relaxed mb-12">
              Move beyond inspiration to measurable transformation through integrated spiritual strategy
              and AI-enhanced systems
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button
                onClick={() => {
                  handleCTAClick('begin_assessment');
                  window.location.href = '/lorenzo/assessment';
                }}
                className="px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white font-semibold rounded-2xl transition-all duration-200 text-lg"
              >
                Begin Strategic Assessment
              </button>
              <button
                onClick={() => {
                  handleCTAClick('schedule_strategy_call');
                  window.open('https://calendly.com/lorenzo-theglobalenterprise/discovery-call?utm_source=divine_strategy_page', '_blank');
                }}
                className="px-8 py-4 bg-slate-800/50 border border-slate-600/50 text-white rounded-2xl hover:bg-slate-700/50 transition-all duration-200 text-lg"
              >
                Schedule Strategy Call
              </button>
            </div>
          </div>

          {/* Section 1: The Divine Strategy Methodology */}
          <section className="max-w-6xl mx-auto mb-20">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-6">
                The Divine Strategy Methodology
              </h2>
              <p className="text-xl text-slate-300 max-w-4xl mx-auto">
                Most visionaries receive spiritual insight but struggle with systematic implementation.
                Divine Strategy bridges this gap by combining prophetic discernment with practical systems,
                creating measurable progress toward your calling.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
              <div>
                <h3 className="text-3xl font-bold text-white mb-6">What You'll Learn</h3>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-amber-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                      ✨
                    </div>
                    <div>
                      <h4 className="text-white font-semibold text-lg mb-2">Clarify Your Divine Assignment</h4>
                      <p className="text-slate-300">Move from vague calling to specific, measurable mission with clear success criteria.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                      ⚡
                    </div>
                    <div>
                      <h4 className="text-white font-semibold text-lg mb-2">Develop Systematic Implementation</h4>
                      <p className="text-slate-300">Transform spiritual insights into actionable strategies with built-in accountability systems.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                      🎯
                    </div>
                    <div>
                      <h4 className="text-white font-semibold text-lg mb-2">Navigate Spiritual Seasons</h4>
                      <p className="text-slate-300">Understand divine timing and seasonal positioning for optimal implementation and breakthrough.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-violet-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                      🏗️
                    </div>
                    <div>
                      <h4 className="text-white font-semibold text-lg mb-2">Build Sustainable Systems</h4>
                      <p className="text-slate-300">Create lasting structures that amplify your impact and enable generational transformation.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-rose-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                      🤝
                    </div>
                    <div>
                      <h4 className="text-white font-semibold text-lg mb-2">Integrate Community & Technology</h4>
                      <p className="text-slate-300">Connect with like-minded visionaries while leveraging AI systems for enhanced execution.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800/30 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-amber-300 mb-4">
                    "This isn't generic coaching—it's sophisticated methodology that honors both spiritual revelation and practical implementation."
                  </h3>
                </div>

                <div className="space-y-4">
                  <div className="bg-slate-900/50 rounded-xl p-4">
                    <div className="text-green-400 text-sm font-semibold mb-2">Success Story</div>
                    <p className="text-slate-300 text-sm italic">
                      "Lorenzo helped me clarify what felt like a vague calling into a specific $2.8M social impact initiative.
                      The spiritual discernment combined with systematic planning was exactly what I needed."
                    </p>
                    <div className="text-slate-400 text-xs mt-2">— Ministry Executive, Dallas</div>
                  </div>

                  <div className="bg-slate-900/50 rounded-xl p-4">
                    <div className="text-blue-400 text-sm font-semibold mb-2">Implementation Result</div>
                    <p className="text-slate-300 text-sm italic">
                      "The seasonal timing guidance was prophetic. We launched exactly when he recommended and exceeded
                      our 12-month goals in 6 months."
                    </p>
                    <div className="text-slate-400 text-xs mt-2">— Business Owner, Atlanta</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 2: How It Works */}
          <section className="max-w-6xl mx-auto mb-20">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-6">How Divine Strategy Works</h2>
              <p className="text-xl text-slate-300 max-w-4xl mx-auto">
                Divine Strategy isn't generic coaching—it's a sophisticated methodology that honors both
                spiritual revelation and practical implementation through four integrated phases.
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-8">
              <div className="bg-slate-800/30 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-amber-500 to-amber-600 rounded-3xl flex items-center justify-center text-3xl mx-auto mb-6">
                  📋
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Assessment Phase</h3>
                <p className="text-slate-300">
                  Strategic Clarity Assessment reveals your divine assignment, current season, and implementation barriers through AI-enhanced analysis.
                </p>
              </div>

              <div className="bg-slate-800/30 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-3xl flex items-center justify-center text-3xl mx-auto mb-6">
                  🎯
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Strategy Phase</h3>
                <p className="text-slate-300">
                  Customized strategic plan integrating spiritual guidance with systematic execution, including timing and resource allocation.
                </p>
              </div>

              <div className="bg-slate-800/30 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-3xl flex items-center justify-center text-3xl mx-auto mb-6">
                  ⚡
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Implementation</h3>
                <p className="text-slate-300">
                  AI-enhanced coaching and accountability systems ensure consistent progress with regular spiritual and strategic recalibration.
                </p>
              </div>

              <div className="bg-slate-800/30 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-violet-600 rounded-3xl flex items-center justify-center text-3xl mx-auto mb-6">
                  🌍
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Community</h3>
                <p className="text-slate-300">
                  Connection with other visionaries for ongoing support, collaboration, and systematic scaling of transformation.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3: Coaching Options */}
          <section className="max-w-6xl mx-auto mb-20">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-6">Coaching Investment Options</h2>
              <p className="text-xl text-slate-300 max-w-4xl mx-auto">
                Choose the level of strategic support that aligns with your current season and transformation goals.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Strategic Sessions */}
              <div className="bg-slate-800/30 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-white mb-4">Strategic Sessions</h3>
                  <div className="text-4xl font-bold text-amber-300 mb-2">$1,997</div>
                  <div className="text-slate-400">Single Breakthrough Session</div>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                    <span className="text-slate-300">2-hour strategic clarity session</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                    <span className="text-slate-300">Personalized divine assignment analysis</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                    <span className="text-slate-300">90-day implementation roadmap</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                    <span className="text-slate-300">Seasonal timing guidance</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                    <span className="text-slate-300">30-day email follow-up support</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    handleCTAClick('strategic_sessions');
                    window.open('https://calendly.com/lorenzo-theglobalenterprise/discovery-call?utm_source=divine_strategy&utm_campaign=strategic_sessions', '_blank');
                  }}
                  className="w-full px-6 py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white font-semibold rounded-xl transition-all duration-200"
                >
                  Schedule Session
                </button>
              </div>

              {/* Implementation Program */}
              <div className="bg-slate-800/30 backdrop-blur-xl border border-purple-500/30 rounded-3xl p-8 relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-600 px-4 py-1 rounded-full text-white text-sm font-semibold">
                    ⭐ MOST POPULAR
                  </div>
                </div>

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-white mb-4">Implementation Program</h3>
                  <div className="text-4xl font-bold text-purple-300 mb-2">$9,997</div>
                  <div className="text-slate-400">6-Month Systematic Transformation</div>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span className="text-slate-300">Monthly 2-hour strategy sessions (6 total)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span className="text-slate-300">Bi-weekly implementation check-ins</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span className="text-slate-300">Complete divine assignment blueprint</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span className="text-slate-300">Catalyst AI platform access included</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span className="text-slate-300">Priority email/text support</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span className="text-slate-300">Quarterly strategic recalibration</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    handleCTAClick('implementation_program');
                    window.open('https://calendly.com/lorenzo-theglobalenterprise/discovery-call?utm_source=divine_strategy&utm_campaign=implementation_program', '_blank');
                  }}
                  className="w-full px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-400 hover:to-pink-500 text-white font-semibold rounded-xl transition-all duration-200"
                >
                  Begin Program
                </button>
              </div>

              {/* Institutional Transformation */}
              <div className="bg-slate-800/30 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-white mb-4">Institutional Transformation</h3>
                  <div className="text-4xl font-bold text-green-300 mb-2">$24,997+</div>
                  <div className="text-slate-400">Organizational Divine Strategy</div>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-slate-300">Complete organizational assessment</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-slate-300">Leadership team divine strategy training</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-slate-300">Custom AI system implementation</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-slate-300">Quarterly strategic intensives</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-slate-300">12-month transformation roadmap</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    handleCTAClick('institutional_transformation');
                    window.open('https://calendly.com/lorenzo-theglobalenterprise/discovery-call?utm_source=divine_strategy&utm_campaign=institutional_transformation', '_blank');
                  }}
                  className="w-full px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-semibold rounded-xl transition-all duration-200"
                >
                  Discuss Project
                </button>
              </div>
            </div>

            {/* AI-Enhanced Guidance */}
            <div className="mt-16 bg-gradient-to-r from-slate-800/50 to-slate-700/50 backdrop-blur-xl border border-slate-600/50 rounded-3xl p-12 text-center">
              <h3 className="text-3xl font-bold text-white mb-6">Ongoing AI-Enhanced Guidance</h3>
              <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
                Continue your strategic development between sessions with Catalyst AI platform access,
                providing 24/7 divine strategy coaching and systematic implementation support.
              </p>

              <div className="grid md:grid-cols-3 gap-8 mb-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-300 mb-2">$97/month</div>
                  <div className="text-slate-400 mb-4">Strategic Guidance</div>
                  <p className="text-slate-300 text-sm">AI coaching with spiritual insight integration</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-cyan-300 mb-2">$197/month</div>
                  <div className="text-slate-400 mb-4">Community + AI</div>
                  <p className="text-slate-300 text-sm">Platform access + TPC Ministries community</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-300 mb-2">$297/month</div>
                  <div className="text-slate-400 mb-4">Premium Integration</div>
                  <p className="text-slate-300 text-sm">Full platform + priority support + exclusive content</p>
                </div>
              </div>

              <Link href="/catalyst">
                <button className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold rounded-2xl transition-all duration-200">
                  Explore AI Platform
                </button>
              </Link>
            </div>
          </section>

          {/* Final CTA */}
          <section className="max-w-4xl mx-auto text-center">
            <div className="bg-gradient-to-r from-amber-500/10 to-cyan-500/10 border border-amber-500/30 rounded-3xl p-12">
              <h2 className="text-3xl font-bold text-white mb-6">
                Ready to Transform Your Divine Assignment Into Systematic Reality?
              </h2>
              <p className="text-xl text-slate-300 mb-8">
                Start with your Strategic Clarity Assessment to receive personalized guidance on your calling,
                current season, and next-level implementation strategy.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <button
                  onClick={() => {
                    handleCTAClick('final_assessment');
                    window.location.href = '/lorenzo/assessment';
                  }}
                  className="px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white font-semibold rounded-2xl transition-all duration-200 text-lg"
                >
                  Begin Strategic Assessment
                </button>
                <button
                  onClick={() => {
                    handleCTAClick('final_strategy_call');
                    window.open('https://calendly.com/lorenzo-theglobalenterprise/discovery-call?utm_source=divine_strategy&utm_campaign=final_cta', '_blank');
                  }}
                  className="px-8 py-4 bg-slate-800/50 border border-slate-600/50 text-white rounded-2xl hover:bg-slate-700/50 transition-all duration-200 text-lg"
                >
                  Schedule Strategy Call
                </button>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <footer className="container mx-auto px-4 py-12 text-center border-t border-slate-700/50">
          <div className="max-w-4xl mx-auto">
            <Link href="/lorenzo" className="text-2xl font-bold text-white mb-4 block">
              LORENZO DAUGHTRY-CHAMBERS
            </Link>
            <p className="text-slate-400 mb-8">
              Where Divine Strategy Meets Systematic Implementation
            </p>

            <div className="flex flex-wrap justify-center gap-8 mb-8">
              <Link href="/lorenzo" className="text-slate-400 hover:text-white transition-colors">
                Home
              </Link>
              <Link href="/catalyst" className="text-slate-400 hover:text-white transition-colors">
                Catalyst AI
              </Link>
              <Link href="/lorenzo/ministry" className="text-slate-400 hover:text-white transition-colors">
                Ministry
              </Link>
              <Link href="/lorenzo/investment-fund" className="text-slate-400 hover:text-white transition-colors">
                Investment Fund
              </Link>
              <Link href="/lorenzo/connect" className="text-slate-400 hover:text-white transition-colors">
                Connect
              </Link>
            </div>

            <div className="flex justify-center gap-8 text-sm text-slate-500">
              <span>© 2025 Lorenzo Daughtry-Chambers</span>
              <span>•</span>
              <span>Divine Strategy + Systematic Excellence</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}