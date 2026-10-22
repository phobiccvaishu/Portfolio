import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import {
  FileText,
  Printer,
  X,
  ExternalLink,
  Mail,
  Phone,
  Github,
  Linkedin,
  Code2,
  GraduationCap,
  Briefcase,
  CheckCircle2,
  Award,
  Layers,
  Sparkles
} from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
      {/* Modal Container */}
      <div className="bg-canvas-subtle border border-canvas-border max-w-4xl w-full rounded-2xl shadow-2xl my-6 flex flex-col max-h-[92vh] overflow-hidden">
        
        {/* Modal Top Bar */}
        <div className="p-4 sm:px-6 bg-canvas-muted border-b border-canvas-border flex items-center justify-between flex-shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 rounded-lg bg-accent/10 border border-accent-border text-accent">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-display font-bold text-sm sm:text-base text-ink flex items-center gap-2">
                <span>{data.profile.name} — Verified e-Resume</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-accent text-black font-semibold uppercase">
                  SRMIST CSE
                </span>
              </h2>
              <span className="text-[11px] font-mono text-ink-muted">
                Official Engineering Format • Current CGPA: 8.60/10.00
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-accent text-black font-semibold text-xs hover:bg-accent-hover transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save as PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-ink-muted hover:text-ink hover:bg-canvas-surface transition-colors border border-transparent hover:border-canvas-border"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Printable Document Container */}
        <div className="p-4 sm:p-8 overflow-y-auto space-y-6 text-left font-sans bg-canvas text-ink text-xs sm:text-sm selection:bg-accent selection:text-black">
          
          {/* Document Header */}
          <div className="text-center space-y-2 border-b border-canvas-border pb-5">
            <h1 className="text-2xl sm:text-3xl font-display font-extrabold uppercase tracking-wide text-ink">
              {data.profile.name}
            </h1>
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[11px] sm:text-xs font-mono text-ink-secondary">
              {data.profile.phone && (
                <a href={`tel:${data.profile.phone}`} className="hover:text-accent flex items-center gap-1">
                  <Phone className="w-3 h-3 text-accent" />
                  <span>{data.profile.phone}</span>
                </a>
              )}
              <span>•</span>
              <a href={`mailto:${data.profile.email}`} className="hover:text-accent flex items-center gap-1">
                <Mail className="w-3 h-3 text-accent" />
                <span>{data.profile.email}</span>
              </a>
              <span>•</span>
              <a
                href={`https://www.linkedin.com/in/${data.profile.linkedinSlug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent flex items-center gap-1"
              >
                <Linkedin className="w-3 h-3 text-accent" />
                <span>linkedin.com/in/{data.profile.linkedinSlug}</span>
              </a>
              <span>•</span>
              <a
                href={`https://github.com/${data.profile.githubUsername}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent flex items-center gap-1"
              >
                <Github className="w-3 h-3 text-accent" />
                <span>github.com/{data.profile.githubUsername}</span>
              </a>
              {data.profile.leetcodeUrl && (
                <>
                  <span>•</span>
                  <a
                    href={data.profile.leetcodeUrl || "https://leetcode.com/u/vaish_phob/"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-accent flex items-center gap-1 text-accent font-semibold"
                  >
                    <Code2 className="w-3 h-3" />
                    <span>leetcode.com/u/{data.profile.leetcodeUsername || 'vaish_phob'}</span>
                  </a>
                </>
              )}
            </div>
          </div>

          {/* 1. EDUCATION */}
          <div className="space-y-2">
            <h2 className="text-xs font-mono uppercase tracking-widest text-accent font-bold border-b border-canvas-border pb-1">
              Education
            </h2>
            {data.education.map((edu) => (
              <div key={edu.id} className="space-y-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between font-semibold text-ink">
                  <span>{edu.institution}</span>
                  <span className="font-mono text-xs text-ink-muted">{edu.location}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between italic text-ink-secondary text-xs">
                  <span>{edu.degree} – <strong className="text-accent not-italic font-mono">CGPA: {edu.cgpa || '8.60/10.00'}</strong></span>
                  <span className="font-mono not-italic text-ink-muted">{edu.startYear} – {edu.endYear}</span>
                </div>
                <div className="text-[11px] text-ink-muted pt-1">
                  <strong>Relevant Coursework:</strong> Data Structures & Algorithms, Object-Oriented Programming, DBMS, Operating Systems, Computer Networks, System Design, RESTful API Engineering.
                </div>
              </div>
            ))}
          </div>

          {/* 2. TECHNICAL SKILLS */}
          <div className="space-y-2">
            <h2 className="text-xs font-mono uppercase tracking-widest text-accent font-bold border-b border-canvas-border pb-1">
              Technical Skills
            </h2>
            <div className="space-y-1 text-xs text-ink-secondary leading-relaxed">
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
                <strong className="text-ink">Developer Tools & DevOps:</strong> Git, GitHub, Postman, Docker, Containerization, Uvicorn, Jupyter Notebook
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
            <h2 className="text-xs font-mono uppercase tracking-widest text-accent font-bold border-b border-canvas-border pb-1">
              Engineering Projects
            </h2>

            {/* Reqruit IQ (Ongoing with Research Paper) */}
            <div className="space-y-1">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between font-semibold text-ink text-xs sm:text-sm">
                <span className="flex items-center gap-1.5">
                  <span>Reqruit IQ – AI-Powered Talent Intelligence Platform</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-accent-muted text-accent border border-accent-border font-normal">
                    Ongoing Research Paper
                  </span>
                </span>
                <span className="font-mono text-xs text-ink-muted font-normal">
                  Python, FastAPI, Scikit-learn, React.js, PostgreSQL
                </span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-[11px] sm:text-xs text-ink-secondary">
                <li>Authoring an active research paper entitled <em>"Algorithmic Fairness and Semantic Relevance in Automated Candidate Resume Retrieval"</em>.</li>
                <li>Architecting end-to-end candidate screening pipelines scoring domain competencies with vector similarity search.</li>
                <li>Constructing asynchronous FastAPI microservices to evaluate multi-format resumes with sub-second latency.</li>
              </ul>
            </div>

            {/* InsightU */}
            <div className="space-y-1">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between font-semibold text-ink text-xs sm:text-sm">
                <span>InsightU – Smart Academic Collaboration Platform</span>
                <span className="font-mono text-xs text-ink-muted font-normal">
                  React.js, TypeScript, FastAPI, Redis, PostgreSQL
                </span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-[11px] sm:text-xs text-ink-secondary">
                <li>Engineered a high-concurrency academic collaboration platform featuring real-time state synchronization, handling <strong>1,000+ concurrent simulated requests</strong>.</li>
                <li>Integrated <strong>Redis caching layer</strong> for hot database queries, achieving a <strong>40% reduction in average API latency</strong> under load.</li>
                <li>Implemented secure authentication architecture using JWT with Role-Based Access Control (RBAC) across student and faculty access routes.</li>
                <li>Designed dynamic collaborative tools including live canvas synchronization, automated quiz generation, and responsive schedule management.</li>
              </ul>
            </div>

            {/* Datara / ChronoSearch */}
            <div className="space-y-1">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between font-semibold text-ink text-xs sm:text-sm">
                <span>Datara (ChronoSearch) – Time-Aware Information Retrieval System</span>
                <span className="font-mono text-xs text-ink-muted font-normal">
                  Python, FastAPI, Whoosh Engine, PostgreSQL
                </span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-[11px] sm:text-xs text-ink-secondary">
                <li>Architected a scalable full-text and semantic information retrieval engine utilizing the <strong>Whoosh indexing engine</strong> for dynamic CSV ingestion.</li>
                <li>Optimized multi-field inverted index queries, <strong>accelerating structured dataset search speeds by 30% across 100k+ records</strong>.</li>
                <li>Developed asynchronous RESTful endpoints via FastAPI for real-time document parsing, dynamic metadata extraction, and indexing.</li>
              </ul>
            </div>

            {/* Adaptive Study Twin */}
            <div className="space-y-1">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between font-semibold text-ink text-xs sm:text-sm">
                <span>Adaptive Study Twin – AI-Driven Personalization Engine</span>
                <span className="font-mono text-xs text-ink-muted font-normal">
                  Python, FastAPI, Scikit-learn, React.js
                </span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-[11px] sm:text-xs text-ink-secondary">
                <li>Built an AI-assisted adaptive learning platform that dynamically tailors evaluation difficulty and content pathways based on historical performance metrics.</li>
                <li>Engineered diagnostic assessment algorithms using <strong>Scikit-learn that identify learner weakness vectors with 88% classification accuracy</strong>.</li>
                <li>Structured modular REST services in FastAPI to support future integration of vector embeddings and LLM inference pipelines.</li>
              </ul>
            </div>

            {/* Online Examination System */}
            <div className="space-y-1">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between font-semibold text-ink text-xs sm:text-sm">
                <span>Online Examination System</span>
                <span className="font-mono text-xs text-ink-muted font-normal">
                  Spring Boot, React.js, MySQL, JWT
                </span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-[11px] sm:text-xs text-ink-secondary">
                <li>Developed a secure assessment platform executing automated evaluation and timer-controlled state handling for online testing.</li>
                <li>Optimized relational schema and index structures in MySQL to handle <strong>500+ concurrent examination submissions with zero data loss</strong>.</li>
              </ul>
            </div>
          </div>

          {/* 4. EXPERIENCE & INTERNSHIPS */}
          <div className="space-y-3">
            <h2 className="text-xs font-mono uppercase tracking-widest text-accent font-bold border-b border-canvas-border pb-1">
              Experience & Internships
            </h2>

            {/* Unified Mentor (Ongoing Internship) */}
            <div className="space-y-1">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between font-semibold text-ink text-xs sm:text-sm">
                <span>Unified Mentor – Software Engineer / AI-ML Intern</span>
                <span className="font-mono text-xs text-accent">Ongoing (3 Months Online Internship)</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-[11px] sm:text-xs text-ink-secondary">
                <li>Undergoing intensive 3-month online engineering internship specializing in real-world software development and applied machine learning deliverables.</li>
                <li>Developing modular full-stack and predictive features adhering to production design standards.</li>
              </ul>
            </div>

            {/* C-DAC MEPZ */}
            <div className="space-y-1">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between font-semibold text-ink text-xs sm:text-sm">
                <span>C-DAC MEPZ – Artificial Intelligence & Machine Learning Trainee</span>
                <span className="font-mono text-xs text-ink-muted">Jul. 2026 – Present | Chennai, India</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-[11px] sm:text-xs text-ink-secondary">
                <li>Engineered end-to-end predictive pipelines using Scikit-learn, Pandas, and NumPy across an intensive <strong>400-hour industry specialization program</strong>.</li>
                <li>Executed data preprocessing, feature selection, and model evaluation techniques on real-world structured datasets.</li>
                <li>Collaborated in agile software delivery workflows, adhering to modular programming standards and peer code reviews.</li>
              </ul>
            </div>

            {/* Aaruush SRMIST */}
            <div className="space-y-1">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between font-semibold text-ink text-xs sm:text-sm">
                <span>Aaruush, SRM Institute of Science and Technology – PPCH, Quality Assurance</span>
                <span className="font-mono text-xs text-ink-muted">May 2026 – Present | Chennai, India</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-[11px] sm:text-xs text-ink-secondary">
                <li>Directed cross-functional execution teams across multi-tier technical and educational events, managing operations for <strong>500+ participants</strong>.</li>
                <li>Coordinated stakeholder communication between university administration, event heads, and student teams to ensure smooth event delivery.</li>
              </ul>
            </div>
          </div>

          {/* 5. CERTIFICATIONS & COMPETENCIES */}
          <div className="space-y-2">
            <h2 className="text-xs font-mono uppercase tracking-widest text-accent font-bold border-b border-canvas-border pb-1">
              Certifications & Competencies
            </h2>
            <div className="space-y-1 text-xs text-ink-secondary">
              <div>
                <strong className="text-ink">Certifications:</strong> C-DAC AI/ML (400-Hour Advanced Specialization — <span className="text-accent font-semibold">Ongoing</span>), NPTEL Programming in Java, SRMIST Advanced Java & DSA in C.
              </div>
              <div>
                <strong className="text-ink">Problem Solving:</strong> Active algorithmic problem solving across platforms including LeetCode, focusing on Data Structures, Algorithms, and Dynamic Programming.
              </div>
              <div>
                <strong className="text-ink">Languages:</strong> English (Professional), Hindi (Native).
              </div>
            </div>
          </div>

        </div>

        {/* Modal Bottom Footer */}
        <div className="p-4 bg-canvas-muted border-t border-canvas-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-ink-muted">
          <span>Verified against Vaishnavi Singh's Official Academic & Repository Record</span>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-accent text-black font-semibold hover:bg-accent-hover transition-colors"
            >
              Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-canvas-surface text-ink hover:text-accent transition-colors"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
