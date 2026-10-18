'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import './globals.css';
import { 
  ShieldCheck, 
  Building2, 
  CheckSquare, 
  Database,
  ExternalLink, 
  LogOut, 
  Landmark, 
  Activity, 
  UserCheck, 
  Briefcase,
  FolderTree,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === '/login';
  const [adminUser, setAdminUser] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    if (!isLoginPage) {
      fetch('/api/auth/me')
        .then(res => res.json())
        .then(data => {
          if (data.success && data.user) {
            setAdminUser(data.user);
          }
        })
        .catch(() => {});
    }
  }, [isLoginPage, pathname]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setAdminUser(null);
      router.push('/login');
    } catch (e) {
      router.push('/login');
    }
  };

  const menuItems = [
    { label: 'Admin Overview', href: '/', icon: ShieldCheck },
    { label: 'Colleges (Separate Hubs)', href: '/colleges', icon: Building2 },
    { label: 'Vacancy Directory (Vacancy-wise)', href: '/vacancies', icon: Briefcase },
    { label: 'Realtime DB Explorer (Tree View)', href: '/db-explorer', icon: FolderTree, badge: 'Live Tree' },
    { label: 'Vacancy Moderation', href: '/reviews', icon: CheckSquare },
  ];

  if (isLoginPage) {
    return (
      <html lang="en">
        <body className="bg-slate-900 text-slate-100 min-h-screen">
          {children}
        </body>
      </html>
    );
  }

  return (
    <html lang="en">
      <head>
        <title>VidyaSetu Directorate • Super Admin Governance Console</title>
        <meta name="description" content="State Directorate Centralized Administration Console" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
      </head>
      <body className="bg-slate-950 text-slate-100 h-screen overflow-hidden flex flex-col antialiased selection:bg-blue-600 selection:text-white">
        
        {/* Top Header Bar for Mobile (Always visible on mobile) */}
        <header className="md:hidden bg-slate-900 text-white px-4 py-3 border-b border-slate-800 flex items-center justify-between shrink-0 z-30 shadow-md">
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 -ml-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors focus:outline-none"
              aria-label="Open Navigation Menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md">
                <Landmark className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 block leading-none">
                  VidyaSetu Bihar
                </span>
                <h1 className="text-xs font-black text-white leading-tight">
                  Directorate Console
                </h1>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="PostgreSQL Live Sync Active" />
            <a
              href="http://localhost:3000"
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1 rounded-lg bg-blue-600/30 text-blue-300 border border-blue-500/40 text-[10px] font-bold flex items-center gap-1"
            >
              <span>3000</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </header>

        {/* Main App Container */}
        <div className="flex-1 flex overflow-hidden relative">

          {/* Mobile Slide-Over Backdrop */}
          {mobileMenuOpen && (
            <div 
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/75 backdrop-blur-xs z-40 md:hidden transition-opacity"
              aria-hidden="true"
            />
          )}

          {/* Desktop & Mobile Sidebar Container */}
          <aside 
            className={`
              fixed md:static inset-y-0 left-0 z-50 md:z-20
              h-full bg-slate-900 text-slate-100 border-r border-slate-800 
              shadow-2xl md:shadow-xl shrink-0 flex flex-col justify-between
              transition-all duration-300 ease-in-out
              ${mobileMenuOpen ? 'translate-x-0 w-72' : '-translate-x-full md:translate-x-0'}
              ${sidebarCollapsed ? 'md:w-20' : 'md:w-64 lg:w-72'}
            `}
          >
            {/* Top Section with Brand & Nav */}
            <div className="flex flex-col min-h-0 flex-1 overflow-hidden">
              
              {/* Header Brand Strip */}
              <div className="p-4 border-b border-slate-800 flex items-center justify-between shrink-0">
                <div className={`flex items-center gap-2.5 min-w-0 ${sidebarCollapsed ? 'justify-center w-full' : ''}`}>
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shrink-0">
                    <Landmark className="w-5 h-5" />
                  </div>
                  {!sidebarCollapsed && (
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 block truncate">
                        VidyaSetu Directorate
                      </span>
                      <h2 className="text-sm font-black text-white leading-tight truncate">
                        Super Admin Desk
                      </h2>
                    </div>
                  )}
                </div>

                {/* Mobile Close Button */}
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Desktop Collapse / Expand Toggle Button */}
                <button
                  type="button"
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                  title={sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
                  className={`hidden md:flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ${
                    sidebarCollapsed ? 'hidden' : 'flex'
                  }`}
                >
                  <PanelLeftClose className="w-4 h-4" />
                </button>
              </div>

              {/* Collapsed State Toggle Button at Top */}
              {sidebarCollapsed && (
                <div className="hidden md:flex justify-center p-2 border-b border-slate-800/80">
                  <button
                    type="button"
                    onClick={() => setSidebarCollapsed(false)}
                    title="Expand Sidebar"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  >
                    <PanelLeftOpen className="w-4 h-4 text-blue-400" />
                  </button>
                </div>
              )}

              {/* Active Admin Session Profile (Hidden when collapsed) */}
              {!sidebarCollapsed && (
                <div className="p-3 m-3 bg-slate-950/80 rounded-xl border border-slate-800 space-y-1 shrink-0">
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span className="font-bold text-slate-300">Admin Session:</span>
                    <span className="text-emerald-400 font-mono flex items-center gap-1 font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      Live DB
                    </span>
                  </div>
                  <div className="text-xs font-bold text-white truncate">
                    {adminUser?.name || 'Platform Super Administrator'}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono truncate">
                    {adminUser?.email || 'admin@biharcollegeportal.in'}
                  </div>
                </div>
              )}

              {/* Navigation Links (Scrollable independently) */}
              <nav className="p-3 space-y-1 overflow-y-auto flex-1 pr-2">
                {!sidebarCollapsed && (
                  <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Governance Consoles
                  </div>
                )}
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      title={sidebarCollapsed ? item.label : undefined}
                      className={`flex items-center rounded-xl text-xs font-semibold transition-all ${
                        sidebarCollapsed 
                          ? 'justify-center p-2.5 my-1' 
                          : 'justify-between px-3 py-2.5'
                      } ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-md font-bold'
                          : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                      }`}
                    >
                      <div className={`flex items-center gap-2.5 min-w-0 ${sidebarCollapsed ? 'justify-center' : ''}`}>
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                        {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
                      </div>

                      {!sidebarCollapsed && item.badge && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center gap-1 shrink-0">
                          <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse"></span>
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>

            </div>

            {/* Sidebar Footer (Fixed at bottom of sidebar, doesn't jump with content) */}
            <div className="p-3 border-t border-slate-800 space-y-2 bg-slate-950/70 shrink-0">
              <a
                href="http://localhost:3000"
                target="_blank"
                rel="noopener noreferrer"
                title={sidebarCollapsed ? 'Public Portal (Port 3000)' : undefined}
                className={`flex items-center rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors ${
                  sidebarCollapsed ? 'justify-center p-2' : 'justify-between px-3 py-2'
                }`}
              >
                <div className="flex items-center gap-2">
                  <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
                  {!sidebarCollapsed && <span>Public Portal</span>}
                </div>
                {!sidebarCollapsed && (
                  <span className="text-[10px] font-mono bg-blue-950 text-blue-300 px-1.5 py-0.5 rounded border border-blue-800">
                    3000
                  </span>
                )}
              </a>

              <button
                type="button"
                onClick={handleLogout}
                title={sidebarCollapsed ? 'Sign Out Admin Session' : undefined}
                className={`w-full flex items-center rounded-lg text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 transition-colors text-left ${
                  sidebarCollapsed ? 'justify-center p-2' : 'gap-2 px-3 py-2'
                }`}
              >
                <LogOut className="w-3.5 h-3.5 shrink-0" />
                {!sidebarCollapsed && <span>Sign Out Session</span>}
              </button>
            </div>
          </aside>

          {/* Main Content Pane (Independent Scrolling, never affects sidebar height!) */}
          <main className="flex-1 min-w-0 bg-slate-950 p-4 sm:p-6 lg:p-8 overflow-y-auto text-slate-100">
            <div className="max-w-7xl mx-auto w-full space-y-6">
              {children}
            </div>
          </main>

        </div>

      </body>
    </html>
  );
}
