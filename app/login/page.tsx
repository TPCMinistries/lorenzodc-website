'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';
  const message = searchParams.get('message');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mode, setMode] = useState<'login' | 'signup'>('login');

  const supabase = createClientComponentClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
      } else if (data.user) {
        router.push(redirect);
        router.refresh();
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/login?redirect=${redirect}`,
        },
      });

      if (error) {
        setError(error.message);
      } else if (data.user) {
        setError('Check your email to confirm your account!');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-2">
            {mode === 'login' ? 'Admin Login' : 'Create Account'}
          </h1>
          {message === 'admin_required' && (
            <p className="text-yellow-400 text-sm mt-2">
              🔒 Admin access required
            </p>
          )}
        </div>

        {/* Login Form */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-8">
          <form onSubmit={mode === 'login' ? handleLogin : handleSignup} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                placeholder="lorenzo@lorenzodc.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>

            {error && (
              <div className={`p-3 rounded-lg text-sm ${
                error.includes('Check your email')
                  ? 'bg-green-900/50 text-green-300 border border-green-700'
                  : 'bg-red-900/50 text-red-300 border border-red-700'
              }`}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-lg font-medium transition-all ${
                loading
                  ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white'
              }`}
            >
              {loading ? 'Loading...' : mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          {/* Toggle Mode */}
          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setMode(mode === 'login' ? 'signup' : 'login');
                setError('');
              }}
              className="text-cyan-400 hover:text-cyan-300 text-sm"
            >
              {mode === 'login' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
            </button>
          </div>

          {/* Admin Note */}
          {redirect === '/admin' && (
            <div className="mt-6 p-4 bg-slate-900 border border-slate-700 rounded-lg">
              <p className="text-xs text-slate-400">
                <strong className="text-cyan-400">Note:</strong> Only authorized admin emails can access the admin dashboard.
              </p>
            </div>
          )}
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <button
            onClick={() => router.push('/')}
            className="text-slate-400 hover:text-slate-300 text-sm"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
