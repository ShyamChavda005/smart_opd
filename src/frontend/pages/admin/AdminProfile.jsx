// ============================================================
//  AdminProfile.jsx  –  Admin Profile Page Component
// ============================================================

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import '../../style/admin/AdminProfile.css';

function AdminProfile() {
  const navigate = useNavigate();

  // Personal Info Form State
  const [personalInfo, setPersonalInfo] = useState({
    "id" : "",
    "name" : "",
    "email" : "",
    "username" : "",
    "password" : "",
    "create_at" : ""
  });

  // Password Security Form State
  const [securityData, setSecurityData] = useState({
    currentPassword: personalInfo.password,
    newPassword: "",
    confirmPassword: "",
  });


  useEffect(() => {
    fetch("http://localhost:8000/admin")
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      setPersonalInfo(data[0]);
    })
    .catch((err) => {
      console.log(err);
    })
  },[]);


  // Password Visibility Toggles
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handlePersonalChange = (e) => {
    const { name, value } = e.target;
    setPersonalInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSecurityChange = (e) => {
    const { name, value } = e.target;
    setSecurityData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSavePersonal = async (e) => {
    e.preventDefault();

    const response = await fetch(`http://localhost:8000/admin/${personalInfo.id}`, {
      method : "PUT",
      headers : {
        "Content-Type" : "application/json",
      },
      body : JSON.stringify(personalInfo)
    })

    if (!response.ok) {
      alert("some issue in update")
    }

    alert('profile updated');
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();

    if (!securityData.currentPassword) {
      alert("current password can not be null")
    }

    const updateData = {
      ...personalInfo,
      password : securityData.newPassword
    }

    const response = await fetch(`http://localhost:8000/admin/${personalInfo.id}`, {
      method : "PUT",
      headers : {
        "Content-Type" : "application/json"
      },
      body : JSON.stringify(updateData)
    })
    
      
    if (response.ok) {
      alert("Password Updated");
    }
    else {
      alert("confirmPassword not match");
    }

  };

  return (
    <AdminLayout>
      <div className="admin-profile-page">

        {/* ---------- Breadcrumb ---------- */}
        <nav className="admin-profile-breadcrumb">
          <a href="#dashboard" onClick={(e) => { e.preventDefault(); navigate('/admin/dashboard'); }}>
            Dashboard
          </a>
          <span className="material-symbols-outlined">chevron_right</span>
          <span>Settings</span>
          <span className="material-symbols-outlined">chevron_right</span>
          <span className="admin-profile-breadcrumb__active">Admin Profile</span>
        </nav>

        {/* ---------- Header ---------- */}
        <div className="admin-profile-header">
          <h1 className="admin-profile-header__title">Admin Profile</h1>
          <p className="admin-profile-header__desc">
            Manage your account settings and preferences.
          </p>
        </div>

        {/* ---------- Main Grid Layout ---------- */}
        <div className="admin-profile-grid">

          {/* ================= LEFT COLUMN ================= */}
          <div className="admin-profile-left-col">

            {/* Profile Summary Card */}
            <div className="ap-card ap-profile-card">
              <div className="ap-avatar-ring">
                <div className="ap-avatar-ring__bg">
                  {personalInfo.name.split(" ")[0]?.charAt(0)}
                  {personalInfo.name.split(" ")[1]?.charAt(0)}
                  </div>
              </div>
              <h2 className="ap-profile-name">{personalInfo.name}</h2>
              <div className="ap-profile-badge">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                  verified_user
                </span>
                <span>System Admin</span>
              </div>
              <p className="ap-profile-desc">
                Overseeing system configurations, user management, and security protocols.
              </p>

              <div className="ap-profile-stats">
                <div className="ap-profile-stat-row">
                  <span className="ap-profile-stat-key">Account Create Date</span>
                  <span className="ap-profile-stat-val">{new Date(personalInfo.create_at).toLocaleDateString("en-IN")}</span>
                </div>
                <div className="ap-profile-stat-row">
                  <span className="ap-profile-stat-key">Account Create Time</span>
                  <span className="ap-profile-stat-val">{
                    new Date(personalInfo.create_at).toLocaleDateString("en-IN", {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",  
                      hour12: true,
                    }).split(",")[1]
                  }
                </span>
                </div>
              </div>
            </div>

            {/* Security Activity Card */}
            <div className="ap-card ap-card--sm-padding">
              <h3 className="ap-card-title">
                <span className="material-symbols-outlined">security</span>
                <span>Security Activity</span>
              </h3>
              <div className="ap-timeline">
                <div className="ap-timeline-item">
                  <div className="ap-timeline-line" />
                  <div className="ap-timeline-icon">
                    <span className="material-symbols-outlined">login</span>
                  </div>
                  <div className="ap-timeline-content">
                    <p className="ap-timeline-title">Login from new IP</p>
                    <p className="ap-timeline-sub">192.168.1.45 • 2 hours ago</p>
                  </div>
                </div>
                <div className="ap-timeline-item">
                  <div className="ap-timeline-icon">
                    <span className="material-symbols-outlined">password</span>
                  </div>
                  <div className="ap-timeline-content">
                    <p className="ap-timeline-title">Password updated</p>
                    <p className="ap-timeline-sub">30 days ago</p>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* ================= RIGHT COLUMN ================= */}
          <div className="admin-profile-right-col">

            {/* Personal Information Card */}
            <div className="ap-card">
              <div className="ap-card-header">
                <h3 className="ap-card-title">
                  <span className="material-symbols-outlined">person</span>
                  <span>Personal Information</span>
                </h3>
              </div>

              <form onSubmit={handleSavePersonal}>
                <div className="ap-form-grid-2">
                  {/* First Name */}
                  <div className="ap-input-group">
                    <label className="ap-input-group__label">ID</label>
                    <div className="ap-input-group__wrap">
                      <span className="material-symbols-outlined">badge</span>
                      <input
                        className="ap-input-group__control"
                        type="text"
                        name="firstName"
                        value={personalInfo.id}
                        disabled
                      />
                    </div>
                  </div>

                  {/* Last Name */}
                  <div className="ap-input-group">
                    <label className="ap-input-group__label">Name</label>
                    <div className="ap-input-group__wrap">
                      <span className="material-symbols-outlined">badge</span>
                      <input
                        className="ap-input-group__control"
                        type="text"
                        name="name"
                        value={personalInfo.name}
                        onChange={handlePersonalChange}
                      />
                    </div>
                  </div>

                  {/* Email Address */}
                  <div className="ap-input-group">
                    <label className="ap-input-group__label">Email Address</label>
                    <div className="ap-input-group__wrap">
                      <span className="material-symbols-outlined">mail</span>
                      <input
                        className="ap-input-group__control"
                        type="email"
                        name="email"
                        value={personalInfo.email}
                        onChange={handlePersonalChange}
                      />
                    </div>
                  </div>

                  {/* Username */}
                  <div className="ap-input-group">
                    <label className="ap-input-group__label">Username</label>
                    <div className="ap-input-group__wrap">
                      <span className="material-symbols-outlined">alternate_email</span>
                      <input
                        className="ap-input-group__control"
                        type="text"
                        name="username"
                        value={personalInfo.username}
                        onChange={handlePersonalChange}
                      />
                    </div>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="ap-form-actions">
                  <button
                    type="button"
                    className="ap-btn-cancel"
                    onClick={() => navigate('/admin/dashboard')}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="ap-btn-save">
                    <span className="material-symbols-outlined">save</span>
                    <span>Save Changes</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Password & Security Card */}
            <div className="ap-card">
              <div className="ap-security-blob" />
              <div className="ap-card-header">
                <h3 className="ap-card-title ap-card-title--danger">
                  <span className="material-symbols-outlined">lock</span>
                  <span>Password & Security</span>
                </h3>
                <p className="ap-card-subtitle">
                  Ensure your account is using a long, random password to stay secure.
                </p>
              </div>

              <form onSubmit={handleUpdatePassword} style={{ position: 'relative', zIndex: 1 }}>
                <div className="ap-input-group" style={{ marginBottom: '24px' }}>
                  <label className="ap-input-group__label">Current Password</label>
                  <div className="ap-input-group__wrap">
                    <span className="material-symbols-outlined">key</span>
                    <input
                      className="ap-input-group__control"
                      type={showCurrent ? 'text' : 'password'}
                      name="currentPassword"
                      value={securityData.currentPassword}
                      placeholder={personalInfo.password}
                      onChange={handleSecurityChange}
                      style={{ paddingRight: '48px' }}
                      required
                    />
                    <button
                      type="button"
                      className="ap-input-group__toggle-btn"
                      onClick={() => setShowCurrent((prev) => !prev)}
                    >
                      <span className="material-symbols-outlined">
                        {showCurrent ? 'visibility' : 'visibility_off'}
                      </span>
                    </button>
                  </div>
                </div>

                <div className="ap-form-grid-2">
                  {/* New Password */}
                  <div className="ap-input-group">
                    <label className="ap-input-group__label">New Password</label>
                    <div className="ap-input-group__wrap">
                      <span className="material-symbols-outlined">lock_reset</span>
                      <input
                        className="ap-input-group__control"
                        type={showNew ? 'text' : 'password'}
                        name="newPassword"
                        value={securityData.newPassword}
                        onChange={handleSecurityChange}
                        style={{ paddingRight: '48px' }}
                        required
                      />
                      <button
                        type="button"
                        className="ap-input-group__toggle-btn"
                        onClick={() => setShowNew((prev) => !prev)}
                      >
                        <span className="material-symbols-outlined">
                          {showNew ? 'visibility' : 'visibility_off'}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Confirm New Password */}
                  <div className="ap-input-group">
                    <label className="ap-input-group__label">Confirm New Password</label>
                    <div className="ap-input-group__wrap">
                      <span className="material-symbols-outlined">check_circle</span>
                      <input
                        className="ap-input-group__control"
                        type={showConfirm ? 'text' : 'password'}
                        name="confirmPassword"
                        value={securityData.confirmPassword}
                        onChange={handleSecurityChange}
                        style={{ paddingRight: '48px' }}
                      />
                      <button
                        type="button"
                        className="ap-input-group__toggle-btn"
                        onClick={() => setShowConfirm((prev) => !prev)}
                      >
                        <span className="material-symbols-outlined">
                          {showConfirm ? 'visibility' : 'visibility_off'}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Submit Action */}
                <div className="ap-form-actions" style={{ justifyContent: 'flex-start' }}>
                  <button type="submit" className="ap-btn-update">
                    <span className="material-symbols-outlined">update</span>
                    <span>Update Password</span>
                  </button>
                </div>
              </form>
            </div>

          </div>

        </div>
      </div>
    </AdminLayout>
  );
}


export default AdminProfile;
