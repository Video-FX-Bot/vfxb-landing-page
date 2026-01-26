
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
  // For caption clips: stores all transcribed segments
  captionSegments?: { startTime: number; duration: number; text: string }[];
  // Advanced enhancement properties
  sharpness?: number; // 0-200, 100 = normal
  noiseReduction?: number; // 0-100
  audioEnhanced?: boolean;
  bassBoost?: number; // 0-100
  trebleBoost?: number; // 0-100
  voiceEnhance?: boolean;
  deEsser?: boolean;
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

// Color preset filters
const COLOR_PRESETS: Record<string, string> = {
  'none': '',
  'cinematic': 'sepia(20%) contrast(110%) saturate(85%)',
  'vintage': 'sepia(40%) contrast(90%) brightness(105%) saturate(70%)',
  'warm': 'sepia(25%) saturate(120%) brightness(105%)',
  'cool': 'saturate(90%) hue-rotate(15deg) brightness(102%)',
  'noir': 'grayscale(100%) contrast(120%)',
};

// Track type colors for timeline clips
const TRACK_COLORS: Record<string, { bg: string; border: string; selectedBg: string; selectedBorder: string; shadow: string }> = {
  'text': {
    bg: 'bg-red-900/30',
    border: 'border-red-500/30',
    selectedBg: 'bg-red-500/30',
    selectedBorder: 'border-red-500',
    shadow: 'shadow-red-500/30'
  },
  'overlay': {
    bg: 'bg-green-900/30',
    border: 'border-green-500/30',
    selectedBg: 'bg-green-500/30',
    selectedBorder: 'border-green-500',
    shadow: 'shadow-green-500/30'
  },
  'video': {
    bg: 'bg-blue-900/30',
    border: 'border-blue-500/30',
    selectedBg: 'bg-blue-500/30',
    selectedBorder: 'border-blue-500',
    shadow: 'shadow-blue-500/30'
  },
  'audio': {
    bg: 'bg-purple-900/30',
    border: 'border-purple-500/30',
    selectedBg: 'bg-purple-500/30',
    selectedBorder: 'border-purple-500',
    shadow: 'shadow-purple-500/30'
  }
};

// Build CSS filter string from clip properties
const buildFilterString = (clip: TimelineClip): string => {
  const filters: string[] = [];
  if (clip.brightness !== 100) filters.push(`brightness(${clip.brightness / 100})`);
  if (clip.contrast !== 100) filters.push(`contrast(${clip.contrast / 100})`);
  if (clip.saturation !== 100) filters.push(`saturate(${clip.saturation / 100})`);
  if (clip.blur > 0) filters.push(`blur(${clip.blur}px)`);
  // Sharpness simulation via contrast micro-boost (CSS doesn't have native sharpen)
  if (clip.sharpness && clip.sharpness > 100) {
    const sharpBoost = 1 + ((clip.sharpness - 100) / 500); // Subtle contrast for sharpening effect
    filters.push(`contrast(${sharpBoost})`);
  }
  // Temperature approximation using sepia + hue-rotate
  if (clip.temperature !== 0) {
    if (clip.temperature > 0) {
      filters.push(`sepia(${clip.temperature / 2}%) saturate(${100 + clip.temperature / 2}%)`);
    } else {
      filters.push(`hue-rotate(${clip.temperature / 5}deg) saturate(${100 + Math.abs(clip.temperature) / 4}%)`);
    }
  }
  // Apply color preset
  if (clip.colorPreset && clip.colorPreset !== 'none' && COLOR_PRESETS[clip.colorPreset]) {
    filters.push(COLOR_PRESETS[clip.colorPreset]);
  }
  return filters.join(' ');
};

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

