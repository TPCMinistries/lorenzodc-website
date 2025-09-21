import { supabase } from "../../../lib/supabase/client";
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface VoiceMessage {
  id: string;
  user_id: string;
  session_id: string;
  message_id: string;
  audio_file_url: string;
  audio_file_size: number;
  audio_duration_seconds: number;
  audio_format: string;
  voice_model: string;
  voice_name: string;
  voice_speed: number;
  status: 'processing' | 'completed' | 'failed';
  error_message?: string;
  transcribed_text?: string;
  confidence_score?: number;
  message_type: 'voice_input' | 'voice_output';
  created_at: string;
  processed_at?: string;
}

export interface VoiceUsage {
  tier_id: string;
  monthly_limit: number;
  available_voices: string[];
  quality_options: string[];
  current_usage: number;
  can_use_voice: boolean;
}

export interface VoicePreferences {
  preferred_voice: string;
  voice_speed: number;
  auto_play_responses: boolean;
  auto_send_on_voice_complete: boolean;
  voice_input_timeout_seconds: number;
  audio_quality: string;
  preferred_audio_format: string;
}

export type OpenAIVoice = 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer';

export class VoiceService {

  // Get user's voice limits and tier information
  static async getUserVoiceLimits(): Promise<VoiceUsage | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    try {
      const { data, error } = await supabase.rpc('get_user_voice_limits', {
        user_id_param: user.id
      });

      if (error) throw error;
      return data?.[0] || null;
    } catch (error) {
      console.error('Error fetching voice limits:', error);
      return null;
    }
  }

  // Check if user can send voice message
  static async canSendVoiceMessage(): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    try {
      const { data, error } = await supabase.rpc('can_send_voice_message', {
        user_id_param: user.id
      });

      if (error) throw error;
      return data || false;
    } catch (error) {
      console.error('Error checking voice permissions:', error);
      return false;
    }
  }

  // Get user's voice preferences
  static async getUserVoicePreferences(): Promise<VoicePreferences | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    try {
      const { data, error } = await supabase.rpc('get_user_voice_preferences', {
        user_id_param: user.id
      });

      if (error) throw error;
      return data?.[0] || null;
    } catch (error) {
      console.error('Error fetching voice preferences:', error);
      return null;
    }
  }

  // Update user's voice preferences
  static async updateVoicePreferences(preferences: Partial<VoicePreferences>): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('voice_preferences')
        .upsert({
          user_id: user.id,
          ...preferences,
          updated_at: new Date().toISOString()
        });

      return !error;
    } catch (error) {
      console.error('Error updating voice preferences:', error);
      return false;
    }
  }

  // Generate speech from text using OpenAI TTS
  static async generateSpeech(
    text: string,
    voice: OpenAIVoice = 'alloy',
    speed: number = 1.0,
    quality: 'standard' | 'hd' = 'standard'
  ): Promise<ArrayBuffer | null> {
    try {
      // Check if user can use voice
      const canUse = await this.canSendVoiceMessage();
      if (!canUse) {
        throw new Error('Voice message limit reached');
      }

      // Get user's voice limits to check available voices
      const limits = await this.getUserVoiceLimits();
      if (!limits?.available_voices.includes(voice)) {
        throw new Error(`Voice '${voice}' not available for your subscription tier`);
      }

      const model = quality === 'hd' ? 'tts-1-hd' : 'tts-1';

      const response = await openai.audio.speech.create({
        model,
        voice,
        input: text,
        speed: Math.max(0.25, Math.min(4.0, speed)), // Clamp speed between 0.25 and 4.0
        response_format: 'mp3'
      });

      return await response.arrayBuffer();
    } catch (error) {
      console.error('Error generating speech:', error);
      return null;
    }
  }

  // Save voice message to storage and database
  static async saveVoiceMessage(
    sessionId: string,
    messageId: string,
    audioBuffer: ArrayBuffer,
    messageType: 'voice_input' | 'voice_output',
    voiceSettings: {
      voice: OpenAIVoice;
      speed: number;
      model: string;
    },
    transcribedText?: string,
    confidenceScore?: number
  ): Promise<VoiceMessage | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    try {
      // Convert ArrayBuffer to File for upload
      const audioFile = new File([audioBuffer], `voice_${messageId}.mp3`, {
        type: 'audio/mpeg'
      });

      // Upload to Supabase Storage
      const fileName = `${user.id}/${sessionId}/${messageId}_${Date.now()}.mp3`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('voice-messages')
        .upload(fileName, audioFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('voice-messages')
        .getPublicUrl(uploadData.path);

      // Calculate duration (rough estimate based on text length and speed)
      const estimatedDuration = transcribedText
        ? (transcribedText.length / 15) / voiceSettings.speed // ~15 chars per second
        : audioBuffer.byteLength / 16000; // Rough estimate for MP3

      // Save to database
      const { data, error } = await supabase
        .from('voice_messages')
        .insert({
          user_id: user.id,
          session_id: sessionId,
          message_id: messageId,
          audio_file_url: urlData.publicUrl,
          audio_file_size: audioBuffer.byteLength,
          audio_duration_seconds: estimatedDuration,
          audio_format: 'mp3',
          voice_model: voiceSettings.model,
          voice_name: voiceSettings.voice,
          voice_speed: voiceSettings.speed,
          status: 'completed',
          message_type: messageType,
          transcribed_text: transcribedText,
          confidence_score: confidenceScore,
          processed_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      // Track usage
      await this.trackVoiceUsage(messageType, estimatedDuration);

      return data;
    } catch (error) {
      console.error('Error saving voice message:', error);
      return null;
    }
  }

  // Track voice usage
  static async trackVoiceUsage(
    messageType: 'voice_input' | 'voice_output',
    durationSeconds: number = 0
  ): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    try {
      const { data, error } = await supabase.rpc('track_voice_usage', {
        user_id_param: user.id,
        message_type_param: messageType,
        duration_seconds_param: durationSeconds
      });

      return !error;
    } catch (error) {
      console.error('Error tracking voice usage:', error);
      return false;
    }
  }

  // Transcribe audio to text using OpenAI Whisper
  static async transcribeAudio(audioBlob: Blob): Promise<{
    text: string;
    confidence?: number;
  } | null> {
    try {
      // Check if user can use voice
      const canUse = await this.canSendVoiceMessage();
      if (!canUse) {
        throw new Error('Voice message limit reached');
      }

      // Convert blob to file
      const audioFile = new File([audioBlob], 'audio.webm', {
        type: audioBlob.type
      });

      const transcription = await openai.audio.transcriptions.create({
        file: audioFile,
        model: 'whisper-1',
        language: 'en', // Can be made configurable
        response_format: 'verbose_json'
      });

      return {
        text: transcription.text,
        confidence: transcription.segments?.[0]?.avg_logprob ?
          Math.exp(transcription.segments[0].avg_logprob) : undefined
      };
    } catch (error) {
      console.error('Error transcribing audio:', error);
      return null;
    }
  }

  // Get voice messages for a session
  static async getSessionVoiceMessages(sessionId: string): Promise<VoiceMessage[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    try {
      const { data, error } = await supabase
        .from('voice_messages')
        .select('*')
        .eq('session_id', sessionId)
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching voice messages:', error);
      return [];
    }
  }

  // Delete voice message
  static async deleteVoiceMessage(voiceMessageId: string): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    try {
      // Get voice message details for file deletion
      const { data: voiceMessage } = await supabase
        .from('voice_messages')
        .select('audio_file_url')
        .eq('id', voiceMessageId)
        .eq('user_id', user.id)
        .single();

      if (voiceMessage) {
        // Extract file path from URL
        const urlParts = voiceMessage.audio_file_url.split('/');
        const fileName = urlParts[urlParts.length - 1];
        const filePath = `${user.id}/${fileName}`;

        // Delete from storage
        await supabase.storage
          .from('voice-messages')
          .remove([filePath]);
      }

      // Delete from database
      const { error } = await supabase
        .from('voice_messages')
        .delete()
        .eq('id', voiceMessageId)
        .eq('user_id', user.id);

      return !error;
    } catch (error) {
      console.error('Error deleting voice message:', error);
      return false;
    }
  }

  // Generate voice response for chat message
  static async generateVoiceResponse(
    text: string,
    sessionId: string,
    messageId: string
  ): Promise<VoiceMessage | null> {
    try {
      // Get user preferences
      const preferences = await this.getUserVoicePreferences();
      if (!preferences) return null;

      // Generate speech
      const audioBuffer = await this.generateSpeech(
        text,
        preferences.preferred_voice as OpenAIVoice,
        preferences.voice_speed,
        preferences.audio_quality as 'standard' | 'hd'
      );

      if (!audioBuffer) return null;

      // Save voice message
      return await this.saveVoiceMessage(
        sessionId,
        messageId,
        audioBuffer,
        'voice_output',
        {
          voice: preferences.preferred_voice as OpenAIVoice,
          speed: preferences.voice_speed,
          model: preferences.audio_quality === 'hd' ? 'tts-1-hd' : 'tts-1'
        },
        text
      );
    } catch (error) {
      console.error('Error generating voice response:', error);
      return null;
    }
  }

  // Get available voices for user's tier
  static getVoiceOptions(tier: string): {
    value: OpenAIVoice;
    name: string;
    description: string;
    premium?: boolean;
  }[] {
    const allVoices = [
      {
        value: 'alloy' as OpenAIVoice,
        name: 'Alloy',
        description: 'Neutral, clear voice',
        premium: false
      },
      {
        value: 'echo' as OpenAIVoice,
        name: 'Echo',
        description: 'Warm, expressive voice',
        premium: false
      },
      {
        value: 'fable' as OpenAIVoice,
        name: 'Fable',
        description: 'Storytelling voice',
        premium: false
      },
      {
        value: 'onyx' as OpenAIVoice,
        name: 'Onyx',
        description: 'Deep, confident voice',
        premium: true
      },
      {
        value: 'nova' as OpenAIVoice,
        name: 'Nova',
        description: 'Bright, energetic voice',
        premium: true
      },
      {
        value: 'shimmer' as OpenAIVoice,
        name: 'Shimmer',
        description: 'Gentle, soothing voice',
        premium: true
      }
    ];

    // Filter based on tier
    switch (tier) {
      case 'catalyst_plus':
      case 'enterprise':
        return allVoices; // All voices
      case 'catalyst_basic':
        return allVoices.filter(v => ['alloy', 'echo', 'fable'].includes(v.value)); // Basic + some premium
      default:
        return allVoices.filter(v => v.value === 'alloy'); // Free tier gets only basic voice
    }
  }
}