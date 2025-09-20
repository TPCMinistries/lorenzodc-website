// import { supabase } from supabase - temporarily disabled for deployment

export interface DocumentUpload {
  id: string;
  user_id: string;
  file_name: string;
  file_type: string;
  file_size: number;
  file_url?: string;
  status: 'processing' | 'completed' | 'failed' | 'deleted';
  error_message?: string;
  raw_text?: string;
  summary?: string;
  key_insights?: string[];
  document_type?: string;
  tags?: string[];
  chat_count: number;
  last_accessed: string;
  uploaded_at: string;
  processed_at?: string;
}

export interface DocumentChunk {
  id: string;
  document_id: string;
  user_id: string;
  chunk_index: number;
  content: string;
  content_length: number;
  embedding?: number[];
  page_number?: number;
  section_title?: string;
}

export interface DocumentChatSession {
  id: string;
  user_id: string;
  document_id: string;
  session_name?: string;
  question_count: number;
  relevant_chunks: string[];
  key_topics: string[];
  created_at: string;
  last_activity: string;
}

export interface SearchResult {
  chunk_id: string;
  document_id: string;
  content: string;
  similarity: number;
  page_number?: number;
  section_title?: string;
}

export class DocumentProcessingService {

  // Upload a document file to Supabase Storage
  static async uploadDocument(file: File): Promise<DocumentUpload | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    try {
      // Generate unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}-${file.name}`;

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('user-documents')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('user-documents')
        .getPublicUrl(uploadData.path);

      // Create document record
      const documentData = {
        user_id: user.id,
        file_name: file.name,
        file_type: fileExt?.toLowerCase() || 'unknown',
        file_size: file.size,
        file_url: urlData.publicUrl,
        status: 'processing' as const,
        document_type: this.inferDocumentType(file.name)
      };

      const { data, error } = await supabase
        .from('user_documents')
        .insert(documentData)
        .select()
        .single();

      if (error) throw error;

      // Start processing
      this.processDocument(data.id);

      return data;
    } catch (error) {
      console.error('Error uploading document:', error);
      return null;
    }
  }

  // Process document: extract text, chunk, and create embeddings
  static async processDocument(documentId: string): Promise<boolean> {
    try {
      // Get document
      const { data: document } = await supabase
        .from('user_documents')
        .select('*')
        .eq('id', documentId)
        .single();

      if (!document) throw new Error('Document not found');

      // Update status to processing
      await supabase
        .from('user_documents')
        .update({ status: 'processing' })
        .eq('id', documentId);

      // Extract text based on file type
      const extractedText = await this.extractTextFromFile(document.file_url, document.file_type);

      if (!extractedText) {
        await this.markDocumentFailed(documentId, 'Failed to extract text from document');
        return false;
      }

      // Generate summary and insights
      const [summary, insights] = await Promise.all([
        this.generateDocumentSummary(extractedText),
        this.generateDocumentInsights(extractedText)
      ]);

      // Update document with extracted content
      await supabase
        .from('user_documents')
        .update({
          raw_text: extractedText,
          summary: summary,
          key_insights: insights,
          status: 'processing'
        })
        .eq('id', documentId);

      // Create chunks
      const chunks = this.createTextChunks(extractedText, document.file_type);
      await this.saveDocumentChunks(documentId, document.user_id, chunks);

      // Generate embeddings for chunks
      await this.generateChunkEmbeddings(documentId);

      // Mark as completed
      await supabase
        .from('user_documents')
        .update({
          status: 'completed',
          processed_at: new Date().toISOString()
        })
        .eq('id', documentId);

      return true;
    } catch (error) {
      console.error('Error processing document:', error);
      await this.markDocumentFailed(documentId, error.message);
      return false;
    }
  }

  // Extract text from different file types
  private static async extractTextFromFile(fileUrl: string, fileType: string): Promise<string | null> {
    try {
      // For MVP, we'll use a simple text extraction
      // In production, you'd use specialized libraries for each file type

      const response = await fetch('/api/documents/extract-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileUrl, fileType })
      });

      if (!response.ok) throw new Error('Text extraction failed');

      const { text } = await response.json();
      return text;
    } catch (error) {
      console.error('Error extracting text:', error);
      return null;
    }
  }

  // Create text chunks for RAG
  private static createTextChunks(text: string, fileType: string): Array<{
    content: string;
    chunk_index: number;
    page_number?: number;
    section_title?: string;
  }> {
    const chunks = [];
    const chunkSize = 1000; // ~1000 characters per chunk
    const overlap = 200; // 200 character overlap

    // Simple chunking strategy - can be improved with semantic chunking
    for (let i = 0; i < text.length; i += chunkSize - overlap) {
      const chunk = text.slice(i, i + chunkSize);

      if (chunk.trim().length === 0) continue;

      chunks.push({
        content: chunk.trim(),
        chunk_index: chunks.length,
        page_number: Math.floor(i / 2000) + 1, // Rough page estimation
        section_title: this.extractSectionTitle(chunk)
      });
    }

    return chunks;
  }

  // Save chunks to database
  private static async saveDocumentChunks(
    documentId: string,
    userId: string,
    chunks: Array<{
      content: string;
      chunk_index: number;
      page_number?: number;
      section_title?: string;
    }>
  ): Promise<void> {
    const chunkData = chunks.map(chunk => ({
      document_id: documentId,
      user_id: userId,
      chunk_index: chunk.chunk_index,
      content: chunk.content,
      content_length: chunk.content.length,
      page_number: chunk.page_number,
      section_title: chunk.section_title
    }));

    const { error } = await supabase
      .from('document_chunks')
      .insert(chunkData);

    if (error) throw error;
  }

  // Generate embeddings for all chunks of a document
  private static async generateChunkEmbeddings(documentId: string): Promise<void> {
    // Get all chunks for this document
    const { data: chunks } = await supabase
      .from('document_chunks')
      .select('id, content')
      .eq('document_id', documentId);

    if (!chunks) return;

    // Generate embeddings in batches
    const batchSize = 10;
    for (let i = 0; i < chunks.length; i += batchSize) {
      const batch = chunks.slice(i, i + batchSize);

      const embeddings = await this.generateEmbeddings(
        batch.map(chunk => chunk.content)
      );

      // Update chunks with embeddings
      for (let j = 0; j < batch.length; j++) {
        await supabase
          .from('document_chunks')
          .update({ embedding: embeddings[j] })
          .eq('id', batch[j].id);
      }

      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  // Generate embeddings using OpenAI
  private static async generateEmbeddings(texts: string[]): Promise<number[][]> {
    try {
      const response = await fetch('/api/embeddings/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ texts })
      });

      if (!response.ok) throw new Error('Embedding generation failed');

      const { embeddings } = await response.json();
      return embeddings;
    } catch (error) {
      console.error('Error generating embeddings:', error);
      throw error;
    }
  }

  // Search for relevant document chunks
  static async searchDocuments(
    query: string,
    userId?: string,
    documentId?: string,
    limit: number = 10
  ): Promise<SearchResult[]> {
    try {
      // Generate embedding for query
      const [queryEmbedding] = await this.generateEmbeddings([query]);

      // Get current user if not provided
      if (!userId) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');
        userId = user.id;
      }

      // Search using the database function
      const { data, error } = await supabase.rpc('search_document_chunks', {
        query_embedding: queryEmbedding,
        user_id_param: userId,
        document_id_param: documentId,
        match_threshold: 0.7,
        match_count: limit
      });

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error searching documents:', error);
      return [];
    }
  }

  // Get user's documents
  static async getUserDocuments(userId?: string): Promise<DocumentUpload[]> {
    if (!userId) {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];
      userId = user.id;
    }

    const { data, error } = await supabase
      .from('user_documents')
      .select('*')
      .eq('user_id', userId)
      .neq('status', 'deleted')
      .order('uploaded_at', { ascending: false });

    if (error) {
      console.error('Error fetching user documents:', error);
      return [];
    }

    return data || [];
  }

  // Delete a document
  static async deleteDocument(documentId: string): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Mark as deleted (soft delete)
      const { error } = await supabase
        .from('user_documents')
        .update({ status: 'deleted' })
        .eq('id', documentId)
        .eq('user_id', user.id);

      return !error;
    } catch (error) {
      console.error('Error deleting document:', error);
      return false;
    }
  }

  // Helper functions
  private static inferDocumentType(fileName: string): string {
    const name = fileName.toLowerCase();

    if (name.includes('contract') || name.includes('agreement')) return 'contract';
    if (name.includes('financial') || name.includes('budget') || name.includes('revenue')) return 'financial';
    if (name.includes('process') || name.includes('procedure') || name.includes('workflow')) return 'process';
    if (name.includes('research') || name.includes('analysis') || name.includes('report')) return 'research';

    return 'other';
  }

  private static extractSectionTitle(chunk: string): string | undefined {
    // Simple section title extraction - look for lines that might be headers
    const lines = chunk.split('\n');
    for (const line of lines.slice(0, 3)) { // Check first 3 lines
      const trimmed = line.trim();
      if (trimmed.length > 0 && trimmed.length < 100 && !trimmed.includes('.')) {
        return trimmed;
      }
    }
    return undefined;
  }

  private static async generateDocumentSummary(text: string): Promise<string> {
    try {
      const response = await fetch('/api/ai/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: text.slice(0, 4000) }) // Limit for API
      });

      if (!response.ok) throw new Error('Summary generation failed');

      const { summary } = await response.json();
      return summary;
    } catch (error) {
      console.error('Error generating summary:', error);
      return 'Summary generation failed';
    }
  }

  private static async generateDocumentInsights(text: string): Promise<string[]> {
    try {
      const response = await fetch('/api/ai/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: text.slice(0, 4000) }) // Limit for API
      });

      if (!response.ok) throw new Error('Insights generation failed');

      const { insights } = await response.json();
      return insights;
    } catch (error) {
      console.error('Error generating insights:', error);
      return [];
    }
  }

  private static async markDocumentFailed(documentId: string, errorMessage: string): Promise<void> {
    await supabase
      .from('user_documents')
      .update({
        status: 'failed',
        error_message: errorMessage
      })
      .eq('id', documentId);
  }

  // Check if user can upload documents (premium feature)
  static async canUploadDocuments(): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    // Check subscription
    const { data: subscription } = await supabase
      .from('user_subscriptions')
      .select('tierId')
      .eq('userId', user.id)
      .eq('status', 'active')
      .single();

    // Only Plus and Enterprise can upload documents
    return subscription?.tierId === 'catalyst_plus' || subscription?.tierId === 'enterprise';
  }

  // Get document upload limits
  static async getUploadLimits(): Promise<{
    canUpload: boolean;
    maxFileSize: number; // in bytes
    maxDocuments: number;
    allowedTypes: string[];
    currentCount: number;
  }> {
    const canUpload = await this.canUploadDocuments();

    if (!canUpload) {
      return {
        canUpload: false,
        maxFileSize: 0,
        maxDocuments: 0,
        allowedTypes: [],
        currentCount: 0
      };
    }

    // Get current document count
    const { data: { user } } = await supabase.auth.getUser();
    const { count } = await supabase
      .from('user_documents')
      .select('id', { count: 'exact' })
      .eq('user_id', user!.id)
      .neq('status', 'deleted');

    return {
      canUpload: true,
      maxFileSize: 10 * 1024 * 1024, // 10MB
      maxDocuments: 100, // Per user
      allowedTypes: ['pdf', 'docx', 'txt', 'md'],
      currentCount: count || 0
    };
  }

  // Increment document usage tracking
  static async incrementDocumentUsage(documentId: string): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase.rpc('increment_document_usage', {
        document_id_param: documentId
      });
    } catch (error) {
      console.error('Error tracking document usage:', error);
    }
  }
}