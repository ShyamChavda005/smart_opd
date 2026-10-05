// ============================================================
//  ReceptionistSidebar.jsx – Premium reception navigation
//  Same routes / behaviour, visual redesign only.
// ============================================================

import React from 'react';
import { logout } from '../../auth';
import { useNavigate, useLocation } from 'react-router-dom';
import '../../style/receptionist/ReceptionistLayout.css';

const NAV_ITEMS = [
  { name: 'Dashboard', icon: 'grid_view', path: '/receptionist/dashboard' },
  { name: 'Queue Board', icon: 'queue', path: '/receptionist/queue-board' },
  { name: 'Tokens', icon: 'confirmation_number', path: '/receptionist/tokens' },
  { name: 'Patients', icon: 'groups', path: '/receptionist/patients' },
  { name: 'Stats', icon: 'bar_chart', path: '/receptionist/stats' },
];


export default function ReceptionistSidebar({ activeTab = 'Dashboard', showToast }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout(navigate);
  };

  return (
    <aside className="w-[260px] bg-white border-r border-slate-200/80 flex flex-col justify-between shrink-0 hidden md:flex min-h-screen sticky top-0 h-screen shadow-[4px_0_24px_rgba(11,28,48,0.04)]">
      <div className="flex flex-col min-h-0">
        {/* Brand */}
        <div className="px-5 pt-6 pb-5 border-b border-slate-100">
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => navigate('/receptionist/dashboard')}
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#004ac6] via-[#1d4ed8] to-[#0ea5a4] text-white shadow-[0_8px_20px_rgba(0,74,198,0.35)] transition-transform duration-300 group-hover:scale-105">
              <span className="material-symbols-outlined text-[22px]">medical_services</span>
            </span>
            <span className="leading-none">
              <span className="block text-[19px] font-bold tracking-tight text-slate-900">
                Medi<span className="text-primary">Queue</span>
              </span>
              <span className="mt-1 flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.18em] text-primary">
                <span className="inline-block h-1 w-3.5 rounded-full bg-gradient-to-r from-[#004ac6] to-[#0ea5a4]"></span>
                Reception
              </span>
            </span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3.5 py-4">
          <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
            Manage
          </p>
          <div className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const isActive = location.pathname === item.path || activeTab === item.name;
              return (
                <button
                  key={item.name}
                  onClick={() => navigate(item.path)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`group relative w-full flex items-center gap-3 rounded-xl px-3.5 py-2.5 font-semibold text-[13.5px] transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-[#e8efff] to-[#e8efff]/40 text-primary shadow-sm'
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/80'
                  }`}
                >
                  <span
                    className={`absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-gradient-to-b from-[#004ac6] to-[#0ea5a4] transition-all duration-200 ${
                      isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-40'
                    }`}
                  ></span>
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
                      isActive
                        ? 'bg-primary text-white shadow-[0_4px_12px_rgba(0,74,198,0.35)]'
                        : 'bg-slate-100 text-slate-400 group-hover:bg-white group-hover:text-slate-600 group-hover:shadow-sm'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[19px]">{item.icon}</span>
                  </span>
                  <span className="flex-1 text-left">{item.name}</span>
                  {isActive && (
                    <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Live desk card */}
          <div className="mt-6 rounded-2xl border border-blue-100 bg-gradient-to-br from-[#eef4ff] to-[#e6faf6] p-4">
            <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-primary">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
              </span>
              Desk live
            </p>
            <p className="mt-1.5 text-[13px] font-bold text-slate-900">Main Reception</p>
            <p className="text-[11px] font-medium text-slate-500">Counter A-01 · Morning shift</p>
          </div>
        </nav>
      </div>

      {/* Account */}
      <div className="p-3.5 border-t border-slate-100">
        <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
          Account
        </p>
        <button
          onClick={handleLogout}
          className="group w-full flex items-center gap-3 rounded-xl px-3.5 py-2.5 font-bold text-[13px] text-red-600 transition-colors hover:bg-red-50"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-500 transition-colors group-hover:bg-red-100">
            <span className="material-symbols-outlined text-[19px]">logout</span>
          </span>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
