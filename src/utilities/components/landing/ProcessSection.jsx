// ============================================================
//  ProcessSection.jsx – Premium interactive patient journey
//  Same seven steps / content / behaviour, visual redesign only.
// ============================================================

import React, { useState, useEffect, useRef } from 'react';

export default function ProcessSection() {
  const [activeStepIndex, setActiveStepIndex] = useState(3);
  const [paused, setPaused] = useState(false);
  const hoverRef = useRef(false);

  const steps = [
    {
      num: '01',
      title: 'Registration',
      shortName: 'Registration',
      icon: 'qr_code_scanner',
      subtitle: 'Instant check-in & EHR sync',
      description: 'Patient arrives at hospital kiosk or scans entrance QR code. The system verifies past EHR records or initializes a new digital health profile in under 15 seconds.',
      badgeText: 'Kiosk / QR Code',
      stat: '15 sec',
      statLabel: 'average check-in',
    },
    {
      num: '02',
      title: 'Slot Booking',
      shortName: 'Booking',
      icon: 'calendar_month',
      subtitle: 'Smart slot allocation',
      description: 'Algorithm matches patient symptoms with available specialist doctors, balancing OPD load and reserving an optimal consultation slot.',
      badgeText: 'Auto Match',
      stat: '100%',
      statLabel: 'conflict-free slots',
    },
    {
      num: '03',
      title: 'Token Dispatch',
      shortName: 'Token Gen',
      icon: 'confirmation_number',
      subtitle: 'Automated token issuance',
      description: 'Unique digital token is generated and delivered directly to the patient via SMS and mobile app, complete with a live tracking link.',
      badgeText: 'Instant SMS',
      stat: '0 sec',
      statLabel: 'token wait',
    },
    {
      num: '04',
      title: 'Queue Dispatch',
      shortName: 'Queue Mgmt',
      icon: 'format_list_bulleted',
      subtitle: 'Real-time OPD routing',
      description: 'AI queue manager monitors doctor room activity and dispatches patients seamlessly to minimize lounge congestion and wait times.',
      badgeText: 'AI Dispatch',
      stat: '-82%',
      statLabel: 'lounge crowding',
    },
    {
      num: '05',
      title: 'AI Wait Prediction',
      shortName: 'AI Forecast',
      icon: 'psychology',
      subtitle: 'Accurate wait ETA',
      description: 'Neural prediction engine constantly updates consultation ETAs based on live doctor pace, alerting patients when it is time to proceed.',
      badgeText: '99.4% Match',
      stat: '99.4%',
      statLabel: 'forecast accuracy',
    },
    {
      num: '06',
      title: 'Consultation',
      shortName: 'Doctor Visit',
      icon: 'stethoscope',
      subtitle: 'Seamless clinical care',
      description: 'Doctor reviews digital medical history, records diagnosis, and issues electronic prescriptions directly to the pharmacy system.',
      badgeText: 'Digital EHR',
      stat: '5.8 min',
      statLabel: 'avg. consult flow',
    },
    {
      num: '07',
      title: 'Analytics & Sync',
      shortName: 'Analytics',
      icon: 'analytics',
      subtitle: 'Feedback & reporting',
      description: 'Post-visit feedback collection, automated prescription delivery, and real-time hospital administrative performance analytics.',
      badgeText: 'Live Insights',
      stat: '+94%',
      statLabel: 'OPD efficiency',
    },
  ];

  const currentStep = steps[activeStepIndex];
  const progress = ((activeStepIndex + 1) / steps.length) * 100;

  // Gentle auto-tour; pauses on hover or when user takes control
  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => {
      if (!hoverRef.current) {
        setActiveStepIndex((p) => (p >= steps.length - 1 ? 0 : p + 1));
      }
    }, 6000);
    return () => clearInterval(t);
  }, [paused, steps.length]);

  const goTo = (i) => {
    setPaused(true);
    setActiveStepIndex(i);
  };
  const prev = () => {
    setPaused(true);
    setActiveStepIndex((p) => Math.max(0, p - 1));
  };
  const next = () => {
    setPaused(true);
    setActiveStepIndex((p) => Math.min(steps.length - 1, p + 1));
  };

  return (
    <section className="relative overflow-hidden bg-surface py-20 lg:py-24" id="how-it-works">
      {/* Ambient */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-1/2 h-72 w-[720px] -translate-x-1/2 rounded-full bg-gradient-to-r from-[#004ac6]/10 via-[#6366f1]/10 to-[#14b8a6]/10 blur-3xl"></div>
      </div>

      <div className="relative mx-auto max-w-6xl px-6">
        {/* Header */}
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-outline-variant/60 bg-white px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-primary shadow-sm">
            <span className="material-symbols-outlined text-sm">route</span>
            How it works
          </span>
          <h2 className="mt-4 font-headline-md text-3xl font-bold tracking-tight text-on-surface sm:text-[2.75rem] sm:leading-[1.1]">
            Patient flow, <span className="hero-gradient-text">simplified</span>
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-on-surface-variant sm:text-base">
            Follow a patient from the entrance kiosk to the consultation room — seven connected moments, one calm system.
          </p>
          <button
            onClick={() => setPaused((p) => !p)}
            className="mx-auto mt-4 inline-flex items-center gap-2 rounded-full border border-outline-variant/60 bg-white px-4 py-1.5 text-xs font-bold text-on-surface-variant shadow-sm transition-colors hover:border-primary/40 hover:text-primary"
          >
            <span className="material-symbols-outlined text-base">{paused ? 'play_arrow' : 'pause'}</span>
            {paused ? 'Auto-tour paused' : 'Auto-tour playing'}
          </button>
        </div>

        {/* Stepper */}
        <div className="relative mb-8">
          {/* Connector (desktop) */}
          <div className="absolute left-10 right-10 top-7 hidden h-[3px] rounded-full bg-slate-200/80 lg:block">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#004ac6] via-[#4f46e5] to-[#0ea5a4] transition-all duration-700 ease-out"
              style={{ width: `${(activeStepIndex / (steps.length - 1)) * 100}%` }}
            ></div>
          </div>

          <div className="relative grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7 lg:gap-1">
            {steps.map((step, idx) => {
              const isActive = idx === activeStepIndex;
              const isPassed = idx < activeStepIndex;
              return (
                <button
                  key={step.num}
                  onClick={() => goTo(idx)}
                  aria-current={isActive ? 'step' : undefined}
                  className="group flex items-center gap-2.5 rounded-2xl border p-2.5 text-left transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 lg:flex-col lg:items-center lg:gap-2 lg:border-0 lg:bg-transparent lg:p-1 lg:text-center"
                >
                  <span
                    className={`hidden lg:flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition-all duration-300 lg:h-14 lg:w-14 ${
                      isActive
                        ? 'bg-gradient-to-br from-[#004ac6] to-[#1d4ed8] text-white shadow-[0_10px_28px_rgba(0,74,198,0.45)] ring-4 ring-[#004ac6]/15 lg:scale-110'
                        : isPassed
                        ? 'border-2 border-[#004ac6]/40 bg-[#e8efff] text-primary'
                        : 'border border-outline-variant/60 bg-white text-on-surface-variant shadow-sm group-hover:border-primary/50 group-hover:text-primary'
                  } hidden lg:flex`}
                  >
                    <span className="material-symbols-outlined text-[22px]">
                      {isPassed && !isActive ? 'check' : step.icon}
                    </span>
                  </span>
                  {/* Mobile / tablet pill content */}
                  <span
                    className={`flex flex-1 items-center gap-2.5 rounded-xl border px-3 py-2 transition-all duration-300 lg:hidden ${
                      isActive
                        ? 'border-primary bg-primary text-white shadow-md'
                        : isPassed
                        ? 'border-[#004ac6]/30 bg-[#e8efff] text-primary'
                        : 'border-outline-variant/60 bg-white text-on-surface-variant'
                    }`}
                  >
                    <span className="material-symbols-outlined text-lg">
                      {isPassed && !isActive ? 'check' : step.icon}
                    </span>
                    <span className="text-xs font-bold">{step.shortName}</span>
                  </span>
                  {/* Desktop label */}
                  <span className="hidden lg:block">
                    <span className={`block text-[10px] font-bold uppercase tracking-[0.16em] ${isActive ? 'text-primary' : 'text-slate-400'}`}>
                      Step {step.num}
                    </span>
                    <span className={`mt-0.5 block text-xs font-bold ${isActive ? 'text-on-surface' : 'text-on-surface-variant'}`}>
                      {step.shortName}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content panel */}
        <div
          className="overflow-hidden rounded-3xl border border-outline-variant/60 bg-white shadow-[0_24px_70px_rgba(11,28,48,0.10)]"
          onMouseEnter={() => (hoverRef.current = true)}
          onMouseLeave={() => (hoverRef.current = false)}
        >
          {/* Progress hairline */}
          <div className="h-1 w-full bg-slate-100">
            <div
              className="h-full bg-gradient-to-r from-[#004ac6] via-[#4f46e5] to-[#0ea5a4] transition-all duration-700 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          <div key={activeStepIndex} className="grid animate-fadeIn gap-0 lg:grid-cols-2">
            {/* Visual */}
            <div className="relative bg-gradient-to-br from-[#eef4ff] via-surface to-[#e6f7f4] p-6 sm:p-8">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-on-surface-variant">
                  Step {currentStep.num} · Preview
                </p>
                <span className="rounded-full bg-white px-3 py-1 text-[11px] font-bold text-primary shadow-sm ring-1 ring-slate-200">
                  {currentStep.badgeText}
                </span>
              </div>
              <div className="mt-4">
                <StepVisual index={activeStepIndex} />
              </div>
            </div>

            {/* Info */}
            <div className="flex flex-col p-6 sm:p-8">
              <span className="inline-flex w-fit items-center gap-1.5 rounded-lg bg-surface-container px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-primary">
                <span className="material-symbols-outlined text-sm">{currentStep.icon}</span>
                {currentStep.subtitle}
              </span>
              <h3 className="mt-3 font-headline-md text-2xl font-bold tracking-tight text-on-surface sm:text-[1.7rem]">
                {currentStep.title}
              </h3>
              <p className="mt-2.5 text-sm leading-relaxed text-on-surface-variant sm:text-[15px]">
                {currentStep.description}
              </p>

              <div className="mt-5 flex items-center gap-4 rounded-2xl border border-outline-variant/50 bg-surface p-4">
                <p className="font-headline-md text-3xl font-bold text-primary">{currentStep.stat}</p>
                <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">{currentStep.statLabel}</p>
              </div>

              <div className="mt-auto pt-6">
                <div className="flex items-center justify-between border-t border-slate-100 pt-5">
                  <button
                    onClick={prev}
                    disabled={activeStepIndex === 0}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-outline-variant/60 px-4 py-2.5 text-sm font-bold text-on-surface-variant transition-all hover:border-primary/40 hover:text-primary disabled:cursor-not-allowed disabled:opacity-35"
                  >
                    <span className="material-symbols-outlined text-base">arrow_back</span>
                    Back
                  </button>
                  <div className="hidden items-center gap-1.5 sm:flex">
                    {steps.map((s, i) => (
                      <span
                        key={s.num}
                        onClick={() => goTo(i)}
                        className={`h-1.5 cursor-pointer rounded-full transition-all duration-300 ${
                          i === activeStepIndex ? 'w-7 bg-primary' : 'w-1.5 bg-slate-200 hover:bg-slate-300'
                        }`}
                      ></span>
                    ))}
                  </div>
                  <button
                    onClick={next}
                    disabled={activeStepIndex === steps.length - 1}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white shadow-[0_8px_20px_rgba(0,74,198,0.3)] transition-all hover:bg-[#003da3] disabled:cursor-not-allowed disabled:opacity-35 disabled:shadow-none"
                  >
                    {activeStepIndex === steps.length - 1 ? 'Done' : 'Next step'}
                    <span className="material-symbols-outlined text-base">arrow_forward</span>
                  </button>
                </div>
                <p className="mt-3 text-center text-xs font-semibold text-on-surface-variant sm:hidden">
                  Step {activeStepIndex + 1} of {steps.length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Contextual mini visuals, one per step ---------- */
function Frame({ children, label }) {
  return (
    <div className="rounded-2xl border border-white/70 bg-white/90 p-4 shadow-[0_12px_35px_rgba(11,28,48,0.10)] backdrop-blur">
      <p className="mb-3 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
        {label}
      </p>
      {children}
    </div>
  );
}

function StepVisual({ index }) {
  switch (index) {
    case 0:
      return (
        <Frame label="Kiosk · Scan to check in">
          <div className="flex items-center gap-4">
            <div className="grid h-24 w-24 shrink-0 grid-cols-5 gap-[3px] rounded-xl bg-slate-900 p-2">
              {[1,1,0,1,1, 1,0,1,0,1, 0,1,1,1,0, 1,0,1,0,1, 1,1,0,1,1].map((f, i) => (
                <span key={i} className={`rounded-[2px] ${f ? 'bg-white' : 'bg-white/15'}`}></span>
              ))}
            </div>
            <div className="flex-1 space-y-2">
              <div className="h-2.5 w-3/4 rounded-full bg-slate-200"></div>
              <div className="h-2.5 w-1/2 rounded-full bg-slate-200"></div>
              <p className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700 ring-1 ring-emerald-200">
                <span className="material-symbols-outlined text-sm">verified</span>
                EHR matched · 15 sec
              </p>
            </div>
          </div>
        </Frame>
      );
    case 1:
      return (
        <Frame label="Scheduler · Pick a slot">
          <div className="grid grid-cols-4 gap-1.5">
            {['9:00', '9:20', '9:40', '10:00', '10:20', '10:45', '11:05', '11:30'].map((s, i) => (
              <span
                key={s}
                className={`rounded-lg px-2 py-2 text-center text-[11px] font-bold ${
                  i === 5 ? 'bg-primary text-white shadow-md' : i === 7 ? 'bg-slate-100 text-slate-400 line-through' : 'bg-surface text-on-surface ring-1 ring-slate-200'
                }`}
              >
                {s}
              </span>
            ))}
          </div>
          <p className="mt-3 rounded-lg bg-[#e8efff] px-3 py-2 text-[11px] font-bold text-primary">
            10:45 reserved · Dr. Sharma · General Medicine
          </p>
        </Frame>
      );
    case 2:
      return (
        <Frame label="Digital token · SMS sent">
          <div className="rounded-xl bg-gradient-to-br from-[#004ac6] to-[#0e7490] p-4 text-white">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-200">Your token</p>
              <span className="material-symbols-outlined text-white/70">sms</span>
            </div>
            <p className="mt-1 text-3xl font-bold tracking-tight">#T-104</p>
            <div className="my-3 border-t border-dashed border-white/30"></div>
            <p className="text-[11px] font-semibold text-blue-100">Track live: mq.link/t-104 · Counter 4</p>
          </div>
        </Frame>
      );
    case 3:
      return (
        <Frame label="Live queue · OPD-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between rounded-lg bg-primary px-3 py-2 text-white">
              <span className="text-xs font-bold">#T-104 · In room</span>
              <span className="text-[10px] font-semibold bg-white/20 px-2 py-0.5 rounded-full">4 min left</span>
            </div>
            {['#T-105 · Manish V. · ~6 min', '#T-106 · Priya P. · ~12 min'].map((r) => (
              <div key={r} className="rounded-lg bg-surface px-3 py-2 text-xs font-semibold text-on-surface ring-1 ring-slate-200">{r}</div>
            ))}
          </div>
        </Frame>
      );
    case 4:
      return (
        <Frame label="AI forecast · Neural engine">
          <div className="flex h-24 items-end gap-1.5">
            {[35, 52, 44, 68, 58, 84, 62, 92, 70, 100].map((h, i) => (
              <span key={i} className="module-bar w-full rounded-full bg-gradient-to-t from-[#004ac6] to-[#2dd4bf]" style={{ height: `${h}%`, animationDelay: `${i * 0.15}s` }}></span>
            ))}
          </div>
          <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[#e8efff] px-2.5 py-1 text-[11px] font-bold text-primary">
            <span className="material-symbols-outlined text-sm">psychology</span>
            99.4% match · 5.8 min/patient
          </p>
        </Frame>
      );
    case 5:
      return (
        <Frame label="Consultation · Dr. Sharma">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#004ac6] to-[#0ea5a4] text-sm font-bold text-white">DS</span>
            <div className="flex-1 space-y-1.5">
              <div className="h-2.5 w-full rounded-full bg-slate-200"></div>
              <div className="h-2.5 w-2/3 rounded-full bg-slate-200"></div>
            </div>
          </div>
          <p className="mt-3 flex items-center justify-between rounded-lg bg-emerald-50 px-3 py-2 text-[11px] font-bold text-emerald-700 ring-1 ring-emerald-200">
            e-Prescription sent to pharmacy
            <span className="material-symbols-outlined text-sm">check_circle</span>
          </p>
        </Frame>
      );
    default:
      return (
        <Frame label="Admin analytics · Today">
          <div className="grid grid-cols-3 gap-2 text-center">
            {[['184', 'tokens'], ['8m', 'avg wait'], ['4.9', 'rating']].map(([v, l]) => (
              <div key={l} className="rounded-lg bg-surface p-2.5 ring-1 ring-slate-200">
                <p className="text-lg font-bold text-on-surface">{v}</p>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-on-surface-variant">{l}</p>
              </div>
            ))}
          </div>
          <div className="mt-2.5 flex h-14 items-end gap-1.5">
            {[45, 70, 55, 85, 65, 95, 75].map((h, i) => (
              <span key={i} className="w-full rounded-full bg-gradient-to-t from-[#004ac6]/70 to-[#0ea5a4]/70" style={{ height: `${h}%` }}></span>
            ))}
          </div>
        </Frame>
      );
  }
}
