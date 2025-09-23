export default function AssessmentCompletePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6">

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
            Assessment Complete! ✅
          </h1>
          <p className="text-slate-300 text-lg">
            Your personalized AI Readiness Report is being generated and will be in your inbox within 2 minutes.
          </p>
        </div>

        {/* What's Next */}
        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 text-left">
          <h3 className="text-lg font-semibold text-cyan-400 mb-3">📧 What's in your report:</h3>
          <ul className="space-y-2 text-slate-300">
            <li className="flex items-start">
              <span className="text-green-400 mr-2">•</span>
              Your overall AI readiness score
            </li>
            <li className="flex items-start">
              <span className="text-green-400 mr-2">•</span>
              Detailed breakdown by category
            </li>
            <li className="flex items-start">
              <span className="text-green-400 mr-2">•</span>
              Personalized next steps roadmap
            </li>
            <li className="flex items-start">
              <span className="text-green-400 mr-2">•</span>
              Industry benchmarking data
            </li>
          </ul>
        </div>

        {/* Call to Actions */}
        <div className="space-y-3">
          <a
            href="/chat"
            className="block w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 text-center"
          >
            🤖 Get AI Strategy Guidance
          </a>

          <a
            href="/contact"
            className="block w-full bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 text-center border border-slate-600"
          >
            📅 Book Strategy Call
          </a>

          <a
            href="/"
            className="block w-full text-slate-400 hover:text-white px-6 py-3 text-center transition-colors"
          >
            ← Back to Home
          </a>
        </div>

        {/* Tip */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
          <p className="text-blue-300 text-sm">
            💡 <strong>Pro tip:</strong> Check your spam folder if you don't see the email in 5 minutes.
            The report comes from lorenzo@lorenzodc.com
          </p>
        </div>

      </div>
    </div>
  );
}