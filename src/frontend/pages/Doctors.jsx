// ============================================================
//  Doctors.js  –  Doctors Page Component
// ============================================================

import React from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import '../style/Doctors.css';


// ---------- Sample Doctor Data ----------

const DOCTORS = [
  {
    id: 'MED-4921',
    name: 'Dr. Sarah Jenkins',
    gender: 'Female',
    specialization: 'Cardiology',
    username: 's.jenkins',
    status: 'active',
    statusLabel: 'Active Shift',
    statusSub: 'Ends in 4h',
    initials: 'SJ',
  },
  {
    id: 'MED-3302',
    name: 'Dr. Marcus Chen',
    gender: 'Male',
    specialization: 'Neurology',
    username: 'm.chen',
    status: 'break',
    statusLabel: 'On Break',
    statusSub: 'Returns 14:30',
    initials: 'MC',
  },
  {
    id: 'MED-8891',
    name: 'Dr. Elena Patel',
    gender: 'Female',
    specialization: 'Surgery',
    username: 'e.patel',
    status: 'surgery',
    statusLabel: 'In Surgery',
    statusSub: 'Do not disturb',
    initials: 'EP',
  },
];


// ---------- Helper: Status badge color class ----------

function getStatusClass(status) {
  switch (status) {
    case 'active': return 'green';
    case 'break': return 'gray';
    case 'surgery': return 'red';
    default: return 'gray';
  }
}


// ---------- Component ----------

