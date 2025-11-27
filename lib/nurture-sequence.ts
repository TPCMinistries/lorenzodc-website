/**
 * AI Assessment Nurture Sequence
 *
 * Automated email sequence based on assessment results to nurture leads
 * toward either course purchase or consulting/coaching booking.
 *
 * Sequence varies by:
 * - AI Readiness Level (Beginner, Explorer, Implementer, Leader)
 * - Biggest Challenge
 * - Timeline urgency
 */

export interface NurtureSequenceData {
  email: string;
  name: string;
  industry: string;
  teamSize: string;
  role: string;
  biggestChallenge: string;
  timeline: string;
  overallScore: number;
  scores: {
    current_state: number;
    strategy_vision: number;
    team_capabilities: number;
    implementation: number;
  };
}

export interface NurtureEmail {
  subject: string;
  preheader: string;
  html: string;
  sendAfterDays: number;
  emailNumber: number;
}

// Readiness level determines the overall tone and recommendations
type ReadinessLevel = 'beginner' | 'explorer' | 'implementer' | 'leader';

function getReadinessLevel(score: number): ReadinessLevel {
  if (score >= 80) return 'leader';
  if (score >= 60) return 'implementer';
  if (score >= 40) return 'explorer';
  return 'beginner';
}

// Email wrapper for consistent styling across all email clients
function emailWrapper(content: string, name: string): string {
  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Lorenzo DC - AI Strategy</title>
  <!--[if mso]>
  <style type="text/css">
    body, table, td {font-family: Arial, Helvetica, sans-serif !important;}
  </style>
  <![endif]-->
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: Arial, Helvetica, sans-serif; -webkit-font-smoothing: antialiased;">
  <!-- Preheader text (hidden) -->
  <div style="display: none; max-height: 0; overflow: hidden;">
    &nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;
  </div>

  <!-- Main wrapper table -->
  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f4f4f4;">
    <tr>
      <td align="center" style="padding: 20px 10px;">
        <!-- Content table -->
        <table border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border-radius: 8px; overflow: hidden;">
          <!-- Header -->
          <tr>
            <td align="center" bgcolor="#667eea" style="padding: 30px 40px;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center" style="color: #ffffff; font-size: 24px; font-weight: bold;">
                    Lorenzo DC
                  </td>
                </tr>
                <tr>
                  <td align="center" style="color: #e0e7ff; font-size: 14px; padding-top: 5px;">
                    AI Strategy & Implementation
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 40px 40px 30px 40px;">
              ${content}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td bgcolor="#f8f9fa" style="padding: 30px 40px; border-top: 1px solid #e5e7eb;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center" style="color: #6b7280; font-size: 12px; line-height: 1.5;">
                    <p style="margin: 0 0 10px 0;">
                      You're receiving this because you took the AI Readiness Assessment at lorenzodc.com
                    </p>
                    <p style="margin: 0;">
                      <a href="https://www.lorenzodc.com" style="color: #667eea; text-decoration: none;">Website</a> &nbsp;|&nbsp;
                      <a href="https://www.lorenzodc.com/chat" style="color: #667eea; text-decoration: none;">AI Chat</a> &nbsp;|&nbsp;
                      <a href="https://calendly.com/lorenzo-theglobalenterprise/ai-strategy-call" style="color: #667eea; text-decoration: none;">Book a Call</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// Button component for email compatibility
function emailButton(text: string, url: string, bgColor: string = '#667eea', textColor: string = '#ffffff'): string {
  return `<table border="0" cellpadding="0" cellspacing="0" width="100%">
    <tr>
      <td align="center" style="padding: 20px 0;">
        <!--[if mso]>
        <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${url}" style="height:50px;v-text-anchor:middle;width:280px;" arcsize="10%" strokecolor="${bgColor}" fillcolor="${bgColor}">
          <w:anchorlock/>
          <center style="color:${textColor};font-family:Arial,sans-serif;font-size:16px;font-weight:bold;">${text}</center>
        </v:roundrect>
        <![endif]-->
        <!--[if !mso]><!-->
        <a href="${url}" target="_blank" style="background-color: ${bgColor}; border: 1px solid ${bgColor}; border-radius: 6px; color: ${textColor}; display: inline-block; font-family: Arial, sans-serif; font-size: 16px; font-weight: bold; line-height: 50px; text-align: center; text-decoration: none; width: 280px; -webkit-text-size-adjust: none;">
          ${text}
        </a>
        <!--<![endif]-->
      </td>
    </tr>
  </table>`;
}

// Tip box component
function tipBox(title: string, content: string, emoji: string = '💡'): string {
  return `<table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 20px 0;">
    <tr>
      <td style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; border-radius: 0 8px 8px 0;">
        <p style="margin: 0 0 10px 0; font-size: 16px; font-weight: bold; color: #92400e;">
          ${emoji} ${title}
        </p>
        <p style="margin: 0; color: #78350f; font-size: 14px; line-height: 1.6;">
          ${content}
        </p>
      </td>
    </tr>
  </table>`;
}

// Value box component (for resources/downloads)
function valueBox(title: string, description: string, ctaText: string, ctaUrl: string): string {
  return `<table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 20px 0;">
    <tr>
      <td style="background-color: #eff6ff; border: 1px solid #bfdbfe; padding: 25px; border-radius: 8px;">
        <p style="margin: 0 0 10px 0; font-size: 18px; font-weight: bold; color: #1e40af;">
          ${title}
        </p>
        <p style="margin: 0 0 15px 0; color: #1e3a8a; font-size: 14px; line-height: 1.6;">
          ${description}
        </p>
        <a href="${ctaUrl}" style="color: #2563eb; font-weight: bold; text-decoration: underline;">
          ${ctaText} →
        </a>
      </td>
    </tr>
  </table>`;
}

// Generate the nurture sequence based on assessment data
export function generateNurtureSequence(data: NurtureSequenceData): NurtureEmail[] {
  const readinessLevel = getReadinessLevel(data.overallScore);
  const sequence: NurtureEmail[] = [];

  // Email 1: Day 2 - Quick Win Based on Challenge
  sequence.push(generateQuickWinEmail(data, readinessLevel));

  // Email 2: Day 4 - Industry-Specific Deep Dive
  sequence.push(generateIndustryDeepDiveEmail(data, readinessLevel));

  // Email 3: Day 7 - Address Their Lowest Score
  sequence.push(generateWeakestAreaEmail(data, readinessLevel));

  // Email 4: Day 10 - Case Study / Social Proof
  sequence.push(generateCaseStudyEmail(data, readinessLevel));

  // Email 5: Day 14 - Free Resource / Mini-Course Teaser
  sequence.push(generateResourceEmail(data, readinessLevel));

  // Email 6: Day 21 - Soft Pitch (Course or Consulting based on score)
  sequence.push(generateSoftPitchEmail(data, readinessLevel));

  // Email 7: Day 28 - Final Value + Clear CTA
  sequence.push(generateFinalCTAEmail(data, readinessLevel));

  return sequence;
}

// Email 1: Quick Win (Day 2)
function generateQuickWinEmail(data: NurtureSequenceData, level: ReadinessLevel): NurtureEmail {
  const challengeQuickWins: Record<string, { win: string; steps: string[]; timeToResult: string }> = {
    "Don't know where to start": {
      win: "Your First AI Win in 30 Minutes",
      steps: [
        "Pick ONE repetitive task you do weekly (emails, scheduling, research)",
        "Try ChatGPT or Claude to help with just that one task",
        "Track how much time you save this week"
      ],
      timeToResult: "30 minutes to set up, saves 2-3 hours/week"
    },
    "Data is messy or scattered": {
      win: "The 15-Minute Data Inventory",
      steps: [
        "List every tool where you store customer/business data",
        "Mark which ones can export to CSV or have APIs",
        "Identify your 'single source of truth' for each data type"
      ],
      timeToResult: "15 minutes now, clarity for your AI roadmap"
    },
    "Team lacks AI skills": {
      win: "The Team AI Challenge",
      steps: [
        "Share one AI tool (ChatGPT) with your team today",
        "Give everyone the same task: 'Use AI to help with one thing this week'",
        "Have a 15-min standup Friday to share what worked"
      ],
      timeToResult: "5 minutes to set up, team buy-in by Friday"
    },
    "Hard to prove ROI": {
      win: "The Time-Tracking Trick",
      steps: [
        "Pick your most time-consuming weekly task",
        "Time yourself doing it the old way (write it down)",
        "Try an AI-assisted approach and compare"
      ],
      timeToResult: "You'll have real ROI data by end of week"
    },
    "Finding the right tools": {
      win: "The 3-Tool Test",
      steps: [
        "Define ONE problem you want solved (be specific)",
        "Try 3 different AI tools for that exact problem",
        "Pick the one that feels most natural after 1 day each"
      ],
      timeToResult: "3 days to find your perfect tool fit"
    },
    "Getting buy-in from leadership": {
      win: "The Executive Demo",
      steps: [
        "Pick a task your leadership cares about (reports, analysis)",
        "Do it with AI assistance, document the time saved",
        "Present a 2-minute before/after demo"
      ],
      timeToResult: "1 week to build an undeniable proof point"
    }
  };

  const quickWin = challengeQuickWins[data.biggestChallenge] || challengeQuickWins["Don't know where to start"];

  const content = `
    <p style="margin: 0 0 20px 0; font-size: 16px; color: #374151; line-height: 1.6;">
      Hey ${data.name},
    </p>

    <p style="margin: 0 0 20px 0; font-size: 16px; color: #374151; line-height: 1.6;">
      Yesterday you told me your biggest AI challenge is: <strong>"${data.biggestChallenge}"</strong>
    </p>

    <p style="margin: 0 0 20px 0; font-size: 16px; color: #374151; line-height: 1.6;">
      I've got a quick win for you that takes less than an hour to implement.
    </p>

    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 25px 0;">
      <tr>
        <td style="background-color: #f0fdf4; border: 2px solid #22c55e; padding: 25px; border-radius: 8px;">
          <p style="margin: 0 0 15px 0; font-size: 20px; font-weight: bold; color: #166534;">
            🎯 ${quickWin.win}
          </p>
          <p style="margin: 0 0 15px 0; color: #15803d; font-size: 14px;">
            <strong>Time to result:</strong> ${quickWin.timeToResult}
          </p>
          <p style="margin: 0 0 10px 0; color: #166534; font-weight: bold;">Here's exactly what to do:</p>
          <ol style="margin: 0; padding-left: 20px; color: #166534;">
            ${quickWin.steps.map(step => `<li style="margin-bottom: 8px;">${step}</li>`).join('')}
          </ol>
        </td>
      </tr>
    </table>

    <p style="margin: 0 0 20px 0; font-size: 16px; color: #374151; line-height: 1.6;">
      This isn't theory—it's exactly what I recommend to ${data.industry} companies at your stage.
    </p>

    <p style="margin: 0 0 20px 0; font-size: 16px; color: #374151; line-height: 1.6;">
      <strong>Hit reply and let me know how it goes.</strong> I read every response.
    </p>

    ${tipBox("Pro Tip", "Don't try to automate everything at once. One small win creates momentum for bigger changes.", "⚡")}

    <p style="margin: 20px 0 0 0; font-size: 16px; color: #374151;">
      Talk soon,<br/>
      <strong>Lorenzo</strong>
    </p>

    <p style="margin: 10px 0 0 0; font-size: 14px; color: #6b7280;">
      P.S. Tomorrow I'll share some ${data.industry}-specific AI opportunities you might be missing.
    </p>
  `;

  return {
    subject: `${data.name}, here's your quick win for "${data.biggestChallenge}"`,
    preheader: `A 30-minute action that creates real momentum`,
    html: emailWrapper(content, data.name),
    sendAfterDays: 2,
    emailNumber: 1
  };
}

// Email 2: Industry Deep Dive (Day 4)
function generateIndustryDeepDiveEmail(data: NurtureSequenceData, level: ReadinessLevel): NurtureEmail {
  const industryOpportunities: Record<string, { opportunities: { title: string; impact: string; difficulty: string }[]; stat: string }> = {
    'Technology / Software': {
      opportunities: [
        { title: 'AI-Powered Code Review', impact: '40% faster PR reviews', difficulty: 'Medium' },
        { title: 'Automated Documentation', impact: '10+ hours saved/week', difficulty: 'Easy' },
        { title: 'Smart Customer Support', impact: '60% ticket deflection', difficulty: 'Medium' }
      ],
      stat: 'Tech companies using AI report 34% faster development cycles'
    },
    'Healthcare / Medical': {
      opportunities: [
        { title: 'Patient Intake Automation', impact: '15+ hours saved/week', difficulty: 'Easy' },
        { title: 'Clinical Documentation AI', impact: '50% less admin time', difficulty: 'Medium' },
        { title: 'Appointment Optimization', impact: '25% fewer no-shows', difficulty: 'Easy' }
      ],
      stat: 'Healthcare orgs using AI see 28% improvement in patient satisfaction'
    },
    'Financial Services / Banking': {
      opportunities: [
        { title: 'Compliance Monitoring AI', impact: '80% faster audits', difficulty: 'Medium' },
        { title: 'Automated Reporting', impact: '20+ hours saved/month', difficulty: 'Easy' },
        { title: 'Risk Assessment Automation', impact: '3x faster decisions', difficulty: 'Hard' }
      ],
      stat: 'Financial firms using AI report 45% reduction in compliance costs'
    },
    'Professional Services / Consulting': {
      opportunities: [
        { title: 'Proposal Generation AI', impact: '3x more proposals/week', difficulty: 'Easy' },
        { title: 'Research Automation', impact: '60% faster discovery', difficulty: 'Medium' },
        { title: 'Client Communication AI', impact: '50% faster responses', difficulty: 'Easy' }
      ],
      stat: 'Consulting firms using AI win 40% more proposals'
    },
    'Retail / E-commerce': {
      opportunities: [
        { title: 'Product Recommendations AI', impact: '25% higher AOV', difficulty: 'Medium' },
        { title: 'Inventory Forecasting', impact: '30% less stockouts', difficulty: 'Hard' },
        { title: 'Customer Service Bots', impact: '70% query automation', difficulty: 'Easy' }
      ],
      stat: 'E-commerce brands using AI see 35% increase in repeat purchases'
    },
    'Education / Training': {
      opportunities: [
        { title: 'Personalized Learning Paths', impact: '40% better completion', difficulty: 'Medium' },
        { title: 'AI Grading & Feedback', impact: '15+ hours saved/week', difficulty: 'Easy' },
        { title: 'Content Creation AI', impact: '5x faster course builds', difficulty: 'Easy' }
      ],
      stat: 'EdTech using AI reports 50% improvement in student outcomes'
    },
    'Ministry / Non-profit': {
      opportunities: [
        { title: 'Donor Communication AI', impact: '3x engagement rate', difficulty: 'Easy' },
        { title: 'Event Planning Automation', impact: '60% less admin time', difficulty: 'Easy' },
        { title: 'Volunteer Coordination', impact: '40% better retention', difficulty: 'Medium' }
      ],
      stat: 'Non-profits using AI see 45% increase in donor retention'
    },
    'Manufacturing / Industrial': {
      opportunities: [
        { title: 'Predictive Maintenance', impact: '40% less downtime', difficulty: 'Hard' },
        { title: 'Quality Control AI', impact: '60% fewer defects', difficulty: 'Medium' },
        { title: 'Supply Chain Optimization', impact: '25% cost reduction', difficulty: 'Hard' }
      ],
      stat: 'Manufacturers using AI report 30% improvement in OEE'
    },
    'Other': {
      opportunities: [
        { title: 'Process Automation', impact: '10+ hours saved/week', difficulty: 'Easy' },
        { title: 'Customer Communication', impact: '50% faster responses', difficulty: 'Easy' },
        { title: 'Data Analysis & Insights', impact: '3x faster decisions', difficulty: 'Medium' }
      ],
      stat: 'Organizations using AI report 40% productivity improvement'
    }
  };

  const industryData = industryOpportunities[data.industry] || industryOpportunities['Other'];

  const content = `
    <p style="margin: 0 0 20px 0; font-size: 16px; color: #374151; line-height: 1.6;">
      Hey ${data.name},
    </p>

    <p style="margin: 0 0 20px 0; font-size: 16px; color: #374151; line-height: 1.6;">
      As promised, here's the ${data.industry} AI breakdown.
    </p>

    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 20px 0;">
      <tr>
        <td style="background-color: #f0f9ff; border-left: 4px solid #0ea5e9; padding: 15px;">
          <p style="margin: 0; color: #0369a1; font-size: 14px;">
            📊 <strong>Industry Stat:</strong> ${industryData.stat}
          </p>
        </td>
      </tr>
    </table>

    <p style="margin: 0 0 15px 0; font-size: 18px; font-weight: bold; color: #1f2937;">
      Top 3 AI Opportunities for ${data.industry}:
    </p>

    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 20px 0;">
      ${industryData.opportunities.map((opp, i) => `
        <tr>
          <td style="padding: 15px; background-color: ${i % 2 === 0 ? '#f9fafb' : '#ffffff'}; border-bottom: 1px solid #e5e7eb;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td>
                  <p style="margin: 0 0 5px 0; font-size: 16px; font-weight: bold; color: #1f2937;">
                    ${i + 1}. ${opp.title}
                  </p>
                  <p style="margin: 0; font-size: 14px; color: #6b7280;">
                    <span style="color: #059669; font-weight: bold;">Impact:</span> ${opp.impact} &nbsp;|&nbsp;
                    <span style="color: #7c3aed;">Difficulty:</span> ${opp.difficulty}
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      `).join('')}
    </table>

    <p style="margin: 0 0 20px 0; font-size: 16px; color: #374151; line-height: 1.6;">
      Based on your assessment score (${data.overallScore}%), I'd recommend starting with the <strong>"Easy"</strong> difficulty options first. Quick wins build momentum.
    </p>

    ${level === 'beginner' || level === 'explorer' ? `
    ${valueBox(
      "Free Resource: AI Quick Start Guide",
      "A step-by-step checklist for implementing your first AI tool, specifically designed for " + data.industry + ".",
      "Get the Guide",
      "https://www.lorenzodc.com/chat"
    )}
    ` : `
    ${valueBox(
      "Ready for Faster Results?",
      "At your level, you're ready for strategic implementation. Let's map out your 90-day AI roadmap.",
      "Book Strategy Call",
      "https://calendly.com/lorenzo-theglobalenterprise/ai-strategy-call"
    )}
    `}

    <p style="margin: 20px 0 0 0; font-size: 16px; color: #374151;">
      To your AI success,<br/>
      <strong>Lorenzo</strong>
    </p>

    <p style="margin: 10px 0 0 0; font-size: 14px; color: #6b7280;">
      P.S. In a few days, I'll share how to address your lowest-scoring area from the assessment.
    </p>
  `;

  return {
    subject: `The top 3 AI opportunities in ${data.industry} right now`,
    preheader: `${industryData.stat}`,
    html: emailWrapper(content, data.name),
    sendAfterDays: 4,
    emailNumber: 2
  };
}

// Email 3: Weakest Area (Day 7)
function generateWeakestAreaEmail(data: NurtureSequenceData, level: ReadinessLevel): NurtureEmail {
  // Find the weakest area
  const scores = data.scores;
  const areas = [
    { name: 'Current AI State', score: scores.current_state, key: 'current_state' },
    { name: 'Strategy & Vision', score: scores.strategy_vision, key: 'strategy_vision' },
    { name: 'Team Capabilities', score: scores.team_capabilities, key: 'team_capabilities' },
    { name: 'Implementation Readiness', score: scores.implementation, key: 'implementation' }
  ];

  const weakest = areas.reduce((min, area) => area.score < min.score ? area : min);

  const areaAdvice: Record<string, { title: string; problem: string; solutions: string[]; resource: string }> = {
    'current_state': {
      title: 'Your Current AI State',
      problem: "You're earlier in your AI journey than most of your competitors.",
      solutions: [
        "Start with just ONE AI tool for your most time-consuming task",
        "Don't try to transform everything—pick one process to improve",
        "Track your time savings religiously (this builds the case for more investment)"
      ],
      resource: "AI Adoption Roadmap: From Zero to Integrated"
    },
    'strategy_vision': {
      title: 'Your AI Strategy & Vision',
      problem: "You don't have a clear roadmap for where AI fits in your business.",
      solutions: [
        "Define your 'AI North Star'—what does success look like in 12 months?",
        "Map your customer journey and identify 3 friction points AI could solve",
        "Set measurable goals: hours saved, revenue impact, customer satisfaction"
      ],
      resource: "AI Strategy Template: The One-Page Plan"
    },
    'team_capabilities': {
      title: 'Your Team Capabilities',
      problem: "Your team isn't equipped to adopt AI effectively yet.",
      solutions: [
        "Make AI literacy part of your culture (weekly 'AI experiment' sharing)",
        "Identify your AI champions—people who are naturally curious",
        "Start with no-code tools that don't require technical expertise"
      ],
      resource: "Team AI Training: The 2-Week Sprint"
    },
    'implementation': {
      title: 'Your Implementation Readiness',
      problem: "You have the vision but struggle to execute on AI projects.",
      solutions: [
        "Document your current processes BEFORE trying to automate them",
        "Start with a 30-day pilot, not a company-wide rollout",
        "Define success metrics upfront so you know if it's working"
      ],
      resource: "AI Implementation Checklist: 12 Steps to Success"
    }
  };

  const advice = areaAdvice[weakest.key];

  const content = `
    <p style="margin: 0 0 20px 0; font-size: 16px; color: #374151; line-height: 1.6;">
      Hey ${data.name},
    </p>

    <p style="margin: 0 0 20px 0; font-size: 16px; color: #374151; line-height: 1.6;">
      Looking at your AI assessment, there's one area holding you back:
    </p>

    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 20px 0;">
      <tr>
        <td style="background-color: #fef2f2; border: 2px solid #ef4444; padding: 25px; border-radius: 8px;">
          <p style="margin: 0 0 10px 0; font-size: 20px; font-weight: bold; color: #991b1b;">
            ${advice.title}: ${weakest.score}%
          </p>
          <p style="margin: 0; color: #b91c1c; font-size: 16px;">
            ${advice.problem}
          </p>
        </td>
      </tr>
    </table>

    <p style="margin: 0 0 20px 0; font-size: 16px; color: #374151; line-height: 1.6;">
      Here's the good news: this is actually the <strong>easiest area to improve</strong> because it has the most room for growth.
    </p>

    <p style="margin: 0 0 15px 0; font-size: 18px; font-weight: bold; color: #1f2937;">
      3 Ways to Improve Fast:
    </p>

    <ol style="margin: 0 0 25px 0; padding-left: 20px; color: #374151; font-size: 16px; line-height: 1.8;">
      ${advice.solutions.map(solution => `<li style="margin-bottom: 10px;">${solution}</li>`).join('')}
    </ol>

    ${tipBox("The Hidden Benefit", `By improving ${advice.title.toLowerCase()}, you'll naturally boost your other scores too. It's all connected.`, "🔗")}

    <p style="margin: 0 0 20px 0; font-size: 16px; color: #374151; line-height: 1.6;">
      Want a more detailed breakdown? Reply with "DEEP DIVE" and I'll send you our ${advice.resource}.
    </p>

    <p style="margin: 20px 0 0 0; font-size: 16px; color: #374151;">
      Here to help,<br/>
      <strong>Lorenzo</strong>
    </p>

    <p style="margin: 10px 0 0 0; font-size: 14px; color: #6b7280;">
      P.S. Next week I'll share a case study from someone who was exactly where you are.
    </p>
  `;

  return {
    subject: `${data.name}, this is holding back your AI progress`,
    preheader: `Your ${weakest.name} score is ${weakest.score}%—here's how to fix it`,
    html: emailWrapper(content, data.name),
    sendAfterDays: 7,
    emailNumber: 3
  };
}

// Email 4: Case Study (Day 10)
function generateCaseStudyEmail(data: NurtureSequenceData, level: ReadinessLevel): NurtureEmail {
  const caseStudies: Record<string, { company: string; situation: string; solution: string; results: string[]; quote: string; role: string }> = {
    'Technology / Software': {
      company: 'A B2B SaaS company',
      situation: 'drowning in support tickets and spending 40+ hours/week on repetitive customer questions',
      solution: 'implemented an AI-powered knowledge base and smart ticket routing system',
      results: ['62% reduction in support tickets', '15 hours/week saved for the team', '28% improvement in customer satisfaction'],
      quote: "We went from reactive firefighting to proactive customer success.",
      role: 'Head of Customer Success'
    },
    'Healthcare / Medical': {
      company: 'A multi-location medical practice',
      situation: 'losing 3+ hours daily to patient intake paperwork and appointment scheduling chaos',
      solution: 'deployed AI-powered patient intake forms and smart scheduling optimization',
      results: ['18 hours/week saved on admin tasks', '35% reduction in no-shows', '4.8/5 patient satisfaction score'],
      quote: "Our staff finally has time to focus on patient care instead of paperwork.",
      role: 'Practice Manager'
    },
    'Professional Services / Consulting': {
      company: 'A boutique consulting firm',
      situation: 'struggling to scale because proposals took 2-3 days each and partners were maxed out',
      solution: 'built an AI-assisted proposal generation system with their past winning proposals',
      results: ['3x more proposals submitted per month', '40% higher win rate', '10 hours saved per proposal'],
      quote: "AI didn't replace our expertise—it amplified it.",
      role: 'Managing Partner'
    },
    'Retail / E-commerce': {
      company: 'A DTC brand',
      situation: 'couldn\'t scale customer service fast enough during peak seasons without hiring expensive seasonal staff',
      solution: 'implemented an AI chatbot for Tier 1 support with smart escalation to humans',
      results: ['70% of queries handled by AI', '$180K saved on seasonal hiring', '24/7 customer support'],
      quote: "Our holiday season went from stressful to smooth.",
      role: 'Director of Operations'
    },
    'Ministry / Non-profit': {
      company: 'A growing ministry',
      situation: 'couldn\'t keep up with donor communications and was losing touch with supporters',
      solution: 'used AI to personalize donor outreach and automate follow-up sequences',
      results: ['3x increase in donor engagement', '45% improvement in retention', '25% increase in recurring giving'],
      quote: "We're now building real relationships at scale.",
      role: 'Development Director'
    }
  };

  const caseStudy = caseStudies[data.industry] || caseStudies['Professional Services / Consulting'];

  const content = `
    <p style="margin: 0 0 20px 0; font-size: 16px; color: #374151; line-height: 1.6;">
      Hey ${data.name},
    </p>

    <p style="margin: 0 0 20px 0; font-size: 16px; color: #374151; line-height: 1.6;">
      Today I want to share a real story from ${caseStudy.company} that reminds me of your situation.
    </p>

    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 25px 0; background-color: #f8f9fa; border-radius: 8px; overflow: hidden;">
      <tr>
        <td style="background-color: #667eea; padding: 15px 25px;">
          <p style="margin: 0; color: #ffffff; font-size: 18px; font-weight: bold;">
            📋 Case Study: ${caseStudy.company}
          </p>
        </td>
      </tr>
      <tr>
        <td style="padding: 25px;">
          <p style="margin: 0 0 15px 0; font-size: 14px; color: #6b7280; text-transform: uppercase; font-weight: bold;">
            The Situation
          </p>
          <p style="margin: 0 0 20px 0; font-size: 16px; color: #374151; line-height: 1.6;">
            They were ${caseStudy.situation}.
          </p>

          <p style="margin: 0 0 15px 0; font-size: 14px; color: #6b7280; text-transform: uppercase; font-weight: bold;">
            The Solution
          </p>
          <p style="margin: 0 0 20px 0; font-size: 16px; color: #374151; line-height: 1.6;">
            They ${caseStudy.solution}.
          </p>

          <p style="margin: 0 0 15px 0; font-size: 14px; color: #6b7280; text-transform: uppercase; font-weight: bold;">
            The Results
          </p>
          <ul style="margin: 0 0 20px 0; padding-left: 20px;">
            ${caseStudy.results.map(result => `<li style="margin-bottom: 8px; color: #059669; font-weight: bold;">${result}</li>`).join('')}
          </ul>

          <table border="0" cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td style="border-left: 4px solid #667eea; padding-left: 15px;">
                <p style="margin: 0 0 5px 0; font-style: italic; color: #374151;">
                  "${caseStudy.quote}"
                </p>
                <p style="margin: 0; font-size: 14px; color: #6b7280;">
                  — ${caseStudy.role}
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <p style="margin: 0 0 20px 0; font-size: 16px; color: #374151; line-height: 1.6;">
      The key insight? They didn't try to do everything at once. They picked <strong>one problem</strong>, solved it well, and expanded from there.
    </p>

    <p style="margin: 0 0 20px 0; font-size: 16px; color: #374151; line-height: 1.6;">
      Your assessment showed your biggest challenge is "${data.biggestChallenge}." That's a great place to start.
    </p>

    ${emailButton("Let's Map Your First AI Win", "https://calendly.com/lorenzo-theglobalenterprise/ai-strategy-call", "#059669")}

    <p style="margin: 0 0 0 0; font-size: 16px; color: #374151;">
      Cheers,<br/>
      <strong>Lorenzo</strong>
    </p>
  `;

  return {
    subject: `How ${caseStudy.company} solved the exact problem you have`,
    preheader: `Real results: ${caseStudy.results[0]}`,
    html: emailWrapper(content, data.name),
    sendAfterDays: 10,
    emailNumber: 4
  };
}

// Email 5: Free Resource (Day 14)
function generateResourceEmail(data: NurtureSequenceData, level: ReadinessLevel): NurtureEmail {
  const content = `
    <p style="margin: 0 0 20px 0; font-size: 16px; color: #374151; line-height: 1.6;">
      Hey ${data.name},
    </p>

    <p style="margin: 0 0 20px 0; font-size: 16px; color: #374151; line-height: 1.6;">
      Two weeks ago you took my AI Readiness Assessment and scored ${data.overallScore}%.
    </p>

    <p style="margin: 0 0 20px 0; font-size: 16px; color: #374151; line-height: 1.6;">
      I've been thinking about ${data.industry} companies at your stage, and I realized I should share something valuable with you:
    </p>

    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 25px 0;">
      <tr>
        <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 8px;">
          <p style="margin: 0 0 15px 0; font-size: 22px; font-weight: bold; color: #ffffff;">
            🎁 Free Resource: AI Implementation Toolkit
          </p>
          <p style="margin: 0 0 20px 0; color: #e0e7ff; font-size: 16px; line-height: 1.6;">
            Everything you need to go from "interested in AI" to "implementing AI" in your business:
          </p>
          <ul style="margin: 0 0 25px 0; padding-left: 20px; color: #ffffff;">
            <li style="margin-bottom: 10px;">✅ AI Tool Selection Checklist</li>
            <li style="margin-bottom: 10px;">✅ ROI Calculator Spreadsheet</li>
            <li style="margin-bottom: 10px;">✅ 30-Day Implementation Roadmap</li>
            <li style="margin-bottom: 10px;">✅ Team Training Guide</li>
            <li style="margin-bottom: 10px;">✅ Common Pitfalls to Avoid</li>
          </ul>
          ${emailButton("Get the Free Toolkit", "https://www.lorenzodc.com/chat", "#ffffff", "#667eea")}
        </td>
      </tr>
    </table>

    <p style="margin: 0 0 20px 0; font-size: 16px; color: #374151; line-height: 1.6;">
      This toolkit is based on what I've learned helping dozens of companies implement AI successfully. It's the "starter pack" I wish existed when I first got into this space.
    </p>

    ${tipBox("Why Free?", "Because I know that once you see results from AI, you'll want to go deeper. And when you're ready for that, I'll be here.", "🤝")}

    <p style="margin: 0 0 20px 0; font-size: 16px; color: #374151; line-height: 1.6;">
      Use it, share it with your team, and let me know what questions come up.
    </p>

    <p style="margin: 20px 0 0 0; font-size: 16px; color: #374151;">
      Your AI advocate,<br/>
      <strong>Lorenzo</strong>
    </p>

    <p style="margin: 10px 0 0 0; font-size: 14px; color: #6b7280;">
      P.S. Next week I want to share something I'm working on that might be a perfect fit for where you are.
    </p>
  `;

  return {
    subject: `${data.name}, I made something for you (free)`,
    preheader: `The AI Implementation Toolkit I wish I had when starting out`,
    html: emailWrapper(content, data.name),
    sendAfterDays: 14,
    emailNumber: 5
  };
}

// Email 6: Soft Pitch (Day 21)
function generateSoftPitchEmail(data: NurtureSequenceData, level: ReadinessLevel): NurtureEmail {
  // Determine best offer based on score and readiness
  const isHighTicket = level === 'implementer' || level === 'leader' ||
    data.teamSize === '51-200 employees' || data.teamSize === '200+ employees' ||
    data.role === 'Founder / CEO / Owner' || data.role === 'C-Suite Executive (CTO, COO, etc.)';

  const offer = isHighTicket ? {
    type: 'consulting',
    title: 'AI Strategy Intensive',
    subtitle: 'A focused engagement to accelerate your AI implementation',
    description: 'In 2-3 sessions, we\'ll create your complete AI roadmap—tools, timeline, team training, and ROI projections.',
    benefits: [
      'Personalized AI strategy for your specific situation',
      'Tool recommendations based on your tech stack',
      'Implementation roadmap with clear milestones',
      'ROI projections to get leadership buy-in',
      'Ongoing support during implementation'
    ],
    cta: 'Book a Strategy Call',
    ctaUrl: 'https://calendly.com/lorenzo-theglobalenterprise/ai-strategy-call',
    price: 'Investment starts at $5,000'
  } : {
    type: 'course',
    title: 'AI Foundations Course',
    subtitle: 'Learn to implement AI in your business—at your own pace',
    description: 'A self-paced program that takes you from "AI curious" to "AI confident" in 4 weeks.',
    benefits: [
      '12 video modules covering AI fundamentals to implementation',
      'Templates, checklists, and tools you can use immediately',
      'Private community for questions and support',
      'Monthly live Q&A calls with me',
      'Lifetime access and all future updates'
    ],
    cta: 'Learn More About the Course',
    ctaUrl: 'https://www.lorenzodc.com/contact?service=course',
    price: 'One-time investment of $497'
  };

  const content = `
    <p style="margin: 0 0 20px 0; font-size: 16px; color: #374151; line-height: 1.6;">
      Hey ${data.name},
    </p>

    <p style="margin: 0 0 20px 0; font-size: 16px; color: #374151; line-height: 1.6;">
      Over the past few weeks, I've shared quick wins, industry insights, and free resources to help you on your AI journey.
    </p>

    <p style="margin: 0 0 20px 0; font-size: 16px; color: #374151; line-height: 1.6;">
      Today I want to share how we can work together more directly.
    </p>

    <p style="margin: 0 0 20px 0; font-size: 16px; color: #374151; line-height: 1.6;">
      Based on your assessment (${data.overallScore}% AI readiness, ${data.timeline} timeline), I think you'd benefit most from:
    </p>

    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 25px 0;">
      <tr>
        <td style="border: 2px solid #667eea; padding: 30px; border-radius: 8px;">
          <p style="margin: 0 0 5px 0; font-size: 14px; color: #667eea; font-weight: bold; text-transform: uppercase;">
            Recommended for You
          </p>
          <p style="margin: 0 0 10px 0; font-size: 24px; font-weight: bold; color: #1f2937;">
            ${offer.title}
          </p>
          <p style="margin: 0 0 20px 0; font-size: 16px; color: #6b7280; font-style: italic;">
            ${offer.subtitle}
          </p>
          <p style="margin: 0 0 20px 0; font-size: 16px; color: #374151; line-height: 1.6;">
            ${offer.description}
          </p>

          <p style="margin: 0 0 10px 0; font-size: 14px; font-weight: bold; color: #1f2937;">
            What's Included:
          </p>
          <ul style="margin: 0 0 20px 0; padding-left: 20px; color: #374151;">
            ${offer.benefits.map(benefit => `<li style="margin-bottom: 8px;">${benefit}</li>`).join('')}
          </ul>

          <p style="margin: 0 0 20px 0; font-size: 14px; color: #6b7280;">
            ${offer.price}
          </p>

          ${emailButton(offer.cta, offer.ctaUrl)}
        </td>
      </tr>
    </table>

    <p style="margin: 0 0 20px 0; font-size: 16px; color: #374151; line-height: 1.6;">
      ${offer.type === 'consulting' ?
        "If you're ready to move fast and want personalized guidance, this is the path." :
        "If you want to learn at your own pace and implement gradually, this is perfect for you."}
    </p>

    <p style="margin: 0 0 20px 0; font-size: 16px; color: #374151; line-height: 1.6;">
      Either way, I'm happy to answer any questions. Just hit reply.
    </p>

    <p style="margin: 20px 0 0 0; font-size: 16px; color: #374151;">
      To your success,<br/>
      <strong>Lorenzo</strong>
    </p>
  `;

  return {
    subject: `${data.name}, here's how we can work together`,
    preheader: `A path designed for your ${data.overallScore}% AI readiness level`,
    html: emailWrapper(content, data.name),
    sendAfterDays: 21,
    emailNumber: 6
  };
}

// Email 7: Final CTA (Day 28)
function generateFinalCTAEmail(data: NurtureSequenceData, level: ReadinessLevel): NurtureEmail {
  const content = `
    <p style="margin: 0 0 20px 0; font-size: 16px; color: #374151; line-height: 1.6;">
      Hey ${data.name},
    </p>

    <p style="margin: 0 0 20px 0; font-size: 16px; color: #374151; line-height: 1.6;">
      It's been a month since you took the AI Readiness Assessment.
    </p>

    <p style="margin: 0 0 20px 0; font-size: 16px; color: #374151; line-height: 1.6;">
      I'm curious: <strong>have you taken any action on AI since then?</strong>
    </p>

    <p style="margin: 0 0 20px 0; font-size: 16px; color: #374151; line-height: 1.6;">
      If yes—amazing. I'd love to hear what you tried. Hit reply and tell me about it.
    </p>

    <p style="margin: 0 0 20px 0; font-size: 16px; color: #374151; line-height: 1.6;">
      If not—that's okay too. Life gets busy. But let me leave you with this:
    </p>

    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 25px 0;">
      <tr>
        <td style="background-color: #fef3c7; padding: 25px; border-radius: 8px; border-left: 4px solid #f59e0b;">
          <p style="margin: 0 0 15px 0; font-size: 18px; font-weight: bold; color: #92400e;">
            🎯 The Cost of Waiting
          </p>
          <p style="margin: 0; color: #78350f; font-size: 16px; line-height: 1.6;">
            Every week you wait to implement AI, your competitors get further ahead. The companies that move now will have a 2-3 year head start on those who "plan to look into it."
          </p>
        </td>
      </tr>
    </table>

    <p style="margin: 0 0 20px 0; font-size: 16px; color: #374151; line-height: 1.6;">
      Your assessment showed you're ready. Your biggest challenge was "${data.biggestChallenge}," and I've given you a clear path forward.
    </p>

    <p style="margin: 0 0 20px 0; font-size: 18px; font-weight: bold; color: #1f2937;">
      Here are your three options:
    </p>

    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 25px 0;">
      <tr>
        <td style="padding: 20px; background-color: #f9fafb; border-radius: 8px; margin-bottom: 15px;">
          <p style="margin: 0 0 10px 0; font-size: 16px; font-weight: bold; color: #059669;">
            Option 1: DIY (Free)
          </p>
          <p style="margin: 0 0 15px 0; font-size: 14px; color: #374151;">
            Re-read the emails I've sent, pick one quick win, and implement it this week.
          </p>
          <a href="https://www.lorenzodc.com/chat" style="color: #059669; font-weight: bold;">
            Use the AI Chat for guidance →
          </a>
        </td>
      </tr>
      <tr><td style="height: 15px;"></td></tr>
      <tr>
        <td style="padding: 20px; background-color: #eff6ff; border-radius: 8px; margin-bottom: 15px;">
          <p style="margin: 0 0 10px 0; font-size: 16px; font-weight: bold; color: #2563eb;">
            Option 2: Learn Systematically ($497)
          </p>
          <p style="margin: 0 0 15px 0; font-size: 14px; color: #374151;">
            Join the AI Foundations Course and master AI implementation at your own pace.
          </p>
          <a href="https://www.lorenzodc.com/contact?service=course" style="color: #2563eb; font-weight: bold;">
            Learn about the course →
          </a>
        </td>
      </tr>
      <tr><td style="height: 15px;"></td></tr>
      <tr>
        <td style="padding: 20px; background-color: #f0fdf4; border-radius: 8px;">
          <p style="margin: 0 0 10px 0; font-size: 16px; font-weight: bold; color: #166534;">
            Option 3: Get Expert Help (Custom)
          </p>
          <p style="margin: 0 0 15px 0; font-size: 14px; color: #374151;">
            Work with me directly to create and implement your AI strategy.
          </p>
          <a href="https://calendly.com/lorenzo-theglobalenterprise/ai-strategy-call" style="color: #166534; font-weight: bold;">
            Book a strategy call →
          </a>
        </td>
      </tr>
    </table>

    <p style="margin: 0 0 20px 0; font-size: 16px; color: #374151; line-height: 1.6;">
      Whichever path you choose, I'm rooting for you. AI is going to transform every industry—and I want you to be ahead of the curve.
    </p>

    <p style="margin: 20px 0 0 0; font-size: 16px; color: #374151;">
      Here if you need me,<br/>
      <strong>Lorenzo</strong>
    </p>

    <p style="margin: 15px 0 0 0; font-size: 14px; color: #6b7280;">
      P.S. Even if you don't take action today, stay on this list. I'll keep sharing valuable AI insights and case studies. But if you want to move faster, you know where to find me.
    </p>
  `;

  return {
    subject: `${data.name}, one month later—where are you with AI?`,
    preheader: `A check-in and your three paths forward`,
    html: emailWrapper(content, data.name),
    sendAfterDays: 28,
    emailNumber: 7
  };
}

// Types are exported at their declaration above
// Default export for convenience
export default generateNurtureSequence;
