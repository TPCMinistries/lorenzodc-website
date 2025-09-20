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
    const formData = await request.formData();
    const audioFile = formData.get('audio') as File;
    const language = formData.get('language') as string || 'en';

    if (!audioFile) {
      return NextResponse.json(
        { error: 'Audio file is required' },
        { status: 400 }
      );
    }

    // Check file size (max 25MB for Whisper API)
    if (audioFile.size > 25 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Audio file too large (max 25MB)' },
        { status: 400 }
      );
    }

    // Check file type
    const allowedTypes = ['audio/webm', 'audio/mp4', 'audio/mpeg', 'audio/wav', 'audio/m4a'];
    if (!allowedTypes.includes(audioFile.type)) {
      return NextResponse.json(
        { error: `Unsupported audio format. Allowed: ${allowedTypes.join(', ')}` },
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

    // Transcribe using OpenAI Whisper
    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: 'whisper-1',
      language: language,
      response_format: 'verbose_json',
      temperature: 0.2, // Lower temperature for more consistent results
    });

    // Calculate confidence score from segments
    let averageConfidence = 0;
    if (transcription.segments && transcription.segments.length > 0) {
      const totalLogProb = transcription.segments.reduce(
        (sum, segment) => sum + (segment.avg_logprob || 0),
        0
      );
      averageConfidence = Math.exp(totalLogProb / transcription.segments.length);
    }

    // Track usage
    const audioDuration = transcription.duration || 0;
    await supabase.rpc('track_voice_usage', {
      user_id_param: user.id,
      message_type_param: 'voice_input',
      duration_seconds_param: audioDuration
    });

    return NextResponse.json({
      text: transcription.text,
      confidence: averageConfidence,
      duration: transcription.duration,
      language: transcription.language,
      segments: transcription.segments?.map(segment => ({
        start: segment.start,
        end: segment.end,
        text: segment.text,
        confidence: segment.avg_logprob ? Math.exp(segment.avg_logprob) : undefined
      }))
    });

  } catch (error) {
    console.error('Transcription error:', error);

    if (error.code === 'insufficient_quota') {
      return NextResponse.json(
        { error: 'AI service temporarily unavailable. Please try again later.' },
        { status: 503 }
      );
    }

    if (error.message?.includes('invalid_request_error')) {
      return NextResponse.json(
        { error: 'Invalid audio file format or corrupted file' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to transcribe audio' },
      { status: 500 }
    );
  }
}