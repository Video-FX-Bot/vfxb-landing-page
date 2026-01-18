
import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleGenAI, Type } from "@google/genai";
import { 
  Plus, ImageIcon, Trash2, SkipBack, SkipForward, CloudUpload, FileVideo, 
  Undo2, Redo2, MonitorPlay, Download, ZoomIn, ZoomOut, Scissors, 
  ArrowLeft, X, AudioLines, Settings2, Bot, User, Loader2, Sparkles,
  Play, Pause, Send, Maximize, MessageSquare, Volume2,
  Droplets, Palette, RotateCcw, Type as TextIcon, Sticker, Sparkle, 
  ArrowLeftRight, Languages, Filter, Sliders, LayoutTemplate, UserCircle2, Search, ListFilter,
  Mic, Music, LayoutGrid, ChevronDown, MoreHorizontal, History, Wand2, AlignCenter, AlignLeft, AlignRight, Bold,
  Quote, GripVertical, MoveUp, Zap, Eye, EyeOff, Lock, Unlock, VolumeX, Crop, Timer, Edit3, Layers, Scan,
  MousePointer2, Eraser, Frame, Ratio, Type as LucideType, Palette as ColorPicker
} from 'lucide-react';

type MediaType = 'video' | 'image' | 'audio' | 'text' | 'caption';

interface MediaAsset {
  id: string;
  type: MediaType;
  src?: string;
  content?: string;
  name: string;
  duration: number; 
  thumbnail?: string;
}

interface TimelineClip extends MediaAsset {
  startTime: number;
  offset: number;
  scale: number;
  rotation: number;
  x: number;
  y: number;
  opacity: number;
  volume: number;
  balance: number;
  speed: number;
  contrast: number;
  saturation: number;
  brightness: number;
  temperature: number;
  blur: number;
  colorPreset: string;
  keyframes: Record<string, boolean>;
  transitionIn: string;
  fontSize?: number;
  color?: string;
  fontFamily?: string;
  textStyle?: 'reels-yellow' | 'reels-white' | 'reels-black' | 'modern-bold' | 'none';
  textAlign?: 'left' | 'center' | 'right';
  textAnimation?: 'none' | 'fade' | 'zoom' | 'slide-up' | 'pop' | 'typewriter';
}

