"use client"

import React, { useEffect, useRef, useState, useCallback } from 'react';

const BEAM_PHYSICS = [
  { wavelength: 450,  frequency: '666.7 THz', energy: '2.76 eV', type: 'Visible · Violet'  },
  { wavelength: 510,  frequency: '588.2 THz', energy: '2.43 eV', type: 'Visible · Green'   },
  { wavelength: 670,  frequency: '447.6 THz', energy: '1.85 eV', type: 'Visible · Red'     },
  { wavelength: 380,  frequency: '789.5 THz', energy: '3.26 eV', type: 'Near UV'           },
  { wavelength: 850,  frequency: '352.9 THz', energy: '1.46 eV', type: 'Near IR'           },
  { wavelength: 266,  frequency: '1127.8 THz',energy: '4.66 eV', type: 'Deep UV'           },
  { wavelength: 532,  frequency: '563.7 THz', energy: '2.33 eV', type: 'Visible · Cyan'    },
  { wavelength: 405,  frequency: '740.0 THz', energy: '3.06 eV', type: 'Visible · Indigo'  },
  { wavelength: 780,  frequency: '384.6 THz', energy: '1.59 eV', type: 'Near IR'           },
  { wavelength: 193,  frequency: '1554 THz',  energy: '6.43 eV', type: 'Excimer UV'        },
  { wavelength: 632,  frequency: '474.6 THz', energy: '1.96 eV', type: 'Visible · Orange'  },
  { wavelength: 1064, frequency: '281.7 THz', energy: '1.17 eV', type: 'IR · Nd:YAG'       },
];

const QUANTUM_LINES = [
  "iℏ ∂ψ/∂t = [-ℏ²/2m ∇² + V(r)]ψ",
  "E = hν = ℏω = pc",
  "λ_deBroglie = h / mv",
  "Δx · Δpₓ ≥ ℏ/2",
  "(iγᵘ∂ᵤ - mc/ℏ)ψ = 0  [Dirac]",
  "E² = (pc)² + (m₀c²)²",
  "ΔE · Δt ≥ ℏ/2",
  "⟨Â⟩ = ∫ ψ* Â ψ dV",
  "[x̂, p̂ₓ] = iℏ",
  "∇ × B = μ₀J + μ₀ε₀ ∂E/∂t",
  "∇ · E = ρ/ε₀",
  "∇ × E = -∂B/∂t",
  "S = k_B ln(Ω)  [Boltzmann]",
  "P(x,t) = |ψ(x,t)|²",
  "ψ(x,t) = A·exp[i(kx - ωt)]",
  "α = e² / (4πε₀ℏc) ≈ 1/137",
  "Ĉ₊|n⟩ = √(n+1) |n+1⟩  [ladder]",
  "spin = 1 ⟹ photon is a boson",
  "𝜆 = hc / E  ⟹  hc ≈ 1240 eV·nm",
  "∫ |ψ|² dx = 1  [normalization]",
  "ψₙ(x) = √(2/L) sin(nπx/L)",
  "Eₙ = -13.6 eV / n²  [hydrogen]",
  "g_photon = 0  ⟹  massless",
  "F = q(E + v × B)  [Lorentz]",
  "∮ E · dA = Q_enc / ε₀",
  "Φ_B = ∮ B · dA = 0",
  "c = 1/√(μ₀ε₀) = 2.998×10⁸ m/s",
  "h = 6.626 × 10⁻³⁴ J·s",
  "ℏ = h/2π = 1.055 × 10⁻³⁴ J·s",
  "m_photon = 0, spin = ±ℏ",
  "n(ω) = c/v_phase",
  "E_field = -∇V - ∂A/∂t",
  "B_field = ∇ × A",
  "γ_Lorentz = 1/√(1-v²/c²)",
  "T_photon = 0 ⟹ E=pc",
];

function makeRng(seed: number) {
  let s = seed;
  return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
}

