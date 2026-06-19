import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ResumeBuilder from '../components/ResumeBuilder';

describe('ResumeBuilder', () => {
  it('renders the main application heading', () => {
    render(<ResumeBuilder />);
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toHaveTextContent(/Architect your career assets/i);
  });
});
