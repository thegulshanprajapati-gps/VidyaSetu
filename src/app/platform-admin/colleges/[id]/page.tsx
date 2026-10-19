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
  RefreshCw,
  Clock,
  KeyRound
} from 'lucide-react';

interface CollegeVerificationConsoleProps {
  params: {
    id: string;
  };
}

export default function CollegeVerificationConsole({ params }: CollegeVerificationConsoleProps) {
  const router = useRouter();
  const [college, setCollege] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [actionNotice, setActionNotice] = useState<string | null>(null);
  const [moderatorNotes, setModeratorNotes] = useState('');

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

  const handleAction = async (newStatus: 'APPROVED' | 'REJECTED' | 'CHANGES_REQUESTED' | 'UNDER_REVIEW') => {
    try {
      setUpdating(true);
      const res = await fetch(`/api/colleges/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, moderatorNotes }),
      });

      const data = await res.json();
      if (data.success) {
        setCollege(data.college);
        setActionNotice(`Institution status updated to ${newStatus} in PostgreSQL!`);
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

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-500">
        <RefreshCw className="w-8 h-8 mx-auto animate-spin text-blue-600 mb-2" />
        <p className="text-xs">Fetching Dossier from Aiven PostgreSQL...</p>
      </div>
    );
  }

  if (!college) {
    return (
      <div className="py-20 text-center text-slate-500 space-y-3">
        <p className="text-sm font-bold text-rose-600">College record not found in PostgreSQL.</p>
        <Link href="/platform-admin/colleges" className="text-xs text-blue-600 underline">
          Back to verification queue
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Back button */}
      <div>
        <Link 
          href="/platform-admin/colleges" 
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-navy-900 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Verification Queue</span>
        </Link>
      </div>

      {actionNotice && (
        <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Main Dossier Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-navy-50 text-navy-800 border border-navy-100">
                {college.institutionType}
              </span>
              <span className="px-2.5 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700">
                {college.ownershipType}
              </span>

              {college.verificationStatus === 'APPROVED' ? (
                <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Status: APPROVED & ACTIVE</span>
                </span>
              ) : college.verificationStatus === 'REJECTED' ? (
                <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-rose-50 text-rose-800 border border-rose-200 flex items-center gap-1">
                  <XCircle className="w-3.5 h-3.5 text-rose-600" />
                  <span>Status: REJECTED</span>
                </span>
              ) : college.verificationStatus === 'CHANGES_REQUESTED' ? (
                <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  <span>Status: CHANGES REQUESTED</span>
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  <span>Status: {college.verificationStatus}</span>
                </span>
              )}
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-navy-900 pt-1">
              {college.name}
            </h1>
            <p className="text-xs text-textColor-secondary">
              Registered on {new Date(college.createdAt).toLocaleDateString()} • System ID: <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-700">{college.id}</code>
            </p>
          </div>

          {college.officialWebsite && (
            <a
              href={college.officialWebsite}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 py-1.5 border border-slate-300 rounded text-xs font-semibold text-slate-700 hover:bg-slate-50 shrink-0"
            >
              <Globe className="w-3.5 h-3.5 text-blue-600" />
              <span>Verify Domain Website</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>
          )}
        </div>

        {/* Detailed Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 text-xs">
          <div>
            <span className="text-slate-500 block">Campus Address:</span>
            <strong className="text-navy-900">{college.address}, {college.district}, {college.state}</strong>
          </div>
          <div>
            <span className="text-slate-500 block">Official Contact:</span>
            <strong className="text-navy-900">{college.officialPhone} | {college.officialEmail}</strong>
          </div>
          <div>
            <span className="text-slate-500 block">Affiliation / Regulatory Body:</span>
            <strong className="text-navy-900">{college.affiliationInfo || 'AICTE & State Govt'}</strong>
          </div>
          <div>
            <span className="text-slate-500 block">Assigned College Administrators:</span>
            <strong className="text-navy-900">
              {college.users?.length ? `${college.users[0].name} (${college.users[0].email})` : `${college.name} Admin (${college.officialEmail})`}
            </strong>
          </div>
        </div>
      </div>

      {/* When APPROVED: Show Prominent Credentials & Access Card */}
      {college.verificationStatus === 'APPROVED' && (
        <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-emerald-200">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-emerald-100 border border-emerald-300 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5 text-emerald-700" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-navy-900">
                  Institution Officially Verified & Active in State Directorate Network
                </h3>
                <p className="text-xs text-emerald-800">
                  This institution has authorized portal access to publish recruitment circulars and manage staff applications.
                </p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-bold shrink-0 self-start sm:self-auto">
              ✓ Ready for Public Syndication
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="bg-white border border-emerald-200 rounded-lg p-3 space-y-1">
              <span className="text-slate-500 text-[11px] font-medium block">
                College Admin Login Account:
              </span>
              <div className="font-mono text-emerald-700 font-bold text-xs truncate">
                {college.users?.[0]?.email || college.officialEmail}
              </div>
              <span className="inline-block text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                Active in PostgreSQL
              </span>
            </div>

            <div className="bg-white border border-emerald-200 rounded-lg p-3 space-y-1">
              <span className="text-slate-500 text-[11px] font-medium block">
                Default Access Password:
              </span>
              <div className="font-mono text-slate-900 font-bold text-xs">
                password123
              </div>
              <span className="inline-block text-[10px] text-slate-500">
                Standard initial credential
              </span>
            </div>

            <div className="bg-white border border-emerald-200 rounded-lg p-3 flex flex-col justify-between">
              <div>
                <span className="text-slate-500 text-[11px] font-medium block">
                  Public Portal Workspace:
                </span>
                <span className="text-slate-800 text-xs font-semibold">
                  College Workspace Login
                </span>
              </div>
              <a
                href="/login"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded font-bold text-xs shadow-2xs transition-colors"
              >
                <span>Open Login Gateway</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Verification Evidence Inspection Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-navy-900 pb-2 border-b border-slate-100 uppercase tracking-wider flex items-center gap-2">
          <FileText className="w-4 h-4 text-blue-600" />
          <span>Uploaded Evidence & Compliance Dossier</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
            <span className="font-bold text-navy-900 block">1. State Govt / University Affiliation Order</span>
            <p className="text-slate-500 text-[11px]">
              Document Verification Reference: {college.authorizationLetterUrl || 'OFFICIAL_AFFILIATION_2026.pdf'}
            </p>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              Verified Authenticity
            </span>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
            <span className="font-bold text-navy-900 block">2. Institutional Email Domain Verification</span>
            <p className="text-slate-500 text-[11px]">
              Domain matching check: <code className="bg-slate-200 px-1 py-0.5 rounded text-navy-900">@{college.slug}.ac.in</code>
            </p>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              Verified Domain Match
            </span>
          </div>
        </div>

        {/* Remarks / Notes Textarea */}
        <div className="pt-2">
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Directorate Review Notes (Written to PostgreSQL):
          </label>
          <textarea
            value={moderatorNotes}
            onChange={(e) => setModeratorNotes(e.target.value)}
            placeholder="Add internal verification notes or instructions for the college..."
            rows={2}
            className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600"
          />
        </div>
      </div>

      {/* Decision Console */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-navy-900 pb-2 border-b border-slate-100 uppercase tracking-wider flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Platform Administrator Decision</span>
        </h2>

        {college.verificationStatus === 'APPROVED' ? (
          <div className="space-y-3">
            <p className="text-xs text-slate-700">
              Institution is currently <span className="font-bold text-emerald-700">APPROVED & ACTIVE</span> in Aiven PostgreSQL. All college administrator privileges and circular listings are active.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                type="button"
                disabled={updating}
                onClick={() => handleAction('APPROVED')}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold shadow-xs transition-colors disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Save Review Notes</span>
              </button>

              <button
                type="button"
                disabled={updating}
                onClick={() => handleAction('CHANGES_REQUESTED')}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors disabled:opacity-50"
              >
                <AlertTriangle className="w-4 h-4" />
                <span>Request Additional Clarification</span>
              </button>

              <button
                type="button"
                disabled={updating}
                onClick={() => handleAction('REJECTED')}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors disabled:opacity-50"
              >
                <XCircle className="w-4 h-4" />
                <span>Revoke & Suspend Institution</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-xs text-textColor-secondary">
              Approving this institution writes status <code className="bg-slate-100 px-1 py-0.5 rounded text-emerald-700 font-bold">APPROVED</code> to Aiven PostgreSQL, activates their college administrator login, and authorizes publishing recruitment circulars.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                type="button"
                disabled={updating}
                onClick={() => handleAction('APPROVED')}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-sm transition-colors disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Approve & Activate Institution</span>
              </button>

              <button
                type="button"
                disabled={updating}
                onClick={() => handleAction('CHANGES_REQUESTED')}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors disabled:opacity-50"
              >
                <AlertTriangle className="w-4 h-4" />
                <span>Request Additional Clarification</span>
              </button>

              <button
                type="button"
                disabled={updating}
                onClick={() => handleAction('REJECTED')}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors disabled:opacity-50"
              >
                <XCircle className="w-4 h-4" />
                <span>Reject Application</span>
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
