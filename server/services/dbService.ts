import {
  INITIAL_USERS,
  INITIAL_PATIENTS,
  INITIAL_DOCTORS,
  INITIAL_APPOINTMENTS,
  INITIAL_MEDICAL_RECORDS,
  UserRecord,
  PatientRecord,
  DoctorRecord,
  AppointmentRecord,
  MedicalRecordData,
} from '../data/syntheticData.js';

class CloudDatabaseService {
  private users: Map<string, UserRecord> = new Map();
  private patients: Map<string, PatientRecord> = new Map();
  private doctors: Map<string, DoctorRecord> = new Map();
  private appointments: Map<string, AppointmentRecord> = new Map();
  private medicalRecords: Map<string, MedicalRecordData> = new Map();
  private auditLogs: Array<{ id: string; timestamp: string; action: string; actor: string; role: string; details: string }> = [];

  constructor() {
    this.seedData();
  }

  private seedData() {
    INITIAL_USERS.forEach((u) => this.users.set(u.id, { ...u }));
    INITIAL_PATIENTS.forEach((p) => this.patients.set(p.id, { ...p }));
    INITIAL_DOCTORS.forEach((d) => this.doctors.set(d.id, { ...d }));
    INITIAL_APPOINTMENTS.forEach((a) => this.appointments.set(a.id, { ...a }));
    INITIAL_MEDICAL_RECORDS.forEach((m) => this.medicalRecords.set(m.id, { ...m }));

    this.auditLogs.push(
      {
        id: 'log-1',
        timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
        action: 'USER_AUTHENTICATED',
        actor: 'aarav.kumar@patient.smartcare.cloud',
        role: 'patient',
        details: 'Firebase Auth token verified with 256-bit AES session handshake',
      },
      {
        id: 'log-2',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        action: 'RECORD_ACCESSED',
        actor: 'dr.priya.rao@doctor.smartcare.cloud',
        role: 'doctor',
        details: 'Cloud Firestore encrypted read on /medicalRecords/SMC-REC-2026-089',
      },
      {
        id: 'log-3',
        timestamp: new Date(Date.now() - 1800000).toISOString(),
        action: 'APPOINTMENT_SCHEDULED',
        actor: 'aarav.kumar@patient.smartcare.cloud',
        role: 'patient',
        details: 'Multi-step cloud transaction committed to /appointments/apt-101',
      }
    );
  }

  // Users
  public getUsers(): UserRecord[] {
    return Array.from(this.users.values());
  }

  public getUserById(id: string): UserRecord | undefined {
    return this.users.get(id);
  }

