'use client';

import { useEffect, useState } from 'react';

interface Lead {
  id: string;
  email: string;
  name: string;
  company?: string;
  lead_score: number;
  tier: string;
  status: string;
  category: string;
  assessment_data?: any;
  last_engagement_at: string;
  created_at: string;
}

interface LeadStats {
  total: number;
  hot: number;
  warm: number;
  cold: number;
  avgScore: number;
}

export default function LeadPipeline() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [stats, setStats] = useState<LeadStats>({
    total: 0,
    hot: 0,
    warm: 0,
    cold: 0,
    avgScore: 0
  });
  const [filter, setFilter] = useState<'all' | 'hot' | 'warm' | 'cold'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const response = await fetch('/api/admin/leads');
      const data = await response.json();

      if (data.leads) {
        setLeads(data.leads);
        calculateStats(data.leads);
      }
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (allLeads: Lead[]) => {
    const total = allLeads.length;
    const hot = allLeads.filter(l => l.lead_score >= 70).length;
    const warm = allLeads.filter(l => l.lead_score >= 40 && l.lead_score < 70).length;
    const cold = allLeads.filter(l => l.lead_score < 40).length;
    const avgScore = total > 0
      ? Math.round(allLeads.reduce((sum, l) => sum + l.lead_score, 0) / total)
      : 0;

    setStats({ total, hot, warm, cold, avgScore });
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-red-500';
    if (score >= 40) return 'text-yellow-500';
    return 'text-blue-500';
  };

  const getScoreBg = (score: number) => {
    if (score >= 70) return 'bg-red-100';
    if (score >= 40) return 'bg-yellow-100';
    return 'bg-blue-100';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 70) return '🔥 Hot';
    if (score >= 40) return '📈 Warm';
    return '❄️ Cold';
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'tier_1': return 'text-purple-600 bg-purple-100';
      case 'tier_2': return 'text-blue-600 bg-blue-100';
      case 'tier_3': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredLeads = filter === 'all'
    ? leads
    : leads.filter(l => {
        if (filter === 'hot') return l.lead_score >= 70;
        if (filter === 'warm') return l.lead_score >= 40 && l.lead_score < 70;
        return l.lead_score < 40;
      });

  const sortedLeads = [...filteredLeads].sort((a, b) => b.lead_score - a.lead_score);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-400">Loading leads...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <div className="text-slate-400 text-sm">Total Leads</div>
          <div className="text-3xl font-bold text-white mt-1">{stats.total}</div>
        </div>

        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <div className="text-slate-400 text-sm">🔥 Hot Leads</div>
          <div className="text-3xl font-bold text-red-400 mt-1">{stats.hot}</div>
          <div className="text-xs text-slate-500 mt-1">Score ≥ 70</div>
        </div>

        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <div className="text-slate-400 text-sm">📈 Warm Leads</div>
          <div className="text-3xl font-bold text-yellow-400 mt-1">{stats.warm}</div>
          <div className="text-xs text-slate-500 mt-1">Score 40-69</div>
        </div>

        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <div className="text-slate-400 text-sm">❄️ Cold Leads</div>
          <div className="text-3xl font-bold text-blue-400 mt-1">{stats.cold}</div>
          <div className="text-xs text-slate-500 mt-1">Score &lt; 40</div>
        </div>

        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <div className="text-slate-400 text-sm">Avg Score</div>
          <div className="text-3xl font-bold text-cyan-400 mt-1">{stats.avgScore}</div>
          <div className="text-xs text-slate-500 mt-1">Out of 100</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            filter === 'all'
              ? 'bg-cyan-500 text-white'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          All ({stats.total})
        </button>
        <button
          onClick={() => setFilter('hot')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            filter === 'hot'
              ? 'bg-red-500 text-white'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          🔥 Hot ({stats.hot})
        </button>
        <button
          onClick={() => setFilter('warm')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            filter === 'warm'
              ? 'bg-yellow-500 text-white'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          📈 Warm ({stats.warm})
        </button>
        <button
          onClick={() => setFilter('cold')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            filter === 'cold'
              ? 'bg-blue-500 text-white'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          ❄️ Cold ({stats.cold})
        </button>
      </div>

      {/* Leads Table */}
      <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-900">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Score</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Contact</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Company</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Tier</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Last Activity</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {sortedLeads.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                    No leads found
                  </td>
                </tr>
              ) : (
                sortedLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-700/50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className={`text-2xl font-bold ${getScoreColor(lead.lead_score)}`}>
                          {lead.lead_score}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded ${getScoreBg(lead.lead_score)} ${getScoreColor(lead.lead_score)}`}>
                          {getScoreLabel(lead.lead_score)}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-white">{lead.name || 'Unknown'}</div>
                      <div className="text-sm text-slate-400">{lead.email}</div>
                    </td>
                    <td className="px-4 py-3 text-slate-300">
                      {lead.company || '-'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getTierColor(lead.tier)}`}>
                        {lead.tier.replace('tier_', 'T')}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 bg-slate-700 text-slate-300 rounded text-xs">
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-400 text-sm">
                      {new Date(lead.last_engagement_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => window.open(`mailto:${lead.email}`, '_blank')}
                        className="text-cyan-400 hover:text-cyan-300 text-sm font-medium"
                      >
                        Email →
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
