// ============================================================
//  AIIntelligenceSection.jsx – Modern AI Intelligence Section
// ============================================================

import React, { useState } from 'react';

export default function AIIntelligenceSection({ onOpenDemo }) {
  const [activeTab, setActiveTab] = useState('qr'); // 'qr' | 'balancing' | 'neural'

  return (
    <section className="py-24 lg:py-32 bg-slate-50/60 border-t border-slate-200/80 relative overflow-hidden" id="technology">
      {/* Background Decorative Glow Orbs */}
      <div className="absolute top-1/3 left-10 w-96 h-96 bg-blue-400/10 blur-3xl pointer-events-none rounded-full"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-teal-400/10 blur-3xl pointer-events-none rounded-full"></div>

      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Visual Side: Interactive AI Node Box */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl bg-white/90 backdrop-blur-xl border border-slate-200/90 shadow-2xl p-6 sm:p-8 space-y-4">
              
              {/* Header inside visual card */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold shadow-md shadow-blue-500/20">
                    <span className="material-symbols-outlined text-xl">psychology</span>
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-sm">Smart OPD AI Engine</h3>
                    <p className="text-xs font-semibold text-slate-400">Neural Flow Matrix v3.2</p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full text-[10px] font-extrabold bg-blue-50 text-blue-700 border border-blue-200">
                  REAL-TIME LEARNING
                </span>
              </div>

              {/* Node Item 1: QR Check-in */}
              <div 
                onClick={() => setActiveTab('qr')}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  activeTab === 'qr'
                    ? 'bg-blue-50/80 border-blue-300 shadow-md ring-2 ring-blue-500/20'
                    : 'bg-slate-50 border-slate-200/80 hover:bg-white'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-md">
                    <span className="material-symbols-outlined text-xl">qr_code_2</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs sm:text-sm font-extrabold text-slate-900">Touchless QR Check-in</h4>
                      <span className="text-[10px] font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded">15 sec scan</span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium mt-1">
                      Patients scan entrance QR kiosks for instant check-in, automated profile creation, and contactless digital token receipt.
                    </p>
                  </div>
                </div>
              </div>

              {/* Node Item 2: Dynamic AI Queue Balancing */}
              <div 
                onClick={() => setActiveTab('balancing')}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  activeTab === 'balancing'
                    ? 'bg-emerald-50/80 border-emerald-300 shadow-md ring-2 ring-emerald-500/20'
                    : 'bg-slate-50 border-slate-200/80 hover:bg-white'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md">
                    <span className="material-symbols-outlined text-xl">balance</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs sm:text-sm font-extrabold text-slate-900">Dynamic AI Queue Balancing</h4>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">Auto Load</span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium mt-1">
                      Intelligently shifts patient load across active doctor cabins to eliminate bottlenecking during peak morning OPD hours.
                    </p>
                  </div>
                </div>
              </div>

              {/* Node Item 3: Neural Wait Time Forecasting */}
              <div 
                onClick={() => setActiveTab('neural')}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  activeTab === 'neural'
                    ? 'bg-indigo-50/80 border-indigo-300 shadow-md ring-2 ring-indigo-500/20'
                    : 'bg-slate-50 border-slate-200/80 hover:bg-white'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md">
                    <span className="material-symbols-outlined text-xl">insights</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs sm:text-sm font-extrabold text-slate-900">Predictive Wait Time Engine</h4>
                      <span className="text-[10px] font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded">99.4% Match</span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium mt-1">
                      Uses historical consultation duration data and live doctor pace to compute exact minute-by-minute wait ETAs.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Right Content Side */}
          <div className="lg:col-span-6 flex flex-col gap-6 text-left">
            
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/90 text-blue-700 text-xs font-extrabold uppercase tracking-wider w-fit shadow-sm">
              <span className="material-symbols-outlined text-sm">memory</span>
              <span>Predictive Machine Learning</span>
            </div>

            {/* Title */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              Intelligence Behind{' '}
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-500 bg-clip-text text-transparent">
                Every Patient Visit
              </span>
            </h2>

            {/* Paragraph */}
            <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed">
              The Smart OPD Queue Management &amp; Patient Waiting Time Prediction System uses Artificial Intelligence and Machine Learning to streamline hospital operations, eliminate patient waiting room friction, support priority scheduling, and empower hospital leadership with actionable operational analytics.
            </p>

            {/* Feature Highlight Callout Cards */}
            <div className="space-y-3 pt-2">
              <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-md flex items-center gap-4 hover:border-blue-300 transition-all">
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center font-bold shrink-0">
                  <span className="material-symbols-outlined text-xl">trending_down</span>
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-slate-900">60% Reduction in Patient Wait Times</h4>
                  <p className="text-xs text-slate-500 font-medium">Average OPD wait time drops from 45+ minutes to under 8 minutes.</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-md flex items-center gap-4 hover:border-emerald-300 transition-all">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center font-bold shrink-0">
                  <span className="material-symbols-outlined text-xl">verified</span>
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-slate-900">98.4% Accuracy in AI Predictions</h4>
                  <p className="text-xs text-slate-500 font-medium">Hyper-accurate wait time forecasting tuned to daily doctor paces.</p>
                </div>
              </div>
            </div>

            {/* Action Trigger */}
            <div className="pt-2">
              <button
                onClick={() => onOpenDemo && onOpenDemo('booking')}
                className="px-7 py-3.5 rounded-xl text-xs sm:text-sm font-extrabold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 shadow-lg shadow-blue-500/25 hover:shadow-xl transition-all duration-200 flex items-center gap-2.5 w-fit"
              >
                <span>Request AI Architecture Demo</span>
                <span className="material-symbols-outlined text-base">arrow_forward</span>
              </button>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
