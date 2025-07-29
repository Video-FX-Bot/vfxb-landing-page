"use client"

import React, { useState, useEffect, useCallback } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'motion/react'
import { Play, Zap, Users, Shield, CheckCircle, Clock, Star, ArrowRight, Bell } from 'lucide-react'

// Particle system component
const ParticleSystem = () => {
    const [particles, setParticles] = useState<Array<{
        id: number
        x: number
        y: number
        vx: number
        vy: number
        size: number
        opacity: number
    }>>([])
    const [isClient, setIsClient] = useState(false)

    const createParticle = useCallback((id: number) => {
        // Use deterministic seed based on id for consistent positioning
        const seed = id * 137.508; // Golden angle for better distribution
        const normalizedSin = (Math.sin(seed) + 1) / 2; // Normalize to 0-1
        const normalizedCos = (Math.cos(seed) + 1) / 2; // Normalize to 0-1
        const normalizedSin2 = (Math.sin(seed * 2) + 1) / 2;
        const normalizedCos2 = (Math.cos(seed * 2) + 1) / 2;
        
        return {
            id,
            x: normalizedSin * (typeof window !== 'undefined' ? window.innerWidth : 1000),
            y: normalizedCos * (typeof window !== 'undefined' ? window.innerHeight : 600),
            vx: (normalizedSin2 - 0.5) * 0.5,
            vy: (normalizedCos2 - 0.5) * 0.5,
            size: (normalizedSin * 2) + 1,
            opacity: (normalizedCos * 0.6) + 0.2
        }
    }, [])

    useEffect(() => {
        setIsClient(true)
        // Initialize particles only on client side
        const initialParticles = Array.from({ length: 50 }, (_, i) => createParticle(i))
        setParticles(initialParticles)

        // Animation loop
        const animate = () => {
            setParticles(prev => prev.map(particle => {
                const newX = particle.x + particle.vx
                const newY = particle.y + particle.vy
                const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1000
                const screenHeight = typeof window !== 'undefined' ? window.innerHeight : 600
                
                return {
                    ...particle,
                    x: newX > screenWidth ? 0 : newX < 0 ? screenWidth : newX,
                    y: newY > screenHeight ? 0 : newY < 0 ? screenHeight : newY
                }
            }))
        }

        const interval = setInterval(animate, 16) // 60fps
        return () => clearInterval(interval)
    }, [createParticle])

    if (!isClient) {
        return null // Don't render on server to avoid hydration mismatch
    }

    return (
        <div className="absolute inset-0 pointer-events-none">
            {particles.map(particle => (
                <motion.div
                    key={particle.id}
                    className="absolute w-1 h-1 bg-primary/30 rounded-full"
                    style={{
                        left: particle.x,
                        top: particle.y,
                        opacity: particle.opacity,
                        scale: particle.size
                    }}
                    animate={{
                        opacity: [particle.opacity, particle.opacity * 0.5, particle.opacity],
                        scale: [particle.size, particle.size * 1.2, particle.size]
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
            ))}
        </div>
    )
}

// Floating geometry component
const FloatingGeometry = () => {
    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <motion.div
                className="absolute top-20 left-20 w-32 h-32 border border-primary/20 rounded-lg"
                animate={{
                    rotate: [0, 360],
                    scale: [1, 1.1, 1]
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear"
                }}
            />
            <motion.div
                className="absolute top-1/4 right-1/4 w-24 h-24 border border-accent/20 rounded-full"
                animate={{
                    rotate: [360, 0],
                    y: [0, -20, 0]
                }}
                transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />
            <motion.div
                className="absolute bottom-1/4 left-1/3 w-20 h-20 border border-primary/15 transform rotate-45"
                animate={{
                    rotate: [45, 225, 45],
                    scale: [1, 1.2, 1]
                }}
                transition={{
                    duration: 18,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />
        </div>
    )
}

// Countdown timer component
const CountdownTimer = () => {
    const [timeLeft, setTimeLeft] = useState({
        days: 2,
        hours: 14,
        minutes: 30,
        seconds: 0
    })

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev.seconds > 0) {
                    return { ...prev, seconds: prev.seconds - 1 }
                } else if (prev.minutes > 0) {
                    return { ...prev, minutes: prev.minutes - 1, seconds: 59 }
                } else if (prev.hours > 0) {
                    return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 }
                } else if (prev.days > 0) {
                    return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 }
                }
                return prev
            })
        }, 1000)

        return () => clearInterval(timer)
    }, [])

    return (
        <motion.div
            className="flex items-center justify-center gap-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
        >
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>Early bird offer ends in:</span>
            </div>
            <div className="flex gap-2">
                {Object.entries(timeLeft).map(([unit, value]) => (
                    <div key={unit} className="text-center">
                        <div className="bg-primary/10 border border-primary/20 rounded-lg px-2 py-1 min-w-[40px]">
                            <div className="text-lg font-bold text-primary">{value.toString().padStart(2, '0')}</div>
                            <div className="text-xs text-muted-foreground">{unit}</div>
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    )
}

// User avatars component
const UserAvatars = () => {
    const users = [
        { name: "Alex M.", avatar: "AM", joined: "2m ago" },
        { name: "Sarah L.", avatar: "SL", joined: "5m ago" },
        { name: "John D.", avatar: "JD", joined: "8m ago" },
        { name: "Emma R.", avatar: "ER", joined: "12m ago" }
    ]

    return (
        <motion.div
            className="flex items-center justify-center gap-4 mb-8"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
        >
            <div className="flex -space-x-2">
                {users.map((user, index) => (
                    <motion.div
                        key={user.name}
                        className="w-8 h-8 bg-primary/20 border-2 border-primary/40 rounded-full flex items-center justify-center text-xs font-semibold text-primary"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
                    >
                        {user.avatar}
                    </motion.div>
                ))}
            </div>
            <div className="text-sm text-muted-foreground">
                <span className="text-primary font-semibold">+2,847</span> creators are ready
            </div>
        </motion.div>
    )
}

// Trust badges component
const TrustBadges = () => {
    const badges = [
        { icon: Shield, text: "100% Secure" },
        { icon: Users, text: "Creator Community" },
        { icon: Star, text: "Early Access" },
        { icon: CheckCircle, text: "No Commitment" }
    ]

    return (
        <motion.div
            className="flex items-center justify-center gap-6 mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
        >
            {badges.map((badge, index) => (
                <motion.div
                    key={badge.text}
                    className="flex items-center gap-2 text-sm text-muted-foreground"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                >
                    <badge.icon className="w-4 h-4 text-primary" />
                    <span>{badge.text}</span>
                </motion.div>
            ))}
        </motion.div>
    )
}

export default function SimpleCenteredWithGradient() {
    const { scrollYProgress } = useScroll()
    const y = useTransform(scrollYProgress, [0, 1], [0, -50])
    const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.8, 0.6])

    return (
        <div className="relative isolate overflow-hidden bg-background">
            {/* Particle system */}
            <ParticleSystem />

            {/* Floating geometry */}
            <FloatingGeometry />

            {/* Animated background gradients */}
            <motion.div
                className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/20"
                style={{ y, opacity }}
            />

            <div className="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
                <div className="mx-auto max-w-4xl text-center">
                    {/* Countdown timer */}
                    <CountdownTimer />

                    {/* User avatars */}
                    <UserAvatars />

                    {/* Animated heading */}
                    <motion.h2
                        className="header-h1 font-bold tracking-tight text-foreground"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        Don't Miss Out on{" "}
                        <motion.span
                            className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                        >
                            Early Access
                        </motion.span>
                    </motion.h2>

                    {/* Description */}
                    <motion.p
                        className="mx-auto mt-6 max-w-2xl header-body text-muted-foreground"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                    >
                        Be among the first to experience VFXB's revolutionary AI video effects. Limited spots available for early access.
                    </motion.p>

                    {/* CTA button */}
                    <motion.div
                        className="mt-10 flex items-center justify-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.8 }}
                    >
                        {/* Primary CTA with pulsing glow */}
                        <motion.a
                            href="#quick-signup"
                            className="relative group inline-flex items-center gap-2 rounded-lg bg-primary px-8 py-4 header-body font-semibold text-primary-foreground shadow-lg hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                        >
                            <motion.div
                                className="absolute -inset-0.5 bg-gradient-to-r from-primary to-accent rounded-lg blur opacity-75 group-hover:opacity-100"
                                animate={{
                                    scale: [1, 1.05, 1],
                                    opacity: [0.5, 0.8, 0.5]
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                            />
                            <span className="relative flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Get Notified
              </span>
                        </motion.a>
                    </motion.div>

                    {/* Trust badges */}
                    <TrustBadges />
                </div>
            </div>

            {/* Enhanced background gradient */}
            <motion.svg
                viewBox="0 0 1024 1024"
                aria-hidden="true"
                className="absolute top-1/2 left-1/2 -z-10 size-[64rem] -translate-x-1/2 mask-[radial-gradient(closest-side,white,transparent)]"
                style={{ y }}
            >
                <defs>
                    <radialGradient id="enhanced-gradient">
                        <stop stopColor="#8b5cf6" stopOpacity="0.8" />
                        <stop offset={0.5} stopColor="#06b6d4" stopOpacity="0.6" />
                        <stop offset={1} stopColor="#8b5cf6" stopOpacity="0.3" />
                    </radialGradient>
                </defs>
                <motion.circle
                    r={512}
                    cx={512}
                    cy={512}
                    fill="url(#enhanced-gradient)"
                    animate={{
                        r: [512, 550, 512],
                        opacity: [0.7, 0.9, 0.7]
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
            </motion.svg>
        </div>
    )
}