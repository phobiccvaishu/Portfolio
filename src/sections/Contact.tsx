import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';

export const Contact: React.FC = () => {
  const { data } = usePortfolio();

  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(data.profile.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setStatus('success');
        setForm({ name: '', email: '', subject: '', message: '' });
      } else {
        setStatus('error');
        const errDetail = json.error || 
          (json.errors ? Object.values(json.errors).flat().join('. ') : 'Failed to submit message. Please try again or email directly.');
        setErrorMessage(errDetail);
      }
    } catch (err: any) {
      setStatus('error');
      setErrorMessage('Server connection offline. Please email directly to ' + data.profile.email);
    }
  };

  return (
    <section id="contact" className="py-20 sm:py-28 border-b border-canvas-border text-left">
      <div className="max-w-editorial mx-auto px-5 sm:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-12 sm:mb-16 pb-4 border-b border-canvas-border gap-4">
          <div className="flex items-baseline space-x-3">
            <span className="font-mono text-xs uppercase tracking-widest text-accent">06 /</span>
            <h2 className="font-display text-3xl sm:text-4xl text-ink font-normal tracking-tight">
              Contact & Inquiries
            </h2>
          </div>
          <span className="font-mono text-xs text-ink-secondary uppercase tracking-widest">
            Direct Communication
          </span>
        </div>

        {/* 12-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Direct Text Links (5 cols) */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-3">
              <h3 className="font-mono text-xs text-ink uppercase tracking-widest">
                Direct Channels
              </h3>
              <p className="text-sm text-ink-secondary leading-relaxed">
                For internship inquiries, engineering collaborations, or questions regarding my research and codebases.
              </p>
            </div>

            <div className="space-y-4 font-mono text-sm border-t border-canvas-border pt-6">
              <div className="space-y-1">
                <div className="text-[11px] text-ink-secondary uppercase tracking-wider">Email Address</div>
                <div className="flex items-baseline space-x-3">
                  <a
                    href={`mailto:${data.profile.email}`}
                    className="editorial-link text-ink hover:text-accent font-medium"
                  >
                    {data.profile.email}
                  </a>
                  <button
                    onClick={handleCopyEmail}
                    className="text-[11px] text-accent uppercase tracking-wider hover:underline"
                  >
                    {copiedEmail ? '[Copied]' : '[Copy]'}
                  </button>
                </div>
              </div>

              {data.profile.phone && (
                <div className="space-y-1 pt-2">
                  <div className="text-[11px] text-ink-secondary uppercase tracking-wider">Telephone</div>
                  <a
                    href={`tel:${data.profile.phone}`}
                    className="editorial-link text-ink hover:text-accent"
                  >
                    {data.profile.phone}
                  </a>
                </div>
              )}

              <div className="space-y-1 pt-2">
                <div className="text-[11px] text-ink-secondary uppercase tracking-wider">Profiles</div>
                <div className="flex flex-wrap gap-x-5 gap-y-1">
                  <a
                    href={`https://github.com/${data.profile.githubUsername}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="editorial-link text-ink hover:text-accent"
                  >
                    GitHub &nearr;
                  </a>
                  <a
                    href={`https://www.linkedin.com/in/${data.profile.linkedinSlug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="editorial-link text-ink hover:text-accent"
                  >
                    LinkedIn &nearr;
                  </a>
                  <a
                    href={data.profile.leetcodeUrl || "https://leetcode.com/u/vaish_phob/"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="editorial-link text-ink hover:text-accent"
                  >
                    LeetCode &nearr;
                  </a>
                </div>
              </div>

              <div className="space-y-1 pt-2">
                <div className="text-[11px] text-ink-secondary uppercase tracking-wider">Location</div>
                <div className="text-ink">{data.profile.location}</div>
              </div>
            </div>
          </div>

          {/* Underline-Only Form (7 cols) */}
          <div className="lg:col-span-7">
            <form onSubmit={handleSubmit} className="space-y-6 text-left">
              <h3 className="font-mono text-xs text-ink uppercase tracking-widest pb-2 border-b border-canvas-border">
                Send a Message
              </h3>

              {status === 'success' && (
                <div className="p-3 bg-canvas-surface border-l-2 border-accent text-xs font-mono text-ink">
                  Message logged to server storage. I will reply via email shortly.
                </div>
              )}

              {status === 'error' && (
                <div className="p-3 bg-canvas-surface border-l-2 border-accent text-xs font-mono text-accent">
                  {errorMessage}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="font-mono text-[11px] text-ink-secondary uppercase tracking-wider">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-transparent border-b border-canvas-border focus:border-accent text-ink text-sm py-2.5 outline-none rounded-none transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-mono text-[11px] text-ink-secondary uppercase tracking-wider">
                    Your Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full bg-transparent border-b border-canvas-border focus:border-accent text-ink text-sm py-2.5 outline-none rounded-none transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-mono text-[11px] text-ink-secondary uppercase tracking-wider">
                  Subject *
                </label>
                <input
                  type="text"
                  required
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="w-full bg-transparent border-b border-canvas-border focus:border-accent text-ink text-sm py-2.5 outline-none rounded-none transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="font-mono text-[11px] text-ink-secondary uppercase tracking-wider">
                  Message Content *
                </label>
                <textarea
                  required
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full bg-transparent border-b border-canvas-border focus:border-accent text-ink text-sm py-2.5 outline-none rounded-none resize-none transition-colors font-sans"
                />
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="px-6 py-2.5 bg-ink text-canvas hover:bg-accent hover:text-white transition-colors font-mono text-xs uppercase tracking-widest disabled:opacity-50"
                >
                  {status === 'submitting' ? 'Transmitting...' : 'Dispatch Message'}
                </button>

                <span className="font-mono text-[10px] text-ink-secondary uppercase">
                  Logged in server/data/messages.json
                </span>
              </div>
            </form>
          </div>

        </div>

      </div>
    </section>
  );
};
