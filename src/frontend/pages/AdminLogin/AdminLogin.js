// ============================================================
//  AdminLogin.js  –  Admin Login Page Component
// ============================================================

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminLogin.css';


// ---------- Admin Credentials ----------
const ADMIN_EMAIL    = 'admin@gmail.com';
const ADMIN_PASSWORD = 'admin@123';


function AdminLogin() {
  const navigate = useNavigate();

  // ---------- State ----------
  const [email, setEmail]             = useState('');
  const [password, setPassword]       = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe]   = useState(false);
  const [isLoading, setIsLoading]     = useState(false);
  const [error, setError]             = useState('');


  // ---------- Handlers ----------

  /** Toggle password visibility */
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  /** Form submission – validate credentials */
  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate a short network delay
    setTimeout(() => {
      if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        // Save auth flag and redirect to dashboard
        localStorage.setItem('isAdminLoggedIn', 'true');
        navigate('/admin/dashboard');
      } else {
        setError('Invalid email or password. Please try again.');
        setIsLoading(false);
      }
    }, 800);
  };


  // ---------- Render ----------
  return (
    <div className="login-page">

      {/* ---- Login Card ---- */}
      <div className="login-card">

        {/* Blue accent bar */}
        <div className="login-card__accent" />

        {/* Card body */}
        <div className="login-card__body">

          {/* --- Header --- */}
          <div className="login-header">
            <h1 className="login-header__title">Admin Login</h1>
            <p className="login-header__subtitle">
              Please enter your credentials to access the secure
              administrative dashboard.
            </p>
          </div>

          {/* --- Error Message --- */}
          {error && (
            <div className="login-error">
              <span className="material-symbols-outlined login-error__icon">error</span>
              <span className="login-error__text">{error}</span>
            </div>
          )}

          {/* --- Auto-fill Button --- */}
          <button
            className="autofill-btn"
            type="button"
            onClick={() => {
              setEmail(ADMIN_EMAIL);
              setPassword(ADMIN_PASSWORD);
              setError('');
            }}
          >
            <span className="material-symbols-outlined autofill-btn__icon">auto_fix_high</span>
            <span>Auto-fill Admin</span>
          </button>

          {/* --- Form --- */}
          <form className="login-form" onSubmit={handleSubmit}>

            {/* Input fields */}
            <div className="login-form__fields">

              {/* Email */}
              <div className="input-group">
                <label className="input-group__label" htmlFor="email">
                  Email Address
                </label>
                <div className="input-wrapper">
                  <input
                    className="input-wrapper__field"
                    id="email"
                    type="email"
                    placeholder="admin@company.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <span className="material-symbols-outlined input-wrapper__icon">
                    mail
                  </span>
                </div>
              </div>

              {/* Password */}
              <div className="input-group">
                <div className="input-group__label-row">
                  <label className="input-group__label" htmlFor="password">
                    Password
                  </label>
                  <a className="input-group__forgot-link" href="#forgot">
                    Forgot Password?
                  </a>
                </div>
                <div className="input-wrapper">
                  <input
                    className="input-wrapper__field input-wrapper__field--with-toggle"
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <span className="material-symbols-outlined input-wrapper__icon">
                    lock
                  </span>
                  <button
                    className="input-wrapper__toggle"
                    type="button"
                    onClick={togglePasswordVisibility}
                    aria-label="Toggle password visibility"
                  >
                    <span className="material-symbols-outlined">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Remember me */}
            <div className="remember-row">
              <div className="remember-row__checkbox-wrapper">
                <input
                  className="remember-row__checkbox"
                  id="remember"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span className="material-symbols-outlined remember-row__checkmark">
                  check
                </span>
              </div>
              <label className="remember-row__label" htmlFor="remember">
                Remember my device for 30 days
              </label>
            </div>

            {/* Submit button */}
            <button
              className="login-btn"
              id="login-btn"
              type="submit"
              disabled={isLoading}
            >
              <span>{isLoading ? 'Authenticating...' : 'Sign In'}</span>
              <span className="material-symbols-outlined login-btn__icon">
                arrow_forward
              </span>
            </button>
          </form>

          {/* --- Divider --- */}
          <div className="login-divider">
            <div className="login-divider__line" />
            <span className="login-divider__text">
              Secure Administrative Access Only
            </span>
          </div>
        </div>
      </div>

      {/* ---- Footer Links ---- */}
      <div className="login-footer">
        <a className="login-footer__link" href="#terms">
          Terms of Service
        </a>
        <span className="login-footer__separator">•</span>
        <a className="login-footer__link" href="#privacy">
          Privacy Policy
        </a>
      </div>
    </div>
  );
}

export default AdminLogin;
