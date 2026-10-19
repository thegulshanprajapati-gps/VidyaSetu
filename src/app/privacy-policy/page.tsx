import React from 'react';

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
      <h1 className="text-2xl sm:text-3xl font-black text-navy-900 tracking-tight">
        Privacy & Data Protection Policy
      </h1>
      <div className="bg-white border border-surface-border rounded-xl p-6 sm:p-8 shadow-xs space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
        <p>
          The Bihar College Recruitment Portal is committed to protecting the privacy of educational institutions, administrators, and prospective job applicants.
        </p>
        <h2 className="text-sm sm:text-base font-bold text-navy-900">1. Information Collected</h2>
        <p>
          We collect institutional registration information (official email, college address, administrative contact person) and verification documents for identity corroboration.
        </p>
        <h2 className="text-sm sm:text-base font-bold text-navy-900">2. Confidentiality of Verification Records</h2>
        <p>
          Uploaded institutional verification documents, accreditation filings, and internal moderation notes are strictly confidential and accessible only to authorized platform super administrators.
        </p>
        <h2 className="text-sm sm:text-base font-bold text-navy-900">3. Cookies & Sessions</h2>
        <p>
          We use strictly necessary session cookies to maintain secure authentication and role-based access control. No advertising tracking cookies are utilized.
        </p>
      </div>
    </div>
  );
}
