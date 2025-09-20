"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ConversionTrackingService } from "../../lib/services/conversion-tracking";
import { EmailAutomationService } from "../../lib/services/email-automation";
import jsPDF from 'jspdf';

const questions = [
  {
    id: "ai_familiarity",
    question: "How familiar is your leadership team with AI capabilities and limitations?",
    options: [
      { value: 1, text: "Limited understanding - mostly media hype awareness" },
      { value: 2, text: "Basic understanding - knows general concepts" },
      { value: 3, text: "Good understanding - has evaluated specific use cases" },
      { value: 4, text: "Advanced understanding - actively testing implementations" }
    ]
  },
  {
    id: "data_readiness",
    question: "How would you describe your organization's data infrastructure?",
    options: [
      { value: 1, text: "Siloed data across different systems, limited integration" },
      { value: 2, text: "Some integration between core systems" },
      { value: 3, text: "Well-integrated data systems with APIs" },
      { value: 4, text: "Modern data architecture with real-time capabilities" }
    ]
  },
  {
    id: "process_documentation",
    question: "How well documented are your key business processes?",
    options: [
      { value: 1, text: "Mostly tribal knowledge, limited documentation" },
      { value: 2, text: "Basic documentation for core processes" },
      { value: 3, text: "Well-documented processes with clear workflows" },
      { value: 4, text: "Comprehensive process documentation with metrics" }
    ]
  },
  {
    id: "change_capability",
    question: "How does your organization typically handle technology adoption?",
    options: [
      { value: 1, text: "Slow adoption, resistance to change" },
      { value: 2, text: "Cautious but willing to adopt proven technologies" },
      { value: 3, text: "Proactive adoption with structured change management" },
      { value: 4, text: "Innovation-driven culture, rapid adoption capabilities" }
    ]
  },
  {
    id: "budget_authority",
    question: "What's your budget authority for AI/automation initiatives?",
    options: [
      { value: 1, text: "Limited budget, requires extensive approval" },
      { value: 2, text: "Moderate budget for pilot projects ($10K-50K)" },
      { value: 3, text: "Significant budget for strategic initiatives ($50K-200K)" },
      { value: 4, text: "Substantial budget for transformation ($200K+)" }
    ]
  },
  {
    id: "technical_resources",
    question: "What technical resources do you have available?",
    options: [
      { value: 1, text: "Limited IT support, mostly outsourced" },
      { value: 2, text: "Internal IT team, basic development capabilities" },
      { value: 3, text: "Strong technical team with integration experience" },
      { value: 4, text: "Advanced technical capabilities with AI/ML experience" }
    ]
  },
  {
    id: "success_metrics",
    question: "How do you typically measure technology ROI?",
    options: [
      { value: 1, text: "Informal assessment, no structured metrics" },
      { value: 2, text: "Basic metrics tracking (cost savings, efficiency)" },
      { value: 3, text: "Comprehensive metrics with regular reporting" },
      { value: 4, text: "Advanced analytics with predictive modeling" }
    ]
  },
  {
    id: "urgency_level",
    question: "How urgent is AI adoption for your competitive position?",
    options: [
      { value: 1, text: "Exploratory - no immediate pressure" },
      { value: 2, text: "Strategic interest - planning for future needs" },
      { value: 3, text: "Competitive advantage - need to stay ahead" },
      { value: 4, text: "Critical necessity - falling behind competitors" }
    ]
  }
];

