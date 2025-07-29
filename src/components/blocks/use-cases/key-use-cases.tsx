"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StandardHeader } from '@/components/ui/standard-header';
import {
    Gamepad2,
    Smartphone,
    Camera,
    Zap,
    Target,
    Sparkles,
    ArrowRight,
    PlayCircle,
    TrendingUp,
    Users,
    Star,
    ChevronRight,
    ExternalLink
} from 'lucide-react';

interface UseCase {
    id: string;
    title: string;
    description: string;
    features: string[];
    icon: React.ReactNode;
    gradient: string;
    borderGradient: string;
    stats: {
        label: string;
        value: string;
    }[];
    demoVideo?: string;
    category: string;
}

const useCases: UseCase[] = [
    {
        id: 'gaming',
        title: 'Gaming Content Creation',
        description: 'Transform your gameplay into viral content with AI-powered editing that automatically detects epic moments and creates engaging highlights.',
        features: ['Auto-highlight detection', 'Epic moment cuts', 'Smooth transitions', 'Audio sync', 'Trending effects'],
        icon: <Gamepad2 className="w-8 h-8" />,
        gradient: 'from-purple-500/20 via-purple-600/10 to-cyan-500/20',
        borderGradient: 'from-purple-500/50 to-cyan-500/50',
        stats: [
            { label: 'Avg. Views Increase', value: '340%' },
            { label: 'Time Saved', value: '8 hrs/week' }
        ],
        category: 'Entertainment',
        demoVideo: '/demo-gaming.mp4'
    },
    {
        id: 'social',
        title: 'Social Media Content',
        description: 'Create scroll-stopping content optimized for every platform with format-specific templates and trending effects.',
        features: ['Vertical format optimization', 'Trending style effects', 'Auto-captions', 'Platform-specific cuts', 'Viral templates'],
        icon: <Smartphone className="w-8 h-8" />,
        gradient: 'from-cyan-500/20 via-cyan-600/10 to-purple-500/20',
        borderGradient: 'from-cyan-500/50 to-purple-500/50',
        stats: [
            { label: 'Engagement Rate', value: '+250%' },
            { label: 'Content Output', value: '5x faster' }
        ],
        category: 'Social Media',
        demoVideo: '/demo-social.mp4'
    },
    {
        id: 'professional',
        title: 'Professional Production',
        description: 'Studio-quality results for businesses and creators with advanced color grading, professional effects, and brand consistency.',
        features: ['Corporate templates', 'Brand consistency', 'Advanced color grading', 'Professional effects', 'Team collaboration'],
        icon: <Camera className="w-8 h-8" />,
        gradient: 'from-purple-500/20 via-cyan-500/10 to-emerald-500/20',
        borderGradient: 'from-purple-500/50 to-emerald-500/50',
        stats: [
            { label: 'Quality Score', value: '9.8/10' },
            { label: 'Client Satisfaction', value: '98%' }
        ],
        category: 'Business',
        demoVideo: '/demo-professional.mp4'
    }
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.2
        }
    }
};

const cardVariants = {
    hidden: {
        opacity: 0,
        y: 60,
        scale: 0.9
    },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            stiffness: 100,
            damping: 15,
            duration: 0.8
        }
    }
};

