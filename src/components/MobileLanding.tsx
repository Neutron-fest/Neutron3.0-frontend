"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion";
import Noise from "./Noise";
import Grainient from "./Grainient";
import FeaturedCompetitions from "./FeaturedCompetitions";
import FeaturedEvents from "./FeaturedEvents";
import { ChevronDown } from "lucide-react";
import AboutFooter from "./AboutFooter";

interface MobileLandingProps {
  onMenuToggle: () => void;
  isMenuOpen: boolean;
}

export default function MobileLanding({ onMenuToggle, isMenuOpen }: MobileLandingProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroSectionRef = useRef<HTMLDivElement>(null);
  const [showScrollHint, setShowScrollHint] = useState(true);
  
  const { scrollYProgress: heroScrollProgress } = useScroll({
    target: heroSectionRef,
    offset: ["start start", "end end"]
  });

  const smoothProgress = useSpring(heroScrollProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50 && showScrollHint) {
        setShowScrollHint(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [showScrollHint]);

  const heroScale = useTransform(smoothProgress, [0, 0.8], [1, 1.15]);
  const heroRadius = useTransform(smoothProgress, [0, 0.7], ["80px", "0px"]);
  const heroWidth = useTransform(smoothProgress, [0, 0.7], ["94%", "100%"]);
  const heroHeight = useTransform(smoothProgress, [0, 0.8], ["84vh", "100vh"]);
  const heroY = useTransform(smoothProgress, [0, 0.8], ["-40px", "0px"]);

  const firstTextOpacity = useTransform(smoothProgress, [0, 0.3], [1, 0]);
  const firstTextY = useTransform(smoothProgress, [0, 0.3], [0, -40]);
  
  const secondTextOpacity = useTransform(smoothProgress, [0.5, 0.85], [0, 1]);
  const secondTextY = useTransform(smoothProgress, [0.5, 0.85], [40, 0]);

  return (
    <div ref={containerRef} className="relative w-full bg-[#0d0a08] flex flex-col">
      <Noise patternAlpha={10} className="fixed inset-0 opacity-40 z-0 pointer-events-none" />

      <header className="fixed top-0 left-0 w-full z-100 flex items-center justify-between px-6 pt-6 pb-4 bg-linear-to-b from-black/50 to-transparent pointer-events-none">
        <a href="/" className="transition-transform hover:scale-110 active:scale-95 pointer-events-auto">
          <Image 
            src="https://ik.imagekit.io/yatharth/neutron_clean.png" 
            alt="Neutron Logo" 
            width={100} 
            height={100} 
            className="drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] brightness-125"
          />
        </a>

        <button 
          onClick={onMenuToggle}
          className="flex flex-col gap-1.5 p-2 focus:outline-none group relative z-100 pointer-events-auto"
          aria-label="Toggle Menu"
        >
          <motion.span 
            animate={isMenuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
            className="w-10 h-[2px] bg-white rounded-full transition-colors"
          />
          <motion.span 
            animate={isMenuOpen ? { opacity: 0 } : { opacity: 1 }}
            className="w-10 h-[2px] bg-white rounded-full transition-colors"
          />
           <motion.span 
            animate={isMenuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
            className="w-10 h-[2px] bg-white rounded-full transition-colors"
          />
        </button>
      </header>

      <div ref={heroSectionRef} className="relative h-[250vh] w-full">
        <div className="sticky top-0 h-dvh w-full flex items-center justify-center overflow-hidden z-10">
          <motion.div 
            style={{ 
              width: heroWidth, 
              height: heroHeight, 
              borderRadius: heroRadius,
              y: heroY
            }}
            className="relative overflow-hidden shadow-[0_20px_100px_rgba(0,0,0,0.9)] border-x border-b border-white/10"
          >
            <motion.div style={{ scale: heroScale }} className="relative w-full h-full">
              <Image
                src="https://ik.imagekit.io/YatharthKhandelwal/Phone.png"
                alt="Neutron Hero"
                fill
                className="object-cover"
                priority
              />
            </motion.div>
            
            <div className="absolute inset-0 bg-linear-to-t from-[#0d0a08] via-[#0d0a08]/20 to-transparent opacity-90 z-10" />
            
            <motion.div 
              style={{ opacity: firstTextOpacity, y: firstTextY }}
              className="absolute bottom-6 left-0 w-full px-8 pb-8 pointer-events-none z-30"
            >
              <h1 
                className="text-[3.2rem] font-bold leading-[0.85] tracking-tighter mb-6 text-white drop-shadow-[0_5px_15px_rgba(0,0,0,0.5)]"
                style={{ fontFamily: "var(--font-sora)" }}
              >
                Break Limits.<br />
                <span className="text-[#ffb84d]">Build Galaxies.</span>
              </h1>

              <div className="h-px w-12 bg-orange-500/50 mb-4" />

              <p 
                className="text-[1.1rem] text-white/80 font-normal tracking-wide max-w-[85%] leading-relaxed"
                style={{ fontFamily: "var(--font-sora)" }}
              >
                Neutron 3.0 is a launchpad for the next generation of space-age innovators.
              </p>
            </motion.div>

            <motion.div 
              style={{ opacity: secondTextOpacity, y: secondTextY }}
              className="absolute bottom-1/4 left-0 w-full px-8 pb-4 pointer-events-none z-30"
            >
              <span className="text-[10px] font-mono uppercase tracking-[0.6em] text-orange-400/80 mb-4 block">
                Initiated // Sequence: 03
              </span>
              
              <h2 
                className="text-[3.2rem] font-bold leading-[0.85] tracking-tighter mb-6 text-white"
                style={{ fontFamily: "var(--font-sora)" }}
              >
                Explore the<br />Unknown.
              </h2>

              <p 
                className="text-[1.1rem] text-white/70 font-normal tracking-wide max-w-[90%] leading-relaxed"
                style={{ fontFamily: "var(--font-sora)" }}
              >
                Join us in redefining the boundaries of technology and creativity.
              </p>
            </motion.div>
            
            <AnimatePresence>
              {showScrollHint && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute bottom-10 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-2"
                >
                   <span className="text-[9px] font-mono uppercase tracking-[0.4em] text-white/40">Scroll to Orbit</span>
                   <motion.div 
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                   >
                    <ChevronDown size={14} className="text-orange-500/60" />
                   </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
      
      <div className="relative z-10 bg-[#0d0a08]">
        <FeaturedCompetitions />
        <div className="h-12" />
        <FeaturedEvents />
        <div className="h-24" />
        <AboutFooter />
      </div>

      <div className="fixed inset-0 z-0 pointer-events-none opacity-10">
         <Grainient
            color1="#3e2723"
            color2="#5d4037"
            color3="#0d0a08"
            timeSpeed={0.3}
            colorBalance={-0.3}
            warpStrength={0.4}
            zoom={1.2}
            className="w-full h-full"
          />
      </div>
    </div>
  );
}
