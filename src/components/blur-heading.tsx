"use client";

import React from "react";
import { motion } from "framer-motion";

interface BlurHeadingProps {
  text: string;
  className?: string;
  spanClassName?: string;
}

const BlurHeading: React.FC<BlurHeadingProps> = ({ text, className, spanClassName }) => {
  const words = text.split(" ");

  return (
    <h1 className={className}>
      {words.map((word, wordIndex) => (
        <span key={`word-${wordIndex}`} className="inline-block whitespace-nowrap">
          {word.split("").map((char, charIndex) => (
            <motion.span
              key={`${char}-${charIndex}`}
              className={`inline-block transition-all duration-300 ease-out cursor-default ${spanClassName}`}
              initial={{ filter: "blur(0px)", scale: 1, opacity: 1 }}
              whileHover={{ 
                filter: "blur(6px)", 
                scale: 1.15,
                opacity: 0.9,
                transition: { duration: 0.15, ease: "easeOut" } 
              }}
            >
              {char}
            </motion.span>
          ))}
          {wordIndex < words.length - 1 && (
            <span className="inline-block">&nbsp;</span>
          )}
        </span>
      ))}
    </h1>
  );
};

export default BlurHeading;
