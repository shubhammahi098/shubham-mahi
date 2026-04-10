import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Send, Loader2, XCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { ChatMessage } from '../core/types';

interface ChatbotProps {
  isChatOpen: boolean;
  setIsChatOpen: (open: boolean) => void;
  chatMessages: ChatMessage[];
  chatInput: string;
  setChatInput: (input: string) => void;
  isChatLoading: boolean;
  handleChatSubmit: (e: React.FormEvent) => void;
  chatEndRef: React.RefObject<HTMLDivElement>;
}

export const Chatbot: React.FC<ChatbotProps> = ({
  isChatOpen,
  setIsChatOpen,
  chatMessages,
  chatInput,
  setChatInput,
  isChatLoading,
  handleChatSubmit,
  chatEndRef
}) => {
  return (
    <>
      <button 
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-indigo-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-all z-50"
      >
        <MessageSquare className="w-8 h-8" />
      </button>

      <AnimatePresence>
        {isChatOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-28 right-8 w-96 h-[32rem] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden z-50"
          >
            <div className="p-6 bg-indigo-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-bold">Fake News Detector AI</div>
                  <div className="text-xs text-indigo-100 flex items-center gap-1">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" /> Online
                  </div>
                </div>
              </div>
              <button onClick={() => setIsChatOpen(false)} className="p-2 hover:bg-white/10 rounded-lg transition-all">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50 custom-scrollbar">
              {chatMessages.length === 0 && (
                <div className="text-center py-8">
                  <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <p className="text-sm text-slate-500">Hi! I'm Fake News Detector AI. Ask me anything about news verification or specific claims.</p>
                </div>
              )}
              {chatMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-4 rounded-2xl text-sm ${
                    msg.role === 'user' 
                      ? 'bg-indigo-600 text-white rounded-tr-none' 
                      : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none shadow-sm'
                  }`}>
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  </div>
                </div>
              ))}
              {isChatLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-slate-200 p-4 rounded-2xl rounded-tl-none shadow-sm">
                    <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <form onSubmit={handleChatSubmit} className="p-4 bg-white border-t border-slate-200 flex gap-2">
              <input 
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask Fake News Detector AI..."
                className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm"
              />
              <button 
                type="submit"
                disabled={!chatInput.trim() || isChatLoading}
                className="p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-all"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
