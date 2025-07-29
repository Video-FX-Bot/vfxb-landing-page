"use client";

import React from 'react';
import { motion, useInView } from 'motion/react';
import { useRef } from 'react';

interface SectionTransitionProps {
    variant?: 'default' | 'reverse' | 'centered';
    showParticles?: boolean;
    className?: string;
}

export const SectionTransition: React.FC<SectionTransitionProps> = ({
                                                                        variant = 'default',
                                                                        showParticles = true,
                                                                        className = ''
                                                                    }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.3 });

    const particleVariants = {
        hidden: { opacity: 0, scale: 0, x: -100 },
        visible: (i: number) => ({
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
            x: [
                variant === 'reverse' ? 300 : -100,
                variant === 'centered' ? 0 : (variant === 'reverse' ? -100 : 300),
                variant === 'reverse' ? -100 : 300
            ],
            transition: {
                duration: 4,
                delay: i * 0.2,
                repeat: Infinity,
                repeatDelay: 3
            }
        })
    };

    const waveVariants = {
        hidden: { pathLength: 0, opacity: 0 },
        visible: {
            pathLength: 1,
            opacity: 1,
            transition: {
                duration: 2
            }
        }
    };

    const geometricShapeVariants = {
        hidden: { opacity: 0, rotate: 0, scale: 0 },
        visible: {
            opacity: 0.1,
            rotate: 360,
            scale: 1,
            transition: {
                duration: 20,
                repeat: Infinity
            }
        }
    };

    const gradientDirection = variant === 'reverse'
        ? 'bg-gradient-to-l'
        : variant === 'centered'
            ? 'bg-gradient-to-r'
            : 'bg-gradient-to-r';

    return (
        <div
            ref={ref}
            className={`relative h-[100px] w-full overflow-hidden ${className}`}
        >
            {/* Background gradient */}
            <div className={`absolute inset-0 ${gradientDirection} from-transparent via-primary/5 to-transparent`} />

            {/* Subtle pattern overlay */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.1),transparent_70%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(6,182,212,0.1),transparent_70%)]" />
            </div>

            {/* Animated geometric shapes */}
            <motion.div
                className="absolute top-1/2 left-1/4 w-16 h-16 border border-primary/20 rounded-lg"
                variants={geometricShapeVariants}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                style={{ transformOrigin: "center" }}
            />

            <motion.div
                className="absolute top-1/4 right-1/4 w-12 h-12 border border-accent/20 rounded-full"
                variants={geometricShapeVariants}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                style={{ transformOrigin: "center" }}
                transition={{ delay: 0.5 }}
            />

            {/* Flowing wave SVG */}
            <svg
                className="absolute top-1/2 left-0 w-full h-full transform -translate-y-1/2"
                viewBox="0 0 1200 100"
                preserveAspectRatio="none"
            >
                <motion.path
                    d="M0,50 Q300,10 600,50 T1200,50"
                    stroke="url(#waveGradient)"
                    strokeWidth="2"
                    fill="none"
                    variants={waveVariants}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                />
                <defs>
                    <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0" />
                        <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.6" />
                        <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
                    </linearGradient>
                </defs>
            </svg>

            {/* Floating particles */}
            {showParticles && (
                <div className="absolute inset-0">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-2 h-2 rounded-full bg-gradient-to-r from-primary to-accent"
                            style={{
                                top: `${20 + (i * 10)}%`,
                                left: variant === 'reverse' ? '80%' : '20%',
                            }}
                            custom={i}
                            variants={particleVariants}
                            initial="hidden"
                            animate={isInView ? "visible" : "hidden"}
                        />
                    ))}
                </div>
            )}

            {/* Animated dots pattern */}
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex space-x-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <motion.div
                            key={i}
                            className="w-1 h-1 rounded-full bg-primary/40"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={isInView ? {
                                scale: [0, 1, 0],
                                opacity: [0, 1, 0],
                            } : { scale: 0, opacity: 0 }}
                            transition={{
                                duration: 2,
                                delay: i * 0.1,
                                repeat: Infinity,
                                repeatDelay: 1
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* Glowing orb effect */}
            <motion.div
                className="absolute top-1/2 left-1/2 w-4 h-4 bg-gradient-to-r from-primary to-accent rounded-full blur-sm"
                initial={{ opacity: 0, scale: 0 }}
                animate={isInView ? {
                    opacity: [0, 0.8, 0],
                    scale: [0, 1, 0],
                } : { opacity: 0, scale: 0 }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                    repeatDelay: 2
                }}
                style={{ transform: 'translate(-50%, -50%)' }}
            />

            {/* Subtle grid pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="w-full h-full bg-[linear-gradient(90deg,rgba(139,92,246,0.1)_1px,transparent_1px),linear-gradient(rgba(139,92,246,0.1)_1px,transparent_1px)] bg-[size:20px_20px]" />
            </div>

            {/* Bottom fade effect */}
            <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-background to-transparent" />

            {/* Top fade effect */}
            <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-background to-transparent" />
        </div>
    );
};