import React from 'react';
import { Check, X, Wand2, MonitorPlay, Mic2, Sparkles, ScanLine, Play } from 'lucide-react';
import { motion } from 'framer-motion';

export const Features: React.FC = () => {
  return (
    <section id="features" className="py-24 relative z-10 bg-[#0B0B15]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-24 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-brand-primary/20 blur-[100px] rounded-full pointer-events-none" />
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white relative z-10">
            Why Top Creators <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-brand-accent">Switch to VFXB</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto relative z-10">
            The only tool that replaces your editor, analyst, and strategist with one click.
          </p>
        </div>

        {/* NEW: Enhanced Visual Feature Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-32">
          <VisualFeatureCard 
            title="AI Magic Eraser"
            description="Select and erase unwanted elements instantly to reclaim your footage."
            visualSrc="https://remaker.ai/userspace/saasbox/image/magic-eraser/magic-eraser.gif"
            badge="Clean Pro Look"
            delay={0}
            color="group-hover:shadow-[0_0_30px_-5px_rgba(50,184,198,0.3)]"
            borderColor="group-hover:border-brand-accent/50"
          />
          <VisualFeatureCard 
            title="AI 4K Detailer"
            description="Turn low-res 1080p footage into crisp 4K with generative detail fill."
            visualSrc="https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExZzdoOWh2ankyeXh0emN4dXFtcjhqN3pzOGpyOGFmbmFxYTlyMHQzYyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/SfgpPxlMI1MddDCBf5/giphy.gif"
            badge="1080p → 4K Upscale"
            delay={0.2}
            color="group-hover:shadow-[0_0_30px_-5px_rgba(192,132,252,0.3)]"
            borderColor="group-hover:border-purple-500/50"
            isScanning={true}
          />
          <VisualFeatureCard 
            title="Studio Audio Master"
            description="Isolate vocals and remove wind or static noise for podcast-ready audio."
            visualSrc="https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExOXZraDBjcGF6MmgwbGtyamtpeHh5M3M4c21hZzR1dG14MWVsZ2huZyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/BkUVA3aGN7bvtrZ1oo/giphy.gif"
            badge="Crystal Clear Voice"
            delay={0.4}
            color="group-hover:shadow-[0_0_30px_-5px_rgba(96,165,250,0.3)]"
            borderColor="group-hover:border-blue-500/50"
          />
        </div>


        {/* Feature Comparison Table */}
        <div className="glass-card rounded-2xl overflow-hidden p-8 overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-4 px-4 text-gray-400 font-medium">Feature</th>
                <th className="text-center py-4 px-4 text-gray-500 font-medium">CapCut</th>
                <th className="text-center py-4 px-4 text-gray-500 font-medium">TikAlyzer</th>
                <th className="text-center py-4 px-4 font-bold text-brand-primary bg-white/5 rounded-t-lg border-t border-x border-white/10 relative">
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-accent text-[10px] font-bold px-2 py-0.5 rounded text-black uppercase shadow-[0_0_10px_#32B8C6]">Winner</span>
                  VFXB
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {[
                { name: 'AI Watermark Removal', capcut: false, tikalyzer: false, vfxb: true },
                { name: 'AI Video Upscaling (4K)', capcut: false, tikalyzer: false, vfxb: true },
                { name: 'Studio Audio Mastering', capcut: true, tikalyzer: false, vfxb: true },
                { name: 'Viral Prediction Score', capcut: false, tikalyzer: true, vfxb: true },
                { name: 'Competitor Spy', capcut: false, tikalyzer: false, vfxb: true },
              ].map((row, idx) => (
                <tr key={idx} className="hover:bg-white/5 transition-colors">
                  <td className="py-4 px-4 font-medium text-gray-200">{row.name}</td>
                  <td className="py-4 px-4 text-center"><StatusIcon status={row.capcut} /></td>
                  <td className="py-4 px-4 text-center"><StatusIcon status={row.tikalyzer} /></td>
                  <td className="py-4 px-4 text-center bg-white/5 border-x border-white/10"><StatusIcon status={row.vfxb} isMain /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </section>
  );
};
// --- UPDATED COMPONENT: VisualFeatureCard ---
const VisualFeatureCard = ({ 
    title, description, visualSrc, badge, delay, color, borderColor, isScanning 
}: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.6, ease: "easeOut" }}
    viewport={{ once: true }}
    className={`relative rounded-3xl overflow-hidden group border border-white/5 bg-[#16162A] ${color} transition-all duration-500 hover:-translate-y-2`}
  >
    {/* Hover Border Gradient Effect */}
    <div className={`absolute inset-0 border-2 border-transparent ${borderColor} rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-20`} />

    {/* Top Section: Content */}
    <div className="p-8 pb-4 relative z-10">
      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-400 transition-all">
          {title}
      </h3>
      <p className="text-gray-400 text-sm leading-relaxed mb-6 h-10">
        {description}
      </p>

      {/* Feature Badge */}
      <div className="inline-flex items-center gap-2 mb-6">
        <Sparkles size={14} className="text-brand-accent" />
        <span className="text-xs font-bold text-white tracking-wide">{badge}</span>
      </div>
    </div>

    {/* Bottom Section: The "Software" Window */}
    <div className="relative w-full h-48 px-6 pb-6">
        <div className="w-full h-full relative rounded-t-xl overflow-hidden border-t border-x border-white/10 bg-black shadow-2xl group-hover:shadow-[0_0_20px_rgba(0,0,0,0.5)] transition-shadow">
            
            {/* REMOVED: No more Fake Mac Window Controls (Dots) */}

            {/* Scanning Animation */}
            {isScanning && (
                <div className="absolute top-0 bottom-0 w-[2px] bg-white/50 shadow-[0_0_10px_white] z-20 animate-scan pointer-events-none opacity-0 group-hover:opacity-100 h-full" style={{ animationDuration: '2s', animationIterationCount: 'infinite' }} />
            )}

            {/* Play Button Overlay */}
            <div className="absolute inset-0 flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20">
                    <Play size={16} className="text-white fill-white ml-0.5" />
                </div>
            </div>

            {/* The Image/GIF */}
            <img 
                src={visualSrc} 
                alt={title}
                className="w-full h-full object-cover opacity-100 brightness-110 group-hover:scale-105 transition-transform duration-700"
            />
            
        </div>
    </div>
  </motion.div>
);

const StatusIcon = ({ status, isMain }: { status: boolean, isMain?: boolean }) => {
  if (status) return (
    <div className="flex justify-center">
        <div className={`rounded-full flex items-center justify-center ${isMain ? 'bg-green-500/20 w-8 h-8' : 'w-6 h-6'}`}>
            {/* FIXED: Changed from text-gray-600 to text-white so it's bright and visible */}
            <Check className={`${isMain ? 'text-green-400 w-5 h-5' : 'text-white w-4 h-4'}`} />
        </div>
    </div>
  );
  
  // FIXED: Changed from text-gray-800 to text-gray-500 so the 'X' is visible but faint
  return (
    <div className="h-8 flex items-center justify-center">
        <X className="text-gray-500 w-4 h-4" />
    </div>
  );
};