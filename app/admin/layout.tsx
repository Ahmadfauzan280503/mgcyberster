"use client";

import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { 
  IconLayoutDashboard, 
  IconArrowLeft,
  IconShieldLock,
  IconPackage,
  IconReceipt,
  IconSettings,
  IconLogout,
  IconCreditCard,
  IconChevronRight
} from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/Logo";

const LogoSmall = () => {
  return (
    <Link
      href="/"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <div className="h-5 w-6 bg-gradient-to-br from-blue-500 to-violet-600 rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
    </Link>
  );
};

// Breadcrumb component
function Breadcrumb() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  
  const labels: Record<string, string> = {
    admin: "Dashboard",
    products: "Produk",
    transactions: "Transaksi",
    settings: "Settings",
    credit: "Kredit",
  };

  return (
    <div className="flex items-center gap-1.5 text-xs font-medium text-neutral-400 mb-6">
      <Link href="/admin" className="hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors">
        Admin
      </Link>
      {segments.slice(1).map((segment, i) => (
        <React.Fragment key={i}>
          <IconChevronRight className="w-3 h-3 text-neutral-300 dark:text-neutral-600" />
          <span className="text-neutral-700 dark:text-neutral-200 font-semibold">
            {labels[segment] || segment}
          </span>
        </React.Fragment>
      ))}
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [authorized, setAuthorized] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (data.success) {
        setAuthorized(true);
      } else {
        setError(data.error || "Gagal melakukan verifikasi");
      }
    } catch {
      setError("Terjadi kesalahan jaringan");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setAuthorized(false);
    setPassword("");
  };

  if (!authorized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 flex items-center justify-center p-6">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -left-20 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 -right-20 w-72 h-72 bg-violet-500/5 rounded-full blur-3xl" />
        </div>
        
        <div className="w-full max-w-md bg-zinc-900/80 backdrop-blur-xl border border-zinc-800/80 p-10 rounded-[32px] shadow-2xl relative">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-violet-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-blue-500/20">
               <IconShieldLock className="text-white w-8 h-8" />
            </div>
            <h1 className="text-2xl font-black text-white uppercase tracking-tight">Admin Access</h1>
            <p className="text-zinc-500 text-sm mt-2 font-medium">Silakan masukkan password admin untuk melanjutkan.</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <input 
                type="password" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-zinc-800/50 border border-zinc-700/50 p-4 rounded-2xl text-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all text-center tracking-widest font-mono"
              />
              {error && <p className="text-red-500 text-xs font-bold text-center mt-2">{error}</p>}
            </div>
            <button 
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-violet-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:from-blue-500 hover:to-violet-500 transition-all shadow-xl shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Memproses..." : "Masuk Dashboard"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  const links = [
    {
      label: "Dashboard",
      href: "/admin",
      icon: (
        <IconLayoutDashboard className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Produk",
      href: "/admin/products",
      icon: (
        <IconPackage className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Transaksi",
      href: "/admin/transactions",
      icon: (
        <IconReceipt className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Kredit",
      href: "/admin/credit",
      icon: (
        <IconCreditCard className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Settings",
      href: "/admin/settings",
      icon: (
        <IconSettings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Home",
      href: "/",
      icon: (
        <IconArrowLeft className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
  ];

  
  return (
    <div
      className={cn(
        "rounded-md flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-900 w-full flex-1 max-w-full mx-auto border border-neutral-200 dark:border-neutral-700 overflow-hidden",
        "h-screen"
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {open ? <Logo /> : <LogoSmall />}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center justify-start gap-2 py-2 group/sidebar"
            >
              <IconLogout className="text-red-500 h-5 w-5 flex-shrink-0" />
              {open && (
                <span className="text-red-500 text-sm group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre inline-block font-medium">
                  Logout
                </span>
              )}
            </button>
            <SidebarLink
              link={{
                label: "Admin",
                href: "#",
                icon: (
                   <div className="h-7 w-7 flex-shrink-0 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white text-[10px] font-bold shadow-lg">
                    AD
                   </div>
                ),
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>
      <main className="flex-1 overflow-y-auto p-4 md:p-10 bg-white dark:bg-neutral-950">
        <Breadcrumb />
        {children}
      </main>
    </div>
  );
}
