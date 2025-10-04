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


  return (
    <header className="fixed w-full top-0 z-50 bg-gradient-to-r from-slate-900/98 via-indigo-950/95 to-slate-900/98 backdrop-blur-xl border-b border-indigo-500/30 shadow-2xl">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/10 to-cyan-600/5" />

      <nav className="relative max-w-8xl mx-auto px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Premium Logo */}
          <Link href="/" className="group flex items-center space-x-3 hover:scale-105 transition-all duration-300">
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

          {/* Comprehensive Enterprise Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            <Link href="/" className="group relative px-4 py-2.5 text-gray-300 hover:text-white transition-all duration-300 font-medium text-sm tracking-wide whitespace-nowrap">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/0 to-purple-600/0 group-hover:from-indigo-600/20 group-hover:to-purple-600/20 rounded-xl transition-all duration-300" />
              <span className="relative">HOME</span>
            </Link>

            <Link href="/lorenzo/ministry" className="group relative px-4 py-2.5 text-gray-300 hover:text-white transition-all duration-300 font-medium text-sm tracking-wide whitespace-nowrap">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-600/0 to-orange-600/0 group-hover:from-amber-600/20 group-hover:to-orange-600/20 rounded-xl transition-all duration-300" />
              <span className="relative">MINISTRY</span>
            </Link>

            <Link href="/lorenzo/investment-fund" className="group relative px-4 py-2.5 text-gray-300 hover:text-white transition-all duration-300 font-medium text-sm tracking-wide whitespace-nowrap">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/0 to-teal-600/0 group-hover:from-emerald-600/20 group-hover:to-teal-600/20 rounded-xl transition-all duration-300" />
              <span className="relative">INVESTMENT</span>
            </Link>

            <Link href="/lorenzo/institute" className="group relative px-4 py-2.5 text-gray-300 hover:text-white transition-all duration-300 font-medium text-sm tracking-wide whitespace-nowrap">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 to-cyan-600/0 group-hover:from-blue-600/20 group-hover:to-cyan-600/20 rounded-xl transition-all duration-300" />
              <span className="relative">INSTITUTE</span>
            </Link>

            <Link href="/chat" className="group relative px-4 py-2.5 text-gray-300 hover:text-white transition-all duration-300 font-medium text-sm tracking-wide whitespace-nowrap">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 to-pink-600/0 group-hover:from-purple-600/20 group-hover:to-pink-600/20 rounded-xl transition-all duration-300" />
              <span className="relative">CATALYST AI</span>
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
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-6 py-4 text-white hover:bg-white/10 rounded-xl transition-all duration-300 font-medium"
              >
                HOME
              </Link>

              <Link
                href="/lorenzo/ministry"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-6 py-4 text-white hover:bg-white/10 rounded-xl transition-all duration-300 font-medium"
              >
                TPC MINISTRIES
              </Link>

              <Link
                href="/lorenzo/investment-fund"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-6 py-4 text-white hover:bg-white/10 rounded-xl transition-all duration-300 font-medium"
              >
                INVESTMENT FUND
              </Link>

              <Link
                href="/lorenzo/institute"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-6 py-4 text-white hover:bg-white/10 rounded-xl transition-all duration-300 font-medium"
              >
                GLOBAL INSTITUTE
              </Link>

              <Link
                href="/chat"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-6 py-4 text-white hover:bg-white/10 rounded-xl transition-all duration-300 font-medium"
              >
                CATALYST AI
              </Link>

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