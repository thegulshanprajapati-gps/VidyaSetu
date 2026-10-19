'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Building2, ShieldCheck, Mail, Phone, MapPin, GraduationCap, MessageSquare } from 'lucide-react';

export default function Footer() {
  const pathname = usePathname();

  // Hide public portal marketing footer inside internal dashboard workspaces
  if (pathname.startsWith('/college-admin') || pathname.startsWith('/platform-admin')) {
    return null;
  }

  return (
    <footer className="bg-slate-950 text-slate-400 pt-14 pb-8 border-t border-slate-800 text-sm transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <span className="text-white font-black text-base tracking-tight">VidyaSetu Bihar</span>
                <span className="block text-[10px] text-blue-400 font-bold uppercase tracking-wider">State Career Gateway</span>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Official centralized discovery & application network for teaching, technical, and faculty vacancies across recognized colleges and universities in Bihar.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>Verified Institutional & Candidate Network</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-xs uppercase tracking-wider mb-3">
              Recruitment Discovery
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/vacancies?category=TEACHING" className="hover:text-blue-400 transition-colors">
                  Teaching & Faculty Posts
                </Link>
              </li>
              <li>
                <Link href="/vacancies?category=TECHNICAL" className="hover:text-blue-400 transition-colors">
                  Technical & Lab Staff
                </Link>
              </li>
              <li>
                <Link href="/vacancies?category=ADMINISTRATIVE" className="hover:text-blue-400 transition-colors">
                  Administrative & Officers
                </Link>
              </li>
              <li>
                <Link href="/vacancies?employment=GUEST_FACULTY" className="hover:text-blue-400 transition-colors">
                  Guest Lecturer & Contractual
                </Link>
              </li>
              <li>
                <Link href="/community" className="text-blue-400 hover:text-white font-semibold transition-colors flex items-center gap-1">
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Candidate Community Forum</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Institutional Access */}
          <div>
            <h3 className="text-white font-bold text-xs uppercase tracking-wider mb-3">
              Colleges & Candidates
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/login" className="hover:text-blue-400 transition-colors">
                  Candidate Sign In / Register
                </Link>
              </li>
              <li>
                <Link href="/college-register" className="hover:text-blue-400 transition-colors">
                  Register Your Institution
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-blue-400 transition-colors">
                  College Admin Login
                </Link>
              </li>
              <li>
                <Link href="/colleges" className="hover:text-blue-400 transition-colors">
                  Browse Recognized Institutions
                </Link>
              </li>
            </ul>
          </div>

          {/* Statutory Notice & Contact */}
          <div>
            <h3 className="text-white font-bold text-xs uppercase tracking-wider mb-3">
              Legal & Statutory
            </h3>
            <ul className="space-y-2 text-xs mb-4">
              <li>
                <Link href="/about" className="hover:text-blue-400 transition-colors">
                  About VidyaSetu
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-blue-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-blue-400 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="hover:text-blue-400 transition-colors">
                  Recruitment Disclaimer
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-blue-400 transition-colors">
                  Helpdesk & Grievance
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Disclaimer Bar */}
        <div className="pt-6 border-t border-slate-800 text-[11px] text-slate-500 leading-normal space-y-2">
          <p>
            <strong>Disclaimer:</strong> VidyaSetu Bihar facilitates centralized discovery of verified vacancy circulars issued by affiliated colleges, polytechnics, and universities in Bihar. Candidates are advised to refer to the original signed notification PDF prior to applying or paying application fees.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-between pt-2 text-slate-600">
            <span>© 2026 VidyaSetu Bihar • State Directorate of Higher Education. All rights reserved.</span>
            <span>Covering all 38 Districts of Bihar</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
