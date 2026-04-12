"use client";

import React from "react";
import { CurvedGallery } from "../../components/competitions/curved-gallery";
import { ChevronLeft, Monitor, Zap, Phone } from "lucide-react";
import Link from "next/link";
import GlitchText from "../../components/GlitchText";

export default function CompetitionsPage() {
  return (
    <main className="relative w-full h-screen bg-[#030303] overflow-hidden text-white selection:bg-cyan-500/30">
      
      <div className="absolute inset-0 z-0 bg-black overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-50 scale-105" 
          style={{ backgroundImage: "url('https://ik.imagekit.io/yatharth/BG-LESS.png')" }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_0%,rgba(0,0,0,0.8)_100%)]" />
        <div className="absolute inset-0 opacity-[0.05] bg-[url('https://res.cloudinary.com/dyd911kmh/image/upload/v1640050115/glitch_u4q1zq.gif')] pointer-events-none mix-blend-screen" />
      </div>


      <div className="relative z-10 w-full h-full">
        <CurvedGallery />
      </div>

      <footer className="absolute bottom-6 left-1/2 -translate-x-1/2 z-110 pointer-events-none w-full px-12 flex justify-between items-center opacity-30">
          <div className="flex flex-col gap-1">
              <div className="flex gap-0.5">
                  {Array.from({ length: 20 }).map((_, i) => (
                      <div key={i} className="w-1.5 h-1 bg-white/40" />
                  ))}
              </div>
              <span className="text-[7px] font-mono uppercase tracking-[0.5em]">Sequence Auth: 0x992B</span>
          </div>
          
          <span className="text-[8px] font-mono uppercase tracking-[1em] translate-x-[0.5em]">Photon // Network</span>

          <div className="flex items-center gap-4">
              <span className="text-[7px] font-mono uppercase tracking-[0.3em]">Sector 04 // 2026</span>
              <div className="w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
          </div>
      </footer>

      <div className="absolute inset-0 z-200 pointer-events-none border-[3vw] border-black rounded-[6vw] shadow-[inset_0_0_150px_rgba(0,0,0,1)]" />
      
      <div className="absolute inset-0 z-201 pointer-events-none rounded-[6vw] bg-[radial-gradient(ellipse_at_center,transparent_50%,rgba(0,0,5,0.6)_100%)]" />

      <div className="absolute inset-0 z-202 pointer-events-none opacity-30 mix-blend-overlay bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.5)_50%)] bg-size-[100%_4px]" />
      
      <div className="absolute inset-0 z-203 pointer-events-none rounded-[6vw] bg-[radial-gradient(120%_120%_at_50%_0%,rgba(255,255,255,0.06)_0%,transparent_40%)] mix-blend-screen" />

      <div className="absolute inset-0 z-204 pointer-events-none bg-[#4f67ff] opacity-[0.03] mix-blend-color-dodge rounded-[6vw]" />
      
      <div className="absolute inset-0 z-205 pointer-events-none opacity-[0.12] contrast-200 brightness-110 mix-blend-screen rounded-[6vw] overflow-hidden">
          <div className="w-full h-full bg-[url('https://res.cloudinary.com/dyd911kmh/image/upload/v1640050115/glitch_u4q1zq.gif')] bg-repeat bg-position-[center_top]" />
      </div>
    </main>
  );
}
