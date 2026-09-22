import React from 'react';
import { motion } from 'motion/react';
import {
  FileWarning,
  ServerOff,
  Clock,
  Split,
  LockKeyhole,
  CheckCircle2,
  Database,
  Cloud,
  ShieldCheck,
  Zap,
  ArrowRight,
  TrendingUp,
  Sparkles,
  RefreshCw,
} from 'lucide-react';

export const ProblemSolutionSection: React.FC = () => {
  const traditionalPoints = [
    { icon: FileWarning, title: 'Paper & Physical Records', desc: 'Handwritten charts prone to misplacement, physical deterioration, and illegible clinical notes.' },
    { icon: ServerOff, title: 'Siloed On-Premise Servers', desc: 'Isolated legacy clinics that cannot securely federate patient histories between specialties.' },
    { icon: Clock, title: 'Manual Phone-Based Scheduling', desc: 'Labor-intensive administrative bottlenecks and frequent appointment double-bookings.' },
    { icon: Split, title: 'Fragmented Diagnostics', desc: 'Scattered laboratory reports and ECGs requiring patients to carry paper folders between doctors.' },
    { icon: LockKeyhole, title: 'Zero Patient Self-Service', desc: 'Individuals cannot view their own consultation notes, prescriptions, or historical trends.' },
  ];

  const smartcarePoints = [
    { icon: Database, title: 'Unified Cloud Architecture', desc: 'Single high-availability source of truth with real-time Firestore database synchronization.' },
    { icon: Cloud, title: 'Centralised Health Records', desc: 'Standardized digital consultation summaries and instant encrypted PDF archives accessible anywhere.' },
    { icon: Zap, title: 'Real-Time Conflict-Free Booking', desc: 'Multi-step self-service appointment scheduler with doctor agenda synchronization.' },
    { icon: ShieldCheck, title: 'Zero-Trust RBAC Security', desc: 'Strict multi-tier cryptographic access rules for Patients, Attending Doctors, and System Admins.' },
    { icon: RefreshCw, title: 'Continuous Care Team Continuum', desc: 'Seamless care transitions allowing any authorized clinician to review historical patient context.' },
  ];

  return (
    <section id="problem-solution" className="py-20 lg:py-28 bg-slate-50 border-b border-slate-200/80 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-teal-50 text-teal-800 border border-teal-200/70"
          >
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            <span>Healthcare Transformation</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight"
          >
            From Fragmented Data to Connected Healthcare
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg text-slate-600"
          >
            Modern clinical care demands instantaneous coordination. SmartCare Cloud transforms disconnected, paper-bound silos into a secure, centralized cloud ecosystem.
          </motion.p>
        </div>

        {/* Side-by-Side Comparison Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-11 gap-8 items-center">
          {/* LEFT: Traditional Fragmented Records (Gray Cards, Warning Icons) */}
          <motion.div
            initial={{ opacity: 0, x: -25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm relative overflow-hidden"
          >
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-200">
              <div>
                <span className="text-[11px] font-bold tracking-wider text-slate-500 uppercase">Legacy Siloed Setup</span>
                <h3 className="text-xl font-bold text-slate-900">Traditional Fragmented Records</h3>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-300">
                Fragmented & Vulnerable
              </span>
            </div>

            <div className="space-y-3.5">
              {traditionalPoints.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:bg-slate-100/60 transition-colors">
                    <div className="p-2 rounded-xl bg-slate-200/80 text-slate-600 shrink-0 mt-0.5">
                      <Icon className="w-4 h-4 text-amber-600" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900">{item.title}</h4>
                      <p className="text-xs text-slate-600 leading-relaxed mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* CENTER: Transformation Bridge */}
          <div className="lg:col-span-1 flex flex-col items-center justify-center my-4 lg:my-0">
            <div className="w-full flex flex-row lg:flex-col items-center justify-center gap-2">
              <div className="hidden lg:block w-px h-10 bg-gradient-to-b from-slate-300 to-cyan-500"></div>
              <div className="px-3.5 py-3 rounded-2xl bg-[#0F172A] text-cyan-300 text-xs font-black tracking-widest text-center shadow-lg border border-cyan-500/40 flex flex-col items-center gap-1">
                <span className="text-[10px] text-slate-400 font-mono">PARADIGM</span>
                <span className="text-xs text-slate-300 font-bold">SILOED</span>
                <span className="text-xs text-cyan-400 font-mono">↓</span>
                <span className="text-xs text-cyan-300 font-extrabold">CLOUD</span>
              </div>
              <div className="hidden lg:block w-px h-10 bg-gradient-to-b from-cyan-500 to-teal-500"></div>
            </div>
          </div>

          {/* RIGHT: SmartCare Cloud (Teal Glowing Cards, Connected Icons) */}
          <motion.div
            initial={{ opacity: 0, x: 25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-teal-200/90 shadow-xl shadow-teal-500/5 relative overflow-hidden"
          >
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-teal-100">
              <div>
                <span className="text-[11px] font-bold tracking-wider text-teal-700 uppercase">Cloud Architecture</span>
                <h3 className="text-xl font-bold text-slate-900">SmartCare Cloud</h3>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-teal-50 text-teal-800 border border-teal-200 flex items-center gap-1.5 shadow-2xs shadow-teal-500/20">
                <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span>
                <span>Connected & Secure</span>
              </span>
            </div>

            <div className="space-y-3.5">
              {smartcarePoints.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-teal-50/50 border border-teal-200/80 shadow-xs shadow-teal-500/5 hover:border-teal-300 hover:bg-teal-50/80 transition-all">
                    <div className="p-2 rounded-xl bg-teal-500/15 text-teal-700 shrink-0 mt-0.5 border border-teal-200">
                      <Icon className="w-4 h-4 text-teal-600" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900">{item.title}</h4>
                      <p className="text-xs text-slate-600 leading-relaxed mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
