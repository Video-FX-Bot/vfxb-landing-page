import type { Metadata } from "next";
import "./globals.css";
import ErrorReporter from "@/components/ErrorReporter";

export const metadata: Metadata = {
    title: "VFXB - AI-Powered Video Creation Platform",
    description: "Transform your ideas into stunning videos with AI-powered editing tools and professional VFX effects.",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body className="antialiased">
        <ErrorReporter />{children}</body>
        </html>
    );
}