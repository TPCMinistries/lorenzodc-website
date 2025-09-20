"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ConversionTrackingService } from "../../lib/services/conversion-tracking";

export default function DocumentChatDemo() {
  const [mounted, setMounted] = useState(false);
  const [sessionId, setSessionId] = useState<string>("");
  const [question, setQuestion] = useState("What are the key findings and recommended actions?");
  const [answer, setAnswer] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const [asking, setAsking] = useState(false);
  const [fileName, setFileName] = useState<string>("");

  // Track page view
  useEffect(() => {
    setMounted(true);
    ConversionTrackingService.trackPageView('/enterprise/rag', undefined, {
      page_type: 'demo',
      demo_type: 'document_chat'
    });
  }, []);

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setFileName(file.name);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/rag/upload", {
        method: "POST",
        body: formData
      });

      const result = await response.json();
      setSessionId(result.sessionId);

      // Track successful upload
      ConversionTrackingService.trackConversion('engagement', {
        event: 'document_uploaded',
        content_type: 'document',
        content_category: 'rag_demo',
        metadata: {
          file_name: file.name,
          file_size: file.size
        }
      });

    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  }

  async function handleAskQuestion() {
    if (!sessionId || !question.trim()) return;

    setAsking(true);

    try {
      const response = await fetch("/api/rag/query", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: sessionId,
          question: question.trim()
        })
      });

      const result = await response.json();
      setAnswer(result);

      // Track successful query
      ConversionTrackingService.trackConversion('engagement', {
        event: 'document_query',
        content_type: 'question',
        content_category: 'rag_demo',
        metadata: {
          question_length: question.length,
          has_answer: !!result.answer
        }
      });

    } catch (error) {
      console.error('Query failed:', error);
      setAnswer({ error: 'Failed to process your question. Please try again.' });
    } finally {
      setAsking(false);
    }
  }

  const suggestedQuestions = [
    "What are the key findings and recommended actions?",
    "Summarize the main risks and mitigation strategies",
    "What are the top 3 priorities mentioned in this document?",
    "What budget or resource requirements are outlined?",
    "What timeline or deadlines are mentioned?"
  ];

  if (!mounted) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-emerald-950/90 to-slate-900/95" />

        {/* Floating geometric shapes */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-emerald-500/20 to-teal-600/20 rounded-3xl rotate-45 animate-float blur-xl"></div>
        <div className="absolute top-60 right-20 w-24 h-24 bg-gradient-to-br from-cyan-500/15 to-blue-600/15 rounded-full animate-float-delayed blur-lg"></div>
        <div className="absolute bottom-40 left-20 w-40 h-40 bg-gradient-to-br from-green-500/10 to-emerald-600/10 rounded-2xl rotate-12 animate-float blur-2xl"></div>
        <div className="absolute bottom-20 right-10 w-28 h-28 bg-gradient-to-br from-teal-500/20 to-cyan-600/20 rounded-full animate-float-delayed blur-xl"></div>

        {/* Animated grid overlay */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5 animate-grid-flow"></div>

        {/* Dynamic light beams */}
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-emerald-400/20 to-transparent animate-beam-1"></div>
        <div className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-transparent via-teal-400/15 to-transparent animate-beam-2"></div>
      </div>

      <div className="relative z-10 py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Enhanced Header */}
          <div className="text-center mb-12">
            <div className="relative inline-block mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 rounded-3xl blur-2xl opacity-30 animate-pulse-glow"></div>
              <h1 className="relative text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
                <span className="bg-gradient-to-r from-emerald-300 via-teal-300 to-cyan-300 bg-clip-text text-transparent animate-text-shimmer bg-size-200">
                  AI Document Intelligence
                </span>
              </h1>
            </div>

            <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8 leading-relaxed">
              Upload any PDF document and chat with it using AI. Get instant insights,
              summaries, and answers from your business documents.
            </p>

            {/* Enhanced Demo Notice */}
            <div className="relative max-w-2xl mx-auto">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl blur-xl"></div>
              <div className="relative bg-blue-500/10 backdrop-blur-xl border border-blue-400/30 rounded-2xl p-6">
                <div className="flex items-center justify-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center animate-pulse-bright">
                    <span className="text-white text-sm">🔒</span>
                  </div>
                  <span className="font-semibold text-blue-300 text-lg">Demo Mode</span>
                </div>
                <p className="text-blue-200 text-sm leading-relaxed">
                  Files are stored securely for 24 hours only. No sensitive data is retained.<br/>
                  Enterprise version includes permanent storage and advanced security.
                </p>
              </div>
            </div>
          </div>

          {/* Enhanced Main Interface */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-slate-800/30 to-emerald-900/20 rounded-3xl blur-xl"></div>
            <div className="relative bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 mb-8 shadow-2xl">
              {/* Step 1: Enhanced Upload */}
              <div className="mb-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full blur-lg opacity-50 animate-pulse-glow"></div>
                    <span className="relative w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-xl">1</span>
                  </div>
                  <h2 className="text-2xl font-semibold text-white">
                    Upload Your Document
                  </h2>
                </div>

                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-2xl blur-xl group-hover:from-emerald-500/20 group-hover:to-teal-500/20 transition-all duration-300"></div>
                  <div className="relative border-2 border-dashed border-slate-600 rounded-2xl p-8 text-center hover:border-emerald-500/50 transition-all duration-300 group-hover:bg-slate-700/30">
                    {!sessionId ? (
                      <div>
                        <div className="relative inline-block mb-6">
                          <div className="text-6xl mb-2 animate-float">📄</div>
                          <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-teal-400/20 rounded-full blur-xl animate-pulse-slow"></div>
                        </div>
                        <label className="cursor-pointer">
                          <input
                            type="file"
                            accept="application/pdf"
                            onChange={handleFileUpload}
                            className="hidden"
                            disabled={uploading}
                          />
                          <div className="relative group/button inline-flex items-center px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-semibold rounded-2xl transition-all duration-300 cursor-pointer shadow-2xl hover:shadow-emerald-500/25 transform hover:scale-105">
                            <div className="absolute inset-0 bg-gradient-to-r from-white/0 to-white/0 group-hover/button:from-white/10 group-hover/button:to-white/10 rounded-2xl transition-all duration-300"></div>
                            {uploading ? (
                              <>
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                                <span className="relative">Processing...</span>
                              </>
                            ) : (
                              <>
                                <span className="mr-3 text-xl">📤</span>
                                <span className="relative">Choose PDF File</span>
                              </>
                            )}
                          </div>
                        </label>
                        <p className="text-slate-400 mt-4 text-lg">
                          Upload reports, policies, contracts, or any business document (PDF only)
                        </p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <div className="relative inline-block mb-4">
                          <div className="text-6xl mb-2 animate-pulse-bright">✅</div>
                          <div className="absolute inset-0 bg-gradient-to-r from-green-400/30 to-emerald-400/30 rounded-full blur-xl"></div>
                        </div>
                        <p className="text-emerald-400 font-semibold text-xl mb-2">Document Uploaded Successfully!</p>
                        <p className="text-slate-300 mt-2 text-lg font-medium">{fileName}</p>
                        <button
                          onClick={() => {
                            setSessionId("");
                            setFileName("");
                            setAnswer(null);
                          }}
                          className="mt-4 px-4 py-2 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-400/10 rounded-lg transition-all duration-200 text-sm border border-cyan-400/30 hover:border-cyan-400/50"
                        >
                          Upload Different File
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Step 2: Enhanced Ask Questions */}
              {sessionId && (
                <div className="mb-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full blur-lg opacity-50 animate-pulse-glow"></div>
                      <span className="relative w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-xl">2</span>
                    </div>
                    <h2 className="text-2xl font-semibold text-white">
                      Ask Questions About Your Document
                    </h2>
                  </div>

                  <div className="space-y-6">
                    {/* Enhanced Question Input */}
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl blur-xl"></div>
                      <textarea
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        className="relative w-full bg-slate-700/50 backdrop-blur-xl border border-slate-600 rounded-2xl px-6 py-4 text-white text-lg focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition-all duration-300 resize-none shadow-xl hover:bg-slate-700/70"
                        rows={3}
                        placeholder="What would you like to know about this document?"
                      />
                    </div>

                    {/* Enhanced Suggested Questions */}
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-2xl animate-pulse-bright">💡</span>
                        <p className="text-slate-300 text-lg font-medium">Try these sample questions:</p>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        {suggestedQuestions.map((suggested, index) => (
                          <button
                            key={index}
                            onClick={() => setQuestion(suggested)}
                            className="group relative px-4 py-3 bg-slate-700/40 hover:bg-slate-600/60 border border-slate-600/50 hover:border-purple-500/50 text-slate-300 hover:text-white text-sm rounded-xl transition-all duration-300 backdrop-blur-sm hover:shadow-lg hover:shadow-purple-500/10 transform hover:scale-105"
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 to-pink-500/0 group-hover:from-purple-500/10 group-hover:to-pink-500/10 rounded-xl transition-all duration-300"></div>
                            <span className="relative">{suggested}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Enhanced Ask Button */}
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl blur-xl"></div>
                      <button
                        onClick={handleAskQuestion}
                        disabled={asking || !question.trim()}
                        className="relative w-full px-8 py-6 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-400 hover:to-pink-500 disabled:from-slate-600 disabled:to-slate-700 text-white font-semibold rounded-2xl transition-all duration-300 flex items-center justify-center gap-4 shadow-2xl hover:shadow-purple-500/25 transform hover:scale-105 disabled:transform-none disabled:hover:scale-100"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 to-white/0 hover:from-white/10 hover:to-white/10 rounded-2xl transition-all duration-300"></div>
                        {asking ? (
                          <>
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                            <span className="relative text-lg">AI is analyzing your document...</span>
                          </>
                        ) : (
                          <>
                            <span className="text-2xl">🤖</span>
                            <span className="relative text-lg">Get AI-Powered Answer</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Enhanced Results */}
              {answer && (
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full blur-lg opacity-50 animate-pulse-glow"></div>
                      <span className="relative w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-xl">3</span>
                    </div>
                    <h2 className="text-2xl font-semibold text-white">
                      AI Analysis Results
                    </h2>
                  </div>

                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-2xl blur-xl"></div>
                    <div className="relative bg-slate-700/40 backdrop-blur-xl border border-slate-600/50 rounded-2xl p-8 shadow-2xl">
                      {answer.error ? (
                        <div className="text-center">
                          <div className="relative inline-block mb-4">
                            <div className="text-6xl mb-2 animate-pulse-bright">⚠️</div>
                            <div className="absolute inset-0 bg-gradient-to-r from-red-400/30 to-orange-400/30 rounded-full blur-xl"></div>
                          </div>
                          <p className="font-semibold mb-3 text-red-400 text-xl">Error</p>
                          <p className="text-red-300 text-lg">{answer.error}</p>
                        </div>
                      ) : (
                        <div className="text-slate-200">
                          <div className="prose prose-invert max-w-none">
                            {typeof answer.answer === 'string' ? (
                              <div className="whitespace-pre-wrap text-lg leading-relaxed">
                                {answer.answer}
                              </div>
                            ) : (
                              <pre className="whitespace-pre-wrap text-sm bg-slate-800/60 p-6 rounded-xl overflow-auto border border-slate-600/30">
                                {JSON.stringify(answer, null, 2)}
                              </pre>
                            )}
                          </div>

                          {answer.citations && answer.citations.length > 0 && (
                            <div className="mt-8 pt-8 border-t border-slate-600/50">
                              <div className="flex items-center gap-3 mb-6">
                                <span className="text-3xl animate-pulse-bright">📚</span>
                                <h3 className="text-xl font-semibold text-white">Sources</h3>
                              </div>
                              <div className="space-y-4">
                                {answer.citations.map((citation: any, index: number) => (
                                  <div key={index} className="relative group">
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-cyan-500/5 rounded-xl group-hover:from-blue-500/10 group-hover:to-cyan-500/10 transition-all duration-300"></div>
                                    <div className="relative bg-slate-800/60 p-4 rounded-xl border border-slate-600/30 hover:border-blue-500/30 transition-all duration-300">
                                      <p className="text-slate-300 leading-relaxed">
                                        <span className="text-blue-400 font-medium">Page {citation.page || 'Unknown'}:</span> "{citation.text}"
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Enhanced CTA Section */}
          <div className="text-center relative">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-cyan-500/10 to-blue-500/10 rounded-3xl blur-2xl"></div>
            <div className="relative bg-gradient-to-r from-slate-800/60 to-slate-700/60 backdrop-blur-xl border border-slate-600/50 rounded-3xl p-10 shadow-2xl">
              <div className="relative inline-block mb-6">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 rounded-2xl blur-xl opacity-30 animate-pulse-glow"></div>
                <h3 className="relative text-3xl font-bold mb-2">
                  <span className="bg-gradient-to-r from-emerald-300 via-cyan-300 to-blue-300 bg-clip-text text-transparent">
                    Ready for Enterprise-Grade Document Intelligence?
                  </span>
                </h3>
              </div>

              <p className="text-slate-300 text-xl mb-8 max-w-3xl mx-auto leading-relaxed">
                Get unlimited document processing, advanced security, team collaboration,
                and integration with your existing systems.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center mb-8">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-2xl blur-xl"></div>
                  <button
                    onClick={() => {
                      ConversionTrackingService.trackConversion('lead', {
                        event: 'strategy_call_from_rag',
                        content_type: 'consultation',
                        content_category: 'document_chat_demo',
                        metadata: {
                          demo_used: !!sessionId,
                          questions_asked: answer ? 1 : 0
                        }
                      });
                      window.open('https://calendly.com/lorenzo-theglobalenterprise/discovery-call?utm_source=document_chat_demo&utm_medium=cta', '_blank');
                    }}
                    className="relative group px-10 py-5 bg-gradient-to-r from-emerald-500 to-cyan-600 hover:from-emerald-400 hover:to-cyan-500 text-white font-semibold rounded-2xl transition-all duration-300 shadow-2xl hover:shadow-emerald-500/25 transform hover:scale-105"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 to-white/0 group-hover:from-white/10 group-hover:to-white/10 rounded-2xl transition-all duration-300"></div>
                    <span className="relative text-lg">Schedule Enterprise Demo</span>
                  </button>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-600/20 to-slate-500/20 rounded-2xl blur-xl"></div>
                  <Link href="/enterprise/diagnostic">
                    <button className="relative group px-10 py-5 bg-slate-700/60 backdrop-blur-xl border border-slate-600/50 hover:border-slate-500/70 text-white rounded-2xl hover:bg-slate-600/70 transition-all duration-300 shadow-xl transform hover:scale-105">
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 to-white/0 group-hover:from-white/5 group-hover:to-white/5 rounded-2xl transition-all duration-300"></div>
                      <span className="relative text-lg font-semibold">Take AI Readiness Assessment</span>
                    </button>
                  </Link>
                </div>
              </div>

              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl blur-lg"></div>
                <div className="relative bg-slate-800/40 backdrop-blur-xl border border-slate-600/30 rounded-xl p-4">
                  <p className="text-slate-300 text-sm leading-relaxed">
                    <span className="text-emerald-400 font-semibold">Enterprise features:</span> Permanent storage • Advanced security • Team workspaces • API integrations
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}