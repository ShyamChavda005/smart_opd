// ============================================================
//  Receptionists.jsx  –  Receptionists Page Component
// ============================================================

import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import '../../style/admin/Receptionists.css';

function getInitials(name) {
  if (!name) return 'RP';

  const initials = String(name)
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

  return initials || 'RP';
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

function getStatusClass(status) {
  const normalizedStatus = String(status || '').toLowerCase();

  switch (normalizedStatus) {
    case 'active':
      return 'green';
    case 'break':
      return 'gray';
    case 'off':
    case 'inactive':
      return 'red';
    default:
      return 'gray';
  }
}

// ---------- Component ----------

function Receptionists() {
  const [receptionist, setRecetionist] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedShift, setSelectedShift] = useState("All");
  const shifts = ["All", "Morning", "Afternoon", "Evening", "Night"];
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8000/receptionists")
      .then((res) => res.json())
      .then((data) => {
        console.log(data)
        setRecetionist(data);
      })
      .catch((err) => {
        console.log(err);
      })
  }, [])

  const filteredReceptionists = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return receptionist.filter((rec) => {
      const matchesSearch =
        !query ||
        [
          rec.name,
          rec.rid,
          rec.gender,
          rec.email,
          rec.contact,
          rec.username,
        ]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(query));

      const matchesShift =
        selectedShift === "All" || rec.shift === selectedShift;

      return matchesSearch && matchesShift;
    });
  }, [receptionist, searchTerm, selectedShift]);

  const totalReceptionists = receptionist.length;
  const activeReceptionists = receptionist.filter((rec) => String(rec.status || '').toLowerCase() === 'active').length;
  const morningShiftReceptionists = receptionist.filter((rec) => String(rec.shift || '').toLowerCase() === 'morning').length;

  const handleStatusToggle = async (id, currentStatus) => {
    const normalizedCurrent = String(currentStatus || "").toLowerCase();
    const newStatus = normalizedCurrent === "active" ? "inactive" : "active";

    setRecetionist(prev =>
      prev.map(rec =>
        (String(rec.rid) === String(id))
          ? { ...rec, status: newStatus }
          : rec
      )
    );

    if (newStatus === "inactive") {
      alert("Receptionist account has been set to inactive.");
    }

    try {
      const response = await fetch(`http://localhost:8000/receptionist/${id}/${newStatus}`, {
        method: "PATCH",
      });

      if (!response.ok) {
        setRecetionist(prev =>
          prev.map(rec =>
            (String(rec.rid) === String(id))
              ? { ...rec, status: currentStatus }
              : rec
          )
        );
        console.error("Failed to update status. API returned:", response.status);
      }
    } catch (err) {
      // Revert on network error
      setRecetionist(prev =>
        prev.map(rec =>
          (String(rec.rid) === String(id))
            ? { ...rec, status: currentStatus }
            : rec
        )
      );
      console.error("Network error:", err);
    }
  };

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
              <span className="doctors-search-bar__dropdown-caption">Shift</span>
              <span className="doctors-search-bar__dropdown-value">
                {selectedShift === "All" ? "All Shifts" : selectedShift}
              </span>
            </div>

            <select
              className="doctors-search-bar__select"
              value={selectedShift}
              onChange={(e) => setSelectedShift(e.target.value)}
              aria-label="Filter receptionists by shift"
            >
              {shifts.map((shift) => (
                <option key={shift} value={shift}>
                  {shift === "All" ? "All Shifts" : shift}
                </option>
              ))}
            </select>

            <span className="material-symbols-outlined doctors-search-bar__arrow">
              expand_more
            </span>
          </div>
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
                <span className="stat-card__trend-text">Live directory</span>
              </div>
            </div>
            <div className="stat-card__bottom">
              <h3 className="stat-card__label">Total Receptionists</h3>
              <p className="stat-card__value">{totalReceptionists}</p>
            </div>
          </div>

          {/* Card 2 – On Shift */}
          <div className="stat-card">
            <div className="stat-card__blob stat-card__blob--slate" />
            <div className="stat-card__top">
              <div className="stat-card__icon stat-card__icon--slate">
                <span className="material-symbols-outlined">schedule</span>
              </div>
              <div className="stat-card__badge">
                <span className="stat-card__badge-text">{activeReceptionists} active</span>
              </div>
            </div>
            <div className="stat-card__bottom">
              <h3 className="stat-card__label">On Shift</h3>
              <p className="stat-card__value">
                {activeReceptionists}
                <span className="stat-card__value-sub">/ {totalReceptionists || 0}</span>
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
                <span className="stat-card__badge-text">{morningShiftReceptionists} morning</span>
              </div>
            </div>
            <div className="stat-card__bottom">
              <h3 className="stat-card__label">Morning Shift</h3>
              <p className="stat-card__value">
                {morningShiftReceptionists}
                <span className="stat-card__value-unit">staff</span>
              </p>
            </div>
          </div>
        </div>

        {/* ============ DIRECTORY TABLE ============ */}
        <div className="receptionists-table">
          <div className="receptionists-table__scroll">
            <table className="receptionists-table__table">
              <thead className="receptionists-table__head">
                <tr className="receptionists-table__header-row">
                  <th className="receptionists-table__header-cell">
                    <span>Name</span>
                    <span className="material-symbols-outlined receptionists-table__sort-icon">unfold_more</span>
                  </th>
                  <th className="receptionists-table__header-cell">Gender</th>
                  <th className="receptionists-table__header-cell">DOB</th>
                  <th className="receptionists-table__header-cell">Email</th>
                  <th className="receptionists-table__header-cell">Contact</th>
                  <th className="receptionists-table__header-cell">Username</th>
                  <th className="receptionists-table__header-cell">Shift</th>
                  <th className="receptionists-table__header-cell">Created</th>
                  <th className="receptionists-table__header-cell">Status</th>
                  <th className="receptionists-table__header-cell receptionists-table__header-cell--right">Actions</th>
                </tr>
              </thead>
              <tbody className="receptionists-table__body">
                {!filteredReceptionists.length && (
                  <tr>
                    <td colSpan="10" className="receptionists-table__empty">No receptionists found.</td>
                  </tr>
                )}

                {filteredReceptionists.map((rec) => {
                  const color = getStatusClass(rec.status);

                  return (
                    <tr className="receptionists-table__row" key={rec.rid}>
                      <td className="receptionists-table__cell receptionists-table__profile-cell">
                        <div className="receptionists-table__profile">
                          <div className="receptionists-table__avatar-wrap">
                            <div className="receptionists-table__avatar--initials">{getInitials(rec.name)}</div>
                            <div className="receptionists-table__indicator">
                              <div className={`receptionists-table__indicator-dot receptionists-table__indicator-dot--${color}`} />
                            </div>
                          </div>
                          <div className="receptionists-table__profile-info">
                            <span className="receptionists-table__name">{rec.name}</span>
                            <span className="receptionists-table__id">ID: {rec.rid}</span>
                          </div>
                        </div>
                      </td>
                      <td className="receptionists-table__cell"><span className="receptionists-table__text">{rec.gender || '-'}</span></td>
                      <td className="receptionists-table__cell"><span className="receptionists-table__text">{rec.dob || '-'}</span></td>
                      <td className="receptionists-table__cell"><span className="receptionists-table__text">{rec.email || '-'}</span></td>
                      <td className="receptionists-table__cell"><span className="receptionists-table__text">{rec.contact || '-'}</span></td>
                      <td className="receptionists-table__cell"><span className="receptionists-table__text">{rec.username || '-'}</span></td>
                      <td className="receptionists-table__cell">
                        <div className="receptionists-table__dept-badge">
                          <span className="receptionists-table__dept-name">{rec.shift || '-'}</span>
                        </div>
                      </td>
                      <td className="receptionists-table__cell"><span className="receptionists-table__text">{formatDateTime(rec.create_at || rec.created_at)}</span></td>
                      <td className="receptionists-table__cell">
                        <div className="receptionists-table__status">
                          <div className={`receptionists-table__status-badge receptionists-table__status-badge--${color}`}>
                            <div className="receptionists-table__status-badge-dot" />
                            <span className="receptionists-table__status-badge-text">{formatStatus(rec.status)}</span>
                            <label className="doctor-status-switch">
                              <input
                                type="checkbox"
                                checked={String(rec.status || "").toLowerCase() === "active"}
                                onChange={() => handleStatusToggle(rec.rid, rec.status)}
                              />
                              <span className="doctor-status-slider"></span>
                            </label>
                          </div>
                        </div>
                      </td>
                      <td className="receptionists-table__cell receptionists-table__cell--actions">
                        <div className="receptionists-table__actions">
                          <button className="receptionists-table__action-btn" title="View Details">
                            <span className="material-symbols-outlined">visibility</span>
                          </button>
                          <button className="receptionists-table__action-btn" title="Edit Receptionist">
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

          {/* Pagination */}
          {/* <div className="receptionists-pagination">
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
          </div> */}
        </div>
      </div>
    </AdminLayout>
  );
}

export default Receptionists;
