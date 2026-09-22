import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  User,
  Stethoscope,
  Shield,
  ShieldCheck,
  KeyRound,
  MonitorSmartphone,
  Server,
  Database,
  HardDrive,
  Cloud,
  Activity,
  Network,
  Cpu,
  Lock,
  Layers,
  Sparkles,
  CheckCircle2,
  Info,
  Radio,
  ArrowDown,
  RefreshCw,
  Eye,
  Terminal,
  Zap,
  Check,
} from 'lucide-react';

export interface ArchitectureNodeData {
  id: string;
  name: string;
  layerIndex: number;
  layerTag: string;
  category: string;
  iconType: 'user' | 'security' | 'api' | 'database' | 'cloud' | 'monitoring' | 'client';
  purpose: string;
  technologyUsed: string;
  badge: string;
  accentGradient: string;
  glowColor: string;
  borderColor: string;
  activeForRoles: ('patient' | 'doctor' | 'admin')[];
  specs: { label: string; value: string }[];
  dataPayloadExample: string;
  protocol: string;
}

export const ARCHITECTURE_NODES: Record<string, ArchitectureNodeData> = {
  patient: {
    id: 'patient',
    name: 'PATIENT',
    layerIndex: 1,
    layerTag: 'Layer 1 • Stakeholder',
    category: 'End-User Persona',
    iconType: 'user',
    badge: 'Patient Portal Client',
    accentGradient: 'from-cyan-500 to-teal-500',
    glowColor: 'rgba(20, 184, 166, 0.35)',
    borderColor: 'border-teal-500/40 hover:border-teal-400',
    activeForRoles: ['patient'],
    purpose: 'Outpatient consumer accessing personal wellness indicators, booking specialist doctor consultations, and reviewing digitally signed health records.',
    technologyUsed: 'React 19 Viewport, Web Browser (HTTPS), JWT Bearer Header',
    protocol: 'HTTPS / TLS 1.3',
    specs: [
      { label: 'Role Scope', value: 'Read-only personal records; write appointment bookings' },
      { label: 'Sensitivity', value: 'Protected Health Information (HIPAA / PHI)' },
      { label: 'Auth Token', value: 'Patient-scoped Claims JWT' },
    ],
    dataPayloadExample: '{\n  "role": "patient",\n  "action": "book_appointment",\n  "patientId": "pt-101",\n  "doctorId": "doc-01",\n  "date": "2026-09-22"\n}',
  },
  doctor: {
    id: 'doctor',
    name: 'DOCTOR',
    layerIndex: 1,
    layerTag: 'Layer 1 • Stakeholder',
    category: 'Clinical Provider Persona',
    iconType: 'user',
    badge: 'Physician Workstation',
    accentGradient: 'from-teal-500 to-emerald-500',
    glowColor: 'rgba(16, 185, 129, 0.35)',
    borderColor: 'border-emerald-500/40 hover:border-emerald-400',
    activeForRoles: ['doctor'],
    purpose: 'Licensed physician inspecting assigned patient medical histories, managing outpatient daily consultations, and authoring verified clinical electronic health records.',
    technologyUsed: 'Clinical Workstation UI, Digital Signature Engine, Real-time Agenda Stream',
    protocol: 'HTTPS / WSS Secure',
    specs: [
      { label: 'Role Scope', value: 'Read assigned patient histories; sign clinical records' },
      { label: 'Verification', value: 'Medical Council License + MFA' },
      { label: 'Session Life', value: '30-minute idle session timeout' },
    ],
    dataPayloadExample: '{\n  "role": "doctor",\n  "action": "commit_ehr",\n  "patientId": "pt-101",\n  "diagnosis": "Hypertension Stage 1",\n  "rx": "Amlodipine 5mg"\n}',
  },
  admin: {
    id: 'admin',
    name: 'ADMIN',
    layerIndex: 1,
    layerTag: 'Layer 1 • Stakeholder',
    category: 'Governance & Operations Persona',
    iconType: 'user',
    badge: 'System Admin Console',
    accentGradient: 'from-blue-600 to-indigo-600',
    glowColor: 'rgba(99, 102, 241, 0.35)',
    borderColor: 'border-indigo-500/40 hover:border-indigo-400',
    activeForRoles: ['admin'],
    purpose: 'Healthcare IT administrator overseeing user account provisioning, role revocation, Firestore schema governance, security audit trails, and platform telemetry.',
    technologyUsed: 'Administrative Console, Hardware Security Key / MFA, Audit Stream',
    protocol: 'Zero-Trust Bastion Protocol',
    specs: [
      { label: 'Role Scope', value: 'User management, telemetry oversight, immutable audit review' },
      { label: 'Clinical Lock', value: 'Zero direct access to alter clinical diagnoses' },
      { label: 'Audit Logging', value: '100% of administrative mutations committed to log' },
    ],
    dataPayloadExample: '{\n  "role": "admin",\n  "action": "audit_rbac_violations",\n  "timeWindow": "24h",\n  "targetCollection": "medicalRecords"\n}',
  },
  'react-app': {
    id: 'react-app',
    name: 'REACT WEB APPLICATION',
    layerIndex: 2,
    layerTag: 'Layer 2 • Client Interface',
    category: 'Presentation & UI Layer',
    iconType: 'client',
    badge: 'Single Page Web App',
    accentGradient: 'from-cyan-500 to-blue-500',
    glowColor: 'rgba(6, 182, 212, 0.4)',
    borderColor: 'border-cyan-500/40 hover:border-cyan-400',
    activeForRoles: ['patient', 'doctor', 'admin'],
    purpose: 'Renders a responsive, high-performance web interface providing instant role-driven view routing, zero-flicker transitions, and seamless client-side state synchronization.',
    technologyUsed: 'React 19, TypeScript, Tailwind CSS, Vite, Motion, Context State API',
    protocol: 'HTTPS / Modern SPA Client',
    specs: [
      { label: 'Client Routing', value: 'Deterministic client guards without unauthorized flash' },
      { label: 'Rendering', value: 'Optimistic UI mutations with automatic rollback' },
      { label: 'Asset Delivery', value: 'Vite code-split ESM bundle chunks' },
    ],
    dataPayloadExample: '{\n  "clientVersion": "19.0.0",\n  "activeRoute": "/dashboard",\n  "authContext": "Synced",\n  "latency": "14ms"\n}',
  },
  'firebase-auth': {
    id: 'firebase-auth',
    name: 'FIREBASE AUTHENTICATION',
    layerIndex: 3,
    layerTag: 'Layer 3 • Identity Gateway',
    category: 'Identity & Authentication',
    iconType: 'security',
    badge: 'Cryptographic Identity Provider',
    accentGradient: 'from-amber-500 to-orange-500',
    glowColor: 'rgba(245, 158, 11, 0.4)',
    borderColor: 'border-amber-500/40 hover:border-amber-400',
    activeForRoles: ['patient', 'doctor', 'admin'],
    purpose: 'Verifies user identity credentials, maintains cryptographic session tokens, and issues RS256-signed JSON Web Tokens (JWT) embedded with verified role claims.',
    technologyUsed: 'Firebase Auth SDK, Google Identity Services, OAuth 2.0, RS256 JWT Standard',
    protocol: 'Bearer Authorization / RFC 7519',
    specs: [
      { label: 'Signing Key', value: 'Asymmetric RS256 Public Key Rotation' },
      { label: 'Token Lifespan', value: '60 minutes with auto-refresh mechanism' },
      { label: 'Claims Injected', value: 'userId, role, emailVerified, permissions' },
    ],
    dataPayloadExample: 'Header: { "alg": "RS256", "typ": "JWT" }\nPayload: {\n  "iss": "securetoken.google.com/smartcare",\n  "sub": "usr-8392a",\n  "role": "doctor",\n  "exp": 1789736400\n}',
  },
  rbac: {
    id: 'rbac',
    name: 'ROLE-BASED ACCESS CONTROL',
    layerIndex: 4,
    layerTag: 'Layer 4 • Security Gate',
    category: 'Policy Enforcement Point (PEP)',
    iconType: 'security',
    badge: 'Zero-Trust RBAC / ABAC Engine',
    accentGradient: 'from-emerald-500 to-teal-500',
    glowColor: 'rgba(16, 185, 129, 0.45)',
    borderColor: 'border-emerald-500/50 hover:border-emerald-400',
    activeForRoles: ['patient', 'doctor', 'admin'],
    purpose: 'Inspects Bearer token claims and document ownership attributes to deterministically enforce least-privilege security boundaries before any API controller executes.',
    technologyUsed: 'Custom RBAC Middleware, ABAC Validation Guards, Firestore Security Rules',
    protocol: 'Pre-flight Policy Interceptor',
    specs: [
      { label: 'Policy Model', value: 'Deterministic Role-Based & Attribute-Based Access' },
      { label: 'Boundary Rule', value: 'Patients read self; Doctors write records; Admins audit' },
      { label: 'Violation Action', value: 'Immediate HTTP 403 Forbidden with security telemetry' },
    ],
    dataPayloadExample: '{\n  "securityCheck": "PASSED",\n  "principal": "usr-8392a",\n  "requiredRole": ["doctor"],\n  "assignedRole": "doctor",\n  "resourceAccess": "AUTHORIZED"\n}',
  },
  'express-api': {
    id: 'express-api',
    name: 'NODE.JS + EXPRESS API',
    layerIndex: 5,
    layerTag: 'Layer 5 • Application Server',
    category: 'REST Services & Business Logic',
    iconType: 'api',
    badge: 'Backend Microservices Gateway',
    accentGradient: 'from-indigo-500 to-teal-500',
    glowColor: 'rgba(99, 102, 241, 0.45)',
    borderColor: 'border-indigo-500/40 hover:border-indigo-400',
    activeForRoles: ['patient', 'doctor', 'admin'],
    purpose: 'Processes incoming HTTP requests, performs strict JSON Schema validation, executes clinical workflow rules, triggers audit records, and coordinates database mutations.',
    technologyUsed: 'Node.js 20+, Express.js, TypeScript Engine, CORS & Helmet Hardening',
    protocol: 'RESTful JSON / Port 3000 Ingress',
    specs: [
      { label: 'Routes Handled', value: '/patients, /doctors, /appointments, /records' },
      { label: 'Sanitization', value: 'Strict input parameter typing & XSS protection' },
      { label: 'Concurrency', value: 'Asynchronous event loop with non-blocking I/O' },
    ],
    dataPayloadExample: 'POST /api/medical-records HTTP/1.1\nHost: smartcare.cloud\nAuthorization: Bearer <jwt_token>\nContent-Type: application/json\n\n{\n  "patientId": "pt-101",\n  "diagnosis": "Hypertension",\n  "prescriptions": ["Amlodipine 5mg"]\n}',
  },
  firestore: {
    id: 'firestore',
    name: 'FIRESTORE DATABASE',
    layerIndex: 6,
    layerTag: 'Layer 6 • Persistence',
    category: 'NoSQL Document Store',
    iconType: 'database',
    badge: 'Primary Document Database',
    accentGradient: 'from-cyan-500 to-blue-600',
    glowColor: 'rgba(6, 182, 212, 0.45)',
    borderColor: 'border-cyan-500/40 hover:border-cyan-400',
    activeForRoles: ['patient', 'doctor', 'admin'],
    purpose: 'High-availability, globally scalable NoSQL document database storing structured collections for user credentials, patient clinical charts, appointments, and doctors.',
    technologyUsed: 'Google Cloud Firestore, Multi-Document ACID Transactions, Composite Indexing',
    protocol: 'gRPC / Firestore SDK Protocol',
    specs: [
      { label: 'Collections', value: 'users, patients, doctors, appointments, medicalRecords' },
      { label: 'Query Latency', value: 'Under 20ms read/write roundtrip SLA' },
      { label: 'Security Model', value: 'Granular Firestore Security Rules' },
    ],
    dataPayloadExample: 'collection("medicalRecords").doc("rec-101") {\n  "id": "rec-101",\n  "patientId": "pt-101",\n  "doctorId": "doc-01",\n  "diagnosis": "Hypertension Stage 1",\n  "createdAt": "2026-09-18T10:30:00Z"\n}',
  },
  'cloud-storage': {
    id: 'cloud-storage',
    name: 'CLOUD STORAGE',
    layerIndex: 6,
    layerTag: 'Layer 6 • Persistence',
    category: 'Object Storage Vault',
    iconType: 'cloud',
    badge: 'Encrypted Binary Asset Vault',
    accentGradient: 'from-blue-600 to-indigo-600',
    glowColor: 'rgba(37, 99, 235, 0.4)',
    borderColor: 'border-blue-500/40 hover:border-blue-400',
    activeForRoles: ['patient', 'doctor', 'admin'],
    purpose: 'High-durability cloud object bucket store hosting encrypted diagnostic attachments, patient laboratory PDFs, radiology scans, and immutable audit exports.',
    technologyUsed: 'Google Cloud Storage, AES-256 Server-Side Encryption, Signed URL Broker',
    protocol: 'GCS REST API / Expiring Signed URLs',
    specs: [
      { label: 'Encryption', value: 'Customer-Managed Key AES-256 GCM' },
      { label: 'Access Policy', value: 'Expiring Time-Limited Cryptographic URLs (15m)' },
      { label: 'Durability', value: '99.999999999% (11 9s) Annual Durability' },
    ],
    dataPayloadExample: 'gs://smartcare-vault/records/rec-101/diagnostic_lab.pdf\nContentType: application/pdf\nEncryption: AES256-GCM\nAccess: ExpiringSignedUrl(15m)',
  },
  monitoring: {
    id: 'monitoring',
    name: 'BACKUP / MONITORING',
    layerIndex: 7,
    layerTag: 'Layer 7 • Resilience & Ops',
    category: 'Continuous Observability & Recovery',
    iconType: 'monitoring',
    badge: 'Disaster Recovery & Telemetry',
    accentGradient: 'from-emerald-500 to-teal-500',
    glowColor: 'rgba(16, 185, 129, 0.4)',
    borderColor: 'border-teal-500/40 hover:border-teal-400',
    activeForRoles: ['patient', 'doctor', 'admin'],
    purpose: 'Real-time telemetry tracking database throughput, latency, uptime availability (99.99%), plus automated scheduled disaster recovery snapshot backups.',
    technologyUsed: 'Cloud Monitoring, Automated Scheduled Cloud Backups, Synthetic Probes, Immutable Audit Engine',
    protocol: 'Continuous Observability Stream',
    specs: [
      { label: 'Platform SLA', value: '99.99% Availability Guarantee' },
      { label: 'Backup Cadence', value: 'Automated 6-hour snapshot cycles + Point-in-time restore' },
      { label: 'Telemetry Stream', value: 'Throughput ops/sec, latency ms, health checks' },
    ],
    dataPayloadExample: '{\n  "uptime": "99.99%",\n  "apiLatencyMs": 18,\n  "firestoreReadWriteOps": 320,\n  "lastBackupSnapshot": "2026-09-18T06:00:00Z",\n  "securityViolations": 0\n}',
  },
};

