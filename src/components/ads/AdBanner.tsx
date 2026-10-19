import React from 'react';
import { ExternalLink, Sparkles, BookOpen, GraduationCap, Award } from 'lucide-react';

interface AdBannerProps {
  format?: 'leaderboard' | 'rectangle' | 'infeed';
  title?: string;
  subtitle?: string;
  ctaText?: string;
  targetUrl?: string;
  className?: string;
}

export default function AdBanner({
  format = 'leaderboard',
  title = 'Bihar State Technical Education & Skill Guidance 2026',
  subtitle = 'Free official mock tests, interview syllabus guides & scholarship updates for polytechnic & degree aspirants.',
  ctaText = 'Explore Free Portal',
  targetUrl = '#',
  className = '',
}: AdBannerProps) {
  if (format === 'rectangle') {
    return (
      <div className={`bg-gradient-to-br from-slate-50 to-blue-50/40 border border-slate-200 rounded-lg p-4 shadow-2xs relative overflow-hidden text-center space-y-3 ${className}`}>
        {/* Ad Tag */}
        <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
          <span>Sponsored Notice</span>
          <span className="text-[9px] bg-slate-200/80 px-1 rounded text-slate-500">AD</span>
        </div>

        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center mx-auto shadow-2xs">
          <GraduationCap className="w-5 h-5" />
        </div>

        <div className="space-y-1">
          <h4 className="text-xs font-bold text-navy-900 leading-snug">
            {title}
          </h4>
          <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
            {subtitle}
          </p>
        </div>

        <a
          href={targetUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-1.5 w-full py-2 bg-navy-500 hover:bg-blue-600 text-white rounded text-[11px] font-bold shadow-2xs transition-colors"
        >
          <span>{ctaText}</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    );
  }

  if (format === 'infeed') {
    return (
      <div className={`bg-gradient-to-r from-blue-50/50 via-slate-50 to-white border border-blue-200/60 rounded-lg p-4 my-3 flex flex-col sm:flex-row items-center justify-between gap-4 ${className}`}>
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-md bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5">
            <Award className="w-5 h-5" />
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-bold bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded">
                SPONSORED
              </span>
              <h4 className="text-xs sm:text-sm font-bold text-navy-900">
                {title}
              </h4>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {subtitle}
            </p>
          </div>
        </div>

        <a
          href={targetUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-1.5 bg-navy-500 hover:bg-blue-600 text-white rounded text-xs font-semibold shrink-0 transition-colors inline-flex items-center gap-1.5 shadow-2xs self-stretch sm:self-auto justify-center"
        >
          <span>{ctaText}</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    );
  }

  // Default: Leaderboard (Horizontal)
  return (
    <div className={`bg-gradient-to-r from-slate-50 via-blue-50/30 to-slate-50 border border-slate-200 rounded-lg p-3 sm:p-4 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left ${className}`}>
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex w-10 h-10 rounded-lg bg-navy-500 text-white items-center justify-center shrink-0">
          <Sparkles className="w-5 h-5 text-amber-300" />
        </div>
        <div className="space-y-0.5">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <span className="text-[9px] font-bold bg-slate-200 text-slate-600 px-1 rounded uppercase">
              Advertisement
            </span>
            <span className="text-xs font-bold text-navy-900">
              {title}
            </span>
          </div>
          <p className="text-[11px] text-slate-600 line-clamp-1">
            {subtitle}
          </p>
        </div>
      </div>

      <a
        href={targetUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-bold shrink-0 transition-colors inline-flex items-center gap-1.5 shadow-2xs"
      >
        <span>{ctaText}</span>
        <ExternalLink className="w-3.5 h-3.5" />
      </a>
    </div>
  );
}
