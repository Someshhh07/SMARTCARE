import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  ShieldCheck,
  KeyRound,
  UserCheck,
  FileLock2,
  Server,
  Database,
  Lock,
  CheckCircle2,
  Shield,
  AlertTriangle,
  ArrowRight,
  Eye,
  EyeOff,
  Cpu,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const SecuritySection: React.FC = () => {
  const { switchDemoRole } = useAuth();
  const [selectedRole, setSelectedRole] = useState<'patient' | 'doctor' | 'admin'>('patient');

  const flowSteps = [
    { num: '01', title: 'USER REQUEST', desc: 'Client Initiated HTTPS' },
    { num: '02', title: 'JWT HANDSHAKE', desc: 'Firebase Token Verified' },
    { num: '03', title: 'ROLE VERIFICATION', desc: 'Claim Attributes Parsed' },
    { num: '04', title: 'ABAC POLICY GATE', desc: 'Record Ownership Tested' },
    { num: '05', title: 'SECURE REST API', desc: 'Express Middleware Route' },
    { num: '06', title: 'ENCRYPTED CLOUD', desc: 'Committed to Database' },
  ];

  const rolePermissions = {
    patient: {
      name: 'Patient (Aarav Kumar)',
      badgeColor: 'blue',
      canAccess: [
        'Read own consultation history and diagnostic records',
        'Book and manage outpatient appointments',
        'Download encrypted personal clinical summaries (PDF)',
      ],
      restricted: [
        'Cannot view records or appointments of other patients',
        'Cannot edit doctor clinical consultation notes',
        'Cannot access administrative telemetry or user databases',
      ],
    },
    doctor: {
      name: 'Doctor (Dr. Priya Rao)',
      badgeColor: 'teal',
      canAccess: [
        'Inspect assigned patient charts and historical diagnostic ECGs',
        'Author, edit, and sign outpatient consultation summaries',
        'Manage clinic daily schedule and patient arrival queues',
      ],
      restricted: [
        'Cannot access system-wide server infrastructure logs',
        'Cannot elevate user account roles or edit billing settings',
        'Cannot view unassigned patient records without clinical referral',
      ],
    },
    admin: {
      name: 'System Admin (Prof. Varma)',
      badgeColor: 'purple',
      canAccess: [
        'Monitor cloud server uptime, database latency, and error rates',
        'Manage hospital staff accounts and activation statuses',
        'Inspect cryptographic audit trails and access access logs',
      ],
      restricted: [
        'Cannot view sensitive, identifiable patient diagnostic notes (Zero-Knowledge)',
        'Cannot overwrite physician clinical diagnoses or prescriptions',
      ],
    },
  };

  const securityPillars = [
    {
      icon: KeyRound,
      title: 'Zero-Trust Authentication',
      subtitle: 'Cryptographic Identity Validation',
      desc: 'Enforces cryptographically signed JSON Web Tokens (JWT) for every API call, verifying user identity before any cloud compute cycle is allocated.',
      tags: ['JWT Tokens', 'Zero-Trust Handshake', 'Session Expiry'],
    },
    {
      icon: UserCheck,
      title: 'Role-Based Access Control',
      subtitle: 'ABAC & RBAC Policy Matrix',
      desc: 'Granular attribute-based authorization guarantees strict isolation between patients, clinical care teams, and hospital administrators.',
      tags: ['Document Ownership', 'Principle of Least Privilege', 'Route Guards'],
    },
    {
      icon: FileLock2,
      title: 'End-to-End Clinical Hygiene',
      subtitle: 'TLS 1.3 & AES-256 Storage',
      desc: 'All health summaries and attachments are encrypted in transit with TLS 1.3 and stored with AES-256 encryption within isolated cloud storage buckets.',
      tags: ['TLS 1.3 In-Flight', 'AES-256 At-Rest', 'Immutable Audit Trails'],
    },
  ];

  const currentRoleInfo = rolePermissions[selectedRole];

  return (
    <section id="security" className="py-20 lg:py-28 bg-slate-50 border-b border-slate-200/80 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-teal-50 text-teal-800 border border-teal-200/70"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
            <span>Enterprise Healthcare Security</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight"
          >
            Security Built Into Every Cloud Request
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg text-slate-600"
          >
            Healthcare data demands uncompromising confidentiality. SmartCare Cloud implements defense-in-depth from identity verification to document-level authorization.
          </motion.p>
        </div>

        {/* Visual Request Execution Flow Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-md shadow-slate-900/5"
        >
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono flex items-center gap-2">
              <Lock className="w-4 h-4 text-teal-600" />
              Cryptographic Request Execution Flow
            </span>
            <span className="text-[11px] font-mono text-teal-700 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200 font-semibold">
              Zero-Trust Architecture
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-6 gap-3 sm:gap-4 relative">
            {flowSteps.map((step, idx) => (
              <div
                key={idx}
                className="relative bg-slate-50 hover:bg-white rounded-2xl p-4 border border-slate-200/90 text-center flex flex-col justify-between transition-all hover:border-teal-300 hover:shadow-sm"
              >
                <div>
                  <div className="w-8 h-8 rounded-xl bg-teal-600 text-white font-mono text-xs font-bold flex items-center justify-center mx-auto mb-3 shadow-xs">
                    {step.num}
                  </div>
                  <div className="font-mono text-xs font-extrabold text-slate-900 tracking-tight leading-tight mb-1">
                    {step.title}
                  </div>
                </div>
                <div className="text-[11px] text-slate-500 font-medium mt-2">{step.desc}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* 3 Pillars of Security Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-16">
          {securityPillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="bg-white rounded-3xl p-7 border border-slate-200 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center mb-5 shadow-xs">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="text-[11px] font-bold text-teal-700 uppercase tracking-wider mb-1">
                    {pillar.subtitle}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{pillar.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                    {pillar.desc}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-4 border-t border-slate-100">
                  {pillar.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-[10px] font-semibold"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Interactive RBAC Simulator Showcase */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-200/80">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-teal-700 mb-1">
                Interactive RBAC Enforcement Engine
              </div>
              <h3 className="text-2xl font-bold text-slate-900">
                Test Role-Based Access Isolation
              </h3>
            </div>
            {/* Role switch pill selector */}
            <div className="inline-flex p-1 rounded-2xl bg-slate-100 border border-slate-200">
              {(['patient', 'doctor', 'admin'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setSelectedRole(r)}
                  className={`px-4 py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                    selectedRole === r
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Allowed permissions */}
            <div className="p-6 rounded-2xl bg-emerald-50/50 border border-emerald-200/80 space-y-3">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Permitted Scopes ({currentRoleInfo.name})</span>
              </div>
              <ul className="space-y-2.5">
                {currentRoleInfo.canAccess.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0"></span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Blocked / Denied permissions */}
            <div className="p-6 rounded-2xl bg-rose-50/50 border border-rose-200/80 space-y-3">
              <div className="flex items-center gap-2 text-rose-800 font-bold text-sm">
                <Shield className="w-4 h-4 text-rose-600" />
                <span>Enforced Defensive Boundaries</span>
              </div>
              <ul className="space-y-2.5">
                {currentRoleInfo.restricted.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0"></span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500 font-mono">
              Enforcement: Server-side Express middleware + Firestore Security Rules
            </span>
            <button
              onClick={() => switchDemoRole(selectedRole)}
              className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors"
            >
              <span>Launch {selectedRole} Portal</span>
              <ArrowRight className="w-3.5 h-3.5 text-teal-400" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
