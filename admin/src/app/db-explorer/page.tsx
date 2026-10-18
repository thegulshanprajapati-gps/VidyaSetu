'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { 
  Folder, 
  FolderOpen, 
  File, 
  ChevronRight, 
  ChevronDown, 
  Database, 
  RefreshCw, 
  Search, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Copy, 
  Check, 
  ExternalLink, 
  Building2, 
  Briefcase, 
  Users, 
  FileText, 
  Activity, 
  Lock, 
  Eye, 
  Layers, 
  Sparkles,
  Info,
  Calendar,
  MapPin,
  Maximize2,
  Minimize2
} from 'lucide-react';

interface ExplorerTreeNode {
  id: string;
  name: string;
  type: 'folder' | 'file';
  category?: 'college' | 'vacancy' | 'user' | 'news' | 'log' | 'doc' | 'category' | 'db';
  iconType?: string;
  itemCount?: number;
  badge?: string;
  badgeColor?: 'green' | 'blue' | 'amber' | 'rose' | 'slate' | 'purple';
  data?: any;
  children?: ExplorerTreeNode[];
}

export default function DatabaseExplorerPage() {
  const [dbData, setDbData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [autoSync, setAutoSync] = useState(true);
  const [lastSyncTime, setLastSyncTime] = useState<string>('');
  const [queryLatency, setQueryLatency] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNode, setSelectedNode] = useState<ExplorerTreeNode | null>(null);
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState(false);
  const [inspectorTab, setInspectorTab] = useState<'FIELDS' | 'JSON' | 'RELATIONS'>('FIELDS');

  // Load Database snapshot
  const loadDatabaseTree = async (isManual = false) => {
    try {
      if (isManual) setRefreshing(true);
      const res = await fetch('/api/db-explorer');
      const data = await res.json();
      if (data.success) {
        setDbData(data);
        setQueryLatency(data.metadata?.queryTimeMs || 0);
        setLastSyncTime(new Date().toLocaleTimeString());
      }
    } catch (err) {
      console.error('Failed to load database explorer data:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadDatabaseTree();
  }, []);

  // Realtime Polling Timer (every 5 seconds if autoSync is on)
  useEffect(() => {
    if (!autoSync) return;
    const interval = setInterval(() => {
      loadDatabaseTree(false);
    }, 5000);
    return () => clearInterval(interval);
  }, [autoSync]);

  // Build Hierarchical Tree Structure
  const treeRoot: ExplorerTreeNode | null = useMemo(() => {
    if (!dbData) return null;

    const { colleges = [], vacancies = [], users = [], news = [], auditLogs = [] } = dbData;

    // 1. Colleges Folder
    const collegeFolders: ExplorerTreeNode[] = colleges.map((col: any) => {
      // College Vacancies subfolder
      const colVacancies: ExplorerTreeNode[] = (col.vacancies || []).map((v: any) => ({
        id: `col-${col.id}-vac-${v.id}`,
        name: `${v.title}.json`,
        type: 'file',
        category: 'vacancy',
        badge: v.status,
        badgeColor: v.status === 'PUBLISHED' ? 'green' : v.status === 'REJECTED' ? 'rose' : 'amber',
        data: {
          table: 'Vacancy',
          ...v,
          collegeName: col.name,
        },
      }));

      // College Users subfolder
      const colUsers: ExplorerTreeNode[] = (col.users || []).map((u: any) => ({
        id: `col-${col.id}-user-${u.id}`,
        name: `${u.email}.json`,
        type: 'file',
        category: 'user',
        badge: u.role,
        badgeColor: 'blue',
        data: {
          table: 'User',
          ...u,
          collegeName: col.name,
        },
      }));

      // Compliance Documents subfolder
      const colDocs: ExplorerTreeNode[] = [
        {
          id: `col-${col.id}-doc-aff`,
          name: 'authorizationLetterUrl.pdf',
          type: 'file',
          category: 'doc',
          badge: col.authorizationLetterUrl ? 'STORED' : 'NULL',
          badgeColor: col.authorizationLetterUrl ? 'green' : 'amber',
          data: {
            table: 'CollegeDocument',
            documentType: 'Affiliation Order / Authorization Letter',
            storedValue: col.authorizationLetterUrl,
            status: col.authorizationLetterUrl ? 'STORED IN POSTGRESQL' : 'NULL / NOT UPLOADED',
            collegeName: col.name,
          },
        },
        {
          id: `col-${col.id}-doc-dom`,
          name: 'domainProofUrl.pdf',
          type: 'file',
          category: 'doc',
          badge: col.domainProofUrl ? 'STORED' : 'NULL',
          badgeColor: col.domainProofUrl ? 'green' : 'amber',
          data: {
            table: 'CollegeDocument',
            documentType: 'Domain Verification Proof',
            storedValue: col.domainProofUrl,
            status: col.domainProofUrl ? 'STORED IN POSTGRESQL' : 'NULL / NOT UPLOADED',
            collegeName: col.name,
          },
        },
      ];

      return {
        id: `col-${col.id}`,
        name: col.name,
        type: 'folder',
        category: 'college',
        badge: col.verificationStatus,
        badgeColor: col.verificationStatus === 'APPROVED' ? 'green' : col.verificationStatus === 'REJECTED' ? 'rose' : 'amber',
        itemCount: (col.vacancies?.length || 0) + (col.users?.length || 0) + 1,
        data: {
          table: 'College',
          ...col,
        },
        children: [
          {
            id: `col-${col.id}-profile`,
            name: 'college_profile.json',
            type: 'file',
            category: 'college',
            badge: `${Object.keys(col).length} fields`,
            badgeColor: 'slate',
            data: {
              table: 'College',
              ...col,
            },
          },
          {
            id: `col-${col.id}-vacancies-dir`,
            name: `vacancies (${col.vacancies?.length || 0})`,
            type: 'folder',
            category: 'vacancy',
            itemCount: col.vacancies?.length || 0,
            children: colVacancies,
          },
          {
            id: `col-${col.id}-users-dir`,
            name: `administrators (${col.users?.length || 0})`,
            type: 'folder',
            category: 'user',
            itemCount: col.users?.length || 0,
            children: colUsers,
          },
          {
            id: `col-${col.id}-docs-dir`,
            name: `compliance_evidence (2)`,
            type: 'folder',
            category: 'doc',
            itemCount: 2,
            children: colDocs,
          },
        ],
      };
    });

    // 2. Vacancies by Category Folder
    const categories = ['TEACHING', 'TECHNICAL', 'NON_TEACHING', 'ADMINISTRATIVE'];
    const vacancyCategoryFolders: ExplorerTreeNode[] = categories.map((cat) => {
      const catVacancies = vacancies.filter((v: any) => v.jobCategory === cat);
      return {
        id: `cat-${cat}`,
        name: `${cat} (${catVacancies.length})`,
        type: 'folder',
        category: 'category',
        itemCount: catVacancies.length,
        children: catVacancies.map((v: any) => ({
          id: `vac-cat-${v.id}`,
          name: `${v.title} [${v.college?.name || 'College'}].json`,
          type: 'file',
          category: 'vacancy',
          badge: v.status,
          badgeColor: v.status === 'PUBLISHED' ? 'green' : v.status === 'REJECTED' ? 'rose' : 'amber',
          data: {
            table: 'Vacancy',
            ...v,
          },
        })),
      };
    });

    // 3. Users by Role Folder
    const roles = ['SUPER_ADMIN', 'COLLEGE_ADMIN', 'MODERATOR'];
    const userRoleFolders: ExplorerTreeNode[] = roles.map((role) => {
      const roleUsers = users.filter((u: any) => u.role === role);
      return {
        id: `role-${role}`,
        name: `${role} (${roleUsers.length})`,
        type: 'folder',
        category: 'user',
        itemCount: roleUsers.length,
        children: roleUsers.map((u: any) => ({
          id: `user-role-${u.id}`,
          name: `${u.email}.json`,
          type: 'file',
          category: 'user',
          badge: u.status,
          badgeColor: u.status === 'ACTIVE' ? 'green' : 'amber',
          data: {
            table: 'User',
            ...u,
          },
        })),
      };
    });

    // Root Database Node
    return {
      id: 'root-db',
      name: 'bihar_college_db (Aiven PostgreSQL 16)',
      type: 'folder',
      category: 'db',
      badge: 'Live',
      badgeColor: 'green',
      children: [
        {
          id: 'dir-colleges',
          name: `colleges (${colleges.length} institutions)`,
          type: 'folder',
          category: 'college',
          itemCount: colleges.length,
          children: collegeFolders,
        },
        {
          id: 'dir-vacancies',
          name: `vacancies_by_category (${vacancies.length} circulars)`,
          type: 'folder',
          category: 'vacancy',
          itemCount: vacancies.length,
          children: vacancyCategoryFolders,
        },
        {
          id: 'dir-users',
          name: `user_accounts (${users.length} credentials)`,
          type: 'folder',
          category: 'user',
          itemCount: users.length,
          children: userRoleFolders,
        },
        {
          id: 'dir-news',
          name: `news_and_notices (${news.length} items)`,
          type: 'folder',
          category: 'news',
          itemCount: news.length,
          children: news.map((n: any) => ({
            id: `news-${n.id}`,
            name: `${n.title}.json`,
            type: 'file',
            category: 'news',
            badge: n.status,
            badgeColor: 'blue',
            data: { table: 'News', ...n },
          })),
        },
        {
          id: 'dir-audit',
          name: `audit_logs (${auditLogs.length} events)`,
          type: 'folder',
          category: 'log',
          itemCount: auditLogs.length,
          children: auditLogs.map((log: any) => ({
            id: `log-${log.id}`,
            name: `audit_${log.action}_${log.id.slice(-6)}.json`,
            type: 'file',
            category: 'log',
            badge: log.action,
            badgeColor: 'purple',
            data: { table: 'AuditLog', ...log },
          })),
        },
      ],
    };
  }, [dbData]);

  // Set initial expanded states
  useEffect(() => {
    if (treeRoot && Object.keys(expandedNodes).length === 0) {
      setExpandedNodes({
        'root-db': true,
        'dir-colleges': true,
        'dir-vacancies': true,
      });
      // Default selection to first college profile if available
      const firstCol = dbData?.colleges?.[0];
      if (firstCol) {
        setSelectedNode({
          id: `col-${firstCol.id}-profile`,
          name: `${firstCol.name} (college_profile.json)`,
          type: 'file',
          category: 'college',
          data: { table: 'College', ...firstCol },
        });
      }
    }
  }, [treeRoot, dbData]);

  const toggleNode = (nodeId: string) => {
    setExpandedNodes(prev => ({ ...prev, [nodeId]: !prev[nodeId] }));
  };

  const expandAll = () => {
    const all: Record<string, boolean> = {};
    const recurse = (node: ExplorerTreeNode) => {
      if (node.type === 'folder') {
        all[node.id] = true;
        if (node.children) node.children.forEach(recurse);
      }
    };
    if (treeRoot) recurse(treeRoot);
    setExpandedNodes(all);
  };

  const collapseAll = () => {
    setExpandedNodes({ 'root-db': true });
  };

  const handleCopyJson = () => {
    if (!selectedNode?.data) return;
    navigator.clipboard.writeText(JSON.stringify(selectedNode.data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Analyze Stored vs Empty/Null Fields
  const fieldAnalysis = useMemo(() => {
    if (!selectedNode?.data) return [];
    const record = selectedNode.data;
    const entries = Object.entries(record);

    return entries
      .filter(([key]) => key !== 'vacancies' && key !== 'users' && key !== 'news' && key !== 'auditLogs')
      .map(([key, val]) => {
        const isNullOrEmpty = val === null || val === undefined || val === '' || (Array.isArray(val) && val.length === 0);
        return {
          field: key,
          value: val,
          isStored: !isNullOrEmpty,
          dataType: val === null ? 'null' : Array.isArray(val) ? 'array' : typeof val,
        };
      });
  }, [selectedNode]);

  const storedCount = fieldAnalysis.filter(f => f.isStored).length;
  const missingCount = fieldAnalysis.filter(f => !f.isStored).length;
  const storagePercentage = fieldAnalysis.length > 0 ? Math.round((storedCount / fieldAnalysis.length) * 100) : 0;

  // Filter tree nodes by search term
  const filterNode = (node: ExplorerTreeNode, term: string): boolean => {
    if (node.name.toLowerCase().includes(term)) return true;
    if (node.children) {
      return node.children.some(child => filterNode(child, term));
    }
    return false;
  };

  // Render a single tree node recursively
  const renderTreeNode = (node: ExplorerTreeNode, depth = 0) => {
    if (searchTerm && !filterNode(node, searchTerm.toLowerCase())) {
      return null;
    }

    const isExpanded = !!expandedNodes[node.id] || !!searchTerm;
    const isSelected = selectedNode?.id === node.id;

    return (
      <div key={node.id} className="select-none text-xs">
        <div
          onClick={() => {
            if (node.type === 'folder') {
              toggleNode(node.id);
            }
            if (node.data || node.type === 'file') {
              setSelectedNode(node);
            }
          }}
          style={{ paddingLeft: `${depth * 14 + 8}px` }}
          className={`flex items-center gap-1.5 py-1.5 pr-2.5 rounded-lg cursor-pointer transition-colors group ${
            isSelected 
              ? 'bg-blue-600/30 text-white font-semibold border border-blue-500/50' 
              : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
          }`}
        >
          {/* Chevron for Folders */}
          {node.type === 'folder' ? (
            <span 
              onClick={(e) => {
                e.stopPropagation();
                toggleNode(node.id);
              }}
              className="text-slate-400 hover:text-white p-0.5"
            >
              {isExpanded ? (
                <ChevronDown className="w-3.5 h-3.5" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5" />
              )}
            </span>
          ) : (
            <span className="w-4 shrink-0" />
          )}

          {/* Node Icon */}
          <span className="shrink-0">
            {node.type === 'folder' ? (
              isExpanded ? (
                <FolderOpen className="w-4 h-4 text-amber-400" />
              ) : (
                <Folder className="w-4 h-4 text-amber-500" />
              )
            ) : node.category === 'college' ? (
              <Building2 className="w-4 h-4 text-blue-400" />
            ) : node.category === 'vacancy' ? (
              <Briefcase className="w-4 h-4 text-emerald-400" />
            ) : node.category === 'user' ? (
              <Users className="w-4 h-4 text-purple-400" />
            ) : node.category === 'doc' ? (
              <FileText className="w-4 h-4 text-amber-400" />
            ) : (
              <File className="w-4 h-4 text-slate-400" />
            )}
          </span>

          {/* Node Name */}
          <span className="truncate flex-1 font-mono text-[11px]">{node.name}</span>

          {/* Badge */}
          {node.badge && (
            <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold font-mono shrink-0 uppercase ${
              node.badgeColor === 'green'
                ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                : node.badgeColor === 'rose'
                ? 'bg-rose-950 text-rose-400 border border-rose-800'
                : node.badgeColor === 'amber'
                ? 'bg-amber-950 text-amber-400 border border-amber-800'
                : node.badgeColor === 'purple'
                ? 'bg-purple-950 text-purple-400 border border-purple-800'
                : 'bg-slate-800 text-slate-400 border border-slate-700'
            }`}>
              {node.badge}
            </span>
          )}
        </div>

        {/* Child Nodes */}
        {node.type === 'folder' && isExpanded && node.children && (
          <div className="border-l border-slate-800/80 ml-3.5 my-0.5">
            {node.children.map((child) => renderTreeNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      
      {/* Header Bar */}
      <div className="pb-4 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              REALTIME DATABASE EXPLORER
            </span>
            <span className="text-xs text-slate-400">PostgreSQL 16 @ Aiven Cloud</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight pt-1">
            Database Folder Structure & Storage Completeness
          </h1>
          <p className="text-xs text-slate-400">
            Realtime explorer tree showing what is stored and what is missing in PostgreSQL ("Sirf Dikhega / Read-Only").
          </p>
        </div>

        {/* Realtime Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs">
            <span className="text-slate-400 text-[11px]">Auto-Sync (5s):</span>
            <button
              onClick={() => setAutoSync(!autoSync)}
              className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                autoSync ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'
              }`}
            >
              {autoSync ? 'ON (Active)' : 'PAUSED'}
            </button>
          </div>

          <button
            onClick={() => loadDatabaseTree(true)}
            disabled={refreshing}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold border border-slate-700 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-blue-400' : ''}`} />
            <span>Sync DB</span>
          </button>

          <Link
            href="/colleges"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold shadow-md transition-colors"
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>College Hubs</span>
          </Link>
        </div>
      </div>

      {/* Realtime Status Banner */}
      <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Aiven PostgreSQL Live Cluster</span>
          </div>
          <span className="text-slate-600">•</span>
          <span className="text-slate-400">
            Latency: <strong className="text-white font-mono">{queryLatency}ms</strong>
          </span>
          <span className="text-slate-600">•</span>
          <span className="text-slate-400">
            Last Synced: <strong className="text-white font-mono">{lastSyncTime || 'Connecting...'}</strong>
          </span>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-slate-400">
          <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 font-bold text-slate-300">
            {dbData?.metadata?.counts?.colleges || 0} Colleges
          </span>
          <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 font-bold text-slate-300">
            {dbData?.metadata?.counts?.vacancies || 0} Vacancies
          </span>
          <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 font-bold text-slate-300">
            {dbData?.metadata?.counts?.users || 0} Users
          </span>
        </div>
      </div>

      {/* Main Split Explorer Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 min-h-[650px]">
        
        {/* LEFT PANE: Folder Tree Explorer (5 Cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col justify-between space-y-3">
          <div>
            
            {/* Tree Controls Toolbar */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 gap-2">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Database File Tree
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={expandAll}
                  title="Expand All Folders"
                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-semibold flex items-center gap-1"
                >
                  <Maximize2 className="w-3 h-3" />
                  <span>Expand</span>
                </button>
                <button
                  onClick={collapseAll}
                  title="Collapse All Folders"
                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-semibold flex items-center gap-1"
                >
                  <Minimize2 className="w-3 h-3" />
                  <span>Collapse</span>
                </button>
              </div>
            </div>

            {/* Tree Search Box */}
            <div className="pt-2 pb-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
                <input
                  type="text"
                  placeholder="Filter explorer tree nodes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-2.5 py-1 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>
            </div>

            {/* Tree View Container */}
            <div className="overflow-y-auto max-h-[560px] pr-1 space-y-0.5">
              {loading ? (
                <div className="py-12 text-center text-slate-400 text-xs">
                  <RefreshCw className="w-6 h-6 mx-auto animate-spin text-blue-500 mb-2" />
                  Building live PostgreSQL explorer tree...
                </div>
              ) : treeRoot ? (
                renderTreeNode(treeRoot)
              ) : (
                <div className="py-8 text-center text-slate-400 text-xs">
                  No database tree data available.
                </div>
              )}
            </div>

          </div>

          {/* Tree Footer Legend */}
          <div className="pt-3 border-t border-slate-800/80 text-[10px] text-slate-400 flex flex-wrap items-center justify-between gap-2 bg-slate-950/60 p-2.5 rounded-xl">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>Stored / Active</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              <span>Null / Review</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-400"></span>
              <span>Rejected / Closed</span>
            </div>
          </div>

        </div>

        {/* RIGHT PANE: Realtime Inspector & Field Completeness (7 Cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 flex flex-col justify-between">
          
          <div className="space-y-4">
            
            {/* Read-Only Notice Banner */}
            <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-800/70 text-blue-300 text-xs flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 font-semibold">
                <Lock className="w-4 h-4 text-blue-400 shrink-0" />
                <span>READ-ONLY DATABASE VIEW • DIRECT MUTATIONS DISABLED ("Sirf Dikhega")</span>
              </div>
              <span className="text-[10px] bg-blue-900/80 px-2 py-0.5 rounded font-mono text-blue-200">
                Safe Explorer
              </span>
            </div>

            {selectedNode ? (
              <div className="space-y-4">
                
                {/* Node Identity & Storage Completeness Header */}
                <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-4 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono">
                        <span>bihar_college_db</span>
                        <span>/</span>
                        <span>{selectedNode.data?.table || selectedNode.category || 'record'}</span>
                        <span>/</span>
                        <span className="text-blue-400 font-bold">{selectedNode.name}</span>
                      </div>
                      <h2 className="text-base font-black text-white pt-1">
                        {selectedNode.data?.name || selectedNode.data?.title || selectedNode.data?.email || selectedNode.name}
                      </h2>
                    </div>

                    {selectedNode.data?.id && (
                      <span className="text-[10px] font-mono bg-slate-900 text-slate-400 px-2 py-1 rounded border border-slate-800 shrink-0">
                        ID: {selectedNode.data.id}
                      </span>
                    )}
                  </div>

                  {/* Storage Completeness Gauge */}
                  {fieldAnalysis.length > 0 && (
                    <div className="space-y-1.5 pt-2 border-t border-slate-800">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400 font-semibold flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Field Storage Completeness (Ky Store Hai vs Ky Nahi):</span>
                        </span>
                        <span className="font-bold text-white font-mono">
                          {storedCount} / {fieldAnalysis.length} Fields Populated ({storagePercentage}%)
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-blue-500 to-emerald-400 rounded-full transition-all duration-500"
                          style={{ width: `${storagePercentage}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-slate-500">
                        <span className="text-emerald-400 font-semibold">✓ {storedCount} Populated in PostgreSQL</span>
                        <span className="text-amber-400 font-semibold">⚠ {missingCount} Null / Empty</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Inspector Tabs */}
                <div className="flex items-center gap-2 border-b border-slate-800 pb-2 text-xs font-semibold">
                  <button
                    onClick={() => setInspectorTab('FIELDS')}
                    className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                      inspectorTab === 'FIELDS'
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>Field Breakdown ({fieldAnalysis.length})</span>
                  </button>

                  <button
                    onClick={() => setInspectorTab('JSON')}
                    className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                      inspectorTab === 'JSON'
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Raw JSON Record</span>
                  </button>

                  {selectedNode.data?.table === 'College' && (
                    <button
                      onClick={() => setInspectorTab('RELATIONS')}
                      className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                        inspectorTab === 'RELATIONS'
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      <Building2 className="w-3.5 h-3.5" />
                      <span>Linked Vacancies & Users</span>
                    </button>
                  )}
                </div>

                {/* TAB 1: FIELD BY FIELD (KY STORE HAI, KY NAHI) */}
                {inspectorTab === 'FIELDS' && (
                  <div className="overflow-y-auto max-h-[380px] rounded-xl border border-slate-800">
                    {fieldAnalysis.length === 0 ? (
                      <div className="p-8 text-center text-xs text-slate-400">
                        Click on a file record in the left explorer tree to inspect its stored database fields.
                      </div>
                    ) : (
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-slate-950 text-slate-400 border-b border-slate-800 uppercase text-[10px] font-mono">
                            <th className="p-2.5">Column / Field</th>
                            <th className="p-2.5">Database Status</th>
                            <th className="p-2.5">Stored Value in PostgreSQL</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60 bg-slate-950/60 font-mono text-[11px]">
                          {fieldAnalysis.map(({ field, value, isStored, dataType }) => (
                            <tr key={field} className="hover:bg-slate-900/60 transition-colors">
                              <td className="p-2.5 text-slate-300 font-bold">
                                {field}
                              </td>
                              <td className="p-2.5">
                                {isStored ? (
                                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800 inline-flex items-center gap-1">
                                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                    <span>STORED</span>
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-950/80 text-amber-400 border border-amber-800 inline-flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3 text-amber-400" />
                                    <span>NULL / EMPTY</span>
                                  </span>
                                )}
                              </td>
                              <td className="p-2.5 text-slate-300 max-w-[280px] truncate">
                                {value === null ? (
                                  <span className="text-slate-600 italic">null</span>
                                ) : value === undefined ? (
                                  <span className="text-slate-600 italic">undefined</span>
                                ) : typeof value === 'boolean' ? (
                                  <span className="text-purple-400 font-bold">{value ? 'true' : 'false'}</span>
                                ) : typeof value === 'object' ? (
                                  <span className="text-blue-300">{JSON.stringify(value)}</span>
                                ) : (
                                  <span className="text-slate-200">{String(value)}</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                )}

                {/* TAB 2: RAW JSON VIEW */}
                {inspectorTab === 'JSON' && (
                  <div className="relative bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-xs overflow-y-auto max-h-[380px]">
                    <button
                      onClick={handleCopyJson}
                      className="absolute right-3 top-3 inline-flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[10px] font-semibold transition-colors border border-slate-700"
                    >
                      {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copied ? 'Copied' : 'Copy JSON'}</span>
                    </button>
                    <pre className="text-slate-300 text-[11px] leading-relaxed">
                      {JSON.stringify(selectedNode.data, null, 2)}
                    </pre>
                  </div>
                )}

                {/* TAB 3: RELATIONS */}
                {inspectorTab === 'RELATIONS' && (
                  <div className="space-y-3 overflow-y-auto max-h-[380px]">
                    <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        <Briefcase className="w-4 h-4 text-blue-400" />
                        <span>Direct College Vacancies ({selectedNode.data?.vacancies?.length || 0})</span>
                      </span>
                      {selectedNode.data?.vacancies?.length > 0 ? (
                        <div className="space-y-1.5 pt-1">
                          {selectedNode.data.vacancies.map((v: any) => (
                            <div key={v.id} className="p-2 rounded bg-slate-900 border border-slate-800 text-xs flex items-center justify-between">
                              <div>
                                <div className="font-bold text-white">{v.title}</div>
                                <div className="text-[11px] text-slate-400">{v.department} • Posts: {v.numberOfPosts || 1}</div>
                              </div>
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-950 text-blue-300 border border-blue-800">
                                {v.status}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-slate-500">No vacancies linked to this institution.</p>
                      )}
                    </div>

                    <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        <Users className="w-4 h-4 text-emerald-400" />
                        <span>Assigned User Accounts ({selectedNode.data?.users?.length || 0})</span>
                      </span>
                      {selectedNode.data?.users?.length > 0 ? (
                        <div className="space-y-1.5 pt-1">
                          {selectedNode.data.users.map((u: any) => (
                            <div key={u.id} className="p-2 rounded bg-slate-900 border border-slate-800 text-xs flex items-center justify-between">
                              <div>
                                <div className="font-bold text-white">{u.name}</div>
                                <div className="text-[11px] text-slate-400 font-mono">{u.email}</div>
                              </div>
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                                {u.role}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-slate-500">No admin users linked yet.</p>
                      )}
                    </div>
                  </div>
                )}

              </div>
            ) : (
              <div className="py-24 text-center text-slate-400 text-xs space-y-3">
                <Database className="w-10 h-10 text-slate-700 mx-auto" />
                <h3 className="text-sm font-bold text-white">Select a Node to Inspect</h3>
                <p className="text-slate-500 max-w-sm mx-auto">
                  Click on any table folder or JSON file record in the left tree to inspect its complete database status in real-time.
                </p>
              </div>
            )}

          </div>

          {/* Action Links / Jump to Console */}
          {selectedNode?.data?.id && (
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-500">
                Direct Console Navigation:
              </span>
              <div className="flex items-center gap-2">
                {selectedNode.data.table === 'College' && (
                  <Link
                    href={`/colleges/${selectedNode.data.id}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold shadow-sm transition-colors"
                  >
                    <span>Open College Dossier</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                )}
                {selectedNode.data.table === 'Vacancy' && (
                  <Link
                    href="/vacancies"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold shadow-sm transition-colors"
                  >
                    <span>Open Vacancies Console</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
