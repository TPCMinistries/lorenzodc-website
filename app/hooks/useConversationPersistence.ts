'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { ConversationHistoryService, ChatSession, ChatMessage } from '../lib/services/conversation-history';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

interface UseConversationPersistenceOptions {
  sessionType?: 'coaching' | 'assessment' | 'document_chat' | 'general';
  autoSave?: boolean;
  saveInterval?: number; // milliseconds
}

export function useConversationPersistence(options: UseConversationPersistenceOptions = {}) {
  const {
    sessionType = 'coaching',
    autoSave = true,
    saveInterval = 2000 // 2 seconds
  } = options;

  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedMessageId, setLastSavedMessageId] = useState<string | null>(null);

  const saveTimeoutRef = useRef<NodeJS.Timeout>();
  const unsavedMessagesRef = useRef<Message[]>([]);

  // Initialize a new conversation session
  const startNewConversation = useCallback(async (title?: string) => {
    setIsLoading(true);
    try {
      const session = await ConversationHistoryService.createSession(sessionType, title);
      if (session) {
        setCurrentSession(session);
        setMessages([]);
        setLastSavedMessageId(null);
        unsavedMessagesRef.current = [];
      }
      return session;
    } catch (error) {
      console.error('Error starting new conversation:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [sessionType]);

  // Resume an existing conversation
  const resumeConversation = useCallback(async (sessionId: string) => {
    setIsLoading(true);
    try {
      const resumeData = await ConversationHistoryService.resumeConversation(sessionId);
      if (resumeData) {
        setCurrentSession(resumeData.session);

        // Convert database messages to UI format
        const uiMessages: Message[] = resumeData.recentMessages.map(msg => ({
          id: msg.id,
          role: msg.role,
          content: msg.content,
          timestamp: new Date(msg.created_at),
          metadata: msg.metadata
        }));

        setMessages(uiMessages);
        setLastSavedMessageId(uiMessages[uiMessages.length - 1]?.id || null);
        unsavedMessagesRef.current = [];
      }
      return resumeData;
    } catch (error) {
      console.error('Error resuming conversation:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Add a message to the conversation
  const addMessage = useCallback((
    role: 'user' | 'assistant' | 'system',
    content: string,
    metadata?: Record<string, any>
  ) => {
    const newMessage: Message = {
      id: `temp_${Date.now()}_${Math.random()}`,
      role,
      content,
      timestamp: new Date(),
      metadata
    };

    setMessages(prev => [...prev, newMessage]);
    unsavedMessagesRef.current = [...unsavedMessagesRef.current, newMessage];

    // Trigger auto-save if enabled
    if (autoSave && currentSession) {
      scheduleAutoSave();
    }

    return newMessage;
  }, [currentSession, autoSave]);

  // Schedule auto-save with debouncing
  const scheduleAutoSave = useCallback(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      saveUnsavedMessages();
    }, saveInterval);
  }, [saveInterval]);

  // Save unsaved messages to database
  const saveUnsavedMessages = useCallback(async () => {
    if (!currentSession || unsavedMessagesRef.current.length === 0 || isSaving) {
      return;
    }

    setIsSaving(true);
    try {
      const messagesToSave = [...unsavedMessagesRef.current];
      const savedMessageIds: string[] = [];

      for (const message of messagesToSave) {
        const savedMessage = await ConversationHistoryService.addMessage(
          currentSession.id,
          message.role,
          message.content,
          'text',
          message.metadata || {},
          calculateTokens(message.content)
        );

        if (savedMessage) {
          savedMessageIds.push(savedMessage.id);

          // Update the message ID in our local state
          setMessages(prev => prev.map(msg =>
            msg.id === message.id
              ? { ...msg, id: savedMessage.id }
              : msg
          ));
        }
      }

      // Clear saved messages from unsaved list
      unsavedMessagesRef.current = unsavedMessagesRef.current.filter(
        msg => !messagesToSave.includes(msg)
      );

      if (savedMessageIds.length > 0) {
        setLastSavedMessageId(savedMessageIds[savedMessageIds.length - 1]);
      }
    } catch (error) {
      console.error('Error saving messages:', error);
    } finally {
      setIsSaving(false);
    }
  }, [currentSession, isSaving]);

  // Manual save function
  const saveConversation = useCallback(async () => {
    await saveUnsavedMessages();
  }, [saveUnsavedMessages]);

  // Update session title
  const updateSessionTitle = useCallback(async (title: string) => {
    if (!currentSession) return false;

    const success = await ConversationHistoryService.updateSessionTitle(currentSession.id, title);
    if (success) {
      setCurrentSession(prev => prev ? { ...prev, session_title: title } : null);
    }
    return success;
  }, [currentSession]);

  // Generate smart title based on conversation
  const generateSmartTitle = useCallback(async () => {
    if (!currentSession || messages.length === 0) return null;

    try {
      const title = await ConversationHistoryService.generateSmartTitle(currentSession.id);
      if (title) {
        await updateSessionTitle(title);
      }
      return title;
    } catch (error) {
      console.error('Error generating smart title:', error);
      return null;
    }
  }, [currentSession, messages, updateSessionTitle]);

  // Clear current conversation
  const clearConversation = useCallback(() => {
    setCurrentSession(null);
    setMessages([]);
    setLastSavedMessageId(null);
    unsavedMessagesRef.current = [];

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
  }, []);

  // Auto-save on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      // Try to save any unsaved messages before unmounting
      if (unsavedMessagesRef.current.length > 0) {
        saveUnsavedMessages();
      }
    };
  }, [saveUnsavedMessages]);

  // Auto-generate title after first exchange
  useEffect(() => {
    if (currentSession && messages.length >= 2 && !currentSession.session_title) {
      // Wait a bit before generating title
      const titleTimeout = setTimeout(() => {
        generateSmartTitle();
      }, 3000);

      return () => clearTimeout(titleTimeout);
    }
  }, [currentSession, messages.length, generateSmartTitle]);

  return {
    // State
    currentSession,
    messages,
    isLoading,
    isSaving,
    hasUnsavedMessages: unsavedMessagesRef.current.length > 0,

    // Actions
    startNewConversation,
    resumeConversation,
    addMessage,
    saveConversation,
    updateSessionTitle,
    generateSmartTitle,
    clearConversation,

    // Utilities
    sessionId: currentSession?.id || null,
    sessionTitle: currentSession?.session_title || null,
    messageCount: messages.length
  };
}

// Helper function to estimate token count (rough estimation)
function calculateTokens(text: string): number {
  // Rough estimation: ~4 characters per token on average
  return Math.ceil(text.length / 4);
}