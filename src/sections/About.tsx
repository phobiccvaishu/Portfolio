import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Brain, Cpu, Database, Sparkles, GraduationCap, MapPin, CheckCircle } from 'lucide-react';

export const About: React.FC = () => {
  const { data } = usePortfolio();

  const pillars = [
    {
      icon: <Brain className="w-6 h-6 text-accent" />,
      title: "AI & Computer Vision",
      description: "Developing intelligent perception pipelines using YOLOv8 for object classification and MediaPipe for facial & hand landmark detection in real-time proctoring applications."
    },
    {
      icon: <Cpu className="w-6 h-6 text-accent" />,
      title: "Intelligent Systems",
      description: "Integrating OpenAI GPT-4o with adaptive algorithms to create dynamic student clones, automated difficulty-adjusting quizzes, and personalized learning companions."
    },
    {
      icon: <Database className="w-6 h-6 text-accent" />,
      title: "Full-Stack & Systems Architecture",
      description: "Building resilient backends with FastAPI and Node.js/Express, pairing relational integrity (PostgreSQL/Prisma) with high-speed caches (Redis) and reactive frontends (React/Tailwind)."
    }
  ];

  return (
    <section id="about" className="py-20 md:py-28 border-t border-canvas-border relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-left space-y-3 mb-14">
          <div className="inline-flex items-center space-x-2 text-xs font-mono text-accent uppercase tracking-widest">
            <span>01 // Narrative</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-ink tracking-tight">
            About My Work & Engineering Focus
          </h2>
          <p className="text-base text-ink-secondary max-w-2xl">
            A genuine look at my technical direction, academic background, and the problems I am passionate about tackling.
          </p>
        </div>

        {/* Narrative & Snapshot Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Main Story (7 cols) */}
          <div className="lg:col-span-7 space-y-5 text-left text-ink-secondary leading-relaxed font-light text-base sm:text-lg">
            {data.profile.bio.map((paragraph, index) => (
              <p key={index} className="text-ink-secondary">
                {paragraph}
              </p>
            ))}

            <div className="p-4 rounded-xl bg-canvas-muted border border-canvas-border text-sm text-ink-secondary font-mono flex items-start space-x-3 mt-6">
              <span className="text-accent text-lg font-bold">“</span>
              <p className="italic text-ink">
                I believe in learning by building — where small, consistent iterations compound into high-impact systems.
              </p>
            </div>

            {/* Quick Fact Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
              <div className="flex items-center space-x-2.5 p-3 rounded-lg bg-canvas-subtle border border-canvas-border">
                <GraduationCap className="w-4 h-4 text-accent flex-shrink-0" />
                <span className="text-xs text-ink font-medium">B.Tech in CSE @ SRMIST (2023–2027)</span>
              </div>
              <div className="flex items-center space-x-2.5 p-3 rounded-lg bg-canvas-subtle border border-canvas-border">
                <MapPin className="w-4 h-4 text-accent flex-shrink-0" />
                <span className="text-xs text-ink font-medium">Chengalpattu, Chennai, India</span>
              </div>
            </div>
          </div>

          {/* Core Pillars (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-widest text-ink-muted text-left mb-2">
              Engineering Disciplines
            </h3>
            {pillars.map((pillar, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-canvas-subtle border border-canvas-border hover:border-canvas-borderStrong transition-all text-left space-y-2 group"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-canvas-muted border border-canvas-border group-hover:border-accent/40 transition-colors">
                    {pillar.icon}
                  </div>
                  <h4 className="font-display font-semibold text-ink text-base">
                    {pillar.title}
                  </h4>
                </div>
                <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed pl-1">
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};
