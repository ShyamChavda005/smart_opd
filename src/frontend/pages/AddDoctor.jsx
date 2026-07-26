// ============================================================
//  AddDoctor.jsx  –  Add New Doctor Page Component
// ============================================================

import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import '../style/AddDoctor.css';

// ---------- Custom Modern Date Picker ----------
function ModernDatePicker({ value, onChange, label, required }) {
  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState(() => {
    return value ? new Date(value) : new Date();
  });
  const datePickerRef = useRef(null);

  // Close calendar popover on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();

  const prevMonth = () => {
    setViewDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setViewDate(new Date(year, month + 1, 1));
  };

  const handleSelectDay = (day) => {
    const formattedMonth = String(month + 1).padStart(2, '0');
    const formattedDay = String(day).padStart(2, '0');
    const selectedDateStr = `${year}-${formattedMonth}-${formattedDay}`;
    onChange({ target: { name: 'dob', value: selectedDateStr } });
    setIsOpen(false);
  };

  const handleToday = () => {
    const today = new Date();
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const d = String(today.getDate()).padStart(2, '0');
    onChange({ target: { name: 'dob', value: `${y}-${m}-${d}` } });
    setViewDate(today);
    setIsOpen(false);
  };

  const handleClear = () => {
    onChange({ target: { name: 'dob', value: '' } });
    setIsOpen(false);
  };

  // Days grid
  const daysGrid = [];
  for (let i = 0; i < firstDayOfWeek; i++) {
    daysGrid.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    daysGrid.push(d);
  }

  const selectedDateObj = value ? new Date(value) : null;
  const selectedYear = selectedDateObj?.getFullYear();
  const selectedMonth = selectedDateObj?.getMonth();
  const selectedDay = selectedDateObj?.getDate();

  return (
    <div className="form-input-group" ref={datePickerRef} style={{ position: 'relative', zIndex: isOpen ? 100 : 1 }}>
      <label className="form-input-group__label">
        {label} {required && <span className="required-star">*</span>}
      </label>

      {/* Input Display Trigger */}
      <div
        className={`form-input-group__control custom-date-trigger ${isOpen ? 'custom-date-trigger--open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
      >
        <span style={{ color: value ? '#0b1c30' : 'rgba(67, 70, 85, 0.4)' }}>
          {value ? value : 'dd/mm/yyyy'}
        </span>
      </div>

      <button
        type="button"
        className="form-input-group__icon-button"
        onClick={() => setIsOpen(!isOpen)}
        style={{ top: '16px', right: '16px' }}
      >
        <span className="material-symbols-outlined">calendar_today</span>
      </button>

      {/* Modern Glassmorphic Calendar Popover */}
      {isOpen && (
        <div className="modern-calendar-popover">
          {/* Header */}
          <div className="modern-calendar__header">
            <div className="modern-calendar__title">
              <select
                className="modern-calendar__select"
                value={month}
                onChange={(e) => setViewDate(new Date(year, parseInt(e.target.value), 1))}
              >
                {monthNames.map((name, idx) => (
                  <option key={idx} value={idx}>{name}</option>
                ))}
              </select>
              <select
                className="modern-calendar__select"
                value={year}
                onChange={(e) => setViewDate(new Date(parseInt(e.target.value), month, 1))}
              >
                {Array.from({ length: 80 }, (_, i) => 2026 - i).map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
            <div className="modern-calendar__nav">
              <button type="button" onClick={prevMonth} className="modern-calendar__nav-btn">
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <button type="button" onClick={nextMonth} className="modern-calendar__nav-btn">
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          </div>

          {/* Weekday Labels */}
          <div className="modern-calendar__weekdays">
            <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
          </div>

          {/* Days Grid */}
          <div className="modern-calendar__days-grid">
            {daysGrid.map((day, index) => {
              if (day === null) {
                return <div key={`empty-${index}`} className="modern-calendar__day modern-calendar__day--empty" />;
              }

              const isSelected =
                selectedDateObj &&
                selectedYear === year &&
                selectedMonth === month &&
                selectedDay === day;

              const isToday =
                new Date().getFullYear() === year &&
                new Date().getMonth() === month &&
                new Date().getDate() === day;

              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => handleSelectDay(day)}
                  className={`modern-calendar__day ${isSelected ? 'modern-calendar__day--selected' : ''} ${isToday ? 'modern-calendar__day--today' : ''}`}
                >
                  {day}
                </button>
              );
            })}
          </div>

          {/* Footer Actions */}
          <div className="modern-calendar__footer">
            <button type="button" onClick={handleClear} className="modern-calendar__footer-btn">
              Clear
            </button>
            <button type="button" onClick={handleToday} className="modern-calendar__footer-btn modern-calendar__footer-btn--primary">
              Today
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------- Custom Modern Dropdown Component ----------
function ModernDropdown({ value, onChange, label, required, name, placeholder, options, icon }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close popover on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value);

  const handleSelect = (optValue) => {
    onChange({ target: { name, value: optValue } });
    setIsOpen(false);
  };

  return (
    <div
      className="form-input-group"
      ref={dropdownRef}
      style={{ position: 'relative', zIndex: isOpen ? 100 : 1 }}
    >
      <label className="form-input-group__label">
        {label} {required && <span className="required-star">*</span>}
      </label>

      {/* Trigger Display */}
      <div
        className={`form-input-group__control custom-date-trigger ${isOpen ? 'custom-date-trigger--open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        style={{ cursor: 'pointer', display: 'flex', items: 'center' }}
      >
        <span style={{ color: selectedOption ? '#0b1c30' : 'rgba(67, 70, 85, 0.4)' }}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
      </div>

      <button
        type="button"
        className="form-input-group__icon-button"
        onClick={() => setIsOpen(!isOpen)}
        style={{ top: '16px', right: '16px' }}
      >
        <span className="material-symbols-outlined">
          {icon || (isOpen ? 'expand_less' : 'expand_more')}
        </span>
      </button>

      {/* Modern Popover Menu */}
      {isOpen && (
        <div className="modern-dropdown-popover">
          {options.map((opt) => {
            const isSelected = value === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                className={`modern-dropdown__item ${isSelected ? 'modern-dropdown__item--selected' : ''}`}
                onClick={() => handleSelect(opt.value)}
              >
                <span>{opt.label}</span>
                {isSelected && (
                  <span className="material-symbols-outlined modern-dropdown__check">check</span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function AddDoctor() {
  const navigate = useNavigate();

  // ---------- Form State ----------
  const [formData, setFormData] = useState({
    fullName: '',
    dob: '',
    gender: '',
    email: '',
    phone: '',
    specialization: '',
    consultTime: 15,
    username: '',
    password: '',
    accountStatus: true,
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleReset = () => {
    setFormData({
      fullName: '',
      dob: '',
      gender: '',
      email: '',
      phone: '',
      specialization: '',
      consultTime: 15,
      username: '',
      password: '',
      accountStatus: true,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Registered Doctor Data:', formData);
    navigate('/admin/doctors');
  };

  return (
    <AdminLayout>
      <div className="add-doctor-page">
        {/* ---------- Breadcrumb ---------- */}
        <div className="add-doctor-breadcrumb">
          <span>Personnel</span>
          <span className="material-symbols-outlined">chevron_right</span>
          <span>Doctors</span>
          <span className="material-symbols-outlined">chevron_right</span>
          <span className="add-doctor-breadcrumb__active">Add Doctor</span>
        </div>

        {/* ---------- Header ---------- */}
        <div className="add-doctor-header">
          <h1 className="add-doctor-header__title">Add New Doctor</h1>
          <p className="add-doctor-header__desc">
            Enter the details below to register a new medical professional into the system.
            Ensure all mandatory fields are completed before saving.
          </p>
        </div>

        {/* ---------- Form Grid ---------- */}
        <form onSubmit={handleSubmit} className="add-doctor-grid">

          {/* LEFT COLUMN (Personal & Professional Info) */}
          <div className="add-doctor-main-col">

            {/* --- Personal Information Card --- */}
            <div className="form-card">
              <div className="form-card__accent" />
              <div className="form-card__header">
                <div className="form-card__icon-badge">
                  <span className="material-symbols-outlined">person</span>
                </div>
                <div>
                  <h2 className="form-card__title">Personal Information</h2>
                  <p className="form-card__subtitle">Basic demographic details</p>
                </div>
              </div>

              <div className="form-grid-2">
                {/* Full Name */}
                <div className="form-input-group form-col-full">
                  <label className="form-input-group__label" htmlFor="fullName">
                    Full Name <span className="required-star">*</span>
                  </label>
                  <input
                    className="form-input-group__control"
                    id="fullName"
                    name="fullName"
                    type="text"
                    placeholder="Dr. Jane Smith"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                  />
                  <span className="material-symbols-outlined form-input-group__icon">badge</span>
                </div>

                {/* Date of Birth (Modern Custom Date Picker) */}
                <ModernDatePicker
                  label="Date of Birth"
                  required
                  value={formData.dob}
                  onChange={handleChange}
                />

                {/* Gender (Modern Custom Dropdown) */}
                <ModernDropdown
                  label="Gender"
                  required
                  name="gender"
                  placeholder="Select gender"
                  value={formData.gender}
                  onChange={handleChange}
                  icon="wc"
                  options={[
                    { value: 'female', label: 'Female' },
                    { value: 'male', label: 'Male' },
                    { value: 'other', label: 'Other' },
                    { value: 'prefer_not_to_say', label: 'Prefer not to say' },
                  ]}
                />

                {/* Email Address */}
                <div className="form-input-group">
                  <label className="form-input-group__label" htmlFor="email">
                    Email Address <span className="required-star">*</span>
                  </label>
                  <input
                    className="form-input-group__control"
                    id="email"
                    name="email"
                    type="email"
                    placeholder="doctor@hospital.com"
                    required
                    value={formData.email}
                    onChange={handleChange}
                  />
                  <span className="material-symbols-outlined form-input-group__icon">mail</span>
                </div>

                {/* Contact Number */}
                <div className="form-input-group">
                  <label className="form-input-group__label" htmlFor="phone">
                    Contact Number <span className="required-star">*</span>
                  </label>
                  <input
                    className="form-input-group__control"
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                  />
                  <span className="material-symbols-outlined form-input-group__icon">call</span>
                </div>
              </div>
            </div>

            {/* --- Professional Information Card --- */}
            <div className="form-card">
              <div className="form-card__accent" />
              <div className="form-card__header">
                <div className="form-card__icon-badge">
                  <span className="material-symbols-outlined">medical_services</span>
                </div>
                <div>
                  <h2 className="form-card__title">Professional Information</h2>
                  <p className="form-card__subtitle">Clinical assignment details</p>
                </div>
              </div>

              <div className="form-grid-2">
                {/* Specialization */}
                <div className="form-input-group form-col-full">
                  <label className="form-input-group__label" htmlFor="specialization">
                    Specialization <span className="required-star">*</span>
                  </label>
                  <input
                    className="form-input-group__control"
                    id="specialization"
                    name="specialization"
                    type="text"
                    placeholder="Search specialization..."
                    required
                    value={formData.specialization}
                    onChange={handleChange}
                  />
                  <span className="material-symbols-outlined form-input-group__icon">search</span>
                </div>

                {/* Avg Consultation Time */}
                <div className="form-input-group form-col-full">
                  <label className="form-input-group__label" htmlFor="consultTime">
                    Avg. Consultation Time (Mins) <span className="required-star">*</span>
                  </label>
                  <input
                    className="form-input-group__control"
                    id="consultTime"
                    name="consultTime"
                    type="number"
                    min="5"
                    max="120"
                    step="5"
                    required
                    value={formData.consultTime}
                    onChange={handleChange}
                  />
                  <span className="material-symbols-outlined form-input-group__icon">timer</span>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN (System Record, Account Access, Actions) */}
          <div className="add-doctor-side-col">

            {/* --- System Record Card --- */}
            <div className="system-record-card">
              <div className="system-record-card__title">
                <span className="material-symbols-outlined">info</span>
                <span>System Record</span>
              </div>
              <div className="system-record-card__row">
                <span className="system-record-card__key">Doctor ID</span>
                <span className="system-record-card__val system-record-card__val--primary">DOC-12345</span>
              </div>
              <div className="system-record-card__row">
                <span className="system-record-card__key">Created At</span>
                <span className="system-record-card__val">2023-10-27</span>
              </div>
            </div>

            {/* --- Account Access Card --- */}
            <div className="form-card">
              <div className="form-card__accent form-card__accent--secondary" />
              <div className="form-card__header">
                <div className="form-card__icon-badge form-card__icon-badge--secondary">
                  <span className="material-symbols-outlined">manage_accounts</span>
                </div>
                <div>
                  <h2 className="form-card__title">Account Access</h2>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Username */}
                <div className="form-input-group">
                  <label className="form-input-group__label" htmlFor="username">
                    Username <span className="required-star">*</span>
                  </label>
                  <input
                    className="form-input-group__control"
                    id="username"
                    name="username"
                    type="text"
                    placeholder="janesmith"
                    required
                    value={formData.username}
                    onChange={handleChange}
                  />
                  <span className="material-symbols-outlined form-input-group__icon">account_circle</span>
                </div>

                {/* Password */}
                <div className="form-input-group">
                  <label className="form-input-group__label" htmlFor="password">
                    Password <span className="required-star">*</span>
                  </label>
                  <input
                    className="form-input-group__control"
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    required
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    className="form-input-group__icon-button"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    <span className="material-symbols-outlined">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>

                {/* Account Status Switch */}
                <div className="status-toggle-row">
                  <div>
                    <p className="status-toggle-title">Account Status</p>
                    <p className="status-toggle-sub">Active users can login</p>
                  </div>
                  <label className="switch">
                    <input
                      type="checkbox"
                      name="accountStatus"
                      checked={formData.accountStatus}
                      onChange={handleChange}
                    />
                    <span className="slider" />
                  </label>
                </div>
              </div>
            </div>

            {/* --- Action Buttons --- */}
            <div className="form-actions-stack">
              <button type="submit" className="btn-save">
                <span className="material-symbols-outlined">save</span>
                <span>Save Doctor Profile</span>
              </button>
              <div className="form-actions-row">
                <button type="button" className="btn-reset" onClick={handleReset}>
                  <span className="material-symbols-outlined">restart_alt</span>
                  <span>Reset</span>
                </button>
                <button type="button" className="btn-cancel" onClick={() => navigate('/admin/doctors')}>
                  <span className="material-symbols-outlined">close</span>
                  <span>Cancel</span>
                </button>
              </div>
            </div>

          </div>

        </form>
      </div>
    </AdminLayout>
  );
}

export default AddDoctor;
