'use client';

import { useState, useEffect } from 'react';
import { LeadQualificationService, ProspectProfile } from '../lib/services/lead-qualification';
import { ConversionTrackingService } from '../lib/services/conversion-tracking';
import { SupabaseProspectService } from '../lib/supabase/prospect-service';
import { EmailAutomationService } from '../lib/services/email-automation';

interface SmartBookingSystemProps {
  assessmentData?: any;
  pageHistory?: string[];
  formData?: any;
  source?: string;
  className?: string;
}

export default function SmartBookingSystem({
  assessmentData,
  pageHistory = [],
  formData,
  source = 'smart_booking',
  className = ''
}: SmartBookingSystemProps) {
  const [profile, setProfile] = useState<ProspectProfile | null>(null);
  const [isQualifying, setIsQualifying] = useState(true);
  const [showPreparation, setShowPreparation] = useState(false);

  useEffect(() => {
    qualifyProspect();
  }, [assessmentData, pageHistory, formData]);

  const qualifyProspect = () => {
    setIsQualifying(true);

    // Gather UTM data
    const utmData = typeof window !== 'undefined' ? {
      source: new URLSearchParams(window.location.search).get('utm_source'),
      medium: new URLSearchParams(window.location.search).get('utm_medium'),
      campaign: new URLSearchParams(window.location.search).get('utm_campaign'),
      content: new URLSearchParams(window.location.search).get('utm_content'),
      term: new URLSearchParams(window.location.search).get('utm_term')
    } : {};

    // Get page views from current session
    const currentPageViews = typeof window !== 'undefined'
      ? [...pageHistory, window.location.pathname]
      : pageHistory;

    // Qualify the prospect
    const qualifiedProfile = LeadQualificationService.qualifyProspect({
      assessmentResponses: assessmentData,
      pageViews: currentPageViews,
      formData,
      utmData
    });

    setProfile(qualifiedProfile);
    setIsQualifying(false);

    // Store the profile
    LeadQualificationService.storeProspectProfile(qualifiedProfile);
  };

  const handleBooking = async (callType: string) => {
    if (!profile) return;

    const recommendation = LeadQualificationService.getBookingRecommendation(profile);
    const trackingUrl = LeadQualificationService.generateTrackingUrl(
      recommendation.calendlyUrl,
      profile,
      source
    );

    // Record booking in Supabase
    await SupabaseProspectService.recordBooking(
      profile.id,
      callType,
      recommendation.calendlyUrl,
      recommendation.estimatedValue
    );

    // Trigger booking preparation email sequence
    await EmailAutomationService.triggerBookingSequence(
      profile.id,
      callType,
      {
        ...profile,
        booking_date: new Date().toISOString(),
        estimated_value: recommendation.estimatedValue,
        calendly_url: recommendation.calendlyUrl
      }
    );

    // Track conversion event
    ConversionTrackingService.trackLead(
      profile.id,
      profile.leadScore,
      source,
      {
        call_type: callType,
        prospect_category: profile.category,
        prospect_tier: profile.tier,
        estimated_value: recommendation.estimatedValue
      }
    );

    // Open Calendly in new window
    window.open(trackingUrl, '_blank');
  };

  const getRecommendationContent = () => {
    if (!profile) return null;

    const recommendation = LeadQualificationService.getBookingRecommendation(profile);

    const callTypeLabels = {
      'executive_strategy': 'Executive Strategy Session',
      'divine_strategy': 'Divine Strategy Session',
      'ai_implementation': 'AI Implementation Assessment',
      'general_discovery': 'Strategic Discovery Call'
    };

    const callTypeDescriptions = {
      'executive_strategy': 'For senior leaders seeking to integrate divine strategy with enterprise transformation. Deep dive into kingdom-aligned business strategy and implementation.',
      'divine_strategy': 'For ministry leaders and entrepreneurs called to bridge prophetic intelligence with systematic implementation for breakthrough results.',
      'ai_implementation': 'For organizations ready to implement AI solutions with strategic precision. Technical assessment and implementation roadmap included.',
      'general_discovery': 'Strategic consultation to explore how divine strategy can create breakthrough in your specific context and challenges.'
    };

    const tierBadges = {
      'tier_1': { label: 'Priority Access', color: 'from-amber-500 to-orange-500', icon: '👑' },
      'tier_2': { label: 'Strategic Focus', color: 'from-purple-500 to-indigo-500', icon: '⚡' },
      'tier_3': { label: 'Growth Path', color: 'from-emerald-500 to-teal-500', icon: '🌱' },
      'tier_4': { label: 'Foundation', color: 'from-blue-500 to-cyan-500', icon: '🎯' }
    };

    const tierBadge = tierBadges[profile.tier];

    return {
      recommendation,
      callTypeLabel: callTypeLabels[recommendation.callType],
      description: callTypeDescriptions[recommendation.callType],
      tierBadge
    };
  };

  if (isQualifying) {
    return (
      <div className={`bg-slate-800/30 backdrop-blur-xl border border-slate-700/30 rounded-2xl p-6 ${className}`}>
        <div className="flex items-center justify-center space-x-3">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-400"></div>
          <span className="text-white">Analyzing your profile for optimal booking...</span>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className={`bg-slate-800/30 backdrop-blur-xl border border-slate-700/30 rounded-2xl p-6 ${className}`}>
        <p className="text-slate-300">Unable to determine optimal booking. Please try again or use general contact.</p>
      </div>
    );
  }

  const content = getRecommendationContent();
  if (!content) return null;

  const { recommendation, callTypeLabel, description, tierBadge } = content;

  return (
    <div className={`bg-slate-800/30 backdrop-blur-xl border border-slate-700/30 rounded-2xl p-6 ${className}`}>
      {/* Tier Badge */}
      <div className="flex items-center justify-between mb-4">
        <div className={`inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r ${tierBadge.color} rounded-full text-white text-sm font-medium`}>
          <span>{tierBadge.icon}</span>
          <span>{tierBadge.label}</span>
        </div>
        <div className="text-slate-400 text-sm">
          Lead Score: <span className="text-white font-semibold">{profile.leadScore}</span>
        </div>
      </div>

      {/* Recommended Call Type */}
      <div className="mb-6">
        <h3 className="text-xl font-bold text-white mb-2">Recommended Session</h3>
        <h4 className="text-lg font-semibold text-purple-400 mb-3">{callTypeLabel}</h4>
        <p className="text-slate-300 leading-relaxed">{description}</p>
      </div>

      {/* Estimated Value & Priority */}
      {recommendation.estimatedValue > 0 && (
        <div className="bg-slate-700/30 rounded-xl p-4 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-sm text-slate-400">Estimated Engagement Value</div>
              <div className="text-lg font-bold text-emerald-400">
                ${recommendation.estimatedValue.toLocaleString()}+
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-slate-400">Priority Level</div>
              <div className={`font-semibold capitalize ${
                recommendation.priority === 'high' ? 'text-red-400' :
                recommendation.priority === 'medium' ? 'text-amber-400' : 'text-blue-400'
              }`}>
                {recommendation.priority}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-3">
        <button
          onClick={() => handleBooking(recommendation.callType)}
          className={`w-full py-4 px-6 bg-gradient-to-r ${
            recommendation.priority === 'high'
              ? 'from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400'
              : recommendation.priority === 'medium'
              ? 'from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400'
              : 'from-blue-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400'
          } text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg`}
        >
          Book {callTypeLabel} →
        </button>

        <button
          onClick={() => setShowPreparation(!showPreparation)}
          className="w-full py-3 px-6 bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600/50 text-white rounded-xl transition-all duration-300"
        >
          {showPreparation ? 'Hide' : 'View'} Preparation Guide
        </button>

        {/* Alternative Options */}
        <div className="border-t border-slate-700/30 pt-4">
          <p className="text-slate-400 text-sm mb-3">Need a different session type?</p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleBooking('general_discovery')}
              className="py-2 px-4 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-600/30 text-slate-300 text-sm rounded-lg transition-all"
            >
              General Discovery
            </button>
            <button
              onClick={() => window.open('mailto:lorenzo@lorenzodaughtrychambers.com', '_blank')}
              className="py-2 px-4 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-600/30 text-slate-300 text-sm rounded-lg transition-all"
            >
              Direct Email
            </button>
          </div>
        </div>
      </div>

      {/* Preparation Guide */}
      {showPreparation && (
        <div className="mt-6 bg-slate-700/20 rounded-xl p-4 border border-slate-600/30">
          <h4 className="font-semibold text-white mb-3">Session Preparation</h4>

          {(() => {
            const guide = LeadQualificationService.getPreparationGuide(recommendation.callType);
            return (
              <div className="space-y-4">
                <div>
                  <h5 className="text-sm font-medium text-slate-400 mb-2">Before our session:</h5>
                  <ul className="space-y-1">
                    {guide.content.map((item, index) => (
                      <li key={index} className="text-sm text-slate-300 flex items-start gap-2">
                        <span className="text-purple-400 mt-1">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h5 className="text-sm font-medium text-slate-400 mb-2">Questions to consider:</h5>
                  <ul className="space-y-1">
                    {guide.questions.map((question, index) => (
                      <li key={index} className="text-sm text-slate-300 flex items-start gap-2">
                        <span className="text-emerald-400 mt-1">?</span>
                        <span>{question}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Profile Debug Info (only in development) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-4 p-3 bg-slate-900/50 rounded-lg text-xs">
          <details>
            <summary className="text-slate-400 cursor-pointer">Debug: Profile Data</summary>
            <pre className="text-slate-300 mt-2 overflow-auto">
              {JSON.stringify({
                category: profile.category,
                tier: profile.tier,
                leadScore: profile.leadScore,
                interests: profile.interests,
                source: profile.source
              }, null, 2)}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
}