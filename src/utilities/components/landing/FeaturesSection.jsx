// ============================================================
//  FeaturesSection.jsx – Premium OPD Modules showcase
//  Same content / callback, visual redesign only.
// ============================================================

import React from 'react';

const FEATURES = [
  {
    id: 'registration',
    icon: 'qr_code_scanner',
    title: 'Smart Patient Registration',
    description: 'Contactless check-in with instant QR code scanning, automated digital health record (EHR) creation, and self-service kiosk support.',
    tags: ['Instant QR', 'Digital EHR', 'Self Kiosk'],
    accent: 'from-[#004ac6] to-[#0ea5a4]',
    soft: 'bg-[#e8efff]',
    span: 'lg:col-span-2',
  },
  {
    id: 'appointment',
    icon: 'calendar_month',
    title: 'Appointment Management',
    description: 'Centralized multi-doctor schedule hub. Easily book, reschedule, or cancel tokens in real-time with automatic slot conflict detection.',
    tags: ['Live Sync', 'Multi-Doctor', 'Auto Slot'],
    accent: 'from-[#7c3aed] to-[#004ac6]',
    soft: 'bg-violet-50',
    span: 'lg:col-span-2',
  },
  {
    id: 'monitoring',
    icon: 'monitoring',
    title: 'Real-Time OPD Monitoring',
    description: 'Live visual analytics dashboard for hospital administrators to track patient throughput, bottlenecks, and active department loads.',
    tags: ['Admin Dashboard', 'Live Track', 'Heatmaps'],
    accent: 'from-[#0ea5a4] to-[#10b981]',
    soft: 'bg-teal-50',
    span: 'lg:col-span-2',
  },
  {
    id: 'triage',
    icon: 'priority_high',
    title: 'Priority Triage Scheduling',
    description: 'Automated clinical triage categorization. High-risk, elderly, or emergency cases automatically fast-tracked with instant alerts.',
    tags: ['Emergency Triage', 'Fast Track', 'Clinical Alert'],
    accent: 'from-[#f43f5e] to-[#f97316]',
    soft: 'bg-rose-50',
    span: 'lg:col-span-3',
  },
  {
    id: 'tokens',
    icon: 'confirmation_number',
    title: 'Smart Token Generation',
    description: 'Automated token queue system connected with waiting lounge TV displays, mobile SMS notifications, and live status pages.',
    tags: ['SMS Notification', 'TV Display', 'App Token'],
    accent: 'from-[#0284c7] to-[#6366f1]',
    soft: 'bg-sky-50',
    span: 'lg:col-span-3',
  },
];

