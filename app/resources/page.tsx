'use client';

import Link from 'next/link';
import GlobalNavigation from '../components/GlobalNavigation';
import LeadMagnetDownload from '../components/LeadMagnetDownload';

export default function ResourcesPage() {
  const resourceCategories = [
    {
      category: 'Enterprise AI',
      icon: '🤖',
      description: 'Strategic resources for AI implementation and digital transformation',
      resources: [
        {
          type: 'ai_readiness_checklist' as const,
          title: 'Enterprise AI Readiness Checklist',
          description: 'Comprehensive assessment framework to evaluate your organization\'s readiness for AI implementation, covering leadership, data, processes, and team capabilities.',
          tags: ['AI Strategy', 'Enterprise', 'Assessment']
        }
      ]
    },
    {
      category: 'Divine Strategy',
      icon: '⚡',
      description: 'Frameworks for integrating spiritual intelligence with strategic implementation',
      resources: [
        {
          type: 'divine_strategy_guide' as const,
          title: 'Divine Strategy Implementation Guide',
          description: 'Step-by-step framework for receiving prophetic insights and implementing them systematically for breakthrough results in leadership and business.',
          tags: ['Leadership', 'Strategy', 'Spiritual Intelligence']
        }
      ]
    },
    {
      category: 'Kingdom Economics',
      icon: '👑',
      description: 'Business models that generate profit while advancing kingdom purposes',
      resources: [
        {
          type: 'kingdom_economics_framework' as const,
          title: 'Kingdom Economics Framework',
          description: 'Complete blueprint for building enterprises that create sustainable returns while advancing kingdom values and global impact.',
          tags: ['Business Model', 'Impact', 'Sustainability']
        }
      ]
    },
    {
      category: 'Enterprise Transformation',
      icon: '🚀',
      description: 'Systematic approaches to organizational change and strategic implementation',
      resources: [
        {
          type: 'enterprise_transformation_blueprint' as const,
          title: 'Enterprise Transformation Blueprint',
          description: 'Comprehensive roadmap for leading organizational transformation that aligns technology, people, and processes for sustained competitive advantage.',
          tags: ['Transformation', 'Change Management', 'Strategy']
        }
      ]
    }
  ];

  const additionalResources = [
    {
      title: 'Catalyst AI Platform',
      description: 'Interactive AI tools for strategic planning, document analysis, and business intelligence',
      link: '/catalyst',
      icon: '🔬',
      type: 'Platform'
    },
    {
      title: 'Enterprise Diagnostic',
      description: 'Comprehensive assessment of your organization\'s AI readiness and strategic positioning',
      link: '/enterprise/diagnostic',
      icon: '📊',
      type: 'Assessment'
    },
    {
      title: 'ROI Calculator',
      description: 'Calculate potential returns from AI implementation and strategic initiatives',
      link: '/enterprise/roi',
      icon: '💰',
      type: 'Calculator'
    },
    {
      title: 'Speaking Topics',
      description: 'Explore keynote topics on divine strategy, AI leadership, and kingdom economics',
      link: '/lorenzo/speaking',
      icon: '🎤',
      type: 'Speaking'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <GlobalNavigation />

      {/* Hero Section */}
      <div className="relative overflow-hidden py-16 pt-24">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-indigo-500/15 to-cyan-500/10"></div>

        <div className="relative max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-6">
              <div className="w-20 h-1 bg-gradient-to-r from-transparent to-purple-400"></div>
              <div className="mx-6 text-6xl">📚</div>
              <div className="w-20 h-1 bg-gradient-to-l from-transparent to-indigo-400"></div>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-300 via-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              Strategic Resources
            </h1>

            <p className="text-xl md:text-2xl text-slate-200 max-w-4xl mx-auto leading-relaxed mb-6">
              <span className="text-purple-400 font-semibold">Free Downloads</span> •
              <span className="text-indigo-400 font-semibold"> Implementation Guides</span> •
              <span className="text-cyan-400 font-semibold"> Strategic Tools</span>
            </p>

            <p className="text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Access proven frameworks, checklists, and strategic tools that bridge divine intelligence with systematic implementation.
              Each resource provides actionable insights for breakthrough results.
            </p>
          </div>

          {/* Resource Categories */}
          {resourceCategories.map((category, categoryIndex) => (
            <div key={categoryIndex} className="mb-16">
              <div className="flex items-center gap-4 mb-8">
                <div className="text-4xl">{category.icon}</div>
                <div>
                  <h2 className="text-3xl font-bold text-white">{category.category}</h2>
                  <p className="text-slate-300">{category.description}</p>
                </div>
              </div>

              <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8">
                {category.resources.map((resource, resourceIndex) => (
                  <LeadMagnetDownload
                    key={resourceIndex}
                    type={resource.type}
                    title={resource.title}
                    description={resource.description}
                    source="resources_page"
                    className="h-full"
                  />
                ))}
              </div>
            </div>
          ))}

          {/* Interactive Tools & Platforms */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Interactive Tools & Platforms</h2>
              <p className="text-lg text-slate-300 max-w-3xl mx-auto">
                Access powerful interactive tools and assessments for strategic planning and decision-making
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {additionalResources.map((resource, index) => (
                <Link
                  key={index}
                  href={resource.link}
                  className="group bg-slate-800/30 backdrop-blur-xl border border-slate-700/30 rounded-2xl p-6 hover:border-slate-600/50 transition-all duration-300 hover:scale-105"
                >
                  <div className="text-center">
                    <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                      {resource.icon}
                    </div>
                    <div className="text-xs text-purple-400 font-semibold mb-2 uppercase tracking-wide">
                      {resource.type}
                    </div>
                    <h3 className="text-lg font-bold text-white mb-3 group-hover:text-purple-100 transition-colors">
                      {resource.title}
                    </h3>
                    <p className="text-slate-300 text-sm leading-relaxed group-hover:text-slate-200 transition-colors">
                      {resource.description}
                    </p>
                    <div className="mt-4 text-purple-400 text-sm font-medium group-hover:text-purple-300 transition-colors">
                      Access Tool →
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Newsletter Signup */}
          <div className="bg-gradient-to-r from-slate-800/40 to-slate-700/40 backdrop-blur-xl border border-slate-600/30 rounded-3xl p-8 mb-16">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-4">Stay Updated</h2>
              <p className="text-lg text-slate-300 mb-6 max-w-2xl mx-auto">
                Get the latest strategic insights, framework updates, and exclusive resources delivered to your inbox.
              </p>
              <div className="max-w-md mx-auto flex gap-3">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="flex-1 px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:border-purple-500 focus:outline-none"
                />
                <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold rounded-lg transition-all">
                  Subscribe
                </button>
              </div>
              <div className="mt-3 text-xs text-slate-400">
                Weekly insights • No spam • Unsubscribe anytime
              </div>
            </div>
          </div>

          {/* Contact & Consultation */}
          <div className="text-center bg-gradient-to-r from-purple-900/40 to-indigo-900/40 backdrop-blur-xl border border-purple-600/30 rounded-3xl p-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Need Personalized Strategy?
            </h2>
            <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">
              While our resources provide excellent frameworks, sometimes you need personalized strategic guidance.
              Connect with Lorenzo for customized solutions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/lorenzo/connect"
                className="px-10 py-5 bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 hover:from-purple-500 hover:via-indigo-500 hover:to-cyan-500 text-white font-bold text-xl rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl"
              >
                Book Strategic Session →
              </Link>
              <Link
                href="/enterprise/diagnostic"
                className="px-10 py-5 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-600/50 hover:border-slate-500/70 text-white font-bold text-xl rounded-2xl transition-all duration-300 backdrop-blur-xl"
              >
                Take Assessment
              </Link>
            </div>
            <div className="mt-6 text-slate-400 text-sm">
              <span className="text-purple-400">✓</span> Strategic consultation •
              <span className="text-indigo-400"> ✓</span> Implementation planning •
              <span className="text-cyan-400"> ✓</span> Breakthrough results
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}