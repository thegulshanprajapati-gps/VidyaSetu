import React from 'react';
import { Building2, ShieldCheck, Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 space-y-6">
      
      {/* Animated Emblem Shell */}
      <div className="relative flex items-center justify-center">
        <div className="w-20 h-20 rounded-2xl bg-navy-50 border border-navy-100 flex items-center justify-center shadow-xs animate-pulse">
          <Building2 className="w-10 h-10 text-navy-500 animate-bounce" />
        </div>
        <div className="absolute -inset-2 rounded-2xl border-2 border-blue-500/20 border-t-blue-600 animate-spin"></div>
      </div>

      {/* Title & Status */}
      <div className="text-center space-y-2 max-w-sm">
        <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-navy-900 uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Bihar College Portal</span>
        </div>
        <h2 className="text-base sm:text-lg font-black text-navy-900 tracking-tight">
          Connecting to State Institutional Network
        </h2>
        <p className="text-xs text-textColor-secondary leading-relaxed">
          Retrieving live recruitment notifications, verified vacancies, and official notices from PostgreSQL database...
        </p>
      </div>

      {/* Progress Bar Animation */}
      <div className="w-56 h-1.5 bg-slate-200 rounded-full overflow-hidden">
        <div className="w-full h-full bg-blue-600 rounded-full animate-pulse origin-left"></div>
      </div>

    </div>
  );
}
