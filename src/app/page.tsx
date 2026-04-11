"use client"

import React from 'react';
import Noise from "@/components/Noise";
import BackgroundVideo from "@/components/BackgroundVideo";
import RetroWorkstation from "@/components/RetroWorkstation";
import GlitchText from "@/components/GlitchText";

export default function Home() {
  return (
    <div className="relative min-h-screen w-full flex bg-[#0a0a0a] overflow-hidden selection:bg-cyan-500/30 selection:text-white">
      <BackgroundVideo 
        src="https://rishihoodmarketingimg.s3.ap-south-1.amazonaws.com/Neutron+ORG/Neutron.mp4" 
      />
      <div className="absolute inset-0 z-5 smoky-atmosphere"></div>
      <div className="absolute inset-0 z-6 volumetric-haze"></div>

      <div className="absolute inset-0 z-100 pointer-events-none">
        <Noise 
          patternAlpha={15} 
          patternRefreshInterval={1} 
          patternSize={1000}
        />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-size-[100%_4px,3px_100%] pointer-events-none opacity-30"></div>
      </div>

      <main className="relative z-10 w-full min-h-screen pointer-events-none">
        <div className="absolute bottom-0 right-0 w-full max-w-[1000px] pointer-events-auto">
           <RetroWorkstation />
        </div>
      </main>

      <div className="absolute top-12 left-12 flex flex-col gap-3 pointer-events-none z-10 opacity-30">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_8px_#22d3ee]"></div>
          <div className="text-[10px] font-mono text-white/50 tracking-[0.2em] uppercase">SYSTEM_PHOTON // CORE</div>
        </div>
        <div className="text-[9px] text-white/30 tracking-widest font-mono uppercase italic">OS_v1.0.44.b - STATUS: OPTIMAL</div>
      </div>

      <div className="absolute top-12 right-12 text-[10px] font-mono text-white/10 tracking-widest pointer-events-none uppercase">
        [ SECTOR_7G : DATA_STABLE ]
      </div>

      <style jsx global>{`
        @keyframes pointing-hand {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(12px); }
        }
      `}</style>
    </div>
  );
}
