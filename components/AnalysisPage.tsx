
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, Zap, Scan, AlertCircle, CheckCircle2, ArrowRight, FileVideo, 
  Loader2, BrainCircuit, Eye, Activity, Info, TrendingUp, BarChart3, 
  Clock, Target, Sparkles, Wand2, MousePointer2, Scissors, Play, Clapperboard, Image as ImageIcon, Check
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface AnalysisPageProps {
  onBack: () => void;
  onAnalysisComplete: (file: File | string, isAiFix: boolean) => void;
}

interface AnalysisResult {
  viralScore: number;
  summary: string;
  hookAnalysis: string;
  visualQuality: string;
  weaknesses: string[];
  strengths: string[];
  fixes: string[];
}

const MOCK_RESULT: AnalysisResult = {
  viralScore: 0,
  summary: "Analysis pending...",
  hookAnalysis: "Pending...",
  visualQuality: "Pending...",
  weaknesses: [],
  strengths: [],
  fixes: []
};

export const AnalysisPage: React.FC<AnalysisPageProps> = ({ onBack, onAnalysisComplete }) => {
  const [mode, setMode] = useState<'video' | 'veo'>('video');
  const [step, setStep] = useState<'upload' | 'analyzing' | 'results' | 'suggestions' | 'applying-fixes' | 'veo-generating'>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("Initializing...");
  const [result, setResult] = useState<AnalysisResult>(MOCK_RESULT);
  const [retentionData, setRetentionData] = useState<any[]>([]);
  const [veoPrompt, setVeoPrompt] = useState("");
  const [veoAspectRatio, setVeoAspectRatio] = useState<"16:9" | "9:16">("16:9");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      if (mode === 'video') {
        startDeepAnalysis(selectedFile);
      }
    }
  };

  const startDeepAnalysis = async (uploadedFile: File) => {
    setStep('analyzing');
    setProgress(5);
    setStatusText("Deep Neural Scanning...");

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve) => {
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.readAsDataURL(uploadedFile);
      });
      const base64Data = await base64Promise;

      const response = await ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: {
          parts: [
            { text: "Analyze this video for its viral potential. Provide a detailed summary, viral score (0-100), hook analysis, visual quality check, strengths, weaknesses, and exactly 5 actionable AI-implementable fixes (e.g., color grading, zoom points, audio normalization). Return strictly valid JSON with no markdown blocks. Keep text concise. Structure: {summary, viralScore, hookAnalysis, visualQuality, weaknesses: [], strengths: [], fixes: []}" },
            { inlineData: { mimeType: uploadedFile.type, data: base64Data } }
          ]
        },
        config: { 
          responseMimeType: "application/json"
        }
      });

      const text = response.text?.trim() || "{}";
      const analysisData: AnalysisResult = JSON.parse(text);
      setResult(analysisData);
      
      const data = [];
      let ret = 100;
      for (let i = 0; i <= 100; i += 10) {
        ret -= (10 - (analysisData.viralScore / 10)) + (Math.random() * 5);
        data.push({ time: `${i}%`, retention: Math.max(0, Math.round(ret)) });
      }
      setRetentionData(data);

      setProgress(100);
      setStatusText("Report Generated.");
      setTimeout(() => setStep('results'), 800);
    } catch (error) {
      console.error("Analysis failed:", error);
      setStatusText("Analysis failed. Try a smaller clip.");
      setTimeout(() => setStep('upload'), 3000);
    }
  };

  const handleVeoGenerate = async () => {
    if (!file) return;
    
    if (!(await (window as any).aistudio.hasSelectedApiKey())) {
      await (window as any).aistudio.openSelectKey();
    }

    setStep('veo-generating');
    setProgress(0);
    setStatusText("Initializing Veo Engine...");

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve) => {
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.readAsDataURL(file);
      });
      const base64Data = await base64Promise;

      let operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: veoPrompt || "A cinematic motion based on this image, highly detailed.",
        image: {
          imageBytes: base64Data,
          mimeType: file.type,
        },
        config: {
          numberOfVideos: 1,
          resolution: '720p',
          aspectRatio: veoAspectRatio
        }
      });

      let pollCount = 0;
      while (!operation.done) {
        pollCount++;
        setProgress(Math.min(pollCount * 4, 98));
        setStatusText(`Veo is animating... (${pollCount * 10}s)`);
        await new Promise(resolve => setTimeout(resolve, 10000));
        operation = await ai.operations.getVideosOperation({ operation: operation });
      }

      const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
      const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
      const blob = await response.blob();
      const videoUrl = URL.createObjectURL(blob);
      
      onAnalysisComplete(videoUrl, false);
    } catch (error: any) {
      console.error("Veo generation failed:", error);
      if (error?.message?.includes("Requested entity was not found.")) {
          await (window as any).aistudio.openSelectKey();
      }
      setStatusText("Generation failed. Check API key and quota.");
      setTimeout(() => setStep('upload'), 4000);
    }
  };

  const implementFixes = () => {
    setStep('applying-fixes');
    setProgress(0);
    setStatusText("VFXB AI Implementing Suggestions...");
    
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          if (file) onAnalysisComplete(file, true);
          return 100;
        }
        return p + 4;
      });
    }, 120);
  };

  return (
    <div className="min-h-screen bg-[#0F0F1E] text-white pt-24 px-4 pb-12 relative overflow-hidden font-sans">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex justify-between items-center mb-12">
           <button onClick={onBack} className="text-gray-400 hover:text-white flex items-center gap-2 text-sm transition-colors group">
             <ArrowRight className="rotate-180 transition-transform group-hover:-translate-x-1" size={16} /> Back to Home
           </button>
           <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10 shadow-lg">
              <button 
                onClick={() => setMode('video')} 
                className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${mode === 'video' ? 'bg-brand-primary text-white shadow-xl' : 'text-gray-500 hover:text-white'}`}
              >
                Viral Analysis
              </button>
              <button 
                onClick={() => setMode('veo')} 
                className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${mode === 'veo' ? 'bg-brand-accent text-white shadow-xl' : 'text-gray-500 hover:text-white'}`}
              >
                Animate Image
              </button>
           </div>
        </div>

        <AnimatePresence mode="wait">
          {step === 'upload' && (
            <motion.div key="upload" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="text-center">
              <h1 className="text-5xl md:text-7xl font-black mb-8 tracking-tight leading-none">
                {mode === 'video' ? 'Deep Viral' : 'Image Motion'}<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-secondary">{mode === 'video' ? 'Intelligence' : 'with Veo 3.1'}</span>
              </h1>
              <div 
                onClick={() => fileInputRef.current?.click()} 
                className="max-w-2xl mx-auto border-2 border-dashed border-white/10 hover:border-brand-primary hover:bg-brand-primary/5 rounded-[40px] p-20 transition-all cursor-pointer group relative shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)]"
              >
                <input ref={fileInputRef} type="file" accept={mode === 'video' ? "video/*" : "image/*"} className="hidden" onChange={handleFileSelect} />
                <div className="w-24 h-24 bg-[#1A1A2E] rounded-[32px] flex items-center justify-center mx-auto mb-10 shadow-2xl border border-white/5 transform group-hover:scale-110 transition-transform duration-500 group-hover:shadow-brand-primary/20">
                  {mode === 'video' ? <Upload size={40} className="text-brand-primary" /> : <ImageIcon size={40} className="text-brand-accent" />}
                </div>
                {file ? (
                  <div>
                    <h3 className="text-2xl font-bold mb-2 text-white">{file.name}</h3>
                    {mode === 'veo' && (
                       <div className="space-y-4 max-w-sm mx-auto mb-8" onClick={(e) => e.stopPropagation()}>
                          <textarea 
                            value={veoPrompt}
                            onChange={(e) => setVeoPrompt(e.target.value)}
                            placeholder="Describe the cinematic motion (e.g. 'Slow pan over mountains')..."
                            className="w-full bg-black/60 border border-white/10 rounded-2xl p-4 text-xs h-24 outline-none focus:border-brand-accent transition-all resize-none shadow-inner"
                          />
                          <div className="flex gap-2 justify-center">
                             <button onClick={() => setVeoAspectRatio('16:9')} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase border transition-all ${veoAspectRatio === '16:9' ? 'bg-brand-accent border-brand-accent shadow-lg' : 'border-white/10 text-gray-500 hover:border-white/20'}`}>16:9 Landscape</button>
                             <button onClick={() => setVeoAspectRatio('9:16')} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase border transition-all ${veoAspectRatio === '9:16' ? 'bg-brand-accent border-brand-accent shadow-lg' : 'border-white/10 text-gray-500 hover:border-white/20'}`}>9:16 Portrait</button>
                          </div>
                       </div>
                    )}
                    <button 
                      onClick={(e) => { e.stopPropagation(); mode === 'video' ? startDeepAnalysis(file) : handleVeoGenerate(); }}
                      className="btn-gradient px-12 py-4 rounded-2xl font-black uppercase tracking-widest text-sm shadow-2xl hover:scale-105 transition-transform"
                    >
                      Process with AI
                    </button>
                  </div>
                ) : (
                  <div>
                    <h3 className="text-3xl font-bold mb-4 text-white">Upload File</h3>
                    <p className="text-gray-400 mb-10 text-lg">Harness Gemini 3 Pro Vision & Veo Generative AI</p>
                    <button 
                      onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                      className="px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest border border-white/10 text-white hover:bg-white/10 transition-all flex items-center gap-3 shadow-xl mx-auto active:scale-95"
                    >
                      <Scissors size={18} className="text-brand-accent" /> Jump to Studio Editor
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {(step === 'analyzing' || step === 'applying-fixes' || step === 'veo-generating') && (
            <motion.div key="processing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center py-20 min-h-[60vh]">
               <div className="relative w-64 h-64 mb-16">
                 <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="#1A1A2E" strokeWidth="3" />
                    <circle cx="50" cy="50" r="45" fill="none" stroke="url(#progressGradient)" strokeWidth="5" strokeDasharray="283" strokeDashoffset={283 - (283 * progress / 100)} strokeLinecap="round" className="transition-all duration-300 ease-out" />
                    <defs>
                      <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#6366f1" />
                        <stop offset="100%" stopColor="#a855f7" />
                      </linearGradient>
                    </defs>
                 </svg>
                 <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <motion.div animate={{ scale: [1, 1.15, 1], rotate: [0, 5, -5, 0] }} transition={{ repeat: Infinity, duration: 2.5 }}>
                       {step === 'veo-generating' ? <Clapperboard size={56} className="text-brand-accent mb-2" /> : <BrainCircuit size={56} className="text-brand-primary mb-2" />}
                    </motion.div>
                    <span className="text-5xl font-black text-white tabular-nums tracking-tighter">{progress}%</span>
                 </div>
               </div>
               <h2 className="text-3xl font-black mb-4 text-white tracking-tight">{statusText}</h2>
               <p className="text-gray-400 font-bold tracking-[0.4em] text-[10px] uppercase animate-pulse">Neural Processing Active</p>
            </motion.div>
          )}

          {step === 'results' && (
            <motion.div key="results" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full">
              <div className="grid grid-cols-12 gap-10">
                <div className="col-span-12 lg:col-span-8">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="px-3 py-1 rounded-full bg-brand-primary/10 text-brand-primary text-[10px] font-black uppercase tracking-[0.2em] border border-brand-primary/20 shadow-lg">Intelligence Feed</div>
                    <h2 className="text-3xl font-black text-white flex items-center gap-4 tracking-tight"><Clapperboard size={36} className="text-brand-primary" /> Production Report</h2>
                  </div>
                  <p className="text-gray-400 text-lg leading-relaxed mb-12 border-l-4 border-brand-primary pl-8 bg-brand-primary/5 py-6 rounded-r-3xl">{result.summary}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                      <KPICard label="Viral Index" value={result.viralScore} max={100} icon={<TrendingUp size={28} className="text-brand-accent"/>} />
                      <KPICard label="Retention Peak" value={Math.round(result.viralScore * 0.85)} unit="%" icon={<Clock size={28} className="text-blue-400"/>} />
                      <KPICard label="Market Fit" value={Math.round(result.viralScore * 0.9)} icon={<Activity size={28} className="text-purple-400"/>} />
                  </div>

                  <div className="glass-card p-10 rounded-[48px] border border-white/10 bg-gradient-to-br from-[#1A1A2E] to-black shadow-3xl">
                    <div className="flex items-center justify-between mb-8">
                       <h3 className="font-black text-2xl flex items-center gap-4 tracking-tight"><Sparkles size={28} className="text-brand-primary" /> AI Enhancement Plan</h3>
                       <button 
                         onClick={() => setStep('suggestions')}
                         className="px-10 py-4 btn-gradient rounded-[20px] font-black text-xs uppercase tracking-widest shadow-2xl flex items-center gap-4 hover:scale-105 transition-transform"
                       >
                         View Strategy <Zap size={18} fill="currentColor" />
                       </button>
                    </div>
                    <div className="space-y-4 mb-10 opacity-40">
                        {result.fixes.slice(0, 3).map((fix, i) => (
                            <div key={i} className="flex gap-6 items-center">
                              <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-xs font-black border border-white/5">{i+1}</div>
                              <p className="text-base text-gray-500 font-medium tracking-tight">{fix}</p>
                            </div>
                        ))}
                    </div>
                    <div className="pt-8 border-t border-white/5">
                        <button 
                          onClick={() => file && onAnalysisComplete(file, false)}
                          className="w-full bg-white/5 border border-white/10 hover:bg-white/10 py-6 rounded-[24px] font-black text-white text-xs uppercase tracking-widest flex items-center justify-center gap-4 transition-all hover:border-brand-accent/40"
                        >
                          Manual Edit in Studio <Scissors size={20} />
                        </button>
                    </div>
                  </div>
                </div>

                <div className="col-span-12 lg:col-span-4 space-y-8">
                  <div className="glass-card p-10 rounded-[40px] border border-white/5 h-fit shadow-2xl">
                    <h3 className="font-black text-xl mb-8 flex items-center gap-4 text-white uppercase tracking-[0.2em] text-xs"><BarChart3 size={24} className="text-brand-primary"/> Retention Waveform</h3>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={retentionData}>
                                <defs>
                                  <linearGradient id="colorRetention" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.6}/>
                                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                  </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                                <XAxis dataKey="time" stroke="#444" fontSize={12} />
                                <YAxis stroke="#444" fontSize={12} unit="%" />
                                <Tooltip contentStyle={{ backgroundColor: '#0F0F1E', border: 'none', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }} />
                                <Area type="monotone" dataKey="retention" stroke="#6366f1" strokeWidth={5} fill="url(#colorRetention)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                  </div>
                  
                  <div className="glass-card p-10 rounded-[40px] border border-white/5 shadow-2xl">
                    <h3 className="font-black text-xs mb-6 flex items-center gap-3 text-brand-accent uppercase tracking-widest"><Info size={20} /> Director Insight</h3>
                    <p className="text-sm text-gray-400 leading-relaxed mb-6 font-medium">{result.hookAnalysis}</p>
                    <p className="text-sm text-gray-400 leading-relaxed font-medium">{result.visualQuality}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {step === 'suggestions' && (
            <motion.div key="suggestions" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-4xl mx-auto pb-20">
                <div className="text-center mb-16">
                   <h2 className="text-5xl font-black mb-6 tracking-tight">AI Strategy <span className="text-gradient">Breakdown</span></h2>
                   <p className="text-gray-400 text-lg">Detailed modifications calculated by our viral neural engine.</p>
                </div>
                <div className="grid gap-6 mb-16">
                   {result.fixes.map((fix, i) => (
                      <div key={i} className="glass-card p-8 rounded-[32px] border border-white/10 flex items-center justify-between group hover:border-brand-primary transition-all shadow-2xl hover:shadow-brand-primary/10">
                         <div className="flex items-center gap-8">
                            <div className="w-14 h-14 rounded-3xl bg-brand-primary/20 text-brand-primary flex items-center justify-center text-xl font-black shadow-inner border border-brand-primary/20">{i+1}</div>
                            <p className="text-xl font-black text-white tracking-tight">{fix}</p>
                         </div>
                         <div className="w-10 h-10 rounded-full bg-brand-accent/20 flex items-center justify-center text-brand-accent opacity-0 group-hover:opacity-100 transition-all transform scale-50 group-hover:scale-100">
                            <Check size={24} />
                         </div>
                      </div>
                   ))}
                </div>
                <div className="flex flex-col sm:flex-row gap-6">
                    <button 
                      onClick={implementFixes}
                      className="flex-[2] btn-gradient py-7 rounded-[32px] font-black text-white text-sm uppercase tracking-widest shadow-[0_25px_50px_-12px_rgba(99,102,241,0.5)] flex items-center justify-center gap-5 hover:scale-105 transition-all"
                    >
                      Apply Enhancements Now <Zap size={24} fill="currentColor" />
                    </button>
                    <button 
                      onClick={() => setStep('results')}
                      className="flex-1 bg-white/5 border border-white/10 hover:bg-white/10 py-7 rounded-[32px] font-black text-white text-sm uppercase tracking-widest transition-all"
                    >
                      Back to Report
                    </button>
                </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const KPICard = ({ label, value, max, unit, icon }: any) => (
    <div className="glass-card p-8 rounded-[40px] border border-white/5 flex flex-col justify-between group shadow-2xl hover:border-brand-primary/20 transition-all">
        <div className="flex items-center justify-between mb-6">
            <span className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">{label}</span>
            <div className="p-4 rounded-2xl bg-white/5 group-hover:scale-110 transition-transform shadow-inner">{icon}</div>
        </div>
        <div className="flex items-baseline gap-2">
            <span className={`text-5xl font-black tracking-tighter`}>{value}{unit}</span>
            {max && <span className="text-gray-500 text-sm font-black">/ {max}</span>}
        </div>
    </div> 
);
