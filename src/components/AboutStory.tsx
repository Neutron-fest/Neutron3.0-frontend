"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import Image from "next/image";

const STORY_SECTIONS = [
  {
    id: 1,
    title: "The Singularity",
    text: "It all began with a single ripple in the fabric of space-time. A point of infinite density, where laws of physics as we know them ceased to exist. We didn't just observe it—we entered it.",
    image: "https://cdn.prod.website-files.com/62e8d2ea218fb7676b6892a6/695bd44c5ed672dde63d1267_Frame%201943243498.avif",
  },
  {
    id: 2,
    title: "Beyond the Horizon",
    text: "As we crossed the event horizon, the stars didn't just fade—they transformed. Time became a dimension we could walk through, and space became a canvas for our imagination.",
    image: "https://cdn.prod.website-files.com/62e8d2ea218fb7676b6892a6/695bd44c6e00eb853581c9cd_Frame%201943243494.avif",
  },
  {
    id: 3,
    title: "New Frontiers",
    text: "Neutron 3.0 was born from this expansion. Not just a festival, but a portal into the future of techno-culture. We are the architects of this new reality, and you are its pioneers.",
    image: "https://cdn.prod.website-files.com/62e8d2ea218fb7676b6892a6/695bd44befe1a76a37682392_Frame%201943243493.avif",
  },
  {
    id: 4,
    title: "Your Journey Begins",
    text: "The cosmos is calling. It's not just about what you see—it's about what you become. Welcome to the singularity. Welcome to Neutron 3.0.",
    image: "https://cdn.prod.website-files.com/62e8d2ea218fb7676b6892a6/695bd44ca40985306cad3d95_Frame%201943243497.avif",
  },
];

export default function AboutStory() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useEffect(() => {
    const unsubscribe = scrollYProgress.onChange((latest) => {
      const index = Math.min(
        STORY_SECTIONS.length - 1,
        Math.floor(latest * STORY_SECTIONS.length)
      );
      if (index !== activeIndex) {
        setActiveIndex(index);
      }
    });
    return () => unsubscribe();
  }, [scrollYProgress, activeIndex]);

  return (
    <section ref={containerRef} className="relative w-full bg-transparent min-h-[350vh]">
      <div className="flex flex-col md:flex-row gap-8 px-4 md:px-12 pt-24">
        <div className="w-full md:w-1/2 space-y-[40vh] md:space-y-[60vh] pb-[20vh]">
          {STORY_SECTIONS.map((section, i) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0.2, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ margin: "-40% 0% -40% 0%", once: false }}
              className="flex flex-col gap-6"
            >
              <span className="text-[#ffb84d] font-mono text-sm tracking-[0.3em] uppercase opacity-70">
                Chapter 0{section.id}
              </span>
              <h2 className="text-[2.5rem] md:text-[3.5rem] font-bold leading-tight tracking-tight text-white mb-4 italic">
                {section.title}
              </h2>
              <p className="text-[1.1rem] md:text-[1.3rem] leading-relaxed text-white/50 max-w-[85%]">
                {section.text}
              </p>
              
              <div className="block md:hidden w-full aspect-4/3 relative rounded-3xl overflow-hidden mt-8 grayscale-[0.5] hover:grayscale-0 transition-all duration-700">
                <Image
                  src={section.image}
                  alt={section.title}
                  fill
                  className="object-cover"
                />
              </div>
            </motion.div>
          ))}
        </div>

        <div className="hidden md:block w-1/2 sticky top-[20vh] h-[60vh] rounded-[2.5rem] overflow-hidden border border-white/10 group shadow-2xl shadow-white/5">
          {STORY_SECTIONS.map((section, i) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{
                opacity: activeIndex === i ? 1 : 0,
                scale: activeIndex === i ? 1 : 1.1,
              }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 grayscale-[0.4] group-hover:grayscale-0 transition-all duration-1000"
            >
              <Image
                src={section.image}
                alt={section.title}
                fill
                className="object-cover"
                priority={i === 0}
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-60" />
            </motion.div>
          ))}
          
          <div className="absolute top-8 left-8 w-12 h-12 border-t border-l border-[#ffb84d]/30 pointer-events-none" />
          <div className="absolute bottom-8 right-8 w-12 h-12 border-b border-r border-[#ffb84d]/30 pointer-events-none" />
        </div>
      </div>
    </section>
  );
}
