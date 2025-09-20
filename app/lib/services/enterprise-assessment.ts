// import { supabase } from supabase - temporarily disabled for deployment

export interface EnterpriseAssessmentQuestion {
  id: string;
  category: string;
  question_type: 'rating' | 'multiple_choice' | 'text' | 'checkbox' | 'number';
  question_text: string;
  question_subtext?: string;
  options?: string[];
  is_required: boolean;
}

export interface WorkflowPainPoint {
  process: string;
  time_spent: number;
  frustration_level: number;
  automation_potential: number;
}

export interface EnterpriseAssessment {
  id: string;
  user_id?: string;
  session_id: string;
  company_name: string;
  industry: string;
  company_size: string;
  annual_revenue_range: string;
  business_model: string;
  team_structure: Record<string, any>;
  current_tools: string[];
  workflow_pain_points: WorkflowPainPoint[];
  automation_opportunities: string[];
  decision_making_bottlenecks: string[];
  manual_processes: string[];
  technical_readiness_score: number;
  cultural_readiness_score: number;
  leadership_buy_in_score: number;
  potential_time_savings_hours: number;
  potential_cost_savings_monthly: number;
  implementation_complexity_score: number;
  average_hourly_cost: number;
  completed_at?: string;
  assessment_date: string;
}

export interface EnterpriseRecommendation {
  id: string;
  assessment_id: string;
  category: 'quick_wins' | 'medium_term' | 'strategic';
  priority: number;
  recommendation_text: string;
  estimated_impact: 'High' | 'Medium' | 'Low';
  implementation_time: string;
  tools_required: string[];
  roi_potential: number;
  confidence_level: number;
}

export interface ROICalculation {
  monthly_savings: number;
  annual_savings: number;
  payback_period_months: number;
  confidence_level: number;
  roi_percentage: number;
}

export interface EnterpriseProgress {
  session_id: string;
  current_step: number;
  total_steps: number;
  responses: Record<string, any>;
  last_updated: string;
}

export class EnterpriseAssessmentService {

  // Generate unique session ID for enterprise assessments
  static generateSessionId(): string {
    return 'enterprise_' + crypto.randomUUID();
  }

