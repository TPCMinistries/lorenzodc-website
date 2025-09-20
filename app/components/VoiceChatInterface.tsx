'use client';

import { useState, useRef, useEffect } from 'react';
import { useConversationPersistence } from '../hooks/useConversationPersistence';
import { VoiceService, VoiceMessage as VoiceMessageType } from '../lib/services/voice-service';
import { ChatSession } from '../lib/services/conversation-history';
import ConversationHistory from './ConversationHistory';
import ConversationSearch from './ConversationSearch';
import ConversationInsights from './ConversationInsights';
import VoiceRecorder from './VoiceRecorder';
import VoiceMessage from './VoiceMessage';
import VoiceSettings from './VoiceSettings';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  metadata?: Record<string, any>;
  voiceMessage?: VoiceMessageType;
}

interface VoiceChatInterfaceProps {
  sessionType?: 'coaching' | 'assessment' | 'document_chat' | 'general';
  welcomeMessage?: string;
  placeholder?: string;
  onMessage?: (message: Message) => void;
  className?: string;
}

export default function VoiceChatInterface({
  sessionType = 'coaching',
  welcomeMessage = "Hi! I'm your AI coach. How can I help you today?",
  placeholder = "Type your message or use voice...",
  onMessage,
  className = ''
}: VoiceChatInterfaceProps) {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showInsights, setShowInsights] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showVoiceSettings, setShowVoiceSettings] = useState(false);
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [voiceMessages, setVoiceMessages] = useState<Record<string, VoiceMessageType>>({});
  const [autoPlayResponses, setAutoPlayResponses] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    currentSession,
    messages,
    isLoading: isPersistenceLoading,
    isSaving,
    hasUnsavedMessages,
    startNewConversation,
    resumeConversation,
    addMessage,
    saveConversation,
    updateSessionTitle,
    generateSmartTitle,
    clearConversation,
    sessionId,
    sessionTitle,
    messageCount
  } = useConversationPersistence({ sessionType, autoSave: true });

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Initialize with a new conversation if none exists
    if (!currentSession && !isPersistenceLoading) {
      startNewConversation();
    }
  }, [currentSession, isPersistenceLoading, startNewConversation]);

  useEffect(() => {
    // Add welcome message if this is a new conversation
    if (currentSession && messages.length === 0) {
      addMessage('assistant', welcomeMessage);
    }
  }, [currentSession, messages.length, addMessage, welcomeMessage]);

  useEffect(() => {
    // Load voice preferences
    const loadVoicePrefs = async () => {
      const prefs = await VoiceService.getUserVoicePreferences();
      if (prefs) {
        setAutoPlayResponses(prefs.auto_play_responses);
      }
    };
    loadVoicePrefs();
  }, []);

  useEffect(() => {
    // Load voice messages for current session
    if (sessionId) {
      loadSessionVoiceMessages();
    }
  }, [sessionId]);

  const loadSessionVoiceMessages = async () => {
    if (!sessionId) return;

    try {
      const voiceMsgs = await VoiceService.getSessionVoiceMessages(sessionId);
      const voiceMsgMap = voiceMsgs.reduce((acc, vm) => {
        acc[vm.message_id] = vm;
        return acc;
      }, {} as Record<string, VoiceMessageType>);

      setVoiceMessages(voiceMsgMap);
    } catch (error) {
      console.error('Error loading voice messages:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !currentSession) return;

    const userMessage = input.trim();
    setInput('');
    setIsLoading(true);

    // Add user message
    const userMsgObj = addMessage('user', userMessage);
    onMessage?.(userMsgObj);

    try {
      // Generate AI response
      const response = await generateAIResponse(userMessage, messages);

      // Add assistant response
      const assistantMessage = addMessage('assistant', response);
      onMessage?.(assistantMessage);

      // Generate voice response if auto-play is enabled
      if (autoPlayResponses && assistantMessage.id) {
        await generateVoiceResponse(response, assistantMessage.id);
      }

    } catch (error) {
      console.error('Error generating response:', error);
      addMessage('assistant', 'Sorry, I encountered an error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceTranscription = async (text: string, confidence?: number) => {
    if (!text.trim() || !currentSession) return;

    setIsLoading(true);

    // Add user message with voice metadata
    const userMessage = addMessage('user', text, {
      voice_transcription: true,
      confidence_score: confidence
    });

    onMessage?.(userMessage);

    try {
      // Generate AI response
      const response = await generateAIResponse(text, messages);

      // Add assistant response
      const assistantMessage = addMessage('assistant', response);
      onMessage?.(assistantMessage);

      // Generate voice response if auto-play is enabled
      if (autoPlayResponses && assistantMessage.id) {
        await generateVoiceResponse(response, assistantMessage.id);
      }

    } catch (error) {
      console.error('Error generating response:', error);
      addMessage('assistant', 'Sorry, I encountered an error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const generateVoiceResponse = async (text: string, messageId: string) => {
    if (!sessionId) return;

    try {
      const voiceMessage = await VoiceService.generateVoiceResponse(text, sessionId, messageId);
      if (voiceMessage) {
        setVoiceMessages(prev => ({
          ...prev,
          [messageId]: voiceMessage
        }));
      }
    } catch (error) {
      console.error('Error generating voice response:', error);
    }
  };

  const generateAIResponse = async (userMessage: string, messageHistory: Message[]): Promise<string> => {
    // Prepare conversation context
    const context = messageHistory
      .slice(-10) // Last 10 messages for context
      .map(msg => `${msg.role}: ${msg.content}`)
      .join('\n');

    const response = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: userMessage,
        context: context,
        sessionType: sessionType,
        sessionId: sessionId
      })
    });

    if (!response.ok) throw new Error('Failed to generate response');

    const { response: aiResponse } = await response.json();
    return aiResponse;
  };

  const handleSelectConversation = async (session: ChatSession) => {
    await resumeConversation(session.id);
    setShowHistory(false);
  };

  const handleStartNewConversation = async () => {
    await startNewConversation();
    setShowHistory(false);
    inputRef.current?.focus();
  };

  const handleSearchSelect = async (sessionId: string, messageContent: string) => {
    await resumeConversation(sessionId);
    setShowSearch(false);
  };

  const handleDeleteVoiceMessage = async (voiceMessageId: string) => {
    const success = await VoiceService.deleteVoiceMessage(voiceMessageId);
    if (success) {
      setVoiceMessages(prev => {
        const updated = { ...prev };
        // Find and remove the voice message
        Object.keys(updated).forEach(messageId => {
          if (updated[messageId].id === voiceMessageId) {
            delete updated[messageId];
          }
        });
        return updated;
      });
    }
  };

  const toggleVoiceMode = () => {
    setIsVoiceMode(!isVoiceMode);
    if (!isVoiceMode) {
      inputRef.current?.blur();
    } else {
      inputRef.current?.focus();
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getSessionTypeIcon = (type: string) => {
    switch (type) {
      case 'assessment': return '📊';
      case 'document_chat': return '📄';
      case 'coaching': return '🎯';
      default: return '💬';
    }
  };

  return (
    <div className={`flex h-full ${className}`}>
      {/* Conversation History Sidebar */}
      <ConversationHistory
        isOpen={showHistory}
        onToggle={() => setShowHistory(!showHistory)}
        onSelectConversation={handleSelectConversation}
        onStartNewConversation={handleStartNewConversation}
        className="w-80 flex-shrink-0"
      />

      {/* Main Chat Interface */}
      <div className="flex-1 flex flex-col bg-slate-900">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-600 bg-slate-800">
          <div className="flex items-center gap-3">
            {/* History Toggle (when sidebar is closed) */}
            {!showHistory && (
              <button
                onClick={() => setShowHistory(true)}
                className="text-slate-400 hover:text-white transition-colors"
                title="Show conversation history"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </button>
            )}

            {/* Session Info */}
            <div className="flex items-center gap-2">
              <span className="text-xl">{getSessionTypeIcon(sessionType)}</span>
              <div>
                <h1 className="font-semibold text-white">
                  {sessionTitle || 'New Conversation'}
                </h1>
                <p className="text-xs text-slate-400">
                  {messageCount} messages
                  {isSaving && ' • Saving...'}
                  {hasUnsavedMessages && !isSaving && ' • Unsaved changes'}
                </p>
              </div>
            </div>
          </div>

          {/* Header Actions */}
          <div className="flex items-center gap-2">
            {/* Voice Mode Toggle */}
            <button
              onClick={toggleVoiceMode}
              className={`p-2 rounded-lg transition-colors ${
                isVoiceMode
                  ? 'bg-green-500 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
              title={isVoiceMode ? 'Switch to text mode' : 'Switch to voice mode'}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
              </svg>
            </button>

            {/* Voice Settings */}
            <button
              onClick={() => setShowVoiceSettings(!showVoiceSettings)}
              className={`p-2 rounded-lg transition-colors ${
                showVoiceSettings
                  ? 'bg-purple-500 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
              title="Voice settings"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>

            {/* Search Toggle */}
            <button
              onClick={() => setShowSearch(!showSearch)}
              className={`p-2 rounded-lg transition-colors ${
                showSearch
                  ? 'bg-blue-500 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
              title="Search conversations"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Insights Toggle */}
            <button
              onClick={() => setShowInsights(!showInsights)}
              className={`p-2 rounded-lg transition-colors ${
                showInsights
                  ? 'bg-purple-500 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
              title="View conversation insights"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </button>

            {/* New Conversation */}
            <button
              onClick={handleStartNewConversation}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
              title="Start new conversation"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
        </div>

        {/* Search Bar (when active) */}
        {showSearch && (
          <div className="p-4 border-b border-slate-600 bg-slate-800">
            <ConversationSearch
              onSelectResult={handleSearchSelect}
              placeholder="Search your conversation history..."
            />
          </div>
        )}

        {/* Voice Settings Panel (when active) */}
        {showVoiceSettings && (
          <div className="border-b border-slate-600 bg-slate-800">
            <VoiceSettings
              onClose={() => setShowVoiceSettings(false)}
              className="m-4"
            />
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div key={message.id}>
              {/* Text Message */}
              <div
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} mb-2`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === 'user'
                      ? 'bg-blue-500 text-white'
                      : message.role === 'system'
                      ? 'bg-slate-700 text-slate-300 text-center text-sm'
                      : 'bg-slate-700 text-slate-100'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  {message.metadata?.voice_transcription && (
                    <p className="text-xs opacity-70 mt-1 flex items-center gap-1">
                      🎤 Voice message
                      {message.metadata.confidence_score && (
                        <span>({Math.round(message.metadata.confidence_score * 100)}% confidence)</span>
                      )}
                    </p>
                  )}
                  <p className="text-xs opacity-70 mt-1">
                    {formatTimestamp(message.timestamp)}
                  </p>
                </div>
              </div>

              {/* Voice Message (if exists) */}
              {voiceMessages[message.id] && (
                <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className="max-w-[80%]">
                    <VoiceMessage
                      voiceMessage={voiceMessages[message.id]}
                      isOwn={message.role === 'user'}
                      onDelete={handleDeleteVoiceMessage}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-slate-700 rounded-lg p-3 max-w-[80%]">
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
                  <span className="text-slate-300">Thinking...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-slate-600 bg-slate-800">
          {isVoiceMode ? (
            <div className="flex items-center gap-3">
              <VoiceRecorder
                onTranscription={handleVoiceTranscription}
                onError={(error) => console.error('Voice recording error:', error)}
                disabled={isLoading || !currentSession}
                className="flex-1"
              />
              <button
                onClick={toggleVoiceMode}
                className="px-4 py-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors"
                title="Switch to text mode"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex gap-3">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={placeholder}
                disabled={isLoading || !currentSession}
                className="flex-1 bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 focus:outline-none disabled:opacity-50"
              />
              <button
                onClick={toggleVoiceMode}
                type="button"
                className="px-4 py-3 bg-slate-700 text-slate-400 rounded-lg hover:bg-slate-600 hover:text-green-400 transition-colors"
                title="Switch to voice mode"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                </svg>
              </button>
              <button
                type="submit"
                disabled={!input.trim() || isLoading || !currentSession}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                )}
                Send
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Insights Panel */}
      {showInsights && (
        <div className="w-96 flex-shrink-0 border-l border-slate-600 overflow-y-auto">
          <ConversationInsights />
        </div>
      )}
    </div>
  );
}