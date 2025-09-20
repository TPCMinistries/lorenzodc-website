import { supabase } // Supabase temporarily disabled for deployment

export interface AssessmentQuestion {
  id: string;
  category: string;
  question_type: 'rating' | 'multiple_choice' | 'text' | 'checkbox';
  question_text: string;
  question_subtext?: string;
  options?: string[];
  order_index: number;
  is_required: boolean;
}

export interface AssessmentResponse {
  questionId: string;
  value: string | number | string[];
}

export interface LifeScores {
  career: number;
  health: number;
  relationships: number;
  personal_development: number;
  financial: number;
  productivity: number;
  creativity: number;
}

export interface AssessmentResult {
  id: string;
  user_id?: string;
  session_id: string;
  life_scores: LifeScores;
  ai_readiness_score: number;
  top_goals: string[];
  biggest_obstacles: string[];
  pain_points: Record<string, string>;
  improvement_priorities: string[];
  accountability_preference: number;
  ai_comfort_level: number;
  time_drains: string[];
  completed_at?: string;
  assessment_date: string;
}

export interface AssessmentInsights {
  overall_score: number;
  strongest_area: string;
  weakest_area: string;
  improvement_potential: string;
  ai_coaching_readiness: string;
  recommended_focus_areas: string[];
}

export interface AssessmentProgress {
  session_id: string;
  current_step: number;
  total_steps: number;
  responses: Record<string, any>;
  last_updated: string;
}

export class AssessmentService {

  // Generate unique session ID for anonymous users
  static generateSessionId(): string {
    return 'assessment_' + crypto.randomUUID();
  }

  // Get all assessment questions organized by category
  static async getAssessmentQuestions(): Promise<Record<string, AssessmentQuestion[]>> {
    // Try to fetch from database first
    const { data, error } = await supabase
      .from('assessment_questions')
      .select('*')
      .order('category, order_index');

    if (error || !data || data.length === 0) {
      console.log('Using fallback assessment questions');
      return this.getFallbackQuestions();
    }

    const questionsByCategory: Record<string, AssessmentQuestion[]> = {};
    data.forEach(question => {
      if (!questionsByCategory[question.category]) {
        questionsByCategory[question.category] = [];
      }
      questionsByCategory[question.category].push({
        ...question,
        options: question.options ? JSON.parse(question.options) : undefined
      });
    });

    return questionsByCategory;
  }

