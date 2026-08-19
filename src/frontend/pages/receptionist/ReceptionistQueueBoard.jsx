// ============================================================
//  ReceptionistQueueBoard.jsx  –  Specialization & Doctor Categorized Queue Board
// ============================================================

import React, { useState, useEffect } from 'react';
import ReceptionistLayout from '../../components/receptionist/ReceptionistLayout';
import '../../style/receptionist/ReceptionistQueueBoard.css';

export default function ReceptionistQueueBoard() {
  const [doctorsList, setDoctorsList] = useState([]);
  const [queuesList, setQueuesList] = useState([]);
  const [visitsList, setVisitsList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Specialization Filter State
  const [selectedSpecialization, setSelectedSpecialization] = useState('All');

  const fetchData = () => {
    setLoading(true);
    Promise.all([
      fetch("http://localhost:8000/doctors").then((r) => r.json()),
      fetch("http://localhost:8000/queues").then((r) => r.json()),
      fetch("http://localhost:8000/visits").then((r) => r.json()),
      fetch("http://localhost:8000/patients").then((r) => r.json()),
      fetch("http://localhost:8000/symptoms").then((r) => r.json())
    ])
      .then(([docs, queues, visits, patients, symptoms]) => {
        if (Array.isArray(docs)) setDoctorsList(docs);
        if (Array.isArray(visits)) setVisitsList(visits);

        const visitsMap = Array.isArray(visits) ? Object.fromEntries(visits.map((v) => [v.vid, v])) : {};
        const patientsMap = Array.isArray(patients) ? Object.fromEntries(patients.map((p) => [p.pid, p])) : {};
        const doctorsMap = Array.isArray(docs) ? Object.fromEntries(docs.map((d) => [d.did, d])) : {};
        const symptomsMap = Array.isArray(symptoms) ? Object.fromEntries(symptoms.map((s) => [s.sid, s])) : {};

        if (Array.isArray(queues)) {
          const enrichedQueues = queues.map((q) => {
            const v = visitsMap[q.vid] || {};
            const p = patientsMap[v.pid] || {};
            const d = doctorsMap[v.did] || {};
            const s = symptomsMap[v.sid] || {};

            return {
              ...q,
              did: v.did || q.did || (docs.length > 0 ? docs[0].did : 1),
              token_number: v.token || q.token_number || (100 + q.qid),
              patient_name: p.name || v.patient_name || `Patient #${v.pid || 1}`,
              patient_contact: p.contact || '',
              patient_age: p.age || '',
              patient_gender: p.gender || '',
              doctor_name: d.name || 'Doctor',
              specialization: d.specialization || 'General Medicine',
              priority: s.priority || q.priority || 'Low',
              priority_score: q.priority_score || (s ? s.priority_score : 10) || 10
            };
          });

          setQueuesList(enrichedQueues);
        }
      })
      .catch((err) => console.error("Error loading queue board data:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000); // Auto-refresh every 10s
    return () => clearInterval(interval);
  }, []);

  // Extract unique specializations
  const specializations = [
    'All',
    ...Array.from(new Set(doctorsList.map((d) => d.specialization).filter(Boolean)))
  ];

  // Helper: Count waiting patients per department
  const getDeptQueueCount = (spec) => {
    if (spec === 'All') return queuesList.length;
    const docIds = doctorsList.filter((d) => d.specialization === spec).map((d) => d.did);
    return queuesList.filter((q) => docIds.includes(q.did)).length;
  };

  // Filtered Doctor Lanes
  const filteredDoctors = selectedSpecialization === 'All'
    ? doctorsList
    : doctorsList.filter((d) => d.specialization === selectedSpecialization);

  // Overall Queue Stats
  const totalWaiting = queuesList.filter((q) => q.status !== 'Completed').length;
  const criticalPatients = queuesList.filter((q) => q.priority === 'Emergency' || q.priority === 'High' || q.priority_score >= 70);
  const avgWaitTime = queuesList.length > 0
    ? Math.round(queuesList.reduce((acc, q) => acc + (q.estimated_wait_time || 0), 0) / queuesList.length)
    : 10;

  // Handle Call Next Patient
  const handleCallNext = (docId) => {
    const docQueues = queuesList.filter((q) => q.did === docId && q.status !== 'Completed');
    if (docQueues.length === 0) {
      alert("No waiting patients for this doctor.");
      return;
    }
    const nextToken = docQueues[0].token_number;
    const pName = docQueues[0].patient_name;
    alert(`Calling Token #${nextToken} (${pName}) for Doctor ID #${docId}...`);
    fetchData();
  };

  return (
    <ReceptionistLayout activeTab="Queue Board">
      <div className="receptionist-queueboard-container space-y-6 animate-fadeIn">

        {/* Top Header & Live KPI Dashboard Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">OPD Command Board</h1>
              <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 animate-pulse" title="Live Auto-Sync Active"></span>
            </div>
            <p className="text-base font-semibold text-slate-600 mt-1">
              Real-time patient queues categorized by Doctor &amp; Specialization.
            </p>
          </div>

          {/* KPI Summary Cards */}
          <div className="flex items-center gap-3">
            <div className="bg-white rounded-2xl px-5 py-3 border border-slate-200 shadow-sm flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-black text-xl">
                👥
              </div>
              <div>
                <span className="text-xs font-black text-slate-400 uppercase tracking-wider block">TOTAL IN QUEUE</span>
                <span className="text-2xl font-black text-slate-900">{totalWaiting} Patients</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl px-5 py-3 border border-red-200 shadow-sm flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-black text-xl">
                🚨
              </div>
              <div>
                <span className="text-xs font-black text-slate-400 uppercase tracking-wider block">CRITICAL PATIENTS</span>
                <span className="text-2xl font-black text-red-600">{criticalPatients.length} High Priority</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl px-5 py-3 border border-slate-200 shadow-sm flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-xl">
                ⏱️
              </div>
              <div>
                <span className="text-xs font-black text-slate-400 uppercase tracking-wider block">AVG. WAIT TIME</span>
                <span className="text-2xl font-black text-slate-900">~{avgWaitTime} mins</span>
              </div>
            </div>
          </div>
        </div>

        {/* 🚨 CRITICAL PATIENTS SINGLE-LINE ALERT BANNER */}
        {criticalPatients.length > 0 && (
          <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white rounded-2xl px-5 py-3 shadow-md flex items-center justify-between gap-4 overflow-hidden">
            <div className="flex items-center gap-2 shrink-0">
              <span className="material-symbols-outlined text-xl text-yellow-300 animate-pulse">warning</span>
              <span className="text-xs font-black uppercase tracking-wider bg-red-800/60 px-2.5 py-1 rounded-lg border border-red-400/30">
                🚨 CRITICAL ALERT ({criticalPatients.length}):
              </span>
            </div>

            <div className="flex items-center gap-3 overflow-x-auto whitespace-nowrap scrollbar-none py-0.5">
              {criticalPatients.map((item) => (
                <div key={item.qid} className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-3 py-1.5 rounded-xl text-xs shrink-0">
                  <span className="font-black text-yellow-300">#{item.token_number}</span>
                  <span className="font-black text-white">{item.patient_name}</span>
                  <span className="px-2 py-0.5 bg-red-500 text-white font-black text-[10px] rounded-md uppercase">
                    {item.priority} (Score: {item.priority_score})
                  </span>
                  <span className="text-red-100 font-semibold">• {item.doctor_name} ({item.specialization})</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Specialization Filter Pills Bar */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            <span className="text-sm font-black text-slate-700 uppercase tracking-wider px-2">FILTER BY DEPARTMENT:</span>
            {specializations.map((spec) => {
              const count = getDeptQueueCount(spec);
              const isActive = selectedSpecialization === spec;
              return (
                <button
                  key={spec}
                  onClick={() => setSelectedSpecialization(spec)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-black transition-all flex items-center gap-2 whitespace-nowrap ${isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                >
                  <span>{spec}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-extrabold ${isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-800'
                      }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <button
            onClick={fetchData}
            title="Refresh Live Queues"
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-black text-slate-700 flex items-center gap-1.5 transition-colors"
          >
            <span className={`material-symbols-outlined text-base ${loading ? 'animate-spin' : ''}`}>sync</span>
            Refresh Board
          </button>
        </div>

        {/* Doctor Queue Lanes Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredDoctors.map((doc) => {
            // Get all queue items for this doctor
            const docQueues = queuesList.filter((q) => q.did === doc.did && q.status !== 'Completed');

            // Sort by Emergency priority first, then queue position
            const sortedDocQueues = [...docQueues].sort((a, b) => {
              const aPrio = a.priority === 'Emergency' ? 100 : (a.priority === 'High' ? 50 : 0);
              const bPrio = b.priority === 'Emergency' ? 100 : (b.priority === 'High' ? 50 : 0);
              if (aPrio !== bPrio) return bPrio - aPrio;
              return (a.queue_position || 0) - (b.queue_position || 0);
            });

            const servingItem = sortedDocQueues[0];
            const waitingItems = sortedDocQueues.slice(1);

            // Flexible status check so active doctors never falsely display OFFLINE
            const docStatLower = (doc.status || '').toLowerCase();
            const isDoctorActive = !doc.status || docStatLower === 'active' || docStatLower === 'available' || docStatLower === 'on-duty';

            return (
              <div
                key={doc.did}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between space-y-6 hover:shadow-md transition-shadow"
              >
                {/* Doctor Lane Header */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 font-black text-xl flex items-center justify-center">
                        👨‍⚕️
                      </div>
                      <div>
                        <h3 className="font-black text-slate-900 text-lg leading-tight">{doc.name}</h3>
                        <span className="text-sm font-bold text-blue-600 block">{doc.specialization}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-black uppercase block ${isDoctorActive ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700'
                          }`}
                      >
                        {isDoctorActive ? '• IN CABIN' : '• OFFLINE'}
                      </span>
                      <span className="text-xs font-bold text-slate-500 mt-1 block">
                        Queue Load: <strong className="text-slate-900">{docQueues.length} Patients</strong>
                      </span>
                    </div>
                  </div>

                  {/* Currently Serving Section */}
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-slate-500 uppercase tracking-wider">NOW SERVING IN CABIN</span>
                      <span className="px-2.5 py-0.5 bg-blue-100 text-blue-800 font-black rounded-full text-xs">
                        CURRENT TOKEN
                      </span>
                    </div>

                    {servingItem ? (
                      <div className="flex items-center justify-between gap-2 pt-1">
                        <div>
                          <div className="text-3xl font-black text-blue-600">#{servingItem.token_number}</div>
                          <p className="text-base font-black text-slate-900 mt-0.5">
                            {servingItem.patient_name}
                          </p>
                          <div className="mt-1 flex items-center gap-1.5">
                            <span className={`px-2 py-0.5 rounded text-xs font-black uppercase ${servingItem.priority === 'Emergency'
                                ? 'bg-red-600 text-white animate-pulse'
                                : servingItem.priority === 'High'
                                  ? 'bg-amber-500 text-white'
                                  : servingItem.priority === 'Medium'
                                    ? 'bg-yellow-500 text-white'
                                    : 'bg-blue-100 text-blue-800'
                              }`}>
                              {servingItem.priority || 'Low'}
                            </span>
                            <span className="text-xs text-slate-500 font-bold">(Score: {servingItem.priority_score || 10})</span>
                          </div>
                        </div>

                        <button
                          onClick={() => handleCallNext(doc.did)}
                          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 shrink-0"
                        >
                          <span className="material-symbols-outlined text-base">volume_up</span>
                          Call Next
                        </button>
                      </div>
                    ) : (
                      <p className="text-xs font-bold text-slate-400 py-3 text-center">No active patient serving right now.</p>
                    )}
                  </div>

                  {/* Waiting Queue Pipeline Section */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-black text-slate-500 px-1">
                      <span>WAITING PATIENTS ({waitingItems.length})</span>
                      <span>EST. WAIT</span>
                    </div>

                    <div className="space-y-2.5 max-h-[260px] overflow-y-auto pr-1">
                      {waitingItems.map((item, idx) => {
                        const isEmerg = item.priority === 'Emergency';
                        const isHighPrio = item.priority === 'High';
                        const isMedPrio = item.priority === 'Medium';

                        return (
                          <div
                            key={item.qid}
                            className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between ${isEmerg
                                ? 'bg-red-50 border-2 border-red-400 shadow-sm ring-1 ring-red-400/20'
                                : isHighPrio
                                  ? 'bg-amber-50 border-2 border-amber-300'
                                  : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                              }`}
                          >
                            <div className="flex items-center gap-3">
                              <span className={`font-black px-2.5 py-1 rounded-xl text-sm border ${isEmerg ? 'bg-red-600 text-white border-red-600' : 'bg-white text-slate-900 border-slate-200'
                                }`}>
                                #{item.token_number}
                              </span>
                              <div>
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span className={`font-black text-sm leading-tight ${isEmerg ? 'text-red-950' : 'text-slate-900'}`}>
                                    {item.patient_name}
                                  </span>
                                  {/* HIGH VISIBILITY PRIORITY LEVEL BADGE */}
                                  <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${isEmerg
                                      ? 'bg-red-600 text-white animate-pulse shadow-sm'
                                      : isHighPrio
                                        ? 'bg-amber-500 text-white'
                                        : isMedPrio
                                          ? 'bg-yellow-500 text-white'
                                          : 'bg-blue-100 text-blue-800'
                                    }`}>
                                    {item.priority || 'Low'}
                                  </span>
                                </div>
                                <span className="text-xs font-bold text-slate-500 block mt-0.5">
                                  Pos: #{item.queue_position || idx + 2} • Score: {item.priority_score || 10}
                                </span>
                              </div>
                            </div>

                            <span className="font-black text-slate-800 text-sm whitespace-nowrap">~{item.estimated_wait_time || 10}m</span>
                          </div>
                        );
                      })}

                      {waitingItems.length === 0 && (
                        <p className="text-center text-xs font-semibold text-slate-400 py-4">No waiting queue for this doctor.</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Doctor Lane Footer */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-bold">
                  <span>Cabin Room #{doc.did}</span>
                  <span className="text-slate-700">{docQueues.length} Total Patients</span>
                </div>
              </div>
            );
          })}

          {filteredDoctors.length === 0 && (
            <div className="col-span-full py-16 bg-white rounded-3xl border border-slate-200 text-center space-y-2">
              <span className="material-symbols-outlined text-4xl text-slate-300">medical_services</span>
              <h4 className="text-base font-bold text-slate-700">No doctors registered under this specialization.</h4>
              <p className="text-xs text-slate-400">Select another specialization tab above to view active doctor queues.</p>
            </div>
          )}
        </div>

      </div>
    </ReceptionistLayout>
  );
}
