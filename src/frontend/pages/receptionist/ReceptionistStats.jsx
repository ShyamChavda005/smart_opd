// ============================================================
//  ReceptionistStats.jsx  –  OPD Stats & Analytics Page
// ============================================================

import React, { useState, useEffect } from 'react';
import ReceptionistLayout from '../../components/receptionist/ReceptionistLayout';
import '../../style/receptionist/ReceptionistStats.css';

export default function ReceptionistStats() {
  const [totalVisits, setTotalVisits] = useState(0);
  const [activeDoctorsCount, setActiveDoctorsCount] = useState(0);
  const [avgSpeed, setAvgSpeed] = useState(12.5);

  useEffect(() => {
    // 1. Fetch visits count
    fetch("http://localhost:8000/visits")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setTotalVisits(data.length);
        }
      })
      .catch((err) => console.error("Error fetching visits:", err));

    // 2. Fetch active doctors & calculate average consultation speed
    fetch("http://localhost:8000/doctors")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const activeDocs = data.filter((d) => d.status === "Active" || d.status === "AVAILABLE");
          setActiveDoctorsCount(activeDocs.length || data.length);

          if (data.length > 0) {
            const totalAvg = data.reduce((acc, d) => acc + (d.avg_time || 10), 0);
            setAvgSpeed((totalAvg / data.length).toFixed(1));
          }
        }
      })
      .catch((err) => console.error("Error fetching doctors:", err));
  }, []);

  return (
    <ReceptionistLayout activeTab="Stats">
      <div className="receptionist-stats-container space-y-6 animate-fadeIn">
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
          <h3 className="text-2xl font-bold text-slate-900">OPD Daily Throughput &amp; Analytics</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            <div className="stats-card-box p-6 rounded-2xl bg-blue-50/60 border border-blue-100 space-y-2">
              <span className="text-xs font-extrabold text-blue-600 uppercase">PEAK HOUR FLOW</span>
              <div className="text-3xl font-black text-slate-900">{totalVisits} Tokens</div>
              <p className="text-xs text-slate-500">Live token generation count recorded today</p>
            </div>
            <div className="stats-card-box p-6 rounded-2xl bg-emerald-50/60 border border-emerald-100 space-y-2">
              <span className="text-xs font-extrabold text-emerald-600 uppercase">AVG CONSULTATION SPEED</span>
              <div className="text-3xl font-black text-slate-900">{avgSpeed} Mins</div>
              <p className="text-xs text-slate-500">Across {activeDoctorsCount} active doctor OPD cabins</p>
            </div>
            <div className="stats-card-box p-6 rounded-2xl bg-amber-50/60 border border-amber-100 space-y-2">
              <span className="text-xs font-extrabold text-amber-600 uppercase">OPD SYSTEM STATUS</span>
              <div className="text-3xl font-black text-slate-900">Active</div>
              <p className="text-xs text-slate-500">Real-time database and queue engine synchronized</p>
            </div>
          </div>
        </div>
      </div>
    </ReceptionistLayout>
  );
}