interface Track {
  id: number;
  name: string;
  type: 'video' | 'audio' | 'overlay' | 'text';
  clips: TimelineClip[];
  isHidden: boolean;
  isLocked: boolean;
  isMuted: boolean;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const TEXT_STYLES = {
  'reels-yellow': 'bg-yellow-400 text-black px-4 py-1 rounded-md font-black italic shadow-lg uppercase inline-block',
  'reels-white': 'bg-white text-black px-4 py-1 rounded-sm font-black shadow-lg inline-block',
  'reels-black': 'bg-black text-white px-4 py-1 rounded-sm font-black border border-white/20 inline-block',
  'modern-bold': 'text-white font-extrabold drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] tracking-tighter uppercase inline-block',
  'none': 'text-white font-medium inline-block'
};

const ANIMATIONS = {
  none: '',
  fade: 'animate-in fade-in duration-500',
  zoom: 'animate-in zoom-in duration-500',
  'slide-up': 'animate-in slide-in-from-bottom-10 duration-500',
  pop: 'animate-in zoom-in-50 duration-300',
  typewriter: 'overflow-hidden whitespace-nowrap border-r-2 animate-pulse'
};

const FONTS = ['Inter', 'Roboto', 'Oswald', 'Montserrat', 'Bebas Neue', 'Playfair Display'];

const PropertySlider = ({ label, value, min, max, step = 1, onChange, onCommit, unit = '' }: any) => (
  <div className="mb-4 group">
    <div className="flex justify-between items-center mb-1.5 px-1">
      <span className="text-[11px] text-gray-400 font-medium">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-[11px] text-gray-200 font-mono">{typeof value === 'number' ? value.toFixed(0) : value}{unit}</span>
        <button className="text-gray-600 hover:text-white" onClick={() => onChange(min === 0 ? 100 : 0)}><RotateCcw size={10}/></button>
      </div>
    </div>
    <div className="relative h-6 flex items-center">
      <input 
        type="range" min={min} max={max} step={step} value={value} 
        onChange={e => onChange(parseFloat(e.target.value))}
        onMouseUp={() => onCommit && onCommit()}
        className="w-full h-1 bg-[#2a2a2a] rounded-full appearance-none accent-brand-accent cursor-pointer" 
      />
    </div>
  </div>
);

export const EditorInterface: React.FC<{ onBack: () => void; initialVideoFile?: File | string | null; isAiFix?: boolean; }> = ({ onBack, initialVideoFile, isAiFix = false }) => {
  const [mainTab, setMainTab] = useState<'Media' | 'Audio' | 'Text' | 'Stickers' | 'Effects' | 'Transitions' | 'Captions' | 'Filters' | 'Adjustment' | 'Templates'>('Media');
  const [rightPanelTab, setRightPanelTab] = useState<'Video' | 'Audio' | 'Speed' | 'AI Assistant' | 'Adjust'>('AI Assistant');
  const [mediaLibrary, setMediaLibrary] = useState<MediaAsset[]>([]);
  
  const [tracks, setTracks] = useState<Track[]>([
    { id: 4, name: 'TEXT', type: 'text', clips: [], isHidden: false, isLocked: false, isMuted: false },
    { id: 3, name: 'OVERLAY', type: 'overlay', clips: [], isHidden: false, isLocked: false, isMuted: false },
    { id: 1, name: 'VIDEO', type: 'video', clips: [], isHidden: false, isLocked: false, isMuted: false },
    { id: 2, name: 'AUDIO', type: 'audio', clips: [], isHidden: false, isLocked: false, isMuted: false }
  ]);

  const [history, setHistory] = useState<Track[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [selectedClipId, setSelectedClipId] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(120);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [promptInput, setPromptInput] = useState('');
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [isGeneratingCaptions, setIsGeneratingCaptions] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  const defaultProps = useMemo(() => ({ 
    scale: 100, rotation: 0, x: 0, y: 0, opacity: 100, volume: 100, 
    balance: 0, speed: 1.0, contrast: 100, saturation: 100, brightness: 100, 
    temperature: 0, blur: 0, colorPreset: 'none', keyframes: {}, transitionIn: 'none', offset: 0,
    fontSize: 48, color: '#ffffff', fontFamily: 'Inter', textStyle: 'none' as const, textAlign: 'center' as const, textAnimation: 'none' as const
  }), []);

  const pushHistory = useCallback((newTracks: Track[]) => {
    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      return [...newHistory, JSON.parse(JSON.stringify(newTracks))];
    });
    setHistoryIndex(prev => prev + 1);
  }, [historyIndex]);

  const commitTrackState = useCallback(() => {
    pushHistory(tracks);
  }, [pushHistory, tracks]);

  const undo = () => {
    if (historyIndex > 0) {
      setTracks(JSON.parse(JSON.stringify(history[historyIndex - 1])));
      setHistoryIndex(historyIndex - 1);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setTracks(JSON.parse(JSON.stringify(history[historyIndex + 1])));
      setHistoryIndex(historyIndex + 1);
    }
  };

  const updateSelectedClip = useCallback((key: keyof TimelineClip, value: any) => {
    if (!selectedClipId) return;
    setTracks(prev => {
      const next = prev.map(t => ({
        ...t,
        clips: t.clips.map(c => c.id === selectedClipId ? { ...c, [key]: value } : c)
      }));
      return next;
    });
  }, [selectedClipId]);

  const captureFrame = useCallback((): string | null => {
    if (!videoRef.current || !canvasRef.current) return null;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg', 0.8).split(',')[1];
  }, []);

