import React from 'react';
import { motion } from 'motion/react';
import {
  Cloud,
  ShieldCheck,
  Activity,
  Users,
  Calendar,
  FileText,
  CheckCircle2,
  Lock,
  ArrowRight,
  Server,
  Zap,
  Sparkles,
  Stethoscope,
  Clock,
  ShieldAlert,
  HardDrive,
  Database,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { AcademicBadge } from '../common/AcademicBadge';

export const HeroSection: React.FC = () => {
  const { switchDemoRole } = useAuth();

  return (
    <section id="hero" className="relative overflow-hidden pt-12 pb-24 lg:pt-20 lg:pb-32 bg-[#0B132B] text-white">
      {/* Abstract Cloud & Network Visualization Behind Hero */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
        {/* Ambient Gradient Glows */}
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[140px] pointer-events-none"></div>
        <div className="absolute top-80 -left-40 w-[550px] h-[550px] bg-teal-500/15 rounded-full blur-[140px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-slate-900/80 rounded-full blur-[120px] pointer-events-none"></div>

        {/* Abstract Cloud/Network Topological Mesh SVG */}
        <svg
          className="absolute inset-0 w-full h-full opacity-25"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 900"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <linearGradient id="netGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#2dd4bf" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#818cf8" stopOpacity="0.1" />
            </linearGradient>
            <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#2dd4bf" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#2dd4bf" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Network Connection Lines */}
          <g stroke="url(#netGrad)" strokeWidth="1.2" strokeDasharray="4 6" className="animate-pulse">
            <line x1="220" y1="180" x2="480" y2="280" />
            <line x1="480" y1="280" x2="720" y2="160" />
            <line x1="720" y1="160" x2="980" y2="260" />
            <line x1="980" y1="260" x2="1240" y2="190" />
            <line x1="480" y1="280" x2="420" y2="520" />
            <line x1="720" y1="160" x2="720" y2="480" />
            <line x1="980" y1="260" x2="1020" y2="520" />
            <line x1="420" y1="520" x2="720" y2="480" />
            <line x1="720" y1="480" x2="1020" y2="520" />
          </g>

          {/* Network Nodes (Cloud/Hospital/Doctor/Patient Hubs) */}
          <circle cx="220" cy="180" r="4" fill="#38bdf8" />
          <circle cx="480" cy="280" r="6" fill="#2dd4bf" />
          <circle cx="720" cy="160" r="8" fill="#38bdf8" />
          <circle cx="980" cy="260" r="6" fill="#2dd4bf" />
          <circle cx="1240" cy="190" r="4" fill="#818cf8" />
          <circle cx="420" cy="520" r="5" fill="#38bdf8" />
          <circle cx="720" cy="480" r="9" fill="#2dd4bf" />
          <circle cx="1020" cy="520" r="5" fill="#818cf8" />

          {/* Glowing node halos */}
          <circle cx="720" cy="160" r="22" fill="url(#nodeGlow)" opacity="0.4" />
          <circle cx="720" cy="480" r="28" fill="url(#nodeGlow)" opacity="0.35" />

          {/* Abstract Cloud Silhouette Curves in Background */}
          <path
            d="M300,240 Q400,180 520,220 T740,200 T960,220 T1180,240"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="0.8"
            opacity="0.25"
          />
          <path
            d="M200,480 Q450,420 720,460 T1240,480"
            fill="none"
            stroke="#2dd4bf"
            strokeWidth="0.8"
            opacity="0.2"
          />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center gap-2"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-bold tracking-widest uppercase shadow-inner">
              <Cloud className="w-3.5 h-3.5 text-teal-400" />
              <span>CLOUD-POWERED HEALTHCARE PLATFORM</span>
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15]"
          >
            Healthcare, Connected Through the Cloud.
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl text-slate-300 font-normal leading-relaxed max-w-2xl mx-auto"
          >
            Centralise patients, doctors, appointments and digital healthcare records in one secure and scalable platform.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-4 pt-2"
          >
            <button
              id="hero-get-started-btn"
              onClick={() => switchDemoRole('patient')}
              className="px-7 py-3.5 rounded-2xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-sm sm:text-base flex items-center gap-2 shadow-lg shadow-teal-500/25 transition-all hover:scale-102 cursor-pointer"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              id="hero-explore-btn"
              onClick={() => {
                const el = document.getElementById('problem-solution');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-7 py-3.5 rounded-2xl bg-slate-800/80 hover:bg-slate-800 text-white font-semibold text-sm sm:text-base border border-slate-700/80 flex items-center gap-2 transition-all hover:border-teal-500/50 cursor-pointer"
            >
              <span>Explore Platform</span>
            </button>
          </motion.div>

          <div className="pt-2">
            <AcademicBadge variant="dark" />
          </div>
        </div>

        {/* Sophisticated Floating SmartCare Cloud Dashboard Visual */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-14 max-w-5xl mx-auto relative"
        >
          {/* Subtle Connection Visual Metaphor Banner above dashboard */}
          <div className="absolute -top-5 left-1/2 -translate-x-1/2 flex items-center gap-2.5 text-[11px] font-mono tracking-wider text-teal-300 bg-slate-900/90 px-4 py-1 rounded-full border border-teal-500/30 backdrop-blur-md z-20 shadow-lg">
            <span className="text-slate-300">PATIENT</span>
            <span className="text-teal-400">→</span>
            <span className="text-teal-300 font-semibold">RBAC GATEWAY</span>
            <span className="text-teal-400">→</span>
            <span className="text-cyan-300 font-semibold">CLOUD DATABASE</span>
            <span className="text-teal-400">→</span>
            <span className="text-slate-300">DOCTOR</span>
          </div>

          {/* Main Floating Dashboard Container */}
          <div className="relative rounded-3xl bg-slate-950/85 p-3 sm:p-4 border border-slate-700/80 shadow-2xl shadow-teal-950/40 backdrop-blur-2xl">
            {/* Top Window Bar */}
            <div className="flex items-center justify-between px-3 py-2 border-b border-slate-800 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
                <span className="ml-3 font-mono text-[11px] text-slate-400 flex items-center gap-1.5">
                  <Lock className="w-3 h-3 text-teal-400" />
                  smartcare.cloud/console • TLS 1.3 • AES-256 Vault
                </span>
              </div>
              <div className="flex items-center gap-3 font-mono text-[11px]">
                <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  Cloud Live (99.99% SLA)
                </span>
                <span className="text-slate-500 hidden sm:inline">Region: asia-east1</span>
              </div>
            </div>

            {/* Dashboard Inner Canvas */}
            <div className="bg-slate-900/95 rounded-2xl p-4 sm:p-6 text-slate-100 space-y-6">
              {/* 5 High-Level Health & Cloud Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {/* 1. Patient Count */}
                <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
                  <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                    <span className="font-medium">Patient Count</span>
                    <Users className="w-3.5 h-3.5 text-blue-400" />
                  </div>
                  <div className="text-xl font-extrabold text-white">2,840</div>
                  <div className="text-[10px] text-emerald-400 mt-0.5 flex items-center gap-1">
                    <span>+14.2% MoM</span>
                    <span className="text-slate-500">• Verified</span>
                  </div>
                </div>

                {/* 2. Doctor Count */}
                <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
                  <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                    <span className="font-medium">Doctor Count</span>
                    <Stethoscope className="w-3.5 h-3.5 text-teal-400" />
                  </div>
                  <div className="text-xl font-extrabold text-white">142</div>
                  <div className="text-[10px] text-teal-400 mt-0.5">18 Specialties</div>
                </div>

                {/* 3. Upcoming Appointments */}
                <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
                  <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                    <span className="font-medium">Appointments</span>
                    <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                  </div>
                  <div className="text-xl font-extrabold text-white">384 Today</div>
                  <div className="text-[10px] text-cyan-300 mt-0.5">Active Queue</div>
                </div>

                {/* 4. Medical Records */}
                <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
                  <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                    <span className="font-medium">Medical Records</span>
                    <FileText className="w-3.5 h-3.5 text-purple-400" />
                  </div>
                  <div className="text-xl font-extrabold text-white">12,490</div>
                  <div className="text-[10px] text-purple-300 mt-0.5">Digital & Encrypted</div>
                </div>

                {/* 5. Cloud Status */}
                <div className="col-span-2 sm:col-span-1 p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
                  <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                    <span className="font-medium">Cloud Status</span>
                    <Cloud className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <div className="text-xl font-extrabold text-emerald-400 flex items-center gap-1.5">
                    <span>Healthy</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Latency 0.18ms</div>
                </div>
              </div>

              {/* Main Content Area: Upcoming Appointments & Medical Records Stream */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                {/* Upcoming Appointments Live Feed (7 cols) */}
                <div className="lg:col-span-7 bg-slate-950/70 rounded-xl p-4 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800">
                    <div className="flex items-center gap-2 text-slate-200 font-bold">
                      <Calendar className="w-4 h-4 text-cyan-400" />
                      <span>Upcoming Appointments Stream</span>
                    </div>
                    <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded">
                      Live Slot Engine
                    </span>
                  </div>

                  <div className="space-y-2">
                    {/* Item 1 */}
                    <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 text-xs hover:border-slate-700 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs">
                          AK
                        </div>
                        <div>
                          <div className="font-semibold text-white">Aarav Kumar (Patient)</div>
                          <div className="text-[11px] text-slate-400">Dr. Priya Rao • Cardiology Consultation</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-emerald-400 font-mono font-semibold">10:30 AM</div>
                        <span className="text-[10px] text-slate-500">Confirmed</span>
                      </div>
                    </div>

                    {/* Item 2 */}
                    <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 text-xs hover:border-slate-700 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold text-xs">
                          MP
                        </div>
                        <div>
                          <div className="font-semibold text-white">Meera Patel (Patient)</div>
                          <div className="text-[11px] text-slate-400">Dr. Arvind Menon • Neurology Review</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-cyan-300 font-mono font-semibold">11:15 AM</div>
                        <span className="text-[10px] text-slate-500">In-Queue</span>
                      </div>
                    </div>

                    {/* Item 3 */}
                    <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 text-xs hover:border-slate-700 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-xs">
                          VS
                        </div>
                        <div>
                          <div className="font-semibold text-white">Vikram Singh (Patient)</div>
                          <div className="text-[11px] text-slate-400">Dr. Shalini Nair • Endocrinology Follow-up</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-slate-300 font-mono font-semibold">02:00 PM</div>
                        <span className="text-[10px] text-slate-500">Scheduled</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Medical Records & Cloud Infrastructure Card (5 cols) */}
                <div className="lg:col-span-5 bg-slate-950/70 rounded-xl p-4 border border-slate-800 space-y-3 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800 mb-3">
                      <div className="flex items-center gap-2 text-slate-200 font-bold">
                        <FileText className="w-4 h-4 text-purple-400" />
                        <span>Medical Records & EHR Vault</span>
                      </div>
                      <span className="text-[10px] font-mono text-purple-300 bg-purple-950/60 border border-purple-800/60 px-2 py-0.5 rounded">
                        Encrypted
                      </span>
                    </div>

                    {/* Latest EHR summary */}
                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-200">Diagnostic ECG Strip</span>
                        <span className="text-[10px] text-emerald-400 font-mono">Normal (72 BPM)</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                        <Activity className="w-3.5 h-3.5 text-teal-400" />
                        <span>Consultation Note: Stable sinus rhythm</span>
                      </div>
                      <div className="pt-1 flex items-center justify-between text-[10px] text-slate-500 font-mono border-t border-slate-800">
                        <span>Signed by Dr. Priya Rao</span>
                        <span className="text-teal-400">PDF Archived</span>
                      </div>
                    </div>
                  </div>

                  {/* Cloud Status Telemetry Mini-Bar */}
                  <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800/80 text-[11px] font-mono text-slate-400 space-y-1">
                    <div className="flex items-center justify-between text-slate-300 font-bold">
                      <span className="flex items-center gap-1.5">
                        <Database className="w-3.5 h-3.5 text-blue-400" />
                        Firestore Cluster
                      </span>
                      <span className="text-emerald-400">Synchronized</span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-500">
                      <span>Throughput: 1,420 req/s</span>
                      <span>Zero-Trust RBAC: 100%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
