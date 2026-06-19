import React from 'react';
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
          {/* Right Column: Output Preview (Cols 6-12) */}
          <section className="lg:col-span-7 space-y-6">
            <AnimatePresence mode="wait">
              {!data && !isGenerating ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="aspect-[3/4] bg-white border border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center p-6 sm:p-12 text-center text-slate-400 space-y-5 shadow-sm"
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
                  className="aspect-[3/4] bg-white border border-slate-100 rounded-3xl p-6 sm:p-12 space-y-8 overflow-hidden relative shadow-xl shadow-slate-100/30"
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
                      { id: 'resume', label: 'Tailored Resume', shortLabel: 'Resume', icon: FileText },
                      { id: 'letter', label: 'Cover Letter', shortLabel: 'Letter', icon: Mail },
                      { id: 'analysis', label: 'Job Fit Report', shortLabel: 'Fit', icon: BarChart3 }
                    ].map((tab) => {
                      const Icon = tab.icon;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id as any)}
                          className={`flex-1 flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                            activeTab === tab.id 
                              ? 'bg-white text-slate-800 shadow-sm border border-slate-200/20' 
                              : 'text-slate-400 hover:text-slate-600'
                          }`}
                        >
                          <Icon className={`w-4 h-4 shrink-0 ${activeTab === tab.id ? currentTheme.primaryText : ''}`} />
                          <span className="hidden sm:inline">{tab.label}</span>
                          <span className="sm:hidden">{tab.shortLabel}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Template Customizer Panel (Only visible on Resume & Letter Tabs) */}
                  {activeTab !== 'analysis' && (
                    <div className="bg-white border border-slate-100 rounded-2xl p-4 sm:p-5 shadow-sm space-y-3 print:hidden">
                      <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center sm:justify-between gap-3">
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
                                    ? 'ring-2 ring-slate-900 ring-offset-2 scale-110' 
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
                  <div className="flex flex-wrap items-center justify-between gap-2 print:hidden">
                    <div className="flex items-center gap-3">
                      {activeTab !== 'analysis' && (
                        <div className={`flex items-center gap-2 px-3 py-1 border rounded-full ${currentTheme.lightBg} ${currentTheme.primaryText} border-slate-200/40`}>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span className="text-[10px] font-bold uppercase tracking-wider">ATS Friendly</span>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-2 font-display">
                      {isEditMode ? (
                        <>
                          <button
                            onClick={handleSaveEdits}
                            className="px-3 sm:px-4 py-2 sm:py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-all shadow-sm flex items-center gap-1.5 text-xs font-semibold"
                          >
                            <Check className="w-4 h-4" />
                            <span className="hidden sm:inline">Save Changes</span>
                            <span className="sm:hidden">Save</span>
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
                            className="px-3 sm:px-4 py-2 sm:py-2.5 bg-white border border-slate-200 rounded-xl hover:border-slate-300 transition-all text-slate-600 hover:text-slate-800 shadow-sm flex items-center gap-1.5 text-xs font-semibold"
                          >
                            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                            <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
                          </button>
                          <button
                            onClick={handleExportPDF}
                            disabled={isExporting}
                            className="px-3 sm:px-4 py-2 sm:py-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all shadow-md flex items-center gap-1.5 text-xs font-semibold disabled:opacity-50"
                          >
                            {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                            <span className="hidden sm:inline">{isExporting ? 'Exporting...' : 'Export PDF'}</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* A4 Paper Sheet Wrapper */}
                  <div className="w-full overflow-x-auto p-2 sm:p-4 flex justify-center bg-slate-100 rounded-3xl border border-slate-200/50 shadow-inner print:bg-white print:p-0 print:border-none print:shadow-none">
                    
                    {isEditMode && editData && activeTab === 'resume' ? (
                      /* EDIT MODE - Editable Form */
                      <div className="w-full max-w-4xl bg-white rounded-xl p-4 sm:p-8 space-y-6 sm:space-y-8 overflow-y-auto max-h-[900px]">
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
                                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                            
                            {/* Left Column (Sidebar) - Solid sidebar view block */}
                            <div 
                              className="w-[184px] p-7 flex flex-col gap-6 border-r border-slate-100 shrink-0"
                              style={{ backgroundColor: currentTheme.sidebarBg }}
                            >
                              {/* Contact Information Group */}
                              <div className="space-y-4 break-inside-avoid">
                                <h3 className="text-xs font-bold uppercase tracking-wider pb-1.5 border-b" style={{ color: currentTheme.primary, borderColor: `${currentTheme.primary}20` }}>
                                  Contact
                                </h3>
                                <ul className="space-y-2.5 text-[11px] text-slate-600">
                                  <li className="flex items-center gap-2 hover:text-slate-800 transition-colors">
                                    <Mail className="w-3.5 h-3.5 shrink-0" style={{ color: currentTheme.primary }} />
                                    <span className="truncate max-w-[120px]">{data.tailoredResume.contact.email}</span>
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
                                      <span className="truncate max-w-[120px]">{data.tailoredResume.contact.website}</span>
                                    </li>
                                  )}
                                  {data.tailoredResume.contact.linkedin && (
                                    <li className="flex items-center gap-2 hover:text-slate-800 transition-colors">
                                      <Linkedin className="w-3.5 h-3.5 shrink-0" style={{ color: currentTheme.primary }} />
                                      <span className="truncate max-w-[120px]">{data.tailoredResume.contact.linkedin}</span>
                                    </li>
                                  )}
                                  {data.tailoredResume.contact.github && (
                                    <li className="flex items-center gap-2 hover:text-slate-800 transition-colors">
                                      <Github className="w-3.5 h-3.5 shrink-0" style={{ color: currentTheme.primary }} />
                                      <span className="truncate max-w-[120px]">{data.tailoredResume.contact.github}</span>
                                    </li>
                                  )}
                                </ul>
                              </div>

                              {/* Skills Section */}
                              <div className="space-y-4 break-inside-avoid">
                                <h3 className="text-xs font-bold uppercase tracking-wider pb-1.5 border-b" style={{ color: currentTheme.primary, borderColor: `${currentTheme.primary}20` }}>
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
                                <h3 className="text-xs font-bold uppercase tracking-wider pb-1.5 border-b" style={{ color: currentTheme.primary, borderColor: `${currentTheme.primary}20` }}>
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
                                  <h3 className="text-xs font-bold uppercase tracking-wider pb-1.5 border-b" style={{ color: currentTheme.primary, borderColor: `${currentTheme.primary}20` }}>
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
                                  <h3 className="text-xs font-bold uppercase tracking-wider pb-1.5 border-b" style={{ color: currentTheme.primary, borderColor: `${currentTheme.primary}20` }}>
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
                            </div>

                            {/* Right Column (Main content area) */}
                            <div className="flex-1 p-8 flex flex-col gap-6">
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
                                <h3 className="text-xs font-bold uppercase tracking-wider pl-2 border-l-2" style={{ color: currentTheme.primary, borderColor: currentTheme.primary }}>
                                  Professional Summary
                                </h3>
                                <p className="text-[12px] text-slate-600 leading-relaxed font-normal">
                                  {data.tailoredResume.summary}
                                </p>
                              </div>

                              {/* Work Experience */}
                              <div className="space-y-4">
                                <h3 className="text-xs font-bold uppercase tracking-wider pl-2 border-l-2" style={{ color: currentTheme.primary, borderColor: currentTheme.primary }}>
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
                                  <h3 className="text-xs font-bold uppercase tracking-wider pl-2 border-l-2" style={{ color: currentTheme.primary, borderColor: currentTheme.primary }}>
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
                              
                              <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[11px] text-slate-500 font-medium font-display">
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
                              <h3 className="text-xs font-bold uppercase tracking-wider pl-2 border-l-2" style={{ color: currentTheme.primary, borderColor: currentTheme.primary }}>
                                Professional Profile
                              </h3>
                              <p className="text-[12px] text-slate-600 leading-relaxed font-normal">
                                {data.tailoredResume.summary}
                              </p>
                            </div>

                            {/* Skills Grid */}
                            <div className="space-y-3 break-inside-avoid">
                              <h3 className="text-xs font-bold uppercase tracking-wider pl-2 border-l-2" style={{ color: currentTheme.primary, borderColor: currentTheme.primary }}>
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
                              <h3 className="text-xs font-bold uppercase tracking-wider pl-2 border-l-2" style={{ color: currentTheme.primary, borderColor: currentTheme.primary }}>
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
                                <h3 className="text-xs font-bold uppercase tracking-wider pl-2 border-l-2" style={{ color: currentTheme.primary, borderColor: currentTheme.primary }}>
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
                                <h3 className="text-xs font-bold uppercase tracking-wider pl-2 border-l-2" style={{ color: currentTheme.primary, borderColor: currentTheme.primary }}>
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
                        <div className="p-12 flex flex-col gap-8 min-h-[297mm] w-full">
                          
                          {/* Header block (Matches Resume branding) */}
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 border-b pb-6">
                            <div>
                              <h2 className={`text-3xl font-bold tracking-tight text-slate-900 ${currentFonts.headerClass}`} style={{ fontFamily: currentFonts.headerFamily }}>
                                {data.tailoredResume.contact.name}
                              </h2>
                              <p className="text-sm font-bold tracking-widest uppercase" style={{ color: currentTheme.primary }}>
                                {data.tailoredResume.contact.title}
                              </p>
                            </div>
                            <div className="sm:text-right text-[11px] text-slate-500 space-y-1 font-sans">
                              <p>{data.tailoredResume.contact.email}</p>
                              <p>{data.tailoredResume.contact.phone}</p>
                              <p>{data.tailoredResume.contact.location}</p>
                            </div>
                          </div>

                          {/* Letter Meta Details */}
                          <div className="space-y-1 text-[12px] text-slate-500 mt-2 font-sans">
                            <p className="font-semibold text-slate-800">
                              {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                            </p>
                          </div>

                          {/* Cover Letter Content Body */}
                          <div className="text-[12.5px] text-slate-700 leading-relaxed space-y-4 max-w-2xl mt-4 font-sans">
                            {data.coverLetter.split('\n\n').map((paragraph, idx) => (
                              <p key={idx} className="font-normal">
                                {paragraph}
                              </p>
                            ))}
                          </div>

                          {/* Sign-off */}
                          <div className="mt-8 space-y-4 text-[12.5px] text-slate-600 font-sans">
                            <p>Sincerely,</p>
                            <div>
                              <p className="font-bold text-slate-800">{data.tailoredResume.contact.name}</p>
                              <p className="text-[11px] text-slate-400">{data.tailoredResume.contact.title}</p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        /* JOB FIT REPORT TEMPLATE */
                        <div className="p-12 flex flex-col gap-8 min-h-[297mm] w-full font-sans">
                          
                          {/* Header block */}
                          <div className="flex flex-wrap justify-between items-center gap-3 border-b pb-5">
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
    </>
  );
};
