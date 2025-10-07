'use client';

import { SupabaseProspectService } from '../supabase/prospect-service';

export interface ProspectProfile {
  id: string;
  email?: string;
  name?: string;
  company?: string;
  role?: string;
  leadScore: number;
  category: ProspectCategory;
  tier: ProspectTier;
  interests: string[];
  assessmentData?: any;
  source: string;
  utm_data?: {
    source?: string;
    medium?: string;
    campaign?: string;
    content?: string;
    term?: string;
  };
  createdAt: Date;
  lastEngagement: Date;
  status: 'new' | 'qualified' | 'contacted' | 'nurturing' | 'opportunity' | 'closed';
}

export type ProspectCategory =
  | 'enterprise_ai'
  | 'ministry_coaching'
  | 'investment_fund'
  | 'strategic_consulting'
  | 'speaking_engagement'
  | 'platform_user'
  | 'undetermined';

export type ProspectTier = 'tier_1' | 'tier_2' | 'tier_3' | 'tier_4';

export interface BookingRecommendation {
  callType: 'executive_strategy' | 'divine_strategy' | 'ai_implementation' | 'general_discovery';
  calendlyUrl: string;
  preparationGuide: string;
  priority: 'high' | 'medium' | 'standard';
  estimatedValue: number;
}

export class LeadQualificationService {

  // Qualify and categorize prospect based on available data
  static qualifyProspect(data: {
    assessmentResponses?: any;
    pageViews?: string[];
    downloads?: string[];
    formData?: any;
    companyInfo?: any;
    utmData?: any;
  }): ProspectProfile {

    const profile: Partial<ProspectProfile> = {
      id: this.generateProspectId(),
      leadScore: 0,
      interests: [],
      source: data.utmData?.source || 'organic',
      utm_data: data.utmData,
      createdAt: new Date(),
      lastEngagement: new Date(),
      status: 'new'
    };

    // Score and categorize based on assessment responses
    if (data.assessmentResponses) {
      profile.assessmentData = data.assessmentResponses;

      if (data.assessmentResponses.type === 'enterprise') {
        profile.leadScore = (profile.leadScore || 0) + 25;
        profile.category = 'enterprise_ai';
        profile.interests = profile.interests || [];
        profile.interests.push('ai_implementation', 'enterprise_transformation');

        // Additional scoring for enterprise indicators
        const aiReadinessScore = this.calculateAIReadinessScore(data.assessmentResponses);
        profile.leadScore = (profile.leadScore || 0) + aiReadinessScore;

      } else if (data.assessmentResponses.type === 'personal') {
        profile.leadScore = (profile.leadScore || 0) + 15;
        profile.category = 'ministry_coaching';
        profile.interests = profile.interests || [];
        profile.interests.push('divine_strategy', 'personal_development');
      }
    }

    // Score based on page engagement patterns
    if (data.pageViews) {
      const pageEngagement = this.analyzePageEngagement(data.pageViews);
      profile.leadScore = (profile.leadScore || 0) + pageEngagement.score;
      profile.category = profile.category || pageEngagement.suggestedCategory;
      profile.interests = profile.interests || [];
      profile.interests.push(...pageEngagement.interests);
    }

    // Score based on form data and company information
    if (data.formData || data.companyInfo) {
      const formScore = this.scoreFormData(data.formData, data.companyInfo);
      profile.leadScore = (profile.leadScore || 0) + formScore.score;
      if (formScore.category && !profile.category) {
        profile.category = formScore.category;
      }
    }

    // Assign tier based on total score and category
    profile.tier = this.assignTier(profile.leadScore || 0, profile.category || 'undetermined');

    // Set final category if still undetermined
    if (!profile.category) {
      profile.category = 'undetermined';
    }

    return profile as ProspectProfile;
  }

  // Calculate AI readiness score from enterprise assessment
  private static calculateAIReadinessScore(responses: any): number {
    let score = 0;

    // Weight different aspects of AI readiness
    if (responses.ai_familiarity >= 3) score += 10;
    if (responses.data_readiness >= 3) score += 8;
    if (responses.process_documentation >= 3) score += 6;
    if (responses.change_capability >= 3) score += 8;
    if (responses.budget_authority >= 3) score += 12;

    return Math.min(score, 30); // Cap at 30 points
  }

