// ============================================================
//  AddReceptionist.jsx  –  Add New Receptionist Page Component
// ============================================================

import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import '../style/AddReceptionist.css';
import '../style/AddDoctor.css';


// ---------- Custom Modern Date Picker (reused from AddDoctor) ----------
function ModernDatePicker({ value, onChange, label, required }) {
  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState(() => {
    return value ? new Date(value) : new Date();
  });
  const datePickerRef = useRef(null);

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

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1));

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

  const daysGrid = [];
  for (let i = 0; i < firstDayOfWeek; i++) daysGrid.push(null);
  for (let d = 1; d <= daysInMonth; d++) daysGrid.push(d);

  const selectedDateObj = value ? new Date(value) : null;
  const selectedYear = selectedDateObj?.getFullYear();
  const selectedMonth = selectedDateObj?.getMonth();
  const selectedDay = selectedDateObj?.getDate();

  return (
    <div className="form-input-group" ref={datePickerRef} style={{ position: 'relative', zIndex: isOpen ? 100 : 1 }}>
      <label className="form-input-group__label">
        {label} {required && <span className="required-star">*</span>}
      </label>
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
      {isOpen && (
        <div className="modern-calendar-popover">
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
          <div className="modern-calendar__weekdays">
            <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
          </div>
          <div className="modern-calendar__days-grid">
            {daysGrid.map((day, index) => {
              if (day === null) return <div key={`empty-${index}`} className="modern-calendar__day modern-calendar__day--empty" />;
              const isSelected = selectedDateObj && selectedYear === year && selectedMonth === month && selectedDay === day;
              const isToday = new Date().getFullYear() === year && new Date().getMonth() === month && new Date().getDate() === day;
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
          <div className="modern-calendar__footer">
            <button type="button" onClick={handleClear} className="modern-calendar__footer-btn">Clear</button>
            <button type="button" onClick={handleToday} className="modern-calendar__footer-btn modern-calendar__footer-btn--primary">Today</button>
          </div>
        </div>
      )}
    </div>
  );
}


// ---------- Custom Modern Dropdown (reused from AddDoctor) ----------
function ModernDropdown({ value, onChange, label, required, name, placeholder, options, icon }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

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
    <div className="form-input-group" ref={dropdownRef} style={{ position: 'relative', zIndex: isOpen ? 100 : 1 }}>
      <label className="form-input-group__label">
        {label} {required && <span className="required-star">*</span>}
      </label>
      <div
        className={`form-input-group__control custom-date-trigger ${isOpen ? 'custom-date-trigger--open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
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
                {isSelected && <span className="material-symbols-outlined modern-dropdown__check">check</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}


function AddReceptionist() {
  const navigate = useNavigate();

  // ---------- Form State ----------
  const [formData, setFormData] = useState({
    fullName: '',
    dob: '',
    gender: '',
    email: '',
    phone: '',
    username: '',
    password: '',
    shift: 'morning',
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
      username: '',
      password: '',
      shift: 'morning',
      accountStatus: true,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Registered Receptionist Data:', formData);
    navigate('/admin/receptionists');
  };

  return (
    <AdminLayout>
      <div className="add-receptionist-page">

        {/* ---------- Breadcrumb ---------- */}
        <nav className="add-receptionist-breadcrumb">
          <a href="#personnel">Personnel</a>
          <span className="material-symbols-outlined">chevron_right</span>
          <a href="#receptionists" onClick={(e) => { e.preventDefault(); navigate('/admin/receptionists'); }}>Receptionists</a>
          <span className="material-symbols-outlined">chevron_right</span>
          <span className="add-receptionist-breadcrumb__active">Add Receptionist</span>
        </nav>

        {/* ---------- Header with Actions ---------- */}
        <div className="add-receptionist-header">
          <div>
            <h1 className="add-receptionist-header__title">Add New Receptionist</h1>
            <p className="add-receptionist-header__desc">
              Create a new staff profile and account access.
            </p>
          </div>
          <div className="add-receptionist-header__actions">
            <button
              type="button"
              className="add-receptionist-header__cancel-btn"
              onClick={() => navigate('/admin/receptionists')}
            >
              Cancel
            </button>
            <button
              type="button"
              className="add-receptionist-header__reset-btn"
              onClick={handleReset}
            >
              <span className="material-symbols-outlined">restart_alt</span>
              <span>Reset</span>
            </button>
            <button
              type="submit"
              form="add-receptionist-form"
              className="add-receptionist-header__save-btn"
            >
              <span className="material-symbols-outlined">save</span>
              <span>Save Receptionist</span>
            </button>
          </div>
        </div>

        {/* ---------- Form Grid ---------- */}
        <form
          id="add-receptionist-form"
          className="add-receptionist-grid"
          onSubmit={handleSubmit}
        >

          {/* ========== LEFT COLUMN ========== */}
          <div className="add-receptionist-main-col">

            {/* --- Personal Information Card --- */}
            <div className="ar-form-card">
              <div className="ar-form-card__accent ar-form-card__accent--primary" />
              <div className="ar-form-card__header">
                <div className="ar-form-card__icon-badge ar-form-card__icon-badge--primary">
                  <span className="material-symbols-outlined">person</span>
                </div>
                <h2 className="ar-form-card__title">Personal Information</h2>
              </div>

              <div className="ar-form-fields">
                {/* Full Name */}
                <div className="ar-input-group ar-field-full">
                  <label className="ar-input-group__label">
                    Full Name <span className="ar-required">*</span>
                  </label>
                  <div className="ar-input-group__control-wrap">
                    <span className="material-symbols-outlined">badge</span>
                    <input
                      className="ar-input-group__control"
                      name="fullName"
                      type="text"
                      placeholder="e.g. Sarah Jenkins"
                      required
                      value={formData.fullName}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Date of Birth (Modern Custom Date Picker) */}
                <ModernDatePicker
                  label="Date of Birth"
                  value={formData.dob}
                  onChange={handleChange}
                />

                {/* Gender (Modern Custom Dropdown) */}
                <ModernDropdown
                  label="Gender"
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
                <div className="ar-input-group">
                  <label className="ar-input-group__label">
                    Email Address <span className="ar-required">*</span>
                  </label>
                  <div className="ar-input-group__control-wrap">
                    <span className="material-symbols-outlined">mail</span>
                    <input
                      className="ar-input-group__control"
                      name="email"
                      type="email"
                      placeholder="sarah.j@clinic.com"
                      required
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Contact Number */}
                <div className="ar-input-group">
                  <label className="ar-input-group__label">Contact Number</label>
                  <div className="ar-input-group__control-wrap">
                    <span className="material-symbols-outlined">phone</span>
                    <input
                      className="ar-input-group__control"
                      name="phone"
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* --- Account Access Card --- */}
            <div className="ar-form-card">
              <div className="ar-form-card__accent ar-form-card__accent--secondary" />
              <div className="ar-form-card__header">
                <div className="ar-form-card__icon-badge ar-form-card__icon-badge--secondary">
                  <span className="material-symbols-outlined">lock</span>
                </div>
                <h2 className="ar-form-card__title">Account Access</h2>
              </div>

              <div className="ar-form-fields">
                {/* Username */}
                <div className="ar-input-group">
                  <label className="ar-input-group__label">
                    Username <span className="ar-required">*</span>
                  </label>
                  <div className="ar-input-group__control-wrap">
                    <span className="material-symbols-outlined">account_circle</span>
                    <input
                      className="ar-input-group__control"
                      name="username"
                      type="text"
                      placeholder="sarah.jenkins"
                      required
                      value={formData.username}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="ar-input-group">
                  <label className="ar-input-group__label">
                    Password <span className="ar-required">*</span>
                  </label>
                  <div className="ar-input-group__control-wrap">
                    <span className="material-symbols-outlined">key</span>
                    <input
                      className="ar-input-group__control"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      style={{ paddingRight: '48px' }}
                    />
                    <button
                      type="button"
                      className="ar-input-group__toggle-btn"
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      <span className="material-symbols-outlined">
                        {showPassword ? 'visibility_off' : 'visibility'}
                      </span>
                    </button>
                  </div>
                  <span className="ar-input-group__hint">Minimum 8 characters, alphanumeric.</span>
                </div>

                {/* Account Status Toggle */}
                <div className="ar-field-full">
                  <div className="ar-status-toggle">
                    <div>
                      <p className="ar-status-toggle__label">Account Status</p>
                      <p className="ar-status-toggle__desc">Enable or disable login access for this receptionist.</p>
                    </div>
                    <div className="ar-status-toggle__right">
                      <label className="ar-switch">
                        <input
                          type="checkbox"
                          name="accountStatus"
                          checked={formData.accountStatus}
                          onChange={handleChange}
                        />
                        <span className="ar-switch__slider" />
                      </label>
                      <span className="ar-status-toggle__text">Active</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* ========== RIGHT COLUMN ========== */}
          <div className="add-receptionist-side-col">

            {/* --- Employment Details Card --- */}
            <div className="ar-form-card">
              <div className="ar-form-card__accent ar-form-card__accent--tertiary" />
              <div className="ar-form-card__header">
                <div className="ar-form-card__icon-badge ar-form-card__icon-badge--tertiary">
                  <span className="material-symbols-outlined">work</span>
                </div>
                <h2 className="ar-form-card__title">Employment Details</h2>
              </div>

              <div className="ar-form-fields ar-form-fields--single">
                {/* Employee ID (disabled) */}
                <div className="ar-input-group">
                  <label className="ar-input-group__label">Employee ID</label>
                  <div className="ar-input-group__control-wrap ar-input-group__control-wrap--disabled">
                    <span className="material-symbols-outlined">tag</span>
                    <input
                      className="ar-input-group__control ar-input-group__control--disabled"
                      type="text"
                      value="REC-54321"
                      disabled
                    />
                  </div>
                  <span className="ar-input-group__hint">Auto-generated identifier.</span>
                </div>

                {/* Assigned Shift (Modern Custom Dropdown) */}
                <ModernDropdown
                  label="Assigned Shift"
                  name="shift"
                  placeholder="Select Shift"
                  value={formData.shift}
                  onChange={handleChange}
                  icon="schedule"
                  options={[
                    { value: 'morning', label: 'Morning (8 AM - 4 PM)' },
                    { value: 'afternoon', label: 'Afternoon (2 PM - 10 PM)' },
                    { value: 'night', label: 'Night (10 PM - 6 AM)' },
                    { value: 'full', label: 'Full-time Flex' },
                  ]}
                />

                {/* Created At (disabled) */}
                <div className="ar-input-group">
                  <label className="ar-input-group__label">Created At</label>
                  <div className="ar-input-group__control-wrap ar-input-group__control-wrap--disabled">
                    <span className="material-symbols-outlined">history</span>
                    <input
                      className="ar-input-group__control ar-input-group__control--disabled"
                      type="text"
                      value="2023-11-15 (Today)"
                      disabled
                    />
                  </div>
                </div>
              </div>

              {/* Help Card */}
              <div className="ar-help-card">
                <span className="material-symbols-outlined">info</span>
                <div>
                  <h4 className="ar-help-card__title">Need Help?</h4>
                  <p className="ar-help-card__desc">
                    Check the staff handbook for shift definitions and access level policies.
                  </p>
                  <a href="#docs" className="ar-help-card__link">View Documentation</a>
                </div>
              </div>
            </div>

          </div>

        </form>
      </div>
    </AdminLayout>
  );
}

export default AddReceptionist;
