"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ConversionTrackingService } from "../../lib/services/conversion-tracking";

interface ROIInputs {
  teamSize: number;
  avgSalary: number;
  tasksPerWeek: number;
  minutesSaved: number;
  errorRate: number;
  costPerError: number;
  implementationCost: number;
}

interface ROIResults {
  hoursSavedPerMonth: number;
  monthlySavings: number;
  annualSavings: number;
  errorReductionSavings: number;
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  paybackMonths: number;
  roi12Months: number;
  roi36Months: number;
}

export default function ROISimulator() {
  const [mounted, setMounted] = useState(false);
  const [inputs, setInputs] = useState<ROIInputs>({
    teamSize: 25,
    avgSalary: 75000,
    tasksPerWeek: 15,
    minutesSaved: 20,
    errorRate: 2,
    costPerError: 500,
    implementationCost: 50000
  });

  const [results, setResults] = useState<ROIResults | null>(null);
  const [showResults, setShowResults] = useState(false);

  // Real-time calculation
  useEffect(() => {
    const calculateROI = () => {
      const hourlyRate = inputs.avgSalary / (52 * 40); // Annual salary to hourly rate
      const hoursPerTask = inputs.minutesSaved / 60;
      const tasksPerMonth = inputs.tasksPerWeek * 4.33; // Average weeks per month

      // Time savings calculations
      const hoursSavedPerMonth = inputs.teamSize * tasksPerMonth * hoursPerTask;
      const monthlySavings = hoursSavedPerMonth * hourlyRate;
      const annualSavings = monthlySavings * 12;

      // Error reduction savings
      const errorsPerMonth = inputs.teamSize * inputs.errorRate * 4.33;
      const errorReductionSavings = errorsPerMonth * inputs.costPerError * 0.8; // Assume 80% error reduction

      // Total savings
      const totalMonthlySavings = monthlySavings + errorReductionSavings;
      const totalAnnualSavings = totalMonthlySavings * 12;

      // ROI calculations
      const paybackMonths = inputs.implementationCost / totalMonthlySavings;
      const roi12Months = ((totalAnnualSavings - inputs.implementationCost) / inputs.implementationCost) * 100;
      const roi36Months = (((totalAnnualSavings * 3) - inputs.implementationCost) / inputs.implementationCost) * 100;

      return {
        hoursSavedPerMonth,
        monthlySavings,
        annualSavings,
        errorReductionSavings,
        totalMonthlySavings,
        totalAnnualSavings,
        paybackMonths,
        roi12Months,
        roi36Months
      };
    };

    setResults(calculateROI());
  }, [inputs]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Track page view
  useEffect(() => {
    ConversionTrackingService.trackPageView('/enterprise/roi', undefined, {
      page_type: 'calculator',
      calculator_type: 'roi_simulator'
    });
  }, []);

  // Show loading state until client-side hydration complete
  if (!mounted) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  const updateInput = (key: keyof ROIInputs, value: number) => {
    setInputs(prev => ({
      ...prev,
      [key]: Math.max(0, value)
    }));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 1
    }).format(num);
  };

  const handleShowResults = () => {
    setShowResults(true);

    // Track ROI calculation
    if (results) {
      ConversionTrackingService.trackConversion('engagement', {
        event: 'roi_calculated',
        value: results.totalAnnualSavings,
        content_type: 'calculator',
        content_category: 'roi_simulator',
        metadata: {
          team_size: inputs.teamSize,
          annual_savings: results.totalAnnualSavings,
          payback_months: results.paybackMonths,
          roi_12_months: results.roi12Months
        }
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-amber-950/90 to-slate-900/95" />

        {/* Floating geometric shapes - financial theme */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-amber-500/20 to-orange-600/20 rounded-3xl rotate-45 animate-float blur-xl"></div>
        <div className="absolute top-60 right-20 w-24 h-24 bg-gradient-to-br from-green-500/15 to-emerald-600/15 rounded-full animate-float-delayed blur-lg"></div>
        <div className="absolute bottom-40 left-20 w-40 h-40 bg-gradient-to-br from-purple-500/10 to-pink-600/10 rounded-2xl rotate-12 animate-float blur-2xl"></div>
        <div className="absolute bottom-20 right-10 w-28 h-28 bg-gradient-to-br from-blue-500/20 to-cyan-600/20 rounded-full animate-float-delayed blur-xl"></div>

        {/* Animated grid overlay */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5 animate-grid-flow"></div>

        {/* Dynamic light beams */}
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-amber-400/20 to-transparent animate-beam-1"></div>
        <div className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-transparent via-green-400/15 to-transparent animate-beam-2"></div>
      </div>

      <div className="relative z-10 py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Enhanced Header */}
          <div className="text-center mb-12">
            <div className="relative inline-block mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-400 via-orange-400 to-green-400 rounded-3xl blur-2xl opacity-30 animate-pulse-glow"></div>
              <h1 className="relative text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
                <span className="bg-gradient-to-r from-amber-300 via-orange-300 to-green-300 bg-clip-text text-transparent animate-text-shimmer bg-size-200">
                  AI ROI Calculator
                </span>
              </h1>
            </div>

            <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-6 leading-relaxed">
              Calculate your potential savings and return on investment from AI automation.
              Get instant insights into costs, time savings, and payback period.
            </p>

            {/* Enhanced feature highlights */}
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl blur-lg group-hover:blur-xl transition-all duration-300"></div>
                <div className="relative bg-green-500/10 backdrop-blur-xl border border-green-400/30 rounded-xl px-4 py-2">
                  <span className="text-green-300 text-sm font-medium">💰 Real-time Calculations</span>
                </div>
              </div>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl blur-lg group-hover:blur-xl transition-all duration-300"></div>
                <div className="relative bg-blue-500/10 backdrop-blur-xl border border-blue-400/30 rounded-xl px-4 py-2">
                  <span className="text-blue-300 text-sm font-medium">📊 3-Year Projections</span>
                </div>
              </div>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl blur-lg group-hover:blur-xl transition-all duration-300"></div>
                <div className="relative bg-purple-500/10 backdrop-blur-xl border border-purple-400/30 rounded-xl px-4 py-2">
                  <span className="text-purple-300 text-sm font-medium">⚡ Instant Results</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Enhanced Input Panel */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-slate-800/30 to-amber-900/20 rounded-3xl blur-xl"></div>
              <div className="relative bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 shadow-2xl">
                <div className="flex items-center gap-4 mb-8">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full blur-lg opacity-50 animate-pulse-glow"></div>
                    <div className="relative w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full flex items-center justify-center shadow-xl">
                      <span className="text-2xl animate-pulse-bright">📊</span>
                    </div>
                  </div>
                  <h2 className="text-2xl font-semibold text-white">
                    Your Company Details
                  </h2>
                </div>

                <div className="space-y-6">
                  {/* Enhanced Team Size */}
                  <div className="relative group">
                    <label className="block text-white font-medium mb-3 text-lg">
                      Team Size
                    </label>
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-xl blur-lg group-hover:from-amber-500/20 group-hover:to-orange-500/20 transition-all duration-300"></div>
                      <input
                        type="number"
                        value={inputs.teamSize}
                        onChange={(e) => updateInput('teamSize', parseInt(e.target.value) || 0)}
                        className="relative w-full bg-slate-700/60 backdrop-blur-xl border border-slate-600 rounded-xl px-4 py-4 text-white text-lg focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all duration-300 hover:bg-slate-700/80 shadow-xl"
                        placeholder="25"
                      />
                      <span className="absolute right-4 top-4 text-slate-400 font-medium">people</span>
                    </div>
                  </div>

                  {/* Enhanced Average Salary */}
                  <div className="relative group">
                    <label className="block text-white font-medium mb-3 text-lg">
                      Average Annual Salary
                    </label>
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl blur-lg group-hover:from-green-500/20 group-hover:to-emerald-500/20 transition-all duration-300"></div>
                      <input
                        type="number"
                        value={inputs.avgSalary}
                        onChange={(e) => updateInput('avgSalary', parseInt(e.target.value) || 0)}
                        className="relative w-full bg-slate-700/60 backdrop-blur-xl border border-slate-600 rounded-xl px-4 py-4 text-white text-lg focus:border-green-400 focus:ring-1 focus:ring-green-400 transition-all duration-300 hover:bg-slate-700/80 shadow-xl"
                        placeholder="75000"
                      />
                      <span className="absolute right-4 top-4 text-slate-400 font-medium">$/year</span>
                    </div>
                  </div>

                  {/* Enhanced Tasks Per Week */}
                  <div className="relative group">
                    <label className="block text-white font-medium mb-3 text-lg">
                      Automatable Tasks (per person/week)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-xl blur-lg group-hover:from-blue-500/20 group-hover:to-cyan-500/20 transition-all duration-300"></div>
                      <input
                        type="number"
                        value={inputs.tasksPerWeek}
                        onChange={(e) => updateInput('tasksPerWeek', parseInt(e.target.value) || 0)}
                        className="relative w-full bg-slate-700/60 backdrop-blur-xl border border-slate-600 rounded-xl px-4 py-4 text-white text-lg focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all duration-300 hover:bg-slate-700/80 shadow-xl"
                        placeholder="15"
                      />
                      <span className="absolute right-4 top-4 text-slate-400 font-medium">tasks</span>
                    </div>
                  </div>

                  {/* Enhanced Time Saved */}
                  <div className="relative group">
                    <label className="block text-white font-medium mb-3 text-lg">
                      Time Saved per Task
                    </label>
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl blur-lg group-hover:from-purple-500/20 group-hover:to-pink-500/20 transition-all duration-300"></div>
                      <input
                        type="number"
                        value={inputs.minutesSaved}
                        onChange={(e) => updateInput('minutesSaved', parseInt(e.target.value) || 0)}
                        className="relative w-full bg-slate-700/60 backdrop-blur-xl border border-slate-600 rounded-xl px-4 py-4 text-white text-lg focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition-all duration-300 hover:bg-slate-700/80 shadow-xl"
                        placeholder="20"
                      />
                      <span className="absolute right-4 top-4 text-slate-400 font-medium">minutes</span>
                    </div>
                  </div>

                  {/* Enhanced Error Rate */}
                  <div className="relative group">
                    <label className="block text-white font-medium mb-3 text-lg">
                      Current Errors (per person/week)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-orange-500/10 rounded-xl blur-lg group-hover:from-red-500/20 group-hover:to-orange-500/20 transition-all duration-300"></div>
                      <input
                        type="number"
                        value={inputs.errorRate}
                        onChange={(e) => updateInput('errorRate', parseInt(e.target.value) || 0)}
                        className="relative w-full bg-slate-700/60 backdrop-blur-xl border border-slate-600 rounded-xl px-4 py-4 text-white text-lg focus:border-red-400 focus:ring-1 focus:ring-red-400 transition-all duration-300 hover:bg-slate-700/80 shadow-xl"
                        placeholder="2"
                      />
                      <span className="absolute right-4 top-4 text-slate-400 font-medium">errors</span>
                    </div>
                  </div>

                  {/* Enhanced Cost Per Error */}
                  <div className="relative group">
                    <label className="block text-white font-medium mb-3 text-lg">
                      Cost per Error
                    </label>
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-yellow-500/10 rounded-xl blur-lg group-hover:from-orange-500/20 group-hover:to-yellow-500/20 transition-all duration-300"></div>
                      <input
                        type="number"
                        value={inputs.costPerError}
                        onChange={(e) => updateInput('costPerError', parseInt(e.target.value) || 0)}
                        className="relative w-full bg-slate-700/60 backdrop-blur-xl border border-slate-600 rounded-xl px-10 py-4 text-white text-lg focus:border-orange-400 focus:ring-1 focus:ring-orange-400 transition-all duration-300 hover:bg-slate-700/80 shadow-xl"
                        placeholder="500"
                      />
                      <span className="absolute left-4 top-4 text-slate-400 font-medium">$</span>
                    </div>
                  </div>

                  {/* Enhanced Implementation Cost */}
                  <div className="relative group">
                    <label className="block text-white font-medium mb-3 text-lg">
                      Estimated Implementation Cost
                    </label>
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-xl blur-lg group-hover:from-cyan-500/20 group-hover:to-blue-500/20 transition-all duration-300"></div>
                      <input
                        type="number"
                        value={inputs.implementationCost}
                        onChange={(e) => updateInput('implementationCost', parseInt(e.target.value) || 0)}
                        className="relative w-full bg-slate-700/60 backdrop-blur-xl border border-slate-600 rounded-xl px-10 py-4 text-white text-lg focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all duration-300 hover:bg-slate-700/80 shadow-xl"
                        placeholder="50000"
                      />
                      <span className="absolute left-4 top-4 text-slate-400 font-medium">$</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Results Panel */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-slate-800/30 to-green-900/20 rounded-3xl blur-xl"></div>
              <div className="relative bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 shadow-2xl">
                <div className="flex items-center gap-4 mb-8">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full blur-lg opacity-50 animate-pulse-glow"></div>
                    <div className="relative w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-xl">
                      <span className="text-2xl animate-pulse-bright">💰</span>
                    </div>
                  </div>
                  <h2 className="text-2xl font-semibold text-white">
                    Your ROI Projections
                  </h2>
                </div>

                {results && (
                  <div className="space-y-8">
                    {/* Enhanced Key Metrics */}
                    <div className="grid grid-cols-2 gap-6">
                      <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-green-500/30 to-emerald-500/30 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-300"></div>
                        <div className="relative bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-xl border border-green-500/40 rounded-2xl p-6 text-center shadow-xl hover:shadow-green-500/20 transition-all duration-300">
                          <p className="text-green-300 font-medium text-lg mb-2">Monthly Savings</p>
                          <p className="text-3xl font-bold text-white animate-pulse-bright">{formatCurrency(results.totalMonthlySavings)}</p>
                        </div>
                      </div>
                      <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 to-cyan-500/30 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-300"></div>
                        <div className="relative bg-gradient-to-r from-blue-500/20 to-cyan-500/20 backdrop-blur-xl border border-blue-500/40 rounded-2xl p-6 text-center shadow-xl hover:shadow-blue-500/20 transition-all duration-300">
                          <p className="text-blue-300 font-medium text-lg mb-2">Annual Savings</p>
                          <p className="text-3xl font-bold text-white animate-pulse-bright">{formatCurrency(results.totalAnnualSavings)}</p>
                        </div>
                      </div>
                      <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-300"></div>
                        <div className="relative bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-xl border border-purple-500/40 rounded-2xl p-6 text-center shadow-xl hover:shadow-purple-500/20 transition-all duration-300">
                          <p className="text-purple-300 font-medium text-lg mb-2">Payback Period</p>
                          <p className="text-3xl font-bold text-white animate-pulse-bright">{formatNumber(results.paybackMonths)} mo</p>
                        </div>
                      </div>
                      <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/30 to-red-500/30 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-300"></div>
                        <div className="relative bg-gradient-to-r from-orange-500/20 to-red-500/20 backdrop-blur-xl border border-orange-500/40 rounded-2xl p-6 text-center shadow-xl hover:shadow-orange-500/20 transition-all duration-300">
                          <p className="text-orange-300 font-medium text-lg mb-2">12-Month ROI</p>
                          <p className="text-3xl font-bold text-white animate-pulse-bright">{formatNumber(results.roi12Months)}%</p>
                        </div>
                      </div>
                    </div>

                    {/* Enhanced Breakdown */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl animate-pulse-bright">📊</span>
                        <h3 className="text-xl font-semibold text-white">Savings Breakdown</h3>
                      </div>

                      <div className="space-y-4">
                        <div className="relative group">
                          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-xl blur-lg group-hover:from-cyan-500/20 group-hover:to-blue-500/20 transition-all duration-300"></div>
                          <div className="relative flex items-center justify-between p-4 bg-slate-700/40 backdrop-blur-xl rounded-xl border border-slate-600/30 hover:border-cyan-500/40 transition-all duration-300">
                            <div>
                              <p className="text-white font-medium text-lg">Time Savings</p>
                              <p className="text-slate-400">{formatNumber(results.hoursSavedPerMonth)} hours/month</p>
                            </div>
                            <p className="text-cyan-400 font-semibold text-xl">{formatCurrency(results.monthlySavings)}/mo</p>
                          </div>
                        </div>

                        <div className="relative group">
                          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-xl blur-lg group-hover:from-orange-500/20 group-hover:to-red-500/20 transition-all duration-300"></div>
                          <div className="relative flex items-center justify-between p-4 bg-slate-700/40 backdrop-blur-xl rounded-xl border border-slate-600/30 hover:border-orange-500/40 transition-all duration-300">
                            <div>
                              <p className="text-white font-medium text-lg">Error Reduction</p>
                              <p className="text-slate-400">80% fewer errors</p>
                            </div>
                            <p className="text-orange-400 font-semibold text-xl">{formatCurrency(results.errorReductionSavings)}/mo</p>
                          </div>
                        </div>

                        <div className="relative group">
                          <div className="absolute inset-0 bg-gradient-to-r from-green-500/30 to-emerald-500/30 rounded-xl blur-xl"></div>
                          <div className="relative flex items-center justify-between p-6 bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-xl border border-green-500/40 rounded-xl shadow-xl">
                            <div>
                              <p className="text-white font-semibold text-xl">Total Monthly Savings</p>
                              <p className="text-green-300">Combined value</p>
                            </div>
                            <p className="text-green-300 font-bold text-2xl animate-pulse-bright">{formatCurrency(results.totalMonthlySavings)}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Enhanced 3-Year Projection */}
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                      <div className="relative bg-gradient-to-r from-cyan-500/10 to-blue-500/10 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-8 shadow-xl">
                        <div className="flex items-center gap-3 mb-6">
                          <span className="text-3xl animate-pulse-bright">🚀</span>
                          <h3 className="text-xl font-semibold text-white">3-Year Projection</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-6 text-center">
                          <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 rounded-xl blur-lg"></div>
                            <div className="relative bg-slate-800/40 backdrop-blur-xl border border-cyan-400/30 rounded-xl p-4">
                              <p className="text-cyan-300 text-lg font-medium mb-2">Total 3-Year Savings</p>
                              <p className="text-3xl font-bold text-cyan-400 animate-pulse-bright">{formatCurrency(results.totalAnnualSavings * 3)}</p>
                            </div>
                          </div>
                          <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-xl blur-lg"></div>
                            <div className="relative bg-slate-800/40 backdrop-blur-xl border border-blue-400/30 rounded-xl p-4">
                              <p className="text-blue-300 text-lg font-medium mb-2">3-Year ROI</p>
                              <p className="text-3xl font-bold text-blue-400 animate-pulse-bright">{formatNumber(results.roi36Months)}%</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Enhanced CTA Buttons */}
                    <div className="flex flex-col gap-4 pt-6">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-2xl blur-xl"></div>
                        <Link href="/enterprise/diagnostic">
                          <button className="relative w-full px-8 py-5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 shadow-2xl hover:shadow-cyan-500/25 transform hover:scale-105">
                            <div className="absolute inset-0 bg-gradient-to-r from-white/0 to-white/0 hover:from-white/10 hover:to-white/10 rounded-2xl transition-all duration-300"></div>
                            <span className="text-xl">📋</span>
                            <span className="relative text-lg">Get Your AI Readiness Assessment</span>
                          </button>
                        </Link>
                      </div>

                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-slate-600/20 to-slate-500/20 rounded-2xl blur-xl"></div>
                        <button
                          onClick={() => {
                            ConversionTrackingService.trackConversion('lead', {
                              event: 'strategy_call_from_roi',
                              value: results?.totalAnnualSavings || 0,
                              content_type: 'consultation',
                              content_category: 'roi_calculator',
                              metadata: {
                                monthly_savings: results?.totalMonthlySavings || 0,
                                payback_months: results?.paybackMonths || 0,
                                team_size: inputs.teamSize
                              }
                            });

                            window.open('https://calendly.com/lorenzo-theglobalenterprise/discovery-call?utm_source=roi_calculator&utm_medium=cta&monthly_savings=' + (results?.totalMonthlySavings || 0), '_blank');
                          }}
                          className="relative w-full px-8 py-5 bg-slate-700/60 backdrop-blur-xl border border-slate-600/50 hover:border-slate-500/70 text-white rounded-2xl hover:bg-slate-600/70 transition-all duration-300 flex items-center justify-center gap-3 shadow-xl transform hover:scale-105"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-white/0 to-white/0 hover:from-white/5 hover:to-white/5 rounded-2xl transition-all duration-300"></div>
                          <span className="text-xl">📞</span>
                          <span className="relative text-lg font-semibold">Schedule Strategy Call</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Enhanced Bottom CTA */}
          <div className="text-center mt-16">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-green-500/10 rounded-3xl blur-2xl"></div>
              <div className="relative bg-gradient-to-r from-slate-800/60 to-slate-700/60 backdrop-blur-xl border border-slate-600/50 rounded-3xl p-12 max-w-5xl mx-auto shadow-2xl">
                <div className="relative inline-block mb-8">
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-400 via-orange-400 to-green-400 rounded-2xl blur-xl opacity-30 animate-pulse-glow"></div>
                  <h3 className="relative text-3xl font-bold mb-4">
                    <span className="bg-gradient-to-r from-amber-300 via-orange-300 to-green-300 bg-clip-text text-transparent">
                      Ready to Turn These Projections Into Reality?
                    </span>
                  </h3>
                </div>

                <p className="text-slate-300 text-xl mb-8 max-w-3xl mx-auto leading-relaxed">
                  Our AI experts will help you identify the highest-impact automation opportunities
                  and create a customized implementation roadmap for your organization.
                </p>

                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl blur-xl"></div>
                    <Link href="/enterprise">
                      <button className="relative group px-10 py-5 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white font-semibold rounded-2xl transition-all duration-300 shadow-2xl hover:shadow-purple-500/25 transform hover:scale-105">
                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 to-white/0 group-hover:from-white/10 group-hover:to-white/10 rounded-2xl transition-all duration-300"></div>
                        <span className="relative text-lg">Explore Executive Toolkit</span>
                      </button>
                    </Link>
                  </div>

                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-600/20 to-slate-500/20 rounded-2xl blur-xl"></div>
                    <Link href="/enterprise/diagnostic">
                      <button className="relative group px-10 py-5 bg-slate-700/60 backdrop-blur-xl border border-slate-600/50 hover:border-slate-500/70 text-white rounded-2xl hover:bg-slate-600/70 transition-all duration-300 shadow-xl transform hover:scale-105">
                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 to-white/0 group-hover:from-white/5 group-hover:to-white/5 rounded-2xl transition-all duration-300"></div>
                        <span className="relative text-lg font-semibold">Take Full Assessment</span>
                      </button>
                    </Link>
                  </div>
                </div>

                <div className="relative mt-8">
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-green-500/10 rounded-xl blur-lg"></div>
                  <div className="relative bg-slate-800/40 backdrop-blur-xl border border-slate-600/30 rounded-xl p-4">
                    <p className="text-slate-300 text-sm leading-relaxed">
                      <span className="text-amber-400 font-semibold">ROI Guarantee:</span> We're so confident in our approach that we guarantee measurable results within 90 days or your investment back.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}