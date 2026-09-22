import React from 'react';
import { motion } from 'motion/react';
import { BookOpen, Award, AlertCircle, Sparkles, CheckCircle2, Clock, GitBranch, ArrowRight } from 'lucide-react';

export const ResearchSection: React.FC = () => {
  const papers = [
    {
      author: 'Ali et al.',
      year: '2018',
      title: 'Cloud computing-enabled healthcare opportunities, issues, and applications',
      journal: 'International Journal of Healthcare Information Systems',
      focus: 'Architectural paradigms of multi-tenant cloud storage and high-availability patient data exchange.',
      contribution: 'Categorized scalable cloud models for clinical coordination and emergency record retrieval.',
      limitation: 'Primarily conceptual framework; lacked unified end-to-end prototype implementation with live RBAC.',
      relevance: 'Provides the fundamental cloud-first blueprint for SmartCare Cloud’s centralised storage layer.',
    },
    {
      author: 'Al-Issa et al.',
      year: '2019',
      title: 'eHealth Cloud Security Challenges: A Survey',
      journal: 'IEEE Access / Health Informatics',
      focus: 'Vulnerability assessment of electronic health records against unauthorized exfiltration and identity spoofing.',
      contribution: 'Outlined role-based authentication and mandatory token verification protocols for clinical portals.',
      limitation: 'Focused heavily on attack surfaces without building concrete multi-role doctor-patient web workflows.',
      relevance: 'Directly informs SmartCare Cloud’s strict Firestore and Express authorization rule boundaries.',
    },
    {
      author: 'Deshmukh',
      year: '2017',
      title: 'Design of cloud security in the EHR for Indian healthcare services',
      journal: 'Journal of Medical Systems Research',
      focus: 'Standardized digital electronic health record schemas in diverse regional clinical environments.',
      contribution: 'Formulated cryptographic storage schemas and clinical consultation document standardization.',
      limitation: 'Evaluated closed enterprise setups rather than accessible web-standard SPA/PWA architectures.',
      relevance: 'Guides the synthetic patient record structure (diagnoses, consultation summaries, and PDF storage).',
    },
  ];

  return (
    <section id="research" className="py-20 lg:py-28 bg-white border-b border-slate-200/80 relative overflow-hidden">
      <div id="curriculum" className="scroll-mt-24" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Research Foundation Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-slate-100 text-slate-800 border border-slate-200"
          >
            <BookOpen className="w-3.5 h-3.5 text-teal-600" />
            <span>Academic Literature Base</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight"
          >
            Research Foundation & Theoretical Framework
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg text-slate-600"
          >
            Grounding our cloud computing prototype in peer-reviewed clinical informatics and cloud security literature.
          </motion.p>
        </div>

        {/* 3 Research Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-16">
          {papers.map((p, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="bg-slate-50/70 hover:bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 hover:border-teal-300 hover:shadow-lg transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-3 py-1 rounded-full bg-teal-50 text-teal-800 font-bold text-xs border border-teal-200/60">
                    {p.author} — {p.year}
                  </span>
                  <BookOpen className="w-4 h-4 text-slate-400" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-1 leading-snug">{p.title}</h3>
                <p className="text-xs font-mono text-slate-500 mb-4">{p.journal}</p>

                <div className="space-y-3 text-xs text-slate-600">
                  <div>
                    <span className="font-bold text-slate-900 block">Research Focus:</span>
                    <p className="mt-0.5">{p.focus}</p>
                  </div>
                  <div>
                    <span className="font-bold text-teal-700 block">Contribution:</span>
                    <p className="mt-0.5">{p.contribution}</p>
                  </div>
                  <div>
                    <span className="font-bold text-rose-700 block">Identified Limitation:</span>
                    <p className="mt-0.5">{p.limitation}</p>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-200/80 text-xs">
                <span className="font-bold text-slate-900">Project Relevance:</span>
                <p className="text-slate-600 mt-0.5">{p.relevance}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Research Gap Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 bg-[#0B132B] rounded-3xl p-8 sm:p-10 text-white shadow-xl border border-slate-800"
        >
          <div className="max-w-3xl space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-teal-300 font-mono">
              Academic Problem Formulation
            </span>
            <h3 className="text-2xl font-bold tracking-tight text-white">Research Gap Addressed</h3>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              "Existing studies address cloud healthcare, EHR security, privacy and access control from disparate academic perspectives. SmartCare Cloud synthesizes patient management, doctors, appointments, records, RBAC and centralized cloud storage into one cohesive, interactive academic prototype."
            </p>
          </div>
        </motion.div>

        {/* Development Status Matrix */}
        <div id="status" className="mb-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h3 className="text-2xl font-bold text-slate-900">Development & Implementation Status</h3>
            <p className="text-sm text-slate-500 mt-1">
              Rigorous academic milestone tracking ensuring transparent claims and honest demonstration boundaries.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* DOCUMENTED */}
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-700">DOCUMENTED</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-600">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-blue-600" /> Cloud Architecture Schema</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-blue-600" /> REST API Endpoints</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-blue-600" /> Technology Stack Spec</li>
              </ul>
            </div>

            {/* PROPOSED / DESIGN */}
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-700">PROPOSED / DESIGN</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-600">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-amber-600" /> Firestore Security Rules</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-amber-600" /> Multi-Tenant Role Matrix</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-amber-600" /> Cloud Storage PDF Vault</li>
              </ul>
            </div>

            {/* DEMONSTRATED */}
            <div className="bg-teal-50/70 rounded-2xl p-5 border border-teal-200">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-xs font-bold uppercase tracking-wider text-teal-800">DEMONSTRATED (WORKING)</span>
              </div>
              <ul className="space-y-2 text-xs text-teal-900 font-medium">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-teal-600" /> Multi-step Appointment Booking</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-teal-600" /> Doctor Outpatient Clinical Notes</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-teal-600" /> Patient Digital Health Records</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-teal-600" /> Admin User & Status Controls</li>
              </ul>
            </div>

            {/* NOT DEMONSTRATED & FUTURE */}
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600">NOT DEMONSTRATED</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed mb-2">
                Real hospital EHR hardware bridges & live pharmaceutical networks are separated to safeguard research integrity.
              </p>
              <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200 text-slate-700">
                Ethical Boundary
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
