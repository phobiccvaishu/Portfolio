import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { SkillCategory } from '../types/portfolio';

export const Skills: React.FC = () => {
  const { data } = usePortfolio();

  const categories: SkillCategory[] = [
    'Languages',
    'AI / Machine Learning',
    'Backend & Systems',
    'Databases & Cache',
    'Frontend & Web',
    'Tools & DevOps'
  ];

  return (
    <section id="skills" className="py-20 sm:py-28 border-b border-canvas-border text-left">
      <div className="max-w-editorial mx-auto px-5 sm:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-12 sm:mb-16 pb-4 border-b border-canvas-border gap-4">
          <div className="flex items-baseline space-x-3">
            <span className="font-mono text-xs uppercase tracking-widest text-accent">03 /</span>
            <h2 className="font-display text-3xl sm:text-4xl text-ink font-normal tracking-tight">
              Technical Competencies
            </h2>
          </div>
          <span className="font-mono text-xs text-ink-secondary uppercase tracking-widest">
            Plain Inventory &bull; No Synthetic Scores
          </span>
        </div>

        {/* Plain Grouped Text Lists (12-column grid) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-10 gap-x-12">
          {categories.map((category) => {
            const skillsInCategory = data.skills.filter((s) => s.category === category);
            if (skillsInCategory.length === 0) return null;

            return (
              <div key={category} className="space-y-3">
                <h3 className="font-mono text-xs text-ink uppercase tracking-widest pb-2 border-b border-canvas-border">
                  {category}
                </h3>

                <ul className="space-y-1.5 text-sm text-ink-secondary leading-relaxed font-sans">
                  {skillsInCategory.map((skill) => (
                    <li key={skill.id} className="flex items-baseline justify-between py-1">
                      <span className="text-ink font-normal">{skill.name}</span>
                      {skill.evidenceRepo ? (
                        <span className="font-mono text-[11px] text-ink-secondary truncate max-w-[140px] text-right pl-2">
                          {skill.evidenceRepo}
                        </span>
                      ) : (
                        <span className="font-mono text-[10px] text-ink-secondary uppercase">
                          {skill.proficiency || 'Verified'}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
