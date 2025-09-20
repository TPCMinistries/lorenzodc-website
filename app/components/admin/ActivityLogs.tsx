'use client';

import { useState, useEffect } from 'react';
import { AdminService, ActivityLog } from '../../lib/services/admin-service';

export default function ActivityLogs() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterEntity, setFilterEntity] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('7d');

  useEffect(() => {
    loadLogs();
  }, [filterType, filterEntity, dateFilter]);

  const loadLogs = async () => {
    setLoading(true);
    try {
      const logsData = await AdminService.getActivityLogs({
        action_type: filterType === 'all' ? undefined : filterType,
        entity_type: filterEntity === 'all' ? undefined : filterEntity,
        date_filter: dateFilter
      });
      setLogs(logsData);
    } catch (error) {
      console.error('Error loading activity logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActionIcon = (actionType: string) => {
    const iconMap: Record<string, string> = {
      'user_login': '🔐',
      'user_logout': '🚪',
      'user_created': '👤',
      'user_suspended': '⛔',
      'user_reactivated': '✅',
      'feature_flag_toggled': '🎛️',
      'feature_flag_created': '🆕',
      'admin_dashboard_accessed': '🛡️',
      'admin_tab_changed': '📋',
      'analytics_snapshot_created': '📊',
      'system_health_check': '🔧',
      'goal_created': '🎯',
      'goal_completed': '✅',
      'chat_message_sent': '💬',
      'voice_message_sent': '🎙️',
      'document_uploaded': '📄',
      'subscription_upgraded': '⬆️',
      'subscription_downgraded': '⬇️',
      'payment_processed': '💰',
      'payment_failed': '❌'
    };
    return iconMap[actionType] || '📝';
  };

  const getActionColor = (actionType: string) => {
    if (actionType.includes('created') || actionType.includes('completed') || actionType.includes('upgraded')) {
      return 'text-green-400';
    }
    if (actionType.includes('suspended') || actionType.includes('failed') || actionType.includes('error')) {
      return 'text-red-400';
    }
    if (actionType.includes('warning') || actionType.includes('downgraded')) {
      return 'text-yellow-400';
    }
    return 'text-blue-400';
  };

  const getEntityIcon = (entityType: string) => {
    const iconMap: Record<string, string> = {
      'user': '👤',
      'goal': '🎯',
      'chat': '💬',
      'voice': '🎙️',
      'document': '📄',
      'subscription': '💳',
      'feature_flag': '🎛️',
      'dashboard': '📊',
      'system': '🔧',
      'auth': '🔐'
    };
    return iconMap[entityType] || '📝';
  };

  const filteredLogs = logs.filter(log =>
    searchTerm === '' ||
    log.action_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.entity_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.user_email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const uniqueActionTypes = [...new Set(logs.map(log => log.action_type))].sort();
  const uniqueEntityTypes = [...new Set(logs.map(log => log.entity_type))].sort();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-slate-400">Loading activity logs...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Activity Logs</h2>
            <p className="text-slate-400 mt-1">Monitor platform activity and user actions</p>
          </div>
          <button
            onClick={loadLogs}
            className="px-4 py-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors"
          >
            🔄 Refresh
          </button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Search</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search logs..."
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Action Type</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 focus:outline-none"
            >
              <option value="all">All Actions</option>
              {uniqueActionTypes.map(type => (
                <option key={type} value={type}>
                  {type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Entity Type</label>
            <select
              value={filterEntity}
              onChange={(e) => setFilterEntity(e.target.value)}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 focus:outline-none"
            >
              <option value="all">All Entities</option>
              {uniqueEntityTypes.map(type => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Time Period</label>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 focus:outline-none"
            >
              <option value="1d">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
            </select>
          </div>
        </div>
      </div>

      {/* Activity Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-700/30 border border-slate-600/50 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📊</span>
            <div>
              <p className="text-slate-400 text-sm">Total Actions</p>
              <p className="text-xl font-bold text-white">{AdminService.formatNumber(filteredLogs.length)}</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-700/30 border border-slate-600/50 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">👥</span>
            <div>
              <p className="text-slate-400 text-sm">Active Users</p>
              <p className="text-xl font-bold text-white">
                {new Set(filteredLogs.map(log => log.user_id).filter(Boolean)).size}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-slate-700/30 border border-slate-600/50 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🎯</span>
            <div>
              <p className="text-slate-400 text-sm">Action Types</p>
              <p className="text-xl font-bold text-white">{uniqueActionTypes.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-700/30 border border-slate-600/50 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">⚡</span>
            <div>
              <p className="text-slate-400 text-sm">Last Activity</p>
              <p className="text-sm font-bold text-white">
                {filteredLogs.length > 0
                  ? new Date(filteredLogs[0].created_at).toLocaleTimeString()
                  : 'N/A'
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Log List */}
      {filteredLogs.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📋</div>
          <h3 className="text-xl font-bold text-white mb-2">No Activity Logs</h3>
          <p className="text-slate-400">No activity logs match your current filters.</p>
        </div>
      ) : (
        <div className="bg-slate-700/30 border border-slate-600/50 rounded-xl overflow-hidden">
          <div className="max-h-96 overflow-y-auto">
            {filteredLogs.map((log) => (
              <div key={log.id} className="border-b border-slate-600/30 last:border-b-0 p-4 hover:bg-slate-600/20 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-lg">{getActionIcon(log.action_type)}</span>
                    <span className="text-sm">{getEntityIcon(log.entity_type)}</span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <span className={`font-medium ${getActionColor(log.action_type)}`}>
                            {log.action_type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </span>
                          <span className="text-xs px-2 py-1 bg-slate-600 text-slate-300 rounded">
                            {log.entity_type}
                          </span>
                          {log.entity_id && (
                            <span className="text-xs text-slate-400">
                              ID: {log.entity_id}
                            </span>
                          )}
                        </div>

                        {log.description && (
                          <p className="text-slate-300 text-sm mb-2">{log.description}</p>
                        )}

                        <div className="flex items-center gap-4 text-xs text-slate-400">
                          {log.user_email && (
                            <span>👤 {log.user_email}</span>
                          )}
                          {log.ip_address && (
                            <span>🌐 {log.ip_address}</span>
                          )}
                          {log.user_agent && (
                            <span className="truncate max-w-xs">
                              🖥️ {log.user_agent.split(' ')[0]}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="text-right flex-shrink-0">
                        <div className="text-sm text-white">
                          {new Date(log.created_at).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-slate-400">
                          {new Date(log.created_at).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>

                    {log.metadata && Object.keys(log.metadata).length > 0 && (
                      <div className="mt-2 p-2 bg-slate-800/50 rounded text-xs">
                        <details>
                          <summary className="text-slate-400 cursor-pointer hover:text-slate-300">
                            Additional Details
                          </summary>
                          <div className="mt-2 font-mono text-slate-300">
                            {JSON.stringify(log.metadata, null, 2)}
                          </div>
                        </details>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pagination would go here for large datasets */}
      {filteredLogs.length > 50 && (
        <div className="text-center text-slate-400 text-sm">
          Showing first 50 results. Use filters to narrow down results.
        </div>
      )}
    </div>
  );
}