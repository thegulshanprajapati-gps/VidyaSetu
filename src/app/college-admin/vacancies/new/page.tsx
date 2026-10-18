'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Briefcase, 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  Save, 
  Send, 
  Calendar, 
  FileText, 
  ExternalLink, 
  ShieldCheck, 
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import TiptapEditor from '@/components/editor/TiptapEditor';

export default function NewVacancyPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [submittedAlert, setSubmittedAlert] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Vacancy Form State
  const [formData, setFormData] = useState({
    title: '',
    department: '',
    postName: '',
    numberOfPosts: 1,
    jobCategory: 'TEACHING',
    employmentType: 'PERMANENT',
    qualification: '',
    experience: '',
    ageCriteria: '',
    notificationDate: '',
    applicationOpenDate: '',
    applicationCloseDate: '',
    interviewDate: '',
    salary: '',
    applicationFee: '',
    applicationMode: 'ONLINE',
    descriptionHtml: '<p>Enter detailed recruitment responsibilities, syllabus, and selection process...</p>',
    notificationPdfUrl: '',
    officialApplyUrl: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditorChange = (html: string) => {
    setFormData(prev => ({ ...prev, descriptionHtml: html }));
  };

  const handleNext = () => {
    if (currentStep < 6) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async (action: 'DRAFT' | 'SUBMIT') => {
    try {
      if (!formData.title || !formData.department || !formData.postName) {
        setErrorMessage('Please fill in Vacancy Title, Department, and Post Designation before submitting.');
        setCurrentStep(1);
        return;
      }
      if (!formData.qualification) {
        setErrorMessage('Please enter Essential Qualification in Step 2.');
        setCurrentStep(2);
        return;
      }
      if (!formData.applicationCloseDate) {
        setErrorMessage('Please specify the Application Last Date in Step 3.');
        setCurrentStep(3);
        return;
      }

      setSubmitting(true);
      setErrorMessage(null);

      const res = await fetch('/api/vacancies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          action,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSubmittedAlert(true);
        setTimeout(() => {
          router.push('/college-admin');
        }, 1500);
      } else {
        setErrorMessage(data.error || 'Failed to submit vacancy to PostgreSQL');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Network error submitting vacancy');
    } finally {
      setSubmitting(false);
    }
  };

  const steps = [
    { number: 1, label: 'Basic Info' },
    { number: 2, label: 'Eligibility' },
    { number: 3, label: 'Dates & Pay' },
    { number: 4, label: 'Description (Tiptap)' },
    { number: 5, label: 'Official Links' },
    { number: 6, label: 'Preview & Submit' },
  ];

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-navy-900 tracking-tight">
            Create Recruitment Vacancy
          </h1>
          <p className="text-xs text-textColor-secondary">
            Post an official teaching, technical, or administrative vacancy for moderation review.
          </p>
        </div>
        <Link
          href="/college-admin"
          className="text-xs font-semibold text-slate-600 hover:text-navy-900"
        >
          Cancel
        </Link>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-lg bg-rose-50 border border-rose-200 text-rose-900 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {submittedAlert && (
        <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Vacancy successfully submitted to Platform Admin moderation queue in PostgreSQL! Redirecting...</span>
        </div>
      )}

      {/* Stepper Wizard Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-3 sm:p-4 shadow-xs">
        {/* Mobile Step Status */}
        <div className="sm:hidden space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-navy-900">
              Step {currentStep} of 6: {steps[currentStep - 1].label}
            </span>
            <span className="font-semibold text-blue-600">
              {Math.round((currentStep / 6) * 100)}% Complete
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 6) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Desktop Step Items */}
        <div className="hidden sm:grid grid-cols-6 gap-2">
          {steps.map((s) => {
            const isDone = currentStep > s.number;
            const isCurrent = currentStep === s.number;
            return (
              <button
                key={s.number}
                type="button"
                onClick={() => {
                  if (isDone || isCurrent) {
                    setCurrentStep(s.number);
                  }
                }}
                disabled={!isDone && !isCurrent}
                className={`p-2.5 rounded-lg text-xs font-semibold flex items-center gap-2 text-left transition-all ${
                  isCurrent 
                    ? 'bg-blue-50 text-blue-800 border border-blue-300 shadow-2xs' 
                    : isDone 
                    ? 'text-emerald-800 bg-emerald-50 hover:bg-emerald-100/80 cursor-pointer' 
                    : 'text-slate-400 bg-slate-50 opacity-70 cursor-not-allowed'
                }`}
              >
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${
                  isCurrent 
                    ? 'bg-blue-600 text-white shadow-xs' 
                    : isDone 
                    ? 'bg-emerald-600 text-white' 
                    : 'bg-slate-200 text-slate-500'
                }`}>
                  {isDone ? <Check className="w-3.5 h-3.5" /> : s.number}
                </span>
                <span className="truncate leading-tight font-medium text-[11px]">{s.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Form Container */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-8 shadow-xs">
        
        {/* Step 1: Basic Information */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h2 className="text-sm font-bold text-navy-900 uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                <span>Step 1: General Vacancy Information</span>
              </h2>
              <span className="text-[11px] font-semibold text-slate-500">Fields with * are mandatory</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-1">
              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Vacancy Notice Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Assistant Professor (Computer Science & Engineering)"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Department / Branch <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="department"
                  required
                  value={formData.department}
                  onChange={handleChange}
                  placeholder="e.g. Civil Engineering"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Post Designation <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="postName"
                  required
                  value={formData.postName}
                  onChange={handleChange}
                  placeholder="e.g. Assistant Professor / Guest Lecturer"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Number of Vacancies</label>
                <input
                  type="number"
                  name="numberOfPosts"
                  value={formData.numberOfPosts}
                  onChange={handleChange}
                  min={1}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Job Category <span className="text-rose-500">*</span>
                </label>
                <select
                  name="jobCategory"
                  value={formData.jobCategory}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all font-medium"
                >
                  <option value="TEACHING">Teaching / Faculty</option>
                  <option value="TECHNICAL">Technical & Lab Support</option>
                  <option value="ADMINISTRATIVE">Administrative & Officers</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Employment Nature <span className="text-rose-500">*</span>
                </label>
                <select
                  name="employmentType"
                  value={formData.employmentType}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all font-medium"
                >
                  <option value="PERMANENT">Permanent / Regular</option>
                  <option value="CONTRACTUAL">Contractual</option>
                  <option value="GUEST_FACULTY">Guest Faculty / Walk-in</option>
                  <option value="TEMPORARY">Temporary</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Application Mode <span className="text-rose-500">*</span>
                </label>
                <select
                  name="applicationMode"
                  value={formData.applicationMode}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all font-medium"
                >
                  <option value="ONLINE">Online Portal</option>
                  <option value="OFFLINE">Offline / Postal Application</option>
                  <option value="WALK_IN">Walk-in Interview</option>
                  <option value="EMAIL">Email Submission</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Eligibility */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h2 className="text-sm font-bold text-navy-900 uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                <span>Step 2: Educational & Professional Eligibility</span>
              </h2>
              <span className="text-[11px] font-semibold text-slate-500">Provide clear criteria for applicants</span>
            </div>

            <div className="space-y-5 pt-1">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Essential Educational Qualification <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  name="qualification"
                  required
                  value={formData.qualification}
                  onChange={handleChange}
                  placeholder="e.g. B.Tech and M.Tech in relevant branch with 1st Class or equivalent. Ph.D. preferred."
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Required Experience
                </label>
                <textarea
                  rows={2}
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  placeholder="e.g. 2 years post-qualification teaching or industrial experience."
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Age Limit & Relaxation Criteria
                </label>
                <input
                  type="text"
                  name="ageCriteria"
                  value={formData.ageCriteria}
                  onChange={handleChange}
                  placeholder="e.g. Maximum 37 years for unreserved candidates as per Bihar Govt norms."
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all font-medium"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Dates & Compensation */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h2 className="text-sm font-bold text-navy-900 uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                <span>Step 3: Dates & Financial Information</span>
              </h2>
              <span className="text-[11px] font-semibold text-slate-500">Recruitment timeline & remuneration</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-1">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Official Notification Date <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  name="notificationDate"
                  required
                  value={formData.notificationDate}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Application Opening Date <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  name="applicationOpenDate"
                  required
                  value={formData.applicationOpenDate}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Application Closing Date <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  name="applicationCloseDate"
                  required
                  value={formData.applicationCloseDate}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all font-bold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Interview / Exam Date (if fixed)
                </label>
                <input
                  type="date"
                  name="interviewDate"
                  value={formData.interviewDate}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Pay Scale / Honorarium</label>
                <input
                  type="text"
                  name="salary"
                  value={formData.salary}
                  onChange={handleChange}
                  placeholder="e.g. Level 10 (Rs. 57,700 - 1,82,400) or Rs. 1500/lecture"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Application Fee Details</label>
                <input
                  type="text"
                  name="applicationFee"
                  value={formData.applicationFee}
                  onChange={handleChange}
                  placeholder="e.g. Rs. 500 (General) / Rs. 150 (SC/ST)"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all font-medium"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Tiptap Rich Description */}
        {currentStep === 4 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h2 className="text-sm font-bold text-navy-900 uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                <span>Step 4: Detailed Instructions & Syllabus (Rich Editor)</span>
              </h2>
              <span className="text-[11px] text-blue-600 font-semibold bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                WYSIWYG Mode
              </span>
            </div>

            <p className="text-xs text-slate-600">
              Use the toolbar below to format recruitment responsibilities, documents required, and selection criteria.
            </p>

            <TiptapEditor
              initialContent={formData.descriptionHtml}
              onChange={handleEditorChange}
            />
          </div>
        )}

        {/* Step 5: Official Links & Media */}
        {currentStep === 5 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h2 className="text-sm font-bold text-navy-900 uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                <span>Step 5: Official Circular PDF & Direct Apply URLs</span>
              </h2>
              <span className="text-[11px] font-semibold text-slate-500">Public candidate access links</span>
            </div>

            <div className="space-y-5 pt-1">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Official Notification PDF Link</label>
                <input
                  type="url"
                  name="notificationPdfUrl"
                  value={formData.notificationPdfUrl}
                  onChange={handleChange}
                  placeholder="https://mitmuzaffarpur.org/recruitment-2026.pdf"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all font-medium"
                />
                <span className="text-[11px] text-slate-500 block">Direct candidates to your signed PDF circular or gazette notification.</span>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Official Online Application URL</label>
                <input
                  type="url"
                  name="officialApplyUrl"
                  value={formData.officialApplyUrl}
                  onChange={handleChange}
                  placeholder="https://mitmuzaffarpur.org/apply-online"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all font-medium"
                />
                <span className="text-[11px] text-slate-500 block">Link to institutional application portal or Google Form.</span>
              </div>
            </div>
          </div>
        )}

        {/* Step 6: Live Preview & Submission */}
        {currentStep === 6 && (
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-navy-900 pb-2 border-b border-slate-100 uppercase tracking-wider">
              Step 6: Review & Choose Publishing Action
            </h2>

            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <div className="font-bold text-navy-900 text-sm">{formData.title || 'Untitled Vacancy'}</div>
              <div className="text-slate-600">
                {formData.department} • {formData.jobCategory} • {formData.employmentType}
              </div>
              <div className="text-slate-600">
                Last Date: <strong>{formData.applicationCloseDate || 'Not set'}</strong> | Mode: <strong>{formData.applicationMode}</strong>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-blue-50 border border-blue-200 text-xs text-blue-900 space-y-1">
              <div className="font-bold">Moderation Policy Notice:</div>
              <p>
                Once submitted for review, the notice will appear in the Platform Super Admin moderation queue. It will go live publicly across Bihar as soon as verified.
              </p>
            </div>
          </div>
        )}

        {/* Wizard Footer Controls */}
        <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center gap-1.5 px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-navy-900 hover:bg-slate-50"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : <div></div>}

          {currentStep < 6 ? (
            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center gap-1.5 px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow-xs"
            >
              <span>Continue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={submitting}
                onClick={() => handleSubmit('DRAFT')}
                className="inline-flex items-center gap-1.5 px-4 py-2 border border-slate-300 bg-white hover:bg-slate-50 text-navy-900 rounded-lg text-xs font-semibold shadow-2xs disabled:opacity-50"
              >
                <Save className="w-4 h-4 text-slate-500" />
                <span>{submitting ? 'Saving...' : 'Save Draft'}</span>
              </button>
              <button
                type="button"
                disabled={submitting}
                onClick={() => handleSubmit('SUBMIT')}
                className="inline-flex items-center gap-1.5 px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-sm disabled:opacity-50"
              >
                <Send className={`w-4 h-4 ${submitting ? 'animate-spin' : ''}`} />
                <span>{submitting ? 'Submitting to PostgreSQL...' : 'Submit for Review'}</span>
              </button>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
