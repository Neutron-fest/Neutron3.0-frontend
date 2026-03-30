"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const text = "WE ARE NOT JUST BUILDING A FESTIVAL. WE ARE ENGINEERING A NEW REALITY. A SINGULARITY OF ART, TECHNOLOGY, AND HUMAN CONNECTION. BEYOND THE BOUNDARIES OF THE KNOWN UNIVERSE, THIS IS WHERE THE IMPOSSIBLE BECOMES INEVITABLE.";

export default function AboutCrazyText() {
  const containerRef = useRef<HTMLElement>(null);
  const wordsRef = useRef<HTMLSpanElement[]>([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top", 
          end: "+=250%", 
          scrub: 1, 
          pin: true, 
        }
      });

      tl.to(wordsRef.current, {
        opacity: 1,
        stagger: 0.5,
        ease: "power2.inOut"
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const words = text.split(" ");
  
  return (
    <section ref={containerRef} className="w-full h-screen bg-transparent flex items-center justify-center overflow-hidden">
      <div className="px-6 md:px-12 pointer-events-none flex items-center justify-center max-w-[90vw] mx-auto">
        <p className="flex flex-wrap text-[8vw] md:text-[4vw] font-bold leading-[1.1] tracking-tighter justify-center text-center uppercase">
          {words.map((word, i) => (
            <span 
              key={i} 
              className="relative mr-[1.5vw] md:mr-[0.8vw] mt-[1vw]"
            >
              <span className="absolute text-white/10">{word}</span>
              <span 
                ref={(el) => {
                  if (el) wordsRef.current[i] = el;
                }}
                className="text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.4)] opacity-0 relative z-10"
              >
                {word}
              </span>
            </span>
          ))}
        </p>
      </div>
    </section>
  )
}
