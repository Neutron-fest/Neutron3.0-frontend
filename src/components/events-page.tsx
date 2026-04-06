"use client";

import React, { useRef, useEffect, useState, useMemo } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
  useSpring,
} from "framer-motion";
import Link from "next/link";
import BlurHeading from "./blur-heading";
import { Filter, ChevronDown, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { useCompetitions } from "@/hooks/api/useCompetitions";
import { playSciFiClick } from "./audio-controller";
import { Globe3D } from "@/components/ui/3d-globe";

// ============================================================================
// Space Backdrop Component
// ============================================================================

const SpaceBackdrop = () => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#0a0a1a_0%,#000000_100%)]" />
      <div 
        className="absolute inset-0 opacity-40 bg-no-repeat overflow-auto bg-size-cover"
        style={{
          backgroundImage: `url('https://ik.imagekit.io/yatharth/BG-NEUTRI_C.png')`,
        }}
      />
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-900/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-900/10 rounded-full blur-[100px]" />

      <div className="absolute bottom-[-10%] md:bottom-[-45%] left-1/2 -translate-x-1/2 w-[140%] aspect-square max-w-[1200px] opacity-80 mix-blend-screen pointer-events-auto">
        <Globe3D 
          className="w-full h-full"
          // texture="venus"
          config={{
            radius: 2,
            autoRotateSpeed: 0.5,
            showAtmosphere: false,
            atmosphereIntensity: 0,
            bumpScale: 3,
          }}
        />
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-[30vh] bg-linear-to-t from-black to-transparent z-10" />
    </div>
  );
};

// ============================================================================
// Polaroid Card Component
// ============================================================================

type CardProps = {
  title: string;
  image: string;
  slug: string;
  category: string;
  date: string;
  index: number;
  total: number;
  scrollToCard: (idx: number) => void;
};

