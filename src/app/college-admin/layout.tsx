'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Building2, 
  Briefcase, 
  PlusCircle, 
  Bell, 
  FileEdit, 
  LogOut, 
  ExternalLink,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';

interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: string;
  collegeId?: string | null;
  collegeName?: string | null;
}

export default function CollegeAdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sessionUser, setSessionUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/auth/me');
        const data = await res.json();
        if (data.success && data.user) {
          setSessionUser(data.user);
        } else {
          // If no active session, redirect to login
          router.push('/login?redirect=/college-admin');
        }
      } catch (err) {
        router.push('/login?redirect=/college-admin');
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, [router]);

  const handleSignOut = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      window.dispatchEvent(new Event('bihar_portal_auth_change'));
      router.push('/login');
    } catch (err) {
      router.push('/login');
    }
  };

  const menuItems = [
    { label: 'Dashboard Overview', href: '/college-admin', icon: LayoutDashboard },
    { label: 'My Vacancies', href: '/college-admin/vacancies', icon: Briefcase },
    { label: 'Post New Vacancy', href: '/college-admin/vacancies/new', icon: PlusCircle },
    { label: 'News & Notices', href: '/college-admin/news', icon: Bell },
    { label: 'Add News / Notice', href: '/college-admin/news/new', icon: FileEdit },
  ];

  const isItemActive = (href: string) => {
    if (href === '/college-admin') {
      return pathname === '/college-admin';
    }
    if (href === '/college-admin/vacancies') {
      return pathname === '/college-admin/vacancies';
    }
    if (href === '/college-admin/news') {
      return pathname === '/college-admin/news';
    }
    return pathname === href;
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-slate-600">
        <div className="text-center space-y-3">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto text-blue-600" />
          <p className="text-xs font-medium">Verifying institutional credentials...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-105px)] bg-slate-100 flex flex-col md:flex-row w-full">
      
      {/* Mobile Top Navigation Strip */}
      <div className="md:hidden bg-navy-900 text-white p-3.5 border-b border-navy-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-blue-600/30 border border-blue-500/40 flex items-center justify-center shrink-0">
            <Building2 className="w-4 h-4 text-blue-400" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold text-white truncate">
              {sessionUser?.collegeName || 'Muzaffarpur Institute of Technology'}
            </div>
            <div className="text-[10px] text-emerald-400 flex items-center gap-1 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span>College Workspace</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg bg-navy-800 text-slate-300 hover:text-white border border-navy-700 text-xs font-semibold shrink-0"
        >
          {mobileMenuOpen ? 'Close Menu' : 'Workspace Menu'}
        </button>
      </div>

      {/* College Admin Sidebar */}
      <aside className={`w-full md:w-64 lg:w-72 bg-navy-900 text-white shrink-0 flex flex-col justify-between border-r border-navy-800 shadow-md ${
        mobileMenuOpen ? 'block' : 'hidden md:flex'
      }`}>
        <div>
          {/* Institution Context Header */}
          <div className="p-5 border-b border-navy-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Tenant Workspace
              </span>
              <span className="text-[10px] text-slate-400 font-mono">PORTAL</span>
            </div>
            
            <div className="pt-1">
              <h2 className="text-sm font-bold text-white leading-snug line-clamp-2" title={sessionUser?.collegeName || 'Muzaffarpur Institute of Technology'}>
                {sessionUser?.collegeName || 'Muzaffarpur Institute of Technology'}
              </h2>
            </div>

            <div className="text-[11px] text-slate-300 bg-navy-800/80 p-2 rounded-lg border border-navy-700/60 flex items-center justify-between">
              <div className="flex items-center gap-1.5 min-w-0">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="truncate font-medium">{sessionUser?.name || 'Authorized Admin'}</span>
              </div>
              <span className="text-[9px] font-bold text-blue-400 bg-blue-950/80 px-1.5 py-0.5 rounded border border-blue-900 shrink-0">
                ACTIVE
              </span>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="p-3 space-y-1">
            <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Workspace Navigation
            </div>
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = isItemActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm font-bold translate-x-0.5'
                      : 'text-slate-300 hover:bg-navy-800/80 hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span className="truncate">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-navy-800 space-y-2 bg-navy-950/40">
          <Link
            href="/"
            className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-navy-800/70 transition-colors"
          >
            <div className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
              <span>Public Portal</span>
            </div>
            <span className="text-[10px] text-slate-400">Home</span>
          </Link>
          <button
            type="button"
            onClick={handleSignOut}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 transition-colors text-left"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out Session</span>
          </button>
        </div>
      </aside>

      {/* Main Workspace Body */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto w-full">
          {children}
        </div>
      </main>

    </div>
  );
}
