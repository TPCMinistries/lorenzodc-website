"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import GlobalNavigation from "../components/GlobalNavigation";

export default function CatalystAIPage() {
  const [mounted, setMounted] = useState(false);
  const [activeFeature, setActiveFeature] = useState<number | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-indigo-950/90 to-slate-900/95" />

        {/* Floating geometric shapes */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-3xl rotate-45 animate-float blur-xl"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-purple-500/25 to-indigo-600/25 rounded-2xl rotate-12 animate-float-delayed blur-lg"></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-gradient-to-br from-indigo-500/15 to-cyan-500/15 rounded-full animate-pulse-slow"></div>

        {/* Animated grid overlay */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5 animate-grid-flow"></div>

        {/* Dynamic light beams */}
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-cyan-400/30 to-transparent animate-beam-1"></div>
        <div className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-transparent via-indigo-400/30 to-transparent animate-beam-2"></div>

        {/* Particle effects */}
        {mounted && Array.from({length: 20}).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400/40 rounded-full animate-particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>

      <GlobalNavigation />

      <div className="relative z-10">
        <div className="container mx-auto px-4 py-16 pt-24">
          {/* Enhanced Header */}
          <div className="text-center mb-20 relative">
            {/* Floating accent elements */}
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse-glow"></div>

            <div className="relative group">
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold bg-gradient-to-r from-cyan-300 via-blue-400 to-indigo-500 bg-clip-text text-transparent leading-tight mb-8 animate-text-shimmer bg-size-200 bg-pos-0 hover:bg-pos-100 transition-all duration-1000">
                Catalyst AI
              </h1>

              {/* Glowing border effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 via-blue-500/20 to-indigo-600/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10"></div>
            </div>

            <div className="relative">
              <p className="text-xl md:text-2xl text-slate-200 max-w-5xl mx-auto leading-relaxed mb-6 animate-fade-in-up">
                Your AI-powered platform for transformation. From pilot programs to enterprise-scale deployment with
                <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent font-semibold"> intelligent automation</span>,
                <span className="bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent font-semibold"> strategic insights</span>, and
                <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent font-semibold"> measurable ROI</span>.
              </p>

              {/* Decorative elements */}
              <div className="flex justify-center items-center space-x-4 mt-8">
                <div className="w-12 h-px bg-gradient-to-r from-transparent to-cyan-400 animate-expand-right"></div>
                <div className="w-3 h-3 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full animate-pulse-bright"></div>
                <div className="w-12 h-px bg-gradient-to-l from-transparent to-indigo-400 animate-expand-left"></div>
              </div>
            </div>
          </div>

          {/* Enhanced Core Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            <Link href="/chat">
              <div
                className="relative bg-slate-800/30 backdrop-blur-2xl border border-slate-700/30 rounded-3xl p-8 hover:border-cyan-400/60 transition-all duration-500 cursor-pointer group overflow-hidden hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/20"
                onMouseEnter={() => setActiveFeature(0)}
                onMouseLeave={() => setActiveFeature(null)}
              >
                {/* Animated background glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                {/* Floating particles */}
                <div className="absolute top-4 right-4 w-2 h-2 bg-cyan-400/60 rounded-full animate-ping"></div>

                <div className="relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center text-3xl mb-6 transform group-hover:rotate-3 group-hover:scale-110 transition-transform duration-300 shadow-lg group-hover:shadow-cyan-500/30">
                    💬
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-cyan-100 transition-colors">AI Chat Assistant</h3>
                  <p className="text-slate-300 mb-6 group-hover:text-slate-200 transition-colors leading-relaxed">Interactive AI conversations with advanced reasoning, context awareness, and multi-modal capabilities.</p>
                  <div className="flex items-center text-cyan-400 text-sm font-medium group-hover:text-cyan-300 transition-colors">
                    <span>Start Chatting</span>
                    <span className="ml-2 transform group-hover:translate-x-2 transition-transform duration-300">→</span>
                  </div>
                </div>
              </div>
            </Link>

            <Link href="/enterprise/rag">
              <div
                className="relative bg-slate-800/30 backdrop-blur-2xl border border-slate-700/30 rounded-3xl p-8 hover:border-emerald-400/60 transition-all duration-500 cursor-pointer group overflow-hidden hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/20"
                onMouseEnter={() => setActiveFeature(1)}
                onMouseLeave={() => setActiveFeature(null)}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-teal-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute top-4 right-4 w-2 h-2 bg-emerald-400/60 rounded-full animate-ping"></div>

                <div className="relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center text-3xl mb-6 transform group-hover:rotate-3 group-hover:scale-110 transition-transform duration-300 shadow-lg group-hover:shadow-emerald-500/30">
                    📄
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-emerald-100 transition-colors">Document Intelligence</h3>
                  <p className="text-slate-300 mb-6 group-hover:text-slate-200 transition-colors leading-relaxed">Upload and chat with your documents. Extract insights, summaries, and answers from any PDF.</p>
                  <div className="flex items-center text-emerald-400 text-sm font-medium group-hover:text-emerald-300 transition-colors">
                    <span>Try Demo</span>
                    <span className="ml-2 transform group-hover:translate-x-2 transition-transform duration-300">→</span>
                  </div>
                </div>
              </div>
            </Link>

            <Link href="/enterprise/roi">
              <div
                className="relative bg-slate-800/30 backdrop-blur-2xl border border-slate-700/30 rounded-3xl p-8 hover:border-amber-400/60 transition-all duration-500 cursor-pointer group overflow-hidden hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-amber-500/20"
                onMouseEnter={() => setActiveFeature(2)}
                onMouseLeave={() => setActiveFeature(null)}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-orange-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute top-4 right-4 w-2 h-2 bg-amber-400/60 rounded-full animate-ping"></div>

                <div className="relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center text-3xl mb-6 transform group-hover:rotate-3 group-hover:scale-110 transition-transform duration-300 shadow-lg group-hover:shadow-amber-500/30">
                    📊
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-amber-100 transition-colors">ROI Calculator</h3>
                  <p className="text-slate-300 mb-6 group-hover:text-slate-200 transition-colors leading-relaxed">Quantify the impact of AI implementation with detailed cost-benefit analysis and projections.</p>
                  <div className="flex items-center text-amber-400 text-sm font-medium group-hover:text-amber-300 transition-colors">
                    <span>Calculate ROI</span>
                    <span className="ml-2 transform group-hover:translate-x-2 transition-transform duration-300">→</span>
                  </div>
                </div>
              </div>
            </Link>

            <Link href="/enterprise/diagnostic">
              <div
                className="relative bg-slate-800/30 backdrop-blur-2xl border border-slate-700/30 rounded-3xl p-8 hover:border-purple-400/60 transition-all duration-500 cursor-pointer group overflow-hidden hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20"
                onMouseEnter={() => setActiveFeature(3)}
                onMouseLeave={() => setActiveFeature(null)}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-violet-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute top-4 right-4 w-2 h-2 bg-purple-400/60 rounded-full animate-ping"></div>

                <div className="relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-violet-600 rounded-2xl flex items-center justify-center text-3xl mb-6 transform group-hover:rotate-3 group-hover:scale-110 transition-transform duration-300 shadow-lg group-hover:shadow-purple-500/30">
                    🔍
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-purple-100 transition-colors">AI Readiness Assessment</h3>
                  <p className="text-slate-300 mb-6 group-hover:text-slate-200 transition-colors leading-relaxed">Comprehensive evaluation of your organization's AI readiness with actionable recommendations.</p>
                  <div className="flex items-center text-purple-400 text-sm font-medium group-hover:text-purple-300 transition-colors">
                    <span>Start Assessment</span>
                    <span className="ml-2 transform group-hover:translate-x-2 transition-transform duration-300">→</span>
                  </div>
                </div>
              </div>
            </Link>

            <Link href="/enterprise/blueprints">
              <div
                className="relative bg-slate-800/30 backdrop-blur-2xl border border-slate-700/30 rounded-3xl p-8 hover:border-red-400/60 transition-all duration-500 cursor-pointer group overflow-hidden hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-red-500/20"
                onMouseEnter={() => setActiveFeature(4)}
                onMouseLeave={() => setActiveFeature(null)}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-rose-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute top-4 right-4 w-2 h-2 bg-red-400/60 rounded-full animate-ping"></div>

                <div className="relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-rose-600 rounded-2xl flex items-center justify-center text-3xl mb-6 transform group-hover:rotate-3 group-hover:scale-110 transition-transform duration-300 shadow-lg group-hover:shadow-red-500/30">
                    🎯
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-red-100 transition-colors">Strategic Blueprints</h3>
                  <p className="text-slate-300 mb-6 group-hover:text-slate-200 transition-colors leading-relaxed">Custom 90-day implementation roadmaps tailored to your industry and organizational needs.</p>
                  <div className="flex items-center text-red-400 text-sm font-medium group-hover:text-red-300 transition-colors">
                    <span>Get Blueprint</span>
                    <span className="ml-2 transform group-hover:translate-x-2 transition-transform duration-300">→</span>
                  </div>
                </div>
              </div>
            </Link>

            <Link href="/enterprise">
              <div
                className="relative bg-slate-800/30 backdrop-blur-2xl border border-slate-700/30 rounded-3xl p-8 hover:border-indigo-400/60 transition-all duration-500 cursor-pointer group overflow-hidden hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-indigo-500/20"
                onMouseEnter={() => setActiveFeature(5)}
                onMouseLeave={() => setActiveFeature(null)}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute top-4 right-4 w-2 h-2 bg-indigo-400/60 rounded-full animate-ping"></div>

                <div className="relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-2xl flex items-center justify-center text-3xl mb-6 transform group-hover:rotate-3 group-hover:scale-110 transition-transform duration-300 shadow-lg group-hover:shadow-indigo-500/30">
                    🏢
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-indigo-100 transition-colors">Enterprise Toolkit</h3>
                  <p className="text-slate-300 mb-6 group-hover:text-slate-200 transition-colors leading-relaxed">Complete suite of enterprise-grade tools, services, and support for large-scale AI deployment.</p>
                  <div className="flex items-center text-indigo-400 text-sm font-medium group-hover:text-indigo-300 transition-colors">
                    <span>Explore Tools</span>
                    <span className="ml-2 transform group-hover:translate-x-2 transition-transform duration-300">→</span>
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* Enhanced Value Proposition */}
          <div className="relative bg-gradient-to-br from-slate-800/40 via-slate-800/60 to-slate-800/40 backdrop-blur-2xl border border-slate-700/40 rounded-3xl p-12 text-center mb-20 overflow-hidden group">
            {/* Animated background elements */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-blue-500/10 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            <div className="absolute top-0 left-1/4 w-32 h-32 bg-cyan-400/10 rounded-full blur-2xl animate-float"></div>
            <div className="absolute bottom-0 right-1/4 w-24 h-24 bg-indigo-400/10 rounded-full blur-xl animate-float-delayed"></div>

            <div className="relative z-10">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-white via-cyan-100 to-white bg-clip-text text-transparent mb-8">Why Choose Catalyst AI?</h2>

              <div className="grid md:grid-cols-3 gap-10">
                <div className="group/item relative p-6 rounded-2xl hover:bg-slate-700/30 transition-all duration-300">
                  <div className="text-5xl mb-6 transform group-hover/item:scale-110 group-hover/item:rotate-12 transition-transform duration-300">⚡</div>
                  <h3 className="text-xl font-semibold text-white mb-4 group-hover/item:text-cyan-200 transition-colors">Rapid Implementation</h3>
                  <p className="text-slate-300 group-hover/item:text-slate-200 transition-colors leading-relaxed">Go from concept to production in weeks, not months, with our proven deployment frameworks.</p>
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 group-hover/item:w-full transition-all duration-500"></div>
                </div>

                <div className="group/item relative p-6 rounded-2xl hover:bg-slate-700/30 transition-all duration-300">
                  <div className="text-5xl mb-6 transform group-hover/item:scale-110 group-hover/item:rotate-12 transition-transform duration-300">🔒</div>
                  <h3 className="text-xl font-semibold text-white mb-4 group-hover/item:text-emerald-200 transition-colors">Enterprise Security</h3>
                  <p className="text-slate-300 group-hover/item:text-slate-200 transition-colors leading-relaxed">Bank-grade security, compliance frameworks, and data governance built for enterprise needs.</p>
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-emerald-400 to-teal-500 group-hover/item:w-full transition-all duration-500"></div>
                </div>

                <div className="group/item relative p-6 rounded-2xl hover:bg-slate-700/30 transition-all duration-300">
                  <div className="text-5xl mb-6 transform group-hover/item:scale-110 group-hover/item:rotate-12 transition-transform duration-300">📈</div>
                  <h3 className="text-xl font-semibold text-white mb-4 group-hover/item:text-amber-200 transition-colors">Measurable ROI</h3>
                  <p className="text-slate-300 group-hover/item:text-slate-200 transition-colors leading-relaxed">Track performance, measure impact, and demonstrate value with comprehensive analytics.</p>
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-amber-400 to-orange-500 group-hover/item:w-full transition-all duration-500"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced CTA Section */}
          <div className="text-center relative">
            {/* Background glow effects */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-blue-500/10 to-indigo-500/5 rounded-3xl blur-2xl"></div>

            <div className="relative z-10 py-12">
              <div className="mb-8">
                <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-300 via-blue-400 to-indigo-400 bg-clip-text text-transparent mb-6 leading-tight">
                  Ready to Transform Your Organization?
                </h2>
                <div className="flex items-center justify-center mb-6">
                  <div className="w-24 h-px bg-gradient-to-r from-transparent to-cyan-400"></div>
                  <div className="w-3 h-3 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full mx-4 animate-pulse-bright"></div>
                  <div className="w-24 h-px bg-gradient-to-l from-transparent to-indigo-400"></div>
                </div>
                <p className="text-xl text-slate-200 mb-10 max-w-3xl mx-auto leading-relaxed">
                  Start with our free diagnostic assessment or explore our AI tools to see the possibilities.
                  <span className="block mt-2 text-lg text-slate-400">Join thousands of organizations already transforming with AI.</span>
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link
                  href="/enterprise/diagnostic"
                  className="group relative px-10 py-5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/30 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 to-white/0 group-hover:from-white/10 group-hover:to-white/10 transition-all duration-300"></div>
                  <span className="relative flex items-center justify-center">
                    Start Free Assessment
                    <span className="ml-2 transform group-hover:translate-x-1 transition-transform duration-300">🚀</span>
                  </span>
                </Link>

                <Link
                  href="/chat"
                  className="group relative px-10 py-5 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-600/50 hover:border-slate-500/70 text-white font-bold rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl backdrop-blur-xl overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-700/0 to-slate-700/0 group-hover:from-slate-600/20 group-hover:to-slate-600/20 transition-all duration-300"></div>
                  <span className="relative flex items-center justify-center">
                    Try AI Chat
                    <span className="ml-2 transform group-hover:translate-x-1 transition-transform duration-300">💬</span>
                  </span>
                </Link>
              </div>

              {/* Trust indicators */}
              <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-8 text-slate-400 text-sm">
                <div className="flex items-center">
                  <span className="text-green-400 mr-2">✓</span>
                  No credit card required
                </div>
                <div className="flex items-center">
                  <span className="text-green-400 mr-2">✓</span>
                  5-minute setup
                </div>
                <div className="flex items-center">
                  <span className="text-green-400 mr-2">✓</span>
                  Enterprise-grade security
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}