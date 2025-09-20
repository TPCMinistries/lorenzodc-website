export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-12">
          <h1 className="text-4xl font-bold text-white mb-8">Terms of Service</h1>

          <div className="prose prose-invert prose-slate max-w-none">
            <p className="text-slate-300 text-lg mb-6">
              Last updated: {new Date().toLocaleDateString()}
            </p>

            <h2 className="text-2xl font-bold text-white mb-4">Acceptance of Terms</h2>
            <p className="text-slate-300 mb-6">
              By accessing and using The Catalyst Path services, you accept and agree to be bound by
              the terms and provision of this agreement.
            </p>

            <h2 className="text-2xl font-bold text-white mb-4">Use License</h2>
            <p className="text-slate-300 mb-6">
              Permission is granted to temporarily use The Catalyst Path services for personal,
              non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.
            </p>

            <h2 className="text-2xl font-bold text-white mb-4">Service Availability</h2>
            <p className="text-slate-300 mb-6">
              We strive to provide reliable service but do not guarantee uninterrupted access.
              Services may be temporarily unavailable for maintenance or updates.
            </p>

            <h2 className="text-2xl font-bold text-white mb-4">Disclaimer</h2>
            <p className="text-slate-300 mb-6">
              The materials on The Catalyst Path are provided on an 'as is' basis. We make no warranties,
              expressed or implied, and hereby disclaim all other warranties.
            </p>

            <h2 className="text-2xl font-bold text-white mb-4">Limitations</h2>
            <p className="text-slate-300 mb-6">
              In no event shall The Catalyst Path or its suppliers be liable for any damages arising
              out of the use or inability to use the materials on our website.
            </p>

            <h2 className="text-2xl font-bold text-white mb-4">Contact Information</h2>
            <p className="text-slate-300">
              Questions about the Terms of Service should be sent to us through our contact page.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}