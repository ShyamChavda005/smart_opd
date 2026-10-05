
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../components/admin/AdminLayout";
import GlassSelect from "../../components/controls/GlassSelect";
import "../../style/admin/AdminDashboard.css";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function AdminDashboard() {

  const navigate = useNavigate();

  const [doctors, setDoctors] = useState([]);
  const [receptionistsCount, setReceptionistsCount] = useState(0);
  const [visits, setVisits] = useState([]);
  const [queues, setQueues] = useState([]);

  const [doctorSearch, setDoctorSearch] = useState("");
  const [doctorDeptFilter, setDoctorDeptFilter] = useState("All");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  // ============================================================
  // LOAD DASHBOARD DATA
  // ============================================================

  const loadDashboardData = async () => {

    try {

      setLoading(true);
      setError("");

      const [
        doctorsResponse,
        receptionistsResponse,
        visitsResponse,
        queuesResponse
      ] = await Promise.all([
        fetch(`${API_BASE_URL}/doctors`),
        fetch(`${API_BASE_URL}/receptionists`),
        fetch(`${API_BASE_URL}/visits`),
        fetch(`${API_BASE_URL}/queues`)
      ]);

      if (!doctorsResponse.ok) {
        throw new Error("Failed to load doctors");
      }

      if (!receptionistsResponse.ok) {
        throw new Error("Failed to load receptionists");
      }

      if (!visitsResponse.ok) {
        throw new Error("Failed to load visits");
      }

      if (!queuesResponse.ok) {
        throw new Error("Failed to load queues");
      }


      const doctorsData = await doctorsResponse.json();
      const receptionistsData = await receptionistsResponse.json();
      const visitsData = await visitsResponse.json();
      const queuesData = await queuesResponse.json();


      setDoctors(
        Array.isArray(doctorsData)
          ? doctorsData
          : []
      );

      setReceptionistsCount(
        Array.isArray(receptionistsData)
          ? receptionistsData.length
          : 0
      );

      setVisits(
        Array.isArray(visitsData)
          ? visitsData
          : []
      );

      setQueues(
        Array.isArray(queuesData)
          ? queuesData
          : []
      );

    } catch (err) {

      console.error("Dashboard error:", err);

      setError(
        err.message || "Failed to load dashboard data."
      );

    } finally {

      setLoading(false);

    }
  };


  useEffect(() => {
    loadDashboardData();
  }, []);


  // ============================================================
  // TODAY'S VISITS
  // ============================================================

  const today = new Date();

  const todayString =
    today.toISOString().split("T")[0];


  const todayVisits = useMemo(() => {

    return visits.filter((visit) => {

      if (!visit.visit_date) {
        return false;
      }

      return String(visit.visit_date).slice(0, 10) === todayString;

    });

  }, [visits, todayString]);


  // ============================================================
  // DASHBOARD COUNTS
  // ============================================================

  const totalPatientsToday =
    todayVisits.length;


  const activeDoctors = doctors.filter(
    (doctor) =>
      String(doctor.status || "").toLowerCase() === "active"
  ).length;


  // ============================================================
  // AVERAGE WAIT TIME
  // ============================================================

  const avgWaitTime = useMemo(() => {

    if (queues.length === 0) {
      return 0;
    }

    const todayVisitIds = new Set(
      todayVisits.map((visit) => visit.vid)
    );

    const todayQueues = queues.filter(
      (queue) => todayVisitIds.has(queue.vid)
    );

    if (todayQueues.length === 0) {
      return 0;
    }

    const totalWait = todayQueues.reduce(
      (total, queue) =>
        total + Number(queue.estimated_wait_time || 0),
      0
    );

    return Math.round(
      totalWait / todayQueues.length
    );

  }, [queues, todayVisits]);


  // ============================================================
  // DEPARTMENT LIST
  // ============================================================

  const departments = useMemo(() => {

    const departmentMap = {};

    todayVisits.forEach((visit) => {

      const doctor = doctors.find(
        (doc) => doc.did === visit.did
      );

      if (!doctor?.specialization) {
        return;
      }

      const department = doctor.specialization;

      if (!departmentMap[department]) {

        departmentMap[department] = {
          name: department,
          tokens: 0,
          waiting: 0,
          completed: 0
        };

      }

      departmentMap[department].tokens += 1;


      if (
        String(visit.status || "").toLowerCase() ===
        "completed"
      ) {
        departmentMap[department].completed += 1;
      }

    });


    // Calculate waiting queue
    queues.forEach((queue) => {

      const visit = todayVisits.find(
        (item) => item.vid === queue.vid
      );

      if (!visit) {
        return;
      }

      const doctor = doctors.find(
        (doc) => doc.did === visit.did
      );

      if (!doctor?.specialization) {
        return;
      }

      const status =
        String(queue.status || "").toLowerCase();

      if (
        status !== "completed" &&
        status !== "complete"
      ) {
        const department =
          doctor.specialization;

        if (departmentMap[department]) {
          departmentMap[department].waiting += 1;
        }
      }

    });


    return Object.values(departmentMap);

  }, [todayVisits, doctors, queues]);


  // ============================================================
  // DOCTOR FILTER
  // ============================================================

  const specialties = useMemo(() => {

    return [
      "All",
      ...new Set(
        doctors
          .map((doctor) => doctor.specialization)
          .filter(Boolean)
      )
    ];

  }, [doctors]);


  const filteredDoctors = useMemo(() => {

    const search =
      doctorSearch.trim().toLowerCase();

    return doctors.filter((doctor) => {

      const matchesSearch =
        !search ||
        String(doctor.name || "")
          .toLowerCase()
          .includes(search) ||
        String(doctor.specialization || "")
          .toLowerCase()
          .includes(search);

      const matchesDepartment =
        doctorDeptFilter === "All" ||
        doctor.specialization === doctorDeptFilter;

      return (
        matchesSearch &&
        matchesDepartment
      );

    });

  }, [
    doctors,
    doctorSearch,
    doctorDeptFilter
  ]);


  // ============================================================
  // DOCTOR PATIENT COUNT
  // ============================================================

  const getDoctorPatients = (doctorId) => {

    return todayVisits.filter(
      (visit) => visit.did === doctorId
    ).length;

  };


  return (
    <AdminLayout>

      <div className="space-y-8 animate-fadeIn max-w-[1400px] mx-auto pb-12">


        {/* ====================================================
            ERROR
        ===================================================== */}

        {error && (

          <div className="bg-rose-50 border border-rose-200 text-rose-700 rounded-xl px-4 py-3 text-sm font-semibold">
            {error}
          </div>

        )}


        {/* ====================================================
            SUMMARY CARDS
        ===================================================== */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">


          {/* PATIENTS */}

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">

            <div className="flex items-center justify-between mb-3">

              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Patients Today
              </span>

              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">

                <span className="material-symbols-outlined">
                  groups
                </span>

              </div>

            </div>

            <div className="text-3xl font-black text-slate-900">

              {loading ? "..." : totalPatientsToday}

            </div>

            <button
              onClick={() => navigate("/admin/reports")}
              className="mt-4 text-xs font-semibold text-blue-600 hover:underline"
            >
              View reports →
            </button>

          </div>


          {/* DOCTORS */}

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">

            <div className="flex items-center justify-between mb-3">

              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Doctors on Duty
              </span>

              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">

                <span className="material-symbols-outlined">
                  stethoscope
                </span>

              </div>

            </div>

            <div className="text-3xl font-black text-slate-900">

              {loading ? "..." : activeDoctors}

              <span className="text-lg font-bold text-slate-400">
                {" "}/ {doctors.length}
              </span>

            </div>

            <button
              onClick={() => navigate("/admin/doctors")}
              className="mt-4 text-xs font-semibold text-blue-600 hover:underline"
            >
              Manage doctors →
            </button>

          </div>


          {/* RECEPTIONISTS */}

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">

            <div className="flex items-center justify-between mb-3">

              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Reception Staff
              </span>

              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">

                <span className="material-symbols-outlined">
                  badge
                </span>

              </div>

            </div>

            <div className="text-3xl font-black text-slate-900">

              {loading ? "..." : receptionistsCount}

            </div>

            <button
              onClick={() => navigate("/admin/receptionists")}
              className="mt-4 text-xs font-semibold text-blue-600 hover:underline"
            >
              View staff →
            </button>

          </div>


          {/* WAIT TIME */}

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">

            <div className="flex items-center justify-between mb-3">

              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Avg Wait Time
              </span>

              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">

                <span className="material-symbols-outlined">
                  timer
                </span>

              </div>

            </div>

            <div className="text-3xl font-black text-slate-900">

              {loading ? "..." : avgWaitTime}

              <span className="text-lg font-bold text-slate-400">
                {" "}min
              </span>

            </div>

            <button
              onClick={() => navigate("/admin/reports")}
              className="mt-4 text-xs font-semibold text-blue-600 hover:underline"
            >
              View analytics →
            </button>

          </div>

        </div>


        {/* ====================================================
            QUICK ACTIONS
        ===================================================== */}

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">

          <div className="flex flex-wrap items-center gap-3">

            <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider mr-2">
              Quick Actions
            </span>

            <button
              onClick={() => navigate("/admin/add-doctor")}
              className="px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-bold flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-sm">
                person_add
              </span>
              New Doctor
            </button>

            <button
              onClick={() => navigate("/admin/add-receptionist")}
              className="px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-sm">
                badge
              </span>
              New Receptionist
            </button>

            <button
              onClick={() => navigate("/admin/add-symptom")}
              className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl text-xs font-bold flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-sm">
                format_list_bulleted_add
              </span>
              New Symptom
            </button>

            <button
              onClick={() => navigate("/admin/reports")}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-sm">
                bar_chart
              </span>
              OPD Reports
            </button>

          </div>

        </div>


        {/* ====================================================
            MAIN SECTION
        ===================================================== */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">


          {/* ==================================================
              DOCTORS
          =================================================== */}

          <div className="lg:col-span-2">

            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-5">

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">

                <div>

                  <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">
                    Physician Duty Roster
                  </h3>

                  <p className="text-xs text-slate-500 mt-0.5">
                    Current doctors and today's patient load
                  </p>

                </div>

                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                  {filteredDoctors.length} Doctors
                </span>

              </div>


              {/* FILTERS */}

              <div className="flex flex-col sm:flex-row gap-3">

                <input
                  type="text"
                  value={doctorSearch}
                  onChange={(e) =>
                    setDoctorSearch(e.target.value)
                  }
                  placeholder="Search doctor or specialty..."
                  className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />


                <GlassSelect
                  inline
                  value={doctorDeptFilter}
                  onChange={(e) =>
                    setDoctorDeptFilter(e.target.value)
                  }
                  ariaLabel="Filter by specialty"
                >

                  {specialties.map((specialty) => (

                    <option
                      key={specialty}
                      value={specialty}
                    >
                      {specialty === "All"
                        ? "All Specialties"
                        : specialty}
                    </option>

                  ))}

                </GlassSelect>

              </div>


              {/* TABLE */}

              <div className="overflow-x-auto">

                <table className="w-full text-left border-collapse">

                  <thead>

                    <tr className="border-b border-slate-100 text-[11px] font-extrabold uppercase text-slate-400 tracking-wider">

                      <th className="py-3 px-3">
                        Doctor
                      </th>

                      <th className="py-3 px-3">
                        Specialization
                      </th>

                      <th className="py-3 px-3">
                        Patients Today
                      </th>

                      <th className="py-3 px-3">
                        Avg Time
                      </th>

                      <th className="py-3 px-3">
                        Status
                      </th>

                    </tr>

                  </thead>


                  <tbody className="divide-y divide-slate-100 text-xs">

                    {loading ? (

                      <tr>
                        <td
                          colSpan="5"
                          className="py-8 text-center text-slate-400"
                        >
                          Loading doctors...
                        </td>
                      </tr>

                    ) : filteredDoctors.length === 0 ? (

                      <tr>
                        <td
                          colSpan="5"
                          className="py-8 text-center text-slate-400"
                        >
                          No doctors found.
                        </td>
                      </tr>

                    ) : (

                      filteredDoctors.map((doctor) => {

                        const isActive =
                          String(
                            doctor.status || ""
                          ).toLowerCase() === "active";

                        return (

                          <tr
                            key={doctor.did}
                            className="hover:bg-slate-50 transition-colors"
                          >

                            <td className="py-3.5 px-3">

                              <div className="flex items-center gap-3">

                                <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center">

                                  {String(
                                    doctor.name || "D"
                                  )
                                    .split(" ")
                                    .map((n) => n[0])
                                    .slice(0, 2)
                                    .join("")}

                                </div>

                                <span className="font-bold text-slate-900">
                                  {doctor.name}
                                </span>

                              </div>

                            </td>


                            <td className="py-3.5 px-3">

                              <span className="text-blue-600 font-medium">
                                {doctor.specialization || "-"}
                              </span>

                            </td>


                            <td className="py-3.5 px-3">

                              <span className="font-bold text-slate-800">
                                {getDoctorPatients(doctor.did)}
                              </span>

                            </td>


                            <td className="py-3.5 px-3">

                              <span className="font-semibold text-slate-600">
                                {doctor.avg_time ?? 0} min
                              </span>

                            </td>


                            <td className="py-3.5 px-3">

                              <span
                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                                  isActive
                                    ? "bg-emerald-100 text-emerald-700"
                                    : "bg-slate-100 text-slate-600"
                                }`}
                              >

                                <span
                                  className={`w-1.5 h-1.5 rounded-full ${
                                    isActive
                                      ? "bg-emerald-600"
                                      : "bg-slate-400"
                                  }`}
                                />

                                {doctor.status || "Inactive"}

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


          {/* ==================================================
              DEPARTMENT QUEUE
          =================================================== */}

          <div>

            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm">

              <div className="flex items-center justify-between pb-3 border-b border-slate-100">

                <h3 className="text-lg font-bold text-slate-900">
                  Department Queue
                </h3>

                <span className="text-[10px] font-extrabold tracking-widest text-slate-400 uppercase">
                  TODAY
                </span>

              </div>


              <div className="space-y-5 mt-5">

                {loading ? (

                  <p className="text-sm text-slate-400 text-center py-6">
                    Loading queue...
                  </p>

                ) : departments.length === 0 ? (

                  <p className="text-sm text-slate-400 text-center py-6">
                    No department data available.
                  </p>

                ) : (

                  departments.map((dept) => {

                    const percentage =
                      dept.tokens > 0
                        ? Math.round(
                            (dept.completed /
                              dept.tokens) *
                              100
                          )
                        : 0;

                    return (

                      <div
                        key={dept.name}
                        className="space-y-1.5"
                      >

                        <div className="flex items-center justify-between text-xs">

                          <span className="font-bold text-slate-800">
                            {dept.name}
                          </span>

                          <span className="text-slate-500 font-semibold">

                            <strong className="text-blue-600">
                              {dept.waiting}
                            </strong>

                            {" "}waiting / {dept.tokens} total

                          </span>

                        </div>


                        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">

                          <div
                            className="bg-blue-600 h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${percentage}%`
                            }}
                          />

                        </div>

                      </div>

                    );

                  })

                )}

              </div>

            </div>

          </div>

        </div>

      </div>

    </AdminLayout>
  );
}

