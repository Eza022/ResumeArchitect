import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ResumeBuilder, { formatResumeToMarkdown } from '../components/ResumeBuilder';

describe('ResumeBuilder', () => {
  it('renders the main application heading', () => {
    render(<ResumeBuilder />);
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toHaveTextContent(/Architect your career assets/i);
  });
});

describe('formatResumeToMarkdown', () => {
  it('creates markdown content with resume fields', () => {
    const resume = {
      contact: {
        name: 'Test Candidate',
        title: 'Frontend Developer',
        email: 'test@example.com',
        phone: '123-456-7890',
        location: 'Test City',
      },
      summary: 'A short professional summary.',
      experience: [],
      education: [],
      skills: [],
    };

    const markdown = formatResumeToMarkdown(resume as any);

    expect(markdown).toContain('# Test Candidate');
    expect(markdown).toContain('## Professional Summary');
    expect(markdown).toContain('A short professional summary.');
  });
});
