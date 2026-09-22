import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  CheckCircle2,
  Calendar,
  Clock,
  User,
  Stethoscope,
  ArrowRight,
  ArrowLeft,
  Star,
  Check,
  Building2,
  HeartPulse,
  Sparkles,
  Brain,
  Activity,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Copy,
  FileText,
  CalendarCheck,
  CreditCard,
  MapPin,
  CheckCheck,
  Info,
} from 'lucide-react';
import { Doctor } from '../../types';
import { api } from '../../services/apiService';
import { useAuth } from '../../context/AuthContext';

interface BookAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface DepartmentInfo {
  id: string;
  name: string;
  shortDesc: string;
  fullDesc: string;
  icon: React.ElementType;
  accentColor: string;
  badgeBg: string;
  location: string;
}

const DEPARTMENTS: DepartmentInfo[] = [
  {
    id: 'Cardiology',
    name: 'Cardiology',
    shortDesc: 'Heart care, ECG analysis & hypertension',
    fullDesc: 'Advanced cardiovascular diagnostics, arrhythmia screening, lipid management, and preventive heart health.',
    icon: HeartPulse,
    accentColor: 'text-rose-600 bg-rose-50 border-rose-200',
    badgeBg: 'bg-rose-100/70 text-rose-800',
    location: 'Tower A • Suite 301',
  },
  {
    id: 'General Medicine',
    name: 'General Medicine',
    shortDesc: 'Comprehensive health & preventive checkups',
    fullDesc: 'Primary adult care, acute illness assessment, chronic condition surveillance, and holistic wellness.',
    icon: Stethoscope,
    accentColor: 'text-blue-600 bg-blue-50 border-blue-200',
    badgeBg: 'bg-blue-100/70 text-blue-800',
    location: 'Main Block • Ground Floor',
  },
  {
    id: 'Dermatology',
    name: 'Dermatology',
    shortDesc: 'Skin health, allergies & clinical dermatology',
    fullDesc: 'Clinical dermatological evaluations, allergic dermatitis, lesion mapping, and specialized topical care.',
    icon: Sparkles,
    accentColor: 'text-amber-600 bg-amber-50 border-amber-200',
    badgeBg: 'bg-amber-100/70 text-amber-800',
    location: 'Specialty Wing • Floor 2',
  },
  {
    id: 'Neurology',
    name: 'Neurology',
    shortDesc: 'Headache reviews, nerve & cognitive care',
    fullDesc: 'Migraine management, peripheral neuropathies, spine evaluations, and comprehensive neurological health.',
    icon: Brain,
    accentColor: 'text-indigo-600 bg-indigo-50 border-indigo-200',
    badgeBg: 'bg-indigo-100/70 text-indigo-800',
    location: 'Neuro Sciences Wing • Floor 4',
  },
  {
    id: 'Orthopedics',
    name: 'Orthopedics',
    shortDesc: 'Joint health, bone density & mobility care',
    fullDesc: 'Musculoskeletal consultations, sports injury recovery, joint preservation, and arthritis management.',
    icon: Activity,
    accentColor: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    badgeBg: 'bg-emerald-100/70 text-emerald-800',
    location: 'Orthopedic Center • Wing C',
  },
];

const TIME_SLOT_GROUPS = [
  {
    category: 'Morning Consultations',
    slots: [
      { time: '09:00 AM', tag: 'Fast Filling' },
      { time: '09:45 AM', tag: 'Available' },
      { time: '10:30 AM', tag: 'Popular' },
      { time: '11:15 AM', tag: 'Available' },
    ],
  },
  {
    category: 'Afternoon Consultations',
    slots: [
      { time: '02:00 PM', tag: 'Available' },
      { time: '02:45 PM', tag: 'Available' },
      { time: '03:30 PM', tag: 'Popular' },
      { time: '04:15 PM', tag: 'Available' },
    ],
  },
  {
    category: 'Evening Consultations',
    slots: [
      { time: '05:00 PM', tag: 'Available' },
      { time: '05:45 PM', tag: 'Last Slot' },
    ],
  },
];

const STEPS = [
  { number: '01', title: 'Department', shortLabel: 'Dept' },
  { number: '02', title: 'Doctor', shortLabel: 'Doctor' },
  { number: '03', title: 'Date', shortLabel: 'Date' },
  { number: '04', title: 'Time', shortLabel: 'Time' },
  { number: '05', title: 'Confirm', shortLabel: 'Confirm' },
];

const COMMON_SYMPTOM_TAGS = [
  'Routine Health Checkup',
  'Follow-up Consultation',
  'Chest Heaviness / Palpitations',
  'Blood Pressure Review',
  'Skin Rash / Allergy',
  'Joint Pain & Stiffness',
  'Persistent Headache',
  'Prescription Refill',
];

