"use client";

import React from "react";
import { motion } from "framer-motion";
import { useCart } from "@/components/CartContext";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import { Trash2, ArrowLeft, ShoppingBag, Loader2, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { toast } from "sonner";

export default function CartPage() {
  const { cartItems, removeFromCart, clearCart, cartCount } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const router = useRouter();

  const total = cartItems.reduce((acc, item) => {
    const priceNum = parseFloat(item.price.replace("Rp. ", "").replace("M", ""));
    return acc + (isNaN(priceNum) ? 0 : priceNum * item.quantity);
  }, 0);

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;

    setIsCheckingOut(true);
    const loadingToastId = toast.loading("Menyiapkan transaksi Anda...");
    
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cartItems,
          totalAmount: total,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Gagal membuat transaksi");
      }

      toast.success("Transaksi berhasil dibuat!", { id: loadingToastId });
      router.push(`/payment?id=${result.transactionId}`);
      
    } catch (error: unknown) {
      console.error('Checkout error:', error);
      const message = error instanceof Error ? error.message : 'Gagal melakukan checkout. Silakan coba lagi.';
      toast.error(message, { id: loadingToastId });
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-foreground transition-colors duration-500">
      <Navbar />
      
      <main className="max-w-6xl mx-auto pt-32 pb-24 px-6">
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-4">
            <Link href="/" className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-full transition-colors">
              <ArrowLeft size={24} />
            </Link>
            <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tighter">Your Cart</h1>
          </div>
          <p className="text-zinc-400 font-black uppercase tracking-widest text-xs">
            {cartCount} Items Selected
          </p>
        </div>

        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-24 h-24 bg-zinc-100 dark:bg-zinc-900 rounded-full flex items-center justify-center mb-6">
              <ShoppingBag size={40} className="text-zinc-400" />
            </div>
            <h2 className="text-2xl font-bold mb-2 uppercase tracking-tight">Your cart is empty</h2>
            <p className="text-zinc-500 mb-8 max-w-xs">Looks like you haven&apos;t added any dream cars to your collection yet.</p>
            <Link href="/#produk-mobil" className="bg-zinc-950 dark:bg-white text-white dark:text-black px-8 py-4 rounded-full font-black uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-xl">
              Browse Cars
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-6">
              {cartItems.map((item) => (
                <motion.div 
                  key={item.name}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-6 bg-zinc-50 dark:bg-zinc-900/50 p-6 rounded-[30px] border border-zinc-100 dark:border-zinc-800"
                >
                  <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-2xl overflow-hidden bg-white dark:bg-zinc-800">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-xl font-black uppercase tracking-tight mb-1">{item.name}</h3>
                    <p className="text-[#BEF264] font-black text-lg">{item.price}</p>
                    <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest mt-2">Qty: {item.quantity}</p>
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.name)}
                    className="p-3 text-zinc-400 hover:text-red-500 hover:bg-red-500/10 rounded-2xl transition-all"
                  >
                    <Trash2 size={20} />
                  </button>
                </motion.div>
              ))}
              
              <button 
                onClick={clearCart}
                className="text-xs font-black uppercase tracking-widest text-zinc-400 hover:text-red-500 transition-colors pt-4 px-4"
              >
                Clear All Items
              </button>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-zinc-950 text-white p-8 rounded-[40px] shadow-2xl sticky top-32 border border-white/5">
                <h2 className="text-2xl font-black uppercase tracking-tighter mb-8">Summary</h2>
                
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between items-center text-zinc-400 text-sm font-bold uppercase tracking-widest">
                    <span>Subtotal</span>
                    <span>Rp. {total.toFixed(1)}M</span>
                  </div>
                  <div className="flex justify-between items-center text-zinc-400 text-sm font-bold uppercase tracking-widest">
                    <span>Tax (10%)</span>
                    <span>Rp. {(total * 0.1).toFixed(1)}M</span>
                  </div>
                  <div className="h-px bg-white/10 my-6" />
                  <div className="flex justify-between items-end">
                    <span className="text-zinc-100 text-sm font-black uppercase tracking-[0.2em]">Total Amount</span>
                    <span className="text-3xl font-black text-[#BEF264]">Rp. {(total * 1.1).toFixed(1)}M</span>
                  </div>
                </div>

                <button 
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                  className="w-full bg-[#BEF264] text-black py-5 rounded-full font-black uppercase tracking-widest text-xs hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-[#BEF264]/10 mt-4 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCheckingOut ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Checkout Now"
                  )}
                </button>
                
                <p className="text-[10px] text-zinc-500 text-center mt-6 font-medium uppercase tracking-widest leading-relaxed">
                  Secure Payment Guaranteed <br /> with Global Asset Protection
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}


