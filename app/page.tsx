'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Home() {
  const [showAssessmentPreview, setShowAssessmentPreview] = useState(false);

  const assessmentQuestions = [
    "How would you rate your organization's current AI readiness?",
    "What's your biggest challenge with AI implementation?",
    "What's your target timeline for AI deployment?"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-blue-500/10"></div>

        <div className="relative max-w-7xl mx-auto px-6 py-20">
          <div className="text-center">
            {/* Main Value Proposition */}
            <div className="mb-8">
              <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-cyan-300 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                AI Strategy That Actually Works
              </h1>
              <p className="text-xl md:text-2xl text-slate-200 max-w-4xl mx-auto leading-relaxed">
                The only AI consultant who <span className="text-cyan-400 font-semibold">practices what he preaches</span> —
                combining proven enterprise frameworks with actual AI tools you can use today.
              </p>
            </div>

            {/* Credibility Indicators */}
            <div className="flex justify-center items-center gap-8 mb-12 text-slate-400 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>500+ Businesses Helped</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                <span>90-Day Implementation</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                <span>Proven ROI Results</span>
              </div>
            </div>

            {/* Primary CTA Section */}
            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 max-w-4xl mx-auto mb-16">
              <h2 className="text-2xl font-bold text-white mb-4">
                See Your AI Potential in 60 Seconds
              </h2>
              <p className="text-slate-300 mb-6">
                Get instant insights into your organization's AI readiness and ROI potential.
              </p>

              {!showAssessmentPreview ? (
                <div className="space-y-4">
                  <button
                    onClick={() => setShowAssessmentPreview(true)}
                    className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    Start Free AI Assessment →
                  </button>
                  <div className="flex justify-center gap-6 text-sm text-slate-400">
                    <span>✓ No email required</span>
                    <span>✓ Instant results</span>
                    <span>✓ Enterprise-focused</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-slate-900/50 rounded-xl p-6">
                    <div className="text-left space-y-4">
                      <div className="text-cyan-400 font-medium">Question 1 of 3:</div>
                      <div className="text-white text-lg">{assessmentQuestions[0]}</div>
                      <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
                        {[1,2,3,4,5].map(num => (
                          <button key={num} className="px-4 py-2 bg-slate-700 hover:bg-cyan-600 text-white rounded-lg transition-colors">
                            {num}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <Link
                    href="/ai-assessment"
                    className="block w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 text-center"
                  >
                    Complete Full Assessment →
                  </Link>
                </div>
              )}
            </div>

            {/* Social Proof & Alternative CTAs */}
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {/* Enterprise Consultation */}
              <div className="bg-slate-800/30 backdrop-blur-xl border border-slate-700/30 rounded-2xl p-6 text-center">
                <div className="text-amber-400 text-4xl mb-4">💼</div>
                <h3 className="text-xl font-semibold text-white mb-2">Enterprise Strategy</h3>
                <p className="text-slate-300 text-sm mb-4">Ready for serious AI implementation? Get a custom 90-day roadmap.</p>
                <Link
                  href="/lorenzo/connect"
                  className="inline-block bg-amber-600 hover:bg-amber-700 text-white font-medium py-3 px-6 rounded-xl transition-colors"
                >
                  Book Consultation
                </Link>
              </div>

              {/* AI Tools Demo */}
              <div className="bg-slate-800/30 backdrop-blur-xl border border-slate-700/30 rounded-2xl p-6 text-center">
                <div className="text-cyan-400 text-4xl mb-4">🤖</div>
                <h3 className="text-xl font-semibold text-white mb-2">Try AI Tools</h3>
                <p className="text-slate-300 text-sm mb-4">Experience the AI strategy coach and ROI calculator yourself.</p>
                <Link
                  href="/chat"
                  className="inline-block bg-cyan-600 hover:bg-cyan-700 text-white font-medium py-3 px-6 rounded-xl transition-colors"
                >
                  Start AI Chat
                </Link>
              </div>

              {/* ROI Calculator */}
              <div className="bg-slate-800/30 backdrop-blur-xl border border-slate-700/30 rounded-2xl p-6 text-center">
                <div className="text-purple-400 text-4xl mb-4">📊</div>
                <h3 className="text-xl font-semibold text-white mb-2">Calculate ROI</h3>
                <p className="text-slate-300 text-sm mb-4">See the potential return on your AI investment in minutes.</p>
                <Link
                  href="/enterprise/roi"
                  className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-xl transition-colors"
                >
                  ROI Calculator
                </Link>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="mt-16 text-center">
              <p className="text-slate-400 text-sm mb-4">
                Trusted by enterprises ready to implement AI strategically
              </p>
              <div className="flex justify-center items-center gap-4 text-slate-500 text-xs">
                <span>🔒 Enterprise Security</span>
                <span>•</span>
                <span>📞 Direct Access to Lorenzo</span>
                <span>•</span>
                <span>⚡ 90-Day Implementation</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA Bar */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 border-t border-slate-700">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <div className="text-white font-semibold">Ready to transform your business with AI?</div>
              <div className="text-slate-400 text-sm">Book a strategy session and get your 90-day implementation plan.</div>
            </div>
            <Link
              href="/lorenzo/connect"
              className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300 whitespace-nowrap"
            >
              Schedule Strategy Session →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}