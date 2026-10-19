'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  MessageSquare, 
  ThumbsUp, 
  Share2, 
  Trash2, 
  PlusCircle, 
  Search, 
  Tag, 
  ShieldAlert, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  User, 
  Sparkles,
  GraduationCap,
  Briefcase,
  BookOpen,
  Filter,
  X
} from 'lucide-react';

interface CommunityPost {
  id: string;
  title: string;
  content: string;
  category: string;
  authorName: string;
  authorRole: string;
  likes: number;
  isFlagged: boolean;
  createdAt: string;
}

export default function CommunityPage() {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [sessionUser, setSessionUser] = useState<any>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New post form state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('RECRUITMENT');
  const [authorName, setAuthorName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchSession = async () => {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      if (data.success && data.user) {
        setSessionUser(data.user);
        setAuthorName(data.user.name);
      }
    } catch (e) {}
  };

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const url = selectedCategory === 'ALL' ? '/api/community' : `/api/community?category=${selectedCategory}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setPosts(data.posts);
      }
    } catch (err) {
      console.error('Failed to load community discussions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSession();
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [selectedCategory]);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    try {
      setSubmitting(true);
      const res = await fetch('/api/community', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          content,
          category,
          authorName: sessionUser?.name || authorName || 'Candidate Member',
          authorEmail: sessionUser?.email || null,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setPosts(prev => [data.post, ...prev]);
        setShowNewPostModal(false);
        setTitle('');
        setContent('');
        setToastMessage('Your post has been published to the community feed!');
        setTimeout(() => setToastMessage(null), 3500);
      } else {
        alert(data.error || 'Failed to create post');
      }
    } catch (err) {
      console.error('Failed to create post:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = async (postId: string) => {
    try {
      setPosts(prev => prev.map(p => p.id === postId ? { ...p, likes: p.likes + 1 } : p));
      await fetch(`/api/community/${postId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'like' }),
      });
    } catch (err) {
      console.error('Failed to like post:', err);
    }
  };

  const handleDeletePost = async (postId: string, postTitle: string) => {
    const confirmDelete = window.confirm(`Admin Moderation Action:\n\nAre you sure you want to permanently delete "${postTitle}" as unauthorized or inappropriate content?`);
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/community/${postId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setPosts(prev => prev.filter(p => p.id !== postId));
        setToastMessage(`Post deleted successfully under moderation policy.`);
        setTimeout(() => setToastMessage(null), 3500);
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (err) {
      console.error('Failed to delete post:', err);
    }
  };

  const filteredPosts = posts.filter(p => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      p.title.toLowerCase().includes(term) ||
      p.content.toLowerCase().includes(term) ||
      p.authorName.toLowerCase().includes(term)
    );
  });

  const categories = [
    { label: 'All Discussions', value: 'ALL' },
    { label: 'Recruitment & Jobs', value: 'RECRUITMENT' },
    { label: 'Exam & Circular Updates', value: 'EXAM_UPDATE' },
    { label: 'Study Material & Syllabus', value: 'STUDY_MATERIAL' },
    { label: 'Campus Life & Doubts', value: 'CAMPUS_LIFE' },
    { label: 'General', value: 'GENERAL' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Hero Header */}
      <div className="relative rounded-3xl p-6 sm:p-10 overflow-hidden bg-gradient-to-br from-navy-900 via-navy-800 to-blue-900 text-white shadow-2xl border border-navy-700/50">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>COMMUNITY VOICE & CANDIDATE NETWORK</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
              VidyaSetu Community Hub
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Connect with fellow candidates, teachers, and scholars across Bihar. Share preparation tips, syllabus alerts, exam doubts, and official circular reviews.
            </p>
          </div>

          <button
            onClick={() => setShowNewPostModal(true)}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl hover:shadow-blue-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 shrink-0"
          >
            <PlusCircle className="w-5 h-5" />
            <span>Start a Discussion</span>
          </button>
        </div>
      </div>

      {toastMessage && (
        <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs font-semibold flex items-center gap-2.5 shadow-lg animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-3.5 py-2 font-semibold rounded-xl transition-all shrink-0 ${
                selectedCategory === cat.value
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search discussions & updates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-blue-500 shadow-xs"
          />
        </div>
      </div>

      {/* Community Feed Posts */}
      <div className="space-y-4">
        {loading ? (
          <div className="py-20 text-center text-slate-400 text-xs space-y-2">
            <div className="w-8 h-8 mx-auto border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <p>Loading community discussions...</p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center space-y-3 shadow-xs">
            <MessageSquare className="w-12 h-12 text-slate-400 mx-auto" />
            <h3 className="text-base font-bold text-slate-800 dark:text-white">No Discussions Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Be the first to start a conversation in this topic! Ask a recruitment question or share a new vacancy update.
            </p>
            <button
              onClick={() => setShowNewPostModal(true)}
              className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-500 shadow-md transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create Post</span>
            </button>
          </div>
        ) : (
          filteredPosts.map((post) => (
            <div 
              key={post.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-all space-y-4"
            >
              {/* Post Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                      {post.category}
                    </span>
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    </span>
                  </div>
                  <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white pt-0.5">
                    {post.title}
                  </h2>
                </div>

                {/* Author Info */}
                <div className="flex items-center gap-2.5 text-xs text-slate-500 shrink-0">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold flex items-center justify-center text-xs shadow-xs">
                    {post.authorName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-bold text-slate-800 dark:text-slate-200">{post.authorName}</div>
                    <div className="text-[10px] text-slate-400">{post.authorRole}</div>
                  </div>
                </div>
              </div>

              {/* Post Content */}
              <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line bg-slate-50 dark:bg-slate-950/60 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                {post.content}
              </div>

              {/* Post Footer Action Strip */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80 text-xs">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleLike(post.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/50 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-semibold transition-colors"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>{post.likes} Helpful</span>
                  </button>

                  <button
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({ title: post.title, text: post.content, url: window.location.href });
                      } else {
                        navigator.clipboard.writeText(window.location.href);
                        setToastMessage('Link copied to clipboard!');
                        setTimeout(() => setToastMessage(null), 3000);
                      }
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 font-semibold transition-colors"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Share</span>
                  </button>
                </div>

                {/* Content Moderation Delete Button */}
                <button
                  type="button"
                  onClick={() => handleDeletePost(post.id, post.title)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-rose-500 hover:text-white hover:bg-rose-600 dark:hover:bg-rose-950 border border-transparent hover:border-rose-600 transition-all font-semibold text-[11px]"
                  title="Moderate / Delete unauthorized content"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Moderate / Delete</span>
                </button>
              </div>

            </div>
          ))
        )}
      </div>

      {/* New Post Modal */}
      {showNewPostModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-600 flex items-center justify-center">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Start Community Discussion
                </h3>
              </div>
              <button
                onClick={() => setShowNewPostModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-4">
              
              {!sessionUser && (
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Your Name / Display Title
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Priya Sharma / Candidate (B.Tech)"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                  />
                </div>
              )}

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Topic Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="RECRUITMENT">Recruitment & Jobs</option>
                  <option value="EXAM_UPDATE">Exam & Circular Updates</option>
                  <option value="STUDY_MATERIAL">Study Material & Syllabus</option>
                  <option value="CAMPUS_LIFE">Campus Life & Doubts</option>
                  <option value="GENERAL">General Discussion</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Discussion Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Query regarding polytechnic assistant professor qualification criteria"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Discussion Content & Details
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Provide context, references, or specific questions..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 leading-relaxed"
                />
              </div>

              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-[11px] text-amber-800 dark:text-amber-300 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0 text-amber-600" />
                <span>
                  Please maintain respectful academic discourse. Unauthorized, commercial spam, or illegal posts will be deleted by administrators.
                </span>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowNewPostModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md transition-all disabled:opacity-50"
                >
                  {submitting ? 'Publishing...' : 'Publish to Community'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
