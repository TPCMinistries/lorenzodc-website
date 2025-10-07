'use client';

import { useState } from 'react';
import Link from 'next/link';
import GlobalNavigation from '../../components/GlobalNavigation';
import EnhancedIntakeForm from '../../components/EnhancedIntakeForm';
import SmartBookingSystem from '../../components/SmartBookingSystem';

export default function AIStrategyLanding() {
  const [showIntakeForm, setShowIntakeForm] = useState(false);
  const [showBooking, setShowBooking] = useState(false);

  const industryExamples = [
    {
      industry: 'Healthcare',
      icon: '🏥',
      challenges: ['Patient data management', 'Diagnostic efficiency', 'Regulatory compliance'],
      solutions: ['AI-powered patient insights', 'Automated documentation', 'Predictive care models'],
      roi: '35% reduction in administrative time'
    },
    {
      industry: 'Financial Services',
      icon: '🏦',
      challenges: ['Risk assessment', 'Fraud detection', 'Customer service scale'],
      solutions: ['Intelligent risk modeling', 'Real-time fraud prevention', 'AI customer support'],
      roi: '50% improvement in fraud detection'
    },
    {
      industry: 'Manufacturing',
      icon: '🏭',
      challenges: ['Predictive maintenance', 'Quality control', 'Supply chain optimization'],
      solutions: ['Equipment monitoring AI', 'Automated quality inspection', 'Demand forecasting'],
      roi: '25% reduction in downtime'
    },
    {
      industry: 'Education',
      icon: '🎓',
      challenges: ['Personalized learning', 'Administrative efficiency', 'Student engagement'],
      solutions: ['Adaptive learning systems', 'Automated grading', 'Engagement analytics'],
      roi: '40% improvement in learning outcomes'
    }
  ];

  const implementationSteps = [
    {
      phase: 'Assessment',
      duration: '2-3 weeks',
      activities: [
        'AI readiness evaluation',
        'Process mapping and data audit',
        'ROI opportunity identification',
        'Risk and compliance review'
      ]
    },
    {
      phase: 'Strategy',
      duration: '2-4 weeks',
      activities: [
        'Custom AI strategy development',
        'Technology stack selection',
        'Implementation roadmap creation',
        'Change management planning'
      ]
    },
    {
      phase: 'Pilot',
      duration: '4-8 weeks',
      activities: [
        'Pilot project implementation',
        'Team training and onboarding',
        'Performance monitoring setup',
        'Initial results measurement'
      ]
    },
    {
      phase: 'Scale',
      duration: '3-6 months',
      activities: [
        'Enterprise-wide deployment',
        'Advanced feature implementation',
        'Optimization and fine-tuning',
        'ROI measurement and reporting'
      ]
    }
  ];

  if (showIntakeForm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <GlobalNavigation />
        <div className="pt-24 pb-20 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Enterprise AI Strategy Assessment
              </h1>
              <p className="text-lg text-slate-300">
                Get personalized recommendations for your AI implementation journey
              </p>
            </div>
            <EnhancedIntakeForm
              source="ai_strategy_landing"
              onComplete={() => setShowBooking(true)}
            />
          </div>
        </div>
      </div>
    );
  }

  if (showBooking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <GlobalNavigation />
        <div className="pt-24 pb-20 px-6">
          <div className="max-w-3xl mx-auto">
            <SmartBookingSystem
              source="ai_strategy_landing"
              className="w-full"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900">
      <GlobalNavigation />

      {/* Hero Section */}
      <div className="relative overflow-hidden py-16 pt-24">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/15 to-cyan-500/10"></div>

        <div className="relative max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-6">
              <div className="w-20 h-1 bg-gradient-to-r from-transparent to-indigo-400"></div>
              <div className="mx-6 text-6xl">🤖</div>
              <div className="w-20 h-1 bg-gradient-to-l from-transparent to-purple-400"></div>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-indigo-300 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Enterprise AI Strategy
            </h1>

            <p className="text-xl md:text-2xl text-slate-200 max-w-4xl mx-auto leading-relaxed mb-6">
              <span className="text-indigo-400 font-semibold">Divine Strategy</span> •
              <span className="text-purple-400 font-semibold"> AI Implementation</span> •
              <span className="text-cyan-400 font-semibold"> Enterprise Transformation</span>
            </p>

            <p className="text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed mb-8">
              Transform your enterprise with AI implementation that combines cutting-edge technology with strategic intelligence.
              Move beyond AI hype to systematic, ROI-driven implementation.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setShowIntakeForm(true)}
                className="px-8 py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 hover:from-indigo-500 hover:via-purple-500 hover:to-cyan-500 text-white font-bold text-lg rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-xl"
              >
                Get Your AI Strategy Assessment →
              </button>
              <Link
                href="/enterprise/diagnostic"
                className="px-8 py-4 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-600/50 hover:border-slate-500/70 text-white font-semibold rounded-2xl transition-all duration-300 backdrop-blur-xl"
              >
                Take AI Readiness Diagnostic
              </Link>
            </div>
          </div>

          {/* Key Stats */}
          <div className="grid md:grid-cols-4 gap-6 mb-16">
            <div className="text-center p-6 bg-slate-800/30 backdrop-blur-xl border border-slate-700/30 rounded-2xl">
              <div className="text-indigo-400 font-bold text-3xl mb-2">85%</div>
              <div className="text-slate-300 font-medium">Faster Implementation</div>
              <div className="text-slate-500 text-sm mt-1">vs. traditional approaches</div>
            </div>
            <div className="text-center p-6 bg-slate-800/30 backdrop-blur-xl border border-slate-700/30 rounded-2xl">
              <div className="text-purple-400 font-bold text-3xl mb-2">3.2x</div>
              <div className="text-slate-300 font-medium">ROI Achievement</div>
              <div className="text-slate-500 text-sm mt-1">Average client results</div>
            </div>
            <div className="text-center p-6 bg-slate-800/30 backdrop-blur-xl border border-slate-700/30 rounded-2xl">
              <div className="text-cyan-400 font-bold text-3xl mb-2">100+</div>
              <div className="text-slate-300 font-medium">Enterprise Clients</div>
              <div className="text-slate-500 text-sm mt-1">Successfully implemented</div>
            </div>
            <div className="text-center p-6 bg-slate-800/30 backdrop-blur-xl border border-slate-700/30 rounded-2xl">
              <div className="text-emerald-400 font-bold text-3xl mb-2">12</div>
              <div className="text-slate-300 font-medium">Week Average</div>
              <div className="text-slate-500 text-sm mt-1">To measurable results</div>
            </div>
          </div>

          {/* Industry Solutions */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Industry-Specific Solutions</h2>
              <p className="text-lg text-slate-300 max-w-3xl mx-auto">
                Tailored AI strategies that address the unique challenges and opportunities in your industry
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {industryExamples.map((industry, index) => (
                <div
                  key={index}
                  className="bg-slate-800/30 backdrop-blur-xl border border-slate-700/30 rounded-2xl p-6 hover:border-slate-600/50 transition-all duration-300"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="text-4xl">{industry.icon}</div>
                    <h3 className="text-xl font-bold text-white">{industry.industry}</h3>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <h4 className="text-sm font-semibold text-slate-400 mb-2">Common Challenges</h4>
                      <ul className="space-y-1">
                        {industry.challenges.map((challenge, idx) => (
                          <li key={idx} className="text-sm text-slate-300 flex items-start gap-2">
                            <span className="text-red-400 mt-1">•</span>
                            <span>{challenge}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-slate-400 mb-2">AI Solutions</h4>
                      <ul className="space-y-1">
                        {industry.solutions.map((solution, idx) => (
                          <li key={idx} className="text-sm text-slate-300 flex items-start gap-2">
                            <span className="text-emerald-400 mt-1">•</span>
                            <span>{solution}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-lg p-3">
                    <div className="text-sm text-slate-400">Typical Results</div>
                    <div className="text-white font-semibold">{industry.roi}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Implementation Process */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Implementation Process</h2>
              <p className="text-lg text-slate-300 max-w-3xl mx-auto">
                Our systematic approach ensures successful AI implementation with measurable ROI
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {implementationSteps.map((step, index) => (
                <div
                  key={index}
                  className="relative bg-slate-800/30 backdrop-blur-xl border border-slate-700/30 rounded-2xl p-6"
                >
                  {/* Phase Number */}
                  <div className="absolute -top-3 -left-3 w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>

                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-white mb-1">{step.phase}</h3>
                    <div className="text-sm text-slate-400">{step.duration}</div>
                  </div>

                  <ul className="space-y-2">
                    {step.activities.map((activity, idx) => (
                      <li key={idx} className="text-sm text-slate-300 flex items-start gap-2">
                        <span className="text-indigo-400 mt-1">•</span>
                        <span>{activity}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* ROI Calculator CTA */}
          <div className="bg-gradient-to-r from-slate-800/40 to-slate-700/40 backdrop-blur-xl border border-slate-600/30 rounded-3xl p-8 mb-16">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-4">Calculate Your AI ROI</h2>
              <p className="text-lg text-slate-300 mb-6 max-w-2xl mx-auto">
                Get a detailed analysis of potential cost savings and revenue gains from AI implementation in your organization.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/enterprise/roi"
                  className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-2xl transition-all duration-300 transform hover:scale-105"
                >
                  AI ROI Calculator →
                </Link>
                <Link
                  href="/enterprise/diagnostic"
                  className="px-8 py-4 bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600/50 text-white font-semibold rounded-2xl transition-all"
                >
                  Readiness Assessment
                </Link>
              </div>
            </div>
          </div>

          {/* Final CTA */}
          <div className="text-center bg-gradient-to-r from-indigo-900/40 to-purple-900/40 backdrop-blur-xl border border-indigo-600/30 rounded-3xl p-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Transform with AI?
            </h2>
            <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">
              Get your personalized AI strategy assessment and implementation roadmap.
              Discover exactly how AI can drive growth and efficiency in your organization.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setShowIntakeForm(true)}
                className="px-10 py-5 bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 hover:from-indigo-500 hover:via-purple-500 hover:to-cyan-500 text-white font-bold text-xl rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl"
              >
                Start Your AI Assessment →
              </button>
              <button
                onClick={() => setShowBooking(true)}
                className="px-10 py-5 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-600/50 hover:border-slate-500/70 text-white font-bold text-xl rounded-2xl transition-all duration-300 backdrop-blur-xl"
              >
                Book Strategy Session
              </button>
            </div>
            <div className="mt-6 text-slate-400 text-sm">
              <span className="text-emerald-400">✓</span> No obligation assessment •
              <span className="text-indigo-400"> ✓</span> Personalized recommendations •
              <span className="text-purple-400"> ✓</span> ROI projections included
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}