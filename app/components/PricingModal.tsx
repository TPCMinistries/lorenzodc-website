'use client';
import { useState } from 'react';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPlan: (planId: string) => void;
}

export default function PricingModal({ isOpen, onClose, onSelectPlan }: PricingModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<string>('basic');

  if (!isOpen) return null;

  const plans = [
    {
      id: 'basic',
      name: 'Catalyst Basic',
      price: 19,
      period: 'month',
      description: 'Perfect for getting started with AI coaching',
      features: [
        '150 coaching conversations per month',
        'Full memory & coaching personality',
        'Personal goal tracking & accountability',
        'Progress dashboards & analytics',
        'Assessment-driven insights',
        'Email support'
      ],
      badge: 'Most Popular',
      badgeColor: 'bg-blue-500',
      highlight: true
    },
    {
      id: 'plus',
      name: 'Catalyst Plus',
      price: 39,
      period: 'month',
      description: 'For power users who want unlimited coaching',
      features: [
        'Unlimited coaching conversations',
        'Everything in Basic',
        'Priority support',
        'Advanced analytics & insights',
        'Custom coaching styles',
        'Early access to new features'
      ],
      badge: 'Power Users',
      badgeColor: 'bg-purple-500',
      highlight: false
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 297,
      period: 'month',
      description: 'For teams and organizations',
      features: [
        'Everything in Plus',
        'Team collaboration features',
        'ROI tools & implementation roadmaps',
        'Monthly strategy calls',
        'Custom integrations',
        'Dedicated account manager'
      ],
      badge: 'Teams',
      badgeColor: 'bg-emerald-500',
      highlight: false
    }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">Choose Your Plan</h2>
              <p className="text-slate-400 mt-1">
                Start your AI coaching journey today
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative rounded-xl p-6 border transition-all cursor-pointer ${
                  selectedPlan === plan.id
                    ? 'border-blue-400 bg-blue-500/10'
                    : plan.highlight
                    ? 'border-blue-400/50 bg-blue-500/5'
                    : 'border-slate-600 bg-slate-700/30'
                } hover:border-blue-400/50 hover:bg-blue-500/5`}
                onClick={() => setSelectedPlan(plan.id)}
              >
                {/* Badge */}
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className={`${plan.badgeColor} text-white px-3 py-1 rounded-full text-xs font-medium`}>
                      {plan.badge}
                    </span>
                  </div>
                )}

                {/* Plan Header */}
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                  <div className="mb-2">
                    <span className="text-4xl font-bold text-white">${plan.price}</span>
                    <span className="text-slate-400">/{plan.period}</span>
                  </div>
                  <p className="text-slate-400 text-sm">{plan.description}</p>
                </div>

                {/* Features */}
                <div className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-slate-300 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Selection indicator */}
                <div className="text-center">
                  <div className={`w-6 h-6 rounded-full border-2 mx-auto transition-all ${
                    selectedPlan === plan.id
                      ? 'border-blue-400 bg-blue-400'
                      : 'border-slate-500'
                  }`}>
                    {selectedPlan === plan.id && (
                      <svg className="w-4 h-4 text-white m-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Comparison with ChatGPT */}
          <div className="mt-8 bg-slate-700/30 rounded-lg p-4">
            <h4 className="font-semibold text-white mb-4 text-center">
              Why Choose Catalyst Over ChatGPT Plus?
            </h4>
            <div className="grid grid-cols-2 gap-6 text-sm">
              <div>
                <div className="font-medium text-slate-300 mb-3">ChatGPT Plus ($20/month)</div>
                <div className="space-y-2 text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className="text-red-400">✗</span>
                    <span>No memory between conversations</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-red-400">✗</span>
                    <span>No goal tracking or accountability</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-red-400">✗</span>
                    <span>Generic responses for everyone</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-red-400">✗</span>
                    <span>No progress insights or analytics</span>
                  </div>
                </div>
              </div>
              <div>
                <div className="font-medium text-blue-300 mb-3">Catalyst Basic ($19/month)</div>
                <div className="space-y-2 text-blue-400">
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400">✓</span>
                    <span>Remembers every conversation forever</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400">✓</span>
                    <span>Personal goal tracking & coaching</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400">✓</span>
                    <span>Personalized responses based on your journey</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400">✓</span>
                    <span>Progress analytics & life insights</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-center mt-4 pt-3 border-t border-slate-600">
              <p className="text-emerald-400 font-medium">
                💡 More features for less money
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-8">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-slate-600 text-slate-300 rounded-xl hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => onSelectPlan(selectedPlan)}
              className="flex-2 px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-200"
            >
              Get Started with {plans.find(p => p.id === selectedPlan)?.name}
            </button>
          </div>

          {/* Money Back Guarantee */}
          <div className="text-center mt-4">
            <p className="text-slate-400 text-sm">
              💰 30-day money-back guarantee • 🔒 Cancel anytime
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}