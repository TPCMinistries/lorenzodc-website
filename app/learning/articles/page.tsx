"use client";
import { useState } from "react";
import Link from "next/link";

export default function ArticlesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Sample articles data - in production this would come from a CMS or API
  const articles = [
    {
      id: 1,
      title: "The Strategic Edge: How AI Amplifies Leadership in Business",
      excerpt: "Discover how artificial intelligence can serve as a tool for amplifying strategic insights and leadership in your business operations, without compromising core values.",
      category: "AI Strategy",
      publishDate: "2024-01-15",
      readTime: "8 min read",
      featured: true,
      tags: ["AI", "Leadership", "Strategy", "Business Excellence"]
    },
    {
      id: 2,
      title: "Kingdom Economics: Building Sustainable Enterprises",
      excerpt: "Explore the intersection of faith-based values and strategic business development in today's global marketplace.",
      category: "Strategic Wisdom",
      publishDate: "2024-01-10",
      readTime: "12 min read",
      tags: ["Kingdom Economics", "Sustainability", "Strategic Wisdom"]
    },
    {
      id: 3,
      title: "Ethical AI Implementation for Ministry Organizations",
      excerpt: "A comprehensive guide to implementing AI tools while maintaining ethical standards and kingdom values.",
      category: "AI Implementation",
      publishDate: "2024-01-05",
      readTime: "15 min read",
      tags: ["AI", "Ethics", "Ministry", "Implementation"]
    },
    {
      id: 4,
      title: "Digital Transformation in Faith-Based Organizations",
      excerpt: "Navigating the digital revolution while staying true to core spiritual principles and community values.",
      category: "Technology",
      publishDate: "2024-01-02",
      readTime: "10 min read",
      tags: ["Digital Transformation", "Faith", "Technology", "Organizations"]
    },
    {
      id: 5,
      title: "Strategic Leadership in Times of Uncertainty",
      excerpt: "How prophetic intelligence and strategic thinking can guide leaders through complex business environments.",
      category: "Leadership",
      publishDate: "2023-12-28",
      readTime: "14 min read",
      tags: ["Leadership", "Strategy", "Uncertainty", "Business"]
    },
    {
      id: 6,
      title: "Building AI-Powered Customer Experience Systems",
      excerpt: "Creating customer experiences that combine technological efficiency with authentic human connection.",
      category: "AI Strategy",
      publishDate: "2023-12-20",
      readTime: "11 min read",
      tags: ["AI", "Customer Experience", "Technology", "Human Connection"]
    }
  ];

  const categories = [
    'all',
    'AI Strategy',
    'Strategic Wisdom',
    'Leadership',
    'Technology',
    'AI Implementation'
  ];

  const filteredArticles = articles.filter(article => {
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    const matchesSearch = searchTerm === '' ||
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950">
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 px-4 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-600/20 to-indigo-600/15 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-1/3 -left-40 w-96 h-96 bg-gradient-to-br from-purple-600/15 to-pink-600/10 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center">
            <Link href="/learning" className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-6 transition-colors">
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Learning Hub
            </Link>

            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400">
                Articles & Insights
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Strategic wisdom, AI insights, and leadership principles for transforming
              your business and ministry impact.
            </p>

            {/* Search and Filter */}
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-col md:flex-row gap-4 mb-8">
                {/* Search Bar */}
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Search articles..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-6 py-4 bg-white/10 backdrop-blur-xl rounded-full border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <svg className="absolute right-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>

                {/* Category Filter */}
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-6 py-4 bg-white/10 backdrop-blur-xl rounded-full border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {categories.map(category => (
                    <option key={category} value={category} className="bg-slate-800 text-white">
                      {category === 'all' ? 'All Categories' : category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Results Count */}
              <p className="text-gray-400 text-center">
                {filteredArticles.length} article{filteredArticles.length !== 1 ? 's' : ''} found
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          {filteredArticles.length > 0 ? (
            <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8">
              {filteredArticles.map((article) => (
                <article key={article.id} className={`group bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-slate-500/20 hover:border-slate-400/40 transition-all duration-300 hover:scale-105 ${article.featured ? 'ring-2 ring-amber-500/30' : ''}`}>
                  {article.featured && (
                    <div className="flex items-center mb-4">
                      <span className="bg-gradient-to-r from-amber-500 to-yellow-500 text-black px-3 py-1 rounded-full text-sm font-semibold">
                        Featured
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 bg-blue-600/20 text-blue-300 rounded-full text-sm">
                      {article.category}
                    </span>
                    <span className="text-gray-400 text-sm">{article.readTime}</span>
                  </div>

                  <h2 className="text-xl font-semibold text-white mb-3 group-hover:text-blue-300 transition-colors line-clamp-2">
                    {article.title}
                  </h2>

                  <p className="text-gray-300 mb-4 text-sm line-clamp-3">
                    {article.excerpt}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {article.tags.slice(0, 3).map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-slate-700/50 text-slate-300 rounded text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">
                      {new Date(article.publishDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                    <Link
                      href={`/learning/articles/${article.id}`}
                      className="inline-flex items-center text-blue-400 hover:text-blue-300 font-semibold text-sm transition-colors"
                    >
                      Read Article
                      <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No articles found</h3>
              <p className="text-gray-400 mb-6">Try adjusting your search or filter criteria.</p>
              <button
                onClick={() => {setSearchTerm(''); setSelectedCategory('all');}}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:shadow-xl transition-all"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-br from-indigo-900/50 to-purple-900/50 rounded-2xl p-12 border border-purple-500/30">
            <h2 className="text-4xl font-bold text-white mb-6">
              Never Miss Strategic Insights
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Subscribe to receive new articles, exclusive content, and strategic frameworks directly in your inbox.
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