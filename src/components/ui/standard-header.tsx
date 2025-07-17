"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface StandardHeaderProps {
    badge?: {
        icon: React.ReactNode;
        text: string;
        variant?: 'primary' | 'accent' | 'success';
    };
    heading: string;
    description: string;
    cta?: {
        text: string;
        icon?: React.ReactNode;
        onClick?: () => void;
    };
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | 'full';
    align?: 'left' | 'center' | 'right';
    animation?: boolean;
}

const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-5xl',
    '6xl': 'max-w-6xl',
    '7xl': 'max-w-7xl',
    full: 'max-w-full'
};

const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
};

const badgeVariants = {
    primary: 'bg-primary/20 text-primary border-primary/30',
    accent: 'bg-accent/20 text-accent border-accent/30',
    success: 'bg-success/20 text-success border-success/30'
};

export const StandardHeader = ({
                                   badge,
                                   heading,
                                   description,
                                   cta,
                                   maxWidth = '4xl',
                                   align = 'center',
                                   animation = true
                               }: StandardHeaderProps) => {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start 0.8", "end 0.2"]
    });

    const y = useTransform(scrollYProgress, [0, 1], [0, -50]);
    const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.8, 0.6]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: "easeOut"
            }
        }
    };

    const particleVariants = {
        animate: {
            y: [0, -20, 0],
            opacity: [0.3, 0.8, 0.3],
            transition: {
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    };

    return (
        <div ref={ref} className="relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 -z-10">
                {/* Gradient Orbs */}
                <motion.div
                    animate={{
                        rotate: 360,
                        scale: [1, 1.2, 1]
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 blur-3xl"
                />
                <motion.div
                    animate={{
                        rotate: -360,
                        scale: [1.2, 1, 1.2]
                    }}
                    transition={{
                        duration: 25,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-gradient-to-tr from-accent/20 to-success/20 blur-3xl"
                />

                {/* Floating Particles */}
                {Array.from({ length: 8 }).map((_, i) => (
                    <motion.div
                        key={i}
                        variants={particleVariants}
                        animate="animate"
                        className="absolute w-2 h-2 bg-primary/40 rounded-full"
                        style={{
                            left: `${20 + (i * 10)}%`,
                            top: `${30 + (i * 8)}%`,
                            animationDelay: `${i * 0.5}s`
                        }}
                    />
                ))}
            </div>

            {/* Content */}
            <motion.div
                variants={animation ? containerVariants : undefined}
                initial={animation ? "hidden" : undefined}
                animate={animation ? "visible" : undefined}
                style={animation ? { y, opacity } : undefined}
                className={`relative z-10 w-full ${maxWidthClasses[maxWidth]} mx-auto px-4 py-16 md:py-24 ${alignClasses[align]}`}
            >
                {/* Badge */}
                {badge && (
                    <motion.div
                        variants={animation ? itemVariants : undefined}
                        className={`inline-flex items-center gap-2 mb-6 ${align === 'center' ? 'justify-center' : ''}`}
                    >
                        <Badge
                            variant="outline"
                            className={`${badgeVariants[badge.variant || 'primary']} backdrop-blur-sm transition-all duration-300 hover:scale-105`}
                        >
                            <span className="mr-2">{badge.icon}</span>
                            {badge.text}
                        </Badge>
                    </motion.div>
                )}

                {/* Main Heading */}
                <motion.h1
                    variants={animation ? itemVariants : undefined}
                    className="header-h1 mb-6 bg-gradient-to-r from-white via-white/90 to-white/80 bg-clip-text text-transparent leading-tight"
                >
                    {heading}
                </motion.h1>

                {/* Description */}
                <motion.p
                    variants={animation ? itemVariants : undefined}
                    className="header-body text-muted-foreground mb-8 leading-relaxed"
                >
                    {description}
                </motion.p>

                {/* CTA Button */}
                {cta && (
                    <motion.div
                        variants={animation ? itemVariants : undefined}
                        className={`${align === 'center' ? 'flex justify-center' : ''}`}
                    >
                        <Button
                            onClick={cta.onClick}
                            size="lg"
                            className="relative overflow-hidden bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white shadow-2xl shadow-primary/25 transition-all duration-300 hover:scale-105 hover:shadow-primary/40"
                        >
              <span className="relative z-10 flex items-center gap-2">
                {cta.text}
                  {cta.icon && <span className="ml-2">{cta.icon}</span>}
              </span>
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
                                initial={{ x: '-100%' }}
                                whileHover={{ x: '100%' }}
                                transition={{ duration: 0.5 }}
                            />
                        </Button>
                    </motion.div>
                )}
            </motion.div>

            {/* Enhanced Bottom Gradient Fade */}
            <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-background via-background/95 to-background/20 pointer-events-none" />

            {/* Additional fade layers for smoother transition */}
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background via-background/90 to-transparent pointer-events-none" />
            <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-background to-transparent pointer-events-none" />
        </div>
    );
};