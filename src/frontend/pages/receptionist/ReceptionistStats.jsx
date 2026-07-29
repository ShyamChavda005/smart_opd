// ============================================================
//  ReceptionistStats.jsx  –  OPD Stats & Analytics Page
// ============================================================

import React from 'react';
import ReceptionistLayout from '../../components/receptionist/ReceptionistLayout';
import '../../style/receptionist/ReceptionistStats.css';

export default function ReceptionistStats() {
  return (
    <ReceptionistLayout activeTab="Stats">
      <div className="receptionist-stats-container space-y-6 animate-fadeIn">
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
          <h3 className="text-2xl font-bold text-slate-900">OPD Daily Throughput &amp; Analytics</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            <div className="stats-card-box p-6 rounded-2xl bg-blue-50/60 border border-blue-100 space-y-2">
              <span className="text-xs font-extrabold text-blue-600 uppercase">PEAK HOUR FLOW</span>
              <div className="text-3xl font-black text-slate-900">10:00 AM - 11:30 AM</div>
              <p className="text-xs text-slate-500">Highest token generation rate recorded today (42 tokens/hr)</p>
            </div>
            <div className="stats-card-box p-6 rounded-2xl bg-emerald-50/60 border border-emerald-100 space-y-2">
              <span className="text-xs font-extrabold text-emerald-600 uppercase">AVG CONSULTATION SPEED</span>
              <div className="text-3xl font-black text-slate-900">12.4 Mins</div>
              <p className="text-xs text-slate-500">Across 6 active doctor OPD cabins</p>
            </div>
            <div className="stats-card-box p-6 rounded-2xl bg-amber-50/60 border border-amber-100 space-y-2">
              <span className="text-xs font-extrabold text-amber-600 uppercase">SMS/WHATSAPP NOTIFICATIONS</span>
              <div className="text-3xl font-black text-slate-900">138 Delivered</div>
              <p className="text-xs text-slate-500">97.1% patient arrival timeliness rate</p>
            </div>
          </div>
        </div>
      </div>
    </ReceptionistLayout>
  );
}
