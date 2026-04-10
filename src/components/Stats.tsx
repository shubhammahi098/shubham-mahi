import React from 'react';
import { Target, Zap, Trophy } from 'lucide-react';
import { NewsAnalysis } from '../core/types';

interface StatsProps {
  history: NewsAnalysis[];
  quizScore: number;
}

export const Stats: React.FC<StatsProps> = ({ history, quizScore }) => {
  if (history.length === 0) return null;

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
        <div className="p-3 bg-indigo-50 rounded-2xl">
          <Target className="w-6 h-6 text-indigo-600" />
        </div>
        <div>
          <div className="text-2xl font-black">{history.length}</div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Verified</div>
        </div>
      </div>
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
        <div className="p-3 bg-emerald-50 rounded-2xl">
          <Zap className="w-6 h-6 text-emerald-600" />
        </div>
        <div>
          <div className="text-2xl font-black">
            {Math.round((history.filter(h => h.verdict === 'TRUE').length / history.length) * 100)}%
          </div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Truth Accuracy</div>
        </div>
      </div>
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
        <div className="p-3 bg-amber-50 rounded-2xl">
          <Trophy className="w-6 h-6 text-amber-600" />
        </div>
        <div>
          <div className="text-2xl font-black">{quizScore * 10}</div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">VeriPoints</div>
        </div>
      </div>
    </section>
  );
};
