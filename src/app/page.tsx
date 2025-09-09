import { ModernHeroWithGradients } from "@/components/blocks/heros/modern-hero-with-gradients";
import { FeaturesLayout } from "@/components/blocks/feature-sections/balanced-features-layout";
import SimpleCenteredWithGradient from "@/components/blocks/ctas/simple-centered-with-gradient";
import { SimpleFooterWithFourGrids } from "@/components/blocks/footers/simple-footer-with-four-grids";
import { StickyNavigation } from "@/components/navigation/sticky-navbar";
import { LiveChatWidget } from "@/components/support/live-chat-widget";
import { ScrollProgressIndicator } from "@/components/ui/scroll-progress-indicator";
import { SectionTransition } from "@/components/ui/section-transition";
import { SectionNavigation } from "@/components/ui/section-navigation";

// Dynamic imports for performance optimization
import { lazy, Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import FounderSpotlight from "@/components/blocks/founder-section/founder-spotlight";

// Lazy load components that are not immediately visible
const InteractiveDemoVideo = lazy(() => import("@/components/blocks/demo-section/interactive-demo-video"));
const KeyUseCases = lazy(() => import("@/components/blocks/use-cases/key-use-cases").then(m => ({ default: m.KeyUseCases })));
const TestimonialsSection = lazy(() => import("@/components/blocks/testimonials/modern-testimonials-redesign").then(m => ({ default: m.TestimonialsSection })));
const EmailSignupWaitlist = lazy(() => import("@/components/blocks/coming-soon/email-signup-waitlist").then(m => ({ default: m.EmailSignupWaitlist })));
const OurTeam = lazy(() => import("@/components/blocks/coming-soon/our-team").then(m => ({ default: m.OurTeam })));

// Loading component for lazy-loaded sections
const SectionSkeleton = () => (
    <div className="py-20 lg:py-32">
        <div className="container mx-auto px-4">
            <Skeleton className="h-8 w-64 mx-auto mb-4" />
            <Skeleton className="h-4 w-96 mx-auto mb-8" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                    <Skeleton key={i} className="h-64 w-full" />
                ))}
            </div>
        </div>
    </div>
);

export default function Home() {
    return (
        <main className="min-h-screen bg-background">
            {/* Fixed Elements - No lazy loading needed */}
            <ScrollProgressIndicator />
            <SectionNavigation />
            <StickyNavigation />

            {/* Above-fold content - Critical for LCP */}
            <section id="hero" className="relative">
                <ModernHeroWithGradients />
                <SectionTransition />
            </section>

            

            {/* Features Section - Important for user engagement */}
            <section id="features" className="relative">
                <FeaturesLayout />
                <SectionTransition />
            </section>

            {/* Below-fold content - Can be lazy loaded */}
            <section id="demo" className="relative">
                <Suspense fallback={<SectionSkeleton />}>
                    <InteractiveDemoVideo />
                </Suspense>
                <SectionTransition />
            </section>

            <section id="use-cases" className="relative">
                <Suspense fallback={<SectionSkeleton />}>
                    <KeyUseCases />
                </Suspense>
                <SectionTransition />
            </section>

            <section id="testimonials" className="relative">
                <Suspense fallback={<SectionSkeleton />}>
                    <TestimonialsSection />
                </Suspense>
                <SectionTransition />
            </section>

            {/* Founder & CEO spotlight */}
            <section id="founder" className="relative bg-radial-support">
                <FounderSpotlight />
                <SectionTransition />
            </section>

            <section id="team" className="relative">
                <Suspense fallback={<SectionSkeleton />}>
                    <OurTeam />-
                </Suspense>
                <SectionTransition />
            </section>

            <section id="quick-signup" className="relative py-20">
                <div className="container mx-auto px-4">
                    <Suspense fallback={<SectionSkeleton />}>
                        <EmailSignupWaitlist />
                    </Suspense>
                </div>
                <SectionTransition />
            </section>

            {/* Critical conversion elements - Keep synchronous */}
            <section id="cta" className="relative">
                <SimpleCenteredWithGradient />
                <SectionTransition />
            </section>

            <section id="contact" className="relative">
                <SimpleFooterWithFourGrids />
            </section>

            {/* Interactive components - Keep for UX */}
            <LiveChatWidget />
        </main>
    );
}