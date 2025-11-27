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
    id: 'about_you',
    title: 'About Your Organization',
    description: 'Help us personalize your recommendations',
    icon: '🏢',
    questions: [
      {
        id: 'industry',
        text: 'What industry are you in?',
        type: 'choice',
        category: 'about_you',
        options: [
          'Technology / Software',
          'Healthcare / Medical',
          'Financial Services / Banking',
          'Professional Services / Consulting',
          'Manufacturing / Industrial',
          'Retail / E-commerce',
          'Education / Training',
          'Ministry / Non-profit',
          'Other'
        ]
      },
      {
        id: 'team_size',
        text: 'What\'s the size of your organization?',
        type: 'choice',
        category: 'about_you',
        options: [
          'Just me (Solopreneur)',
          '2-10 employees',
          '11-50 employees',
          '51-200 employees',
          '200+ employees'
        ]
      },
      {
        id: 'role',
        text: 'What best describes your role?',
        type: 'choice',
        category: 'about_you',
        options: [
          'Founder / CEO / Owner',
          'C-Suite Executive (CTO, COO, etc.)',
          'VP / Director',
          'Manager / Team Lead',
          'Individual Contributor',
          'Consultant / Advisor'
        ]
      }
    ]
  },
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
  },
  {
    id: 'priorities',
    title: 'Your Priorities',
    description: 'Help us understand what matters most to you',
    icon: '⚡',
    questions: [
      {
        id: 'biggest_challenge',
        text: 'What\'s your biggest challenge with AI right now?',
        type: 'choice',
        category: 'priorities',
        options: [
          'Don\'t know where to start',
          'Data is messy or scattered',
          'Team lacks AI skills',
          'Hard to prove ROI',
          'Finding the right tools',
          'Getting buy-in from leadership'
        ]
      },
      {
        id: 'implementation_timeline',
        text: 'When do you want to see AI results?',
        type: 'choice',
        category: 'priorities',
        options: [
          'ASAP - within 30 days',
          'Next quarter (60-90 days)',
          'Within 6 months',
          'Within a year',
          'Just exploring for now'
        ]
      }
    ]
  }
];

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

