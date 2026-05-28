import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText, Briefcase, Wand2, Copy, Check, Download, 
  AlertCircle, Loader2, Sparkles, User, Target, 
  Mail, BarChart3, ChevronRight, Hash, XCircle, CheckCircle2, Upload,
  MapPin, Phone, Globe, Linkedin, Github, Award, Languages, Palette, Layout, Type,
  Edit, Save, X, Plus, Trash2
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface ContactInfo {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  website?: string;
  linkedin?: string;
  github?: string;
}

interface WorkExperience {
  role: string;
  company: string;
  location?: string;
  period: string;
  description: string[];
}

interface Education {
  degree: string;
  institution: string;
  location?: string;
  period: string;
  details?: string;
}

interface SkillCategory {
  category: string;
  items: string[];
}

interface Project {
  name: string;
  description: string;
  technologies: string[];
  link?: string;
}

interface Reference {
  name: string;
  title?: string;
  company?: string;
  email?: string;
  phone?: string;
  relationship?: string;
}


interface TailoredResume {
  contact: ContactInfo;
  summary: string;
  experience: WorkExperience[];
  education: Education[];
  skills: SkillCategory[];
  projects?: Project[];
  languages?: string[];
  certifications?: string[];
  references?: Reference[];
}

interface ResumeData {
  tailoredResume: TailoredResume;
  coverLetter: string;
  analysis: {
    matchScore: number;
    matchedKeywords: string[];
    missingKeywords: string[];
    keyImprovements: string;
  };
}

const COLOR_THEMES = {
  indigo: {
    name: 'Royal Indigo',
    primary: '#4f46e5',
    primaryText: 'text-indigo-600',
    primaryBg: 'bg-indigo-600',
    primaryBorder: 'border-indigo-600',
    sidebarBg: '#f8fafc',
    lightBg: 'bg-indigo-50/50',
    lightText: 'text-indigo-700',
    accentDot: 'bg-indigo-600',
    iconColor: '#4f46e5',
    hex: '#4f46e5'
  },
  emerald: {
    name: 'Modern Emerald',
    primary: '#059669',
    primaryText: 'text-emerald-600',
    primaryBg: 'bg-emerald-600',
    primaryBorder: 'border-emerald-600',
    sidebarBg: '#f4fbf7',
    lightBg: 'bg-emerald-50/50',
    lightText: 'text-emerald-700',
    accentDot: 'bg-emerald-600',
    iconColor: '#059669',
    hex: '#059669'
  },
  slate: {
    name: 'Slate Corporate',
    primary: '#0f172a',
    primaryText: 'text-slate-900',
    primaryBg: 'bg-slate-900',
    primaryBorder: 'border-slate-900',
    sidebarBg: '#f8fafc',
    lightBg: 'bg-slate-100/50',
    lightText: 'text-slate-700',
    accentDot: 'bg-slate-900',
    iconColor: '#0f172a',
    hex: '#0f172a'
  },
  amber: {
    name: 'Warm Ochre',
    primary: '#d97706',
    primaryText: 'text-amber-600',
    primaryBg: 'bg-amber-600',
    primaryBorder: 'border-amber-600',
    sidebarBg: '#fffbeb',
    lightBg: 'bg-amber-50/50',
    lightText: 'text-amber-700',
    accentDot: 'bg-amber-600',
    iconColor: '#d97706',
    hex: '#d97706'
  },
  rose: {
    name: 'Creative Rose',
    primary: '#e11d48',
    primaryText: 'text-rose-600',
    primaryBg: 'bg-rose-600',
    primaryBorder: 'border-rose-600',
    sidebarBg: '#fff5f5',
    lightBg: 'bg-rose-50/50',
    lightText: 'text-rose-700',
    accentDot: 'bg-rose-600',
    iconColor: '#e11d48',
    hex: '#e11d48'
  }
};

const FONT_PAIRS = {
  outfit: {
    name: 'Outfit + Inter',
    headerClass: 'font-display',
    bodyClass: 'font-sans',
    headerFamily: '"Outfit", sans-serif',
    bodyFamily: '"Inter", sans-serif'
  },
  poppins: {
    name: 'Poppins + Inter',
    headerClass: 'font-poppins',
    bodyClass: 'font-sans',
    headerFamily: '"Poppins", sans-serif',
    bodyFamily: '"Inter", sans-serif'
  },
  sans: {
    name: 'Inter Minimalist',
    headerClass: 'font-sans',
    bodyClass: 'font-sans',
    headerFamily: '"Inter", sans-serif',
    bodyFamily: '"Inter", sans-serif'
  }
};

