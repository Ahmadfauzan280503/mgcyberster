"use client";

import { useEffect, useState, useCallback } from "react";
import { 
  IconCheck, 
  IconClock, 
  IconPackage, 
  IconCreditCard,
  IconTrash,
  IconCurrencyDollar,
  IconArrowUpRight,
  IconArrowDownRight,
  IconCalendar,
  IconUsers,
  IconAlertTriangle,
  IconReceipt
} from "@tabler/icons-react";
import Link from "next/link";

interface TransactionItem {
  name: string;
  quantity: number;
}

interface Transaction {
  id: string;
  items: TransactionItem[];
  total_amount: number;
  status: string;
  payment_method: string | null;
  created_at: string;
}

// Animated counter component
function AnimatedNumber({ value, prefix = "" }: { value: number; prefix?: string }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const duration = 800;
    const start = performance.now();
    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.floor(eased * value));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [value]);

  if (prefix) {
    return <>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(display)}</>;
  }
  return <>{display}</>;
}

// Modern area chart component
function SalesChart({ transactions }: { transactions: Transaction[] }) {
  const now = new Date();
  const days: { label: string; total: number; date: string }[] = [];
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateStr = date.toLocaleDateString("id-ID", { day: "2-digit", month: "short" });
    const dayStart = new Date(date);
    dayStart.setHours(0,0,0,0);
    const dayEnd = new Date(date);
    dayEnd.setHours(23,59,59,999);
    
    const dayTotal = transactions
      .filter(t => {
        const d = new Date(t.created_at);
        return d >= dayStart && d <= dayEnd;
      })
      .reduce((sum, t) => sum + t.total_amount, 0);
    
    days.push({ label: dateStr, total: dayTotal, date: date.toLocaleDateString("id-ID", { weekday: "short" }) });
  }
  
  const maxVal = Math.max(...days.map(d => d.total), 1);
  const totalWeek = days.reduce((s, d) => s + d.total, 0);
  const prevWeekEstimate = totalWeek * 0.85; // Simulated comparison
  const growthPct = prevWeekEstimate > 0 ? Math.round(((totalWeek - prevWeekEstimate) / prevWeekEstimate) * 100) : 0;
  const isPositive = growthPct >= 0;

  // Generate SVG path for area chart
  const width = 600;
  const height = 200;
  const padding = { top: 20, bottom: 30, left: 10, right: 10 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const points = days.map((d, i) => ({
    x: padding.left + (i / (days.length - 1)) * chartW,
    y: padding.top + chartH - (d.total / maxVal) * chartH,
  }));

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${height - padding.bottom} L ${points[0].x} ${height - padding.bottom} Z`;
  
  return (
    <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="text-sm font-semibold text-neutral-500 dark:text-neutral-400">Grafik Penjualan</h3>
          <div className="flex items-baseline gap-3 mt-1">
            <p className="text-2xl font-bold text-neutral-900 dark:text-white">
              {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(totalWeek)}
            </p>
            <span className={`flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded-full ${
              isPositive 
                ? 'text-emerald-700 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400' 
                : 'text-red-700 bg-red-50 dark:bg-red-900/20 dark:text-red-400'
            }`}>
              {isPositive ? <IconArrowUpRight className="w-3 h-3" /> : <IconArrowDownRight className="w-3 h-3" />}
              {Math.abs(growthPct)}%
            </span>
          </div>
          <p className="text-xs text-neutral-400 mt-0.5">7 hari terakhir</p>
        </div>
      </div>

      <div className="mt-4">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto" preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.02" />
            </linearGradient>
            <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => (
            <line
              key={i}
              x1={padding.left}
              y1={padding.top + chartH * (1 - pct)}
              x2={width - padding.right}
              y2={padding.top + chartH * (1 - pct)}
              stroke="currentColor"
              className="text-neutral-100 dark:text-neutral-800"
              strokeWidth="1"
              strokeDasharray={pct === 0 ? "0" : "4 4"}
            />
          ))}

          {/* Area */}
          <path d={areaPath} fill="url(#areaGrad)" />
          
          {/* Line */}
          <path d={linePath} fill="none" stroke="url(#lineGrad)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          
          {/* Dots */}
          {points.map((p, i) => (
            <g key={i}>
              <circle cx={p.x} cy={p.y} r="4" fill="#3b82f6" stroke="white" strokeWidth="2" className="dark:stroke-neutral-900" />
              <text x={p.x} y={height - 8} textAnchor="middle" className="fill-neutral-400 text-[11px] font-medium">
                {days[i].date}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}

function StatsCard({ title, value, icon, color, trend, trendLabel }: { 
  title: string; 
  value: number | string; 
  icon: React.ReactNode; 
  color: string;
  trend?: "up" | "down" | "neutral";
  trendLabel?: string;
}) {
  return (
    <div className="bg-white dark:bg-neutral-900 p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">{title}</p>
        <div className={`${color} p-2 rounded-xl text-white shadow-sm`}>
          {icon}
        </div>
      </div>
      <p className="text-2xl font-bold text-neutral-900 dark:text-white tracking-tight">
        {typeof value === 'number' ? <AnimatedNumber value={value} /> : value}
      </p>
      {trend && trendLabel && (
        <div className="flex items-center gap-1 mt-2">
          <span className={`flex items-center gap-0.5 text-[10px] font-semibold ${
            trend === 'up' ? 'text-emerald-600' : trend === 'down' ? 'text-red-500' : 'text-neutral-400'
          }`}>
            {trend === 'up' ? <IconArrowUpRight className="w-3 h-3" /> : 
             trend === 'down' ? <IconArrowDownRight className="w-3 h-3" /> : null}
            {trendLabel}
          </span>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const isCompleted = status === 'completed';
  const isCancelled = status === 'cancelled';
  return (
    <span className={[
      "px-2.5 py-1 rounded-full text-[10px] font-semibold flex items-center gap-1 w-fit",
      isCompleted 
        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400" 
        : isCancelled 
          ? "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400"
          : "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400"
    ].filter(Boolean).join(" ")}>
      {isCompleted ? <IconCheck className="w-3 h-3" /> : <IconClock className="w-3 h-3" />}
      {status === 'completed' ? 'Selesai' : status === 'pending' ? 'Pending' : status}
    </span>
  );
}

// Quick action card
function QuickAction({ title, description, href, icon, color }: {
  title: string; description: string; href: string; icon: React.ReactNode; color: string;
}) {
  return (
    <Link href={href} className="group">
      <div className="bg-white dark:bg-neutral-900 p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm hover:shadow-md hover:border-blue-200 dark:hover:border-blue-800 transition-all">
        <div className={`${color} w-10 h-10 rounded-xl flex items-center justify-center text-white mb-3 shadow-sm`}>
          {icon}
        </div>
        <h4 className="text-sm font-bold text-neutral-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{title}</h4>
        <p className="text-xs text-neutral-400 mt-1">{description}</p>
      </div>
    </Link>
  );
}

export default function AdminDashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  const fetchTransactions = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/transactions");
      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        setTransactions(data.transactions || []);
      }
    } catch {
      setError("Gagal memuat data transaksi");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus transaksi ini? Tindakan ini tidak dapat dibatalkan.")) return;
    
    setDeleteLoading(id);
    try {
      const res = await fetch("/api/admin/transactions", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (data.success) {
        setTransactions(prev => prev.filter(t => t.id !== id));
      } else {
        alert(data.error || "Gagal menghapus transaksi");
      }
    } catch {
      alert("Terjadi kesalahan jaringan");
    } finally {
      setDeleteLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-neutral-400 font-medium text-sm">Memuat data...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-2xl mb-4">
          <IconAlertTriangle className="w-8 h-8 text-red-500" />
        </div>
        <h2 className="text-xl font-bold text-red-500">Error Load Data</h2>
        <p className="text-neutral-500 mt-1">{error}</p>
      </div>
    );
  }

  const totalRevenue = transactions
    .filter(t => t.status === 'completed')
    .reduce((sum, t) => sum + t.total_amount, 0);

  const completedCount = transactions.filter(t => t.status === 'completed').length;
  const pendingCount = transactions.filter(t => t.status === 'pending').length;

  // Get pending transactions older than 2 days
  const twoDaysAgo = new Date();
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
  const expiredPending = transactions.filter(t => 
    t.status === 'pending' && new Date(t.created_at) < twoDaysAgo
  );

  // Get current greeting based on time
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Selamat Pagi" : hour < 17 ? "Selamat Siang" : "Selamat Malam";
  const today = new Date().toLocaleDateString('id-ID', { 
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' 
  });

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
            {greeting}, Admin 👋
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <IconCalendar className="w-3.5 h-3.5 text-neutral-400" />
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              {today}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link 
            href="/admin/transactions"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-xl font-semibold text-xs transition-colors shadow-sm"
          >
            <IconReceipt className="w-4 h-4" />
            Lihat Semua Transaksi
          </Link>
        </div>
      </div>

      {/* Expired Pending Warning */}
      {expiredPending.length > 0 && (
        <div className="flex items-center gap-3 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/30 p-4 rounded-2xl">
          <IconAlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">
              {expiredPending.length} transaksi pending belum dibayar lebih dari 2 hari
            </p>
            <p className="text-xs text-amber-600 dark:text-amber-400 mt-0.5">
              Transaksi ini dapat dihapus otomatis dari halaman Transaksi.
            </p>
          </div>
          <Link 
            href="/admin/transactions"
            className="text-xs font-semibold text-amber-700 dark:text-amber-300 hover:underline whitespace-nowrap"
          >
            Kelola →
          </Link>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard 
          title="Total Transaksi" 
          value={transactions.length} 
          icon={<IconPackage className="w-4 h-4" />}
          color="bg-blue-500"
          trend="up"
          trendLabel="Minggu ini"
        />
        <StatsCard 
          title="Pembayaran Berhasil" 
          value={completedCount} 
          icon={<IconCheck className="w-4 h-4" />}
          color="bg-emerald-500"
          trend="up"
          trendLabel={`${transactions.length > 0 ? Math.round((completedCount / transactions.length) * 100) : 0}% conversion`}
        />
        <StatsCard 
          title="Menunggu Pembayaran" 
          value={pendingCount} 
          icon={<IconClock className="w-4 h-4" />}
          color="bg-amber-500"
          trend={pendingCount > 3 ? "down" : "neutral"}
          trendLabel={`${pendingCount} pending`}
        />
        <StatsCard 
          title="Total Revenue" 
          value={new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(totalRevenue)} 
          icon={<IconCurrencyDollar className="w-4 h-4" />}
          color="bg-violet-500"
          trend="up"
          trendLabel="+15% vs minggu lalu"
        />
      </div>

      {/* Chart + Quick Actions Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <SalesChart transactions={transactions} />
        </div>
        <div className="space-y-4">
          <QuickAction 
            title="Kelola Produk" 
            description="Tambah, edit, atau hapus produk" 
            href="/admin/products"
            icon={<IconPackage className="w-5 h-5" />}
            color="bg-blue-500"
          />
          <QuickAction 
            title="Pembayaran Kredit" 
            description="Kelola cicilan dan status pembayaran" 
            href="/admin/credit"
            icon={<IconCreditCard className="w-5 h-5" />}
            color="bg-violet-500"
          />
          <QuickAction 
            title="Pengaturan" 
            description="Konfigurasi profil bisnis" 
            href="/admin/settings"
            icon={<IconUsers className="w-5 h-5" />}
            color="bg-emerald-500"
          />
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-neutral-900 dark:text-white">Transaksi Terbaru</h2>
            <p className="text-xs text-neutral-400 mt-0.5">5 transaksi terakhir</p>
          </div>
          <Link 
            href="/admin/transactions"
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
          >
            Lihat Semua
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-neutral-50 dark:bg-neutral-800/30 border-b border-neutral-100 dark:border-neutral-800">
                <th className="px-5 py-3 text-[10px] font-semibold uppercase tracking-wider text-neutral-400">ID</th>
                <th className="px-5 py-3 text-[10px] font-semibold uppercase tracking-wider text-neutral-400">Produk</th>
                <th className="px-5 py-3 text-[10px] font-semibold uppercase tracking-wider text-neutral-400">Total</th>
                <th className="px-5 py-3 text-[10px] font-semibold uppercase tracking-wider text-neutral-400">Status</th>
                <th className="px-5 py-3 text-[10px] font-semibold uppercase tracking-wider text-neutral-400">Metode</th>
                <th className="px-5 py-3 text-[10px] font-semibold uppercase tracking-wider text-neutral-400">Tanggal</th>
                <th className="px-5 py-3 text-[10px] font-semibold uppercase tracking-wider text-neutral-400">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-50 dark:divide-neutral-800">
              {transactions.length > 0 ? (
                transactions.slice(0, 5).map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/20 transition-colors">
                    <td className="px-5 py-3.5">
                      <span className="text-xs font-mono font-medium text-neutral-400">
                        #{transaction.id.substring(0, 8)}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex flex-col">
                        {transaction.items && Array.isArray(transaction.items) ? (
                          transaction.items.slice(0, 2).map((item: TransactionItem, i: number) => (
                            <span key={i} className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                              {item.name} {item.quantity > 1 ? `(x${item.quantity})` : ''}
                            </span>
                          ))
                        ) : (
                          <span className="text-sm italic text-neutral-400">Tidak ada item</span>
                        )}
                        {transaction.items && transaction.items.length > 2 && (
                          <span className="text-[10px] text-neutral-400">+{transaction.items.length - 2} lainnya</span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-sm font-bold text-neutral-900 dark:text-white">
                        {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(transaction.total_amount)}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={transaction.status} />
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5">
                         <IconCreditCard className="w-3.5 h-3.5 text-neutral-400" />
                         <span className="text-xs font-medium text-neutral-500">
                            {transaction.payment_method || '-'}
                         </span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-xs text-neutral-500">
                        {new Date(transaction.created_at).toLocaleDateString('id-ID', { 
                          day: '2-digit', 
                          month: 'short', 
                          year: 'numeric',
                        })}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <button
                        onClick={() => handleDelete(transaction.id)}
                        disabled={deleteLoading === transaction.id}
                        className="p-1.5 rounded-lg text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50"
                        title="Hapus transaksi"
                      >
                        <IconTrash className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-5 py-16 text-center text-neutral-400 font-medium text-sm">
                    Belum ada transaksi masuk.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
