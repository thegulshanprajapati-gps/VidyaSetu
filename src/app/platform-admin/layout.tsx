'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  ShieldCheck, 
  Building2, 
  CheckSquare, 
  ExternalLink,
  LogOut,
  Menu,
  X,
  PanelLeftClose,
  PanelLeftOpen,
  Landmark,
  Briefcase,
  FolderTree
} from 'lucide-react';

export default function PlatformAdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const menuItems = [
    { label: 'Admin Overview', href: '/platform-admin', icon: ShieldCheck },
    { label: 'College Verification Queue', href: '/platform-admin/colleges', icon: Building2 },
    { label: 'Vacancy & News Moderation', href: '/platform-admin/reviews', icon: CheckSquare },
  ];

  return (
    <div className="h-[calc(100vh-105px)] overflow-hidden flex flex-col antialiased">
      
      {/* Mobile Top Navigation Strip */}
      <div className="md:hidden bg-slate-900 text-white p-3 border-b border-slate-800 flex items-center justify-between shrink-0 z-30 shadow-md">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-200 border border-slate-700"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white leading-tight">Super Admin Console</div>
              <div className="text-[10px] text-blue-300 font-medium leading-none">State Governance Desk</div>
            </div>
          </div>
        </div>

        <a
          href="http://localhost:3001"
          target="_blank"
          rel="noopener noreferrer"
          className="px-2.5 py-1 rounded bg-blue-600 text-white text-[10px] font-bold flex items-center gap-1 shadow-sm"
        >
          <span>Port 3001</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {/* Main Workspace Frame */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Mobile Slide-Over Backdrop */}
        {mobileMenuOpen && (
          <div 
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/75 backdrop-blur-xs z-40 md:hidden transition-opacity"
            aria-hidden="true"
          />
        )}

        {/* Super Admin Dark Navy Sidebar */}
        <aside 
          className={`
            fixed md:static inset-y-0 left-0 z-50 md:z-20
            h-full bg-slate-900 text-white border-r border-slate-800 
            shadow-2xl md:shadow-md shrink-0 flex flex-col justify-between
            transition-all duration-300 ease-in-out
            ${mobileMenuOpen ? 'translate-x-0 w-72' : '-translate-x-full md:translate-x-0'}
            ${sidebarCollapsed ? 'md:w-20' : 'md:w-64 lg:w-72'}
          `}
        >
          <div className="flex flex-col min-h-0 flex-1 overflow-hidden">
            {/* Super Admin Context Header */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between shrink-0">
              <div className={`flex items-center gap-2.5 min-w-0 ${sidebarCollapsed ? 'justify-center w-full' : ''}`}>
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                {!sidebarCollapsed && (
                  <div className="min-w-0 flex-1">
                    <h2 className="text-xs font-bold text-white leading-tight truncate">
                      Super Admin Desk
                    </h2>
                    <div className="text-[10px] text-blue-300 truncate">
                      VidyaSetu Directorate
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile Close Button */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="md:hidden p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Desktop Collapse Toggle */}
              <button
                type="button"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className={`hidden md:flex p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 ${
                  sidebarCollapsed ? 'hidden' : 'flex'
                }`}
              >
                <PanelLeftClose className="w-4 h-4" />
              </button>
            </div>

            {/* Expand button in collapsed state */}
            {sidebarCollapsed && (
              <div className="hidden md:flex justify-center p-2 border-b border-slate-800">
                <button
                  type="button"
                  onClick={() => setSidebarCollapsed(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <PanelLeftOpen className="w-4 h-4 text-blue-400" />
                </button>
              </div>
            )}

            {/* Navigation Items (Scrollable independently) */}
            <nav className="p-3 space-y-1 overflow-y-auto flex-1">
              {!sidebarCollapsed && (
                <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Admin Navigation
                </div>
              )}
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    title={sidebarCollapsed ? item.label : undefined}
                    className={`flex items-center rounded-xl text-xs font-semibold transition-all ${
                      sidebarCollapsed ? 'justify-center p-2.5 my-1' : 'gap-2.5 px-3 py-2.5'
                    } ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-sm font-bold'
                        : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Sidebar Footer (Pinned at bottom of sidebar) */}
          <div className="p-3 border-t border-slate-800 space-y-2 bg-slate-950/70 shrink-0">
            <a
              href="http://localhost:3001"
              target="_blank"
              rel="noopener noreferrer"
              title={sidebarCollapsed ? 'Dedicated Admin on Port 3001' : undefined}
              className={`flex items-center rounded-lg text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-md transition-colors ${
                sidebarCollapsed ? 'justify-center p-2' : 'justify-between px-3 py-2'
              }`}
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-white" />
                {!sidebarCollapsed && <span>Dedicated Admin (3001)</span>}
              </div>
              {!sidebarCollapsed && <ExternalLink className="w-3.5 h-3.5" />}
            </a>

            <Link
              href="/"
              title={sidebarCollapsed ? 'Public Website' : undefined}
              className={`flex items-center rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/70 transition-colors ${
                sidebarCollapsed ? 'justify-center p-2' : 'justify-between px-3 py-2'
              }`}
            >
              <div className="flex items-center gap-2">
                <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
                {!sidebarCollapsed && <span>Public Website</span>}
              </div>
              {!sidebarCollapsed && <span className="text-[10px] text-slate-400">Home</span>}
            </Link>
          </div>
        </aside>

        {/* Main Workspace Body */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
          <div className="max-w-6xl mx-auto w-full space-y-6">
            {children}
          </div>
        </main>

      </div>
    </div>
  );
}
