"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Store, Zap, Wrench } from "lucide-react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Script from "next/script";
import { AnimatedTooltip } from "@/components/ui/animated-tooltip";
import { AnimatedUnderline } from "@/components/ui/animated-underline";
import { ProductCard } from "@/components/ProductCard";
import { 
  TextRevealCard, 
  TextRevealCardDescription, 
  TextRevealCardTitle 
} from "@/components/ui/text-reveal-card";
import { PointerHighlight } from "@/components/ui/pointer-highlight";
import { AboutSection } from "@/components/AboutSection";
import { ContactSection } from "@/components/ContactSection";
import Footer from "@/components/Footer";




const fadeIn = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease: "easeOut" },
};

const tooltipItems = [
  { id: 1, name: "Anto Wijaya", designation: "Collector", image: "/avatar/avatar-1.jpg" },
  { id: 2, name: "Siti Rahma", designation: "Enthusiast", image: "/avatar/avatar-2.jpg" },
  { id: 3, name: "Budi Santoso", designation: "VVIP Client", image: "/avatar/avatar-3.jpg" },
  { id: 4, name: "Rina Kartika", designation: "Reviewer", image: "/avatar/avatar-4.jpg" },
];


const heroCards = [
  { img: "/page-1.jpg", color: "bg-zinc-100 dark:bg-zinc-800", width: "hidden sm:block w-[230px]", height: "h-[220px]" },
  { img: "/page-2.jpg", color: "bg-zinc-100 dark:bg-zinc-800", width: "w-[28%] sm:w-[230px]", height: "h-[220px] sm:h-[320px]" },
  { img: "/page-3.jpg", color: "bg-zinc-100 dark:bg-zinc-800", width: "w-[35%] sm:w-[230px]", height: "h-[320px] sm:h-[480px]" },
  { img: "/page-4.jpg", color: "bg-zinc-100 dark:bg-zinc-800", width: "w-[28%] sm:w-[230px]", height: "h-[220px] sm:h-[320px]" },
  { img: "/page-5.jpg", color: "bg-zinc-100 dark:bg-zinc-800", width: "hidden sm:block w-[230px]", height: "h-[220px]" },
];


const serviceCards = [
  {
    title: "Exclusive\nShowroom",
    description: "Jelajahi keindahan dan inovasi MG Cyberster di ruang pamer eksklusif kami.",
    Icon: Store,
    color: "bg-[#5A4AF4]",
    accentColor: "bg-[#5A4AF4]",
  },
  {
    title: "Premium\nTest Drive",
    description: "Rasakan performa luar biasa MG Cyberster langsung di jalanan.",
    Icon: Zap,
    color: "bg-[#BEF264]", // Lime background for image
    accentColor: "bg-[#BEF264]", // Lime for icon
  },
  {
    title: "Specialized\nService",
    description: "Perawatan tingkat tinggi oleh ahli untuk menjaga performa puncak mobil Anda.",
    Icon: Wrench,
    color: "bg-[#5A4AF4]",
    accentColor: "bg-[#5A4AF4]",
  },
];

const browseBrands = [
  { name: "BMW", img: "/brands/bmw.png" },
  { name: "Mercedes Benz", img: "/brands/mercedes.png" },
  { name: "Lamborghini", img: "/brands/lamborghini.png" },
  { name: "Ferrari", img: "/brands/ferrari.png" },
  { name: "Porsche", img: "/brands/porsche.png" },
];

const DEFAULT_PRODUCTS = [
  { name: "BMW i8 Hybrid", image: "/produk-mobil/car-1.png", price: "Rp. 4.2M", status: "Available" },
  { name: "BMW M4 GT3", image: "/produk-mobil/car-2.png", price: "Rp. 6.5M", status: "Race Ready" },
  { name: "AMG GT Black", image: "/produk-mobil/car-3.png", price: "Rp. 5.8M", status: "Limited" },
  { name: "G-Wagon G63", image: "/produk-mobil/car-4.png", price: "Rp. 7.2M", status: "In Stock" },
  { name: "Aventador SVJ", image: "/produk-mobil/car-5.png", price: "Rp. 12.5M", status: "Exotic" },
  { name: "Ferrari 488 Custom", image: "/produk-mobil/car-6.png", price: "Rp. 12.5M", status: "Exotic" },
  { name: "Ferrari Vision GT", image: "/produk-mobil/car-7.png", price: "Rp. 12.5M", status: "Exotic" },
  { name: "Porsche 911 GT3 RS", image: "/produk-mobil/car-8.png", price: "Rp. 12.5M", status: "Exotic" },
  { name: "Porsche GT3 R", image: "/produk-mobil/car-9.png", price: "Rp. 12.5M", status: "Exotic" },
];

