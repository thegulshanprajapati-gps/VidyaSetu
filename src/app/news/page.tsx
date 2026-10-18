'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MOCK_NEWS } from '@/lib/mock-data';
import { Bell, FileText, Calendar, Building2, Tag, ChevronRight } from 'lucide-react';

export default function NewsAndNoticesPage() {
  const [selectedType, setSelectedType] = useState<string>('ALL');

  const filteredNews = MOCK_NEWS.filter((item) => {
    if (selectedType === 'ALL') return true;
    return item.contentType === selectedType;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="pb-4 border-b border-surface-border space-y-2">
        <div className="flex items-center gap-2">
          <Bell className="w-6 h-6 text-amber-600" />
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight">
            Official Notices & Institutional News
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-textColor-secondary">
          Statutory circulars, recruitment corrigenda, examination schedules, and technical education updates across Bihar.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        {[
          { label: 'All Updates', value: 'ALL' },
          { label: 'Official Circulars', value: 'CIRCULAR' },
          { label: 'Recruitment Notices', value: 'NOTICE' },
          { label: 'Academic News', value: 'NEWS' },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setSelectedType(tab.value)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              selectedType === tab.value
                ? 'bg-navy-500 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-navy-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="space-y-4">
        {filteredNews.map((item) => (
          <div 
            key={item.id} 
            className="bg-white border border-surface-border rounded-lg p-5 hover:border-blue-300 hover:shadow-xs transition-all space-y-3"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 text-[11px] font-bold rounded bg-amber-50 text-amber-800 border border-amber-200">
                  {item.contentType}
                </span>
                <span className="px-2 py-0.5 text-[11px] font-medium rounded bg-slate-100 text-slate-700">
                  {item.category}
                </span>
                {item.isImportant && (
                  <span className="px-2 py-0.5 text-[11px] font-bold rounded bg-rose-50 text-rose-800 border border-rose-200">
                    Important
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <Calendar className="w-3.5 h-3.5" />
                <span>{item.publishedAt}</span>
              </div>
            </div>

            <h2 className="text-base sm:text-lg font-bold text-navy-900">
              <Link href={`/news/${item.slug}`} className="hover:text-blue-600 transition-colors">
                {item.title}
              </Link>
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {item.summary}
            </p>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              {item.collegeName && (
                <div className="flex items-center gap-1.5 font-medium text-navy-900">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>{item.collegeName}</span>
                </div>
              )}
              <Link
                href={`/news/${item.slug}`}
                className="text-blue-600 font-semibold hover:underline inline-flex items-center gap-1 ml-auto"
              >
                <span>Read Full Circular</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
