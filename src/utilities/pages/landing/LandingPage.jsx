import { useState } from 'react';
import LoginModal from '../login/LoginModal';
import LandingHeader from '../../components/landing/LandingHeader';
import HeroSection from '../../components/landing/HeroSection';
import FeaturesSection from '../../components/landing/FeaturesSection';
import ProcessSection from '../../components/landing/ProcessSection';
import AIIntelligenceSection from '../../components/landing/AIIntelligenceSection';
import TechSection from '../../components/landing/TechSection';
import BenefitsSection from '../../components/landing/BenefitsSection';
import CtaSection from '../../components/landing/CtaSection';
import LandingFooter from '../../components/landing/LandingFooter';
import GlassSelect from '../../components/controls/GlassSelect';
import '../../style/landing_page/LandingPage.css';

export default function LandingPage({ onLogin }) {
  const [modalType, setModalType] = useState(null);

  const openModal = (type) => setModalType(type);
  const closeModal = () => setModalType(null);

  return (
    <div className="bg-surface font-body-md text-on-surface min-h-screen">
      <LandingHeader onOpenLogin={openModal} onOpenBooking={openModal} />

      <main className="w-full">
        <HeroSection onOpenBooking={openModal} onOpenLogin={openModal} />

        {/* Trusted strip */}
        <section className="py-10 bg-white border-y border-slate-100">
          <div className="max-w-6xl mx-auto px-6">
            <p className="text-center text-[11px] font-bold text-on-surface-variant uppercase tracking-[0.18em] mb-6">
              Designed for modern healthcare institutions
            </p>
            <div className="flex flex-wrap justify-center items-center gap-8 lg:gap-14 text-on-surface/40">
              <span className="text-lg font-bold tracking-tight">APOLLO</span>
              <span className="text-lg font-bold tracking-tight italic">AIIMS</span>
              <span className="text-lg font-bold tracking-tight">FORTIS</span>
              <span className="text-lg font-bold tracking-tight">MAX HEALTHCARE</span>
              <span className="text-lg font-bold tracking-tight uppercase">Civil Hospital</span>
            </div>
          </div>
        </section>

        <FeaturesSection onOpenFeature={openModal} />
        <ProcessSection />
        <AIIntelligenceSection onOpenDemo={openModal} />
        <TechSection />
        <BenefitsSection />
        <CtaSection onOpenBooking={openModal} onOpenLogin={openModal} />
      </main>

      <LandingFooter />

      <LoginModal
        isOpen={modalType === 'login'}
        onClose={closeModal}
        onLogin={(role, username, password) => {
          onLogin(role, username, password);
          closeModal();
        }}
      />

      {/* Booking / Demo Modal — behaviour unchanged */}
      {modalType && modalType !== 'login' && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-7 max-w-md w-full shadow-xl border border-slate-200 relative">
            <button
              onClick={closeModal}
              className="absolute top-5 right-5 text-on-surface-variant hover:text-on-surface p-2 rounded-full hover:bg-slate-100"
            >
              <span className="material-symbols-outlined">close</span>
            </button>

            {modalType === 'booking' && (
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-11 h-11 rounded-xl bg-surface-container text-primary flex items-center justify-center">
                    <span className="material-symbols-outlined text-2xl">calendar_add_on</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-on-surface">Book appointment</h3>
                    <p className="text-[13px] text-on-surface-variant">AI-estimated quick booking</p>
                  </div>
                </div>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    alert('Appointment Request Submitted! Check your SMS for token confirmation.');
                    closeModal();
                  }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-xs font-semibold text-on-surface uppercase mb-1.5">
                      Patient full name
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="John Doe"
                      className="w-full px-4 py-2.5 rounded-xl border border-outline-variant focus:ring-2 focus:ring-primary/30 focus:border-primary focus:outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-on-surface uppercase mb-1.5">
                      Department
                    </label>
                    <GlassSelect ariaLabel="Department" defaultValue="General Medicine & OPD">
                      <option>General Medicine &amp; OPD</option>
                      <option>Cardiology</option>
                      <option>Pediatrics</option>
                      <option>Orthopedics</option>
                      <option>Neurology</option>
                    </GlassSelect>
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-[#003da3] transition-colors"
                  >
                    Confirm &amp; generate token
                  </button>
                </form>
              </div>
            )}

            {(modalType === 'demo' || modalType === 'feature') && (
              <div className="text-center py-2">
                <div className="w-14 h-14 bg-surface-container text-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="material-symbols-outlined text-3xl">smart_toy</span>
                </div>
                <h3 className="text-lg font-bold text-on-surface mb-2">Request live demo</h3>
                <p className="text-sm text-on-surface-variant mb-6 leading-relaxed">
                  See how MediQueue transforms patient waiting times with AI predictions and
                  real-time operational analytics.
                </p>
                <button onClick={closeModal}
                  className="w-full py-3 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-[#003da3] transition-colors">
                  Schedule demo
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
