// ============================================================
//  ReceptionistDashboard.jsx  –  Receptionist Dashboard Page
// ============================================================

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ReceptionistLayout from '../../components/receptionist/ReceptionistLayout';
import '../../style/receptionist/ReceptionistDashboard.css';

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
  const [department, setDepartment] = useState('General Medicine');
  const [totalToday, setTotalToday] = useState(0);
  const [emergencyCases, setEmergencyCases] = useState(0);
  const [avgWaitTime, setAvgWaitTime] = useState(15);
  const [departmentsList, setDepartmentsList] = useState([
    'General Medicine', 'Cardiology', 'Pediatrics', 'Orthopedics', 'Neurology'
  ]);
  const [staffName, setStaffName] = useState('Virat Kohli');

  const [queueList, setQueueList] = useState([]);

  // Symptoms states
  const [symptoms, setSymptoms] = useState([]);
  const [selectedSymptom, setSelectedSymptom] = useState('');
  const [priorityScore, setPriorityScore] = useState(null);

  // Doctors & Smart Queue load balancing states
  const [availableDoctors, setAvailableDoctors] = useState([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [printableTokenSlip, setPrintableTokenSlip] = useState(null);
  const [pendingPrintTicket, setPendingPrintTicket] = useState(null);

  const fetchLiveQueue = () => {
    Promise.all([
      fetch("http://localhost:8000/queues").then((r) => r.json()),
      fetch("http://localhost:8000/visits").then((r) => r.json()),
      fetch("http://localhost:8000/patients").then((r) => r.json()),
      fetch("http://localhost:8000/doctors").then((r) => r.json()),
      fetch("http://localhost:8000/symptoms").then((r) => r.json())
    ])
      .then(([qData, vData, pData, dData, sData]) => {
        const visitsMap = Array.isArray(vData) ? Object.fromEntries(vData.map((v) => [v.vid, v])) : {};
        const patientsMap = Array.isArray(pData) ? Object.fromEntries(pData.map((p) => [p.pid, p])) : {};
        const docsMap = Array.isArray(dData) ? Object.fromEntries(dData.map((d) => [d.did, d])) : {};
        const symptomsMap = Array.isArray(sData) ? Object.fromEntries(sData.map((s) => [s.sid, s])) : {};

        if (Array.isArray(qData)) {
          const liveEntries = qData.map((q) => {
            const v = visitsMap[q.vid] || {};
            const p = patientsMap[v.pid] || {};
            const d = docsMap[v.did] || {};
            const s = symptomsMap[v.sid] || {};

            return {
              qid: q.qid,
              token: `#${v.token || (100 + q.qid)}`,
              name: p.name || `Patient #${v.pid || 1}`,
              phone: p.contact || '',
              dept: (d.specialization || 'General Medicine').toUpperCase(),
              doctorName: d.name || 'Doctor',
              status: q.status || 'Waiting',
              queuePos: q.queue_position,
              estWait: q.estimated_wait_time,
              priority: s.priority || q.priority || 'Low',
              priorityScore: q.priority_score || (s ? s.priority_score : 10) || 10,
              time: q.create_at ? new Date(q.create_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'
            };
          });

          setQueueList(liveEntries);
        }
      })
      .catch((err) => console.error("Error fetching dashboard live queue:", err));
  };

  useEffect(() => {
    // Fetch symptoms master
    fetch("http://localhost:8000/symptoms")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const sortedData = [...data].sort((a, b) =>
            a.symptom_name.localeCompare(b.symptom_name)
          );
          setSymptoms(sortedData);
        }
      })
      .catch((err) => console.error("Error fetching symptoms:", err));

    // Fetch visits for today's total & emergency cases
    fetch("http://localhost:8000/visits")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setTotalToday(data.length);
          const emerg = data.filter(v => v.status === 'Emergency' || v.status === 'High').length;
          setEmergencyCases(emerg);
        }
      })
      .catch((err) => console.error("Error fetching visits:", err));

    // Fetch queues for average wait time calculation
    fetch("http://localhost:8000/queues")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const totalWait = data.reduce((acc, q) => acc + (q.estimated_wait_time || 0), 0);
          setAvgWaitTime(Math.round(totalWait / data.length) || 15);
        }
      })
      .catch((err) => console.error("Error fetching queues:", err));

    // Fetch doctors to extract dynamic specializations list
    fetch("http://localhost:8000/doctors")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const specs = Array.from(new Set(data.map(d => d.specialization).filter(Boolean)));
          if (specs.length > 0) {
            setDepartmentsList(specs);
          }
        }
      })
      .catch((err) => console.error("Error fetching doctors:", err));

    // Fetch receptionist info
    fetch("http://localhost:8000/receptionists")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setStaffName(data[0].name);
        }
      })
      .catch(() => { });

    fetchLiveQueue();
  }, []);

  useEffect(() => {
    if (department) {
      fetch(`http://localhost:8000/opd/doctors-queue/${department}`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setAvailableDoctors(data);
            const recDoc = data.find((d) => d.is_recommended);
            if (recDoc) {
              setSelectedDoctorId(recDoc.did.toString());
            } else if (data.length > 0) {
              setSelectedDoctorId(data[0].did.toString());
            } else {
              setSelectedDoctorId('');
            }
          } else {
            setAvailableDoctors([]);
            setSelectedDoctorId('');
          }
        })
        .catch((err) => console.error("Error fetching doctors queue:", err));
    }
  }, [department]);

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

  const getDeptForSymptom = (symptomName) => {
    if (!symptomName) return 'General Medicine';
    const s = symptomName.toLowerCase();

    if (s.includes('chest') || s.includes('heart') || s.includes('palpit') || s.includes('bp') || s.includes('blood pressure') || s.includes('cardiac')) {
      return 'Cardiology';
    }
    if (s.includes('bone') || s.includes('joint') || s.includes('fracture') || s.includes('knee') || s.includes('back') || s.includes('ortho')) {
      return 'Orthopedics';
    }
    if (s.includes('neuro') || s.includes('headache') || s.includes('migraine') || s.includes('brain') || s.includes('seizure') || s.includes('paralysis') || s.includes('dizziness')) {
      return 'Neurology';
    }
    if (s.includes('child') || s.includes('pediatric') || s.includes('infant') || s.includes('baby')) {
      return 'Pediatrics';
    }
    return 'General Medicine';
  };

  const handleSymptomChange = (e) => {
    const value = e.target.value;
    setSelectedSymptom(value);

    const foundSymptom = symptoms.find((sym) => sym.symptom_name === value);
    if (foundSymptom) {
      setPriorityScore(foundSymptom.priority_score);
      const dbPriority = foundSymptom.priority;
      const normalizedPriority = dbPriority.charAt(0).toUpperCase() + dbPriority.slice(1).toLowerCase();
      if (['Low', 'Medium', 'High', 'Emergency'].includes(normalizedPriority)) {
        setPriority(normalizedPriority);
      } else {
        setPriority(dbPriority);
      }

      // Auto-set department specialization directly from DB field or fallback mapper
      const autoDept = foundSymptom.specialization || getDeptForSymptom(value);
      setDepartment(autoDept);
    } else {
      setPriorityScore(null);
    }
  };

  const handleGenerateToken = async (e) => {
    e.preventDefault();
    const name = patientName.trim();
    const phone = phoneNumber.trim();
    const patientDob = dob || '2000-01-01';
    const patientAge = parseInt(age) || 25;
    const patientAddress = address.trim();

    const foundSymptom = symptoms.find((sym) => sym.symptom_name === selectedSymptom);
    const sid = foundSymptom ? foundSymptom.sid : 1;

    try {
      const response = await fetch("http://localhost:8000/opd/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          dob: patientDob,
          age: patientAge,
          gender: gender,
          email: email || 'patient@example.com',
          contact: phone,
          address: patientAddress,
          specialization: department,
          sid: sid,
          rid: 1,
          did: selectedDoctorId ? parseInt(selectedDoctorId) : null,
        }),
      });

      const resData = await response.json();

      if (response.ok && resData.token) {
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

        const ticketObj = {
          token: resData.token,
          patientName: resData.patient_name || name,
          patientId: resData.patient_id,
          doctorName: resData.doctor_name,
          specialization: resData.specialization,
          queuePos: resData.queue_position,
          estWait: resData.estimated_wait_time,
          priority: resData.priority,
          priorityScore: resData.priority_score,
          age: patientAge,
          gender: gender,
          contact: phone
        };

        setPendingPrintTicket(ticketObj);
        fetchLiveQueue();
        setTotalToday((prev) => prev + 1);
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
    setDepartment('General Medicine');
    setPriority('Low');
    setSelectedSymptom('');
    setPriorityScore(null);
  };

  const handleRemoveToken = (token) => {
    setQueueList(queueList.filter((item) => item.token !== token));
  };

  return (
    <ReceptionistLayout activeTab="Dashboard">
      <div className="receptionist-dashboard-container space-y-8 animate-fadeIn">
        {/* Top Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center justify-between relative overflow-hidden reception-card-hover">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                TOTAL REGISTERED TODAY
              </p>
              <h4 className="text-3xl font-black text-slate-900 mb-2">{totalToday}</h4>
              <p className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">trending_up</span>
                +12% from yesterday
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">person_add</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center justify-between reception-card-hover">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                EMERGENCY CASES
              </p>
              <h4 className="text-3xl font-black text-slate-900 mb-2">{emergencyCases.toString().padStart(2, '0')}</h4>
              <p className="text-xs font-bold text-red-500 flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">error</span> High urgency today
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-red-50 text-red-500 flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">e911_emergency</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center justify-between reception-card-hover">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                AVG. WAIT TIME
              </p>
              <h4 className="text-3xl font-black text-slate-900 mb-2">
                {avgWaitTime}<span className="text-xl font-semibold text-slate-600">m</span>
              </h4>
              <p className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">check_circle</span>
                Within optimal limit
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">schedule</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 text-white shadow-md relative overflow-hidden flex flex-col justify-between">
            <div>
              <p className="text-xs font-bold tracking-wider uppercase text-blue-200 mb-1">
                RECEPTION STATION
              </p>
              <h4 className="text-2xl font-black mb-3">Main Reception</h4>
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
                  <h3 className="text-2xl font-bold text-slate-900">Patient Registration</h3>
                  <p className="text-sm text-slate-500 mt-0.5">
                    Register new patient details to generate an instant OPD queue token.
                  </p>
                </div>
                <div className="bg-slate-100 border border-slate-200 px-4 py-2 rounded-xl">
                  <span className="text-xs font-bold uppercase text-slate-400 block">NEXT OPD TOKEN</span>
                  <span className="text-xl font-black text-blue-600">#{totalToday + 101}</span>
                </div>
              </div>

              <form onSubmit={handleGenerateToken} className="space-y-6">
                {/* SECTION 1: PATIENT DEMOGRAPHICS */}
                <div className="space-y-4">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2">
                    1. Patient Demographic Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
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
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
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
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
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
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                        Age
                      </label>
                      <input
                        required
                        type="number"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        placeholder="Calculated from DOB"
                        className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-slate-800 text-sm font-bold focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
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
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
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
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
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
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2">
                    2. OPD Consultation & Doctor Routing
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
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
                        <label className="text-xs font-bold text-slate-700 uppercase">
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
                            className={`py-2.5 px-1 rounded-xl font-bold text-xs border transition-all text-center ${priority === p
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
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                        Specialization / Department
                      </label>
                      <select
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none font-medium"
                        disabled>
                        {departmentsList.map((dept) => (
                          <option key={dept} value={dept}>{dept}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-2 flex items-center justify-between">
                        <span>Assigned Doctor (Queue Auto-Balanced)</span>
                      </label>
                      <select
                        value={selectedDoctorId}
                        onChange={(e) => setSelectedDoctorId(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none font-medium"
                        disabled>
                        {availableDoctors.map((doc) => (
                          <option key={doc.did} value={doc.did}>
                            {doc.name} ({doc.queue_count} in queue • ~{doc.estimated_wait_time}m wait) {doc.is_recommended ? '⭐ Shortest Queue' : ''}
                          </option>
                        ))}
                        {availableDoctors.length === 0 && <option value="">No active doctor available</option>}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={handleClearForm}
                    className="px-6 py-3 bg-white border border-slate-200 text-slate-700 font-bold text-sm rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    Clear Form
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-blue-600 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-500/30 hover:bg-blue-700 flex items-center gap-2 transition-all"
                  >
                    <span className="material-symbols-outlined text-lg font-bold">confirmation_number</span>
                    Generate OPD Token
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                <h4 className="text-xl font-bold text-slate-900">Live Queue ({queueList.length})</h4>
              </div>
              <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
                {queueList.map((item, idx) => {
                  const isEmergency = item.priority === 'Emergency';
                  const isHigh = item.priority === 'High';
                  const isMedium = item.priority === 'Medium';
                  return (
                    <div
                      key={idx}
                      className={`p-4 rounded-2xl border transition-all flex items-center justify-between ${
                        isEmergency
                          ? 'bg-red-50 border-2 border-red-400 shadow-sm ring-1 ring-red-400/20'
                          : isHigh
                          ? 'bg-amber-50 border-2 border-amber-300'
                          : 'bg-white border-slate-100 hover:bg-slate-50'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`text-2xl font-black ${isEmergency ? 'text-red-600' : 'text-blue-600'}`}>
                            {item.token}
                          </span>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-xs font-black uppercase ${
                              isEmergency
                                ? 'bg-red-600 text-white'
                                : isHigh
                                ? 'bg-amber-500 text-white'
                                : isMedium
                                ? 'bg-yellow-500 text-white'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {item.priority || 'Low'}
                          </span>
                        </div>
                        <h5 className={`font-black text-base ${isEmergency ? 'text-red-950' : 'text-slate-900'}`}>
                          {isEmergency ? '🚨 EMERGENCY: ' : ''}{item.name}
                        </h5>
                        <div className="text-xs text-slate-600 font-bold space-y-0.5">
                          <p className="text-slate-800 font-black">{item.dept} • {item.doctorName}</p>
                          <p className="text-xs text-slate-500">
                            Queue Pos: #{item.queuePos || idx + 1} • ~{item.estWait || 10}m wait
                          </p>
                        </div>
                      </div>
                      <div className="text-right flex flex-col items-end gap-1">
                        <span className="text-xs font-bold text-slate-400">{item.time}</span>
                        <span className="px-2.5 py-1 rounded-lg text-xs font-black bg-slate-100 text-slate-700">
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
                  className="text-xs font-bold text-blue-600 hover:text-blue-800"
                >
                  View Real-Time Queue Dashboard →
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* CONFIRMATION PROMPT MODAL */}
        {pendingPrintTicket && (
          <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-200 shadow-2xl space-y-5 text-center animate-scaleUp">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-3xl font-bold">
                ✓
              </div>
              <div>
                <span className="text-xs font-black text-emerald-600 uppercase tracking-wider">REGISTRATION SUCCESSFUL</span>
                <h3 className="text-xl font-bold text-slate-900 mt-1">OPD Token #{pendingPrintTicket.token} Issued</h3>
                <p className="text-xs text-slate-500 mt-1 font-medium">
                  Patient <strong className="text-slate-800">{pendingPrintTicket.patientName}</strong> has been registered and enqueued for <strong className="text-blue-600">{pendingPrintTicket.doctorName}</strong>.
                </p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs text-slate-700 font-semibold space-y-1">
                <p>Do you want to generate and print the OPD Token Slip ticket now?</p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={() => setPendingPrintTicket(null)}
                  className="w-full sm:w-1/2 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors"
                >
                  No, Skip to Dashboard
                </button>
                <button
                  onClick={() => {
                    setPrintableTokenSlip(pendingPrintTicket);
                    setPendingPrintTicket(null);
                  }}
                  className="w-full sm:w-1/2 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1"
                >
                  <span className="material-symbols-outlined text-sm">print</span>
                  Yes, Print Slip
                </button>
              </div>
            </div>
          </div>
        )}
        {/* PRINTABLE OPD TOKEN SLIP MODAL */}
        {printableTokenSlip && (
          <div className="printable-slip-overlay fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn print:p-0 print:bg-white print:static">
            <div className="printable-slip-card bg-white rounded-3xl p-8 max-w-md w-full border-2 border-dashed border-slate-300 shadow-2xl space-y-5 relative print:shadow-none print:w-full print:border-2 print:border-dashed print:border-slate-800">
              <button
                onClick={() => setPrintableTokenSlip(null)}
                className="absolute right-6 top-6 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 font-bold flex items-center justify-center print:hidden"
              >
                ✕
              </button>

              <div className="text-center space-y-1 border-b-2 border-slate-800 pb-4">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-600 text-white font-black text-xl mb-1 print:bg-black">
                  OPD
                </div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight">SMART OPD MEDICAL CENTER</h2>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Outpatient Registration Ticket</p>
              </div>

              <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-4 text-center space-y-1 print:bg-white print:border-slate-800">
                <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider block">OPD TOKEN NUMBER</span>
                <div className="text-4xl font-black text-blue-600 print:text-black">#{printableTokenSlip.token}</div>
                <span className="text-xs font-bold text-slate-600 block pt-1">
                  Queue Position: #{printableTokenSlip.queuePos} • Est. Wait: ~{printableTokenSlip.estWait}m
                </span>
              </div>

              <div className="space-y-2.5 text-xs font-medium">
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500 font-bold uppercase">Patient Name:</span>
                  <span className="font-extrabold text-slate-900">{printableTokenSlip.patientName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500 font-bold uppercase">Assigned Doctor:</span>
                  <span className="font-extrabold text-blue-600">{printableTokenSlip.doctorName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500 font-bold uppercase">Specialization:</span>
                  <span className="font-extrabold text-slate-900">{printableTokenSlip.specialization}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500 font-bold uppercase">Priority Level:</span>
                  <span className="font-extrabold text-slate-900">{printableTokenSlip.priority} (Score: {printableTokenSlip.priorityScore})</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500 font-bold uppercase">Age / Gender:</span>
                  <span className="font-extrabold text-slate-900">{printableTokenSlip.age} yrs / {printableTokenSlip.gender}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500 font-bold uppercase">Contact:</span>
                  <span className="font-extrabold text-slate-900">{printableTokenSlip.contact}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500 font-bold uppercase">Date &amp; Time:</span>
                  <span className="font-extrabold text-slate-900">{new Date().toLocaleString()}</span>
                </div>
              </div>

              <div className="pt-2 text-center text-[10px] text-slate-400 font-semibold border-t border-slate-200">
                *** Please retain this slip ticket until your token is called ***
              </div>

              <div className="pt-2 flex justify-end gap-3 print:hidden">
                <button
                  onClick={() => setPrintableTokenSlip(null)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
                >
                  Close
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-sm">print</span>
                  Print Slip Ticket
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ReceptionistLayout>
  );
}
