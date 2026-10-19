import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MOCK_NEWS } from '@/lib/mock-data';
import { Bell, Calendar, Building2, ArrowLeft, FileText, Share2 } from 'lucide-react';

interface NewsDetailsPageProps {
  params: {
    slug: string;
  };
}

export default function NewsDetailsPage({ params }: NewsDetailsPageProps) {
  const item = MOCK_NEWS.find((n) => n.slug === params.slug);

  if (!item) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Back button */}
      <div>
        <Link 
          href="/news" 
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-navy-900 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to News & Notices</span>
        </Link>
      </div>

      <article className="bg-white border border-surface-border rounded-lg p-6 sm:p-8 space-y-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-2.5 py-0.5 text-xs font-bold rounded bg-amber-50 text-amber-800 border border-amber-200">
            {item.contentType}
          </span>
          <span className="px-2.5 py-0.5 text-xs font-medium rounded bg-slate-100 text-slate-700">
            {item.category}
          </span>
          <div className="flex items-center gap-1 text-xs text-slate-500 ml-auto">
            <Calendar className="w-3.5 h-3.5" />
            <span>Published on {item.publishedAt}</span>
          </div>
        </div>

        <h1 className="text-xl sm:text-3xl font-black text-navy-900 leading-tight">
          {item.title}
        </h1>

        {item.collegeName && (
          <div className="flex items-center gap-2 text-xs text-navy-800 font-semibold pt-2 border-t border-slate-100">
            <Building2 className="w-4 h-4 text-blue-600" />
            <span>Issuing Authority: {item.collegeName}</span>
          </div>
        )}

        <div className="p-4 rounded-lg bg-slate-50 border-l-4 border-blue-600 text-xs sm:text-sm text-slate-700 font-medium">
          {item.summary}
        </div>

        <div 
          className="prose prose-sm max-w-none text-slate-800 text-xs sm:text-sm leading-relaxed pt-2"
          dangerouslySetInnerHTML={{ __html: item.bodyHtml }}
        />

        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button 
            type="button"
            className="inline-flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-md text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            <FileText className="w-4 h-4 text-rose-600" />
            <span>Download Signed Circular Copy</span>
          </button>
          
          <Link
            href="/vacancies"
            className="text-xs font-semibold text-blue-600 hover:underline"
          >
            Explore Related Open Vacancies →
          </Link>
        </div>
      </article>

    </div>
  );
}
