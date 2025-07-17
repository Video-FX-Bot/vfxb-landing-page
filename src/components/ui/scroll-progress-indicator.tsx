"use client";

import { useScroll, useSpring, motion } from "motion/react";
import { useEffect, useState } from "react";

interface ScrollProgressIndicatorProps {
    className?: string;
}

export const ScrollProgressIndicator = ({ className = "" }: ScrollProgressIndicatorProps) => {
    const [isVisible, setIsVisible] = useState(false);
    const { scrollYProgress } = useScroll();

    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    useEffect(() => {
        const handleScroll = () => {
            const scrolled = window.scrollY;
            setIsVisible(scrolled > 50);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <motion.div
            className={`fixed top-0 left-0 right-0 h-1 z-50 ${className}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: isVisible ? 1 : 0 }}
            transition={{ duration: 0.3 }}
        >
            {/* Background bar */}
            <div className="absolute inset-0 bg-border/30" />

            {/* Progress bar */}
            <motion.div
                className="h-full bg-gradient-to-r from-primary via-accent to-primary relative"
                style={{ scaleX, transformOrigin: "0%" }}
            >
                {/* Glow effect */}
                <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-primary/50 to-accent/50 blur-sm"
                    style={{ scaleX, transformOrigin: "0%" }}
                />

                {/* Sharp gradient overlay */}
                <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-primary to-accent"
                    style={{ scaleX, transformOrigin: "0%" }}
                />

                {/* Leading edge highlight */}
                <motion.div
                    className="absolute top-0 right-0 w-2 h-full bg-gradient-to-l from-accent to-transparent opacity-75"
                    style={{ scaleX, transformOrigin: "0%" }}
                />
            </motion.div>
        </motion.div>
    );
};