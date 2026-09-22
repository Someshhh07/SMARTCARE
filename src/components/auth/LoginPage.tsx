import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Cloud,
  Lock,
  Mail,
  KeyRound,
  ShieldCheck,
  User,
  Stethoscope,
  Shield,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  RefreshCw,
  Sparkles,
  HeartPulse,
  Activity,
  Network,
  Home,
  Database,
  Cpu,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const LoginPage: React.FC = () => {
  const { login, register, setActiveView } = useAuth();
  
  // View states: 'login' | 'register' | 'forgot-password'
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'forgot-password'>('login');
  
  // Form fields
  const [role, setRole] = useState<'patient' | 'doctor' | 'admin'>('patient');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('aarav.kumar@patient.smartcare.cloud');
  const [password, setPassword] = useState('secureDemoPass123!');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Forgot password state
  const [resetEmail, setResetEmail] = useState('');
  const [resetSubmitted, setResetSubmitted] = useState(false);
  
  // UI & Validation feedback states
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  // Field validations
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isPasswordValid = password.length >= 6;
  const isNameValid = name.trim().length >= 2;

  // Handle role selection
  const handleRoleSelect = (selectedRole: 'patient' | 'doctor' | 'admin') => {
    setRole(selectedRole);
    setErrorMessage(null);
    if (authMode === 'login') {
      if (selectedRole === 'patient') {
        setEmail('aarav.kumar@patient.smartcare.cloud');
      } else if (selectedRole === 'doctor') {
        setEmail('dr.priya.rao@doctor.smartcare.cloud');
      } else if (selectedRole === 'admin') {
        setEmail('admin@smartcare.cloud');
      }
    }
  };

  // Switch between Sign In and Registration
  const switchToMode = (mode: 'login' | 'register' | 'forgot-password') => {
    setAuthMode(mode);
    setErrorMessage(null);
    setSuccessMessage(null);
    setTouched({});
    if (mode === 'register') {
      if (email.endsWith('.cloud') && email.includes('aarav')) {
        setEmail('');
      }
      setName('');
      setPassword('');
    } else if (mode === 'login') {
      if (!email) {
        setEmail('aarav.kumar@patient.smartcare.cloud');
        setPassword('secureDemoPass123!');
      }
    } else if (mode === 'forgot-password') {
      setResetEmail(email || 'aarav.kumar@patient.smartcare.cloud');
      setResetSubmitted(false);
    }
  };

  // Form submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    // Validate inputs
    if (authMode === 'register' && !isNameValid) {
      setErrorMessage('Please provide your legal full name (minimum 2 characters).');
      return;
    }
    if (!isEmailValid) {
      setErrorMessage('Please enter a valid business or patient email address.');
      return;
    }
    if (!isPasswordValid) {
      setErrorMessage('Password must contain at least 6 characters.');
      return;
    }

    setLoading(true);

    try {
      if (authMode === 'register') {
        await register(email, name, role, phone || '+91 98450 00000');
      } else {
        await login(email, role);
      }
    } catch (err: any) {
      setErrorMessage(
        err?.message || 'Authentication rejected. Please verify your credentials or permissions.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Forgot password submit
  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(resetEmail)) {
      setErrorMessage('Please enter a valid email address to receive password instructions.');
      return;
    }
    setLoading(true);
    setErrorMessage(null);
    setTimeout(() => {
      setLoading(false);
      setResetSubmitted(true);
      setSuccessMessage(
        `Cryptographic reset token dispatched to ${resetEmail}. Follow the link sent to your inbox.`
      );
    }, 900);
  };

  return (
    <div id="login-page" className="min-h-screen flex flex-col lg:flex-row w-full bg-slate-50 font-sans">
      
      {/* ========================================================================= */}
      {/* LEFT 50%: Dark Navy Healthcare / Cloud Visual                             */}
      {/* ========================================================================= */}
      <div className="lg:w-1/2 bg-[#060D1E] text-white p-8 sm:p-12 lg:p-16 flex flex-col justify-between relative overflow-hidden border-b lg:border-b-0 lg:border-r border-slate-800">
        
        {/* Background Ambient Network Gradients */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-teal-500 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 right-0 w-80 h-80 bg-blue-600 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 left-1/3 w-80 h-80 bg-cyan-600 rounded-full blur-3xl"></div>
          <div
            className="absolute inset-0 opacity-25"
            style={{
              backgroundImage: 'radial-gradient(#334155 1px, transparent 1px)',
              backgroundSize: '28px 28px',
            }}
          />
        </div>

        {/* Top Header: Brand & Back to Home */}
        <div className="relative z-10 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-teal-400 to-cyan-600 flex items-center justify-center text-slate-950 shadow-lg shadow-teal-500/20 font-black">
              <Cloud className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <span className="font-black text-lg tracking-wider text-white uppercase">
                SMARTCARE <span className="text-teal-400">CLOUD</span>
              </span>
              <span className="block text-[10px] font-mono text-slate-400 tracking-widest uppercase">
                Zero-Trust Health Platform
              </span>
            </div>
          </div>

          <button
            type="button"
            id="back-to-home-left-btn"
            onClick={() => setActiveView('landing')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 text-xs font-medium transition-all duration-150 cursor-pointer shadow-sm group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to Home</span>
          </button>
        </div>

        {/* Central Narrative & Abstract Cloud + Network + Medical Cross Visual */}
        <div className="relative z-10 my-8 lg:my-auto space-y-8 max-w-xl">
          
          {/* Tagline & Headline */}
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-bold uppercase tracking-wider">
              <Lock className="w-3.5 h-3.5 text-teal-400" />
              <span>Unified Healthcare Operations</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
              "Your healthcare workspace, securely connected."
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Consolidate outpatient booking, clinical EHR authoring, and healthcare administrative governance into a single, high-reliability cloud architecture.
            </p>
          </div>

          {/* SUBTLE ABSTRACT CLOUD + NETWORK + MEDICAL CROSS VISUAL */}
          <div className="relative py-4">
            <div className="w-full max-w-md mx-auto aspect-[16/10] relative rounded-3xl bg-slate-950/60 border border-slate-800/80 p-6 flex items-center justify-center overflow-hidden shadow-2xl backdrop-blur-sm">
              
              {/* Subtle Concentric Rings & Radar Lines */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-25">
                <div className="w-72 h-72 rounded-full border border-teal-500/30"></div>
                <div className="w-52 h-52 rounded-full border border-cyan-500/30"></div>
                <div className="w-32 h-32 rounded-full border border-blue-500/40"></div>
              </div>

              {/* Central SVG: Cloud + Network Mesh + Medical Cross */}
              <svg className="w-full h-full max-h-56 relative z-10" viewBox="0 0 400 240" fill="none">
                <defs>
                  <linearGradient id="cloudMeshGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.4" />
                    <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#2563eb" stopOpacity="0.1" />
                  </linearGradient>
                  <linearGradient id="crossGlowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#2dd4bf" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                  <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="6" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* Network Constellation Connecting Lines */}
                <g stroke="#14b8a6" strokeWidth="1.2" strokeOpacity="0.45" strokeDasharray="3 3">
                  <line x1="60" y1="60" x2="200" y2="120" />
                  <line x1="340" y1="60" x2="200" y2="120" />
                  <line x1="70" y1="180" x2="200" y2="120" />
                  <line x1="330" y1="180" x2="200" y2="120" />
                  <line x1="200" y1="20" x2="200" y2="120" />
                  <line x1="200" y1="220" x2="200" y2="120" />
                </g>

                {/* Cloud Silhouette Contour */}
                <path
                  d="M130,135 
                     C120,135 110,125 110,115 
                     C110,103 120,95 132,95 
                     C135,80 150,68 168,68 
                     C180,68 190,73 197,82 
                     C203,76 213,72 224,72 
                     C244,72 260,88 260,108 
                     C260,110 260,112 259,114 
                     C267,117 274,125 274,135 
                     C274,146 265,155 254,155 
                     L130,155 Z"
                  fill="url(#cloudMeshGrad)"
                  stroke="#2dd4bf"
                  strokeWidth="1.5"
                  strokeOpacity="0.75"
                />

                {/* Peripheral Network Satellite Nodes */}
                {/* Patient Node */}
                <circle cx="60" cy="60" r="16" fill="#0f172a" stroke="#14b8a6" strokeWidth="1.5" />
                <circle cx="60" cy="60" r="5" fill="#14b8a6" />
                <text x="60" y="90" textAnchor="middle" fill="#94a3b8" fontSize="9" fontFamily="monospace">
                  PATIENT
                </text>

                {/* Doctor Node */}
                <circle cx="340" cy="60" r="16" fill="#0f172a" stroke="#06b6d4" strokeWidth="1.5" />
                <circle cx="340" cy="60" r="5" fill="#06b6d4" />
                <text x="340" y="90" textAnchor="middle" fill="#94a3b8" fontSize="9" fontFamily="monospace">
                  DOCTOR
                </text>

                {/* Admin Node */}
                <circle cx="200" cy="20" r="14" fill="#0f172a" stroke="#6366f1" strokeWidth="1.5" />
                <circle cx="200" cy="20" r="4" fill="#6366f1" />
                <text x="200" y="44" textAnchor="middle" fill="#94a3b8" fontSize="9" fontFamily="monospace">
                  ADMIN
                </text>

                {/* Database Persistence Node */}
                <circle cx="70" cy="180" r="16" fill="#0f172a" stroke="#3b82f6" strokeWidth="1.5" />
                <circle cx="70" cy="180" r="5" fill="#3b82f6" />
                <text x="70" y="208" textAnchor="middle" fill="#94a3b8" fontSize="9" fontFamily="monospace">
                  FIRESTORE
                </text>

                {/* Cloud Storage Vault Node */}
                <circle cx="330" cy="180" r="16" fill="#0f172a" stroke="#10b981" strokeWidth="1.5" />
                <circle cx="330" cy="180" r="5" fill="#10b981" />
                <text x="330" y="208" textAnchor="middle" fill="#94a3b8" fontSize="9" fontFamily="monospace">
                  STORAGE
                </text>

                {/* Dynamic Data Packet Pulses */}
                <circle cx="130" cy="90" r="3" fill="#2dd4bf">
                  <animate attributeName="opacity" values="0.2;1;0.2" dur="2s" repeatCount="indefinite" />
                </circle>
                <circle cx="270" cy="90" r="3" fill="#06b6d4">
                  <animate attributeName="opacity" values="0.8;0.2;0.8" dur="2s" repeatCount="indefinite" />
                </circle>

                {/* ILLUMINATED MEDICAL CROSS AT THE CORE */}
                <g filter="url(#softGlow)">
                  <rect x="188" y="100" width="24" height="40" rx="6" fill="url(#crossGlowGrad)" />
                  <rect x="180" y="108" width="40" height="24" rx="6" fill="url(#crossGlowGrad)" />
                  {/* Central Bright Spot */}
                  <circle cx="200" cy="120" r="4" fill="#ffffff" />
                </g>
              </svg>

              {/* Visual Micro Badges */}
              <div className="absolute bottom-3 left-4 text-[10px] font-mono text-teal-400/90 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse"></span>
                <span>Zero-Trust RBAC Synced</span>
              </div>
              <div className="absolute bottom-3 right-4 text-[10px] font-mono text-slate-400">
                TLS 1.3 / 256-bit AES
              </div>
            </div>
          </div>

          {/* Quick Metrics / Cloud Verification Badges */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-left">
              <div className="text-teal-400 text-xs font-mono font-bold uppercase">99.99%</div>
              <div className="text-white text-xs font-semibold">Uptime SLA</div>
              <div className="text-[10px] text-slate-400">Multi-zone failover</div>
            </div>
            <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-left">
              <div className="text-cyan-400 text-xs font-mono font-bold uppercase">100%</div>
              <div className="text-white text-xs font-semibold">Audit Logging</div>
              <div className="text-[10px] text-slate-400">Immutable trace</div>
            </div>
            <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-left">
              <div className="text-blue-400 text-xs font-mono font-bold uppercase">HIPAA</div>
              <div className="text-white text-xs font-semibold">Compliant Vault</div>
              <div className="text-[10px] text-slate-400">Encrypted PHI</div>
            </div>
          </div>
        </div>

        {/* Footer of Left Panel: Academic Disclaimer & Metadata */}
        <div className="relative z-10 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-slate-400">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300">
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            <span>Academic Prototype • Synthetic Data</span>
          </div>
          <span className="text-[11px] text-slate-500 font-mono">
            SmartCare Cloud Framework v2.4
          </span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* RIGHT 50%: Clean Enterprise Authentication Card                           */}
      {/* ========================================================================= */}
      <div className="lg:w-1/2 flex flex-col items-center justify-center p-6 sm:p-10 lg:p-16 relative bg-slate-50">
        
        {/* Mobile Header / Quick Home Link */}
        <div className="w-full max-w-md flex items-center justify-between pb-4 lg:hidden">
          <button
            type="button"
            onClick={() => setActiveView('landing')}
            className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </button>
          <span className="text-[10px] font-mono text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
            Academic Prototype
          </span>
        </div>

        {/* The Clean Authentication Card */}
        <div className="w-full max-w-md bg-white rounded-3xl p-7 sm:p-9 border border-slate-200/90 shadow-xl shadow-slate-900/5 space-y-6">
          
          {/* Header Title & Subtitle */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {authMode === 'login' && 'Sign In to Workspace'}
                {authMode === 'register' && 'Create Cloud Account'}
                {authMode === 'forgot-password' && 'Reset Your Password'}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              {authMode === 'login' && 'Select your role and authenticate into your cloud workspace.'}
              {authMode === 'register' && 'Register into the central cloud database with verified role permissions.'}
              {authMode === 'forgot-password' && 'Enter your verified email address to receive password instructions.'}
            </p>
          </div>

          {/* Feedback: Error Banner */}
          <AnimatePresence>
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5 shadow-2xs"
              >
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span className="leading-relaxed font-medium">{errorMessage}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Feedback: Success Banner */}
          <AnimatePresence>
            {successMessage && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2.5 shadow-2xs"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span className="leading-relaxed font-medium">{successMessage}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ============================================================= */}
          {/* FORGOT PASSWORD FORM                                          */}
          {/* ============================================================= */}
          {authMode === 'forgot-password' ? (
            <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    id="forgot-password-email-input"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="user@smartcare.cloud"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 bg-white font-medium"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  We will send a one-time cryptographic recovery code to this email.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading || resetSubmitted}
                id="forgot-password-submit-btn"
                className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-md shadow-teal-600/20 transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Dispatching Reset Token...</span>
                  </>
                ) : (
                  <>
                    <span>Send Reset Instructions</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => switchToMode('login')}
                  className="text-xs text-teal-700 hover:text-teal-800 font-bold hover:underline cursor-pointer"
                >
                  ← Return to Sign In
                </button>
              </div>
            </form>
          ) : (

            /* ============================================================= */
            /* SIGN IN / REGISTRATION FORM                                   */
            /* ============================================================= */
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Role Selection Tabs */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Designated Role
                </label>
                <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100/90 rounded-xl border border-slate-200">
                  <button
                    type="button"
                    id="role-tab-patient"
                    onClick={() => handleRoleSelect('patient')}
                    className={`py-2 text-xs font-semibold rounded-lg transition-all duration-150 flex items-center justify-center gap-1.5 cursor-pointer ${
                      role === 'patient'
                        ? 'bg-white text-teal-900 font-bold shadow-sm border border-teal-500/20'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <User className={`w-3.5 h-3.5 ${role === 'patient' ? 'text-teal-600' : 'text-slate-400'}`} />
                    <span>Patient</span>
                  </button>

                  <button
                    type="button"
                    id="role-tab-doctor"
                    onClick={() => handleRoleSelect('doctor')}
                    className={`py-2 text-xs font-semibold rounded-lg transition-all duration-150 flex items-center justify-center gap-1.5 cursor-pointer ${
                      role === 'doctor'
                        ? 'bg-white text-cyan-900 font-bold shadow-sm border border-cyan-500/20'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Stethoscope className={`w-3.5 h-3.5 ${role === 'doctor' ? 'text-cyan-600' : 'text-slate-400'}`} />
                    <span>Doctor</span>
                  </button>

                  <button
                    type="button"
                    id="role-tab-admin"
                    onClick={() => handleRoleSelect('admin')}
                    className={`py-2 text-xs font-semibold rounded-lg transition-all duration-150 flex items-center justify-center gap-1.5 cursor-pointer ${
                      role === 'admin'
                        ? 'bg-white text-indigo-900 font-bold shadow-sm border border-indigo-500/20'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Shield className={`w-3.5 h-3.5 ${role === 'admin' ? 'text-indigo-600' : 'text-slate-400'}`} />
                    <span>Admin</span>
                  </button>
                </div>
              </div>

              {/* Name Field (Registration Mode Only) */}
              {authMode === 'register' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      id="register-name-input"
                      value={name}
                      onBlur={() => setTouched({ ...touched, name: true })}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Meera Sharma"
                      className={`w-full pl-9 pr-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 bg-white font-medium ${
                        touched.name && !isNameValid
                          ? 'border-rose-400 focus:border-rose-500'
                          : 'border-slate-200'
                      }`}
                    />
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  </div>
                  {touched.name && !isNameValid && (
                    <p className="text-[11px] text-rose-600 mt-1">Please enter your legal name (min 2 characters).</p>
                  )}
                </div>
              )}

              {/* Email Address Field */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    id="login-email-input"
                    value={email}
                    onBlur={() => setTouched({ ...touched, email: true })}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@smartcare.cloud"
                    className={`w-full pl-9 pr-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 bg-white font-medium ${
                      touched.email && !isEmailValid
                        ? 'border-rose-400 focus:border-rose-500'
                        : 'border-slate-200'
                    }`}
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
                {touched.email && !isEmailValid && (
                  <p className="text-[11px] text-rose-600 mt-1">Please provide a valid email format.</p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Password <span className="text-rose-500">*</span>
                  </label>
                  
                  {authMode === 'login' ? (
                    <button
                      type="button"
                      id="forgot-password-link"
                      onClick={() => switchToMode('forgot-password')}
                      className="text-[11px] text-teal-700 hover:text-teal-800 font-semibold hover:underline cursor-pointer"
                    >
                      Forgot Password?
                    </button>
                  ) : (
                    <span className="text-[11px] text-slate-400">Min. 6 characters</span>
                  )}
                </div>

                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    id="login-password-input"
                    value={password}
                    onBlur={() => setTouched({ ...touched, password: true })}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className={`w-full pl-9 pr-10 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 bg-white ${
                      touched.password && !isPasswordValid
                        ? 'border-rose-400 focus:border-rose-500'
                        : 'border-slate-200'
                    }`}
                  />
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {touched.password && !isPasswordValid && (
                  <p className="text-[11px] text-rose-600 mt-1">Password must be at least 6 characters long.</p>
                )}
              </div>

              {/* Submit Action Button */}
              <button
                type="submit"
                disabled={loading}
                id="login-submit-btn"
                className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-md shadow-teal-600/20 transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <>
                    <span>{authMode === 'register' ? 'Complete Registration' : 'Sign In'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Toggle between Sign In and Registration */}
          <div className="pt-2 text-center text-xs text-slate-600 border-t border-slate-100">
            {authMode === 'register' ? (
              <span>
                Already registered in the system?{' '}
                <button
                  type="button"
                  id="switch-to-login-btn"
                  onClick={() => switchToMode('login')}
                  className="text-teal-700 font-bold hover:underline cursor-pointer"
                >
                  Sign In
                </button>
              </span>
            ) : (
              <span>
                New patient or clinician?{' '}
                <button
                  type="button"
                  id="create-account-btn"
                  onClick={() => switchToMode('register')}
                  className="text-teal-700 font-bold hover:underline cursor-pointer"
                >
                  Create Account
                </button>
              </span>
            )}
          </div>

          {/* Back to Home & Academic Notice */}
          <div className="pt-3 border-t border-slate-100 flex flex-col items-center gap-2">
            <button
              type="button"
              id="back-to-home-bottom-btn"
              onClick={() => setActiveView('landing')}
              className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 font-medium transition-colors cursor-pointer group"
            >
              <Home className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-600" />
              <span>Back to Home</span>
            </button>
            
            <div className="text-[11px] font-mono text-slate-400 text-center">
              Academic Prototype • Synthetic Data
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
