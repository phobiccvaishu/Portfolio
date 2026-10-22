import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Github, Linkedin, Mail, ArrowUp } from 'lucide-react';

export const Footer: React.FC = () => {
  const { data } = usePortfolio();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-canvas-border bg-canvas-subtle py-12 text-ink-secondary text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          <div className="text-left space-y-1">
            <div className="flex items-center space-x-2">
              <span className="font-display font-bold text-ink text-sm">
                {data.profile.name}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              <span className="font-mono text-ink-muted text-[11px]">SRMIST Computer Science</span>
            </div>
            <p className="text-ink-muted">
              Designed with refined editorial minimalism. Grounded strictly in authentic engineering data.
            </p>
          </div>

          <div className="flex items-center space-x-6 text-xs font-mono">
            <a
              href={`https://github.com/${data.profile.githubUsername}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-accent transition-colors"
            >
              GitHub
            </a>
            <a
              href={`https://www.linkedin.com/in/${data.profile.linkedinSlug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-accent transition-colors"
            >
              LinkedIn
            </a>
            <a
              href={`mailto:${data.profile.email}`}
              className="hover:text-accent transition-colors"
            >
              Email
            </a>
            <button
              onClick={scrollToTop}
              aria-label="Scroll to top"
              className="p-2 rounded-lg bg-canvas-muted border border-canvas-border hover:border-canvas-borderStrong text-ink transition-colors"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

        <div className="mt-8 pt-6 border-t border-canvas-border/50 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] font-mono text-ink-muted">
          <div>
            Data Last Synced: {new Date(data.lastUpdated).toLocaleDateString()} at {new Date(data.lastUpdated).toLocaleTimeString()}
          </div>
          <div>
            Built with React, TypeScript, Tailwind CSS & Vite
          </div>
        </div>
      </div>
    </footer>
  );
};
