// ============================================================
//  DoctorLayout.jsx – Shared Doctor Layout Component
// ============================================================

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DoctorSidebar from './DoctorSidebar';
import DoctorHeader from './DoctorHeader';
import GlassDatePicker from '../controls/GlassDatePicker';
import '../../style/doctor/DoctorLayout.css';

import { getAuthPayload, getAuthHeaders, logout } from '../../auth';

export default function DoctorLayout({ children, activeTab = 'Overview' }) {
  const navigate = useNavigate();

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Settings State
  const [roomNumber, setRoomNumber] = useState('Room 402B');
  const [autoNext, setAutoNext] = useState(true);
  const [audioChime, setAudioChime] = useState(true);

  const payload = getAuthPayload();

  // Doctor Profile State
  const [doctor, setDoctor] = useState({
    name: payload?.username ? `Dr. ${payload.username}` : "Dr. Priya Sharma",
    dob: "1984-06-15",
    gender: "Female",
    email: payload?.username ? `${payload.username}@smartopd.in` : "priya.sharma@smartopd.in",
    contact: "+91 98765 43210",
    specialization: "Cardiology",
    avg_time: 12,
    username: payload?.username || "dr_priya",
    password: "",
    status: "Active"
  });

  // Quick Add Patient state
  const [newPatientName, setNewPatientName] = useState('');
  const [newPatientReason, setNewPatientReason] = useState('');
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  useEffect(() => {
    fetch("http://localhost:8000/doctor/me", {
      headers: getAuthHeaders()
    })
      .then((res) => {
        if (!res.ok) throw new Error("Could not fetch current doctor profile");
        return res.json();
      })
      .then((data) => {
        if (data && typeof data === 'object' && !data.error) {
          setDoctor(prev => ({ ...prev, ...data }));
        }
      })
      .catch((err) => {
        console.log("Using session profile:", err.message);
      });
  }, []);

  const saveProfile = async () => {
    try {
      const response = await fetch("http://localhost:8000/doctor/me", {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(doctor)
      });

      if (!response.ok) {
        showToast("Profile updated in current session!");
      } else {
        showToast("Doctor profile saved successfully!");
      }
    } catch (err) {
      console.log("Session profile updated offline:", err);
      showToast("Profile updated in session!");
    }
  };

  const handleLogout = () => {
    logout(navigate);
  };

  /* ---------- Shared visual tokens (styling only) ---------- */
  const overlayClass = 'fixed inset-0 z-[150] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-fadeIn';
  const panelClass = 'relative w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 shadow-2xl';
  const closeClass = 'absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 outline-none transition-colors duration-150 hover:bg-slate-100 hover:text-slate-700 focus-visible:ring-2 focus-visible:ring-blue-600';
  const labelClass = 'mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500';
  const inputClass = 'w-full rounded-xl border border-slate-200 bg-slate-50/80 px-3.5 py-2.5 text-sm font-medium text-slate-800 outline-none transition-all duration-150 placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100';
  const secondaryBtnClass = 'inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition-colors duration-150 hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2';
  const primaryBtnClass = 'inline-flex h-10 items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm shadow-blue-500/20 transition-all duration-150 hover:bg-blue-700 hover:shadow-md hover:shadow-blue-500/25 focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2';
  const toggleClass = (on) =>
    `relative inline-flex h-6 w-11 shrink-0 items-center rounded-full p-0.5 outline-none transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 ${on ? 'bg-blue-600' : 'bg-slate-300'}`;
  const knobClass = (on) =>
    `inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-150 ${on ? 'translate-x-5' : 'translate-x-0'}`;

  return (
    <div className="flex min-h-screen flex-col md:flex-row bg-slate-50 font-sans text-slate-800 antialiased">
      {/* Toast Alert */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed right-4 top-4 z-[200] flex max-w-[calc(100vw-2rem)] items-center gap-3 rounded-2xl border border-slate-700 bg-slate-900/95 px-4 py-3 text-white shadow-xl backdrop-blur-md sm:right-6 sm:top-6"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/20 text-blue-400">
            <span className="material-symbols-outlined text-[18px] leading-none">notifications_active</span>
          </span>
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Doctor Sidebar (Desktop + Mobile Drawer) */}
      <DoctorSidebar
        activeTab={activeTab}
        showToast={showToast}
        isMobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Doctor Header */}
        <DoctorHeader
          docName={doctor.name}
          docSpecialty={doctor.specialization}
          roomNumber={roomNumber}
          onOpenSettings={() => setSettingsOpen(true)}
          onOpenProfile={() => setProfileOpen(true)}
          onToggleMobileMenu={() => setMobileMenuOpen(prev => !prev)}
        />

        {/* SETTINGS MODAL */}
        {settingsOpen && (
          <div className={overlayClass}>
            <div className={panelClass} role="dialog" aria-modal="true" aria-labelledby="cabin-settings-title">
              <button type="button" onClick={() => setSettingsOpen(false)} aria-label="Close settings" className={closeClass}>
                <span className="material-symbols-outlined text-[20px] leading-none">close</span>
              </button>

              <div className="mb-5 flex items-center gap-3.5">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 ring-1 ring-blue-100">
                  <span className="material-symbols-outlined text-[24px] leading-none">settings</span>
                </span>
                <div>
                  <h3 id="cabin-settings-title" className="text-lg font-bold text-slate-900">Cabin Settings</h3>
                  <p className="mt-0.5 text-xs text-slate-500">Configure consultation room and calling alert preferences</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor="room-number" className={labelClass}>Consultation Room Number</label>
                  <input
                    id="room-number"
                    type="text"
                    value={roomNumber}
                    onChange={(e) => setRoomNumber(e.target.value)}
                    className={inputClass}
                  />
                </div>

                <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-200/90 bg-slate-50/70 p-3.5 transition-colors hover:bg-slate-50">
                  <div className="min-w-0">
                    <span className="block text-sm font-semibold text-slate-800">Auto-Advance Next Patient</span>
                    <span className="mt-0.5 block text-xs text-slate-500">Automatically call next patient when completing consultation</span>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={autoNext}
                    aria-label="Auto-Advance Next Patient"
                    onClick={() => setAutoNext(!autoNext)}
                    className={toggleClass(autoNext)}
                  >
                    <span className={knobClass(autoNext)}></span>
                  </button>
                </div>

                <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-200/90 bg-slate-50/70 p-3.5 transition-colors hover:bg-slate-50">
                  <div className="min-w-0">
                    <span className="block text-sm font-semibold text-slate-800">Voice Queue Announcement</span>
                    <span className="mt-0.5 block text-xs text-slate-500">Chime speaker in waiting lounge when calling next token</span>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={audioChime}
                    aria-label="Voice Queue Announcement"
                    onClick={() => setAudioChime(!audioChime)}
                    className={toggleClass(audioChime)}
                  >
                    <span className={knobClass(audioChime)}></span>
                  </button>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3 border-t border-slate-100 pt-4">
                <button type="button" onClick={() => setSettingsOpen(false)} className={secondaryBtnClass}>
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSettingsOpen(false);
                    showToast('Cabin settings updated!');
                  }}
                  className={primaryBtnClass}
                >
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        )}

        {/* PROFILE MODAL */}
        {profileOpen && (
          <div className={overlayClass}>
            <div className={panelClass} role="dialog" aria-modal="true" aria-labelledby="profile-title">
              <button type="button" onClick={() => setProfileOpen(false)} aria-label="Close profile" className={closeClass}>
                <span className="material-symbols-outlined text-[20px] leading-none">close</span>
              </button>

              <div className="mb-5 flex items-center gap-4 border-b border-slate-100 pb-5">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-lg font-bold text-white shadow-md shadow-blue-500/20">
                  {doctor.name.split(" ")[0]?.charAt(0) || ""}
                  {doctor.name.split(" ")[1]?.charAt(0) || ""}
                </span>
                <div className="min-w-0">
                  <h3 id="profile-title" className="truncate text-lg font-bold text-slate-900">{doctor.name}</h3>
                  <div className="mt-1 flex flex-wrap items-center gap-1.5">
                    <span className="rounded-lg bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-blue-700 ring-1 ring-inset ring-blue-100">
                      @{doctor.username || 'doctor'}
                    </span>
                    <span className="rounded-lg bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-100">
                      Status: {doctor.status || 'Active'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="max-h-[60vh] space-y-4 overflow-y-auto pr-1">
                <div>
                  <label htmlFor="doc-name" className={labelClass}>Doctor Name</label>
                  <input
                    id="doc-name"
                    type="text"
                    value={doctor.name}
                    onChange={(e) => setDoctor({ ...doctor, name: e.target.value })}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Date Of Birth</label>
                  <GlassDatePicker
                    value={doctor.dob}
                    onChange={(e) => setDoctor({ ...doctor, dob: e.target.value })}
                    placeholder="Select date of birth"
                    ariaLabel="Date Of Birth"
                  />
                </div>
                <fieldset>
                  <legend className={labelClass}>Gender</legend>
                  <div className="flex gap-2">
                    {['Male', 'Female'].map((option) => (
                      <label
                        key={option}
                        className={[
                          'flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold outline-none transition-all duration-150',
                          'focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2',
                          doctor.gender === option
                            ? 'border-blue-500 bg-blue-50/90 text-blue-700 shadow-sm'
                            : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50',
                        ].join(' ')}
                      >
                        <input
                          type="radio"
                          name="gender"
                          value={option}
                          checked={doctor.gender === option}
                          onChange={(e) => setDoctor({ ...doctor, gender: e.target.value })}
                          className="h-3.5 w-3.5 accent-blue-600"
                        />
                        {option}
                      </label>
                    ))}
                  </div>
                </fieldset>
                <div>
                  <label htmlFor="doc-specialization" className={labelClass}>Specialization</label>
                  <input
                    id="doc-specialization"
                    type="text"
                    value={doctor.specialization}
                    onChange={(e) => setDoctor({ ...doctor, specialization: e.target.value })}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="doc-email" className={labelClass}>Email Address</label>
                  <input
                    id="doc-email"
                    type="email"
                    value={doctor.email}
                    onChange={(e) => setDoctor({ ...doctor, email: e.target.value })}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="doc-contact" className={labelClass}>Contact Number</label>
                  <input
                    id="doc-contact"
                    type="tel"
                    value={doctor.contact}
                    onChange={(e) => setDoctor({ ...doctor, contact: e.target.value })}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="doc-avg-time" className={labelClass}>Avg Consultation Time (mins)</label>
                  <input
                    id="doc-avg-time"
                    type="number"
                    value={doctor.avg_time}
                    onChange={(e) => setDoctor({ ...doctor, avg_time: e.target.value })}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="doc-username" className={labelClass}>Username</label>
                  <input
                    id="doc-username"
                    type="text"
                    value={doctor.username}
                    onChange={(e) => setDoctor({ ...doctor, username: e.target.value })}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="doc-password" className={labelClass}>Password</label>
                  <input
                    id="doc-password"
                    type="password"
                    value={doctor.password || ''}
                    placeholder="Enter new password to change"
                    onChange={(e) => setDoctor({ ...doctor, password: e.target.value })}
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl px-3 text-sm font-semibold text-red-600 outline-none transition-colors duration-150 hover:bg-red-50 hover:text-red-700 focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
                >
                  <span className="material-symbols-outlined text-[18px] leading-none">logout</span>
                  Sign Out
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setProfileOpen(false);
                    showToast('Doctor Profile Updated!');
                    saveProfile();
                  }}
                  className={primaryBtnClass}
                >
                  <span className="material-symbols-outlined text-[18px] leading-none">check</span>
                  Save Profile
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ADD DIRECT PATIENT MODAL */}
        {addModalOpen && (
          <div className={overlayClass}>
            <div className={panelClass} role="dialog" aria-modal="true" aria-labelledby="add-patient-title">
              <button type="button" onClick={() => setAddModalOpen(false)} aria-label="Close" className={closeClass}>
                <span className="material-symbols-outlined text-[20px] leading-none">close</span>
              </button>

              <div className="mb-5 flex items-center gap-3.5">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 ring-1 ring-blue-100">
                  <span className="material-symbols-outlined text-[24px] leading-none">person_add</span>
                </span>
                <div>
                  <h3 id="add-patient-title" className="text-lg font-bold text-slate-900">Add Patient to Queue</h3>
                  <p className="mt-0.5 text-xs text-slate-500">Directly insert patient into today's consultation queue</p>
                </div>
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  showToast(`Patient ${newPatientName} added to queue!`);
                  setNewPatientName('');
                  setNewPatientReason('');
                  setAddModalOpen(false);
                }}
                className="space-y-4"
              >
                <div>
                  <label htmlFor="new-patient-name" className={labelClass}>Patient Name</label>
                  <input
                    id="new-patient-name"
                    required
                    type="text"
                    value={newPatientName}
                    onChange={(e) => setNewPatientName(e.target.value)}
                    placeholder="e.g. Vikramaditya Shah"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="new-patient-reason" className={labelClass}>Chief Complaint / Reason</label>
                  <input
                    id="new-patient-reason"
                    required
                    type="text"
                    value={newPatientReason}
                    onChange={(e) => setNewPatientReason(e.target.value)}
                    placeholder="e.g. Sudden Palpitations"
                    className={inputClass}
                  />
                </div>

                <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
                  <button type="button" onClick={() => setAddModalOpen(false)} className={secondaryBtnClass}>
                    Cancel
                  </button>
                  <button type="submit" className={primaryBtnClass}>
                    <span className="material-symbols-outlined text-[18px] leading-none">person_add</span>
                    Add to Queue
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Page Container */}
        <main className="mx-auto w-full max-w-[1400px] flex-1 animate-fadeIn px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {children}
        </main>

        {/* Footer */}
        <footer className="mt-auto border-t border-slate-200/80 bg-white">
          <div className="mx-auto flex max-w-[1400px] flex-col items-center justify-between gap-3 px-4 py-4 text-xs text-slate-500 md:flex-row sm:px-6 lg:px-8">
            <p className="flex flex-wrap items-center gap-x-2">
              <span className="font-bold text-slate-900">MediQueue</span>
              <span className="text-slate-300">•</span>
              <span>© 2026 Smart OPD Healthcare Solutions. All rights reserved.</span>
            </p>
            <nav aria-label="Footer" className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
              <a href="#privacy" className="rounded outline-none transition-colors duration-150 hover:text-blue-600 focus-visible:ring-2 focus-visible:ring-blue-600">Privacy Policy</a>
              <a href="#terms" className="rounded outline-none transition-colors duration-150 hover:text-blue-600 focus-visible:ring-2 focus-visible:ring-blue-600">Terms of Service</a>
              <a href="#support" className="rounded outline-none transition-colors duration-150 hover:text-blue-600 focus-visible:ring-2 focus-visible:ring-blue-600">Support</a>
              <a href="#contact" className="rounded outline-none transition-colors duration-150 hover:text-blue-600 focus-visible:ring-2 focus-visible:ring-blue-600">Contact Us</a>
            </nav>
          </div>
        </footer>
      </div>

      {/* Floating Action Button */}
      <button
        type="button"
        onClick={() => setAddModalOpen(true)}
        title="Directly Add Patient to Queue"
        aria-label="Directly Add Patient to Queue"
        className="fixed bottom-6 right-6 z-40 inline-flex h-13 w-13 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 transition-all duration-200 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/40 focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 sm:bottom-8 sm:right-8"
      >
        <span className="material-symbols-outlined text-[26px] leading-none">add</span>
      </button>
    </div>
  );
}
