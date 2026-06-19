import React from 'react';
import { User, Target, Upload, Loader2, AlertCircle } from 'lucide-react';

interface BuilderFormProps {
  currentTheme: any;
  currentResume: string;
  setCurrentResume: (val: string) => void;
  jobDescription: string;
  setJobDescription: (val: string) => void;
  isExtracting: boolean;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error: string | null;
  isGenerating: boolean;
  handleTailor: (onSuccess?: () => void) => void;
}

export const BuilderForm: React.FC<BuilderFormProps> = ({
  currentTheme,
  currentResume,
  setCurrentResume,
  jobDescription,
  setJobDescription,
  isExtracting,
  handleFileUpload,
  error,
  isGenerating,
  handleTailor
}) => {
  return (
    <section className="lg:col-span-5 space-y-5 sm:space-y-6 print:hidden">
      <div className="space-y-2">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 leading-tight">
          Architect your <span className={currentTheme.primaryText}>career assets.</span>
        </h2>
        <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
          Upload your raw experience data, paste your target job requirements, and let the AI system draft a clean, professional application package.
        </p>
      </div>

      <div className="space-y-6 bg-white p-6 rounded-3xl border border-slate-100 shadow-xl shadow-slate-100/40">
        <div className="space-y-3 group">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 transition-colors group-focus-within:text-slate-800">
              <User className="w-4 h-4 text-slate-400 group-focus-within:text-slate-800" />
              Current Experience (Raw CV / Resume)
            </label>
            <label className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider ${currentTheme.primaryText} hover:opacity-85 cursor-pointer transition-colors ${currentTheme.lightBg} px-2.5 py-1 rounded-lg border border-slate-100 ${isExtracting ? 'opacity-50 cursor-not-allowed' : ''}`}>
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
            className="w-full min-h-[250px] p-4 bg-slate-50/50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-slate-900/5 focus:border-slate-800 transition-all outline-none resize-none shadow-inner text-sm leading-relaxed"
            value={currentResume}
            onChange={(e) => setCurrentResume(e.target.value)}
          />
        </div>

        <div className="space-y-3 group">
          <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 transition-colors group-focus-within:text-slate-800">
            <Target className="w-4 h-4 text-slate-400 group-focus-within:text-[#0F172A]" />
            Target Specifications (Job Description)
          </label>
          <textarea
            placeholder="Paste the job requirements and description here..."
            className="w-full min-h-[200px] p-4 bg-slate-50/50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-slate-900/5 focus:border-slate-800 transition-all outline-none resize-none shadow-inner text-sm leading-relaxed"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          />
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-700 rounded-xl text-sm border border-red-100 flex items-start gap-3 shadow-inner">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="leading-relaxed">{error}</p>
          </div>
        )}

        <button
          onClick={() => handleTailor()}
          disabled={isGenerating || !currentResume || !jobDescription}
          className={`w-full py-4 px-6 rounded-xl text-white font-bold transition-all flex items-center justify-center gap-3 shadow-xl ${
            isGenerating || !currentResume || !jobDescription 
            ? 'bg-slate-300 shadow-none cursor-not-allowed' 
            : `${currentTheme.primaryBg} hover:opacity-90 hover:scale-[1.02] hover:shadow-${currentTheme.primaryBg}/30`
          }`}
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Generating Architecture...
            </>
          ) : (
            'Generate Application Package'
          )}
        </button>
      </div>
    </section>
  );
};
