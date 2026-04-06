"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Noise from "./Noise";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

export default function AboutHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.85]);
  const borderRadius = useTransform(scrollYProgress, [0, 1], ["0rem", "3rem"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8, 1], [1, 1, 0.4]);

  const textY = useTransform(scrollYProgress, [0, 1], ["5%", "-15%"]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.1, 0.3], [0, 0, 1]);
  const textScale = useTransform(scrollYProgress, [0, 0.3], [0.9, 1]);

  return (
    <section ref={containerRef} className="relative h-[300vh] w-full bg-transparent overflow-x-clip">
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
        <motion.div
          ref={videoRef}
          className="relative w-full h-full overflow-hidden"
          style={{
            scale,
            borderRadius,
            opacity,
          }}
        >
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            src="https://rishihoodmarketingimg.s3.ap-south-1.amazonaws.com/Neutron+ORG/Neutron.mp4"
          />
          <div className="absolute inset-0 bg-black/40" />
        </motion.div>

        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-4"
          style={{ 
            opacity: textOpacity,
            scale: textScale,
          }}
        >
          <motion.h1 
            className="text-[clamp(2.8rem,10vw,8rem)] font-bold leading-none tracking-tighter text-white"
          >
            You are <span className="italic font-light text-white/90">still</span> not <br />
            ready for <span className="relative">this<span className="absolute -right-8 top-0 text-[#ffb84d]">.</span></span>
          </motion.h1>
          <motion.div 
            className="mt-12 w-px h-24 bg-linear-to-b from-[#ffb84d]/60 to-transparent"
            animate={{ scaleY: [0, 1, 0], opacity: [0, 1, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>
      </div>

      <div className="fixed top-6 left-6 z-50 flex items-center gap-5">
        <Link href="/" className="transition-transform duration-300 hover:scale-110" aria-label="Neutron Home">
          <Image
            src="https://ik.imagekit.io/yatharth/neutron_clean.png"
            alt="Neutron Logo"
            width={100}
            height={100}
            className="object-contain"
            style={{ filter: "drop-shadow(0 0 14px rgba(220,140,30,0.55)) drop-shadow(0 0 4px rgba(255,200,80,0.3))" }}
            priority
          />
        </Link>
        <Link href="/?phase=planets">
          <div className="flex items-center space-x-3 group cursor-pointer relative overflow-hidden backdrop-blur-xl bg-white/5 border border-white/10 px-4 py-1.5 rounded-full hover:bg-white/10 hover:border-white/30 transition-all duration-500">
            <div className="flex items-center justify-center bg-white/10 w-6 h-6 rounded-full group-hover:bg-white transition-colors duration-500">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-white group-hover:text-black transition-colors duration-500">
                <path d="M19 12H5M12 19l-7-7 7-7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/50 group-hover:text-white transition-colors font-mono">Back to Planets</span>
          </div>
        </Link>
      </div>

      <Noise patternAlpha={12} patternRefreshInterval={2} />
    </section>
  );
}
