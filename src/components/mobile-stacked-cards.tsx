"use client";

import React from "react";
import { motion } from "framer-motion";

interface MobileStackedCardsProps {
  prizePool?: string;
  location?: string;
  teamSize?: string;
}

export const MobileStackedCards: React.FC<MobileStackedCardsProps> = ({
  prizePool = "₹50,000",
  location = "Rishihood University",
  teamSize = "Up to 4 Members",
}) => {
  const cards = [
    {
      title: "Deployment Zone",
      value: location,
      bgImage: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=1600&q=80",
      overlay: "from-black/70 via-black/40 to-black/80",
      textColor: "text-white",
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="opacity-60"
        >
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
          <circle cx="12" cy="10" r="3"></circle>
        </svg>
      ),
      rotate: -4,
      x: -10,
    },
    {
      title: "Mission Bounty",
      value: prizePool,
      bgImage: "https://images8.alphacoders.com/117/thumb-1920-1178623.jpg",
      overlay: "from-black/60 via-red-900/20 to-black/80",
      textColor: "text-white",
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="opacity-60"
        >
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M12 6v6l4 2"></path>
        </svg>
      ),
      rotate: 2,
      x: 10,
    },
    {
      title: "Crew Formation",
      value: teamSize,
      bgImage: "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?w=1600&q=80",
      overlay: "from-black/70 via-blue-950/30 to-black/80",
      textColor: "text-white",
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="opacity-60"
        >
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      ),
      rotate: -1,
      x: 0,
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 space-y-[-160px] md:hidden">
      {cards.map((card, i) => (
        <motion.div
          key={i}
          initial={{ y: 100, opacity: 0, rotate: card.rotate * 2 }}
          whileInView={{ y: 0, opacity: 1, rotate: card.rotate }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{
            duration: 1,
            delay: i * 0.1,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="relative w-full max-w-[340px] aspect-4/5 rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.7)] border border-white/10 overflow-hidden flex flex-col justify-between"
          style={{
            zIndex: i,
            marginLeft: `${card.x}px`,
          }}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${card.bgImage}')` }}
          />
          <div className={`absolute inset-0 bg-linear-to-b ${card.overlay}`} />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
              backgroundRepeat: "repeat",
              backgroundSize: "128px 128px",
              opacity: 0.18,
              mixBlendMode: "overlay",
            }}
          />

          <div className="relative z-10 flex justify-between items-start p-10">
          </div>

          {/* Text content */}
          <div className="relative z-10 p-10 pt-0">
            <h3 className="text-4xl font-bold tracking-tighter leading-tight mb-4 text-white uppercase wrap-break-word drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
              {card.value}
            </h3>
            <p className="text-[10px] font-mono uppercase tracking-[0.4em] text-white/50">
              {card.title}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
