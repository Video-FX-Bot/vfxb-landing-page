"use client";

import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, Scissors, Target, Palette, Volume2, Sparkles, FilmIcon, Zap } from 'lucide-react';

interface AIFeature {
    id: string;
    title: string;
    description: string;
    image: string;
    category: string;
    icon: React.ReactNode;
    color: string;
    gradient: string;
}

const aiFeatures: AIFeature[] = [
    {
        id: 'object-removal',
        title: 'Smart Object Removal',
        description: 'Seamlessly remove unwanted objects from your videos with AI-powered content-aware fill technology that automatically reconstructs background elements',
        image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/d684263e-3bd0-4298-a5de-e431231085f4/generated_images/modern-ai-video-editing-interface-showin-16bcf627-20250715141417.jpg?',
        category: 'Enhancement',
        icon: <Scissors className="w-5 h-5" />,
        color: 'text-primary',
        gradient: 'from-primary/10 to-primary/20'
    },
    {
        id: 'motion-tracking',
        title: 'Precision Motion Tracking',
        description: 'Advanced AI-powered motion tracking that follows subjects with pixel-perfect accuracy, even through complex movements and occlusions',
        image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/d684263e-3bd0-4298-a5de-e431231085f4/generated_images/ai-motion-tracking-interface-for-video-e-4263268b-20250715141424.jpg?',
        category: 'Tracking',
        icon: <Target className="w-5 h-5" />,
        color: 'text-accent',
        gradient: 'from-accent/10 to-accent/20'
    },
    {
        id: 'color-grading',
        title: 'Cinematic Color Grading',
        description: 'Transform your footage with professional AI-driven color correction, mood enhancement, and cinematic grading presets',
        image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/d684263e-3bd0-4298-a5de-e431231085f4/generated_images/ai-color-grading-and-correction-interfac-4bd7681e-20250715141434.jpg?',
        category: 'Color',
        icon: <Palette className="w-5 h-5" />,
        color: 'text-success',
        gradient: 'from-success/10 to-success/20'
    },
    {
        id: 'audio-enhancement',
        title: 'Neural Audio Enhancement',
        description: 'Intelligent audio processing that removes noise, balances levels, and enhances clarity using advanced neural network algorithms',
        image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/d684263e-3bd0-4298-a5de-e431231085f4/generated_images/ai-powered-audio-enhancement-interface-s-4d959005-20250715141443.jpg?',
        category: 'Audio',
        icon: <Volume2 className="w-5 h-5" />,
        color: 'text-warning',
        gradient: 'from-warning/10 to-warning/20'
    },
    {
        id: 'style-transfer',
        title: 'AI Style Transfer',
        description: 'Apply artistic styles and visual effects to your videos using advanced neural style transfer algorithms for unique creative looks',
        image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/d684263e-3bd0-4298-a5de-e431231085f4/generated_images/ai-style-transfer-interface-showing-arti-ced711bb-20250715161627.jpg?',
        category: 'Creative',
        icon: <Sparkles className="w-5 h-5" />,
        color: 'text-purple-400',
        gradient: 'from-purple-400/10 to-purple-400/20'
    },
    {
        id: 'scene-detection',
        title: 'Intelligent Scene Detection',
        description: 'Automatically identify and categorize different scenes in your footage for smart editing, transitions, and content organization',
        image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/d684263e-3bd0-4298-a5de-e431231085f4/generated_images/ai-scene-detection-interface-for-video-e-1fa05025-20250715161636.jpg?',
        category: 'Analysis',
        icon: <FilmIcon className="w-5 h-5" />,
        color: 'text-blue-400',
        gradient: 'from-blue-400/10 to-blue-400/20'
    },
    {
        id: 'auto-editing',
        title: 'Smart Auto-Editing',
        description: 'AI-powered automatic video editing that creates compelling cuts, transitions, and pacing based on content analysis and storytelling principles',
        image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/d684263e-3bd0-4298-a5de-e431231085f4/generated_images/ai-auto-editing-interface-showing-smart--7d10833a-20250715161646.jpg?',
        category: 'Automation',
        icon: <Zap className="w-5 h-5" />,
        color: 'text-orange-400',
        gradient: 'from-orange-400/10 to-orange-400/20'
    }
];

