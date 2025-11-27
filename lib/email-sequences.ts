/**
 * Email Automation Sequences
 * Pre-built email templates and sequences for automated nurture campaigns
 */

export interface EmailTemplate {
  subject: string;
  html: string;
  delayDays?: number; // Days to wait before sending
  condition?: string; // Condition that must be met to send
}

export interface EmailSequence {
  id: string;
  name: string;
  description: string;
  trigger: string;
  emails: EmailTemplate[];
}

/**
 * 1. Welcome Sequence (for newsletter signups)
 * Trigger: Newsletter signup
 */
export const welcomeSequence: EmailSequence = {
  id: 'welcome_sequence',
  name: 'Welcome Sequence',
  description: 'For new newsletter signups',
  trigger: 'newsletter_signup',
  emails: [
    {
      subject: '👋 Welcome! Your AI transformation starts now',
      delayDays: 0,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #667eea;">Welcome to The Perpetual Engine!</h2>

          <p>Hi {{name}},</p>

          <p>Thanks for joining! I'm Lorenzo, and I help business leaders like you cut through the AI hype and build systems that actually drive revenue.</p>

          <p><strong>Here's what happens next:</strong></p>
          <ul>
            <li>🎯 Take the 2-minute AI Readiness Assessment (below)</li>
            <li>📊 Get your personalized AI strategy report</li>
            <li>📅 Book a complimentary 15-minute strategy call</li>
          </ul>

          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 8px; text-align: center; margin: 30px 0;">
            <h3 style="color: white; margin: 0 0 15px 0;">Ready to discover your AI potential?</h3>
            <a href="https://www.lorenzodc.com/ai-assessment" style="background: white; color: #667eea; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
              Take the Assessment →
            </a>
            <p style="color: #f0f0f0; margin: 15px 0 0 0; font-size: 14px;">Takes 2 minutes • Get instant results</p>
          </div>

          <p><strong>What you'll discover:</strong></p>
          <ul>
            <li>Your exact AI readiness score across 4 key areas</li>
            <li>Specific gaps holding you back</li>
            <li>Personalized roadmap to get started</li>
            <li>ROI opportunities you can capture immediately</li>
          </ul>

          <p>Most leaders are surprised by their results. Take 2 minutes to find out where you stand.</p>

          <p>Talk soon,<br>
          <strong>Lorenzo Daughtry-Chambers</strong><br>
          <em>AI Strategy & Innovation</em></p>
        </div>
      `
    },
    {
      subject: '⏰ Quick reminder: Your AI assessment is waiting',
      delayDays: 3,
      condition: 'assessment_not_completed',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #667eea;">{{name}}, this takes 2 minutes...</h2>

          <p>I noticed you haven't taken the AI Readiness Assessment yet.</p>

          <p>Here's why it matters:</p>

          <p>Last week, I talked with a CEO who scored 34% on the assessment. He thought his company was "doing fine" with AI.</p>

          <p>After we fixed his 3 biggest gaps, he:</p>
          <ul>
            <li>✅ Cut customer support costs by 40%</li>
            <li>✅ Reduced manual data entry from 20 hours/week to 2 hours</li>
            <li>✅ Automated his entire sales follow-up process</li>
          </ul>

          <p><strong>Total time to implement: 6 weeks.<br>
          Total investment: $12K.<br>
          Monthly savings: $8K+</strong></p>

          <p>The assessment shows you exactly where YOUR opportunities are.</p>

          <div style="text-align: center; margin: 30px 0;">
            <a href="https://www.lorenzodc.com/ai-assessment" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
              Take the 2-Minute Assessment →
            </a>
          </div>

          <p>Takes less time than your morning coffee.</p>

          <p>Lorenzo</p>
        </div>
      `
    },
    {
      subject: '🚨 Last chance: Don\'t miss this opportunity',
      delayDays: 7,
      condition: 'assessment_not_completed',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #ef4444;">{{name}}, I'm removing inactive subscribers this week</h2>

          <p>I want to make sure my list is full of people who actually want this information.</p>

          <p>If you're still interested in transforming your business with AI, <strong>take the assessment by Friday</strong>.</p>

          <p>If not, no hard feelings - I'll remove you from the list and you won't hear from me again.</p>

          <div style="background: #fee2e2; padding: 20px; border-left: 4px solid #ef4444; margin: 20px 0;">
            <p style="margin: 0; color: #991b1b;"><strong>⏰ This link expires Friday at 5pm:</strong></p>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="https://www.lorenzodc.com/ai-assessment" style="background: #ef4444; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
              Yes, I Want My Assessment →
            </a>
          </div>

          <p>Either way, thanks for subscribing.</p>

          <p>Lorenzo</p>
        </div>
      `
    }
  ]
};

/**
 * 2. Assessment Follow-up Sequence (after assessment completion)
 * Trigger: Assessment completed, no calendar booking
 */
export const assessmentFollowUpSequence: EmailSequence = {
  id: 'assessment_followup',
  name: 'Assessment Follow-up',
  description: 'For people who completed assessment but didn\'t book',
  trigger: 'assessment_completed_no_booking',
  emails: [
    {
      subject: '🎯 {{name}}, I reviewed your {{score}}% AI readiness score',
      delayDays: 1,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #667eea;">I personally reviewed your results, {{name}}</h2>

          <p>I spent 10 minutes going through your assessment this morning.</p>

          <p>Based on your {{score}}% overall score, here's what jumped out at me:</p>

          <div style="background: #f0f9ff; padding: 20px; border-left: 4px solid #3b82f6; margin: 20px 0;">
            {{personalized_insights}}
          </div>

          <p><strong>Here's what I'd recommend:</strong></p>

          <ol>
            <li>{{recommendation_1}}</li>
            <li>{{recommendation_2}}</li>
            <li>{{recommendation_3}}</li>
          </ol>

          <p>I recorded a 3-minute video breaking this down for you:</p>

          <div style="text-align: center; margin: 30px 0;">
            <a href="{{video_link}}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
              ▶️ Watch Your Personalized Video →
            </a>
          </div>

          <p>Or, if you want to discuss your specific situation, grab a 15-minute slot on my calendar:</p>

          <div style="text-align: center; margin: 30px 0;">
            <a href="https://calendly.com/lorenzo-theglobalenterprise/ai-strategy-call?name={{name}}&email={{email}}&score={{score}}" style="background: #10b981; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
              📅 Book 15-Minute Call →
            </a>
          </div>

          <p>Either way, you should see results within 30-60 days.</p>

          <p>Lorenzo</p>
        </div>
      `
    },
    {
      subject: '📊 Case study: Similar score, $40K in savings',
      delayDays: 4,
      condition: 'no_calendar_booking',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #667eea;">{{name}}, thought you'd find this interesting...</h2>

          <p>I just got off a call with a client who had a similar AI readiness score to yours ({{score}}%).</p>

          <p><strong>Their situation 90 days ago:</strong></p>
          <ul>
            <li>Customer support overwhelmed with repetitive questions</li>
            <li>Sales team spending 15+ hours/week on admin tasks</li>
            <li>Manual data entry eating up 2 FTEs</li>
          </ul>

          <p><strong>What we implemented:</strong></p>
          <ol>
            <li>AI chatbot for tier-1 support (handles 60% of inquiries)</li>
            <li>Automated sales CRM updates and follow-ups</li>
            <li>Document processing automation</li>
          </ol>

          <p><strong>Results after 90 days:</strong></p>
          <div style="background: #d1fae5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 5px 0;">💰 <strong>$40K</strong> in annual savings</p>
            <p style="margin: 5px 0;">⏰ <strong>25 hours/week</strong> freed up</p>
            <p style="margin: 5px 0;">📈 <strong>35% faster</strong> response times</p>
            <p style="margin: 5px 0;">🎯 <strong>ROI in 4 months</strong></p>
          </div>

          <p><strong>Total investment: $15K</strong></p>

          <p>Based on your assessment, I see similar opportunities in your business.</p>

          <p>Want me to show you the specific playbook? Takes 15 minutes:</p>

          <div style="text-align: center; margin: 30px 0;">
            <a href="https://calendly.com/lorenzo-theglobalenterprise/ai-strategy-call" style="background: #10b981; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
              Show Me the Playbook →
            </a>
          </div>

          <p>Lorenzo</p>
        </div>
      `
    }
  ]
};

/**
 * 3. Non-Completer Re-engagement (signed up but didn't complete assessment)
 * Trigger: 14 days after signup, no assessment
 */
export const nonCompleterReengagementSequence: EmailSequence = {
  id: 'noncompleter_reengagement',
  name: 'Non-Completer Re-engagement',
  description: 'For signups who never completed the assessment',
  trigger: 'signup_14days_no_assessment',
  emails: [
    {
      subject: '❌ {{name}}, are you making these AI mistakes?',
      delayDays: 0,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #ef4444;">Most leaders are making 3 critical AI mistakes...</h2>

          <p>Hey {{name}},</p>

          <p>I've worked with 50+ companies on AI implementation. Here are the 3 mistakes I see repeatedly:</p>

          <div style="background: #fee2e2; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>❌ Mistake #1: Waiting for "perfect" conditions</strong></p>
            <p style="margin-left: 20px; color: #666;">Reality: Your competitors are gaining ground daily. Start small, iterate fast.</p>

            <p style="margin-top: 20px;"><strong>❌ Mistake #2: Thinking AI is only for tech companies</strong></p>
            <p style="margin-left: 20px; color: #666;">Reality: The biggest gains are in traditional industries (law, healthcare, manufacturing, consulting).</p>

            <p style="margin-top: 20px;"><strong>❌ Mistake #3: Not knowing where to start</strong></p>
            <p style="margin-left: 20px; color: #666;">Reality: You need a baseline assessment first. That's what our AI Readiness Assessment does.</p>
          </div>

          <p>The assessment takes 2 minutes and shows you:</p>
          <ul>
            <li>✅ Your exact readiness score</li>
            <li>✅ Your biggest gaps</li>
            <li>✅ Quick wins you can capture this month</li>
            <li>✅ ROI opportunities you're missing</li>
          </ul>

          <div style="text-align: center; margin: 30px 0;">
            <a href="https://www.lorenzodc.com/ai-assessment" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
              Get Your Free Assessment →
            </a>
          </div>

          <p>No fluff. Just actionable insights.</p>

          <p>Lorenzo</p>
        </div>
      `
    }
  ]
};

