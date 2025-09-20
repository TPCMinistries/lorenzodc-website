'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface PortfolioCompany {
  name: string;
  sector: string;
  investment: string;
  impact: string;
  status: 'Active' | 'Exited' | 'Pipeline';
}

interface FundMetric {
  label: string;
  value: string;
  description: string;
}

export default function InvestmentFundPage() {
  const [selectedView, setSelectedView] = useState<'overview' | 'portfolio' | 'impact' | 'process'>('overview');
  const [showInvestorForm, setShowInvestorForm] = useState(false);

  const fundMetrics: FundMetric[] = [
    { label: 'Target Fund Size', value: '$50M', description: 'Strategic deployment capital' },
    { label: 'Investment Range', value: '$250K - $5M', description: 'Per portfolio company' },
    { label: 'Target IRR', value: '35%+', description: 'Annual returns target' },
    { label: 'Investment Horizon', value: '3-7 Years', description: 'Strategic growth period' }
  ];

  const portfolioCompanies: PortfolioCompany[] = [
    { name: 'Divine Tech Solutions', sector: 'Faith-Tech', investment: '$2.5M', impact: '10,000+ churches digitized', status: 'Active' },
    { name: 'Kingdom Capital Markets', sector: 'FinTech', investment: '$3.8M', impact: '$50M+ capital deployed', status: 'Active' },
    { name: 'Prophetic AI Systems', sector: 'Enterprise AI', investment: '$1.5M', impact: '500+ ministries automated', status: 'Active' },
    { name: 'Global Mission Network', sector: 'Social Impact', investment: '$2.0M', impact: '25 nations reached', status: 'Pipeline' },
    { name: 'Covenant Healthcare Tech', sector: 'HealthTech', investment: '$4.2M', impact: '100,000+ patients served', status: 'Exited' }
  ];

  const impactMetrics = [
    { metric: 'Jobs Created', value: '2,500+', growth: '+85% YoY' },
    { metric: 'Revenue Generated', value: '$125M+', growth: '+120% YoY' },
    { metric: 'Communities Impacted', value: '150+', growth: '+65% YoY' },
    { metric: 'ROI Delivered', value: '4.2x', growth: 'Top Quartile' }
  ];

  const investmentProcess = [
    { phase: 'Sourcing', description: 'Proprietary deal flow through ministry and enterprise networks', timeline: '1-2 weeks' },
    { phase: 'Diligence', description: 'Comprehensive spiritual and strategic assessment', timeline: '2-4 weeks' },
    { phase: 'Structure', description: 'Kingdom-aligned deal structuring with divine counsel', timeline: '1-2 weeks' },
    { phase: 'Deployment', description: 'Strategic capital injection with operational support', timeline: '1 week' },
    { phase: 'Growth', description: 'Active portfolio management and strategic guidance', timeline: 'Ongoing' },
    { phase: 'Exit', description: 'Strategic exits maximizing kingdom and financial returns', timeline: '3-7 years' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950">
      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 animate-pulse" />
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <div className="inline-block p-6 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full mb-8">
              <svg className="w-16 h-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Global Development <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Investment Fund</span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              $50M Strategic Capital Fund · Kingdom-Aligned Ventures · Exponential Impact
            </p>

            <div className="flex flex-wrap gap-4 justify-center mb-12">
              <button
                onClick={() => setShowInvestorForm(true)}
                className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:shadow-2xl transition-all transform hover:scale-105"
              >
                Become an LP Investor
              </button>
              <Link
                href="https://calendly.com/lorenzo-theglobalenterprise/investment-fund-discussion"
                className="px-8 py-4 bg-white/10 backdrop-blur text-white font-semibold rounded-lg border border-white/20 hover:bg-white/20 transition-all"
              >
                Schedule Due Diligence Call
              </Link>
            </div>
          </div>

          {/* Fund Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            {fundMetrics.map((metric, index) => (
              <div key={index} className="bg-white/5 backdrop-blur rounded-xl p-6 border border-white/10">
                <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 mb-2">
                  {metric.value}
                </div>
                <div className="text-white font-semibold mb-1">{metric.label}</div>
                <div className="text-gray-400 text-sm">{metric.description}</div>
              </div>
            ))}
          </div>

          {/* Navigation Tabs */}
          <div className="flex justify-center gap-2 mb-12">
            {(['overview', 'portfolio', 'impact', 'process'] as const).map((view) => (
              <button
                key={view}
                onClick={() => setSelectedView(view)}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                  selectedView === view
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                    : 'bg-white/5 text-gray-300 hover:bg-white/10'
                }`}
              >
                {view.charAt(0).toUpperCase() + view.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Dynamic Content Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          {selectedView === 'overview' && (
            <div className="space-y-12">
              <div className="bg-white/5 backdrop-blur rounded-2xl p-8 border border-white/10">
                <h2 className="text-3xl font-bold text-white mb-6">Investment Thesis</h2>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-semibold text-indigo-400 mb-4">Strategic Focus</h3>
                    <p className="text-gray-300 mb-4">
                      We invest in transformative ventures at the intersection of divine purpose and exponential growth. 
                      Our portfolio companies leverage spiritual intelligence, AI technology, and kingdom principles to 
                      create unprecedented value.
                    </p>
                    <ul className="space-y-2 text-gray-400">
                      <li className="flex items-center"><span className="text-purple-400 mr-2">✓</span> Faith-Tech Innovation</li>
                      <li className="flex items-center"><span className="text-purple-400 mr-2">✓</span> Kingdom Business Models</li>
                      <li className="flex items-center"><span className="text-purple-400 mr-2">✓</span> Social Impact Ventures</li>
                      <li className="flex items-center"><span className="text-purple-400 mr-2">✓</span> Prophetic Market Timing</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-purple-400 mb-4">Value Creation</h3>
                    <p className="text-gray-300 mb-4">
                      Beyond capital, we provide divine strategy consulting, operational expertise, and access to our 
                      global network of kingdom leaders and enterprise executives.
                    </p>
                    <ul className="space-y-2 text-gray-400">
                      <li className="flex items-center"><span className="text-indigo-400 mr-2">✓</span> Strategic Advisory</li>
                      <li className="flex items-center"><span className="text-indigo-400 mr-2">✓</span> Operational Support</li>
                      <li className="flex items-center"><span className="text-indigo-400 mr-2">✓</span> Network Access</li>
                      <li className="flex items-center"><span className="text-indigo-400 mr-2">✓</span> Exit Planning</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-indigo-900/50 to-purple-900/50 rounded-2xl p-8 border border-purple-500/30">
                <h3 className="text-2xl font-bold text-white mb-4">LP Partnership Benefits</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 mb-2">
                      35%+
                    </div>
                    <p className="text-gray-300">Target Annual Returns</p>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 mb-2">
                      Quarterly
                    </div>
                    <p className="text-gray-300">Investor Updates</p>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 mb-2">
                      Direct
                    </div>
                    <p className="text-gray-300">Co-Investment Rights</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedView === 'portfolio' && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-white mb-8">Portfolio Companies</h2>
              {portfolioCompanies.map((company, index) => (
                <div key={index} className="bg-white/5 backdrop-blur rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all">
                  <div className="flex flex-wrap justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">{company.name}</h3>
                      <div className="flex gap-4 text-sm text-gray-400">
                        <span className="px-3 py-1 bg-indigo-600/20 rounded-full text-indigo-300">
                          {company.sector}
                        </span>
                        <span className="px-3 py-1 bg-purple-600/20 rounded-full text-purple-300">
                          {company.investment}
                        </span>
                      </div>
                    </div>
                    <span className={`px-4 py-2 rounded-lg font-semibold text-sm ${
                      company.status === 'Active' ? 'bg-green-600/20 text-green-300' :
                      company.status === 'Exited' ? 'bg-blue-600/20 text-blue-300' :
                      'bg-yellow-600/20 text-yellow-300'
                    }`}>
                      {company.status}
                    </span>
                  </div>
                  <p className="text-gray-300">
                    <span className="text-gray-500">Impact:</span> {company.impact}
                  </p>
                </div>
              ))}
            </div>
          )}

          {selectedView === 'impact' && (
            <div className="space-y-12">
              <h2 className="text-3xl font-bold text-white mb-8">Fund Impact Metrics</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {impactMetrics.map((item, index) => (
                  <div key={index} className="bg-white/5 backdrop-blur rounded-xl p-6 border border-white/10">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                          {item.value}
                        </div>
                        <div className="text-white font-semibold">{item.metric}</div>
                      </div>
                      <span className="px-3 py-1 bg-green-600/20 rounded-full text-green-300 text-sm">
                        {item.growth}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-gradient-to-br from-indigo-900/50 to-purple-900/50 rounded-2xl p-8 border border-purple-500/30">
                <h3 className="text-2xl font-bold text-white mb-6">Kingdom Impact</h3>
                <div className="grid md:grid-cols-3 gap-6 text-center">
                  <div>
                    <div className="text-4xl mb-2">⛪</div>
                    <div className="text-xl font-bold text-white mb-1">10,000+</div>
                    <p className="text-gray-400">Churches Served</p>
                  </div>
                  <div>
                    <div className="text-4xl mb-2">🌍</div>
                    <div className="text-xl font-bold text-white mb-1">50+</div>
                    <p className="text-gray-400">Nations Reached</p>
                  </div>
                  <div>
                    <div className="text-4xl mb-2">👥</div>
                    <div className="text-xl font-bold text-white mb-1">1M+</div>
                    <p className="text-gray-400">Lives Transformed</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedView === 'process' && (
            <div className="space-y-8">
              <h2 className="text-3xl font-bold text-white mb-8">Investment Process</h2>
              <div className="space-y-6">
                {investmentProcess.map((phase, index) => (
                  <div key={index} className="flex gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                        {index + 1}
                      </div>
                    </div>
                    <div className="flex-grow bg-white/5 backdrop-blur rounded-xl p-6 border border-white/10">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-semibold text-white">{phase.phase}</h3>
                        <span className="px-3 py-1 bg-indigo-600/20 rounded-full text-indigo-300 text-sm">
                          {phase.timeline}
                        </span>
                      </div>
                      <p className="text-gray-300">{phase.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* LP Investor Form Modal */}
      {showInvestorForm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-slate-900 to-indigo-950 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-indigo-500/30">
            <h2 className="text-3xl font-bold text-white mb-6">LP Partnership Application</h2>
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <input
                  type="text"
                  placeholder="Full Name"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400"
                  required
                />
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400"
                  required
                />
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <input
                  type="tel"
                  placeholder="Phone"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400"
                  required
                />
                <input
                  type="text"
                  placeholder="Organization"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400"
                />
              </div>

              <select className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white">
                <option value="" className="bg-slate-900">Investment Range</option>
                <option value="250k-500k" className="bg-slate-900">$250K - $500K</option>
                <option value="500k-1m" className="bg-slate-900">$500K - $1M</option>
                <option value="1m-5m" className="bg-slate-900">$1M - $5M</option>
                <option value="5m+" className="bg-slate-900">$5M+</option>
              </select>

              <select className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white">
                <option value="" className="bg-slate-900">Investor Type</option>
                <option value="individual" className="bg-slate-900">Individual/Family Office</option>
                <option value="institutional" className="bg-slate-900">Institutional</option>
                <option value="foundation" className="bg-slate-900">Foundation/Endowment</option>
                <option value="corporate" className="bg-slate-900">Corporate</option>
              </select>

              <textarea
                placeholder="Investment thesis alignment and interest areas"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 h-32"
              />

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:shadow-2xl transition-all"
                >
                  Submit Application
                </button>
                <button
                  type="button"
                  onClick={() => setShowInvestorForm(false)}
                  className="px-6 py-3 bg-white/10 text-white font-semibold rounded-lg border border-white/20 hover:bg-white/20 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CTA Section */}
      <section className="py-20 px-4 border-t border-white/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Join Us in Building Kingdom Ventures
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Partner with us to deploy strategic capital into transformative ventures that generate 
            both exceptional returns and kingdom impact.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="https://calendly.com/lorenzo-theglobalenterprise/investment-fund-discussion"
              className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:shadow-2xl transition-all transform hover:scale-105"
            >
              Schedule Investment Discussion
            </Link>
            <button
              onClick={() => window.location.href = 'mailto:invest@lorenzodaughtrychambers.com'}
              className="px-8 py-4 bg-white/10 backdrop-blur text-white font-semibold rounded-lg border border-white/20 hover:bg-white/20 transition-all"
            >
              Request Fund Deck
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}