const fs = require('fs');

const path = 'src/components/ResumeBuilder.tsx';
const content = fs.readFileSync(path, 'utf8');

const lines = content.split('\n');

// Find the line index where `<section className="lg:col-span-7 space-y-6">` starts
let rightColStartIndex = lines.findIndex(line => line.includes('{/* Right Column: Output Preview (Cols 6-12) */}'));
if (rightColStartIndex === -1) {
    rightColStartIndex = lines.findIndex(line => line.includes('<section className="lg:col-span-7 space-y-6">'));
}

if (rightColStartIndex === -1) {
    console.error("Could not find right column start.");
    process.exit(1);
}

// Find the end of the right column section. It ends before `</div>` and `</main>`
let rightColEndIndex = lines.findIndex((line, idx) => idx > rightColStartIndex && line.trim() === '</div>' && lines[idx+1].trim() === '</main>');

if (rightColEndIndex === -1) {
    console.error("Could not find right column end.");
    process.exit(1);
}

const previewPanelLines = lines.slice(rightColStartIndex, rightColEndIndex);

const previewPanelCode = `import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText, Briefcase, Wand2, Copy, Check, Download, 
  AlertCircle, Loader2, Sparkles, User, Target, 
  Mail, BarChart3, ChevronRight, Hash, XCircle, CheckCircle2, Upload,
  MapPin, Phone, Globe, Linkedin, Github, Award, Languages, Palette, Layout, Type,
  Edit, Save, X, Plus, Trash2
} from 'lucide-react';
import { ResumeData, WorkExperience, Education, SkillCategory } from '../../types/resume';
import { COLOR_THEMES, FONT_PAIRS } from '../../constants/theme';
import { formatResumeToMarkdown } from '../../utils/formatters';

interface PreviewPanelProps {
  data: ResumeData | null;
  isGenerating: boolean;
  activeTab: 'resume' | 'letter' | 'analysis';
  setActiveTab: (val: 'resume' | 'letter' | 'analysis') => void;
  currentTheme: any;
  accentColor: string;
  setAccentColor: (val: any) => void;
  fontPair: string;
  setFontPair: (val: any) => void;
  layoutStyle: string;
  setLayoutStyle: (val: any) => void;
  isEditMode: boolean;
  setIsEditMode: (val: boolean) => void;
  editData: ResumeData | null;
  setEditData: (val: ResumeData | null) => void;
  handleSaveEdits: () => void;
  handleCancelEdits: () => void;
  handleEditClick: () => void;
  handleCopy: () => void;
  copied: boolean;
  handleExportPDF: () => void;
  isExporting: boolean;
  updateEditData: (newData: ResumeData) => void;
}

export const PreviewPanel: React.FC<PreviewPanelProps> = ({
  data,
  isGenerating,
  activeTab,
  setActiveTab,
  currentTheme,
  accentColor,
  setAccentColor,
  fontPair,
  setFontPair,
  layoutStyle,
  setLayoutStyle,
  isEditMode,
  setIsEditMode,
  editData,
  setEditData,
  handleSaveEdits,
  handleCancelEdits,
  handleEditClick,
  handleCopy,
  copied,
  handleExportPDF,
  isExporting,
  updateEditData
}) => {
  const currentFonts = FONT_PAIRS[fontPair as keyof typeof FONT_PAIRS];
  return (
    <>
${previewPanelLines.join('\n')}
    </>
  );
};
`;

fs.writeFileSync('src/components/ResumeBuilder/PreviewPanel.tsx', previewPanelCode);

const newResumeBuilderTop = `import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { ResumeData } from '../types/resume';
import { COLOR_THEMES, FONT_PAIRS } from '../constants/theme';
import { formatResumeToMarkdown } from '../utils/formatters';
import { useResumeApi } from '../hooks/useResumeApi';
import { useResumeExport } from '../hooks/useResumeExport';
import { BuilderForm } from './ResumeBuilder/BuilderForm';
import { PreviewPanel } from './ResumeBuilder/PreviewPanel';

export default function ResumeBuilder() {
  const {
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
  } = useResumeApi();

  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'resume' | 'letter' | 'analysis'>('resume');

  // Resume Customizer States
  const [accentColor, setAccentColor] = useState<'indigo' | 'emerald' | 'slate' | 'amber' | 'rose'>('slate');
  const [fontPair, setFontPair] = useState<'outfit' | 'poppins' | 'sans'>('outfit');
  const [layoutStyle, setLayoutStyle] = useState<'split' | 'single'>('split');

  // Edit Mode States
  const [isEditMode, setIsEditMode] = useState(false);
  const [editData, setEditData] = useState<ResumeData | null>(null);

  const currentTheme = COLOR_THEMES[accentColor as keyof typeof COLOR_THEMES];

  const { isExporting, handleExportPDF } = useResumeExport(
    data,
    activeTab,
    currentTheme,
    fontPair,
    layoutStyle,
    setError
  );

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

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans selection:bg-slate-150">
      {/* Header */}
      <header className="border-b border-[#1A1A1A]/5 bg-white/80 backdrop-blur-md sticky top-0 z-20 px-6 py-4 print:hidden">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-md shadow-slate-900/10">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-slate-900 leading-none">ResumeArchitect</h1>
              <span className="text-[10px] font-semibold text-slate-400 tracking-wider uppercase">Beta Studio</span>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-5 text-xs font-semibold uppercase tracking-widest text-slate-400">
            <span>Precision Architecture</span>
            <span className="w-1.5 h-1.5 bg-slate-950 rounded-full animate-pulse"></span>
            <span>ATS Optimized</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 md:p-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          <BuilderForm
            currentTheme={currentTheme}
            currentResume={currentResume}
            setCurrentResume={setCurrentResume}
            jobDescription={jobDescription}
            setJobDescription={setJobDescription}
            isExtracting={isExtracting}
            handleFileUpload={handleFileUpload}
            error={error}
            isGenerating={isGenerating}
            handleTailor={handleTailor}
          />
          
          <PreviewPanel
            data={data}
            isGenerating={isGenerating}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            currentTheme={currentTheme}
            accentColor={accentColor}
            setAccentColor={setAccentColor}
            fontPair={fontPair}
            setFontPair={setFontPair}
            layoutStyle={layoutStyle}
            setLayoutStyle={setLayoutStyle}
            isEditMode={isEditMode}
            setIsEditMode={setIsEditMode}
            editData={editData}
            setEditData={setEditData}
            handleSaveEdits={handleSaveEdits}
            handleCancelEdits={handleCancelEdits}
            handleEditClick={handleEditClick}
            handleCopy={handleCopy}
            copied={copied}
            handleExportPDF={handleExportPDF}
            isExporting={isExporting}
            updateEditData={updateEditData}
          />
`;

const bottomLines = lines.slice(rightColEndIndex);
const newResumeBuilderContent = newResumeBuilderTop + '\n' + bottomLines.join('\n');

fs.writeFileSync('src/components/ResumeBuilder.tsx', newResumeBuilderContent);
console.log("Refactoring complete.");
