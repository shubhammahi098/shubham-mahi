import React from 'react';
import { motion } from 'motion/react';
import { Flame, Globe, Loader2, ExternalLink, ChevronRight } from 'lucide-react';

interface TrendingNewsProps {
  isTrendingLoading: boolean;
  trendingNewsItems: {title: string, description: string, url?: string}[];
  setInputText: (text: string) => void;
}

export const TrendingNews: React.FC<TrendingNewsProps> = ({
  isTrendingLoading,
  trendingNewsItems,
  setInputText
}) => {
  return (
    <section className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Flame className="w-6 h-6 text-orange-500" /> Trending News
        </h2>
        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
          <Globe className="w-3 h-3" /> Real-time Updates
        </div>
      </div>
      
      {isTrendingLoading ? (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          <p className="text-sm text-slate-500 font-medium">Fetching latest trending topics...</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {trendingNewsItems.map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:border-indigo-200 hover:bg-white transition-all group"
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2">
                  {item.title}
                </h3>
                {item.url && (
                  <a href={item.url} target="_blank" rel="noopener noreferrer" className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
              <p className="text-sm text-slate-500 line-clamp-2 mb-4">
                {item.description}
              </p>
              <button 
                onClick={() => {
                  setInputText(item.url || item.title);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="text-xs font-bold text-indigo-600 flex items-center gap-1 hover:gap-2 transition-all"
              >
                Verify this claim <ChevronRight className="w-3 h-3" />
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
};
