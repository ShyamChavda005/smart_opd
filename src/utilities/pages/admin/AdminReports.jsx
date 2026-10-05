
// ============================================================
//  AdminReports.jsx – Admin Reports & Analytics Page
// ============================================================

import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "../../components/admin/AdminLayout";
import GlassSelect from "../../components/controls/GlassSelect";
import "../../style/admin/AdminDashboard.css";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000";

function AdminReports() {

  const [timeRange, setTimeRange] = useState("Today");

  const [reportData, setReportData] = useState({
    summary: {
      total_patients: 0,
      avg_wait_time: 0,
      completed_consultations: 0,
      emergency_admissions: 0,
    },
    departments: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ============================================================
  // FETCH REPORT
  // ============================================================

  const fetchReports = async () => {

    try {

      setLoading(true);
      setError("");

      const response = await axios.get(
        `${API_BASE_URL}/admin/reports`,
        {
          params: {
            range: timeRange,
          },
        }
      );

      setReportData(response.data);

    } catch (err) {

      console.error("Error fetching reports:", err);

      setError(
        err.response?.data?.detail ||
        "Failed to load report data."
      );

    } finally {

      setLoading(false);

    }
  };


  // ============================================================
  // LOAD WHEN TIME RANGE CHANGES
  // ============================================================

  useEffect(() => {
    fetchReports();
  }, [timeRange]);


  // ============================================================
  // SUMMARY CARDS
  // ============================================================

  const reportStats = [
    {
      label: "Total OPD Patients",
      value: reportData.summary.total_patients,
      icon: "groups",
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Avg Wait Time",
      value: `${reportData.summary.avg_wait_time} min`,
      icon: "schedule",
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Completed Consultations",
      value: reportData.summary.completed_consultations,
      icon: "task_alt",
      color: "bg-indigo-50 text-indigo-600",
    },
    {
      label: "Emergency Admissions",
      value: reportData.summary.emergency_admissions,
      icon: "e911_emergency",
      color: "bg-rose-50 text-rose-600",
    },
  ];


  // ============================================================
  // DEPARTMENT STATUS
  // Based on actual average waiting time
  // ============================================================

  const getDepartmentStatus = (avgWaitTime) => {

    if (avgWaitTime >= 30) {
      return {
        label: "Critical",
        className: "bg-rose-100 text-rose-700",
      };
    }

    if (avgWaitTime >= 20) {
      return {
        label: "Busy",
        className: "bg-amber-100 text-amber-700",
      };
    }

    return {
      label: "Optimal",
      className: "bg-emerald-100 text-emerald-700",
    };
  };


  // ============================================================
  // EXPORT CSV
  // ============================================================

  const exportReport = () => {

    if (!reportData.departments.length) {
      alert("No report data available to export.");
      return;
    }

    const headers = [
      "Department",
      "Total Patients",
      "Average Wait Time",
      "Completed Consultations",
      "Emergency Patients",
    ];

    const rows = reportData.departments.map((row) => [
      row.department,
      row.total_patients,
      `${row.avg_wait_time} min`,
      row.completed_consultations,
      row.emergency_patients,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        row.map((value) => `"${value}"`).join(",")
      ),
    ].join("\n");

    const blob = new Blob(
      [csvContent],
      { type: "text/csv;charset=utf-8;" }
    );

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.download =
      `OPD_Report_${timeRange.replaceAll(" ", "_")}.csv`;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };


  return (
    <AdminLayout>

      <div className="space-y-8 animate-fadeIn p-2">

        {/* =====================================================
            PAGE HEADER
        ====================================================== */}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">

          <div>

            <h1 className="text-2xl font-bold text-slate-900">
              Hospital Analytics &amp; Reports
            </h1>

            <p className="text-sm text-slate-500 mt-1">
              Comprehensive report insights across OPD departments
              and consultation metrics
            </p>

          </div>


          <div className="flex items-center gap-3">

            {/* TIME RANGE */}

            <GlassSelect
              inline
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              ariaLabel="Time range"
            >

              <option value="Today">
                Today
              </option>

              <option value="This Week">
                This Week
              </option>

              <option value="This Month">
                This Month
              </option>

              <option value="This Quarter">
                This Quarter
              </option>

            </GlassSelect>


            {/* EXPORT */}

            <button
              onClick={exportReport}
              disabled={
                loading ||
                reportData.departments.length === 0
              }
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center gap-2"
            >

              <span className="material-symbols-outlined text-base">
                download
              </span>

              Export Report

            </button>

          </div>

        </div>


        {/* =====================================================
            ERROR
        ====================================================== */}

        {error && (

          <div className="bg-rose-50 border border-rose-200 text-rose-700 rounded-xl px-4 py-3 text-sm font-semibold">

            {error}

          </div>

        )}


        {/* =====================================================
            SUMMARY CARDS
        ====================================================== */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

          {reportStats.map((item, idx) => (

            <div
              key={idx}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center justify-between"
            >

              <div>

                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  {item.label}
                </p>

                {loading ? (

                  <div className="h-9 w-24 bg-slate-100 rounded-lg animate-pulse"></div>

                ) : (

                  <h3 className="text-3xl font-black text-slate-900">
                    {item.value}
                  </h3>

                )}

              </div>


              <div
                className={`w-12 h-12 rounded-2xl ${item.color} flex items-center justify-center`}
              >

                <span className="material-symbols-outlined text-2xl">
                  {item.icon}
                </span>

              </div>

            </div>

          ))}

        </div>


        {/* =====================================================
            DEPARTMENT BREAKDOWN
        ====================================================== */}

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">

          <div className="flex items-center justify-between pb-4 border-b border-slate-100">

            <h3 className="text-xl font-bold text-slate-900">
              Department Performance Breakdown
            </h3>

            <span className="text-xs font-bold text-slate-400 uppercase">
              Live OPD Data ({timeRange})
            </span>

          </div>


          <div className="overflow-x-auto">

            <table className="w-full text-left border-collapse">

              <thead>

                <tr className="border-b border-slate-100 text-xs font-extrabold uppercase text-slate-400 tracking-wider">

                  <th className="py-3 px-4">
                    DEPARTMENT
                  </th>

                  <th className="py-3 px-4">
                    TOTAL PATIENTS
                  </th>

                  <th className="py-3 px-4">
                    AVG WAIT TIME
                  </th>

                  <th className="py-3 px-4">
                    COMPLETED
                  </th>

                  <th className="py-3 px-4">
                    EMERGENCY
                  </th>

                  <th className="py-3 px-4 text-right">
                    STATUS
                  </th>

                </tr>

              </thead>


              <tbody className="divide-y divide-slate-100 text-sm">

                {loading ? (

                  <tr>

                    <td
                      colSpan="6"
                      className="py-10 text-center text-slate-400"
                    >

                      Loading report data...

                    </td>

                  </tr>

                ) : reportData.departments.length === 0 ? (

                  <tr>

                    <td
                      colSpan="6"
                      className="py-10 text-center text-slate-400"
                    >

                      No OPD data available for {timeRange}.

                    </td>

                  </tr>

                ) : (

                  reportData.departments.map((row, idx) => {

                    const status = getDepartmentStatus(
                      row.avg_wait_time
                    );

                    return (

                      <tr
                        key={idx}
                        className="hover:bg-slate-50 transition-colors"
                      >

                        {/* DEPARTMENT */}

                        <td className="py-4 px-4 font-bold text-slate-900">

                          {row.department}

                        </td>


                        {/* TOTAL PATIENTS */}

                        <td className="py-4 px-4 font-black text-blue-600">

                          {row.total_patients}

                        </td>


                        {/* AVG WAIT */}

                        <td className="py-4 px-4 text-slate-600 font-semibold">

                          {row.avg_wait_time} min

                        </td>


                        {/* COMPLETED */}

                        <td className="py-4 px-4 text-indigo-600 font-bold">

                          {row.completed_consultations}

                        </td>


                        {/* EMERGENCY */}

                        <td className="py-4 px-4 text-rose-600 font-bold">

                          {row.emergency_patients}

                        </td>


                        {/* STATUS */}

                        <td className="py-4 px-4 text-right">

                          <span
                            className={`text-[10px] font-black px-3 py-1 rounded-full uppercase ${status.className}`}
                          >

                            {status.label}

                          </span>

                        </td>

                      </tr>

                    );

                  })

                )}

              </tbody>

            </table>

          </div>

        </div>

      </div>

    </AdminLayout>
  );
}

export default AdminReports;

