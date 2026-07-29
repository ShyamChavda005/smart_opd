// ============================================================
//  AdminReports.jsx  –  Admin Reports & Analytics Page
// ============================================================

import React, { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import '../../style/admin/AdminDashboard.css';

function AdminReports() {
  const [timeRange, setTimeRange] = useState('Today');

  const reportStats = [
    { label: 'Total OPD Patients', value: '1,428', change: '+14%', icon: 'groups', color: 'bg-blue-50 text-blue-600' },
    { label: 'Avg Wait Time', value: '18 min', change: '-22%', icon: 'schedule', color: 'bg-emerald-50 text-emerald-600' },
    { label: 'Completed Consultations', value: '1,280', change: '+18%', icon: 'task_alt', color: 'bg-indigo-50 text-indigo-600' },
    { label: 'Emergency Admissions', value: '48', change: '+2%', icon: 'e911_emergency', color: 'bg-rose-50 text-rose-600' },
  ];

  const departmentReports = [
    { name: 'General Medicine', tokens: 412, avgTime: '14 min', satisfaction: '4.8/5', status: 'Optimal' },
    { name: 'Cardiology', tokens: 284, avgTime: '22 min', satisfaction: '4.9/5', status: 'Busy' },
    { name: 'Pediatrics', tokens: 310, avgTime: '16 min', satisfaction: '4.7/5', status: 'Optimal' },
    { name: 'Orthopedics', tokens: 198, avgTime: '20 min', satisfaction: '4.8/5', status: 'Optimal' },
    { name: 'Neurology', tokens: 144, avgTime: '25 min', satisfaction: '4.9/5', status: 'Busy' },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8 animate-fadeIn p-2">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Hospital Analytics &amp; Reports</h1>
            <p className="text-sm text-slate-500 mt-1">
              Comprehensive report insights across OPD departments and consultation metrics
            </p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option>Today</option>
              <option>This Week</option>
              <option>This Month</option>
              <option>This Quarter</option>
            </select>
            <button
              onClick={() => alert(`Exporting ${timeRange} OPD Report as PDF/CSV...`)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-base">download</span>
              Export Report
            </button>
          </div>
        </div>

        {/* 4 Summary Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {reportStats.map((item, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{item.label}</p>
                <h3 className="text-3xl font-black text-slate-900 mb-1">{item.value}</h3>
                <span className="text-xs font-bold text-emerald-600">{item.change} vs previous period</span>
              </div>
              <div className={`w-12 h-12 rounded-2xl ${item.color} flex items-center justify-center`}>
                <span className="material-symbols-outlined text-2xl">{item.icon}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Department Breakdown Table */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <h3 className="text-xl font-bold text-slate-900">Department Performance Breakdown</h3>
            <span className="text-xs font-bold text-slate-400 uppercase">Live OPD Data ({timeRange})</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-xs font-extrabold uppercase text-slate-400 tracking-wider">
                  <th className="py-3 px-4">DEPARTMENT</th>
                  <th className="py-3 px-4">TOTAL TOKENS</th>
                  <th className="py-3 px-4">AVG CONSULT TIME</th>
                  <th className="py-3 px-4">PATIENT RATING</th>
                  <th className="py-3 px-4 text-right">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {departmentReports.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-4 font-bold text-slate-900">{row.name}</td>
                    <td className="py-4 px-4 font-black text-blue-600">{row.tokens}</td>
                    <td className="py-4 px-4 text-slate-600 font-semibold">{row.avgTime}</td>
                    <td className="py-4 px-4 text-slate-600 font-semibold">{row.satisfaction}</td>
                    <td className="py-4 px-4 text-right">
                      <span
                        className={`text-[10px] font-black px-3 py-1 rounded-full uppercase ${
                          row.status === 'Optimal' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminReports;
