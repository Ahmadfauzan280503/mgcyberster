"use client";

import React from "react";
import { motion } from "framer-motion";

export const Logo = () => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center gap-1 cursor-pointer group"
    >
      <span className="text-xl font-black tracking-tighter text-white transition-transform group-hover:scale-105">
        MG Cyberster<span className="text-blue-500">.</span>
      </span>
    </motion.div>
  );
};
