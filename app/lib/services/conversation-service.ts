/**
 * Conversation Service
 * Handles chat conversation persistence with Supabase
 */

import { supabase } from '../../lib/supabase/client';

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  message_type?: 'text' | 'voice' | 'document_reference' | 'assessment_result';
  metadata?: any;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt?: Date;
  session_type?: 'coaching' | 'assessment' | 'document_chat' | 'general';
  message_count?: number;
  is_pinned?: boolean;
  preview_text?: string;
}

/**
 * Save or update a conversation
 */
export async function saveConversation(conversation: Conversation, userId?: string): Promise<void> {
  try {
    // Get current user if not provided
    const { data: { user } } = await supabase.auth.getUser();
    const currentUserId = userId || user?.id;

    if (!currentUserId) {
      throw new Error('User must be authenticated to save conversations');
    }

    // Check if session already exists
    const { data: existingSession } = await supabase
      .from('chat_sessions')
      .select('id')
      .eq('id', conversation.id)
      .single();

    if (existingSession) {
      // Update existing session
      const { error: sessionError } = await supabase
        .from('chat_sessions')
        .update({
          session_title: conversation.title,
          updated_at: new Date().toISOString(),
          session_type: conversation.session_type || 'coaching',
          is_pinned: conversation.is_pinned || false,
        })
        .eq('id', conversation.id);

      if (sessionError) throw sessionError;

      // Get existing message IDs
      const { data: existingMessages } = await supabase
        .from('chat_messages')
        .select('id')
        .eq('session_id', conversation.id);

      const existingMessageIds = new Set(existingMessages?.map(m => m.id) || []);

      // Only insert new messages
      const newMessages = conversation.messages.filter(m => !existingMessageIds.has(m.id));

      if (newMessages.length > 0) {
        const { error: messagesError } = await supabase
          .from('chat_messages')
          .insert(
            newMessages.map(msg => ({
              id: msg.id,
              session_id: conversation.id,
              user_id: currentUserId,
              role: msg.role,
              content: msg.content,
              message_type: msg.message_type || 'text',
              metadata: msg.metadata || {},
              created_at: msg.timestamp.toISOString(),
            }))
          );

        if (messagesError) throw messagesError;
      }
    } else {
      // Create new session
      const { error: sessionError } = await supabase
        .from('chat_sessions')
        .insert({
          id: conversation.id,
          user_id: currentUserId,
          session_title: conversation.title,
          session_type: conversation.session_type || 'coaching',
          message_count: conversation.messages.length,
          is_pinned: conversation.is_pinned || false,
          preview_text: conversation.messages[0]?.content.slice(0, 100) || '',
          created_at: conversation.createdAt.toISOString(),
          updated_at: new Date().toISOString(),
        });

      if (sessionError) throw sessionError;

      // Insert all messages
      if (conversation.messages.length > 0) {
        const { error: messagesError } = await supabase
          .from('chat_messages')
          .insert(
            conversation.messages.map(msg => ({
              id: msg.id,
              session_id: conversation.id,
              user_id: currentUserId,
              role: msg.role,
              content: msg.content,
              message_type: msg.message_type || 'text',
              metadata: msg.metadata || {},
              created_at: msg.timestamp.toISOString(),
            }))
          );

        if (messagesError) throw messagesError;
      }
    }
  } catch (error) {
    console.error('Error saving conversation:', error);
    throw error;
  }
}

/**
 * Get all conversations for the current user
 */
export async function getConversations(userId?: string): Promise<Conversation[]> {
  try {
    // Get current user if not provided
    const { data: { user } } = await supabase.auth.getUser();
    const currentUserId = userId || user?.id;

    if (!currentUserId) {
      // Return empty array for unauthenticated users
      return [];
    }

    // Fetch sessions
    const { data: sessions, error: sessionsError } = await supabase
      .from('chat_sessions')
      .select('*')
      .eq('user_id', currentUserId)
      .order('updated_at', { ascending: false });

    if (sessionsError) throw sessionsError;

    if (!sessions || sessions.length === 0) {
      return [];
    }

    // Fetch all messages for these sessions
    const sessionIds = sessions.map(s => s.id);
    const { data: messages, error: messagesError } = await supabase
      .from('chat_messages')
      .select('*')
      .in('session_id', sessionIds)
      .order('created_at', { ascending: true });

    if (messagesError) throw messagesError;

    // Group messages by session
    const messagesBySession = new Map<string, Message[]>();
    messages?.forEach(msg => {
      if (!messagesBySession.has(msg.session_id)) {
        messagesBySession.set(msg.session_id, []);
      }
      messagesBySession.get(msg.session_id)!.push({
        id: msg.id,
        role: msg.role,
        content: msg.content,
        timestamp: new Date(msg.created_at),
        message_type: msg.message_type,
        metadata: msg.metadata,
      });
    });

    // Build conversation objects
    const conversations: Conversation[] = sessions.map(session => ({
      id: session.id,
      title: session.session_title || 'Untitled Conversation',
      messages: messagesBySession.get(session.id) || [],
      createdAt: new Date(session.created_at),
      updatedAt: new Date(session.updated_at),
      session_type: session.session_type,
      message_count: session.message_count,
      is_pinned: session.is_pinned,
      preview_text: session.preview_text,
    }));

    return conversations;
  } catch (error) {
    console.error('Error getting conversations:', error);
    return [];
  }
}

