export interface UserRecord {
  id: string;
  email: string;
  role: 'patient' | 'doctor' | 'admin';
  name: string;
  phone: string;
  status: 'active' | 'inactive';
  createdAt: string;
  avatar?: string;
  specialization?: string;
}

export interface PatientRecord {
  id: string;
  userId: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  bloodGroup: string;
  emergencyContact: string;
  medicalHistory: string;
  lastVisit: string;
  nextAppointment?: string;
  status: 'Active' | 'Follow-up' | 'Stable';
  createdAt: string;
}

export interface DoctorRecord {
  id: string;
  userId: string;
  name: string;
  specialization: string;
  department: string;
  qualification: string;
  experienceYears: number;
  availabilityDays: string;
  availabilityHours: string;
  consultationFee: number;
  rating: number;
  totalPatients: number;
  createdAt: string;
}

export interface AppointmentRecord {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  department: string;
  date: string;
  time: string;
  status: 'confirmed' | 'completed' | 'cancelled';
  notes: string;
  createdAt: string;
  updatedAt?: string;
}

export interface MedicalDocument {
  id: string;
  name: string;
  size: string;
  type: string;
  cloudUrl: string;
  uploadedAt: string;
}

export interface MedicalRecordData {
  id: string;
  recordId: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  department: string;
  date: string;
  recordType: 'General Consultation' | 'Cardiology Review' | 'Dermatology Assessment' | 'Diagnostic Report' | 'Follow-up';
  diagnosis: string;
  consultationNotes: string;
  medicalHistoryNotes: string;
  prescription: string;
  followUpDate: string;
  status: 'finalized' | 'archived';
  documents: MedicalDocument[];
  createdAt: string;
}

export const INITIAL_USERS: UserRecord[] = [
  {
    id: 'usr-patient-1',
    email: 'aarav.kumar@patient.smartcare.cloud',
    role: 'patient',
    name: 'Aarav Kumar',
    phone: '+91 98450 23114',
    status: 'active',
    createdAt: '2026-01-12T09:30:00Z',
  },
  {
    id: 'usr-patient-2',
    email: 'ananya.sharma@patient.smartcare.cloud',
    role: 'patient',
    name: 'Ananya Sharma',
    phone: '+91 97123 44589',
    status: 'active',
    createdAt: '2026-02-04T11:15:00Z',
  },
  {
    id: 'usr-patient-3',
    email: 'rahul.verma@patient.smartcare.cloud',
    role: 'patient',
    name: 'Rahul Verma',
    phone: '+91 99876 12340',
    status: 'active',
    createdAt: '2026-03-18T14:20:00Z',
  },
  {
    id: 'usr-doc-1',
    email: 'dr.priya.rao@doctor.smartcare.cloud',
    role: 'doctor',
    name: 'Dr. Priya Rao',
    specialization: 'Cardiology',
    phone: '+91 94220 88190',
    status: 'active',
    createdAt: '2025-11-10T08:00:00Z',
  },
  {
    id: 'usr-doc-2',
    email: 'dr.arjun.mehta@doctor.smartcare.cloud',
    role: 'doctor',
    name: 'Dr. Arjun Mehta',
    specialization: 'General Medicine',
    phone: '+91 93100 45221',
    status: 'active',
    createdAt: '2025-11-15T08:30:00Z',
  },
  {
    id: 'usr-doc-3',
    email: 'dr.neha.reddy@doctor.smartcare.cloud',
    role: 'doctor',
    name: 'Dr. Neha Reddy',
    specialization: 'Dermatology',
    phone: '+91 96541 77239',
    status: 'active',
    createdAt: '2025-12-01T10:00:00Z',
  },
  {
    id: 'usr-doc-4',
    email: 'dr.vikram.sen@doctor.smartcare.cloud',
    role: 'doctor',
    name: 'Dr. Vikram Sen',
    specialization: 'Neurology',
    phone: '+91 98231 44891',
    status: 'active',
    createdAt: '2025-12-15T09:15:00Z',
  },
  {
    id: 'usr-doc-5',
    email: 'dr.sunita.kulkarni@doctor.smartcare.cloud',
    role: 'doctor',
    name: 'Dr. Sunita Kulkarni',
    specialization: 'Orthopedics',
    phone: '+91 97188 33412',
    status: 'active',
    createdAt: '2026-01-05T11:00:00Z',
  },
  {
    id: 'usr-admin-1',
    email: 'admin@smartcare.cloud',
    role: 'admin',
    name: 'Prof. S. R. Varma (Admin)',
    phone: '+91 98110 00192',
    status: 'active',
    createdAt: '2025-10-01T00:00:00Z',
  },
];

