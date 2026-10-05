// ============================================================
//  CtaSection.jsx – Premium high-converting CTA finale
//  Same content / callbacks, visual redesign only.
// ============================================================

import React from 'react';

export default function CtaSection({ onOpenBooking, onOpenLogin }) {
  return (
    <section className="relative overflow-hidden bg-surface pb-20 pt-2 lg:pb-24">
      <div className="relative mx-auto max-w-6xl px-6">
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#06265e] via-[#004ac6] to-[#0e7c86] px-6 py-14 text-center shadow-[0_30px_90px_rgba(0,74,198,0.40)] sm:px-12 lg:py-16">
          {/* Decor */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -left-20 -top-24 h-72 w-72 rounded-full bg-cyan-300/20 blur-3xl"></div>
            <div className="absolute -bottom-28 -right-16 h-80 w-80 rounded-full bg-indigo-400/25 blur-3xl"></div>
            <div
              className="absolute inset-0 opacity-[0.10]"
              style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.9) 1px, transparent 1px)', backgroundSize: '24px 24px' }}
            ></div>
            {/* Pulse rings */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <span className="cta-ring block h-72 w-72 rounded-full border border-white/15 sm:h-96 sm:w-96"></span>
              <span className="cta-ring cta-ring-2 absolute left-1/2 top-1/2 block h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10 sm:h-96 sm:w-96"></span>
            </div>
            {/* ECG line */}
            <svg className="absolute bottom-6 left-0 w-full opacity-25" viewBox="0 0 600 60" preserveAspectRatio="none" height="48">
              <path d="M0 34 H180 L196 34 204 14 214 50 222 26 228 34 H330 L344 34 352 10 362 54 370 30 376 34 H480 L492 34 498 20 506 44 512 34 H600"
                fill="none" stroke="#7df0e2" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
            </svg>
            <span className="material-symbols-outlined pointer-events-none absolute -right-6 -top-8 select-none text-[220px] text-white/[0.07]">medical_services</span>
          </div>

          <div className="relative mx-auto max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-white ring-1 ring-white/25 backdrop-blur">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-300"></span>
              </span>
              Live in 150+ facilities
            </span>

            <h2 className="mt-5 font-headline-md text-3xl font-bold leading-[1.12] tracking-tight text-white sm:text-[2.75rem]">
              Transform your hospital's OPD experience
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-blue-100 sm:text-[15px]">
              Join 150+ healthcare facilities delivering a zero-wait patient experience with
              AI queue prediction and real-time dispatch.
            </p>

            {/* Trust row */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-blue-100">
              <span className="flex items-center">
                {['AR', 'SK', 'PN'].map((t, i) => (
                  <span
                    key={t}
                    className={`flex h-8 w-8 items-center justify-center rounded-full border-2 border-white/40 text-[10px] font-bold text-white ${i === 0 ? 'bg-white/20' : i === 1 ? 'bg-white/15' : 'bg-white/10'} ${i > 0 ? '-ml-2' : ''}`}
                  >
                    {t}
                  </span>
                ))}
                <span className="ml-2 text-xs font-semibold">Trusted by care teams</span>
              </span>
              <span className="hidden h-4 w-px bg-white/25 sm:inline-block"></span>
              <span className="flex items-center gap-1 text-xs font-semibold">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className="material-symbols-outlined text-sm text-amber-300" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                ))}
                4.9 / 5
              </span>
            </div>

            <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
              <button
                onClick={() => onOpenBooking && onOpenBooking('booking')}
                className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-8 py-4 text-sm font-bold text-[#004ac6] shadow-[0_16px_40px_rgba(0,0,0,0.25)] transition-all hover:-translate-y-0.5 hover:shadow-[0_20px_50px_rgba(0,0,0,0.35)] active:translate-y-0"
              >
                Book appointment token
                <span className="material-symbols-outlined text-base transition-transform duration-300 group-hover:translate-x-1">arrow_forward</span>
              </button>
              <button
                onClick={() => onOpenLogin && onOpenLogin('login')}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/40 bg-white/10 px-8 py-4 text-sm font-bold text-white backdrop-blur transition-all hover:border-white/70 hover:bg-white/20"
              >
                <span className="material-symbols-outlined text-lg">badge</span>
                Staff login
              </button>
            </div>

            <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.18em] text-blue-200/80">
              Free onboarding · No hardware needed
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
