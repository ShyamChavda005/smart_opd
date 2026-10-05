// ============================================================
//  DoctorOverview.jsx  –  Doctor Dashboard Overview Page (Dynamic)
// ============================================================

import React, { useState, useEffect, useCallback } from 'react';
import DoctorLayout from '../../components/doctor/DoctorLayout';
import { getAuthPayload, getAuthHeaders } from '../../auth';
import '../../style/doctor/DoctorOverview.css';

const API = 'http://localhost:8000';

export default function DoctorOverview() {
  const payload = getAuthPayload();
  const doctorId = payload?.uid;

  const [doctorData, setDoctorData] = useState(null);
  const [servingPatient, setServingPatient] = useState(null);
  const [calledPatient, setCalledPatient] = useState(null);
  const [waitingList, setWaitingList] = useState([]);
  const [completedCount, setCompletedCount] = useState(0);
  const [skippedList, setSkippedList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Prescription state
  const [rxDiagnosis, setRxDiagnosis] = useState('');
  const [rxMedicines, setRxMedicines] = useState('');
  const [rxInstructions, setRxInstructions] = useState('');

  // Build a unified appointments list from live queue data
  const allAppointments = [
    ...(servingPatient ? [{ ...servingPatient, displayStatus: 'SERVING', statusColor: 'blue' }] : []),
    ...(calledPatient ? [{ ...calledPatient, displayStatus: 'CALLED', statusColor: 'sky' }] : []),
    ...waitingList.map(w => ({
      ...w,
      displayStatus: w.priority === 'Emergency' ? 'URGENT' : 'WAITING',
      statusColor: w.priority === 'Emergency' ? 'red' : 'orange'
    })),
  ];

  const pendingCount = allAppointments.length;
  const totalToday = pendingCount + completedCount;

  const fetchQueueData = useCallback(async () => {
    if (!doctorId) return;
    try {
      const res = await fetch(`${API}/queues/board`, { headers: getAuthHeaders() });
      if (!res.ok) throw new Error('Failed to fetch queue');
      const board = await res.json();

      // Find this doctor's board entry
      const myBoard = board.find(b => b.doctor?.did === doctorId);
      if (myBoard) {
        setDoctorData(myBoard.doctor);
        setServingPatient(myBoard.serving || null);
        setCalledPatient(myBoard.called || null);
        setWaitingList(myBoard.waiting || []);
        setCompletedCount(myBoard.completed_count || 0);
        setSkippedList(myBoard.skipped || []);
      } else {
        setServingPatient(null);
        setCalledPatient(null);
        setWaitingList([]);
        setCompletedCount(0);
        setSkippedList([]);
      }
    } catch (err) {
      console.error('Queue fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [doctorId]);

  useEffect(() => {
    fetchQueueData();
    const interval = setInterval(fetchQueueData, 6000);
    return () => clearInterval(interval);
  }, [fetchQueueData]);

  // Queue action helpers
  const handleCallNext = async () => {
    if (!doctorId || actionLoading) return;
    setActionLoading(true);
    try {
      const res = await fetch(`${API}/queue/call-next/${doctorId}`, {
        method: 'POST', headers: getAuthHeaders()
      });
      const data = await res.json();
      if (data.status === 'busy') {
        alert(data.message);
      }
      await fetchQueueData();
    } catch (err) {
      console.error('Call next error:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleServe = async (qid) => {
    if (actionLoading) return;
    setActionLoading(true);
    try {
      await fetch(`${API}/queue/serve/${qid}`, {
        method: 'POST', headers: getAuthHeaders()
      });
      await fetchQueueData();
    } catch (err) {
      console.error('Serve error:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleComplete = async (qid) => {
    if (actionLoading) return;
    setActionLoading(true);
    try {
      await fetch(`${API}/queue/complete/${qid}`, {
        method: 'POST', headers: getAuthHeaders()
      });
      setRxDiagnosis('');
      setRxMedicines('');
      setRxInstructions('');
      await fetchQueueData();
    } catch (err) {
      console.error('Complete error:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleSkip = async (qid) => {
    if (actionLoading) return;
    setActionLoading(true);
    try {
      await fetch(`${API}/queue/skip/${qid}`, {
        method: 'POST', headers: getAuthHeaders()
      });
      await fetchQueueData();
    } catch (err) {
      console.error('Skip error:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleRecall = async (qid) => {
    if (actionLoading) return;
    setActionLoading(true);
    try {
      await fetch(`${API}/queue/recall/${qid}`, {
        method: 'POST', headers: getAuthHeaders()
      });
      await fetchQueueData();
    } catch (err) {
      console.error('Recall error:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleSavePrescription = (e) => {
    e.preventDefault();
    const patientName = servingPatient?.patient_name || calledPatient?.patient_name || 'Patient';
    alert(`E-Prescription generated & sent via SMS to ${patientName}`);
    setRxDiagnosis('');
    setRxMedicines('');
    setRxInstructions('');
  };

  // Semantic status badge styling
  const getStatusBadgeClass = (statusColor) => {
    switch (statusColor) {
      case 'blue': return 'bg-blue-50 text-blue-700 ring-blue-200/80';
      case 'sky': return 'bg-sky-50 text-sky-700 ring-sky-200/80';
      case 'red': return 'bg-red-50 text-red-700 ring-red-200/80';
      case 'emerald': return 'bg-emerald-50 text-emerald-700 ring-emerald-200/80';
      default: return 'bg-amber-50 text-amber-700 ring-amber-200/80';
    }
  };

  const getPriorityBadgeClass = (priority) => {
    switch (priority) {
      case 'Emergency': return 'bg-red-50 text-red-700 ring-red-200/80';
      case 'High': return 'bg-orange-50 text-orange-700 ring-orange-200/80';
      case 'Medium': return 'bg-amber-50 text-amber-700 ring-amber-200/80';
      default: return 'bg-slate-100 text-slate-600 ring-slate-200/80';
    }
  };

  const getInitials = (name) => {
    if (!name) return '??';
    const parts = name.trim().split(' ');
    return (parts[0]?.charAt(0) || '') + (parts[1]?.charAt(0) || '');
  };

  const currentPatient = servingPatient || calledPatient;
  const nextWaiting = waitingList.length > 0 ? waitingList[0] : null;
  const avgTime = doctorData?.avg_time || 12;
  const emergencyCount = waitingList.filter(w => w.priority === 'Emergency').length;

  if (loading) {
    return (
      <DoctorLayout activeTab="Overview">
        <div className="doctor-overview-container flex items-center justify-center py-24">
          <div className="text-center space-y-4">
            <div className="relative mx-auto h-12 w-12">
              <div className="absolute inset-0 rounded-full border-4 border-blue-100"></div>
              <div className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
            </div>
            <p className="text-sm font-semibold text-slate-500">Loading consultation queue...</p>
          </div>
        </div>
      </DoctorLayout>
    );
  }

  return (
    <DoctorLayout activeTab="Overview">
      <div className="doctor-overview-container space-y-6">
        {/* ---------- Live Queue Status Strip ---------- */}
        <section
          aria-label="Live queue status"
          className="dq-strip relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm transition-all duration-200 hover:shadow-md"
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-blue-700 ring-1 ring-inset ring-blue-100">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-500 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-600"></span>
                </span>
                Live OPD Queue
              </span>

              <dl className="flex flex-wrap items-center gap-x-8 gap-y-2 text-sm">
                <div className="min-w-0">
                  <dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Now Serving</dt>
                  <dd className="mt-0.5 truncate text-base font-bold text-slate-900">
                    {currentPatient ? (
                      <span className="inline-flex items-center gap-2">
                        <span className="rounded-lg bg-blue-50 px-2 py-0.5 text-xs font-bold text-blue-700">T-{currentPatient.token}</span>
                        <span>{currentPatient.patient_name}</span>
                      </span>
                    ) : (
                      <span className="text-slate-400 font-normal">None in progress</span>
                    )}
                  </dd>
                </div>

                <div className="min-w-0">
                  <dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Next Up</dt>
                  <dd className="mt-0.5 truncate text-base font-bold text-slate-900">
                    {nextWaiting ? (
                      <span className="inline-flex items-center gap-2">
                        <span className="rounded-lg bg-amber-50 px-2 py-0.5 text-xs font-bold text-amber-700">T-{nextWaiting.token}</span>
                        <span>{nextWaiting.patient_name}</span>
                      </span>
                    ) : (
                      <span className="text-slate-400 font-normal">Queue empty</span>
                    )}
                  </dd>
                </div>

                <div>
                  <dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Pending</dt>
                  <dd className="mt-0.5 text-base font-bold text-slate-900">{pendingCount} patients</dd>
                </div>
              </dl>
            </div>

            <button
              type="button"
              onClick={handleCallNext}
              disabled={actionLoading}
              className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 text-sm font-semibold text-white shadow-md shadow-blue-500/20 transition-all duration-150 hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg hover:shadow-blue-500/25 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[20px] leading-none">play_arrow</span>
              Call Next Patient
            </button>
          </div>
        </section>

        {/* ---------- Summary Metrics ---------- */}
        <section aria-label="Today's summary" className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {/* Today's Visits */}
          <div className="overview-card-hover rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm transition-all duration-200 hover:shadow-md">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Today's Visits</p>
                <p className="mt-2 text-3xl font-extrabold leading-none tracking-tight text-slate-900">{totalToday}</p>
                <p className="mt-2 text-xs text-slate-500">Cumulative patient entries</p>
              </div>
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 ring-1 ring-blue-100">
                <span className="material-symbols-outlined text-[22px] leading-none">calendar_today</span>
              </span>
            </div>
          </div>

          {/* Pending Queue */}
          <div className="overview-card-hover rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm transition-all duration-200 hover:shadow-md">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Pending Queue</p>
                <p className="mt-2 text-3xl font-extrabold leading-none tracking-tight text-slate-900">{pendingCount}</p>
                <p className="mt-2 text-xs text-slate-500">Awaiting consultation</p>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-1.5">
                {emergencyCount > 0 && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-[11px] font-bold text-red-700 ring-1 ring-inset ring-red-200">
                    <span className="material-symbols-outlined text-[13px] leading-none">emergency</span>
                    {emergencyCount} Urgent
                  </span>
                )}
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 ring-1 ring-amber-100">
                  <span className="material-symbols-outlined text-[22px] leading-none">hourglass_empty</span>
                </span>
              </div>
            </div>
          </div>

          {/* Completed Cases */}
          <div className="overview-card-hover rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm transition-all duration-200 hover:shadow-md">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Completed Cases</p>
                <p className="mt-2 text-3xl font-extrabold leading-none tracking-tight text-slate-900">{completedCount}</p>
                <p className="mt-2 text-xs text-slate-500">Successfully consulted</p>
              </div>
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100">
                <span className="material-symbols-outlined text-[22px] leading-none">check_circle</span>
              </span>
            </div>
          </div>

          {/* Avg. Consultation */}
          <div className="overview-card-hover rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm transition-all duration-200 hover:shadow-md">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Avg. Consultation</p>
                <p className="mt-2 text-3xl font-extrabold leading-none tracking-tight text-slate-900">
                  {avgTime}
                  <span className="ml-1 text-base font-semibold text-slate-400">min</span>
                </p>
                <p className="mt-2 text-xs text-slate-500">Target pacing per visit</p>
              </div>
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 ring-1 ring-indigo-100">
                <span className="material-symbols-outlined text-[22px] leading-none">timer</span>
              </span>
            </div>
          </div>
        </section>

        {/* ---------- Patient Queue ---------- */}
        <section className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-6 py-4">
            <div className="min-w-0">
              <h2 className="text-base font-bold text-slate-900">Patient Queue</h2>
              <p className="mt-0.5 text-xs text-slate-500">
                Active consultation queue <span className="px-1 text-slate-300">•</span>{' '}
                {doctorData?.specialization || 'General'}
              </p>
            </div>
            {skippedList.length > 0 && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 ring-1 ring-inset ring-amber-200">
                <span className="material-symbols-outlined text-[14px] leading-none">skip_next</span>
                {skippedList.length} Skipped
              </span>
            )}
          </div>

          {allAppointments.length === 0 && skippedList.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-slate-300 ring-1 ring-slate-100">
                <span className="material-symbols-outlined text-[28px] leading-none">how_to_reg</span>
              </span>
              <p className="mt-4 text-base font-bold text-slate-800">No patients in queue right now</p>
              <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">Patients will appear here automatically when registered and assigned by the reception desk</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[820px] border-collapse text-left">
                <caption className="sr-only">Patients currently in your consultation queue</caption>
                <thead>
                  <tr className="border-b border-slate-200/90 bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    <th scope="col" className="px-6 py-3.5">Token</th>
                    <th scope="col" className="px-4 py-3.5">Patient Details</th>
                    <th scope="col" className="px-4 py-3.5">Priority</th>
                    <th scope="col" className="px-4 py-3.5">Status</th>
                    <th scope="col" className="px-4 py-3.5">Est. Wait</th>
                    <th scope="col" className="px-6 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {allAppointments.map((row) => (
                    <tr key={row.qid} className="transition-colors duration-150 hover:bg-slate-50/80">
                      <td className="whitespace-nowrap px-6 py-4 align-middle">
                        <span
                          className={[
                            'inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-bold tabular-nums',
                            row.statusColor === 'red'
                              ? 'bg-red-50 text-red-700 ring-1 ring-inset ring-red-200'
                              : 'bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-200',
                          ].join(' ')}
                        >
                          T-{row.token}
                        </span>
                      </td>
                      <td className="px-4 py-4 align-middle">
                        <div className="flex items-center gap-3">
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-xs font-bold uppercase text-slate-600">
                            {getInitials(row.patient_name)}
                          </span>
                          <div className="min-w-0">
                            <p className="truncate font-semibold text-slate-900">{row.patient_name}</p>
                            <p className="mt-0.5 text-xs text-slate-500">
                              Score: <span className="font-semibold text-slate-700">{row.final_score}</span>
                              <span className="px-1 text-slate-300">•</span>
                              Bonus: <span className="text-emerald-600 font-semibold">+{row.waiting_bonus}</span>
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 align-middle">
                        <span
                          className={[
                            'inline-flex items-center rounded-lg px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider ring-1 ring-inset',
                            getPriorityBadgeClass(row.priority),
                          ].join(' ')}
                        >
                          {row.priority || 'Low'}
                        </span>
                      </td>
                      <td className="px-4 py-4 align-middle">
                        <span
                          className={[
                            'inline-flex items-center rounded-lg px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider ring-1 ring-inset',
                            getStatusBadgeClass(row.statusColor),
                          ].join(' ')}
                        >
                          {row.displayStatus}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 align-middle text-xs font-medium text-slate-600 tabular-nums">
                        {row.estimated_wait_time > 0 ? `~${row.estimated_wait_time} min` : '—'}
                      </td>
                      <td className="px-6 py-4 text-right align-middle">
                        <div className="flex items-center justify-end gap-2">
                          {row.displayStatus === 'CALLED' && (
                            <>
                              <button
                                type="button"
                                onClick={() => handleServe(row.qid)}
                                disabled={actionLoading}
                                className="inline-flex items-center gap-1 rounded-xl bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm transition-all duration-150 hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                <span className="material-symbols-outlined text-[15px] leading-none">stethoscope</span>
                                Start
                              </button>
                              <button
                                type="button"
                                onClick={() => handleSkip(row.qid)}
                                disabled={actionLoading}
                                className="rounded-xl border border-amber-200 bg-white px-3 py-1.5 text-xs font-semibold text-amber-700 transition-colors duration-150 hover:bg-amber-50 focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                Skip
                              </button>
                            </>
                          )}
                          {row.displayStatus === 'SERVING' && (
                            <button
                              type="button"
                              onClick={() => handleComplete(row.qid)}
                              disabled={actionLoading}
                              className="inline-flex items-center gap-1 rounded-xl bg-emerald-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm transition-all duration-150 hover:bg-emerald-700 focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <span className="material-symbols-outlined text-[15px] leading-none">check</span>
                              Complete
                            </button>
                          )}
                          {(row.displayStatus === 'WAITING' || row.displayStatus === 'URGENT') && (
                            <button
                              type="button"
                              onClick={() => handleSkip(row.qid)}
                              disabled={actionLoading}
                              className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition-colors duration-150 hover:bg-slate-50 hover:text-slate-900 focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              Skip
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}

                  {/* Skipped patients */}
                  {skippedList.map((row) => (
                    <tr key={row.qid} className="bg-slate-50/50 transition-colors duration-150 hover:bg-slate-50">
                      <td className="whitespace-nowrap px-6 py-4 align-middle">
                        <span className="inline-flex items-center rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold tabular-nums text-slate-500">
                          T-{row.token}
                        </span>
                      </td>
                      <td className="px-4 py-4 align-middle">
                        <div className="flex items-center gap-3">
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-xs font-semibold uppercase text-slate-400">
                            {getInitials(row.patient_name)}
                          </span>
                          <p className="truncate font-medium text-slate-500">{row.patient_name}</p>
                        </div>
                      </td>
                      <td className="px-4 py-4 align-middle">
                        <span className="inline-flex items-center rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-500 ring-1 ring-inset ring-slate-200">
                          {row.priority || 'Low'}
                        </span>
                      </td>
                      <td className="px-4 py-4 align-middle">
                        <span className="inline-flex items-center rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-500 ring-1 ring-inset ring-slate-200">
                          Skipped
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 align-middle text-xs text-slate-400 tabular-nums">—</td>
                      <td className="px-6 py-4 text-right align-middle">
                        <button
                          type="button"
                          onClick={() => handleRecall(row.qid)}
                          disabled={actionLoading}
                          className="rounded-xl border border-blue-200 bg-white px-3 py-1.5 text-xs font-semibold text-blue-700 transition-colors duration-150 hover:bg-blue-50 focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Recall
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* ---------- E-Prescription Form — only when serving ---------- */}
        {servingPatient && (
          <section className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-6 py-4">
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 ring-1 ring-blue-100">
                  <span className="material-symbols-outlined text-[20px] leading-none">edit_note</span>
                </span>
                <div>
                  <h2 className="truncate text-base font-bold text-slate-900">
                    Active Consultation Notes for {servingPatient.patient_name}
                  </h2>
                  <p className="text-xs text-slate-500">
                    Token #{servingPatient.token} <span className="px-1 text-slate-300">•</span> QID: {servingPatient.qid}
                  </p>
                </div>
              </div>
              <span className="shrink-0 rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 ring-1 ring-inset ring-blue-100">
                In Consultation
              </span>
            </div>

            <form onSubmit={handleSavePrescription} className="space-y-4 p-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label htmlFor="rx-diagnosis" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Diagnosis &amp; Clinical Observations
                  </label>
                  <textarea
                    id="rx-diagnosis"
                    rows={3}
                    value={rxDiagnosis}
                    onChange={(e) => setRxDiagnosis(e.target.value)}
                    placeholder="e.g. Mild Angina, Elevated Blood Pressure (140/90)"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/80 p-3.5 text-sm font-medium text-slate-800 outline-none transition-all duration-150 placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                  />
                </div>
                <div>
                  <label htmlFor="rx-medicines" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Prescribed Medicines &amp; Dosage Instructions
                  </label>
                  <textarea
                    id="rx-medicines"
                    rows={3}
                    value={rxMedicines}
                    onChange={(e) => setRxMedicines(e.target.value)}
                    placeholder="e.g. Tab. Amlodipine 5mg 1-0-1 (7 days)"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/80 p-3.5 text-sm font-medium text-slate-800 outline-none transition-all duration-150 placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pt-2">
                <div className="flex-1">
                  <label htmlFor="rx-instructions" className="sr-only">Special Advice</label>
                  <input
                    id="rx-instructions"
                    type="text"
                    value={rxInstructions}
                    onChange={(e) => setRxInstructions(e.target.value)}
                    placeholder="Special Advice: e.g. Low sodium diet, follow-up in 2 weeks"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-2.5 text-sm font-medium text-slate-800 outline-none transition-all duration-150 placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                  />
                </div>
                <button
                  type="submit"
                  className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 text-sm font-semibold text-white shadow-md shadow-blue-500/20 transition-all duration-150 hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg hover:shadow-blue-500/25 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
                >
                  <span className="material-symbols-outlined text-[20px] leading-none">print</span>
                  Save &amp; Send E-Prescription
                </button>
              </div>
            </form>
          </section>
        )}
      </div>
    </DoctorLayout>
  );
}