export const INITIAL_PATIENTS: PatientRecord[] = [
  {
    id: 'pat-1',
    userId: 'usr-patient-1',
    name: 'Aarav Kumar',
    age: 34,
    gender: 'Male',
    bloodGroup: 'B+',
    emergencyContact: 'Sunita Kumar (+91 98450 23115)',
    medicalHistory: 'Mild Hypertension (managed with lifestyle), seasonal allergies.',
    lastVisit: '2026-08-14',
    nextAppointment: '2026-09-18',
    status: 'Active',
    createdAt: '2026-01-12T09:30:00Z',
  },
  {
    id: 'pat-2',
    userId: 'usr-patient-2',
    name: 'Ananya Sharma',
    age: 28,
    gender: 'Female',
    bloodGroup: 'O+',
    emergencyContact: 'Vikram Sharma (+91 97123 44590)',
    medicalHistory: 'Asthma symptoms during winter, no drug allergies.',
    lastVisit: '2026-09-02',
    nextAppointment: '2026-09-18',
    status: 'Follow-up',
    createdAt: '2026-02-04T11:15:00Z',
  },
  {
    id: 'pat-3',
    userId: 'usr-patient-3',
    name: 'Rahul Verma',
    age: 42,
    gender: 'Male',
    bloodGroup: 'A+',
    emergencyContact: 'Meera Verma (+91 99876 12341)',
    medicalHistory: 'Type-2 Diabetes mellitus under metformin regimen.',
    lastVisit: '2026-08-28',
    nextAppointment: '2026-09-22',
    status: 'Stable',
    createdAt: '2026-03-18T14:20:00Z',
  },
];

export const INITIAL_DOCTORS: DoctorRecord[] = [
  {
    id: 'doc-1',
    userId: 'usr-doc-1',
    name: 'Dr. Priya Rao',
    specialization: 'Cardiology',
    department: 'Department of Cardiology & Vascular Sciences',
    qualification: 'MBBS, MD (Cardiology), DM, FACC',
    experienceYears: 14,
    availabilityDays: 'Monday - Friday',
    availabilityHours: '09:00 AM - 04:00 PM',
    consultationFee: 1200,
    rating: 4.9,
    totalPatients: 248,
    createdAt: '2025-11-10T08:00:00Z',
  },
  {
    id: 'doc-2',
    userId: 'usr-doc-2',
    name: 'Dr. Arjun Mehta',
    specialization: 'General Medicine',
    department: 'Department of Internal Medicine',
    qualification: 'MBBS, MD (General Medicine)',
    experienceYears: 11,
    availabilityDays: 'Monday - Saturday',
    availabilityHours: '08:30 AM - 02:30 PM',
    consultationFee: 800,
    rating: 4.8,
    totalPatients: 390,
    createdAt: '2025-11-15T08:30:00Z',
  },
  {
    id: 'doc-3',
    userId: 'usr-doc-3',
    name: 'Dr. Neha Reddy',
    specialization: 'Dermatology',
    department: 'Department of Dermatology & Cosmetology',
    qualification: 'MBBS, DVD, MD (Dermatology)',
    experienceYears: 9,
    availabilityDays: 'Tuesday - Saturday',
    availabilityHours: '10:00 AM - 05:00 PM',
    consultationFee: 950,
    rating: 4.9,
    totalPatients: 195,
    createdAt: '2025-12-01T10:00:00Z',
  },
  {
    id: 'doc-4',
    userId: 'usr-doc-4',
    name: 'Dr. Vikram Sen',
    specialization: 'Neurology',
    department: 'Department of Neurosciences & Spine Care',
    qualification: 'MBBS, MD, DM (Neurology)',
    experienceYears: 16,
    availabilityDays: 'Monday - Thursday',
    availabilityHours: '10:00 AM - 03:30 PM',
    consultationFee: 1400,
    rating: 4.9,
    totalPatients: 310,
    createdAt: '2025-12-15T09:15:00Z',
  },
  {
    id: 'doc-5',
    userId: 'usr-doc-5',
    name: 'Dr. Sunita Kulkarni',
    specialization: 'Orthopedics',
    department: 'Department of Orthopedics & Joint Replacement',
    qualification: 'MBBS, MS (Orthopedics), MCh (Ortho)',
    experienceYears: 13,
    availabilityDays: 'Monday - Friday',
    availabilityHours: '09:00 AM - 02:00 PM',
    consultationFee: 1100,
    rating: 4.8,
    totalPatients: 420,
    createdAt: '2026-01-05T11:00:00Z',
  },
];

