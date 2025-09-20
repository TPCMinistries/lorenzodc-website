"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function LearningHub() {
  const [activeTab, setActiveTab] = useState<'articles' | 'books' | 'courses' | 'resources'>('articles');

  // Sample content data - in production this would come from a CMS or API
  const featuredArticles = [
    {
      id: 1,
      title: "The Strategic Edge: How AI Amplifies Leadership in Business",
      excerpt: "Discover how artificial intelligence can serve as a tool for amplifying strategic insights and leadership in your business operations, without compromising core values.",
      category: "AI Strategy",
      publishDate: "2024-01-15",
      readTime: "8 min read",
      featured: true
    },
    {
      id: 2,
      title: "Kingdom Economics: Building Sustainable Enterprises",
      excerpt: "Explore the intersection of faith-based values and strategic business development in today's global marketplace.",
      category: "Strategic Wisdom",
      publishDate: "2024-01-10",
      readTime: "12 min read"
    },
    {
      id: 3,
      title: "Ethical AI Implementation for Ministry Organizations",
      excerpt: "A comprehensive guide to implementing AI tools while maintaining ethical standards and kingdom values.",
      category: "AI Implementation",
      publishDate: "2024-01-05",
      readTime: "15 min read"
    }
  ];

  const bookCollection = [
    {
      title: "Strategic Intelligence in the Digital Age",
      description: "A comprehensive guide to navigating business transformation through AI and strategic thinking.",
      status: "Available Now",
      coverColor: "from-blue-600 to-indigo-700"
    },
    {
      title: "Kingdom Leadership Principles",
      description: "Bridging spiritual wisdom with executive excellence in modern business environments.",
      status: "Coming Q2 2024",
      coverColor: "from-amber-600 to-yellow-700"
    }
  ];

  const courses = [
    {
      title: "AI Implementation Masterclass",
      duration: "8 weeks",
      level: "Intermediate",
      description: "Complete framework for implementing AI tools in your organization."
    },
    {
      title: "Strategic Leadership Academy",
      duration: "12 weeks",
      level: "Advanced",
      description: "Executive-level leadership development with kingdom principles."
    },
    {
      title: "Ethical AI for Ministry",
      duration: "4 weeks",
      level: "Beginner",
      description: "Foundation course for ministry leaders entering the AI era."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-600/20 to-indigo-600/15 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-1/3 -left-40 w-96 h-96 bg-gradient-to-br from-purple-600/15 to-pink-600/10 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400">
                Learning Hub
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Deepen your understanding of strategic intelligence, AI integration, and mission-minded
              business practices through curated content and exclusive insights.
            </p>

            {/* Search Bar */}
            <div className="max-w-xl mx-auto mb-12">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search articles, courses, and resources..."
                  className="w-full px-6 py-4 bg-white/10 backdrop-blur-xl rounded-full border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <svg className="absolute right-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <section className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-center mb-12">
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-2 border border-slate-600/30">
              {(['articles', 'books', 'courses', 'resources'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all capitalize ${
                    activeTab === tab
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Content Sections */}
          {activeTab === 'articles' && (
            <div className="space-y-12">
              {/* Featured Article */}
              <div className="bg-gradient-to-r from-slate-800/50 to-slate-900/50 rounded-2xl p-8 border border-white/10">
                <div className="flex flex-col lg:flex-row items-center gap-8">
                  <div className="flex-1">
                    <div className="flex items-center mb-4">
                      <span className="bg-gradient-to-r from-amber-500 to-yellow-500 text-black px-3 py-1 rounded-full text-sm font-semibold mr-4">
                        Featured Article
                      </span>
                      <span className="text-gray-400 text-sm">Published this week</span>
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-4">
                      {featuredArticles[0].title}
                    </h3>
                    <p className="text-gray-300 mb-6 text-lg">
                      {featuredArticles[0].excerpt}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-6">
                      <span className="px-3 py-1 bg-blue-600/20 text-blue-300 rounded-full text-sm">AI Strategy</span>
                      <span className="px-3 py-1 bg-purple-600/20 text-purple-300 rounded-full text-sm">Strategic Wisdom</span>
                      <span className="px-3 py-1 bg-emerald-600/20 text-emerald-300 rounded-full text-sm">Business Excellence</span>
                    </div>
                    <Link href="/learning/articles/strategic-edge-ai-leadership" className="inline-flex items-center text-blue-400 hover:text-blue-300 font-semibold transition-colors">
                      Read Full Article
                      <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                  <div className="w-full lg:w-80 h-48 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-xl flex items-center justify-center border border-blue-500/30">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <p className="text-gray-400 text-sm">Article Preview</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Articles Grid */}
              <div>
                <h2 className="text-3xl font-bold text-white mb-8">Recent Articles</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {featuredArticles.slice(1).map((article) => (
                    <div key={article.id} className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-slate-500/20 hover:border-slate-400/40 transition-all group">
                      <div className="flex items-center justify-between mb-4">
                        <span className="px-3 py-1 bg-blue-600/20 text-blue-300 rounded-full text-sm">{article.category}</span>
                        <span className="text-gray-400 text-sm">{article.readTime}</span>
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-blue-300 transition-colors">{article.title}</h3>
                      <p className="text-gray-300 mb-4 text-sm">{article.excerpt}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400 text-sm">{new Date(article.publishDate).toLocaleDateString()}</span>
                        <Link href={`/learning/articles/${article.id}`} className="text-blue-400 hover:text-blue-300 font-semibold text-sm">
                          Read →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* View All Articles */}
              <div className="text-center">
                <Link href="/learning/articles" className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:shadow-2xl transition-all transform hover:scale-105">
                  View All Articles
                </Link>
              </div>
            </div>
          )}

          {activeTab === 'books' && (
            <div className="space-y-12">
              <h2 className="text-3xl font-bold text-white text-center mb-8">Lorenzo's Book Collection</h2>
              <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {bookCollection.map((book, index) => (
                  <div key={index} className="bg-white/5 backdrop-blur-xl rounded-xl p-8 border border-slate-500/20 hover:border-slate-400/40 transition-all group">
                    <div className={`w-24 h-32 bg-gradient-to-br ${book.coverColor} rounded-lg mb-6 mx-auto shadow-xl`}></div>
                    <h3 className="text-2xl font-semibold text-white mb-4 text-center">{book.title}</h3>
                    <p className="text-gray-300 mb-6 text-center">{book.description}</p>
                    <div className="text-center">
                      <span className="inline-block px-4 py-2 bg-amber-600/20 text-amber-300 rounded-full text-sm mb-4">{book.status}</span>
                      <br />
                      <button className="px-6 py-3 bg-gradient-to-r from-amber-600 to-yellow-600 text-white font-semibold rounded-lg hover:shadow-xl transition-all">
                        {book.status.includes('Coming') ? 'Notify Me' : 'Learn More'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'courses' && (
            <div className="space-y-12">
              <h2 className="text-3xl font-bold text-white text-center mb-8">Training & Development</h2>
              <div className="grid lg:grid-cols-3 gap-8">
                {courses.map((course, index) => (
                  <div key={index} className="bg-white/5 backdrop-blur-xl rounded-xl p-8 border border-slate-500/20 hover:border-slate-400/40 transition-all group">
                    <div className="flex items-center justify-between mb-4">
                      <span className="px-3 py-1 bg-purple-600/20 text-purple-300 rounded-full text-sm">{course.level}</span>
                      <span className="text-gray-400 text-sm">{course.duration}</span>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-4">{course.title}</h3>
                    <p className="text-gray-300 mb-6">{course.description}</p>
                    <button className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-lg hover:shadow-xl transition-all">
                      Learn More
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'resources' && (
            <div className="space-y-12">
              <h2 className="text-3xl font-bold text-white text-center mb-8">Resource Library</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                  { title: 'Strategic Frameworks', icon: '📊', count: '12 Templates' },
                  { title: 'Assessment Tools', icon: '🎯', count: '8 Assessments' },
                  { title: 'Case Studies', icon: '📚', count: '15 Studies' },
                  { title: 'Video Library', icon: '🎥', count: '25 Videos' }
                ].map((resource, index) => (
                  <div key={index} className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-slate-500/20 hover:border-slate-400/40 transition-all group text-center">
                    <div className="text-4xl mb-4">{resource.icon}</div>
                    <h3 className="text-xl font-semibold text-white mb-2">{resource.title}</h3>
                    <p className="text-gray-400 mb-4">{resource.count}</p>
                    <button className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-lg hover:shadow-xl transition-all">
                      Browse
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-br from-indigo-900/50 to-purple-900/50 rounded-2xl p-12 border border-purple-500/30">
            <h2 className="text-4xl font-bold text-white mb-6">
              Stay Updated with Strategic Insights
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Get weekly articles, exclusive resources, and early access to new courses delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-4 bg-white/10 backdrop-blur text-white rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:shadow-2xl transition-all">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}