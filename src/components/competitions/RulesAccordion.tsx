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
    <div className="w-full space-y-6">
      {rules.map((rule, index) => (
        <div 
          key={index} 
          className="bg-[#F4F2EB] border-4 border-[#2c2820] shadow-[6px_6px_0_rgba(44,40,32,1)] overflow-hidden transition-all duration-200"
        >
          <button
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            className="w-full px-6 py-5 flex items-center justify-between text-left group hover:bg-[#2c2820]/5 transition-colors"
          >
            <div className="flex items-center gap-6">
              <span className="font-mono text-[1.2rem] text-[#E58B43] font-bold opacity-70">
                [0{index + 1}]
              </span>
              <h4 className="text-[1.8rem] md:text-[2.2rem] font-bold uppercase tracking-tight text-[#2c2820]">
                {rule.title}
              </h4>
            </div>
            <motion.div
              animate={{ rotate: openIndex === index ? 180 : 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <ChevronDown className="w-8 h-8 md:w-10 md:h-10 text-[#2c2820]" />
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
                <div className="px-6 pb-8 pt-2 border-t-2 border-[#2c2820] border-dashed ml-16 mr-6">
                  <p className="text-[1.4rem] md:text-[1.7rem] leading-relaxed text-[#4d473d] font-medium italic">
                    {rule.content}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}

      <style jsx>{`
        .rules-accordion-item:last-child {
          border-bottom: none;
        }
      `}</style>
    </div>
  );
}
