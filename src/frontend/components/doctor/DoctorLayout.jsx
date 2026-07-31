// ============================================================
//  DoctorLayout.jsx – Shared Doctor Layout Component
// ============================================================

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DoctorSidebar from './DoctorSidebar';
import DoctorHeader from './DoctorHeader';
import '../../style/doctor/DoctorLayout.css';

export default function DoctorLayout({ children, activeTab = 'Overview' }) {
  const navigate = useNavigate();

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);

  // Settings State
  const [roomNumber, setRoomNumber] = useState('Room 402B');
  const [autoNext, setAutoNext] = useState(true);
  const [audioChime, setAudioChime] = useState(true);

  // Doctor Profile State
  const [doctor, setDoctor] = useState({
    "name": "",
    "dob": "",
    "gender": "",
    "email": "",
    "contact": "",
    "specialization": "",
    "avg_time": "",
    "username": "",
    "password": "",
    "status": ""
  })

  // Quick Add Patient state
  const [newPatientName, setNewPatientName] = useState('');
  const [newPatientReason, setNewPatientReason] = useState('');
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const id = localStorage.getItem("doctorId");

  useEffect(() => {
    fetch(`http://localhost:8000/doctor/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setDoctor(data);
        console.log(data);
      })
      .catch((err) => {
        console.log(err);
      })
  }, [])

  const saveProfile = async () => {
    try {
      const response = await fetch(`http://localhost:8000/doctor/${id}`, {
        method : "PUT",
        headers : {
          "Content-Type" : "application/json"
        },
        body : JSON.stringify(doctor)
      });

      if (!response.ok) {
        alert("not updated !");
      } 

    } catch (err) {
      console.error(err);
      alert("Error updating profile");
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('doctorusername');
    localStorage.removeItem('isDoctorLoggedIn');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex font-sans">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-[200] bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-700 animate-bounce">
          <span className="material-symbols-outlined text-blue-400 text-2xl">campaign</span>
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Doctor Sidebar */}
      <DoctorSidebar activeTab={activeTab} showToast={showToast} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Doctor Header */}
        <DoctorHeader
          docName={doctor.name}
          docSpecialty={doctor.specialization}
          roomNumber={roomNumber}
          onOpenSettings={() => setSettingsOpen(true)}
          onOpenProfile={() => setProfileOpen(true)}
        />

        {/* SETTINGS MODAL */}
        {settingsOpen && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 relative transition-all">
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
                  <h3 className="text-2xl font-extrabold text-slate-900">Cabin Settings</h3>
                  <p className="text-sm text-slate-500">Configure room number &amp; calling alerts</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Consultation Room Number
                  </label>
                  <input
                    type="text"
                    value={roomNumber}
                    onChange={(e) => setRoomNumber(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs font-bold focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">Auto-Advance Next Patient</span>
                    <span className="text-[11px] text-slate-500">Call next patient automatically upon completing consultation</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAutoNext(!autoNext)}
                    className={`w-11 h-6 rounded-full transition-colors p-1 flex items-center ${autoNext ? 'bg-blue-600 justify-end' : 'bg-slate-300 justify-start'
                      }`}
                  >
                    <span className="w-4 h-4 rounded-full bg-white shadow-md"></span>
                  </button>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">Voice Queue Announcement</span>
                    <span className="text-[11px] text-slate-500">Chime speaker in waiting lounge when calling</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAudioChime(!audioChime)}
                    className={`w-11 h-6 rounded-full transition-colors p-1 flex items-center ${audioChime ? 'bg-blue-600 justify-end' : 'bg-slate-300 justify-start'
                      }`}
                  >
                    <span className="w-4 h-4 rounded-full bg-white shadow-md"></span>
                  </button>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end gap-3">
                <button
                  onClick={() => setSettingsOpen(false)}
                  className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setSettingsOpen(false);
                    showToast('Cabin settings updated!');
                  }}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md"
                >
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        )}

        {/* PROFILE MODAL */}
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
                  {doctor.name.split(" ")[0].charAt(0)}
                  {doctor.name.split(" ")[1].charAt(0)}
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-slate-900">{doctor.name}</h3>
                  <p className="text-xs font-semibold text-blue-600">{doctor.specialization}</p>
                  <span className="inline-block mt-1 px-2.5 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-bold">
                    ID: {id}
                  </span> <br/>
                  <span className="inline-block mt-1 px-2.5 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-bold">
                    Status: {doctor.status}
                  </span>
                </div>
              </div>
              <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Doctor Name</label>
                  <input
                    type="text"
                    value={doctor.name}
                    onChange={(e) => setDoctor({ ...doctor, name: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs font-medium focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Date Of Birth</label>
                  <input
                    type="date"
                    value={doctor.dob}
                    onChange={(e) => setDoctor({ ...doctor, dob: e.target.value })}
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
                        checked={doctor.gender === "Male"}
                        onChange={(e) => setDoctor({ ...doctor, gender: e.target.value })}
                      />
                      Male
                    </label>

                    <label>
                      <input
                        type="radio"
                        name="gender"
                        value="Female"
                        checked={doctor.gender === "Female"}
                        onChange={(e) => setDoctor({ ...doctor, gender: e.target.value })}
                      />
                      Female
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Specialization</label>
                  <input
                    type="text"
                    value={doctor.specialization}
                    onChange={(e) => setDoctor({ ...doctor, specialization: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs font-medium focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Email</label>
                  <input
                    type="email"
                    value={doctor.email}
                    onChange={(e) => setDoctor({ ...doctor, email: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs font-medium focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Contact No.</label>
                  <input
                    type="tel"
                    value={doctor.contact}
                    onChange={(e) => setDoctor({ ...doctor, contact: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs font-medium focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Avg_Constulant_Time</label>
                  <input
                    type="number"
                    value={doctor.avg_time}
                    onChange={(e) => setDoctor({ ...doctor, avg_time: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs font-medium focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Username</label>
                  <input
                    type="text"
                    value={doctor.username}
                    onChange={(e) => setDoctor({ ...doctor, username: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs font-medium focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Password</label>
                  <input
                    type="password"
                    value={doctor.password || ''}
                    placeholder="Enter new password"
                    onChange={(e) => setDoctor({ ...doctor, password: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs font-medium focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
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
                    showToast('Doctor Profile Updated!');
                    saveProfile();
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

        {/* ADD DIRECT PATIENT MODAL */}
        {addModalOpen && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 relative transition-all">
              <button
                onClick={() => setAddModalOpen(false)}
                className="absolute top-6 right-6 text-slate-400 hover:text-slate-700 p-2 rounded-full hover:bg-slate-100 transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
              <h3 className="text-2xl font-black text-slate-900 mb-1">Add Patient to Queue</h3>
              <p className="text-xs text-slate-500 mb-6">Directly insert patient into today's consultation queue</p>
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
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Patient Name</label>
                  <input
                    required
                    type="text"
                    value={newPatientName}
                    onChange={(e) => setNewPatientName(e.target.value)}
                    placeholder="e.g. Vikramaditya Shah"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs font-medium focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Chief Complaint / Reason</label>
                  <input
                    required
                    type="text"
                    value={newPatientReason}
                    onChange={(e) => setNewPatientReason(e.target.value)}
                    placeholder="e.g. Sudden Palpitations"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs font-medium focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
                <div className="pt-4 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setAddModalOpen(false)}
                    className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-base">person_add</span>
                    Add to Queue
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Page Container */}
        <main className="p-8 space-y-6 flex-1 max-w-7xl mx-auto w-full">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-slate-200 py-6 px-8 mt-auto">
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

      {/* Floating Action Button */}
      <button
        onClick={() => setAddModalOpen(true)}
        title="Directly Add Patient to Queue"
        className="fixed bottom-8 right-8 w-14 h-14 bg-blue-600 text-white rounded-full shadow-2xl hover:bg-blue-700 hover:scale-110 transition-all flex items-center justify-center z-50"
      >
        <span className="material-symbols-outlined text-3xl font-bold">add</span>
      </button>
    </div>
  );
}
