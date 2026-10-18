'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Lock, Mail, Landmark, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@biharcollegeportal.in');
  const [password, setPassword] = useState('BiharAdmin@2026#Secure');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/');
        }, 800);
      } else {
        setError(data.error || 'Authentication failed. Please verify credentials.');
      }
    } catch (err: any) {
      setError(err.message || 'Network error occurred while contacting authentication endpoint.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-950 text-slate-100">
      <div className="w-full max-w-md space-y-6">
        
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600 shadow-xl text-white mb-2">
            <Landmark className="w-7 h-7" />
          </div>
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-950 text-blue-300 border border-blue-800 tracking-wider uppercase block w-fit mx-auto">
            State Directorate Super Admin
          </span>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Bihar College Directorate
          </h1>
          <p className="text-xs text-slate-400">
            Sign in to access centralized institutional verification and moderation controls.
          </p>
        </div>

        {/* Login Box */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5">
          {error && (
            <div className="p-3.5 rounded-lg bg-rose-950/80 border border-rose-800 text-rose-300 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3.5 rounded-lg bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>Authentication authorized. Redirecting to workspace...</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-300 mb-1.5">
                Super Admin Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500 font-mono"
                  placeholder="admin@biharcollegeportal.in"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1.5">
                Directorate Security Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500 font-mono"
                  placeholder="••••••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>{loading ? 'Authenticating with PostgreSQL...' : 'Sign In to Super Admin Desk'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick autofill helper */}
          <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400 space-y-2">
            <div className="flex items-center justify-between">
              <span>Default Super Admin:</span>
              <button
                type="button"
                onClick={() => {
                  setEmail('admin@biharcollegeportal.in');
                  setPassword('BiharAdmin@2026#Secure');
                }}
                className="text-blue-400 hover:underline font-semibold"
              >
                Autofill Credentials
              </button>
            </div>
            <div className="bg-slate-950/80 p-2 rounded border border-slate-800 font-mono text-[10px] space-y-0.5 text-slate-300">
              <div>Email: <strong>admin@biharcollegeportal.in</strong></div>
              <div>Password: <strong>BiharAdmin@2026#Secure</strong></div>
            </div>
          </div>
        </div>

        {/* Back to public link */}
        <div className="text-center">
          <a
            href="http://localhost:3000"
            className="text-xs text-slate-400 hover:text-white transition-colors"
          >
            ← Return to Bihar College Public Portal (Port 3000)
          </a>
        </div>

      </div>
    </div>
  );
}
