"use client";

import { motion } from "framer-motion";

export const AnimatedUnderline = () => {
  return (
    <svg
      className="absolute -bottom-2 left-0 w-full h-3 text-zinc-950 dark:text-white opacity-40"
      viewBox="0 0 100 10"
      fill="none"
      preserveAspectRatio="none"
    >
      <motion.path
        d="M0 5 Q 25 0, 50 5 T 100 5"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{
          duration: 1.2,
          ease: "easeInOut",
          delay: 0.5,
        }}
      />
    </svg>
  );
};
