"use client"

import { useState, useEffect } from "react"
import { motion, useInView, useScroll, useTransform } from "motion/react"
import { useRef } from "react"
import { cn } from "@/lib/utils"
import { StandardHeader } from '@/components/ui/standard-header'
import { Play, Pause, RotateCw, Maximize2, Settings, Download, Eye, Sparkles, Zap, Layers, Target, Volume2, SkipBack, SkipForward } from "lucide-react"

interface Feature {
    icon: React.ReactNode
    title: string
    description: string
    position: { x: number; y: number }
}

const features: Feature[] = [
    {
        icon: <Sparkles className="w-5 h-5" />,
        title: "AI-Powered Effects",
        description: "Intelligent visual effects that adapt to your content",
        position: { x: 20, y: 15 }
    },
    {
        icon: <Zap className="w-5 h-5" />,
        title: "Real-time Processing",
        description: "See changes instantly with lightning-fast rendering",
        position: { x: 75, y: 30 }
    },
    {
        icon: <Layers className="w-5 h-5" />,
        title: "Advanced Compositing",
        description: "Professional-grade layer blending and masking",
        position: { x: 25, y: 70 }
    },
    {
        icon: <Target className="w-5 h-5" />,
        title: "Precision Tracking",
        description: "Frame-perfect motion and object tracking",
        position: { x: 70, y: 80 }
    }
]

const demoScenarios = [
    {
        title: "Color Correction",
        description: "Transform dull footage into cinematic masterpieces",
        progress: 0.3,
        color: "from-orange-500 to-red-500"
    },
    {
        title: "Motion Graphics",
        description: "Add dynamic text and animated elements",
        progress: 0.7,
        color: "from-blue-500 to-purple-500"
    },
    {
        title: "Visual Effects",
        description: "Create stunning particle systems and explosions",
        progress: 0.9,
        color: "from-green-500 to-cyan-500"
    }
]

