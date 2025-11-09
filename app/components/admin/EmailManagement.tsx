'use client';

import { useState, useEffect } from 'react';

interface NewsletterSignup {
  id: string;
  email: string;
  source: string;
  lead_magnet: string | null;
  status: string;
  created_at: string;
  metadata: any;
}

interface AIAssessment {
  id: string;
  email: string;
  name: string;
  company: string | null;
  overall_score: number;
  scores: any;
  created_at: string;
}

interface EmailCampaign {
  id: string;
  name: string;
  subject: string;
  status: 'draft' | 'scheduled' | 'sent';
  recipients_count: number;
  sent_count: number;
  open_rate: number;
  click_rate: number;
  created_at: string;
  scheduled_for: string | null;
}

export default function EmailManagement() {
  const [activeTab, setActiveTab] = useState<'signups' | 'assessments' | 'campaigns'>('signups');
  const [signups, setSignups] = useState<NewsletterSignup[]>([]);
  const [assessments, setAssessments] = useState<AIAssessment[]>([]);
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [selectedSignups, setSelectedSignups] = useState<string[]>([]);

  // Campaign form state
  const [campaignName, setCampaignName] = useState('');
  const [campaignSubject, setCampaignSubject] = useState('');
  const [campaignBody, setCampaignBody] = useState('');

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'signups') {
        const response = await fetch('/api/admin/newsletter-signups');
        const data = await response.json();
        setSignups(data.signups || []);
      } else if (activeTab === 'assessments') {
        const response = await fetch('/api/admin/ai-assessments');
        const data = await response.json();
        setAssessments(data.assessments || []);
      } else if (activeTab === 'campaigns') {
        const response = await fetch('/api/admin/email-campaigns');
        const data = await response.json();
        setCampaigns(data.campaigns || []);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendReengagementEmail = async (template: string) => {
    try {
      const response = await fetch('/api/admin/send-campaign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          template,
          recipients: selectedSignups.length > 0 ? selectedSignups : signups.map(s => s.email)
        })
      });

      const data = await response.json();
      alert(`Campaign sent to ${data.sent_count} recipients!`);
      loadData();
    } catch (error) {
      console.error('Error sending campaign:', error);
      alert('Failed to send campaign');
    }
  };

  const sendCustomCampaign = async () => {
    if (!campaignName || !campaignSubject || !campaignBody) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const response = await fetch('/api/admin/send-campaign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: campaignName,
          subject: campaignSubject,
          body: campaignBody,
          recipients: selectedSignups.length > 0 ? selectedSignups : signups.map(s => s.email)
        })
      });

      const data = await response.json();
      alert(`Campaign sent to ${data.sent_count} recipients!`);
      setShowCampaignModal(false);
      setCampaignName('');
      setCampaignSubject('');
      setCampaignBody('');
      loadData();
    } catch (error) {
      console.error('Error sending campaign:', error);
      alert('Failed to send campaign');
    }
  };

  const toggleSignupSelection = (email: string) => {
    if (selectedSignups.includes(email)) {
      setSelectedSignups(selectedSignups.filter(e => e !== email));
    } else {
      setSelectedSignups([...selectedSignups, email]);
    }
  };

  const selectAll = () => {
    if (selectedSignups.length === signups.length) {
      setSelectedSignups([]);
    } else {
      setSelectedSignups(signups.map(s => s.email));
    }
  };

  const getConversionRate = () => {
    if (signups.length === 0) return 0;
    return ((assessments.length / signups.length) * 100).toFixed(1);
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-700/30 rounded-lg p-4">
          <div className="text-slate-400 text-sm mb-1">Total Signups</div>
          <div className="text-2xl font-bold text-white">{signups.length}</div>
          <div className="text-xs text-slate-500 mt-1">Newsletter subscribers</div>
        </div>
        <div className="bg-slate-700/30 rounded-lg p-4">
          <div className="text-slate-400 text-sm mb-1">Assessments</div>
          <div className="text-2xl font-bold text-cyan-400">{assessments.length}</div>
          <div className="text-xs text-slate-500 mt-1">Completed assessments</div>
        </div>
        <div className="bg-slate-700/30 rounded-lg p-4">
          <div className="text-slate-400 text-sm mb-1">Conversion Rate</div>
          <div className="text-2xl font-bold text-purple-400">{getConversionRate()}%</div>
          <div className="text-xs text-slate-500 mt-1">Signup → Assessment</div>
        </div>
        <div className="bg-slate-700/30 rounded-lg p-4">
          <div className="text-slate-400 text-sm mb-1">Avg Score</div>
          <div className="text-2xl font-bold text-emerald-400">
            {assessments.length > 0
              ? Math.round(assessments.reduce((sum, a) => sum + a.overall_score, 0) / assessments.length)
              : 0}%
          </div>
          <div className="text-xs text-slate-500 mt-1">AI readiness</div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-slate-600">
        <button
          onClick={() => setActiveTab('signups')}
          className={`px-4 py-2 font-medium transition-colors border-b-2 ${
            activeTab === 'signups'
              ? 'text-cyan-400 border-cyan-400'
              : 'text-slate-400 border-transparent hover:text-slate-300'
          }`}
        >
          📧 Newsletter Signups ({signups.length})
        </button>
        <button
          onClick={() => setActiveTab('assessments')}
          className={`px-4 py-2 font-medium transition-colors border-b-2 ${
            activeTab === 'assessments'
              ? 'text-cyan-400 border-cyan-400'
              : 'text-slate-400 border-transparent hover:text-slate-300'
          }`}
        >
          🎯 Assessments ({assessments.length})
        </button>
        <button
          onClick={() => setActiveTab('campaigns')}
          className={`px-4 py-2 font-medium transition-colors border-b-2 ${
            activeTab === 'campaigns'
              ? 'text-cyan-400 border-cyan-400'
              : 'text-slate-400 border-transparent hover:text-slate-300'
          }`}
        >
          📨 Campaigns
        </button>
      </div>

      {/* Newsletter Signups Tab */}
      {activeTab === 'signups' && (
        <div className="space-y-4">
          {/* Actions */}
          <div className="flex gap-3 items-center">
            <button
              onClick={selectAll}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm transition-colors"
            >
              {selectedSignups.length === signups.length ? 'Deselect All' : 'Select All'}
            </button>
            <span className="text-sm text-slate-400">
              {selectedSignups.length > 0 ? `${selectedSignups.length} selected` : 'No selections'}
            </span>
            <div className="flex-1"></div>
            <button
              onClick={() => setShowCampaignModal(true)}
              className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white rounded-lg text-sm font-medium transition-all"
            >
              📨 Create Campaign
            </button>
            <button
              onClick={() => sendReengagementEmail('assessment_live')}
              className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-lg text-sm font-medium transition-all"
            >
              🚀 Send "Assessment is Live"
            </button>
          </div>

          {/* Signups Table */}
          <div className="bg-slate-800/50 rounded-lg border border-slate-700 overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-700/50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-300">Select</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-300">Email</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-300">Source</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-300">Lead Magnet</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-300">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-300">Signed Up</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                      Loading...
                    </td>
                  </tr>
                ) : signups.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                      No signups yet
                    </td>
                  </tr>
                ) : (
                  signups.map(signup => (
                    <tr key={signup.id} className="hover:bg-slate-700/20">
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedSignups.includes(signup.email)}
                          onChange={() => toggleSignupSelection(signup.email)}
                          className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-cyan-500 focus:ring-cyan-500"
                        />
                      </td>
                      <td className="px-4 py-3 text-sm text-white">{signup.email}</td>
                      <td className="px-4 py-3 text-sm text-slate-400">{signup.source}</td>
                      <td className="px-4 py-3 text-sm text-slate-400">{signup.lead_magnet || '-'}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs ${
                          signup.status === 'active'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {signup.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-400">
                        {new Date(signup.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Assessments Tab */}
      {activeTab === 'assessments' && (
        <div className="bg-slate-800/50 rounded-lg border border-slate-700 overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-700/50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-300">Name</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-300">Email</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-300">Company</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-300">Score</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-300">Completed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-400">
                    Loading...
                  </td>
                </tr>
              ) : assessments.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-400">
                    No assessments completed yet
                  </td>
                </tr>
              ) : (
                assessments.map(assessment => (
                  <tr key={assessment.id} className="hover:bg-slate-700/20">
                    <td className="px-4 py-3 text-sm text-white">{assessment.name}</td>
                    <td className="px-4 py-3 text-sm text-slate-400">{assessment.email}</td>
                    <td className="px-4 py-3 text-sm text-slate-400">{assessment.company || '-'}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                        assessment.overall_score >= 80 ? 'bg-emerald-500/20 text-emerald-400' :
                        assessment.overall_score >= 60 ? 'bg-blue-500/20 text-blue-400' :
                        assessment.overall_score >= 40 ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {assessment.overall_score}%
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-400">
                      {new Date(assessment.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Campaigns Tab */}
      {activeTab === 'campaigns' && (
        <div className="space-y-4">
          <div className="text-center py-12 bg-slate-800/50 rounded-lg border border-slate-700">
            <div className="text-4xl mb-3">📨</div>
            <h3 className="text-lg font-semibold text-white mb-2">Email Campaign Tracking</h3>
            <p className="text-slate-400 mb-6">Campaign tracking coming soon. For now, check your Resend dashboard.</p>
            <a
              href="https://resend.com/emails"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white rounded-lg font-medium transition-all"
            >
              View Resend Dashboard →
            </a>
          </div>
        </div>
      )}

      {/* Custom Campaign Modal */}
      {showCampaignModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">Create Email Campaign</h3>
              <button
                onClick={() => setShowCampaignModal(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-2">Campaign Name</label>
                <input
                  type="text"
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                  placeholder="e.g., Re-engagement Campaign #1"
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-2">Email Subject</label>
                <input
                  type="text"
                  value={campaignSubject}
                  onChange={(e) => setCampaignSubject(e.target.value)}
                  placeholder="e.g., The AI Assessment You Requested is Now Live!"
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-2">Email Body (HTML supported)</label>
                <textarea
                  value={campaignBody}
                  onChange={(e) => setCampaignBody(e.target.value)}
                  placeholder="Enter your email content here..."
                  rows={12}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 font-mono text-sm"
                />
              </div>

              <div className="bg-slate-700/30 rounded-lg p-4">
                <div className="text-sm text-slate-400 mb-2">Recipients:</div>
                <div className="text-white font-medium">
                  {selectedSignups.length > 0
                    ? `${selectedSignups.length} selected recipients`
                    : `All ${signups.length} signups`}
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowCampaignModal(false)}
                  className="flex-1 px-4 py-3 border border-slate-600 text-slate-300 rounded-xl hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={sendCustomCampaign}
                  disabled={!campaignName || !campaignSubject || !campaignBody}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Send Campaign
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
