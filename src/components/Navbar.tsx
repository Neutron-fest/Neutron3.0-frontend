"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
export default function Navbar() {
  const [hovered, setHovered] = useState<string | null>(null);
  const pathname = usePathname();

  const links = [
    { name: "Competitions", href: "/competitions" },
    { name: "Events", href: "/events" },
    { name: "About Us", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-300 flex items-center justify-between px-12 py-8 pointer-events-auto mix-blend-difference group/nav">
      
      <Link href="/" className="flex items-center gap-3 drop-shadow-[0_0_10px_rgba(255,255,255,0.2)] hover:scale-105 transition-transform duration-300">
        <span className="font-audiowide text-[1.35rem] italic font-black tracking-wider text-white">
          PHOTON
        </span>
      </Link>

      <nav className="flex items-center gap-10">
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

    </header>
  );
}
