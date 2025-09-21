'use client';

import { AnalyticsSnapshot, UserAnalytics, SubscriptionAnalytics, FeatureUsageAnalytics, AdminService } from '../../lib/services/admin-service';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';

interface AnalyticsOverviewProps {
  latestAnalytics: AnalyticsSnapshot | null;
  userAnalytics: UserAnalytics[];
  subscriptionAnalytics: SubscriptionAnalytics[];
  featureAnalytics: FeatureUsageAnalytics[];
}

export default function AnalyticsOverview({
  latestAnalytics,
  userAnalytics,
  subscriptionAnalytics,
  featureAnalytics
}: AnalyticsOverviewProps) {

  const COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444'];

  if (!latestAnalytics) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📊</div>
        <h3 className="text-xl font-bold text-white mb-2">No Analytics Data</h3>
        <p className="text-slate-400 mb-4">Analytics snapshots are not available yet.</p>
        <button
          onClick={() => AdminService.createDailySnapshot()}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Create First Snapshot
        </button>
      </div>
    );
  }

  const totalRevenue = subscriptionAnalytics.reduce((sum, tier) => sum + tier.monthly_revenue, 0);
  const totalSubscribers = subscriptionAnalytics.reduce((sum, tier) => sum + tier.subscriber_count, 0);

  return (
    <div className="space-y-8">
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-700/30 border border-slate-600/50 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Total Users</p>
              <p className="text-2xl font-bold text-white">{AdminService.formatNumber(latestAnalytics.total_users)}</p>
            </div>
            <div className="text-3xl">👥</div>
          </div>
          <div className="mt-2 text-sm text-green-400">
            +{AdminService.formatNumber(latestAnalytics.new_signups_today)} today
          </div>
        </div>

        <div className="bg-slate-700/30 border border-slate-600/50 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Active Users (24h)</p>
              <p className="text-2xl font-bold text-white">{AdminService.formatNumber(latestAnalytics.active_users_24h)}</p>
            </div>
            <div className="text-3xl">🔥</div>
          </div>
          <div className="mt-2 text-sm text-slate-400">
            {AdminService.formatNumber(latestAnalytics.active_users_7d)} this week
          </div>
        </div>

        <div className="bg-slate-700/30 border border-slate-600/50 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Monthly Revenue</p>
              <p className="text-2xl font-bold text-white">{AdminService.formatCurrency(totalRevenue)}</p>
            </div>
            <div className="text-3xl">💰</div>
          </div>
          <div className="mt-2 text-sm text-blue-400">
            {totalSubscribers} subscribers
          </div>
        </div>

        <div className="bg-slate-700/30 border border-slate-600/50 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Active Goals</p>
              <p className="text-2xl font-bold text-white">{AdminService.formatNumber(latestAnalytics.active_goals)}</p>
            </div>
            <div className="text-3xl">🎯</div>
          </div>
          <div className="mt-2 text-sm text-purple-400">
            +{AdminService.formatNumber(latestAnalytics.goals_completed_today)} completed today
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* User Growth Chart */}
        <div className="bg-slate-700/30 border border-slate-600/50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">User Growth (30 Days)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={userAnalytics}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  dataKey="date"
                  stroke="#9CA3AF"
                  fontSize={12}
                  tickFormatter={(value) => new Date(value).toLocaleDateString()}
                />
                <YAxis stroke="#9CA3AF" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#F9FAFB'
                  }}
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                />
                <Line type="monotone" dataKey="new_signups" stroke="#3B82F6" strokeWidth={2} name="New Signups" />
                <Line type="monotone" dataKey="active_users" stroke="#10B981" strokeWidth={2} name="Active Users" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Subscription Distribution */}
        <div className="bg-slate-700/30 border border-slate-600/50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Subscription Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'Free', value: latestAnalytics.free_users, color: '#6B7280' },
                    { name: 'Basic', value: latestAnalytics.basic_subscribers, color: '#3B82F6' },
                    { name: 'Plus', value: latestAnalytics.plus_subscribers, color: '#8B5CF6' },
                    { name: 'Enterprise', value: latestAnalytics.enterprise_subscribers, color: '#10B981' }
                  ]}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {[0, 1, 2, 3].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#F9FAFB'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Feature Usage and Revenue Analytics */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Feature Usage */}
        <div className="bg-slate-700/30 border border-slate-600/50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Feature Usage (30 Days)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={featureAnalytics}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="feature_type" stroke="#9CA3AF" fontSize={12} />
                <YAxis stroke="#9CA3AF" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#F9FAFB'
                  }}
                />
                <Bar dataKey="total_usage" fill="#3B82F6" name="Total Usage" />
                <Bar dataKey="unique_users" fill="#8B5CF6" name="Unique Users" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue by Tier */}
        <div className="bg-slate-700/30 border border-slate-600/50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Revenue by Tier</h3>
          <div className="space-y-4">
            {subscriptionAnalytics.map((tier, index) => (
              <div key={tier.tier_id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: COLORS[index] }}
                  />
                  <div>
                    <p className="font-medium text-white capitalize">
                      {tier.tier_id.replace('catalyst_', '').replace('_', ' ')}
                    </p>
                    <p className="text-sm text-slate-400">
                      {tier.subscriber_count} subscribers
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-white">
                    {AdminService.formatCurrency(tier.monthly_revenue)}
                  </p>
                  <p className="text-sm text-slate-400">
                    {AdminService.formatCurrency(tier.avg_customer_value)} avg
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-700/30 border border-slate-600/50 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">💬</span>
            <div>
              <p className="text-slate-400 text-sm">Chat Messages</p>
              <p className="text-lg font-semibold text-white">{AdminService.formatNumber(latestAnalytics.chat_messages_today)}</p>
            </div>
          </div>
          <div className="text-xs text-slate-400">Today</div>
        </div>

        <div className="bg-slate-700/30 border border-slate-600/50 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">🎙️</span>
            <div>
              <p className="text-slate-400 text-sm">Voice Messages</p>
              <p className="text-lg font-semibold text-white">{AdminService.formatNumber(latestAnalytics.voice_messages_today)}</p>
            </div>
          </div>
          <div className="text-xs text-slate-400">Today</div>
        </div>

        <div className="bg-slate-700/30 border border-slate-600/50 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">📄</span>
            <div>
              <p className="text-slate-400 text-sm">Documents</p>
              <p className="text-lg font-semibold text-white">{AdminService.formatNumber(latestAnalytics.documents_uploaded_today)}</p>
            </div>
          </div>
          <div className="text-xs text-slate-400">Today</div>
        </div>

        <div className="bg-slate-700/30 border border-slate-600/50 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">📧</span>
            <div>
              <p className="text-slate-400 text-sm">Email Open Rate</p>
              <p className="text-lg font-semibold text-white">{AdminService.formatPercentage(latestAnalytics.email_open_rate)}</p>
            </div>
          </div>
          <div className="text-xs text-slate-400">{AdminService.formatNumber(latestAnalytics.emails_sent_today)} sent today</div>
        </div>
      </div>

      {/* System Performance */}
      <div className="bg-slate-700/30 border border-slate-600/50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">System Performance</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-white">{AdminService.formatNumber(latestAnalytics.api_calls_today)}</p>
            <p className="text-slate-400 text-sm">API Calls Today</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-white">{latestAnalytics.avg_response_time_ms}ms</p>
            <p className="text-slate-400 text-sm">Avg Response Time</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-white">{AdminService.formatPercentage(latestAnalytics.error_rate)}</p>
            <p className="text-slate-400 text-sm">Error Rate</p>
          </div>
        </div>
      </div>
    </div>
  );
}