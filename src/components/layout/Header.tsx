'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Building2, 
  Menu, 
  X, 
  Briefcase, 
  GraduationCap, 
  LogIn, 
  LogOut,
  ChevronRight,
  UserCheck,
  User,
  MessageSquare,
  Sun,
  Moon,
  Sparkles
} from 'lucide-react';
import { useTheme } from '@/components/theme/ThemeProvider';

interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: 'SUPER_ADMIN' | 'COLLEGE_ADMIN' | 'MODERATOR' | 'CANDIDATE';
  collegeId?: string | null;
  collegeName?: string | null;
  collegeSlug?: string | null;
}

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sessionUser, setSessionUser] = useState<SessionUser | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();

  const fetchSession = async () => {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      if (data.success && data.user) {
        setSessionUser(data.user);
      } else {
        setSessionUser(null);
      }
    } catch (e) {
      setSessionUser(null);
    }
  };

  useEffect(() => {
    fetchSession();

    const handleAuthChange = () => fetchSession();
    window.addEventListener('bihar_portal_auth_change', handleAuthChange);
    return () => window.removeEventListener('bihar_portal_auth_change', handleAuthChange);
  }, [pathname]);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await fetch('/api/auth/logout', { method: 'POST' });
      setSessionUser(null);
      window.dispatchEvent(new Event('bihar_portal_auth_change'));
      
      if (pathname.startsWith('/college-admin')) {
        router.push('/');
      } else {
        router.refresh();
      }
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setLoggingOut(false);
    }
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Vacancies', href: '/vacancies' },
    { name: 'Colleges', href: '/colleges' },
    { name: 'Community', href: '/community', badge: 'New' },
    { name: 'News & Circulars', href: '/news' },
    { name: 'About', href: '/about' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors shadow-xs">
      
      {/* Top Official Banner Strip */}
      <div className="bg-gradient-to-r from-slate-900 via-navy-900 to-blue-950 text-white text-xs py-1.5 px-4 sm:px-8 border-b border-navy-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-medium tracking-wide text-[11px] sm:text-xs">
              State Directorate of Higher Education • Centralized Recruitment & Career Network
            </span>
          </div>

          <div className="flex items-center space-x-4 text-slate-300 text-xs">
            {sessionUser && (
              <div className="flex items-center gap-1.5 text-emerald-400 font-semibold text-[11px]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>Active: {sessionUser.name}</span>
              </div>
            )}
            <span className="hidden sm:inline text-slate-500">|</span>
            <span className="hidden sm:inline text-slate-300 text-[11px] font-mono">
              Bihar, India
            </span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          
          {/* Logo & Portal Identity */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-400 text-white flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-105 transition-all">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                  VidyaSetu
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-bold bg-blue-600 text-white rounded-md tracking-wider">
                  BIHAR
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 -mt-0.5 font-medium">
                Higher Education & Career Gateway
              </p>
            </div>
          </Link>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-3 py-2 text-xs font-semibold rounded-xl transition-all relative flex items-center gap-1.5 ${
                    active 
                      ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 font-bold' 
                      : 'text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <span>{link.name}</span>
                  {link.badge && (
                    <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-emerald-500 text-white">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Action Area: Theme Toggle & Session Controls */}
          <div className="hidden sm:flex items-center space-x-3">
            
            {/* Dark / Light Mode Toggle Button */}
            <button
              onClick={toggleTheme}
              type="button"
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700" />
              )}
            </button>

            {sessionUser ? (
              /* LOGGED IN USER ACTIONS */
              <div className="flex items-center gap-2">
                {sessionUser.role === 'COLLEGE_ADMIN' ? (
                  <Link
                    href="/college-admin"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 rounded-xl text-xs font-bold transition-colors"
                  >
                    <Building2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    <span className="max-w-[130px] truncate">{sessionUser.collegeName || sessionUser.name}</span>
                  </Link>
                ) : (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700">
                    <User className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    <span className="max-w-[120px] truncate">{sessionUser.name}</span>
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:text-rose-700 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/40 border border-rose-200 dark:border-rose-900 px-3 py-1.5 rounded-xl transition-colors"
                  title="Logout session"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>{loggingOut ? '...' : 'Logout'}</span>
                </button>
              </div>
            ) : (
              /* LOGGED OUT USER ACTIONS */
              <div className="flex items-center gap-2.5">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 px-3.5 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In</span>
                </Link>
                
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 px-4 py-2 rounded-xl shadow-md shadow-blue-500/20 transition-all active:scale-98"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Candidate Portal</span>
                </Link>
              </div>
            )}

          </div>

          {/* Mobile buttons: Theme toggle + Menu */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              type="button"
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-3 pb-5 space-y-2">
          {sessionUser && (
            <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-xs text-blue-900 dark:text-blue-300 font-bold mb-2 flex items-center justify-between">
              <span>Signed in: {sessionUser.name}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-200 dark:bg-blue-900 text-blue-900 dark:text-blue-200">{sessionUser.role}</span>
            </div>
          )}

          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl"
            >
              {link.name}
            </Link>
          ))}

          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2">
            {sessionUser ? (
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-center py-2.5 text-xs font-bold border border-rose-300 dark:border-rose-900 text-rose-600 dark:text-rose-400 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/50"
              >
                Sign Out Session
              </button>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 text-xs font-bold bg-blue-600 text-white rounded-xl shadow-md"
              >
                Sign In / Candidate Register
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
