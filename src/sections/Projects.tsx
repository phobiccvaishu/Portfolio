import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Project, ProjectCategory } from '../types/portfolio';
import { Github, ExternalLink, Cpu, Layers, Sparkles, CheckCircle2, ArrowUpRight, Terminal, Eye } from 'lucide-react';

export const Projects: React.FC = () => {
  const { data } = usePortfolio();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeProjectModal, setActiveProjectModal] = useState<Project | null>(null);

  const categories: string[] = ['All', 'AI & Intelligent Systems', 'Full-Stack Platforms', 'Algorithms & Systems'];

  const filteredProjects = data.projects.filter((proj) => {
    if (selectedCategory === 'All') return true;
    return proj.category === selectedCategory;
  });

  return (
    <section id="projects" className="py-20 md:py-28 border-t border-canvas-border relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 text-left">
          <div className="space-y-3">
            <div className="inline-flex items-center space-x-2 text-xs font-mono text-accent uppercase tracking-widest">
              <span>03 // Portfolio of Work</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-ink tracking-tight">
              Featured Engineering Projects
            </h2>
            <p className="text-base text-ink-secondary max-w-xl">
              Authentic systems extracted from my GitHub repositories. Each project includes verified architectures, problem statements, and implementation details.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  selectedCategory === cat
                    ? 'bg-accent text-black font-semibold'
                    : 'bg-canvas-muted text-ink-secondary hover:text-ink border border-canvas-border hover:border-canvas-borderStrong'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className={`rounded-2xl bg-canvas-subtle border transition-all text-left flex flex-col justify-between group overflow-hidden ${
                project.isFeatured
                  ? 'border-canvas-border hover:border-accent/40 shadow-xl'
                  : 'border-canvas-border hover:border-canvas-borderStrong'
              }`}
            >
              {/* Card Header & Badges */}
              <div className="p-6 sm:p-7 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-canvas-muted text-accent border border-accent-border font-medium">
                      {project.category}
                    </span>
                    {project.isFeatured && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-ink-secondary border border-canvas-border">
                        Featured
                      </span>
                    )}
                  </div>

                  <span className="text-xs font-mono text-ink-muted">
                    {project.status}
                  </span>
                </div>

                {/* Title & Tagline */}
                <div>
                  <h3 className="text-xl sm:text-2xl font-display font-bold text-ink group-hover:text-accent transition-colors flex items-center justify-between">
                    <span>{project.title}</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-ink-muted font-mono mt-1">
                    {project.tagline}
                  </p>
                </div>

                {/* Description */}
                <p className="text-sm text-ink-secondary leading-relaxed font-light">
                  {project.description}
                </p>

                {/* Verified Key Features */}
                <div className="space-y-2 pt-2">
                  <div className="text-xs font-mono text-ink-muted uppercase tracking-wider">
                    Core Functionality:
                  </div>
                  <ul className="space-y-1.5 text-xs text-ink-secondary">
                    {project.keyFeatures.slice(0, 3).map((feat, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-accent mt-0.5 flex-shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Technologies */}
                <div className="flex flex-wrap gap-1.5 pt-3">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="text-[11px] font-mono px-2 py-0.5 rounded bg-canvas-muted text-ink-secondary border border-canvas-border"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="px-6 py-4 bg-canvas-muted/50 border-t border-canvas-border flex items-center justify-between">
                <button
                  onClick={() => setActiveProjectModal(project)}
                  className="inline-flex items-center space-x-1.5 text-xs font-medium text-ink hover:text-accent transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Inspect Architecture & Specs</span>
                </button>

                <div className="flex items-center space-x-3">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1 text-xs font-mono text-ink-secondary hover:text-ink transition-colors"
                    >
                      <Github className="w-3.5 h-3.5" />
                      <span>Code</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </a>
                  )}
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1 text-xs font-mono text-accent hover:underline"
                    >
                      <span>Live Demo</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Deep-Dive Inspection Modal */}
      {activeProjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-canvas-subtle border border-canvas-border max-w-2xl w-full rounded-2xl p-6 sm:p-8 space-y-6 text-left shadow-2xl max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-start justify-between border-b border-canvas-border pb-4">
              <div>
                <span className="text-[10px] font-mono text-accent uppercase tracking-widest px-2 py-0.5 rounded bg-accent-muted border border-accent-border">
                  {activeProjectModal.category}
                </span>
                <h3 className="font-display font-extrabold text-2xl text-ink mt-2">
                  {activeProjectModal.title}
                </h3>
                <p className="text-xs font-mono text-ink-muted mt-1">
                  {activeProjectModal.tagline}
                </p>
              </div>

              <button
                onClick={() => setActiveProjectModal(null)}
                className="text-ink-muted hover:text-ink text-sm px-2.5 py-1 rounded-lg bg-canvas-muted border border-canvas-border"
              >
                Close (ESC)
              </button>
            </div>

            {/* Architecture Overview */}
            {activeProjectModal.architectureNotes && (
              <div className="p-4 rounded-xl bg-canvas-muted border border-canvas-border space-y-2">
                <div className="text-xs font-mono text-accent flex items-center space-x-2">
                  <Terminal className="w-4 h-4" />
                  <span>Verified Architecture & Implementation</span>
                </div>
                <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed">
                  {activeProjectModal.architectureNotes}
                </p>
              </div>
            )}

            {/* Comprehensive Features List */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono uppercase tracking-wider text-ink-muted">
                Detailed Feature Specifications:
              </h4>
              <ul className="space-y-2 text-sm text-ink-secondary">
                {activeProjectModal.keyFeatures.map((feat, idx) => (
                  <li key={idx} className="flex items-start space-x-2.5">
                    <CheckCircle2 className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tech Stack Chips */}
            <div className="space-y-2 pt-2">
              <h4 className="text-xs font-mono uppercase tracking-wider text-ink-muted">
                Technologies & Microservices:
              </h4>
              <div className="flex flex-wrap gap-2">
                {activeProjectModal.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="text-xs font-mono px-2.5 py-1 rounded-md bg-canvas-surface text-ink border border-canvas-border"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-4 border-t border-canvas-border flex flex-wrap items-center justify-between gap-4">
              <a
                href={activeProjectModal.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-accent text-black font-semibold text-xs hover:bg-accent-hover transition-colors"
              >
                <Github className="w-4 h-4" />
                <span>View Full Source on GitHub</span>
              </a>

              <div className="text-xs font-mono text-ink-muted">
                Status: <span className="text-ink">{activeProjectModal.status}</span>
              </div>
            </div>

          </div>
        </div>
      )}
    </section>
  );
};
