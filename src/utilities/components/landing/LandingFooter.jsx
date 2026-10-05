// ============================================================
//  LandingFooter.jsx – Premium MedQueue footer
//  Same links / content, visual redesign only.
// ============================================================

import React from 'react';

function FootLink({ href, children }) {
  return (
    <a
      href={href}
      className="group inline-flex items-center gap-1.5 text-[13px] font-medium text-slate-400 transition-colors duration-200 hover:text-white"
    >
      <span className="h-px w-0 bg-gradient-to-r from-[#4f8cff] to-[#2dd4bf] transition-all duration-300 group-hover:w-3"></span>
      <span className="transition-transform duration-200 group-hover:translate-x-0.5">{children}</span>
    </a>
  );
}

export default function LandingFooter() {
  return (
    <footer className="relative overflow-hidden bg-[#060d1f] text-slate-400">
      {/* Ambient treatment */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-400/60 to-transparent"></div>
        <div className="absolute -top-24 left-1/4 h-64 w-96 rounded-full bg-[#1d4ed8]/20 blur-3xl"></div>
        <div className="absolute -bottom-28 right-1/5 h-64 w-96 rounded-full bg-[#0ea5a4]/10 blur-3xl"></div>
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{ backgroundImage: 'radial-gradient(rgba(147,197,253,0.9) 1px, transparent 1px)', backgroundSize: '26px 26px' }}
        ></div>
        <span className="material-symbols-outlined pointer-events-none absolute -bottom-10 -right-6 select-none text-[200px] text-white/[0.03]">medical_services</span>
      </div>

      <div className="relative mx-auto max-w-6xl px-6 pb-8 pt-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.1fr]">
          {/* Brand */}
          <div>
            <a href="#home" className="group inline-flex items-center gap-3">
              <span className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#4f8cff] via-[#004ac6] to-[#0ea5a4] text-white shadow-[0_10px_28px_rgba(29,78,216,0.45)] transition-transform duration-300 group-hover:scale-105">
                <span className="material-symbols-outlined text-[22px]">medical_services</span>
              </span>
              <span className="leading-none">
                <span className="block font-headline-md text-[22px] font-bold tracking-tight text-white">
                  Medi<span className="bg-gradient-to-r from-[#7db4ff] to-[#5eead4] bg-clip-text text-transparent">Queue</span>
                </span>
                <span className="mt-1 block text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">
                  Smart OPD Suite
                </span>
              </span>
            </a>
            <p className="mt-4 max-w-xs text-[13px] leading-relaxed text-slate-400">
              Intelligent queue management and AI wait-time predictions for modern hospital OPDs —
              calmer waiting rooms, happier patients.
            </p>
            <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-bold text-slate-300">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400"></span>
              </span>
              All OPD systems operational
            </p>
          </div>

          {/* Platform */}
          <nav aria-label="Platform">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
              <span className="mr-2 inline-block h-[2px] w-4 rounded-full bg-gradient-to-r from-[#4f8cff] to-[#2dd4bf] align-middle"></span>
              Platform
            </p>
            <div className="mt-4 flex flex-col items-start gap-2.5">
              <FootLink href="#features">Smart Registration</FootLink>
              <FootLink href="#features">AI Wait Time Engine</FootLink>
              <FootLink href="#features">Queue Dispatch</FootLink>
              <FootLink href="#features">Admin Board</FootLink>
            </div>
          </nav>

          {/* Company */}
          <nav aria-label="Company">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
              <span className="mr-2 inline-block h-[2px] w-4 rounded-full bg-gradient-to-r from-[#4f8cff] to-[#2dd4bf] align-middle"></span>
              Company
            </p>
            <div className="mt-4 flex flex-col items-start gap-2.5">
              <FootLink href="#home">About MediQueue</FootLink>
              <FootLink href="#technology">AI Architecture</FootLink>
              <FootLink href="#benefits">Impact Stats</FootLink>
              <FootLink href="#how-it-works">Patient Workflow</FootLink>
            </div>
          </nav>

          {/* Support */}
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
              <span className="mr-2 inline-block h-[2px] w-4 rounded-full bg-gradient-to-r from-[#4f8cff] to-[#2dd4bf] align-middle"></span>
              Support
            </p>
            <a
              href="mailto:support@mediqueue.io"
              className="group mt-4 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-3.5 transition-all duration-300 hover:border-blue-400/40 hover:bg-white/[0.07]"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#4f8cff] to-[#0ea5a4] text-white shadow-md">
                <span className="material-symbols-outlined text-lg">mail</span>
              </span>
              <span className="min-w-0">
                <span className="block truncate text-[13px] font-bold text-white">support@mediqueue.io</span>
                <span className="block text-[11px] font-medium text-slate-500">Replies within 24 hours</span>
              </span>
              <span className="material-symbols-outlined ml-auto text-base text-slate-600 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-blue-300">arrow_outward</span>
            </a>
            <div className="mt-3 flex gap-2.5">
              {[
                { icon: 'share', label: 'Share' },
                { icon: 'alternate_email', label: 'Social' },
                { icon: 'rss_feed', label: 'Updates' },
              ].map((s) => (
                <span
                  key={s.icon}
                  title={s.label}
                  className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-400 transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-400/40 hover:text-white"
                >
                  <span className="material-symbols-outlined text-lg">{s.icon}</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs sm:flex-row">
          <p className="font-medium text-slate-500">© 2026 MediQueue Systems. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {[
              ['Privacy', '#privacy'],
              ['Terms', '#terms'],
              ['HIPAA', '#hipaa'],
            ].map(([label, href]) => (
              <a
                key={href}
                href={href}
                className="relative font-semibold text-slate-500 transition-colors duration-200 hover:text-white after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-gradient-to-r after:from-[#4f8cff] after:to-[#2dd4bf] after:transition-all after:duration-300 hover:after:w-full"
              >
                {label}
              </a>
            ))}
            <a
              href="#home"
              className="group inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 font-bold text-slate-300 transition-all duration-300 hover:border-blue-400/40 hover:text-white"
            >
              Back to top
              <span className="material-symbols-outlined text-sm transition-transform duration-300 group-hover:-translate-y-0.5">arrow_upward</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
