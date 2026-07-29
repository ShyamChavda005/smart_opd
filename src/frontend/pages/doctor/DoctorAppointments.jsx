// ============================================================
//  DoctorAppointments.jsx  –  Doctor Appointments Schedule Page
// ============================================================

import React, { useState } from 'react';
import DoctorLayout from '../../components/doctor/DoctorLayout';
import '../../style/doctor/DoctorAppointments.css';

export default function DoctorAppointments() {
  const [appointments] = useState([
    { token: 'T-104', name: 'Anita Rao', age: 45, gender: 'Female', reason: 'Chest Pain', time: '10:15 AM' },
    { token: 'T-105', name: 'Rahul Kapoor', age: 52, gender: 'Male', reason: 'Hypertension Follow-up', time: '10:30 AM' },
    { token: 'E-02', name: 'Suresh Das', age: 61, gender: 'Male', reason: 'Acute Dyspnea (Emergency)', time: '10:45 AM' },
    { token: 'T-106', name: 'Priya Nair', age: 38, gender: 'Female', reason: 'Routine ECG Check', time: '11:00 AM' },
    { token: 'T-107', name: 'Amit Patel', age: 49, gender: 'Male', reason: 'Arrhythmia Evaluation', time: '11:15 AM' },
  ]);

  return (
    <DoctorLayout activeTab="Appointments">
      <div className="doctor-appointments-container bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6 animate-fadeIn">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <h3 className="text-2xl font-bold text-slate-900">Today's Appointment Schedule</h3>
          <span className="text-xs font-bold text-slate-500">{appointments.length} Total Registered</span>
        </div>
        <div className="space-y-4">
          {appointments.map((item, idx) => (
            <div key={idx} className="appointment-item-card p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-extrabold text-blue-600 block">{item.token}</span>
                <h4 className="font-bold text-slate-900 text-base">{item.name}</h4>
                <p className="text-xs text-slate-500">{item.age} yrs • {item.gender} • {item.reason}</p>
              </div>
              <span className="px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-bold text-slate-700">
                {item.time}
              </span>
            </div>
          ))}
        </div>
      </div>
    </DoctorLayout>
  );
}
