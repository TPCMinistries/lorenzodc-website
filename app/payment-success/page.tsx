'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '../lib/hooks/useAuth';

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/chat');
      return;
    }

    if (!sessionId) {
      setError('No session ID provided');
      setLoading(false);
      return;
    }

    // Verify the payment session
    const verifyPayment = async () => {
      try {
        const response = await fetch('/api/stripe/verify-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId })
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Payment verification failed');
        }

        setLoading(false);

        // Redirect to chat after 3 seconds
        setTimeout(() => {
          router.push('/chat');
        }, 3000);

      } catch (error: any) {
        console.error('Payment verification error:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    verifyPayment();
  }, [sessionId, isAuthenticated, router]);

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6">

        {loading ? (
          <div className="space-y-4">
            <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <h1 className="text-2xl font-bold text-white">Verifying Payment...</h1>
            <p className="text-slate-400">Please wait while we confirm your subscription</p>
          </div>
        ) : error ? (
          <div className="space-y-4">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto">
              <span className="text-red-400 text-2xl">❌</span>
            </div>
            <h1 className="text-2xl font-bold text-red-400">Payment Error</h1>
            <p className="text-slate-400">{error}</p>
            <button
              onClick={() => router.push('/chat')}
              className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Return to Chat
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Success Animation */}
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto animate-pulse">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full blur-xl animate-ping"></div>
            </div>

            {/* Success Message */}
            <div className="space-y-4">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                Payment Successful! 🎉
              </h1>
              <p className="text-slate-300 text-lg">
                Welcome to Catalyst Plus! Your subscription is now active.
              </p>
            </div>

            {/* Features Unlocked */}
            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 text-left">
              <h3 className="text-lg font-semibold text-cyan-400 mb-3">✨ You now have access to:</h3>
              <ul className="space-y-2 text-slate-300">
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">•</span>
                  Unlimited AI coaching conversations
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">•</span>
                  Personal goal tracking & accountability
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">•</span>
                  Enhanced coaching personality
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">•</span>
                  Progress dashboard & analytics
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">•</span>
                  Priority customer support
                </li>
              </ul>
            </div>

            <div className="text-slate-400 text-sm">
              Redirecting you to your AI chat in a few seconds...
            </div>

            <button
              onClick={() => router.push('/chat')}
              className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200"
            >
              Start Chatting Now →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}