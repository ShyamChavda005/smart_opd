// ============================================================
//  DoctorAnalytics.jsx  –  Doctor Productivity & Analytics (Dynamic)
// ============================================================

import React, { useState, useEffect, useCallback } from 'react';
import DoctorLayout from '../../components/doctor/DoctorLayout';
import { getAuthPayload, getAuthHeaders } from '../../auth';
import '../../style/doctor/DoctorAnalytics.css';

const API = 'http://localhost:8000';

export default function DoctorAnalytics() {
  const payload = getAuthPayload();
  const doctorId = payload?.uid;

  const [stats, setStats] = useState({
    avgTime: 0,
    completedCount: 0,
    waitingCount: 0,
    skippedCount: 0,
    totalToday: 0,
    queueEfficiency: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = useCallback(async () => {
    if (!doctorId) return;
    try {
      const res = await fetch(`${API}/queues/board`, { headers: getAuthHeaders() });
      if (!res.ok) throw new Error('Failed to fetch');
      const board = await res.json();
      const myBoard = board.find(b => b.doctor?.did === doctorId);

      if (myBoard) {
        const waitingCount = (myBoard.waiting || []).length;
        const servingCount = myBoard.serving ? 1 : 0;
        const calledCount = myBoard.called ? 1 : 0;
        const completedCount = myBoard.completed_count || 0;
        const skippedCount = (myBoard.skipped || []).length;
        const totalToday = waitingCount + servingCount + calledCount + completedCount + skippedCount;
        const efficiency = totalToday > 0 ? Math.round((completedCount / totalToday) * 100) : 0;

        setStats({
          avgTime: myBoard.doctor?.avg_time || 12,
          completedCount,
          waitingCount,
          skippedCount,
          totalToday,
          queueEfficiency: efficiency,
        });
      }
    } catch (err) {
      console.error('Analytics fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [doctorId]);

  useEffect(() => {
    fetchAnalytics();
    const interval = setInterval(fetchAnalytics, 10000);
    return () => clearInterval(interval);
  }, [fetchAnalytics]);

  if (loading) {
    return (
      <DoctorLayout activeTab="Analytics">
        <div className="doctor-analytics-container flex items-center justify-center py-24">
          <div className="text-center space-y-4">
            <div className="relative mx-auto h-12 w-12">
              <div className="absolute inset-0 rounded-full border-4 border-blue-100"></div>
              <div className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
            </div>
            <p className="text-sm font-semibold text-slate-500">Loading productivity analytics...</p>
          </div>
        </div>
      </DoctorLayout>
    );
  }

  return (
    <DoctorLayout activeTab="Analytics">
      <div className="doctor-analytics-container animate-fadeIn space-y-6">
        {/* ---------- Main Card Container ---------- */}
        <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm">
          {/* Section header */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-6 py-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Doctor Productivity &amp; OPD Analytics</h2>
              <p className="mt-0.5 text-xs text-slate-500">
                Today's queue throughput performance <span className="px-1 text-slate-300">•</span> Auto-syncs every 10s
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 ring-1 ring-inset ring-blue-100">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-600"></span>
              </span>
              Live Shift Metrics
            </span>
          </div>

          {/* ---------- Key Metrics Grid ---------- */}
          <div className="grid grid-cols-1 gap-5 p-6 md:grid-cols-3">
            {/* Avg consultation time */}
            <div className="analytics-stat-card rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm transition-all duration-200 hover:shadow-md">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Avg Consultation Time
                  </p>
                  <p className="mt-2 text-3xl font-extrabold leading-none tracking-tight text-slate-900">
                    {stats.avgTime}
                    <span className="ml-1 text-base font-semibold text-slate-400">min</span>
                  </p>
                  <p className="mt-2 text-xs text-slate-500">Configured pace in profile settings</p>
                </div>
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 ring-1 ring-blue-100">
                  <span className="material-symbols-outlined text-[22px] leading-none">timer</span>
                </span>
              </div>
              {/* Progress bar visual */}
              <div className="mt-4 pt-3 border-t border-slate-100">
                <div className="flex justify-between text-[11px] font-medium text-slate-500 mb-1">
                  <span>Standard Target: 10–15 min</span>
                  <span className="font-semibold text-blue-700">Optimal</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full rounded-full bg-blue-600" style={{ width: `${Math.min(100, (stats.avgTime / 20) * 100)}%` }}></div>
                </div>
              </div>
            </div>

            {/* Completed today */}
            <div className="analytics-stat-card rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm transition-all duration-200 hover:shadow-md">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Completed Today</p>
                  <p className="mt-2 text-3xl font-extrabold leading-none tracking-tight text-slate-900">
                    {stats.completedCount}
                    <span className="ml-1 text-base font-semibold text-slate-400">/ {stats.totalToday}</span>
                  </p>
                  <p className="mt-2 text-xs text-slate-500">
                    {stats.waitingCount} waiting <span className="px-0.5 text-slate-300">•</span>{' '}
                    {stats.skippedCount} skipped
                  </p>
                </div>
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100">
                  <span className="material-symbols-outlined text-[22px] leading-none">task_alt</span>
                </span>
              </div>
              {/* Progress bar visual */}
              <div className="mt-4 pt-3 border-t border-slate-100">
                <div className="flex justify-between text-[11px] font-medium text-slate-500 mb-1">
                  <span>Completion Progress</span>
                  <span className="font-semibold text-emerald-700">{stats.completedCount} of {stats.totalToday}</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-emerald-600 transition-all duration-300"
                    style={{ width: `${stats.totalToday > 0 ? (stats.completedCount / stats.totalToday) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Queue efficiency */}
            <div className="analytics-stat-card rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm transition-all duration-200 hover:shadow-md">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Queue Efficiency</p>
                  <p className="mt-2 text-3xl font-extrabold leading-none tracking-tight text-slate-900">
                    {stats.queueEfficiency}
                    <span className="ml-0.5 text-base font-semibold text-slate-400">%</span>
                  </p>
                  <p className="mt-2 text-xs text-slate-500">Completion rate for active shift</p>
                </div>
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 ring-1 ring-amber-100">
                  <span className="material-symbols-outlined text-[22px] leading-none">speed</span>
                </span>
              </div>
              {/* Progress bar visual */}
              <div className="mt-4 pt-3 border-t border-slate-100">
                <div className="flex justify-between text-[11px] font-medium text-slate-500 mb-1">
                  <span>Shift Throughput</span>
                  <span className="font-semibold text-amber-700">{stats.queueEfficiency}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-amber-500 to-emerald-500 transition-all duration-300"
                    style={{ width: `${Math.min(100, stats.queueEfficiency)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Breakdown Pills Footer */}
          <div className="border-t border-slate-100 bg-slate-50/50 px-6 py-4">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-xl border border-slate-200/80 bg-white p-3 text-center">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Waiting</p>
                <p className="mt-1 text-lg font-bold text-slate-800">{stats.waitingCount}</p>
              </div>
              <div className="rounded-xl border border-slate-200/80 bg-white p-3 text-center">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Completed</p>
                <p className="mt-1 text-lg font-bold text-emerald-600">{stats.completedCount}</p>
              </div>
              <div className="rounded-xl border border-slate-200/80 bg-white p-3 text-center">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Skipped</p>
                <p className="mt-1 text-lg font-bold text-amber-600">{stats.skippedCount}</p>
              </div>
              <div className="rounded-xl border border-slate-200/80 bg-white p-3 text-center">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Total Cases</p>
                <p className="mt-1 text-lg font-bold text-blue-600">{stats.totalToday}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DoctorLayout>
  );
}