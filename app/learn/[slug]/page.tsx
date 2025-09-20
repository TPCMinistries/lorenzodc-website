"use client";
import { useMemo, useRef, useState } from "react";
import InlineChat from "../../_components/InlineChat";

type Lesson = {
  slug: string;
  title: string;
  videoId?: string;      // YouTube ID (swap later)
  mp4Url?: string;       // optional direct MP4 (e.g., Vimeo/Bunny)
  starter: string;       // starter prompt for chat
  content: string;       // lesson notes (narrated)
  resources?: { label: string; url: string }[];
};

const LESSONS: Record<string, Lesson> = {
  "ai-fundamentals": {
    slug: "ai-fundamentals",
    title: "AI Fundamentals for Business",
    videoId: "ysz5S6PUM-U", // You can replace with actual video IDs later
    starter: `ROLE: You are an AI consultant for business executives.
CONTEXT: I'm a [YOUR_ROLE] at a [COMPANY_SIZE] [INDUSTRY] company.
TASK: Explain AI's business impact in simple terms and identify 3 immediate opportunities for my organization.
CONSTRAINTS: No technical jargon. Focus on business value and ROI.
OUTPUT: Executive summary format with clear action items.`,
    content: `AI Fundamentals for Business Leaders

What AI Actually Is:
• Artificial Intelligence is software that can analyze patterns, make predictions, and generate content
• It's not magic - it's advanced pattern recognition trained on massive datasets
• Current AI excels at: language tasks, data analysis, image recognition, predictions
• Current AI limitations: lacks true understanding, needs human oversight, can be biased

Key Business Applications:
1. Content Creation: Marketing copy, reports, emails, documentation
2. Data Analysis: Customer insights, trend analysis, forecasting
3. Process Automation: Customer service, data entry, scheduling
4. Decision Support: Risk assessment, personalization, optimization

Identifying AI Opportunities in Your Business:
• Look for repetitive, high-volume tasks
• Focus on areas with clear success metrics
• Start with tasks that have low risk of failure
• Prioritize processes that save significant time

The Business Case for AI:
• 67% of executives report measurable ROI within first year
• Average time savings: 2-4 hours per employee per week
• Most successful implementations start small and scale gradually
• Key success factor: proper change management and training

Getting Started Framework:
1. Audit current processes for AI opportunities
2. Calculate potential time/cost savings
3. Start with one low-risk, high-impact pilot
4. Measure results and iterate
5. Scale successful pilots across organization

Red Flags to Avoid:
• Implementing AI without clear business objectives
• Choosing complex solutions for simple problems
• Skipping employee training and change management
• Not having data governance policies in place`,
    resources: [
      { label: "AI Readiness Assessment", url: "/enterprise/diagnostic" },
      { label: "ROI Calculator", url: "/enterprise/roi" },
    ],
  },
  "prompt-engineering": {
    slug: "prompt-engineering",
    title: "Master Prompt Engineering",
    videoId: "bHQqvYy5KYo",
    starter: `Use the CLEAR framework to write a prompt for your most common business task:

CONTEXT: [Describe your situation/industry/role]
LOGIC: [Explain your reasoning/approach needed]
EXAMPLES: [Provide 1-2 specific examples]
ACTION: [State exactly what you want done]
RESULT: [Specify the format and style you want]

Now apply this framework to: [YOUR_SPECIFIC_TASK]`,
    content: `The CLEAR Framework for Professional Prompts

C - CONTEXT: Set the Scene
• Your role, industry, company size
• Current situation or challenge
• Key constraints or requirements
• Target audience (if relevant)

L - LOGIC: Explain Your Reasoning
• Why this task matters
• The approach you want taken
• Key principles to follow
• Success criteria

E - EXAMPLES: Show Don't Tell
• Provide 1-2 concrete examples
• Show the quality level expected
• Demonstrate the style/tone
• Include both good and bad examples when helpful

A - ACTION: Be Specific
• Use precise action verbs
• Break complex tasks into steps
• Specify tools/methods if relevant
• Set clear boundaries

R - RESULT: Define the Output
• Exact format (bullet points, table, paragraph)
• Length or word count
• Style and tone
• Any specific elements to include/exclude

Professional Prompt Templates:

Meeting Summary:
"CONTEXT: I'm preparing a summary of our [meeting type] for [audience]
LOGIC: Focus on decisions made and next steps, not discussion details
EXAMPLES: [Include sample format]
ACTION: Create a structured summary
RESULT: Email format with 3 sections: Decisions, Action Items, Next Meeting"

Strategic Analysis:
"CONTEXT: [Industry] company facing [challenge]
LOGIC: Need data-driven analysis with clear recommendations
EXAMPLES: [Attach relevant data or context]
ACTION: Analyze situation and provide strategic options
RESULT: Executive brief with 3 options, pros/cons, recommended approach"

Content Creation:
"CONTEXT: B2B [industry] targeting [role] decision-makers
LOGIC: Need to establish authority while being actionable
EXAMPLES: [Share successful pieces]
ACTION: Create [content type] addressing [specific pain point]
RESULT: [Length] with compelling headline, 3 key sections, clear CTA"

Common Mistakes to Avoid:
• Being too vague about desired outcome
• Not providing enough context
• Asking for too many things at once
• Forgetting to specify format/length
• Not iterating and refining prompts

Advanced Techniques:
• Chain prompts together for complex tasks
• Use role-playing for different perspectives
• Include quality criteria in your prompts
• Create prompt libraries for repeated tasks
• A/B test different prompt versions`,
    resources: [
      { label: "Prompt Template Library", url: "#" },
      { label: "Advanced Prompt Techniques", url: "#" },
    ],
  },
  "automation-identification": {
    slug: "automation-identification",
    title: "Identify Automation Opportunities",
    videoId: "2Vv-BfVoq4g",
    starter: `ROLE: You are a business process optimization consultant.
CONTEXT: I want to identify automation opportunities in my [DEPARTMENT/COMPANY].
TASK: Help me systematically evaluate our processes using the Automation Opportunity Matrix.
CONSTRAINTS: Focus on measurable ROI and implementation feasibility.
OUTPUT: Prioritized list with effort/impact scoring and recommended next steps.

My current processes that take significant time:
1. [PROCESS 1]
2. [PROCESS 2]
3. [PROCESS 3]`,
    content: `Systematic Automation Opportunity Identification

The Automation Opportunity Matrix:
Evaluate each process on two dimensions:
• IMPACT: Time saved x Frequency x People affected
• EFFORT: Technical complexity x Cost x Training required

High Impact + Low Effort = Quick Wins (Start Here)
High Impact + High Effort = Strategic Projects (Plan for later)
Low Impact + Low Effort = Easy improvements (Fill spare time)
Low Impact + High Effort = Avoid (Not worth it)

Step 1: Process Inventory
Document your team's recurring activities:
• Daily tasks (emails, reports, updates)
• Weekly tasks (meetings, planning, analysis)
• Monthly tasks (reporting, reviews, planning)
• Ad-hoc tasks that happen frequently

For each process, capture:
- Current time investment (hours per week/month)
- Number of people involved
- Current tools/systems used
- Pain points and inefficiencies
- Quality/consistency issues

Step 2: Automation Suitability Assessment
Rate each process (1-5 scale):

Rule-Based (5 = Highly rule-based, 1 = Highly creative)
• Can steps be clearly defined?
• Are decisions based on clear criteria?
• Is human judgment minimal?

Volume (5 = Very high volume, 1 = Infrequent)
• How often does this happen?
• How many transactions/items processed?
• Is volume growing over time?

Standardization (5 = Highly standardized, 1 = Highly variable)
• Are inputs consistent and predictable?
• Do outputs follow standard formats?
• Are exceptions rare and well-defined?

Digital Data (5 = Fully digital, 1 = Mostly manual/physical)
• Is information already in digital systems?
• Are inputs structured data?
• Can outputs be digital?

Step 3: ROI Calculation Framework
For each potential automation:

Time Savings Calculation:
• Current time per instance × Instances per month = Monthly hours
• Monthly hours × Average hourly rate = Monthly cost
• Annual savings = Monthly cost × 12

Implementation Costs:
• Software/tool costs (setup + monthly)
• Development or configuration time
• Training and change management
• Ongoing maintenance

Payback Period = Implementation Cost ÷ Monthly Savings

Step 4: Prioritization Criteria
Score each opportunity (1-10):
• Financial Impact (time/cost savings)
• Strategic Alignment (supports business goals)
• Implementation Feasibility (technical complexity)
• Risk Level (what happens if it fails?)
• Team Readiness (skills and change capacity)

Quick Win Examples by Department:

Marketing:
• Social media posting and scheduling
• Lead scoring and routing
• Email campaign personalization
• Report generation and distribution

Sales:
• CRM data entry and updates
• Proposal generation from templates
• Follow-up email sequences
• Meeting scheduling and prep

Operations:
• Invoice processing and approval
• Inventory monitoring and reordering
• Employee onboarding workflows
• Compliance reporting

HR:
• Resume screening and ranking
• Interview scheduling coordination
• Employee survey analysis
• Policy updates and distribution

Finance:
• Expense report processing
• Budget vs. actual reporting
• Vendor payment workflows
• Financial data reconciliation

Getting Started Action Plan:
1. Complete process inventory (Week 1)
2. Score top 10 processes using matrix (Week 2)
3. Calculate ROI for top 3 opportunities (Week 3)
4. Select 1 pilot project and create implementation plan (Week 4)
5. Execute 90-day pilot with success metrics
6. Scale successful automation and iterate

Success Metrics to Track:
• Time saved per week/month
• Error reduction percentage
• Employee satisfaction impact
• Cost savings achieved
• Process completion time improvement`,
    resources: [
      { label: "Automation Opportunity Matrix Template", url: "#" },
      { label: "ROI Calculator Spreadsheet", url: "/enterprise/roi" },
    ],
  },
  "ai-implementation": {
    slug: "ai-implementation",
    title: "AI Implementation Strategy",
    videoId: "dHQqvYy5KYo",
    starter: `ROLE: You are an AI transformation consultant for enterprise clients.
CONTEXT: I'm leading AI implementation at a [COMPANY_SIZE] [INDUSTRY] organization with [BUDGET_RANGE] budget.
TASK: Create a comprehensive 90-day AI implementation roadmap for our pilot project.
CONSTRAINTS: Must include governance, change management, and success metrics.
OUTPUT: Phase-by-phase plan with timelines, responsibilities, and measurable outcomes.

Our pilot project focus: [DESCRIBE_YOUR_PILOT]
Key stakeholders: [LIST_STAKEHOLDERS]
Current AI experience level: [BEGINNER/INTERMEDIATE/ADVANCED]`,
    content: `Enterprise AI Implementation Strategy: Pilot to Production

Phase 1: Foundation (Days 1-30)

Week 1-2: Governance & Strategy Setup
• Form AI steering committee with executive sponsor
• Define AI ethics and governance policies
• Create data governance framework
• Establish success metrics and KPIs
• Secure budget allocation and resources

Deliverables:
- AI Governance Charter (1-2 pages)
- Success Metrics Dashboard design
- Project charter with clear objectives
- Risk assessment and mitigation plan

Week 3-4: Team & Infrastructure Preparation
• Identify and train core implementation team
• Assess current technology infrastructure
• Evaluate vendor/tool options for pilot
• Design change management strategy
• Create communication plan for organization

Deliverables:
- Team roles and responsibilities matrix
- Technology requirements document
- Vendor evaluation scorecard
- Change management plan
- Communication timeline and messages

Phase 2: Pilot Development (Days 31-60)

Week 5-6: Pilot Project Kickoff
• Finalize pilot project scope and requirements
• Configure selected AI tools and platforms
• Establish data pipelines and integrations
• Create testing and quality assurance processes
• Begin user training programs

Key Activities:
- Technical setup and configuration
- Data preparation and cleansing
- Initial testing with small user group
- Documentation creation (SOPs, guides)
- Feedback collection mechanisms

Week 7-8: Testing & Iteration
• Conduct comprehensive testing scenarios
• Gather user feedback and iterate
• Refine processes based on learnings
• Document best practices and lessons learned
• Prepare for broader rollout

Deliverables:
- Tested and validated AI solution
- User training materials and guides
- Process documentation and SOPs
- Lessons learned report
- Rollout readiness assessment

Phase 3: Scale & Optimize (Days 61-90)

Week 9-10: Full Pilot Rollout
• Deploy to complete pilot user group
• Monitor performance against KPIs
• Provide ongoing support and training
• Collect comprehensive usage analytics
• Address any issues or concerns promptly

Success Metrics to Track:
- User adoption rate (target: 80%+)
- Time savings per user (measure weekly)
- Quality improvements (error reduction)
- User satisfaction scores (monthly survey)
- Business impact metrics (revenue, cost savings)

Week 11-12: Evaluation & Scale Planning
• Analyze pilot results against original objectives
• Calculate actual ROI and business impact
• Identify opportunities for optimization
• Plan scaling strategy to additional departments
• Prepare executive presentation of results

Deliverables:
- Comprehensive pilot results report
- ROI analysis and business case
- Scaling strategy and recommendations
- Executive presentation materials
- Next phase implementation plan

Governance Framework Components:

AI Ethics Committee:
• Responsible AI use policies
• Bias detection and mitigation protocols
• Privacy and data protection standards
• Transparency and explainability requirements

Data Governance:
• Data quality standards and processes
• Access controls and security protocols
• Data lineage and audit trails
• Compliance with regulations (GDPR, etc.)

Change Management Strategy:

Communication Plan:
• Executive messaging and vision sharing
• Department-specific value propositions
• Regular progress updates and wins
• Address concerns and resistance proactively

Training Program:
• Leadership AI literacy sessions
• End-user training on new tools/processes
• Champions program for early adopters
• Ongoing support and refresher training

Cultural Integration:
• Celebrate early wins and success stories
• Create AI innovation time/resources
• Encourage experimentation and learning
• Recognize and reward AI adoption

Risk Management:

Technical Risks:
• System integration failures
• Data quality or availability issues
• Performance below expectations
• Security vulnerabilities

Business Risks:
• User resistance or low adoption
• Regulatory or compliance issues
• Budget overruns or timeline delays
• Negative impact on customer experience

Mitigation Strategies:
• Comprehensive testing before rollout
• Phased implementation approach
• Strong change management program
• Regular risk assessment and monitoring

Success Metrics Framework:

Operational Metrics:
• Process efficiency improvements
• Error reduction percentages
• Time savings per employee
• Cost reduction achievements

Strategic Metrics:
• Employee satisfaction and adoption
• Customer experience improvements
• Innovation pipeline development
• Competitive advantage gained

Financial Metrics:
• Return on investment (ROI)
• Cost savings achieved
• Revenue impact (if applicable)
• Payback period calculation

Scaling Strategy Post-Pilot:

Horizontal Scaling (More Users):
• Expand to additional departments
• Roll out to more geographic locations
• Increase user capacity and access

Vertical Scaling (More Capabilities):
• Add advanced AI features
• Integrate additional data sources
• Expand to more complex use cases

Enterprise Integration:
• Connect with existing enterprise systems
• Standardize across business units
• Establish centers of excellence
• Create internal AI competency team

Long-term Roadmap (6-18 months):
• Advanced analytics and ML capabilities
• Custom AI model development
• AI-powered product/service innovation
• Industry-specific AI applications`,
    resources: [
      { label: "AI Governance Template", url: "#" },
      { label: "Change Management Toolkit", url: "#" },
      { label: "Success Metrics Dashboard", url: "#" },
    ],
  },
};

