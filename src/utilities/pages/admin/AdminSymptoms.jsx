// ============================================================
//  AdminSymptoms.jsx  –  Symptoms Master Management Page
// ============================================================

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import axios from 'axios';

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

  const handleSaveSymptom = async (e) => {
    e.preventDefault();

    if (!formSymptomName.trim()) {
      alert("Please enter a valid symptom name.");
      return;
    }

    const symptomData = {
      symptom_name: formSymptomName.trim(),
      specialization: formSpecialization,
      priority: formPriority,
      priority_score: Number(formPriorityScore),
      is_active: editingSymptom ? editingSymptom.is_active : true,
    };

    try {
      if (editingSymptom) {
        // UPDATE
        const response = await axios.put(
          `http://localhost:8000/symptoms/${editingSymptom.sid}`,
          symptomData
        );

        setSymptomsList((prev) =>
          prev.map((s) =>
            s.sid === editingSymptom.sid ? response.data : s
          )
        );

        alert("Symptom updated successfully.");
      } else {
        // ADD
        const response = await axios.post(
          "http://localhost:8000/symptoms",
          symptomData
        );

        setSymptomsList((prev) => [response.data, ...prev]);

        alert("Symptom added successfully.");
      }

      setShowAddModal(false);
      resetForm();

    } catch (error) {
      console.error("Error saving symptom:", error);

      const data = error.response?.data;

      let message = "Failed to save symptom.";

      if (typeof data === "string") {
        message = data;
      } else if (data?.detail) {
        message =
          typeof data.detail === "string"
            ? data.detail
            : JSON.stringify(data.detail);
      } else if (data?.message) {
        message = data.message;
      } else if (error.message) {
        message = error.message;
      }

      alert(message);
    }
  };


  const handleDeleteSymptom = async (sid, name) => {
    if (!window.confirm(`Are you sure you want to delete symptom: "${name}"?`)) {
      return;
    }

    try {
      const response = await axios.delete(
        `http://localhost:8000/symptoms/${sid}`
      );

      if (response.status === 200) {
        setSymptomsList((prev) =>
          prev.filter((s) => s.sid !== sid)
        );

        alert("Symptom deleted successfully.");
      }

    } catch (error) {
      console.error("Error deleting symptom:", error);

      alert(
        error.response?.data?.detail ||
        "Failed to delete symptom."
      );
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

          <button onClick={() => navigate('/admin/add-symptom')}
            className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2 shrink-0">
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
          </div>

          <div className="bg-white rounded-2xl p-5 border border-red-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-black text-slate-400 uppercase tracking-wider mb-1">EMERGENCY LEVEL</p>
              <h4 className="text-3xl font-black text-red-600">{emergencyCount}</h4>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-amber-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-black text-slate-400 uppercase tracking-wider mb-1">HIGH PRIORITY</p>
              <h4 className="text-3xl font-black text-amber-600">{highCount}</h4>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-black text-slate-400 uppercase tracking-wider mb-1">SPECIALIZATIONS</p>
              <h4 className="text-3xl font-black text-indigo-600">{departments.length - 1}</h4>
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
                  const isMedium = sym.priority === 'Medium';
                  const isLow = sym.priority === 'Low';

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
                            ? 'bg-red-600 text-white shadow-sm' : isHigh ? 'bg-amber-500 text-white'
                              : isMedium ? 'bg-yellow-500 text-white'
                                : isLow ? 'bg-blue-100 text-blue-800' : 'bg-blue-100 text-blue-800'
                            }`}
                        >
                          {isEmerg} {sym.priority}
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

        {/* Add / Edit Symptom Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 relative">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  resetForm();
                }}
                className="absolute top-6 right-6 text-slate-400 hover:text-slate-700 p-2 rounded-full hover:bg-slate-100"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
              <h3 className="text-xl font-extrabold text-slate-900 mb-1">
                {editingSymptom ? 'Edit Symptom Rule' : 'Add New Symptom Rule'}
              </h3>
              <p className="text-xs text-slate-500 mb-5 mt-2">
                Configure symptom name, triage priority level, and routing department
              </p>

              <form onSubmit={handleSaveSymptom} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Symptom Name</label>
                  <input
                    required
                    type="text"
                    value={formSymptomName}
                    onChange={(e) => setFormSymptomName(e.target.value)}
                    placeholder="e.g. Acute Chest Discomfort"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Department</label>
                    <select
                      value={formSpecialization}
                      onChange={(e) => setFormSpecialization(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
                    >
                      <option value="General Medicine">General Medicine</option>
                      <option value="Cardiology">Cardiology</option>
                      <option value="Pediatrics">Pediatrics</option>
                      <option value="Orthopedics">Orthopedics</option>
                      <option value="Neurology">Neurology</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Priority</label>
                    <select
                      value={formPriority}
                      onChange={(e) => {
                        const val = e.target.value;
                        setFormPriority(val);
                        setFormPriorityScore(val === 'Emergency' ? 100 : val === 'High' ? 80 : val === 'Medium' ? 60 : 40);
                      }}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none">
                      <option value="Emergency">Emergency (Score: 100)</option>
                      <option value="High">High (Score: 80)</option>
                      <option value="Medium">Medium (Score: 60)</option>
                      <option value="Low">Low (Score: 40)</option>
                    </select>
                  </div>
                </div>

                <div className="pt-3 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      resetForm();
                    }}
                    className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md"
                  >
                    {editingSymptom ? 'Update Symptom' : 'Save Symptom'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  );
}
