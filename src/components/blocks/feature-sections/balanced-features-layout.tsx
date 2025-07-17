"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Zap,
    Gauge,
    Sparkles,
    Mic,
    Smartphone,
    MousePointer,
    Palette,
    Wand2
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { StandardHeader } from '@/components/ui/standard-header';

interface FeatureMetrics {
    value: number;
    label: string;
    change: number;
}

interface Feature {
    id: string;
    title: string;
    description: string;
    icon: React.ComponentType<any>;
    status: 'active' | 'processing' | 'complete';
    metrics: FeatureMetrics[];
    preview: React.ReactNode;
    gradient: string;
}

const AnimatedCounter = ({ value, duration = 2000 }: { value: number; duration?: number }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let start = 0;
        const end = value;
        const increment = end / (duration / 16);

        const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
                setCount(end);
                clearInterval(timer);
            } else {
                setCount(Math.floor(start));
            }
        }, 16);

        return () => clearInterval(timer);
    }, [value, duration]);

    return <span>{count}</span>;
};

const AIEditingPreview = () => {
    const [progress, setProgress] = useState(0);
    const [stage, setStage] = useState('analyzing');

    useEffect(() => {
        const timer = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    setStage(prev => {
                        const stages = ['analyzing', 'cutting', 'enhancing', 'finalizing'];
                        const currentIndex = stages.indexOf(prev);
                        return stages[(currentIndex + 1) % stages.length];
                    });
                    return 0;
                }
                return prev + 2;
            });
        }, 50);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
                <span className="text-cyan-400 capitalize">{stage}</span>
                <span className="text-purple-400">{progress}%</span>
            </div>
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <motion.div
                    className="h-full bg-gradient-to-r from-purple-500 to-cyan-500"
                    style={{ width: `${progress}%` }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
            </div>
            <div className="grid grid-cols-4 gap-1">
                {[...Array(8)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="h-8 bg-gray-800 rounded"
                        animate={{
                            backgroundColor: i * 12.5 <= progress ? '#8b5cf6' : '#1f2937',
                            scale: i * 12.5 <= progress ? 1.05 : 1
                        }}
                        transition={{ duration: 0.3 }}
                    />
                ))}
            </div>
        </div>
    );
};

const RealTimeRenderingPreview = () => {
    const [fps, setFps] = useState(120);
    const [renderTime, setRenderTime] = useState(0.8);

    useEffect(() => {
        const timer = setInterval(() => {
            setFps(prev => 118 + Math.random() * 4);
            setRenderTime(prev => 0.7 + Math.random() * 0.3);
        }, 100);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="space-y-4">
            <div className="relative h-20 bg-gray-900 rounded-lg overflow-hidden">
                <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-cyan-600/20"
                    animate={{
                        x: ['-100%', '100%']
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'linear'
                    }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-cyan-400">{fps.toFixed(0)}</div>
                        <div className="text-xs text-gray-400">FPS</div>
                    </div>
                </div>
            </div>
            <div className="text-center">
                <div className="text-sm text-purple-400">Render: {renderTime.toFixed(1)}ms</div>
            </div>
        </div>
    );
};

const VFXLibraryPreview = () => {
    const effects = ['Particle System', 'Lens Flare', 'Depth of Field', 'Motion Blur'];
    const [activeEffect, setActiveEffect] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setActiveEffect(prev => (prev + 1) % effects.length);
        }, 1500);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
                {effects.map((effect, i) => (
                    <motion.div
                        key={effect}
                        className={`p-2 rounded text-xs text-center transition-all ${
                            i === activeEffect
                                ? 'bg-purple-600 text-white'
                                : 'bg-gray-800 text-gray-400'
                        }`}
                        animate={{
                            scale: i === activeEffect ? 1.05 : 1,
                            borderColor: i === activeEffect ? '#8b5cf6' : '#374151'
                        }}
                    >
                        {effect}
                    </motion.div>
                ))}
            </div>
            <div className="text-center text-sm text-cyan-400">
                {effects[activeEffect]} Applied
            </div>
        </div>
    );
};

