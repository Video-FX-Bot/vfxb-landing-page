"use client";
import { cn } from "@/lib/utils";
import { ArrowRight, Video, Zap, Bot, Play, ChevronRight, Sparkles } from "lucide-react";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { AIFeaturesScrollCarousel } from "@/components/blocks/feature-sections/ai-features-scroll-carousel";

export function ModernHeroWithGradients() {
    return (
        <div className="relative h-full min-h-screen w-full bg-background overflow-hidden">
            {/* Video Background with Dark Overlay */}
            <VideoBackground />

            <div className="relative z-20 mx-auto max-w-7xl px-4 py-6 md:px-8 lg:px-4">
                <div className="relative my-6 overflow-hidden rounded-3xl bg-background/30 backdrop-blur-sm py-12 md:py-20">
                    <TopLines />
                    <BottomLines />
                    <SideLines />
                    <TopGradient />
                    <BottomGradient />

                    <div className="relative z-20 flex flex-col items-center justify-center overflow-hidden rounded-3xl px-6 py-8 md:px-8 md:py-12">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="mb-6 md:mb-8 lg:mb-10"
                        >
                            <Link
                                href="#quick-signup"
                                className="group flex items-center gap-2 rounded-full border border-border bg-gradient-to-r from-primary/10 to-accent/10 backdrop-blur-sm px-3 py-2 md:px-4 md:py-2 text-center text-xs md:text-sm text-foreground transition-all duration-300 hover:from-primary/20 hover:to-accent/20 hover:shadow-lg hover:shadow-primary/25 hover:scale-105 active:scale-95 touch-manipulation"
                            >
                                <Sparkles className="h-3 w-3 md:h-4 md:w-4 text-primary animate-pulse flex-shrink-0" />
                                <span className="font-medium text-center leading-tight">
                                    <span className="hidden sm:inline">🎬 VFXB Beta Coming Q3 2025 - Join Early Access Now!</span>
                                    <span className="sm:hidden">🎬 Join VFXB Beta - Q3 2025</span>
                                </span>
                                <ArrowRight className="h-3 w-3 md:h-4 md:w-4 text-primary group-hover:translate-x-1 transition-transform duration-300 flex-shrink-0" />
                            </Link>
                        </motion.div>

                        <motion.div
                            className="text-center mb-8 md:mb-12 lg:mb-14 px-2"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight mb-4 md:mb-6 max-w-4xl mx-auto">
                                <div className="bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent">
                                    <StaggeredText text="One-Stop Video Creation Tool" delay={0.2} />
                                </div>
                                <div className="bg-gradient-to-r from-accent via-primary to-foreground bg-clip-text text-transparent">
                                    <RotatingText />
                                </div>
                            </h1>

                            <motion.p
                                className="mx-auto max-w-2xl text-center text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed px-4"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: 0.6 }}
                            >
                                <span className="hidden sm:inline">
                                    VFXB empowers creators to build their brand with AI-powered video creation.
                                    Combining TikTok's dynamic format with YouTube's structure - perfect for
                                    gamers, VTubers, and tutorial creators looking to stand out.
                                </span>
                                <span className="sm:hidden">
                                    AI-powered video creation for creators. Perfect for gamers, VTubers, and tutorial creators.
                                </span>
                            </motion.p>
                        </motion.div>

                        <motion.div
                            className="flex flex-col items-center gap-3 sm:gap-4 mb-10 md:mb-14 lg:mb-16 sm:flex-row px-4"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.8 }}
                        >
                            <PulsingCTAButton />
                            <Link
                                href="#features"
                                className="group flex items-center gap-2 rounded-full border border-border bg-card/50 backdrop-blur-sm px-4 sm:px-6 py-3 text-center text-sm text-foreground transition-all duration-300 hover:bg-card/80 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 hover:scale-105 active:scale-95 touch-manipulation min-h-[44px] w-full sm:w-auto justify-center"
                            >
                                <Play className="h-4 w-4 group-hover:scale-110 transition-transform duration-300 flex-shrink-0" />
                                <span className="font-medium">Watch Demo</span>
                                <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300 flex-shrink-0" />
                            </Link>
                        </motion.div>

                        {/* AI Features Scroll Carousel */}
                        <motion.div
                            className="w-full max-w-6xl"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 1.6 }}
                        >
                            <AIFeaturesScrollCarousel />
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Video Background Component
const VideoBackground = () => {
    return (
        <div className="absolute inset-0 z-0 overflow-hidden">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="absolute inset-0 h-full w-full"
            >
                <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="h-full w-full object-cover"
                >
                    <source
                        src="https://videos.pexels.com/video-files/2889410/2889410-hd_1920_1080_30fps.mp4"
                        type="video/mp4"
                    />
                </video>
                {/* Dark overlay to ensure content readability */}
                <div className="absolute inset-0 bg-black/70 backdrop-blur-[1px]" />
                {/* Additional gradient overlay for better integration */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
            </motion.div>
        </div>
    );
};

// New rotating text component that showcases VFXB attributes
const RotatingText = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(true);

    const attributes = [
        { text: "For Aspiring Influencers", icon: Sparkles, color: "from-primary to-accent" },
        { text: "TikTok Meets YouTube", icon: Video, color: "from-accent to-success" },
        { text: "AI-Powered Creation", icon: Bot, color: "from-success to-primary" },
        { text: "Gamers & VTubers", icon: Zap, color: "from-primary to-accent" },
        { text: "Tutorial Creators", icon: Sparkles, color: "from-accent to-success" },
        { text: "Brand Building Made Easy", icon: Video, color: "from-success to-primary" }
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setIsVisible(false);
            setTimeout(() => {
                setCurrentIndex((prev) => (prev + 1) % attributes.length);
                setIsVisible(true);
            }, 200);
        }, 3500);

        return () => clearInterval(interval);
    }, []);

    const currentAttribute = attributes[currentIndex];
    const Icon = currentAttribute.icon;

    return (
        <div className="relative h-12 md:h-16 flex items-center justify-center">
            <AnimatePresence mode="wait">
                {isVisible && (
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.9 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                        className="flex items-center gap-2 md:gap-3"
                    >
                        <motion.div
                            className={`p-1.5 md:p-2 rounded-full bg-gradient-to-r ${currentAttribute.color}`}
                            animate={{
                                scale: [1, 1.1, 1],
                                rotate: [0, 5, -5, 0]
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        >
                            <Icon className="h-4 w-4 md:h-5 md:w-5 text-white" />
                        </motion.div>
                        <StaggeredText
                            text={currentAttribute.text}
                            delay={0.05}
                            className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-primary to-foreground"
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// Enhanced animated background with smoother integration
const AnimatedBackground = () => {
    return (
        <div className="absolute inset-0 overflow-hidden z-10">
            {/* Subtle gradient overlay to enhance the video */}
            <motion.div
                className="absolute inset-0 opacity-30"
                animate={{
                    background: [
                        "radial-gradient(circle at 30% 70%, rgba(139, 92, 246, 0.1) 0%, transparent 60%), radial-gradient(circle at 70% 30%, rgba(6, 182, 212, 0.1) 0%, transparent 60%)",
                        "radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.1) 0%, transparent 60%), radial-gradient(circle at 80% 20%, rgba(6, 182, 212, 0.1) 0%, transparent 60%)",
                        "radial-gradient(circle at 70% 30%, rgba(139, 92, 246, 0.1) 0%, transparent 60%), radial-gradient(circle at 30% 70%, rgba(6, 182, 212, 0.1) 0%, transparent 60%)"
                    ]
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    repeatType: "loop",
                    ease: "easeInOut"
                }}
            />
        </div>
    );
};

const StaggeredText = ({ text, delay = 0, className = "" }: { text: string; delay?: number; className?: string }) => {
    const letters = text.split("");

    return (
        <span className={`inline-block ${className}`}>
      {letters.map((letter, index) => (
          <motion.span
              key={`letter-${index}-${letter}`}
              className="inline-block"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                  duration: 0.3,
                  delay: delay + index * 0.03,
              }}
          >
              {letter === " " ? "\u00A0" : letter}
          </motion.span>
      ))}
    </span>
    );
};

const PulsingCTAButton = () => {
    return (
        <motion.div
            className="relative"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
        >
            <motion.div
                className="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-accent opacity-75 blur-lg"
                animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.5, 0.7, 0.5],
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "loop",
                }}
            />
            <Link
                href="#quick-signup"
                className="relative group flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary to-accent px-4 py-3 sm:px-6 sm:py-3 text-center text-sm sm:text-base text-primary-foreground font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-primary/50 hover:from-primary/90 hover:to-accent/90 min-h-[44px] touch-manipulation active:scale-95"
            >
                <Zap className="h-4 w-4 flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />
                <span className="whitespace-nowrap">Get Early Access</span>
                <ArrowRight className="h-4 w-4 flex-shrink-0 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
        </motion.div>
    );
};

