import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, NotificationItem } from '../types';
import { api } from '../services/apiService';

interface AuthContextType {
  user: User | null;
  role: 'patient' | 'doctor' | 'admin' | null;
  activeView: string;
  setActiveView: (view: string) => void;
  loading: boolean;
  login: (email: string, role?: string) => Promise<void>;
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
    title: 'Appointment Confirmed',
    message: 'Cardiology consultation with Dr. Priya Rao confirmed for 18 Sep 2026, 10:30 AM.',
    timestamp: '10 minutes ago',
    type: 'appointment',
    read: false,
  },
  {
    id: 'notif-2',
    title: 'Cloud Record Finalized',
    message: 'New consultation summary (SMC-REC-2026-089) synced to Central Cloud Storage.',
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
      showToast(`Welcome back, ${data.user.name} (${data.user.role.toUpperCase()})`);
    } catch (err) {
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
      showToast(`Account created for ${data.user.name}`);
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    api.logout();
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
