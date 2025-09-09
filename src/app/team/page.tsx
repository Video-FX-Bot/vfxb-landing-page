"use client";

import { motion } from "motion/react";
import { OurTeam } from "@/components/blocks/coming-soon/our-team";
import { StickyNavigation } from "@/components/navigation/sticky-navbar";
import Link from "next/link";
import { SimpleFooterWithFourGrids } from "@/components/blocks/footers/simple-footer-with-four-grids";

export default function TeamPage() {
    return (
        <>
            <main className="relative min-h-screen overflow-hidden">
                <StickyNavigation />

                {/* Section-scoped background so no bars show above/below */}
                <section className="relative min-h-screen pt-24 pb-0 overflow-hidden">
                    <div className="absolute inset-0 -z-10">
                        <motion.div
                            className="absolute -top-60 -left-40 w-[90vw] h-[90vw] rounded-full bg-primary/25 blur-3xl"
                            animate={{ x: [0, 40, -20, 0], y: [0, 20, -30, 0] }}
                            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                        />
                        <motion.div
                            className="absolute -bottom-60 -right-40 w-[90vw] h-[90vw] rounded-full bg-accent/25 blur-3xl"
                            animate={{ x: [0, -30, 20, 0], y: [0, -20, 30, 0] }}
                            transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background" />
                    </div>
                    <OurTeam hideQuote showBackToLanding enableSlider={false} />
                </section>
            </main>

            <section id="contact" className="relative">
                <SimpleFooterWithFourGrids />
            </section>
        </>
    );
}


