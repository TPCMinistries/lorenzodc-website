'use client';
import { useState } from 'react';

interface NewsletterSignupProps {
  variant?: 'inline' | 'popup' | 'footer';
  className?: string;
}

export default function NewsletterSignup({ variant = 'inline', className = '' }: NewsletterSignupProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          source: variant,
          leadMagnet: 'AI Strategy Newsletter'
        })
      });

      if (response.ok) {
        setStatus('success');
        setMessage('Success! Check your email for the AI Strategy Guide.');
        setEmail('');
      } else {
        setStatus('error');
        setMessage('Something went wrong. Please try again.');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
    }
  };

  const baseClasses = variant === 'footer'
    ? 'text-white'
    : 'text-slate-900';

  return (
    <div className={`${className}`}>
      {variant === 'popup' && (
        <div className="mb-4">
          <h3 className="text-xl font-bold text-slate-900 mb-2">
            🎯 Free AI Strategy Guide
          </h3>
          <p className="text-slate-600 text-sm">
            Get the "AI Readiness Checklist" + weekly insights on AI strategy for leaders.
          </p>
        </div>
      )}

      {variant === 'footer' && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-white mb-2">
            AI Strategy Newsletter
          </h3>
          <p className="text-slate-300 text-sm">
            Weekly insights on AI strategy, tools, and implementation for forward-thinking leaders.
          </p>
        </div>
      )}

      {variant === 'inline' && (
        <div className="mb-4">
          <h3 className="text-2xl font-bold text-slate-900 mb-2">
            Stay Ahead with AI Strategy
          </h3>
          <p className="text-slate-600">
            Get weekly insights on AI implementation, tools, and strategy. Plus, receive our free "AI Readiness Checklist."
          </p>
        </div>
      )}

      {status === 'success' ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-800 font-medium">✅ {message}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
              className={`flex-1 px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                variant === 'footer' ? 'bg-slate-800 text-white placeholder-slate-400 border-slate-600' : 'bg-white'
              }`}
              disabled={status === 'loading'}
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                variant === 'footer'
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {status === 'loading' ? 'Subscribing...' : 'Get Free Guide'}
            </button>
          </div>

          {status === 'error' && (
            <p className="text-red-600 text-sm">{message}</p>
          )}

          <p className={`text-xs ${variant === 'footer' ? 'text-slate-400' : 'text-slate-500'}`}>
            No spam. Unsubscribe anytime. We respect your privacy.
          </p>
        </form>
      )}
    </div>
  );
}