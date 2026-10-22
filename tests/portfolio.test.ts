import { describe, it, expect } from 'vitest';
import { initialPortfolioData } from '../src/data/initialData';
import { z } from 'zod';

describe('Portfolio Initial Verified Data Integrity', () => {
  it('contains authentic profile details without fabricated claims', () => {
    expect(initialPortfolioData.profile.name).toBe('Vaishnavi Singh');
    expect(initialPortfolioData.profile.githubUsername).toBe('phobiccvaishu');
    expect(initialPortfolioData.profile.email).toBe('vaishnavi1657@gmail.com');
    expect(initialPortfolioData.profile.linkedinSlug).toBe('vaishnavi-singh-076aba343');
    expect(initialPortfolioData.profile.headline).toBe('Building intelligent systems. Turning ideas into impact.');
  });

  it('contains verified projects from GitHub repositories', () => {
    const projects = initialPortfolioData.projects;
    expect(projects.length).toBeGreaterThanOrEqual(4);

    const proctoring = projects.find(p => p.id === 'proj-1');
    expect(proctoring).toBeDefined();
    expect(proctoring?.technologies).toContain('YOLOv8');
    expect(proctoring?.technologies).toContain('MediaPipe');
    expect(proctoring?.technologies).toContain('FastAPI');
    expect(proctoring?.verifiedFromGithub).toBe(true);

    const adaptiveTwin = projects.find(p => p.id === 'proj-2');
    expect(adaptiveTwin).toBeDefined();
    expect(adaptiveTwin?.technologies).toContain('OpenAI GPT-4o');
    expect(adaptiveTwin?.verifiedFromGithub).toBe(true);

    const insightU = projects.find(p => p.id === 'proj-3');
    expect(insightU).toBeDefined();
    expect(insightU?.technologies).toContain('Prisma ORM');
    expect(insightU?.technologies).toContain('PostgreSQL');

    const chronoSearch = projects.find(p => p.id === 'proj-4');
    expect(chronoSearch).toBeDefined();
    expect(chronoSearch?.technologies).toContain('FastAPI');
    expect(chronoSearch?.technologies).toContain('Pandas');
  });

  it('verifies education institution is SRM Institute of Science and Technology', () => {
    const edu = initialPortfolioData.education[0];
    expect(edu.institution).toBe('SRM Institute of Science and Technology');
    expect(edu.fieldOfStudy).toContain('Computer Science');
    expect(edu.verified).toBe(true);
  });

  it('verifies honest source hierarchy in data sources', () => {
    const sources = initialPortfolioData.dataSources;
    const githubSource = sources.find(s => s.source === 'GitHub API');
    const linkedinSource = sources.find(s => s.source.includes('LinkedIn'));

    expect(githubSource?.status).toBe('Connected');
    expect(linkedinSource?.status).toContain('Authentication Required / Authwall');
  });

  it('validates contact form schema with Zod', () => {
    const contactSchema = z.object({
      name: z.string().min(2),
      email: z.string().email(),
      subject: z.string().min(3),
      message: z.string().min(10)
    });

    const validSubmission = {
      name: 'Engineering Recruiter',
      email: 'recruiter@techstart.ai',
      subject: 'AI/ML Internship Discussion',
      message: 'We were impressed by your Online Examination System computer vision architecture.'
    };

    const validResult = contactSchema.safeParse(validSubmission);
    expect(validResult.success).toBe(true);

    const invalidEmailSubmission = {
      ...validSubmission,
      email: 'not-an-email'
    };
    const invalidResult = contactSchema.safeParse(invalidEmailSubmission);
    expect(invalidResult.success).toBe(false);

    const shortMessageSubmission = {
      ...validSubmission,
      message: 'Hi'
    };
    const shortResult = contactSchema.safeParse(shortMessageSubmission);
    expect(shortResult.success).toBe(false);
  });
});
