'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

interface VoiceRecorderProps {
  onTranscription?: (text: string, confidence?: number) => void;
  onError?: (error: string) => void;
  onRecordingStateChange?: (isRecording: boolean) => void;
  disabled?: boolean;
  maxDuration?: number; // seconds
  autoSend?: boolean;
  className?: string;
}

export default function VoiceRecorder({
  onTranscription,
  onError,
  onRecordingStateChange,
  disabled = false,
  maxDuration = 60,
  autoSend = false,
  className = ''
}: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioLevel, setAudioLevel] = useState(0);
  const [isSupported, setIsSupported] = useState(true);
  const [permission, setPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const recordingTimerRef = useRef<NodeJS.Timeout>();
  const levelUpdateRef = useRef<number>();
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    // Check browser support
    const checkSupport = () => {
      const hasMediaRecorder = typeof MediaRecorder !== 'undefined';
      const hasGetUserMedia = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);

      setIsSupported(hasMediaRecorder && hasGetUserMedia);

      if (!hasMediaRecorder) {
        onError?.('MediaRecorder not supported in this browser');
      } else if (!hasGetUserMedia) {
        onError?.('Microphone access not supported in this browser');
      }
    };

    checkSupport();

    // Check microphone permission
    if (navigator.permissions) {
      navigator.permissions.query({ name: 'microphone' as PermissionName })
        .then(permissionStatus => {
          setPermission(permissionStatus.state as 'granted' | 'denied' | 'prompt');

          permissionStatus.onchange = () => {
            setPermission(permissionStatus.state as 'granted' | 'denied' | 'prompt');
          };
        })
        .catch(() => {
          // Permissions API not supported
        });
    }

    return () => {
      cleanupRecording();
    };
  }, [onError]);

  useEffect(() => {
    onRecordingStateChange?.(isRecording);
  }, [isRecording, onRecordingStateChange]);

  const cleanupRecording = useCallback(() => {
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
    }
    if (levelUpdateRef.current) {
      cancelAnimationFrame(levelUpdateRef.current);
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    mediaRecorderRef.current = null;
    analyserRef.current = null;
    audioChunksRef.current = [];
    setRecordingTime(0);
    setAudioLevel(0);
  }, []);

  const updateAudioLevel = useCallback(() => {
    if (!analyserRef.current) return;

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);

    // Calculate average audio level
    const average = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
    const normalizedLevel = average / 255;

    setAudioLevel(normalizedLevel);

    if (isRecording) {
      levelUpdateRef.current = requestAnimationFrame(updateAudioLevel);
    }
  }, [isRecording]);

  const startRecording = async () => {
    if (!isSupported || disabled || isRecording || isProcessing) return;

    try {
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 16000 // Good quality for speech recognition
        }
      });

      streamRef.current = stream;

      // Set up audio context for level monitoring
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);

      // Set up MediaRecorder
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });

      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });

        if (audioBlob.size > 0) {
          await transcribeAudio(audioBlob);
        }

        cleanupRecording();
      };

      mediaRecorder.onerror = (event) => {
        console.error('MediaRecorder error:', event);
        onError?.('Recording failed');
        stopRecording();
      };

      // Start recording
      mediaRecorder.start(250); // Collect data every 250ms
      setIsRecording(true);
      setPermission('granted');

      // Start level monitoring
      updateAudioLevel();

      // Start timer
      recordingTimerRef.current = setInterval(() => {
        setRecordingTime(prev => {
          const newTime = prev + 1;

          // Auto-stop at max duration
          if (newTime >= maxDuration) {
            stopRecording();
          }

          return newTime;
        });
      }, 1000);

    } catch (error) {
      console.error('Error starting recording:', error);

      if (error.name === 'NotAllowedError') {
        setPermission('denied');
        onError?.('Microphone access denied. Please allow microphone access and try again.');
      } else if (error.name === 'NotFoundError') {
        onError?.('No microphone found. Please connect a microphone and try again.');
      } else {
        onError?.('Failed to start recording. Please try again.');
      }

      cleanupRecording();
    }
  };

  const stopRecording = () => {
    if (!isRecording || !mediaRecorderRef.current) return;

    setIsRecording(false);
    mediaRecorderRef.current.stop();
  };

  const transcribeAudio = async (audioBlob: Blob) => {
    if (audioBlob.size === 0) {
      onError?.('No audio recorded');
      return;
    }

    setIsProcessing(true);

    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');
      formData.append('language', 'en');

      const response = await fetch('/api/voice/transcribe', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Transcription failed');
      }

      const result = await response.json();

      if (result.text && result.text.trim()) {
        onTranscription?.(result.text.trim(), result.confidence);
      } else {
        onError?.('No speech detected. Please try speaking more clearly.');
      }

    } catch (error) {
      console.error('Transcription error:', error);
      onError?.(error.message || 'Failed to transcribe audio');
    } finally {
      setIsProcessing(false);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getRecordingStateIcon = () => {
    if (isProcessing) {
      return (
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-400"></div>
      );
    }

    if (isRecording) {
      return (
        <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
          <rect x="6" y="6" width="8" height="8" rx="1" />
        </svg>
      );
    }

    return (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
      </svg>
    );
  };

  const getButtonState = () => {
    if (!isSupported) {
      return {
        disabled: true,
        className: 'bg-gray-500 cursor-not-allowed',
        text: 'Not Supported'
      };
    }

    if (permission === 'denied') {
      return {
        disabled: true,
        className: 'bg-red-500 cursor-not-allowed',
        text: 'Access Denied'
      };
    }

    if (disabled) {
      return {
        disabled: true,
        className: 'bg-gray-500 cursor-not-allowed opacity-50',
        text: 'Disabled'
      };
    }

    if (isProcessing) {
      return {
        disabled: true,
        className: 'bg-blue-500 cursor-wait',
        text: 'Processing...'
      };
    }

    if (isRecording) {
      return {
        disabled: false,
        className: 'bg-red-500 hover:bg-red-600 animate-pulse',
        text: 'Recording...'
      };
    }

    return {
      disabled: false,
      className: 'bg-blue-500 hover:bg-blue-600',
      text: 'Record Voice'
    };
  };

  const buttonState = getButtonState();

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Record Button */}
      <button
        onClick={isRecording ? stopRecording : startRecording}
        disabled={buttonState.disabled}
        className={`flex items-center gap-2 px-4 py-2 text-white rounded-lg font-medium transition-all duration-200 ${buttonState.className}`}
        title={permission === 'denied' ? 'Microphone access denied' : buttonState.text}
      >
        {getRecordingStateIcon()}
        <span className="hidden sm:inline">{buttonState.text}</span>
      </button>

      {/* Recording Status */}
      {(isRecording || isProcessing) && (
        <div className="flex items-center gap-3">
          {/* Timer */}
          {isRecording && (
            <div className="text-sm text-slate-400 font-mono">
              {formatTime(recordingTime)} / {formatTime(maxDuration)}
            </div>
          )}

          {/* Audio Level Indicator */}
          {isRecording && (
            <div className="flex items-center gap-1">
              <div className="flex items-end gap-1 h-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-1 transition-all duration-100 ${
                      audioLevel > (i + 1) * 0.2
                        ? 'bg-green-400 h-full'
                        : 'bg-slate-600 h-1'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Processing Indicator */}
          {isProcessing && (
            <div className="text-sm text-blue-400">
              Transcribing...
            </div>
          )}
        </div>
      )}

      {/* Permission Prompt */}
      {permission === 'prompt' && !isRecording && (
        <div className="text-xs text-slate-400">
          Click to allow microphone access
        </div>
      )}
    </div>
  );
}