const VoiceSynthesisPreview = () => {
    const [waveform, setWaveform] = useState<number[]>([]);
    const [isRecording, setIsRecording] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => {
            if (isRecording) {
                setWaveform(prev => {
                    const newWave = [...prev, Math.random() * 100];
                    return newWave.slice(-20);
                });
            }
        }, 50);

        const recordingTimer = setInterval(() => {
            setIsRecording(prev => !prev);
        }, 3000);

        return () => {
            clearInterval(timer);
            clearInterval(recordingTimer);
        };
    }, [isRecording]);

    return (
        <div className="space-y-3">
            <div className="flex items-center gap-2">
                <motion.div
                    className={`w-3 h-3 rounded-full ${isRecording ? 'bg-red-500' : 'bg-gray-600'}`}
                    animate={{
                        scale: isRecording ? [1, 1.2, 1] : 1
                    }}
                    transition={{
                        duration: 0.5,
                        repeat: isRecording ? Infinity : 0
                    }}
                />
                <span className="text-sm text-gray-400">
          {isRecording ? 'Recording...' : 'Processing...'}
        </span>
            </div>
            <div className="flex items-end gap-1 h-12">
                {waveform.map((height, i) => (
                    <motion.div
                        key={i}
                        className="w-1 bg-gradient-to-t from-purple-600 to-cyan-400 rounded-full"
                        style={{ height: `${height}%` }}
                        animate={{ height: `${height}%` }}
                        transition={{ duration: 0.1 }}
                    />
                ))}
            </div>
        </div>
    );
};

const SmartResizingPreview = () => {
    const [currentSize, setCurrentSize] = useState({ width: 100, height: 60 });
    const sizes = [
        { width: 100, height: 60, label: '16:9' },
        { width: 60, height: 100, label: '9:16' },
        { width: 80, height: 80, label: '1:1' },
        { width: 120, height: 50, label: '21:9' }
    ];
    const [sizeIndex, setSizeIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setSizeIndex(prev => (prev + 1) % sizes.length);
        }, 2000);

        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        setCurrentSize(sizes[sizeIndex]);
    }, [sizeIndex]);

    return (
        <div className="space-y-3">
            <div className="flex justify-center">
                <motion.div
                    className="bg-gradient-to-br from-purple-600 to-cyan-600 rounded"
                    animate={{
                        width: currentSize.width,
                        height: currentSize.height
                    }}
                    transition={{
                        type: 'spring',
                        stiffness: 200,
                        damping: 25
                    }}
                />
            </div>
            <div className="text-center text-sm text-purple-400">
                {sizes[sizeIndex].label}
            </div>
        </div>
    );
};