const formatResumeToMarkdown = (resume: TailoredResume): string => {
  let md = `# ${resume.contact.name}\n`;
  md += `**${resume.contact.title}**\n\n`;
  md += `✉️ ${resume.contact.email} | 📞 ${resume.contact.phone} | 📍 ${resume.contact.location}\n`;
  
  const links = [];
  if (resume.contact.website) links.push(`🌐 ${resume.contact.website}`);
  if (resume.contact.linkedin) links.push(`🔗 LinkedIn: ${resume.contact.linkedin}`);
  if (resume.contact.github) links.push(`💻 GitHub: ${resume.contact.github}`);
  if (links.length > 0) {
    md += `${links.join(' | ')}\n`;
  }
  
  md += `\n---\n\n`;
  md += `## Professional Summary\n${resume.summary}\n\n`;
  
  md += `## Professional Experience\n\n`;
  resume.experience.forEach(exp => {
    md += `### ${exp.role} | ${exp.company}\n`;
    md += `*${exp.period}* | *${exp.location || ''}*\n`;
    exp.description.forEach(point => {
      md += `- ${point}\n`;
    });
    md += `\n`;
  });
  
  md += `## Skills\n\n`;
  resume.skills.forEach(skill => {
    md += `**${skill.category}**: ${skill.items.join(', ')}\n\n`;
  });
  
  if (resume.projects && resume.projects.length > 0) {
    md += `## Projects\n\n`;
    resume.projects.forEach(proj => {
      md += `### ${proj.name}\n`;
      if (proj.link) md += `*Link: ${proj.link}* | `;
      md += `*Tech Stack: ${proj.technologies.join(', ')}*\n`;
      md += `${proj.description}\n\n`;
    });
  }
  
  if (resume.education && resume.education.length > 0) {
    md += `## Education\n\n`;
    resume.education.forEach(edu => {
      md += `### ${edu.degree}\n`;
      md += `${edu.institution} | ${edu.period}\n`;
      if (edu.details) md += `${edu.details}\n`;
      md += `\n`;
    });
  }

  if (resume.certifications && resume.certifications.length > 0) {
    md += `\n## Certifications\n`;
    resume.certifications.forEach(cert => {
      md += `- ${cert}\n`;
    });
  }

  if (resume.languages && resume.languages.length > 0) {
    md += `\n## Languages\n`;
    resume.languages.forEach(lang => {
      md += `- ${lang}\n`;
    });
  }

  return md;
};

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

  // Resume Customizer States
  const [accentColor, setAccentColor] = useState<'indigo' | 'emerald' | 'slate' | 'amber' | 'rose'>('indigo');
  const [fontPair, setFontPair] = useState<'outfit' | 'poppins' | 'sans'>('outfit');
  const [layoutStyle, setLayoutStyle] = useState<'split' | 'single'>('split');

  // Edit Mode States
  const [isEditMode, setIsEditMode] = useState(false);
  const [editData, setEditData] = useState<ResumeData | null>(null);

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
        setEditData(null);
        setIsEditMode(false);
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

  // Edit mode handlers
  const handleEditClick = () => {
    if (data && !isEditMode) {
      setEditData(JSON.parse(JSON.stringify(data)));
      setIsEditMode(true);
    }
  };

  const handleSaveEdits = () => {
    if (editData) {
      setData(editData);
      setIsEditMode(false);
      setEditData(null);
    }
  };

  const handleCancelEdits = () => {
    setIsEditMode(false);
    setEditData(null);
  };

  const updateEditData = (newData: ResumeData) => {
    setEditData(newData);
  };

  const handleCopy = () => {
    if (!data) return;
    const text = activeTab === 'resume' 
      ? formatResumeToMarkdown(data.tailoredResume) 
      : activeTab === 'letter' 
        ? data.coverLetter 
        : data.analysis.keyImprovements;
        
    if (text) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleExportPDF = async () => {
    if (!data) return;
    
    setIsExporting(true);
    
    // We target the dynamic resume-pdf-container inside the preview area
    const element = document.getElementById('resume-pdf-container');
    if (!element) {
      setError('PDF container not found.');
      setIsExporting(false);
      return;
    }

    try {
      const html2pdf = (await import('html2pdf.js')).default;
      
      const candidateName = data.tailoredResume.contact.name || 'Tailored';
      const fileName = activeTab === 'resume' 
        ? `${candidateName.replace(/\s+/g, '_')}_Resume.pdf` 
        : activeTab === 'letter' 
          ? `${candidateName.replace(/\s+/g, '_')}_Cover_Letter.pdf` 
          : 'Job_Fit_Analysis.pdf';

      const opt = {
        margin:       0,
        filename:     fileName,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { 
          scale: 2.5, // Crisp retina-quality rendering
          useCORS: true, 
          logging: false,
          letterRendering: true,
          scrollX: 0,
          scrollY: 0
        },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak:    { mode: ['css', 'legacy'] }
      };

      await html2pdf().from(element).set(opt).save();
    } catch (err) {
      console.error('PDF Export Error:', err);
      setError('Failed to generate PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const currentTheme = COLOR_THEMES[accentColor];
  const currentFonts = FONT_PAIRS[fontPair];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans selection:bg-indigo-100">
      {/* Header */}
      <header className="border-b border-[#1A1A1A]/5 bg-white/80 backdrop-blur-md sticky top-0 z-20 px-6 py-4 print:hidden">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-indigo-600/10">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-slate-900 leading-none">ResumeArchitect</h1>
              <span className="text-[10px] font-semibold text-slate-400 tracking-wider uppercase">Beta Studio</span>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-5 text-xs font-semibold uppercase tracking-widest text-slate-400">
            <span>Precision Architecture</span>
            <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></span>
            <span>ATS Optimized</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 md:p-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Inputs (Cols 1-5) */}
          <section className="lg:col-span-5 space-y-6 print:hidden">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 leading-tight">
                Architect your <span className="text-indigo-600">career assets.</span>
              </h2>
              <p className="text-slate-500 text-sm leading-relaxed">
                Upload your raw experience data, paste your target job requirements, and let the AI system draft a clean, professional application package.
              </p>
            </div>

            <div className="space-y-6 bg-white p-6 rounded-3xl border border-slate-100 shadow-xl shadow-slate-100/40">
              {/* Resume Input */}
              <div className="space-y-3 group">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 transition-colors group-focus-within:text-indigo-600">
                    <User className="w-4 h-4 text-slate-400 group-focus-within:text-indigo-600" />
                    Current Experience (Raw CV / Resume)
                  </label>
                  <label className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-indigo-600 hover:text-indigo-700 cursor-pointer transition-colors bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100 ${isExtracting ? 'opacity-50 cursor-not-allowed' : ''}`}>
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
                  className="w-full min-h-[250px] p-4 bg-slate-50/50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600 transition-all outline-none resize-none shadow-inner text-sm leading-relaxed"
                  value={currentResume}
                  onChange={(e) => setCurrentResume(e.target.value)}
                />
              </div>

              {/* Job description Input */}
              <div className="space-y-3 group">
                <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 transition-colors group-focus-within:text-indigo-600">
                  <Target className="w-4 h-4 text-slate-400 group-focus-within:text-indigo-600" />
                  Target Specifications (Job Description)
                </label>
                <textarea
                  placeholder="Paste the job requirements and description here..."
                  className="w-full min-h-[200px] p-4 bg-slate-50/50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600 transition-all outline-none resize-none shadow-inner text-sm leading-relaxed"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                />
              </div>

              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-600 text-sm"
                >
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span className="leading-tight font-medium">{error}</span>
                </motion.div>
              )}

              <button
                onClick={handleTailor}
                disabled={isGenerating}
                className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold tracking-wide flex items-center justify-center gap-2.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] shadow-lg shadow-indigo-600/20 group relative overflow-hidden"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Processing Architecture...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-5 h-5 group-hover:rotate-12 transition-transform text-indigo-200" />
                    <span>Architect Application Package</span>
                  </>
                )}
              </button>
            </div>
          </section>

          {/* Right Column: Output Preview (Cols 6-12) */}
          <section className="lg:col-span-7 space-y-6">
            <AnimatePresence mode="wait">
              {!data && !isGenerating ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="aspect-[3/4] bg-white border border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center p-12 text-center text-slate-400 space-y-5 shadow-sm"
                >
                  <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100">
                    <FileText className="w-10 h-10 text-slate-300" />
                  </div>
                  <div className="space-y-1.5 max-w-sm">
                    <p className="font-bold text-slate-700 text-lg">Asset Drafting Studio</p>
                    <p className="text-sm leading-relaxed text-slate-400">Fill in the current resume and job description details on the left, then click tailor to preview and export here.</p>
                  </div>
                </motion.div>
              ) : isGenerating ? (
                <motion.div
                  key="generating"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="aspect-[3/4] bg-white border border-slate-100 rounded-3xl p-12 space-y-8 overflow-hidden relative shadow-xl shadow-slate-100/30"
                >
                  <div className="space-y-6">
                    <div className="w-2/3 h-8 bg-slate-50 rounded-lg animate-pulse" />
                    <div className="space-y-3">
                      <div className="w-full h-4 bg-slate-50 rounded-lg animate-pulse" />
                      <div className="w-full h-4 bg-slate-50 rounded-lg animate-pulse" />
                      <div className="w-[90%] h-4 bg-slate-50 rounded-lg animate-pulse" />
                    </div>
                    <div className="w-full h-48 bg-slate-50 rounded-2xl animate-pulse" />
                  </div>
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-white via-white/50 to-transparent flex flex-col items-center justify-center backdrop-blur-[2px]">
                    <div className="flex flex-col items-center gap-6">
                      <div className="relative">
                        <div className="absolute inset-0 bg-indigo-600/10 blur-2xl rounded-full scale-150 animate-pulse" />
                        <div className="w-16 h-16 border-4 border-slate-100 border-t-indigo-600 rounded-full animate-spin relative" />
                      </div>
                      <div className="text-center space-y-1.5">
                        <p className="text-lg font-bold tracking-tight text-slate-800">Analyzing Skill Matrices</p>
                        <p className="text-xs text-indigo-600 font-bold uppercase tracking-widest">Applying STAR Methodology</p>
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
                  <div className="flex p-1.5 bg-slate-100 rounded-2xl print:hidden border border-slate-200/50">
                    {[
                      { id: 'resume', label: 'Tailored Resume', icon: FileText },
                      { id: 'letter', label: 'Cover Letter', icon: Mail },
                      { id: 'analysis', label: 'Job Fit Report', icon: BarChart3 }
                    ].map((tab) => {
                      const Icon = tab.icon;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id as any)}
                          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${
                            activeTab === tab.id 
                              ? 'bg-white text-slate-800 shadow-sm border border-slate-200/20' 
                              : 'text-slate-400 hover:text-slate-600'
                          }`}
                        >
                          <Icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-indigo-600' : ''}`} />
                          {tab.label}
                        </button>
                      );
                    })}
                  </div>

                  {/* Template Customizer Panel (Only visible on Resume & Letter Tabs) */}
                  {activeTab !== 'analysis' && (
                    <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-4 print:hidden">
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        {/* Colors */}
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                            <Palette className="w-3.5 h-3.5" />
                            Color Theme
                          </span>
                          <div className="flex gap-2">
                            {Object.entries(COLOR_THEMES).map(([key, theme]) => (
                              <button
                                key={key}
                                onClick={() => setAccentColor(key as any)}
                                title={theme.name}
                                className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                                  accentColor === key 
                                    ? 'ring-2 ring-indigo-600 ring-offset-2 scale-110' 
                                    : 'hover:scale-105'
                                }`}
                                style={{ backgroundColor: theme.hex }}
                              >
                                {accentColor === key && (
                                  <div className="w-1.5 h-1.5 bg-white rounded-full" />
                                )}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Fonts */}
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                            <Type className="w-3.5 h-3.5" />
                            Typography
                          </span>
                          <div className="flex p-0.5 bg-slate-50 border border-slate-200/50 rounded-lg">
                            {Object.entries(FONT_PAIRS).map(([key, font]) => (
                              <button
                                key={key}
                                onClick={() => setFontPair(key as any)}
                                className={`px-2.5 py-1 text-[11px] font-bold rounded-md transition-all ${
                                  fontPair === key 
                                    ? 'bg-white text-slate-800 shadow-sm border border-slate-200/20' 
                                    : 'text-slate-400 hover:text-slate-600'
                                }`}
                              >
                                {font.name.split(' ')[0]}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Layout Mode (Only for Resume) */}
                        {activeTab === 'resume' && (
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                              <Layout className="w-3.5 h-3.5" />
                              Layout Style
                            </span>
                            <div className="flex p-0.5 bg-slate-50 border border-slate-200/50 rounded-lg">
                              {[
                                { id: 'split', label: 'Split (2-Col)' },
                                { id: 'single', label: 'Classic (1-Col)' }
                              ].map((layout) => (
                                <button
                                  key={layout.id}
                                  onClick={() => setLayoutStyle(layout.id as any)}
                                  className={`px-2.5 py-1 text-[11px] font-bold rounded-md transition-all ${
                                    layoutStyle === layout.id 
                                      ? 'bg-white text-slate-800 shadow-sm border border-slate-200/20' 
                                      : 'text-slate-400 hover:text-slate-600'
                                  }`}
                                >
                                  {layout.label}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Actions Area */}
                  <div className="flex items-center justify-between print:hidden">
                    <div className="flex items-center gap-3">
                      {activeTab !== 'analysis' && (
                        <div className="flex items-center gap-2 px-3 py-1 bg-indigo-50 border border-indigo-100 text-indigo-700 rounded-full">
                          <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
                          <span className="text-[10px] font-bold uppercase tracking-wider">ATS Friendly</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 font-display">
                      {isEditMode ? (
                        <>
                          <button
                            onClick={handleSaveEdits}
                            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-all shadow-sm flex items-center gap-2 text-xs font-semibold"
                          >
                            <Check className="w-4 h-4" />
                            Save Changes
                          </button>
                          <button
                            onClick={handleCancelEdits}
                            className="px-4 py-2.5 bg-white border border-slate-200 text-slate-600 hover:text-slate-800 rounded-xl transition-all shadow-sm flex items-center gap-2 text-xs font-semibold"
                          >
                            <X className="w-4 h-4" />
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={handleEditClick}
                            className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl hover:border-slate-300 transition-all text-slate-600 hover:text-slate-800 shadow-sm flex items-center gap-2 text-xs font-semibold"
                          >
                            <Edit className="w-4 h-4" />
                            Edit
                          </button>
                          <button
                            onClick={handleCopy}
                            className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl hover:border-slate-300 transition-all text-slate-600 hover:text-slate-800 shadow-sm flex items-center gap-2 text-xs font-semibold"
                          >
                            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                            {copied ? 'Copied' : 'Copy Content'}
                          </button>
                          <button
                            onClick={handleExportPDF}
                            disabled={isExporting}
                            className="px-4 py-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all shadow-md flex items-center gap-2 text-xs font-semibold disabled:opacity-50"
                          >
                            {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                            {isExporting ? 'Exporting...' : 'PDF Export'}
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* A4 Paper Sheet Wrapper */}
                  <div className="w-full overflow-x-auto p-4 flex justify-center bg-slate-100 rounded-3xl border border-slate-200/50 shadow-inner print:bg-white print:p-0 print:border-none print:shadow-none">
                    
                    {isEditMode && editData && activeTab === 'resume' ? (
                      /* EDIT MODE - Editable Form */
                      <div className="w-full max-w-4xl bg-white rounded-xl p-8 space-y-8 overflow-y-auto max-h-[900px]">
                        {/* Contact Information */}
                        <div className="space-y-4 border-b pb-6">
                          <h3 className="text-lg font-bold text-slate-900">Contact Information</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-semibold text-slate-700 mb-1">Full Name</label>
                              <input
                                type="text"
                                value={editData.tailoredResume.contact.name}
                                onChange={(e) => updateEditData({
                                  ...editData,
                                  tailoredResume: {
                                    ...editData.tailoredResume,
                                    contact: { ...editData.tailoredResume.contact, name: e.target.value }
                                  }
                                })}
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-600/5 focus:border-indigo-600 outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-slate-700 mb-1">Professional Title</label>
                              <input
                                type="text"
                                value={editData.tailoredResume.contact.title}
                                onChange={(e) => updateEditData({
                                  ...editData,
                                  tailoredResume: {
                                    ...editData.tailoredResume,
                                    contact: { ...editData.tailoredResume.contact, title: e.target.value }
                                  }
                                })}
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-600/5 focus:border-indigo-600 outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-slate-700 mb-1">Email</label>
                              <input
                                type="email"
                                value={editData.tailoredResume.contact.email}
                                onChange={(e) => updateEditData({
                                  ...editData,
                                  tailoredResume: {
                                    ...editData.tailoredResume,
                                    contact: { ...editData.tailoredResume.contact, email: e.target.value }
                                  }
                                })}
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-600/5 focus:border-indigo-600 outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-slate-700 mb-1">Phone</label>
                              <input
                                type="tel"
                                value={editData.tailoredResume.contact.phone}
                                onChange={(e) => updateEditData({
                                  ...editData,
                                  tailoredResume: {
                                    ...editData.tailoredResume,
                                    contact: { ...editData.tailoredResume.contact, phone: e.target.value }
                                  }
                                })}
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-600/5 focus:border-indigo-600 outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-slate-700 mb-1">Location</label>
                              <input
                                type="text"
                                value={editData.tailoredResume.contact.location}
                                onChange={(e) => updateEditData({
                                  ...editData,
                                  tailoredResume: {
                                    ...editData.tailoredResume,
                                    contact: { ...editData.tailoredResume.contact, location: e.target.value }
                                  }
                                })}
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-600/5 focus:border-indigo-600 outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-slate-700 mb-1">Website (Optional)</label>
                              <input
                                type="text"
                                value={editData.tailoredResume.contact.website || ''}
                                onChange={(e) => updateEditData({
                                  ...editData,
                                  tailoredResume: {
                                    ...editData.tailoredResume,
                                    contact: { ...editData.tailoredResume.contact, website: e.target.value }
                                  }
                                })}
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-600/5 focus:border-indigo-600 outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-slate-700 mb-1">LinkedIn (Optional)</label>
                              <input
                                type="text"
                                value={editData.tailoredResume.contact.linkedin || ''}
                                onChange={(e) => updateEditData({
                                  ...editData,
                                  tailoredResume: {
                                    ...editData.tailoredResume,
                                    contact: { ...editData.tailoredResume.contact, linkedin: e.target.value }
                                  }
                                })}
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-600/5 focus:border-indigo-600 outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-slate-700 mb-1">GitHub (Optional)</label>
                              <input
                                type="text"
                                value={editData.tailoredResume.contact.github || ''}
                                onChange={(e) => updateEditData({
                                  ...editData,
                                  tailoredResume: {
                                    ...editData.tailoredResume,
                                    contact: { ...editData.tailoredResume.contact, github: e.target.value }
                                  }
                                })}
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-600/5 focus:border-indigo-600 outline-none"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Professional Summary */}
                        <div className="space-y-4 border-b pb-6">
                          <h3 className="text-lg font-bold text-slate-900">Professional Summary</h3>
                          <textarea
                            value={editData.tailoredResume.summary}
                            onChange={(e) => updateEditData({
                              ...editData,
                              tailoredResume: {
                                ...editData.tailoredResume,
                                summary: e.target.value
                              }
                            })}
                            rows={4}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-600/5 focus:border-indigo-600 outline-none resize-vertical"
                          />
                        </div>

                        {/* Work Experience */}
                        <div className="space-y-4 border-b pb-6">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold text-slate-900">Work Experience</h3>
                            <button
                              onClick={() => {
                                const newExp: WorkExperience = {
                                  role: 'Job Title',
                                  company: 'Company Name',
                                  location: 'City, Country',
                                  period: 'Start - End',
                                  description: ['Achievement 1', 'Achievement 2']
                                };
                                updateEditData({
                                  ...editData,
                                  tailoredResume: {
                                    ...editData.tailoredResume,
                                    experience: [...editData.tailoredResume.experience, newExp]
                                  }
                                });
                              }}
                              className="flex items-center gap-1 px-3 py-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-lg text-xs font-semibold transition-colors"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              Add Experience
                            </button>
                          </div>
                          <div className="space-y-6">
                            {editData.tailoredResume.experience.map((exp, idx) => (
                              <div key={idx} className="p-4 border border-slate-200 rounded-lg space-y-3">
                                <div className="flex items-center justify-between">
                                  <div className="flex-1 grid grid-cols-2 gap-3">
                                    <div>
                                      <label className="block text-xs font-semibold text-slate-600 mb-1">Job Title</label>
                                      <input
                                        type="text"
                                        value={exp.role}
                                        onChange={(e) => {
                                          const updated = [...editData.tailoredResume.experience];
                                          updated[idx].role = e.target.value;
                                          updateEditData({
                                            ...editData,
                                            tailoredResume: { ...editData.tailoredResume, experience: updated }
                                          });
                                        }}
                                        className="w-full px-2 py-1.5 border border-slate-200 rounded text-sm focus:ring-2 focus:ring-indigo-600/5 focus:border-indigo-600 outline-none"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-xs font-semibold text-slate-600 mb-1">Company</label>
                                      <input
                                        type="text"
                                        value={exp.company}
                                        onChange={(e) => {
                                          const updated = [...editData.tailoredResume.experience];
                                          updated[idx].company = e.target.value;
                                          updateEditData({
                                            ...editData,
                                            tailoredResume: { ...editData.tailoredResume, experience: updated }
                                          });
                                        }}
                                        className="w-full px-2 py-1.5 border border-slate-200 rounded text-sm focus:ring-2 focus:ring-indigo-600/5 focus:border-indigo-600 outline-none"
                                      />
                                    </div>
                                  </div>
                                  <button
                                    onClick={() => {
                                      const updated = editData.tailoredResume.experience.filter((_, i) => i !== idx);
                                      updateEditData({
                                        ...editData,
                                        tailoredResume: { ...editData.tailoredResume, experience: updated }
                                      });
                                    }}
                                    className="ml-2 p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                  <div>
                                    <label className="block text-xs font-semibold text-slate-600 mb-1">Period</label>
                                    <input
                                      type="text"
                                      value={exp.period}
                                      onChange={(e) => {
                                        const updated = [...editData.tailoredResume.experience];
                                        updated[idx].period = e.target.value;
                                        updateEditData({
                                          ...editData,
                                          tailoredResume: { ...editData.tailoredResume, experience: updated }
                                        });
                                      }}
                                      placeholder="Jan 2020 - Dec 2022"
                                      className="w-full px-2 py-1.5 border border-slate-200 rounded text-sm focus:ring-2 focus:ring-indigo-600/5 focus:border-indigo-600 outline-none"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs font-semibold text-slate-600 mb-1">Location</label>
                                    <input
                                      type="text"
                                      value={exp.location || ''}
                                      onChange={(e) => {
                                        const updated = [...editData.tailoredResume.experience];
                                        updated[idx].location = e.target.value;
                                        updateEditData({
                                          ...editData,
                                          tailoredResume: { ...editData.tailoredResume, experience: updated }
                                        });
                                      }}
                                      className="w-full px-2 py-1.5 border border-slate-200 rounded text-sm focus:ring-2 focus:ring-indigo-600/5 focus:border-indigo-600 outline-none"
                                    />
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <label className="block text-xs font-semibold text-slate-600">Achievements</label>
                                  {exp.description.map((desc, dIdx) => (
                                    <div key={dIdx} className="flex gap-2">
                                      <input
                                        type="text"
                                        value={desc}
                                        onChange={(e) => {
                                          const updated = [...editData.tailoredResume.experience];
                                          updated[idx].description[dIdx] = e.target.value;
                                          updateEditData({
                                            ...editData,
                                            tailoredResume: { ...editData.tailoredResume, experience: updated }
                                          });
                                        }}
                                        className="flex-1 px-2 py-1.5 border border-slate-200 rounded text-sm focus:ring-2 focus:ring-indigo-600/5 focus:border-indigo-600 outline-none"
                                      />
                                      <button
                                        onClick={() => {
                                          const updated = [...editData.tailoredResume.experience];
                                          updated[idx].description.splice(dIdx, 1);
                                          updateEditData({
                                            ...editData,
                                            tailoredResume: { ...editData.tailoredResume, experience: updated }
                                          });
                                        }}
                                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                      >
                                        <X className="w-4 h-4" />
                                      </button>
                                    </div>
                                  ))}
                                  <button
                                    onClick={() => {
                                      const updated = [...editData.tailoredResume.experience];
                                      updated[idx].description.push('New achievement');
                                      updateEditData({
                                        ...editData,
                                        tailoredResume: { ...editData.tailoredResume, experience: updated }
                                      });
                                    }}
                                    className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold flex items-center gap-1"
                                  >
                                    <Plus className="w-3 h-3" /> Add Achievement
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Education */}
                        <div className="space-y-4 border-b pb-6">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold text-slate-900">Education</h3>
                            <button
                              onClick={() => {
                                const newEdu: Education = {
                                  degree: 'Degree Name',
                                  institution: 'University Name',
                                  location: 'City, Country',
                                  period: 'Graduation Year'
                                };
                                updateEditData({
                                  ...editData,
                                  tailoredResume: {
                                    ...editData.tailoredResume,
                                    education: [...editData.tailoredResume.education, newEdu]
                                  }
                                });
                              }}
                              className="flex items-center gap-1 px-3 py-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-lg text-xs font-semibold transition-colors"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              Add Education
                            </button>
                          </div>
                          <div className="space-y-4">
                            {editData.tailoredResume.education.map((edu, idx) => (
                              <div key={idx} className="p-4 border border-slate-200 rounded-lg space-y-3">
                                <div className="flex items-start justify-between gap-3">
                                  <div className="flex-1 space-y-3">
                                    <div>
                                      <label className="block text-xs font-semibold text-slate-600 mb-1">Degree</label>
                                      <input
                                        type="text"
                                        value={edu.degree}
                                        onChange={(e) => {
                                          const updated = [...editData.tailoredResume.education];
                                          updated[idx].degree = e.target.value;
                                          updateEditData({
                                            ...editData,
                                            tailoredResume: { ...editData.tailoredResume, education: updated }
                                          });
                                        }}
                                        className="w-full px-2 py-1.5 border border-slate-200 rounded text-sm focus:ring-2 focus:ring-indigo-600/5 focus:border-indigo-600 outline-none"
                                      />
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                      <div>
                                        <label className="block text-xs font-semibold text-slate-600 mb-1">Institution</label>
                                        <input
                                          type="text"
                                          value={edu.institution}
                                          onChange={(e) => {
                                            const updated = [...editData.tailoredResume.education];
                                            updated[idx].institution = e.target.value;
                                            updateEditData({
                                              ...editData,
                                              tailoredResume: { ...editData.tailoredResume, education: updated }
                                            });
                                          }}
                                          className="w-full px-2 py-1.5 border border-slate-200 rounded text-sm focus:ring-2 focus:ring-indigo-600/5 focus:border-indigo-600 outline-none"
                                        />
                                      </div>
                                      <div>
                                        <label className="block text-xs font-semibold text-slate-600 mb-1">Period</label>
                                        <input
                                          type="text"
                                          value={edu.period}
                                          onChange={(e) => {
                                            const updated = [...editData.tailoredResume.education];
                                            updated[idx].period = e.target.value;
                                            updateEditData({
                                              ...editData,
                                              tailoredResume: { ...editData.tailoredResume, education: updated }
                                            });
                                          }}
                                          placeholder="2020 - 2024"
                                          className="w-full px-2 py-1.5 border border-slate-200 rounded text-sm focus:ring-2 focus:ring-indigo-600/5 focus:border-indigo-600 outline-none"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                  <button
                                    onClick={() => {
                                      const updated = editData.tailoredResume.education.filter((_, i) => i !== idx);
                                      updateEditData({
                                        ...editData,
                                        tailoredResume: { ...editData.tailoredResume, education: updated }
                                      });
                                    }}
                                    className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Skills */}
                        <div className="space-y-4 border-b pb-6">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold text-slate-900">Skills</h3>
                            <button
                              onClick={() => {
                                const newSkill: SkillCategory = {
                                  category: 'New Category',
                                  items: ['Skill 1', 'Skill 2']
                                };
                                updateEditData({
                                  ...editData,
                                  tailoredResume: {
                                    ...editData.tailoredResume,
                                    skills: [...editData.tailoredResume.skills, newSkill]
                                  }
                                });
                              }}
                              className="flex items-center gap-1 px-3 py-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-lg text-xs font-semibold transition-colors"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              Add Category
                            </button>
                          </div>
                          <div className="space-y-4">
                            {editData.tailoredResume.skills.map((skill, idx) => (
                              <div key={idx} className="p-4 border border-slate-200 rounded-lg space-y-3">
                                <div className="flex items-start justify-between gap-3">
                                  <div className="flex-1">
                                    <label className="block text-xs font-semibold text-slate-600 mb-1">Category</label>
                                    <input
                                      type="text"
                                      value={skill.category}
                                      onChange={(e) => {
                                        const updated = [...editData.tailoredResume.skills];
                                        updated[idx].category = e.target.value;
                                        updateEditData({
                                          ...editData,
                                          tailoredResume: { ...editData.tailoredResume, skills: updated }
                                        });
                                      }}
                                      className="w-full px-2 py-1.5 border border-slate-200 rounded text-sm focus:ring-2 focus:ring-indigo-600/5 focus:border-indigo-600 outline-none"
                                    />
                                  </div>
                                  <button
                                    onClick={() => {
                                      const updated = editData.tailoredResume.skills.filter((_, i) => i !== idx);
                                      updateEditData({
                                        ...editData,
                                        tailoredResume: { ...editData.tailoredResume, skills: updated }
                                      });
                                    }}
                                    className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors mt-6"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                                <div className="space-y-2">
                                  <label className="block text-xs font-semibold text-slate-600">Skills</label>
                                  {skill.items.map((item, itemIdx) => (
                                    <div key={itemIdx} className="flex gap-2">
                                      <input
                                        type="text"
                                        value={item}
                                        onChange={(e) => {
                                          const updated = [...editData.tailoredResume.skills];
                                          updated[idx].items[itemIdx] = e.target.value;
                                          updateEditData({
                                            ...editData,
                                            tailoredResume: { ...editData.tailoredResume, skills: updated }
                                          });
                                        }}
                                        className="flex-1 px-2 py-1.5 border border-slate-200 rounded text-sm focus:ring-2 focus:ring-indigo-600/5 focus:border-indigo-600 outline-none"
                                      />
                                      <button
                                        onClick={() => {
                                          const updated = [...editData.tailoredResume.skills];
                                          updated[idx].items.splice(itemIdx, 1);
                                          updateEditData({
                                            ...editData,
                                            tailoredResume: { ...editData.tailoredResume, skills: updated }
                                          });
                                        }}
                                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                      >
                                        <X className="w-4 h-4" />
                                      </button>
                                    </div>
                                  ))}
                                  <button
                                    onClick={() => {
                                      const updated = [...editData.tailoredResume.skills];
                                      updated[idx].items.push('New skill');
                                      updateEditData({
                                        ...editData,
                                        tailoredResume: { ...editData.tailoredResume, skills: updated }
                                      });
                                    }}
                                    className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold flex items-center gap-1"
                                  >
                                    <Plus className="w-3 h-3" /> Add Skill
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div 
                        id="resume-pdf-container"
                        className={`bg-white text-slate-800 shadow-2xl relative print:shadow-none print:p-0 print:border-none ${currentFonts.bodyClass}`}
                        style={{
                          width: '210mm',
                          minHeight: '297mm',
                          boxSizing: 'border-box',
                          fontFamily: currentFonts.bodyFamily
                        }}
                      >
                        {activeTab === 'resume' ? (
                          /* RESUME TEMPLATES */
                          layoutStyle === 'split' ? (
                            /* TWO COLUMN SPLIT LAYOUT */
                            <div className="flex w-full min-h-[297mm]">
                            
                            {/* Left Column (Sidebar) - 34% width */}
                            <div 
                              className="w-[34%] p-7 flex flex-col gap-6 border-r border-slate-100"
                              style={{ backgroundColor: currentTheme.sidebarBg }}
                            >
                              {/* Contact Information Group */}
                              <div className="space-y-4 break-inside-avoid">
                                <h3 className={`text-xs font-bold uppercase tracking-wider pb-1.5 border-b`} style={{ color: currentTheme.primary, borderColor: `${currentTheme.primary}20` }}>
                                  Contact
                                </h3>
                                <ul className="space-y-2.5 text-[11px] text-slate-600">
                                  <li className="flex items-center gap-2 hover:text-slate-800 transition-colors">
                                    <Mail className="w-3.5 h-3.5 shrink-0" style={{ color: currentTheme.primary }} />
                                    <span className="truncate">{data.tailoredResume.contact.email}</span>
                                  </li>
                                  <li className="flex items-center gap-2 hover:text-slate-800 transition-colors">
                                    <Phone className="w-3.5 h-3.5 shrink-0" style={{ color: currentTheme.primary }} />
                                    <span>{data.tailoredResume.contact.phone}</span>
                                  </li>
                                  <li className="flex items-center gap-2 hover:text-slate-800 transition-colors">
                                    <MapPin className="w-3.5 h-3.5 shrink-0" style={{ color: currentTheme.primary }} />
                                    <span>{data.tailoredResume.contact.location}</span>
                                  </li>
                                  {data.tailoredResume.contact.website && (
                                    <li className="flex items-center gap-2 hover:text-slate-800 transition-colors">
                                      <Globe className="w-3.5 h-3.5 shrink-0" style={{ color: currentTheme.primary }} />
                                      <span className="truncate">{data.tailoredResume.contact.website}</span>
                                    </li>
                                  )}
                                  {data.tailoredResume.contact.linkedin && (
                                    <li className="flex items-center gap-2 hover:text-slate-800 transition-colors">
                                      <Linkedin className="w-3.5 h-3.5 shrink-0" style={{ color: currentTheme.primary }} />
                                      <span className="truncate">{data.tailoredResume.contact.linkedin}</span>
                                    </li>
                                  )}
                                  {data.tailoredResume.contact.github && (
                                    <li className="flex items-center gap-2 hover:text-slate-800 transition-colors">
                                      <Github className="w-3.5 h-3.5 shrink-0" style={{ color: currentTheme.primary }} />
                                      <span className="truncate">{data.tailoredResume.contact.github}</span>
                                    </li>
                                  )}
                                </ul>
                              </div>

                              {/* Skills Section */}
                              <div className="space-y-4 break-inside-avoid">
                                <h3 className={`text-xs font-bold uppercase tracking-wider pb-1.5 border-b`} style={{ color: currentTheme.primary, borderColor: `${currentTheme.primary}20` }}>
                                  Core Expertise
                                </h3>
                                <div className="space-y-3">
                                  {data.tailoredResume.skills.map((cat, i) => (
                                    <div key={i} className="space-y-1">
                                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                                        {cat.category}
                                      </p>
                                      <div className="flex flex-wrap gap-1">
                                        {cat.items.map((item, idx) => (
                                          <span 
                                            key={idx} 
                                            className="px-2 py-0.5 rounded text-[10px] font-medium border text-slate-700 bg-white"
                                            style={{ borderColor: `${currentTheme.primary}10` }}
                                          >
                                            {item}
                                          </span>
                                        ))}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Education Section */}
                              <div className="space-y-4 break-inside-avoid">
                                <h3 className={`text-xs font-bold uppercase tracking-wider pb-1.5 border-b`} style={{ color: currentTheme.primary, borderColor: `${currentTheme.primary}20` }}>
                                  Education
                                </h3>
                                <div className="space-y-3">
                                  {data.tailoredResume.education.map((edu, i) => (
                                    <div key={i} className="space-y-0.5 text-[11px]">
                                      <p className="font-bold text-slate-800 leading-tight">{edu.degree}</p>
                                      <p className="text-slate-600 leading-tight">{edu.institution}</p>
                                      <p className="text-[10px] text-slate-400 italic">{edu.period} {edu.location ? `| ${edu.location}` : ''}</p>
                                      {edu.details && <p className="text-[10px] text-slate-500 mt-1 leading-snug">{edu.details}</p>}
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Certifications if available */}
                              {data.tailoredResume.certifications && data.tailoredResume.certifications.length > 0 && (
                                <div className="space-y-4 break-inside-avoid">
                                  <h3 className={`text-xs font-bold uppercase tracking-wider pb-1.5 border-b`} style={{ color: currentTheme.primary, borderColor: `${currentTheme.primary}20` }}>
                                    Credentials
                                  </h3>
                                  <ul className="space-y-1.5 text-[11px] text-slate-600">
                                    {data.tailoredResume.certifications.map((cert, i) => (
                                      <li key={i} className="flex gap-1.5 items-start">
                                        <Award className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                                        <span className="leading-snug">{cert}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              {/* Languages if available */}
                              {data.tailoredResume.languages && data.tailoredResume.languages.length > 0 && (
                                <div className="space-y-4 break-inside-avoid">
                                  <h3 className={`text-xs font-bold uppercase tracking-wider pb-1.5 border-b`} style={{ color: currentTheme.primary, borderColor: `${currentTheme.primary}20` }}>
                                    Languages
                                  </h3>
                                  <ul className="space-y-1.5 text-[11px] text-slate-600">
                                    {data.tailoredResume.languages.map((lang, i) => (
                                      <li key={i} className="flex gap-1.5 items-center">
                                        <Languages className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                        <span>{lang}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              {/* References if available */}
                              {data.tailoredResume.references && data.tailoredResume.references.length > 0 && (
                                <div className="space-y-4 break-inside-avoid">
                                  <h3 className={`text-xs font-bold uppercase tracking-wider pb-1.5 border-b`} style={{ color: currentTheme.primary, borderColor: `${currentTheme.primary}20` }}>
                                    References
                                  </h3>
                                  <div className="space-y-3">
                                    {data.tailoredResume.references.map((ref, i) => (
                                      <div key={i} className="space-y-0.5 text-[11px]">
                                        <p className="font-bold text-slate-800 leading-tight">{ref.name}</p>
                                        {ref.title && <p className="text-slate-600 leading-tight">{ref.title}</p>}
                                        {ref.company && <p className="text-[10px] text-slate-500 leading-tight">{ref.company}</p>}
                                        {ref.relationship && (
                                          <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-bold uppercase border mt-0.5"
                                            style={{ color: currentTheme.primary, borderColor: `${currentTheme.primary}20`, backgroundColor: `${currentTheme.primary}05` }}>
                                            {ref.relationship}
                                          </span>
                                        )}
                                        {ref.email && <p className="text-[10px] text-slate-400 mt-0.5">{ref.email}</p>}
                                        {ref.phone && <p className="text-[10px] text-slate-400">{ref.phone}</p>}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Right Column (Main content area) - 66% width */}
                            <div className="w-[66%] p-8 flex flex-col gap-6">
                              {/* Header Title */}
                              <div className="space-y-1 border-b pb-4">
                                <h2 className={`text-3xl font-bold tracking-tight text-slate-900 ${currentFonts.headerClass}`} style={{ fontFamily: currentFonts.headerFamily }}>
                                  {data.tailoredResume.contact.name}
                                </h2>
                                <p className="text-sm font-semibold tracking-wider uppercase" style={{ color: currentTheme.primary }}>
                                  {data.tailoredResume.contact.title}
                                </p>
                              </div>

                              {/* Professional Summary */}
                              <div className="space-y-2.5 break-inside-avoid">
                                <h3 className={`text-xs font-bold uppercase tracking-wider`} style={{ color: currentTheme.primary }}>
                                  Professional Summary
                                </h3>
                                <p className="text-[12px] text-slate-600 leading-relaxed font-normal">
                                  {data.tailoredResume.summary}
                                </p>
                              </div>

                              {/* Work Experience */}
                              <div className="space-y-4">
                                <h3 className={`text-xs font-bold uppercase tracking-wider border-b pb-1`} style={{ color: currentTheme.primary, borderColor: `${currentTheme.primary}10` }}>
                                  Work History
                                </h3>
                                <div className="space-y-4">
                                  {data.tailoredResume.experience.map((exp, i) => (
                                    <div key={i} className="space-y-1.5 break-inside-avoid">
                                      <div className="flex justify-between items-baseline">
                                        <h4 className="text-[12px] font-bold text-slate-800">{exp.role}</h4>
                                        <span className="text-[10px] font-bold text-slate-400">{exp.period}</span>
                                      </div>
                                      <div className="flex justify-between items-baseline text-[10.5px] text-slate-500 italic">
                                        <span>{exp.company}</span>
                                        <span>{exp.location}</span>
                                      </div>
                                      <ul className="list-disc pl-4 space-y-1">
                                        {exp.description.map((pt, idx) => (
                                          <li key={idx} className="text-[11px] text-slate-600 leading-relaxed pl-0.5">
                                            {pt}
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Key Projects */}
                              {data.tailoredResume.projects && data.tailoredResume.projects.length > 0 && (
                                <div className="space-y-4">
                                  <h3 className={`text-xs font-bold uppercase tracking-wider border-b pb-1`} style={{ color: currentTheme.primary, borderColor: `${currentTheme.primary}10` }}>
                                    Projects
                                  </h3>
                                  <div className="space-y-4">
                                    {data.tailoredResume.projects.map((proj, i) => (
                                      <div key={i} className="space-y-1.5 break-inside-avoid">
                                        <div className="flex justify-between items-baseline">
                                          <h4 className="text-[12px] font-bold text-slate-800">{proj.name}</h4>
                                          {proj.link && (
                                            <span className="text-[10px] text-slate-400 hover:underline">{proj.link}</span>
                                          )}
                                        </div>
                                        <div className="flex flex-wrap gap-1">
                                          {proj.technologies.map((tech, idx) => (
                                            <span 
                                              key={idx} 
                                              className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-slate-50 text-slate-500 border border-slate-100"
                                            >
                                              {tech}
                                            </span>
                                          ))}
                                        </div>
                                        <p className="text-[11px] text-slate-600 leading-relaxed">
                                          {proj.description}
                                        </p>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                            </div>
                          </div>
                        ) : (
                          /* SINGLE COLUMN LAYOUT (Top-Down Classic) */
                          <div className="p-10 flex flex-col gap-6">
                            {/* Center-Aligned Header */}
                            <div className="text-center space-y-2 border-b pb-5">
                              <h2 className={`text-3xl font-bold tracking-tight text-slate-900 ${currentFonts.headerClass}`} style={{ fontFamily: currentFonts.headerFamily }}>
                                {data.tailoredResume.contact.name}
                              </h2>
                              <p className="text-sm font-bold tracking-widest uppercase" style={{ color: currentTheme.primary }}>
                                {data.tailoredResume.contact.title}
                              </p>
                              
                              {/* Contact Grid */}
                              <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[11px] text-slate-500 font-medium">
                                <span className="flex items-center gap-1">
                                  <Mail className="w-3.5 h-3.5" style={{ color: currentTheme.primary }} />
                                  {data.tailoredResume.contact.email}
                                </span>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                  <Phone className="w-3.5 h-3.5" style={{ color: currentTheme.primary }} />
                                  {data.tailoredResume.contact.phone}
                                </span>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-3.5 h-3.5" style={{ color: currentTheme.primary }} />
                                  {data.tailoredResume.contact.location}
                                </span>
                                {data.tailoredResume.contact.website && (
                                  <>
                                    <span>•</span>
                                    <span className="flex items-center gap-1">
                                      <Globe className="w-3.5 h-3.5" style={{ color: currentTheme.primary }} />
                                      {data.tailoredResume.contact.website}
                                    </span>
                                  </>
                                )}
                              </div>
                              
                              <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[11px] text-slate-500 font-medium">
                                {data.tailoredResume.contact.linkedin && (
                                  <span className="flex items-center gap-1">
                                    <Linkedin className="w-3.5 h-3.5" style={{ color: currentTheme.primary }} />
                                    {data.tailoredResume.contact.linkedin}
                                  </span>
                                )}
                                {data.tailoredResume.contact.linkedin && data.tailoredResume.contact.github && <span>•</span>}
                                {data.tailoredResume.contact.github && (
                                  <span className="flex items-center gap-1">
                                    <Github className="w-3.5 h-3.5" style={{ color: currentTheme.primary }} />
                                    {data.tailoredResume.contact.github}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Summary */}
                            <div className="space-y-2 break-inside-avoid">
                              <h3 className="text-xs font-bold uppercase tracking-wider border-b pb-1" style={{ color: currentTheme.primary }}>
                                Professional Profile
                              </h3>
                              <p className="text-[12px] text-slate-600 leading-relaxed font-normal">
                                {data.tailoredResume.summary}
                              </p>
                            </div>

                            {/* Skills Grid */}
                            <div className="space-y-3 break-inside-avoid">
                              <h3 className="text-xs font-bold uppercase tracking-wider border-b pb-1" style={{ color: currentTheme.primary }}>
                                Technical Expertise
                              </h3>
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {data.tailoredResume.skills.map((cat, i) => (
                                  <div key={i} className="space-y-1 text-[11px]">
                                    <p className="font-bold text-slate-700 leading-tight uppercase tracking-wider text-[10px]">
                                      {cat.category}
                                    </p>
                                    <p className="text-slate-500 leading-relaxed">
                                      {cat.items.join(', ')}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Experience */}
                            <div className="space-y-4">
                              <h3 className="text-xs font-bold uppercase tracking-wider border-b pb-1" style={{ color: currentTheme.primary }}>
                                Professional Experience
                              </h3>
                              <div className="space-y-4">
                                {data.tailoredResume.experience.map((exp, i) => (
                                  <div key={i} className="space-y-1 break-inside-avoid">
                                    <div className="flex justify-between items-baseline">
                                      <div className="flex gap-2 items-baseline">
                                        <h4 className="text-[12px] font-bold text-slate-800">{exp.role}</h4>
                                        <span className="text-[11px] text-slate-400 font-medium">| {exp.company}</span>
                                      </div>
                                      <span className="text-[10px] font-bold text-slate-400">{exp.period}</span>
                                    </div>
                                    <p className="text-[10px] text-slate-400 font-medium italic mb-1.5">{exp.location}</p>
                                    <ul className="list-disc pl-4 space-y-1">
                                      {exp.description.map((pt, idx) => (
                                        <li key={idx} className="text-[11px] text-slate-600 leading-relaxed pl-0.5">
                                          {pt}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Projects */}
                            {data.tailoredResume.projects && data.tailoredResume.projects.length > 0 && (
                              <div className="space-y-4">
                                <h3 className="text-xs font-bold uppercase tracking-wider border-b pb-1" style={{ color: currentTheme.primary }}>
                                  Key Projects
                                </h3>
                                <div className="space-y-4">
                                  {data.tailoredResume.projects.map((proj, i) => (
                                    <div key={i} className="space-y-1.5 break-inside-avoid">
                                      <div className="flex justify-between items-baseline">
                                        <h4 className="text-[12px] font-bold text-slate-800">{proj.name}</h4>
                                        {proj.link && (
                                          <span className="text-[10px] text-slate-400 hover:underline">{proj.link}</span>
                                        )}
                                      </div>
                                      <div className="flex flex-wrap gap-1">
                                        {proj.technologies.map((tech, idx) => (
                                          <span 
                                            key={idx} 
                                            className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-slate-50 text-slate-500 border border-slate-100"
                                          >
                                            {tech}
                                          </span>
                                        ))}
                                      </div>
                                      <p className="text-[11px] text-slate-600 leading-relaxed">
                                        {proj.description}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Education, Certifications, Languages in 3 cols */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2 border-t border-slate-100">
                              {/* Education */}
                              <div className="space-y-2.5 break-inside-avoid">
                                <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 pb-0.5 border-b border-slate-100">
                                  Education
                                </h3>
                                {data.tailoredResume.education.map((edu, i) => (
                                  <div key={i} className="text-[11px]">
                                    <p className="font-bold text-slate-700 leading-tight">{edu.degree}</p>
                                    <p className="text-slate-600 leading-none mt-0.5">{edu.institution}</p>
                                    <p className="text-[9.5px] text-slate-400 mt-0.5">{edu.period}</p>
                                  </div>
                                ))}
                              </div>
                              
                              {/* Certifications */}
                              {data.tailoredResume.certifications && data.tailoredResume.certifications.length > 0 && (
                                <div className="space-y-2.5 break-inside-avoid">
                                  <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 pb-0.5 border-b border-slate-100">
                                    Certifications
                                  </h3>
                                  <ul className="space-y-1 text-[11px] text-slate-600">
                                    {data.tailoredResume.certifications?.map((cert, i) => (
                                      <li key={i} className="truncate">• {cert}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              {/* Languages */}
                              {data.tailoredResume.languages && data.tailoredResume.languages.length > 0 && (
                                <div className="space-y-2.5 break-inside-avoid">
                                  <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 pb-0.5 border-b border-slate-100">
                                    Languages
                                  </h3>
                                  <ul className="space-y-1 text-[11px] text-slate-600">
                                    {data.tailoredResume.languages?.map((lang, i) => (
                                      <li key={i}>• {lang}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>

                            {/* References Section (single column) */}
                            {data.tailoredResume.references && data.tailoredResume.references.length > 0 && (
                              <div className="space-y-4 pt-2 border-t border-slate-100 break-inside-avoid">
                                <h3 className="text-xs font-bold uppercase tracking-wider border-b pb-1" style={{ color: currentTheme.primary }}>
                                  References
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  {data.tailoredResume.references.map((ref, i) => (
                                    <div key={i} className="space-y-0.5 text-[11px] p-3 rounded-xl border border-slate-100 bg-slate-50/50">
                                      <p className="font-bold text-slate-800 leading-tight">{ref.name}</p>
                                      {ref.title && <p className="text-slate-600 leading-tight">{ref.title}</p>}
                                      {ref.company && <p className="text-[10px] text-slate-500">{ref.company}</p>}
                                      {ref.relationship && (
                                        <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-bold uppercase border mt-0.5"
                                          style={{ color: currentTheme.primary, borderColor: `${currentTheme.primary}20`, backgroundColor: `${currentTheme.primary}05` }}>
                                          {ref.relationship}
                                        </span>
                                      )}
                                      <div className="pt-0.5 space-y-0.5">
                                        {ref.email && <p className="text-[10px] text-slate-400">{ref.email}</p>}
                                        {ref.phone && <p className="text-[10px] text-slate-400">{ref.phone}</p>}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )
                      ) : activeTab === 'letter' ? (
                        /* COVER LETTER LETTERHEAD TEMPLATE */
                        <div className="p-12 flex flex-col gap-8 min-h-[297mm]">
                          
                          {/* Header block (Matches Resume branding) */}
                          <div className="flex justify-between items-start border-b pb-6">
                            <div>
                              <h2 className={`text-3xl font-bold tracking-tight text-slate-900 ${currentFonts.headerClass}`} style={{ fontFamily: currentFonts.headerFamily }}>
                                {data.tailoredResume.contact.name}
                              </h2>
                              <p className="text-sm font-bold tracking-widest uppercase" style={{ color: currentTheme.primary }}>
                                {data.tailoredResume.contact.title}
                              </p>
                            </div>
                            <div className="text-right text-[11px] text-slate-500 space-y-1">
                              <p>{data.tailoredResume.contact.email}</p>
                              <p>{data.tailoredResume.contact.phone}</p>
                              <p>{data.tailoredResume.contact.location}</p>
                            </div>
                          </div>

                          {/* Letter Meta Details */}
                          <div className="space-y-1 text-[12px] text-slate-500 mt-2">
                            <p className="font-semibold text-slate-800">
                              {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                            </p>
                          </div>

                          {/* Cover Letter Content Body */}
                          <div className="text-[12.5px] text-slate-700 leading-relaxed space-y-4 max-w-2xl mt-4">
                            {data.coverLetter.split('\n\n').map((paragraph, idx) => (
                              <p key={idx} className="font-normal">
                                {paragraph}
                              </p>
                            ))}
                          </div>

                          {/* Sign-off */}
                          <div className="mt-8 space-y-4 text-[12.5px] text-slate-600">
                            <p>Sincerely,</p>
                            <div>
                              <p className="font-bold text-slate-800">{data.tailoredResume.contact.name}</p>
                              <p className="text-[11px] text-slate-400">{data.tailoredResume.contact.title}</p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        /* JOB FIT REPORT TEMPLATE */
                        <div className="p-12 flex flex-col gap-8 min-h-[297mm]">
                          
                          {/* Header block */}
                          <div className="flex justify-between items-center border-b pb-5">
                            <div>
                              <h2 className="text-2xl font-bold text-slate-900 font-display">
                                Job Fit Analysis Report
                              </h2>
                              <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold mt-1">
                                Aligning {data.tailoredResume.contact.name} with Target Role
                              </p>
                            </div>
                            <div className="relative w-20 h-20 flex items-center justify-center">
                              <svg className="w-full h-full transform -rotate-90">
                                <circle
                                  cx="40" cy="40" r="32"
                                  stroke="currentColor" strokeWidth="6"
                                  fill="transparent" className="text-slate-100"
                                />
                                <circle
                                  cx="40" cy="40" r="32"
                                  stroke="currentColor" strokeWidth="6"
                                  fill="transparent" style={{ color: currentTheme.primary }}
                                  strokeDasharray={201}
                                  strokeDashoffset={201 - (201 * data.analysis.matchScore) / 100}
                                  strokeLinecap="round"
                                />
                              </svg>
                              <span className="absolute text-sm font-bold text-slate-800">{data.analysis.matchScore}%</span>
                            </div>
                          </div>

                          <div className="space-y-6">
                            
                            {/* Match Score Explanation */}
                            <div className="space-y-2">
                              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                Compatibility Score Summary
                              </h3>
                              <p className="text-[12.5px] text-slate-600 leading-relaxed">
                                The tailoring engine reports a compatibility of <strong className="text-slate-800">{data.analysis.matchScore}%</strong>. The tailored resume on the previous page has been re-architected to highlights these connections.
                              </p>
                            </div>

                            {/* Keywords Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                              <div className="space-y-3">
                                <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 uppercase tracking-wider">
                                  <CheckCircle2 className="w-4 h-4" /> Matched Keywords
                                </div>
                                <div className="flex flex-wrap gap-1.5">
                                  {data.analysis.matchedKeywords.map((kw, i) => (
                                    <span 
                                      key={i} 
                                      className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-[10.5px] font-bold border border-emerald-100"
                                    >
                                      {kw}
                                    </span>
                                  ))}
                                </div>
                              </div>
                              <div className="space-y-3">
                                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider" style={{ color: currentTheme.primary }}>
                                  <AlertCircle className="w-4 h-4" /> Missing Key Factors
                                </div>
                                <div className="flex flex-wrap gap-1.5">
                                  {data.analysis.missingKeywords.map((kw, i) => (
                                    <span 
                                      key={i} 
                                      className="px-2.5 py-1 rounded-lg text-[10.5px] font-bold border"
                                      style={{ 
                                        backgroundColor: `${currentTheme.primary}05`, 
                                        color: currentTheme.primary,
                                        borderColor: `${currentTheme.primary}15`
                                      }}
                                    >
                                      {kw}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>

                            {/* Architect Strategy */}
                            <div className="p-6 bg-slate-50 border border-slate-100 rounded-2xl space-y-3 mt-4 break-inside-avoid">
                              <h4 className="text-xs font-bold uppercase tracking-widest flex items-center gap-2 text-slate-700">
                                <Sparkles className="w-4 h-4 text-indigo-600" /> 
                                Tailoring Strategy & Guidance
                              </h4>
                              <p className="text-[12.5px] text-slate-600 leading-relaxed italic">
                                "{data.analysis.keyImprovements}"
                              </p>
                            </div>

                          </div>
                        </div>
                      )}
                    </div>
                    )}

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
          <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></span>
          <span>Zero Data Retention</span>
          <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></span>
          <span>Open Standards</span>
        </div>
      </footer>

      <style>{`
        .break-inside-avoid {
          break-inside: avoid !important;
          page-break-inside: avoid !important;
          -webkit-column-break-inside: avoid !important;
        }

        /* Print adjustments for exact color and formatting preservation */
        @media print {
          body {
            background: white !important;
            color: #0f172a !important;
            font-size: 11pt !important;
          }
          header, section:first-of-type, .print\\:hidden, button, .customizer-panel {
            display: none !important;
          }
          #resume-pdf-container {
            width: 210mm !important;
            min-height: 297mm !important;
            box-shadow: none !important;
            border: none !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}</style>
    </div>
  );
}
