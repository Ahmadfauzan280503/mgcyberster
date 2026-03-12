"use client";

import React from "react";
import { motion } from "framer-motion";
import { Logo } from "./Logo";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { useCart } from "./CartContext";
import Link from "next/link";

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

  return (
    <motion.header
      initial={{ y: -100, x: "-50%", opacity: 0 }}
      animate={{ y: 0, x: "-50%", opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed top-8 left-1/2 z-50 flex items-center px-8 py-3 
        w-[95%] max-w-6xl rounded-full border border-zinc-800 shadow-2xl backdrop-blur-md transition-all duration-500
        bg-zinc-950 dark:bg-black/100 text-white`}
    >
      {/* Left Column - Logo */}
      <div className="flex-shrink-0">
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

      {/* Right Column - Action Buttons */}
      <div className="flex items-center gap-6">
        <button
          onClick={toggleTheme}
          className="text-zinc-400 hover:text-white transition-colors p-2"
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <Link href="/cart" className="relative group flex items-center">
          <button
            className="flex items-center gap-3 px-6 py-2.5 bg-white text-black text-[11px] font-bold uppercase tracking-wider rounded-full hover:scale-105 transition-all shadow-lg active:scale-95"
          >
            Pesan Sekarang
          </button>
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-[#BEF264] text-black text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-zinc-950 shadow-xl z-10 transition-transform group-hover:scale-110">
              {cartCount}
            </span>
          )}
        </Link>

      </div>
    </motion.header>
  );
}
