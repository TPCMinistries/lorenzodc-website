'use client';

export interface ConversionEvent {
  event: string;
  value?: number;
  currency?: string;
  content_type?: string;
  content_category?: string;
  user_id?: string;
  metadata?: Record<string, any>;
}

export class ConversionTrackingService {

  // Track Facebook Pixel events
  static trackFacebookEvent(eventName: string, parameters: Partial<ConversionEvent> = {}): void {
    if (typeof window === 'undefined' || !(window as any).fbq) return;

    try {
      const fbEventData = {
        value: parameters.value || 0,
        currency: parameters.currency || 'USD',
        content_type: parameters.content_type || 'product',
        content_category: parameters.content_category || 'ai_coaching',
        custom_data: {
          user_id: parameters.user_id,
          timestamp: new Date().toISOString(),
          ...parameters.metadata
        }
      };

      (window as any).fbq('track', eventName, fbEventData);
      console.log(`Facebook Pixel: ${eventName}`, fbEventData);
    } catch (error) {
      console.error('Facebook Pixel tracking error:', error);
    }
  }

  // Track Google Analytics events
  static trackGoogleEvent(action: string, parameters: Partial<ConversionEvent> = {}): void {
    if (typeof window === 'undefined' || !(window as any).gtag) return;

    try {
      const gaEventData = {
        event_category: 'conversion',
        event_label: 'catalyst_ai',
        value: parameters.value || 0,
        currency: parameters.currency || 'USD',
        user_id: parameters.user_id,
        custom_parameters: {
          content_type: parameters.content_type,
          content_category: parameters.content_category,
          timestamp: new Date().toISOString(),
          ...parameters.metadata
        }
      };

      (window as any).gtag('event', action, gaEventData);
      console.log(`Google Analytics: ${action}`, gaEventData);
    } catch (error) {
      console.error('Google Analytics tracking error:', error);
    }
  }

  // Track LinkedIn Insight events
  static trackLinkedInEvent(eventType: string, parameters: Partial<ConversionEvent> = {}): void {
    if (typeof window === 'undefined' || !(window as any).lintrk) return;

    try {
      const linkedInEventData = {
        conversion_id: this.getLinkedInConversionId(eventType),
        conversion_value: parameters.value,
        currency: parameters.currency || 'USD',
        custom_data: {
          user_id: parameters.user_id,
          content_type: parameters.content_type,
          timestamp: new Date().toISOString(),
          ...parameters.metadata
        }
      };

      (window as any).lintrk('track', linkedInEventData);
      console.log(`LinkedIn Insight: ${eventType}`, linkedInEventData);
    } catch (error) {
      console.error('LinkedIn Insight tracking error:', error);
    }
  }

  // Helper to map event types to platform-specific events
  private static getLinkedInConversionId(eventType: string): number {
    // These should be configured in your LinkedIn Campaign Manager
    const conversionMap: Record<string, number> = {
      'signup': 12345678, // Replace with actual conversion IDs
      'assessment': 12345679,
      'purchase': 12345680,
      'lead': 12345681
    };

    return conversionMap[eventType] || 12345678;
  }

  private static getFacebookEventName(eventType: string): string {
    switch (eventType) {
      case 'signup': return 'CompleteRegistration';
      case 'assessment': return 'Lead';
      case 'purchase': return 'Purchase';
      case 'lead': return 'Lead';
      case 'add_to_cart': return 'AddToCart';
      case 'initiate_checkout': return 'InitiateCheckout';
      case 'view_content': return 'ViewContent';
      default: return 'CustomEvent';
    }
  }

  private static getGoogleEventName(eventType: string): string {
    switch (eventType) {
      case 'signup': return 'sign_up';
      case 'assessment': return 'generate_lead';
      case 'purchase': return 'purchase';
      case 'lead': return 'generate_lead';
      case 'add_to_cart': return 'add_to_cart';
      case 'initiate_checkout': return 'begin_checkout';
      case 'view_content': return 'page_view';
      default: return 'custom_conversion';
    }
  }

