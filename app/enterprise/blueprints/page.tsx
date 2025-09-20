"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ConversionTrackingService } from "../../lib/services/conversion-tracking";

interface BlueprintInputs {
  // Company Info
  companyName: string;
  industry: string;
  companySize: string;
  revenue: string;

  // Current State
  currentAIUsage: string;
  biggestChallenges: string[];
  dataMaturity: string;

  // Goals & Objectives
  primaryGoals: string[];
  timeline: string;
  budget: string;

  // Team & Resources
  technicalCapability: string;
  changeReadiness: string;
  decisionMakers: string[];

  // Contact Info
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  bestTimeToCall: string;
}

export default function PersonalizedAIBlueprint() {
  const [mounted, setMounted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [inputs, setInputs] = useState<BlueprintInputs>({
    companyName: "",
    industry: "",
    companySize: "",
    revenue: "",
    currentAIUsage: "",
    biggestChallenges: [],
    dataMaturity: "",
    primaryGoals: [],
    timeline: "",
    budget: "",
    technicalCapability: "",
    changeReadiness: "",
    decisionMakers: [],
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    bestTimeToCall: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Track page view
  useEffect(() => {
    setMounted(true);
    ConversionTrackingService.trackPageView('/enterprise/blueprints', undefined, {
      page_type: 'premium_form',
      form_type: 'ai_blueprint'
    });
  }, []);

  const updateInput = (key: keyof BlueprintInputs, value: string | string[]) => {
    setInputs(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const toggleArrayValue = (key: keyof BlueprintInputs, value: string) => {
    const currentArray = inputs[key] as string[];
    if (currentArray.includes(value)) {
      updateInput(key, currentArray.filter(item => item !== value));
    } else {
      updateInput(key, [...currentArray, value]);
    }
  };

  const steps = [
    {
      title: "Company Overview",
      description: "Tell us about your organization",
      icon: "🏢"
    },
    {
      title: "Current AI Landscape",
      description: "Your existing AI and data capabilities",
      icon: "🔍"
    },
    {
      title: "Strategic Objectives",
      description: "Goals, timeline, and success metrics",
      icon: "🎯"
    },
    {
      title: "Resources & Readiness",
      description: "Team capabilities and change readiness",
      icon: "👥"
    },
    {
      title: "Contact & Next Steps",
      description: "How to deliver your blueprint",
      icon: "📞"
    }
  ];

  const handleSubmit = async () => {
    setIsSubmitting(true);

    // Track high-value conversion
    ConversionTrackingService.trackConversion('lead', {
      event: 'ai_blueprint_request',
      value: 2997, // High value for premium feature
      content_type: 'premium_consultation',
      content_category: 'ai_blueprint',
      metadata: {
        company_name: inputs.companyName,
        industry: inputs.industry,
        company_size: inputs.companySize,
        budget: inputs.budget,
        timeline: inputs.timeline
      }
    });

    // Here you would send to your CRM/email system
    // For now, simulate success
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 2000);
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center py-16">
        <div className="container mx-auto px-4 max-w-2xl text-center">
          <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-12">
            <div className="text-6xl mb-6">🎉</div>
            <h1 className="text-3xl font-bold text-white mb-4">
              Your AI Blueprint is Being Created!
            </h1>
            <p className="text-xl text-slate-300 mb-8">
              Our AI strategy experts are crafting your personalized 90-day implementation roadmap.
            </p>

            <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl p-6 mb-8">
              <h3 className="text-lg font-semibold text-green-400 mb-3">What Happens Next:</h3>
              <div className="space-y-3 text-slate-300 text-left">
                <div className="flex items-start gap-3">
                  <span className="text-green-400">✓</span>
                  <span>Within 24 hours: Receive your comprehensive AI Blueprint PDF</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-green-400">✓</span>
                  <span>Within 48 hours: Personal strategy call to review your roadmap</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-green-400">✓</span>
                  <span>Ongoing: Priority access to implementation support</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => {
                  window.open('https://calendly.com/lorenzo-theglobalenterprise/discovery-call?utm_source=blueprint_submitted&utm_medium=cta', '_blank');
                }}
                className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold rounded-2xl transition-all duration-200"
              >
                Schedule Strategy Call Now
              </button>
              <Link href="/enterprise">
                <button className="px-8 py-4 bg-slate-700/50 border border-slate-600/50 text-white rounded-2xl hover:bg-slate-600/50 transition-all duration-200">
                  Back to Executive Toolkit
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const renderStep = () => {
    switch (currentStep) {
      case 0: // Company Overview
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-white font-medium mb-2">Company Name *</label>
              <div className="relative">
                <input
                  type="text"
                  value={inputs.companyName}
                  onChange={(e) => updateInput('companyName', e.target.value)}
                  className="w-full bg-slate-700/30 backdrop-blur-sm border border-orange-400/30 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 transition-all duration-200"
                  placeholder="Your company name"
                  required
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-red-500/5 to-orange-500/5 pointer-events-none"></div>
              </div>
            </div>

            <div>
              <label className="block text-white font-medium mb-2">Industry *</label>
              <div className="relative">
                <select
                  value={inputs.industry}
                  onChange={(e) => updateInput('industry', e.target.value)}
                  className="w-full bg-slate-700/30 backdrop-blur-sm border border-orange-400/30 rounded-xl px-4 py-3 text-white focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 transition-all duration-200"
                  required
                >
                  <option value="">Select industry</option>
                  <option value="financial-services">Financial Services</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="manufacturing">Manufacturing</option>
                  <option value="retail">Retail & E-commerce</option>
                  <option value="technology">Technology</option>
                  <option value="professional-services">Professional Services</option>
                  <option value="real-estate">Real Estate</option>
                  <option value="education">Education</option>
                  <option value="government">Government</option>
                  <option value="other">Other</option>
                </select>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-red-500/5 to-orange-500/5 pointer-events-none"></div>
              </div>
            </div>

            <div>
              <label className="block text-white font-medium mb-2">Company Size *</label>
              <div className="relative">
                <select
                  value={inputs.companySize}
                  onChange={(e) => updateInput('companySize', e.target.value)}
                  className="w-full bg-slate-700/30 backdrop-blur-sm border border-orange-400/30 rounded-xl px-4 py-3 text-white focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 transition-all duration-200"
                  required
                >
                  <option value="">Select size</option>
                  <option value="startup">Startup (1-10 employees)</option>
                  <option value="small">Small (11-50 employees)</option>
                  <option value="medium">Medium (51-200 employees)</option>
                  <option value="large">Large (201-1000 employees)</option>
                  <option value="enterprise">Enterprise (1000+ employees)</option>
                </select>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-red-500/5 to-orange-500/5 pointer-events-none"></div>
              </div>
            </div>

            <div>
              <label className="block text-white font-medium mb-2">Annual Revenue</label>
              <div className="relative">
                <select
                  value={inputs.revenue}
                  onChange={(e) => updateInput('revenue', e.target.value)}
                  className="w-full bg-slate-700/30 backdrop-blur-sm border border-orange-400/30 rounded-xl px-4 py-3 text-white focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 transition-all duration-200"
                >
                  <option value="">Prefer not to say</option>
                  <option value="under-1m">Under $1M</option>
                  <option value="1m-5m">$1M - $5M</option>
                  <option value="5m-25m">$5M - $25M</option>
                  <option value="25m-100m">$25M - $100M</option>
                  <option value="100m-500m">$100M - $500M</option>
                  <option value="over-500m">Over $500M</option>
                </select>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-red-500/5 to-orange-500/5 pointer-events-none"></div>
              </div>
            </div>
          </div>
        );

      case 1: // Current AI Landscape
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-white font-medium mb-2">Current AI Usage *</label>
              <div className="relative">
                <select
                  value={inputs.currentAIUsage}
                  onChange={(e) => updateInput('currentAIUsage', e.target.value)}
                  className="w-full bg-slate-700/30 backdrop-blur-sm border border-orange-400/30 rounded-xl px-4 py-3 text-white focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 transition-all duration-200"
                  required
                >
                  <option value="">Select current usage</option>
                  <option value="none">No AI usage yet</option>
                  <option value="basic">Basic tools (ChatGPT, etc.)</option>
                  <option value="some-automation">Some automation/tools</option>
                  <option value="piloting">Piloting AI solutions</option>
                  <option value="production">AI in production</option>
                  <option value="advanced">Advanced AI implementation</option>
                </select>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-red-500/5 to-orange-500/5 pointer-events-none"></div>
              </div>
            </div>

            <div>
              <label className="block text-white font-medium mb-3">Biggest Challenges (select all that apply) *</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  "Data quality and integration",
                  "Lack of AI expertise",
                  "Budget constraints",
                  "Regulatory compliance",
                  "Change management",
                  "Technology infrastructure",
                  "ROI measurement",
                  "Vendor selection"
                ].map((challenge) => (
                  <label key={challenge} className="group relative flex items-center gap-3 p-3 bg-slate-700/20 backdrop-blur-sm border border-orange-400/20 rounded-lg cursor-pointer hover:bg-slate-600/30 hover:border-orange-400/40 transition-all duration-200">
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-red-500/5 to-orange-500/5 group-hover:from-red-500/10 group-hover:to-orange-500/10 transition-all duration-200"></div>
                    <input
                      type="checkbox"
                      checked={inputs.biggestChallenges.includes(challenge)}
                      onChange={() => toggleArrayValue('biggestChallenges', challenge)}
                      className="relative z-10 rounded border-orange-400/30 text-orange-500 focus:ring-orange-400/20"
                    />
                    <span className="relative z-10 text-slate-300 text-sm group-hover:text-slate-200 transition-colors duration-200">{challenge}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-white font-medium mb-2">Data Maturity Level *</label>
              <div className="relative">
                <select
                  value={inputs.dataMaturity}
                  onChange={(e) => updateInput('dataMaturity', e.target.value)}
                  className="w-full bg-slate-700/30 backdrop-blur-sm border border-orange-400/30 rounded-xl px-4 py-3 text-white focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 transition-all duration-200"
                  required
                >
                  <option value="">Select maturity level</option>
                  <option value="basic">Basic - Data in silos, limited integration</option>
                  <option value="developing">Developing - Some integration, basic analytics</option>
                  <option value="mature">Mature - Good data infrastructure, regular reporting</option>
                  <option value="advanced">Advanced - Data-driven culture, predictive analytics</option>
                </select>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-red-500/5 to-orange-500/5 pointer-events-none"></div>
              </div>
            </div>
          </div>
        );

      case 2: // Strategic Objectives
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-white font-medium mb-3">Primary Goals (select up to 3) *</label>
              <div className="grid grid-cols-1 gap-3">
                {[
                  "Reduce operational costs",
                  "Increase productivity and efficiency",
                  "Improve customer experience",
                  "Accelerate decision making",
                  "Enhance product/service quality",
                  "Drive innovation and competitive advantage",
                  "Automate repetitive processes",
                  "Improve risk management"
                ].map((goal) => (
                  <label key={goal} className="group relative flex items-center gap-3 p-3 bg-slate-700/20 backdrop-blur-sm border border-orange-400/20 rounded-lg cursor-pointer hover:bg-slate-600/30 hover:border-orange-400/40 transition-all duration-200">
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-red-500/5 to-orange-500/5 group-hover:from-red-500/10 group-hover:to-orange-500/10 transition-all duration-200"></div>
                    <input
                      type="checkbox"
                      checked={inputs.primaryGoals.includes(goal)}
                      onChange={() => {
                        if (inputs.primaryGoals.includes(goal)) {
                          toggleArrayValue('primaryGoals', goal);
                        } else if (inputs.primaryGoals.length < 3) {
                          toggleArrayValue('primaryGoals', goal);
                        }
                      }}
                      disabled={!inputs.primaryGoals.includes(goal) && inputs.primaryGoals.length >= 3}
                      className="relative z-10 rounded border-orange-400/30 text-orange-500 focus:ring-orange-400/20 disabled:opacity-50"
                    />
                    <span className="relative z-10 text-slate-300 group-hover:text-slate-200 transition-colors duration-200">{goal}</span>
                  </label>
                ))}
              </div>
              <p className="text-slate-400 text-sm mt-2">
                Selected: {inputs.primaryGoals.length}/3
              </p>
            </div>

            <div>
              <label className="block text-white font-medium mb-2">Implementation Timeline *</label>
              <div className="relative">
                <select
                  value={inputs.timeline}
                  onChange={(e) => updateInput('timeline', e.target.value)}
                  className="w-full bg-slate-700/30 backdrop-blur-sm border border-orange-400/30 rounded-xl px-4 py-3 text-white focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 transition-all duration-200"
                  required
                >
                  <option value="">Select timeline</option>
                  <option value="3-months">Next 3 months</option>
                  <option value="6-months">Next 6 months</option>
                  <option value="12-months">Next 12 months</option>
                  <option value="12plus-months">12+ months</option>
                </select>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-red-500/5 to-orange-500/5 pointer-events-none"></div>
              </div>
            </div>

            <div>
              <label className="block text-white font-medium mb-2">Budget Range *</label>
              <div className="relative">
                <select
                  value={inputs.budget}
                  onChange={(e) => updateInput('budget', e.target.value)}
                  className="w-full bg-slate-700/30 backdrop-blur-sm border border-orange-400/30 rounded-xl px-4 py-3 text-white focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 transition-all duration-200"
                  required
                >
                  <option value="">Select budget range</option>
                  <option value="under-25k">Under $25K</option>
                  <option value="25k-100k">$25K - $100K</option>
                  <option value="100k-250k">$100K - $250K</option>
                  <option value="250k-500k">$250K - $500K</option>
                  <option value="500k-1m">$500K - $1M</option>
                  <option value="over-1m">Over $1M</option>
                </select>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-red-500/5 to-orange-500/5 pointer-events-none"></div>
              </div>
            </div>
          </div>
        );

      case 3: // Resources & Readiness
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-white font-medium mb-2">Technical Capability *</label>
              <div className="relative">
                <select
                  value={inputs.technicalCapability}
                  onChange={(e) => updateInput('technicalCapability', e.target.value)}
                  className="w-full bg-slate-700/30 backdrop-blur-sm border border-orange-400/30 rounded-xl px-4 py-3 text-white focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 transition-all duration-200"
                  required
                >
                  <option value="">Select capability level</option>
                  <option value="limited">Limited - Mostly outsourced IT</option>
                  <option value="basic">Basic - Internal IT team</option>
                  <option value="good">Good - Strong technical team</option>
                  <option value="advanced">Advanced - AI/ML expertise available</option>
                </select>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-red-500/5 to-orange-500/5 pointer-events-none"></div>
              </div>
            </div>

            <div>
              <label className="block text-white font-medium mb-2">Change Readiness *</label>
              <div className="relative">
                <select
                  value={inputs.changeReadiness}
                  onChange={(e) => updateInput('changeReadiness', e.target.value)}
                  className="w-full bg-slate-700/30 backdrop-blur-sm border border-orange-400/30 rounded-xl px-4 py-3 text-white focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 transition-all duration-200"
                  required
                >
                  <option value="">Select readiness level</option>
                  <option value="resistant">Resistant to change</option>
                  <option value="cautious">Cautious but open</option>
                  <option value="ready">Ready for change</option>
                  <option value="eager">Eager for innovation</option>
                </select>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-red-500/5 to-orange-500/5 pointer-events-none"></div>
              </div>
            </div>

            <div>
              <label className="block text-white font-medium mb-3">Key Decision Makers (select all involved) *</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  "CEO/President",
                  "CTO/CIO",
                  "CFO",
                  "COO",
                  "VP Operations",
                  "Head of IT",
                  "Department Head",
                  "Board of Directors"
                ].map((role) => (
                  <label key={role} className="group relative flex items-center gap-3 p-3 bg-slate-700/20 backdrop-blur-sm border border-orange-400/20 rounded-lg cursor-pointer hover:bg-slate-600/30 hover:border-orange-400/40 transition-all duration-200">
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-red-500/5 to-orange-500/5 group-hover:from-red-500/10 group-hover:to-orange-500/10 transition-all duration-200"></div>
                    <input
                      type="checkbox"
                      checked={inputs.decisionMakers.includes(role)}
                      onChange={() => toggleArrayValue('decisionMakers', role)}
                      className="relative z-10 rounded border-orange-400/30 text-orange-500 focus:ring-orange-400/20"
                    />
                    <span className="relative z-10 text-slate-300 text-sm group-hover:text-slate-200 transition-colors duration-200">{role}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );

      case 4: // Contact & Next Steps
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-white font-medium mb-2">Your Name *</label>
              <div className="relative">
                <input
                  type="text"
                  value={inputs.contactName}
                  onChange={(e) => updateInput('contactName', e.target.value)}
                  className="w-full bg-slate-700/30 backdrop-blur-sm border border-orange-400/30 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 transition-all duration-200"
                  placeholder="Full name"
                  required
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-red-500/5 to-orange-500/5 pointer-events-none"></div>
              </div>
            </div>

            <div>
              <label className="block text-white font-medium mb-2">Email Address *</label>
              <div className="relative">
                <input
                  type="email"
                  value={inputs.contactEmail}
                  onChange={(e) => updateInput('contactEmail', e.target.value)}
                  className="w-full bg-slate-700/30 backdrop-blur-sm border border-orange-400/30 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 transition-all duration-200"
                  placeholder="your.email@company.com"
                  required
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-red-500/5 to-orange-500/5 pointer-events-none"></div>
              </div>
            </div>

            <div>
              <label className="block text-white font-medium mb-2">Phone Number</label>
              <div className="relative">
                <input
                  type="tel"
                  value={inputs.contactPhone}
                  onChange={(e) => updateInput('contactPhone', e.target.value)}
                  className="w-full bg-slate-700/30 backdrop-blur-sm border border-orange-400/30 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 transition-all duration-200"
                  placeholder="Optional - for priority support"
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-red-500/5 to-orange-500/5 pointer-events-none"></div>
              </div>
            </div>

            <div>
              <label className="block text-white font-medium mb-2">Best Time for Strategy Call</label>
              <div className="relative">
                <select
                  value={inputs.bestTimeToCall}
                  onChange={(e) => updateInput('bestTimeToCall', e.target.value)}
                  className="w-full bg-slate-700/30 backdrop-blur-sm border border-orange-400/30 rounded-xl px-4 py-3 text-white focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 transition-all duration-200"
                >
                  <option value="">Select preferred time</option>
                  <option value="morning">Morning (9am-12pm)</option>
                  <option value="afternoon">Afternoon (12pm-5pm)</option>
                  <option value="evening">Evening (5pm-7pm)</option>
                  <option value="flexible">Flexible</option>
                </select>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-red-500/5 to-orange-500/5 pointer-events-none"></div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-orange-500/10 rounded-xl blur-lg"></div>
              <div className="relative bg-gradient-to-r from-orange-500/10 to-yellow-500/10 backdrop-blur-sm border border-orange-400/30 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-orange-300 mb-3 flex items-center gap-2">
                  <span className="text-xl animate-pulse-bright">📋</span>
                  Your AI Blueprint Will Include:
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-slate-300">
                  <div className="flex items-start gap-2">
                    <span className="text-orange-400 animate-pulse-bright">✓</span>
                    <span>90-day implementation roadmap</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-orange-400 animate-pulse-bright">✓</span>
                    <span>ROI projections & KPI framework</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-orange-400 animate-pulse-bright">✓</span>
                    <span>Risk mitigation strategies</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-orange-400 animate-pulse-bright">✓</span>
                    <span>Technology recommendations</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-orange-400 animate-pulse-bright">✓</span>
                    <span>Team training plan</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-orange-400 animate-pulse-bright">✓</span>
                    <span>Governance framework</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const isStepComplete = () => {
    switch (currentStep) {
      case 0:
        return inputs.companyName && inputs.industry && inputs.companySize;
      case 1:
        return inputs.currentAIUsage && inputs.biggestChallenges.length > 0 && inputs.dataMaturity;
      case 2:
        return inputs.primaryGoals.length > 0 && inputs.timeline && inputs.budget;
      case 3:
        return inputs.technicalCapability && inputs.changeReadiness && inputs.decisionMakers.length > 0;
      case 4:
        return inputs.contactName && inputs.contactEmail;
      default:
        return false;
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-red-950/90 to-slate-900/95" />

        {/* Floating geometric shapes - blueprint theme */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-red-500/20 to-orange-600/20 rounded-3xl rotate-45 animate-float blur-xl"></div>
        <div className="absolute top-60 right-20 w-24 h-24 bg-gradient-to-br from-amber-500/15 to-yellow-600/15 rounded-full animate-float-delayed blur-lg"></div>
        <div className="absolute bottom-40 left-20 w-40 h-40 bg-gradient-to-br from-orange-500/10 to-red-600/10 rounded-2xl rotate-12 animate-float blur-2xl"></div>
        <div className="absolute bottom-20 right-10 w-28 h-28 bg-gradient-to-br from-yellow-500/20 to-orange-600/20 rounded-full animate-float-delayed blur-xl"></div>

        {/* Animated grid overlay */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5 animate-grid-flow"></div>

        {/* Dynamic light beams */}
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-red-400/20 to-transparent animate-beam-1"></div>
        <div className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-transparent via-orange-400/15 to-transparent animate-beam-2"></div>
      </div>

      <div className="relative z-10 py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Enhanced Header */}
          <div className="text-center mb-12">
            <div className="relative inline-block mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 rounded-3xl blur-2xl opacity-30 animate-pulse-glow"></div>
              <h1 className="relative text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
                <span className="bg-gradient-to-r from-red-300 via-orange-300 to-yellow-300 bg-clip-text text-transparent animate-text-shimmer bg-size-200">
                  Personalized AI Blueprint
                </span>
              </h1>
            </div>

            <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8 leading-relaxed">
              Get a comprehensive 90-day AI implementation roadmap tailored specifically
              to your organization's goals, capabilities, and industry requirements.
            </p>

            {/* Enhanced Premium Notice */}
            <div className="relative max-w-2xl mx-auto">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-2xl blur-xl"></div>
              <div className="relative bg-orange-500/10 backdrop-blur-xl border border-orange-400/30 rounded-2xl p-6">
                <div className="flex items-center justify-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center animate-pulse-bright">
                    <span className="text-white text-sm">🎯</span>
                  </div>
                  <span className="font-semibold text-orange-300 text-lg">Premium Strategic Deliverable</span>
                </div>
                <p className="text-orange-200 text-sm leading-relaxed">
                  This goes far beyond our free diagnostic—you'll receive a detailed implementation plan
                  worth $2,997, delivered within 24 hours.
                </p>
              </div>
            </div>
          </div>

        {/* Enhanced Progress Bar */}
        <div className="mb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-orange-500/10 rounded-3xl blur-xl"></div>
            <div className="relative bg-slate-800/30 backdrop-blur-xl border border-orange-400/20 rounded-3xl p-6">
              <div className="flex items-center justify-between mb-6">
                {steps.map((step, index) => (
                  <div key={index} className="flex flex-col items-center text-center relative">
                    <div className={`relative w-14 h-14 rounded-full flex items-center justify-center text-2xl mb-3 transition-all duration-300 ${
                      index <= currentStep
                        ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg shadow-red-500/25 animate-pulse-bright'
                        : 'bg-slate-700/50 text-slate-400 border border-slate-600/50'
                    }`}>
                      {index <= currentStep && (
                        <div className="absolute inset-0 bg-gradient-to-r from-red-400/30 to-orange-400/30 rounded-full blur-lg animate-pulse-glow"></div>
                      )}
                      <span className="relative z-10">{step.icon}</span>
                    </div>
                    <div className="hidden sm:block">
                      <p className={`font-medium text-sm mb-1 transition-colors ${
                        index <= currentStep ? 'text-orange-200' : 'text-slate-400'
                      }`}>{step.title}</p>
                      <p className="text-slate-500 text-xs">{step.description}</p>
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`absolute top-7 left-full w-8 h-px transition-colors ${
                        index < currentStep ? 'bg-gradient-to-r from-red-400 to-orange-400' : 'bg-slate-600'
                      }`}></div>
                    )}
                  </div>
                ))}
              </div>
              <div className="relative w-full bg-slate-700/50 rounded-full h-3 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-slate-700/30 to-slate-600/30 rounded-full"></div>
                <div
                  className="relative bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 h-3 rounded-full transition-all duration-500 animate-pulse-glow"
                  style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-red-400/50 to-orange-400/50 rounded-full blur-sm animate-pulse-bright"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Form */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-orange-500/10 to-yellow-500/10 rounded-3xl blur-xl"></div>
          <div className="relative bg-slate-800/30 backdrop-blur-xl border border-orange-400/20 rounded-3xl p-8 shadow-2xl">
          <div className="mb-8">
            <div className="relative">
              <h2 className="text-2xl font-semibold mb-2 flex items-center gap-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-red-400/30 to-orange-400/30 rounded-full blur-lg animate-pulse-glow"></div>
                  <span className="relative text-3xl">{steps[currentStep].icon}</span>
                </div>
                <span className="bg-gradient-to-r from-red-200 via-orange-200 to-yellow-200 bg-clip-text text-transparent animate-text-shimmer bg-size-200">
                  {steps[currentStep].title}
                </span>
              </h2>
              <p className="text-slate-300 leading-relaxed">{steps[currentStep].description}</p>
            </div>
          </div>

          {renderStep()}

          {/* Enhanced Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-orange-400/20">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className="group px-6 py-3 text-slate-400 hover:text-orange-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <span className="transform group-hover:-translate-x-1 transition-transform duration-200">←</span>
              Previous
            </button>

            <div className="text-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-red-400/20 to-orange-400/20 rounded-lg blur-sm"></div>
                <p className="relative text-orange-200 text-sm font-medium px-4 py-2 bg-slate-800/50 rounded-lg border border-orange-400/30">
                  Step {currentStep + 1} of {steps.length}
                </p>
              </div>
            </div>

            <button
              onClick={nextStep}
              disabled={!isStepComplete() || isSubmitting}
              className="group relative px-8 py-3 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-400 hover:to-orange-400 disabled:from-slate-600 disabled:to-slate-700 text-white font-semibold rounded-xl transition-all duration-200 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-red-400/30 to-orange-400/30 rounded-xl blur-lg group-hover:blur-xl transition-all duration-200"></div>
              <span className="relative flex items-center gap-2">
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Creating Blueprint...
                  </>
                ) : currentStep === steps.length - 1 ? (
                  <>
                    Generate My Blueprint
                    <span className="text-xl">🎯</span>
                  </>
                ) : (
                  <>
                    Next
                    <span className="transform group-hover:translate-x-1 transition-transform duration-200">→</span>
                  </>
                )}
              </span>
            </button>
          </div>
          </div>
        </div>

        {/* Enhanced Value Proposition */}
        <div className="text-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-orange-500/10 to-yellow-500/10 rounded-3xl blur-2xl"></div>
            <div className="relative bg-gradient-to-r from-slate-800/40 to-slate-700/40 backdrop-blur-xl border border-orange-400/30 rounded-3xl p-8 shadow-2xl">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-gradient-to-r from-red-400/20 to-orange-400/20 rounded-2xl blur-xl"></div>
                <h3 className="relative text-2xl font-bold mb-2">
                  <span className="bg-gradient-to-r from-red-200 via-orange-200 to-yellow-200 bg-clip-text text-transparent animate-text-shimmer bg-size-200">
                    Why Executives Choose Our AI Blueprints
                  </span>
                </h3>
              </div>
              <div className="grid md:grid-cols-3 gap-6 text-left">
                <div className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-orange-500/10 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-300"></div>
                  <div className="relative bg-slate-800/30 backdrop-blur-sm border border-red-400/20 rounded-2xl p-6 hover:border-red-400/40 transition-all duration-300">
                    <h4 className="text-lg font-semibold text-red-300 mb-3 flex items-center gap-2">
                      <span className="text-2xl animate-pulse-bright">🎯</span>
                      Strategic Focus
                    </h4>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      Unlike generic consultants, we focus exclusively on AI implementation
                      with proven 90-day frameworks that deliver measurable results.
                    </p>
                  </div>
                </div>
                <div className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-yellow-500/10 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-300"></div>
                  <div className="relative bg-slate-800/30 backdrop-blur-sm border border-orange-400/20 rounded-2xl p-6 hover:border-orange-400/40 transition-all duration-300">
                    <h4 className="text-lg font-semibold text-orange-300 mb-3 flex items-center gap-2">
                      <span className="text-2xl animate-pulse-bright">⚡</span>
                      Fast Delivery
                    </h4>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      Receive your comprehensive blueprint within 24 hours, not weeks.
                      Start implementing immediately with clear, actionable next steps.
                    </p>
                  </div>
                </div>
                <div className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-amber-500/10 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-300"></div>
                  <div className="relative bg-slate-800/30 backdrop-blur-sm border border-yellow-400/20 rounded-2xl p-6 hover:border-yellow-400/40 transition-all duration-300">
                    <h4 className="text-lg font-semibold text-yellow-300 mb-3 flex items-center gap-2">
                      <span className="text-2xl animate-pulse-bright">💰</span>
                      ROI Guarantee
                    </h4>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      Every blueprint includes detailed ROI projections and KPI frameworks
                      to ensure your AI investment delivers measurable business value.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}