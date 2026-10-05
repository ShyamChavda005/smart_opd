import { useState } from 'react';
import '../../style/login/LoginModal.css';

import { setToken, createClientToken } from '../../auth';

export default function LoginModal({ isOpen, onClose, onLogin }) {
  const [role, setRole] = useState('receptionist'); // 'receptionist' | 'doctor' | 'admin'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleRoleChange = (newRole) => {
    setRole(newRole);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const selectedRole = role || 'receptionist';
    let url = "http://localhost:8000/login/receptionist";
    if (selectedRole === "doctor") {
      url = "http://localhost:8000/login/doctor";
    } else if (selectedRole === "admin") {
      url = "http://localhost:8000/login/admin";
    }

    setIsLoading(true);

    try {
      const user = {
        username: username.trim(),
        password
      };

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
      });

      const data = await response.json();

      console.log("Login HTTP status:", response.status);
      console.log("Login response:", data);

      // HTTP error
      if (!response.ok) {
        alert(
          data.detail ||
          data.message ||
          `${selectedRole.toUpperCase()} login failed.`
        );
        return;
      }

      // Account inactive
      if (
        data.status &&
        String(data.status).toLowerCase() !== "active"
      ) {
        alert("Your account is currently inactive or suspended by administrator.");
        return;
      }

      // Successful login
      if (
        data.token ||
        data.access_token ||
        data.message === "Login successful" ||
        data.message === "Doctor login successful" ||
        data.message === "Receptionist login successful" ||
        data.message === "Admin login successful"
      ) {
        const token = data.token || data.access_token;

        if (token) {
          setToken(token);
        } else {
          setToken(
            createClientToken(
              selectedRole,
              username,
              data.id || data.did || data.rid || data.admin_id || 1
            )
          );
        }

        onLogin(selectedRole, username, password);
        return;
      }

      // 200 but unexpected response
      console.error("Unexpected login response:", data);

      alert(
        data.message ||
        `${selectedRole.toUpperCase()} login failed. Please verify credentials.`
      );

    } catch (e) {
      console.error("Login request failed:", e);

      alert("Unable to connect to the login server.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-overlay">
      <div className="login-modal-card" role="dialog" aria-modal="true" aria-label="System Login">
        {/* Close button */}
        <button
          onClick={onClose} type="button" className="login-close" aria-label="Close login">
          <span className="material-symbols-outlined">close</span>
        </button>

        {/* Modal Header */}
        <div className="login-header">
          <div className="login-header-icon">
            <span className="material-symbols-outlined">lock_open</span>
          </div>
          <div className="login-header-text">
            <h3>System Login</h3>
            <p>Access your MediQueue portal</p>
          </div>
        </div>

        {/* Role Selection Tabs */}
        <div className="login-section">
          <label className="login-section-label">
            Select Your Role
          </label>
          <div className="login-role-group" role="tablist" aria-label="Select your role">
            <button
              type="button"
              role="tab"
              aria-selected={role === 'receptionist'}
              onClick={() => handleRoleChange('receptionist')}
              className={`login-role-tab${role === 'receptionist' ? ' login-role-tab--active' : ''}`}
            >
              <span className="material-symbols-outlined">how_to_reg</span>
              <span>Receptionist</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={role === 'doctor'}
              onClick={() => handleRoleChange('doctor')}
              className={`login-role-tab${role === 'doctor' ? ' login-role-tab--active' : ''}`}
            >
              <span className="material-symbols-outlined">medical_services</span>
              <span>Doctor</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={role === 'admin'}
              onClick={() => handleRoleChange('admin')}
              className={`login-role-tab${role === 'admin' ? ' login-role-tab--active' : ''}`}
            >
              <span className="material-symbols-outlined">admin_panel_settings</span>
              <span>Admin</span>
            </button>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-field">
            <label className="login-field-label" htmlFor="login-username">
              Username
            </label>
            <div className="login-input-wrap">
              <span className="material-symbols-outlined login-input-icon">person</span>
              <input
                id="login-username"
                required
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                autoComplete="username"
              />
            </div>
          </div>

          <div className="login-field">
            <label className="login-field-label" htmlFor="login-password">
              Password
            </label>
            <div className="login-input-wrap">
              <span className="material-symbols-outlined login-input-icon">lock</span>
              <input
                id="login-password"
                required
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="login-visibility"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                <span className="material-symbols-outlined">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="login-submit"
          >
            <span>
              Login as {role === 'receptionist' ? 'Receptionist' : role === 'doctor' ? 'Doctor' : 'Admin'}
            </span>
            <span className="material-symbols-outlined">arrow_forward</span>
          </button>
        </form>
      </div>
    </div>
  );
}
