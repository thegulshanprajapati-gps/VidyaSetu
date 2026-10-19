'use client';

import React from 'react';
import Link from 'next/link';
import { MOCK_NEWS } from '@/lib/mock-data';
import { Bell, PlusCircle, Calendar, Eye, Edit } from 'lucide-react';

export default function CollegeAdminNewsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-navy-900 tracking-tight">
            Institutional Notices & News
          </h1>
          <p className="text-xs text-textColor-secondary">
            Publish circulars, examination updates, corrigenda, and institutional announcements.
          </p>
        </div>
        <Link
          href="/college-admin/news/new"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold shadow-xs transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Publish New Update</span>
        </Link>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-xs divide-y divide-slate-100 overflow-hidden">
        {MOCK_NEWS.map((item) => (
          <div key={item.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors">
            <div className="space-y-1.5 min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold">
                  {item.contentType}
                </span>
                <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  {item.publishedAt}
                </span>
                {item.category && (
                  <span className="text-[11px] text-slate-400">
                    • {item.category}
                  </span>
                )}
              </div>
              <h3 className="text-sm font-bold text-navy-900 leading-snug">{item.title}</h3>
              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{item.summary}</p>
            </div>
            
            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
              <Link
                href={`/news/${item.slug}`}
                target="_blank"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
                title="View Public View"
              >
                <Eye className="w-3.5 h-3.5 text-blue-600" />
                <span>Public View</span>
              </Link>
              <Link
                href="/college-admin/news/new"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-semibold transition-colors"
                title="Edit Notice"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>Edit</span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
