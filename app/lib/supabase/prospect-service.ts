import { supabase } from './client';
import { ProspectProfile } from '../services/lead-qualification';

export class SupabaseProspectService {

  // Store or update prospect profile
  static async upsertProspect(profile: ProspectProfile): Promise<{ data: any; error: any }> {
    try {
      // First, try to find existing prospect by email
      if (profile.email) {
        const { data: existing } = await supabase
          .from('prospect_profiles')
          .select('id')
          .eq('email', profile.email)
          .single();

        if (existing) {
          // Update existing prospect
          const { data, error } = await supabase
            .from('prospect_profiles')
            .update({
              name: profile.name,
              company: profile.company,
              role: profile.role,
              lead_score: profile.leadScore,
              category: profile.category,
              tier: profile.tier,
              interests: profile.interests,
              source: profile.source,
              utm_source: profile.utm_data?.source,
              utm_medium: profile.utm_data?.medium,
              utm_campaign: profile.utm_data?.campaign,
              utm_content: profile.utm_data?.content,
              utm_term: profile.utm_data?.term,
              assessment_data: profile.assessmentData,
              status: profile.status,
              last_engagement_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            })
            .eq('id', existing.id)
            .select()
            .single();

          return { data, error };
        }
      }

      // Create new prospect
      const { data, error } = await supabase
        .from('prospect_profiles')
        .insert({
          id: profile.id,
          email: profile.email,
          name: profile.name,
          company: profile.company,
          role: profile.role,
          lead_score: profile.leadScore,
          category: profile.category,
          tier: profile.tier,
          interests: profile.interests,
          source: profile.source,
          utm_source: profile.utm_data?.source,
          utm_medium: profile.utm_data?.medium,
          utm_campaign: profile.utm_data?.campaign,
          utm_content: profile.utm_data?.content,
          utm_term: profile.utm_data?.term,
          assessment_data: profile.assessmentData,
          status: profile.status || 'new',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          last_engagement_at: new Date().toISOString()
        })
        .select()
        .single();

      return { data, error };

    } catch (error) {
      console.error('Error upserting prospect:', error);
      return { data: null, error };
    }
  }

  // Get prospect by ID
  static async getProspect(id: string): Promise<{ data: any; error: any }> {
    try {
      const { data, error } = await supabase
        .from('prospect_profiles')
        .select('*')
        .eq('id', id)
        .single();

      return { data, error };
    } catch (error) {
      console.error('Error getting prospect:', error);
      return { data: null, error };
    }
  }

  // Get prospect by email
  static async getProspectByEmail(email: string): Promise<{ data: any; error: any }> {
    try {
      const { data, error } = await supabase
        .from('prospect_profiles')
        .select('*')
        .eq('email', email)
        .single();

      return { data, error };
    } catch (error) {
      console.error('Error getting prospect by email:', error);
      return { data: null, error };
    }
  }

  // Get prospects with filters
  static async getProspects(filters: {
    category?: string;
    tier?: string;
    status?: string;
    minLeadScore?: number;
    source?: string;
    limit?: number;
    offset?: number;
  } = {}): Promise<{ data: any[]; error: any; count?: number }> {
    try {
      let query = supabase
        .from('prospect_profiles')
        .select('*', { count: 'exact' });

      // Apply filters
      if (filters.category) {
        query = query.eq('category', filters.category);
      }
      if (filters.tier) {
        query = query.eq('tier', filters.tier);
      }
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      if (filters.minLeadScore) {
        query = query.gte('lead_score', filters.minLeadScore);
      }
      if (filters.source) {
        query = query.eq('source', filters.source);
      }

      // Apply pagination
      if (filters.limit) {
        query = query.limit(filters.limit);
      }
      if (filters.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 50) - 1);
      }

      // Order by lead score and creation date
      query = query.order('lead_score', { ascending: false })
                   .order('created_at', { ascending: false });

      const { data, error, count } = await query;

