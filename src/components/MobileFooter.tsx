"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

const SOCIAL_LINKS = [
  { label: "INSTA", href: "https://www.instagram.com/neutronfest/" },
  { label: "X", href: "https://x.com/neutronfest" },
  { label: "YT", href: "https://youtu.be/2b-kZc_UW6I?list=PLSiPF1zjyE3Fd_aXpCIkGCSuKr5vEA4mg" },
  { label: "LINKEDIN", href: "https://www.linkedin.com/company/neutronfest" },
];

export default function MobileFooter() {
  return (
    <footer className="relative w-full bg-[#0d0a08] pt-24 pb-12 px-8 overflow-hidden border-t border-white/5">
      <div className="flex flex-col items-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <Image 
            src="https://ik.imagekit.io/yatharth/neutron_clean.png" 
            alt="Neutron Logo" 
            width={120} 
            height={40} 
            className="opacity-90 grayscale brightness-[1.5]"
          />
        </motion.div>

        <p className="text-[11px] font-mono uppercase tracking-[0.3em] text-white/30 text-center leading-relaxed max-w-[280px] mb-16">
          A next-generation technology festival challenge limits and redefined possibilities.
        </p>

        <div className="grid grid-cols-2 gap-x-12 gap-y-6 mb-20">
          {SOCIAL_LINKS.map((link) => (
            <a 
              key={link.label}
              href={link.href}
              target="_blank"
              className="text-[10px] font-mono font-bold tracking-[0.4em] text-white/50 hover:text-orange-400 transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex gap-6 mb-12">
            <Link href="/faq" className="text-[10px] uppercase font-mono tracking-widest text-white/20 hover:text-white transition-colors">FAQ</Link>
            <Link href="/terms" className="text-[10px] uppercase font-mono tracking-widest text-white/20 hover:text-white transition-colors">TERMS</Link>
            <Link href="/contact" className="text-[10px] uppercase font-mono tracking-widest text-white/20 hover:text-white transition-colors">CONTACT</Link>
        </div>

        <div className="pt-8 border-t border-white/5 w-full flex flex-col items-center">
          <p className="text-[9px] font-mono text-white/20 uppercase tracking-[0.5em] mb-4">
            NEST 2026 — MISSION CONTROL
          </p>
          <a href="mailto:hello@neutronfest.com" className="text-[10px] font-mono text-white/40 hover:text-orange-400 transition-colors uppercase tracking-widest">
            hello@neutronfest.com
          </a>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 w-full h-[20vh] opacity-10 pointer-events-none">
        <svg viewBox="0 0 1440 320" className="w-full h-full" preserveAspectRatio="none">
          <path fill="none" stroke="white" strokeWidth="2" d="M0,160 C360,60 1080,260 1440,160" />
          <path fill="none" stroke="white" strokeWidth="2" d="M0,200 C360,100 1080,300 1440,200" opacity="0.5" />
        </svg>
      </div>
    </footer>
  );
}