  // Analyze page engagement to determine interests and category
  private static analyzePageEngagement(pageViews: string[]): {
    score: number;
    suggestedCategory: ProspectCategory;
    interests: string[];
  } {
    let score = 0;
    const interests: string[] = [];
    const categoryWeights: Record<ProspectCategory, number> = {
      enterprise_ai: 0,
      ministry_coaching: 0,
      investment_fund: 0,
      strategic_consulting: 0,
      speaking_engagement: 0,
      platform_user: 0,
      undetermined: 0
    };

    pageViews.forEach(page => {
      // Enterprise AI indicators
      if (page.includes('/enterprise') || page.includes('/catalyst') || page.includes('/ai-assessment')) {
        categoryWeights.enterprise_ai += 3;
        interests.push('ai_implementation');
        score += 5;
      }

      // Ministry/Coaching indicators
      if (page.includes('/ministry') || page.includes('/divine-strategy') || page.includes('/lorenzo')) {
        categoryWeights.ministry_coaching += 3;
        interests.push('divine_strategy', 'spiritual_intelligence');
        score += 4;
      }

      // Investment indicators
      if (page.includes('/investment') || page.includes('/perpetual-engine')) {
        categoryWeights.investment_fund += 4;
        interests.push('impact_investing', 'kingdom_economics');
        score += 8;
      }

      // Speaking indicators
      if (page.includes('/speaking') || page.includes('/connect')) {
        categoryWeights.speaking_engagement += 2;
        interests.push('speaking_engagement');
        score += 3;
      }

      // Platform usage indicators
      if (page.includes('/chat') || page.includes('/assessment') || page.includes('/documents')) {
        categoryWeights.platform_user += 1;
        interests.push('platform_usage');
        score += 2;
      }
    });

    // Determine suggested category based on highest weight
    const suggestedCategory = Object.entries(categoryWeights).reduce((a, b) =>
      categoryWeights[a[0] as ProspectCategory] > categoryWeights[b[0] as ProspectCategory] ? a : b
    )[0] as ProspectCategory;

    return {
      score: Math.min(score, 25), // Cap engagement score
      suggestedCategory,
      interests: [...new Set(interests)] // Remove duplicates
    };
  }

  // Score form data and company information
  private static scoreFormData(formData?: any, companyInfo?: any): {
    score: number;
    category?: ProspectCategory;
  } {
    let score = 0;
    let category: ProspectCategory | undefined;

    if (formData) {
      // Executive/leadership indicators
      if (formData.role && ['ceo', 'cto', 'president', 'founder', 'executive'].some(title =>
        formData.role.toLowerCase().includes(title))) {
        score += 15;
      }

      // Ministry leadership indicators
      if (formData.role && ['pastor', 'minister', 'missionary', 'chaplain'].some(title =>
        formData.role.toLowerCase().includes(title))) {
        score += 10;
        category = 'ministry_coaching';
      }

      // Company size indicators
      if (companyInfo?.employees > 100) score += 10;
      if (companyInfo?.revenue > 10000000) score += 15; // $10M+ revenue
    }

    return { score, category };
  }

  // Assign tier based on lead score and category
  private static assignTier(leadScore: number, category: ProspectCategory): ProspectTier {
    // Investment fund prospects are automatically Tier 1
    if (category === 'investment_fund' && leadScore >= 20) return 'tier_1';

    // Enterprise prospects with high AI readiness
    if (category === 'enterprise_ai' && leadScore >= 35) return 'tier_1';
    if (category === 'enterprise_ai' && leadScore >= 25) return 'tier_2';

    // High-value ministry/coaching prospects
    if (category === 'ministry_coaching' && leadScore >= 30) return 'tier_2';
    if (category === 'ministry_coaching' && leadScore >= 20) return 'tier_3';

    // Strategic consulting prospects
    if (category === 'strategic_consulting' && leadScore >= 25) return 'tier_2';

    // General scoring tiers
    if (leadScore >= 40) return 'tier_1';
    if (leadScore >= 25) return 'tier_2';
    if (leadScore >= 15) return 'tier_3';

    return 'tier_4';
  }

  // Get booking recommendation based on prospect profile
  static getBookingRecommendation(profile: ProspectProfile): BookingRecommendation {
    let callType: BookingRecommendation['callType'] = 'general_discovery';
    let calendlyUrl = 'https://calendly.com/lorenzo-theglobalenterprise/discovery-call';
    let preparationGuide = 'general-discovery-prep';
    let priority: BookingRecommendation['priority'] = 'standard';
    let estimatedValue = 0;

    // Determine call type and URL based on category and tier
    if (profile.category === 'investment_fund' || (profile.tier === 'tier_1' && profile.leadScore >= 40)) {
      callType = 'executive_strategy';
      calendlyUrl = 'https://calendly.com/lorenzo-theglobalenterprise/executive-strategy-session';
      preparationGuide = 'executive-strategy-prep';
      priority = 'high';
      estimatedValue = 100000; // $100K+

    } else if (profile.category === 'ministry_coaching' || profile.interests.includes('divine_strategy')) {
      callType = 'divine_strategy';
      calendlyUrl = 'https://calendly.com/lorenzo-theglobalenterprise/divine-strategy-session';
      preparationGuide = 'divine-strategy-prep';
      priority = profile.tier === 'tier_2' ? 'high' : 'medium';
      estimatedValue = profile.tier === 'tier_2' ? 25000 : 5000;

    } else if (profile.category === 'enterprise_ai' && profile.leadScore >= 25) {
      callType = 'ai_implementation';
      calendlyUrl = 'https://calendly.com/lorenzo-theglobalenterprise/ai-implementation-assessment';
      preparationGuide = 'ai-implementation-prep';
      priority = profile.tier === 'tier_1' ? 'high' : 'medium';
      estimatedValue = profile.tier === 'tier_1' ? 75000 : 25000;
    }

    return {
      callType,
      calendlyUrl,
      preparationGuide,
      priority,
      estimatedValue
    };
  }

