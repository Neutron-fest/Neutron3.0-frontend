"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useCompetitions } from "@/hooks/api/useCompetitions";
import FeaturedSection from "./FeaturedSection";
import { Calendar, MapPin } from "lucide-react";

export default function FeaturedEvents() {
  const { data: events = [], isLoading } = useCompetitions();

  const featuredEvents = events
    .filter(c => ["EVENT", "WORKSHOP"].includes(c?.eventType || c?.event_type || c?.type))
    .slice(0, 4);

  if (isLoading) {
    return (
      <FeaturedSection title="Events" subtitle="Calibrating Orbits...">
        {[1, 2].map((i) => (
          <div key={i} className="w-full h-24 bg-white/5 rounded-2xl animate-pulse mb-4" />
        ))}
      </FeaturedSection>
    );
  }

  if (featuredEvents.length === 0) return null;

  return (
    <FeaturedSection title="Key Events" subtitle="Upcoming Missions">
      <div className="flex flex-col gap-4">
        {featuredEvents.map((event, idx) => {
          const eventId = event.slug || event.id || event._id;
          const image = event.posterPath || event.image || "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa";
          const date = new Date(event.startTime || event.startDate || event.date || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          
          return (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="relative w-full group"
            >
               <Link href={`/events/${eventId}`} className="flex items-center gap-4 p-3 rounded-2xl bg-white/3 border border-white/10 hover:bg-white/10 hover:border-orange-500/30 transition-all duration-300">
                <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 border border-white/5 shadow-lg relative">
                  <img 
                    src={image} 
                    alt={event.name} 
                    className="w-full h-full object-cover brightness-[0.7] group-hover:scale-110 transition-transform duration-700" 
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-white uppercase tracking-tight truncate group-hover:text-orange-400 transition-colors">
                    {event.name || event.title}
                  </h3>
                  
                  <div className="flex items-center gap-3 mt-1.5 opacity-60">
                    <div className="flex items-center gap-1 text-[10px] uppercase font-mono tracking-widest text-[#ffb84d]">
                      <Calendar size={10} />
                      {date}
                    </div>
                    {event.venue && (
                      <div className="flex items-center gap-1 text-[10px] uppercase font-mono tracking-widest text-white/70">
                        <MapPin size={10} />
                        {event.venue}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 border border-white/10 group-hover:bg-orange-500/20 group-hover:border-orange-500/40 transition-all duration-300">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/40 group-hover:text-orange-400 group-hover:translate-x-0.5 transition-all">
                    <path d="M5 12h14m-7-7l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
      
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 flex justify-center"
      >
        <Link href="/events" className="text-[10px] font-mono uppercase tracking-[0.4em] text-orange-400 border border-orange-500/20 px-8 py-3 rounded-full hover:bg-orange-500/10 hover:border-orange-500/50 transition-all duration-300 backdrop-blur-md shadow-[0_0_20px_rgba(255,140,20,0.1)]">
          Launch Event Catalog
        </Link>
      </motion.div>
    </FeaturedSection>
  );
}
