"use client";

import { motion } from "framer-motion";
import DomeGallery from "./DomeGallery";
import Noise from "./Noise";

export default function AboutGallery() {
  return (
    <section className="relative w-full min-h-screen bg-transparent flex flex-col items-center justify-center overflow-hidden py-24">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] bg-[#ffb84d]/5 blur-[120px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        viewport={{ once: true }}
        className="text-center mb-16 px-4"
      >
        <h2 className="text-[2.5rem] md:text-[4rem] font-bold tracking-tight text-white leading-tight">
          Captured <span className="italic font-light opacity-80">Moments</span>
        </h2>
      </motion.div>

      <div className="relative w-[90vw] md:w-[80vw] h-[60vh] md:h-[80vh] rounded-[2rem] overflow-hidden border border-white/10 shadow-3xl shadow-white/5">
        <DomeGallery
          fit={1}
          minRadius={600}
          maxVerticalRotationDeg={0}
          segments={34}
          dragDampening={2}
          grayscale
        />
        
        <div className="absolute top-6 left-6 w-8 h-8 border-t border-l border-white/20 pointer-events-none" />
        <div className="absolute bottom-6 right-6 w-8 h-8 border-b border-r border-white/20 pointer-events-none" />
      </div>

      <Noise patternAlpha={10} patternRefreshInterval={2} />
    </section>
  );
}