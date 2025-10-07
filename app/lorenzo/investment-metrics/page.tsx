'use client';

import React from 'react';
import Link from 'next/link';

export default function InvestmentMetricsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-violet-950">

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-violet-600/20 animate-pulse" />

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <div className="inline-block p-6 bg-gradient-to-br from-blue-600 to-violet-600 rounded-full mb-8">
              <svg className="w-16 h-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Investment <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400">Metrics</span>
            </h1>

            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Transparent accountability in social impact investing, community transformation,
              and strategic tithing to advance God's kingdom through business excellence.
            </p>

            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/lorenzo/connect"
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold rounded-lg hover:shadow-2xl transition-all transform hover:scale-105"
              >
                Partnership Inquiry
              </Link>
              <Link
                href="#impact-dashboard"
                className="px-8 py-4 bg-white/10 backdrop-blur text-white font-semibold rounded-lg border border-white/20 hover:bg-white/20 transition-all"
              >
                View Impact Dashboard
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-20 px-4 bg-black/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-white mb-12">
            Kingdom-Centered Investment Philosophy
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/5 backdrop-blur rounded-xl p-8 border border-white/10">
              <div className="text-blue-400 text-4xl mb-4">💰</div>
              <h3 className="text-xl font-semibold text-white mb-3">Profit with Purpose</h3>
              <p className="text-gray-300">
                Generating sustainable returns while creating measurable social impact through
                strategic investments in kingdom-minded enterprises and community development.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur rounded-xl p-8 border border-white/10">
              <div className="text-violet-400 text-4xl mb-4">🤝</div>
              <h3 className="text-xl font-semibold text-white mb-3">Tithing Commitment</h3>
              <p className="text-gray-300">
                20% of all investment profits systematically tithed to support ministries,
                non-profits, and social impact initiatives aligned with biblical values.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur rounded-xl p-8 border border-white/10">
              <div className="text-blue-400 text-4xl mb-4">📊</div>
              <h3 className="text-xl font-semibold text-white mb-3">Transparent Accountability</h3>
              <p className="text-gray-300">
                Public reporting of all social impact metrics, ROI data, and tithing
                distributions to ensure complete transparency and kingdom stewardship.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Dashboard */}
      <section id="impact-dashboard" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-white mb-12">
            2024 Impact Dashboard
          </h2>

          {/* Key Metrics Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="bg-gradient-to-br from-blue-900/30 to-violet-900/30 rounded-xl p-6 border border-blue-500/30 text-center">
              <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400 mb-2">
                $2.4M
              </div>
              <p className="text-gray-300 text-sm">Total Investment Capital</p>
            </div>
            <div className="bg-gradient-to-br from-violet-900/30 to-blue-900/30 rounded-xl p-6 border border-violet-500/30 text-center">
              <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-blue-400 mb-2">
                18.5%
              </div>
              <p className="text-gray-300 text-sm">Average Annual ROI</p>
            </div>
            <div className="bg-gradient-to-br from-blue-900/30 to-violet-900/30 rounded-xl p-6 border border-blue-500/30 text-center">
              <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400 mb-2">
                $480K
              </div>
              <p className="text-gray-300 text-sm">Total Tithing (20%)</p>
            </div>
            <div className="bg-gradient-to-br from-violet-900/30 to-blue-900/30 rounded-xl p-6 border border-violet-500/30 text-center">
              <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-blue-400 mb-2">
                127
              </div>
              <p className="text-gray-300 text-sm">Lives Directly Impacted</p>
            </div>
          </div>

          {/* Portfolio Breakdown */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white/5 backdrop-blur rounded-xl p-8 border border-white/10">
              <h3 className="text-xl font-bold text-white mb-6">Investment Portfolio (2024)</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Kingdom Tech Startups</span>
                  <span className="text-blue-400 font-semibold">35% | $840K</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Microfinance & Community Development</span>
                  <span className="text-violet-400 font-semibold">25% | $600K</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Sustainable Agriculture</span>
                  <span className="text-blue-400 font-semibold">20% | $480K</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Education & Training Platforms</span>
                  <span className="text-violet-400 font-semibold">15% | $360K</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Healthcare Innovation</span>
                  <span className="text-blue-400 font-semibold">5% | $120K</span>
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur rounded-xl p-8 border border-white/10">
              <h3 className="text-xl font-bold text-white mb-6">Tithing Distribution (2024)</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Global Mission Organizations</span>
                  <span className="text-violet-400 font-semibold">40% | $192K</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Local Church Planting</span>
                  <span className="text-blue-400 font-semibold">25% | $120K</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Education Scholarships</span>
                  <span className="text-violet-400 font-semibold">20% | $96K</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Community Development</span>
                  <span className="text-blue-400 font-semibold">10% | $48K</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Crisis Relief & Emergency Aid</span>
                  <span className="text-violet-400 font-semibold">5% | $24K</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Impact Stories */}
      <section className="py-20 px-4 bg-black/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-white mb-12">
            Kingdom Impact Stories
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-blue-900/30 to-violet-900/30 rounded-xl p-8 border border-blue-500/30">
              <div className="text-blue-400 text-4xl mb-4">🏫</div>
              <h3 className="text-xl font-semibold text-white mb-3">Ghana Education Initiative</h3>
              <p className="text-gray-300 mb-4">
                Our $120K investment in educational technology reached 3,200 students across
                15 rural schools, improving literacy rates by 67% in the first year.
              </p>
              <div className="text-sm text-blue-400 font-semibold">ROI: 22% | Social Impact: High</div>
            </div>

            <div className="bg-gradient-to-br from-violet-900/30 to-blue-900/30 rounded-xl p-8 border border-violet-500/30">
              <div className="text-violet-400 text-4xl mb-4">🌾</div>
              <h3 className="text-xl font-semibold text-white mb-3">Sustainable Farming Co-op</h3>
              <p className="text-gray-300 mb-4">
                $180K microfinance investment enabled 45 farming families to transition to
                sustainable practices, increasing yields by 40% while protecting the environment.
              </p>
              <div className="text-sm text-violet-400 font-semibold">ROI: 16% | Families Served: 45</div>
            </div>

            <div className="bg-gradient-to-br from-blue-900/30 to-violet-900/30 rounded-xl p-8 border border-blue-500/30">
              <div className="text-blue-400 text-4xl mb-4">💻</div>
              <h3 className="text-xl font-semibold text-white mb-3">Kingdom Tech Accelerator</h3>
              <p className="text-gray-300 mb-4">
                Led seed funding for 8 Christian entrepreneurs building technology solutions,
                creating 34 jobs and generating $890K in kingdom-centered revenue.
              </p>
              <div className="text-sm text-blue-400 font-semibold">ROI: 24% | Jobs Created: 34</div>
            </div>
          </div>
        </div>
      </section>

      {/* Annual Reports */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-white mb-12">
            Annual Impact Reports
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white/5 backdrop-blur rounded-xl p-6 border border-white/10 text-center">
              <div className="text-2xl font-bold text-white mb-2">2024 Report</div>
              <p className="text-gray-300 mb-4">Full transparency on investments, returns, and social impact</p>
              <Link
                href="/lorenzo/connect"
                className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Download PDF
              </Link>
            </div>
            <div className="bg-white/5 backdrop-blur rounded-xl p-6 border border-white/10 text-center">
              <div className="text-2xl font-bold text-white mb-2">2023 Report</div>
              <p className="text-gray-300 mb-4">First year results: $1.8M invested, 15.2% ROI achieved</p>
              <Link
                href="/lorenzo/connect"
                className="inline-block px-6 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition"
              >
                Download PDF
              </Link>
            </div>
            <div className="bg-white/5 backdrop-blur rounded-xl p-6 border border-white/10 text-center">
              <div className="text-2xl font-bold text-white mb-2">Impact Study</div>
              <p className="text-gray-300 mb-4">Third-party evaluation of community transformation metrics</p>
              <Link
                href="/lorenzo/connect"
                className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Request Access
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Investment Principles */}
      <section className="py-20 px-4 bg-black/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-white mb-12">
            Kingdom Investment Principles
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-violet-600 rounded-full flex items-center justify-center text-white text-sm font-bold">1</div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Biblical Stewardship</h3>
                  <p className="text-gray-300">Every investment decision filtered through biblical principles of stewardship, justice, and kingdom advancement.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-gradient-to-r from-violet-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">2</div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Mandatory Tithing</h3>
                  <p className="text-gray-300">20% of all profits automatically allocated to kingdom purposes, non-negotiable commitment to giving.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-violet-600 rounded-full flex items-center justify-center text-white text-sm font-bold">3</div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Measurable Impact</h3>
                  <p className="text-gray-300">Every investment must demonstrate both financial returns and quantifiable social transformation.</p>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-gradient-to-r from-violet-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">4</div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Long-term Vision</h3>
                  <p className="text-gray-300">Patient capital approach prioritizing sustainable, generational impact over quick returns.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-violet-600 rounded-full flex items-center justify-center text-white text-sm font-bold">5</div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Complete Transparency</h3>
                  <p className="text-gray-300">Annual public reporting of all metrics, failures, and successes with full financial disclosure.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-gradient-to-r from-violet-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">6</div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Kingdom Partnerships</h3>
                  <p className="text-gray-300">Collaborative investment with other kingdom-minded leaders and organizations for greater impact.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Partner with Purpose-Driven Impact
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join us in creating sustainable wealth while advancing God's kingdom through
            strategic investments that transform communities and generate eternal returns.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/lorenzo/assessment"
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold rounded-lg hover:shadow-2xl transition-all transform hover:scale-105"
            >
              Investment Partnership Inquiry
            </Link>
            <Link
              href="/lorenzo/connect"
              className="px-8 py-4 bg-white/10 backdrop-blur text-white font-semibold rounded-lg border border-white/20 hover:bg-white/20 transition-all"
            >
              Schedule Impact Discussion
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}