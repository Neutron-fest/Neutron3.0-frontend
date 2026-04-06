"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useCompetitions } from "@/hooks/api/useCompetitions";
import FeaturedSection from "./FeaturedSection";

export default function FeaturedCompetitions() {
  const { data: competitions = [], isLoading } = useCompetitions();

  const featuredCompetitions = competitions
    .filter(c => !["EVENT", "WORKSHOP"].includes(c?.eventType || c?.event_type || c?.type))
    .slice(0, 6);

  if (isLoading) {
    return (
      <FeaturedSection title="Competitions" subtitle="Loading Missions...">
        <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide">
          {[1, 2, 3].map((i) => (
            <div key={i} className="min-w-[280px] h-[360px] bg-white/5 rounded-2xl animate-pulse" />
          ))}
        </div>
      </FeaturedSection>
    );
  }

  if (featuredCompetitions.length === 0) return null;

  return (
    <FeaturedSection title="Featured Missions" subtitle="Active Competitions">
      <div className="flex gap-4 overflow-x-auto pb-6 -mx-6 px-6 scrollbar-hide snap-x">
        {featuredCompetitions.map((comp, idx) => {
          const compId = comp.slug || comp.id || comp._id;
          const image = comp.posterPath || comp.image || "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa";
          
          return (
            <motion.div 
              key={compId}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="min-w-[280px] h-[360px] relative rounded-3xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.5)] border border-white/10 group snap-center"
            >
              <Link href={`/competitions/${compId}`} className="block w-full h-full relative">
                <img 
                  src={image} 
                  alt={comp.name} 
                  className="w-full h-full object-cover brightness-[0.45] transition-all duration-700 group-hover:scale-110 group-hover:brightness-[0.6]" 
                />
                
                <div className="absolute inset-0 bg-linear-to-t from-black/90 via-transparent to-transparent" />
                
                <div className="absolute bottom-0 left-0 w-full p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[8px] font-mono uppercase tracking-widest px-2 py-0.5 bg-orange-500/20 text-orange-400 border border-orange-500/30 rounded-full">
                      {comp.category || "General"}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-white uppercase leading-tight tracking-tighter drop-shadow-lg group-hover:text-orange-300 transition-colors">
                    {comp.name || comp.title}
                  </h3>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </FeaturedSection>
  );
}
