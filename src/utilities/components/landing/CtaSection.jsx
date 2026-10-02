// ============================================================
//  CtaSection.jsx – Final High-Converting Action Banner
// ============================================================

import React from 'react';

export default function CtaSection({ onOpenBooking, onOpenLogin }) {
  return (
    <section className="py-24 lg:py-32 bg-slate-900 text-white relative overflow-hidden">
      {/* Dynamic Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-gradient-to-r from-blue-600/30 via-indigo-500/20 to-teal-400/25 blur-3xl pointer-events-none rounded-full"></div>

      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 relative z-10">
        <div className="max-w-4xl mx-auto rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 p-10 lg:p-16 text-center shadow-2xl relative overflow-hidden border border-blue-400/30">
          
          {/* Decorative Pattern Background */}
          <div className="absolute right-0 top-0 opacity-10 pointer-events-none">
            <span className="material-symbols-outlined text-[280px]">medical_services</span>
          </div>

          <span className="px-3.5 py-1.5 rounded-full bg-white/20 text-white text-xs font-extrabold uppercase tracking-wider backdrop-blur-md inline-block mb-4">
            Transform Hospital Workflow
          </span>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight mb-6">
            Transform Your Hospital's OPD Experience Today
          </h2>

          <p className="text-sm sm:text-base text-blue-100 font-medium max-w-2xl mx-auto leading-relaxed mb-8">
            Join 150+ healthcare facilities delivering a premium, zero-wait patient experience powered by AI queue prediction and real-time dispatch.
          </p>

          <div className="flex flex-wrap justify-center items-center gap-4">
            <button
              onClick={() => onOpenBooking && onOpenBooking('booking')}
              className="px-8 py-4 rounded-2xl text-xs sm:text-sm font-extrabold text-blue-900 bg-white hover:bg-slate-100 shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2.5 active:translate-y-0"
            >
              <span>Book Appointment Token</span>
              <span className="material-symbols-outlined text-base">arrow_forward</span>
            </button>

            <button
              onClick={() => onOpenLogin && onOpenLogin('login')}
              className="px-7 py-4 rounded-2xl text-xs sm:text-sm font-bold text-white bg-white/10 hover:bg-white/20 border border-white/30 backdrop-blur-md transition-all duration-200 flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-lg">badge</span>
              <span>Hospital Staff Login</span>
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}
