import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Cloud,
  Menu,
  X,
  ArrowRight,
  LogOut,
  LayoutDashboard,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Navbar: React.FC = () => {
  const { user, activeView, setActiveView, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Section anchors required by specification: Platform, Architecture, Security, Research
  const navLinks = [
    { label: 'Platform', view: 'landing', anchor: 'hero' },
    { label: 'Architecture', view: 'architecture', anchor: 'architecture' },
    { label: 'Security', view: 'security', anchor: 'security' },
    { label: 'Research', view: 'research', anchor: 'research' },
  ];

  const handleNavClick = (viewId: string, anchorId: string) => {
    setActiveView(viewId);
    setMobileMenuOpen(false);

    // Smooth scroll to the respective section anchor
    const el = document.getElementById(anchorId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      id="main-header"
      className="sticky top-3 z-40 w-full px-4 sm:px-6 max-w-6xl mx-auto transition-all duration-300"
    >
      {/* Floating Pill-Shaped Glassmorphic Navbar Container */}
      <div
        id="navbar-container"
        className="w-full h-16 px-4 sm:px-6 rounded-full bg-[#0F172A]/85 backdrop-blur-md border border-white/10 shadow-2xl shadow-slate-950/50 flex items-center justify-between gap-3 sm:gap-4 transition-all duration-300"
      >
        {/* Left Section: Brand Logo with Bold Text & Glowing Cyan Status Indicator Dot */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            id="brand-logo-btn"
            onClick={() => handleNavClick('landing', 'hero')}
            className="flex items-center gap-2.5 group cursor-pointer focus:outline-none select-none text-left"
          >
            {/* Logo Icon with Glowing Cyan Status Dot */}
            <div className="relative flex items-center justify-center">
              <div className="w-8 h-8 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:border-cyan-400/60 transition-colors">
                <Cloud className="w-4 h-4 text-cyan-400" />
              </div>
              {/* Glowing Neon Cyan Status Dot */}
              <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#06B6D4] shadow-[0_0_8px_#06B6D4]"></span>
              </span>
            </div>

            {/* Brand Logo Text */}
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base sm:text-lg tracking-tight text-white font-sans">
                SMARTCARE<span className="text-[#06B6D4] font-black">.</span>
              </span>
            </div>
          </button>
        </div>

        {/* Center Section: Navigation Links (Platform, Architecture, Security, Research) */}
        <nav
          id="center-nav-links"
          className="hidden md:flex items-center gap-1 p-1 rounded-full bg-white/[0.04] border border-white/5"
        >
          {navLinks.map((link) => {
            const isActive = activeView === link.view;
            return (
              <button
                key={link.label}
                id={`nav-link-${link.label.toLowerCase()}`}
                onClick={() => handleNavClick(link.view, link.anchor)}
                className={`px-3.5 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-white/15 text-[#FFFFFF] font-semibold shadow-xs'
                    : 'text-slate-300 hover:text-[#FFFFFF] hover:bg-white/10'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Right Section: Action items (Subtle Ghost "Login", High-Contrast "Get Started" CTA) */}
        <div className="hidden sm:flex items-center gap-2 sm:gap-3">
          {user ? (
            <div className="flex items-center gap-1.5">
              <button
                id="header-goto-dashboard-btn"
                onClick={() => setActiveView('dashboard')}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 rounded-full shadow-md shadow-cyan-500/20 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Console</span>
              </button>
              <button
                id="header-logout-btn"
                onClick={logout}
                title="Sign out"
                className="p-2 rounded-full text-slate-400 hover:text-rose-400 hover:bg-white/10 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              {/* Subtle Ghost Button: "Login" */}
              <button
                id="nav-login-btn"
                onClick={() => setActiveView('login')}
                className="px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-medium text-slate-300 hover:text-white hover:bg-white/10 rounded-full transition-all duration-200 cursor-pointer"
              >
                Login
              </button>

              {/* High-Contrast Primary CTA Button: "Get Started" styled with vibrant cyan/teal gradient */}
              <button
                id="nav-getstarted-cta-btn"
                onClick={() => setActiveView('login')}
                className="flex items-center gap-1.5 px-4 sm:px-5 py-2 text-xs sm:text-sm font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 rounded-full shadow-md shadow-cyan-500/25 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
              >
                <span>Get Started</span>
                <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Menu Button */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            id="mobile-hamburger-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            className="p-2 rounded-full text-slate-300 hover:text-white hover:bg-white/10 border border-white/10 transition-all cursor-pointer focus:outline-none"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Glassmorphic Slide-Out Drawer / Overlay Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id="mobile-nav-drawer"
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="md:hidden mt-3 p-5 rounded-3xl bg-[#0F172A]/95 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/80 space-y-4"
          >
            {/* Mobile Navigation Links */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 block mb-1">
                Section Anchors
              </span>
              {navLinks.map((link) => {
                const isActive = activeView === link.view;
                return (
                  <button
                    key={link.label}
                    onClick={() => handleNavClick(link.view, link.anchor)}
                    className={`w-full text-left px-3.5 py-2.5 rounded-2xl text-sm font-medium transition-all duration-150 cursor-pointer flex items-center justify-between ${
                      isActive
                        ? 'bg-white/15 text-white font-semibold'
                        : 'text-slate-300 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <span>{link.label}</span>
                    {isActive && <div className="w-1.5 h-1.5 rounded-full bg-[#06B6D4]" />}
                  </button>
                );
              })}
            </div>

            <div className="h-px w-full bg-white/10" />

            {/* Mobile Actions: Login & Get Started CTA */}
            <div className="space-y-2 pt-1">
              {user ? (
                <>
                  <button
                    onClick={() => {
                      setActiveView('dashboard');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full py-2.5 px-4 rounded-full text-sm font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-teal-400 flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Open Dashboard ({user.role})</span>
                  </button>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full py-2 px-4 rounded-full text-xs font-medium text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer text-center"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={() => {
                      setActiveView('login');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full py-2.5 px-4 rounded-full text-sm font-medium text-slate-300 hover:text-white hover:bg-white/10 border border-white/10 transition-all text-center cursor-pointer"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => {
                      setActiveView('login');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full py-2.5 px-4 rounded-full text-sm font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-teal-400 shadow-md shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Get Started</span>
                    <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
