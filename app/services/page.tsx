'use client';

import Link from 'next/link';
import { useState } from 'react';
import GlobalNavigation from '../components/GlobalNavigation';

export default function Services() {
  const [activeService, setActiveService] = useState<string | null>(null);

  const services = [
    {
      id: 'divine-strategy',
      title: 'Divine Strategy Coaching',
      subtitle: 'Breakthrough Sessions',
      description: 'Executive coaching combining spiritual intelligence with systematic business frameworks for enterprise transformation.',
      features: [
        '1:1 Executive Coaching Sessions',
        'Strategic Implementation Planning',
        'Spiritual Intelligence Integration',
        'Kingdom Business Principles',
        'Global Perspective Development'
      ],
      pricing: 'From $1,997 • 6-month programs available',
      cta: 'Book Strategy Session',
      href: '/lorenzo/connect',
      color: 'from-amber-500 to-orange-500',
      icon: '⚡'
    },
    {
      id: 'consulting',
      title: 'Strategic Consulting',
      subtitle: 'Enterprise Transformation',
      description: 'Comprehensive consulting for organizations seeking kingdom-aligned business transformation and sustainable impact models.',
      features: [
        'Organizational Assessment & Strategy',
        'Impact Business Model Design',
        'Capital Structure Optimization',
        'Global Expansion Planning',
        'Perpetual Impact Systems'
      ],
      pricing: 'Custom engagements • 3-12 month projects',
      cta: 'Explore Consulting',
      href: '/lorenzo/connect',
      color: 'from-emerald-500 to-teal-500',
      icon: '🎯'
    },
    {
      id: 'speaking',
      title: 'Global Speaking',
      subtitle: 'Prophetic Leadership',
      description: 'Dynamic speaking engagements on divine strategy, kingdom economics, and prophetic leadership for conferences and events.',
      features: [
        'Keynote Speaking Engagements',
        'Leadership Development Sessions',
        'Kingdom Economics Teaching',
        'Global Impact Presentations',
        'Executive Retreats & Workshops'
      ],
      pricing: '250+ events • 45+ countries served',
      cta: 'Book Speaking',
      href: '/lorenzo/speaking',
      color: 'from-purple-500 to-indigo-500',
      icon: '🎤'
    }
  ];

  const testimonials = [
    {
      quote: "Lorenzo's divine strategy approach transformed our entire organizational framework and accelerated our global impact.",
      author: "Dr. Sarah Mitchell",
      title: "CEO, Global Impact Foundation",
      location: "United States"
    },
    {
      quote: "The strategic insights and spiritual intelligence integration provided unprecedented clarity for our expansion.",
      author: "Pastor David Okoye",
      title: "Senior Pastor & Business Leader",
      location: "Nigeria"
    },
    {
      quote: "Lorenzo's speaking engagement was transformational for our leadership team's understanding of kingdom economics.",
      author: "Maria Rodriguez",
      title: "Executive Director",
      location: "Colombia"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <GlobalNavigation />

      <div className="relative overflow-hidden py-16 pt-40">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 via-purple-500/5 to-emerald-500/5"></div>

        <div className="relative max-w-7xl mx-auto px-6">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-amber-300 via-purple-400 to-emerald-400 bg-clip-text text-transparent">
              Strategic Services
            </h1>
            <p className="text-xl md:text-2xl text-slate-200 max-w-4xl mx-auto leading-relaxed mb-6">
              <span className="text-amber-400 font-semibold">Divine Strategy</span> •
              <span className="text-purple-400 font-semibold"> Global Impact</span> •
              <span className="text-emerald-400 font-semibold"> Kingdom Alignment</span>
            </p>
            <p className="text-lg text-slate-300 max-w-3xl mx-auto">
              Comprehensive strategic services combining spiritual intelligence with systematic implementation for leaders and organizations seeking transformational impact.
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            {services.map((service) => (
              <div
                key={service.id}
                className="group bg-slate-800/30 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 hover:border-slate-600/50 transition-all duration-500 hover:scale-105 cursor-pointer"
                onMouseEnter={() => setActiveService(service.id)}
                onMouseLeave={() => setActiveService(null)}
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${service.color} rounded-2xl flex items-center justify-center mb-6 mx-auto text-2xl`}>
                  {service.icon}
                </div>

                <h3 className="text-2xl font-bold text-white mb-2 text-center">{service.title}</h3>
                <p className={`text-sm font-medium mb-4 text-center bg-gradient-to-r ${service.color} bg-clip-text text-transparent`}>
                  {service.subtitle}
                </p>
                <p className="text-slate-300 text-sm mb-6 text-center leading-relaxed">
                  {service.description}
                </p>

                <div className="space-y-3 mb-6">
                  {service.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-sm text-slate-300">
                      <div className={`w-2 h-2 bg-gradient-to-r ${service.color} rounded-full flex-shrink-0`}></div>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="text-center mb-6">
                  <div className="text-xs text-slate-400 mb-4">{service.pricing}</div>
                </div>

                <Link
                  href={service.href}
                  className={`block w-full text-center py-3 px-6 bg-gradient-to-r ${service.color} hover:opacity-90 text-white font-medium rounded-xl transition-all duration-300 transform group-hover:scale-105`}
                >
                  {service.cta}
                </Link>
              </div>
            ))}
          </div>

          {/* Global Impact Stats */}
          <div className="bg-slate-800/20 backdrop-blur-xl border border-slate-700/30 rounded-3xl p-8 mb-16">
            <h2 className="text-3xl font-bold text-center text-white mb-8">Global Impact & Reach</h2>
            <div className="grid md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-amber-400 font-bold text-3xl mb-2">250+</div>
                <div className="text-slate-300">Speaking Events</div>
                <div className="text-slate-500 text-sm">Global Engagements</div>
              </div>
              <div>
                <div className="text-emerald-400 font-bold text-3xl mb-2">45+</div>
                <div className="text-slate-300">Countries</div>
                <div className="text-slate-500 text-sm">International Reach</div>
              </div>
              <div>
                <div className="text-purple-400 font-bold text-3xl mb-2">15+</div>
                <div className="text-slate-300">Years</div>
                <div className="text-slate-500 text-sm">Strategic Experience</div>
              </div>
              <div>
                <div className="text-blue-400 font-bold text-3xl mb-2">100+</div>
                <div className="text-slate-300">Organizations</div>
                <div className="text-slate-500 text-sm">Transformed</div>
              </div>
            </div>
          </div>

          {/* Testimonials */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center text-white mb-8">Leader Testimonials</h2>
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
          <div className="text-center bg-gradient-to-r from-slate-800/40 to-slate-700/40 backdrop-blur-xl border border-slate-600/30 rounded-3xl p-8">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready for Strategic Transformation?
            </h2>
            <p className="text-lg text-slate-300 mb-6 max-w-2xl mx-auto">
              Connect with Lorenzo to explore how divine strategy can accelerate your mission and impact.
            </p>
            <Link
              href="/lorenzo/connect"
              className="inline-block bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 hover:from-indigo-700 hover:via-purple-700 hover:to-cyan-700 text-white font-bold text-lg px-8 py-4 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl"
            >
              Connect with Lorenzo →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}