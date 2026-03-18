"use client";

import React, { useState, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/components/CartContext";
import Navbar from "@/components/Navbar";
import { 
  ArrowLeft, 
  Wallet, 
  CreditCard, 
  CheckCircle2, 
  ShieldCheck, 
  Globe, 
  Bitcoin,
  Building2,
  ChevronRight,
  Landmark
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

const paymentMethods = [
  {
    id: "crypto",
    name: "Crypto",
    description: "BTC, ETH, USDT",
    icon: <Bitcoin className="text-orange-500" size={24} />,
    color: "bg-orange-500/10",
    border: "border-orange-500/20"
  },
  {
    id: "mastercard",
    name: "MasterCard",
    description: "Debit or Credit Card",
    icon: <CreditCard className="text-red-500" size={24} />,
    color: "bg-red-500/10",
    border: "border-red-500/20"
  },
  {
    id: "bca",
    name: "BCA Prioritas",
    description: "Exclusive Priority Banking",
    icon: <Landmark className="text-blue-600" size={24} />,
    color: "bg-blue-600/10",
    border: "border-blue-600/20"
  },
  {
    id: "mandiri",
    name: "Bank Mandiri",
    description: "Mandiri Online Banking",
    icon: <Building2 className="text-yellow-600" size={24} />,
    color: "bg-yellow-600/10",
    border: "border-yellow-600/20"
  }
];

import { toast } from "sonner";

function PaymentContent() {
  const { cartItems, clearCart } = useCart();
  const searchParams = useSearchParams();
  const transactionId = searchParams.get("id");
  const [selectedMethod, setSelectedMethod] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  const total = cartItems.reduce((acc, item) => {
    const priceNum = parseFloat(item.price.replace("Rp. ", "").replace("M", ""));
    return acc + (isNaN(priceNum) ? 0 : priceNum * item.quantity);
  }, 0);

  const totalWithTax = total * 1.1;

  const handleFinishPayment = async () => {
    if (!selectedMethod) {
      toast.warning("Silakan pilih metode pembayaran terlebih dahulu.");
      return;
    }

    if (!transactionId) {
      toast.error("ID Transaksi tidak ditemukan. Silakan lakukan checkout ulang.");
      return;
    }
    
    setIsProcessing(true);
    const loadingToastId = toast.loading("Memverifikasi pembayaran...");
    
    try {
      const response = await fetch("/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transactionId,
          paymentMethod: selectedMethod
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Gagal memproses pembayaran");
      }

      toast.success("Pembayaran berhasil diverifikasi!", { id: loadingToastId });
      setIsSuccess(true);
      clearCart();
    } catch (error: unknown) {
      console.error("Payment error:", error);
      const message = error instanceof Error ? error.message : "Terjadi kesalahan saat memproses pembayaran.";
      toast.error(message, { id: loadingToastId });
    } finally {
      setIsProcessing(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center"
        >
          <div className="w-24 h-24 bg-[#BEF264]/20 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 size={48} className="text-[#BEF264]" />
          </div>
          <h1 className="text-4xl font-black uppercase tracking-tighter mb-4">Pembayaran Sukses</h1>
          <p className="text-zinc-400 mb-10 leading-relaxed">
            Transaksi Anda telah berhasil diverifikasi. Detail pesanan telah dikirim ke email Anda. 
            Terima kasih telah memilih showroom kami.
          </p>
          <button 
            onClick={() => router.push("/")}
            className="w-full bg-[#BEF264] text-black py-5 rounded-full font-black uppercase tracking-widest text-xs hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            Kembali ke Beranda
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-foreground transition-colors duration-500">
      <Navbar />
      
      <main className="max-w-6xl mx-auto pt-32 pb-24 px-6">
        <div className="mb-12">
          <Link href="/cart" className="inline-flex items-center gap-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors text-xs font-black uppercase tracking-widest mb-6">
            <ArrowLeft size={16} /> Back to Cart
          </Link>
          <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tighter text-zinc-900 dark:text-white">Secure Payment</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Methods Section */}
          <div className="lg:col-span-7">
            <div className="space-y-4">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500 mb-6">Pilih Metode Pembayaran</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setSelectedMethod(method.name)}
                    className={`relative p-6 rounded-[30px] border-2 text-left transition-all duration-300 overflow-hidden group
                      ${selectedMethod === method.name 
                        ? "border-[#BEF264] bg-white dark:bg-zinc-900 shadow-xl" 
                        : "border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40 hover:border-zinc-300 dark:hover:border-zinc-700"}`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-2xl ${method.color} ${method.border} border`}>
                        {method.icon}
                      </div>
                      {selectedMethod === method.name && (
                        <div className="bg-[#BEF264] rounded-full p-1">
                          <CheckCircle2 size={16} className="text-black" />
                        </div>
                      )}
                    </div>
                    <h3 className="text-xl font-black uppercase tracking-tight mb-1 text-zinc-900 dark:text-white">{method.name}</h3>
                    <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">{method.description}</p>
                    
                    {/* Hover Glow */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-[#BEF264]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                  </button>
                ))}
            </div>
          </div>

              <div className="mt-12 p-8 rounded-[40px] bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center gap-4 mb-4">
                  <ShieldCheck className="text-[#BEF264]" size={24} />
                  <h4 className="text-sm font-black uppercase tracking-widest text-zinc-900 dark:text-white">Global Asset Protection</h4>
                </div>
                <p className="text-xs text-zinc-500 leading-relaxed font-medium uppercase tracking-widest opacity-80">
                  Pembayaran Anda diamankan dengan enkripsi tingkat militer (AES-256). 
                  Kami menjamin keamanan aset dan data pribadi Anda di setiap transaksi.
                </p>
              </div>
            </div>

          {/* Summary Section */}
          <div className="lg:col-span-5">
            <div className="bg-zinc-950 text-white p-8 sm:p-10 rounded-[45px] shadow-2xl sticky top-32 border border-white/5">
              <h2 className="text-2xl font-black uppercase tracking-tighter mb-10 pb-6 border-b border-white/10">Order Detail</h2>
              
              <div className="space-y-6 mb-12">
                <div className="flex justify-between items-center opacity-60 text-[10px] font-black uppercase tracking-[0.2em]">
                  <span>Unit Price</span>
                  <span>Rp. {total.toFixed(1)}M</span>
                </div>
                <div className="flex justify-between items-center opacity-60 text-[10px] font-black uppercase tracking-[0.2em]">
                  <span>Vat & Tax</span>
                  <span>Rp. {(total * 0.1).toFixed(1)}M</span>
                </div>
                <div className="pt-6 border-t border-white/5 flex justify-between items-end">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#BEF264]">Total Payable</span>
                    <p className="text-4xl font-black tracking-tighter">Rp. {totalWithTax.toFixed(1)}M</p>
                  </div>
                  <Globe className="opacity-20 translate-y-2 pointer-events-none" size={60} />
                </div>
              </div>

              <button
                onClick={handleFinishPayment}
                disabled={isProcessing || !selectedMethod}
                className={`w-full py-6 rounded-full font-black uppercase tracking-[0.2em] text-xs transition-all flex items-center justify-center gap-3 active:scale-95 shadow-2xl
                  ${isProcessing || !selectedMethod 
                    ? "bg-zinc-800 text-zinc-500 cursor-not-allowed" 
                    : "bg-[#BEF264] text-black hover:scale-[1.02] shadow-[#BEF264]/20"}`}
              >
                {isProcessing ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                      className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full"
                    />
                    Verifying...
                  </>
                ) : (
                  <>
                    Finish Payment
                    <ChevronRight size={18} />
                  </>
                )}
              </button>
              
              <div className="mt-8 flex items-center justify-center gap-4 grayscale opacity-40">
                <CreditCard size={20} />
                <Wallet size={20} />
                <Bitcoin size={20} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#BEF264]"></div>
      </div>
    }>
      <PaymentContent />
    </Suspense>
  );
}