const VideoPreviewMockup = () => {
    return (
        <motion.div
            className="relative max-w-4xl mx-auto w-full px-4"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.5 }}
        >
            <div className="relative rounded-xl bg-gradient-to-br from-card/60 to-card/30 backdrop-blur-sm border border-border/40 p-4 sm:p-6 md:p-8 shadow-xl shadow-primary/10">
                {/* Better spaced window controls */}
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <div className="flex items-center gap-2 sm:gap-3">
                        <div className="flex items-center gap-1.5 sm:gap-2">
                            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-500"></div>
                            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-yellow-500"></div>
                            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green-500"></div>
                        </div>
                        <div className="ml-2 sm:ml-4 flex items-center gap-2 sm:gap-3">
                            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                                <Video className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-white" />
                            </div>
                            <div className="text-xs sm:text-sm text-foreground font-semibold hidden sm:block">VFXB - Coming Soon</div>
                            <div className="text-xs text-foreground font-semibold sm:hidden">VFXB</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-1.5 sm:gap-2">
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-yellow-500 animate-pulse"></div>
                        <span className="text-xs sm:text-sm text-muted-foreground hidden sm:inline">Pre-Launch</span>
                        <span className="text-xs text-muted-foreground sm:hidden">Beta</span>
                    </div>
                </div>

                {/* Better spaced timeline */}
                <div className="bg-muted/15 rounded-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 border border-border/20">
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                        <div className="text-xs sm:text-sm font-semibold text-foreground">Launch Progress</div>
                        <div className="px-2 py-1 sm:px-3 sm:py-1.5 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full text-xs sm:text-sm text-primary font-medium border border-primary/30">
                            Q3 2024
                        </div>
                    </div>
                    <div className="w-full h-3 bg-muted/20 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-gradient-to-r from-primary via-accent to-success rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: "85%" }}
                            transition={{ duration: 2, delay: 2, ease: "easeInOut" }}
                        />
                    </div>
                </div>

                {/* Better spaced feature grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                    {[
                        { icon: Video, title: "AI Editor", description: "Coming soon", color: "from-primary/20 to-accent/20", iconColor: "text-primary" },
                        { icon: Bot, title: "Smart FX", description: "In development", color: "from-accent/20 to-primary/20", iconColor: "text-accent" },
                        { icon: Zap, title: "Fast Render", description: "Almost ready", color: "from-primary/20 to-accent/20", iconColor: "text-primary" },
                        { icon: Sparkles, title: "Pro Tools", description: "Beta testing", color: "from-accent/20 to-success/20", iconColor: "text-success" }
                    ].map((feature, index) => (
                        <motion.div
                            key={feature.title}
                            className="group bg-muted/15 rounded-lg p-3 sm:p-4 hover:bg-muted/25 transition-all duration-300 cursor-pointer border border-border/20 hover:border-primary/30 touch-manipulation"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 2.5 + index * 0.1 }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <div className={`w-full h-12 sm:h-14 bg-gradient-to-br ${feature.color} rounded-md mb-2 sm:mb-3 flex items-center justify-center group-hover:scale-105 transition-transform relative overflow-hidden`}>
                                <feature.icon className={`h-5 w-5 sm:h-6 sm:w-6 ${feature.iconColor} relative z-10`} />
                            </div>
                            <div className="text-xs sm:text-sm font-medium text-foreground mb-1">{feature.title}</div>
                            <div className="text-xs text-muted-foreground leading-tight">{feature.description}</div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

const TopGradient = ({ className }: { className?: string }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="807"
            height="797"
            viewBox="0 0 807 797"
            fill="none"
            className={cn(
                "pointer-events-none absolute -left-96 top-0 h-full w-full opacity-60",
                className
            )}
        >
            <path
                d="M807 110.119L699.5 -117.546L8.5 -154L-141 246.994L-7 952L127 782.111L279 652.114L513 453.337L807 110.119Z"
                fill="url(#paint0_radial_254_135)"
            />
            <path
                d="M807 110.119L699.5 -117.546L8.5 -154L-141 246.994L-7 952L127 782.111L279 652.114L513 453.337L807 110.119Z"
                fill="url(#paint1_radial_254_135)"
            />
            <defs>
                <radialGradient
                    id="paint0_radial_254_135"
                    cx="0"
                    cy="0"
                    r="1"
                    gradientUnits="userSpaceOnUse"
                    gradientTransform="translate(77.0001 15.8894) rotate(90.3625) scale(869.41 413.353)"
                >
                    <stop stopColor="#06b6d4" />
                    <stop offset="0.25" stopColor="#0891b2" />
                    <stop offset="0.573634" stopColor="#164e63" />
                    <stop offset="1" stopOpacity="0" />
                </radialGradient>
                <radialGradient
                    id="paint1_radial_254_135"
                    cx="0"
                    cy="0"
                    r="1"
                    gradientUnits="userSpaceOnUse"
                    gradientTransform="translate(127.5 -31) rotate(1.98106) scale(679.906 715.987)"
                >
                    <stop stopColor="#8b5cf6" />
                    <stop offset="0.283363" stopColor="#7c3aed" />
                    <stop offset="0.573634" stopColor="#1e1b4b" />
                    <stop offset="1" stopOpacity="0" />
                </radialGradient>
            </defs>
        </svg>
    );
};

const TopLines = () => {
    return (
        <svg
            width="166"
            height="298"
            viewBox="0 0 166 298"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="pointer-events-none absolute inset-x-0 top-0 aspect-square h-[80px] w-full md:h-[120px] opacity-70"
        >
            <line
                y1="-0.5"
                x2="406"
                y2="-0.5"
                transform="matrix(0 1 1 0 1 -108)"
                stroke="url(#paint0_linear_254_143)"
            />
            <line
                y1="-0.5"
                x2="406"
                y2="-0.5"
                transform="matrix(0 1 1 0 34 -108)"
                stroke="url(#paint1_linear_254_143)"
            />
            <line
                y1="-0.5"
                x2="406"
                y2="-0.5"
                transform="matrix(0 1 1 0 67 -108)"
                stroke="url(#paint2_linear_254_143)"
            />
            <line
                y1="-0.5"
                x2="406"
                y2="-0.5"
                transform="matrix(0 1 1 0 100 -108)"
                stroke="url(#paint3_linear_254_143)"
            />
            <line
                y1="-0.5"
                x2="406"
                y2="-0.5"
                transform="matrix(0 1 1 0 133 -108)"
                stroke="url(#paint4_linear_254_143)"
            />
            <line
                y1="-0.5"
                x2="406"
                y2="-0.5"
                transform="matrix(0 1 1 0 166 -108)"
                stroke="url(#paint5_linear_254_143)"
            />
            <defs>
                <linearGradient
                    id="paint0_linear_254_143"
                    x1="-7.42412e-06"
                    y1="0.500009"
                    x2="405"
                    y2="0.500009"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stopColor="#8b5cf6" />
                    <stop offset="1" stopOpacity="0" />
                </linearGradient>
                <linearGradient
                    id="paint1_linear_254_143"
                    x1="-7.42412e-06"
                    y1="0.500009"
                    x2="405"
                    y2="0.500009"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stopColor="#8b5cf6" />
                    <stop offset="1" stopOpacity="0" />
                </linearGradient>
                <linearGradient
                    id="paint2_linear_254_143"
                    x1="-7.42412e-06"
                    y1="0.500009"
                    x2="405"
                    y2="0.500009"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stopColor="#8b5cf6" />
                    <stop offset="1" stopOpacity="0" />
                </linearGradient>
                <linearGradient
                    id="paint3_linear_254_143"
                    x1="-7.42412e-06"
                    y1="0.500009"
                    x2="405"
                    y2="0.500009"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stopColor="#8b5cf6" />
                    <stop offset="1" stopOpacity="0" />
                </linearGradient>
                <linearGradient
                    id="paint4_linear_254_143"
                    x1="-7.42412e-06"
                    y1="0.500009"
                    x2="405"
                    y2="0.500009"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stopColor="#8b5cf6" />
                    <stop offset="1" stopOpacity="0" />
                </linearGradient>
                <linearGradient
                    id="paint5_linear_254_143"
                    x1="-7.42412e-06"
                    y1="0.500009"
                    x2="405"
                    y2="0.500009"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stopColor="#8b5cf6" />
                    <stop offset="1" stopOpacity="0" />
                </linearGradient>
            </defs>
        </svg>
    );
};

const BottomLines = () => {
    return (
        <svg
            width="445"
            height="418"
            viewBox="0 0 445 418"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="pointer-events-none absolute inset-x-0 -bottom-16 z-20 aspect-square h-[100px] w-full md:h-[160px] opacity-70"
        >
            <line
                x1="139.5"
                y1="418"
                x2="139.5"
                y2="12"
                stroke="url(#paint0_linear_0_1)"
            />
            <line
                x1="172.5"
                y1="418"
                x2="172.5"
                y2="12"
                stroke="url(#paint1_linear_0_1)"
            />
            <line
                x1="205.5"
                y1="418"
                x2="205.5"
                y2="12"
                stroke="url(#paint2_linear_0_1)"
            />
            <line
                x1="238.5"
                y1="418"
                x2="238.5"
                y2="12"
                stroke="url(#paint3_linear_0_1)"
            />
            <line
                x1="271.5"
                y1="418"
                x2="271.5"
                y2="12"
                stroke="url(#paint4_linear_0_1)"
            />
            <line
                x1="304.5"
                y1="418"
                x2="304.5"
                y2="12"
                stroke="url(#paint5_linear_0_1)"
            />
            <path
                d="M1 149L109.028 235.894C112.804 238.931 115 243.515 115 248.361V417"
                stroke="url(#paint6_linear_0_1)"
                strokeOpacity="0.1"
                strokeWidth="1.5"
            />
            <path
                d="M444 149L335.972 235.894C332.196 238.931 330 243.515 330 248.361V417"
                stroke="url(#paint7_linear_0_1)"
                strokeOpacity="0.1"
                strokeWidth="1.5"
            />
            <defs>
                <linearGradient
                    id="paint0_linear_0_1"
                    x1="140.5"
                    y1="418"
                    x2="140.5"
                    y2="13"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stopColor="#06b6d4" />
                    <stop offset="1" stopOpacity="0" />
                </linearGradient>
                <linearGradient
                    id="paint1_linear_0_1"
                    x1="173.5"
                    y1="418"
                    x2="173.5"
                    y2="13"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stopColor="#06b6d4" />
                    <stop offset="1" stopOpacity="0" />
                </linearGradient>
                <linearGradient
                    id="paint2_linear_0_1"
                    x1="206.5"
                    y1="418"
                    x2="206.5"
                    y2="13"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stopColor="#06b6d4" />
                    <stop offset="1" stopOpacity="0" />
                </linearGradient>
                <linearGradient
                    id="paint3_linear_0_1"
                    x1="239.5"
                    y1="418"
                    x2="239.5"
                    y2="13"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stopColor="#06b6d4" />
                    <stop offset="1" stopOpacity="0" />
                </linearGradient>
                <linearGradient
                    id="paint4_linear_0_1"
                    x1="272.5"
                    y1="418"
                    x2="272.5"
                    y2="13"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stopColor="#06b6d4" />
                    <stop offset="1" stopOpacity="0" />
                </linearGradient>
                <linearGradient
                    id="paint5_linear_0_1"
                    x1="305.5"
                    y1="418"
                    x2="305.5"
                    y2="13"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stopColor="#06b6d4" />
                    <stop offset="1" stopOpacity="0" />
                </linearGradient>
                <linearGradient
                    id="paint6_linear_0_1"
                    x1="115"
                    y1="390.591"
                    x2="-59.1703"
                    y2="205.673"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop offset="0.481613" stopColor="#64748b" />
                    <stop offset="1" stopColor="#64748b" stopOpacity="0" />
                </linearGradient>
                <linearGradient
                    id="paint7_linear_0_1"
                    x1="330"
                    y1="390.591"
                    x2="504.17"
                    y2="205.673"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop offset="0.481613" stopColor="#64748b" />
                    <stop offset="1" stopColor="#64748b" stopOpacity="0" />
                </linearGradient>
            </defs>
        </svg>
    );
};

const SideLines = () => {
    return (
        <svg
            width="1382"
            height="370"
            viewBox="0 0 1382 370"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="pointer-events-none absolute inset-0 z-30 h-full w-full opacity-60"
        >
            <path
                d="M268 115L181.106 6.97176C178.069 3.19599 173.485 1 168.639 1H0"
                stroke="url(#paint0_linear_337_46)"
                strokeOpacity="0.1"
                strokeWidth="1.5"
            />
            <path
                d="M1114 115L1200.89 6.97176C1203.93 3.19599 1208.52 1 1213.36 1H1382"
                stroke="url(#paint1_linear_337_46)"
                strokeOpacity="0.1"
                strokeWidth="1.5"
            />
            <path
                d="M268 255L181.106 363.028C178.069 366.804 173.485 369 168.639 369H0"
                stroke="url(#paint2_linear_337_46)"
                strokeOpacity="0.1"
                strokeWidth="1.5"
            />
            <path
                d="M1114 255L1200.89 363.028C1203.93 366.804 1208.52 369 1213.36 369H1382"
                stroke="url(#paint3_linear_337_46)"
                strokeOpacity="0.1"
                strokeWidth="1.5"
            />
            <defs>
                <linearGradient
                    id="paint0_linear_337_46"
                    x1="26.4087"
                    y1="1.00001"
                    x2="211.327"
                    y2="175.17"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop offset="0.481613" stopColor="#64748b" />
                    <stop offset="1" stopColor="#64748b" stopOpacity="0" />
                </linearGradient>
                <linearGradient
                    id="paint1_linear_337_46"
                    x1="1355.59"
                    y1="1.00001"
                    x2="1170.67"
                    y2="175.17"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop offset="0.481613" stopColor="#64748b" />
                    <stop offset="1" stopColor="#64748b" stopOpacity="0" />
                </linearGradient>
                <linearGradient
                    id="paint2_linear_337_46"
                    x1="26.4087"
                    y1="369"
                    x2="211.327"
                    y2="194.83"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop offset="0.481613" stopColor="#64748b" />
                    <stop offset="1" stopColor="#64748b" stopOpacity="0" />
                </linearGradient>
                <linearGradient
                    id="paint3_linear_337_46"
                    x1="1355.59"
                    y1="369"
                    x2="1170.67"
                    y2="194.83"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop offset="0.481613" stopColor="#64748b" />
                    <stop offset="1" stopColor="#64748b" stopOpacity="0" />
                </linearGradient>
            </defs>
        </svg>
    );
};

const BottomGradient = ({ className }: { className?: string }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="551"
            height="295"
            viewBox="0 0 551 295"
            fill="none"
            className={cn(
                "pointer-events-none absolute -right-80 bottom-0 h-full w-full opacity-60",
                className
            )}
        >
            <path
                d="M118.499 0H532.468L635.375 38.6161L665 194.625L562.093 346H0L24.9473 121.254L118.499 0Z"
                fill="url(#paint0_radial_254_132)"
            />
            <defs>
                <radialGradient
                    id="paint0_radial_254_132"
                    cx="0"
                    cy="0"
                    r="1"
                    gradientUnits="userSpaceOnUse"
                    gradientTransform="translate(412.5 346) rotate(-91.153) scale(397.581 423.744)"
                >
                    <stop stopColor="#8b5cf6" />
                    <stop offset="0.25" stopColor="#6d28d9" />
                    <stop offset="0.573634" stopColor="#1e1b4b" />
                    <stop offset="1" stopOpacity="0" />
                </radialGradient>
            </defs>
        </svg>
    );
};