export const INITIAL_APPOINTMENTS: AppointmentRecord[] = [
  {
    id: 'apt-101',
    patientId: 'usr-patient-1',
    patientName: 'Aarav Kumar',
    doctorId: 'usr-doc-1',
    doctorName: 'Dr. Priya Rao',
    department: 'Cardiology',
    date: '2026-09-18',
    time: '10:30 AM',
    status: 'confirmed',
    notes: 'Routine cardiovascular follow-up checkup and lipid profile review.',
    createdAt: '2026-09-10T11:00:00Z',
  },
  {
    id: 'apt-102',
    patientId: 'usr-patient-2',
    patientName: 'Ananya Sharma',
    doctorId: 'usr-doc-1',
    doctorName: 'Dr. Priya Rao',
    department: 'Cardiology',
    date: '2026-09-18',
    time: '11:15 AM',
    status: 'confirmed',
    notes: 'ECG evaluation and sinus rhythm follow-up check.',
    createdAt: '2026-09-11T14:30:00Z',
  },
  {
    id: 'apt-103',
    patientId: 'usr-patient-3',
    patientName: 'Rahul Verma',
    doctorId: 'usr-doc-2',
    doctorName: 'Dr. Arjun Mehta',
    department: 'General Medicine',
    date: '2026-09-18',
    time: '12:00 PM',
    status: 'confirmed',
    notes: 'Quarterly fasting blood sugar and HbA1c review.',
    createdAt: '2026-09-12T09:15:00Z',
  },
  {
    id: 'apt-104',
    patientId: 'usr-patient-1',
    patientName: 'Aarav Kumar',
    doctorId: 'usr-doc-2',
    doctorName: 'Dr. Arjun Mehta',
    department: 'General Medicine',
    date: '2026-08-14',
    time: '02:00 PM',
    status: 'completed',
    notes: 'Annual comprehensive wellness physical examination.',
    createdAt: '2026-08-01T10:00:00Z',
  },
  {
    id: 'apt-105',
    patientId: 'usr-patient-1',
    patientName: 'Aarav Kumar',
    doctorId: 'usr-doc-3',
    doctorName: 'Dr. Neha Reddy',
    department: 'Dermatology',
    date: '2026-07-22',
    time: '11:00 AM',
    status: 'completed',
    notes: 'Allergy skin prick evaluation.',
    createdAt: '2026-07-15T08:30:00Z',
  },
  {
    id: 'apt-106',
    patientId: 'usr-patient-2',
    patientName: 'Ananya Sharma',
    doctorId: 'usr-doc-3',
    doctorName: 'Dr. Neha Reddy',
    department: 'Dermatology',
    date: '2026-09-24',
    time: '03:30 PM',
    status: 'confirmed',
    notes: 'Eczema management review.',
    createdAt: '2026-09-14T16:00:00Z',
  },
];

