"use client";

import { useState, useEffect } from "react";
import { Menu, X, Download, Globe, Star, PlayCircle, Zap, MessageSquare, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";

export const StickyNavigation = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState("features");
    const [scrollProgress, setScrollProgress] = useState(0);

    const navLinks = [
        { id: "features", label: "Features", href: "#features", icon: Star },
        { id: "demo", label: "Demo", href: "#demo", icon: PlayCircle },
        { id: "use-cases", label: "Use Cases", href: "#use-cases", icon: Zap },
        { id: "testimonials", label: "Testimonials", href: "#testimonials", icon: MessageSquare },
        { id: "team", label: "Team", href: "#team", icon: Users },
    ];

    const scrollToWaitlist = () => {
        const element = document.querySelector("#quick-signup");
        if (element) {
            const offsetTop = element.getBoundingClientRect().top + window.pageYOffset - 100;
            window.scrollTo({ top: offsetTop, behavior: "smooth" });
        }
        setIsMobileMenuOpen(false);
    };

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.pageYOffset;
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = (scrollTop / scrollHeight) * 100;

            setScrollProgress(progress);
            setIsScrolled(scrollTop > 100);
        };

        const observerOptions = {
            root: null,
            rootMargin: "-20% 0px -80% 0px",
            threshold: 0,
        };

        const observerCallback = (entries: IntersectionObserverEntry[]) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id);
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);

        // Observe all sections
        navLinks.forEach((link) => {
            const element = document.getElementById(link.id);
            if (element) observer.observe(element);
        });

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
            observer.disconnect();
        };
    }, []);

    const scrollToSection = (href: string) => {
        const element = document.querySelector(href);
        if (element) {
            const offsetTop = element.getBoundingClientRect().top + window.pageYOffset - 100;
            window.scrollTo({ top: offsetTop, behavior: "smooth" });
        }
        setIsMobileMenuOpen(false);
    };

    return (
        <>
            {/* Main Static Header - Always visible */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-lg border-b border-border/50 shadow-lg">
                <div className="container mx-auto px-4 lg:px-6">
                    <div className="flex items-center justify-between h-24">
                        {/* Logo - Clickable to scroll to hero */}
                        <VFXBLogo onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} />

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-8">
                            {navLinks.map((link) => {
                                const IconComponent = link.icon;
                                return (
                                    <button
                                        key={link.id}
                                        onClick={() => scrollToSection(link.href)}
                                        className={`group relative flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 hover:text-primary hover:bg-primary/10 ${
                                            activeSection === link.id
                                                ? "text-primary bg-primary/10"
                                                : "text-foreground/80"
                                        }`}
                                    >
                                        <IconComponent className="h-4 w-4" />
                                        {link.label}
                                        {activeSection === link.id && (
                                            <motion.div
                                                className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-lg border border-primary/30"
                                                layoutId="activeTab"
                                                initial={false}
                                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                            />
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Enhanced CTA Buttons - Both lead to waitlist */}
                        <div className="hidden md:flex items-center gap-3">
                            <Button
                                onClick={scrollToWaitlist}
                                variant="outline"
                                className="relative overflow-hidden bg-gradient-to-r from-cyan-500/10 to-purple-500/10 hover:from-cyan-500/20 hover:to-purple-500/20 border border-cyan-500/30 text-foreground hover:text-cyan-400 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 px-6 py-3"
                            >
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20"
                                    initial={{ x: "-100%" }}
                                    whileHover={{ x: "100%" }}
                                    transition={{ duration: 0.6 }}
                                />
                                <span className="relative z-10 flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  Try Online
                </span>
                            </Button>
                            <Button
                                onClick={scrollToWaitlist}
                                className="relative overflow-hidden bg-gradient-to-r from-primary via-primary to-accent hover:from-primary/90 hover:via-primary/90 hover:to-accent/90 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 px-6 py-3"
                            >
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-r from-accent/20 to-primary/20"
                                    initial={{ x: "-100%" }}
                                    whileHover={{ x: "100%" }}
                                    transition={{ duration: 0.6 }}
                                />
                                <span className="relative z-10 flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Download App
                </span>
                            </Button>
                        </div>

                        {/* Mobile Menu Toggle */}
                        <button
                            className="md:hidden p-3 rounded-lg hover:bg-muted transition-colors"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? (
                                <X className="h-6 w-6" />
                            ) : (
                                <Menu className="h-6 w-6" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Progress Bar */}
                <motion.div
                    className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-primary to-accent transition-all duration-100"
                    style={{ width: `${scrollProgress}%` }}
                />
            </nav>

            {/* Mobile Menu */}
            <div
                className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ${
                    isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
                }`}
            >
                {/* Backdrop */}
                <div
                    className="absolute inset-0 bg-background/80 backdrop-blur-lg"
                    onClick={() => setIsMobileMenuOpen(false)}
                />

                {/* Menu Content */}
                <div
                    className={`absolute top-24 left-0 right-0 bg-background/95 backdrop-blur-lg border-b border-border/50 shadow-xl transition-all duration-300 ${
                        isMobileMenuOpen ? "translate-y-0" : "-translate-y-full"
                    }`}
                >
                    <div className="container mx-auto px-4 py-6">
                        <div className="flex flex-col space-y-4">
                            {navLinks.map((link) => {
                                const IconComponent = link.icon;
                                return (
                                    <button
                                        key={link.id}
                                        onClick={() => scrollToSection(link.href)}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left text-lg font-medium transition-all duration-200 hover:text-primary hover:bg-primary/10 ${
                                            activeSection === link.id
                                                ? "text-primary bg-primary/10"
                                                : "text-foreground/80"
                                        }`}
                                    >
                                        <IconComponent className="h-5 w-5" />
                                        {link.label}
                                    </button>
                                );
                            })}
                            <div className="pt-4 border-t border-border/50 space-y-3">
                                <Button
                                    onClick={scrollToWaitlist}
                                    variant="outline"
                                    className="w-full bg-gradient-to-r from-cyan-500/10 to-purple-500/10 hover:from-cyan-500/20 hover:to-purple-500/20 border border-cyan-500/30 text-foreground hover:text-cyan-400 shadow-lg hover:shadow-xl transition-all duration-300 py-3"
                                >
                                    <Globe className="h-4 w-4 mr-2" />
                                    Try Online
                                </Button>
                                <Button
                                    onClick={scrollToWaitlist}
                                    className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white shadow-lg hover:shadow-xl transition-all duration-300 py-3"
                                >
                                    <Download className="h-4 w-4 mr-2" />
                                    Download App
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

const VFXBLogo = ({ onClick }: { onClick?: () => void }) => {
    return (
        <motion.div
            className="flex items-center cursor-pointer"
            onClick={onClick}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
        >
            <motion.div
                className="relative w-32 h-32 rounded-xl shadow-lg overflow-hidden"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
            >
                <img
                    src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/document-uploads/1752579044291-a695bfxaugr.png"
                    alt="VFXB Logo"
                    className="w-full h-full object-cover"
                />
            </motion.div>
        </motion.div>
    );
};