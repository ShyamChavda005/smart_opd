// ============================================================
//  DoctorAnalytics.jsx  –  Doctor Productivity & Analytics Page
// ============================================================

import React from 'react';
import DoctorLayout from '../../components/doctor/DoctorLayout';
import '../../style/doctor/DoctorAnalytics.css';

export default function DoctorAnalytics() {
  return (
    <DoctorLayout activeTab="Analytics">
      <div className="doctor-analytics-container bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6 animate-fadeIn">
        <h3 className="text-2xl font-bold text-slate-900">Doctor Productivity &amp; OPD Analytics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          <div className="analytics-stat-card p-6 rounded-2xl bg-blue-50/60 border border-blue-100 space-y-2">
            <span className="text-xs font-extrabold text-blue-600 uppercase">AVG CONSULTATION TIME</span>
            <div className="text-3xl font-black text-slate-900">12.4 Mins</div>
            <p className="text-xs text-slate-500">Optimal pace for outpatient diagnosis</p>
          </div>
          <div className="analytics-stat-card p-6 rounded-2xl bg-emerald-50/60 border border-emerald-100 space-y-2">
            <span className="text-xs font-extrabold text-emerald-600 uppercase">PATIENT SATISFACTION</span>
            <div className="text-3xl font-black text-slate-900">4.9 / 5.0</div>
            <p className="text-xs text-slate-500">Based on 124 patient feedback ratings</p>
          </div>
          <div className="analytics-stat-card p-6 rounded-2xl bg-amber-50/60 border border-amber-100 space-y-2">
            <span className="text-xs font-extrabold text-amber-600 uppercase">QUEUE EFFICIENCY</span>
            <div className="text-3xl font-black text-slate-900">96.8%</div>
            <p className="text-xs text-slate-500">On-time consultation rate</p>
          </div>
        </div>
      </div>
    </DoctorLayout>
  );
}
