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

            <p className="text-xl md:text-2xl mb-4 max-w-4xl mx-auto font-light leading-relaxed">
              The <span className="font-bold text-yellow-300">United States of Africa</span> —
              Economic Sovereignty, Free Movement, Mental Liberation
            </p>

            <p className="text-lg md:text-xl mb-12 max-w-3xl mx-auto text-gray-200">
              54 nations negotiate separately = the world dictates our prices.
              <br />
              <span className="font-bold text-yellow-300">One voice, one economy, no more exploitation.</span>
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

  const AboutPage = () => (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-r from-red-900 via-yellow-900 to-green-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-black mb-6">ABOUT THE MOVEMENT</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Dr. Kwame Nkrumah's vision lives on. Economic sovereignty through continental unity.
          </p>
        </div>
      </section>

      {/* Organizations */}
      <section className="py-20 bg-gradient-to-br from-yellow-50 via-white to-green-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-black text-gray-900 mb-12 text-center">Two Organizations, One Vision</h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-red-50 to-red-100 p-8 rounded-xl border-2 border-red-300">
              <h3 className="text-2xl font-black text-red-900 mb-4">United States of Africa Movement</h3>
              <p className="text-gray-700 mb-4">
                Global advocacy organization driving continental unity, economic sovereignty,
                and policy change for African integration.
              </p>
              <ul className="space-y-2 text-gray-700">
                <li>• Continental advocacy and organizing</li>
                <li>• Policy development and lobbying</li>
                <li>• International coalition building</li>
                <li>• Economic sovereignty campaigns</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-xl border-2 border-green-300">
              <h3 className="text-2xl font-black text-green-900 mb-4">Hope for Africans Foundation</h3>
              <div className="bg-yellow-200 border border-yellow-600 p-3 rounded-lg mb-4">
                <p className="text-yellow-800 font-bold text-sm">501(c)(3) Application in Process</p>
              </div>
              <p className="text-gray-700 mb-4">
                On-ground humanitarian programs delivering direct impact
                to African communities while building unity infrastructure.
              </p>
              <ul className="space-y-2 text-gray-700">
                <li>• Community development programs</li>
                <li>• Educational initiatives</li>
                <li>• Healthcare access projects</li>
                <li>• Dr. Nkrumah's 54-country tour</li>
              </ul>
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
          <h1 className="text-5xl md:text-6xl font-black mb-6">THE 12 PILLARS</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Systematic transformation of Africa through strategic unity initiatives.
          </p>
        </div>
      </section>

      {/* Priority Pillars */}
      <section className="py-20 bg-gradient-to-br from-white via-yellow-50 to-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-black text-gray-900 mb-4 text-center">PRIORITY INITIATIVES</h2>
          <p className="text-xl text-gray-600 text-center mb-16 max-w-3xl mx-auto">
            The three pillars that unlock all others
          </p>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-gradient-to-br from-red-50 to-red-100 p-8 rounded-2xl border-2 border-red-300 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-6 py-2 rounded-full font-black text-sm">
                #1 PRIORITY
              </div>
              <div className="text-5xl mb-6 text-center mt-4">🛂</div>
              <h3 className="text-2xl font-black text-red-900 mb-4 text-center">Visa-Free Travel</h3>
              <p className="text-gray-700 text-center">
                One Africa, one passport. Freedom of movement unlocks economic opportunity and cultural unity.
              </p>
            </div>

            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-8 rounded-2xl border-2 border-yellow-300 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-yellow-600 text-white px-6 py-2 rounded-full font-black text-sm">
                #2 PRIORITY
              </div>
              <div className="text-5xl mb-6 text-center mt-4">💰</div>
              <h3 className="text-2xl font-black text-yellow-900 mb-4 text-center">Economic Unity</h3>
              <p className="text-gray-700 text-center">
                One voice, one economy, pricing power. Africa decides the value of African resources.
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-2xl border-2 border-green-300 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-2 rounded-full font-black text-sm">
                #3 PRIORITY
              </div>
              <div className="text-5xl mb-6 text-center mt-4">🧠</div>
              <h3 className="text-2xl font-black text-green-900 mb-4 text-center">Mindset Transformation</h3>
              <p className="text-gray-700 text-center">
                Mental decolonization and continental consciousness. We are not inferior. We are the future.
              </p>
            </div>
          </div>

          {/* All 12 Pillars */}
          <div className="bg-gray-100 rounded-2xl p-8">
            <h3 className="text-3xl font-black text-gray-900 mb-8 text-center">All 12 Pillars of Transformation</h3>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-lg text-center">
                <div className="text-2xl mb-2">🛂</div>
                <div className="font-bold text-sm">Visa-Free Travel</div>
              </div>
              <div className="bg-white p-4 rounded-lg text-center">
                <div className="text-2xl mb-2">💰</div>
                <div className="font-bold text-sm">Economic Unity</div>
              </div>
              <div className="bg-white p-4 rounded-lg text-center">
                <div className="text-2xl mb-2">🧠</div>
                <div className="font-bold text-sm">Mindset Transformation</div>
              </div>
              <div className="bg-white p-4 rounded-lg text-center">
                <div className="text-2xl mb-2">🌾</div>
                <div className="font-bold text-sm">Agriculture</div>
              </div>
              <div className="bg-white p-4 rounded-lg text-center">
                <div className="text-2xl mb-2">🏭</div>
                <div className="font-bold text-sm">Tech/Manufacturing</div>
              </div>
              <div className="bg-white p-4 rounded-lg text-center">
                <div className="text-2xl mb-2">🏥</div>
                <div className="font-bold text-sm">Healthcare</div>
              </div>
              <div className="bg-white p-4 rounded-lg text-center">
                <div className="text-2xl mb-2">🎓</div>
                <div className="font-bold text-sm">Education</div>
              </div>
              <div className="bg-white p-4 rounded-lg text-center">
                <div className="text-2xl mb-2">🚗</div>
                <div className="font-bold text-sm">Transportation</div>
              </div>
              <div className="bg-white p-4 rounded-lg text-center">
                <div className="text-2xl mb-2">📡</div>
                <div className="font-bold text-sm">Communication</div>
              </div>
              <div className="bg-white p-4 rounded-lg text-center">
                <div className="text-2xl mb-2">⚡</div>
                <div className="font-bold text-sm">Energy</div>
              </div>
              <div className="bg-white p-4 rounded-lg text-center">
                <div className="text-2xl mb-2">🛡️</div>
                <div className="font-bold text-sm">Defense</div>
              </div>
              <div className="bg-white p-4 rounded-lg text-center">
                <div className="text-2xl mb-2">🌍</div>
                <div className="font-bold text-sm">Unity Council</div>
              </div>
            </div>
          </div>
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
            <h2 className="text-4xl font-black text-gray-900 mb-6">FUND THE MOVEMENT</h2>
            <div className="bg-yellow-100 border-2 border-yellow-500 p-4 rounded-lg inline-block mb-6">
              <p className="text-yellow-800 font-bold">Hope for Africans Foundation - 501(c)(3) Application in Process</p>
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Your investment builds economic sovereignty, visa-free movement, and mental liberation for 1.4 billion Africans.
            </p>
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
          <h1 className="text-5xl md:text-6xl font-black mb-6">IMPACT & PROGRESS</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Building momentum for continental transformation. Every action counts.
          </p>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-yellow-50 via-green-50 to-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-br from-yellow-50 to-green-50 p-12 rounded-2xl border-2 border-green-300">
            <div className="text-7xl mb-6">🚀</div>
            <h2 className="text-4xl font-black text-gray-900 mb-6">Movement Building Phase</h2>
            <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto">
              We're in the foundation-building phase, organizing global support for Dr. Nkrumah's 54-country tour
              and building the infrastructure for continental economic sovereignty.
            </p>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-xl">
                <div className="text-3xl font-black text-green-600 mb-2">124,847</div>
                <div className="font-bold text-gray-900 mb-1">Petition Signatures</div>
                <div className="text-sm text-gray-600">Growing daily</div>
              </div>
              <div className="bg-white p-6 rounded-xl">
                <div className="text-3xl font-black text-yellow-600 mb-2">54</div>
                <div className="font-bold text-gray-900 mb-1">Countries to Visit</div>
                <div className="text-sm text-gray-600">Dr. Nkrumah's Unity Tour</div>
              </div>
              <div className="bg-white p-6 rounded-xl">
                <div className="text-3xl font-black text-red-600 mb-2">3</div>
                <div className="font-bold text-gray-900 mb-1">Core Pillars</div>
                <div className="text-sm text-gray-600">Unity Foundation</div>
              </div>
            </div>

            <div className="mt-12">
              <button
                onClick={() => setCurrentPage('involved')}
                className="bg-green-600 text-white px-8 py-4 rounded-xl font-black text-lg hover:bg-green-700 transition transform hover:scale-105 shadow-xl"
              >
                Join the Foundation Building
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
      {currentPage === 'about' && <AboutPage />}
      {currentPage === 'vision' && <VisionPage />}
      {currentPage === 'involved' && <GetInvolvedPage />}
      {currentPage === 'impact' && <ImpactPage />}
      {currentPage === 'contact' && <ContactPage />}

      <Footer />
    </div>
  );
}