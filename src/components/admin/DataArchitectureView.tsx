import React, { useState } from 'react';
import {
  Database,
  Table,
  Key,
  Link,
  Layers,
  ArrowRight,
  Shield,
  Server,
  Cloud,
  FileCode,
  Network,
} from 'lucide-react';
import { AcademicBadge } from '../common/AcademicBadge';
import { CloudArchitectureVisualizer } from '../landing/CloudArchitectureVisualizer';

export const DataArchitectureView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'topology' | 'schema'>('topology');
  const [selectedCol, setSelectedCol] = useState<string>('medicalRecords');


  const collections = [
    {
      id: 'users',
      name: 'users',
      badge: 'Identity Store',
      color: 'border-blue-500 text-blue-400',
      description: 'Central authentication credentials and assigned roles (patient, doctor, admin).',
      fields: [
        { name: 'id', type: 'string', desc: 'Primary User UID' },
        { name: 'email', type: 'string', desc: 'Unique email credential' },
        { name: 'role', type: 'string', desc: '"patient" | "doctor" | "admin"' },
        { name: 'name', type: 'string', desc: 'Display name' },
        { name: 'status', type: 'string', desc: '"active" | "inactive"' },
        { name: 'createdAt', type: 'timestamp', desc: 'ISO creation date' },
      ],
      relations: ['Linked 1:1 to patients.userId or doctors.userId'],
    },
    {
      id: 'patients',
      name: 'patients',
      badge: 'Patient Profiles',
      color: 'border-emerald-500 text-emerald-400',
      description: 'Longitudinal clinical profiles, allergies, blood group, and emergency contacts.',
      fields: [
        { name: 'id', type: 'string', desc: 'Unique Patient ID' },
        { name: 'userId', type: 'string', desc: 'Foreign Key → users.id' },
        { name: 'name', type: 'string', desc: 'Legal full name' },
        { name: 'age', type: 'number', desc: 'Demographic age' },
        { name: 'bloodGroup', type: 'string', desc: 'ABO Rh typing' },
        { name: 'medicalHistory', type: 'string', desc: 'Chronic conditions / allergies' },
      ],
      relations: ['Has many appointments.patientId', 'Has many medicalRecords.patientId'],
    },
    {
      id: 'doctors',
      name: 'doctors',
      badge: 'Physician Registry',
      color: 'border-teal-500 text-teal-400',
      description: 'Verified healthcare specialists, departmental affiliations, and outpatient consultation rates.',
      fields: [
        { name: 'id', type: 'string', desc: 'Unique Doctor ID' },
        { name: 'userId', type: 'string', desc: 'Foreign Key → users.id' },
        { name: 'name', type: 'string', desc: 'Physician title & name' },
        { name: 'specialization', type: 'string', desc: 'Clinical specialty' },
        { name: 'department', type: 'string', desc: 'Hospital wing' },
        { name: 'availabilityHours', type: 'string', desc: 'Outpatient slot window' },
      ],
      relations: ['Has many appointments.doctorId', 'Authors medicalRecords.doctorId'],
    },
    {
      id: 'appointments',
      name: 'appointments',
      badge: 'Outpatient Scheduler',
      color: 'border-amber-500 text-amber-400',
      description: 'Booked, fulfilled, and cancelled clinical appointment slots.',
      fields: [
        { name: 'id', type: 'string', desc: 'Appointment UID' },
        { name: 'patientId', type: 'string', desc: 'Foreign Key → patients.id' },
        { name: 'doctorId', type: 'string', desc: 'Foreign Key → doctors.id' },
        { name: 'date', type: 'string', desc: 'YYYY-MM-DD' },
        { name: 'time', type: 'string', desc: 'Outpatient time' },
        { name: 'status', type: 'string', desc: '"confirmed" | "completed" | "cancelled"' },
      ],
      relations: ['Connects Patient and Doctor for specific time slot'],
    },
    {
      id: 'medicalRecords',
      name: 'medicalRecords',
      badge: 'Clinical Vault',
      color: 'border-indigo-500 text-indigo-400',
      description: 'Encrypted clinical consultation encounters, diagnoses, prescriptions, and cloud document links.',
      fields: [
        { name: 'id', type: 'string', desc: 'Document UID' },
        { name: 'recordId', type: 'string', desc: 'Readable code (SMC-REC-...)' },
        { name: 'patientId', type: 'string', desc: 'Foreign Key → patients.id' },
        { name: 'doctorId', type: 'string', desc: 'Foreign Key → doctors.id' },
        { name: 'diagnosis', type: 'string', desc: 'Primary ICD diagnosis' },
        { name: 'consultationNotes', type: 'string', desc: 'Clinical examination findings' },
        { name: 'documents', type: 'array', desc: 'Cloud Storage file attachments' },
      ],
      relations: ['Associated with Patient history and Doctor credentials'],
    },
  ];

  const active = collections.find((c) => c.id === selectedCol) || collections[4];

  return (
    <div id="data-architecture-view" className="space-y-6">
      {/* Top Banner & View Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Cloud System Architecture & Data Model
            </h2>
            <AcademicBadge />
          </div>
          <p className="text-xs text-slate-500">
            End-to-end interactive cloud topology and centralised Firestore entity schema definitions.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center p-1 rounded-xl bg-slate-200/80 border border-slate-300 text-xs">
          <button
            id="tab-btn-topology"
            onClick={() => setActiveTab('topology')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'topology'
                ? 'bg-slate-900 text-white font-bold shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Network className="w-3.5 h-3.5" />
            <span>Cloud Architecture Flow</span>
          </button>
          <button
            id="tab-btn-schema"
            onClick={() => setActiveTab('schema')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'schema'
                ? 'bg-slate-900 text-white font-bold shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Firestore ER Model</span>
          </button>
        </div>
      </div>

      {activeTab === 'topology' ? (
        <CloudArchitectureVisualizer />
      ) : (
        /* Dark Cloud / Database Layout (Section 27) */
        <div className="bg-slate-900 rounded-2xl p-6 sm:p-8 text-white border border-slate-800 shadow-xl space-y-7">
          {/* Title */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800/80 gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/30 text-blue-400 flex items-center justify-center">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-sm text-white tracking-tight">Centralised Cloud Firestore Instance</div>
                <div className="text-[11px] font-mono text-slate-400">Database ID: (default) • Multi-region: asia-east1</div>
              </div>
            </div>
            <span className="text-xs font-mono text-blue-400 bg-blue-950/60 px-3 py-1 rounded-xl border border-blue-500/30 self-start sm:self-auto">
              NoSQL Schema Verified
            </span>
          </div>

        {/* 5 Connected Collections Nodes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3.5">
          {collections.map((col) => {
            const isSelected = selectedCol === col.id;
            return (
              <div
                key={col.id}
                onClick={() => setSelectedCol(col.id)}
                className={`p-4 rounded-xl border transition-all duration-150 cursor-pointer ${
                  isSelected
                    ? 'bg-slate-800/90 border-blue-400 shadow-md shadow-blue-500/10'
                    : 'bg-slate-950/50 border-slate-800/90 hover:border-slate-700 hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-400">
                    Collection
                  </span>
                  <Table className="w-3.5 h-3.5 text-slate-400" />
                </div>
                <div className="font-mono text-sm font-bold text-white mb-1">/{col.name}</div>
                <div className="text-[11px] text-blue-400 font-medium">{col.badge}</div>
                <div className="text-[10px] font-mono text-slate-500 mt-2">
                  {col.fields.length} schema fields
                </div>
              </div>
            );
          })}
        </div>

        {/* Detailed Schema Inspector for Selected Collection */}
        <div className="bg-slate-950/70 rounded-xl p-6 border border-slate-800/90 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800/80 gap-2">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-blue-400 font-semibold">
                Collection Inspector
              </span>
              <h3 className="text-lg font-bold text-white tracking-tight">/{active.name}</h3>
              <p className="text-xs text-slate-400 mt-0.5">{active.description}</p>
            </div>
            <span className="text-xs font-mono text-slate-400 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800 self-start sm:self-auto">
              Rules: Default Deny + RBAC
            </span>
          </div>

          {/* Fields list */}
          <div className="space-y-2">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Document Field Schema
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              {active.fields.map((f, i) => (
                <div
                  key={i}
                  className="p-3 rounded-xl bg-slate-900/90 border border-slate-800/80 flex items-center justify-between gap-2"
                >
                  <div className="font-mono font-bold text-slate-200">
                    {f.name}
                    <span className="ml-2 text-[10px] text-blue-400 font-normal">({f.type})</span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-medium text-right">{f.desc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Relational linkages */}
          <div className="pt-3 border-t border-slate-800/80 text-xs text-slate-400">
            <span className="font-semibold text-slate-300 block mb-1">Relational Flow:</span>
            <ul className="list-disc list-inside space-y-1 text-slate-400">
              {active.relations.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      )}
    </div>
  );
};
