"use client";

import React, { useState, useEffect } from "react";
import Noise from "./Noise";

interface GlitchLoaderProps {
  onComplete?: () => void;
  isLoading?: boolean;
}

const GlitchLoader: React.FC<GlitchLoaderProps> = ({
  onComplete,
  isLoading = true,
}) => {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 20) return prev;
          return prev + 1;
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isLoading]);

  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onComplete?.();
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [isLoading, onComplete]);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-9999 bg-black flex items-center justify-center transition-all duration-700 overflow-hidden ${!isLoading ? "opacity-0 scale-105 blur-lg" : "opacity-100"}`}
    >
      <div className="crt-bezel"></div>

      <div className="relative w-full h-full max-w-[95vw] max-h-[92vh] retro-blue-bg overflow-hidden flex flex-col items-center justify-center rounded-[6rem]">
        <div className="crt-vignette"></div>
        <div className="crt-glass-glow"></div>
        <div className="crt-scanlines"></div>
        <div className="absolute inset-0 pointer-events-none vhs-flicker-layer opacity-[0.25]">
          <Noise patternAlpha={40} patternRefreshInterval={1} />
        </div>

        <div className="relative z-10 flex flex-col items-center w-full max-w-4xl px-12 vhs-flicker-layer scale-[0.92] filter blur-[0.4px]">
          <div className="flex items-center gap-10 mb-12">
            <div className="relative w-28 h-28 flex flex-col justify-between overflow-hidden">
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="w-full bg-white opacity-90 skew-x-[-20deg]"
                  style={{ height: "3px" }}
                ></div>
              ))}
              <div className="absolute inset-0 border-10 border-white rounded-full skew-x-[-20deg] mix-blend-difference"></div>
            </div>

            <div className="flex flex-col">
              <h1 className="text-8xl italic font-bold text-white tracking-tighter -skew-x-12 drop-shadow-[6px_6px_0_rgba(0,0,0,0.4)] font-serif uppercase">
                PHOTON
              </h1>
            </div>
          </div>

          <div className="flex flex-col items-center gap-2 mb-20 text-white/90 font-mono text-center tracking-[0.15em] uppercase text-sm md:text-base opacity-70">
            <p>Photon Development Studio, Website</p>
            <p>Version 1.0.44.b</p>
          </div>

          <div className="flex flex-col items-center gap-6 w-full">
            <div className="w-full max-w-lg p-2 border-2 border-white/80 bg-black/40 shadow-[4px_4px_0_rgba(0,0,0,0.5)]">
              <div className="flex gap-1.5 h-8">
                {[...Array(20)].map((_, i) => (
                  <div
                    key={i}
                    className={`segmented-bar-block flex-1 h-full ${i >= progress ? "empty" : "vhs-jitter-subtle"}`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="mt-28 font-mono text-[20px] text-white tracking-widest text-center px-4 uppercase filter blur-[0.2px]">
            Copyright (c) Photon Development Studio AB, 2026. All Rights
            Reserved.
          </div>
        </div>

        <div className="absolute w-full h-0.75 bg-white/10 animate-[tracking-line_3.5s_linear_infinite] pointer-events-none z-20"></div>
      </div>
    </div>
  );
};

export default GlitchLoader;