export default function InteractiveDemoVideo() {
    const [isPlaying, setIsPlaying] = useState(false)
    const [currentTime, setCurrentTime] = useState(0)
    const [duration] = useState(120) // 2 minutes in seconds
    const [currentScenario, setCurrentScenario] = useState(0)
    const [showModalOverlay, setShowModalOverlay] = useState(false)
    const [beforeAfterSlider, setBeforeAfterSlider] = useState(50)
    const [hoveredFeature, setHoveredFeature] = useState<number | null>(null)
    const [volume, setVolume] = useState(75)

    const containerRef = useRef<HTMLDivElement>(null)
    const videoRef = useRef<HTMLDivElement>(null)
    const isInView = useInView(containerRef, { once: true, amount: 0.2 })
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    })

    const backgroundY = useTransform(scrollYProgress, [0, 1], [-100, 100])
    const contentY = useTransform(scrollYProgress, [0, 1], [50, -50])

    // Auto-play simulation
    useEffect(() => {
        let interval: NodeJS.Timeout
        if (isPlaying) {
            interval = setInterval(() => {
                setCurrentTime(prev => (prev + 1) % duration)
            }, 1000)
        }
        return () => clearInterval(interval)
    }, [isPlaying, duration])

    // Auto-cycle through scenarios
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentScenario(prev => (prev + 1) % demoScenarios.length)
        }, 4000)
        return () => clearInterval(interval)
    }, [])

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    const progressPercentage = (currentTime / duration) * 100

    return (
        <div
            ref={containerRef}
            className="relative min-h-screen py-24 overflow-hidden"
        >
            {/* Enhanced Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/20">
                {/* Animated Grid Pattern */}
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `
              linear-gradient(rgba(139, 92, 246, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(139, 92, 246, 0.1) 1px, transparent 1px)
            `,
                        backgroundSize: '50px 50px'
                    }} />
                </div>

                {/* Floating Orbs */}
                {[...Array(8)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute rounded-full bg-gradient-to-br from-primary/20 to-accent/20 blur-xl"
                        style={{
                            width: `${Math.random() * 300 + 100}px`,
                            height: `${Math.random() * 300 + 100}px`,
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                        animate={{
                            x: [0, Math.random() * 200 - 100],
                            y: [0, Math.random() * 200 - 100],
                            scale: [1, 1.2, 1],
                        }}
                        transition={{
                            duration: 10 + Math.random() * 10,
                            repeat: Infinity,
                            repeatType: "reverse",
                        }}
                    />
                ))}
            </div>

            {/* Background Gradient Movement */}
            <motion.div
                className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5"
                style={{ y: backgroundY }}
            />

            <div className="relative z-10 container mx-auto px-4">
                <StandardHeader
                    badge={{
                        icon: <Sparkles className="w-4 h-4" />,
                        text: "Interactive Demo",
                        variant: "primary"
                    }}
                    heading="See VFXB in Action"
                    description="Experience the power of professional visual effects editing with our interactive demo. Watch how VFXB transforms ordinary footage into cinematic masterpieces."
                />

                <motion.div
                    style={{ y: contentY }}
                    className="max-w-6xl mx-auto"
                >
                    {/* Enhanced Video Player */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="relative rounded-3xl bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm border border-border/50 overflow-hidden shadow-2xl"
                    >
                        {/* Glowing Border Effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-3xl blur-sm opacity-60" />

                        {/* Video Display Area */}
                        <div className="relative">
                            <div
                                ref={videoRef}
                                className="relative aspect-video bg-gradient-to-br from-muted/30 to-muted/10 overflow-hidden rounded-t-3xl"
                            >
                                {/* Enhanced Before/After Comparison */}
                                <div className="absolute inset-0 flex">
                                    <div
                                        className="relative bg-gradient-to-r from-muted/50 to-muted/20 flex items-center justify-center"
                                        style={{ width: `${beforeAfterSlider}%` }}
                                    >
                                        <div className="text-center">
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                className="inline-flex items-center gap-2 bg-background/80 backdrop-blur-sm rounded-full px-4 py-2 mb-4"
                                            >
                                                <Eye className="w-4 h-4 text-muted-foreground" />
                                                <span className="text-sm font-medium text-muted-foreground">Before</span>
                                            </motion.div>
                                            <div className="w-48 h-32 bg-gradient-to-br from-muted/60 to-muted/30 rounded-xl flex items-center justify-center backdrop-blur-sm">
                                                <div className="text-center">
                                                    <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mb-2">
                                                        <Eye className="w-8 h-8 text-muted-foreground" />
                                                    </div>
                                                    <span className="text-xs text-muted-foreground">Original Footage</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div
                                        className="relative bg-gradient-to-r from-primary/20 to-accent/20 flex items-center justify-center"
                                        style={{ width: `${100 - beforeAfterSlider}%` }}
                                    >
                                        <div className="text-center">
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                className="inline-flex items-center gap-2 bg-primary/20 backdrop-blur-sm rounded-full px-4 py-2 mb-4"
                                            >
                                                <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                                                <span className="text-sm font-medium text-primary">After VFXB</span>
                                            </motion.div>
                                            <div className="w-48 h-32 bg-gradient-to-br from-primary/30 to-accent/30 rounded-xl flex items-center justify-center backdrop-blur-sm border border-primary/20">
                                                <div className="text-center">
                                                    <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mb-2 animate-pulse">
                                                        <Sparkles className="w-8 h-8 text-white" />
                                                    </div>
                                                    <span className="text-xs text-primary font-medium">Enhanced Result</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Enhanced Slider Handle */}
                                <div
                                    className="absolute top-0 bottom-0 w-2 bg-gradient-to-b from-primary to-accent cursor-col-resize group z-10"
                                    style={{ left: `${beforeAfterSlider}%` }}
                                    onMouseDown={(e) => {
                                        const rect = videoRef.current?.getBoundingClientRect()
                                        if (!rect) return

                                        const handleMouseMove = (e: MouseEvent) => {
                                            const x = ((e.clientX - rect.left) / rect.width) * 100
                                            setBeforeAfterSlider(Math.max(0, Math.min(100, x)))
                                        }

                                        const handleMouseUp = () => {
                                            document.removeEventListener('mousemove', handleMouseMove)
                                            document.removeEventListener('mouseup', handleMouseUp)
                                        }

                                        document.addEventListener('mousemove', handleMouseMove)
                                        document.addEventListener('mouseup', handleMouseUp)
                                    }}
                                >
                                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                                        <div className="w-4 h-4 bg-white rounded-full" />
                                    </div>

                                    {/* Slider Labels */}
                                    <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-background/90 backdrop-blur-sm rounded-lg px-3 py-1 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                                        Drag to compare
                                    </div>
                                </div>

                                {/* Floating Feature Callouts */}
                                {features.map((feature, index) => (
                                    <motion.div
                                        key={index}
                                        className="absolute z-20"
                                        style={{
                                            left: `${feature.position.x}%`,
                                            top: `${feature.position.y}%`,
                                        }}
                                        initial={{ opacity: 0, scale: 0 }}
                                        animate={{
                                            opacity: isInView ? 1 : 0,
                                            scale: isInView ? 1 : 0,
                                        }}
                                        transition={{
                                            duration: 0.5,
                                            delay: index * 0.2,
                                        }}
                                        onMouseEnter={() => setHoveredFeature(index)}
                                        onMouseLeave={() => setHoveredFeature(null)}
                                    >
                                        <div className="relative">
                                            <motion.div
                                                className="w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center cursor-pointer shadow-lg"
                                                whileHover={{ scale: 1.2 }}
                                                whileTap={{ scale: 0.9 }}
                                            >
                                                <div className="text-white">
                                                    {feature.icon}
                                                </div>
                                            </motion.div>

                                            {/* Pulsing Ring */}
                                            <div className="absolute inset-0 rounded-full border-2 border-primary/30 animate-ping" />

                                            {/* Enhanced Tooltip */}
                                            {hoveredFeature === index && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                                    className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 z-30"
                                                >
                                                    <div className="bg-background/95 backdrop-blur-sm border border-border/50 rounded-xl p-4 shadow-xl min-w-56">
                                                        <h4 className="font-semibold text-sm mb-2 text-foreground">{feature.title}</h4>
                                                        <p className="text-xs text-muted-foreground leading-relaxed">{feature.description}</p>
                                                        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-background/95 border-b border-r border-border/50 rotate-45" />
                                                    </div>
                                                </motion.div>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}

                                {/* Enhanced Play/Pause Overlay */}
                                <div className="absolute inset-0 flex items-center justify-center z-10">
                                    <motion.button
                                        onClick={() => setIsPlaying(!isPlaying)}
                                        className="group relative"
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                    >
                                        <div className="w-20 h-20 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-xl border border-primary/20">
                                            {isPlaying ? (
                                                <Pause className="w-8 h-8 text-primary" />
                                            ) : (
                                                <Play className="w-8 h-8 ml-1 text-primary" />
                                            )}
                                        </div>
                                        <div className="absolute inset-0 rounded-full border-2 border-primary/30 scale-110 opacity-0 group-hover:opacity-100 transition-opacity animate-pulse" />
                                    </motion.button>
                                </div>

                                {/* Processing Indicator */}
                                {isPlaying && (
                                    <div className="absolute top-4 left-4 z-20">
                                        <div className="flex items-center gap-2 bg-background/80 backdrop-blur-sm rounded-full px-4 py-2">
                                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                            <span className="text-xs font-medium text-green-600">Processing</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Enhanced Video Controls */}
                            <div className="relative p-6 bg-gradient-to-r from-card/80 to-card/60 backdrop-blur-sm border-t border-border/50">
                                {/* Progress Bar */}
                                <div className="mb-6">
                                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                                        <span className="font-medium">{formatTime(currentTime)}</span>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                                            <span className="font-medium bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        {demoScenarios[currentScenario].title}
                      </span>
                                        </div>
                                        <span className="font-medium">{formatTime(duration)}</span>
                                    </div>
                                    <div className="relative h-3 bg-muted/50 rounded-full overflow-hidden">
                                        <motion.div
                                            className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-accent rounded-full"
                                            style={{ width: `${progressPercentage}%` }}
                                            transition={{ duration: 0.1 }}
                                        />
                                        <div
                                            className={`absolute top-0 h-full rounded-full bg-gradient-to-r ${demoScenarios[currentScenario].color} opacity-30`}
                                            style={{ width: `${demoScenarios[currentScenario].progress * 100}%` }}
                                        />
                                    </div>
                                </div>

                                {/* Enhanced Controls */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => setCurrentTime(Math.max(0, currentTime - 10))}
                                            className="p-3 hover:bg-muted/50 rounded-xl transition-colors"
                                        >
                                            <SkipBack className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => setIsPlaying(!isPlaying)}
                                            className="p-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl transition-colors"
                                        >
                                            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                                        </button>
                                        <button
                                            onClick={() => setCurrentTime(Math.min(duration, currentTime + 10))}
                                            className="p-3 hover:bg-muted/50 rounded-xl transition-colors"
                                        >
                                            <SkipForward className="w-5 h-5" />
                                        </button>

                                        {/* Volume Control */}
                                        <div className="flex items-center gap-2 ml-4">
                                            <Volume2 className="w-4 h-4 text-muted-foreground" />
                                            <input
                                                type="range"
                                                min="0"
                                                max="100"
                                                value={volume}
                                                onChange={(e) => setVolume(Number(e.target.value))}
                                                className="w-20 h-2 bg-muted/50 rounded-full appearance-none cursor-pointer"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => setShowModalOverlay(true)}
                                            className="p-3 hover:bg-muted/50 rounded-xl transition-colors"
                                        >
                                            <Settings className="w-5 h-5" />
                                        </button>
                                        <button className="p-3 hover:bg-muted/50 rounded-xl transition-colors">
                                            <Download className="w-5 h-5" />
                                        </button>
                                        <button className="p-3 hover:bg-muted/50 rounded-xl transition-colors">
                                            <Maximize2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Enhanced Demo Scenarios */}
                    <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                        {demoScenarios.map((scenario, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={isInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                                onClick={() => setCurrentScenario(index)}
                                className={cn(
                                    "group relative p-6 rounded-2xl border cursor-pointer transition-all duration-300 hover:scale-[1.02] overflow-hidden",
                                    currentScenario === index
                                        ? "border-primary bg-primary/10 shadow-lg shadow-primary/20"
                                        : "border-border bg-card/50 hover:border-primary/50 hover:bg-card/80"
                                )}
                            >
                                {/* Background Gradient */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${scenario.color} opacity-0 group-hover:opacity-5 transition-opacity`} />

                                <div className="relative z-10">
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="font-bold text-lg">{scenario.title}</h3>
                                        <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${scenario.color} ${currentScenario === index ? 'animate-pulse' : ''}`} />
                                    </div>
                                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{scenario.description}</p>
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-muted-foreground">Progress</span>
                                            <span className="font-medium">{Math.round(scenario.progress * 100)}%</span>
                                        </div>
                                        <div className="h-2 bg-muted/50 rounded-full overflow-hidden">
                                            <motion.div
                                                className={`h-full rounded-full bg-gradient-to-r ${scenario.color}`}
                                                initial={{ width: 0 }}
                                                animate={{ width: `${scenario.progress * 100}%` }}
                                                transition={{ duration: 1, delay: 0.5 }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Enhanced Modal Overlay */}
            {showModalOverlay && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-background/80 backdrop-blur-lg z-50 flex items-center justify-center p-4"
                    onClick={() => setShowModalOverlay(false)}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="bg-card/90 backdrop-blur-sm border border-border/50 rounded-2xl p-8 max-w-md w-full shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center">
                                <Settings className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="text-xl font-bold">Advanced Settings</h3>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium mb-3">Effect Intensity</label>
                                <div className="relative">
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        defaultValue="75"
                                        className="w-full h-2 bg-muted/50 rounded-full appearance-none cursor-pointer"
                                    />
                                    <div className="flex justify-between text-xs text-muted-foreground mt-2">
                                        <span>Subtle</span>
                                        <span>Dramatic</span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-3">Processing Quality</label>
                                <select className="w-full p-3 bg-muted/50 rounded-xl border border-border/50 focus:border-primary outline-none transition-colors">
                                    <option>Ultra High (4K)</option>
                                    <option>High (1080p)</option>
                                    <option>Medium (720p)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-3">Export Format</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {['MP4', 'MOV', 'AVI'].map((format) => (
                                        <button
                                            key={format}
                                            className="p-2 bg-muted/50 hover:bg-primary/20 rounded-lg text-sm transition-colors"
                                        >
                                            {format}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button className="flex-1 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white py-3 px-4 rounded-xl transition-all font-medium">
                                    Apply Changes
                                </button>
                                <button
                                    onClick={() => setShowModalOverlay(false)}
                                    className="flex-1 bg-muted/50 hover:bg-muted/70 py-3 px-4 rounded-xl transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </div>
    )
}