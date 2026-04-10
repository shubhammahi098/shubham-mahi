import React from 'react';
import { motion } from 'motion/react';
import { Trophy, ChevronRight } from 'lucide-react';
import { FAKE_NEWS_QUIZ } from '../core/constants';

interface FactCheckQuizProps {
  quizIndex: number;
  quizScore: number;
  showQuizResult: boolean;
  handleQuizAnswer: (idx: number) => void;
  resetQuiz: () => void;
}

export const FactCheckQuiz: React.FC<FactCheckQuizProps> = ({
  quizIndex,
  quizScore,
  showQuizResult,
  handleQuizAnswer,
  resetQuiz
}) => {
  return (
    <section className="bg-gradient-to-br from-indigo-600 to-violet-700 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 p-12 opacity-10">
        <Trophy className="w-40 h-40" />
      </div>
      <div className="relative">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-black mb-2">Fact-Check Challenge</h2>
            <p className="text-indigo-100">Test your skills in spotting misinformation!</p>
          </div>
          <div className="px-4 py-2 bg-white/20 rounded-2xl font-bold">
            Level 01
          </div>
        </div>

        {!showQuizResult ? (
          <motion.div 
            key={quizIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="text-xl font-medium leading-relaxed">
              {FAKE_NEWS_QUIZ[quizIndex].question}
            </div>
            <div className="grid gap-3">
              {FAKE_NEWS_QUIZ[quizIndex].options.map((opt, i) => (
                <button 
                  key={i}
                  onClick={() => handleQuizAnswer(i)}
                  className="w-full p-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl text-left transition-all font-medium flex items-center justify-between group"
                >
                  {opt}
                  <ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-all" />
                </button>
              ))}
            </div>
            <div className="flex justify-between text-xs font-bold uppercase tracking-widest opacity-60">
              <span>Question {quizIndex + 1} of {FAKE_NEWS_QUIZ.length}</span>
              <span>Score: {quizScore}</span>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8"
          >
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trophy className="w-10 h-10 text-yellow-400" />
            </div>
            <h3 className="text-4xl font-black mb-2">Great Job!</h3>
            <p className="text-indigo-100 mb-8 text-lg">You scored {quizScore} out of {FAKE_NEWS_QUIZ.length}</p>
            <button 
              onClick={resetQuiz}
              className="px-8 py-3 bg-white text-indigo-600 rounded-2xl font-bold hover:bg-indigo-50 transition-all"
            >
              Play Again
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
};