      return { data: data || [], error, count: count || 0 };
    } catch (error) {
      console.error('Error getting prospects:', error);
      return { data: [], error };
    }
  }

  // Update lead score
  static async updateLeadScore(
    prospectId: string,
    scoreChange: number,
    reason: string,
    eventData?: any
  ): Promise<{ newScore: number; error: any }> {
    try {
      const { data, error } = await supabase.rpc('update_lead_score', {
        user_id_param: prospectId,
        score_change: scoreChange,
        reason: reason,
        event_data: eventData || null
      });

      return { newScore: data, error };
    } catch (error) {
      console.error('Error updating lead score:', error);
      return { newScore: 0, error };
    }
  }

  // Track lead attribution
  static async trackAttribution(
    prospectId: string,
    utmData: any,
    trafficData: any
  ): Promise<{ success: boolean; error: any }> {
    try {
      const { data, error } = await supabase.rpc('track_lead_attribution', {
        user_id_param: prospectId,
        utm_data: utmData,
        traffic_data: trafficData
      });

      return { success: data === true, error };
    } catch (error) {
      console.error('Error tracking attribution:', error);
      return { success: false, error };
    }
  }

  // Track social conversion
  static async trackSocialConversion(
    prospectId: string,
    platform: string,
    eventType: string,
    value: number = 0,
    metadata?: any
  ): Promise<{ success: boolean; error: any }> {
    try {
      const { data, error } = await supabase.rpc('track_social_conversion', {
        user_id_param: prospectId,
        platform_param: platform,
        event_type_param: eventType,
        event_value_param: value,
        metadata_param: metadata || null
      });

      return { success: data === true, error };
    } catch (error) {
      console.error('Error tracking social conversion:', error);
      return { success: false, error };
    }
  }

  // Record booking event
  static async recordBooking(
    prospectId: string,
    callType: string,
    calendlyUrl: string,
    estimatedValue: number,
    scheduledFor?: Date
  ): Promise<{ data: any; error: any }> {
    try {
      const { data, error } = await supabase
        .from('booking_events')
        .insert({
          prospect_id: prospectId,
          call_type: callType,
          calendly_url: calendlyUrl,
          estimated_value: estimatedValue,
          scheduled_for: scheduledFor?.toISOString(),
          status: 'scheduled',
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      // Update prospect booking count
      if (!error) {
        await supabase.rpc('update_lead_score', {
          user_id_param: prospectId,
          score_change: 25,
          reason: 'call_booked',
          event_data: { call_type: callType, estimated_value: estimatedValue }
        });

        // Update booking count using RPC function
        await supabase.rpc('increment_booking_count', { prospect_id: prospectId });

        // Update last engagement
        await supabase
          .from('prospect_profiles')
          .update({
            last_engagement_at: new Date().toISOString()
          })
          .eq('id', prospectId);
      }

      return { data, error };
    } catch (error) {
      console.error('Error recording booking:', error);
      return { data: null, error };
    }
  }

  // Record lead magnet download
  static async recordLeadMagnetDownload(
    prospectId: string,
    magnetType: string,
    ipAddress?: string,
    userAgent?: string
  ): Promise<{ data: any; error: any }> {
    try {
      const { data, error } = await supabase
        .from('lead_magnet_downloads')
        .insert({
          prospect_id: prospectId,
          magnet_type: magnetType,
          ip_address: ipAddress,
          user_agent: userAgent,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      // Update lead score for download
      if (!error) {
        await supabase.rpc('update_lead_score', {
          user_id_param: prospectId,
          score_change: 15,
          reason: 'lead_magnet_download',
          event_data: { magnet_type: magnetType }
        });
      }

      return { data, error };
    } catch (error) {
      console.error('Error recording lead magnet download:', error);
      return { data: null, error };
    }
  }

  // Get prospect analytics
  static async getAnalytics(dateFrom?: Date, dateTo?: Date): Promise<{ data: any; error: any }> {
    try {
      const { data, error } = await supabase.rpc('get_prospect_analytics', {
        date_from: dateFrom?.toISOString() || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        date_to: dateTo?.toISOString() || new Date().toISOString()
      });

      return { data: data?.[0] || null, error };
    } catch (error) {
      console.error('Error getting analytics:', error);
      return { data: null, error };
    }
  }

  // Get high-value prospects
  static async getHighValueProspects(limit: number = 50): Promise<{ data: any[]; error: any }> {
    try {
      const { data, error } = await supabase
        .from('high_value_prospects')
        .select('*')
        .limit(limit);

      return { data: data || [], error };
    } catch (error) {
      console.error('Error getting high-value prospects:', error);
      return { data: [], error };
    }
  }

  // Get recent activity
  static async getRecentActivity(limit: number = 100): Promise<{ data: any[]; error: any }> {
    try {
      const { data, error } = await supabase
        .from('recent_activity')
        .select('*')
        .limit(limit);

      return { data: data || [], error };
    } catch (error) {
      console.error('Error getting recent activity:', error);
      return { data: [], error };
    }
  }

  // Search prospects
  static async searchProspects(searchTerm: string, limit: number = 50): Promise<{ data: any[]; error: any }> {
    try {
      const { data, error } = await supabase
        .from('prospect_profiles')
        .select('*')
        .or(`name.ilike.%${searchTerm}%, email.ilike.%${searchTerm}%, company.ilike.%${searchTerm}%`)
        .order('lead_score', { ascending: false })
        .limit(limit);

      return { data: data || [], error };
    } catch (error) {
      console.error('Error searching prospects:', error);
      return { data: [], error };
    }
  }

  // Update prospect status
  static async updateProspectStatus(
    prospectId: string,
    status: string,
    notes?: string
  ): Promise<{ data: any; error: any }> {
    try {
      const updateData: any = {
        status,
        last_engagement_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('prospect_profiles')
        .update(updateData)
        .eq('id', prospectId)
        .select()
        .single();

      return { data, error };
    } catch (error) {
      console.error('Error updating prospect status:', error);
      return { data: null, error };
    }
  }
}