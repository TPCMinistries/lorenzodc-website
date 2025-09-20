'use client';

import { useState, useRef, useEffect } from 'react';
import { useConversationPersistence } from '../hooks/useConversationPersistence';
import { ChatSession } from '../lib/services/conversation-history';
import ConversationHistory from './ConversationHistory';
import ConversationSearch from './ConversationSearch';
import ConversationInsights from './ConversationInsights';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

interface ChatInterfaceProps {
  sessionType?: 'coaching' | 'assessment' | 'document_chat' | 'general';
  welcomeMessage?: string;
  placeholder?: string;
  onMessage?: (message: Message) => void;
  className?: string;
}

export default function ChatInterface({
  sessionType = 'coaching',
  welcomeMessage = "Hi! I'm your AI coach. How can I help you today?",
  placeholder = "Type your message...",
  onMessage,
  className = ''
}: ChatInterfaceProps) {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showInsights, setShowInsights] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

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
    addMessage('user', userMessage);
    onMessage?.({
      id: `temp_${Date.now()}`,
      role: 'user',
      content: userMessage,
      timestamp: new Date()
    });

    try {
      // Generate AI response
      const response = await generateAIResponse(userMessage, messages);

      // Add assistant response
      const assistantMessage = addMessage('assistant', response);
      onMessage?.(assistantMessage);

    } catch (error) {
      console.error('Error generating response:', error);
      addMessage('assistant', 'Sorry, I encountered an error. Please try again.');
    } finally {
      setIsLoading(false);
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
    // Optionally scroll to the specific message or highlight it
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

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
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
                <p className="text-xs opacity-70 mt-1">
                  {formatTimestamp(message.timestamp)}
                </p>
              </div>
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