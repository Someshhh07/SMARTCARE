import React, { useState, useEffect } from 'react';
import {
  Database,
  Table,
  Layers,
  Server,
  Cloud,
  Network,
  ExternalLink,
  Copy,
  Check,
  RefreshCw,
  FolderOpen,
  FileJson,
  ShieldCheck,
  Key,
  History,
} from 'lucide-react';
import { AcademicBadge } from '../common/AcademicBadge';
import { CloudArchitectureVisualizer } from '../landing/CloudArchitectureVisualizer';
import { collection, getDocs } from 'firebase/firestore';
import { db, firebaseConfig } from '../../firebase';
import { FirestoreService } from '../../services/firestoreService';
import { useAuth } from '../../context/AuthContext';
import { SectionHistoryDrawer } from '../common/SectionHistoryDrawer';

export const DataArchitectureView: React.FC = () => {
  const { showToast } = useAuth();
  const [activeTab, setActiveTab] = useState<'live-explorer' | 'topology' | 'schema'>('live-explorer');
  const [selectedCol, setSelectedCol] = useState<string>('medicalRecords');
  const [liveCol, setLiveCol] = useState<string>('medicalRecords');
  const [liveDocs, setLiveDocs] = useState<Array<{ id: string; data: any }>>([]);
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const [loadingLive, setLoadingLive] = useState<boolean>(false);
  const [syncingAll, setSyncingAll] = useState<boolean>(false);
  const [copiedDbId, setCopiedDbId] = useState<boolean>(false);
  const [historyOpen, setHistoryOpen] = useState<boolean>(false);

  const collections = [
    {
      id: 'users',
      name: 'users',
      badge: 'Identity Store',
      color: 'border-blue-500 text-blue-400',
      description: 'Central authentication credentials and assigned roles (patient, doctor, admin).',
      fields: [
        { name: 'id', type: 'string', desc: 'Primary User UID' },
        { name: 'email', type: 'string', desc: 'Unique email credential' },
        { name: 'role', type: 'string', desc: '"patient" | "doctor" | "admin"' },
        { name: 'name', type: 'string', desc: 'Display name' },
        { name: 'status', type: 'string', desc: '"active" | "inactive"' },
        { name: 'createdAt', type: 'timestamp', desc: 'ISO creation date' },
      ],
      relations: ['Linked 1:1 to patients.userId or doctors.userId'],
    },
    {
      id: 'patients',
      name: 'patients',
      badge: 'Patient Profiles',
      color: 'border-emerald-500 text-emerald-400',
      description: 'Longitudinal clinical profiles, allergies, blood group, and emergency contacts.',
      fields: [
        { name: 'id', type: 'string', desc: 'Unique Patient ID' },
        { name: 'userId', type: 'string', desc: 'Foreign Key → users.id' },
        { name: 'name', type: 'string', desc: 'Legal full name' },
        { name: 'age', type: 'number', desc: 'Demographic age' },
        { name: 'bloodGroup', type: 'string', desc: 'ABO Rh typing' },
        { name: 'medicalHistory', type: 'string', desc: 'Chronic conditions / allergies' },
      ],
      relations: ['Has many appointments.patientId', 'Has many medicalRecords.patientId'],
    },
    {
      id: 'doctors',
      name: 'doctors',
      badge: 'Physician Registry',
      color: 'border-teal-500 text-teal-400',
      description: 'Verified healthcare specialists, departmental affiliations, and outpatient consultation rates.',
      fields: [
        { name: 'id', type: 'string', desc: 'Unique Doctor ID' },
        { name: 'userId', type: 'string', desc: 'Foreign Key → users.id' },
        { name: 'name', type: 'string', desc: 'Physician title & name' },
        { name: 'specialization', type: 'string', desc: 'Clinical specialty' },
        { name: 'department', type: 'string', desc: 'Hospital wing' },
        { name: 'availabilityHours', type: 'string', desc: 'Outpatient slot window' },
      ],
      relations: ['Has many appointments.doctorId', 'Authors medicalRecords.doctorId'],
    },
    {
      id: 'appointments',
      name: 'appointments',
      badge: 'Outpatient Scheduler',
      color: 'border-amber-500 text-amber-400',
      description: 'Booked, fulfilled, and cancelled clinical appointment slots.',
      fields: [
        { name: 'id', type: 'string', desc: 'Appointment UID' },
        { name: 'patientId', type: 'string', desc: 'Foreign Key → patients.id' },
        { name: 'doctorId', type: 'string', desc: 'Foreign Key → doctors.id' },
        { name: 'date', type: 'string', desc: 'YYYY-MM-DD' },
        { name: 'time', type: 'string', desc: 'Outpatient time' },
        { name: 'status', type: 'string', desc: '"confirmed" | "completed" | "cancelled"' },
      ],
      relations: ['Connects Patient and Doctor for specific time slot'],
    },
    {
      id: 'medicalRecords',
      name: 'medicalRecords',
      badge: 'EHR Clinical Vault',
      color: 'border-indigo-500 text-indigo-400',
      description: 'Consultation notes, prescriptions, laboratory PDFs, and discharge summaries.',
      fields: [
        { name: 'id', type: 'string', desc: 'Medical Record ID' },
        { name: 'recordId', type: 'string', desc: 'Business ID (e.g. SMC-REC-2026-089)' },
        { name: 'patientId', type: 'string', desc: 'Foreign Key → patients.id' },
        { name: 'doctorId', type: 'string', desc: 'Foreign Key → doctors.id' },
        { name: 'recordType', type: 'string', desc: 'Clinical categorization' },
        { name: 'consultationNotes', type: 'string', desc: 'Encrypted clinical narrative' },
      ],
      relations: ['Belongs to Patient, authored by Attending Doctor'],
    },
  ];

  const active = collections.find((c) => c.id === selectedCol) || collections[0];

  const fetchLiveCollectionDocs = async (collectionName: string) => {
    setLoadingLive(true);
    try {
      const snap = await getDocs(collection(db, collectionName));
      const items: Array<{ id: string; data: any }> = [];
      snap.forEach((d) => {
        items.push({ id: d.id, data: d.data() });
      });
      setLiveDocs(items);
      if (items.length > 0) {
        setSelectedDocId(items[0].id);
      } else {
        setSelectedDocId(null);
      }
    } catch (err: any) {
      console.warn('Error fetching live collection documents:', err);
    } finally {
      setLoadingLive(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'live-explorer') {
      fetchLiveCollectionDocs(liveCol);
    }
  }, [activeTab, liveCol]);

  const handleCopyDbId = () => {
    navigator.clipboard.writeText(firebaseConfig.firestoreDatabaseId);
    setCopiedDbId(true);
    showToast('Database ID copied to clipboard!');
    setTimeout(() => setCopiedDbId(false), 2500);
  };

  const handleSyncAll = async () => {
    setSyncingAll(true);
    try {
      const res = await FirestoreService.seedSmartCareProjectData();
      showToast(`Synchronized ${res.totalStored} documents to Cloud Database!`);
      await fetchLiveCollectionDocs(liveCol);
    } catch (err) {
      console.error(err);
      showToast('Sync error. Please retry.');
    } finally {
      setSyncingAll(false);
    }
  };

  const selectedDocument = liveDocs.find((d) => d.id === selectedDocId) || liveDocs[0];

  const firebaseConsoleUrl = `https://console.firebase.google.com/project/${firebaseConfig.projectId}/firestore/databases/${firebaseConfig.firestoreDatabaseId}/data`;
  const gcpConsoleUrl = `https://console.cloud.google.com/firestore/databases/${firebaseConfig.firestoreDatabaseId}/data?project=${firebaseConfig.projectId}`;

  return (
    <div id="data-architecture-view" className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-2 border-b border-slate-200/90 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Cloud Database & Storage Access
            </h2>
            <AcademicBadge />
          </div>
          <p className="text-xs text-slate-500">
            Real-time NoSQL data repository, cloud access links, and schema hierarchy for SmartCare.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center p-1 rounded-xl bg-slate-200/80 border border-slate-300 text-xs">
          <button
            id="tab-btn-live-explorer"
            onClick={() => setActiveTab('live-explorer')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
              activeTab === 'live-explorer'
                ? 'bg-slate-900 text-white font-bold shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FolderOpen className="w-3.5 h-3.5" />
            <span>Live Database Explorer</span>
          </button>
          <button
            id="tab-btn-topology"
            onClick={() => setActiveTab('topology')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
              activeTab === 'topology'
                ? 'bg-slate-900 text-white font-bold shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Network className="w-3.5 h-3.5" />
            <span>Cloud Architecture Flow</span>
          </button>
          <button
            id="tab-btn-schema"
            onClick={() => setActiveTab('schema')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
              activeTab === 'schema'
                ? 'bg-slate-900 text-white font-bold shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Firestore ER Model</span>
          </button>

          <button
            id="db-history-btn"
            onClick={() => setHistoryOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold text-slate-700 hover:text-slate-950 hover:bg-slate-300/60 transition-all cursor-pointer ml-1 border-l border-slate-300/80 pl-2.5"
            title="View database schema sync and document mutation history"
          >
            <History className="w-3.5 h-3.5 text-teal-700" />
            <span>Sync History</span>
          </button>
        </div>
      </div>

      {/* Cloud Database Access Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 rounded-2xl p-5 sm:p-6 text-white border border-slate-700/80 shadow-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
              <span className="text-[11px] font-bold font-mono uppercase tracking-widest text-teal-300">
                Cloud Database Location & Credentials
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
              <div>
                <span className="text-slate-400">Project ID:</span>{' '}
                <span className="font-mono font-bold text-slate-100">{firebaseConfig.projectId}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400">Database ID:</span>{' '}
                <span className="font-mono font-bold text-teal-300">{firebaseConfig.firestoreDatabaseId}</span>
                <button
                  onClick={handleCopyDbId}
                  className="p-1 rounded hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  title="Copy Database ID"
                >
                  {copiedDbId ? <Check className="w-3.5 h-3.5 text-teal-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <div>
                <span className="text-slate-400">Region:</span>{' '}
                <span className="font-mono text-slate-200">asia-east1</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <a
              href={firebaseConsoleUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <span>Firebase Console</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <a
              href={gcpConsoleUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-600 shadow-xs transition-colors"
            >
              <span>Google Cloud Console</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* TAB 1: LIVE DATABASE EXPLORER */}
      {activeTab === 'live-explorer' && (
        <div className="space-y-4">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-bold text-slate-500 mr-1 flex items-center gap-1">
                <Table className="w-3.5 h-3.5 text-teal-600" /> Collections:
              </span>
              {collections.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setLiveCol(c.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
                    liveCol === c.id
                      ? 'bg-teal-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                  }`}
                >
                  /{c.name}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => fetchLiveCollectionDocs(liveCol)}
                disabled={loadingLive}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-medium transition-colors cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingLive ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>

              <button
                onClick={handleSyncAll}
                disabled={syncingAll}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
              >
                <Database className="w-3.5 h-3.5 text-teal-600" />
                <span>{syncingAll ? 'Writing to DB...' : 'Re-Sync Dataset'}</span>
              </button>
            </div>
          </div>

          {/* Explorer Layout: Document List & Document Data Inspector */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Left Col: Document IDs */}
            <div className="lg:col-span-4 bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <FolderOpen className="w-4 h-4 text-teal-600" />
                  <span className="font-mono text-xs font-bold text-slate-800">/{liveCol}</span>
                </div>
                <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                  {liveDocs.length} documents
                </span>
              </div>

              {loadingLive ? (
                <div className="py-8 text-center text-xs text-slate-400">Loading documents from Cloud Database...</div>
              ) : liveDocs.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400 space-y-2">
                  <div>No documents found in /{liveCol}.</div>
                  <button
                    onClick={handleSyncAll}
                    className="text-teal-600 font-bold hover:underline cursor-pointer"
                  >
                    Click to populate initial project data
                  </button>
                </div>
              ) : (
                <div className="space-y-1 max-h-120 overflow-y-auto scrollbar-thin pr-1">
                  {liveDocs.map((doc) => {
                    const isSelected = doc.id === selectedDocId;
                    return (
                      <button
                        key={doc.id}
                        onClick={() => setSelectedDocId(doc.id)}
                        className={`w-full text-left p-2.5 rounded-xl text-xs font-mono transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'bg-teal-50 border border-teal-200 text-teal-900 font-bold shadow-2xs'
                            : 'bg-slate-50/70 border border-slate-100 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <span className="truncate max-w-[200px]">{doc.id}</span>
                        {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-teal-500"></span>}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Right Col: Document Fields & Raw JSON */}
            <div className="lg:col-span-8 bg-slate-900 rounded-2xl p-5 border border-slate-800 shadow-xl text-slate-100 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
                <div className="flex items-center gap-2">
                  <FileJson className="w-4 h-4 text-teal-400" />
                  <span className="text-xs font-mono font-bold text-teal-300">
                    /{liveCol}/{selectedDocId || 'Select a document'}
                  </span>
                </div>
                <div className="text-[10px] font-mono text-slate-400">Cloud Firestore Document Data</div>
              </div>

              {selectedDocument ? (
                <div className="space-y-4">
                  {/* Summary key-value tags */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                    {Object.entries(selectedDocument.data)
                      .filter(([_, val]) => typeof val === 'string' || typeof val === 'number')
                      .slice(0, 6)
                      .map(([key, val]) => (
                        <div key={key} className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
                          <div className="text-[10px] uppercase font-mono text-slate-400 font-semibold">{key}</div>
                          <div className="font-mono text-slate-200 truncate mt-0.5 font-bold">
                            {String(val)}
                          </div>
                        </div>
                      ))}
                  </div>

                  {/* Formatted JSON Payload */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                      <span>Raw Stored Fields (JSON):</span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(JSON.stringify(selectedDocument.data, null, 2));
                          showToast('Document JSON copied!');
                        }}
                        className="text-teal-400 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Copy className="w-3 h-3" />
                        <span>Copy JSON</span>
                      </button>
                    </div>
                    <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-teal-300 overflow-x-auto max-h-96 scrollbar-thin">
                      {JSON.stringify(selectedDocument.data, null, 2)}
                    </pre>
                  </div>
                </div>
              ) : (
                <div className="py-16 text-center text-xs text-slate-500">
                  Select a document from the left panel to inspect its fields.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ARCHITECTURE TOPOLOGY FLOW */}
      {activeTab === 'topology' && <CloudArchitectureVisualizer />}

      {/* TAB 3: FIRESTORE ER MODEL & SCHEMA */}
      {activeTab === 'schema' && (
        <div className="bg-slate-900 rounded-2xl p-6 sm:p-8 text-white border border-slate-800 shadow-xl space-y-7">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800/80 gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-500/15 border border-teal-500/30 text-teal-400 flex items-center justify-center">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-sm text-white tracking-tight">Centralised Cloud Firestore Instance</div>
                <div className="text-[11px] font-mono text-slate-400">
                  Database ID: {firebaseConfig.firestoreDatabaseId} • Multi-region: asia-east1
                </div>
              </div>
            </div>
            <span className="text-xs font-mono text-teal-400 bg-teal-950/60 px-3 py-1 rounded-xl border border-teal-500/30 self-start sm:self-auto">
              NoSQL Schema Verified
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3.5">
            {collections.map((col) => {
              const isSelected = selectedCol === col.id;
              return (
                <div
                  key={col.id}
                  onClick={() => setSelectedCol(col.id)}
                  className={`p-4 rounded-xl border transition-all duration-150 cursor-pointer ${
                    isSelected
                      ? 'bg-slate-800/90 border-teal-400 shadow-md shadow-teal-500/10'
                      : 'bg-slate-950/50 border-slate-800/90 hover:border-slate-700 hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-400">
                      Collection
                    </span>
                    <Table className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                  <div className="font-mono text-sm font-bold text-white mb-1">/{col.name}</div>
                  <div className="text-[11px] text-teal-400 font-medium">{col.badge}</div>
                  <div className="text-[10px] font-mono text-slate-500 mt-2">
                    {col.fields.length} schema fields
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-slate-950/70 rounded-xl p-6 border border-slate-800/90 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800/80 gap-2">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-teal-400 font-semibold">
                  Collection Inspector
                </span>
                <h3 className="text-lg font-bold text-white tracking-tight">/{active.name}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{active.description}</p>
              </div>
              <span className="text-xs font-mono text-slate-400 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800 self-start sm:self-auto">
                Rules: Default Deny + RBAC
              </span>
            </div>

            <div className="space-y-2">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Document Field Schema
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                {active.fields.map((f, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl bg-slate-900/90 border border-slate-800/80 flex items-center justify-between gap-2"
                  >
                    <div className="font-mono font-bold text-slate-200">
                      {f.name}
                      <span className="ml-2 text-[10px] text-teal-400 font-normal">({f.type})</span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-medium text-right">{f.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800/80 text-xs text-slate-400">
              <span className="font-semibold text-slate-300 block mb-1">Relational Flow:</span>
              <ul className="list-disc list-inside space-y-1 text-slate-400">
                {active.relations.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Central Database Sync History Drawer */}
      <SectionHistoryDrawer
        isOpen={historyOpen}
        onClose={() => setHistoryOpen(false)}
        activeSection="architecture-view"
        sectionTitle="Cloud Database & Firestore Mutation History"
      />
    </div>
  );
};
