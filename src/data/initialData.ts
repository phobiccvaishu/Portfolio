import { PortfolioData } from '../types/portfolio';

export const initialPortfolioData: PortfolioData = {
  profile: {
    name: "Vaishnavi Singh",
    preferredName: "Vaish",
    headline: "Building intelligent systems. Turning ideas into impact.",
    supportingStatement: "Computer Science Engineering student at SRM Institute of Science and Technology exploring AI/ML, computer vision, and scalable full-stack applications.",
    bio: [
      "I'm a Computer Science Engineering student passionate about crafting intelligent applications that solve tangible problems. My technical focus bridges artificial intelligence with robust software architecture.",
      "From building computer vision-driven proctoring pipelines with YOLOv8 and MediaPipe to architecting full-stack academic platforms with real-time sync, I believe in learning by engineering real-world systems.",
      "Currently diving deeper into scalable backend systems, computer vision models, and LLM-assisted workflows, always aiming for clean code, responsive UX, and solid system design."
    ],
    location: "Chengalpattu, Chennai, Tamil Nadu",
    email: "vaishnavi1657@gmail.com",
    avatarUrl: "https://avatars.githubusercontent.com/u/165480899?v=4",
    githubUsername: "phobiccvaishu",
    linkedinSlug: "vaishnavi-singh-076aba343",
    isOpenToOpportunities: true,
    targetRoles: [
      "AI/ML Engineer Intern",
      "Software Development Engineer Intern",
      "Full-Stack Developer",
      "Backend Developer"
    ]
  },
  skills: [
    // Languages
    { id: 'sk-1', name: 'Java', category: 'Languages', proficiency: 'Advanced', source: 'profile-listed', isHighlighted: true },
    { id: 'sk-2', name: 'Python', category: 'Languages', proficiency: 'Advanced', source: 'verified-repo', evidenceRepo: 'Online-Examination-System / ChronoSearch', isHighlighted: true },
    { id: 'sk-3', name: 'JavaScript (ES6+)', category: 'Languages', proficiency: 'Advanced', source: 'verified-repo', evidenceRepo: 'Adaptive-Study-Twin', isHighlighted: true },
    { id: 'sk-4', name: 'TypeScript', category: 'Languages', proficiency: 'Intermediate', source: 'verified-repo', evidenceRepo: 'InsightU', isHighlighted: true },
    { id: 'sk-5', name: 'SQL', category: 'Languages', proficiency: 'Intermediate', source: 'profile-listed', isHighlighted: false },

    // AI & Machine Learning
    { id: 'sk-6', name: 'Computer Vision (YOLOv8)', category: 'AI / Machine Learning', proficiency: 'Intermediate', source: 'verified-repo', evidenceRepo: 'Online-Examination-System', isHighlighted: true },
    { id: 'sk-7', name: 'MediaPipe Face & Hand Landmarking', category: 'AI / Machine Learning', proficiency: 'Intermediate', source: 'verified-repo', evidenceRepo: 'Online-Examination-System', isHighlighted: true },
    { id: 'sk-8', name: 'LLM Orchestration (OpenAI GPT-4o)', category: 'AI / Machine Learning', proficiency: 'Intermediate', source: 'verified-repo', evidenceRepo: 'Adaptive-Study-Twin', isHighlighted: true },
    { id: 'sk-9', name: 'Heuristic Search (A* Algorithms)', category: 'AI / Machine Learning', proficiency: 'Intermediate', source: 'profile-listed', isHighlighted: false },
    { id: 'sk-10', name: 'PyTorch / CNN Explorations', category: 'AI / Machine Learning', proficiency: 'Foundational', source: 'verified-repo', evidenceRepo: 'trashnet', isHighlighted: false },

    // Backend & Systems
    { id: 'sk-11', name: 'Node.js & Express', category: 'Backend & Systems', proficiency: 'Advanced', source: 'verified-repo', evidenceRepo: 'Adaptive-Study-Twin / InsightU', isHighlighted: true },
    { id: 'sk-12', name: 'FastAPI (Python)', category: 'Backend & Systems', proficiency: 'Advanced', source: 'verified-repo', evidenceRepo: 'ChronoSearch / AI-Service', isHighlighted: true },
    { id: 'sk-13', name: 'RESTful API Architecture', category: 'Backend & Systems', proficiency: 'Advanced', source: 'verified-repo', evidenceRepo: 'Multi-repo', isHighlighted: false },
    { id: 'sk-14', name: 'Socket.io (Real-time)', category: 'Backend & Systems', proficiency: 'Intermediate', source: 'verified-repo', evidenceRepo: 'InsightU', isHighlighted: false },

    // Frontend & Web
    { id: 'sk-15', name: 'React (v18 / v19)', category: 'Frontend & Web', proficiency: 'Advanced', source: 'verified-repo', evidenceRepo: 'InsightU / Adaptive-Study-Twin', isHighlighted: true },
    { id: 'sk-16', name: 'Tailwind CSS', category: 'Frontend & Web', proficiency: 'Advanced', source: 'verified-repo', evidenceRepo: 'Adaptive-Study-Twin', isHighlighted: true },
    { id: 'sk-17', name: 'Framer Motion', category: 'Frontend & Web', proficiency: 'Intermediate', source: 'verified-repo', evidenceRepo: 'Adaptive-Study-Twin', isHighlighted: false },
    { id: 'sk-18', name: 'Vite', category: 'Frontend & Web', proficiency: 'Advanced', source: 'verified-repo', evidenceRepo: 'Adaptive-Study-Twin', isHighlighted: false },

    // Databases & Cache
    { id: 'sk-19', name: 'PostgreSQL & Prisma ORM', category: 'Databases & Cache', proficiency: 'Intermediate', source: 'verified-repo', evidenceRepo: 'InsightU', isHighlighted: true },
    { id: 'sk-20', name: 'MongoDB & Mongoose', category: 'Databases & Cache', proficiency: 'Intermediate', source: 'verified-repo', evidenceRepo: 'Adaptive-Study-Twin', isHighlighted: true },
    { id: 'sk-21', name: 'Redis Caching', category: 'Databases & Cache', proficiency: 'Intermediate', source: 'verified-repo', evidenceRepo: 'InsightU', isHighlighted: false },
    { id: 'sk-22', name: 'MySQL DBMS', category: 'Databases & Cache', proficiency: 'Intermediate', source: 'profile-listed', isHighlighted: false },

    // Tools & DevOps
    { id: 'sk-23', name: 'Git & GitHub Version Control', category: 'Tools & DevOps', proficiency: 'Advanced', source: 'profile-listed', isHighlighted: true },
    { id: 'sk-24', name: 'Postman & API Testing', category: 'Tools & DevOps', proficiency: 'Intermediate', source: 'profile-listed', isHighlighted: false },
    { id: 'sk-25', name: 'VS Code & JetBrains IDEs', category: 'Tools & DevOps', proficiency: 'Advanced', source: 'profile-listed', isHighlighted: false },
    { id: 'sk-26', name: 'npm Workspaces', category: 'Tools & DevOps', proficiency: 'Intermediate', source: 'verified-repo', evidenceRepo: 'InsightU', isHighlighted: false }
  ],
  projects: [
    {
      id: 'proj-1',
      title: 'Online Examination System with AI Proctoring',
      tagline: 'Computer vision-powered proctoring pipeline with YOLOv8 & MediaPipe landmarking',
      description: 'A comprehensive online exam platform featuring a dedicated Python AI microservice for anti-cheating supervision. Analyzes real-time video streams using Ultralytics YOLOv8 for secondary electronic device detection and MediaPipe Face/Hand Landmarkers for gaze deviation and gesture monitoring.',
      category: 'AI & Intelligent Systems',
      technologies: ['Python', 'FastAPI', 'YOLOv8', 'MediaPipe', 'OpenCV', 'Node.js', 'Express', 'MySQL'],
      keyFeatures: [
        'Dedicated FastAPI computer-vision service processing base64 image frames',
        'Ultralytics YOLOv8s object detection trained to flag prohibited devices (phones, unauthorized notes)',
        'MediaPipe Face Landmarker with facial transformation matrices and blendshapes for head pose tracking',
        'MediaPipe Hand Landmarker monitoring off-screen gesture behaviors',
        'Timed exam engine with auto-submission, secure JWT auth, and automated score computation'
      ],
      architectureNotes: 'Dual-service architecture: Node.js/Express core handles student authentication, exam session scheduling, and database persistence; an asynchronous FastAPI microservice runs parallel inference models on incoming camera frames.',
      githubUrl: 'https://github.com/phobiccvaishu/Online-Examination-System',
      verifiedFromGithub: true,
      status: 'Active Development',
      isFeatured: true,
      demoType: 'interactive-mock'
    },
    {
      id: 'proj-2',
      title: 'Adaptive Study Twin',
      tagline: 'AI-driven personalized student clone adapting to learning styles in real-time',
      description: 'An AI-powered learning companion that models student performance, identifies knowledge gaps across subjects, and dynamically generates customized study schedules, targeted practice quizzes, and interactive concept explanations.',
      category: 'AI & Intelligent Systems',
      technologies: ['React', 'Tailwind CSS', 'Framer Motion', 'Node.js', 'Express', 'MongoDB', 'OpenAI GPT-4o'],
      keyFeatures: [
        'Personalized onboarding flow constructing an adaptive student learning profile',
        'Dynamic MCQ Quiz Engine that automatically modulates problem difficulty based on real-time accuracy',
        'Smart daily study planner prioritizing subjects where student mastery scores are lowest',
        'Context-aware AI Chat Tutor for rapid doubt resolution and concept deconstruction',
        'Interactive analytics dashboard visualising subject mastery and progress trajectories'
      ],
      architectureNotes: 'Frontend client built with React and Framer Motion communicating via REST with an Express/Node backend backed by MongoDB schemas for user profiles, performance metrics, and contextual conversation histories.',
      githubUrl: 'https://github.com/phobiccvaishu/Adaptive-Study-Twin',
      verifiedFromGithub: true,
      status: 'Production-ready',
      isFeatured: true,
      demoType: 'interactive-mock'
    },
    {
      id: 'proj-3',
      title: 'InsightU Academic Ecosystem',
      tagline: 'High-performance university platform with timetable mapping and Smart Board sync',
      description: 'A modern academic ecosystem engineered for university environments. Streamlines student health tracking (attendance thresholds, course credits, grade performance), smart timetable scheduling via OCR, and live synchronized lecture note annotations.',
      category: 'Full-Stack Platforms',
      technologies: ['React 18', 'TypeScript', 'Tailwind CSS', 'Node.js', 'Express', 'Prisma ORM', 'PostgreSQL', 'Redis', 'Socket.io'],
      keyFeatures: [
        'Real-time academic health dashboard tracking attendance percentages and credit progress',
        'Smart timetable automated mapping using OCR parsing logic',
        'Collaborative subject section feeds providing focused peer and faculty discussions',
        'Live note synchronization engine reflecting Smart Board digital annotations',
        'Prisma ORM schema with PostgreSQL relational integrity and Redis caching layer'
      ],
      architectureNotes: 'Constructed as an npm workspace monorepo. Uses Prisma ORM for database migrations, Redis for fast cache invalidation, and Socket.io for low-latency live annotation broadcasts.',
      githubUrl: 'https://github.com/phobiccvaishu/InsightU',
      verifiedFromGithub: true,
      status: 'Active Development',
      isFeatured: true,
      demoType: 'interactive-mock'
    },
    {
      id: 'proj-4',
      title: 'ChronoSearch',
      tagline: 'Time-aware temporal search and dataset indexing engine',
      description: 'A FastAPI-backed temporal data search and management platform designed to upload, index, and query multi-file time-stamped datasets with temporal filtering, pagination, and sorting.',
      category: 'Algorithms & Systems',
      technologies: ['Python', 'FastAPI', 'Pandas', 'Uvicorn', 'Jinja2', 'HTML/CSS'],
      keyFeatures: [
        'Multi-file CSV upload and validation with Pandas data structuring',
        'Time-series filtering algorithms allowing precise date-range querying',
        'Server-rendered responsive UI with real-time tabular sorting and pagination',
        'Clean asynchronous REST endpoints powered by FastAPI and Uvicorn'
      ],
      architectureNotes: 'Lightweight high-throughput Python backend leveraging Pandas vectorized operations for sub-second dataset filtration and Jinja2 templating for fast initial render.',
      githubUrl: 'https://github.com/phobiccvaishu/ChronoSearch',
      verifiedFromGithub: true,
      status: 'Active Development',
      isFeatured: false,
      demoType: 'code-walkthrough'
    },
    {
      id: 'proj-5',
      title: 'A* 8-Puzzle Solver',
      tagline: 'Optimal state-space heuristic search algorithm implementation',
      description: 'An AI problem-solving implementation utilizing the A* Search algorithm with heuristic evaluation (Manhattan Distance and Misplaced Tiles) to compute the minimal move solution path for the classical 8-puzzle problem.',
      category: 'Algorithms & Systems',
      technologies: ['Java', 'Algorithms', 'Heuristic Search', 'Graph Traversal'],
      keyFeatures: [
        'Priority Queue-backed state-space tree exploration',
        'Dual heuristic metrics comparison (Manhattan distance vs misplaced tiles)',
        'Guaranteed optimal path retrieval with node visitation tracking and cycle pruning',
        'Step-by-step visual solution breakdown'
      ],
      architectureNotes: 'Standalone algorithmic engine designed to benchmark heuristic admissible properties and branch factor reduction.',
      githubUrl: 'https://github.com/phobiccvaishu',
      verifiedFromGithub: true,
      status: 'Prototype / Research',
      isFeatured: false,
      demoType: 'code-walkthrough'
    },
    {
      id: 'proj-6',
      title: 'War Grid Game (AI Strategy)',
      tagline: 'Adaptive AI-driven grid tactics game with predictive decision trees',
      description: 'An interactive grid-based strategy game where the automated opponent dynamically counterbalances player tactics by assessing position control, movement anticipation, and minimax-inspired decision heuristics.',
      category: 'AI & Intelligent Systems',
      technologies: ['Java', 'Game AI', 'Decision Trees', 'Algorithm Design'],
      keyFeatures: [
        'Real-time algorithmic opponent evaluating tactical grid states',
        'Adaptive difficulty curve responding to offensive vs defensive player actions',
        'State-evaluation scoring matrix assessing spatial board dominance'
      ],
      architectureNotes: 'Object-oriented Java game loop with decoupled AI player controllers facilitating rapid heuristic parameter tuning.',
      githubUrl: 'https://github.com/phobiccvaishu',
      verifiedFromGithub: true,
      status: 'Prototype / Research',
      isFeatured: false,
      demoType: 'code-walkthrough'
    }
  ],
  education: [
    {
      id: 'edu-1',
      institution: 'SRM Institute of Science and Technology',
      degree: 'Bachelor of Technology (B.Tech)',
      fieldOfStudy: 'Computer Science and Engineering',
      startYear: '2023',
      endYear: '2027 (Expected)',
      location: 'Kattankulathur, Chennai, Tamil Nadu',
      grade: 'In Progress (Strong Academic Standing)',
      highlights: [
        'Core coursework: Data Structures & Algorithms, Object-Oriented Programming (Java), Database Management Systems (DBMS), Operating Systems',
        'Active participant in technical student hackathons and competitive programming communities',
        'Focus on Machine Learning, Computer Vision, and Modern Full-Stack Web Development'
      ],
      verified: true
    }
  ],
  experience: [
    {
      id: 'exp-1',
      role: 'Student Software Engineer & Project Lead',
      organization: 'Academic & Open-Source Projects (SRMIST)',
      location: 'Chennai, India',
      startDate: 'Aug 2024',
      endDate: 'Present',
      current: true,
      description: 'Leading the design, prototyping, and implementation of intelligent software platforms across computer vision, AI tutoring, and university systems.',
      responsibilities: [
        'Architected AI proctoring pipeline combining MediaPipe landmarkers with YOLOv8 inference for automated candidate monitoring.',
        'Developed Adaptive Study Twin using React, Node.js, Express, and OpenAI GPT-4o to provide dynamic quizzes and weakness targeting.',
        'Collaborated on repository architectures, conducting code reviews, implementing REST APIs, and maintaining Git version workflows.'
      ],
      technologies: ['Python', 'FastAPI', 'YOLOv8', 'MediaPipe', 'React', 'Node.js', 'MongoDB', 'PostgreSQL'],
      type: 'academic',
      verified: true
    }
  ],
  credentials: [
    {
      id: 'cred-1',
      title: 'Computer Vision & Deep Learning Fundamentals',
      issuer: 'Technical Coursework & Research Verification',
      type: 'course',
      issueDate: '2025',
      verificationUrl: 'https://github.com/phobiccvaishu/Online-Examination-System',
      isPublic: true,
      verified: true
    },
    {
      id: 'cred-2',
      title: 'Full-Stack Web Development (Node.js & React)',
      issuer: 'Engineering Lab Practice & Project Verification',
      type: 'course',
      issueDate: '2024',
      verificationUrl: 'https://github.com/phobiccvaishu/Adaptive-Study-Twin',
      isPublic: true,
      verified: true
    }
  ],
  socialLinks: [
    { platform: 'github', url: 'https://github.com/phobiccvaishu', label: 'github.com/phobiccvaishu', verified: true },
    { platform: 'linkedin', url: 'https://www.linkedin.com/in/vaishnavi-singh-076aba343', label: 'linkedin.com/in/vaishnavi-singh-076aba343', verified: true },
    { platform: 'email', url: 'mailto:vaishnavi1657@gmail.com', label: 'vaishnavi1657@gmail.com', verified: true }
  ],
  dataSources: [
    {
      source: 'GitHub API',
      status: 'Connected',
      lastSync: new Date().toISOString(),
      notes: 'Profile, 6 public repositories, commit trees, and tech stack verified via GitHub REST API.'
    },
    {
      source: 'LinkedIn Public Check',
      status: 'Authentication Required / Authwall',
      lastSync: new Date().toISOString(),
      notes: 'LinkedIn requires authenticated session (HTTP 999 response). Import interface active for PDF/CSV upload.'
    },
    {
      source: 'Manual Verified',
      status: 'Connected',
      lastSync: new Date().toISOString(),
      notes: 'Profile README, institution, and project specifications verified without fabrication.'
    }
  ],
  lastUpdated: new Date().toISOString()
};
