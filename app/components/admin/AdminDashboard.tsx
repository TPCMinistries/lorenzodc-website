'use client';

import { useState, useEffect } from 'react';
import { AdminService, AnalyticsSnapshot, UserAnalytics, SubscriptionAnalytics, FeatureUsageAnalytics } from '../../lib/services/admin-service';
import AnalyticsOverview from './AnalyticsOverview';
import UserManagement from './UserManagement';
import FeatureFlags from './FeatureFlags';
import SystemHealth from './SystemHealth';
import ActivityLogs from './ActivityLogs';
import EmailManagement from './EmailManagement';

interface AdminDashboardProps {
  className?: string;
}

type TabType = 'overview' | 'users' | 'emails' | 'features' | 'system' | 'logs';

export default function AdminDashboard({ className = '' }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  // Analytics data
  const [latestAnalytics, setLatestAnalytics] = useState<AnalyticsSnapshot | null>(null);
  const [userAnalytics, setUserAnalytics] = useState<UserAnalytics[]>([]);
  const [subscriptionAnalytics, setSubscriptionAnalytics] = useState<SubscriptionAnalytics[]>([]);
  const [featureAnalytics, setFeatureAnalytics] = useState<FeatureUsageAnalytics[]>([]);

  useEffect(() => {
    checkAdminAccess();
  }, []);

  useEffect(() => {
    if (isAdmin && activeTab === 'overview') {
      loadAnalyticsData();
    }
  }, [isAdmin, activeTab]);

  const checkAdminAccess = async () => {
    setLoading(true);
    try {
      const adminStatus = await AdminService.isAdmin();
      setIsAdmin(adminStatus);

      if (adminStatus) {
        await AdminService.logActivity(
          'admin_dashboard_accessed',
          'dashboard',
          undefined,
          'Admin dashboard accessed'
        );
      }
    } catch (error) {
      console.error('Error checking admin access:', error);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  const loadAnalyticsData = async () => {
    try {
      const [latest, userStats, subStats, featureStats] = await Promise.all([
        AdminService.getLatestAnalytics(),
        AdminService.getUserAnalytics(),
        AdminService.getSubscriptionAnalytics(),
        AdminService.getFeatureUsageAnalytics()
      ]);

      setLatestAnalytics(latest);
      setUserAnalytics(userStats);
      setSubscriptionAnalytics(subStats);
      setFeatureAnalytics(featureStats);
    } catch (error) {
      console.error('Error loading analytics data:', error);
    }
  };

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    AdminService.logActivity(
      'admin_tab_changed',
      'dashboard',
      tab,
      `Changed to ${tab} tab`
    );
  };

  if (loading) {
    return (
      <div className={`bg-slate-800 rounded-xl border border-slate-600 p-6 ${className}`}>
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-3 text-slate-400">Checking admin access...</span>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className={`bg-slate-800 rounded-xl border border-red-500/30 p-6 ${className}`}>
        <div className="text-center">
          <div className="text-6xl mb-4">🚫</div>
          <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
          <p className="text-slate-400">You don't have permission to access the admin dashboard.</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'users', label: 'Users', icon: '👥' },
    { id: 'emails', label: 'Email Marketing', icon: '📧' },
    { id: 'features', label: 'Features', icon: '🎛️' },
    { id: 'system', label: 'System', icon: '🔧' },
    { id: 'logs', label: 'Logs', icon: '📋' }
  ] as const;

  return (
    <div className={`bg-slate-800 rounded-xl border border-slate-600 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-slate-600">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">🛡️ Admin Dashboard</h1>
          <p className="text-slate-400">Platform management and analytics</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => AdminService.createDailySnapshot()}
            className="px-4 py-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors text-sm"
          >
            Refresh Analytics
          </button>
          <div className="text-sm text-slate-400">
            Admin Panel v1.0
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-slate-600">
        <div className="flex overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'text-blue-400 border-blue-400'
                  : 'text-slate-400 border-transparent hover:text-slate-300'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'overview' && (
          <AnalyticsOverview
            latestAnalytics={latestAnalytics}
            userAnalytics={userAnalytics}
            subscriptionAnalytics={subscriptionAnalytics}
            featureAnalytics={featureAnalytics}
          />
        )}

        {activeTab === 'users' && (
          <UserManagement />
        )}

        {activeTab === 'emails' && (
          <EmailManagement />
        )}

        {activeTab === 'features' && (
          <FeatureFlags />
        )}

        {activeTab === 'system' && (
          <SystemHealth />
        )}

        {activeTab === 'logs' && (
          <ActivityLogs />
        )}
      </div>
    </div>
  );
}