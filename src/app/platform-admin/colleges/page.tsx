'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Building2, ShieldCheck, Clock, AlertTriangle, Eye, CheckCircle2, XCircle, RefreshCw } from 'lucide-react';

export default function PlatformAdminCollegesPage() {
  const [filter, setFilter] = useState<string>('ALL');
  const [colleges, setColleges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchColleges = async (statusFilter: string) => {
    try {
      setLoading(true);
      const url = statusFilter === 'ALL' ? '/api/colleges' : `/api/colleges?status=${statusFilter}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setColleges(data.colleges);
      }
    } catch (err) {
      console.error('Failed to fetch colleges:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchColleges(filter);
  }, [filter]);

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-navy-900 tracking-tight">
            College Verification & Tenant Management
          </h1>
          <p className="text-xs text-textColor-secondary">
            Inspect submitted institutional credentials, grant posting privileges, or revoke access in PostgreSQL.
          </p>
        </div>

        <button
          onClick={() => fetchColleges(filter)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 rounded text-xs font-semibold border border-slate-300 self-start sm:self-auto shadow-2xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-blue-600' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs overflow-x-auto">
        {[
          { label: 'All Registered', value: 'ALL' },
          { label: 'Pending Review', value: 'PENDING' },
          { label: 'Under Review', value: 'UNDER_REVIEW' },
          { label: 'Approved & Verified', value: 'APPROVED' },
          { label: 'Rejected', value: 'REJECTED' },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilter(tab.value)}
            className={`px-3 py-1.5 font-semibold rounded-md transition-colors shrink-0 ${
              filter === tab.value
                ? 'bg-navy-500 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-200 hover:text-navy-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase tracking-wider text-[11px]">
                <th className="p-3 font-semibold">College & District</th>
                <th className="p-3 font-semibold">Type & Ownership</th>
                <th className="p-3 font-semibold">Registered Date</th>
                <th className="p-3 font-semibold">Verification Status</th>
                <th className="p-3 font-semibold text-right">Decision Console</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-400">
                    Querying Aiven PostgreSQL...
                  </td>
                </tr>
              ) : colleges.length > 0 ? (
                colleges.map((col) => (
                  <tr key={col.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3">
                      <div className="font-bold text-navy-900">{col.name}</div>
                      <div className="text-[11px] text-slate-500">{col.district}, {col.state}</div>
                    </td>
                    <td className="p-3">
                      <div className="font-medium text-slate-800">{col.institutionType}</div>
                      <div className="text-[11px] text-slate-500">{col.ownershipType}</div>
                    </td>
                    <td className="p-3 text-slate-600">
                      {col.submittedAt || '2026-08-10'}
                    </td>
                    <td className="p-3">
                      {col.verificationStatus === 'APPROVED' ? (
                        <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-bold inline-flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                          Approved
                        </span>
                      ) : col.verificationStatus === 'REJECTED' ? (
                        <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-800 border border-rose-200 text-[11px] font-bold inline-flex items-center gap-1">
                          <XCircle className="w-3.5 h-3.5 text-rose-600" />
                          Rejected
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 text-[11px] font-bold inline-flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-amber-600" />
                          {col.verificationStatus}
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-right">
                      <Link
                        href={`/platform-admin/colleges/${col.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-navy-500 hover:bg-blue-600 text-white rounded text-xs font-semibold transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500">
                    No colleges match the selected filter.
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
