"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Star, CheckCircle, Play, Users, TrendingUp, Youtube, Instagram, Heart, MessageCircle, Sparkles, ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StandardHeader } from '@/components/ui/standard-header';
import Image from 'next/image';

interface Testimonial {
    id: number;
    name: string;
    role: string;
    platform: 'youtube' | 'tiktok' | 'instagram';
    verified: boolean;
    followers: string;
    avatar: string;
    content: string;
    rating: number;
    videoViews?: string;
    engagement?: string;
}

const testimonials: Testimonial[] = [
    {
        id: 1,
        name: "Alex Rodriguez",
        role: "Gaming Content Creator",
        platform: "youtube",
        verified: true,
        followers: "2.3M",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
        content: "VFXB has completely transformed my workflow. The templates are incredible and save me hours of editing time. My viewers love the professional look!",
        rating: 5,
        videoViews: "50M+",
        engagement: "98%"
    },
    {
        id: 2,
        name: "Sarah Chen",
        role: "Beauty & Lifestyle Influencer",
        platform: "instagram",
        verified: true,
        followers: "1.8M",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b332c38c?w=400&h=400&fit=crop&crop=face",
        content: "The quality and creativity of VFXB's effects are unmatched. My Instagram engagement has increased by 300% since I started using their templates.",
        rating: 5,
        videoViews: "25M+",
        engagement: "92%"
    },
    {
        id: 3,
        name: "Marcus Thompson",
        role: "Tech Reviewer",
        platform: "youtube",
        verified: true,
        followers: "3.1M",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
        content: "As a tech reviewer, I need my content to look cutting-edge. VFXB delivers exactly that with their innovative templates and seamless integration.",
        rating: 5,
        videoViews: "100M+",
        engagement: "95%"
    },
    {
        id: 4,
        name: "Emma Wilson",
        role: "Fashion Content Creator",
        platform: "tiktok",
        verified: true,
        followers: "5.2M",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
        content: "VFXB's templates are perfect for TikTok! They're trendy, eye-catching, and help my videos stand out in the feed. Absolutely love the variety.",
        rating: 5,
        videoViews: "200M+",
        engagement: "89%"
    },
    {
        id: 5,
        name: "David Kim",
        role: "Fitness Influencer",
        platform: "instagram",
        verified: true,
        followers: "900K",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face",
        content: "The motion graphics from VFXB add such a professional touch to my workout videos. My audience engagement has never been higher!",
        rating: 5,
        videoViews: "15M+",
        engagement: "87%"
    },
    {
        id: 6,
        name: "Lisa Garcia",
        role: "Travel Vlogger",
        platform: "youtube",
        verified: true,
        followers: "1.2M",
        avatar: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=400&h=400&fit=crop&crop=face",
        content: "VFXB's templates help me create stunning travel content that captures the essence of every destination. My subscribers are constantly asking about my editing techniques!",
        rating: 5,
        videoViews: "30M+",
        engagement: "91%"
    }
];

const platformConfig = {
    youtube: {
        icon: Youtube,
        color: '#FF0000',
        bgColor: 'bg-red-500'
    },
    tiktok: {
        icon: Play,
        color: '#000000',
        bgColor: 'bg-black'
    },
    instagram: {
        icon: Instagram,
        color: '#E4405F',
        bgColor: 'bg-pink-500'
    }
};

