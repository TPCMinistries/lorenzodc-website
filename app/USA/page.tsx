'use client';

import React, { useState } from 'react';
import { Menu, X, Mail, Globe, MapPin } from 'lucide-react';

export default function AfricaMovementSite() {
  const [currentPage, setCurrentPage] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Home', id: 'home' },
    { name: 'About', id: 'about' },
    { name: 'The Vision', id: 'vision' },
    { name: 'Get Involved', id: 'involved' },
    { name: 'Impact', id: 'impact' },
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
              Building a unified, prosperous, and self-determined Africa through collaboration, innovation, and sustainable development.
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
          <p className="text-sm">EIN: [Pending] | 501(c)(3) Nonprofit Organization</p>
        </div>
      </div>
    </footer>
  );

  const HomePage = () => (
    <div className="min-h-screen">
      <section className="relative bg-gradient-to-br from-red-900 via-yellow-900 to-green-900 text-white py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <div className="mb-6 flex justify-center">
              <div className="w-32 h-32 bg-gradient-to-br from-red-600 via-yellow-500 to-green-600 rounded-full flex items-center justify-center border-4 border-white shadow-2xl animate-pulse">
                <span className="text-6xl">🌍</span>
              </div>
            </div>

            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
              THE DREAM FOR
              <span className="block text-yellow-300">AFRICA'S FUTURE</span>
            </h1>

            <p className="text-xl md:text-2xl mb-4 max-w-4xl mx-auto font-light leading-relaxed">
              We are building the <span className="font-bold text-yellow-300">United States of Africa</span> —
              not as a distant dream, but as a living reality.
            </p>

            <p className="text-lg md:text-xl mb-12 max-w-3xl mx-auto text-gray-200">
              A unified continent where prosperity, peace, and self-determination
              replace poverty, conflict, and exploitation. Where African solutions
              solve African challenges. Where the world comes to <span className="font-bold">build</span>,
              not just to take.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setCurrentPage('vision')}
                className="bg-yellow-500 text-gray-900 px-8 py-4 rounded-xl font-black text-lg hover:bg-yellow-400 transition transform hover:scale-105 shadow-xl"
              >
                Discover The Vision
              </button>
              <button
                onClick={() => setCurrentPage('involved')}
                className="bg-white text-red-900 px-8 py-4 rounded-xl font-black text-lg hover:bg-gray-100 transition transform hover:scale-105 shadow-xl"
              >
                Join The Movement
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-gray-50 via-yellow-50 to-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
              CHANGING THE NARRATIVE
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              For too long, the story of Africa has been written by others.
              We're rewriting it — with truth, dignity, and unstoppable momentum.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-red-50 to-red-100 p-8 rounded-2xl border-2 border-red-300">
              <div className="text-5xl mb-4">🚫</div>
              <h3 className="text-2xl font-black text-red-900 mb-3">From Poverty</h3>
              <p className="text-gray-700 mb-4">
                Not "aid dependency," but <strong>economic empowerment</strong>.
                Building businesses, creating jobs, developing industries from the ground up.
              </p>
              <div className="text-green-700 font-bold">→ TO PROSPERITY</div>
            </div>

            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-8 rounded-2xl border-2 border-yellow-300">
              <div className="text-5xl mb-4">💪</div>
              <h3 className="text-2xl font-black text-yellow-900 mb-3">From Sickness</h3>
              <p className="text-gray-700 mb-4">
                Not "medical missions," but <strong>healthcare infrastructure</strong>.
                Training doctors, building clinics, ensuring every community has access to care.
              </p>
              <div className="text-green-700 font-bold">→ TO WELLNESS</div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-2xl border-2 border-green-300">
              <div className="text-5xl mb-4">🤝</div>
              <h3 className="text-2xl font-black text-green-900 mb-3">From Conflict</h3>
              <p className="text-gray-700 mb-4">
                Not "peacekeeping," but <strong>unity and collaboration</strong>.
                Pan-African solidarity that turns division into collective strength.
              </p>
              <div className="text-green-700 font-bold">→ TO PEACE</div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-6 text-yellow-400">
              THIS IS NOT CHARITY
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              This is <strong>economic transformation</strong>. We're building sustainable businesses,
              creating jobs, and developing infrastructure — not just handing out aid.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="bg-gray-800 p-8 rounded-2xl border-2 border-yellow-500">
              <h3 className="text-2xl font-black text-yellow-400 mb-4">Traditional Approach ❌</h3>
              <ul className="space-y-3 text-gray-300">
                <li>• One-time aid & donations</li>
                <li>• External dependency</li>
                <li>• Short-term relief</li>
                <li>• Outside control</li>
                <li>• Perpetual need</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-green-900 to-green-800 p-8 rounded-2xl border-2 border-green-400">
              <h3 className="text-2xl font-black text-green-400 mb-4">Our Approach ✅</h3>
              <ul className="space-y-3 text-white font-medium">
                <li>• Build from the ground up</li>
                <li>• Local ownership & leadership</li>
                <li>• Long-term sustainability</li>
                <li>• African solutions for Africa</li>
                <li>• Self-determination</li>
              </ul>
            </div>
          </div>

          <div className="mt-12 text-center">
            <div className="inline-block bg-yellow-500 text-gray-900 px-8 py-4 rounded-2xl font-black text-xl">
              We're not bringing solutions. We're empowering Africans to build their own.
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-red-600 via-yellow-600 to-green-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-6">
            THE TIME IS NOW
          </h2>
          <p className="text-xl mb-8 leading-relaxed">
            Dr. Kwame Nkrumah said: <em>"We must unite now or perish."</em>
            <br />
            That call is more urgent today than ever before.
          </p>
          <p className="text-lg mb-10">
            Whether you're in Africa, the diaspora, or anywhere in the world —
            this movement needs you.
          </p>
          <button
            onClick={() => setCurrentPage('involved')}
            className="bg-white text-red-900 px-10 py-5 rounded-xl font-black text-xl hover:bg-gray-100 transition transform hover:scale-105 shadow-2xl"
          >
            Join The Movement Today
          </button>
        </div>
      </section>
    </div>
  );

  const AboutPage = () => (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-r from-red-900 via-yellow-900 to-green-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-black mb-6">ABOUT THE MOVEMENT</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Three leaders. One vision. A united Africa.
          </p>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-yellow-50 via-white to-green-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-black text-gray-900 mb-8 text-center">The United States of Africa Movement</h2>

          <div className="space-y-6 text-gray-700">
            <p className="text-xl leading-relaxed">
              The United States of Africa is not a new idea — it was the dream of Dr. Kwame Nkrumah,
              the first president of Ghana and one of the greatest Pan-Africanists in history.
            </p>

            <p className="text-lg leading-relaxed">
              Today, we are bringing that vision to life — not as a political slogan, but as a practical,
              actionable movement that combines economic development, cultural solidarity, and sustainable
              infrastructure building.
            </p>

            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 my-8">
              <p className="text-lg font-semibold text-gray-900 italic">
                "We face neither East nor West; we face forward."
              </p>
              <p className="text-sm text-gray-600 mt-2">— Dr. Kwame Nkrumah</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 my-8">
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border-2 border-green-300">
                <h3 className="text-2xl font-black text-green-900 mb-3">Hope for Africans Foundation</h3>
                <p className="text-gray-700">
                  Our 501(c)(3) nonprofit arm focused on immediate community impact —
                  education, healthcare access, feeding programs, and emergency relief.
                </p>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border-2 border-blue-300">
                <h3 className="text-2xl font-black text-blue-900 mb-3">United States of Africa Movement</h3>
                <p className="text-gray-700">
                  The broader global movement for anyone, anywhere, to support African unity,
                  economic empowerment, and self-determination.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-black text-gray-900 mb-4 text-center">THE CO-LEADERS</h2>
          <p className="text-xl text-gray-600 text-center mb-16 max-w-3xl mx-auto">
            Three visionaries united in purpose, each bringing unique strengths to build Africa's future.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-xl border-t-4 border-green-500">
              <div className="w-32 h-32 bg-gradient-to-br from-green-600 to-green-800 rounded-full mx-auto mb-6 flex items-center justify-center text-white text-4xl font-black">
                MN
              </div>
              <h3 className="text-2xl font-black text-gray-900 text-center mb-2">Rev. Dr. Michael Nkrumah</h3>
              <p className="text-center text-green-600 font-bold mb-4">Chairman</p>

              <div className="space-y-4 text-gray-700">
                <p className="font-semibold text-gray-900">Background:</p>
                <ul className="space-y-2 text-sm">
                  <li>• Grandson of Dr. Kwame Nkrumah</li>
                  <li>• Ghana-based operations leader</li>
                  <li>• Pan-African network builder</li>
                  <li>• Planning 54-country tour across Africa</li>
                </ul>

                <p className="font-semibold text-gray-900 mt-6">Role in the Movement:</p>
                <p className="text-sm">
                  On-the-ground leadership across Africa, government relations,
                  partnership building with African leaders, and carrying forward
                  his grandfather's legacy with modern execution.
                </p>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-xl border-t-4 border-yellow-500">
              <div className="w-32 h-32 bg-gradient-to-br from-yellow-600 to-yellow-800 rounded-full mx-auto mb-6 flex items-center justify-center text-white text-4xl font-black">
                AA
              </div>
              <h3 className="text-2xl font-black text-gray-900 text-center mb-2">Achumboro Ataande, Esq.</h3>
              <p className="text-center text-yellow-600 font-bold mb-4"></p>

              <div className="space-y-4 text-gray-700">
                <p className="font-semibold text-gray-900">Background:</p>
                <ul className="space-y-2 text-sm">
                  <li>• [Background details to be added]</li>
                </ul>

                <p className="font-semibold text-gray-900 mt-6">Role in the Movement:</p>
                <p className="text-sm">
                  [Role details to be added]
                </p>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-xl border-t-4 border-red-500">
              <div className="w-32 h-32 bg-gradient-to-br from-red-600 to-red-800 rounded-full mx-auto mb-6 flex items-center justify-center text-white text-5xl font-black">
                TPC
              </div>
              <h3 className="text-2xl font-black text-gray-900 text-center mb-2">Rev. Lorenzo Daughtry-Chambers</h3>
              <p className="text-center text-red-600 font-bold mb-4"></p>

              <div className="space-y-4 text-gray-700">
                <p className="font-semibold text-gray-900">Background:</p>
                <ul className="space-y-2 text-sm">
                  <li>• Founder, Global Development Institute (GDI)</li>
                  <li>• International development strategist</li>
                  <li>• 8+ years building sustainable impact programs</li>
                  <li>• AI-enabled entrepreneurship innovator</li>
                </ul>

                <p className="font-semibold text-gray-900 mt-6">Role in the Movement:</p>
                <p className="text-sm">
                  Strategic planning, organizational infrastructure, US operations,
                  fundraising, and partnership development. Bringing proven systems
                  for sustainable community development.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 bg-gradient-to-r from-red-100 via-yellow-100 to-green-100 p-8 rounded-2xl border-2 border-gray-300">
            <h3 className="text-2xl font-black text-gray-900 mb-4 text-center">United in Leadership</h3>
            <p className="text-gray-700 text-center max-w-3xl mx-auto leading-relaxed">
              Together, these three leaders bring complementary strengths: strategic infrastructure (US-based),
              cultural authenticity and movement building, and on-the-ground African leadership.
              This is not top-down leadership — it's collaborative, distributed, and designed for maximum impact.
            </p>
          </div>
        </div>
      </section>
    </div>
  );

  const VisionPage = () => (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-r from-green-900 via-yellow-900 to-red-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-black mb-6">THE VISION</h1>
          <p className="text-xl max-w-3xl mx-auto">
            A concrete roadmap for Africa's transformation — not in a century, but in our lifetime.
          </p>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-white via-green-50 to-yellow-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-black text-gray-900 mb-8 text-center">What Is The Dream?</h2>

          <div className="space-y-6 text-gray-700">
            <p className="text-xl leading-relaxed font-semibold text-gray-900">
              The dream is to make Africa the <em>destination of choice</em> for the world's
              entrepreneurs, investors, families, and visionaries.
            </p>

            <p className="text-lg leading-relaxed">
              Not because of what outsiders can extract, but because of what Africans are building.
              Not out of sympathy, but out of opportunity. Not for aid, but for partnership.
            </p>

            <div className="bg-gradient-to-r from-green-50 to-yellow-50 p-8 rounded-2xl border-2 border-green-300 my-10">
              <h3 className="text-2xl font-black text-green-900 mb-4">The Dream Looks Like This:</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="text-green-600 mr-3 text-2xl">🌍</span>
                  <span>A businessman in Lagos can trade freely with Nairobi, Accra, and Johannesburg without bureaucratic roadblocks</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-3 text-2xl">💡</span>
                  <span>A tech startup in Kigali has the same access to capital and talent as one in San Francisco</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-3 text-2xl">🏥</span>
                  <span>A mother in rural Ghana doesn't have to choose between feeding her children and getting them medical care</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-3 text-2xl">🎓</span>
                  <span>A young person in any African country can access world-class education and build a career without leaving the continent</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-black mb-4 text-center text-yellow-400">The Roadmap</h2>
          <p className="text-xl text-gray-300 text-center mb-16">
            A phased approach to continental transformation
          </p>

          <div className="space-y-8">
            <div className="bg-gray-800 p-6 rounded-xl border-l-4 border-green-500">
              <h3 className="text-2xl font-black text-green-400 mb-2">Phase 1: Foundation (2025-2026)</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• Establish Hope for Africans Foundation in the US</li>
                <li>• Launch Dr. Nkrumah's 54-country tour</li>
                <li>• Build initial partnerships and funding base</li>
              </ul>
            </div>

            <div className="bg-gray-800 p-6 rounded-xl border-l-4 border-yellow-500">
              <h3 className="text-2xl font-black text-yellow-400 mb-2">Phase 2: Proof of Concept (2026-2028)</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• Launch pilot programs in 5-10 communities</li>
                <li>• Build first sustainable business ventures</li>
                <li>• Document and share impact stories globally</li>
              </ul>
            </div>

            <div className="bg-gradient-to-r from-green-600 to-yellow-600 p-6 rounded-xl">
              <h3 className="text-2xl font-black mb-2">Phase 3: Transformation (2030+)</h3>
              <ul className="space-y-2">
                <li>• Full continental economic integration in progress</li>
                <li>• African-owned infrastructure across sectors</li>
                <li>• Self-sustaining movement with generational momentum</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-red-600 via-yellow-600 to-green-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-6">
            THIS VISION NEEDS YOU
          </h2>
          <p className="text-xl mb-10 leading-relaxed">
            Whether you're an investor, entrepreneur, community leader, or someone who simply believes
            in Africa's potential — there's a place for you in this movement.
          </p>
          <button
            onClick={() => setCurrentPage('involved')}
            className="bg-white text-red-900 px-10 py-5 rounded-xl font-black text-xl hover:bg-gray-100 transition transform hover:scale-105 shadow-2xl"
          >
            Get Involved Today
          </button>
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
            Every person. Every donation. Every action. It all matters.
          </p>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-yellow-50 via-green-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-black text-gray-900 mb-16 text-center">Choose Your Impact</h2>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {/* One-Time Gift FIRST */}
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-8 rounded-2xl border-2 border-yellow-500">
              <div className="text-center">
                <div className="text-5xl mb-4">💫</div>
                <h3 className="text-2xl font-black text-yellow-900 mb-3">One-Time Gift</h3>
                <p className="text-gray-700 mb-6">
                  Make an immediate impact with a one-time contribution to programs or operations
                </p>

                <div className="space-y-3 mb-4">
                  <label className="flex items-center justify-between bg-white p-3 rounded-lg cursor-pointer hover:bg-yellow-50 transition">
                    <span className="font-medium text-sm">Programs (Education, Healthcare, Food)</span>
                    <input type="radio" name="donation-type" className="w-5 h-5" />
                  </label>
                  <label className="flex items-center justify-between bg-white p-3 rounded-lg cursor-pointer hover:bg-yellow-50 transition">
                    <span className="font-medium text-sm">Operations (Infrastructure, Team, Growth)</span>
                    <input type="radio" name="donation-type" className="w-5 h-5" />
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-6">
                  <button className="bg-white border-2 border-yellow-600 text-yellow-900 py-2 rounded-lg font-bold hover:bg-yellow-50">$50</button>
                  <button className="bg-white border-2 border-yellow-600 text-yellow-900 py-2 rounded-lg font-bold hover:bg-yellow-50">$100</button>
                  <button className="bg-white border-2 border-yellow-600 text-yellow-900 py-2 rounded-lg font-bold hover:bg-yellow-50">$250</button>
                  <button className="bg-white border-2 border-yellow-600 text-yellow-900 py-2 rounded-lg font-bold hover:bg-yellow-50">$500</button>
                </div>

                <button className="w-full bg-yellow-600 text-white py-3 rounded-lg font-bold hover:bg-yellow-700 transition">
                  Give Now
                </button>
              </div>
            </div>

            {/* Monthly Partner SECOND */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-2xl border-2 border-green-500 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-2 rounded-full font-black text-sm">
                MOST IMPACT
              </div>
              <div className="text-center mt-4">
                <div className="text-5xl mb-4">🌱</div>
                <h3 className="text-2xl font-black text-green-900 mb-3">Monthly Partner</h3>
                <p className="text-gray-700 mb-6">
                  Sustainable support that allows us to plan long-term programs and build lasting infrastructure
                </p>
                <div className="space-y-3 mb-6">
                  <div className="bg-white p-3 rounded-lg">
                    <div className="font-black text-green-900">$25/month</div>
                    <div className="text-sm text-gray-600">Community Builder</div>
                  </div>
                  <div className="bg-white p-3 rounded-lg">
                    <div className="font-black text-green-900">$100/month</div>
                    <div className="text-sm text-gray-600">Regional Champion</div>
                  </div>
                  <div className="bg-white p-3 rounded-lg">
                    <div className="font-black text-green-900">$500/month</div>
                    <div className="text-sm text-gray-600">Continental Leader</div>
                  </div>
                </div>
                <button className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition">
                  Become a Monthly Partner
                </button>
              </div>
            </div>

            {/* Strategic Partnership THIRD */}
            <div className="bg-gradient-to-br from-red-50 to-red-100 p-8 rounded-2xl border-2 border-red-500">
              <div className="text-center">
                <div className="text-5xl mb-4">🏆</div>
                <h3 className="text-2xl font-black text-red-900 mb-3">Strategic Partnership</h3>
                <p className="text-gray-700 mb-6">
                  Fund entire programs, sponsor Dr. Nkrumah's tour, or build business ventures on the ground
                </p>
                <div className="space-y-3 mb-6 text-left">
                  <div className="bg-white p-4 rounded-lg">
                    <div className="font-black text-red-900 mb-1">$5,000 - $25,000</div>
                    <div className="text-sm text-gray-600">Sponsor a community project</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <div className="font-black text-red-900 mb-1">$25,000 - $100,000</div>
                    <div className="text-sm text-gray-600">Fund regional operations</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <div className="font-black text-red-900 mb-1">$100,000+</div>
                    <div className="text-sm text-gray-600">Continental impact partner</div>
                  </div>
                </div>
                <button className="w-full bg-red-600 text-white py-3 rounded-lg font-bold hover:bg-red-700 transition">
                  Discuss Partnership
                </button>
              </div>
            </div>
          </div>

          <div className="bg-gray-100 rounded-2xl p-8">
            <h3 className="text-3xl font-black text-gray-900 mb-8 text-center">Your Impact In Action</h3>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-xl text-center">
                <div className="text-4xl font-black text-green-600 mb-2">$25</div>
                <div className="font-bold text-gray-900 mb-2">Education Kit</div>
                <p className="text-sm text-gray-600">School supplies for 5 children</p>
              </div>
              <div className="bg-white p-6 rounded-xl text-center">
                <div className="text-4xl font-black text-yellow-600 mb-2">$100</div>
                <div className="font-bold text-gray-900 mb-2">Family Health</div>
                <p className="text-sm text-gray-600">Medical resources for 1 month</p>
              </div>
              <div className="bg-white p-6 rounded-xl text-center">
                <div className="text-4xl font-black text-red-600 mb-2">$500</div>
                <div className="font-bold text-gray-900 mb-2">Business Launch</div>
                <p className="text-sm text-gray-600">Seed capital for entrepreneur</p>
              </div>
              <div className="bg-white p-6 rounded-xl text-center">
                <div className="text-4xl font-black text-blue-600 mb-2">$2,500</div>
                <div className="font-bold text-gray-900 mb-2">Community Project</div>
                <p className="text-sm text-gray-600">Full program for a village</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-green-50 via-white to-yellow-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-green-50 to-yellow-50 p-10 rounded-2xl border-2 border-green-300">
            <h2 className="text-3xl font-black text-gray-900 mb-6 text-center">Our Commitment to You</h2>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-5xl font-black text-green-600 mb-2">100%</div>
                <p className="font-bold text-gray-900">Program donations go directly to programs</p>
              </div>
              <div className="text-center">
                <div className="text-5xl font-black text-yellow-600 mb-2">💯</div>
                <p className="font-bold text-gray-900">Full transparency in all financial reporting</p>
              </div>
              <div className="text-center">
                <div className="text-5xl font-black text-red-600 mb-2">📊</div>
                <p className="font-bold text-gray-900">Regular impact updates with real stories</p>
              </div>
            </div>

            <div className="mt-8 text-center">
              <p className="text-gray-700 mb-4">
                <strong>Tax-Deductible:</strong> Hope for Africans Foundation is a 501(c)(3) nonprofit.
                All donations are tax-deductible to the fullest extent allowed by law.
              </p>
              <p className="text-sm text-gray-600">EIN: [Pending]</p>
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
          <h1 className="text-5xl md:text-6xl font-black mb-6">IMPACT & STORIES</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Real people. Real communities. Real transformation.
          </p>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-yellow-50 via-green-50 to-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-br from-yellow-50 to-green-50 p-12 rounded-2xl border-2 border-green-300">
            <div className="text-7xl mb-6">🚀</div>
            <h2 className="text-4xl font-black text-gray-900 mb-6">We're Just Getting Started</h2>
            <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto">
              As we launch operations in 2025-2026, this page will showcase impact stories,
              financial transparency, program updates, and chronicles from Dr. Nkrumah's 54-country tour.
            </p>

            <div className="mt-12">
              <button
                onClick={() => setCurrentPage('involved')}
                className="bg-green-600 text-white px-8 py-4 rounded-xl font-black text-lg hover:bg-green-700 transition transform hover:scale-105 shadow-xl"
              >
                Be Part of Our First Stories
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
          <h1 className="text-5xl md:text-6xl font-black mb-6">LET'S CONNECT</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Whether you want to donate, partner, volunteer, or just learn more — we want to hear from you.
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
                    placeholder="Tell us more about your interest..."
                  ></textarea>
                </div>

                <button className="w-full bg-gradient-to-r from-green-600 to-yellow-600 text-white py-4 rounded-lg font-black text-lg hover:from-green-700 hover:to-yellow-700 transition">
                  Send Message
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
                      <p className="text-sm text-gray-600 mt-1">We typically respond within 24-48 hours</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-xl border-2 border-gray-200">
                  <div className="flex items-start space-x-4">
                    <Globe className="text-yellow-600 mt-1" size={24} />
                    <div>
                      <h3 className="font-black text-gray-900 mb-2">Online</h3>
                      <p className="text-gray-700">Follow our journey on social media</p>
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
                      <h3 className="font-black text-gray-900 mb-2">Headquarters</h3>
                      <p className="text-gray-700">United States (Details TBA)</p>
                      <p className="text-sm text-gray-600 mt-1">Operations across Africa and the diaspora</p>
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
      {currentPage === 'about' && <AboutPage />}
      {currentPage === 'vision' && <VisionPage />}
      {currentPage === 'involved' && <GetInvolvedPage />}
      {currentPage === 'impact' && <ImpactPage />}
      {currentPage === 'contact' && <ContactPage />}

      <Footer />
    </div>
  );
}