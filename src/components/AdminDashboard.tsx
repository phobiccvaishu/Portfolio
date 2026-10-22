import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Credential, CredentialType } from '../types/portfolio';
import {
  RefreshCw,
  Upload,
  FileText,
  ShieldCheck,
  CheckCircle2,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Github,
  Linkedin,
  Sliders,
  Check,
  Save,
  RotateCcw,
  Mail,
  Copy,
  Send,
  Code2
} from 'lucide-react';

interface InquiryMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  receivedAt: string;
  status: string;
}

export const AdminDashboard: React.FC = () => {
  const {
    data,
    setActiveView,
    updateProfile,
    syncGitHub,
    importLinkedInData,
    addCredential,
    deleteCredential,
    updateCredential,
    deleteSkill,
    updateProject,
    resetToVerifiedInitial,
    syncLeetCode
  } = usePortfolio();

  // Administrator Authentication State
  const [authStatus, setAuthStatus] = useState<'checking' | 'unauthenticated' | 'authenticated'>('checking');
  const [adminUser, setAdminUser] = useState<string | null>(null);
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginSubmitting, setLoginSubmitting] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Reset Snapshot Modal
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetConfirmInput, setResetConfirmInput] = useState('');
  const [resettingSnapshot, setResettingSnapshot] = useState(false);

  const [activeTab, setActiveTab] = useState<'sources' | 'linkedin' | 'credentials' | 'profile' | 'projects' | 'skills' | 'inquiries'>('inquiries');

  // Contact Inquiries State
  const [inquiries, setInquiries] = useState<InquiryMessage[]>([]);
  const [loadingInquiries, setLoadingInquiries] = useState(false);
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null);

  // LeetCode Sync State
  const [syncingLeetCode, setSyncingLeetCode] = useState(false);
  const [leetcodeSyncReport, setLeetcodeSyncReport] = useState<any>(null);
  const [leetcodeSyncMsg, setLeetcodeSyncMsg] = useState('');

  // Check authentication status on mount
  React.useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/admin/check', { credentials: 'include' });
        if (res.ok) {
          const json = await res.json();
          if (json.authenticated) {
            setAuthStatus('authenticated');
            setAdminUser(json.user?.username || 'vaishnavi');
            fetchInquiries();
            return;
          }
        }
        setAuthStatus('unauthenticated');
      } catch (e) {
        setAuthStatus('unauthenticated');
      }
    }
    checkAuth();
  }, []);

  // Handle Admin Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginSubmitting(true);
    setLoginError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          username: loginUsername,
          password: loginPassword
        })
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setAuthStatus('authenticated');
        setAdminUser(json.user?.username || loginUsername);
        setLoginPassword('');
        setLoginError('');
        fetchInquiries();
      } else {
        setLoginError(json.error || 'Invalid administrator credentials.');
      }
    } catch (err: any) {
      setLoginError('Network error connecting to authentication endpoint.');
    } finally {
      setLoginSubmitting(false);
    }
  };

  // Handle Admin Logout
  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', {
        method: 'POST',
        credentials: 'include'
      });
    } catch (e) {}

    setAuthStatus('unauthenticated');
    setAdminUser(null);
    setInquiries([]);
    window.history.pushState({}, '', '/');
    setActiveView('portfolio');
  };

  // Fetch inquiries from backend (authenticated only)
  const fetchInquiries = async () => {
    try {
      setLoadingInquiries(true);
      const res = await fetch('/api/contact/messages', { credentials: 'include' });
      if (res.status === 401) {
        setAuthStatus('unauthenticated');
        return;
      }
      const json = await res.json();
      if (json.success && Array.isArray(json.messages)) {
        setInquiries(json.messages);
      }
    } catch (e) {
      console.error('Failed to fetch inquiries:', e);
    } finally {
      setLoadingInquiries(false);
    }
  };

  const handleDeleteInquiry = async (id: string) => {
    if (!confirm('Are you sure you want to remove this inquiry?')) return;
    try {
      const res = await fetch(`/api/contact/messages/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (res.status === 401) {
        setAuthStatus('unauthenticated');
        return;
      }
      const json = await res.json();
      if (json.success) {
        setInquiries(prev => prev.filter(m => m.id !== id));
      }
    } catch (e) {
      alert('Failed to delete message');
    }
  };

  // Handle Protected Reset Snapshot
  const handleSecureResetSnapshot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (resetConfirmInput !== 'CONFIRM_RESET_SNAPSHOT') {
      alert('Please type CONFIRM_RESET_SNAPSHOT exactly to confirm.');
      return;
    }

    try {
      setResettingSnapshot(true);
      const res = await fetch('/api/admin/reset-snapshot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ confirmation: 'CONFIRM_RESET_SNAPSHOT' })
      });

      const json = await res.json();
      if (res.ok && json.success) {
        resetToVerifiedInitial();
        setShowResetModal(false);
        setResetConfirmInput('');
        alert(json.message || 'Portfolio snapshot has been reset to verified baseline. Backup created on server.');
      } else {
        alert(json.error || 'Failed to reset snapshot.');
      }
    } catch (err: any) {
      alert('Failed to communicate with snapshot reset endpoint.');
    } finally {
      setResettingSnapshot(false);
    }
  };

  const handleCopyEmail = (id: string, email: string) => {
    navigator.clipboard.writeText(email);
    setCopiedMsgId(id);
    setTimeout(() => setCopiedMsgId(null), 2000);
  };

  // GitHub Sync State
  const [syncingGithub, setSyncingGithub] = useState(false);
  const [githubSyncReport, setGithubSyncReport] = useState<any>(null);
  const [syncStatusMsg, setSyncStatusMsg] = useState('');

  // LinkedIn Import State
  const [linkedinFile, setLinkedinFile] = useState<File | null>(null);
  const [linkedinRawText, setLinkedinRawText] = useState('');
  const [parsingLinkedin, setParsingLinkedin] = useState(false);
  const [parsedLinkedinData, setParsedLinkedinData] = useState<any>(null);
  const [linkedinSuccessMsg, setLinkedinSuccessMsg] = useState('');

  // Certificate Upload State
  const [certFile, setCertFile] = useState<File | null>(null);
  const [certTitle, setCertTitle] = useState('');
  const [certIssuer, setCertIssuer] = useState('');
  const [certType, setCertType] = useState<CredentialType>('course');
  const [certDate, setCertDate] = useState('2025');
  const [certVerifyUrl, setCertVerifyUrl] = useState('');
  const [uploadingCert, setUploadingCert] = useState(false);
  const [certSuccessMsg, setCertSuccessMsg] = useState('');

  // Profile Form State
  const [profileForm, setProfileForm] = useState({
    name: data.profile.name,
    headline: data.profile.headline,
    supportingStatement: data.profile.supportingStatement,
    location: data.profile.location,
    email: data.profile.email,
    bio: data.profile.bio.join('\n\n')
  });

  // Handle GitHub Sync
  const handleGithubSync = async () => {
    setSyncingGithub(true);
    setSyncStatusMsg('');
    const result = await syncGitHub();
    setSyncingGithub(false);
    if (result.success) {
      setGithubSyncReport(result.report);
      setSyncStatusMsg('Live GitHub API synchronization successful.');
    } else {
      setSyncStatusMsg(`Sync error: ${result.message}`);
    }
  };

  // Handle LeetCode Sync
  const handleLeetCodeSync = async () => {
    setSyncingLeetCode(true);
    setLeetcodeSyncMsg('');
    const result = await syncLeetCode();
    setSyncingLeetCode(false);
    if (result.success) {
      setLeetcodeSyncReport(result.stats);
      setLeetcodeSyncMsg('Live LeetCode GraphQL synchronization successful.');
    } else {
      setLeetcodeSyncMsg(`Sync error: ${result.message}`);
    }
  };

  // Handle LinkedIn Parse
  const handleParseLinkedin = async () => {
    setParsingLinkedin(true);
    setLinkedinSuccessMsg('');
    try {
      const formData = new FormData();
      if (linkedinFile) {
        formData.append('linkedinFile', linkedinFile);
      }
      if (linkedinRawText) {
        formData.append('rawText', linkedinRawText);
      }

      const res = await fetch('/api/linkedin/parse', {
        method: 'POST',
        credentials: 'include',
        body: formData
      });

      const contentType = res.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        if (res.status === 401) {
          setAuthStatus('unauthenticated');
          alert('Administrator session expired. Please log in again.');
          return;
        }
        alert(`Server error (${res.status}): Please ensure the file is under 10MB or try pasting the raw text.`);
        return;
      }

      const json = await res.json();
      if (res.ok && json.success) {
        setParsedLinkedinData(json.parsed);
      } else {
        alert(json.error || 'Failed to parse LinkedIn document');
      }
    } catch (err: any) {
      alert(`Error parsing: ${err.message}`);
    } finally {
      setParsingLinkedin(false);
    }
  };

  // Confirm and Apply LinkedIn Data
  const handleApplyLinkedinData = () => {
    if (!parsedLinkedinData) return;
    const res = importLinkedInData(parsedLinkedinData);
    if (res.success) {
      setLinkedinSuccessMsg(`Successfully imported and merged fields into portfolio.`);
      setParsedLinkedinData(null);
      setLinkedinRawText('');
      setLinkedinFile(null);
    }
  };

  // Handle Certificate Upload
  const handleUploadCertificate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!certTitle || !certIssuer) {
      alert('Please provide title and issuer');
      return;
    }

    setUploadingCert(true);
    setCertSuccessMsg('');

    try {
      let documentUrl = '';
      if (certFile) {
        const formData = new FormData();
        formData.append('certificate', certFile);
        const res = await fetch('/api/credentials/upload', {
          method: 'POST',
          credentials: 'include',
          body: formData
        });
        const contentType = res.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          const json = await res.json();
          if (res.ok && json.success) {
            documentUrl = json.file.url;
          }
        }
      }

      const newCred: Credential = {
        id: 'cred-' + Date.now(),
        title: certTitle,
        issuer: certIssuer,
        type: certType,
        issueDate: certDate,
        verificationUrl: certVerifyUrl || undefined,
        documentUrl: documentUrl || undefined,
        isPublic: true,
        verified: true
      };

      addCredential(newCred);
      setCertSuccessMsg('Credential successfully registered.');
      setCertTitle('');
      setCertIssuer('');
      setCertVerifyUrl('');
      setCertFile(null);
    } catch (err: any) {
      alert(`Upload error: ${err.message}`);
    } finally {
      setUploadingCert(false);
    }
  };

  // Save Profile Form
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: profileForm.name,
      headline: profileForm.headline,
      supportingStatement: profileForm.supportingStatement,
      location: profileForm.location,
      email: profileForm.email,
      bio: profileForm.bio.split('\n\n').filter(Boolean)
    });
    alert('Profile information updated successfully.');
  };

  // 1. Loading Authentication Check View
  if (authStatus === 'checking') {
    return (
      <div className="py-28 max-w-editorial mx-auto px-5 sm:px-8 text-center space-y-4">
        <div className="w-5 h-5 border border-accent border-t-transparent animate-spin mx-auto" />
        <div className="font-mono text-xs uppercase tracking-widest text-ink-secondary">
          Verifying Administrator Session...
        </div>
      </div>
    );
  }

  // 2. Unauthenticated Login Gate
  if (authStatus === 'unauthenticated') {
    return (
      <div className="py-20 sm:py-28 max-w-editorial mx-auto px-5 sm:px-8">
        <div className="max-w-md mx-auto space-y-8">
          <div className="space-y-2 text-left">
            <span className="font-mono text-xs uppercase tracking-widest text-accent">00 / RESTRICTED</span>
            <h1 className="font-display text-3xl sm:text-4xl text-ink font-normal tracking-tight">
              Profile Administration
            </h1>
            <p className="text-sm text-ink-secondary font-sans leading-relaxed">
              Authentication required. All administrative endpoints enforce server-side authorization and rate limiting.
            </p>
          </div>

          {loginError && (
            <div className="p-3 bg-accent/10 border border-accent text-xs font-mono text-ink text-left">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5 text-left">
            <div className="space-y-1">
              <label className="font-mono text-[11px] text-ink-secondary uppercase tracking-wider">
                Username
              </label>
              <input
                type="text"
                required
                autoComplete="username"
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                placeholder="vaishnavi"
                className="w-full bg-transparent border-b border-canvas-border focus:border-accent text-ink text-sm py-2.5 outline-none font-mono"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="font-mono text-[11px] text-ink-secondary uppercase tracking-wider">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[10px] font-mono uppercase text-ink-secondary hover:text-ink"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="current-password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full bg-transparent border-b border-canvas-border focus:border-accent text-ink text-sm py-2.5 outline-none font-mono"
              />
            </div>

            <div className="pt-4 flex items-center justify-between">
              <button
                type="submit"
                disabled={loginSubmitting}
                className="px-6 py-2.5 bg-ink text-canvas hover:bg-accent hover:text-white transition-colors font-mono text-xs uppercase tracking-widest disabled:opacity-50"
              >
                {loginSubmitting ? 'Authenticating...' : 'Authenticate →'}
              </button>

              <button
                type="button"
                onClick={() => {
                  window.history.pushState({}, '', '/');
                  setActiveView('portfolio');
                }}
                className="editorial-link font-mono text-xs uppercase tracking-wider text-ink-secondary hover:text-ink"
              >
                ← Return to Site
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // 3. Authenticated Administrative Dashboard
  return (
    <div className="max-w-editorial mx-auto px-5 sm:px-8 py-14 sm:py-20 text-left space-y-10">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between pb-6 border-b border-canvas-border gap-4">
        <div>
          <div className="font-mono text-xs uppercase tracking-widest text-accent mb-1 flex items-center space-x-2">
            <span>Data & Integration Pipeline</span>
            <span className="text-canvas-border">/</span>
            <span className="text-ink">User: {adminUser}</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-normal text-ink">
            Profile Administration
          </h1>
          <p className="text-xs font-mono text-ink-secondary mt-1">
            Execute GitHub and LeetCode synchronizations, parse LinkedIn profile documents, and inspect incoming inquiries.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
          <button
            onClick={() => setShowResetModal(true)}
            className="px-3 py-1.5 border border-canvas-border text-ink-secondary hover:text-accent hover:border-accent uppercase tracking-wider transition-colors"
          >
            Reset Snapshot
          </button>

          <button
            onClick={handleLogout}
            className="px-3 py-1.5 border border-canvas-border hover:border-ink text-ink uppercase tracking-wider transition-colors"
          >
            Log Out
          </button>

          <button
            onClick={() => {
              window.history.pushState({}, '', '/');
              setActiveView('portfolio');
            }}
            className="px-3.5 py-1.5 bg-ink text-canvas hover:bg-accent hover:text-white uppercase tracking-wider transition-colors"
          >
            View Site &rarr;
          </button>
        </div>
      </div>

      {/* Confirmation Modal for Reset Snapshot */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="max-w-md w-full bg-canvas border border-canvas-border p-6 space-y-5 text-left font-sans shadow-2xl">
            <div className="space-y-1">
              <div className="font-mono text-xs uppercase tracking-widest text-accent">Security Confirmation Required</div>
              <h3 className="font-display text-2xl text-ink font-normal">Reset Portfolio Snapshot</h3>
            </div>
            <p className="text-xs text-ink-secondary font-mono leading-relaxed">
              This action will restore all projects, skills, and certificates back to the verified baseline. An automatic server backup of current data will be created first.
            </p>
            <div className="space-y-2">
              <label className="font-mono text-[11px] text-ink-secondary uppercase tracking-wider block">
                Type <span className="text-accent select-all">CONFIRM_RESET_SNAPSHOT</span> to confirm:
              </label>
              <input
                type="text"
                value={resetConfirmInput}
                onChange={(e) => setResetConfirmInput(e.target.value)}
                placeholder="CONFIRM_RESET_SNAPSHOT"
                className="w-full bg-transparent border-b border-canvas-border focus:border-accent text-ink text-sm py-2 font-mono outline-none"
              />
            </div>
            <div className="flex items-center justify-end space-x-3 pt-2 font-mono text-xs">
              <button
                type="button"
                onClick={() => {
                  setShowResetModal(false);
                  setResetConfirmInput('');
                }}
                className="px-3 py-1.5 border border-canvas-border text-ink-secondary hover:text-ink uppercase tracking-wider"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSecureResetSnapshot}
                disabled={resetConfirmInput !== 'CONFIRM_RESET_SNAPSHOT' || resettingSnapshot}
                className="px-4 py-1.5 bg-accent text-white uppercase tracking-wider disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                {resettingSnapshot ? 'Resetting...' : 'Confirm Reset'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-canvas-border pb-4 font-mono text-xs">
        {[
          { id: 'inquiries', label: `Inquiries (${inquiries.length})` },
          { id: 'sources', label: 'Sources & Sync' },
          { id: 'linkedin', label: 'LinkedIn Importer' },
          { id: 'credentials', label: 'Certificates' },
          { id: 'profile', label: 'Profile Editor' },
          { id: 'projects', label: 'Projects' },
          { id: 'skills', label: 'Skills' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id as any);
              if (tab.id === 'inquiries') fetchInquiries();
            }}
            className={`px-3 py-1.5 border uppercase tracking-wider transition-colors ${
              activeTab === tab.id
                ? 'bg-ink text-canvas border-ink font-medium'
                : 'border-canvas-border text-ink-secondary hover:text-ink'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 0: Inquiries Inbox */}
      {activeTab === 'inquiries' && (
        <div className="space-y-6">
          <div className="border border-canvas-border p-5 sm:p-7 space-y-5 bg-canvas-surface/20">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 border-b border-canvas-border pb-4">
              <div>
                <h2 className="font-display text-2xl text-ink font-normal">
                  Inquiries Inbox ({inquiries.length})
                </h2>
                <p className="text-xs font-mono text-ink-secondary mt-1">
                  Persistently stored in <code className="text-accent">server/data/messages.json</code>.
                </p>
              </div>

              <button
                onClick={fetchInquiries}
                disabled={loadingInquiries}
                className="px-3 py-1 border border-canvas-border hover:border-ink text-xs font-mono uppercase tracking-wider self-start transition-colors"
              >
                {loadingInquiries ? 'Refreshing...' : 'Refresh List'}
              </button>
            </div>

            {inquiries.length === 0 ? (
              <div className="py-12 text-center text-xs font-mono text-ink-secondary">
                No inquiries logged in server storage.
              </div>
            ) : (
              <div className="divide-y divide-canvas-border">
                {inquiries.map((msg) => {
                  const replyMailto = `mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}&body=Hi ${encodeURIComponent(msg.name)},%0D%0A%0D%0AThank you for reaching out regarding "${encodeURIComponent(msg.subject)}".%0D%0A%0D%0ABest regards,%0D%0AVaishnavi%0D%0Ahttps://github.com/phobiccvaishu`;

                  return (
                    <div key={msg.id} className="py-5 space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 font-mono text-xs">
                        <div>
                          <span className="text-ink font-medium">{msg.name}</span>
                          <span className="text-ink-secondary ml-2">&lt;{msg.email}&gt;</span>
                        </div>
                        <span className="text-ink-secondary text-[11px]">
                          {new Date(msg.receivedAt).toLocaleDateString()} at {new Date(msg.receivedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      <div className="font-mono text-xs text-ink font-medium">
                        Subject: {msg.subject}
                      </div>

                      <div className="p-3 bg-canvas border border-canvas-border text-xs sm:text-sm text-ink-secondary font-sans whitespace-pre-wrap leading-relaxed">
                        {msg.message}
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono pt-1">
                        <div className="flex items-center space-x-3">
                          <a
                            href={replyMailto}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1 bg-ink text-canvas hover:bg-accent hover:text-white uppercase tracking-wider transition-colors"
                          >
                            Reply via Email &rarr;
                          </a>

                          <button
                            onClick={() => handleCopyEmail(msg.id, msg.email)}
                            className="px-2.5 py-1 border border-canvas-border hover:border-ink uppercase tracking-wider text-ink-secondary hover:text-ink"
                          >
                            {copiedMsgId === msg.id ? '[Copied]' : 'Copy Email'}
                          </button>
                        </div>

                        <button
                          onClick={() => handleDeleteInquiry(msg.id)}
                          className="text-accent hover:underline uppercase text-[11px]"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 1: Sources & Sync */}
      {activeTab === 'sources' && (
        <div className="space-y-8">
          <div className="border border-canvas-border p-5 sm:p-7 space-y-5 bg-canvas-surface/20">
            <h2 className="font-display text-2xl text-ink font-normal">
              Active Data Sources & Ingestion Channels
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-xs font-mono text-left border border-canvas-border">
                <thead className="bg-canvas border-b border-canvas-border text-ink-secondary uppercase">
                  <tr>
                    <th className="p-3">Source</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Verified Data</th>
                    <th className="p-3">Trigger</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-canvas-border text-ink-secondary">
                  <tr>
                    <td className="p-3 font-medium text-ink">GitHub REST API (@phobiccvaishu)</td>
                    <td className="p-3 text-accent">[Connected]</td>
                    <td className="p-3">6 repositories, commit histories, README architectures</td>
                    <td className="p-3">
                      <button
                        onClick={handleGithubSync}
                        disabled={syncingGithub}
                        className="px-2.5 py-1 border border-canvas-border hover:border-ink uppercase text-[11px]"
                      >
                        {syncingGithub ? 'Syncing...' : 'Sync'}
                      </button>
                    </td>
                  </tr>

                  <tr>
                    <td className="p-3 font-medium text-ink">LeetCode GraphQL (@{data.profile.leetcodeUsername || 'vaish_phob'})</td>
                    <td className="p-3 text-accent">[Connected]</td>
                    <td className="p-3">
                      {data.profile.leetcodeStats?.totalSolved || 30} Solved ({data.profile.leetcodeStats?.easySolved || 20}E / {data.profile.leetcodeStats?.mediumSolved || 10}M), C (28) & Java (3)
                    </td>
                    <td className="p-3">
                      <button
                        onClick={handleLeetCodeSync}
                        disabled={syncingLeetCode}
                        className="px-2.5 py-1 border border-canvas-border hover:border-ink uppercase text-[11px]"
                      >
                        {syncingLeetCode ? 'Syncing...' : 'Sync'}
                      </button>
                    </td>
                  </tr>

                  <tr>
                    <td className="p-3 font-medium text-ink">LinkedIn Profile</td>
                    <td className="p-3 text-ink-secondary">[Authwall 999]</td>
                    <td className="p-3">Direct scraping legitimately blocked; file import active</td>
                    <td className="p-3">
                      <button
                        onClick={() => setActiveTab('linkedin')}
                        className="px-2.5 py-1 border border-canvas-border hover:border-ink uppercase text-[11px]"
                      >
                        Import File
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {syncStatusMsg && (
              <div className="p-3 border-l-2 border-accent bg-canvas text-xs font-mono text-ink">
                {syncStatusMsg}
              </div>
            )}

            {leetcodeSyncMsg && (
              <div className="p-3 border-l-2 border-accent bg-canvas text-xs font-mono text-ink">
                {leetcodeSyncMsg}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: LinkedIn Importer */}
      {activeTab === 'linkedin' && (
        <div className="border border-canvas-border p-5 sm:p-7 space-y-6 bg-canvas-surface/20">
          <div>
            <h2 className="font-display text-2xl text-ink font-normal">
              LinkedIn Profile Ingestion
            </h2>
            <p className="text-xs font-mono text-ink-secondary mt-1">
              Upload a LinkedIn PDF export (Profile &gt; More &gt; Save to PDF) or paste plain text. The parser validates fields before publishing.
            </p>
          </div>

          {linkedinSuccessMsg && (
            <div className="p-3 border-l-2 border-accent bg-canvas text-xs font-mono text-ink">
              {linkedinSuccessMsg}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
            <div className="p-4 border border-canvas-border space-y-2 bg-canvas">
              <div className="text-ink uppercase tracking-wider">Method A: Upload Document</div>
              <input
                type="file"
                accept=".pdf,.txt,.json,.csv"
                onChange={(e) => setLinkedinFile(e.target.files ? e.target.files[0] : null)}
                className="w-full text-xs text-ink file:mr-3 file:py-1 file:px-2 file:border file:border-canvas-border file:text-xs file:font-mono file:bg-canvas-surface cursor-pointer"
              />
            </div>

            <div className="p-4 border border-canvas-border space-y-2 bg-canvas">
              <div className="text-ink uppercase tracking-wider">Method B: Paste Plain Text</div>
              <textarea
                rows={3}
                value={linkedinRawText}
                onChange={(e) => setLinkedinRawText(e.target.value)}
                placeholder="Paste experience or about summary..."
                className="w-full bg-transparent border border-canvas-border p-2 text-xs text-ink outline-none font-mono"
              />
            </div>
          </div>

          <button
            onClick={handleParseLinkedin}
            disabled={parsingLinkedin || (!linkedinFile && !linkedinRawText)}
            className="px-4 py-2 bg-ink text-canvas hover:bg-accent hover:text-white font-mono text-xs uppercase tracking-wider disabled:opacity-50"
          >
            {parsingLinkedin ? 'Parsing...' : 'Execute Parser &rarr;'}
          </button>

          {parsedLinkedinData && (
            <div className="p-5 border border-canvas-border bg-canvas space-y-3 font-mono text-xs">
              <div className="text-accent uppercase tracking-wider">Review Parsed Fields</div>
              <div><span className="text-ink-secondary">Name: </span>{parsedLinkedinData.fullName || 'Not detected'}</div>
              <div><span className="text-ink-secondary">Headline: </span>{parsedLinkedinData.headline || 'Not detected'}</div>
              {parsedLinkedinData.about && <div><span className="text-ink-secondary">About: </span>{parsedLinkedinData.about}</div>}
              <div>
                <span className="text-ink-secondary">Skills: </span>
                {parsedLinkedinData.skills.join(', ') || 'None'}
              </div>
              <div className="pt-2 flex items-center space-x-3">
                <button
                  onClick={handleApplyLinkedinData}
                  className="px-3.5 py-1.5 bg-ink text-canvas hover:bg-accent hover:text-white uppercase"
                >
                  Confirm & Apply
                </button>
                <button
                  onClick={() => setParsedLinkedinData(null)}
                  className="px-3 py-1.5 border border-canvas-border uppercase text-ink-secondary"
                >
                  Discard
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: Certificates */}
      {activeTab === 'credentials' && (
        <div className="space-y-8">
          <form onSubmit={handleUploadCertificate} className="border border-canvas-border p-5 sm:p-7 space-y-4 bg-canvas-surface/20">
            <h2 className="font-display text-2xl text-ink font-normal">
              Register New Credential
            </h2>

            {certSuccessMsg && (
              <div className="p-3 border-l-2 border-accent bg-canvas text-xs font-mono text-ink">
                {certSuccessMsg}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div className="space-y-1">
                <label className="text-ink-secondary uppercase">Credential Title *</label>
                <input
                  type="text"
                  required
                  value={certTitle}
                  onChange={(e) => setCertTitle(e.target.value)}
                  className="w-full bg-transparent border border-canvas-border p-2 text-ink outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-ink-secondary uppercase">Issuing Organization *</label>
                <input
                  type="text"
                  required
                  value={certIssuer}
                  onChange={(e) => setCertIssuer(e.target.value)}
                  className="w-full bg-transparent border border-canvas-border p-2 text-ink outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-ink-secondary uppercase">Category *</label>
                <select
                  value={certType}
                  onChange={(e) => setCertType(e.target.value as CredentialType)}
                  className="w-full bg-canvas border border-canvas-border p-2 text-ink outline-none"
                >
                  <option value="course">Course Completion</option>
                  <option value="certification">Professional Certification</option>
                  <option value="internship">Internship Certificate</option>
                  <option value="training">Training Program</option>
                  <option value="award">Award / Recognition</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-ink-secondary uppercase">Date / Term</label>
                <input
                  type="text"
                  value={certDate}
                  onChange={(e) => setCertDate(e.target.value)}
                  className="w-full bg-transparent border border-canvas-border p-2 text-ink outline-none"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-ink-secondary uppercase">Verification URL (Optional)</label>
                <input
                  type="url"
                  value={certVerifyUrl}
                  onChange={(e) => setCertVerifyUrl(e.target.value)}
                  className="w-full bg-transparent border border-canvas-border p-2 text-ink outline-none"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-ink-secondary uppercase">Document File (PDF / PNG / JPG)</label>
                <input
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg"
                  onChange={(e) => setCertFile(e.target.files ? e.target.files[0] : null)}
                  className="w-full text-xs text-ink file:mr-3 file:py-1 file:px-2 file:border file:border-canvas-border file:text-xs file:font-mono file:bg-canvas-surface cursor-pointer"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={uploadingCert}
              className="px-4 py-2 bg-ink text-canvas hover:bg-accent hover:text-white font-mono text-xs uppercase tracking-wider"
            >
              {uploadingCert ? 'Uploading...' : 'Save Credential'}
            </button>
          </form>

          {/* List */}
          <div className="border border-canvas-border p-5 sm:p-7 space-y-4 bg-canvas-surface/20">
            <h3 className="font-display text-xl text-ink font-normal">
              Registered Credentials ({data.credentials.length})
            </h3>
            <div className="divide-y divide-canvas-border font-mono text-xs">
              {data.credentials.map((cred) => (
                <div key={cred.id} className="py-3 flex items-center justify-between">
                  <div>
                    <div className="text-ink font-medium">{cred.title}</div>
                    <div className="text-ink-secondary text-[11px]">{cred.issuer} &bull; {cred.issueDate}</div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => updateCredential({ ...cred, isPublic: !cred.isPublic })}
                      className="text-xs uppercase text-ink-secondary hover:text-ink"
                    >
                      {cred.isPublic ? '[Public]' : '[Hidden]'}
                    </button>
                    <button
                      onClick={() => deleteCredential(cred.id)}
                      className="text-accent hover:underline uppercase text-[11px]"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Profile Editor */}
      {activeTab === 'profile' && (
        <form onSubmit={handleSaveProfile} className="border border-canvas-border p-5 sm:p-7 space-y-5 bg-canvas-surface/20">
          <h2 className="font-display text-2xl text-ink font-normal">
            Profile Text & Narrative
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
            <div className="space-y-1">
              <label className="text-ink-secondary uppercase">Full Name</label>
              <input
                type="text"
                value={profileForm.name}
                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                className="w-full bg-transparent border border-canvas-border p-2 text-ink outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-ink-secondary uppercase">Email</label>
              <input
                type="email"
                value={profileForm.email}
                onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                className="w-full bg-transparent border border-canvas-border p-2 text-ink outline-none"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="text-ink-secondary uppercase">Headline</label>
              <input
                type="text"
                value={profileForm.headline}
                onChange={(e) => setProfileForm({ ...profileForm, headline: e.target.value })}
                className="w-full bg-transparent border border-canvas-border p-2 text-ink outline-none"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="text-ink-secondary uppercase">Summary Statement</label>
              <input
                type="text"
                value={profileForm.supportingStatement}
                onChange={(e) => setProfileForm({ ...profileForm, supportingStatement: e.target.value })}
                className="w-full bg-transparent border border-canvas-border p-2 text-ink outline-none"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="text-ink-secondary uppercase">Bio Paragraphs (Double enter between paragraphs)</label>
              <textarea
                rows={5}
                value={profileForm.bio}
                onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                className="w-full bg-transparent border border-canvas-border p-2 text-ink outline-none font-sans"
              />
            </div>
          </div>

          <button
            type="submit"
            className="px-4 py-2 bg-ink text-canvas hover:bg-accent hover:text-white font-mono text-xs uppercase tracking-wider"
          >
            Save Updates
          </button>
        </form>
      )}

      {/* TAB 5: Projects */}
      {activeTab === 'projects' && (
        <div className="border border-canvas-border p-5 sm:p-7 space-y-4 bg-canvas-surface/20">
          <h2 className="font-display text-2xl text-ink font-normal">
            Projects List ({data.projects.length})
          </h2>
          <div className="divide-y divide-canvas-border font-mono text-xs">
            {data.projects.map((proj) => (
              <div key={proj.id} className="py-4 flex flex-col sm:flex-row sm:items-baseline justify-between gap-3">
                <div className="space-y-1">
                  <div className="font-display text-lg text-ink font-normal">{proj.title}</div>
                  <div className="text-xs text-ink-secondary font-sans">{proj.tagline}</div>
                  <div className="text-[11px] text-ink-secondary">{proj.technologies.join(', ')}</div>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => updateProject({ ...proj, isFeatured: !proj.isFeatured })}
                    className="px-2.5 py-1 border border-canvas-border hover:border-ink uppercase text-[11px]"
                  >
                    {proj.isFeatured ? 'Unfeature' : 'Feature'}
                  </button>
                  <a
                    href={proj.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="editorial-link uppercase text-[11px] text-ink"
                  >
                    Repo &nearr;
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: Skills */}
      {activeTab === 'skills' && (
        <div className="border border-canvas-border p-5 sm:p-7 space-y-4 bg-canvas-surface/20">
          <h2 className="font-display text-2xl text-ink font-normal">
            Skills Inventory ({data.skills.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 font-mono text-xs">
            {data.skills.map((skill) => (
              <div key={skill.id} className="p-3 border border-canvas-border flex items-center justify-between">
                <div>
                  <div className="text-ink font-medium">{skill.name}</div>
                  <div className="text-[10px] text-ink-secondary uppercase">{skill.category}</div>
                </div>
                <button
                  onClick={() => deleteSkill(skill.id)}
                  className="text-accent hover:underline text-[10px] uppercase"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
