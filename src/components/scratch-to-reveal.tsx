"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";

interface ScratchToRevealProps {
  children: React.ReactNode;
  width?: string;
  height?: string;
}

export default function ScratchToReveal({ children, width = "100%", height = "100%" }: ScratchToRevealProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isScratching, setIsScratching] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      if (!canvas || !containerRef.current) return;
      const { width, height } = containerRef.current.getBoundingClientRect();
      if (!isRevealed) {
        canvas.width = width;
        canvas.height = height;

        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, "#2c2c34");
        gradient.addColorStop(0.5, "#43434f");
        gradient.addColorStop(1, "#1a1a1f");

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        ctx.fillStyle = "rgba(255,255,255,0.2)";
        ctx.font = "12px monospace";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("SCRATCH TO REVEAL", width / 2, height / 2);
      }
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    return () => window.removeEventListener("resize", resizeCanvas);
  }, [isRevealed]);

  const scratch = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (isRevealed || !isScratching) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    let x, y;

    if ("touches" in e) {
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = (e as React.MouseEvent).clientX - rect.left;
      y = (e as React.MouseEvent).clientY - rect.top;
    }

    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2);
    ctx.fill();

    checkReveled();
  };

  const checkReveled = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let clearedPixels = 0;
    const totalPixels = imageData.data.length / 4;

    for (let i = 0; i < imageData.data.length; i += 4) {
      if (imageData.data[i + 3] === 0) {
        clearedPixels++;
      }
    }

    const clearedPercentage = clearedPixels / totalPixels;
    if (clearedPercentage > 0.45 && !isRevealed) {
      setIsRevealed(true);
      canvas.style.transition = "opacity 0.6s ease";
      canvas.style.opacity = "0";
      setTimeout(() => {
        canvas.style.display = "none";
      }, 600);
    }
  };

  const handlePointerDown = () => setIsScratching(true);
  const handlePointerUp = () => setIsScratching(false);

  return (
    <div 
      ref={containerRef} 
      className={`relative inline-block overflow-hidden rounded-md cursor-crosshair select-none ${isRevealed ? 'cursor-default' : ''}`}
      style={{ width, height, touchAction: 'none' }}
    >
      <div className={`w-full h-full flex items-center justify-center bg-green-500/10 border border-green-500/30 rounded-md transition-all duration-700 ${isRevealed ? 'shadow-[0_0_20px_rgba(34,197,94,0.3)]' : ''}`}>
        {children}
      </div>
      
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full z-10 touch-none"
        onMouseDown={handlePointerDown}
        onMouseUp={handlePointerUp}
        onMouseLeave={handlePointerUp}
        onMouseMove={scratch}
        onTouchStart={handlePointerDown}
        onTouchEnd={handlePointerUp}
        onTouchCancel={handlePointerUp}
        onTouchMove={scratch}
      />
    </div>
  );
}
