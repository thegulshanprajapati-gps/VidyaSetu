import React from 'react';

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
      <h1 className="text-2xl sm:text-3xl font-black text-navy-900 tracking-tight">
        Terms of Service
      </h1>
      <div className="bg-white border border-surface-border rounded-xl p-6 sm:p-8 shadow-xs space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
        <p>
          By accessing or utilizing the Bihar College Recruitment & News Portal, colleges, administrators, and visitors agree to adhere to these statutory terms.
        </p>
        <h2 className="text-sm sm:text-base font-bold text-navy-900">1. Institutional Representation</h2>
        <p>
          Only duly authorized administrative representatives of recognized universities, polytechnics, and colleges in Bihar may register an institutional workspace.
        </p>
        <h2 className="text-sm sm:text-base font-bold text-navy-900">2. Prohibited Content</h2>
        <p>
          Colleges may not post unapproved recruitment announcements, commercial advertisements, or misleading salary promises. Any institution violating these standards is subject to immediate suspension.
        </p>
        <h2 className="text-sm sm:text-base font-bold text-navy-900">3. Moderation & Sanctions</h2>
        <p>
          The Platform Super Admin reserves the right to unpublish, edit for formatting, or reject any content that fails compliance with state technical education guidelines.
        </p>
      </div>
    </div>
  );
}
