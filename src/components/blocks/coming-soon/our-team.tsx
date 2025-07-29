"use client";

import React from 'react';
import { motion } from 'motion/react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Linkedin, Twitter, Users, Quote } from 'lucide-react';
import { StandardHeader } from '@/components/ui/standard-header';

interface TeamMember {
    id: string;
    name: string;
    role: string;
    description: string;
    image: string;
    experience: string;
    social: {
        linkedin: string;
        twitter: string;
    };
}

const teamMembers: TeamMember[] = [
    {
        id: 'imama-reza',
        name: 'Imama Reza',
        role: 'Founder & CEO',
        description: 'Visionary leader with deep expertise in AI and video technology. Driving the future of content creation.',
        experience: '8+ years',
        image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/document-uploads/1752614495691-aun9rtvofhs.jpg',
        social: {
            linkedin: '#',
            twitter: '#'
        }
    },
    {
        id: 'raki-rajib',
        name: 'Raki Rajib',
        role: 'Chief Technology Officer',
        description: 'Technical architect building scalable AI infrastructure. Expert in distributed systems and machine learning.',
        experience: '7+ years',
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face',
        social: {
            linkedin: '#',
            twitter: '#'
        }
    },
    {
        id: 'zubayer-patowari',
        name: 'Zubayer Patowari',
        role: 'AI Engineer',
        description: 'AI specialist focused on computer vision and neural networks. Building the core intelligence behind VFXB.',
        experience: '5+ years',
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face',
        social: {
            linkedin: '#',
            twitter: '#'
        }
    }
];

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

export const OurTeam = () => {
    return (
        <section id="team" className="py-20 px-4 relative overflow-hidden">
            {/* Background effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-gradient-to-br from-accent/10 to-transparent rounded-full blur-3xl" />

            <div className="max-w-7xl mx-auto relative z-10">
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

                {/* Team members - Full width with better spacing */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-6xl mx-auto"
                >
                    {teamMembers.map((member, index) => (
                        <motion.div
                            key={member.id}
                            variants={itemVariants}
                            className="group"
                        >
                            <Card className="relative overflow-hidden bg-card/50 backdrop-blur-sm border-border/50 h-full transition-all duration-500 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-2">
                                {/* Gradient overlay */}
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

                {/* Team quote */}
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
            </div>
        </section>
    );
};