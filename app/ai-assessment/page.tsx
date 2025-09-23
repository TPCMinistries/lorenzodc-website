'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Question {
  id: string;
  text: string;
  type: 'scale' | 'choice' | 'text';
  options?: string[];
  category: string;
}

interface AssessmentSection {
  id: string;
  title: string;
  description: string;
  icon: string;
  questions: Question[];
}

const assessmentSections: AssessmentSection[] = [
  {
    id: 'current_state',
    title: 'Current AI State',
    description: 'Understanding your current AI adoption level',
    icon: '📊',
    questions: [
      {
        id: 'ai_usage',
        text: 'How would you describe your organization\'s current AI usage?',
        type: 'choice',
        category: 'current_state',
        options: [
          'No AI tools in use',
          'Experimenting with basic AI tools (ChatGPT, etc.)',
          'Using AI tools for specific tasks',
          'AI integrated into some business processes',
          'AI is central to our operations'
        ]
      },
      {
        id: 'data_readiness',
        text: 'How organized and accessible is your business data?',
        type: 'scale',
        category: 'current_state'
      },
      {
        id: 'tech_infrastructure',
        text: 'How would you rate your current technology infrastructure?',
        type: 'scale',
        category: 'current_state'
      }
    ]
  },
  {
    id: 'strategy_vision',
    title: 'AI Strategy & Vision',
    description: 'Your strategic approach to AI adoption',
    icon: '🎯',
    questions: [
      {
        id: 'ai_goals',
        text: 'What is your primary goal with AI implementation?',
        type: 'choice',
        category: 'strategy_vision',
        options: [
          'Reduce operational costs',
          'Improve customer experience',
          'Increase revenue/sales',
          'Automate repetitive tasks',
          'Gain competitive advantage',
          'All of the above'
        ]
      },
      {
        id: 'timeline_urgency',
        text: 'How urgent is AI implementation for your business?',
        type: 'scale',
        category: 'strategy_vision'
      },
      {
        id: 'budget_allocation',
        text: 'How ready are you to invest in AI initiatives?',
        type: 'scale',
        category: 'strategy_vision'
      }
    ]
  },
  {
    id: 'team_capabilities',
    title: 'Team & Capabilities',
    description: 'Your team\'s readiness for AI adoption',
    icon: '👥',
    questions: [
      {
        id: 'team_ai_skills',
        text: 'How would you rate your team\'s AI/tech skills?',
        type: 'scale',
        category: 'team_capabilities'
      },
      {
        id: 'change_readiness',
        text: 'How ready is your organization for technological change?',
        type: 'scale',
        category: 'team_capabilities'
      },
      {
        id: 'training_willingness',
        text: 'How willing is your team to learn new AI tools?',
        type: 'scale',
        category: 'team_capabilities'
      }
    ]
  },
  {
    id: 'implementation',
    title: 'Implementation Readiness',
    description: 'Your practical readiness to implement AI',
    icon: '🚀',
    questions: [
      {
        id: 'process_documentation',
        text: 'How well documented are your current business processes?',
        type: 'scale',
        category: 'implementation'
      },
      {
        id: 'pilot_readiness',
        text: 'How ready are you to run AI pilot projects?',
        type: 'scale',
        category: 'implementation'
      },
      {
        id: 'success_metrics',
        text: 'How clear are you on how to measure AI success?',
        type: 'scale',
        category: 'implementation'
      }
    ]
  }
];

