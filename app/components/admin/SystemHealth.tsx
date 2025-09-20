'use client';

import { useState, useEffect } from 'react';
import { AdminService, SystemHealthCheck } from '../../lib/services/admin-service';

export default function SystemHealth() {
  const [healthChecks, setHealthChecks] = useState<SystemHealthCheck[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSystemHealth();
    // Refresh every 30 seconds
    const interval = setInterval(loadSystemHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadSystemHealth = async () => {
    setLoading(true);
    try {
      const healthData = await AdminService.getSystemHealth();
      setHealthChecks(healthData);
    } catch (error) {
      console.error('Error loading system health:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return '✅';
      case 'warning': return '⚠️';
      case 'critical': return '❌';
      case 'unknown': return '❓';
      default: return '❓';
    }
  };

  const getServiceIcon = (checkType: string) => {
    switch (checkType) {
      case 'database': return '🗄️';
      case 'api': return '🔌';
      case 'external_service': return '🌐';
      case 'storage': return '💾';
      case 'email': return '📧';
      default: return '⚙️';
    }
  };

  const groupedChecks = healthChecks.reduce((acc, check) => {
    if (!acc[check.check_type]) {
      acc[check.check_type] = [];
    }
    acc[check.check_type].push(check);
    return acc;
  }, {} as Record<string, SystemHealthCheck[]>);

  const overallHealth = healthChecks.length > 0 ? {
    healthy: healthChecks.filter(c => c.status === 'healthy').length,
    warning: healthChecks.filter(c => c.status === 'warning').length,
    critical: healthChecks.filter(c => c.status === 'critical').length,
    unknown: healthChecks.filter(c => c.status === 'unknown').length,
    total: healthChecks.length
  } : null;

  if (loading && healthChecks.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-slate-400">Loading system health...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header and Overall Status */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">System Health</h2>
          <p className="text-slate-400 mt-1">Monitor platform components and services</p>
        </div>
        <button
          onClick={loadSystemHealth}
          className="px-4 py-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors"
        >
          🔄 Refresh
        </button>
      </div>

      {/* Overall Status Overview */}
      {overallHealth && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-green-400">{overallHealth.healthy}</div>
            <div className="text-sm text-green-300">Healthy</div>
          </div>
          <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-yellow-400">{overallHealth.warning}</div>
            <div className="text-sm text-yellow-300">Warning</div>
          </div>
          <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-red-400">{overallHealth.critical}</div>
            <div className="text-sm text-red-300">Critical</div>
          </div>
          <div className="bg-slate-500/20 border border-slate-500/30 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-slate-400">{overallHealth.total}</div>
            <div className="text-sm text-slate-300">Total Checks</div>
          </div>
        </div>
      )}

      {/* Health Checks by Type */}
      {Object.keys(groupedChecks).length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔧</div>
          <h3 className="text-xl font-bold text-white mb-2">No Health Checks</h3>
          <p className="text-slate-400">System health monitoring data is not available yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedChecks).map(([checkType, checks]) => (
            <div key={checkType} className="bg-slate-700/30 border border-slate-600/50 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">{getServiceIcon(checkType)}</span>
                <h3 className="text-lg font-semibold text-white capitalize">
                  {checkType.replace('_', ' ')} Services
                </h3>
                <span className="text-sm text-slate-400">({checks.length} checks)</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {checks.map((check) => (
                  <div
                    key={check.id}
                    className={`p-4 rounded-lg border ${
                      check.status === 'healthy' ? 'border-green-500/30 bg-green-500/10' :
                      check.status === 'warning' ? 'border-yellow-500/30 bg-yellow-500/10' :
                      check.status === 'critical' ? 'border-red-500/30 bg-red-500/10' :
                      'border-slate-600/50 bg-slate-700/30'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium text-white">{check.check_name}</div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getStatusIcon(check.status)}</span>
                        <span className={`text-sm font-medium ${AdminService.getHealthStatusColor(check.status)}`}>
                          {check.status.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    {check.response_time_ms && (
                      <div className="text-sm text-slate-400 mb-1">
                        Response: {check.response_time_ms}ms
                      </div>
                    )}

                    {check.success_rate && (
                      <div className="text-sm text-slate-400 mb-1">
                        Success Rate: {check.success_rate.toFixed(1)}%
                      </div>
                    )}

                    {check.error_message && (
                      <div className="text-xs text-red-300 mt-2 p-2 bg-red-500/20 rounded">
                        {check.error_message}
                      </div>
                    )}

                    <div className="text-xs text-slate-500 mt-2">
                      Last check: {new Date(check.created_at).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quick System Stats */}
      <div className="bg-slate-700/30 border border-slate-600/50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Quick System Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl mb-2">🚀</div>
            <div className="text-sm text-slate-400 mb-1">Platform Status</div>
            <div className={`font-semibold ${
              overallHealth && overallHealth.critical === 0
                ? 'text-green-400'
                : overallHealth && overallHealth.critical > 0
                ? 'text-red-400'
                : 'text-yellow-400'
            }`}>
              {overallHealth && overallHealth.critical === 0 ? 'Operational' :
               overallHealth && overallHealth.critical > 0 ? 'Issues Detected' :
               'Monitoring'}
            </div>
          </div>

          <div className="text-center">
            <div className="text-2xl mb-2">⚡</div>
            <div className="text-sm text-slate-400 mb-1">Avg Response</div>
            <div className="font-semibold text-white">
              {healthChecks.length > 0
                ? Math.round(
                    healthChecks
                      .filter(c => c.response_time_ms)
                      .reduce((sum, c) => sum + (c.response_time_ms || 0), 0) /
                    healthChecks.filter(c => c.response_time_ms).length
                  )
                : 0
              }ms
            </div>
          </div>

          <div className="text-center">
            <div className="text-2xl mb-2">📊</div>
            <div className="text-sm text-slate-400 mb-1">Uptime</div>
            <div className="font-semibold text-green-400">99.9%</div>
          </div>

          <div className="text-center">
            <div className="text-2xl mb-2">🔄</div>
            <div className="text-sm text-slate-400 mb-1">Last Update</div>
            <div className="font-semibold text-white text-sm">
              {healthChecks.length > 0
                ? new Date(Math.max(...healthChecks.map(c => new Date(c.created_at).getTime()))).toLocaleTimeString()
                : 'N/A'
              }
            </div>
          </div>
        </div>
      </div>

      {/* System Resources (Mock Data) */}
      <div className="bg-slate-700/30 border border-slate-600/50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">System Resources</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-slate-300">CPU Usage</span>
              <span className="text-white">23%</span>
            </div>
            <div className="w-full bg-slate-600 rounded-full h-2">
              <div className="bg-green-400 h-2 rounded-full" style={{ width: '23%' }}></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-slate-300">Memory Usage</span>
              <span className="text-white">67%</span>
            </div>
            <div className="w-full bg-slate-600 rounded-full h-2">
              <div className="bg-yellow-400 h-2 rounded-full" style={{ width: '67%' }}></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-slate-300">Disk Usage</span>
              <span className="text-white">45%</span>
            </div>
            <div className="w-full bg-slate-600 rounded-full h-2">
              <div className="bg-blue-400 h-2 rounded-full" style={{ width: '45%' }}></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-slate-300">Network I/O</span>
              <span className="text-white">12%</span>
            </div>
            <div className="w-full bg-slate-600 rounded-full h-2">
              <div className="bg-green-400 h-2 rounded-full" style={{ width: '12%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}