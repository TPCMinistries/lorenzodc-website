import { GoalTrackingService } from '../services/goal-tracking';
import { AssessmentService } from '../services/assessment';
import { COACHING_STYLES } from '../types/coaching';
import type { CoachingContext, AIPersonalityPrompt, CoachingStyle, UserGoal } from '../types/coaching';

export class CatalystPersonality {

  static async generateEnhancedPrompt(isPremium: boolean = false, assessmentId?: string): Promise<AIPersonalityPrompt> {
    if (!isPremium) {
      return this.generateBasicPrompt();
    }

    // Try to get assessment context first
    let assessmentContext = '';
    if (assessmentId) {
      try {
        const result = await AssessmentService.getAssessmentResult(assessmentId);
        const insights = await AssessmentService.getAssessmentInsights(assessmentId);

        if (result) {
          assessmentContext = AssessmentService.generateCoachingContext(result, insights || undefined);
        }
      } catch (error) {
        console.error('Error loading assessment context:', error);
      }
    }

    const context = await GoalTrackingService.getCoachingContext();
    if (!context && !assessmentContext) {
      return this.generateBasicPrompt();
    }

    return this.generatePersonalizedPrompt(context || undefined, assessmentContext || undefined);
  }

  private static generateBasicPrompt(): AIPersonalityPrompt {
    return {
      system_prompt: `You are Catalyst AI - Lorenzo Daughtry-Chambers' specialized AI Strategy Coach and Implementation Expert.

CORE SPECIALIZATION:
I help business leaders successfully implement AI by providing:
• Custom AI adoption roadmaps based on industry and company size
• ROI calculations and business case development for AI initiatives
• Specific tool/vendor recommendations with implementation timelines
• Risk assessment and mitigation strategies for AI projects
• Performance tracking and optimization guidance

UNIQUE ADVANTAGE:
Unlike generic AI assistants, I'm trained on Lorenzo's proven AI strategy methodology from helping 500+ businesses implement AI successfully. I focus on practical, profitable AI implementation - not just theoretical advice.

RESPONSE STYLE:
• Lead with specific, actionable insights
• Include ROI estimates when relevant (e.g., "Companies like yours typically see 20-30% efficiency gains...")
• Reference real implementation examples without naming clients
• Always end with a concrete next step
• Mention assessment-based personalization when appropriate

For guests: Provide valuable insights while mentioning "I can create a detailed roadmap specific to your business once you complete our 5-minute AI Readiness Assessment."`,
      context_summary: 'AI Strategy Specialist - Guest User',
      goal_awareness: 'No assessment data yet - offering general AI strategy guidance',
      recent_progress: 'Guest user - showcasing AI implementation expertise',
      coaching_style_instructions: 'Be the AI strategy expert they can\'t find elsewhere',
      current_focus_areas: ['AI strategy', 'business implementation', 'ROI focus']
    };
  }