function PolaroidCard({ title, image, slug, category, date, index, total, scrollToCard }: CardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 30,
    restDelta: 0.0005
  });

  // Orbital Transform Logic
  const x = useTransform(smoothProgress, [0, 0.5, 1], ["100vw", "0vw", "-100vw"]);
  const y = useTransform(smoothProgress, [0, 0.5, 1], [60, 0, 60]); 
  const z = useTransform(smoothProgress, [0.4, 0.5, 0.6], [-100, 100, -100]);
  const rotateX = useTransform(smoothProgress, [0, 0.5, 1], [15, 0, -15]); 
  const rotateY = useTransform(smoothProgress, [0, 0.5, 1], [18, 0, -18]); 
  const rotateZ = useTransform(smoothProgress, [0, 0.5, 1], [10, 0, -10]); 
  const scale = useTransform(smoothProgress, [0, 0.5, 1], [0.85, 1.1, 0.85]); 
  const opacity = useTransform(smoothProgress, [0, 0.15, 0.5, 0.85, 1], [0, 1, 1, 1, 0]);

  return (
    <div ref={containerRef} className="h-screen w-full flex items-center justify-center relative perspective-[2000px] pointer-events-none">
      <motion.div
        style={{
          x,
          y,
          z,
          rotateX,
          rotateY,
          rotateZ,
          scale,
          opacity,
          transformStyle: "preserve-3d",
        }}
        className="relative w-[300px] md:w-[420px] aspect-3/4 shadow-[0_40px_100px_rgba(0,0,0,0.95)] rounded-2xl group pointer-events-auto overflow-hidden border border-white/10"
      >
        <div className="absolute inset-0 pointer-events-none opacity-[0.035] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-50 bg-size-[100%_2px,3px_100%]" />

        <Link href={`/events/${slug}`} onClick={playSciFiClick} className="block w-full h-full">

          <div className="absolute inset-0">
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover brightness-[0.55] contrast-[1.15] transition-all duration-700 group-hover:scale-105 group-hover:brightness-[0.72]"
            />
          </div>

          <div className="absolute inset-0 bg-linear-to-t from-black/95 via-black/50 to-black/20 z-10" />

          <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-[9px] font-mono uppercase tracking-[0.2em] text-white/85 bg-white/10 backdrop-blur-md border border-white/20 shadow-[0_2px_16px_rgba(0,0,0,0.5)]">
              {category}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-mono uppercase tracking-[0.2em] text-emerald-300 bg-emerald-500/10 backdrop-blur-md border border-emerald-500/30 shadow-[0_0_14px_rgba(52,211,153,0.18)]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Active
            </span>
          </div>

          <div className="absolute bottom-0 left-0 right-0 z-20 px-5 pb-6 md:px-7 md:pb-8">
            <h2 className="font-sans font-black text-[1.85rem] md:text-[2.6rem] text-white uppercase tracking-tight leading-[0.88] drop-shadow-[0_0_20px_rgba(255,255,255,0.18)] group-hover:drop-shadow-[0_0_32px_rgba(255,200,80,0.5)] transition-all duration-500 mb-2">
              {title}
            </h2>

            <p className="text-[9px] md:text-[10px] font-mono text-white/35 uppercase tracking-[0.4em]">
              {date}
            </p>

            <div className="mt-4 h-px bg-linear-to-r from-white/25 via-white/8 to-transparent" />

            <p className="mt-3 text-[9px] md:text-[10px] font-mono text-white/35 uppercase tracking-[0.3em]">
              Tap to explore mission
            </p>
          </div>

          <div className="absolute top-3 left-3 w-4 h-4 border-l border-t border-white/25 z-20" />
          <div className="absolute top-3 right-3 w-4 h-4 border-r border-t border-white/25 z-20" />
          <div className="absolute bottom-3 left-3 w-4 h-4 border-l border-b border-white/25 z-20" />
          <div className="absolute bottom-3 right-3 w-4 h-4 border-r border-b border-white/25 z-20" />

          <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ring-1 ring-inset ring-white/20 shadow-[inset_0_0_60px_rgba(255,200,80,0.05)] z-30 pointer-events-none" />
        </Link>
        <div className="absolute top-1/2 -left-12 -right-12 md:-left-16 md:-right-16 -translate-y-1/2 flex justify-between items-center z-50 px-2 pointer-events-none">
          <button
            onClick={(e) => { e.stopPropagation(); playSciFiClick(); scrollToCard(index - 1); }}
            className={`w-10 h-10 flex items-center justify-center rounded-full bg-black/60 border border-white/15 text-white/70 transition-all hover:bg-white/10 hover:border-white/40 hover:scale-110 pointer-events-auto backdrop-blur-md ${index === 0 ? 'opacity-0 cursor-default' : 'opacity-50 hover:opacity-100'}`}
            disabled={index === 0}
          >
            <ChevronLeft size={18} strokeWidth={1.5} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); playSciFiClick(); scrollToCard(index + 1); }}
            className={`w-10 h-10 flex items-center justify-center rounded-full bg-black/60 border border-white/15 text-white/70 transition-all hover:bg-white/10 hover:border-white/40 hover:scale-110 pointer-events-auto backdrop-blur-md ${index === total - 1 ? 'opacity-0 cursor-default' : 'opacity-50 hover:opacity-100'}`}
            disabled={index === total - 1}
          >
            <ChevronRight size={18} strokeWidth={1.5} />
          </button>
        </div>
      </motion.div>
    </div>
  );
}


