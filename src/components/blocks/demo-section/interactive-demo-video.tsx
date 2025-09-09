"use client"

import { StandardHeader } from '@/components/ui/standard-header'

export default function InteractiveDemoVideo() {
    return (
        <div className="relative py-4">
            <div className="container mx-auto px-4">
                <StandardHeader
                    badge={{ icon: null, text: "Interactive Demo", variant: "primary" }}
                    heading="See VFXB in Action"
                    description="Experience the power of professional visual effects editing with our interactive demo. Watch how VFXB transforms ordinary footage into cinematic masterpieces."
                />

                <div className="max-w-6xl mx-auto pt-3">
                    <video
                        className="w-full rounded-2xl"
                        controls
                        preload="metadata"
                        src="/videos/VFXB_Demo_video.mp4"
                    />
                </div>
            </div>
        </div>
    )
}