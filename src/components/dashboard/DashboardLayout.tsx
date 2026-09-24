import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Cloud,
  LayoutDashboard,
  Calendar,
  FileText,
  Users,
  Stethoscope,
  ShieldCheck,
  Activity,
  Server,
  Network,
  LogOut,
  Bell,
  Search,
  Settings,
  ChevronDown,
  Menu,
  X,
  User as UserIcon,
  CheckCircle2,
  Lock,
  Sparkles,
  ExternalLink,
  ShieldAlert,
  Sliders,
  Smartphone,
  Database,
  RefreshCw,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { AcademicBadge } from '../common/AcademicBadge';
import { PersistentBanner } from '../common/PersistentBanner';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  activeNav: string;
  onNavigate: (nav: string) => void;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  title,
  subtitle,
  activeNav,
  onNavigate,
}) => {
  const {
    user,
    role,
    logout,
    switchDemoRole,
    notifications,
    unreadNotificationCount,
    markNotificationAsRead,
    clearNotifications,
    toastMessage,
    firestoreConnected,
    firestoreDbId,
    syncProjectDataToFirestore,
  } = useAuth();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Role metadata for header and sidebar branding
  const getRoleBadge = () => {
    switch (role) {
      case 'doctor':
        return {
          title: 'ATTENDING CLINICIAN',
          badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200/80',
          dotColor: 'bg-emerald-500',
          portalLabel: 'Doctor Clinical Portal',
        };
      case 'admin':
        return {
          title: 'SYSTEM ADMINISTRATOR',
          badgeClass: 'bg-indigo-50 text-indigo-800 border-indigo-200/80',
          dotColor: 'bg-indigo-500',
          portalLabel: 'Admin Central Console',
        };
      default:
        return {
          title: 'PATIENT HEALTH VAULT',
          badgeClass: 'bg-teal-50 text-teal-800 border-teal-200/80',
          dotColor: 'bg-teal-500',
          portalLabel: 'Patient Portal',
        };
    }
  };

  const roleMeta = getRoleBadge();

  // Determine navigation menu items based on role
  const getNavItems = () => {
    if (role === 'doctor') {
      return [
        { id: 'dashboard', label: 'Clinical Overview', icon: LayoutDashboard, category: 'Core Workflow' },
        { id: 'appointments', label: 'Outpatient Agenda', icon: Calendar, category: 'Core Workflow' },
        { id: 'patients', label: 'My Patients', icon: Users, category: 'Clinical Records' },
        { id: 'medical-records', label: 'EHR Documentation', icon: FileText, category: 'Clinical Records' },
        { id: 'monitoring', label: 'Infrastructure Status', icon: Server, category: 'Operations' },
      ];
    }
    if (role === 'admin') {
      return [
        { id: 'dashboard', label: 'Command Center', icon: LayoutDashboard, category: 'Overview' },
        { id: 'users', label: 'User Governance', icon: Users, category: 'Security & Access' },
        { id: 'rbac-matrix', label: 'RBAC Access Matrix', icon: ShieldCheck, category: 'Security & Access' },
        { id: 'patients', label: 'Patients Directory', icon: UserIcon, category: 'Data Management' },
        { id: 'doctors', label: 'Doctors Directory', icon: Stethoscope, category: 'Data Management' },
        { id: 'appointments', label: 'Appointments Master', icon: Calendar, category: 'Data Management' },
        { id: 'medical-records', label: 'Medical Records Vault', icon: FileText, category: 'Data Management' },
        { id: 'monitoring', label: 'Cloud Telemetry', icon: Server, category: 'Infrastructure' },
        { id: 'architecture-view', label: 'Data Architecture', icon: Network, category: 'Infrastructure' },
      ];
    }
    // Default: Patient
    return [
      { id: 'dashboard', label: 'Health Overview', icon: LayoutDashboard, category: 'My Health' },
      { id: 'appointments', label: 'My Appointments', icon: Calendar, category: 'My Health' },
      { id: 'medical-records', label: 'Medical Records', icon: FileText, category: 'My Health' },
      { id: 'architecture-view', label: 'Data Privacy Flow', icon: Network, category: 'Cloud Security' },
      { id: 'monitoring', label: 'System Health', icon: Server, category: 'Cloud Security' },
    ];
  };

  const navItems = getNavItems();

  return (
    <div id="dashboard-container" className="min-h-screen bg-[#F8FAFC] flex text-slate-900 font-sans">
      {/* Toast Alert Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-950/95 text-white px-4.5 py-3 rounded-2xl shadow-xl shadow-slate-950/20 border border-slate-800 text-xs font-medium flex items-center gap-3 backdrop-blur-md animate-in slide-in-from-bottom-3 duration-200">
          <span className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-pulse ring-2 ring-teal-400/30"></span>
          <span className="text-slate-200">{toastMessage}</span>
        </div>
      )}

      {/* =========================================================================
          DESKTOP FIXED LEFT SIDEBAR (Width: w-64, fixed left:0, top:0, bottom:0)
          ========================================================================= */}
      <aside
        id="desktop-fixed-sidebar"
        className="hidden lg:flex flex-col w-64 fixed inset-y-0 left-0 bg-white border-r border-slate-200/90 z-40 select-none shadow-[1px_0_4px_rgba(0,0,0,0.02)]"
      >
        {/* Brand / Logo */}
        <div className="h-18 flex items-center gap-3 px-6 border-b border-slate-100/90 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex items-center justify-center text-teal-300 shadow-sm border border-slate-800/40 shrink-0">
            <Cloud className="w-5 h-5 text-teal-400" />
          </div>
          <div className="min-w-0">
            <div className="font-extrabold text-sm tracking-tight text-slate-900 leading-tight">
              SMARTCARE <span className="text-teal-600 font-black">CLOUD</span>
            </div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 truncate mt-0.5">
              {roleMeta.portalLabel}
            </div>
          </div>
        </div>

        {/* Role-Specific Navigation Menu */}
        <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-1.5 scrollbar-thin">
          <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">
            Navigation
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = activeNav === item.id;
            return (
              <button
                key={item.id}
                id={`sidebar-nav-${item.id}`}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer relative group ${
                  active
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      active ? 'text-teal-400' : 'text-slate-400 group-hover:text-slate-700'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {active && (
                  <span className="w-1.5 h-4 rounded-full bg-teal-400 shrink-0"></span>
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom Section: 1-Click Persona Switcher, Settings & Logout */}
        <div className="p-3.5 border-t border-slate-100/90 shrink-0 space-y-2.5 bg-slate-50/50">
          {/* Persona Switcher Box (Fast evaluation testing) */}
          <div className="p-2.5 rounded-xl bg-white border border-slate-200/80 shadow-2xs space-y-2">
            <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              <span>Persona Switcher</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-teal-50 text-teal-700 font-semibold border border-teal-200/60">
                1-Click Demo
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1">
              <button
                onClick={() => switchDemoRole('patient')}
                className={`py-1.5 text-[10px] font-bold rounded-lg transition-all duration-150 cursor-pointer text-center ${
                  role === 'patient'
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200/70'
                }`}
              >
                Patient
              </button>
              <button
                onClick={() => switchDemoRole('doctor')}
                className={`py-1.5 text-[10px] font-bold rounded-lg transition-all duration-150 cursor-pointer text-center ${
                  role === 'doctor'
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200/70'
                }`}
              >
                Doctor
              </button>
              <button
                onClick={() => switchDemoRole('admin')}
                className={`py-1.5 text-[10px] font-bold rounded-lg transition-all duration-150 cursor-pointer text-center ${
                  role === 'admin'
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200/70'
                }`}
              >
                Admin
              </button>
            </div>
          </div>

          {/* Settings Button */}
          <button
            id="sidebar-settings-btn"
            onClick={() => setSettingsModalOpen(true)}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-white rounded-xl transition-all duration-150 cursor-pointer border border-transparent hover:border-slate-200/60"
          >
            <Settings className="w-4 h-4 text-slate-400" />
            <span>Console Settings</span>
          </button>

          {/* Logout Button */}
          <button
            id="sidebar-logout-btn"
            onClick={logout}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-600 hover:text-rose-600 hover:bg-rose-50/80 rounded-xl transition-all duration-150 cursor-pointer border border-transparent hover:border-rose-100"
          >
            <LogOut className="w-4 h-4 text-slate-400 group-hover:text-rose-600" />
            <span>Sign Out Session</span>
          </button>
        </div>
      </aside>

      {/* =========================================================================
          MAIN CONTAINER (Shifted with lg:pl-64 to clear fixed left sidebar)
          ========================================================================= */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <PersistentBanner />
        {/* Top Header - Floating Pill Architecture with Pristine White Glassmorphism */}
        <header className="sticky top-3.5 z-30 mx-3 sm:mx-6 lg:mx-8 my-2 px-4 sm:px-6 lg:px-7 h-16 rounded-full bg-white/95 backdrop-blur-xl border border-slate-200/90 shadow-xl shadow-slate-900/5 flex items-center justify-between gap-4 transition-all duration-200">
          <div className="flex items-center gap-3 min-w-0">
            {/* Mobile menu button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100 lg:hidden cursor-pointer shrink-0 transition-colors"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* View Title & Subtitle */}
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight truncate">
                  {title}
                </h1>
                <span
                  className={`hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${roleMeta.badgeClass}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${roleMeta.dotColor}`}></span>
                  <span>{roleMeta.title}</span>
                </span>
              </div>
              {subtitle && (
                <p className="text-xs text-slate-500 font-medium truncate hidden md:block mt-0.5">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          {/* Header Right Actions */}
          <div className="flex items-center gap-2.5 sm:gap-4 shrink-0">
            {/* Search Input */}
            <div className="hidden md:flex items-center relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search patient, EHR, vitals... (⌘K)"
                className="w-56 lg:w-68 pl-8.5 pr-3 py-1.5 rounded-full border border-slate-200/90 bg-slate-100/80 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 focus:bg-white transition-all duration-150"
              />
            </div>

            <AcademicBadge className="hidden xl:inline-flex" />

            {/* Cloud Database Live Connection Pill with Quick Sync */}
            <button
              type="button"
              id="cloud-db-sync-btn"
              onClick={async () => {
                await syncProjectDataToFirestore();
              }}
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50/90 hover:bg-teal-100/90 border border-teal-200 text-[10px] font-semibold text-teal-800 shadow-2xs transition-colors cursor-pointer"
              title={`Cloud Database: ${firestoreDbId}. Click to sync SmartCare project files.`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${firestoreConnected ? 'bg-teal-500 animate-pulse' : 'bg-amber-400'}`}></span>
              <span>Cloud Database Active</span>
              <span className="text-[9px] bg-teal-200/70 text-teal-900 px-1.5 py-0.5 rounded-md font-mono">Sync</span>
            </button>

            {/* Notification Bell with Dropdown */}
            <div className="relative">
              <button
                id="notification-bell-btn"
                onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                className="relative p-2 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors duration-150 cursor-pointer"
                aria-label="View notifications"
              >
                <Bell className="w-4.5 h-4.5" />
                {unreadNotificationCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-teal-500 ring-2 ring-white"></span>
                )}
              </button>

              {notifDropdownOpen && (
                <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-2xl shadow-xl shadow-slate-900/10 border border-slate-200/90 p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150 text-slate-900">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                      Notifications ({unreadNotificationCount} unread)
                    </span>
                    <button
                      onClick={clearNotifications}
                      className="text-[11px] text-teal-700 hover:text-teal-800 hover:underline font-semibold cursor-pointer"
                    >
                      Clear all
                    </button>
                  </div>

                  <div className="py-2 space-y-2 max-h-72 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="py-8 text-center text-xs text-slate-400">
                        No new notifications.
                      </div>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => markNotificationAsRead(n.id)}
                          className={`p-3 rounded-xl text-xs transition-colors duration-150 cursor-pointer border ${
                            n.read
                              ? 'bg-slate-50 text-slate-500 border-slate-100'
                              : 'bg-teal-50/50 text-slate-800 font-medium border-teal-100'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-slate-900">{n.title}</span>
                            <span className="text-[10px] text-slate-400">{n.timestamp}</span>
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Avatar with Profile Dropdown */}
            <div className="relative">
              <button
                id="user-profile-menu-btn"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2.5 p-1 sm:pr-2.5 rounded-full hover:bg-slate-100 transition-colors duration-150 cursor-pointer border border-transparent hover:border-slate-200/70"
              >
                <div className="relative">
                  <div className="w-8.5 h-8.5 rounded-full bg-gradient-to-br from-teal-500 to-cyan-700 text-white flex items-center justify-center font-bold text-xs shadow-2xs">
                    {user?.name ? user.name.slice(0, 2).toUpperCase() : 'SC'}
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white"></span>
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-xs font-bold text-slate-900 leading-tight truncate max-w-[120px]">
                    {user?.name || 'User'}
                  </div>
                  <div className="text-[10px] text-slate-500 font-semibold uppercase">
                    {user?.role || 'Guest'}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-3 w-60 bg-white rounded-2xl shadow-xl shadow-slate-900/10 border border-slate-200/90 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150 text-slate-800">
                  <div className="px-3 py-2.5 border-b border-slate-100">
                    <div className="text-xs font-bold text-slate-900">{user?.name}</div>
                    <div className="text-[11px] text-slate-500 truncate">{user?.email}</div>
                    <span className="inline-block mt-1.5 px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-slate-100 text-slate-700 border border-slate-200/60">
                      Role: {user?.role}
                    </span>
                  </div>
                  <div className="py-1">
                    <button
                      onClick={() => {
                        onNavigate('dashboard');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer"
                    >
                      Overview Dashboard
                    </button>
                    <button
                      onClick={() => {
                        onNavigate('medical-records');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer"
                    >
                      Clinical Records
                    </button>
                    <button
                      onClick={() => {
                        setSettingsModalOpen(true);
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer"
                    >
                      Console Settings
                    </button>
                  </div>
                  <div className="pt-1 border-t border-slate-100">
                    <button
                      onClick={logout}
                      className="w-full text-left px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Content Area with Generous Spacing */}
        <main className="flex-1 p-6 sm:p-8 lg:p-10 max-w-7xl w-full mx-auto space-y-8">
          {children}
        </main>
      </div>

      {/* =========================================================================
          MOBILE SLIDEOUT SIDEBAR (for responsive mobile viewports)
          ========================================================================= */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
            onClick={() => setSidebarOpen(false)}
          ></div>
          <div className="relative w-72 bg-white h-full flex flex-col shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            <div className="h-16 flex items-center justify-between px-5 border-b border-slate-200">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-slate-900 text-teal-400 flex items-center justify-center">
                  <Cloud className="w-4.5 h-4.5" />
                </div>
                <div>
                  <span className="font-black text-xs text-slate-900">SMARTCARE CLOUD</span>
                  <div className="text-[9px] font-bold text-slate-400 uppercase">{role} portal</div>
                </div>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-1 rounded-lg text-slate-500 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = activeNav === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onNavigate(item.id);
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold ${
                      active
                        ? 'bg-slate-900 text-white font-bold'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="p-4 border-t border-slate-200 space-y-2">
              <button
                onClick={() => {
                  setSettingsModalOpen(true);
                  setSidebarOpen(false);
                }}
                className="w-full py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 rounded-xl"
              >
                Console Settings
              </button>
              <button
                onClick={logout}
                className="w-full py-2.5 text-xs font-bold text-rose-600 bg-rose-50 rounded-xl"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          ENTERPRISE SETTINGS MODAL
          ========================================================================= */}
      {settingsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden space-y-5 p-6 sm:p-7">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center">
                  <Settings className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Console Settings</h3>
                  <p className="text-xs text-slate-500">Manage security preferences and telemetry.</p>
                </div>
              </div>
              <button
                onClick={() => setSettingsModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Account Information */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
                <div className="font-bold text-slate-900 uppercase tracking-wider text-[10px]">
                  Current Identity
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Name:</span>
                  <span className="font-semibold text-slate-800">{user?.name}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Role:</span>
                  <span className="font-bold text-teal-700 uppercase">{user?.role}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Email:</span>
                  <span className="font-mono text-slate-700">{user?.email}</span>
                </div>
              </div>

              {/* Security Status */}
              <div className="space-y-2.5">
                <div className="font-bold text-slate-900 uppercase tracking-wider text-[10px]">
                  Cloud Security Specifications
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200/80">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-teal-600" />
                    <span className="font-medium text-slate-700">Storage Encryption</span>
                  </div>
                  <span className="font-mono font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[10px]">
                    AES-256 GCM
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200/80">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-blue-600" />
                    <span className="font-medium text-slate-700">Access Control Model</span>
                  </div>
                  <span className="font-mono font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded text-[10px]">
                    RBAC / ABAC Active
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200/80">
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-indigo-600" />
                    <span className="font-medium text-slate-700">Session Token Validity</span>
                  </div>
                  <span className="font-mono text-slate-500 text-[10px]">JWT Signed • 24h Exp</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                onClick={() => setSettingsModalOpen(false)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
