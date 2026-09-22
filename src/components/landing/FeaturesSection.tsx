import React from 'react';
import { motion } from 'motion/react';
import {
  Cloud,
  FileCheck2,
  ShieldCheck,
  CalendarDays,
  Layers,
  Network,
  ArrowRight,
  Database,
  Lock,
  Stethoscope,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const FeaturesSection: React.FC = () => {
  const { switchDemoRole } = useAuth();

  const features = [
    {
      num: '01',
      icon: Cloud,
      title: 'Centralised Cloud Database',
      desc: 'High-availability NoSQL cloud cluster serving as the single source of truth, eradicating paper charts and cross-facility data duplication.',
      badge: 'Cloud Core',
      metric: '0.18ms Query Latency',
      role: 'patient' as const,
    },
    {
      num: '02',
      icon: FileCheck2,
      title: 'Digital Patient Records (EHR)',
      desc: 'Standardized clinical consultation summaries, diagnostic lab results, and encrypted PDF archives accessible by authorized clinicians.',
      badge: 'Healthcare Data',
      metric: '100% Digital Summaries',
      role: 'doctor' as const,
    },
    {
      num: '03',
      icon: ShieldCheck,
      title: 'Zero-Trust RBAC & ABAC',
      desc: 'Cryptographic token validation ensuring patients only view their personal records, while doctors and administrators maintain strict role boundaries.',
      badge: 'Security Engine',
      metric: 'Zero-Leak Privilege Model',
      role: 'admin' as const,
    },
    {
      num: '04',
      icon: CalendarDays,
      title: 'Real-Time Appointment Engine',
      desc: 'Conflict-free outpatient scheduling allowing patients to select department specialists and track appointment confirmation statuses instantly.',
      badge: 'Clinical Coordination',
      metric: 'Automated Slot Sync',
      role: 'patient' as const,
    },
    {
      num: '05',
      icon: Layers,
      title: 'Elastic Cloud Scalability',
      desc: 'Microservices architecture ready to support growing patient populations, multi-specialty clinics, and high-volume diagnostic telemetry.',
      badge: 'Infrastructure',
      metric: 'Auto-Scaling Pods',
      role: 'admin' as const,
    },
    {
      num: '06',
      icon: Network,
      title: 'Clinical Care Continuum',
      desc: 'Bridging the divide between patients, outpatient specialists, and hospital governance through one cohesive, role-tailored presentation portal.',
      badge: 'Connected Health',
      metric: 'Multi-Role Portals',
      role: 'doctor' as const,
    },
  ];

  return (
    <section id="features" className="py-20 lg:py-28 bg-white border-b border-slate-200/80 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-slate-100 text-slate-800 border border-slate-200"
          >
            <Layers className="w-3.5 h-3.5 text-teal-600" />
            <span>Platform Capabilities</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight"
          >
            Engineered for Healthcare, Cloud, & Security
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg text-slate-600"
          >
            A comprehensive suite of architectural modules designed to solve operational friction in modern clinical healthcare environments.
          </motion.p>
        </div>

        {/* 6 Capability Cards with Scroll-Triggered Stagger */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={feat.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                whileHover={{ y: -4 }}
                id={`feature-card-${feat.num}`}
                className="group relative bg-slate-50/70 hover:bg-white rounded-3xl p-7 border border-slate-200 hover:border-teal-300 hover:shadow-xl hover:shadow-teal-900/5 transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 group-hover:bg-teal-600 group-hover:text-white flex items-center justify-center transition-colors duration-200 shadow-xs">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="font-mono text-xs font-bold text-slate-400 group-hover:text-teal-600 transition-colors">
                      {feat.num}
                    </span>
                  </div>

                  <span className="text-[11px] font-bold tracking-wider uppercase text-teal-700 block mb-1">
                    {feat.badge}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-teal-950 transition-colors">
                    {feat.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                    {feat.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-200/80 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-slate-500 font-semibold">
                    {feat.metric}
                  </span>
                  <button
                    onClick={() => switchDemoRole(feat.role)}
                    className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform cursor-pointer"
                  >
                    <span>Test Persona</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
