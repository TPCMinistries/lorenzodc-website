import { supabase } from "../../../lib/supabase/client";

export interface EmailEvent {
  user_id: string;
  event_type: 'assessment_completed' | 'upgrade_completed' | 'trial_started' | 'goal_set' | 'document_uploaded' | 'conversation_milestone' | 'nurturing_sequence' | 'lead_magnet_downloaded' | 'booking_confirmed';
  event_data: Record<string, any>;
  campaign_name?: string;
  immediate_send?: boolean;
}

export interface LeadData {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  referrer?: string;
  landing_page?: string;
  device_type?: 'desktop' | 'mobile' | 'tablet';
}

export class EmailAutomationService {

  // Trigger email automation for assessment completion
  static async triggerAssessmentCompleted(
    userId: string,
    assessmentType: 'personal' | 'enterprise',
    assessmentResults: any,
    leadScore: number = 0
  ): Promise<boolean> {
    try {
      const eventData = {
        assessment_type: assessmentType,
        results: assessmentResults,
        completion_date: new Date().toISOString(),
        lead_score: leadScore,
        trigger_reason: 'assessment_completion'
      };

      const campaign = assessmentType === 'enterprise' ? 'enterprise_assessment_followup' : 'personal_assessment_followup';

      const success = await this.triggerEmailEvent({
        user_id: userId,
        event_type: 'assessment_completed',
        event_data: eventData,
        campaign_name: campaign,
        immediate_send: true
      });

      // Update lead score based on assessment completion
      if (success) {
        await this.updateLeadScore(userId, assessmentType === 'enterprise' ? 25 : 15, 'assessment_completed');
      }

      return success;
    } catch (error) {
      console.error('Error triggering assessment completion email:', error);
      return false;
    }
  }

  // Trigger email automation for subscription upgrade
  static async triggerUpgradeCompleted(
    userId: string,
    fromTier: string,
    toTier: string,
    subscriptionValue: number
  ): Promise<boolean> {
    try {
      const eventData = {
        from_tier: fromTier,
        to_tier: toTier,
        subscription_value: subscriptionValue,
        upgrade_date: new Date().toISOString(),
        trigger_reason: 'subscription_upgrade'
      };

      const success = await this.triggerEmailEvent({
        user_id: userId,
        event_type: 'upgrade_completed',
        event_data: eventData,
        campaign_name: 'upgrade_welcome_sequence',
        immediate_send: true
      });

      // High lead score for paying customers
      if (success) {
        await this.updateLeadScore(userId, 50, 'subscription_upgrade');
        await this.trackSocialConversion(userId, 'purchase', subscriptionValue);
      }

      return success;
    } catch (error) {
      console.error('Error triggering upgrade completion email:', error);
      return false;
    }
  }

  // Trigger email automation for goal setting
  static async triggerGoalSet(
    userId: string,
    goals: any[]
  ): Promise<boolean> {
    try {
      const eventData = {
        goals: goals,
        goal_count: goals.length,
        set_date: new Date().toISOString(),
        trigger_reason: 'goal_setting'
      };

      const success = await this.triggerEmailEvent({
        user_id: userId,
        event_type: 'goal_set',
        event_data: eventData,
        campaign_name: 'goal_accountability_sequence',
        immediate_send: false // Send later for goal reminders
      });

      if (success) {
        await this.updateLeadScore(userId, 10, 'goal_setting');
      }

      return success;
    } catch (error) {
      console.error('Error triggering goal setting email:', error);
      return false;
    }
  }

  // Trigger nurturing sequence based on prospect profile
  static async triggerNurturingSequence(
    userId: string,
    prospectProfile: any
  ): Promise<boolean> {
    try {
      const sequenceName = this.getNurturingSequence(prospectProfile);

      const eventData = {
        prospect_category: prospectProfile.category,
        prospect_tier: prospectProfile.tier,
        lead_score: prospectProfile.leadScore,
        interests: prospectProfile.interests,
        trigger_date: new Date().toISOString()
      };

      const success = await this.triggerEmailEvent({
        user_id: userId,
        event_type: 'nurturing_sequence',
        event_data: eventData,
        campaign_name: sequenceName,
        immediate_send: true
      });

      return success;
    } catch (error) {
      console.error('Error triggering nurturing sequence:', error);
      return false;
    }
  }

