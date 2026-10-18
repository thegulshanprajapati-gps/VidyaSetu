'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Briefcase, 
  PlusCircle, 
  FileText, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Eye, 
  Edit, 
  ExternalLink,
  RefreshCw,
  XCircle
} from 'lucide-react';

interface Props {
  initialVacancies: any[];
  collegeName: string;
  collegeId: string;
}

export default function CollegeAdminDashboardClient({
  initialVacancies,
  collegeName,
  collegeId,
}: Props) {
  const [vacancies, setVacancies] = useState<any[]>(initialVacancies);
  const [loading, setLoading] = useState(false);

  const publishedCount = vacancies.filter(v => v.status === 'PUBLISHED').length;
  const inReviewCount = vacancies.filter(v => v.status === 'SUBMITTED' || v.status === 'IN_REVIEW').length;
  const draftCount = vacancies.filter(v => v.status === 'DRAFT').length;

  const refreshVacancies = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/vacancies?collegeId=${collegeId}`);
      const data = await res.json();
      if (data.success) {
        setVacancies(data.vacancies);
      }
    } catch (err) {
      console.error('Failed to reload vacancies:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-navy-900 tracking-tight">
            Institutional Dashboard
          </h1>
          <p className="text-xs text-textColor-secondary">
            Workspace for <strong className="text-navy-900">{collegeName}</strong>. Manage recruitment vacancies and track Directorate moderation in PostgreSQL.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={refreshVacancies}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold shadow-2xs transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-blue-600' : ''}`} />
            <span>Refresh</span>
          </button>

          <Link
            href="/college-admin/vacancies/new"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold shadow-xs transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create New Vacancy</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Vacancies</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-navy-900">{vacancies.length}</div>
          <span className="text-[11px] text-slate-400 block font-medium">All posts created by this college</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-emerald-700">
            <span className="text-xs font-semibold uppercase tracking-wider">Live & Active</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-600">{publishedCount}</div>
          <span className="text-[11px] text-slate-400 block font-medium">Visible across Bihar public portal</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-amber-700">
            <span className="text-xs font-semibold uppercase tracking-wider">Moderation Queue</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-600">{inReviewCount}</div>
          <span className="text-[11px] text-slate-400 block font-medium">Awaiting Super Admin approval</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Drafts</span>
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-700">{draftCount}</div>
          <span className="text-[11px] text-slate-400 block font-medium">Saved drafts not yet submitted</span>
        </div>
      </div>

      {/* Vacancies Management Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Briefcase className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-navy-900">
                Institutional Recruitment Vacancies
              </h2>
              <p className="text-[11px] text-slate-500">Showing posts belonging to {collegeName}</p>
            </div>
          </div>
          
          <Link
            href="/college-admin/vacancies/new"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-colors self-start sm:self-auto"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>New Vacancy</span>
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase tracking-wider text-[10px] font-bold">
                <th className="p-3.5 pl-5 font-bold">Post Designation & Branch</th>
                <th className="p-3.5 font-bold">Category</th>
                <th className="p-3.5 font-bold">Closing Date</th>
                <th className="p-3.5 font-bold">Moderation Status</th>
                <th className="p-3.5 pr-5 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {vacancies.length > 0 ? (
                vacancies.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3.5 pl-5">
                      <div className="font-bold text-navy-900 text-xs sm:text-sm">{v.title}</div>
                      <div className="text-[11px] text-slate-500 font-medium pt-0.5">
                        {v.department} • <span className="font-semibold text-slate-700">{v.numberOfPosts || 1} post(s)</span> • {v.employmentType}
                      </div>
                    </td>
                    <td className="p-3.5">
                      <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-semibold text-[11px] inline-block">
                        {v.jobCategory}
                      </span>
                    </td>
                    <td className="p-3.5 font-medium text-slate-700">
                      <div className="font-bold text-slate-900">{v.applicationCloseDate}</div>
                      <div className="text-[10px] text-slate-500">Mode: {v.applicationMode}</div>
                    </td>
                    <td className="p-3.5">
                      {v.status === 'PUBLISHED' ? (
                        <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold text-[11px] inline-flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          Published
                        </span>
                      ) : v.status === 'SUBMITTED' || v.status === 'IN_REVIEW' ? (
                        <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-bold text-[11px] inline-flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                          Under Review
                        </span>
                      ) : v.status === 'REJECTED' ? (
                        <span className="px-2.5 py-1 rounded-full bg-rose-50 text-rose-800 border border-rose-200 font-bold text-[11px] inline-flex items-center gap-1.5">
                          <XCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                          Rejected
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 font-bold text-[11px] inline-flex items-center gap-1.5">
                          Draft
                        </span>
                      )}
                    </td>
                    <td className="p-3.5 pr-5 text-right space-x-2 whitespace-nowrap">
                      {v.status === 'PUBLISHED' && (
                        <Link
                          href={`/vacancies/${v.slug}`}
                          target="_blank"
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded text-xs font-semibold transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Live</span>
                        </Link>
                      )}
                      <Link
                        href="/college-admin/vacancies/new"
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-slate-700 hover:text-navy-900 hover:bg-slate-100 rounded text-xs font-semibold transition-colors"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500 space-y-2">
                    <Briefcase className="w-8 h-8 text-slate-300 mx-auto" />
                    <p className="text-xs font-semibold text-navy-900">No recruitment vacancies found for this college</p>
                    <p className="text-[11px] text-slate-400">
                      Create your institution&apos;s first vacancy notice to submit it for Super Admin review.
                    </p>
                    <Link
                      href="/college-admin/vacancies/new"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-bold mt-2"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      <span>Create First Vacancy</span>
                    </Link>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
