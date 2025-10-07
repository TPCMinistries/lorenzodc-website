"use client";
import Link from "next/link";
import { useState } from "react";

export default function GlobalNavigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);


  return (
    <header className="fixed w-full top-0 z-[85] backdrop-blur-2xl border-b border-purple-500/30 shadow-2xl">
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-purple-950/95 via-indigo-950/95 to-slate-950/90"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/15 via-indigo-500/20 via-violet-500/15 to-purple-500/15"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-950/30"></div>
      <nav className="relative max-w-7xl mx-auto px-6 py-5">
        <div className="flex items-center justify-between">
          {/* Lorenzo's Brand */}
          <Link href="/" className="group flex items-center space-x-4 transition-all duration-300">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-400 via-indigo-500 to-violet-400 rounded-xl blur-sm opacity-70 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative w-12 h-12 bg-gradient-to-br from-purple-500 via-indigo-600 to-violet-500 rounded-xl flex items-center justify-center shadow-xl border border-white/20">
                <span className="text-white font-bold text-lg tracking-tight drop-shadow-sm">LDC</span>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="text-white font-semibold text-base leading-tight">
                Lorenzo Daughtry-Chambers
              </div>
              <div className="text-slate-300 text-xs font-medium mt-0.5">Founder & Visionary Leader</div>
            </div>
          </Link>

          {/* Enhanced Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            <Link href="/" className="relative group text-slate-100 hover:text-white transition-all duration-300 font-semibold text-sm px-4 py-2 rounded-lg hover:bg-gradient-to-r hover:from-amber-500/15 hover:to-orange-500/15 hover:shadow-lg hover:shadow-amber-500/20">
              HOME
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 group-hover:w-full transition-all duration-500"></div>
            </Link>

            <Link href="/perpetual-engine" className="relative group text-slate-100 hover:text-white transition-all duration-300 font-semibold text-sm px-4 py-2 rounded-lg hover:bg-gradient-to-r hover:from-purple-500/15 hover:to-indigo-500/15 hover:shadow-lg hover:shadow-purple-500/20 whitespace-nowrap">
              ENGINE
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 via-indigo-400 to-blue-400 group-hover:w-full transition-all duration-500"></div>
            </Link>

            <Link href="/ministry" className="relative group text-slate-100 hover:text-white transition-all duration-300 font-semibold text-sm px-4 py-2 rounded-lg hover:bg-gradient-to-r hover:from-emerald-500/15 hover:to-teal-500/15 hover:shadow-lg hover:shadow-emerald-500/20">
              MINISTRY
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 group-hover:w-full transition-all duration-500"></div>
            </Link>

            {/* Catalyst AI Dropdown */}
            <div className="relative group">
              <button className="relative group/btn text-slate-100 hover:text-white transition-all duration-300 font-semibold text-sm flex items-center px-4 py-2 rounded-lg hover:bg-gradient-to-r hover:from-cyan-500/15 hover:to-blue-500/15 hover:shadow-lg hover:shadow-cyan-500/20 whitespace-nowrap">
                CATALYST AI
                <svg className="w-3 h-3 ml-1 transition-transform duration-200 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 group-hover:w-full transition-all duration-500"></div>
              </button>

              {/* Catalyst AI Dropdown Menu */}
              <div className="absolute top-full left-0 mt-3 w-80 bg-slate-900 backdrop-blur-2xl border border-slate-600 rounded-xl shadow-2xl opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-300">
                <div className="p-4 space-y-2">
                  <Link href="/catalyst" className="flex items-center p-3 rounded-xl hover:bg-slate-700/50 transition-all duration-200 group/item">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center mr-3 group-hover/item:scale-105 transition-transform">
                      <span className="text-lg">🤖</span>
                    </div>
                    <div>
                      <div className="text-white font-medium text-sm">AI Platform</div>
                      <div className="text-slate-400 text-xs">Main dashboard & overview</div>
                    </div>
                  </Link>

                  <Link href="/chat" className="flex items-center p-3 rounded-xl hover:bg-slate-700/50 transition-all duration-200 group/item">
                    <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center mr-3 group-hover/item:scale-105 transition-transform">
                      <span className="text-lg">💬</span>
                    </div>
                    <div>
                      <div className="text-white font-medium text-sm">AI Chat</div>
                      <div className="text-slate-400 text-xs">Interactive conversations</div>
                    </div>
                  </Link>

                  <Link href="/enterprise/diagnostic" className="flex items-center p-3 rounded-xl hover:bg-slate-700/50 transition-all duration-200 group/item">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-violet-500 rounded-lg flex items-center justify-center mr-3 group-hover/item:scale-105 transition-transform">
                      <span className="text-lg">🔍</span>
                    </div>
                    <div>
                      <div className="text-white font-medium text-sm">AI Assessment</div>
                      <div className="text-slate-400 text-xs">Readiness evaluation</div>
                    </div>
                  </Link>

                  <Link href="/enterprise/rag" className="flex items-center p-3 rounded-xl hover:bg-slate-700/50 transition-all duration-200 group/item">
                    <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center mr-3 group-hover/item:scale-105 transition-transform">
                      <span className="text-lg">📄</span>
                    </div>
                    <div>
                      <div className="text-white font-medium text-sm">Document AI</div>
                      <div className="text-slate-400 text-xs">Upload & analyze docs</div>
                    </div>
                  </Link>

                  <Link href="/enterprise/roi" className="flex items-center p-3 rounded-xl hover:bg-slate-700/50 transition-all duration-200 group/item">
                    <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg flex items-center justify-center mr-3 group-hover/item:scale-105 transition-transform">
                      <span className="text-lg">📊</span>
                    </div>
                    <div>
                      <div className="text-white font-medium text-sm">ROI Calculator</div>
                      <div className="text-slate-400 text-xs">Impact analysis</div>
                    </div>
                  </Link>

                  <Link href="/enterprise/blueprints" className="flex items-center p-3 rounded-xl hover:bg-slate-700/50 transition-all duration-200 group/item">
                    <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-rose-500 rounded-lg flex items-center justify-center mr-3 group-hover/item:scale-105 transition-transform">
                      <span className="text-lg">🎯</span>
                    </div>
                    <div>
                      <div className="text-white font-medium text-sm">Strategic Blueprints</div>
                      <div className="text-slate-400 text-xs">90-day roadmaps</div>
                    </div>
                  </Link>

                  <Link href="/enterprise" className="flex items-center p-3 rounded-xl hover:bg-slate-700/50 transition-all duration-200 group/item">
                    <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-lg flex items-center justify-center mr-3 group-hover/item:scale-105 transition-transform">
                      <span className="text-lg">🏢</span>
                    </div>
                    <div>
                      <div className="text-white font-medium text-sm">Enterprise Suite</div>
                      <div className="text-slate-400 text-xs">Complete toolkit</div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>


            {/* Services Dropdown */}
            <div className="relative group">
              <button className="relative group/btn text-slate-100 hover:text-white transition-all duration-300 font-semibold text-sm flex items-center px-4 py-2 rounded-lg hover:bg-gradient-to-r hover:from-indigo-500/15 hover:to-purple-500/15 hover:shadow-lg hover:shadow-indigo-500/20">
                SERVICES
                <svg className="w-3 h-3 ml-1 transition-transform duration-200 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 group-hover:w-full transition-all duration-500"></div>
              </button>

              {/* Services Dropdown Menu */}
              <div className="absolute top-full left-0 mt-3 w-80 bg-slate-900 backdrop-blur-2xl border border-slate-600 rounded-xl shadow-2xl opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-300">
                <div className="p-4 space-y-2">
                  <Link href="/services" className="flex items-center p-3 rounded-xl hover:bg-slate-700/50 transition-all duration-200 group/item">
                    <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg flex items-center justify-center mr-3 group-hover/item:scale-105 transition-transform">
                      <span className="text-lg">⚡</span>
                    </div>
                    <div>
                      <div className="text-white font-medium text-sm">All Services</div>
                      <div className="text-slate-400 text-xs">Complete overview</div>
                    </div>
                  </Link>

                  <Link href="/lorenzo/divine-strategy" className="flex items-center p-3 rounded-xl hover:bg-slate-700/50 transition-all duration-200 group/item">
                    <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg flex items-center justify-center mr-3 group-hover/item:scale-105 transition-transform">
                      <span className="text-lg">⚡</span>
                    </div>
                    <div>
                      <div className="text-white font-medium text-sm">Divine Strategy</div>
                      <div className="text-slate-400 text-xs">Executive coaching</div>
                    </div>
                  </Link>

                  <Link href="/lorenzo/connect" className="flex items-center p-3 rounded-xl hover:bg-slate-700/50 transition-all duration-200 group/item">
                    <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center mr-3 group-hover/item:scale-105 transition-transform">
                      <span className="text-lg">🎯</span>
                    </div>
                    <div>
                      <div className="text-white font-medium text-sm">Strategic Consulting</div>
                      <div className="text-slate-400 text-xs">Enterprise transformation</div>
                    </div>
                  </Link>

                  <Link href="/lorenzo/speaking" className="flex items-center p-3 rounded-xl hover:bg-slate-700/50 transition-all duration-200 group/item">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center mr-3 group-hover/item:scale-105 transition-transform">
                      <span className="text-lg">🎤</span>
                    </div>
                    <div>
                      <div className="text-white font-medium text-sm">Speaking</div>
                      <div className="text-slate-400 text-xs">Global engagements</div>
                    </div>
                  </Link>

                  <Link href="/lorenzo/assessment" className="flex items-center p-3 rounded-xl hover:bg-slate-700/50 transition-all duration-200 group/item">
                    <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center mr-3 group-hover/item:scale-105 transition-transform">
                      <span className="text-lg">📋</span>
                    </div>
                    <div>
                      <div className="text-white font-medium text-sm">Assessment</div>
                      <div className="text-slate-400 text-xs">Strategic evaluation</div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>

            <Link href="/lorenzo/connect" className="relative group text-slate-100 hover:text-white transition-all duration-300 font-semibold text-sm px-4 py-2 rounded-lg hover:bg-gradient-to-r hover:from-rose-500/15 hover:to-pink-500/15 hover:shadow-lg hover:shadow-rose-500/20">
              CONNECT
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-rose-400 via-pink-400 to-fuchsia-400 group-hover:w-full transition-all duration-500"></div>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => {
              console.log('Mobile menu toggled:', !mobileMenuOpen);
              setMobileMenuOpen(!mobileMenuOpen);
            }}
            className="lg:hidden group p-3 text-white hover:text-white transition-all duration-300 hover:bg-white/10 rounded-xl z-[1000] relative"
            aria-label="Toggle mobile menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          {/* Refined Action Buttons */}
          <div className="hidden lg:flex items-center space-x-3">
            <Link
              href="/catalyst"
              className="group relative px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-lg transition-all duration-300 font-medium text-sm shadow-lg hover:shadow-xl"
            >
              <span className="relative">Try Catalyst AI</span>
            </Link>
            <Link
              href="/lorenzo/assessment"
              className="group relative px-4 py-2 bg-white/10 hover:bg-white/15 border border-white/20 hover:border-white/30 text-white rounded-lg transition-all duration-300 font-medium text-sm backdrop-blur-sm"
            >
              <span className="relative">Assessment</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-[999] bg-slate-900 backdrop-blur-xl">
          <div className="flex flex-col h-full">
            {/* Mobile menu header with close button */}
            <div className="flex items-center justify-between p-6 border-b border-slate-700/50 bg-slate-900">
              <div className="text-white font-semibold text-lg">Menu</div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-white hover:bg-white/10 rounded-xl transition-all duration-300"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex-1 px-6 py-6 overflow-y-auto bg-slate-900">
              <nav className="space-y-4">
              {/* Streamlined Mobile Navigation */}
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-6 py-4 text-white hover:bg-white/10 rounded-xl transition-all duration-300 font-medium"
              >
                HOME
              </Link>

              <Link
                href="/perpetual-engine"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-6 py-4 text-white hover:bg-white/10 rounded-xl transition-all duration-300 font-medium"
              >
                THE ENGINE
              </Link>

              <Link
                href="/ministry"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-6 py-4 text-white hover:bg-white/10 rounded-xl transition-all duration-300 font-medium"
              >
                MINISTRY
              </Link>

              {/* Catalyst AI Mobile Section */}
              <div className="space-y-2">
                <div className="px-6 py-2 text-purple-400 font-semibold text-sm tracking-wide">CATALYST AI</div>
                <Link href="/catalyst" onClick={() => setMobileMenuOpen(false)} className="flex items-center px-6 py-3 text-white hover:bg-white/10 rounded-xl transition-all duration-300 ml-2">
                  <span className="text-lg mr-3">🤖</span>
                  <div>
                    <div className="font-medium">AI Platform</div>
                    <div className="text-slate-400 text-xs">Main dashboard</div>
                  </div>
                </Link>
                <Link href="/chat" onClick={() => setMobileMenuOpen(false)} className="flex items-center px-6 py-3 text-white hover:bg-white/10 rounded-xl transition-all duration-300 ml-2">
                  <span className="text-lg mr-3">💬</span>
                  <div>
                    <div className="font-medium">AI Chat</div>
                    <div className="text-slate-400 text-xs">Interactive conversations</div>
                  </div>
                </Link>
                <Link href="/enterprise/diagnostic" onClick={() => setMobileMenuOpen(false)} className="flex items-center px-6 py-3 text-white hover:bg-white/10 rounded-xl transition-all duration-300 ml-2">
                  <span className="text-lg mr-3">🔍</span>
                  <div>
                    <div className="font-medium">AI Assessment</div>
                    <div className="text-slate-400 text-xs">Readiness evaluation</div>
                  </div>
                </Link>
                <Link href="/enterprise/rag" onClick={() => setMobileMenuOpen(false)} className="flex items-center px-6 py-3 text-white hover:bg-white/10 rounded-xl transition-all duration-300 ml-2">
                  <span className="text-lg mr-3">📄</span>
                  <div>
                    <div className="font-medium">Document AI</div>
                    <div className="text-slate-400 text-xs">Upload & analyze</div>
                  </div>
                </Link>
                <Link href="/enterprise/roi" onClick={() => setMobileMenuOpen(false)} className="flex items-center px-6 py-3 text-white hover:bg-white/10 rounded-xl transition-all duration-300 ml-2">
                  <span className="text-lg mr-3">📊</span>
                  <div>
                    <div className="font-medium">ROI Calculator</div>
                    <div className="text-slate-400 text-xs">Impact analysis</div>
                  </div>
                </Link>
              </div>

              {/* Renewal Sanctuary Mobile Section */}
              <div className="space-y-2 pt-4">
                <Link
                  href="/renewal-sanctuary"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-6 py-4 text-white hover:bg-white/10 rounded-xl transition-all duration-300 font-medium"
                >
                  <div className="flex items-center">
                    <span className="text-2xl mr-4">🏔️</span>
                    <div>
                      <div className="text-emerald-400 font-semibold">RENEWAL SANCTUARY</div>
                      <div className="text-slate-400 text-sm">Premium Wellness Enterprise</div>
                    </div>
                  </div>
                </Link>
              </div>

              {/* Services Mobile Section */}
              <div className="space-y-2 pt-4">
                <div className="px-6 py-2 text-amber-400 font-semibold text-sm tracking-wide">SERVICES</div>
                <Link href="/services" onClick={() => setMobileMenuOpen(false)} className="flex items-center px-6 py-3 text-white hover:bg-white/10 rounded-xl transition-all duration-300 ml-2">
                  <span className="text-lg mr-3">⚡</span>
                  <div>
                    <div className="font-medium">All Services</div>
                    <div className="text-slate-400 text-xs">Complete overview</div>
                  </div>
                </Link>
                <Link href="/lorenzo/divine-strategy" onClick={() => setMobileMenuOpen(false)} className="flex items-center px-6 py-3 text-white hover:bg-white/10 rounded-xl transition-all duration-300 ml-2">
                  <span className="text-lg mr-3">⚡</span>
                  <div>
                    <div className="font-medium">Divine Strategy</div>
                    <div className="text-slate-400 text-xs">Executive coaching</div>
                  </div>
                </Link>
                <Link href="/lorenzo/connect" onClick={() => setMobileMenuOpen(false)} className="flex items-center px-6 py-3 text-white hover:bg-white/10 rounded-xl transition-all duration-300 ml-2">
                  <span className="text-lg mr-3">🎯</span>
                  <div>
                    <div className="font-medium">Strategic Consulting</div>
                    <div className="text-slate-400 text-xs">Enterprise transformation</div>
                  </div>
                </Link>
                <Link href="/lorenzo/speaking" onClick={() => setMobileMenuOpen(false)} className="flex items-center px-6 py-3 text-white hover:bg-white/10 rounded-xl transition-all duration-300 ml-2">
                  <span className="text-lg mr-3">🎤</span>
                  <div>
                    <div className="font-medium">Speaking</div>
                    <div className="text-slate-400 text-xs">Global engagements</div>
                  </div>
                </Link>
              </div>

              <Link
                href="/lorenzo/connect"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-6 py-4 text-white hover:bg-white/10 rounded-xl transition-all duration-300 font-medium"
              >
                CONNECT
              </Link>

              {/* Action Buttons */}
              <div className="pt-6 space-y-4">
                <Link
                  href="/catalyst"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-xl font-medium"
                >
                  CATALYST AI
                </Link>
                <Link
                  href="/lorenzo/assessment"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center px-6 py-3 bg-gradient-to-r from-indigo-500 via-purple-600 to-cyan-500 text-white rounded-xl font-bold"
                >
                  Take Assessment
                </Link>
              </div>
              </nav>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}