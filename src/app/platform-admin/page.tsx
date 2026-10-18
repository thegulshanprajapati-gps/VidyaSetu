'use client';

import React from 'react';
import Link from 'next/link';
import { MOCK_COLLEGES, MOCK_VACANCIES } from '@/lib/mock-data';
import { 
  Building2, 
  Clock, 
  ShieldCheck, 
  AlertTriangle, 
  Briefcase, 
  ArrowRight,
  Activity,
  CheckCircle2,
  XCircle,
  FileText
} from 'lucide-react';

export default function PlatformAdminDashboard() {
  const pendingColleges = MOCK_COLLEGES.filter(c => c.verificationStatus === 'PENDING' || c.verificationStatus === 'UNDER_REVIEW');
  const approvedColleges = MOCK_COLLEGES.filter(c => c.verificationStatus === 'APPROVED');
  const pendingVacancies = MOCK_VACANCIES.filter(v => v.status === 'SUBMITTED' || v.status === 'IN_REVIEW');

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-xl sm:text-2xl font-black text-navy-900 tracking-tight">
          Platform Administration Overview
        </h1>
        <p className="text-xs text-textColor-secondary">
          Monitor institutional verification requests, audit logs, and recruitment content moderation across Bihar.
        </p>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-amber-700">
            <span className="text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-600" />
              Pending Colleges
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
              Review
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-600">{pendingColleges.length}</div>
          <span className="text-[11px] text-slate-500 block font-medium">Requires credential review</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-emerald-700">
            <span className="text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Verified Colleges
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
              Active
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-600">{approvedColleges.length}</div>
          <span className="text-[11px] text-slate-500 block font-medium">Active publishing privileges</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-blue-700">
            <span className="text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <Briefcase className="w-4 h-4 text-blue-600" />
              Pending Vacancies
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
              Queue
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-blue-600">{pendingVacancies.length}</div>
          <span className="text-[11px] text-slate-500 block font-medium">Awaiting moderator signoff</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-600">
            <span className="text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-slate-500" />
              System Status
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
              Live
            </span>
          </div>
          <div className="text-sm font-bold text-emerald-600 pt-2 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Operational Cluster
          </div>
          <span className="text-[11px] text-slate-500 block font-medium">Bihar Pilot v1.0</span>
        </div>

      </div>

      {/* Main Grid: Pending Action Queues */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Pending College Approvals */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-sm font-bold text-navy-900 flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-amber-600" />
              <span>Pending College Verifications ({pendingColleges.length})</span>
            </h2>
            <Link
              href="/platform-admin/colleges"
              className="text-xs font-semibold text-blue-600 hover:underline"
            >
              Full Queue
            </Link>
          </div>

          <div className="space-y-3">
            {pendingColleges.map((col) => (
              <div key={col.id} className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-navy-900">{col.name}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                    {col.verificationStatus}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500">
                  {col.district} • {col.institutionType} • Submitted on {col.submittedAt || 'Recent'}
                </div>
                <div className="pt-2 flex items-center justify-end">
                  <Link
                    href={`/platform-admin/colleges/${col.id}`}
                    className="px-3 py-1 bg-navy-500 hover:bg-blue-600 text-white rounded text-xs font-semibold transition-colors"
                  >
                    Inspect Evidence & Decide
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Content Moderation Queue */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-sm font-bold text-navy-900 flex items-center gap-1.5">
              <Briefcase className="w-4 h-4 text-blue-600" />
              <span>Content Moderation Queue ({pendingVacancies.length})</span>
            </h2>
            <Link
              href="/platform-admin/reviews"
              className="text-xs font-semibold text-blue-600 hover:underline"
            >
              Review All
            </Link>
          </div>

          <div className="space-y-3">
            {pendingVacancies.length > 0 ? (
              pendingVacancies.map((v) => (
                <div key={v.id} className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-navy-900">{v.title}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                      {v.status}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {v.collegeName} • {v.jobCategory}
                  </div>
                  <div className="pt-2 flex items-center justify-end gap-2">
                    <Link
                      href="/platform-admin/reviews"
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-semibold transition-colors"
                    >
                      Approve & Publish
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-slate-400 text-xs">
                No pending vacancies in review queue.
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