  // Trigger lead magnet follow-up sequence
  static async triggerLeadMagnetSequence(
    userId: string,
    magnetType: string,
    prospectData: any
  ): Promise<boolean> {
    try {
      const eventData = {
        magnet_type: magnetType,
        download_date: new Date().toISOString(),
        prospect_category: prospectData.category,
        lead_score: prospectData.leadScore
      };

      const sequenceName = `lead_magnet_${magnetType}_followup`;

      const success = await this.triggerEmailEvent({
        user_id: userId,
        event_type: 'lead_magnet_downloaded',
        event_data: eventData,
        campaign_name: sequenceName,
        immediate_send: true
      });

      if (success) {
        await this.updateLeadScore(userId, 15, 'lead_magnet_download');
      }

      return success;
    } catch (error) {
      console.error('Error triggering lead magnet sequence:', error);
      return false;
    }
  }

  // Trigger booking confirmation and preparation sequence
  static async triggerBookingSequence(
    userId: string,
    callType: string,
    prospectProfile: any
  ): Promise<boolean> {
    try {
      const eventData = {
        call_type: callType,
        booking_date: new Date().toISOString(),
        prospect_tier: prospectProfile.tier,
        estimated_value: this.getEstimatedValue(callType, prospectProfile.tier)
      };

      const success = await this.triggerEmailEvent({
        user_id: userId,
        event_type: 'booking_confirmed',
        event_data: eventData,
        campaign_name: `booking_preparation_${callType}`,
        immediate_send: true
      });

      if (success) {
        await this.updateLeadScore(userId, 25, 'call_booked');
      }

      return success;
    } catch (error) {
      console.error('Error triggering booking sequence:', error);
      return false;
    }
  }

  // Get appropriate nurturing sequence based on prospect profile
  private static getNurturingSequence(profile: any): string {
    const { category, tier, leadScore } = profile;

    // High-value prospects get executive sequence
    if (tier === 'tier_1' || leadScore >= 40) {
      return 'executive_nurturing_sequence';
    }

    // Category-specific sequences
    switch (category) {
      case 'enterprise_ai':
        return 'enterprise_ai_nurturing_sequence';
      case 'ministry_coaching':
        return 'divine_strategy_nurturing_sequence';
      case 'investment_fund':
        return 'investment_opportunity_sequence';
      case 'strategic_consulting':
        return 'strategic_consulting_sequence';
      case 'speaking_engagement':
        return 'speaking_engagement_sequence';
      default:
        return 'general_nurturing_sequence';
    }
  }

  // Get estimated value for conversion tracking
  private static getEstimatedValue(callType: string, tier: string): number {
    const valueMatrix = {
      'executive_strategy': { 'tier_1': 100000, 'tier_2': 50000, 'tier_3': 25000, 'tier_4': 10000 },
      'divine_strategy': { 'tier_1': 50000, 'tier_2': 25000, 'tier_3': 10000, 'tier_4': 5000 },
      'ai_implementation': { 'tier_1': 75000, 'tier_2': 35000, 'tier_3': 15000, 'tier_4': 7500 },
      'general_discovery': { 'tier_1': 25000, 'tier_2': 10000, 'tier_3': 5000, 'tier_4': 2500 }
    };

    const matrix = valueMatrix[callType as keyof typeof valueMatrix];
    return matrix ? (matrix as any)[tier] || 0 : 0;
  }

