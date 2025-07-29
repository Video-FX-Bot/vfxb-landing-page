"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Mail, ArrowRight, CheckCircle, User, Zap, Sparkles, Trophy, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export const EmailSignupWaitlist = () => {
    const [email, setEmail] = useState("");
    const [fullName, setFullName] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [userNumber, setUserNumber] = useState<number | null>(null);
    const [submittedName, setSubmittedName] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !fullName || isSubmitting) return;

        setIsSubmitting(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Generate a random user number between 1000 and 50000
        const randomUserNumber = Math.floor(Math.random() * 49000) + 1000;
        setUserNumber(randomUserNumber);
        setSubmittedName(fullName);
        setIsSuccess(true);
        setIsSubmitting(false);
    };

    const resetForm = () => {
        setEmail("");
        setFullName("");
        setIsSuccess(false);
        setUserNumber(null);
        setSubmittedName("");
    };

    return (
        <section className="relative py-20 overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/5 to-background" />
            <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />

            <div className="relative container mx-auto px-4 max-w-4xl">
                <AnimatePresence mode="wait">
                    {!isSuccess ? (
                        <motion.div
                            key="signup-form"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.6 }}
                            className="text-center"
                        >
                            <div className="flex items-center justify-center gap-2 mb-6">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center">
                                    <Sparkles className="w-4 h-4 text-white animate-pulse" />
                                </div>
                                <span className="text-sm font-medium text-primary uppercase tracking-wider">
                  Join the Revolution
                </span>
                            </div>

                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                                <span className="text-foreground">Get Early Access to </span>
                                <span className="text-transparent bg-gradient-to-r from-primary to-accent bg-clip-text">
                  VFXB
                </span>
                            </h2>

                            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
                                Join thousands of creators who are already signed up for early access.
                                Be the first to transform your content with AI-powered video editing.
                            </p>

                            <Card className="max-w-md mx-auto bg-card/50 backdrop-blur-sm border-border/50">
                                <CardContent className="p-6">
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                            <Input
                                                type="text"
                                                placeholder="Enter your full name"
                                                value={fullName}
                                                onChange={(e) => setFullName(e.target.value)}
                                                className="pl-12 h-12 bg-background/50 border-border/50 focus:border-primary"
                                                required
                                            />
                                        </div>

                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                            <Input
                                                type="email"
                                                placeholder="Enter your email address"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="pl-12 h-12 bg-background/50 border-border/50 focus:border-primary"
                                                required
                                            />
                                        </div>

                                        <Button
                                            type="submit"
                                            disabled={!email || !fullName || isSubmitting}
                                            className="w-full h-12 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-semibold transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                                        >
                                            {isSubmitting ? (
                                                <div className="flex items-center gap-2">
                                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                    <span>Joining Waitlist...</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2">
                                                    <Zap className="w-4 h-4" />
                                                    <span>Join Beta Waitlist</span>
                                                    <ArrowRight className="w-4 h-4" />
                                                </div>
                                            )}
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>

                            <div className="mt-8 flex items-center justify-center gap-6 text-sm text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-primary" />
                                    <span>Free early access</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-primary" />
                                    <span>50% off launch price</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-primary" />
                                    <span>Priority support</span>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="success-message"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6 }}
                            className="text-center"
                        >
                            {/* Celebration Animation */}
                            <div className="relative mb-8">
                                <motion.div
                                    className="w-24 h-24 mx-auto rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center relative overflow-hidden"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 200,
                                        damping: 10,
                                        delay: 0.2
                                    }}
                                >
                                    <CheckCircle className="w-12 h-12 text-white z-10" />

                                    {/* Sparkles around the circle */}
                                    {[...Array(8)].map((_, i) => (
                                        <motion.div
                                            key={i}
                                            className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                                            style={{
                                                left: `${50 + 40 * Math.cos(i * Math.PI / 4)}%`,
                                                top: `${50 + 40 * Math.sin(i * Math.PI / 4)}%`,
                                            }}
                                            initial={{ scale: 0, opacity: 0 }}
                                            animate={{
                                                scale: [0, 1, 0],
                                                opacity: [0, 1, 0],
                                            }}
                                            transition={{
                                                duration: 2,
                                                repeat: Infinity,
                                                delay: i * 0.2,
                                            }}
                                        />
                                    ))}
                                </motion.div>

                                {/* Confetti Effect */}
                                {[...Array(20)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        className="absolute w-3 h-3 rounded-full"
                                        style={{
                                            backgroundColor: i % 4 === 0 ? '#8b5cf6' :
                                                i % 4 === 1 ? '#06b6d4' :
                                                    i % 4 === 2 ? '#10b981' : '#f59e0b',
                                            left: `${50 + (Math.random() - 0.5) * 60}%`,
                                            top: `${50 + (Math.random() - 0.5) * 60}%`,
                                        }}
                                        initial={{ scale: 0, y: 0 }}
                                        animate={{
                                            scale: [0, 1, 0],
                                            y: [0, -100, 100],
                                            x: [(Math.random() - 0.5) * 200],
                                            rotate: [0, 360],
                                        }}
                                        transition={{
                                            duration: 3,
                                            delay: Math.random() * 2,
                                        }}
                                    />
                                ))}
                            </div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                            >
                                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  <span className="text-transparent bg-gradient-to-r from-primary to-accent bg-clip-text">
                    Welcome {submittedName}! 🎉
                  </span>
                                </h2>

                                <div className="max-w-md mx-auto mb-6">
                                    <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
                                        <CardContent className="p-6">
                                            <div className="flex items-center justify-center gap-3 mb-4">
                                                <User className="w-6 h-6 text-primary" />
                                                <span className="text-2xl font-bold text-primary">#{userNumber}</span>
                                                <Trophy className="w-6 h-6 text-accent" />
                                            </div>
                                            <p className="text-foreground font-medium mb-2">
                                                {submittedName}, you are user <span className="text-primary font-bold">#{userNumber}</span> to have signed up for our beta program!
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                You'll be among the first to experience the future of video editing.
                                            </p>
                                        </CardContent>
                                    </Card>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 max-w-2xl mx-auto">
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.6 }}
                                        className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg p-4"
                                    >
                                        <Sparkles className="w-6 h-6 text-primary mx-auto mb-2" />
                                        <h3 className="font-semibold text-sm mb-1">Early Access</h3>
                                        <p className="text-xs text-muted-foreground">Be first to try VFXB beta</p>
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.8 }}
                                        className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg p-4"
                                    >
                                        <Star className="w-6 h-6 text-accent mx-auto mb-2" />
                                        <h3 className="font-semibold text-sm mb-1">50% Discount</h3>
                                        <p className="text-xs text-muted-foreground">Exclusive launch pricing</p>
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 1.0 }}
                                        className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg p-4"
                                    >
                                        <Trophy className="w-6 h-6 text-success mx-auto mb-2" />
                                        <h3 className="font-semibold text-sm mb-1">VIP Support</h3>
                                        <p className="text-xs text-muted-foreground">Priority customer care</p>
                                    </motion.div>
                                </div>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 1.2 }}
                                >
                                    <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                                        Check your email for confirmation and exclusive updates.
                                        We'll notify you immediately when VFXB is ready!
                                    </p>

                                    <Button
                                        onClick={resetForm}
                                        variant="outline"
                                        className="border-primary/20 hover:border-primary/40 hover:bg-primary/10"
                                    >
                                        <Sparkles className="w-4 h-4 mr-2" />
                                        Join Another Email
                                    </Button>
                                </motion.div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
};