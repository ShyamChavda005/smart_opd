// ============================================================
//  ReceptionistDashboard.jsx  –  Receptionist Dashboard Page
// ============================================================

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReceptionistLayout from '../../components/receptionist/ReceptionistLayout';
import '../../style/receptionist/ReceptionistDashboard.css';

export default function ReceptionistDashboard() {
  const navigate = useNavigate();
  const [priority, setPriority] = useState('Normal');

  // Registration Form states
  const [patientName, setPatientName] = useState('');
  const [dob, setDob] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('Male');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [department, setDepartment] = useState('General Medicine');
  const [currentTokenNum, setCurrentTokenNum] = useState(482);
  const [totalToday, setTotalToday] = useState(142);

  const [queueList, setQueueList] = useState([
    {
      token: '#481',
      name: 'Priya Sharma',
      dob: '1996-04-12',
      age: '30',
      gender: 'Female',
      phone: '+91 98765 43210',
      email: 'priya.sharma@example.com',
      address: 'B-104, MG Road, Mumbai, Maharashtra',
      time: '12:45 PM',
      status: 'Waiting',
      statusColor: 'green',
      dept: 'CARDIOLOGY',
    },
    {
      token: '#480',
      name: 'Rajesh Kumar',
      dob: '1988-11-20',
      age: '37',
      gender: 'Male',
      phone: '+91 91234 56789',
      email: 'rajesh.k@example.com',
      address: '45 Park Street, Connaught Place, New Delhi',
      time: '12:42 PM',
      status: 'Token Printed',
      statusColor: 'blue',
      dept: 'EMERGENCY',
    },
    {
      token: '#479',
      name: 'Ananya Iyer',
      dob: '2018-02-15',
      age: '8',
      gender: 'Female',
      phone: '+91 99887 76655',
      email: 'iyer.family@example.com',
      address: '12 Anna Salai, T. Nagar, Chennai, Tamil Nadu',
      time: '12:38 PM',
      status: 'Waiting',
      statusColor: 'green',
      dept: 'PEDIATRICS',
    },
    {
      token: '#478',
      name: 'David Chen',
      dob: '1992-08-05',
      age: '33',
      gender: 'Male',
      phone: '+91 88776 65544',
      email: 'david.chen@example.com',
      address: '88 Indiranagar 100ft Road, Bengaluru, Karnataka',
      time: '12:35 PM',
      status: 'Registered',
      statusColor: 'orange',
      dept: 'GENERAL MED',
    },
  ]);

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

  const handleGenerateToken = (e) => {
    e.preventDefault();
    const tokenStr = `#${currentTokenNum}`;
    const name = patientName.trim() || 'New Patient';
    const phone = phoneNumber.trim() || '+91 98765 43210';
    const patientDob = dob || '1996-01-01';
    const patientAge = age || '30';
    const patientAddress = address.trim() || 'Main City Ward, India';

    const newEntry = {
      token: tokenStr,
      name: name,
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
    };

    setQueueList([newEntry, ...queueList]);
    setCurrentTokenNum((prev) => prev + 1);
    setTotalToday((prev) => prev + 1);
    alert(`Token ${tokenStr} generated for ${name}!`);
    handleClearForm();
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
    setPriority('Normal');
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
              <h4 className="text-3xl font-black text-slate-900 mb-2">08</h4>
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
                18<span className="text-xl font-semibold text-slate-600">m</span>
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
              <span>Staff: Sarah Jenkins</span>
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
                  <span className="text-xs font-bold uppercase text-slate-400 block">CURRENT TOKEN</span>
                  <span className="text-xl font-black text-blue-600">#{currentTokenNum}</span>
                </div>
              </div>

              <form onSubmit={handleGenerateToken} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                      Patient Name
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
                      <option>Other</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                      Department
                    </label>
                    <select
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
                    >
                      <option>General Medicine</option>
                      <option>Cardiology</option>
                      <option>Pediatrics</option>
                      <option>Orthopedics</option>
                      <option>Neurology</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                      Priority Level
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {['Normal', 'Urgent', 'Emergency'].map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setPriority(p)}
                          className={`py-3 px-3 rounded-xl font-bold text-xs border transition-all ${
                            priority === p
                              ? p === 'Emergency'
                                ? 'bg-red-50 border-red-500 text-red-600 ring-2 ring-red-400/20'
                                : p === 'Urgent'
                                ? 'bg-amber-50 border-amber-500 text-amber-700 ring-2 ring-amber-400/20'
                                : 'bg-blue-50 border-blue-600 text-blue-600 ring-2 ring-blue-400/20'
                              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={handleClearForm}
                    className="px-6 py-3 bg-white border border-slate-200 text-slate-700 font-bold text-sm rounded-xl hover:bg-slate-50"
                  >
                    Clear Form
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-blue-600 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-500/30 hover:bg-blue-700 flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-lg font-bold">confirmation_number</span>
                    Generate Token
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
                {queueList.map((item, idx) => (
                  <div key={idx} className="p-4 rounded-2xl border border-slate-100 bg-white shadow-sm flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-black text-blue-600">{item.token}</span>
                      <h5 className="font-bold text-slate-900 text-sm mt-0.5">{item.name}</h5>
                      <span className="text-xs text-slate-500 font-medium">{item.dept} • {item.phone}</span>
                    </div>
                    <button
                      onClick={() => handleRemoveToken(item.token)}
                      className="text-slate-300 hover:text-red-500 p-1"
                    >
                      <span className="material-symbols-outlined text-lg">check_circle</span>
                    </button>
                  </div>
                ))}
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
      </div>
    </ReceptionistLayout>
  );
}