/**
 * 4. Post-Call Nurture (after strategy call)
 * Trigger: Strategy call completed
 */
export const postCallNurtureSequence: EmailSequence = {
  id: 'postcall_nurture',
  name: 'Post-Call Nurture',
  description: 'Follow-up after strategy call',
  trigger: 'strategy_call_completed',
  emails: [
    {
      subject: '📋 Your AI implementation roadmap (from our call)',
      delayDays: 0,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #667eea;">Great talking with you, {{name}}!</h2>

          <p>I've put together your personalized AI implementation roadmap based on our conversation.</p>

          <div style="background: #f8f9fa; padding: 25px; border-radius: 8px; margin: 25px 0;">
            <h3 style="margin-top: 0;">🎯 Your Custom Roadmap</h3>

            <p><strong>Phase 1: Quick Wins (30 days)</strong></p>
            <ul>
              {{quick_wins}}
            </ul>

            <p><strong>Phase 2: Core Implementation (60-90 days)</strong></p>
            <ul>
              {{core_implementation}}
            </ul>

            <p><strong>Phase 3: Scale & Optimize (90+ days)</strong></p>
            <ul>
              {{scale_optimize}}
            </ul>
          </div>

          <p><strong>Estimated Investment:</strong> {{estimated_investment}}</p>
          <p><strong>Projected ROI:</strong> {{projected_roi}}</p>

          <p><strong>Next Steps:</strong></p>
          <ol>
            <li>{{next_step_1}}</li>
            <li>{{next_step_2}}</li>
            <li>{{next_step_3}}</li>
          </ol>

          <p>I'll follow up in 3 days to see if you have any questions.</p>

          <p>In the meantime, if you want to move forward, reply to this email or book a follow-up call:</p>

          <div style="text-align: center; margin: 30px 0;">
            <a href="https://calendly.com/lorenzo-theglobalenterprise/ai-strategy-call" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
              Book Follow-Up Call →
            </a>
          </div>

          <p>Lorenzo</p>
        </div>
      `
    },
    {
      subject: '🤔 Questions about your AI roadmap?',
      delayDays: 3,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #667eea;">Quick check-in, {{name}}</h2>

          <p>Just wanted to see if you had any questions about the roadmap I sent over.</p>

          <p>Common questions I get at this stage:</p>

          <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Q: Can we start smaller?</strong></p>
            <p>A: Absolutely. We can begin with a single use case and expand from there.</p>

            <p style="margin-top: 15px;"><strong>Q: How hands-on do we need to be?</strong></p>
            <p>A: Minimal. I handle 90% of the implementation. You provide feedback and decisions.</p>

            <p style="margin-top: 15px;"><strong>Q: What if it doesn't work?</strong></p>
            <p>A: We measure everything. If something isn't working, we pivot immediately. No wasted time.</p>
          </div>

          <p>Want to discuss? Just reply to this email or grab a time on my calendar.</p>

          <p>Lorenzo</p>
        </div>
      `
    },
    {
      subject: '🚀 Ready to get started?',
      delayDays: 7,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #667eea;">{{name}}, let's make this happen</h2>

          <p>It's been a week since our call. Where are you at with everything?</p>

          <p>If you're ready to move forward, here's what happens next:</p>

          <ol>
            <li><strong>Kickoff Call (30 min)</strong> - Finalize scope and timeline</li>
            <li><strong>Week 1:</strong> Discovery & planning</li>
            <li><strong>Week 2-4:</strong> Implementation begins</li>
            <li><strong>Week 5-6:</strong> Testing & refinement</li>
            <li><strong>Week 7+:</strong> Launch & optimization</li>
          </ol>

          <p>Most clients see measurable results by week 4.</p>

          <p>If you need more time to think it through, no problem. But if you're ready, let's get on the calendar:</p>

          <div style="text-align: center; margin: 30px 0;">
            <a href="https://calendly.com/lorenzo-theglobalenterprise/ai-strategy-call" style="background: #10b981; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
              Schedule Kickoff Call →
            </a>
          </div>

          <p>Lorenzo</p>
        </div>
      `
    }
  ]
};

/**
 * 5. Cold Lead Reactivation (for old leads who haven't engaged)
 * Trigger: 60 days of inactivity
 */
export const coldLeadReactivationSequence: EmailSequence = {
  id: 'cold_reactivation',
  name: 'Cold Lead Reactivation',
  description: 'Re-engage dormant leads',
  trigger: '60_days_inactive',
  emails: [
    {
      subject: '{{name}}, should I remove you from my list?',
      delayDays: 0,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #667eea;">Quick question, {{name}}...</h2>

          <p>I noticed you haven't engaged with any of my emails in a while.</p>

          <p>That's totally fine - I know inboxes are crowded.</p>

          <p>But I want to make sure I'm only emailing people who find this valuable.</p>

          <p><strong>So here's the deal:</strong></p>

          <p>If you're still interested in AI strategy and implementation insights, click this link:</p>

          <div style="text-align: center; margin: 30px 0;">
            <a href="https://www.lorenzodc.com/reactivate?email={{email}}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
              Yes, Keep Me Subscribed →
            </a>
          </div>

          <p>If I don't hear from you, I'll remove you from the list next week.</p>

          <p>Either way, no hard feelings!</p>

          <p>Lorenzo</p>

          <p style="font-size: 12px; color: #666; margin-top: 30px;">
            P.S. - If you DO want to stay on, here's what's new: I just released a free AI readiness assessment that takes 2 minutes. <a href="https://www.lorenzodc.com/ai-assessment">Check it out here</a>.
          </p>
        </div>
      `
    }
  ]
};

