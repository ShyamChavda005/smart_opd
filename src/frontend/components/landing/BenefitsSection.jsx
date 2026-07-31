// ============================================================
//  BenefitsSection.jsx – Modern Metrics & Hospital Benefits
// ============================================================

import React from 'react';

export default function BenefitsSection() {
  const metrics = [
    {
      stat: '94%',
      label: 'Efficiency Increase',
      sublabel: 'Optimized OPD Workflow',
      color: 'from-blue-600 to-indigo-600',
      textColor: 'text-blue-600',
      icon: 'trending_up',
    },
    {
      stat: '60%',
      label: 'Reduced Wait Time',
      sublabel: 'From 45+ to <8 Minutes',
      color: 'from-emerald-500 to-teal-600',
      textColor: 'text-emerald-600',
      icon: 'timer',
    },
    {
      stat: '99.9%',
      label: 'System Uptime',
      sublabel: 'Reliable Cloud Network',
      color: 'from-indigo-600 to-purple-600',
      textColor: 'text-indigo-600',
      icon: 'cloud_done',
    },
    {
      stat: '85%',
      label: 'Patient Satisfaction',
      sublabel: 'Higher Clinic Ratings',
      color: 'from-amber-500 to-orange-600',
      textColor: 'text-amber-500',
      icon: 'sentiment_very_satisfied',
    },
  ];

  return (
    <section className="py-24 lg:py-32 bg-white relative overflow-hidden" id="benefits">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/90 text-emerald-700 text-xs font-extrabold uppercase tracking-wider shadow-sm">
            <span className="material-symbols-outlined text-sm">verified</span>
            <span>Measurable Impact</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Proven Hospital{' '}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-500 bg-clip-text text-transparent">
              Benefits &amp; Outcomes
            </span>
          </h2>

          <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed">
            Real-world performance metrics achieved across partnering hospitals and outpatient clinics.
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((item, idx) => (
            <div
              key={idx}
              className="bg-slate-50/80 rounded-3xl p-8 border border-slate-200/80 hover:bg-white hover:border-slate-300 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col items-center text-center group relative overflow-hidden"
            >
              <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center mb-5 text-slate-700 shadow-sm group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-2xl">{item.icon}</span>
              </div>

              <div className={`text-4xl sm:text-5xl font-black tracking-tight mb-2 bg-gradient-to-r ${item.color} bg-clip-text text-transparent`}>
                {item.stat}
              </div>

              <h3 className="text-sm font-extrabold text-slate-900 mb-1">
                {item.label}
              </h3>

              <p className="text-xs text-slate-400 font-semibold">
                {item.sublabel}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
