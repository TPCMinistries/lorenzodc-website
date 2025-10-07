'use client';

import React from 'react';
import Link from 'next/link';

export default function RenewalSanctuaryPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950 to-teal-950">

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 to-teal-600/20 animate-pulse" />

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <div className="inline-block p-6 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-full mb-8">
              <svg className="w-16 h-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Renewal <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">Sanctuary</span>
            </h1>

            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              A sacred space for spiritual refreshing, physical restoration, and
              prophetic recalibration for leaders carrying heavy burdens.
            </p>

            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/lorenzo/connect"
                className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-lg hover:shadow-2xl transition-all transform hover:scale-105"
              >
                Reserve Your Retreat
              </Link>
              <Link
                href="#programs"
                className="px-8 py-4 bg-white/10 backdrop-blur text-white font-semibold rounded-lg border border-white/20 hover:bg-white/20 transition-all"
              >
                Explore Programs
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-20 px-4 bg-black/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-white mb-12">
            A Place of Divine Rest & Strategic Renewal
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/5 backdrop-blur rounded-xl p-8 border border-white/10">
              <div className="text-emerald-400 text-4xl mb-4">🙏</div>
              <h3 className="text-xl font-semibold text-white mb-3">Spiritual Restoration</h3>
              <p className="text-gray-300">
                Disconnect from the noise and reconnect with God through guided meditation,
                prayer, and prophetic ministry in a peaceful environment.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur rounded-xl p-8 border border-white/10">
              <div className="text-teal-400 text-4xl mb-4">💆</div>
              <h3 className="text-xl font-semibold text-white mb-3">Physical Wellness</h3>
              <p className="text-gray-300">
                Rejuvenate your body through spa treatments, healthy cuisine,
                nature walks, and restorative practices designed for busy leaders.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur rounded-xl p-8 border border-white/10">
              <div className="text-emerald-400 text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold text-white mb-3">Strategic Clarity</h3>
              <p className="text-gray-300">
                Gain divine perspective on your mission through prophetic guidance,
                strategic planning sessions, and vision alignment workshops.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section id="programs" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-white mb-12">
            Renewal Programs
          </h2>

          <div className="space-y-8">
            {/* Executive Sabbatical */}
            <div className="bg-gradient-to-r from-emerald-900/30 to-teal-900/30 rounded-2xl p-8 border border-emerald-500/30">
              <div className="flex flex-col md:flex-row items-start gap-6">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white mb-3">
                    Executive Sabbatical (7-30 Days)
                  </h3>
                  <p className="text-gray-300 mb-4">
                    Extended retreat for senior leaders experiencing burnout or needing
                    major strategic realignment. Includes private quarters, personal chaplain,
                    and customized restoration plan.
                  </p>
                  <ul className="space-y-2 text-gray-300 mb-6">
                    <li className="flex items-start">
                      <span className="text-emerald-400 mr-2">✓</span>
                      Private accommodation with 24/7 concierge service
                    </li>
                    <li className="flex items-start">
                      <span className="text-emerald-400 mr-2">✓</span>
                      Daily prophetic sessions and spiritual direction
                    </li>
                    <li className="flex items-start">
                      <span className="text-emerald-400 mr-2">✓</span>
                      Comprehensive wellness and spa treatments
                    </li>
                    <li className="flex items-start">
                      <span className="text-emerald-400 mr-2">✓</span>
                      Strategic planning and vision casting sessions
                    </li>
                  </ul>
                  <div className="flex items-center gap-4">
                    <span className="text-2xl font-bold text-white">$15,000/week</span>
                    <Link
                      href="/lorenzo/connect"
                      className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
                    >
                      Apply Now
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Weekend Intensive */}
            <div className="bg-gradient-to-r from-teal-900/30 to-emerald-900/30 rounded-2xl p-8 border border-teal-500/30">
              <div className="flex flex-col md:flex-row items-start gap-6">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white mb-3">
                    Weekend Renewal Intensive
                  </h3>
                  <p className="text-gray-300 mb-4">
                    48-hour intensive designed for leaders who need quick restoration
                    without extended time away. Perfect for monthly or quarterly renewal.
                  </p>
                  <ul className="space-y-2 text-gray-300 mb-6">
                    <li className="flex items-start">
                      <span className="text-teal-400 mr-2">✓</span>
                      Friday evening through Sunday afternoon
                    </li>
                    <li className="flex items-start">
                      <span className="text-teal-400 mr-2">✓</span>
                      Group and individual ministry sessions
                    </li>
                    <li className="flex items-start">
                      <span className="text-teal-400 mr-2">✓</span>
                      Wellness activities and relaxation therapy
                    </li>
                    <li className="flex items-start">
                      <span className="text-teal-400 mr-2">✓</span>
                      Small group strategic sessions with peers
                    </li>
                  </ul>
                  <div className="flex items-center gap-4">
                    <span className="text-2xl font-bold text-white">$3,500/weekend</span>
                    <Link
                      href="/lorenzo/connect"
                      className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition"
                    >
                      Book Weekend
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Marriage Restoration */}
            <div className="bg-gradient-to-r from-emerald-900/30 to-teal-900/30 rounded-2xl p-8 border border-emerald-500/30">
              <div className="flex flex-col md:flex-row items-start gap-6">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white mb-3">
                    Marriage & Family Restoration
                  </h3>
                  <p className="text-gray-300 mb-4">
                    Specialized program for leadership couples and families needing
                    relational healing and alignment for greater kingdom impact.
                  </p>
                  <ul className="space-y-2 text-gray-300 mb-6">
                    <li className="flex items-start">
                      <span className="text-emerald-400 mr-2">✓</span>
                      Professional counseling and prophetic ministry
                    </li>
                    <li className="flex items-start">
                      <span className="text-emerald-400 mr-2">✓</span>
                      Family activities and bonding experiences
                    </li>
                    <li className="flex items-start">
                      <span className="text-emerald-400 mr-2">✓</span>
                      Communication and conflict resolution training
                    </li>
                    <li className="flex items-start">
                      <span className="text-emerald-400 mr-2">✓</span>
                      Vision alignment for ministry and family
                    </li>
                  </ul>
                  <div className="flex items-center gap-4">
                    <span className="text-2xl font-bold text-white">$8,000/week</span>
                    <Link
                      href="/lorenzo/connect"
                      className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
                    >
                      Restore Together
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Day Retreat */}
            <div className="bg-gradient-to-r from-teal-900/30 to-emerald-900/30 rounded-2xl p-8 border border-teal-500/30">
              <div className="flex flex-col md:flex-row items-start gap-6">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white mb-3">
                    Single Day Sanctuary
                  </h3>
                  <p className="text-gray-300 mb-4">
                    One-day renewal experience for local leaders or those with limited time.
                    Includes spa treatments, prophetic ministry, and strategic coaching.
                  </p>
                  <ul className="space-y-2 text-gray-300 mb-6">
                    <li className="flex items-start">
                      <span className="text-teal-400 mr-2">✓</span>
                      8-hour comprehensive renewal experience
                    </li>
                    <li className="flex items-start">
                      <span className="text-teal-400 mr-2">✓</span>
                      Personal prophetic ministry session
                    </li>
                    <li className="flex items-start">
                      <span className="text-teal-400 mr-2">✓</span>
                      Spa treatments and wellness consultation
                    </li>
                    <li className="flex items-start">
                      <span className="text-teal-400 mr-2">✓</span>
                      Strategic planning and goal setting
                    </li>
                  </ul>
                  <div className="flex items-center gap-4">
                    <span className="text-2xl font-bold text-white">$1,200/day</span>
                    <Link
                      href="/lorenzo/connect"
                      className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition"
                    >
                      Book Day Retreat
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Facilities Section */}
      <section className="py-20 px-4 bg-black/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-white mb-12">
            Sanctuary Facilities & Amenities
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-4">🏡</div>
              <h3 className="text-lg font-semibold text-white mb-2">Private Quarters</h3>
              <p className="text-gray-300 text-sm">Luxury accommodation with prayer rooms and workspaces</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🌿</div>
              <h3 className="text-lg font-semibold text-white mb-2">Nature Trails</h3>
              <p className="text-gray-300 text-sm">Peaceful walking paths and meditation gardens</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">💆</div>
              <h3 className="text-lg font-semibold text-white mb-2">Full Spa Services</h3>
              <p className="text-gray-300 text-sm">Massage, aromatherapy, and wellness treatments</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🍽️</div>
              <h3 className="text-lg font-semibold text-white mb-2">Gourmet Dining</h3>
              <p className="text-gray-300 text-sm">Organic, locally-sourced meals for optimal health</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">📚</div>
              <h3 className="text-lg font-semibold text-white mb-2">Resource Library</h3>
              <p className="text-gray-300 text-sm">Spiritual and strategic leadership resources</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🏋️</div>
              <h3 className="text-lg font-semibold text-white mb-2">Fitness Center</h3>
              <p className="text-gray-300 text-sm">Modern equipment and personal training</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">⛪</div>
              <h3 className="text-lg font-semibold text-white mb-2">Chapel</h3>
              <p className="text-gray-300 text-sm">Sacred space for worship and ministry</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-lg font-semibold text-white mb-2">Complete Privacy</h3>
              <p className="text-gray-300 text-sm">Secure, confidential environment for restoration</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-white mb-12">
            Transformation Stories
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white/5 backdrop-blur rounded-xl p-8 border border-white/10">
              <p className="text-gray-300 mb-6 italic">
                "The Renewal Sanctuary saved my marriage and ministry. After feeling completely
                burned out, the week-long sabbatical gave me the spiritual refreshing and
                strategic clarity I desperately needed. The prophetic ministry was spot-on,
                and the restoration was complete."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full"></div>
                <div>
                  <p className="font-semibold text-white">Pastor Michael K.</p>
                  <p className="text-gray-400 text-sm">Senior Pastor, 8,000-member church</p>
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur rounded-xl p-8 border border-white/10">
              <p className="text-gray-300 mb-6 italic">
                "As a CEO and ministry leader, I was carrying the weight of the world.
                The weekend intensive taught me how to rest without guilt and receive
                divine strategy for both my business and calling. Game-changing experience."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-full"></div>
                <div>
                  <p className="font-semibold text-white">Sarah L.</p>
                  <p className="text-gray-400 text-sm">CEO & Ministry Leader</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-black/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Your Restoration Awaits
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Don't let burnout derail your calling. Step into the sanctuary and
            emerge renewed, refreshed, and strategically aligned with God's purpose.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/lorenzo/assessment"
              className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-lg hover:shadow-2xl transition-all transform hover:scale-105"
            >
              Assessment & Booking
            </Link>
            <Link
              href="/lorenzo/connect"
              className="px-8 py-4 bg-white/10 backdrop-blur text-white font-semibold rounded-lg border border-white/20 hover:bg-white/20 transition-all"
            >
              Schedule Consultation
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}