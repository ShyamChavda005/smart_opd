// ============================================================
//  TechSection.jsx – Premium futuristic AI architecture showcase
//  Same content, visual redesign only.
// ============================================================

import React, { useEffect, useRef, useState } from 'react';

const CARDS = [
  {
    icon: 'memory',
    title: 'Machine Learning Engine',
    subtitle: 'Adaptive queue modeling',
    description: 'Continuously learns from real-time patient traffic patterns, consultation durations, and doctor attendance to refine prediction accuracy.',
    foot: 'Learns every token',
    footIcon: 'autorenew',
    glow: 'group-hover:shadow-[0_24px_70px_rgba(59,130,246,0.35)]',
    iconBg: 'from-[#4f8cff] to-[#0ea5a4]',
  },
  {
    icon: 'account_tree',
    title: 'Random Forest Prediction',
    subtitle: 'Ensemble forecasting',
    description: 'Utilizes multi-variable ensemble learning models to predict exact patient wait times with 99.4% historical precision.',
    foot: '120 trees voting live',
    footIcon: 'hub',
    glow: 'group-hover:shadow-[0_24px_70px_rgba(139,92,246,0.35)]',
    iconBg: 'from-[#8b5cf6] to-[#4f8cff]',
  },
  {
    icon: 'insights',
    title: 'Predictive Load Analytics',
    subtitle: 'Peak congestion forecasting',
    description: 'Forecasts hospital OPD peak hours, department loads, and staffing requirements up to 7 days in advance.',
    foot: '7-day demand outlook',
    footIcon: 'calendar_month',
    glow: 'group-hover:shadow-[0_24px_70px_rgba(45,212,191,0.30)]',
    iconBg: 'from-[#0ea5a4] to-[#34d399]',
  },
];

export default function TechSection() {
  const [shown, setShown] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={ref} className="relative overflow-hidden bg-[#070f22] py-20 text-white lg:py-24" id="technology">
      {/* Neural backdrop */}
      <div className="pointer-events-none absolute inset-0">
        <NeuralNet />
        <div className="absolute -top-32 left-1/4 h-96 w-96 rounded-full bg-[#1d4ed8]/25 blur-3xl"></div>
        <div className="absolute -bottom-32 right-1/4 h-96 w-96 rounded-full bg-[#0ea5a4]/15 blur-3xl"></div>
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-400/50 to-transparent"></div>
      </div>

      <div className="relative mx-auto max-w-6xl px-6">
        {/* Header */}
        <div
          className={`mx-auto mb-12 max-w-2xl text-center transition-all duration-700 ${shown ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-blue-200 backdrop-blur">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-300 opacity-70"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-300"></span>
            </span>
            AI architecture
          </span>
          <h2 className="mt-4 font-headline-md text-3xl font-bold tracking-tight sm:text-[2.75rem] sm:leading-[1.1]">
            Powered by{' '}
            <span className="bg-gradient-to-r from-[#7db4ff] via-[#a5b4fc] to-[#5eead4] bg-clip-text text-transparent">
              artificial intelligence
            </span>
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-300 sm:text-[15px]">
            Three cooperating models observe, predict, and balance the entire OPD — learning from every patient, every day.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {CARDS.map((card, i) => (
            <article
              key={card.title}
              className={`group relative flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-7 backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:border-white/25 hover:bg-white/[0.07] ${card.glow} ${
                shown ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`}
              style={{ transitionDelay: `${i * 120}ms` }}
            >
              {/* Top glow line */}
              <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/70 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>

              <div className="flex items-start justify-between">
                <span className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br p-3.5 text-white shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 ${card.iconBg}`}>
                  <span className="material-symbols-outlined text-[26px]">{card.icon}</span>
                </span>
                <span className="font-mono text-xs font-bold text-slate-500 transition-colors group-hover:text-cyan-300">
                  0{i + 1}
                </span>
              </div>

              <p className="mt-6 text-[11px] font-bold uppercase tracking-[0.18em] text-cyan-300/90">
                {card.subtitle}
              </p>
              <h3 className="mt-1.5 text-xl font-bold tracking-tight text-white">{card.title}</h3>
              <p className="mt-2.5 text-sm leading-relaxed text-slate-300">{card.description}</p>

              {/* Unique visual */}
              <div className="mt-5 rounded-2xl border border-white/10 bg-black/30 p-4">
                {i === 0 && <LearningLoop />}
                {i === 1 && <ForestVotes />}
                {i === 2 && <WeekForecast />}
              </div>

              <p className="mt-5 inline-flex items-center gap-2 border-t border-white/10 pt-4 text-xs font-bold text-slate-300">
                <span className="material-symbols-outlined text-base text-cyan-300">{card.footIcon}</span>
                {card.foot}
              </p>
            </article>
          ))}
        </div>

        {/* Model strip */}
        <div
          className={`mt-8 flex flex-col items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.04] px-6 py-4 backdrop-blur transition-all delay-300 duration-700 sm:flex-row ${
            shown ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
          }`}
        >
          {[
            ['99.4%', 'historical precision'],
            ['5.8 min', 'per-patient throughput'],
            ['24 / 7', 'continuous learning'],
          ].map(([v, l]) => (
            <p key={l} className="flex items-baseline gap-2 text-sm">
              <span className="font-headline-md text-xl font-bold text-white">{v}</span>
              <span className="font-medium text-slate-400">{l}</span>
            </p>
          ))}
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest text-emerald-300 ring-1 ring-emerald-300/25">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400"></span>
            Models online
          </span>
        </div>
      </div>
    </section>
  );
}