export const TestimonialsSection = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const [itemsPerView, setItemsPerView] = useState(3);

    useEffect(() => {
        const updateItemsPerView = () => {
            if (window.innerWidth >= 1024) {
                setItemsPerView(3);
            } else if (window.innerWidth >= 768) {
                setItemsPerView(2);
            } else {
                setItemsPerView(1);
            }
        };

        updateItemsPerView();
        window.addEventListener('resize', updateItemsPerView);
        return () => window.removeEventListener('resize', updateItemsPerView);
    }, []);

    useEffect(() => {
        if (isAutoPlaying) {
            const interval = setInterval(() => {
                setCurrentIndex((prevIndex) =>
                    prevIndex + itemsPerView >= testimonials.length ? 0 : prevIndex + 1
                );
            }, 5000);

            return () => clearInterval(interval);
        }
    }, [isAutoPlaying, itemsPerView]);

    const nextSlide = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex + itemsPerView >= testimonials.length ? 0 : prevIndex + 1
        );
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? Math.max(0, testimonials.length - itemsPerView) : prevIndex - 1
        );
    };

    const goToSlide = (index: number) => {
        setCurrentIndex(index);
    };

    const totalSlides = Math.ceil(testimonials.length / itemsPerView);

    return (
        <section className="relative py-24 bg-gradient-to-br from-background via-background to-primary/5 overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <motion.div
                    className="absolute -top-40 -left-40 w-80 h-80 rounded-full bg-primary/10 blur-3xl"
                    animate={{
                        x: [0, 50, 0],
                        y: [0, -30, 0],
                        scale: [1, 1.1, 1],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
                <motion.div
                    className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-accent/10 blur-3xl"
                    animate={{
                        x: [0, -50, 0],
                        y: [0, 30, 0],
                        scale: [1, 1.2, 1],
                    }}
                    transition={{
                        duration: 25,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
            </div>

            <div className="relative container mx-auto px-4">
                <StandardHeader
                    badge={{
                        icon: <MessageCircle className="w-4 h-4" />,
                        text: "Creator Testimonials",
                        variant: "success"
                    }}
                    heading="What Creators Say About VFXB"
                    description="Trusted by millions of content creators worldwide to create stunning visual experiences"
                />

                {/* Social Proof Metrics */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
                >
                    <div className="text-center">
                        <div className="flex items-center justify-center mb-2">
                            <Users className="w-6 h-6 text-primary mr-2" />
                            <span className="text-3xl font-bold text-primary">50M+</span>
                        </div>
                        <p className="text-muted-foreground">Total Followers</p>
                    </div>
                    <div className="text-center">
                        <div className="flex items-center justify-center mb-2">
                            <Play className="w-6 h-6 text-accent mr-2" />
                            <span className="text-3xl font-bold text-accent">500M+</span>
                        </div>
                        <p className="text-muted-foreground">Video Views</p>
                    </div>
                    <div className="text-center">
                        <div className="flex items-center justify-center mb-2">
                            <TrendingUp className="w-6 h-6 text-success mr-2" />
                            <span className="text-3xl font-bold text-success">92%</span>
                        </div>
                        <p className="text-muted-foreground">Avg. Engagement</p>
                    </div>
                </motion.div>

                {/* Testimonials Carousel */}
                <div
                    className="relative"
                    onMouseEnter={() => setIsAutoPlaying(false)}
                    onMouseLeave={() => setIsAutoPlaying(true)}
                >
                    <div className="overflow-hidden">
                        <motion.div
                            className="flex gap-6"
                            animate={{
                                x: `-${currentIndex * (100 / itemsPerView)}%`
                            }}
                            transition={{
                                type: "spring",
                                stiffness: 300,
                                damping: 30
                            }}
                        >
                            {testimonials.map((testimonial, index) => (
                                <motion.div
                                    key={testimonial.id}
                                    className={`flex-shrink-0 ${
                                        itemsPerView === 1 ? 'w-full' :
                                            itemsPerView === 2 ? 'w-1/2' : 'w-1/3'
                                    }`}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: index * 0.1 }}
                                >
                                    <Card className="h-full p-6 bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-300 group">
                                        <div className="flex items-start gap-4 mb-4">
                                            <div className="relative">
                                                <div className="w-16 h-16 rounded-full overflow-hidden ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all duration-300">
                                                    <Image
                                                        src={testimonial.avatar}
                                                        alt={testimonial.name}
                                                        width={64}
                                                        height={64}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full ${platformConfig[testimonial.platform].bgColor} flex items-center justify-center`}>
                                                    {React.createElement(platformConfig[testimonial.platform].icon, {
                                                        className: "w-3 h-3 text-white"
                                                    })}
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
                                                    {testimonial.verified && (
                                                        <CheckCircle className="w-4 h-4 text-primary" />
                                                    )}
                                                </div>
                                                <p className="text-muted-foreground text-sm mb-2">{testimonial.role}</p>
                                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                              {testimonial.followers}
                          </span>
                                                    <span className="flex items-center gap-1">
                            <Play className="w-3 h-3" />
                                                        {testimonial.videoViews}
                          </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center mb-4">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`w-4 h-4 ${
                                                        i < testimonial.rating
                                                            ? 'fill-primary text-primary'
                                                            : 'text-muted-foreground'
                                                    }`}
                                                />
                                            ))}
                                        </div>

                                        <p className="text-muted-foreground leading-relaxed mb-4">
                                            "{testimonial.content}"
                                        </p>

                                        {testimonial.engagement && (
                                            <div className="flex items-center gap-2 text-xs text-success">
                                                <TrendingUp className="w-3 h-3" />
                                                <span>{testimonial.engagement} engagement rate</span>
                                            </div>
                                        )}
                                    </Card>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>

                    {/* Navigation Arrows */}
                    <Button
                        variant="outline"
                        size="icon"
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-card/80 backdrop-blur-sm border-border/50 hover:border-primary/50 hover:bg-primary/10 transition-all duration-300"
                        onClick={prevSlide}
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-card/80 backdrop-blur-sm border-border/50 hover:border-primary/50 hover:bg-primary/10 transition-all duration-300"
                        onClick={nextSlide}
                    >
                        <ChevronRight className="w-4 h-4" />
                    </Button>
                </div>

                {/* Navigation Dots */}
                <div className="flex justify-center mt-8 gap-2">
                    {Array.from({ length: totalSlides }).map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                Math.floor(currentIndex / itemsPerView) === index
                                    ? 'bg-primary scale-125'
                                    : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                            }`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};