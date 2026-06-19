import { describe, it, expect } from 'vitest';
import { formatResumeToMarkdown } from '../../utils/formatters';
import { TailoredResume } from '../../types/resume';

describe('formatResumeToMarkdown', () => {
  it('creates markdown content with full resume fields', () => {
    const resume: TailoredResume = {
      contact: {
        name: 'Test Candidate',
        title: 'Frontend Developer',
        email: 'test@example.com',
        phone: '123-456-7890',
        location: 'Test City',
        linkedin: 'linkedin.com/in/test',
        github: 'github.com/test'
      },
      summary: 'A short professional summary.',
      experience: [
        {
          role: 'Software Engineer',
          company: 'Tech Corp',
          location: 'Remote',
          period: '2021 - Present',
          description: ['Developed frontend', 'Fixed bugs']
        }
      ],
      education: [
        {
          degree: 'BSc Computer Science',
          institution: 'University of Technology',
          period: '2017 - 2021',
          location: 'City'
        }
      ],
      skills: [
        {
          category: 'Frontend',
          items: ['React', 'TypeScript']
        }
      ],
      projects: [
        {
          name: 'Portfolio',
          description: 'Personal portfolio website',
          technologies: ['React', 'Tailwind'],
          link: 'test.com'
        }
      ],
      certifications: ['AWS Certified Developer'],
      languages: ['English', 'Spanish']
    };

    const markdown = formatResumeToMarkdown(resume);

    // Contact
    expect(markdown).toContain('# Test Candidate');
    expect(markdown).toContain('**Frontend Developer**');
    expect(markdown).toContain('✉️ test@example.com');
    expect(markdown).toContain('🔗 LinkedIn: linkedin.com/in/test');
    expect(markdown).toContain('💻 GitHub: github.com/test');
    
    // Summary
    expect(markdown).toContain('## Professional Summary');
    expect(markdown).toContain('A short professional summary.');
    
    // Experience
    expect(markdown).toContain('### Software Engineer | Tech Corp');
    expect(markdown).toContain('*2021 - Present* | *Remote*');
    expect(markdown).toContain('- Developed frontend');
    
    // Skills
    expect(markdown).toContain('**Frontend**: React, TypeScript');
    
    // Projects
    expect(markdown).toContain('### Portfolio');
    expect(markdown).toContain('*Tech Stack: React, Tailwind*');
    expect(markdown).toContain('Personal portfolio website');
    
    // Education
    expect(markdown).toContain('### BSc Computer Science');
    expect(markdown).toContain('University of Technology | 2017 - 2021');

    // Certifications & Languages
    expect(markdown).toContain('## Certifications');
    expect(markdown).toContain('- AWS Certified Developer');
    expect(markdown).toContain('## Languages');
    expect(markdown).toContain('- English');
  });

  it('handles missing optional fields gracefully', () => {
    const minimalResume: TailoredResume = {
      contact: {
        name: 'Jane Doe',
        title: 'Analyst',
        email: 'jane@test.com',
        phone: '111',
        location: 'Nowhere'
      },
      summary: 'Summary',
      experience: [],
      education: [],
      skills: []
    };

    const markdown = formatResumeToMarkdown(minimalResume);
    expect(markdown).toContain('# Jane Doe');
    expect(markdown).not.toContain('LinkedIn:');
    expect(markdown).not.toContain('## Projects');
    expect(markdown).not.toContain('## Certifications');
  });
});
