"use client"

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Noise from "@/components/Noise";
import HeroScene from "@/components/HeroScene";

export default function Home() {
  const router = useRouter();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const targetZoom = useRef(0);
  const currentZoom = useRef(0);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let animationFrameId: number;
    let isNavigating = false;
    
    router.prefetch('/competitions');

    const renderLoop = () => {
      currentZoom.current += (targetZoom.current - currentZoom.current) * 0.15; 
      const z = currentZoom.current;

      if (containerRef.current) {
        const zoomPhase = Math.pow(z, 2.2);
        const scale = 1 + zoomPhase * 100; // Deep dive into the photon
        
        containerRef.current.style.transform = `scale(${scale})`;
        
        const g = Math.max(0, (z - 0.25) / 0.75); 
        containerRef.current.style.setProperty('--g-intense', g.toFixed(3));
      }

      if (z > 0.88 && !isNavigating) {
        isNavigating = true;
        setIsTransitioning(true);
        router.push('/competitions');
        
        setTimeout(() => {
          setIsTransitioning(false);
          if (containerRef.current) {
            containerRef.current.style.transform = 'scale(1)';
            containerRef.current.style.setProperty('--g-intense', '0');
          }
          currentZoom.current = 0;
          targetZoom.current = 0;
          isNavigating = false;
        }, 1500);
      }

      animationFrameId = requestAnimationFrame(renderLoop);
    };

    animationFrameId = requestAnimationFrame(renderLoop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [router]);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      
      const baseSpeed = Math.min(0.015, Math.abs(e.deltaY) * 0.00025);
      const direction = Math.sign(e.deltaY);
      
      targetZoom.current = Math.max(0, Math.min(1, targetZoom.current + direction * baseSpeed * 10));

      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
      scrollTimeout.current = setTimeout(() => {
        if (targetZoom.current > 0.15) {
          targetZoom.current = 1;
        } else {
          targetZoom.current = 0;
        }
      }, 100);
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, []);

  return (
    <>
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: 9999,
          "--g-v": "var(--g-intense, 0)"
        } as React.CSSProperties}
      >
        <div
          className="absolute inset-0"
          style={{
            background: 'rgba(255,0,68,0.1)',
            mixBlendMode: 'screen',
            transform: `translateX(calc(var(--g-v) * 18px))`,
            opacity: `calc(var(--g-v) * 0.8)`,
          } as React.CSSProperties}
        />

        <div
          className="absolute inset-0"
          style={{
            background: 'rgba(0,255,255,0.1)',
            mixBlendMode: 'screen',
            transform: `translateX(calc(var(--g-v) * -18px))`,
            opacity: `calc(var(--g-v) * 0.8)`,
          } as React.CSSProperties}
        />

        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(rgba(18,16,16,0) 50%, rgba(0,0,0,0.25) 50%)',
            backgroundSize: '100% 4px',
            opacity: `var(--g-v)`,
            animation: 'hero-scanline-flicker 0.08s steps(1) infinite',
          } as React.CSSProperties}
        />

        <div
          className="absolute"
          style={{
            left: 0, right: 0,
            height: `calc(6px + var(--g-v) * 20px)`,
            top: `45%`,
            background: 'rgba(255,255,255,0.06)',
            transform: `scaleX(calc(1 + var(--g-v) * 0.4)) translateX(calc(var(--g-v) * -12px))`,
            mixBlendMode: 'color-dodge',
            animation: 'hero-glitch-bar 0.12s steps(1) infinite',
            opacity: `var(--g-v)`,
          } as React.CSSProperties}
        />

        <div
          className="absolute inset-0"
          style={{
            background: `white`,
            opacity: `calc((var(--g-v) - 0.72) * 4)`,
            mixBlendMode: 'overlay',
          } as React.CSSProperties}
        />

        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ 
            animation: 'hero-error-vibrate 0.06s steps(1) infinite',
            opacity: `calc((var(--g-v) - 0.55) * 3)`
          } as React.CSSProperties}
        >
          <span
            style={{
              fontFamily: 'var(--font-space-mono), monospace',
              fontSize: '0.75rem',
              letterSpacing: '0.4em',
              color: `white`,
              textShadow: '3px 0 #ff0055, -3px 0 #00ffff',
              textTransform: 'uppercase',
            }}
          >
            QUANTUM_BREACH :: ENTERING_CORE
          </span>
        </div>

        <div className="absolute inset-0" style={{ opacity: `calc(var(--g-v) * 0.75)` } as React.CSSProperties}>
          <Noise patternAlpha={50} patternRefreshInterval={1} />
        </div>
      </div>

      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: 10000,
          opacity: isTransitioning ? 1 : 0,
          transition: 'opacity 0.08s',
        }}
      >
        <div className="absolute inset-0 bg-white opacity-70 mix-blend-difference" style={{ animation: 'flash 0.05s infinite' }} />
        <div className="absolute inset-0 bg-cyan-500 opacity-30 mix-blend-color-dodge" style={{ animation: 'vibrate 0.1s infinite' }} />
        <div className="absolute inset-0 bg-red-600 opacity-30 mix-blend-color-burn" style={{ animation: 'vibrate 0.15s infinite reverse' }} />
        <Noise patternAlpha={100} patternRefreshInterval={1} />
      </div>

      <div
        ref={containerRef}
        className="fixed inset-0 w-full h-full bg-black overflow-hidden"
        style={{ willChange: 'transform' }}
      >
        <HeroScene />

        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 100 }}>
          <Noise patternAlpha={12} patternRefreshInterval={2} patternSize={1000} />
          <div
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              background: 'linear-gradient(rgba(18,16,16,0) 50%, rgba(0,0,0,0.08) 50%), linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))',
              backgroundSize: '100% 4px, 3px 100%',
            }}
          />
        </div>

        <div className="absolute top-12 left-12 flex flex-col gap-2 pointer-events-none z-10 opacity-25">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_8px_#22d3ee]" />
            <div className="text-[9px] font-mono text-white/50 tracking-[0.2em] uppercase">SYSTEM_PHOTON // CORE</div>
          </div>
          <div className="text-[8px] text-white/30 tracking-widest font-mono uppercase italic">OS_v2.1.0 · STATUS: QUANTUM_ACTIVE</div>
        </div>

        <div className="absolute top-12 right-12 text-[9px] font-mono text-white/10 tracking-widest pointer-events-none uppercase">
          [ SECTOR_∞ : WAVE_STABLE ]
        </div>

        <div
          className="absolute bottom-10 left-1/2 pointer-events-none"
          style={{
            zIndex: 30,
            transform: 'translateX(-50%)',
            opacity: `calc(1 - var(--g-intense, 0) * 5)`,
            transition: 'opacity 0.2s',
          } as React.CSSProperties}
        >
          <div
            className="flex flex-col items-center gap-2"
            style={{
              fontFamily: 'var(--font-space-mono), monospace',
              fontSize: '0.6rem',
              letterSpacing: '0.3em',
              color: 'rgba(6,182,212,0.5)',
              textTransform: 'uppercase',
              animation: 'scroll-hint-bob 2s ease-in-out infinite',
            }}
          >
            <span>scroll to enter</span>
            <svg width="12" height="20" viewBox="0 0 12 20" fill="none">
              <path d="M6 0 L6 14 M1 9 L6 15 L11 9" stroke="rgba(6,182,212,0.5)" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes flash {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 0; }
        }
        @keyframes vibrate {
          0% { transform: translate(0); }
          25% { transform: translate(4px, -2px) scale(1.02); }
          50% { transform: translate(-4px, 2px) scale(0.98); }
          75% { transform: translate(2px, 4px); }
          100% { transform: translate(0); }
        }
        @keyframes hero-scanline-flicker {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
        @keyframes hero-glitch-bar {
          0% { top: 10%; height: 4px; }
          20% { top: 60%; height: 8px; }
          40% { top: 30%; height: 3px; }
          60% { top: 75%; height: 6px; }
          80% { top: 15%; height: 10px; }
          100% { top: 50%; height: 4px; }
        }
        @keyframes hero-error-vibrate {
          0% { transform: translate(0); }
          25% { transform: translate(-3px, 1px); }
          50% { transform: translate(3px, -1px); }
          75% { transform: translate(-2px, -2px); }
          100% { transform: translate(0); }
        }
        @keyframes scroll-hint-bob {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(6px); }
        }
      `}</style>
    </>
  );
}