/**
 * 6. Customer Onboarding (for people who book/become clients)
 * Trigger: Contract signed or project kickoff
 */
export const customerOnboardingSequence: EmailSequence = {
  id: 'customer_onboarding',
  name: 'Customer Onboarding',
  description: 'Welcome new clients and set expectations',
  trigger: 'contract_signed',
  emails: [
    {
      subject: '🎉 Welcome to The Perpetual Engine! Let\'s get started',
      delayDays: 0,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #10b981;">🎉 Excited to work with you, {{name}}!</h2>

          <p>Welcome to The Perpetual Engine. I'm thrilled to help you implement AI systems that drive real business results.</p>

          <p><strong>Here's what happens next:</strong></p>

          <div style="background: #f8f9fa; padding: 25px; border-radius: 8px; margin: 25px 0;">
            <p><strong>📋 This Week: Discovery & Planning</strong></p>
            <ul>
              <li>Deep-dive interview with your team</li>
              <li>Process documentation and analysis</li>
              <li>Technical infrastructure review</li>
              <li>Detailed project plan delivery</li>
            </ul>

            <p style="margin-top: 20px;"><strong>🔧 Weeks 2-6: Implementation</strong></p>
            <ul>
              <li>Regular progress updates (twice weekly)</li>
              <li>Iterative testing and feedback</li>
              <li>Training materials preparation</li>
            </ul>

            <p style="margin-top: 20px;"><strong>🚀 Week 7+: Launch & Optimize</strong></p>
            <ul>
              <li>Team training sessions</li>
              <li>Go-live support</li>
              <li>Performance monitoring and optimization</li>
            </ul>
          </div>

          <p><strong>What I need from you this week:</strong></p>
          <ol>
            <li>Complete the pre-project questionnaire (link below)</li>
            <li>Schedule our kickoff call</li>
            <li>Provide access to relevant systems/documentation</li>
          </ol>

          <div style="text-align: center; margin: 30px 0;">
            <a href="{{questionnaire_link}}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
              Complete Questionnaire →
            </a>
          </div>

          <p><strong>Communication:</strong></p>
          <ul>
            <li>📧 Email: lorenzo@lorenzodc.com (response within 24 hours)</li>
            <li>📱 Slack: I'll invite you to our project channel</li>
            <li>📅 Calls: Scheduled via Calendly</li>
          </ul>

          <p>Looking forward to transforming your business together!</p>

          <p>Lorenzo</p>
        </div>
      `
    },
    {
      subject: '📊 Your project dashboard is live',
      delayDays: 3,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #667eea;">Your custom project dashboard, {{name}}</h2>

          <p>I've set up your dedicated project dashboard where you can:</p>

          <ul>
            <li>✅ Track project progress in real-time</li>
            <li>✅ View upcoming milestones</li>
            <li>✅ Access all project documents</li>
            <li>✅ Submit feedback and requests</li>
            <li>✅ Review meeting notes and recordings</li>
          </ul>

          <div style="text-align: center; margin: 30px 0;">
            <a href="{{dashboard_link}}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
              Access Your Dashboard →
            </a>
          </div>

          <p><strong>Current Status:</strong></p>
          <div style="background: #d1fae5; padding: 15px; border-left: 4px solid #10b981; margin: 20px 0;">
            <p style="margin: 0;"><strong>✅ Discovery phase: {{discovery_progress}}% complete</strong></p>
            <p style="margin: 10px 0 0 0; color: #065f46;">Next milestone: Implementation kickoff on {{kickoff_date}}</p>
          </div>

          <p>Questions? Just reply to this email.</p>

          <p>Lorenzo</p>
        </div>
      `
    }
  ]
};

// Export all sequences
export const emailSequences = [
  welcomeSequence,
  assessmentFollowUpSequence,
  nonCompleterReengagementSequence,
  postCallNurtureSequence,
  coldLeadReactivationSequence,
  customerOnboardingSequence
];

// Helper function to get sequence by ID
export function getSequenceById(id: string): EmailSequence | undefined {
  return emailSequences.find(seq => seq.id === id);
}

// Helper function to replace template variables
export function replacePlaceholders(html: string, data: Record<string, string>): string {
  let result = html;
  Object.keys(data).forEach(key => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    result = result.replace(regex, data[key] || '');
  });
  return result;
}
