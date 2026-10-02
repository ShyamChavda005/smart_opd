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
}) {
  const displayName = docName || 'Doctor';

  return (
    <header className="bg-white border-b border-slate-200 px-8 py-5 flex items-center justify-between sticky top-0 z-40 shadow-sm">
      <div>
        <h2 className="text-2xl font-black text-slate-900">Welcome back, {displayName}</h2>
        <p className="text-xs font-bold text-slate-400 mt-0.5">
          {docSpecialty} • {roomNumber} • Live OPD Session
        </p>
      </div>
      <div className="flex items-center gap-4 relative">
        <button
          onClick={onOpenSettings}
          className="p-2.5 bg-slate-100 hover:bg-slate-200 rounded-2xl text-slate-600 transition-colors"
        >
          <span className="material-symbols-outlined text-xl">settings</span>
        </button>

        <div
          onClick={onOpenProfile}
          className="flex items-center gap-2 pl-2 cursor-pointer hover:opacity-90 transition-opacity"
        >
          <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center border-2 border-blue-500 shadow-sm text-sm">
            {displayName.split(" ")[0]?.charAt(0) || "D"}
            {displayName.split(" ")[1]?.charAt(0) || ""}
          </div>
        </div>
      </div>
    </header>
  );
}