interface Beam {
  angle: number;
  curveAngle: number;
  curveDir: number;
  color: [number,number,number];
  speed: number;
  amplitude: number;
  phaseOffset: number;
  length: number;
  width: number;
  opacity: number;
  isZigZag: boolean;
  physics: typeof BEAM_PHYSICS[0];
  hitPoints: { x: number; y: number }[];
}

function buildBeams(count: number, W: number, H: number): Beam[] {
  const rng = makeRng(7);
  const diag = Math.sqrt(W * W + H * H);
  const palette: [number,number,number][] = [
    [6,182,212],[236,72,153],[124,58,237],[250,204,21],
    [52,211,153],[248,113,113],[167,139,250],[34,211,238],
    [251,146,60],[99,102,241],[20,184,166],[245,158,11],
  ];
  return Array.from({ length: count }, (_, i) => ({
    angle:       rng() * Math.PI * 2,
    curveAngle:  (rng() - 0.5) * Math.PI * 1.8,
    curveDir:    rng() > 0.5 ? 1 : -1,
    color:       palette[i % palette.length],
    speed:       1.2 + rng() * 2.5,
    amplitude:   10 + rng() * 25,
    phaseOffset: rng() * Math.PI * 2,
    length:      diag * (0.6 + rng() * 0.5),
    width:       1.2 + rng() * 2.2,
    opacity:     0.5 + rng() * 0.45,
    isZigZag:    i % 11 === 0,
    physics:     BEAM_PHYSICS[i % BEAM_PHYSICS.length],
    hitPoints:   [],
  }));
}

