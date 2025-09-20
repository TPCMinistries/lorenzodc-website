'use client';

import { useState, useRef, useEffect } from 'react';
import { DocumentProcessingService, DocumentUpload, SearchResult } from '../lib/services/document-processing';

interface DocumentChatProps {
  document: DocumentUpload;
  onClose?: () => void;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sourceChunks?: SearchResult[];
  timestamp: Date;
}

export default function DocumentChat({ document, onClose }: DocumentChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSources, setShowSources] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Add welcome message
    const welcomeMessage: ChatMessage = {
      id: 'welcome',
      role: 'assistant',
      content: `Hi! I'm ready to help you analyze "${document.file_name}". You can ask me questions about the content, request summaries, or get insights. What would you like to know?`,
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  }, [document]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Search for relevant document chunks
      const relevantChunks = await DocumentProcessingService.searchDocuments(
        input.trim(),
        undefined,
        document.id,
        5 // Get top 5 most relevant chunks
      );

      // Generate AI response with document context
      const response = await generateDocumentResponse(input.trim(), relevantChunks, document);

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        sourceChunks: relevantChunks,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Track document usage
      await DocumentProcessingService.incrementDocumentUsage?.(document.id);
    } catch (error) {
      console.error('Error generating response:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error while processing your question. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const generateDocumentResponse = async (
    query: string,
    relevantChunks: SearchResult[],
    document: DocumentUpload
  ): Promise<string> => {
    // Prepare context from relevant chunks
    const context = relevantChunks
      .map(chunk => `[Page ${chunk.page_number || 'Unknown'}]: ${chunk.content}`)
      .join('\n\n');

    const prompt = `You are an AI assistant helping to analyze a document titled "${document.file_name}".

Document Summary: ${document.summary || 'No summary available'}
Document Type: ${document.document_type || 'Unknown'}

Based on the following relevant content from the document, please answer the user's question:

RELEVANT CONTENT:
${context}

USER QUESTION: ${query}

Please provide a helpful, accurate response based on the document content. If the answer isn't in the provided content, say so clearly. Always reference specific parts of the document when possible.`;

    try {
      const response = await fetch('/api/ai/document-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          context: context,
          query: query,
          documentId: document.id
        })
      });

      if (!response.ok) throw new Error('Failed to generate response');

      const { response: aiResponse } = await response.json();
      return aiResponse;
    } catch (error) {
      console.error('Error calling AI API:', error);
      throw error;
    }
  };

  const suggestedQuestions = [
    "What are the key points in this document?",
    "Summarize the main findings",
    "What are the potential risks mentioned?",
    "Are there any action items or recommendations?",
    "What numbers or data are most important?"
  ];

  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-[600px] bg-slate-800 rounded-xl border border-slate-600">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-600">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
            <span className="text-blue-400">📄</span>
          </div>
          <div>
            <h3 className="font-medium text-white">{document.file_name}</h3>
            <p className="text-xs text-slate-400">
              {document.document_type} • {document.chat_count} previous chats
            </p>
          </div>
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
                  : 'bg-slate-700 text-slate-100'
              }`}
            >
              <p className="whitespace-pre-wrap">{message.content}</p>

              {/* Source chunks for assistant messages */}
              {message.role === 'assistant' && message.sourceChunks && message.sourceChunks.length > 0 && (
                <div className="mt-2">
                  <button
                    onClick={() => setShowSources(showSources === message.id ? null : message.id)}
                    className="text-xs text-blue-300 hover:text-blue-200 transition-colors"
                  >
                    📎 {message.sourceChunks.length} source{message.sourceChunks.length !== 1 ? 's' : ''}
                  </button>

                  {showSources === message.id && (
                    <div className="mt-2 space-y-2">
                      {message.sourceChunks.map((chunk, index) => (
                        <div key={chunk.chunk_id} className="bg-slate-600/50 rounded p-2 text-xs">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-slate-300">
                              Page {chunk.page_number || 'Unknown'}
                            </span>
                            <span className="text-slate-400">
                              {(chunk.similarity * 100).toFixed(0)}% relevant
                            </span>
                          </div>
                          <p className="text-slate-200">
                            {chunk.content.slice(0, 150)}
                            {chunk.content.length > 150 ? '...' : ''}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <p className="text-xs text-slate-400 mt-1">
                {formatTimestamp(message.timestamp)}
              </p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-700 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
                <span className="text-slate-300">Analyzing document...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Questions (show when no messages yet) */}
      {messages.length <= 1 && (
        <div className="p-4 border-t border-slate-600">
          <p className="text-sm text-slate-400 mb-2">Try asking:</p>
          <div className="flex flex-wrap gap-2">
            {suggestedQuestions.slice(0, 3).map((question, index) => (
              <button
                key={index}
                onClick={() => setInput(question)}
                className="text-xs bg-slate-700 hover:bg-slate-600 text-slate-300 px-3 py-1 rounded-full transition-colors"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-slate-600">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question about this document..."
            className="flex-1 bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 focus:outline-none"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}