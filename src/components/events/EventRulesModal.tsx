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
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 md:p-12 overflow-hidden" data-lenis-prevent>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/90 backdrop-blur-xl"
          />

          {/* Modal Content */}
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
            className="relative w-full max-w-5xl h-full max-h-[85vh] bg-[#050505] border-[1px] border-cyan-500/30 shadow-[0_0_50px_rgba(6,182,212,0.15)] flex flex-col z-10 rounded-lg overflow-hidden"
          >
            {/* Glitch Overlays */}
            <div className="absolute inset-0 pointer-events-none z-50 opacity-[0.03] crt-scanlines mix-blend-screen"></div>
            <div className="absolute inset-0 pointer-events-none z-[100] opacity-[0.05] bg-[url('https://res.cloudinary.com/dyd911kmh/image/upload/v1640050115/glitch_u4q1zq.gif')]"></div>

            {/* Header */}
            <div className="flex items-center justify-between p-6 md:p-10 border-b border-white/10 bg-black/50 backdrop-blur-md relative overflow-hidden">
                {/* Header Glitch Background */}
                <div className="absolute inset-0 bg-cyan-500/5 animate-pulse pointer-events-none" />
                
                <div className="relative z-10">
                    <h2 className="text-[2rem] md:text-[3.5rem] font-black uppercase leading-none text-white tracking-tight">
                    {title} <span className="text-cyan-500">Rules</span>
                    </h2>
                </div>

                <button
                    onClick={onClose}
                    className="relative z-10 p-3 md:p-4 border border-white/10 hover:border-cyan-500/50 hover:bg-cyan-500/10 text-white transition-all transform active:scale-95 group rounded-full"
                >
                    <X className="w-6 h-6 md:w-8 md:h-8 transition-transform group-hover:rotate-90" />
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 md:p-12 custom-dark-scrollbar bg-black/20">
              <RulesAccordion rules={rules} />
            </div>

            {/* Footer */}
            <div className="p-5 border-t border-white/10 bg-black/80 flex justify-between items-center font-mono text-[0.6rem] md:text-[0.8rem] text-white/40 font-bold uppercase tracking-[0.4em]">
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
        
        /* DARK MODAL ACCORDION OVERRIDES */
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
