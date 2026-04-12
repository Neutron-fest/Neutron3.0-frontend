"use client"

import React from 'react';
import Image from 'next/image';

const RetroWorkstation = () => {
  return (
    <div className="relative w-full max-w-3xl ml-auto group perspective-1000">

      <div className="relative animate-[float_6s_ease-in-out_infinite]">
        
        <div className="relative z-0">
          <Image 
            src="https://ik.imagekit.io/yatharth/Untitled.png" 
            alt="Retro Photon Workstation" 
            width={1200}
            height={1200}
            className="w-full h-auto object-contain transition-all duration-700 scale-[1.02] filter brightness-110 contrast-110"
          />
        </div>

        <div className="absolute inset-0 z-10 pointer-events-none mix-blend-color-dodge opacity-40 animate-[vibrate_0.15s_infinite]">
             <Image 
                src="https://ik.imagekit.io/yatharth/Untitled.png" 
                alt="Glitch Overlay" 
                width={1200}
                height={1200}
                className="w-full h-auto object-contain filter hue-rotate-90"
            />
        </div>
      </div>

      <style jsx>{`
        @keyframes vibrate {
          0% { transform: translate(0); }
          25% { transform: translate(4px, -2px) scale(1.02); }
          50% { transform: translate(-4px, 2px) scale(0.98); }
          75% { transform: translate(2px, 4px) scale(1.01); }
          100% { transform: translate(0); }
        }

        @keyframes scanline-local {
          0% { transform: translateY(-100%); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(1000%); opacity: 0; }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(1deg); }
        }
      `}</style>
    </div>
  );
};

export default RetroWorkstation;
