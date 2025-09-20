'use client';

import { useState, useEffect } from 'react';
import { ConversationHistoryService, ChatSession } from '../lib/services/conversation-history';

interface ConversationHistoryProps {
  onSelectConversation?: (session: ChatSession) => void;
  onStartNewConversation?: () => void;
  isOpen: boolean;
  onToggle: () => void;
  className?: string;
}

export default function ConversationHistory({
  onSelectConversation,
  onStartNewConversation,
  isOpen,
  onToggle,
  className = ''
}: ConversationHistoryProps) {
  const [conversations, setConversations] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [canAccessFullHistory, setCanAccessFullHistory] = useState(false);
  const [retentionDays, setRetentionDays] = useState(7);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadConversations();
      checkHistoryAccess();
    }
  }, [isOpen]);

  const loadConversations = async () => {
    setLoading(true);
    try {
      const data = await ConversationHistoryService.getUserConversations(50, 0);
      setConversations(data);
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkHistoryAccess = async () => {
    const [hasFullAccess, retention] = await Promise.all([
      ConversationHistoryService.canAccessFullHistory(),
      ConversationHistoryService.getHistoryRetentionDays()
    ]);

    setCanAccessFullHistory(hasFullAccess);
    setRetentionDays(retention);
  };

  const handleSelectConversation = async (session: ChatSession) => {
    setSelectedSessionId(session.id);
    onSelectConversation?.(session);
  };

  const handlePinConversation = async (sessionId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    await ConversationHistoryService.togglePinConversation(sessionId);
    loadConversations(); // Refresh to show updated pin status
  };

  const handleDeleteConversation = async (sessionId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    if (confirm('Are you sure you want to delete this conversation? This action cannot be undone.')) {
      await ConversationHistoryService.deleteConversation(sessionId);
      loadConversations(); // Refresh list
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.session_title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.preview_text?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === now.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const getSessionIcon = (sessionType: string) => {
    switch (sessionType) {
      case 'assessment': return '📊';
      case 'document_chat': return '📄';
      case 'coaching': return '🎯';
      default: return '💬';
    }
  };

  const groupConversationsByDate = (conversations: ChatSession[]) => {
    const groups: Record<string, ChatSession[]> = {};

    conversations.forEach(conv => {
      const date = formatDate(conv.last_message_at);
      if (!groups[date]) groups[date] = [];
      groups[date].push(conv);
    });

    return groups;
  };

  const conversationGroups = groupConversationsByDate(filteredConversations);

  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        className="fixed left-4 top-1/2 transform -translate-y-1/2 z-50 bg-slate-800 hover:bg-slate-700 text-white p-3 rounded-r-lg shadow-lg transition-all duration-200"
        title="Show conversation history"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      </button>
    );
  }

  return (
    <div className={`bg-slate-800 border-r border-slate-600 flex flex-col h-full ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-600">
        <div className="flex items-center gap-2">
          <h2 className="font-semibold text-white">Chat History</h2>
          {!canAccessFullHistory && (
            <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded">
              {retentionDays === -1 ? 'Unlimited' : `${retentionDays} days`}
            </span>
          )}
        </div>
        <button
          onClick={onToggle}
          className="text-slate-400 hover:text-white transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* New Conversation Button */}
      <div className="p-4 border-b border-slate-600">
        <button
          onClick={onStartNewConversation}
          className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Conversation
        </button>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-slate-600">
        <input
          type="text"
          placeholder="Search conversations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-400 text-sm focus:border-blue-400 focus:ring-1 focus:ring-blue-400 focus:outline-none"
        />
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
          </div>
        ) : Object.keys(conversationGroups).length === 0 ? (
          <div className="p-4 text-center text-slate-400">
            <div className="text-4xl mb-2">💬</div>
            <p className="text-sm">No conversations yet</p>
            <p className="text-xs mt-1">Start a new chat to begin</p>
          </div>
        ) : (
          <div className="space-y-1">
            {Object.entries(conversationGroups).map(([date, conversations]) => (
              <div key={date}>
                {/* Date Header */}
                <div className="px-4 py-2 text-xs font-medium text-slate-400 uppercase tracking-wider">
                  {date}
                </div>

                {/* Conversations in this date group */}
                {conversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    onClick={() => handleSelectConversation(conversation)}
                    className={`mx-2 mb-1 p-3 rounded-lg cursor-pointer transition-all duration-200 group ${
                      selectedSessionId === conversation.id
                        ? 'bg-blue-500/20 border border-blue-400/30'
                        : 'hover:bg-slate-700/50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-2 flex-1 min-w-0">
                        <div className="text-lg mt-0.5 flex-shrink-0">
                          {getSessionIcon(conversation.session_type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium text-white text-sm truncate">
                              {conversation.session_title || 'Untitled Conversation'}
                            </h3>
                            {conversation.is_pinned && (
                              <svg className="w-3 h-3 text-yellow-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                              </svg>
                            )}
                          </div>
                          {conversation.preview_text && (
                            <p className="text-xs text-slate-400 line-clamp-2 mb-1">
                              {conversation.preview_text}
                            </p>
                          )}
                          <div className="flex items-center gap-2 text-xs text-slate-500">
                            <span>{conversation.message_count} messages</span>
                            <span>•</span>
                            <span>{formatDate(conversation.last_message_at)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => handlePinConversation(conversation.id, e)}
                          className="p-1 text-slate-400 hover:text-yellow-400 transition-colors"
                          title={conversation.is_pinned ? 'Unpin' : 'Pin conversation'}
                        >
                          <svg className="w-3 h-3" fill={conversation.is_pinned ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 20 20">
                            <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                          </svg>
                        </button>
                        <button
                          onClick={(e) => handleDeleteConversation(conversation.id, e)}
                          className="p-1 text-slate-400 hover:text-red-400 transition-colors"
                          title="Delete conversation"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Premium Upgrade Prompt */}
      {!canAccessFullHistory && (
        <div className="p-4 border-t border-slate-600">
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-400/20 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-blue-400">🚀</span>
              <span className="text-sm font-medium text-blue-300">Upgrade for More History</span>
            </div>
            <p className="text-xs text-slate-400 mb-3">
              {retentionDays === 7
                ? 'Free users get 7 days of history. Upgrade for unlimited conversations!'
                : `Basic users get ${retentionDays} days. Upgrade to Plus for unlimited history!`
              }
            </p>
            <button
              onClick={() => window.location.href = '/pricing'}
              className="w-full px-3 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 transition-all duration-200"
            >
              Upgrade Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
}