/**
 * Delete a conversation
 */
export async function deleteConversation(conversationId: string, userId?: string): Promise<void> {
  try {
    // Get current user if not provided
    const { data: { user } } = await supabase.auth.getUser();
    const currentUserId = userId || user?.id;

    if (!currentUserId) {
      throw new Error('User must be authenticated to delete conversations');
    }

    // Delete session (messages will cascade delete due to ON DELETE CASCADE)
    const { error } = await supabase
      .from('chat_sessions')
      .delete()
      .eq('id', conversationId)
      .eq('user_id', currentUserId); // Ensure user owns this conversation

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting conversation:', error);
    throw error;
  }
}

/**
 * Search conversations
 */
export async function searchConversations(
  searchQuery: string,
  userId?: string
): Promise<Conversation[]> {
  try {
    // Get current user if not provided
    const { data: { user } } = await supabase.auth.getUser();
    const currentUserId = userId || user?.id;

    if (!currentUserId || !searchQuery.trim()) {
      return [];
    }

    // Call the search function
    const { data, error } = await supabase
      .rpc('search_conversations', {
        user_id_param: currentUserId,
        search_query: searchQuery,
        limit_param: 20
      });

    if (error) throw error;

    // Get unique session IDs
    const sessionIds = [...new Set(data?.map((item: any) => item.session_id) || [])];

    if (sessionIds.length === 0) {
      return [];
    }

    // Fetch full conversations
    return getConversations(currentUserId);
  } catch (error) {
    console.error('Error searching conversations:', error);
    return [];
  }
}

/**
 * Get a single conversation by ID
 */
export async function getConversation(
  conversationId: string,
  userId?: string
): Promise<Conversation | null> {
  try {
    // Get current user if not provided
    const { data: { user } } = await supabase.auth.getUser();
    const currentUserId = userId || user?.id;

    if (!currentUserId) {
      return null;
    }

    // Fetch session
    const { data: session, error: sessionError } = await supabase
      .from('chat_sessions')
      .select('*')
      .eq('id', conversationId)
      .eq('user_id', currentUserId)
      .single();

    if (sessionError || !session) {
      return null;
    }

    // Fetch messages
    const { data: messages, error: messagesError } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('session_id', conversationId)
      .order('created_at', { ascending: true });

    if (messagesError) {
      throw messagesError;
    }

    return {
      id: session.id,
      title: session.session_title || 'Untitled Conversation',
      messages: messages?.map(msg => ({
        id: msg.id,
        role: msg.role,
        content: msg.content,
        timestamp: new Date(msg.created_at),
        message_type: msg.message_type,
        metadata: msg.metadata,
      })) || [],
      createdAt: new Date(session.created_at),
      updatedAt: new Date(session.updated_at),
      session_type: session.session_type,
      message_count: session.message_count,
      is_pinned: session.is_pinned,
      preview_text: session.preview_text,
    };
  } catch (error) {
    console.error('Error getting conversation:', error);
    return null;
  }
}

/**
 * Toggle pin status for a conversation
 */
export async function togglePinConversation(
  conversationId: string,
  userId?: string
): Promise<void> {
  try {
    // Get current user if not provided
    const { data: { user } } = await supabase.auth.getUser();
    const currentUserId = userId || user?.id;

    if (!currentUserId) {
      throw new Error('User must be authenticated');
    }

    // Get current pin status
    const { data: session } = await supabase
      .from('chat_sessions')
      .select('is_pinned')
      .eq('id', conversationId)
      .eq('user_id', currentUserId)
      .single();

    if (!session) {
      throw new Error('Conversation not found');
    }

    // Toggle pin status
    const { error } = await supabase
      .from('chat_sessions')
      .update({ is_pinned: !session.is_pinned })
      .eq('id', conversationId)
      .eq('user_id', currentUserId);

    if (error) throw error;
  } catch (error) {
    console.error('Error toggling pin:', error);
    throw error;
  }
}
