// ============================================================
//  App.jsx  –  Root Component with Multi-Role Routing
// ============================================================

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';

// Admin Pages
import AdminDashboard from './utilities/pages/admin/AdminDashboard';
import Doctors from './utilities/pages/admin/Doctors';
import AddDoctor from './utilities/pages/admin/AddDoctor';
import Receptionists from './utilities/pages/admin/Receptionists';
import AddReceptionist from './utilities/pages/admin/AddReceptionist';
import AdminProfile from './utilities/pages/admin/AdminProfile';
import AdminReports from './utilities/pages/admin/AdminReports';
import AdminSymptoms from './utilities/pages/admin/AdminSymptoms';
import AddSymptom from './utilities/pages/admin/AddSymptom';

// Landing Page & New Panels
import LandingPage from './utilities/pages/landing/LandingPage';
// Doctor Pages
import DoctorOverview from './utilities/pages/doctor/DoctorOverview';
import DoctorLiveQueue from './utilities/pages/doctor/DoctorLiveQueue';
import DoctorAppointments from './utilities/pages/doctor/DoctorAppointments';
import DoctorAnalytics from './utilities/pages/doctor/DoctorAnalytics';
// Receptionist Pages
import ReceptionistDashboard from './utilities/pages/receptionist/ReceptionistDashboard';
import ReceptionistQueueBoard from './utilities/pages/receptionist/ReceptionistQueueBoard';
import ReceptionistTokens from './utilities/pages/receptionist/ReceptionistTokens';
import ReceptionistPatients from './utilities/pages/receptionist/ReceptionistPatients';
import ReceptionistStats from './utilities/pages/receptionist/ReceptionistStats';

// Authentication Helper
import { isAuthenticated } from './utilities/auth';

// ---------- Protected Route Helpers ----------

/** Redirects to landing page if admin is not authenticated via JWT */
function ProtectedAdminRoute({ children }) {
  return isAuthenticated('admin') ? children : <Navigate to="/" replace />;
}

/** Redirects to landing page if doctor is not authenticated via JWT */
function ProtectedDoctorRoute({ children }) {
  return isAuthenticated('doctor') ? children : <Navigate to="/" replace />;
}

/** Redirects to landing page if receptionist is not authenticated via JWT */
function ProtectedReceptionistRoute({ children }) {
  return isAuthenticated('receptionist') ? children : <Navigate to="/" replace />;
}

// ---------- Landing Page Container Component ----------
function LandingPageWrapper() {
  const navigate = useNavigate();

  const handleLogin = (role) => {
    if (role === 'admin') {
      navigate('/admin/dashboard');
    } else if (role === 'doctor') {
      navigate('/doctor/dashboard');
    } else if (role === 'receptionist') {
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
          path="/receptionist/tokens"
          element={
            <ProtectedReceptionistRoute>
              <ReceptionistTokens />
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
        <Route
          path="/admin/symptoms"
          element={
            <ProtectedAdminRoute>
              <AdminSymptoms />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/add-symptom"
          element={
            <ProtectedAdminRoute>
              <AddSymptom />
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
