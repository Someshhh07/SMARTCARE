import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  UserPlus,
  ShieldCheck,
  Server,
  Stethoscope,
  ArrowRight,
  CheckCircle2,
  Lock,
  Calendar,
  FileText,
  Database,
  Cloud,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const HowItWorksSection: React.FC = () => {
  const { switchDemoRole } = useAuth();
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      id: 'step-1',
      number: '01',
      title: 'Patient Engagement & Booking',
      subtitle: 'Self-Service Healthcare Access',
      badge: 'Step 1: Patient Layer',
      icon: Calendar,
      accent: 'blue',
      description:
        'Patients authenticate through secure credentials, browse available hospital specialists, and schedule outpatient consultations with real-time slot conflict resolution.',
      highlights: [
        'Live multi-step department and doctor selection',
        'Transparent symptom reporting and visit reason tagging',
        'Instant confirmation with calendar notification sync',
      ],
      diagram: {
        source: 'Patient Portal',
        payload: '{ patientId: "P-8921", specialist: "Cardiology", slot: "10:30 AM" }',
        action: 'Initiates Appointment Booking',
      },
      roleToTry: 'patient' as const,
      roleLabel: 'Test as Patient (Aarav)',
    },
    {
      id: 'step-2',
      number: '02',
      title: 'Zero-Trust Authentication & RBAC',
      subtitle: 'Cryptographic Policy Gate',
      badge: 'Step 2: Security Gateway',
      icon: ShieldCheck,
      accent: 'teal',
      description:
        'Every incoming request passes through Firebase JWT verification and deterministic Role-Based Access Control rules to prevent horizontal or vertical privilege escalation.',
      highlights: [
        'Cryptographic JSON Web Token (JWT) signature checks',
        'Enforced document-level privacy (patients only view their data)',
        'Defensive parameter sanitization before API dispatch',
      ],
      diagram: {
        source: 'Security Engine',
        payload: '{ role: "patient", tokenValid: true, canRead: ["P-8921"] }',
        action: 'Authorizes Scoped Data Access',
      },
      roleToTry: 'admin' as const,
      roleLabel: 'Inspect RBAC Matrix (Admin)',
    },
    {
      id: 'step-3',
      number: '03',
      title: 'Centralised Cloud Database Commit',
      subtitle: 'High-Availability NoSQL Core',
      badge: 'Step 3: Cloud Infrastructure',
      icon: Database,
      accent: 'cyan',
      description:
        'Sanitized appointment records and diagnostic references commit into high-availability cloud collections, guaranteeing a single source of truth across all facilities.',
      highlights: [
        'Real-time Firestore listeners keep doctor agendas updated',
        'Structured metadata schemas for diagnostic reports & vitals',
        'Automated cloud snapshotting for zero data loss',
      ],
      diagram: {
        source: 'Cloud Database',
        payload: 'COLLECTION("appointments").doc("APT-4029").set(...)',
        action: 'Synchronizes Central Cloud State',
      },
      roleToTry: 'admin' as const,
      roleLabel: 'View Cloud Status (Admin)',
    },
    {
      id: 'step-4',
      number: '04',
      title: 'Clinical Care & EHR Updating',
      subtitle: 'Doctor Outpatient Review & Prescription',
      badge: 'Step 4: Clinical Portal',
      icon: Stethoscope,
      accent: 'emerald',
      description:
        'Attending physicians access the centralized patient timeline, evaluate prior medical records, record consultation summaries, and author verified digital health records.',
      highlights: [
        'Instant access to historical ECGs, labs, and medication lists',
        'Digital consultation notes authored directly in the portal',
        'Records immediately become accessible to the authorized patient',
      ],
      diagram: {
        source: 'Doctor Console',
        payload: '{ diagnosis: "Arrhythmia (Mild)", rx: "Beta-blocker 25mg", status: "Completed" }',
        action: 'Finalizes Clinical Consultation Record',
      },
      roleToTry: 'doctor' as const,
      roleLabel: 'Test as Doctor (Dr. Priya)',
    },
  ];

  const current = steps[activeStep];
  const CurrentIcon = current.icon;

  return (
    <section id="how-it-works" className="py-20 lg:py-28 bg-slate-50 border-b border-slate-200/80 relative overflow-hidden">
      {/* Background ambient accents */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl pointer-events-none -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-100/40 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-blue-50 text-blue-700 border border-blue-200/60"
          >
            <Layers className="w-3.5 h-3.5 text-blue-600" />
            <span>End-To-End Architecture</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight"
          >
            How SmartCare Cloud Works
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg text-slate-600"
          >
            From the initial patient booking to zero-trust cloud verification and clinical care delivery, every step is orchestrated through a secure, interconnected lifecycle.
          </motion.p>
        </div>

        {/* 4-Step Interactive Navigation Tabs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-10">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isActive = activeStep === idx;
            return (
              <button
                key={step.id}
                id={`how-step-tab-${idx}`}
                onClick={() => setActiveStep(idx)}
                className={`text-left p-4 sm:p-5 rounded-2xl transition-all duration-200 cursor-pointer border relative overflow-hidden ${
                  isActive
                    ? 'bg-white border-blue-500/80 shadow-md shadow-blue-500/5 ring-2 ring-blue-500/20'
                    : 'bg-white/70 hover:bg-white border-slate-200/80 text-slate-600 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`font-mono text-xs font-bold px-2 py-0.5 rounded-md ${
                      isActive ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    STEP {step.number}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${
                      isActive ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-xs sm:text-sm font-bold text-slate-900 leading-snug line-clamp-2">
                  {step.title}
                </div>
                <div className="text-[11px] text-slate-500 mt-1 truncate">
                  {step.subtitle}
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Step Detailed Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-xl shadow-slate-900/5 relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
            >
              {/* Left Details */}
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/60 text-blue-700 text-xs font-semibold mb-3">
                    <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
                    <span>{current.badge}</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    {current.title}
                  </h3>
                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed mt-2">
                    {current.description}
                  </p>
                </div>

                <div className="space-y-3 pt-1">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Key Cloud Implementations
                  </div>
                  {current.highlights.map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs sm:text-sm text-slate-700 font-medium">{item}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 flex flex-wrap items-center gap-3">
                  <button
                    id={`try-step-role-btn-${activeStep}`}
                    onClick={() => switchDemoRole(current.roleToTry)}
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-xs cursor-pointer transition-colors"
                  >
                    <span>{current.roleLabel}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setActiveStep((prev) => (prev + 1) % steps.length)}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <span>Next Phase</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Right: Technical Payload Visualizer */}
              <div className="lg:col-span-5 bg-slate-900 rounded-2xl p-6 text-white border border-slate-800 shadow-lg space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
                  <span className="font-mono text-teal-400 flex items-center gap-1.5">
                    <Cloud className="w-4 h-4 text-teal-400" />
                    Runtime Telemetry
                  </span>
                  <span className="text-emerald-400 font-mono text-[11px] flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                    Verified
                  </span>
                </div>

                <div className="space-y-1.5">
                  <div className="text-[11px] text-slate-400 uppercase font-mono">Component Source:</div>
                  <div className="text-xs font-mono font-bold text-blue-300 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60">
                    {current.diagram.source}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="text-[11px] text-slate-400 uppercase font-mono">Microservice Operation:</div>
                  <div className="text-xs text-slate-200 font-medium bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60 flex items-center gap-2">
                    <Lock className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                    <span>{current.diagram.action}</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="text-[11px] text-slate-400 uppercase font-mono">Simulated Structured Payload:</div>
                  <div className="font-mono text-[11px] bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-teal-300 leading-relaxed overflow-x-auto whitespace-pre-wrap">
                    {current.diagram.payload}
                  </div>
                </div>

                <div className="pt-2 text-[10px] text-slate-500 font-mono flex items-center justify-between">
                  <span>Standard: FHIR JSON v4.0</span>
                  <span>TLS 1.3 Strict</span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
