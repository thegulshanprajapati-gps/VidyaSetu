'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Building2, 
  Clock, 
  ShieldCheck, 
  Briefcase, 
  Activity, 
  Database,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  ExternalLink,
  FolderTree,
  Layers
} from 'lucide-react';

interface Stats {
  totalColleges: number;
  pendingColleges: number;
  approvedColleges: number;
  totalVacancies: number;
  pendingVacancies: number;
  totalUsers: number;
}

export default function SuperAdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [pendingColleges, setPendingColleges] = useState<any[]>([]);
  const [pendingVacancies, setPendingVacancies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      setRefreshing(true);
      const [statsRes, collegesRes, vacanciesRes] = await Promise.all([
        fetch('/api/stats'),
        fetch('/api/colleges?status=PENDING'),
        fetch('/api/vacancies?status=SUBMITTED'),
      ]);

      const statsData = await statsRes.json();
      const collegesData = await collegesRes.json();
      const vacanciesData = await vacanciesRes.json();

      if (statsData.success) setStats(statsData.stats);
      if (collegesData.success) setPendingColleges(collegesData.colleges);
      if (vacanciesData.success) setPendingVacancies(vacanciesData.vacancies);
    } catch (err) {
      console.error('Failed to load admin overview data:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-900/60 text-blue-400 border border-blue-700/50">
              PORT 3001 STANDALONE ADMIN
            </span>
            <span className="text-xs text-slate-400">Bihar Higher Education Directorate</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight pt-1">
            State Governance & Supervision Desk
          </h1>
          <p className="text-xs text-slate-400">
            Real-time multi-tenant supervision connected directly to Aiven PostgreSQL.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/db-explorer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-bold shadow-md transition-colors"
          >
            <FolderTree className="w-3.5 h-3.5" />
            <span>Realtime DB Explorer</span>
          </Link>

          <Link
            href="/vacancies"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-bold shadow-md transition-colors"
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Vacancies Console</span>
          </Link>

          <button
            onClick={loadData}
            disabled={refreshing}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs font-semibold border border-slate-700 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-blue-400' : ''}`} />
            <span>Sync DB</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <Link 
          href="/colleges?status=PENDING" 
          className="bg-slate-900/90 hover:bg-slate-900 p-5 rounded-2xl border border-slate-800 hover:border-amber-600/50 shadow-xl space-y-2 transition-all block group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-400" />
              Pending Institutions
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-800">
              Needs Review
            </span>
          </div>
          <div className="text-3xl sm:text-4xl font-black text-amber-400 pt-1">
            {stats ? stats.pendingColleges : '...'}
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
            <span>Require credential verification</span>
            <ArrowRight className="w-3 h-3 text-slate-600 group-hover:text-amber-400 transition-colors" />
          </div>
        </Link>

        <Link 
          href="/colleges" 
          className="bg-slate-900/90 hover:bg-slate-900 p-5 rounded-2xl border border-slate-800 hover:border-emerald-600/50 shadow-xl space-y-2 transition-all block group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Verified Colleges
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
              Active
            </span>
          </div>
          <div className="text-3xl sm:text-4xl font-black text-emerald-400 pt-1">
            {stats ? stats.approvedColleges : '...'}
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
            <span>Separate college hubs</span>
            <ArrowRight className="w-3 h-3 text-slate-600 group-hover:text-emerald-400 transition-colors" />
          </div>
        </Link>

        <Link 
          href="/vacancies" 
          className="bg-slate-900/90 hover:bg-slate-900 p-5 rounded-2xl border border-slate-800 hover:border-blue-600/50 shadow-xl space-y-2 transition-all block group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-blue-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Briefcase className="w-4 h-4 text-blue-400" />
              Recruitment Posts
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-950 text-blue-300 border border-blue-800">
              Vacancy-wise
            </span>
          </div>
          <div className="text-3xl sm:text-4xl font-black text-blue-400 pt-1">
            {stats ? stats.totalVacancies : '...'}
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
            <span>Grouped by college & category</span>
            <ArrowRight className="w-3 h-3 text-slate-600 group-hover:text-blue-400 transition-colors" />
          </div>
        </Link>

        <Link 
          href="/db-explorer" 
          className="bg-slate-900/90 hover:bg-slate-900 p-5 rounded-2xl border border-slate-800 hover:border-purple-600/50 shadow-xl space-y-2 transition-all block group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-purple-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Database className="w-4 h-4 text-purple-400" />
              Database Engine
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-800">
              Tree Explorer
            </span>
          </div>
          <div className="text-base font-bold text-emerald-400 pt-2 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            PostgreSQL 16 Live
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
            <span>Folder explorer view ("Sirf dikhega")</span>
            <ArrowRight className="w-3 h-3 text-slate-600 group-hover:text-purple-400 transition-colors" />
          </div>
        </Link>

      </div>


      {/* Main Grid: Pending Action Queues */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Pending College Approvals Queue */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Building2 className="w-4 h-4 text-amber-400" />
              <span>Pending College Verifications ({pendingColleges.length})</span>
            </h2>
            <Link
              href="/colleges"
              className="text-xs font-semibold text-blue-400 hover:text-blue-300 inline-flex items-center gap-1"
            >
              <span>Full Queue</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-3">
            {loading ? (
              <div className="text-center py-6 text-slate-400 text-xs">Querying Aiven PostgreSQL...</div>
            ) : pendingColleges.length > 0 ? (
              pendingColleges.slice(0, 4).map((col) => (
                <div key={col.id} className="p-3.5 bg-slate-950/70 border border-slate-800/80 rounded-lg space-y-2 hover:border-slate-700 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-200">{col.name}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-800">
                      {col.verificationStatus}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {col.district}, Bihar • {col.institutionType} • {col.ownershipType}
                  </div>
                  <div className="pt-2 flex items-center justify-end">
                    <Link
                      href={`/colleges/${col.id}`}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-semibold transition-colors"
                    >
                      Inspect Evidence & Decide
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-slate-400 text-xs">
                No pending colleges in verification queue.
              </div>
            )}
          </div>
        </div>

        {/* Content Moderation Queue */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-blue-400" />
              <span>Vacancy Moderation Queue ({pendingVacancies.length})</span>
            </h2>
            <Link
              href="/reviews"
              className="text-xs font-semibold text-blue-400 hover:text-blue-300 inline-flex items-center gap-1"
            >
              <span>Review All</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-3">
            {loading ? (
              <div className="text-center py-6 text-slate-400 text-xs">Querying Aiven PostgreSQL...</div>
            ) : pendingVacancies.length > 0 ? (
              pendingVacancies.slice(0, 4).map((v) => (
                <div key={v.id} className="p-3.5 bg-slate-950/70 border border-slate-800/80 rounded-lg space-y-2 hover:border-slate-700 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-200">{v.title}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-950 text-blue-300 border border-blue-800">
                      {v.status}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {v.college?.name} • {v.jobCategory} • Department: {v.department}
                  </div>
                  <div className="pt-2 flex items-center justify-end">
                    <Link
                      href="/reviews"
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-semibold transition-colors"
                    >
                      Authorize Post
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-slate-400 text-xs">
                No vacancy submissions waiting for review.
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