  // Fallback questions when database is not available
  private static getFallbackQuestions(): Record<string, AssessmentQuestion[]> {
    return {
      career: [
        {
          id: 'career_satisfaction',
          category: 'career',
          question_type: 'rating',
          question_text: 'How satisfied are you with your current career path?',
          question_subtext: 'Consider your role, growth opportunities, and alignment with your goals',
          order_index: 1,
          is_required: true
        },
        {
          id: 'career_growth',
          category: 'career',
          question_type: 'multiple_choice',
          question_text: 'What is your biggest career challenge right now?',
          options: [
            'Finding time for skill development',
            'Lack of clear advancement path',
            'Work-life balance',
            'Salary not meeting needs',
            'Job security concerns',
            'Not feeling valued or recognized'
          ],
          order_index: 2,
          is_required: true
        },
        {
          id: 'career_goals',
          category: 'career',
          question_type: 'multiple_choice',
          question_text: 'What is your primary career goal for the next 12 months?',
          options: [
            'Get a promotion or raise',
            'Switch to a new role or company',
            'Start my own business',
            'Develop new skills',
            'Achieve better work-life balance',
            'Build professional network'
          ],
          order_index: 3,
          is_required: true
        }
      ],
      health: [
        {
          id: 'health_energy',
          category: 'health',
          question_type: 'rating',
          question_text: 'How would you rate your daily energy levels?',
          question_subtext: '1 = Always tired, 10 = Consistently energetic',
          order_index: 1,
          is_required: true
        },
        {
          id: 'health_challenge',
          category: 'health',
          question_type: 'multiple_choice',
          question_text: 'What is your biggest health challenge?',
          options: [
            'Lack of regular exercise',
            'Poor eating habits',
            'Not getting enough sleep',
            'High stress levels',
            'Finding time for self-care',
            'Managing weight'
          ],
          order_index: 2,
          is_required: true
        },
        {
          id: 'health_priority',
          category: 'health',
          question_type: 'multiple_choice',
          question_text: 'What health goal would have the biggest impact on your life?',
          options: [
            'Establishing a consistent exercise routine',
            'Improving my diet and nutrition',
            'Getting 7-8 hours of quality sleep',
            'Better stress management',
            'Regular health check-ups',
            'Building healthier daily habits'
          ],
          order_index: 3,
          is_required: true
        }
      ],
      relationships: [
        {
          id: 'relationships_satisfaction',
          category: 'relationships',
          question_type: 'rating',
          question_text: 'How satisfied are you with your personal relationships?',
          question_subtext: 'Consider family, friends, and romantic relationships',
          order_index: 1,
          is_required: true
        },
        {
          id: 'relationships_challenge',
          category: 'relationships',
          question_type: 'multiple_choice',
          question_text: 'What is your biggest relationship challenge?',
          options: [
            'Not enough quality time with loved ones',
            'Difficulty communicating effectively',
            'Feeling disconnected or lonely',
            'Managing conflict or disagreements',
            'Building new meaningful connections',
            'Balancing multiple relationships'
          ],
          order_index: 2,
          is_required: true
        }
      ],
      personal_development: [
        {
          id: 'growth_satisfaction',
          category: 'personal_development',
          question_type: 'rating',
          question_text: 'How satisfied are you with your personal growth?',
          question_subtext: 'Consider learning, skills development, and self-improvement',
          order_index: 1,
          is_required: true
        },
        {
          id: 'learning_interest',
          category: 'personal_development',
          question_type: 'multiple_choice',
          question_text: 'What area of personal development interests you most?',
          options: [
            'Professional skills and expertise',
            'Leadership and communication',
            'Creative and artistic skills',
            'Health and wellness knowledge',
            'Financial literacy',
            'Technology and digital skills'
          ],
          order_index: 2,
          is_required: true
        }
      ],
      financial: [
        {
          id: 'financial_security',
          category: 'financial',
          question_type: 'rating',
          question_text: 'How secure do you feel about your financial situation?',
          question_subtext: '1 = Very insecure, 10 = Completely secure',
          order_index: 1,
          is_required: true
        },
        {
          id: 'financial_goal',
          category: 'financial',
          question_type: 'multiple_choice',
          question_text: 'What is your top financial priority?',
          options: [
            'Building an emergency fund',
            'Paying off debt',
            'Saving for a major purchase',
            'Investing for retirement',
            'Increasing income',
            'Better budgeting and expense tracking'
          ],
          order_index: 2,
          is_required: true
        }
      ],
      productivity: [
        {
          id: 'productivity_rating',
          category: 'productivity',
          question_type: 'rating',
          question_text: 'How productive do you feel on a typical day?',
          question_subtext: 'Consider how effectively you accomplish your goals',
          order_index: 1,
          is_required: true
        },
        {
          id: 'productivity_challenge',
          category: 'productivity',
          question_type: 'multiple_choice',
          question_text: 'What is your biggest productivity challenge?',
          options: [
            'Getting distracted by social media/phones',
            'Procrastination on important tasks',
            'Poor time management',
            'Lack of clear priorities',
            'Too many interruptions',
            'Difficulty focusing for long periods'
          ],
          order_index: 2,
          is_required: true
        }
      ],
      creativity: [
        {
          id: 'creativity_satisfaction',
          category: 'creativity',
          question_type: 'rating',
          question_text: 'How satisfied are you with creative expression in your life?',
          question_subtext: 'This could be art, music, writing, problem-solving, or any creative outlet',
          order_index: 1,
          is_required: true
        },
        {
          id: 'creative_interest',
          category: 'creativity',
          question_type: 'multiple_choice',
          question_text: 'What type of creative activity appeals to you most?',
          options: [
            'Writing, journaling, or storytelling',
            'Visual arts, photography, or design',
            'Music, singing, or audio creation',
            'Crafts, building, or hands-on projects',
            'Creative problem-solving at work',
            'Cooking, gardening, or lifestyle creativity'
          ],
          order_index: 2,
          is_required: true
        }
      ],
      ai_readiness: [
        {
          id: 'ai_comfort',
          category: 'ai_readiness',
          question_type: 'rating',
          question_text: 'How comfortable are you with using AI tools?',
          question_subtext: '1 = Very uncomfortable, 10 = Very comfortable',
          order_index: 1,
          is_required: true
        },
        {
          id: 'ai_experience',
          category: 'ai_readiness',
          question_type: 'multiple_choice',
          question_text: 'Which AI tools have you used?',
          options: [
            'ChatGPT or similar chatbots',
            'AI writing assistants',
            'AI image generators',
            'Voice assistants (Siri, Alexa)',
            'AI-powered apps or software',
            'None of the above'
          ],
          order_index: 2,
          is_required: true
        }
      ],
      goal_setting: [
        {
          id: 'goal_tracking',
          category: 'goal_setting',
          question_type: 'rating',
          question_text: 'How well do you track and achieve your goals?',
          question_subtext: '1 = Rarely achieve goals, 10 = Consistently achieve goals',
          order_index: 1,
          is_required: true
        },
        {
          id: 'accountability_preference',
          category: 'goal_setting',
          question_type: 'multiple_choice',
          question_text: 'How do you prefer to stay accountable to your goals?',
          options: [
            'Regular check-ins with a coach or mentor',
            'Tracking apps and digital reminders',
            'Sharing goals with friends or family',
            'Writing in a journal or planner',
            'Setting public commitments',
            'I struggle with staying accountable'
          ],
          order_index: 2,
          is_required: true
        },
        {
          id: 'biggest_obstacle',
          category: 'goal_setting',
          question_type: 'multiple_choice',
          question_text: 'What most often prevents you from achieving your goals?',
          options: [
            'Lack of time or competing priorities',
            'Getting overwhelmed by the size of the goal',
            'Losing motivation over time',
            'Not having a clear plan',
            'Perfectionism or fear of failure',
            'External circumstances beyond my control'
          ],
          order_index: 3,
          is_required: true
        }
      ]
    };
  }

