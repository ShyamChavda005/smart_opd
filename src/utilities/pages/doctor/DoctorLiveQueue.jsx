// ============================================================
//  DoctorLiveQueue.jsx  –  Doctor Live Queue Board Page (Dynamic)
// ============================================================

import React, { useState, useEffect, useCallback } from 'react';
import DoctorLayout from '../../components/doctor/DoctorLayout';
import { getAuthPayload, getAuthHeaders } from '../../auth';
import '../../style/doctor/DoctorLiveQueue.css';

const API = 'http://localhost:8000';

export default function DoctorLiveQueue() {
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

  const fetchQueueData = useCallback(async () => {
    if (!doctorId) return;
    try {
      const res = await fetch(`${API}/queues/board?did=${doctorId}`, { headers: getAuthHeaders() });
      if (!res.ok) throw new Error('Failed to fetch queue');
      const board = await res.json();

      const myBoard = board.find(b => b.doctor?.did === doctorId) || board[0];
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

  const handleCallNext = async () => {
    if (!doctorId || actionLoading) return;
    setActionLoading(true);
    try {
      const res = await fetch(`${API}/queue/call-next/${doctorId}`, {
        method: 'POST', headers: getAuthHeaders()
      });
      const data = await res.json();
      if (data.status === 'busy') alert(data.message);
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
      await fetch(`${API}/queue/serve/${qid}`, { method: 'POST', headers: getAuthHeaders() });
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
      await fetch(`${API}/queue/complete/${qid}`, { method: 'POST', headers: getAuthHeaders() });
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
      await fetch(`${API}/queue/skip/${qid}`, { method: 'POST', headers: getAuthHeaders() });
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
      await fetch(`${API}/queue/recall/${qid}`, { method: 'POST', headers: getAuthHeaders() });
      await fetchQueueData();
    } catch (err) {
      console.error('Recall error:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return '??';
    const parts = name.trim().split(' ');
    return (parts[0]?.charAt(0) || '') + (parts[1]?.charAt(0) || '');
  };

  // Build all cards
  const allCards = [
    ...(servingPatient ? [{ ...servingPatient, displayStatus: 'SERVING', cardType: 'serving' }] : []),
    ...(calledPatient ? [{ ...calledPatient, displayStatus: 'CALLED', cardType: 'called' }] : []),
    ...waitingList.map(w => ({
      ...w,
      displayStatus: w.priority === 'Emergency' ? 'URGENT' : 'WAITING',
      cardType: w.priority === 'Emergency' ? 'urgent' : 'waiting'
    })),
    ...skippedList.map(s => ({ ...s, displayStatus: 'SKIPPED', cardType: 'skipped' }))
  ];

  const getCardClasses = (cardType) => {
    switch (cardType) {
      case 'serving': return 'queue-card-consulting border-blue-200 bg-white ring-1 ring-blue-100/80';
      case 'called': return 'queue-card-called border-sky-200 bg-white ring-1 ring-sky-100/80';
      case 'urgent': return 'queue-card-urgent border-red-200 bg-white ring-1 ring-red-100/80';
      case 'skipped': return 'queue-card-skipped border-slate-200 bg-slate-50/70';
      default: return 'border-slate-200/90 bg-white';
    }
  };

  const getStatusBadgeClasses = (cardType) => {
    switch (cardType) {
      case 'serving': return 'bg-blue-50 text-blue-700 ring-blue-200/80';
      case 'called': return 'bg-sky-50 text-sky-700 ring-sky-200/80';
      case 'urgent': return 'bg-red-50 text-red-700 ring-red-200/80';
      case 'skipped': return 'bg-slate-100 text-slate-500 ring-slate-200/80';
      default: return 'bg-amber-50 text-amber-700 ring-amber-200/80';
    }
  };

  if (loading) {
    return (
      <DoctorLayout activeTab="Live Queue">
        <div className="doctor-live-queue-container flex items-center justify-center py-24">
          <div className="text-center space-y-4">
            <div className="relative mx-auto h-12 w-12">
              <div className="absolute inset-0 rounded-full border-4 border-blue-100"></div>
              <div className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
            </div>
            <p className="text-sm font-semibold text-slate-500">Loading live queue board...</p>
          </div>
        </div>
      </DoctorLayout>
    );
  }

  return (
    <DoctorLayout activeTab="Live Queue">
      <div className="doctor-live-queue-container animate-fadeIn overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm">
        {/* ---------- Section header ---------- */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 px-6 py-4">
          <div className="min-w-0">
            <h2 className="text-base font-bold text-slate-900">Live OPD Queue Board</h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Real-time queue tracking <span className="px-1 text-slate-300">•</span>{' '}
              {doctorData?.specialization || 'General'} <span className="px-1 text-slate-300">•</span>{' '}
              {allCards.length} total entries
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2.5">
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 ring-1 ring-inset ring-emerald-200">
              {completedCount} Completed
            </span>
            <button
              type="button"
              onClick={handleCallNext}
              disabled={actionLoading}
              className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 text-sm font-semibold text-white shadow-md shadow-blue-500/20 transition-all duration-150 hover:from-blue-700 hover:to-indigo-700 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[18px] leading-none">play_arrow</span>
              Call Next Patient
            </button>
          </div>
        </div>

        {/* ---------- Board Cards Grid ---------- */}
        <div className="p-6">
          {allCards.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-slate-300 ring-1 ring-slate-100">
                <span className="material-symbols-outlined text-[28px] leading-none">queue</span>
              </span>
              <p className="mt-4 text-base font-bold text-slate-800">No patients in queue</p>
              <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">Patients will appear here in real-time when assigned by the receptionist</p>
            </div>
          ) : (
            <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {allCards.map((item) => (
                <li
                  key={item.qid}
                  className={`relative flex flex-col justify-between overflow-hidden rounded-2xl border p-5 transition-all duration-200 hover:shadow-md ${getCardClasses(item.cardType)}`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <span className="inline-flex items-center rounded-lg bg-blue-50 px-2.5 py-0.5 text-xs font-bold tabular-nums text-blue-700 ring-1 ring-inset ring-blue-100">
                          Token #{item.token}
                        </span>
                        <div className="mt-2 flex items-center gap-2.5">
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-xs font-bold text-slate-600">
                            {getInitials(item.patient_name)}
                          </span>
                          <p className="truncate text-base font-bold text-slate-900">{item.patient_name}</p>
                        </div>
                      </div>
                      <span
                        className={[
                          'inline-flex shrink-0 items-center rounded-lg px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ring-1 ring-inset',
                          getStatusBadgeClasses(item.cardType),
                        ].join(' ')}
                      >
                        {item.displayStatus}
                      </span>
                    </div>

                    <div className="mt-3.5 space-y-1.5 text-xs text-slate-500">
                      <p className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-semibold text-slate-700">Priority:</span> {item.priority || 'Low'}
                        <span className="text-slate-300">•</span>
                        <span>Score: <span className="font-semibold text-slate-700">{item.final_score}</span></span>
                        <span className="text-slate-300">•</span>
                        <span>Wait Bonus: <span className="text-emerald-600 font-semibold">+{item.waiting_bonus || 0}</span></span>
                      </p>
                      {item.patient_contact && (
                        <p className="flex items-center gap-1.5 text-slate-600">
                          <span className="material-symbols-outlined text-[14px] leading-none text-slate-400">call</span>
                          {item.patient_contact}
                        </p>
                      )}
                      {item.estimated_wait_time > 0 && item.cardType === 'waiting' && (
                        <p className="flex items-center gap-1.5 font-medium text-slate-600 tabular-nums">
                          <span className="material-symbols-outlined text-[14px] leading-none text-slate-400">schedule</span>
                          Est. wait: ~{item.estimated_wait_time} min
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-100 pt-3.5">
                    <span className="rounded-lg bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600 tabular-nums">
                      Pos #{item.queue_position || '—'}
                    </span>
                    <div className="flex items-center gap-2">
                      {item.cardType === 'serving' && (
                        <button
                          type="button"
                          onClick={() => handleComplete(item.qid)}
                          disabled={actionLoading}
                          className="inline-flex h-8 items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 text-xs font-semibold text-white shadow-sm transition-all duration-150 hover:bg-emerald-700 focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <span className="material-symbols-outlined text-[15px] leading-none">check</span>
                          Mark Complete
                        </button>
                      )}
                      {item.cardType === 'called' && (
                        <>
                          <button
                            type="button"
                            onClick={() => handleServe(item.qid)}
                            disabled={actionLoading}
                            className="inline-flex h-8 items-center gap-1 rounded-xl bg-blue-600 px-3.5 text-xs font-semibold text-white shadow-sm transition-all duration-150 hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <span className="material-symbols-outlined text-[14px] leading-none">stethoscope</span>
                            Start Serving
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSkip(item.qid)}
                            disabled={actionLoading}
                            className="inline-flex h-8 items-center rounded-xl border border-amber-200 bg-white px-3 text-xs font-semibold text-amber-700 transition-colors duration-150 hover:bg-amber-50 focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            Skip
                          </button>
                        </>
                      )}
                      {(item.cardType === 'waiting' || item.cardType === 'urgent') && (
                        <button
                          type="button"
                          onClick={() => handleSkip(item.qid)}
                          disabled={actionLoading}
                          className="inline-flex h-8 items-center rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-600 transition-colors duration-150 hover:bg-slate-50 hover:text-slate-900 focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Skip
                        </button>
                      )}
                      {item.cardType === 'skipped' && (
                        <button
                          type="button"
                          onClick={() => handleRecall(item.qid)}
                          disabled={actionLoading}
                          className="inline-flex h-8 items-center gap-1 rounded-xl bg-blue-600 px-3.5 text-xs font-semibold text-white shadow-sm transition-all duration-150 hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <span className="material-symbols-outlined text-[14px] leading-none">replay</span>
                          Recall
                        </button>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </DoctorLayout>
  );
}