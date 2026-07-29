// ============================================================
//  AdminLayout.jsx – Shared Layout (AdminSidebar + AdminHeader + Content)
// ============================================================

import React, { useState } from 'react';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import '../../style/admin/AdminDashboard.css';

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
      {/* Admin Sidebar */}
      <AdminSidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />

      {/* Main Content Area */}
      <div className={`dashboard-main ${isCollapsed ? 'dashboard-main--collapsed' : ''}`}>
        {/* Admin Header */}
        <AdminHeader isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />

        {/* Dynamic Page Content */}
        <main className="dashboard-content">
          {children}
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
