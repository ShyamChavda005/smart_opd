// ============================================================
//  DoctorSidebar.jsx – Reusable Doctor Sidebar Component
// ============================================================

import React from 'react';
import { logout } from '../../auth';
import { useNavigate, useLocation } from 'react-router-dom';
import '../../style/doctor/DoctorLayout.css';

const NAV_ITEMS = [
  { name: 'Overview', icon: 'grid_view', path: '/doctor/dashboard' },
  { name: 'Live Queue', icon: 'queue', path: '/doctor/live-queue' },
  { name: 'Appointments', icon: 'calendar_month', path: '/doctor/appointments' },
  { name: 'Analytics', icon: 'bar_chart', path: '/doctor/analytics' },
];

export default function DoctorSidebar({ activeTab = 'Overview', showToast, isMobileOpen = false, onCloseMobile }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout(navigate);
  };

  const handleNavClick = (path) => {
    navigate(path);
    if (onCloseMobile) onCloseMobile();
  };

  const navContent = (
    <div className="flex h-full flex-col justify-between">
      {/* Brand */}
      <div className="border-b border-slate-100/90 px-5 py-5">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => handleNavClick('/doctor/dashboard')}
            className="group flex items-center gap-3 rounded-xl text-left outline-none transition-transform duration-150 hover:scale-[1.01] focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 text-white shadow-md shadow-blue-500/20 transition-all duration-200 group-hover:shadow-lg group-hover:shadow-blue-500/30">
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M12 2.75 4.9 6.1v4.72c0 4.6 2.99 8.91 7.1 10.14 4.11-1.23 7.1-5.54 7.1-10.14V6.1L12 2.75Z"
                  stroke="#fff"
                  strokeOpacity="0.45"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
                <path d="M12 8.4v7.2M8.4 12h7.2" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </span>
            <span className="flex flex-col">
              <span className="text-[17px] font-bold leading-tight tracking-tight text-slate-900">
                Medi<span className="text-blue-600">Queue</span>
              </span>
              <span className="mt-0.5 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-blue-600">
                <span className="inline-block h-1 w-2.5 rounded-full bg-blue-600"></span>
                Doctor Portal
              </span>
            </span>
          </button>

          {/* Close button for mobile drawer */}
          {onCloseMobile && (
            <button
              type="button"
              onClick={onCloseMobile}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 md:hidden"
              aria-label="Close navigation menu"
            >
              <span className="material-symbols-outlined text-[20px] leading-none">close</span>
            </button>
          )}
        </div>
      </div>

      {/* Primary navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-5" aria-label="Doctor navigation">
        <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-400">
          Clinical Operations
        </p>
        <ul className="space-y-1.5">
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname === item.path || activeTab === item.name;
            return (
              <li key={item.name}>
                <button
                  type="button"
                  onClick={() => handleNavClick(item.path)}
                  aria-current={isActive ? 'page' : undefined}
                  className={[
                    'group relative flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium outline-none transition-all duration-150',
                    'focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-1',
                    isActive
                      ? 'bg-blue-50/90 font-semibold text-blue-700 shadow-sm shadow-blue-500/5'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
                  ].join(' ')}
                >
                  {/* Active rail indicator */}
                  {isActive && (
                    <span
                      aria-hidden="true"
                      className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.4)]"
                    />
                  )}
                  <span
                    className={[
                      'material-symbols-outlined text-[20px] leading-none transition-colors duration-150',
                      isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600',
                    ].join(' ')}
                  >
                    {item.icon}
                  </span>
                  <span>{item.name}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Account actions */}
      <div className="border-t border-slate-100/90 p-3.5">
        <button
          type="button"
          onClick={handleLogout}
          className="group flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-600 outline-none transition-colors duration-150 hover:bg-red-50 hover:text-red-600 focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-1"
        >
          <span className="material-symbols-outlined text-[20px] leading-none text-slate-400 transition-colors duration-150 group-hover:text-red-600">
            logout
          </span>
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-slate-200/80 bg-white/95 backdrop-blur-sm md:flex">
        {navContent}
      </aside>

      {/* Mobile Drawer Backdrop and Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-[120] md:hidden">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity duration-200"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <aside className="fixed inset-y-0 left-0 z-10 w-72 max-w-[85vw] bg-white shadow-2xl transition-transform duration-200">
            {navContent}
          </aside>
        </div>
      )}
    </>
  );
}