  // Save progress for multi-session completion
  static async saveProgress(sessionId: string, step: number, responses: Record<string, any>): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase
      .from('assessment_progress')
      .upsert({
        session_id: sessionId,
        user_id: user?.id || null,
        current_step: step,
        total_steps: 8,
        responses: responses,
        last_updated: new Date().toISOString()
      });

    return !error;
  }

  // Get saved progress
  static async getProgress(sessionId: string): Promise<AssessmentProgress | null> {
    const { data, error } = await supabase
      .from('assessment_progress')
      .select('*')
      .eq('session_id', sessionId)
      .single();

    if (error || !data) {
      return null;
    }

    return data;
  }

  // Submit completed assessment
  static async submitAssessment(sessionId: string, responses: Record<string, any>): Promise<AssessmentResult | null> {
    const { data: { user } } = await supabase.auth.getUser();

    // Process responses into structured format
    const processedData = this.processAssessmentResponses(responses);

    const assessmentResult = {
      session_id: sessionId,
      user_id: user?.id || null,
      ...processedData,
      completed_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('assessment_results')
      .insert(assessmentResult)
      .select()
      .single();

    if (error) {
      console.error('Error submitting assessment:', error);
      return null;
    }

    // Clean up progress
    await supabase
      .from('assessment_progress')
      .delete()
      .eq('session_id', sessionId);

    return data;
  }

  // Process raw responses into structured assessment data
  private static processAssessmentResponses(responses: Record<string, any>) {
    const lifeScores: LifeScores = {
      career: 0,
      health: 0,
      relationships: 0,
      personal_development: 0,
      financial: 0,
      productivity: 0,
      creativity: 0
    };

    const painPoints: Record<string, string> = {};
    const topGoals: string[] = [];
    const biggestObstacles: string[] = [];
    const timeDrains: string[] = [];
    let aiReadinessScore = 5;
    let accountabilityPreference = 5;
    let aiComfortLevel = 5;

    // Process responses by category
    Object.entries(responses).forEach(([questionId, answer]) => {
      // Map question IDs to categories and process accordingly
      // This is a simplified version - in production you'd want to fetch question details

      // Extract life area ratings
      if (questionId.includes('career_rating')) lifeScores.career = Number(answer);
      if (questionId.includes('health_rating')) lifeScores.health = Number(answer);
      if (questionId.includes('relationships_rating')) lifeScores.relationships = Number(answer);
      if (questionId.includes('personal_development_rating')) lifeScores.personal_development = Number(answer);
      if (questionId.includes('financial_rating')) lifeScores.financial = Number(answer);
      if (questionId.includes('productivity_rating')) lifeScores.productivity = Number(answer);
      if (questionId.includes('creativity_rating')) lifeScores.creativity = Number(answer);

      // Extract pain points
      if (questionId.includes('frustration') || questionId.includes('struggle')) {
        const category = this.extractCategoryFromQuestionId(questionId);
        if (category && typeof answer === 'string') {
          painPoints[category] = answer;
        }
      }

      // Extract goals and obstacles
      if (questionId.includes('goal') && Array.isArray(answer)) {
        topGoals.push(...answer);
      }
      if (questionId.includes('obstacle') || questionId.includes('stopped')) {
        if (typeof answer === 'string') biggestObstacles.push(answer);
        if (Array.isArray(answer)) biggestObstacles.push(...answer);
      }

      // Extract AI readiness data
      if (questionId.includes('ai_comfort')) aiComfortLevel = Number(answer);
      if (questionId.includes('accountability')) accountabilityPreference = Number(answer);
      if (questionId.includes('time_drain')) {
        if (typeof answer === 'string') timeDrains.push(answer);
      }
    });

    // Calculate AI readiness score
    aiReadinessScore = Math.round((aiComfortLevel + accountabilityPreference) / 2);

    return {
      life_scores: lifeScores,
      ai_readiness_score: aiReadinessScore,
      top_goals: topGoals.slice(0, 3), // Top 3 goals
      biggest_obstacles: biggestObstacles,
      pain_points: painPoints,
      improvement_priorities: this.calculateImprovementPriorities(lifeScores),
      accountability_preference: accountabilityPreference,
      ai_comfort_level: aiComfortLevel,
      time_drains: timeDrains
    };
  }

  private static extractCategoryFromQuestionId(questionId: string): string | null {
    if (questionId.includes('career')) return 'career';
    if (questionId.includes('health')) return 'health';
    if (questionId.includes('relationship')) return 'relationships';
    if (questionId.includes('development')) return 'personal_development';
    if (questionId.includes('financial')) return 'financial';
    if (questionId.includes('productivity')) return 'productivity';
    if (questionId.includes('creativity')) return 'creativity';
    return null;
  }

  private static calculateImprovementPriorities(lifeScores: LifeScores): string[] {
    const scoreEntries = Object.entries(lifeScores)
      .sort(([,a], [,b]) => a - b) // Sort by score ascending
      .filter(([,score]) => score < 7) // Only include areas below 7
      .slice(0, 3) // Top 3 priorities
      .map(([area,]) => area);

    return scoreEntries;
  }

  // Get assessment results by session ID
  static async getAssessmentResult(sessionId: string): Promise<AssessmentResult | null> {
    const { data, error } = await supabase
      .from('assessment_results')
      .select('*')
      .eq('session_id', sessionId)
      .single();

    if (error) {
      console.error('Error fetching assessment result:', error);
      return null;
    }

    return data;
  }

  // Get assessment insights using database function
  static async getAssessmentInsights(assessmentId: string): Promise<AssessmentInsights | null> {
    const { data, error } = await supabase
      .rpc('generate_assessment_insights', { assessment_id_param: assessmentId });

    if (error) {
      console.error('Error generating insights:', error);
      return null;
    }

    return data[0] || null;
  }

  // Get user's assessment history
  static async getUserAssessments(): Promise<AssessmentResult[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('assessment_results')
      .select('*')
      .eq('user_id', user.id)
      .order('assessment_date', { ascending: false });

    if (error) {
      console.error('Error fetching user assessments:', error);
      return [];
    }

    return data || [];
  }

  // Generate coaching context from assessment for AI
  static generateCoachingContext(assessment: AssessmentResult, insights?: AssessmentInsights): string {
    const { life_scores, top_goals, biggest_obstacles, pain_points, ai_readiness_score } = assessment;

    let context = `PERSONAL ASSESSMENT CONTEXT:\n\n`;

    // Life area scores
    context += `Life Area Scores (1-10):\n`;
    Object.entries(life_scores).forEach(([area, score]) => {
      context += `• ${area.replace('_', ' ')}: ${score}/10\n`;
    });

    // Goals and challenges
    if (top_goals.length > 0) {
      context += `\nTop Goals:\n`;
      top_goals.forEach((goal, index) => {
        context += `${index + 1}. ${goal}\n`;
      });
    }

    if (biggest_obstacles.length > 0) {
      context += `\nBiggest Obstacles:\n`;
      biggest_obstacles.forEach(obstacle => {
        context += `• ${obstacle}\n`;
      });
    }

    // Pain points by area
    if (Object.keys(pain_points).length > 0) {
      context += `\nSpecific Pain Points:\n`;
      Object.entries(pain_points).forEach(([area, pain]) => {
        context += `• ${area}: ${pain}\n`;
      });
    }

    // AI readiness
    context += `\nAI Coaching Readiness: ${ai_readiness_score}/10\n`;
    context += `Accountability Preference: ${assessment.accountability_preference}/10\n`;

    // Insights if available
    if (insights) {
      context += `\nPersonalized Insights:\n`;
      context += `• Strongest Area: ${insights.strongest_area}\n`;
      context += `• Area Needing Most Attention: ${insights.weakest_area}\n`;
      context += `• Coaching Readiness: ${insights.ai_coaching_readiness}\n`;
    }

    context += `\nUse this assessment data to provide personalized, context-aware coaching that references their specific goals, challenges, and preferences.`;

    return context;
  }

  // Check if user has taken assessment recently
  static async hasRecentAssessment(): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data, error } = await supabase
      .from('assessment_results')
      .select('id')
      .eq('user_id', user.id)
      .gte('assessment_date', thirtyDaysAgo.toISOString())
      .limit(1);

    return !error && data && data.length > 0;
  }

  // Generate upgrade hooks based on assessment
  static generateUpgradeHooks(assessment: AssessmentResult, insights?: AssessmentInsights): {
    primary: string;
    secondary: string;
    features: string[];
  } {
    const weakestArea = insights?.weakest_area || 'your goals';
    const aiReadiness = assessment.ai_readiness_score;

    let primary = `Your assessment reveals significant opportunities in ${weakestArea}.`;
    let secondary = `Research shows people are 40% more likely to achieve goals with AI coaching accountability.`;

    if (aiReadiness >= 7) {
      primary = `You're perfect for AI coaching! High readiness score: ${aiReadiness}/10.`;
      secondary = `Transform your assessment insights into real progress with personalized AI coaching.`;
    } else if (aiReadiness <= 4) {
      primary = `AI coaching could be the accountability breakthrough you need.`;
      secondary = `Start simple with goal tracking and build confidence with AI-assisted progress.`;
    }

    const features = [
      'Goal tracking based on your assessment',
      `Personalized coaching for ${weakestArea}`,
      'Weekly accountability check-ins',
      'Progress celebration and course correction',
      'AI that remembers your context and preferences'
    ];

    return { primary, secondary, features };
  }
}