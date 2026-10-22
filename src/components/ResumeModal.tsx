import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ResumeModal: React.FC<ResumeModalProps> = ({ isOpen, onClose }) => {
  const { data } = usePortfolio();

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-ink/70 overflow-y-auto">
      {/* Modal Container */}
      <div className="bg-canvas border border-canvas-border max-w-4xl w-full shadow-2xl my-6 flex flex-col max-h-[92vh] overflow-hidden text-left">
        
        {/* Top Control Bar */}
        <div className="p-4 sm:px-6 bg-canvas-surface border-b border-canvas-border flex items-center justify-between flex-shrink-0">
          <div>
            <div className="font-display text-lg text-ink font-normal">
              {data.profile.name} &mdash; Official Resume
            </div>
            <div className="font-mono text-[11px] text-ink-secondary uppercase tracking-wider">
              SRMIST B.Tech CSE &bull; CGPA 8.60 / 10.00
            </div>
          </div>

          <div className="flex items-center space-x-3 font-mono text-xs">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-ink text-canvas hover:bg-accent hover:text-white transition-colors uppercase tracking-wider"
            >
              Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="px-2.5 py-1.5 border border-canvas-border hover:border-ink text-ink-secondary hover:text-ink uppercase tracking-wider"
              aria-label="Close modal"
            >
              Close [x]
            </button>
          </div>
        </div>

        {/* Scrollable Printable Document Container */}
        <div className="p-6 sm:p-10 overflow-y-auto space-y-7 bg-canvas text-ink text-xs sm:text-sm font-sans">
          
          {/* Header */}
          <div className="text-center space-y-2 border-b border-canvas-border pb-6">
            <h1 className="text-3xl sm:text-4xl font-display font-normal uppercase tracking-wider text-ink">
              {data.profile.name}
            </h1>
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 font-mono text-xs text-ink-secondary">
              {data.profile.phone && <span>{data.profile.phone}</span>}
              <span>&bull;</span>
              <a href={`mailto:${data.profile.email}`} className="text-ink hover:text-accent">
                {data.profile.email}
              </a>
              <span>&bull;</span>
              <a
                href={`https://www.linkedin.com/in/${data.profile.linkedinSlug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink hover:text-accent"
              >
                linkedin.com/in/{data.profile.linkedinSlug}
              </a>
              <span>&bull;</span>
              <a
                href={`https://github.com/${data.profile.githubUsername}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink hover:text-accent"
              >
                github.com/{data.profile.githubUsername}
              </a>
              <span>&bull;</span>
              <a
                href={data.profile.leetcodeUrl || "https://leetcode.com/u/vaish_phob/"}
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink hover:text-accent"
              >
                leetcode.com/u/{data.profile.leetcodeUsername || 'vaish_phob'}
              </a>
            </div>
          </div>

          {/* 1. EDUCATION */}
          <div className="space-y-2">
            <h2 className="font-mono text-xs uppercase tracking-widest text-accent pb-1 border-b border-canvas-border font-semibold">
              Education
            </h2>
            {data.education.map((edu) => (
              <div key={edu.id} className="space-y-1 text-xs sm:text-sm">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between font-normal text-ink">
                  <span className="font-display text-lg">{edu.institution}</span>
                  <span className="font-mono text-xs text-ink-secondary">{edu.location}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between italic text-ink-secondary">
                  <span>{edu.degree} &mdash; <strong className="not-italic font-mono text-ink">CGPA: {edu.cgpa || '8.60 / 10.00'}</strong></span>
                  <span className="font-mono not-italic text-xs text-ink-secondary">{edu.startYear} &mdash; {edu.endYear}</span>
                </div>
                <div className="text-xs text-ink-secondary pt-1 font-mono">
                  <strong className="text-ink">Relevant Coursework:</strong> Data Structures & Algorithms, Object-Oriented Programming, DBMS, Operating Systems, Computer Networks, System Design, RESTful API Engineering.
                </div>
              </div>
            ))}
          </div>

          {/* 2. TECHNICAL SKILLS */}
          <div className="space-y-2">
            <h2 className="font-mono text-xs uppercase tracking-widest text-accent pb-1 border-b border-canvas-border font-semibold">
              Technical Skills
            </h2>
            <div className="space-y-1.5 text-xs text-ink-secondary leading-relaxed font-mono">
              <div>
                <strong className="text-ink">Languages:</strong> Java, Python, C++, C, JavaScript (ES6+), TypeScript, SQL
              </div>
              <div>
                <strong className="text-ink">Frameworks & Web:</strong> React.js, FastAPI, Spring Boot, Node.js, HTML5, CSS3, REST APIs
              </div>
              <div>
                <strong className="text-ink">Databases & Caching:</strong> PostgreSQL, MySQL, Redis, Prisma ORM
              </div>
              <div>
                <strong className="text-ink">Developer Tools:</strong> Git, GitHub, Postman, Docker, Containerization, Uvicorn, Jupyter Notebook
              </div>
              <div>
                <strong className="text-ink">Machine Learning & Data:</strong> Scikit-Learn, NumPy, Pandas, Whoosh (Information Retrieval)
              </div>
              <div>
                <strong className="text-ink">Core Concepts:</strong> Data Structures & Algorithms, Object-Oriented Design, Operating Systems, DBMS, System Architecture, Microservices
              </div>
            </div>
          </div>

          {/* 3. PROJECTS */}
          <div className="space-y-4">
            <h2 className="font-mono text-xs uppercase tracking-widest text-accent pb-1 border-b border-canvas-border font-semibold">
              Engineering Projects
            </h2>

            {/* Online Examination System */}
            <div className="space-y-1">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between font-normal text-xs sm:text-sm">
                <span className="font-display text-base text-ink">Online Examination System with AI Proctoring</span>
                <span className="font-mono text-xs text-ink-secondary">FastAPI, YOLOv8, MediaPipe, Spring Boot/Node, MySQL</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-xs text-ink-secondary">
                <li>Developed a secure assessment platform executing automated evaluation and timer-controlled state handling.</li>
                <li>Engineered dedicated FastAPI computer-vision pipeline running YOLOv8 object detection and MediaPipe face & hand landmarkers for proctoring.</li>
                <li>Optimized relational schema and index structures in MySQL to handle 500+ concurrent examination submissions with zero data loss.</li>
              </ul>
            </div>

            {/* InsightU */}
            <div className="space-y-1">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between font-normal text-xs sm:text-sm">
                <span className="font-display text-base text-ink">InsightU &mdash; Smart Academic Collaboration Platform</span>
                <span className="font-mono text-xs text-ink-secondary">React.js, TypeScript, FastAPI, Redis, PostgreSQL</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-xs text-ink-secondary">
                <li>Engineered a high-concurrency academic collaboration platform featuring real-time state synchronization, handling 1,000+ concurrent simulated requests.</li>
                <li>Integrated Redis caching layer for hot database queries, achieving a 40% reduction in average API latency under load.</li>
                <li>Implemented secure authentication architecture using JWT with Role-Based Access Control (RBAC) across student and faculty access routes.</li>
              </ul>
            </div>

            {/* Datara / ChronoSearch */}
            <div className="space-y-1">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between font-normal text-xs sm:text-sm">
                <span className="font-display text-base text-ink">Datara (ChronoSearch) &mdash; Time-Aware Information Retrieval System</span>
                <span className="font-mono text-xs text-ink-secondary">Python, FastAPI, Whoosh Engine, PostgreSQL</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-xs text-ink-secondary">
                <li>Architected scalable full-text and semantic information retrieval engine utilizing the Whoosh indexing engine for dynamic CSV ingestion.</li>
                <li>Optimized multi-field inverted index queries, accelerating structured dataset search speeds by 30% across 100k+ records.</li>
              </ul>
            </div>

            {/* Adaptive Study Twin */}
            <div className="space-y-1">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between font-normal text-xs sm:text-sm">
                <span className="font-display text-base text-ink">Adaptive Study Twin &mdash; AI-Driven Personalization Engine</span>
                <span className="font-mono text-xs text-ink-secondary">Python, FastAPI, Scikit-learn, React.js</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-xs text-ink-secondary">
                <li>Built an AI-assisted adaptive learning platform that dynamically tailors evaluation difficulty based on performance metrics.</li>
                <li>Engineered diagnostic assessment algorithms using Scikit-learn identifying learner weakness vectors with 88% classification accuracy.</li>
              </ul>
            </div>

            {/* Reqruit IQ */}
            <div className="space-y-1">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between font-normal text-xs sm:text-sm">
                <span className="font-display text-base text-ink">Reqruit IQ &mdash; AI Talent Intelligence Platform [Ongoing Paper]</span>
                <span className="font-mono text-xs text-ink-secondary">Python, FastAPI, Scikit-learn, React.js, PostgreSQL</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-xs text-ink-secondary">
                <li>Authoring active research paper: <em>"Algorithmic Fairness and Semantic Relevance in Automated Candidate Resume Retrieval"</em>.</li>
                <li>Architecting semantic candidate scoring pipelines utilizing vector similarity and FastAPI asynchronous endpoints.</li>
              </ul>
            </div>
          </div>

          {/* 4. EXPERIENCE */}
          <div className="space-y-3">
            <h2 className="font-mono text-xs uppercase tracking-widest text-accent pb-1 border-b border-canvas-border font-semibold">
              Experience & Internships
            </h2>

            <div className="space-y-1">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between font-normal text-xs sm:text-sm">
                <span className="font-display text-base text-ink">Unified Mentor &mdash; Software Engineer / AI-ML Intern</span>
                <span className="font-mono text-xs text-accent">Ongoing (3 Months Online Internship)</span>
              </div>
              <p className="text-xs text-ink-secondary">
                Undergoing 3-month online engineering internship developing modular full-stack and predictive machine learning components.
              </p>
            </div>

            <div className="space-y-1">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between font-normal text-xs sm:text-sm">
                <span className="font-display text-base text-ink">C-DAC MEPZ &mdash; Artificial Intelligence & Machine Learning Trainee</span>
                <span className="font-mono text-xs text-ink-secondary">Jul. 2026 &mdash; Present | Chennai, India</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-xs text-ink-secondary">
                <li>Engineered end-to-end predictive pipelines using Scikit-learn, Pandas, and NumPy across an intensive 400-hour industry specialization.</li>
                <li>Executed data preprocessing, feature selection, and model evaluation techniques on real-world structured datasets.</li>
              </ul>
            </div>

            <div className="space-y-1">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between font-normal text-xs sm:text-sm">
                <span className="font-display text-base text-ink">Aaruush, SRMIST &mdash; PPCH, Quality Assurance</span>
                <span className="font-mono text-xs text-ink-secondary">May 2026 &mdash; Present | Chennai, India</span>
              </div>
              <p className="text-xs text-ink-secondary">
                Directed cross-functional execution teams across multi-tier technical and educational events managing operations for 500+ participants.
              </p>
            </div>
          </div>

          {/* 5. CERTIFICATIONS & COMPETENCIES */}
          <div className="space-y-2">
            <h2 className="font-mono text-xs uppercase tracking-widest text-accent pb-1 border-b border-canvas-border font-semibold">
              Certifications & Problem Solving
            </h2>
            <div className="space-y-1.5 text-xs text-ink-secondary font-mono">
              <div>
                <strong className="text-ink">Certifications:</strong> C-DAC AI/ML (400-Hour Advanced Specialization &mdash; <span className="text-accent font-semibold">Ongoing</span>), NPTEL Programming in Java, SRMIST Advanced Java & DSA in C.
              </div>
              <div>
                <strong className="text-ink">Problem Solving:</strong> Active algorithmic practice on LeetCode (@vaish_phob, 30 solved: 20 Easy, 10 Medium, verified in C and Java).
              </div>
            </div>
          </div>

        </div>

        {/* Modal Bottom Footer */}
        <div className="p-4 bg-canvas-surface border-t border-canvas-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-ink-secondary">
          <span>Verified against official academic and repository record</span>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-4 py-1.5 bg-ink text-canvas hover:bg-accent hover:text-white uppercase tracking-wider transition-colors"
            >
              Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="px-3 py-1.5 border border-canvas-border hover:border-ink uppercase tracking-wider transition-colors"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