export default function AIAssessmentPage() {
  const router = useRouter();
  const [currentSection, setCurrentSection] = useState(0);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [loading, setLoading] = useState(false);

  const currentSectionData = assessmentSections[currentSection];
  const isLastSection = currentSection === assessmentSections.length - 1;
  const totalQuestions = assessmentSections.reduce((sum, section) => sum + section.questions.length, 0);
  const answeredQuestions = Object.keys(responses).length;
  const progress = (answeredQuestions / totalQuestions) * 100;

  const handleResponse = (questionId: string, value: any) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const canProceed = () => {
    return currentSectionData.questions.every(q => responses[q.id] !== undefined);
  };

  const handleNext = () => {
    if (canProceed()) {
      if (isLastSection) {
        handleSubmit();
      } else {
        setCurrentSection(prev => prev + 1);
      }
    }
  };

  const handleSubmit = async () => {
    if (!email || !name) return;

    setLoading(true);

    try {
      // Calculate scores
      const scores = calculateScores(responses);

      // Save assessment and send results
      const response = await fetch('/api/assessment-results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          name,
          company,
          responses,
          scores,
          timestamp: new Date().toISOString()
        })
      });

      if (response.ok) {
        router.push('/assessment-complete');
      } else {
        alert('Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Assessment submission error:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const calculateScores = (responses: Record<string, any>) => {
    const categories = ['current_state', 'strategy_vision', 'team_capabilities', 'implementation'];
    const scores: Record<string, number> = {};

    categories.forEach(category => {
      const categoryQuestions = assessmentSections
        .flatMap(s => s.questions)
        .filter(q => q.category === category);

      const categoryResponses = categoryQuestions.map(q => {
        const response = responses[q.id];
        if (q.type === 'scale') {
          return response || 0;
        } else if (q.type === 'choice') {
          // Convert choice to score based on position
          return q.options ? q.options.indexOf(response) + 1 : 0;
        }
        return 0;
      });

      const average = categoryResponses.reduce((sum, val) => sum + val, 0) / categoryResponses.length;
      scores[category] = Math.round((average / 5) * 100); // Convert to percentage
    });

    scores.overall = Math.round(Object.values(scores).reduce((sum, val) => sum + val, 0) / categories.length);
    return scores;
  };

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
              <p className="text-slate-400">Discover your AI transformation roadmap</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-slate-400">Progress</div>
              <div className="text-lg font-semibold text-cyan-400">{Math.round(progress)}%</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4 w-full bg-slate-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-cyan-500 to-purple-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {currentSection < assessmentSections.length ? (
          <div className="space-y-8">
            {/* Section Header */}
            <div className="text-center">
              <div className="text-6xl mb-4">{currentSectionData.icon}</div>
              <h2 className="text-3xl font-bold mb-2">{currentSectionData.title}</h2>
              <p className="text-slate-400 text-lg">{currentSectionData.description}</p>
            </div>

            {/* Questions */}
            <div className="space-y-6">
              {currentSectionData.questions.map((question, index) => (
                <div key={question.id} className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                  <h3 className="text-lg font-medium mb-4">
                    {index + 1}. {question.text}
                  </h3>

                  {question.type === 'scale' && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm text-slate-400">
                        <span>Not at all</span>
                        <span>Extremely</span>
                      </div>
                      <div className="flex space-x-2">
                        {[1, 2, 3, 4, 5].map(value => (
                          <button
                            key={value}
                            onClick={() => handleResponse(question.id, value)}
                            className={`flex-1 py-3 rounded-lg border transition-all ${
                              responses[question.id] === value
                                ? 'bg-cyan-500 border-cyan-400 text-white'
                                : 'bg-slate-700 border-slate-600 hover:border-slate-500'
                            }`}
                          >
                            {value}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {question.type === 'choice' && question.options && (
                    <div className="space-y-2">
                      {question.options.map(option => (
                        <button
                          key={option}
                          onClick={() => handleResponse(question.id, option)}
                          className={`w-full p-4 text-left rounded-lg border transition-all ${
                            responses[question.id] === option
                              ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                              : 'bg-slate-700 border-slate-600 hover:border-slate-500'
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center">
              <button
                onClick={() => setCurrentSection(prev => Math.max(0, prev - 1))}
                disabled={currentSection === 0}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  currentSection === 0
                    ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                    : 'bg-slate-700 hover:bg-slate-600 text-white'
                }`}
              >
                Previous
              </button>

              <button
                onClick={handleNext}
                disabled={!canProceed()}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  canProceed()
                    ? 'bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white'
                    : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                }`}
              >
                {isLastSection ? 'Get My Results' : 'Next Section'}
              </button>
            </div>
          </div>
        ) : (
          // Final step - contact info
          <div className="max-w-md mx-auto space-y-6">
            <div className="text-center">
              <div className="text-6xl mb-4">📧</div>
              <h2 className="text-3xl font-bold mb-2">Get Your Results</h2>
              <p className="text-slate-400">We'll send your personalized AI strategy report to your email</p>
            </div>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                required
              />

              <input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                required
              />

              <input
                type="text"
                placeholder="Company name (optional)"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={!email || !name || loading}
              className={`w-full py-3 rounded-lg font-medium transition-all ${
                email && name && !loading
                  ? 'bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white'
                  : 'bg-slate-700 text-slate-500 cursor-not-allowed'
              }`}
            >
              {loading ? 'Generating Your Report...' : 'Get My AI Strategy Report'}
            </button>

            <p className="text-xs text-slate-500 text-center">
              Your information is secure and will only be used to send your assessment results.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}