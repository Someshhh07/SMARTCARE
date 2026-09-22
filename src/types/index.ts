export type UserRole = 'patient' | 'doctor' | 'admin';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  phone: string;
  status: 'active' | 'inactive';
  createdAt: string;
  specialization?: string;
  department?: string;
}

export interface Patient {
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

export interface Doctor {
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

export interface Appointment {
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

export interface MedicalRecord {
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

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'appointment' | 'record' | 'system' | 'security';
  read: boolean;
}

export interface CloudMonitoringStatus {
  status: string;
  platform: string;
  region: string;
  dataMode: string;
  services: Array<{
    name: string;
    status: string;
    latencyMs: number;
    uptime: string;
    protocol: string;
  }>;
  metrics: {
    activeUsers: number;
    totalPatients: number;
    totalDoctors: number;
    totalAppointments: number;
    totalMedicalRecords: number;
    totalCloudDocuments: number;
    storageUsageMB: number;
    firestoreReadCount24h: number;
    firestoreWriteCount24h: number;
    activeSyncSessions: number;
  };
  lastHealthCheck: string;
}
