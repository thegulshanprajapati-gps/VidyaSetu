import React from 'react';
import Link from 'next/link';
import { Vacancy } from '@/lib/types';
import { Building2, Calendar, MapPin, Briefcase, FileText, ExternalLink, Clock, ChevronRight } from 'lucide-react';

interface VacancyCardProps {
  vacancy: Vacancy;
}

export default function VacancyCard({ vacancy }: VacancyCardProps) {
  const closeDate = new Date(vacancy.applicationCloseDate);
  const now = new Date();
  const diffDays = Math.ceil((closeDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  const isClosingSoon = diffDays >= 0 && diffDays <= 7;
  const isClosed = diffDays < 0;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:border-blue-500/50 hover:shadow-lg dark:hover:shadow-blue-500/5 transition-all relative group">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        
        {/* Main Details */}
        <div className="space-y-2.5 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-lg bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              {vacancy.jobCategory}
            </span>
            <span className="px-2.5 py-0.5 text-[11px] font-medium rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              {vacancy.employmentType.replace('_', ' ')}
            </span>
            {vacancy.numberOfPosts && (
              <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-lg bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                {vacancy.numberOfPosts} {vacancy.numberOfPosts === 1 ? 'Post' : 'Posts'}
              </span>
            )}
            {isClosingSoon && (
              <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-lg bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 flex items-center gap-1">
                <Clock className="w-3 h-3 text-amber-500" />
                Closing in {diffDays} {diffDays === 1 ? 'day' : 'days'}
              </span>
            )}
          </div>

          <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            <Link href={`/vacancies/${vacancy.slug}`}>
              {vacancy.title}
            </Link>
          </h3>

          <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-500 dark:text-slate-400">
            <Link 
              href={`/colleges/${vacancy.collegeSlug}`}
              className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-semibold"
            >
              <Building2 className="w-3.5 h-3.5 text-blue-500" />
              <span>{vacancy.collegeName}</span>
            </Link>
            
            <div className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>{vacancy.district}, {vacancy.state}</span>
            </div>

            {vacancy.salary && (
              <div className="flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400">
                <Briefcase className="w-3.5 h-3.5 text-emerald-500" />
                <span>{vacancy.salary}</span>
              </div>
            )}
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 pt-1">
            <strong className="text-slate-800 dark:text-slate-200">Eligibility:</strong> {vacancy.qualification}
          </p>
        </div>

        {/* Date & Actions Side */}
        <div className="sm:text-right flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100 dark:border-slate-800 gap-3 min-w-[160px]">
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
              Last Date to Apply
            </div>
            <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center sm:justify-end gap-1.5 pt-0.5">
              <Calendar className="w-3.5 h-3.5 text-blue-500" />
              <span>{new Date(vacancy.applicationCloseDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {vacancy.notificationPdfUrl && (
              <a 
                href={vacancy.notificationPdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-800 transition-colors"
                title="Download Official Notification PDF"
              >
                <FileText className="w-4 h-4" />
              </a>
            )}
            <Link
              href={`/vacancies/${vacancy.slug}`}
              className="px-4 py-2 text-xs font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center gap-1 active:scale-98"
            >
              <span>View Notice</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
