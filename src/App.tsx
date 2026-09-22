import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from './context/AuthContext';
import { Navbar } from './components/navigation/Navbar';
import { Footer } from './components/navigation/Footer';
import { HeroSection } from './components/landing/HeroSection';
import { ProblemSolutionSection } from './components/landing/ProblemSolutionSection';
import { FeaturesSection } from './components/landing/FeaturesSection';
import { HowItWorksSection } from './components/landing/HowItWorksSection';
import { SecuritySection } from './components/landing/SecuritySection';
import { ArchitectureSection } from './components/landing/ArchitectureSection';
import { ResearchSection } from './components/landing/ResearchSection';
import { TestimonialsSection } from './components/landing/TestimonialsSection';
import { FutureScopeSection } from './components/landing/FutureScopeSection';
import { LoginPage } from './components/auth/LoginPage';
import { DashboardLayout } from './components/dashboard/DashboardLayout';
import { PatientDashboardView } from './components/patient/PatientDashboardView';
import { DoctorDashboardView } from './components/doctor/DoctorDashboardView';
import { DoctorPatientsView } from './components/doctor/DoctorPatientsView';
import { AdminDashboardView } from './components/admin/AdminDashboardView';
import { AppointmentsView } from './components/appointments/AppointmentsView';
import { MedicalRecordsView } from './components/records/MedicalRecordsView';
import { UserManagementView } from './components/admin/UserManagementView';
import { CloudMonitoringView } from './components/admin/CloudMonitoringView';
import { DataArchitectureView } from './components/admin/DataArchitectureView';
import { RbacMatrixView } from './components/admin/RbacMatrixView';
import { AccessRestrictedView } from './components/common/AccessRestrictedView';
import { PersistentBanner } from './components/common/PersistentBanner';

export function App() {
  const { user, role, activeView, setActiveView } = useAuth();

  // Public Landing Page Views
  if (
    activeView === 'landing' ||
    activeView === 'features' ||
    activeView === 'curriculum' ||
    activeView === 'pricing' ||
    activeView === 'testimonials' ||
    activeView === 'how-it-works' ||
    activeView === 'architecture' ||
    activeView === 'security' ||
    activeView === 'research' ||
    activeView === 'future-scope'
  ) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-teal-500 selection:text-white">
        <PersistentBanner />
        <Navbar />
        <main className="flex-1">
          <HeroSection />
          <ProblemSolutionSection />
          <FeaturesSection />
          <HowItWorksSection />
          <SecuritySection />
          <ArchitectureSection />
          <ResearchSection />
          <TestimonialsSection />
          <FutureScopeSection />
        </main>
        <Footer />
      </div>
    );
  }

  // Auth / Login Page (Dedicated Split-Screen Enterprise SaaS View)
  if (activeView === 'login') {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-teal-500 selection:text-white flex flex-col">
        <PersistentBanner />
        <LoginPage />
      </div>
    );
  }

  // Authenticated Portal Views within DashboardLayout
  const renderDashboardContent = () => {
    // 1. Overview Dashboard
    if (activeView === 'dashboard') {
      if (role === 'doctor') {
        return <DoctorDashboardView onNavigate={setActiveView} />;
      }
      if (role === 'admin') {
        return <AdminDashboardView onNavigate={setActiveView} />;
      }
      return <PatientDashboardView onNavigate={setActiveView} />;
    }

    // 2. Appointments View (Accessible to all roles)
    if (activeView === 'appointments') {
      return <AppointmentsView />;
    }

    // 3. Medical Records View (Accessible to all roles, with role-specific filters/creators)
    if (activeView === 'medical-records') {
      return <MedicalRecordsView />;
    }

    // 4. Patients Directory (Doctor and Admin only)
    if (activeView === 'patients') {
      if (role !== 'doctor' && role !== 'admin') {
        return <AccessRestrictedView onReturn={() => setActiveView('dashboard')} />;
      }
      return <DoctorPatientsView />;
    }

    // 5. Doctors Directory (Admin & Public)
    if (activeView === 'doctors') {
      return <AppointmentsView />;
    }

    // 6. User Management (Admin only)
    if (activeView === 'users') {
      if (role !== 'admin') {
        return <AccessRestrictedView onReturn={() => setActiveView('dashboard')} />;
      }
      return <UserManagementView />;
    }

    // 7. Cloud Monitoring Telemetry (Admin & Doctor)
    if (activeView === 'monitoring') {
      return <CloudMonitoringView />;
    }

    // 8. Data Architecture View (Admin and all interested reviewers)
    if (activeView === 'architecture-view') {
      return <DataArchitectureView />;
    }

    // 9. RBAC Matrix View (Admin and all interested reviewers)
    if (activeView === 'rbac-matrix') {
      return <RbacMatrixView />;
    }

    // Fallback
    return <PatientDashboardView onNavigate={setActiveView} />;
  };

  const getPageTitle = () => {
    switch (activeView) {
      case 'dashboard':
        if (role === 'doctor') return 'Doctor Clinical Workspace';
        if (role === 'admin') return 'System Administration Console';
        return 'Patient Health Overview';
      case 'appointments':
        return 'Appointments & Outpatient Agenda';
      case 'medical-records':
        return 'Digital Healthcare Records';
      case 'patients':
        return 'Assigned Patients Roster';
      case 'users':
        return 'User Account Governance';
      case 'monitoring':
        return 'Cloud Infrastructure Telemetry';
      case 'architecture-view':
        return 'Cloud Firestore Schema & Entities';
      case 'rbac-matrix':
        return 'Role-Based Access Control Matrix';
      default:
        return 'Healthcare Workspace';
    }
  };

  return (
    <DashboardLayout
      title={getPageTitle()}
      subtitle={
        user
          ? `Authenticated as ${user.name} [${user.role.toUpperCase()}] • Central Cloud Active`
          : undefined
      }
      activeNav={activeView}
      onNavigate={setActiveView}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={`${role}-${activeView}`}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{
            duration: 0.22,
            ease: [0.16, 1, 0.3, 1] as const,
          }}
          className="w-full space-y-8"
        >
          {renderDashboardContent()}
        </motion.div>
      </AnimatePresence>
    </DashboardLayout>
  );
}

export default App;
