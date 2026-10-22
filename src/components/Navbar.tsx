import React, { useState, useEffect } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Sun, Moon } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { data, activeView, setActiveView } = usePortfolio();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('portfolio_theme');
      if (saved === 'dark' || saved === 'light') return saved;
      // Default to light mode (editorial warm bone)
      return 'light';
    }
    return 'light';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('portfolio_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('portfolio_theme', 'light');
    }
  }, [theme]);

  const navLinks = [
    { num: '01', label: 'Work', href: '#projects' },
    { num: '02', label: 'About', href: '#about' },
    { num: '03', label: 'Credentials', href: '#credentials' },
    { num: '04', label: 'Contact', href: '#contact' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-canvas border-b border-canvas-border transition-colors">
      <div className="max-w-editorial mx-auto px-5 sm:px-8 py-4">
        <div className="flex items-center justify-between">
          
          {/* Brand / Name */}
          <a
            href="#"
            onClick={(e) => {
              if (activeView === 'admin') {
                e.preventDefault();
                setActiveView('portfolio');
              }
            }}
            className="group flex items-baseline space-x-2 text-ink hover:text-accent transition-colors"
          >
            <span className="font-display text-2xl tracking-tight font-normal">
              Vaishnavi Singh
            </span>
            <span className="hidden sm:inline font-mono text-[11px] text-ink-secondary uppercase tracking-widest">
              / CSE & AI
            </span>
          </a>

          {/* Desktop Navigation */}
          {activeView === 'portfolio' ? (
            <nav className="hidden md:flex items-center space-x-7 text-xs font-mono tracking-wide">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-ink-secondary hover:text-ink transition-colors flex items-center space-x-1"
                >
                  <span className="text-accent text-[10px]">{link.num}</span>
                  <span>{link.label}</span>
                </a>
              ))}
            </nav>
          ) : (
            <div className="hidden md:flex items-center text-xs font-mono uppercase tracking-widest text-accent">
              <span>Data & Ingestion Pipeline</span>
            </div>
          )}

          {/* Right Actions: Theme Toggle & Admin Switcher */}
          <div className="flex items-center space-x-3 text-xs font-mono">
            {/* Unambiguous Segmented Theme Switcher */}
            <div className="flex items-center border border-canvas-border rounded-[2px] overflow-hidden text-[11px]">
              <button
                type="button"
                onClick={() => setTheme('light')}
                className={`flex items-center space-x-1 px-2 py-1 uppercase tracking-wider transition-colors ${
                  theme === 'light'
                    ? 'bg-ink text-canvas font-medium'
                    : 'text-ink-secondary hover:text-ink bg-transparent'
                }`}
                title="Switch to light editorial theme"
              >
                <Sun className="w-3 h-3" />
                <span>Light</span>
              </button>
              <button
                type="button"
                onClick={() => setTheme('dark')}
                className={`flex items-center space-x-1 px-2 py-1 uppercase tracking-wider transition-colors ${
                  theme === 'dark'
                    ? 'bg-ink text-canvas font-medium'
                    : 'text-ink-secondary hover:text-ink bg-transparent'
                }`}
                title="Switch to dark charcoal theme"
              >
                <Moon className="w-3 h-3" />
                <span>Dark</span>
              </button>
            </div>

            {/* Dashboard / Portfolio Toggle */}
            <button
              onClick={() => setActiveView(activeView === 'portfolio' ? 'admin' : 'portfolio')}
              className={`px-3 py-1 text-[11px] uppercase tracking-wider transition-colors border ${
                activeView === 'admin'
                  ? 'bg-ink text-canvas border-ink font-medium'
                  : 'text-ink-secondary hover:text-ink border-canvas-border hover:border-ink/40'
              }`}
            >
              {activeView === 'admin' ? 'Exit View' : 'Manage Data'}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle mobile menu"
              className="md:hidden px-2.5 py-1 text-[11px] uppercase tracking-wider text-ink-secondary hover:text-ink border border-canvas-border"
            >
              {mobileMenuOpen ? 'Close' : 'Menu'}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer (Clean, editorial, no blur) */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-canvas-border bg-canvas px-5 py-6 space-y-4">
          <nav className="space-y-3 font-mono text-xs">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => {
                  setActiveView('portfolio');
                  setMobileMenuOpen(false);
                }}
                className="flex items-center justify-between py-2 border-b border-canvas-border text-ink hover:text-accent transition-colors"
              >
                <span>{link.num} / {link.label}</span>
                <span className="text-ink-secondary">→</span>
              </a>
            ))}
          </nav>

          <div className="pt-3 border-t border-canvas-border flex items-center justify-between">
            <span className="font-mono text-xs uppercase tracking-wider text-ink-secondary">Theme</span>
            <div className="flex items-center border border-canvas-border rounded-[2px] overflow-hidden text-[11px] font-mono">
              <button
                type="button"
                onClick={() => setTheme('light')}
                className={`flex items-center space-x-1 px-3 py-1.5 uppercase tracking-wider transition-colors ${
                  theme === 'light'
                    ? 'bg-ink text-canvas font-medium'
                    : 'text-ink-secondary hover:text-ink bg-transparent'
                }`}
              >
                <Sun className="w-3.5 h-3.5" />
                <span>Light</span>
              </button>
              <button
                type="button"
                onClick={() => setTheme('dark')}
                className={`flex items-center space-x-1 px-3 py-1.5 uppercase tracking-wider transition-colors ${
                  theme === 'dark'
                    ? 'bg-ink text-canvas font-medium'
                    : 'text-ink-secondary hover:text-ink bg-transparent'
                }`}
              >
                <Moon className="w-3.5 h-3.5" />
                <span>Dark</span>
              </button>
            </div>
          </div>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-mono text-ink-secondary">
            <a
              href={`https://github.com/${data.profile.githubUsername}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-ink"
            >
              GitHub ↗
            </a>
            <a
              href={`https://www.linkedin.com/in/${data.profile.linkedinSlug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-ink"
            >
              LinkedIn ↗
            </a>
            <a
              href={data.profile.leetcodeUrl || "https://leetcode.com/u/vaish_phob/"}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-ink"
            >
              LeetCode ↗
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
