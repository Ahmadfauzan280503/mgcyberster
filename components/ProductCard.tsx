"use client";

import NextImage from "next/image";
import { Plus, Check } from "lucide-react";
import { FollowerPointerCard } from "./ui/following-pointer";
import { useCart } from "./CartContext";
import { useState } from "react";


interface ProductCardProps {
  name: string;
  image: string;
  price: string;
  status: string;
  logo?: string;
}

export const ProductCard = ({ name, image, price, status, logo }: ProductCardProps) => {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    addToCart({ name, image, price });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <FollowerPointerCard
      title={
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-[#BEF264]" />
          <p className="text-white text-xs font-white uppercase tracking-widest">{name}</p>
        </div>
      }
    >
      <div
        className="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-none border border-zinc-100 dark:border-zinc-800 flex flex-col gap-6 w-full max-w-sm mx-auto transition-all hover:shadow-[0_30px_60px_rgba(0,0,0,0.15)] group relative overflow-hidden"
      >
        {/* Brand Logo Header */}
        {logo && (
          <div className="absolute top-6 left-1/2 -translate-x-1/2 w-8 h-8 opacity-20 group-hover:opacity-100 transition-opacity duration-500">
            <NextImage
              src={logo}
              alt="Brand Logo"
              fill
              className="object-contain grayscale"
            />
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col items-center text-center pt-8">
          <h3 className="text-3xl font-black tracking-tighter text-zinc-900 dark:text-white uppercase">
            {name}
          </h3>
          <p className="text-zinc-400 text-[10px] font-black tracking-[0.2em] uppercase mt-1">
            {status}
          </p>
        </div>

        {/* Image Area */}
        <div className="relative aspect-square w-full rounded-[2rem] overflow-hidden bg-[#F2F2F2] dark:bg-zinc-800/10 p-4">
          <div className="relative w-full h-full rounded-[1.5rem] overflow-hidden">
            <NextImage
              src={image}
              alt={name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pb-2">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-full overflow-hidden bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center border border-zinc-200 dark:border-zinc-700">
              <NextImage
                src={image}
                alt={name}
                fill
                className="object-cover"
              />
            </div>
            <span className="text-zinc-950 dark:text-white text-sm font-black tracking-tight">
              {price}
            </span>
          </div>
          <button 
            onClick={handleAddToCart}
            className={`rounded-full px-6 py-3 flex items-center gap-2 font-black text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg ${
              added 
                ? "bg-[#BEF264] text-black" 
                : "bg-zinc-950 dark:bg-white text-white dark:text-black"
            }`}
          >
            {added ? (
              <>
                <Check size={14} strokeWidth={4} />
                Added
              </>
            ) : (
              <>
                <Plus size={14} strokeWidth={4} />
                Add To Cart
              </>
            )}
          </button>
        </div>
      </div>
    </FollowerPointerCard>
  );
};

