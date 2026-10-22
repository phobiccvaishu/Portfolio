import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';

export const About: React.FC = () => {
  const { data } = usePortfolio();

  return (
    <section id="about" className="py-20 sm:py-28 border-b border-canvas-border text-left">
      <div className="max-w-editorial mx-auto px-5 sm:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-12 sm:mb-16 pb-4 border-b border-canvas-border gap-4">
          <div className="flex items-baseline space-x-3">
            <span className="font-mono text-xs uppercase tracking-widest text-accent">02 /</span>
            <h2 className="font-display text-3xl sm:text-4xl text-ink font-normal tracking-tight">
              About & Direction
            </h2>
          </div>
          <span className="font-mono text-xs text-ink-secondary uppercase tracking-widest">
            Background & Focus
          </span>
        </div>

        {/* 12-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          
          {/* Narrative Body (7 cols) */}
          <div className="lg:col-span-7 space-y-6 text-base sm:text-[17px] text-ink leading-relaxed">
            {data.profile.bio.map((paragraph, idx) => (
              <p key={idx} className="text-ink-secondary font-normal">
                {paragraph}
              </p>
            ))}

            <div className="pt-4 border-t border-canvas-border font-mono text-xs text-ink-secondary space-y-2">
              <div className="flex flex-wrap items-baseline gap-2">
                <span className="text-ink uppercase tracking-wider">Institution:</span>
                <span>SRM Institute of Science and Technology, Chennai</span>
              </div>
              <div className="flex flex-wrap items-baseline gap-2">
                <span className="text-ink uppercase tracking-wider">Academic Standing:</span>
                <span className="text-accent font-semibold">CGPA {data.profile.cgpa || '8.60 / 10.00'}</span>
              </div>
              <div className="flex flex-wrap items-baseline gap-2">
                <span className="text-ink uppercase tracking-wider">Spoken Languages:</span>
                <span>English (Professional), Hindi (Native)</span>
              </div>
            </div>
          </div>

          {/* Quick Pillars / Highlights (5 cols) */}
          <div className="lg:col-span-5 space-y-8 pl-0 lg:pl-6 border-l-0 lg:border-l border-canvas-border">
            
            <div className="space-y-2">
              <h3 className="font-mono text-xs text-ink uppercase tracking-widest">
                Primary Specialization
              </h3>
              <p className="text-sm text-ink-secondary leading-relaxed">
                Applied computer vision, automated proctoring pipelines (YOLOv8 & MediaPipe), and predictive ML workflows with Scikit-learn, NumPy, and Pandas.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-mono text-xs text-ink uppercase tracking-widest">
                Systems Engineering
              </h3>
              <p className="text-sm text-ink-secondary leading-relaxed">
                Asynchronous RESTful APIs in FastAPI and Spring Boot/Node, hot-database Redis caching (40% latency reduction), and relational modeling in PostgreSQL and MySQL.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-mono text-xs text-ink uppercase tracking-widest">
                Research Inquiry
              </h3>
              <p className="text-sm text-ink-secondary leading-relaxed">
                Currently investigating semantic vector representations and algorithmic fairness in automated resume screening under the Reqruit IQ project.
              </p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
