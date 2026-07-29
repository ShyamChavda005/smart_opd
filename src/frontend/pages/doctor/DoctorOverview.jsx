// ============================================================
//  DoctorOverview.jsx  –  Doctor Dashboard Overview Page
// ============================================================

import React, { useState } from 'react';
import DoctorLayout from '../../components/doctor/DoctorLayout';
import '../../style/doctor/DoctorOverview.css';

export default function DoctorOverview() {
  const [roomNumber] = useState('Room 402B');
  const [appointments, setAppointments] = useState([
    {
      token: 'T-104',
      name: 'Anita Rao',
      phone: '+91 98765 43210',
      initials: 'AR',
      avatarBg: 'bg-blue-100 text-blue-700',
      pid: '45229',
      reason: 'Chest Pain',
      status: 'CONSULTING',
      statusColor: 'blue',
      time: '10:15 AM',
      age: 45,
      gender: 'Female',
    },
    {
      token: 'T-105',
      name: 'Rahul Kapoor',
      phone: '+91 91234 56789',
      initials: 'RK',
      avatarBg: 'bg-indigo-100 text-indigo-700',
      pid: '45231',
      reason: 'Hypertension Follow-up',
      status: 'WAITING',
      statusColor: 'orange',
      time: '10:30 AM',
      age: 52,
      gender: 'Male',
    },
    {
      token: 'E-02',
      name: 'Suresh Das',
      phone: '+91 99887 76655',
      initials: 'SD',
      avatarBg: 'bg-rose-100 text-rose-700',
      pid: '45235',
      reason: 'Acute Dyspnea (Emergency)',
      status: 'URGENT',
      statusColor: 'red',
      time: '10:45 AM',
      age: 61,
      gender: 'Male',
    },
    {
      token: 'T-106',
      name: 'Priya Nair',
      phone: '+91 88776 65544',
      initials: 'PN',
      avatarBg: 'bg-sky-100 text-sky-700',
      pid: '45240',
      reason: 'Routine ECG Check',
      status: 'WAITING',
      statusColor: 'orange',
      time: '11:00 AM',
      age: 38,
      gender: 'Female',
    },
    {
      token: 'T-107',
      name: 'Amit Patel',
      phone: '+91 77665 54433',
      initials: 'AP',
      avatarBg: 'bg-amber-100 text-amber-700',
      pid: '45244',
      reason: 'Arrhythmia Evaluation',
      status: 'WAITING',
      statusColor: 'orange',
      time: '11:15 AM',
      age: 49,
      gender: 'Male',
    },
  ]);

  const [completedCount, setCompletedCount] = useState(24);
  const [rxDiagnosis, setRxDiagnosis] = useState('');
  const [rxMedicines, setRxMedicines] = useState('');
  const [rxInstructions, setRxInstructions] = useState('');

  const currentlyConsulting =
    appointments.find((a) => a.status === 'CONSULTING') || appointments[0];
  const nextWaiting = appointments.find(
    (a) => a.status === 'WAITING' || a.status === 'URGENT'
  );
  const pendingCount = appointments.filter(
    (a) => a.status !== 'COMPLETED'
  ).length;

  const handleCallNext = () => {
    if (!nextWaiting) {
      alert('No more waiting patients in queue!');
      return;
    }
    setAppointments((prev) =>
      prev.map((item) => {
        if (item.token === currentlyConsulting?.token) {
          return { ...item, status: 'COMPLETED', statusColor: 'emerald' };
        }
        if (item.token === nextWaiting.token) {
          return { ...item, status: 'CONSULTING', statusColor: 'blue' };
        }
        return item;
      })
    );
    setCompletedCount((c) => c + 1);
  };

  const handleCompletePatient = (token) => {
    setAppointments((prev) =>
      prev.map((item) =>
        item.token === token
          ? { ...item, status: 'COMPLETED', statusColor: 'emerald' }
          : item
      )
    );
    setCompletedCount((c) => c + 1);
  };

  const handleEmergencyOverride = () => {
    const emergencyPt = appointments.find(
      (a) => a.status === 'URGENT' || a.statusColor === 'red'
    );
    if (emergencyPt) {
      setAppointments((prev) =>
        prev.map((item) =>
          item.token === emergencyPt.token
            ? { ...item, status: 'CONSULTING', statusColor: 'red' }
            : item
        )
      );
    }
  };

  const handleSavePrescription = (e) => {
    e.preventDefault();
    alert(`E-Prescription generated & sent via SMS to ${currentlyConsulting.name}`);
    setRxDiagnosis('');
    setRxMedicines('');
    setRxInstructions('');
  };

  return (
    <DoctorLayout activeTab="Overview">
      <div className="doctor-overview-container space-y-6">
        {/* Live Queue Banner */}
        <div className="bg-blue-50/70 border border-blue-200/80 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3 flex-wrap text-sm">
            <div className="flex items-center gap-2 font-black text-blue-600 tracking-wider text-xs bg-blue-100/80 px-3 py-1.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping"></span>
              LIVE QUEUE
            </div>
            <span className="text-slate-700 font-medium">
              Now Serving: <strong className="text-slate-900 font-bold">{currentlyConsulting?.token || 'None'} ({currentlyConsulting?.name || 'N/A'})</strong>
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-700 font-medium">
              Next Up: <strong className="text-slate-900 font-bold">{nextWaiting?.token || 'None'} ({nextWaiting?.name || 'N/A'})</strong>
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-700 font-medium">
              Pending: <strong className="text-slate-900 font-bold">{pendingCount} patients</strong>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleEmergencyOverride}
              className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-base">warning</span>
              Emergency Interrupt
            </button>
            <button
              onClick={handleCallNext}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/25 transition-all flex items-center gap-2 shrink-0"
            >
              <span>Call Next Patient</span>
              <span className="material-symbols-outlined text-sm">play_arrow</span>
            </button>
          </div>
        </div>

        {/* 4 Metric Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative overview-card-hover">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <span className="material-symbols-outlined text-xl">calendar_today</span>
              </div>
              <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                +12% vs yest
              </span>
            </div>
            <p className="text-xs font-bold text-slate-400 mb-1">Today's Appointments</p>
            <h3 className="text-3xl font-black text-slate-900">{appointments.length + 37}</h3>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative overview-card-hover">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <span className="material-symbols-outlined text-xl">hourglass_empty</span>
              </div>
              <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                {appointments.filter((a) => a.status === 'URGENT').length} Emergency
              </span>
            </div>
            <p className="text-xs font-bold text-slate-400 mb-1">Pending Queue</p>
            <h3 className="text-3xl font-black text-slate-900">{pendingCount}</h3>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative overview-card-hover">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <span className="material-symbols-outlined text-xl">check_circle</span>
              </div>
              <span className="text-[11px] font-semibold text-slate-400">Target: 50</span>
            </div>
            <p className="text-xs font-bold text-slate-400 mb-1">Completed Cases</p>
            <h3 className="text-3xl font-black text-slate-900">{completedCount}</h3>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative overview-card-hover">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <span className="material-symbols-outlined text-xl">timer</span>
              </div>
              <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                Optimal Speed
              </span>
            </div>
            <p className="text-xs font-bold text-slate-400 mb-1">Avg. Consultation</p>
            <h3 className="text-3xl font-black text-slate-900">
              12 <span className="text-lg font-semibold text-slate-500">min</span>
            </h3>
          </div>
        </div>

        {/* Grid: Table & E-Prescription + Side Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-extrabold text-slate-900">Patient Appointment List</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Active consultation queue for {roomNumber}</p>
                </div>
                <button
                  onClick={handleEmergencyOverride}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 transition-all"
                >
                  <span className="material-symbols-outlined text-base">warning</span>
                  Emergency Override
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-[11px] font-extrabold uppercase text-slate-400 tracking-wider">
                      <th className="py-3 px-4">TOKEN</th>
                      <th className="py-3 px-4">PATIENT</th>
                      <th className="py-3 px-4">STATUS</th>
                      <th className="py-3 px-4">TIME</th>
                      <th className="py-3 px-4 text-right">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {appointments.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-4 px-4 font-black">
                          <span className={row.statusColor === 'red' ? 'text-red-600' : 'text-blue-600'}>
                            {row.token}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs ${row.avatarBg}`}>
                              {row.initials}
                            </div>
                            <div>
                              <h5 className="font-bold text-slate-900 leading-tight">{row.name}</h5>
                              <p className="text-[11px] text-slate-400 font-medium">
                                PID: {row.pid} • <span className="text-slate-600">{row.reason}</span>
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`text-[10px] font-black px-2.5 py-1 rounded-md tracking-wider uppercase ${
                              row.statusColor === 'blue'
                                ? 'bg-blue-100 text-blue-700'
                                : row.statusColor === 'red'
                                ? 'bg-red-100 text-red-700'
                                : row.statusColor === 'emerald'
                                ? 'bg-emerald-100 text-emerald-700'
                                : 'bg-amber-100 text-amber-700'
                            }`}
                          >
                            {row.status}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-xs font-semibold text-slate-600">{row.time}</td>
                        <td className="py-4 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {row.status === 'CONSULTING' && (
                              <button
                                onClick={() => handleCompletePatient(row.token)}
                                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition-all shadow-sm flex items-center gap-1"
                              >
                                <span className="material-symbols-outlined text-sm">check</span>
                                Complete
                              </button>
                            )}
                            {(row.status === 'WAITING' || row.status === 'URGENT') && (
                              <button
                                onClick={() => {
                                  setAppointments((prev) =>
                                    prev.map((item) =>
                                      item.token === row.token
                                        ? { ...item, status: 'CONSULTING', statusColor: 'blue' }
                                        : item
                                    )
                                  );
                                }}
                                className="px-3 py-1 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white font-bold text-xs rounded-lg transition-all border border-blue-200"
                              >
                                CALL
                              </button>
                            )}
                            {row.status === 'COMPLETED' && (
                              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                                <span className="material-symbols-outlined text-sm">done_all</span> Done
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* E-Prescription Form */}
            {currentlyConsulting && (
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-blue-600 text-xl">edit_note</span>
                    <h4 className="text-lg font-bold text-slate-900">
                      Active Consultation Notes for {currentlyConsulting.name} ({currentlyConsulting.token})
                    </h4>
                  </div>
                  <span className="text-xs font-bold text-slate-500">PID: {currentlyConsulting.pid}</span>
                </div>
                <form onSubmit={handleSavePrescription} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Diagnosis &amp; Symptoms
                      </label>
                      <textarea
                        rows={2}
                        value={rxDiagnosis}
                        onChange={(e) => setRxDiagnosis(e.target.value)}
                        placeholder="e.g. Mild Angina, Elevated Blood Pressure (140/90)"
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Prescribed Medicines &amp; Dosage
                      </label>
                      <textarea
                        rows={2}
                        value={rxMedicines}
                        onChange={(e) => setRxMedicines(e.target.value)}
                        placeholder="e.g. Tab. Amlodipine 5mg 1-0-1 (7 days)"
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                    <input
                      type="text"
                      value={rxInstructions}
                      onChange={(e) => setRxInstructions(e.target.value)}
                      placeholder="Special Advice: Rest for 3 days"
                      className="flex-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                    />
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 shrink-0"
                    >
                      <span className="material-symbols-outlined text-base">print</span>
                      Save &amp; Send E-Prescription
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* Right Column Side Cards */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-bold text-slate-900">Patient Flow</h4>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">TODAY</span>
              </div>
              <div className="h-44 flex items-end justify-between gap-3 pt-6 pb-2 border-b border-slate-100 px-2">
                {[
                  { time: '08:00', height: 'h-24', active: false },
                  { time: '10:00', height: 'h-32', active: false },
                  { time: '12:00', height: 'h-40', active: true },
                  { time: '14:00', height: 'h-28', active: false },
                  { time: '16:00', height: 'h-20', active: false },
                  { time: '18:00', height: 'h-12', active: false },
                ].map((bar, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-2 flex-1">
                    <div
                      className={`w-full rounded-t-lg transition-all ${
                        bar.active ? 'bg-blue-600 shadow-md' : 'bg-blue-200/80 hover:bg-blue-300'
                      } ${bar.height}`}
                    ></div>
                    <span className="text-[10px] font-bold text-slate-400">{bar.time}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h4 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-600 text-xl">chat</span>
                Lab Alerts
              </h4>
              <div className="p-4 rounded-2xl bg-red-50/80 border-l-4 border-red-500 space-y-1">
                <span className="text-[10px] font-black tracking-widest text-red-600 uppercase">CRITICAL RESULT</span>
                <h5 className="font-bold text-slate-900 text-sm">Patient: Manish Gupta</h5>
                <p className="text-xs text-slate-600 font-medium">Troponin-I elevated (0.45 ng/mL)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DoctorLayout>
  );
}
