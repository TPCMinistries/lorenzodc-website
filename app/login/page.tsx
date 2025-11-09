'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';
  const message = searchParams.get('message');

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await fetch('/api/auth/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
      } else {
        setError(data.error || 'Failed to send login link');
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
            Admin Login
          </h1>
          <p className="text-slate-400 text-sm mt-2">
            Magic link authentication via email
          </p>
          {message === 'admin_required' && (
            <p className="text-yellow-400 text-sm mt-2">
              🔒 Admin access required
            </p>
          )}
        </div>

        {/* Login Form */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-8">
          {success ? (
            <div className="text-center space-y-4">
              <div className="text-6xl mb-4">📧</div>
              <h2 className="text-2xl font-bold text-white">Check Your Email</h2>
              <p className="text-slate-300">
                We sent a magic login link to <strong className="text-cyan-400">{email}</strong>
              </p>
              <p className="text-sm text-slate-400">
                Click the link in the email to access the admin dashboard. The link expires in 1 hour.
              </p>
              <button
                onClick={() => {
                  setSuccess(false);
                  setEmail('');
                }}
                className="text-cyan-400 hover:text-cyan-300 text-sm mt-4"
              >
                ← Send another link
              </button>
            </div>
          ) : (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                  Admin Email
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

              {error && (
                <div className="p-3 rounded-lg text-sm bg-red-900/50 text-red-300 border border-red-700">
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
                {loading ? 'Sending...' : 'Send Magic Link'}
              </button>

              <div className="mt-6 p-4 bg-slate-900 border border-slate-700 rounded-lg">
                <p className="text-xs text-slate-400">
                  <strong className="text-cyan-400">🔒 Passwordless Login:</strong> We'll email you a secure link to log in. No password needed!
                </p>
              </div>

              {/* Admin Note */}
              <div className="mt-4 p-4 bg-blue-900/20 border border-blue-700 rounded-lg">
                <p className="text-xs text-blue-300">
                  <strong>Authorized Admins:</strong>
                </p>
                <ul className="text-xs text-blue-400 mt-2 space-y-1">
                  <li>• lorenzo@lorenzodc.com</li>
                  <li>• lorenzo@theglobalenterprise.org</li>
                </ul>
              </div>
            </form>
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
