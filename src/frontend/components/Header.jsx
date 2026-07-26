// ============================================================
//  Header.jsx  –  Reusable Top Header Bar Component
// ============================================================

import React from 'react';
import '../style/AdminDashboard.css';

function Header({ placeholder = "Search doctors, patients..." }) {
  return (
    <header className="dashboard-header">
      {/* Search box */}
      <div className="dashboard-header__search">
        <span className="material-symbols-outlined">search</span>
        <input
          className="dashboard-header__search-input"
          type="text"
          placeholder={placeholder}
        />
      </div>

      {/* Actions (Notifications + User Avatar) */}
      <div className="dashboard-header__actions">
        <button className="dashboard-header__notification" type="button">
          <span className="material-symbols-outlined">notifications</span>
          <div className="dashboard-header__notification-badge">3</div>
        </button>
        <div className="dashboard-header__avatar">
          <span className="material-symbols-outlined">person</span>
        </div>
      </div>
    </header>
  );
}

export default Header;