export function useHeroCanvas(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  beamsRef: React.MutableRefObject<Beam[]>,
  onBeamHover: (beam: Beam | null, mx: number, my: number) => void,
) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf: number;
    let t = 0;
    let glitchTimer = 0;
    let glitchActive = false;
    let glitchY = 0, glitchH = 0;
    let flickerOpacity = 1;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
      const W = canvas.width, H = canvas.height;
      const diag = Math.sqrt(W * W + H * H);
      
      if (!beamsRef.current || beamsRef.current.length === 0) {
        beamsRef.current = buildBeams(20, W, H);
      } else {
        beamsRef.current.forEach(beam => {
          beam.length = diag * (0.6 + Math.random() * 0.5);
          beam.hitPoints = [];
        });
      }
    };
    resize();
    window.addEventListener('resize', resize);

    const colors = [
      '#22d3ee',
      '#4ade80',
      '#a78bfa',
      '#fbbf24',
      '#f87171',
      '#34d399',
    ];
    
    const quantumState = QUANTUM_LINES.map((text, i) => ({
      full: text,
      text: '',
      color: colors[i % colors.length],
      charIndex: 0,
      stagger: Math.floor(Math.random() * 100),
      finished: false,
      lastUpdate: 0
    }));

    const drawBeam = (beam: Beam, cx: number, cy: number) => {
      const [r, g, b] = beam.color;
      const STEPS = 60;
      beam.hitPoints.length = 0;

      const startAngle = beam.angle;
      const endAngle   = beam.angle + beam.curveAngle * beam.curveDir;
      const moveSpeed = t * beam.speed * 1.5; 

      ctx.beginPath();
      for (let i = 0; i <= STEPS; i++) {
        const frac = i / STEPS;
        const a = startAngle + (endAngle - startAngle) * Math.pow(frac, 1.2);
        const d = beam.length * frac;
        const perp = a + Math.PI / 2;
        let ripple = 0;
        
        if (beam.isZigZag) {
          ripple = Math.sin(beam.amplitude * 0.15 * frac * Math.PI * 6 + moveSpeed + beam.phaseOffset) * beam.amplitude * Math.pow(frac, 0.7) * 4;
        } else {
          ripple = Math.sin(frac * Math.PI * 1.4 - moveSpeed * 1.8 + beam.phaseOffset) * beam.amplitude * Math.pow(frac, 1.25);
        }

        const x = cx + Math.cos(a) * d + Math.cos(perp) * ripple;
        const y = cy + Math.sin(a) * d + Math.sin(perp) * ripple;
        
        i === 0 ? ctx.moveTo(x,y) : ctx.lineTo(x,y);
        if (i % 6 === 0) beam.hitPoints.push({ x, y });
      }

      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = `rgba(${r},${g},${b},${beam.opacity * 0.1})`;
      ctx.lineWidth = beam.width * 10;
      ctx.stroke();
      ctx.strokeStyle = `rgba(${r},${g},${b},${beam.opacity * 0.3})`;
      ctx.lineWidth = beam.width * 4;
      ctx.stroke();
      ctx.strokeStyle = `rgba(${r},${g},${b},${beam.opacity * 0.9})`;
      ctx.lineWidth = beam.width * 1.1;
      ctx.stroke();
    };

    const drawTypewriter = (W: number, H: number) => {
      ctx.textBaseline = 'top';
      
      quantumState.forEach((line, i) => {
        if (!line.finished) {
          if (line.stagger > 0) {
            line.stagger--;
          } else {
            line.charIndex++;
            if (line.charIndex >= line.full.length) {
              line.finished = true;
            }
            if (line.finished && Math.random() < 0.005) {
              line.text = '';
              line.charIndex = 0;
              line.finished = false;
              line.stagger = 20;
            }
          }
        } else if (Math.random() < 0.001) {
          line.text = '';
          line.charIndex = 0;
          line.finished = false;
          line.stagger = 50;
        }
      });

      ctx.font = '18px "Space Mono", monospace';
      ctx.textAlign = 'left';
      quantumState.slice(0, 15).forEach((line, i) => {
        const txt = line.full.substring(0, line.charIndex);
        const py = H - 550 + i * 30;
        ctx.fillStyle = line.color;
        ctx.globalAlpha = 0.25;
        ctx.fillText(txt, 51, py);
        ctx.fillText(txt, 49, py);
        ctx.globalAlpha = 0.8;
        ctx.fillText(txt, 50, py);
      });

      ctx.font = '14px "Space Mono", monospace';
      ctx.textAlign = 'right';
      quantumState.slice(22).forEach((line, i) => {
        const txt = line.full.substring(0, line.charIndex);
        const py = H - 550 + i * 24;
        ctx.fillStyle = line.color;
        ctx.globalAlpha = 0.3;
        ctx.fillText(txt, W - 50, py);
      });
      
      ctx.globalAlpha = 1;
    };

    const draw = () => {
      const W = canvas.width;
      const H = canvas.height;
      const cx = W / 2;
      const cy = H / 2;
      const diag = Math.sqrt(W * W + H * H);

      ctx.globalAlpha = 1;
      const bg = ctx.createRadialGradient(cx, cy, 0, cx, cy, diag * 0.65);
      bg.addColorStop(0,   'rgba(15,5,42,1)');
      bg.addColorStop(0.3, 'rgba(8,3,26,1)');
      bg.addColorStop(0.7, 'rgba(4,1,14,1)');
      bg.addColorStop(1,   'rgba(0,0,0,1)');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      glitchTimer++;
      if (glitchTimer > 70 + Math.random() * 110) {
        glitchActive = true; glitchTimer = 0;
        glitchY = Math.random() * H;
        glitchH = 2 + Math.random() * 40;
      }
      if (glitchActive && glitchTimer > 3) glitchActive = false;

      if (Math.random() < 0.02) flickerOpacity = 0.25 + Math.random() * 0.6;
      else flickerOpacity += (1 - flickerOpacity) * 0.2;

      ctx.globalAlpha = flickerOpacity;

      beamsRef.current.forEach(beam => drawBeam(beam, cx, cy));

      ctx.globalAlpha = flickerOpacity * 0.8;
      const ringR = Math.min(W, H) * 0.42;
      const kVals = [4.0, 4.1, 4.7, 4.8];

      kVals.forEach((k, ki) => {
        const baseR = ringR * (0.85 + ki * 0.022);
        ctx.beginPath();
        for (let deg = 0; deg <= 360; deg += 2) {
          const a = (deg * Math.PI) / 180;
          const tFrac = deg / 360;
          const wave = Math.sin(k * 8 * tFrac * Math.PI + t * 0.55 + ki * 0.3) * 26
            * Math.exp(-Math.pow((tFrac - 0.5) * 2.2, 2) * 2.5);
          const r = baseR + wave;
          const x = cx + Math.cos(a) * r;
          const y = cy + Math.sin(a) * r;
          deg === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.closePath();
        const alpha = ki < 2 ? 0.55 : 0.38;
        const wCol  = ki < 2 ? `rgba(147,197,253,${alpha})` : `rgba(196,181,253,${alpha})`;
        
        ctx.strokeStyle = wCol;
        ctx.globalAlpha = 0.2;
        ctx.lineWidth = 4;
        ctx.stroke();
        ctx.globalAlpha = 1;
        ctx.lineWidth = 1.3;
        ctx.stroke();
      });

      ctx.beginPath();
      for (let deg = 0; deg <= 360; deg += 2) {
        const a = (deg * Math.PI) / 180;
        const tFrac = deg / 360;
        const sum = kVals.reduce((acc, k, ki) =>
          acc + Math.sin(k * 8 * tFrac * Math.PI + t * 0.55 + ki * 0.3), 0);
        const r = ringR * 0.87 + sum * 8;
        const x = cx + Math.cos(a) * r;
        const y = cy + Math.sin(a) * r;
        deg === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.strokeStyle = 'rgba(244,114,182,0.85)';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.strokeStyle = 'rgba(244,114,182,0.15)';
      ctx.lineWidth = 8;
      ctx.stroke();

      drawTypewriter(W, H);

      ctx.globalAlpha = flickerOpacity;
      const pulse = 1 + Math.sin(t * 2.1) * 0.07;
      const coreR  = Math.min(W, H) * 0.175 * pulse;

      const halo1 = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreR * 3.2);
      halo1.addColorStop(0,   'rgba(200,180,255,0.14)');
      halo1.addColorStop(0.4, 'rgba(6,182,212,0.07)');
      halo1.addColorStop(0.8, 'rgba(124,58,237,0.04)');
      halo1.addColorStop(1,   'transparent');
      ctx.fillStyle = halo1;
      ctx.beginPath(); ctx.arc(cx, cy, coreR * 3.2, 0, Math.PI*2); ctx.fill();

      const halo2 = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreR * 1.6);
      halo2.addColorStop(0,   'rgba(167,139,250,0.6)');
      halo2.addColorStop(0.5, 'rgba(124,58,237,0.35)');
      halo2.addColorStop(1,   'transparent');
      ctx.fillStyle = halo2;
      ctx.beginPath(); ctx.arc(cx, cy, coreR * 1.6, 0, Math.PI*2); ctx.fill();

      const halo3 = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreR);
      halo3.addColorStop(0,   'rgba(255,255,255,0.95)');
      halo3.addColorStop(0.2, 'rgba(165,243,252,0.85)');
      halo3.addColorStop(0.55,'rgba(6,182,212,0.6)');
      halo3.addColorStop(0.85,'rgba(124,58,237,0.2)');
      halo3.addColorStop(1,   'transparent');
      ctx.fillStyle = halo3;
      ctx.beginPath(); ctx.arc(cx, cy, coreR, 0, Math.PI*2); ctx.fill();

      const burstCt = 24;
      for (let i = 0; i < burstCt; i++) {
        const a = (i / burstCt) * Math.PI * 2 + t * 0.04;
        const len = coreR * (1.1 + 0.6 * Math.abs(Math.sin(i * 1.7 + t * 0.25)));
        const grd = ctx.createLinearGradient(cx, cy, cx + Math.cos(a)*len, cy + Math.sin(a)*len);
        grd.addColorStop(0,   'rgba(255,255,255,0.75)');
        grd.addColorStop(0.25,'rgba(200,230,255,0.4)');
        grd.addColorStop(0.6, 'rgba(180,100,60,0.15)');
        grd.addColorStop(1,   'transparent');
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(a)*len, cy + Math.sin(a)*len);
        ctx.strokeStyle = grd;
        ctx.lineWidth = 1.2 + Math.sin(i*0.8+t)*0.5;
        ctx.stroke();
      }

      const hotCore = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreR * 0.22 * pulse);
      hotCore.addColorStop(0, 'rgba(255,255,255,1)');
      hotCore.addColorStop(0.6,'rgba(255,255,255,0.95)');
      hotCore.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = hotCore;
      ctx.beginPath(); ctx.arc(cx, cy, coreR * 0.22 * pulse, 0, Math.PI*2); ctx.fill();

      ctx.globalAlpha = 0.05;
      for (let sy = 0; sy < H; sy += 4) {
        ctx.fillStyle = 'rgba(0,0,0,1)';
        ctx.fillRect(0, sy, W, 1.5);
      }

      if (glitchActive) {
        ctx.globalAlpha = 0.6;
        const offset = (Math.random() - 0.5) * 80;
        try {
          ctx.drawImage(canvas, 0, glitchY, W, glitchH, offset, glitchY, W, glitchH);
        } catch (_) {}
        ctx.globalAlpha = 0.35;
        ctx.fillStyle = `rgba(255,0,100,${0.06 + Math.random()*0.1})`;
        ctx.fillRect(0, glitchY, W, glitchH);
      }

      ctx.globalAlpha = 1;
      const vig = ctx.createRadialGradient(cx, cy, diag*0.2, cx, cy, diag*0.8);
      vig.addColorStop(0, 'transparent');
      vig.addColorStop(1, 'rgba(0,0,0,0.72)');
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, W, H);

      t += 0.024;
      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, [canvasRef, beamsRef, onBeamHover]);
}

