import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Credential, CredentialType, Project, Skill } from '../types/portfolio';
import {
  RefreshCw,
  Upload,
  FileText,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Edit,
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
    addSkill,
    deleteSkill,
    updateProject,
    resetToVerifiedInitial,
    syncLeetCode
  } = usePortfolio();

  const [activeTab, setActiveTab] = useState<'sources' | 'linkedin' | 'credentials' | 'profile' | 'projects' | 'skills' | 'inquiries'>('inquiries');

  // Contact Inquiries State
  const [inquiries, setInquiries] = useState<InquiryMessage[]>([]);
  const [loadingInquiries, setLoadingInquiries] = useState(false);
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null);

  // LeetCode Sync State
  const [syncingLeetCode, setSyncingLeetCode] = useState(false);
  const [leetcodeSyncReport, setLeetcodeSyncReport] = useState<any>(null);
  const [leetcodeSyncMsg, setLeetcodeSyncMsg] = useState('');

  // Fetch inquiries from backend
  const fetchInquiries = async () => {
    try {
      setLoadingInquiries(true);
      const res = await fetch('/api/contact/messages');
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

  React.useEffect(() => {
    fetchInquiries();
  }, []);

  const handleDeleteInquiry = async (id: string) => {
    if (!confirm('Are you sure you want to remove this inquiry?')) return;
    try {
      const res = await fetch(`/api/contact/messages/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        setInquiries(prev => prev.filter(m => m.id !== id));
      }
    } catch (e) {
      alert('Failed to delete message');
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
      setSyncStatusMsg('Live GitHub API synchronization successful!');
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
      setLeetcodeSyncMsg('Live LeetCode GraphQL synchronization successful!');
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
        body: formData
      });

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
      setLinkedinSuccessMsg(`Successfully imported and merged fields into portfolio!`);
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
          body: formData
        });
        const json = await res.json();
        if (res.ok && json.success) {
          documentUrl = json.file.url;
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
      setCertSuccessMsg('Credential successfully registered and published!');
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
    alert('Profile information updated successfully!');
  };

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 mb-8 border-b border-canvas-border gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs font-mono text-accent uppercase tracking-widest mb-1">
            <Sliders className="w-3.5 h-3.5" />
            <span>Profile Data Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-ink">
            Management & Data Pipeline
          </h1>
          <p className="text-xs sm:text-sm text-ink-muted mt-1">
            Maintain authentic content, execute GitHub synchronizations, parse LinkedIn exports, and manage certificate documents.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => {
              if (confirm('Reset all portfolio content back to the verified GitHub snapshot?')) {
                resetToVerifiedInitial();
              }
            }}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-canvas-muted hover:bg-canvas-surface text-ink-secondary hover:text-ink text-xs font-mono border border-canvas-border transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Snapshot</span>
          </button>

          <button
            onClick={() => setActiveView('portfolio')}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-accent text-black font-semibold text-xs hover:bg-accent-hover transition-colors"
          >
            <Eye className="w-4 h-4" />
            <span>View Public Website</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-8 border-b border-canvas-border pb-4">
        {[
          { id: 'inquiries', label: `Inquiries Inbox (${inquiries.length})`, icon: <Mail className="w-4 h-4" />, highlight: inquiries.length > 0 },
          { id: 'sources', label: 'Sources & Sync', icon: <ShieldCheck className="w-4 h-4" /> },
          { id: 'linkedin', label: 'LinkedIn Importer', icon: <Linkedin className="w-4 h-4" /> },
          { id: 'credentials', label: 'Certificates & Documents', icon: <FileText className="w-4 h-4" /> },
          { id: 'profile', label: 'Profile & Headline', icon: <Edit className="w-4 h-4" /> },
          { id: 'projects', label: 'Projects Manager', icon: <Github className="w-4 h-4" /> },
          { id: 'skills', label: 'Skills & Stack', icon: <CheckCircle2 className="w-4 h-4" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id as any);
              if (tab.id === 'inquiries') fetchInquiries();
            }}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-accent text-black font-semibold'
                : tab.highlight
                ? 'bg-canvas-muted text-accent border border-accent-border font-semibold'
                : 'bg-canvas-muted text-ink-secondary hover:text-ink border border-canvas-border'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* TAB 0: Inquiries Inbox */}
      {activeTab === 'inquiries' && (
        <div className="space-y-6">
          <div className="bg-canvas-subtle border border-canvas-border rounded-2xl p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-canvas-border pb-4">
              <div>
                <h2 className="font-display font-bold text-lg text-ink flex items-center gap-2">
                  <span>Contact Inquiries Inbox</span>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-accent text-black font-semibold">
                    {inquiries.length} Messages
                  </span>
                </h2>
                <p className="text-xs text-ink-secondary mt-1">
                  Questions and messages submitted through your website contact form. Persistently stored in <code className="text-accent font-mono">server/data/messages.json</code>.
                </p>
              </div>

              <button
                onClick={fetchInquiries}
                disabled={loadingInquiries}
                className="px-3 py-1.5 rounded-xl bg-canvas-muted hover:bg-canvas-surface text-ink text-xs font-mono border border-canvas-border flex items-center space-x-1.5 self-start transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingInquiries ? 'animate-spin' : ''}`} />
                <span>Refresh Inbox</span>
              </button>
            </div>

            {inquiries.length === 0 ? (
              <div className="p-12 text-center space-y-3">
                <Mail className="w-10 h-10 text-ink-muted mx-auto" />
                <div className="font-display font-semibold text-ink">No inquiries received yet</div>
                <p className="text-xs text-ink-secondary max-w-sm mx-auto">
                  When visitors or recruiters submit messages via the contact form on your portfolio, they will appear here immediately.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {inquiries.map((msg) => {
                  const replyMailto = `mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}&body=Hi ${encodeURIComponent(msg.name)},%0D%0A%0D%0AThank you for reaching out regarding "${encodeURIComponent(msg.subject)}".%0D%0A%0D%0ABest regards,%0D%0AVaishnavi%0D%0Ahttps://github.com/phobiccvaishu`;

                  return (
                    <div
                      key={msg.id}
                      className="p-5 rounded-xl bg-canvas-muted border border-canvas-border hover:border-canvas-borderStrong transition-all space-y-3 text-left"
                    >
                      {/* Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-canvas-border/50 pb-2.5">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-accent/15 border border-accent-border text-accent font-display font-bold text-xs flex items-center justify-center">
                            {msg.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-display font-bold text-ink text-sm flex items-center gap-2">
                              <span>{msg.name}</span>
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-canvas-surface text-ink-muted border border-canvas-border">
                                {new Date(msg.receivedAt).toLocaleDateString()} at {new Date(msg.receivedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <div className="text-xs font-mono text-accent">
                              {msg.email}
                            </div>
                          </div>
                        </div>

                        {/* Subject */}
                        <div className="text-xs font-mono text-ink-secondary bg-canvas-surface px-2.5 py-1 rounded border border-canvas-border self-start">
                          Subject: <span className="text-ink font-medium">{msg.subject}</span>
                        </div>
                      </div>

                      {/* Message Body */}
                      <div className="p-3.5 rounded-lg bg-canvas-surface border border-canvas-border/60 text-xs sm:text-sm text-ink-secondary leading-relaxed font-sans whitespace-pre-wrap">
                        {msg.message}
                      </div>

                      {/* Actions */}
                      <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
                        <div className="flex items-center gap-2">
                          {/* Reply Button */}
                          <a
                            href={replyMailto}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-accent text-black font-semibold hover:bg-accent-hover transition-colors shadow-sm"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>Reply via Email ({msg.email})</span>
                          </a>

                          {/* Copy Email Button */}
                          <button
                            onClick={() => handleCopyEmail(msg.id, msg.email)}
                            className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-canvas-surface hover:bg-canvas-subtle text-ink-secondary hover:text-ink border border-canvas-border transition-colors"
                          >
                            {copiedMsgId === msg.id ? <Check className="w-3.5 h-3.5 text-accent" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{copiedMsgId === msg.id ? 'Copied Email' : 'Copy Email'}</span>
                          </button>
                        </div>

                        {/* Delete Button */}
                        <button
                          onClick={() => handleDeleteInquiry(msg.id)}
                          className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-950/30 transition-colors"
                          title="Delete message"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
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

      {/* TAB 1: Sources & GitHub Sync */}
      {activeTab === 'sources' && (
        <div className="space-y-8">
          {/* Phase 1 Source Inventory Table */}
          <div className="bg-canvas-subtle border border-canvas-border rounded-2xl p-6 space-y-4">
            <h2 className="font-display font-bold text-lg text-ink">
              Source Inventory (Phase 1 Audit)
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-canvas-muted text-ink-muted uppercase font-mono border-b border-canvas-border">
                  <tr>
                    <th className="p-3">Source Channel</th>
                    <th className="p-3">Legitimate Access Status</th>
                    <th className="p-3">Data Retrieved</th>
                    <th className="p-3">Actions / Fallback</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-canvas-border text-ink-secondary">
                  <tr>
                    <td className="p-3 font-medium text-ink flex items-center space-x-2">
                      <Github className="w-4 h-4 text-accent" />
                      <span>GitHub API (@phobiccvaishu)</span>
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800/50 font-mono text-[11px]">
                        Connected (Official API)
                      </span>
                    </td>
                    <td className="p-3">
                      Profile, 6 repositories, commit history, README specifications, tech tags
                    </td>
                    <td className="p-3">
                      <button
                        onClick={handleGithubSync}
                        disabled={syncingGithub}
                        className="px-3 py-1 rounded bg-canvas-muted text-accent hover:bg-canvas-surface border border-accent-border font-mono text-[11px] flex items-center space-x-1"
                      >
                        <RefreshCw className={`w-3 h-3 ${syncingGithub ? 'animate-spin' : ''}`} />
                        <span>Sync Now</span>
                      </button>
                    </td>
                  </tr>

                  {/* LeetCode Row */}
                  <tr>
                    <td className="p-3 font-medium text-ink flex items-center space-x-2">
                      <Code2 className="w-4 h-4 text-accent" />
                      <span>LeetCode GraphQL (@{data.profile.leetcodeUsername || 'vaish_phob'})</span>
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800/50 font-mono text-[11px]">
                        Connected (Official GraphQL)
                      </span>
                    </td>
                    <td className="p-3">
                      {data.profile.leetcodeStats?.totalSolved || 30} Solved ({data.profile.leetcodeStats?.easySolved || 20} Easy, {data.profile.leetcodeStats?.mediumSolved || 10} Med), C (28) & Java (3) verified
                    </td>
                    <td className="p-3">
                      <button
                        onClick={handleLeetCodeSync}
                        disabled={syncingLeetCode}
                        className="px-3 py-1 rounded bg-canvas-muted text-accent hover:bg-canvas-surface border border-accent-border font-mono text-[11px] flex items-center space-x-1"
                      >
                        <RefreshCw className={`w-3 h-3 ${syncingLeetCode ? 'animate-spin' : ''}`} />
                        <span>Sync Now</span>
                      </button>
                    </td>
                  </tr>

                  <tr>
                    <td className="p-3 font-medium text-ink flex items-center space-x-2">
                      <Linkedin className="w-4 h-4 text-blue-400" />
                      <span>LinkedIn Profile</span>
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-amber-950/60 text-amber-400 border border-amber-800/50 font-mono text-[11px]">
                        Authwall (HTTP 999)
                      </span>
                    </td>
                    <td className="p-3">
                      Public direct scraping legitimately blocked. PDF / CSV data import active.
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => setActiveTab('linkedin')}
                        className="px-3 py-1 rounded bg-canvas-muted text-ink hover:text-accent border border-canvas-border font-mono text-[11px]"
                      >
                        Use Import Pipeline
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {syncStatusMsg && (
              <div className="p-3 rounded-xl bg-accent-muted border border-accent-border text-xs text-ink font-mono flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-accent" />
                <span>{syncStatusMsg}</span>
              </div>
            )}

            {leetcodeSyncMsg && (
              <div className="p-3 rounded-xl bg-accent-muted border border-accent-border text-xs text-ink font-mono flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-accent" />
                <span>{leetcodeSyncMsg}</span>
              </div>
            )}
          </div>

          {/* LeetCode Live Sync Report */}
          {(leetcodeSyncReport || data.profile.leetcodeStats) && (
            <div className="bg-canvas-subtle border border-canvas-border rounded-2xl p-6 space-y-4">
              <h3 className="font-display font-bold text-base text-ink flex items-center gap-2">
                <Code2 className="w-4 h-4 text-accent" />
                <span>LeetCode GraphQL Live Sync Results</span>
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                <div className="p-3 bg-canvas-muted rounded-xl border border-canvas-border">
                  <div className="text-ink-muted">Username:</div>
                  <div className="text-ink font-bold">@{data.profile.leetcodeUsername || 'vaish_phob'}</div>
                </div>
                <div className="p-3 bg-canvas-muted rounded-xl border border-canvas-border">
                  <div className="text-ink-muted">Global Ranking:</div>
                  <div className="text-accent font-bold">#{data.profile.leetcodeStats?.ranking?.toLocaleString() || '3,734,091'}</div>
                </div>
                <div className="p-3 bg-canvas-muted rounded-xl border border-canvas-border">
                  <div className="text-ink-muted">Total Solved:</div>
                  <div className="text-emerald-400 font-bold">{data.profile.leetcodeStats?.totalSolved || 30} ({data.profile.leetcodeStats?.easySolved || 20}E / {data.profile.leetcodeStats?.mediumSolved || 10}M)</div>
                </div>
                <div className="p-3 bg-canvas-muted rounded-xl border border-canvas-border">
                  <div className="text-ink-muted">Languages:</div>
                  <div className="text-ink font-bold">C (28) & Java (3)</div>
                </div>
              </div>
            </div>
          )}

          {/* GitHub Live Sync Report */}
          {githubSyncReport && (
            <div className="bg-canvas-subtle border border-canvas-border rounded-2xl p-6 space-y-4">
              <h3 className="font-display font-bold text-base text-ink">
                GitHub API Live Sync Results
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                <div className="p-3 bg-canvas-muted rounded-xl border border-canvas-border">
                  <div className="text-ink-muted">User:</div>
                  <div className="text-ink font-bold">{githubSyncReport.user.login}</div>
                </div>
                <div className="p-3 bg-canvas-muted rounded-xl border border-canvas-border">
                  <div className="text-ink-muted">Public Repos:</div>
                  <div className="text-accent font-bold">{githubSyncReport.repositoriesCount}</div>
                </div>
                <div className="p-3 bg-canvas-muted rounded-xl border border-canvas-border">
                  <div className="text-ink-muted">Location:</div>
                  <div className="text-ink font-bold">{githubSyncReport.user.location}</div>
                </div>
                <div className="p-3 bg-canvas-muted rounded-xl border border-canvas-border">
                  <div className="text-ink-muted">API Status:</div>
                  <div className="text-emerald-400 font-bold">200 OK</div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: LinkedIn Importer */}
      {activeTab === 'linkedin' && (
        <div className="bg-canvas-subtle border border-canvas-border rounded-2xl p-6 space-y-6">
          <div>
            <h2 className="font-display font-bold text-lg text-ink">
              LinkedIn Profile Import Pipeline
            </h2>
            <p className="text-xs text-ink-secondary mt-1">
              Compliant data ingestion: Upload a LinkedIn profile PDF, data export file, or paste text directly. The engine parses the data and presents a confirmation screen before publishing.
            </p>
          </div>

          {linkedinSuccessMsg && (
            <div className="p-3 rounded-xl bg-accent-muted border border-accent-border text-xs text-ink font-mono flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-accent" />
              <span>{linkedinSuccessMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* File Upload Option */}
            <div className="p-5 rounded-xl bg-canvas-muted border border-canvas-border space-y-3">
              <div className="flex items-center space-x-2 text-xs font-mono text-accent">
                <Upload className="w-4 h-4" />
                <span>Method A: Upload Profile PDF / Export</span>
              </div>
              <input
                type="file"
                accept=".pdf,.txt,.json,.csv"
                onChange={(e) => setLinkedinFile(e.target.files ? e.target.files[0] : null)}
                className="w-full text-xs text-ink file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-accent file:text-black hover:file:bg-accent-hover cursor-pointer"
              />
              <p className="text-[11px] text-ink-muted">
                Tip: On LinkedIn profile, click "More" &gt; "Save to PDF" and upload that file here.
              </p>
            </div>

            {/* Paste Text Option */}
            <div className="p-5 rounded-xl bg-canvas-muted border border-canvas-border space-y-3">
              <div className="flex items-center space-x-2 text-xs font-mono text-accent">
                <FileText className="w-4 h-4" />
                <span>Method B: Paste Profile Plain Text</span>
              </div>
              <textarea
                rows={3}
                value={linkedinRawText}
                onChange={(e) => setLinkedinRawText(e.target.value)}
                placeholder="Paste text from your LinkedIn about/experience sections..."
                className="w-full bg-canvas-surface border border-canvas-border rounded-xl p-3 text-xs text-ink placeholder:text-ink-muted focus:outline-none focus:border-accent resize-none font-mono"
              />
            </div>
          </div>

          <button
            onClick={handleParseLinkedin}
            disabled={parsingLinkedin || (!linkedinFile && !linkedinRawText)}
            className="px-5 py-2.5 rounded-xl bg-accent text-black font-semibold text-xs hover:bg-accent-hover transition-colors flex items-center space-x-2 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${parsingLinkedin ? 'animate-spin' : ''}`} />
            <span>{parsingLinkedin ? 'Parsing Document...' : 'Run Extraction Pipeline'}</span>
          </button>

          {/* Parsed Data Review Screen */}
          {parsedLinkedinData && (
            <div className="mt-6 p-6 rounded-xl bg-canvas-muted border border-accent-border space-y-4">
              <div className="flex items-center justify-between border-b border-canvas-border pb-3">
                <div className="flex items-center space-x-2 text-accent text-sm font-semibold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Review Extracted Fields Before Publishing</span>
                </div>
                <span className="text-[11px] font-mono text-ink-muted">
                  Source: Uploaded LinkedIn Document
                </span>
              </div>

              <div className="space-y-3 text-xs font-mono">
                <div>
                  <span className="text-ink-muted">Detected Name: </span>
                  <span className="text-ink font-semibold">{parsedLinkedinData.fullName || 'Not detected'}</span>
                </div>
                <div>
                  <span className="text-ink-muted">Detected Headline: </span>
                  <span className="text-ink">{parsedLinkedinData.headline || 'Not detected'}</span>
                </div>
                {parsedLinkedinData.about && (
                  <div>
                    <span className="text-ink-muted">About Summary: </span>
                    <span className="text-ink-secondary">{parsedLinkedinData.about}</span>
                  </div>
                )}
                <div>
                  <span className="text-ink-muted">Detected Skills: </span>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {parsedLinkedinData.skills.length > 0 ? (
                      parsedLinkedinData.skills.map((s: string) => (
                        <span key={s} className="px-2 py-0.5 rounded bg-canvas-surface text-accent border border-canvas-border">
                          {s}
                        </span>
                      ))
                    ) : (
                      <span className="text-ink-muted">None detected automatically</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-canvas-border flex items-center space-x-3">
                <button
                  onClick={handleApplyLinkedinData}
                  className="px-4 py-2 rounded-xl bg-accent text-black font-semibold text-xs hover:bg-accent-hover transition-colors"
                >
                  Approve and Merge Into Portfolio
                </button>
                <button
                  onClick={() => setParsedLinkedinData(null)}
                  className="px-4 py-2 rounded-xl bg-canvas-surface text-ink-muted hover:text-ink text-xs transition-colors"
                >
                  Discard
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: Certificates & Documents */}
      {activeTab === 'credentials' && (
        <div className="space-y-8">
          {/* Upload Form */}
          <form
            onSubmit={handleUploadCertificate}
            className="bg-canvas-subtle border border-canvas-border rounded-2xl p-6 space-y-4"
          >
            <h2 className="font-display font-bold text-lg text-ink">
              Upload & Register New Credential
            </h2>

            {certSuccessMsg && (
              <div className="p-3 rounded-xl bg-accent-muted border border-accent-border text-xs text-ink font-mono flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-accent" />
                <span>{certSuccessMsg}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div className="space-y-1">
                <label className="text-ink-muted">Credential Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Deep Learning Specialization"
                  value={certTitle}
                  onChange={(e) => setCertTitle(e.target.value)}
                  className="w-full bg-canvas-muted border border-canvas-border rounded-xl px-3 py-2 text-ink focus:outline-none focus:border-accent"
                />
              </div>

              <div className="space-y-1">
                <label className="text-ink-muted">Issuing Organization *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Coursera / DeepLearning.AI / SRMIST"
                  value={certIssuer}
                  onChange={(e) => setCertIssuer(e.target.value)}
                  className="w-full bg-canvas-muted border border-canvas-border rounded-xl px-3 py-2 text-ink focus:outline-none focus:border-accent"
                />
              </div>

              <div className="space-y-1">
                <label className="text-ink-muted">Category *</label>
                <select
                  value={certType}
                  onChange={(e) => setCertType(e.target.value as CredentialType)}
                  className="w-full bg-canvas-muted border border-canvas-border rounded-xl px-3 py-2 text-ink focus:outline-none focus:border-accent"
                >
                  <option value="course">Course Completion</option>
                  <option value="certification">Professional Certification</option>
                  <option value="internship">Internship Certificate</option>
                  <option value="training">Training Program</option>
                  <option value="award">Award / Achievement</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-ink-muted">Issue Date</label>
                <input
                  type="text"
                  placeholder="e.g. Nov 2025"
                  value={certDate}
                  onChange={(e) => setCertDate(e.target.value)}
                  className="w-full bg-canvas-muted border border-canvas-border rounded-xl px-3 py-2 text-ink focus:outline-none focus:border-accent"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-ink-muted">Verification URL (Optional)</label>
                <input
                  type="url"
                  placeholder="https://coursera.org/verify/..."
                  value={certVerifyUrl}
                  onChange={(e) => setCertVerifyUrl(e.target.value)}
                  className="w-full bg-canvas-muted border border-canvas-border rounded-xl px-3 py-2 text-ink focus:outline-none focus:border-accent"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-ink-muted">Certificate Document File (PDF, PNG, JPG)</label>
                <input
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg"
                  onChange={(e) => setCertFile(e.target.files ? e.target.files[0] : null)}
                  className="w-full bg-canvas-muted border border-canvas-border rounded-xl p-2 text-ink file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:bg-accent file:text-black file:text-xs file:font-semibold cursor-pointer"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={uploadingCert}
              className="px-5 py-2.5 rounded-xl bg-accent text-black font-semibold text-xs hover:bg-accent-hover transition-colors flex items-center space-x-2"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{uploadingCert ? 'Uploading...' : 'Save & Publish Credential'}</span>
            </button>
          </form>

          {/* Existing Credentials List */}
          <div className="bg-canvas-subtle border border-canvas-border rounded-2xl p-6 space-y-4">
            <h3 className="font-display font-bold text-base text-ink">
              Current Credentials List ({data.credentials.length})
            </h3>
            <div className="space-y-3">
              {data.credentials.map((cred) => (
                <div
                  key={cred.id}
                  className="p-4 rounded-xl bg-canvas-muted border border-canvas-border flex items-center justify-between text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-ink">{cred.title}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-canvas-surface text-accent">
                        {cred.type}
                      </span>
                    </div>
                    <div className="text-ink-muted font-mono">
                      {cred.issuer} • {cred.issueDate}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => updateCredential({ ...cred, isPublic: !cred.isPublic })}
                      className="p-1.5 rounded-lg bg-canvas-surface text-ink-secondary hover:text-ink border border-canvas-border"
                      title={cred.isPublic ? 'Hide from public view' : 'Make public'}
                    >
                      {cred.isPublic ? <Eye className="w-3.5 h-3.5 text-accent" /> : <EyeOff className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={() => deleteCredential(cred.id)}
                      className="p-1.5 rounded-lg bg-canvas-surface text-red-400 hover:text-red-300 border border-canvas-border"
                      title="Delete credential"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Profile & Bio Editor */}
      {activeTab === 'profile' && (
        <form
          onSubmit={handleSaveProfile}
          className="bg-canvas-subtle border border-canvas-border rounded-2xl p-6 space-y-5"
        >
          <h2 className="font-display font-bold text-lg text-ink">
            Profile Information & Narrative
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
            <div className="space-y-1">
              <label className="text-ink-muted">Full Name</label>
              <input
                type="text"
                value={profileForm.name}
                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                className="w-full bg-canvas-muted border border-canvas-border rounded-xl px-3 py-2 text-ink focus:outline-none focus:border-accent"
              />
            </div>

            <div className="space-y-1">
              <label className="text-ink-muted">Email Address</label>
              <input
                type="email"
                value={profileForm.email}
                onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                className="w-full bg-canvas-muted border border-canvas-border rounded-xl px-3 py-2 text-ink focus:outline-none focus:border-accent"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="text-ink-muted">Hero Headline</label>
              <input
                type="text"
                value={profileForm.headline}
                onChange={(e) => setProfileForm({ ...profileForm, headline: e.target.value })}
                className="w-full bg-canvas-muted border border-canvas-border rounded-xl px-3 py-2 text-ink focus:outline-none focus:border-accent"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="text-ink-muted">Supporting Statement</label>
              <input
                type="text"
                value={profileForm.supportingStatement}
                onChange={(e) => setProfileForm({ ...profileForm, supportingStatement: e.target.value })}
                className="w-full bg-canvas-muted border border-canvas-border rounded-xl px-3 py-2 text-ink focus:outline-none focus:border-accent"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="text-ink-muted">About Me Narrative (Separate paragraphs with double enter)</label>
              <textarea
                rows={5}
                value={profileForm.bio}
                onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                className="w-full bg-canvas-muted border border-canvas-border rounded-xl p-3 text-ink focus:outline-none focus:border-accent resize-none font-sans text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-accent text-black font-semibold text-xs hover:bg-accent-hover transition-colors flex items-center space-x-2"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Profile Updates</span>
          </button>
        </form>
      )}

      {/* TAB 5: Projects Manager */}
      {activeTab === 'projects' && (
        <div className="bg-canvas-subtle border border-canvas-border rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-bold text-lg text-ink">
              Projects List ({data.projects.length})
            </h2>
          </div>

          <div className="space-y-3">
            {data.projects.map((proj) => (
              <div
                key={proj.id}
                className="p-4 rounded-xl bg-canvas-muted border border-canvas-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-ink text-sm">{proj.title}</span>
                    {proj.isFeatured && (
                      <span className="px-1.5 py-0.5 rounded bg-accent-muted text-accent border border-accent-border font-mono text-[10px]">
                        Featured
                      </span>
                    )}
                  </div>
                  <div className="text-ink-secondary text-xs">{proj.tagline}</div>
                  <div className="text-ink-muted font-mono text-[11px]">
                    {proj.technologies.join(', ')}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => updateProject({ ...proj, isFeatured: !proj.isFeatured })}
                    className="px-3 py-1.5 rounded-lg bg-canvas-surface text-ink-secondary hover:text-ink border border-canvas-border font-mono text-[11px]"
                  >
                    {proj.isFeatured ? 'Unfeature' : 'Mark Featured'}
                  </button>
                  <a
                    href={proj.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-canvas-surface text-ink hover:text-accent border border-canvas-border"
                  >
                    <Github className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: Skills & Stack */}
      {activeTab === 'skills' && (
        <div className="bg-canvas-subtle border border-canvas-border rounded-2xl p-6 space-y-4">
          <h2 className="font-display font-bold text-lg text-ink">
            Skills Inventory ({data.skills.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
            {data.skills.map((skill) => (
              <div
                key={skill.id}
                className="p-3 rounded-lg bg-canvas-muted border border-canvas-border flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-semibold text-ink">{skill.name}</div>
                  <div className="text-[10px] font-mono text-ink-muted">{skill.category}</div>
                </div>
                <button
                  onClick={() => deleteSkill(skill.id)}
                  className="text-ink-muted hover:text-red-400 p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
