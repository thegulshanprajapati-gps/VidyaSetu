import React from 'react';
import Link from 'next/link';
import { College } from '@/lib/types';
import { Building2, MapPin, Globe, ShieldCheck, Briefcase, ChevronRight, Calendar } from 'lucide-react';

interface CollegeCardProps {
  college: College;
}

export default function CollegeCard({ college }: CollegeCardProps) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:border-blue-500/50 hover:shadow-lg dark:hover:shadow-blue-500/5 transition-all flex flex-col justify-between group">
      <div className="space-y-3">
        {/* Badges */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-lg bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              {college.institutionType}
            </span>
            <span className={`px-2.5 py-0.5 text-[11px] font-semibold rounded-lg ${
              college.ownershipType === 'GOVERNMENT' 
                ? 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800' 
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}>
              {college.ownershipType}
            </span>
          </div>

          {college.verificationStatus === 'APPROVED' ? (
            <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 px-2 py-0.5 rounded-lg border border-emerald-200 dark:border-emerald-800">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              Verified
            </span>
          ) : (
            <span className="text-[11px] font-semibold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/80 px-2 py-0.5 rounded-lg border border-amber-200 dark:border-amber-800">
              {college.verificationStatus.replace('_', ' ')}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-base font-black text-slate-900 dark:text-white leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          <Link href={`/colleges/${college.slug}`}>
            {college.name}
          </Link>
        </h3>

        {/* Location & Year */}
        <div className="space-y-1 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{college.district}, {college.state}</span>
          </div>
          {college.establishmentYear && (
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>Est. {college.establishmentYear}</span>
            </div>
          )}
        </div>

        {/* Description snippet */}
        <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
          {college.description}
        </p>
      </div>

      {/* Footer / Meta */}
      <div className="pt-3.5 mt-3.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
          <Briefcase className="w-3.5 h-3.5 text-blue-500" />
          <span>{college.vacanciesCount || 0} Open {college.vacanciesCount === 1 ? 'Post' : 'Posts'}</span>
        </div>

        <Link
          href={`/colleges/${college.slug}`}
          className="text-blue-600 dark:text-blue-400 hover:underline font-bold inline-flex items-center gap-1"
        >
          <span>View Profile</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
