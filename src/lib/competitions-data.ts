export type CompetitionRecord = {
  slug: string;
  title: string;
  description: string;
  image: string;
  heightClass: string;
  delay: number;
  isPaid: boolean;
  price?: number;
  location: string;
  date: string;
  prizePool: string;
  about: string;
  teamSize: string;
};

export const COMPETITIONS_DATA: CompetitionRecord[] = [
  {
    slug: "explorers-guide",
    title: "Explorer's Guide to Space",
    description: "Exploring the Solar System? How does life look like onboard the biggest spacecraft ever built? The of future space exploration: Where are we going next - Moon, Mars, asteroids and beyond.",
    image: "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?w=1600&q=80",
    heightClass: "h-[750px] md:h-[900px]",
    delay: 0.1,
    isPaid: true,
    price: 499,
    location: "Main Auditorium, Campus Hub",
    date: "April 15, 2026",
    prizePool: "₹50,000",
    about: "Embark on an interactive journey through the cosmos. This event will test your knowledge of space exploration history and future trajectories. Participants will analyze mission parameters for hypothetical crewed missions to Mars and asteroid mining operations. Prepare for deep-dive trivia and problem-solving scenarios based on real astrophysics.",
    teamSize: "1-3 Members",
  },
  {
    slug: "orbital-mechanics-101",
    title: "Orbital Mechanics 101",
    description: "Master the physics of celestial rendezvous, planetary transfers, and complex docking procedures in a zero-G environment.",
    image: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=1600&q=80",
    heightClass: "h-[500px] md:h-[600px]",
    delay: 0.3,
    isPaid: false,
    location: "Mechanical Block Seminar Hall",
    date: "April 16, 2026",
    prizePool: "₹25,000",
    about: "A rigorous competition focusing on the mathematical and physical principles of spaceflight. From calculating Hohmann transfer orbits to executing precision docking simulations, this is the ultimate test for aspiring astrodynamicists. Use provided tools and data sets to optimize trajectories with minimal delta-v.",
    teamSize: "2 Members",
  },
  {
    slug: "the-final-frontier",
    title: "The Final Frontier",
    description: "How do satellites stay in Space? What does it take to fly a spacecraft? 16 sunsets in a single day. Really? How? Space is closer than you think!",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1600&q=80",
    heightClass: "h-[550px] md:h-[650px]",
    delay: 0.2,
    isPaid: true,
    price: 299,
    location: "Open Air Theatre",
    date: "April 17, 2026",
    prizePool: "₹35,000",
    about: "An immersive multi-stage hackathon where teams must design a complete satellite mission architecture. You will select orbital parameters, design payload constraints, and develop a long-term sustainability plan for a LEO constellation. Judged by industry experts from leading space agencies.",
    teamSize: "3-4 Members",
  },
  {
    slug: "mission-phoenix",
    title: "Mission: Phoenix",
    description: "Join the elite crew traversing the martian surface. Manage resources, survey alien terrain, and establish the very first deep space outpost.",
    image: "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=1600&q=80",
    heightClass: "h-[600px] md:h-[750px]",
    delay: 0.4,
    isPaid: true,
    price: 799,
    location: "Virtual / Computer Science Labs",
    date: "April 18, 2026",
    prizePool: "₹1,00,000",
    about: "The flagship event of Neutron. A 24-hour resource management and survival simulation set on Mars. Teams must balance power, oxygen, and water generation using custom software while dealing with random catastrophic events like dust storms and equipment failures. Keep the colony alive to win.",
    teamSize: "4 Members",
  }
];

export const getCompetitionBySlug = (slug: string) => {
  return COMPETITIONS_DATA.find((comp) => comp.slug === slug);
};
