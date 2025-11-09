'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AIAssessmentPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Header */}
      <div className="border-b border-slate-700 bg-slate-900/95 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                AI Readiness Assessment
              </h1>
              <p className="text-slate-400 mt-1">Discover your AI implementation potential</p>
            </div>
            <button
              onClick={() => router.push('/chat')}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm transition-colors"
            >
              Back to Chat
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-6">AI Assessment Coming Soon</h2>
          <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
            We're building a comprehensive AI readiness assessment to help you understand your organization's AI potential and create a personalized implementation roadmap.
          </p>
          <div className="space-y-4 max-w-md mx-auto">
            <button
              onClick={() => router.push('/chat')}
              className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200"
            >
              Start AI Strategy Chat
            </button>
            <button
              onClick={() => router.push('/enterprise/roi')}
              className="w-full bg-slate-800 hover:bg-slate-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200"
            >
              Calculate AI ROI
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}