import { useEffect, useState } from "react";

interface Product {
  name: string;
  image: string;
  price: string;
  status: string;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>(DEFAULT_PRODUCTS);

  useEffect(() => {
    const stored = localStorage.getItem("mgcyberster_products");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const timer = setTimeout(() => {
          setProducts(parsed);
        }, 0);
        return () => clearTimeout(timer);
      } catch (e) {
        console.error("Error parsing products from localStorage", e);
      }
    } else {
      localStorage.setItem("mgcyberster_products", JSON.stringify(DEFAULT_PRODUCTS));
    }
  }, []);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AutoShowroom",
    "name": "MG Cyberster Showroom Indonesia",
    "description": "Dealer mobil mewah dan sport car terbaik di Jakarta. Koleksi eksklusif MG Cyberster, Ferrari, Lamborghini, dan Porsche.",
    "url": "https://mg-cyberster-showroom.com",
    "telephone": "+62211234567",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Jl. Sudirman No. 1",
      "addressLocality": "Jakarta",
      "addressRegion": "DKI Jakarta",
      "postalCode": "12190",
      "addressCountry": "ID"
    },
    "openingHours": "Mo-Su 09:00-21:00",
    "image": "https://mg-cyberster-showroom.com/hero-image.jpg"
  };

  return (
    <div className="flex flex-col items-center bg-background text-foreground min-h-screen overflow-x-hidden">
      <Script
        id="showroom-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      {/* =============== HERO SECTION =============== */}
      <section className="w-full min-h-screen relative flex flex-col items-center justify-center overflow-hidden bg-white dark:bg-zinc-950 transition-colors duration-500">
        {/* Grid Background */}
        <div className="absolute inset-0 grid-pattern opacity-[0.08] dark:opacity-30 pointer-events-none" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-zinc-100/50 dark:via-zinc-950/50 to-white dark:to-zinc-950 pointer-events-none" />

        <motion.div
          className="relative z-10 flex flex-col items-center text-center space-y-16 px-6 pt-32 md:pt-48 pb-10"
          initial="initial"
          animate="animate"
          variants={fadeIn}
        >

          {/* Main Heading */}
          <div className="relative">
             {/* Floating Testimonial 1 */}
            <motion.div
              animate={{ y: [0, -15, 0], x: [0, 5, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-5 -left-2 lg:-left-54 hidden lg:flex flex-col gap-2 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl p-4 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 max-w-[200px] text-left -rotate-3 transition-transform hover:rotate-0 duration-500"
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex gap-1">
                  {[1, 2].map((i) => (
                    <div key={i} className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
                  ))}
                </div>
                <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                </div>
              </div>
              <p className="text-[12px] font-medium leading-relaxed text-zinc-700 dark:text-zinc-300">
                &quot;Gila sih, mobilnya bener-bener gres dan unit rare semua!&quot;
              </p>
              <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Budi S.</span>
            </motion.div>

            {/* Floating Testimonial 2 */}
            <motion.div
              animate={{ y: [0, 15, 0], x: [0, -5, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute top-52 -left-20 lg:-left-30 hidden lg:flex flex-col gap-2 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl p-4 rounded-3xl shadow-4xl border border-zinc-200 dark:border-zinc-800 max-w-[200px] text-left -rotate-4 transition-transform hover:rotate-0 duration-500"
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex gap-1">
                  {[1, 2].map((i) => (
                    <div key={i} className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
                  ))}
                </div>
                <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                </div>
              </div>
              <p className="text-[12px] font-medium leading-relaxed text-zinc-700 dark:text-zinc-300">
                &quot;Pelayanan VVIP, proses surat-surat super cepat!&quot;
              </p>
              <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Siti A.</span>
            </motion.div>

             {/* Floating Testimonial 3 */}
             <motion.div
              animate={{ y: [10, -10, 10] }}
              transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute top-10 -right-12 lg:-right-42 hidden lg:flex flex-col gap-2 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl p-4 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 max-w-[180px] text-left rotate-6 transition-transform hover:rotate-0 duration-500"
            >
              <div className="flex items-center justify-between mb-1">
                 <div className="flex gap-1">
                  {[1, 2].map((i) => (
                    <div key={i} className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
                  ))}
                </div>
                <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                </div>
              </div>
              <p className="text-[12px] font-medium leading-relaxed text-zinc-700 dark:text-zinc-300">
                &quot;Showroom ternyaman & koleksi terupdate.&quot;
              </p>
              <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Aris</span>
            </motion.div>

            <h1 className="flex flex-col text-5xl sm:text-7xl md:text-[90px] font-black tracking-tighter leading-[1.0] text-zinc-950 dark:text-white">
              <span>Selamat Datang Di</span>
              <span className="opacity-40">Showroom Mobil</span>
              <span className="relative inline-block">
                MG Cyberster
              <span className="text-[#BEF264] ml-2">.</span>
                <AnimatedUnderline />
              </span>
            </h1>
          </div>

          {/* New Description */}
          <p className="text-base md:text-lg text-zinc-600 dark:text-zinc-400 font-medium max-w-2xl leading-relaxed">
            Kami Hadir Untuk Membantu Anda Menemukan Mobil Impian Anda,Berbagai Pilihan Mobil <span className="italic text-zinc-950 dark:text-white">Super car dan Mobil Sport</span>
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-7 mb-10">
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-3 bg-zinc-950 dark:bg-white text-white dark:text-black px-6 py-3 rounded-full font-bold text-base shadow-xl hover:shadow-primary/10 transition-all"
            >
              <div className="w-5 h-5 flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth="2.5">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              Konsultasi Yuk!
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-3 bg-zinc-100 dark:bg-zinc-900 text-zinc-950 dark:text-white border border-zinc-200 dark:border-zinc-800 px-6 py-3 rounded-full font-bold text-base hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-all"
            >
              View Pricing
              <ArrowUpRight size={18} strokeWidth={3} />
            </motion.button>
          </div>

          {/* Trust Elements */}
          <div className="flex flex-col items-center gap-4 pt-8 mb-10">
            <div className="flex flex-row items-center justify-center mb-2 w-full">
              <AnimatedTooltip items={tooltipItems} />
              <div className="w-10 h-10 rounded-full border-2 border-white dark:border-zinc-950 bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-zinc-950 dark:text-white ml-2">
                +2K
              </div>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="flex gap-1 text-[#BEF264]">
                {[1, 2, 3, 4, 5].map((i) => (
                  <svg key={i} className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>
              <span className="text-[10px] uppercase font-black tracking-[0.2em] text-zinc-500">
                Ribuan Kolektor & Penggemar Mobil Puas
              </span>
            </div>
          </div>
        </motion.div>

        {/* Hero Image Grid — Neat "Rounded Box" cards with full-bleed images */}
        <div className="flex items-center justify-center gap-3 sm:gap-4 w-full max-w-7xl mb-20 sm:mb-32 relative z-10 px-4">
          {heroCards.map((card, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + idx * 0.1, duration: 0.8, ease: "easeOut" }}
              className={`${card.color} ${card.height} ${card.width} rounded-[30px] sm:rounded-[40px] flex items-center justify-center relative overflow-hidden group border border-zinc-200 dark:border-white/10 shadow-2xl hover:shadow-primary/20 hover:-translate-y-2 transition-all duration-500`}
            >
              <Image
                src={card.img}
                alt={`Koleksi Mobil Mewah MG Cyberster Showroom - Unit ${idx + 1}`}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </motion.div>
          ))}
        </div>
      </section>

      {/* =============== MAIN WRAPPER FOR CLASSES, QUOTE, AND FOOTER =============== */}
      <section id="layanan" className="w-full bg-[#FFFFFF] dark:bg-zinc-950 py-12 sm:py-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto bg-[#000000] dark:bg-zinc-900 rounded-[30px] sm:rounded-[60px] border border-zinc-300/50 dark:border-zinc-800 p-8 sm:p-12 lg:p-20 relative overflow-hidden">
          
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start mb-12 gap-6">
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-white">Layanan Kami</h2>
            <p className="max-w-[280px] text-white dark:text-white text-sm font-medium leading-relaxed">
              Kami menyediakan berbagai layanan untuk memenuhi kebutuhan Anda
            </p>
          </div>

          {/* Service Cards Grid (formerly Class Cards) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {serviceCards.map((card, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15 }}
                whileHover={{ y: -8 }}
                className="bg-white dark:bg-zinc-800 rounded-[40px] p-8 border-[3px] border-zinc-200/50 dark:border-zinc-700 flex flex-col group cursor-pointer transition-all hover:shadow-2xl hover:border-primary/30"
              >
                {/* Card Header */}
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-2xl font-black leading-tight whitespace-pre-line text-[#1A1A1A] dark:text-white">
                    {card.title}
                  </h3>
                  <div className={`w-12 h-12 ${card.accentColor} rounded-full flex items-center justify-center text-white flex-shrink-0 transition-transform group-hover:rotate-45 shadow-lg`}>
                    <ArrowUpRight size={22} strokeWidth={3} />
                  </div>
                </div>

                {/* Divider Line */}
                <div className="w-full h-[2px] bg-zinc-100 dark:bg-zinc-700 mb-6" />

                {/* Description */}
                <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-8 leading-relaxed font-medium">
                  {card.description}
                </p>

                {/* Card Icon Wrapper */}
                <div
                  className={`${card.color} rounded-[32px] w-full aspect-[4/3] relative overflow-hidden mt-auto shadow-inner group-hover:shadow-2xl transition-all duration-500 flex items-center justify-center`}
                >
                  <card.Icon 
                    size={80} 
                    strokeWidth={1.5} 
                    className="text-white group-hover:scale-110 transition-transform duration-700 opacity-90" 
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* "Browse By Brands" Section */}
      <section className="w-full bg-white dark:bg-zinc-950 px-6 py-24 flex flex-col items-center border-t border-zinc-100 dark:border-zinc-900">
        <div className="w-full max-w-6xl text-center">
          <div className="flex flex-col items-center mb-16">
            <span className="text-orange-500 text-xs font-black uppercase tracking-[0.3em] mb-4">
              Top Makes
            </span>
            <PointerHighlight
              rectangleClassName="border-[#BEF264] dark:border-[#BEF264]/90 bg-blue-500/10"
              pointerClassName="text-[#BEF264]"
            >
              <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-zinc-900 dark:text-white px-4 py-2">
                Browse By Brands
              </h2>
            </PointerHighlight>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 md:gap-20 px-4">
            {browseBrands.map((brand) => (
              <motion.div
                key={brand.name}
                whileHover={{ scale: 1.15 }}
                className="flex flex-col items-center gap-5 group cursor-pointer"
              >
                <div className="relative w-24 h-24 grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center">
                  <Image
                    src={brand.img}
                    alt={brand.name}
                    fill
                    className={`object-contain ${brand.name === "BMW" ? "mix-blend-multiply dark:brightness-100 dark:filter-none dark:bg-white/10 dark:rounded-full p-2" : ""}`}
                  />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">
                  {brand.name}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* =============== PRODUK MOBIL SECTION =============== */}
      <section id="produk-mobil" className="w-full bg-zinc-50 dark:bg-black px-6 py-24 flex flex-col items-center">
        <div className="w-full max-w-7xl">
          <div className="flex flex-col items-center mb-20 text-center">
            <TextRevealCard
              text="Produk Mobil Terkini"
              revealText="Exclusive Auto Showroom"
              className="w-full max-w-[50rem] h-[15rem] border-none bg-transparent"
            >
              <TextRevealCardTitle className="text-zinc-900 dark:text-white text-xl font-black uppercase tracking-[0.3em] mb-4">
                Our Collection
              </TextRevealCardTitle>
              <TextRevealCardDescription className="text-zinc-500 dark:text-zinc-400 font-medium text-lg leading-relaxed max-w-xl mx-auto">
                Temukan koleksi mobil mewah terbaik kami yang dirancang untuk performa dan kenyamanan maksimal.
              </TextRevealCardDescription>
            </TextRevealCard>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {products.map((product, idx: number) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <ProductCard {...product} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* =============== ABOUT SECTION =============== */}
      <AboutSection />

      {/* =============== CONTACT SECTION =============== */}
      <ContactSection />

      {/* =============== FOOTER =============== */}
      <Footer />
    </div>
  );
}

