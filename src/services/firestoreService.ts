import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { User, Patient, Doctor, Appointment, MedicalRecord } from '../types';
import {
  INITIAL_SMARTCARE_USERS,
  INITIAL_SMARTCARE_PATIENTS,
  INITIAL_SMARTCARE_DOCTORS,
  INITIAL_SMARTCARE_APPOINTMENTS,
  INITIAL_SMARTCARE_RECORDS,
} from '../data/projectData';

export class FirestoreService {
  // --------------------------------------------------------------------------
  // Users Collection & Role Access
  // --------------------------------------------------------------------------
  static async getUser(userId: string): Promise<User | null> {
    const path = `users/${userId}`;
    try {
      const snap = await getDoc(doc(db, 'users', userId));
      if (!snap.exists()) return null;
      return snap.data() as User;
    } catch (err) {
      handleFirestoreError(err, OperationType.GET, path);
    }
  }

  static async syncUser(user: User): Promise<void> {
    const path = `users/${user.id}`;
    try {
      await setDoc(
        doc(db, 'users', user.id),
        {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone || '',
          status: user.status || 'active',
          lastLoginAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );
    } catch (err) {
      console.warn('Firestore sync user notice:', err);
    }
  }

  /**
   * Stores and provisions profile records in Firestore based on user role
   */
  static async ensureUserRoleAndProfile(user: User): Promise<void> {
    try {
      // 1. Store User document
      await this.syncUser(user);

      // 2. Role-specific collection storage
      if (user.role === 'patient') {
        const patientDocId = `pat-${user.id}`;
        const existingSnap = await getDoc(doc(db, 'patients', patientDocId));
        if (!existingSnap.exists()) {
          const newPatient: Patient = {
            id: patientDocId,
            userId: user.id,
            name: user.name,
            age: 32,
            gender: 'Other',
            bloodGroup: 'O+',
            emergencyContact: user.phone || '+91 98450 11223',
            medicalHistory: 'Primary clinical profile initialized in Firestore.',
            lastVisit: new Date().toISOString().split('T')[0],
            status: 'Active',
            createdAt: new Date().toISOString(),
          };
          await setDoc(doc(db, 'patients', patientDocId), newPatient, { merge: true });
        }
      } else if (user.role === 'doctor') {
        const docId = `doc-${user.id}`;
        const existingSnap = await getDoc(doc(db, 'doctors', docId));
        if (!existingSnap.exists()) {
          const newDoctor: Doctor = {
            id: docId,
            userId: user.id,
            name: user.name.startsWith('Dr.') ? user.name : `Dr. ${user.name}`,
            specialization: 'Internal Medicine & Cloud Care',
            department: 'General Medicine',
            qualification: 'MBBS, MD',
            experienceYears: 8,
            availabilityDays: 'Monday - Friday',
            availabilityHours: '09:00 AM - 04:00 PM',
            consultationFee: 900,
            rating: 5.0,
            totalPatients: 1,
            createdAt: new Date().toISOString(),
          };
          await setDoc(doc(db, 'doctors', docId), newDoctor, { merge: true });
        }
      }
    } catch (err) {
      console.warn('Firestore role profile provision notice:', err);
    }
  }

  // --------------------------------------------------------------------------
  // Patients Collection
  // --------------------------------------------------------------------------
  static async getPatients(): Promise<Patient[]> {
    const path = 'patients';
    try {
      const snap = await getDocs(collection(db, 'patients'));
      const patients: Patient[] = [];
      snap.forEach((d) => patients.push({ id: d.id, ...d.data() } as Patient));
      return patients;
    } catch (err) {
      console.warn('Firestore getPatients fallback:', err);
      return INITIAL_SMARTCARE_PATIENTS;
    }
  }

  static async savePatient(patient: Patient): Promise<void> {
    const path = `patients/${patient.id}`;
    try {
      await setDoc(doc(db, 'patients', patient.id), {
        ...patient,
        updatedAt: new Date().toISOString(),
      }, { merge: true });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, path);
    }
  }