export const AIFeaturesScrollCarousel = () => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    // Auto-scroll functionality
    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container || isHovered) return;

        const interval = setInterval(() => {
            const { scrollLeft, scrollWidth, clientWidth } = container;
            const cardWidth = 320; // Increased for better spacing

            // Check if we can scroll right
            if (scrollLeft < scrollWidth - clientWidth - 1) {
                container.scrollBy({
                    left: cardWidth,
                    behavior: 'smooth'
                });
            } else {
                // Reset to beginning for continuous loop
                container.scrollTo({
                    left: 0,
                    behavior: 'smooth'
                });
            }
        }, 4000); // Increased interval for better viewing time

        return () => clearInterval(interval);
    }, [isHovered]);

    const checkScrollPosition = () => {
        if (scrollContainerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
            setCanScrollLeft(scrollLeft > 0);
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
        }
    };

    const scrollLeft = () => {
        if (scrollContainerRef.current) {
            const cardWidth = 320; // Increased for better spacing
            scrollContainerRef.current.scrollBy({
                left: -cardWidth,
                behavior: 'smooth'
            });
        }
    };

    const scrollRight = () => {
        if (scrollContainerRef.current) {
            const cardWidth = 320; // Increased for better spacing
            scrollContainerRef.current.scrollBy({
                left: cardWidth,
                behavior: 'smooth'
            });
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                delayChildren: 0.2,
                staggerChildren: 0.15
            }
        }
    };

    const cardVariants = {
        hidden: { y: 30, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.8
            }
        }
    };

    return (
        <div
            className="relative -mx-4 sm:-mx-6 lg:-mx-8 xl:-mx-12 py-12 px-4 sm:px-6 lg:px-8 xl:px-12"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Scroll Buttons */}
            <button
                onClick={scrollLeft}
                disabled={!canScrollLeft}
                className={`absolute left-4 top-1/2 -translate-y-1/2 z-20 w-14 h-14 rounded-full bg-background/90 backdrop-blur-sm border border-border/50 flex items-center justify-center transition-all duration-300 shadow-lg ${
                    canScrollLeft
                        ? 'hover:bg-primary/10 hover:border-primary/30 text-foreground hover:scale-110'
                        : 'opacity-50 cursor-not-allowed text-muted-foreground'
                }`}
            >
                <ChevronLeft className="w-6 h-6" />
            </button>

            <button
                onClick={scrollRight}
                disabled={!canScrollRight}
                className={`absolute right-4 top-1/2 -translate-y-1/2 z-20 w-14 h-14 rounded-full bg-background/90 backdrop-blur-sm border border-border/50 flex items-center justify-center transition-all duration-300 shadow-lg ${
                    canScrollRight
                        ? 'hover:bg-primary/10 hover:border-primary/30 text-foreground hover:scale-110'
                        : 'opacity-50 cursor-not-allowed text-muted-foreground'
                }`}
            >
                <ChevronRight className="w-6 h-6" />
            </button>

            {/* Carousel */}
            <motion.div
                ref={scrollContainerRef}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                onScroll={checkScrollPosition}
                className="flex gap-8 overflow-x-auto scrollbar-hide pb-6 scroll-smooth px-20"
                style={{
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                    WebkitOverflowScrolling: 'touch'
                }}
            >
                {aiFeatures.map((feature, index) => (
                    <motion.div
                        key={feature.id}
                        variants={cardVariants}
                        className="flex-none"
                    >
                        <Card className="group relative overflow-hidden bg-transparent hover:bg-background/60 border-border/20 hover:border-primary/30 transition-all duration-500 hover:shadow-xl w-72 sm:w-80 lg:w-96">
                            <motion.div
                                whileHover={{ y: -4 }}
                                transition={{ duration: 0.4 }}
                                className="relative"
                            >
                                {/* Enhanced Image Container */}
                                <div className="relative h-40 sm:h-48 overflow-hidden">
                                    <img
                                        src={feature.image}
                                        alt={feature.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />

                                    {/* Gradient overlay */}
                                    <div className={`absolute inset-0 bg-gradient-to-b ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                                    {/* Enhanced Category Badge */}
                                    <div className="absolute top-3 left-3 z-10">
                    <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium bg-background/90 backdrop-blur-sm ${feature.color} border border-current/20`}>
                      {feature.icon}
                        {feature.category}
                    </span>
                                    </div>

                                    {/* Feature number indicator */}
                                    <div className="absolute top-3 right-3 z-10">
                    <span className="w-8 h-8 bg-background/90 backdrop-blur-sm rounded-full flex items-center justify-center text-sm font-bold text-foreground border border-border/50">
                      {index + 1}
                    </span>
                                    </div>
                                </div>

                                {/* Enhanced Content */}
                                <div className="relative p-6">
                                    <motion.h3
                                        className="text-lg sm:text-xl font-bold mb-3 group-hover:text-primary transition-colors duration-300 leading-tight"
                                        whileHover={{ x: 2 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        {feature.title}
                                    </motion.h3>

                                    <p className="text-muted-foreground leading-relaxed text-sm line-clamp-3 mb-4">
                                        {feature.description}
                                    </p>

                                    {/* Feature stats or additional info */}
                                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                        <div className="flex items-center gap-1">
                                            <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                                            <span>Active</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <div className="w-2 h-2 bg-primary rounded-full" />
                                            <span>AI Powered</span>
                                        </div>
                                    </div>

                                    {/* Enhanced Hover indicator */}
                                    <motion.div
                                        className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-success origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"
                                        initial={{ scaleX: 0 }}
                                    />
                                </div>

                                {/* Enhanced Shine effect */}
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                                    initial={{ x: '-100%' }}
                                    whileHover={{ x: '100%' }}
                                    transition={{ duration: 1.2 }}
                                />
                            </motion.div>
                        </Card>
                    </motion.div>
                ))}
            </motion.div>

            {/* Enhanced Auto-scroll indicator */}
            <div className="flex items-center justify-center mt-8 gap-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground bg-background/60 backdrop-blur-sm rounded-full px-4 py-2 border border-border/20">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                    <span>Auto-scrolling</span>
                    <span className="text-xs opacity-70">• Hover to pause</span>
                </div>
            </div>
        </div>
    );
};