import React from 'react';
import { ShieldCheck, Database, Sparkles } from 'lucide-react';

export const PersistentBanner: React.FC = () => {
  return (
    <div
      id="persistent-academic-banner"
      className="w-full bg-[#0F172A] text-slate-300 py-2 px-4 text-xs font-semibold tracking-wider text-center border-b border-slate-800 flex items-center justify-center gap-2 select-none relative z-50 shadow-xs"
    >
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#06B6D4] opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#06B6D4] shadow-[0_0_8px_#06B6D4]"></span>
      </span>
      <span className="font-bold tracking-widest text-[11px] text-slate-200 uppercase font-mono">
        ACADEMIC PROTOTYPE • SYNTHETIC DATA
      </span>
      <span className="text-slate-600 hidden sm:inline">•</span>
      <span className="text-[11px] text-teal-400/90 font-medium hidden sm:inline">
        Cloud Healthcare Research & Outpatient Demonstration
      </span>
    </div>
  );
};
