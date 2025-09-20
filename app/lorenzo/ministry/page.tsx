"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ConversionTrackingService } from "../../lib/services/conversion-tracking";

export default function TPCMinistriesPage() {
  // Track page view
  useEffect(() => {
    ConversionTrackingService.trackPageView('/lorenzo/ministry', undefined, {
      page_type: 'ministry_page',
      ministry_type: 'tpc_ministries',
      platform: 'lorenzo_site'
    });
  }, []);

  const handleCTAClick = (action: string) => {
    ConversionTrackingService.trackConversion('lead', {
      event: action,
      content_type: 'ministry_cta',
      content_category: 'spiritual_community',
      metadata: {
        action_type: action
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-950 via-orange-900 to-red-900">
      {/* Warm spiritual background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -right-4 w-96 h-96 bg-gradient-to-br from-yellow-500/20 to-amber-500/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 -left-4 w-80 h-80 bg-gradient-to-br from-orange-500/15 to-red-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-br from-amber-600/15 to-yellow-600/10 rounded-full blur-3xl animate-pulse delay-2000"></div>

        {/* Sacred geometry patterns */}
        <div className="absolute top-32 left-20 w-24 h-24 border-2 border-amber-400/20 rounded-full animate-spin-slow"></div>
        <div className="absolute top-40 left-28 w-8 h-8 border border-yellow-500/30 rounded-full"></div>
        <div className="absolute bottom-40 right-32 w-16 h-16 border border-orange-400/25 rotate-45 animate-pulse"></div>

        {/* Light rays */}
        <div className="absolute top-0 left-1/4 w-px h-64 bg-gradient-to-b from-yellow-400/30 to-transparent"></div>
        <div className="absolute top-0 right-1/3 w-px h-48 bg-gradient-to-b from-amber-400/25 to-transparent"></div>
      </div>

      <div className="relative z-10">
        <div className="container mx-auto px-4 pt-32 pb-20">
          {/* Hero Section */}
          <div className="max-w-4xl mx-auto text-center mb-20">
            {/* Ministry Symbol */}
            <div className="relative mb-12">
              <div className="w-32 h-32 mx-auto bg-gradient-to-br from-amber-500/20 to-yellow-500/20 rounded-full flex items-center justify-center border border-amber-400/30">
                <svg className="w-16 h-16 text-amber-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L13.09 7.26L18.75 5.5L16.26 10.74L21.5 12L16.26 13.26L18.75 18.5L13.09 16.74L12 22L10.91 16.74L5.25 18.5L7.74 13.26L2.5 12L7.74 10.74L5.25 5.5L10.91 7.26L12 2Z"/>
                </svg>
              </div>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="text-white">TPC</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-400 to-orange-400 animate-pulse">
                Ministries
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-amber-100 mb-8 max-w-3xl mx-auto leading-relaxed">
              Transforming communities through prophetic ministry, divine healing, and kingdom-building initiatives
              that bridge the spiritual and practical realms.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link
                href="/lorenzo/connect"
                onClick={() => handleCTAClick('ministry_partnership')}
                className="px-8 py-4 bg-gradient-to-r from-amber-600 to-yellow-600 text-white font-semibold rounded-lg hover:shadow-2xl hover:shadow-amber-500/20 transition-all transform hover:scale-105"
              >
                Partner With Us
              </Link>
              <Link
                href="/lorenzo/assessment"
                onClick={() => handleCTAClick('spiritual_assessment')}
                className="px-8 py-4 bg-white/10 backdrop-blur text-white font-semibold rounded-lg border border-amber-400/30 hover:bg-white/20 transition-all"
              >
                Spiritual Assessment
              </Link>
            </div>
          </div>

          {/* Ministry Pillars */}
          <div className="max-w-6xl mx-auto mb-20">
            <h2 className="text-4xl font-bold text-center text-white mb-12">
              Our Ministry Pillars
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Prophetic Ministry */}
              <div className="group bg-white/5 backdrop-blur-xl rounded-xl p-8 border border-amber-500/20 hover:border-amber-400/40 hover:bg-white/10 transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/10 hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-full flex items-center justify-center mb-6 group-hover:animate-pulse">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold text-white mb-4">Prophetic Ministry</h3>
                <p className="text-amber-100 mb-6">
                  Releasing prophetic words, visions, and divine strategies that align leadership with God's purposes and timing.
                </p>
                <div className="text-amber-400 font-semibold group-hover:text-amber-300 transition-colors">
                  Prophetic activation →
                </div>
              </div>

              {/* Healing & Deliverance */}
              <div className="group bg-white/5 backdrop-blur-xl rounded-xl p-8 border border-orange-500/20 hover:border-orange-400/40 hover:bg-white/10 transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/10 hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-600 to-red-600 rounded-full flex items-center justify-center mb-6 group-hover:animate-pulse">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold text-white mb-4">Healing & Restoration</h3>
                <p className="text-amber-100 mb-6">
                  Bringing supernatural healing, emotional restoration, and breakthrough from limiting beliefs and strongholds.
                </p>
                <div className="text-orange-400 font-semibold group-hover:text-orange-300 transition-colors">
                  Healing ministry →
                </div>
              </div>

              {/* Kingdom Building */}
              <div className="group bg-white/5 backdrop-blur-xl rounded-xl p-8 border border-yellow-500/20 hover:border-yellow-400/40 hover:bg-white/10 transition-all duration-300 hover:shadow-2xl hover:shadow-yellow-500/10 hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-600 to-amber-600 rounded-full flex items-center justify-center mb-6 group-hover:animate-pulse">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold text-white mb-4">Kingdom Building</h3>
                <p className="text-amber-100 mb-6">
                  Establishing sustainable kingdom enterprises and community initiatives that demonstrate God's love in practical ways.
                </p>
                <div className="text-yellow-400 font-semibold group-hover:text-yellow-300 transition-colors">
                  Kingdom projects →
                </div>
              </div>
            </div>
          </div>

          {/* Impact Stories */}
          <div className="max-w-6xl mx-auto mb-20">
            <h2 className="text-4xl font-bold text-center text-white mb-12">
              Kingdom Impact Stories
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-amber-900/30 to-orange-900/30 backdrop-blur-xl rounded-xl p-8 border border-amber-400/20">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-600 to-yellow-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">TC</span>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-white font-semibold">Ministry Leader, Africa</h4>
                    <p className="text-amber-200 text-sm">Church Planting Network</p>
                  </div>
                </div>
                <p className="text-amber-100 italic mb-4">
                  "Through TPC Ministries' prophetic guidance, we've planted 47 churches across three nations. The kingdom business training provided sustainable funding for our missions."
                </p>
                <div className="flex text-amber-400">
                  {"★".repeat(5)}
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-900/30 to-red-900/30 backdrop-blur-xl rounded-xl p-8 border border-orange-400/20">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-600 to-red-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">MR</span>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-white font-semibold">Community Leader</h4>
                    <p className="text-amber-200 text-sm">Urban Renewal Project</p>
                  </div>
                </div>
                <p className="text-amber-100 italic mb-4">
                  "The healing ministry transformed our community. We went from 60% unemployment to establishing 12 kingdom businesses that now employ over 200 families."
                </p>
                <div className="flex text-amber-400">
                  {"★".repeat(5)}
                </div>
              </div>
            </div>
          </div>

          {/* Global Reach */}
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-gradient-to-r from-amber-800/50 to-orange-800/50 backdrop-blur-xl rounded-2xl p-8 border border-amber-400/20">
              <h2 className="text-3xl font-bold text-white mb-6">Global Kingdom Impact</h2>
              <div className="grid md:grid-cols-4 gap-8 text-center">
                <div>
                  <div className="text-3xl font-bold text-amber-400 mb-2">25+</div>
                  <div className="text-amber-200">Nations Reached</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-yellow-400 mb-2">147</div>
                  <div className="text-amber-200">Churches Planted</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-orange-400 mb-2">50K+</div>
                  <div className="text-amber-200">Lives Transformed</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-red-400 mb-2">$2.3M</div>
                  <div className="text-amber-200">Kingdom Investment</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}