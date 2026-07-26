// ============================================================
//  Sidebar.jsx  –  Reusable Admin Sidebar Navigation Component
// ============================================================

import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../style/AdminDashboard.css';

// ---------- Sidebar Navigation Items ----------
const NAV_ITEMS = [
  { label: 'Dashboard',     icon: 'dashboard',        path: '/admin/dashboard' },
  { label: 'Doctors',       icon: 'medical_services',  path: '/admin/doctors' },
  { label: 'Patients',      icon: 'person_search',     path: '/admin/patients' },
  { label: 'Receptionists', icon: 'badge',             path: '/admin/receptionists' },
  { label: 'Appointments',  icon: 'event',             path: '/admin/appointments' },
  { label: 'Queue',         icon: 'group_work',        path: '/admin/queue' },
  { label: 'Reports',       icon: 'analytics',         path: '/admin/reports' },
  { label: 'Settings',      icon: 'settings',          path: '/admin/settings' },
];

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('isAdminLoggedIn');
    navigate('/');
  };

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar__logo">
        <div className="sidebar__logo-icon">
          <span className="material-symbols-outlined">admin_panel_settings</span>
        </div>
        <span className="sidebar__logo-text">Adminly</span>
      </div>

      {/* Navigation */}
      <nav className="sidebar__nav">
        {NAV_ITEMS.map((item) => {
          const isActive =
            location.pathname === item.path ||
            (item.path === '/admin/doctors' && location.pathname === '/admin/add-doctor');

          return (
            <button
              key={item.path}
              className={`sidebar__nav-link ${
                isActive
                  ? 'sidebar__nav-link--active'
                  : 'sidebar__nav-link--inactive'
              }`}
              onClick={() => navigate(item.path)}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer – User info + Logout */}
      <div className="sidebar__footer">
        <div className="sidebar__user">
          <div className="sidebar__user-avatar">
            <span className="material-symbols-outlined">person</span>
          </div>
          <div className="sidebar__user-info">
            <span className="sidebar__user-name">Alex Miller</span>
            <span className="sidebar__user-role">Admin</span>
          </div>
        </div>
        <button className="sidebar__logout" onClick={handleLogout}>
          <span className="material-symbols-outlined">logout</span>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
