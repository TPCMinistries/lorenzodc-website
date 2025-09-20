'use client';

import { useState, useEffect } from 'react';
import { AdminService } from '../../lib/services/admin-service';

interface User {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at?: string;
  email_confirmed_at?: string;
  raw_user_meta_data?: Record<string, any>;
  user_subscriptions?: Array<{
    tierId: string;
    status: string;
    created_at: string;
  }>;
  user_goals?: Array<{
    id: string;
    status: string;
  }>;
  usage_tracking?: Array<{
    feature_type: string;
    created_at: string;
  }>;
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [suspendReason, setSuspendReason] = useState('');

  const itemsPerPage = 25;

  useEffect(() => {
    loadUsers();
  }, [currentPage, searchQuery]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const { users: userData, totalCount: count } = await AdminService.getUsers(
        currentPage,
        itemsPerPage,
        searchQuery || undefined
      );
      setUsers(userData);
      setTotalCount(count);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    loadUsers();
  };

  const handleViewUser = async (user: User) => {
    setSelectedUser(user);
    setShowUserDetails(true);

    // Load detailed user data
    try {
      const details = await AdminService.getUserDetails(user.id);
      setSelectedUser(details);
    } catch (error) {
      console.error('Error loading user details:', error);
    }
  };

  const handleSuspendUser = async () => {
    if (!selectedUser || !suspendReason.trim()) return;

    try {
      const success = await AdminService.suspendUser(selectedUser.id, suspendReason);
      if (success) {
        setShowSuspendModal(false);
        setShowUserDetails(false);
        setSuspendReason('');
        loadUsers(); // Refresh user list
      }
    } catch (error) {
      console.error('Error suspending user:', error);
    }
  };

