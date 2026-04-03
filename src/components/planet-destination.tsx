"use client";

import type { CSSProperties } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

import type { PlanetRecord } from "@/lib/planet-data";

export default function PlanetDestination({ planet }: { planet: PlanetRecord }) {
  const router = useRouter();

  return (
    <motion.main
      className="relative min-h-svh overflow-hidden"
      style={{
        background: "radial-gradient(circle at 18% 18%,rgba(73,129,255,0.18),transparent 22%),radial-gradient(circle at 82% 24%,rgba(255,158,92,0.16),transparent 18%),linear-gradient(180deg,#040714 0%,#050b18 45%,#040611 100%)",
      }}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
    >
      <div
        className="absolute inset-0 opacity-[0.42]"
        style={{
          background: "radial-gradient(circle at center,transparent 22%,rgba(2,4,10,0.42) 72%),radial-gradient(circle,rgba(255,255,255,0.8) 0.85px,transparent 1.2px)",
          backgroundSize: "auto,180px 180px",
        }}
      />

      <section
        className="relative z-10 grid min-h-svh items-center gap-12 p-8 md:grid-cols-[minmax(20rem,34rem)_minmax(26rem,42rem)] md:p-12"
      >
        <motion.div
          className="relative mx-auto grid place-items-center"
          style={{ height: "min(68vw,30rem)", width: "min(68vw,30rem)" }}
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.75, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
        >
          <div
            className="rounded-full"
            style={{
              height: "min(46vw,21rem)",
              width: "min(46vw,21rem)",
              background: [
                `radial-gradient(circle at 34% 30%,rgba(255,255,255,0.82),transparent 22%)`,
                `radial-gradient(circle at 68% 72%,rgba(0,0,0,0.22),transparent 26%)`,
                planet.texture ? `url(${planet.texture})` : null,
                `linear-gradient(135deg,rgba(255,255,255,0.1),rgba(255,255,255,0.28))`,
              ]
                .filter(Boolean)
                .join(","),
              backgroundSize: "cover",
              backgroundPosition: "center",
              boxShadow: `inset -34px -28px 60px rgba(0,0,0,0.24),0 0 80px rgba(255,255,255,0.05)`,
            } as CSSProperties}
          />
          <motion.div className="absolute rounded-full border border-white/5" style={{ inset: "8%" }} animate={{ rotate: [16, 376] }} transition={{ duration: 45, repeat: Infinity, ease: "linear" }} />
          <motion.div className="absolute rounded-full border border-white/5" style={{ inset: "0%" }} animate={{ rotate: [-22, -382] }} transition={{ duration: 60, repeat: Infinity, ease: "linear" }} />
        </motion.div>

        <motion.div
          className="mx-auto w-full max-w-3xl rounded-[1.9rem] p-6 md:p-8"
          style={{
            border: "1px solid rgba(255,255,255,0.08)",
            background: "linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))",
            boxShadow: "0 30px 80px rgba(0,0,0,0.28)",
          }}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="text-[0.78rem] uppercase tracking-[0.34em] text-white/40">
            {planet.eyebrow}
          </p>
          <h1 className="mt-4 text-[clamp(3.2rem,8vw,6.2rem)] leading-[0.94] tracking-[-0.04em] text-white">
            {planet.name}
          </h1>
          <p className="mt-4 max-w-2xl text-[clamp(1.1rem,2vw,1.45rem)] leading-[1.7] text-white/90">
            {planet.headline}
          </p>
          <p className="mt-4 max-w-2xl text-base leading-[1.9] text-white/60">
            {planet.summary}
          </p>

          <div className="mt-6 grid gap-[0.9rem]">
            {planet.stats.map((stat) => (
              <div
                key={stat.label}
                className="flex justify-between gap-4 rounded-[1.2rem] px-[1.05rem] py-4"
                style={{ border: "1px solid rgba(143,182,255,0.12)", background: "rgba(8,16,34,0.46)" }}
              >
                <span className="text-[0.78rem] uppercase tracking-[0.3em] text-[rgba(180,205,238,0.6)]">
                  {stat.label}
                </span>
                <span className="text-[rgba(255,255,255,0.92)]">{stat.value}</span>
              </div>
            ))}
          </div>

          <button
            className="mt-7 inline-flex items-center justify-center rounded-full px-[1.4rem] py-[0.95rem] text-[rgba(241,247,255,0.92)] transition-all duration-200 hover:-translate-y-[2px]"
            style={{
              border: "1px solid rgba(145,191,255,0.2)",
              background: "rgba(6,13,28,0.52)",
              fontFamily: "inherit",
              fontSize: "inherit",
              letterSpacing: "0.04em",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(145,191,255,0.32)";
              (e.currentTarget as HTMLButtonElement).style.background  = "rgba(10,20,41,0.74)";
              (e.currentTarget as HTMLButtonElement).style.boxShadow   = "0 8px 32px rgba(0,0,0,0.28),0 0 24px rgba(100,170,255,0.1)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(145,191,255,0.2)";
              (e.currentTarget as HTMLButtonElement).style.background  = "rgba(6,13,28,0.52)";
              (e.currentTarget as HTMLButtonElement).style.boxShadow   = "";
            }}
            onClick={() => router.back()}
          >
            ← Return To Orbit
          </button>
        </motion.div>
      </section>
    </motion.main>
  );
}
