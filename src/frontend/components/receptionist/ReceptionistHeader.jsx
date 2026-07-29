// ============================================================
//  ReceptionistHeader.jsx – Reusable Receptionist Header Component
// ============================================================

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../style/receptionist/ReceptionistLayout.css';

export default function ReceptionistHeader({
  profileName = 'Sarah Jenkins',
  stationName = 'Main Reception Counter A-01',
  onOpenSettings,
  onOpenProfile,
}) {
  const navigate = useNavigate();
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  return (
    <header className="bg-white border-b border-slate-200 px-8 py-5 flex items-center justify-between sticky top-0 z-40 shadow-sm">
      <div>
        <h2 className="text-2xl font-black text-slate-900">Welcome, {profileName}</h2>
        <p className="text-xs font-semibold text-slate-400 mt-0.5">
          {stationName} • Smart OPD Registration Desk
        </p>
      </div>

      <div className="flex items-center gap-4 relative">
        <button
          onClick={() => {
            navigate('/receptionist/dashboard');
            setTimeout(() => {
              document.getElementById('patient-form')?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
          }}
          className="px-5 py-2.5 bg-blue-600 text-white font-bold text-xs rounded-xl shadow-md hover:bg-blue-700 transition-all flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-lg">person_add</span>
          Register Patient
        </button>

        <button
          onClick={() => setNotificationsOpen(!notificationsOpen)}
          className="p-2.5 bg-slate-100 hover:bg-slate-200 rounded-2xl text-slate-600 relative transition-colors"
        >
          <span className="material-symbols-outlined text-xl">notifications</span>
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
        </button>

        {notificationsOpen && (
          <div className="absolute top-14 right-24 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 z-[100] animate-fadeIn space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="font-bold text-sm text-slate-900">Notifications</span>
              <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-extrabold">
                2 New
              </span>
            </div>
            <div className="space-y-2 text-xs">
              <div className="p-2.5 bg-blue-50 rounded-xl">
                <p className="font-bold text-slate-900">Emergency Patient Arrived</p>
                <p className="text-slate-500 mt-0.5">Token #E-04 assigned to Trauma Ward</p>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl">
                <p className="font-bold text-slate-900">Doctor Status Updated</p>
                <p className="text-slate-500 mt-0.5">Dr. J. Miller marked as AVAILABLE</p>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={onOpenSettings}
          title="System Settings"
          className="p-2.5 bg-slate-100 hover:bg-slate-200 rounded-2xl text-slate-600 transition-colors"
        >
          <span className="material-symbols-outlined text-xl">settings</span>
        </button>

        <div
          onClick={onOpenProfile}
          className="flex items-center gap-2 pl-2 cursor-pointer hover:opacity-90 transition-opacity"
          title="Click to manage profile &amp; portal options"
        >
          <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center border-2 border-blue-500 shadow-sm text-sm">
            SJ
          </div>
        </div>
      </div>
    </header>
  );
}
