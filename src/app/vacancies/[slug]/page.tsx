import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getLiveVacancyBySlug } from '@/lib/db/service';
import { 
  Building2, 
  MapPin, 
  Calendar, 
  Briefcase, 
  FileText, 
  ExternalLink, 
  Clock, 
  ShieldCheck, 
  AlertTriangle, 
  ArrowLeft,
  CheckCircle2,
  Share2
} from 'lucide-react';

export const revalidate = 0;

interface VacancyDetailsPageProps {
  params: {
    slug: string;
  };
}

export default async function VacancyDetailsPage({ params }: VacancyDetailsPageProps) {
  const data = await getLiveVacancyBySlug(params.slug);

  if (!data || !data.vacancy) {
    notFound();
  }

  const { vacancy, college, relatedVacancies } = data;

  const closeDate = new Date(vacancy.applicationCloseDate);
  const now = new Date();
  const diffDays = Math.ceil((closeDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));


  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Breadcrumb / Back button */}
      <div>
        <Link 
          href="/vacancies" 
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-navy-900 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Vacancies</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Content (Left 2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Header Card */}
          <div className="bg-white border border-surface-border rounded-lg p-6 space-y-4">
            
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 text-xs font-bold rounded bg-navy-50 text-navy-800 border border-navy-100">
                {vacancy.jobCategory}
              </span>
              <span className="px-2.5 py-0.5 text-xs font-medium rounded bg-slate-100 text-slate-700">
                {vacancy.employmentType.replace('_', ' ')}
              </span>
              {vacancy.numberOfPosts && (
                <span className="px-2.5 py-0.5 text-xs font-bold rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                  {vacancy.numberOfPosts} {vacancy.numberOfPosts === 1 ? 'Post' : 'Posts'}
                </span>
              )}
              <span className="px-2.5 py-0.5 text-xs font-semibold rounded bg-blue-50 text-blue-800 border border-blue-200">
                Mode: {vacancy.applicationMode}
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-navy-900 leading-tight">
              {vacancy.title}
            </h1>

            {/* Institution Badge Bar */}
            <div className="flex flex-wrap items-center gap-4 text-xs pt-2 border-t border-slate-100">
              <Link 
                href={`/colleges/${vacancy.collegeSlug}`}
                className="flex items-center gap-1.5 font-bold text-navy-900 hover:text-blue-600"
              >
                <Building2 className="w-4 h-4 text-blue-600" />
                <span>{vacancy.collegeName}</span>
                <span title="Verified College">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                </span>
              </Link>
              <div className="flex items-center gap-1 text-slate-600">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{vacancy.district}, {vacancy.state}</span>
              </div>
            </div>

          </div>

          {/* Structured Parameters Table */}
          <div className="bg-white border border-surface-border rounded-lg overflow-hidden">
            <div className="px-6 py-3 bg-slate-50 border-b border-surface-border font-bold text-xs uppercase tracking-wider text-navy-900">
              Key Recruitment Parameters
            </div>
            <div className="divide-y divide-slate-100 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 p-4 gap-2">
                <span className="font-semibold text-slate-500">Post Name & Department</span>
                <span className="sm:col-span-2 font-bold text-navy-900">
                  {vacancy.postName} ({vacancy.department})
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 p-4 gap-2">
                <span className="font-semibold text-slate-500">Essential Qualification</span>
                <span className="sm:col-span-2 text-slate-800 font-medium">
                  {vacancy.qualification}
                </span>
              </div>
              {vacancy.experience && (
                <div className="grid grid-cols-1 sm:grid-cols-3 p-4 gap-2">
                  <span className="font-semibold text-slate-500">Experience Requirement</span>
                  <span className="sm:col-span-2 text-slate-800">
                    {vacancy.experience}
                  </span>
                </div>
              )}
              {vacancy.ageCriteria && (
                <div className="grid grid-cols-1 sm:grid-cols-3 p-4 gap-2">
                  <span className="font-semibold text-slate-500">Age Criteria</span>
                  <span className="sm:col-span-2 text-slate-800">
                    {vacancy.ageCriteria}
                  </span>
                </div>
              )}
              {vacancy.salary && (
                <div className="grid grid-cols-1 sm:grid-cols-3 p-4 gap-2">
                  <span className="font-semibold text-slate-500">Salary / Pay Scale</span>
                  <span className="sm:col-span-2 font-bold text-emerald-700">
                    {vacancy.salary}
                  </span>
                </div>
              )}
              {vacancy.applicationFee && (
                <div className="grid grid-cols-1 sm:grid-cols-3 p-4 gap-2">
                  <span className="font-semibold text-slate-500">Application Fee</span>
                  <span className="sm:col-span-2 text-slate-800">
                    {vacancy.applicationFee}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Detailed Recruitment Description (Rich HTML) */}
          <div className="bg-white border border-surface-border rounded-lg p-6 space-y-4">
            <h2 className="text-base font-bold text-navy-900 pb-2 border-b border-slate-100">
              Detailed Notification & Instructions
            </h2>
            <div 
              className="prose prose-sm max-w-none text-slate-800 text-xs sm:text-sm leading-relaxed"
              dangerouslySetInnerHTML={{ __html: vacancy.descriptionHtml }}
            />
          </div>

          {/* Statutory Disclaimer & Report Box */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-xs text-amber-900 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold">Authenticity Advisory:</p>
              <p>
                Candidates must verify the vacancy details against the official signed notification PDF before paying any application fee or submitting original documents.
              </p>
            </div>
          </div>

        </div>

        {/* Right Sidebar: Important Dates & Direct Actions */}
        <div className="space-y-6">
          
          {/* Action Box */}
          <div className="bg-white border border-surface-border rounded-lg p-6 space-y-5 shadow-xs sticky top-24">
            <h3 className="text-sm font-bold uppercase tracking-wider text-navy-900 pb-2 border-b border-slate-100">
              Official Actions
            </h3>

            {/* Closing countdown */}
            <div className="p-3 rounded-lg bg-blue-50 border border-blue-100 text-xs text-blue-900 space-y-1">
              <div className="flex items-center gap-1 font-bold">
                <Clock className="w-4 h-4 text-blue-600" />
                <span>
                  {diffDays > 0 ? `Closing in ${diffDays} Days` : 'Application Window Closed'}
                </span>
              </div>
              <p className="text-[11px] text-blue-700">
                Deadline: {new Date(vacancy.applicationCloseDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}
              </p>
            </div>

            {/* Action buttons */}
            <div className="space-y-2.5">
              {vacancy.officialApplyUrl && (
                <a
                  href={vacancy.officialApplyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 bg-navy-500 hover:bg-blue-600 text-white text-xs font-bold rounded-lg shadow-xs flex items-center justify-center gap-2 transition-colors"
                >
                  <span>Apply on Official Website</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}

              {vacancy.notificationPdfUrl && (
                <a
                  href={vacancy.notificationPdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 bg-white border border-slate-300 hover:bg-slate-50 text-navy-900 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  <FileText className="w-4 h-4 text-rose-600" />
                  <span>Download Official PDF Circular</span>
                </a>
              )}
            </div>

            {/* Important Dates Timeline */}
            <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
              <h4 className="font-bold text-navy-900">Important Dates:</h4>
              <div className="space-y-1.5 text-slate-600 text-[11px]">
                <div className="flex justify-between">
                  <span>Notification Date:</span>
                  <span className="font-semibold text-slate-800">{vacancy.notificationDate}</span>
                </div>
                <div className="flex justify-between">
                  <span>Opening Date:</span>
                  <span className="font-semibold text-slate-800">{vacancy.applicationOpenDate}</span>
                </div>
                <div className="flex justify-between text-rose-700 font-bold">
                  <span>Last Date:</span>
                  <span>{vacancy.applicationCloseDate}</span>
                </div>
                {vacancy.interviewDate && (
                  <div className="flex justify-between text-blue-700 font-bold">
                    <span>Interview Date:</span>
                    <span>{vacancy.interviewDate}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Institution Profile Snippet */}
            {college && (
              <div className="pt-4 border-t border-slate-100 space-y-2">
                <h4 className="font-bold text-xs text-navy-900">Hiring Institution:</h4>
                <div className="text-xs space-y-1">
                  <div className="font-semibold text-navy-900">{college.name}</div>
                  <div className="text-slate-500 text-[11px]">{college.address}</div>
                  {college.officialWebsite && (
                    <a
                      href={college.officialWebsite}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-[11px] inline-flex items-center gap-1 mt-1 font-medium"
                    >
                      <span>Visit College Website</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            )}

          </div>

          {/* Related Vacancies */}
          {relatedVacancies.length > 0 && (
            <div className="bg-white border border-surface-border rounded-lg p-5 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-navy-900 pb-2 border-b border-slate-100">
                Related Vacancies
              </h3>
              <div className="space-y-3">
                {relatedVacancies.map((rel) => (
                  <Link
                    key={rel.id}
                    href={`/vacancies/${rel.slug}`}
                    className="block p-2 rounded hover:bg-slate-50 transition-colors group"
                  >
                    <div className="text-xs font-bold text-navy-900 group-hover:text-blue-600 line-clamp-1">
                      {rel.title}
                    </div>
                    <div className="text-[11px] text-textColor-secondary">
                      {rel.collegeName} • {rel.district}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
