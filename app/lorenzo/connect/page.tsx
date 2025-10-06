'use client';

import Link from 'next/link';
import { useState } from 'react';
import GlobalNavigation from '../../components/GlobalNavigation';

export default function ConnectPage() {
  const [activeEngagement, setActiveEngagement] = useState<string | null>(null);

  const engagementPaths = [
    {
      id: 'divine-strategy',
      title: 'Divine Strategy Coaching',
      subtitle: 'Personal & Executive Coaching',
      description: 'One-on-one strategic coaching combining spiritual intelligence with systematic business frameworks for breakthrough results.',
      features: [
        'Personal Divine Strategy Sessions',
        'Executive Leadership Coaching',
        'Business Transformation Planning',
        'Spiritual Intelligence Development',
        'Kingdom Economics Implementation'
      ],
      investment: 'From $1,997 • 6-month programs available',
      cta: 'Book Strategy Session',
      href: 'https://calendly.com/lorenzo-theglobalenterprise/discovery-call',
      color: 'from-amber-500 to-orange-500',
      icon: '⚡'
    },
    {
      id: 'speaking',
      title: 'Speaking & Events',
      subtitle: 'Global Speaking Engagements',
      description: 'Dynamic presentations on divine strategy, kingdom economics, and prophetic leadership for conferences, corporations, and churches.',
      features: [
        'Keynote Speaking',
        'Corporate Workshops',
        'Church & Ministry Events',
        'Leadership Conferences',
        'Global Virtual Events'
      ],
      investment: '250+ events • 45+ countries served',
      cta: 'Book Speaking',
      href: '/lorenzo/speaking',
      color: 'from-purple-500 to-indigo-500',
      icon: '🎤'
    },
    {
      id: 'consulting',
      title: 'Strategic Consulting',
      subtitle: 'Enterprise Transformation',
      description: 'Comprehensive consulting for organizations seeking kingdom-aligned business transformation and sustainable impact models.',
      features: [
        'Organizational Assessment',
        'Strategic Planning & Implementation',
        'Capital Structure Optimization',
        'Impact Business Model Design',
        'Global Expansion Strategy'
      ],
      investment: 'Custom engagements • 3-12 month projects',
      cta: 'Explore Consulting',
      href: 'mailto:lorenzo@lorenzodaughtrychambers.com?subject=Strategic Consulting Inquiry',
      color: 'from-emerald-500 to-teal-500',
      icon: '🎯'
    },
    {
      id: 'ministry',
      title: 'Ministry Partnership',
      subtitle: 'TPC Ministries Collaboration',
      description: 'Partner with TPC Ministries for prophetic activation, divine strategy implementation, and kingdom business integration.',
      features: [
        'Prophetic Ministry Sessions',
        'Church Partnership Programs',
        'Kingdom Business Integration',
        'Leadership Development',
        'Global Mission Support'
      ],
      investment: 'Partnership opportunities available',
      cta: 'Connect with Ministry',
      href: 'https://www.tpcmin.org',
      color: 'from-cyan-500 to-blue-500',
      icon: '👑'
    },
    {
      id: 'catalyst-ai',
      title: 'Catalyst AI Platform',
      subtitle: 'Divine Strategy Technology',
      description: 'Implement Catalyst AI for your organization - combining spiritual intelligence with AI technology for strategic breakthrough.',
      features: [
        'AI Strategy Assessment',
        'Platform Implementation',
        'Custom AI Solutions',
        'Training & Support',
        'ROI Optimization'
      ],
      investment: 'Enterprise packages available',
      cta: 'Try Catalyst AI',
      href: '/catalyst',
      color: 'from-indigo-500 to-purple-500',
      icon: '🚀'
    },
    {
      id: 'investment',
      title: 'Investment Opportunities',
      subtitle: 'Perpetual Engine Participation',
      description: 'Explore investment opportunities in The Perpetual Engine ecosystem, including Renewal Sanctuary and impact ventures.',
      features: [
        'Impact Fund Participation',
        'Renewal Sanctuary Investment',
        'Venture Co-Investment',
        'Strategic Partnerships',
        'Kingdom-Aligned Returns'
      ],
      investment: 'Qualified investors only',
      cta: 'Investment Inquiry',
      href: 'mailto:lorenzo@lorenzodaughtrychambers.com?subject=Investment Inquiry',
      color: 'from-rose-500 to-pink-500',
      icon: '💼'
    }
  ];

  const quickConnect = [
    {
      method: 'Direct Email',
      value: 'lorenzo@lorenzodaughtrychambers.com',
      action: 'mailto:lorenzo@lorenzodaughtrychambers.com',
      icon: '📧',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      method: 'Calendar Booking',
      value: 'Schedule a strategic session',
      action: 'https://calendly.com/lorenzo-theglobalenterprise/discovery-call',
      icon: '📅',
      color: 'from-emerald-500 to-teal-500'
    },
    {
      method: 'LinkedIn',
      value: 'Professional networking',
      action: 'https://linkedin.com/in/lorenzodaughtrychambers',
      icon: '💼',
      color: 'from-purple-500 to-indigo-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <GlobalNavigation />

      <div className="relative overflow-hidden py-16 pt-40">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 via-purple-500/8 to-emerald-500/5"></div>

        <div className="relative max-w-7xl mx-auto px-6">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-6">
              <div className="w-20 h-1 bg-gradient-to-r from-transparent to-amber-400"></div>
              <div className="mx-6 text-6xl">🌐</div>
              <div className="w-20 h-1 bg-gradient-to-l from-transparent to-purple-400"></div>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-amber-300 via-purple-400 to-emerald-400 bg-clip-text text-transparent">
              Connect with Lorenzo
            </h1>

            <p className="text-xl md:text-2xl text-slate-200 max-w-4xl mx-auto leading-relaxed mb-6">
              <span className="text-amber-400 font-semibold">Strategic Partnership</span> •
              <span className="text-purple-400 font-semibold"> Divine Strategy</span> •
              <span className="text-emerald-400 font-semibold"> Global Impact</span>
            </p>

            <p className="text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Multiple pathways to connect and collaborate across divine strategy, global impact, and kingdom business transformation.
            </p>
          </div>

          {/* Engagement Pathways */}
          <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-16">
            {engagementPaths.map((path) => (
              <div
                key={path.id}
                className="group bg-slate-800/30 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 hover:border-slate-600/50 transition-all duration-500 hover:scale-105 cursor-pointer"
                onMouseEnter={() => setActiveEngagement(path.id)}
                onMouseLeave={() => setActiveEngagement(null)}
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${path.color} rounded-2xl flex items-center justify-center mb-6 mx-auto text-2xl group-hover:scale-110 transition-transform duration-300`}>
                  {path.icon}
                </div>

                <h3 className="text-2xl font-bold text-white mb-2 text-center group-hover:text-amber-100 transition-colors">
                  {path.title}
                </h3>
                <p className={`text-sm font-medium mb-4 text-center bg-gradient-to-r ${path.color} bg-clip-text text-transparent`}>
                  {path.subtitle}
                </p>
                <p className="text-slate-300 text-sm mb-6 text-center leading-relaxed group-hover:text-slate-200 transition-colors">
                  {path.description}
                </p>

                <div className="space-y-3 mb-6">
                  {path.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-sm text-slate-300">
                      <div className={`w-2 h-2 bg-gradient-to-r ${path.color} rounded-full flex-shrink-0`}></div>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="text-center mb-6">
                  <div className="text-xs text-slate-400 mb-4">{path.investment}</div>
                </div>

                <Link
                  href={path.href}
                  target={path.href.startsWith('http') ? '_blank' : undefined}
                  rel={path.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className={`block w-full text-center py-3 px-6 bg-gradient-to-r ${path.color} hover:opacity-90 text-white font-medium rounded-xl transition-all duration-300 transform group-hover:scale-105`}
                >
                  {path.cta}
                </Link>
              </div>
            ))}
          </div>

          {/* Quick Connect Options */}
          <div className="bg-slate-800/20 backdrop-blur-xl border border-slate-700/30 rounded-3xl p-8 mb-16">
            <h2 className="text-3xl font-bold text-center text-white mb-8">Quick Connect</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {quickConnect.map((option, idx) => (
                <Link
                  key={idx}
                  href={option.action}
                  target={option.action.startsWith('http') ? '_blank' : undefined}
                  rel={option.action.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className={`group bg-slate-800/40 backdrop-blur-xl border border-slate-700/40 rounded-2xl p-6 hover:border-slate-600/60 transition-all duration-300 hover:scale-105`}
                >
                  <div className={`w-12 h-12 bg-gradient-to-r ${option.color} rounded-xl flex items-center justify-center mb-4 mx-auto text-xl group-hover:scale-110 transition-transform duration-300`}>
                    {option.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2 text-center">{option.method}</h3>
                  <p className="text-slate-400 text-sm text-center">{option.value}</p>
                </Link>
              ))}
            </div>
          </div>

          {/* Global Reach Stats */}
          <div className="bg-gradient-to-r from-slate-800/40 to-slate-700/40 backdrop-blur-xl border border-slate-600/30 rounded-3xl p-8">
            <h2 className="text-3xl font-bold text-center text-white mb-8">Global Connection Network</h2>
            <div className="grid md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-amber-400 font-bold text-3xl mb-2">45+</div>
                <div className="text-slate-300">Countries</div>
                <div className="text-slate-500 text-sm">Global Reach</div>
              </div>
              <div>
                <div className="text-purple-400 font-bold text-3xl mb-2">250+</div>
                <div className="text-slate-300">Speaking Events</div>
                <div className="text-slate-500 text-sm">Global Engagements</div>
              </div>
              <div>
                <div className="text-emerald-400 font-bold text-3xl mb-2">500+</div>
                <div className="text-slate-300">Strategic Partners</div>
                <div className="text-slate-500 text-sm">Network Strength</div>
              </div>
              <div>
                <div className="text-cyan-400 font-bold text-3xl mb-2">24h</div>
                <div className="text-slate-300">Response Time</div>
                <div className="text-slate-500 text-sm">Average Response</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}