  const formatTimeCode = (time: number) => {
    const min = Math.floor(time / 60);
    const sec = Math.floor(time % 60);
    const ms = Math.floor((time % 1) * 100);
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}:${ms.toString().padStart(2, '0')}`;
  };

  // Timeline & Video Logic
  useEffect(() => {
    let frame: number;
    const loop = () => {
      if (isPlaying) {
        setCurrentTime(prev => (prev + 0.016) % 600);
      }
      frame = requestAnimationFrame(loop);
    };
    loop();
    return () => cancelAnimationFrame(frame);
  }, [isPlaying]);

  useEffect(() => {
    if (videoRef.current) {
      const vidTrack = tracks.find(t => t.id === 1);
      const activeClip = vidTrack?.clips.find(c => currentTime >= c.startTime && currentTime < c.startTime + c.duration);
      if (activeClip && !vidTrack?.isHidden) {
        const sourceTime = (currentTime - activeClip.startTime) + activeClip.offset;
        if (Math.abs(videoRef.current.currentTime - sourceTime) > 0.1) {
          videoRef.current.currentTime = sourceTime;
        }
        if (isPlaying && videoRef.current.paused) videoRef.current.play().catch(() => {});
        else if (!isPlaying && !videoRef.current.paused) videoRef.current.pause();
      } else {
        videoRef.current.pause();
      }
    }
  }, [currentTime, isPlaying, tracks]);

  const splitClip = () => {
    if (!selectedClipId) return;
    setTracks(prev => {
      const next = prev.map(t => {
        const idx = t.clips.findIndex(c => c.id === selectedClipId);
        if (idx === -1) return t;
        const clip = t.clips[idx];
        const localTime = currentTime - clip.startTime;
        if (localTime <= 0.1 || localTime >= clip.duration - 0.1) return t;
        const left = { ...clip, duration: localTime };
        const right = { ...clip, id: `clip_${Date.now()}`, startTime: currentTime, duration: clip.duration - localTime, offset: clip.offset + localTime };
        const newClips = [...t.clips];
        newClips.splice(idx, 1, left, right);
        return { ...t, clips: newClips };
      });
      pushHistory(next);
      return next;
    });
  };

  const deleteClip = () => {
    if (!selectedClipId) return;
    setTracks(prev => {
      const next = prev.map(t => ({ ...t, clips: t.clips.filter(c => c.id !== selectedClipId) }));
      pushHistory(next);
      return next;
    });
    setSelectedClipId(null);
  };

  const handleGenerateCaptions = async () => {
    const vidClip = tracks.find(t => t.id === 1)?.clips[0];
    if (!vidClip) return;
    setIsGeneratingCaptions(true);
    try {
      const frameData = captureFrame();
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [
          { text: `Transcribe the speech and generate viral captions for a video about "${vidClip.name}". Use the provided image frame for context. Output strictly JSON: [{startTime, duration, text}]` },
          ...(frameData ? [{ inlineData: { mimeType: 'image/jpeg', data: frameData } }] : [])
        ],
        config: { 
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                startTime: { type: Type.NUMBER },
                duration: { type: Type.NUMBER },
                text: { type: Type.STRING }
              }
            }
          }
        }
      });
      const data = JSON.parse(response.text || "[]");
      const newClips: TimelineClip[] = data.map((item: any, idx: number) => ({
        id: `caption_${Date.now()}_${idx}`,
        type: 'caption' as const,
        name: `Caption ${idx + 1}`,
        content: item.text,
        startTime: item.startTime,
        duration: item.duration,
        ...defaultProps,
        textStyle: 'reels-yellow',
        y: 60,
      }));
      setTracks(prev => {
        const next = prev.map(t => t.id === 4 ? { ...t, clips: [...t.clips, ...newClips] } : t);
        pushHistory(next);
        return next;
      });
    } catch (e) {
      console.error(e);
    } finally { setIsGeneratingCaptions(false); }
  };

  const handleSendMessage = async () => {
    if (!promptInput.trim()) return;
    setIsAiProcessing(true);
    const userMsg = { id: Date.now().toString(), role: 'user' as const, content: promptInput };
    setChatHistory(prev => [...prev, userMsg]);
    const currentPrompt = promptInput;
    setPromptInput('');
    try {
      const frameData = captureFrame();
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [
          { text: `You are VFXB Director. You help users edit videos. 
          Capabilities:
          - Describe the video: Look at the provided frame.
          - Add captions: Use GENERATE_CAPTIONS action.
          - Change properties: SET_PROPERTY (scale, opacity, fontSize, color, speed, rotation).
          - Split: SPLIT_CLIP.
          - Delete: DELETE_CLIP.
          
