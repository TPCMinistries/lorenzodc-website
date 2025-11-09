'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminDashboard from '../components/admin/AdminDashboard';

export default function AdminPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simple auth check - you can make this more robust
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/check-admin');
      const data = await response.json();

      if (response.ok && data.isAdmin) {
        setIsAuthenticated(true);
      } else {
        console.log('Admin access denied:', data.email || 'No user');
        // Redirect to login page
        router.push('/login?redirect=/admin&message=admin_required');
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      router.push('/login?redirect=/admin');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white">Checking admin access...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <AdminDashboard />
      </div>
    </div>
  );
}
