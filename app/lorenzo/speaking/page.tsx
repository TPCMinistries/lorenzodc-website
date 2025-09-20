"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ConversionTrackingService } from "../../lib/services/conversion-tracking";

interface SpeakingTopic {
  title: string;
  description: string;
  audience: string;
  format: string;
}

interface ConsultingService {
  title: string;
  description: string;
  duration: string;
  investment: string;
}

export default function SpeakingConsultingPage() {
  const [mounted, setMounted] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'speaking' | 'consulting'>('speaking');

  // Track page view and set mounted state
  useEffect(() => {
    setMounted(true);
    ConversionTrackingService.trackPageView('/lorenzo/speaking', undefined, {
      page_type: 'speaking_consulting_page',
      service_type: 'professional_services',
      platform: 'lorenzo_site'
    });
  }, []);

  const handleCTAClick = (action: string) => {
    ConversionTrackingService.trackConversion('lead', {
      event: action,
      content_type: 'speaking_consulting_cta',
      content_category: 'professional_services',
      metadata: {
        action_type: action,
        selected_tab: selectedTab
      }
    });
  };

  const speakingTopics: SpeakingTopic[] = [
    {
      title: 'Divine Strategy in the Age of AI',
      description: 'Integrating prophetic intelligence with artificial intelligence for exponential growth',
      audience: 'Executive Leadership, Faith Leaders, Tech Conferences',
      format: 'Keynote (45-60 min)'
    },
    {
      title: 'Kingdom Economics & Global Impact',
      description: 'Building sustainable enterprises that generate both kingdom and financial returns',
      audience: 'Business Leaders, Entrepreneurs, Investment Groups',
      format: 'Workshop (2-3 hours)'
    },
    {
      title: 'Prophetic Leadership in Crisis',
      description: 'Navigating uncertainty with divine intelligence and strategic clarity',
      audience: 'C-Suite Executives, Government Leaders, Ministry Leaders',
      format: 'Keynote (60-90 min)'
    }
  ];

  const consultingServices: ConsultingService[] = [
    {
      title: 'Strategic Clarity Intensive',
      description: 'Deep-dive sessions to align organizational vision with divine strategy',
      duration: '3-month engagement',
      investment: 'Starting at $25K'
    },
    {
      title: 'Executive Coaching Program',
      description: 'Personalized leadership development with prophetic intelligence integration',
      duration: '6-month program',
      investment: 'Starting at $15K'
    },
    {
      title: 'Organizational Transformation',
      description: 'Complete restructuring for kingdom-aligned business operations',
      duration: '12-month process',
      investment: 'Starting at $75K'
    }
  ];

  // Show loading state until mounted
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-slate-800">
        <div className="flex items-center justify-center h-screen">
          <div className="text-white">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-slate-800">
      {/* Professional background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -right-4 w-96 h-96 bg-gradient-to-br from-blue-600/10 to-indigo-600/8 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 -left-4 w-80 h-80 bg-gradient-to-br from-slate-600/8 to-gray-600/6 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-br from-indigo-600/8 to-blue-600/6 rounded-full blur-3xl animate-pulse delay-2000"></div>

        {/* Professional geometric patterns */}
        <div className="absolute top-20 left-20 w-24 h-24 border border-blue-400/15 rotate-45 animate-spin-slow"></div>
        <div className="absolute top-40 right-32 w-16 h-16 border border-slate-400/20 rounded-full"></div>
        <div className="absolute bottom-32 left-40 w-12 h-12 bg-indigo-500/10 rotate-12"></div>

        {/* Modern grid overlay */}
        <div className="absolute inset-0 opacity-20">
          <div className="grid grid-cols-8 md:grid-cols-12 lg:grid-cols-16 h-full">
            {Array.from({ length: 16 }).map((_, i) => (
              <div key={i} className="border-r border-slate-400/10"></div>
            ))}
          </div>
        </div>

        {/* Professional network connections */}
        <svg className="absolute top-32 right-24 w-32 h-32 text-blue-400/15" viewBox="0 0 100 100">
          <circle cx="25" cy="25" r="4" fill="currentColor"/>
          <circle cx="75" cy="35" r="3" fill="currentColor"/>
          <circle cx="60" cy="70" r="3.5" fill="currentColor"/>
          <circle cx="30" cy="65" r="2.5" fill="currentColor"/>
          <line x1="25" y1="25" x2="75" y2="35" stroke="currentColor" strokeWidth="1"/>
          <line x1="75" y1="35" x2="60" y2="70" stroke="currentColor" strokeWidth="1"/>
          <line x1="60" y1="70" x2="30" y2="65" stroke="currentColor" strokeWidth="1"/>
          <line x1="30" y1="65" x2="25" y2="25" stroke="currentColor" strokeWidth="1"/>
        </svg>
      </div>

      <div className="relative z-10">
        <div className="container mx-auto px-4 pt-32 pb-20">
          {/* Hero Section */}
          <div className="max-w-4xl mx-auto text-center mb-20">
            {/* Professional Logo */}
            <div className="relative mb-12">
              <div className="w-32 h-32 mx-auto bg-gradient-to-br from-blue-600/20 to-indigo-600/15 rounded-full flex items-center justify-center border border-blue-400/30">
                <svg className="w-16 h-16 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="text-white">Speaking &</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-indigo-400 to-slate-400 animate-pulse">
                Consulting
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Transforming leaders and organizations through strategic speaking engagements and comprehensive
              consulting services that bridge visionary thinking with practical implementation.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link
                href="/lorenzo/connect"
                onClick={() => handleCTAClick('book_speaking')}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:shadow-2xl hover:shadow-blue-500/20 transition-all transform hover:scale-105"
              >
                Book Speaking
              </Link>
              <Link
                href="/lorenzo/connect"
                onClick={() => handleCTAClick('consulting_inquiry')}
                className="px-8 py-4 bg-white/10 backdrop-blur text-white font-semibold rounded-lg border border-blue-400/30 hover:bg-white/20 transition-all"
              >
                Consulting Inquiry
              </Link>
            </div>
          </div>

          {/* Service Tabs */}
          <div className="max-w-6xl mx-auto mb-12">
            <div className="flex justify-center mb-8">
              <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-2 border border-slate-600/30">
                <button
                  onClick={() => setSelectedTab('speaking')}
                  className={`px-8 py-3 rounded-lg font-semibold transition-all ${
                    selectedTab === 'speaking'
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                  }`}
                >
                  Speaking
                </button>
                <button
                  onClick={() => setSelectedTab('consulting')}
                  className={`px-8 py-3 rounded-lg font-semibold transition-all ${
                    selectedTab === 'consulting'
                      ? 'bg-indigo-600 text-white shadow-lg'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                  }`}
                >
                  Consulting
                </button>
              </div>
            </div>

            {/* Speaking Content */}
            {selectedTab === 'speaking' && (
              <div className="space-y-8">
                <h2 className="text-4xl font-bold text-center text-white mb-12">
                  Speaking Topics & Engagements
                </h2>
                <div className="grid md:grid-cols-3 gap-8">
                  {speakingTopics.map((topic, index) => (
                    <div key={index} className="group bg-white/5 backdrop-blur-xl rounded-xl p-8 border border-blue-500/20 hover:border-blue-400/40 hover:bg-white/10 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10 hover:scale-105">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mb-6 group-hover:animate-pulse">
                        <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                        </svg>
                      </div>
                      <h3 className="text-2xl font-semibold text-white mb-4">{topic.title}</h3>
                      <p className="text-slate-300 mb-4">{topic.description}</p>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center text-blue-300">
                          <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                          {topic.audience}
                        </div>
                        <div className="flex items-center text-indigo-300">
                          <span className="w-2 h-2 bg-indigo-400 rounded-full mr-2"></span>
                          {topic.format}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Consulting Content */}
            {selectedTab === 'consulting' && (
              <div className="space-y-8">
                <h2 className="text-4xl font-bold text-center text-white mb-12">
                  Consulting Services & Programs
                </h2>
                <div className="grid md:grid-cols-3 gap-8">
                  {consultingServices.map((service, index) => (
                    <div key={index} className="group bg-white/5 backdrop-blur-xl rounded-xl p-8 border border-indigo-500/20 hover:border-indigo-400/40 hover:bg-white/10 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10 hover:scale-105">
                      <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mb-6 group-hover:animate-pulse">
                        <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h3 className="text-2xl font-semibold text-white mb-4">{service.title}</h3>
                      <p className="text-slate-300 mb-6">{service.description}</p>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center text-indigo-300">
                          <span className="w-2 h-2 bg-indigo-400 rounded-full mr-2"></span>
                          Duration: {service.duration}
                        </div>
                        <div className="flex items-center text-purple-300">
                          <span className="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
                          Investment: {service.investment}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Client Results */}
          <div className="max-w-6xl mx-auto mb-20">
            <h2 className="text-4xl font-bold text-center text-white mb-12">
              Client Success Stories
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-blue-900/30 to-indigo-900/30 backdrop-blur-xl rounded-xl p-8 border border-blue-400/20">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">JK</span>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-white font-semibold">Jennifer Kim, CEO</h4>
                    <p className="text-blue-200 text-sm">Fortune 500 Technology</p>
                  </div>
                </div>
                <p className="text-slate-300 italic mb-4">
                  "Lorenzo's speaking engagement transformed our entire leadership philosophy. His strategic clarity intensive
                  helped us navigate a $2B acquisition with divine precision."
                </p>
                <div className="flex text-blue-400">
                  {"★".repeat(5)}
                </div>
              </div>

              <div className="bg-gradient-to-br from-indigo-900/30 to-slate-900/30 backdrop-blur-xl rounded-xl p-8 border border-indigo-400/20">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-slate-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">MR</span>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-white font-semibold">Michael Rodriguez</h4>
                    <p className="text-indigo-200 text-sm">Ministry Network Leader</p>
                  </div>
                </div>
                <p className="text-slate-300 italic mb-4">
                  "The organizational transformation consulting completely revolutionized our 500+ church network.
                  We saw 300% growth in kingdom impact within 18 months."
                </p>
                <div className="flex text-indigo-400">
                  {"★".repeat(5)}
                </div>
              </div>
            </div>
          </div>

          {/* Professional Metrics */}
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-gradient-to-r from-slate-800/50 to-blue-800/50 backdrop-blur-xl rounded-2xl p-8 border border-blue-400/20">
              <h2 className="text-3xl font-bold text-white mb-6">Professional Impact & Reach</h2>
              <div className="grid md:grid-cols-4 gap-8 text-center">
                <div>
                  <div className="text-3xl font-bold text-blue-400 mb-2">250+</div>
                  <div className="text-slate-300">Speaking Events</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-indigo-400 mb-2">89</div>
                  <div className="text-slate-300">Organizations Served</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-slate-400 mb-2">45+</div>
                  <div className="text-slate-300">Countries Reached</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-400 mb-2">$50M+</div>
                  <div className="text-slate-300">Client Value Created</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}