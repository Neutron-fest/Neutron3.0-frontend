"use client";

import React, { useRef, useState, useCallback, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Ticket, MapPin, Clock, ChevronLeft, ChevronRight } from "lucide-react";

import { EVENTS } from "@/data/events";

const CARD_WIDTH = 250;
const CARD_HEIGHT = 350;
const RADIUS = 600;
const TOTAL = EVENTS.length;
const ANGLE_STEP = 360 / TOTAL;

export function CurvedGallery() {
  const rotationRef = useRef(0);
  const rawRotation = useMotionValue(0);
  const smoothRotation = useSpring(rawRotation, {
    stiffness: 80,
    damping: 25,
    mass: 0.8,
  });

  const [activeIdx, setActiveIdx] = useState(0);
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    return smoothRotation.onChange((v: number) => {
      const normalized = ((-v % 360) + 360) % 360;
      const idx = Math.round(normalized / ANGLE_STEP) % TOTAL;
      setActiveIdx(idx);
    });
  }, []);

  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaX !== 0 ? e.deltaX : e.deltaY;
    rotationRef.current -= delta * 0.08;
    rawRotation.set(rotationRef.current);
    setIsGlitching(true);
    clearTimeout((window as any).__glitchTimer);
    (window as any).__glitchTimer = setTimeout(() => setIsGlitching(false), 300);
  }, []);

  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [handleWheel]);

  const rotateTo = (targetIdx: number) => {
    const newRotation = -(targetIdx * ANGLE_STEP);
    rotationRef.current = newRotation;
    rawRotation.set(newRotation);
  };

  const prev = () => rotateTo(((activeIdx - 1) + TOTAL) % TOTAL);
  const next = () => rotateTo((activeIdx + 1) % TOTAL);

  const dragStartX = useRef(0);
  const dragTotalDelta = useRef(0);
  const isDraggingRef = useRef(false);
  const carouselPointerActiveRef = useRef(false);

  const onPointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest("a[href]")) return;
    carouselPointerActiveRef.current = true;
    dragStartX.current = e.clientX;
    dragTotalDelta.current = 0;
    isDraggingRef.current = false;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!carouselPointerActiveRef.current || !(e.buttons & 1)) return;
    const delta = e.clientX - dragStartX.current;
    dragStartX.current = e.clientX;
    dragTotalDelta.current += Math.abs(delta);
    if (dragTotalDelta.current > 8) {
      if (!isDraggingRef.current) {
        isDraggingRef.current = true;
      }
      rotationRef.current += delta * 0.3;
      rawRotation.set(rotationRef.current);
    }
  };

  const onPointerUp = () => {
    carouselPointerActiveRef.current = false;
    setTimeout(() => {
      isDraggingRef.current = false;
    }, 50);
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden">

      <div className="absolute top-[130px] left-1/2 -translate-x-1/2 z-50 text-center pointer-events-none">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIdx}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-3 text-[10px] font-mono text-white/40 uppercase tracking-[0.5em]"
          >
            <span className="text-cyan-400/70">{EVENTS[activeIdx].category}</span>
            <span className="w-0.5 h-0.5 rounded-full bg-white/20 inline-block" />
            <span>{EVENTS[activeIdx].details}</span>
            <span className="w-0.5 h-0.5 rounded-full bg-white/20 inline-block" />
          </motion.div>
        </AnimatePresence>
      </div>

      <div
        ref={trackRef}
        className="relative w-full flex-1 flex items-center justify-center cursor-grab active:cursor-grabbing select-none"
        style={{ perspective: "1400px", perspectiveOrigin: "50% 50%" }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >

        <motion.div
          style={{
            rotateY: smoothRotation,
            transformStyle: "preserve-3d" as const,
            width: 0,
            height: 0,
            position: "absolute",
            top: "50%",
            left: "50%",
          }}
        >
          {EVENTS.map((eventItem, idx) => {
            const angle = idx * ANGLE_STEP;

            return (
              <div
                key={eventItem.slug}
                style={{
                  position: "absolute",
                  top: `-${CARD_HEIGHT / 2}px`,
                  left: `-${CARD_WIDTH / 2}px`,
                  width: `${CARD_WIDTH}px`,
                  height: `${CARD_HEIGHT}px`,
                  transform: `rotateY(${angle}deg) translateZ(${RADIUS}px)`,
                  transformStyle: "preserve-3d" as const,
                }}
              >
                <GalleryCard
                  {...eventItem}
                  idx={idx}
                  activeIdx={activeIdx}
                  isGlitching={isGlitching}
                  smoothRotation={smoothRotation}
                  angleStep={ANGLE_STEP}
                  isDraggingRef={isDraggingRef}
                />
              </div>
            );
          })}
        </motion.div>

        <div className="absolute inset-y-0 left-0 w-40 bg-linear-to-r from-black to-transparent z-150 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-40 bg-linear-to-l from-black to-transparent z-150 pointer-events-none" />
      </div>

      <div className="absolute bottom-16 md:bottom-24 z-50 flex items-center gap-6 md:gap-100">
        <button
          onClick={prev}
          className="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center border border-white/30 bg-black/80 backdrop-blur-md hover:border-cyan-400 hover:bg-cyan-500/20 hover:scale-110 transition-all duration-300 group rounded-md shadow-[0_5px_15px_rgba(0,0,0,0.5)] hover:shadow-[0_0_20px_rgba(34,211,238,0.4)]"
        >
          <ChevronLeft size={28} className="text-white/80 group-hover:text-cyan-400 group-hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.9)] transition-all" />
        </button>

        <div className="flex gap-3 items-center px-2">
          {EVENTS.map((_, i) => (
            <button
              key={i}
              onClick={() => rotateTo(i)}
              className={`rounded-full transition-all duration-300 ${
                activeIdx === i
                  ? "w-8 h-2.5 bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.9)] scale-110"
                  : "w-2.5 h-2.5 bg-white/40 hover:bg-white/90 hover:shadow-[0_0_8px_rgba(255,255,255,0.6)] hover:scale-110"
              }`}
            />
          ))}
        </div>

        <button
          onClick={next}
          className="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center border border-white/30 bg-black/80 backdrop-blur-md hover:border-cyan-400 hover:bg-cyan-500/20 hover:scale-110 transition-all duration-300 group rounded-md shadow-[0_5px_15px_rgba(0,0,0,0.5)] hover:shadow-[0_0_20px_rgba(34,211,238,0.4)]"
        >
          <ChevronRight size={28} className="text-white/80 group-hover:text-cyan-400 group-hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.9)] transition-all" />
        </button>
      </div>
    </div>
  );
}

