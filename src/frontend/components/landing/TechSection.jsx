// ============================================================
//  TechSection.jsx – Modern AI Technology Deep Dive
// ============================================================

import React from 'react';

export default function TechSection() {
  const techCards = [
    {
      icon: 'memory',
      title: 'Machine Learning Engine',
      subtitle: 'Adaptive Queue Modeling',
      description: 'Continuously learns from real-time patient traffic patterns, consultation durations, and doctor attendance to refine prediction accuracy.',
    },
    {
      icon: 'account_tree',
      title: 'Random Forest Prediction',
      subtitle: 'Ensemble Neural Forecasting',
      description: 'Utilizes multi-variable ensemble learning models to predict exact patient wait times with 99.4% historical precision.',
    },
    {
      icon: 'insights',
      title: 'Predictive Load Analytics',
      subtitle: 'Peak Congestion Forecasting',
      description: 'Forecasts hospital OPD peak hours, department loads, and staffing requirements up to 7 days in advance.',
    },
  ];

  return (
    <section className="py-24 lg:py-32 bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 text-white relative overflow-hidden" id="technology">
      {/* Background Decorative Glow Orbs */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/15 blur-3xl pointer-events-none rounded-full"></div>
      <div className="absolute bottom-0 left-10 w-96 h-96 bg-indigo-500/15 blur-3xl pointer-events-none rounded-full"></div>

      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/15 border border-blue-400/30 text-blue-300 text-xs font-extrabold uppercase tracking-wider backdrop-blur-md">
            <span className="material-symbols-outlined text-sm">auto_awesome</span>
            <span>Deep AI Architecture</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            Powered by{' '}
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-teal-300 bg-clip-text text-transparent">
              Artificial Intelligence
            </span>
          </h2>

          <p className="text-sm sm:text-base text-slate-300 font-medium leading-relaxed">
            Leveraging state-of-the-art machine learning models and neural node forecasting to solve complex healthcare queuing challenges.
          </p>
        </div>

        {/* Tech Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {techCards.map((card, idx) => (
            <div
              key={idx}
              className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 hover:border-blue-400/50 hover:bg-white/10 transition-all duration-300 group flex flex-col justify-between"
            >
              <div>
                <div className="w-14 h-14 rounded-2xl bg-blue-600/20 border border-blue-400/30 text-blue-400 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                  <span className="material-symbols-outlined text-2xl">{card.icon}</span>
                </div>

                <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-400 block mb-1">
                  {card.subtitle}
                </span>

                <h3 className="text-xl font-extrabold text-white mb-3">
                  {card.title}
                </h3>

                <p className="text-xs text-slate-300 font-medium leading-relaxed">
                  {card.description}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
