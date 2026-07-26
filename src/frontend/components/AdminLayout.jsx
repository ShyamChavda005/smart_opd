// ============================================================
//  AdminLayout.jsx  –  Shared Layout (Sidebar + Header + Content)
// ============================================================

import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import '../style/AdminDashboard.css';

function AdminLayout({ children }) {
  return (
    <div className="dashboard-layout">
      {/* Reusable Sidebar / Navbar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="dashboard-main">
        {/* Reusable Header */}
        <Header />

        {/* Dynamic Page Content */}
        <main className="dashboard-content">
          {children}
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
