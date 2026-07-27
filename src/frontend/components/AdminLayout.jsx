// ============================================================
//  AdminLayout.jsx  –  Shared Layout (Sidebar + Header + Content)
// ============================================================

import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import '../style/AdminDashboard.css';

function AdminLayout({ children }) {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    return localStorage.getItem('sidebar_collapsed') === 'true';
  });

  const toggleSidebar = () => {
    setIsCollapsed((prev) => {
      const nextState = !prev;
      localStorage.setItem('sidebar_collapsed', String(nextState));
      return nextState;
    });
  };

  return (
    <div className="dashboard-layout">
      {/* Reusable Sidebar / Navbar */}
      <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />

      {/* Main Content Area */}
      <div className={`dashboard-main ${isCollapsed ? 'dashboard-main--collapsed' : ''}`}>
        {/* Reusable Header */}
        <Header isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />

        {/* Dynamic Page Content */}
        <main className="dashboard-content">
          {children}
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
