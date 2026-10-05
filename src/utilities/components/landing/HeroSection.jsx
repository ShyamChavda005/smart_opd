// ============================================================
//  HeroSection.jsx – Premium, high-impact hero
//  Same props / state behaviour / callbacks, visual redesign only.
// ============================================================

import React, { useState, useEffect } from 'react';

export default function HeroSection({ onOpenBooking, onOpenLogin }) {
  const [activeTab, setActiveTab] = useState('queue'); // 'queue' | 'ai' | 'doctor'
  const [currentToken] = useState(104);
  const [estWait, setEstWait] = useState(4);

  useEffect(() => {
    const interval = setInterval(() => {
      setEstWait((prev) => (prev > 1 ? prev - 1 : 5));
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const tabs = [
    { id: 'queue', label: 'Live Queue' },
    { id: 'ai', label: 'AI Forecast' },
    { id: 'doctor', label: 'Doctor Load' },
  ];

  const queue = [
    { token: '#T-105', name: 'Manish Verma', note: 'Regular checkup', wait: '~6 min', initials: 'MV', tone: 'bg-blue-100 text-blue-700' },
    { token: '#T-106', name: 'Priya Patel', note: 'ECG report review', wait: '~12 min', initials: 'PP', tone: 'bg-indigo-100 text-indigo-700' },
  ];

  return (
    <section className="relative overflow-hidden bg-surface pt-24 pb-12 lg:pt-28 lg:pb-16" id="home">
      {/* ---- Ambient background ---- */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-x-0 top-0 h-[560px] bg-gradient-to-b from-[#dbe7ff] via-[#eef4ff] to-transparent"></div>
        <div className="hero-orb absolute -top-24 left-1/2 h-96 w-[720px] -translate-x-1/2 rounded-full bg-gradient-to-r from-[#004ac6]/25 via-[#6366f1]/20 to-[#14b8a6]/25 blur-3xl"></div>
        <div className="absolute -left-24 top-40 h-72 w-72 rounded-full bg-[#14b8a6]/15 blur-3xl"></div>
        <div className="absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-[#004ac6]/10 blur-3xl"></div>
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: 'radial-gradient(#0b1c30 1px, transparent 1px)',
            backgroundSize: '26px 26px',
          }}
        ></div>
      </div>

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-12">
          {/* ================= LEFT ================= */}
          <div className="lg:col-span-6">
            <div className="inline-flex items-center gap-2.5 rounded-full border border-white/60 bg-white/80 py-1.5 pl-2 pr-4 shadow-[0_4px_16px_rgba(0,74,198,0.10)] backdrop-blur">
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-white">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white"></span>
                </span>
                Live
              </span>
              <span className="text-xs font-semibold text-on-surface-variant">
                OPD queue running now · Cardiology OPD-4
              </span>
            </div>

            <h1 className="mt-5 font-headline-md text-4xl font-bold leading-[1.08] tracking-tight text-on-surface sm:text-5xl">
              Zero-wait hospital visits,{' '}
              <span className="hero-gradient-text">predicted by AI.</span>
            </h1>

            <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-on-surface-variant sm:text-base">
              MediQueue orchestrates OPD queues in real time — accurate wait forecasts,
              instant tokens, and calm waiting rooms your patients will love.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                onClick={() => onOpenLogin && onOpenLogin('login')}
                className="group inline-flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-[#004ac6] via-[#1d4ed8] to-[#0ea5a4] px-7 py-3.5 text-sm font-bold text-white shadow-[0_12px_30px_rgba(0,74,198,0.35)] transition-all hover:shadow-[0_16px_40px_rgba(0,74,198,0.45)] hover:brightness-110 active:scale-[0.98]"
              >
                <span className="material-symbols-outlined text-lg">badge</span>
                Enter Staff Portal
                <span className="material-symbols-outlined text-base transition-transform group-hover:translate-x-1">arrow_forward</span>
              </button>
              <button
                onClick={() => onOpenBooking && onOpenBooking('booking')}
                className="inline-flex items-center gap-2 rounded-2xl border border-outline-variant bg-white/80 px-7 py-3.5 text-sm font-bold text-primary shadow-sm backdrop-blur transition-colors hover:border-primary hover:bg-white"
              >
                <span className="material-symbols-outlined text-lg">confirmation_number</span>
                Get my token
              </button>
            </div>

            {/* Trust row */}
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
              <div className="flex items-center">
                {['AR', 'SK', 'PN', '+'].map((t, i) => (
                  <span
                    key={t}
                    className={`flex h-9 w-9 items-center justify-center rounded-full border-2 border-white text-[11px] font-bold text-white shadow-sm ${
                      i === 0 ? 'bg-[#004ac6]' : i === 1 ? 'bg-[#0ea5a4]' : i === 2 ? 'bg-[#6366f1]' : 'bg-slate-900'
                    } ${i > 0 ? '-ml-2.5' : ''}`}
                  >
                    {t}
                  </span>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className="material-symbols-outlined text-base text-amber-400" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  ))}
                  <span className="ml-1 text-sm font-bold text-on-surface">4.9</span>
                </div>
                <p className="mt-0.5 text-xs font-medium text-on-surface-variant">Loved by 150+ clinics & hospitals</p>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-6 grid grid-cols-3 overflow-hidden rounded-2xl border border-outline-variant/60 bg-white/80 shadow-sm backdrop-blur">
              {[
                { big: '< 8 min', small: 'Avg. wait', icon: 'timer' },
                { big: '99.4%', small: 'AI accuracy', icon: 'psychology' },
                { big: '60%', small: 'Less crowding', icon: 'groups' },
              ].map((s) => (
                <div key={s.small} className="flex flex-col items-center gap-1 px-4 py-4 text-center [&:not(:last-child)]:border-r [&:not(:last-child)]:border-outline-variant/50">
                  <span className="material-symbols-outlined text-xl text-primary">{s.icon}</span>
                  <p className="text-xl font-bold tracking-tight text-on-surface">{s.big}</p>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">{s.small}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ================= RIGHT ================= */}
          <div className="relative lg:col-span-6">
            <div className="pointer-events-none absolute -inset-6 rounded-[2rem] bg-gradient-to-br from-[#004ac6]/15 via-transparent to-[#14b8a6]/15 blur-2xl"></div>

            <div className="relative rounded-3xl border border-white/60 bg-white/90 p-5 shadow-[0_24px_70px_rgba(0,74,198,0.18)] backdrop-blur-xl sm:p-6">
              {/* Card header */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#004ac6] to-[#0ea5a4] text-white shadow-lg shadow-blue-600/30">
                      <span className="material-symbols-outlined text-2xl">monitor_heart</span>
                    </div>
                    <span className="absolute -bottom-0.5 -right-0.5 flex h-3.5 w-3.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500"></span>
                    </span>
                  </div>
                  <div>
                    <h3 className="text-[15px] font-bold text-on-surface">Cardiology OPD · OPD-4</h3>
                    <p className="text-xs font-medium text-on-surface-variant">Dr. Sharma · Room 402B · 18 served today</p>
                  </div>
                </div>
                <span className="hidden items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-emerald-700 sm:inline-flex">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500"></span>
                  Dispatching
                </span>
              </div>

              {/* Tabs */}
              <div className="mt-5 grid grid-cols-3 gap-1 rounded-2xl bg-slate-100 p-1 text-sm font-bold">
                {tabs.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setActiveTab(t.id)}
                    className={`rounded-xl py-2 text-xs transition-all ${
                      activeTab === t.id
                        ? 'bg-white text-primary shadow-[0_2px_10px_rgba(11,28,48,0.10)]'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {activeTab === 'queue' && (
                <div className="mt-4 animate-fadeIn space-y-3">
                  <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#004ac6] via-[#1e40af] to-[#0e7490] p-4 text-white shadow-lg shadow-blue-900/30">
                    <span className="material-symbols-outlined pointer-events-none absolute -right-3 -top-3 text-[110px] text-white/10">confirmation_number</span>
                    <div className="relative">
                      <div className="flex items-center justify-between">
                        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-blue-200">Now consulting</p>
                        <span className="rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold backdrop-blur">
                          {estWait} min left
                        </span>
                      </div>
                      <div className="mt-2 flex items-end justify-between">
                        <p className="text-3xl font-bold tracking-tight">#T-{currentToken}</p>
                        <p className="pb-1 text-xs font-semibold text-blue-100">Manish V. · in room</p>
                      </div>
                      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/20">
                        <div className="hero-progress h-full w-3/4 rounded-full bg-gradient-to-r from-emerald-300 to-teal-200"></div>
                      </div>
                    </div>
                  </div>

                  <p className="px-1 text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">Up next</p>
                  {queue.map((p) => (
                    <div
                      key={p.token}
                      className="flex items-center justify-between gap-3 rounded-2xl border border-outline-variant/50 bg-surface p-2.5 transition-colors hover:border-primary/40 hover:bg-white"
                    >
                      <div className="flex items-center gap-3">
                        <span className={`flex h-10 w-10 items-center justify-center rounded-xl text-xs font-bold ${p.tone}`}>{p.initials}</span>
                        <div>
                          <p className="text-sm font-bold text-on-surface">
                            {p.name} <span className="ml-1 font-semibold text-primary">{p.token}</span>
                          </p>
                          <p className="text-xs text-on-surface-variant">{p.note}</p>
                        </div>
                      </div>
                      <span className="shrink-0 rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-700 ring-1 ring-amber-200">
                        {p.wait}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'ai' && (
                <div className="mt-4 animate-fadeIn">
                  <div className="space-y-3 rounded-2xl bg-slate-900 p-5 text-white">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-300">
                        <span className="material-symbols-outlined text-base">psychology</span>
                        AI neural forecast
                      </span>
                      <span className="rounded-full bg-teal-400/15 px-2.5 py-1 text-[10px] font-bold text-teal-200 ring-1 ring-teal-400/30">
                        99.4% match
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed text-slate-200">
                      Queue is <span className="font-bold text-emerald-300">14% faster</span> than peak
                      average · <span className="font-bold text-white">5.8 min / patient</span>
                    </p>
                    <div className="grid grid-cols-2 gap-3 border-t border-white/10 pt-3 text-xs">
                      <div className="rounded-xl bg-white/5 p-3">
                        <p className="text-slate-400">Peak congestion</p>
                        <p className="mt-0.5 font-bold text-white">11:30 – 12:15</p>
                      </div>
                      <div className="rounded-xl bg-emerald-400/10 p-3 ring-1 ring-emerald-400/20">
                        <p className="text-emerald-200/70">Best arrival</p>
                        <p className="mt-0.5 font-bold text-emerald-300">10:45 · walk in</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'doctor' && (
                <div className="mt-4 animate-fadeIn space-y-2.5">
                  <div className="rounded-2xl border border-outline-variant/50 bg-surface p-4">
                    <div className="flex items-center justify-between text-sm font-bold text-on-surface">
                      <span className="inline-flex items-center gap-2">
                        <span className="material-symbols-outlined text-lg text-primary">stethoscope</span>
                        Doctors on duty
                      </span>
                      <span className="text-primary">4 / 4</span>
                    </div>
                    <div className="mt-2.5 h-2 overflow-hidden rounded-full bg-white">
                      <div className="h-full w-full rounded-full bg-gradient-to-r from-[#004ac6] to-[#0ea5a4]"></div>
                    </div>
                  </div>
                  {[
                    { name: 'Dr. Sharma', dept: 'Cardiology', done: '18 done', pct: 'w-[90%]', active: true },
                    { name: 'Dr. Mehta', dept: 'Orthopedics', done: '14 done', pct: 'w-[70%]', active: true },
                  ].map((d) => (
                    <div key={d.name} className="rounded-2xl border border-outline-variant/50 bg-surface p-3.5">
                      <div className="flex items-center justify-between text-sm">
                        <p className="font-bold text-on-surface">{d.name} <span className="font-medium text-on-surface-variant">· {d.dept}</span></p>
                        <span className="text-xs font-bold text-emerald-600">{d.done}</span>
                      </div>
                      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-200/70">
                        <div className={`h-full rounded-full bg-gradient-to-r from-[#004ac6] to-[#0ea5a4] ${d.pct}`}></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-on-surface-variant">
                <span className="inline-flex items-center gap-1.5 font-medium">
                  <span className="material-symbols-outlined text-sm text-emerald-500">sync</span>
                  Live sync · WebSocket
                </span>
                <span className="font-bold">Smart OPD Cloud</span>
              </div>
            </div>

            {/* Floating badges — parked clear of card header/tabs */}
            <div className="absolute -top-5 right-6 hidden animate-float items-center gap-2.5 rounded-2xl border border-white/60 bg-white/95 p-3 pr-4 shadow-[0_16px_40px_rgba(0,74,198,0.18)] backdrop-blur md:flex z-10">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-lg shadow-emerald-500/30">
                <span className="material-symbols-outlined text-xl">bolt</span>
              </span>
              <span>
                <span className="block text-sm font-bold text-on-surface">−82% wait</span>
                <span className="block text-[11px] font-medium text-on-surface-variant">vs. paper queue</span>
              </span>
            </div>
            <div className="absolute -bottom-5 left-6 hidden animate-float-reverse items-center gap-2.5 rounded-2xl border border-white/60 bg-white/95 p-3 pr-4 shadow-[0_16px_40px_rgba(0,74,198,0.18)] backdrop-blur md:flex z-10">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#004ac6] to-[#6366f1] text-white shadow-lg shadow-blue-600/30">
                <span className="material-symbols-outlined text-xl">verified</span>
              </span>
              <span>
                <span className="block text-sm font-bold text-on-surface">SMS + App alerts</span>
                <span className="block text-[11px] font-medium text-on-surface-variant">never miss a turn</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
