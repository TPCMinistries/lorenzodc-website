'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function LorenzoHomepage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950">
        <div className="flex items-center justify-center h-screen">
          <div className="text-white">Loading...</div>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950">

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-4 overflow-hidden">
        {/* Enhanced Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-indigo-600/30 to-purple-600/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-1/3 -left-40 w-96 h-96 bg-gradient-to-br from-violet-600/25 to-pink-600/15 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-gradient-to-br from-amber-500/20 to-yellow-600/10 rounded-full blur-3xl animate-pulse delay-2000" />
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-br from-emerald-500/15 to-teal-600/10 rounded-full blur-3xl animate-bounce" />

          {/* Floating Divine Elements */}
          <div className="absolute top-20 left-1/4 w-4 h-4 bg-amber-400/40 rounded-full animate-bounce delay-500" />
          <div className="absolute top-32 right-1/3 w-3 h-3 bg-yellow-500/30 rounded-full animate-pulse delay-700" />
          <div className="absolute top-60 left-1/6 w-2 h-2 bg-amber-300/50 rounded-full animate-ping delay-1000" />
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center">

            {/* Main Title - Prominently featuring Lorenzo's name */}
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 animate-pulse text-6xl md:text-7xl">
                Lorenzo
              </span>
              <span className="text-4xl md:text-5xl">Daughtry-Chambers</span>
              <span className="block text-2xl md:text-3xl text-gray-300 mt-4">
                Strategic Leadership & AI Implementation
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Transforming visionary leaders and enterprises through strategic intelligence,
              AI innovation, and systematic implementation frameworks.
            </p>

            {/* Hero CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link
                href="/lorenzo/assessment"
                className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:shadow-2xl transition-all transform hover:scale-105"
              >
                Strategic Assessment
              </Link>
              <Link
                href="https://calendly.com/lorenzo-theglobalenterprise/discovery-call"
                className="px-8 py-4 bg-white/10 backdrop-blur text-white font-semibold rounded-lg border border-white/20 hover:bg-white/20 transition-all"
              >
                Book Strategy Session
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center gap-8 text-gray-400">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Transforming Leaders Globally</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Strategic Capital Investment</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>25+ Nations Impacted</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Three Pillars Section */}
      <section className="py-20 px-4 bg-black/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-white mb-12">
            Three Pillars of Transformation
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Strategic Consulting */}
            <div className="group bg-white/5 backdrop-blur-xl rounded-xl p-8 border border-amber-500/20 hover:border-amber-400/40 hover:bg-white/10 transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/10 hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-full flex items-center justify-center mb-6 group-hover:animate-pulse">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-white mb-4">Strategic Consulting</h3>
              <p className="text-gray-300 mb-6">
                Executive-level strategic guidance combining visionary thinking with systematic execution frameworks.
              </p>
              <Link href="/lorenzo/speaking" className="text-amber-400 hover:text-amber-300 font-semibold group-hover:text-amber-200 transition-colors">
                Explore Consulting →
              </Link>
            </div>

            {/* Catalyst AI Platform */}
            <div className="group bg-white/5 backdrop-blur-xl rounded-xl p-8 border border-indigo-500/20 hover:border-indigo-400/40 hover:bg-white/10 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10 hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center mb-6 group-hover:animate-pulse">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-white mb-4">Catalyst AI Platform</h3>
              <p className="text-gray-300 mb-6">
                Enterprise AI implementation with systematic frameworks for exponential growth and operational excellence.
              </p>
              <Link href="/catalyst" className="text-indigo-400 hover:text-indigo-300 font-semibold group-hover:text-indigo-200 transition-colors">
                Launch Catalyst Path →
              </Link>
            </div>

            {/* Strategic Investment */}
            <div className="group bg-white/5 backdrop-blur-xl rounded-xl p-8 border border-emerald-500/20 hover:border-emerald-400/40 hover:bg-white/10 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/10 hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-full flex items-center justify-center mb-6 group-hover:animate-pulse">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-white mb-4">Strategic Investment</h3>
              <p className="text-gray-300 mb-6">
                Strategic fund deploying capital into transformative ventures that generate sustainable returns and global impact.
              </p>
              <Link href="/lorenzo/investment-fund" className="text-emerald-400 hover:text-emerald-300 font-semibold group-hover:text-emerald-200 transition-colors">
                View Investment Fund →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials & Social Proof */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">
              Transforming Visionary Leaders
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              See how strategic intelligence and AI implementation are creating breakthrough results
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {/* Testimonial 1 */}
            <div className="bg-white/5 backdrop-blur-xl rounded-xl p-8 border border-violet-500/20 hover:border-violet-400/40 transition-all duration-300 hover:shadow-xl hover:shadow-violet-500/10">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-violet-600 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">DR</span>
                </div>
                <div className="ml-4">
                  <h4 className="text-white font-semibold">Sarah C.</h4>
                  <p className="text-gray-400 text-sm">Global Ministry Leader</p>
                </div>
              </div>
              <p className="text-gray-300 italic mb-4">
                "Lorenzo's strategic framework transformed our organization's approach to technology. We've seen 300% growth in global impact while maintaining our core mission."
              </p>
              <div className="flex text-amber-400">
                {"★".repeat(5)}
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white/5 backdrop-blur-xl rounded-xl p-8 border border-emerald-500/20 hover:border-emerald-400/40 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/10">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">MJ</span>
                </div>
                <div className="ml-4">
                  <h4 className="text-white font-semibold">Marcus J.</h4>
                  <p className="text-gray-400 text-sm">CEO, Strategic Enterprises</p>
                </div>
              </div>
              <p className="text-gray-300 italic mb-4">
                "The Catalyst AI platform didn't just increase our revenue by 250% - it aligned our business with our core mission. This is the future of strategic business."
              </p>
              <div className="flex text-amber-400">
                {"★".repeat(5)}
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white/5 backdrop-blur-xl rounded-xl p-8 border border-amber-500/20 hover:border-amber-400/40 transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/10">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-600 to-yellow-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">RP</span>
                </div>
                <div className="ml-4">
                  <h4 className="text-white font-semibold">Rachel W.</h4>
                  <p className="text-gray-400 text-sm">Ministry Leader</p>
                </div>
              </div>
              <p className="text-gray-300 italic mb-4">
                "Lorenzo's strategic intelligence combined with AI tools gave us clarity on our next decade of growth. We're now reaching 10x more people with our mission."
              </p>
              <div className="flex text-amber-400">
                {"★".repeat(5)}
              </div>
            </div>
          </div>

          {/* Live Metrics */}
          <div className="bg-gradient-to-r from-slate-900/50 to-slate-800/50 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-amber-400 mb-2">Global</div>
                <div className="text-gray-300">Leadership Impact</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-emerald-400 mb-2">Strategic</div>
                <div className="text-gray-300">Capital Initiative</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-indigo-400 mb-2">25+</div>
                <div className="text-gray-300">Nations Impacted</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-400 mb-2">98%</div>
                <div className="text-gray-300">Success Rate</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive AI Demo */}
      <section className="py-20 px-4 bg-black/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">
              Experience the
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-500">
                Catalyst AI Platform
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              See how our AI tools integrate seamlessly with strategic intelligence to create breakthrough results
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Demo Preview */}
            <div className="relative">
              <div className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl rounded-2xl p-8 border border-indigo-500/30 shadow-2xl shadow-indigo-500/10">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-white font-semibold text-lg">AI Coaching Chat</h3>
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-indigo-600/20 rounded-lg p-4 ml-8">
                    <p className="text-gray-200 text-sm">
                      "Help me align my business strategy with my core mission"
                    </p>
                  </div>

                  <div className="bg-slate-700/50 rounded-lg p-4 mr-8">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-xs">AI</span>
                      </div>
                      <p className="text-gray-200 text-sm leading-relaxed">
                        Based on your strategic assessment, I see three key areas where your business can align with your core purpose: <span className="text-amber-400">impact leadership</span>, <span className="text-emerald-400">sustainable growth</span>, and <span className="text-indigo-400">strategic innovation</span>.
                      </p>
                    </div>
                  </div>

                  <div className="bg-indigo-600/20 rounded-lg p-4 ml-8">
                    <p className="text-gray-200 text-sm">
                      "Show me specific action steps"
                    </p>
                  </div>

                  <div className="bg-slate-700/50 rounded-lg p-4 mr-8">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-full flex items-center justify-center animate-pulse">
                        <span className="text-white font-bold text-xs">AI</span>
                      </div>
                      <p className="text-gray-200 text-sm">
                        <span className="text-gray-400">Generating strategic business plan...</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating action button */}
              <div className="absolute -bottom-4 -right-4">
                <Link href="/chat" className="group">
                  <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-full flex items-center justify-center shadow-2xl shadow-amber-500/30 group-hover:scale-110 transition-transform cursor-pointer">
                    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                </Link>
              </div>
            </div>

            {/* Features List */}
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-white font-semibold text-lg mb-2">Strategic Intelligence</h4>
                  <p className="text-gray-300">AI trained on strategic principles to provide mission-aligned business guidance</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-white font-semibold text-lg mb-2">Real-Time Analytics</h4>
                  <p className="text-gray-300">Track both financial performance and impact metrics in real-time dashboards</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-600 to-yellow-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-white font-semibold text-lg mb-2">Strategic Implementation</h4>
                  <p className="text-gray-300">90-day execution plans that bridge vision with practical, measurable action steps</p>
                </div>
              </div>

              <div className="pt-6">
                <Link href="/chat" className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-amber-600 to-yellow-600 text-white font-semibold rounded-lg hover:shadow-2xl hover:shadow-amber-500/20 transition-all transform hover:scale-105">
                  Try AI Coaching Free
                  <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Educational Content & Resources */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent mb-6">
              Educational Resources & Insights
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Deepen your understanding of strategic intelligence, AI integration, and mission-minded business practices
              through curated content and exclusive insights.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {/* Strategic Insights */}
            <div className="bg-gradient-to-br from-blue-900/30 to-indigo-900/30 rounded-xl p-8 border border-blue-500/20 hover:border-blue-400/40 transition-all group">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Strategic Insights</h3>
              <p className="text-gray-300 mb-6">Weekly articles on strategic principles, business insights, and marketplace dynamics.</p>
              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-400">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
                  Strategic Framework
                </div>
                <div className="flex items-center text-sm text-gray-400">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
                  Business Models
                </div>
                <div className="flex items-center text-sm text-gray-400">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
                  Marketplace Dynamics
                </div>
              </div>
            </div>

            {/* AI Training Center */}
            <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 rounded-xl p-8 border border-purple-500/20 hover:border-purple-400/40 transition-all group">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">AI Training Center</h3>
              <p className="text-gray-300 mb-6">Comprehensive courses on AI implementation, automation strategies, and ethical technology adoption for ministry and business.</p>
              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-400">
                  <span className="w-2 h-2 bg-purple-400 rounded-full mr-3"></span>
                  AI Implementation Masterclass
                </div>
                <div className="flex items-center text-sm text-gray-400">
                  <span className="w-2 h-2 bg-purple-400 rounded-full mr-3"></span>
                  Ethical AI for Ministry
                </div>
                <div className="flex items-center text-sm text-gray-400">
                  <span className="w-2 h-2 bg-purple-400 rounded-full mr-3"></span>
                  Automation Strategy Workshop
                </div>
              </div>
            </div>

            {/* Leadership Development */}
            <div className="bg-gradient-to-br from-emerald-900/30 to-teal-900/30 rounded-xl p-8 border border-emerald-500/20 hover:border-emerald-400/40 transition-all group">
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Leadership Development</h3>
              <p className="text-gray-300 mb-6">Programs designed to raise up strategic leaders who can navigate the intersection of mission, technology, and business excellence.</p>
              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-400">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full mr-3"></span>
                  Strategic Leadership Academy
                </div>
                <div className="flex items-center text-sm text-gray-400">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full mr-3"></span>
                  Executive Coaching Program
                </div>
                <div className="flex items-center text-sm text-gray-400">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full mr-3"></span>
                  Next-Gen Leadership Track
                </div>
              </div>
            </div>
          </div>

          {/* Featured Content Preview */}
          <div className="bg-gradient-to-r from-slate-800/50 to-slate-900/50 rounded-2xl p-8 border border-white/10">
            <div className="flex flex-col lg:flex-row items-center gap-8">
              <div className="flex-1">
                <div className="flex items-center mb-4">
                  <span className="bg-gradient-to-r from-amber-500 to-yellow-500 text-black px-3 py-1 rounded-full text-sm font-semibold mr-4">
                    Featured Article
                  </span>
                  <span className="text-gray-400 text-sm">Published this week</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  "The Strategic Edge: How AI Amplifies Leadership in Business"
                </h3>
                <p className="text-gray-300 mb-6">
                  Discover how artificial intelligence can serve as a tool for amplifying strategic insights
                  and leadership in your business operations, without compromising core values.
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="px-3 py-1 bg-indigo-600/20 text-indigo-300 rounded-full text-sm">AI Strategy</span>
                  <span className="px-3 py-1 bg-purple-600/20 text-purple-300 rounded-full text-sm">Strategic Wisdom</span>
                  <span className="px-3 py-1 bg-emerald-600/20 text-emerald-300 rounded-full text-sm">Business Excellence</span>
                </div>
                <button className="inline-flex items-center text-white font-semibold hover:text-blue-400 transition-colors">
                  Read Full Article
                  <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
              <div className="w-full lg:w-80 h-48 bg-gradient-to-br from-indigo-600/20 to-purple-600/20 rounded-xl flex items-center justify-center border border-indigo-500/30">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <p className="text-gray-400 text-sm">Article Preview</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Strategic Assessment CTA */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-br from-indigo-900/50 to-purple-900/50 rounded-2xl p-12 border border-purple-500/30">
            <h2 className="text-4xl font-bold text-white mb-6">
              Discover Your Strategic Assignment
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Take our Strategic Clarity Assessment to unlock personalized guidance that aligns
              your calling with systematic implementation strategies.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/lorenzo/assessment"
                className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:shadow-2xl transition-all transform hover:scale-105"
              >
                Start Your Assessment
              </Link>
              <Link
                href="/lorenzo/connect"
                className="px-8 py-4 bg-white/10 backdrop-blur text-white font-semibold rounded-lg border border-white/20 hover:bg-white/20 transition-all"
              >
                Connect With Lorenzo
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="text-white font-semibold mb-4">Strategic Consulting</h4>
              <ul className="space-y-2">
                <li><Link href="/lorenzo/speaking" className="text-gray-400 hover:text-white">Strategic Consulting</Link></li>
                <li><Link href="/lorenzo/assessment" className="text-gray-400 hover:text-white">Clarity Assessment</Link></li>
                <li><Link href="/lorenzo/ministry" className="text-gray-400 hover:text-white">Ministry Partnership</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Catalyst Path</h4>
              <ul className="space-y-2">
                <li><Link href="/enterprise/ai-readiness" className="text-gray-400 hover:text-white">AI Readiness</Link></li>
                <li><Link href="/enterprise/roi" className="text-gray-400 hover:text-white">ROI Calculator</Link></li>
                <li><Link href="/community" className="text-gray-400 hover:text-white">Executive Community</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Social Impact</h4>
              <ul className="space-y-2">
                <li><Link href="/lorenzo/ministry" className="text-gray-400 hover:text-white">TPC Ministries</Link></li>
                <li><Link href="/lorenzo/investment-fund" className="text-gray-400 hover:text-white">Investment Fund</Link></li>
                <li><Link href="/lorenzo/social-ventures" className="text-gray-400 hover:text-white">Strategic Ventures</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Connect</h4>
              <ul className="space-y-2">
                <li><Link href="/lorenzo/connect" className="text-gray-400 hover:text-white">Contact Lorenzo</Link></li>
                <li><a href="https://calendly.com/lorenzo-theglobalenterprise/discovery-call" className="text-gray-400 hover:text-white">Book Strategy Call</a></li>
                <li><Link href="/learning" className="text-gray-400 hover:text-white">Resources</Link></li>
              </ul>
            </div>
          </div>

          <div className="text-center text-gray-400 pt-8 border-t border-white/10">
            <p>&copy; 2024 Lorenzo Daughtry-Chambers. Strategic Leadership + Systematic Implementation.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}