import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePortfolio } from '../context/PortfolioContext';
import { Project } from '../types/portfolio';
import { ArrowUpRight, ChevronDown, ChevronUp } from 'lucide-react';

export const Projects: React.FC = () => {
  const { data } = usePortfolio();

  // Ensure Online Examination System is the lead project (as required)
  const orderedProjects = [...data.projects].sort((a, b) => {
    if (a.title.toLowerCase().includes('online examination')) return -1;
    if (b.title.toLowerCase().includes('online examination')) return 1;
    return 0;
  });

  const [expandedId, setExpandedId] = useState<string | null>(orderedProjects[0]?.id || null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <section id="projects" className="py-20 sm:py-28 border-b border-canvas-border text-left">
      <div className="max-w-editorial mx-auto px-5 sm:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-12 sm:mb-16 pb-4 border-b border-canvas-border gap-4">
          <div className="flex items-baseline space-x-3">
            <span className="font-mono text-xs uppercase tracking-widest text-accent">01 /</span>
            <h2 className="font-display text-3xl sm:text-4xl text-ink font-normal tracking-tight">
              Selected Work & Systems
            </h2>
          </div>
          <span className="font-mono text-xs text-ink-secondary uppercase tracking-widest">
            {orderedProjects.length} Verified Architectures
          </span>
        </div>

        {/* Editorial Project Index */}
        <div className="divide-y divide-canvas-border border-t border-b border-canvas-border">
          {orderedProjects.map((project, index) => {
            const num = String(index + 1).padStart(2, '0');
            const isExpanded = expandedId === project.id;

            return (
              <div
                key={project.id}
                className="transition-colors group"
              >
                {/* Main Index Row */}
                <button
                  onClick={() => toggleExpand(project.id)}
                  className="w-full py-6 sm:py-8 text-left grid grid-cols-12 gap-3 sm:gap-6 items-baseline hover:bg-canvas-surface/40 transition-colors px-2 sm:px-4 cursor-pointer focus-visible:outline-none"
                  aria-expanded={isExpanded}
                >
                  {/* Number */}
                  <div className="col-span-2 sm:col-span-1 font-mono text-xs sm:text-sm text-ink-secondary group-hover:text-accent transition-colors">
                    {num}
                  </div>

                  {/* Title & Tagline */}
                  <div className="col-span-10 sm:col-span-5 space-y-1">
                    <div className="flex items-baseline space-x-2">
                      <h3 className="font-display text-xl sm:text-2xl text-ink group-hover:text-accent transition-colors font-normal">
                        {project.title}
                      </h3>
                      {project.isFeatured && (
                        <span className="font-mono text-[10px] text-accent uppercase tracking-wider">
                          [Featured]
                        </span>
                      )}
                      {project.researchPaper && (
                        <span className="font-mono text-[10px] text-accent uppercase tracking-wider">
                          [Paper]
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-ink-secondary line-clamp-1 font-normal">
                      {project.tagline}
                    </p>
                  </div>

                  {/* Technologies Mono List */}
                  <div className="col-span-9 sm:col-span-4 pl-0 sm:pl-2 hidden sm:block">
                    <div className="font-mono text-xs text-ink-secondary truncate">
                      {project.technologies.slice(0, 4).join(' / ')}
                    </div>
                  </div>

                  {/* Arrow & State */}
                  <div className="col-span-3 sm:col-span-2 flex items-center justify-end space-x-2 text-xs font-mono text-ink-secondary group-hover:text-ink">
                    <span className="hidden sm:inline text-[11px] uppercase tracking-wider">
                      {isExpanded ? 'Collapse' : 'Inspect'}
                    </span>
                    <span className="text-accent transition-transform duration-200">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </span>
                  </div>
                </button>

                {/* Expanded Case-Study Breakdown */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3, ease: 'easeOut' }}
                      className="overflow-hidden bg-canvas-surface/20"
                    >
                      <div className="p-4 sm:p-8 space-y-8 border-t border-canvas-border">
                        
                        {/* 12-column case study layout */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
                          
                          {/* Left: Summary & Problem (7 cols) */}
                          <div className="lg:col-span-7 space-y-6">
                            <div>
                              <h4 className="font-mono text-xs text-ink-secondary uppercase tracking-widest mb-2">
                                Overview & Objective
                              </h4>
                              <p className="text-sm sm:text-base text-ink leading-relaxed">
                                {project.description}
                              </p>
                            </div>

                            {project.architectureNotes && (
                              <div className="pt-2">
                                <h4 className="font-mono text-xs text-ink-secondary uppercase tracking-widest mb-2">
                                  System Architecture & Data Flow
                                </h4>
                                <p className="text-sm text-ink-secondary leading-relaxed font-mono">
                                  {project.architectureNotes}
                                </p>
                              </div>
                            )}

                            {project.researchPaper && (
                              <div className="p-4 border-l-2 border-accent bg-canvas-surface space-y-1">
                                <div className="font-mono text-xs text-accent uppercase tracking-wider">
                                  Active Research Paper:
                                </div>
                                <div className="text-xs sm:text-sm text-ink font-medium italic">
                                  "{project.researchPaper.topic}"
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Right: Technical Features & Actions (5 cols) */}
                          <div className="lg:col-span-5 space-y-6">
                            <div>
                              <h4 className="font-mono text-xs text-ink-secondary uppercase tracking-widest mb-3">
                                Verified Capabilities
                              </h4>
                              <ul className="space-y-2 text-xs sm:text-sm text-ink-secondary">
                                {project.keyFeatures.map((feature, i) => (
                                  <li key={i} className="flex items-start space-x-2">
                                    <span className="text-accent font-mono">&mdash;</span>
                                    <span>{feature}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div>
                              <h4 className="font-mono text-xs text-ink-secondary uppercase tracking-widest mb-2">
                                Stack & Libraries
                              </h4>
                              <div className="flex flex-wrap gap-x-3 gap-y-1 font-mono text-xs text-ink">
                                {project.technologies.map((t) => (
                                  <span key={t} className="after:content-[','] last:after:content-['']">
                                    {t}
                                  </span>
                                ))}
                              </div>
                            </div>

                            {/* Direct External Links */}
                            <div className="pt-4 border-t border-canvas-border flex items-center space-x-6 text-xs font-mono uppercase tracking-wider">
                              {project.githubUrl && (
                                <a
                                  href={project.githubUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="editorial-link text-ink hover:text-accent font-medium pb-0.5"
                                >
                                  View Source Repository &nearr;
                                </a>
                              )}
                              {project.liveUrl && (
                                <a
                                  href={project.liveUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="editorial-link text-accent hover:underline font-medium pb-0.5"
                                >
                                  Live Demo &nearr;
                                </a>
                              )}
                            </div>
                          </div>

                        </div>

                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
