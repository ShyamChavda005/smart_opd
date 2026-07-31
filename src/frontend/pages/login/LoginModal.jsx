import { useState } from 'react';
import '../../style/login/LoginModal.css';

export default function LoginModal({ isOpen, onClose, onLogin }) {
  const [role, setRole] = useState(''); // 'receptionist' | 'doctor' | 'admin'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  if (!isOpen) return null;
  
  const handleRoleChange = (newRole) => {
    setRole(newRole);
  };
  
  let url = "", localName = "";

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (role === "receptionist") {
      url = "http://localhost:8000/login/receptionist";
      localName = "receptionist";
    } else if (role === "doctor") {
      url = "http://localhost:8000/login/doctor";
      localName = "doctor";
    } else if (role === "admin") {
      url = "http://localhost:8000/login/admin";
      localName = "admin";
    }

    const user = {
      "username": username,
      "password": password
    }

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(user)
    })

    const data = await response.json();

    // console.log(response.status);
    console.log(data);

    if (data.message === "Login successful") {
      localStorage.setItem(`${localName}Id`, JSON.stringify(data.id));
      onLogin(role, username, password);
    } 
    else {
      alert(`${role} - login failed `)
    }

  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="login-modal-card bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-border-subtle relative transition-all">
        {/* Close button */}
        <button
          onClick={onClose}
          type="button"
          className="absolute top-6 right-6 text-text-muted hover:text-text-heading p-2 rounded-full hover:bg-surface transition-colors"
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-blue-50 rounded-2xl text-primary border border-blue-100">
            <span className="material-symbols-outlined text-3xl">lock_open</span>
          </div>
          <div>
            <h3 className="text-2xl font-extrabold text-text-heading">System Portal Login</h3>
            <p className="text-sm text-text-muted">Select role and sign in to access your panel</p>
          </div>
        </div>

        {/* Role Selection Tabs */}
        <div className="mb-6">
          <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">
            Select Your Role
          </label>
          <div className="grid grid-cols-3 gap-2 p-1.5 bg-slate-100/80 rounded-2xl border border-slate-200">
            <button
              type="button"
              onClick={() => handleRoleChange('receptionist')}
              className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm transition-all ${role === 'receptionist'
                  ? 'bg-white text-primary shadow-md border border-blue-100'
                  : 'text-text-body hover:text-text-heading'
                }`}
            >
              <span className="material-symbols-outlined text-lg">how_to_reg</span>
              <span>Receptionist</span>
            </button>
            <button
              type="button"
              onClick={() => handleRoleChange('doctor')}
              className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm transition-all ${role === 'doctor'
                  ? 'bg-white text-primary shadow-md border border-blue-100'
                  : 'text-text-body hover:text-text-heading'
                }`}
            >
              <span className="material-symbols-outlined text-lg">medical_services</span>
              <span>Doctor</span>
            </button>
            <button
              type="button"
              onClick={() => handleRoleChange('admin')}
              className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm transition-all ${role === 'admin'
                  ? 'bg-white text-primary shadow-md border border-blue-100'
                  : 'text-text-body hover:text-text-heading'
                }`}
            >
              <span className="material-symbols-outlined text-lg">admin_panel_settings</span>
              <span>Admin</span>
            </button>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-text-heading uppercase mb-1.5">
              {role === 'admin' ? 'Username' : 'Username'}
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3.5 top-3.5 text-text-muted text-xl">
                person
              </span>
              <input
                required
                type={role === 'admin' ? 'text' : 'text'}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={role === 'admin' ? 'Enter Admin Username' : 'Enter Username'}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-border-subtle focus:ring-2 focus:ring-primary focus:outline-none text-slate-800 font-medium"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-text-heading uppercase">
                Password
              </label>
            </div>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3.5 top-3.5 text-text-muted text-xl">
                lock
              </span>
              <input
                required
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full pl-11 pr-11 py-3 rounded-xl border border-border-subtle focus:ring-2 focus:ring-primary focus:outline-none text-slate-800 font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600"
              >
                <span className="material-symbols-outlined text-xl">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-primary text-on-primary rounded-xl font-bold shadow-lg shadow-blue-500/25 hover:bg-blue-700 transition-all flex items-center justify-center gap-2 text-base mt-4"
          >
            <span>
              Login as {role === 'receptionist' ? 'Receptionist' : role === 'doctor' ? 'Doctor' : 'Admin'}
            </span>
            <span className="material-symbols-outlined text-lg">arrow_forward</span>
          </button>
        </form>
      </div>
    </div>
  );
}
