import React, { createContext, useContext, useState, useEffect } from 'react';
import { PortfolioData, PersonalProfile, Project, Skill, Credential, Education, Experience } from '../types/portfolio';
import { initialPortfolioData } from '../data/initialData';

interface PortfolioContextType {
  data: PortfolioData;
  isLoading: boolean;
  isSaving: boolean;
  activeView: 'portfolio' | 'admin';
  setActiveView: (view: 'portfolio' | 'admin') => void;
  updateProfile: (profile: Partial<PersonalProfile>) => void;
  updateProject: (project: Project) => void;
  addProject: (project: Project) => void;
  deleteProject: (id: string) => void;
  updateSkill: (skill: Skill) => void;
  addSkill: (skill: Skill) => void;
  deleteSkill: (id: string) => void;
  updateCredential: (credential: Credential) => void;
  addCredential: (credential: Credential) => void;
  deleteCredential: (id: string) => void;
  updateEducation: (edu: Education[]) => void;
  updateExperience: (exp: Experience[]) => void;
  syncGitHub: () => Promise<{ success: boolean; message: string; report?: any }>;
  syncLeetCode: () => Promise<{ success: boolean; message: string; stats?: any }>;
  importLinkedInData: (parsed: any) => { success: boolean; appliedCount: number };
  resetToVerifiedInitial: () => void;
}

