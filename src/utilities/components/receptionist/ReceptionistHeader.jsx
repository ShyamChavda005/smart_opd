// ============================================================
//  ReceptionistHeader.jsx – Premium reception top bar
//  Same props / behaviour, visual redesign only.
// ============================================================

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../style/receptionist/ReceptionistLayout.css';

const todayStr = () =>
  new Date().toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });

export default function ReceptionistHeader({
  profileName = '',
  stationName = 'Main Reception Counter A-01',
  onOpenSettings,
  onOpenProfile,
}) {
  const navigate = useNavigate();
  const displayName = profileName || "";
  const [now, setNow] = useState(() =>
    new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
  );

  useEffect(() => {
    const t = setInterval(
      () => setNow(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })),
      30000
    );
    return () => clearInterval(t);
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/90 px-4 py-3 backdrop-blur-md sm:px-6">
      <div className="flex items-center justify-between gap-3">
        {/* Greeting */}
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <h2 className="truncate text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
              Welcome, {profileName}
            </h2>
            <span className="hidden items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700 ring-1 ring-emerald-200 sm:inline-flex">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
              </span>
              On duty
            </span>
          </div>
          <p className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] font-medium text-slate-500 sm:text-xs">
            <span className="inline-flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px] text-primary">location_on</span>
              {stationName}
            </span>
            <span className="hidden text-slate-300 sm:inline">•</span>
            <span className="hidden items-center gap-1 sm:inline-flex">
              <span className="material-symbols-outlined text-[14px]">calendar_today</span>
              {todayStr()}
            </span>
            <span className="hidden text-slate-300 md:inline">•</span>
            <span className="hidden items-center gap-1 md:inline-flex">
              <span className="material-symbols-outlined text-[14px]">schedule</span>
              {now}
            </span>
          </p>
        </div>

        {/* Actions */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <button
            onClick={onOpenSettings}
            className="hidden h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition-colors hover:border-primary/40 hover:text-primary sm:inline-flex"
            title="Counter settings"
          >
            <span className="material-symbols-outlined text-xl">settings</span>
          </button>

          <button
            onClick={() => {
              navigate('/receptionist/dashboard');
              setTimeout(() => {
                document.getElementById('patient-form')?.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#004ac6] to-[#1d4ed8] px-4 py-2.5 text-[13px] font-bold text-white shadow-[0_8px_20px_rgba(0,74,198,0.35)] transition-all hover:shadow-[0_10px_26px_rgba(0,74,198,0.45)] hover:brightness-110 active:scale-[0.98] sm:px-5"
          >
            <span className="material-symbols-outlined text-lg">person_add</span>
            <span className="hidden min-[480px]:inline">Register Patient</span>
            <span className="min-[480px]:hidden">Register</span>
          </button>

          <span className="hidden h-8 w-px bg-slate-200 sm:inline-block"></span>

          <button
            onClick={onOpenProfile}
            className="group relative flex items-center gap-2 rounded-xl p-1 transition-colors hover:bg-slate-100"
            title="Open profile & portal options"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#004ac6] to-[#0ea5a4] text-sm font-bold text-white shadow-md">
              {displayName.split(" ")[0]?.charAt(0) || "R"}
              {displayName.split(" ")[1]?.charAt(0) || ""}
            </span>
            <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-3 w-3 rounded-full border-2 border-white bg-emerald-500"></span>
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
