import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Mail, Github, Linkedin, MapPin, Send, CheckCircle2, AlertCircle, Copy, Check } from 'lucide-react';

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
        setErrorMessage(json.error || 'Failed to submit message. Please try emailing directly.');
      }
    } catch (err: any) {
      // In case server is offline or frontend-only mode
      setStatus('error');
      setErrorMessage('Local server not reachable. Please send an email directly to vaishnavi1657@gmail.com.');
    }
  };

  return (
    <section id="contact" className="py-20 md:py-28 border-t border-canvas-border relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-left space-y-3 mb-14">
          <div className="inline-flex items-center space-x-2 text-xs font-mono text-accent uppercase tracking-widest">
            <span>06 // Connect</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-ink tracking-tight">
            Initiate Conversation
          </h2>
          <p className="text-base text-ink-secondary max-w-xl">
            Interested in discussing AI/ML engineering, student internships, or technical collaborations? Feel free to reach out.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Direct Verified Channels (5 cols) */}
          <div className="lg:col-span-5 space-y-6 text-left">
            <div className="p-6 rounded-2xl bg-canvas-subtle border border-canvas-border space-y-6">
              <h3 className="font-display font-bold text-lg text-ink">
                Direct Channels
              </h3>

              {/* Email Card with Copy button */}
              <div className="p-4 rounded-xl bg-canvas-muted border border-canvas-border space-y-2">
                <div className="text-xs font-mono text-ink-muted flex items-center justify-between">
                  <span>Verified Email</span>
                  <button
                    onClick={handleCopyEmail}
                    className="inline-flex items-center space-x-1 text-accent hover:underline text-[11px]"
                  >
                    {copiedEmail ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedEmail ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <a
                  href={`mailto:${data.profile.email}`}
                  className="font-mono text-sm sm:text-base text-ink hover:text-accent font-medium block truncate transition-colors"
                >
                  {data.profile.email}
                </a>
              </div>

              {/* GitHub */}
              <a
                href={`https://github.com/${data.profile.githubUsername}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 p-4 rounded-xl bg-canvas-muted border border-canvas-border hover:border-canvas-borderStrong transition-all group"
              >
                <div className="p-2 rounded-lg bg-canvas-surface text-ink group-hover:text-accent transition-colors">
                  <Github className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-mono text-ink-muted">GitHub Profile</div>
                  <div className="text-sm font-semibold text-ink group-hover:text-accent transition-colors">
                    github.com/{data.profile.githubUsername}
                  </div>
                </div>
              </a>

              {/* LinkedIn */}
              <a
                href={`https://www.linkedin.com/in/${data.profile.linkedinSlug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 p-4 rounded-xl bg-canvas-muted border border-canvas-border hover:border-canvas-borderStrong transition-all group"
              >
                <div className="p-2 rounded-lg bg-canvas-surface text-ink group-hover:text-accent transition-colors">
                  <Linkedin className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-mono text-ink-muted">LinkedIn Network</div>
                  <div className="text-sm font-semibold text-ink group-hover:text-accent transition-colors">
                    linkedin.com/in/{data.profile.linkedinSlug}
                  </div>
                </div>
              </a>

              {/* Location */}
              <div className="flex items-center space-x-3 p-4 rounded-xl bg-canvas-muted/50 border border-canvas-border">
                <div className="p-2 rounded-lg bg-canvas-surface text-accent">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-mono text-ink-muted">Current Location</div>
                  <div className="text-sm font-medium text-ink">
                    {data.profile.location}
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Contact Dispatch Form (7 cols) */}
          <div className="lg:col-span-7">
            <form
              onSubmit={handleSubmit}
              className="p-6 sm:p-8 rounded-2xl bg-canvas-subtle border border-canvas-border space-y-5 text-left"
            >
              <h3 className="font-display font-bold text-xl text-ink">
                Send an Inquiry
              </h3>
              <p className="text-xs text-ink-secondary">
                Validated message form securely logged to the backend server.
              </p>

              {status === 'success' && (
                <div className="p-4 rounded-xl bg-accent-muted border border-accent-border flex items-start space-x-3 text-xs text-ink">
                  <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-accent">Message dispatched successfully!</span>
                    <p className="text-ink-secondary mt-0.5">
                      Your inquiry has been registered in the database. I will review it and reply promptly.
                    </p>
                  </div>
                </div>
              )}

              {status === 'error' && (
                <div className="p-4 rounded-xl bg-red-950/40 border border-red-800/50 flex items-start space-x-3 text-xs text-red-300">
                  <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold">Notice:</span> {errorMessage}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-ink-muted">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Alex Rivera"
                    className="w-full bg-canvas-muted border border-canvas-border rounded-xl px-4 py-2.5 text-sm text-ink placeholder:text-ink-muted focus:outline-none focus:border-accent"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-ink-muted">Your Email *</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="alex@company.com"
                    className="w-full bg-canvas-muted border border-canvas-border rounded-xl px-4 py-2.5 text-sm text-ink placeholder:text-ink-muted focus:outline-none focus:border-accent"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-ink-muted">Subject *</label>
                <input
                  type="text"
                  required
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  placeholder="Internship opportunity / Technical question"
                  className="w-full bg-canvas-muted border border-canvas-border rounded-xl px-4 py-2.5 text-sm text-ink placeholder:text-ink-muted focus:outline-none focus:border-accent"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-ink-muted">Message *</label>
                <textarea
                  required
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Briefly describe your team, role, or project..."
                  className="w-full bg-canvas-muted border border-canvas-border rounded-xl p-4 text-sm text-ink placeholder:text-ink-muted focus:outline-none focus:border-accent resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={status === 'submitting'}
                className="w-full py-3.5 rounded-xl bg-accent text-black font-semibold text-sm hover:bg-accent-hover transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{status === 'submitting' ? 'Dispatching Message...' : 'Send Message'}</span>
              </button>

              <div className="text-[11px] font-mono text-ink-muted text-center pt-1">
                Data sent securely directly to Vaishnavi's local server storage.
              </div>
            </form>
          </div>

        </div>

      </div>
    </section>
  );
};
