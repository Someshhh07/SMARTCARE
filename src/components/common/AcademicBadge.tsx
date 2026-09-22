import React from 'react';
import { Database, ShieldCheck } from 'lucide-react';

export const AcademicBadge: React.FC<{ className?: string; variant?: 'subtle' | 'pill' | 'dark' }> = ({
  className = '',
  variant = 'pill',
}) => {
  if (variant === 'dark') {
    return (
      <div
        id="academic-badge-dark"
        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide bg-slate-900/90 text-slate-200 border border-slate-700/80 shadow-xs backdrop-blur-xs ${className}`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse"></span>
        <span className="text-slate-300 font-medium">Research Prototype</span>
        <span className="text-slate-600">•</span>
        <span className="text-teal-300">Synthetic Data</span>
      </div>
    );
  }

  return (
    <div
      id="academic-badge"
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold tracking-tight bg-slate-100/90 text-slate-700 border border-slate-200/80 shadow-xs ${className}`}
    >
      <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
      <span className="font-semibold text-slate-800">Academic Demo</span>
      <span className="text-slate-300">•</span>
      <span className="text-slate-500 font-normal">Centralized Cloud Model</span>
    </div>
  );
};

