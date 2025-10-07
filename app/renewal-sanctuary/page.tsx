'use client';

import Link from 'next/link';
import { useState } from 'react';
import GlobalNavigation from '../components/GlobalNavigation';

export default function RenewalSanctuary() {
  const [activeFeature, setActiveFeature] = useState<string | null>(null);

  const sanctuaryFeatures = [
    {
      id: 'executive-retreats',
      title: 'Executive Restoration Retreats',
      description: 'Immersive 3-7 day experiences designed for C-suite leaders seeking strategic renewal and spiritual alignment.',
      features: ['Private mountain sanctuary', 'Executive wellness suites', '1:1 strategic sessions', 'Holistic health protocols'],
      investment: 'From $15,000',
      color: 'from-emerald-500 to-teal-500',
      icon: '🏔️'
    },
    {
      id: 'sabbatical-programs',
      title: 'Extended Sabbatical Programs',
      description: 'Transformational 30-90 day intensive programs for leaders undergoing major life or business transitions.',
      features: ['Custom program design', 'Strategic life planning', 'Health & wellness coaching', 'Spiritual intelligence development'],
      investment: 'From $75,000',
      color: 'from-cyan-500 to-blue-500',
      icon: '⏳'
    },
    {
      id: 'wellness-technology',
      title: 'Cutting-Edge Wellness Technology',
      description: 'State-of-the-art biohacking and wellness technologies integrated with spiritual practices.',
      features: ['Advanced biometric monitoring', 'Cryotherapy & infrared therapy', 'Neurofeedback systems', 'Meditation technology'],
      investment: 'Included',
      color: 'from-purple-500 to-indigo-500',
      icon: '🔬'
    },
    {
      id: 'acquisition-opportunities',
      title: 'Investment & Partnership',
      description: 'Asset-backed wellness enterprise seeking strategic partners and investment for expansion.',
      features: ['Prime real estate assets', 'Proven business model', 'High-net-worth clientele', 'Scalable technology platform'],
      investment: 'Contact for details',
      color: 'from-amber-500 to-orange-500',
      icon: '💼'
    }
  ];

  const testimonials = [
    {
      quote: "The Renewal Sanctuary transformed not just my health, but my entire approach to leadership and life strategy.",
      author: "Sarah Chen",
      title: "CEO, TechVentures Global",
      location: "Singapore"
    },
    {
      quote: "This isn't just a retreat - it's a complete recalibration of mind, body, and spirit for peak performance.",
      author: "Michael Rodriguez",
      title: "Managing Partner, Investment Fund",
      location: "New York"
    },
    {
      quote: "The integration of cutting-edge wellness technology with spiritual intelligence is unprecedented.",
      author: "Dr. Elena Kowalski",
      title: "Healthcare Innovation Director",
      location: "Geneva"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <GlobalNavigation />

      <div className="relative overflow-hidden py-16 pt-24">
        {/* Enhanced Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-cyan-500/10 to-teal-500/5"></div>

          {/* Floating elements */}
          <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-emerald-500/20 to-cyan-600/20 rounded-3xl rotate-45 animate-float blur-xl"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-teal-500/25 to-emerald-600/25 rounded-2xl rotate-12 animate-float-delayed blur-lg"></div>
          <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-gradient-to-br from-cyan-500/15 to-teal-500/15 rounded-full animate-pulse-slow"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-6">
              <div className="w-20 h-1 bg-gradient-to-r from-transparent to-emerald-400"></div>
              <div className="mx-6 text-6xl">🏔️</div>
              <div className="w-20 h-1 bg-gradient-to-l from-transparent to-cyan-400"></div>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-emerald-300 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
              Renewal Sanctuary
            </h1>

            <p className="text-xl md:text-2xl text-slate-200 max-w-4xl mx-auto leading-relaxed mb-6">
              <span className="text-emerald-400 font-semibold">Premium Wellness Enterprise</span> •
              <span className="text-cyan-400 font-semibold"> Executive Restoration</span> •
              <span className="text-teal-400 font-semibold"> Investment Opportunity</span>
            </p>

            <p className="text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
              The world's most advanced executive wellness sanctuary, combining cutting-edge biohacking technology
              with spiritual intelligence practices in a luxury mountain setting. Asset-backed wellness enterprise
              serving global leaders.
            </p>
          </div>

          {/* Key Metrics */}
          <div className="grid md:grid-cols-4 gap-6 mb-16">
            <div className="text-center p-6 bg-slate-800/30 backdrop-blur-xl border border-slate-700/30 rounded-2xl">
              <div className="text-emerald-400 font-bold text-3xl mb-2">$50M+</div>
              <div className="text-slate-300">Asset Value</div>
              <div className="text-slate-500 text-sm">Prime mountain real estate</div>
            </div>
            <div className="text-center p-6 bg-slate-800/30 backdrop-blur-xl border border-slate-700/30 rounded-2xl">
              <div className="text-cyan-400 font-bold text-3xl mb-2">150+</div>
              <div className="text-slate-300">Executive Clients</div>
              <div className="text-slate-500 text-sm">C-suite leaders served</div>
            </div>
            <div className="text-center p-6 bg-slate-800/30 backdrop-blur-xl border border-slate-700/30 rounded-2xl">
              <div className="text-teal-400 font-bold text-3xl mb-2">92%</div>
              <div className="text-slate-300">Satisfaction Rate</div>
              <div className="text-slate-500 text-sm">Client transformation</div>
            </div>
            <div className="text-center p-6 bg-slate-800/30 backdrop-blur-xl border border-slate-700/30 rounded-2xl">
              <div className="text-purple-400 font-bold text-3xl mb-2">24/7</div>
              <div className="text-slate-300">Concierge</div>
              <div className="text-slate-500 text-sm">Premium service</div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid lg:grid-cols-2 gap-8 mb-16">
            {sanctuaryFeatures.map((feature) => (
              <div
                key={feature.id}
                className="group bg-slate-800/30 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 hover:border-slate-600/50 transition-all duration-500 hover:scale-105 cursor-pointer"
                onMouseEnter={() => setActiveFeature(feature.id)}
                onMouseLeave={() => setActiveFeature(null)}
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6 mx-auto text-2xl group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>

                <h3 className="text-2xl font-bold text-white mb-4 text-center group-hover:text-emerald-100 transition-colors">
                  {feature.title}
                </h3>

                <p className="text-slate-300 text-center mb-6 leading-relaxed group-hover:text-slate-200 transition-colors">
                  {feature.description}
                </p>

                <div className="space-y-3 mb-6">
                  {feature.features.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-sm text-slate-300">
                      <div className={`w-2 h-2 bg-gradient-to-r ${feature.color} rounded-full flex-shrink-0`}></div>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                <div className="text-center">
                  <div className="text-slate-400 text-sm mb-4">Investment: {feature.investment}</div>
                  <Link
                    href="/lorenzo/connect"
                    className={`block w-full text-center py-3 px-6 bg-gradient-to-r ${feature.color} hover:opacity-90 text-white font-medium rounded-xl transition-all duration-300 transform group-hover:scale-105`}
                  >
                    Learn More
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Vision & Mission */}
          <div className="bg-gradient-to-br from-slate-800/40 via-slate-800/60 to-slate-800/40 backdrop-blur-xl border border-slate-700/40 rounded-3xl p-12 mb-16">
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h2 className="text-3xl font-bold text-white mb-6">Our Vision</h2>
                <p className="text-slate-300 leading-relaxed mb-6">
                  To create the world's premier ecosystem where cutting-edge wellness technology meets
                  spiritual intelligence, enabling global leaders to achieve unprecedented levels of
                  performance, purpose, and personal fulfillment.
                </p>
                <p className="text-slate-400 leading-relaxed">
                  We believe the future of executive wellness lies in the integration of advanced
                  biohacking technologies with time-tested spiritual practices, delivered in environments
                  of unparalleled luxury and privacy.
                </p>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white mb-6">Investment Opportunity</h2>
                <p className="text-slate-300 leading-relaxed mb-6">
                  Renewal Sanctuary represents a unique asset-backed investment opportunity in the
                  rapidly growing luxury wellness market. Our model combines:
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-slate-300">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                    <span>Prime mountain real estate assets</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-300">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                    <span>Proven high-margin business model</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-300">
                    <div className="w-2 h-2 bg-teal-400 rounded-full"></div>
                    <span>Scalable technology platform</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-300">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                    <span>Global expansion potential</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Testimonials */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center text-white mb-8">Executive Testimonials</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((testimonial, idx) => (
                <div key={idx} className="bg-slate-800/30 backdrop-blur-xl border border-slate-700/30 rounded-2xl p-6">
                  <div className="text-slate-300 text-sm leading-relaxed mb-4 italic">
                    "{testimonial.quote}"
                  </div>
                  <div className="border-t border-slate-700 pt-4">
                    <div className="text-white font-medium">{testimonial.author}</div>
                    <div className="text-slate-400 text-sm">{testimonial.title}</div>
                    <div className="text-slate-500 text-xs">{testimonial.location}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center bg-gradient-to-r from-slate-800/40 to-slate-700/40 backdrop-blur-xl border border-slate-600/30 rounded-3xl p-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Experience Executive Renewal
            </h2>
            <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">
              Join the world's most exclusive wellness sanctuary for executives. Investment opportunities
              and retreat bookings available for qualified individuals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/lorenzo/connect"
                className="inline-block bg-gradient-to-r from-emerald-600 via-cyan-600 to-teal-600 hover:from-emerald-700 hover:via-cyan-700 hover:to-teal-700 text-white font-bold text-lg px-8 py-4 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl"
              >
                Book Executive Retreat →
              </Link>
              <Link
                href="/lorenzo/connect"
                className="inline-block bg-slate-800/80 hover:bg-slate-700/80 border border-slate-600/50 hover:border-slate-500/70 text-white font-bold text-lg px-8 py-4 rounded-2xl transition-all duration-300 transform hover:scale-105 backdrop-blur-xl"
              >
                Investment Inquiry →
              </Link>
            </div>
            <div className="mt-8 text-slate-400 text-sm">
              <span className="text-emerald-400">✓</span> Private consultation required •
              <span className="text-cyan-400"> ✓</span> Qualified investors only •
              <span className="text-teal-400"> ✓</span> Full confidentiality assured
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}