import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ResetPassword } from './components/ResetPassword';
import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { DashboardPreview } from './components/DashboardPreview';
import { EditorInterface } from './components/EditorInterface';
import { AnalysisPage } from './components/AnalysisPage'; 
import { Features } from './components/Features';
import { Pricing } from './components/Pricing';
import { Footer } from './components/Footer';
import { LoginModal } from './components/LoginModal';
import { AnimatePresence, motion } from 'framer-motion';

export const DemoContext = React.createContext<{
  view: 'landing' | 'analysis' | 'editor' | 'upload';
  setView: (view: 'landing' | 'analysis' | 'editor' | 'upload') => void;
}>({ view: 'landing', setView: () => {} });

export default function App() {
  const [view, setView] = useState<'landing' | 'analysis' | 'editor' | 'upload'>('landing');
  const [currentVideo, setCurrentVideo] = useState<File | string | null>(null);
  const [isAiFixApplied, setIsAiFixApplied] = useState(false);
  const [analysisFixesForEditor, setAnalysisFixesForEditor] = useState<string[]>([]);
  
  // --- AUTH STATE ---
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  // 1. Check for logged-in user on page load
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // 2. Logout function
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    alert("Logged out successfully");
  };

  const handleAnalysisComplete = (file: File | string, isAiFix: boolean, fixes?: string[]) => {
    setCurrentVideo(file);
    setIsAiFixApplied(isAiFix);
    setAnalysisFixesForEditor(fixes || []);
    setView('editor');
  };

  return (
    <Router>
      <Routes>
        {/* --- MAIN SITE ROUTE --- */}
        <Route path="/" element={
          <DemoContext.Provider value={{ view, setView }}>
            <div className="min-h-screen bg-[#0F0F1E] text-white font-sans selection:bg-brand-primary selection:text-white">
              
              {view !== 'editor' && view !== 'upload' && (
                <Navbar 
                  onLoginClick={() => setIsLoginOpen(true)} 
                  user={user}
                  onLogout={handleLogout}
                />
              )}

              <LoginModal 
                isOpen={isLoginOpen} 
                onClose={() => setIsLoginOpen(false)} 
                onLoginSuccess={(userData) => setUser(userData)}
              />
              
              <AnimatePresence mode="wait">
                {view === 'landing' && (
                  <motion.main key="landing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
                    <Hero onStartAnalysis={() => setView('analysis')} onOpenEditor={() => setView('upload')} />
                    
                    <div className="relative z-10">
                      <DashboardPreview />
                      <Features />
                      <Pricing />
                    </div>
                  </motion.main>
                )}

                {view === 'analysis' && (
                   <motion.main key="analysis" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5 }} className="pt-24 px-4 md:px-8 pb-12 min-h-screen">
                    <DashboardPreview isFullMode={true} />
                    <div className="mt-8 text-center">
                      <button onClick={() => setView('landing')} className="text-gray-400 hover:text-white transition-colors text-sm underline">Back to Home</button>
                    </div>
                  </motion.main>
                )}

                {view === 'upload' && (
                  <motion.div key="upload" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 overflow-y-auto">
                     <AnalysisPage onBack={() => setView('landing')} onAnalysisComplete={handleAnalysisComplete} />
                  </motion.div>
                )}

                {view === 'editor' && (
                  <motion.div key="editor" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed inset-0 z-50">
                    <EditorInterface onBack={() => setView('landing')} initialVideoFile={currentVideo} isAiFix={isAiFixApplied} analysisFixes={analysisFixesForEditor} />
                  </motion.div>
                )}
              </AnimatePresence>

              {view !== 'editor' && view !== 'upload' && <Footer />}
            </div>
          </DemoContext.Provider>
        } />

        {/* --- RESET PASSWORD ROUTE --- */}
        <Route path="/reset-password/:token" element={<ResetPassword />} />

      </Routes>
    </Router>
  );
}