export const BookAppointmentModal: React.FC<BookAppointmentModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { user, showToast } = useAuth();
  const [step, setStep] = useState<number>(1);
  const [direction, setDirection] = useState<number>(1); // 1 = forward, -1 = backward
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loadingDoctors, setLoadingDoctors] = useState<boolean>(false);

  // Form State
  const [selectedDept, setSelectedDept] = useState<string>('Cardiology');
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>('');
  const [doctorDeptFilter, setDoctorDeptFilter] = useState<string>('all');
  const [selectedDate, setSelectedDate] = useState<string>('2026-09-24');
  const [selectedTime, setSelectedTime] = useState<string>('10:30 AM');
  const [visitNotes, setVisitNotes] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [confirmedData, setConfirmedData] = useState<any>(null);
  const [copiedId, setCopiedId] = useState<boolean>(false);

  // Calendar navigation state (defaults to September 2026)
  const [calendarMonth, setCalendarMonth] = useState<Date>(new Date(2026, 8, 1)); // 8 is September

  useEffect(() => {
    if (isOpen) {
      loadDoctors();
      setStep(1);
      setDirection(1);
      setConfirmedData(null);
      setCopiedId(false);
      setCalendarMonth(new Date(2026, 8, 1));
    }
  }, [isOpen]);

  const loadDoctors = async () => {
    setLoadingDoctors(true);
    try {
      const data = await api.getDoctors();
      setDoctors(data);
      if (data.length > 0 && !selectedDoctorId) {
        const cardioDoc = data.find((d) => d.specialization?.toLowerCase().includes('cardio') || d.department?.toLowerCase().includes('cardio'));
        setSelectedDoctorId(cardioDoc ? cardioDoc.id : data[0].id);
      }
    } catch (err) {
      console.error('Failed to load doctors:', err);
    } finally {
      setLoadingDoctors(false);
    }
  };

  // Doctors matching currently selected department or filter
  const departmentFilteredDoctors = useMemo(() => {
    if (!selectedDept) return doctors;
    const cleanDept = selectedDept.toLowerCase();
    const matched = doctors.filter(
      (d) =>
        d.department?.toLowerCase().includes(cleanDept) ||
        d.specialization?.toLowerCase().includes(cleanDept)
    );
    return matched.length > 0 ? matched : doctors;
  }, [doctors, selectedDept]);

  const displayedDoctors = useMemo(() => {
    if (doctorDeptFilter === 'all') {
      return departmentFilteredDoctors;
    }
    const clean = doctorDeptFilter.toLowerCase();
    return doctors.filter(
      (d) =>
        d.department?.toLowerCase().includes(clean) ||
        d.specialization?.toLowerCase().includes(clean)
    );
  }, [doctors, departmentFilteredDoctors, doctorDeptFilter]);

  const selectedDoctor = useMemo(() => {
    return doctors.find((d) => d.id === selectedDoctorId) || displayedDoctors[0] || doctors[0];
  }, [doctors, selectedDoctorId, displayedDoctors]);

  const selectedDepartmentInfo = useMemo(() => {
    return DEPARTMENTS.find((d) => d.id === selectedDept) || DEPARTMENTS[0];
  }, [selectedDept]);

  // Navigate between steps with smooth direction
  const goToStep = (targetStep: number) => {
    if (targetStep < 1 || targetStep > 5) return;
    setDirection(targetStep > step ? 1 : -1);
    setStep(targetStep);
  };

  const handleNext = () => {
    if (step === 1 && !selectedDept) return;
    if (step === 2 && !selectedDoctorId && displayedDoctors.length > 0) {
      setSelectedDoctorId(displayedDoctors[0].id);
    }
    if (step < 5) {
      setDirection(1);
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setDirection(-1);
      setStep(step - 1);
    }
  };

  const handleSelectDepartment = (deptId: string) => {
    setSelectedDept(deptId);
    setDoctorDeptFilter('all');
    // Auto-select best matching doctor for this department
    const clean = deptId.toLowerCase();
    const match = doctors.find(
      (d) =>
        d.department?.toLowerCase().includes(clean) ||
        d.specialization?.toLowerCase().includes(clean)
    );
    if (match) {
      setSelectedDoctorId(match.id);
    }
  };

  const handleConfirmBooking = async () => {
    setSubmitting(true);
    try {
      const docToBook = selectedDoctor || doctors[0];
      const appt = await api.createAppointment({
        doctorId: docToBook ? docToBook.id : 'doc-1',
        department: selectedDept,
        date: selectedDate,
        time: selectedTime,
        notes: visitNotes || 'Routine consultation and outpatient health review.',
        patientName: user?.name || 'Aarav Kumar',
      });

      setConfirmedData(appt);
      setStep(6); // Success confirmation view
      showToast(`Appointment confirmed with ${appt.doctorName}!`);
      onSuccess(); // Triggers background reload of appointments
    } catch (err: any) {
      console.error('Booking failed:', err);
      alert(err.message || 'Failed to book appointment. Please verify connection and retry.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopyAppointmentId = () => {
    if (!confirmedData?.id) return;
    navigator.clipboard.writeText(confirmedData.id);
    setCopiedId(true);
    showToast(`Appointment ID ${confirmedData.id} copied!`);
    setTimeout(() => setCopiedId(false), 2500);
  };

  // Calendar Helpers
  const year = calendarMonth.getFullYear();
  const month = calendarMonth.getMonth();
  const monthName = calendarMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const firstDayOfWeek = new Date(year, month, 1).getDay(); // 0 = Sun, 1 = Mon ...
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const handlePrevMonth = () => {
    // Only allow back to current simulated month (September 2026)
    if (year === 2026 && month <= 8) return;
    setCalendarMonth(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCalendarMonth(new Date(year, month + 1, 1));
  };

  // Format date helper: YYYY-MM-DD
  const formatIsoDate = (y: number, m: number, d: number) => {
    const mm = String(m + 1).padStart(2, '0');
    const dd = String(d).padStart(2, '0');
    return `${y}-${mm}-${dd}`;
  };

  // Human readable date helper
  const formatFriendlyDate = (dateStr: string) => {
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
        return d.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' });
      }
    } catch {
      // fallback
    }
    return dateStr;
  };

  if (!isOpen) return null;

  return (
    <div
      id="book-appointment-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-200"
    >
      <div
        id="book-appointment-modal-container"
        className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200/90 overflow-hidden flex flex-col max-h-[92vh] transition-all"
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/90 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <CalendarCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                  Cloud Consultation Engine
                </span>
                <span className="text-[11px] text-slate-400 font-medium">Step {Math.min(step, 5)} of 05</span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight mt-0.5">
                {step === 6 ? 'Booking Confirmation' : 'Schedule Clinical Consultation'}
              </h3>
            </div>
          </div>

          <button
            id="close-booking-modal-btn"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
            title="Close appointment modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Visual Progress Indicator (01 Department -> 02 Doctor -> 03 Date -> 04 Time -> 05 Confirm) */}
        {step <= 5 && (
          <div id="booking-progress-indicator" className="px-6 pt-3.5 pb-3 bg-white border-b border-slate-100 shrink-0">
            {/* Steps Row */}
            <div className="grid grid-cols-5 gap-1 sm:gap-2">
              {STEPS.map((s, idx) => {
                const stepNum = idx + 1;
                const isCompleted = step > stepNum;
                const isCurrent = step === stepNum;
                const isUpcoming = step < stepNum;

                return (
                  <button
                    key={s.number}
                    id={`booking-step-btn-${s.number}`}
                    type="button"
                    disabled={isUpcoming}
                    onClick={() => goToStep(stepNum)}
                    className={`group text-left py-1.5 px-2 rounded-xl transition-all duration-150 flex flex-col ${
                      isCompleted
                        ? 'cursor-pointer hover:bg-slate-50'
                        : isCurrent
                        ? 'cursor-default'
                        : 'cursor-not-allowed opacity-45'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center shrink-0 transition-colors ${
                          isCompleted
                            ? 'bg-emerald-600 text-white'
                            : isCurrent
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {isCompleted ? <Check className="w-3 h-3 stroke-[3]" /> : s.number}
                      </span>
                      <span
                        className={`text-xs font-semibold truncate ${
                          isCurrent
                            ? 'text-blue-700 font-bold'
                            : isCompleted
                            ? 'text-slate-800'
                            : 'text-slate-400'
                        }`}
                      >
                        {s.title}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Continuous Animated Progress Bar */}
            <div className="mt-2 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                id="booking-progress-bar-fill"
                className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-300 rounded-full"
                style={{ width: `${(step / 5) * 100}%` }}
              />
            </div>

            {/* Current Active Selections Breadcrumb Strip */}
            <div className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-500 overflow-x-auto whitespace-nowrap py-0.5">
              <span className="font-semibold text-slate-400">Selections:</span>
              <span className="font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100/60">
                {selectedDept}
              </span>
              {step >= 2 && selectedDoctor && (
                <>
                  <span className="text-slate-300">›</span>
                  <span className="font-medium text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md">
                    {selectedDoctor.name}
                  </span>
                </>
              )}
              {step >= 3 && (
                <>
                  <span className="text-slate-300">›</span>
                  <span className="font-medium text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md">
                    {formatFriendlyDate(selectedDate)}
                  </span>
                </>
              )}
              {step >= 4 && (
                <>
                  <span className="text-slate-300">›</span>
                  <span className="font-medium text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md">
                    {selectedTime}
                  </span>
                </>
              )}
            </div>
          </div>
        )}

        {/* Modal Scrollable Body with Smooth Transitions */}
        <div className="p-6 overflow-y-auto flex-1 bg-slate-50/30">
          <AnimatePresence mode="wait">
            {/* ============================================================ */}
            {/* STEP 01: DEPARTMENT SELECTION */}
            {/* ============================================================ */}
            {step === 1 && (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, x: direction * 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -direction * 15 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
                className="space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <h4 className="text-base font-bold text-slate-900 tracking-tight">01. Select Clinical Specialty</h4>
                    <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
                      5 Departments Available
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Choose the medical department catering to your health symptoms or diagnostic requirement.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                  {DEPARTMENTS.map((dept) => {
                    const isSelected = selectedDept === dept.id;
                    const IconComponent = dept.icon;
                    const availableDoctorsCount = doctors.filter(
                      (d) =>
                        d.department?.toLowerCase().includes(dept.id.toLowerCase()) ||
                        d.specialization?.toLowerCase().includes(dept.id.toLowerCase())
                    ).length;

                    return (
                      <div
                        key={dept.id}
                        id={`dept-card-${dept.id.toLowerCase().replace(/\s+/g, '-')}`}
                        onClick={() => handleSelectDepartment(dept.id)}
                        className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'border-blue-500 bg-white ring-2 ring-blue-500/20 shadow-md'
                            : 'border-slate-200/90 bg-white hover:border-slate-300 hover:shadow-xs'
                        }`}
                      >
                        <div>
                          <div className="flex items-start justify-between gap-2 mb-2.5">
                            <div className="flex items-center gap-2.5">
                              <div className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 ${dept.accentColor}`}>
                                <IconComponent className="w-5 h-5" />
                              </div>
                              <div>
                                <span className="font-bold text-sm text-slate-900 block leading-tight">{dept.name}</span>
                                <span className="text-[10px] text-slate-400 font-medium">{dept.location}</span>
                              </div>
                            </div>
                            {isSelected ? (
                              <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                                <Check className="w-3.5 h-3.5 stroke-[3]" />
                              </span>
                            ) : (
                              <div className="w-5 h-5 rounded-full border border-slate-300 shrink-0" />
                            )}
                          </div>

                          <p className="text-xs text-slate-600 leading-relaxed">{dept.fullDesc}</p>
                        </div>

                        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                          <span className="font-medium text-slate-500 flex items-center gap-1">
                            <Stethoscope className="w-3 h-3 text-slate-400" />
                            {availableDoctorsCount > 0 ? `${availableDoctorsCount} Certified Specialist` : 'Certified Specialist'}
                          </span>
                          <span className={`font-semibold px-2 py-0.5 rounded-md ${dept.badgeBg}`}>
                            In-Clinic & Video
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* ============================================================ */}
            {/* STEP 02: DOCTOR SELECTION */}
            {/* ============================================================ */}
            {step === 2 && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, x: direction * 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -direction * 15 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
                className="space-y-4"
              >
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h4 className="text-base font-bold text-slate-900 tracking-tight">02. Select Attending Specialist</h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Choose your preferred physician from our verified medical directory.
                      </p>
                    </div>

                    {/* Department Quick Filter Pills */}
                    <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
                      <button
                        type="button"
                        onClick={() => setDoctorDeptFilter('all')}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                          doctorDeptFilter === 'all'
                            ? 'bg-blue-600 text-white shadow-2xs'
                            : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        All for {selectedDept}
                      </button>
                      <button
                        type="button"
                        onClick={() => setDoctorDeptFilter(selectedDept)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                          doctorDeptFilter === selectedDept
                            ? 'bg-blue-600 text-white shadow-2xs'
                            : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {selectedDept} Only
                      </button>
                    </div>
                  </div>
                </div>

                {loadingDoctors ? (
                  <div className="py-12 text-center text-xs text-slate-400">Loading specialist profiles...</div>
                ) : displayedDoctors.length === 0 ? (
                  <div className="py-10 text-center bg-white rounded-xl border border-slate-200 p-6 space-y-2">
                    <p className="text-xs text-slate-500">No doctors listed under this filter.</p>
                    <button
                      type="button"
                      onClick={() => setDoctorDeptFilter('all')}
                      className="px-3.5 py-1.5 bg-blue-50 text-blue-700 text-xs font-semibold rounded-lg hover:bg-blue-100"
                    >
                      Show all specialists
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {displayedDoctors.map((doc) => {
                      const isSelected = (selectedDoctorId || displayedDoctors[0]?.id) === doc.id;
                      const initials = doc.name.replace('Dr. ', '').slice(0, 2).toUpperCase();

                      return (
                        <div
                          key={doc.id}
                          id={`doctor-card-${doc.id}`}
                          onClick={() => setSelectedDoctorId(doc.id)}
                          className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer bg-white ${
                            isSelected
                              ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-md'
                              : 'border-slate-200/90 hover:border-slate-300 hover:shadow-xs'
                          }`}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            {/* Left: Avatar & Info */}
                            <div className="flex items-start gap-3.5">
                              <div className="relative shrink-0">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                                  {initials}
                                </div>
                                <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white" title="Active on Duty" />
                              </div>

                              <div className="space-y-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h5 className="font-bold text-sm sm:text-base text-slate-900">{doc.name}</h5>
                                  <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100/70">
                                    {doc.department || doc.specialization}
                                  </span>
                                </div>

                                <div className="text-xs text-slate-600 font-medium">
                                  {doc.specialization} • <span className="text-slate-400">{doc.qualification}</span>
                                </div>

                                {/* Availability & Experience Row */}
                                <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap pt-0.5">
                                  <span className="font-semibold text-slate-700 flex items-center gap-1">
                                    <Clock className="w-3.5 h-3.5 text-blue-600" />
                                    {doc.availabilityDays} ({doc.availabilityHours})
                                  </span>
                                  <span className="text-slate-300">•</span>
                                  <span className="text-slate-600 font-medium">
                                    {doc.experienceYears}+ Years Clinical Exp
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Right: Consultation Fee, Rating & Select Button */}
                            <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100 shrink-0">
                              <div className="text-left sm:text-right">
                                <div className="text-xs text-slate-400 font-medium">Consultation Fee</div>
                                <div className="text-base font-bold text-slate-900">₹{doc.consultationFee}</div>
                              </div>

                              <div className="flex items-center gap-3 sm:mt-1.5">
                                <div className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60">
                                  <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                                  <span>{doc.rating}</span>
                                  <span className="text-[10px] text-amber-700/80 font-normal">({doc.totalPatients}+)</span>
                                </div>

                                {isSelected ? (
                                  <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                                    <Check className="w-4 h-4 stroke-[3]" />
                                  </span>
                                ) : (
                                  <div className="w-6 h-6 rounded-full border border-slate-300 shrink-0" />
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            )}

            {/* ============================================================ */}
            {/* STEP 03: DATE SELECTION (Clean Calendar Interface) */}
            {/* ============================================================ */}
            {step === 3 && (
              <motion.div
                key="step-3"
                initial={{ opacity: 0, x: direction * 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -direction * 15 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
                className="space-y-4"
              >
                <div>
                  <h4 className="text-base font-bold text-slate-900 tracking-tight">03. Select Consultation Date</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Choose from {selectedDoctor?.name}'s active outpatient calendar.
                  </p>
                </div>

                {/* Quick Date Shortcut Chips */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Quick Pick Closest Windows:
                  </span>
                  <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    {[
                      { date: '2026-09-22', label: 'Tue, 22 Sep' },
                      { date: '2026-09-23', label: 'Wed, 23 Sep' },
                      { date: '2026-09-24', label: 'Thu, 24 Sep' },
                      { date: '2026-09-25', label: 'Fri, 25 Sep' },
                      { date: '2026-09-28', label: 'Mon, 28 Sep' },
                    ].map((shortcut) => {
                      const isSelected = selectedDate === shortcut.date;
                      return (
                        <button
                          key={shortcut.date}
                          id={`quick-date-btn-${shortcut.date}`}
                          type="button"
                          onClick={() => setSelectedDate(shortcut.date)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer ${
                            isSelected
                              ? 'bg-blue-600 text-white shadow-xs'
                              : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                          }`}
                        >
                          {shortcut.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Clean Calendar Interface */}
                <div id="booking-calendar-widget" className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs">
                  {/* Calendar Navigation Header */}
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-blue-600" />
                      <span className="font-bold text-sm text-slate-900">{monthName}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        id="cal-prev-month-btn"
                        onClick={handlePrevMonth}
                        disabled={year === 2026 && month <= 8}
                        className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        title="Previous Month"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        id="cal-next-month-btn"
                        onClick={handleNextMonth}
                        className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                        title="Next Month"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Day of Week Headers */}
                  <div className="grid grid-cols-7 gap-1 text-center mb-2">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                      <span key={d} className="text-[11px] font-bold text-slate-400 uppercase tracking-wider py-1">
                        {d}
                      </span>
                    ))}
                  </div>

                  {/* Calendar Dates Grid */}
                  <div className="grid grid-cols-7 gap-1 sm:gap-1.5 text-center">
                    {/* Empty padding blocks before the 1st of the month */}
                    {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                      <div key={`empty-${i}`} className="h-9 sm:h-10" />
                    ))}

                    {/* Days in Month */}
                    {Array.from({ length: daysInMonth }).map((_, i) => {
                      const dayNum = i + 1;
                      const dateStr = formatIsoDate(year, month, dayNum);
                      const isSelected = selectedDate === dateStr;
                      const isPast = year === 2026 && month === 8 && dayNum < 19; // Current simulated date is Sep 19, 2026
                      const dayOfWeek = (firstDayOfWeek + i) % 7;
                      const isSunday = dayOfWeek === 0;

                      return (
                        <button
                          key={dateStr}
                          type="button"
                          id={`cal-day-btn-${dateStr}`}
                          disabled={isPast || isSunday}
                          onClick={() => setSelectedDate(dateStr)}
                          className={`h-9 sm:h-10 rounded-xl font-semibold text-xs transition-all relative flex flex-col items-center justify-center ${
                            isSelected
                              ? 'bg-blue-600 text-white shadow-xs font-bold scale-[1.02]'
                              : isPast || isSunday
                              ? 'text-slate-300 cursor-not-allowed bg-transparent'
                              : 'text-slate-700 hover:bg-blue-50 hover:text-blue-700 cursor-pointer bg-slate-50/50'
                          }`}
                        >
                          <span>{dayNum}</span>
                          {!isPast && !isSunday && !isSelected && (
                            <span className="w-1 h-1 rounded-full bg-emerald-500 mt-0.5" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Calendar Legend */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span>Doctor On Duty</span>
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-slate-300" />
                        <span>Unavailable / Past</span>
                      </span>
                    </div>
                    <span className="font-semibold text-slate-700">Mon - Sat Active</span>
                  </div>
                </div>

                {/* Selected Date Summary Banner */}
                <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <CalendarCheck className="w-4 h-4 text-blue-600 shrink-0" />
                    <div>
                      <span className="text-slate-500">Selected Consultation Date:</span>
                      <div className="font-bold text-slate-900 text-sm">{formatFriendlyDate(selectedDate)}</div>
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold text-blue-800 bg-white px-2.5 py-1 rounded-lg border border-blue-200/60 shadow-2xs">
                    Confirmed Availability
                  </span>
                </div>
              </motion.div>
            )}

            {/* ============================================================ */}
            {/* STEP 04: TIME SELECTION (Selectable Time Chips) */}
            {/* ============================================================ */}
            {step === 4 && (
              <motion.div
                key="step-4"
                initial={{ opacity: 0, x: direction * 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -direction * 15 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
                className="space-y-4"
              >
                <div>
                  <h4 className="text-base font-bold text-slate-900 tracking-tight">04. Select Consultation Time</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Available outpatient consultation chips for <span className="font-semibold text-slate-800">{formatFriendlyDate(selectedDate)}</span>.
                  </p>
                </div>

                {/* Time Slots Categories */}
                <div className="space-y-4">
                  {TIME_SLOT_GROUPS.map((group) => (
                    <div key={group.category} className="space-y-2">
                      <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-blue-600" />
                        {group.category}
                      </span>

                      {/* Selectable Time Chips */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                        {group.slots.map((slot) => {
                          const isSelected = selectedTime === slot.time;
                          return (
                            <button
                              key={slot.time}
                              type="button"
                              id={`time-chip-${slot.time.replace(/[:\s]/g, '-')}`}
                              onClick={() => setSelectedTime(slot.time)}
                              className={`p-3 rounded-xl border text-left transition-all duration-150 cursor-pointer flex flex-col justify-between ${
                                isSelected
                                  ? 'border-blue-600 bg-blue-50/80 ring-2 ring-blue-500/20 shadow-xs'
                                  : 'border-slate-200/90 bg-white hover:border-slate-300 hover:bg-slate-50'
                              }`}
                            >
                              <div className="flex items-center justify-between mb-1">
                                <span className={`text-xs font-bold ${isSelected ? 'text-blue-900' : 'text-slate-900'}`}>
                                  {slot.time}
                                </span>
                                {isSelected ? (
                                  <Check className="w-3.5 h-3.5 text-blue-600 stroke-[3]" />
                                ) : (
                                  <Clock className="w-3.5 h-3.5 text-slate-300" />
                                )}
                              </div>

                              <span
                                className={`text-[10px] font-semibold ${
                                  isSelected
                                    ? 'text-blue-700'
                                    : slot.tag === 'Popular'
                                    ? 'text-amber-600'
                                    : slot.tag === 'Fast Filling'
                                    ? 'text-rose-600'
                                    : 'text-emerald-600'
                                }`}
                              >
                                {slot.tag}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Consultation Details Note */}
                <div className="p-3.5 rounded-xl bg-slate-100/70 border border-slate-200/80 text-slate-600 text-xs flex items-center gap-3">
                  <Info className="w-4 h-4 text-slate-500 shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-900">Standard 45-Minute Window: </span>
                    Includes clinical review, symptom assessment, diagnostic examination, and cloud digital prescription.
                  </div>
                </div>
              </motion.div>
            )}

            {/* ============================================================ */}
            {/* STEP 05: CONFIRMATION & APPOINTMENT SUMMARY */}
            {/* ============================================================ */}
            {step === 5 && (
              <motion.div
                key="step-5"
                initial={{ opacity: 0, x: direction * 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -direction * 15 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
                className="space-y-4"
              >
                <div>
                  <h4 className="text-base font-bold text-slate-900 tracking-tight">05. Review & Confirm Appointment</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Verify all consultation specifications before registering into the Cloud Database.
                  </p>
                </div>

                {/* Polished Summary Voucher Card */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                  {/* Doctor Profile Banner */}
                  <div className="p-4 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                        {selectedDoctor?.name?.replace('Dr. ', '').slice(0, 2).toUpperCase() || 'DR'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h5 className="font-bold text-sm sm:text-base text-slate-900">
                            {selectedDoctor?.name || 'Dr. Priya Rao'}
                          </h5>
                          <span className="text-[10px] font-semibold text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded-md border border-blue-200/60">
                            {selectedDept}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500">
                          {selectedDoctor?.specialization} • {selectedDoctor?.qualification}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-[11px] text-slate-400 font-medium">Consultation Fee</div>
                      <div className="text-base font-bold text-slate-900">₹{selectedDoctor?.consultationFee || 1200}</div>
                    </div>
                  </div>

                  {/* Summary Details Grid */}
                  <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                    <div className="p-3 rounded-xl bg-slate-50/70 border border-slate-200/70 space-y-1">
                      <span className="text-slate-400 block font-semibold text-[11px] uppercase tracking-wider">
                        Date & Time Slot
                      </span>
                      <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-blue-600" />
                        <span>{formatFriendlyDate(selectedDate)}</span>
                      </div>
                      <div className="text-blue-700 font-semibold flex items-center gap-1.5 pt-0.5">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{selectedTime} (45 mins duration)</span>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50/70 border border-slate-200/70 space-y-1">
                      <span className="text-slate-400 block font-semibold text-[11px] uppercase tracking-wider">
                        Patient Profile
                      </span>
                      <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                        <User className="w-4 h-4 text-blue-600" />
                        <span>{user?.name || 'Aarav Kumar'}</span>
                      </div>
                      <div className="text-slate-500 font-medium">
                        ID: {user?.id || 'usr-patient-1'} • Electronic Record Synced
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50/70 border border-slate-200/70 space-y-1">
                      <span className="text-slate-400 block font-semibold text-[11px] uppercase tracking-wider">
                        Location / Clinic Room
                      </span>
                      <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-blue-600" />
                        <span>{selectedDepartmentInfo.location}</span>
                      </div>
                      <div className="text-slate-500 font-medium">Central Academic Medical Center</div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50/70 border border-slate-200/70 space-y-1">
                      <span className="text-slate-400 block font-semibold text-[11px] uppercase tracking-wider">
                        Registration & Audit
                      </span>
                      <div className="font-semibold text-emerald-700 flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        <span>Instant Cloud Firestore Synchronization</span>
                      </div>
                      <div className="text-slate-500 font-medium">SHA-256 Audit Log Generated</div>
                    </div>
                  </div>
                </div>

                {/* Optional Symptoms / Reason for Visit */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Reason for Consultation / Primary Symptoms (Optional)
                    </label>
                    <span className="text-[11px] text-slate-400">Attached to Electronic Health Record</span>
                  </div>

                  {/* Quick Tag Pills */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {COMMON_SYMPTOM_TAGS.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => {
                          if (visitNotes.includes(tag)) return;
                          setVisitNotes((prev) => (prev ? `${prev}, ${tag}` : tag));
                        }}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200/80 text-slate-600 text-[11px] font-medium rounded-lg transition-colors cursor-pointer"
                      >
                        + {tag}
                      </button>
                    ))}
                  </div>

                  <textarea
                    id="visit-notes-input"
                    rows={2}
                    value={visitNotes}
                    onChange={(e) => setVisitNotes(e.target.value)}
                    placeholder="e.g. Regular cardiovascular follow-up, reviewing recent blood pressure log and medication..."
                    className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 bg-white"
                  />
                </div>

                {/* Cloud Guarantee Callout */}
                <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200/70 text-emerald-900 text-xs flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    Upon confirmation, an outpatient slot is locked instantly to prevent scheduling conflicts.
                  </span>
                </div>
              </motion.div>
            )}

            {/* ============================================================ */}
            {/* STEP 06: CONFIRMED SUCCESS VIEW */}
            {/* ============================================================ */}
            {step === 6 && confirmedData && (
              <motion.div
                key="step-6"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="py-4 text-center space-y-5"
              >
                {/* Green Check Animation Badge */}
                <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
                </div>

                {/* Confirmed Header as requested */}
                <div className="space-y-1">
                  <h4 id="appointment-confirmed-heading" className="text-2xl font-bold text-slate-900 tracking-tight">
                    ✓ Appointment Confirmed
                  </h4>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    Your consultation is booked and synchronized into the SmartCare Cloud Central Database.
                  </p>
                </div>

                {/* Polished Summary Voucher Card */}
                <div
                  id="confirmed-appointment-summary-card"
                  className="bg-white rounded-2xl border border-slate-200/90 shadow-md text-left max-w-lg mx-auto overflow-hidden"
                >
                  <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Consultation Slip
                    </span>
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100/70 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      Confirmed & Active
                    </span>
                  </div>

                  <div className="p-5 space-y-3.5 text-xs">
                    {/* Doctor */}
                    <div className="flex items-start justify-between pb-3 border-b border-slate-100">
                      <span className="text-slate-400 font-medium">Doctor</span>
                      <div className="text-right">
                        <span id="confirmed-doctor-name" className="font-bold text-slate-900 text-sm block">
                          {confirmedData.doctorName}
                        </span>
                        <span className="text-[11px] text-slate-500">
                          {selectedDoctor?.qualification || 'Consultant Physician'}
                        </span>
                      </div>
                    </div>

                    {/* Department */}
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <span className="text-slate-400 font-medium">Department</span>
                      <span id="confirmed-department-name" className="font-semibold text-slate-900">
                        {confirmedData.department}
                      </span>
                    </div>

                    {/* Date */}
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <span className="text-slate-400 font-medium">Date</span>
                      <span id="confirmed-date" className="font-semibold text-slate-900">
                        {formatFriendlyDate(confirmedData.date)} ({confirmedData.date})
                      </span>
                    </div>

                    {/* Time */}
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <span className="text-slate-400 font-medium">Time</span>
                      <span id="confirmed-time" className="font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100">
                        {confirmedData.time}
                      </span>
                    </div>

                    {/* Appointment ID */}
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-slate-400 font-medium">Appointment ID</span>
                      <div className="flex items-center gap-2">
                        <span id="confirmed-appointment-id" className="font-mono font-bold text-slate-900 text-sm bg-slate-100 px-2.5 py-1 rounded-lg">
                          {confirmedData.id}
                        </span>
                        <button
                          type="button"
                          id="copy-confirmed-id-btn"
                          onClick={handleCopyAppointmentId}
                          className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                          title="Copy Appointment ID"
                        >
                          {copiedId ? <CheckCheck className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                  <button
                    id="confirmed-done-btn"
                    type="button"
                    onClick={onClose}
                    className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl shadow-xs cursor-pointer transition-all duration-150 flex items-center justify-center gap-2"
                  >
                    <span>Done & View Agenda</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setStep(1);
                      setConfirmedData(null);
                    }}
                    className="w-full sm:w-auto px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 cursor-pointer transition-all duration-150"
                  >
                    Book Another Appointment
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Modal Footer Controls (Steps 1 to 5) */}
        {step <= 5 && (
          <div className="px-6 py-3.5 border-t border-slate-100 flex items-center justify-between bg-slate-50/70 shrink-0">
            {step > 1 ? (
              <button
                id="booking-back-btn"
                type="button"
                onClick={handleBack}
                className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-200/60 rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400 hidden sm:inline">
                {step === 1 && `Specialty: ${selectedDept}`}
                {step === 2 && `Specialist: ${selectedDoctor?.name || 'Selected'}`}
                {step === 3 && `Date: ${selectedDate}`}
                {step === 4 && `Slot: ${selectedTime}`}
                {step === 5 && `Ready to Confirm`}
              </span>

              {step < 5 ? (
                <button
                  id="booking-continue-btn"
                  type="button"
                  onClick={handleNext}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl shadow-xs flex items-center gap-2 cursor-pointer transition-all duration-150"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  id="booking-confirm-submit-btn"
                  type="button"
                  disabled={submitting}
                  onClick={handleConfirmBooking}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl shadow-xs flex items-center gap-2 cursor-pointer disabled:opacity-60 transition-all duration-150"
                >
                  {submitting ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Registering to Cloud...</span>
                    </>
                  ) : (
                    <>
                      <span>Confirm & Save Appointment</span>
                      <Check className="w-4 h-4 stroke-[2.5]" />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
