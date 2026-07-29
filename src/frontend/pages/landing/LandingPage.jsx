import { useState } from 'react';
import LoginModal from '../login/LoginModal';
import '../../style/landing_page/LandingPage.css';

export default function LandingPage({ onLogin }) {
  const [modalType, setModalType] = useState(null); // 'login' | 'booking' | 'feature'

  const openModal = (type) => setModalType(type);
  const closeModal = () => setModalType(null);

  return (
    <div className="bg-surface font-body-md text-on-surface transition-colors duration-300 min-h-screen">
      {/* Header / Navbar */}
      <header className="fixed top-0 w-full z-50 transition-all duration-300 bg-surface/80 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <div className="h-20 max-w-[1440px] mx-auto px-margin flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[32px]">medical_services</span>
            <span className="font-headline-md text-headline-md text-primary tracking-tight font-bold">MediQueue</span>
          </div>

          <nav className="hidden lg:flex items-center gap-10 absolute left-1/2 -translate-x-1/2">
            <a className="transition-colors text-primary font-bold" href="#home">Home</a>
            <a className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors font-medium" href="#features">Features</a>
            <a className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors font-medium" href="#technology">Technology</a>
            <a className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors font-medium" href="#benefits">Benefits</a>
          </nav>

          <div className="flex items-center gap-gutter">
            <button
              onClick={() => openModal('login')}
              className="bg-surface-container-lowest text-primary px-6 py-2 rounded-full font-label-md text-label-md border border-primary hover:bg-primary hover:text-on-primary transition-all shadow-sm active:scale-95 font-bold"
            >
              Login
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full pt-20 bg-surface">
        <div className="flex flex-col w-full">
          {/* Hero Section */}
          <section className="relative pt-24 pb-32 overflow-hidden bg-surface-bright flex items-center min-h-[921px]" id="home">
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-bl from-primary-fixed/30 to-transparent blur-3xl pointer-events-none rounded-bl-full opacity-60"></div>
            <div className="absolute bottom-0 left-0 w-1/3 h-2/3 bg-gradient-to-tr from-surface-container-highest/50 to-transparent blur-3xl pointer-events-none rounded-tr-full opacity-40"></div>

            <div className="max-w-container_max mx-auto px-margin w-full relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                {/* Hero Text */}
                <div className="flex flex-col gap-8 max-w-xl">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-fixed text-on-primary-fixed w-fit border border-primary-fixed-dim/30 shadow-sm">
                    <span className="material-symbols-outlined text-sm">smart_toy</span>
                    <span className="font-label-md text-label-md font-bold uppercase tracking-wider">AI-Powered Queueing</span>
                  </div>

                  <h1 className="font-display-lg text-[48px] leading-[1.1] lg:text-[64px] text-on-surface tracking-tight font-bold">
                    <span className="text-primary">MediQueue:</span> Smart OPD Queue &amp; AI Waiting Time Prediction
                  </h1>

                  <p className="font-body-lg text-body-lg text-on-surface-variant text-lg">
                    Reduce hospital waiting time with Artificial Intelligence, Smart Queue Management, Real-Time Monitoring, and Intelligent Patient Flow Optimization.
                  </p>

                  <div className="flex flex-wrap gap-4 pt-4">
                    <button
                      onClick={() => openModal('booking')}
                      className="bg-primary text-on-primary px-8 py-4 rounded-xl font-label-md text-label-md hover:bg-primary-container hover:text-on-primary-container transition-all shadow-md hover:shadow-lg active:scale-95 flex items-center gap-2 font-bold"
                    >
                      Book Appointment
                      <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                    </button>
                    <a
                      href="#features"
                      className="bg-surface-container-lowest text-on-surface px-8 py-4 rounded-xl font-label-md text-label-md border border-outline-variant hover:bg-surface-container hover:border-primary transition-all shadow-sm active:scale-95 flex items-center gap-2 font-bold"
                    >
                      Explore Features
                    </a>
                  </div>
                </div>

                {/* Hero Visual */}
                <div className="relative w-full h-[500px] lg:h-[600px] rounded-3xl overflow-hidden shadow-2xl bg-surface-container border border-outline-variant/30 flex items-center justify-center group">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary to-surface-tint opacity-90 transition-transform duration-700 group-hover:scale-105"></div>
                  {/* Abstract UI Representation */}
                  <div className="relative z-10 w-full h-full p-8 flex flex-col justify-between">
                    {/* Floating Card 1 */}
                    <div className="bg-surface/10 backdrop-blur-md border border-surface/20 p-6 rounded-2xl w-3/4 shadow-xl transform translate-x-4 translate-y-4 animate-float">
                      <div className="flex items-center gap-3 mb-4 animate-breathe">
                        <span className="material-symbols-outlined text-surface-bright">speed</span>
                        <span className="text-surface-bright font-label-md text-label-md font-bold uppercase tracking-wider">AI Live Dispatch</span>
                      </div>
                      <h3 className="text-surface-bright font-headline-md text-headline-md opacity-80 uppercase tracking-widest text-sm mb-1">Current Active Token</h3>
                      <p className="text-on-primary font-display-lg text-display-lg font-bold">#T-104 - Cardiology</p>
                      <div className="mt-4 flex items-center gap-2 text-surface-dim font-caption text-caption">
                        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                        Est. Wait: &lt; 4 mins
                      </div>
                    </div>

                    {/* Floating Card 2 */}
                    <div className="self-end bg-surface text-on-surface p-4 rounded-2xl w-1/2 shadow-xl flex items-center gap-4 transform -translate-x-4 -translate-y-4 animate-float-reverse relative overflow-hidden">
                      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer"></div>
                      <div className="w-12 h-12 rounded-full bg-primary-fixed flex items-center justify-center">
                        <span className="material-symbols-outlined text-primary">analytics</span>
                      </div>
                      <div>
                        <h4 className="font-label-md text-label-md font-bold">98% Accuracy</h4>
                        <p className="font-caption text-caption text-on-surface-variant">Predictive AI Node</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Trusted By Section */}
          <section className="py-12 bg-surface border-y border-outline-variant/20">
            <div className="max-w-container_max mx-auto px-margin">
              <p className="text-center font-label-md text-label-md text-on-surface-variant uppercase tracking-[0.2em] mb-8 font-semibold">
                Designed for Modern Healthcare Institutions
              </p>
              <div className="flex flex-wrap justify-center items-center gap-12 lg:gap-24 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                <span className="font-display-lg text-2xl font-bold tracking-tighter text-on-surface">APOLLO</span>
                <span className="font-display-lg text-2xl font-bold tracking-tighter text-on-surface italic">AIIMS</span>
                <span className="font-display-lg text-2xl font-bold tracking-tighter text-on-surface">FORTIS</span>
                <span className="font-display-lg text-2xl font-bold tracking-tighter text-on-surface">MAX HEALTHCARE</span>
                <span className="font-display-lg text-2xl font-bold tracking-tighter text-on-surface uppercase">Civil Hospital</span>
              </div>
            </div>
          </section>

          {/* Features Grid Section */}
          <section className="py-32 bg-surface-container-lowest" id="features">
            <div className="max-w-container_max mx-auto px-margin">
              <div className="text-center max-w-3xl mx-auto mb-20">
                <h2 className="font-display-lg text-display-lg text-on-surface mb-4 font-bold">Powerful Features for Modern Hospitals</h2>
                <p className="font-body-lg text-body-lg text-on-surface-variant">
                  Comprehensive modules designed to handle every stage of the patient journey and hospital administration.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Feature 1 */}
                <div className="bg-surface rounded-3xl p-8 border border-outline-variant/30 hover:border-primary/50 hover:shadow-xl transition-all duration-300 group flex flex-col items-start h-full">
                  <div className="w-14 h-14 rounded-2xl bg-primary-fixed flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-primary text-[28px]">qr_code_scanner</span>
                  </div>
                  <h3 className="font-headline-md text-headline-md text-on-surface mb-3 font-bold">Smart Patient Registration</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant flex-grow mb-6">
                    Contactless check-in with QR codes and instant digital health record creation.
                  </p>
                  <button
                    onClick={() => openModal('feature')}
                    className="font-label-md text-label-md text-primary flex items-center gap-1 hover:gap-2 transition-all mt-auto font-bold"
                  >
                    Learn More <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </button>
                </div>

                {/* Feature 2 */}
                <div className="bg-surface rounded-3xl p-8 border border-outline-variant/30 hover:border-primary/50 hover:shadow-xl transition-all duration-300 group flex flex-col items-start h-full">
                  <div className="w-14 h-14 rounded-2xl bg-secondary-container flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-secondary text-[28px]">event_available</span>
                  </div>
                  <h3 className="font-headline-md text-headline-md text-on-surface mb-3 font-bold">Appointment Management</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant flex-grow mb-6">
                    Centralized system to schedule, reschedule, and manage doctor availability in real-time.
                  </p>
                  <button
                    onClick={() => openModal('feature')}
                    className="font-label-md text-label-md text-primary flex items-center gap-1 hover:gap-2 transition-all mt-auto font-bold"
                  >
                    Learn More <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </button>
                </div>

                {/* Feature 3 */}
                <div className="bg-surface rounded-3xl p-8 border border-outline-variant/30 hover:border-primary/50 hover:shadow-xl transition-all duration-300 group flex flex-col items-start h-full">
                  <div className="w-14 h-14 rounded-2xl bg-tertiary-container/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-tertiary text-[28px]">psychology</span>
                  </div>
                  <h3 className="font-headline-md text-headline-md text-on-surface mb-3 font-bold">AI Waiting Time Prediction</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant flex-grow mb-6">
                    Hyper-accurate wait time estimates based on historical data and current live loads.
                  </p>
                  <button
                    onClick={() => openModal('feature')}
                    className="font-label-md text-label-md text-primary flex items-center gap-1 hover:gap-2 transition-all mt-auto font-bold"
                  >
                    Learn More <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </button>
                </div>

                {/* Feature 4 */}
                <div className="bg-surface rounded-3xl p-8 border border-outline-variant/30 hover:border-primary/50 hover:shadow-xl transition-all duration-300 group flex flex-col items-start h-full">
                  <div className="w-14 h-14 rounded-2xl bg-primary-fixed-dim/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-primary text-[28px]">monitoring</span>
                  </div>
                  <h3 className="font-headline-md text-headline-md text-on-surface mb-3 font-bold">Real-Time Monitoring</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant flex-grow mb-6">
                    Live visual tracker for admins to monitor patient flow and staff performance.
                  </p>
                  <button
                    onClick={() => openModal('feature')}
                    className="font-label-md text-label-md text-primary flex items-center gap-1 hover:gap-2 transition-all mt-auto font-bold"
                  >
                    Learn More <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </button>
                </div>

                {/* Feature 5 */}
                <div className="bg-surface rounded-3xl p-8 border border-outline-variant/30 hover:border-error/30 hover:shadow-xl transition-all duration-300 group flex flex-col items-start h-full">
                  <div className="w-14 h-14 rounded-2xl bg-error-container flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-error text-[28px]">priority_high</span>
                  </div>
                  <h3 className="font-headline-md text-headline-md text-on-surface mb-3 font-bold">Priority Scheduling</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant flex-grow mb-6">
                    Automated triage categorization for emergency and high-priority patients.
                  </p>
                  <button
                    onClick={() => openModal('feature')}
                    className="font-label-md text-label-md text-primary flex items-center gap-1 hover:gap-2 transition-all mt-auto font-bold"
                  >
                    Learn More <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </button>
                </div>

                {/* Feature 6 */}
                <div className="bg-surface rounded-3xl p-8 border border-outline-variant/30 hover:border-secondary/50 hover:shadow-xl transition-all duration-300 group flex flex-col items-start h-full">
                  <div className="w-14 h-14 rounded-2xl bg-secondary-fixed/50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-secondary text-[28px]">confirmation_number</span>
                  </div>
                  <h3 className="font-headline-md text-headline-md text-on-surface mb-3 font-bold">Token Generation</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant flex-grow mb-6">
                    Seamless automated token systems via mobile notifications and digital displays.
                  </p>
                  <button
                    onClick={() => openModal('feature')}
                    className="font-label-md text-label-md text-primary flex items-center gap-1 hover:gap-2 transition-all mt-auto font-bold"
                  >
                    Learn More <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Timeline Section */}
          <section className="py-32 bg-surface relative overflow-hidden" id="how-it-works">
            <div className="max-w-container_max mx-auto px-margin relative z-10">
              <div className="text-center max-w-3xl mx-auto mb-24">
                <h2 className="font-display-lg text-display-lg text-on-surface mb-4 font-bold">Patient Flow Simplified</h2>
                <p className="font-body-lg text-body-lg text-on-surface-variant">
                  Seamless coordination from the moment a patient arrives until their departure.
                </p>
              </div>
              <div className="relative flex justify-between items-center w-full max-w-5xl mx-auto overflow-x-auto pb-8 hide-scrollbar">
                <div className="absolute top-1/2 left-0 w-full h-[2px] bg-outline-variant/30 -translate-y-1/2 z-0 hidden md:block"></div>
                
                {[
                  { num: '1', name: 'Registration' },
                  { num: '2', name: 'Booking' },
                  { num: '3', name: 'Token Gen' },
                  { num: '4', name: 'Queue Mgmt', active: true },
                  { num: '5', name: 'AI Prediction' },
                  { num: '6', name: 'Consultation' },
                  { num: '7', name: 'Analytics' },
                ].map((step) => (
                  <div key={step.num} className="flex flex-col items-center gap-4 relative z-10 w-32 shrink-0 group">
                    <div
                      className={`w-16 h-16 rounded-full border-2 border-primary flex items-center justify-center font-headline-md shadow-sm transition-colors ${
                        step.active
                          ? 'bg-primary text-on-primary scale-110 shadow-lg'
                          : 'bg-surface-container-lowest text-primary group-hover:bg-primary group-hover:text-on-primary'
                      }`}
                    >
                      {step.num}
                    </div>
                    <span
                      className={`font-label-md text-label-md text-center font-bold ${
                        step.active ? 'text-primary' : 'text-on-surface'
                      }`}
                    >
                      {step.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* AI Intelligence Section */}
          <section className="py-32 bg-surface-container-lowest border-t border-outline-variant/20">
            <div className="max-w-container_max mx-auto px-margin">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                {/* Visual Side */}
                <div className="relative bg-surface rounded-3xl p-8 border border-outline-variant/30 shadow-sm flex flex-col gap-6">
                  <div className="absolute -top-6 -left-6 w-24 h-24 bg-primary-fixed rounded-full blur-2xl opacity-50"></div>
                  <div className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/20 shadow-sm flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary-fixed flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-primary">qr_code_2</span>
                    </div>
                    <div>
                      <h4 className="font-label-md text-label-md font-bold text-on-surface mb-1">Touchless QR Check-in</h4>
                      <p className="font-caption text-caption text-on-surface-variant">Scan &amp; register instantly at entry kiosks</p>
                    </div>
                  </div>

                  <div className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/20 shadow-sm flex items-start gap-4 sm:translate-x-8">
                    <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-green-700">balance</span>
                    </div>
                    <div>
                      <h4 className="font-label-md text-label-md font-bold text-on-surface mb-1">Dynamic AI Queue Balancing</h4>
                      <p className="font-caption text-caption text-on-surface-variant">Automatically distributes load across active OPD cabins</p>
                    </div>
                  </div>
                </div>

                {/* Content Side */}
                <div className="flex flex-col gap-8">
                  <h2 className="font-display-lg text-display-lg text-on-surface font-bold">Intelligence Behind Every Patient Visit</h2>
                  <p className="font-body-lg text-body-lg text-on-surface-variant">
                    The Smart OPD Queue Management &amp; Patient Waiting Time Prediction System uses Artificial Intelligence and Machine Learning to streamline hospital operations, improve patient flow, support priority scheduling, and provide accurate waiting-time estimation while helping hospitals make better operational decisions.
                  </p>
                  <div className="flex flex-col gap-4 mt-4">
                    <div className="flex items-center gap-4 bg-surface rounded-xl p-4 border border-outline-variant/20">
                      <span className="material-symbols-outlined text-primary">trending_down</span>
                      <span className="font-label-md text-label-md font-bold text-on-surface">60% Reduction in Patient Wait Times</span>
                    </div>
                    <div className="flex items-center gap-4 bg-surface rounded-xl p-4 border border-outline-variant/20">
                      <span className="material-symbols-outlined text-green-600">check_circle</span>
                      <span className="font-label-md text-label-md font-bold text-on-surface">98% Accuracy in AI Predictions</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* AI Technology Deep Dive */}
          <section className="py-32 bg-primary text-on-primary" id="technology">
            <div className="max-w-container_max mx-auto px-margin">
              <div className="text-center max-w-3xl mx-auto mb-20">
                <h2 className="font-display-lg text-display-lg mb-4 text-on-primary font-bold">Powered by Artificial Intelligence</h2>
                <p className="font-body-lg text-body-lg text-primary-fixed-dim">
                  Leveraging state-of-the-art machine learning models to solve complex queuing challenges.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-on-primary-fixed/20 backdrop-blur-sm rounded-3xl p-8 border border-primary-fixed/10 hover:bg-on-primary-fixed/30 transition-colors">
                  <span className="material-symbols-outlined text-primary-fixed text-[32px] mb-6">memory</span>
                  <h3 className="font-headline-md text-headline-md mb-3 text-on-primary font-bold">Machine Learning</h3>
                  <p className="font-body-md text-body-md text-primary-fixed-dim">Continuous learning from patient traffic patterns to refine prediction engines.</p>
                </div>
                <div className="bg-on-primary-fixed/20 backdrop-blur-sm rounded-3xl p-8 border border-primary-fixed/10 hover:bg-on-primary-fixed/30 transition-colors">
                  <span className="material-symbols-outlined text-primary-fixed text-[32px] mb-6">account_tree</span>
                  <h3 className="font-headline-md text-headline-md mb-3 text-on-primary font-bold">Random Forest Prediction</h3>
                  <p className="font-body-md text-body-md text-primary-fixed-dim">Utilizing ensemble learning for high-accuracy waiting time estimations.</p>
                </div>
                <div className="bg-on-primary-fixed/20 backdrop-blur-sm rounded-3xl p-8 border border-primary-fixed/10 hover:bg-on-primary-fixed/30 transition-colors">
                  <span className="material-symbols-outlined text-primary-fixed text-[32px] mb-6">insights</span>
                  <h3 className="font-headline-md text-headline-md mb-3 text-on-primary font-bold">Predictive Analytics</h3>
                  <p className="font-body-md text-body-md text-primary-fixed-dim">Forecasting peak hours and department loads days in advance.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Benefits Section */}
          <section className="py-32 bg-surface-container-lowest" id="benefits">
            <div className="max-w-container_max mx-auto px-margin">
              <div className="text-center mb-16">
                <h2 className="font-display-lg text-display-lg text-on-surface font-bold">Benefits</h2>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="bg-surface rounded-2xl p-8 border border-outline-variant/30 text-center hover:-translate-y-2 transition-transform duration-300 shadow-sm">
                  <div className="font-display-lg text-[48px] text-primary font-bold mb-2">94%</div>
                  <div className="font-label-md text-label-md text-on-surface-variant font-bold">Efficiency Increase</div>
                </div>
                <div className="bg-surface rounded-2xl p-8 border border-outline-variant/30 text-center hover:-translate-y-2 transition-transform duration-300 shadow-sm">
                  <div className="font-display-lg text-[48px] text-green-600 font-bold mb-2">60%</div>
                  <div className="font-label-md text-label-md text-on-surface-variant font-bold">Reduced Wait Time</div>
                </div>
                <div className="bg-surface rounded-2xl p-8 border border-outline-variant/30 text-center hover:-translate-y-2 transition-transform duration-300 shadow-sm">
                  <div className="font-display-lg text-[48px] text-secondary font-bold mb-2">99.9%</div>
                  <div className="font-label-md text-label-md text-on-surface-variant font-bold">System Uptime</div>
                </div>
                <div className="bg-surface rounded-2xl p-8 border border-outline-variant/30 text-center hover:-translate-y-2 transition-transform duration-300 shadow-sm">
                  <div className="font-display-lg text-[48px] text-amber-500 font-bold mb-2">85%</div>
                  <div className="font-label-md text-label-md text-on-surface-variant font-bold">Patient Satisfaction</div>
                </div>
              </div>
            </div>
          </section>

          {/* Final CTA Section */}
          <section className="py-32 bg-primary text-on-primary relative overflow-hidden">
            <div className="max-w-container_max mx-auto px-margin relative z-10 text-center">
              <h2 className="font-display-lg text-[48px] text-on-primary mb-6 font-bold">Transform Your Hospital Today</h2>
              <p className="font-body-lg text-body-lg text-primary-fixed-dim max-w-2xl mx-auto mb-10">
                Join hundreds of healthcare facilities delivering a premium, zero-wait experience to their patients.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <button
                  onClick={() => openModal('booking')}
                  className="bg-surface-container-lowest text-primary px-8 py-4 rounded-xl font-label-md text-label-md hover:bg-surface transition-all shadow-lg hover:shadow-xl active:scale-95 font-bold"
                >
                  Get Started Now
                </button>
                <button
                  onClick={() => openModal('demo')}
                  className="bg-transparent text-on-primary px-8 py-4 rounded-xl font-label-md text-label-md border border-primary-fixed/30 hover:bg-on-primary-fixed/20 transition-all active:scale-95 font-bold"
                >
                  Request Demo
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-surface-container-low border-t border-outline-variant/30 py-16 mt-20">
        <div className="max-w-[1440px] mx-auto px-margin">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-primary">medical_services</span>
                <span className="font-headline-md text-headline-md text-on-surface font-bold">MediQueue</span>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Revolutionizing patient intake and clinic efficiency with intelligent queue management solutions.
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <span className="font-label-md text-label-md text-on-surface font-bold uppercase tracking-wider">Solutions</span>
              <a className="font-body-md text-body-md text-on-surface-variant hover:text-primary" href="#features">For Clinics</a>
              <a className="font-body-md text-body-md text-on-surface-variant hover:text-primary" href="#features">For Hospitals</a>
              <a className="font-body-md text-body-md text-on-surface-variant hover:text-primary" href="#features">Enterprise</a>
            </div>
            <div className="flex flex-col gap-4">
              <span className="font-label-md text-label-md text-on-surface font-bold uppercase tracking-wider">Company</span>
              <a className="font-body-md text-body-md text-on-surface-variant hover:text-primary" href="#about">About Us</a>
              <a className="font-body-md text-body-md text-on-surface-variant hover:text-primary" href="#contact">Contact</a>
              <a className="font-body-md text-body-md text-on-surface-variant hover:text-primary" href="#security">Security</a>
            </div>
            <div className="flex flex-col gap-4">
              <span className="font-label-md text-label-md text-on-surface font-bold uppercase tracking-wider">Support</span>
              <a className="font-body-md text-body-md text-on-surface-variant hover:text-primary text-sm" href="mailto:support@mediqueue.io">
                support@mediqueue.io
              </a>
              <div className="flex gap-4 mt-2">
                <span className="material-symbols-outlined text-on-surface-variant hover:text-primary cursor-pointer">share</span>
                <span className="material-symbols-outlined text-on-surface-variant hover:text-primary cursor-pointer">alternate_email</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-outline-variant/20 gap-4">
            <span className="font-caption text-caption text-on-surface-variant">© 2024 MediQueue Solutions. All rights reserved.</span>
            <div className="flex gap-6">
              <a className="font-caption text-caption text-on-surface-variant hover:text-on-surface" href="#privacy">Privacy Policy</a>
              <a className="font-caption text-caption text-on-surface-variant hover:text-on-surface" href="#terms">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Login Modal */}
      <LoginModal
        isOpen={modalType === 'login'}
        onClose={closeModal}
        onLogin={(role, username, password) => {
          onLogin(role, username, password);
          closeModal();
        }}
      />

      {/* Booking / Demo Modal */}
      {modalType && modalType !== 'login' && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl border border-outline-variant relative">
            <button
              onClick={closeModal}
              className="absolute top-6 right-6 text-on-surface-variant hover:text-on-surface p-2 rounded-full hover:bg-surface"
            >
              <span className="material-symbols-outlined">close</span>
            </button>

            {modalType === 'booking' && (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-primary-fixed rounded-2xl text-primary">
                    <span className="material-symbols-outlined text-2xl">calendar_add_on</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-on-surface">Book Smart Appointment</h3>
                    <p className="text-sm text-on-surface-variant">AI-estimated quick booking</p>
                  </div>
                </div>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    alert('Appointment Request Submitted! Check your SMS for token confirmation.');
                    closeModal();
                  }}
                  className="space-y-4 mt-6"
                >
                  <div>
                    <label className="block text-xs font-semibold text-on-surface uppercase mb-1">
                      Patient Full Name
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="John Doe"
                      className="w-full px-4 py-3 rounded-xl border border-outline-variant focus:ring-2 focus:ring-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-on-surface uppercase mb-1">
                      Department
                    </label>
                    <select className="w-full px-4 py-3 rounded-xl border border-outline-variant focus:ring-2 focus:ring-primary focus:outline-none">
                      <option>General Medicine &amp; OPD</option>
                      <option>Cardiology</option>
                      <option>Pediatrics</option>
                      <option>Orthopedics</option>
                      <option>Neurology</option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="w-full py-4 bg-primary text-on-primary rounded-xl font-bold shadow-lg hover:bg-primary-container hover:text-on-primary-container transition-all mt-4"
                  >
                    Confirm &amp; Generate AI Token
                  </button>
                </form>
              </div>
            )}

            {(modalType === 'demo' || modalType === 'feature') && (
              <div className="text-center py-4">
                <div className="w-16 h-16 bg-primary-fixed rounded-full flex items-center justify-center mx-auto text-primary mb-4">
                  <span className="material-symbols-outlined text-3xl">smart_toy</span>
                </div>
                <h3 className="text-2xl font-bold text-on-surface mb-2">Request Live System Demo</h3>
                <p className="text-on-surface-variant text-sm mb-6">
                  Experience how MediQueue transforms patient waiting times with AI predictions and real-time operational analytics.
                </p>
                <button
                  onClick={closeModal}
                  className="w-full py-4 bg-primary text-on-primary rounded-xl font-bold shadow-lg hover:bg-primary-container transition-all"
                >
                  Schedule Demo
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