  // --------------------------------------------------------------------------
  // Doctors Collection
  // --------------------------------------------------------------------------
  static async getDoctors(): Promise<Doctor[]> {
    const path = 'doctors';
    try {
      const snap = await getDocs(collection(db, 'doctors'));
      const docs: Doctor[] = [];
      snap.forEach((d) => docs.push({ id: d.id, ...d.data() } as Doctor));
      return docs.length > 0 ? docs : INITIAL_SMARTCARE_DOCTORS;
    } catch (err) {
      console.warn('Firestore getDoctors fallback:', err);
      return INITIAL_SMARTCARE_DOCTORS;
    }
  }

  static async saveDoctor(doctor: Doctor): Promise<void> {
    const path = `doctors/${doctor.id}`;
    try {
      await setDoc(doc(db, 'doctors', doctor.id), {
        ...doctor,
        updatedAt: new Date().toISOString(),
      }, { merge: true });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, path);
    }
  }

  // --------------------------------------------------------------------------
  // Appointments Collection
  // --------------------------------------------------------------------------
  static async getAppointments(): Promise<Appointment[]> {
    const path = 'appointments';
    try {
      const snap = await getDocs(collection(db, 'appointments'));
      const list: Appointment[] = [];
      snap.forEach((d) => list.push({ id: d.id, ...d.data() } as Appointment));
      return list;
    } catch (err) {
      console.warn('Firestore getAppointments fallback:', err);
      return [];
    }
  }

  static async createAppointment(appointment: Appointment): Promise<void> {
    const path = `appointments/${appointment.id}`;
    try {
      await setDoc(doc(db, 'appointments', appointment.id), {
        ...appointment,
        createdAt: appointment.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, path);
    }
  }

  static async updateAppointmentStatus(appointmentId: string, status: 'confirmed' | 'completed' | 'cancelled'): Promise<void> {
    const path = `appointments/${appointmentId}`;
    try {
      await updateDoc(doc(db, 'appointments', appointmentId), {
        status,
        updatedAt: new Date().toISOString(),
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, path);
    }
  }

  // --------------------------------------------------------------------------
  // Medical Records Collection
  // --------------------------------------------------------------------------
  static async getMedicalRecords(): Promise<MedicalRecord[]> {
    const path = 'medicalRecords';
    try {
      const snap = await getDocs(collection(db, 'medicalRecords'));
      const records: MedicalRecord[] = [];
      snap.forEach((d) => records.push({ id: d.id, ...d.data() } as MedicalRecord));
      return records;
    } catch (err) {
      console.warn('Firestore getMedicalRecords fallback:', err);
      return [];
    }
  }

  static async createMedicalRecord(record: MedicalRecord): Promise<void> {
    const path = `medicalRecords/${record.id}`;
    try {
      await setDoc(doc(db, 'medicalRecords', record.id), {
        ...record,
        createdAt: record.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, path);
    }
  }

  // --------------------------------------------------------------------------
  // SmartCare Project Data Seeding & Real-Time Sync
  // --------------------------------------------------------------------------
  static async seedSmartCareProjectData(): Promise<{ totalStored: number }> {
    let count = 0;
    try {
      // 1. Sync Users
      for (const u of INITIAL_SMARTCARE_USERS) {
        await setDoc(doc(db, 'users', u.id), u, { merge: true });
        count++;
      }

      // 2. Sync Patients
      for (const p of INITIAL_SMARTCARE_PATIENTS) {
        await setDoc(doc(db, 'patients', p.id), p, { merge: true });
        count++;
      }

      // 3. Sync Doctors
      for (const d of INITIAL_SMARTCARE_DOCTORS) {
        await setDoc(doc(db, 'doctors', d.id), d, { merge: true });
        count++;
      }

      // 4. Sync Appointments
      for (const a of INITIAL_SMARTCARE_APPOINTMENTS) {
        await setDoc(doc(db, 'appointments', a.id), a, { merge: true });
        count++;
      }

      // 5. Sync Medical Records
      for (const m of INITIAL_SMARTCARE_RECORDS) {
        await setDoc(doc(db, 'medicalRecords', m.id), m, { merge: true });
        count++;
      }

      console.log(`[Firestore] Successfully stored ${count} SmartCare project records into Firestore.`);
    } catch (err) {
      console.warn('Firestore SmartCare project data sync notice:', err);
    }
    return { totalStored: count };
  }
}