type GalleryCardProps = {
  title: string;
  image: string;
  slug: string;
  category: string;
  date: string;
  ticketPrice?: string;
  location?: string;
  time?: string;
  idx: number;
  activeIdx: number;
  isGlitching: boolean;
  smoothRotation: any;
  angleStep: number;
  isDraggingRef: React.MutableRefObject<boolean>;
};

function GalleryCard({
  title,
  image,
  slug,
  category,
  date,
  ticketPrice = "Free",
  location = "Campus",
  time = "TBD",
  idx,
  activeIdx,
  isGlitching,
  smoothRotation,
  angleStep,
  isDraggingRef,
}: GalleryCardProps) {
  const isActive = idx === activeIdx;

  const getDiff = (v: number) => {
    const diff = ((-v - idx * angleStep) % 360 + 360) % 360;
    return Math.min(diff, 360 - diff);
  };

  const scale = useTransform(smoothRotation, (v: number) =>
    Math.max(0.75, 1.05 - getDiff(v) / 140)
  );

  const opacity = useTransform(smoothRotation, (v: number) => {
    const d = getDiff(v);
    return d > 140 ? 0 : Math.max(0.1, 1 - d / 70);
  });

  const imgBrightness = useTransform(smoothRotation, (v: number) =>
    Math.max(0.3, 1 - getDiff(v) / 90)
  );

  return (
    <motion.div
      style={{ scale, opacity }}
      className="relative w-full h-full rounded-xl overflow-hidden border border-white/10 shadow-[0_30px_80px_rgba(0,0,0,0.9)] group"
    >
      <div className="absolute inset-0 z-30 pointer-events-none opacity-[0.12] bg-[linear-gradient(rgba(0,0,0,0)_50%,rgba(0,0,0,0.3)_50%)] bg-size-[100%_3px]" />

      {isGlitching && (
        <div className="absolute inset-0 z-40 pointer-events-none overflow-hidden">
          <div className="absolute inset-0 mix-blend-screen opacity-20 bg-cyan-500/30" />
          <div
            className="absolute inset-0 opacity-30 bg-[linear-gradient(rgba(255,0,0,0.15)_50%,transparent_50%)] bg-size-[100%_4px]"
          />
        </div>
      )}

      {isActive && (
        <>
          <div className="absolute inset-0 z-20 pointer-events-none mix-blend-screen opacity-[0.08]">
            <img src={image} className="w-full h-full object-cover translate-x-[3px] saturate-200 hue-rotate-60" alt="" />
          </div>
          <div className="absolute inset-0 z-20 pointer-events-none mix-blend-screen opacity-[0.08]">
            <img src={image} className="w-full h-full object-cover -translate-x-[3px] saturate-200 hue-rotate-[-60deg]" alt="" />
          </div>
        </>
      )}

      <Link
        href={`/events/${slug}`}
        className="block w-full h-full relative z-5"
        onClick={(e) => {
          if (isDraggingRef.current) e.preventDefault();
        }}
      >
        <motion.div
          className="absolute inset-0"
          style={{ filter: useTransform(imgBrightness, (b) => `brightness(${b}) contrast(1.2)`) }}
        >
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-110 group-hover:animate-[vibrate_0.1s_infinite] transition-transform duration-700"
          />
        </motion.div>

        <div className="absolute inset-0 z-20 pointer-events-none opacity-0 group-hover:opacity-50 transition-opacity duration-75 mix-blend-screen overflow-hidden">
          <div className="absolute inset-0 bg-white/10 animate-[flash_0.05s_infinite]"></div>
          <div className="absolute inset-0 bg-cyan-500/20 translate-x-[4px] mix-blend-color-dodge animate-[vibrate_0.1s_infinite]"></div>
          <div className="absolute inset-0 bg-red-500/20 -translate-x-[4px] mix-blend-color-burn animate-[vibrate_0.15s_infinite_reverse]"></div>
        </div>

        <div className="absolute inset-0 bg-linear-to-t from-black via-black/60 to-black/10 z-10" />

        <div className="absolute top-3 left-3 right-3 z-20 flex justify-between items-center">
          <span className="px-2 py-0.5 text-[7px] font-mono uppercase tracking-[0.2em] bg-black/50 border border-white/10 rounded-sm text-cyan-300 backdrop-blur-sm">
            {category}
          </span>
          <span className="flex items-center gap-1 text-[7px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-sm">
            <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
            Active
          </span>
        </div>

        <div className="absolute bottom-0 left-0 right-0 z-20 px-4 pb-4">

          <div className="overflow-hidden">
            <div className="translate-y-[120%] group-hover:translate-y-0 transition-transform duration-500 ease-out pb-3">
              <div className="flex flex-col gap-2">
                {[
                  { icon: <Ticket size={10} className="text-yellow-400" />, label: "Access", value: ticketPrice },
                  { icon: <MapPin size={10} className="text-blue-400" />, label: "Grid", value: location },
                  { icon: <Clock size={10} className="text-purple-400" />, label: "Time", value: time },
                ].map(({ icon, label, value }) => (
                  <div key={label} className="flex items-center gap-2.5">
                    <div className="flex items-center justify-center shrink-0 w-3 drop-shadow-[0_0_5px_currentColor]">
                      {icon}
                    </div>
                    <div className="flex flex-col justify-center">
                      <span className="text-[6px] font-mono text-white/50 uppercase tracking-[0.2em] leading-none mb-0.5">{label}</span>
                      <span className="text-[9px] font-black tracking-wide text-white uppercase leading-none drop-shadow-md">{value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="h-px bg-linear-to-r from-white/20 via-white/10 to-transparent mb-3" />

          <h2 className="text-[1.35rem] font-black uppercase tracking-tight leading-tight mb-1 group-hover:text-cyan-400 group-hover:animate-[vibrate_0.1s_infinite] transition-colors duration-300 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] relative z-30">
            {title}
          </h2>

          <p className="text-[7px] font-mono text-white/40 uppercase tracking-[0.4em] mb-2">
            Schedule: {date}
          </p>
        </div>

        <div className="absolute top-3 left-3 w-3 h-3 border-l border-t border-white/15 z-20" />
        <div className="absolute top-3 right-3 w-3 h-3 border-r border-t border-white/15 z-20" />
      </Link>
    </motion.div>
  );
}
