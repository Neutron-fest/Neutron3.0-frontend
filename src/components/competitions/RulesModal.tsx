"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import RulesAccordion from "./RulesAccordion";

interface RuleItem {
  title: string;
  content: string;
}

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
  rules: RuleItem[];
  title: string;
}

export default function RulesModal({ isOpen, onClose, rules, title }: RulesModalProps) {
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
            className="absolute inset-0 bg-[#2c2820]/80 backdrop-blur-md"
          />

          <motion.div
            initial={{ 
                opacity: 0, 
                scaleX: 0, 
                scaleY: 0.005,
                filter: "brightness(5) contrast(2)" 
            }}
            animate={{ 
                opacity: 1, 
                scaleX: 1, 
                scaleY: 1,
                filter: "brightness(1) contrast(1)"
            }}
            exit={{ 
                opacity: 0, 
                scaleX: 1.1, 
                scaleY: 0.005,
                filter: "brightness(5) contrast(2)" 
            }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-6xl h-full max-h-[92dvh] md:max-h-[86vh] bg-[#F4F2EB] border-[5px] sm:border-8 border-[#2c2820] shadow-[14px_14px_0_rgba(44,40,32,1)] sm:shadow-[22px_22px_0_rgba(44,40,32,1)] md:shadow-[30px_30px_0_rgba(44,40,32,1)] flex flex-col z-10 overscroll-none"
            onWheelCapture={(e) => e.stopPropagation()}
            onPointerMove={(e) => e.stopPropagation()}
          >
            <div className="absolute inset-0 pointer-events-none z-50 opacity-10 crt-scanlines mix-blend-color-burn"></div>
            <div className="absolute inset-0 pointer-events-none z-100 opacity-30 mix-blend-multiply" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')" }}></div>

            <div className="flex items-center justify-between gap-3 p-3 sm:p-5 md:p-8 border-b-4 sm:border-b-[6px] border-[#2c2820] bg-[#EAE8E0] shrink-0">
              <div>
                <span className="font-mono text-[0.62rem] sm:text-[0.8rem] md:text-[1rem] text-[#D84B4B] uppercase tracking-[0.15em] sm:tracking-[0.25em] md:tracking-widest font-bold block mb-1">
                  [ System Protocol v1.4 ]
                </span>
                <h2 className="text-[1.2rem] sm:text-[1.8rem] md:text-[2.6rem] lg:text-[3.4rem] font-black uppercase leading-none text-[#2c2820]">
                  {title} Rules
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 sm:p-2.5 md:p-4 border-[3px] sm:border-4 border-[#2c2820] hover:bg-[#D84B4B] hover:text-[#F4F2EB] transition-all transform active:scale-95 group shrink-0"
              >
                <X className="w-5 h-5 sm:w-7 sm:h-7 md:w-9 md:h-9 transition-transform group-hover:rotate-90" />
              </button>
            </div>

            <div
              className="flex-1 min-h-0 overflow-y-auto overscroll-y-contain p-3 sm:p-5 md:p-10 custom-scrollbar"
              style={{ WebkitOverflowScrolling: "touch", touchAction: "pan-y" }}
              onTouchMove={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
              onPointerMove={(e) => e.stopPropagation()}
            >
              <RulesAccordion rules={rules} />
            </div>

            <div className="p-2.5 sm:p-4 md:p-6 border-t-4 border-[#2c2820] bg-[#EAE8E0] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1.5 sm:gap-4 font-mono text-[0.55rem] sm:text-[0.72rem] md:text-[0.95rem] text-[#4d473d] font-bold uppercase tracking-[0.12em] sm:tracking-[0.2em] md:tracking-widest shrink-0">
              <span>Sector: Photon_Grid_Nexus</span>
              <span>Access: Authorized</span>
            </div>
          </motion.div>
        </div>
      )}

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 12px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #EAE8E0;
          border-left: 4px solid #2c2820;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #2c2820;
          border: 2px solid #EAE8E0;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #D84B4B;
        }
      `}</style>
    </AnimatePresence>
  );
}
