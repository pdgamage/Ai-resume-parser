import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockJobs, mockResults } from '../data/mockData';
import { FairnessPanel } from '../components/FairnessPanel';
import { CandidateResultCard } from '../components/CandidateResultCard';
import { ArrowLeftIcon, DownloadIcon, UsersIcon } from 'lucide-react';
export function ShortlistResults() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const job = mockJobs.find((j) => j.id === jobId) || mockJobs[0];
  const results = mockResults.
  filter((r) => r.jobId === job.id).
  sort((a, b) => a.rank - b.rank);
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <button
        onClick={() => navigate(`/jobs/${job.id}`)}
        className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 mb-6 transition-colors">
        
        <ArrowLeftIcon className="w-4 h-4" />
        Back to Job Details
      </button>

      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Shortlisting Results
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            AI analysis for{' '}
            <span className="font-medium text-slate-700">{job.title}</span>
          </p>
        </div>

        <button className="inline-flex items-center gap-2 bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm">
          <DownloadIcon className="w-4 h-4" />
          Export Report
        </button>
      </div>

      <FairnessPanel />

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-6">
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
            <UsersIcon className="w-5 h-5 text-indigo-500" />
            Best Matched Candidates
          </h2>
          <span className="text-sm font-medium text-slate-500">
            Showing {results.length} results
          </span>
        </div>

        <div className="p-5 sm:p-6 bg-slate-50">
          {results.length > 0 ?
          <div className="space-y-4">
              {results.map((result) =>
            <CandidateResultCard key={result.id} result={result} />
            )}
            </div> :

          <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
              <UsersIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-slate-900">
                No results found
              </h3>
              <p className="text-sm text-slate-500 mt-1">
                There are no shortlisted candidates for this job yet.
              </p>
            </div>
          }
        </div>
      </div>

      <div className="text-center text-xs text-slate-400 mt-8">
        <p>Ranking is based only on job-related qualifications.</p>
        <p>
          Sensitive personal details were not used for scoring. This result is
          provided to support HR decision-making.
        </p>
      </div>
    </div>);

}