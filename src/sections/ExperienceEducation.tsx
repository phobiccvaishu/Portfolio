import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { GraduationCap, Briefcase, Calendar, MapPin, CheckCircle2, ShieldCheck, Clock, Award } from 'lucide-react';

export const ExperienceEducation: React.FC = () => {
  const { data } = usePortfolio();

  return (
    <section id="experience" className="py-20 md:py-28 border-t border-canvas-border relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-left space-y-3 mb-14">
          <div className="inline-flex items-center space-x-2 text-xs font-mono text-accent uppercase tracking-widest">
            <span>04 // Trajectory</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-ink tracking-tight">
            Academic Track & Industry Experience
          </h2>
          <p className="text-base text-ink-secondary max-w-xl">
            Verified academic performance at SRMIST (CGPA 8.60/10.00), C-DAC AI/ML specialization, and ongoing software engineering internship.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* Experience Column */}
          <div className="space-y-6 text-left">
            <div className="flex items-center space-x-3 pb-3 border-b border-canvas-border">
              <div className="p-2 rounded-lg bg-canvas-muted border border-canvas-border text-accent">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-bold text-xl text-ink">Industry & Leadership Experience</h3>
                <span className="text-xs font-mono text-ink-muted">Internships & Professional Specializations</span>
              </div>
            </div>

            <div className="space-y-6">
              {data.experience.map((exp) => (
                <div
                  key={exp.id}
                  className="p-6 rounded-2xl bg-canvas-subtle border border-canvas-border hover:border-canvas-borderStrong transition-all space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-canvas-muted text-ink-secondary border border-canvas-border">
                        {exp.type.toUpperCase()}
                      </span>
                      {exp.badge && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-accent text-black font-semibold flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{exp.badge}</span>
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-1.5 text-xs font-mono text-ink-muted">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{exp.startDate} – {exp.endDate}</span>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-display font-bold text-ink">
                      {exp.role}
                    </h4>
                    <div className="text-sm text-accent font-medium mt-0.5">
                      {exp.organization}
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed">
                    {exp.description}
                  </p>

                  <div className="space-y-2 pt-2 border-t border-canvas-border">
                    <div className="text-xs font-mono text-ink-muted uppercase">Verified Responsibilities:</div>
                    <ul className="space-y-1.5 text-xs text-ink-secondary">
                      {exp.responsibilities.map((r, i) => (
                        <li key={i} className="flex items-start space-x-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-accent mt-0.5 flex-shrink-0" />
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {exp.technologies.map((t) => (
                      <span
                        key={t}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-canvas-muted text-ink-muted border border-canvas-border"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Education Column */}
          <div id="education" className="space-y-6 text-left">
            <div className="flex items-center space-x-3 pb-3 border-b border-canvas-border">
              <div className="p-2 rounded-lg bg-canvas-muted border border-canvas-border text-accent">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-bold text-xl text-ink">Education & Academics</h3>
                <span className="text-xs font-mono text-ink-muted">Official Degree Program</span>
              </div>
            </div>

            <div className="space-y-6">
              {data.education.map((edu) => (
                <div
                  key={edu.id}
                  className="p-6 rounded-2xl bg-canvas-subtle border border-canvas-border hover:border-canvas-borderStrong transition-all space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <span className="text-xs font-mono px-2.5 py-1 rounded bg-accent-muted text-accent border border-accent-border self-start font-semibold">
                      {edu.degree}
                    </span>
                    <div className="flex items-center space-x-1.5 text-xs font-mono text-ink-muted">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{edu.startYear} – {edu.endYear}</span>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-display font-bold text-ink">
                      {edu.institution}
                    </h4>
                    <div className="text-sm text-ink-secondary mt-0.5">
                      {edu.fieldOfStudy}
                    </div>
                  </div>

                  <div className="flex items-center space-x-1.5 text-xs text-ink-muted font-mono">
                    <MapPin className="w-3.5 h-3.5 text-accent" />
                    <span>{edu.location}</span>
                  </div>

                  <div className="text-sm font-mono text-ink bg-canvas-muted p-3 rounded-xl border border-canvas-border flex items-center justify-between">
                    <span className="text-ink-muted">Academic Standing:</span>
                    <span className="text-accent font-bold text-base">{edu.cgpa || edu.grade}</span>
                  </div>

                  {edu.highlights && (
                    <div className="space-y-2 pt-2 border-t border-canvas-border">
                      <div className="text-xs font-mono text-ink-muted uppercase">Coursework & Problem Solving:</div>
                      <ul className="space-y-1.5 text-xs text-ink-secondary">
                        {edu.highlights.map((h, i) => (
                          <li key={i} className="flex items-start space-x-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-accent mt-0.5 flex-shrink-0" />
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}

              {/* LeetCode Verified Profile & Problem Solving Spotlight Card */}
              <div className="p-6 rounded-2xl bg-canvas-muted border border-canvas-border space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-accent text-xs font-mono uppercase tracking-wider font-semibold">
                    <Award className="w-4 h-4" />
                    <span>Verified LeetCode Profile</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-accent text-black font-semibold">
                    @{data.profile.leetcodeUsername || 'vaish_phob'}
                  </span>
                </div>

                <div>
                  <div className="text-xl font-display font-extrabold text-ink">
                    LeetCode Problem Solving
                  </div>
                  <div className="text-xs font-mono text-ink-muted mt-0.5">
                    Global Ranking: #{data.profile.leetcodeStats?.ranking?.toLocaleString() || '3,734,091'}
                  </div>
                </div>

                {/* Solved breakdown */}
                <div className="grid grid-cols-3 gap-2 text-center font-mono">
                  <div className="p-2.5 rounded-lg bg-canvas-surface border border-canvas-border">
                    <div className="text-base font-bold text-ink">{data.profile.leetcodeStats?.totalSolved || 30}</div>
                    <div className="text-[10px] text-ink-muted">Total Solved</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-canvas-surface border border-canvas-border">
                    <div className="text-base font-bold text-emerald-400">{data.profile.leetcodeStats?.easySolved || 20}</div>
                    <div className="text-[10px] text-ink-muted">Easy</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-canvas-surface border border-canvas-border">
                    <div className="text-base font-bold text-amber-400">{data.profile.leetcodeStats?.mediumSolved || 10}</div>
                    <div className="text-[10px] text-ink-muted">Medium</div>
                  </div>
                </div>

                {/* Languages verified on LeetCode */}
                <div className="space-y-1.5 pt-1">
                  <div className="text-[11px] font-mono text-ink-muted">Verified Languages on LeetCode:</div>
                  <div className="flex flex-wrap gap-2 text-xs font-mono">
                    <span className="px-2 py-0.5 rounded bg-canvas-surface text-ink border border-canvas-border">
                      C (28 solved)
                    </span>
                    <span className="px-2 py-0.5 rounded bg-canvas-surface text-ink border border-canvas-border">
                      Java (3 solved)
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-canvas-border flex items-center justify-between">
                  <span className="text-[11px] font-mono text-ink-muted">Live GraphQL Synced</span>
                  <a
                    href={data.profile.leetcodeUrl || "https://leetcode.com/u/vaish_phob/"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1.5 text-xs font-mono text-accent hover:underline font-semibold"
                  >
                    <span>leetcode.com/u/vaish_phob</span>
                    <span>→</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
