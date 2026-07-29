// ============================================================
//  AdminDashboard.js  –  Admin Dashboard Page Component
// ============================================================

import React from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import '../../style/admin/AdminDashboard.css';


function AdminDashboard() {
  return (
    <AdminLayout>
      {/* --- Empty State --- */}
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
    </AdminLayout>
  );
}

export default AdminDashboard;

