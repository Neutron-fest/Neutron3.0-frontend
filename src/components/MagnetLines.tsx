"use client"

import React, { useRef, useEffect, CSSProperties } from 'react';

interface MagnetLinesProps {
  rows?: number;
  columns?: number;
  containerSize?: string;
  lineColor?: string;
  lineWidth?: string;
  lineHeight?: string;
  baseAngle?: number;
  className?: string;
  style?: CSSProperties;
}

const MagnetLines: React.FC<MagnetLinesProps> = ({
  rows = 15,
  columns = 25,
  containerSize = '100vw',
  lineColor = '#a855f7',
  lineWidth = '20px',
  lineHeight = '6px',
  baseAngle = 0,
  className = '',
  style = {}
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const items = container.querySelectorAll<HTMLSpanElement>('span');

    const onPointerMove = (pointer: { x: number; y: number }) => {
      items.forEach(item => {
        const rect = item.getBoundingClientRect();
        const centerX = rect.x + rect.width / 2;
        const centerY = rect.y + rect.height / 2;

        const b = pointer.x - centerX;
        const a = pointer.y - centerY;
        const c = Math.sqrt(a * a + b * b) || 1;
        const r = ((Math.acos(b / c) * 180) / Math.PI) * (pointer.y > centerY ? 1 : -1);

        item.style.setProperty('--rotate', `${r}deg`);
      });
    };

    const handlePointerMove = (e: PointerEvent) => {
      onPointerMove({ x: e.x, y: e.y });
    };

    window.addEventListener('pointermove', handlePointerMove);

    if (items.length) {
      const middleIndex = Math.floor(items.length / 2);
      const rect = items[middleIndex].getBoundingClientRect();
      onPointerMove({ x: rect.x, y: rect.y });
    }

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
    };
  }, []);

  const total = rows * columns;
  const spans = Array.from({ length: total }, (_, i) => (
    <span
      key={i}
      className="magnet-line block origin-center rounded-full"
      style={
        {
          backgroundColor: lineColor,
          width: lineWidth,
          height: lineHeight,
          boxShadow: `0 0 15px ${lineColor}66`,
          "--rotate": `${baseAngle}deg`,
          transform: "rotate(var(--rotate))",
          willChange: "transform",
          filter: "url(#roughEdge)",
        } as React.CSSProperties
      }
    />
  ));

  return (
    <div className="relative w-full h-full overflow-hidden bg-transparent">
      <svg className="absolute invisible w-0 h-0">
        <defs>
          <filter id="roughEdge">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" />
          </filter>
        </defs>
      </svg>

      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.08] mix-blend-overlay z-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      <style jsx>{`
        .magnet-line {
          animation: glitch 4s infinite ease-in-out alternate;
          animation-delay: var(--delay, 0s);
        }

        @keyframes glitch {
          0%, 100% { transform: rotate(var(--rotate)) scale(1); opacity: 1; }
          92% { transform: rotate(var(--rotate)) scale(1); opacity: 1; filter: url(#roughEdge); }
          93% { transform: rotate(var(--rotate)) scale(1.05) translate(1px, -1px); opacity: 0.8; filter: hue-rotate(90deg) url(#roughEdge); }
          94% { transform: rotate(var(--rotate)) scale(0.95) translate(-2px, 1px); opacity: 1; filter: hue-rotate(-90deg) url(#roughEdge); }
          95% { transform: rotate(var(--rotate)) scale(1); opacity: 1; filter: url(#roughEdge); }
        }
      `}</style>

      <div
        ref={containerRef}
        className={`grid place-items-center w-full h-full ${className}`}
        style={{
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gridTemplateRows: `repeat(${rows}, 1fr)`,
          padding: '2rem',
          ...style
        }}
      >
        {spans.map((span, i) => React.cloneElement(span, { 
          style: { ...span.props.style, '--delay': `${(i % 5) * 0.2}s` } 
        }))}
      </div>
    </div>
  );
};

export default MagnetLines;
