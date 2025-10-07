'use client';

import { useState } from 'react';
import { LeadQualificationService } from '../lib/services/lead-qualification';
import { ConversionTrackingService } from '../lib/services/conversion-tracking';
import { SupabaseProspectService } from '../lib/supabase/prospect-service';
import { EmailAutomationService } from '../lib/services/email-automation';
import SmartBookingSystem from './SmartBookingSystem';

interface IntakeFormData {
  // Contact Information
  name: string;
  email: string;
  phone?: string;
  company?: string;
  role?: string;

  // Context Information
  primaryInterest: string;
  currentChallenges: string[];
  industryContext: string;
  organizationSize?: string;
  timeframe: string;

  // Qualification Questions
  budget_range?: string;
  decision_authority: string;
  urgency_level: string;
  previous_consulting: boolean;

  // Specific Interests
  services_interested: string[];
  communication_preference: string;
}

export default function EnhancedIntakeForm({
  source = 'intake_form',
  onComplete,
  className = ''
}: {
  source?: string;
  onComplete?: (profile: any) => void;
  className?: string;
}) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<IntakeFormData>>({
    currentChallenges: [],
    services_interested: [],
    previous_consulting: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showBooking, setShowBooking] = useState(false);
  const [qualifiedProfile, setQualifiedProfile] = useState<any>(null);

  const totalSteps = 4;

  const updateFormData = (updates: Partial<IntakeFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const handleMultiSelect = (field: string, value: string, checked: boolean) => {
    const currentValues = formData[field as keyof IntakeFormData] as string[] || [];
    const newValues = checked
      ? [...currentValues, value]
      : currentValues.filter(v => v !== value);
    updateFormData({ [field]: newValues });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      // Qualify the prospect based on form data
      const profile = LeadQualificationService.qualifyProspect({
        formData,
        pageViews: [window.location.pathname],
        utmData: {
          source: new URLSearchParams(window.location.search).get('utm_source'),
          medium: new URLSearchParams(window.location.search).get('utm_medium'),
          campaign: new URLSearchParams(window.location.search).get('utm_campaign')
        }
      });

      // Store the profile
      await LeadQualificationService.storeProspectProfile(profile);

      // Track conversion
      ConversionTrackingService.trackLead(
        profile.id,
        profile.leadScore,
        source,
        {
          form_completed: true,
          primary_interest: formData.primaryInterest,
          services_interested: formData.services_interested
        }
      );

      // Trigger appropriate email nurturing sequence
      await EmailAutomationService.triggerNurturingSequence(
        profile.id,
        {
          ...profile,
          form_completion: true,
          primary_interest: formData.primaryInterest,
          services_interested: formData.services_interested,
          urgency_level: formData.urgency_level
        }
      );

      setQualifiedProfile(profile);
      setShowBooking(true);

      if (onComplete) {
        onComplete(profile);
      }

    } catch (error) {
      console.error('Error processing intake form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showBooking) {
    return (
      <div className={`max-w-2xl mx-auto ${className}`}>
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">Perfect! Here's Your Recommended Next Step</h2>
          <p className="text-slate-300">Based on your responses, we've identified the optimal session type for your needs.</p>
        </div>
        <SmartBookingSystem
          formData={formData}
          source={source}
          className="w-full"
        />
      </div>
    );
  }

  return (
    <div className={`max-w-2xl mx-auto ${className}`}>
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-slate-400 mb-2">
          <span>Step {step} of {totalSteps}</span>
          <span>{Math.round((step / totalSteps) * 100)}% Complete</span>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="bg-slate-800/30 backdrop-blur-xl border border-slate-700/30 rounded-2xl p-8">

        {/* Step 1: Contact & Context */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Let's Get to Know You</h2>
              <p className="text-slate-300">This helps us understand your context and recommend the best approach.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Full Name *</label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => updateFormData({ name: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:border-purple-500 focus:outline-none"
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Email Address *</label>
                <input
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => updateFormData({ email: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:border-purple-500 focus:outline-none"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Organization/Company</label>
                <input
                  type="text"
                  value={formData.company || ''}
                  onChange={(e) => updateFormData({ company: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:border-purple-500 focus:outline-none"
                  placeholder="Your organization"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Your Role/Title</label>
                <input
                  type="text"
                  value={formData.role || ''}
                  onChange={(e) => updateFormData({ role: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:border-purple-500 focus:outline-none"
                  placeholder="CEO, Pastor, Director, etc."
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Primary Interest *</label>
              <select
                value={formData.primaryInterest || ''}
                onChange={(e) => updateFormData({ primaryInterest: e.target.value })}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:border-purple-500 focus:outline-none"
              >
                <option value="">Select your primary interest</option>
                <option value="divine_strategy">Divine Strategy Coaching</option>
                <option value="enterprise_ai">Enterprise AI Implementation</option>
                <option value="strategic_consulting">Strategic Business Consulting</option>
                <option value="ministry_support">Ministry & Spiritual Leadership</option>
                <option value="investment_opportunities">Investment Opportunities</option>
                <option value="speaking_engagement">Speaking Engagement</option>
                <option value="platform_tools">AI Platform & Tools</option>
              </select>
            </div>
          </div>
        )}

        {/* Step 2: Context & Challenges */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Current Context</h2>
              <p className="text-slate-300">Help us understand your situation and challenges.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Current Challenges (Select all that apply)</label>
              <div className="grid md:grid-cols-2 gap-3">
                {[
                  'Strategic clarity and direction',
                  'Leadership development',
                  'Technology and AI integration',
                  'Organizational transformation',
                  'Ministry effectiveness',
                  'Business growth and scaling',
                  'Team alignment and culture',
                  'Financial sustainability',
                  'Innovation and adaptation',
                  'Spiritual and business integration'
                ].map(challenge => (
                  <label key={challenge} className="flex items-center space-x-3 p-3 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.currentChallenges?.includes(challenge) || false}
                      onChange={(e) => handleMultiSelect('currentChallenges', challenge, e.target.checked)}
                      className="w-4 h-4 text-purple-500 bg-slate-600 border-slate-500 rounded focus:ring-purple-500"
                    />
                    <span className="text-slate-300 text-sm">{challenge}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Industry Context</label>
                <select
                  value={formData.industryContext || ''}
                  onChange={(e) => updateFormData({ industryContext: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                >
                  <option value="">Select industry context</option>
                  <option value="ministry">Ministry/Religious Organization</option>
                  <option value="nonprofit">Nonprofit/Social Impact</option>
                  <option value="technology">Technology/Software</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="education">Education</option>
                  <option value="finance">Finance/Investment</option>
                  <option value="consulting">Consulting/Professional Services</option>
                  <option value="manufacturing">Manufacturing</option>
                  <option value="retail">Retail/E-commerce</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Organization Size</label>
                <select
                  value={formData.organizationSize || ''}
                  onChange={(e) => updateFormData({ organizationSize: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                >
                  <option value="">Select organization size</option>
                  <option value="solo">Solo/Individual</option>
                  <option value="small">Small (2-10 people)</option>
                  <option value="medium">Medium (11-50 people)</option>
                  <option value="large">Large (51-200 people)</option>
                  <option value="enterprise">Enterprise (200+ people)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Services & Qualification */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Service Interests</h2>
              <p className="text-slate-300">What services are you most interested in exploring?</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Services of Interest (Select all that apply)</label>
              <div className="space-y-3">
                {[
                  { id: 'divine_strategy_coaching', label: 'Divine Strategy Coaching', desc: 'One-on-one strategic coaching combining spiritual intelligence with business frameworks' },
                  { id: 'enterprise_ai', label: 'Enterprise AI Implementation', desc: 'Catalyst AI platform implementation and custom AI solutions' },
                  { id: 'strategic_consulting', label: 'Strategic Business Consulting', desc: 'Organizational transformation and strategic planning' },
                  { id: 'speaking', label: 'Speaking Engagements', desc: 'Keynote speaking for conferences, workshops, and events' },
                  { id: 'ministry_partnership', label: 'Ministry Partnership', desc: 'TPC Ministries collaboration and prophetic ministry' },
                  { id: 'investment_fund', label: 'Investment Opportunities', desc: 'Perpetual Engine ecosystem investment participation' }
                ].map(service => (
                  <label key={service.id} className="flex items-start space-x-3 p-4 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.services_interested?.includes(service.id) || false}
                      onChange={(e) => handleMultiSelect('services_interested', service.id, e.target.checked)}
                      className="w-4 h-4 text-purple-500 bg-slate-600 border-slate-500 rounded focus:ring-purple-500 mt-1"
                    />
                    <div>
                      <div className="text-white font-medium">{service.label}</div>
                      <div className="text-slate-400 text-sm">{service.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Timeframe for Engagement</label>
                <select
                  value={formData.timeframe || ''}
                  onChange={(e) => updateFormData({ timeframe: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                >
                  <option value="">Select timeframe</option>
                  <option value="immediate">Immediate (Next 30 days)</option>
                  <option value="short_term">Short-term (1-3 months)</option>
                  <option value="medium_term">Medium-term (3-6 months)</option>
                  <option value="long_term">Long-term (6+ months)</option>
                  <option value="exploring">Just exploring options</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Budget Range</label>
                <select
                  value={formData.budget_range || ''}
                  onChange={(e) => updateFormData({ budget_range: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                >
                  <option value="">Select budget range</option>
                  <option value="under_5k">Under $5,000</option>
                  <option value="5k_to_25k">$5,000 - $25,000</option>
                  <option value="25k_to_50k">$25,000 - $50,000</option>
                  <option value="50k_to_100k">$50,000 - $100,000</option>
                  <option value="100k_plus">$100,000+</option>
                  <option value="undetermined">To be determined</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Decision & Communication */}
        {step === 4 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Decision Process</h2>
              <p className="text-slate-300">Help us understand your decision-making process.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Decision Authority</label>
              <select
                value={formData.decision_authority || ''}
                onChange={(e) => updateFormData({ decision_authority: e.target.value })}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:border-purple-500 focus:outline-none"
              >
                <option value="">Select your decision authority</option>
                <option value="sole_decision_maker">I make the final decision</option>
                <option value="strong_influence">I have strong influence in the decision</option>
                <option value="team_decision">Team/board decision required</option>
                <option value="recommender">I make recommendations to others</option>
                <option value="researcher">I'm researching for someone else</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Urgency Level</label>
              <select
                value={formData.urgency_level || ''}
                onChange={(e) => updateFormData({ urgency_level: e.target.value })}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:border-purple-500 focus:outline-none"
              >
                <option value="">How urgent is this need?</option>
                <option value="urgent">Urgent - need solution ASAP</option>
                <option value="important">Important - within next quarter</option>
                <option value="planning">Planning - for future implementation</option>
                <option value="exploratory">Exploratory - gathering information</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Previous Strategic Consulting Experience</label>
              <div className="space-y-3">
                <label className="flex items-center space-x-3 p-3 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors cursor-pointer">
                  <input
                    type="radio"
                    name="previous_consulting"
                    checked={formData.previous_consulting === true}
                    onChange={() => updateFormData({ previous_consulting: true })}
                    className="w-4 h-4 text-purple-500 bg-slate-600 border-slate-500"
                  />
                  <span className="text-slate-300">Yes, we've worked with strategic consultants before</span>
                </label>
                <label className="flex items-center space-x-3 p-3 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors cursor-pointer">
                  <input
                    type="radio"
                    name="previous_consulting"
                    checked={formData.previous_consulting === false}
                    onChange={() => updateFormData({ previous_consulting: false })}
                    className="w-4 h-4 text-purple-500 bg-slate-600 border-slate-500"
                  />
                  <span className="text-slate-300">No, this would be our first strategic consulting engagement</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Preferred Communication</label>
              <select
                value={formData.communication_preference || ''}
                onChange={(e) => updateFormData({ communication_preference: e.target.value })}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:border-purple-500 focus:outline-none"
              >
                <option value="">Select communication preference</option>
                <option value="video_call">Video call (Zoom/Teams)</option>
                <option value="phone_call">Phone call</option>
                <option value="in_person">In-person meeting (if location permits)</option>
                <option value="email_first">Email discussion first</option>
              </select>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6 border-t border-slate-700/30">
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="px-6 py-3 bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600/50 text-white rounded-lg transition-all"
            >
              Previous
            </button>
          )}

          <div className="ml-auto">
            {step < totalSteps ? (
              <button
                onClick={() => setStep(step + 1)}
                disabled={
                  (step === 1 && (!formData.name || !formData.email || !formData.primaryInterest)) ||
                  (step === 3 && !formData.timeframe)
                }
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-400 hover:to-blue-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all"
              >
                Next Step
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || !formData.decision_authority || !formData.urgency_level}
                className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Processing...
                  </>
                ) : (
                  'Get My Recommendations →'
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}