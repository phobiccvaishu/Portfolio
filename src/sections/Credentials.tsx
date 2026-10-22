import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Credential, CredentialType } from '../types/portfolio';
import { Award, CheckCircle, ExternalLink, FileText, Plus, ShieldCheck, Eye, Clock } from 'lucide-react';

export const Credentials: React.FC = () => {
  const { data, setActiveView } = usePortfolio();
  const [selectedType, setSelectedType] = useState<string>('All');
  const [previewModalDoc, setPreviewModalDoc] = useState<string | null>(null);

  const types: { label: string; value: string }[] = [
    { label: 'All Credentials', value: 'All' },
    { label: 'Certifications', value: 'certification' },
    { label: 'Course Completions', value: 'course' },
    { label: 'Problem Solving & Awards', value: 'award' },
  ];

  const filteredCredentials = data.credentials.filter((c) => {
    if (!c.isPublic) return false;
    if (selectedType === 'All') return true;
    return c.type === selectedType;
  });

  return (
    <section id="credentials" className="py-20 md:py-28 border-t border-canvas-border relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 text-left">
          <div className="space-y-3">
            <div className="inline-flex items-center space-x-2 text-xs font-mono text-accent uppercase tracking-widest">
              <span>05 // Certifications & Competencies</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-ink tracking-tight">
              Certifications & Technical Honors
            </h2>
            <p className="text-base text-ink-secondary max-w-xl">
              Authentic industry specializations, C-DAC intensive AI/ML certification, NPTEL credentials, and verified problem-solving track records.
            </p>
          </div>

          {/* Type Filters */}
          <div className="flex flex-wrap items-center gap-2">
            {types.map((t) => (
              <button
                key={t.value}
                onClick={() => setSelectedType(t.value)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  selectedType === t.value
                    ? 'bg-accent text-black font-semibold'
                    : 'bg-canvas-muted text-ink-secondary hover:text-ink border border-canvas-border'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Credentials Grid */}
        {filteredCredentials.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCredentials.map((cred) => (
              <div
                key={cred.id}
                className="p-6 rounded-2xl bg-canvas-subtle border border-canvas-border hover:border-canvas-borderStrong transition-all text-left flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono uppercase px-2 py-0.5 rounded bg-canvas-muted text-accent border border-accent-border">
                      {cred.type}
                    </span>
                    {cred.status === 'ongoing' ? (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-accent text-black font-bold flex items-center gap-1 shadow-sm">
                        <Clock className="w-3 h-3" />
                        <span>Ongoing</span>
                      </span>
                    ) : (
                      <span className="text-xs font-mono text-ink-muted">
                        {cred.issueDate}
                      </span>
                    )}
                  </div>

                  <h3 className="font-display font-bold text-lg text-ink group-hover:text-accent transition-colors">
                    {cred.title}
                  </h3>

                  <div className="text-xs text-ink-secondary font-mono">
                    Issuer: <span className="text-ink font-medium">{cred.issuer}</span>
                  </div>

                  {cred.hours && (
                    <div className="text-[11px] font-mono text-accent bg-canvas-muted p-1.5 rounded-lg border border-canvas-border inline-block">
                      {cred.hours} Industry Specialization Program
                    </div>
                  )}

                  {cred.credentialId && (
                    <div className="text-[11px] font-mono text-ink-muted">
                      ID: {cred.credentialId}
                    </div>
                  )}
                </div>

                <div className="pt-4 mt-4 border-t border-canvas-border flex items-center justify-between text-xs">
                  {cred.documentUrl ? (
                    <button
                      onClick={() => setPreviewModalDoc(cred.documentUrl || null)}
                      className="inline-flex items-center space-x-1.5 text-accent hover:underline font-mono"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Preview Document</span>
                    </button>
                  ) : (
                    <div className="inline-flex items-center space-x-1 text-ink-muted font-mono">
                      <ShieldCheck className="w-3.5 h-3.5 text-accent" />
                      <span>Verified Record</span>
                    </div>
                  )}

                  {cred.verificationUrl && (
                    <a
                      href={cred.verificationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1 text-ink-secondary hover:text-ink font-mono"
                    >
                      <span>Verify</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 rounded-2xl bg-canvas-subtle border border-canvas-border text-center space-y-4">
            <Award className="w-10 h-10 text-ink-muted mx-auto" />
            <div className="text-ink font-display font-semibold">No credentials found in this category</div>
            <p className="text-xs text-ink-secondary max-w-md mx-auto">
              Upload certificates in PDF or image format via the Management Dashboard.
            </p>
          </div>
        )}

        {/* Dashboard CTA */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => setActiveView('admin')}
            className="inline-flex items-center space-x-2 text-xs font-mono text-ink-secondary hover:text-accent px-4 py-2 rounded-xl bg-canvas-muted border border-canvas-border transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Upload New Certificate or Edit Existing</span>
          </button>
        </div>

      </div>

      {/* Document Preview Modal */}
      {previewModalDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-canvas-subtle border border-canvas-border max-w-3xl w-full rounded-2xl p-6 space-y-4 text-left shadow-2xl">
            <div className="flex items-center justify-between border-b border-canvas-border pb-3">
              <h3 className="font-display font-bold text-lg text-ink">Certificate Document Preview</h3>
              <button
                onClick={() => setPreviewModalDoc(null)}
                className="text-xs text-ink-muted hover:text-ink px-2 py-1 rounded bg-canvas-muted"
              >
                Close
              </button>
            </div>
            <div className="h-[60vh] overflow-hidden rounded-xl bg-black border border-canvas-border flex items-center justify-center">
              {previewModalDoc.endsWith('.pdf') ? (
                <iframe src={previewModalDoc} className="w-full h-full" title="Certificate PDF Preview" />
              ) : (
                <img src={previewModalDoc} alt="Certificate Preview" className="max-h-full object-contain" />
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
