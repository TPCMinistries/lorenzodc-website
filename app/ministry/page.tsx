'use client';

import Link from 'next/link';
import { useState } from 'react';
import GlobalNavigation from '../components/GlobalNavigation';

export default function Ministry() {
  const [activeMinistry, setActiveMinistry] = useState<string | null>(null);

  const ministryPillars = [
    {
      id: 'prophetic',
      title: 'Prophetic Ministry',
      description: 'Releasing prophetic words, visions, and divine strategies that align leadership with God\'s purposes and timing',
      features: ['Prophetic Activation Training', 'Divine Strategy Sessions', 'Seasonal Timing Guidance', 'Leadership Alignment'],
      icon: '⚡',
      color: 'from-amber-500 to-orange-500'
    },
    {
      id: 'healing',
      title: 'Healing & Restoration',
      description: 'Supernatural healing, emotional restoration, and breakthrough from limiting beliefs and strongholds',
      features: ['Supernatural Healing', 'Inner Healing Ministry', 'Marriage & Family Restoration', 'Leadership Renewal'],
      icon: '🙏',
      color: 'from-emerald-500 to-teal-500'
    },
    {
      id: 'kingdom',
      title: 'Kingdom Building',
      description: 'Establishing sustainable kingdom enterprises and community initiatives that demonstrate God\'s love practically',
      features: ['Church Planting', 'Kingdom Economics Training', 'Community Transformation', 'Business-Ministry Integration'],
      icon: '👑',
      color: 'from-purple-500 to-indigo-500'
    }
  ];

  const ministryImpact = [
    {
      metric: '15+',
      label: 'Nations Served',
      description: 'Global ministry presence'
    },
    {
      metric: '20+',
      label: 'Churches Supported',
      description: 'Across multiple countries'
    },
    {
      metric: '5K+',
      label: 'Lives Impacted',
      description: 'Through various programs'
    },
    {
      metric: '250+',
      label: 'Speaking Events',
      description: 'Global engagements'
    }
  ];

  const teachingTopics = [
    {
      title: 'Divine Strategy in the Age of AI',
      description: 'Integrating prophetic and artificial intelligence for kingdom advancement',
      audience: 'Leaders & Entrepreneurs'
    },
    {
      title: 'Kingdom Economics & Global Impact',
      description: 'Building sustainable enterprises with eternal returns',
      audience: 'Business Leaders'
    },
    {
      title: 'Prophetic Leadership in Crisis',
      description: 'Navigating uncertainty with divine intelligence and strategic wisdom',
      audience: 'Senior Leaders'
    },
    {
      title: 'Systematic Implementation of Divine Assignment',
      description: 'Moving from inspiration to measurable transformation',
      audience: 'Ministry Leaders'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <GlobalNavigation />

      <div className="relative overflow-hidden py-16 pt-24">
        {/* Enhanced Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 via-purple-500/10 to-emerald-500/5"></div>

          {/* Floating elements */}
          <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-amber-500/20 to-orange-600/20 rounded-3xl rotate-45 animate-float blur-xl"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-purple-500/25 to-indigo-600/25 rounded-2xl rotate-12 animate-float-delayed blur-lg"></div>
          <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-gradient-to-br from-emerald-500/15 to-teal-500/15 rounded-full animate-pulse-slow"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-6">
              <div className="w-20 h-1 bg-gradient-to-r from-transparent to-amber-400"></div>
              <div className="mx-6 text-6xl">👑</div>
              <div className="w-20 h-1 bg-gradient-to-l from-transparent to-purple-400"></div>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-amber-300 via-purple-400 to-emerald-400 bg-clip-text text-transparent">
              TPC Ministries
            </h1>

            <p className="text-lg md:text-xl text-slate-400 mb-6">
              Lorenzo Daughtry-Chambers • Founder/Lead Servant
            </p>

            <p className="text-xl md:text-2xl text-slate-200 max-w-4xl mx-auto leading-relaxed mb-6">
              <span className="text-amber-400 font-semibold">Divine Strategy</span> •
              <span className="text-purple-400 font-semibold"> Prophetic Leadership</span> •
              <span className="text-emerald-400 font-semibold"> Kingdom Economics</span>
            </p>

            <p className="text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Bridging the prophetic and practical through strategic spiritual intelligence.
              Equipping leaders to receive divine strategy and implement it systematically for measurable kingdom impact.
            </p>
          </div>

          {/* Ministry Impact Stats */}
          <div className="grid md:grid-cols-4 gap-6 mb-16">
            {ministryImpact.map((stat, idx) => (
              <div key={idx} className="text-center p-6 bg-slate-800/30 backdrop-blur-xl border border-slate-700/30 rounded-2xl">
                <div className="text-amber-400 font-bold text-3xl mb-2">{stat.metric}</div>
                <div className="text-slate-300 font-medium">{stat.label}</div>
                <div className="text-slate-500 text-sm mt-1">{stat.description}</div>
              </div>
            ))}
          </div>

          {/* Ministry Pillars */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ministry Pillars</h2>
              <p className="text-lg text-slate-300 max-w-3xl mx-auto">
                Three core areas where prophetic intelligence meets practical implementation for kingdom advancement
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {ministryPillars.map((pillar) => (
                <div
                  key={pillar.id}
                  className="group bg-slate-800/30 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 hover:border-slate-600/50 transition-all duration-500 hover:scale-105 cursor-pointer"
                  onMouseEnter={() => setActiveMinistry(pillar.id)}
                  onMouseLeave={() => setActiveMinistry(null)}
                >
                  <div className={`w-16 h-16 bg-gradient-to-r ${pillar.color} rounded-2xl flex items-center justify-center mb-6 mx-auto text-2xl group-hover:scale-110 transition-transform duration-300`}>
                    {pillar.icon}
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-4 text-center group-hover:text-amber-100 transition-colors">
                    {pillar.title}
                  </h3>

                  <p className="text-slate-300 text-center mb-6 leading-relaxed group-hover:text-slate-200 transition-colors">
                    {pillar.description}
                  </p>

                  <div className="space-y-3">
                    {pillar.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-3 text-sm text-slate-300">
                        <div className={`w-2 h-2 bg-gradient-to-r ${pillar.color} rounded-full flex-shrink-0`}></div>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* TPC Ministries Section */}
          <div className="bg-gradient-to-br from-slate-800/40 via-slate-800/60 to-slate-800/40 backdrop-blur-xl border border-slate-700/40 rounded-3xl p-12 mb-16">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">TPC Ministries</h2>
              <p className="text-lg text-slate-300 max-w-2xl mx-auto">
                The primary ministry platform combining prophetic intelligence with strategic implementation
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Ministry Focus</h3>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-slate-300">
                    <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                    <span>Prophetic activation and training</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-300">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span>Divine strategy development</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-300">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                    <span>Kingdom economics integration</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-300">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                    <span>Leadership development</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Global Impact</h3>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-slate-300">
                    <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                    <span>Church support across 15+ nations</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-300">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span>Community transformation initiatives</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-300">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                    <span>Kingdom business integration</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-300">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                    <span>Leadership network development</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center mt-8">
              <Link
                href="https://www.tpcmin.org"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-gradient-to-r from-amber-600 via-purple-600 to-emerald-600 hover:from-amber-700 hover:via-purple-700 hover:to-emerald-700 text-white font-bold text-lg px-8 py-4 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl"
              >
                Visit TPC Ministries →
              </Link>
            </div>
          </div>

          {/* Teaching Topics */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">Teaching & Speaking</h2>
              <p className="text-lg text-slate-300 max-w-3xl mx-auto">
                Global speaking ministry bridging prophetic intelligence with practical implementation across 15+ nations
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {teachingTopics.map((topic, idx) => (
                <div key={idx} className="bg-slate-800/30 backdrop-blur-xl border border-slate-700/30 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-white mb-3">{topic.title}</h3>
                  <p className="text-slate-300 mb-4 leading-relaxed">{topic.description}</p>
                  <div className="text-amber-400 text-sm font-medium">
                    Audience: {topic.audience}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center bg-gradient-to-r from-slate-800/40 to-slate-700/40 backdrop-blur-xl border border-slate-600/30 rounded-3xl p-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Experience Prophetic Leadership
            </h2>
            <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">
              Connect for prophetic ministry, divine strategy sessions, or speaking engagements that bridge
              the supernatural with systematic implementation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/lorenzo/connect"
                className="inline-block bg-gradient-to-r from-amber-600 via-purple-600 to-emerald-600 hover:from-amber-700 hover:via-purple-700 hover:to-emerald-700 text-white font-bold text-lg px-8 py-4 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl"
              >
                Book Ministry Session →
              </Link>
              <Link
                href="https://www.tpcmin.org"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-slate-800/80 hover:bg-slate-700/80 border border-slate-600/50 hover:border-slate-500/70 text-white font-bold text-lg px-8 py-4 rounded-2xl transition-all duration-300 transform hover:scale-105 backdrop-blur-xl"
              >
                Visit TPC Ministries →
              </Link>
            </div>
            <div className="mt-8 text-slate-400 text-sm">
              <span className="text-amber-400">✓</span> Prophetic strategy sessions •
              <span className="text-purple-400"> ✓</span> Speaking engagements •
              <span className="text-emerald-400"> ✓</span> Ministry consultation
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}