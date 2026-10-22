import { describe, it, expect } from 'vitest';
import { initialPortfolioData } from '../src/data/initialData';
import { z } from 'zod';

describe('Portfolio Verified e-Resume & Project Integrity', () => {
  it('contains authentic profile details from e-resume', () => {
    expect(initialPortfolioData.profile.name).toBe('Vaishnavi');
    expect(initialPortfolioData.profile.githubUsername).toBe('phobiccvaishu');
    expect(initialPortfolioData.profile.email).toBe('Vaishnavi1657@gmail.com');
    expect(initialPortfolioData.profile.phone).toBe('+91-7209905770');
    expect(initialPortfolioData.profile.cgpa).toBe('8.60 / 10.00');
  });

  it('contains Reqruit IQ project with ongoing research paper', () => {
    const reqruitIq = initialPortfolioData.projects.find(p => p.id === 'proj-reqruit-iq');
    expect(reqruitIq).toBeDefined();
    expect(reqruitIq?.title).toContain('Reqruit IQ');
    expect(reqruitIq?.status).toBe('Ongoing Research');
    expect(reqruitIq?.researchPaper).toBeDefined();
    expect(reqruitIq?.researchPaper?.status).toBe('Ongoing');
    expect(reqruitIq?.technologies).toContain('FastAPI');
  });

  it('contains C-DAC AI/ML 400-hour ongoing certification', () => {
    const cdac = initialPortfolioData.credentials.find(c => c.id === 'cred-cdac-aiml');
    expect(cdac).toBeDefined();
    expect(cdac?.status).toBe('ongoing');
    expect(cdac?.hours).toBe('400 Hours');
  });

  it('contains Unified Mentor 3-month online ongoing internship', () => {
    const unifiedMentor = initialPortfolioData.experience.find(e => e.id === 'exp-unified-mentor');
    expect(unifiedMentor).toBeDefined();
    expect(unifiedMentor?.organization).toBe('Unified Mentor');
    expect(unifiedMentor?.type).toBe('internship');
    expect(unifiedMentor?.current).toBe(true);
  });

  it('verifies academic standing at SRMIST (8.60 CGPA)', () => {
    const edu = initialPortfolioData.education[0];
    expect(edu.institution).toBe('SRM Institute of Science and Technology');
    expect(edu.cgpa).toBe('8.60 / 10.00');
    expect(edu.verified).toBe(true);
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
      message: 'We were impressed by your Reqruit IQ research and C-DAC AI/ML training.'
    };

    const validResult = contactSchema.safeParse(validSubmission);
    expect(validResult.success).toBe(true);
  });
});
