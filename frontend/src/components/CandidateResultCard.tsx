import React, { useState } from 'react';
import { ShortlistResult } from '../data/mockData';
import { SkillTag } from './SkillTag';
import {
  ChevronDownIcon,
  ChevronUpIcon,
  AwardIcon,
  CheckCircleIcon,
  AlertTriangleIcon,
  GraduationCapIcon,
  BriefcaseIcon } from
'lucide-react';
interface CandidateResultCardProps {
  result: ShortlistResult;
}
export function CandidateResultCard({ result }: CandidateResultCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (score >= 70) return 'text-indigo-600 bg-indigo-50 border-indigo-200';
    if (score >= 50) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-rose-600 bg-rose-50 border-rose-200';
  };
  const getProgressBarColor = (score: number) => {
    if (score >= 85) return 'bg-emerald-500';
    if (score >= 70) return 'bg-indigo-500';
    if (score >= 50) return 'bg-amber-500';
    return 'bg-rose-500';
  };
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-4 transition-all duration-200 hover:shadow-md">
      <div
        className="p-5 flex flex-col sm:flex-row sm:items-center gap-4 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}>
        
        <div className="flex items-center gap-4 flex-grow">
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-700 shrink-0 border border-slate-200">
            #{result.rank}
          </div>

          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              {result.applicantName}
              {result.isRecommended &&
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                  <AwardIcon className="w-3 h-3" />
                  Top Match
                </span>
              }
            </h3>
            <div className="flex items-center gap-3 mt-1 text-sm text-slate-500">
              <span className="flex items-center gap-1">
                <GraduationCapIcon className="w-3.5 h-3.5" />
                {result.educationMatch.split(' ')[0]}
              </span>
              <span className="w-1 h-1 rounded-full bg-slate-300"></span>
              <span className="flex items-center gap-1">
                <BriefcaseIcon className="w-3.5 h-3.5" />
                {result.experienceMatch.split(' ')[0]}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6 sm:w-1/3 justify-between sm:justify-end">
          <div className="flex flex-col items-end gap-1 w-full max-w-[150px]">
            <div className="flex justify-between w-full text-sm font-medium">
              <span className="text-slate-600">Match Score</span>
              <span className={getScoreColor(result.matchScore).split(' ')[0]}>
                {result.matchScore}%
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full rounded-full ${getProgressBarColor(result.matchScore)}`}
                style={{
                  width: `${result.matchScore}%`
                }}>
              </div>
            </div>
          </div>

          <button className="p-1 text-slate-400 hover:text-slate-600 transition-colors">
            {isExpanded ?
            <ChevronUpIcon className="w-5 h-5" /> :

            <ChevronDownIcon className="w-5 h-5" />
            }
          </button>
        </div>
      </div>

      {isExpanded &&
      <div className="px-5 pb-5 pt-2 border-t border-slate-100 bg-slate-50/50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-3">
            <div>
              <h4 className="text-sm font-semibold text-slate-900 mb-2 flex items-center gap-1.5">
                <CheckCircleIcon className="w-4 h-4 text-emerald-500" />
                Matched Skills
              </h4>
              <div className="flex flex-wrap gap-2">
                {result.skillsMatched.map((skill) =>
              <SkillTag key={skill} skill={skill} />
              )}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-slate-900 mb-2 flex items-center gap-1.5">
                <AlertTriangleIcon className="w-4 h-4 text-indigo-500" />
                AI Explanation
              </h4>
              <p className="text-sm text-slate-600 leading-relaxed bg-white p-3 rounded-lg border border-slate-200">
                {result.explanation}
              </p>
            </div>
          </div>

          <div className="mt-5 flex justify-end gap-3">
            <button className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
              View Full CV
            </button>
            <button className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm">
              Contact Candidate
            </button>
          </div>
        </div>
      }
    </div>);

}