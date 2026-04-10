import React from 'react';
import { History as HistoryIcon, LogIn, Trash2 } from 'lucide-react';
import { User } from 'firebase/auth';
import { NewsAnalysis, Verdict } from '../core/types';

interface HistoryProps {
  user: User | null;
  history: NewsAnalysis[];
  loginWithGoogle: () => void;
  deleteAnalysis: (id: string) => void;
  setResults: (analysis: NewsAnalysis) => void;
  getVerdictIcon: (verdict: Verdict) => React.ReactNode;
}

export const History: React.FC<HistoryProps> = ({
  user,
  history,
  loginWithGoogle,
  deleteAnalysis,
  setResults,
  getVerdictIcon
}) => {
  return (
    <aside className="lg:col-span-3 space-y-8">
      <section className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm sticky top-24">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <HistoryIcon className="w-5 h-5 text-indigo-600" /> Recent History
          </h2>
          {user && history.length > 0 && (
            <span className="text-xs font-bold px-2 py-1 bg-slate-100 text-slate-500 rounded-lg">
              {history.length}
            </span>
          )}
        </div>

        {!user ? (
          <div className="text-center py-12 px-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
              <LogIn className="w-6 h-6 text-slate-400" />
            </div>
            <h3 className="font-bold text-slate-900 mb-2">Sign in for History</h3>
            <p className="text-sm text-slate-500 mb-6">Keep track of all your news verifications across devices.</p>
            <button 
              onClick={loginWithGoogle}
              className="w-full py-3 bg-white text-slate-900 border border-slate-200 rounded-xl font-bold hover:bg-slate-50 transition-all text-sm"
            >
              Sign In with Google
            </button>
          </div>
        ) : history.length === 0 ? (
          <div className="text-center py-12 px-4">
            <p className="text-sm text-gray-400">No verification history yet. Start by analyzing some news!</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[calc(100vh-350px)] overflow-y-auto pr-2 custom-scrollbar">
            {history.map((item) => (
              <div 
                key={item.id}
                className="group p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-indigo-200 hover:bg-white transition-all cursor-pointer relative"
                onClick={() => setResults(item)}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1">{getVerdictIcon(item.verdict)}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-900 line-clamp-1 mb-1">{item.newsText}</p>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      <span>{item.verdict}</span>
                      <span>•</span>
                      <span>{item.confidenceScore}%</span>
                    </div>
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      if (item.id) deleteAnalysis(item.id);
                    }}
                    className="p-2 text-slate-300 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </aside>
  );
};
