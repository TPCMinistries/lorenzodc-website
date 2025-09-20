import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { supabase } from '../../../lib/supabase/server';
import { enforceVoiceLimit } from '../../../lib/middleware/usage-enforcement';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  // Enforce usage limits first
  const limitResponse = await enforceVoiceLimit(request);
  if (limitResponse) {
    return limitResponse;
  }

  try {
    const { text, voice = 'alloy', speed = 1.0, quality = 'standard' } = await request.json();

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }

    if (text.length > 4096) {
      return NextResponse.json(
        { error: 'Text too long (max 4096 characters)' },
        { status: 400 }
      );
    }

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Check if user can use voice features
    const { data: canUse, error: permError } = await supabase.rpc('can_send_voice_message', {
      user_id_param: user.id
    });

    if (permError || !canUse) {
      return NextResponse.json(
        { error: 'Voice message limit reached. Upgrade your plan for more voice messages.' },
        { status: 403 }
      );
    }

    // Get user's voice limits to check available voices
    const { data: limits } = await supabase.rpc('get_user_voice_limits', {
      user_id_param: user.id
    });

    const userLimits = limits?.[0];
    if (!userLimits?.available_voices.includes(voice)) {
      return NextResponse.json(
        { error: `Voice '${voice}' not available for your subscription tier` },
        { status: 403 }
      );
    }

    // Check quality access
    if (quality === 'hd' && !userLimits.quality_options.includes('hd')) {
      return NextResponse.json(
        { error: 'HD quality not available for your subscription tier' },
        { status: 403 }
      );
    }

    // Generate speech using OpenAI TTS
    const model = quality === 'hd' ? 'tts-1-hd' : 'tts-1';
    const clampedSpeed = Math.max(0.25, Math.min(4.0, speed));

    const response = await openai.audio.speech.create({
      model,
      voice: voice as any,
      input: text,
      speed: clampedSpeed,
      response_format: 'mp3'
    });

    const audioBuffer = await response.arrayBuffer();

    // Track usage
    const estimatedDuration = text.length / (15 * clampedSpeed); // ~15 chars per second
    await supabase.rpc('track_voice_usage', {
      user_id_param: user.id,
      message_type_param: 'voice_output',
      duration_seconds_param: estimatedDuration
    });

    // Return the audio data
    return new NextResponse(audioBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioBuffer.byteLength.toString(),
      },
    });

  } catch (error) {
    console.error('Speech generation error:', error);

    if (error.code === 'insufficient_quota') {
      return NextResponse.json(
        { error: 'AI service temporarily unavailable. Please try again later.' },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to generate speech' },
      { status: 500 }
    );
  }
}