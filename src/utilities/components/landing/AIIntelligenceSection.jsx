// ============================================================
//  AIIntelligenceSection.jsx – Premium AI product showcase
//  Same content / stats / callback, visual redesign only.
// ============================================================

import React, { useState, useEffect, useRef } from 'react';

function useCountUp(target, decimals, start, duration = 1400) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setValue(target);
      return;
    }
    let raf;
    const t0 = performance.now();
    const tick = (t) => {
      const p = Math.min(1, (t - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(parseFloat((target * eased).toFixed(decimals)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [start, target, decimals, duration]);
  return value;
}

export default function AIIntelligenceSection({ onOpenDemo }) {
  const [activeTab, setActiveTab] = useState('qr'); // 'qr' | 'balancing' | 'neural'
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);

  const waitDrop = useCountUp(60, 0, visible);
  const accuracy = useCountUp(98.4, 1, visible);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const nodes = [
    {
      id: 'qr',
      icon: 'qr_code_2',
      title: 'Touchless QR Check-in',
      meta: '15 sec scan',
      text: 'Patients scan entrance QR kiosks for instant check-in, automated profile creation, and contactless digital token receipt.',
      glow: 'group-hover:shadow-[0_0_0_1px_rgba(45,212,191,0.4),0_12px_35px_rgba(45,212,191,0.25)]',
      ring: 'ring-teal-300/40',
      chip: 'bg-teal-400/10 text-teal-200 ring-teal-300/25',
    },
    {
      id: 'balancing',
      icon: 'balance',
      title: 'Dynamic AI Queue Balancing',
      meta: 'Auto load',
      text: 'Intelligently shifts patient load across active doctor cabins to eliminate bottlenecking during peak morning OPD hours.',
      glow: 'group-hover:shadow-[0_0_0_1px_rgba(96,165,250,0.45),0_12px_35px_rgba(59,130,246,0.3)]',
      ring: 'ring-blue-300/40',
      chip: 'bg-blue-400/10 text-blue-200 ring-blue-300/25',
    },
    {
      id: 'neural',
      icon: 'insights',
      title: 'Predictive Wait Time Engine',
      meta: '99.4% match',
      text: 'Uses historical consultation duration data and live doctor pace to compute exact minute-by-minute wait ETAs.',
      glow: 'group-hover:shadow-[0_0_0_1px_rgba(167,139,250,0.45),0_12px_35px_rgba(139,92,246,0.3)]',
      ring: 'ring-violet-300/40',
      chip: 'bg-violet-400/10 text-violet-200 ring-violet-300/25',
    },
  ];

  const active = nodes.find((n) => n.id === activeTab);

  return (
    <section ref={sectionRef} className="relative overflow-hidden border-y border-slate-100 bg-gradient-to-b from-white via-[#f3f7ff] to-white py-20 lg:py-24" id="technology">
      {/* Ambient */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-28 top-1/4 h-80 w-80 rounded-full bg-[#004ac6]/10 blur-3xl"></div>
        <div className="absolute -right-28 bottom-1/4 h-80 w-80 rounded-full bg-[#0ea5a4]/10 blur-3xl"></div>
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{ backgroundImage: 'radial-gradient(#0b1c30 1px, transparent 1px)', backgroundSize: '26px 26px' }}
        ></div>
      </div>

      <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-6 lg:grid-cols-2">
        {/* ===== Left: AI dashboard ===== */}
        <div className="relative">
          <div className="pointer-events-none absolute -inset-5 rounded-[2rem] bg-gradient-to-br from-[#004ac6]/15 via-transparent to-[#14b8a6]/15 blur-2xl"></div>

          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#0b1c33] via-[#0d2242] to-[#081426] p-5 shadow-[0_28px_80px_rgba(11,28,48,0.35)] ring-1 ring-white/10 sm:p-6">
            {/* Circuit glow lines */}
            <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[#004ac6]/30 blur-3xl"></div>
            <div className="pointer-events-none absolute -bottom-20 -left-14 h-56 w-56 rounded-full bg-[#0ea5a4]/20 blur-3xl"></div>

            {/* Header */}
            <div className="relative flex items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <span className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#4f8cff] via-[#004ac6] to-[#0ea5a4] text-white shadow-lg shadow-blue-500/40">
                  <span className="material-symbols-outlined text-[22px]">psychology</span>
                  <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex h-3 w-3 rounded-full border-2 border-[#0b1c33] bg-emerald-400"></span>
                  </span>
                </span>
                <div>
                  <h3 className="text-[15px] font-bold text-white">Smart OPD AI Engine</h3>
                  <p className="mt-0.5 flex items-center gap-2 text-[11px] font-semibold text-slate-400">
                    Neural Flow Matrix
                    <span className="rounded-md bg-white/10 px-1.5 py-0.5 font-mono text-[10px] text-blue-200 ring-1 ring-white/15">v3.2</span>
                  </p>
                </div>
              </div>
              <span className="hidden items-center gap-1.5 rounded-full bg-emerald-400/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-emerald-300 ring-1 ring-emerald-300/25 sm:inline-flex">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400"></span>
                Learning live
              </span>
            </div>

            {/* Nodes */}
            <div className="relative mt-4 space-y-2.5">
              {nodes.map((n) => {
                const isActive = activeTab === n.id;
                return (
                  <button
                    key={n.id}
                    onClick={() => setActiveTab(n.id)}
                    aria-pressed={isActive}
                    className={`group w-full rounded-2xl border p-4 text-left backdrop-blur transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300/60 ${
                      isActive
                        ? `border-transparent bg-white/[0.09] shadow-[0_14px_40px_rgba(0,0,0,0.35)] ring-2 ${n.ring}`
                        : 'border-white/10 bg-white/[0.04] hover:border-white/25 hover:bg-white/[0.07]'
                    } ${n.glow}`}
                  >
                    <div className="flex items-start gap-3.5">
                      <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white shadow-md transition-transform duration-300 group-hover:scale-105 ${
                        isActive ? 'bg-gradient-to-br from-[#4f8cff] to-[#0ea5a4]' : 'bg-white/10'
                      }`}>
                        <span className="material-symbols-outlined text-xl">{n.icon}</span>
                      </span>
                      <span className="flex-1">
                        <span className="flex items-center justify-between gap-2">
                          <span className="text-sm font-bold text-white">{n.title}</span>
                          <span className={`shrink-0 rounded-md px-2 py-0.5 text-[10px] font-bold ring-1 ${n.chip}`}>{n.meta}</span>
                        </span>
                        <span className="mt-1 block text-[13px] leading-relaxed text-slate-300">{n.text}</span>
                        {/* Active detail strip */}
                        <span className={`grid transition-all duration-500 ${isActive ? 'mt-3 grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                          <span className="overflow-hidden">
                            <span className="ai-flow flex items-center gap-2 rounded-lg bg-black/30 px-3 py-2 font-mono text-[11px] text-teal-200 ring-1 ring-white/10">
                              <span className="ai-dot h-1.5 w-1.5 rounded-full bg-teal-300"></span>
                              {n.id === 'qr' && 'kiosk.scan → ehr.match → token.issued · 15s'}
                              {n.id === 'balancing' && 'load.sense → cabins.rebalance → bottleneck.cleared'}
                              {n.id === 'neural' && 'pace.learn → eta.predict → sms.dispatch · 99.4%'}
                            </span>
                          </span>
                        </span>
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Footer strip */}
            <div className="relative mt-4 flex items-center justify-between rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-[11px] font-semibold text-slate-300">
              <span className="inline-flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm text-teal-300">sync</span>
                Throughput 5.8 min/patient
              </span>
              <span className="hidden font-mono text-slate-400 sm:inline">node: {active.id} · synced just now</span>
            </div>
          </div>
        </div>

        {/* ===== Right: copy ===== */}
        <div className="flex flex-col gap-5">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-outline-variant/60 bg-white px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-primary shadow-sm">
            <span className="material-symbols-outlined text-sm">memory</span>
            Predictive machine learning
          </span>

          <h2 className="font-headline-md text-3xl font-bold tracking-tight text-on-surface sm:text-[2.75rem] sm:leading-[1.1]">
            Intelligence behind <span className="hero-gradient-text">every patient visit</span>
          </h2>

          <p className="max-w-xl text-[15px] leading-relaxed text-on-surface-variant sm:text-base">
            The Smart OPD system uses AI and machine learning to streamline hospital operations,
            reduce waiting-room friction, support priority scheduling, and give leadership clear
            operational analytics.
          </p>

          {/* Metrics */}
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="group relative overflow-hidden rounded-2xl border border-outline-variant/60 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(0,74,198,0.14)]">
              <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-[#004ac6]/10 blur-2xl transition-opacity group-hover:opacity-100"></div>
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-container text-primary">
                <span className="material-symbols-outlined text-xl">trending_down</span>
              </span>
              <p className="mt-3 font-headline-md text-4xl font-bold tracking-tight text-on-surface">
                {waitDrop}<span className="text-2xl text-primary">%</span>
              </p>
              <p className="mt-1 text-sm font-bold text-on-surface">lower wait times</p>
              <p className="text-xs text-on-surface-variant">45+ min down to under 8.</p>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-gradient-to-r from-[#004ac6] to-[#0ea5a4] transition-all duration-1000" style={{ width: visible ? '60%' : '0%' }}></div>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-2xl border border-outline-variant/60 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(0,74,198,0.14)]">
              <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-[#0ea5a4]/15 blur-2xl transition-opacity group-hover:opacity-100"></div>
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200">
                <span className="material-symbols-outlined text-xl">verified</span>
              </span>
              <p className="mt-3 font-headline-md text-4xl font-bold tracking-tight text-on-surface">
                {accuracy}<span className="text-2xl text-emerald-500">%</span>
              </p>
              <p className="mt-1 text-sm font-bold text-on-surface">prediction accuracy</p>
              <p className="text-xs text-on-surface-variant">Tuned to daily doctor pace.</p>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-1000" style={{ width: visible ? '98.4%' : '0%' }}></div>
              </div>
            </div>
          </div>

          <div className="pt-1">
            <button
              onClick={() => onOpenDemo && onOpenDemo('booking')}
              className="group inline-flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-[#004ac6] to-[#1d4ed8] px-7 py-3.5 text-sm font-bold text-white shadow-[0_12px_30px_rgba(0,74,198,0.35)] transition-all hover:shadow-[0_16px_40px_rgba(0,74,198,0.45)] hover:brightness-110 active:scale-[0.98]"
            >
              Request a demo
              <span className="material-symbols-outlined text-base transition-transform duration-300 group-hover:translate-x-1">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
