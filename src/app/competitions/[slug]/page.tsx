import { notFound } from "next/navigation";
import { getCompetitionBySlug } from "@/lib/competitions-data";
import CompetitionRegistration from "@/components/competition-registration";
import ScratchToReveal from "@/components/scratch-to-reveal";
import SmoothScroll from "@/components/smooth-scroll";
import Link from "next/link";
import React from "react";

export default async function CompetitionSlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const competition = getCompetitionBySlug(slug);

  if (!competition) {
    notFound();
  }

  return (
    <SmoothScroll>
      <div className="min-h-screen bg-[#030303] text-white selection:bg-white/20 relative font-sans">
        
        <div 
          className="fixed top-0 left-0 w-full h-screen z-0 overflow-hidden pointer-events-none" 
          style={{ perspective: "1000px" }}
        >
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] mix-blend-overlay z-20"></div>
          <div
            className="w-full h-[120%] bg-cover bg-center -mt-10 animate-[slow-pan_30s_ease-in-out_infinite_alternate]"
            style={{
              backgroundImage: `url(${competition.image})`,
              filter: "brightness(0.2) contrast(1.2) grayscale(70%) blur(4px)",
              transform: "translateZ(-100px) scale(1.3)",
            }}
          />
          <div className="absolute inset-0 bg-linear-to-b from-[#030303]/20 via-[#030303]/80 to-[#030303] z-10" />
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,transparent_0%,#030303_100%)] z-10 opacity-70" />
        </div>

        <div className="fixed top-8 left-8 z-50 pointer-events-auto">
          <Link href="/planets/jupiter">
            <div className="flex items-center space-x-4 group cursor-pointer relative overflow-hidden backdrop-blur-xl bg-white/5 border border-white/10 px-4 py-2 rounded-full hover:bg-white/10 hover:border-white/30 transition-all duration-500">
               <div className="flex items-center justify-center bg-black/50 w-8 h-8 rounded-full group-hover:bg-white transition-colors duration-500">
                 <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-white group-hover:text-black transition-colors duration-500">
                   <path d="M19 12H5M12 19l-7-7 7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                 </svg>
               </div>
               <span className="text-xs font-medium tracking-[0.2em] uppercase text-white/70 group-hover:text-white transition-colors">Return</span>
            </div>
          </Link>
        </div>

        <main className="relative z-20 max-w-[1400px] mx-auto px-6 md:px-12 lg:px-24 pt-48 pb-40">
          
          <div className="mb-24 max-w-4xl mix-blend-lighten animate-fade-in-up">
            <div className="flex items-center space-x-4 mb-8">
              <span className="px-4 py-1.5 bg-black/40 border border-[#444] text-xs font-mono uppercase tracking-[0.3em] rounded-full text-white/80 shadow-[0_0_15px_rgba(255,255,255,0.05)]">
                {competition.isPaid ? 'Premium Access' : 'Open Entry'}
              </span>
              <span className="text-white/30 font-mono text-sm tracking-widest uppercase">{competition.date}</span>
            </div>

            <h1 className="text-6xl md:text-8xl lg:text-[7.5rem] font-bold tracking-tighter leading-[0.85] mb-10 uppercase bg-clip-text text-transparent bg-linear-to-b from-white to-white/30 drop-shadow-2xl">
              {competition.title}
            </h1>
            <p className="text-md md:text-2xl font-light text-white/50 leading-relaxed max-w-3xl border-l-2 border-white/20 pl-6">
              {competition.description}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 mt-32">
            
            <div className="lg:col-span-8 order-2 lg:order-1 flex flex-col space-y-24">
              
              <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                <div className="flex items-center space-x-4 mb-8">
                  <div className="w-12 h-px bg-white/30"></div>
                  <h2 className="text-3xl tracking-wide uppercase font-light text-white/90">Mission Briefing</h2>
                </div>
                <div className="prose prose-invert max-w-none text-white/60 font-light leading-loose text-lg lg:text-xl">
                  <p>{competition.about}</p>
                </div>
              </div>

              <div className="pt-16 relative">
                <div className="absolute top-0 left-0 w-1/3 h-px bg-linear-to-r from-white/30 to-transparent"></div>
                <CompetitionRegistration competitionTitle={competition.title} teamSize={competition.teamSize} />
              </div>
            </div>

            <div className="lg:col-span-4 order-1 lg:order-2 flex flex-col space-y-12">
              
              <div className="border border-white/10 rounded-3xl p-8 lg:p-10 bg-black/40 backdrop-blur-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)] relative overflow-hidden group">
                <div className="absolute -inset-2 bg-linear-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 blur-xl"></div>
                
                <h3 className="text-xs uppercase tracking-[0.3em] font-medium text-white/40 mb-10">Parameters</h3>
                
                <ul className="space-y-10 relative z-10">
                  <li className="flex flex-col">
                    <span className="text-[10px] font-mono text-white/30 uppercase mb-2 tracking-widest flex items-center">
                      <div className="w-2 h-2 rounded-full bg-green-500/50 mr-3 animate-pulse"></div> Prize Pool
                    </span>
                    <ScratchToReveal height="60px" width="100%">
                      <span className="text-2xl lg:text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-green-300 to-emerald-600 tracking-tighter">
                        {competition.prizePool}
                      </span>
                    </ScratchToReveal>
                  </li>
                  
                  <li className="flex flex-col border-t border-white/5 pt-6">
                    <span className="text-[10px] font-mono text-white/30 uppercase mb-2 tracking-widest">Location</span>
                    <span className="text-lg text-white/90 font-light">{competition.location}</span>
                  </li>

                  <li className="flex flex-col border-t border-white/5 pt-6">
                    <span className="text-[10px] font-mono text-white/30 uppercase mb-2 tracking-widest">Team Size</span>
                    <span className="text-lg text-white/90 font-light">{competition.teamSize}</span>
                  </li>

                  <li className="flex flex-col border-t border-white/5 pt-6">
                    <span className="text-[10px] font-mono text-white/30 uppercase mb-2 tracking-widest">Registration Fee</span>
                    <span className="text-lg text-white/90 font-light">
                      {competition.isPaid ? `₹${competition.price}` : "Free"}
                    </span>
                  </li>
                </ul>
              </div>

            </div>

          </div>
        </main>

        <style>{`
          @keyframes fade-in-up {
            from { opacity: 0; transform: translateY(40px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in-up {
            animation: fade-in-up 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
          @keyframes slow-pan {
            0% { transform: translateY(0) scale(1.1); }
            100% { transform: translateY(-5%) scale(1.2); }
          }
        `}</style>
      </div>
    </SmoothScroll>
  );
}
