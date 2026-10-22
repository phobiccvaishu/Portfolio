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
  status: 'Production-ready' | 'Active Development' | 'Prototype / Research' | 'Ongoing Research';
  stars?: number;
  forks?: number;
  isFeatured: boolean;
  role?: string;
  demoType?: 'interactive-mock' | 'live-url' | 'code-walkthrough';
  researchPaper?: {
    status: 'Ongoing' | 'Under Review' | 'Published';
    topic: string;
  };
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
  type: 'internship' | 'leadership' | 'academic' | 'freelance' | 'full-time' | 'training';
  verified: boolean;
  badge?: string;
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
  cgpa?: string;
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
  documentUrl?: string;
  fileName?: string;
  isPublic: boolean;
  verified: boolean;
  status?: 'completed' | 'ongoing';
  hours?: string;
}

export interface SocialLink {
  platform: 'github' | 'linkedin' | 'email' | 'twitter' | 'website' | 'leetcode' | 'phone';
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
  phone?: string;
  avatarUrl: string;
  githubUsername: string;
  linkedinSlug: string;
  leetcodeUrl?: string;
  cgpa?: string;
  resumeUrl?: string;
  isOpenToOpportunities: boolean;
  targetRoles: string[];
  problemSolvingCount?: string;
  spokenLanguages?: string[];
}

export interface DataSourceStatus {
  source: 'GitHub API' | 'LinkedIn Public Check' | 'Manual Verified' | 'Verified e-Resume';
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
