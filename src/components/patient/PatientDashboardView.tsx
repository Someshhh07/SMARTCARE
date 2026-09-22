import React, { useState, useEffect } from 'react';
import {
  Calendar,
  FileText,
  User,
  Stethoscope,
  Clock,
  ArrowRight,
  Plus,
  Activity,
  FileCheck2,
  FolderLock,
  ChevronRight,
  CheckCircle2,
  Heart,
  ShieldCheck,
  AlertCircle,
  Download,
  Share2,
  Sparkles,
  MapPin,
  Pill,
  TrendingUp,
  FileSignature,
  Eye,
  Lock,
} from 'lucide-react';
import { Appointment, MedicalRecord, Doctor } from '../../types';
import { api } from '../../services/apiService';
import { useAuth } from '../../context/AuthContext';
import { BookAppointmentModal } from '../appointments/BookAppointmentModal';

interface PatientDashboardViewProps {
  onNavigate: (nav: string) => void;
}

export const PatientDashboardView: React.FC<PatientDashboardViewProps> = ({ onNavigate }) => {
  const { user, showToast } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookModalOpen, setBookModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [appts, recs, docs] = await Promise.all([
        api.getAppointments(),
        api.getMedicalRecords(),
        api.getDoctors(),
      ]);
      setAppointments(appts);
      setRecords(recs);
      setDoctors(docs);
    } catch (err) {
      console.error('Failed to load patient dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  const upcomingAppts = appointments.filter((a) => a.status === 'confirmed');
  const primaryUpcoming = upcomingAppts[0] || null;

  // 7-day vitals data for patient wellness tracking
  const vitalsLog = [
    { day: 'Mon', date: 'Sep 12', hr: 72, bpSys: 118, bpDia: 78, status: 'Optimal' },
    { day: 'Tue', date: 'Sep 13', hr: 70, bpSys: 120, bpDia: 80, status: 'Normal' },
    { day: 'Wed', date: 'Sep 14', hr: 74, bpSys: 122, bpDia: 81, status: 'Normal' },
    { day: 'Thu', date: 'Sep 15', hr: 69, bpSys: 119, bpDia: 79, status: 'Optimal' },
    { day: 'Fri', date: 'Sep 16', hr: 71, bpSys: 117, bpDia: 77, status: 'Optimal' },
    { day: 'Sat', date: 'Sep 17', hr: 73, bpSys: 121, bpDia: 80, status: 'Normal' },
    { day: 'Sun', date: 'Sep 18', hr: 70, bpSys: 118, bpDia: 78, status: 'Optimal' },
  ];

  // Recent patient activities
  const recentActivities = [
    {
      id: 'act-1',
      title: 'Prescription Refreshed',
      desc: 'Dr. Priya Rao updated medication guidelines for Rosuvastatin 10mg.',
      time: '2 hours ago',
      icon: Pill,
      badge: 'Prescription',
      badgeColor: 'bg-teal-50 text-teal-700 border-teal-200/70',
    },
    {
      id: 'act-2',
      title: 'Cardiology Visit Confirmed',
      desc: 'Outpatient consultation with Dr. Priya Rao confirmed for Room 304.',
      time: 'Yesterday at 04:30 PM',
      icon: Calendar,
      badge: 'Appointment',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200/70',
    },
    {
      id: 'act-3',
      title: 'Digital Diagnostic Report Stored',
      desc: 'Resting 12-Lead ECG trace report encrypted and saved into Cloud Vault.',
      time: 'Sep 14, 2026',
      icon: FileSignature,
      badge: 'EHR Encrypted',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200/70',
    },
    {
      id: 'act-4',
      title: 'Blood Chemistry Panel Verified',
      desc: 'Lipid profile and fasting glucose values flagged within normal target.',
      time: 'Sep 10, 2026',
      icon: Activity,
      badge: 'Lab Result',
      badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200/70',
    },
  ];

  return (
    <div id="patient-dashboard-view" className="space-y-8 animate-in fade-in duration-200">
      {/* 1. Patient Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-[#0A192F] to-slate-900 p-6 sm:p-8 rounded-3xl text-white shadow-md border border-slate-800">
        <div className="absolute -right-12 -top-12 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute right-40 -bottom-20 w-60 h-60 bg-blue-500/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-teal-500/15 text-teal-300 border border-teal-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse"></span>
              <span>PATIENT HEALTH VAULT • ZERO-KNOWLEDGE ENCRYPTION</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Good day, {user?.name ? user.name.split(' ')[0] : 'Aarav'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-normal max-w-xl leading-relaxed">
              Your personal electronic healthcare record, upcoming outpatient agenda, and audited diagnostic summaries are synchronized with the central cloud.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setBookModalOpen(true)}
              className="px-5 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all duration-150 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Book Appointment</span>
            </button>
            <button
              onClick={() => onNavigate('medical-records')}
              className="px-4.5 py-2.5 bg-white/10 hover:bg-white/15 text-white border border-white/10 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all duration-150 cursor-pointer backdrop-blur-xs"
            >
              <FileText className="w-4 h-4 text-teal-300" />
              <span>My Records</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Dashboard Cards with Visual Hierarchy (Small category, large metric, supporting text, subtle hover) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5">
        {/* Hero Spotlight Card (Spans 6 cols on lg) */}
        <div
          onClick={() => onNavigate('appointments')}
          className="lg:col-span-6 bg-gradient-to-br from-white to-teal-50/30 rounded-3xl p-6 sm:p-7 border border-teal-200/80 shadow-xs hover:shadow-md hover:border-teal-400/80 transition-all duration-200 cursor-pointer relative group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between pb-3 border-b border-teal-100/60">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700">
                PRIMARY OUTPATIENT CONSULTATION
              </span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100/80 text-emerald-800 border border-emerald-300/60">
              CONFIRMED
            </span>
          </div>

          <div className="py-4 space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {primaryUpcoming ? primaryUpcoming.doctorName : 'Dr. Priya Rao'}
                </div>
                <div className="text-xs font-semibold text-teal-800 flex items-center gap-1.5 mt-0.5">
                  <Stethoscope className="w-3.5 h-3.5 text-teal-600" />
                  <span>
                    Senior Consultant • {primaryUpcoming ? primaryUpcoming.department : 'Cardiology'}
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-teal-500/15 text-teal-700 border border-teal-200 flex items-center justify-center font-black text-sm shrink-0">
                SC
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
              <div className="p-3 rounded-2xl bg-white border border-slate-200/70">
                <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">
                  Date & Timing
                </span>
                <span className="font-bold text-slate-900 mt-1 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-teal-600" />
                  {primaryUpcoming ? `${primaryUpcoming.date} • ${primaryUpcoming.time}` : '18 Sep 2026 • 10:30 AM'}
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-white border border-slate-200/70">
                <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">
                  Location
                </span>
                <span className="font-bold text-slate-900 mt-1 flex items-center gap-1.5 truncate">
                  <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  Cardiology Wing Rm 304
                </span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-teal-100/60 flex items-center justify-between text-xs">
            <span className="text-slate-500 text-[11px] font-medium">
              Supporting instructions: Fasting lipid panel ready
            </span>
            <span className="font-bold text-teal-700 group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
              <span>View Appointment Details</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

        {/* Supporting Metric Card 1 (Upcoming Visits) */}
        <div
          onClick={() => onNavigate('appointments')}
          className="lg:col-span-2 bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-200 cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              UPCOMING VISITS
            </span>
            <div className="w-8.5 h-8.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-black text-slate-900 tracking-tight">
              {String(upcomingAppts.length).padStart(2, '0')}
            </div>
            <div className="text-xs text-blue-600 font-semibold mt-1">Confirmed with Clinic</div>
            <p className="text-[11px] text-slate-400 mt-1">Next: Cardio Consultation</p>
          </div>
        </div>

        {/* Supporting Metric Card 2 (Medical Records) */}
        <div
          onClick={() => onNavigate('medical-records')}
          className="lg:col-span-2 bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-200 cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              HEALTH RECORDS
            </span>
            <div className="w-8.5 h-8.5 rounded-xl bg-teal-50 text-teal-600 border border-teal-100 flex items-center justify-center">
              <FileCheck2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-black text-slate-900 tracking-tight">08</div>
            <div className="text-xs text-teal-600 font-semibold mt-1">Signed Summaries</div>
            <p className="text-[11px] text-slate-400 mt-1">All doctor consults synced</p>
          </div>
        </div>

        {/* Supporting Metric Card 3 (Storage Vault) */}
        <div
          onClick={() => onNavigate('architecture-view')}
          className="lg:col-span-2 bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-200 cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              CLOUD STORAGE
            </span>
            <div className="w-8.5 h-8.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center">
              <FolderLock className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-black text-slate-900 tracking-tight">12 Files</div>
            <div className="text-xs text-emerald-600 font-semibold mt-1">AES-256 Vault</div>
            <p className="text-[11px] text-slate-400 mt-1">ECG, blood lab reports</p>
          </div>
        </div>
      </div>

      {/* 3. Multi-Step Booking Stepper Banner Card */}
      <div className="bg-gradient-to-r from-teal-900 via-[#0A2540] to-slate-900 rounded-3xl p-6 sm:p-7 border border-teal-500/30 text-white shadow-lg relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-teal-400/20 text-teal-300 border border-teal-400/30">
              <Sparkles className="w-3 h-3 text-teal-300" />
              <span>5-Step Self-Service Scheduling Engine</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Multi-Step Outpatient Appointment Booking
            </h3>
            <p className="text-xs sm:text-sm text-slate-300">
              Schedule specialist consultations with real-time slot conflict resolution and verified doctor credential matching.
            </p>

            {/* Stepper Pill Progression */}
            <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
              {[
                { num: '01', label: 'Department' },
                { num: '02', label: 'Doctor' },
                { num: '03', label: 'Date' },
                { num: '04', label: 'Time' },
                { num: '05', label: 'Confirm' },
              ].map((step, idx) => (
                <div
                  key={step.num}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 border border-white/10 text-slate-200 text-xs font-semibold backdrop-blur-xs"
                >
                  <span className="text-teal-400 font-bold font-mono text-[11px]">{step.num}</span>
                  <span>{step.label}</span>
                  {idx < 4 && <ChevronRight className="w-3 h-3 text-slate-400 ml-0.5" />}
                </div>
              ))}
            </div>
          </div>

          <div className="shrink-0">
            <button
              onClick={() => setBookModalOpen(true)}
              className="px-6 py-3.5 bg-gradient-to-r from-teal-400 to-cyan-400 hover:from-teal-300 hover:to-cyan-300 text-slate-950 font-extrabold rounded-2xl text-xs sm:text-sm flex items-center gap-2 shadow-xl shadow-teal-500/20 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <Calendar className="w-4 h-4 stroke-[2.5]" />
              <span>Launch Booking Stepper</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </div>

      {/* 4. Quick Actions Row */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
          Patient Quick Actions
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={() => setBookModalOpen(true)}
            className="flex items-center gap-3 p-3.5 rounded-2xl bg-teal-50/60 hover:bg-teal-100/70 text-teal-900 font-semibold text-xs transition-colors cursor-pointer border border-teal-200/60 text-left"
          >
            <div className="w-8 h-8 rounded-xl bg-teal-500 text-white flex items-center justify-center shrink-0 shadow-2xs">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold">Book Visit</div>
              <div className="text-[10px] text-teal-700 font-normal">Choose doctor & time</div>
            </div>
          </button>

          <button
            onClick={() => onNavigate('medical-records')}
            className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100/80 text-slate-800 font-semibold text-xs transition-colors cursor-pointer border border-slate-200/70 text-left"
          >
            <div className="w-8 h-8 rounded-xl bg-slate-800 text-white flex items-center justify-center shrink-0 shadow-2xs">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold">View EHR</div>
              <div className="text-[10px] text-slate-500 font-normal">Consultation notes</div>
            </div>
          </button>

          <button
            onClick={() => {
              showToast('Exporting encrypted health history package (PDF)...');
            }}
            className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100/80 text-slate-800 font-semibold text-xs transition-colors cursor-pointer border border-slate-200/70 text-left"
          >
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold">Export Summary</div>
              <div className="text-[10px] text-slate-500 font-normal">Encrypted PDF package</div>
            </div>
          </button>

          <button
            onClick={() => onNavigate('architecture-view')}
            className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100/80 text-slate-800 font-semibold text-xs transition-colors cursor-pointer border border-slate-200/70 text-left"
          >
            <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold">Cloud Privacy</div>
              <div className="text-[10px] text-slate-500 font-normal">RBAC security gates</div>
            </div>
          </button>
        </div>
      </div>

      {/* 4. Appointment Timeline & Health Metrics / Vitals Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Appointment Timeline (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900 tracking-tight">
                  Outpatient Appointment Timeline
                </h3>
                <p className="text-xs text-slate-500">
                  Chronological progression of your current clinical care episode.
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold uppercase tracking-wider">
                Active Episode
              </span>
            </div>

            {/* Step-by-Step Clinical Timeline */}
            <div className="pt-4 space-y-6 relative before:absolute before:left-5.5 before:top-6 before:bottom-6 before:w-0.5 before:bg-slate-200/80">
              {/* Step 1: Pre-Consultation */}
              <div className="relative flex items-start gap-4">
                <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center shrink-0 z-10 shadow-2xs">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="flex-1 p-4 rounded-2xl bg-slate-50/70 border border-slate-200/60">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">1. Pre-Consultation Labs & History</span>
                    <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold border border-emerald-200/60">
                      COMPLETED
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Fasting lipid profile, HbA1c, and resting 12-lead ECG submitted into Cloud Vault for Dr. Rao's advance review.
                  </p>
                  <span className="text-[10px] text-slate-400 mt-1.5 block font-mono">Completed: 14 Sep 2026</span>
                </div>
              </div>

              {/* Step 2: Scheduled Clinical Visit (In Focus) */}
              <div className="relative flex items-start gap-4">
                <div className="w-11 h-11 rounded-2xl bg-teal-500 text-white flex items-center justify-center shrink-0 z-10 shadow-md ring-4 ring-teal-100">
                  <Calendar className="w-5 h-5" />
                </div>
                <div className="flex-1 p-4 rounded-2xl bg-teal-50/50 border border-teal-200/80">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-teal-950">2. In-Person Cardiology Consultation</span>
                    <span className="text-[10px] font-mono text-teal-800 bg-teal-100 px-2 py-0.5 rounded font-bold border border-teal-300/60">
                      SCHEDULED
                    </span>
                  </div>
                  <p className="text-xs text-teal-900 mt-1 leading-relaxed">
                    Consultation with Dr. Priya Rao at Apollo Heart Center Room 304. Please arrive 10 minutes prior for vitals check.
                  </p>
                  <div className="mt-2 flex items-center gap-3 text-[11px] font-bold text-teal-800">
                    <span>Date: 18 Sep 2026</span>
                    <span>•</span>
                    <span>Time: 10:30 AM</span>
                  </div>
                </div>
              </div>

              {/* Step 3: Post-Visit Consultation Synthesis */}
              <div className="relative flex items-start gap-4">
                <div className="w-11 h-11 rounded-2xl bg-slate-100 text-slate-400 border border-slate-200 flex items-center justify-center shrink-0 z-10">
                  <Clock className="w-5 h-5" />
                </div>
                <div className="flex-1 p-4 rounded-2xl bg-slate-50/50 border border-slate-200/50">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">3. Finalized EHR Summary & Prescription</span>
                    <span className="text-[10px] font-mono text-slate-500 bg-slate-200/70 px-2 py-0.5 rounded font-medium">
                      PENDING VISIT
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Doctor will author digital diagnosis, treatment notes, and digital prescription which will be immediately visible here.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-400">Care Episode ID: CEP-2026-089</span>
            <button
              onClick={() => onNavigate('appointments')}
              className="text-teal-700 hover:text-teal-800 font-bold flex items-center gap-1 cursor-pointer"
            >
              <span>Manage Appointments</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Patient Vitals & Health Trend (Useful Chart) (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900 tracking-tight">
                  7-Day Health Trend
                </h3>
                <p className="text-xs text-slate-500">Resting Heart Rate & Blood Pressure</p>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/70 flex items-center gap-1">
                <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
                <span>Normal</span>
              </span>
            </div>

            {/* Interactive Trend Visualizer */}
            <div className="pt-4 space-y-3">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-2xl font-black text-slate-900">70 bpm</span>
                  <span className="text-xs text-slate-500 ml-1.5">Resting HR (Target 60-80)</span>
                </div>
                <span className="text-xs font-mono font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200/60">
                  118/78 mmHg
                </span>
              </div>

              {/* Responsive Bar Graphic for 7 days */}
              <div className="h-32 pt-4 flex items-end justify-between gap-2 border-b border-slate-100 pb-2">
                {vitalsLog.map((item) => (
                  <div key={item.day} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                    <div className="text-[10px] font-mono text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                      {item.hr}
                    </div>
                    <div
                      className="w-full max-w-6 rounded-t-lg bg-teal-500/80 group-hover:bg-teal-500 transition-all duration-200"
                      style={{ height: `${(item.hr / 100) * 100}%` }}
                    ></div>
                    <span className="text-[11px] font-bold text-slate-600">{item.day}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2 text-xs text-slate-600 space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">Blood Pressure Baseline:</span>
                  <span className="font-semibold text-slate-800">118/78 mmHg (Systolic optimal)</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">Diagnostic Status:</span>
                  <span className="font-semibold text-emerald-700">Normal Sinus Rhythm</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-teal-50/60 border border-teal-100 text-xs">
            <span className="font-bold text-teal-950 block mb-0.5">Care Team Recommendation</span>
            <p className="text-[11px] text-teal-800 leading-relaxed">
              Continue regular light aerobic exercise and daily blood pressure recording before scheduled appointment.
            </p>
          </div>
        </div>
      </div>

      {/* 5. Medical Record Cards & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Medical Record Cards (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                Digital Medical Records & Consultations
              </h3>
              <p className="text-xs text-slate-500">
                Verified electronic medical documentation committed to central cloud store.
              </p>
            </div>
            <button
              onClick={() => onNavigate('medical-records')}
              className="text-xs font-bold text-teal-700 hover:text-teal-800 cursor-pointer"
            >
              All Records ({records.length}) →
            </button>
          </div>

          {/* Record Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            {records.slice(0, 4).map((rec) => (
              <div
                key={rec.id}
                onClick={() => setSelectedRecord(rec)}
                className="p-4 rounded-2xl bg-slate-50/80 hover:bg-white border border-slate-200/80 hover:border-teal-300 hover:shadow-sm transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-3 group"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200/60">
                      {rec.recordType}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">{rec.date}</span>
                  </div>

                  <h4 className="font-bold text-sm text-slate-900 group-hover:text-teal-900 transition-colors leading-snug">
                    {rec.diagnosis}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    {rec.doctorName} • <span className="font-medium text-slate-700">{rec.department}</span>
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-200/60 text-xs">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                    Prescription / Guideline
                  </span>
                  <p className="text-[11px] text-slate-600 line-clamp-1 italic">
                    "{rec.prescription}"
                  </p>
                  <div className="mt-2 text-right">
                    <span className="text-[11px] font-bold text-teal-700 group-hover:underline">
                      Inspect Details →
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity Feed (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">Recent Activity</h3>
              <p className="text-xs text-slate-500">Live clinical actions & cloud sync events.</p>
            </div>
            <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span>
          </div>

          <div className="divide-y divide-slate-100">
            {recentActivities.map((act) => {
              const Icon = act.icon;
              return (
                <div key={act.id} className="py-3.5 flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Icon className="w-4 h-4 text-teal-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-xs font-bold text-slate-900 truncate">{act.title}</h4>
                      <span className="text-[10px] font-mono text-slate-400 shrink-0">{act.time}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{act.desc}</p>
                    <span
                      className={`inline-block mt-1.5 px-2 py-0.5 rounded text-[9px] font-bold uppercase border ${act.badgeColor}`}
                    >
                      {act.badge}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Detail Modal for Selected Medical Record */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200/70">
                {selectedRecord.recordType}
              </span>
              <button
                onClick={() => setSelectedRecord(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900">{selectedRecord.diagnosis}</h3>
                <p className="text-slate-500 text-xs mt-0.5">
                  Attending Physician: <span className="font-bold text-slate-800">{selectedRecord.doctorName}</span> • {selectedRecord.department}
                </p>
                <span className="text-[10px] font-mono text-slate-400 block mt-1">Date: {selectedRecord.date}</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
                <span className="font-bold text-slate-800 uppercase tracking-wider text-[10px] block">
                  Consultation Notes
                </span>
                <p className="text-slate-700 leading-relaxed">{selectedRecord.consultationNotes}</p>
              </div>

              <div className="p-4 rounded-2xl bg-teal-50/60 border border-teal-100 space-y-1.5">
                <span className="font-bold text-teal-950 uppercase tracking-wider text-[10px] block">
                  Prescription & Regimen
                </span>
                <p className="text-teal-900 font-medium leading-relaxed">{selectedRecord.prescription}</p>
              </div>

              {selectedRecord.followUpDate && (
                <div className="text-slate-600 flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/60">
                  <span>Recommended Follow-up:</span>
                  <span className="font-bold text-slate-900">{selectedRecord.followUpDate}</span>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end">
              <button
                onClick={() => setSelectedRecord(null)}
                className="px-4.5 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 cursor-pointer"
              >
                Close Record
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Book Appointment Modal */}
      <BookAppointmentModal
        isOpen={bookModalOpen}
        onClose={() => setBookModalOpen(false)}
        onSuccess={() => {
          loadData();
        }}
      />
    </div>
  );
};
