// ============================================================
//  auth.js  –  Central JWT Authentication Service
// ============================================================

const TOKEN_KEY = 'auth_token';

/**
 * Store the JWT token in localStorage.
 * @param {string} token
 */
export function setToken(token) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  }
}

/**
 * Retrieve the JWT token from localStorage.
 * @returns {string|null}
 */
export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

/**
 * Remove the JWT token and all role flags on logout.
 */
export function removeToken() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem('isAdminLoggedIn');
  localStorage.removeItem('isDoctorLoggedIn');
  localStorage.removeItem('isReceptionistLoggedIn');
  localStorage.removeItem('adminId');
  localStorage.removeItem('doctorId');
  localStorage.removeItem('receptionistId');
  localStorage.removeItem('doctorusername');
}

/**
 * Safe client-side JWT payload parser (RFC 7519 compliant).
 * @param {string} token
 * @returns {object|null}
 */
export function parseJwt(token) {
  if (!token || typeof token !== 'string') return null;

  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    // Base64url to Base64
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    return JSON.parse(jsonPayload);
  } catch (err) {
    console.warn('Failed to parse JWT payload:', err);
    return null;
  }
}

/**
 * Get the current decoded user payload from the active token.
 * @returns {{ uid: number|string, role: string, username: string, exp: number }|null}
 */
export function getAuthPayload() {
  const token = getToken();
  return parseJwt(token);
}

/**
 * Get the role associated with the active token.
 * @returns {string|null} 'admin' | 'doctor' | 'receptionist' | null
 */
export function getUserRole() {
  const payload = getAuthPayload();
  return payload?.role || null;
}

/**
 * Check if a valid, unexpired token exists.
 * Optionally validates against an expected role.
 * @param {string} [requiredRole]
 * @returns {boolean}
 */
export function isAuthenticated(requiredRole) {
  const payload = getAuthPayload();
  if (!payload) return false;

  // Check expiration if exp claim is present
  if (payload.exp && Date.now() >= payload.exp * 1000) {
    removeToken();
    return false;
  }

  if (requiredRole && payload.role !== requiredRole) {
    return false;
  }

  return true;
}

/**
 * Generate standard HTTP Authorization headers for API calls.
 * @returns {object}
 */
export function getAuthHeaders() {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json'
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
}

/**
 * Client-side mock JWT token generator for testing / offline resilience.
 * @param {string} role 'admin' | 'doctor' | 'receptionist'
 * @param {string} username
 * @param {number|string} [uid]
 * @returns {string} valid JWT-formatted string
 */
export function createClientToken(role, username, uid = 1) {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const exp = Math.floor(Date.now() / 1000) + 86400; // 24 hours
  const payload = btoa(
    JSON.stringify({
      uid,
      role,
      username: username || `${role}_user`,
      exp
    })
  );
  const signature = btoa('smart_opd_client_signature');
  return `${header}.${payload}.${signature}`;
}

/**
 * Log out user and redirect to home.
 * @param {function} [navigate] optional react-router navigate function
 */
export function logout(navigate) {
  removeToken();
  if (typeof navigate === 'function') {
    navigate('/');
  } else {
    window.location.href = '/';
  }
}
