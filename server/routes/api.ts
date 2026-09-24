import { Router, Response } from 'express';
import { cloudDb } from '../services/dbService.js';
import { AuthenticatedRequest, requireRole } from '../middleware/auth.js';

const apiRouter = Router();

// ----------------------------------------------------
// 1. Auth & Session Routes (Universal Access enabled: Any credentials accepted)
// ----------------------------------------------------
apiRouter.post('/auth/login', (req, res) => {
  const { email, password, role } = req.body;

  // Accept any identifier or fallback to guest
  let cleanEmail = (typeof email === 'string' ? email : '').trim().toLowerCase();
  if (!cleanEmail) {
    cleanEmail = 'guest.user@smartcare.cloud';
  } else if (!cleanEmail.includes('@')) {
    cleanEmail = `${cleanEmail.replace(/[^a-z0-9._-]/g, '')}@smartcare.cloud`;
  }

  // Determine requested or default role
  const targetRole: 'patient' | 'doctor' | 'admin' =
    role === 'doctor' || role === 'admin' || role === 'patient' ? role : 'patient';

  // Ensure user and matching profile records exist dynamically in the cloud database
  const user = cloudDb.ensureUserWithRole(cleanEmail, targetRole);

  // Generate synthetic token
  const token = `user:${user.id}`;
  cloudDb.logAction('LOGIN_SUCCESS_UNIVERSAL', user.email, user.role, `Universal access granted into role ${user.role}`);

  return res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      phone: user.phone,
      status: user.status,
    },
    message: `Authentication accepted. Welcome, ${user.name}!`,
  });
});

apiRouter.post('/auth/register', (req, res) => {
  const { email, name, role = 'patient', phone = '' } = req.body;
  if (!email || !name) {
    return res.status(400).json({ error: 'Email and Name are required' });
  }

  const existing = cloudDb.getUserByEmail(email);
  if (existing) {
    return res.status(400).json({ error: 'An account with this email address already exists.' });
  }

  const newUser = cloudDb.createUser({
    email,
    name,
    role: role as 'patient' | 'doctor' | 'admin',
    phone,
    status: 'active',
  });

  const token = `user:${newUser.id}`;
  return res.status(201).json({
    token,
    user: newUser,
    message: 'User registered in central cloud database.',
  });
});

apiRouter.get('/auth/me', (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  const user = cloudDb.getUserById(req.user.id);
  return res.json({ user });
});

// ----------------------------------------------------
// 2. Patients Routes
// ----------------------------------------------------
apiRouter.get('/patients', (req: AuthenticatedRequest, res: Response) => {
  // If doctor or admin, return all or authorized patients. If patient, only self.
  if (req.user && req.user.role === 'patient') {
    const p = cloudDb.getPatientByUserId(req.user.id);
    return res.json({ patients: p ? [p] : [] });
  }
  const patients = cloudDb.getPatients();
  return res.json({ patients });
});

apiRouter.get('/patients/:id', (req: AuthenticatedRequest, res: Response) => {
  const patient = cloudDb.getPatientById(req.params.id) || cloudDb.getPatientByUserId(req.params.id);
  if (!patient) {
    return res.status(404).json({ error: 'Patient record not found in cloud database' });
  }

  // Verify access
  if (req.user && req.user.role === 'patient' && patient.userId !== req.user.id) {
    return res.status(403).json({ error: 'Access Restricted: Cannot inspect records of another patient.' });
  }

  const patientAppointments = cloudDb.getAppointmentsForPatient(patient.userId);
  const patientRecords = cloudDb.getRecordsForPatient(patient.userId);

  return res.json({
    patient,
    appointments: patientAppointments,
    medicalRecords: patientRecords,
  });
});

// ----------------------------------------------------
// 3. Doctors Routes
// ----------------------------------------------------
apiRouter.get('/doctors', (_req, res) => {
  const doctors = cloudDb.getDoctors();
  return res.json({ doctors });
});

apiRouter.get('/doctors/:id', (req, res) => {
  const doc = cloudDb.getDoctorById(req.params.id) || cloudDb.getDoctorByUserId(req.params.id);
  if (!doc) {
    return res.status(404).json({ error: 'Doctor not found' });
  }
  return res.json({ doctor: doc });
});

// ----------------------------------------------------
// 4. Appointments Routes
// ----------------------------------------------------
apiRouter.get('/appointments', (req: AuthenticatedRequest, res: Response) => {
  if (req.user) {
    if (req.user.role === 'patient') {
      const appts = cloudDb.getAppointmentsForPatient(req.user.id);
      return res.json({ appointments: appts });
    }
    if (req.user.role === 'doctor') {
      const appts = cloudDb.getAppointmentsForDoctor(req.user.id);
      return res.json({ appointments: appts });
    }
  }
  // Admin sees all
  const appts = cloudDb.getAppointments();
  return res.json({ appointments: appts });
});

