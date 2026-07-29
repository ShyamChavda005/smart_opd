// ============================================================
//  App.jsx  –  Root Component with Multi-Role Routing
// ============================================================

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';

// Admin Pages
import AdminDashboard from './frontend/pages/admin/AdminDashboard';
import Doctors from './frontend/pages/admin/Doctors';
import AddDoctor from './frontend/pages/admin/AddDoctor';
import Receptionists from './frontend/pages/admin/Receptionists';
import AddReceptionist from './frontend/pages/admin/AddReceptionist';
import AdminProfile from './frontend/pages/admin/AdminProfile';
import AdminReports from './frontend/pages/admin/AdminReports';

// Landing Page & New Panels
import LandingPage from './frontend/pages/landing/LandingPage';
// Doctor Pages
import DoctorOverview from './frontend/pages/doctor/DoctorOverview';
import DoctorLiveQueue from './frontend/pages/doctor/DoctorLiveQueue';
import DoctorAppointments from './frontend/pages/doctor/DoctorAppointments';
import DoctorAnalytics from './frontend/pages/doctor/DoctorAnalytics';
// Receptionist Pages
import ReceptionistDashboard from './frontend/pages/receptionist/ReceptionistDashboard';
import ReceptionistQueueBoard from './frontend/pages/receptionist/ReceptionistQueueBoard';
import ReceptionistPatients from './frontend/pages/receptionist/ReceptionistPatients';
import ReceptionistStats from './frontend/pages/receptionist/ReceptionistStats';

// ---------- Protected Route Helpers ----------

/** Redirects to landing page if admin is not authenticated */
function ProtectedAdminRoute({ children }) {
  const isLoggedIn = localStorage.getItem('isAdminLoggedIn') === 'true';
  return isLoggedIn ? children : <Navigate to="/" replace />;
}

/** Redirects to landing page if doctor is not authenticated */
function ProtectedDoctorRoute({ children }) {
  const isLoggedIn = localStorage.getItem('isDoctorLoggedIn') === 'true';
  return isLoggedIn ? children : <Navigate to="/" replace />;
}

/** Redirects to landing page if receptionist is not authenticated */
function ProtectedReceptionistRoute({ children }) {
  const isLoggedIn = localStorage.getItem('isReceptionistLoggedIn') === 'true';
  return isLoggedIn ? children : <Navigate to="/" replace />;
}

// ---------- Landing Page Container Component ----------
function LandingPageWrapper() {
  const navigate = useNavigate();

  const handleLogin = (role, username, password) => {
    if (role === 'admin') {
      localStorage.setItem('isAdminLoggedIn', 'true');
      navigate('/admin/dashboard');
    } else if (role === 'doctor') {
      localStorage.setItem('isDoctorLoggedIn', 'true');
      navigate('/doctor/dashboard');
    } else if (role === 'receptionist') {
      localStorage.setItem('isReceptionistLoggedIn', 'true');
      navigate('/receptionist/dashboard');
    }
  };

  return <LandingPage onLogin={handleLogin} />;
}



// ---------- App ----------

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing Page (Default Root) */}
        <Route path="/" element={<LandingPageWrapper />} />

        {/* Doctor Panel Routes */}
        <Route
          path="/doctor/dashboard"
          element={
            <ProtectedDoctorRoute>
              <DoctorOverview />
            </ProtectedDoctorRoute>
          }
        />
        <Route
          path="/doctor/live-queue"
          element={
            <ProtectedDoctorRoute>
              <DoctorLiveQueue />
            </ProtectedDoctorRoute>
          }
        />
        <Route
          path="/doctor/appointments"
          element={
            <ProtectedDoctorRoute>
              <DoctorAppointments />
            </ProtectedDoctorRoute>
          }
        />
        <Route
          path="/doctor/analytics"
          element={
            <ProtectedDoctorRoute>
              <DoctorAnalytics />
            </ProtectedDoctorRoute>
          }
        />
        <Route
          path="/doctor"
          element={<Navigate to="/doctor/dashboard" replace />}
        />

        {/* Receptionist Panel Routes */}
        <Route
          path="/receptionist/dashboard"
          element={
            <ProtectedReceptionistRoute>
              <ReceptionistDashboard />
            </ProtectedReceptionistRoute>
          }
        />
        <Route
          path="/receptionist/queue-board"
          element={
            <ProtectedReceptionistRoute>
              <ReceptionistQueueBoard />
            </ProtectedReceptionistRoute>
          }
        />
        <Route
          path="/receptionist/patients"
          element={
            <ProtectedReceptionistRoute>
              <ReceptionistPatients />
            </ProtectedReceptionistRoute>
          }
        />
        <Route
          path="/receptionist/stats"
          element={
            <ProtectedReceptionistRoute>
              <ReceptionistStats />
            </ProtectedReceptionistRoute>
          }
        />
        <Route
          path="/receptionist"
          element={<Navigate to="/receptionist/dashboard" replace />}
        />


        {/* Admin Panel Routes (protected) */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedAdminRoute>
              <AdminDashboard />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/doctors"
          element={
            <ProtectedAdminRoute>
              <Doctors />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/add-doctor"
          element={
            <ProtectedAdminRoute>
              <AddDoctor />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/receptionists"
          element={
            <ProtectedAdminRoute>
              <Receptionists />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/add-receptionist"
          element={
            <ProtectedAdminRoute>
              <AddReceptionist />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/profile"
          element={
            <ProtectedAdminRoute>
              <AdminProfile />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/reports"
          element={
            <ProtectedAdminRoute>
              <AdminReports />
            </ProtectedAdminRoute>
          }
        />

        {/* Fallback redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
