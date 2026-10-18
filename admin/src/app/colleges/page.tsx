'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Building2, 
  ShieldCheck, 
  Clock, 
  AlertTriangle, 
  Eye, 
  CheckCircle2, 
  XCircle,
  RefreshCw,
  Search,
  Briefcase,
  Users,
  ExternalLink,
  MapPin,
  Mail,
  Phone,
  LayoutGrid,
  Table as TableIcon,
  ArrowRight
} from 'lucide-react';

export default function AdminCollegesPage() {
  const [filter, setFilter] = useState<string>('ALL');
  const [colleges, setColleges] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'CARDS' | 'TABLE'>('CARDS');

  const fetchColleges = async (status: string) => {
    try {
      setLoading(true);
      const url = status === 'ALL' ? '/api/colleges' : `/api/colleges?status=${status}`;
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

  const displayedColleges = colleges.filter((col) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      col.name.toLowerCase().includes(term) || 
      col.district.toLowerCase().includes(term) ||
      col.slug.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="pb-4 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-900/60 text-blue-400 border border-blue-700/50">
              SEPARATE INSTITUTIONAL DESKS
            </span>
            <span className="text-xs text-slate-400">Bihar Higher Education Directorate</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight pt-1">
            Institutional Directory & College Hubs
          </h1>
          <p className="text-xs text-slate-400">
            Each Bihar college is managed separately with dedicated credentials, vacancy listings, and compliance audits.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => fetchColleges(filter)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs font-semibold border border-slate-700 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-blue-400' : ''}`} />
            <span>Refresh</span>
          </button>
          
          <Link
            href="/vacancies"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-bold shadow-md transition-colors"
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>All Vacancies View</span>
          </Link>
        </div>
      </div>

      {/* Filter Tabs, Search & View Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {[
            { label: 'All Registered', value: 'ALL' },
            { label: 'Approved & Active', value: 'APPROVED' },
            { label: 'Pending Review', value: 'PENDING' },
            { label: 'Under Review', value: 'UNDER_REVIEW' },
            { label: 'Rejected', value: 'REJECTED' },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value)}
              className={`px-3 py-1.5 font-semibold rounded-lg transition-all shrink-0 ${
                filter === tab.value
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2.5">
          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search college, district, slug..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 shrink-0">
            <button
              onClick={() => setViewMode('CARDS')}
              title="Separate College Hubs View"
              className={`p-1.5 rounded text-xs font-semibold flex items-center gap-1 transition-all ${
                viewMode === 'CARDS'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              <span className="hidden sm:inline text-[11px]">Separate Hubs</span>
            </button>
            <button
              onClick={() => setViewMode('TABLE')}
              title="Compact Table View"
              className={`p-1.5 rounded text-xs font-semibold flex items-center gap-1 transition-all ${
                viewMode === 'TABLE'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <TableIcon className="w-4 h-4" />
              <span className="hidden sm:inline text-[11px]">Table View</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Data Presentation */}
      {loading ? (
        <div className="py-16 text-center text-slate-400 text-xs space-y-2">
          <RefreshCw className="w-8 h-8 mx-auto animate-spin text-blue-500" />
          <p>Querying Aiven PostgreSQL for institutional records...</p>
        </div>
      ) : displayedColleges.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center space-y-3">
          <Building2 className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-white">No Colleges Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            No institutional records match the selected filter.
          </p>
        </div>
      ) : viewMode === 'CARDS' ? (
        /* SEPARATE COLLEGE CARDS / WORKSPACE HUBS */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {displayedColleges.map((col) => (
            <div 
              key={col.id} 
              className="bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-5 shadow-xl transition-all space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                
                {/* College Title & Status */}
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-950 text-blue-300 border border-blue-800">
                        {col.institutionType}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-slate-300">
                        {col.ownershipType}
                      </span>
                    </div>
                    <h2 className="text-base font-bold text-white leading-snug">
                      {col.name}
                    </h2>
                    <div className="flex items-center gap-1 text-xs text-slate-400">
                      <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span>{col.district}, Bihar</span>
                      <span className="text-slate-600">•</span>
                      <span className="font-mono text-[11px] text-slate-400">/{col.slug}</span>
                    </div>
                  </div>

                  <div>
                    {col.verificationStatus === 'APPROVED' ? (
                      <span className="px-2.5 py-1 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[11px] font-bold inline-flex items-center gap-1 shrink-0 shadow-xs">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                        Approved
                      </span>
                    ) : col.verificationStatus === 'REJECTED' ? (
                      <span className="px-2.5 py-1 rounded bg-rose-950 text-rose-300 border border-rose-800 text-[11px] font-bold inline-flex items-center gap-1 shrink-0 shadow-xs">
                        <XCircle className="w-3.5 h-3.5 text-rose-400" />
                        Rejected
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded bg-amber-950 text-amber-300 border border-amber-800 text-[11px] font-bold inline-flex items-center gap-1 shrink-0 shadow-xs">
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        {col.verificationStatus}
                      </span>
                    )}
                  </div>
                </div>

                {/* Separate Metrics & Details Grid */}
                <div className="grid grid-cols-2 gap-2.5 pt-2 text-xs">
                  
                  {/* Vacancy Metric Card for this college */}
                  <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800/80 space-y-1">
                    <span className="text-[11px] text-slate-400 font-semibold flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5 text-blue-400" />
                      <span>College Vacancies:</span>
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-black text-white">
                        {col._count ? col._count.vacancies : 0}
                      </span>
                      <span className="text-[10px] text-slate-400">Total Posted</span>
                    </div>
                    <Link
                      href={`/vacancies?collegeId=${col.id}`}
                      className="inline-flex items-center gap-1 text-[11px] text-blue-400 hover:text-blue-300 font-semibold pt-0.5"
                    >
                      <span>Filter This College's Vacancies</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>

                  {/* Admin Account Metric Card */}
                  <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800/80 space-y-1">
                    <span className="text-[11px] text-slate-400 font-semibold flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Admin Accounts:</span>
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-black text-white">
                        {col._count ? col._count.users : 0}
                      </span>
                      <span className="text-[10px] text-emerald-400 font-medium">Linked Credentials</span>
                    </div>
                    <div className="text-[10px] text-slate-400 truncate">
                      {col.officialEmail}
                    </div>
                  </div>

                </div>

                {/* Contact information summary */}
                <div className="pt-2 text-xs text-slate-400 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-slate-800/60">
                  <div className="flex items-center gap-1.5 truncate">
                    <Mail className="w-3 h-3 text-slate-500" />
                    <span className="truncate">{col.officialEmail}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3 h-3 text-slate-500" />
                    <span>{col.officialPhone}</span>
                  </div>
                </div>

              </div>

              {/* Action Buttons for this Separate College */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                <Link
                  href={`/vacancies?collegeId=${col.id}`}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs font-semibold border border-slate-700 transition-colors inline-flex items-center gap-1"
                >
                  <Briefcase className="w-3.5 h-3.5 text-blue-400" />
                  <span>Vacancies ({col._count ? col._count.vacancies : 0})</span>
                </Link>

                <Link
                  href={`/colleges/${col.id}`}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold shadow-md transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Open College Dossier</span>
                </Link>
              </div>

            </div>
          ))}
        </div>
      ) : (
        /* COMPACT TABLE VIEW */
        <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-950/80 text-slate-400 border-b border-slate-800 uppercase tracking-wider text-[11px]">
                  <th className="p-3.5 font-semibold">College & Campus</th>
                  <th className="p-3.5 font-semibold">Category</th>
                  <th className="p-3.5 font-semibold">Status in DB</th>
                  <th className="p-3.5 font-semibold">Vacancies</th>
                  <th className="p-3.5 font-semibold text-right">Super Admin Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {displayedColleges.map((col) => (
                  <tr key={col.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-3.5">
                      <div className="font-bold text-white">{col.name}</div>
                      <div className="text-[11px] text-slate-400">{col.district}, {col.state}</div>
                    </td>
                    <td className="p-3.5">
                      <div className="font-medium text-slate-300">{col.institutionType}</div>
                      <div className="text-[11px] text-slate-500">{col.ownershipType}</div>
                    </td>
                    <td className="p-3.5">
                      {col.verificationStatus === 'APPROVED' ? (
                        <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[11px] font-bold inline-flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                          Approved
                        </span>
                      ) : col.verificationStatus === 'REJECTED' ? (
                        <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800 text-[11px] font-bold inline-flex items-center gap-1">
                          <XCircle className="w-3.5 h-3.5 text-rose-400" />
                          Rejected
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 text-[11px] font-bold inline-flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-amber-400" />
                          {col.verificationStatus}
                        </span>
                      )}
                    </td>
                    <td className="p-3.5 text-slate-300 font-medium">
                      <Link 
                        href={`/vacancies?collegeId=${col.id}`}
                        className="text-blue-400 hover:underline font-semibold"
                      >
                        {col._count ? col._count.vacancies : 0} posts
                      </Link>
                    </td>
                    <td className="p-3.5 text-right space-x-2">
                      <Link
                        href={`/vacancies?collegeId=${col.id}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs font-semibold transition-colors"
                      >
                        <Briefcase className="w-3 h-3 text-blue-400" />
                        <span>Vacancies</span>
                      </Link>
                      <Link
                        href={`/colleges/${col.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-semibold shadow-sm transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect Dossier</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