  // Get all enterprise assessment questions
  static getAssessmentQuestions(): EnterpriseAssessmentQuestion[] {
    return [
      // Company Profile Questions
      {
        id: 'company_name',
        category: 'company_profile',
        question_type: 'text',
        question_text: 'What is your company name?',
        is_required: true
      },
      {
        id: 'industry',
        category: 'company_profile',
        question_type: 'multiple_choice',
        question_text: 'What industry best describes your business?',
        options: [
          'Technology/Software',
          'Healthcare',
          'Financial Services',
          'Manufacturing',
          'Retail/E-commerce',
          'Professional Services',
          'Education',
          'Real Estate',
          'Media/Marketing',
          'Other'
        ],
        is_required: true
      },
      {
        id: 'company_size',
        category: 'company_profile',
        question_type: 'multiple_choice',
        question_text: 'How many employees does your company have?',
        options: ['1-10', '11-50', '51-200', '201-1000', '1000+'],
        is_required: true
      },
      {
        id: 'annual_revenue_range',
        category: 'company_profile',
        question_type: 'multiple_choice',
        question_text: 'What is your approximate annual revenue?',
        options: [
          'Under $100K',
          '$100K - $1M',
          '$1M - $10M',
          '$10M - $100M',
          '$100M+'
        ],
        is_required: true
      },
      {
        id: 'business_model',
        category: 'company_profile',
        question_type: 'multiple_choice',
        question_text: 'What best describes your primary business model?',
        options: [
          'SaaS/Software',
          'E-commerce',
          'Professional Services',
          'Manufacturing',
          'Consulting',
          'Healthcare Services',
          'Education/Training',
          'Other'
        ],
        is_required: true
      },

      // Team & Structure Analysis
      {
        id: 'struggling_departments',
        category: 'team_analysis',
        question_type: 'checkbox',
        question_text: 'Which departments struggle most with efficiency? (Select all that apply)',
        options: [
          'Sales',
          'Marketing',
          'Operations',
          'Customer Service',
          'HR',
          'Finance',
          'IT',
          'Product Development'
        ],
        is_required: true
      },
      {
        id: 'manual_data_entry_hours',
        category: 'team_analysis',
        question_type: 'multiple_choice',
        question_text: 'How many hours per week does your team spend on manual data entry?',
        options: [
          'Less than 5 hours',
          '5-15 hours',
          '16-30 hours',
          '31-50 hours',
          'More than 50 hours'
        ],
        is_required: true
      },
      {
        id: 'operational_bottleneck',
        category: 'team_analysis',
        question_type: 'text',
        question_text: 'What is your biggest operational bottleneck?',
        question_subtext: 'Describe the process or area that slows everything else down',
        is_required: true
      },
      {
        id: 'information_sharing',
        category: 'team_analysis',
        question_type: 'checkbox',
        question_text: 'How do teams currently share information? (Select all that apply)',
        options: [
          'Email',
          'Slack/Teams',
          'In-person meetings',
          'Shared spreadsheets',
          'Project management tools',
          'Wiki/Documentation',
          'Phone calls',
          'Informal conversations'
        ],
        is_required: true
      },

      // Process Audit
      {
        id: 'time_consuming_processes',
        category: 'process_audit',
        question_type: 'checkbox',
        question_text: 'Which processes take the longest that shouldn\'t? (Select all that apply)',
        options: [
          'Customer onboarding',
          'Invoice processing',
          'Report generation',
          'Data entry and validation',
          'Scheduling and coordination',
          'Customer support responses',
          'Expense approvals',
          'Inventory management',
          'Quality assurance',
          'Compliance documentation'
        ],
        is_required: true
      },
      {
        id: 'decision_bottlenecks',
        category: 'process_audit',
        question_type: 'text',
        question_text: 'What decisions require too much back-and-forth?',
        question_subtext: 'Describe decisions that should be quick but take days or weeks',
        is_required: true
      },
      {
        id: 'customer_loss_processes',
        category: 'process_audit',
        question_type: 'text',
        question_text: 'Where do you lose customers due to slow processes?',
        question_subtext: 'What bottlenecks cause customer frustration or churn?',
        is_required: false
      },
      {
        id: 'report_generation_time',
        category: 'process_audit',
        question_type: 'multiple_choice',
        question_text: 'How long do your regular business reports take to generate?',
        options: [
          'Less than 1 hour',
          '1-4 hours',
          '4-8 hours',
          '1-2 days',
          'More than 2 days'
        ],
        is_required: true
      },

      // AI Readiness Assessment
      {
        id: 'leadership_ai_comfort',
        category: 'ai_readiness',
        question_type: 'rating',
        question_text: 'How comfortable is leadership with AI adoption?',
        question_subtext: 'Rate from 1 (very uncomfortable) to 10 (fully supportive)',
        is_required: true
      },
      {
        id: 'team_ai_usage',
        category: 'ai_readiness',
        question_type: 'multiple_choice',
        question_text: 'What percentage of your team currently uses any AI tools?',
        options: [
          '0% - No one uses AI',
          '1-25% - A few early adopters',
          '26-50% - About half the team',
          '51-75% - Most of the team',
          '76-100% - Everyone uses AI'
        ],
        is_required: true
      },
      {
        id: 'current_tech_stack',
        category: 'ai_readiness',
        question_type: 'checkbox',
        question_text: 'What tools and systems do you currently use? (Select all that apply)',
        options: [
          'CRM (Salesforce, HubSpot, etc.)',
          'ERP System',
          'Project Management (Asana, Monday, etc.)',
          'Communication (Slack, Teams)',
          'Email Marketing Platform',
          'Analytics (Google Analytics, etc.)',
          'Accounting Software',
          'HR Management System',
          'Custom Software/Database',
          'Spreadsheets (Excel, Google Sheets)'
        ],
        is_required: true
      },
      {
        id: 'ai_implementation_concerns',
        category: 'ai_readiness',
        question_type: 'multiple_choice',
        question_text: 'What is your biggest concern about AI implementation?',
        options: [
          'Data security and privacy',
          'Cost and ROI uncertainty',
          'Team training and adoption',
          'Technology reliability',
          'Integration complexity',
          'Regulatory compliance',
          'Job displacement fears',
          'Lack of technical expertise'
        ],
        is_required: true
      },

      // ROI Calculation Inputs
      {
        id: 'average_hourly_cost',
        category: 'roi_inputs',
        question_type: 'multiple_choice',
        question_text: 'What is the average hourly cost per employee (including benefits)?',
        options: [
          '$25-40/hour',
          '$41-60/hour',
          '$61-80/hour',
          '$81-100/hour',
          '$100+/hour'
        ],
        is_required: true
      },
      {
        id: 'manual_process_cost',
        category: 'roi_inputs',
        question_type: 'multiple_choice',
        question_text: 'Current monthly spend on manual processes and inefficiencies?',
        options: [
          'Under $5K/month',
          '$5K-15K/month',
          '$15K-50K/month',
          '$50K-100K/month',
          '$100K+/month'
        ],
        is_required: true
      },
      {
        id: 'efficiency_improvement_value',
        category: 'roi_inputs',
        question_type: 'number',
        question_text: 'How much would a 20% efficiency improvement be worth monthly?',
        question_subtext: 'Enter dollar amount (e.g., 10000 for $10,000)',
        is_required: true
      }
    ];
  }

