export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-12">
          <h1 className="text-4xl font-bold text-white mb-8">Privacy Policy</h1>

          <div className="prose prose-invert prose-slate max-w-none">
            <p className="text-slate-300 text-lg mb-6">
              Last updated: {new Date().toLocaleDateString()}
            </p>

            <h2 className="text-2xl font-bold text-white mb-4">Information We Collect</h2>
            <p className="text-slate-300 mb-6">
              We collect information you provide directly to us, such as when you create an account,
              use our services, or contact us for support.
            </p>

            <h2 className="text-2xl font-bold text-white mb-4">How We Use Your Information</h2>
            <p className="text-slate-300 mb-6">
              We use the information we collect to provide, maintain, and improve our services,
              process transactions, and communicate with you.
            </p>

            <h2 className="text-2xl font-bold text-white mb-4">Information Sharing</h2>
            <p className="text-slate-300 mb-6">
              We do not sell, trade, or otherwise transfer your personal information to third parties
              without your consent, except as described in this policy.
            </p>

            <h2 className="text-2xl font-bold text-white mb-4">Data Security</h2>
            <p className="text-slate-300 mb-6">
              We implement appropriate security measures to protect your personal information against
              unauthorized access, alteration, disclosure, or destruction.
            </p>

            <h2 className="text-2xl font-bold text-white mb-4">Contact Us</h2>
            <p className="text-slate-300">
              If you have questions about this Privacy Policy, please contact us through our contact page.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}