          Return JSON: { "text": "assistant reply", "actions": [{ type, key, value }] }` },
          { text: currentPrompt },
          ...(frameData ? [{ inlineData: { mimeType: 'image/jpeg', data: frameData } }] : [])
        ],
        config: { responseMimeType: "application/json" }
      });
      const data = JSON.parse(response.text || "{}");
      setChatHistory(prev => [...prev, { id: Date.now().toString(), role: 'assistant', content: data.text || "Neural logic applied." }]);
      if (data.actions) {
        data.actions.forEach((a: any) => {
          if (a.type === "GENERATE_CAPTIONS") handleGenerateCaptions();
          if (a.type === "SPLIT_CLIP") splitClip();
          if (a.type === "DELETE_CLIP") deleteClip();
          if (a.type === "SET_PROPERTY") updateSelectedClip(a.key, a.value);
        });
        commitTrackState();
      }
    } catch (e) {
      setChatHistory(prev => [...prev, { id: 'err', role: 'assistant', content: "Neural engine requires recalibration. Please rephrase." }]);
    } finally { setIsAiProcessing(false); }
  };

  useEffect(() => {
    if (initialVideoFile) {
      const isString = typeof initialVideoFile === 'string';
      const url = isString ? (initialVideoFile as string) : URL.createObjectURL(initialVideoFile as File);
      const name = isString ? "Master Production" : (initialVideoFile as File).name;
      const asset: MediaAsset = { id: `asset_master`, type: 'video', src: url, name, duration: 120 };
      setMediaLibrary([asset]);
      const clip: TimelineClip = { ...asset, startTime: 0, ...defaultProps };
      const initialTracks: Track[] = [
        { id: 4, name: 'TEXT', type: 'text', clips: [], isHidden: false, isLocked: false, isMuted: false },
        { id: 3, name: 'OVERLAY', type: 'overlay', clips: [], isHidden: false, isLocked: false, isMuted: false },
        { id: 1, name: 'VIDEO', type: 'video', clips: [clip], isHidden: false, isLocked: false, isMuted: false },
        { id: 2, name: 'AUDIO', type: 'audio', clips: [], isHidden: false, isLocked: false, isMuted: false }
      ];
      setTracks(initialTracks);
      setHistory([JSON.parse(JSON.stringify(initialTracks))]);
      setHistoryIndex(0);
      setSelectedClipId(clip.id);
    }
  }, [initialVideoFile, defaultProps]);

  const selectedClip = useMemo(() => tracks.flatMap(t => t.clips).find(c => c.id === selectedClipId), [selectedClipId, tracks]);

  return (
    <div className="fixed inset-0 bg-[#0C0C0C] text-white flex flex-col z-50 overflow-hidden font-sans select-none">
      <canvas ref={canvasRef} className="hidden" />
      
      {/* Top Bar */}
      <div className="h-10 bg-[#1A1A1A] border-b border-black flex items-center px-4 justify-between z-40">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 cursor-pointer" onClick={onBack}>
             <div className="w-5 h-5 bg-brand-primary rounded-sm flex items-center justify-center font-black italic">V</div>
             <span className="font-bold text-xs">VFXB Studio</span>
          </div>
          <div className="flex bg-white/5 rounded-lg p-0.5 border border-white/10">
             {['Edit', 'Export'].map(m => <button key={m} className={`px-4 py-0.5 text-[10px] rounded font-bold ${m === 'Edit' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white'}`}>{m}</button>)}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={undo} className="text-gray-400 hover:text-white"><Undo2 size={16}/></button>
          <button onClick={redo} className="text-gray-400 hover:text-white"><Redo2 size={16}/></button>
          <button className="bg-brand-accent text-black hover:opacity-90 px-5 py-1 rounded text-[11px] font-black uppercase flex items-center gap-2">
             <Download size={14}/> Export
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Side: Library */}
        <div className="w-[340px] bg-[#141414] border-r border-black flex flex-col">
           <div className="flex border-b border-white/5">
              {['Media', 'Audio', 'Text', 'Captions'].map(t => (
                <button key={t} onClick={() => setMainTab(t as any)} className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest ${mainTab === t ? 'text-brand-accent border-b border-brand-accent' : 'text-gray-500 hover:text-gray-300'}`}>{t}</button>
              ))}
           </div>
           
           <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
              {mainTab === 'Captions' && (
                <div className="space-y-4">
                   <button onClick={handleGenerateCaptions} disabled={isGeneratingCaptions} className="w-full bg-brand-primary hover:bg-brand-secondary text-white py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all shadow-lg">
                      {isGeneratingCaptions ? <Loader2 className="animate-spin" size={16}/> : <Sparkles size={16}/>}
                      Auto-Generate Captions
                   </button>
                   <div className="p-4 bg-white/5 rounded-xl border border-white/5 space-y-2 opacity-60">
                      <p className="text-[10px] font-bold text-gray-400 uppercase">Pro Tips</p>
                      <ul className="text-[9px] text-gray-500 space-y-1">
                         <li>• High viral retention with colored keywords.</li>
                         <li>• AI timing syncs captions to visual beats.</li>
                      </ul>
                   </div>
                </div>
              )}
              {mainTab === 'Text' && (
                <div className="grid grid-cols-2 gap-3">
                   {['Default', 'Headline', 'Subtext', 'Neon', 'Modern'].map(t => (
                     <button key={t} onClick={() => {
                        const newClip = { id: `text_${Date.now()}`, type: 'text' as const, name: t, content: 'Double click to edit', startTime: currentTime, duration: 3, ...defaultProps };
                        setTracks(prev => prev.map(tr => tr.id === 4 ? { ...tr, clips: [...tr.clips, newClip] } : tr));
                        setSelectedClipId(newClip.id);
                        commitTrackState();
                     }} className="aspect-video bg-black/40 border border-white/5 rounded-lg flex items-center justify-center hover:border-brand-accent group">
                        <span className={`text-[10px] font-black ${t === 'Neon' ? 'text-brand-accent drop-shadow-[0_0_5px_rgba(50,184,198,0.5)]' : 'text-gray-500 group-hover:text-white'}`}>{t}</span>
                     </button>
                   ))}
                </div>
              )}
              {mainTab === 'Media' && (
                <div className="space-y-3">
                   <button onClick={() => fileInputRef.current?.click()} className="w-full border border-dashed border-white/10 p-8 rounded-xl flex flex-col items-center justify-center gap-2 hover:border-brand-primary hover:bg-brand-primary/5 transition-all text-gray-500 hover:text-brand-primary">
                      <Plus size={24}/>
                      <span className="text-[10px] font-bold uppercase">Import File</span>
                   </button>
                   <input ref={fileInputRef} type="file" multiple className="hidden" onChange={(e) => {
                      const files = e.target.files;
                      if (files) Array.from(files).forEach((f: File) => {
                        const url = URL.createObjectURL(f);
                        setMediaLibrary(prev => [...prev, { id: `asset_${Date.now()}`, type: 'video', src: url, name: f.name, duration: 60 }]);
                      });
                   }} />
                   {mediaLibrary.map(asset => (
                      <div key={asset.id} className="group relative rounded-lg bg-black overflow-hidden aspect-video border border-white/5 cursor-pointer hover:border-brand-accent" onClick={() => {
                        const trackIdx = asset.type === 'video' ? 2 : 1;
                        const newClip = { ...asset, id: `clip_${Date.now()}`, startTime: currentTime, ...defaultProps };
                        setTracks(prev => prev.map((t, idx) => idx === trackIdx ? { ...t, clips: [...t.clips, newClip as TimelineClip] } : t));
                        setSelectedClipId(newClip.id);
                        commitTrackState();
                      }}>
                         <div className="absolute inset-0 flex items-center justify-center opacity-30"><FileVideo size={24}/></div>
                         <div className="absolute bottom-1 left-1 text-[8px] text-white/50 truncate w-[80%]">{asset.name}</div>
                      </div>
                   ))}
                </div>
              )}
           </div>
        </div>

        {/* Center: Preview */}
        <div className="flex-1 flex flex-col bg-[#0A0A0A] relative">
           <div className="flex-1 relative flex items-center justify-center p-12">
              <div className="aspect-video w-full max-w-4xl bg-black relative shadow-3xl rounded-sm overflow-hidden border border-white/5">
                 {tracks.slice().reverse().map(track => {
                    if (track.isHidden) return null;
                    const clip = track.clips.find(c => currentTime >= c.startTime && currentTime < c.startTime + c.duration);
                    if (!clip) return null;
                    return (
                      <div key={clip.id} className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        {clip.type === 'video' ? (
                          <video ref={videoRef} src={clip.src} className="w-full h-full object-contain" style={{ transform: `scale(${clip.scale/100}) rotate(${clip.rotation}deg)`, opacity: clip.opacity/100 }} />
                        ) : (clip.type === 'text' || clip.type === 'caption') ? (
                          <div className={`${TEXT_STYLES[clip.textStyle || 'none']} ${ANIMATIONS[clip.textAnimation || 'none']}`} style={{ fontSize: clip.fontSize, color: clip.color, fontFamily: clip.fontFamily, transform: `translate(${clip.x}px, ${clip.y}px) rotate(${clip.rotation}deg)` }}>
                            {clip.content}
                          </div>
                        ) : null}
                      </div>
                    );
                 })}
                 <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/90 to-transparent flex items-center px-6 justify-between">
                    <div className="flex items-center gap-6">
                       <span className="text-[11px] font-mono text-brand-accent bg-black/40 px-3 py-1 rounded border border-white/5">{formatTimeCode(currentTime)}</span>
                       <button onClick={() => setIsPlaying(!isPlaying)} className="hover:scale-110 transition-transform bg-brand-primary text-white p-2.5 rounded-full shadow-lg shadow-brand-primary/20">
                          {isPlaying ? <Pause size={20} fill="currentColor"/> : <Play size={20} fill="currentColor" className="ml-0.5"/>}
                       </button>
                    </div>
                    <div className="flex items-center gap-4 text-gray-500">
                       <button className="hover:text-white"><Ratio size={16}/></button>
                       <button className="hover:text-white"><Maximize size={16}/></button>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* Right Side: AI & Props */}
        <div className="w-[340px] bg-[#141414] border-l border-black flex flex-col">
           <div className="flex border-b border-black">
              {['AI Assistant', 'Properties'].map(t => (
                <button key={t} onClick={() => setRightPanelTab(t as any)} className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest ${rightPanelTab === t ? 'text-brand-accent border-b border-brand-accent' : 'text-gray-500 hover:text-gray-300'}`}>{t}</button>
              ))}
           </div>
           
           <div className="flex-1 overflow-y-auto custom-scrollbar p-5 flex flex-col">
              {rightPanelTab === 'AI Assistant' ? (
                <div className="h-full flex flex-col">
                   <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pb-4" ref={chatScrollRef}>
                      {chatHistory.length === 0 && (
                        <div className="h-full flex flex-col items-center justify-center text-center opacity-20">
                           <Bot size={48} className="mb-4 text-brand-primary"/>
                           <p className="text-[10px] font-black uppercase tracking-[0.2em]">Neural AI Director Active</p>
                           <p className="text-[8px] mt-2 italic">"Describe the clip" or "Add viral captions"</p>
                        </div>
                      )}
                      {chatHistory.map(m => (
                        <div key={m.id} className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : ''}`}>
                          <div className={`max-w-[85%] p-3.5 rounded-2xl text-[11px] leading-relaxed shadow-xl ${m.role === 'user' ? 'bg-brand-primary text-white rounded-tr-none' : 'bg-[#1E1E2E] border border-white/5 text-gray-300 rounded-tl-none'}`}>
                            {m.content}
                          </div>
                        </div>
                      ))}
                      {isAiProcessing && <div className="text-[9px] text-brand-accent animate-pulse flex items-center gap-2"><Loader2 size={12} className="animate-spin"/> Scanning frame...</div>}
                   </div>
                   <div className="relative mt-auto border-t border-white/5 pt-4 bg-[#141414]">
                      <input value={promptInput} onChange={e => setPromptInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSendMessage()} placeholder="Instruct AI Director..." className="w-full bg-black/40 border border-white/5 rounded-xl py-3 pl-4 pr-12 text-[11px] outline-none focus:border-brand-primary transition-all"/>
                      <button onClick={handleSendMessage} className="absolute right-2 bottom-3 p-2 text-brand-primary hover:scale-110 transition-transform"><Send size={18}/></button>
                   </div>
                </div>
              ) : selectedClip ? (
                 <div className="space-y-6">
                    {(selectedClip.type === 'text' || selectedClip.type === 'caption') && (
                       <section className="space-y-4">
                          <h4 className="text-[10px] font-black uppercase text-brand-accent tracking-widest">Text Content</h4>
                          <textarea value={selectedClip.content} onChange={e => updateSelectedClip('content', e.target.value)} className="w-full bg-black/40 border border-white/5 rounded-lg p-3 text-xs outline-none focus:border-brand-accent h-24 resize-none" placeholder="Enter text..."/>
                          
                          <div className="grid grid-cols-2 gap-3">
                             <div>
                                <label className="text-[9px] text-gray-500 uppercase font-black block mb-2">Font Size</label>
                                <input type="number" value={selectedClip.fontSize} onChange={e => updateSelectedClip('fontSize', parseInt(e.target.value))} className="w-full bg-black/40 border border-white/5 rounded p-2 text-xs outline-none"/>
                             </div>
                             <div>
                                <label className="text-[9px] text-gray-500 uppercase font-black block mb-2">Color</label>
                                <div className="flex gap-2">
                                   <input type="color" value={selectedClip.color} onChange={e => updateSelectedClip('color', e.target.value)} className="w-full h-8 rounded cursor-pointer bg-transparent border-none"/>
                                </div>
                             </div>
                          </div>

                          <div>
                             <label className="text-[9px] text-gray-500 uppercase font-black block mb-2">Font Family</label>
                             <select value={selectedClip.fontFamily} onChange={e => updateSelectedClip('fontFamily', e.target.value)} className="w-full bg-black/40 border border-white/5 rounded p-2 text-xs outline-none appearance-none">
                                {FONTS.map(f => <option key={f} value={f}>{f}</option>)}
                             </select>
                          </div>

                          <div>
                             <label className="text-[9px] text-gray-500 uppercase font-black block mb-2">Text Style</label>
                             <div className="grid grid-cols-2 gap-2">
                                {Object.keys(TEXT_STYLES).map(s => (
                                   <button key={s} onClick={() => updateSelectedClip('textStyle', s)} className={`py-2 text-[8px] rounded font-black border uppercase ${selectedClip.textStyle === s ? 'bg-brand-accent text-black border-brand-accent' : 'bg-white/5 text-gray-500 border-white/10 hover:text-white'}`}>{s.replace('-', ' ')}</button>
                                ))}
                             </div>
                          </div>

                          <div>
                             <label className="text-[9px] text-gray-500 uppercase font-black block mb-2">Animation</label>
                             <div className="grid grid-cols-3 gap-2">
                                {Object.keys(ANIMATIONS).map(a => (
                                   <button key={a} onClick={() => updateSelectedClip('textAnimation', a)} className={`py-1.5 text-[8px] rounded font-black border uppercase ${selectedClip.textAnimation === a ? 'bg-brand-primary text-white border-brand-primary' : 'bg-white/5 text-gray-500 border-white/10'}`}>{a}</button>
                                ))}
                             </div>
                          </div>
                       </section>
                    )}

                    <section className="pt-6 border-t border-black space-y-4">
                       <h4 className="text-[10px] font-black uppercase text-brand-accent tracking-widest">Transform</h4>
                       <PropertySlider label="Scale" value={selectedClip.scale} min={10} max={500} onChange={(v:any) => updateSelectedClip('scale', v)} onCommit={commitTrackState} unit="%" />
                       <PropertySlider label="Opacity" value={selectedClip.opacity} min={0} max={100} onChange={(v:any) => updateSelectedClip('opacity', v)} onCommit={commitTrackState} unit="%" />
                       <div className="grid grid-cols-2 gap-4">
                          <div className="bg-black/20 p-2 rounded">
                             <span className="text-[9px] text-gray-600 block mb-1">X Offset</span>
                             <input type="number" value={selectedClip.x} onChange={e => updateSelectedClip('x', parseInt(e.target.value))} className="bg-transparent w-full text-xs font-mono outline-none"/>
                          </div>
                          <div className="bg-black/20 p-2 rounded">
                             <span className="text-[9px] text-gray-600 block mb-1">Y Offset</span>
                             <input type="number" value={selectedClip.y} onChange={e => updateSelectedClip('y', parseInt(e.target.value))} className="bg-transparent w-full text-xs font-mono outline-none"/>
                          </div>
                       </div>
                    </section>
                 </div>
              ) : (
                 <div className="h-full flex flex-col items-center justify-center text-center opacity-10">
                    <MonitorPlay size={48} className="mb-4"/>
                    <p className="text-[10px] font-black uppercase tracking-widest">Select clip for settings</p>
                 </div>
              )}
           </div>
        </div>
      </div>

      {/* Bottom Timeline */}
      <div className="h-[280px] bg-[#0A0A0A] flex flex-col relative z-30 border-t border-black">
         <div className="h-10 bg-[#141414] border-b border-black flex items-center px-4 justify-between">
            <div className="flex items-center gap-4 text-gray-500">
               <button onClick={splitClip} className="hover:text-brand-accent p-1.5 hover:bg-white/5 rounded transition-all"><Scissors size={18}/></button>
               <button onClick={deleteClip} className="hover:text-red-500 p-1.5 hover:bg-white/5 rounded transition-all"><Trash2 size={18}/></button>
               <div className="w-[1px] h-4 bg-white/5 mx-2"/>
               <button className="hover:text-white p-1.5 hover:bg-white/5 rounded"><Crop size={18}/></button>
               <button className="hover:text-white p-1.5 hover:bg-white/5 rounded"><Layers size={18}/></button>
            </div>
            <div className="flex items-center gap-4">
               <ZoomOut size={14} className="text-gray-600 cursor-pointer" onClick={() => setZoomLevel(Math.max(20, zoomLevel - 20))}/>
               <input type="range" min="20" max="600" value={zoomLevel} onChange={e => setZoomLevel(Number(e.target.value))} className="w-32 accent-brand-accent h-1 rounded-full appearance-none bg-white/10"/>
               <ZoomIn size={14} className="text-gray-600 cursor-pointer" onClick={() => setZoomLevel(Math.min(800, zoomLevel + 20))}/>
            </div>
         </div>

         <div ref={timelineRef} className="flex-1 overflow-x-auto custom-scrollbar relative bg-[#0C0C0C]">
            <div className="relative h-full" style={{ width: '10000px' }}>
               <div className="h-6 border-b border-white/5 relative flex items-end">
                  {Array.from({ length: 500 }).map((_, i) => (
                    <div key={i} className={`absolute h-full flex items-end pb-1 border-l ${i % 10 === 0 ? 'border-white/20' : i % 5 === 0 ? 'border-white/5' : 'border-transparent'}`} style={{ left: i * (zoomLevel / 10) + 200 }}>
                       {i % 10 === 0 && <span className="text-[8px] text-gray-600 font-bold ml-1">{i/10}s</span>}
                    </div>
                  ))}
               </div>

               <div className="flex flex-col">
                  {tracks.map(track => (
                    <div key={track.id} className="h-14 border-b border-white/[0.03] relative flex items-center group/track hover:bg-white/[0.01]">
                       <div className="absolute left-0 w-[200px] h-full bg-[#121212] border-r border-black flex items-center px-3 z-30 shadow-2xl justify-between">
                          <span className="text-[9px] font-black uppercase tracking-widest text-gray-600">{track.name}</span>
                       </div>
                       {track.clips.map(clip => (
                         <motion.div
                           key={clip.id}
                           onClick={(e) => { e.stopPropagation(); setSelectedClipId(clip.id); }}
                           className={`absolute h-10 rounded border cursor-pointer transition-all overflow-hidden ${selectedClipId === clip.id ? 'border-brand-accent bg-brand-accent/20 z-20 shadow-lg' : 'border-white/10 bg-[#1E1E2E] hover:border-white/20'}`}
                           style={{ left: clip.startTime * zoomLevel + 200, width: clip.duration * zoomLevel }}
                         >
                            <div className="h-full w-full relative flex items-center px-3 overflow-hidden pointer-events-none">
                               <span className="text-[9px] font-bold text-white/80 truncate">{clip.name || clip.content}</span>
                            </div>
                         </motion.div>
                       ))}
                    </div>
                  ))}
               </div>

               <div className="absolute top-0 bottom-0 w-[2px] bg-brand-accent z-50 pointer-events-none shadow-glow" style={{ left: currentTime * zoomLevel + 200 }}>
                  <div className="w-5 h-5 bg-brand-accent rounded-sm -ml-[9px] -mt-1.5 shadow-2xl flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-white rounded-full shadow-inner"/>
                  </div>
               </div>

               <div className="absolute inset-0 z-0 cursor-crosshair" onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = (e.clientX + (timelineRef.current?.scrollLeft || 0)) - rect.left - 200;
                  setCurrentTime(Math.max(0, x / zoomLevel));
               }}/>
            </div>
         </div>
      </div>
    </div>
  );
};
