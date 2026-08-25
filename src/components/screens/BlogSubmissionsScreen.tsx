import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import {
  FileText,
  Plus,
  CheckCircle,
  Eye,
  Clock,
  Building2,
  Mail,
  Send,
  Zap,
} from 'lucide-react';
import { BlogPost, BlogStatus } from '../../types';

export const BlogSubmissionsScreen: React.FC = () => {
  const { currentUser, currentRole, can, blogs, updateBlogStatus, createBlog } = useData();

  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('CleanTech, Northern Powerhouse, India Corridors');

  const canApprove = can('approve_intros_blogs');

  const handleBlogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    createBlog({
      title,
      author_person_id: 'per_007',
      author_name: currentUser.full_name,
      organisation_name: 'SteelPeak Ltd',
      content,
      tags: tags.split(',').map((t) => t.trim()),
      views_count: 0,
      status: 'Submitted',
    });

    setIsSubmitModalOpen(false);
    setTitle('');
    setContent('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-semibold text-slate-900 tracking-tight">
              Thought Leadership & Member Insights
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-900 border border-purple-300">
              Chamber Editorial Review
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Member-authored market analyses, supply chain forecasts, and bilateral innovation case studies.
          </p>
        </div>

        <button
          onClick={() => setIsSubmitModalOpen(true)}
          className="px-3.5 py-2 bg-ink text-cream hover:bg-ink-2 rounded-xl text-xs font-bold  transition-colors flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          Submit Article for Review
        </button>
      </div>

      {/* Blogs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {blogs.map((blog) => (
          <div
            key={blog.id}
            className="bg-cream border border-line rounded-lg p-6  hover: transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    blog.status === 'Published'
                      ? 'bg-emerald-100 text-emerald-800'
                      : blog.status === 'Approved'
                      ? 'bg-blue-100 text-blue-800'
                      : blog.status === 'Submitted'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {blog.status}
                </span>

                <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                  <Eye className="w-3.5 h-3.5 text-slate-400" />
                  {((blog as any).views_count ?? blog.views ?? 0).toLocaleString()} Views
                </span>
              </div>

              <div>
                <h3 className="text-base font-semibold text-slate-900">{blog.title}</h3>
                <p className="text-xs text-slate-500 mt-0.5 font-medium">
                  By {blog.author_name} ({blog.organisation_name || 'Member'}) ·{' '}
                  {new Date((blog as any).created_at || blog.submitted_at || new Date()).toLocaleDateString()}
                </p>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100 line-clamp-3">
                {(blog as any).content || blog.summary || 'No summary provided.'}
              </p>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {((blog as any).tags || [blog.package]).map((tag: string, idx: number) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-semibold"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Editorial Review Actions for Marketing / Super Admin */}
            {canApprove && (
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400 uppercase">
                  Chamber Editor:
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => updateBlogStatus(blog.id, 'Published')}
                    disabled={blog.status === 'Published'}
                    className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors"
                  >
                    Publish
                  </button>
                  <button
                    onClick={() => updateBlogStatus(blog.id, 'Approved')}
                    disabled={blog.status === 'Approved'}
                    className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => updateBlogStatus(blog.id, 'Rejected')}
                    className="px-2 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs"
                  >
                    Reject
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Submit Blog Modal */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-cream border border-line rounded-lg w-full max-w-lg  p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-600" />
                Submit Article for Editorial Review
              </h3>
              <button
                onClick={() => setIsSubmitModalOpen(false)}
                className="text-xs text-slate-400 hover:text-slate-600 font-bold"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleBlogSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Article Headline</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-900"
                  placeholder="e.g. Navigating Sheffield-Maharashtra Supply Chains in Clean Alloys"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-900"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Article Body / Executive Summary
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={6}
                  required
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-900"
                  placeholder="Provide deep industrial insights, regulatory observations, and strategic bilateral commentary..."
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsSubmitModalOpen(false)}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-ink text-cream hover:bg-ink-2 font-semibold rounded-lg "
                >
                  Submit to Editorial Desk
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export const NewsletterCreditsScreen: React.FC = () => {
  const { newsletterCredits, useNewsletterCredit, addToCart, setActiveTab } = useData();

  const [featureHeadline, setFeatureHeadline] = useState('');
  const [featureUrl, setFeatureUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const credits = newsletterCredits[0] || {
    id: 'nwc_001',
    organisation_id: 'org_002',
    organisation_name: 'SteelPeak Ltd',
    credits_bought: 6,
    credits_used: 2,
    credits_remaining: 4,
  };

  const handleUseCredit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!featureHeadline) return;

    useNewsletterCredit(credits.id);
    alert(
      `Feature headline "${featureHeadline}" submitted for the upcoming Thursday Chamber Broadcast (14,500 bilateral subscribers)!`
    );
    setFeatureHeadline('');
    setFeatureUrl('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-semibold text-slate-900 tracking-tight">
              Newsletter Spotlight & Promotional Credits
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
              14,500+ Bilateral Decision Makers
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Feature your company product launches, trade mission announcements, or hiring spotlights in the weekly chamber digest.
          </p>
        </div>

        <button
          onClick={() => {
            addToCart({
              id: 'prod_002',
              title: 'Newsletter Spotlight Feature (1 Slot)',
              type: 'Add-on',
              unit_price_gbp: 450,
              unit_price_inr: 47250,
              quantity: 1,
            });
            setActiveTab('shop');
          }}
          className="px-3.5 py-2 bg-ink text-cream hover:bg-ink-2 rounded-xl text-xs font-bold  transition-colors flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          Buy Additional Credits (£450)
        </button>
      </div>

      {/* Credit Balance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-cream border border-line rounded-lg p-5 ">
          <span className="text-slate-500 text-xs font-bold uppercase">Allocated Credits</span>
          <p className="text-3xl font-semibold text-slate-900 mt-1">{credits.credits_bought}</p>
          <span className="text-xs text-slate-500">Corporate member annual quota</span>
        </div>

        <div className="bg-cream border border-line rounded-lg p-5 ">
          <span className="text-slate-500 text-xs font-bold uppercase">Credits Used</span>
          <p className="text-3xl font-semibold text-slate-600 mt-1">{credits.credits_used}</p>
          <span className="text-xs text-slate-500">2 features distributed in 2026</span>
        </div>

        <div className="bg-cream border border-line rounded-lg p-5 ">
          <span className="text-slate-500 text-xs font-bold uppercase">Credits Available</span>
          <p className="text-3xl font-semibold text-emerald-600 mt-1">{credits.credits_remaining}</p>
          <span className="text-xs text-emerald-700 font-semibold">Ready for submission</span>
        </div>
      </div>

      {/* Submission Form */}
      <div className="bg-cream border border-line rounded-lg p-6  space-y-4">
        <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
          <Mail className="w-4 h-4 text-amber-600" />
          Submit a Company Spotlight for Next Thursday's Broadcast
        </h3>

        <form onSubmit={handleUseCredit} className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">
              Spotlight Headline (Max 120 chars)
            </label>
            <input
              type="text"
              value={featureHeadline}
              onChange={(e) => setFeatureHeadline(e.target.value)}
              required
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 font-semibold"
              placeholder="e.g. SteelPeak Ltd Announces New Clean Metallurgy Processing Line in Sheffield"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Target Landing Page URL</label>
            <input
              type="url"
              value={featureUrl}
              onChange={(e) => setFeatureUrl(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900"
              placeholder="https://steelpeak.example.com/press-release"
            />
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
            <span className="text-slate-600">
              Deducts <strong>1 credit</strong> from your remaining balance of{' '}
              <strong className="text-emerald-700">{credits.credits_remaining}</strong>.
            </span>

            <button
              type="submit"
              disabled={credits.credits_remaining <= 0}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs "
            >
              Submit Feature & Deduct Credit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
