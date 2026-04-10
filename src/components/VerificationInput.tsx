import React from 'react';
import { Search, ArrowRightLeft, ShieldCheck, Loader2, Zap, AlertCircle } from 'lucide-react';
import { cn } from '../core/utils';

interface VerificationInputProps {
  inputText: string;
  setInputText: (text: string) => void;
  compareText: string;
  setCompareText: (text: string) => void;
  isCompareMode: boolean;
  setIsCompareMode: (mode: boolean) => void;
  analyzing: boolean;
  handleFullAnalyze: () => void;
  error: string | null;
}

export const VerificationInput: React.FC<VerificationInputProps> = ({
  inputText,
  setInputText,
  compareText,
  setCompareText,
  isCompareMode,
  setIsCompareMode,
  analyzing,
  handleFullAnalyze,
  error
}) => {
  return (
    <section className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
      <div className="absolute top-0 right-0 p-8 opacity-5">
        <ShieldCheck className="w-32 h-32" />
      </div>
      <div className="relative">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Search className="w-6 h-6 text-indigo-600" /> Verify News or URL
          </h2>
          <button 
            onClick={() => setIsCompareMode(!isCompareMode)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all",
              isCompareMode ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            )}
          >
            <ArrowRightLeft className="w-4 h-4" />
            {isCompareMode ? "Exit Comparison" : "Compare Mode"}
          </button>
        </div>
        
        <div className={cn("grid gap-6", isCompareMode ? "md:grid-cols-2" : "grid-cols-1")}>
          <div className="space-y-2">
            {isCompareMode && <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Source A</label>}
            <textarea 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste first news text or URL..."
              className="w-full h-40 p-6 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none text-lg"
            />
          </div>
          {isCompareMode && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Source B</label>
              <textarea 
                value={compareText}
                onChange={(e) => setCompareText(e.target.value)}
                placeholder="Paste second news text or URL to compare..."
                className="w-full h-40 p-6 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none text-lg"
              />
            </div>
          )}
        </div>

        <div className="mt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          {error && (
            <p className="text-sm text-rose-600 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" /> {error}
            </p>
          )}
          <div className="flex-1" />
          <button 
            onClick={handleFullAnalyze}
            disabled={analyzing || !inputText.trim()}
            className="w-full md:w-auto px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-xl shadow-indigo-100"
          >
            {analyzing ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Analyzing...</>
            ) : (
              <><Zap className="w-5 h-5" /> {isCompareMode ? "Compare Now" : "Analyze Now"}</>
            )}
          </button>
        </div>
      </div>
    </section>
  );
};
