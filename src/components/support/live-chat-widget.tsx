"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Send, X, User, Bot, Zap, CreditCard, HelpCircle, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Message {
    id: string;
    text: string;
    isUser: boolean;
    timestamp: Date;
    quickActions?: QuickAction[];
}

interface QuickAction {
    label: string;
    action: () => void;
    icon?: React.ReactNode;
}

export const LiveChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isOnline] = useState(true);
    const [hasWelcomed, setHasWelcomed] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToSection = (sectionId: string) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const quickActions: QuickAction[] = [
        {
            label: 'See Demo',
            action: () => scrollToSection('demo'),
            icon: <Play className="w-4 h-4" />
        },
        {
            label: 'View Pricing',
            action: () => scrollToSection('pricing'),
            icon: <CreditCard className="w-4 h-4" />
        },
        {
            label: 'Get Support',
            action: () => scrollToSection('support'),
            icon: <HelpCircle className="w-4 h-4" />
        },
        {
            label: 'Start Free Trial',
            action: () => scrollToSection('pricing'),
            icon: <Zap className="w-4 h-4" />
        }
    ];

    const getAutomatedResponse = (message: string): { text: string; quickActions?: QuickAction[] } => {
        const lowerMessage = message.toLowerCase();

        if (lowerMessage.includes('demo') || lowerMessage.includes('show') || lowerMessage.includes('see')) {
            return {
                text: "I'd love to show you our demo! Click the button below to see VFXB in action.",
                quickActions: [quickActions[0]]
            };
        }

        if (lowerMessage.includes('price') || lowerMessage.includes('pricing') || lowerMessage.includes('cost') || lowerMessage.includes('plan')) {
            return {
                text: "Our pricing is flexible to meet your needs. Would you like to see our plans?",
                quickActions: [quickActions[1], quickActions[3]]
            };
        }

        if (lowerMessage.includes('support') || lowerMessage.includes('help') || lowerMessage.includes('problem') || lowerMessage.includes('issue')) {
            return {
                text: "I'm here to help! What specific question do you have about VFXB?",
                quickActions: [quickActions[2]]
            };
        }

        if (lowerMessage.includes('trial') || lowerMessage.includes('free') || lowerMessage.includes('try')) {
            return {
                text: "Great! You can start your free trial right away. No credit card required!",
                quickActions: [quickActions[3]]
            };
        }

        return {
            text: "Thanks for your message! A team member will respond shortly. In the meantime, here are some quick actions:",
            quickActions: quickActions.slice(0, 3)
        };
    };

    const addMessage = (text: string, isUser: boolean, quickActions?: QuickAction[]) => {
        const newMessage: Message = {
            id: Date.now().toString(),
            text,
            isUser,
            timestamp: new Date(),
            quickActions
        };
        setMessages(prev => [...prev, newMessage]);
    };

    const sendTypingIndicator = () => {
        setIsTyping(true);
        setTimeout(() => {
            setIsTyping(false);
        }, 1500);
    };

    const handleSendMessage = () => {
        if (!inputValue.trim()) return;

        const userMessage = inputValue.trim();
        addMessage(userMessage, true);
        setInputValue('');

        sendTypingIndicator();

        setTimeout(() => {
            const response = getAutomatedResponse(userMessage);
            addMessage(response.text, false, response.quickActions);
        }, 1800);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    };

    const handleOpen = () => {
        setIsOpen(true);
        if (!hasWelcomed) {
            setTimeout(() => {
                addMessage(
                    "Hi! I'm here to help you with VFXB. How can I assist you today?",
                    false,
                    quickActions
                );
                setHasWelcomed(true);
            }, 500);
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <>
            {/* Chat Button */}
            <motion.div
                className="fixed bottom-6 right-6 z-50"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 1, duration: 0.5, type: 'spring' }}
            >
                <Button
                    onClick={handleOpen}
                    className="w-14 h-14 rounded-full bg-gradient-to-r from-primary to-accent hover:from-primary/80 hover:to-accent/80 shadow-lg hover:shadow-xl transition-all duration-300 border-0 group overflow-hidden"
                    size="icon"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-20 blur-xl group-hover:opacity-30 transition-opacity" />
                    <MessageCircle className="w-6 h-6 text-white relative z-10" />
                    {isOnline && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-success rounded-full border-2 border-background animate-pulse" />
                    )}
                </Button>
            </motion.div>

            {/* Chat Interface */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        transition={{ duration: 0.3, type: 'spring' }}
                        className="fixed bottom-24 right-6 z-50 w-96 h-[500px] max-w-[calc(100vw-3rem)] max-h-[calc(100vh-8rem)] md:max-w-96 md:max-h-[500px]"
                    >
                        <Card className="h-full backdrop-blur-xl bg-card/90 border-border/50 shadow-2xl">
                            <CardHeader className="pb-3 border-b border-border/50">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center">
                                            <Bot className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-lg">VFXB Support</CardTitle>
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-success' : 'bg-muted'}`} />
                                                {isOnline ? 'Online' : 'Offline'}
                                            </div>
                                        </div>
                                    </div>
                                    <Button
                                        onClick={() => setIsOpen(false)}
                                        variant="ghost"
                                        size="icon"
                                        className="w-8 h-8 text-muted-foreground hover:text-foreground"
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>
                                </div>
                            </CardHeader>

                            <CardContent className="flex flex-col h-full p-0">
                                {/* Messages Container */}
                                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                    {messages.map((message) => (
                                        <motion.div
                                            key={message.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div className={`max-w-[80%] ${message.isUser ? 'order-2' : 'order-1'}`}>
                                                <div
                                                    className={`p-3 rounded-2xl ${
                                                        message.isUser
                                                            ? 'bg-gradient-to-r from-primary to-accent text-white'
                                                            : 'bg-muted text-foreground'
                                                    }`}
                                                >
                                                    <p className="text-sm">{message.text}</p>
                                                </div>

                                                {message.quickActions && (
                                                    <div className="mt-2 flex flex-wrap gap-2">
                                                        {message.quickActions.map((action, index) => (
                                                            <Button
                                                                key={index}
                                                                onClick={action.action}
                                                                variant="outline"
                                                                size="sm"
                                                                className="text-xs border-border/50 hover:border-primary/50 hover:bg-primary/10"
                                                            >
                                                                {action.icon}
                                                                {action.label}
                                                            </Button>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                                message.isUser ? 'order-1 ml-3 bg-accent' : 'order-2 mr-3 bg-primary'
                                            }`}>
                                                {message.isUser ? (
                                                    <User className="w-4 h-4 text-white" />
                                                ) : (
                                                    <Bot className="w-4 h-4 text-white" />
                                                )}
                                            </div>
                                        </motion.div>
                                    ))}

                                    {/* Typing Indicator */}
                                    {isTyping && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="flex justify-start"
                                        >
                                            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center mr-3">
                                                <Bot className="w-4 h-4 text-white" />
                                            </div>
                                            <div className="bg-muted p-3 rounded-2xl">
                                                <div className="flex space-x-1">
                                                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                                                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                                                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}

                                    <div ref={messagesEndRef} />
                                </div>

                                {/* Input Area */}
                                <div className="p-4 border-t border-border/50">
                                    <div className="flex gap-2">
                                        <Input
                                            value={inputValue}
                                            onChange={(e) => setInputValue(e.target.value)}
                                            onKeyPress={handleKeyPress}
                                            placeholder="Type your message..."
                                            className="flex-1 bg-background/50 border-border/50 focus:border-primary/50"
                                        />
                                        <Button
                                            onClick={handleSendMessage}
                                            disabled={!inputValue.trim()}
                                            className="bg-gradient-to-r from-primary to-accent hover:from-primary/80 hover:to-accent/80 disabled:opacity-50"
                                            size="icon"
                                        >
                                            <Send className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};