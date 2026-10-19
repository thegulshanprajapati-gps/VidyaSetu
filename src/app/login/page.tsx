'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Building2, 
  Lock, 
  Mail, 
  User, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles,
  Eye,
  EyeOff,
  GraduationCap,
  Briefcase,
  Phone
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [roleTab, setRoleTab] = useState<'CANDIDATE' | 'COLLEGE_ADMIN'>('CANDIDATE');
  const [authMode, setAuthMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');

  // Login form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Candidate Registration state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [qualification, setQualification] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleRoleChange = (role: 'CANDIDATE' | 'COLLEGE_ADMIN') => {
    setRoleTab(role);
    setError(null);
    setSuccessMessage(null);
    if (role === 'COLLEGE_ADMIN') {
      setAuthMode('LOGIN'); // Colleges register via 4-step wizard
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      if (roleTab === 'CANDIDATE' && authMode === 'REGISTER') {
        // Register Candidate API
        const res = await fetch('/api/auth/register-candidate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password, phone, qualification }),
        });

        const data = await res.json();
        if (data.success) {
          setSuccessMessage('Account registered successfully! Welcome to VidyaSetu Bihar.');
          window.dispatchEvent(new Event('bihar_portal_auth_change'));
          setTimeout(() => {
            router.push('/vacancies');
          }, 800);
        } else {
          setError(data.error || 'Registration failed. Please check your details.');
        }
      } else {
        // Standard Sign In (Candidate or College Admin)
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        const data = await res.json();
        if (data.success) {
          setSuccessMessage(`Welcome back, ${data.user.name}!`);
          window.dispatchEvent(new Event('bihar_portal_auth_change'));
          setTimeout(() => {
            if (data.user.role === 'COLLEGE_ADMIN') {
              router.push('/college-admin');
            } else {
              router.push('/vacancies');
            }
          }, 600);
        } else {
          setError(data.error || 'Invalid credentials. Please verify your email and password.');
        }
      }
    } catch (err: any) {
      setError(err.message || 'A network error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-6">
        
        {/* Brand Logo & Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-400 text-white flex items-center justify-center mx-auto shadow-xl shadow-blue-500/20">
            <GraduationCap className="w-7 h-7" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            VidyaSetu Bihar
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Higher Education & Career Gateway • State of Bihar
          </p>
        </div>

        {/* User Role Switcher */}
        <div className="p-1 rounded-2xl bg-slate-200 dark:bg-slate-900 grid grid-cols-2 text-xs font-bold border border-slate-300/60 dark:border-slate-800">
          <button
            type="button"
            onClick={() => handleRoleChange('CANDIDATE')}
            className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              roleTab === 'CANDIDATE' 
                ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-md font-black' 
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Candidate / Jobseeker</span>
          </button>
          <button
            type="button"
            onClick={() => handleRoleChange('COLLEGE_ADMIN')}
            className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              roleTab === 'COLLEGE_ADMIN' 
                ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-md font-black' 
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>College Admin</span>
          </button>
        </div>

        {/* Form Container */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-5">
          
          {/* Candidate Mode Toggle (Sign In vs Register) */}
          {roleTab === 'CANDIDATE' && (
            <div className="flex items-center justify-center gap-4 pb-2 border-b border-slate-100 dark:border-slate-800 text-xs font-bold">
              <button
                type="button"
                onClick={() => { setAuthMode('LOGIN'); setError(null); }}
                className={`pb-1 border-b-2 transition-all ${
                  authMode === 'LOGIN'
                    ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                }`}
              >
                Sign In to Apply
              </button>
              <button
                type="button"
                onClick={() => { setAuthMode('REGISTER'); setError(null); }}
                className={`pb-1 border-b-2 transition-all ${
                  authMode === 'REGISTER'
                    ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                }`}
              >
                New Candidate Sign Up
              </button>
            </div>
          )}

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-300 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <span>{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* If Registering as Candidate */}
            {roleTab === 'CANDIDATE' && authMode === 'REGISTER' && (
              <>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Full Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Kumar"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-blue-500 text-slate-900 dark:text-white"
                    />
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Highest Qualification
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="e.g. M.Tech / NET-JRF / Ph.D / B.E."
                      value={qualification}
                      onChange={(e) => setQualification(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-blue-500 text-slate-900 dark:text-white"
                    />
                    <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  </div>
                </div>
              </>
            )}

            {/* Email field */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                {roleTab === 'COLLEGE_ADMIN' ? 'Registered College Email' : 'Email Address'}
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder={roleTab === 'COLLEGE_ADMIN' ? 'e.g. principal@college.ac.in' : 'your.email@gmail.com'}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-blue-500 text-slate-900 dark:text-white"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            {/* Password field (Clean & Masked with Eye toggle) */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-10 py-2.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-blue-500 text-slate-900 dark:text-white font-mono"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-98"
            >
              <span>
                {loading 
                  ? 'Processing...' 
                  : roleTab === 'CANDIDATE' && authMode === 'REGISTER' 
                  ? 'Create Candidate Profile' 
                  : roleTab === 'COLLEGE_ADMIN' 
                  ? 'Sign In to College Workspace' 
                  : 'Sign In & Apply'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>

          </form>

          {/* College Registration link */}
          {roleTab === 'COLLEGE_ADMIN' && (
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-center text-xs text-slate-500">
              <span>New Institution? </span>
              <Link href="/college-register" className="text-blue-600 dark:text-blue-400 font-bold hover:underline">
                Register New College
              </Link>
            </div>
          )}

        </div>

        {/* Security badge footer */}
        <div className="text-center text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
          <Lock className="w-3.5 h-3.5 text-emerald-500" />
          <span>256-bit encrypted state session • Passwords safely hashed</span>
        </div>

      </div>
    </div>
  );
}
