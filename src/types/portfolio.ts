export type SkillCategory = 
  | 'Languages' 
  | 'AI / Machine Learning' 
  | 'Backend & Systems' 
  | 'Frontend & Web' 
  | 'Databases & Cache' 
  | 'Tools & DevOps';

export type SkillSource = 'verified-repo' | 'profile-listed' | 'user-confirmed';

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  proficiency?: 'Foundational' | 'Intermediate' | 'Advanced';
  source: SkillSource;
  evidenceRepo?: string;
  isHighlighted?: boolean;
}

export type ProjectCategory = 'AI & Intelligent Systems' | 'Full-Stack Platforms' | 'Algorithms & Systems' | 'Tools & Utilities';

export interface Project {
  id: string;
  title: string;
  tagline: string;
  description: string;
  category: ProjectCategory;
  technologies: string[];
  keyFeatures: string[];
  architectureNotes?: string;
  githubUrl: string;
  liveUrl?: string;
  verifiedFromGithub: boolean;
  status: 'Production-ready' | 'Active Development' | 'Prototype / Research';
  stars?: number;
  forks?: number;
  isFeatured: boolean;
  role?: string;
  demoType?: 'interactive-mock' | 'live-url' | 'code-walkthrough';
}

export interface Experience {
  id: string;
  role: string;
  organization: string;
  location?: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  responsibilities: string[];
  technologies: string[];
  type: 'internship' | 'leadership' | 'academic' | 'freelance' | 'full-time';
  verified: boolean;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startYear: string;
  endYear: string;
  location: string;
  grade?: string;
  highlights?: string[];
  verified: boolean;
}

export type CredentialType = 
  | 'certification' 
  | 'course' 
  | 'internship' 
  | 'training' 
  | 'award';

export interface Credential {
  id: string;
  title: string;
  issuer: string;
  type: CredentialType;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
  verificationUrl?: string;
  documentUrl?: string; // uploaded PDF or image
  fileName?: string;
  isPublic: boolean;
  verified: boolean;
}

export interface SocialLink {
  platform: 'github' | 'linkedin' | 'email' | 'twitter' | 'website';
  url: string;
  label: string;
  verified: boolean;
}

export interface PersonalProfile {
  name: string;
  preferredName?: string;
  headline: string;
  supportingStatement: string;
  bio: string[];
  location: string;
  email: string;
  avatarUrl: string;
  githubUsername: string;
  linkedinSlug: string;
  resumeUrl?: string;
  isOpenToOpportunities: boolean;
  targetRoles: string[];
}

export interface DataSourceStatus {
  source: 'GitHub API' | 'LinkedIn Public Check' | 'Manual Verified';
  status: 'Connected' | 'Authentication Required / Authwall' | 'Cached';
  lastSync: string;
  notes: string;
}

export interface PortfolioData {
  profile: PersonalProfile;
  skills: Skill[];
  projects: Project[];
  experience: Experience[];
  education: Education[];
  credentials: Credential[];
  socialLinks: SocialLink[];
  dataSources: DataSourceStatus[];
  lastUpdated: string;
}
