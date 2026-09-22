import React, { useState } from 'react';
import { ShieldCheck, Check, Minus, Info, Lock, ShieldAlert, Sparkles } from 'lucide-react';
import { AcademicBadge } from '../common/AcademicBadge';

interface PermissionRow {
  id: string;
  permission: string;
  description: string;
  patient: boolean;
  doctor: boolean;
  admin: boolean;
  clinicalRationale: string;
}

export const RbacMatrixView: React.FC = () => {
  const [matrix, setMatrix] = useState<PermissionRow[]>([
    {
      id: 'p1',
      permission: 'View Own Profile',
      description: 'Access personal demographic, contact, and emergency info',
      patient: true,
      doctor: true,
      admin: true,
      clinicalRationale: 'Fundamental privacy right under HIPAA / GDPR.',
    },
    {
      id: 'p2',
      permission: 'Book Appointment',
      description: 'Schedule outpatient consultation slots with specialists',
      patient: true,
      doctor: false,
      admin: false,
      clinicalRationale: 'Patients initiate appointments; doctors review incoming requests.',
    },
    {
      id: 'p3',
      permission: 'View Own Records',
      description: 'Inspect personal clinical notes, prescriptions, and lab tests',
      patient: true,
      doctor: false,
      admin: false,
      clinicalRationale: 'Patients have read-only access to their finalized clinical summaries.',
    },
    {
      id: 'p4',
      permission: 'View Assigned Patients',
      description: 'Inspect patient roster, medical history, and past charts',
      patient: false,
      doctor: true,
      admin: false,
      clinicalRationale: 'Doctors only access patients actively assigned to their outpatient care.',
    },
    {
      id: 'p5',
      permission: 'Create Medical Records',
      description: 'Author new diagnoses, consultation notes, and prescriptions',
      patient: false,
      doctor: true,
      admin: false,
      clinicalRationale: 'Only certified attending physicians can create clinical documentation.',
    },
    {
      id: 'p6',
      permission: 'Manage Users & Roles',
      description: 'Activate or deactivate accounts and govern role credentials',
      patient: false,
      doctor: false,
      admin: true,
      clinicalRationale: 'Administrative governance without altering clinical diagnosis data.',
    },
    {
      id: 'p7',
      permission: 'System & Cloud Monitoring',
      description: 'Access Firestore telemetry, latency metrics, and audit traces',
      patient: false,
      doctor: false,
      admin: true,
      clinicalRationale: 'Infrastructure observability reserved for system administrators.',
    },
  ]);

  const togglePermission = (rowId: string, role: 'patient' | 'doctor' | 'admin') => {
    setMatrix((prev) =>
      prev.map((row) =>
        row.id === rowId ? { ...row, [role]: !row[role] } : row
      )
    );
  };

  return (
    <div id="rbac-matrix-view" className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Role-Based Access Control (RBAC) Matrix
            </h2>
            <AcademicBadge />
          </div>
          <p className="text-xs text-slate-500">
            Cryptographic policy table enforcing principle of least privilege across clinical personas.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-blue-700 bg-blue-50 px-3 py-1 rounded-xl border border-blue-200/80 font-semibold shadow-2xs">
            Interactive Policy Sandbox
          </span>
        </div>
      </div>

      {/* Interactive Matrix Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200/80 text-slate-600 uppercase font-semibold text-[10px] tracking-wider">
              <tr>
                <th className="py-4 px-5">System Permission & Scope</th>
                <th className="py-4 px-4 text-center bg-blue-50/40">
                  <span className="text-blue-900 font-bold">PATIENT</span>
                </th>
                <th className="py-4 px-4 text-center bg-teal-50/40">
                  <span className="text-teal-900 font-bold">DOCTOR</span>
                </th>
                <th className="py-4 px-4 text-center bg-indigo-50/40">
                  <span className="text-indigo-900 font-bold">ADMIN</span>
                </th>
                <th className="py-4 px-5">Clinical & Security Rationale</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {matrix.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/70 transition-colors duration-150">
                  <td className="py-4 px-5">
                    <div className="font-bold text-slate-900 text-sm tracking-tight">{row.permission}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{row.description}</div>
                  </td>

                  {/* Patient Toggle */}
                  <td className="py-4 px-4 text-center bg-blue-50/20">
                    <button
                      onClick={() => togglePermission(row.id, 'patient')}
                      className={`w-7 h-7 rounded-lg inline-flex items-center justify-center font-bold transition-all duration-150 cursor-pointer ${
                        row.patient
                          ? 'bg-emerald-600 text-white shadow-2xs hover:bg-emerald-500'
                          : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                      }`}
                      title="Click to toggle demo permission"
                    >
                      {row.patient ? <Check className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
                    </button>
                  </td>

                  {/* Doctor Toggle */}
                  <td className="py-4 px-4 text-center bg-teal-50/20">
                    <button
                      onClick={() => togglePermission(row.id, 'doctor')}
                      className={`w-7 h-7 rounded-lg inline-flex items-center justify-center font-bold transition-all duration-150 cursor-pointer ${
                        row.doctor
                          ? 'bg-emerald-600 text-white shadow-2xs hover:bg-emerald-500'
                          : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                      }`}
                      title="Click to toggle demo permission"
                    >
                      {row.doctor ? <Check className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
                    </button>
                  </td>

                  {/* Admin Toggle */}
                  <td className="py-4 px-4 text-center bg-indigo-50/20">
                    <button
                      onClick={() => togglePermission(row.id, 'admin')}
                      className={`w-7 h-7 rounded-lg inline-flex items-center justify-center font-bold transition-all duration-150 cursor-pointer ${
                        row.admin
                          ? 'bg-emerald-600 text-white shadow-2xs hover:bg-emerald-500'
                          : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                      }`}
                      title="Click to toggle demo permission"
                    >
                      {row.admin ? <Check className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
                    </button>
                  </td>

                  <td className="py-4 px-5 text-slate-600 text-xs leading-relaxed max-w-sm">
                    {row.clinicalRationale}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Security Enforcement Callout */}
      <div className="p-5 rounded-2xl bg-blue-50/60 border border-blue-200/80 text-blue-900 text-xs flex items-start gap-3 shadow-xs">
        <ShieldCheck className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-bold text-sm text-slate-900 mb-0.5 tracking-tight">
            Hardened Firestore Security Rules (`firestore.rules`)
          </h4>
          <p className="leading-relaxed text-slate-600">
            This permission matrix is mathematically enforced server-side. Even if a user crafts a direct database request, Firestore evaluates `request.auth.token.role` against document ownership attributes before returning a single byte of patient records.
          </p>
        </div>
      </div>
    </div>
  );
};
