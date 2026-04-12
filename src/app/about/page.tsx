import Image from "next/image";
import { Scissors, Phone } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="w-full max-w-[100vw] min-h-screen bg-[#F4F2EB] text-[#2c2820] font-retro-serif overflow-x-hidden relative z-10 selection:bg-[#E58B43] selection:text-white">
      <div className="fixed inset-0 pointer-events-none z-100 opacity-40 mix-blend-multiply" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')" }}></div>
      <div className="fixed inset-0 pointer-events-none z-50 opacity-10 crt-scanlines mix-blend-color-burn"></div>

      <div className="max-w-[1300px] mx-auto px-6 pt-40 pb-16 text-center">
        <h1 className="text-5xl md:text-[5.5rem] leading-[1.05] mb-12 max-w-5xl mx-auto font-medium tracking-tight relative group">
          <span className="relative z-10">We are not building a festival, we are engineering a new reality where art, technology, and human connection collide.</span>
          <span className="absolute inset-0 text-[#D84B4B] -translate-x-1.5 translate-y-1.5 opacity-100 z-0 transition-none animate-shatter mix-blend-multiply" aria-hidden="true">We are not building a festival, we are engineering a new reality where art, technology, and human connection collide.</span>
          <span className="absolute inset-0 text-[#4B7CD8] translate-x-1.5 -translate-y-1.5 opacity-100 z-0 transition-none animate-shatter mix-blend-multiply delay-75" aria-hidden="true" style={{ animationDirection: 'reverse' }}>We are not building a festival, we are engineering a new reality where art, technology, and human connection collide.</span>
        </h1>

        <div className="relative w-full aspect-video md:aspect-[2.4/1] bg-[#E8E6DF] rounded-sm overflow-hidden mb-16 shadow-[0_0_20px_rgba(0,0,0,0.05)] border border-[#E0DED7] group cursor-pointer">
           <div className="absolute inset-0 z-20 glitch-slice-layer opacity-100 transition-opacity duration-300 pointer-events-none mix-blend-screen bg-[#D84B4B]/10"></div>
           <Image 
             src="https://ik.imagekit.io/yatharth/CRAXYY.png" 
             alt="Office Team" 
             fill 
             className="object-cover object-top md:object-[50%_40%] mix-blend-multiply opacity-95 grayscale-30 sepia-30 contrast-110 group-hover:grayscale-50 group-hover:contrast-125 transition-all duration-300" 
           />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-left text-[1.15rem] leading-[1.75] tracking-tight">
           <div className="pr-4">
             <p className="mb-6">
               <strong>Photon is the bleeding-edge tech sub-fest of Neutron, the ultimate cultural and technology festival.</strong> Engineered by the brilliant students at the Newton School of Technology, we are redefining what a student-led tech fest can be. Plugged straight into the future.
             </p>
             <p>
               While Neutron sets the massive overarching stage, Photon is our dedicated playground for hardcore tech, chaotic creativity, and next-generation engineering. We bring together developers, designers, and digital artists to break the rules.
             </p>
           </div>
           <div className="pr-4">
             <p className="mb-6">
               This targeted approach means we can dive deeper into every challenge. Whether it's rapid hackathons, algorithm battles, chaotic hardware builds, or AI-driven experiences, we help the boldest technical minds stand out.
             </p>
             <p className="mb-6">
               We build event platforms that demand attention and reward raw curiosity. We push digital and physical mediums to places you haven't seen before, and have fun breaking things along the way.
             </p>
             <p>
               Beyond standard competitions, we offer deep dives into 3D design, brutalist UI/UX challenges, algorithmic problem solving, and full-stack battlegrounds.
             </p>
           </div>
           <div className="relative">
             <p className="mb-6">
               Whether it's prototyping a wild idea overnight, launching an augmented reality experience, or bringing high-fidelity visual concepts to life, Photon bridges the gap between raw ambition and technical execution. Our events are hands-on, highly collaborative, and relentlessly competitive.
             </p>
             <p className="mb-6 z-10 relative">
               We combine technical expertise with a hacker's mindset, ensuring that every bracket is intense, and every line of code matters.
             </p>
             <p className="font-bold text-[#332e26] z-10 relative">
               We're not your regular boring college committee. We do not troubleshoot printers.
             </p>
           </div>
        </div>
      </div>

      <RainbowDivider />

      <div className="w-full overflow-hidden pt-32 pb-48 relative min-h-[60vh] flex flex-col justify-center">

        <div className="max-w-[1400px] mx-auto px-6 text-center z-10 relative">
          <h2 className="text-5xl md:text-7xl mb-8 font-medium">The Neutron<br/>Experience.</h2>
          <p className="max-w-2xl mx-auto text-[1.1rem] text-[#4d473d] mb-16 leading-relaxed">
            We have had the privilege of witnessing massive crowds and raw energy at Neutron events over the years. 
            From intense coding battles to unforgettable cultural nights, this is where the Newton School of Technology family thrives.
          </p>
          
          <div className="w-full h-[650px] overflow-hidden flex gap-6 md:gap-8 relative" style={{ WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)' }}>
             <div className="flex-1 flex flex-col gap-6 md:gap-8 animate-scroll-vertical w-1/2 md:w-1/3">
                {[
                  "https://neutron-organization.vercel.app/Gallery/ARS06099.JPG", "https://neutron-organization.vercel.app/Gallery/ARS06099.JPG", "https://neutron-organization.vercel.app/Gallery/ARS07327.JPG", "https://ik.imagekit.io/yatharth/ARS03049.JPG", 
                  "https://ik.imagekit.io/yatharth/ARS03049.JPG", "https://ik.imagekit.io/yatharth/ARS06494.JPG", "https://neutron-organization.vercel.app/Gallery/ARS07087.JPG", "https://neutron-organization.vercel.app/Gallery/Gaurav.webp",
                  "https://ik.imagekit.io/yatharth/ARS06750.JPG", "https://ik.imagekit.io/yatharth/ARS06494.JPG", "https://neutron-organization.vercel.app/Gallery/Gaurav.webp", "https://neutron-organization.vercel.app/Gallery/ARS07087.JPG",
                  "https://ik.imagekit.io/yatharth/ARS06494.JPG", "https://neutron-organization.vercel.app/Gallery/Gaurav.webp", "https://neutron-organization.vercel.app/Gallery/ARS06503.JPG", "https://neutron-organization.vercel.app/Gallery/Gaurav.webp",
                  "https://neutron-organization.vercel.app/Gallery/ARS06099.JPG", "https://neutron-organization.vercel.app/Gallery/ARS06099.JPG", "https://neutron-organization.vercel.app/Gallery/ARS07327.JPG", "https://ik.imagekit.io/yatharth/ARS03049.JPG", 
                  "https://ik.imagekit.io/yatharth/ARS03049.JPG", "https://ik.imagekit.io/yatharth/ARS06494.JPG", "https://neutron-organization.vercel.app/Gallery/ARS07087.JPG", "https://neutron-organization.vercel.app/Gallery/Gaurav.webp",
                  "https://ik.imagekit.io/yatharth/ARS06750.JPG", "https://ik.imagekit.io/yatharth/ARS06494.JPG", "https://neutron-organization.vercel.app/Gallery/Gaurav.webp", "https://neutron-organization.vercel.app/Gallery/ARS07087.JPG",
                ].map((src, i) => (
                  <div key={`col1-${i}`} className="bg-[#EAE8E0] p-3 md:p-5 border-2 border-[#2c2820] shadow-[6px_6px_0_rgba(44,40,32,1)] group cursor-crosshair shrink-0">
                     <div className="relative w-full aspect-auto overflow-hidden bg-black/10 glitch-slice-layer">
                        <div className="absolute inset-0 z-0 bg-[#E0DED7] animate-pulse opacity-50"></div>
                        <img src={src} className="relative z-10 w-full h-auto min-h-[200px] object-cover mix-blend-multiply grayscale-35 sepia-20 contrast-110 group-hover:grayscale-0 group-hover:sepia-5 group-hover:contrast-125 transition-all duration-300" alt={`Gallery item ${i}`} loading="lazy" />
                     </div>
                  </div>
                ))}
             </div>
             <div className="flex-1 flex flex-col gap-6 md:gap-8 animate-scroll-vertical-reverse -mt-[450px] w-1/2 md:w-1/3">
                {[
                  "https://neutron-organization.vercel.app/Gallery/ARS06099.JPG", "https://neutron-organization.vercel.app/Gallery/ARS06099.JPG", "https://neutron-organization.vercel.app/Gallery/ARS07327.JPG", "https://ik.imagekit.io/yatharth/ARS03049.JPG", 
                  "https://ik.imagekit.io/yatharth/ARS03049.JPG", "https://ik.imagekit.io/yatharth/ARS06494.JPG", "https://neutron-organization.vercel.app/Gallery/ARS07087.JPG", "https://neutron-organization.vercel.app/Gallery/Gaurav.webp",
                  "https://ik.imagekit.io/yatharth/ARS06750.JPG", "https://ik.imagekit.io/yatharth/ARS06494.JPG", "https://neutron-organization.vercel.app/Gallery/Gaurav.webp", "https://neutron-organization.vercel.app/Gallery/ARS07087.JPG",
                  "https://ik.imagekit.io/yatharth/ARS06494.JPG", "https://neutron-organization.vercel.app/Gallery/Gaurav.webp", "https://neutron-organization.vercel.app/Gallery/ARS06503.JPG", "https://neutron-organization.vercel.app/Gallery/Gaurav.webp",
                  "https://neutron-organization.vercel.app/Gallery/ARS06099.JPG", "https://neutron-organization.vercel.app/Gallery/ARS06099.JPG", "https://neutron-organization.vercel.app/Gallery/ARS07327.JPG", "https://ik.imagekit.io/yatharth/ARS03049.JPG", 
                  "https://ik.imagekit.io/yatharth/ARS03049.JPG", "https://ik.imagekit.io/yatharth/ARS06494.JPG", "https://neutron-organization.vercel.app/Gallery/ARS07087.JPG", "https://neutron-organization.vercel.app/Gallery/Gaurav.webp",
                  "https://ik.imagekit.io/yatharth/ARS06750.JPG", "https://ik.imagekit.io/yatharth/ARS06494.JPG", "https://neutron-organization.vercel.app/Gallery/Gaurav.webp", "https://neutron-organization.vercel.app/Gallery/ARS07087.JPG",
                ].map((src, i) => (
                  <div key={`col2-${i}`} className="bg-[#EAE8E0] p-3 md:p-5 border-2 border-dashed border-[#2c2820] shadow-[3px_3px_0_rgba(44,40,32,1)] group cursor-crosshair shrink-0">
                     <div className="relative w-full aspect-auto overflow-hidden bg-black/10 vhs-flicker-layer">
                        <div className="absolute inset-0 z-0 bg-[#E0DED7] animate-pulse opacity-50"></div>
                        <img src={src} className="relative z-10 w-full h-auto min-h-[250px] object-cover mix-blend-multiply grayscale-25 sepia-25 contrast-[1.05] group-hover:grayscale-5 group-hover:sepia-0 transition-all duration-300" alt={`Gallery item ${i}`} loading="lazy" />
                     </div>
                  </div>
                ))}
             </div>
             <div className="hidden md:flex flex-1 flex-col gap-6 md:gap-8 animate-scroll-vertical-fast w-1/3">
                {[
                  "https://neutron-organization.vercel.app/Gallery/ARS06099.JPG", "https://neutron-organization.vercel.app/Gallery/ARS06099.JPG", "https://neutron-organization.vercel.app/Gallery/ARS07327.JPG", "https://ik.imagekit.io/yatharth/ARS03049.JPG", 
                  "https://ik.imagekit.io/yatharth/ARS03049.JPG", "https://ik.imagekit.io/yatharth/ARS06494.JPG", "https://neutron-organization.vercel.app/Gallery/ARS07087.JPG", "https://neutron-organization.vercel.app/Gallery/Gaurav.webp",
                  "https://ik.imagekit.io/yatharth/ARS06750.JPG", "https://ik.imagekit.io/yatharth/ARS06494.JPG", "https://neutron-organization.vercel.app/Gallery/Gaurav.webp", "https://neutron-organization.vercel.app/Gallery/ARS07087.JPG",
                  "https://ik.imagekit.io/yatharth/ARS06494.JPG", "https://neutron-organization.vercel.app/Gallery/Gaurav.webp", "https://neutron-organization.vercel.app/Gallery/ARS06503.JPG", "https://neutron-organization.vercel.app/Gallery/Gaurav.webp",
                  "https://neutron-organization.vercel.app/Gallery/ARS06099.JPG", "https://neutron-organization.vercel.app/Gallery/ARS06099.JPG", "https://neutron-organization.vercel.app/Gallery/ARS07327.JPG", "https://ik.imagekit.io/yatharth/ARS03049.JPG", 
                  "https://ik.imagekit.io/yatharth/ARS03049.JPG", "https://ik.imagekit.io/yatharth/ARS06494.JPG", "https://neutron-organization.vercel.app/Gallery/ARS07087.JPG", "https://neutron-organization.vercel.app/Gallery/Gaurav.webp",
                  "https://ik.imagekit.io/yatharth/ARS06750.JPG", "https://ik.imagekit.io/yatharth/ARS06494.JPG", "https://neutron-organization.vercel.app/Gallery/Gaurav.webp", "https://neutron-organization.vercel.app/Gallery/ARS07087.JPG",
                ].map((src, i) => (
                  <div key={`col3-${i}`} className="bg-[#F4F2EB] p-3 md:p-5 border-2 border-[#2c2820] shadow-[-6px_6px_0_rgba(44,40,32,1)] group cursor-crosshair shrink-0">
                     <div className="relative w-full aspect-auto overflow-hidden bg-black/10 glitch-slice-layer">
                        <div className="absolute inset-0 z-0 bg-[#E0DED7] animate-pulse opacity-50"></div>
                        <img src={src} className="relative z-10 w-full h-auto min-h-[200px] object-cover mix-blend-multiply grayscale-30 sepia-40 contrast-[1.1] group-hover:grayscale-5 group-hover:sepia-10 transition-all duration-300" alt={`Gallery item ${i}`} loading="lazy" />
                     </div>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>

      <RainbowDivider />

      <div className="w-full overflow-visible relative pb-32">
        <div className="max-w-[1300px] mx-auto px-6 pt-32 pb-16 flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
          
          <div className="flex-1 max-w-[650px] shrink-0 pt-10 relative z-20">
            <h2 className="text-[4rem] md:text-[5.5rem] leading-[1.05] font-medium tracking-[-0.02em] text-[#332e26] relative group">
              <span className="relative z-10 transition-transform duration-300 group-hover:-translate-y-2 inline-block">Had Enough<br/>Reading? Let's<br/>Shred This Thing.</span>
              <span className="absolute inset-0 text-[#D84B4B] -translate-x-1.5 translate-y-2 opacity-0 group-hover:opacity-100 z-0 transition-none animate-shatter mix-blend-multiply pointer-events-none" aria-hidden="true">Had Enough<br/>Reading? Let's<br/>Shred This Thing.</span>
              <span className="absolute inset-0 text-[#4B7CD8] translate-x-1.5 -translate-y-2 opacity-0 group-hover:opacity-100 z-0 transition-none animate-shatter mix-blend-multiply delay-75 pointer-events-none" aria-hidden="true" style={{ animationDirection: 'reverse' }}>Had Enough<br/>Reading? Let's<br/>Shred This Thing.</span>
            </h2>
            <div className="text-[1.2rem] leading-relaxed text-[#403a30] space-y-8 mt-12">
              <p>
                In today's fast-paced tech landscape, you need an arena that pushes your limits to the absolute maximum. 
                At Photon, we engineer chaos through brutal hackathons, algorithmic showdowns, and next-level tech battles. 
                Powered by the massive scale of Neutron, we are ready to overclock your brain, unlock hidden potentials, and maximize your raw output.
              </p>
              <p>
                We leverage the vibrant ecosystem of the Newton School of Technology to give you the ultimate competitive playground. 
                Whether you're disrupting the norm with paradigm-shifting AI solutions or just trying to survive an overnight coding sprint, 
                we provide the pizza, the caffeine, and the arena. We merge high-performance engineering with sleep-deprived creativity.
              </p>
              <p className="font-semibold text-[#2c2820]">
                Ready to take your skills to the next dimension? Don't waste valuable time reading any more of this corporate-sounding jargon. 
                Review our competitions, crunch the algorithms, and prepare for battle. The future of tech is waiting for you to conquer it at Neutron. Let's execute.
              </p>
            </div>
          </div>
          
          <div className="relative h-[450px] md:h-[550px] w-full md:w-[400px] flex-none group cursor-wait mt-12 md:mt-0 z-10 md:absolute md:right-2 md:bottom-16 overflow-hidden border-2 border-[#2c2820] shadow-[-8px_8px_0_rgba(44,40,32,1)] bg-[#EAE8E0] rotate-3 hover:rotate-0 transition-transform duration-500">
             <div className="absolute inset-0 z-20 glitch-slice-layer opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none mix-blend-screen bg-[#D84B4B]/20"></div>
             <img 
               src="https://ik.imagekit.io/yatharth/ARS06750.JPG?updatedAt=1774806404575" 
               alt="Photon Event Action" 
               className="object-cover object-center w-full h-full mix-blend-multiply grayscale-25 sepia-25 contrast-[1.1] group-hover:grayscale-0 group-hover:sepia-0 group-hover:contrast-[1.2] transition-all duration-500" 
             />
          </div>

        </div>
      </div>

    </div>
  )
}

function RainbowDivider() {
  return (
    <div className="w-full flex justify-center py-6 overflow-hidden">
      <div className="w-[120%] flex flex-col rotate-[-0.2deg] shadow-sm opacity-90 mx-[-10%] mix-blend-multiply">
        <div className="w-full h-[5px] bg-[#D84B4B]"></div>
        <div className="w-full h-[5px] bg-[#E58B43]"></div>
        <div className="w-full h-[5px] bg-[#E2C151]"></div>
        <div className="w-full h-[5px] bg-[#5C9E6D]"></div>
        <div className="w-full h-[5px] bg-[#4B7CD8]"></div>
        <div className="w-full h-[5px] bg-[#8755A8]"></div>
      </div>
    </div>
  )
}
