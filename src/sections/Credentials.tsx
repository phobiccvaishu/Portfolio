import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';

export const Credentials: React.FC = () => {
  const { data, setActiveView } = usePortfolio();
  const [previewModalDoc, setPreviewModalDoc] = useState<string | null>(null);

  const publicCredentials = data.credentials.filter((c) => c.isPublic);

  return (
    <section id="credentials" className="py-20 sm:py-28 border-b border-canvas-border text-left">
      <div className="max-w-editorial mx-auto px-5 sm:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-12 sm:mb-16 pb-4 border-b border-canvas-border gap-4">
          <div className="flex items-baseline space-x-3">
            <span className="font-mono text-xs uppercase tracking-widest text-accent">05 /</span>
            <h2 className="font-display text-3xl sm:text-4xl text-ink font-normal tracking-tight">
              Certifications & Training
            </h2>
          </div>
          <span className="font-mono text-xs text-ink-secondary uppercase tracking-widest">
            {publicCredentials.length} Credentials Listed
          </span>
        </div>

        {/* Editorial Table-like List */}
        <div className="divide-y divide-canvas-border border-t border-b border-canvas-border">
          {publicCredentials.map((cred, index) => {
            const num = String(index + 1).padStart(2, '0');

            return (
              <div
                key={cred.id}
                className="py-5 sm:py-6 grid grid-cols-12 gap-3 sm:gap-6 items-baseline hover:bg-canvas-surface/30 transition-colors px-2"
              >
                {/* Index Number */}
                <div className="col-span-2 sm:col-span-1 font-mono text-xs text-ink-secondary">
                  {num}
                </div>

                {/* Title & Organization */}
                <div className="col-span-10 sm:col-span-5 space-y-1">
                  <div className="font-display text-lg sm:text-xl text-ink font-normal">
                    {cred.title}
                  </div>
                  <div className="text-xs text-ink-secondary font-mono">
                    {cred.issuer}
                  </div>
                </div>

                {/* Type & Hours / Details */}
                <div className="col-span-6 sm:col-span-3 font-mono text-xs text-ink-secondary">
                  <span className="uppercase tracking-wider">{cred.type}</span>
                  {cred.hours && (
                    <span className="text-ink block text-[11px] mt-0.5">
                      {cred.hours} Program
                    </span>
                  )}
                </div>

                {/* Status & Verification Link */}
                <div className="col-span-6 sm:col-span-3 text-right font-mono text-xs space-y-1">
                  <div>
                    {cred.status === 'ongoing' ? (
                      <span className="text-accent uppercase tracking-wider font-semibold">
                        [Ongoing]
                      </span>
                    ) : (
                      <span className="text-ink-secondary uppercase tracking-wider">
                        {cred.issueDate}
                      </span>
                    )}
                  </div>

                  <div className="pt-0.5">
                    {cred.verificationUrl ? (
                      <a
                        href={cred.verificationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="editorial-link text-ink hover:text-accent uppercase text-[11px]"
                      >
                        Verify &nearr;
                      </a>
                    ) : cred.documentUrl ? (
                      <button
                        onClick={() => setPreviewModalDoc(cred.documentUrl || null)}
                        className="editorial-link text-accent hover:underline uppercase text-[11px]"
                      >
                        Preview Document &nearr;
                      </button>
                    ) : (
                      <span className="text-ink-secondary text-[11px] uppercase">
                        Verified Record
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footnote / Action */}
        <div className="pt-6 flex items-baseline justify-between text-xs font-mono text-ink-secondary">
          <span>All certificates backed by institutional coursework or industry records.</span>
          <button
            onClick={() => setActiveView('admin')}
            className="editorial-link text-ink hover:text-accent uppercase tracking-wider"
          >
            Manage Credentials &nearr;
          </button>
        </div>

      </div>

      {/* Document Preview Modal */}
      {previewModalDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/70">
          <div className="bg-canvas border border-canvas-border max-w-2xl w-full p-6 space-y-4 text-left">
            <div className="flex items-center justify-between border-b border-canvas-border pb-3">
              <h3 className="font-display font-normal text-xl text-ink">Certificate Document</h3>
              <button
                onClick={() => setPreviewModalDoc(null)}
                className="font-mono text-xs uppercase tracking-wider text-ink-secondary hover:text-ink"
              >
                Close [x]
              </button>
            </div>
            <div className="h-[60vh] overflow-hidden bg-canvas-surface border border-canvas-border flex items-center justify-center">
              {previewModalDoc.endsWith('.pdf') ? (
                <iframe src={previewModalDoc} className="w-full h-full" title="Certificate PDF" />
              ) : (
                <img src={previewModalDoc} alt="Certificate" className="max-h-full object-contain" />
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
