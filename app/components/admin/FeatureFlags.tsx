'use client';

import { useState, useEffect } from 'react';
import { AdminService, FeatureFlag } from '../../lib/services/admin-service';

export default function FeatureFlags() {
  const [flags, setFlags] = useState<FeatureFlag[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingFlag, setEditingFlag] = useState<FeatureFlag | null>(null);

  const [newFlag, setNewFlag] = useState<Partial<FeatureFlag>>({
    flag_name: '',
    flag_description: '',
    flag_type: 'boolean',
    is_enabled: false,
    default_value: false,
    target_user_percentage: 100,
    target_user_segments: [],
    target_subscription_tiers: [],
    is_ab_test: false,
    environment: 'production'
  });

  useEffect(() => {
    loadFlags();
  }, []);

  const loadFlags = async () => {
    setLoading(true);
    try {
      const flagsData = await AdminService.getFeatureFlags();
      setFlags(flagsData);
    } catch (error) {
      console.error('Error loading feature flags:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFlag = async (flag: FeatureFlag) => {
    try {
      const success = await AdminService.upsertFeatureFlag({
        ...flag,
        is_enabled: !flag.is_enabled
      });

      if (success) {
        loadFlags();
      }
    } catch (error) {
      console.error('Error toggling feature flag:', error);
    }
  };

  const handleCreateFlag = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newFlag.flag_name?.trim()) return;

    try {
      const success = await AdminService.upsertFeatureFlag(newFlag);

      if (success) {
        setShowCreateModal(false);
        setNewFlag({
          flag_name: '',
          flag_description: '',
          flag_type: 'boolean',
          is_enabled: false,
          default_value: false,
          target_user_percentage: 100,
          target_user_segments: [],
          target_subscription_tiers: [],
          is_ab_test: false,
          environment: 'production'
        });
        loadFlags();
      }
    } catch (error) {
      console.error('Error creating feature flag:', error);
    }
  };

  const handleEditFlag = (flag: FeatureFlag) => {
    setEditingFlag(flag);
    setNewFlag(flag);
    setShowCreateModal(true);
  };

  const getEnvironmentColor = (environment: string) => {
    switch (environment) {
      case 'production': return 'text-green-400 bg-green-500/20';
      case 'staging': return 'text-yellow-400 bg-yellow-500/20';
      case 'development': return 'text-blue-400 bg-blue-500/20';
      default: return 'text-slate-400 bg-slate-500/20';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'boolean': return 'text-blue-400';
      case 'string': return 'text-green-400';
      case 'number': return 'text-purple-400';
      case 'json': return 'text-orange-400';
      default: return 'text-slate-400';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-slate-400">Loading feature flags...</span>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Feature Flags</h2>
            <p className="text-slate-400 mt-1">Control feature rollouts and A/B tests</p>
          </div>
          <button
            onClick={() => {
              setEditingFlag(null);
              setNewFlag({
                flag_name: '',
                flag_description: '',
                flag_type: 'boolean',
                is_enabled: false,
                default_value: false,
                target_user_percentage: 100,
                target_user_segments: [],
                target_subscription_tiers: [],
                is_ab_test: false,
                environment: 'production'
              });
              setShowCreateModal(true);
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            + Create Flag
          </button>
        </div>

        {/* Feature Flags List */}
        <div className="space-y-4">
          {flags.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎛️</div>
              <h3 className="text-xl font-bold text-white mb-2">No Feature Flags</h3>
              <p className="text-slate-400 mb-4">Create your first feature flag to control feature rollouts.</p>
            </div>
          ) : (
            flags.map((flag) => (
              <div
                key={flag.id}
                className="bg-slate-700/30 border border-slate-600/50 rounded-xl p-6"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-white">{flag.flag_name}</h3>
                      <span className={`text-xs px-2 py-1 rounded ${getEnvironmentColor(flag.environment)}`}>
                        {flag.environment}
                      </span>
                      <span className={`text-xs font-medium ${getTypeColor(flag.flag_type)}`}>
                        {flag.flag_type}
                      </span>
                      {flag.is_ab_test && (
                        <span className="text-xs px-2 py-1 bg-purple-500/20 text-purple-300 rounded">
                          A/B Test
                        </span>
                      )}
                    </div>

                    {flag.flag_description && (
                      <p className="text-slate-300 mb-3">{flag.flag_description}</p>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-slate-400">Target Users:</span>
                        <div className="text-white">{flag.target_user_percentage}%</div>
                      </div>

                      {flag.target_subscription_tiers.length > 0 && (
                        <div>
                          <span className="text-slate-400">Tiers:</span>
                          <div className="text-white">
                            {flag.target_subscription_tiers.join(', ')}
                          </div>
                        </div>
                      )}

                      <div>
                        <span className="text-slate-400">Created:</span>
                        <div className="text-white">
                          {new Date(flag.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    {flag.is_ab_test && (
                      <div className="mt-3 p-3 bg-slate-800/50 rounded-lg">
                        <div className="text-sm text-slate-400 mb-2">A/B Test Configuration:</div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          {Object.entries(flag.ab_test_traffic_split).map(([variant, percentage]) => (
                            <div key={variant}>
                              <span className="text-slate-300">{variant}:</span>
                              <span className="text-white ml-2">{percentage}%</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3 ml-6">
                    <button
                      onClick={() => handleEditFlag(flag)}
                      className="text-slate-400 hover:text-slate-300 transition-colors"
                    >
                      ✏️
                    </button>

                    <div className="flex items-center gap-2">
                      <span className={`text-sm ${flag.is_enabled ? 'text-green-400' : 'text-slate-500'}`}>
                        {flag.is_enabled ? 'ON' : 'OFF'}
                      </span>
                      <button
                        onClick={() => handleToggleFlag(flag)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          flag.is_enabled ? 'bg-green-500' : 'bg-slate-600'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            flag.is_enabled ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Create/Edit Flag Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-800 rounded-xl border border-slate-600 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-600">
              <h3 className="text-xl font-bold text-white">
                {editingFlag ? 'Edit Feature Flag' : 'Create Feature Flag'}
              </h3>
            </div>

            <form onSubmit={handleCreateFlag} className="p-6 space-y-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Flag Name *
                  </label>
                  <input
                    type="text"
                    value={newFlag.flag_name}
                    onChange={(e) => setNewFlag({ ...newFlag, flag_name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 focus:outline-none"
                    placeholder="e.g., new_chat_interface"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={newFlag.flag_description}
                    onChange={(e) => setNewFlag({ ...newFlag, flag_description: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 focus:outline-none resize-none"
                    rows={3}
                    placeholder="Describe what this flag controls..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Type
                    </label>
                    <select
                      value={newFlag.flag_type}
                      onChange={(e) => setNewFlag({ ...newFlag, flag_type: e.target.value as any })}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 focus:outline-none"
                    >
                      <option value="boolean">Boolean</option>
                      <option value="string">String</option>
                      <option value="number">Number</option>
                      <option value="json">JSON</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Environment
                    </label>
                    <select
                      value={newFlag.environment}
                      onChange={(e) => setNewFlag({ ...newFlag, environment: e.target.value as any })}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 focus:outline-none"
                    >
                      <option value="development">Development</option>
                      <option value="staging">Staging</option>
                      <option value="production">Production</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Targeting */}
              <div className="space-y-4">
                <h4 className="font-semibold text-white">Targeting</h4>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Target User Percentage
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={newFlag.target_user_percentage}
                    onChange={(e) => setNewFlag({ ...newFlag, target_user_percentage: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 focus:outline-none"
                  />
                  <div className="mt-1 text-xs text-slate-400">
                    Percentage of users who will see this feature
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Target Subscription Tiers
                  </label>
                  <div className="space-y-2">
                    {['free', 'catalyst_basic', 'catalyst_plus', 'enterprise'].map(tier => (
                      <label key={tier} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={newFlag.target_subscription_tiers?.includes(tier)}
                          onChange={(e) => {
                            const tiers = newFlag.target_subscription_tiers || [];
                            if (e.target.checked) {
                              setNewFlag({ ...newFlag, target_subscription_tiers: [...tiers, tier] });
                            } else {
                              setNewFlag({ ...newFlag, target_subscription_tiers: tiers.filter(t => t !== tier) });
                            }
                          }}
                          className="rounded"
                        />
                        <span className="text-slate-300 capitalize">
                          {tier.replace('catalyst_', '').replace('_', ' ')}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* A/B Testing */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="is_ab_test"
                    checked={newFlag.is_ab_test}
                    onChange={(e) => setNewFlag({ ...newFlag, is_ab_test: e.target.checked })}
                    className="rounded"
                  />
                  <label htmlFor="is_ab_test" className="text-slate-300">
                    Enable A/B Testing
                  </label>
                </div>

                {newFlag.is_ab_test && (
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      A/B Test Variants (JSON)
                    </label>
                    <textarea
                      value={JSON.stringify(newFlag.ab_test_variants, null, 2)}
                      onChange={(e) => {
                        try {
                          const variants = JSON.parse(e.target.value);
                          setNewFlag({ ...newFlag, ab_test_variants: variants });
                        } catch {
                          // Invalid JSON, ignore
                        }
                      }}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 focus:outline-none resize-none font-mono text-sm"
                      rows={4}
                      placeholder='{"control": {"enabled": false}, "variant": {"enabled": true}}'
                    />
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-6 border-t border-slate-600">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  {editingFlag ? 'Update Flag' : 'Create Flag'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}