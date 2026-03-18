"use client";

import React from "react";
import { motion } from "framer-motion";
import { Logo } from "./Logo";
import { Moon, Sun, Menu, X } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { useCart } from "./CartContext";
import Link from "next/link";
import { AnimatePresence } from "framer-motion";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Layanan", href: "/#layanan" },
  { name: "Produk Mobil", href: "/#produk-mobil" },
  { name: "Daftar Harga", href: "/pricing" },
  { name: "About", href: "/#about" },
];

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { cartCount } = useCart();
  const [isOpen, setIsOpen] = React.useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <motion.header
      initial={{ y: -100, x: "-50%", opacity: 0 }}
      animate={{ y: 0, x: "-50%", opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed top-4 md:top-8 left-1/2 z-50 flex items-center justify-between px-6 md:px-8 py-3 
        w-[95%] max-w-6xl rounded-full border border-zinc-800 shadow-2xl backdrop-blur-md transition-all duration-500
        bg-zinc-950 dark:bg-black/100 text-white`}
    >
      {/* Left Column - Logo */}
      <div className="flex-shrink-0 z-50">
        <Logo />
      </div>

      {/* Center Column - Desktop Menu */}
      <nav className="hidden md:flex flex-grow justify-center items-center gap-8">
        {navLinks.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            className="text-[11px] uppercase font-bold tracking-[0.1em] text-zinc-400 hover:text-white transition-all relative group"
          >
            {link.name}
            <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-white rounded-full transition-all group-hover:w-full" />
          </Link>
        ))}
      </nav>

      {/* Right Column - Action Buttons & Mobile Toggle */}
      <div className="flex items-center gap-2 md:gap-6 z-50">
        <button
          onClick={toggleTheme}
          className="text-zinc-400 hover:text-white transition-colors p-2"
          aria-label="Toggle Theme"
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <Link href="/cart" className="relative group flex items-center">
          <button
            className="hidden sm:flex items-center gap-3 px-6 py-2.5 bg-white text-black text-[11px] font-bold uppercase tracking-wider rounded-full hover:scale-105 transition-all shadow-lg active:scale-95"
          >
            Pesan Sekarang
          </button>
          
          <div className="sm:hidden w-10 h-10 bg-white rounded-full flex items-center justify-center text-black relative">
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth="2.5">
               <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
             {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#BEF264] text-black text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-zinc-950 shadow-xl">
                {cartCount}
              </span>
            )}
          </div>

          {cartCount > 0 && (
            <span className="hidden sm:flex absolute -top-2 -right-2 bg-[#BEF264] text-black text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-zinc-950 shadow-xl z-10 transition-transform group-hover:scale-110">
              {cartCount}
            </span>
          )}
        </Link>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          className="md:hidden text-zinc-400 hover:text-white transition-colors p-2"
          aria-label="Toggle Menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="absolute top-16 left-0 w-full overflow-hidden bg-zinc-950/95 backdrop-blur-xl border border-zinc-800 rounded-[2rem] shadow-2xl md:hidden flex flex-col items-center py-8 gap-6 z-40"
          >
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={closeMenu}
                className="text-sm uppercase font-bold tracking-[0.2em] text-zinc-400 hover:text-white transition-all"
              >
                {link.name}
              </Link>
            ))}
            <div className="w-[80%] h-px bg-zinc-800 my-2" />
            <Link href="/cart" onClick={closeMenu} className="w-[80%]">
               <button className="w-full py-4 bg-white text-black text-xs font-bold uppercase tracking-widest rounded-2xl shadow-xl active:scale-95 transition-transform">
                  Pesan Sekarang
               </button>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
