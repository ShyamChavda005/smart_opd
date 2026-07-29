// ============================================================
//  Doctors.js  –  Doctors Page Component
// ============================================================

import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import '../../style/admin/Doctors.css';


// ---------- Helper: Status badge color class ----------

function getStatusClass(status) {
  const normalizedStatus = String(status || '').toLowerCase();

  switch (normalizedStatus) {
    case 'active': return 'green';
    case 'available': return 'green';
    case 'break': return 'gray';
    case 'inactive': return 'gray';
    case 'surgery': return 'red';
    case 'busy': return 'red';
    default: return 'gray';
  }
}

function getInitials(name) {
  if (!name) return 'DR';

  const initials = name
    .replace('Dr.', '')
    .replace('Dr', '')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

  return initials || 'DR';
}

function formatDate(value) {
  if (!value) return '-';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';

  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
}

function formatDateTime(value) {
  if (!value) return '-';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';

  return date.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function formatStatus(status) {
  if (!status) return 'Unknown';
  return String(status).charAt(0).toUpperCase() + String(status).slice(1).toLowerCase();
}



// ---------- Component ----------

function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  const navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController();

    setIsLoading(true);
    setError('');

    fetch("http://localhost:8000/doctors", { signal: controller.signal })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Unable to fetch doctors list.');
        }

        return res.json();
      })
      .then((data) => {
        setDoctors(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Something went wrong while loading doctors.');
        }
      })
      .finally(() => {
        setIsLoading(false);
      });

    return () => controller.abort();
  }, []);

  const specialties = useMemo(() => {
    const values = doctors
      .map((doctor) => doctor.specialization)
      .filter(Boolean);

    return ['All', ...Array.from(new Set(values))];
  }, [doctors]);

  const filteredDoctors = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return doctors.filter((doctor) => {
      const matchesSearch = !query || [doctor.name, doctor.did, doctor.specialization, doctor.email, doctor.username]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query));

      const matchesSpecialty = selectedSpecialty === 'All' || String(doctor.specialization || '').toLowerCase() === selectedSpecialty.toLowerCase();

      return matchesSearch && matchesSpecialty;
    });
  }, [doctors, searchTerm, selectedSpecialty]);

  const activeDoctorsCount = doctors.filter((doctor) => String(doctor.status || '').toLowerCase() === 'active').length;

  // const handleStatusToggle = async (id, currentStatus) => {
  //   const newStatus = currentStatus === "active" ? "inactive" : "active";

  //   try {
  //     const response = await fetch(`http://localhost:8000/doctor/${id}/status`, {
  //       method: "PATCH",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         status: newStatus,
  //       }),
  //     });

  //     if (response.ok) {
  //       setDoctors(prev =>
  //         prev.map(doc =>
  //           doc.id === id
  //             ? { ...doc, status: newStatus }
  //             : doc
  //         )
  //       );
  //     }
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

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
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>
          <div className="doctors-search-bar__dropdown">
            <div className="doctors-search-bar__dropdown-labels">
              <span className="doctors-search-bar__dropdown-caption">Specialty</span>
              <span className="doctors-search-bar__dropdown-value">{selectedSpecialty === 'All' ? 'All Specialization' : selectedSpecialty}</span>
            </div>
            <select
              className="doctors-search-bar__select"
              value={selectedSpecialty}
              onChange={(event) => setSelectedSpecialty(event.target.value)}
              aria-label="Filter doctors by specialty"
            >
              {specialties.map((specialty) => (
                <option key={specialty} value={specialty}>
                  {specialty === 'All' ? 'All Specialization' : specialty}
                </option>
              ))}
            </select>
            <span className="material-symbols-outlined doctors-search-bar__arrow">expand_more</span>
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
              <span className="metric-card__value">{doctors.length}</span>
              <span className="metric-card__change">Live directory</span>
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
              <span className="metric-card__value">{activeDoctorsCount}</span>
              <span className="metric-card__sub">/ {doctors.length || 0} available</span>
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
              <span className="metric-card__value">
                {doctors.length
                  ? (doctors.reduce((sum, doctor) => sum + (Number(doctor.avg_time) || 0), 0) / doctors.length).toFixed(1)
                  : '0.0'}
              </span>
              <div className="metric-card__progress-row">
                <div className="metric-card__progress-bar">
                  <div className="metric-card__progress-fill">
                    <div className="metric-card__progress-glow" />
                  </div>
                </div>
                <span className="metric-card__progress-label">mins / patient</span>
              </div>
            </div>
          </div>
        </div>

        {/* ============ DATA TABLE ============ */}
        <div className="doctors-table">
          <div className="doctors-table__scroll">
            <table className="doctors-table__table">
              <thead className="doctors-table__head">
                <tr className="doctors-table__header-row">
                  <th className="doctors-table__header-cell">
                    <span>Name</span>
                    <span className="material-symbols-outlined doctors-table__sort-icon">unfold_more</span>
                  </th>
                  <th className="doctors-table__header-cell">Gender</th>
                  <th className="doctors-table__header-cell">DOB</th>
                  <th className="doctors-table__header-cell">Email</th>
                  <th className="doctors-table__header-cell">Contact</th>
                  <th className="doctors-table__header-cell">Specialization</th>
                  <th className="doctors-table__header-cell">Avg Time</th>
                  <th className="doctors-table__header-cell">Username</th>
                  <th className="doctors-table__header-cell">Created</th>
                  <th className="doctors-table__header-cell">Status</th>
                  <th className="doctors-table__header-cell doctors-table__header-cell--right">Actions</th>
                </tr>
              </thead>
              <tbody className="doctors-table__body">
                {isLoading && (
                  <tr>
                    <td colSpan="11" className="doctors-table__empty">Loading doctors...</td>
                  </tr>
                )}

                {!isLoading && error && (
                  <tr>
                    <td colSpan="11" className="doctors-table__empty doctors-table__empty--error">{error}</td>
                  </tr>
                )}

                {!isLoading && !error && filteredDoctors.length === 0 && (
                  <tr>
                    <td colSpan="11" className="doctors-table__empty">No doctors found.</td>
                  </tr>
                )}

                {!isLoading && !error && filteredDoctors.map((doctor) => {
                  const color = getStatusClass(doctor.status);

                  return (
                    <tr className="doctors-table__row" key={doctor.did}>
                      <td className="doctors-table__cell doctors-table__profile-cell">
                        <div className="doctors-table__profile">
                          <div className="doctors-table__avatar-wrap">
                            <div className="doctors-table__avatar--initials">
                              {getInitials(doctor.name)}
                            </div>
                            <div className="doctors-table__indicator">
                              <div className={`doctors-table__indicator-dot doctors-table__indicator-dot--${color}`} />
                            </div>
                          </div>
                          <div className="doctors-table__profile-info">
                            <span className="doctors-table__name">{doctor.name}</span>
                            <span className="doctors-table__id">ID: {doctor.did}</span>
                          </div>
                        </div>
                      </td>
                      <td className="doctors-table__cell">
                        <span className="doctors-table__text">{doctor.gender}</span>
                      </td>
                      <td className="doctors-table__cell">
                        <span className="doctors-table__text">{formatDate(doctor.dob)}</span>
                      </td>
                      <td className="doctors-table__cell">
                        <span className="doctors-table__text">{doctor.email || '-'}</span>
                      </td>
                      <td className="doctors-table__cell">
                        <span className="doctors-table__text">{doctor.contact || '-'}</span>
                      </td>
                      <td className="doctors-table__cell">
                        <div className="doctors-table__department">
                          <div className="doctors-table__dept-badge">
                            <span className="doctors-table__dept-name">{doctor.specialization}</span>
                          </div>
                        </div>
                      </td>
                      <td className="doctors-table__cell">
                        <span className="doctors-table__text">{doctor.avg_time ? `${doctor.avg_time} min` : '-'}</span>
                      </td>
                      <td className="doctors-table__cell">
                        <span className="doctors-table__text">{doctor.username}</span>
                      </td>
                      <td className="doctors-table__cell">
                        <span className="doctors-table__text">{formatDateTime(doctor.create_at || doctor.created_at)}</span>
                      </td>
                      <td className="doctors-table__cell">
                        <div className="doctors-table__status">
                          <div className={`doctors-table__status-badge doctors-table__status-badge--${color}`}>
                            <div className="doctors-table__status-badge-dot" />
                            <span className="doctors-table__status-badge-text">{formatStatus(doctor.status)}</span>
                            {/* Toggle Switch */}
                            <label className="doctor-status-switch">
                              <input
                                type="checkbox"
                                checked={doctor.status === "Active"}
                              // onChange={() => handleStatusToggle(doctor.id, doctor.status)}
                              readOnly
                              />
                              <span className="doctor-status-slider"></span>
                            </label>
                          </div>
                        </div>
                      </td>
                      <td className="doctors-table__cell doctors-table__cell--actions">
                        <div className="doctors-table__actions">
                          <button className="doctors-table__action-btn" title="View Details">
                            <span className="material-symbols-outlined">visibility</span>
                          </button>
                          <button className="doctors-table__action-btn" title="Edit Doctor">
                            <span className="material-symbols-outlined">edit</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* ============ PAGINATION ============ */}
        {/* <div className="doctors-pagination">
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
        </div> */}
      </div>
    </AdminLayout>
  );
}

export default Doctors;
