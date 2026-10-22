import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { SkillCategory } from '../types/portfolio';
import { Check, Code2, Cpu, Database, Layout, Terminal, Wrench, Search, ShieldCheck } from 'lucide-react';

export const Skills: React.FC = () => {
  const { data } = usePortfolio();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories: { label: string; value: string; icon?: React.ReactNode }[] = [
    { label: 'All Disciplines', value: 'All' },
    { label: 'AI & ML', value: 'AI / Machine Learning', icon: <Cpu className="w-3.5 h-3.5" /> },
    { label: 'Languages', value: 'Languages', icon: <Code2 className="w-3.5 h-3.5" /> },
    { label: 'Backend & Systems', value: 'Backend & Systems', icon: <Terminal className="w-3.5 h-3.5" /> },
    { label: 'Frontend & Web', value: 'Frontend & Web', icon: <Layout className="w-3.5 h-3.5" /> },
    { label: 'Databases & Cache', value: 'Databases & Cache', icon: <Database className="w-3.5 h-3.5" /> },
    { label: 'Tools & DevOps', value: 'Tools & DevOps', icon: <Wrench className="w-3.5 h-3.5" /> },
  ];

  const filteredSkills = data.skills.filter((skill) => {
    const matchesCategory = selectedCategory === 'All' || skill.category === selectedCategory;
    const matchesSearch =
      skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (skill.evidenceRepo && skill.evidenceRepo.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="skills" className="py-20 md:py-28 border-t border-canvas-border relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6 text-left">
          <div className="space-y-3">
            <div className="inline-flex items-center space-x-2 text-xs font-mono text-accent uppercase tracking-widest">
              <span>02 // Competencies</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-ink tracking-tight">
              Verified Technical Stack
            </h2>
            <p className="text-base text-ink-secondary max-w-xl">
              Technologies proven in active codebases and verified against GitHub repositories. No fabricated mastery percentages.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 text-ink-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search technology..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-canvas-muted border border-canvas-border rounded-xl pl-10 pr-4 py-2 text-xs text-ink placeholder:text-ink-muted focus:outline-none focus:border-accent font-mono"
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedCategory === cat.value
                  ? 'bg-accent text-black font-semibold'
                  : 'bg-canvas-muted text-ink-secondary hover:text-ink border border-canvas-border hover:border-canvas-borderStrong'
              }`}
            >
              {cat.icon}
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredSkills.map((skill) => (
            <div
              key={skill.id}
              className="p-4 rounded-xl bg-canvas-subtle border border-canvas-border hover:border-canvas-borderStrong transition-all text-left flex flex-col justify-between group"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-display font-semibold text-ink text-sm sm:text-base group-hover:text-accent transition-colors">
                    {skill.name}
                  </span>
                  {skill.proficiency && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-canvas-muted text-ink-muted border border-canvas-border">
                      {skill.proficiency}
                    </span>
                  )}
                </div>

                <div className="text-xs text-ink-muted font-mono">
                  {skill.category}
                </div>
              </div>

              {/* Verification Footnote */}
              <div className="pt-3 mt-2 border-t border-canvas-border/60 flex items-center justify-between text-[11px] font-mono">
                {skill.source === 'verified-repo' ? (
                  <div className="flex items-center space-x-1 text-accent truncate max-w-[80%]" title={`Verified in ${skill.evidenceRepo}`}>
                    <ShieldCheck className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="truncate">Code: {skill.evidenceRepo}</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-1 text-ink-secondary">
                    <Check className="w-3.5 h-3.5 text-ink-muted" />
                    <span>Profile Listed</span>
                  </div>
                )}
                {skill.isHighlighted && (
                  <span className="text-[10px] text-accent/80 font-mono">Core</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Source Integrity Notice */}
        <div className="mt-8 p-3.5 rounded-xl bg-canvas-muted/50 border border-canvas-border flex flex-col sm:flex-row items-center justify-between text-xs text-ink-secondary font-mono gap-3">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-accent" />
            <span>Honest Source Hierarchy: Code Verified &gt; Profile Listed &gt; User Confirmed</span>
          </div>
          <span className="text-ink-muted">All technologies mapped to actual project implementations</span>
        </div>

      </div>
    </section>
  );
};