export const CloudArchitectureVisualizer: React.FC = () => {
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string>('rbac');
  const [activeFlowRole, setActiveFlowRole] = useState<'all' | 'patient' | 'doctor' | 'admin'>('all');
  const [isLiveAnimating, setIsLiveAnimating] = useState<boolean>(true);

  const activeNode = ARCHITECTURE_NODES[hoveredNodeId || selectedNodeId] || ARCHITECTURE_NODES['rbac'];

  const isNodeInActiveFlow = (node: ArchitectureNodeData) => {
    if (activeFlowRole === 'all') return true;
    return node.activeForRoles.includes(activeFlowRole);
  };

  // Modern Architectural Node Card Renderer
  const renderArchitectureNode = (
    nodeId: string,
    options?: { isTwin?: boolean; isPersona?: boolean }
  ) => {
    const node = ARCHITECTURE_NODES[nodeId];
    if (!node) return null;

    const isHovered = hoveredNodeId === node.id;
    const isSelected = (hoveredNodeId || selectedNodeId) === node.id;
    const inActiveFlow = isNodeInActiveFlow(node);

    return (
      <div
        key={node.id}
        id={`arch-node-${node.id}`}
        onMouseEnter={() => setHoveredNodeId(node.id)}
        onMouseLeave={() => setHoveredNodeId(null)}
        onClick={() => setSelectedNodeId(node.id)}
        className={`relative group rounded-2xl border transition-all duration-300 cursor-pointer ${
          options?.isPersona ? 'p-3.5' : 'p-4'
        } ${
          isSelected
            ? 'bg-slate-900/95 border-teal-400 shadow-2xl scale-[1.01] z-30'
            : inActiveFlow
            ? 'bg-slate-900/75 border-slate-800 hover:bg-slate-800/80 hover:border-slate-700'
            : 'bg-slate-950/30 border-slate-900 opacity-40 hover:opacity-75'
        }`}
        style={{
          boxShadow: isSelected ? `0 0 25px ${node.glowColor}` : undefined,
        }}
      >
        {/* Subtle Cloud Silhouette Graphic for Cloud nodes */}
        {(node.id === 'firestore' || node.id === 'cloud-storage' || node.id === 'react-app') && (
          <div className="absolute top-2 right-2 opacity-20 group-hover:opacity-40 transition-opacity pointer-events-none">
            <Cloud className="w-12 h-12 text-cyan-400/30" />
          </div>
        )}

        {/* Node Header */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2.5 min-w-0">
            {/* Layer Icon with Architectural Glow */}
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-md bg-gradient-to-br ${node.accentGradient} text-white transition-transform duration-200 ${
                isSelected ? 'scale-110 shadow-lg' : ''
              }`}
            >
              {node.id === 'patient' && <User className="w-5 h-5 text-white" />}
              {node.id === 'doctor' && <Stethoscope className="w-5 h-5 text-white" />}
              {node.id === 'admin' && <Shield className="w-5 h-5 text-white" />}
              {node.id === 'react-app' && <MonitorSmartphone className="w-5 h-5 text-white" />}
              {node.id === 'firebase-auth' && <KeyRound className="w-5 h-5 text-white" />}
              {node.id === 'rbac' && <ShieldCheck className="w-5 h-5 text-white" />}
              {node.id === 'express-api' && <Server className="w-5 h-5 text-white" />}
              {node.id === 'firestore' && <Database className="w-5 h-5 text-white" />}
              {node.id === 'cloud-storage' && <HardDrive className="w-5 h-5 text-white" />}
              {node.id === 'monitoring' && <Activity className="w-5 h-5 text-white" />}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] font-mono uppercase font-bold text-teal-400">
                  {node.layerTag}
                </span>
                {isSelected && (
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-teal-500/20 text-teal-300 border border-teal-500/40">
                    ACTIVE
                  </span>
                )}
              </div>
              <h4
                className={`font-black tracking-tight text-white uppercase ${
                  options?.isPersona ? 'text-xs sm:text-sm' : 'text-sm sm:text-base'
                }`}
              >
                {node.name}
              </h4>
            </div>
          </div>

          {/* Cloud / Security / API Node Badges */}
          <div className="text-right shrink-0 hidden sm:block">
            <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800/80 border border-slate-700 text-slate-300">
              {(node.iconType === 'cloud' || node.id === 'firestore') && <Cloud className="w-3 h-3 text-cyan-400" />}
              {node.iconType === 'security' && <Lock className="w-3 h-3 text-emerald-400" />}
              {node.iconType === 'api' && <Cpu className="w-3 h-3 text-indigo-400" />}
              {node.iconType === 'user' && <User className="w-3 h-3 text-teal-400" />}
              {node.iconType === 'monitoring' && <Radio className="w-3 h-3 text-emerald-400" />}
              <span>{node.protocol}</span>
            </span>
          </div>
        </div>

        {/* Node Purpose & Tech Preview (always displayed neatly, highlighted on hover) */}
        <p className="text-xs text-slate-300 leading-relaxed line-clamp-2 mb-2">
          {node.purpose}
        </p>

        {/* Technology Used Badge */}
        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2 text-[11px]">
          <div className="flex items-center gap-1.5 text-slate-400 min-w-0">
            <span className="text-[10px] font-bold text-slate-500 uppercase">Tech:</span>
            <span className="text-teal-300/90 font-mono text-[11px] truncate font-medium">
              {node.technologyUsed}
            </span>
          </div>
          <span className="text-[10px] font-mono text-slate-500 shrink-0">
            {node.badge}
          </span>
        </div>

        {/* Hover Highlight Ring / Popover Hint */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full bg-teal-500 text-slate-950 text-[10px] font-bold shadow-lg flex items-center gap-1 pointer-events-none z-40"
            >
              <Zap className="w-3 h-3 fill-current" />
              <span>Inspecting Node</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  // Subtle Animated Connector SVG between layers
  const renderConnector = (
    label: string,
    variant: 'single' | 'converge-3' | 'diverge-2' | 'converge-2',
    colorHex: string = '#14b8a6'
  ) => {
    return (
      <div className="relative py-1 flex items-center justify-center">
        {variant === 'single' && (
          <svg className="w-full h-7 overflow-visible">
            <line
              x1="50%"
              y1="0"
              x2="50%"
              y2="100%"
              stroke={colorHex}
              strokeWidth="2"
              strokeDasharray={isLiveAnimating ? '4 3' : 'none'}
              className={isLiveAnimating ? 'animate-flow-dash' : ''}
            />
            {/* Central Animated Pulse Dot */}
            {isLiveAnimating && (
              <circle cx="50%" cy="50%" r="3" fill={colorHex} className="animate-ping" />
            )}
          </svg>
        )}

        {variant === 'converge-3' && (
          <svg className="w-full h-8 overflow-visible" preserveAspectRatio="none">
            <defs>
              <linearGradient id="conn-conv-3" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.8" />
              </linearGradient>
            </defs>
            <path
              d="M 16% 0 L 16% 12 Q 16% 24 50% 32"
              fill="none"
              stroke="url(#conn-conv-3)"
              strokeWidth="2"
              strokeDasharray={isLiveAnimating ? '4 3' : 'none'}
              className={isLiveAnimating ? 'animate-flow-dash' : ''}
            />
            <path
              d="M 50% 0 L 50% 32"
              fill="none"
              stroke="#06b6d4"
              strokeWidth="2"
              strokeDasharray={isLiveAnimating ? '4 3' : 'none'}
              className={isLiveAnimating ? 'animate-flow-dash' : ''}
            />
            <path
              d="M 84% 0 L 84% 12 Q 84% 24 50% 32"
              fill="none"
              stroke="url(#conn-conv-3)"
              strokeWidth="2"
              strokeDasharray={isLiveAnimating ? '4 3' : 'none'}
              className={isLiveAnimating ? 'animate-flow-dash' : ''}
            />
          </svg>
        )}

        {variant === 'diverge-2' && (
          <svg className="w-full h-8 overflow-visible" preserveAspectRatio="none">
            <path
              d="M 50% 0 L 50% 10 Q 50% 22 25% 32"
              fill="none"
              stroke="#06b6d4"
              strokeWidth="2"
              strokeDasharray={isLiveAnimating ? '4 3' : 'none'}
              className={isLiveAnimating ? 'animate-flow-dash' : ''}
            />
            <path
              d="M 50% 0 L 50% 10 Q 50% 22 75% 32"
              fill="none"
              stroke="#3b82f6"
              strokeWidth="2"
              strokeDasharray={isLiveAnimating ? '4 3' : 'none'}
              className={isLiveAnimating ? 'animate-flow-dash' : ''}
            />
          </svg>
        )}

        {variant === 'converge-2' && (
          <svg className="w-full h-8 overflow-visible" preserveAspectRatio="none">
            <path
              d="M 25% 0 L 25% 10 Q 25% 22 50% 32"
              fill="none"
              stroke="#14b8a6"
              strokeWidth="2"
              strokeDasharray={isLiveAnimating ? '4 3' : 'none'}
              className={isLiveAnimating ? 'animate-flow-dash' : ''}
            />
            <path
              d="M 75% 0 L 75% 10 Q 75% 22 50% 32"
              fill="none"
              stroke="#14b8a6"
              strokeWidth="2"
              strokeDasharray={isLiveAnimating ? '4 3' : 'none'}
              className={isLiveAnimating ? 'animate-flow-dash' : ''}
            />
          </svg>
        )}

        {/* Central Animated Badge Pill */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-2.5 py-0.5 rounded-full bg-slate-950 border border-slate-800 text-[10px] font-mono text-teal-300 flex items-center gap-1 shadow-lg shadow-black/40 z-20">
          <ArrowDown className="w-2.5 h-2.5 text-teal-400" />
          <span>{label}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full bg-[#070D1E] rounded-3xl border border-slate-800 shadow-2xl overflow-hidden font-sans text-slate-100">
      {/* Top Architecture Console Command Bar */}
      <div className="px-6 py-4 bg-slate-900/90 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
            <span>CLOUD TOPOLOGY VISUALIZER</span>
          </div>
          <span className="text-xs text-slate-400 hidden sm:inline">
            Deterministic 7-Tier Architecture Pipeline
          </span>
        </div>

        {/* Flow Role Filter Buttons */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-950 border border-slate-800 text-xs">
          <span className="px-2 text-[11px] font-bold text-slate-500 uppercase tracking-wider hidden md:inline">
            Filter Pipeline:
          </span>
          {(
            [
              { id: 'all', label: 'All Layers', icon: Network },
              { id: 'patient', label: 'Patient Flow', icon: User },
              { id: 'doctor', label: 'Doctor Flow', icon: Stethoscope },
              { id: 'admin', label: 'Admin Flow', icon: Shield },
            ] as const
          ).map((filter) => {
            const FilterIcon = filter.icon;
            const isSelected = activeFlowRole === filter.id;
            return (
              <button
                key={filter.id}
                id={`arch-flow-btn-${filter.id}`}
                onClick={() => setActiveFlowRole(filter.id)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-teal-500 text-slate-950 font-bold shadow-md shadow-teal-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <FilterIcon className="w-3.5 h-3.5" />
                <span>{filter.label}</span>
              </button>
            );
          })}

          <button
            id="arch-anim-toggle"
            onClick={() => setIsLiveAnimating(!isLiveAnimating)}
            className={`p-1.5 rounded-lg border text-xs transition-colors ml-1 ${
              isLiveAnimating
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-slate-800 border-slate-700 text-slate-400'
            }`}
            title={isLiveAnimating ? 'Pause Animated Connections' : 'Resume Animated Connections'}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLiveAnimating ? 'animate-spin' : ''}`} style={{ animationDuration: '4s' }} />
          </button>
        </div>
      </div>

      {/* Main Architectural Canvas + Interactive Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 relative">
        {/* Architectural Flow Canvas (Left / Center) */}
        <div className="lg:col-span-7 xl:col-span-8 p-5 sm:p-8 relative bg-gradient-to-b from-[#070D1E] via-[#091226] to-[#060B18] overflow-hidden">
          {/* Subtle Circuit Grid & Background Aura */}
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(#1e293b 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

          {/* EXACT CONCEPTUAL FLOW NODES */}
          <div className="relative z-10 max-w-2xl mx-auto space-y-3 sm:space-y-4">
            
            {/* LAYER 1: PATIENT, DOCTOR, ADMIN (Stakeholder Tier) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-widest text-slate-500 px-1">
                <span>1. User Personas</span>
                <span>Role-Tailored Viewports</span>
              </div>
              <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
                {renderArchitectureNode('patient', { isPersona: true })}
                {renderArchitectureNode('doctor', { isPersona: true })}
                {renderArchitectureNode('admin', { isPersona: true })}
              </div>
            </div>

            {/* CONNECTOR 1 → 2: Animated Convergence */}
            {renderConnector('HTTPS / Client Ingress', 'converge-3', '#14b8a6')}

            {/* LAYER 2: REACT WEB APPLICATION */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-widest text-slate-500 px-1">
                <span>2. Client Layer</span>
                <span>Single Page Presentation</span>
              </div>
              {renderArchitectureNode('react-app')}
            </div>

            {/* CONNECTOR 2 → 3 */}
            {renderConnector('OAuth 2.0 / JWT Handshake', 'single', '#f59e0b')}

            {/* LAYER 3: FIREBASE AUTHENTICATION */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-widest text-slate-500 px-1">
                <span>3. Identity Gateway</span>
                <span>Signed Bearer Token Minting</span>
              </div>
              {renderArchitectureNode('firebase-auth')}
            </div>

            {/* CONNECTOR 3 → 4 */}
            {renderConnector('Token Claims Validation', 'single', '#10b981')}

            {/* LAYER 4: ROLE-BASED ACCESS CONTROL */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-widest text-slate-500 px-1">
                <span>4. Access Control</span>
                <span>Zero-Trust Policy Gate</span>
              </div>
              {renderArchitectureNode('rbac')}
            </div>

            {/* CONNECTOR 4 → 5 */}
            {renderConnector('Authorized Request Dispatch', 'single', '#6366f1')}

            {/* LAYER 5: NODE.JS + EXPRESS API */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-widest text-slate-500 px-1">
                <span>5. Application Services</span>
                <span>REST Endpoints & Business Logic</span>
              </div>
              {renderArchitectureNode('express-api')}
            </div>

            {/* CONNECTOR 5 → 6: Diverging into Firestore Database + Cloud Storage */}
            {renderConnector('Structured + Object Persistence', 'diverge-2', '#06b6d4')}

            {/* LAYER 6: FIRESTORE DATABASE + CLOUD STORAGE */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-widest text-slate-500 px-1">
                <span>6. Persistence Layer</span>
                <span>Firestore NoSQL + Object Storage</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {renderArchitectureNode('firestore', { isTwin: true })}
                {renderArchitectureNode('cloud-storage', { isTwin: true })}
              </div>
            </div>

            {/* CONNECTOR 6 → 7: Converging to Backup / Monitoring */}
            {renderConnector('Telemetry & Snapshot Pipelines', 'converge-2', '#14b8a6')}

            {/* LAYER 7: BACKUP / MONITORING */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-widest text-slate-500 px-1">
                <span>7. Resilience & Observability</span>
                <span>Continuous Health & DR</span>
              </div>
              {renderArchitectureNode('monitoring')}
            </div>
          </div>
        </div>

        {/* Dedicated Node Hover & Specification Inspector (Right Panel) */}
        <div className="lg:col-span-5 xl:col-span-4 p-6 sm:p-7 bg-slate-950 border-t lg:border-t-0 lg:border-l border-slate-800 flex flex-col justify-between space-y-6">
          <div className="space-y-5">
            {/* Inspector Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping"></span>
                <span className="text-xs font-mono font-bold text-teal-300 uppercase tracking-wider">
                  Active Node Inspector
                </span>
              </div>
              <span className="text-[11px] font-mono text-slate-500">
                Layer 0{activeNode.layerIndex}
              </span>
            </div>

            {/* Component Name & Category */}
            <div>
              <div className="inline-block px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-[10px] font-mono font-bold text-teal-400 uppercase tracking-wider mb-1.5">
                {activeNode.category}
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {activeNode.name}
              </h3>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                {activeNode.badge}
              </p>
            </div>

            {/* Explicit Purpose Section */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-teal-300 uppercase tracking-wider mb-1.5">
                <Info className="w-3.5 h-3.5" />
                <span>Architectural Purpose</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                {activeNode.purpose}
              </p>
            </div>

            {/* Explicit Technology Used Section */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-cyan-300 uppercase tracking-wider mb-1.5">
                <Cpu className="w-3.5 h-3.5" />
                <span>Technology Used</span>
              </div>
              <p className="text-xs font-mono text-cyan-200 leading-relaxed font-semibold">
                {activeNode.technologyUsed}
              </p>
            </div>

            {/* Operational Specifications */}
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Operational Attributes
              </div>
              <div className="space-y-2">
                {activeNode.specs.map((spec, i) => (
                  <div
                    key={i}
                    className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-start justify-between text-xs"
                  >
                    <span className="text-slate-400 font-medium">{spec.label}</span>
                    <span className="text-slate-200 font-mono text-right max-w-[55%]">
                      {spec.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Real Data Payload Preview */}
            <div>
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                <div className="flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-teal-400" />
                  <span>Layer Contract Payload</span>
                </div>
                <span className="text-[10px] font-mono text-slate-500">JSON</span>
              </div>
              <pre className="p-3 rounded-xl bg-slate-900/95 border border-slate-800 text-[11px] font-mono text-teal-300/90 overflow-x-auto leading-tight">
                {activeNode.dataPayloadExample}
              </pre>
            </div>
          </div>

          {/* Interactive Hint */}
          <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
            <span className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5 text-teal-400" /> Hover or click any node to inspect
            </span>
            <span className="text-teal-400 font-mono font-medium">Enterprise Certified</span>
          </div>
        </div>
      </div>
    </div>
  );
};
