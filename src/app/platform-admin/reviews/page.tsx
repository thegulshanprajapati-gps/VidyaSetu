'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MOCK_VACANCIES, MOCK_NEWS } from '@/lib/mock-data';
import { 
  CheckSquare, 
  Briefcase, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Eye, 
  FileText,
  Clock
} from 'lucide-react';

export default function PlatformAdminReviewsPage() {
  const [vacancies, setVacancies] = useState(MOCK_VACANCIES);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const pendingVacancies = vacancies.filter(v => v.status === 'SUBMITTED' || v.status === 'IN_REVIEW');

  const handleApprove = (id: string, title: string) => {
    setVacancies(prev => prev.map(v => v.id === id ? { ...v, status: 'PUBLISHED' as const } : v));
    setToastMessage(`"${title}" has been approved and published to the public portal!`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleReject = (id: string, title: string) => {
    setVacancies(prev => prev.map(v => v.id === id ? { ...v, status: 'REJECTED' as const } : v));
    setToastMessage(`"${title}" marked as rejected. Remarks forwarded to college.`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-xl sm:text-2xl font-black text-navy-900 tracking-tight">
          Content Moderation Queue
        </h1>
        <p className="text-xs text-textColor-secondary">
          Review and authorize vacancy notices and official updates submitted by registered colleges.
        </p>
      </div>

      {toastMessage && (
        <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Review Queue List */}
      <div className="space-y-4">
        {pendingVacancies.length > 0 ? (
          pendingVacancies.map((v) => (
            <div key={v.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200 text-[10px] font-bold">
                      {v.jobCategory}
                    </span>
                    <span className="text-xs text-slate-500 font-semibold">{v.collegeName}</span>
                  </div>
                  <h2 className="text-base font-bold text-navy-900">{v.title}</h2>
                  <div className="text-xs text-slate-600">
                    Department: <strong>{v.department}</strong> • Posts: <strong>{v.numberOfPosts || 1}</strong> • Mode: <strong>{v.applicationMode}</strong>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold flex items-center gap-1 self-start">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  Awaiting Approval
                </span>
              </div>

              {/* Recruitment details summary */}
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1 text-slate-700">
                <div><strong>Eligibility:</strong> {v.qualification}</div>
                <div><strong>Salary:</strong> {v.salary || 'Not specified'}</div>
                <div><strong>Closing Date:</strong> {v.applicationCloseDate}</div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => handleReject(v.id, v.title)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 border border-rose-300 text-rose-700 hover:bg-rose-50 rounded text-xs font-semibold transition-colors"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Reject</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleApprove(v.id, v.title)}
                  className="inline-flex items-center gap-1 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-bold shadow-xs transition-colors"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Approve & Publish to Public</span>
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white border border-slate-200 rounded-xl p-12 text-center space-y-3">
            <CheckSquare className="w-10 h-10 text-emerald-500 mx-auto" />
            <h3 className="text-base font-bold text-navy-900">Moderation Queue Clear</h3>
            <p className="text-xs text-textColor-secondary max-w-sm mx-auto">
              All submitted vacancy circulars and announcements have been moderated. New submissions from colleges will appear here automatically.
            </p>
          </div>
        )}
      </div>

    </div>
  );
}
