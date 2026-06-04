import React, { useState } from 'react';
import { mockJobs } from '../data/mockData';
import { JobCard } from '../components/JobCard';
import { SearchIcon, FilterIcon } from 'lucide-react';
export function ApplicantJobList() {
  const [searchTerm, setSearchTerm] = useState('');
  // Only show open jobs to applicants
  const openJobs = mockJobs.filter((job) => job.status === 'Open');
  const filteredJobs = openJobs.filter((job) => {
    const matchesSearch =
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.skills.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSearch;
  });
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8 text-center max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 mb-3">
          Available Job Posts
        </h1>
        <p className="text-slate-600">
          Find your next career opportunity. Browse our open positions and apply
          easily.
        </p>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-8 max-w-3xl mx-auto flex flex-col sm:flex-row gap-3">
        <div className="relative flex-grow">
          <SearchIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by job title or skill..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full" />
          
        </div>
        <button className="flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors whitespace-nowrap">
          <FilterIcon className="w-4 h-4" />
          Filters
        </button>
      </div>

      {filteredJobs.length > 0 ?
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job) =>
        <JobCard key={job.id} job={job} isApplicantView={true} />
        )}
        </div> :

      <div className="text-center py-16 bg-white rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-medium text-slate-900 mb-1">
            No jobs found
          </h3>
          <p className="text-sm text-slate-500">
            We couldn't find any open positions matching your search.
          </p>
          <button
          onClick={() => setSearchTerm('')}
          className="mt-4 text-indigo-600 font-medium hover:text-indigo-700 text-sm">
          
            Clear search
          </button>
        </div>
      }
    </div>);

}