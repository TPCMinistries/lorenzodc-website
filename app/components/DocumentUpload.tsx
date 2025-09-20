'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { DocumentProcessingService } from '../lib/services/document-processing';

interface DocumentUploadProps {
  onUploadComplete?: (document: any) => void;
  onUpgradeNeeded?: () => void;
}

export default function DocumentUpload({ onUploadComplete, onUpgradeNeeded }: DocumentUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>('');
  const [canUpload, setCanUpload] = useState<boolean | null>(null);
  const [uploadLimits, setUploadLimits] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check upload permissions on component mount
  useEffect(() => {
    const checkPermissions = async () => {
      const [canUploadResult, limits] = await Promise.all([
        DocumentProcessingService.canUploadDocuments(),
        DocumentProcessingService.getUploadLimits()
      ]);

      setCanUpload(canUploadResult);
      setUploadLimits(limits);
    };

    checkPermissions();
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  }, []);

  const handleFileUpload = async (file: File) => {
    if (!canUpload) {
      onUpgradeNeeded?.();
      return;
    }

    // Validate file
    const validation = validateFile(file);
    if (!validation.valid) {
      alert(validation.error);
      return;
    }

    setUploading(true);
    setUploadProgress('Uploading file...');

    try {
      const document = await DocumentProcessingService.uploadDocument(file);

      if (document) {
        setUploadProgress('Processing document...');

        // Simulate processing progress
        const progressSteps = [
          'Extracting text...',
          'Analyzing content...',
          'Creating searchable chunks...',
          'Generating embeddings...',
          'Complete!'
        ];

        for (let i = 0; i < progressSteps.length; i++) {
          setUploadProgress(progressSteps[i]);
          await new Promise(resolve => setTimeout(resolve, 1000));
        }

        onUploadComplete?.(document);
        setUploadProgress('');
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
      setUploadProgress('');
    }
  };

  const validateFile = (file: File) => {
    if (!uploadLimits) {
      return { valid: false, error: 'Upload limits not loaded' };
    }

    // Check file type
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (!fileExtension || !uploadLimits.allowedTypes.includes(fileExtension)) {
      return {
        valid: false,
        error: `File type not supported. Allowed types: ${uploadLimits.allowedTypes.join(', ')}`
      };
    }

    // Check file size
    if (file.size > uploadLimits.maxFileSize) {
      return {
        valid: false,
        error: `File too large. Maximum size: ${formatFileSize(uploadLimits.maxFileSize)}`
      };
    }

    // Check document count limit
    if (uploadLimits.currentCount >= uploadLimits.maxDocuments) {
      return {
        valid: false,
        error: `Document limit reached (${uploadLimits.maxDocuments} max)`
      };
    }

    return { valid: true };
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (canUpload === null) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!canUpload) {
    return (
      <div className="border-2 border-dashed border-slate-600 rounded-xl p-8 text-center bg-slate-800/50">
        <div className="mb-4">
          <svg className="mx-auto h-12 w-12 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
          </svg>
        </div>

        <h3 className="text-lg font-medium text-white mb-2">
          📄 Document Upload
        </h3>
        <p className="text-slate-400 mb-4">
          Upload your business documents and chat with them using AI
        </p>

        <div className="bg-blue-500/10 border border-blue-400/20 rounded-lg p-4 mb-4">
          <p className="text-blue-300 font-medium mb-2">🔒 Premium Feature</p>
          <p className="text-blue-400 text-sm">
            Upload contracts, financials, processes, and research documents for AI analysis
          </p>
        </div>

        <button
          onClick={onUpgradeNeeded}
          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 transition-all duration-200"
        >
          Upgrade to Plus ($39/month)
        </button>

        <p className="text-slate-500 text-xs mt-3">
          Includes unlimited chats + document analysis
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
          isDragging
            ? 'border-blue-400 bg-blue-500/10'
            : uploading
            ? 'border-yellow-400 bg-yellow-500/10'
            : 'border-slate-600 bg-slate-800/50 hover:border-slate-500'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx,.txt,.md"
          onChange={handleFileSelect}
          className="hidden"
        />

        {uploading ? (
          <div className="space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto"></div>
            <div>
              <h3 className="text-lg font-medium text-white mb-2">Processing Document</h3>
              <p className="text-yellow-400">{uploadProgress}</p>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-4">
              <svg
                className={`mx-auto h-12 w-12 ${
                  isDragging ? 'text-blue-400' : 'text-slate-500'
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
                />
              </svg>
            </div>

            <h3 className="text-lg font-medium text-white mb-2">
              {isDragging ? 'Drop your document here' : 'Upload Document'}
            </h3>
            <p className="text-slate-400 mb-4">
              Drag and drop or click to select files
            </p>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
            >
              Choose File
            </button>
          </div>
        )}
      </div>

      {/* Upload Info */}
      {uploadLimits && (
        <div className="bg-slate-800/30 rounded-lg p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-slate-400">Documents</p>
              <p className="text-white font-medium">
                {uploadLimits.currentCount} / {uploadLimits.maxDocuments}
              </p>
            </div>
            <div>
              <p className="text-slate-400">Max File Size</p>
              <p className="text-white font-medium">
                {formatFileSize(uploadLimits.maxFileSize)}
              </p>
            </div>
            <div>
              <p className="text-slate-400">Supported Types</p>
              <p className="text-white font-medium">
                {uploadLimits.allowedTypes.join(', ').toUpperCase()}
              </p>
            </div>
            <div>
              <p className="text-slate-400">Processing</p>
              <p className="text-white font-medium">Instant AI Analysis</p>
            </div>
          </div>
        </div>
      )}

      {/* Feature Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-800/30 rounded-lg p-4 text-center">
          <div className="text-2xl mb-2">💬</div>
          <h4 className="font-medium text-white mb-1">Chat with Documents</h4>
          <p className="text-slate-400 text-sm">Ask questions about your uploaded content</p>
        </div>
        <div className="bg-slate-800/30 rounded-lg p-4 text-center">
          <div className="text-2xl mb-2">🔍</div>
          <h4 className="font-medium text-white mb-1">AI Analysis</h4>
          <p className="text-slate-400 text-sm">Get insights and summaries instantly</p>
        </div>
        <div className="bg-slate-800/30 rounded-lg p-4 text-center">
          <div className="text-2xl mb-2">🔒</div>
          <h4 className="font-medium text-white mb-1">Secure & Private</h4>
          <p className="text-slate-400 text-sm">Your documents are encrypted and private</p>
        </div>
      </div>
    </div>
  );
}