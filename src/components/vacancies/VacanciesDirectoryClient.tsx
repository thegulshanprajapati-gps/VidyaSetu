'use client';

import React, { useState, useMemo } from 'react';
import VacancyCard from '@/components/vacancies/VacancyCard';
import AdBanner from '@/components/ads/AdBanner';
import { Search, Filter, X, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

interface Props {
  initialVacancies: any[];
  initialColleges: any[];
}

export default function VacanciesDirectoryClient({ initialVacancies, initialColleges }: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedEmployment, setSelectedEmployment] = useState('');
  const [selectedCollege, setSelectedCollege] = useState('');
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  // Filter vacancies
  const filteredVacancies = useMemo(() => {
    return initialVacancies.filter((v) => {
      // Must be published
      if (v.status !== 'PUBLISHED') return false;

      // Search term
      if (searchTerm) {
        const query = searchTerm.toLowerCase();
        const matchesTitle = v.title?.toLowerCase().includes(query);
        const matchesDept = v.department?.toLowerCase().includes(query);
        const matchesPost = v.postName?.toLowerCase().includes(query);
        const matchesCol = v.collegeName?.toLowerCase().includes(query);
        const matchesQual = (v.qualification || '').toLowerCase().includes(query);
        if (!matchesTitle && !matchesDept && !matchesPost && !matchesCol && !matchesQual) return false;
      }

      // District
      if (selectedDistrict && v.district !== selectedDistrict) return false;

      // Category
      if (selectedCategory && v.jobCategory !== selectedCategory) return false;

      // Employment
      if (selectedEmployment && v.employmentType !== selectedEmployment) return false;

      // College
      if (selectedCollege && v.collegeId !== selectedCollege) return false;

      return true;
    });
  }, [initialVacancies, searchTerm, selectedDistrict, selectedCategory, selectedEmployment, selectedCollege]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedDistrict('');
    setSelectedCategory('');
    setSelectedEmployment('');
    setSelectedCollege('');
  };

  const hasActiveFilters = searchTerm || selectedDistrict || selectedCategory || selectedEmployment || selectedCollege;

  // Extract available districts
  const availableDistricts = useMemo(() => {
    const set = new Set<string>();
    initialVacancies.forEach(v => {
      if (v.district) set.add(v.district);
    });
    initialColleges.forEach(c => {
      if (c.district) set.add(c.district);
    });
    return Array.from(set).sort();
  }, [initialVacancies, initialColleges]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-surface-border gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight">
            Collegiate & University Recruitment
          </h1>
          <p className="text-xs sm:text-sm text-textColor-secondary mt-1">
            Browse verified faculty, technical, and administrative positions across Bihar institutions.
          </p>
        </div>

        {/* Mobile Filter Toggle */}
        <button
          onClick={() => setFilterDrawerOpen(!filterDrawerOpen)}
          className="lg:hidden flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-navy-900 bg-white border border-slate-300 rounded-md shadow-2xs self-start"
        >
          <SlidersHorizontal className="w-4 h-4 text-blue-600" />
          <span>Filters {hasActiveFilters && '(Active)'}</span>
        </button>
      </div>

      {/* Leaderboard Ad Banner */}
      <AdBanner
        format="leaderboard"
        title="Bihar State Higher Education Faculty Exam Guidance"
        subtitle="Download official API score calculators, syllabus guides & interview preparation resources."
        ctaText="View Materials"
      />

      {/* Main Grid: Sidebar Filters & Results */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Desktop Filter Sidebar */}
        <div className={`lg:block ${filterDrawerOpen ? 'block' : 'hidden'} lg:col-span-1 space-y-5 bg-white p-5 rounded-lg border border-surface-border h-fit`}>
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-navy-900 flex items-center gap-1.5">
              <Filter className="w-4 h-4 text-blue-600" />
              <span>Search Filters</span>
            </h3>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-[11px] font-semibold text-rose-600 hover:underline flex items-center gap-0.5"
              >
                <X className="w-3 h-3" />
                Clear All
              </button>
            )}
          </div>

          {/* Keyword Search */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-navy-900">Keyword Search</label>
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Job title, department..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:border-blue-500"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>
          </div>

          {/* Job Category */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-navy-900">Job Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md text-slate-700 focus:outline-none focus:border-blue-500"
            >
              <option value="">All Categories</option>
              <option value="TEACHING">Teaching (Professors, Lecturers)</option>
              <option value="TECHNICAL">Technical (Lab Staff, Workshop)</option>
              <option value="ADMINISTRATIVE">Administrative & Officers</option>
            </select>
          </div>

          {/* Employment Type */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-navy-900">Employment Type</label>
            <select
              value={selectedEmployment}
              onChange={(e) => setSelectedEmployment(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md text-slate-700 focus:outline-none focus:border-blue-500"
            >
              <option value="">All Types</option>
              <option value="PERMANENT">Permanent / Regular</option>
              <option value="CONTRACTUAL">Contractual</option>
              <option value="GUEST_FACULTY">Guest Faculty / Walk-in</option>
            </select>
          </div>

          {/* District */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-navy-900">District (Bihar)</label>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md text-slate-700 focus:outline-none focus:border-blue-500"
            >
              <option value="">All Districts</option>
              {availableDistricts.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Specific College */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-navy-900">Institution</label>
            <select
              value={selectedCollege}
              onChange={(e) => setSelectedCollege(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md text-slate-700 focus:outline-none focus:border-blue-500"
            >
              <option value="">All Registered Colleges</option>
              {initialColleges.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Sidebar Sponsor Ad */}
          <div className="pt-2">
            <AdBanner
              format="rectangle"
              title="State Polytechnic Exam Practice Set"
              subtitle="Topic-wise engineering test papers and solved technical problems."
              ctaText="Start Practice"
            />
          </div>

        </div>

        {/* Vacancies List & Count Header */}
        <div className="lg:col-span-3 space-y-4">
          
          <div className="bg-white px-4 py-3 rounded-lg border border-surface-border flex items-center justify-between text-xs text-textColor-secondary">
            <div>
              Showing <span className="font-bold text-navy-900">{filteredVacancies.length}</span> published recruitment {filteredVacancies.length === 1 ? 'notice' : 'notices'}
            </div>
            <div className="flex items-center gap-1 text-slate-500">
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span>Sorted by Closing Date</span>
            </div>
          </div>

          {/* Vacancies Display */}
          {filteredVacancies.length > 0 ? (
            <div className="space-y-3">
              {filteredVacancies.map((vacancy) => (
                <VacancyCard key={vacancy.id} vacancy={vacancy} />
              ))}
            </div>
          ) : (
            <div className="bg-white border border-surface-border rounded-lg p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-navy-900">No recruitment vacancies found</h3>
              <p className="text-xs text-textColor-secondary max-w-md mx-auto">
                We couldn&apos;t find any active vacancies matching your current filter criteria. Try clearing some filters or searching for broader terms.
              </p>
              <button
                onClick={clearFilters}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-navy-500 hover:bg-blue-600 rounded transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          )}

          {/* Pagination Mock */}
          {filteredVacancies.length > 0 && (
            <div className="pt-4 flex items-center justify-between border-t border-slate-200 text-xs">
              <button disabled className="px-3 py-1.5 border border-slate-200 rounded text-slate-400 cursor-not-allowed">
                Previous
              </button>
              <span className="text-slate-600 font-medium">Page 1 of 1</span>
              <button disabled className="px-3 py-1.5 border border-slate-200 rounded text-slate-400 cursor-not-allowed">
                Next
              </button>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
