import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { GraduationCap, Briefcase, Calendar, MapPin, CheckCircle2, ShieldCheck } from 'lucide-react';

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
            Academic Track & Project Leadership
          </h2>
          <p className="text-base text-ink-secondary max-w-xl">
            Real academic background, institutional coursework, and student software engineering leadership.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* Education Column */}
          <div id="education" className="space-y-6 text-left">
            <div className="flex items-center space-x-3 pb-3 border-b border-canvas-border">
              <div className="p-2 rounded-lg bg-canvas-muted border border-canvas-border text-accent">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-bold text-xl text-ink">Education</h3>
                <span className="text-xs font-mono text-ink-muted">Academic Credentials</span>
              </div>
            </div>

            <div className="space-y-6">
              {data.education.map((edu) => (
                <div
                  key={edu.id}
                  className="p-6 rounded-2xl bg-canvas-subtle border border-canvas-border hover:border-canvas-borderStrong transition-all space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-accent-muted text-accent border border-accent-border self-start">
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

                  {edu.grade && (
                    <div className="text-xs font-mono text-ink-secondary bg-canvas-muted p-2 rounded-lg border border-canvas-border">
                      Standing: <span className="text-ink font-medium">{edu.grade}</span>
                    </div>
                  )}

                  {edu.highlights && (
                    <div className="space-y-2 pt-2 border-t border-canvas-border">
                      <div className="text-xs font-mono text-ink-muted uppercase">Coursework Highlights:</div>
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
            </div>
          </div>

          {/* Experience Column */}
          <div className="space-y-6 text-left">
            <div className="flex items-center space-x-3 pb-3 border-b border-canvas-border">
              <div className="p-2 rounded-lg bg-canvas-muted border border-canvas-border text-accent">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-bold text-xl text-ink">Engineering Leadership</h3>
                <span className="text-xs font-mono text-ink-muted">Academic & Open Source</span>
              </div>
            </div>

            <div className="space-y-6">
              {data.experience.map((exp) => (
                <div
                  key={exp.id}
                  className="p-6 rounded-2xl bg-canvas-subtle border border-canvas-border hover:border-canvas-borderStrong transition-all space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-canvas-muted text-ink-secondary border border-canvas-border self-start">
                      {exp.type.toUpperCase()}
                    </span>
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

        </div>

      </div>
    </section>
  );
};
