'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ConversionTrackingService } from '../../lib/services/conversion-tracking';

interface ContactMethod {
  type: 'email' | 'phone' | 'calendar' | 'social';
  icon: JSX.Element;
  title: string;
  value: string;
  action: string;
  color: string;
}

export default function ConnectPage() {
  // Track page view
  useEffect(() => {
    ConversionTrackingService.trackPageView('/lorenzo/connect', undefined, {
      page_type: 'connect_page',
      connection_type: 'professional_networking',
      platform: 'lorenzo_site'
    });
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    purpose: '',
    message: '',
    preferredTime: '',
    urgency: ''
  });

  const [showSuccess, setShowSuccess] = useState(false);

  const handleCTAClick = (action: string) => {
    ConversionTrackingService.trackConversion('lead', {
      event: action,
      content_type: 'connect_cta',
      content_category: 'networking_communication',
      metadata: {
        action_type: action
      }
    });
  };

  const contactMethods: ContactMethod[] = [
    {
      type: 'calendar',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      title: 'Schedule Strategic Session',
      value: 'Book your divine strategy consultation',
      action: 'https://calendly.com/lorenzo-theglobalenterprise/discovery-call',
      color: 'from-emerald-500 to-teal-600'
    },
    {
      type: 'email',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      title: 'Direct Email',
      value: 'lorenzo@lorenzodaughtrychambers.com',
      action: 'mailto:lorenzo@lorenzodaughtrychambers.com',
      color: 'from-green-500 to-emerald-600'
    },
    {
      type: 'phone',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
      title: 'Priority Line',
      value: 'For urgent matters',
      action: 'tel:+1234567890',
      color: 'from-teal-500 to-cyan-600'
    },
    {
      type: 'social',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
        </svg>
      ),
      title: 'Professional Networks',
      value: 'LinkedIn & X',
      action: 'https://linkedin.com/in/lorenzodaughtrychambers',
      color: 'from-cyan-500 to-blue-600'
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Track form submission
    handleCTAClick('strategic_form_submit');

    // Here you would integrate with your backend API
    console.log('Form submitted:', formData);

    // Show success message
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 5000);

    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      purpose: '',
      message: '',
      preferredTime: '',
      urgency: ''
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950 to-teal-900">
      {/* Dynamic networking background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -right-4 w-96 h-96 bg-gradient-to-br from-emerald-500/20 to-teal-500/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 -left-4 w-80 h-80 bg-gradient-to-br from-green-500/15 to-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-br from-teal-600/15 to-emerald-600/10 rounded-full blur-3xl animate-pulse delay-2000"></div>

        {/* Network connection patterns */}
        <div className="absolute top-20 left-20 w-24 h-24 border border-emerald-400/20 rotate-45 animate-spin-slow"></div>
        <div className="absolute top-40 right-32 w-16 h-16 border border-teal-400/25 rounded-full"></div>
        <div className="absolute bottom-32 left-40 w-12 h-12 bg-green-500/10 rotate-12"></div>

        {/* Communication grid overlay */}
        <div className="absolute inset-0 opacity-30">
          <div className="grid grid-cols-8 md:grid-cols-12 lg:grid-cols-16 h-full">
            {Array.from({ length: 16 }).map((_, i) => (
              <div key={i} className="border-r border-emerald-400/10"></div>
            ))}
          </div>
        </div>

        {/* Dynamic network nodes */}
        <svg className="absolute top-32 right-24 w-40 h-40 text-emerald-400/20" viewBox="0 0 120 120">
          <circle cx="30" cy="30" r="5" fill="currentColor" className="animate-pulse"/>
          <circle cx="90" cy="40" r="4" fill="currentColor" className="animate-pulse delay-300"/>
          <circle cx="70" cy="80" r="4.5" fill="currentColor" className="animate-pulse delay-600"/>
          <circle cx="40" cy="75" r="3.5" fill="currentColor" className="animate-pulse delay-900"/>
          <circle cx="60" cy="20" r="3" fill="currentColor" className="animate-pulse delay-1200"/>
          <line x1="30" y1="30" x2="90" y2="40" stroke="currentColor" strokeWidth="1" className="animate-pulse"/>
          <line x1="90" y1="40" x2="70" y2="80" stroke="currentColor" strokeWidth="1" className="animate-pulse delay-300"/>
          <line x1="70" y1="80" x2="40" y2="75" stroke="currentColor" strokeWidth="1" className="animate-pulse delay-600"/>
          <line x1="40" y1="75" x2="30" y2="30" stroke="currentColor" strokeWidth="1" className="animate-pulse delay-900"/>
          <line x1="60" y1="20" x2="30" y2="30" stroke="currentColor" strokeWidth="1" className="animate-pulse delay-1200"/>
          <line x1="60" y1="20" x2="90" y2="40" stroke="currentColor" strokeWidth="1" className="animate-pulse delay-1500"/>
        </svg>

        {/* Communication waves */}
        <div className="absolute bottom-40 left-20 w-32 h-32">
          <div className="absolute inset-0 border-2 border-teal-400/20 rounded-full animate-ping"></div>
          <div className="absolute inset-4 border border-emerald-400/25 rounded-full animate-ping delay-500"></div>
          <div className="absolute inset-8 border border-green-400/30 rounded-full animate-ping delay-1000"></div>
        </div>
      </div>

      <div className="relative z-10">
        <div className="container mx-auto px-4 pt-32 pb-20">
          {/* Hero Section */}
          <div className="max-w-4xl mx-auto text-center mb-20">
            {/* Networking Logo */}
            <div className="relative mb-12">
              <div className="w-32 h-32 mx-auto bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-full flex items-center justify-center border border-emerald-400/30">
                <svg className="w-16 h-16 text-emerald-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="text-white">Connect &</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-400 to-green-400 animate-pulse">
                Collaborate
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-emerald-100 mb-8 max-w-3xl mx-auto leading-relaxed">
              Bridge visionary thinking with strategic implementation. Let's connect across multiple channels
              to accelerate your divine assignment and kingdom impact.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link
                href="https://calendly.com/lorenzo-theglobalenterprise/discovery-call"
                onClick={() => handleCTAClick('schedule_session')}
                className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-lg hover:shadow-2xl hover:shadow-emerald-500/20 transition-all transform hover:scale-105"
              >
                Schedule Session
              </Link>
              <button
                onClick={() => {
                  handleCTAClick('quick_connect');
                  window.location.href = 'mailto:lorenzo@lorenzodaughtrychambers.com';
                }}
                className="px-8 py-4 bg-white/10 backdrop-blur text-white font-semibold rounded-lg border border-emerald-400/30 hover:bg-white/20 transition-all"
              >
                Quick Connect
              </button>
            </div>
          </div>

          {/* Connection Methods */}
          <div className="max-w-6xl mx-auto mb-20">
            <h2 className="text-4xl font-bold text-center text-white mb-12">
              Multiple Ways to Connect
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {contactMethods.map((method, index) => (
                <a
                  key={index}
                  href={method.action}
                  target={method.type === 'calendar' || method.type === 'social' ? '_blank' : undefined}
                  rel={method.type === 'calendar' || method.type === 'social' ? 'noopener noreferrer' : undefined}
                  onClick={() => handleCTAClick(`connect_${method.type}`)}
                  className="group bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-emerald-500/20 hover:border-emerald-400/40 hover:bg-white/10 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/10 hover:scale-105"
                >
                  <div className={`w-16 h-16 bg-gradient-to-br ${method.color} rounded-full flex items-center justify-center mb-6 group-hover:animate-pulse`}>
                    <div className="text-white">
                      {method.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">{method.title}</h3>
                  <p className="text-emerald-200 text-sm">{method.value}</p>
                  <div className="mt-4 text-emerald-400 font-semibold group-hover:text-emerald-300 transition-colors">
                    Connect now →
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Strategic Connection Form */}
          <div className="max-w-4xl mx-auto mb-20">
            <div className="bg-gradient-to-br from-emerald-900/30 to-teal-900/30 backdrop-blur-xl rounded-2xl p-8 md:p-12 border border-emerald-400/20">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-4">
                  Strategic Connection Request
                </h2>
                <p className="text-emerald-200">
                  For complex strategic initiatives, provide details below for a tailored approach.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-emerald-200 mb-2">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-3 bg-white/10 border border-emerald-400/30 rounded-lg text-white placeholder-emerald-300/60 focus:border-emerald-400 focus:outline-none"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-emerald-200 mb-2">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-4 py-3 bg-white/10 border border-emerald-400/30 rounded-lg text-white placeholder-emerald-300/60 focus:border-emerald-400 focus:outline-none"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-emerald-200 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full px-4 py-3 bg-white/10 border border-emerald-400/30 rounded-lg text-white placeholder-emerald-300/60 focus:border-emerald-400 focus:outline-none"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-emerald-200 mb-2">Connection Purpose *</label>
                    <select
                      required
                      value={formData.purpose}
                      onChange={(e) => setFormData({...formData, purpose: e.target.value})}
                      className="w-full px-4 py-3 bg-white/10 border border-emerald-400/30 rounded-lg text-white focus:border-emerald-400 focus:outline-none"
                    >
                      <option value="" className="bg-slate-900">Select purpose</option>
                      <option value="divine-strategy" className="bg-slate-900">Divine Strategy Consultation</option>
                      <option value="catalyst-ai" className="bg-slate-900">Catalyst AI Implementation</option>
                      <option value="ministry" className="bg-slate-900">Ministry Partnership</option>
                      <option value="investment" className="bg-slate-900">Investment Opportunity</option>
                      <option value="speaking" className="bg-slate-900">Speaking Engagement</option>
                      <option value="media" className="bg-slate-900">Media/Interview Request</option>
                      <option value="networking" className="bg-slate-900">Professional Networking</option>
                      <option value="collaboration" className="bg-slate-900">Strategic Collaboration</option>
                      <option value="other" className="bg-slate-900">Other Strategic Matter</option>
                    </select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-emerald-200 mb-2">Preferred Meeting Time</label>
                    <select
                      value={formData.preferredTime}
                      onChange={(e) => setFormData({...formData, preferredTime: e.target.value})}
                      className="w-full px-4 py-3 bg-white/10 border border-emerald-400/30 rounded-lg text-white focus:border-emerald-400 focus:outline-none"
                    >
                      <option value="" className="bg-slate-900">Select preference</option>
                      <option value="morning" className="bg-slate-900">Morning (9am-12pm EST)</option>
                      <option value="afternoon" className="bg-slate-900">Afternoon (12pm-5pm EST)</option>
                      <option value="evening" className="bg-slate-900">Evening (5pm-8pm EST)</option>
                      <option value="flexible" className="bg-slate-900">Flexible</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-emerald-200 mb-2">Urgency Level</label>
                    <select
                      value={formData.urgency}
                      onChange={(e) => setFormData({...formData, urgency: e.target.value})}
                      className="w-full px-4 py-3 bg-white/10 border border-emerald-400/30 rounded-lg text-white focus:border-emerald-400 focus:outline-none"
                    >
                      <option value="" className="bg-slate-900">Select urgency</option>
                      <option value="immediate" className="bg-slate-900">Immediate (24-48 hours)</option>
                      <option value="thisweek" className="bg-slate-900">This Week</option>
                      <option value="thismonth" className="bg-slate-900">This Month</option>
                      <option value="planning" className="bg-slate-900">Strategic Planning</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-emerald-200 mb-2">Strategic Context *</label>
                  <textarea
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="w-full px-4 py-3 bg-white/10 border border-emerald-400/30 rounded-lg text-white placeholder-emerald-300/60 focus:border-emerald-400 focus:outline-none h-32"
                    placeholder="Share your vision, current challenges, and what divine breakthrough you're seeking..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-lg hover:shadow-2xl hover:shadow-emerald-500/20 transition-all transform hover:scale-105"
                >
                  Submit Strategic Request
                </button>
              </form>

              {showSuccess && (
                <div className="mt-6 p-4 bg-emerald-600/20 border border-emerald-500/50 rounded-lg">
                  <p className="text-emerald-300 text-center">
                    ✓ Strategic request received! Expect a response within 24 hours.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Connection Network Stats */}
          <div className="max-w-6xl mx-auto mb-20">
            <h2 className="text-4xl font-bold text-center text-white mb-12">
              Global Connection Network
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-emerald-900/30 to-green-900/30 backdrop-blur-xl rounded-xl p-8 border border-emerald-400/20">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">JM</span>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-white font-semibold">Jennifer Matthews, CEO</h4>
                    <p className="text-emerald-200 text-sm">Global Technology Network</p>
                  </div>
                </div>
                <p className="text-emerald-100 italic mb-4">
                  "Lorenzo's strategic networking approach connected us with 15 key partners in 90 days. The collaborative framework generated $5M in new opportunities."
                </p>
                <div className="flex text-emerald-400">
                  {"★".repeat(5)}
                </div>
              </div>

              <div className="bg-gradient-to-br from-teal-900/30 to-cyan-900/30 backdrop-blur-xl rounded-xl p-8 border border-teal-400/20">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-teal-600 to-cyan-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">DR</span>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-white font-semibold">David Rodriguez</h4>
                    <p className="text-teal-200 text-sm">International Ministry Leader</p>
                  </div>
                </div>
                <p className="text-emerald-100 italic mb-4">
                  "The connection strategies opened doors to 8 countries and 200+ churches. Our kingdom network expanded exponentially through strategic collaboration."
                </p>
                <div className="flex text-teal-400">
                  {"★".repeat(5)}
                </div>
              </div>
            </div>
          </div>

          {/* Availability & Response Metrics */}
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-gradient-to-r from-emerald-800/50 to-teal-800/50 backdrop-blur-xl rounded-2xl p-8 border border-emerald-400/20">
              <h2 className="text-3xl font-bold text-white mb-6">Strategic Availability & Network Reach</h2>
              <div className="grid md:grid-cols-4 gap-8 text-center">
                <div>
                  <div className="text-3xl font-bold text-emerald-400 mb-2">24/7</div>
                  <div className="text-emerald-200">Response Time</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-teal-400 mb-2">45+</div>
                  <div className="text-emerald-200">Countries Connected</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-400 mb-2">500+</div>
                  <div className="text-emerald-200">Strategic Partners</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-cyan-400 mb-2">98%</div>
                  <div className="text-emerald-200">Connection Success Rate</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}