export default function FeaturesSection({ onOpenFeature }) {
  const open = () => onOpenFeature && onOpenFeature('feature');

  return (
    <section className="relative overflow-hidden bg-white py-20 lg:py-24 border-y border-slate-100" id="features">
      {/* Ambient wash */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 left-1/2 h-80 w-[760px] -translate-x-1/2 rounded-full bg-gradient-to-r from-[#004ac6]/10 via-[#6366f1]/10 to-[#14b8a6]/10 blur-3xl"></div>
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{ backgroundImage: 'radial-gradient(#0b1c30 1px, transparent 1px)', backgroundSize: '26px 26px' }}
        ></div>
      </div>

      <div className="relative mx-auto max-w-6xl px-6">
        {/* Heading */}
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-outline-variant/60 bg-surface px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-primary shadow-sm">
            <span className="material-symbols-outlined text-sm">grid_view</span>
            OPD Modules
          </span>
          <h2 className="mt-4 font-headline-md text-3xl font-bold tracking-tight text-on-surface sm:text-[2.75rem] sm:leading-[1.1]">
            One platform, <span className="hero-gradient-text">every OPD workflow</span>
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-on-surface-variant sm:text-base">
            Six deeply-integrated modules covering the full patient journey — from scan-to-token to live analytics.
          </p>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-6">
          {/* Spotlight: AI prediction */}
          <button
            onClick={open}
            className="group relative overflow-hidden rounded-3xl bg-slate-900 p-7 text-left shadow-[0_20px_60px_rgba(11,28,48,0.25)] transition-transform duration-300 hover:-translate-y-1 md:col-span-2 lg:col-span-4 sm:p-8"
          >
            <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[#004ac6]/40 blur-3xl transition-opacity duration-500 group-hover:opacity-100"></div>
            <div className="pointer-events-none absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-[#0ea5a4]/25 blur-3xl"></div>
            <div className="spotlight-sheen pointer-events-none absolute inset-0"></div>

            <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#4f8cff] to-[#0ea5a4] text-white shadow-lg shadow-blue-500/30 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                    <span className="material-symbols-outlined text-2xl">psychology</span>
                  </span>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-teal-200 ring-1 ring-white/20">
                    Flagship · AI Engine
                  </span>
                </div>
                <h3 className="mt-4 text-2xl font-bold tracking-tight text-white sm:text-[1.7rem]">
                  AI Waiting Time Prediction
                </h3>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-300">
                  Hyper-accurate wait time forecasting powered by machine learning algorithms that adapt to live doctor speeds and daily patient footfall.
                </p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {['99.4% Accuracy', 'Neural Engine', 'Dynamic ETA'].map((t) => (
                    <span key={t} className="rounded-md bg-white/10 px-2.5 py-1 text-[11px] font-semibold text-blue-100 ring-1 ring-white/15">{t}</span>
                  ))}
                </div>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-white">
                  Explore capabilities
                  <span className="material-symbols-outlined text-base transition-transform duration-300 group-hover:translate-x-1.5">arrow_forward</span>
                </span>
              </div>

              {/* Live ETA visual */}
              <div className="w-full shrink-0 rounded-2xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur sm:w-56">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Live ETA</p>
                <p className="mt-1 text-3xl font-bold text-white">6<span className="text-base font-semibold text-slate-300"> min</span></p>
                <div className="mt-4 flex h-20 items-end gap-1.5">
                  {[38, 55, 44, 70, 58, 86, 64, 95, 72, 100].map((h, i) => (
                    <span
                      key={i}
                      className="module-bar w-full rounded-full bg-gradient-to-t from-[#004ac6] to-[#2dd4bf]"
                      style={{ height: `${h}%`, animationDelay: `${i * 0.18}s` }}
                    ></span>
                  ))}
                </div>
                <p className="mt-3 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-300">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400"></span>
                  14% faster than peak
                </p>
              </div>
            </div>
          </button>

          {/* Side stat panel */}
          <div className="flex flex-col justify-between gap-5 rounded-3xl border border-outline-variant/60 bg-gradient-to-b from-surface to-white p-7 md:col-span-2 lg:col-span-2">
            <div>
              <p className="font-headline-md text-5xl font-bold tracking-tight text-on-surface">06</p>
              <p className="mt-1 text-sm font-bold text-on-surface">modules · 1 platform</p>
              <p className="mt-2 text-[13px] leading-relaxed text-on-surface-variant">
                Registration to analytics — every step connected, no tab-switching for staff.
              </p>
            </div>
            <div className="space-y-2.5 border-t border-outline-variant/50 pt-5">
              {[
                { icon: 'bolt', text: '< 8 min average wait' },
                { icon: 'sms', text: 'SMS + display + app sync' },
                { icon: 'shield', text: 'Role-based staff access' },
              ].map((r) => (
                <p key={r.text} className="flex items-center gap-2.5 text-[13px] font-semibold text-on-surface">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-surface-container text-primary">
                    <span className="material-symbols-outlined text-base">{r.icon}</span>
                  </span>
                  {r.text}
                </p>
              ))}
            </div>
          </div>

          {/* Remaining modules */}
          {FEATURES.map((item, idx) => (
            <button
              key={item.id}
              onClick={open}
              className={`group relative overflow-hidden rounded-3xl border border-outline-variant/60 bg-surface p-6 text-left transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_50px_rgba(0,74,198,0.14)] hover:border-primary/40 md:col-span-1 ${item.span}`}
            >
              <div className={`pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${item.accent} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}></div>
              <div className="flex items-start justify-between">
                <span className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${item.accent} text-white shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3`}>
                  <span className="material-symbols-outlined text-[22px]">{item.icon}</span>
                </span>
                <span className="font-headline-md text-sm font-bold text-slate-300 transition-colors group-hover:text-primary">
                  0{idx + 2}
                </span>
              </div>
              <h3 className="mt-5 text-[17px] font-bold tracking-tight text-on-surface">{item.title}</h3>
              <p className="mt-2 text-[13px] leading-relaxed text-on-surface-variant">{item.description}</p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {item.tags.map((tag) => (
                  <span key={tag} className={`rounded-md px-2 py-1 text-[11px] font-semibold text-on-surface-variant ring-1 ring-inset ring-slate-200 ${item.soft}`}>
                    {tag}
                  </span>
                ))}
              </div>
              <span className="mt-5 inline-flex items-center gap-1.5 border-t border-outline-variant/40 pt-4 text-[13px] font-bold text-primary">
                Learn more
                <span className="material-symbols-outlined text-base transition-transform duration-300 group-hover:translate-x-1">arrow_forward</span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
