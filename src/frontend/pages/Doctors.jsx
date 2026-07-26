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
    email: 's.jenkins@adminly.com',
    phone: '+1 (555) 234-8910',
    department: 'Cardiology',
    room: 'Room 402',
    status: 'active',
    statusLabel: 'Active Shift',
    statusSub: 'Ends in 4h',
    photo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBaYkiCtieAieiEd3B0XQ8tX5Q230LCusuZIoKkWiX86XSTvK6cMrLHiJshti6pV0fwOHazrGecJn64iS5jqdZC1IieNatB3KZswQJIj5ZzWQ6SyKkvBYqIz9J2sDbcWVZX-G6SuvGzWoIIAF6imKm2g1Rx8kYGJ6QEO6BLUmd7l4GdilXJmMlfKzWY4-HT7NQxAcgiGovrwFrOmfUfbe5GYAuxMqKa7MmOLaJEaAscJVT8y7A4mSXPVIwa4HktLAydAn6c2VSv4L4',
    initials: null,
  },
  {
    id: 'MED-3302',
    name: 'Dr. Marcus Chen',
    email: 'm.chen@adminly.com',
    phone: '+1 (555) 482-9912',
    department: 'Neurology',
    room: 'Room 610',
    status: 'break',
    statusLabel: 'On Break',
    statusSub: 'Returns 14:30',
    photo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD7et_N8Z9Bf0QRE80hHKsnS6yEGhGh0_NQ4bGvW-uLqgiSnVJb7fuLvYDQnade9IAMuQeNtZnRZ4sGqEWKrTfN6RXAlysHltTyz0Jl2Bya5dLke-ALOtK2GaAu4zgAuzDwd1Xn3Vj7SvL6H7i4Z-yPAm8mCdmoUto15FXzzmuwAY-7KcTut-WQNIYGJglI1CF1jL3OOkJBQQTEOmZDF71ZqQ6TJ09igrOnvalPr3a0dd_mSOOuXkam3V2Nk-q3Z3-c5PT5jf53tCg',
    initials: null,
  },
  {
    id: 'MED-8891',
    name: 'Dr. Elena Patel',
    email: 'e.patel@adminly.com',
    phone: 'Internal pager',
    department: 'Surgery',
    room: 'OR-3',
    status: 'surgery',
    statusLabel: 'In Surgery',
    statusSub: 'Do not disturb',
    photo: null,
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
              <span>Doctor Profile</span>
              <span className="material-symbols-outlined doctors-table__sort-icon">unfold_more</span>
            </div>
            <div className="doctors-table__header-cell">Contact</div>
            <div className="doctors-table__header-cell">Department</div>
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

                  {/* Profile */}
                  <div className="doctors-table__profile">
                    <div className="doctors-table__avatar-wrap">
                      {doctor.photo ? (
                        <div className="doctors-table__avatar">
                          <img src={doctor.photo} alt={doctor.name} />
                        </div>
                      ) : (
                        <div className="doctors-table__avatar--initials">
                          {doctor.initials}
                        </div>
                      )}
                      <div className="doctors-table__indicator">
                        <div className={`doctors-table__indicator-dot doctors-table__indicator-dot--${color}`} />
                      </div>
                    </div>
                    <div className="doctors-table__profile-info">
                      <span className="doctors-table__name">{doctor.name}</span>
                      <span className="doctors-table__id">ID: {doctor.id}</span>
                    </div>
                  </div>

                  {/* Contact */}
                  <div className="doctors-table__contact">
                    <div className="doctors-table__contact-row">
                      <span className="material-symbols-outlined">mail</span>
                      <span className="doctors-table__contact-text">{doctor.email}</span>
                    </div>
                    <div className="doctors-table__contact-row">
                      <span className="material-symbols-outlined">call</span>
                      <span className="doctors-table__contact-text doctors-table__contact-text--mono">
                        {doctor.phone}
                      </span>
                    </div>
                  </div>

                  {/* Department */}
                  <div className="doctors-table__department">
                    <div className="doctors-table__dept-badge">
                      <span className="doctors-table__dept-name">{doctor.department}</span>
                      <span className="doctors-table__dept-room">{doctor.room}</span>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="doctors-table__status">
                    <div className={`doctors-table__status-badge doctors-table__status-badge--${color}`}>
                      <div className="doctors-table__status-badge-dot" />
                      <span className="doctors-table__status-badge-text">{doctor.statusLabel}</span>
                    </div>
                    <span className="doctors-table__status-sub">{doctor.statusSub}</span>
                  </div>

                  {/* Actions */}
                  <div className="doctors-table__actions">
                    <button className="doctors-table__action-btn">
                      <span className="material-symbols-outlined">edit</span>
                    </button>
                    <button className="doctors-table__action-btn">
                      <span className="material-symbols-outlined">more_vert</span>
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
