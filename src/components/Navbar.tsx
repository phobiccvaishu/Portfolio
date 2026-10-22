import React, { useState, useEffect } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Github, Linkedin, Sliders, Menu, X, ArrowUpRight, ShieldCheck, Mail } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { data, activeView, setActiveView } = usePortfolio();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Work', href: '#projects' },
    { label: 'Skills', href: '#skills' },
    { label: 'Experience', href: '#experience' },
    { label: 'Education', href: '#education' },
    { label: 'Credentials', href: '#credentials' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-canvas/90 backdrop-blur-md border-b border-canvas-border py-3 shadow-lg shadow-black/20'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a
            href="#"
            onClick={(e) => {
              if (activeView === 'admin') {
                e.preventDefault();
                setActiveView('portfolio');
              }
            }}
            className="group flex items-center space-x-3 text-left"
          >
            <div className="w-10 h-10 rounded-lg bg-canvas-muted border border-canvas-border flex items-center justify-center font-display font-bold text-accent group-hover:border-accent/40 transition-colors">
              VS
            </div>
            <div>
              <div className="font-display font-semibold text-ink text-sm sm:text-base tracking-tight flex items-center gap-1.5">
                {data.profile.name}
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent" />
              </div>
              <div className="text-xs text-ink-muted font-mono tracking-tight">
                AI/ML & Systems Developer
              </div>
            </div>
          </a>

          {/* Desktop Navigation */}
          {activeView === 'portfolio' ? (
            <nav className="hidden md:flex items-center space-x-1 lg:space-x-2 bg-canvas-muted/80 px-3 py-1.5 rounded-full border border-canvas-border">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="px-3 py-1 text-xs lg:text-sm font-medium text-ink-secondary hover:text-ink hover:bg-canvas-surface/60 rounded-full transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          ) : (
            <div className="hidden md:flex items-center text-xs font-mono text-accent bg-accent-muted px-3 py-1.5 rounded-full border border-accent-border">
              <ShieldCheck className="w-4 h-4 mr-1.5" />
              Profile Management Dashboard
            </div>
          )}

          {/* Right Action Icons & Dashboard Toggle */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Live Availability Badge */}
            <div className="hidden lg:flex items-center space-x-2 text-xs font-medium text-ink-secondary bg-canvas-muted px-3 py-1.5 rounded-full border border-canvas-border">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
              </span>
              <span>Available for Internships</span>
            </div>

            {/* Social Links */}
            <a
              href={`https://github.com/${data.profile.githubUsername}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub Profile"
              className="p-2 text-ink-secondary hover:text-ink hover:bg-canvas-muted rounded-lg border border-transparent hover:border-canvas-border transition-colors"
            >
              <Github className="w-4 h-4" />
            </a>
            <a
              href={`https://www.linkedin.com/in/${data.profile.linkedinSlug}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn Profile"
              className="p-2 text-ink-secondary hover:text-ink hover:bg-canvas-muted rounded-lg border border-transparent hover:border-canvas-border transition-colors"
            >
              <Linkedin className="w-4 h-4" />
            </a>

            {/* Dashboard / Portfolio Toggle */}
            <button
              onClick={() => setActiveView(activeView === 'portfolio' ? 'admin' : 'portfolio')}
              className={`flex items-center space-x-1.5 text-xs font-medium px-3.5 py-1.5 rounded-lg border transition-all ${
                activeView === 'admin'
                  ? 'bg-accent text-black border-accent font-semibold'
                  : 'bg-canvas-muted text-ink hover:text-accent border-canvas-border hover:border-accent/40'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>{activeView === 'admin' ? 'View Portfolio' : 'Manage Data'}</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={() => setActiveView(activeView === 'portfolio' ? 'admin' : 'portfolio')}
              className={`text-xs px-2.5 py-1.5 rounded-lg border ${
                activeView === 'admin'
                  ? 'bg-accent text-black font-semibold'
                  : 'bg-canvas-muted text-ink border-canvas-border'
              }`}
            >
              {activeView === 'admin' ? 'Portfolio' : 'Manage'}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
              className="p-2 text-ink-secondary hover:text-ink bg-canvas-muted rounded-lg border border-canvas-border"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-canvas-subtle border-b border-canvas-border px-4 py-5 space-y-4">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => {
                  setActiveView('portfolio');
                  setMobileMenuOpen(false);
                }}
                className="block px-3 py-2 text-sm font-medium text-ink-secondary hover:text-ink hover:bg-canvas-muted rounded-lg"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="pt-3 border-t border-canvas-border flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <a
                href={`https://github.com/${data.profile.githubUsername}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-ink-secondary hover:text-ink bg-canvas-muted rounded-lg border border-canvas-border"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href={`https://www.linkedin.com/in/${data.profile.linkedinSlug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-ink-secondary hover:text-ink bg-canvas-muted rounded-lg border border-canvas-border"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href={`mailto:${data.profile.email}`}
                className="p-2 text-ink-secondary hover:text-ink bg-canvas-muted rounded-lg border border-canvas-border"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
            <div className="text-xs text-accent font-mono">SRMIST CSE</div>
          </div>
        </div>
      )}
    </header>
  );
};
