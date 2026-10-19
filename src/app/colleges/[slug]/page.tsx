import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getLiveCollegeBySlug } from '@/lib/db/service';
import { 
  Building2, 
  MapPin, 
  Globe, 
  Mail, 
  Phone, 
  ShieldCheck, 
  Calendar, 
  GraduationCap, 
  Briefcase, 
  ExternalLink,
  ArrowLeft,
  Bell
} from 'lucide-react';
import VacancyCard from '@/components/vacancies/VacancyCard';

export const revalidate = 0;

interface CollegeProfilePageProps {
  params: {
    slug: string;
  };
}

export default async function CollegeProfilePage({ params }: CollegeProfilePageProps) {
  const college = await getLiveCollegeBySlug(params.slug);

  if (!college) {
    notFound();
  }

  const collegeVacancies = college.vacancies || [];
  const collegeNews = college.news || [];


  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Back button */}
      <div>
        <Link 
          href="/colleges" 
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-navy-900 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to College Directory</span>
        </Link>
      </div>

      {/* College Identity Banner */}
      <div className="bg-white border border-surface-border rounded-lg p-6 sm:p-8 space-y-5">
        
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 text-xs font-bold rounded bg-navy-50 text-navy-800 border border-navy-100">
                {college.institutionType}
              </span>
              <span className="px-2.5 py-0.5 text-xs font-medium rounded bg-slate-100 text-slate-700">
                {college.ownershipType}
              </span>
              <span className="flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Verified Institution
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-navy-900 tracking-tight">
              {college.name}
            </h1>

            {college.affiliationInfo && (
              <p className="text-xs sm:text-sm text-textColor-secondary font-medium">
                {college.affiliationInfo}
              </p>
            )}
          </div>

          {college.officialWebsite && (
            <a
              href={college.officialWebsite}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-300 text-xs font-semibold text-navy-900 rounded-lg transition-colors shrink-0"
            >
              <Globe className="w-4 h-4 text-blue-600" />
              <span>Official Website</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>
          )}
        </div>

        {/* Contact Info Pills */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-100 text-xs text-textColor-secondary">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
            <span>{college.address}</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="font-mono">{college.officialEmail}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-slate-400 shrink-0" />
            <span>{college.officialPhone}</span>
          </div>
        </div>

      </div>

      {/* Main Grid: Description & Vacancies */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Active Vacancies & News */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Active Vacancies Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-surface-border">
              <h2 className="text-lg font-bold text-navy-900 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-blue-600" />
                <span>Active Recruitment Vacancies ({collegeVacancies.length})</span>
              </h2>
            </div>

            {collegeVacancies.length > 0 ? (
              <div className="space-y-3">
                {collegeVacancies.map((vacancy) => (
                  <VacancyCard key={vacancy.id} vacancy={vacancy} />
                ))}
              </div>
            ) : (
              <div className="bg-white border border-surface-border rounded-lg p-8 text-center space-y-2">
                <Briefcase className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-xs font-semibold text-navy-900">No active vacancies currently open</p>
                <p className="text-xs text-textColor-secondary">
                  Check back later or subscribe to this institution&apos;s circular updates.
                </p>
              </div>
            )}
          </div>

          {/* Institutional News & Circulars */}
          {collegeNews.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-surface-border">
                <h2 className="text-lg font-bold text-navy-900 flex items-center gap-2">
                  <Bell className="w-5 h-5 text-amber-600" />
                  <span>Institutional Notices & Updates</span>
                </h2>
              </div>

              <div className="bg-white border border-surface-border rounded-lg divide-y divide-slate-100">
                {collegeNews.map((item) => (
                  <div key={item.id} className="p-4 space-y-1">
                    <div className="flex items-center justify-between text-xs text-textColor-secondary">
                      <span className="font-semibold text-navy-900">{item.category}</span>
                      <span>{item.publishedAt}</span>
                    </div>
                    <Link
                      href={`/news/${item.slug}`}
                      className="text-sm font-bold text-navy-900 hover:text-blue-600 block"
                    >
                      {item.title}
                    </Link>
                    <p className="text-xs text-slate-600 line-clamp-2">
                      {item.summary}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Right Sidebar: About the College */}
        <div className="space-y-6">
          <div className="bg-white border border-surface-border rounded-lg p-6 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-navy-900 pb-2 border-b border-slate-100">
              Institutional Profile
            </h3>
            <p className="text-xs text-slate-700 leading-relaxed">
              {college.description}
            </p>

            <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Established:</span>
                <span className="font-semibold text-navy-900">{college.establishmentYear}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Ownership:</span>
                <span className="font-semibold text-navy-900">{college.ownershipType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">District:</span>
                <span className="font-semibold text-navy-900">{college.district}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">State:</span>
                <span className="font-semibold text-navy-900">{college.state}</span>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
