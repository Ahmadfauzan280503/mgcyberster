"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Mail, 
  Phone, 
  MapPin, 
  ArrowUpRight, 
  ChevronUp,
  Instagram,
  Youtube
} from "lucide-react";

const footerLinks = {
  layanan: [
    { label: "Exclusive Showroom", href: "#layanan" },
    { label: "Premium Test Drive", href: "#layanan" },
    { label: "Specialized Service", href: "#layanan" },
    { label: "Konsultasi Gratis", href: "#layanan" },
  ],
  produk: [
    { label: "MG Cyberster", href: "#produk-mobil" },
    { label: "BMW Collection", href: "#produk-mobil" },
    { label: "Ferrari Series", href: "#produk-mobil" },
    { label: "Porsche Line", href: "#produk-mobil" },
  ],
  perusahaan: [
    { label: "Tentang Kami", href: "#about" },
    { label: "Karir", href: "#" },
    { label: "Blog & Berita", href: "#" },
    { label: "Kebijakan Privasi", href: "#" },
  ],
};

const socialLinks = [
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Youtube, href: "#", label: "YouTube" },
];

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative w-full bg-zinc-950 text-white overflow-hidden">
      {/* Gradient top border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
      
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Newsletter Section */}
      <div className="relative max-w-7xl mx-auto px-6 pt-20 pb-12">
        <div className="bg-gradient-to-br from-zinc-900 to-zinc-900/50 border border-zinc-800 rounded-3xl p-8 md:p-12 mb-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold tracking-tight">
                Dapatkan Update <span className="text-blue-400">Terbaru</span>
              </h3>
              <p className="text-zinc-400 text-sm mt-2 max-w-md">
                Subscribe untuk mendapatkan informasi terbaru mengenai koleksi mobil dan penawaran eksklusif.
              </p>
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto">
              <input
                type="email"
                placeholder="Email kamu..."
                className="flex-1 md:w-72 bg-zinc-800/50 border border-zinc-700/50 px-5 py-3.5 rounded-xl text-sm text-white placeholder:text-zinc-500 outline-none focus:border-blue-500/50 transition-colors"
              />
              <button className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3.5 rounded-xl font-semibold text-sm transition-colors whitespace-nowrap flex items-center gap-1.5 shadow-sm shadow-blue-500/20">
                Subscribe
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Footer Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10 lg:gap-16 mb-16">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <span className="text-xl font-black tracking-tight">
                MG<span className="text-blue-400">.</span>
              </span>
            </Link>
            <p className="text-zinc-400 text-sm leading-relaxed mb-6 max-w-xs">
              Showroom mobil mewah dan supercar terpercaya di Indonesia. Pengalaman eksklusif untuk pecinta otomotif.
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 rounded-xl bg-zinc-800/50 border border-zinc-700/50 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-700/50 hover:border-zinc-600 transition-all"
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4" />
                </motion.a>
              ))}
              {/* X (Twitter) custom icon */}
              <motion.a
                href="#"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 rounded-xl bg-zinc-800/50 border border-zinc-700/50 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-700/50 hover:border-zinc-600 transition-all"
                aria-label="X"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </motion.a>
            </div>
          </div>

          {/* Layanan */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500 mb-5">Layanan</h4>
            <ul className="space-y-3">
              {footerLinks.layanan.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-zinc-400 hover:text-white transition-colors inline-flex items-center gap-1 group"
                  >
                    {link.label}
                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-0.5 group-hover:opacity-100 group-hover:translate-y-0 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Produk */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500 mb-5">Produk</h4>
            <ul className="space-y-3">
              {footerLinks.produk.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-zinc-400 hover:text-white transition-colors inline-flex items-center gap-1 group"
                  >
                    {link.label}
                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-0.5 group-hover:opacity-100 group-hover:translate-y-0 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Perusahaan + Contact */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500 mb-5">Perusahaan</h4>
            <ul className="space-y-3 mb-8">
              {footerLinks.perusahaan.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-zinc-400 hover:text-white transition-colors inline-flex items-center gap-1 group"
                  >
                    {link.label}
                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-0.5 group-hover:opacity-100 group-hover:translate-y-0 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
            
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500 mb-4">Kontak</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-zinc-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-zinc-400">ahmadfauzan280503@gmail.com</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-zinc-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-zinc-400">+62 821 7756 1275</span>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-zinc-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-zinc-400">Kota Makassar, Sulawesi Selatan</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-zinc-800/50 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-zinc-500 text-center sm:text-left">
            © {new Date().getFullYear()} MG Cyberster Showroom. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="#" className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
              Kebijakan Privasi
            </Link>
            <Link href="#" className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
              Syarat & Ketentuan
            </Link>
            <motion.button
              onClick={scrollToTop}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="w-9 h-9 rounded-xl bg-zinc-800/50 border border-zinc-700/50 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-700/50 transition-all"
              aria-label="Back to top"
            >
              <ChevronUp className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </div>
    </footer>
  );
}
