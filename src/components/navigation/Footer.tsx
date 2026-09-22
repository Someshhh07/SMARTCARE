import React from 'react';
import { Cloud, Shield, Database, HeartHandshake, ArrowUpRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { AcademicBadge } from '../common/AcademicBadge';

export const Footer: React.FC = () => {
  const { setActiveView, switchDemoRole } = useAuth();

  return (
    <footer id="main-footer" className="bg-[#0B132B] text-slate-300 border-t border-slate-800/80 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800/60">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-teal-500 flex items-center justify-center text-white shadow-xs">
                <Cloud className="w-5 h-5" />
              </div>
              <span className="font-bold text-lg text-white tracking-tight">
                SMARTCARE <span className="text-blue-400 font-extrabold">CLOUD</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-md">
              An enterprise Cloud Computing architectural demonstration uniting fragmented medical records into a secure, role-governed healthcare management system.
            </p>
            <div className="pt-1">
              <AcademicBadge variant="dark" />
            </div>
            <div className="text-xs text-slate-500 font-mono pt-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>
              <span>Centralised Cloud • Secure RBAC • Clinical Coordination</span>
            </div>
          </div>

          {/* Quick Nav */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-blue-400">Platform Navigation</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <button onClick={() => setActiveView('landing')} className="hover:text-white transition-colors duration-150 cursor-pointer">
                  Platform Overview
                </button>
              </li>
              <li>
                <button onClick={() => { setActiveView('landing'); setTimeout(() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' }), 50); }} className="hover:text-white transition-colors duration-150 cursor-pointer">
                  How It Works
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('architecture')} className="hover:text-white transition-colors duration-150 cursor-pointer">
                  Cloud Architecture
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('security')} className="hover:text-white transition-colors duration-150 cursor-pointer">
                  Security & RBAC
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('research')} className="hover:text-white transition-colors duration-150 cursor-pointer">
                  Research Foundation
                </button>
              </li>
              <li>
                <button onClick={() => { setActiveView('landing'); setTimeout(() => document.getElementById('future-scope')?.scrollIntoView({ behavior: 'smooth' }), 50); }} className="hover:text-white transition-colors duration-150 cursor-pointer">
                  Future Scope
                </button>
              </li>
            </ul>
          </div>

          {/* Role Portals */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-teal-400">Role Demonstration</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <button
                  onClick={() => switchDemoRole('patient')}
                  className="hover:text-white flex items-center gap-1.5 transition-colors duration-150 cursor-pointer"
                >
                  <span>Patient Portal (Aarav)</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-60 text-blue-400" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => switchDemoRole('doctor')}
                  className="hover:text-white flex items-center gap-1.5 transition-colors duration-150 cursor-pointer"
                >
                  <span>Doctor Portal (Dr. Priya)</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-60 text-teal-400" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => switchDemoRole('admin')}
                  className="hover:text-white flex items-center gap-1.5 transition-colors duration-150 cursor-pointer"
                >
                  <span>Admin Console (Prof. Varma)</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-60 text-indigo-400" />
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright and academic disclaimer */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © 2026 SMARTCARE CLOUD • Academic Prototype. Synthetic healthcare data only. No real patient data.
          </div>
          <div className="flex items-center gap-4">
            <span>Powered by Node.js, Express, React, Firestore & Firebase Auth</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
