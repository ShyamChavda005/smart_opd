// ============================================================
//  FeaturesSection.jsx – Modern & Interactive Features Grid
// ============================================================

import React from 'react';

export default function FeaturesSection({ onOpenFeature }) {
  const features = [
    {
      id: 'registration',
      icon: 'qr_code_scanner',
      iconBg: 'from-blue-500 to-indigo-600 shadow-blue-500/20',
      title: 'Smart Patient Registration',
      description: 'Contactless check-in with instant QR code scanning, automated digital health record (EHR) creation, and self-service kiosk support.',
      tags: ['Instant QR', 'Digital EHR', 'Self Kiosk'],
    },
    {
      id: 'appointment',
      icon: 'calendar_month',
      iconBg: 'from-teal-500 to-emerald-600 shadow-teal-500/20',
      title: 'Appointment Management',
      description: 'Centralized multi-doctor schedule hub. Easily book, reschedule, or cancel tokens in real-time with automatic slot conflict detection.',
      tags: ['Live Sync', 'Multi-Doctor', 'Auto Slot'],
    },
    {
      id: 'ai_prediction',
      icon: 'psychology',
      iconBg: 'from-indigo-500 to-purple-600 shadow-indigo-500/20',
      title: 'AI Waiting Time Prediction',
      description: 'Hyper-accurate wait time forecasting powered by machine learning algorithms that adapt to live doctor speeds and daily patient footfall.',
      tags: ['99.4% Accuracy', 'Neural Engine', 'Dynamic ETA'],
    },
    {
      id: 'monitoring',
      icon: 'monitoring',
      iconBg: 'from-amber-500 to-orange-600 shadow-amber-500/20',
      title: 'Real-Time OPD Monitoring',
      description: 'Live visual analytics dashboard for hospital administrators to track patient throughput, bottlenecks, and active department loads.',
      tags: ['Admin Dashboard', 'Live Track', 'Heatmaps'],
    },
    {
      id: 'triage',
      icon: 'priority_high',
      iconBg: 'from-rose-500 to-red-600 shadow-rose-500/20',
      title: 'Priority Triage Scheduling',
      description: 'Automated clinical triage categorization. High-risk, elderly, or emergency cases automatically fast-tracked with instant alerts.',
      tags: ['Emergency Triage', 'Fast Track', 'Clinical Alert'],
    },
    {
      id: 'tokens',
      icon: 'confirmation_number',
      iconBg: 'from-cyan-500 to-blue-600 shadow-cyan-500/20',
      title: 'Smart Token Generation',
      description: 'Automated token queue system connected with waiting lounge TV displays, mobile SMS notifications, and live status pages.',
      tags: ['SMS Notification', 'TV Display', 'App Token'],
    },
  ];

  return (
    <section className="py-24 lg:py-32 bg-slate-50/70 border-y border-slate-200/80 relative" id="features">
      {/* Subtle Background Glow Orbs */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-blue-400/10 blur-3xl pointer-events-none rounded-full -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-400/10 blur-3xl pointer-events-none rounded-full"></div>

      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/90 text-blue-700 text-xs font-extrabold uppercase tracking-wider shadow-sm">
            <span className="material-symbols-outlined text-sm">grid_view</span>
            <span>Modular OPD Architecture</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Powerful Features Built for{' '}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-500 bg-clip-text text-transparent">
              Modern Hospitals
            </span>
          </h2>

          <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed">
            Comprehensive AI-powered modules designed to handle every stage of the patient journey and hospital OPD administration seamlessly.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {features.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl p-7 border border-slate-200/80 shadow-md hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1.5 transition-all duration-300 group flex flex-col justify-between relative overflow-hidden"
            >
              {/* Top Accent Gradient Line on Hover */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              <div>
                {/* Icon Box */}
                <div className="flex items-center justify-between mb-6">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.iconBg} text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <span className="material-symbols-outlined text-2xl">{item.icon}</span>
                  </div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                    Active Module
                  </span>
                </div>

                {/* Title & Description */}
                <h3 className="text-lg font-extrabold text-slate-900 mb-2.5 group-hover:text-blue-600 transition-colors">
                  {item.title}
                </h3>
                
                <p className="text-xs text-slate-500 font-medium leading-relaxed mb-6">
                  {item.description}
                </p>

                {/* Feature Mini Tags */}
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {item.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-bold text-slate-600 bg-slate-100/90 px-2.5 py-1 rounded-lg border border-slate-200/60"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => onOpenFeature && onOpenFeature('feature')}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-slate-700 hover:text-blue-600 bg-slate-50 hover:bg-blue-50/80 border border-slate-200/80 group-hover:border-blue-200 transition-all flex items-center justify-between mt-auto"
              >
                <span>Explore Capabilities</span>
                <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </button>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
