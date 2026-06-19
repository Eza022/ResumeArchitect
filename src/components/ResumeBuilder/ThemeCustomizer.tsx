import React from 'react';
import { Palette, Type, Layout } from 'lucide-react';
import { COLOR_THEMES, FONT_PAIRS } from '../../constants/theme';

interface ThemeCustomizerProps {
  currentTheme: any;
  accentColor: string;
  setAccentColor: (val: any) => void;
  fontPair: string;
  setFontPair: (val: any) => void;
  layoutStyle: string;
  setLayoutStyle: (val: any) => void;
}

export const ThemeCustomizer: React.FC<ThemeCustomizerProps> = ({
  currentTheme,
  accentColor,
  setAccentColor,
  fontPair,
  setFontPair,
  layoutStyle,
  setLayoutStyle
}) => {
  return (
    <div className="mb-6 bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex flex-wrap gap-6 items-center customizer-panel">
      {/* Accent Color Picker */}
      <div className="flex items-center gap-3">
        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Palette className="w-3.5 h-3.5" /> Accent Color
        </label>
        <div className="flex items-center gap-1.5 bg-slate-50 p-1 rounded-xl border border-slate-100">
          {(Object.entries(COLOR_THEMES) as [any, any][]).map(([key, theme]) => (
            <button
              key={key}
              onClick={() => setAccentColor(key)}
              title={theme.name}
              className={`w-7 h-7 rounded-lg transition-all ${accentColor === key ? 'scale-110 ring-2 ring-offset-2 ring-slate-300 shadow-sm' : 'hover:scale-105'}`}
              style={{ backgroundColor: theme.hex }}
            />
          ))}
        </div>
      </div>

      {/* Typography Picker */}
      <div className="flex items-center gap-3 border-l border-slate-100 pl-6">
        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Type className="w-3.5 h-3.5" /> Typography
        </label>
        <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-100">
          {(Object.entries(FONT_PAIRS) as [any, any][]).map(([key, font]) => (
            <button
              key={key}
              onClick={() => setFontPair(key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                fontPair === key 
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200/60' 
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100/50 border border-transparent'
              }`}
            >
              {font.name}
            </button>
          ))}
        </div>
      </div>

      {/* Layout Picker */}
      <div className="flex items-center gap-3 border-l border-slate-100 pl-6">
        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Layout className="w-3.5 h-3.5" /> Layout
        </label>
        <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-100">
          {[
            { id: 'split', name: 'Split Column' },
            { id: 'single', name: 'Classic Flow' }
          ].map((layout) => (
            <button
              key={layout.id}
              onClick={() => setLayoutStyle(layout.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                layoutStyle === layout.id 
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200/60' 
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100/50 border border-transparent'
              }`}
            >
              {layout.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
