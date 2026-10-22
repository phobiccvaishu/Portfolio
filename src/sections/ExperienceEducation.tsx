import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';

export const ExperienceEducation: React.FC = () => {
  const { data } = usePortfolio();

  return (
    <section id="experience" className="py-20 sm:py-28 border-b border-canvas-border text-left">
      <div className="max-w-editorial mx-auto px-5 sm:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-12 sm:mb-16 pb-4 border-b border-canvas-border gap-4">
          <div className="flex items-baseline space-x-3">
            <span className="font-mono text-xs uppercase tracking-widest text-accent">04 /</span>
            <h2 className="font-display text-3xl sm:text-4xl text-ink font-normal tracking-tight">
              Experience & Academic Track
            </h2>
          </div>
          <span className="font-mono text-xs text-ink-secondary uppercase tracking-widest">
            Trajectory & Education
          </span>
        </div>

        {/* 12-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          
          {/* Left Column: Experience (7 cols) */}
          <div className="lg:col-span-7 space-y-10">
            <h3 className="font-mono text-xs text-ink uppercase tracking-widest pb-2 border-b border-canvas-border">
              Industry Experience & Internships
            </h3>

            <div className="space-y-10">
              {data.experience.map((exp) => (
                <div key={exp.id} className="space-y-3 pb-8 border-b border-canvas-border last:border-b-0 last:pb-0">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 font-mono text-xs">
                    <span className="text-accent uppercase tracking-wider font-medium">
                      {exp.organization}
                    </span>
                    <span className="text-ink-secondary">
                      {exp.startDate} &mdash; {exp.endDate}
                    </span>
                  </div>

                  <div className="font-display text-xl sm:text-2xl text-ink font-normal">
                    {exp.role}
                  </div>

                  <p className="text-sm sm:text-[15px] text-ink-secondary leading-relaxed">
                    {exp.description}
                  </p>

                  {exp.responsibilities && (
                    <ul className="space-y-1.5 text-xs sm:text-sm text-ink-secondary pt-1 font-sans">
                      {exp.responsibilities.map((r, i) => (
                        <li key={i} className="flex items-start space-x-2">
                          <span className="text-accent font-mono">&mdash;</span>
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="pt-2 flex flex-wrap gap-x-2 font-mono text-[11px] text-ink-secondary">
                    {exp.technologies.map((t) => (
                      <span key={t} className="after:content-['/'] last:after:content-[''] pr-1.5">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Education & LeetCode Problem Solving (5 cols) */}
          <div className="lg:col-span-5 space-y-10">
            
            {/* Education */}
            <div className="space-y-6">
              <h3 className="font-mono text-xs text-ink uppercase tracking-widest pb-2 border-b border-canvas-border">
                Formal Education
              </h3>

              {data.education.map((edu) => (
                <div key={edu.id} className="space-y-2">
                  <div className="flex items-baseline justify-between font-mono text-xs text-ink-secondary">
                    <span className="text-accent uppercase tracking-wider">{edu.location}</span>
                    <span>{edu.startYear} &mdash; {edu.endYear}</span>
                  </div>

                  <div className="font-display text-xl sm:text-2xl text-ink font-normal">
                    {edu.institution}
                  </div>

                  <div className="text-sm text-ink font-medium">
                    {edu.degree} &bull; {edu.fieldOfStudy}
                  </div>

                  <div className="font-mono text-xs text-ink pt-1">
                    Standing: <span className="text-accent font-bold">{edu.cgpa || edu.grade}</span>
                  </div>

                  {edu.highlights && (
                    <div className="text-xs text-ink-secondary leading-relaxed pt-2 space-y-1 font-mono">
                      <div className="text-ink uppercase tracking-wider">Relevant Coursework:</div>
                      <p>
                        Data Structures & Algorithms, Object-Oriented Programming (Java), DBMS, Operating Systems, Computer Networks, System Design, RESTful API Engineering.
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Verified LeetCode Activity */}
            <div className="space-y-4 pt-6 border-t border-canvas-border">
              <div className="flex items-baseline justify-between">
                <h3 className="font-mono text-xs text-ink uppercase tracking-widest">
                  Algorithmic Practice
                </h3>
                <span className="font-mono text-xs text-accent">
                  @{data.profile.leetcodeUsername || 'vaish_phob'}
                </span>
              </div>

              <div className="font-display text-xl text-ink font-normal">
                LeetCode & Problem Solving
              </div>

              <div className="grid grid-cols-3 gap-3 font-mono text-xs border border-canvas-border p-3 bg-canvas-surface/20">
                <div>
                  <div className="text-ink-secondary text-[10px] uppercase">Total Solved</div>
                  <div className="text-base font-bold text-ink">{data.profile.leetcodeStats?.totalSolved || 30}</div>
                </div>
                <div>
                  <div className="text-ink-secondary text-[10px] uppercase">Easy</div>
                  <div className="text-base font-medium text-ink">{data.profile.leetcodeStats?.easySolved || 20}</div>
                </div>
                <div>
                  <div className="text-ink-secondary text-[10px] uppercase">Medium</div>
                  <div className="text-base font-medium text-ink">{data.profile.leetcodeStats?.mediumSolved || 10}</div>
                </div>
              </div>

              <div className="text-xs font-mono text-ink-secondary space-y-1">
                <div>Verified Languages: C (28 solved), Java (3 solved)</div>
                <div>Global Ranking: #{data.profile.leetcodeStats?.ranking?.toLocaleString() || '3,734,091'}</div>
              </div>

              <div className="pt-2">
                <a
                  href={data.profile.leetcodeUrl || "https://leetcode.com/u/vaish_phob/"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="editorial-link font-mono text-xs text-ink hover:text-accent uppercase tracking-wider"
                >
                  View LeetCode Profile &nearr;
                </a>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
