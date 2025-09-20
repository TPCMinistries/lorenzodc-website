"use client";
import Link from "next/link";

export default function EnterprisePage() {
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
              Executive Toolkit
            </h1>
            <p className="text-2xl text-slate-300 max-w-4xl mx-auto">
              From pilot to production with guardrails, ROI measurement, and governance.
              Start with diagnostics or quantify ROI, then scale with enterprise implementation.
            </p>
          </div>

          {/* Quick Tools Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <Link href="/enterprise/diagnostic">
              <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6 hover:border-slate-600/50 transition-all duration-300 cursor-pointer group">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center text-2xl mb-4">
                  📋
                </div>
                <h3 className="text-xl font-bold text-white mb-2">AI Readiness Diagnostic</h3>
                <p className="text-slate-300 text-sm mb-4">10-12 question assessment → score, tier, and prioritized roadmap. Download PDF or email it.</p>
                <button className="text-cyan-400 text-sm font-medium group-hover:text-cyan-300">Start Assessment →</button>
              </div>
            </Link>

            <Link href="/enterprise/roi">
              <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6 hover:border-slate-600/50 transition-all duration-300 cursor-pointer group">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center text-2xl mb-4">
                  📊
                </div>
                <h3 className="text-xl font-bold text-white mb-2">ROI Simulator</h3>
                <p className="text-slate-300 text-sm mb-4">Quantify hours saved, savings/month & year, and payback period.</p>
                <button className="text-cyan-400 text-sm font-medium group-hover:text-cyan-300">Calculate ROI →</button>
              </div>
            </Link>

            <Link href="/enterprise/rag">
              <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6 hover:border-slate-600/50 transition-all duration-300 cursor-pointer group">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-violet-600 rounded-2xl flex items-center justify-center text-2xl mb-4">
                  📄
                </div>
                <h3 className="text-xl font-bold text-white mb-2">AI Document Assistant</h3>
                <p className="text-slate-300 text-sm mb-4">Upload any PDF and chat with it using AI. Get instant insights and summaries.</p>
                <button className="text-cyan-400 text-sm font-medium group-hover:text-cyan-300">Try Demo →</button>
              </div>
            </Link>

            <Link href="/enterprise/blueprints">
              <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6 hover:border-slate-600/50 transition-all duration-300 cursor-pointer group">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl flex items-center justify-center text-2xl mb-4">
                  🎯
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Personalized AI Blueprint</h3>
                <p className="text-slate-300 text-sm mb-4">Get a comprehensive 90-day implementation roadmap worth $2,997, delivered within 24 hours.</p>
                <button className="text-cyan-400 text-sm font-medium group-hover:text-cyan-300">Generate Blueprint →</button>
              </div>
            </Link>
          </div>

          {/* Enterprise Services */}
          <div className="mb-16">
            <h2 className="text-4xl font-bold text-white text-center mb-12">Enterprise Implementation Services</h2>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Team Training */}
              <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-3xl flex items-center justify-center text-3xl mx-auto mb-6">
                  🎓
                </div>
                <h3 className="text-2xl font-bold text-white text-center mb-4">Team Training Programs</h3>
                <div className="text-slate-300 mb-6 space-y-2">
                  <p>• Leadership AI readiness workshops</p>
                  <p>• Department-specific implementation training</p>
                  <p>• Custom prompt engineering for your industry</p>
                  <p>• Change management and adoption strategies</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-2">$10K - $25K</div>
                  <div className="text-slate-400 mb-4">One-time engagement</div>
                  <button className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-400 hover:to-cyan-500 text-white rounded-2xl transition-all duration-200 font-medium">
                    Schedule Consultation
                  </button>
                </div>
              </div>

              {/* Implementation Services */}
              <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 border-purple-500/30">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-violet-600 rounded-3xl flex items-center justify-center text-3xl mx-auto mb-6">
                  ⚙️
                </div>
                <h3 className="text-2xl font-bold text-white text-center mb-4">Full Implementation</h3>
                <div className="text-slate-300 mb-6 space-y-2">
                  <p>• 6-month guided AI transformation</p>
                  <p>• Custom automation development</p>
                  <p>• Integration with existing systems</p>
                  <p>• Governance framework setup</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-2">$25K - $100K</div>
                  <div className="text-slate-400 mb-4">6-month program</div>
                  <button className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-400 hover:to-violet-500 text-white rounded-2xl transition-all duration-200 font-medium">
                    Get Proposal
                  </button>
                </div>
              </div>

              {/* Retainer Services */}
              <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-3xl flex items-center justify-center text-3xl mx-auto mb-6">
                  🤝
                </div>
                <h3 className="text-2xl font-bold text-white text-center mb-4">Ongoing Partnership</h3>
                <div className="text-slate-300 mb-6 space-y-2">
                  <p>• Monthly AI strategy consulting</p>
                  <p>• Quarterly optimization reviews</p>
                  <p>• Priority support and updates</p>
                  <p>• Access to latest AI developments</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-2">$5K - $15K/mo</div>
                  <div className="text-slate-400 mb-4">Monthly retainer</div>
                  <button className="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white rounded-2xl transition-all duration-200 font-medium">
                    Start Partnership
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Executive Briefing */}
          <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-12 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Executive Briefing</h2>
            <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
              Review your diagnostic & ROI, align on a 90-day pilot. Board-ready artifacts included.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <div className="text-2xl font-bold text-white">$1,500</div>
              <button className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold rounded-2xl transition-all duration-200">
                Book Briefing
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
