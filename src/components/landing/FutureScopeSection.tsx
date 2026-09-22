import React from 'react';
import { motion } from 'motion/react';
import {
  Sparkles,
  GitBranch,
  Smartphone,
  Cpu,
  Radio,
  Share2,
  CheckCircle2,
  ArrowRight,
  Shield,
  Layers,
  Activity,
  HeartHandshake,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const FutureScopeSection: React.FC = () => {
  const { switchDemoRole } = useAuth();

  const phases = [
    {
      phase: 'PHASE 01',
      status: 'Current Prototype',
      statusColor: 'emerald',
      title: 'Centralised Core & RBAC',
      desc: 'Demonstrated operational cloud platform uniting patients, doctors, and administrators with strict role-based access rules.',
      features: [
        'Centralised NoSQL cloud database storage',
        'Firebase JWT token authentication & RBAC gateway',
        'Outpatient appointment management & slot booking',
        'Digital consultation record authoring & PDF access',
        'Administrative user governance & cloud telemetry',
      ],
      isLive: true,
    },
    {
      phase: 'PHASE 02',
      status: 'Near-Term Horizon',
      statusColor: 'blue',
      title: 'Extended Access & Mobile PWA',
      desc: 'Expanding accessibility through progressive mobile web applications, automated patient notifications, and multi-hospital federation.',
      features: [
        'Installable Progressive Web App (PWA) for iOS & Android',
        'Automated SMS & email appointment reminder triggers',
        'HL7/FHIR cross-facility diagnostic exchange protocols',
        'Multi-language consultation summaries (Regional dialects)',
        'Biometric authentication on mobile client viewports',
      ],
      isLive: false,
    },
    {
      phase: 'PHASE 03',
      status: 'Advanced Research Vision',
      statusColor: 'purple',
      title: 'AI Telemetry & Predictive Analytics',
      desc: 'Groundbreaking research into edge-computing IoT wearable integration, symptom triage algorithms, and hospital capacity prediction.',
      features: [
        'IoT smart wearable continuous telemetry (ECG/SpO2/BP)',
        'AI-assisted symptom triage for pre-consultation categorization',
        'Predictive inpatient bed and ICU resource allocation',
        'Automated drug-interaction counter-indication warnings',
        'Federated machine learning preserving patient privacy',
      ],
      isLive: false,
    },
  ];

  return (
    <section id="future-scope" className="py-20 lg:py-28 bg-white border-b border-slate-200/80 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-purple-50 text-purple-700 border border-purple-200/60"
          >
            <GitBranch className="w-3.5 h-3.5 text-purple-600" />
            <span>Research & Technology Roadmap</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight"
          >
            Future Scope & Clinical Evolution
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg text-slate-600"
          >
            From today's working academic prototype to future horizons of intelligent IoT telemetry and predictive healthcare analytics.
          </motion.p>
        </div>

        {/* 3 Roadmap Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {phases.map((item, idx) => (
            <motion.div
              key={item.phase}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15, duration: 0.4 }}
              className={`rounded-3xl p-7 border flex flex-col justify-between transition-all duration-200 ${
                item.isLive
                  ? 'bg-gradient-to-b from-blue-50/40 via-white to-white border-blue-200 shadow-lg shadow-blue-900/5 ring-1 ring-blue-500/10'
                  : 'bg-slate-50/70 hover:bg-white border-slate-200 hover:border-slate-300 hover:shadow-md'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-xs font-black tracking-widest text-slate-400">
                    {item.phase}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                      item.isLive
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : item.phase === 'PHASE 02'
                        ? 'bg-blue-50 text-blue-800 border border-blue-200'
                        : 'bg-purple-50 text-purple-800 border border-purple-200'
                    }`}
                  >
                    {item.isLive && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>}
                    {item.status}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                  {item.desc}
                </p>

                <div className="space-y-2.5 pt-4 border-t border-slate-200/80">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Roadmap Deliverables
                  </div>
                  {item.features.map((feat, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <div
                        className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                          item.isLive
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-slate-200/80 text-slate-600'
                        }`}
                      >
                        <CheckCircle2 className="w-3 h-3" />
                      </div>
                      <span className="text-xs text-slate-700 font-medium leading-tight">
                        {feat}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {item.isLive && (
                <div className="mt-8 pt-4">
                  <button
                    onClick={() => switchDemoRole('patient')}
                    className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-xs cursor-pointer transition-colors"
                  >
                    <span>Launch Implemented Demo</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Academic Ethics & Responsible Innovation Callout */}
        <div className="bg-slate-900 rounded-3xl p-8 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-8 border border-slate-800">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2 text-teal-400 text-xs font-bold uppercase tracking-wider">
              <Shield className="w-4 h-4" />
              <span>Ethical Boundary & Research Integrity</span>
            </div>
            <h3 className="text-2xl font-bold tracking-tight text-white">
              Strict Sandbox & Synthetic Patient Guarantee
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              To strictly comply with ethical healthcare research standards and institutional oversight, SmartCare Cloud operates purely with non-identifiable synthetic clinical data. Real hospital EHR hardware bridges, production insurance gateways, and real diagnostic decisions remain separated from this academic demonstration.
            </p>
          </div>
          <div className="shrink-0 flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <button
              onClick={() => switchDemoRole('admin')}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs sm:text-sm shadow-xs cursor-pointer transition-colors"
            >
              Examine Admin Audit
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
