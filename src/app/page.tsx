"use client"

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Noise from "@/components/Noise";
import BackgroundVideo from "@/components/BackgroundVideo";
import RetroWorkstation from "@/components/RetroWorkstation";
import GlitchText from "@/components/GlitchText";
import Image from "next/image";


export default function Home() {
  const router = useRouter();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const targetZoom = useRef(0);
  const currentZoom = useRef(0);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let animationFrameId: number;
    let isNavigating = false;

    const renderLoop = () => {
      currentZoom.current += (targetZoom.current - currentZoom.current) * 0.08;

      if (containerRef.current) {
        const zoomPhase = Math.pow(currentZoom.current, 1.8);
        const scale = 1 + zoomPhase * 60;
        
        containerRef.current.style.transform = `scale(${scale})`;
        containerRef.current.style.transformOrigin = `83% 62%`; 
      }

      if (currentZoom.current > 0.99 && targetZoom.current === 1 && !isNavigating) {
         isNavigating = true;
         setIsTransitioning(true);
         
         setTimeout(() => {
            router.push('/competitions');
            
            setTimeout(() => {
                setIsTransitioning(false);
                targetZoom.current = 0;
                currentZoom.current = 0;
                if (containerRef.current) containerRef.current.style.transform = `scale(1)`;
                isNavigating = false;
            }, 500);
         }, 300);
      }

      animationFrameId = requestAnimationFrame(renderLoop);
    };

    animationFrameId = requestAnimationFrame(renderLoop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [router]);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      
      const speed = 0.001;
      targetZoom.current = Math.max(0, Math.min(1, targetZoom.current + (e.deltaY * speed)));

      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
      
      scrollTimeout.current = setTimeout(() => {
        if (targetZoom.current > 0.35) {
          targetZoom.current = 1;
        } else {
          targetZoom.current = 0;
        }
      }, 100);
    };

    window.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      window.removeEventListener('wheel', handleWheel);
    };
  }, []);

  return (
    <>
      <div 
        className={`fixed inset-0 z-9999 pointer-events-none transition-opacity duration-75 flex items-center justify-center ${
          isTransitioning ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="absolute inset-0 bg-white opacity-80 mix-blend-difference animate-[flash_0.05s_infinite]"></div>
        <div className="absolute inset-0 bg-cyan-500 opacity-40 mix-blend-color-dodge animate-[vibrate_0.1s_infinite]"></div>
        <div className="absolute inset-0 bg-red-600 opacity-40 mix-blend-color-burn animate-[vibrate_0.15s_infinite_reverse]"></div>
        <div className="absolute inset-0 bg-black opacity-30 select-none">
           <Noise patternAlpha={100} patternRefreshInterval={1} />
        </div>
        <h1 className="relative z-10 font-bold text-transparent text-stroke-2 text-stroke-white uppercase tracking-tighter opacity-70 animate-[vibrate_0.05s_infinite] text-8xl italic mix-blend-difference">SYSTEM_OVERRIDE</h1>
      </div>

      <div 
        ref={containerRef}
        className="fixed inset-0 w-full h-full flex bg-black overflow-hidden selection:bg-cyan-500/30 selection:text-white"
      >
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
        
        <div className="absolute -left-10 md:left-20 -bottom-10 md:bottom-0 w-[110vw] md:w-[20vw] max-w-[1100px] pointer-events-auto z-50">
          <Image 
            width={2000}
            height={2000} 
            src="https://ik.imagekit.io/yatharth/image%20(9).png" 
            alt="Glitchy Horizon - New Gen Fest" 
            priority
            className="w-full h-auto drop-shadow-[0_0_30px_rgba(34,211,238,0.5)] scale-105 md:scale-110 origin-bottom-left"
          />
        </div>



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
        @keyframes flash {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 0; }
        }
        @keyframes vibrate {
          0% { transform: translate(0); }
          25% { transform: translate(4px, -2px) scale(1.02); }
          50% { transform: translate(-4px, 2px) scale(0.98); }
          75% { transform: translate(2px, 4px) scale(1.01); }
          100% { transform: translate(0); }
        }
      `}</style>
      </div>
    </>
  );
}
