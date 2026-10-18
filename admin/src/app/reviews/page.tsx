'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  CheckSquare, 
  Briefcase, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  RefreshCw,
  ExternalLink,
  Clock,
  Building2
} from 'lucide-react';

export default function AdminReviewsPage() {
  const [vacancies, setVacancies] = useState<any[]>([]);
  const [filter, setFilter] = useState<'SUBMITTED' | 'ALL'>('SUBMITTED');
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchVacancies = async (statusFilter: string) => {
    try {
      setLoading(true);
      const url = statusFilter === 'ALL' ? '/api/vacancies' : `/api/vacancies?status=${statusFilter}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setVacancies(data.vacancies);
      }
    } catch (err) {
      console.error('Failed to load vacancies queue:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVacancies(filter);
  }, [filter]);

  const handleAction = async (id: string, title: string, status: 'PUBLISHED' | 'REJECTED') => {
    try {
      const res = await fetch(`/api/vacancies/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      const data = await res.json();
      if (data.success) {
        setVacancies(prev => prev.map(v => v.id === id ? { ...v, status } : v));
        setToastMessage(`"${title}" marked as ${status} in PostgreSQL!`);
        setTimeout(() => setToastMessage(null), 3500);
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (err) {
      console.error('Failed to update vacancy status:', err);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="pb-4 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Directorate Vacancy & Circular Moderation
          </h1>
          <p className="text-xs text-slate-400">
            Audit recruitment advertisements submitted by colleges before releasing them to the public portal.
          </p>
        </div>

        <button
          onClick={() => fetchVacancies(filter)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs font-semibold border border-slate-700 self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-blue-400' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {toastMessage && (
        <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs font-semibold flex items-center gap-2 shadow-lg">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 text-xs">
        <button
          onClick={() => setFilter('SUBMITTED')}
          className={`px-3 py-1.5 font-semibold rounded-lg transition-all ${
            filter === 'SUBMITTED'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800'
          }`}
        >
          Pending Review
        </button>
        <button
          onClick={() => setFilter('ALL')}
          className={`px-3 py-1.5 font-semibold rounded-lg transition-all ${
            filter === 'ALL'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800'
          }`}
        >
          All Vacancies in Database
        </button>
      </div>

      {/* Vacancy Queue List */}
      <div className="space-y-4">
        {loading ? (
          <div className="py-12 text-center text-slate-400 text-xs">
            Querying Aiven PostgreSQL...
          </div>
        ) : vacancies.length > 0 ? (
          vacancies.map((v) => (
            <div key={v.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800 text-[10px] font-bold">
                      {v.jobCategory}
                    </span>
                    <span className="text-xs text-slate-400 font-semibold">{v.college?.name}</span>
                  </div>
                  <h2 className="text-base font-bold text-white">{v.title}</h2>
                  <div className="text-xs text-slate-400">
                    Department: <strong className="text-slate-200">{v.department}</strong> • Posts: <strong className="text-slate-200">{v.numberOfPosts || 1}</strong> • Mode: <strong className="text-slate-200">{v.applicationMode}</strong>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded text-xs font-bold flex items-center gap-1 ${
                    v.status === 'PUBLISHED'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      : v.status === 'REJECTED'
                      ? 'bg-rose-950 text-rose-300 border border-rose-800'
                      : 'bg-amber-950 text-amber-300 border border-amber-800'
                  }`}>
                    {v.status === 'PUBLISHED' ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Clock className="w-3.5 h-3.5 text-amber-400" />}
                    {v.status}
                  </span>
                </div>
              </div>

              {/* Recruitment details summary */}
              <div className="p-3 bg-slate-950/70 rounded-lg border border-slate-800 text-xs space-y-1 text-slate-300">
                <div><strong className="text-slate-400">Eligibility / Qualification:</strong> {v.qualification}</div>
                <div><strong className="text-slate-400">Remuneration / Pay Scale:</strong> {v.salary || 'Per State Government Norms'}</div>
                <div><strong className="text-slate-400">Closing Date:</strong> {new Date(v.applicationCloseDate).toLocaleDateString()}</div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => handleAction(v.id, v.title, 'REJECTED')}
                  className="inline-flex items-center gap-1 px-3 py-1.5 border border-rose-800 text-rose-400 hover:bg-rose-950/50 rounded-lg text-xs font-semibold transition-colors"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Reject</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleAction(v.id, v.title, 'PUBLISHED')}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold shadow-md transition-colors"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Approve & Publish to Public (3000)</span>
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center space-y-3">
            <CheckSquare className="w-10 h-10 text-emerald-400 mx-auto" />
            <h3 className="text-base font-bold text-white">Review Queue Clear</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              All submitted vacancy circulars have been authorized. New submissions will appear here automatically.
            </p>
          </div>
        )}
      </div>

    </div>
  );
}
