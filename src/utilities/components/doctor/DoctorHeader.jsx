// ============================================================
//  DoctorHeader.jsx – Reusable Doctor Top Header Component
// ============================================================

import React from 'react';
import '../../style/doctor/DoctorLayout.css';

export default function DoctorHeader({
  docName = 'Dr. Sharma',
  docSpecialty = 'Cardiology Department',
  roomNumber = 'Room 402B',
  onOpenSettings,
  onOpenProfile,
  onToggleMobileMenu,
}) {
  const displayName = docName || 'Doctor';

  // Keyboard support so the profile control is reachable without a mouse.
  const handleProfileKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (onOpenProfile) onOpenProfile();
    }
  };

  const getInitials = (name) => {
    if (!name) return 'DR';
    const clean = name.replace(/^Dr\.?\s*/i, '').trim();
    const parts = clean.split(' ');
    if (parts.length >= 2) {
      return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
    }
    return (parts[0]?.slice(0, 2) || 'DR').toUpperCase();
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-md transition-colors">
      <div className="flex items-center justify-between gap-4 px-4 py-3.5 sm:px-6 lg:px-8">
        {/* Left: Mobile Menu Toggle & Page Identity */}
        <div className="flex min-w-0 items-center gap-3">
          {onToggleMobileMenu && (
            <button
              type="button"
              onClick={onToggleMobileMenu}
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200/80 bg-white text-slate-600 outline-none transition-colors duration-150 hover:bg-slate-50 hover:text-slate-900 focus-visible:ring-2 focus-visible:ring-blue-600 md:hidden"
              aria-label="Open navigation menu"
            >
              <span className="material-symbols-outlined text-[22px] leading-none">menu</span>
            </button>
          )}

          <div className="min-w-0">
            <h1 className="truncate text-lg font-bold tracking-tight text-slate-900 sm:text-xl lg:text-2xl">
              Welcome back, {displayName}
            </h1>
            <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500">
              <span className="font-medium text-slate-700">{docSpecialty}</span>
              <span className="text-slate-300">•</span>
              <span className="inline-flex items-center gap-1 font-medium text-slate-600">
                <span className="material-symbols-outlined text-[13px] text-blue-600">meeting_room</span>
                {roomNumber}
              </span>
              <span className="hidden sm:inline text-slate-300">•</span>
              <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-100">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                </span>
                Live OPD Session
              </span>
            </div>
          </div>
        </div>

        {/* Right: Header Actions */}
        <div className="flex shrink-0 items-center gap-2.5">
          {/* Cabin Settings Button */}
          <button
            type="button"
            onClick={onOpenSettings}
            aria-label="Open cabin settings"
            title="Cabin Settings"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200/80 bg-white text-slate-600 shadow-sm outline-none transition-all duration-150 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
          >
            <span className="material-symbols-outlined text-[20px] leading-none text-slate-500 hover:text-slate-700">
              settings
            </span>
          </button>

          {/* Doctor Profile Avatar Button */}
          <button
            type="button"
            onClick={onOpenProfile}
            onKeyDown={handleProfileKeyDown}
            aria-label="Open doctor profile"
            title="Doctor Profile"
            className="group relative flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200/80 bg-white p-1 pr-2.5 text-left shadow-sm outline-none transition-all duration-150 hover:border-slate-300 hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
          >
            <span className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 text-[12px] font-bold text-white shadow-sm">
              {getInitials(displayName)}
              <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500" />
            </span>
            <span className="hidden lg:block text-xs font-semibold text-slate-700 group-hover:text-slate-900">
              Profile
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}