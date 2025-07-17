"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Star, PlayCircle, Zap, MessageSquare, Users, UserPlus } from "lucide-react";

export const SectionNavigation = () => {
    const [activeSection, setActiveSection] = useState("features");

    // Updated sections with waitlist functionality
    const sections = [
        { id: "features", label: "Features", icon: Star },
        { id: "demo", label: "Demo", icon: PlayCircle },
        { id: "use-cases", label: "Use Cases", icon: Zap },
        { id: "testimonials", label: "Testimonials", icon: MessageSquare },
        { id: "team", label: "Team", icon: Users },
        { id: "quick-signup", label: "Join Waitlist", icon: UserPlus },
    ];

    useEffect(() => {
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

        sections.forEach((section) => {
            const element = document.getElementById(section.id);
            if (element) {
                observer.observe(element);
            }
        });

        return () => observer.disconnect();
    }, []);

    const scrollToSection = (sectionId: string) => {
        const element = document.getElementById(sectionId);
        if (element) {
            const offsetTop = element.getBoundingClientRect().top + window.pageYOffset - 100;
            window.scrollTo({ top: offsetTop, behavior: "smooth" });
        }
    };

    return (
        <div className="fixed right-8 top-1/2 transform -translate-y-1/2 z-50 hidden lg:block">
            <div className="bg-background/95 backdrop-blur-lg border border-border/50 rounded-full p-3 shadow-lg">
                <div className="flex flex-col space-y-4">
                    {sections.map((section) => {
                        const IconComponent = section.icon;
                        const isActive = activeSection === section.id;

                        return (
                            <motion.button
                                key={section.id}
                                onClick={() => scrollToSection(section.id)}
                                className={`relative p-3 rounded-full transition-all duration-300 group ${
                                    isActive
                                        ? "bg-primary/20 text-primary shadow-lg"
                                        : "text-muted-foreground hover:text-primary hover:bg-primary/10"
                                }`}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <IconComponent className="h-5 w-5" />

                                {/* Tooltip */}
                                <div className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                                    <div className="bg-background/95 backdrop-blur-lg border border-border/50 rounded-lg px-3 py-1 text-sm font-medium whitespace-nowrap shadow-lg">
                                        {section.label}
                                    </div>
                                </div>

                                {/* Active indicator */}
                                {isActive && (
                                    <motion.div
                                        className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30"
                                        layoutId="activeIndicator"
                                        initial={false}
                                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                    />
                                )}
                            </motion.button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};