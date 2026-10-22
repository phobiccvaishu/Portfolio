import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';

export const Footer: React.FC = () => {
  const { data } = usePortfolio();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="py-12 bg-canvas text-ink-secondary text-xs font-mono text-left">
      <div className="max-w-editorial mx-auto px-5 sm:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-baseline justify-between gap-4 pb-6 border-b border-canvas-border">
          <div>
            <span className="text-ink font-display text-lg font-normal">{data.profile.name || 'Vaishnavi Singh'}</span>
            <span className="text-ink-secondary text-xs font-mono ml-2">/ {data.profile.university || 'SRMIST Computer Science'}</span>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs uppercase tracking-wider">
            <a
              href={`https://github.com/${data.profile.githubUsername}`}
              target="_blank"
              rel="noopener noreferrer"
              className="editorial-link hover:text-ink"
            >
              GitHub &nearr;
            </a>
            <a
              href={`https://www.linkedin.com/in/${data.profile.linkedinSlug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="editorial-link hover:text-ink"
            >
              LinkedIn &nearr;
            </a>
            <a
              href={data.profile.leetcodeUrl || "https://leetcode.com/u/vaish_phob/"}
              target="_blank"
              rel="noopener noreferrer"
              className="editorial-link hover:text-ink"
            >
              LeetCode &nearr;
            </a>
            <button
              onClick={scrollToTop}
              className="editorial-link text-ink hover:text-accent"
            >
              Top &uarr;
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-baseline justify-between gap-2 text-[11px] text-ink-secondary">
          <span>Editorial developer portfolio &bull; Clean data pipeline</span>
          <span>Last synchronized: {new Date(data.lastUpdated).toLocaleDateString()}</span>
        </div>
      </div>
    </footer>
  );
};
