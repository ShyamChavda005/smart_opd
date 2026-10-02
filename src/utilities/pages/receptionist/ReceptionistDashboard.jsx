// ============================================================
//  ReceptionistDashboard.jsx  –  Receptionist Dashboard Page
// ============================================================

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ReceptionistLayout from '../../components/receptionist/ReceptionistLayout';
import '../../style/receptionist/ReceptionistDashboard.css';
import { getAuthHeaders } from '../../auth';

const getWaitingDetails = (createdAt) => {
  if (!createdAt) return { waitingMinutes: 0, nextBonusIn: 10 };
  const createdTime = new Date(createdAt).getTime();
  if (Number.isNaN(createdTime)) return { waitingMinutes: 0, nextBonusIn: 10 };

  const waitingMinutes = Math.max(0, Math.floor((Date.now() - createdTime) / 60000));
  return { waitingMinutes, nextBonusIn: 10 - (waitingMinutes % 10) };
};

export default function ReceptionistDashboard() {
  const navigate = useNavigate();
  const [priority, setPriority] = useState('Low');

  // Registration Form states
  const [patientName, setPatientName] = useState('');
  const [dob, setDob] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('Male');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [department, setDepartment] = useState('');
  const [totalToday, setTotalToday] = useState(0);
  const [emergencyCases, setEmergencyCases] = useState(0);
  const [avgWaitTime, setAvgWaitTime] = useState(15);
  const [departmentsList, setDepartmentsList] = useState([
    'General Medicine', 'Cardiology', 'Pediatrics', 'Orthopedics', 'Neurology'
  ]);
  const [staffName, setStaffName] = useState('Virat Kohli');

  const [queueList, setQueueList] = useState([]);
  const dashboardRequestSequence = useRef(0);

  // Symptoms states
  const [symptoms, setSymptoms] = useState([]);
  const [selectedSymptom, setSelectedSymptom] = useState('');
  const [priorityScore, setPriorityScore] = useState(null);

  // Doctors & Smart Queue load balancing states
  const [availableDoctors, setAvailableDoctors] = useState([]);
  const [allDoctors, setAllDoctors] = useState([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState('');

  const fetchDashboardData = async () => {
    const requestId = ++dashboardRequestSequence.current;
    try {
      const [qRes, vRes, pRes, dRes, sRes, rRes] = await Promise.all([
        fetch("http://localhost:8000/queues"),
        fetch("http://localhost:8000/visits"),
        fetch("http://localhost:8000/patients"),
        fetch("http://localhost:8000/doctors"),
        fetch("http://localhost:8000/symptoms"),
        fetch("http://localhost:8000/receptionists")
      ]);

      const [qData, vData, pData, dData, sData, rData] = await Promise.all([
        qRes.json(),
        vRes.json(),
        pRes.json(),
        dRes.json(),
        sRes.json(),
        rRes.json()
      ]);

      if (requestId !== dashboardRequestSequence.current) return;

      const queues = Array.isArray(qData) ? qData : [];
      const visits = Array.isArray(vData) ? vData : [];
      const patients = Array.isArray(pData) ? pData : [];
      const doctors = Array.isArray(dData) ? dData : [];
      const symptomsData = Array.isArray(sData) ? sData : [];
      const receptionists = Array.isArray(rData) ? rData : [];

      setAllDoctors(doctors);

      const today = new Date();
      const localTodayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
      const isoTodayStr = today.toISOString().split("T")[0];

      const isToday = (value) => {
        if (!value) return false;
        const valStr = String(value).trim();
        if (valStr.startsWith(localTodayStr) || valStr.startsWith(isoTodayStr)) return true;
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return false;
        return (
          (date.getFullYear() === today.getFullYear() &&
            date.getMonth() === today.getMonth() &&
            date.getDate() === today.getDate()) ||
          date.toISOString().split("T")[0] === isoTodayStr
        );
      };

      const visitsToday = visits.filter((v) => isToday(v.visit_date || v.create_at));

      const visitsMap = Object.fromEntries(visits.map((v) => [v.vid, v]));
      const patientsMap = Object.fromEntries(patients.map((p) => [p.pid, p]));
      const doctorsMap = Object.fromEntries(doctors.map((d) => [d.did, d]));
      const symptomsMap = Object.fromEntries(symptomsData.map((s) => [s.sid, s]));

      // Dashboard metrics are based only on today's real DB records.
      setTotalToday(visitsToday.length);

      const todayVisitIds = new Set(visitsToday.map((v) => v.vid));
      const todayQueues = queues.filter((q) => todayVisitIds.has(q.vid));

      const waitValues = todayQueues
        .map((q) => Number(q.estimated_wait_time))
        .filter((value) => Number.isFinite(value));

      setAvgWaitTime(
        waitValues.length
          ? Math.round(waitValues.reduce((sum, value) => sum + value, 0) / waitValues.length)
          : 0
      );

      const emergencyCount = visitsToday.filter((v) => {
        const symptom = symptomsMap[v.sid];
        const priority = String(symptom?.priority || "").toLowerCase();
        return priority === "emergency";
      }).length;

      setEmergencyCases(emergencyCount);

      const doctorSpecs = doctors
        .filter((d) => String(d.status || "").toLowerCase() === "active")
        .map((d) => d.specialization)
        .filter(Boolean);
      const symptomSpecs = symptomsData
        .map((s) => s.specialization)
        .filter(Boolean);
      const specs = Array.from(new Set([...doctorSpecs, ...symptomSpecs])).sort();

      setDepartmentsList(specs);

      // Keep the selected department valid when doctors/departments change.
      setDepartment((current) => {
        if (current) return current;
        return "";
      });

      // Use the active receptionist returned by the API instead of a hardcoded name.
      const activeReceptionist =
        receptionists.find(
          (r) => String(r.status || "").toLowerCase() === "active"
        ) || receptionists[0];

      setStaffName(activeReceptionist?.name || "Receptionist");

      const rawLiveEntries = queues
        .map((q) => {
          const v = visitsMap[q.vid] || {};
          const p = patientsMap[v.pid] || {};
          const d = doctorsMap[v.did] || {};
          const s = symptomsMap[v.sid] || {};

          const rawStatus = String(q.status || v.status || "Waiting").trim().toLowerCase();
          if (
            rawStatus === "completed" ||
            rawStatus === "complete" ||
            rawStatus === "done" ||
            rawStatus === "cancelled" ||
            rawStatus === "canceled" ||
            rawStatus === "skipped"
          ) {
            return null;
          }

          const visitDate = v.visit_date || v.create_at || q.create_at;
          if (!isToday(visitDate)) return null;

          return {
            qid: q.qid,
            vid: q.vid,
            rawToken: v.token != null ? v.token : q.qid,
            token: v.token != null ? `#${v.token}` : `#${q.qid}`,
            name: p.name || "Unknown Patient",
            phone: p.contact || "",
            dept: d.specialization || s.specialization || "Unassigned",
            doctorName: d.name || "Unassigned",
            status: q.status || v.status || "Waiting",
            rawStatus,
            queuePos: q.queue_position,
            estWait: q.estimated_wait_time,
            priority: s.priority || "Low",
            priorityScore: q.priority_score ?? s.priority_score ?? 0,
            waitingBonus: q.waiting_bonus ?? 0,
            finalScore: q.final_score ?? q.priority_score ?? s.priority_score ?? 0,
            ...getWaitingDetails(q.create_at || v.create_at),
            age: p.age || 30,
            gender: p.gender || "Not specified",
            time: q.create_at || v.create_at
              ? new Date(q.create_at || v.create_at).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit"
              })
              : ""
          };
        })
        .filter(Boolean);

      // Order: Serving/Called first, then highest Final Score, then token/arrival
      rawLiveEntries.sort((a, b) => {
        const aActive = a.rawStatus === "serving" ? 2 : a.rawStatus === "called" ? 1 : 0;
        const bActive = b.rawStatus === "serving" ? 2 : b.rawStatus === "called" ? 1 : 0;
        if (aActive !== bActive) return bActive - aActive;
        const scoreDiff = (Number(b.finalScore) || 0) - (Number(a.finalScore) || 0);
        if (scoreDiff !== 0) return scoreDiff;
        return (Number(a.rawToken) || 0) - (Number(b.rawToken) || 0);
      });

      // Deduplicate queue records on the dashboard
      const seenVisits = new Set();
      const seenTokens = new Set();
      const deduplicatedLive = [];

      for (const item of rawLiveEntries) {
        const vidKey = item.vid != null ? String(item.vid) : null;
        if (vidKey && seenVisits.has(vidKey)) continue;

        const tokenKey = item.token && item.doctorName ? `${item.doctorName}_${item.token}` : null;
        if (tokenKey && seenTokens.has(tokenKey)) continue;

        if (vidKey) seenVisits.add(vidKey);
        if (tokenKey) seenTokens.add(tokenKey);

        deduplicatedLive.push(item);
      }

      setQueueList(deduplicatedLive);
      setSymptoms(
        [...symptomsData].sort((a, b) =>
          String(a.symptom_name || "").localeCompare(String(b.symptom_name || ""))
        )
      );
    } catch (err) {
      if (requestId !== dashboardRequestSequence.current) return;
      console.error("Error loading receptionist dashboard:", err);
      setQueueList([]);
      setSymptoms([]);
    }
  };

  useEffect(() => {
    fetchDashboardData();

    // Auto-refresh queue dynamically in the background every 8 seconds
    const interval = setInterval(fetchDashboardData, 8000);
    return () => clearInterval(interval);
  }, []);

  const handleDobChange = (e) => {
    const selectedDob = e.target.value;
    setDob(selectedDob);
    if (selectedDob) {
      const birthDate = new Date(selectedDob);
      const today = new Date();
      let calcAge = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        calcAge--;
      }
      if (calcAge >= 0) {
        setAge(calcAge.toString());
      } else {
        setAge('0');
      }
    } else {
      setAge('');
    }
  };

  const handleSymptomChange = async (e) => {
    const value = e.target.value;
    setSelectedSymptom(value);

    const foundSymptom = symptoms.find((sym) => sym.symptom_name === value);

    if (!foundSymptom) {
      setPriorityScore(null);
      setDepartment('');
      setAvailableDoctors([]);
      setSelectedDoctorId('');
      return;
    }

    setPriorityScore(foundSymptom.priority_score);

    const dbPriority = String(foundSymptom.priority || '');
    const normalizedPriority =
      dbPriority.charAt(0).toUpperCase() + dbPriority.slice(1).toLowerCase();

    if (['Low', 'Medium', 'High', 'Emergency'].includes(normalizedPriority)) {
      setPriority(normalizedPriority);
    } else {
      setPriority(dbPriority);
    }

    // Department must come from the selected symptom.
    const symptomDepartment = String(foundSymptom.specialization || '').trim();
    setDepartment(symptomDepartment);

    if (!symptomDepartment) {
      setAvailableDoctors([]);
      setSelectedDoctorId('');
      return;
    }

    const matchesSpec = (docSpec, targetSpec) => {
      if (!docSpec || !targetSpec) return false;
      const s1 = String(docSpec).trim().toLowerCase();
      const s2 = String(targetSpec).trim().toLowerCase();
      if (s1 === s2 || s1.includes(s2) || s2.includes(s1)) return true;
      if (s1.slice(0, 5) === s2.slice(0, 5)) return true;
      return false;
    };

    let loadedDoctors = [];

    try {
      const response = await fetch(
        `http://localhost:8000/opd/doctors-queue/${encodeURIComponent(symptomDepartment)}`
      );

      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          loadedDoctors = data;
        }
      }
    } catch (error) {
      console.error('Error loading doctors for department:', error);
    }

    // Fallback: If opd/doctors-queue returned empty or failed, use allDoctors from state
    if (loadedDoctors.length === 0 && allDoctors.length > 0) {
      const activeDocs = allDoctors.filter(
        (d) => String(d.status || '').toLowerCase() === 'active'
      );
      const matchedDocs = (activeDocs.length > 0 ? activeDocs : allDoctors).filter(
        (d) => matchesSpec(d.specialization, symptomDepartment)
      );
      const fallbackList =
        matchedDocs.length > 0
          ? matchedDocs
          : activeDocs.length > 0
          ? activeDocs
          : allDoctors;

      loadedDoctors = fallbackList.map((doc, idx) => ({
        did: doc.did,
        name: doc.name,
        specialization: doc.specialization,
        avg_time: doc.avg_time || 10,
        queue_count: 0,
        estimated_wait_time: 0,
        is_recommended: idx === 0,
      }));
    }

    setAvailableDoctors(loadedDoctors);

    // CRITICAL: Automatically select and display the recommended (or first) doctor
    const bestDoc = loadedDoctors.find((d) => d.is_recommended) || loadedDoctors[0];
    if (bestDoc) {
      setSelectedDoctorId(String(bestDoc.did));
    } else {
      setSelectedDoctorId('');
    }
  };

  const handleGenerateToken = async (e) => {
    e.preventDefault();
    const name = patientName.trim();
    const phone = phoneNumber.trim();
    if (!name || !phone || !dob || !age || !address || !selectedSymptom) {
      alert("Please complete all required patient and symptom details.");
      return;
    }

    if (!department) {
      alert("No department is configured for the selected symptom.");
      return;
    }

    const patientDob = dob;
    const patientAge = parseInt(age);
    const patientAddress = address.trim();

    const foundSymptom = symptoms.find((sym) => sym.symptom_name === selectedSymptom);

    if (!foundSymptom) {
      alert("Please select a valid symptom from the database.");
      return;
    }

    const sid = foundSymptom.sid;

    try {
      const response = await fetch("http://localhost:8000/opd/register", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          name: name,
          dob: patientDob,
          age: patientAge,
          gender: gender,
          email: email,
          contact: phone,
          address: patientAddress,
          specialization: department,
          sid: sid,
          did: selectedDoctorId ? parseInt(selectedDoctorId) : null,
        }),
      });

      const resData = await response.json();

      if (response.ok && resData.token) {
        if (resData.already_registered) {
          alert(resData.message || "Patient already has an active token today. Reprinting existing slip.");
        }
        if (resData.email_sent === false) {
          alert("Token created successfully, but the confirmation email could not be sent.");
        }
        const newEntry = {
          token: `#${resData.token}`,
          name: resData.patient_name || name,
          dob: patientDob,
          age: patientAge,
          gender: gender,
          phone: phone,
          email: email || 'patient@example.com',
          address: patientAddress,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: priority === 'Emergency' ? 'Token Printed' : 'Waiting',
          statusColor: priority === 'Emergency' ? 'blue' : 'green',
          dept: department.toUpperCase(),
          symptom: selectedSymptom,
          priorityScore: priorityScore,
          doctorName: resData.doctor_name,
          queuePos: resData.queue_position,
          estWait: resData.estimated_wait_time,
        };

        await fetchDashboardData();
        handleClearForm();

        // Refresh doctor queue load metrics
        fetch(`http://localhost:8000/opd/doctors-queue/${department}`)
          .then((res) => res.json())
          .then((data) => setAvailableDoctors(data))
          .catch(() => { });
      } else {
        alert(resData.message || "Failed to complete OPD registration.");
      }
    } catch (err) {
      console.error("Error during OPD registration:", err);
      alert("Error connecting to OPD registration server.");
    }
  };

  const handleClearForm = () => {
    setPatientName('');
    setDob('');
    setAge('');
    setGender('Male');
    setEmail('');
    setPhoneNumber('');
    setAddress('');
    setDepartment('');
    setPriority('Low');
    setSelectedSymptom('');
    setPriorityScore(null);
    setSelectedDoctorId('');
    setAvailableDoctors([]);
  };


  return (
    <ReceptionistLayout activeTab="Dashboard">
      <div className="receptionist-dashboard-container space-y-8 animate-fadeIn">
        {/* Top Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center justify-between relative overflow-hidden reception-card-hover">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                TOTAL REGISTERED TODAY
              </p>
              <h4 className="text-3xl font-bold font-black text-slate-900 mb-2">{totalToday}</h4>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">person_add</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center justify-between reception-card-hover">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                EMERGENCY CASES
              </p>
              <h4 className="text-3xl font-black font-bold text-slate-900 mb-2">{emergencyCases.toString().padStart(2, '0')}</h4>
            </div>
            <div className="w-12 h-12 rounded-xl bg-red-50 text-red-500 flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">e911_emergency</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center justify-between reception-card-hover">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                AVG. WAIT TIME
              </p>
              <h4 className="text-3xl font-bold font-black text-slate-900 mb-2">
                {avgWaitTime}<span className="text-xl font-semibold text-slate-600">m</span>
              </h4>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">schedule</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 text-white shadow-md relative overflow-hidden flex flex-col justify-between">
            <div>
              <p className="text-xs font-semibold tracking-wider uppercase text-blue-200 mb-1">
                RECEPTION STATION
              </p>
              <h4 className="text-2xl font-black font-bold mb-3">Main Reception</h4>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold bg-white/10 w-fit px-3 py-1.5 rounded-full backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Staff: {staffName}</span>
            </div>
          </div>
        </div>

        {/* Form and Live Queue Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div id="patient-form" className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-2xl font-semibold text-slate-900">Patient Registration</h3>
                  <p className="text-sm text-slate-500 mt-0.5">
                    Register new patient details to generate an instant OPD queue token.
                  </p>
                </div>
                <div className="bg-slate-100 border border-slate-200 px-4 py-2 rounded-xl">
                  <span className="text-xs font-semibold uppercase text-slate-400 block">NEXT OPD TOKEN</span>
                  <span className="text-xl font-black text-blue-600">
                    {selectedDoctorId && availableDoctors.length > 0
                      ? `#${availableDoctors.find((d) => String(d.did) === String(selectedDoctorId))?.next_token ?? (totalToday + 101)}`
                      : '#000'}
                  </span>
                  <span className="text-[10px] text-slate-400 block font-semibold">per-doctor daily sequence</span>
                </div>
              </div>

              <form onSubmit={handleGenerateToken} className="space-y-6">
                {/* SECTION 1: PATIENT DEMOGRAPHICS */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2">
                    1. Patient Demographic Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase mb-2">
                        Patient Full Name
                      </label>
                      <input
                        required
                        type="text"
                        value={patientName}
                        onChange={(e) => setPatientName(e.target.value)}
                        placeholder="e.g. Priya Sharma"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase mb-2">
                        Mobile Number
                      </label>
                      <input
                        required
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase mb-2">
                        Date of Birth
                      </label>
                      <input
                        required
                        type="date"
                        value={dob}
                        onChange={handleDobChange}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase mb-2">
                        Age
                      </label>
                      <input
                        required
                        type="number"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        placeholder="Calculated from DOB"
                        className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-slate-800 text-sm font-semibold focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase mb-2">
                        Gender
                      </label>
                      <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
                      >
                        <option>Male</option>
                        <option>Female</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase mb-2">
                        Email Address
                      </label>
                      <input
                        required
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="john@gmail.com"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase mb-2">
                        Residential Address
                      </label>
                      <input
                        required
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="House No, Area, City"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* SECTION 2: OPD CONSULTATION & ROUTING */}
                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2">
                    2. OPD Consultation & Doctor Routing
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase mb-2">
                        Select Symptom (Primary Medical Trigger)
                      </label>
                      <select
                        value={selectedSymptom}
                        onChange={handleSymptomChange}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none font-medium"
                      >
                        <option value="">Select Symptom</option>
                        {symptoms.map((sym) => (
                          <option key={sym.sid} value={sym.symptom_name}>
                            {sym.symptom_name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-xs font-semibold text-slate-700 uppercase">
                          Priority Level & Score
                        </label>
                        {priorityScore !== null && (
                          <span className="text-xs font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                            Score: {priorityScore}
                          </span>
                        )}
                      </div>
                      <div className="grid grid-cols-4 gap-2">
                        {['Low', 'Medium', 'High', 'Emergency'].map((p) => (
                          <button
                            key={p}
                            type="button"
                            onClick={() => setPriority(p)}
                            className={`py-2.5 px-1 rounded-xl font-semibold text-xs border transition-all text-center ${priority === p
                              ? p === 'Emergency'
                                ? 'bg-red-50 border-red-500 text-red-600 ring-1 ring-red-400/20'
                                : p === 'Medium'
                                  ? 'bg-amber-50 border-amber-500 text-amber-700 ring-1 ring-amber-400/20'
                                  : p === 'Low'
                                    ? 'bg-blue-50 border-blue-500 text-blue-700 ring-1 ring-blue-400/20'
                                    : 'bg-yellow-50 border-yellow-600 text-yellow-600 ring-1 ring-yellow-400/20'
                              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                              }`}
                            disabled
                          >
                            {p}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase mb-2">
                        Specialization / Department
                      </label>
                      <select
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none font-medium"
                        disabled
                      >
                        {!department && <option value="">Select symptom first</option>}
                        {department && !departmentsList.includes(department) && (
                          <option value={department}>{department}</option>
                        )}
                        {departmentsList.map((dept) => (
                          <option key={dept} value={dept}>{dept}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase mb-2 flex items-center justify-between">
                        <span>Assigned Doctor ({department || 'Select symptom first'})</span>
                        {selectedDoctorId && availableDoctors.length > 0 && (
                          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            Auto Assigned
                          </span>
                        )}
                      </label>
                      <select
                        value={selectedDoctorId}
                        onChange={(e) => setSelectedDoctorId(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 disabled rounded-xl text-slate-800 text-sm focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none font-medium cursor-pointer"
                        disabled={availableDoctors.length === 0}
                      >
                        {availableDoctors.length === 0 ? (
                          <option value="">
                            {selectedSymptom ? 'No doctor available for this department' : 'Select symptom first'}
                          </option>
                        ) : (
                          availableDoctors.map((doc) => (
                            <option key={doc.did} value={String(doc.did)}>
                              {doc.name} ({doc.specialization ? `${doc.specialization} • ` : ''}{doc.queue_count ?? 0} in queue • {doc.estimated_wait_time ?? 0} min wait){doc.is_recommended ? ' ⭐ Shortest Queue' : ''}
                            </option>
                          ))
                        )}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={handleClearForm}
                    className="px-6 py-3 bg-white border border-slate-200 text-slate-700 font-semibold text-sm rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    Clear Form
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-blue-600 text-white font-semibold text-sm rounded-xl shadow-lg shadow-blue-500/30 hover:bg-blue-700 flex items-center gap-2 transition-all"
                  >
                    <span className="material-symbols-outlined text-lg font-semibold">confirmation_number</span>
                    Generate OPD Token
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <h4 className="text-xl font-bold font-black text-slate-900">Live Queue ({queueList.length})</h4>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" title="Live Auto-Sync Active" />
                </div>
                <button
                  type="button"
                  onClick={fetchDashboardData}
                  className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-800 transition-colors"
                  title="Refresh Queue"
                >
                  <span className="material-symbols-outlined text-lg">sync</span>
                </button>
              </div>
              <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
                {queueList.map((item, idx) => {
                  const isEmergency = item.priority === 'Emergency';
                  const isHigh = item.priority === 'High';
                  const isMedium = item.priority === 'Medium';
                  return (
                    <div
                      key={item.qid || idx}
                      className={`grid grid-cols-[auto_minmax(0,1fr)] items-center gap-4 rounded-2xl border p-4 transition-all sm:grid-cols-[auto_minmax(0,1fr)_auto] ${isEmergency
                          ? 'bg-red-50 border-2 border-red-400 shadow-sm ring-1 ring-red-400/20'
                          : isHigh
                            ? 'bg-amber-50 border-2 border-amber-300'
                            : 'bg-white border-slate-100 hover:bg-slate-50'
                        }`}
                    >
                      <div className="flex min-w-[64px] flex-col items-center border-r border-slate-200 pr-4">
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Token</span>
                        <span className={`text-2xl font-black ${isEmergency ? 'text-red-600' : 'text-blue-600'}`}>
                          {item.token}
                        </span>
                        <span className="mt-1 text-[10px] font-bold text-slate-400">
                          Pos #{item.queuePos || idx + 1}
                        </span>
                      </div>

                      <div className="min-w-0 space-y-1">
                        <div className="flex min-w-0 items-center gap-2">
                          <h5 className={`truncate text-base font-black ${isEmergency ? 'text-red-950' : 'text-slate-900'}`}>
                            {item.name}
                          </h5>
                          <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-black uppercase ${isEmergency
                            ? 'bg-red-600 text-white'
                            : isHigh
                              ? 'bg-amber-500 text-white'
                              : isMedium
                                ? 'bg-yellow-500 text-white'
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                            {item.priority || 'Low'}
                          </span>
                        </div>
                        <p className="truncate text-xs font-bold text-slate-700">{item.dept} • {item.doctorName}</p>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-semibold text-slate-500">
                          <span>Est. wait: {item.estWait ?? 0} min</span>
                          <p className="text-xs font-bold text-emerald-600">
                            {item.waitingMinutes} min waiting • +5 bonus in {item.nextBonusIn} min
                          </p>
                        </div>
                      </div>
                      <div className="col-span-2 flex min-w-[104px] items-center justify-between gap-3 border-t border-slate-100 pt-3 sm:col-span-1 sm:flex-col sm:items-end sm:border-t-0 sm:pt-0">
                        <span className="text-xs font-semibold text-slate-400">{item.time}</span>
                        <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-black text-slate-700">
                          {item.status || 'Waiting'}
                        </span>
                      </div>
                    </div>
                  );
                })}
                {queueList.length === 0 && (
                  <p className="text-xs text-center text-slate-400 py-6">No patients currently in live queue.</p>
                )}
              </div>
              <div className="pt-4 mt-4 border-t border-slate-100 text-center">
                <button
                  onClick={() => navigate('/receptionist/queue-board')}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-800"
                >
                  View Real-Time Queue Dashboard →
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </ReceptionistLayout>
  );
}