import React from 'react';
import { AlertTriangle, ShieldCheck } from 'lucide-react';

export default function DisclaimerPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-black text-navy-900 tracking-tight">
          Official Recruitment Disclaimer
        </h1>
        <p className="text-xs sm:text-sm text-textColor-secondary">
          Important legal advisory regarding recruitment notices, eligibility validation, and application fees.
        </p>
      </div>

      <div className="bg-white border border-surface-border rounded-xl p-6 sm:p-8 shadow-xs space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
        <div className="p-4 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 space-y-1">
          <div className="font-bold flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>Candidate Notice:</span>
          </div>
          <p>
            Bihar College Recruitment Portal functions as a centralized noticeboard and institutional discovery platform. The platform does NOT conduct examinations, determine final candidate merit, or collect recruitment fees on behalf of individual institutions.
          </p>
        </div>

        <h2 className="text-sm sm:text-base font-bold text-navy-900 pt-2">1. Verification of Original Documents</h2>
        <p>
          While all registered colleges must submit regulatory affiliation documents and pass administrative vetting before posting, candidates are required to cross-verify all details against the original signed notification PDF issued by the concerned institution.
        </p>

        <h2 className="text-sm sm:text-base font-bold text-navy-900 pt-2">2. Fee Submissions & Official URLs</h2>
        <p>
          Never transfer application fees to unauthorized personal accounts, UPI IDs, or third-party gateways. Only use official banking instruments or state government payment portals specified in the signed notification document.
        </p>

        <h2 className="text-sm sm:text-base font-bold text-navy-900 pt-2">3. Discrepancies and Corrigenda</h2>
        <p>
          In the event of any typographical variance between this portal&apos;s summary and the institution&apos;s published notification PDF or gazette order, the official signed notification shall take legal precedence.
        </p>
      </div>
    </div>
  );
}
