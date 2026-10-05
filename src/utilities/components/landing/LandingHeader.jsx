// ============================================================
//  LandingHeader.jsx – Elegant, modern header bar
//  Same props / nav IDs / behaviour, visual polish only.
// ============================================================

import React, { useState, useEffect } from 'react';

export default function LandingHeader({ onOpenLogin, onOpenBooking }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 16);

      const sections = ['home', 'features', 'technology', 'benefits'];
      const scrollPosition = window.scrollY + 200;

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home', id: 'home' },
    { name: 'Features', href: '#features', id: 'features' },
    { name: 'Technology', href: '#technology', id: 'technology' },
    { name: 'Benefits', href: '#benefits', id: 'benefits' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/90 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,74,198,0.10)]'
          : 'bg-white/70 backdrop-blur-md'
      }`}
    >
      {/* Gradient hairline */}
      <div className="h-[2.5px] w-full bg-gradient-to-r from-[#004ac6] via-[#6366f1] to-[#0ea5a4]"></div>

      <div className="border-b border-slate-200/70">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-[68px]">
          {/* Brand */}
          <a href="#home" className="group flex items-center gap-3">
            <span className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#004ac6] via-[#1d4ed8] to-[#0ea5a4] text-white shadow-[0_8px_20px_rgba(0,74,198,0.35)] transition-transform duration-300 group-hover:scale-105">
              <span className="material-symbols-outlined text-[22px]">medical_services</span>
              <span className="absolute -right-0.5 -top-0.5 flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex h-3 w-3 rounded-full border-2 border-white bg-emerald-500"></span>
              </span>
            </span>
            <span className="leading-none">
              <span className="block font-headline-md text-[21px] font-bold tracking-tight text-on-surface">
                Medi<span className="text-primary">Queue</span>
              </span>
              <span className="mt-1 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-on-surface-variant">
                <span className="inline-block h-1 w-4 rounded-full bg-gradient-to-r from-[#004ac6] to-[#0ea5a4]"></span>
                Smart OPD Suite
              </span>
            </span>
          </a>

          {/* Desktop nav — floating pill */}
          <nav className="hidden lg:flex items-center gap-0.5 rounded-full border border-slate-200/80 bg-slate-100/70 p-1 shadow-inner">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.id}
                  href={link.href}
                  className={`relative px-5 py-2 rounded-full text-[13px] font-bold tracking-wide transition-all duration-200 ${
                    isActive
                      ? 'bg-white text-primary shadow-[0_2px_10px_rgba(0,74,198,0.15)]'
                      : 'text-on-surface-variant hover:text-on-surface hover:bg-white/70'
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute -bottom-[1px] left-1/2 h-[3px] w-8 -translate-x-1/2 rounded-full bg-gradient-to-r from-[#004ac6] to-[#0ea5a4]"></span>
                  )}
                </a>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => onOpenBooking && onOpenBooking('booking')}
              className="group inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-[13px] font-bold text-primary transition-colors hover:bg-[#e8efff]"
            >
              <span className="material-symbols-outlined text-lg">confirmation_number</span>
              Book Token
            </button>
            <span className="h-6 w-px bg-slate-200"></span>
            <button
              onClick={() => onOpenLogin && onOpenLogin('login')}
              className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#004ac6] to-[#1d4ed8] px-5 py-2.5 text-[13px] font-bold text-white shadow-[0_8px_20px_rgba(0,74,198,0.35)] transition-all hover:shadow-[0_10px_26px_rgba(0,74,198,0.45)] hover:brightness-110 active:scale-[0.98]"
            >
              <span className="material-symbols-outlined text-[18px]">login</span>
              Staff Login
              <span className="material-symbols-outlined text-base transition-transform group-hover:translate-x-0.5">arrow_forward</span>
            </button>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-on-surface shadow-sm transition-colors hover:bg-slate-50"
            aria-label="Toggle Navigation Menu"
          >
            <span className="material-symbols-outlined text-2xl">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-200 bg-white/95 backdrop-blur-xl px-6 py-4 shadow-xl animate-fadeIn">
          <nav className="space-y-1">
            {navLinks.map((link, i) => (
              <a
                key={link.id}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                  activeSection === link.id
                    ? 'bg-[#e8efff] text-primary'
                    : 'text-on-surface-variant hover:bg-slate-50'
                }`}
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-on-surface-variant">
                  0{i + 1}
                </span>
                <span className="flex-1">{link.name}</span>
                <span className="material-symbols-outlined text-base text-slate-300">chevron_right</span>
              </a>
            ))}
          </nav>
          <div className="pt-3 mt-3 border-t border-slate-100 grid gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBooking && onOpenBooking('booking');
              }}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-primary/30 bg-[#e8efff] py-2.5 text-sm font-bold text-primary transition-colors hover:bg-[#dbe7ff]"
            >
              <span className="material-symbols-outlined text-lg">confirmation_number</span>
              Book Appointment Token
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenLogin && onOpenLogin('login');
              }}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#004ac6] to-[#1d4ed8] py-2.5 text-sm font-bold text-white shadow-md"
            >
              <span className="material-symbols-outlined text-lg">login</span>
              Staff Login
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
