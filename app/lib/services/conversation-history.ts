// import { supabase } from supabase - temporarily disabled for deployment

export interface ChatSession {
  id: string;
  user_id: string;
  session_title?: string;
  session_type: 'coaching' | 'assessment' | 'document_chat' | 'general';
  message_count: number;
  last_message_at: string;
  preview_text?: string;
  context_summary?: string;
  key_topics: string[];
  is_active: boolean;
  is_pinned: boolean;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: string;
  session_id: string;
  user_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  message_type: 'text' | 'voice' | 'document_reference' | 'assessment_result';
  metadata: Record<string, any>;
  tokens_used?: number;
  referenced_document_id?: string;
  referenced_assessment_id?: string;
  created_at: string;
}

export interface ConversationSearch {
  session_id: string;
  session_title: string;
  message_content: string;
  message_created_at: string;
  relevance_rank: number;
}

export interface ConversationInsights {
  total_conversations: number;
  total_messages: number;
  avg_messages_per_session: number;
  most_active_day: string;
  primary_topics: string[];
  conversation_streak_days: number;
}

export class ConversationHistoryService {

  // Create a new chat session
  static async createSession(
    sessionType: ChatSession['session_type'] = 'coaching',
    initialTitle?: string
  ): Promise<ChatSession | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    try {
      const { data, error } = await supabase
        .from('chat_sessions')
        .insert({
          user_id: user.id,
          session_type: sessionType,
          session_title: initialTitle || null
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating chat session:', error);
      return null;
    }
  }

  // Add a message to a session
  static async addMessage(
    sessionId: string,
    role: ChatMessage['role'],
    content: string,
    messageType: ChatMessage['message_type'] = 'text',
    metadata: Record<string, any> = {},
    tokensUsed?: number
  ): Promise<ChatMessage | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .insert({
          session_id: sessionId,
          user_id: user.id,
          role,
          content,
          message_type: messageType,
          metadata,
          tokens_used: tokensUsed
        })
        .select()
        .single();

      if (error) throw error;

      // Auto-generate session title if this is the first user message
      if (role === 'user') {
        await this.maybeGenerateSessionTitle(sessionId);
      }

      return data;
    } catch (error) {
      console.error('Error adding message:', error);
      return null;
    }
  }

  // Get session messages
  static async getSessionMessages(sessionId: string): Promise<ChatMessage[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('session_id', sessionId)
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching session messages:', error);
      return [];
    }
  }

  // Get user's conversation history with premium gating
  static async getUserConversations(
    limit: number = 50,
    offset: number = 0
  ): Promise<ChatSession[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    try {
      const { data, error } = await supabase.rpc('get_user_conversations', {
        user_id_param: user.id,
        limit_param: limit,
        offset_param: offset
      });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching user conversations:', error);
      return [];
    }
  }

  // Search conversations
  static async searchConversations(
    query: string,
    limit: number = 20
  ): Promise<ConversationSearch[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    try {
      const { data, error } = await supabase.rpc('search_conversations', {
        user_id_param: user.id,
        search_query: query,
        limit_param: limit
      });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error searching conversations:', error);
      return [];
    }
  }

  // Update session title
  static async updateSessionTitle(sessionId: string, title: string): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('chat_sessions')
        .update({ session_title: title })
        .eq('id', sessionId)
        .eq('user_id', user.id);

      return !error;
    } catch (error) {
      console.error('Error updating session title:', error);
      return false;
    }
  }

  // Pin/unpin a conversation
  static async togglePinConversation(sessionId: string): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    try {
      // Get current pin status
      const { data: session } = await supabase
        .from('chat_sessions')
        .select('is_pinned')
        .eq('id', sessionId)
        .eq('user_id', user.id)
        .single();

      if (!session) return false;

      // Toggle pin status
      const { error } = await supabase
        .from('chat_sessions')
        .update({ is_pinned: !session.is_pinned })
        .eq('id', sessionId)
        .eq('user_id', user.id);

      return !error;
    } catch (error) {
      console.error('Error toggling pin status:', error);
      return false;
    }
  }

  // Delete a conversation
  static async deleteConversation(sessionId: string): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('chat_sessions')
        .delete()
        .eq('id', sessionId)
        .eq('user_id', user.id);

      return !error;
    } catch (error) {
      console.error('Error deleting conversation:', error);
      return false;
    }
  }

  // Get conversation insights
  static async getConversationInsights(): Promise<ConversationInsights | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    try {
      const { data, error } = await supabase.rpc('get_conversation_insights', {
        user_id_param: user.id
      });

      if (error) throw error;
      return data?.[0] || null;
    } catch (error) {
      console.error('Error fetching conversation insights:', error);
      return null;
    }
  }

  // Check if user can access full history (premium feature)
  static async canAccessFullHistory(): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    try {
      const { data: subscription } = await supabase
        .from('user_subscriptions')
        .select('tierId')
        .eq('userId', user.id)
        .eq('status', 'active')
        .single();

      return subscription?.tierId === 'catalyst_plus' || subscription?.tierId === 'enterprise';
    } catch (error) {
      return false;
    }
  }

  // Get history retention limit for user
  static async getHistoryRetentionDays(): Promise<number> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return 7; // Default to free tier

    try {
      const { data: subscription } = await supabase
        .from('user_subscriptions')
        .select('tierId')
        .eq('userId', user.id)
        .eq('status', 'active')
        .single();

      switch (subscription?.tierId) {
        case 'catalyst_plus':
        case 'enterprise':
          return -1; // Unlimited
        case 'catalyst_basic':
          return 90;
        default:
          return 7; // Free tier
      }
    } catch (error) {
      return 7;
    }
  }

  // Auto-generate session title based on first message
  private static async maybeGenerateSessionTitle(sessionId: string): Promise<void> {
    try {
      // Check if session already has a title
      const { data: session } = await supabase
        .from('chat_sessions')
        .select('session_title, message_count')
        .eq('id', sessionId)
        .single();

      if (!session || session.session_title || session.message_count > 1) {
        return; // Already has title or not the first message
      }

      // Generate title using database function
      const { data: title } = await supabase.rpc('generate_session_title', {
        session_id_param: sessionId
      });

      if (title) {
        await supabase
          .from('chat_sessions')
          .update({ session_title: title })
          .eq('id', sessionId);
      }
    } catch (error) {
      console.error('Error generating session title:', error);
    }
  }

  // Enhanced title generation using AI
  static async generateSmartTitle(sessionId: string): Promise<string | null> {
    try {
      // Get first few messages of the conversation
      const { data: messages } = await supabase
        .from('chat_messages')
        .select('role, content')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true })
        .limit(4);

      if (!messages || messages.length === 0) return null;

      // Prepare context for AI
      const conversationContext = messages
        .map(msg => `${msg.role}: ${msg.content}`)
        .join('\n');

      // Call AI API to generate title
      const response = await fetch('/api/ai/generate-title', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversation: conversationContext })
      });

      if (!response.ok) throw new Error('Title generation failed');

      const { title } = await response.json();
      return title;
    } catch (error) {
      console.error('Error generating smart title:', error);
      return null;
    }
  }

  // Continue conversation - resume context from previous session
  static async resumeConversation(sessionId: string): Promise<{
    session: ChatSession;
    recentMessages: ChatMessage[];
    contextSummary?: string;
  } | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    try {
      // Get session details
      const { data: session, error: sessionError } = await supabase
        .from('chat_sessions')
        .select('*')
        .eq('id', sessionId)
        .eq('user_id', user.id)
        .single();

      if (sessionError || !session) throw new Error('Session not found');

      // Get recent messages for context
      const { data: messages, error: messagesError } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: false })
        .limit(10);

      if (messagesError) throw messagesError;

      // Mark session as active again
      await supabase
        .from('chat_sessions')
        .update({ is_active: true, updated_at: new Date().toISOString() })
        .eq('id', sessionId);

      return {
        session,
        recentMessages: (messages || []).reverse(),
        contextSummary: session.context_summary
      };
    } catch (error) {
      console.error('Error resuming conversation:', error);
      return null;
    }
  }
}