export default function EventsPage() {
  const {
    data: events = [],
    isLoading,
    isError,
    refetch,
  } = useCompetitions();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  
  const filterRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const categories = useMemo(() => {
    const cats = Array.from(
      new Set(
        events
          .map((c) => c?.category)
          .filter((category): category is string => Boolean(category)),
      ),
    );
    return ["All Categories", ...cats];
  }, [events]);

  const filteredEvents = useMemo(() => {
    let result = [...events];
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter((c) => {
        const title = String(c?.title || c?.name || "").toLowerCase();
        const category = String(c?.category || "").toLowerCase();
        return title.includes(query) || category.includes(query);
      });
    }
    if (selectedCategory !== "All Categories") {
      result = result.filter((c) => c?.category === selectedCategory);
    }
    // Filter to show only events with eventType: EVENT or WORKSHOP
    result = result.filter(
      (c) =>
        ["EVENT", "WORKSHOP"].includes(c?.eventType) ||
        ["EVENT", "WORKSHOP"].includes(c?.event_type) ||
        ["EVENT", "WORKSHOP"].includes(c?.type)
    );
    return result;
  }, [searchQuery, selectedCategory, events]);

  const scrollToCard = (idx: number) => {
    if (idx < 0 || idx >= filteredEvents.length) return;
    const headerOffset = window.innerHeight * 0.3; // matches the pt-[30vh]
    const targetY = (idx * window.innerHeight) + headerOffset;
    window.scrollTo({
      top: targetY,
      behavior: "smooth"
    });
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white/20 relative overflow-x-hidden">
      <SpaceBackdrop />

      <div className="fixed top-6 left-6 z-50 flex flex-row items-center gap-4">
        <Link href="/" onClick={playSciFiClick}>
          <img
            src="https://ik.imagekit.io/yatharth/neutron_clean.png"
            alt="Logo"
            className="h-10 w-30 md:h-10 md:w-30 opacity-90 transition-transform duration-300 hover:scale-110 drop-shadow-[0_0_15px_rgba(255,200,80,0.4)]"
          />
        </Link>
        <Link
          href="/?phase=planets"
          onClick={playSciFiClick}
          className="group flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 rounded-full backdrop-blur-md transition-all hover:bg-white/15 hover:border-white/30"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="group-hover:-translate-x-1 transition-transform duration-300">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="text-[9px] font-mono uppercase tracking-widest text-white/70 group-hover:text-white transition-colors">Planets</span>
        </Link>
      </div>

      <header className="fixed top-0 left-0 right-0 z-40 pointer-events-none pt-12 md:pt-24 pb-12 flex flex-col items-center">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2 }}>
          <BlurHeading text={"EVENTS"} className="text-4xl mt-10 md:text-7xl lg:text-[6rem] font-bold uppercase tracking-[-0.03em] leading-[0.92] drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]" />
        </motion.div>
      </header>

      <main className="relative z-10">
        {isLoading ? (
          <div className="h-screen flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              <span className="font-mono text-[10px] tracking-[0.5em] text-white/40 uppercase">CALIBRATING...</span>
            </div>
          </div>
        ) : (
          <div className="h-full pt-[30vh]">
            {filteredEvents.length > 0 ? (
              filteredEvents.map((event, idx) => {
                const eventId = event.slug || event.id || event._id || String(idx);
                const title = event.title || event.name || "Untitled Event";
                const image = event.posterPath || event.image || "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa";
                const date = new Date(event.startTime || event.startDate || event.date || event.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

                return (
                  <PolaroidCard
                    key={String(eventId)}
                    title={title}
                    image={image}
                    slug={eventId}
                    category={event.category || "General"}
                    date={date}
                    index={idx}
                    total={filteredEvents.length}
                    scrollToCard={scrollToCard}
                  />
                );
              })
            ) : (
              <div className="h-screen flex items-center justify-center">
                 <span className="font-mono text-[10px] tracking-[0.5em] text-white/40 uppercase">NO MISSIONS DETECTED</span>
              </div>
            )}
            <div className="h-[50vh]" />
          </div>
        )}
      </main>

      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-2 pointer-events-none opacity-40">
        <span className="text-[8px] font-mono tracking-[0.4em] uppercase">SCROLL TO ORBIT</span>
        <div className="w-px h-12 bg-linear-to-b from-white to-transparent" />
      </div>
    </div>
  );
}