interface TooltipState {
  beam: Beam;
  x: number;
  y: number;
}

function BeamTooltip({ tooltip }: { tooltip: TooltipState | null }) {
  if (!tooltip) return null;
  const { beam, x, y } = tooltip;
  const [r, g, b] = beam.color;

  return (
    <div
      className="fixed pointer-events-none"
      style={{
        left: x + 16,
        top:  y - 10,
        zIndex: 200,
        background: 'rgba(5,5,20,0.88)',
        border: `1px solid rgba(${r},${g},${b},0.5)`,
        borderRadius: '4px',
        padding: '8px 12px',
        backdropFilter: 'blur(8px)',
        boxShadow: `0 0 16px rgba(${r},${g},${b},0.25)`,
        fontFamily: 'var(--font-space-mono), monospace',
        fontSize: '0.62rem',
        lineHeight: '1.8',
        color: '#e2e8f0',
        maxWidth: '220px',
        animation: 'tooltip-in 0.15s ease',
      }}
    >
      <div style={{ color: `rgba(${r},${g},${b},1)`, fontWeight: 700, letterSpacing: '0.1em', marginBottom: 4 }}>
        {beam.physics.type}
      </div>
      <div style={{ color: 'rgba(147,197,253,0.9)' }}>
        λ&nbsp;&nbsp;<span style={{ color: '#f1f5f9' }}>{beam.physics.wavelength} nm</span>
      </div>
      <div style={{ color: 'rgba(134,239,172,0.9)' }}>
        ν&nbsp;&nbsp;<span style={{ color: '#f1f5f9' }}>{beam.physics.frequency}</span>
      </div>
      <div style={{ color: 'rgba(251,191,36,0.9)' }}>
        E&nbsp;&nbsp;<span style={{ color: '#f1f5f9' }}>{beam.physics.energy}</span>
      </div>
      <style jsx>{`
        @keyframes tooltip-in {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

function GlitchOverlay() {
  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 50 }}>
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(90deg, rgba(255,0,68,0.035) 0%, transparent 12%, transparent 88%, rgba(0,255,255,0.035) 100%)',
        animation: 'chroma-drift 2.8s ease-in-out infinite alternate',
      }} />
      <div className="absolute left-0 right-0" style={{
        height: '2px', background: 'rgba(6,182,212,0.45)',
        animation: 'glitch-bar-h 5.7s steps(1) infinite', mixBlendMode: 'screen',
      }} />
      <div className="absolute" style={{
        width: '35%', height: '2px', background: 'rgba(236,72,153,0.4)',
        animation: 'block-glitch-h 8.2s steps(1) infinite', mixBlendMode: 'screen',
      }} />
      <div className="absolute left-0 right-0" style={{
        height: '1px', background: 'rgba(255,255,255,0.15)',
        animation: 'row-flicker 3.1s steps(1) infinite',
      }} />

      <style jsx>{`
        @keyframes chroma-drift {
          0%   { transform: translateX(0px); opacity: 0.5; }
          40%  { opacity: 0.9; }
          100% { transform: translateX(4px); opacity: 0.6; }
        }
        @keyframes glitch-bar-h {
          0%  {top:12%;opacity:.7;height:1px} 10%{top:68%;opacity:0}
          20% {top:33%;opacity:.9;height:4px} 30%{top:82%;opacity:.3;height:1px}
          40% {top:6%;opacity:.8;height:2px}  50%{top:51%;opacity:0}
          60% {top:24%;opacity:.6;height:3px} 70%{top:78%;opacity:.25;height:1px}
          80% {top:42%;opacity:.9;height:2px} 90%{top:91%;opacity:.15}
          100%{top:12%;opacity:.7}
        }
        @keyframes block-glitch-h {
          0%  {left:20%;top:31%;opacity:0}  13%{left:54%;top:16%;opacity:.7}
          14% {opacity:0}                    46%{left:11%;top:73%;opacity:.5}
          47% {opacity:0}                    79%{left:71%;top:56%;opacity:.3}
          80% {opacity:0}                   100%{opacity:0}
        }
        @keyframes row-flicker {
          0%  {top:20%;opacity:.12} 15%{top:75%;opacity:0}
          30% {top:45%;opacity:.2}  45%{top:8%;opacity:0}
          60% {top:63%;opacity:.1}  75%{top:88%;opacity:0}
          90% {top:35%;opacity:.18} 100%{top:20%;opacity:.12}
        }
      `}</style>
    </div>
  );
}

export default function HeroScene() {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const beamsRef   = useRef<Beam[]>([]);
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);

  const onBeamHover = useCallback((beam: Beam | null, mx: number, my: number) => {
    setTooltip(beam ? { beam, x: mx, y: my } : null);
  }, []);

  useHeroCanvas(canvasRef, beamsRef, onBeamHover);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const HIT_DIST = 22;
    let closest: Beam | null = null;
    let closestD = Infinity;

    for (const beam of beamsRef.current) {
      for (const pt of beam.hitPoints) {
        const d = Math.hypot(pt.x - mx, pt.y - my);
        if (d < HIT_DIST && d < closestD) {
          closestD = d;
          closest  = beam;
        }
      }
    }
    onBeamHover(closest, mx, my);
  }, [onBeamHover]);

  const handleMouseLeave = useCallback(() => setTooltip(null), []);

  return (
    <div
      className="relative w-full h-full overflow-hidden cursor-crosshair"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ willChange: 'transform, opacity' }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ zIndex: 1, display: 'block', contain: 'strict' }}
      />

      <GlitchOverlay />

      <BeamTooltip tooltip={tooltip} />
    </div>
  );
}
