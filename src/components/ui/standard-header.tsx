"use client";

import React from 'react';
import { cn } from '@/lib/utils';

interface StandardHeaderProps {
    title?: string;
    subtitle?: string;
    description?: string;
    heading?: string;
    className?: string;
    titleClassName?: string;
    subtitleClassName?: string;
    descriptionClassName?: string;
    maxWidth?: string;
    align?: string;
    badge?: {
        icon?: React.ReactNode;
        text: string;
        variant?: string;
    };
    cta?: {
        text: string;
        icon?: React.ReactNode;
        onClick?: () => void;
    };
}

export const StandardHeader: React.FC<StandardHeaderProps> = ({
    title,
    heading,
    subtitle,
    description,
    className,
    titleClassName,
    subtitleClassName,
    descriptionClassName,
    maxWidth,
    align,
    badge,
    cta
}) => {
    return (
        <div className={cn("text-center space-y-4", className, maxWidth)}>
            {subtitle && (
                <p className={cn(
                    "text-sm font-medium text-primary uppercase tracking-wider",
                    subtitleClassName
                )}>
                    {subtitle}
                </p>
            )}
            {badge && (
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                    {badge.icon}
                    {badge.text}
                </div>
            )}
            <h2 className={cn(
                "text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent",
                titleClassName
            )}>
                {title || heading}
            </h2>
            {description && (
                <p className={cn(
                    "text-lg text-muted-foreground max-w-2xl mx-auto",
                    descriptionClassName
                )}>
                    {description}
                </p>
            )}
            {cta && (
                <button 
                    onClick={cta.onClick}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                    {cta.text}
                    {cta.icon}
                </button>
            )}
        </div>
    );
};

export default StandardHeader;