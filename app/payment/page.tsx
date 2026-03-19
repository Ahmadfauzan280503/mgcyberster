"use client";

import React, { useState, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/components/CartContext";
import Navbar from "@/components/Navbar";
import NextImage from "next/image";
import { 
  ArrowLeft, 
  Wallet, 
  CreditCard, 
  CheckCircle2, 
  Globe, 
  Bitcoin,
  Building2,
  Landmark,
  AlertTriangle,
  X,
  Lock
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

function CryptoPaymentUI({ onConfirm, isProcessing }: { onConfirm: () => void, isProcessing: boolean }) {
  const [selectedCoin, setSelectedCoin] = useState("USDT");
  const [qrPattern] = useState<boolean[]>(() => 
    Array.from({ length: 64 }).map(() => Math.random() > 0.5)
  );

  const addresses: Record<string, string> = {
    "USDT": "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
    "BTC": "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
    "ETH": "0x71C7656EC7ab88b098defB751B7401B5f6d8976F"
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex gap-2 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-2xl w-fit">
        {["USDT", "BTC", "ETH"].map((coin) => (
          <button
            key={coin}
            onClick={() => setSelectedCoin(coin)}
            className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${
              selectedCoin === coin 
                ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm" 
                : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
            }`}
          >
            {coin}
          </button>
        ))}
      </div>

      <div className="bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-[30px] p-8 text-center">
        <div className="w-48 h-48 bg-white p-4 rounded-3xl mx-auto mb-6 shadow-xl flex items-center justify-center">
          {/* Mock QR Code */}
          <div className="grid grid-cols-8 gap-1 w-full h-full opacity-80">
            {qrPattern.length > 0 ? qrPattern.map((isBlack, i) => (
              <div key={i} className={`rounded-sm ${isBlack ? 'bg-black' : 'bg-transparent'}`} />
            )) : (
              <div className="col-span-8 row-span-8 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-zinc-100 border-t-zinc-400 rounded-full animate-spin" />
              </div>
            )}
          </div>
        </div>
        
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400 mb-2">Wallet Address ({selectedCoin})</p>
        <div className="flex items-center justify-center gap-3 bg-white dark:bg-black border border-zinc-100 dark:border-zinc-800 py-4 px-6 rounded-2xl mb-8 group cursor-pointer active:scale-95 transition-transform" 
             onClick={() => {
               navigator.clipboard.writeText(addresses[selectedCoin]);
               toast.success("Address copied!");
             }}>
          <span className="text-sm font-mono font-medium truncate max-w-[200px] text-zinc-900 dark:text-zinc-100">{addresses[selectedCoin]}</span>
          <div className="p-2 bg-zinc-50 dark:bg-zinc-900 rounded-lg group-hover:bg-[#BEF264] transition-colors">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-4 h-4 text-zinc-900" strokeWidth="2.5">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
          </div>
        </div>

        <button 
          onClick={onConfirm}
          disabled={isProcessing}
          className="w-full py-4 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-[1.02] shadow-xl transition-all"
        >
          {isProcessing ? "Confirming..." : "Confirm Payment"}
        </button>
      </div>

      <div className="flex items-start gap-4 p-5 bg-orange-500/5 border border-orange-500/10 rounded-2xl">
        <Bitcoin className="text-orange-500 flex-shrink-0" size={18} />
        <p className="text-[10px] text-orange-700 dark:text-orange-400 font-bold leading-relaxed uppercase tracking-widest">
          Pastikan Anda memilih jaringan yang benar (ERC-20/BEP-20) untuk menghindari kehilangan aset.
        </p>
      </div>
    </motion.div>
  );
}

function CardPaymentUI({ onConfirm, isProcessing }: { onConfirm: () => void, isProcessing: boolean }) {
  const [step, setStep] = useState<'input' | 'otp'>('input');
  const [otp, setOtp] = useState('');

  if (step === 'otp') {
    return (
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-6"
      >
        <div className="bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-[30px] p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-[#BEF264]" />
          <div className="w-16 h-16 bg-[#BEF264]/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Lock className="text-[#BEF264]" size={32} />
          </div>
          <h3 className="text-lg font-black uppercase tracking-tighter mb-2 text-zinc-900 dark:text-white">3D Secure Verification</h3>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 mb-8">Masukkan kode OTP yang dikirim ke nomor Anda</p>
          
          <div className="flex justify-center gap-2 mb-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="w-10 h-12 bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-xl flex items-center justify-center text-lg font-black text-zinc-900 dark:text-white">
                {otp[i] || "•"}
              </div>
            ))}
          </div>

          <input 
            type="text" 
            maxLength={6}
            value={otp}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, '');
              setOtp(val);
              if (val.length === 6) {
                setTimeout(onConfirm, 800);
              }
            }}
            className="absolute opacity-0 pointer-events-none"
            autoFocus
          />

          <p className="text-[10px] font-black uppercase tracking-widest text-[#BEF264] animate-pulse">Waiting for input...</p>
        </div>

        <button 
          onClick={() => setStep('input')}
          className="w-full py-4 text-zinc-500 font-black uppercase tracking-widest text-[10px] hover:text-zinc-900 dark:hover:text-white transition-colors"
        >
          Kembali ke Detail Kartu
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-400">Cardholder Name</label>
          <input type="text" placeholder="JOHN DOE" className="w-full bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 p-4 rounded-2xl text-sm font-black uppercase tracking-widest outline-none focus:border-[#BEF264] text-zinc-900 dark:text-white transition-all placeholder:opacity-30" />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-400">Card Number</label>
          <input type="text" placeholder="**** **** **** 1234" className="w-full bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 p-4 rounded-2xl text-sm font-mono outline-none focus:border-[#BEF264] text-zinc-900 dark:text-white transition-all" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-400">Expiry</label>
            <input type="text" placeholder="MM/YY" className="w-full bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 p-4 rounded-2xl text-sm font-mono outline-none focus:border-[#BEF264] text-zinc-900 dark:text-white transition-all" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-400">CVV</label>
            <input type="password" placeholder="***" className="w-full bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 p-4 rounded-2xl text-sm font-mono outline-none focus:border-[#BEF264] text-zinc-900 dark:text-white transition-all" />
          </div>
        </div>
      </div>
      <button 
        onClick={() => setStep('otp')}
        disabled={isProcessing}
        className="w-full py-5 bg-[#BEF264] text-black rounded-3xl font-black uppercase tracking-widest text-[10px] hover:scale-[1.02] shadow-xl transition-all flex items-center justify-center gap-3"
      >
        <Lock size={16} />
        {isProcessing ? "Processing..." : "Lanjutkan Pembayaran"}
      </button>
    </motion.div>
  );
}

function BankPaymentUI({ method, onConfirm, isProcessing }: { method: string, onConfirm: () => void, isProcessing: boolean }) {
  const va = method === "BCA Prioritas" ? "88390001234567" : "11200009876543";
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-[30px] p-8 text-center">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400 mb-2">Virtual Account Number</p>
        <div className="flex items-center justify-center gap-3 bg-white dark:bg-black border border-zinc-100 dark:border-zinc-800 py-4 px-6 rounded-2xl mb-8 group cursor-pointer active:scale-95 transition-transform"
             onClick={() => {
               navigator.clipboard.writeText(va);
               toast.success("VA copied!");
             }}>
          <span className="text-2xl font-black tracking-widest text-zinc-900 dark:text-white">{va}</span>
          <div className="p-2 bg-zinc-50 dark:bg-zinc-900 rounded-lg group-hover:bg-[#BEF264] transition-colors">
            <Landmark size={18} />
          </div>
        </div>
        
        <div className="space-y-4 text-left mb-8">
          <div className="flex gap-4">
            <div className="w-6 h-6 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-[10px] font-black text-zinc-900 dark:text-zinc-100">1</div>
            <p className="text-xs text-zinc-600 dark:text-zinc-300 font-bold uppercase tracking-widest">Pilih transfer Virtual Account di menu M-Banking Anda.</p>
          </div>
          <div className="flex gap-4">
            <div className="w-6 h-6 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-[10px] font-black text-zinc-900 dark:text-zinc-100">2</div>
            <p className="text-xs text-zinc-600 dark:text-zinc-300 font-bold uppercase tracking-widest">Masukkan nomor VA di atas dan nominal yang sesuai.</p>
          </div>
        </div>

        <button 
          onClick={onConfirm}
          disabled={isProcessing}
          className="w-full py-4 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-[1.02] shadow-xl transition-all"
        >
          {isProcessing ? "Verifying..." : "I've Completed Payment"}
        </button>
      </div>
    </motion.div>
  );
}

function PaymentAlert({ message, details, onClose }: { message: string, details?: string, onClose: () => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-10 rounded-[40px] shadow-2xl max-w-sm w-full text-center relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-2 bg-orange-500" />
        <button onClick={onClose} className="absolute top-6 right-6 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
          <X size={20} />
        </button>

        <div className="w-20 h-20 bg-orange-500/10 rounded-3xl flex items-center justify-center mx-auto mb-8 animate-pulse">
           <AlertTriangle className="text-orange-500" size={40} />
        </div>

        <h3 className="text-xl font-black uppercase tracking-tighter mb-4 text-zinc-900 dark:text-white">Verifikasi Gagal</h3>
        <p className="text-xs font-black uppercase tracking-widest text-[#F97316] mb-4">
          {message}
        </p>
        
        {details && (
          <p className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 mb-10 leading-relaxed uppercase tracking-widest">
            {details}
          </p>
        )}

        <button 
          onClick={onClose}
          className="w-full py-4 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-[1.05] transition-all shadow-xl"
        >
          Coba Lagi
        </button>
      </motion.div>
    </motion.div>
  );
}

function PaymentContent() {
  const { cartItems, clearCart } = useCart();
  const searchParams = useSearchParams();
  const transactionId = searchParams.get("id");
  const [selectedMethod, setSelectedMethod] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [alertData, setAlertData] = useState<{ show: boolean, message: string, details?: string }>({ show: false, message: "" });
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
          paymentMethod: selectedMethod,
          confirm: true // Flag to trigger mock verification
        })
      });

      const result = await response.json();

      if (!response.ok) {
        if (result.code === 'PAYMENT_PENDING') {
          toast.dismiss(loadingToastId);
          setAlertData({ show: true, message: result.error, details: result.details });
          return;
        }
        throw new Error(result.error || "Gagal memproses pembayaran");
      }

      toast.success("Pembayaran berhasil diverifikasi!", { id: loadingToastId });
      
      // Update local products "Sold Out" status if they are in localStorage
      const stored = localStorage.getItem("mgcyberster_products");
      if (stored) {
        interface Product {
          name: string;
          status: string;
          [key: string]: string | number | boolean | null | undefined;
        }
        const products: Product[] = JSON.parse(stored);
        const cartProductNames = cartItems.map(item => item.name);
        const updatedProducts = products.map((p: Product) => 
          cartProductNames.includes(p.name) ? { ...p, status: "Sold Out" } : p
        );
        localStorage.setItem("mgcyberster_products", JSON.stringify(updatedProducts));
      }

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
      <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white flex items-center justify-center p-6 transition-colors duration-500">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center"
        >
          <div className="w-24 h-24 bg-[#BEF264]/20 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 size={48} className="text-[#BEF264]" />
          </div>
          <h1 className="text-4xl font-black uppercase tracking-tighter mb-4">Pembayaran Sukses</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mb-10 leading-relaxed font-medium">
            Transaksi Anda telah berhasil diverifikasi. Detail pesanan telah dikirim ke email Anda. 
            Terima kasih telah memilih showroom kami.
          </p>
          <button 
            onClick={() => router.push("/")}
            className="w-full bg-[#BEF264] text-black py-5 rounded-3xl font-black uppercase tracking-widest text-xs hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-[#BEF264]/20 transition-all"
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
      
      <AnimatePresence>
        {alertData.show && (
          <PaymentAlert 
            message={alertData.message} 
            details={alertData.details}
            onClose={() => setAlertData({ ...alertData, show: false })} 
          />
        )}
      </AnimatePresence>
      
      <main className="max-w-6xl mx-auto pt-32 pb-24 px-6">
        <div className="mb-12">
          <Link href="/cart" className="inline-flex items-center gap-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors text-[10px] font-black uppercase tracking-[0.2em] mb-6">
            <ArrowLeft size={16} /> Back to Cart
          </Link>
          <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tighter text-zinc-900 dark:text-white leading-[0.9]">Secure<br />Payment</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Methods Section */}
          <div className="lg:col-span-12 xl:col-span-7">
            <div className="space-y-4">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500 mb-6">Pilih Metode Pembayaran</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setSelectedMethod(method.name)}
                    className={`relative p-6 rounded-[30px] border-2 text-left transition-all duration-300 overflow-hidden group h-full
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
                    <h3 className="text-md font-black uppercase tracking-tight mb-1 text-zinc-900 dark:text-white">{method.name}</h3>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{method.description}</p>
                    
                    {/* Hover Glow */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-[#BEF264]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                  </button>
                ))}
            </div>

            <AnimatePresence mode="wait">
              {selectedMethod === "Crypto" && (
                <CryptoPaymentUI onConfirm={handleFinishPayment} isProcessing={isProcessing} />
              )}
              {selectedMethod === "MasterCard" && (
                <CardPaymentUI onConfirm={handleFinishPayment} isProcessing={isProcessing} />
              )}
              {(selectedMethod === "BCA Prioritas" || selectedMethod === "Bank Mandiri") && (
                <BankPaymentUI method={selectedMethod} onConfirm={handleFinishPayment} isProcessing={isProcessing} />
              )}
            </AnimatePresence>

              {!selectedMethod && (
                <div className="mt-12 p-8 rounded-[40px] bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 text-center py-24 transition-colors">
                   <div className="w-20 h-20 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Wallet className="text-zinc-300 dark:text-zinc-600" size={40} />
                   </div>
                   <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 dark:text-zinc-500">Pilih metode di atas untuk melanjutkan pembayaran</p>
                </div>
              )}
            </div>
          </div>

          {/* Summary Section */}
          <div className="lg:col-span-12 xl:col-span-5">
            <div className="bg-zinc-50 dark:bg-zinc-900/50 p-8 sm:p-10 rounded-[45px] shadow-2xl sticky top-32 border border-zinc-100 dark:border-zinc-800 transition-colors">
              <h2 className="text-2xl font-black uppercase tracking-tighter mb-10 pb-6 border-b border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white">Order Detail</h2>
              
              <div className="space-y-4 mb-8 max-h-[200px] overflow-y-auto custom-scrollbar pr-4">
                 {cartItems.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center group">
                       <div className="flex gap-4 items-center">
                          <div className="w-12 h-12 bg-zinc-100 dark:bg-black rounded-xl flex items-center justify-center p-2 relative border border-zinc-200 dark:border-zinc-800">
                             <NextImage src={item.image} alt={item.name} fill className="object-contain p-2" />
                          </div>
                          <div>
                             <p className="text-xs font-black uppercase tracking-widest text-zinc-900 dark:text-white">{item.name}</p>
                             <p className="text-[10px] text-[#A3E635] font-black uppercase tracking-widest">Qty: {item.quantity}</p>
                          </div>
                       </div>
                       <p className="text-xs font-black tracking-tighter text-zinc-900 dark:text-white">{item.price}</p>
                    </div>
                 ))}
              </div>
 
              <div className="space-y-6 mb-12">
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
                  <span>Subtotal</span>
                  <span className="text-zinc-900 dark:text-white">Rp. {total.toFixed(1)}M</span>
                </div>
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
                  <span>Vat & Tax (10%)</span>
                  <span className="text-zinc-900 dark:text-white">Rp. {(total * 0.1).toFixed(1)}M</span>
                </div>
                <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800 flex justify-between items-end">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#84CC16]">Total Payable</span>
                    <p className="text-4xl font-black tracking-tighter text-zinc-900 dark:text-white">Rp. {totalWithTax.toFixed(1)} M</p>
                  </div>
                  <Globe className="text-zinc-200 dark:text-white/10 translate-y-2 pointer-events-none" size={60} />
                </div>
              </div>
 
              <div className="mt-8 flex items-center justify-center gap-4 text-zinc-300 dark:text-zinc-700">
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

