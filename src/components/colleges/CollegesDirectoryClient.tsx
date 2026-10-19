'use client';

import React, { useState, useMemo } from 'react';
import CollegeCard from '@/components/colleges/CollegeCard';
import { Search, Building2, X } from 'lucide-react';

interface Props {
  initialColleges: any[];
}

export default function CollegesDirectoryClient({ initialColleges }: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedOwnership, setSelectedOwnership] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');

  const filteredColleges = useMemo(() => {
    return initialColleges.filter((col) => {
      // Must be approved for public directory
      if (col.verificationStatus !== 'APPROVED') return false;

      // Keyword
      if (searchTerm) {
        const query = searchTerm.toLowerCase();
        const matchesName = col.name?.toLowerCase().includes(query);
        const matchesCity = col.city?.toLowerCase().includes(query);
        const matchesDistrict = col.district?.toLowerCase().includes(query);
        const matchesAffil = (col.affiliationInfo || '').toLowerCase().includes(query);
        if (!matchesName && !matchesCity && !matchesDistrict && !matchesAffil) return false;
      }

      // Type
      if (selectedType && col.institutionType !== selectedType) return false;

      // Ownership
      if (selectedOwnership && col.ownershipType !== selectedOwnership) return false;

      // District
      if (selectedDistrict && col.district !== selectedDistrict) return false;

      return true;
    });
  }, [initialColleges, searchTerm, selectedType, selectedOwnership, selectedDistrict]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedType('');
    setSelectedOwnership('');
    setSelectedDistrict('');
  };

  const hasActiveFilters = searchTerm || selectedType || selectedOwnership || selectedDistrict;

  // Extract unique districts from live colleges
  const availableDistricts = useMemo(() => {
    const set = new Set<string>();
    initialColleges.forEach(c => {
      if (c.district) set.add(c.district);
    });
    return Array.from(set).sort();
  }, [initialColleges]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="pb-4 border-b border-surface-border space-y-2">
        <div className="flex items-center gap-2">
          <Building2 className="w-6 h-6 text-blue-600" />
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight">
            Verified Institutions Directory
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-textColor-secondary">
          Explore officially approved polytechnics, engineering colleges, and universities across Bihar.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-lg border border-surface-border shadow-2xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search college name, district, or affiliation..."
              className="w-full pl-8 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:border-blue-500"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
          </div>

          {/* Institution Type */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-md text-slate-700 focus:outline-none focus:border-blue-500"
          >
            <option value="">All Institution Types</option>
            <option value="ENGINEERING">Engineering Colleges</option>
            <option value="POLYTECHNIC">Polytechnic Colleges</option>
            <option value="DEGREE">Degree Colleges</option>
            <option value="UNIVERSITY">Universities</option>
          </select>

          {/* Ownership */}
          <select
            value={selectedOwnership}
            onChange={(e) => setSelectedOwnership(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-md text-slate-700 focus:outline-none focus:border-blue-500"
          >
            <option value="">All Ownership Types</option>
            <option value="GOVERNMENT">Government / State-Funded</option>
            <option value="AIDED">Aided / Autonomous</option>
            <option value="PRIVATE">Private Recognized</option>
          </select>

          {/* District */}
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-md text-slate-700 focus:outline-none focus:border-blue-500"
          >
            <option value="">All Districts</option>
            {availableDistricts.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>

        </div>

        {hasActiveFilters && (
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
            <span className="text-slate-500">Filtered results ({filteredColleges.length} institutions)</span>
            <button
              onClick={clearFilters}
              className="text-rose-600 hover:underline font-semibold flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" />
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Grid of Colleges */}
      {filteredColleges.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredColleges.map((college) => (
            <CollegeCard key={college.id} college={college} />
          ))}
        </div>
      ) : (
        <div className="bg-white border border-surface-border rounded-lg p-12 text-center space-y-3">
          <Building2 className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-navy-900">No verified colleges found</h3>
          <p className="text-xs text-textColor-secondary max-w-sm mx-auto">
            Try adjusting your search criteria or clear filters to view all registered institutions.
          </p>
          <button
            onClick={clearFilters}
            className="px-4 py-1.5 text-xs font-semibold text-white bg-navy-500 hover:bg-blue-600 rounded transition-colors"
          >
            View All Institutions
          </button>
        </div>
      )}

    </div>
  );
}
