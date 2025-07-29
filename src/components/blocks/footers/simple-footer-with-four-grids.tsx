"use client"

import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Facebook, Instagram, Twitter, Linkedin, Mail, ArrowRight, Video, Zap, Star, Send } from "lucide-react";

export function SimpleFooterWithFourGrids() {
    const [email, setEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [particles, setParticles] = useState<Array<{x: number, y: number, duration: number}>>([]);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const productLinks = [
        {
            title: "Features",
            href: "#",
        },
        {
            title: "Pricing",
            href: "#",
        },
        {
            title: "Tutorials",
            href: "#",
        },
    ];

    const companyLinks = [
        {
            title: "About",
            href: "#",
        },
        {
            title: "Careers",
            href: "#",
        },
        {
            title: "Press",
            href: "#",
        },
    ];

    const supportLinks = [
        {
            title: "Help Center",
            href: "#",
        },
        {
            title: "Community",
            href: "#",
        },
        {
            title: "Contact",
            href: "#",
        },
    ];

    const legalLinks = [
        {
            title: "Privacy",
            href: "#",
        },
        {
            title: "Terms",
            href: "#",
        },
        {
            title: "GDPR",
            href: "#",
        },
    ];

    const socialLinks = [
        {
            title: "Facebook",
            href: "#",
            icon: Facebook,
        },
        {
            title: "Instagram",
            href: "#",
            icon: Instagram,
        },
        {
            title: "Twitter",
            href: "#",
            icon: Twitter,
        },
        {
            title: "LinkedIn",
            href: "#",
            icon: Linkedin,
        },
    ];

    const handleNewsletterSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Newsletter submission logic here
        setTimeout(() => {
            setIsSubmitting(false);
            setEmail("");
        }, 2000);
    };

    const currentYear = new Date().getFullYear();

    // Initialize particles on client side only to avoid hydration mismatch
    useEffect(() => {
        const generateParticles = () => {
            const newParticles = [];
            for (let i = 0; i < 20; i++) {
                // Use deterministic seed based on index for consistent positioning
                const seed = i * 137.508; // Golden angle for better distribution
                newParticles.push({
                    x: (Math.sin(seed) * 0.5 + 0.5) * Math.min(window.innerWidth, 1200),
                    y: (Math.cos(seed) * 0.5 + 0.5) * Math.min(window.innerHeight, 600),
                    duration: 15 + (i % 10) // Deterministic duration
                });
            }
            setParticles(newParticles);
        };

        generateParticles();
        
        // Regenerate on resize
        const handleResize = () => generateParticles();
        window.addEventListener('resize', handleResize);
        
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="bg-background border-t border-border px-4 sm:px-6 lg:px-8 py-20 w-full relative overflow-hidden">
            {/* Floating particles background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {isClient && particles.map((particle, i) => {
                    // Generate deterministic target positions
                    const targetSeed = (i + 1) * 137.508;
                    const targetX = (Math.sin(targetSeed) * 0.5 + 0.5) * Math.min(typeof window !== 'undefined' ? window.innerWidth : 1200, 1200);
                    const targetY = (Math.cos(targetSeed) * 0.5 + 0.5) * Math.min(typeof window !== 'undefined' ? window.innerHeight : 600, 600);
                    
                    return (
                        <motion.div
                            key={i}
                            className="absolute w-1 h-1 bg-primary/20 rounded-full"
                            initial={{
                                x: particle.x,
                                y: particle.y,
                                opacity: 0
                            }}
                            animate={{
                                x: targetX,
                                y: targetY,
                                opacity: [0, 1, 0]
                            }}
                            transition={{
                                duration: particle.duration,
                                repeat: Infinity,
                                repeatType: "loop"
                            }}
                        />
                    );
                })}
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Main footer content */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-16">
                    {/* Left side - Company info and newsletter */}
                    <div className="space-y-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <Logo />
                            <p className="text-muted-foreground text-lg mt-4 max-w-md">
                                AI-Powered Video Editing Revolution
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="space-y-4"
                        >
                            <h3 className="text-foreground font-semibold text-lg">Stay Updated</h3>
                            <form onSubmit={handleNewsletterSubmit} className="space-y-4">
                                <div className="relative max-w-md">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter your email"
                                        className="w-full px-4 py-3 bg-gradient-to-r from-muted to-muted/80 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300 text-foreground"
                                        required
                                    />
                                    <motion.button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-primary to-accent text-primary-foreground px-4 py-2 rounded-md hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 disabled:opacity-50"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        {isSubmitting ? (
                                            <motion.div
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 1, repeat: Infinity }}
                                            >
                                                <Send className="w-4 h-4" />
                                            </motion.div>
                                        ) : (
                                            <ArrowRight className="w-4 h-4" />
                                        )}
                                    </motion.button>
                                </div>
                            </form>
                        </motion.div>

                        {/* Social media icons */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="flex space-x-4"
                        >
                            {socialLinks.map((social, idx) => (
                                <motion.a
                                    key={idx}
                                    href={social.href}
                                    className="p-3 bg-muted rounded-lg hover:bg-primary/20 transition-all duration-300 group"
                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <social.icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
                                </motion.a>
                            ))}
                        </motion.div>
                    </div>

                    {/* Right side - Footer links grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="space-y-4"
                        >
                            <h3 className="text-foreground font-semibold text-lg">Product</h3>
                            <ul className="space-y-3">
                                {productLinks.map((link, idx) => (
                                    <li key={`product-${link.title}-${idx}`}>
                                        <Link
                                            href={link.href}
                                            className="text-muted-foreground hover:text-primary transition-colors duration-300 group flex items-center"
                                        >
                      <span className="group-hover:translate-x-1 transition-transform duration-300">
                        {link.title}
                      </span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="space-y-4"
                        >
                            <h3 className="text-foreground font-semibold text-lg">Company</h3>
                            <ul className="space-y-3">
                                {companyLinks.map((link, idx) => (
                                    <li key={`company-${link.title}-${idx}`}>
                                        <Link
                                            href={link.href}
                                            className="text-muted-foreground hover:text-primary transition-colors duration-300 group flex items-center"
                                        >
                      <span className="group-hover:translate-x-1 transition-transform duration-300">
                        {link.title}
                      </span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="space-y-4"
                        >
                            <h3 className="text-foreground font-semibold text-lg">Support</h3>
                            <ul className="space-y-3">
                                {supportLinks.map((link, idx) => (
                                    <li key={`support-${link.title}-${idx}`}>
                                        <Link
                                            href={link.href}
                                            className="text-muted-foreground hover:text-primary transition-colors duration-300 group flex items-center"
                                        >
                      <span className="group-hover:translate-x-1 transition-transform duration-300">
                        {link.title}
                      </span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="space-y-4"
                        >
                            <h3 className="text-foreground font-semibold text-lg">Legal</h3>
                            <ul className="space-y-3">
                                {legalLinks.map((link, idx) => (
                                    <li key={`legal-${link.title}-${idx}`}>
                                        <Link
                                            href={link.href}
                                            className="text-muted-foreground hover:text-primary transition-colors duration-300 group flex items-center"
                                        >
                      <span className="group-hover:translate-x-1 transition-transform duration-300">
                        {link.title}
                      </span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    </div>
                </div>

                {/* Animated divider */}
                <motion.div
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="h-px bg-gradient-to-r from-transparent via-primary to-transparent mb-8"
                />

                {/* Copyright section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 text-muted-foreground"
                >
                    <p>&copy; {currentYear} VFXB. All rights reserved.</p>

                    {/* Women Owned Business Badge */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.8 }}
                        className="flex items-center space-x-3"
                    >
                        <div className="w-40 h-40 relative flex-shrink-0">
                            <img
                                src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/document-uploads/1752612017593-ytrhl650dy.png"
                                alt="Women Owned Business"
                                className="w-full h-full object-contain"
                            />
                        </div>
                    </motion.div>
                </motion.div>
            </div>

            {/* Large background text */}
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.8 }}
                className="text-center mt-20 overflow-hidden"
            >
                <p className="text-5xl md:text-9xl lg:text-[12rem] xl:text-[13rem] font-bold bg-clip-text text-transparent bg-gradient-to-b from-muted/10 to-muted/30 pointer-events-none whitespace-nowrap">
                    VFXB
                </p>
            </motion.div>
        </div>
    );
}

const Logo = () => {
    return (
        <Link
            href="/"
            className="font-medium flex space-x-3 items-center text-foreground text-xl group"
        >
            <motion.div
                className="relative w-24 h-24 rounded-xl shadow-lg overflow-hidden flex-shrink-0"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
            >
                <img
                    src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/document-uploads/1752579044291-a695bfxaugr.png"
                    alt="VFXB Logo"
                    className="w-full h-full object-cover"
                />
            </motion.div>
        </Link>
    );
};