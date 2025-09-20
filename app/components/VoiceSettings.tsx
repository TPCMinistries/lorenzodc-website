'use client';

import { useState, useEffect } from 'react';
import { VoiceService, VoiceUsage, VoicePreferences, OpenAIVoice } from '../lib/services/voice-service';

interface VoiceSettingsProps {
  onClose?: () => void;
  className?: string;
}

export default function VoiceSettings({ onClose, className = '' }: VoiceSettingsProps) {
  const [preferences, setPreferences] = useState<VoicePreferences | null>(null);
  const [usage, setUsage] = useState<VoiceUsage | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testingVoice, setTestingVoice] = useState<string | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const [prefs, usageData] = await Promise.all([
        VoiceService.getUserVoicePreferences(),
        VoiceService.getUserVoiceLimits()
      ]);

      setPreferences(prefs);
      setUsage(usageData);
    } catch (error) {
      console.error('Error loading voice settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!preferences) return;

    setSaving(true);
    try {
      const success = await VoiceService.updateVoicePreferences(preferences);
      if (success) {
        onClose?.();
      }
    } catch (error) {
      console.error('Error saving preferences:', error);
    } finally {
      setSaving(false);
    }
  };

  const testVoice = async (voice: OpenAIVoice) => {
    if (testingVoice) return;

    setTestingVoice(voice);
    try {
      const audioBuffer = await VoiceService.generateSpeech(
        `Hello! This is the ${voice} voice. How does it sound?`,
        voice,
        preferences?.voice_speed || 1.0,
        preferences?.audio_quality as 'standard' | 'hd' || 'standard'
      );

      if (audioBuffer) {
        const audioBlob = new Blob([audioBuffer], { type: 'audio/mpeg' });
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);

        audio.play().catch(console.error);

        audio.onended = () => {
          URL.revokeObjectURL(audioUrl);
        };
      }
    } catch (error) {
      console.error('Error testing voice:', error);
    } finally {
      setTestingVoice(null);
    }
  };

  const getUsageColor = (current: number, limit: number) => {
    if (limit === -1) return 'text-green-400'; // Unlimited
    const percentage = (current / limit) * 100;

    if (percentage >= 90) return 'text-red-400';
    if (percentage >= 70) return 'text-yellow-400';
    return 'text-green-400';
  };

  const getUsageText = (current: number, limit: number) => {
    if (limit === -1) return `${current} used (unlimited)`;
    return `${current} / ${limit} used`;
  };

  const getTierName = (tierId: string) => {
    switch (tierId) {
      case 'catalyst_plus': return 'Catalyst Plus';
      case 'catalyst_basic': return 'Catalyst Basic';
      case 'enterprise': return 'Enterprise';
      default: return 'Free';
    }
  };

  if (loading) {
    return (
      <div className={`bg-slate-800 rounded-xl border border-slate-600 p-6 ${className}`}>
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-3 text-slate-400">Loading voice settings...</span>
        </div>
      </div>
    );
  }

  if (!preferences || !usage) {
    return (
      <div className={`bg-slate-800 rounded-xl border border-slate-600 p-6 ${className}`}>
        <div className="text-center text-slate-400">
          <div className="text-4xl mb-2">🎙️</div>
          <p>Voice settings not available</p>
        </div>
      </div>
    );
  }

  const availableVoices = VoiceService.getVoiceOptions(usage.tier_id);

  return (
    <div className={`bg-slate-800 rounded-xl border border-slate-600 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-slate-600">
        <div>
          <h2 className="text-xl font-bold text-white mb-1">🎙️ Voice Settings</h2>
          <p className="text-slate-400 text-sm">Configure your AI voice experience</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      <div className="p-6 space-y-6">
        {/* Usage Status */}
        <div className="bg-slate-700/30 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-white">Monthly Usage</h3>
            <span className="text-sm bg-slate-600 text-white px-2 py-1 rounded">
              {getTierName(usage.tier_id)}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-slate-400 text-sm">Voice Messages</p>
              <p className={`font-medium ${getUsageColor(usage.current_usage, usage.monthly_limit)}`}>
                {getUsageText(usage.current_usage, usage.monthly_limit)}
              </p>
            </div>
            <div>
              <p className="text-slate-400 text-sm">Available Voices</p>
              <p className="text-white font-medium">{usage.available_voices.length} voices</p>
            </div>
          </div>

          {/* Usage Progress Bar */}
          {usage.monthly_limit > 0 && (
            <div className="mt-3">
              <div className="w-full bg-slate-600 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    (usage.current_usage / usage.monthly_limit) * 100 >= 90
                      ? 'bg-red-400'
                      : (usage.current_usage / usage.monthly_limit) * 100 >= 70
                      ? 'bg-yellow-400'
                      : 'bg-green-400'
                  }`}
                  style={{
                    width: `${Math.min((usage.current_usage / usage.monthly_limit) * 100, 100)}%`
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Voice Selection */}
        <div>
          <h3 className="font-semibold text-white mb-3">Preferred Voice</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {availableVoices.map((voice) => (
              <div
                key={voice.value}
                className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                  preferences.preferred_voice === voice.value
                    ? 'border-blue-400 bg-blue-500/10'
                    : 'border-slate-600 hover:border-slate-500'
                }`}
                onClick={() => setPreferences({ ...preferences, preferred_voice: voice.value })}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-white">{voice.name}</span>
                    {voice.premium && (
                      <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded">
                        Premium
                      </span>
                    )}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      testVoice(voice.value);
                    }}
                    disabled={testingVoice === voice.value}
                    className="p-1 text-slate-400 hover:text-blue-400 transition-colors"
                    title="Test voice"
                  >
                    {testingVoice === voice.value ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
                    ) : (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                </div>
                <p className="text-slate-400 text-sm">{voice.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Voice Speed */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-white">Speech Speed</h3>
            <span className="text-sm text-slate-400">{preferences.voice_speed}x</span>
          </div>
          <div className="space-y-2">
            <input
              type="range"
              min="0.25"
              max="4"
              step="0.25"
              value={preferences.voice_speed}
              onChange={(e) => setPreferences({
                ...preferences,
                voice_speed: parseFloat(e.target.value)
              })}
              className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-slate-500">
              <span>0.25x (Slow)</span>
              <span>1x (Normal)</span>
              <span>4x (Fast)</span>
            </div>
          </div>
        </div>

        {/* Audio Quality */}
        {usage.quality_options.includes('hd') && (
          <div>
            <h3 className="font-semibold text-white mb-3">Audio Quality</h3>
            <div className="flex gap-3">
              {usage.quality_options.map((quality) => (
                <button
                  key={quality}
                  onClick={() => setPreferences({ ...preferences, audio_quality: quality })}
                  className={`flex-1 p-3 rounded-lg border transition-all duration-200 ${
                    preferences.audio_quality === quality
                      ? 'border-blue-400 bg-blue-500/10 text-blue-300'
                      : 'border-slate-600 text-slate-300 hover:border-slate-500'
                  }`}
                >
                  <div className="font-medium">{quality.toUpperCase()}</div>
                  <div className="text-xs opacity-70">
                    {quality === 'hd' ? 'Higher quality, slower' : 'Faster generation'}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Playback Settings */}
        <div>
          <h3 className="font-semibold text-white mb-3">Playback Settings</h3>
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.auto_play_responses}
                onChange={(e) => setPreferences({
                  ...preferences,
                  auto_play_responses: e.target.checked
                })}
                className="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 rounded focus:ring-blue-500"
              />
              <span className="text-white">Auto-play AI responses</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.auto_send_on_voice_complete}
                onChange={(e) => setPreferences({
                  ...preferences,
                  auto_send_on_voice_complete: e.target.checked
                })}
                className="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 rounded focus:ring-blue-500"
              />
              <span className="text-white">Auto-send when voice recording stops</span>
            </label>
          </div>
        </div>

        {/* Voice Input Timeout */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-white">Recording Timeout</h3>
            <span className="text-sm text-slate-400">{preferences.voice_input_timeout_seconds}s</span>
          </div>
          <div className="space-y-2">
            <input
              type="range"
              min="1"
              max="10"
              step="1"
              value={preferences.voice_input_timeout_seconds}
              onChange={(e) => setPreferences({
                ...preferences,
                voice_input_timeout_seconds: parseInt(e.target.value)
              })}
              className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-slate-500">
              <span>1s (Immediate)</span>
              <span>5s (Balanced)</span>
              <span>10s (Patient)</span>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex gap-3 pt-4">
          {onClose && (
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-slate-600 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 justify-center"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Saving...
              </>
            ) : (
              'Save Settings'
            )}
          </button>
        </div>

        {/* Upgrade Prompt for Free Users */}
        {usage.tier_id === 'free' && (
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-400/20 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-blue-400">🚀</span>
              <span className="text-sm font-medium text-blue-300">Unlock Premium Voices</span>
            </div>
            <p className="text-xs text-slate-400 mb-3">
              Get access to all 6 premium AI voices, unlimited messages, and HD quality audio.
            </p>
            <button
              onClick={() => window.location.href = '/pricing'}
              className="w-full px-3 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 transition-all duration-200"
            >
              Upgrade to Plus ($39/month)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}