export const KeyUseCases: React.FC = () => {
    const [selectedCase, setSelectedCase] = useState<string | null>(null);
    const [hoveredCase, setHoveredCase] = useState<string | null>(null);

    const handleStartCreating = () => {
        // Scroll to the waitlist form section
        const waitlistElement = document.getElementById('quick-signup');
        if (waitlistElement) {
            const offsetTop = waitlistElement.getBoundingClientRect().top + window.pageYOffset - 100;
            window.scrollTo({ top: offsetTop, behavior: 'smooth' });
        }
    };

    return (
        <section className="relative">
            {/* Background effects */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
            <div className="absolute top-1/4 -right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />

            {/* Standard Header */}
            <StandardHeader
                badge={{
                    icon: <Target className="w-4 h-4" />,
                    text: "Use Cases",
                    variant: "primary"
                }}
                heading="Create Amazing Content for Every Platform"
                description="Whether you're a gamer, content creator, or professional, VFXB's AI-powered tools help you create stunning videos that captivate your audience and drive engagement."
                cta={{
                    text: "Start Creating Now",
                    icon: <Zap className="w-5 h-5" />,
                    onClick: handleStartCreating
                }}
                maxWidth="5xl"
            />

            {/* Use Cases Grid */}
            <div className="max-w-7xl mx-auto px-4 pb-20">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 lg:grid-cols-3 gap-8"
                >
                    {useCases.map((useCase) => (
                        <motion.div
                            key={useCase.id}
                            variants={cardVariants}
                            onMouseEnter={() => setHoveredCase(useCase.id)}
                            onMouseLeave={() => setHoveredCase(null)}
                            whileHover={{
                                y: -12,
                                transition: { duration: 0.3 }
                            }}
                            className="group relative"
                        >
                            <Card className="relative h-full overflow-hidden border-0 bg-gradient-to-br from-card/95 via-card/90 to-card/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-500">
                                {/* Animated border */}
                                <div className={`absolute inset-0 bg-gradient-to-r ${useCase.borderGradient} rounded-lg p-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>
                                    <div className="h-full w-full bg-card rounded-lg" />
                                </div>

                                {/* Background gradient overlay */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${useCase.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                                <CardContent className="relative z-10 p-8 h-full flex flex-col">
                                    {/* Category Badge */}
                                    <div className="flex items-center justify-between mb-6">
                                        <Badge variant="outline" className="text-xs font-medium bg-primary/10 text-primary border-primary/20">
                                            {useCase.category}
                                        </Badge>
                                        <motion.div
                                            animate={{ rotate: hoveredCase === useCase.id ? 360 : 0 }}
                                            transition={{ duration: 0.5 }}
                                            className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center"
                                        >
                                            <div className="text-primary group-hover:text-accent transition-colors duration-300">
                                                {useCase.icon}
                                            </div>
                                        </motion.div>
                                    </div>

                                    {/* Title & Description */}
                                    <div className="flex-1 mb-6">
                                        <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-accent group-hover:bg-clip-text transition-all duration-300">
                                            {useCase.title}
                                        </h3>

                                        <p className="text-sm text-muted-foreground leading-relaxed group-hover:text-foreground/80 transition-colors duration-300">
                                            {useCase.description}
                                        </p>
                                    </div>

                                    {/* Features List */}
                                    <div className="mb-6">
                                        <div className="space-y-2">
                                            {useCase.features.slice(0, 3).map((feature, index) => (
                                                <motion.div
                                                    key={`${useCase.id}-feature-${index}-${feature.slice(0, 10)}`}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    whileInView={{ opacity: 1, x: 0 }}
                                                    viewport={{ once: true }}
                                                    transition={{ delay: index * 0.1 }}
                                                    className="flex items-center gap-3 text-sm"
                                                >
                                                    <div className="w-1.5 h-1.5 rounded-full bg-primary group-hover:bg-accent transition-colors duration-300" />
                                                    <span className="text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                            {feature}
                          </span>
                                                </motion.div>
                                            ))}
                                            {useCase.features.length > 3 && (
                                                <div className="flex items-center gap-3 text-sm text-primary/60">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                                                    <span>+{useCase.features.length - 3} more features</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Stats */}
                                    <div className="grid grid-cols-2 gap-4">
                                        {useCase.stats.map((stat, index) => (
                                            <div key={`${useCase.id}-stat-${stat.label}-${index}`} className="text-center p-3 rounded-lg bg-background/50 group-hover:bg-background/80 transition-colors duration-300">
                                                <div className="text-lg font-bold text-primary group-hover:text-accent transition-colors duration-300">
                                                    {stat.value}
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                    {stat.label}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>

                                {/* Hover glow effects */}
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
                                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-accent to-transparent" />
                                    <div className="absolute top-1/2 left-0 -translate-y-1/2 w-px h-32 bg-gradient-to-b from-transparent via-primary to-transparent" />
                                    <div className="absolute top-1/2 right-0 -translate-y-1/2 w-px h-32 bg-gradient-to-b from-transparent via-accent to-transparent" />
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Success Stories Section */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                    className="mt-20 text-center"
                >
                    <div className="inline-flex items-center gap-2 mb-6">
                        <TrendingUp className="w-5 h-5 text-accent" />
                        <span className="text-sm font-medium text-accent uppercase tracking-wider">
              Success Stories
            </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                        {[
                            { icon: <Users className="w-6 h-6" />, value: "50K+", label: "Active Creators" },
                            { icon: <Star className="w-6 h-6" />, value: "4.9/5", label: "User Rating" },
                            { icon: <Zap className="w-6 h-6" />, value: "1M+", label: "Videos Created" }
                        ].map((stat, index) => (
                            <motion.div
                                key={`success-stat-${stat.label}-${index}`}
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.8 + index * 0.1 }}
                                className="text-center p-6 rounded-xl bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-sm border border-primary/10 hover:border-primary/30 transition-all duration-300"
                            >
                                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-primary">
                                    {stat.icon}
                                </div>
                                <div className="text-2xl font-bold text-foreground mb-2">
                                    {stat.value}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    {stat.label}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
};