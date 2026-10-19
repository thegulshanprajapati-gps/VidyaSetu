import React from 'react';
import { Building2, ShieldCheck, Target, Users, BookOpen } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="space-y-3 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-800 text-xs font-semibold">
          <ShieldCheck className="w-4 h-4 text-blue-600" />
          <span>Official State Education Initiative</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-navy-900 tracking-tight">
          About Bihar College Recruitment Portal
        </h1>
        <p className="text-sm sm:text-base text-textColor-secondary leading-relaxed">
          The Bihar College Recruitment & News Portal was established to standardize, streamline, and centralize higher education hiring notifications across polytechnics, engineering colleges, and universities in the State of Bihar.
        </p>
      </div>

      <div className="bg-white border border-surface-border rounded-xl p-6 sm:p-8 shadow-xs space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed">
        <h2 className="text-base sm:text-lg font-bold text-navy-900 flex items-center gap-2">
          <Target className="w-5 h-5 text-blue-600" />
          <span>Our Core Mission</span>
        </h2>
        <p>
          Historically, educational employment notifications in Bihar have been fragmented across disparate college noticeboards, unverified social media handles, and localized regional newspapers. This fragmentation resulted in delayed discovery, missed application deadlines, and increased vulnerability to fraudulent hiring notices.
        </p>
        <p>
          This portal provides an authoritative digital bridge: educational institutions gain verified sovereign workspaces to publish official vacancies and circulars, while aspiring professors, lecturers, lab assistants, and researchers access trusted, tamper-proof career opportunities.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
            <strong className="text-navy-900 text-sm block">100% Verified</strong>
            <p className="text-xs text-slate-600">Every college undergoes manual credential vetting before gaining publishing authorization.</p>
          </div>
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
            <strong className="text-navy-900 text-sm block">Sovereign Control</strong>
            <p className="text-xs text-slate-600">Colleges independently manage their own vacancies, drafts, and candidate updates.</p>
          </div>
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
            <strong className="text-navy-900 text-sm block">Zero Intermediaries</strong>
            <p className="text-xs text-slate-600">Direct access to official signed notification PDFs and official college payment gateways.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