  // Generate tracking-enabled Calendly URL with UTM parameters
  static generateTrackingUrl(
    baseUrl: string,
    profile: ProspectProfile,
    source: string = 'qualification_system'
  ): string {
    const params = new URLSearchParams({
      utm_source: source,
      utm_medium: 'qualification',
      utm_campaign: profile.category,
      utm_content: profile.tier,
      lead_score: profile.leadScore.toString(),
      prospect_id: profile.id
    });

    return `${baseUrl}?${params.toString()}`;
  }

  // Get preparation guide content based on call type
  static getPreparationGuide(callType: string): {
    title: string;
    content: string[];
    questions: string[];
  } {
    const guides = {
      'executive_strategy': {
        title: 'Executive Strategy Session Preparation',
        content: [
          'Review your organization\'s strategic priorities for the next 12-24 months',
          'Identify 2-3 key challenges where divine strategy could provide breakthrough',
          'Consider your role in advancing kingdom purposes through your position',
          'Prepare questions about integrating spiritual intelligence with business strategy'
        ],
        questions: [
          'What are your top 3 strategic priorities this year?',
          'Where do you feel most called to create kingdom impact?',
          'What challenges are you facing that traditional consulting hasn\'t solved?',
          'How do you currently integrate faith and business strategy?'
        ]
      },
      'divine_strategy': {
        title: 'Divine Strategy Session Preparation',
        content: [
          'Reflect on your current life/ministry vision and areas needing breakthrough',
          'Consider where you feel spiritually called but lack clear implementation strategy',
          'Think about your leadership context and transformation opportunities',
          'Prepare to discuss both spiritual insights and practical implementation needs'
        ],
        questions: [
          'What is your current divine assignment or calling?',
          'Where do you feel stuck between spiritual vision and practical implementation?',
          'What leadership challenges are you facing in your current context?',
          'How do you want to grow in prophetic and strategic intelligence?'
        ]
      },
      'ai_implementation': {
        title: 'AI Implementation Assessment Preparation',
        content: [
          'Review your organization\'s current technology infrastructure and data systems',
          'Identify specific business processes that could benefit from AI enhancement',
          'Consider your team\'s current AI knowledge and change management capabilities',
          'Prepare questions about ROI expectations and implementation timelines'
        ],
        questions: [
          'What specific business processes do you want to enhance with AI?',
          'What is your current data infrastructure and integration capabilities?',
          'How does your team currently handle technology adoption and change?',
          'What are your budget parameters and expected ROI timeline?'
        ]
      },
      'general_discovery': {
        title: 'Discovery Call Preparation',
        content: [
          'Consider your primary goals and challenges in your current context',
          'Think about areas where you need strategic breakthrough or divine guidance',
          'Reflect on your leadership role and transformation opportunities',
          'Prepare specific questions about how Lorenzo\'s approach might help your situation'
        ],
        questions: [
          'What brings you to seek strategic counsel at this time?',
          'What are your most pressing challenges or opportunities?',
          'How do you typically approach major decisions or strategic planning?',
          'What outcomes would make this conversation valuable for you?'
        ]
      }
    };

    return guides[callType as keyof typeof guides] || guides['general_discovery'];
  }

  // Generate unique prospect ID
  private static generateProspectId(): string {
    return 'prospect_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  // Store prospect profile in Supabase
  static async storeProspectProfile(profile: ProspectProfile): Promise<boolean> {
    try {
      const { data, error } = await SupabaseProspectService.upsertProspect(profile);

      if (error) {
        console.error('Error storing prospect profile:', error);
        return false;
      }

      console.log('Prospect profile stored:', data);
      return true;
    } catch (error) {
      console.error('Error storing prospect profile:', error);
      return false;
    }
  }

  // Retrieve prospect profiles from Supabase
  static async getProspectProfiles(filters?: {
    category?: ProspectCategory;
    tier?: ProspectTier;
    status?: string;
  }): Promise<ProspectProfile[]> {
    try {
      const supabaseFilters: any = {};

      if (filters?.category) supabaseFilters.category = filters.category;
      if (filters?.tier) supabaseFilters.tier = filters.tier;
      if (filters?.status) supabaseFilters.status = filters.status;

      const { data, error } = await SupabaseProspectService.getProspects(supabaseFilters);

      if (error) {
        console.error('Error retrieving prospect profiles:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error retrieving prospect profiles:', error);
      return [];
    }
  }
}