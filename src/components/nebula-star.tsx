"use client";

import Link from 'next/link';
import React, { useId } from 'react';
import styled from 'styled-components';

interface NebulaStarProps {
  label: string;
  href: string;
  drift: string;
  delay: string;
  color?: string;
  size?: number;
}

const NebulaStar = ({ label, href, drift, delay, color = "#f0c060", size = 0.25 }: NebulaStarProps) => {
  const maskId = useId().replace(/:/g, "");

  return (
    <StyledWrapper style={{ animation: drift, animationDelay: delay }} $size={size}>
      <Link href={href} className="group flex flex-col items-center gap-1">
        <div className="loader">
          <svg width={100} height={100} viewBox="0 0 100 100">
            <defs>
              <mask id={maskId}>
                <polygon points="0,0 100,0 100,100 0,100" fill="black" />
                <polygon points="25,25 75,25 50,75" fill="white" />
                <polygon points="50,25 75,75 25,75" fill="white" />
                <polygon points="35,35 65,35 50,65" fill="white" />
                <polygon points="35,35 65,35 50,65" fill="white" />
                <polygon points="35,35 65,35 50,65" fill="white" />
                <polygon points="35,35 65,35 50,65" fill="white" />
              </mask>
            </defs>
          </svg>
          <div className="box" style={{ mask: `url(#${maskId})`, WebkitMask: `url(#${maskId})` }} />
        </div>
        <span
          className="whitespace-nowrap px-3 py-1 text-[0.62rem] font-medium uppercase tracking-[0.22em] opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 translate-y-12"
          style={{
            background: "rgba(10,4,0,0.82)",
            border: `1px solid ${color}55`,
            backdropFilter: "blur(10px)",
            color,
            fontFamily: "monospace",
            boxShadow: `0 4px 20px ${color}22`,
            clipPath: "polygon(4px 0%,calc(100% - 4px) 0%,100% 4px,100% 100%,0% 100%,0% 4px)",
          }}
        >
          {label}
        </span>
      </Link>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div<{ $size: number }>`
  .loader {
    --color-one: #ffbf48;
    --color-two: #be4a1d;
    --color-three: #ffbf4780;
    --color-four: #bf4a1d80;
    --color-five: #ffbf4740;
    --time-animation: 2.4s;
    --size: ${props => props.$size}; 
    position: relative;
    width: 100px;
    height: 100px;
    border-radius: 50%;
    transform: scale(var(--size));
    transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    box-shadow:
      0 0 25px 0 var(--color-three),
      0 10px 30px 0 var(--color-four);
    animation: colorize calc(var(--time-animation) * 4) ease-in-out infinite;
  }

  .group:hover .loader {
    transform: scale(calc(var(--size) * 1.5));
    box-shadow:
      0 0 45px 0 var(--color-one),
      0 15px 50px 0 var(--color-two);
  }

  .loader::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background: linear-gradient(180deg, var(--color-five), var(--color-four));
    box-shadow:
      inset 0 10px 10px 0 var(--color-three),
      inset 0 -10px 10px 0 var(--color-four);
  }

  .loader .box {
    width: 100px;
    height: 100px;
    background: linear-gradient(
      180deg,
      var(--color-one) 30%,
      var(--color-two) 70%
    );
  }

  .loader svg {
    position: absolute;
    top: 0;
    left: 0;
  }

  .loader svg mask {
    filter: contrast(15);
    animation: roundness calc(var(--time-animation) / 2) linear infinite;
  }

  .loader svg mask polygon {
    filter: blur(7px);
  }

  .loader svg mask polygon:nth-child(2) {
    transform-origin: 75% 25%;
    transform: rotate(90deg);
  }

  .loader svg mask polygon:nth-child(3) {
    transform-origin: 50% 50%;
    animation: rotation var(--time-animation) linear infinite reverse;
  }

  .loader svg mask polygon:nth-child(4) {
    transform-origin: 50% 60%;
    animation: rotation var(--time-animation) linear infinite;
    animation-delay: calc(var(--time-animation) / -3);
  }

  .loader svg mask polygon:nth-child(5) {
    transform-origin: 40% 40%;
    animation: rotation var(--time-animation) linear infinite reverse;
  }

  .loader svg mask polygon:nth-child(6) {
    transform-origin: 40% 40%;
    animation: rotation var(--time-animation) linear infinite reverse;
    animation-delay: calc(var(--time-animation) / -2);
  }

  .loader svg mask polygon:nth-child(7) {
    transform-origin: 60% 40%;
    animation: rotation var(--time-animation) linear infinite;
  }

  .loader svg mask polygon:nth-child(8) {
    transform-origin: 60% 40%;
    animation: rotation var(--time-animation) linear infinite;
    animation-delay: calc(var(--time-animation) / -1.5);
  }

  @keyframes rotation {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  @keyframes roundness {
    0%, 100% {
      filter: contrast(15);
    }
    25%, 75% {
      filter: contrast(3);
    }
  }

  @keyframes colorize {
    0%, 100% {
      filter: hue-rotate(0deg);
    }
    50% {
      filter: hue-rotate(-60deg);
    }
  }
`;

export default NebulaStar;
