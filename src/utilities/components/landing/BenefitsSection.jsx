// ============================================================
//  BenefitsSection.jsx – Premium impact metrics
//  Same metrics / content, visual redesign only.
// ============================================================

import React, { useEffect, useRef, useState } from 'react';

const METRICS = [
  { value: 94, decimals: 0, suffix: '%', label: 'Efficiency Increase', sublabel: 'Optimized OPD workflow', icon: 'trending_up', trend: '+12 pts this year', accent: 'from-[#004ac6] to-[#4f8cff]', soft: 'bg-[#e8efff] text-primary' },
  { value: 60, decimals: 0, suffix: '%', label: 'Reduced Wait Time', sublabel: 'From 45+ to <8 minutes', icon: 'timer', trend: '45 min → 8 min', accent: 'from-[#0ea5a4] to-[#34d399]', soft: 'bg-teal-50 text-teal-600' },
  { value: 99.9, decimals: 1, suffix: '%', label: 'System Uptime', sublabel: 'Reliable cloud network', icon: 'cloud_done', trend: 'Always-on OPD cloud', accent: 'from-[#7c3aed] to-[#4f8cff]', soft: 'bg-violet-50 text-violet-600' },
  { value: 85, decimals: 0, suffix: '%', label: 'Patient Satisfaction', sublabel: 'Higher clinic ratings', icon: 'sentiment_very_satisfied', trend: '4.9 / 5 avg. rating', accent: 'from-[#f59e0b] to-[#f97316]', soft: 'bg-amber-50 text-amber-600' },
];

function useCountUp(target, decimals, start, duration = 1500) {
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

function MetricCard({ metric, start, delay }) {
  const v = useCountUp(metric.value, metric.decimals, start);
  const display = metric.decimals > 0 ? v.toFixed(metric.decimals) : Math.round(v);
  return (
    <div
      className={`group relative overflow-hidden rounded-3xl border border-outline-variant/60 bg-white p-7 text-center transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_24px_60px_rgba(0,74,198,0.16)] hover:border-primary/40 ${
        start ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {/* Top accent + corner glow */}
      <div className={`pointer-events-none absolute inset-x-10 top-0 h-[3px] rounded-full bg-gradient-to-r ${metric.accent} opacity-0 transition-opacity duration-500 group-hover:opacity-100`}></div>
      <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-gradient-to-br from-[#004ac6]/10 to-[#0ea5a4]/10 blur-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>

      <span className={`relative mx-auto flex h-14 w-14 items-center justify-center rounded-2xl shadow-sm transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3 ${metric.soft}`}>
        <span className="material-symbols-outlined text-[26px]">{metric.icon}</span>
      </span>

      <p className={`relative mt-4 font-headline-md text-[2.9rem] font-bold leading-none tracking-tight bg-gradient-to-br ${metric.accent} bg-clip-text text-transparent`}>
        {display}{metric.suffix}
      </p>
      <h3 className="relative mt-2.5 text-[15px] font-bold text-on-surface">{metric.label}</h3>
      <p className="relative mt-1 text-xs font-medium text-on-surface-variant">{metric.sublabel}</p>
      <p className="relative mx-auto mt-4 inline-flex items-center gap-1.5 rounded-full bg-surface px-3 py-1 text-[11px] font-bold text-on-surface-variant ring-1 ring-slate-200">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
        {metric.trend}
      </p>
    </div>
  );
}

export default function BenefitsSection() {
  const [start, setStart] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setStart(true);
          io.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={ref} className="relative overflow-hidden bg-surface py-20 lg:py-24" id="benefits">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-1/2 h-72 w-[720px] -translate-x-1/2 rounded-full bg-gradient-to-r from-[#004ac6]/10 via-[#6366f1]/10 to-[#14b8a6]/10 blur-3xl"></div>
      </div>

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-outline-variant/60 bg-white px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-primary shadow-sm">
            <span className="material-symbols-outlined text-sm">verified</span>
            Measurable impact
          </span>
          <h2 className="mt-4 font-headline-md text-3xl font-bold tracking-tight text-on-surface sm:text-[2.75rem] sm:leading-[1.1]">
            Proven <span className="hero-gradient-text">hospital outcomes</span>
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-on-surface-variant sm:text-base">
            Real performance metrics across partnering hospitals and outpatient clinics.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {METRICS.map((m, i) => (
            <MetricCard key={m.label} metric={m} start={start} delay={i * 110} />
          ))}
        </div>
      </div>
    </section>
  );
}
