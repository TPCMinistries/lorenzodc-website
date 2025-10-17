'use client';

import React, { useState } from 'react';
import { Menu, X, Mail, Globe, MapPin } from 'lucide-react';

export default function AfricaMovementSite() {
  const [currentPage, setCurrentPage] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Home', id: 'home' },
    { name: 'Strategic Framework', id: 'framework' },
    { name: 'The 12 Pillars', id: 'pillars' },
    { name: 'Organizations', id: 'organizations' },
    { name: 'Get Involved', id: 'involved' },
    { name: 'Historical Foundation', id: 'history' },
    { name: 'Contact', id: 'contact' }
  ];

  const Navigation = () => (
    <nav className="bg-gradient-to-r from-red-900 via-yellow-800 to-green-900 border-b-4 border-yellow-500 sticky top-0 z-50 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setCurrentPage('home')}>
            <div className="w-12 h-12 bg-gradient-to-br from-red-600 via-yellow-500 to-green-600 rounded-full flex items-center justify-center border-2 border-white shadow-lg">
              <span className="text-2xl">🌍</span>
            </div>
            <div>
              <div className="text-white font-black text-lg sm:text-xl leading-tight">UNITED STATES</div>
              <div className="text-yellow-300 font-bold text-xs sm:text-sm leading-tight">OF AFRICA</div>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-2">
            {navigation.map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`px-5 py-2.5 rounded-lg font-bold text-base transition-all ${
                  currentPage === item.id
                    ? 'bg-white text-red-900 shadow-lg'
                    : 'text-white hover:bg-white/20 hover:shadow-md'
                }`}
              >
                {item.name}
              </button>
            ))}
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white p-2 hover:bg-white/20 rounded-lg transition"
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            {navigation.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentPage(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`block w-full text-left px-4 py-3 rounded-lg font-bold transition-all ${
                  currentPage === item.id
                    ? 'bg-white text-red-900'
                    : 'text-white hover:bg-white/20'
                }`}
              >
                {item.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </nav>
  );

  const Footer = () => (
    <footer className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white py-12 border-t-4 border-yellow-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-black text-yellow-400 mb-4">United States of Africa</h3>
            <p className="text-gray-400 mb-4">
              Economic sovereignty, visa-free movement, and mental liberation for the African continent.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-black text-yellow-400 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {navigation.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => setCurrentPage(item.id)}
                    className="text-gray-400 hover:text-yellow-400 transition"
                  >
                    {item.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-black text-yellow-400 mb-4">Connect</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-gray-400">
                <Mail size={20} className="text-yellow-400" />
                <span>info@unitedstatesofafrica.org</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-400">
                <Globe size={20} className="text-yellow-400" />
                <span>Global Movement</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8 text-center text-gray-400">
          <p className="mb-2">© 2025 Hope for Africans Foundation | United States of Africa Movement</p>
          <p className="text-sm">501(c)(3) Application in Process</p>
        </div>
      </div>
    </footer>
  );

  const HomePage = () => (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-red-900 via-yellow-900 to-green-900 text-white py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <div className="mb-6 flex justify-center">
              <div className="w-32 h-32 bg-gradient-to-br from-red-600 via-yellow-500 to-green-600 rounded-full flex items-center justify-center border-4 border-white shadow-2xl animate-pulse">
                <span className="text-6xl">🌍</span>
              </div>
            </div>

            <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
              WHICH AFRICAN STATE CAN
              <span className="block text-yellow-300">FACE THE WORLD ALONE?</span>
              <span className="block text-red-300">NONE.</span>
              <span className="block text-green-300">TOGETHER? UNSTOPPABLE.</span>
            </h1>

            <div className="bg-black/30 backdrop-blur rounded-2xl p-8 max-w-5xl mx-auto mb-8">
              <p className="text-xl md:text-2xl mb-6 font-light leading-relaxed">
                The <span className="font-bold text-yellow-300">United States of Africa Movement</span> —
                <br />A comprehensive strategic framework for continental transformation
              </p>

              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-3xl font-black text-yellow-300">Economic Liberation</div>
                  <div className="text-sm text-gray-300">Controlling resources & value</div>
                </div>
                <div>
                  <div className="text-3xl font-black text-green-300">Human Capital Optimization</div>
                  <div className="text-sm text-gray-300">Talent flows where needed</div>
                </div>
                <div>
                  <div className="text-3xl font-black text-red-300">Psychological Decolonization</div>
                  <div className="text-sm text-gray-300">Breaking mental chains</div>
                </div>
              </div>
            </div>

            <p className="text-lg md:text-xl mb-12 max-w-4xl mx-auto text-gray-200 leading-relaxed">
              After 60+ years of independence, the empirical answer to Dr. Nkrumah's question is clear:
              <br />
              <span className="font-bold text-yellow-300">No African state can face the imperialists alone. Not for long.</span>
              <br />
              <span className="font-bold text-red-300">One Africa = One Voice = One Economy = Pricing Power = Economic Sovereignty</span>
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setCurrentPage('involved')}
                className="bg-yellow-500 text-gray-900 px-8 py-4 rounded-xl font-black text-lg hover:bg-yellow-400 transition transform hover:scale-105 shadow-xl"
              >
                Sign the Petition
              </button>
              <button
                onClick={() => setCurrentPage('involved')}
                className="bg-white text-red-900 px-8 py-4 rounded-xl font-black text-lg hover:bg-gray-100 transition transform hover:scale-105 shadow-xl"
              >
                Donate Now
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Economic Argument */}
      <section className="py-20 bg-gradient-to-br from-gray-50 via-yellow-50 to-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
              THE ECONOMIC REALITY
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Dr. Kwame Nkrumah asked: "Which African state can face the imperialists alone?"
              The answer remains: <strong>NONE.</strong>
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="bg-red-50 p-8 rounded-2xl border-2 border-red-300">
              <h3 className="text-3xl font-black text-red-900 mb-6">❌ DIVIDED WE FALL</h3>
              <ul className="space-y-4 text-gray-700">
                <li className="flex items-start">
                  <span className="text-red-600 mr-3 text-xl">•</span>
                  <span>54 nations go to market separately with resources</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-3 text-xl">•</span>
                  <span>World market dictates and downgrades African prices</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-3 text-xl">•</span>
                  <span>No pricing power, no economic sovereignty</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-3 text-xl">•</span>
                  <span>Continued exploitation and dependency</span>
                </li>
              </ul>
            </div>

            <div className="bg-green-50 p-8 rounded-2xl border-2 border-green-300">
              <h3 className="text-3xl font-black text-green-900 mb-6">✅ UNITED WE PROSPER</h3>
              <ul className="space-y-4 text-gray-700">
                <li className="flex items-start">
                  <span className="text-green-600 mr-3 text-xl">•</span>
                  <span><strong>One voice = One economy = Pricing power</strong></span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-3 text-xl">•</span>
                  <span>Africa decides its own resource prices</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-3 text-xl">•</span>
                  <span>Economic sovereignty and self-determination</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-3 text-xl">•</span>
                  <span>Prosperity for all 1.4 billion Africans</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Three Core Pillars */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-6 text-yellow-400">
              THREE CORE PILLARS
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Not fighting problems — building solutions
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-yellow-900 to-yellow-800 p-8 rounded-2xl border-2 border-yellow-500">
              <div className="text-5xl mb-4">💰</div>
              <h3 className="text-2xl font-black text-yellow-300 mb-3">Building Wealth</h3>
              <p className="text-yellow-100">
                Not eliminating poverty, but creating prosperity.
                Economic sovereignty through unity and strategic resource management.
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-900 to-green-800 p-8 rounded-2xl border-2 border-green-500">
              <div className="text-5xl mb-4">🏥</div>
              <h3 className="text-2xl font-black text-green-300 mb-3">Building Health</h3>
              <p className="text-green-100">
                Not fighting disease, but building robust healthcare systems.
                Continental health infrastructure and medical excellence.
              </p>
            </div>

            <div className="bg-gradient-to-br from-red-900 to-red-800 p-8 rounded-2xl border-2 border-red-500">
              <div className="text-5xl mb-4">🕊️</div>
              <h3 className="text-2xl font-black text-red-300 mb-3">Fostering Peace</h3>
              <p className="text-red-100">
                Not ending conflict, but building unity.
                Continental consciousness over tribal mentality.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Visa-Free Movement - STAR INITIATIVE */}
      <section className="py-20 bg-gradient-to-r from-red-600 via-yellow-600 to-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-block bg-white text-red-900 px-6 py-3 rounded-full font-black text-lg mb-6">
              ⭐ LEADING INITIATIVE ⭐
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              VISA-FREE MOVEMENT
            </h2>
            <p className="text-xl max-w-3xl mx-auto mb-8">
              People are "grieving" for freedom of movement.
              <strong>Unity for Opportunities</strong> — let talent flow where it's needed.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="bg-white/10 p-8 rounded-2xl backdrop-blur">
              <h3 className="text-2xl font-black mb-4">🚫 THE CURRENT CRISIS</h3>
              <ul className="space-y-3">
                <li>• Millions of nurses sitting at home while continent needs them</li>
                <li>• Teachers can't find jobs while schools need educators</li>
                <li>• Skills trapped by borders, not by choice</li>
                <li>• Artificial barriers blocking African solutions</li>
              </ul>
            </div>

            <div className="bg-white/10 p-8 rounded-2xl backdrop-blur">
              <h3 className="text-2xl font-black mb-4">✅ ONE AFRICA SOLUTION</h3>
              <ul className="space-y-3">
                <li>• <strong>One Africa, one passport, no barriers</strong></li>
                <li>• Nurses flow to where healing is needed</li>
                <li>• Teachers reach students across the continent</li>
                <li>• Skills and talents serve all of Africa</li>
              </ul>
            </div>
          </div>

          <div className="text-center mt-12">
            <div className="inline-block bg-yellow-500 text-gray-900 px-8 py-4 rounded-2xl font-black text-xl">
              Freedom of movement = Freedom of opportunity
            </div>
          </div>
        </div>
      </section>
    </div>
  );

  const FrameworkPage = () => (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-r from-red-900 via-yellow-900 to-green-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-black mb-6">STRATEGIC FRAMEWORK</h1>
          <p className="text-xl max-w-4xl mx-auto">
            A comprehensive movement development plan for continental unity and economic sovereignty
          </p>
        </div>
      </section>

      {/* Executive Summary */}
      <section className="py-20 bg-gradient-to-br from-yellow-50 via-white to-green-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-red-50 to-red-100 p-8 rounded-2xl border-2 border-red-300 mb-12">
            <h2 className="text-4xl font-black text-red-900 mb-6 text-center">THE CASE FOR CONTINENTAL UNITY</h2>
            <div className="bg-white p-6 rounded-xl mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Dr. Kwame Nkrumah's Existential Question:</h3>
              <p className="text-xl text-gray-700 italic mb-4">
                "Which African state can face the imperialists alone? And if they do, how long can they withstand them?"
              </p>
              <p className="text-lg text-gray-600">
                The empirical answer, after 60+ years of African independence, is clear: <strong>None can. Not for long.</strong>
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-xl">
                <h3 className="text-xl font-black text-red-900 mb-4">❌ The Economic Reality</h3>
                <p className="text-gray-700 mb-4">
                  54 African nations approach the global market fragmented. Ghana sells gold alone,
                  Nigeria sells oil alone, Congo sells coltan alone—each negotiates separately.
                </p>
                <p className="text-gray-700">
                  <strong>Result:</strong> The world market exploits this division, dictating prices and
                  extracting maximum value while leaving minimal benefit in Africa.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl">
                <h3 className="text-xl font-black text-green-900 mb-4">✅ The Unity Equation</h3>
                <div className="text-lg font-bold text-green-800 mb-4">
                  One Africa = One Voice = One Economy = Pricing Power = Economic Sovereignty
                </div>
                <p className="text-gray-700">
                  This is not conspiracy theory—this is documented economic reality.
                  Because Africa does not unite to decide resource pricing, external actors decide for us.
                </p>
              </div>
            </div>
          </div>

          {/* Three Foundational Pillars */}
          <div className="mb-16">
            <h2 className="text-4xl font-black text-gray-900 mb-8 text-center">THREE FOUNDATIONAL PILLARS</h2>
            <p className="text-xl text-gray-600 text-center mb-12">These are not slogans—they represent a complete reframing of how Africa approaches development.</p>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-8 rounded-2xl border-2 border-yellow-400">
                <div className="text-5xl mb-4 text-center">💰</div>
                <h3 className="text-2xl font-black text-yellow-900 mb-4">Building Wealth</h3>
                <h4 className="text-lg font-bold text-yellow-800 mb-3">(Not Eliminating Poverty)</h4>
                <p className="text-gray-700 mb-4">
                  The global development narrative frames Africa as a poverty problem. We reject this entirely.
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Focus:</strong> Unified commodity pricing, value-add manufacturing,
                  continental industrial policy, wealth creation infrastructure.
                </p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-2xl border-2 border-green-400">
                <div className="text-5xl mb-4 text-center">🏥</div>
                <h3 className="text-2xl font-black text-green-900 mb-4">Building Health</h3>
                <h4 className="text-lg font-bold text-green-800 mb-3">(Not Fighting Disease)</h4>
                <p className="text-gray-700 mb-4">
                  Millions of qualified nurses sit unemployed while other nations need healthcare workers.
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Solution:</strong> Open borders and professional mobility solve this immediately.
                </p>
              </div>

              <div className="bg-gradient-to-br from-red-50 to-red-100 p-8 rounded-2xl border-2 border-red-400">
                <div className="text-5xl mb-4 text-center">🕊️</div>
                <h3 className="text-2xl font-black text-red-900 mb-4">Fostering Peace</h3>
                <h4 className="text-lg font-bold text-red-800 mb-3">(Not Ending Conflict)</h4>
                <p className="text-gray-700 mb-4">
                  Continental security framework, peace through prosperity, youth opportunity.
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Insight:</strong> Idle populations create instability; employed populations create peace.
                </p>
              </div>
            </div>
          </div>

          {/* Historical Precedents */}
          <div className="bg-gray-900 text-white p-8 rounded-2xl">
            <h2 className="text-3xl font-black text-yellow-400 mb-6 text-center">Why Unity Works: Historical Precedents</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <h3 className="text-xl font-bold text-yellow-300 mb-2">United States</h3>
                <p className="text-sm text-gray-300">13 colonies → 50 states<br />Diverse regions unified</p>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold text-green-300 mb-2">India</h3>
                <p className="text-sm text-gray-300">300+ languages<br />Massive population unified</p>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold text-red-300 mb-2">China</h3>
                <p className="text-sm text-gray-300">Vast geography<br />Unified governance</p>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold text-blue-300 mb-2">European Union</h3>
                <p className="text-sm text-gray-300">Historical enemies<br />Economic/political bloc</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );

  const AboutPage = () => (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-r from-red-900 via-yellow-900 to-green-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-black mb-6">ORGANIZATIONAL STRUCTURE</h1>
          <p className="text-xl max-w-4xl mx-auto">
            Two organizations, one strategic vision. Comprehensive approach to continental transformation.
          </p>
        </div>
      </section>

      {/* Dual Entity Model */}
      <section className="py-20 bg-gradient-to-br from-yellow-50 via-white to-green-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-black text-gray-900 mb-4 text-center">DUAL ENTITY MODEL</h2>
          <p className="text-xl text-gray-600 text-center mb-16 max-w-4xl mx-auto">
            Strategic separation of humanitarian work and advocacy allows maximum impact and operational efficiency
          </p>

          <div className="grid md:grid-cols-2 gap-12 mb-16">
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-2xl border-2 border-green-400">
              <div className="bg-green-600 text-white px-4 py-2 rounded-full inline-block mb-6">
                <span className="font-black text-sm">501(c)(3) NONPROFIT</span>
              </div>
              <h3 className="text-3xl font-black text-green-900 mb-4">Hope for Africans Foundation</h3>
              <div className="bg-yellow-200 border border-yellow-600 p-3 rounded-lg mb-6">
                <p className="text-yellow-800 font-bold text-sm">501(c)(3) Application in Process</p>
              </div>

              <div className="mb-6">
                <h4 className="text-xl font-bold text-green-800 mb-3">Mission</h4>
                <p className="text-gray-700 mb-4">
                  On-the-ground humanitarian impact and community development across Africa
                </p>
              </div>

              <div className="mb-6">
                <h4 className="text-xl font-bold text-green-800 mb-3">Core Activities</h4>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-green-600 mr-3 text-xl">•</span>
                    <span>Resource delivery and infrastructure support</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-3 text-xl">•</span>
                    <span>Community development programs</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-3 text-xl">•</span>
                    <span>Educational and healthcare initiatives</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-3 text-xl">•</span>
                    <span><strong>Dr. Nkrumah's 54-country African unity tour</strong></span>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-xl font-bold text-green-800 mb-3">Leadership</h4>
                <p className="text-gray-700">Rev. Dr. Michael N.K. Nkrumah (Chairman)</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-red-100 p-8 rounded-2xl border-2 border-red-400">
              <div className="bg-red-600 text-white px-4 py-2 rounded-full inline-block mb-6">
                <span className="font-black text-sm">GLOBAL COALITION</span>
              </div>
              <h3 className="text-3xl font-black text-red-900 mb-6">United States of Africa Movement</h3>

              <div className="mb-6">
                <h4 className="text-xl font-bold text-red-800 mb-3">Mission</h4>
                <p className="text-gray-700 mb-4">
                  Global advocacy and organizing for African unity, economic sovereignty, and policy transformation
                </p>
              </div>

              <div className="mb-6">
                <h4 className="text-xl font-bold text-red-800 mb-3">Core Activities</h4>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-red-600 mr-3 text-xl">•</span>
                    <span>Continental advocacy and organizing</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-600 mr-3 text-xl">•</span>
                    <span>Policy development and lobbying</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-600 mr-3 text-xl">•</span>
                    <span>International coalition building</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-600 mr-3 text-xl">•</span>
                    <span><strong>Petition drives and education campaigns</strong></span>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-xl font-bold text-red-800 mb-3">Membership</h4>
                <p className="text-gray-700">Open to anyone supporting African unity globally</p>
              </div>
            </div>
          </div>

          {/* Organizational Needs */}
          <div className="bg-gray-900 text-white p-8 rounded-2xl">
            <h2 className="text-3xl font-black text-yellow-400 mb-8 text-center">IMMEDIATE ORGANIZATIONAL NEEDS</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gray-800 p-6 rounded-xl">
                <h3 className="text-xl font-bold text-yellow-300 mb-3">Governance</h3>
                <ul className="text-gray-300 space-y-2 text-sm">
                  <li>• Board of Directors (6-9 members)</li>
                  <li>• Geographic diversity</li>
                  <li>• Generational representation</li>
                  <li>• Framework agreement</li>
                </ul>
              </div>
              <div className="bg-gray-800 p-6 rounded-xl">
                <h3 className="text-xl font-bold text-green-300 mb-3">Operations</h3>
                <ul className="text-gray-300 space-y-2 text-sm">
                  <li>• Staff/volunteer pipeline</li>
                  <li>• Digital infrastructure</li>
                  <li>• CRM and email systems</li>
                  <li>• Social media strategy</li>
                </ul>
              </div>
              <div className="bg-gray-800 p-6 rounded-xl">
                <h3 className="text-xl font-bold text-red-300 mb-3">Financial</h3>
                <ul className="text-gray-300 space-y-2 text-sm">
                  <li>• EIN and bank accounts</li>
                  <li>• Donation processing</li>
                  <li>• Transparent reporting</li>
                  <li>• Financial systems</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="py-20 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-black text-gray-900 mb-4 text-center">THE LEADERSHIP</h2>
          <p className="text-xl text-gray-600 text-center mb-16 max-w-3xl mx-auto">
            Carrying forward Dr. Kwame Nkrumah's vision with modern strategy and global reach.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-xl border-t-4 border-green-500">
              <div className="w-32 h-32 bg-gradient-to-br from-green-600 to-green-800 rounded-full mx-auto mb-6 flex items-center justify-center text-white text-4xl font-black">
                MN
              </div>
              <h3 className="text-2xl font-black text-gray-900 text-center mb-2">Rev. Dr. Michael N.K. Nkrumah</h3>
              <p className="text-center text-green-600 font-bold mb-4">Chairman</p>
              <div className="space-y-4 text-gray-700 text-center">
                <p className="text-gray-500 italic">Grandson of Dr. Kwame Nkrumah</p>
                <p className="text-sm">Leading the 54-country African unity tour and continental organizing efforts.</p>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-xl border-t-4 border-yellow-500">
              <div className="w-32 h-32 bg-gradient-to-br from-yellow-600 to-yellow-800 rounded-full mx-auto mb-6 flex items-center justify-center text-white text-4xl font-black">
                AA
              </div>
              <h3 className="text-2xl font-black text-gray-900 text-center mb-2">Achumboro Ataande, Esq.</h3>
              <p className="text-center text-yellow-600 font-bold mb-4">Co-Leader</p>
              <div className="space-y-4 text-gray-700 text-center">
                <p className="text-gray-500 italic">Legal and Policy Strategy</p>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-xl border-t-4 border-red-500">
              <div className="w-32 h-32 bg-gradient-to-br from-red-600 to-red-800 rounded-full mx-auto mb-6 flex items-center justify-center text-white text-4xl font-black">
                LC
              </div>
              <h3 className="text-2xl font-black text-gray-900 text-center mb-2">Rev. Lorenzo Daughtry-Chambers</h3>
              <p className="text-center text-red-600 font-bold mb-4">Co-Leader</p>
              <div className="space-y-4 text-gray-700 text-center">
                <p className="text-gray-500 italic">Strategic Operations & US Engagement</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mental Decolonization */}
      <section className="py-20 bg-gradient-to-r from-red-900 via-yellow-900 to-green-900 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-8">
            MENTAL DECOLONIZATION
          </h2>
          <p className="text-xl mb-8 leading-relaxed">
            "Most of our people are in mental slavery" — but we can change this.
          </p>

          <div className="grid md:grid-cols-2 gap-8 mt-12">
            <div className="bg-white/10 p-8 rounded-2xl backdrop-blur">
              <h3 className="text-2xl font-black mb-4">🧠 THE CHALLENGE</h3>
              <ul className="space-y-3 text-left">
                <li>• Seeing Westerners as superior</li>
                <li>• Tribal mentality over continental consciousness</li>
                <li>• Self-doubt and inferiority complex</li>
                <li>• Dependence on external validation</li>
              </ul>
            </div>

            <div className="bg-white/10 p-8 rounded-2xl backdrop-blur">
              <h3 className="text-2xl font-black mb-4">✨ THE SOLUTION</h3>
              <ul className="space-y-3 text-left">
                <li>• Self-empowerment curriculum</li>
                <li>• Continental consciousness education</li>
                <li>• <strong>"We are not inferior. We are the future."</strong></li>
                <li>• Pride in African innovation and achievement</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );

  const VisionPage = () => (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-r from-green-900 via-yellow-900 to-red-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-black mb-6">THE 12 OPERATIONAL PILLARS</h1>
          <p className="text-xl max-w-4xl mx-auto">
            Systematic transformation of Africa through strategic unity initiatives.
            Each pillar builds continental capacity and addresses specific challenges.
          </p>
        </div>
      </section>

      {/* Lead Initiative - Visa-Free Movement */}
      <section className="py-20 bg-gradient-to-r from-red-600 via-yellow-600 to-green-600 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-block bg-white text-red-900 px-8 py-4 rounded-full font-black text-xl mb-6">
              ⭐ PILLAR #1: LEAD INITIATIVE - HIGHEST PRIORITY ⭐
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              VISA-FREE MOVEMENT / OPEN BORDERS
            </h2>
            <p className="text-xl max-w-4xl mx-auto mb-8">
              People are 'grieving' for freedom of movement. This is the most tangible,
              immediate benefit of unity that every African can understand.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 mb-12">
            <div className="bg-white/10 p-8 rounded-2xl backdrop-blur">
              <h3 className="text-2xl font-black mb-6">🚫 THE CURRENT ABSURDITY</h3>
              <ul className="space-y-4 text-lg">
                <li>• A Ghanaian nurse needs a visa to work in Kenya</li>
                <li>• Millions of qualified professionals unemployed while continent has massive shortages</li>
                <li>• African entrepreneurs face more barriers in Africa than in Europe</li>
                <li>• Families separated by arbitrary colonial borders</li>
              </ul>
            </div>

            <div className="bg-white/10 p-8 rounded-2xl backdrop-blur">
              <h3 className="text-2xl font-black mb-6">✅ "UNITY FOR OPPORTUNITIES"</h3>
              <ul className="space-y-4 text-lg">
                <li>• <strong>One Africa, one passport, no barriers</strong></li>
                <li>• Nurses flow to where healing is needed</li>
                <li>• Teachers reach students across the continent</li>
                <li>• When talent flows freely, everyone wins</li>
              </ul>
            </div>
          </div>

          <div className="text-center">
            <div className="inline-block bg-yellow-500 text-gray-900 px-8 py-4 rounded-2xl font-black text-xl">
              Freedom of movement = Freedom of opportunity
            </div>
          </div>
        </div>
      </section>

      {/* Pillar 2: Economic Sovereignty */}
      <section className="py-20 bg-gradient-to-br from-yellow-50 via-white to-green-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-8 rounded-2xl border-2 border-yellow-400 mb-12">
            <div className="text-center mb-8">
              <div className="inline-block bg-yellow-600 text-white px-6 py-3 rounded-full font-black text-lg mb-4">
                ⭐ PILLAR #2: COMMON MARKET & ECONOMIC SOVEREIGNTY
              </div>
              <h2 className="text-4xl font-black text-yellow-900 mb-4">THE RESOURCE PRICING PROBLEM</h2>
              <p className="text-xl text-gray-700 max-w-4xl mx-auto">
                When 54 nations each negotiate separately for their resources, buyers can play nations against each other,
                extract without fair compensation, and dictate terms to desperate sellers.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-xl">
                <h3 className="text-2xl font-black text-red-900 mb-4">🚨 Current System</h3>
                <ul className="text-gray-700 space-y-2">
                  <li>• Ghana negotiates gold prices alone</li>
                  <li>• Nigeria negotiates oil prices alone</li>
                  <li>• Congo negotiates coltan prices alone</li>
                  <li>• <strong>Result: World market dictates African prices</strong></li>
                </ul>
              </div>

              <div className="bg-white p-6 rounded-xl">
                <h3 className="text-2xl font-black text-green-900 mb-4">✅ Continental Solution</h3>
                <p className="text-gray-700 mb-4"><strong>Continental Commodity Councils:</strong></p>
                <ul className="text-gray-700 space-y-2 text-sm">
                  <li>• <strong>African Gold Council</strong> - All gold producers unite</li>
                  <li>• <strong>African Diamond Council</strong> - Coordinate pricing & production</li>
                  <li>• <strong>African Oil Council</strong> - Like OPEC but continental</li>
                  <li>• <strong>African Coffee/Cocoa Councils</strong> - Fair farmer pricing</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pillar 3: Mental Decolonization */}
      <section className="py-20 bg-gradient-to-r from-red-900 via-yellow-900 to-green-900 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-block bg-white text-red-900 px-6 py-3 rounded-full font-black text-lg mb-4">
              ⭐ PILLAR #3: THE MOST CRITICAL PILLAR
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              MENTAL DECOLONIZATION & MINDSET TRANSFORMATION
            </h2>
            <p className="text-xl max-w-4xl mx-auto mb-4">
              "Most of our people are in mental slavery." - Dr. Michael N.K. Nkrumah
            </p>
            <p className="text-lg max-w-3xl mx-auto text-gray-200">
              Without addressing this, all other pillars fail. Many Africans unconsciously view
              Westerners as 'high rank' and themselves as lower.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white/10 p-8 rounded-2xl backdrop-blur">
              <h3 className="text-2xl font-black mb-6">🧠 THE CHALLENGE</h3>
              <ul className="space-y-3 text-lg">
                <li>• Colonial education systems taught African inferiority</li>
                <li>• Unconscious bias toward Western 'superiority'</li>
                <li>• Tribal mentality over continental consciousness</li>
                <li>• Self-doubt and dependency on external validation</li>
              </ul>
            </div>

            <div className="bg-white/10 p-8 rounded-2xl backdrop-blur">
              <h3 className="text-2xl font-black mb-6">✨ THE SELF-EMPOWERMENT CURRICULUM</h3>
              <ul className="space-y-3 text-lg">
                <li>• Pan-African history (ancient civilizations, innovations)</li>
                <li>• Economics of colonization (how extraction works)</li>
                <li>• Continental consciousness building</li>
                <li>• <strong>'Know Your Worth' campaigns</strong></li>
              </ul>
            </div>
          </div>

          <div className="text-center">
            <div className="inline-block bg-green-500 text-white px-8 py-4 rounded-2xl font-black text-xl">
              We must 'rewind and rephrase' colonial conditioning
            </div>
          </div>
        </div>
      </section>

      {/* Supporting Pillars 4-12 */}
      <section className="py-20 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-black text-gray-900 mb-4 text-center">SUPPORTING INFRASTRUCTURE PILLARS</h2>
          <p className="text-xl text-gray-600 text-center mb-16 max-w-4xl mx-auto">
            Nine additional pillars that build continental capacity and create the foundation for unity
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {/* Pillar 4: Agriculture */}
            <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-green-500">
              <div className="text-4xl mb-4 text-center">🌾</div>
              <h3 className="text-xl font-black text-gray-900 mb-3">PILLAR 4: Agriculture & Food Sovereignty</h3>
              <p className="text-sm text-gray-600 mb-3"><strong>Learning from Israel Model:</strong></p>
              <p className="text-sm text-gray-700 mb-2">Africa imports $35+ billion in food annually despite vast arable land.</p>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• Continental food security networks</li>
                <li>• Agricultural modernization</li>
                <li>• 'Made in Africa' food brands</li>
              </ul>
            </div>

            {/* Pillar 5: Technology */}
            <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-blue-500">
              <div className="text-4xl mb-4 text-center">🏭</div>
              <h3 className="text-xl font-black text-gray-900 mb-3">PILLAR 5: Technology & Manufacturing</h3>
              <p className="text-sm text-gray-600 mb-3"><strong>Learning from China Model:</strong></p>
              <p className="text-sm text-gray-700 mb-2">Youth access to production changes mindsets through creation.</p>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• Assembly & light manufacturing</li>
                <li>• Special Economic Zones</li>
                <li>• African-designed products</li>
              </ul>
            </div>

            {/* Pillar 6: Continental Military */}
            <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-red-500">
              <div className="text-4xl mb-4 text-center">🛡️</div>
              <h3 className="text-xl font-black text-gray-900 mb-3">PILLAR 6: Continental Military & Defense</h3>
              <p className="text-sm text-gray-600 mb-3"><strong>Israel National Service Model:</strong></p>
              <p className="text-sm text-gray-700 mb-2">Military service includes skills development and benefits package.</p>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• Continental defense force</li>
                <li>• Skills training (nursing, tech, engineering)</li>
                <li>• Continental consciousness building</li>
              </ul>
            </div>

            {/* Pillar 7: Healthcare */}
            <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-green-600">
              <div className="text-4xl mb-4 text-center">🏥</div>
              <h3 className="text-xl font-black text-gray-900 mb-3">PILLAR 7: Healthcare & Professional Mobility</h3>
              <p className="text-sm text-gray-700 mb-2">Continental healthcare system with professional mobility.</p>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• Nurses in Ghana can work in Botswana</li>
                <li>• End healthcare worker unemployment</li>
                <li>• Continental medical standards</li>
              </ul>
            </div>

            {/* Pillar 8: Education */}
            <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-yellow-500">
              <div className="text-4xl mb-4 text-center">🎓</div>
              <h3 className="text-xl font-black text-gray-900 mb-3">PILLAR 8: Education</h3>
              <p className="text-sm text-gray-700 mb-2">Teacher mobility and unified Pan-African curriculum.</p>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• Cross-border teacher mobility</li>
                <li>• Skills training with implementation</li>
                <li>• Continental consciousness education</li>
              </ul>
            </div>

            {/* Pillar 9: Transportation */}
            <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-purple-500">
              <div className="text-4xl mb-4 text-center">🚗</div>
              <h3 className="text-xl font-black text-gray-900 mb-3">PILLAR 9: Transportation</h3>
              <p className="text-sm text-gray-700 mb-2">Physical infrastructure enabling movement and commerce.</p>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• Trans-African highways</li>
                <li>• Continental rail system</li>
                <li>• Port modernization</li>
              </ul>
            </div>

            {/* Pillar 10: Communication & Energy */}
            <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-orange-500">
              <div className="text-4xl mb-4 text-center">📡</div>
              <h3 className="text-xl font-black text-gray-900 mb-3">PILLAR 10: Communication & Energy</h3>
              <p className="text-sm text-gray-700 mb-2">Digital infrastructure and continental power grids.</p>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• Data sovereignty</li>
                <li>• Continental power grids</li>
                <li>• Green energy development</li>
              </ul>
            </div>

            {/* Pillar 11: Unity Messaging */}
            <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-indigo-500">
              <div className="text-4xl mb-4 text-center">🌍</div>
              <h3 className="text-xl font-black text-gray-900 mb-3">PILLAR 11: African Unity Messaging</h3>
              <p className="text-sm text-gray-700 mb-2">Evidence-based advocacy showing 54 states alone isn't working.</p>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• Even South Africa struggles alone</li>
                <li>• Unity = prosperity messaging</li>
                <li>• Continental consciousness campaigns</li>
              </ul>
            </div>

            {/* Pillar 12: Opportunity Creation */}
            <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-pink-500">
              <div className="text-4xl mb-4 text-center">🎆</div>
              <h3 className="text-xl font-black text-gray-900 mb-3">PILLAR 12: Opportunity Creation</h3>
              <p className="text-sm text-gray-700 mb-2">Bringing opportunities back to Africa, stopping brain drain.</p>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• Diaspora return programs</li>
                <li>• African innovation hubs</li>
                <li>• Continental startup ecosystem</li>
              </ul>
            </div>
          </div>

          {/* Summary Overview */}
          <div className="bg-gray-900 text-white p-8 rounded-2xl">
            <h3 className="text-3xl font-black text-yellow-400 mb-6 text-center">ALL 12 PILLARS: SYSTEMATIC TRANSFORMATION</h3>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="bg-gray-800 p-4 rounded-lg text-center">
                <div className="text-2xl mb-2">🛢</div>
                <div className="font-bold text-sm text-red-300">Visa-Free Travel</div>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg text-center">
                <div className="text-2xl mb-2">💰</div>
                <div className="font-bold text-sm text-yellow-300">Economic Unity</div>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg text-center">
                <div className="text-2xl mb-2">🧠</div>
                <div className="font-bold text-sm text-green-300">Mental Liberation</div>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg text-center">
                <div className="text-2xl mb-2">🌾</div>
                <div className="font-bold text-sm text-blue-300">Agriculture</div>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg text-center">
                <div className="text-2xl mb-2">🏭</div>
                <div className="font-bold text-sm text-purple-300">Tech/Manufacturing</div>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg text-center">
                <div className="text-2xl mb-2">🛡️</div>
                <div className="font-bold text-sm text-red-300">Continental Military</div>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg text-center">
                <div className="text-2xl mb-2">🏥</div>
                <div className="font-bold text-sm text-green-300">Healthcare</div>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg text-center">
                <div className="text-2xl mb-2">🎓</div>
                <div className="font-bold text-sm text-yellow-300">Education</div>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg text-center">
                <div className="text-2xl mb-2">🚗</div>
                <div className="font-bold text-sm text-orange-300">Transportation</div>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg text-center">
                <div className="text-2xl mb-2">📡</div>
                <div className="font-bold text-sm text-pink-300">Communication</div>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg text-center">
                <div className="text-2xl mb-2">🌍</div>
                <div className="font-bold text-sm text-indigo-300">Unity Messaging</div>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg text-center">
                <div className="text-2xl mb-2">🎆</div>
                <div className="font-bold text-sm text-cyan-300">Opportunities</div>
              </div>
            </div>
          </div>
        </div>
      </section>
        </div>
      </section>

      {/* Chinese Model */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-black mb-4 text-center text-yellow-400">Learning from Success</h2>
          <p className="text-xl text-gray-300 text-center mb-16">
            The Chinese Model: How unity and production built pride
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-800 p-8 rounded-xl border-2 border-yellow-500">
              <h3 className="text-2xl font-black text-yellow-400 mb-4">What China Did Right</h3>
              <ul className="space-y-3 text-gray-300">
                <li>• Gave youth access to manufacturing</li>
                <li>• Changed mindsets through production</li>
                <li>• Built pride in "Made in China"</li>
                <li>• United diverse regions under one vision</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-green-900 to-green-800 p-8 rounded-xl border-2 border-green-400">
              <h3 className="text-2xl font-black text-green-400 mb-4">Africa Can Do Better</h3>
              <ul className="space-y-3 text-white font-medium">
                <li>• Build "Made in Africa" pride</li>
                <li>• Youth-led manufacturing revolution</li>
                <li>• Continental production networks</li>
                <li>• African solutions for African markets</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );

  const GetInvolvedPage = () => (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-r from-green-900 via-yellow-900 to-red-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-black mb-6">GET INVOLVED</h1>
          <p className="text-xl max-w-3xl mx-auto">
            The movement needs you. Economic sovereignty requires collective action.
          </p>
        </div>
      </section>

      {/* Petition Section */}
      <section className="py-20 bg-gradient-to-br from-red-50 via-yellow-50 to-green-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-red-600 via-yellow-600 to-green-600 p-8 rounded-2xl text-white text-center mb-16">
            <h2 className="text-4xl font-black mb-6">🗳️ SIGN THE PETITION</h2>
            <p className="text-xl mb-8">
              Demand continental unity, economic sovereignty, and visa-free movement for all Africans
            </p>
            <div className="bg-white/20 p-6 rounded-xl backdrop-blur mb-6">
              <div className="text-3xl font-black mb-2">124,847</div>
              <div className="text-lg">Signatures and counting...</div>
            </div>
            <button className="bg-white text-red-900 px-8 py-4 rounded-xl font-black text-lg hover:bg-gray-100 transition transform hover:scale-105 shadow-xl">
              Add Your Voice →
            </button>
          </div>
        </div>
      </section>

      {/* Donation Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-gray-900 mb-6">STRATEGIC INVESTMENT IN CONTINENTAL TRANSFORMATION</h2>
            <div className="bg-yellow-100 border-2 border-yellow-500 p-4 rounded-lg inline-block mb-6">
              <p className="text-yellow-800 font-bold">Hope for Africans Foundation - 501(c)(3) Application in Process</p>
            </div>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-8">
              This is not charity—this is strategic investment in the economic sovereignty and continental transformation
              of 1.4 billion people. Your investment builds the infrastructure for African unity and prosperity.
            </p>
            <div className="bg-gray-900 text-white p-6 rounded-xl max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold text-yellow-400 mb-4">The Strategic Framework You're Funding</h3>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="font-bold text-green-300">• 3 Foundational Pillars</div>
                  <div className="text-gray-300">Economic liberation, human capital optimization, psychological decolonization</div>
                </div>
                <div>
                  <div className="font-bold text-yellow-300">• 12 Operational Pillars</div>
                  <div className="text-gray-300">Systematic transformation across all sectors</div>
                </div>
                <div>
                  <div className="font-bold text-red-300">• Dual Organization Model</div>
                  <div className="text-gray-300">Humanitarian impact + advocacy/organizing</div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {/* One-Time Donation */}
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-8 rounded-2xl border-2 border-yellow-500">
              <div className="text-center">
                <div className="text-5xl mb-4">💫</div>
                <h3 className="text-2xl font-black text-yellow-900 mb-3">One-Time Impact</h3>
                <p className="text-gray-700 mb-6">
                  Immediate support for economic sovereignty and unity initiatives
                </p>

                <div className="grid grid-cols-2 gap-2 mb-6">
                  <button className="bg-white border-2 border-yellow-600 text-yellow-900 py-3 rounded-lg font-bold hover:bg-yellow-50">$25</button>
                  <button className="bg-white border-2 border-yellow-600 text-yellow-900 py-3 rounded-lg font-bold hover:bg-yellow-50">$100</button>
                  <button className="bg-white border-2 border-yellow-600 text-yellow-900 py-3 rounded-lg font-bold hover:bg-yellow-50">$500</button>
                  <button className="bg-white border-2 border-yellow-600 text-yellow-900 py-3 rounded-lg font-bold hover:bg-yellow-50">$1,000</button>
                </div>

                <button className="w-full bg-yellow-600 text-white py-3 rounded-lg font-bold hover:bg-yellow-700 transition">
                  Donate Now
                </button>
              </div>
            </div>

            {/* Monthly Partnership */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-2xl border-2 border-green-500 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-2 rounded-full font-black text-sm">
                MOST IMPACT
              </div>
              <div className="text-center mt-4">
                <div className="text-5xl mb-4">🌱</div>
                <h3 className="text-2xl font-black text-green-900 mb-3">Monthly Partnership</h3>
                <p className="text-gray-700 mb-6">
                  Sustained support for long-term continental transformation
                </p>
                <div className="space-y-3 mb-6">
                  <div className="bg-white p-3 rounded-lg">
                    <div className="font-black text-green-900">$25/month</div>
                    <div className="text-sm text-gray-600">Unity Builder</div>
                  </div>
                  <div className="bg-white p-3 rounded-lg">
                    <div className="font-black text-green-900">$100/month</div>
                    <div className="text-sm text-gray-600">Sovereignty Supporter</div>
                  </div>
                  <div className="bg-white p-3 rounded-lg">
                    <div className="font-black text-green-900">$500/month</div>
                    <div className="text-sm text-gray-600">Continental Champion</div>
                  </div>
                </div>
                <button className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition">
                  Become a Partner
                </button>
              </div>
            </div>

            {/* Strategic Investment */}
            <div className="bg-gradient-to-br from-red-50 to-red-100 p-8 rounded-2xl border-2 border-red-500">
              <div className="text-center">
                <div className="text-5xl mb-4">🏆</div>
                <h3 className="text-2xl font-black text-red-900 mb-3">Strategic Investment</h3>
                <p className="text-gray-700 mb-6">
                  Major funding for systemic change and continental programs
                </p>
                <div className="space-y-3 mb-6 text-left">
                  <div className="bg-white p-4 rounded-lg">
                    <div className="font-black text-red-900 mb-1">$5,000+</div>
                    <div className="text-sm text-gray-600">Program Sponsor</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <div className="font-black text-red-900 mb-1">$25,000+</div>
                    <div className="text-sm text-gray-600">Regional Impact</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <div className="font-black text-red-900 mb-1">$100,000+</div>
                    <div className="text-sm text-gray-600">Continental Transformation</div>
                  </div>
                </div>
                <button className="w-full bg-red-600 text-white py-3 rounded-lg font-bold hover:bg-red-700 transition">
                  Discuss Investment
                </button>
              </div>
            </div>
          </div>

          {/* What Donations Support */}
          <div className="bg-gray-100 rounded-2xl p-8">
            <h3 className="text-3xl font-black text-gray-900 mb-8 text-center">Your Investment Builds</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-xl text-center">
                <div className="text-4xl font-black text-yellow-600 mb-2">💰</div>
                <div className="font-bold text-gray-900 mb-2">Economic Sovereignty</div>
                <p className="text-sm text-gray-600">Initiatives for pricing power and resource control</p>
              </div>
              <div className="bg-white p-6 rounded-xl text-center">
                <div className="text-4xl font-black text-green-600 mb-2">🛂</div>
                <div className="font-bold text-gray-900 mb-2">Visa-Free Movement</div>
                <p className="text-sm text-gray-600">Advocacy for continental freedom of movement</p>
              </div>
              <div className="bg-white p-6 rounded-xl text-center">
                <div className="text-4xl font-black text-red-600 mb-2">🧠</div>
                <div className="font-bold text-gray-900 mb-2">Mental Liberation</div>
                <p className="text-sm text-gray-600">Decolonization curriculum and consciousness programs</p>
              </div>
              <div className="bg-white p-6 rounded-xl text-center">
                <div className="text-4xl font-black text-blue-600 mb-2">🌍</div>
                <div className="font-bold text-gray-900 mb-2">On-Ground Programs</div>
                <p className="text-sm text-gray-600">Direct impact in African communities</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Other Ways to Get Involved */}
      <section className="py-20 bg-gradient-to-br from-gray-50 via-yellow-50 to-green-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-black text-gray-900 mb-12 text-center">More Ways to Join</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl border-2 border-red-300 text-center">
              <div className="text-4xl mb-4">📢</div>
              <h3 className="text-xl font-bold text-red-900 mb-2">Share the Message</h3>
              <p className="text-gray-600 text-sm">Spread awareness on social media and in your communities</p>
            </div>
            <div className="bg-white p-6 rounded-xl border-2 border-yellow-300 text-center">
              <div className="text-4xl mb-4">👥</div>
              <h3 className="text-xl font-bold text-yellow-900 mb-2">Join the Movement</h3>
              <p className="text-gray-600 text-sm">Register as a supporter and receive updates</p>
            </div>
            <div className="bg-white p-6 rounded-xl border-2 border-green-300 text-center">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="text-xl font-bold text-green-900 mb-2">Volunteer</h3>
              <p className="text-gray-600 text-sm">Contribute your skills and time to the cause</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );

  const ImpactPage = () => (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-r from-yellow-900 via-green-900 to-red-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-black mb-6">HISTORICAL FOUNDATION</h1>
          <p className="text-xl max-w-4xl mx-auto">
            Dr. Kwame Nkrumah's vision and the proven success of unity movements worldwide.
            Building on 60+ years of Pan-African thought and global precedents.
          </p>
        </div>
      </section>

      {/* Dr. Kwame Nkrumah's Original Vision */}
      <section className="py-20 bg-gradient-to-br from-yellow-50 via-white to-green-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-2xl border-2 border-green-400 mb-16">
            <h2 className="text-4xl font-black text-green-900 mb-8 text-center">DR. KWAME NKRUMAH'S ORIGINAL VISION</h2>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="bg-white p-6 rounded-xl">
                <h3 className="text-2xl font-bold text-green-800 mb-4">The Visionary Leader</h3>
                <ul className="space-y-3 text-gray-700">
                  <li>• <strong>First President of Ghana (1957-1966)</strong></li>
                  <li>• Leading Pan-Africanist and independence advocate</li>
                  <li>• Organized the first All-African People's Conference (1958)</li>
                  <li>• Founded the Organization of African Unity precursor</li>
                </ul>
              </div>

              <div className="bg-white p-6 rounded-xl">
                <h3 className="text-2xl font-bold text-green-800 mb-4">Core Beliefs</h3>
                <ul className="space-y-3 text-gray-700">
                  <li>• <strong>African unity is existential necessity</strong></li>
                  <li>• Warning: "Unite or perish"</li>
                  <li>• Political union + economic integration</li>
                  <li>• Social solidarity across the continent</li>
                </ul>
              </div>
            </div>

            <div className="bg-gray-900 text-white p-8 rounded-xl">
              <h3 className="text-2xl font-bold text-yellow-400 mb-4 text-center">Nkrumah's Framework for Unity</h3>
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-4xl mb-2">🏛️</div>
                  <div className="text-xl font-bold text-yellow-300">Political Union</div>
                  <div className="text-sm text-gray-300">United States of Africa government</div>
                </div>
                <div>
                  <div className="text-4xl mb-2">💰</div>
                  <div className="text-xl font-bold text-green-300">Economic Integration</div>
                  <div className="text-sm text-gray-300">Common market & currency</div>
                </div>
                <div>
                  <div className="text-4xl mb-2">🤝</div>
                  <div className="text-xl font-bold text-red-300">Social Solidarity</div>
                  <div className="text-sm text-gray-300">Continental consciousness</div>
                </div>
              </div>
            </div>
          </div>

          {/* Why Unity Worked for Others */}
          <div className="mb-16">
            <h2 className="text-4xl font-black text-gray-900 mb-8 text-center">GLOBAL UNITY SUCCESS STORIES</h2>
            <p className="text-xl text-gray-600 text-center mb-12 max-w-4xl mx-auto">
              History proves that diverse regions can unite successfully. Africa has more in common than these examples had.
            </p>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-2xl border-2 border-blue-400">
                <h3 className="text-2xl font-black text-blue-900 mb-4">🇺🇸 United States (1776-1789)</h3>
                <div className="space-y-3 text-gray-700">
                  <p><strong>Challenge:</strong> 13 colonies with different economies, cultures, and interests</p>
                  <p><strong>Solution:</strong> Federal system balancing state autonomy with central coordination</p>
                  <p><strong>Result:</strong> World's largest economy and global superpower</p>
                  <div className="bg-blue-200 p-3 rounded text-sm">
                    <strong>Lesson:</strong> Diverse regions can maintain identity while gaining collective strength
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-8 rounded-2xl border-2 border-orange-400">
                <h3 className="text-2xl font-black text-orange-900 mb-4">🇮🇳 India (1947-Present)</h3>
                <div className="space-y-3 text-gray-700">
                  <p><strong>Challenge:</strong> 300+ languages, massive population, religious diversity</p>
                  <p><strong>Solution:</strong> Federal democracy with linguistic states and cultural autonomy</p>
                  <p><strong>Result:</strong> Emerging global power with unified foreign policy</p>
                  <div className="bg-orange-200 p-3 rounded text-sm">
                    <strong>Lesson:</strong> Unity doesn't require uniformity—diversity can be strength
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-red-50 to-red-100 p-8 rounded-2xl border-2 border-red-400">
                <h3 className="text-2xl font-black text-red-900 mb-4">🇨🇳 China (1949-Present)</h3>
                <div className="space-y-3 text-gray-700">
                  <p><strong>Challenge:</strong> Vast geography, multiple ethnic groups, varied development levels</p>
                  <p><strong>Solution:</strong> Central coordination with regional economic specialization</p>
                  <p><strong>Result:</strong> World's second-largest economy, global manufacturing hub</p>
                  <div className="bg-red-200 p-3 rounded text-sm">
                    <strong>Lesson:</strong> Coordinated development can lift entire regions simultaneously
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-2xl border-2 border-purple-400">
                <h3 className="text-2xl font-black text-purple-900 mb-4">🇪🇺 European Union (1993-Present)</h3>
                <div className="space-y-3 text-gray-700">
                  <p><strong>Challenge:</strong> Historical enemies, different languages, competing economies</p>
                  <p><strong>Solution:</strong> Economic integration first, then political cooperation</p>
                  <p><strong>Result:</strong> World's largest trading bloc, peace among former enemies</p>
                  <div className="bg-purple-200 p-3 rounded text-sm">
                    <strong>Lesson:</strong> Economic integration creates peace and prosperity
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Why Unity is Essential for Africa */}
          <div className="bg-gray-900 text-white p-8 rounded-2xl mb-16">
            <h2 className="text-4xl font-black text-yellow-400 mb-8 text-center">WHY UNITY IS ESSENTIAL FOR AFRICA</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-2xl font-bold text-red-300 mb-4">🚨 Current Vulnerabilities</h3>
                <ul className="space-y-3 text-gray-300">
                  <li>• Small fragmented nations easily exploited economically</li>
                  <li>• Cannot defend sovereignty individually</li>
                  <li>• Resource curse: Division allows extraction without benefit</li>
                  <li>• No global influence without collective voice</li>
                  <li>• Brain drain to more unified regions</li>
                </ul>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-green-300 mb-4">💪 Unity Advantages</h3>
                <ul className="space-y-3 text-gray-300">
                  <li>• <strong>1.4 billion people united = instant superpower</strong></li>
                  <li>• Collective bargaining power for resources</li>
                  <li>• Continental market for African businesses</li>
                  <li>• Shared infrastructure development costs</li>
                  <li>• Cultural exchange and innovation</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Current Progress */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-2xl border-2 border-green-400">
            <h2 className="text-3xl font-black text-green-900 mb-6 text-center">MOVEMENT BUILDING PHASE: CURRENT PROGRESS</h2>
            <p className="text-lg text-gray-700 mb-8 text-center max-w-4xl mx-auto">
              We're in the foundation-building phase, organizing global support for Dr. Nkrumah's 54-country tour
              and building the infrastructure for continental economic sovereignty.
            </p>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-xl text-center">
                <div className="text-4xl font-black text-green-600 mb-2">124,847</div>
                <div className="font-bold text-gray-900 mb-1">Petition Signatures</div>
                <div className="text-sm text-gray-600">Growing daily across all continents</div>
              </div>
              <div className="bg-white p-6 rounded-xl text-center">
                <div className="text-4xl font-black text-yellow-600 mb-2">54</div>
                <div className="font-bold text-gray-900 mb-1">Countries to Visit</div>
                <div className="text-sm text-gray-600">Dr. Nkrumah's Continental Unity Tour</div>
              </div>
              <div className="bg-white p-6 rounded-xl text-center">
                <div className="text-4xl font-black text-red-600 mb-2">12</div>
                <div className="font-bold text-gray-900 mb-1">Operational Pillars</div>
                <div className="text-sm text-gray-600">Comprehensive transformation framework</div>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={() => setCurrentPage('involved')}
                className="bg-green-600 text-white px-8 py-4 rounded-xl font-black text-lg hover:bg-green-700 transition transform hover:scale-105 shadow-xl mr-4"
              >
                Join the Movement
              </button>
              <button
                onClick={() => setCurrentPage('framework')}
                className="bg-yellow-600 text-white px-8 py-4 rounded-xl font-black text-lg hover:bg-yellow-700 transition transform hover:scale-105 shadow-xl"
              >
                View Strategic Framework
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );

  const ContactPage = () => (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-r from-red-900 via-yellow-900 to-green-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-black mb-6">CONNECT WITH US</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Join the movement. Build economic sovereignty. Unite Africa.
          </p>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-red-50 via-yellow-50 to-green-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-black text-gray-900 mb-6">Send Us A Message</h2>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Message</label>
                  <textarea
                    rows={6}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
                    placeholder="How can you contribute to African unity and economic sovereignty?"
                  ></textarea>
                </div>

                <button className="w-full bg-gradient-to-r from-green-600 to-yellow-600 text-white py-4 rounded-lg font-black text-lg hover:from-green-700 hover:to-yellow-700 transition">
                  Join the Movement
                </button>
              </form>
            </div>

            <div>
              <h2 className="text-3xl font-black text-gray-900 mb-6">Get In Touch</h2>

              <div className="space-y-6">
                <div className="bg-gray-50 p-6 rounded-xl border-2 border-gray-200">
                  <div className="flex items-start space-x-4">
                    <Mail className="text-green-600 mt-1" size={24} />
                    <div>
                      <h3 className="font-black text-gray-900 mb-2">Email</h3>
                      <p className="text-gray-700">info@unitedstatesofafrica.org</p>
                      <p className="text-sm text-gray-600 mt-1">We respond within 24-48 hours</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-xl border-2 border-gray-200">
                  <div className="flex items-start space-x-4">
                    <Globe className="text-yellow-600 mt-1" size={24} />
                    <div>
                      <h3 className="font-black text-gray-900 mb-2">Social Media</h3>
                      <p className="text-gray-700">Follow our continental unity journey</p>
                      <div className="mt-2 space-y-1">
                        <p className="text-sm text-gray-600">Instagram: @unitedstatesofafrica</p>
                        <p className="text-sm text-gray-600">Facebook: United States of Africa</p>
                        <p className="text-sm text-gray-600">Twitter: @UnifiedAfrica</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-xl border-2 border-gray-200">
                  <div className="flex items-start space-x-4">
                    <MapPin className="text-red-600 mt-1" size={24} />
                    <div>
                      <h3 className="font-black text-gray-900 mb-2">Movement Centers</h3>
                      <p className="text-gray-700">United States (Operations)</p>
                      <p className="text-gray-700">Ghana (Continental Leadership)</p>
                      <p className="text-sm text-gray-600 mt-1">Growing across all 54 African nations</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navigation />

      {currentPage === 'home' && <HomePage />}
      {currentPage === 'framework' && <FrameworkPage />}
      {currentPage === 'pillars' && <VisionPage />}
      {currentPage === 'organizations' && <AboutPage />}
      {currentPage === 'involved' && <GetInvolvedPage />}
      {currentPage === 'history' && <ImpactPage />}
      {currentPage === 'contact' && <ContactPage />}

      <Footer />
    </div>
  );
}