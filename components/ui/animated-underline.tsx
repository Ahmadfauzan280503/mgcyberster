"use client";

import { motion } from "framer-motion";

export const AnimatedUnderline = () => {
  return (
    <svg
      className="absolute -bottom-2 left-0 w-full h-3 text-zinc-300 dark:text-zinc-600"
      viewBox="0 0 200 12"
      fill="none"
      preserveAspectRatio="none"
    >
      <motion.path
        d="M2 10C50 2 150 2 198 10"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{
          duration: 1.5,
          ease: "easeInOut",
          delay: 0.5,
        }}
      />
    </svg>
  );
};
