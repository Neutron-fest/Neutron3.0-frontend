export interface Event {
  title: string;
  image: string;
  slug: string;
  category: string;
  date: string;
  details: string;
  description: string;
  ticketPrice: string;
  location: string;
  time: string;
  highlights: string[];
  rules: { title: string; content: string }[];
}

export const EVENTS: Event[] = [
  {
    title: "Cyber Security Summit",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1600",
    slug: "cyber-security-summit",
    category: "Conference",
    date: "OCT 24, 2026",
    details: "Global experts on next-gen threats",
    description: "The digital perimeter is dissolving. Join the world's most elite security researchers as they deconstruct real-world exploits, zero-day vulnerabilities, and the future of computational warfare. This isn't a lecture; it's a deep-dive into the architecture of the secure future.",
    ticketPrice: "Free",
    location: "Main Auditorium",
    time: "10:00 AM",
    highlights: [
      "Live hacking demonstrations",
      "Keynote from former NSA analysts",
      "Interactive 'Capture The Flag' mini-challenges",
      "Network with top infosec firms"
    ],
    rules: [
      { title: "Network Hygiene", content: "No unauthorized scanning or exploitation of the venue's infrastructure is permitted." },
      { title: "Recording Policy", content: "Chatham House Rules apply for all breakout sessions. No video recording in 'Dark Room' workshops." },
      { title: "Access Control", content: "Physical badges must be visible at all times within the Secure Sector." }
    ]
  },
  {
    title: "AI Workshop",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1600",
    slug: "ai-workshop",
    category: "Workshop",
    date: "NOV 12, 2026",
    details: "Hands-on LLM fine-tuning",
    description: "Move beyond the prompt. In this intensive hands-on workshop, you'll learn to architect, fine-tune, and deploy large language models for specialized domains. We provide the GPU clusters; you bring the data and the vision.",
    ticketPrice: "$50",
    location: "Lab 4B",
    time: "2:00 PM",
    highlights: [
      "Direct access to H100 GPU clusters",
      "Custom LoRA training templates provided",
      "One-on-one architectural review sessions",
      "Cloud-agnostic deployment strategies"
    ],
    rules: [
      { title: "Compute Limits", content: "Each participant is allocated a specific quota of GPU-hours. Overage requires explicit approval." },
      { title: "Data Ethics", content: "No training on PII (Personally Identifiable Information) or copyrighted datasets without proof of license." },
      { title: "Software requirements", content: "All development must occur within the provided sandboxed Jupyter environment." }
    ]
  },
  {
    title: "Quantum Keynote",
    image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=1600",
    slug: "quantum-keynote",
    category: "Keynote",
    date: "DEC 05, 2026",
    details: "The future of quantum computing",
    description: "Qubits are no longer theoretical. Witness the unveiling of the next generation of superconducting processors and the algorithms that will render classic encryption obsolete. The era of quantum advantage is here.",
    ticketPrice: "Free",
    location: "Virtual",
    time: "6:00 PM",
    highlights: [
      "Virtual tour of a cryostat laboratory",
      "Live quantum circuit execution on real hardware",
      "Panel discussion on post-quantum cryptography",
      "Interactive Q&A with lead researchers"
    ],
    rules: [
      { title: "Digital Conduct", content: "Questions must be submitted via the moderated queue. Respectful discourse is mandatory." },
      { title: "Bandwidth Requirements", content: "Stable 50Mbps+ connection recommended for the immersive 8K 360-degree stream." },
      { title: "Replay Rights", content: "The recording will be available exclusively to registered attendees for 30 days." }
    ]
  },
  {
    title: "DevRel Meetup",
    image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=1600",
    slug: "devrel-meetup",
    category: "Networking",
    date: "JAN 15, 2027",
    details: "Connecting developer advocates",
    description: "The bridge between code and community. Meet the people who build the tools you love and the communities that sustain them. A night of high-velocity networking, lightning talks, and synthesis.",
    ticketPrice: "Free",
    location: "Rooftop Cafe",
    time: "5:30 PM",
    highlights: [
      "Speed mentoring sessions",
      "Lightning talks on community scaling",
      "Curated cocktail/mocktail menu",
      "Swag swap station"
    ],
    rules: [
      { title: "Code of Conduct", content: "Inclusive behavior is strictly enforced. Harassment of any kind results in immediate expulsion." },
      { title: "Photography", content: "Green/Red lanyard system for 'no-photo' preference will be in effect." },
      { title: "RSVP Integrity", content: "No-shows without 24hr notice may be deprioritized for future intimate meetups." }
    ]
  },
  {
    title: "Tech Career Fair",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1600",
    slug: "tech-career-fair",
    category: "Career",
    date: "FEB 22, 2027",
    details: "Meet top tech recruiters",
    description: "Your next chapter starts here. Connect with hiring managers from the world's most innovative startups and established giants. Skip the screeners and move straight to the conversation.",
    ticketPrice: "Free",
    location: "Exhibition Hall",
    time: "9:00 AM",
    highlights: [
      "On-site technical whiteboard sessions",
      "Resume & Portfolio reviews by industry leads",
      "Direct fast-track interview sign-ups",
      "Startup pitch-for-talent sessions"
    ],
    rules: [
      { title: "Credential Check", content: "Proof of student or professional status required for entry. Digital resume upload mandatory." },
      { title: "Professionalism", content: "Business casual or 'dev-professional' attire recommended. No solicitation of external services." },
      { title: "Waitlist Policy", content: "Premium workshops within the fair are first-come, first-served." }
    ]
  },
  {
    title: "Founder's Pitch",
    image: "https://images.unsplash.com/photo-1538370965046-79c0d6907d47?auto=format&fit=crop&q=80&w=1600",
    slug: "founders-pitch",
    category: "Startups",
    date: "MAR 10, 2027",
    details: "Seed round pitching session",
    description: "High stakes, high pressure. Watch the next generation of founders pitch their vision to a panel of top-tier VCs. Only one project takes home the seed grant and the mentorship package.",
    ticketPrice: "Invite",
    location: "Innovation Hub",
    time: "4:00 PM",
    highlights: [
      "Live judging with real-time feedback",
      "Winner takes home $100k non-dilutive grant",
      "Intimate investor networking dinner",
      "Press coverage from major tech outlets"
    ],
    rules: [
      { title: "Confidentiality", content: "All pitch materials and verbal disclosures are covered by the event-wide NDA." },
      { title: "Pitch Window", content: "Strict 5-minute pitch / 3-minute Q&A. No extensions for technical difficulties." },
      { title: "Eligibility", content: "Startups must be pre-Series A and have a functional MVP to be considered for the grant." }
    ]
  },
];
