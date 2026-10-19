'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Bell, FileEdit, Send, Save, ArrowLeft, UploadCloud, CheckCircle2 } from 'lucide-react';
import TiptapEditor from '@/components/editor/TiptapEditor';

export default function NewNewsPage() {
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    contentType: 'NOTICE',
    category: 'Recruitment Notice',
    summary: '',
    bodyHtml: '<p>Enter full circular text and official instructions here...</p>',
    isImportant: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      router.push('/college-admin/news');
    }, 1200);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-navy-900 tracking-tight">
            Publish Notice or Circular
          </h1>
          <p className="text-xs text-textColor-secondary">
            Compose official updates and announcements for candidates and students.
          </p>
        </div>
        <Link href="/college-admin/news" className="text-xs font-semibold text-slate-600 hover:text-navy-900">
          Cancel
        </Link>
      </div>

      {submitted && (
        <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>Notice saved successfully! Redirecting...</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-5 shadow-xs">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="sm:col-span-2 space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Title / Subject <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Schedule for Document Verification - Polytechnic Lecturers"
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all font-medium"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Content Type <span className="text-rose-500">*</span>
            </label>
            <select
              name="contentType"
              value={formData.contentType}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all font-medium"
            >
              <option value="NOTICE">Official Notice</option>
              <option value="CIRCULAR">Administrative Circular</option>
              <option value="NEWS">Academic News</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Category Tag</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="e.g. Walk-in / Examination / Syllabus"
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all font-medium"
            />
          </div>

          <div className="sm:col-span-2 space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Executive Summary / Ticker Text <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={2}
              name="summary"
              required
              value={formData.summary}
              onChange={handleChange}
              placeholder="Brief summary appearing on homepage cards and notices ticker..."
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all font-medium"
            />
          </div>
        </div>

        {/* Tiptap Editor for Body */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-navy-900">Full Notice Content (Rich Text)</label>
          <TiptapEditor
            initialContent={formData.bodyHtml}
            onChange={(html) => setFormData(prev => ({ ...prev, bodyHtml: html }))}
          />
        </div>

        <div className="pt-2 flex items-center justify-between border-t border-slate-100">
          <label className="flex items-center gap-2 text-xs text-navy-900 cursor-pointer font-medium">
            <input
              type="checkbox"
              name="isImportant"
              checked={formData.isImportant}
              onChange={handleChange}
              className="rounded text-blue-600 focus:ring-blue-500"
            />
            <span>Mark as Important (Highlights notice with badge)</span>
          </label>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => router.push('/college-admin/news')}
              className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              Save Draft
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold shadow-xs transition-colors"
            >
              Publish Notice
            </button>
          </div>
        </div>

      </form>
    </div>
  );
}