const STORAGE_KEY = 'vaishnavi_portfolio_data_v2';

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<PortfolioData>(() => {
    try {
      localStorage.removeItem('vaishnavi_portfolio_data_v1');
    } catch (e) {}
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.profile) {
          parsed.profile.email = 'vaishnavi1657@gmail.com';
        }
        return parsed;
      } catch (e) {
        console.error('Failed to parse cached portfolio data:', e);
      }
    }
    return initialPortfolioData;
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeView, setActiveView] = useState<'portfolio' | 'admin'>('portfolio');

  // Sync with backend API on mount
  useEffect(() => {
    async function fetchFromBackend() {
      try {
        setIsLoading(true);
        const res = await fetch('/api/portfolio');
        if (res.ok) {
          const json = await res.json();
          if (json.data) {
            if (json.data.profile) {
              json.data.profile.email = 'vaishnavi1657@gmail.com';
            }
            setData(json.data);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(json.data));
          }
        }
      } catch (e) {
        // Silently use local data when server is starting or offline
      } finally {
        setIsLoading(false);
      }
    }
    fetchFromBackend();
  }, []);

  // Save changes locally and to server
  const persist = async (newData: PortfolioData) => {
    setData(newData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
    try {
      setIsSaving(true);
      await fetch('/api/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(newData)
      });
    } catch (e) {
      console.warn('Backend offline, changes saved locally in browser storage.');
    } finally {
      setIsSaving(false);
    }
  };

  const updateProfile = (profileUpdate: Partial<PersonalProfile>) => {
    const updated: PortfolioData = {
      ...data,
      profile: { ...data.profile, ...profileUpdate },
      lastUpdated: new Date().toISOString()
    };
    persist(updated);
  };

  const updateProject = (updatedProject: Project) => {
    const updated: PortfolioData = {
      ...data,
      projects: data.projects.map(p => p.id === updatedProject.id ? updatedProject : p),
      lastUpdated: new Date().toISOString()
    };
    persist(updated);
  };

  const addProject = (project: Project) => {
    const updated: PortfolioData = {
      ...data,
      projects: [project, ...data.projects],
      lastUpdated: new Date().toISOString()
    };
    persist(updated);
  };

  const deleteProject = (id: string) => {
    const updated: PortfolioData = {
      ...data,
      projects: data.projects.filter(p => p.id !== id),
      lastUpdated: new Date().toISOString()
    };
    persist(updated);
  };

  const updateSkill = (updatedSkill: Skill) => {
    const updated: PortfolioData = {
      ...data,
      skills: data.skills.map(s => s.id === updatedSkill.id ? updatedSkill : s),
      lastUpdated: new Date().toISOString()
    };
    persist(updated);
  };

  const addSkill = (skill: Skill) => {
    const updated: PortfolioData = {
      ...data,
      skills: [...data.skills, skill],
      lastUpdated: new Date().toISOString()
    };
    persist(updated);
  };

  const deleteSkill = (id: string) => {
    const updated: PortfolioData = {
      ...data,
      skills: data.skills.filter(s => s.id !== id),
      lastUpdated: new Date().toISOString()
    };
    persist(updated);
  };

  const updateCredential = (updatedCred: Credential) => {
    const updated: PortfolioData = {
      ...data,
      credentials: data.credentials.map(c => c.id === updatedCred.id ? updatedCred : c),
      lastUpdated: new Date().toISOString()
    };
    persist(updated);
  };

  const addCredential = (cred: Credential) => {
    const updated: PortfolioData = {
      ...data,
      credentials: [cred, ...data.credentials],
      lastUpdated: new Date().toISOString()
    };
    persist(updated);
  };

  const deleteCredential = (id: string) => {
    const updated: PortfolioData = {
      ...data,
      credentials: data.credentials.filter(c => c.id !== id),
      lastUpdated: new Date().toISOString()
    };
    persist(updated);
  };

  const updateEducation = (edu: Education[]) => {
    persist({ ...data, education: edu, lastUpdated: new Date().toISOString() });
  };

  const updateExperience = (exp: Experience[]) => {
    persist({ ...data, experience: exp, lastUpdated: new Date().toISOString() });
  };

  const syncGitHub = async () => {
    try {
      const res = await fetch('/api/github/sync', {
        method: 'POST',
        credentials: 'include'
      });
      const json = await res.json();
      if (json.success && json.report) {
        const report = json.report;
        const updatedSources = data.dataSources.map(ds => {
          if (ds.source === 'GitHub API') {
            return {
              ...ds,
              status: 'Connected' as const,
              lastSync: new Date().toISOString(),
              notes: `Synchronized ${report.repositoriesCount} repositories directly via official GitHub REST API.`
            };
          }
          return ds;
        });

        // Merge any new avatar or bio if present
        const updatedProfile = {
          ...data.profile,
          avatarUrl: report.user.avatar_url || data.profile.avatarUrl,
        };

        const updatedData: PortfolioData = {
          ...data,
          profile: updatedProfile,
          dataSources: updatedSources,
          lastUpdated: new Date().toISOString()
        };
        persist(updatedData);

        return { success: true, message: 'GitHub synchronized successfully!', report };
      }
      return { success: false, message: json.error || 'Failed to sync with GitHub API.' };
    } catch (e: any) {
      return { success: false, message: e.message || 'Network error reaching sync endpoint.' };
    }
  };

  const syncLeetCode = async () => {
    try {
      const res = await fetch('/api/leetcode/sync', {
        method: 'POST',
        credentials: 'include'
      });
      const json = await res.json();
      if (json.success && json.stats) {
        const stats = json.stats;
        let updatedSources = [...data.dataSources];
        const existingIdx = updatedSources.findIndex(d => d.source === 'LeetCode API');
        const leetSource = {
          source: 'LeetCode API' as const,
          status: 'Connected' as const,
          lastSync: new Date().toISOString(),
          notes: `Profile @${stats.username} verified. ${stats.totalSolved} problems solved (${stats.easySolved} Easy, ${stats.mediumSolved} Medium).`
        };

        if (existingIdx >= 0) {
          updatedSources[existingIdx] = leetSource;
        } else {
          updatedSources.push(leetSource);
        }

        const updatedProfile: PersonalProfile = {
          ...data.profile,
          leetcodeUsername: stats.username,
          leetcodeUrl: stats.profileUrl,
          leetcodeStats: stats
        };

        const updatedData: PortfolioData = {
          ...data,
          profile: updatedProfile,
          dataSources: updatedSources,
          lastUpdated: new Date().toISOString()
        };
        persist(updatedData);

        return { success: true, message: 'LeetCode statistics synchronized successfully!', stats };
      }
      return { success: false, message: json.error || 'Failed to sync with LeetCode API.' };
    } catch (e: any) {
      return { success: false, message: e.message || 'Network error reaching LeetCode endpoint.' };
    }
  };

  const importLinkedInData = (parsed: any) => {
    let appliedCount = 0;
    const newProfile = { ...data.profile };
    let newSkills = [...data.skills];

    if (parsed.fullName && parsed.fullName.trim() !== '') {
      newProfile.name = parsed.fullName;
      appliedCount++;
    }
    if (parsed.headline && parsed.headline.trim() !== '') {
      newProfile.headline = parsed.headline;
      appliedCount++;
    }
    if (parsed.about && parsed.about.trim() !== '') {
      newProfile.bio = [parsed.about];
      appliedCount++;
    }

    if (Array.isArray(parsed.skills) && parsed.skills.length > 0) {
      parsed.skills.forEach((skillName: string) => {
        const exists = newSkills.some(s => s.name.toLowerCase() === skillName.toLowerCase());
        if (!exists) {
          newSkills.push({
            id: 'sk-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
            name: skillName,
            category: 'Backend & Systems', // default category
            proficiency: 'Intermediate',
            source: 'user-confirmed',
            isHighlighted: false
          });
          appliedCount++;
        }
      });
    }

    const updatedSources = data.dataSources.map(ds => {
      if (ds.source.includes('LinkedIn')) {
        return {
          ...ds,
          status: 'Connected' as const,
          lastSync: new Date().toISOString(),
          notes: 'Profile data imported via verified LinkedIn document upload.'
        };
      }
      return ds;
    });

    const updatedData: PortfolioData = {
      ...data,
      profile: newProfile,
      skills: newSkills,
      dataSources: updatedSources,
      lastUpdated: new Date().toISOString()
    };
    persist(updatedData);

    return { success: true, appliedCount };
  };

  const resetToVerifiedInitial = () => {
    persist(initialPortfolioData);
  };

  return (
    <PortfolioContext.Provider
      value={{
        data,
        isLoading,
        isSaving,
        activeView,
        setActiveView,
        updateProfile,
        updateProject,
        addProject,
        deleteProject,
        updateSkill,
        addSkill,
        deleteSkill,
        updateCredential,
        addCredential,
        deleteCredential,
        updateEducation,
        updateExperience,
        syncGitHub,
        syncLeetCode,
        importLinkedInData,
        resetToVerifiedInitial
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};