  const getSubscriptionStatus = (user: User): { tier: string; status: string; color: string } => {
    const activeSubscription = user.user_subscriptions?.find(sub => sub.status === 'active');

    if (!activeSubscription) {
      return { tier: 'Free', status: 'free', color: 'text-slate-400' };
    }

    const tierName = activeSubscription.tierId
      .replace('catalyst_', '')
      .replace('_', ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    return {
      tier: tierName,
      status: activeSubscription.status,
      color: activeSubscription.tierId === 'enterprise' ? 'text-green-400' :
             activeSubscription.tierId === 'catalyst_plus' ? 'text-purple-400' :
             activeSubscription.tierId === 'catalyst_basic' ? 'text-blue-400' :
             'text-slate-400'
    };
  };

  const getActivityColor = (lastSignIn?: string): string => {
    if (!lastSignIn) return 'text-red-400';

    const daysSince = Math.floor((Date.now() - new Date(lastSignIn).getTime()) / (1000 * 60 * 60 * 24));

    if (daysSince <= 1) return 'text-green-400';
    if (daysSince <= 7) return 'text-yellow-400';
    if (daysSince <= 30) return 'text-orange-400';
    return 'text-red-400';
  };

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  if (loading && users.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-slate-400">Loading users...</span>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by email..."
              className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 focus:outline-none"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Search
            </button>
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setCurrentPage(1);
                  loadUsers();
                }}
                className="px-4 py-2 bg-slate-600 text-slate-300 rounded-lg hover:bg-slate-500 transition-colors"
              >
                Clear
              </button>
            )}
          </form>

          <div className="text-sm text-slate-400">
            {totalCount} total users
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-slate-700/30 border border-slate-600/50 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-800/50 border-b border-slate-600">
                <tr>
                  <th className="text-left p-4 font-medium text-slate-300">User</th>
                  <th className="text-left p-4 font-medium text-slate-300">Subscription</th>
                  <th className="text-left p-4 font-medium text-slate-300">Goals</th>
                  <th className="text-left p-4 font-medium text-slate-300">Activity</th>
                  <th className="text-left p-4 font-medium text-slate-300">Joined</th>
                  <th className="text-right p-4 font-medium text-slate-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => {
                  const subscription = getSubscriptionStatus(user);
                  const goalCount = user.user_goals?.length || 0;
                  const activeGoals = user.user_goals?.filter(g => g.status === 'active').length || 0;

                  return (
                    <tr key={user.id} className="border-b border-slate-600/30 hover:bg-slate-700/20">
                      <td className="p-4">
                        <div>
                          <div className="font-medium text-white">{user.email}</div>
                          {user.raw_user_meta_data?.full_name && (
                            <div className="text-sm text-slate-400">{user.raw_user_meta_data.full_name}</div>
                          )}
                          {!user.email_confirmed_at && (
                            <div className="text-xs text-yellow-400 mt-1">Email not verified</div>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`font-medium ${subscription.color}`}>
                          {subscription.tier}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="text-sm text-slate-300">
                          {goalCount > 0 ? (
                            <>
                              <div>{goalCount} total</div>
                              <div className="text-xs text-blue-400">{activeGoals} active</div>
                            </>
                          ) : (
                            <span className="text-slate-500">No goals</span>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className={`text-sm ${getActivityColor(user.last_sign_in_at)}`}>
                          {user.last_sign_in_at ? (
                            <>
                              {Math.floor((Date.now() - new Date(user.last_sign_in_at).getTime()) / (1000 * 60 * 60 * 24))} days ago
                            </>
                          ) : (
                            'Never'
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm text-slate-400">
                          {new Date(user.created_at).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleViewUser(user)}
                          className="text-blue-400 hover:text-blue-300 text-sm transition-colors mr-3"
                        >
                          View
                        </button>
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setShowSuspendModal(true);
                          }}
                          className="text-red-400 hover:text-red-300 text-sm transition-colors"
                        >
                          Suspend
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <div className="text-sm text-slate-400">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, totalCount)} of {totalCount} users
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 bg-slate-700 text-slate-300 rounded hover:bg-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = i + Math.max(1, currentPage - 2);
                if (page > totalPages) return null;
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 rounded transition-colors ${
                      currentPage === page
                        ? 'bg-blue-500 text-white'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 bg-slate-700 text-slate-300 rounded hover:bg-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* User Details Modal */}
      {showUserDetails && selectedUser && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-xl border border-slate-600 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-600">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">User Details</h3>
                <button
                  onClick={() => setShowUserDetails(false)}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* User Info */}
              <div>
                <h4 className="font-semibold text-white mb-3">Account Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Email:</span>
                    <span className="text-white">{selectedUser.email}</span>
                  </div>
                  {selectedUser.raw_user_meta_data?.full_name && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Name:</span>
                      <span className="text-white">{selectedUser.raw_user_meta_data.full_name}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-slate-400">Joined:</span>
                    <span className="text-white">{new Date(selectedUser.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Last Sign In:</span>
                    <span className="text-white">
                      {selectedUser.last_sign_in_at
                        ? new Date(selectedUser.last_sign_in_at).toLocaleDateString()
                        : 'Never'
                      }
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Email Verified:</span>
                    <span className={selectedUser.email_confirmed_at ? 'text-green-400' : 'text-red-400'}>
                      {selectedUser.email_confirmed_at ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Subscription Info */}
              <div>
                <h4 className="font-semibold text-white mb-3">Subscription</h4>
                <div className="space-y-2">
                  {selectedUser.user_subscriptions?.map((sub, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-slate-400">
                        {sub.tierId.replace('catalyst_', '').replace('_', ' ')} - {sub.status}
                      </span>
                      <span className="text-white">{new Date(sub.created_at).toLocaleDateString()}</span>
                    </div>
                  )) || (
                    <span className="text-slate-500 text-sm">Free user</span>
                  )}
                </div>
              </div>

              {/* Goals */}
              <div>
                <h4 className="font-semibold text-white mb-3">Goals ({selectedUser.user_goals?.length || 0})</h4>
                {selectedUser.user_goals?.length ? (
                  <div className="space-y-1">
                    {selectedUser.user_goals.slice(0, 5).map((goal) => (
                      <div key={goal.id} className="flex justify-between text-sm">
                        <span className="text-slate-400">Goal #{goal.id.slice(0, 8)}</span>
                        <span className={`${
                          goal.status === 'completed' ? 'text-green-400' :
                          goal.status === 'active' ? 'text-blue-400' :
                          'text-slate-400'
                        }`}>
                          {goal.status}
                        </span>
                      </div>
                    ))}
                    {selectedUser.user_goals.length > 5 && (
                      <div className="text-xs text-slate-500">
                        +{selectedUser.user_goals.length - 5} more goals
                      </div>
                    )}
                  </div>
                ) : (
                  <span className="text-slate-500 text-sm">No goals created</span>
                )}
              </div>
            </div>

            <div className="p-6 border-t border-slate-600 flex gap-3">
              <button
                onClick={() => setShowUserDetails(false)}
                className="flex-1 px-4 py-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowUserDetails(false);
                  setShowSuspendModal(true);
                }}
                className="px-4 py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-colors"
              >
                Suspend User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Suspend User Modal */}
      {showSuspendModal && selectedUser && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-xl border border-slate-600 max-w-md w-full">
            <div className="p-6 border-b border-slate-600">
              <h3 className="text-xl font-bold text-white">Suspend User</h3>
              <p className="text-slate-400 mt-1">Suspend {selectedUser.email}</p>
            </div>

            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Reason for suspension *
                </label>
                <textarea
                  value={suspendReason}
                  onChange={(e) => setSuspendReason(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-red-400 focus:ring-2 focus:ring-red-400/20 focus:outline-none resize-none"
                  rows={3}
                  placeholder="Please provide a reason for this suspension..."
                  required
                />
              </div>

              <div className="text-sm text-slate-400 mb-4">
                ⚠️ This action will prevent the user from accessing their account.
              </div>
            </div>

            <div className="p-6 border-t border-slate-600 flex gap-3">
              <button
                onClick={() => {
                  setShowSuspendModal(false);
                  setSuspendReason('');
                }}
                className="flex-1 px-4 py-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSuspendUser}
                disabled={!suspendReason.trim()}
                className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Suspend User
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}