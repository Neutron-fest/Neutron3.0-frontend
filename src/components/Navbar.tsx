"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
export default function Navbar() {
  const [hovered, setHovered] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const links = [
    { name: "Competitions", href: "/competitions" },
    { name: "Events", href: "/events" },
    { name: "About Us", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const prevBodyOverflowX = document.body.style.overflowX;
    const prevHtmlOverflowX = document.documentElement.style.overflowX;
    const prevBodyOverscrollX = document.body.style.overscrollBehaviorX;
    const prevHtmlOverscrollX = document.documentElement.style.overscrollBehaviorX;

    if (isMenuOpen) {
      document.body.style.overflowX = "hidden";
      document.documentElement.style.overflowX = "hidden";
      document.body.style.overscrollBehaviorX = "none";
      document.documentElement.style.overscrollBehaviorX = "none";
    }

    return () => {
      document.body.style.overflowX = prevBodyOverflowX;
      document.documentElement.style.overflowX = prevHtmlOverflowX;
      document.body.style.overscrollBehaviorX = prevBodyOverscrollX;
      document.documentElement.style.overscrollBehaviorX = prevHtmlOverscrollX;
    };
  }, [isMenuOpen]);

  return (
    <header className="fixed inset-x-0 top-0 w-screen max-w-[100vw] z-300 pointer-events-auto mix-blend-difference group/nav overflow-x-clip overscroll-x-none">
      <div className="w-full max-w-[100vw] box-border flex items-center justify-between px-5 sm:px-8 lg:px-12 py-5 sm:py-6 lg:py-8">
      
        <Link href="/" className="flex items-center gap-3 drop-shadow-[0_0_10px_rgba(255,255,255,0.2)] hover:scale-105 transition-transform duration-300">
        <span className="font-audiowide text-[1.05rem] sm:text-[1.2rem] lg:text-[1.35rem] italic font-black tracking-wider text-white">
          PHOTON
        </span>
      </Link>

      <nav className="hidden lg:flex items-center gap-10">
        {links.map((link) => {
          const isActive = pathname.startsWith(link.href);
          
          return (
            <Link
              key={link.name}
              href={link.href}
              onMouseEnter={() => setHovered(link.name)}
              onMouseLeave={() => setHovered(null)}
              className="relative font-orbitron text-[14px] font-medium tracking-wide transition-colors duration-200"
            >
              <span className={`
                ${hovered === link.name ? 'opacity-0' : 'opacity-100'} 
                ${isActive ? 'text-white drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]' : 'text-white/80'} 
                hover:text-white transition-all
              `}>
                {link.name}
              </span>

              {hovered === link.name && (
                <span className="absolute inset-0 flex items-center justify-center animate-[vibrate_0.1s_infinite]">
                  <span className="absolute inset-0 text-cyan-400 translate-x-px mix-blend-screen">{link.name}</span>
                  <span className="absolute inset-0 text-red-500 -translate-x-px mix-blend-screen">{link.name}</span>
                  <span className="text-white relative z-10">{link.name}</span>
                </span>
              )}

              <span className="absolute -bottom-2 left-0 w-full h-px bg-white/40 opacity-0 group-hover/nav:opacity-100 transition-opacity duration-500 pointer-events-none" />
              <span 
                className="absolute -bottom-2 left-1/2 -translate-x-1/2 h-px bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)] transition-all duration-300" 
                style={{ width: (hovered === link.name || isActive) ? '100%' : '0%' }}
              />
            </Link>
          );
        })}
      </nav>

      <button
        type="button"
        onClick={() => setIsMenuOpen((prev) => !prev)}
        aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={isMenuOpen}
        className="lg:hidden inline-flex items-center justify-center w-11 h-11 border border-white/35 bg-black/40 text-white hover:text-cyan-300 hover:border-cyan-300/80 transition-colors backdrop-blur-sm shadow-[0_0_20px_rgba(0,0,0,0.35)]"
      >
        {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>
      </div>

      {isMenuOpen && (
        <div className="lg:hidden absolute top-full inset-x-0 px-5 sm:px-8 pt-1 box-border max-w-[100vw] overflow-x-hidden">
          <nav className="relative w-full max-w-full box-border border border-white/20 bg-black/70 backdrop-blur-md shadow-[0_18px_40px_rgba(0,0,0,0.55)] max-h-[calc(100dvh-92px)] sm:max-h-[calc(100dvh-108px)] overflow-y-auto overscroll-y-contain overflow-x-hidden">
            <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px)] bg-size-[100%_3px]" />
            <div className="relative z-10 py-2">
              {links.map((link) => {
                const isActive = pathname.startsWith(link.href);

                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`block px-4 sm:px-5 py-3.5 sm:py-4 font-orbitron text-[0.9rem] sm:text-[0.98rem] uppercase tracking-[0.18em] border-b border-white/10 last:border-b-0 transition-colors ${
                      isActive
                        ? "text-cyan-300 bg-cyan-500/10"
                        : "text-white/90 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>
          </nav>
        </div>
      )}

    </header>
  );
}
