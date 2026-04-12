"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";

function useGlitchPulse(selector: string, interval = 1800) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const id = setInterval(() => {
      if (!ref.current) return;
      ref.current.querySelectorAll<HTMLElement>(selector).forEach(el => {
        if (Math.random() > 0.6) {
          el.dataset.glitch = "1";
          setTimeout(() => delete el.dataset.glitch, 150 + Math.random() * 400);
        }
      });
    }, interval);
    return () => clearInterval(id);
  }, [selector, interval]);
  return ref;
}

const SOCIALS = [
  { label: "LinkedIn",    href: "#", color: "#0a66c2" },
  { label: "Instagram",   href: "#", color: "#e1306c" },
  { label: "X (Twitter)", href: "#", color: "#ffffff" },
];

export default function ContactPage() {
  const rootRef   = useGlitchPulse("[data-glitch-target]");
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 3000);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      ref={rootRef}
      style={{ fontFamily: "var(--font-space-mono), monospace" }}
      className="relative min-h-screen w-full overflow-hidden bg-black text-white selection:bg-[#ff003c] selection:text-white"
    >

      <div className="fixed inset-0 z-0">
        <Image
          src="https://ik.imagekit.io/yatharth/CONTACT.png"
          alt="Retro telephone background"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
          style={{ filter: "grayscale(0.25) contrast(1.2) brightness(0.25) blur(8px)" }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_45%,transparent_25%,rgba(0,0,0,0.6)_55%,rgba(0,0,0,0.93)_80%,#000_100%)]" />
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-black/90" />
      </div>

      <div
        className="fixed inset-0 z-10 pointer-events-none opacity-[0.12] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundSize: "300px 300px",
        }}
      />

      <div
        className="fixed inset-0 z-10 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.7) 100%)",
        }}
      />

      <main className="relative z-20 min-h-screen flex flex-col justify-end px-8 md:px-20 pb-16 pt-32">

        <div
          className="fixed top-28 left-8 md:left-20 flex flex-col gap-1 opacity-70"
          style={{ fontFamily: "var(--font-space-mono)", fontSize: 11 }}
        >
          <span className="text-cyan-400 tracking-widest uppercase">[SYS_CONTACT.EXE]</span>
          <span className="text-white/40 tracking-widest">STATUS: <span className="text-green-400">ONLINE</span></span>
          <span className="text-white/30 tracking-widest">FREQ: 91.5 MHz ██████░░</span>
        </div>

        <div className="fixed top-24 right-8 md:right-20 w-16 h-16 border-t border-r border-white/20 pointer-events-none" />
        <div className="fixed bottom-8 left-8 md:left-20 w-16 h-16 border-b border-l border-white/20 pointer-events-none" />
        <p
          className="max-w-lg mb-16 leading-relaxed text-gray-300"
          style={{ fontSize: "clamp(0.85rem, 1.5vw, 1.15rem)" }}
          data-glitch-target
        >
          Contact us about your digital project idea or general enquires.&nbsp;
          Let's{" "}
          <span
            className="text-cyan-300 font-bold"
            style={{ fontFamily: "var(--font-audiowide)" }}
          >
            interface
          </span>
          , call us today!
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-white/10 pt-10">

          <div className="group flex flex-col gap-3">
            <h3
              className="text-xs tracking-[0.25em] uppercase mb-1"
              style={{ fontFamily: "var(--font-audiowide)", color: "#aaa" }}
            >
              General Enquiries
            </h3>
            <a
              href="mailto:hello@photon.edu"
              className="text-white/80 hover:text-white transition-colors underline underline-offset-4 decoration-white/20 hover:decoration-white text-sm"
              style={{ fontFamily: "var(--font-space-mono)" }}
            >
              hello@photon.edu
            </a>
          </div>

          <div className="group flex flex-col gap-3">
            <h3
              className="text-xs tracking-[0.25em] uppercase mb-1"
              style={{ fontFamily: "var(--font-audiowide)", color: "#aaa" }}
              data-glitch-target
            >
              Visit us
            </h3>
            <address
              className="not-italic text-sm text-white/70 leading-relaxed"
              style={{ fontFamily: "var(--font-space-mono)" }}
            >
              Newton School of Technology<br />
              Sonipat, Haryana<br />
              Delhi NCR, India
            </address>
          </div>

          <div className="group flex flex-col gap-3">
            <h3
              className="text-xs tracking-[0.25em] uppercase mb-1"
              style={{ fontFamily: "var(--font-audiowide)", color: "#aaa" }}
            >
              Social
            </h3>
            <div className="flex flex-col gap-2">
              {SOCIALS.map(({ label, href, color }) => (
                <a
                  key={label}
                  href={href}
                  className="relative inline-block text-sm text-white/60 hover:text-white transition-all duration-200 w-fit group/link overflow-hidden"
                  style={{ fontFamily: "var(--font-space-mono)" }}
                >
                  {label}
                  <span
                    className="absolute left-0 bottom-0 h-px w-full -translate-x-full group-hover/link:translate-x-0 transition-transform duration-300"
                    style={{ background: color }}
                  />
                </a>
              ))}
            </div>
          </div>

        </div>

        <p
          className="mt-10 text-white/20 text-[10px] tracking-widest"
          style={{ fontFamily: "var(--font-space-mono)" }}
        >
          © PHOTON :: NEWTON SCHOOL OF TECHNOLOGY :: ALL SIGNALS RESERVED
        </p>
      </main>

      <style>{`
        @keyframes contact-bar-sweep {
          0%   { top: -2px; opacity: 0; }
          5%   { opacity: 1; }
          95%  { opacity: 0.6; }
          100% { top: 100vh; opacity: 0; }
        }
        @keyframes contact-line-pulse {
          0%, 100% { opacity: 0.3; transform: scaleX(0.8); }
          50%       { opacity: 1;   transform: scaleX(1); }
        }

        [data-glitch-target][data-glitch="1"] {
          animation: contact-glitch-burst 0.15s steps(2) forwards;
        }
        @keyframes contact-glitch-burst {
          0%  { text-shadow: 4px 0 #0ff, -4px 0 #f0f; transform: translateX(0); }
          33% { text-shadow: -6px 0 #f00, 6px 0 #0ff; transform: translateX(5px) skewX(-2deg); }
          66% { text-shadow: 5px 0 #f0f, -5px 0 #ff0; transform: translateX(-4px); }
          100%{ text-shadow: none; transform: none; }
        }
      `}</style>
    </div>
  );
}
