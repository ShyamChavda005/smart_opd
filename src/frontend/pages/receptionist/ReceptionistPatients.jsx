// ============================================================
//  ReceptionistPatients.jsx  –  Patient Database Page
// ============================================================

import React, { useState } from 'react';
import ReceptionistLayout from '../../components/receptionist/ReceptionistLayout';
import '../../style/receptionist/ReceptionistPatients.css';

export default function ReceptionistPatients() {
  const [searchQuery, setSearchQuery] = useState('');
  const [queueList] = useState([
    {
      token: '#481',
      name: 'Priya Sharma',
      dob: '1996-04-12',
      age: '30',
      gender: 'Female',
      phone: '+91 98765 43210',
      address: 'B-104, MG Road, Mumbai, Maharashtra',
      dept: 'CARDIOLOGY',
      status: 'Waiting',
    },
    {
      token: '#480',
      name: 'Rajesh Kumar',
      dob: '1988-11-20',
      age: '37',
      gender: 'Male',
      phone: '+91 91234 56789',
      address: '45 Park Street, Connaught Place, New Delhi',
      dept: 'EMERGENCY',
      status: 'Token Printed',
    },
    {
      token: '#479',
      name: 'Ananya Iyer',
      dob: '2018-02-15',
      age: '8',
      gender: 'Female',
      phone: '+91 99887 76655',
      address: '12 Anna Salai, T. Nagar, Chennai, Tamil Nadu',
      dept: 'PEDIATRICS',
      status: 'Waiting',
    },
    {
      token: '#478',
      name: 'David Chen',
      dob: '1992-08-05',
      age: '33',
      gender: 'Male',
      phone: '+91 88776 65544',
      address: '88 Indiranagar 100ft Road, Bengaluru',
      dept: 'GENERAL MED',
      status: 'Registered',
    },
  ]);

  const handlePrintSlip = (item) => {
    alert(`Printing OPD Slip: ${item.name} (${item.token})`);
  };

  return (
    <ReceptionistLayout activeTab="Patients">
      <div className="receptionist-patients-container bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6 animate-fadeIn">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <h3 className="text-2xl font-bold text-slate-900">Patient Database</h3>
            <p className="text-sm text-slate-500 mt-0.5">Search and view registered patients with complete demographic records.</p>
          </div>
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search name, phone, token..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
            />
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-xl">search</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50">
                <th className="py-3.5 px-4 rounded-l-xl">Token</th>
                <th className="py-3.5 px-4">Patient Name &amp; Demographics</th>
                <th className="py-3.5 px-4">Mobile</th>
                <th className="py-3.5 px-4">Address</th>
                <th className="py-3.5 px-4">Dept</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right rounded-r-xl">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {queueList
                .filter(
                  (p) =>
                    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    p.token.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    p.phone.includes(searchQuery)
                )
                .map((item, idx) => (
                  <tr key={idx} className="patient-table-row">
                    <td className="py-4 px-4 font-black text-blue-600">{item.token}</td>
                    <td className="py-4 px-4">
                      <span className="font-bold text-slate-900 block">{item.name}</span>
                      <span className="text-xs text-slate-500 font-medium">
                        {item.age} yrs • {item.gender} • DOB: {item.dob}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-slate-700 font-semibold">{item.phone}</td>
                    <td className="py-4 px-4 text-xs text-slate-500 max-w-[200px] truncate">{item.address}</td>
                    <td className="py-4 px-4 text-xs font-bold text-slate-600">{item.dept}</td>
                    <td className="py-4 px-4">
                      <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-extrabold rounded-full border border-emerald-100">
                        {item.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => handlePrintSlip(item)}
                        className="px-3 py-1.5 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors flex items-center gap-1 ml-auto"
                      >
                        <span className="material-symbols-outlined text-sm">print</span>
                        Print Slip
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </ReceptionistLayout>
  );
}
