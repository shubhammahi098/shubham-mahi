import React from 'react';
import { motion } from 'motion/react';
import { Download, Shield, Info, CheckCircle2, XCircle, ShieldQuestion, AlertCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { NewsAnalysis, Verdict } from '../core/types';
import { cn } from '../core/utils';

interface AnalysisResultProps {
  results: NewsAnalysis;
  exportToPDF: () => void;
  titlePrefix?: string;
}

export const AnalysisResult: React.FC<AnalysisResultProps> = ({ 
  results, 
  exportToPDF,
  titlePrefix = ""
}) => {
  const getVerdictIcon = (verdict: Verdict) => {
    switch (verdict) {
      case 'TRUE': return <CheckCircle2 className="text-emerald-500" />;
      case 'FALSE': return <XCircle className="text-rose-500" />;
      case 'MISLEADING': return <AlertCircle className="text-amber-500" />;
      default: return <ShieldQuestion className="text-slate-400" />;
    }
  };

  const getVerdictColor = (verdict: Verdict) => {
    switch (verdict) {
      case 'TRUE': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'FALSE': return 'text-rose-600 bg-rose-50 border-rose-200';
      case 'MISLEADING': return 'text-amber-600 bg-amber-50 border-amber-200';
      default: return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden"
    >
      <div className={cn("p-6 border-b flex items-center justify-between", getVerdictColor(results.verdict))}>
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white rounded-2xl shadow-sm">
            {getVerdictIcon(results.verdict)}
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-widest opacity-60">{titlePrefix} Verdict</div>
            <div className="text-3xl font-black">{results.verdict}</div>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right">
            <div className="text-xs font-bold uppercase tracking-widest opacity-60">Confidence</div>
            <div className="text-3xl font-black">{results.confidenceScore}%</div>
          </div>
          {!titlePrefix && (
            <button 
              onClick={exportToPDF}
              className="p-3 bg-white/20 hover:bg-white/40 rounded-xl transition-all"
              title="Export to PDF"
            >
              <Download className="w-6 h-6" />
            </button>
          )}
        </div>
      </div>

      <div className="p-8 space-y-6">
        {/* Reliability Overview Row */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Source Reliability */}
          {results.sourceReliability && (
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col justify-center">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-slate-400 text-[10px] uppercase tracking-wider flex items-center gap-2">
                  <Shield className="w-3 h-3 text-indigo-600" /> Source Reliability
                </h3>
                <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full", 
                  results.sourceReliability.score > 70 ? "bg-emerald-100 text-emerald-700" : 
                  results.sourceReliability.score > 40 ? "bg-amber-100 text-amber-700" : 
                  "bg-rose-100 text-rose-700"
                )}>
                  {results.sourceReliability.rating}
                </span>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed italic line-clamp-2">
                "{results.sourceReliability.description}"
              </p>
            </div>
          )}

          {/* Confidence Meter */}
          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col justify-center">
            <div className="flex justify-between items-end mb-2">
              <h3 className="font-bold text-slate-400 text-[10px] uppercase tracking-wider">Reliability Meter</h3>
              <span className="text-xs font-bold">{results.confidenceScore}%</span>
            </div>
            <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${results.confidenceScore}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className={cn("h-full", 
                  results.verdict === 'TRUE' ? 'bg-emerald-500' : 
                  results.verdict === 'FALSE' ? 'bg-rose-500' : 
                  'bg-amber-500'
                )}
              />
            </div>
          </div>
        </div>

        {/* Pros & Cons Row - Side by Side */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-5 bg-emerald-50/50 rounded-2xl border border-emerald-100">
            <h4 className="font-bold text-emerald-800 text-xs mb-3 flex items-center gap-2 uppercase tracking-wide">
              <CheckCircle2 className="w-3.5 h-3.5" /> Supporting Evidence
            </h4>
            <ul className="space-y-2">
              {results.pros.slice(0, 3).map((pro, i) => (
                <li key={i} className="text-xs text-emerald-700 flex gap-2">
                  <span className="text-emerald-400 font-bold">•</span> {pro}
                </li>
              ))}
            </ul>
          </div>
          <div className="p-5 bg-rose-50/50 rounded-2xl border border-rose-100">
            <h4 className="font-bold text-rose-800 text-xs mb-3 flex items-center gap-2 uppercase tracking-wide">
              <XCircle className="w-3.5 h-3.5" /> Debunking Evidence
            </h4>
            <ul className="space-y-2">
              {results.cons.slice(0, 3).map((con, i) => (
                <li key={i} className="text-xs text-rose-700 flex gap-2">
                  <span className="text-rose-400 font-bold">•</span> {con}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Explanation - Now at the bottom to allow the top sections to be "wide" */}
        <div className="pt-2">
          <h3 className="font-bold text-slate-400 text-[10px] uppercase tracking-wider mb-3 flex items-center gap-2">
            <Info className="w-3.5 h-3.5" /> Detailed Explanation
          </h3>
          <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed text-sm bg-slate-50/30 p-4 rounded-xl border border-slate-100">
            <ReactMarkdown>{results.explanation}</ReactMarkdown>
          </div>
        </div>
      </div>
    </motion.section>
  );
};