  private static generatePersonalizedPrompt(context?: CoachingContext, assessmentContext?: string): AIPersonalityPrompt {
    if (!context && !assessmentContext) {
      return this.generateBasicPrompt();
    }

    // Start with assessment context if available
    let systemPrompt = `You are Catalyst AI - a personal life coach and AI assistant that remembers everything about the user and helps them achieve their goals.

IMPORTANT COACHING PRINCIPLES:
- Always reference specific goals, progress, and context from the user's data
- Provide actionable, personalized advice based on their actual situation
- Celebrate progress and acknowledge challenges
- Maintain accountability with gentle but persistent follow-ups
- Connect current conversations to past discussions and goals

`;

    // Add assessment context if available
    if (assessmentContext) {
      systemPrompt += assessmentContext + '\n\n';
    }

    // Add goal tracking context if available
    if (context) {
      const {
        user,
        active_goals,
        recent_sessions,
        life_satisfaction,
        recent_progress,
        upcoming_deadlines,
        action_items_due
      } = context;

      // Build goal awareness section
      const goalAwareness = this.buildGoalAwareness(active_goals);

      // Build progress summary
      const progressSummary = this.buildProgressSummary(active_goals, recent_progress);

      // Build context summary
      const contextSummary = this.buildContextSummary(context);

      // Get coaching style instructions
      const coachingInstructions = this.getCoachingStyleInstructions(user.preferred_coaching_style);

      // Identify current focus areas
      const focusAreas = this.identifyFocusAreas(active_goals, life_satisfaction, upcoming_deadlines);

      // Add goal tracking context to system prompt
      systemPrompt += this.buildGoalTrackingSection({
        userName: user.email.split('@')[0], // Use email username as fallback
        goalAwareness,
        progressSummary,
        coachingInstructions,
        focusAreas,
        recentSessions: recent_sessions,
        upcomingDeadlines: upcoming_deadlines,
        lifeSatisfaction: life_satisfaction
      });

      return {
        system_prompt: systemPrompt,
        context_summary: contextSummary,
        goal_awareness: goalAwareness,
        recent_progress: progressSummary,
        coaching_style_instructions: coachingInstructions,
        current_focus_areas: focusAreas
      };
    }

    // Assessment-only context
    return {
      system_prompt: systemPrompt,
      context_summary: 'Assessment-based coaching context available',
      goal_awareness: 'Assessment data available for personalized coaching',
      recent_progress: 'No goal tracking data yet',
      coaching_style_instructions: 'Use assessment insights for personalized coaching',
      current_focus_areas: ['assessment insights']
    };
  }

