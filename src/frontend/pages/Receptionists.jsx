// ============================================================
//  Receptionists.jsx  –  Receptionists Page Component
// ============================================================

import React from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import '../style/Receptionists.css';


// ---------- Sample Receptionist Data ----------

const RECEPTIONISTS = [
  {
    id: 'REC-1021',
    name: 'Alice Thompson',
    gender: 'Female',
    username: 'alice.t',
    shift: 'Morning (8 AM - 4 PM)',
    status: 'active',
    statusLabel: 'Active Shift',
    statusSub: 'Ends in 2h',
    initials: 'AT',
  },
  {
    id: 'REC-3304',
    name: 'Robert Miller',
    gender: 'Male',
    username: 'robert.m',
    shift: 'Afternoon (2 PM - 10 PM)',
    status: 'break',
    statusLabel: 'On Break',
    statusSub: 'Returns 15:00',
    initials: 'RM',
  },
  {
    id: 'REC-8821',
    name: 'Sarah Connor',
    gender: 'Female',
    username: 'sarah.c',
    shift: 'Night (10 PM - 6 AM)',
    status: 'off',
    statusLabel: 'Off Duty',
    statusSub: null,
    initials: 'SC',
  },
];


// ---------- Component ----------

function Receptionists() {
  const navigate = useNavigate();

  return (
    <AdminLayout>
      <div className="receptionists-page">

        {/* ============ HEADER ============ */}
        <div className="receptionists-header">
          <div>
            <h1 className="receptionists-header__title">Receptionists</h1>
            <p className="receptionists-header__description">
              Manage and monitor front-desk staff, shifts, and assignment status.
            </p>
          </div>
          <button className="receptionists-header__add-btn" onClick={() => navigate('/admin/add-receptionist')}>
            <span className="material-symbols-outlined">add</span>
            <span>Add Receptionist</span>
          </button>
        </div>

        {/* ============ STATISTICS CARDS ============ */}
        <div className="receptionists-stats">

          {/* Card 1 – Total Receptionists */}
          <div className="stat-card">
            <div className="stat-card__blob stat-card__blob--blue" />
            <div className="stat-card__top">
              <div className="stat-card__icon stat-card__icon--blue">
                <span className="material-symbols-outlined">badge</span>
              </div>
              <div className="stat-card__trend">
                <span className="material-symbols-outlined">trending_up</span>
                <span className="stat-card__trend-text">+2 this month</span>
              </div>
            </div>
            <div className="stat-card__bottom">
              <h3 className="stat-card__label">Total Receptionists</h3>
              <p className="stat-card__value">24</p>
            </div>
          </div>

          {/* Card 2 – On Shift */}
          <div className="stat-card">
            <div className="stat-card__blob stat-card__blob--slate" />
            <div className="stat-card__top">
              <div className="stat-card__icon stat-card__icon--slate">
                <span className="material-symbols-outlined">schedule</span>
              </div>
              <div className="stat-card__donut">
                <svg viewBox="0 0 36 36">
                  <path
                    className="stat-card__donut-bg"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="stat-card__donut-fill"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
              </div>
            </div>
            <div className="stat-card__bottom">
              <h3 className="stat-card__label">On Shift</h3>
              <p className="stat-card__value">
                8
                <span className="stat-card__value-sub">/ 12</span>
              </p>
            </div>
          </div>

          {/* Card 3 – Avg Response Time */}
          <div className="stat-card">
            <div className="stat-card__blob stat-card__blob--gray" />
            <div className="stat-card__top">
              <div className="stat-card__icon stat-card__icon--gray">
                <span className="material-symbols-outlined">timer</span>
              </div>
              <div className="stat-card__badge">
                <span className="stat-card__badge-text">Optimal</span>
              </div>
            </div>
            <div className="stat-card__bottom">
              <h3 className="stat-card__label">Avg Response Time</h3>
              <p className="stat-card__value">
                4.2
                <span className="stat-card__value-unit">m</span>
              </p>
            </div>
          </div>
        </div>

        {/* ============ DIRECTORY TABLE ============ */}
        <div className="receptionists-table">

          {/* Toolbar */}
          <div className="receptionists-table__toolbar">
            <div className="receptionists-table__toolbar-actions">
              <button className="receptionists-table__toolbar-btn">
                <span className="material-symbols-outlined">filter_list</span>
                <span>Filter</span>
              </button>
              <button className="receptionists-table__toolbar-btn">
                <span className="material-symbols-outlined">sort</span>
                <span>Sort</span>
              </button>
            </div>
            <div className="receptionists-table__search-wrap">
              <span className="material-symbols-outlined">search</span>
              <input
                className="receptionists-table__search-input"
                type="text"
                placeholder="Search ID or Name..."
              />
            </div>
          </div>

          {/* Table Header */}
          <div className="receptionists-table__header">
            <div className="receptionists-table__header-cell">Name</div>
            <div className="receptionists-table__header-cell">Gender</div>
            <div className="receptionists-table__header-cell">Username</div>
            <div className="receptionists-table__header-cell">Shift</div>
            <div className="receptionists-table__header-cell">Status</div>
            <div className="receptionists-table__header-cell receptionists-table__header-cell--right">Actions</div>
          </div>

          {/* Table Body */}
          <div className="receptionists-table__body">
            {RECEPTIONISTS.map((rec) => (
              <div
                className={`receptionists-table__row ${rec.status === 'off' ? 'receptionists-table__row--faded' : ''}`}
                key={rec.id}
              >
                {/* Name & Initials Avatar */}
                <div className="receptionists-table__profile">
                  <div className="receptionists-table__avatar-wrap">
                    <div className="receptionists-table__avatar--initials">
                      {rec.initials}
                    </div>
                    <div className={`receptionists-table__avatar-status receptionists-table__avatar-status--${rec.status}`} />
                  </div>
                  <div className="receptionists-table__profile-info">
                    <span className="receptionists-table__name">{rec.name}</span>
                    <span className="receptionists-table__id">ID: {rec.id}</span>
                  </div>
                </div>

                {/* Gender */}
                <div className="receptionists-table__gender">
                  <span className="receptionists-table__gender-text">{rec.gender}</span>
                </div>

                {/* Username */}
                <div className="receptionists-table__username">
                  <span className="receptionists-table__username-text">{rec.username}</span>
                </div>

                {/* Shift */}
                <div className="receptionists-table__shift">
                  <span className="receptionists-table__shift-text">{rec.shift}</span>
                </div>

                {/* Status */}
                <div className="receptionists-table__status">
                  <span className={`receptionists-table__status-badge receptionists-table__status-badge--${rec.status}`}>
                    <span className={`receptionists-table__status-dot receptionists-table__status-dot--${rec.status}`} />
                    {rec.statusLabel}
                  </span>
                  {rec.statusSub && (
                    <span className="receptionists-table__status-sub">{rec.statusSub}</span>
                  )}
                </div>

                {/* Actions (View and Edit) */}
                <div className="receptionists-table__actions">
                  <button className="receptionists-table__action-btn" title="View Details">
                    <span className="material-symbols-outlined">visibility</span>
                  </button>
                  <button className="receptionists-table__action-btn" title="Edit Receptionist">
                    <span className="material-symbols-outlined">edit</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="receptionists-pagination">
            <span className="receptionists-pagination__info">Showing 1 to 3 of 24 entries</span>
            <div className="receptionists-pagination__pages">
              <button className="receptionists-pagination__btn receptionists-pagination__btn--disabled">
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <button className="receptionists-pagination__btn receptionists-pagination__btn--active">1</button>
              <button className="receptionists-pagination__btn">2</button>
              <button className="receptionists-pagination__btn">3</button>
              <span className="receptionists-pagination__ellipsis">...</span>
              <button className="receptionists-pagination__btn">
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default Receptionists;