export default function LessonPage({ params }: { params: { slug: string } }) {
  const lesson = useMemo(() => LESSONS[params.slug], [params.slug]);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  if (!lesson) {
    return (
      <section className="container py-12">
        <h1 className="text-2xl font-semibold">Lesson not found</h1>
        <a href="/learn" className="btn btn-ghost mt-3">← Back to lessons</a>
      </section>
    );
  }

  async function playNarration() {
    try {
      setPlaying(true);
      const r = await fetch("/api/tts", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ text: lesson.content }),
      });
      if (!r.ok) throw new Error("TTS failed");
      const blob = await r.blob();
      const url = URL.createObjectURL(blob);
      if (!audioRef.current) audioRef.current = new Audio();
      audioRef.current.src = url;
      audioRef.current.onended = () => { setPlaying(false); URL.revokeObjectURL(url); };
      audioRef.current.play();
    } catch {
      setPlaying(false);
      alert("Could not generate narration. Check TTS env keys.");
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -right-4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 -left-4 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10">
        <div className="container mx-auto px-4 py-16 max-w-6xl">
          {/* Navigation */}
          <div className="mb-8">
            <a href="/learn" className="text-cyan-400 hover:text-cyan-300 text-sm font-medium transition-colors">
              ← Back to All Lessons
            </a>
          </div>

          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-blue-100 to-cyan-200 bg-clip-text text-transparent leading-tight mb-4">
              {lesson.title}
            </h1>
            <div className="flex items-center gap-4 text-slate-300">
              <span className="px-3 py-1 bg-cyan-500/20 text-cyan-300 rounded-lg text-sm font-medium">
                Professional Level
              </span>
              <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-lg text-sm font-medium">
                Interactive Learning
              </span>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Video Section */}
              <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8">
                <h2 className="text-2xl font-bold text-white mb-6">Video Lesson</h2>
                <div className="aspect-video rounded-2xl overflow-hidden border border-slate-600/50">
                  {lesson.mp4Url ? (
                    <video className="w-full h-full bg-slate-700" controls src={lesson.mp4Url} />
                  ) : (
                    <iframe
                      className="w-full h-full"
                      src={`https://www.youtube-nocookie.com/embed/${lesson.videoId}?rel=0`}
                      title={lesson.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  )}
                </div>
              </div>

              {/* Lesson Content */}
              <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">Lesson Notes</h2>
                  <button
                    onClick={playNarration}
                    className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-400 hover:to-pink-500 text-white rounded-xl transition-all duration-200 flex items-center gap-2"
                  >
                    {playing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Playing...
                      </>
                    ) : (
                      <>
                        <span>🔊</span>
                        Play Narration
                      </>
                    )}
                  </button>
                </div>
                <div className="prose prose-invert prose-lg max-w-none">
                  <div className="whitespace-pre-wrap text-slate-200 leading-relaxed">
                    {lesson.content}
                  </div>
                </div>
              </div>

              {/* Interactive Practice */}
              <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8">
                <h2 className="text-2xl font-bold text-white mb-6">🚀 Practice Now</h2>
                <p className="text-slate-300 mb-6">
                  We've pre-filled a professional prompt template. Customize it for your specific situation and get immediate AI assistance.
                </p>
                <div className="bg-slate-700/30 rounded-2xl p-6">
                  <InlineChat initial={lesson.starter} />
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Resources */}
              {lesson.resources?.length ? (
                <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4">📚 Resources</h3>
                  <div className="space-y-3">
                    {lesson.resources.map(resource => (
                      <a
                        key={resource.url}
                        href={resource.url}
                        target="_blank"
                        className="block p-3 bg-slate-700/30 hover:bg-slate-600/30 rounded-xl transition-colors group"
                      >
                        <span className="text-cyan-400 group-hover:text-cyan-300 font-medium">
                          {resource.label} →
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              ) : null}

              {/* Next Steps */}
              <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">🎯 Next Steps</h3>
                <div className="space-y-4">
                  <a
                    href="/enterprise/blueprints"
                    className="block px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold rounded-xl transition-all duration-200 text-center"
                  >
                    Generate AI Blueprint
                  </a>
                  <a
                    href="/enterprise/diagnostic"
                    className="block px-4 py-3 bg-slate-700/50 border border-slate-600/50 text-white rounded-xl hover:bg-slate-600/50 transition-all duration-200 text-center"
                  >
                    Take Readiness Assessment
                  </a>
                </div>
              </div>

              {/* Course Progress */}
              <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">📈 Learning Path</h3>
                <div className="space-y-3">
                  <div className={`p-3 rounded-xl ${lesson.slug === 'ai-fundamentals' ? 'bg-cyan-500/20 border border-cyan-500/30' : 'bg-slate-700/30'}`}>
                    <a href="/learn/ai-fundamentals" className="text-white hover:text-cyan-300 transition-colors">
                      1. AI Fundamentals
                    </a>
                  </div>
                  <div className={`p-3 rounded-xl ${lesson.slug === 'prompt-engineering' ? 'bg-cyan-500/20 border border-cyan-500/30' : 'bg-slate-700/30'}`}>
                    <a href="/learn/prompt-engineering" className="text-white hover:text-cyan-300 transition-colors">
                      2. Prompt Engineering
                    </a>
                  </div>
                  <div className={`p-3 rounded-xl ${lesson.slug === 'automation-identification' ? 'bg-cyan-500/20 border border-cyan-500/30' : 'bg-slate-700/30'}`}>
                    <a href="/learn/automation-identification" className="text-white hover:text-cyan-300 transition-colors">
                      3. Automation Opportunities
                    </a>
                  </div>
                  <div className={`p-3 rounded-xl ${lesson.slug === 'ai-implementation' ? 'bg-cyan-500/20 border border-cyan-500/30' : 'bg-slate-700/30'}`}>
                    <a href="/learn/ai-implementation" className="text-white hover:text-cyan-300 transition-colors">
                      4. Implementation Strategy
                    </a>
                  </div>
                </div>
              </div>

              {/* Get Help */}
              <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-3xl p-6">
                <h3 className="text-xl font-bold text-white mb-3">💬 Need Help?</h3>
                <p className="text-slate-300 text-sm mb-4">
                  Get personalized guidance from AI strategy experts.
                </p>
                <a
                  href="/contact"
                  className="block px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-400 hover:to-pink-500 text-white font-semibold rounded-xl transition-all duration-200 text-center text-sm"
                >
                  Book Strategy Call
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
