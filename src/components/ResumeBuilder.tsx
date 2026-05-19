import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText, Briefcase, Wand2, Copy, Check, Download, 
  AlertCircle, Loader2, Sparkles, User, Target, 
  Mail, BarChart3, ChevronRight, Hash, XCircle, CheckCircle2, Upload
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface ResumeData {
  tailoredResume: string;
  coverLetter: string;
  analysis: {
    matchScore: number;
    matchedKeywords: string[];
    missingKeywords: string[];
    keyImprovements: string;
  };
}

export default function ResumeBuilder() {
  const [currentResume, setCurrentResume] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [data, setData] = useState<ResumeData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'resume' | 'letter' | 'analysis'>('resume');
  const [isExporting, setIsExporting] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

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
        throw new Error('Expected JSON response but received unexpected format.');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsExtracting(false);
      // Reset input
      e.target.value = '';
    }
  };

  const handleTailor = async () => {
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
              errorMessage = `Server Error: Received HTML fallback page. The backend might have crashed or encountered an unexpected routing error.`;
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
        setActiveTab('resume');
      } else {
        throw new Error('Expected JSON response but received unexpected format.');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    const text = activeTab === 'resume' ? data?.tailoredResume : data?.coverLetter;
    if (text) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleExportPDF = async () => {
    if (!data) return;
    
    setIsExporting(true);
    const element = document.getElementById('content-area');
    if (!element) return;

    try {
      const { default: html2canvas } = await import('html2canvas');
      const { jsPDF } = await import('jspdf');

      // Create a clone to strip some UI elements if necessary, 
      // but here we just target the content area
      const canvas = await html2canvas(element, {
        scale: 2, // Higher quality
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      
      const fileName = activeTab === 'resume' 
        ? 'Tailored_Resume.pdf' 
        : activeTab === 'letter' 
          ? 'Cover_Letter.pdf' 
          : 'Analysis.pdf';
          
      pdf.save(fileName);
    } catch (err) {
      console.error('PDF Export Error:', err);
      setError('Failed to generate PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-[#1A1A1A] font-sans selection:bg-[#F27D26]/20">
      {/* Header */}
      <header className="border-b border-[#1A1A1A]/10 bg-white/80 backdrop-blur-md sticky top-0 z-20 px-6 py-4 print:hidden">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#1A1A1A] rounded-lg flex items-center justify-center text-white">
              <Sparkles className="w-5 h-5 text-[#F27D26]" />
            </div>
            <h1 className="text-xl font-semibold tracking-tight">ResumeArchitect</h1>
          </div>
          <div className="hidden md:flex items-center gap-4 text-xs font-medium uppercase tracking-widest text-[#1A1A1A]/40">
            <span>Precision Architecture</span>
            <span className="w-1 h-1 bg-[#F27D26] rounded-full"></span>
            <span>ATS Optimized</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 md:p-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* Left Column: Inputs */}
          <section className="space-y-8 print:hidden">
            <div className="space-y-2">
              <h2 className="text-4xl font-light tracking-tight text-[#1A1A1A]">Engineered for <span className="font-medium italic">impact.</span></h2>
              <p className="text-[#1A1A1A]/60 max-w-md text-lg">Align your professional narrative with the specific needs of your next role.</p>
            </div>

            <div className="space-y-6">
              {/* Resume Input */}
              <div className="space-y-3 group">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1A1A1A]/40 transition-colors group-focus-within:text-[#F27D26]">
                    <User className="w-4 h-4" />
                    Experience Grounding (Current Resume)
                  </label>
                  <label className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#F27D26] hover:text-[#D1621B] cursor-pointer transition-colors bg-[#F27D26]/5 px-2 py-1 rounded-md ${isExtracting ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    {isExtracting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Upload className="w-3 h-3" />}
                    {isExtracting ? 'Extracting...' : 'Upload File'}
                    <input 
                      type="file" 
                      className="hidden" 
                      accept=".pdf,.docx,.doc,.txt" 
                      onChange={handleFileUpload} 
                      disabled={isExtracting} 
                    />
                  </label>
                </div>
                <textarea
                  placeholder="Paste your existing resume text here or upload a file..."
                  className="w-full min-h-[250px] p-5 bg-white border border-[#1A1A1A]/10 rounded-2xl focus:ring-4 focus:ring-[#F27D26]/5 focus:border-[#F27D26] transition-all outline-none resize-none shadow-sm text-sm leading-relaxed"
                  value={currentResume}
                  onChange={(e) => setCurrentResume(e.target.value)}
                />
              </div>

              {/* Job description Input */}
              <div className="space-y-3 group">
                <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1A1A1A]/40 transition-colors group-focus-within:text-[#F27D26]">
                  <Target className="w-4 h-4" />
                  Target Specifications (Job Description)
                </label>
                <textarea
                  placeholder="Paste the job requirements and description here..."
                  className="w-full min-h-[200px] p-5 bg-white border border-[#1A1A1A]/10 rounded-2xl focus:ring-4 focus:ring-[#F27D26]/5 focus:border-[#F27D26] transition-all outline-none resize-none shadow-sm text-sm leading-relaxed"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                />
              </div>

              {error && (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 text-sm"
                >
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {error}
                </motion.div>
              )}

              <button
                onClick={handleTailor}
                disabled={isGenerating}
                className="w-full h-16 bg-[#1A1A1A] hover:bg-[#2A2A2A] text-white rounded-2xl font-bold tracking-tight flex items-center justify-center gap-3 transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] shadow-xl shadow-[#1A1A1A]/10 group overflow-hidden relative"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span>Processing Architecture...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                    <span>Architect My Package</span>
                  </>
                )}
              </button>
            </div>
          </section>

          {/* Right Column: Output */}
          <section className="lg:sticky lg:top-32 self-start space-y-6">
            <AnimatePresence mode="wait">
              {!data && !isGenerating ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="aspect-[3/4] bg-white border border-dashed border-[#1A1A1A]/20 rounded-3xl flex flex-col items-center justify-center p-12 text-center text-[#1A1A1A]/30 space-y-4 shadow-sm"
                >
                  <div className="w-20 h-20 bg-[#1A1A1A]/5 rounded-full flex items-center justify-center">
                    <FileText className="w-10 h-10" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-semibold text-lg text-[#1A1A1A]/60">Drafting Studio</p>
                    <p className="text-sm">Input your details to generate your tailored career assets.</p>
                  </div>
                </motion.div>
              ) : isGenerating ? (
                <motion.div
                  key="generating"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="aspect-[3/4] bg-white border border-[#1A1A1A]/10 rounded-3xl p-12 space-y-8 overflow-hidden relative shadow-inner"
                >
                  <div className="space-y-6">
                    <div className="w-2/3 h-8 bg-[#1A1A1A]/5 rounded-lg animate-pulse" />
                    <div className="space-y-3">
                      <div className="w-full h-4 bg-[#1A1A1A]/5 rounded-lg animate-pulse" />
                      <div className="w-full h-4 bg-[#1A1A1A]/5 rounded-lg animate-pulse" />
                      <div className="w-[90%] h-4 bg-[#1A1A1A]/5 rounded-lg animate-pulse" />
                    </div>
                    <div className="w-full h-40 bg-[#1A1A1A]/5 rounded-xl animate-pulse" />
                  </div>
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent flex flex-col items-center justify-center backdrop-blur-[2px]">
                    <div className="flex flex-col items-center gap-6">
                      <div className="relative">
                        <div className="absolute inset-0 bg-[#F27D26]/20 blur-2xl rounded-full scale-150 animate-pulse" />
                        <div className="w-16 h-16 border-4 border-[#F27D26]/10 border-t-[#F27D26] rounded-full animate-spin relative" />
                      </div>
                      <div className="text-center space-y-2">
                        <p className="text-lg font-bold tracking-tight text-[#1A1A1A]">Analyzing Skill Matrices</p>
                        <p className="text-xs text-[#1A1A1A]/40 font-medium uppercase tracking-widest">Applying STAR Methodology</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : data && (
                <motion.div
                  key="output"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  {/* Tabs */}
                  <div className="flex p-1.5 bg-[#1A1A1A]/5 rounded-2xl print:hidden">
                    {[
                      { id: 'resume', label: 'Resume', icon: FileText },
                      { id: 'letter', label: 'Cover Letter', icon: Mail },
                      { id: 'analysis', label: 'Job Fit', icon: BarChart3 }
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${
                          activeTab === tab.id 
                            ? 'bg-white text-[#1A1A1A] shadow-md' 
                            : 'text-[#1A1A1A]/40 hover:text-[#1A1A1A]/60'
                        }`}
                      >
                        <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-[#F27D26]' : ''}`} />
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* Actions Area */}
                  <div className="flex items-center justify-between print:hidden">
                    <div className="flex items-center gap-3">
                      {activeTab !== 'analysis' && (
                        <div className="flex items-center gap-2 px-3 py-1 bg-[#F27D26]/10 text-[#F27D26] rounded-full">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span className="text-[10px] font-bold uppercase tracking-wider">ATS Compatible</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 font-display">
                      <button
                        onClick={handleCopy}
                        className="px-4 py-2 bg-white border border-[#1A1A1A]/10 rounded-xl hover:border-[#1A1A1A]/30 transition-all text-[#1A1A1A]/60 hover:text-[#1A1A1A] shadow-sm flex items-center gap-2 text-xs font-semibold"
                      >
                        {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                        {copied ? 'Copied' : 'Copy Text'}
                      </button>
                      <button
                        onClick={handleExportPDF}
                        disabled={isExporting}
                        className="px-4 py-2 bg-[#1A1A1A] text-white rounded-xl hover:bg-[#2A2A2A] transition-all shadow-lg shadow-[#1A1A1A]/5 flex items-center gap-2 text-xs font-semibold disabled:opacity-50"
                      >
                        {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                        {isExporting ? 'Exporting...' : 'PDF Export'}
                      </button>
                    </div>
                  </div>

                  {/* Content Container */}
                  <div 
                    id="content-area"
                    className="bg-white border border-[#1A1A1A]/10 rounded-3xl p-8 md:p-12 shadow-2xl shadow-[#1A1A1A]/5 overflow-hidden print:shadow-none print:p-0 print:border-none"
                  >
                    <AnimatePresence mode="wait">
                      {activeTab === 'analysis' ? (
                        <motion.div
                          key="analysis"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="space-y-10"
                        >
                          <div className="flex items-center justify-between">
                            <div className="space-y-1">
                              <h3 className="text-2xl font-bold tracking-tight">Market Fit Analysis</h3>
                              <p className="text-sm text-[#1A1A1A]/40 uppercase tracking-widest font-semibold">Alignment Score</p>
                            </div>
                            <div className="relative w-24 h-24 flex items-center justify-center">
                              <svg className="w-full h-full transform -rotate-90">
                                <circle
                                  cx="48" cy="48" r="40"
                                  stroke="currentColor" strokeWidth="8"
                                  fill="transparent" className="text-[#1A1A1A]/5"
                                />
                                <circle
                                  cx="48" cy="48" r="40"
                                  stroke="currentColor" strokeWidth="8"
                                  fill="transparent" className="text-[#F27D26]"
                                  strokeDasharray={251.2}
                                  strokeDashoffset={251.2 - (251.2 * data.analysis.matchScore) / 100}
                                  strokeLinecap="round"
                                />
                              </svg>
                              <span className="absolute text-xl font-bold">{data.analysis.matchScore}%</span>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                              <div className="flex items-center gap-2 text-xs font-bold text-green-600 uppercase tracking-wider">
                                <CheckCircle2 className="w-4 h-4" /> Matched Keywords
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {data.analysis.matchedKeywords.map((kw, i) => (
                                  <span key={i} className="px-3 py-1 bg-green-50 text-green-700 rounded-lg text-xs font-medium border border-green-100 italic">#{kw}</span>
                                ))}
                              </div>
                            </div>
                            <div className="space-y-4">
                              <div className="flex items-center gap-2 text-xs font-bold text-[#F27D26] uppercase tracking-wider">
                                <AlertCircle className="w-4 h-4" /> Missing Key Factors
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {data.analysis.missingKeywords.map((kw, i) => (
                                  <span key={i} className="px-3 py-1 bg-[#F27D26]/5 text-[#F27D26] rounded-lg text-xs font-medium border border-[#F27D26]/10 italic">#{kw}</span>
                                ))}
                              </div>
                            </div>
                          </div>

                          <div className="p-6 bg-[#1A1A1A]/2 border border-[#1A1A1A]/5 rounded-2xl space-y-3">
                            <h4 className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                              <Sparkles className="w-4 h-4 text-[#F27D26]" /> 
                              Architect's Strategy
                            </h4>
                            <p className="text-sm text-[#1A1A1A]/70 leading-relaxed italic">"{data.analysis.keyImprovements}"</p>
                          </div>
                        </motion.div>
                      ) : (
                        <motion.div
                          key={activeTab}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          className="markdown-body prose prose-slate max-w-none prose-headings:font-semibold prose-headings:tracking-tight prose-p:text-[#1A1A1A]/80 prose-li:text-[#1A1A1A]/80"
                        >
                          <ReactMarkdown>
                            {activeTab === 'resume' ? data.tailoredResume : data.coverLetter}
                          </ReactMarkdown>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        </div>
      </main>

      <footer className="max-w-7xl mx-auto px-12 py-12 text-[#1A1A1A]/30 text-center space-y-4 print:hidden">
        <div className="flex items-center justify-center gap-8 text-[10px] uppercase font-bold tracking-[0.3em]">
          <span>Security & Privacy First</span>
          <span className="w-1.5 h-1.5 bg-[#F27D26] rounded-full"></span>
          <span>Zero Data Persistence</span>
          <span className="w-1.5 h-1.5 bg-[#F27D26] rounded-full"></span>
          <span>Open Standards</span>
        </div>
      </footer>

      <style>{`
        .markdown-body h1 { font-family: var(--font-display); font-size: 2.75rem; border-bottom: 3px solid #1A1A1A; padding-bottom: 0.75rem; margin-top: 0; margin-bottom: 1.5rem; letter-spacing: -0.02em; }
        .markdown-body h2 { font-family: var(--font-display); font-size: 1.75rem; margin-top: 2.5rem; margin-bottom: 1.25rem; border-bottom: 1px solid #1A1A1A/20; padding-bottom: 0.5rem; letter-spacing: -0.01em; }
        .markdown-body h3 { font-size: 1.25rem; margin-top: 1.5rem; margin-bottom: 0.75rem; font-weight: 700; color: #1A1A1A; }
        .markdown-body p { margin-bottom: 1.25rem; line-height: 1.7; font-size: 0.95rem; }
        .markdown-body ul { list-style-type: square; padding-left: 1.5rem; margin-bottom: 1.5rem; }
        .markdown-body li { margin-bottom: 0.6rem; padding-left: 0.5rem; }
        .markdown-body strong { color: #1A1A1A; font-weight: 700; }
        .markdown-body em { font-style: italic; color: #1A1A1A/60; }

        @media print {
          header, section:first-of-type, .print\\:hidden, .hidden {
            display: none !important;
          }
          body { background: white; }
          main { padding: 0 !important; margin: 0 !important; max-width: none !important; }
          #content-area {
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
            width: 100% !important;
            overflow: visible !important;
          }
          .markdown-body h1 { font-size: 24pt; border-bottom-width: 1.5pt; }
          .markdown-body h2 { font-size: 16pt; margin-top: 20pt; }
          .markdown-body p, .markdown-body li { font-size: 10pt; line-height: 1.5; }
        }
      `}</style>
    </div>
  );
}
