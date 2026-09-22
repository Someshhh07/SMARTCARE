import React from 'react';
import { motion } from 'motion/react';
import {
  Layers,
  ShieldCheck,
  Zap,
  Lock,
  Database,
  CheckCircle2,
  Cpu,
  Server,
  Activity,
  Cloud,
} from 'lucide-react';
import { CloudArchitectureVisualizer } from './CloudArchitectureVisualizer';

export const ArchitectureSection: React.FC = () => {
  return (
    <section id="architecture" className="py-20 lg:py-28 bg-slate-50 text-slate-900 relative border-y border-slate-200/80">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header (Light interface styling) */}
        <div className="text-center max-w-3xl mx-auto space-y-3.5 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-teal-50 text-teal-800 border border-teal-200/80"
          >
            <Layers className="w-3.5 h-3.5 text-teal-600" />
            <span>ENTERPRISE SYSTEM TOPOLOGY</span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight"
          >
            Interactive Cloud Architecture
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg text-slate-600 leading-relaxed"
          >
            Explore the end-to-end data pipeline connecting patient and clinical stakeholders through token-based identity verification, strict role-based policy gates, and distributed cloud persistence.
          </motion.p>
        </div>

        {/* Visually Sophisticated Dark Architecture Panel Against the Otherwise Light Interface */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.25 }}
          className="relative rounded-3xl p-1.5 sm:p-2 bg-gradient-to-b from-slate-800 via-slate-900 to-slate-950 shadow-2xl border border-slate-700/60"
        >
          <div className="rounded-2xl overflow-hidden">
            <CloudArchitectureVisualizer />
          </div>
        </motion.div>

        {/* Supporting Architectural Guarantees Grid (Light Cards) */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-700">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-slate-900">Zero-Trust Authorization</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every request carries signed cryptographic JWT claims validated deterministically at both the Express middleware layer and Firestore Security Rules.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700">
              <Database className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-slate-900">Decoupled Persistence</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Separates high-throughput structured EHR document operations in Firestore from encrypted binary attachments in Cloud Storage with signed URLs.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700">
              <Activity className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-slate-900">Continuous Resilience</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Active automated 6-hour database snapshot backups, point-in-time restore capability, and continuous health probes upholding a 99.99% availability SLA.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};
