import React, { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockJobs } from '../data/mockData';
import { SkillTag } from '../components/SkillTag';
import {
  ArrowLeftIcon,
  UploadCloudIcon,
  FileIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  XIcon } from
'lucide-react';
export function ApplyJob() {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const job = mockJobs.find((j) => j.id === id) || mockJobs[0];
  const isClosed =
  new Date(job.closingDate) < new Date() || job.status !== 'Open';
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!isClosed) setIsDragging(true);
  };
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  const validateFile = (selectedFile: File) => {
    const validTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (!validTypes.includes(selectedFile.type)) {
      setError('Please select a valid file (PDF or Image only)');
      return false;
    }
    if (selectedFile.size > 5 * 1024 * 1024) {
      // 5MB limit
      setError('File size should be less than 5MB');
      return false;
    }
    setError('');
    return true;
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (isClosed) return;
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      if (validateFile(droppedFile)) {
        setFile(droppedFile);
      }
    }
  };
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (validateFile(selectedFile)) {
        setFile(selectedFile);
      }
    }
  };
  const handleSubmit = () => {
    if (!file) {
      setError('Please upload your CV first');
      return;
    }
    setIsSubmitting(true);
    // Simulate upload
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1500);
  };
  if (isSuccess) {
    return (
      <div className="p-6 max-w-2xl mx-auto mt-10">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 text-center">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircleIcon className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Application Submitted!
          </h2>
          <p className="text-slate-600 mb-6">
            Your CV was uploaded successfully for the{' '}
            <span className="font-medium text-slate-900">{job.title}</span>{' '}
            position. We will review your application and get back to you soon.
          </p>
          <button
            onClick={() => navigate('/jobs')}
            className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
            
            Back to Jobs
          </button>
        </div>
      </div>);

  }
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <button
        onClick={() => navigate('/jobs')}
        className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 mb-6 transition-colors">
        
        <ArrowLeftIcon className="w-4 h-4" />
        Back to Jobs
      </button>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-6">
        <div className="p-6 border-b border-slate-200 bg-slate-50/50">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            Apply for {job.title}
          </h1>
          <div className="flex flex-wrap gap-2 mt-3">
            {job.skills.map((skill) =>
            <SkillTag key={skill} skill={skill} />
            )}
          </div>
        </div>

        <div className="p-6 sm:p-8">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Upload your CV
          </h3>

          {isClosed ?
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-6 text-center">
              <AlertCircleIcon className="w-10 h-10 text-rose-500 mx-auto mb-3" />
              <h4 className="text-lg font-medium text-rose-900 mb-1">
                Applications Closed
              </h4>
              <p className="text-sm text-rose-700">
                Applications are now closed for this job. You can no longer
                submit a CV.
              </p>
            </div> :

          <>
              <div
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-slate-300 hover:border-indigo-400 bg-slate-50/50'}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => !file && fileInputRef.current?.click()}>
              
                <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept=".pdf,image/jpeg,image/png"
                onChange={handleFileSelect} />
              

                {file ?
              <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-slate-200 shadow-sm max-w-md mx-auto">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center shrink-0">
                        <FileIcon className="w-5 h-5" />
                      </div>
                      <div className="text-left overflow-hidden">
                        <p className="text-sm font-medium text-slate-900 truncate">
                          {file.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setFile(null);
                  }}
                  className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-md transition-colors">
                  
                      <XIcon className="w-5 h-5" />
                    </button>
                  </div> :

              <div className="cursor-pointer">
                    <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <UploadCloudIcon className="w-7 h-7" />
                    </div>
                    <p className="text-sm font-medium text-slate-900 mb-1">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-slate-500">
                      PDF or Image only (max. 5MB)
                    </p>
                  </div>
              }
              </div>

              {error &&
            <p className="mt-3 text-sm text-rose-600 flex items-center gap-1.5">
                  <AlertCircleIcon className="w-4 h-4" />
                  {error}
                </p>
            }

              <div className="mt-8 flex justify-end">
                <button
                onClick={handleSubmit}
                disabled={!file || isSubmitting}
                className="bg-indigo-600 text-white px-8 py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed shadow-sm flex items-center gap-2">
                
                  {isSubmitting ? 'Uploading...' : 'Submit Application'}
                </button>
              </div>
            </>
          }
        </div>
      </div>
    </div>);

}