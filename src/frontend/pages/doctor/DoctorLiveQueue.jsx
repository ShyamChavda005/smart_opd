// ============================================================
//  DoctorLiveQueue.jsx  –  Doctor Live Queue Board Page
// ============================================================

import React, { useState } from 'react';
import DoctorLayout from '../../components/doctor/DoctorLayout';
import '../../style/doctor/DoctorLiveQueue.css';

export default function DoctorLiveQueue() {
  const [roomNumber] = useState('Room 402B');
  const [appointments, setAppointments] = useState([
    {
      token: 'T-104',
      name: 'Anita Rao',
      phone: '+91 98765 43210',
      pid: '45229',
      reason: 'Chest Pain',
      status: 'CONSULTING',
      statusColor: 'blue',
      time: '10:15 AM',
    },
    {
      token: 'T-105',
      name: 'Rahul Kapoor',
      phone: '+91 91234 56789',
      pid: '45231',
      reason: 'Hypertension Follow-up',
      status: 'WAITING',
      statusColor: 'orange',
      time: '10:30 AM',
    },
    {
      token: 'E-02',
      name: 'Suresh Das',
      phone: '+91 99887 76655',
      pid: '45235',
      reason: 'Acute Dyspnea (Emergency)',
      status: 'URGENT',
      statusColor: 'red',
      time: '10:45 AM',
    },
    {
      token: 'T-106',
      name: 'Priya Nair',
      phone: '+91 88776 65544',
      pid: '45240',
      reason: 'Routine ECG Check',
      status: 'WAITING',
      statusColor: 'orange',
      time: '11:00 AM',
    },
  ]);

  const handleCallNext = () => {
    const nextPt = appointments.find((a) => a.status === 'WAITING' || a.status === 'URGENT');
    if (!nextPt) {
      alert('No more waiting patients!');
      return;
    }
    setAppointments((prev) =>
      prev.map((item) =>
        item.token === nextPt.token
          ? { ...item, status: 'CONSULTING', statusColor: 'blue' }
          : item
      )
    );
  };

  const handleComplete = (token) => {
    setAppointments((prev) =>
      prev.map((item) =>
        item.token === token
          ? { ...item, status: 'COMPLETED', statusColor: 'emerald' }
          : item
      )
    );
  };

  return (
    <DoctorLayout activeTab="Live Queue">
      <div className="doctor-live-queue-container bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6 animate-fadeIn">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-2xl font-bold text-slate-900">Live OPD Queue Board</h3>
            <p className="text-sm text-slate-500 mt-0.5">Real-time consultation queue management for {roomNumber}</p>
          </div>
          <button
            onClick={handleCallNext}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-base">play_arrow</span>
            Call Next Patient
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {appointments.map((item, idx) => (
            <div
              key={idx}
              className={`p-5 rounded-2xl border transition-all ${
                item.status === 'CONSULTING'
                  ? 'queue-card-consulting bg-blue-50/80'
                  : item.status === 'URGENT'
                  ? 'queue-card-urgent'
                  : 'bg-slate-50/50 border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl font-black text-blue-600">{item.token}</span>
                <span
                  className={`text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider ${
                    item.status === 'CONSULTING'
                      ? 'bg-blue-600 text-white'
                      : item.status === 'URGENT'
                      ? 'bg-red-600 text-white'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {item.status}
                </span>
              </div>
              <h4 className="text-lg font-bold text-slate-900">{item.name}</h4>
              <p className="text-xs text-slate-500 mt-0.5">PID: {item.pid} • Reason: {item.reason}</p>
              <p className="text-xs text-slate-600 font-medium mt-1">Mobile: {item.phone}</p>
              <div className="pt-4 mt-4 border-t border-slate-200/60 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">{item.time}</span>
                {item.status === 'CONSULTING' ? (
                  <button
                    onClick={() => handleComplete(item.token)}
                    className="px-4 py-1.5 bg-emerald-600 text-white font-bold text-xs rounded-lg shadow-sm hover:bg-emerald-700"
                  >
                    Mark Complete
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setAppointments((prev) =>
                        prev.map((pt) =>
                          pt.token === item.token
                            ? { ...pt, status: 'CONSULTING', statusColor: 'blue' }
                            : pt
                        )
                      );
                    }}
                    className="px-4 py-1.5 bg-blue-600 text-white font-bold text-xs rounded-lg shadow-sm hover:bg-blue-700"
                  >
                    Call to Cabin
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </DoctorLayout>
  );
}
