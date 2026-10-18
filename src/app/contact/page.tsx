import React from 'react';
import { Mail, Phone, MapPin, MessageSquare, Send } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div>
        <h1 className="text-3xl font-black text-navy-900 tracking-tight">
          Helpdesk & Technical Support
        </h1>
        <p className="text-sm text-textColor-secondary mt-1">
          Reach out to the portal administrative team for institutional verification support, bug reports, or candidate grievances.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-surface-border rounded-xl p-5 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <Mail className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-navy-900">Email Helpdesk</h3>
          <p className="text-xs text-slate-600">For institutional onboarding and verification status inquiries.</p>
          <div className="text-xs font-mono font-semibold text-blue-700">support@biharcollegeportal.in</div>
        </div>

        <div className="bg-white border border-surface-border rounded-xl p-5 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Phone className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-navy-900">Telephone Helpline</h3>
          <p className="text-xs text-slate-600">Available Monday through Saturday, 10:00 AM to 5:00 PM IST.</p>
          <div className="text-xs font-mono font-semibold text-emerald-700">+91 612 2548900</div>
        </div>

        <div className="bg-white border border-surface-border rounded-xl p-5 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
            <MapPin className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-navy-900">Nodal Desk</h3>
          <p className="text-xs text-slate-600">Higher Education Technical Board, Bailey Road, Patna, Bihar - 800001.</p>
        </div>
      </div>

      {/* Inquiry Form */}
      <div className="bg-white border border-surface-border rounded-xl p-6 sm:p-8 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-navy-900 pb-2 border-b border-slate-100 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-blue-600" />
          <span>Submit a Support Query or Grievance</span>
        </h2>

        <form className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1">
            <label className="font-semibold text-navy-900">Your Full Name *</label>
            <input type="text" required placeholder="Full Name" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500" />
          </div>
          <div className="space-y-1">
            <label className="font-semibold text-navy-900">Email Address *</label>
            <input type="email" required placeholder="email@address.com" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500" />
          </div>
          <div className="sm:col-span-2 space-y-1">
            <label className="font-semibold text-navy-900">Subject / Nature of Inquiry</label>
            <input type="text" placeholder="e.g. College Verification Delay / Discrepancy in Vacancy" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500" />
          </div>
          <div className="sm:col-span-2 space-y-1">
            <label className="font-semibold text-navy-900">Detailed Message *</label>
            <textarea rows={4} required placeholder="Describe your question or grievance in detail..." className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500" />
          </div>
          <div className="sm:col-span-2">
            <button type="button" className="inline-flex items-center gap-2 px-6 py-2.5 bg-navy-500 hover:bg-blue-600 text-white rounded-lg font-bold shadow-xs transition-colors">
              <Send className="w-4 h-4" />
              <span>Send Message</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
