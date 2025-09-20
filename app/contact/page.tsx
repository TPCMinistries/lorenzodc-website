"use client";
import { useState, useEffect } from "react";
import { ConversionTrackingService } from "../lib/services/conversion-tracking";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [message, setMessage] = useState("");
  const [urgency, setUrgency] = useState("");
  const [budget, setBudget] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<string>("");

  // Track page view
  useEffect(() => {
    ConversionTrackingService.trackPageView('/contact', undefined, {
      page_type: 'contact',
      contact_type: 'enterprise_inquiry'
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          message: `Company: ${company}\nRole: ${role}\nUrgency: ${urgency}\nBudget: ${budget}\n\nMessage: ${message}`
        })
      });

      if (res.ok) {
        setSubmitStatus("Thank you! We'll reach out within 24 hours to discuss your AI transformation needs.");

        // Track successful contact form submission
        ConversionTrackingService.trackConversion('lead', {
          event: 'contact_form_submission',
          content_type: 'contact',
          content_category: 'enterprise_inquiry',
          metadata: {
            company,
            role,
            urgency,
            budget_range: budget,
            has_message: !!message.trim()
          }
        });

        // Clear form
        setName("");
        setEmail("");
        setCompany("");
        setRole("");
        setMessage("");
        setUrgency("");
        setBudget("");
      } else {
        setSubmitStatus("Something went wrong. Please try again or email us directly at info@catalyst-ai.com");
      }
    } catch (error) {
      setSubmitStatus("Something went wrong. Please try again or email us directly at info@catalyst-ai.com");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -right-4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 -left-4 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-16">
              <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white via-blue-100 to-cyan-200 bg-clip-text text-transparent leading-tight mb-6">
                Let's Accelerate Your AI Transformation
              </h1>
              <p className="text-2xl text-slate-300 max-w-3xl mx-auto">
                Ready to transform your organization with AI? Our team of experts is here to guide your journey from strategy to implementation.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
              {/* Left: Contact Form */}
              <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8">
                <h2 className="text-3xl font-bold text-white mb-8">Start Your AI Journey</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-300 text-sm font-medium mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
                        placeholder="John Smith"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 text-sm font-medium mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
                        placeholder="john@company.com"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-300 text-sm font-medium mb-2">
                        Company *
                      </label>
                      <input
                        type="text"
                        required
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
                        placeholder="Acme Corp"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 text-sm font-medium mb-2">
                        Your Role *
                      </label>
                      <select
                        required
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
                      >
                        <option value="">Select your role</option>
                        <option value="CEO/President">CEO/President</option>
                        <option value="CTO/Chief Technology Officer">CTO/Chief Technology Officer</option>
                        <option value="VP/Director of Operations">VP/Director of Operations</option>
                        <option value="VP/Director of Technology">VP/Director of Technology</option>
                        <option value="VP/Director of Strategy">VP/Director of Strategy</option>
                        <option value="Department Head">Department Head</option>
                        <option value="Other Executive">Other Executive</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-300 text-sm font-medium mb-2">
                        Project Urgency
                      </label>
                      <select
                        value={urgency}
                        onChange={(e) => setUrgency(e.target.value)}
                        className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
                      >
                        <option value="">Select timeline</option>
                        <option value="Immediate (within 30 days)">Immediate (within 30 days)</option>
                        <option value="Short-term (1-3 months)">Short-term (1-3 months)</option>
                        <option value="Medium-term (3-6 months)">Medium-term (3-6 months)</option>
                        <option value="Long-term (6+ months)">Long-term (6+ months)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-300 text-sm font-medium mb-2">
                        Budget Range
                      </label>
                      <select
                        value={budget}
                        onChange={(e) => setBudget(e.target.value)}
                        className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
                      >
                        <option value="">Select budget range</option>
                        <option value="Under $25K">Under $25K</option>
                        <option value="$25K - $50K">$25K - $50K</option>
                        <option value="$50K - $100K">$50K - $100K</option>
                        <option value="$100K - $250K">$100K - $250K</option>
                        <option value="$250K+">$250K+</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 text-sm font-medium mb-2">
                      How can we help you?
                    </label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={5}
                      className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors resize-none"
                      placeholder="Tell us about your AI goals, current challenges, or specific needs..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:from-slate-600 disabled:to-slate-700 text-white font-semibold rounded-2xl transition-all duration-200 flex items-center justify-center gap-3"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <span>🚀</span>
                        Send Message
                      </>
                    )}
                  </button>

                  {submitStatus && (
                    <div className={`p-4 rounded-xl ${submitStatus.includes('Thank you') ? 'bg-green-500/10 border border-green-500/30' : 'bg-red-500/10 border border-red-500/30'}`}>
                      <p className={`${submitStatus.includes('Thank you') ? 'text-green-400' : 'text-red-400'}`}>
                        {submitStatus}
                      </p>
                    </div>
                  )}
                </form>
              </div>

              {/* Right: Contact Info & CTAs */}
              <div className="space-y-8">
                {/* Quick Contact Options */}
                <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8">
                  <h3 className="text-2xl font-bold text-white mb-6">Prefer to Schedule a Call?</h3>

                  <div className="space-y-4">
                    <button
                      onClick={() => {
                        ConversionTrackingService.trackConversion('lead', {
                          event: 'discovery_call_from_contact',
                          content_type: 'consultation',
                          content_category: 'direct_booking'
                        });
                        window.open('https://calendly.com/lorenzo-theglobalenterprise/discovery-call?utm_source=contact_page', '_blank');
                      }}
                      className="w-full px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-400 hover:to-pink-500 text-white font-semibold rounded-2xl transition-all duration-200 flex items-center justify-center gap-3"
                    >
                      <span>📅</span>
                      Book Discovery Call (30 min)
                    </button>

                    <div className="text-center">
                      <p className="text-slate-400 text-sm">
                        Get immediate answers to your AI questions and explore how we can help accelerate your transformation.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Response Time */}
                <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-3xl p-8">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-3xl flex items-center justify-center text-3xl mx-auto mb-4">
                      ⚡
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Fast Response Guarantee</h3>
                    <p className="text-slate-300">
                      We respond to all enterprise inquiries within <span className="text-cyan-400 font-semibold">24 hours</span>.
                      For urgent matters, we'll reach out within <span className="text-cyan-400 font-semibold">4 hours</span>.
                    </p>
                  </div>
                </div>

                {/* Direct Contact */}
                <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8">
                  <h3 className="text-xl font-bold text-white mb-4">Direct Contact</h3>
                  <div className="space-y-3 text-slate-300">
                    <div className="flex items-center gap-3">
                      <span>📧</span>
                      <a href="mailto:info@catalyst-ai.com" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                        info@catalyst-ai.com
                      </a>
                    </div>
                    <div className="flex items-center gap-3">
                      <span>💼</span>
                      <span>Enterprise partnerships available</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span>🌍</span>
                      <span>Global consulting services</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}