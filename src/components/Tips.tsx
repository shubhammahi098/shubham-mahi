import React from 'react';
import { Lightbulb } from 'lucide-react';
import { FAKE_NEWS_TIPS } from '../core/constants';

export const Tips: React.FC = () => {
  return (
    <section className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Lightbulb className="w-6 h-6 text-amber-500" /> How to Spot Fake News
      </h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {FAKE_NEWS_TIPS.map((tip, i) => (
          <div key={i} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:border-indigo-200 transition-all">
            <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center font-bold text-sm mb-4">
              0{i+1}
            </div>
            <h4 className="font-bold mb-2">{tip.title}</h4>
            <p className="text-sm text-slate-500 leading-relaxed">{tip.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
