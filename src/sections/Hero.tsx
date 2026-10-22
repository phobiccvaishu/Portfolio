import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { ResumeModal } from '../components/ResumeModal';
import {
  ArrowDown,
  FileText,
  Mail,
  Github,
  Linkedin,
  CheckCircle2,
  Code2,
  Phone,
  Terminal,
  Award,
  BookOpen
} from 'lucide-react';

export const Hero: React.FC = () => {
  const { data } = usePortfolio();
  const [showResumeModal, setShowResumeModal] = useState(false);

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-grid-pattern">
      {/* Subtle radial glow */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-20 w-96 h-96 bg-white/[0.02] rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Main Hero Copy (8 cols) */}
          <div className="lg:col-span-8 space-y-6 sm:space-y-8 text-left">
            
            {/* Status & Verification Pill */}
            <div className="inline-flex flex-wrap items-center gap-2 px-3 py-1.5 rounded-full bg-canvas-muted border border-canvas-border text-xs text-ink-secondary">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
              </span>
              <span className="font-mono text-ink-secondary">B.Tech CSE @ SRMIST</span>
              <span className="text-canvas-border">|</span>
              <span className="text-accent font-semibold font-mono">CGPA: {data.profile.cgpa || '8.60/10.00'}</span>
              <span className="text-canvas-border">|</span>
              <span className="inline-flex items-center gap-1 text-ink-muted">
                <CheckCircle2 className="w-3.5 h-3.5 text-accent" />
                Verified e-Resume
              </span>
            </div>

            {/* Headline */}
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold text-ink tracking-tightest leading-[1.08]">
                Building <span className="text-accent underline decoration-accent/30 underline-offset-8">intelligent</span> systems. <br />
                Turning ideas into impact.
              </h1>
              <p className="text-lg sm:text-xl text-ink-secondary max-w-2xl font-light leading-relaxed">
                {data.profile.supportingStatement}
              </p>
            </div>

            {/* Badges / Active Engagements */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs font-mono text-ink-muted uppercase tracking-wider mr-1">Active Roles:</span>
              <span className="text-xs px-2.5 py-1 rounded-md bg-accent-muted text-accent border border-accent-border font-mono font-medium">
                C-DAC AI/ML Trainee (Ongoing)
              </span>
              <span className="text-xs px-2.5 py-1 rounded-md bg-canvas-muted text-ink border border-canvas-border font-mono">
                Unified Mentor Intern (Ongoing)
              </span>
              <span className="text-xs px-2.5 py-1 rounded-md bg-canvas-muted text-ink-secondary border border-canvas-border font-mono">
                Reqruit IQ Research Paper (Ongoing)
              </span>
            </div>

            {/* Actions / CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <a
                href="#projects"
                className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-xl bg-accent text-black font-semibold text-sm hover:bg-accent-hover transition-all shadow-md shadow-accent/10 active:scale-95"
              >
                <span>Explore My Work</span>
                <ArrowDown className="w-4 h-4" />
              </a>

              <button
                onClick={() => setShowResumeModal(true)}
                className="inline-flex items-center space-x-2 px-5 py-3.5 rounded-xl bg-canvas-muted hover:bg-canvas-surface text-ink font-medium text-sm border border-canvas-border hover:border-canvas-borderStrong transition-all group"
              >
                <FileText className="w-4 h-4 text-accent group-hover:scale-110 transition-transform" />
                <span>View & Download e-Resume</span>
              </button>

              <a
                href="#contact"
                className="inline-flex items-center space-x-2 px-5 py-3.5 rounded-xl bg-canvas-muted hover:bg-canvas-surface text-ink-secondary hover:text-ink font-medium text-sm border border-canvas-border hover:border-canvas-borderStrong transition-all"
              >
                <Mail className="w-4 h-4" />
                <span>Let's Connect</span>
              </a>
            </div>

            {/* Social & Contact Links Bar */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-4 text-xs font-mono text-ink-muted">
              <a
                href={`https://github.com/${data.profile.githubUsername}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1.5 hover:text-accent transition-colors"
              >
                <Github className="w-4 h-4" />
                <span>github.com/{data.profile.githubUsername}</span>
              </a>
              <span className="text-canvas-border hidden sm:inline">|</span>
              <a
                href={`https://www.linkedin.com/in/${data.profile.linkedinSlug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1.5 hover:text-accent transition-colors"
              >
                <Linkedin className="w-4 h-4" />
                <span>LinkedIn</span>
              </a>
              <span className="text-canvas-border hidden sm:inline">|</span>
              <a
                href={data.profile.leetcodeUrl || "https://leetcode.com/u/phobiccvaishu"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1.5 text-accent hover:underline font-semibold"
              >
                <Code2 className="w-4 h-4" />
                <span>LeetCode</span>
              </a>
              {data.profile.phone && (
                <>
                  <span className="text-canvas-border hidden sm:inline">|</span>
                  <a
                    href={`tel:${data.profile.phone}`}
                    className="flex items-center space-x-1.5 hover:text-accent transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>{data.profile.phone}</span>
                  </a>
                </>
              )}
            </div>

          </div>

          {/* Identity Card (4 cols) */}
          <div className="lg:col-span-4 flex justify-center lg:justify-end">
            <div className="w-full max-w-sm bg-canvas-subtle border border-canvas-border rounded-2xl p-6 relative group shadow-2xl">
              
              {/* Header inside card */}
              <div className="flex items-center justify-between pb-4 border-b border-canvas-border">
                <div className="flex items-center space-x-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse" />
                  <span className="font-mono text-xs text-ink-muted uppercase tracking-wider">Candidate Profile</span>
                </div>
                <div className="text-[11px] font-mono text-accent">CGPA 8.60</div>
              </div>

              {/* Portrait / Avatar */}
              <div className="my-6 relative flex justify-center">
                <div className="relative w-48 h-48 rounded-2xl overflow-hidden border-2 border-canvas-border group-hover:border-accent/50 transition-all bg-canvas-muted p-1">
                  {data.profile.avatarUrl ? (
                    <img
                      src={data.profile.avatarUrl}
                      alt={data.profile.name}
                      className="w-full h-full object-cover rounded-xl filter grayscale contrast-125 group-hover:grayscale-0 transition-all duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-canvas-surface rounded-xl">
                      <span className="font-display font-extrabold text-4xl text-accent">VS</span>
                      <span className="font-mono text-xs text-ink-muted mt-2">Vaishnavi</span>
                    </div>
                  )}
                  {/* Subtle code overlay chip */}
                  <div className="absolute bottom-2 left-2 right-2 px-2 py-1 bg-canvas/90 backdrop-blur-sm rounded-lg border border-canvas-border flex items-center justify-between">
                    <span className="font-mono text-[10px] text-accent">@phobiccvaishu</span>
                    <Terminal className="w-3 h-3 text-ink-muted" />
                  </div>
                </div>
              </div>

              {/* Quick Metrics */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 bg-canvas-muted rounded-xl border border-canvas-border text-left">
                  <div className="text-xl font-display font-bold text-ink">8.60</div>
                  <div className="text-[11px] font-mono text-ink-muted mt-0.5">SRMIST CGPA</div>
                </div>
                <div className="p-3 bg-canvas-muted rounded-xl border border-canvas-border text-left">
                  <div className="text-xl font-display font-bold text-accent">Active</div>
                  <div className="text-[11px] font-mono text-ink-muted mt-0.5">LeetCode DSA</div>
                </div>
              </div>

              {/* Trajectory Footnote */}
              <div className="mt-4 pt-3 border-t border-canvas-border text-left space-y-1.5 text-xs font-mono">
                <div className="text-ink-secondary flex items-center justify-between">
                  <span className="text-ink-muted">Specialization:</span>
                  <span className="text-accent">C-DAC AI/ML Trainee</span>
                </div>
                <div className="text-ink-secondary flex items-center justify-between">
                  <span className="text-ink-muted">Internship:</span>
                  <span className="text-ink font-medium">Unified Mentor (Online)</span>
                </div>
                <div className="text-ink-secondary flex items-center justify-between">
                  <span className="text-ink-muted">Research:</span>
                  <span className="text-ink font-medium">Reqruit IQ Paper</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* Render the full verified e-Resume Modal */}
      <ResumeModal isOpen={showResumeModal} onClose={() => setShowResumeModal(false)} />
    </section>
  );
};
