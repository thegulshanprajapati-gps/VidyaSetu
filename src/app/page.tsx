import React from 'react';
import Link from 'next/link';
import { 
  Search, 
  Building2, 
  Briefcase, 
  Bell, 
  ShieldCheck, 
  GraduationCap, 
  MapPin, 
  ChevronRight, 
  ArrowRight,
  Sparkles,
  FileText,
  MessageSquare,
  ThumbsUp,
  Clock,
  TrendingUp,
  CheckCircle2,
  Users
} from 'lucide-react';
import prisma from '@/lib/db/prisma';
import { fetchLiveVacancies, fetchLiveColleges, fetchLiveNews } from '@/lib/db/service';
import VacancyCard from '@/components/vacancies/VacancyCard';
import CollegeCard from '@/components/colleges/CollegeCard';

export const revalidate = 0;

export default async function HomePage() {
  const [vacancies, colleges, newsItems, communityPosts] = await Promise.all([
    fetchLiveVacancies(),
    fetchLiveColleges({ status: 'APPROVED' }),
    fetchLiveNews(),
    prisma.communityPost.findMany({
      take: 3,
      orderBy: { createdAt: 'desc' },
    }).catch((error: unknown) => {
      console.error('Failed to load community posts:', error);
      return [];
    }),
  ]);

  const verifiedColleges = colleges.slice(0, 4);
  const latestNotices = newsItems.slice(0, 4);

  return (
    <div className="space-y-12 pb-20">
      
      {/* Premium Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 px-4 sm:px-6 lg:px-8 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-b from-blue-50/50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-tr from-blue-500/10 via-indigo-500/15 to-sky-400/10 blur-[100px] pointer-events-none rounded-full" />
        
        <div className="max-w-5xl mx-auto text-center space-y-6 relative z-10">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 dark:bg-blue-500/20 border border-blue-400/30 text-blue-700 dark:text-blue-300 text-xs font-bold shadow-xs">
            <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400 animate-pulse" />
            <span>VIDYASETU • BIHAR STATE HIGHER EDUCATION & FACULTY CAREER GATEWAY</span>
          </div>

          <h1 className="text-3xl sm:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.15]">
            Gateway to Academic Excellence & <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 bg-clip-text text-transparent">Teaching Careers in Bihar</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
            One authoritative statewide network connecting qualified scholars and technical professionals with accredited universities, engineering colleges, and polytechnics.
          </p>

          {/* Interactive Search Box */}
          <div className="bg-white/80 dark:bg-slate-900/90 backdrop-blur-md p-2.5 rounded-2xl shadow-xl shadow-slate-900/5 dark:shadow-blue-500/5 border border-slate-200 dark:border-slate-800 max-w-3xl mx-auto">
            <form action="/vacancies" method="GET" className="flex flex-col sm:flex-row items-center gap-2">
              <div className="flex items-center flex-1 w-full px-3.5 py-2.5 text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 focus-within:border-blue-500 transition-all">
                <Search className="w-5 h-5 text-slate-400 mr-2.5 shrink-0" />
                <input
                  type="text"
                  name="q"
                  placeholder="Job designation (Assistant Professor, Lab Tech, Lecturer)..."
                  className="w-full bg-transparent text-xs sm:text-sm focus:outline-none text-slate-900 dark:text-white placeholder:text-slate-400"
                />
              </div>

              <div className="flex items-center w-full sm:w-auto gap-2">
                <select
                  name="district"
                  className="w-full sm:w-40 px-3 py-2.5 text-xs font-semibold bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-700 dark:text-slate-200 focus:outline-none focus:border-blue-500"
                >
                  <option value="">All Bihar Districts</option>
                  <option value="Patna">Patna</option>
                  <option value="Muzaffarpur">Muzaffarpur</option>
                  <option value="Bhagalpur">Bhagalpur</option>
                  <option value="Gaya">Gaya</option>
                  <option value="Nalanda">Nalanda</option>
                  <option value="Vaishali">Vaishali</option>
                </select>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md shadow-blue-500/25 transition-all flex items-center justify-center gap-1.5 shrink-0 active:scale-98"
                >
                  <span>Explore Jobs</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>

          {/* Quick Categories */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs">
            <span className="text-slate-500 dark:text-slate-400 font-semibold">Quick Filters:</span>
            {[
              { label: 'Engineering Colleges', href: '/vacancies?type=ENGINEERING' },
              { label: 'Polytechnics', href: '/vacancies?type=POLYTECHNIC' },
              { label: 'Degree Colleges', href: '/vacancies?type=DEGREE' },
              { label: 'Assistant Professors', href: '/vacancies?category=TEACHING' },
              { label: 'Technical Staff', href: '/vacancies?category=TECHNICAL' },
            ].map((tag) => (
              <Link
                key={tag.label}
                href={tag.href}
                className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800/80 hover:bg-blue-50 dark:hover:bg-blue-950 hover:text-blue-600 dark:hover:text-blue-400 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-medium transition-colors"
              >
                {tag.label}
              </Link>
            ))}
          </div>

        </div>
      </section>

      {/* Interactive Sticky Telemetry Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-900/5">
          
          <div className="p-3 space-y-1">
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 text-xs font-bold">
              <Building2 className="w-4 h-4" />
              <span>COLLEGES ONBOARDED</span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {colleges.length} Verified
            </div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">Govt & Affiliated Campuses</span>
          </div>

          <div className="p-3 space-y-1">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
              <Briefcase className="w-4 h-4" />
              <span>ACTIVE OPENINGS</span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {vacancies.length} Live Posts
            </div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">Teaching & Tech Circulars</span>
          </div>

          <div className="p-3 space-y-1">
            <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 text-xs font-bold">
              <MessageSquare className="w-4 h-4" />
              <span>COMMUNITY FORUM</span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Active Network
            </div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">Candidate Peer Discussions</span>
          </div>

          <div className="p-3 space-y-1">
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 text-xs font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>DATABASE INTEGRITY</span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Aiven Cloud
            </div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">Direct PostgreSQL 16 Sync</span>
          </div>

        </div>
      </section>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Live Vacancies */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-blue-600" />
                <span>Featured Recruitment Advertisements</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Verified faculty and staff circulars currently accepting candidate applications.
              </p>
            </div>
            <Link
              href="/vacancies"
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              <span>View All ({vacancies.length})</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="space-y-4">
            {vacancies.slice(0, 4).map((vacancy) => (
              <VacancyCard key={vacancy.id} vacancy={vacancy} />
            ))}
          </div>
        </div>

        {/* Right 1 Col: Community Highlights & Official Notices */}
        <div className="space-y-6">
          
          {/* Community Feed Highlight Box */}
          <div className="bg-gradient-to-br from-blue-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-5 shadow-xl border border-blue-800/60 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-blue-800/60">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-blue-400" />
                <h3 className="text-sm font-bold text-white">Community Discussions</h3>
              </div>
              <Link
                href="/community"
                className="text-xs font-bold text-blue-400 hover:text-white transition-colors"
              >
                Join Feed →
              </Link>
            </div>

            <div className="space-y-3">
              {communityPosts.map((post) => (
                <div key={post.id} className="p-3 rounded-xl bg-slate-950/60 border border-blue-800/40 space-y-1 hover:border-blue-500/60 transition-colors">
                  <div className="flex items-center justify-between text-[10px] text-blue-300">
                    <span className="font-bold uppercase tracking-wider">{post.category}</span>
                    <span className="flex items-center gap-1 text-slate-400">
                      <ThumbsUp className="w-3 h-3 text-blue-400" />
                      {post.likes}
                    </span>
                  </div>
                  <Link href="/community" className="text-xs font-bold text-white hover:text-blue-400 line-clamp-1 block">
                    {post.title}
                  </Link>
                  <p className="text-[11px] text-slate-300 line-clamp-2">
                    {post.content}
                  </p>
                </div>
              ))}
            </div>

            <Link
              href="/community"
              className="w-full py-2 px-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-md"
            >
              <span>Ask Query or Post Update</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Official Notices */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Bell className="w-4 h-4 text-amber-500" />
                <span>Directorate Notices</span>
              </h3>
              <Link href="/news" className="text-xs text-blue-600 dark:text-blue-400 font-bold hover:underline">
                All
              </Link>
            </div>

            <div className="space-y-2.5">
              {latestNotices.map((notice) => (
                <Link
                  key={notice.id}
                  href={`/news/${notice.slug}`}
                  className="block p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 hover:border-blue-500/50 transition-colors"
                >
                  <div className="flex items-center justify-between text-[10px] text-slate-400 pb-1">
                    <span className="font-bold uppercase text-amber-600 dark:text-amber-400">{notice.contentType}</span>
                    <span>{notice.publishedAt ? new Date(notice.publishedAt).toLocaleDateString() : 'Recent'}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-2">
                    {notice.title}
                  </h4>
                </Link>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Verified Institutional Campuses Directory */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <Building2 className="w-5 h-5 text-blue-600" />
              <span>Recognized Higher Education Institutions</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Affiliated engineering colleges, polytechnics, and state universities across Bihar.
            </p>
          </div>
          <Link
            href="/colleges"
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            <span>View All ({colleges.length})</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {verifiedColleges.map((college) => (
            <CollegeCard key={college.id} college={college} />
          ))}
        </div>
      </section>

      {/* Two Prominent Action Cards for Visitors */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Candidate Card */}
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-3xl p-6 sm:p-8 space-y-3 shadow-xl relative overflow-hidden">
            <div className="absolute right-0 bottom-0 -mb-8 -mr-8 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
            <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/20 text-white border border-white/30 inline-block">
              For Job Candidates & Scholars
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              Looking for Teaching or Technical Posts?
            </h3>
            <p className="text-xs text-blue-100 leading-relaxed">
              Create your candidate profile to apply directly, join community discussions, and receive timely recruitment updates across Bihar institutions.
            </p>
            <div className="pt-2">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-blue-700 hover:bg-blue-50 font-bold text-xs shadow-md transition-all active:scale-98"
              >
                <span>Candidate Sign In / Register</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* College Officer Card */}
          <div className="bg-slate-900 dark:bg-slate-900 border border-slate-800 text-white rounded-3xl p-6 sm:p-8 space-y-3 shadow-xl relative overflow-hidden">
            <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-slate-300 border border-slate-700 inline-block">
              For College Principals & Authorized Officers
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              Recruiting Faculty for Your Campus?
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Log in to your dedicated college administrative desk to submit recruitment circulars, manage post categories, and verify applications.
            </p>
            <div className="pt-2">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md transition-all active:scale-98"
              >
                <span>Access College Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
