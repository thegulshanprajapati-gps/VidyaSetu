import React from 'react';
import Link from 'next/link';
import { Clock, ShieldCheck, Mail, ArrowRight, Building2, CheckCircle2 } from 'lucide-react';

export default function RegistrationPendingPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center space-y-6">
      
      {/* Icon Badge */}
      <div className="w-16 h-16 rounded-full bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto shadow-xs">
        <Clock className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <div className="inline-block px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-wider">
          Verification Pending
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-navy-900 tracking-tight">
          Application Received Successfully
        </h1>
        <p className="text-xs sm:text-sm text-textColor-secondary max-w-lg mx-auto leading-relaxed">
          Your institution registration request has been submitted to the platform administration moderation desk.
        </p>
      </div>

      {/* Info Card */}
      <div className="bg-white border border-surface-border rounded-xl p-6 text-left space-y-4 shadow-xs">
        <h3 className="text-xs font-bold uppercase tracking-wider text-navy-900 pb-2 border-b border-slate-100">
          What Happens Next?
        </h3>

        <div className="space-y-3 text-xs">
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0 mt-0.5 text-[11px]">
              1
            </div>
            <div>
              <strong className="text-navy-900 block">Credential & Domain Inspection:</strong>
              <span className="text-slate-600">The platform team will inspect institutional domain references and uploaded affiliation certificates.</span>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0 mt-0.5 text-[11px]">
              2
            </div>
            <div>
              <strong className="text-navy-900 block">Verification Window:</strong>
              <span className="text-slate-600">Verification is typically concluded within 24 to 48 business hours.</span>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0 mt-0.5 text-[11px]">
              3
            </div>
            <div>
              <strong className="text-navy-900 block">Activation Notice:</strong>
              <span className="text-slate-600">Once approved, an activation link and dashboard access credentials will be delivered to the registered administrator work email.</span>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 bg-slate-50 p-3 rounded-lg">
          <strong>Notice:</strong> To safeguard job seekers against fake recruitment circulars, institutional publishing permissions remain locked until approval.
        </div>
      </div>

      {/* Action Links */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <Link
          href="/"
          className="w-full sm:w-auto px-6 py-2.5 bg-navy-500 hover:bg-blue-600 text-white rounded-lg text-xs font-bold transition-colors shadow-2xs"
        >
          Return to Portal Homepage
        </Link>
        <Link
          href="/login"
          className="w-full sm:w-auto px-6 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-navy-900 rounded-lg text-xs font-semibold transition-colors"
        >
          Go to Sign In
        </Link>
      </div>

    </div>
  );
}
