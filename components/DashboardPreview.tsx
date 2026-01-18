
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, Pause, Zap, TrendingUp, 
  Activity, Scan, AlertCircle, CheckCircle2, MonitorPlay,
  Loader2
} from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface DashboardProps {
  isFullMode?: boolean;
}

const VIDEO_SRC = "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4";

const mockAnalysisData = [
  { time: '0s', score: 85 },
  { time: '2s', score: 88 },
  { time: '4s', score: 70 }, 
  { time: '6s', score: 90 }, 
  { time: '8s', score: 82 },
  { time: '10s', score: 85 },
  { time: '12s', score: 80 },
];

export const DashboardPreview: React.FC<DashboardProps> = ({ isFullMode = false }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0); 
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const startAnalysis = () => {
    if (isAnalyzing || analysisStep === 3) return;
    setIsAnalyzing(true);
    setAnalysisStep(1);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
      setIsPlaying(true);
    }
    setTimeout(() => setAnalysisStep(2), 2500);
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysisStep(3);
      if (videoRef.current) videoRef.current.pause();
      setIsPlaying(false);
    }, 4000);
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else videoRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <section className={`relative py-12 lg:py-24 overflow-hidden ${isFullMode ? 'pt-4' : ''}`}>
       <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px]" />
       </div>

      {!isFullMode && (
        <div className="text-center mb-12 px-4 relative z-10">
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-brand-accent text-xs font-black uppercase tracking-wider mb-4">
             <Zap size={12} /> Interactive Preview
           </div>
           <h2 className="text-3xl md:text-5xl font-bold mb-4">The <span className="text-gradient">Viral Architecture</span></h2>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 lg:px-8 relative z-10">
        <div className="glass-card rounded-[32px] overflow-hidden flex flex-col lg:flex-row min-h-[600px] border border-white/10 shadow-2xl">
          
          <div className="lg:w-[60%] bg-[#0A0A16] relative flex flex-col border-r border-white/5">
            <div className="h-14 border-b border-white/5 bg-[#0A0A16] flex items-center justify-between px-4">
              <div className="flex items-center gap-2">
                 <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/80 shadow-[0_0_8px_rgba(239,68,68,0.5)]"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80 shadow-[0_0_8px_rgba(234,179,8,0.5)]"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/80 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
                 </div>
                 <span className="text-[10px] font-black uppercase tracking-widest text-gray-600 ml-4">Gemini 3 Pro Vision Feed</span>
              </div>
              <button 
                  onClick={analysisStep === 3 ? () => setAnalysisStep(0) : startAnalysis}
                  className="px-6 py-1.5 btn-gradient rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg"
              >
                  {analysisStep === 0 ? 'Run Scan' : analysisStep === 3 ? 'Reset' : 'Processing...'}
              </button>
            </div>

            <div className="flex-1 relative flex items-center justify-center bg-black overflow-hidden group cursor-pointer" onClick={togglePlay}>
                 <video
                    ref={videoRef}
                    src={VIDEO_SRC}
                    className="w-full h-full object-contain" 
                    playsInline
                 />
                 
                 <AnimatePresence>
                   {analysisStep === 1 && (
                     <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 pointer-events-none z-20">
                       <motion.div animate={{ top: ['0%', '100%'] }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} className="absolute left-0 right-0 h-0.5 bg-brand-accent shadow-[0_0_20px_#32B8C6]" />
                     </motion.div>
                   )}
                 </AnimatePresence>

                 {/* Desktop Play Button Overlay */}
                 {!isPlaying && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30">
                       <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center shadow-2xl">
                          <Play className="w-8 h-8 fill-white text-white ml-1.5" />
                       </div>
                    </div>
                 )}
            </div>
          </div>

          <div className="lg:w-[40%] bg-[#121225] flex flex-col">
            <div className="p-6 border-b border-white/5">
               <h3 className="font-black text-white flex items-center gap-3 uppercase tracking-widest text-sm">
                 <Activity className="text-brand-accent" size={18} /> Vital Metrics
               </h3>
            </div>

            <div className="flex-1 p-8 overflow-y-auto">
               {analysisStep < 3 ? (
                 <div className="h-full flex flex-col items-center justify-center text-center gap-6 opacity-60">
                    {analysisStep === 0 ? (
                       <>
                         <div className="w-20 h-20 rounded-[24px] bg-white/5 flex items-center justify-center animate-pulse border border-white/10">
                           <Scan size={32} className="text-brand-accent" />
                         </div>
                         <p className="text-xs font-black uppercase tracking-[0.3em] text-gray-500">Awaiting Signal</p>
                       </>
                    ) : (
                       <div className="flex flex-col items-center gap-4">
                          {/* Added missing Loader2 import and usage */}
                          <Loader2 className="animate-spin text-brand-primary" size={48} />
                          <p className="text-xs font-black uppercase tracking-[0.3em] text-brand-primary animate-pulse">Scanning...</p>
                       </div>
                    )}
                 </div>
               ) : (
                 <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                    <div className="bg-white/5 rounded-[32px] p-8 border border-white/10 shadow-inner">
                       <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-4">Viral Index</p>
                       <div className="flex items-baseline gap-4">
                          <span className="text-6xl font-black text-white">92</span>
                          <span className="text-lg text-gray-600 font-bold">/ 100</span>
                       </div>
                       <div className="mt-8 w-full bg-black/30 h-2 rounded-full overflow-hidden">
                          <motion.div initial={{ width: 0 }} animate={{ width: '92%' }} transition={{ duration: 1 }} className="h-full bg-brand-primary shadow-[0_0_15px_#6366f1]" />
                       </div>
                    </div>

                    <div className="space-y-4">
                       <InsightItem type="success" label="Hook Optimal" desc="Retention spike at 0:02." />
                       <InsightItem type="warning" label="Mid-Lapse" desc="Drop at 0:04. Edit recommended." />
                    </div>

                    <div className="h-44 mt-8">
                       <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={mockAnalysisData}>
                            <defs>
                              <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <Area type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={3} fill="url(#colorScore)" />
                          </AreaChart>
                       </ResponsiveContainer>
                    </div>
                 </motion.div>
               )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const InsightItem = ({ type, label, desc }: { type: 'success' | 'warning' | 'info', label: string, desc: string }) => {
  const colors = {
    success: 'bg-green-500/10 text-green-400 border-green-500/20',
    warning: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    info: 'bg-blue-500/10 text-blue-400 border-blue-500/20'
  };
  return (
    <div className={`flex items-start gap-4 p-4 rounded-2xl border ${colors[type]} shadow-sm`}>
       <div>
         <p className="text-xs font-black uppercase tracking-widest">{label}</p>
         <p className="text-[10px] opacity-70 font-medium leading-relaxed">{desc}</p>
       </div>
    </div>
  );
};
