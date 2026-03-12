"use client";

import React from "react";
import { motion } from "framer-motion";
import { Home, Briefcase, LayoutGrid, DollarSign, MessageCircle } from "lucide-react";

const dockItems = [
  { icon: Home, label: "Home", href: "#" },
  { icon: LayoutGrid, label: "Services", href: "#" },
  { icon: Briefcase, label: "Portfolio", href: "#" },
  { icon: DollarSign, label: "Pricing", href: "#" },
  { icon: MessageCircle, label: "Contact", href: "#" },
];

export default function BottomNav() {
  return (
    <motion.div
      initial={{ y: 100, x: "-50%", opacity: 0 }}
      animate={{ y: 0, x: "-50%", opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-3 py-1.5 bg-white/70 dark:bg-black/70 backdrop-blur-md rounded-2xl border border-black/10 dark:border-white/10 shadow-2xl flex items-center gap-5 sm:gap-6"
    >
      {dockItems.map((item, index) => (
        <a
          key={item.label}
          href={item.href}
          className="group relative flex flex-col items-center justify-center p-2 text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white transition-all duration-300"
        >
          <item.icon size={20} className="group-hover:scale-125 transition-transform duration-300" />
          
          {/* Tooltip */}
          <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-black dark:bg-white text-white dark:text-black text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap font-bold uppercase tracking-wider">
            {item.label}
          </span>
          
          {/* Indicator */}
          {index === 0 && (
             <motion.div 
               layoutId="active"
               className="absolute -bottom-1 w-1 h-1 bg-blue-600 rounded-full"
             />
          )}
        </a>
      ))}
    </motion.div>
  );
}
