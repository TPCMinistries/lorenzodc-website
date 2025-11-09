/**
 * Lead Scoring System
 * Automatically tags leads as Hot/Warm/Cold based on behavior and assessment data
 */

export type LeadScore = 'hot' | 'warm' | 'cold';
export type LeadTag = 'assessment_complete' | 'high_score' | 'ready_to_buy' | 'needs_nurture' | 'unengaged';

export interface LeadScoringData {
  // Assessment data
  assessmentCompleted: boolean;
  overallScore?: number;
  scoreBreakdown?: {
    current_state: number;
    strategy_vision: number;
    team_capabilities: number;
    implementation: number;
  };

  // Engagement data
  emailOpened?: boolean;
  emailClicked?: boolean;
  calendarBooked?: boolean;
  chatUsed?: boolean;

  // Timing
  daysSinceSignup?: number;
  daysSinceAssessment?: number;
}

export interface LeadScoreResult {
  score: LeadScore;
  points: number; // 0-100
  tags: LeadTag[];
  priority: number; // 1-5 (5 = highest)
  recommendedAction: string;
  nextFollowUpDays: number;
}

/**
 * Calculate lead score based on multiple factors
 */
export function calculateLeadScore(data: LeadScoringData): LeadScoreResult {
  let points = 0;
  const tags: LeadTag[] = [];
  let recommendedAction = '';

  // Assessment completion (+30 points)
  if (data.assessmentCompleted) {
    points += 30;
    tags.push('assessment_complete');
  }

  // High assessment score (+20 points for 70+, +10 for 50-69)
  if (data.overallScore) {
    if (data.overallScore >= 70) {
      points += 20;
      tags.push('high_score');
      tags.push('ready_to_buy');
    } else if (data.overallScore >= 50) {
      points += 10;
    } else {
      tags.push('needs_nurture');
    }
  }

  // Email engagement
  if (data.emailOpened) {
    points += 5;
  }
  if (data.emailClicked) {
    points += 15;
  }

  // Calendar booking (very strong signal +35 points)
  if (data.calendarBooked) {
    points += 35;
    tags.push('ready_to_buy');
  }

  // Chat usage (+15 points)
  if (data.chatUsed) {
    points += 15;
  }

  // Timing penalties
  if (data.daysSinceSignup && data.daysSinceSignup > 30 && !data.assessmentCompleted) {
    points -= 10;
    tags.push('unengaged');
  }

  if (data.daysSinceAssessment && data.daysSinceAssessment > 14 && !data.calendarBooked) {
    points -= 5;
  }

  // Score imbalance bonus (shows they need help)
  if (data.scoreBreakdown) {
    const scores = Object.values(data.scoreBreakdown);
    const max = Math.max(...scores);
    const min = Math.min(...scores);
    if (max - min > 30) {
      points += 10; // They have gaps we can fix
    }
  }

  // Cap points at 0-100
  points = Math.max(0, Math.min(100, points));

  // Determine score tier
  let score: LeadScore;
  let priority: number;
  let nextFollowUpDays: number;

  if (points >= 70) {
    score = 'hot';
    priority = 5;
    nextFollowUpDays = 1;
    recommendedAction = 'URGENT: Personal outreach within 24 hours. Call or personalized video message.';
  } else if (points >= 40) {
    score = 'warm';
    priority = 3;
    nextFollowUpDays = 3;
    recommendedAction = 'Send personalized follow-up email with specific value proposition.';
  } else {
    score = 'cold';
    priority = 1;
    nextFollowUpDays = 7;
    recommendedAction = 'Add to nurture sequence. Focus on education and value.';
  }

  // Override for calendar bookings - always hot
  if (data.calendarBooked) {
    score = 'hot';
    priority = 5;
    nextFollowUpDays = 0;
    recommendedAction = 'BOOKED: Prepare personalized call agenda. Research their business.';
  }

  return {
    score,
    points,
    tags,
    priority,
    recommendedAction,
    nextFollowUpDays
  };
}

/**
 * Get lead priority for display
 */
export function getLeadPriorityLabel(priority: number): string {
  switch (priority) {
    case 5: return '🔥 Urgent';
    case 4: return '⚡ High';
    case 3: return '📈 Medium';
    case 2: return '📊 Low';
    case 1: return '❄️ Cold';
    default: return '📊 Unknown';
  }
}

/**
 * Get color coding for lead score
 */
export function getLeadScoreColor(score: LeadScore): { bg: string; text: string; border: string } {
  switch (score) {
    case 'hot':
      return { bg: '#fee2e2', text: '#991b1b', border: '#ef4444' };
    case 'warm':
      return { bg: '#fef3c7', text: '#92400e', border: '#f59e0b' };
    case 'cold':
      return { bg: '#dbeafe', text: '#1e3a8a', border: '#3b82f6' };
  }
}

/**
 * Suggest next action based on lead data
 */
export function suggestNextAction(data: LeadScoringData, scoreResult: LeadScoreResult): {
  action: string;
  template: 'personal_outreach' | 'follow_up' | 'nurture' | 'reengagement';
  urgency: 'immediate' | 'today' | 'this_week' | 'this_month';
} {
  // Calendar booked
  if (data.calendarBooked) {
    return {
      action: 'Prepare for strategy call - research their business and create personalized agenda',
      template: 'personal_outreach',
      urgency: 'immediate'
    };
  }

  // Completed assessment but no calendar booking
  if (data.assessmentCompleted && !data.calendarBooked) {
    if (data.daysSinceAssessment && data.daysSinceAssessment <= 1) {
      return {
        action: 'Send personal video message reviewing their results',
        template: 'personal_outreach',
        urgency: 'today'
      };
    }
    return {
      action: 'Send calendar booking reminder with case study',
      template: 'follow_up',
      urgency: 'this_week'
    };
  }

  // Signed up but no assessment
  if (!data.assessmentCompleted) {
    if (data.daysSinceSignup && data.daysSinceSignup > 14) {
      return {
        action: 'Send re-engagement campaign with social proof',
        template: 'reengagement',
        urgency: 'this_week'
      };
    }
    return {
      action: 'Send assessment reminder with value proposition',
      template: 'nurture',
      urgency: 'this_week'
    };
  }

  return {
    action: 'Continue nurture sequence',
    template: 'nurture',
    urgency: 'this_month'
  };
}
