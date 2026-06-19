import React, { useState } from 'react';
import { pdf } from '@react-pdf/renderer';
import { ResumePDF as ResumePDFDocument } from '../components/ResumePDF';
import { createTextDocument } from '../utils/formatters';
import { ResumeData } from '../types/resume';

export const useResumeExport = (
  data: ResumeData | null, 
  activeTab: 'resume' | 'letter' | 'analysis',
  currentTheme: any,
  fontPair: string,
  layoutStyle: string,
  setError: (err: string | null) => void
) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExportPDF = async () => {
    if (!data) return;
    
    setIsExporting(true);
    setError(null);

    try {
      const candidateName = data.tailoredResume.contact.name || 'Tailored';
      const fileName = activeTab === 'resume' 
        ? `${candidateName.replace(/\s+/g, '_')}_Resume.pdf` 
        : activeTab === 'letter' 
          ? `${candidateName.replace(/\s+/g, '_')}_Cover_Letter.pdf` 
          : 'Job_Fit_Analysis.pdf';

      let blob: Blob | null = null;

      if (activeTab === 'resume') {
        blob = await pdf(
          <ResumePDFDocument
            resume={data.tailoredResume}
            accentColor={currentTheme.primary}
            fontPair={fontPair}
            layoutStyle={layoutStyle}
          />
        ).toBlob();
      } else if (activeTab === 'letter') {
        const title = `${candidateName} Cover Letter`;
        blob = await pdf(createTextDocument(title, data.coverLetter)).toBlob();
      } else {
        blob = await pdf(createTextDocument('Job Fit Analysis', data.analysis.keyImprovements)).toBlob();
      }

      if (!blob) {
        throw new Error('Unable to generate PDF file.');
      }

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('PDF Export Error:', err);
      setError('Failed to generate PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return { isExporting, handleExportPDF };
};
