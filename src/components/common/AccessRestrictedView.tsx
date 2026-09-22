import React from 'react';
import { ShieldAlert, ArrowLeft, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AccessRestrictedView: React.FC<{ onReturn: () => void }> = ({ onReturn }) => {
  const { user } = useAuth();

  return (
    <div className="py-16 flex items-center justify-center">
      <div className="bg-white rounded-2xl max-w-md w-full p-8 border border-slate-200/80 shadow-xl text-center space-y-5">
        <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center mx-auto shadow-2xs">
          <ShieldAlert className="w-7 h-7" />
        </div>

        <div className="space-y-1">
          <h3 className="text-xl font-bold text-slate-900 tracking-tight">Access Restricted</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            You do not have permission to access this resource under current role{' '}
            <span className="font-semibold uppercase text-slate-800">[{user?.role || 'ANONYMOUS'}]</span>.
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/70 text-slate-600 text-xs text-left space-y-1.5">
          <div className="font-semibold text-slate-900 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-blue-600" />
            <span>Role-Based Access Policy Enforced</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            SmartCare Cloud zero-trust security prohibits horizontal privilege escalation. Switch to an authorized role in the top header role selector to inspect this clinical resource.
          </p>
        </div>

        <button
          onClick={onReturn}
          className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all duration-150 shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Authorized Dashboard</span>
        </button>
      </div>
    </div>
  );
};
