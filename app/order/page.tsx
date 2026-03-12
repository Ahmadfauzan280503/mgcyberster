"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Send } from "lucide-react";
import Link from "next/link";

export default function OrderPage() {
  return (
    <div className="min-h-screen bg-[#EBE7E1] dark:bg-zinc-950 flex flex-col items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl bg-[#F9F8F6] dark:bg-zinc-900 rounded-[40px] shadow-2xl border border-zinc-200 dark:border-zinc-800 p-8 sm:p-12 overflow-hidden relative"
      >
        {/* Background Decor */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-secondary/10 rounded-full -ml-16 -mb-16 blur-3xl" />

        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-zinc-500 hover:text-primary transition-colors mb-8 font-bold text-sm uppercase tracking-widest"
        >
          <ArrowLeft size={16} />
          Back to Home
        </Link>

        <div className="mb-10">
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4">Pesan Sekarang</h1>
          <p className="text-zinc-600 dark:text-zinc-400 font-medium">
            Silahkan isi formulir di bawah ini untuk memulai proyek desain Anda bersama kami.
          </p>
        </div>

        <form className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-zinc-400 ml-1">Nama Lengkap</label>
              <input 
                type="text" 
                placeholder="John Doe"
                className="w-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl p-4 outline-none focus:border-primary transition-colors text-sm font-medium"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-zinc-400 ml-1">Email</label>
              <input 
                type="email" 
                placeholder="john@example.com"
                className="w-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl p-4 outline-none focus:border-primary transition-colors text-sm font-medium"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-zinc-400 ml-1">Jenis Proyek</label>
            <select className="w-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl p-4 outline-none focus:border-primary transition-colors text-sm font-medium appearance-none">
              <option>Desain Grafis</option>
              <option>UI/UX Design</option>
              <option>Branding & Logo</option>
              <option>Social Media Content</option>
              <option>Lainnya</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-zinc-400 ml-1">Deskripsi Proyek</label>
            <textarea 
              rows={4}
              placeholder="Ceritakan detail proyek Anda..."
              className="w-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl p-4 outline-none focus:border-primary transition-colors text-sm font-medium resize-none"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-primary text-white py-5 rounded-[24px] font-black uppercase tracking-[0.2em] text-sm shadow-xl shadow-primary/20 flex items-center justify-center gap-3 mt-4"
          >
            Kirim Pesanan
            <Send size={18} strokeWidth={3} />
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
