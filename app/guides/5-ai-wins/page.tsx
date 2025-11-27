'use client';

import Link from 'next/link';

export default function FiveAIWinsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <Link href="/" className="text-xl font-bold text-indigo-600 hover:text-indigo-700">
            Lorenzo DC
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-indigo-200 text-sm font-medium uppercase tracking-wide mb-4">
            Free Guide
          </p>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            5 AI Wins You Can Implement Today
          </h1>
          <p className="text-xl text-indigo-100 max-w-2xl mx-auto">
            No fluff. No theory. Just 5 specific tools and exactly how to use them
            to save time and get results—starting in the next 15 minutes.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">

        {/* Intro */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 mb-8">
          <p className="text-lg text-slate-700 leading-relaxed mb-4">
            Look, I know you're busy. You don't have time to read a 50-page whitepaper
            on "The Future of AI in Business."
          </p>
          <p className="text-lg text-slate-700 leading-relaxed mb-4">
            You want something you can <strong>use right now</strong>.
          </p>
          <p className="text-lg text-slate-700 leading-relaxed">
            That's what this is. Five wins. Each takes 15 minutes or less to set up.
            Each will save you hours every week.
          </p>
        </div>

        {/* Win #1 */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <span className="flex items-center justify-center w-12 h-12 bg-green-100 text-green-600 rounded-full text-xl font-bold">1</span>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Email Drafts in Seconds</h2>
              <p className="text-slate-500">Save 5+ hours/week on email</p>
            </div>
          </div>

          <p className="text-slate-700 mb-4">
            <strong>The Tool:</strong> ChatGPT or Claude
          </p>

          <p className="text-slate-700 mb-4">
            <strong>The Problem:</strong> You spend 30+ minutes crafting important emails,
            second-guessing every word.
          </p>

          <div className="bg-slate-50 rounded-lg p-6 mb-4">
            <p className="text-sm font-medium text-slate-500 mb-2">THE PROMPT:</p>
            <p className="text-slate-800 font-mono text-sm leading-relaxed">
              "Write a professional email to [recipient/role] about [topic].
              The tone should be [friendly/formal/direct]. Key points to include:
              [bullet points]. Keep it under [X] sentences."
            </p>
          </div>

          <p className="text-slate-700 mb-4">
            <strong>Pro Tip:</strong> Create a "voice document" that describes how you write.
            Paste it before your prompt: "Match this writing style: [paste example email you've written]"
          </p>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-800 font-medium">
              ⏱️ Setup time: 2 minutes | 💰 ROI: 5+ hours saved per week
            </p>
          </div>
        </div>

        {/* Win #2 */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <span className="flex items-center justify-center w-12 h-12 bg-blue-100 text-blue-600 rounded-full text-xl font-bold">2</span>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Meeting Notes That Write Themselves</h2>
              <p className="text-slate-500">Never miss an action item again</p>
            </div>
          </div>

          <p className="text-slate-700 mb-4">
            <strong>The Tool:</strong> Otter.ai, Fireflies.ai, or Fathom (all have free tiers)
          </p>

          <p className="text-slate-700 mb-4">
            <strong>The Problem:</strong> You're either taking notes and missing the conversation,
            or paying attention and forgetting what was said.
          </p>

          <p className="text-slate-700 mb-4">
            <strong>The Solution:</strong> These tools join your Zoom/Teams/Meet calls automatically,
            transcribe everything, and summarize key points + action items.
          </p>

          <div className="bg-slate-50 rounded-lg p-6 mb-4">
            <p className="text-sm font-medium text-slate-500 mb-2">SETUP STEPS:</p>
            <ol className="list-decimal list-inside text-slate-800 space-y-2">
              <li>Sign up for Otter.ai (free tier = 300 mins/month)</li>
              <li>Connect your calendar</li>
              <li>Enable "auto-join meetings"</li>
              <li>After each meeting, you get: transcript, summary, action items</li>
            </ol>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-800 font-medium">
              ⏱️ Setup time: 5 minutes | 💰 ROI: 3+ hours saved per week
            </p>
          </div>
        </div>

        {/* Win #3 */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <span className="flex items-center justify-center w-12 h-12 bg-purple-100 text-purple-600 rounded-full text-xl font-bold">3</span>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Research in 5 Minutes Instead of 5 Hours</h2>
              <p className="text-slate-500">Get expert-level summaries instantly</p>
            </div>
          </div>

          <p className="text-slate-700 mb-4">
            <strong>The Tool:</strong> Perplexity.ai (free) or ChatGPT with browsing
          </p>

          <p className="text-slate-700 mb-4">
            <strong>The Problem:</strong> You need to research a topic, competitor, or industry trend.
            You open 20 tabs, skim articles, and 2 hours later you're still not sure what you learned.
          </p>

          <div className="bg-slate-50 rounded-lg p-6 mb-4">
            <p className="text-sm font-medium text-slate-500 mb-2">THE PROMPT:</p>
            <p className="text-slate-800 font-mono text-sm leading-relaxed">
              "Give me a comprehensive summary of [topic]. Include: key facts,
              recent developments (last 6 months), main players/competitors,
              and 3 things most people get wrong about this. Cite your sources."
            </p>
          </div>

          <p className="text-slate-700 mb-4">
            <strong>Pro Tip:</strong> Follow up with "What questions should I be asking about this
            that I haven't asked?" — AI is great at identifying blind spots.
          </p>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <p className="text-purple-800 font-medium">
              ⏱️ Setup time: 0 minutes | 💰 ROI: 4+ hours saved per research task
            </p>
          </div>
        </div>

        {/* Win #4 */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <span className="flex items-center justify-center w-12 h-12 bg-amber-100 text-amber-600 rounded-full text-xl font-bold">4</span>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Social Media Content on Autopilot</h2>
              <p className="text-slate-500">A week of posts in 30 minutes</p>
            </div>
          </div>

          <p className="text-slate-700 mb-4">
            <strong>The Tool:</strong> ChatGPT + your content pillars
          </p>

          <p className="text-slate-700 mb-4">
            <strong>The Problem:</strong> You know you should post consistently, but staring at
            a blank screen trying to think of what to say is painful.
          </p>

          <div className="bg-slate-50 rounded-lg p-6 mb-4">
            <p className="text-sm font-medium text-slate-500 mb-2">THE PROMPT:</p>
            <p className="text-slate-800 font-mono text-sm leading-relaxed">
              "I'm a [your role] who helps [your audience] with [your expertise].
              Generate 5 LinkedIn posts for this week. Mix of: 1 personal story,
              1 industry insight, 1 how-to tip, 1 contrarian take, 1 engagement question.
              Keep each under 150 words. Make them sound human, not corporate."
            </p>
          </div>

          <p className="text-slate-700 mb-4">
            <strong>Pro Tip:</strong> Always edit the output to add your personal voice.
            AI gives you the structure; you add the soul.
          </p>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-amber-800 font-medium">
              ⏱️ Setup time: 10 minutes | 💰 ROI: 3+ hours saved per week
            </p>
          </div>
        </div>

        {/* Win #5 */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <span className="flex items-center justify-center w-12 h-12 bg-red-100 text-red-600 rounded-full text-xl font-bold">5</span>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Instant Document Analysis</h2>
              <p className="text-slate-500">Extract insights from any PDF, report, or contract</p>
            </div>
          </div>

          <p className="text-slate-700 mb-4">
            <strong>The Tool:</strong> Claude (Anthropic) or ChatGPT Plus
          </p>

          <p className="text-slate-700 mb-4">
            <strong>The Problem:</strong> You have a 50-page report, contract, or research paper.
            You need to understand it quickly. Reading it all would take hours.
          </p>

          <div className="bg-slate-50 rounded-lg p-6 mb-4">
            <p className="text-sm font-medium text-slate-500 mb-2">THE PROMPT:</p>
            <p className="text-slate-800 font-mono text-sm leading-relaxed">
              [Upload document] "Analyze this document and give me:
              1) Executive summary (3 sentences),
              2) Key findings or terms,
              3) Potential risks or concerns,
              4) Questions I should ask about this,
              5) Action items if any."
            </p>
          </div>

          <p className="text-slate-700 mb-4">
            <strong>Pro Tip:</strong> For contracts, add: "Highlight any unusual clauses or terms
            that deviate from standard agreements."
          </p>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800 font-medium">
              ⏱️ Setup time: 2 minutes | 💰 ROI: 2+ hours saved per document
            </p>
          </div>
        </div>

        {/* Summary Box */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-8 text-white mb-8">
          <h2 className="text-2xl font-bold mb-4">Total Time Saved: 17+ Hours Per Week</h2>
          <p className="text-indigo-100 mb-6">
            That's like getting an extra 2 days every week. And we're just scratching the surface.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
            <div className="bg-white/10 rounded-lg p-3">
              <p className="text-2xl font-bold">5h</p>
              <p className="text-xs text-indigo-200">Email</p>
            </div>
            <div className="bg-white/10 rounded-lg p-3">
              <p className="text-2xl font-bold">3h</p>
              <p className="text-xs text-indigo-200">Meetings</p>
            </div>
            <div className="bg-white/10 rounded-lg p-3">
              <p className="text-2xl font-bold">4h</p>
              <p className="text-xs text-indigo-200">Research</p>
            </div>
            <div className="bg-white/10 rounded-lg p-3">
              <p className="text-2xl font-bold">3h</p>
              <p className="text-xs text-indigo-200">Content</p>
            </div>
            <div className="bg-white/10 rounded-lg p-3">
              <p className="text-2xl font-bold">2h</p>
              <p className="text-xs text-indigo-200">Documents</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Ready to Go Deeper?
          </h2>
          <p className="text-slate-600 mb-6 max-w-xl mx-auto">
            These 5 wins are just the beginning. Take the AI Readiness Assessment to get
            a personalized roadmap based on your specific situation, industry, and goals.
          </p>
          <Link
            href="/ai-assessment"
            className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-8 rounded-lg transition-colors text-lg"
          >
            Take the Free Assessment →
          </Link>
          <p className="text-slate-500 text-sm mt-4">
            3 minutes • Personalized results • No cost
          </p>
        </div>

        {/* About */}
        <div className="mt-12 pt-8 border-t border-slate-200">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center text-2xl">
              👋
            </div>
            <div>
              <h3 className="font-bold text-slate-900">About Lorenzo</h3>
              <p className="text-slate-600 text-sm mt-1">
                I help business leaders implement AI in ways that actually work.
                Not hype. Not theory. Real tools, real results.
                <Link href="/contact" className="text-indigo-600 hover:underline ml-1">
                  Let's talk →
                </Link>
              </p>
            </div>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8 mt-12">
        <div className="max-w-4xl mx-auto px-6 text-center text-sm">
          <p>© {new Date().getFullYear()} Lorenzo DC. All rights reserved.</p>
          <div className="mt-4 space-x-4">
            <Link href="/" className="hover:text-white">Home</Link>
            <Link href="/ai-assessment" className="hover:text-white">Assessment</Link>
            <Link href="/contact" className="hover:text-white">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