  // Unified tracking method that sends to all platforms
  static trackConversion(
    eventType: string,
    parameters: Partial<ConversionEvent> = {}
  ): void {
    // Track on Facebook Pixel
    const fbEventName = this.getFacebookEventName(eventType);
    this.trackFacebookEvent(fbEventName, parameters);

    // Track on Google Analytics
    const gaEventName = this.getGoogleEventName(eventType);
    this.trackGoogleEvent(gaEventName, parameters);

    // Track on LinkedIn
    this.trackLinkedInEvent(eventType, parameters);
  }

  // Specific conversion tracking methods
  static trackSignup(userId?: string, metadata?: Record<string, any>): void {
    this.trackConversion('signup', {
      event: 'signup',
      value: 0,
      content_type: 'registration',
      content_category: 'ai_coaching',
      user_id: userId,
      metadata: {
        signup_method: 'email',
        source: 'web_app',
        ...metadata
      }
    });
  }

  static trackAssessmentComplete(
    userId?: string,
    assessmentType?: string,
    leadScore?: number,
    metadata?: Record<string, any>
  ): void {
    this.trackConversion('assessment', {
      event: 'assessment_completed',
      value: leadScore || 0,
      content_type: 'assessment',
      content_category: 'ai_coaching',
      user_id: userId,
      metadata: {
        assessment_type: assessmentType,
        lead_score: leadScore,
        completion_date: new Date().toISOString(),
        ...metadata
      }
    });
  }

  static trackPurchase(
    userId?: string,
    value?: number,
    subscriptionTier?: string,
    metadata?: Record<string, any>
  ): void {
    this.trackConversion('purchase', {
      event: 'subscription_purchase',
      value: value || 0,
      currency: 'USD',
      content_type: 'subscription',
      content_category: 'ai_coaching',
      user_id: userId,
      metadata: {
        subscription_tier: subscriptionTier,
        billing_cycle: 'monthly',
        purchase_date: new Date().toISOString(),
        ...metadata
      }
    });
  }

  static trackLead(
    userId?: string,
    leadScore?: number,
    source?: string,
    metadata?: Record<string, any>
  ): void {
    this.trackConversion('lead', {
      event: 'lead_generated',
      value: leadScore || 0,
      content_type: 'lead',
      content_category: 'ai_coaching',
      user_id: userId,
      metadata: {
        lead_source: source,
        lead_score: leadScore,
        generated_date: new Date().toISOString(),
        ...metadata
      }
    });
  }

  static trackPageView(
    page: string,
    userId?: string,
    metadata?: Record<string, any>
  ): void {
    this.trackConversion('view_content', {
      event: 'page_view',
      value: 0,
      content_type: 'page',
      content_category: 'ai_coaching',
      user_id: userId,
      metadata: {
        page_title: document?.title,
        page_url: window?.location.href,
        page_path: page,
        timestamp: new Date().toISOString(),
        ...metadata
      }
    });
  }

  // Enhanced purchase tracking for different subscription tiers
  static trackSubscriptionUpgrade(
    userId?: string,
    fromTier?: string,
    toTier?: string,
    value?: number,
    metadata?: Record<string, any>
  ): void {
    this.trackPurchase(userId, value, toTier, {
      upgrade_type: 'subscription_upgrade',
      from_tier: fromTier,
      to_tier: toTier,
      upgrade_date: new Date().toISOString(),
      ...metadata
    });
  }

  // Track goal setting for accountability sequences
  static trackGoalSet(
    userId?: string,
    goalCount?: number,
    goalTypes?: string[],
    metadata?: Record<string, any>
  ): void {
    this.trackConversion('lead', {
      event: 'goal_setting',
      value: (goalCount || 0) * 5, // Value each goal at 5 points
      content_type: 'goal',
      content_category: 'ai_coaching',
      user_id: userId,
      metadata: {
        goal_count: goalCount,
        goal_types: goalTypes,
        set_date: new Date().toISOString(),
        ...metadata
      }
    });
  }
}