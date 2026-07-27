// ============================================================
//  Header.jsx  –  Reusable Top Header Bar Component
// ============================================================

import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/AdminDashboard.css';

function Header({ placeholder = "Search doctors, patients...", isCollapsed, toggleSidebar }) {
  const navigate = useNavigate();

  return (
    <header className="dashboard-header">
      {/* Left section with toggle button & search box */}
      <div className="dashboard-header__left">
        <button
          className="dashboard-header__toggle-btn"
          onClick={toggleSidebar}
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          type="button"
        >
          <span className="material-symbols-outlined">
            {isCollapsed ? 'menu' : 'menu_open'}
          </span>
        </button>

        <div className="dashboard-header__search">
          <span className="material-symbols-outlined">search</span>
          <input
            className="dashboard-header__search-input"
            type="text"
            placeholder={placeholder}
          />
        </div>
      </div>

      {/* Actions (Notifications + User Avatar) */}
      <div className="dashboard-header__actions">
        <button className="dashboard-header__notification" type="button">
          <span className="material-symbols-outlined">notifications</span>
          <div className="dashboard-header__notification-badge">3</div>
        </button>
        <div
          className="dashboard-header__avatar"
          onClick={() => navigate('/admin/profile')}
          style={{ cursor: 'pointer' }}
          title="Admin Profile"
        >
          <span className="material-symbols-outlined">person</span>
        </div>
      </div>
    </header>
  );
}

export default Header;
