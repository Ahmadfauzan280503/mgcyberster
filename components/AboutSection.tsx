import React from "react";
import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation";

export function AboutSection() {
  return (
    <section id="about" className="w-full py-12 px-6 bg-white dark:bg-black">
      <div className="max-w-5xl mx-auto overflow-hidden rounded-[30px] h-[50vh] relative group border border-zinc-200 dark:border-white/10 shadow-2xl">

        <BackgroundGradientAnimation>
          <div className="absolute z-50 inset-0 flex flex-col items-center justify-center text-white p-6 md:p-12 pointer-events-none">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40 mb-4 drop-shadow-2xl">
              About Me
            </h2>
            <p className="text-sm md:text-lg lg:text-xl font-medium text-white/80 max-w-2xl text-center leading-relaxed">
              Kami Memiliki Visi Misi Yang Jelas Untuk Menjadi Dealer Mobil Terpercaya Di Indonesia
            </p>
          </div>
        </BackgroundGradientAnimation>
      </div>
    </section>

  );
}

