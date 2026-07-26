// ============================================================
//  AdminDashboard.js  –  Admin Dashboard Page Component
// ============================================================

import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';


// ---------- Sidebar Navigation Items ----------

const NAV_ITEMS = [
  { label: 'Dashboard',     icon: 'dashboard',        path: 'dashboard' },
  { label: 'Doctors',       icon: 'medical_services',  path: 'doctors' },
  { label: 'Patients',      icon: 'person_search',     path: 'patients' },
  { label: 'Receptionists', icon: 'badge',             path: 'receptionists' },
  { label: 'Appointments',  icon: 'event',             path: 'appointments' },
  { label: 'Queue',         icon: 'group_work',        path: 'queue' },
  { label: 'Reports',       icon: 'analytics',         path: 'reports' },
  { label: 'Settings',      icon: 'settings',          path: 'settings' },
];


function AdminDashboard() {
  const navigate = useNavigate();

  // Currently active sidebar item
  const activePath = 'dashboard';


  // ---------- Handlers ----------

  /** Logout – clear auth and go back to login */
  const handleLogout = () => {
    localStorage.removeItem('isAdminLoggedIn');
    navigate('/');
  };


  // ---------- Render ----------
  return (
    <div className="dashboard-layout">

      {/* ============ SIDEBAR ============ */}
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
          {NAV_ITEMS.map((item) => (
            <button
              key={item.path}
              className={`sidebar__nav-link ${
                item.path === activePath
                  ? 'sidebar__nav-link--active'
                  : 'sidebar__nav-link--inactive'
              }`}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
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

      {/* ============ MAIN CONTENT ============ */}
      <div className="dashboard-main">

        {/* --- Top Header --- */}
        <header className="dashboard-header">
          <div className="dashboard-header__search">
            <span className="material-symbols-outlined">search</span>
            <input
              className="dashboard-header__search-input"
              type="text"
              placeholder="Search doctors, patients..."
            />
          </div>
          <div className="dashboard-header__actions">
            <button className="dashboard-header__notification">
              <span className="material-symbols-outlined">notifications</span>
              <div className="dashboard-header__notification-badge">3</div>
            </button>
            <div className="dashboard-header__avatar">
              <span className="material-symbols-outlined">person</span>
            </div>
          </div>
        </header>

        {/* --- Content Area --- */}
        <main className="dashboard-content">
          <div className="dashboard-empty">
            <div className="dashboard-empty__icon">
              <span className="material-symbols-outlined">dashboard_customize</span>
            </div>
            <h2 className="dashboard-empty__title">Dashboard is empty</h2>
            <p className="dashboard-empty__text">
              There is no data to display at the moment. Once activity begins,
              your statistics and reports will appear here.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;
