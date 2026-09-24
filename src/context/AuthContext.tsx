import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, NotificationItem } from '../types';
import { api } from '../services/apiService';
import {
  auth,
  signInWithGoogle as fbSignInWithGoogle,
  signOutFirebase,
  testFirestoreConnection,
  firebaseConfig,
} from '../firebase';
import { FirestoreService } from '../services/firestoreService';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';

interface AuthContextType {
  user: User | null;
  role: 'patient' | 'doctor' | 'admin' | null;
  activeView: string;
  setActiveView: (view: string) => void;
  loading: boolean;
  login: (email: string, role?: string) => Promise<void>;
  loginWithGoogle: (role?: 'patient' | 'doctor' | 'admin') => Promise<void>;
  register: (email: string, name: string, role: string, phone: string) => Promise<void>;
  logout: () => void;
  switchDemoRole: (role: 'patient' | 'doctor' | 'admin') => Promise<void>;
  notifications: NotificationItem[];
  unreadNotificationCount: number;
  markNotificationAsRead: (id: string) => void;
  clearNotifications: () => void;
  selectedRecordId: string | null;
  setSelectedRecordId: (id: string | null) => void;
  selectedPatientId: string | null;
  setSelectedPatientId: (id: string | null) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  firestoreConnected: boolean;
  firestoreDbId: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_EMAILS = {
  patient: 'aarav.kumar@patient.smartcare.cloud',
  doctor: 'dr.priya.rao@doctor.smartcare.cloud',
  admin: 'admin@smartcare.cloud',
};

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Firestore Database Online',
    message: `Connected to Cloud Firestore Enterprise (${firebaseConfig.firestoreDatabaseId}).`,
    timestamp: 'Just now',
    type: 'security',
    read: false,
  },
  {
    id: 'notif-2',
    title: 'Cloud Record Finalized',
    message: 'Central clinical documentation synced with Firestore persistence.',
    timestamp: '1 hour ago',
    type: 'record',
    read: false,
  },
  {
    id: 'notif-3',
    title: 'Security Gateway Verified',
    message: 'Role-Based Access token refreshed with 256-bit AES protocol.',
    timestamp: '3 hours ago',
    type: 'security',
    read: true,
  },
];

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [activeView, setActiveView] = useState<string>('landing');
  const [loading, setLoading] = useState<boolean>(true);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [firestoreConnected, setFirestoreConnected] = useState<boolean>(true);

  // Validate connection to Firestore on initial boot (Critical Skill Requirement)
  useEffect(() => {
    async function verifyFirestore() {
      try {
        const result = await testFirestoreConnection();
        setFirestoreConnected(result.connected);
      } catch (err) {
        console.warn('Firestore boot test status:', err);
      }
    }
    verifyFirestore();
  }, []);

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser: FirebaseUser | null) => {
      if (fbUser && !user) {
        // Map Firebase user to SmartCare User
        const email = fbUser.email || 'user@smartcare.cloud';
        const isAdminEmail = email === 'yadasomesh46@gmail.com' || email.includes('admin');
        const role = isAdminEmail ? 'admin' : 'patient';
        const mappedUser: User = {
          id: fbUser.uid,
          email,
          name: fbUser.displayName || 'Authorized User',
          role,
          phone: fbUser.phoneNumber || '+91 98450 12345',
          status: 'active',
          createdAt: new Date().toISOString(),
        };
        setUser(mappedUser);
        await FirestoreService.syncUser(mappedUser);
      }
    });
    return () => unsubscribe();
  }, [user]);

  // Restore stored session
  useEffect(() => {
    async function initAuth() {
      try {
        const storedToken = localStorage.getItem('smc_token');
        if (storedToken) {
          const me = await api.getMe();
          if (me) {
            setUser(me);
          }
        }
      } catch (err) {
        console.warn('Session verification fallback', err);
      } finally {
        setLoading(false);
      }
    }
    initAuth();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 4000);
  };

  const login = async (email: string, role?: string) => {
    setLoading(true);
    try {
      const data = await api.login(email, role);
      setUser(data.user);
      setActiveView('dashboard');
      // Sync user to Firestore
      FirestoreService.syncUser(data.user).catch((e) =>
        console.warn('Background Firestore user sync notice:', e)
      );
      showToast(`Welcome back, ${data.user.name} (${data.user.role.toUpperCase()})`);
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async (preferredRole: 'patient' | 'doctor' | 'admin' = 'patient') => {
    setLoading(true);
    try {
      const fbUser = await fbSignInWithGoogle();
      const email = fbUser.email || 'user@smartcare.cloud';
      const isSomeshAdmin = email === 'yadasomesh46@gmail.com' || email.includes('admin');
      const role = isSomeshAdmin ? 'admin' : preferredRole;

      const newUser: User = {
        id: fbUser.uid,
        email,
        name: fbUser.displayName || 'Google User',
        role,
        phone: fbUser.phoneNumber || '+91 98450 ' + Math.floor(10000 + Math.random() * 90000),
        status: 'active',
        createdAt: new Date().toISOString(),
      };

      // Set in api service local token
      localStorage.setItem('smc_token', `firebase:${fbUser.uid}`);
      localStorage.setItem('smc_user_id', newUser.id);
      localStorage.setItem('smc_user_role', newUser.role);

      setUser(newUser);
      setActiveView('dashboard');

      await FirestoreService.syncUser(newUser);
      showToast(`Google Authentication successful! Connected as ${newUser.name} [${newUser.role.toUpperCase()}]`);
    } catch (err: any) {
      console.error('Google Sign-In error:', err);
      showToast(err?.message || 'Google sign-in cancelled or failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, name: string, role: string, phone: string) => {
    setLoading(true);
    try {
      const data = await api.register(email, name, role, phone);
      setUser(data.user);
      setActiveView('dashboard');
      FirestoreService.syncUser(data.user).catch((e) =>
        console.warn('Background Firestore user sync notice:', e)
      );
      showToast(`Account created for ${data.user.name}`);
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    api.logout();
    signOutFirebase().catch(() => {});
    setUser(null);
    setActiveView('landing');
    showToast('Logged out of SmartCare Cloud session.');
  };

  const switchDemoRole = async (targetRole: 'patient' | 'doctor' | 'admin') => {
    setLoading(true);
    try {
      const targetEmail = DEMO_EMAILS[targetRole];
      const data = await api.login(targetEmail, targetRole);
      setUser(data.user);
      setActiveView('dashboard');
      FirestoreService.syncUser(data.user).catch(() => {});
      showToast(`Switched view to: ${data.user.name} [${targetRole.toUpperCase()}]`);
    } catch (err) {
      console.error('Failed to switch demo role', err);
      showToast('Role switch failed');
    } finally {
      setLoading(false);
    }
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const unreadNotificationCount = notifications.filter((n) => !n.read).length;

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user ? user.role : null,
        activeView,
        setActiveView,
        loading,
        login,
        loginWithGoogle,
        register,
        logout,
        switchDemoRole,
        notifications,
        unreadNotificationCount,
        markNotificationAsRead,
        clearNotifications,
        selectedRecordId,
        setSelectedRecordId,
        selectedPatientId,
        setSelectedPatientId,
        toastMessage,
        showToast,
        firestoreConnected,
        firestoreDbId: firebaseConfig.firestoreDatabaseId,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
