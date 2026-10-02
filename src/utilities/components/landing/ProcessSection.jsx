// ============================================================
//  ProcessSection.jsx – Interactive Patient Flow Timeline
// ============================================================

import React, { useState } from 'react';

export default function ProcessSection() {
  const [activeStepIndex, setActiveStepIndex] = useState(3); // Step 4 (index 3) active by default

  const steps = [
    {
      num: '01',
      title: 'Registration',
      shortName: 'Registration',
      icon: 'qr_code_scanner',
      subtitle: 'Instant Check-In & EHR Sync',
      description: 'Patient arrives at hospital kiosk or scans entrance QR code. The system verifies past EHR records or initializes a new digital health profile in under 15 seconds.',
      badgeText: 'Kiosk / QR Code',
    },
    {
      num: '02',
      title: 'Slot Booking',
      shortName: 'Booking',
      icon: 'calendar_month',
      subtitle: 'Smart Slot Allocation',
      description: 'Algorithm matches patient symptoms with available specialist doctors, balancing OPD load and reserving an optimal consultation slot.',
      badgeText: 'Auto Match',
    },
    {
      num: '03',
      title: 'Token Dispatch',
      shortName: 'Token Gen',
      icon: 'confirmation_number',
      subtitle: 'Automated Token Issuance',
      description: 'Unique digital token is generated and delivered directly to the patient via SMS and mobile app, complete with a live tracking link.',
      badgeText: 'Instant SMS',
    },
    {
      num: '04',
      title: 'Queue Dispatch',
      shortName: 'Queue Mgmt',
      icon: 'format_list_bulleted',
      subtitle: 'Real-Time OPD Routing',
      description: 'AI queue manager monitors doctor room activity and dispatches patients seamlessly to minimize lounge congestion and wait times.',
      badgeText: 'AI Dispatch',
    },
    {
      num: '05',
      title: 'AI Wait Prediction',
      shortName: 'AI Forecast',
      icon: 'psychology',
      subtitle: 'Hyper-Accurate Wait ETA',
      description: 'Neural prediction engine constantly updates consultation ETAs based on live doctor pace, alerting patients when it is time to proceed.',
      badgeText: '99.4% Match',
    },
    {
      num: '06',
      title: 'Consultation',
      shortName: 'Doctor Visit',
      icon: 'stethoscope',
      subtitle: 'Seamless Clinical Care',
      description: 'Doctor reviews digital medical history, records diagnosis, and issues electronic prescriptions directly to the pharmacy system.',
      badgeText: 'Digital EHR',
    },
    {
      num: '07',
      title: 'Analytics & Sync',
      shortName: 'Analytics',
      icon: 'analytics',
      subtitle: 'Automated Feedback & Reporting',
      description: 'Post-visit feedback collection, automated prescription delivery, and real-time hospital administrative performance analytics.',
      badgeText: 'Live Insights',
    },
  ];

  const currentStep = steps[activeStepIndex];

  return (
    <section className="py-24 lg:py-32 bg-white relative overflow-hidden" id="how-it-works">
      {/* Background Decorative Glow */}
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-blue-400/10 blur-3xl pointer-events-none rounded-full"></div>
      
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/90 text-blue-700 text-xs font-extrabold uppercase tracking-wider shadow-sm">
            <span className="material-symbols-outlined text-sm">schema</span>
            <span>End-to-End Workflow</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Patient Flow{' '}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-500 bg-clip-text text-transparent">
              Simplified
            </span>
          </h2>

          <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed">
            Seamless AI-assisted coordination from the instant a patient arrives at the hospital until consultation &amp; analytics.
          </p>
        </div>

        {/* Interactive Steps Timeline Navigation */}
        <div className="relative mb-14">
          {/* Horizontal Connecting Line */}
          <div className="absolute top-7 left-12 right-12 h-1 bg-slate-200/80 rounded-full z-0 hidden lg:block">
            <div 
              className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all duration-500"
              style={{ width: `${(activeStepIndex / (steps.length - 1)) * 100}%` }}
            ></div>
          </div>

          {/* Step Pills Row */}
          <div className="flex items-center justify-between gap-2 overflow-x-auto pb-4 pt-2 px-2 hide-scrollbar relative z-10">
            {steps.map((step, idx) => {
              const isActive = idx === activeStepIndex;
              const isPassed = idx < activeStepIndex;

              return (
                <button
                  key={step.num}
                  onClick={() => setActiveStepIndex(idx)}
                  className={`flex flex-col items-center gap-2.5 shrink-0 group transition-all duration-300 focus:outline-none ${
                    isActive ? 'scale-105' : 'hover:scale-102 opacity-85 hover:opacity-100'
                  }`}
                  style={{ minWidth: '110px' }}
                >
                  {/* Step Circle Icon Container */}
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-sm transition-all duration-300 shadow-md ${
                      isActive
                        ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white ring-4 ring-blue-500/25 shadow-blue-500/30 scale-110'
                        : isPassed
                        ? 'bg-blue-50 text-blue-700 border-2 border-blue-300'
                        : 'bg-slate-100 text-slate-500 border border-slate-200 group-hover:border-blue-300 group-hover:bg-blue-50/50'
                    }`}
                  >
                    <span className="material-symbols-outlined text-xl">{step.icon}</span>
                  </div>

                  {/* Step Number & Label */}
                  <div className="flex flex-col items-center text-center">
                    <span className={`text-[10px] font-extrabold uppercase tracking-wider ${
                      isActive ? 'text-blue-600' : 'text-slate-400'
                    }`}>
                      Step {step.num}
                    </span>
                    <span className={`text-xs font-bold transition-colors ${
                      isActive ? 'text-slate-900 font-extrabold' : 'text-slate-600'
                    }`}>
                      {step.shortName}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Step Details Interactive Card */}
        <div className="max-w-4xl mx-auto rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950 text-white p-8 lg:p-10 shadow-2xl border border-slate-800 relative overflow-hidden animate-fadeIn">
          {/* Subtle Background Glow */}
          <div className="absolute right-0 bottom-0 w-80 h-80 bg-blue-600/15 blur-3xl pointer-events-none rounded-full"></div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative z-10">
            
            {/* Left Visual Badge */}
            <div className="md:col-span-4 flex flex-col items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-blue-600/30 border border-blue-400/40 text-blue-400 flex items-center justify-center shadow-inner">
                <span className="material-symbols-outlined text-3xl">{currentStep.icon}</span>
              </div>
              <div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-teal-500/20 text-teal-300 border border-teal-500/40 inline-block mb-2">
                  {currentStep.badgeText}
                </span>
                <h3 className="text-2xl font-black text-white tracking-tight">
                  Step {currentStep.num}: {currentStep.title}
                </h3>
                <p className="text-xs font-semibold text-blue-300 mt-1">
                  {currentStep.subtitle}
                </p>
              </div>
            </div>

            {/* Right Description & Controls */}
            <div className="md:col-span-8 flex flex-col justify-between h-full gap-6 md:border-l md:border-slate-800 md:pl-8">
              <p className="text-sm text-slate-300 font-medium leading-relaxed">
                {currentStep.description}
              </p>

              {/* Navigation Controls */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-800/80">
                <button
                  onClick={() => setActiveStepIndex((prev) => Math.max(0, prev - 1))}
                  disabled={activeStepIndex === 0}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-base">arrow_back</span>
                  Previous Step
                </button>

                <div className="flex items-center gap-1.5">
                  {steps.map((_, i) => (
                    <span
                      key={i}
                      onClick={() => setActiveStepIndex(i)}
                      className={`w-2 h-2 rounded-full cursor-pointer transition-all ${
                        i === activeStepIndex ? 'bg-blue-400 w-5' : 'bg-slate-700 hover:bg-slate-500'
                      }`}
                    ></span>
                  ))}
                </div>

                <button
                  onClick={() => setActiveStepIndex((prev) => Math.min(steps.length - 1, prev + 1))}
                  disabled={activeStepIndex === steps.length - 1}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed shadow-md transition-all flex items-center gap-1.5"
                >
                  Next Step
                  <span className="material-symbols-outlined text-base">arrow_forward</span>
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
