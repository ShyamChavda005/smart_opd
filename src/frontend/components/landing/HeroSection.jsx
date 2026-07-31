// ============================================================
//  HeroSection.jsx – Ultra-Modern, Single-Viewport Hero Section
// ============================================================

import React, { useState, useEffect } from 'react';

export default function HeroSection({ onOpenBooking, onOpenLogin }) {
  const [activeTab, setActiveTab] = useState('queue'); // 'queue' | 'ai' | 'doctor'
  const [currentToken, setCurrentToken] = useState(104);
  const [estWait, setEstWait] = useState(4);

  // Simulate subtle real-time token ticker
  useEffect(() => {
    const interval = setInterval(() => {
      setEstWait((prev) => (prev > 1 ? prev - 1 : 5));
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative pt-24 pb-6 lg:pt-24 lg:pb-10 min-h-[calc(100vh)] flex items-center overflow-hidden bg-gradient-to-b from-slate-50 via-white to-blue-50/40" id="home">
      {/* Dynamic Background Glow & Grid Patterns */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-tr from-blue-400/20 via-indigo-300/15 to-teal-300/20 blur-3xl pointer-events-none rounded-full animate-breathe"></div>
      <div className="absolute top-10 right-10 w-64 h-64 bg-teal-400/15 blur-2xl pointer-events-none rounded-full"></div>
      <div className="absolute bottom-10 left-10 w-72 h-72 bg-blue-500/10 blur-3xl pointer-events-none rounded-full"></div>

      {/* High-Tech Background Grid */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#0f172a 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}
      ></div>

      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Hero Typography & CTAs */}
          <div className="lg:col-span-7 flex flex-col gap-4 text-left">
            
            {/* AI Powered Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50/90 border border-blue-200/80 text-blue-800 w-fit shadow-sm backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
              </span>
              <span className="text-[11px] font-extrabold tracking-wide uppercase">AI OPD Engine v3.2 Active</span>
              <span className="text-blue-300">•</span>
              <span className="text-[11px] font-semibold text-blue-700">99.4% Flow Efficiency</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-sans text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.15]">
              Smart Hospital Queueing &amp;{' '}
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-500 bg-clip-text text-transparent">
                AI Wait Time Prediction
              </span>
            </h1>

            {/* Sub-Headline */}
            <p className="text-xs sm:text-sm lg:text-base text-slate-600 font-medium leading-relaxed max-w-xl">
              Eliminate crowded waiting rooms and patient anxiety. MediQueue leverages real-time Machine Learning to optimize OPD dispatch, forecast exact consultation times, and streamline doctor-receptionist workflows.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                onClick={() => onOpenBooking && onOpenBooking('booking')}
                className="px-6 py-3 rounded-xl text-xs sm:text-sm font-extrabold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2.5 active:translate-y-0"
              >
                <span>Book Appointment Token</span>
                <span className="material-symbols-outlined text-base">arrow_forward</span>
              </button>

              <button
                onClick={() => onOpenLogin && onOpenLogin('login')}
                className="px-5 py-3 rounded-xl text-xs sm:text-sm font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200/90 shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-lg text-blue-600">badge</span>
                <span>Hospital Staff Portal</span>
              </button>
            </div>

            {/* Live Metrics Grid */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-200/70">
              <div className="flex flex-col">
                <div className="flex items-center gap-1 text-slate-900 font-black text-xl sm:text-2xl">
                  <span>&lt; 8 min</span>
                  <span className="text-emerald-500 text-xs font-bold">↓ 82%</span>
                </div>
                <span className="text-[11px] font-semibold text-slate-500 mt-0.5">Avg. OPD Wait Time</span>
              </div>

              <div className="flex flex-col">
                <div className="flex items-center gap-1 text-slate-900 font-black text-xl sm:text-2xl">
                  <span>99.4%</span>
                  <span className="text-blue-500 text-xs font-bold">AI</span>
                </div>
                <span className="text-[11px] font-semibold text-slate-500 mt-0.5">Prediction Accuracy</span>
              </div>

              <div className="flex flex-col">
                <div className="flex items-center gap-1 text-slate-900 font-black text-xl sm:text-2xl">
                  <span>150+</span>
                  <span className="text-indigo-500 text-xs font-bold">OPDs</span>
                </div>
                <span className="text-[11px] font-semibold text-slate-500 mt-0.5">Clinics Connected</span>
              </div>
            </div>

          </div>

          {/* Right Column: Interactive Glassmorphism Visual Card */}
          <div className="lg:col-span-5 relative">
            
            {/* Main Interactive Visual Box */}
            <div className="relative rounded-2xl bg-white/95 backdrop-blur-xl border border-slate-200/90 shadow-xl p-4 lg:p-5 transition-all duration-300">
              
              {/* Header inside visual card */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center font-bold">
                    <span className="material-symbols-outlined text-lg">monitor_heart</span>
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-xs">Cardiology OPD OPD-4</h3>
                    <p className="text-[10px] font-semibold text-slate-400">Dr. Sharma • Room 402B</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  LIVE DISPATCH
                </span>
              </div>

              {/* View Switcher Tabs */}
              <div className="flex items-center gap-1 p-1 mt-3 rounded-lg bg-slate-100/90 text-[11px] font-bold">
                <button
                  onClick={() => setActiveTab('queue')}
                  className={`flex-1 py-1 rounded-md transition-all ${
                    activeTab === 'queue' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Live Queue
                </button>
                <button
                  onClick={() => setActiveTab('ai')}
                  className={`flex-1 py-1 rounded-md transition-all ${
                    activeTab === 'ai' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  AI Forecast
                </button>
                <button
                  onClick={() => setActiveTab('doctor')}
                  className={`flex-1 py-1 rounded-md transition-all ${
                    activeTab === 'doctor' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Doctor Load
                </button>
              </div>

              {/* Tab 1: Live Queue View */}
              {activeTab === 'queue' && (
                <div className="mt-3 space-y-3 animate-fadeIn">
                  
                  {/* Current Active Token Banner */}
                  <div className="p-3 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white shadow-md relative overflow-hidden">
                    <div className="absolute right-2 top-2 opacity-15">
                      <span className="material-symbols-outlined text-6xl">confirmation_number</span>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-blue-200">
                      Now Consulting
                    </span>
                    <div className="flex items-baseline justify-between mt-0.5">
                      <span className="text-2xl font-black tracking-tight">#T-{currentToken}</span>
                      <span className="text-[10px] font-semibold bg-white/20 px-2 py-0.5 rounded-full backdrop-blur-md">
                        Est. {estWait} mins remaining
                      </span>
                    </div>
                    <div className="w-full bg-white/20 h-1 rounded-full mt-2 overflow-hidden">
                      <div className="bg-emerald-400 h-full w-3/4 rounded-full animate-pulse"></div>
                    </div>
                  </div>

                  {/* Upcoming Patient Queue List */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block px-1">
                      Next Patients in Line
                    </span>
                    
                    <div className="p-2 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center justify-between hover:bg-white hover:shadow-sm transition-all">
                      <div className="flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded-md bg-blue-100 text-blue-700 font-extrabold text-[10px] flex items-center justify-center">
                          #T-105
                        </span>
                        <div>
                          <p className="text-[11px] font-bold text-slate-800">Manish Verma</p>
                          <p className="text-[9px] text-slate-400">Regular Checkup</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
                        Waiting (~6 min)
                      </span>
                    </div>

                    <div className="p-2 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center justify-between hover:bg-white hover:shadow-sm transition-all">
                      <div className="flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded-md bg-indigo-100 text-indigo-700 font-extrabold text-[10px] flex items-center justify-center">
                          #T-106
                        </span>
                        <div>
                          <p className="text-[11px] font-bold text-slate-800">Priya Patel</p>
                          <p className="text-[9px] text-slate-400">ECG Report Review</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                        In Lounge (~12 min)
                      </span>
                    </div>
                  </div>

                </div>
              )}

              {/* Tab 2: AI Forecast View */}
              {activeTab === 'ai' && (
                <div className="mt-3 space-y-3 animate-fadeIn">
                  <div className="p-3 rounded-xl bg-slate-900 text-white shadow-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-extrabold text-teal-400 flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">psychology</span>
                        AI Neural Forecast Node
                      </span>
                      <span className="text-[9px] bg-teal-500/20 text-teal-300 px-1.5 py-0.5 rounded-full font-bold">
                        99.4% Match
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      Queue speed is <span className="text-emerald-400 font-bold">14% faster</span> than peak average today. Throughput: <span className="text-white font-bold">5.8 mins/patient</span>.
                    </p>
                    <div className="grid grid-cols-2 gap-2 pt-1.5 border-t border-slate-800 text-[10px]">
                      <div>
                        <span className="text-slate-400">Peak Congestion:</span>
                        <p className="font-bold text-white">11:30 AM - 12:15 PM</p>
                      </div>
                      <div>
                        <span className="text-slate-400">Optimal Arrival:</span>
                        <p className="font-bold text-emerald-400">10:45 AM (Immediate)</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: Doctor Load View */}
              {activeTab === 'doctor' && (
                <div className="mt-3 space-y-2 animate-fadeIn">
                  <div className="p-2.5 rounded-lg bg-blue-50/90 border border-blue-200 text-[11px] space-y-1.5">
                    <div className="flex justify-between font-bold text-slate-800">
                      <span>Doctor Attendance</span>
                      <span className="text-blue-600">4 / 4 On Duty</span>
                    </div>
                    <div className="w-full bg-blue-200 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-blue-600 h-full w-full rounded-full"></div>
                    </div>
                  </div>

                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between text-[11px] font-bold text-slate-700">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      <span>Cardiology (Dr. Sharma)</span>
                    </div>
                    <span className="text-emerald-600">18 Tokens Done</span>
                  </div>

                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between text-[11px] font-bold text-slate-700">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                      <span>Orthopedics (Dr. Mehta)</span>
                    </div>
                    <span className="text-blue-600">14 Tokens Done</span>
                  </div>
                </div>
              )}

              {/* Bottom Live Alert Tag */}
              <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
                <span className="text-slate-400 font-medium flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs text-blue-500">sync</span>
                  Live Sync (WebSocket)
                </span>
                <span className="text-slate-600 font-bold">Smart OPD Cloud</span>
              </div>

            </div>

            {/* Decorative Floating Glass Badge 1 */}
            <div className="absolute -bottom-2 -left-3 bg-white/95 backdrop-blur-xl border border-slate-200 p-2.5 rounded-xl shadow-lg hidden sm:flex items-center gap-2.5 animate-float z-20">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <span className="material-symbols-outlined text-base">verified</span>
              </div>
              <div>
                <p className="text-[11px] font-extrabold text-slate-900">Zero Waiting Stress</p>
                <p className="text-[9px] font-semibold text-slate-400">Live SMS &amp; App Notifications</p>
              </div>
            </div>

            {/* Decorative Floating Glass Badge 2 */}
            <div className="absolute -top-3 -right-2 bg-white/95 backdrop-blur-xl border border-slate-200 p-2.5 rounded-xl shadow-lg hidden sm:flex items-center gap-2.5 animate-float-reverse z-20">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <span className="material-symbols-outlined text-base">bolt</span>
              </div>
              <div>
                <p className="text-[11px] font-extrabold text-slate-900">Fast Token Dispatch</p>
                <p className="text-[9px] font-semibold text-slate-400">Instant QR Registration</p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
