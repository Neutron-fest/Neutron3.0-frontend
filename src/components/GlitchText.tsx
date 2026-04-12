"use client"

import React, { FC, useMemo } from 'react';

interface GlitchTextProps {
  children: string;
  speed?: number; 
  className?: string;
  enableOnHover?: boolean;
}

const GlitchText: FC<GlitchTextProps> = ({
  children,
  speed = 1.5,
  className = '',
  enableOnHover = false,
}) => {
  const duration = useMemo(() => `${1.5 / speed}s`, [speed]);

  return (
    <div className={`relative inline-block group cursor-default select-none ${className}`}>
      <style jsx>{`
        .glitch-wrapper {
          position: relative;
          color: white;
        }

        .glitch-layer {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0.9;
          pointer-events: none;
        }

        .glitch-base {
          position: relative;
          z-index: 5;
          display: block;
          animation: ${enableOnHover ? 'none' : 'flicker 3s infinite steps(1)'};
        }

        .glitch-red {
          color: #ff00c1;
          z-index: 4;
          clip-path: inset(50% 0 30% 0);
          transform: translate(-4px, 2px);
          animation: ${enableOnHover ? 'none' : `glitch-anim-1 ${duration} infinite steps(1) alternate-reverse`};
          mix-blend-mode: screen;
        }

        .glitch-cyan {
          color: #00fff9;
          z-index: 3;
          clip-path: inset(10% 0 60% 0);
          transform: translate(4px, -2px);
          animation: ${enableOnHover ? 'none' : `glitch-anim-2 ${duration} infinite steps(1) alternate-reverse`};
          mix-blend-mode: screen;
        }

        .glitch-flash {
          color: #fff;
          z-index: 2;
          opacity: 0;
          animation: ${enableOnHover ? 'none' : `glitch-flash-anim 4s infinite steps(1)`};
          mix-blend-mode: overlay;
        }

        @keyframes flicker {
          0%, 100% { transform: translate(0); opacity: 1; }
          10% { transform: translate(-1px, 1px); }
          20% { transform: translate(1px, -1px); opacity: 0.95; }
          30% { transform: translate(-2px, -1px); }
          40% { transform: translate(2px, 1px); filter: brightness(1.2); }
          50% { transform: translate(-1px, 2px); opacity: 0.9; }
          60% { transform: translate(1px, 1px); }
          70% { transform: translate(-2px, -2px); filter: contrast(1.5); }
          80% { transform: translate(2px, -1px); }
          90% { transform: translate(-1px, 1px); }
        }

        @keyframes glitch-anim-1 {
          0% { clip-path: inset(80% 0 1% 0); transform: translate(-12px, -4px); }
          5% { clip-path: inset(10% 0 60% 0); transform: translate(12px, 4px); }
          10% { clip-path: inset(40% 0 43% 0); transform: translate(-12px, -4px); }
          15% { clip-path: inset(92% 0 1% 0); transform: translate(12px, 4px); }
          20% { clip-path: inset(25% 0 58% 0); transform: translate(-8px, 10px); }
          30% { clip-path: inset(54% 0 7% 0); transform: translate(8px, -10px); }
          40% { clip-path: inset(58% 0 43% 0); transform: translate(-12px, -4px); }
          50% { clip-path: inset(10% 0 80% 0); transform: translate(12px, 4px); }
          60% { clip-path: inset(42% 0 11% 0); transform: translate(-15px, 0px); }
          70% { clip-path: inset(54% 0 7% 0); transform: translate(15px, 0px); }
          80% { clip-path: inset(58% 0 43% 0); transform: translate(-4px, 12px); }
          90% { clip-path: inset(10% 0 80% 0); transform: translate(4px, -12px); }
          100% { clip-path: inset(80% 0 1% 0); transform: translate(-12px, -4px); }
        }

        @keyframes glitch-anim-2 {
          0% { clip-path: inset(10% 0 80% 0); transform: translate(15px, 6px); }
          5% { clip-path: inset(80% 0 1% 0); transform: translate(-15px, -6px); }
          10% { clip-path: inset(54% 0 7% 0); transform: translate(15px, 6px); }
          15% { clip-path: inset(58% 0 43% 0); transform: translate(-15px, -6px); }
          20% { clip-path: inset(40% 0 61% 0); transform: translate(10px, -12px); }
          30% { clip-path: inset(92% 0 1% 0); transform: translate(-10px, 12px); }
          40% { clip-path: inset(43% 0 1% 0); transform: translate(15px, 6px); }
          50% { clip-path: inset(25% 0 58% 0); transform: translate(-15px, -6px); }
          60% { clip-path: inset(54% 0 7% 0); transform: translate(20px, 0px); }
          70% { clip-path: inset(58% 0 43% 0); transform: translate(-20px, 0px); }
          80% { clip-path: inset(42% 0 11% 0); transform: translate(6px, 15px); }
          90% { clip-path: inset(25% 0 58% 0); transform: translate(-6px, -15px); }
          100% { clip-path: inset(10% 0 80% 0); transform: translate(15px, 6px); }
        }

        @keyframes glitch-flash-anim {
          0%, 80%, 100% { opacity: 0; transform: scale(1); }
          85% { opacity: 0.3; transform: scale(1.1) skew(5deg); }
          86% { opacity: 0.05; transform: scale(0.9); }
          87% { opacity: 0.4; transform: scale(1.2) skew(-5deg); }
          88% { opacity: 0; }
        }
      `}</style>
      
      <div className="glitch-wrapper">
        <span className="glitch-base">{children}</span>
        <span className="glitch-layer glitch-red" aria-hidden="true">{children}</span>
        <span className="glitch-layer glitch-cyan" aria-hidden="true">{children}</span>
        <span className="glitch-layer glitch-flash" aria-hidden="true">{children}</span>
      </div>
    </div>
  );
};

export default GlitchText;
