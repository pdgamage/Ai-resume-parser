import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BriefcaseIcon,
  UsersIcon,
  CheckCircleIcon,
  ClockIcon,
  SearchIcon,
  PlusIcon,
  FilterIcon } from
'lucide-react';
import { mockJobs, JobStatus } from '../data/mockData';
import { JobCard } from '../components/JobCard';
import { SummaryStatCard } from '../components/SummaryStatCard';
export function HRDashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<JobStatus | 'All'>('All');
  const filteredJobs = mockJobs.filter((job) => {
    const matchesSearch = job.title.
    toLowerCase().
    includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || job.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
  const totalJobs = mockJobs.length;
  const openJobs = mockJobs.filter((j) => j.status === 'Open').length;
  const totalCVs = mockJobs.reduce((acc, job) => acc + job.cvCount, 0);
  const shortlistedJobs = mockJobs.filter(
    (j) => j.status === 'Completed'
  ).length;
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">HR Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your job posts and review applicants.
          </p>
        </div>
        <Link
          to="/jobs/create"
          className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm">
          
          <PlusIcon className="w-4 h-4" />
          Create New Job
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <SummaryStatCard
          title="Total Jobs"
          value={totalJobs}
          icon={BriefcaseIcon} />
        
        <SummaryStatCard title="Open Jobs" value={openJobs} icon={ClockIcon} />
        <SummaryStatCard
          title="CVs Received"
          value={totalCVs}
          icon={UsersIcon}
          trend="+12%"
          trendUp={true} />
        
        <SummaryStatCard
          title="Shortlisted"
          value={shortlistedJobs}
          icon={CheckCircleIcon} />
        
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-slate-900">Job Posts</h2>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <SearchIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search jobs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full sm:w-64" />
              
            </div>

            <div className="relative">
              <FilterIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="pl-9 pr-8 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none bg-white">
                
                <option value="All">All Status</option>
                <option value="Open">Open</option>
                <option value="Processing">Processing</option>
                <option value="Completed">Completed</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
          </div>
        </div>

        <div className="p-6 bg-slate-50/50">
          {filteredJobs.length > 0 ?
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredJobs.map((job) =>
            <JobCard key={job.id} job={job} />
            )}
            </div> :

          <div className="text-center py-12">
              <BriefcaseIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-slate-900">
                No jobs found
              </h3>
              <p className="text-sm text-slate-500 mt-1">
                Try adjusting your search or filters.
              </p>
            </div>
          }
        </div>
      </div>
    </div>);

}