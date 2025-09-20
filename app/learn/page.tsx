"use client";
import Link from "next/link";

const lessons = [
  {
    id: "ai-fundamentals",
    title: "AI Fundamentals for Business",
    description: "Understand what AI actually is, what it can and can't do, and how to identify opportunities in your business.",
    duration: "15 min",
    level: "Beginner"
  },
  {
    id: "prompt-engineering",
    title: "Master Prompt Engineering",
    description: "Learn the CLEAR framework for writing prompts that get consistent, high-quality results every time.",
    duration: "20 min",
    level: "Beginner"
  },
  {
    id: "automation-identification",
    title: "Identify Automation Opportunities",
    description: "Systematic approach to finding processes worth automating and calculating potential ROI.",
    duration: "25 min",
    level: "Intermediate"
  },
  {
    id: "ai-implementation",
    title: "AI Implementation Strategy",
    description: "From pilot to production: governance, change management, and scaling best practices.",
    duration: "30 min",
    level: "Advanced"
  }
];

export default function LearnPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -right-4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 -left-4 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10">
        <div className="container mx-auto px-4 py-16">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white via-blue-100 to-cyan-200 bg-clip-text text-transparent leading-tight mb-6">
              Free AI Mastery Lessons
            </h1>
            <p className="text-2xl text-slate-300 max-w-4xl mx-auto">
              Professional-grade AI education with built-in chat coaching and starter prompts.
              Learn fast and apply immediately.
            </p>
          </div>

          {/* Lessons Grid */}
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-16">
            {lessons.map((lesson) => (
              <Link key={lesson.id} href={`/learn/${lesson.id}`}>
                <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 hover:border-slate-600/50 transition-all duration-300 cursor-pointer group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-cyan-200 transition-colors">
                        {lesson.title}
                      </h3>
                      <p className="text-slate-300 leading-relaxed mb-4">
                        {lesson.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex gap-4">
                      <span className="px-3 py-1 bg-cyan-500/20 text-cyan-300 rounded-lg text-sm font-medium">
                        {lesson.duration}
                      </span>
                      <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-lg text-sm font-medium">
                        {lesson.level}
                      </span>
                    </div>
                    <button className="text-cyan-400 font-medium group-hover:text-cyan-300 transition-colors">
                      Start Lesson →
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Learning Path */}
          <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-12 text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-6">Complete Learning Path</h2>
            <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
              Follow our proven progression from AI basics to enterprise implementation.
              Each lesson builds on the previous, with hands-on practice and real examples.
            </p>

            <div className="grid md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-8">
              <div className="bg-slate-700/50 rounded-2xl p-4">
                <div className="text-2xl mb-2">📚</div>
                <div className="text-white font-medium mb-1">Foundation</div>
                <div className="text-slate-400 text-sm">Understand AI basics</div>
              </div>
              <div className="bg-slate-700/50 rounded-2xl p-4">
                <div className="text-2xl mb-2">🎯</div>
                <div className="text-white font-medium mb-1">Application</div>
                <div className="text-slate-400 text-sm">Write effective prompts</div>
              </div>
              <div className="bg-slate-700/50 rounded-2xl p-4">
                <div className="text-2xl mb-2">⚡</div>
                <div className="text-white font-medium mb-1">Automation</div>
                <div className="text-slate-400 text-sm">Identify opportunities</div>
              </div>
              <div className="bg-slate-700/50 rounded-2xl p-4">
                <div className="text-2xl mb-2">🏢</div>
                <div className="text-white font-medium mb-1">Scale</div>
                <div className="text-slate-400 text-sm">Enterprise implementation</div>
              </div>
            </div>

            <Link href="/learn/ai-fundamentals">
              <button className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold rounded-2xl transition-all duration-200">
                Start Learning Journey
              </button>
            </Link>
          </div>

          {/* Next Steps */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 text-center">
              <h3 className="text-2xl font-bold text-white mb-4">Ready for Personal Coaching?</h3>
              <p className="text-slate-300 mb-6">
                Get personalized guidance tailored to your specific situation and goals.
              </p>
              <Link href="/contact">
                <button className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-400 hover:to-pink-500 text-white rounded-2xl transition-all duration-200 font-medium">
                  Book $197 Clarity Call
                </button>
              </Link>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 text-center">
              <h3 className="text-2xl font-bold text-white mb-4">Join Our Community</h3>
              <p className="text-slate-300 mb-6">
                Connect with other AI-curious leaders, get weekly training, and access our template library.
              </p>
              <Link href="/community">
                <button className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 text-white rounded-2xl transition-all duration-200 font-medium">
                  Join for $79/month
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
