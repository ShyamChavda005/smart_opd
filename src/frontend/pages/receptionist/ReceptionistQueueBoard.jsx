// ============================================================
//  ReceptionistQueueBoard.jsx  –  Real-Time Queue Dashboard Page
// ============================================================

import React, { useState } from 'react';
import ReceptionistLayout from '../../components/receptionist/ReceptionistLayout';
import '../../style/receptionist/ReceptionistQueueBoard.css';

export default function ReceptionistQueueBoard() {
  const [doctorsStatus, setDoctorsStatus] = useState([
    { name: 'Dr. J. Miller', status: 'AVAILABLE' },
    { name: 'Dr. S. Chen', status: 'IN SESSION' },
    { name: 'Dr. A. Gupta', status: 'ON BREAK' },
  ]);

  const handleToggleDoctorStatus = (index) => {
    const statuses = ['AVAILABLE', 'IN SESSION', 'ON BREAK'];
    setDoctorsStatus((prev) =>
      prev.map((doc, i) => {
        if (i === index) {
          const currentIdx = statuses.indexOf(doc.status);
          const nextStatus = statuses[(currentIdx + 1) % statuses.length];
          return { ...doc, status: nextStatus };
        }
        return doc;
      })
    );
  };

  return (
    <ReceptionistLayout activeTab="Queue Board">
      <div className="receptionist-queueboard-container space-y-8 animate-fadeIn">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Real-Time Queue Dashboard
            </h1>
            <p className="text-sm font-semibold text-slate-500 mt-1 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Update System Active
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-white rounded-2xl px-6 py-3 border border-slate-200 shadow-sm flex flex-col items-center">
              <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">WAITING</span>
              <span className="text-2xl font-black text-blue-600">5</span>
            </div>
            <div className="bg-white rounded-2xl px-6 py-3 border border-slate-200 shadow-sm flex flex-col items-center">
              <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">AVG. WAIT</span>
              <span className="text-2xl font-black text-slate-900">18m</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* NOW SERVING CARD */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold tracking-widest text-slate-400 uppercase">TOKEN NUMBER</span>
                <div className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-extrabold uppercase">
                  NOW SERVING
                </div>
              </div>
              <div className="text-6xl sm:text-7xl font-black text-blue-600 tracking-tight my-4">B-108</div>
              <div className="flex items-center gap-4 py-4 my-2 border-t border-slate-100">
                <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white font-black text-xl flex items-center justify-center">
                  EV
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 leading-tight">Dr. Elena Vance</h3>
                  <p className="text-xs font-semibold text-slate-500 mt-0.5">Cardiology • Room 402B</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl p-5 shadow-lg space-y-2">
              <span className="text-xs font-bold uppercase">AI Flow Prediction</span>
              <h4 className="text-xl font-black">Next token in 04:22</h4>
              <p className="text-xs text-blue-100">Based on historical consultation velocity.</p>
            </div>
          </div>

          {/* QUEUE PIPELINE */}
          <div className="lg:col-span-4 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <h2 className="text-xl font-bold text-slate-900 pb-2 border-b border-slate-100">Queue Pipeline</h2>
            <div className="space-y-3.5">
              {[
                { token: 'B-109', sub: 'General Checkup', wait: '~8 mins' },
                { token: 'B-110', sub: 'Follow-up', wait: '~15 mins' },
                { token: 'B-111', sub: 'Consultation', wait: '~24 mins' },
                { token: 'B-112', sub: 'Diagnostics', wait: '~32 mins' },
              ].map((item) => (
                <div key={item.token} className="pipeline-item-hover p-4 rounded-2xl border border-slate-100 bg-slate-50/40 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1.5 bg-blue-100 text-blue-700 font-black rounded-xl text-sm">
                      {item.token}
                    </span>
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">Waiting</span>
                      <span className="text-[11px] text-slate-400 font-medium">{item.sub}</span>
                    </div>
                  </div>
                  <span className="text-sm font-extrabold text-orange-600">{item.wait}</span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-red-50/70 border border-red-200/80 rounded-3xl p-5 shadow-sm space-y-3">
              <h3 className="text-base font-bold text-red-600">Emergency Queue</h3>
              <div className="bg-white rounded-2xl p-3.5 border border-red-100 flex items-center justify-between shadow-sm">
                <span className="text-xs font-black text-slate-900">Token E-04 (TRAUMA WARD)</span>
                <span className="px-2 py-0.5 bg-red-100 text-red-600 rounded text-[10px] font-black">CRITICAL</span>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h4 className="text-xs font-bold uppercase text-slate-400">Doctor Availability</h4>
              <div className="space-y-3">
                {doctorsStatus.map((doc, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleToggleDoctorStatus(idx)}
                    className="flex items-center justify-between text-xs p-2 hover:bg-slate-50 rounded-xl cursor-pointer"
                  >
                    <span className="font-bold text-slate-800">{doc.name}</span>
                    <span
                      className={`px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase ${
                        doc.status === 'AVAILABLE'
                          ? 'bg-emerald-50 text-emerald-600'
                          : doc.status === 'IN SESSION'
                          ? 'bg-rose-50 text-rose-600'
                          : 'bg-amber-50 text-amber-600'
                      }`}
                    >
                      {doc.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ReceptionistLayout>
  );
}
