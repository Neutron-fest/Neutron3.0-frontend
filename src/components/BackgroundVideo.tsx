"use client"

import React, { useRef, useEffect } from 'react';

interface BackgroundVideoProps {
  src: string;
}

const BackgroundVideo: React.FC<BackgroundVideoProps> = ({ src }) => {
  const v1 = useRef<HTMLVideoElement>(null);
  const v2 = useRef<HTMLVideoElement>(null);
  const v3 = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const main = v1.current;
    if (!main) return;

    const sync = () => {
      if (!v2.current || !v3.current) return;
      
      if (Math.abs(v2.current.currentTime - main.currentTime) > 0.1) {
          v2.current.currentTime = main.currentTime;
      }
      if (Math.abs(v3.current.currentTime - main.currentTime) > 0.1) {
          v3.current.currentTime = main.currentTime;
      }
    };

    const interval = setInterval(sync, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-[#1c151b]">
      <div className="relative w-full h-full glitch-wrapper">
        <video 
          ref={v1}
          autoPlay 
          loop 
          muted 
          playsInline 
          className="w-full h-full object-cover opacity-60 mix-blend-screen"
        >
          <source src={src} type="video/mp4" />
        </video>

        <video 
          ref={v2}
          autoPlay 
          loop 
          muted 
          playsInline 
          className="glitch-layer magenta absolute inset-0 w-full h-full object-cover mix-blend-screen opacity-0 pointer-events-none"
        >
          <source src={src} type="video/mp4" />
        </video>

        <video 
          ref={v3}
          autoPlay 
          loop 
          muted 
          playsInline 
          className="glitch-layer cyan absolute inset-0 w-full h-full object-cover mix-blend-screen opacity-0 pointer-events-none"
        >
          <source src={src} type="video/mp4" />
        </video>
        
        <div className="glitch-overlay absolute inset-0 bg-white opacity-0 mix-blend-overlay pointer-events-none"></div>
      </div>

      <style jsx>{`
        .glitch-wrapper {
          position: relative;
          width: 100%;
          height: 100%;
          animation: main-shake 10s infinite steps(1);
        }

        .glitch-layer {
          will-change: transform, opacity, clip-path;
        }

        .magenta {
          filter: hue-rotate(-90deg) contrast(1.5) saturate(2);
          animation: magenta-glitch 4.5s infinite steps(1);
        }

        .cyan {
          filter: hue-rotate(90deg) contrast(1.5) saturate(2);
          animation: cyan-glitch 4s infinite steps(1) reverse;
        }

        .glitch-overlay {
          animation: global-interference 8s infinite steps(1);
        }

        @keyframes main-shake {
          0%, 20%, 45%, 70%, 90%, 100% { transform: translate(0) scale(1); filter: none; }
          21% { transform: translate(8px, -4px) scale(1.05); filter: contrast(1.5) brightness(1.2); }
          21.5% { transform: translate(-8px, 4px) scale(0.98); }
          22% { transform: translate(0) scale(1); }
          71% { transform: translate(-12px, -8px) scale(1.08); filter: invert(0.05); }
          71.5% { transform: translate(12px, 8px) scale(0.95); }
          91% { transform: translate(5px, 5px) scale(1.1); filter: saturate(2) brightness(1.5); }
          91.5% { transform: translate(-15px, -10px) scale(1.02); }
          92% { transform: translate(0) scale(1); }
        }

        @keyframes magenta-glitch {
          0%, 10%, 25%, 50%, 75%, 95%, 100% { opacity: 0; clip-path: inset(0 0 0 0); transform: translate(0); }
          11% { opacity: 0.6; clip-path: inset(15% 0 70% 0); transform: translate(-20px, 10px); }
          12% { opacity: 0.8; clip-path: inset(80% 0 10% 0); transform: translate(30px, -10px); }
          51% { opacity: 0.6; clip-path: inset(35% 0 45% 0); transform: translate(-25px, -20px); }
          52% { opacity: 0.4; clip-path: inset(65% 0 15% 0); transform: translate(25px, 20px); }
          76% { opacity: 0.7; clip-path: inset(20% 0 75% 0); transform: translate(-35px, 0); }
          96% { opacity: 0.8; transform: scale(1.2) translate(-15px, 0); clip-path: inset(0 0 95% 0); }
        }

        @keyframes cyan-glitch {
          0%, 15%, 30%, 55%, 80%, 92%, 100% { opacity: 0; clip-path: inset(0 0 0 0); transform: translate(0); }
          16% { opacity: 0.6; clip-path: inset(45% 0 40% 0); transform: translate(25px, -10px); }
          17% { opacity: 0.8; clip-path: inset(10% 0 80% 0); transform: translate(-25px, 10px); }
          56% { opacity: 0.6; clip-path: inset(70% 0 20% 0); transform: translate(25px, 25px); }
          57% { opacity: 0.4; clip-path: inset(20% 0 70% 0); transform: translate(-25px, -25px); }
          81% { opacity: 0.7; clip-path: inset(25% 0 65% 0); transform: translate(45px, 0); }
          93% { opacity: 0.8; transform: scale(1.2) translate(15px, 0); clip-path: inset(95% 0 0 0); }
        }

        @keyframes global-interference {
          0%, 15%, 45%, 50%, 85%, 90%, 100% { opacity: 0; background: white; }
          16% { opacity: 0.1; background: #ff00ff; }
          46% { opacity: 0.15; background: #00ffff; transform: scaleY(5); }
          47% { opacity: 0.05; background: white; }
          86% { opacity: 0.2; background: white; transform: skewX(10deg); }
          87% { opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default BackgroundVideo;