  // Core function to trigger any email event
  static async triggerEmailEvent(event: EmailEvent): Promise<boolean> {
    try {
      const response = await fetch('/api/webhooks/email-automation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(event)
      });

      return response.ok;
    } catch (error) {
      console.error('Error triggering email event:', error);
      return false;
    }
  }

  // Track lead attribution data
  static async trackLeadAttribution(userId: string, leadData: LeadData): Promise<boolean> {
    try {
      const utmData = {
        utm_source: leadData.utm_source,
        utm_medium: leadData.utm_medium,
        utm_campaign: leadData.utm_campaign,
        utm_content: leadData.utm_content,
        utm_term: leadData.utm_term
      };

      const trafficData = {
        referrer: leadData.referrer,
        landing_page: leadData.landing_page,
        device_type: leadData.device_type,
        ip_address: '0.0.0.0', // Will be captured server-side
        user_agent: navigator.userAgent
      };

      const { data, error } = await supabase.rpc('track_lead_attribution', {
        user_id_param: userId,
        utm_data: utmData,
        traffic_data: trafficData
      });

      return !error;
    } catch (error) {
      console.error('Error tracking lead attribution:', error);
      return false;
    }
  }

  // Update lead score
  static async updateLeadScore(userId: string, scoreChange: number, reason: string): Promise<number | null> {
    try {
      const { data, error } = await supabase.rpc('update_lead_score', {
        user_id_param: userId,
        score_change: scoreChange,
        reason: reason
      });

      return error ? null : data;
    } catch (error) {
      console.error('Error updating lead score:', error);
      return null;
    }
  }

  // Track social media conversions
  static async trackSocialConversion(
    userId: string,
    eventType: 'signup' | 'assessment' | 'purchase' | 'lead',
    value: number = 0
  ): Promise<boolean> {
    try {
      // Track Facebook Pixel event
      if (typeof window !== 'undefined' && (window as any).fbq) {
        const fbEventName = this.getFacebookEventName(eventType);
        (window as any).fbq('track', fbEventName, {
          value: value,
          currency: 'USD',
          content_type: 'product',
          content_category: 'ai_coaching'
        });
      }

      // Track Google Analytics event
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', eventType, {
          event_category: 'conversion',
          event_label: 'catalyst_ai',
          value: value
        });
      }

      // Store in database for all platforms
      const platforms = ['facebook', 'google', 'linkedin'];
      const promises = platforms.map(platform =>
        supabase.rpc('track_social_conversion', {
          user_id_param: userId,
          platform_param: platform,
          event_type_param: eventType,
          event_value_param: value,
          metadata_param: {
            timestamp: new Date().toISOString(),
            source: 'web_app',
            user_agent: navigator.userAgent
          }
        })
      );

      await Promise.all(promises);
      return true;
    } catch (error) {
      console.error('Error tracking social conversion:', error);
      return false;
    }
  }

  // Helper to map event types to Facebook Pixel events
  private static getFacebookEventName(eventType: string): string {
    switch (eventType) {
      case 'signup': return 'CompleteRegistration';
      case 'assessment': return 'Lead';
      case 'purchase': return 'Purchase';
      case 'lead': return 'Lead';
      default: return 'CustomEvent';
    }
  }

  // Get user's email automation history
  static async getEmailHistory(userId: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('email_automation_events')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50);

      return error ? [] : data || [];
    } catch (error) {
      console.error('Error fetching email history:', error);
      return [];
    }
  }

  // Get lead attribution data
  static async getLeadAttribution(userId: string): Promise<any | null> {
    try {
      const { data, error } = await supabase
        .from('lead_attribution')
        .select('*')
        .eq('user_id', userId)
        .single();

      return error ? null : data;
    } catch (error) {
      console.error('Error fetching lead attribution:', error);
      return null;
    }
  }

  // Utility function to extract UTM parameters from URL
  static extractUtmParameters(): LeadData {
    if (typeof window === 'undefined') return {};

    const urlParams = new URLSearchParams(window.location.search);

    return {
      utm_source: urlParams.get('utm_source') || undefined,
      utm_medium: urlParams.get('utm_medium') || undefined,
      utm_campaign: urlParams.get('utm_campaign') || undefined,
      utm_content: urlParams.get('utm_content') || undefined,
      utm_term: urlParams.get('utm_term') || undefined,
      referrer: document.referrer || undefined,
      landing_page: window.location.href,
      device_type: this.getDeviceType()
    };
  }

  // Utility function to detect device type
  private static getDeviceType(): 'desktop' | 'mobile' | 'tablet' {
    if (typeof window === 'undefined') return 'desktop';

    const width = window.innerWidth;

    if (width <= 768) return 'mobile';
    if (width <= 1024) return 'tablet';
    return 'desktop';
  }

  // Initialize tracking for new users
  static async initializeUserTracking(userId: string): Promise<void> {
    try {
      // Track lead attribution from current session
      const leadData = this.extractUtmParameters();
      if (Object.keys(leadData).length > 0) {
        await this.trackLeadAttribution(userId, leadData);
      }

      // Track initial conversion event
      await this.trackSocialConversion(userId, 'signup', 0);

      // Trigger welcome email sequence
      await this.triggerEmailEvent({
        user_id: userId,
        event_type: 'trial_started',
        event_data: {
          signup_date: new Date().toISOString(),
          source: leadData.utm_source || 'organic',
          device_type: leadData.device_type || 'desktop'
        },
        campaign_name: 'welcome_sequence',
        immediate_send: true
      });

    } catch (error) {
      console.error('Error initializing user tracking:', error);
    }
  }
}