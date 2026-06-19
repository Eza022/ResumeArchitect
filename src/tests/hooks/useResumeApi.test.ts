import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useResumeApi } from '../../hooks/useResumeApi';

// Mock fetch globally
global.fetch = vi.fn();

describe('useResumeApi Hook', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('initializes with default state', () => {
    const { result } = renderHook(() => useResumeApi());
    expect(result.current.currentResume).toBe('');
    expect(result.current.jobDescription).toBe('');
    expect(result.current.data).toBeNull();
    expect(result.current.isGenerating).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('handleTailor sets error if inputs are empty', async () => {
    const { result } = renderHook(() => useResumeApi());
    
    await act(async () => {
      await result.current.handleTailor();
    });

    expect(result.current.error).toBe('Please provide both your current resume and the job description.');
  });

  it('handleTailor handles successful API call', async () => {
    const mockResponse = {
      tailoredResume: { contact: { name: 'Test' } },
      coverLetter: 'Test Letter',
      analysis: { matchScore: 90 }
    };

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => mockResponse,
    });

    const { result } = renderHook(() => useResumeApi());
    
    act(() => {
      result.current.setCurrentResume('My resume text');
      result.current.setJobDescription('Job text');
    });

    await act(async () => {
      await result.current.handleTailor();
    });

    expect(result.current.isGenerating).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.data).toEqual(mockResponse);
  });

  it('handleTailor handles API error response', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => ({ error: 'AI limit exceeded' }),
    });

    const { result } = renderHook(() => useResumeApi());
    
    act(() => {
      result.current.setCurrentResume('My resume text');
      result.current.setJobDescription('Job text');
    });

    await act(async () => {
      await result.current.handleTailor();
    });

    expect(result.current.error).toBe('AI limit exceeded');
    expect(result.current.data).toBeNull();
  });
});