export default function AIAssessmentPage() {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  // Flatten all questions into a single array
  const allQuestions = assessmentSections.flatMap(section =>
    section.questions.map(q => ({ ...q, sectionTitle: section.title, sectionIcon: section.icon }))
  );

  const totalQuestions = allQuestions.length;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;
  const isContactForm = currentQuestionIndex >= totalQuestions;
  const currentQuestion = allQuestions[currentQuestionIndex];
  const progress = isContactForm ? 100 : ((currentQuestionIndex + 1) / totalQuestions) * 100;

  const handleResponse = (questionId: string, value: any) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const canProceed = () => {
    if (isContactForm) return email && name;
    return responses[currentQuestion?.id] !== undefined;
  };

  const handleNext = () => {
    if (canProceed()) {
      if (isLastQuestion) {
        // Move to contact form
        setCurrentQuestionIndex(prev => prev + 1);
      } else if (isContactForm) {
        handleSubmit();
      } else {
        setCurrentQuestionIndex(prev => prev + 1);
      }
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    console.log('Submit clicked!', { email, name, hasResponses: Object.keys(responses).length });

    if (!email || !name) {
      console.log('Missing email or name:', { email, name });
      alert('Please enter your name and email');
      return;
    }

    setLoading(true);

    try {
      // Calculate scores
      const scores = calculateScores(responses);
      console.log('Calculated scores:', scores);

      // Save assessment and send results
      const response = await fetch('/api/assessment-results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          name,
          industry: responses.industry,
          teamSize: responses.team_size,
          role: responses.role,
          biggestChallenge: responses.biggest_challenge,
          timeline: responses.implementation_timeline,
          responses,
          scores,
          timestamp: new Date().toISOString()
        })
      });

      console.log('API response status:', response.status);
      const data = await response.json();
      console.log('API response data:', data);

      if (response.ok) {
        console.log('Success! Redirecting...');
        const urlParams = new URLSearchParams({
          overall: scores.overall.toString(),
          current_state: scores.current_state.toString(),
          strategy_vision: scores.strategy_vision.toString(),
          team_capabilities: scores.team_capabilities.toString(),
          implementation: scores.implementation.toString(),
          name: name,
          email: email,
          userCreated: data.userCreated ? 'true' : 'false'
        });
        router.push(`/assessment-complete?${urlParams.toString()}`);
      } else {
        console.error('API error:', data);
        alert(`Error: ${data.error || 'Something went wrong'}`);
      }
    } catch (error) {
      console.error('Assessment submission error:', error);
      alert(`Network error: ${error instanceof Error ? error.message : 'Something went wrong'}`);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Header */}
      <div className="border-b border-slate-700 bg-slate-900/95 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                AI Readiness Assessment v2.0
              </h1>
              <p className="text-slate-400">Discover your AI transformation roadmap</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-slate-400">Question {isContactForm ? totalQuestions : currentQuestionIndex + 1} of {totalQuestions}</div>
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
        {!isContactForm ? (
          <div className="space-y-8">
            {/* Question Header */}
            <div className="text-center">
              <div className="text-6xl mb-4">{currentQuestion?.sectionIcon}</div>
              <h2 className="text-2xl font-bold mb-2">{currentQuestion?.sectionTitle}</h2>
              <div className="text-cyan-400 text-sm font-medium mb-4">
                Question {currentQuestionIndex + 1} of {totalQuestions}
              </div>
            </div>

            {/* Single Question */}
            <div className="max-w-2xl mx-auto">
              <div className="bg-slate-800/50 rounded-xl p-8 border border-slate-700">
                <h3 className="text-xl font-medium mb-6 text-center">
                  {currentQuestion?.text}
                </h3>

                {currentQuestion?.type === 'scale' && (
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm text-slate-400">
                      <span>Not at all</span>
                      <span>Extremely</span>
                    </div>
                    <div className="grid grid-cols-5 gap-3">
                      {[1, 2, 3, 4, 5].map(value => (
                        <button
                          key={value}
                          onClick={() => handleResponse(currentQuestion.id, value)}
                          className={`py-4 rounded-lg border transition-all text-lg font-medium ${
                            responses[currentQuestion.id] === value
                              ? 'bg-cyan-500 border-cyan-400 text-white'
                              : 'bg-slate-700 border-slate-600 hover:border-slate-500 hover:bg-slate-600'
                          }`}
                        >
                          {value}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {currentQuestion?.type === 'choice' && currentQuestion.options && (
                  <div className="space-y-3">
                    {currentQuestion.options.map(option => (
                      <button
                        key={option}
                        onClick={() => handleResponse(currentQuestion.id, option)}
                        className={`w-full p-4 text-left rounded-lg border transition-all ${
                          responses[currentQuestion.id] === option
                            ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                            : 'bg-slate-700 border-slate-600 hover:border-slate-500 hover:bg-slate-600'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center max-w-2xl mx-auto">
              <button
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  currentQuestionIndex === 0
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
                {isLastQuestion ? 'Continue to Results →' : 'Next Question'}
              </button>
            </div>
          </div>
        ) : (
          // Final step - contact info
          <div className="max-w-md mx-auto space-y-6">
            <div className="text-center">
              <div className="text-6xl mb-4">🎯</div>
              <h2 className="text-3xl font-bold mb-2">Your Report is Ready!</h2>
              <p className="text-slate-400">Enter your details to receive your personalized AI strategy roadmap</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Your name</label>
                <input
                  type="text"
                  placeholder="First name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-1">Email address</label>
                <input
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  required
                />
              </div>
            </div>

            {/* Show what they'll get */}
            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
              <p className="text-sm text-slate-300 font-medium mb-2">📊 Your report includes:</p>
              <ul className="text-sm text-slate-400 space-y-1">
                <li>• Your AI readiness score & breakdown</li>
                <li>• Personalized recommendations for your {responses.industry || 'industry'}</li>
                <li>• {responses.biggest_challenge ? `Solutions for "${responses.biggest_challenge}"` : 'Solutions for your biggest challenge'}</li>
                <li>• Custom action plan based on your timeline</li>
              </ul>
            </div>

            <button
              onClick={() => {
                console.log('Button clicked!');
                handleSubmit();
              }}
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