  // Save progress for multi-session completion
  static async saveProgress(sessionId: string, step: number, responses: Record<string, any>): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase
      .from('enterprise_assessment_progress')
      .upsert({
        session_id: sessionId,
        user_id: user?.id || null,
        current_step: step,
        total_steps: 5,
        responses: responses,
        last_updated: new Date().toISOString()
      });

    return !error;
  }

  // Get saved progress
  static async getProgress(sessionId: string): Promise<EnterpriseProgress | null> {
    const { data, error } = await supabase
      .from('enterprise_assessment_progress')
      .select('*')
      .eq('session_id', sessionId)
      .single();

    if (error || !data) {
      return null;
    }

    return data;
  }

  // Submit completed enterprise assessment
  static async submitAssessment(sessionId: string, responses: Record<string, any>): Promise<EnterpriseAssessment | null> {
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
      .from('enterprise_assessments')
      .insert(assessmentResult)
      .select()
      .single();

    if (error) {
      console.error('Error submitting enterprise assessment:', error);
      return null;
    }

    // Clean up progress
    await supabase
      .from('enterprise_assessment_progress')
      .delete()
      .eq('session_id', sessionId);

    return data;
  }

  // Process raw responses into structured assessment data
  private static processAssessmentResponses(responses: Record<string, any>) {
    // Extract basic company information
    const companyName = responses.company_name || 'Unknown Company';
    const industry = responses.industry || 'Other';
    const companySize = responses.company_size || '1-10';
    const annualRevenueRange = this.mapRevenueRange(responses.annual_revenue_range);
    const businessModel = responses.business_model || 'Other';

    // Process team structure and pain points
    const strugglingDepartments = Array.isArray(responses.struggling_departments)
      ? responses.struggling_departments : [];

    const currentTools = Array.isArray(responses.current_tech_stack)
      ? responses.current_tech_stack : [];

    // Calculate AI readiness scores
    const leadershipComfort = Number(responses.leadership_ai_comfort) || 5;
    const teamUsageScore = this.mapTeamUsageToScore(responses.team_ai_usage);
    const techStackScore = this.calculateTechStackScore(currentTools);

    const technicalReadinessScore = Math.round((techStackScore + teamUsageScore) / 2);
    const culturalReadinessScore = Math.round((leadershipComfort * 10 + teamUsageScore) / 2);
    const leadershipBuyInScore = leadershipComfort * 10;

    // Calculate potential savings
    const avgHourlyCost = this.mapHourlyCost(responses.average_hourly_cost);
    const manualHours = this.mapManualHours(responses.manual_data_entry_hours);
    const potentialTimeSavingsHours = Math.round(manualHours * 0.6); // Assume 60% automation potential
    const potentialCostSavingsMonthly = potentialTimeSavingsHours * avgHourlyCost * 4; // 4 weeks

    // Generate workflow pain points
    const workflowPainPoints = this.generateWorkflowPainPoints(responses);

    return {
      company_name: companyName,
      industry: industry,
      company_size: companySize,
      annual_revenue_range: annualRevenueRange,
      business_model: businessModel,
      team_structure: {
        struggling_departments: strugglingDepartments,
        information_sharing: responses.information_sharing || []
      },
      current_tools: currentTools,
      workflow_pain_points: workflowPainPoints,
      automation_opportunities: responses.time_consuming_processes || [],
      decision_making_bottlenecks: [responses.decision_bottlenecks].filter(Boolean),
      manual_processes: [responses.operational_bottleneck].filter(Boolean),
      technical_readiness_score: technicalReadinessScore,
      cultural_readiness_score: culturalReadinessScore,
      leadership_buy_in_score: leadershipBuyInScore,
      potential_time_savings_hours: potentialTimeSavingsHours,
      potential_cost_savings_monthly: potentialCostSavingsMonthly,
      implementation_complexity_score: this.calculateComplexityScore(
        technicalReadinessScore, culturalReadinessScore, companySize, currentTools.length
      ),
      average_hourly_cost: avgHourlyCost
    };
  }

  private static mapRevenueRange(range: string): string {
    const mapping: Record<string, string> = {
      'Under $100K': 'under-100k',
      '$100K - $1M': '100k-1m',
      '$1M - $10M': '1m-10m',
      '$10M - $100M': '10m-100m',
      '$100M+': '100m+'
    };
    return mapping[range] || 'under-100k';
  }

  private static mapTeamUsageToScore(usage: string): number {
    const mapping: Record<string, number> = {
      '0% - No one uses AI': 10,
      '1-25% - A few early adopters': 30,
      '26-50% - About half the team': 50,
      '51-75% - Most of the team': 75,
      '76-100% - Everyone uses AI': 90
    };
    return mapping[usage] || 10;
  }

  private static calculateTechStackScore(tools: string[]): number {
    // More modern tools = higher readiness
    const modernTools = [
      'CRM (Salesforce, HubSpot, etc.)',
      'Project Management (Asana, Monday, etc.)',
      'Communication (Slack, Teams)',
      'Analytics (Google Analytics, etc.)'
    ];

    const modernToolCount = tools.filter(tool => modernTools.includes(tool)).length;
    return Math.min(90, modernToolCount * 20 + 10);
  }

  private static mapHourlyCost(costRange: string): number {
    const mapping: Record<string, number> = {
      '$25-40/hour': 32.5,
      '$41-60/hour': 50.5,
      '$61-80/hour': 70.5,
      '$81-100/hour': 90.5,
      '$100+/hour': 120
    };
    return mapping[costRange] || 50;
  }

  private static mapManualHours(hoursRange: string): number {
    const mapping: Record<string, number> = {
      'Less than 5 hours': 2.5,
      '5-15 hours': 10,
      '16-30 hours': 23,
      '31-50 hours': 40,
      'More than 50 hours': 60
    };
    return mapping[hoursRange] || 10;
  }

  private static generateWorkflowPainPoints(responses: Record<string, any>): WorkflowPainPoint[] {
    const painPoints: WorkflowPainPoint[] = [];

    // Add pain points based on responses
    if (responses.operational_bottleneck) {
      painPoints.push({
        process: responses.operational_bottleneck,
        time_spent: 10, // hours per week
        frustration_level: 8,
        automation_potential: 0.7
      });
    }

    if (responses.decision_bottlenecks) {
      painPoints.push({
        process: `Decision making: ${responses.decision_bottlenecks}`,
        time_spent: 5,
        frustration_level: 7,
        automation_potential: 0.5
      });
    }

    return painPoints;
  }

  private static calculateComplexityScore(
    technicalScore: number,
    culturalScore: number,
    companySize: string,
    toolCount: number
  ): number {
    let complexity = 5; // Base complexity

    // Adjust based on readiness (lower readiness = higher complexity)
    complexity += (100 - technicalScore) / 20;
    complexity += (100 - culturalScore) / 20;

    // Adjust based on company size
    const sizeComplexity: Record<string, number> = {
      '1-10': -2,
      '11-50': -1,
      '51-200': 0,
      '201-1000': 1,
      '1000+': 2
    };
    complexity += sizeComplexity[companySize] || 0;

    // More tools = more integration complexity
    complexity += toolCount / 3;

    return Math.max(1, Math.min(10, Math.round(complexity)));
  }

  // Get enterprise assessment results by session ID
  static async getAssessmentResult(sessionId: string): Promise<EnterpriseAssessment | null> {
    const { data, error } = await supabase
      .from('enterprise_assessments')
      .select('*')
      .eq('session_id', sessionId)
      .single();

    if (error) {
      console.error('Error fetching enterprise assessment result:', error);
      return null;
    }

    return data;
  }

  // Get ROI calculations
  static async getROICalculation(assessmentId: string): Promise<ROICalculation | null> {
    const { data, error } = await supabase
      .rpc('calculate_enterprise_roi', { assessment_id_param: assessmentId });

    if (error) {
      console.error('Error calculating ROI:', error);
      return null;
    }

    return data[0] || null;
  }

  // Get enterprise recommendations
  static async getRecommendations(assessmentId: string): Promise<EnterpriseRecommendation[]> {
    const { data, error } = await supabase
      .from('enterprise_recommendations')
      .select('*')
      .eq('assessment_id', assessmentId)
      .order('priority', { ascending: false });

    if (error) {
      console.error('Error fetching recommendations:', error);
      return [];
    }

    return data || [];
  }
}