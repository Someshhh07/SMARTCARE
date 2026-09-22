import React, { useState, useEffect } from 'react';
import {
  Server,
  Activity,
  Database,
  HardDrive,
  CheckCircle2,
  Cpu,
  Clock,
  Zap,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import { CloudMonitoringStatus } from '../../types';
import { api } from '../../services/apiService';
import { AcademicBadge } from '../common/AcademicBadge';

export const CloudMonitoringView: React.FC = () => {
  const [monitoring, setMonitoring] = useState<CloudMonitoringStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadStatus();
  }, []);

  const loadStatus = async () => {
    try {
      const data = await api.getCloudMonitoring();
      setMonitoring(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadStatus();
  };

  return (
    <div id="cloud-monitoring-view" className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Cloud Infrastructure Telemetry
            </h2>
            <AcademicBadge />
          </div>
          <p className="text-xs text-slate-500">
            Real-time status monitoring for Firebase Auth, Firestore Database, and Express Gateway.
          </p>
        </div>

        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
          <span>Refresh Telemetry</span>
        </button>
      </div>

      {/* Primary Cloud Services Status (Section 26) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {monitoring?.services.map((srv, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4 hover:border-blue-300 transition-all duration-150"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-sm text-slate-900">{srv.name}</span>
                <span className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/80">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  {srv.status}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-mono">{srv.protocol}</p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium">Response Latency:</span>
              <span className="font-mono font-bold text-blue-700">{srv.latencyMs} ms</span>
            </div>
          </div>
        ))}
      </div>

      {/* Cloud Performance & Usage Metrics (Section 26) */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">Cloud Capacity & Activity Metrics</h3>
            <p className="text-xs text-slate-500">
              Aggregated statistics across cloud tenants. (Values tagged DEMO / SYNTHETIC)
            </p>
          </div>
          <span className="text-[10px] font-mono px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-200/80 rounded-lg font-bold">
            ACADEMIC BENCHMARK
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200/70 space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span className="font-semibold uppercase tracking-wider text-[10px] text-slate-500">Active Users</span>
              <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">
                DEMO
              </span>
            </div>
            <div className="text-3xl font-extrabold text-slate-900 tracking-tight">1,420</div>
            <div className="text-xs text-slate-500 font-medium">Authenticated JWT sessions</div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200/70 space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span className="font-semibold uppercase tracking-wider text-[10px] text-slate-500">Database Records</span>
              <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">
                DEMO
              </span>
            </div>
            <div className="text-3xl font-extrabold text-slate-900 tracking-tight">24,850</div>
            <div className="text-xs text-slate-500 font-medium">Total documents in Firestore</div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200/70 space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span className="font-semibold uppercase tracking-wider text-[10px] text-slate-500">Storage Usage</span>
              <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">
                DEMO
              </span>
            </div>
            <div className="text-3xl font-extrabold text-slate-900 tracking-tight">42.6 GB</div>
            <div className="text-xs text-slate-500 font-medium">Encrypted Cloud Storage objects</div>
          </div>
        </div>

        {/* Live Query Ops Throughput */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100 flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-slate-900 block">Firestore Read Operations (24h)</span>
              <span className="text-slate-500">142,390 reads • 0 document cache misses</span>
            </div>
            <span className="font-mono font-bold text-blue-800 text-xs bg-white px-2.5 py-1 rounded-lg border border-blue-200/80 shadow-2xs">
              99.9% Cache Hit
            </span>
          </div>

          <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100 flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-slate-900 block">Firestore Write Operations (24h)</span>
              <span className="text-slate-500">8,920 writes • Atomic transaction commits</span>
            </div>
            <span className="font-mono font-bold text-blue-800 text-xs bg-white px-2.5 py-1 rounded-lg border border-blue-200/80 shadow-2xs">
              0 Collisions
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
