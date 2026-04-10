/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  CheckCircle2,
  XCircle,
  AlertCircle,
  ShieldQuestion,
  Loader2
} from 'lucide-react';
import { AnimatePresence } from 'motion/react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

// Core
import { auth, db, loginWithGoogle, logout, testConnection, handleFirestoreError, OperationType } from '../core/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  serverTimestamp,
  deleteDoc,
  doc,
  setDoc,
  getDoc,
  limit 
} from 'firebase/firestore';
import { analyzeNews, getChatResponse, getTrendingNews } from '../core/gemini';
import { NewsAnalysis, ChatMessage, Verdict } from '../core/types';
import { FAKE_NEWS_QUIZ } from '../core/constants';
import { cn } from '../core/utils';

// Components
import { Header } from '../components/Header';
import { Stats } from '../components/Stats';
import { VerificationInput } from '../components/VerificationInput';
import { AnalysisResult } from '../components/AnalysisResult';
import { TrendingNews } from '../components/TrendingNews';
import { FactCheckQuiz } from '../components/FactCheckQuiz';
import { Chatbot } from '../components/Chatbot';
import { Tips } from '../components/Tips';
import { History } from '../components/History';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [inputText, setInputText] = useState('');
  const [compareText, setCompareText] = useState('');
  const [isCompareMode, setIsCompareMode] = useState(false);
  const [selectedLang, setSelectedLang] = useState('English');
  const [results, setResults] = useState<NewsAnalysis | null>(null);
  const [compareResults, setCompareResults] = useState<NewsAnalysis | null>(null);
  const [history, setHistory] = useState<NewsAnalysis[]>([]);
  const [trendingNewsItems, setTrendingNewsItems] = useState<{title: string, description: string, url?: string}[]>([]);
  const [isTrendingLoading, setIsTrendingLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Quiz State
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [showQuizResult, setShowQuizResult] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    testConnection();
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      if (u) {
        const userRef = doc(db, 'users', u.uid);
        const userSnap = await getDoc(userRef);
        if (!userSnap.exists()) {
          await setDoc(userRef, {
            uid: u.uid,
            displayName: u.displayName || 'Anonymous',
            email: u.email,
            photoURL: u.photoURL || '',
            role: 'user',
            createdAt: serverTimestamp()
          });
        }
      }
      setUser(u);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) {
      setHistory([]);
      return;
    }

    const q = query(
      collection(db, 'analyses'),
      where('userId', '==', user.uid),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as NewsAnalysis[];
      setHistory(data);
    }, (err) => {
      handleFirestoreError(err, OperationType.LIST, 'analyses');
    });

    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages]);

  useEffect(() => {
    const fetchTrending = async () => {
      setIsTrendingLoading(true);
      try {
        const news = await getTrendingNews();
        setTrendingNewsItems(news);
      } catch (err) {
        console.error("Failed to fetch trending news", err);
      } finally {
        setIsTrendingLoading(false);
      }
    };
    fetchTrending();
  }, []);

  const handleAnalyze = async (text: string, isComparison: boolean = false) => {
    if (!text.trim()) return;
    if (!isComparison) setAnalyzing(true);
    setError(null);
    try {
      const analysis = await analyzeNews(text, selectedLang);
      const newAnalysis = {
        userId: user?.uid || 'anonymous',
        newsText: text,
        language: selectedLang,
        ...analysis,
        timestamp: serverTimestamp()
      };
      
      if (user) {
        const docRef = await addDoc(collection(db, 'analyses'), newAnalysis);
        if (isComparison) setCompareResults({ id: docRef.id, ...newAnalysis });
        else setResults({ id: docRef.id, ...newAnalysis });
      } else {
        if (isComparison) setCompareResults({ id: 'temp-' + Date.now(), ...newAnalysis });
        else setResults({ id: 'temp-' + Date.now(), ...newAnalysis });
      }
      if (!isComparison) setInputText('');
    } catch (err) {
      console.error(err);
      setError("Failed to analyze news. Please try again.");
    } finally {
      if (!isComparison) setAnalyzing(false);
    }
  };

  const handleFullAnalyze = async () => {
    await handleAnalyze(inputText);
    if (isCompareMode && compareText.trim()) {
      await handleAnalyze(compareText, true);
    }
  };

  const handleQuizAnswer = (idx: number) => {
    if (idx === FAKE_NEWS_QUIZ[quizIndex].answer) {
      setQuizScore(prev => prev + 1);
    }
    if (quizIndex < FAKE_NEWS_QUIZ.length - 1) {
      setQuizIndex(prev => prev + 1);
    } else {
      setShowQuizResult(true);
    }
  };

  const resetQuiz = () => {
    setQuizIndex(0);
    setQuizScore(0);
    setShowQuizResult(false);
  };

  const exportToPDF = () => {
    if (!results) return;
    const doc = new jsPDF();
    
    doc.setFontSize(22);
    doc.text("Fake News Detector Analysis Report", 20, 20);
    
    doc.setFontSize(12);
    doc.text(`Verdict: ${results.verdict}`, 20, 35);
    doc.text(`Confidence Score: ${results.confidenceScore}%`, 20, 45);
    doc.text(`Language: ${results.language || 'English'}`, 20, 55);
    
    doc.setFontSize(14);
    doc.text("Source Reliability", 20, 70);
    doc.setFontSize(10);
    doc.text(`Rating: ${results.sourceReliability?.rating || 'N/A'}`, 20, 78);
    doc.text(`Description: ${results.sourceReliability?.description || 'N/A'}`, 20, 85, { maxWidth: 170 });

    doc.setFontSize(14);
    doc.text("Explanation", 20, 105);
    doc.setFontSize(10);
    doc.text(results.explanation, 20, 113, { maxWidth: 170 });

    autoTable(doc, {
      startY: 150,
      head: [['Supporting Evidence (Pros)', 'Debunking Evidence (Cons)']],
      body: results.pros.map((pro, i) => [pro, results.cons[i] || '']),
      theme: 'grid',
      headStyles: { fillColor: [79, 70, 229] }
    });

    doc.save(`FakeNewsDetector_Analysis_${results.id}.pdf`);
  };

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isChatLoading) return;

    const userMsg: ChatMessage = { role: 'user', text: chatInput };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setIsChatLoading(true);

    try {
      const response = await getChatResponse(chatMessages, chatInput);
      const modelMsg: ChatMessage = { role: 'model', text: response || "I'm sorry, I couldn't process that." };
      setChatMessages(prev => [...prev, modelMsg]);
    } catch (err) {
      console.error(err);
      setChatMessages(prev => [...prev, { role: 'model', text: "Error connecting to AI. Please try again." }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const deleteAnalysis = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'analyses', id));
      if (results?.id === id) setResults(null);
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `analyses/${id}`);
    }
  };

  const getVerdictIcon = (verdict: Verdict) => {
    switch (verdict) {
      case 'TRUE': return <CheckCircle2 className="text-emerald-500 w-5 h-5" />;
      case 'FALSE': return <XCircle className="text-rose-500 w-5 h-5" />;
      case 'MISLEADING': return <AlertCircle className="text-amber-500 w-5 h-5" />;
      default: return <ShieldQuestion className="text-slate-400 w-5 h-5" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-12 h-12 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">
      <Header 
        user={user}
        selectedLang={selectedLang}
        setSelectedLang={setSelectedLang}
        loginWithGoogle={loginWithGoogle}
        logout={logout}
      />

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8 grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          <Stats history={history} quizScore={quizScore} />

          <VerificationInput 
            inputText={inputText}
            setInputText={setInputText}
            compareText={compareText}
            setCompareText={setCompareText}
            isCompareMode={isCompareMode}
            setIsCompareMode={setIsCompareMode}
            analyzing={analyzing}
            handleFullAnalyze={handleFullAnalyze}
            error={error}
          />

          <div className={cn("grid gap-8", isCompareMode ? "md:grid-cols-2" : "grid-cols-1")}>
            <AnimatePresence mode="wait">
              {results && (
                <AnalysisResult 
                  key={results.id}
                  results={results}
                  exportToPDF={exportToPDF}
                  titlePrefix={isCompareMode ? "Source A" : ""}
                />
              )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
              {isCompareMode && compareResults && (
                <AnalysisResult 
                  key={compareResults.id}
                  results={compareResults}
                  exportToPDF={exportToPDF}
                  titlePrefix="Source B"
                />
              )}
            </AnimatePresence>
          </div>

          <FactCheckQuiz 
            quizIndex={quizIndex}
            quizScore={quizScore}
            showQuizResult={showQuizResult}
            handleQuizAnswer={handleQuizAnswer}
            resetQuiz={resetQuiz}
          />

          <TrendingNews 
            isTrendingLoading={isTrendingLoading}
            trendingNewsItems={trendingNewsItems}
            setInputText={setInputText}
          />

          <Tips />
        </div>

        <History 
          user={user}
          history={history}
          loginWithGoogle={loginWithGoogle}
          deleteAnalysis={deleteAnalysis}
          setResults={setResults}
          getVerdictIcon={getVerdictIcon}
        />
      </main>

      <Chatbot 
        isChatOpen={isChatOpen}
        setIsChatOpen={setIsChatOpen}
        chatMessages={chatMessages}
        chatInput={chatInput}
        setChatInput={setChatInput}
        isChatLoading={isChatLoading}
        handleChatSubmit={handleChatSubmit}
        chatEndRef={chatEndRef}
      />
    </div>
  );
}
