'use client';

import Link from 'next/link';
import { useState } from 'react';
import GlobalNavigation from './components/GlobalNavigation';

export default function Home() {
  const [activeArm, setActiveArm] = useState<string | null>(null);

  const gdiArms = [
    {
      id: 'nonprofit',
      title: 'GDI Nonprofit Foundation',
      subtitle: '501(c)(3) Impact Programs',
      description: 'Building relationships and trust through youth development, medical missions, and workforce training across emerging markets',
      metrics: ['15+ Years Experience', '5,000+ Lives Impacted', 'Government Partnerships'],
      color: 'from-amber-500 to-orange-500',
      href: '/perpetual-engine.html#programs'
    },
    {
      id: 'holdings',
      title: 'For-Profit Holdings',
      subtitle: 'Revenue-Generating Ecosystem',
      description: 'AI Incubator, $50M Impact Fund, education ventures, and strategic business units generating market-rate returns',
      metrics: ['$50M Fund', '20%+ Target IRR', '10% Profit Flow'],
      color: 'from-emerald-500 to-teal-500',
      href: '/perpetual-engine.html#holdings'
    },
    {
      id: 'catalyst',
      title: 'Kenya 2026 Mission',
      subtitle: 'The Catalyst Launch',
      description: 'Inaugural mission to prove the model - combining impact programs with incubator training and capital deployment',
      metrics: ['April 2026', 'Proof of Concept', 'Full Ecosystem'],
      color: 'from-red-500 to-pink-500',
      href: '/perpetual-engine.html#kenya'
    },
    {
      id: 'ai',
      title: 'Catalyst AI Platform',
      subtitle: 'Divine Strategy Technology',
      description: 'AI implementation combining spiritual intelligence with systematic business frameworks for enterprise transformation',
      metrics: ['24/7 Access', 'Enterprise AI', 'Proven ROI'],
      color: 'from-purple-500 to-indigo-500',
      href: '/catalyst'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <GlobalNavigation />
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-emerald-500/10"></div>

        <div className="relative max-w-7xl mx-auto px-6 py-20 pt-24">
          <div className="text-center">
            {/* Main Identity */}
            <div className="mb-12">
              <div className="mb-6">
                <p className="text-xl md:text-2xl text-slate-400 mb-2">Welcome to the website of</p>
                <h1 className="text-6xl md:text-8xl font-bold mb-4 bg-gradient-to-r from-amber-300 via-purple-400 to-emerald-400 bg-clip-text text-transparent">
                  Lorenzo Daughtry-Chambers
                </h1>
                <p className="text-2xl md:text-3xl text-slate-300 mb-6">
                  Founder & CEO, Global Development Institute
                </p>
              </div>
              <p className="text-xl md:text-2xl text-slate-200 max-w-4xl mx-auto leading-relaxed mb-4">
                <span className="text-amber-400 font-semibold">Divine Strategy</span> •
                <span className="text-purple-400 font-semibold"> Global Impact</span> •
                <span className="text-emerald-400 font-semibold"> Kingdom Economics</span>
              </p>
              <p className="text-lg text-slate-300 max-w-3xl mx-auto">
                Visionary leader architecting The Perpetual Engine - the first dual-arm ecosystem combining 501(c)(3) nonprofit impact with for-profit enterprise, creating sustainable capital flow for global transformation.
              </p>
            </div>

            {/* Global Impact Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-6 mb-16 text-slate-400 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
                <span>15+ Nations Served</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                <span>5,000+ Lives Impacted</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                <span>$50M Impact Fund</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <span>Perpetual Impact Model</span>
              </div>
            </div>

            {/* GDI Ecosystem */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto mb-16">
              {gdiArms.map((arm) => (
                <div
                  key={arm.id}
                  className="group bg-slate-800/30 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 hover:border-slate-600/50 transition-all duration-300 hover:scale-105 cursor-pointer"
                  onMouseEnter={() => setActiveArm(arm.id)}
                  onMouseLeave={() => setActiveArm(null)}
                >
                  <div className={`w-12 h-12 bg-gradient-to-r ${arm.color} rounded-xl flex items-center justify-center mb-4 mx-auto`}>
                    <div className="w-6 h-6 bg-white rounded opacity-90"></div>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2 text-center">{arm.title}</h3>
                  <p className={`text-sm font-medium mb-3 text-center bg-gradient-to-r ${arm.color} bg-clip-text text-transparent`}>
                    {arm.subtitle}
                  </p>
                  <p className="text-slate-300 text-sm mb-4 text-center leading-relaxed">
                    {arm.description}
                  </p>
                  <div className="space-y-2 mb-4">
                    {arm.metrics.map((metric, idx) => (
                      <div key={idx} className="flex items-center justify-center gap-2 text-xs text-slate-400">
                        <div className={`w-1 h-1 bg-gradient-to-r ${arm.color} rounded-full`}></div>
                        <span>{metric}</span>
                      </div>
                    ))}
                  </div>
                  <Link
                    href={arm.href}
                    className={`block w-full text-center py-2 px-4 bg-gradient-to-r ${arm.color} hover:opacity-90 text-white text-sm font-medium rounded-lg transition-all duration-200`}
                  >
                    Explore Arm
                  </Link>
                </div>
              ))}
            </div>

            {/* Perpetual Engine CTA */}
            <div className="max-w-4xl mx-auto text-center mb-16 p-8 bg-gradient-to-r from-slate-800/40 to-slate-700/40 backdrop-blur-xl border border-slate-600/30 rounded-3xl">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                See How The Perpetual Engine Works
              </h2>
              <p className="text-lg text-slate-300 mb-6 max-w-2xl mx-auto">
                Discover the complete dual-arm ecosystem where capital funds mission forever.
                Interactive presentation showing how nonprofit programs fuel for-profit returns that perpetually flow back.
              </p>
              <Link
                href="/perpetual-engine"
                className="inline-block bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 hover:from-indigo-700 hover:via-purple-700 hover:to-cyan-700 text-white font-bold text-lg px-8 py-4 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl"
              >
                Explore The Perpetual Engine →
              </Link>
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
                  href="/lorenzo/divine-strategy"
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
                  href="/renewal-sanctuary"
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
                <div className="text-xs text-slate-400 mb-4">250+ events • 15+ countries</div>
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
                10% of all for-profit profits flow perpetually to kingdom purposes with full transparency and systematic allocation.
              </p>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-amber-400 font-bold text-lg">40%</div>
                  <div className="text-slate-400 text-sm">Global Missions</div>
                </div>
                <div>
                  <div className="text-emerald-400 font-bold text-lg">25%</div>
                  <div className="text-slate-400 text-sm">Community Development</div>
                </div>
                <div>
                  <div className="text-purple-400 font-bold text-lg">20%</div>
                  <div className="text-slate-400 text-sm">Education Programs</div>
                </div>
                <div>
                  <div className="text-blue-400 font-bold text-lg">15%</div>
                  <div className="text-slate-400 text-sm">Healthcare Initiatives</div>
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