const MotionTrackingPreview = () => {
    const [trackedPoints, setTrackedPoints] = useState<{x: number, y: number}[]>([]);

    useEffect(() => {
        const timer = setInterval(() => {
            setTrackedPoints(prev => {
                const newPoint = {
                    x: Math.random() * 100,
                    y: Math.random() * 100
                };
                return [...prev, newPoint].slice(-10);
            });
        }, 200);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="space-y-3">
            <div className="relative h-24 bg-gray-900 rounded-lg overflow-hidden">
                {trackedPoints.map((point, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-2 h-2 bg-cyan-400 rounded-full"
                        style={{
                            left: `${point.x}%`,
                            top: `${point.y}%`
                        }}
                        animate={{
                            scale: [1, 1.5, 1],
                            opacity: [1, 0.6, 0.3]
                        }}
                        transition={{
                            duration: 2,
                            ease: 'easeOut'
                        }}
                    />
                ))}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-xs text-gray-400">Motion Tracking Active</div>
                </div>
            </div>
        </div>
    );
};

const ColorGradingPreview = () => {
    const [colorShift, setColorShift] = useState(0);
    const colors = ['hue-rotate-0', 'hue-rotate-90', 'hue-rotate-180', 'hue-rotate-270'];

    useEffect(() => {
        const timer = setInterval(() => {
            setColorShift(prev => (prev + 1) % colors.length);
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="space-y-3">
            <div className="grid grid-cols-3 gap-2">
                {[...Array(6)].map((_, i) => (
                    <motion.div
                        key={i}
                        className={`h-8 rounded ${colors[colorShift]}`}
                        style={{
                            background: `linear-gradient(45deg, 
                hsl(${i * 60 + colorShift * 90}, 70%, 50%), 
                hsl(${i * 60 + colorShift * 90 + 30}, 70%, 60%))`
                        }}
                        animate={{
                            filter: `hue-rotate(${colorShift * 90}deg)`
                        }}
                        transition={{ duration: 0.5 }}
                    />
                ))}
            </div>
            <div className="text-center text-sm text-purple-400">
                Color Grade: {['Natural', 'Warm', 'Cool', 'Vintage'][colorShift]}
            </div>
        </div>
    );
};

const features: Feature[] = [
    {
        id: 'ai-editing',
        title: 'AI-Powered Auto-Editing',
        description: 'Advanced machine learning algorithms automatically cut, arrange, and optimize your video content with professional precision.',
        icon: Zap,
        status: 'active',
        metrics: [
            { value: 85, label: 'Accuracy', change: 12 },
            { value: 340, label: 'Edits/min', change: 8 }
        ],
        preview: <AIEditingPreview />,
        gradient: 'from-purple-600/20 to-cyan-600/20'
    },
    {
        id: 'real-time-rendering',
        title: 'Real-Time Rendering',
        description: 'Instantly preview your changes with GPU-accelerated rendering at 120fps.',
        icon: Gauge,
        status: 'active',
        metrics: [
            { value: 120, label: 'FPS', change: 15 }
        ],
        preview: <RealTimeRenderingPreview />,
        gradient: 'from-cyan-600/20 to-purple-600/20'
    },
    {
        id: 'vfx-library',
        title: 'Advanced VFX Library',
        description: 'Professional-grade visual effects and transitions library with over 500 presets.',
        icon: Sparkles,
        status: 'complete',
        metrics: [
            { value: 520, label: 'Effects', change: 45 }
        ],
        preview: <VFXLibraryPreview />,
        gradient: 'from-purple-600/20 to-pink-600/20'
    },
    {
        id: 'voice-synthesis',
        title: 'Voice Synthesis',
        description: 'Generate natural-sounding voiceovers with AI-powered speech synthesis.',
        icon: Mic,
        status: 'processing',
        metrics: [
            { value: 98, label: 'Quality', change: 6 }
        ],
        preview: <VoiceSynthesisPreview />,
        gradient: 'from-cyan-600/20 to-blue-600/20'
    },
    {
        id: 'smart-resizing',
        title: 'Smart Resizing',
        description: 'Automatically adapt content to different aspect ratios while preserving focal points.',
        icon: Smartphone,
        status: 'active',
        metrics: [
            { value: 95, label: 'Preservation', change: 3 }
        ],
        preview: <SmartResizingPreview />,
        gradient: 'from-green-600/20 to-cyan-600/20'
    },
    {
        id: 'motion-tracking',
        title: 'Motion Tracking',
        description: 'Precise object tracking and motion analysis for seamless visual effects integration.',
        icon: MousePointer,
        status: 'active',
        metrics: [
            { value: 99, label: 'Tracking', change: 2 },
            { value: 60, label: 'FPS', change: 0 }
        ],
        preview: <MotionTrackingPreview />,
        gradient: 'from-purple-600/20 to-indigo-600/20'
    },
    {
        id: 'color-grading',
        title: 'Color Grading AI',
        description: 'Professional color correction and grading with AI-assisted tone mapping.',
        icon: Palette,
        status: 'complete',
        metrics: [
            { value: 92, label: 'Accuracy', change: 7 },
            { value: 25, label: 'Presets', change: 5 }
        ],
        preview: <ColorGradingPreview />,
        gradient: 'from-pink-600/20 to-purple-600/20'
    }
];

const StatusBadge = ({ status }: { status: 'active' | 'processing' | 'complete' }) => {
    const colors = {
        active: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
        processing: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
        complete: 'bg-blue-500/20 text-blue-400 border-blue-500/30'
    };

    const labels = {
        active: 'Active',
        processing: 'Processing',
        complete: 'Complete'
    };

    return (
        <div className={`px-2 py-1 rounded-full text-xs border ${colors[status]} backdrop-blur-sm`}>
            {labels[status]}
        </div>
    );
};

const FeatureCard = ({ feature, className = '' }: { feature: Feature; className?: string }) => {
    const IconComponent = feature.icon;

    return (
        <motion.div
            className={className}
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
            <Card className="h-full bg-gray-950/80 border-gray-800/50 backdrop-blur-xl hover:bg-gray-900/90 transition-all duration-300 hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/20 relative overflow-hidden">
                {/* Enhanced dark overlay with gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900/50 via-gray-950/80 to-black/60 pointer-events-none" />

                {/* Subtle glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-transparent to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="p-8 h-full flex flex-col relative z-10">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center gap-4">
                            <motion.div
                                className={`p-4 rounded-xl bg-gradient-to-r ${feature.gradient} border border-purple-500/30 backdrop-blur-sm shadow-lg shadow-purple-500/20`}
                                whileHover={{
                                    scale: 1.1,
                                    boxShadow: '0 0 30px rgba(139, 92, 246, 0.5)',
                                    borderColor: 'rgba(139, 92, 246, 0.6)'
                                }}
                                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                            >
                                <IconComponent className="w-7 h-7 text-white drop-shadow-lg" />
                            </motion.div>
                            <div>
                                <h3 className="text-xl font-bold text-white mb-2 drop-shadow-sm">{feature.title}</h3>
                                <StatusBadge status={feature.status} />
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <p className="text-gray-300 text-sm mb-6 leading-relaxed">{feature.description}</p>

                    {/* Preview */}
                    <div className="flex-1 mb-6">
                        <div className="bg-gray-900/80 rounded-xl p-5 border border-gray-700/50 backdrop-blur-sm shadow-inner">
                            {feature.preview}
                        </div>
                    </div>

                    {/* Metrics */}
                    <div className="grid grid-cols-2 gap-6">
                        {feature.metrics.map((metric, index) => (
                            <div key={index} className="text-center p-3 bg-gray-800/50 rounded-lg border border-gray-700/30 backdrop-blur-sm">
                                <div className="text-2xl font-bold text-cyan-400 drop-shadow-sm">
                                    <AnimatedCounter value={metric.value} />
                                    {metric.label === 'Accuracy' || metric.label === 'Quality' || metric.label === 'Preservation' || metric.label === 'Tracking' ? '%' : ''}
                                </div>
                                <div className="text-xs text-gray-400 mt-1">{metric.label}</div>
                                <div className={`text-xs mt-1 ${metric.change > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                    {metric.change > 0 ? '+' : ''}{metric.change}%
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </Card>
        </motion.div>
    );
};

export const FeaturesLayout = () => {
    return (
        <div className="relative z-20 w-full py-20 lg:py-32 overflow-hidden bg-gray-950">
            {/* Enhanced full-width animated gradient background */}
            <div className="absolute inset-0">
                {/* Primary gradient layer */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900/50 to-black">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(139,92,246,0.12),transparent_60%)]" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(6,182,212,0.08),transparent_60%)]" />
                </div>

                {/* Animated gradient orbs */}
                <motion.div
                    className="absolute top-1/4 left-1/3 w-96 h-96 rounded-full bg-gradient-to-br from-primary/8 to-transparent blur-3xl"
                    animate={{
                        x: [0, 100, -50, 0],
                        y: [0, -80, 40, 0],
                        scale: [1, 1.3, 0.9, 1],
                    }}
                    transition={{
                        duration: 25,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
                <motion.div
                    className="absolute top-2/3 right-1/4 w-80 h-80 rounded-full bg-gradient-to-br from-accent/6 to-transparent blur-3xl"
                    animate={{
                        x: [0, -120, 80, 0],
                        y: [0, 60, -40, 0],
                        scale: [1, 0.8, 1.2, 1],
                    }}
                    transition={{
                        duration: 30,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 5,
                    }}
                />

                {/* Refined grid pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[length:60px_60px] opacity-30" />
            </div>

            {/* Content container */}
            <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
                {/* Standardized Header */}
                <StandardHeader
                    badge={{
                        icon: <Wand2 className="w-4 h-4" />,
                        text: "AI-Powered Features",
                        variant: "primary"
                    }}
                    heading="Revolutionary AI Video Features"
                    description="Experience the future of video editing with VFXB's cutting-edge AI technology. From intelligent auto-editing to real-time effects, transform your creative workflow with unprecedented speed and precision."
                    cta={{
                        text: "Explore All Features",
                        icon: <Sparkles className="w-5 h-5" />
                    }}
                    maxWidth="4xl"
                    align="center"
                />

                {/* Features Grid */}
                <div className="relative mt-16">
                    <div className="space-y-8">
                        {/* First Row: 2/3 and 1/3 */}
                        <motion.div
                            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <FeatureCard feature={features[0]} className="lg:col-span-2" />
                            <FeatureCard feature={features[1]} className="lg:col-span-1" />
                        </motion.div>

                        {/* Second Row: 3 equal columns */}
                        <motion.div
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                        >
                            <FeatureCard feature={features[2]} />
                            <FeatureCard feature={features[3]} />
                            <FeatureCard feature={features[4]} />
                        </motion.div>

                        {/* Third Row: 2 equal columns */}
                        <motion.div
                            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.6 }}
                        >
                            <FeatureCard feature={features[5]} />
                            <FeatureCard feature={features[6]} />
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};