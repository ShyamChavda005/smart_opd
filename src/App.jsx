// ============================================================
//  App.jsx  –  Root Component with Routing
// ============================================================

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AdminLogin from './frontend/pages/AdminLogin';
import AdminDashboard from './frontend/pages/AdminDashboard';
import Doctors from './frontend/pages/Doctors';
import AddDoctor from './frontend/pages/AddDoctor';
import Receptionists from './frontend/pages/Receptionists';
import AddReceptionist from './frontend/pages/AddReceptionist';
import AdminProfile from './frontend/pages/AdminProfile';


// ---------- Protected Route Helper ----------

/** Redirects to login if admin is not authenticated */
function ProtectedRoute({ children }) {
  const isLoggedIn = localStorage.getItem('isAdminLoggedIn') === 'true';
  return isLoggedIn ? children : <Navigate to="/" replace />;
}


// ---------- App ----------

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login Page */}
        <Route path="/" element={<AdminLogin />} />

        {/* Admin Dashboard (protected) */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Doctors Page (protected) */}
        <Route
          path="/admin/doctors"
          element={
            <ProtectedRoute>
              <Doctors />
            </ProtectedRoute>
          }
        />

        {/* Add Doctor Page (protected) */}
        <Route
          path="/admin/add-doctor"
          element={
            <ProtectedRoute>
              <AddDoctor />
            </ProtectedRoute>
          }
        />

        {/* Receptionists Page (protected) */}
        <Route
          path="/admin/receptionists"
          element={
            <ProtectedRoute>
              <Receptionists />
            </ProtectedRoute>
          }
        />

        {/* Add Receptionist Page (protected) */}
        <Route
          path="/admin/add-receptionist"
          element={
            <ProtectedRoute>
              <AddReceptionist />
            </ProtectedRoute>
          }
        />

        {/* Admin Profile Page (protected) */}
        <Route
          path="/admin/profile"
          element={
            <ProtectedRoute>
              <AdminProfile />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;


