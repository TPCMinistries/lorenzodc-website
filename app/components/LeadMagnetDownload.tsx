'use client';

import { useState } from 'react';
import { ConversionTrackingService } from '../lib/services/conversion-tracking';
import { LeadQualificationService } from '../lib/services/lead-qualification';
import { SupabaseProspectService } from '../lib/supabase/prospect-service';
import { EmailAutomationService } from '../lib/services/email-automation';
import jsPDF from 'jspdf';

interface LeadMagnetProps {
  type: 'ai_readiness_checklist' | 'divine_strategy_guide' | 'kingdom_economics_framework' | 'enterprise_transformation_blueprint';
  title: string;
  description: string;
  source?: string;
  className?: string;
}

export default function LeadMagnetDownload({
  type,
  title,
  description,
  source = 'lead_magnet',
  className = ''
}: LeadMagnetProps) {
  const [isCollecting, setIsCollecting] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);
  const [hasDownloaded, setHasDownloaded] = useState(false);

  const handleDownload = async () => {
    if (!email || !name) {
      alert('Please provide your name and email address.');
      return;
    }

    setIsDownloading(true);

    try {
      // Create prospect profile
      const profile = LeadQualificationService.qualifyProspect({
        formData: { name, email, company },
        pageViews: [window.location.pathname],
        utmData: {
          source: new URLSearchParams(window.location.search).get('utm_source'),
          medium: 'lead_magnet',
          campaign: type
        }
      });

      // Store profile
      await LeadQualificationService.storeProspectProfile(profile);

      // Record lead magnet download in Supabase
      await SupabaseProspectService.recordLeadMagnetDownload(
        profile.id,
        type,
        // Get IP address from request headers in production
        undefined,
        typeof window !== 'undefined' ? navigator.userAgent : undefined
      );

      // Trigger lead magnet email sequence
      await EmailAutomationService.triggerLeadMagnetSequence(
        profile.id,
        type,
        {
          download_date: new Date().toISOString(),
          user_name: name,
          company: company || '',
          source: source
        }
      );

      // Track conversion
      ConversionTrackingService.trackLead(
        profile.id,
        profile.leadScore + 10, // Bonus points for lead magnet download
        source,
        {
          lead_magnet_type: type,
          download_completed: true
        }
      );

      // Generate and download PDF
      const pdf = generatePDF(type, name);
      pdf.save(`${getFileName(type)}.pdf`);

      setHasDownloaded(true);
      setIsCollecting(false);

    } catch (error) {
      console.error('Error processing download:', error);
      alert('Sorry, there was an error processing your download. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const generatePDF = (magnetType: string, userName: string) => {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 20;

    // Set fonts and colors
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(20);

    // Add header
    pdf.setTextColor(79, 70, 229); // Indigo
    pdf.text('Lorenzo Daughtry-Chambers', margin, 30);
    pdf.setFontSize(12);
    pdf.setTextColor(100, 100, 100);
    pdf.text('Divine Strategy • Global Impact • Kingdom Economics', margin, 40);

    // Add personalization
    pdf.setFontSize(14);
    pdf.setTextColor(0, 0, 0);
    pdf.text(`Prepared for: ${userName}`, margin, 60);

    // Add title
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(18);
    pdf.setTextColor(79, 70, 229);
    const titleText = getResourceTitle(magnetType);
    pdf.text(titleText, margin, 80);

    // Add content based on type
    let yPosition = 100;
    const content = getResourceContent(magnetType);

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(11);
    pdf.setTextColor(0, 0, 0);

    content.sections.forEach((section) => {
      // Section header
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(14);
      pdf.setTextColor(79, 70, 229);
      pdf.text(section.title, margin, yPosition);
      yPosition += 10;

      // Section content
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(11);
      pdf.setTextColor(0, 0, 0);

      section.items.forEach((item) => {
        const lines = pdf.splitTextToSize(`• ${item}`, pageWidth - 2 * margin);
        pdf.text(lines, margin + 5, yPosition);
        yPosition += lines.length * 5 + 3;

        // Add new page if needed
        if (yPosition > 250) {
          pdf.addPage();
          yPosition = 30;
        }
      });

      yPosition += 10;
    });

    // Add footer with contact info
    if (yPosition > 220) {
      pdf.addPage();
      yPosition = 30;
    }

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(12);
    pdf.setTextColor(79, 70, 229);
    pdf.text('Next Steps', margin, yPosition);
    yPosition += 15;

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    pdf.setTextColor(0, 0, 0);
    const nextSteps = [
      'Schedule a strategic consultation: https://calendly.com/lorenzo-theglobalenterprise',
      'Email: lorenzo@lorenzodaughtrychambers.com',
      'Website: https://lorenzodaughtrychambers.com',
      'AI Platform: https://lorenzodaughtrychambers.com/catalyst'
    ];

    nextSteps.forEach((step) => {
      pdf.text(step, margin, yPosition);
      yPosition += 12;
    });

    return pdf;
  };

  const getResourceTitle = (type: string): string => {
    const titles = {
      'ai_readiness_checklist': 'Enterprise AI Readiness Checklist',
      'divine_strategy_guide': 'Divine Strategy Implementation Guide',
      'kingdom_economics_framework': 'Kingdom Economics Framework',
      'enterprise_transformation_blueprint': 'Enterprise Transformation Blueprint'
    };
    return titles[type as keyof typeof titles] || 'Strategic Resource Guide';
  };

  const getFileName = (type: string): string => {
    const filenames = {
      'ai_readiness_checklist': 'AI-Readiness-Checklist',
      'divine_strategy_guide': 'Divine-Strategy-Guide',
      'kingdom_economics_framework': 'Kingdom-Economics-Framework',
      'enterprise_transformation_blueprint': 'Enterprise-Transformation-Blueprint'
    };
    return filenames[type as keyof typeof filenames] || 'strategic-resource';
  };

  const getResourceContent = (type: string) => {
    const content = {
      'ai_readiness_checklist': {
        sections: [
          {
            title: 'Leadership & Vision Assessment',
            items: [
              'Executive team has clear understanding of AI capabilities and limitations',
              'Strategic vision includes specific AI integration goals',
              'Budget allocation for AI initiatives is defined and approved',
              'Change management capabilities are in place for technology adoption'
            ]
          },
          {
            title: 'Data Infrastructure Evaluation',
            items: [
              'Data systems are well-integrated with accessible APIs',
              'Data quality processes ensure clean, consistent information',
              'Security protocols meet industry standards for AI implementation',
              'Scalable cloud infrastructure supports AI workloads'
            ]
          },
          {
            title: 'Process Documentation & Workflow',
            items: [
              'Key business processes are documented with clear workflows',
              'Performance metrics and KPIs are established and tracked',
              'Standard operating procedures exist for critical functions',
              'Process optimization opportunities are identified and prioritized'
            ]
          },
          {
            title: 'Team Readiness & Skills',
            items: [
              'Technical team has basic understanding of AI/ML concepts',
              'Training programs are planned for AI tool adoption',
              'Cross-functional collaboration structures are established',
              'External partnership strategies for AI expertise are defined'
            ]
          }
        ]
      },
      'divine_strategy_guide': {
        sections: [
          {
            title: 'Receiving Divine Strategy',
            items: [
              'Develop consistent prayer and listening practices for strategic guidance',
              'Create space for prophetic insight through meditation and reflection',
              'Establish accountability partnerships for discernment and confirmation',
              'Document received insights and track their implementation progress'
            ]
          },
          {
            title: 'Strategic Implementation Framework',
            items: [
              'Break divine insights into actionable, measurable steps',
              'Align spiritual vision with practical business frameworks',
              'Create timeline and milestones for systematic implementation',
              'Integrate kingdom principles with proven strategic methodologies'
            ]
          },
          {
            title: 'Leadership Integration',
            items: [
              'Develop spiritual intelligence alongside strategic competency',
              'Balance prophetic sensitivity with analytical decision-making',
              'Create systems for ongoing spiritual and strategic evaluation',
              'Build teams that can execute both spiritual and practical aspects'
            ]
          },
          {
            title: 'Measuring Kingdom Impact',
            items: [
              'Establish metrics that capture both spiritual and business outcomes',
              'Track transformation in people, processes, and performance',
              'Create feedback loops for continuous strategic refinement',
              'Document testimonies and case studies of divine breakthrough'
            ]
          }
        ]
      },
      'kingdom_economics_framework': {
        sections: [
          {
            title: 'Kingdom Business Principles',
            items: [
              'Profit with purpose: Generate sustainable returns while advancing kingdom values',
              'Stewardship mindset: Manage resources as God\'s provision for greater impact',
              'People-first approach: Prioritize human flourishing alongside financial performance',
              'Generational thinking: Build businesses that create lasting positive change'
            ]
          },
          {
            title: 'The Perpetual Engine Model',
            items: [
              'Dual-arm structure: Combine 501(c)(3) impact programs with for-profit ventures',
              'Capital flow design: For-profit returns fund nonprofit mission perpetually',
              'Mission alignment: Ensure both arms advance the same kingdom objectives',
              'Scalable impact: Design for growth that multiplies both profit and purpose'
            ]
          },
          {
            title: 'Implementation Strategy',
            items: [
              'Start with mission clarity: Define the kingdom problem you\'re solving',
              'Develop sustainable business models: Ensure long-term viability and growth',
              'Create measurement systems: Track both financial and spiritual ROI',
              'Build strategic partnerships: Align with others advancing kingdom economics'
            ]
          },
          {
            title: 'Global Impact Scaling',
            items: [
              'Design for replication: Create models that can be adapted across contexts',
              'Develop local partnerships: Work with indigenous leaders and organizations',
              'Leverage technology: Use digital platforms to scale impact efficiently',
              'Measure transformation: Track community and economic development outcomes'
            ]
          }
        ]
      },
      'enterprise_transformation_blueprint': {
        sections: [
          {
            title: 'Assessment & Vision Development',
            items: [
              'Conduct comprehensive organizational assessment across all dimensions',
              'Engage stakeholders in vision creation and strategic alignment process',
              'Identify transformation opportunities and potential resistance points',
              'Develop clear success metrics and transformation timeline'
            ]
          },
          {
            title: 'Strategic Implementation Planning',
            items: [
              'Create phased transformation roadmap with clear milestones',
              'Align technology, process, and people changes for maximum impact',
              'Design change management strategy for organizational adoption',
              'Establish governance structure for transformation oversight'
            ]
          },
          {
            title: 'Execution & Optimization',
            items: [
              'Implement pilot programs to test and refine transformation approach',
              'Scale successful initiatives across the organization systematically',
              'Monitor progress and adjust strategy based on results and feedback',
              'Build continuous improvement capabilities for ongoing transformation'
            ]
          },
          {
            title: 'Sustainability & Growth',
            items: [
              'Embed transformation capabilities into organizational culture',
              'Develop internal expertise to sustain and advance changes',
              'Create feedback loops for continuous strategic refinement',
              'Plan for future transformation cycles and innovation adoption'
            ]
          }
        ]
      }
    };

    return content[type as keyof typeof content] || content['ai_readiness_checklist'];
  };

  if (hasDownloaded) {
    return (
      <div className={`bg-emerald-800/20 border border-emerald-600/30 rounded-2xl p-6 ${className}`}>
        <div className="text-center">
          <div className="text-emerald-400 text-4xl mb-4">✓</div>
          <h3 className="text-xl font-bold text-white mb-2">Download Complete!</h3>
          <p className="text-slate-300 mb-4">Your {title.toLowerCase()} has been downloaded successfully.</p>
          <div className="space-y-3">
            <button
              onClick={() => setHasDownloaded(false)}
              className="w-full py-3 px-6 bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600/50 text-white rounded-xl transition-all"
            >
              Download Again
            </button>
            <a
              href="https://calendly.com/lorenzo-theglobalenterprise/discovery-call"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold rounded-xl transition-all text-center"
            >
              Schedule Strategic Session →
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (isCollecting) {
    return (
      <div className={`bg-slate-800/30 backdrop-blur-xl border border-slate-700/30 rounded-2xl p-6 ${className}`}>
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-white mb-2">Get Your Free {title}</h3>
          <p className="text-slate-300">{description}</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Full Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:border-purple-500 focus:outline-none"
              placeholder="Your full name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Email Address *</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:border-purple-500 focus:outline-none"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Company/Organization</label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:border-purple-500 focus:outline-none"
              placeholder="Your organization (optional)"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setIsCollecting(false)}
              className="flex-1 py-3 px-6 bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600/50 text-white rounded-xl transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleDownload}
              disabled={isDownloading || !email || !name}
              className="flex-1 py-3 px-6 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
            >
              {isDownloading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Generating...
                </>
              ) : (
                'Download PDF →'
              )}
            </button>
          </div>
        </div>

        <div className="mt-4 text-xs text-slate-400 text-center">
          By downloading, you agree to receive strategic insights and updates from Lorenzo Daughtry-Chambers.
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-slate-800/30 backdrop-blur-xl border border-slate-700/30 rounded-2xl p-6 hover:border-slate-600/50 transition-all duration-300 ${className}`}>
      <div className="text-center">
        <div className="text-4xl mb-4">📄</div>
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-slate-300 mb-6">{description}</p>
        <button
          onClick={() => setIsCollecting(true)}
          className="w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
        >
          Get Free Download →
        </button>
        <div className="mt-3 text-xs text-slate-400">
          Instant PDF download • No spam, just strategic value
        </div>
      </div>
    </div>
  );
}