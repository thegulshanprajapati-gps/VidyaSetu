'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Briefcase, 
  Building2, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertCircle, 
  RefreshCw, 
  Search, 
  Calendar, 
  Layers, 
  FileText, 
  ExternalLink,
  ChevronDown,
  ChevronRight,
  Eye,
  GraduationCap,
  MapPin,
  Tag
} from 'lucide-react';

interface College {
  id: string;
  name: string;
  slug: string;
  district: string;
  institutionType?: string;
}

interface Vacancy {
  id: string;
  collegeId: string;
  title: string;
  slug: string;
  department: string;
  postName: string;
  numberOfPosts: number | null;
  jobCategory: string;
  employmentType: string;
  qualification: string;
  experience?: string | null;
  ageCriteria?: string | null;
  salary?: string | null;
  applicationFee?: string | null;
  applicationMode: string;
  notificationDate: string;
  applicationOpenDate: string;
  applicationCloseDate: string;
  interviewDate?: string | null;
  status: string;
  moderatorRemarks?: string | null;
  college: College;
  createdBy?: {
    name: string;
    email: string;
  };
  createdAt: string;
}

export default function VacanciesConsolePage() {
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCollegeId, setSelectedCollegeId] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedEmploymentType, setSelectedEmploymentType] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [groupByCollege, setGroupByCollege] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [inspectVacancy, setInspectVacancy] = useState<Vacancy | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [vacRes, colRes] = await Promise.all([
        fetch('/api/vacancies'),
        fetch('/api/colleges'),
      ]);

      const vacData = await vacRes.json();
      const colData = await colRes.json();

      if (vacData.success) setVacancies(vacData.vacancies);
      if (colData.success) setColleges(colData.colleges);
    } catch (err) {
      console.error('Failed to load vacancies console data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStatusChange = async (id: string, title: string, newStatus: 'PUBLISHED' | 'REJECTED') => {
    try {
      const res = await fetch(`/api/vacancies/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();
      if (data.success) {
        setVacancies(prev => prev.map(v => v.id === id ? { ...v, status: newStatus } : v));
        if (inspectVacancy && inspectVacancy.id === id) {
          setInspectVacancy(prev => prev ? { ...prev, status: newStatus } : null);
        }
        setToastMessage(`"${title}" marked as ${newStatus} in PostgreSQL!`);
        setTimeout(() => setToastMessage(null), 3500);
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (err) {
      console.error('Failed to update vacancy status:', err);
    }
  };

  // Filtered list
  const filteredVacancies = vacancies.filter(v => {
    if (selectedCollegeId !== 'ALL' && v.collegeId !== selectedCollegeId) return false;
    if (selectedCategory !== 'ALL' && v.jobCategory !== selectedCategory) return false;
    if (selectedStatus !== 'ALL' && v.status !== selectedStatus) return false;
    if (selectedEmploymentType !== 'ALL' && v.employmentType !== selectedEmploymentType) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const matchesTitle = v.title.toLowerCase().includes(term);
      const matchesDept = v.department.toLowerCase().includes(term);
      const matchesCollege = v.college?.name?.toLowerCase().includes(term);
      const matchesPost = v.postName.toLowerCase().includes(term);
      if (!matchesTitle && !matchesDept && !matchesCollege && !matchesPost) return false;
    }
    return true;
  });

  // Group vacancies by college
  const vacanciesByCollegeMap = new Map<string, { college: College; list: Vacancy[] }>();
  filteredVacancies.forEach(v => {
    const colId = v.collegeId;
    if (!vacanciesByCollegeMap.has(colId)) {
      vacanciesByCollegeMap.set(colId, { college: v.college, list: [] });
    }
    vacanciesByCollegeMap.get(colId)!.list.push(v);
  });

  const categoryStats = {
    TEACHING: vacancies.filter(v => v.jobCategory === 'TEACHING').length,
    NON_TEACHING: vacancies.filter(v => v.jobCategory === 'NON_TEACHING').length,
    TECHNICAL: vacancies.filter(v => v.jobCategory === 'TECHNICAL').length,
    ADMINISTRATIVE: vacancies.filter(v => v.jobCategory === 'ADMINISTRATIVE').length,
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="pb-4 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-900/60 text-blue-400 border border-blue-700/50">
              STATEWIDE RECRUITMENT DESK
            </span>
            <span className="text-xs text-slate-400">Bihar Higher Education Directorate</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight pt-1">
            Vacancies Directory & College-wise Postings
          </h1>
          <p className="text-xs text-slate-400">
            Audit recruitment advertisements separated per college and categorized vacancy-wise across Bihar.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs font-semibold border border-slate-700 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-blue-400' : ''}`} />
            <span>Refresh Posts</span>
          </button>
          <Link
            href="/db-explorer"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-bold shadow-md transition-colors"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Realtime DB Explorer</span>
          </Link>
        </div>
      </div>

      {toastMessage && (
        <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs font-semibold flex items-center gap-2 shadow-lg animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div 
          onClick={() => setSelectedCategory('TEACHING')}
          className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
            selectedCategory === 'TEACHING'
              ? 'bg-blue-950/80 border-blue-600 shadow-lg'
              : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold">
            <span>TEACHING POSTS</span>
            <GraduationCap className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <div className="text-2xl font-black text-white pt-1">{categoryStats.TEACHING}</div>
          <span className="text-[10px] text-slate-500">Professors, Lecturers, Faculty</span>
        </div>

        <div 
          onClick={() => setSelectedCategory('TECHNICAL')}
          className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
            selectedCategory === 'TECHNICAL'
              ? 'bg-purple-950/80 border-purple-600 shadow-lg'
              : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold">
            <span>TECHNICAL POSTS</span>
            <Briefcase className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-white pt-1">{categoryStats.TECHNICAL}</div>
          <span className="text-[10px] text-slate-500">Lab Assistants, Workshop Staff</span>
        </div>

        <div 
          onClick={() => setSelectedCategory('NON_TEACHING')}
          className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
            selectedCategory === 'NON_TEACHING'
              ? 'bg-amber-950/80 border-amber-600 shadow-lg'
              : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold">
            <span>NON-TEACHING</span>
            <FileText className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-white pt-1">{categoryStats.NON_TEACHING}</div>
          <span className="text-[10px] text-slate-500">Clerical & Support Staff</span>
        </div>

        <div 
          onClick={() => setSelectedCategory('ADMINISTRATIVE')}
          className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
            selectedCategory === 'ADMINISTRATIVE'
              ? 'bg-emerald-950/80 border-emerald-600 shadow-lg'
              : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold">
            <span>ADMINISTRATIVE</span>
            <Building2 className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white pt-1">{categoryStats.ADMINISTRATIVE}</div>
          <span className="text-[10px] text-slate-500">Registrars, Controllers, Officers</span>
        </div>
      </div>

      {/* Comprehensive Filter Controls */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search post name, department, or college..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Grouping Mode Switcher */}
          <div className="flex items-center gap-2 self-start md:self-auto">
            <span className="text-xs text-slate-400 font-semibold">View Mode:</span>
            <button
              onClick={() => setGroupByCollege(true)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                groupByCollege 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'bg-slate-950 text-slate-400 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Separated by College</span>
            </button>
            <button
              onClick={() => setGroupByCollege(false)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                !groupByCollege 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'bg-slate-950 text-slate-400 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Flat Postings List</span>
            </button>
          </div>
        </div>

        {/* Multi-Filter Selects */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-2 border-t border-slate-800/80 text-xs">
          
          {/* College Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">
              Filter by College ({colleges.length} total)
            </label>
            <select
              value={selectedCollegeId}
              onChange={(e) => setSelectedCollegeId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
            >
              <option value="ALL">All Bihar Colleges ({colleges.length})</option>
              {colleges.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.district})
                </option>
              ))}
            </select>
          </div>

          {/* Job Category Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">
              Job Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
            >
              <option value="ALL">All Categories</option>
              <option value="TEACHING">TEACHING</option>
              <option value="TECHNICAL">TECHNICAL</option>
              <option value="NON_TEACHING">NON_TEACHING</option>
              <option value="ADMINISTRATIVE">ADMINISTRATIVE</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">
              Publication Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="PUBLISHED">PUBLISHED (Live on 3000)</option>
              <option value="SUBMITTED">SUBMITTED (Pending Signoff)</option>
              <option value="IN_REVIEW">IN_REVIEW</option>
              <option value="DRAFT">DRAFT</option>
              <option value="REJECTED">REJECTED</option>
              <option value="CLOSED">CLOSED</option>
            </select>
          </div>

          {/* Employment Type */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">
              Employment Nature
            </label>
            <select
              value={selectedEmploymentType}
              onChange={(e) => setSelectedEmploymentType(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
            >
              <option value="ALL">All Types</option>
              <option value="PERMANENT">PERMANENT</option>
              <option value="CONTRACTUAL">CONTRACTUAL</option>
              <option value="GUEST_FACULTY">GUEST_FACULTY</option>
              <option value="TEMPORARY">TEMPORARY</option>
              <option value="PART_TIME">PART_TIME</option>
            </select>
          </div>

        </div>

        {/* Active Filters Display */}
        {(selectedCollegeId !== 'ALL' || selectedCategory !== 'ALL' || selectedStatus !== 'ALL' || selectedEmploymentType !== 'ALL' || searchTerm) && (
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800 text-xs">
            <span className="text-slate-400 text-[11px] font-semibold">Active Filters:</span>
            {selectedCollegeId !== 'ALL' && (
              <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800 text-[10px] font-bold">
                College: {colleges.find(c => c.id === selectedCollegeId)?.name || selectedCollegeId}
              </span>
            )}
            {selectedCategory !== 'ALL' && (
              <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800 text-[10px] font-bold">
                Category: {selectedCategory}
              </span>
            )}
            {selectedStatus !== 'ALL' && (
              <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-bold">
                Status: {selectedStatus}
              </span>
            )}
            {selectedEmploymentType !== 'ALL' && (
              <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 text-[10px] font-bold">
                Type: {selectedEmploymentType}
              </span>
            )}
            <button
              onClick={() => {
                setSelectedCollegeId('ALL');
                setSelectedCategory('ALL');
                setSelectedStatus('ALL');
                setSelectedEmploymentType('ALL');
                setSearchTerm('');
              }}
              className="text-[10px] text-rose-400 hover:underline font-semibold"
            >
              Clear All Filters
            </button>
            <span className="text-slate-500 text-[11px] ml-auto">
              Found {filteredVacancies.length} vacancies
            </span>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="py-16 text-center text-slate-400 text-xs space-y-2">
          <RefreshCw className="w-8 h-8 mx-auto animate-spin text-blue-500" />
          <p>Querying Aiven PostgreSQL for recruitment advertisements...</p>
        </div>
      ) : filteredVacancies.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center space-y-3">
          <Briefcase className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-white">No Vacancies Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            No vacancies match your selected filters. Try broadening your criteria or selecting "All Bihar Colleges".
          </p>
        </div>
      ) : groupByCollege ? (
        /* SEPARATE BY COLLEGE VIEW */
        <div className="space-y-6">
          {Array.from(vacanciesByCollegeMap.entries()).map(([collegeId, { college, list }]) => (
            <div key={collegeId} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
              
              {/* College Header Strip */}
              <div className="bg-slate-950/80 px-5 py-4 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                      <span>{college?.name || 'Institutional Campus'}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-950 text-blue-300 border border-blue-800">
                        {list.length} {list.length === 1 ? 'Vacancy' : 'Vacancies'}
                      </span>
                    </h2>
                    <p className="text-xs text-slate-400 flex items-center gap-2">
                      <span>{college?.district}, Bihar</span>
                      <span>•</span>
                      <span>{college?.institutionType || 'Polytechnic / Engineering'}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/colleges/${collegeId}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold border border-slate-700 transition-colors"
                  >
                    <Building2 className="w-3.5 h-3.5 text-blue-400" />
                    <span>College Profile Dossier</span>
                  </Link>
                </div>
              </div>

              {/* Vacancies for THIS College */}
              <div className="p-4 sm:p-5 space-y-4 divide-y divide-slate-800/60">
                {list.map((v, idx) => (
                  <div key={v.id} className={`${idx > 0 ? 'pt-4' : ''} space-y-3`}>
                    
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-950 text-blue-300 border border-blue-800">
                            {v.jobCategory}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-slate-300">
                            {v.employmentType}
                          </span>
                          <span className="text-xs text-slate-400">
                            Posts: <strong className="text-white">{v.numberOfPosts || 1}</strong>
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-white hover:text-blue-400 transition-colors cursor-pointer" onClick={() => setInspectVacancy(v)}>
                          {v.title}
                        </h3>
                        <div className="text-xs text-slate-400">
                          Department: <strong className="text-slate-200">{v.department}</strong> • Post Designation: <strong className="text-slate-200">{v.postName}</strong>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`px-2.5 py-1 rounded text-xs font-bold flex items-center gap-1 ${
                          v.status === 'PUBLISHED'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : v.status === 'REJECTED'
                            ? 'bg-rose-950 text-rose-300 border border-rose-800'
                            : 'bg-amber-950 text-amber-300 border border-amber-800'
                        }`}>
                          {v.status === 'PUBLISHED' ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Clock className="w-3.5 h-3.5 text-amber-400" />}
                          <span>{v.status}</span>
                        </span>
                      </div>
                    </div>

                    {/* Criteria and Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 p-3 rounded-lg bg-slate-950/70 border border-slate-800 text-xs text-slate-300">
                      <div>
                        <span className="text-slate-500 block text-[11px]">Qualification:</span>
                        <div className="font-medium text-slate-200 truncate">{v.qualification}</div>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[11px]">Salary / Pay Scale:</span>
                        <div className="font-medium text-emerald-400">{v.salary || 'As per AICTE / State Norms'}</div>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[11px]">Application Deadline:</span>
                        <div className="font-medium text-slate-200 flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-blue-400" />
                          <span>{new Date(v.applicationCloseDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
                      <button
                        onClick={() => setInspectVacancy(v)}
                        className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 font-semibold"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect Full Advertisement</span>
                      </button>

                      <div className="flex items-center gap-2">
                        {v.status !== 'PUBLISHED' && (
                          <button
                            onClick={() => handleStatusChange(v.id, v.title, 'PUBLISHED')}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold shadow-sm transition-colors"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Authorize & Publish</span>
                          </button>
                        )}
                        {v.status !== 'REJECTED' && (
                          <button
                            onClick={() => handleStatusChange(v.id, v.title, 'REJECTED')}
                            className="inline-flex items-center gap-1 px-3 py-1.5 border border-rose-800 text-rose-400 hover:bg-rose-950/50 rounded-lg text-xs font-semibold transition-colors"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Reject Post</span>
                          </button>
                        )}
                      </div>
                    </div>

                  </div>
                ))}
              </div>

            </div>
          ))}
        </div>
      ) : (
        /* FLAT LIST VIEW */
        <div className="space-y-4">
          {filteredVacancies.map((v) => (
            <div key={v.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-950 text-blue-300 border border-blue-800">
                      {v.jobCategory}
                    </span>
                    <span className="text-xs text-slate-300 font-bold">{v.college?.name}</span>
                    <span className="text-xs text-slate-500">({v.college?.district})</span>
                  </div>
                  <h3 className="text-base font-bold text-white hover:text-blue-400 cursor-pointer" onClick={() => setInspectVacancy(v)}>
                    {v.title}
                  </h3>
                  <div className="text-xs text-slate-400">
                    Department: <strong className="text-slate-200">{v.department}</strong> • Posts: <strong className="text-slate-200">{v.numberOfPosts || 1}</strong> • Mode: <strong className="text-slate-200">{v.applicationMode}</strong>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className={`px-2.5 py-1 rounded text-xs font-bold flex items-center gap-1 ${
                    v.status === 'PUBLISHED'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      : v.status === 'REJECTED'
                      ? 'bg-rose-950 text-rose-300 border border-rose-800'
                      : 'bg-amber-950 text-amber-300 border border-amber-800'
                  }`}>
                    {v.status === 'PUBLISHED' ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Clock className="w-3.5 h-3.5 text-amber-400" />}
                    <span>{v.status}</span>
                  </span>
                </div>
              </div>

              {/* Recruitment details summary */}
              <div className="p-3 bg-slate-950/70 rounded-lg border border-slate-800 text-xs space-y-1 text-slate-300">
                <div><strong className="text-slate-400">Eligibility / Qualification:</strong> {v.qualification}</div>
                <div><strong className="text-slate-400">Remuneration / Pay Scale:</strong> {v.salary || 'Per State Government Norms'}</div>
                <div><strong className="text-slate-400">Closing Date:</strong> {new Date(v.applicationCloseDate).toLocaleDateString()}</div>
              </div>

              {/* Action buttons */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
                <button
                  onClick={() => setInspectVacancy(v)}
                  className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 font-semibold"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Inspect Full Record</span>
                </button>

                <div className="flex items-center gap-2">
                  {v.status !== 'PUBLISHED' && (
                    <button
                      type="button"
                      onClick={() => handleStatusChange(v.id, v.title, 'PUBLISHED')}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold shadow-md transition-colors"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Approve & Publish</span>
                    </button>
                  )}
                  {v.status !== 'REJECTED' && (
                    <button
                      type="button"
                      onClick={() => handleStatusChange(v.id, v.title, 'REJECTED')}
                      className="inline-flex items-center gap-1 px-3 py-1.5 border border-rose-800 text-rose-400 hover:bg-rose-950/50 rounded-lg text-xs font-semibold transition-colors"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Vacancy Detail Modal Inspector */}
      {inspectVacancy && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-950 text-blue-300 border border-blue-800">
                  {inspectVacancy.jobCategory} • {inspectVacancy.employmentType}
                </span>
                <h2 className="text-lg font-black text-white pt-1">{inspectVacancy.title}</h2>
                <p className="text-xs text-slate-400">{inspectVacancy.college?.name} • {inspectVacancy.college?.district}</p>
              </div>
              <button
                onClick={() => setInspectVacancy(null)}
                className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <span className="text-slate-500 block">Department:</span>
                <strong className="text-white">{inspectVacancy.department}</strong>
              </div>
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <span className="text-slate-500 block">Posts Count:</span>
                <strong className="text-white">{inspectVacancy.numberOfPosts || 1} Post(s)</strong>
              </div>
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <span className="text-slate-500 block">Salary / Stipend:</span>
                <strong className="text-emerald-400">{inspectVacancy.salary || 'Norms based'}</strong>
              </div>
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <span className="text-slate-500 block">Application Mode:</span>
                <strong className="text-white">{inspectVacancy.applicationMode}</strong>
              </div>
            </div>

            <div className="space-y-1 text-xs">
              <span className="text-slate-400 font-semibold">Minimum Qualification & Eligibility:</span>
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-slate-200">
                {inspectVacancy.qualification}
              </div>
            </div>

            <div className="space-y-1 text-xs">
              <span className="text-slate-400 font-semibold">Timeline & Key Dates:</span>
              <div className="grid grid-cols-3 gap-2 p-3 bg-slate-950 rounded-lg border border-slate-800 text-[11px]">
                <div>
                  <span className="text-slate-500 block">Notification:</span>
                  <span className="text-slate-200">{new Date(inspectVacancy.notificationDate).toLocaleDateString()}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Open Date:</span>
                  <span className="text-slate-200">{new Date(inspectVacancy.applicationOpenDate).toLocaleDateString()}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Closing Date:</span>
                  <span className="text-emerald-400 font-bold">{new Date(inspectVacancy.applicationCloseDate).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-mono">
                DB ID: {inspectVacancy.id}
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setInspectVacancy(null)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
                >
                  Close
                </button>
                {inspectVacancy.status !== 'PUBLISHED' && (
                  <button
                    type="button"
                    onClick={() => handleStatusChange(inspectVacancy.id, inspectVacancy.title, 'PUBLISHED')}
                    className="px-4 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-500 shadow-md"
                  >
                    Approve & Publish Post
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
