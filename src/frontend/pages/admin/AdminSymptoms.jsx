// ============================================================
//  AdminSymptoms.jsx  –  Symptoms Master Management Page
// ============================================================

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';

export default function AdminSymptoms() {
  const navigate = useNavigate();
  // Initial Symptoms Master Data State
  const [symptomsList, setSymptomsList] = useState([]);

  // Filter & Search States
  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [prioFilter, setPrioFilter] = useState('All');

  // Modal State Controls
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSymptom, setEditingSymptom] = useState(null);

  // Form Field States
  const [formSymptomName, setFormSymptomName] = useState('');
  const [formSpecialization, setFormSpecialization] = useState('General Medicine');
  const [formPriority, setFormPriority] = useState('Low');
  const [formPriorityScore, setFormPriorityScore] = useState(15);
  const [formDescription, setFormDescription] = useState('');

  // Department List
  const departments = ['All', 'General Medicine', 'Cardiology', 'Orthopedics', 'Neurology', 'Pediatrics'];

  useEffect(() => {
    fetch("http://localhost:8000/symptoms")
      .then((res) => res.json())
      .then((data) => {
        setSymptomsList(data);
        console.log(data);
      })
  }, [])

  const resetForm = () => {
    setFormSymptomName('');
    setFormSpecialization('General Medicine');
    setFormPriority('Low');
    setFormPriorityScore(15);
    setFormDescription('');
    setEditingSymptom(null);
  };

  const handleOpenAddModal = () => {
    resetForm();
    setShowAddModal(true);
  };

  const handleOpenEditModal = (sym) => {
    setEditingSymptom(sym);
    setFormSymptomName(sym.symptom_name);
    setFormSpecialization(sym.specialization);
    setFormPriority(sym.priority);
    setFormPriorityScore(sym.priority_score);
    setFormDescription(sym.description || '');
    setShowAddModal(true);
  };

  const handleSaveSymptom = (e) => {
    e.preventDefault();
    if (!formSymptomName.trim()) {
      alert("Please enter a valid symptom name.");
      return;
    }

    if (editingSymptom) {
      // Update existing item
      setSymptomsList(prev =>
        prev.map(item =>
          item.sid === editingSymptom.sid
            ? {
              ...item,
              symptom_name: formSymptomName.trim(),
              specialization: formSpecialization,
              priority: formPriority,
              priority_score: Number(formPriorityScore),
              description: formDescription.trim()
            }
            : item
        )
      );
    } else {
      // Add new item
      const newSid = symptomsList.length > 0 ? Math.max(...symptomsList.map(s => s.sid)) + 1 : 1;
      const newSymptomObj = {
        sid: newSid,
        symptom_name: formSymptomName.trim(),
        specialization: formSpecialization,
        priority: formPriority,
        priority_score: Number(formPriorityScore),
        description: formDescription.trim()
      };
      setSymptomsList([newSymptomObj, ...symptomsList]);
    }

    setShowAddModal(false);
    resetForm();
  };

  const handleDeleteSymptom = (sid, name) => {
    if (window.confirm(`Are you sure you want to delete symptom: "${name}"?`)) {
      fetch(`http://localhost:8000/symptoms/${sid}`, {
        method: "DELETE"
      })
        .then((res) => {
          if (res.ok) {
            setSymptomsList(prev => prev.filter(s => s.sid !== sid));
            alert("Symptom deleted successfully.");
          } else {
            alert("Failed to delete symptom from server.");
          }
        })
        .catch((err) => {
          console.error("Error deleting symptom:", err);
          setSymptomsList(prev => prev.filter(s => s.sid !== sid));
        });
    }
  };

  // Filtered List Math
  const filteredSymptoms = symptomsList.filter(s => {
    const matchesSearch =
      (s.symptom_name && s.symptom_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (s.specialization && s.specialization.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (s.sid && s.sid.toString().includes(searchQuery));

    const matchesDept = deptFilter === 'All' || s.specialization === deptFilter;
    const matchesPrio = prioFilter === 'All' || s.priority === prioFilter;

    return matchesSearch && matchesDept && matchesPrio;
  });

  const emergencyCount = symptomsList.filter(s => (s.priority || '').toLowerCase() === 'emergency' || Number(s.priority_score) >= 90).length;
  const highCount = symptomsList.filter(s => (s.priority || '').toLowerCase() === 'high' || (Number(s.priority_score) >= 70 && Number(s.priority_score) < 90)).length;

  return (
    <AdminLayout>
      <div className="space-y-6 animate-fadeIn p-2 sm:p-4">

        {/* Header Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
          <div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-3xl text-blue-600">coronavirus</span>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Symptoms Master Registry</h1>
            </div>
            <p className="text-sm font-semibold text-slate-500 mt-1">
              Configure OPD clinical symptoms, priority scoring, and department auto-routing rules.
            </p>
          </div>

          <button
            onClick={() => navigate('/admin/add-symptom')}
            className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2 shrink-0"
          >
            <span className="material-symbols-outlined text-lg font-bold">add_circle</span>
            Add New Symptom
          </button>
        </div>

        {/* Top Summary Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-black text-slate-400 uppercase tracking-wider mb-1">TOTAL SYMPTOMS</p>
              <h4 className="text-3xl font-black text-slate-900">{symptomsList.length}</h4>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-black text-xl">
              📋
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-red-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-black text-slate-400 uppercase tracking-wider mb-1">EMERGENCY LEVEL</p>
              <h4 className="text-3xl font-black text-red-600">{emergencyCount}</h4>
            </div>
            <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-black text-xl">
              🚨
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-amber-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-black text-slate-400 uppercase tracking-wider mb-1">HIGH PRIORITY</p>
              <h4 className="text-3xl font-black text-amber-600">{highCount}</h4>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-black text-xl">
              ⚡
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-black text-slate-400 uppercase tracking-wider mb-1">SPECIALIZATIONS</p>
              <h4 className="text-3xl font-black text-indigo-600">{departments.length - 1}</h4>
            </div>
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-xl">
              🏥
            </div>
          </div>
        </div>

        {/* Main Directory Table Container */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">

          {/* Controls & Filter Bar */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-100">

            {/* Department Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              <span className="text-xs font-black text-slate-400 uppercase tracking-wider mr-1">DEPT:</span>
              {departments.map((dept) => (
                <button
                  key={dept}
                  onClick={() => setDeptFilter(dept)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${deptFilter === dept
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                >
                  {dept}
                </button>
              ))}
            </div>

            {/* Priority Filter & Search Bar */}
            <div className="flex items-center gap-3">
              <select
                value={prioFilter}
                onChange={(e) => setPrioFilter(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="All">All Priorities</option>
                <option value="Emergency">Emergency</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>

              <div className="relative w-full sm:w-64">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search symptom, dept..."
                  className="w-full pl-9 pr-7 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
                <span className="material-symbols-outlined absolute left-2.5 top-2.5 text-slate-400 text-base">search</span>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 text-xs font-bold"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Table Directory */}
          <div className="overflow-x-auto border border-slate-200 rounded-2xl">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-xs font-black text-slate-500 uppercase tracking-wider bg-slate-50">
                  <th className="py-4 px-4">SID</th>
                  <th className="py-4 px-4">Symptom Name</th>
                  <th className="py-4 px-4">Specialization</th>
                  <th className="py-4 px-4">Priority Level</th>
                  <th className="py-4 px-4">Priority Score</th>
                  <th className="py-4 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filteredSymptoms.map((sym) => {
                  const isEmerg = sym.priority === 'Emergency';
                  const isHigh = sym.priority === 'High';
                  const isMed = sym.priority === 'Medium';

                  return (
                    <tr key={sym.sid} className="hover:bg-slate-50/70 transition-colors group">
                      <td className="py-4 px-4">
                        <span className="font-black text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100 text-xs">
                          #SID-{sym.sid}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-black text-slate-900 text-sm block">{sym.symptom_name}</span>
                        {sym.description && (
                          <span className="text-xs text-slate-400 font-medium block max-w-sm truncate">
                            {sym.description}
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <span className="px-3 py-1 bg-slate-100 text-slate-800 font-bold text-xs rounded-lg border border-slate-200">
                          {sym.specialization}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider inline-flex items-center gap-1 ${isEmerg
                            ? 'bg-red-600 text-white shadow-sm'
                            : isHigh
                              ? 'bg-amber-500 text-white'
                              : isMed
                                ? 'bg-yellow-500 text-white'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                        >
                          {isEmerg && '🚨'} {sym.priority}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-black text-slate-800 text-sm bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
                          Score: {sym.priority_score}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEditModal(sym)}
                            className="px-3 py-1.5 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors flex items-center gap-1"
                          >
                            <span className="material-symbols-outlined text-sm">edit</span>
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteSymptom(sym.sid, sym.symptom_name)}
                            className="px-3 py-1.5 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors flex items-center gap-1"
                          >
                            <span className="material-symbols-outlined text-sm">delete</span>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {filteredSymptoms.length === 0 && (
                  <tr>
                    <td colSpan="6" className="py-12 text-center text-slate-400">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <span className="material-symbols-outlined text-4xl text-slate-300">search_off</span>
                        <p className="text-sm font-semibold">No matching symptom master records found.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
}
