// ============================================================
//  DoctorAppointments.jsx  –  Doctor Appointments Schedule (Dynamic)
// ============================================================

import React, { useState, useEffect, useCallback } from 'react';
import DoctorLayout from '../../components/doctor/DoctorLayout';
import { getAuthPayload, getAuthHeaders } from '../../auth';
import '../../style/doctor/DoctorAppointments.css';

const API = 'http://localhost:8000';

export default function DoctorAppointments() {
  const payload = getAuthPayload();
  const doctorId = payload?.uid ?? payload?.id;

  const [appointments, setAppointments] = useState([]);
  const [completedCount, setCompletedCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAppointments = useCallback(async () => {
    if (!doctorId) {
      setError('Doctor session is missing. Please sign in again.');
      setLoading(false);
      return;
    }

    try {
      setError('');
      const res = await fetch(`${API}/queues/board?did=${encodeURIComponent(doctorId)}`, {
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error(`Failed to fetch appointments (${res.status})`);
      const board = await res.json();
      const myBoard = Array.isArray(board)
        ? board.find((b) => String(b.doctor?.did) === String(doctorId))
        : null;

      if (myBoard) {
        const all = [];
        if (myBoard.serving) all.push({ ...myBoard.serving, displayStatus: 'Serving' });
        if (myBoard.called) all.push({ ...myBoard.called, displayStatus: 'Called' });
        (myBoard.waiting || []).forEach(w => all.push({
          ...w,
          displayStatus: w.priority === 'Emergency' ? 'Urgent' : 'Waiting'
        }));
        (myBoard.skipped || []).forEach(s => all.push({ ...s, displayStatus: 'Skipped' }));
        setAppointments(all);
        setCompletedCount(myBoard.completed_count || 0);
      } else {
        setAppointments([]);
        setCompletedCount(0);
      }
    } catch (err) {
      console.error('Appointments fetch error:', err);
      setError(err.message || 'Unable to load appointments.');
      setAppointments([]);
      setCompletedCount(0);
    } finally {
      setLoading(false);
    }
  }, [doctorId]);

  useEffect(() => {
    fetchAppointments();
    const interval = setInterval(fetchAppointments, 8000);
    return () => clearInterval(interval);
  }, [fetchAppointments]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Serving': return 'bg-blue-50 text-blue-700 ring-blue-200/80';
      case 'Called': return 'bg-sky-50 text-sky-700 ring-sky-200/80';
      case 'Urgent': return 'bg-red-50 text-red-700 ring-red-200/80';
      case 'Skipped': return 'bg-slate-100 text-slate-500 ring-slate-200/80';
      default: return 'bg-amber-50 text-amber-700 ring-amber-200/80';
    }
  };

  const getInitials = (name) => {
    if (!name) return '??';
    const parts = name.trim().split(' ');
    return (parts[0]?.charAt(0) || '') + (parts[1]?.charAt(0) || '');
  };

  if (loading) {
    return (
      <DoctorLayout activeTab="Appointments">
        <div className="doctor-appointments-container flex items-center justify-center py-24">
          <div className="text-center space-y-4">
            <div className="relative mx-auto h-12 w-12">
              <div className="absolute inset-0 rounded-full border-4 border-blue-100"></div>
              <div className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
            </div>
            <p className="text-sm font-semibold text-slate-500">Loading appointment schedule...</p>
          </div>
        </div>
      </DoctorLayout>
    );
  }

  return (
    <DoctorLayout activeTab="Appointments">
      <div className="doctor-appointments-container animate-fadeIn overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm">
        {/* ---------- Section header ---------- */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 px-6 py-4">
          <div className="min-w-0">
            <h2 className="text-base font-bold text-slate-900">Today's Appointment Schedule</h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Ordered by active queue priority <span className="px-1 text-slate-300">•</span> Auto-syncs with live queue
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
              {appointments.length} Active
            </span>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 ring-1 ring-inset ring-emerald-200">
              {completedCount} Completed
            </span>
          </div>
        </div>

        {/* ---------- Error state ---------- */}
        {error && (
          <div
            role="alert"
            className="mx-6 mt-5 flex items-center justify-between gap-4 rounded-xl border border-red-200 bg-red-50/80 px-4 py-3 text-sm text-red-700"
          >
            <span className="flex min-w-0 items-center gap-2">
              <span className="material-symbols-outlined text-[20px] leading-none text-red-600">error</span>
              <span className="truncate font-medium">{error}</span>
            </span>
            <button
              type="button"
              onClick={fetchAppointments}
              className="shrink-0 rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-semibold text-red-700 shadow-sm transition-colors duration-150 hover:bg-red-50 focus-visible:ring-2 focus-visible:ring-blue-600"
            >
              Retry
            </button>
          </div>
        )}

        {/* ---------- Schedule List ---------- */}
        <div className="p-6">
          {appointments.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-slate-300 ring-1 ring-slate-100">
                <span className="material-symbols-outlined text-[28px] leading-none">calendar_month</span>
              </span>
              <p className="mt-4 text-base font-bold text-slate-800">No appointments scheduled for today</p>
              <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">Patients will appear here once registered and checked in at the reception desk</p>
            </div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {appointments.map((item) => (
                <li
                  key={item.qid}
                  className="appointment-item-card flex flex-wrap items-center justify-between gap-4 py-4 px-3 rounded-xl transition-all duration-150 hover:bg-slate-50/80"
                >
                  <div className="flex min-w-0 items-center gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-xs font-bold text-slate-600 shadow-sm">
                      {getInitials(item.patient_name)}
                    </span>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center rounded-lg bg-blue-50 px-2.5 py-0.5 text-xs font-bold tabular-nums text-blue-700 ring-1 ring-inset ring-blue-100">
                          T-{item.token}
                        </span>
                        <span
                          className={[
                            'inline-flex items-center rounded-lg px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ring-1 ring-inset',
                            getStatusBadge(item.displayStatus),
                          ].join(' ')}
                        >
                          {item.displayStatus}
                        </span>
                      </div>
                      <p className="mt-1.5 truncate text-base font-bold text-slate-900">{item.patient_name}</p>
                      <p className="mt-0.5 text-xs text-slate-500">
                        Priority: <span className="font-semibold text-slate-700">{item.priority || 'Low'}</span>
                        <span className="px-1.5 text-slate-300">•</span>Score: <span className="font-semibold text-slate-700">{item.final_score}</span>
                        <span className="px-1.5 text-slate-300">•</span>Wait Bonus: <span className="text-emerald-600 font-semibold">+{item.waiting_bonus || 0}</span>
                      </p>
                      {item.patient_contact && (
                        <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                          <span className="material-symbols-outlined text-[14px] leading-none text-slate-400">call</span>
                          {item.patient_contact}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex shrink-0 flex-col items-start gap-1.5 sm:items-end">
                    <span className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-bold tabular-nums text-slate-700">
                      Pos #{item.queue_position || '—'}
                    </span>
                    {item.estimated_wait_time > 0 && (
                      <span className="text-xs font-medium text-slate-500 tabular-nums">
                        ~{item.estimated_wait_time} min wait
                      </span>
                    )}
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