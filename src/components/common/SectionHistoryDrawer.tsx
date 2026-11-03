import React, { useState, useEffect } from 'react';
import {
  History,
  X,
  Search,
  Filter,
  RefreshCw,
  Download,
  Calendar,
  FileText,
  Clock,
  User,
  Shield,
  Activity,
  Server,
  Database,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { SectionHistoryItem } from '../../types';
import { api } from '../../services/apiService';

interface SectionHistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeSection: string;
  sectionTitle?: string;
}

export const SectionHistoryDrawer: React.FC<SectionHistoryDrawerProps> = ({
  isOpen,
  onClose,
  activeSection,
  sectionTitle,
}) => {
  const [items, setItems] = useState<SectionHistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  useEffect(() => {
    if (isOpen) {
      loadHistory();
    }
  }, [isOpen, activeSection]);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const data = await api.getSectionHistory(activeSection);
      setItems(data);
    } catch (err) {
      console.error('Failed to load section history:', err);
    } finally {
      setLoading(false);
    }
  };

  const getSectionFriendlyName = (sec: string) => {
    switch (sec) {
      case 'appointments':
        return 'Appointments & Outpatient Agenda';
      case 'medical-records':
        return 'Medical Records & EHR Vault';
      case 'patients':
        return 'Patients Directory';
      case 'users':
        return 'User Account Governance';
      case 'monitoring':
        return 'Cloud Infrastructure Telemetry';
      case 'architecture-view':
        return 'Central Database & Firestore Architecture';
      case 'rbac-matrix':
        return 'Role-Based Access Control Matrix';
      case 'dashboard':
        return 'Workspace & Session Activity';
      default:
        return sectionTitle || 'Section Activity';
    }
  };

  const filteredItems = items.filter((item) => {
    if (filterType !== 'all') {
      const b = (item.badge || item.status || '').toLowerCase();
      if (!b.includes(filterType.toLowerCase())) return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.details.toLowerCase().includes(q) ||
        item.actor.toLowerCase().includes(q) ||
        (item.target && item.target.toLowerCase().includes(q)) ||
        (item.recordRef && item.recordRef.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(items, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${activeSection}-history-audit.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs transition-opacity duration-200"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-xl bg-white shadow-2xl flex flex-col h-full z-10 animate-in slide-in-from-right-4 duration-200 border-l border-slate-200">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-200/90 bg-slate-50/80 shrink-0">
          <div className="flex items-center justify-between gap-3 mb-2">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-700 flex items-center justify-center font-bold">
                <History className="w-4.5 h-4.5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                  <span>Section Audit History</span>
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-teal-100/70 text-teal-800 border border-teal-200">
                    Live Logs
                  </span>
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  {getSectionFriendlyName(activeSection)}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
              title="Close history panel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search, Filter & Action toolbar */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <div className="relative flex-1 min-w-[160px]">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search history entries..."
                className="w-full pl-8.5 pr-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition-all"
              />
            </div>

            <button
              type="button"
              onClick={loadHistory}
              disabled={loading}
              className="p-1.5 px-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              title="Refresh logs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            <button
              type="button"
              onClick={handleExportJSON}
              className="p-1.5 px-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              title="Export history audit as JSON"
            >
              <Download className="w-3.5 h-3.5 text-teal-600" />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-3.5 bg-slate-50/40">
          {loading ? (
            <div className="py-20 text-center text-xs text-slate-400 flex flex-col items-center gap-3">
              <RefreshCw className="w-5 h-5 animate-spin text-teal-600" />
              <span>Fetching chronological audit events...</span>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="py-20 text-center rounded-2xl border border-dashed border-slate-200 p-8 text-xs text-slate-400 space-y-2">
              <History className="w-8 h-8 mx-auto text-slate-300" />
              <div className="font-semibold text-slate-600">No history events matching criteria</div>
              <p className="text-[11px] text-slate-400">
                Any modifications, appointments, consultations, or logins in this section will append an immutable audit trace here.
              </p>
            </div>
          ) : (
            filteredItems.map((item, index) => {
              const dateObj = new Date(item.timestamp);
              const formattedDate = isNaN(dateObj.getTime())
                ? item.timestamp
                : dateObj.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  });

              return (
                <div
                  key={item.id || index}
                  className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:border-slate-300 transition-all space-y-2.5 relative group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-teal-500 shrink-0"></span>
                      <h4 className="text-xs font-bold text-slate-900 leading-snug">
                        {item.title}
                      </h4>
                    </div>
                    {item.badge && (
                      <span className="text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200 shrink-0">
                        {item.badge}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    {item.details}
                  </p>

                  <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-[10px] text-slate-500">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-700">Actor:</span>
                      <span className="font-mono text-slate-600">{item.actor}</span>
                      {item.target && (
                        <>
                          <span className="text-slate-300">→</span>
                          <span className="font-mono text-slate-600">{item.target}</span>
                        </>
                      )}
                    </div>

                    <div className="flex items-center gap-1 font-mono text-slate-400">
                      <Clock className="w-3 h-3" />
                      <span>{formattedDate}</span>
                    </div>
                  </div>

                  {item.recordRef && (
                    <div className="text-[10px] font-mono text-slate-400">
                      Ref ID: <span className="text-teal-700 font-semibold">{item.recordRef}</span>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-white text-xs text-slate-500 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-1.5 font-mono text-[11px] text-teal-800 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200/60">
            <Shield className="w-3.5 h-3.5 text-teal-600" />
            <span>Immutable Audit Stream Verified</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
