"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ConversionTrackingService } from "../../lib/services/conversion-tracking";

export default function GlobalDevelopmentInstitutePage() {
  // Track page view
  useEffect(() => {
    ConversionTrackingService.trackPageView('/lorenzo/institute', undefined, {
      page_type: 'institute_page',
      institute_type: 'global_development',
      platform: 'lorenzo_site'
    });
  }, []);

  const handleCTAClick = (action: string) => {
    ConversionTrackingService.trackConversion('lead', {
      event: action,
      content_type: 'institute_cta',
      content_category: 'education_development',
      metadata: {
        action_type: action
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-cyan-950 to-teal-900">
      {/* Academic/Research background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -right-4 w-96 h-96 bg-gradient-to-br from-cyan-500/15 to-blue-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 -left-4 w-80 h-80 bg-gradient-to-br from-teal-500/12 to-emerald-500/8 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-br from-blue-600/10 to-indigo-600/8 rounded-full blur-3xl animate-pulse delay-2000"></div>

        {/* Academic symbols and patterns */}
        <div className="absolute top-20 left-20 w-20 h-20 border-2 border-cyan-400/20 rotate-12 animate-bounce"></div>
        <div className="absolute top-32 right-32 w-12 h-12 bg-teal-500/10 rounded-full"></div>
        <div className="absolute bottom-32 left-40 w-6 h-6 bg-blue-500/20 rotate-45"></div>

        {/* Grid pattern for academic feel */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/5 to-transparent opacity-30">
          <div className="grid grid-cols-12 h-full">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="border-r border-cyan-400/10"></div>
            ))}
          </div>
        </div>

        {/* Knowledge network lines */}
        <svg className="absolute top-40 right-20 w-40 h-40 text-teal-400/10" viewBox="0 0 100 100">
          <circle cx="20" cy="20" r="3" fill="currentColor"/>
          <circle cx="80" cy="30" r="2" fill="currentColor"/>
          <circle cx="50" cy="70" r="2.5" fill="currentColor"/>
          <line x1="20" y1="20" x2="80" y2="30" stroke="currentColor" strokeWidth="0.5"/>
          <line x1="80" y1="30" x2="50" y2="70" stroke="currentColor" strokeWidth="0.5"/>
          <line x1="50" y1="70" x2="20" y2="20" stroke="currentColor" strokeWidth="0.5"/>
        </svg>
      </div>

      <div className="relative z-10">
        <div className="container mx-auto px-4 pt-32 pb-20">
          {/* Hero Section */}
          <div className="max-w-4xl mx-auto text-center mb-20">
            {/* Institute Logo */}
            <div className="relative mb-12">
              <div className="w-32 h-32 mx-auto bg-gradient-to-br from-cyan-500/20 to-teal-500/15 rounded-full flex items-center justify-center border border-cyan-400/30">
                <svg className="w-16 h-16 text-cyan-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="text-white">Global Development</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-teal-400 to-blue-400 animate-pulse">
                Institute
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-cyan-100 mb-8 max-w-3xl mx-auto leading-relaxed">
              Advancing knowledge, research, and practical solutions for sustainable global development through
              evidence-based learning and collaborative innovation.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link
                href="/lorenzo/connect"
                onClick={() => handleCTAClick('research_collaboration')}
                className="px-8 py-4 bg-gradient-to-r from-cyan-600 to-teal-600 text-white font-semibold rounded-lg hover:shadow-2xl hover:shadow-cyan-500/20 transition-all transform hover:scale-105"
              >
                Join Research Network
              </Link>
              <Link
                href="/lorenzo/assessment"
                onClick={() => handleCTAClick('development_assessment')}
                className="px-8 py-4 bg-white/10 backdrop-blur text-white font-semibold rounded-lg border border-cyan-400/30 hover:bg-white/20 transition-all"
              >
                Development Assessment
              </Link>
            </div>
          </div>

          {/* Research Areas */}
          <div className="max-w-6xl mx-auto mb-20">
            <h2 className="text-4xl font-bold text-center text-white mb-12">
              Research & Development Areas
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Sustainable Development */}
              <div className="group bg-white/5 backdrop-blur-xl rounded-xl p-8 border border-cyan-500/20 hover:border-cyan-400/40 hover:bg-white/10 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/10 hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mb-6 group-hover:animate-pulse">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold text-white mb-4">Sustainable Development</h3>
                <p className="text-cyan-100 mb-6">
                  Researching innovative approaches to economic growth that balance social equity, environmental protection, and long-term viability.
                </p>
                <div className="text-cyan-400 font-semibold group-hover:text-cyan-300 transition-colors">
                  Research publications →
                </div>
              </div>

              {/* Technology & Innovation */}
              <div className="group bg-white/5 backdrop-blur-xl rounded-xl p-8 border border-teal-500/20 hover:border-teal-400/40 hover:bg-white/10 transition-all duration-300 hover:shadow-2xl hover:shadow-teal-500/10 hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-br from-teal-600 to-emerald-600 rounded-full flex items-center justify-center mb-6 group-hover:animate-pulse">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold text-white mb-4">Technology & Innovation</h3>
                <p className="text-cyan-100 mb-6">
                  Exploring how emerging technologies can accelerate development outcomes and create scalable solutions for global challenges.
                </p>
                <div className="text-teal-400 font-semibold group-hover:text-teal-300 transition-colors">
                  Innovation labs →
                </div>
              </div>

              {/* Policy & Governance */}
              <div className="group bg-white/5 backdrop-blur-xl rounded-xl p-8 border border-blue-500/20 hover:border-blue-400/40 hover:bg-white/10 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10 hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mb-6 group-hover:animate-pulse">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold text-white mb-4">Policy & Governance</h3>
                <p className="text-cyan-100 mb-6">
                  Analyzing governance structures and policy frameworks that enable effective development implementation and institutional capacity building.
                </p>
                <div className="text-blue-400 font-semibold group-hover:text-blue-300 transition-colors">
                  Policy briefs →
                </div>
              </div>
            </div>
          </div>

          {/* Academic Partnerships */}
          <div className="max-w-6xl mx-auto mb-20">
            <h2 className="text-4xl font-bold text-center text-white mb-12">
              Academic Partnerships & Programs
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-cyan-900/30 to-teal-900/30 backdrop-blur-xl rounded-xl p-8 border border-cyan-400/20">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-cyan-600 to-blue-600 rounded-lg flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l9-5-9-5-9 5 9 5z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-white font-semibold text-xl">Graduate Fellowship Program</h4>
                    <p className="text-cyan-200 text-sm">Advanced research & fieldwork</p>
                  </div>
                </div>
                <p className="text-cyan-100 mb-4">
                  Intensive 18-month fellowship program combining theoretical research with practical field experience in developing economies,
                  partnering with top-tier universities worldwide.
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-3 py-1 bg-cyan-600/20 text-cyan-300 rounded-full text-sm">PhD Track</span>
                  <span className="px-3 py-1 bg-teal-600/20 text-teal-300 rounded-full text-sm">Field Research</span>
                  <span className="px-3 py-1 bg-blue-600/20 text-blue-300 rounded-full text-sm">Publication</span>
                </div>
              </div>

              <div className="bg-gradient-to-br from-teal-900/30 to-blue-900/30 backdrop-blur-xl rounded-xl p-8 border border-teal-400/20">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-teal-600 to-emerald-600 rounded-lg flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-white font-semibold text-xl">Executive Education</h4>
                    <p className="text-cyan-200 text-sm">Leadership development & strategy</p>
                  </div>
                </div>
                <p className="text-cyan-100 mb-4">
                  Executive programs designed for development practitioners, government officials, and NGO leaders focusing on strategic
                  decision-making and innovative approaches to complex challenges.
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-3 py-1 bg-teal-600/20 text-teal-300 rounded-full text-sm">Certificate</span>
                  <span className="px-3 py-1 bg-emerald-600/20 text-emerald-300 rounded-full text-sm">Leadership</span>
                  <span className="px-3 py-1 bg-cyan-600/20 text-cyan-300 rounded-full text-sm">Strategy</span>
                </div>
              </div>
            </div>
          </div>

          {/* Global Impact Metrics */}
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-gradient-to-r from-cyan-800/50 to-teal-800/50 backdrop-blur-xl rounded-2xl p-8 border border-cyan-400/20">
              <h2 className="text-3xl font-bold text-white mb-6">Research Impact & Global Reach</h2>
              <div className="grid md:grid-cols-4 gap-8 text-center">
                <div>
                  <div className="text-3xl font-bold text-cyan-400 mb-2">127</div>
                  <div className="text-cyan-200">Research Papers</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-teal-400 mb-2">34</div>
                  <div className="text-cyan-200">Partner Universities</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-400 mb-2">89</div>
                  <div className="text-cyan-200">Countries Studied</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-emerald-400 mb-2">$12M</div>
                  <div className="text-cyan-200">Research Funding</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}