export default function DiagnosticPage() {
  const [mounted, setMounted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);

  // Track page view on component mount
  useEffect(() => {
    setMounted(true);
    ConversionTrackingService.trackPageView(
      '/enterprise/diagnostic',
      undefined,
      {
        page_type: 'assessment',
        assessment_type: 'enterprise_diagnostic'
      }
    );
  }, []);

  const handleAnswer = (questionId: string, value: number) => {
    const newAnswers = { ...answers, [questionId]: value };
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);

      // Assessment completed - trigger conversion tracking
      setTimeout(() => {
        const score = calculateScore();
        const assessmentType = 'enterprise';

        // Track conversion on all platforms
        ConversionTrackingService.trackAssessmentComplete(
          undefined, // We don't have user ID in this flow
          assessmentType,
          score,
          {
            assessment_questions: questions.length,
            readiness_level: getReadinessLevel(score).level,
            completion_method: 'web_form'
          }
        );

        // Generate lead for email automation (if we had user authentication)
        ConversionTrackingService.trackLead(
          undefined,
          score,
          'enterprise_diagnostic',
          {
            assessment_type: assessmentType,
            readiness_score: score,
            lead_temperature: score >= 70 ? 'hot' : score >= 55 ? 'warm' : 'cold'
          }
        );

        console.log('Assessment completed with score:', score);
      }, 500);
    }
  };

  const calculateScore = () => {
    const total = Object.values(answers).reduce((sum, value) => sum + value, 0);
    const maxScore = questions.length * 4;
    return Math.round((total / maxScore) * 100);
  };

  const getReadinessLevel = (score: number) => {
    if (score >= 85) return { level: "AI-Ready", color: "text-green-400", description: "Ready for advanced AI implementation" };
    if (score >= 70) return { level: "AI-Prepared", color: "text-blue-400", description: "Well-positioned for strategic AI adoption" };
    if (score >= 55) return { level: "AI-Developing", color: "text-yellow-400", description: "Solid foundation, needs focused preparation" };
    return { level: "AI-Building", color: "text-orange-400", description: "Foundational work needed before AI implementation" };
  };

  const getRecommendations = (score: number) => {
    if (score >= 85) return [
      "Proceed with pilot implementations in high-impact areas",
      "Establish AI governance framework and ethics guidelines",
      "Create cross-functional AI steering committee",
      "Develop internal AI competency center"
    ];
    if (score >= 70) return [
      "Conduct detailed process mapping for automation candidates",
      "Invest in staff training and change management",
      "Start with low-risk, high-value use cases",
      "Establish data governance and quality processes"
    ];
    if (score >= 55) return [
      "Improve data integration and accessibility",
      "Document and standardize key processes",
      "Build technical capabilities through training or hiring",
      "Create proof-of-concept projects to build confidence"
    ];
    return [
      "Focus on foundational data infrastructure",
      "Establish process documentation standards",
      "Build organizational change management capabilities",
      "Start with basic automation before AI"
    ];
  };

  const generatePDF = (score: number, readiness: any, recommendations: string[]) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;

    // Header
    doc.setFontSize(24);
    doc.setTextColor(60, 60, 60);
    doc.text('AI Readiness Assessment Report', pageWidth / 2, 30, { align: 'center' });

    // Company branding
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text('The Catalyst Path - Enterprise AI Strategy', pageWidth / 2, 40, { align: 'center' });

    // Date
    const currentDate = new Date().toLocaleDateString();
    doc.text(`Generated: ${currentDate}`, pageWidth / 2, 50, { align: 'center' });

    // Score section
    doc.setFontSize(20);
    doc.setTextColor(0, 0, 0);
    doc.text('Your AI Readiness Score', 20, 80);

    doc.setFontSize(48);
    doc.setTextColor(66, 165, 245);
    doc.text(`${score}%`, pageWidth / 2, 110, { align: 'center' });

    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text(readiness.level, pageWidth / 2, 125, { align: 'center' });

    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text(readiness.description, pageWidth / 2, 135, { align: 'center' });

    // Recommendations section
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('Recommended Next Steps', 20, 160);

    let yPosition = 175;
    doc.setFontSize(11);
    doc.setTextColor(60, 60, 60);

    recommendations.forEach((rec, index) => {
      const lines = doc.splitTextToSize(`${index + 1}. ${rec}`, pageWidth - 40);
      doc.text(lines, 20, yPosition);
      yPosition += lines.length * 6 + 5;
    });

    // Footer
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text('For personalized guidance, schedule a strategy call with our AI experts.', pageWidth / 2, pageHeight - 30, { align: 'center' });
    doc.text('The Catalyst Path | catalyst-ai.com', pageWidth / 2, pageHeight - 20, { align: 'center' });

    // Save the PDF
    doc.save('AI-Readiness-Assessment-Report.pdf');
  };

  if (showResults) {
    const score = calculateScore();
    const readiness = getReadinessLevel(score);
    const recommendations = getRecommendations(score);

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
        {/* Enhanced Animated Background for Results */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-purple-950/90 to-slate-900/95" />

          {/* Celebration animation effects */}
          <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-green-500/20 to-emerald-600/20 rounded-3xl rotate-45 animate-float blur-xl"></div>
          <div className="absolute top-60 right-20 w-24 h-24 bg-gradient-to-br from-purple-500/15 to-pink-600/15 rounded-full animate-float-delayed blur-lg"></div>
          <div className="absolute bottom-40 left-20 w-40 h-40 bg-gradient-to-br from-cyan-500/10 to-blue-600/10 rounded-2xl rotate-12 animate-float blur-2xl"></div>
          <div className="absolute bottom-20 right-10 w-28 h-28 bg-gradient-to-br from-amber-500/20 to-orange-600/20 rounded-full animate-float-delayed blur-xl"></div>

          {/* Animated grid overlay */}
          <div className="absolute inset-0 bg-grid-pattern opacity-5 animate-grid-flow"></div>

          {/* Dynamic light beams */}
          <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-green-400/20 to-transparent animate-beam-1"></div>
          <div className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-transparent via-purple-400/15 to-transparent animate-beam-2"></div>
        </div>

        <div className="relative z-10 py-8">
          <div className="container mx-auto px-4 max-w-4xl">
            {/* Enhanced Results Card */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-slate-800/30 to-purple-900/20 rounded-3xl blur-2xl"></div>
              <div className="relative bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-12 shadow-2xl">
                <div className="text-center mb-12">
                  <div className="relative inline-block mb-8">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 rounded-3xl blur-2xl opacity-30 animate-pulse-glow"></div>
                    <h1 className="relative text-4xl sm:text-5xl font-bold mb-6">
                      <span className="bg-gradient-to-r from-purple-300 via-pink-300 to-cyan-300 bg-clip-text text-transparent">
                        Your AI Readiness Report
                      </span>
                    </h1>
                  </div>

                  {/* Enhanced Score Display */}
                  <div className="relative inline-block mb-6">
                    <div className="absolute inset-0 bg-gradient-to-r from-green-500/30 to-emerald-500/30 rounded-full blur-2xl animate-pulse-glow"></div>
                    <div className="relative bg-slate-800/60 backdrop-blur-xl border border-slate-600/50 rounded-full p-8 shadow-2xl">
                      <div className="text-7xl font-bold mb-2">
                        <span className={`${readiness.color} animate-pulse-bright`}>{score}%</span>
                      </div>
                      <div className={`text-3xl font-semibold mb-3 ${readiness.color}`}>
                        {readiness.level}
                      </div>
                      <p className="text-slate-300 text-xl">{readiness.description}</p>
                    </div>
                  </div>
                </div>

                {/* Enhanced Recommendations */}
                <div className="mb-12">
                  <div className="flex items-center gap-3 mb-8">
                    <span className="text-3xl animate-pulse-bright">🎯</span>
                    <h2 className="text-3xl font-bold text-white">Recommended Next Steps</h2>
                  </div>
                  <div className="space-y-6">
                    {recommendations.map((rec, index) => (
                      <div key={index} className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 rounded-2xl blur-lg group-hover:from-purple-500/20 group-hover:to-cyan-500/20 transition-all duration-300"></div>
                        <div className="relative flex items-start gap-4 p-6 bg-slate-700/40 backdrop-blur-xl border border-slate-600/30 hover:border-purple-500/50 rounded-2xl transition-all duration-300 shadow-xl">
                          <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full blur-lg opacity-50 animate-pulse-glow"></div>
                            <div className="relative w-10 h-10 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold shadow-xl">
                              {index + 1}
                            </div>
                          </div>
                          <p className="text-slate-200 text-lg leading-relaxed flex-1">{rec}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Enhanced Personalized messaging */}
                <div className="text-center mb-10">
                  <div className="relative inline-block">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-2xl blur-xl"></div>
                    <div className="relative bg-slate-800/60 backdrop-blur-xl border border-slate-600/30 rounded-2xl p-8 shadow-xl">
                      <div className="text-4xl mb-4 animate-pulse-bright">
                        {score >= 70 ? '🚀' : score >= 55 ? '💡' : '🌱'}
                      </div>
                      <p className="text-slate-200 text-xl leading-relaxed">
                        {score >= 70 ?
                          `Excellent! Your ${score}% readiness score shows you're ready for strategic AI implementation. Let's fast-track your success.` :
                         score >= 55 ?
                          `Great foundation! Your ${score}% score indicates solid preparation. Let's map your AI journey together.` :
                          `Perfect timing! Your ${score}% score shows opportunity for growth. Let's build your AI foundation step-by-step.`
                        }
                      </p>
                    </div>
                  </div>
                </div>

                {/* Enhanced Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-2xl blur-xl"></div>
                    <button
                      onClick={() => {
                        // Track PDF download intent
                        ConversionTrackingService.trackConversion('lead', {
                          event: 'pdf_download',
                          value: score,
                          content_type: 'assessment_report',
                          content_category: 'ai_coaching',
                          metadata: {
                            assessment_score: score,
                            readiness_level: readiness.level,
                            report_type: 'enterprise_diagnostic'
                          }
                        });
                        // Generate and download PDF
                        generatePDF(score, readiness, recommendations);
                      }}
                      className="relative group px-10 py-5 bg-gradient-to-r from-purple-500 to-cyan-600 hover:from-purple-400 hover:to-cyan-500 text-white font-semibold rounded-2xl transition-all duration-300 shadow-2xl hover:shadow-purple-500/25 transform hover:scale-105"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 to-white/0 group-hover:from-white/10 group-hover:to-white/10 rounded-2xl transition-all duration-300"></div>
                      <div className="relative flex items-center gap-3">
                        <span className="text-xl">📄</span>
                        <span className="text-lg">Download PDF Report</span>
                      </div>
                    </button>
                  </div>

                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-600/20 to-slate-500/20 rounded-2xl blur-xl"></div>
                    <button
                      onClick={() => {
                        // Track strategy call intent
                        ConversionTrackingService.trackConversion('lead', {
                          event: 'strategy_call_request',
                          value: score + 25, // Higher value for call requests
                          content_type: 'consultation',
                          content_category: 'ai_coaching',
                          metadata: {
                            assessment_score: score,
                            readiness_level: readiness.level,
                            call_type: 'enterprise_strategy'
                          }
                        });

                        // Smart scheduling based on assessment score and readiness level
                        const getSchedulingURL = (score: number, readinessLevel: string) => {
                          // Discovery Call for all users (will add Strategy Deep Dive URL later)
                          const discoveryCallURL = 'https://calendly.com/lorenzo-theglobalenterprise/discovery-call';

                          // TODO: Add Strategy Deep Dive URL when ready
                          // const strategyDeepDiveURL = 'YOUR_STRATEGY_DEEP_DIVE_URL_HERE';

                          // For now, all users go to discovery call
                          // Later: if (score >= 70) return strategyDeepDiveURL;
                          return discoveryCallURL;
                        };

                        const calendlyURL = getSchedulingURL(score, readiness.level);

                        // Add UTM parameters to track conversion source
                        const trackingParams = `?utm_source=assessment&utm_medium=diagnostic&utm_campaign=enterprise&score=${score}&readiness=${readiness.level.replace(/\s+/g, '_')}`;
                        const fullURL = calendlyURL + trackingParams;

                        window.open(fullURL, '_blank');
                      }}
                      className="relative group px-10 py-5 bg-slate-700/60 backdrop-blur-xl border border-slate-600/50 hover:border-slate-500/70 text-white rounded-2xl hover:bg-slate-600/70 transition-all duration-300 shadow-xl transform hover:scale-105"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 to-white/0 group-hover:from-white/5 group-hover:to-white/5 rounded-2xl transition-all duration-300"></div>
                      <div className="relative flex items-center gap-3">
                        <span className="text-xl">📞</span>
                        <span className="text-lg font-semibold">
                          {score >= 70 ? 'Book Premium Strategy Session' :
                           score >= 55 ? 'Schedule Discovery Call' :
                           'Book Foundation Call'}
                        </span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-purple-950/90 to-slate-900/95" />

        {/* Floating geometric shapes - assessment theme */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-purple-500/20 to-pink-600/20 rounded-3xl rotate-45 animate-float blur-xl"></div>
        <div className="absolute top-60 right-20 w-24 h-24 bg-gradient-to-br from-cyan-500/15 to-blue-600/15 rounded-full animate-float-delayed blur-lg"></div>
        <div className="absolute bottom-40 left-20 w-40 h-40 bg-gradient-to-br from-indigo-500/10 to-purple-600/10 rounded-2xl rotate-12 animate-float blur-2xl"></div>
        <div className="absolute bottom-20 right-10 w-28 h-28 bg-gradient-to-br from-blue-500/20 to-cyan-600/20 rounded-full animate-float-delayed blur-xl"></div>

        {/* Animated grid overlay */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5 animate-grid-flow"></div>

        {/* Dynamic light beams */}
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-purple-400/20 to-transparent animate-beam-1"></div>
        <div className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-transparent via-cyan-400/15 to-transparent animate-beam-2"></div>
      </div>

      <div className="relative z-10 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-12">
            {/* Enhanced Header */}
            <div className="text-center mb-8">
              <div className="relative inline-block mb-6">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 rounded-3xl blur-2xl opacity-30 animate-pulse-glow"></div>
                <h1 className="relative text-4xl sm:text-5xl font-bold mb-4">
                  <span className="bg-gradient-to-r from-purple-300 via-pink-300 to-cyan-300 bg-clip-text text-transparent animate-text-shimmer bg-size-200">
                    AI Readiness Diagnostic
                  </span>
                </h1>
              </div>
              <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
                Discover your organization's AI readiness and get personalized recommendations for success.
              </p>
            </div>

            {/* Enhanced Progress Bar */}
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-full blur-lg"></div>
              <div className="relative w-full bg-slate-700/60 backdrop-blur-xl rounded-full h-4 border border-slate-600/50 shadow-xl">
                <div
                  className="bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 h-full rounded-full transition-all duration-500 relative overflow-hidden"
                  style={{ width: `${progress}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/20 animate-pulse-slow"></div>
                </div>
              </div>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center gap-3 bg-slate-800/60 backdrop-blur-xl border border-slate-600/50 rounded-2xl px-6 py-3 shadow-xl">
                <span className="text-2xl animate-pulse-bright">🎯</span>
                <p className="text-slate-300 font-medium text-lg">
                  Question {currentQuestion + 1} of {questions.length}
                </p>
              </div>
            </div>
          </div>

          {/* Enhanced Question Card */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-slate-800/30 to-purple-900/20 rounded-3xl blur-xl"></div>
            <div className="relative bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-12 shadow-2xl">
              <div className="flex items-start gap-4 mb-8">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full blur-lg opacity-50 animate-pulse-glow"></div>
                  <div className="relative w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center shadow-xl">
                    <span className="text-white font-bold text-lg">{currentQuestion + 1}</span>
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-white leading-relaxed flex-1">
                  {questions[currentQuestion].question}
                </h2>
              </div>

              <div className="space-y-4">
                {questions[currentQuestion].options.map((option, index) => (
                  <div key={index} className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 rounded-2xl blur-lg group-hover:from-purple-500/20 group-hover:to-cyan-500/20 transition-all duration-300"></div>
                    <button
                      onClick={() => handleAnswer(questions[currentQuestion].id, option.value)}
                      className="relative w-full p-6 text-left bg-slate-700/40 backdrop-blur-xl hover:bg-slate-600/60 border border-slate-600/30 hover:border-purple-500/50 rounded-2xl transition-all duration-300 group shadow-xl hover:shadow-purple-500/10 transform hover:scale-105"
                    >
                      <div className="flex items-start gap-4">
                        <div className="relative">
                          <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full blur-lg opacity-0 group-hover:opacity-50 transition-all duration-300"></div>
                          <div className="relative w-10 h-10 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold group-hover:scale-110 transition-transform duration-300 shadow-xl">
                            {String.fromCharCode(65 + index)}
                          </div>
                        </div>
                        <p className="text-slate-300 group-hover:text-white transition-colors duration-300 text-lg leading-relaxed flex-1">
                          {option.text}
                        </p>
                      </div>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
