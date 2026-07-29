// ============================================================
//  AdminSidebar.jsx – Reusable Admin Sidebar Component
// ============================================================

import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../../style/admin/AdminDashboard.css';

const NAV_ITEMS = [
  { label: 'Dashboard',     icon: 'dashboard',        path: '/admin/dashboard' },
  { label: 'Doctors',       icon: 'medical_services',  path: '/admin/doctors' },
  { label: 'Receptionists', icon: 'badge',             path: '/admin/receptionists' },
  { label: 'Reports',       icon: 'analytics',         path: '/admin/reports' },
];

function AdminSidebar({ isCollapsed }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('isAdminLoggedIn');
    navigate('/');
  };

  return (
    <aside className={`sidebar ${isCollapsed ? 'sidebar--collapsed' : ''}`}>
      {/* Logo */}
      <div className="sidebar__logo">
        <div className="sidebar__logo-icon">
          <span className="material-symbols-outlined">admin_panel_settings</span>
        </div>
        {!isCollapsed && <span className="sidebar__logo-text">Adminly</span>}
      </div>

      {/* Navigation */}
      <nav className="sidebar__nav">
        {NAV_ITEMS.map((item) => {
          const isActive =
            location.pathname === item.path ||
            (item.path === '/admin/doctors' && location.pathname === '/admin/add-doctor') ||
            (item.path === '/admin/receptionists' && location.pathname === '/admin/add-receptionist');

          return (
            <button
              key={item.path}
              className={`sidebar__nav-link ${
                isActive ? 'sidebar__nav-link--active' : 'sidebar__nav-link--inactive'
              }`}
              onClick={() => navigate(item.path)}
              title={isCollapsed ? item.label : undefined}
            >
              <span className="material-symbols-outlined sidebar__nav-icon">{item.icon}</span>
              {!isCollapsed && <span className="sidebar__nav-text">{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Footer – User info + Logout */}
      <div className="sidebar__footer">
        <div
          className="sidebar__user"
          onClick={() => navigate('/admin/profile')}
          style={{ cursor: 'pointer' }}
          title={isCollapsed ? "Alex Miller (Admin Profile)" : "Admin Profile"}
        >
          <div className="sidebar__user-avatar">
            <span className="material-symbols-outlined">person</span>
          </div>
          {!isCollapsed && (
            <div className="sidebar__user-info">
              <span className="sidebar__user-name">Alex Miller</span>
              <span className="sidebar__user-role">Admin</span>
            </div>
          )}
        </div>
        <button
          className="sidebar__logout"
          onClick={handleLogout}
          title={isCollapsed ? "Logout" : undefined}
        >
          <span className="material-symbols-outlined sidebar__nav-icon">logout</span>
          {!isCollapsed && <span className="sidebar__nav-text">Logout</span>}
        </button>
      </div>
    </aside>
  );
}

export default AdminSidebar;
