import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Users,
  Clock,
  FileCheck2,
  Plus,
  ArrowRight,
  Search,
  CheckCircle2,
  FileText,
  User,
  Activity,
  AlertCircle,
  Eye,
  X,
  Stethoscope,
  ChevronRight,
  ClipboardList,
  Filter,
  CheckSquare,
  Sparkles,
  HeartPulse,
  Pill,
  Send,
} from 'lucide-react';
import { Appointment, Patient, MedicalRecord } from '../../types';
import { api } from '../../services/apiService';
import { useAuth } from '../../context/AuthContext';

interface DoctorDashboardViewProps {
  onNavigate: (nav: string) => void;
}

export const DoctorDashboardView: React.FC<DoctorDashboardViewProps> = ({ onNavigate }) => {
  const { user, showToast } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // New Consultation Note Modal
  const [consultationModalOpen, setConsultationModalOpen] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [recordType, setRecordType] = useState<MedicalRecord['recordType']>('Cardiology Review');
  const [diagnosis, setDiagnosis] = useState('');
  const [notes, setNotes] = useState('');
  const [prescription, setPrescription] = useState('');
  const [followUpDate, setFollowUpDate] = useState('2026-10-15');
  const [savingRecord, setSavingRecord] = useState(false);

  // Patient Inspection Drawer
  const [inspectPatient, setInspectPatient] = useState<Patient | null>(null);

  // Selected Record Viewer
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);

  useEffect(() => {
    loadDoctorData();
  }, []);

  const loadDoctorData = async () => {
    setLoading(true);
    try {
      const [appts, pats, recs] = await Promise.all([
        api.getAppointments(),
        api.getPatients(),
        api.getMedicalRecords(),
      ]);
      setAppointments(appts);
      setPatients(pats);
      setRecords(recs);
      if (pats.length > 0) setSelectedPatientId(pats[0].id);
    } catch (err) {
      console.error('Error loading doctor data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveConsultation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!diagnosis.trim() || !notes.trim()) {
      alert('Please fill diagnosis and consultation notes.');
      return;
    }
    setSavingRecord(true);
    try {
      const p = patients.find((pat) => pat.id === selectedPatientId) || patients[0];
      const created = await api.createMedicalRecord({
        patientId: p.id,
        patientName: p.name,
        department: user?.department || 'Cardiology',
        date: new Date().toISOString().split('T')[0],
        recordType,
        diagnosis,
        consultationNotes: notes,
        medicalHistoryNotes: p.medicalHistory,
        prescription: prescription || 'Maintain prescribed dosage and lifestyle tracking.',
        followUpDate,
      });

      setRecords((prev) => [created, ...prev]);
      setConsultationModalOpen(false);
      showToast(`Consultation record for ${p.name} committed to Central Cloud.`);
      setDiagnosis('');
      setNotes('');
      setPrescription('');
    } catch (err: any) {
      alert(err.message || 'Failed to save record');
    } finally {
      setSavingRecord(false);
    }
  };

  const handleMarkApptDone = async (id: string) => {
    try {
      const updated = await api.updateAppointmentStatus(id, 'completed');
      setAppointments((prev) => prev.map((a) => (a.id === id ? updated : a)));
      showToast('Appointment completed and synchronized with patient vault.');
    } catch (err: any) {
      alert(err.message || 'Error updating appointment');
    }
  };

  const todaySchedule = appointments.slice(0, 4);

  // Clinical specialty consultation breakdown data for useful clinical chart
  const specialtyDistribution = [
    { name: 'Cardiology', count: 14, pct: 45, color: 'bg-blue-600' },
    { name: 'Lipid Review', count: 8, pct: 25, color: 'bg-teal-500' },
    { name: 'Hypertension', count: 5, pct: 18, color: 'bg-indigo-500' },
    { name: 'Post-Op Follow-up', count: 4, pct: 12, color: 'bg-amber-500' },
  ];

  // Recent clinical feed
  const clinicalActivity = [
    {
      id: 'c-act-1',
      title: 'Consultation Note Signed',
      desc: 'Cardiology review note authorized for Aarav Sharma (Stable vitals).',
      time: '15 mins ago',
      badge: 'Signed EHR',
      badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    {
      id: 'c-act-2',
      title: 'Lab Diagnostics Received',
      desc: 'Diagnostic ECG panel for Vikram Singh processed (Normal rhythm).',
      time: '1 hour ago',
      badge: 'Diagnostics',
      badgeClass: 'bg-teal-50 text-teal-700 border-teal-200',
    },
    {
      id: 'c-act-3',
      title: 'Outpatient Slot Added',
      desc: 'Follow-up appointment booked for Meera Patel for Oct 12.',
      time: '3 hours ago',
      badge: 'Scheduled',
      badgeClass: 'bg-blue-50 text-blue-700 border-blue-200',
    },
    {
      id: 'c-act-4',
      title: 'Medication Reconciliation',
      desc: 'Adjusted Rosuvastatin dosage for patient PAT-001.',
      time: 'Yesterday',
      badge: 'Prescription',
      badgeClass: 'bg-purple-50 text-purple-700 border-purple-200',
    },
  ];

  return (
    <div id="doctor-dashboard-view" className="space-y-8 animate-in fade-in duration-200">
      {/* 1. Clinical Command Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-[#0B172A] to-slate-900 p-6 sm:p-8 rounded-3xl text-white shadow-md border border-slate-800">
        <div className="absolute right-0 top-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute right-64 -bottom-10 w-48 h-48 bg-teal-500/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-blue-500/15 text-blue-300 border border-blue-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>
              <span>CLINICAL PRACTICE WORKSPACE • ATTENDING PHYSICIAN</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Welcome, {user?.name || 'Dr. Priya Rao'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-normal max-w-xl leading-relaxed">
              Cardiology Outpatient Department. Review patient intake queues, author audited clinical consultation notes, and monitor treatment outcomes.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setConsultationModalOpen(true)}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all duration-150 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Author Consultation Note</span>
            </button>
            <button
              onClick={() => onNavigate('patients')}
              className="px-4.5 py-2.5 bg-white/10 hover:bg-white/15 text-white border border-white/10 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all duration-150 cursor-pointer backdrop-blur-xs"
            >
              <Users className="w-4 h-4 text-blue-300" />
              <span>Patient Roster</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Visual Hierarchy Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5">
        {/* Spotlight Hero Card: Today's Clinical Queue (6 cols) */}
        <div
          onClick={() => onNavigate('appointments')}
          className="lg:col-span-6 bg-gradient-to-br from-white to-blue-50/40 rounded-3xl p-6 sm:p-7 border border-blue-200/90 shadow-xs hover:shadow-md hover:border-blue-400 transition-all duration-200 cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between pb-3 border-b border-blue-100/70">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-800">
              OUTPATIENT CLINIC QUEUE
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200/80">
              ON SCHEDULE
            </span>
          </div>

          <div className="py-4 space-y-3">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                03 Patients Queued
              </span>
              <span className="text-xs font-semibold text-blue-700">Today • 18 Sep 2026</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Next scheduled intake: <strong className="text-slate-900 font-bold">Aarav Sharma</strong> (10:30 AM • Cardiology Room 304). Pre-consultation diagnostic panel verified.
            </p>

            <div className="p-3 rounded-2xl bg-white border border-blue-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-slate-700 font-semibold">Consultation Room 304 Active</span>
              </div>
              <span className="text-blue-700 font-bold">Avg Slot: 20 Mins</span>
            </div>
          </div>

          <div className="pt-3 border-t border-blue-100/70 flex items-center justify-between text-xs">
            <span className="text-slate-400 text-[11px]">Department: Adult Cardiology & Diagnostics</span>
            <span className="font-bold text-blue-700 group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
              <span>Inspect Queue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

        {/* Metric 1: Total Patients */}
        <div
          onClick={() => onNavigate('patients')}
          className="lg:col-span-2 bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-200 cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              ASSIGNED CASELOAD
            </span>
            <div className="w-8.5 h-8.5 rounded-xl bg-teal-50 text-teal-600 border border-teal-100 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-black text-slate-900 tracking-tight">42</div>
            <div className="text-xs text-teal-700 font-semibold mt-1">Active Patients</div>
            <p className="text-[11px] text-slate-400 mt-1">Central Cloud synced</p>
          </div>
        </div>

        {/* Metric 2: Pending Reviews */}
        <div
          onClick={() => onNavigate('appointments')}
          className="lg:col-span-2 bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-200 cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              PENDING TRIAGE
            </span>
            <div className="w-8.5 h-8.5 rounded-xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-black text-slate-900 tracking-tight">01</div>
            <div className="text-xs text-amber-700 font-semibold mt-1">Awaiting Sign-off</div>
            <p className="text-[11px] text-slate-400 mt-1">Diagnostic panel review</p>
          </div>
        </div>

        {/* Metric 3: Records Created */}
        <div
          onClick={() => onNavigate('medical-records')}
          className="lg:col-span-2 bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-200 cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              SIGNED EHRs
            </span>
            <div className="w-8.5 h-8.5 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center">
              <FileCheck2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-black text-slate-900 tracking-tight">18</div>
            <div className="text-xs text-indigo-700 font-semibold mt-1">Committed to Cloud</div>
            <p className="text-[11px] text-slate-400 mt-1">Audit trail logged</p>
          </div>
        </div>
      </div>

      {/* 3. Quick Actions Bar */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
          Clinical Workflow Shortcuts
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={() => setConsultationModalOpen(true)}
            className="flex items-center gap-3 p-3.5 rounded-2xl bg-blue-50/70 hover:bg-blue-100/80 text-blue-900 font-semibold text-xs transition-colors cursor-pointer border border-blue-200/60 text-left"
          >
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold">Write Clinical Note</div>
              <div className="text-[10px] text-blue-700 font-normal">Diagnosis & Rx</div>
            </div>
          </button>

          <button
            onClick={() => onNavigate('patients')}
            className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-800 font-semibold text-xs transition-colors cursor-pointer border border-slate-200/70 text-left"
          >
            <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold">Patient Caseload</div>
              <div className="text-[10px] text-slate-500 font-normal">History & blood type</div>
            </div>
          </button>

          <button
            onClick={() => onNavigate('appointments')}
            className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-800 font-semibold text-xs transition-colors cursor-pointer border border-slate-200/70 text-left"
          >
            <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold">Daily Agenda</div>
              <div className="text-[10px] text-slate-500 font-normal">Slot schedule</div>
            </div>
          </button>

          <button
            onClick={() => onNavigate('monitoring')}
            className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-800 font-semibold text-xs transition-colors cursor-pointer border border-slate-200/70 text-left"
          >
            <div className="w-8 h-8 rounded-xl bg-slate-800 text-white flex items-center justify-center shrink-0 shadow-2xs">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold">Cloud Health</div>
              <div className="text-[10px] text-slate-500 font-normal">0.18ms latency</div>
            </div>
          </button>
        </div>
      </div>

      {/* 4. Today's Outpatient Timeline & Clinical Specialty Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Outpatient Agenda Timeline (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900 tracking-tight">
                  Outpatient Schedule & Triage Timeline
                </h3>
                <p className="text-xs text-slate-500">18 Sep 2026 • Real-time clinical queue status</p>
              </div>
              <button
                onClick={() => onNavigate('appointments')}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
              >
                All Slots →
              </button>
            </div>

            <div className="pt-3 space-y-3 relative before:absolute before:left-5 before:top-4 before:bottom-4 before:w-0.5 before:bg-slate-200/70">
              {todaySchedule.map((appt) => (
                <div
                  key={appt.id}
                  className="relative flex items-start gap-4 p-4 rounded-2xl bg-slate-50/80 border border-slate-200/70 hover:bg-white hover:border-blue-300 transition-all duration-150"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-mono text-xs font-bold flex items-center justify-center shrink-0 shadow-2xs z-10">
                    {appt.time.split(' ')[0]}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-xs font-bold text-slate-900 truncate">
                        {appt.patientName}
                      </h4>
                      <span
                        className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                          appt.status === 'confirmed'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}
                      >
                        {appt.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Specialty: <span className="font-semibold text-slate-700">{appt.department}</span> • {appt.notes || 'Routine follow-up evaluation'}
                    </p>
                  </div>

                  {appt.status === 'confirmed' && (
                    <button
                      onClick={() => handleMarkApptDone(appt.id)}
                      className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[11px] font-bold transition-colors cursor-pointer border border-emerald-200/70 shrink-0"
                    >
                      Complete Visit
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
            <span>Room 304 Consultations</span>
            <span className="text-blue-700 font-semibold">Triage Accuracy: 100%</span>
          </div>
        </div>

        {/* Clinical Breakdown Chart (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900 tracking-tight">
                  Consultation Breakdown
                </h3>
                <p className="text-xs text-slate-500">Distribution across active clinical caseload</p>
              </div>
              <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded font-bold">
                MONTHLY
              </span>
            </div>

            {/* Specialty Bars */}
            <div className="pt-3 space-y-3.5">
              {specialtyDistribution.map((sp) => (
                <div key={sp.name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800">{sp.name}</span>
                    <span className="font-mono text-slate-500 text-[11px]">
                      {sp.count} cases ({sp.pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${sp.color} transition-all duration-500`}
                      style={{ width: `${sp.pct}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-blue-50/60 border border-blue-100 text-xs">
            <span className="font-bold text-blue-950 block mb-0.5">Clinical Protocol Reminder</span>
            <p className="text-[11px] text-blue-900 leading-relaxed">
              Every authored diagnosis automatically populates the patient's personal vault and updates central audit telemetry.
            </p>
          </div>
        </div>
      </div>

      {/* 5. Active Patient Caseload & Recent Clinical Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Active Patient Roster Cards (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                Active Patients Caseload
              </h3>
              <p className="text-xs text-slate-500">Directly assigned for cardiac management</p>
            </div>
            <button
              onClick={() => onNavigate('patients')}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
            >
              Full Directory ({patients.length}) →
            </button>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {patients.slice(0, 4).map((p) => (
              <div
                key={p.id}
                onClick={() => setInspectPatient(p)}
                className="py-3.5 flex items-center justify-between hover:bg-slate-50/80 p-3 rounded-2xl cursor-pointer transition-colors duration-150"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 text-teal-300 flex items-center justify-center font-bold text-xs shadow-2xs">
                    {p.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-xs">{p.name}</div>
                    <div className="text-[11px] text-slate-500">
                      Age: {p.age} • Blood: <span className="font-semibold text-slate-800">{p.bloodGroup}</span> • {p.gender}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-mono text-slate-400 block">
                    Last: {p.lastVisit}
                  </span>
                  <span className="text-blue-600 font-bold text-[11px] hover:underline">
                    Inspect Chart →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Clinical Feed (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                Recent Clinical Activity
              </h3>
              <p className="text-xs text-slate-500">Electronic health record events</p>
            </div>
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
          </div>

          <div className="divide-y divide-slate-100">
            {clinicalActivity.map((act) => (
              <div key={act.id} className="py-3.5 flex items-start gap-3">
                <div className="w-8.5 h-8.5 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                  <ClipboardList className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-xs font-bold text-slate-900 truncate">{act.title}</h4>
                    <span className="text-[10px] font-mono text-slate-400 shrink-0">{act.time}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{act.desc}</p>
                  <span
                    className={`inline-block mt-1.5 px-2 py-0.5 rounded text-[9px] font-bold uppercase border ${act.badgeClass}`}
                  >
                    {act.badge}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 6. Author Consultation Modal */}
      {consultationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Author Consultation Record</h3>
                  <p className="text-xs text-slate-500">Commits directly to central cloud Firestore</p>
                </div>
              </div>
              <button
                onClick={() => setConsultationModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveConsultation} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Select Patient</label>
                <select
                  value={selectedPatientId}
                  onChange={(e) => setSelectedPatientId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} (ID: {p.id} • Age: {p.age})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Record Type</label>
                  <select
                    value={recordType}
                    onChange={(e) => setRecordType(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Cardiology Review">Cardiology Review</option>
                    <option value="General Consultation">General Consultation</option>
                    <option value="Diagnostic Report">Diagnostic Report</option>
                    <option value="Follow-up">Follow-up</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Follow-up Date</label>
                  <input
                    type="date"
                    value={followUpDate}
                    onChange={(e) => setFollowUpDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Diagnosis</label>
                <input
                  type="text"
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  placeholder="e.g. Mild Hypertension with Sinus Bradycardia"
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Clinical Consultation Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  placeholder="Detail symptoms, examination observations, vitals, and cardiac rhythm..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                ></textarea>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Prescription & Regimen</label>
                <input
                  type="text"
                  value={prescription}
                  onChange={(e) => setPrescription(e.target.value)}
                  placeholder="e.g. Rosuvastatin 10mg once daily at bedtime. Limit sodium."
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setConsultationModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingRecord}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{savingRecord ? 'Committing...' : 'Sign & Save to Cloud'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. Patient Inspection Modal */}
      {inspectPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">
                Clinical Patient Chart
              </span>
              <button
                onClick={() => setInspectPatient(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70">
                <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white font-black flex items-center justify-center text-sm shadow-2xs">
                  {inspectPatient.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900">{inspectPatient.name}</h4>
                  <p className="text-slate-500 text-xs">
                    Patient ID: {inspectPatient.id} • Age: {inspectPatient.age} • {inspectPatient.gender}
                  </p>
                  <p className="text-blue-700 font-semibold mt-0.5">
                    Blood Group: {inspectPatient.bloodGroup}
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-slate-200/80 space-y-1">
                <span className="font-bold text-slate-800 uppercase tracking-wider text-[10px]">
                  Medical History & Chronic Indicators
                </span>
                <p className="text-slate-600">{inspectPatient.medicalHistory}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-slate-200/80 space-y-1">
                <span className="font-bold text-slate-800 uppercase tracking-wider text-[10px]">
                  Emergency Contact
                </span>
                <p className="text-slate-600 font-mono">{inspectPatient.emergencyContact}</p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => {
                  setInspectPatient(null);
                  setSelectedPatientId(inspectPatient.id);
                  setConsultationModalOpen(true);
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Write Clinical Note for {inspectPatient.name.split(' ')[0]}</span>
              </button>
              <button
                onClick={() => setInspectPatient(null)}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