export const INITIAL_MEDICAL_RECORDS: MedicalRecordData[] = [
  {
    id: 'rec-1',
    recordId: 'SMC-REC-2026-089',
    patientId: 'usr-patient-1',
    patientName: 'Aarav Kumar',
    doctorId: 'usr-doc-1',
    doctorName: 'Dr. Priya Rao',
    department: 'Cardiology',
    date: '2026-09-18',
    recordType: 'Cardiology Review',
    diagnosis: 'Stage-1 Essential Hypertension (Well Controlled), Resting Pulse 72 bpm',
    consultationNotes: 'Patient presents for scheduled cardiovascular review. Blood pressure recorded at 124/82 mmHg. S1/S2 heart sounds clear, no peripheral edema. 12-lead ECG demonstrates normal sinus rhythm with no ST-T segment elevation or axis deviation. Advised continuation of current dietary DASH pattern and 30 minutes daily aerobic walking.',
    medicalHistoryNotes: 'No prior myocardial infarction or acute coronary syndromes. Non-smoker, mild allergic rhinitis history.',
    prescription: '1. Telmisartan 40mg — Once daily morning after breakfast (30 days)\n2. Omega-3 1000mg — Once daily evening (30 days)',
    followUpDate: '2026-11-18',
    status: 'finalized',
    documents: [
      {
        id: 'doc-f1',
        name: 'Resting_12_Lead_ECG_Report.pdf',
        size: '1.4 MB',
        type: 'application/pdf',
        cloudUrl: 'https://smartcare-cloud-storage.academic/records/aarav_ecg.pdf',
        uploadedAt: '2026-09-18T10:45:00Z',
      },
      {
        id: 'doc-f2',
        name: 'Lipid_Panel_Centres_Lab.pdf',
        size: '890 KB',
        type: 'application/pdf',
        cloudUrl: 'https://smartcare-cloud-storage.academic/records/aarav_lipids.pdf',
        uploadedAt: '2026-09-17T16:10:00Z',
      },
    ],
    createdAt: '2026-09-18T10:45:00Z',
  },
  {
    id: 'rec-2',
    recordId: 'SMC-REC-2026-074',
    patientId: 'usr-patient-1',
    patientName: 'Aarav Kumar',
    doctorId: 'usr-doc-2',
    doctorName: 'Dr. Arjun Mehta',
    department: 'General Medicine',
    date: '2026-08-14',
    recordType: 'General Consultation',
    diagnosis: 'Annual Executive Health Screen — Clinically Stable',
    consultationNotes: 'Complete physical evaluation. Chest clear to auscultation, abdomen soft and non-tender. Liver function tests within normal reference ranges. Vitamin D3 level was moderately deficient at 21 ng/mL; supplemental cholecalciferol initiated.',
    medicalHistoryNotes: 'Nil significant surgical history. Family history of hypertension in maternal lineage.',
    prescription: '1. Cholecalciferol (Vitamin D3) 60,000 IU — Once weekly for 8 weeks\n2. Multivitamin with zinc — Once daily for 30 days',
    followUpDate: '2026-10-14',
    status: 'finalized',
    documents: [
      {
        id: 'doc-f3',
        name: 'Executive_Biochemistry_Panel.pdf',
        size: '2.1 MB',
        type: 'application/pdf',
        cloudUrl: 'https://smartcare-cloud-storage.academic/records/aarav_bio.pdf',
        uploadedAt: '2026-08-14T14:30:00Z',
      },
    ],
    createdAt: '2026-08-14T14:30:00Z',
  },
  {
    id: 'rec-3',
    recordId: 'SMC-REC-2026-052',
    patientId: 'usr-patient-1',
    patientName: 'Aarav Kumar',
    doctorId: 'usr-doc-3',
    doctorName: 'Dr. Neha Reddy',
    department: 'Dermatology',
    date: '2026-07-22',
    recordType: 'Dermatology Assessment',
    diagnosis: 'Mild Contact Dermatitis (Urticarial reaction to synthetic fabric)',
    consultationNotes: 'Erythematous papules observed over anterior forearm. No signs of secondary infection or blistering. Topical barrier therapy prescribed alongside non-sedating antihistamines.',
    medicalHistoryNotes: 'History of sensitivity to wool and certain detergents.',
    prescription: '1. Desloratadine 5mg — Once daily bedtime for 10 days\n2. Hydrocortisone 1% topical cream — Apply twice daily thin film for 5 days',
    followUpDate: '2026-08-05',
    status: 'finalized',
    documents: [],
    createdAt: '2026-07-22T11:20:00Z',
  },
  {
    id: 'rec-4',
    recordId: 'SMC-REC-2026-091',
    patientId: 'usr-patient-2',
    patientName: 'Ananya Sharma',
    doctorId: 'usr-doc-1',
    doctorName: 'Dr. Priya Rao',
    department: 'Cardiology',
    date: '2026-09-02',
    recordType: 'Cardiology Review',
    diagnosis: 'Benign Sinus Tachycardia (Stress-related)',
    consultationNotes: 'Echocardiogram reports left ventricular ejection fraction 62%, normal chamber dimensions, no valvular regurgitation. Holter monitoring showed occasional sinus tachycardia during exertion. Reassurance provided regarding benign etiology.',
    medicalHistoryNotes: 'Mild bronchial hyperactivity.',
    prescription: '1. Propranolol 10mg — PRN (as needed for palpitation episodes)\n2. Magnesium glycinate 200mg — Once daily evening',
    followUpDate: '2026-10-02',
    status: 'finalized',
    documents: [
      {
        id: 'doc-f4',
        name: 'Transthoracic_Echo_Doppler.pdf',
        size: '3.4 MB',
        type: 'application/pdf',
        cloudUrl: 'https://smartcare-cloud-storage.academic/records/ananya_echo.pdf',
        uploadedAt: '2026-09-02T12:00:00Z',
      },
    ],
    createdAt: '2026-09-02T12:00:00Z',
  },
  {
    id: 'rec-5',
    recordId: 'SMC-REC-2026-085',
    patientId: 'usr-patient-3',
    patientName: 'Rahul Verma',
    doctorId: 'usr-doc-2',
    doctorName: 'Dr. Arjun Mehta',
    department: 'General Medicine',
    date: '2026-08-28',
    recordType: 'General Consultation',
    diagnosis: 'Type 2 Diabetes Mellitus — Glycemic control fair (HbA1c 6.9%)',
    consultationNotes: 'Fasting glucose 118 mg/dL. Renal function normal (eGFR > 90). Fundoscopy examination negative for diabetic retinopathy. Foot sensation intact to 10g monofilament test.',
    medicalHistoryNotes: 'Diagnosed T2D in 2023. Strict adherence to diet.',
    prescription: '1. Metformin Extended Release 500mg — Twice daily with meals\n2. Glimepiride 1mg — Once daily before breakfast',
    followUpDate: '2026-11-28',
    status: 'finalized',
    documents: [],
    createdAt: '2026-08-28T10:15:00Z',
  },
];
