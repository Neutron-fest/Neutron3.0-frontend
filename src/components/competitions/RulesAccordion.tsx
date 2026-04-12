"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface RuleItem {
  title: string;
  content: string;
}

interface RulesAccordionProps {
  rules: RuleItem[];
}

export default function RulesAccordion({ rules }: RulesAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="w-full space-y-3 sm:space-y-4 md:space-y-6">
      {rules.map((rule, index) => (
        <div 
          key={index} 
          className="bg-[#F4F2EB] border-[3px] sm:border-4 border-[#2c2820] shadow-[4px_4px_0_rgba(44,40,32,1)] sm:shadow-[6px_6px_0_rgba(44,40,32,1)] overflow-hidden transition-all duration-200"
        >
          <button
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            className="w-full px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-5 flex items-center justify-between text-left gap-3 sm:gap-4 group hover:bg-[#2c2820]/5 transition-colors"
          >
            <div className="flex items-center gap-2.5 sm:gap-4 md:gap-6 min-w-0">
              <span className="font-mono text-[0.75rem] sm:text-[0.95rem] md:text-[1.1rem] text-[#E58B43] font-bold opacity-70 shrink-0">
                [0{index + 1}]
              </span>
              <h4 className="text-[1rem] sm:text-[1.25rem] md:text-[1.7rem] lg:text-[2rem] font-bold uppercase tracking-tight text-[#2c2820] wrap-break-word">
                {rule.title}
              </h4>
            </div>
            <motion.div
              animate={{ rotate: openIndex === index ? 180 : 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="shrink-0"
            >
              <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-[#2c2820]" />
            </motion.div>
          </button>

          <AnimatePresence>
            {openIndex === index && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="px-3 sm:px-4 md:px-6 pb-4 sm:pb-6 md:pb-8 pt-2 border-t-2 border-[#2c2820] border-dashed ml-10 sm:ml-12 md:ml-16 mr-3 sm:mr-4 md:mr-6">
                  <p className="text-[0.9rem] sm:text-[1.05rem] md:text-[1.3rem] lg:text-[1.55rem] leading-relaxed text-[#4d473d] font-medium italic">
                    {rule.content}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