apiRouter.post('/appointments', (req: AuthenticatedRequest, res: Response) => {
  const { doctorId, department, date, time, notes, patientId, patientName } = req.body;

  if (!doctorId || !date || !time) {
    return res.status(400).json({ error: 'doctorId, date, and time are required' });
  }

  const targetDoc = cloudDb.getDoctorById(doctorId) || cloudDb.getDoctorByUserId(doctorId);
  const docName = targetDoc ? targetDoc.name : 'Attending Specialist';
  const dep = department || (targetDoc ? targetDoc.specialization : 'General Medicine');

  const assignedPatientId = patientId || (req.user ? req.user.id : 'usr-patient-1');
  const assignedPatientName = patientName || (req.user ? req.user.name : 'Aarav Kumar');

  const newAppt = cloudDb.createAppointment({
    patientId: assignedPatientId,
    patientName: assignedPatientName,
    doctorId: targetDoc ? targetDoc.userId : doctorId,
    doctorName: docName,
    department: dep,
    date,
    time,
    notes,
  });

  return res.status(201).json({
    appointment: newAppt,
    message: 'Appointment successfully committed to central Cloud database.',
  });
});

apiRouter.patch('/appointments/:id/status', (req: AuthenticatedRequest, res: Response) => {
  const { status } = req.body;
  if (!['confirmed', 'completed', 'cancelled'].includes(status)) {
    return res.status(400).json({ error: 'Invalid appointment status' });
  }

  const updated = cloudDb.updateAppointmentStatus(req.params.id, status);
  if (!updated) {
    return res.status(404).json({ error: 'Appointment not found' });
  }

  return res.json({
    appointment: updated,
    message: `Appointment status updated to ${status}.`,
  });
});

// ----------------------------------------------------
// 5. Medical Records Routes
// ----------------------------------------------------
apiRouter.get('/medical-records', (req: AuthenticatedRequest, res: Response) => {
  if (req.user) {
    if (req.user.role === 'patient') {
      const records = cloudDb.getRecordsForPatient(req.user.id);
      return res.json({ records });
    }
    if (req.user.role === 'doctor') {
      const records = cloudDb.getRecordsForDoctor(req.user.id);
      return res.json({ records });
    }
  }
  const records = cloudDb.getMedicalRecords();
  return res.json({ records });
});

apiRouter.get('/medical-records/:id', (req: AuthenticatedRequest, res: Response) => {
  const record = cloudDb.getRecordById(req.params.id);
  if (!record) {
    return res.status(404).json({ error: 'Medical record not found' });
  }

  if (req.user && req.user.role === 'patient' && record.patientId !== req.user.id) {
    return res.status(403).json({ error: 'Access Restricted: You are not authorized to view this record.' });
  }

  return res.json({ record });
});

apiRouter.post(
  '/medical-records',
  requireRole('doctor', 'admin'),
  (req: AuthenticatedRequest, res: Response) => {
    const {
      patientId,
      patientName,
      department,
      date,
      recordType,
      diagnosis,
      consultationNotes,
      medicalHistoryNotes,
      prescription,
      followUpDate,
    } = req.body;

    if (!patientId || !diagnosis || !consultationNotes) {
      return res.status(400).json({ error: 'Missing required clinical documentation fields' });
    }

    const doctorName = req.user?.name || 'Dr. Priya Rao';
    const doctorId = req.user?.id || 'usr-doc-1';

    const newRecord = cloudDb.createMedicalRecord({
      patientId,
      patientName: patientName || 'Aarav Kumar',
      doctorId,
      doctorName,
      department: department || 'Cardiology',
      date: date || new Date().toISOString().split('T')[0],
      recordType: recordType || 'General Consultation',
      diagnosis,
      consultationNotes,
      medicalHistoryNotes,
      prescription: prescription || 'None prescribed.',
      followUpDate,
    });

    return res.status(201).json({
      record: newRecord,
      message: 'Digital medical record signed and stored in Cloud Storage & Firestore.',
    });
  }
);

// ----------------------------------------------------
// 6. Admin & System Management Routes
// ----------------------------------------------------
apiRouter.get('/admin/users', requireRole('admin'), (_req, res) => {
  const users = cloudDb.getUsers();
  return res.json({ users });
});

apiRouter.patch('/admin/users/:id/status', requireRole('admin'), (req, res) => {
  const { status } = req.body;
  if (!['active', 'inactive'].includes(status)) {
    return res.status(400).json({ error: 'Status must be active or inactive' });
  }

  const updated = cloudDb.updateUserStatus(req.params.id, status);
  if (!updated) {
    return res.status(404).json({ error: 'User not found' });
  }

  return res.json({ user: updated, message: 'User status successfully modified' });
});

apiRouter.get('/admin/audit-logs', requireRole('admin'), (_req, res) => {
  const logs = cloudDb.getAuditLogs();
  return res.json({ logs });
});

// ----------------------------------------------------
// 7. Cloud Monitoring & Infrastructure Status
// ----------------------------------------------------
apiRouter.get('/cloud-monitoring', (_req, res) => {
  const status = cloudDb.getCloudStatus();
  return res.json(status);
});

export default apiRouter;
