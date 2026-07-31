// ============================================================
//  LandingFooter.jsx – Modern Landing Page Footer
// ============================================================

import React from 'react';

export default function LandingFooter() {
  return (
    <footer className="w-full bg-slate-900 text-slate-400 border-t border-slate-800 pt-16 pb-12">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          
          {/* Col 1: Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-teal-500 flex items-center justify-center text-white shadow-md">
                <span className="material-symbols-outlined text-xl">medical_services</span>
              </div>
              <span className="font-black text-2xl tracking-tight text-white">
                Medi<span className="text-blue-500">Queue</span>
              </span>
            </div>
            <p className="text-xs font-medium text-slate-400 leading-relaxed">
              Revolutionizing hospital OPD intake and clinic efficiency with intelligent queue management solutions and AI wait time predictions.
            </p>
          </div>

          {/* Col 2: Solutions */}
          <div className="flex flex-col gap-3">
            <span className="text-xs font-extrabold text-white uppercase tracking-wider">Platform Modules</span>
            <a className="text-xs font-semibold text-slate-400 hover:text-blue-400 transition-colors" href="#features">Smart Registration Kiosks</a>
            <a className="text-xs font-semibold text-slate-400 hover:text-blue-400 transition-colors" href="#features">AI Wait Time Engine</a>
            <a className="text-xs font-semibold text-slate-400 hover:text-blue-400 transition-colors" href="#features">Multi-Room Queue Dispatch</a>
            <a className="text-xs font-semibold text-slate-400 hover:text-blue-400 transition-colors" href="#features">Hospital Admin Board</a>
          </div>

          {/* Col 3: Company */}
          <div className="flex flex-col gap-3">
            <span className="text-xs font-extrabold text-white uppercase tracking-wider">Company</span>
            <a className="text-xs font-semibold text-slate-400 hover:text-blue-400 transition-colors" href="#home">About MediQueue</a>
            <a className="text-xs font-semibold text-slate-400 hover:text-blue-400 transition-colors" href="#technology">AI Architecture</a>
            <a className="text-xs font-semibold text-slate-400 hover:text-blue-400 transition-colors" href="#benefits">Impact Stats</a>
            <a className="text-xs font-semibold text-slate-400 hover:text-blue-400 transition-colors" href="#how-it-works">Patient Workflow</a>
          </div>

          {/* Col 4: Support & Contact */}
          <div className="flex flex-col gap-3">
            <span className="text-xs font-extrabold text-white uppercase tracking-wider">Connect &amp; Support</span>
            <a className="text-xs font-semibold text-slate-400 hover:text-blue-400 transition-colors flex items-center gap-2" href="mailto:support@mediqueue.io">
              <span className="material-symbols-outlined text-base text-blue-500">mail</span>
              support@mediqueue.io
            </a>
            <div className="flex gap-3 pt-2">
              <div className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer transition-colors">
                <span className="material-symbols-outlined text-base">share</span>
              </div>
              <div className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer transition-colors">
                <span className="material-symbols-outlined text-base">alternate_email</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center pt-8 border-t border-slate-800 text-xs font-semibold text-slate-500 gap-4">
          <span>© 2026 MediQueue Systems. All rights reserved.</span>
          <div className="flex gap-6">
            <a className="hover:text-slate-300 transition-colors" href="#privacy">Privacy Policy</a>
            <a className="hover:text-slate-300 transition-colors" href="#terms">Terms of Service</a>
            <a className="hover:text-slate-300 transition-colors" href="#hipaa">HIPAA Compliance</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
