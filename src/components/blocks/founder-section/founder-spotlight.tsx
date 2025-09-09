import Image from "next/image";

export default function FounderSpotlight() {
    return (
        <div className="relative z-0 overflow-hidden py-16 lg:py-24">
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
                <div className="absolute inset-0 bg-[radial-gradient(900px_750px_at_15%_40%,rgba(139,92,246,0.25),transparent_60%),radial-gradient(800px_1000px_at_85%_20%,rgba(6,182,212,0.22),transparent_60%)]" />
            </div>
            <div className="container mx-auto px-4">
                <div className="mx-auto max-w-7xl">
                    <div className="grid grid-cols-1 md:grid-cols-[320px_1fr] lg:grid-cols-[420px_1fr] items-center gap-8 lg:gap-12">
                        <div className="flex justify-center md:justify-start">
                            <Image
                                src="/Zubayer.png"
                                alt="Zubayer — Founder & CEO"
                                width={400}
                                height={400}
                                sizes="(min-width: 1024px) 320px, (min-width: 768px) 288px, 192px"
                                className="rounded-full border border-border shadow-lg object-cover w-48 h-48 md:w-72 md:h-72 lg:w-96 lg:h-96"
                                priority
                            />
                        </div>
                        <div className="space-y-4 text-center md:text-left md:pl-6 lg:pl-10 md:max-w-none">
                            <h2 className="header-h2">Zubayer — Founder & CEO</h2>
                            <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}


