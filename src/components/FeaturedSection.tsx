"use client";

import React, { ReactNode } from "react";
import { motion } from "framer-motion";

interface FeaturedSectionProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}

export default function FeaturedSection({ title, subtitle, children, className = "" }: FeaturedSectionProps) {
  return (
    <section className={`py-12 px-6 ${className}`}>
      <div className="mb-10">
        <motion.span 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 0.5, x: 0 }}
          viewport={{ once: true }}
          className="text-[10px] font-mono uppercase tracking-[0.5em] text-white/40 block mb-3"
        >
          {subtitle || "Mission Update"}
        </motion.span>
        
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-4xl font-bold tracking-tighter text-white uppercase leading-none"
          style={{ fontFamily: "var(--font-sora), sans-serif" }}
        >
          {title}
        </motion.h2>
      </div>
      
      {children}
    </section>
  );
}
