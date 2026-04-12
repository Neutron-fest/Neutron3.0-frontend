"use client";

import React, { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ChevronLeft, ArrowRight, List, Cpu, Network, MapPin, Clock, Ticket } from "lucide-react";
import { EVENTS } from "@/data/events";
import EventRulesModal from "@/components/events/EventRulesModal";

export default function EventSlugPage() {
  const params = useParams();
  const slug = typeof params?.slug === "string" ? params.slug : "";
  const event = EVENTS.find(e => e.slug === slug);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [isRulesModalOpen, setIsRulesModalOpen] = useState(false);
  const [glitchPhase, setGlitchPhase] = useState(0);
  const wheelDeltaRef = useRef(0);
  const wheelRafRef = useRef<number | null>(null);
  const pointerDownRef = useRef(false);
  const dragAxisRef = useRef<"none" | "x" | "y">("none");
  const dragStartXRef = useRef(0);
  const dragStartYRef = useRef(0);
  const dragScrollLeftRef = useRef(0);

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest('[data-rules-scroll="true"]')) {
        return;
      }

      e.preventDefault();
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      const modeFactor = e.deltaMode === 1 ? 18 : e.deltaMode === 2 ? window.innerWidth : 1;
      wheelDeltaRef.current += delta * modeFactor * 1.35;

      if (wheelRafRef.current !== null) return;
      wheelRafRef.current = window.requestAnimationFrame(() => {
        el.scrollLeft += wheelDeltaRef.current;
        wheelDeltaRef.current = 0;
        wheelRafRef.current = null;
      });
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      el.removeEventListener("wheel", onWheel);
      if (wheelRafRef.current !== null) {
        window.cancelAnimationFrame(wheelRafRef.current);
      }
      wheelRafRef.current = null;
      wheelDeltaRef.current = 0;
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setGlitchPhase(prev => (prev + 1) % 4);
    }, 150);
    return () => clearInterval(interval);
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    if (!scrollContainerRef.current) return;
    pointerDownRef.current = true;
    dragAxisRef.current = "none";
    dragStartXRef.current = e.pageX - scrollContainerRef.current.offsetLeft;
    dragStartYRef.current = e.pageY;
    dragScrollLeftRef.current = scrollContainerRef.current.scrollLeft;
    setStartX(dragStartXRef.current);
    setScrollLeft(dragScrollLeftRef.current);
    setIsDragging(false);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!pointerDownRef.current || !scrollContainerRef.current) return;

    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const dx = x - dragStartXRef.current;
    const dy = e.pageY - dragStartYRef.current;

    if (dragAxisRef.current === "none") {
      if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return;
      dragAxisRef.current = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
      if (dragAxisRef.current === "x") {
        setIsDragging(true);
      }
    }

    if (dragAxisRef.current !== "x") return;

    e.preventDefault();
    const walk = dx * 3;
    scrollContainerRef.current.scrollLeft = dragScrollLeftRef.current - walk;
  };

  const onPointerUp = () => {
    pointerDownRef.current = false;
    dragAxisRef.current = "none";
    setIsDragging(false);
  };

  if (!event) {
    return (
      <main className="h-screen w-full bg-[#030303] flex items-center justify-center text-white font-mono uppercase tracking-[0.2em] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://res.cloudinary.com/dyd911kmh/image/upload/v1640050115/glitch_u4q1zq.gif')] pointer-events-none" />
        <div className="text-center relative z-10 px-6">
          <p className="text-cyan-500 mb-4 animate-pulse">ERROR_CODE:_404 // NULL_POINTER</p>
          <h1 className="text-4xl md:text-6xl font-black mb-8 border-y border-white/20 py-4">Data Link Severed.</h1>
          <Link href="/events" className="group flex items-center justify-center gap-3 text-white/50 hover:text-cyan-400 transition-colors">
            <ChevronLeft className="group-hover:-translate-x-2 transition-transform" />
            RE-ESTABLISH CONNECTION
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="relative w-full h-screen bg-[#030303] text-white font-mono overflow-hidden selection:bg-cyan-500/30">
      
      <div className="fixed inset-0 pointer-events-none z-100 opacity-[0.03] contrast-200 brightness-200 bg-[url('https://res.cloudinary.com/dyd911kmh/image/upload/v1640050115/glitch_u4q1zq.gif')]"></div>
      <div className="fixed inset-0 pointer-events-none z-110 opacity-[0.15] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.5)_50%)] bg-size-[100%_4px]"></div>
      <div className="fixed inset-0 pointer-events-none z-120 bg-[radial-gradient(circle_at_50%_50%,transparent_0%,rgba(0,0,0,0.6)_100%)]"></div>

      <div 
        ref={scrollContainerRef}
        data-lenis-prevent="true"
        className={`w-full h-full overflow-x-auto overflow-y-hidden flex items-center px-12 md:px-32 gap-20 md:gap-48 relative z-20 overscroll-x-contain ${isDragging ? "cursor-grabbing select-none" : "cursor-grab"}`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        style={{ scrollBehavior: "auto", overscrollBehaviorX: "contain" }}
      >
        
        <div className="w-[85vw] md:w-[75vw] lg:w-[65vw] shrink-0 flex flex-col justify-center h-full relative">
          
          <div className="text-cyan-400/80 text-[0.9rem] sm:text-[1.1rem] md:text-[1.25rem] lg:text-[1.5rem] uppercase tracking-[0.5em] mb-4 font-bold flex items-center gap-4">
              <span className="w-8 h-px bg-cyan-500" />
              {event.category}
          </div>

          <div className="relative group">
            <h1 className="text-[3.5rem] sm:text-[5rem] md:text-[7rem] lg:text-[9rem] leading-[0.85] font-black tracking-tighter uppercase relative cursor-default">
                <span className="relative z-10">{event.title}</span>
                
                <span className={`absolute inset-0 text-cyan-500/30 z-0 mix-blend-screen transition-transform duration-75 ${glitchPhase === 1 ? 'translate-x-2 -translate-y-1' : 'translate-x-0'}`} aria-hidden="true">
                    {event.title}
                </span>
                <span className={`absolute inset-0 text-magenta-500/30 z-0 mix-blend-screen transition-transform duration-75 ${glitchPhase === 2 ? '-translate-x-2 translate-y-1' : 'translate-x-0'}`} aria-hidden="true">
                    {event.title}
                </span>
            </h1>
          </div>

          <div className="mt-8 md:mt-12 max-w-2xl border-l-4 border-white/20 pl-8 space-y-4">
              <p className="text-[0.95rem] sm:text-[1.2rem] md:text-[1.4rem] lg:text-[1.6rem] leading-[1.4] text-white/70 italic">
                "{event.details}"
              </p>
          </div>
        </div>

        <div className="w-[85vw] md:w-[65vw] lg:w-[55vw] h-[65vh] md:h-[75vh] shrink-0 relative group">
          <div className="absolute -top-4 -left-4 w-12 h-12 border-t-2 border-l-2 border-cyan-500 transition-all group-hover:w-16 group-hover:h-16" />
          <div className="absolute -bottom-4 -right-4 w-12 h-12 border-b-2 border-r-2 border-magenta-500 transition-all group-hover:w-16 group-hover:h-16" />

          <div className="absolute inset-0 z-20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity bg-[linear-gradient(transparent_45%,rgba(6,182,212,0.2)_50%,transparent_55%)] bg-size-[100%_200%] animate-scan" />

          <div className="relative w-full h-full overflow-hidden border border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.8)]">
            <img 
                src={event.image} 
                alt={event.title} 
                className="object-cover w-full h-full grayscale group-hover:grayscale-0 contrast-125 brightness-75 group-hover:brightness-105 transition-all duration-500 group-hover:scale-110"
                draggable={false}
            />
            <div className="absolute inset-0 z-10 pointer-events-none mix-blend-screen opacity-0 group-hover:opacity-40 overflow-hidden">
                <img src={event.image} className="absolute inset-0 w-full h-full object-cover translate-x-2 text-cyan-500 filter invert" alt="" />
                <img src={event.image} className="absolute inset-0 w-full h-full object-cover -translate-x-2 text-magenta-500" alt="" />
            </div>
          </div>
          
          <div className="absolute -bottom-10 left-0 text-[10px] font-bold text-white/30 tracking-widest uppercase flex items-center gap-4 w-full">
              <span>SCAN_ID: 0x99A_FF2</span>
              <div className="h-px flex-1 bg-white/10" />
              <span>FOCAL_LENGTH_DETECTOR: AR-12</span>
          </div>
        </div>

        <div className="w-[85vw] md:w-[60vw] lg:w-[50vw] shrink-0 flex flex-col justify-center h-full relative">
           <div className="relative">
                <div className="text-[1.05rem] sm:text-[1.3rem] md:text-[1.6rem] lg:text-[1.95rem] leading-[1.2] font-black uppercase tracking-tight text-white mb-8 md:mb-10">
                    {event.description}
                </div>
                
                <ul className="space-y-3 sm:space-y-4 md:space-y-5 max-w-xl">
                    {event.highlights.map((h, i) => (
                        <li key={i} className="flex items-start gap-4 text-white/60 text-[0.85rem] sm:text-[0.95rem] md:text-[1.1rem] lg:text-[1.2rem]">
                            <span className="text-cyan-500 mt-1 font-black shrink-0">»</span>
                            <span className="border-b border-transparent hover:border-cyan-500/30 transition-colors cursor-default">{h}</span>
                        </li>
                    ))}
                </ul>
           </div>
        </div>

        <div className="w-[85vw] md:w-[65vw] lg:w-[60vw] shrink-0 flex flex-col justify-center h-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-10 relative">
                <div className="hidden sm:block absolute top-1/2 left-0 w-full h-px bg-white/5 -translate-y-1/2" />
                <div className="hidden sm:block absolute left-1/2 top-0 w-px h-full bg-white/5 -translate-x-1/2" />

                {[
                   { icon: Ticket, label: "ACCESS_CODE", value: event.ticketPrice, color: "text-cyan-400" },
                   { icon: MapPin, label: "GRID_NODE", value: event.location, color: "text-magenta-400" },
                   { icon: Clock, label: "TEMPORAL_OFFSET", value: event.time, color: "text-yellow-400" },
                   { icon: Cpu, label: "EXECUTION_TIMESTAMP", value: event.date, color: "text-emerald-400" }
                ].map((item, i) => (
                    <div key={i} className="group p-6 md:p-8 border border-white/5 bg-white/5 backdrop-blur-sm relative overflow-hidden transition-all hover:bg-white/10 hover:border-white/20">
                        <div className="absolute top-0 right-0 w-8 h-8 flex items-center justify-center">
                            <div className="w-1.5 h-1.5 bg-white/20 rounded-full" />
                        </div>

                        <div className="flex items-center gap-4 mb-3 md:mb-4">
                            <span className="text-[8px] sm:text-[9px] md:text-[10px] font-bold text-white/40 tracking-[0.3em] uppercase">{item.label}</span>
                        </div>
                        <div className="text-[1.6rem] sm:text-[2rem] md:text-[2.6rem] lg:text-[3rem] font-black uppercase leading-none tracking-tighter truncate">
                            {item.value}
                        </div>
                    </div>
                ))}
            </div>
        </div>

        <div className="w-[90vw] md:w-[75vw] lg:w-[65vw] shrink-0 flex flex-col justify-center h-full mr-12 md:mr-24">
            <div className="relative bg-[#0A0A0A] border border-white/10 p-8 md:p-12 lg:p-20 overflow-hidden group/final max-h-[85dvh] md:max-h-[80dvh] overflow-y-auto overscroll-y-contain custom-scrollbar" 
              data-rules-scroll="true"
              style={{ WebkitOverflowScrolling: "touch", touchAction: "pan-y" }}
              onWheel={(e) => {
                const el = e.currentTarget;
                const atTop = el.scrollTop <= 0;
                const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 1;
                const isScrollingUp = e.deltaY < 0;
                const isScrollingDown = e.deltaY > 0;

                if ((atTop && isScrollingUp) || (atBottom && isScrollingDown)) {
                  e.preventDefault();
                }

                e.stopPropagation();
              }}
            >
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-size-[40px_40px] z-0" />
                
                <div className="relative z-10 flex flex-col items-center text-center">
                    <div className="flex items-center gap-3 mb-6 md:mb-8 opacity-60">
                         <span className="h-0.5 w-8 md:w-12 bg-magenta-500" />
                         <span className="text-[7px] sm:text-[8px] md:text-[9px] lg:text-[10px] uppercase tracking-[0.5em] font-bold text-magenta-500">INITIATE_PROTOCOL</span>
                         <span className="h-0.5 w-8 md:w-12 bg-magenta-500" />
                    </div>

                    <h2 className="text-[2rem] sm:text-[3rem] md:text-[4.5rem] lg:text-[5.5rem] font-black leading-[0.9] uppercase mb-8 md:mb-12 max-w-4xl cursor-default">
                        WANT TO <span className="text-cyan-500 underline decoration-cyan-500/30 underline-offset-4 md:underline-offset-8">ENTER</span> THE NETWORK?
                    </h2>

                    <div className="flex flex-col sm:flex-row gap-6 md:gap-8 items-center">
                        <button
                          onClick={() => setIsRulesModalOpen(true)}
                          className="flex items-center gap-3 md:gap-4 px-6 md:px-8 py-2.5 md:py-3 lg:py-4 border border-white/20 hover:border-cyan-500 hover:bg-cyan-500/10 transition-all font-bold uppercase tracking-widest text-[0.7rem] sm:text-[0.8rem] md:text-[0.9rem] group/rules active:scale-95"
                        >
                          <List className="w-4 h-4 md:w-5 md:h-5 group-hover/rules:rotate-12 transition-transform" />
                          VIEW_RULES
                        </button>

                        <button 
                          className="group/btn relative px-8 md:px-12 py-2.5 md:py-3 lg:py-4 bg-white text-black font-black uppercase tracking-widest md:tracking-[0.2em] text-[0.8rem] sm:text-[0.9rem] md:text-[1rem] lg:text-[1.2rem] overflow-hidden active:scale-95 transition-transform"
                        >
                            <span className="relative z-10 flex items-center gap-2 md:gap-4">
                                EXECUTE_NOW <ArrowRight className="group-hover/btn:translate-x-2 md:group-hover/btn:translate-x-3 transition-transform w-4 h-4 md:w-5 md:h-5" />
                            </span>
                            <div className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full bg-cyan-500/20 transition-transform duration-500 ease-in-out" />
                        </button>
                    </div>

                    <div className="mt-10 md:mt-16 text-[7px] sm:text-[8px] md:text-[9px] text-white/20 tracking-[0.6em] md:tracking-[0.8em] font-bold">
                        SYSTEM_AUTH_REQUIRED // SESSION: 0x9212
                    </div>
                </div>
            </div>
        </div>

      </div>

      <EventRulesModal 
        isOpen={isRulesModalOpen} 
        onClose={() => setIsRulesModalOpen(false)} 
        rules={event.rules} 
        title={event.title}
      />

      <div className="absolute bottom-6 md:bottom-8 left-6 md:left-12 right-6 md:right-12 flex justify-between items-center z-30 pointer-events-none opacity-40">
        <div className="flex items-center gap-3 md:gap-4">
            <span className="text-[7px] sm:text-[8px] md:text-[9px] font-bold text-cyan-500 tracking-[0.2em] animate-pulse">DRAG_TO_EXPLORE</span>
            <div className="h-px w-24 md:w-48 bg-cyan-500/20" />
        </div>
        <div className="font-mono text-[7px] sm:text-[8px] md:text-[9px] text-white/50 tracking-[0.4em]">
            PHOTON_OS // v2.0.4
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(34, 211, 238, 0.4);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(34, 211, 238, 0.6);
        }
        .animate-scan {
            animation: scan 4s linear infinite;
        }
        @keyframes scan {
            from { transform: translateY(-100%); }
            to { transform: translateY(100%); }
        }
        .animate-spin-slow {
            animation: spin 8s linear infinite;
        }
        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
      `}</style>
    </main>
  );
}
