import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Calendar,
  FileText,
  Eye,
  CheckCircle2,
  Clock,
  ChevronRight,
  ShieldCheck,
  X,
} from 'lucide-react';
import { Patient, Appointment, MedicalRecord } from '../../types';
import { api } from '../../services/apiService';
import { useAuth } from '../../context/AuthContext';

export const DoctorPatientsView: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [patientDetail, setPatientDetail] = useState<{
    appointments: Appointment[];
    medicalRecords: MedicalRecord[];
  } | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    setLoading(true);
    try {
      const data = await api.getPatients();
      setPatients(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPatient = async (p: Patient) => {
    setSelectedPatient(p);
    setLoadingDetail(true);
    try {
      const detail = await api.getPatientDetails(p.id);
      setPatientDetail({
        appointments: detail.appointments,
        medicalRecords: detail.medicalRecords,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingDetail(false);
    }
  };

  const filtered = patients.filter((p) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.id.toLowerCase().includes(q) ||
      p.medicalHistory.toLowerCase().includes(q) ||
      p.bloodGroup.toLowerCase().includes(q)
    );
  });

  return (
    <div id="doctor-patients-view" className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Assigned Patients Directory</h2>
          <p className="text-xs text-slate-500">
            Clinical profiles, longitudinal medical records, and past consultations under active care.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search patient, ID or diagnosis..."
            className="w-full pl-9 pr-3.5 py-2 bg-white border border-slate-200/80 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all duration-150"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
        </div>
      </div>

      {loading ? (
        <div className="py-12 text-center text-xs text-slate-400">Loading patient roster...</div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 uppercase font-semibold text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Patient Name</th>
                  <th className="py-3 px-4">ID</th>
                  <th className="py-3 px-4">Age / Gender</th>
                  <th className="py-3 px-4">Blood Group</th>
                  <th className="py-3 px-4">Last Visit</th>
                  <th className="py-3 px-4">Next Visit</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/70 transition-colors duration-150">
                    <td className="py-3.5 px-4 font-semibold text-slate-900">{p.name}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-500 text-[11px]">{p.id}</td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {p.age} yrs • {p.gender}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100 text-[11px]">
                        {p.bloodGroup}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">{p.lastVisit}</td>
                    <td className="py-3.5 px-4 font-medium text-slate-900">
                      {p.nextAppointment || 'None Scheduled'}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                        {p.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleSelectPatient(p)}
                        className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100/80 text-blue-700 font-semibold text-xs inline-flex items-center gap-1.5 cursor-pointer border border-blue-200/60 transition-colors duration-150"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect Chart</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Patient Overview Drawer / Modal */}
      {selectedPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-xl border border-slate-200/80 space-y-6 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">
                  Patient Health Record
                </span>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">{selectedPatient.name}</h3>
                <p className="text-xs text-slate-400 font-mono mt-0.5">Clinical ID: {selectedPatient.id}</p>
              </div>
              <button
                onClick={() => setSelectedPatient(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* General Info */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-slate-50/80 border border-slate-200/70 text-xs">
              <div>
                <span className="text-slate-400 block font-medium">Age & Gender</span>
                <span className="font-semibold text-slate-900 mt-0.5 block">
                  {selectedPatient.age} yrs, {selectedPatient.gender}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Blood Group</span>
                <span className="font-bold text-blue-700 mt-0.5 block">{selectedPatient.bloodGroup}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Emergency Contact</span>
                <span className="font-semibold text-slate-900 mt-0.5 block">{selectedPatient.emergencyContact}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Status</span>
                <span className="font-semibold text-emerald-700 mt-0.5 block">{selectedPatient.status}</span>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Documented Medical History
              </h4>
              <p className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/70 text-xs text-slate-700 leading-relaxed">
                {selectedPatient.medicalHistory}
              </p>
            </div>

            {/* Appointment & Records History tabs/cards */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Associated Clinical Records ({patientDetail?.medicalRecords.length || 0})
              </h4>
              {loadingDetail ? (
                <div className="text-xs text-slate-400 py-4 text-center">Loading linked records...</div>
              ) : patientDetail?.medicalRecords.length === 0 ? (
                <div className="text-xs text-slate-400 p-3 bg-slate-50 rounded-xl">No prior records.</div>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {patientDetail?.medicalRecords.map((r) => (
                    <div
                      key={r.id}
                      className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/70 flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="font-semibold text-slate-900">{r.diagnosis}</div>
                        <div className="text-[11px] text-slate-500">
                          {r.date} • {r.recordType} • Dr. {r.doctorName}
                        </div>
                      </div>
                      <span className="font-mono text-[10px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                        {r.recordId}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-end border-t border-slate-100">
              <button
                onClick={() => setSelectedPatient(null)}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold cursor-pointer transition-colors duration-150"
              >
                Done Inspecting
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
