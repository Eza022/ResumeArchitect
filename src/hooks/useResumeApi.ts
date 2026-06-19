import { useState } from 'react';
import { ResumeData } from '../types/resume';

export const useResumeApi = () => {
  const [currentResume, setCurrentResume] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [data, setData] = useState<ResumeData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 4 * 1024 * 1024) {
      setError('File size exceeds the 4MB limit. Please upload a smaller file.');
      e.target.value = '';
      return;
    }

    setIsExtracting(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/extract-text', {
        method: 'POST',
        body: formData,
      });

      const contentType = response.headers.get('content-type');
      if (!response.ok) {
        let errorMessage = 'Failed to extract text';
        if (contentType && contentType.includes('application/json')) {
          try {
            const errData = await response.json();
            errorMessage = errData.error || errorMessage;
          } catch (_) {}
        } else {
          try {
            const rawText = await response.text();
            if (rawText && rawText.includes('<!doctype html>')) {
              errorMessage = `Server Error: Received HTML fallback page. The backend may have crashed or encountered an unexpected routing error.`;
            } else {
              errorMessage = rawText || errorMessage;
            }
          } catch (_) {}
        }
        throw new Error(errorMessage);
      }

      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        setCurrentResume(data.text);
      } else {
        throw new Error(`Expected JSON response from extraction helper but received non-JSON text.`);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsExtracting(false);
      e.target.value = '';
    }
  };

  const handleTailor = async (onSuccess?: () => void) => {
    if (!currentResume.trim() || !jobDescription.trim()) {
      setError('Please provide both your current resume and the job description.');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch('/api/tailor-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentResume, jobDescription }),
      });

      const contentType = response.headers.get('content-type');
      if (!response.ok) {
        let errorMessage = 'Failed to generate content';
        if (contentType && contentType.includes('application/json')) {
          try {
            const errData = await response.json();
            errorMessage = errData.error || errorMessage;
          } catch (_) {}
        } else {
          try {
            const rawText = await response.text();
            if (rawText && rawText.includes('<!doctype html>')) {
              errorMessage = `Server Error: Received HTML fallback page.`;
            } else {
              errorMessage = rawText || errorMessage;
            }
          } catch (_) {}
        }
        throw new Error(errorMessage);
      }

      if (contentType && contentType.includes('application/json')) {
        const result: ResumeData = await response.json();
        setData(result);
        if (onSuccess) onSuccess();
      } else {
        throw new Error(`Expected JSON response from tailoring helper`);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    currentResume,
    setCurrentResume,
    jobDescription,
    setJobDescription,
    data,
    setData,
    isGenerating,
    error,
    setError,
    isExtracting,
    handleFileUpload,
    handleTailor
  };
};
