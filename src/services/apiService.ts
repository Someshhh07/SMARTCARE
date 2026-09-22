import { User, Patient, Doctor, Appointment, MedicalRecord, CloudMonitoringStatus } from '../types';

class ApiService {
  private getHeaders(): HeadersInit {
    const token = localStorage.getItem('smc_token') || '';
    const userId = localStorage.getItem('smc_user_id') || '';
    return {
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
      'x-user-id': userId,
    };
  }

  // Auth
  async login(email: string, role?: string): Promise<{ user: User; token: string }> {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, role }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Login failed' }));
      throw new Error(err.error || 'Authentication error');
    }
    const data = await res.json();
    localStorage.setItem('smc_token', data.token);
    localStorage.setItem('smc_user_id', data.user.id);
    localStorage.setItem('smc_user_role', data.user.role);
    return data;
  }

  async register(email: string, name: string, role: string = 'patient', phone: string = ''): Promise<{ user: User; token: string }> {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, name, role, phone }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Registration failed' }));
      throw new Error(err.error || 'Registration error');
    }
    const data = await res.json();
    localStorage.setItem('smc_token', data.token);
    localStorage.setItem('smc_user_id', data.user.id);
    localStorage.setItem('smc_user_role', data.user.role);
    return data;
  }

  async getMe(): Promise<User | null> {
    const res = await fetch('/api/auth/me', { headers: this.getHeaders() });
    if (!res.ok) return null;
    const data = await res.json();
    return data.user;
  }

  logout() {
    localStorage.removeItem('smc_token');
    localStorage.removeItem('smc_user_id');
    localStorage.removeItem('smc_user_role');
  }

  // Patients
  async getPatients(): Promise<Patient[]> {
    const res = await fetch('/api/patients', { headers: this.getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch patients');
    const data = await res.json();
    return data.patients || [];
  }

  async getPatientDetails(id: string): Promise<{ patient: Patient; appointments: Appointment[]; medicalRecords: MedicalRecord[] }> {
    const res = await fetch(`/api/patients/${id}`, { headers: this.getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch patient records');
    return res.json();
  }

  // Doctors
  async getDoctors(): Promise<Doctor[]> {
    const res = await fetch('/api/doctors', { headers: this.getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch doctors');
    const data = await res.json();
    return data.doctors || [];
  }

  // Appointments
  async getAppointments(): Promise<Appointment[]> {
    const res = await fetch('/api/appointments', { headers: this.getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch appointments');
    const data = await res.json();
    return data.appointments || [];
  }

  async createAppointment(data: {
    doctorId: string;
    department: string;
    date: string;
    time: string;
    notes?: string;
    patientId?: string;
    patientName?: string;
  }): Promise<Appointment> {
    const res = await fetch('/api/appointments', {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Failed to create appointment' }));
      throw new Error(err.error || 'Failed to book appointment');
    }
    const result = await res.json();
    return result.appointment;
  }

  async updateAppointmentStatus(id: string, status: 'confirmed' | 'completed' | 'cancelled'): Promise<Appointment> {
    const res = await fetch(`/api/appointments/${id}/status`, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error('Failed to update appointment');
    const result = await res.json();
    return result.appointment;
  }

  // Medical Records
  async getMedicalRecords(): Promise<MedicalRecord[]> {
    const res = await fetch('/api/medical-records', { headers: this.getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch medical records');
    const data = await res.json();
    return data.records || [];
  }

  async getMedicalRecord(id: string): Promise<MedicalRecord> {
    const res = await fetch(`/api/medical-records/${id}`, { headers: this.getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch medical record detail');
    const data = await res.json();
    return data.record;
  }

  async createMedicalRecord(payload: {
    patientId: string;
    patientName: string;
    department: string;
    date: string;
    recordType: MedicalRecord['recordType'];
    diagnosis: string;
    consultationNotes: string;
    medicalHistoryNotes?: string;
    prescription: string;
    followUpDate?: string;
  }): Promise<MedicalRecord> {
    const res = await fetch('/api/medical-records', {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Failed to save record' }));
      throw new Error(err.error || 'Failed to create medical record');
    }
    const data = await res.json();
    return data.record;
  }

  // Admin
  async getAdminUsers(): Promise<User[]> {
    const res = await fetch('/api/admin/users', { headers: this.getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch users (Admin permission required)');
    const data = await res.json();
    return data.users || [];
  }

  async updateUserStatus(id: string, status: 'active' | 'inactive'): Promise<User> {
    const res = await fetch(`/api/admin/users/${id}/status`, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error('Failed to update user status');
    const data = await res.json();
    return data.user;
  }

  // Cloud Monitoring
  async getCloudMonitoring(): Promise<CloudMonitoringStatus> {
    const res = await fetch('/api/cloud-monitoring');
    if (!res.ok) throw new Error('Failed to fetch cloud infrastructure telemetry');
    return res.json();
  }
}

export const api = new ApiService();
