"use client";

import { motion } from "framer-motion";
import { ArrowLeft, ArrowUp } from "lucide-react";
import Link from "next/link";

const SOCIAL_LINKS = [
  { label: "INSTAGRAM", href: "https://www.instagram.com/neutronfest/" },
  { label: "X / TWITTER", href: "https://x.com/neutronfest" },
  { label: "YOUTUBE", href: "https://youtu.be/2b-kZc_UW6I?list=PLSiPF1zjyE3Fd_aXpCIkGCSuKr5vEA4mg" },
  { label: "LINKEDIN", href: "https://www.linkedin.com/company/neutronfest" },
];

export default function AboutFooter() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative w-full bg-black text-white pt-32 overflow-hidden border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 md:px-12">
        <div className="flex flex-col items-center justify-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="flex items-center gap-6 md:gap-12 flex-wrap justify-center text-center"
          >
            
            <div className="w-auto h-auto mb-20 md:w-100 md:h-100 flex items-center justify-center relative">
              <img src="https://ik.imagekit.io/yatharth/neutron_clean.png" alt="Logo" />
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-24 border-b border-white/10 pb-24">
          <div className="max-w-md">
            <p className="text-[0.7rem] leading-relaxed font-mono uppercase tracking-widest text-white/50">
              A next generation technology and innovation festival by students, blending space, AI, and disruptive ideas into an electrifying glimpse of the future. A space where builders, thinkers, and innovators come together to challenge limits and redefine possibilities. 
            </p>
          </div>

          <div className="grid grid-cols-2 md:flex md:flex-wrap gap-x-8 gap-y-6 md:justify-end items-start h-min">
            {SOCIAL_LINKS.map((link) => (
              <a 
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[0.7rem] font-mono font-bold tracking-[0.2em] transition-all duration-300 hover:text-[#ffb84d]"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-8 pb-12 font-mono text-[0.7rem] tracking-widest text-white/40 uppercase">
          <div className="flex gap-8 md:gap-12 flex-wrap justify-center">
            <span>©2026</span>
            <Link href="/faq" className="hover:text-[#ffb84d] transition-colors duration-300">FAQ</Link>
            <Link href="/terms" className="hover:text-[#ffb84d] transition-colors duration-300">TERMS</Link>
            <Link href="/contact" className="hover:text-[#ffb84d] transition-colors duration-300">CONTACT</Link>
          </div>

          <div className="flex items-center gap-12 w-full md:w-auto justify-center md:justify-end group">
            <a 
              href="mailto:HELLO@NEUTRONFEST.COM" 
              className="flex items-center gap-2 group-hover:text-white cursor-pointer transition-colors duration-300"
            >
              HELLO@NEUTRONFEST.COM
            </a>
          </div>
        </div>
      </div>

      <div className="relative w-full h-[30vh] md:h-[50vh] mt-[-10vh] overflow-hidden">
        <svg 
          viewBox="0 0 1440 600" 
          className="absolute bottom-0 left-0 w-full h-full opacity-30 select-none pointer-events-none"
          preserveAspectRatio="none"
        >
          {Array.from({ length: 24 }).map((_, i) => (
            <path
              key={i}
              d={`M0,${500 - i * 20} C360,${400 - i * 20} 1080,${600 - i * 20} 1440,${500 - i * 20}`}
              stroke="white"
              strokeWidth="2"
              fill="none"
              opacity={1 - (i * 0.04)}
            />
          ))}
          <rect width="100%" height="200" y="400" fill="url(#bottom-fade)" />
          <defs>
            <linearGradient id="bottom-fade" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="transparent" />
              <stop offset="100%" stopColor="black" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </footer>
  );
}
