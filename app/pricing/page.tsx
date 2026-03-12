"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import { Check, ArrowRight } from "lucide-react";

const pricingPlans = [
  {
    name: "Classic",
    price: "IDR 500jt",
    description: "Ideal untuk kolektor pemula yang ingin memulai koleksi mobil sport.",
    features: [
      "Akses ke Showroom Eksklusif",
      "Konsultasi Standar",
      "Layanan Perawatan Dasar",
      "1x Test Drive Mobil Classic",
    ],
    highlight: false,
  },
  {
    name: "Premium",
    price: "IDR 2M",
    description: "Pilihan terbaik untuk pengalaman berkendara mewah dan performa tinggi.",
    features: [
      "Unit Rare & Limited Edition",
      "Konsultasi VVIP 24/7",
      "Layanan Perawatan Khusus",
      "Unlimited Test Drive",
      "Pengiriman Prioritas",
    ],
    highlight: true,
  },
  {
    name: "Exotic",
    price: "IDR 10M+",
    description: "Untuk kolektor sejati yang menginginkan karya seni otomotif terbaik.",
    features: [
      "Custom Order (Bespoke)",
      "Akses Pre-launch Global",
      "Private Track Day Event",
      "Concierge Otomotif Pribadi",
      "Asuransi All-Risk Premium",
    ],
    highlight: false,
  },
];

export default function Pricing() {
  return (
    <div className="flex flex-col items-center bg-white dark:bg-zinc-950 text-zinc-950 dark:text-white min-h-screen transition-colors duration-500">
      <Navbar />
      
      <main className="w-full max-w-7xl px-6 pt-40 pb-24 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <span className="text-orange-500 text-xs font-black uppercase tracking-[0.3em] mb-4 block">
            Pricing Plans
          </span>
          <h1 className="text-5xl sm:text-7xl font-black tracking-tight mb-6">
            Daftar Harga Eksklusif
          </h1>
          <p className="text-zinc-500 max-w-2xl text-lg font-medium">
            Pilih paket yang sesuai dengan impian otomotif Anda. Kami menawarkan transparansi dan nilai terbaik untuk setiap unit.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
          {pricingPlans.map((plan, idx) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`relative p-8 rounded-[40px] border transition-all duration-500 flex flex-col ${
                plan.highlight 
                  ? "bg-zinc-950 dark:bg-zinc-900 border-zinc-800 shadow-2xl scale-105 z-10" 
                  : "bg-zinc-50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#BEF264] text-black text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full">
                  Paling Populer
                </div>
              )}
              
              <div className="mb-8">
                <h3 className={`text-xl font-black mb-2 ${plan.highlight ? "text-white" : "text-zinc-900 dark:text-white"}`}>
                  {plan.name}
                </h3>
                <div className="flex items-baseline gap-1">
                  <span className={`text-4xl font-black ${plan.highlight ? "text-white" : "text-zinc-900 dark:text-white"}`}>
                    {plan.price}
                  </span>
                </div>
                <p className={`mt-4 text-sm font-medium leading-relaxed ${plan.highlight ? "text-zinc-400" : "text-zinc-500"}`}>
                  {plan.description}
                </p>
              </div>

              <div className="space-y-4 mb-10 flex-grow">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-3">
                    <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${plan.highlight ? "bg-[#BEF264]/20 text-[#BEF264]" : "bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"}`}>
                      <Check size={12} strokeWidth={3} />
                    </div>
                    <span className={`text-sm font-bold ${plan.highlight ? "text-zinc-300" : "text-zinc-700 dark:text-zinc-300"}`}>
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              <button className={`w-full py-4 rounded-full font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                plan.highlight
                  ? "bg-white text-black hover:bg-[#BEF264] hover:text-black"
                  : "bg-zinc-950 dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-100"
              }`}>
                Pesan Sekarang
                <ArrowRight size={16} />
              </button>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}
