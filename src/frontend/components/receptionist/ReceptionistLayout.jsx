// ============================================================
//  ReceptionistLayout.jsx – Shared Receptionist Layout Component
// ============================================================

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReceptionistSidebar from './ReceptionistSidebar';
import ReceptionistHeader from './ReceptionistHeader';
import '../../style/receptionist/ReceptionistLayout.css';

export default function ReceptionistLayout({ children, activeTab = 'Dashboard' }) {
  const navigate = useNavigate();

  // Settings State
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [autoPrintSlip, setAutoPrintSlip] = useState(true);
  const [smsAlertsEnabled, setSmsAlertsEnabled] = useState(true);
  const [whatsappAlerts, setWhatsappAlerts] = useState(true);
  const [voiceAnnouncement, setVoiceAnnouncement] = useState(true);
  const [printerModel, setPrinterModel] = useState('POS-80 Thermal Receipt Printer');
  const [stationName, setStationName] = useState('Main Reception Counter A-01');

  // User Profile State
  const [profile, setProfile] = useState({
    "name": "",
    "dob": "",
    "gender": "",
    "email": "",
    "contact": "",
    "username": "",
    "password": "",
    "shift": "",
    "status": ""
  })

  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleLogout = () => {
    localStorage.removeItem('isReceptionistLoggedIn');
    navigate('/');
  };

  const id = localStorage.getItem("receptionistId");

  useEffect(() => {
    if (!id) return;
    fetch(`http://localhost:8000/receptionist/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProfile(data);
        console.log("receptionist api fetch");
      })
      .catch((err) => {
        console.log(err);
      })
  }, [id]);

  const saveProfile = () => {
    fetch(`http://localhost:8000/receptionist/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(profile),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Profile updated successfully");
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-[200] bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-700 animate-bounce">
          <span className="material-symbols-outlined text-green-400 text-2xl">check_circle</span>
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Receptionist Sidebar */}
      <ReceptionistSidebar activeTab={activeTab} showToast={showToast} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Receptionist Header */}
        <ReceptionistHeader
          profileName={profile.name}
          stationName={stationName}
          onOpenSettings={() => setSettingsOpen(true)}
          onOpenProfile={() => setProfileOpen(true)}
        />

        {/* SYSTEM SETTINGS MODAL */}
        {settingsOpen && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 relative transition-all">
              <button
                onClick={() => setSettingsOpen(false)}
                className="absolute top-6 right-6 text-slate-400 hover:text-slate-700 p-2 rounded-full hover:bg-slate-100 transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>

              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-blue-50 rounded-2xl text-blue-600 border border-blue-100">
                  <span className="material-symbols-outlined text-3xl">settings</span>
                </div>
                <div>
                  <h3 className="text-2xl font-extrabold text-slate-900">OPD System Settings</h3>
                  <p className="text-sm text-slate-500">Configure counter hardware, SMS alerts &amp; display preferences</p>
                </div>
              </div>

              <div className="space-y-5 max-h-[60vh] overflow-y-auto pr-1">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Printer &amp; Hardware</h4>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-bold text-slate-800 block">Auto-Print Token Slip</span>
                      <span className="text-xs text-slate-500">Print thermal slip automatically on token generation</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAutoPrintSlip(!autoPrintSlip)}
                      className={`w-12 h-6 rounded-full transition-colors p-1 flex items-center ${autoPrintSlip ? 'bg-blue-600 justify-end' : 'bg-slate-300 justify-start'
                        }`}
                    >
                      <span className="w-4 h-4 rounded-full bg-white shadow-md"></span>
                    </button>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Thermal Printer Model</label>
                    <select
                      value={printerModel}
                      onChange={(e) => setPrinterModel(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-blue-600 focus:outline-none"
                    >
                      <option>POS-80 Thermal Receipt Printer</option>
                      <option>Epson TM-T82III Direct Thermal</option>
                      <option>Zebra ZD220 Direct Thermal</option>
                    </select>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Patient Messaging &amp; SMS</h4>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-bold text-slate-800 block">SMS Queue Notifications</span>
                      <span className="text-xs text-slate-500">Send live position SMS to patient's mobile number</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSmsAlertsEnabled(!smsAlertsEnabled)}
                      className={`w-12 h-6 rounded-full transition-colors p-1 flex items-center ${smsAlertsEnabled ? 'bg-blue-600 justify-end' : 'bg-slate-300 justify-start'
                        }`}
                    >
                      <span className="w-4 h-4 rounded-full bg-white shadow-md"></span>
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-bold text-slate-800 block">WhatsApp Queue Alerts</span>
                      <span className="text-xs text-slate-500">Send token QR code &amp; status over WhatsApp</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setWhatsappAlerts(!whatsappAlerts)}
                      className={`w-12 h-6 rounded-full transition-colors p-1 flex items-center ${whatsappAlerts ? 'bg-blue-600 justify-end' : 'bg-slate-300 justify-start'
                        }`}
                    >
                      <span className="w-4 h-4 rounded-full bg-white shadow-md"></span>
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Queue Display &amp; Audio</h4>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-bold text-slate-800 block">Voice Queue Announcement</span>
                      <span className="text-xs text-slate-500">Audio chime when calling next patient token</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setVoiceAnnouncement(!voiceAnnouncement)}
                      className={`w-12 h-6 rounded-full transition-colors p-1 flex items-center ${voiceAnnouncement ? 'bg-blue-600 justify-end' : 'bg-slate-300 justify-start'
                        }`}
                    >
                      <span className="w-4 h-4 rounded-full bg-white shadow-md"></span>
                    </button>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Counter Station Name</label>
                    <input
                      type="text"
                      value={stationName}
                      onChange={(e) => setStationName(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-blue-600 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSettingsOpen(false)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSettingsOpen(false);
                    showToast('System settings saved successfully!');
                  }}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-sm">save</span>
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        )}

        {/* USER PROFILE MODAL */}
        {profileOpen && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 relative transition-all">
              <button
                onClick={() => setProfileOpen(false)}
                className="absolute top-6 right-6 text-slate-400 hover:text-slate-700 p-2 rounded-full hover:bg-slate-100 transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100">
                <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white font-black text-xl flex items-center justify-center border-2 border-blue-500 shadow-md">
                  {profile.name.split(" ")[0]?.charAt(0) || ""}
                  {profile.name.split(" ")[1]?.charAt(0) || ""}
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-slate-900">{profile.name}</h3>
                  <p className="text-xs font-semibold text-blue-600">Receptionist</p>
                  <span className="inline-block mt-1 px-2.5 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-bold">
                    ID : {id}
                  </span> <br />
                  <span className="inline-block mt-1 px-2.5 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-bold">
                    Status : {profile.status}
                  </span>
                </div>
              </div>
              <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Name</label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs font-medium focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Date Of Birth</label>
                  <input
                    type="date"
                    value={profile.dob}
                    onChange={(e) => setProfile({ ...profile, dob: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs font-medium focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Gender
                  </label>

                  <div className="flex gap-4">
                    <label>
                      <input
                        type="radio"
                        name="gender"
                        value="Male"
                        checked={profile.gender === "Male"}
                        onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
                      />
                      Male
                    </label>

                    <label>
                      <input
                        type="radio"
                        name="gender"
                        value="Female"
                        checked={profile.gender === "Female"}
                        onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
                      />
                      Female
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Email Address</label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs font-medium focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Mobile Number</label>
                  <input
                    type="tel"
                    value={profile.contact}
                    onChange={(e) => setProfile({ ...profile, contact: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs font-medium focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Username</label>
                  <input
                    type="text"
                    value={profile.username}
                    onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs font-medium focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Password</label>
                  <input
                    type="password"
                    placeholder={profile.password || ''}
                    onChange={(e) => setProfile({ ...profile, password: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs font-medium focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Shift</label>

                  <select
                    value={profile.shift || ''}
                    onChange={(e) => setProfile({ ...profile, shift: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs font-medium focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  >
                    <option value="Morning"> Morning </option>
                    <option value="Evening"> Evening </option>
                    <option value="Afternoon"> Afternoon </option>
                    <option value="Night"> Night </option>
                  </select>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="text-xs font-bold text-red-600 hover:text-red-800 hover:bg-red-50 px-3 py-2 rounded-xl transition-colors flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-base">logout</span>
                  Logout
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setProfileOpen(false);
                    showToast('Profile updated successfully!');
                    saveProfile()
                  }}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-sm">check</span>
                  Save Profile
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Page Container */}
        <main className="max-w-7xl mx-auto px-6 py-8 flex-1 w-full space-y-8">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-slate-200 py-6 px-6 mt-12">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-medium">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900">Smart OPD</span>
              <span>© 2026 Smart OPD Healthcare Solutions. All rights reserved.</span>
            </div>
            <div className="flex items-center gap-6">
              <a href="#privacy" className="hover:text-blue-600 transition-colors">Privacy Policy</a>
              <a href="#terms" className="hover:text-blue-600 transition-colors">Terms of Service</a>
              <a href="#support" className="hover:text-blue-600 transition-colors">Support</a>
              <a href="#contact" className="hover:text-blue-600 transition-colors">Contact Us</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
