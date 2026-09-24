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
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { User, Patient, Doctor, Appointment, MedicalRecord } from '../types';

export class FirestoreService {
  // --------------------------------------------------------------------------
  // Users Collection
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
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );
    } catch (err) {
      console.warn('Firestore sync user notice (rules or offline):', err);
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
      handleFirestoreError(err, OperationType.LIST, path);
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

  static subscribeToPatients(callback: (patients: Patient[]) => void, onError?: (err: any) => void) {
    const path = 'patients';
    return onSnapshot(
      collection(db, 'patients'),
      (snap) => {
        const patients: Patient[] = [];
        snap.forEach((d) => patients.push({ id: d.id, ...d.data() } as Patient));
        callback(patients);
      },
      (error) => {
        if (onError) onError(error);
        else console.warn('[Firestore] Patients subscription error:', error);
      }
    );
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
      return docs;
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, path);
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
      handleFirestoreError(err, OperationType.LIST, path);
    }
  }

  static async createAppointment(appointment: Appointment): Promise<void> {
    const path = `appointments/${appointment.id}`;
    try {
      await setDoc(doc(db, 'appointments', appointment.id), {
        ...appointment,
        createdAt: appointment.createdAt || new Date().toISOString(),
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
      handleFirestoreError(err, OperationType.LIST, path);
    }
  }

  static async createMedicalRecord(record: MedicalRecord): Promise<void> {
    const path = `medicalRecords/${record.id}`;
    try {
      await setDoc(doc(db, 'medicalRecords', record.id), {
        ...record,
        createdAt: record.createdAt || new Date().toISOString(),
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, path);
    }
  }

  // --------------------------------------------------------------------------
  // Diagnostic Seeding / Batch Sync to Firestore
  // --------------------------------------------------------------------------
  static async seedInitialRecords(records: {
    patients?: Patient[];
    doctors?: Doctor[];
    appointments?: Appointment[];
    medicalRecords?: MedicalRecord[];
  }): Promise<{ syncedCount: number }> {
    let count = 0;
    try {
      if (records.patients) {
        for (const p of records.patients) {
          await setDoc(doc(db, 'patients', p.id), p, { merge: true });
          count++;
        }
      }
      if (records.doctors) {
        for (const d of records.doctors) {
          await setDoc(doc(db, 'doctors', d.id), d, { merge: true });
          count++;
        }
      }
      if (records.appointments) {
        for (const a of records.appointments) {
          await setDoc(doc(db, 'appointments', a.id), a, { merge: true });
          count++;
        }
      }
      if (records.medicalRecords) {
        for (const m of records.medicalRecords) {
          await setDoc(doc(db, 'medicalRecords', m.id), m, { merge: true });
          count++;
        }
      }
    } catch (err) {
      console.warn('Firestore initial seeding partial sync notice:', err);
    }
    return { syncedCount: count };
  }
}