function Doctors() {
  const navigate = useNavigate();

  return (
    <AdminLayout>
      <div className="doctors-page">

        {/* Decorative background blobs */}
        <div className="doctors-page__blob-1" />
        <div className="doctors-page__blob-2" />

        {/* ============ HEADER ============ */}
        <div className="doctors-header">
          <div>
            {/* Breadcrumb */}
            <div className="doctors-header__breadcrumb">
              <span className="doctors-header__breadcrumb-primary">Personnel</span>
              <div className="doctors-header__breadcrumb-dot" />
              <span className="doctors-header__breadcrumb-secondary">Q3 Roster</span>
            </div>

            {/* Title */}
            <h1 className="doctors-header__title">
              Medical Staff
              <div className="doctors-header__title-accent" />
            </h1>

            {/* Description */}
            <p className="doctors-header__description">
              Manage and monitor the active roster of healthcare professionals,
              specialties, and immediate availability status across all departments.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="doctors-header__actions">
            <button className="doctors-header__filter-btn">
              <span className="material-symbols-outlined">tune</span>
              <span>Filters</span>
            </button>
            <button className="doctors-header__add-btn" onClick={() => navigate('/admin/add-doctor')}>
              <span className="material-symbols-outlined">person_add</span>
              <span>Add Doctor</span>
            </button>
          </div>
        </div>

        {/* ============ SEARCH & FILTER BAR ============ */}
        <div className="doctors-search-bar">
          <div className="doctors-search-bar__input-wrap">
            <span className="material-symbols-outlined doctors-search-bar__icon">search</span>
            <input
              className="doctors-search-bar__input"
              type="text"
              placeholder="Search by name, ID, or specialty..."
            />
          </div>
          <div className="doctors-search-bar__dropdown">
            <div className="doctors-search-bar__dropdown-labels">
              <span className="doctors-search-bar__dropdown-caption">Specialty</span>
              <span className="doctors-search-bar__dropdown-value">All Departments</span>
            </div>
            <span className="material-symbols-outlined">expand_more</span>
          </div>
        </div>

        {/* ============ KEY METRICS ============ */}
        <div className="doctors-metrics">

          {/* Total Staff */}
          <div className="metric-card metric-card--white">
            <div className="metric-card__blob metric-card__blob--blue" />
            <div className="metric-card__top">
              <span className="metric-card__label">Total Staff</span>
              <div className="metric-card__icon-circle metric-card__icon-circle--blue">
                <span className="material-symbols-outlined">groups</span>
              </div>
            </div>
            <div className="metric-card__bottom">
              <span className="metric-card__value">142</span>
              <span className="metric-card__change">+3 this month</span>
            </div>
          </div>

          {/* Active Shift */}
          <div className="metric-card metric-card--white">
            <div className="metric-card__blob metric-card__blob--teal" />
            <div className="metric-card__top">
              <span className="metric-card__label">Active Shift</span>
              <div className="metric-card__icon-circle metric-card__icon-circle--teal">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                  pulse_alert
                </span>
              </div>
            </div>
            <div className="metric-card__bottom">
              <span className="metric-card__value">86</span>
              <span className="metric-card__sub">/ 142 on duty</span>
            </div>
          </div>

          {/* Avg Patient Load (primary) */}
          <div className="metric-card metric-card--primary">
            {/* SVG background */}
            <svg className="metric-card__svg-bg" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M0,100 C30,90 70,110 100,50 L100,100 Z" fill="currentColor" />
              <path d="M0,100 C40,80 60,120 100,30 L100,100 Z" fill="currentColor" opacity="0.5" />
            </svg>
            <div className="metric-card__top">
              <span className="metric-card__label">Avg Patient Load</span>
            </div>
            <div className="metric-card__bottom" style={{ flexDirection: 'column', gap: 0 }}>
              <span className="metric-card__value">18.4</span>
              <div className="metric-card__progress-row">
                <div className="metric-card__progress-bar">
                  <div className="metric-card__progress-fill">
                    <div className="metric-card__progress-glow" />
                  </div>
                </div>
                <span className="metric-card__progress-label">Optimal</span>
              </div>
            </div>
          </div>
        </div>

        {/* ============ DATA TABLE ============ */}
        <div className="doctors-table">

          {/* Table Header */}
          <div className="doctors-table__header">
            <div className="doctors-table__header-cell">
              <span>Name</span>
              <span className="material-symbols-outlined doctors-table__sort-icon">unfold_more</span>
            </div>
            <div className="doctors-table__header-cell">Gender</div>
            <div className="doctors-table__header-cell">Specialization</div>
            <div className="doctors-table__header-cell">Username</div>
            <div className="doctors-table__header-cell">Status</div>
            <div className="doctors-table__header-cell doctors-table__header-cell--right">Actions</div>
          </div>

          {/* Table Body */}
          <div className="doctors-table__body">
            {DOCTORS.map((doctor) => {
              const color = getStatusClass(doctor.status);

              return (
                <div className="doctors-table__row" key={doctor.id}>

                  {/* Hover accent bar */}
                  <div className={`doctors-table__row-accent doctors-table__row-accent--${color}`} />

                  {/* Name (with Initials Avatar) */}
                  <div className="doctors-table__profile">
                    <div className="doctors-table__avatar-wrap">
                      <div className="doctors-table__avatar--initials">
                        {doctor.initials}
                      </div>
                      <div className="doctors-table__indicator">
                        <div className={`doctors-table__indicator-dot doctors-table__indicator-dot--${color}`} />
                      </div>
                    </div>
                    <div className="doctors-table__profile-info">
                      <span className="doctors-table__name">{doctor.name}</span>
                      <span className="doctors-table__id">ID: {doctor.id}</span>
                    </div>
                  </div>

                  {/* Gender */}
                  <div className="doctors-table__gender">
                    <span className="doctors-table__gender-text">{doctor.gender}</span>
                  </div>

                  {/* Specialization */}
                  <div className="doctors-table__department">
                    <div className="doctors-table__dept-badge">
                      <span className="doctors-table__dept-name">{doctor.specialization}</span>
                    </div>
                  </div>

                  {/* Username */}
                  <div className="doctors-table__username">
                    <span className="doctors-table__username-text">{doctor.username}</span>
                  </div>

                  {/* Status */}
                  <div className="doctors-table__status">
                    <div className={`doctors-table__status-badge doctors-table__status-badge--${color}`}>
                      <div className="doctors-table__status-badge-dot" />
                      <span className="doctors-table__status-badge-text">{doctor.statusLabel}</span>
                    </div>
                    <span className="doctors-table__status-sub">{doctor.statusSub}</span>
                  </div>

                  {/* Actions (View and Edit) */}
                  <div className="doctors-table__actions">
                    <button className="doctors-table__action-btn" title="View Details">
                      <span className="material-symbols-outlined">visibility</span>
                    </button>
                    <button className="doctors-table__action-btn" title="Edit Doctor">
                      <span className="material-symbols-outlined">edit</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ============ PAGINATION ============ */}
        <div className="doctors-pagination">
          <span className="doctors-pagination__info">Showing 1-3 of 142 doctors</span>
          <div className="doctors-pagination__pages">
            <button className="doctors-pagination__btn doctors-pagination__btn--disabled">
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <button className="doctors-pagination__btn doctors-pagination__btn--active">1</button>
            <button className="doctors-pagination__btn">2</button>
            <button className="doctors-pagination__btn">3</button>
            <span className="doctors-pagination__ellipsis">...</span>
            <button className="doctors-pagination__btn">
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default Doctors;
