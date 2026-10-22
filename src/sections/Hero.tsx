import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { usePortfolio } from '../context/PortfolioContext';
import { ResumeModal } from '../components/ResumeModal';
import { ArrowDownRight } from 'lucide-react';

export const Hero: React.FC = () => {
  const { data } = usePortfolio();
  const [showResumeModal, setShowResumeModal] = useState(false);

  return (
    <section className="pt-20 pb-16 sm:pt-28 sm:pb-24 border-b border-canvas-border">
      <div className="max-w-editorial mx-auto px-5 sm:px-8">
        
        {/* Top metadata row */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="flex flex-wrap items-center justify-between gap-y-2 text-xs font-mono uppercase tracking-widest text-ink-secondary mb-10 sm:mb-14 pb-4 border-b border-canvas-border"
        >
          <div className="flex items-center space-x-2">
            <span className="w-1.5 h-1.5 bg-accent inline-block" />
            <span>Chennai, India</span>
            <span className="text-canvas-border">/</span>
            <span>SRMIST CSE '28</span>
          </div>

          <div className="flex items-center space-x-3 text-[11px]">
            <span>CGPA {data.profile.cgpa || '8.60 / 10.00'}</span>
            <span className="text-canvas-border">/</span>
            <span className="text-accent">Available for Internships</span>
          </div>
        </motion.div>

        {/* Large Serif Title */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.05, ease: 'easeOut' }}
          className="space-y-6 sm:space-y-8 text-left"
        >
          <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl xl:text-9xl font-normal tracking-tight text-ink leading-[0.95]">
            Vaishnavi Singh
          </h1>

          {/* Editorial one-liner */}
          <p className="text-lg sm:text-xl lg:text-2xl text-ink-secondary max-w-3xl font-normal leading-relaxed">
            Computer Science Engineering student at SRM Institute of Science and Technology. Developing artificial intelligence pipelines, computer vision proctoring systems, and high-concurrency backend applications.
          </p>

          {/* Quick metadata line */}
          <div className="pt-2 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-mono text-ink-secondary uppercase tracking-wider">
            <div>
              <span className="text-ink">Current: </span>
              <span>C-DAC AI/ML Trainee &bull; Unified Mentor Intern</span>
            </div>
            <span className="text-canvas-border hidden sm:inline">|</span>
            <div>
              <span className="text-ink">Research: </span>
              <span className="text-accent">Reqruit IQ Paper (Ongoing)</span>
            </div>
          </div>

          {/* Direct Text Links Row */}
          <div className="pt-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs font-mono uppercase tracking-widest">
            <button
              onClick={() => setShowResumeModal(true)}
              className="editorial-link text-ink hover:text-accent font-medium pb-0.5 flex items-center space-x-1"
            >
              <span>View e-Resume</span>
              <ArrowDownRight className="w-3.5 h-3.5 text-accent" />
            </button>

            <a
              href="#projects"
              className="editorial-link text-ink-secondary hover:text-ink pb-0.5"
            >
              Index of Work &darr;
            </a>

            <a
              href={`https://github.com/${data.profile.githubUsername}`}
              target="_blank"
              rel="noopener noreferrer"
              className="editorial-link text-ink-secondary hover:text-ink pb-0.5"
            >
              GitHub &nearr;
            </a>

            <a
              href={`https://www.linkedin.com/in/${data.profile.linkedinSlug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="editorial-link text-ink-secondary hover:text-ink pb-0.5"
            >
              LinkedIn &nearr;
            </a>

            <a
              href={data.profile.leetcodeUrl || "https://leetcode.com/u/vaish_phob/"}
              target="_blank"
              rel="noopener noreferrer"
              className="editorial-link text-ink-secondary hover:text-ink pb-0.5"
            >
              LeetCode &nearr;
            </a>

            <a
              href={`mailto:${data.profile.email}`}
              className="editorial-link text-ink-secondary hover:text-ink pb-0.5"
            >
              Email &nearr;
            </a>
          </div>

        </motion.div>

      </div>

      {/* Clean e-Resume Modal */}
      <ResumeModal isOpen={showResumeModal} onClose={() => setShowResumeModal(false)} />
    </section>
  );
};
