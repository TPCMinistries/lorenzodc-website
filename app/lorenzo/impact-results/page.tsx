'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ImpactResultsRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the new Investment Metrics page
    router.replace('/lorenzo/investment-metrics');
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-violet-950 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <div className="text-white">Redirecting to Investment Metrics...</div>
      </div>
    </div>
  );
}