  public getUserByEmail(email: string): UserRecord | undefined {
    return Array.from(this.users.values()).find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  public createUser(user: Omit<UserRecord, 'id' | 'createdAt'>): UserRecord {
    const id = `usr-${Date.now()}`;
    const newUser: UserRecord = {
      ...user,
      id,
      createdAt: new Date().toISOString(),
    };
    this.users.set(id, newUser);
    this.logAction('USER_CREATED', newUser.email, newUser.role, `Account provisioned with status: ${newUser.status}`);
    return newUser;
  }

  public ensurePatientRecord(user: UserRecord): PatientRecord {
    let patient = this.getPatientByUserId(user.id);
    if (!patient) {
      const id = `pat-${user.id}`;
      patient = {
        id,
        userId: user.id,
        name: user.name,
        age: 32,
        gender: 'Other',
        bloodGroup: 'O+',
        emergencyContact: '+91 98450 11223',
        medicalHistory: 'Regular wellness tracking and consultation.',
        lastVisit: '2026-09-18',
        nextAppointment: '2026-10-02',
        status: 'Active',
        createdAt: new Date().toISOString(),
      };
      this.patients.set(id, patient);
    }
    return patient;
  }

  public ensureDoctorRecord(user: UserRecord): DoctorRecord {
    let doctor = this.getDoctorByUserId(user.id);
    if (!doctor) {
      const id = `doc-${user.id}`;
      doctor = {
        id,
        userId: user.id,
        name: user.name.startsWith('Dr.') ? user.name : `Dr. ${user.name}`,
        specialization: user.specialization || 'Internal Medicine & Cloud Care',
        department: 'General Medicine',
        qualification: 'MBBS, MD',
        experienceYears: 10,
        availabilityDays: 'Mon - Fri',
        availabilityHours: '09:00 AM - 05:00 PM',
        consultationFee: 750,
        rating: 4.9,
        totalPatients: 120,
        createdAt: new Date().toISOString(),
      };
      this.doctors.set(id, doctor);
    }
    return doctor;
  }

  public ensureUserWithRole(email: string, role: 'patient' | 'doctor' | 'admin' = 'patient', customName?: string): UserRecord {
    let user = this.getUserByEmail(email);
    if (!user) {
      const rawName = customName || email.split('@')[0];
      const formatted = rawName
        .split(/[._-]/)
        .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
        .join(' ') || 'Cloud User';

      const finalName = role === 'doctor' && !formatted.startsWith('Dr') ? `Dr. ${formatted}` : formatted;

      user = this.createUser({
        email,
        name: finalName,
        role,
        phone: '+91 98450 ' + Math.floor(10000 + Math.random() * 90000),
        status: 'active',
      });
    } else {
      if (role && user.role !== role) {
        user.role = role;
      }
      user.status = 'active';
    }

    if (user.role === 'patient') {
      this.ensurePatientRecord(user);
    } else if (user.role === 'doctor') {
      this.ensureDoctorRecord(user);
    }

    return user;
  }

  public updateUserStatus(id: string, status: 'active' | 'inactive'): UserRecord | null {
    const user = this.users.get(id);
    if (!user) return null;
    user.status = status;
    this.users.set(id, user);
    this.logAction('USER_STATUS_UPDATED', user.email, 'admin', `User status toggled to ${status}`);
    return user;
  }

  // Patients
  public getPatients(): PatientRecord[] {
    return Array.from(this.patients.values());
  }

  public getPatientByUserId(userId: string): PatientRecord | undefined {
    return Array.from(this.patients.values()).find((p) => p.userId === userId);
  }

  public getPatientById(id: string): PatientRecord | undefined {
    return this.patients.get(id);
  }

  // Doctors
  public getDoctors(): DoctorRecord[] {
    return Array.from(this.doctors.values());
  }

  public getDoctorByUserId(userId: string): DoctorRecord | undefined {
    return Array.from(this.doctors.values()).find((d) => d.userId === userId);
  }

  public getDoctorById(id: string): DoctorRecord | undefined {
    return this.doctors.get(id);
  }

  // Appointments
  public getAppointments(): AppointmentRecord[] {
    return Array.from(this.appointments.values()).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  public getAppointmentsForPatient(patientId: string): AppointmentRecord[] {
    return this.getAppointments().filter((a) => a.patientId === patientId);
  }

  public getAppointmentsForDoctor(doctorId: string): AppointmentRecord[] {
    return this.getAppointments().filter((a) => a.doctorId === doctorId);
  }

  public createAppointment(data: {
    patientId: string;
    patientName: string;
    doctorId: string;
    doctorName: string;
    department: string;
    date: string;
    time: string;
    notes?: string;
  }): AppointmentRecord {
    const id = `apt-${Date.now()}`;
    const newAppointment: AppointmentRecord = {
      id,
      patientId: data.patientId,
      patientName: data.patientName,
      doctorId: data.doctorId,
      doctorName: data.doctorName,
      department: data.department,
      date: data.date,
      time: data.time,
      status: 'confirmed',
      notes: data.notes || 'Routine consultation booking via SmartCare Cloud portal',
      createdAt: new Date().toISOString(),
    };

    this.appointments.set(id, newAppointment);
    this.logAction(
      'APPOINTMENT_BOOKED',
      data.patientName,
      'patient',
      `Confirmed visit with ${data.doctorName} (${data.department}) on ${data.date} at ${data.time}`
    );
    return newAppointment;
  }

  public updateAppointmentStatus(id: string, status: 'confirmed' | 'completed' | 'cancelled'): AppointmentRecord | null {
    const appt = this.appointments.get(id);
    if (!appt) return null;
    appt.status = status;
    appt.updatedAt = new Date().toISOString();
    this.appointments.set(id, appt);
    this.logAction('APPOINTMENT_MODIFIED', appt.patientName, 'user', `Status changed to ${status}`);
    return appt;
  }

  // Medical Records
  public getMedicalRecords(): MedicalRecordData[] {
    return Array.from(this.medicalRecords.values()).sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }

  public getRecordsForPatient(patientId: string): MedicalRecordData[] {
    return this.getMedicalRecords().filter((r) => r.patientId === patientId);
  }

  public getRecordsForDoctor(doctorId: string): MedicalRecordData[] {
    return this.getMedicalRecords().filter((r) => r.doctorId === doctorId);
  }

  public getRecordById(id: string): MedicalRecordData | undefined {
    return this.medicalRecords.get(id);
  }

  public createMedicalRecord(data: {
    patientId: string;
    patientName: string;
    doctorId: string;
    doctorName: string;
    department: string;
    date: string;
    recordType: MedicalRecordData['recordType'];
    diagnosis: string;
    consultationNotes: string;
    medicalHistoryNotes?: string;
    prescription: string;
    followUpDate?: string;
  }): MedicalRecordData {
    const count = this.medicalRecords.size + 1;
    const year = new Date().getFullYear();
    const formattedId = `SMC-REC-${year}-${String(count + 100).padStart(3, '0')}`;
    const id = `rec-${Date.now()}`;

    const newRecord: MedicalRecordData = {
      id,
      recordId: formattedId,
      patientId: data.patientId,
      patientName: data.patientName,
      doctorId: data.doctorId,
      doctorName: data.doctorName,
      department: data.department,
      date: data.date,
      recordType: data.recordType,
      diagnosis: data.diagnosis,
      consultationNotes: data.consultationNotes,
      medicalHistoryNotes: data.medicalHistoryNotes || 'Patient history reviewed during consultation.',
      prescription: data.prescription,
      followUpDate: data.followUpDate || 'As needed',
      status: 'finalized',
      documents: [
        {
          id: `doc-${Date.now()}`,
          name: `Clinical_Summary_${data.patientName.replace(/\s+/g, '_')}.pdf`,
          size: '1.1 MB',
          type: 'application/pdf',
          cloudUrl: `https://smartcare-cloud-storage.academic/records/${data.patientId}_summary.pdf`,
          uploadedAt: new Date().toISOString(),
        },
      ],
      createdAt: new Date().toISOString(),
    };

    this.medicalRecords.set(id, newRecord);
    this.logAction(
      'MEDICAL_RECORD_CREATED',
      data.doctorName,
      'doctor',
      `Authored record ${formattedId} for patient ${data.patientName}`
    );
    return newRecord;
  }

  // Audit Logs
  public getAuditLogs() {
    return [...this.auditLogs].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  public logAction(action: string, actor: string, role: string, details: string) {
    const log = {
      id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      timestamp: new Date().toISOString(),
      action,
      actor,
      role,
      details,
    };
    this.auditLogs.unshift(log);
    if (this.auditLogs.length > 50) this.auditLogs.pop();
  }

  // Cloud Monitoring & Stats
  public getCloudStatus() {
    return {
      status: 'Operational',
      platform: 'SmartCare Cloud Infrastructure v2.4 (Academic Prototype)',
      region: 'asia-east1 (Cloud Run + Cloud Firestore)',
      dataMode: 'Synthetic Academic Data Only',
      services: [
        { name: 'Firebase Authentication', status: 'Operational', latencyMs: 24, uptime: '99.98%', protocol: 'OAuth 2.0 / JWT' },
        { name: 'Cloud Firestore (Central NoSQL)', status: 'Operational', latencyMs: 18, uptime: '99.99%', protocol: 'gRPC / TLS 1.3' },
        { name: 'Cloud Storage (Medical Vault)', status: 'Operational', latencyMs: 32, uptime: '99.95%', protocol: 'HTTPS / AES-256' },
        { name: 'Express REST Gateway', status: 'Operational', latencyMs: 12, uptime: '100%', protocol: 'HTTP/2 Node.js' },
      ],
      metrics: {
        activeUsers: this.users.size,
        totalPatients: this.patients.size,
        totalDoctors: this.doctors.size,
        totalAppointments: this.appointments.size,
        totalMedicalRecords: this.medicalRecords.size,
        totalCloudDocuments: Array.from(this.medicalRecords.values()).reduce((acc, r) => acc + r.documents.length, 0),
        storageUsageMB: 48.6,
        firestoreReadCount24h: 1240,
        firestoreWriteCount24h: 218,
        activeSyncSessions: 14,
      },
      lastHealthCheck: new Date().toISOString(),
    };
  }
}

export const cloudDb = new CloudDatabaseService();