/* ---------- Backdrop: abstract neural net ---------- */
function NeuralNet() {
  const nodes = [
    [8, 22], [8, 50], [8, 78],
    [26, 14], [26, 38], [26, 62], [26, 86],
    [50, 26], [50, 50], [50, 74],
    [74, 30], [74, 55], [74, 78],
    [92, 42], [92, 62],
  ];
  const links = [[0, 3], [0, 4], [1, 4], [1, 5], [2, 5], [2, 6], [3, 7], [4, 7], [4, 8], [5, 8], [5, 9], [6, 9], [7, 10], [8, 10], [8, 11], [9, 11], [9, 12], [10, 13], [11, 13], [11, 14], [12, 14]];
  return (
    <svg className="absolute inset-0 h-full w-full opacity-[0.16]" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
      {links.map(([a, b], i) => (
        <line key={i} x1={nodes[a][0]} y1={nodes[a][1]} x2={nodes[b][0]} y2={nodes[b][1]} stroke="#60a5fa" strokeWidth="0.25" />
      ))}
      {nodes.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i % 4 === 0 ? 1 : 0.6} fill={i % 4 === 0 ? '#5eead4' : '#93c5fd'} />
      ))}
    </svg>
  );
}

/* ---------- Card visuals ---------- */
function LearningLoop() {
  return (
    <div className="flex items-center gap-3">
      <svg viewBox="0 0 44 44" className="h-12 w-12 -rotate-90">
        <circle cx="22" cy="22" r="18" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="5" />
        <circle cx="22" cy="22" r="18" fill="none" stroke="url(#llg)" strokeWidth="5" strokeLinecap="round" strokeDasharray="113" strokeDashoffset="18">
          <animate attributeName="stroke-dashoffset" values="90;18;90" dur="4s" repeatCount="indefinite" />
        </circle>
        <defs>
          <linearGradient id="llg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#60a5fa" />
            <stop offset="100%" stopColor="#2dd4bf" />
          </linearGradient>
        </defs>
      </svg>
      <div className="flex-1">
        <div className="flex h-8 items-end gap-1">
          {[40, 65, 50, 80, 62, 92, 74].map((h, i) => (
            <span key={i} className="w-full rounded-sm bg-gradient-to-t from-blue-500/60 to-cyan-300/80" style={{ height: `${h}%` }}></span>
          ))}
        </div>
        <p className="mt-1.5 font-mono text-[10px] text-slate-400">accuracy climbing · epoch 128</p>
      </div>
    </div>
  );
}

function ForestVotes() {
  return (
    <div>
      <svg viewBox="0 0 200 52" className="w-full">
        <g stroke="#5eead4" strokeWidth="1.2" opacity="0.7" fill="none">
          <path d="M100 6 L60 24 M100 6 L100 24 M100 6 L140 24" />
          <path d="M60 24 L44 44 M60 24 L76 44 M100 24 L88 44 M100 24 L112 44 M140 24 L124 44 M140 24 L156 44" />
        </g>
        <g fill="#93c5fd">
          <circle cx="100" cy="6" r="4" />
          <circle cx="60" cy="24" r="3" /><circle cx="100" cy="24" r="3" /><circle cx="140" cy="24" r="3" />
        </g>
        <g fill="#5eead4">
          {[44, 76, 88, 112, 124, 156].map((x) => (
            <circle key={x} cx={x} cy="44" r="2.5" />
          ))}
        </g>
      </svg>
      <div className="mt-2 space-y-1.5">
        {[['Tree consensus', 'w-[94%]'], ['ETA 6 min', 'w-[78%]']].map(([l, w]) => (
          <div key={l} className="flex items-center gap-2">
            <span className="w-24 shrink-0 font-mono text-[10px] text-slate-400">{l}</span>
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
              <div className={`h-full rounded-full bg-gradient-to-r from-violet-400 to-blue-300 ${w}`}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function WeekForecast() {
  const days = [['M', 45], ['T', 70], ['W', 100], ['T', 62], ['F', 80], ['S', 38], ['S', 30]];
  return (
    <div>
      <div className="flex h-20 items-end gap-1.5">
        {days.map(([d, h], i) => (
          <div key={i} className="flex w-full flex-col items-center gap-1">
            <div className="flex h-14 w-full items-end">
              <span
                className={`w-full rounded-md ${i === 2 ? 'bg-gradient-to-t from-amber-400 to-rose-300 shadow-[0_0_14px_rgba(251,191,36,0.5)]' : 'bg-gradient-to-t from-blue-500/50 to-teal-300/70'}`}
                style={{ height: `${h}%` }}
              ></span>
            </div>
            <span className={`font-mono text-[9px] font-bold ${i === 2 ? 'text-amber-300' : 'text-slate-500'}`}>{d}</span>
          </div>
        ))}
      </div>
      <p className="mt-2 rounded-lg bg-amber-400/10 px-2.5 py-1.5 text-[10px] font-bold text-amber-200 ring-1 ring-amber-300/20">
        Peak alert · Wednesday 11:30–12:15 — add 1 doctor
      </p>
    </div>
  );
}
