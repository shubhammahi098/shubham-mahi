import React from 'react';
import { ShieldCheck, Globe, LogOut, LogIn } from 'lucide-react';
import { User } from 'firebase/auth';
import { LANGUAGES } from '../core/constants';

interface HeaderProps {
  user: User | null;
  selectedLang: string;
  setSelectedLang: (lang: string) => void;
  loginWithGoogle: () => void;
  logout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  user, 
  selectedLang, 
  setSelectedLang, 
  loginWithGoogle, 
  logout 
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-indigo-600" />
          <span className="text-xl font-bold tracking-tight">Fake News Detector</span>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-200">
            <Globe className="w-4 h-4 text-slate-400" />
            <select 
              value={selectedLang}
              onChange={(e) => setSelectedLang(e.target.value)}
              className="bg-transparent text-sm font-medium focus:outline-none"
            >
              {LANGUAGES.map(lang => (
                <option key={lang.code} value={lang.code}>{lang.label}</option>
              ))}
            </select>
          </div>
          {user ? (
            <>
              <div className="hidden md:flex items-center gap-3 px-3 py-1.5 bg-slate-50 rounded-full border border-slate-100">
                <img src={user.photoURL || ''} className="w-6 h-6 rounded-full" referrerPolicy="no-referrer" />
                <span className="text-sm font-medium">{user.displayName}</span>
              </div>
              <button 
                onClick={logout}
                className="p-2 text-slate-400 hover:text-rose-600 transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </>
          ) : (
            <button 
              onClick={loginWithGoogle}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
            >
              <LogIn className="w-4 h-4" />
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
