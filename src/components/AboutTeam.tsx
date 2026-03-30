"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const TEAM_MEMBERS = [
  {
    name: "Yash Lunawat",
    role: "Accommodation and Hospitality",
    image: "https://cdn.prod.website-files.com/62e8d2ea218fb7676b6892a6/683511d23fd5947ee8a92206_image%204628.avif"
  },
  {
    name: "Aman Kumar",
    role: "Tech Exhibitions",
    image: "https://cdn.prod.website-files.com/62e8d2ea218fb7676b6892a6/683511d20c4dcd72c058f0ea_image%204630.avif"
  },
  {
    name: "Rishabh Gusain",
    role: "Fest Engagement",
    image: "https://cdn.prod.website-files.com/62e8d2ea218fb7676b6892a6/683511d2d519ae1be1e25617_image%204632.avif"
  },
  {
    name: "Vishesh Rao",
    role: "Transportation",
    image: "https://ik.imagekit.io/yatharth/1736148108567.jpeg"
  },
  {
    name: "Aman Kumar",
    role: "Competitions",
    image: "https://cdn.prod.website-files.com/62e8d2ea218fb7676b6892a6/683511d20e5368e1507d4109_image%204631.avif"
  },
  {
    name: "Shivansh",
    role: "Sponsorship & Marketing",
    image: "https://cdn.prod.website-files.com/62e8d2ea218fb7676b6892a6/683511d215e08369e5b7a927_image%204629.avif"
  }
];

export default function AboutTeam() {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  const x = useTransform(scrollYProgress, [0, 1], ["1%", "-82%"]);

  return (
    <section ref={targetRef} className="relative h-[400vh] bg-transparent">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden pt-30">
        <div className="absolute top-24 left-4 md:left-12 z-10">
          <motion.h2 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-[2.5rem] md:text-[5rem] font-bold tracking-tighter text-white leading-none uppercase"
          >
            Students who made<br /><span className="italic font-light opacity-50">it possible</span>
          </motion.h2>
        </div>

        <motion.div style={{ x }} className="flex gap-6 pl-[5%] md:pl-[12%] mt-24">
          {TEAM_MEMBERS.map((member, i) => (
            <TeamCard key={i} member={member} i={i} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

const TeamCard = ({ member, i }: { member: any; i: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: i * 0.1 }}
      viewport={{ once: true }}
      className="group relative h-[450px] w-[320px] md:h-[550px] md:w-[400px] overflow-hidden rounded-[2.5rem] bg-[#111] border border-white/10 shrink-0"
    >
      <div className="absolute inset-0 grayscale group-hover:grayscale-0 transition-all duration-700 ease-out scale-105 group-hover:scale-100">
        <img
          src={member.image}
          alt={member.name}
          className="h-full w-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=111&color=fff&size=512`;
          }}
        />
        <div className="absolute inset-0 bg-linear-to-t from-black via-black/20 to-transparent opacity-80" />
      </div>

      <div className="absolute bottom-0 left-0 p-8 w-full transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
        <h3 className="text-2xl md:text-3xl font-bold text-white mb-1 uppercase tracking-tight">
          {member.name}
        </h3>
        <p className="text-[#ffb84d] font-mono text-[0.65rem] md:text-xs uppercase tracking-widest opacity-80">
          {member.role}
        </p>
      </div>
    </motion.div>
  );
};
