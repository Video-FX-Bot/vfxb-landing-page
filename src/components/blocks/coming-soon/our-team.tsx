"use client";

import React, { useCallback, useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Linkedin, Twitter, Users, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { StandardHeader } from '@/components/ui/standard-header';
import Link from 'next/link';
import { teamMembers as teamData, type TeamMember } from '@/data/team';
import useEmblaCarousel from 'embla-carousel-react';

interface OurTeamProps { limit?: number; enableSlider?: boolean; hideQuote?: boolean; showBackToLanding?: boolean }

const teamMembers: TeamMember[] = teamData;

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2
        }
    }
};

const itemVariants = {
    hidden: {
        opacity: 0,
        y: 30
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6
        }
    }
};

export const OurTeam = ({ limit, enableSlider, hideQuote, showBackToLanding }: OurTeamProps) => {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, align: 'start' });
    const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
    const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);
    const [canPrev, setCanPrev] = useState(false);
    const [canNext, setCanNext] = useState(false);

    useEffect(() => {
        if (!emblaApi) return;
        const onSelect = () => {
            setCanPrev(emblaApi.canScrollPrev());
            setCanNext(emblaApi.canScrollNext());
        };
        onSelect();
        emblaApi.on('select', onSelect);
        emblaApi.on('reInit', onSelect);
        return () => {
            emblaApi.off('select', onSelect);
            emblaApi.off('reInit', onSelect);
        };
    }, [emblaApi]);

    const displayedMembers = enableSlider ? teamMembers : (limit ? teamMembers.slice(0, limit) : teamMembers);
    return (
        <section id="team" className="min-h-screen py-20 px-4 relative overflow-hidden">
            {/* Background effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-gradient-to-br from-accent/10 to-transparent rounded-full blur-3xl" />

            <div className="max-w-7xl mx-auto relative z-10">
                {showBackToLanding && (
                    <div className="mb-6">
                        <Link href="/" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-muted/30 transition-colors">
                            ← Back
                        </Link>
                    </div>
                )}
                {/* Header */}
                <StandardHeader
                    badge={{
                        icon: <Users className="w-4 h-4" />,
                        text: "Meet the Team",
                        variant: "primary"
                    }}
                    heading="The Minds Behind VFXB"
                    description="A passionate team of innovators building the future of AI-powered video creation"
                    maxWidth="4xl"
                    align="center"
                />

                {/* Team members */}
                {enableSlider ? (
                    <div className="max-w-6xl mx-auto pt-6">
                        <div className="relative">
                            <div className="overflow-hidden" ref={emblaRef}>
                                <motion.div
                                    variants={containerVariants}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true }}
                                    className="flex gap-6"
                                >
                                    {displayedMembers.map((member, index) => (
                                        <motion.div
                                            key={member.id}
                                            variants={itemVariants}
                                            className="min-w-0 flex-[0_0_100%] sm:flex-[0_0_50%] lg:flex-[0_0_33.333%] pr-1 group"
                                        >
                                            <Card className="relative overflow-hidden bg-card/50 backdrop-blur-sm border-border/50 h-full transition-all duration-500 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-2">
                                                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                                <CardContent className="p-8 relative z-10">
                                                    <div className="flex flex-col items-center text-center">
                                                        {/* Profile image with animated border */}
                                                        <div className="relative mb-6">
                                                            <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                                <div className="w-full h-full bg-card rounded-full" />
                                                            </div>
                                                            <motion.img
                                                                src={member.image}
                                                                alt={member.name}
                                                                className="relative w-32 h-32 rounded-full object-cover border-2 border-border group-hover:border-primary/50 transition-all duration-300"
                                                                whileHover={{ scale: 1.05 }}
                                                                transition={{ duration: 0.2 }}
                                                            />
                                                            <Badge className="absolute -bottom-2 -right-2 bg-gradient-to-r from-primary to-accent text-white border-none text-xs px-2 py-1">
                                                                {member.experience}
                                                            </Badge>
                                                        </div>
                                                        <h3 className="text-2xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors duration-300">
                                                            {member.name}
                                                        </h3>
                                                        <p className="text-accent mb-6 font-medium text-base">
                                                            {member.role}
                                                        </p>
                                                        <p className="text-base text-muted-foreground mb-8 leading-relaxed min-h-[80px] max-w-md">
                                                            {member.description}
                                                        </p>
                                                        <div className="flex gap-4 mt-auto">
                                                            <Button variant="ghost" size="sm" className="h-12 w-12 p-0 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300 hover:scale-110" asChild>
                                                                <a href={member.social.linkedin} target="_blank" rel="noopener noreferrer">
                                                                    <Linkedin className="h-5 w-5" />
                                                                </a>
                                                            </Button>
                                                            <Button variant="ghost" size="sm" className="h-12 w-12 p-0 text-muted-foreground hover:text-accent hover:bg-accent/10 transition-all duration-300 hover:scale-110" asChild>
                                                                <a href={member.social.twitter} target="_blank" rel="noopener noreferrer">
                                                                    <Twitter className="h-5 w-5" />
                                                                </a>
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    ))}
                                </motion.div>
                            </div>

                            {/* Edge fade hints */}
                            {canPrev && (
                                <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-14 bg-gradient-to-r from-background/80 via-background/40 to-transparent" />
                            )}
                            {canNext && (
                                <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-14 bg-gradient-to-l from-background/80 via-background/40 to-transparent" />
                            )}

                            {/* Controls */}
                            <button
                                aria-label="Previous team members"
                                onClick={scrollPrev}
                                disabled={!canPrev}
                                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 grid place-items-center w-10 h-10 rounded-full border border-border/60 bg-background/60 backdrop-blur hover:bg-primary/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button
                                aria-label="Next team members"
                                onClick={scrollNext}
                                disabled={!canNext}
                                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 grid place-items-center w-10 h-10 rounded-full border border-border/60 bg-background/60 backdrop-blur hover:bg-primary/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                ) : (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-6xl mx-auto pt-6"
                    >
                        {displayedMembers.map((member, index) => (
                            <motion.div
                                key={member.id}
                                variants={itemVariants}
                                className="group"
                            >
                                <Card className="relative overflow-hidden bg-card/50 backdrop-blur-sm border-border/50 h-full transition-all duration-500 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-2">
                                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                    <CardContent className="p-8 relative z-10">
                                        <div className="flex flex-col items-center text-center">
                                            {/* Profile image with animated border */}
                                        <div className="relative mb-6">
                                            <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                <div className="w-full h-full bg-card rounded-full" />
                                            </div>
                                            <motion.img
                                                src={member.image}
                                                alt={member.name}
                                                className="relative w-32 h-32 rounded-full object-cover border-2 border-border group-hover:border-primary/50 transition-all duration-300"
                                                whileHover={{ scale: 1.05 }}
                                                transition={{ duration: 0.2 }}
                                            />
                                            {/* Experience badge */}
                                            <Badge className="absolute -bottom-2 -right-2 bg-gradient-to-r from-primary to-accent text-white border-none text-xs px-2 py-1">
                                                {member.experience}
                                            </Badge>
                                        </div>

                                        <h3 className="text-2xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors duration-300">
                                            {member.name}
                                        </h3>

                                        <p className="text-accent mb-6 font-medium text-base">
                                            {member.role}
                                        </p>

                                        <p className="text-base text-muted-foreground mb-8 leading-relaxed min-h-[80px] max-w-md">
                                            {member.description}
                                        </p>

                                        {/* Social links */}
                                        <div className="flex gap-4 mt-auto">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-12 w-12 p-0 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300 hover:scale-110"
                                                asChild
                                            >
                                                <a href={member.social.linkedin} target="_blank" rel="noopener noreferrer">
                                                    <Linkedin className="h-5 w-5" />
                                                </a>
                                            </Button>

                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-12 w-12 p-0 text-muted-foreground hover:text-accent hover:bg-accent/10 transition-all duration-300 hover:scale-110"
                                                asChild
                                            >
                                                <a href={member.social.twitter} target="_blank" rel="noopener noreferrer">
                                                    <Twitter className="h-5 w-5" />
                                                </a>
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>
                )}

                {/* CTA to full team page */}
                {((limit && teamMembers.length > limit) || (enableSlider && teamMembers.length > 3)) && (
                    <div className="mt-12 flex justify-center">
                        <Link href="/team" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-primary/30 text-primary hover:bg-primary/10 transition-colors">
                            Our Team
                        </Link>
                    </div>
                )}

                {/* Team quote */}
                {!hideQuote && (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.8 }}
                        className="mt-20 text-center"
                    >
                        <Card className="max-w-4xl mx-auto bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20 backdrop-blur-sm">
                            <CardContent className="p-10">
                                <Quote className="w-16 h-16 text-primary mx-auto mb-8" />
                                <blockquote className="text-xl text-muted-foreground italic mb-6 leading-relaxed">
                                    "We're not just building a tool – we're empowering creators to bring their wildest visions to life with cutting-edge AI technology."
                                </blockquote>
                                <p className="text-base text-primary font-semibold">— The VFXB Team</p>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}
            </div>
        </section>
    );
};