"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShieldAlert } from "lucide-react";
import RulesAccordion from "../competitions/RulesAccordion";

interface RuleItem {
  title: string;
  content: string;
}

interface EventRulesModalProps {
  isOpen: boolean;
  onClose: () => void;
  rules: RuleItem[];
  title: string;
}

export default function EventRulesModal({ isOpen, onClose, rules, title }: EventRulesModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.overscrollBehavior = "none";
    } else {
      document.body.style.overflow = "unset";
      document.body.style.overscrollBehavior = "auto";
    }
    return () => {
      document.body.style.overflow = "unset";
      document.body.style.overscrollBehavior = "auto";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-200 flex items-center justify-center p-2.5 sm:p-4 md:p-10 overflow-hidden overscroll-none"
        data-lenis-prevent
        style={{ touchAction: "none" }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          <motion.div
            initial={{ 
                opacity: 0, 
                scaleX: 0, 
                scaleY: 0.005,
                filter: "brightness(5) contrast(2) hue-rotate(90deg)" 
            }}
            animate={{ 
                opacity: 1, 
                scaleX: 1, 
                scaleY: 1,
                filter: "brightness(1) contrast(1) hue-rotate(0deg)"
            }}
            exit={{ 
                opacity: 0, 
                scaleX: 1.1, 
                scaleY: 0.005,
                filter: "brightness(5) contrast(2) hue-rotate(-90deg)" 
            }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-5xl h-full max-h-[90dvh] md:max-h-[85vh] bg-[#050505] border-px border-cyan-500/30 shadow-[0_0_50px_rgba(6,182,212,0.15)] flex flex-col z-10 rounded-lg overflow-hidden"
            onWheelCapture={(e) => e.stopPropagation()}
            onPointerMove={(e) => e.stopPropagation()}
          >
            <div className="absolute inset-0 pointer-events-none z-50 opacity-[0.03] crt-scanlines mix-blend-screen"></div>
            <div className="absolute inset-0 pointer-events-none z-100 opacity-[0.05] bg-[url('https://res.cloudinary.com/dyd911kmh/image/upload/v1640050115/glitch_u4q1zq.gif')]"></div>

            <div className="flex items-center justify-between gap-3 p-3 sm:p-5 md:p-8 border-b-2 sm:border-b-4 border-white/10 bg-black/50 backdrop-blur-md shrink-0">
              <div className="relative z-10">
                <span className="font-mono text-[0.6rem] sm:text-[0.75rem] md:text-[0.9rem] text-cyan-500 uppercase tracking-[0.15em] sm:tracking-[0.25em] md:tracking-widest font-bold block mb-1">
                  [ System Protocol v1.4 ]
                </span>
                <h2 className="text-[1rem] sm:text-[1.6rem] md:text-[2.2rem] lg:text-[2.8rem] font-black uppercase leading-none text-white">
                    {title} <span className="text-cyan-500">Rules</span>
                </h2>
              </div>

              <button
                onClick={onClose}
                className="relative z-10 p-2 sm:p-2.5 md:p-3 border border-white/10 hover:border-cyan-500/50 hover:bg-cyan-500/10 text-white transition-all transform active:scale-95 group rounded-full shrink-0"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 transition-transform group-hover:rotate-90" />
              </button>
            </div>

            <div
              className="flex-1 min-h-0 overflow-y-auto overscroll-y-contain p-4 sm:p-6 md:p-10 custom-dark-scrollbar"
              style={{ WebkitOverflowScrolling: "touch", touchAction: "pan-y" }}
              onTouchMove={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
              onPointerMove={(e) => e.stopPropagation()}
            >
              <RulesAccordion rules={rules} />
            </div>

            <div className="p-3 sm:p-4 md:p-6 border-t-2 sm:border-t-4 border-white/10 bg-black/80 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1.5 sm:gap-4 font-mono text-[0.55rem] sm:text-[0.7rem] md:text-[0.85rem] text-white/40 font-bold uppercase tracking-[0.12em] sm:tracking-[0.2em] md:tracking-widest shrink-0">
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
                <span>GRID:_CONNECTED</span>
              </div>
              <span className="hidden sm:inline">DECRYPTION_COMPLETE // 0xCCFF2</span>
            </div>
          </motion.div>
        </div>
      )}

      <style jsx global>{`
        .custom-dark-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-dark-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
        }
        .custom-dark-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(6, 182, 212, 0.3);
          border-radius: 10px;
        }
        .custom-dark-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(6, 182, 212, 0.6);
        }
        
        .custom-dark-scrollbar [data-radix-collection-item] {
            border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
        }
        .custom-dark-scrollbar button[data-state] {
            color: white !important;
        }
        .custom-dark-scrollbar div[data-state] {
            color: rgba(255, 255, 255, 0.7) !important;
        }
      `}</style>
    </AnimatePresence>
  );
}
