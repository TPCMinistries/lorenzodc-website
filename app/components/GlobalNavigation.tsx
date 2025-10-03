"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";

export default function GlobalNavigation() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setMounted(true);

    // Cleanup timeout on unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleDropdownEnter = (dropdown: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setActiveDropdown(dropdown);
  };

  const handleDropdownLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 500);
  };

  const handleCatalystNavigation = (url: string) => {
    // Close dropdown
    setActiveDropdown(null);
    // Use window.location for cross-layout navigation to avoid black screen
    window.location.href = url;
  };

  return (
    <header className="fixed w-full top-0 z-50 bg-gradient-to-r from-slate-900/98 via-indigo-950/95 to-slate-900/98 backdrop-blur-xl border-b border-indigo-500/30 shadow-2xl">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/10 to-cyan-600/5" />

      <nav className="relative max-w-8xl mx-auto px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Premium Logo */}
          <Link href="/lorenzo" className="group flex items-center space-x-3 hover:scale-105 transition-all duration-300">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-400 via-purple-500 to-cyan-400 rounded-2xl blur opacity-75 group-hover:opacity-100 transition-opacity" />
              <div className="relative w-14 h-14 bg-gradient-to-br from-indigo-500 via-purple-600 to-cyan-500 rounded-2xl flex items-center justify-center shadow-2xl border border-indigo-400/50">
                <span className="text-white font-bold text-xl tracking-tight">LDC</span>
              </div>
            </div>
            <div className="hidden xl:block">
              <div className="text-white font-bold text-lg tracking-wide leading-tight">
                <div>Lorenzo</div>
                <div>Daughtry-Chambers</div>
              </div>
              <div className="text-indigo-300 text-xs font-medium mt-1">Divine Strategy & AI Innovation</div>
            </div>
          </Link>

          {/* Premium Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            <Link href="/lorenzo" className="group relative px-4 py-2.5 text-gray-300 hover:text-white transition-all duration-300 font-medium text-sm tracking-wide whitespace-nowrap">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/0 to-purple-600/0 group-hover:from-indigo-600/20 group-hover:to-purple-600/20 rounded-xl transition-all duration-300" />
              <span className="relative">HOME</span>
            </Link>

            <Link href="/lorenzo/divine-strategy" className="group relative px-4 py-2.5 text-gray-300 hover:text-white transition-all duration-300 font-medium text-sm tracking-wide whitespace-nowrap">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/0 to-purple-600/0 group-hover:from-indigo-600/20 group-hover:to-purple-600/20 rounded-xl transition-all duration-300" />
              <span className="relative">DIVINE STRATEGY</span>
            </Link>

            {/* Enhanced Catalyst AI Dropdown */}
            <div
              className="relative group"
              onMouseEnter={() => handleDropdownEnter('catalyst')}
              onMouseLeave={handleDropdownLeave}
            >
              <button
                onClick={() => handleCatalystNavigation('/catalyst')}
                className="group relative px-4 py-2.5 text-gray-300 hover:text-white transition-all duration-300 flex items-center space-x-2 font-medium text-sm tracking-wide whitespace-nowrap"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/0 to-blue-600/0 group-hover:from-cyan-600/20 group-hover:to-blue-600/20 rounded-xl transition-all duration-300" />
                <span className="relative">CATALYST AI</span>
                <svg className="relative w-4 h-4 transition-transform duration-300 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {mounted && activeDropdown === 'catalyst' && (
                <div
                  className="absolute top-full left-0 mt-1 w-96 bg-slate-900 backdrop-blur-3xl border border-indigo-400/70 rounded-3xl shadow-2xl z-[100] overflow-hidden"
                  onMouseEnter={() => handleDropdownEnter('catalyst')}
                  onMouseLeave={handleDropdownLeave}
                  style={{ backgroundColor: 'rgba(15, 23, 42, 0.95)' }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-800/90 via-indigo-900/80 to-slate-800/90" />
                  <div className="relative p-6 space-y-1">
                    <button onClick={() => handleCatalystNavigation('/catalyst')} className="group block w-full text-left px-5 py-5 text-gray-300 hover:text-white transition-all duration-200 rounded-2xl hover:bg-gradient-to-r hover:from-indigo-600/40 hover:to-purple-600/40 border border-transparent hover:border-indigo-500/40 hover:shadow-lg">
                      <div className="font-semibold text-lg mb-1 group-hover:text-indigo-300">Overview</div>
                      <div className="text-sm text-gray-400 group-hover:text-gray-300">Complete Catalyst AI platform overview</div>
                    </button>

                    <button onClick={() => handleCatalystNavigation('/chat')} className="group block w-full text-left px-5 py-5 text-gray-300 hover:text-white transition-all duration-200 rounded-2xl hover:bg-gradient-to-r hover:from-cyan-600/40 hover:to-blue-600/40 border border-transparent hover:border-cyan-500/40 hover:shadow-lg">
                      <div className="font-semibold text-lg mb-1 group-hover:text-cyan-300">AI Chat</div>
                      <div className="text-sm text-gray-400 group-hover:text-gray-300">Interactive AI assistant</div>
                    </button>

                    <button onClick={() => handleCatalystNavigation('/enterprise/rag')} className="group block w-full text-left px-5 py-5 text-gray-300 hover:text-white transition-all duration-200 rounded-2xl hover:bg-gradient-to-r hover:from-emerald-600/40 hover:to-teal-600/40 border border-transparent hover:border-emerald-500/40 hover:shadow-lg">
                      <div className="font-semibold text-lg mb-1 group-hover:text-emerald-300">Document Intelligence</div>
                      <div className="text-sm text-gray-400 group-hover:text-gray-300">Chat with your PDF documents</div>
                    </button>

                    <button onClick={() => handleCatalystNavigation('/enterprise/roi')} className="group block w-full text-left px-5 py-5 text-gray-300 hover:text-white transition-all duration-200 rounded-2xl hover:bg-gradient-to-r hover:from-amber-600/40 hover:to-orange-600/40 border border-transparent hover:border-amber-500/40 hover:shadow-lg">
                      <div className="font-semibold text-lg mb-1 group-hover:text-amber-300">ROI Calculator</div>
                      <div className="text-sm text-gray-400 group-hover:text-gray-300">Calculate AI implementation returns</div>
                    </button>

                    <button onClick={() => handleCatalystNavigation('/enterprise/diagnostic')} className="group block w-full text-left px-5 py-5 text-gray-300 hover:text-white transition-all duration-200 rounded-2xl hover:bg-gradient-to-r hover:from-purple-600/40 hover:to-pink-600/40 border border-transparent hover:border-purple-500/40 hover:shadow-lg">
                      <div className="font-semibold text-lg mb-1 group-hover:text-purple-300">Enterprise Diagnostic</div>
                      <div className="text-sm text-gray-400 group-hover:text-gray-300">Assess your AI readiness</div>
                    </button>

                    <button onClick={() => handleCatalystNavigation('/enterprise/blueprints')} className="group block w-full text-left px-5 py-5 text-gray-300 hover:text-white transition-all duration-200 rounded-2xl hover:bg-gradient-to-r hover:from-red-600/40 hover:to-rose-600/40 border border-transparent hover:border-red-500/40 hover:shadow-lg">
                      <div className="font-semibold text-lg mb-1 group-hover:text-red-300">AI Blueprints</div>
                      <div className="text-sm text-gray-400 group-hover:text-gray-300">Strategic AI implementation plans</div>
                    </button>
                  </div>
                </div>
              )}
            </div>

            <Link href="/lorenzo/ministry" className="group relative px-4 py-2.5 text-gray-300 hover:text-white transition-all duration-300 font-medium text-sm tracking-wide whitespace-nowrap">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/0 to-purple-600/0 group-hover:from-indigo-600/20 group-hover:to-purple-600/20 rounded-xl transition-all duration-300" />
              <span className="relative">MINISTRY</span>
            </Link>

            {/* Enhanced Global Development Dropdown */}
            <div
              className="relative group"
              onMouseEnter={() => handleDropdownEnter('global')}
              onMouseLeave={handleDropdownLeave}
            >
              <button className="group relative px-4 py-2.5 text-gray-300 hover:text-white transition-all duration-300 flex items-center space-x-2 font-medium text-sm tracking-wide whitespace-nowrap">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/0 to-teal-600/0 group-hover:from-emerald-600/20 group-hover:to-teal-600/20 rounded-xl transition-all duration-300" />
                <span className="relative">GLOBAL DEVELOPMENT</span>
                <svg className="relative w-4 h-4 transition-transform duration-300 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {mounted && activeDropdown === 'global' && (
                <div
                  className="absolute top-full left-0 mt-2 w-96 bg-slate-900 backdrop-blur-2xl border border-emerald-400/50 rounded-3xl shadow-2xl z-50 overflow-hidden"
                  onMouseEnter={() => handleDropdownEnter('global')}
                  onMouseLeave={handleDropdownLeave}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-800/80 via-emerald-900/60 to-slate-800/80" />
                  <div className="relative p-4 space-y-2">
                    <Link href="/lorenzo/institute" className="group block w-full text-left px-6 py-4 text-gray-300 hover:text-white transition-all duration-300 rounded-2xl hover:bg-gradient-to-r hover:from-emerald-600/30 hover:to-teal-600/30 border border-transparent hover:border-emerald-500/30">
                      <div className="font-semibold text-base mb-2 group-hover:text-emerald-300">Institute</div>
                      <div className="text-sm text-gray-400 group-hover:text-gray-300">Global leadership development programs</div>
                    </Link>

                    <Link href="/lorenzo/investment-fund" className="group block w-full text-left px-6 py-4 text-gray-300 hover:text-white transition-all duration-300 rounded-2xl hover:bg-gradient-to-r hover:from-amber-600/30 hover:to-orange-600/30 border border-transparent hover:border-amber-500/30">
                      <div className="font-semibold text-base mb-2 group-hover:text-amber-300">Investment Fund</div>
                      <div className="text-sm text-gray-400 group-hover:text-gray-300">Kingdom-aligned strategic investments</div>
                    </Link>

                    <Link href="/lorenzo/renewal-sanctuary" className="group block w-full text-left px-6 py-4 text-gray-300 hover:text-white transition-all duration-300 rounded-2xl hover:bg-gradient-to-r hover:from-purple-600/30 hover:to-pink-600/30 border border-transparent hover:border-purple-500/30">
                      <div className="font-semibold text-base mb-2 group-hover:text-purple-300">Renewal Sanctuary</div>
                      <div className="text-sm text-gray-400 group-hover:text-gray-300">Executive renewal and restoration</div>
                    </Link>

                    <Link href="/lorenzo/investment-metrics" className="group block w-full text-left px-6 py-4 text-gray-300 hover:text-white transition-all duration-300 rounded-2xl hover:bg-gradient-to-r hover:from-cyan-600/30 hover:to-blue-600/30 border border-transparent hover:border-cyan-500/30">
                      <div className="font-semibold text-base mb-2 group-hover:text-cyan-300">Investment Metrics</div>
                      <div className="text-sm text-gray-400 group-hover:text-gray-300">Strategic performance tracking</div>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link href="/lorenzo/speaking" className="group relative px-4 py-2.5 text-gray-300 hover:text-white transition-all duration-300 font-medium text-sm tracking-wide whitespace-nowrap">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/0 to-purple-600/0 group-hover:from-indigo-600/20 group-hover:to-purple-600/20 rounded-xl transition-all duration-300" />
              <span className="relative">SPEAKING & CONSULTING</span>
            </Link>

            <Link href="/lorenzo/connect" className="group relative px-4 py-2.5 text-gray-300 hover:text-white transition-all duration-300 font-medium text-sm tracking-wide whitespace-nowrap">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/0 to-purple-600/0 group-hover:from-indigo-600/20 group-hover:to-purple-600/20 rounded-xl transition-all duration-300" />
              <span className="relative">CONNECT</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden group p-3 text-gray-300 hover:text-white transition-all duration-300 hover:bg-white/10 rounded-xl"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          {/* Optimized Action Buttons */}
          <div className="hidden lg:flex items-center space-x-3">
            <Link
              href="/chat"
              className="group relative px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white border border-amber-500/50 hover:border-amber-400/50 rounded-xl transition-all duration-300 font-medium text-sm tracking-wide overflow-hidden shadow-lg hover:shadow-xl"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-transparent group-hover:from-white/10 group-hover:to-white/10 transition-all duration-300" />
              <span className="relative">LOGIN</span>
            </Link>
            <Link
              href="/lorenzo/assessment"
              className="group relative px-8 py-3 bg-gradient-to-r from-indigo-500 via-purple-600 to-cyan-500 hover:from-indigo-600 hover:via-purple-700 hover:to-cyan-600 text-white font-bold rounded-xl transition-all duration-300 text-sm tracking-wide shadow-xl hover:shadow-2xl transform hover:scale-105 overflow-hidden flex items-center justify-center"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 to-white/0 group-hover:from-white/10 group-hover:to-white/10 transition-all duration-300" />
              <span className="relative">Take Assessment</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mounted && mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-slate-900/95 backdrop-blur-xl">
          <div className="pt-20 px-6 pb-6 h-full overflow-y-auto">
            <nav className="space-y-4">
              {/* Main Navigation */}
              <Link
                href="/lorenzo"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-6 py-4 text-white hover:bg-white/10 rounded-xl transition-all duration-300 font-medium"
              >
                HOME
              </Link>

              {/* Catalyst AI Submenu */}
              <div className="space-y-2">
                <div className="px-6 py-2 text-cyan-400 font-semibold text-sm">CATALYST AI</div>
                <Link
                  href="/catalyst"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-8 py-3 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300"
                >
                  Overview
                </Link>
                <Link
                  href="/chat"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-8 py-3 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300"
                >
                  AI Chat
                </Link>
                <Link
                  href="/enterprise/rag"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-8 py-3 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300"
                >
                  Document Intelligence
                </Link>
                <Link
                  href="/enterprise/roi"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-8 py-3 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300"
                >
                  ROI Calculator
                </Link>
                <Link
                  href="/enterprise/diagnostic"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-8 py-3 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300"
                >
                  Enterprise Diagnostic
                </Link>
              </div>

              <Link
                href="/lorenzo/ministry"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-6 py-4 text-white hover:bg-white/10 rounded-xl transition-all duration-300 font-medium"
              >
                MINISTRY
              </Link>

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
                  href="/chat"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-xl font-medium"
                >
                  START CHAT
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
      )}
    </header>
  );
}