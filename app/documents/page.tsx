'use client';

import { useState, useEffect } from 'react';
import { DocumentProcessingService, DocumentUpload as DocumentUploadType } from '../lib/services/document-processing';
import DocumentUploadComponent from '../components/DocumentUpload';
import DocumentChat from '../components/DocumentChat';
import { useRouter } from 'next/navigation';

export default function DocumentsPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [documents, setDocuments] = useState<DocumentUploadType[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDocument, setSelectedDocument] = useState<DocumentUploadType | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      const userDocs = await DocumentProcessingService.getUserDocuments();
      setDocuments(userDocs);
    } catch (error) {
      console.error('Error loading documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadComplete = (document: DocumentUploadType) => {
    setDocuments(prev => [document, ...prev]);
    setShowUploadModal(false);
  };

  const handleUpgradeNeeded = () => {
    setShowUpgradeModal(true);
  };

  const handleDeleteDocument = async (documentId: string) => {
    if (!confirm('Are you sure you want to delete this document? This action cannot be undone.')) {
      return;
    }

    const success = await DocumentProcessingService.deleteDocument(documentId);
    if (success) {
      setDocuments(prev => prev.filter(doc => doc.id !== documentId));
      if (selectedDocument?.id === documentId) {
        setSelectedDocument(null);
      }
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return '✅';
      case 'processing':
        return '⏳';
      case 'failed':
        return '❌';
      default:
        return '📄';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-emerald-400';
      case 'processing':
        return 'text-yellow-400';
      case 'failed':
        return 'text-red-400';
      default:
        return 'text-slate-400';
    }
  };

  const getDocumentTypeIcon = (type: string) => {
    switch (type) {
      case 'contract':
        return '📋';
      case 'financial':
        return '💰';
      case 'process':
        return '⚙️';
      case 'research':
        return '🔬';
      default:
        return '📄';
    }
  };

  // Show loading state until client-side hydration complete
  if (!mounted) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading your documents...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">📄 Document Library</h1>
            <p className="text-slate-400">
              Upload and chat with your business documents using AI
            </p>
          </div>
          <button
            onClick={() => setShowUploadModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 transition-all duration-200"
          >
            + Upload Document
          </button>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Document List */}
          <div className="lg:col-span-2">
            {documents.length === 0 ? (
              <div className="bg-slate-800 rounded-xl border border-slate-600 p-8 text-center">
                <div className="text-6xl mb-4">📚</div>
                <h3 className="text-xl font-semibold text-white mb-2">No Documents Yet</h3>
                <p className="text-slate-400 mb-6">
                  Upload your first document to start chatting with AI about your content
                </p>
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
                >
                  Upload Your First Document
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {documents.map((document) => (
                  <div
                    key={document.id}
                    className={`bg-slate-800 rounded-xl border p-6 cursor-pointer transition-all duration-200 ${
                      selectedDocument?.id === document.id
                        ? 'border-blue-400 bg-blue-500/10'
                        : 'border-slate-600 hover:border-slate-500'
                    }`}
                    onClick={() => setSelectedDocument(document)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="text-2xl">
                          {getDocumentTypeIcon(document.document_type || 'other')}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-medium text-white">{document.file_name}</h3>
                            <span className={`text-sm ${getStatusColor(document.status)}`}>
                              {getStatusIcon(document.status)} {document.status}
                            </span>
                          </div>

                          {document.summary && (
                            <p className="text-slate-400 text-sm mb-2 line-clamp-2">
                              {document.summary}
                            </p>
                          )}

                          <div className="flex items-center gap-4 text-xs text-slate-500">
                            <span>{formatFileSize(document.file_size)}</span>
                            <span>{document.file_type.toUpperCase()}</span>
                            <span>{formatDate(document.uploaded_at)}</span>
                            <span>{document.chat_count} chats</span>
                          </div>

                          {document.tags && document.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {document.tags.map((tag, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 bg-slate-700 text-slate-300 text-xs rounded"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        {document.status === 'completed' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedDocument(document);
                            }}
                            className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
                          >
                            Chat
                          </button>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteDocument(document.id);
                          }}
                          className="p-2 text-slate-400 hover:text-red-400 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Document Chat / Preview */}
          <div className="lg:col-span-1">
            {selectedDocument ? (
              selectedDocument.status === 'completed' ? (
                <DocumentChat
                  document={selectedDocument}
                  onClose={() => setSelectedDocument(null)}
                />
              ) : (
                <div className="bg-slate-800 rounded-xl border border-slate-600 p-6">
                  <div className="text-center">
                    <div className="text-4xl mb-4">
                      {getStatusIcon(selectedDocument.status)}
                    </div>
                    <h3 className="font-medium text-white mb-2">
                      {selectedDocument.status === 'processing' ? 'Processing Document' : 'Processing Failed'}
                    </h3>
                    <p className="text-slate-400 text-sm">
                      {selectedDocument.status === 'processing'
                        ? 'Your document is being analyzed and will be ready for chat soon.'
                        : selectedDocument.error_message || 'Document processing failed. Please try uploading again.'}
                    </p>
                  </div>
                </div>
              )
            ) : (
              <div className="bg-slate-800 rounded-xl border border-slate-600 p-6">
                <div className="text-center">
                  <div className="text-4xl mb-4">💬</div>
                  <h3 className="font-medium text-white mb-2">Select a Document</h3>
                  <p className="text-slate-400 text-sm">
                    Choose a document from your library to start chatting with AI about its content.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Upload Document</h2>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <DocumentUploadComponent
                onUploadComplete={handleUploadComplete}
                onUpgradeNeeded={handleUpgradeNeeded}
              />
            </div>
          </div>
        </div>
      )}

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl max-w-lg w-full p-6">
            <div className="text-center">
              <div className="text-4xl mb-4">🚀</div>
              <h2 className="text-2xl font-bold text-white mb-4">Upgrade to Catalyst Plus</h2>
              <p className="text-slate-300 mb-6">
                Unlock document upload and chat with your business files using AI
              </p>

              <div className="bg-blue-500/10 border border-blue-400/20 rounded-lg p-4 mb-6">
                <div className="text-left space-y-2">
                  <div className="flex items-center gap-2 text-sm text-blue-300">
                    <span>✓</span>
                    <span>Upload unlimited documents</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-blue-300">
                    <span>✓</span>
                    <span>Chat with your files using AI</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-blue-300">
                    <span>✓</span>
                    <span>Unlimited coaching conversations</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-blue-300">
                    <span>✓</span>
                    <span>Advanced analytics & insights</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowUpgradeModal(false)}
                  className="flex-1 px-4 py-2 border border-slate-600 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => router.push('/pricing')}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 transition-all duration-200"
                >
                  Upgrade ($39/month)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}