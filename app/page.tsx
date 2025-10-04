'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Home() {
  const [activeEnterprise, setActiveEnterprise] = useState<string | null>(null);

  const enterprises = [
    {
      id: 'ministry',
      title: 'TPC Ministries',
      subtitle: 'Global Kingdom Impact',
      description: 'Prophetic ministry spanning 25+ nations with 147 churches planted and 50,000+ lives transformed',
      metrics: ['25+ Nations', '147 Churches', '$2.3M+ Invested'],
      color: 'from-amber-500 to-orange-500',
      href: '/lorenzo/ministry'
    },
    {
      id: 'investment',
      title: 'Global Development Investment Fund',
      subtitle: 'Strategic Capital Deployment',
      description: '$50M strategic fund generating 35%+ annual IRR while creating kingdom impact',
      metrics: ['$50M Fund', '35%+ IRR', '2,500+ Jobs Created'],
      color: 'from-emerald-500 to-teal-500',
      href: '/lorenzo/investment-fund'
    },
    {
      id: 'institute',
      title: 'Global Development Institute',
      subtitle: 'Research & Academic Leadership',
      description: 'Evidence-based solutions with 127 research papers and partnerships across 34 universities',
      metrics: ['127 Papers', '34 Universities', '$12M Research'],
      color: 'from-blue-500 to-cyan-500',
      href: '/lorenzo/institute'
    },
    {
      id: 'catalyst',
      title: 'Catalyst AI Platform',
      subtitle: 'Divine Strategy Technology',
      description: 'AI implementation combining spiritual intelligence with systematic business frameworks',
      metrics: ['24/7 Access', 'Enterprise AI', 'Proven ROI'],
      color: 'from-purple-500 to-pink-500',
      href: '/chat'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-emerald-500/10"></div>

        <div className="relative max-w-7xl mx-auto px-6 py-20">
          <div className="text-center">
            {/* Main Identity */}
            <div className="mb-12">
              <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-amber-300 via-purple-400 to-emerald-400 bg-clip-text text-transparent">
                Lorenzo Daughtry-Chambers
              </h1>
              <p className="text-2xl md:text-3xl text-slate-200 max-w-4xl mx-auto leading-relaxed mb-4">
                <span className="text-amber-400 font-semibold">Divine Strategy</span> •
                <span className="text-purple-400 font-semibold"> Global Impact</span> •
                <span className="text-emerald-400 font-semibold"> Kingdom Economics</span>
              </p>
              <p className="text-lg text-slate-300 max-w-3xl mx-auto">
                Bridging spiritual intelligence with systematic business implementation across ministry, investment, research, and technology platforms spanning 25+ nations.
              </p>
            </div>

            {/* Global Impact Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-6 mb-16 text-slate-400 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
                <span>25+ Nations Impacted</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                <span>$50M+ Strategic Capital</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                <span>147 Churches Planted</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <span>127 Research Papers</span>
              </div>
            </div>

            {/* Enterprise Ecosystem */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto mb-16">
              {enterprises.map((enterprise) => (
                <div
                  key={enterprise.id}
                  className="group bg-slate-800/30 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 hover:border-slate-600/50 transition-all duration-300 hover:scale-105 cursor-pointer"
                  onMouseEnter={() => setActiveEnterprise(enterprise.id)}
                  onMouseLeave={() => setActiveEnterprise(null)}
                >
                  <div className={`w-12 h-12 bg-gradient-to-r ${enterprise.color} rounded-xl flex items-center justify-center mb-4 mx-auto`}>
                    <div className="w-6 h-6 bg-white rounded opacity-90"></div>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2 text-center">{enterprise.title}</h3>
                  <p className={`text-sm font-medium mb-3 text-center bg-gradient-to-r ${enterprise.color} bg-clip-text text-transparent`}>
                    {enterprise.subtitle}
                  </p>
                  <p className="text-slate-300 text-sm mb-4 text-center leading-relaxed">
                    {enterprise.description}
                  </p>
                  <div className="space-y-2 mb-4">
                    {enterprise.metrics.map((metric, idx) => (
                      <div key={idx} className="flex items-center justify-center gap-2 text-xs text-slate-400">
                        <div className={`w-1 h-1 bg-gradient-to-r ${enterprise.color} rounded-full`}></div>
                        <span>{metric}</span>
                      </div>
                    ))}
                  </div>
                  <Link
                    href={enterprise.href}
                    className={`block w-full text-center py-2 px-4 bg-gradient-to-r ${enterprise.color} hover:opacity-90 text-white text-sm font-medium rounded-lg transition-all duration-200`}
                  >
                    Explore Platform
                  </Link>
                </div>
              ))}
            </div>

            {/* Strategic Services */}
            <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {/* Divine Strategy Coaching */}
              <div className="bg-slate-800/30 backdrop-blur-xl border border-slate-700/30 rounded-2xl p-6 text-center">
                <div className="text-amber-400 text-4xl mb-4">⚡</div>
                <h3 className="text-xl font-semibold text-white mb-2">Divine Strategy Coaching</h3>
                <p className="text-slate-300 text-sm mb-4">Breakthrough sessions combining spiritual intelligence with systematic implementation.</p>
                <div className="text-xs text-slate-400 mb-4">From $1,997 • 6-month programs available</div>
                <Link
                  href="/lorenzo/connect"
                  className="inline-block bg-amber-600 hover:bg-amber-700 text-white font-medium py-3 px-6 rounded-xl transition-colors"
                >
                  Book Strategy Session
                </Link>
              </div>

              {/* Renewal Sanctuary */}
              <div className="bg-slate-800/30 backdrop-blur-xl border border-slate-700/30 rounded-2xl p-6 text-center">
                <div className="text-emerald-400 text-4xl mb-4">🏔️</div>
                <h3 className="text-xl font-semibold text-white mb-2">Renewal Sanctuary</h3>
                <p className="text-slate-300 text-sm mb-4">Executive restoration retreats for spiritual and strategic renewal.</p>
                <div className="text-xs text-slate-400 mb-4">Weekend intensives • Extended sabbaticals</div>
                <Link
                  href="/lorenzo/renewal-sanctuary"
                  className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 px-6 rounded-xl transition-colors"
                >
                  Explore Sanctuary
                </Link>
              </div>

              {/* Speaking & Consulting */}
              <div className="bg-slate-800/30 backdrop-blur-xl border border-slate-700/30 rounded-2xl p-6 text-center">
                <div className="text-purple-400 text-4xl mb-4">🎤</div>
                <h3 className="text-xl font-semibold text-white mb-2">Speaking & Consulting</h3>
                <p className="text-slate-300 text-sm mb-4">Global speaking on divine strategy, kingdom economics, and prophetic leadership.</p>
                <div className="text-xs text-slate-400 mb-4">250+ events • 45+ countries</div>
                <Link
                  href="/lorenzo/speaking"
                  className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-xl transition-colors"
                >
                  Book Speaking
                </Link>
              </div>
            </div>

            {/* Kingdom Stewardship Transparency */}
            <div className="mt-16 bg-slate-800/20 backdrop-blur-xl border border-slate-700/30 rounded-2xl p-8 max-w-4xl mx-auto">
              <h3 className="text-xl font-bold text-center text-white mb-4">Kingdom Stewardship Commitment</h3>
              <p className="text-slate-300 text-center mb-6">
                20% of all profits systematically allocated to kingdom purposes with full transparency and annual reporting.
              </p>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-amber-400 font-bold text-lg">40%</div>
                  <div className="text-slate-400 text-sm">Global Missions</div>
                </div>
                <div>
                  <div className="text-emerald-400 font-bold text-lg">25%</div>
                  <div className="text-slate-400 text-sm">Church Planting</div>
                </div>
                <div>
                  <div className="text-purple-400 font-bold text-lg">20%</div>
                  <div className="text-slate-400 text-sm">Education</div>
                </div>
                <div>
                  <div className="text-blue-400 font-bold text-lg">15%</div>
                  <div className="text-slate-400 text-sm">Community</div>
                </div>
              </div>
            </div>

            {/* Trust & Access Indicators */}
            <div className="mt-16 text-center">
              <p className="text-slate-400 text-sm mb-4">
                Trusted by leaders spanning ministry, enterprise, investment, and global development sectors
              </p>
              <div className="flex justify-center items-center gap-4 text-slate-500 text-xs flex-wrap">
                <span>🌍 25+ Nations</span>
                <span>•</span>
                <span>📞 Direct Access</span>
                <span>•</span>
                <span>⚡ Systematic Implementation</span>
                <span>•</span>
                <span>🔒 Kingdom Aligned</span>
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
              <div className="text-white font-semibold">Ready to explore divine strategy for your enterprise?</div>
              <div className="text-slate-400 text-sm">Connect with Lorenzo for strategic consultation across any domain.</div>
            </div>
            <Link
              href="/lorenzo/connect"
              className="bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-600 hover:to-emerald-600 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300 whitespace-nowrap"
            >
              Connect with Lorenzo →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}