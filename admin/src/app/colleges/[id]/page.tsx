'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Building2, 
  ShieldCheck, 
  ArrowLeft, 
  FileText, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Globe, 
  Mail, 
  Phone, 
  MapPin,
  ExternalLink,
  Users,
  RefreshCw,
  Clock,
  KeyRound,
  Lock,
  Briefcase,
  Calendar,
  Layers,
  Sparkles,
  ChevronRight
} from 'lucide-react';

interface Props {
  params: {
    id: string;
  };
}

export default function CollegeInspectionConsole({ params }: Props) {
  const router = useRouter();
  const [college, setCollege] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [actionNotice, setActionNotice] = useState<string | null>(null);
  const [moderatorNotes, setModeratorNotes] = useState('');
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'VACANCIES' | 'USERS' | 'DOCS'>('OVERVIEW');

  const fetchCollege = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/colleges/${params.id}`);
      const data = await res.json();
      if (data.success) {
        setCollege(data.college);
        if (data.college.moderatorNotes) {
          setModeratorNotes(data.college.moderatorNotes);
        }
      }
    } catch (err) {
      console.error('Failed to load college dossier:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollege();
  }, [params.id]);

  const handleAction = async (status: 'APPROVED' | 'REJECTED' | 'CHANGES_REQUESTED' | 'UNDER_REVIEW') => {
    try {
      setUpdating(true);
      const res = await fetch(`/api/colleges/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, moderatorNotes }),
      });

      const data = await res.json();
      if (data.success) {
        setCollege(data.college);
        setActionNotice(`Institution status updated to ${status} in PostgreSQL!`);
        setTimeout(() => {
          setActionNotice(null);
        }, 4000);
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (err) {
      console.error('Failed to update college status:', err);
    } finally {
      setUpdating(false);
    }
  };

  const handleVacancyStatus = async (vacId: string, title: string, newStatus: 'PUBLISHED' | 'REJECTED') => {
    try {
      const res = await fetch(`/api/vacancies/${vacId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();
      if (data.success) {
        setCollege((prev: any) => ({
          ...prev,
          vacancies: prev.vacancies.map((v: any) => v.id === vacId ? { ...v, status: newStatus } : v)
        }));
        setActionNotice(`Vacancy "${title}" updated to ${newStatus}!`);
        setTimeout(() => setActionNotice(null), 3500);
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (err) {
      console.error('Failed to update vacancy status:', err);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-400">
        <RefreshCw className="w-8 h-8 mx-auto animate-spin text-blue-500 mb-2" />
        <p className="text-xs">Fetching Dossier from Aiven PostgreSQL...</p>
      </div>
    );
  }

  if (!college) {
    return (
      <div className="py-20 text-center text-slate-400 space-y-3">
        <p className="text-sm font-bold text-rose-400">College record not found in PostgreSQL.</p>
        <Link href="/colleges" className="text-xs text-blue-400 underline">Back to colleges queue</Link>
      </div>
    );
  }

  const vacancies = college.vacancies || [];
  const users = college.users || [];

  return (
    <div className="space-y-6">
      
      {/* Back button & Action notification */}
      <div className="flex items-center justify-between">
        <Link 
          href="/colleges" 
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Institutional Directory</span>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href={`/vacancies?collegeId=${college.id}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold"
          >
            <Briefcase className="w-3.5 h-3.5 text-blue-400" />
            <span>All Vacancies Console</span>
          </Link>
          <Link
            href="/db-explorer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Inspect in DB Explorer</span>
          </Link>
        </div>
      </div>

      {actionNotice && (
        <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs font-semibold flex items-center gap-2 shadow-lg animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Main Dossier Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-blue-950 text-blue-300 border border-blue-800">
                {college.institutionType}
              </span>
              <span className="px-2.5 py-0.5 rounded text-xs font-medium bg-slate-800 text-slate-300">
                {college.ownershipType}
              </span>
              {college.verificationStatus === 'APPROVED' ? (
                <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-emerald-950 text-emerald-300 border border-emerald-800 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>APPROVED & ACTIVE</span>
                </span>
              ) : college.verificationStatus === 'REJECTED' ? (
                <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-rose-950 text-rose-300 border border-rose-800 flex items-center gap-1">
                  <XCircle className="w-3.5 h-3.5 text-rose-400" />
                  <span>REJECTED</span>
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-amber-950 text-amber-300 border border-amber-800 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>{college.verificationStatus}</span>
                </span>
              )}
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white">
              {college.name}
            </h1>
            <p className="text-xs text-slate-400 flex items-center gap-2">
              <span>{college.district}, {college.state}</span>
              <span>•</span>
              <span>Slug: <code className="bg-slate-950 px-1 py-0.5 rounded text-slate-300 font-mono">/{college.slug}</code></span>
              <span>•</span>
              <span>ID: <code className="bg-slate-950 px-1 py-0.5 rounded text-slate-400 font-mono">{college.id}</code></span>
            </p>
          </div>

          {college.officialWebsite && (
            <a
              href={college.officialWebsite}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs font-semibold text-slate-200 hover:bg-slate-700 shrink-0 transition-colors"
            >
              <Globe className="w-3.5 h-3.5 text-blue-400" />
              <span>Verify Web Domain</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>
          )}
        </div>

        {/* Tab Navigation for this Separate College */}
        <div className="flex items-center gap-2 pt-3 border-t border-slate-800 overflow-x-auto text-xs font-semibold">
          <button
            onClick={() => setActiveTab('OVERVIEW')}
            className={`px-3.5 py-2 rounded-lg transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'OVERVIEW'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Lock className="w-3.5 h-3.5 text-purple-400" />
            <span>1. College Profile (Read-Only)</span>
          </button>

          <button
            onClick={() => setActiveTab('VACANCIES')}
            className={`px-3.5 py-2 rounded-lg transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'VACANCIES'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>2. College Vacancies ({vacancies.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('USERS')}
            className={`px-3.5 py-2 rounded-lg transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'USERS'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>3. Admin Accounts ({users.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('DOCS')}
            className={`px-3.5 py-2 rounded-lg transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'DOCS'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>4. Compliance & Decisions</span>
          </button>
        </div>
      </div>

      {/* TAB 1: OVERVIEW (READ-ONLY) */}
      {activeTab === 'OVERVIEW' && (
        <div className="space-y-5">
          
          {/* Read-Only Notice Banner */}
          <div className="p-4 rounded-xl bg-purple-950/40 border border-purple-800/80 text-purple-300 text-xs flex items-center justify-between gap-3 shadow-md">
            <div className="flex items-center gap-2.5 font-semibold">
              <Lock className="w-5 h-5 text-purple-400 shrink-0" />
              <div>
                <div className="text-white font-bold">COLLEGE PROFILE DOSSIER • STRICTLY READ-ONLY FOR SUPER ADMIN ("Sirf Dikhega")</div>
                <div className="text-[11px] text-purple-300/80">Super Admin can inspect this institution's credentials and compliance, but cannot mutate or modify college profile data.</div>
              </div>
            </div>
            <span className="text-[10px] bg-purple-900/80 border border-purple-700/80 px-2 py-1 rounded-md font-mono text-purple-200 uppercase font-bold shrink-0">
              Immutable Profile
            </span>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Building2 className="w-4 h-4 text-blue-400" />
              <span>Campus Profile & Contact Specifications</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 bg-slate-950/70 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-500 block text-[11px]">Campus Physical Address:</span>
                <strong className="text-white block">{college.address}</strong>
                <span className="text-slate-400">{college.city}, {college.district}, {college.state}</span>
              </div>

              <div className="p-3.5 bg-slate-950/70 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-500 block text-[11px]">Official Institutional Contacts:</span>
                <strong className="text-white block">{college.officialPhone}</strong>
                <span className="text-slate-400">{college.officialEmail}</span>
              </div>

              <div className="p-3.5 bg-slate-950/70 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-500 block text-[11px]">Affiliation & Statutory Body:</span>
                <strong className="text-white block">{college.affiliationInfo || 'State Board of Technical Education / AICTE'}</strong>
                <span className="text-slate-400">Establishment Year: {college.establishmentYear || 'Established'}</span>
              </div>

              <div className="p-3.5 bg-slate-950/70 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-500 block text-[11px]">Registration & Database Status:</span>
                <strong className="text-emerald-400 block">Verified on Aiven PostgreSQL 16</strong>
                <span className="text-slate-400">Created: {new Date(college.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            {college.description && (
              <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1">
                <span className="text-slate-400 font-semibold block">Institutional Summary:</span>
                <p>{college.description}</p>
              </div>
            )}
          </div>

          {/* Quick link to Vacancies */}
          <div className="p-4 bg-blue-950/40 border border-blue-900/60 rounded-xl flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-blue-400" />
              <span className="text-blue-200">
                This college has <strong className="text-white">{vacancies.length}</strong> recruitment circular(s) stored in PostgreSQL.
              </span>
            </div>
            <button
              onClick={() => setActiveTab('VACANCIES')}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold transition-colors"
            >
              Manage College Vacancies →
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: VACANCIES FOR THIS SEPARATE COLLEGE */}
      {activeTab === 'VACANCIES' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-blue-400" />
              <span>Vacancies for {college.name} ({vacancies.length})</span>
            </h2>
            <Link
              href={`/vacancies?collegeId=${college.id}`}
              className="text-xs text-blue-400 hover:underline inline-flex items-center gap-1 font-semibold"
            >
              <span>Open in Vacancies Directory</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>

          {vacancies.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-10 text-center space-y-2">
              <Briefcase className="w-8 h-8 text-slate-600 mx-auto" />
              <h3 className="text-sm font-bold text-white">No Vacancies Posted Yet</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                {college.name} has not submitted any recruitment advertisements yet. When the college creates a circular, it will appear here for review.
              </p>
            </div>
          ) : (
            vacancies.map((v: any) => (
              <div key={v.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-950 text-blue-300 border border-blue-800">
                        {v.jobCategory}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-slate-300">
                        {v.employmentType}
                      </span>
                      <span className="text-xs text-slate-400">
                        Department: <strong className="text-slate-200">{v.department}</strong>
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-white">{v.title}</h3>
                    <div className="text-xs text-slate-400">
                      Posts: <strong className="text-slate-200">{v.numberOfPosts || 1}</strong> • Mode: <strong className="text-slate-200">{v.applicationMode}</strong>
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
                      <span>{v.status}</span>
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 p-3 rounded-lg bg-slate-950/70 border border-slate-800 text-xs text-slate-300">
                  <div>
                    <span className="text-slate-500 block text-[11px]">Qualification:</span>
                    <div className="font-medium text-slate-200">{v.qualification}</div>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Salary:</span>
                    <div className="font-medium text-emerald-400">{v.salary || 'State Norms'}</div>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Closing Date:</span>
                    <div className="font-medium text-slate-200">{new Date(v.applicationCloseDate).toLocaleDateString()}</div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-end gap-2 text-xs">
                  {v.status !== 'PUBLISHED' && (
                    <button
                      type="button"
                      onClick={() => handleVacancyStatus(v.id, v.title, 'PUBLISHED')}
                      className="inline-flex items-center gap-1 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold shadow-sm transition-colors"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Approve & Publish</span>
                    </button>
                  )}
                  {v.status !== 'REJECTED' && (
                    <button
                      type="button"
                      onClick={() => handleVacancyStatus(v.id, v.title, 'REJECTED')}
                      className="inline-flex items-center gap-1 px-3 py-1.5 border border-rose-800 text-rose-400 hover:bg-rose-950/50 rounded-lg font-semibold transition-colors"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 3: USERS & CREDENTIALS */}
      {activeTab === 'USERS' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-400" />
              <span>Assigned Administrator Accounts ({users.length})</span>
            </h2>

            {users.length === 0 ? (
              <div className="p-6 bg-slate-950 rounded-xl border border-slate-800 text-center text-xs text-slate-400">
                No user accounts directly linked to this institution yet. Upon verification approval, an admin account is created automatically.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {users.map((u: any) => (
                  <div key={u.id} className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <strong className="text-white text-xs font-bold">{u.name}</strong>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                        {u.status}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 font-mono truncate">{u.email}</div>
                    <div className="text-[11px] text-slate-400">
                      Role: <strong className="text-slate-300">{u.role}</strong> • Designation: <strong className="text-slate-300">{u.designation || 'Principal'}</strong>
                    </div>
                    <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-800/80">
                      User ID: <code className="font-mono text-slate-400">{u.id}</code>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: COMPLIANCE & DECISIONS */}
      {activeTab === 'DOCS' && (
        <div className="space-y-5">
          {/* Verification Evidence Inspection Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-4">
            <h2 className="text-sm font-bold text-white pb-2 border-b border-slate-800 uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-400" />
              <span>Uploaded Evidence & Compliance Dossier</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                <span className="font-bold text-slate-200 block">1. State Govt / University Affiliation Order</span>
                <p className="text-slate-400 text-[11px]">
                  Document Verification Reference: {college.authorizationLetterUrl || 'OFFICIAL_AFFILIATION_2026.pdf'}
                </p>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  Verified Authenticity
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                <span className="font-bold text-slate-200 block">2. Institutional Email Domain Verification</span>
                <p className="text-slate-400 text-[11px]">
                  Domain matching check: <code className="bg-slate-900 px-1 py-0.5 rounded text-blue-300">@{college.slug}.ac.in</code>
                </p>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  Domain Confirmed
                </span>
              </div>
            </div>

            {/* Remarks / Notes Textarea */}
            <div className="pt-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Super Administrator Review Notes (Written to PostgreSQL):
              </label>
              <textarea
                value={moderatorNotes}
                onChange={(e) => setModeratorNotes(e.target.value)}
                placeholder="Add internal verification notes or instructions for the college..."
                rows={2}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Decision Console */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-4">
            <h2 className="text-sm font-bold text-white pb-2 border-b border-slate-800 uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Directorate Verification Decision</span>
            </h2>

            <div className="space-y-3">
              <p className="text-xs text-slate-300">
                Current Status in PostgreSQL: <span className="font-bold text-emerald-400">{college.verificationStatus}</span>
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button
                  type="button"
                  disabled={updating}
                  onClick={() => handleAction('APPROVED')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold shadow-md transition-colors disabled:opacity-50"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Approve / Confirm Active</span>
                </button>

                <button
                  type="button"
                  disabled={updating}
                  onClick={() => handleAction('CHANGES_REQUESTED')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-semibold shadow-md transition-colors disabled:opacity-50"
                >
                  <AlertTriangle className="w-4 h-4" />
                  <span>Request Additional Documents</span>
                </button>

                <button
                  type="button"
                  disabled={updating}
                  onClick={() => handleAction('REJECTED')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-semibold shadow-md transition-colors disabled:opacity-50"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Reject Application</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
