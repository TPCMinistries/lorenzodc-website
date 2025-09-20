"use client";
import { useState, useEffect } from "react";
import { ConversionTrackingService } from "../../lib/services/conversion-tracking";

interface AssessmentData {
  // Personal Information (for spiritual analysis)
  fullName: string;
  email: string;
  birthDate: string;
  location: string;
  phone: string;

  // Current Situation
  primaryFocus: string;
  currentVision: string;
  implementationChallenges: string;
  seasonalAssessment: string;
  strategicPriorities: string;

  // Background Analysis
  leadershipExperience: string;
  spiritualBackground: string;
  businessExperience: string;
  educationalBackground: string;

  // Expectations
  desiredOutcomes: string;
  timelineConsiderations: string;
  investmentLevel: string;
  communityInterest: string;
}

export default function StrategicClarityAssessment() {
  const [mounted, setMounted] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [assessmentData, setAssessmentData] = useState<AssessmentData>({
    fullName: "",
    email: "",
    birthDate: "",
    location: "",
    phone: "",
    primaryFocus: "",
    currentVision: "",
    implementationChallenges: "",
    seasonalAssessment: "",
    strategicPriorities: "",
    leadershipExperience: "",
    spiritualBackground: "",
    businessExperience: "",
    educationalBackground: "",
    desiredOutcomes: "",
    timelineConsiderations: "",
    investmentLevel: "",
    communityInterest: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [aiGuidance, setAiGuidance] = useState<string>("");

  // Track page view and set mounted state
  useEffect(() => {
    setMounted(true);
    ConversionTrackingService.trackPageView('/lorenzo/assessment', undefined, {
      page_type: 'assessment',
      assessment_type: 'strategic_clarity',
      platform: 'lorenzo_site'
    });
  }, []);

  const handleInputChange = (field: keyof AssessmentData, value: string) => {
    setAssessmentData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmitAssessment = async () => {
    setIsSubmitting(true);

    try {
      // Generate AI spiritual guidance
      const response = await fetch('/api/spiritual-guidance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(assessmentData)
      });

      if (response.ok) {
        const result = await response.json();
        setAiGuidance(result.guidance);
        setShowResults(true);

        // Track successful assessment completion
        ConversionTrackingService.trackConversion('lead', {
          event: 'strategic_assessment_completed',
          content_type: 'assessment',
          content_category: 'spiritual_strategic_guidance',
          metadata: {
            full_name: assessmentData.fullName,
            primary_focus: assessmentData.primaryFocus,
            investment_level: assessmentData.investmentLevel,
            spiritual_openness: assessmentData.spiritualBackground ? 'high' : 'moderate'
          }
        });
      }
    } catch (error) {
      console.error('Assessment submission failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const getProgressPercentage = () => (currentStep / 4) * 100;

  // Show loading state until mounted
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950">
        <div className="flex items-center justify-center h-screen">
          <div className="text-white">Loading...</div>
        </div>
      </div>
    );
  }

  // Results View
  if (showResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-amber-600/20 to-yellow-600/15 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-1/3 -left-40 w-96 h-96 bg-gradient-to-br from-violet-600/15 to-pink-600/10 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-gradient-to-br from-emerald-500/10 to-teal-600/8 rounded-full blur-3xl animate-pulse delay-2000" />
        </div>

        <div className="relative z-10 py-16 px-4">
          <div className="container mx-auto max-w-5xl">
            <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 md:p-12">
              {/* Success Header */}
              <div className="text-center mb-12">
                <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-8 animate-bounce">
                  ✨
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                  Your Strategic Clarity Analysis
                </h1>
                <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                  Personalized guidance based on your divine assignment and current season
                </p>
              </div>

              {/* AI Guidance Display */}
              <div className="bg-gradient-to-br from-slate-900/80 to-indigo-900/40 rounded-2xl p-8 mb-10 border border-amber-500/20">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-full flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-amber-300">AI-Enhanced Strategic Guidance</h2>
                </div>
                <div className="prose prose-invert prose-lg max-w-none">
                  <div className="whitespace-pre-wrap text-gray-200 leading-relaxed text-lg">
                    {aiGuidance || "Your personalized strategic guidance is being generated. This comprehensive analysis will provide insights into your divine assignment, current season, and next steps for systematic implementation."}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-blue-500/20 text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">Ready for Strategic Implementation?</h3>
                  <p className="text-gray-300 mb-6 text-sm">Schedule a personalized strategy session to dive deeper into your divine assignment.</p>
                  <button
                    onClick={() => window.open('https://calendly.com/lorenzo-theglobalenterprise/discovery-call?utm_source=strategic_assessment', '_blank')}
                    className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
                  >
                    Schedule Strategy Session
                  </button>
                </div>

                <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-emerald-500/20 text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">Continue with AI Guidance</h3>
                  <p className="text-gray-300 mb-6 text-sm">Access ongoing AI coaching and strategic implementation tools.</p>
                  <a href="/catalyst" className="block">
                    <button className="w-full px-6 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105">
                      Access Catalyst Platform
                    </button>
                  </a>
                </div>
              </div>

              {/* Additional Resources */}
              <div className="mt-10 text-center">
                <p className="text-gray-400 mb-4">Want to dive deeper into strategic wisdom?</p>
                <a href="/learning" className="inline-flex items-center text-blue-400 hover:text-blue-300 font-semibold transition-colors">
                  Explore Learning Hub
                  <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main Assessment Form
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-indigo-600/20 to-purple-600/15 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/3 -left-40 w-96 h-96 bg-gradient-to-br from-violet-600/15 to-pink-600/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-gradient-to-br from-amber-500/10 to-yellow-600/8 rounded-full blur-3xl animate-pulse delay-2000" />

        {/* Floating Elements */}
        <div className="absolute top-20 left-1/4 w-4 h-4 bg-amber-400/30 rounded-full animate-bounce delay-300" />
        <div className="absolute top-32 right-1/3 w-3 h-3 bg-blue-500/40 rounded-full animate-pulse delay-500" />
        <div className="absolute top-60 left-1/6 w-2 h-2 bg-purple-400/50 rounded-full animate-ping delay-700" />
      </div>

      <div className="relative z-10 pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-8">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Strategic Clarity Assessment
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              AI-enhanced analysis to identify your divine assignment, current season,
              and systematic implementation strategy for breakthrough results.
            </p>
          </div>

          {/* Enhanced Progress Bar */}
          <div className="mb-12">
            <div className="flex justify-center items-center gap-6 mb-6">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="flex flex-col items-center">
                  <div
                    className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-white transition-all duration-300 ${
                      step < currentStep
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-600'
                        : step === currentStep
                        ? 'bg-gradient-to-r from-amber-500 to-yellow-600 animate-pulse'
                        : 'bg-slate-700/50 border border-slate-600'
                    }`}
                  >
                    {step < currentStep ? (
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      step
                    )}
                  </div>
                  <div className={`text-sm mt-2 font-medium ${
                    step <= currentStep ? 'text-white' : 'text-gray-500'
                  }`}>
                    {step === 1 && "Personal"}
                    {step === 2 && "Current Situation"}
                    {step === 3 && "Background"}
                    {step === 4 && "Expectations"}
                  </div>
                </div>
              ))}
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-700/50 rounded-full h-2 mb-4">
              <div
                className="bg-gradient-to-r from-amber-500 to-yellow-600 h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${getProgressPercentage()}%` }}
              />
            </div>
            <div className="text-center text-gray-400">
              Step {currentStep} of 4 • {Math.round(getProgressPercentage())}% Complete
            </div>
          </div>

          {/* Main Form Container */}
          <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 md:p-12">
            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <div>
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-white mb-4">Personal Information</h2>
                  <p className="text-gray-300">Help us personalize your strategic analysis</p>
                </div>

                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-white font-semibold mb-3">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={assessmentData.fullName}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                        className="w-full bg-slate-800/50 border border-slate-600/50 rounded-xl px-6 py-4 text-white placeholder-gray-400 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all"
                        placeholder="Your full name for personalized analysis"
                      />
                    </div>
                    <div>
                      <label className="block text-white font-semibold mb-3">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={assessmentData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="w-full bg-slate-800/50 border border-slate-600/50 rounded-xl px-6 py-4 text-white placeholder-gray-400 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all"
                        placeholder="for strategic communication"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-white font-semibold mb-3">
                        Birth Date *
                      </label>
                      <input
                        type="date"
                        required
                        value={assessmentData.birthDate}
                        onChange={(e) => handleInputChange('birthDate', e.target.value)}
                        className="w-full bg-slate-800/50 border border-slate-600/50 rounded-xl px-6 py-4 text-white focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all"
                      />
                      <p className="text-gray-400 text-sm mt-2">For life phase and seasonal analysis</p>
                    </div>
                    <div>
                      <label className="block text-white font-semibold mb-3">
                        Location
                      </label>
                      <input
                        type="text"
                        value={assessmentData.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        className="w-full bg-slate-800/50 border border-slate-600/50 rounded-xl px-6 py-4 text-white placeholder-gray-400 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all"
                        placeholder="City, State/Country"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-3">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={assessmentData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full bg-slate-800/50 border border-slate-600/50 rounded-xl px-6 py-4 text-white placeholder-gray-400 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all"
                      placeholder="For strategic follow-up communication"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Current Situation */}
            {currentStep === 2 && (
              <div>
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-white mb-4">Current Situation</h2>
                  <p className="text-gray-300">Tell us about your present focus and challenges</p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-white font-semibold mb-3">
                      Primary Focus *
                    </label>
                    <select
                      required
                      value={assessmentData.primaryFocus}
                      onChange={(e) => handleInputChange('primaryFocus', e.target.value)}
                      className="w-full bg-slate-800/50 border border-slate-600/50 rounded-xl px-6 py-4 text-white focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all"
                    >
                      <option value="">Select your primary focus</option>
                      <option value="Ministry Leadership">Ministry Leadership</option>
                      <option value="Business Development">Business Development</option>
                      <option value="Nonprofit/Social Impact">Nonprofit/Social Impact</option>
                      <option value="Ministry + Business Integration">Ministry + Business Integration</option>
                      <option value="Investment/Capital Deployment">Investment/Capital Deployment</option>
                      <option value="Organizational Transformation">Organizational Transformation</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-3">
                      Current Vision/Calling
                    </label>
                    <textarea
                      value={assessmentData.currentVision}
                      onChange={(e) => handleInputChange('currentVision', e.target.value)}
                      rows={4}
                      className="w-full bg-slate-800/50 border border-slate-600/50 rounded-xl px-6 py-4 text-white placeholder-gray-400 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all"
                      placeholder="Describe what you sense you're meant to do or build..."
                    />
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-3">
                      Implementation Challenges
                    </label>
                    <textarea
                      value={assessmentData.implementationChallenges}
                      onChange={(e) => handleInputChange('implementationChallenges', e.target.value)}
                      rows={4}
                      className="w-full bg-slate-800/50 border border-slate-600/50 rounded-xl px-6 py-4 text-white placeholder-gray-400 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all"
                      placeholder="What's preventing progress toward your vision?"
                    />
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-3">
                      Current Season Assessment
                    </label>
                    <select
                      value={assessmentData.seasonalAssessment}
                      onChange={(e) => handleInputChange('seasonalAssessment', e.target.value)}
                      className="w-full bg-slate-800/50 border border-slate-600/50 rounded-xl px-6 py-4 text-white focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all"
                    >
                      <option value="">How would you describe your current season?</option>
                      <option value="Expansion - Growing and scaling rapidly">Expansion - Growing and scaling rapidly</option>
                      <option value="Consolidation - Strengthening and systematizing">Consolidation - Strengthening and systematizing</option>
                      <option value="Transition - Major change or pivot">Transition - Major change or pivot</option>
                      <option value="Preparation - Building foundation for future">Preparation - Building foundation for future</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-3">
                      Strategic Priorities
                    </label>
                    <textarea
                      value={assessmentData.strategicPriorities}
                      onChange={(e) => handleInputChange('strategicPriorities', e.target.value)}
                      rows={3}
                      className="w-full bg-slate-800/50 border border-slate-600/50 rounded-xl px-6 py-4 text-white placeholder-gray-400 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all"
                      placeholder="Top 3 areas needing clarity or breakthrough..."
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Background Analysis */}
            {currentStep === 3 && (
              <div>
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-white mb-4">Background Analysis</h2>
                  <p className="text-gray-300">Share your experience and foundation</p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-white font-semibold mb-3">
                      Leadership Experience
                    </label>
                    <textarea
                      value={assessmentData.leadershipExperience}
                      onChange={(e) => handleInputChange('leadershipExperience', e.target.value)}
                      rows={3}
                      className="w-full bg-slate-800/50 border border-slate-600/50 rounded-xl px-6 py-4 text-white placeholder-gray-400 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all"
                      placeholder="Key leadership roles and responsibilities you've held..."
                    />
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-3">
                      Spiritual Background
                    </label>
                    <textarea
                      value={assessmentData.spiritualBackground}
                      onChange={(e) => handleInputChange('spiritualBackground', e.target.value)}
                      rows={3}
                      className="w-full bg-slate-800/50 border border-slate-600/50 rounded-xl px-6 py-4 text-white placeholder-gray-400 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all"
                      placeholder="Denominational background, theological training, ministry experience..."
                    />
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-3">
                      Business Experience
                    </label>
                    <textarea
                      value={assessmentData.businessExperience}
                      onChange={(e) => handleInputChange('businessExperience', e.target.value)}
                      rows={3}
                      className="w-full bg-slate-800/50 border border-slate-600/50 rounded-xl px-6 py-4 text-white placeholder-gray-400 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all"
                      placeholder="Entrepreneurial, corporate, or consulting background..."
                    />
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-3">
                      Educational Background
                    </label>
                    <textarea
                      value={assessmentData.educationalBackground}
                      onChange={(e) => handleInputChange('educationalBackground', e.target.value)}
                      rows={3}
                      className="w-full bg-slate-800/50 border border-slate-600/50 rounded-xl px-6 py-4 text-white placeholder-gray-400 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all"
                      placeholder="Formal education, certifications, significant learning experiences..."
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Expectations */}
            {currentStep === 4 && (
              <div>
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-white mb-4">Expectations & Investment</h2>
                  <p className="text-gray-300">Define your desired outcomes and commitment level</p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-white font-semibold mb-3">
                      Desired Outcomes
                    </label>
                    <textarea
                      value={assessmentData.desiredOutcomes}
                      onChange={(e) => handleInputChange('desiredOutcomes', e.target.value)}
                      rows={4}
                      className="w-full bg-slate-800/50 border border-slate-600/50 rounded-xl px-6 py-4 text-white placeholder-gray-400 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all"
                      placeholder="What would success look like for you over the next 90 days? 12 months?"
                    />
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-3">
                      Timeline Considerations
                    </label>
                    <select
                      value={assessmentData.timelineConsiderations}
                      onChange={(e) => handleInputChange('timelineConsiderations', e.target.value)}
                      className="w-full bg-slate-800/50 border border-slate-600/50 rounded-xl px-6 py-4 text-white focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all"
                    >
                      <option value="">Select your timeline preference</option>
                      <option value="Immediate - Need breakthrough within 30 days">Immediate - Need breakthrough within 30 days</option>
                      <option value="Short-term - 3-6 month development focus">Short-term - 3-6 month development focus</option>
                      <option value="Medium-term - 6-12 month strategic building">Medium-term - 6-12 month strategic building</option>
                      <option value="Long-term - 1-2 year institutional development">Long-term - 1-2 year institutional development</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-3">
                      Investment Level
                    </label>
                    <select
                      value={assessmentData.investmentLevel}
                      onChange={(e) => handleInputChange('investmentLevel', e.target.value)}
                      className="w-full bg-slate-800/50 border border-slate-600/50 rounded-xl px-6 py-4 text-white focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all"
                    >
                      <option value="">Select your coaching investment range</option>
                      <option value="Platform Access - $297/month ongoing AI guidance">Platform Access - $297/month ongoing AI guidance</option>
                      <option value="Strategic Coaching - $1,997-$4,997 individual sessions">Strategic Coaching - $1,997-$4,997 individual sessions</option>
                      <option value="Implementation Program - $9,997-$24,997 comprehensive">Implementation Program - $9,997-$24,997 comprehensive</option>
                      <option value="Institutional Consultation - $50K+ organizational transformation">Institutional Consultation - $50K+ organizational transformation</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-3">
                      Community Interest
                    </label>
                    <select
                      value={assessmentData.communityInterest}
                      onChange={(e) => handleInputChange('communityInterest', e.target.value)}
                      className="w-full bg-slate-800/50 border border-slate-600/50 rounded-xl px-6 py-4 text-white focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all"
                    >
                      <option value="">Select your community preference</option>
                      <option value="Individual Focus - One-on-one guidance preferred">Individual Focus - One-on-one guidance preferred</option>
                      <option value="Small Group - Mastermind or cohort learning">Small Group - Mastermind or cohort learning</option>
                      <option value="Community Integration - Broader network connection">Community Integration - Broader network connection</option>
                      <option value="Ministry Community - TPC Ministries involvement">Ministry Community - TPC Ministries involvement</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Enhanced Navigation */}
            <div className="flex justify-between items-center mt-12 pt-8 border-t border-white/10">
              {currentStep > 1 ? (
                <button
                  onClick={prevStep}
                  className="flex items-center px-6 py-3 bg-slate-700/50 border border-slate-600/50 text-white rounded-xl hover:bg-slate-600/50 transition-all duration-200"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Previous
                </button>
              ) : (
                <div></div>
              )}

              {currentStep < 4 ? (
                <button
                  onClick={nextStep}
                  className="flex items-center px-8 py-4 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105"
                >
                  Next Step
                  <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              ) : (
                <button
                  onClick={handleSubmitAssessment}
                  disabled={isSubmitting || !assessmentData.fullName || !assessmentData.email || !assessmentData.birthDate}
                  className="flex items-center px-8 py-4 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 disabled:from-slate-600 disabled:to-slate-700 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      Generating Strategic Analysis...
                    </>
                  ) : (
                    <>
                      <span className="mr-2">✨</span>
                      Generate Strategic Clarity
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}