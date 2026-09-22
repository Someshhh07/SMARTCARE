import React, { useState, useEffect } from 'react';
import {
  FileText,
  Search,
  Filter,
  Plus,
  Calendar,
  User,
  Stethoscope,
  Download,
  Eye,
  CheckCircle2,
  FileCheck,
  FileBadge,
  Sparkles,
  X,
  Building2,
  ShieldCheck,
} from 'lucide-react';
import { MedicalRecord, Patient } from '../../types';
import { api } from '../../services/apiService';
import { useAuth } from '../../context/AuthContext';
import { AcademicBadge } from '../common/AcademicBadge';

export const MedicalRecordsView: React.FC = () => {
  const { user, role, showToast } = useAuth();
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);

  // New Record modal (for Doctors)
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [newPatientId, setNewPatientId] = useState('');
  const [newRecordType, setNewRecordType] = useState<MedicalRecord['recordType']>('General Consultation');
  const [newDiagnosis, setNewDiagnosis] = useState('');
  const [newNotes, setNewNotes] = useState('');
  const [newPrescription, setNewPrescription] = useState('');
  const [newFollowUp, setNewFollowUp] = useState('2026-10-15');
  const [savingRecord, setSavingRecord] = useState(false);

  useEffect(() => {
    loadRecords();
    if (role === 'doctor' || role === 'admin') {
      loadPatients();
    }
  }, [role]);

  const loadRecords = async () => {
    setLoading(true);
    try {
      const data = await api.getMedicalRecords();
      setRecords(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadPatients = async () => {
    try {
      const data = await api.getPatients();
      setPatients(data);
      if (data.length > 0) setNewPatientId(data[0].id);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDiagnosis.trim() || !newNotes.trim()) {
      alert('Please fill out diagnosis and clinical notes.');
      return;
    }
    setSavingRecord(true);
    try {
      const targetPatient = patients.find((p) => p.id === newPatientId) || patients[0];
      const created = await api.createMedicalRecord({
        patientId: targetPatient ? targetPatient.id : 'pat-1',
        patientName: targetPatient ? targetPatient.name : 'Aarav Kumar',
        department: user?.department || 'Cardiology',
        date: new Date().toISOString().split('T')[0],
        recordType: newRecordType,
        diagnosis: newDiagnosis,
        consultationNotes: newNotes,
        medicalHistoryNotes: targetPatient ? targetPatient.medicalHistory : 'No prior allergies recorded.',
        prescription: newPrescription || 'Review in clinic with follow-up chart.',
        followUpDate: newFollowUp,
      });

      setRecords((prev) => [created, ...prev]);
      setCreateModalOpen(false);
      showToast(`Medical record ${created.recordId} saved to Central Cloud Store.`);
      // Reset form
      setNewDiagnosis('');
      setNewNotes('');
      setNewPrescription('');
    } catch (err: any) {
      alert(err.message || 'Failed to save record');
    } finally {
      setSavingRecord(false);
    }
  };

  const filteredRecords = records.filter((rec) => {
    if (selectedType !== 'all' && rec.recordType !== selectedType) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchDoc = rec.doctorName.toLowerCase().includes(q);
      const matchPat = rec.patientName.toLowerCase().includes(q);
      const matchDiag = rec.diagnosis.toLowerCase().includes(q);
      const matchId = rec.recordId.toLowerCase().includes(q);
      return matchDoc || matchPat || matchDiag || matchId;
    }
    return true;
  });

  return (
    <div id="medical-records-view" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Digital Healthcare Records</h2>
          <p className="text-xs text-slate-500">
            Centralized consultation summaries, diagnostic reports, and encrypted medical charts.
          </p>
        </div>

        {role === 'doctor' && (
          <button
            onClick={() => setCreateModalOpen(true)}
            className="px-4.5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-xs transition-all duration-150 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Consultation Record</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3 sm:p-3.5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Record Type Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {[
            { id: 'all', label: 'All Records' },
            { id: 'General Consultation', label: 'Consultations' },
            { id: 'Cardiology Review', label: 'Cardiology' },
            { id: 'Dermatology Assessment', label: 'Dermatology' },
            { id: 'Diagnostic Report', label: 'Diagnostics' },
          ].map((type) => (
            <button
              key={type.id}
              onClick={() => setSelectedType(type.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer ${
                selectedType === type.id
                  ? 'bg-blue-50 text-blue-800 border border-blue-200/80'
                  : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search diagnosis, doctor, ID..."
            className="w-full pl-9 pr-3.5 py-2 bg-white border border-slate-200/80 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all duration-150"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Records Table / Cards */}
      {loading ? (
        <div className="py-12 text-center text-xs text-slate-400">Loading digital records...</div>
      ) : filteredRecords.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200/80 space-y-3">
          <FileText className="w-10 h-10 text-slate-300 mx-auto" />
          <h4 className="text-base font-bold text-slate-800">No medical records found</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            No medical records currently match your search query or filter selection.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 uppercase font-semibold text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Record ID</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Patient</th>
                  <th className="py-3 px-4">Doctor & Specialty</th>
                  <th className="py-3 px-4">Record Type</th>
                  <th className="py-3 px-4">Clinical Diagnosis</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredRecords.map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-50/70 transition-colors duration-150">
                    <td className="py-3.5 px-4 font-mono font-semibold text-slate-900 text-[11px]">
                      {rec.recordId}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap text-slate-600">{rec.date}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900">{rec.patientName}</td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">{rec.doctorName}</div>
                      <div className="text-[11px] text-slate-400">{rec.department}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                        {rec.recordType}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-800 max-w-xs truncate">
                      {rec.diagnosis}
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => setSelectedRecord(rec)}
                        className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100/80 text-blue-700 font-semibold text-xs inline-flex items-center gap-1.5 transition-colors duration-150 cursor-pointer border border-blue-200/60"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Record</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SECTION 20: Medical Record Detail Modal (Real Medical Document Style) */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 sm:p-8 shadow-xl border border-slate-200/80 space-y-6 my-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-200 gap-4">
              <div>
                <div className="flex items-center gap-2 text-blue-700 font-bold text-xs tracking-wider uppercase">
                  <ShieldCheck className="w-4 h-4" />
                  <span>SMARTCARE CLOUD • DIGITAL HEALTHCARE RECORD</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-0.5">
                  Clinical Consultation Summary
                </h3>
                <p className="text-xs font-mono text-slate-400 mt-0.5">Record ID: {selectedRecord.recordId}</p>
              </div>

              <div className="flex items-center gap-2">
                <AcademicBadge />
                <button
                  onClick={() => setSelectedRecord(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Document Patient & Physician Metadata Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50/80 border border-slate-200/70 text-xs">
              <div>
                <span className="text-slate-400 block uppercase tracking-wider text-[10px] font-semibold">
                  Patient Name
                </span>
                <span className="font-bold text-sm text-slate-900 mt-0.5 block">{selectedRecord.patientName}</span>
                <span className="text-[11px] text-slate-500 font-mono block">ID: {selectedRecord.patientId}</span>
              </div>
              <div>
                <span className="text-slate-400 block uppercase tracking-wider text-[10px] font-semibold">
                  Attending Physician
                </span>
                <span className="font-bold text-sm text-slate-900 mt-0.5 block">{selectedRecord.doctorName}</span>
                <span className="text-[11px] text-blue-700 font-medium block">{selectedRecord.department}</span>
              </div>
              <div>
                <span className="text-slate-400 block uppercase tracking-wider text-[10px] font-semibold">
                  Consultation Date
                </span>
                <span className="font-bold text-sm text-slate-900 mt-0.5 block">{selectedRecord.date}</span>
                <span className="text-[11px] text-slate-500 block">{selectedRecord.recordType}</span>
              </div>
              <div>
                <span className="text-slate-400 block uppercase tracking-wider text-[10px] font-semibold">
                  Follow-up Review
                </span>
                <span className="font-bold text-sm text-blue-800 mt-0.5 block">{selectedRecord.followUpDate}</span>
                <span className="text-[10px] font-semibold text-emerald-700 block">STATUS: FINALIZED</span>
              </div>
            </div>

            {/* Primary Clinical Findings */}
            <div className="space-y-4 text-xs">
              <div>
                <h4 className="font-semibold text-xs uppercase tracking-wider text-slate-500 mb-1.5">
                  1. Clinical Diagnosis & Impressions
                </h4>
                <div className="p-3.5 rounded-xl bg-blue-50/40 border border-blue-100 font-semibold text-sm text-slate-900">
                  {selectedRecord.diagnosis}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-xs uppercase tracking-wider text-slate-500 mb-1.5">
                  2. Consultation Notes & Examination Findings
                </h4>
                <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/70 text-slate-700 leading-relaxed">
                  {selectedRecord.consultationNotes}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-xs uppercase tracking-wider text-slate-500 mb-1.5">
                  3. Recorded Medical & Allergy History
                </h4>
                <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/70 text-slate-700 leading-relaxed">
                  {selectedRecord.medicalHistoryNotes || 'Nil known drug allergies.'}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-xs uppercase tracking-wider text-slate-500 mb-1.5">
                  4. Prescribed Regimen & Management Plan
                </h4>
                <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/70 text-slate-800 font-mono leading-relaxed">
                  {selectedRecord.prescription}
                </div>
              </div>

              {/* Cloud Documents Section */}
              <div>
                <h4 className="font-semibold text-xs uppercase tracking-wider text-slate-500 mb-1.5">
                  5. Encrypted Cloud Storage Attachments
                </h4>
                <div className="space-y-2">
                  {selectedRecord.documents && selectedRecord.documents.length > 0 ? (
                    selectedRecord.documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between p-3 rounded-xl bg-slate-50/80 border border-slate-200/70"
                      >
                        <div className="flex items-center gap-2.5">
                          <FileText className="w-4 h-4 text-blue-600" />
                          <div>
                            <div className="font-semibold text-xs text-slate-900">{doc.name}</div>
                            <div className="text-[10px] text-slate-500 font-mono">
                              Size: {doc.size} • Uploaded to Cloud Storage
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => alert(`Simulated secure download of ${doc.name} from Firebase Cloud Storage.`)}
                          className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center gap-1.5 cursor-pointer shadow-2xs transition-colors duration-150"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download PDF</span>
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/70 text-slate-400 text-xs italic">
                      No external lab files attached to this consultation note.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Academic Prototype Notice on Medical Record */}
            <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/70 text-amber-900 text-xs flex items-center justify-between">
              <span className="font-medium">
                Academic Prototype: Synthetic healthcare data only. No autonomous clinical diagnosis.
              </span>
              <span className="font-mono text-[10px] font-semibold uppercase text-amber-800">Verified Synthetic</span>
            </div>

            {/* Footer action */}
            <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
              <button
                onClick={() => setSelectedRecord(null)}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold cursor-pointer transition-colors duration-150"
              >
                Close Document
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Doctor Consultation Creator Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-7 shadow-xl border border-slate-200/80 space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider">
                  Physician Outpatient Workspace
                </span>
                <h3 className="text-lg font-bold text-slate-900 tracking-tight">Author Consultation Record</h3>
              </div>
              <button
                onClick={() => setCreateModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRecord} className="space-y-4 text-xs">
              {/* Select Patient */}
              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Select Patient
                </label>
                <select
                  value={newPatientId}
                  onChange={(e) => setNewPatientId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 font-medium"
                >
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} (Age: {p.age}, {p.bloodGroup})
                    </option>
                  ))}
                </select>
              </div>

              {/* Record Type */}
              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Record Category
                </label>
                <select
                  value={newRecordType}
                  onChange={(e) => setNewRecordType(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                >
                  <option value="General Consultation">General Consultation</option>
                  <option value="Cardiology Review">Cardiology Review</option>
                  <option value="Dermatology Assessment">Dermatology Assessment</option>
                  <option value="Diagnostic Report">Diagnostic Report</option>
                  <option value="Follow-up">Follow-up</option>
                </select>
              </div>

              {/* Diagnosis */}
              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Primary Clinical Diagnosis
                </label>
                <input
                  type="text"
                  required
                  value={newDiagnosis}
                  onChange={(e) => setNewDiagnosis(e.target.value)}
                  placeholder="e.g. Mild Essential Hypertension with exertion palpitations"
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
              </div>

              {/* Consultation Notes */}
              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Consultation Notes & Clinical Examination
                </label>
                <textarea
                  rows={3}
                  required
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="Patient presented for outpatient evaluation. Heart sounds regular S1/S2..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
              </div>

              {/* Prescription */}
              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Prescription / Medications
                </label>
                <input
                  type="text"
                  value={newPrescription}
                  onChange={(e) => setNewPrescription(e.target.value)}
                  placeholder="e.g. Tab Telmisartan 40mg OD x 30 days"
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
              </div>

              {/* Follow-up Date */}
              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Recommended Follow-up Date
                </label>
                <input
                  type="date"
                  value={newFollowUp}
                  onChange={(e) => setNewFollowUp(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2 text-slate-600 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingRecord}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs transition-colors duration-150 cursor-pointer disabled:opacity-50"
                >
                  {savingRecord ? 'Committing to Cloud...' : 'Commit & Finalize Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