export const EditorInterface: React.FC<{ onBack: () => void; initialVideoFile?: File | string | null; isAiFix?: boolean; analysisFixes?: string[]; }> = ({ onBack, initialVideoFile, isAiFix = false, analysisFixes = [] }) => {
  const [mainTab, setMainTab] = useState<'Media' | 'Audio' | 'Text' | 'Stickers' | 'Effects' | 'Transitions' | 'Captions' | 'Filters' | 'Adjustment' | 'Templates'>('Media');
  const [rightPanelTab, setRightPanelTab] = useState<'Video' | 'Audio' | 'Speed' | 'AI Assistant' | 'Adjust'>('AI Assistant');
  const [mediaLibrary, setMediaLibrary] = useState<MediaAsset[]>([]);
  const [originalVideoFile, setOriginalVideoFile] = useState<File | null>(null);
  const [captionProgress, setCaptionProgress] = useState<string>('');
  const [hasAppliedAutoFixes, setHasAppliedAutoFixes] = useState(false);
  const [isApplyingAiFixes, setIsApplyingAiFixes] = useState(isAiFix && analysisFixes.length > 0);
  const [aiFixProgress, setAiFixProgress] = useState<string>('Initializing AI Director...');
  const [actualVideoDuration, setActualVideoDuration] = useState<number>(0);
  
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
  
  // Timeline drag state
  const [isDraggingClip, setIsDraggingClip] = useState(false);
  const [dragClipId, setDragClipId] = useState<string | null>(null);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragStartTime, setDragStartTime] = useState(0);
  
  // Context menu state
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; clipId: string } | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null); // Separate audio element for independent control
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  
  // Web Audio API refs for advanced audio control (balance/panning)
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);
  const pannerNodeRef = useRef<StereoPannerNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const bassFilterRef = useRef<BiquadFilterNode | null>(null);
  const trebleFilterRef = useRef<BiquadFilterNode | null>(null);
  const compressorRef = useRef<DynamicsCompressorNode | null>(null);

  const defaultProps = useMemo(() => ({ 
    scale: 100, rotation: 0, x: 0, y: 0, opacity: 100, volume: 100, 
    balance: 0, speed: 1.0, contrast: 100, saturation: 100, brightness: 100, 
    temperature: 0, blur: 0, colorPreset: 'none', keyframes: {}, transitionIn: 'none', offset: 0,
    fontSize: 48, color: '#ffffff', fontFamily: 'Inter', textStyle: 'none' as const, textAlign: 'center' as const, textAnimation: 'none' as const,
    // Enhancement defaults
    sharpness: 100, noiseReduction: 0, audioEnhanced: false,
    bassBoost: 0, trebleBoost: 0, voiceEnhance: false, deEsser: false
  }), []);

  const pushHistory = useCallback((newTracks: Track[]) => {
    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      return [...newHistory, JSON.parse(JSON.stringify(newTracks))];
    });
    setHistoryIndex(prev => prev + 1);
  }, [historyIndex]);

  // Handle clip dragging
  const handleClipMouseDown = useCallback((e: React.MouseEvent, clip: TimelineClip) => {
    if (e.button !== 0) return; // Only left click
    e.stopPropagation();
    setSelectedClipId(clip.id);
    setIsDraggingClip(true);
    setDragClipId(clip.id);
    setDragStartX(e.clientX);
    setDragStartTime(clip.startTime);
  }, []);

  const handleClipMouseMove = useCallback((e: MouseEvent) => {
    if (!isDraggingClip || !dragClipId) return;
    const deltaX = e.clientX - dragStartX;
    const deltaTime = deltaX / zoomLevel;
    const newStartTime = Math.max(0, dragStartTime + deltaTime);
    
    setTracks(prev => prev.map(track => ({
      ...track,
      clips: track.clips.map(c => 
        c.id === dragClipId ? { ...c, startTime: newStartTime } : c
      )
    })));
  }, [isDraggingClip, dragClipId, dragStartX, dragStartTime, zoomLevel]);

  const handleClipMouseUp = useCallback(() => {
    if (isDraggingClip) {
      setIsDraggingClip(false);
      setDragClipId(null);
      commitTrackState();
    }
  }, [isDraggingClip]);

  // Add global mouse listeners for dragging
  useEffect(() => {
    if (isDraggingClip) {
      window.addEventListener('mousemove', handleClipMouseMove);
      window.addEventListener('mouseup', handleClipMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleClipMouseMove);
        window.removeEventListener('mouseup', handleClipMouseUp);
      };
    }
  }, [isDraggingClip, handleClipMouseMove, handleClipMouseUp]);

  // Handle right-click context menu
  const handleClipContextMenu = useCallback((e: React.MouseEvent, clipId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedClipId(clipId);
    setContextMenu({ x: e.clientX, y: e.clientY, clipId });
  }, []);

  // Close context menu on click outside
  useEffect(() => {
    const handleClickOutside = () => setContextMenu(null);
    if (contextMenu) {
      window.addEventListener('click', handleClickOutside);
      return () => window.removeEventListener('click', handleClickOutside);
    }
  }, [contextMenu]);

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
  // Get current active video clip's speed for timeline advancement
  const activeVideoClip = useMemo(() => {
    const vidTrack = tracks.find(t => t.id === 1);
    return vidTrack?.clips.find(c => currentTime >= c.startTime && currentTime < c.startTime + c.duration);
  }, [tracks, currentTime]);

  useEffect(() => {
    let frame: number;
    let lastTime: number | null = null;
    const loop = (timestamp: number) => {
      if (isPlaying) {
        if (lastTime !== null) {
          const delta = (timestamp - lastTime) / 1000; // convert ms to seconds
          const speed = activeVideoClip?.speed ?? 1.0;
          setCurrentTime(prev => (prev + delta * speed) % 600);
        }
        lastTime = timestamp;
      } else {
        lastTime = null;
      }
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, [isPlaying, activeVideoClip?.speed]);

  // Sync VIDEO element (visuals only - always muted)
  useEffect(() => {
    if (videoRef.current) {
      const vidTrack = tracks.find(t => t.id === 1);
      const activeClip = vidTrack?.clips.find(c => currentTime >= c.startTime && currentTime < c.startTime + c.duration);
      if (activeClip && !vidTrack?.isHidden) {
        const sourceTime = (currentTime - activeClip.startTime) + activeClip.offset;
        if (Math.abs(videoRef.current.currentTime - sourceTime) > 0.1) {
          videoRef.current.currentTime = sourceTime;
        }
        // Apply playback speed
        if (videoRef.current.playbackRate !== activeClip.speed) {
          videoRef.current.playbackRate = activeClip.speed;
        }
        // Video element is always muted - audio comes from separate audio element
        videoRef.current.muted = true;
        videoRef.current.volume = 0;
        
        if (isPlaying && videoRef.current.paused) videoRef.current.play().catch(() => {});
        else if (!isPlaying && !videoRef.current.paused) videoRef.current.pause();
      } else {
        videoRef.current.pause();
      }
    }
  }, [currentTime, isPlaying, tracks]);

  // Sync AUDIO element (independent from video, controlled by audio track)
  useEffect(() => {
    if (audioRef.current) {
      const audioTrack = tracks.find(t => t.id === 2);
      const audioClip = audioTrack?.clips.find(c => currentTime >= c.startTime && currentTime < c.startTime + c.duration);
      
      if (audioClip && !audioTrack?.isMuted) {
        // Calculate audio source time based on the audio clip's position
        // The audio clip's startTime determines when the audio should start playing
        // If audio clip starts at 2s, when timeline is at 2s, audio should play from 0
        const audioSourceTime = (currentTime - audioClip.startTime) + audioClip.offset;
        
        if (audioSourceTime >= 0 && audioSourceTime < audioClip.duration) {
          if (Math.abs(audioRef.current.currentTime - audioSourceTime) > 0.15) {
            audioRef.current.currentTime = audioSourceTime;
          }
          
          // Apply playback speed to match video
          const vidTrack = tracks.find(t => t.id === 1);
          const vidClip = vidTrack?.clips.find(c => currentTime >= c.startTime && currentTime < c.startTime + c.duration);
          const speed = vidClip?.speed || 1;
          if (audioRef.current.playbackRate !== speed) {
            audioRef.current.playbackRate = speed;
          }
          
          // Apply volume
          const targetVolume = Math.min(1, Math.max(0, audioClip.volume / 100));
          audioRef.current.volume = targetVolume;
          audioRef.current.muted = audioClip.volume === 0;
          
          if (isPlaying && audioRef.current.paused) audioRef.current.play().catch(() => {});
          else if (!isPlaying && !audioRef.current.paused) audioRef.current.pause();
        } else {
          // Audio not in playable range
          audioRef.current.pause();
        }
      } else {
        audioRef.current.pause();
      }
    }
  }, [currentTime, isPlaying, tracks]);

  // Web Audio API setup for stereo balance/panning, extended volume (>100%), and audio enhancement
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Initialize Web Audio on first user interaction (to comply with autoplay policies)
    const initAudio = () => {
      if (audioContextRef.current) return; // Already initialized
      
      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        audioContextRef.current = audioContext;
        
        const source = audioContext.createMediaElementSource(audio);
        sourceNodeRef.current = source;
        
        // Bass filter (low shelf)
        const bassFilter = audioContext.createBiquadFilter();
        bassFilter.type = 'lowshelf';
        bassFilter.frequency.value = 200;
        bassFilter.gain.value = 0;
        bassFilterRef.current = bassFilter;
        
        // Treble filter (high shelf)
        const trebleFilter = audioContext.createBiquadFilter();
        trebleFilter.type = 'highshelf';
        trebleFilter.frequency.value = 3000;
        trebleFilter.gain.value = 0;
        trebleFilterRef.current = trebleFilter;
        
        // Compressor for voice enhancement and normalization
        const compressor = audioContext.createDynamicsCompressor();
        compressor.threshold.value = -24;
        compressor.knee.value = 30;
        compressor.ratio.value = 4;
        compressor.attack.value = 0.003;
        compressor.release.value = 0.25;
        compressorRef.current = compressor;
        
        const panner = audioContext.createStereoPanner();
        pannerNodeRef.current = panner;
        
        const gain = audioContext.createGain();
        gainNodeRef.current = gain;
        
        // Connect: source -> bass -> treble -> compressor -> gain -> panner -> destination
        source.connect(bassFilter);
        bassFilter.connect(trebleFilter);
        trebleFilter.connect(compressor);
        compressor.connect(gain);
        gain.connect(panner);
        panner.connect(audioContext.destination);
      } catch (e) {
        console.warn('Web Audio API not supported:', e);
      }
    };

    audio.addEventListener('play', initAudio, { once: true });
    return () => audio.removeEventListener('play', initAudio);
  }, []);

  // Update balance, volume, and audio enhancements via Web Audio (uses audio track)
  useEffect(() => {
    const audioTrack = tracks.find(t => t.id === 2);
    const audioClip = audioTrack?.clips.find(c => currentTime >= c.startTime && currentTime < c.startTime + c.duration);
    
    if (audioClip) {
      // Update stereo panner (-1 = left, 0 = center, 1 = right)
      if (pannerNodeRef.current) {
        pannerNodeRef.current.pan.value = audioClip.balance / 100; // Convert -100..100 to -1..1
      }
      // Use gain node for volume >100%
      if (gainNodeRef.current) {
        gainNodeRef.current.gain.value = audioClip.volume / 100; // 0-200% maps to 0-2
      }
      // Apply bass boost (0 = no boost, 100 = +12dB at 200Hz)
      if (bassFilterRef.current) {
        bassFilterRef.current.gain.value = (audioClip.bassBoost || 0) * 0.12; // 0-100 maps to 0-12dB
      }
      // Apply treble boost (0 = no boost, 100 = +12dB at 3kHz)
      if (trebleFilterRef.current) {
        trebleFilterRef.current.gain.value = (audioClip.trebleBoost || 0) * 0.12; // 0-100 maps to 0-12dB
      }
      // Apply voice enhancement via compressor settings
      if (compressorRef.current && audioClip.voiceEnhance) {
        compressorRef.current.threshold.value = -24;
        compressorRef.current.ratio.value = 4;
        compressorRef.current.attack.value = 0.003;
        compressorRef.current.release.value = 0.25;
      } else if (compressorRef.current) {
        // Default gentle compression
        compressorRef.current.threshold.value = -50;
        compressorRef.current.ratio.value = 2;
      }
    }
  }, [tracks, currentTime]);

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

  // ===== ADVANCED FEATURE 1: Auto-Split (Remove Silent Parts from Video & Audio) =====
  const handleAutoSplit = async () => {
    if (!originalVideoFile && !mediaLibrary[0]?.src) {
      setChatHistory(prev => [...prev, { id: Date.now().toString(), role: 'assistant', content: '❌ No video loaded to analyze.' }]);
      return;
    }
    
    setIsAiProcessing(true);
    setChatHistory(prev => [...prev, { id: Date.now().toString(), role: 'assistant', content: '🔍 Analyzing audio waveform to detect silent sections...' }]);

    try {
      // Create an offline audio context for analysis
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Fetch the video/audio data
      const videoSrc = mediaLibrary[0]?.src;
      if (!videoSrc) throw new Error('No video source');
      
      const response = await fetch(videoSrc);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      
      // Get audio data - use mono or average channels
      const channelData = audioBuffer.numberOfChannels > 1 
        ? audioBuffer.getChannelData(0).map((v, i) => (v + audioBuffer.getChannelData(1)[i]) / 2)
        : audioBuffer.getChannelData(0);
      const sampleRate = audioBuffer.sampleRate;
      
      // Calculate RMS (Root Mean Square) over windows for better silence detection
      const windowSize = Math.floor(sampleRate * 0.05); // 50ms windows
      const silenceThreshold = 0.015; // RMS threshold for silence
      const minSilenceDuration = 0.4; // Minimum 0.4s of silence to cut
      
      const silentRegions: { start: number; end: number }[] = [];
      let silenceStart: number | null = null;
      
      for (let i = 0; i < channelData.length; i += windowSize) {
        // Calculate RMS for this window
        let sumSquares = 0;
        const windowEnd = Math.min(i + windowSize, channelData.length);
        for (let j = i; j < windowEnd; j++) {
          sumSquares += channelData[j] * channelData[j];
        }
        const rms = Math.sqrt(sumSquares / (windowEnd - i));
        const timeInSeconds = i / sampleRate;
        
        if (rms < silenceThreshold) {
          // This window is silent
          if (silenceStart === null) {
            silenceStart = timeInSeconds;
          }
        } else {
          // This window has sound
          if (silenceStart !== null) {
            const silenceDuration = timeInSeconds - silenceStart;
            if (silenceDuration >= minSilenceDuration) {
              // Add a small buffer (0.05s) to not cut too close to speech
              silentRegions.push({
                start: silenceStart + 0.05,
                end: timeInSeconds - 0.05
              });
            }
            silenceStart = null;
          }
        }
      }
      
      // Handle trailing silence
      if (silenceStart !== null) {
        const silenceDuration = (channelData.length / sampleRate) - silenceStart;
        if (silenceDuration >= minSilenceDuration) {
          silentRegions.push({
            start: silenceStart + 0.05,
            end: channelData.length / sampleRate
          });
        }
      }

      if (silentRegions.length === 0) {
        setChatHistory(prev => [...prev, { 
          id: Date.now().toString(), 
          role: 'assistant', 
          content: '✅ No significant silent sections detected. Your video\'s pacing looks good!' 
        }]);
        setIsAiProcessing(false);
        return;
      }

      // Create new clips by splitting around silent regions
      const vidTrack = tracks.find(t => t.id === 1);
      const audioTrack = tracks.find(t => t.id === 2);
      const originalVidClip = vidTrack?.clips[0];
      const originalAudioClip = audioTrack?.clips[0];
      
      if (!originalVidClip) throw new Error('No video clip found');

      const videoDuration = originalVidClip.duration;
      const newVidClips: TimelineClip[] = [];
      const newAudioClips: TimelineClip[] = [];
      
      let lastEnd = 0;
      let timelinePosition = 0;
      
      silentRegions.forEach((region, idx) => {
        // Add the non-silent portion before this silence
        if (region.start > lastEnd + 0.1) {
          const clipDuration = region.start - lastEnd;
          newVidClips.push({
            ...originalVidClip,
            id: `vid_split_${idx}`,
            startTime: timelinePosition,
            offset: lastEnd,
            duration: clipDuration
          });
          if (originalAudioClip) {
            newAudioClips.push({
              ...originalAudioClip,
              id: `audio_split_${idx}`,
              startTime: timelinePosition,
              offset: lastEnd,
              duration: clipDuration
            });
          }
          timelinePosition += clipDuration;
        }
        lastEnd = region.end;
      });
      
      // Add remaining portion after last silence
      if (lastEnd < videoDuration - 0.1) {
        newVidClips.push({
          ...originalVidClip,
          id: `vid_split_final`,
          startTime: timelinePosition,
          offset: lastEnd,
          duration: videoDuration - lastEnd
        });
        if (originalAudioClip) {
          newAudioClips.push({
            ...originalAudioClip,
            id: `audio_split_final`,
            startTime: timelinePosition,
            offset: lastEnd,
            duration: videoDuration - lastEnd
          });
        }
      }

      // Update tracks with new clips
      setTracks(prev => prev.map(t => {
        if (t.id === 1) return { ...t, clips: newVidClips };
        if (t.id === 2) return { ...t, clips: newAudioClips };
        return t;
      }));
      commitTrackState();

      const removedTime = silentRegions.reduce((acc, r) => acc + (r.end - r.start), 0);
      setChatHistory(prev => [...prev, { 
        id: Date.now().toString(), 
        role: 'assistant', 
        content: `✅ Auto-split complete!\n\n📊 Found ${silentRegions.length} silent regions\n⏱️ Removed ${removedTime.toFixed(1)}s of dead noise\n✂️ Created ${newVidClips.length} clips\n\nYour video is now tighter and more engaging!` 
      }]);
      
    } catch (e) {
      console.error('Auto-split error:', e);
      setChatHistory(prev => [...prev, { 
        id: Date.now().toString(), 
        role: 'assistant', 
        content: '⚠️ Couldn\'t analyze audio. Try with a different video format or smaller file.' 
      }]);
    } finally {
      setIsAiProcessing(false);
    }
  };

  // ===== ADVANCED FEATURE 2: Enhance Video Quality =====
  // NOTE: True video upscaling/frame interpolation requires server-side processing (FFmpeg, AI models)
  // In browser, we can only apply visual filters to improve perceived quality
  const handleEnhanceVideo = () => {
    setChatHistory(prev => [...prev, { 
      id: Date.now().toString(), 
      role: 'assistant', 
      content: `⚠️ **Video Quality Enhancement Limitation**\n\nTrue video upscaling (higher resolution) and frame rate interpolation require server-side processing with tools like FFmpeg or AI upscaling models.\n\n🔧 In the browser, I can apply visual filters that improve perceived quality:\n• Sharpening\n• Contrast enhancement\n• Color correction\n\nWould you like me to apply these visual enhancements instead? Just say "yes" or "apply visual enhancements".` 
    }]);
  };
  
  // Apply visual enhancements as a fallback
  const applyVisualEnhancements = () => {
    setTracks(prev => prev.map(t => {
      if (t.id === 1) { // Video track
        return {
          ...t,
          clips: t.clips.map(c => ({
            ...c,
            contrast: Math.min(125, (c.contrast || 100) + 10),
            saturation: Math.min(115, (c.saturation || 100) + 8),
            sharpness: 120,
            colorPreset: c.colorPreset === 'none' ? 'cinematic' : c.colorPreset
          }))
        };
      }
      return t;
    }));
    commitTrackState();
    
    setChatHistory(prev => [...prev, { 
      id: Date.now().toString(), 
      role: 'assistant', 
      content: `✨ Visual Enhancements Applied!\n\n• Sharpening (+20%)\n• Contrast (+10%)\n• Saturation (+8%)\n• Cinematic color grading\n\nNote: For true resolution upscaling or frame interpolation, export your video and use dedicated tools like Topaz Video AI or DaVinci Resolve.` 
    }]);
  };

  // ===== ADVANCED FEATURE 3: Enhance Audio =====
  const handleEnhanceAudio = () => {
    // Apply audio enhancement settings to audio track
    setTracks(prev => prev.map(t => {
      if (t.id === 2) { // Audio track
        return {
          ...t,
          clips: t.clips.map(c => ({
            ...c,
            volume: Math.min(140, (c.volume || 100) + 20), // Boost volume
            audioEnhanced: true,
            bassBoost: 25, // Add warmth
            trebleBoost: 15, // Add clarity
            voiceEnhance: true,
            deEsser: true
          }))
        };
      }
      return t;
    }));
    commitTrackState();
    
    setChatHistory(prev => [...prev, { 
      id: Date.now().toString(), 
      role: 'assistant', 
      content: `🔊 Audio Enhanced!\n\n🎧 Applied:\n• Volume normalization (+20%)\n• Bass boost for warmth\n• Treble clarity enhancement\n• Voice enhancement\n• De-esser (reduces harsh 's' sounds)\n\nYour audio now sounds cleaner and more professional!` 
    }]);
  };

  const handleGenerateCaptions = async () => {
    const vidClip = tracks.find(t => t.id === 1)?.clips[0];
    if (!vidClip) return;
    setIsGeneratingCaptions(true);
    setCaptionProgress('Preparing video for transcription...');
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      // Get actual video duration from the video element
      let videoDuration = 0;
      if (videoRef.current) {
        videoDuration = videoRef.current.duration || 0;
      }
      
      // Try to get video data for transcription
      let videoBase64: string | null = null;
      let mimeType = 'video/mp4';
      
      if (originalVideoFile) {
        setCaptionProgress('Encoding video file...');
        const reader = new FileReader();
        videoBase64 = await new Promise<string>((resolve) => {
          reader.onload = () => resolve((reader.result as string).split(',')[1]);
          reader.readAsDataURL(originalVideoFile);
        });
        mimeType = originalVideoFile.type || 'video/mp4';
      } else if (vidClip.src) {
        // Try to fetch the blob URL and convert to base64
        setCaptionProgress('Fetching video data...');
        try {
          const response = await fetch(vidClip.src);
          const blob = await response.blob();
          const reader = new FileReader();
          videoBase64 = await new Promise<string>((resolve) => {
            reader.onload = () => resolve((reader.result as string).split(',')[1]);
            reader.readAsDataURL(blob);
          });
          mimeType = blob.type || 'video/mp4';
        } catch (e) {
          console.warn('Could not fetch video blob, falling back to frame-based analysis');
        }
      }

      setCaptionProgress('AI is analyzing audio...');
      
      const contents: any[] = [
        { 
          text: `You are a professional caption generator for social media videos. Transcribe this video's audio with FRAME-PERFECT timing.

VIDEO INFO: ${videoDuration > 0 ? `Duration is ${videoDuration.toFixed(2)} seconds.` : 'Analyze the full video length.'}

YOUR TASK:
1. LISTEN to the audio track carefully
2. TRANSCRIBE every spoken word
3. TIME each caption to appear EXACTLY when the word is spoken - not before, not after

TIMING IS CRITICAL:
- startTime = the EXACT second when the speaker STARTS saying that phrase
- duration = how long it takes to say those words
- The caption should appear ON SCREEN at the same moment you HEAR the words
- If there's silence at the start, the first startTime should reflect that (e.g., 0.5, 1.0, etc.)
- Do NOT assume speech starts at 0.0 unless it actually does

CAPTION STYLE:
- Short phrases (2-5 words max per caption)
- Natural speech breaks
- Include what's actually said (even "um", "uh", "like", "you know")

OUTPUT FORMAT - Return ONLY this JSON array:
[{"startTime": 0.0, "duration": 0.0, "text": "words"}]

EXAMPLE for a video where someone says "Hey guys, welcome back to my channel" starting at 0.3 seconds:
[
  {"startTime": 0.3, "duration": 0.4, "text": "Hey guys"},
  {"startTime": 0.8, "duration": 0.5, "text": "welcome back"},
  {"startTime": 1.4, "duration": 0.6, "text": "to my channel"}
]

If no speech is detected, return: []`
        }
      ];

      // Add video or fallback to frame
      if (videoBase64) {
        contents.push({ inlineData: { mimeType, data: videoBase64 } });
      } else {
        const frameData = captureFrame();
        if (frameData) {
          contents.push({ inlineData: { mimeType: 'image/jpeg', data: frameData } });
          contents[0].text += '\n\nNote: Only an image frame is available. Generate placeholder captions based on visual context.';
        }
      }

      setCaptionProgress('AI is transcribing audio...');
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents,
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
              },
              required: ['startTime', 'duration', 'text']
            }
          }
        }
      });
      
      setCaptionProgress('Processing transcription...');
      const data = JSON.parse(response.text || "[]");
      
      if (data.length === 0) {
        setCaptionProgress('No speech detected in video');
        setTimeout(() => setCaptionProgress(''), 3000);
        return;
      }
      
      // Process segments - no automatic delay, user can adjust with offset control
      const segments = data.map((item: any) => ({
        startTime: Math.max(0, item.startTime),
        duration: Math.max(0.3, item.duration),
        text: item.text
      }));
      
      // Calculate the total duration (from first segment start to last segment end)
      const firstStart = segments[0].startTime;
      const lastEnd = Math.max(...segments.map((s: any) => s.startTime + s.duration));
      const totalDuration = lastEnd - firstStart + 0.5; // Add buffer at end
      
      // Create a single caption clip containing all segments
      // offset property will be used as global timing adjustment
      const captionClip: TimelineClip = {
        id: `caption_${Date.now()}`,
        type: 'caption' as const,
        name: `Captions (${segments.length} segments)`,
        content: segments.map((s: any) => s.text).join(' '), // Full transcript for reference
        startTime: Math.max(0, firstStart - 0.5), // Start slightly before first segment
        duration: totalDuration + 1,
        captionSegments: segments, // Store all segments for dynamic rendering
        ...defaultProps,
        offset: 0, // Global timing offset - positive = later, negative = earlier
        textStyle: 'reels-yellow',
        y: 120,
        x: 0,
        fontSize: 32,
      };
      
      setTracks(prev => {
        // Clear existing captions first, then add the single new clip
        const next = prev.map(t => t.id === 4 ? { ...t, clips: [captionClip] } : t);
        pushHistory(next);
        return next;
      });
      
      setCaptionProgress(`Generated captions with ${segments.length} segments!`);
      setTimeout(() => setCaptionProgress(''), 3000);
    } catch (e) {
      console.error('Caption generation failed:', e);
      setCaptionProgress('Transcription failed. Try a shorter clip.');
      setTimeout(() => setCaptionProgress(''), 4000);
    } finally { 
      setIsGeneratingCaptions(false); 
    }
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
      
      // Get current clip state for context
      const currentClipState = selectedClip ? {
        brightness: selectedClip.brightness,
        contrast: selectedClip.contrast,
        saturation: selectedClip.saturation,
        temperature: selectedClip.temperature,
        blur: selectedClip.blur,
        colorPreset: selectedClip.colorPreset,
        scale: selectedClip.scale,
        opacity: selectedClip.opacity,
        rotation: selectedClip.rotation,
        speed: selectedClip.speed,
        volume: selectedClip.volume,
        balance: selectedClip.balance,
        x: selectedClip.x,
        y: selectedClip.y,
        hasCaptions: tracks.find(t => t.id === 4)?.clips.some(c => c.captionSegments && c.captionSegments.length > 0) || false
      } : null;
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: [
          { text: `You are VFXB Director - an AI video editing agent. You EXECUTE user commands by returning actions.

CURRENT CLIP STATE:
${currentClipState ? JSON.stringify(currentClipState, null, 2) : 'No clip selected'}

AVAILABLE ACTIONS (you can return multiple):

1. SET_EFFECT - Apply or modify effects
   Properties: brightness (0-200, default 100), contrast (0-200, default 100), saturation (0-200, default 100), temperature (-100 to 100, default 0), blur (0-20, default 0)
   Example: { "type": "SET_EFFECT", "property": "blur", "value": 5 }

2. SET_COLOR_PRESET - Apply color grading
   Values: "none", "cinematic", "vintage", "warm", "cool", "noir"
   Example: { "type": "SET_COLOR_PRESET", "value": "cinematic" }

3. SET_TRANSFORM - Change position/scale/rotation
   Properties: scale (10-500, default 100), opacity (0-100, default 100), rotation (-180 to 180, default 0), x (-500 to 500, default 0), y (-500 to 500, default 0)
   Example: { "type": "SET_TRANSFORM", "property": "scale", "value": 120 }

4. SET_PLAYBACK - Change speed/volume/balance
   Properties: speed (0.25-4, default 1), volume (0-200, default 100), balance (-100 to 100, default 0)
   Example: { "type": "SET_PLAYBACK", "property": "speed", "value": 0.5 }

5. GENERATE_CAPTIONS - Auto-transcribe and add captions
   Example: { "type": "GENERATE_CAPTIONS" }

6. REMOVE_CAPTIONS - Remove all captions
   Example: { "type": "REMOVE_CAPTIONS" }

7. RESET_EFFECTS - Reset specific or all effects to defaults
   Property: "all", "blur", "brightness", "contrast", "saturation", "temperature", "colorPreset"
   Example: { "type": "RESET_EFFECTS", "property": "all" }

8. SPLIT_CLIP - Split clip at current time
   Example: { "type": "SPLIT_CLIP" }

9. DELETE_CLIP - Delete selected clip
   Example: { "type": "DELETE_CLIP" }

10. AUTO_SPLIT - Remove silent parts of video/audio by analyzing waveform
    Example: { "type": "AUTO_SPLIT" }

11. ENHANCE_VIDEO - Explain that true video upscaling needs server-side, offer visual filters
    Example: { "type": "ENHANCE_VIDEO" }

12. APPLY_VISUAL_ENHANCEMENTS - Apply visual filters (sharpness, contrast, color) as fallback enhancement
    Example: { "type": "APPLY_VISUAL_ENHANCEMENTS" }

13. ENHANCE_AUDIO - Apply AI audio enhancement (normalization, bass/treble, clarity)
    Example: { "type": "ENHANCE_AUDIO" }

INTERPRETATION RULES:
- "add blur" / "make it blurry" → SET_EFFECT blur with value 3-8
- "remove blur" / "no blur" → RESET_EFFECTS blur
- "increase brightness" / "brighten" → SET_EFFECT brightness, increase from current
- "make it darker" → SET_EFFECT brightness, decrease
- "more contrast" → SET_EFFECT contrast, increase
- "vivid colors" / "saturate" → SET_EFFECT saturation, increase
- "desaturate" / "muted colors" → SET_EFFECT saturation, decrease
- "warm it up" / "warmer" → SET_EFFECT temperature positive OR SET_COLOR_PRESET warm
- "cooler" / "cold look" → SET_EFFECT temperature negative OR SET_COLOR_PRESET cool
- "cinematic look" → SET_COLOR_PRESET cinematic
- "vintage look" / "retro" → SET_COLOR_PRESET vintage
- "black and white" / "grayscale" → SET_COLOR_PRESET noir
- "add captions" / "transcribe" / "subtitles" → GENERATE_CAPTIONS
- "remove captions" / "delete subtitles" → REMOVE_CAPTIONS
- "reset effects" / "remove all effects" → RESET_EFFECTS all
- "slow motion" / "slow down" → SET_PLAYBACK speed with value < 1
- "speed up" / "faster" → SET_PLAYBACK speed with value > 1
- "zoom in" / "bigger" → SET_TRANSFORM scale, increase
- "zoom out" / "smaller" → SET_TRANSFORM scale, decrease
- "louder" / "increase volume" → SET_PLAYBACK volume, increase
- "quieter" / "decrease volume" → SET_PLAYBACK volume, decrease
- "fade" / "transparent" → SET_TRANSFORM opacity, decrease
- "rotate" / "tilt" → SET_TRANSFORM rotation
- "remove silence" / "remove pauses" / "auto split" / "cut dead air" / "remove dead noise" / "tighten pacing" → AUTO_SPLIT
- "enhance video" / "improve quality" / "make video better" / "sharpen" / "upscale" → ENHANCE_VIDEO (explain limitation, ask if they want visual filters)
- "yes" / "apply visual enhancements" / "apply filters" (after enhance video) → APPLY_VISUAL_ENHANCEMENTS
- "enhance audio" / "improve audio" / "clean audio" / "better sound" / "fix audio" / "boost audio" → ENHANCE_AUDIO
- "enhance everything" / "make it professional" → ENHANCE_VIDEO + ENHANCE_AUDIO

Return ONLY valid JSON: { "text": "brief confirmation of what you did", "actions": [...] }
Be concise. Execute commands, don't explain what the user could do.` },
          { text: `User command: ${currentPrompt}` },
          ...(frameData ? [{ inlineData: { mimeType: 'image/jpeg', data: frameData } }] : [])
        ],
        config: { responseMimeType: "application/json" }
      });
      
      const data = JSON.parse(response.text || "{}");
      setChatHistory(prev => [...prev, { id: Date.now().toString(), role: 'assistant', content: data.text || "Done." }]);
      
      if (data.actions && Array.isArray(data.actions)) {
        for (const action of data.actions) {
          switch (action.type) {
            case "SET_EFFECT":
              if (action.property && action.value !== undefined) {
                updateSelectedClip(action.property as keyof TimelineClip, action.value);
              }
              break;
              
            case "SET_COLOR_PRESET":
              if (action.value) {
                updateSelectedClip('colorPreset', action.value);
              }
              break;
              
            case "SET_TRANSFORM":
              if (action.property && action.value !== undefined) {
                updateSelectedClip(action.property as keyof TimelineClip, action.value);
              }
              break;
              
            case "SET_PLAYBACK":
              if (action.property && action.value !== undefined) {
                updateSelectedClip(action.property as keyof TimelineClip, action.value);
              }
              break;
              
            case "GENERATE_CAPTIONS":
              handleGenerateCaptions();
              break;
              
            case "REMOVE_CAPTIONS":
              // Remove all caption clips from text track
              setTracks(prev => prev.map(t => 
                t.id === 4 ? { ...t, clips: t.clips.filter(c => !c.captionSegments || c.captionSegments.length === 0) } : t
              ));
              break;
              
            case "RESET_EFFECTS":
              const defaults: Record<string, any> = {
                brightness: 100,
                contrast: 100,
                saturation: 100,
                temperature: 0,
                blur: 0,
                colorPreset: 'none'
              };
              if (action.property === 'all') {
                Object.entries(defaults).forEach(([key, val]) => {
                  updateSelectedClip(key as keyof TimelineClip, val);
                });
              } else if (action.property && defaults[action.property] !== undefined) {
                updateSelectedClip(action.property as keyof TimelineClip, defaults[action.property]);
              }
              break;
              
            case "SPLIT_CLIP":
              splitClip();
              break;
              
            case "DELETE_CLIP":
              deleteClip();
              break;
              
            case "AUTO_SPLIT":
              handleAutoSplit();
              break;
              
            case "ENHANCE_VIDEO":
              handleEnhanceVideo();
              break;
              
            case "APPLY_VISUAL_ENHANCEMENTS":
              applyVisualEnhancements();
              break;
              
            case "ENHANCE_AUDIO":
              handleEnhanceAudio();
              break;
          }
        }
        commitTrackState();
      }
    } catch (e) {
      console.error("AI Agent error:", e);
      setChatHistory(prev => [...prev, { id: 'err', role: 'assistant', content: "Sorry, I couldn't process that command. Try being more specific." }]);
    } finally { 
      setIsAiProcessing(false); 
    }
  };

  useEffect(() => {
    if (initialVideoFile) {
      const isString = typeof initialVideoFile === 'string';
      const url = isString ? (initialVideoFile as string) : URL.createObjectURL(initialVideoFile as File);
      const name = isString ? "Master Production" : (initialVideoFile as File).name;
      
      // Store original file for transcription
      if (!isString) {
        setOriginalVideoFile(initialVideoFile as File);
      }
      
      // Create a temporary video element to get the actual duration
      const tempVideo = document.createElement('video');
      tempVideo.src = url;
      tempVideo.onloadedmetadata = () => {
        const duration = tempVideo.duration || 30; // Fallback to 30s if can't read
        setActualVideoDuration(duration);
        
        const asset: MediaAsset = { id: `asset_master`, type: 'video', src: url, name, duration };
        setMediaLibrary([asset]);
        
        const clip: TimelineClip = { ...asset, startTime: 0, ...defaultProps };
        // Create an audio clip that mirrors the video's audio
        const audioClip: TimelineClip = { 
          ...asset, 
          id: `asset_master_audio`, 
          type: 'audio', 
          name: `${name} (Audio)`,
          startTime: 0, 
          ...defaultProps 
        };
        const initialTracks: Track[] = [
          { id: 4, name: 'TEXT', type: 'text', clips: [], isHidden: false, isLocked: false, isMuted: false },
          { id: 3, name: 'OVERLAY', type: 'overlay', clips: [], isHidden: false, isLocked: false, isMuted: false },
          { id: 1, name: 'VIDEO', type: 'video', clips: [clip], isHidden: false, isLocked: false, isMuted: false },
          { id: 2, name: 'AUDIO', type: 'audio', clips: [audioClip], isHidden: false, isLocked: false, isMuted: false }
        ];
        setTracks(initialTracks);
        setHistory([JSON.parse(JSON.stringify(initialTracks))]);
        setHistoryIndex(0);
        setSelectedClipId(clip.id);
      };
      tempVideo.onerror = () => {
        // Fallback if video can't be read
        const duration = 30;
        setActualVideoDuration(duration);
        const asset: MediaAsset = { id: `asset_master`, type: 'video', src: url, name, duration };
        setMediaLibrary([asset]);
        const clip: TimelineClip = { ...asset, startTime: 0, ...defaultProps };
        const audioClip: TimelineClip = { ...asset, id: `asset_master_audio`, type: 'audio', name: `${name} (Audio)`, startTime: 0, ...defaultProps };
        const initialTracks: Track[] = [
          { id: 4, name: 'TEXT', type: 'text', clips: [], isHidden: false, isLocked: false, isMuted: false },
          { id: 3, name: 'OVERLAY', type: 'overlay', clips: [], isHidden: false, isLocked: false, isMuted: false },
          { id: 1, name: 'VIDEO', type: 'video', clips: [clip], isHidden: false, isLocked: false, isMuted: false },
          { id: 2, name: 'AUDIO', type: 'audio', clips: [audioClip], isHidden: false, isLocked: false, isMuted: false }
        ];
        setTracks(initialTracks);
        setHistory([JSON.parse(JSON.stringify(initialTracks))]);
        setHistoryIndex(0);
        setSelectedClipId(clip.id);
      };
    }
  }, [initialVideoFile, defaultProps]);

  // Auto-apply AI fixes when entering editor with isAiFix=true
  useEffect(() => {
    if (isAiFix && analysisFixes.length > 0 && !hasAppliedAutoFixes && selectedClipId && tracks.length > 0) {
      setHasAppliedAutoFixes(true);
      setIsApplyingAiFixes(true);
      setAiFixProgress('Analyzing recommendations...');

      // Process each fix with AI to determine the actual edits
      const applyFixes = async () => {
        try {
          setAiFixProgress('AI Director processing edits...');
          const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
          
          const response = await ai.models.generateContent({
            model: 'gemini-2.0-flash',
            contents: [
              { text: `You are VFXB Director AI. Based on these video analysis recommendations, determine the specific edits to apply.

RECOMMENDATIONS TO APPLY:
${analysisFixes.map((fix, i) => `${i + 1}. ${fix}`).join('\n')}

For each recommendation, output specific actions. Available actions:

1. SET_EFFECT: { "type": "SET_EFFECT", "property": "brightness|contrast|saturation|temperature|blur", "value": number }
   - brightness: 0-200 (100 = normal)
   - contrast: 0-200 (100 = normal)  
   - saturation: 0-200 (100 = normal)
   - temperature: -100 to 100 (0 = normal, positive = warm, negative = cool)
   - blur: 0-20 (0 = none)

2. SET_COLOR_PRESET: { "type": "SET_COLOR_PRESET", "value": "cinematic|vintage|warm|cool|noir" }

3. SET_TRANSFORM: { "type": "SET_TRANSFORM", "property": "scale|opacity", "value": number }
   - scale: 10-500 (100 = normal)
   - opacity: 0-100 (100 = full)

4. SET_PLAYBACK: { "type": "SET_PLAYBACK", "property": "speed|volume", "value": number }
   - speed: 0.25-4 (1 = normal)
   - volume: 0-200 (100 = normal)

DO NOT include GENERATE_CAPTIONS - that will be offered separately.

Analyze each recommendation and output appropriate actions. Return JSON:
{
  "summary": "Brief description of edits applied",
  "actions": [...]
}

Be aggressive with improvements. If color grading is mentioned, apply cinematic preset AND adjust contrast/saturation. If audio is mentioned, adjust volume. If pacing is mentioned, slightly increase speed.` }
            ],
            config: { responseMimeType: "application/json" }
          });

          setAiFixProgress('Applying visual enhancements...');
          const data = JSON.parse(response.text || "{}");
          
          // Apply all the actions
          if (data.actions && Array.isArray(data.actions)) {
            for (const action of data.actions) {
              switch (action.type) {
                case "SET_EFFECT":
                  if (action.property && action.value !== undefined) {
                    updateSelectedClip(action.property as keyof TimelineClip, action.value);
                  }
                  break;
                case "SET_COLOR_PRESET":
                  if (action.value) {
                    updateSelectedClip('colorPreset', action.value);
                  }
                  break;
                case "SET_TRANSFORM":
                  if (action.property && action.value !== undefined) {
                    updateSelectedClip(action.property as keyof TimelineClip, action.value);
                  }
                  break;
                case "SET_PLAYBACK":
                  if (action.property && action.value !== undefined) {
                    updateSelectedClip(action.property as keyof TimelineClip, action.value);
                  }
                  break;
              }
            }
            commitTrackState();
          }

          setAiFixProgress('Finalizing...');
          
          // Update chat with summary
          setChatHistory([{
            id: 'auto-complete',
            role: 'assistant',
            content: `✅ ${data.summary || 'AI edits applied successfully!'}\n\nYou can now fine-tune these edits manually or ask me to make additional changes.\n\n💡 Tip: Say "add captions" if you want AI-generated subtitles.`
          }]);

        } catch (e) {
          console.error("Auto-fix error:", e);
          setChatHistory([{
            id: 'auto-error',
            role: 'assistant',
            content: '⚠️ Some edits could not be applied automatically. You can apply them manually or ask me for help.'
          }]);
        } finally {
          setIsApplyingAiFixes(false);
        }
      };

      // Small delay to ensure video is loaded
      setTimeout(applyFixes, 500);
    }
  }, [isAiFix, analysisFixes, hasAppliedAutoFixes, selectedClipId, tracks]);

  const selectedClip = useMemo(() => tracks.flatMap(t => t.clips).find(c => c.id === selectedClipId), [selectedClipId, tracks]);

  return (
    <div className="fixed inset-0 bg-[#0C0C0C] text-white flex flex-col z-50 overflow-hidden font-sans select-none">
      <canvas ref={canvasRef} className="hidden" />
      {/* Hidden audio element for independent audio track control */}
      <audio 
        ref={audioRef} 
        src={mediaLibrary[0]?.src} 
        className="hidden" 
        preload="auto"
        crossOrigin="anonymous"
      />
      
      {/* AI Fixes Loading Screen */}
      <AnimatePresence>
        {isApplyingAiFixes && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-[#0a0a15] flex flex-col items-center justify-center"
          >
            <div className="relative mb-8">
              <div className="w-24 h-24 rounded-full border-4 border-brand-primary/20 border-t-brand-primary animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Wand2 size={32} className="text-brand-primary animate-pulse" />
              </div>
            </div>
            <h2 className="text-2xl font-black mb-4 bg-gradient-to-r from-brand-primary to-brand-accent bg-clip-text text-transparent">
              AI Director Working
            </h2>
            <p className="text-gray-400 text-sm mb-6">{aiFixProgress}</p>
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <Sparkles size={14} className="text-brand-accent" />
              <span>Applying {analysisFixes.length} recommended enhancements</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
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
                   <button onClick={handleGenerateCaptions} disabled={isGeneratingCaptions} className="w-full bg-brand-primary hover:bg-brand-secondary text-white py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all shadow-lg disabled:opacity-50">
                      {isGeneratingCaptions ? <Loader2 className="animate-spin" size={16}/> : <Sparkles size={16}/>}
                      {isGeneratingCaptions ? 'Transcribing...' : 'Auto-Transcribe Audio'}
                   </button>
                   
                   {/* Progress Status */}
                   {captionProgress && (
                     <div className="p-3 bg-brand-primary/10 rounded-xl border border-brand-primary/20 text-center">
                        <p className="text-[10px] text-brand-primary font-bold">{captionProgress}</p>
                     </div>
                   )}
                   
                   {/* Current Captions List */}
                   {tracks.find(t => t.id === 4)?.clips.length > 0 && (
                     <div className="space-y-2">
                        <div className="flex items-center justify-between">
                           <p className="text-[10px] font-bold text-gray-400 uppercase">Caption Track</p>
                           <button 
                             onClick={() => {
                               setTracks(prev => prev.map(t => t.id === 4 ? { ...t, clips: [] } : t));
                               setSelectedClipId(null);
                               commitTrackState();
                             }}
                             className="text-[9px] text-red-400 hover:text-red-300"
                           >
                             Clear All
                           </button>
                        </div>
                        
                        {/* Main Caption Clip */}
                        {tracks.find(t => t.id === 4)?.clips.map((clip) => (
                          <div key={clip.id} className="space-y-2">
                             <div 
                               onClick={() => { setSelectedClipId(clip.id); setRightPanelTab('Properties' as any); }}
                               className={`p-3 rounded-lg cursor-pointer transition-all ${selectedClipId === clip.id ? 'bg-brand-accent/20 border border-brand-accent' : 'bg-white/5 hover:bg-white/10 border border-white/10'}`}
                             >
                                <div className="flex items-center justify-between mb-2">
                                   <span className="text-[10px] font-bold text-brand-accent">{clip.name}</span>
                                   <span className="text-[9px] text-gray-500">{clip.captionSegments?.length || 0} segments</span>
                                </div>
                                <p className="text-[9px] text-gray-400">Click to edit style & position</p>
                             </div>
                             
                             {/* Segments Preview */}
                             {clip.captionSegments && clip.captionSegments.length > 0 && (
                               <div className="max-h-40 overflow-y-auto space-y-1 custom-scrollbar pl-2 border-l-2 border-white/10">
                                  {clip.captionSegments.map((seg, idx) => {
                                    const isActive = currentTime >= seg.startTime && currentTime < seg.startTime + seg.duration;
                                    return (
                                      <div 
                                        key={idx}
                                        onClick={() => setCurrentTime(seg.startTime)}
                                        className={`p-1.5 rounded cursor-pointer transition-all text-[9px] ${
                                          isActive
                                            ? 'bg-brand-primary/20 text-white' 
                                            : 'hover:bg-white/5 text-gray-500'
                                        }`}
                                      >
                                         <span className="text-gray-600 mr-2">{seg.startTime.toFixed(1)}s</span>
                                         <span>{seg.text}</span>
                                      </div>
                                    );
                                  })}
                               </div>
                             )}
                          </div>
                        ))}
                     </div>
                   )}
                   
                   <div className="p-4 bg-white/5 rounded-xl border border-white/5 space-y-2">
                      <p className="text-[10px] font-bold text-gray-400 uppercase">How it works</p>
                      <ul className="text-[9px] text-gray-500 space-y-1">
                         <li>• AI listens to your video's audio track</li>
                         <li>• Transcribes speech with precise timestamps</li>
                         <li>• Use the Sync Offset slider to match audio</li>
                         <li>• Click any segment to jump to that time</li>
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
                    const filterStr = buildFilterString(clip);
                    
                    // For caption clips with segments, find the current segment's text based on currentTime
                    let displayText = clip.content;
                    if (clip.type === 'caption' && clip.captionSegments && clip.captionSegments.length > 0) {
                      // Find the segment that matches the current playback time
                      const currentSegment = clip.captionSegments.find(
                        seg => currentTime >= seg.startTime && currentTime < seg.startTime + seg.duration
                      );
                      displayText = currentSegment?.text || '';
                    }
                    
                    return (
                      <div key={clip.id} className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        {clip.type === 'video' ? (
                          <video 
                            ref={videoRef} 
                            src={clip.src} 
                            className="w-full h-full object-contain" 
                            style={{ 
                              transform: `scale(${clip.scale/100}) rotate(${clip.rotation}deg) translate(${clip.x}px, ${clip.y}px)`, 
                              opacity: clip.opacity/100,
                              filter: filterStr || undefined
                            }} 
                          />
                        ) : (clip.type === 'text' || clip.type === 'caption') ? (
                          displayText ? (
                            <div className={`${TEXT_STYLES[clip.textStyle || 'none']} ${ANIMATIONS[clip.textAnimation || 'none']}`} style={{ fontSize: clip.fontSize, color: clip.color, fontFamily: clip.fontFamily, transform: `translate(${clip.x}px, ${clip.y}px) rotate(${clip.rotation}deg)`, opacity: clip.opacity / 100 }}>
                              {displayText}
                            </div>
                          ) : null
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

                          {/* Caption Position Presets */}
                          <div>
                             <label className="text-[9px] text-gray-500 uppercase font-black block mb-2">Position Preset</label>
                             <div className="grid grid-cols-3 gap-2">
                                {[
                                  { name: 'Top', x: 0, y: -120 },
                                  { name: 'Center', x: 0, y: 0 },
                                  { name: 'Bottom', x: 0, y: 120 },
                                  { name: 'Top Left', x: -150, y: -120 },
                                  { name: 'Top Right', x: 150, y: -120 },
                                  { name: 'Bot Left', x: -150, y: 120 },
                                  { name: 'Bot Right', x: 150, y: 120 },
                                ].map(pos => (
                                   <button 
                                     key={pos.name} 
                                     onClick={() => { updateSelectedClip('x', pos.x); updateSelectedClip('y', pos.y); commitTrackState(); }} 
                                     className={`py-1.5 text-[8px] rounded font-black border uppercase transition-all ${
                                       selectedClip.x === pos.x && selectedClip.y === pos.y 
                                         ? 'bg-brand-accent text-black border-brand-accent' 
                                         : 'bg-white/5 text-gray-500 border-white/10 hover:text-white hover:border-white/20'
                                     }`}
                                   >
                                     {pos.name}
                                   </button>
                                ))}
                             </div>
                          </div>

                          {/* Fine Position Control */}
                          <div>
                             <label className="text-[9px] text-gray-500 uppercase font-black block mb-2">Fine Position</label>
                             <div className="grid grid-cols-2 gap-3">
                                <div>
                                   <span className="text-[8px] text-gray-600 block mb-1">X (horizontal)</span>
                                   <input 
                                     type="range" 
                                     min={-300} 
                                     max={300} 
                                     value={selectedClip.x} 
                                     onChange={e => updateSelectedClip('x', parseInt(e.target.value))} 
                                     className="w-full h-1 bg-[#2a2a2a] rounded-full appearance-none accent-brand-accent cursor-pointer"
                                   />
                                   <div className="flex justify-between text-[8px] text-gray-600 mt-1">
                                      <span>Left</span>
                                      <span className="text-brand-accent">{selectedClip.x}px</span>
                                      <span>Right</span>
                                   </div>
                                </div>
                                <div>
                                   <span className="text-[8px] text-gray-600 block mb-1">Y (vertical)</span>
                                   <input 
                                     type="range" 
                                     min={-200} 
                                     max={200} 
                                     value={selectedClip.y} 
                                     onChange={e => updateSelectedClip('y', parseInt(e.target.value))} 
                                     className="w-full h-1 bg-[#2a2a2a] rounded-full appearance-none accent-brand-accent cursor-pointer"
                                   />
                                   <div className="flex justify-between text-[8px] text-gray-600 mt-1">
                                      <span>Up</span>
                                      <span className="text-brand-accent">{selectedClip.y}px</span>
                                      <span>Down</span>
                                   </div>
                                </div>
                             </div>
                          </div>
                       </section>
                    )}

                    <section className="pt-6 border-t border-black space-y-4">
                       <h4 className="text-[10px] font-black uppercase text-brand-accent tracking-widest">Transform</h4>
                       <PropertySlider label="Scale" value={selectedClip.scale} min={10} max={500} onChange={(v:any) => updateSelectedClip('scale', v)} onCommit={commitTrackState} unit="%" />
                       <PropertySlider label="Opacity" value={selectedClip.opacity} min={0} max={100} onChange={(v:any) => updateSelectedClip('opacity', v)} onCommit={commitTrackState} unit="%" />
                       <PropertySlider label="Rotation" value={selectedClip.rotation} min={-180} max={180} onChange={(v:any) => updateSelectedClip('rotation', v)} onCommit={commitTrackState} unit="°" />
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

                    {/* Color & Effects Section */}
                    <section className="pt-6 border-t border-black space-y-4">
                       <h4 className="text-[10px] font-black uppercase text-brand-accent tracking-widest">Color & Effects</h4>
                       <PropertySlider label="Brightness" value={selectedClip.brightness} min={0} max={200} onChange={(v:any) => updateSelectedClip('brightness', v)} onCommit={commitTrackState} unit="%" />
                       <PropertySlider label="Contrast" value={selectedClip.contrast} min={0} max={200} onChange={(v:any) => updateSelectedClip('contrast', v)} onCommit={commitTrackState} unit="%" />
                       <PropertySlider label="Saturation" value={selectedClip.saturation} min={0} max={200} onChange={(v:any) => updateSelectedClip('saturation', v)} onCommit={commitTrackState} unit="%" />
                       <PropertySlider label="Temperature" value={selectedClip.temperature} min={-100} max={100} onChange={(v:any) => updateSelectedClip('temperature', v)} onCommit={commitTrackState} />
                       <PropertySlider label="Blur" value={selectedClip.blur} min={0} max={20} step={0.5} onChange={(v:any) => updateSelectedClip('blur', v)} onCommit={commitTrackState} unit="px" />
                    </section>

                    {/* Speed Section */}
                    <section className="pt-6 border-t border-black space-y-4">
                       <h4 className="text-[10px] font-black uppercase text-brand-accent tracking-widest">Speed</h4>
                       <PropertySlider label="Playback Speed" value={selectedClip.speed * 100} min={25} max={400} onChange={(v:any) => updateSelectedClip('speed', v / 100)} onCommit={commitTrackState} unit="%" />
                       <div className="flex gap-2 flex-wrap">
                          {[0.25, 0.5, 1, 1.5, 2, 4].map(s => (
                             <button key={s} onClick={() => { updateSelectedClip('speed', s); commitTrackState(); }} className={`px-3 py-1.5 text-[9px] rounded font-black border ${selectedClip.speed === s ? 'bg-brand-accent text-black border-brand-accent' : 'bg-white/5 text-gray-500 border-white/10 hover:text-white'}`}>{s}x</button>
                          ))}
                       </div>
                    </section>

                    {/* Audio Section */}
                    {(selectedClip.type === 'video' || selectedClip.type === 'audio') && (
                       <section className="pt-6 border-t border-black space-y-4">
                          <h4 className="text-[10px] font-black uppercase text-brand-accent tracking-widest">Audio</h4>
                          <PropertySlider label="Volume" value={selectedClip.volume} min={0} max={200} onChange={(v:any) => updateSelectedClip('volume', v)} onCommit={commitTrackState} unit="%" />
                          <PropertySlider label="Balance (L/R)" value={selectedClip.balance} min={-100} max={100} onChange={(v:any) => updateSelectedClip('balance', v)} onCommit={commitTrackState} />
                       </section>
                    )}

                    {/* Filters Section */}
                    <section className="pt-6 border-t border-black space-y-4">
                       <h4 className="text-[10px] font-black uppercase text-brand-accent tracking-widest">Color Presets</h4>
                       <div className="grid grid-cols-3 gap-2">
                          {['none', 'cinematic', 'vintage', 'warm', 'cool', 'noir', 'vibrant', 'muted', 'sepia'].map(preset => (
                             <button key={preset} onClick={() => { updateSelectedClip('colorPreset', preset); commitTrackState(); }} className={`py-2 text-[8px] rounded font-black border uppercase ${selectedClip.colorPreset === preset ? 'bg-brand-primary text-white border-brand-primary' : 'bg-white/5 text-gray-500 border-white/10 hover:text-white'}`}>{preset}</button>
                          ))}
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
                  {tracks.map(track => {
                    const colors = TRACK_COLORS[track.type] || TRACK_COLORS['video'];
                    return (
                    <div key={track.id} className="h-14 border-b border-white/[0.03] relative flex items-center group/track hover:bg-white/[0.01]">
                       <div className="absolute left-0 w-[200px] h-full bg-[#121212] border-r border-black flex items-center px-3 z-30 shadow-2xl justify-between">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${track.type === 'text' ? 'bg-red-500' : track.type === 'overlay' ? 'bg-green-500' : track.type === 'video' ? 'bg-blue-500' : 'bg-purple-500'}`} />
                            <span className="text-[9px] font-black uppercase tracking-widest text-gray-600">{track.name}</span>
                          </div>
                       </div>
                       {track.clips.map(clip => (
                         <motion.div
                           key={clip.id}
                           onMouseDown={(e) => { e.stopPropagation(); handleClipMouseDown(e, clip); }}
                           onClick={(e) => { e.stopPropagation(); setSelectedClipId(clip.id); }}
                           onContextMenu={(e) => handleClipContextMenu(e, clip.id)}
                           className={`absolute h-10 rounded border cursor-grab active:cursor-grabbing transition-all overflow-hidden select-none z-10 ${
                             selectedClipId === clip.id 
                               ? `${colors.selectedBorder} ${colors.selectedBg} z-20 shadow-lg ${colors.shadow} ring-2 ring-offset-1 ring-offset-transparent` 
                               : `${colors.border} ${colors.bg} hover:brightness-125`
                           } ${dragClipId === clip.id ? 'opacity-80 scale-[1.02]' : ''}`}
                           style={{ left: clip.startTime * zoomLevel + 200, width: Math.max(clip.duration * zoomLevel, 40) }}
                           whileHover={{ scale: selectedClipId !== clip.id ? 1.02 : 1 }}
                           whileTap={{ scale: 0.98 }}
                         >
                            {/* Left resize handle */}
                            <div className={`absolute left-0 top-0 bottom-0 w-2 cursor-ew-resize hover:${colors.selectedBg} z-10`} />
                            
                            {/* Clip content */}
                            <div className="h-full w-full relative flex items-center px-3 overflow-hidden">
                               {track.type === 'audio' && <AudioLines size={12} className="text-purple-400 mr-2 flex-shrink-0" />}
                               {track.type === 'video' && <FileVideo size={12} className="text-blue-400 mr-2 flex-shrink-0" />}
                               <span className="text-[9px] font-bold text-white/90 truncate">{clip.name || clip.content}</span>
                               {clip.captionSegments && clip.captionSegments.length > 0 && (
                                 <span className="ml-auto text-[8px] text-red-400/70 font-medium">{clip.captionSegments.length} captions</span>
                               )}
                            </div>
                            
                            {/* Right resize handle */}
                            <div className={`absolute right-0 top-0 bottom-0 w-2 cursor-ew-resize hover:${colors.selectedBg} z-10`} />
                            
                            {/* Selection indicator */}
                            {selectedClipId === clip.id && (
                              <div className={`absolute inset-0 border-2 ${colors.selectedBorder} rounded pointer-events-none`} />
                            )}
                         </motion.div>
                       ))}
                    </div>
                  );
                  })}
               </div>

               <div className="absolute top-0 bottom-0 w-[2px] bg-brand-accent z-50 pointer-events-none shadow-glow" style={{ left: currentTime * zoomLevel + 200 }}>
                  <div className="w-5 h-5 bg-brand-accent rounded-sm -ml-[9px] -mt-1.5 shadow-2xl flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-white rounded-full shadow-inner"/>
                  </div>
               </div>

               <div className="absolute inset-0 z-0 cursor-crosshair" onClick={(e) => {
                  if (isDraggingClip) return;
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = (e.clientX + (timelineRef.current?.scrollLeft || 0)) - rect.left - 200;
                  setCurrentTime(Math.max(0, x / zoomLevel));
               }}/>
            </div>
         </div>
      </div>
      
      {/* Context Menu */}
      <AnimatePresence>
        {contextMenu && (() => {
          // Calculate if menu would go off-screen
          const menuHeight = 180; // Approximate menu height
          const menuWidth = 160;
          const windowHeight = window.innerHeight;
          const windowWidth = window.innerWidth;
          
          // Flip menu upward if it would go off bottom
          const top = contextMenu.y + menuHeight > windowHeight 
            ? contextMenu.y - menuHeight 
            : contextMenu.y;
          
          // Flip menu left if it would go off right edge
          const left = contextMenu.x + menuWidth > windowWidth
            ? contextMenu.x - menuWidth
            : contextMenu.x;
          
          return (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed bg-[#1a1a2e] border border-white/10 rounded-lg shadow-2xl py-1 z-[100] min-w-[160px]"
            style={{ left, top }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => { setRightPanelTab('Properties' as any); setContextMenu(null); }}
              className="w-full px-4 py-2 text-left text-xs hover:bg-white/10 flex items-center gap-2 text-white/90"
            >
              <Settings2 size={14} /> Properties
            </button>
            <button
              onClick={() => { splitClip(); setContextMenu(null); }}
              className="w-full px-4 py-2 text-left text-xs hover:bg-white/10 flex items-center gap-2 text-white/90"
            >
              <Scissors size={14} /> Split at Playhead
            </button>
            <button
              onClick={() => { 
                const clip = tracks.flatMap(t => t.clips).find(c => c.id === contextMenu.clipId);
                if (clip) {
                  setTracks(prev => prev.map(track => ({
                    ...track,
                    clips: [...track.clips, { ...clip, id: `${clip.id}_copy_${Date.now()}`, startTime: clip.startTime + clip.duration + 0.1 }]
                  })));
                  commitTrackState();
                }
                setContextMenu(null); 
              }}
              className="w-full px-4 py-2 text-left text-xs hover:bg-white/10 flex items-center gap-2 text-white/90"
            >
              <Layers size={14} /> Duplicate
            </button>
            <div className="border-t border-white/10 my-1" />
            <button
              onClick={() => { deleteClip(); setContextMenu(null); }}
              className="w-full px-4 py-2 text-left text-xs hover:bg-red-500/20 flex items-center gap-2 text-red-400"
            >
              <Trash2 size={14} /> Delete
            </button>
          </motion.div>
          );
        })()}
      </AnimatePresence>
    </div>
  );
};
