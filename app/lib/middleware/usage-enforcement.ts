import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from "../../../lib/supabase/server";

export interface UsageEnforcementOptions {
  featureType: 'chat' | 'voice' | 'document' | 'assessment';
  trackUsage?: boolean;
  customErrorMessage?: string;
}

export async function enforceUsageLimit(
  request: NextRequest,
  options: UsageEnforcementOptions
): Promise<NextResponse | null> {
  try {
    // Get authenticated user
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Check rate limiting first
    const rateLimitCheck = await checkRateLimit(user.id, request.url, request.method);
    if (!rateLimitCheck.allowed) {
      return NextResponse.json(
        {
          error: 'Rate limit exceeded. Please slow down and try again.',
          retryAfter: 60
        },
        {
          status: 429,
          headers: {
            'Retry-After': '60',
            'X-RateLimit-Limit': rateLimitCheck.limit.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': rateLimitCheck.resetTime.toString()
          }
        }
      );
    }

    // Check feature usage limits
    const { data: canPerform, error: permError } = await supabaseAdmin.rpc('can_user_perform_action', {
      user_id_param: user.id,
      action_type: options.featureType
    });

    if (permError) {
      console.error('Error checking usage limits:', permError);
      return NextResponse.json(
        { error: 'Failed to check usage limits' },
        { status: 500 }
      );
    }

    if (!canPerform) {
      // Get detailed limits for error message
      const { data: limits } = await supabaseAdmin.rpc('get_user_usage_limits', {
        user_id_param: user.id
      });

      const limitsData = limits?.[0];
      let errorMessage = options.customErrorMessage;

      if (!errorMessage && limitsData) {
        errorMessage = generateLimitErrorMessage(options.featureType, limitsData);
      }

      return NextResponse.json(
        {
          error: errorMessage || 'Usage limit exceeded',
          upgradeRequired: true,
          currentTier: limitsData?.tier_id || 'free',
          usage: limitsData?.current_usage || {}
        },
        { status: 403 }
      );
    }

    // Track usage if requested
    if (options.trackUsage) {
      await supabaseAdmin.rpc('track_feature_usage', {
        user_id_param: user.id,
        feature_type_param: options.featureType,
        feature_action_param: `api_${request.method.toLowerCase()}`,
        metadata_param: {
          endpoint: request.url,
          user_agent: request.headers.get('user-agent') || '',
          ip: getClientIP(request)
        }
      });
    }

    // Add usage headers to response (will be added by calling route)
    const response = NextResponse.next();
    response.headers.set('X-Usage-Feature', options.featureType);
    response.headers.set('X-Usage-Tracked', options.trackUsage ? 'true' : 'false');

    return null; // Allow request to proceed

  } catch (error) {
    console.error('Usage enforcement error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function checkRateLimit(
  userId: string,
  endpoint: string,
  method: string
): Promise<{
  allowed: boolean;
  limit: number;
  resetTime: number;
}> {
  try {
    const { data: allowed, error } = await supabaseAdmin.rpc('check_api_rate_limit', {
      user_id_param: userId,
      endpoint_param: endpoint,
      method_param: method
    });

    if (error) {
      console.error('Rate limit check error:', error);
      return { allowed: false, limit: 60, resetTime: Date.now() + 60000 };
    }

    return {
      allowed: !!allowed,
      limit: 60, // Default limit
      resetTime: Date.now() + 60000 // 1 minute from now
    };
  } catch (error) {
    console.error('Rate limit check error:', error);
    return { allowed: false, limit: 60, resetTime: Date.now() + 60000 };
  }
}

function generateLimitErrorMessage(featureType: string, limits: any): string {
  const tierNames = {
    'free': 'Free',
    'catalyst_basic': 'Catalyst Basic',
    'catalyst_plus': 'Catalyst Plus',
    'enterprise': 'Enterprise'
  };

  const tierName = tierNames[limits.tier_id as keyof typeof tierNames] || 'Current';

  switch (featureType) {
    case 'chat':
      if (!limits.features_enabled.includes('chat')) {
        return `Chat messages are not available in ${tierName}. Upgrade to access unlimited AI conversations.`;
      }
      return `You've reached your monthly limit of ${limits.chat_messages_limit} chat messages. Upgrade to Catalyst Plus for unlimited conversations!`;

    case 'voice':
      if (!limits.features_enabled.includes('voice')) {
        return `Voice messages are not available in ${tierName}. Upgrade to access premium voice features.`;
      }
      return `You've reached your monthly limit of ${limits.voice_messages_limit} voice messages. Upgrade for unlimited voice conversations!`;

    case 'document':
      if (!limits.features_enabled.includes('documents')) {
        return `Document upload is not available in ${tierName}. Upgrade to Catalyst Plus to chat with your documents using AI.`;
      }
      return `You've reached your monthly limit of ${limits.documents_limit} document uploads. Upgrade for unlimited document analysis!`;

    case 'assessment':
      if (!limits.features_enabled.includes('assessment')) {
        return `Assessments are not available in ${tierName}. Upgrade to access personal and business assessments.`;
      }
      return `You've reached your monthly limit of ${limits.assessments_limit} assessments. Upgrade for unlimited assessments!`;

    default:
      return `Feature limit reached. Upgrade your plan for unlimited access.`;
  }
}

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const xClientIP = request.headers.get('x-client-ip');

  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  if (realIP) {
    return realIP.trim();
  }

  if (xClientIP) {
    return xClientIP.trim();
  }

  return '0.0.0.0';
}

// Convenience function for chat API enforcement
export async function enforceChatLimit(request: NextRequest): Promise<NextResponse | null> {
  return enforceUsageLimit(request, {
    featureType: 'chat',
    trackUsage: true,
    customErrorMessage: 'Chat message limit reached. Upgrade to continue your AI coaching conversations!'
  });
}

// Convenience function for voice API enforcement
export async function enforceVoiceLimit(request: NextRequest): Promise<NextResponse | null> {
  return enforceUsageLimit(request, {
    featureType: 'voice',
    trackUsage: true,
    customErrorMessage: 'Voice message limit reached. Upgrade to Catalyst Plus for unlimited voice conversations!'
  });
}

// Convenience function for document API enforcement
export async function enforceDocumentLimit(request: NextRequest): Promise<NextResponse | null> {
  return enforceUsageLimit(request, {
    featureType: 'document',
    trackUsage: true,
    customErrorMessage: 'Document upload limit reached. Upgrade to Catalyst Plus to analyze unlimited documents with AI!'
  });
}

// Convenience function for assessment API enforcement
export async function enforceAssessmentLimit(request: NextRequest): Promise<NextResponse | null> {
  return enforceUsageLimit(request, {
    featureType: 'assessment',
    trackUsage: true,
    customErrorMessage: 'Assessment limit reached. Upgrade for unlimited personal and business assessments!'
  });
}