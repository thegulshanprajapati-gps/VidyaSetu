'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Building2, 
  UserCheck, 
  FileCheck, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  ShieldAlert, 
  UploadCloud,
  Check
} from 'lucide-react';

export default function CollegeRegisterPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);

  // Form states
  const [formData, setFormData] = useState({
    // Step 1
    collegeName: '',
    institutionType: 'ENGINEERING',
    ownershipType: 'GOVERNMENT',
    state: 'Bihar',
    district: 'Patna',
    city: '',
    address: '',
    officialWebsite: '',
    officialEmail: '',
    officialPhone: '',
    establishmentYear: '',
    affiliationInfo: '',
    
    // Step 2
    adminName: '',
    adminDesignation: '',
    adminEmail: '',
    adminPhone: '',
    isAuthorized: false,

    // Step 3
    evidenceType: 'AFFILIATION_ORDER',
    referenceNumber: '',
    additionalNotes: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleNext = () => {
    if (currentStep < 4) {
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

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await fetch('/api/college-registration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
    } catch (err) {
      console.error('Registration submission failed:', err);
    } finally {
      setIsSubmitting(false);
      router.push('/college-register/pending');
    }
  };

  const steps = [
    { number: 1, label: 'Institution Info', icon: Building2 },
    { number: 2, label: 'Administrator', icon: UserCheck },
    { number: 3, label: 'Verification Proof', icon: FileCheck },
    { number: 4, label: 'Review & Submit', icon: CheckCircle2 },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Title */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-black text-navy-900 tracking-tight">
          Register Educational Institution
        </h1>
        <p className="text-xs sm:text-sm text-textColor-secondary max-w-xl mx-auto">
          Submit official institutional credentials for platform administrator vetting. Approved colleges receive isolated content management workspaces.
        </p>
      </div>

      {/* Stepper Wizard Bar */}
      <div className="grid grid-cols-4 gap-2 border-b border-surface-border pb-4">
        {steps.map((s) => {
          const Icon = s.icon;
          const isDone = currentStep > s.number;
          const isCurrent = currentStep === s.number;
          return (
            <div 
              key={s.number}
              className={`flex items-center gap-2 p-2 rounded-lg text-xs font-semibold ${
                isCurrent 
                  ? 'bg-blue-50 text-blue-800 border border-blue-200' 
                  : isDone 
                  ? 'text-emerald-700 bg-emerald-50'
                  : 'text-slate-400'
              }`}
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                isCurrent 
                  ? 'bg-blue-600 text-white' 
                  : isDone 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-slate-200 text-slate-600'
              }`}>
                {isDone ? <Check className="w-3.5 h-3.5" /> : s.number}
              </div>
              <span className="hidden sm:inline truncate">{s.label}</span>
            </div>
          );
        })}
      </div>

      {/* Form Card */}
      <div className="bg-white border border-surface-border rounded-xl p-6 sm:p-8 shadow-xs">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* STEP 1: Institution Details */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <h2 className="text-base font-bold text-navy-900 pb-2 border-b border-slate-100 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-600" />
                <span>Step 1: Institutional Credentials</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-semibold text-navy-900">
                    Official College / Institution Name *
                  </label>
                  <input
                    type="text"
                    name="collegeName"
                    required
                    value={formData.collegeName}
                    onChange={handleChange}
                    placeholder="e.g. Government Engineering College, Vaishali"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-navy-900">Institution Category *</label>
                  <select
                    name="institutionType"
                    value={formData.institutionType}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                  >
                    <option value="ENGINEERING">Engineering College</option>
                    <option value="POLYTECHNIC">Polytechnic College</option>
                    <option value="DEGREE">Degree College</option>
                    <option value="UNIVERSITY">State / Central University</option>
                    <option value="MEDICAL">Medical & Paramedical</option>
                    <option value="OTHER">Other Technical Institute</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-navy-900">Ownership Structure *</label>
                  <select
                    name="ownershipType"
                    value={formData.ownershipType}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                  >
                    <option value="GOVERNMENT">Government / State Funded</option>
                    <option value="AIDED">Government Aided / Autonomous</option>
                    <option value="PRIVATE">Private Recognized</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-navy-900">State *</label>
                  <input
                    type="text"
                    name="state"
                    disabled
                    value={formData.state}
                    className="w-full px-3 py-2 text-xs bg-slate-100 border border-slate-200 rounded-lg text-slate-600 font-semibold cursor-not-allowed"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-navy-900">District *</label>
                  <select
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                  >
                    <option value="Patna">Patna</option>
                    <option value="Muzaffarpur">Muzaffarpur</option>
                    <option value="Bhagalpur">Bhagalpur</option>
                    <option value="Gaya">Gaya</option>
                    <option value="Nalanda">Nalanda</option>
                    <option value="Darbhanga">Darbhanga</option>
                    <option value="Vaishali">Vaishali</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-navy-900">City / Locality *</label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="e.g. Hajipur"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-navy-900">Establishment Year</label>
                  <input
                    type="number"
                    name="establishmentYear"
                    value={formData.establishmentYear}
                    onChange={handleChange}
                    placeholder="e.g. 2018"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-semibold text-navy-900">Full Institutional Postal Address *</label>
                  <textarea
                    rows={2}
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Campus address with PIN code..."
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-navy-900">Official Institutional Website</label>
                  <input
                    type="url"
                    name="officialWebsite"
                    value={formData.officialWebsite}
                    onChange={handleChange}
                    placeholder="https://www.college.ac.in"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-navy-900">Official Contact Email *</label>
                  <input
                    type="email"
                    name="officialEmail"
                    required
                    value={formData.officialEmail}
                    onChange={handleChange}
                    placeholder="principal@college.edu.in"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-navy-900">Official Landline / Mobile *</label>
                  <input
                    type="tel"
                    name="officialPhone"
                    required
                    value={formData.officialPhone}
                    onChange={handleChange}
                    placeholder="+91 612 0000000"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-navy-900">Affiliation / Approval Reference</label>
                  <input
                    type="text"
                    name="affiliationInfo"
                    value={formData.affiliationInfo}
                    onChange={handleChange}
                    placeholder="e.g. BEU Patna & AICTE Approved"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Authorized Administrator */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <h2 className="text-base font-bold text-navy-900 pb-2 border-b border-slate-100 flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-blue-600" />
                <span>Step 2: Authorized Institution Representative</span>
              </h2>

              <p className="text-xs text-textColor-secondary">
                Provide details of the authorized Principal, Registrar, or Nodal Officer who will hold master administrative privileges for this institution.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-navy-900">Administrator Full Name *</label>
                  <input
                    type="text"
                    name="adminName"
                    required
                    value={formData.adminName}
                    onChange={handleChange}
                    placeholder="Dr. Rajesh Kumar Sharma"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-navy-900">Designation / Role *</label>
                  <input
                    type="text"
                    name="adminDesignation"
                    required
                    value={formData.adminDesignation}
                    onChange={handleChange}
                    placeholder="Principal / Registrar / Nodal Officer"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-navy-900">Official Work Email *</label>
                  <input
                    type="email"
                    name="adminEmail"
                    required
                    value={formData.adminEmail}
                    onChange={handleChange}
                    placeholder="admin.nodal@college.edu.in"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-navy-900">Direct Contact Number *</label>
                  <input
                    type="tel"
                    name="adminPhone"
                    required
                    value={formData.adminPhone}
                    onChange={handleChange}
                    placeholder="+91 9800000000"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="p-4 rounded-lg bg-blue-50 border border-blue-200 space-y-2 mt-4">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isAuthorized"
                    checked={formData.isAuthorized}
                    onChange={handleChange}
                    className="mt-0.5 rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-xs text-navy-900 font-medium leading-relaxed">
                    I confirm that I am officially authorized by the competent institutional authority to represent this institution and post recruitment notifications.
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* STEP 3: Verification Evidence */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <h2 className="text-base font-bold text-navy-900 pb-2 border-b border-slate-100 flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-blue-600" />
                <span>Step 3: Verification Evidence</span>
              </h2>

              <p className="text-xs text-textColor-secondary">
                To prevent unauthorized recruitment postings, please specify institutional accreditation or authorization evidence.
              </p>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-navy-900">Evidence Category *</label>
                  <select
                    name="evidenceType"
                    value={formData.evidenceType}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                  >
                    <option value="AFFILIATION_ORDER">State University Affiliation Order</option>
                    <option value="AICTE_APPROVAL">AICTE / UGC Recognition Order</option>
                    <option value="GOVT_NOTIFICATION">Department of Science & Tech Notification</option>
                    <option value="OFFICIAL_LETTER">Head of Institution Authorization Letter</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-navy-900">Reference / Order Number</label>
                  <input
                    type="text"
                    name="referenceNumber"
                    value={formData.referenceNumber}
                    onChange={handleChange}
                    placeholder="e.g. BEU/AFFIL/2026/8942"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Upload Mock Box */}
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center space-y-2 bg-slate-50">
                  <UploadCloud className="w-8 h-8 text-blue-600 mx-auto" />
                  <div className="text-xs font-bold text-navy-900">Upload PDF Evidence Document</div>
                  <p className="text-[11px] text-slate-500">
                    PDF format only. Maximum file size: 5 MB. Documents remain strictly private to platform administrators.
                  </p>
                  <button
                    type="button"
                    className="px-3 py-1.5 text-xs font-semibold bg-white border border-slate-300 rounded shadow-2xs hover:bg-slate-50 text-navy-900"
                  >
                    Select File (Mock Upload)
                  </button>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-navy-900">Additional Information / Remarks</label>
                  <textarea
                    rows={3}
                    name="additionalNotes"
                    value={formData.additionalNotes}
                    onChange={handleChange}
                    placeholder="Any additional notes for the platform administrator..."
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Review & Submit */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <h2 className="text-base font-bold text-navy-900 pb-2 border-b border-slate-100 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Step 4: Review Institutional Application</span>
              </h2>

              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-3 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <span className="text-slate-500">Institution:</span>{' '}
                    <strong className="text-navy-900">{formData.collegeName || 'Not specified'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500">Category:</span>{' '}
                    <strong className="text-navy-900">{formData.institutionType} ({formData.ownershipType})</strong>
                  </div>
                  <div>
                    <span className="text-slate-500">Location:</span>{' '}
                    <strong className="text-navy-900">{formData.city}, {formData.district}, {formData.state}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500">Official Email:</span>{' '}
                    <strong className="text-navy-900">{formData.officialEmail}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500">Authorized Admin:</span>{' '}
                    <strong className="text-navy-900">{formData.adminName} ({formData.adminDesignation})</strong>
                  </div>
                  <div>
                    <span className="text-slate-500">Admin Email:</span>{' '}
                    <strong className="text-navy-900">{formData.adminEmail}</strong>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-amber-600" />
                  <span>Submission Notice:</span>
                </div>
                <p>
                  Upon submission, your application will be assigned status <strong>PENDING</strong>. A platform administrator will verify your institutional credentials before unlocking vacancy publishing capabilities.
                </p>
              </div>
            </div>
          )}

          {/* Wizard Controls */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className="inline-flex items-center gap-1.5 px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-navy-900 hover:bg-slate-50"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Previous Step</span>
              </button>
            ) : <div></div>}

            {currentStep < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-1.5 px-6 py-2 bg-navy-500 hover:bg-blue-600 text-white rounded-lg text-xs font-semibold shadow-xs"
              >
                <span>Proceed to Step {currentStep + 1}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-sm"
              >
                <span>Submit Institutional Application</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            )}
          </div>

        </form>
      </div>

    </div>
  );
}