  private static buildGoalAwareness(goals: UserGoal[]): string {
    if (goals.length === 0) {
      return 'User has not set up any goals yet. Encourage them to set meaningful goals.';
    }

    const goalsByPriority = goals.reduce((acc, goal) => {
      if (!acc[goal.priority_level]) acc[goal.priority_level] = [];
      acc[goal.priority_level].push(goal);
      return acc;
    }, {} as Record<string, UserGoal[]>);

    let awareness = `ACTIVE GOALS (${goals.length} total):\n\n`;

    ['high', 'medium', 'low'].forEach(priority => {
      const priorityGoals = goalsByPriority[priority] || [];
      if (priorityGoals.length > 0) {
        awareness += `${priority.toUpperCase()} Priority:\n`;
        priorityGoals.forEach(goal => {
          const progress = goal.progress_percentage;
          const status = progress < 25 ? 'just started' :
                        progress < 50 ? 'making progress' :
                        progress < 75 ? 'well underway' : 'nearly complete';

          awareness += `• ${goal.title} (${goal.category}) - ${progress}% complete, ${status}\n`;
          if (goal.target_date) {
            const daysUntil = Math.ceil((new Date(goal.target_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
            awareness += `  Target: ${goal.target_date} (${daysUntil > 0 ? `${daysUntil} days left` : 'overdue'})\n`;
          }
        });
        awareness += '\n';
      }
    });

    return awareness;
  }

  private static buildProgressSummary(goals: UserGoal[], recentProgress: { [goalId: string]: number }): string {
    if (goals.length === 0) {
      return 'No goals to track progress on yet.';
    }

    const progressingGoals = goals.filter(goal => goal.progress_percentage > 0);
    const stagnantGoals = goals.filter(goal =>
      goal.progress_percentage < 25 &&
      new Date(goal.created_at).getTime() < Date.now() - (14 * 24 * 60 * 60 * 1000)
    );

    let summary = `RECENT PROGRESS:\n`;

    if (progressingGoals.length > 0) {
      summary += `Making progress on ${progressingGoals.length} goals:\n`;
      progressingGoals.forEach(goal => {
        summary += `• ${goal.title}: ${goal.progress_percentage}% complete\n`;
      });
    }

    if (stagnantGoals.length > 0) {
      summary += `\nNeeds attention (${stagnantGoals.length} goals with little recent progress):\n`;
      stagnantGoals.forEach(goal => {
        summary += `• ${goal.title}: ${goal.progress_percentage}% (created ${Math.ceil((Date.now() - new Date(goal.created_at).getTime()) / (1000 * 60 * 60 * 24))} days ago)\n`;
      });
    }

    return summary;
  }

  private static buildContextSummary(context: CoachingContext): string {
    const { user, active_goals, life_satisfaction } = context;

    const avgSatisfaction = Object.values(life_satisfaction).reduce((sum, val) => sum + val, 0) / Object.values(life_satisfaction).length;
    const lowSatisfactionAreas = Object.entries(life_satisfaction)
      .filter(([_, score]) => score < 6)
      .map(([area, _]) => area);

    return `User ${user.email} | ${active_goals.length} active goals | Average life satisfaction: ${avgSatisfaction.toFixed(1)}/10 | Areas needing attention: ${lowSatisfactionAreas.join(', ') || 'None'}`;
  }

  private static getCoachingStyleInstructions(style: CoachingStyle): string {
    const styleConfig = COACHING_STYLES[style];
    return styleConfig.prompt_style;
  }

  private static identifyFocusAreas(
    goals: UserGoal[],
    lifeSatisfaction: { [area: string]: number },
    upcomingDeadlines: Array<{ goal: UserGoal; days_until: number }>
  ): string[] {
    const focusAreas: string[] = [];

    // Goals with upcoming deadlines
    if (upcomingDeadlines.length > 0) {
      focusAreas.push(`Upcoming deadlines: ${upcomingDeadlines.map(d => d.goal.title).join(', ')}`);
    }

    // Life areas with low satisfaction
    const lowSatisfactionAreas = Object.entries(lifeSatisfaction)
      .filter(([_, score]) => score < 6)
      .map(([area, _]) => area);

    if (lowSatisfactionAreas.length > 0) {
      focusAreas.push(`Improving satisfaction in: ${lowSatisfactionAreas.join(', ')}`);
    }

    // High priority goals
    const highPriorityGoals = goals.filter(g => g.priority_level === 'high');
    if (highPriorityGoals.length > 0) {
      focusAreas.push(`High priority goals: ${highPriorityGoals.map(g => g.title).join(', ')}`);
    }

    return focusAreas;
  }

  private static buildGoalTrackingSection(params: {
    userName: string;
    goalAwareness: string;
    progressSummary: string;
    coachingInstructions: string;
    focusAreas: string[];
    recentSessions: any[];
    upcomingDeadlines: Array<{ goal: UserGoal; days_until: number }>;
    lifeSatisfaction: { [area: string]: number };
  }): string {
    const {
      userName,
      goalAwareness,
      progressSummary,
      coachingInstructions,
      focusAreas,
      upcomingDeadlines,
      lifeSatisfaction
    } = params;

    return `You are Catalyst AI - ${userName}'s personal AI assistant and life coach that knows their goals and helps them achieve more.

YOUR ENHANCED PERSONALITY:
- You remember and reference their goals naturally in conversations
- You provide personalized encouragement and accountability
- You connect current questions to their broader objectives and personal growth
- You celebrate progress and acknowledge setbacks with understanding
- You offer specific, actionable advice based on their situation
- You maintain conversation continuity across sessions

${goalAwareness}

${progressSummary}

COACHING APPROACH:
${coachingInstructions}

CURRENT FOCUS AREAS:
${focusAreas.length > 0 ? focusAreas.map(area => `• ${area}`).join('\n') : '• General life improvement and goal achievement'}

CONVERSATION GUIDELINES:
1. When they ask ANY question, consider how it relates to their goals and growth
2. Reference their specific goals and progress naturally in responses
3. Provide accountability by asking about commitments and progress
4. Celebrate wins, both big and small
5. Help them see connections between daily actions and bigger objectives
6. Be supportive but honest about challenges and setbacks
7. Offer specific next steps, not just general advice

EXAMPLES OF GOAL-AWARE RESPONSES:
- "That coding question connects to your career goal! Learning Python will definitely help with that promotion."
- "I remember you mentioned wanting to improve your health - this meal planning question shows you're taking action!"
- "How's your morning routine goal coming along? This productivity question suggests you're thinking strategically."

Make every interaction feel personalized and growth-oriented. You're not just answering questions - you're helping them build the life they want.`;
  }

  // Session-specific prompts for different coaching scenarios
  static generateGoalCoachingPrompt(goalId: string, context: CoachingContext): string {
    const goal = context.active_goals.find(g => g.id === goalId);
    if (!goal) return '';

    const progress = goal.progress_percentage;
    const daysUntilTarget = goal.target_date ?
      Math.ceil((new Date(goal.target_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : null;

    return `You are providing focused coaching on ${context.user.email.split('@')[0]}'s goal: "${goal.title}"

GOAL DETAILS:
- Category: ${goal.category}
- Description: ${goal.description || 'No detailed description provided'}
- Current Progress: ${progress}%
- Priority: ${goal.priority_level}
- Target Date: ${goal.target_date || 'No target date set'}
${daysUntilTarget ? `- Days Until Target: ${daysUntilTarget}` : ''}

COACHING FOCUS:
1. Help them break down current challenges into manageable steps
2. Identify specific next actions they can take this week
3. Anticipate and help overcome obstacles
4. Maintain motivation and momentum
5. Connect this goal to their other life priorities
6. Hold them accountable to previous commitments

Be specific, encouraging, and focused on forward progress. Ask probing questions to understand what's working and what isn't.`;
  }

  static generateCheckInPrompt(daysSinceLastCheckIn: number, context: CoachingContext): string {
    const urgentGoals = context.upcoming_deadlines.filter(d => d.days_until <= 7);
    const stagnantGoals = context.active_goals.filter(goal =>
      goal.progress_percentage < 25 &&
      new Date(goal.created_at).getTime() < Date.now() - (14 * 24 * 60 * 60 * 1000)
    );

    return `You are conducting a check-in with ${context.user.email.split('@')[0]} on their goals and life progress.

SINCE LAST CHECK-IN (${daysSinceLastCheckIn} days ago):
${context.recent_sessions.length > 0 ?
  'Previous commitments to follow up on: ' + context.recent_sessions[0]?.action_items?.map((item: any) => item.description).join(', ') :
  'No previous coaching session data available'
}

TODAY'S CHECK-IN FOCUS:
${urgentGoals.length > 0 ? `- URGENT: Goals with upcoming deadlines: ${urgentGoals.map(g => g.goal.title).join(', ')}` : ''}
${stagnantGoals.length > 0 ? `- ATTENTION NEEDED: Goals lacking progress: ${stagnantGoals.map(g => g.title).join(', ')}` : ''}
- Ask about progress on specific commitments from last session
- Identify what's working well and what isn't
- Adjust strategies if needed
- Set new action items for the next period
- Celebrate wins and learn from setbacks

Be curious, supportive, and focused on maintaining forward momentum. This is about accountability and course correction.`;
  }

  static generateLifeAreaCoachingPrompt(lifeArea: string, context: CoachingContext): string {
    const satisfaction = context.life_satisfaction[lifeArea] || 5;
    const relatedGoals = context.active_goals.filter(goal => {
      // Map life areas to goal categories
      const categoryMap: { [key: string]: string[] } = {
        'Health & Fitness': ['health'],
        'Career & Business': ['career', 'business'],
        'Relationships': ['relationships'],
        'Learning & Growth': ['learning', 'personal_growth'],
        'Finance': ['finance'],
        'Creativity & Hobbies': ['creativity', 'hobbies'],
        'Lifestyle': ['lifestyle'],
        'Mental Health': ['mental_health']
      };

      const categories = categoryMap[lifeArea] || [];
      return categories.includes(goal.category);
    });

    return `You are helping ${context.user.email.split('@')[0]} with their ${lifeArea} area.

CURRENT STATE:
- Life satisfaction in this area: ${satisfaction}/10
- Active goals in this area: ${relatedGoals.length > 0 ? relatedGoals.map(g => g.title).join(', ') : 'None set yet'}
- Overall life context: Consider how this area affects and is affected by their other goals

COACHING APPROACH:
- Provide advice that considers their whole life context
- Connect recommendations to their existing goals and priorities
- Offer practical, actionable steps they can take
- Acknowledge their unique situation and preferences
- Help them see how improving this area supports their other objectives

${satisfaction < 6 ?
  `SPECIAL FOCUS: This area has lower satisfaction (${satisfaction}/10). Help them identify specific improvements they can make.` :
  `MAINTAINING MOMENTUM: This area is going well (${satisfaction}/10). Help them maintain and build on this success.`
}`;
  }

  // Utility methods for dynamic coaching responses
  static generateProgressCelebration(goal: UserGoal, oldProgress: number, newProgress: number): string {
    const improvement = newProgress - oldProgress;

    if (improvement >= 25) {
      return `🎉 Amazing progress on "${goal.title}"! You've jumped from ${oldProgress}% to ${newProgress}% - that's incredible momentum! What's been working so well for you?`;
    } else if (improvement >= 10) {
      return `🌟 Great work on "${goal.title}"! Moving from ${oldProgress}% to ${newProgress}% shows real consistency. Keep this up!`;
    } else if (improvement > 0) {
      return `👏 Nice progress on "${goal.title}"! Every step forward counts. You're now at ${newProgress}% - what's your next move?`;
    } else if (newProgress >= 90) {
      return `🏆 You're SO close to completing "${goal.title}"! At ${newProgress}%, what do you need to push through to the finish line?`;
    } else {
      return `I see you're at ${newProgress}% on "${goal.title}". What's been challenging lately? Let's figure out how to get you moving forward again.`;
    }
  }

  static generateMotivationalReminder(goal: UserGoal, daysUntilDeadline: number): string {
    if (daysUntilDeadline <= 0) {
      return `Your "${goal.title}" deadline has passed. Don't worry - let's reassess and set a new realistic timeline. What's your next step?`;
    } else if (daysUntilDeadline <= 7) {
      return `⚡ Only ${daysUntilDeadline} days left for "${goal.title}"! You're at ${goal.progress_percentage}% - what can you accomplish today to push forward?`;
    } else if (daysUntilDeadline <= 30) {
      return `📅 "${goal.title}" is coming up in ${daysUntilDeadline} days. At ${goal.progress_percentage}% complete, you're ${goal.progress_percentage >= 50 ? 'on track' : 'behind schedule'}. What's your plan for this week?`;
    } else {
      return `You have ${daysUntilDeadline} days for "${goal.title}". At your current pace (${goal.progress_percentage}%), you're ${goal.progress_percentage >= 25 ? 'making good progress' : 'just getting started'}. What would help you maintain momentum?`;
    }
  }

  static generateInsightPrompt(goals: UserGoal[], recentSessions: any[]): string {
    // Analyze patterns and generate personalized insights
    const highProgressGoals = goals.filter(g => g.progress_percentage > 75);
    const stagnantGoals = goals.filter(g => g.progress_percentage < 25);
    const categories = [...new Set(goals.map(g => g.category))];

    let insights = [];

    if (highProgressGoals.length > 0) {
      insights.push(`You're excelling at ${highProgressGoals.map(g => g.title).join(', ')}. What patterns from these successes can you apply to other goals?`);
    }

    if (stagnantGoals.length > 0) {
      insights.push(`Goals needing attention: ${stagnantGoals.map(g => g.title).join(', ')}. Consider breaking these into smaller, more manageable steps.`);
    }

    if (categories.length > 3) {
      insights.push(`You're working on ${categories.length} different life areas. Consider focusing on 2-3 priorities to avoid spreading yourself too thin.`);
    }

    return insights.join(' ');
  }
}