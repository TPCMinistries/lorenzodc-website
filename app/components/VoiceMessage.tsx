'use client';

import { useState, useRef, useEffect } from 'react';
import { VoiceMessage as VoiceMessageType } from '../lib/services/voice-service';

interface VoiceMessageProps {
  voiceMessage: VoiceMessageType;
  isOwn?: boolean;
  onDelete?: (voiceMessageId: string) => void;
  className?: string;
}

export default function VoiceMessage({
  voiceMessage,
  isOwn = false,
  onDelete,
  className = ''
}: VoiceMessageProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(voiceMessage.audio_duration_seconds);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [playbackRate, setPlaybackRate] = useState(1);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const audio = new Audio(voiceMessage.audio_file_url);
    audioRef.current = audio;

    const handleLoadedData = () => {
      setDuration(audio.duration || voiceMessage.audio_duration_seconds);
      setIsLoading(false);
    };

    const handleLoadError = () => {
      setError('Failed to load audio');
      setIsLoading(false);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener('loadeddata', handleLoadedData);
    audio.addEventListener('error', handleLoadError);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('loadeddata', handleLoadedData);
      audio.removeEventListener('error', handleLoadError);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.pause();
    };
  }, [voiceMessage.audio_file_url, voiceMessage.audio_duration_seconds]);

  const togglePlayback = () => {
    if (!audioRef.current || error) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.error('Playback failed:', err);
          setError('Playback failed');
        });
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !progressRef.current || error) return;

    const rect = progressRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const clickRatio = clickX / width;
    const newTime = clickRatio * duration;

    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const changePlaybackRate = () => {
    if (!audioRef.current) return;

    const rates = [1, 1.25, 1.5, 2];
    const currentIndex = rates.indexOf(playbackRate);
    const nextRate = rates[(currentIndex + 1) % rates.length];

    setPlaybackRate(nextRate);
    audioRef.current.playbackRate = nextRate;
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getVoiceIcon = (voiceName: string) => {
    const voiceIcons = {
      alloy: '🤖',
      echo: '🎵',
      fable: '📚',
      onyx: '💎',
      nova: '⭐',
      shimmer: '✨'
    };
    return voiceIcons[voiceName as keyof typeof voiceIcons] || '🎙️';
  };

  const getMessageTypeInfo = () => {
    if (voiceMessage.message_type === 'voice_input') {
      return {
        icon: '🎤',
        label: 'Voice Input',
        description: 'Spoken message'
      };
    } else {
      return {
        icon: getVoiceIcon(voiceMessage.voice_name),
        label: 'AI Voice',
        description: `${voiceMessage.voice_name} voice`
      };
    }
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const messageInfo = getMessageTypeInfo();

  return (
    <div className={`${className}`}>
      <div className={`flex items-start gap-3 p-4 rounded-lg ${
        isOwn
          ? 'bg-blue-500/10 border border-blue-400/20'
          : 'bg-slate-700/50 border border-slate-600'
      }`}>
        {/* Voice Icon */}
        <div className="flex-shrink-0">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
            isOwn ? 'bg-blue-500/20' : 'bg-slate-600'
          }`}>
            {messageInfo.icon}
          </div>
        </div>

        {/* Voice Message Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-white">
                {messageInfo.label}
              </span>
              {voiceMessage.message_type === 'voice_output' && (
                <span className="text-xs text-slate-400">
                  {messageInfo.description}
                </span>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1">
              {/* Playback Rate */}
              {!error && !isLoading && (
                <button
                  onClick={changePlaybackRate}
                  className="text-xs bg-slate-600 hover:bg-slate-500 text-white px-2 py-1 rounded transition-colors"
                  title="Change playback speed"
                >
                  {playbackRate}x
                </button>
              )}

              {/* Delete Button */}
              {onDelete && (
                <button
                  onClick={() => onDelete(voiceMessage.id)}
                  className="p-1 text-slate-400 hover:text-red-400 transition-colors"
                  title="Delete voice message"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Transcribed Text (if available) */}
          {voiceMessage.transcribed_text && (
            <div className="mb-3 p-2 bg-slate-800/50 rounded text-sm text-slate-300 italic">
              "{voiceMessage.transcribed_text}"
              {voiceMessage.confidence_score && (
                <span className="ml-2 text-xs text-slate-500">
                  ({Math.round(voiceMessage.confidence_score * 100)}% confidence)
                </span>
              )}
            </div>
          )}

          {/* Audio Controls */}
          <div className="flex items-center gap-3">
            {/* Play/Pause Button */}
            <button
              onClick={togglePlayback}
              disabled={isLoading || !!error}
              className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 ${
                error
                  ? 'bg-red-500/20 text-red-400 cursor-not-allowed'
                  : isLoading
                  ? 'bg-slate-600 cursor-wait'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : error ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : isPlaying ? (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 002 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
              )}
            </button>

            {/* Progress Bar and Time */}
            <div className="flex-1">
              {error ? (
                <div className="text-red-400 text-sm">
                  {error}
                </div>
              ) : (
                <>
                  {/* Progress Bar */}
                  <div
                    ref={progressRef}
                    onClick={handleProgressClick}
                    className="w-full h-2 bg-slate-600 rounded-full cursor-pointer mb-1 group"
                  >
                    <div
                      className="h-full bg-blue-400 rounded-full transition-all duration-100 group-hover:bg-blue-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  {/* Time Display */}
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* File Info */}
          <div className="mt-2 flex items-center gap-4 text-xs text-slate-500">
            <span>{(voiceMessage.audio_file_size / 1024).toFixed(1)} KB</span>
            <span>{voiceMessage.audio_format.toUpperCase()}</span>
            {voiceMessage.voice_speed !== 1 && (
              <span>{voiceMessage.voice_speed}x speed</span>
            )}
            <span className="capitalize">{voiceMessage.voice_model}</span>
          </div>
        </div>
      </div>
    </div>
  );
}