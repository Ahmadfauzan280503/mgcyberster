"use client";

import { useEffect, useState, useCallback } from "react";
import { 
  IconCreditCard,
  IconCheck,
  IconAlertTriangle,
  IconCalendarDue,
  IconCurrencyDollar
} from "@tabler/icons-react";

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

interface CreditPayment {
  transactionId: string;
  productName: string;
  totalAmount: number;
  monthlyPayment: number;
  totalMonths: number;
  paidMonths: number;
  nextDueDate: string;
  status: "on_time" | "overdue" | "paid";
}

// Generate mock credit data from transactions that used credit payment
function generateCreditData(transactions: Transaction[]): CreditPayment[] {
  const creditTransactions = transactions.filter(
    t => t.payment_method === 'Kartu Kredit' && t.status === 'completed'
  );
  
  return creditTransactions.map(t => {
    const totalMonths = 12;
    const monthsSinceCreated = Math.floor(
      (Date.now() - new Date(t.created_at).getTime()) / (1000 * 60 * 60 * 24 * 30)
    );
    const paidMonths = Math.min(monthsSinceCreated + 1, totalMonths);
    const nextDue = new Date(t.created_at);
    nextDue.setMonth(nextDue.getMonth() + paidMonths);
    
    let status: "on_time" | "overdue" | "paid" = "on_time";
    if (paidMonths >= totalMonths) status = "paid";
    else if (nextDue < new Date()) status = "overdue";
    
    const productName = t.items && t.items.length > 0 ? t.items[0].name : "Produk";
    
    return {
      transactionId: t.id,
      productName,
      totalAmount: t.total_amount,
      monthlyPayment: Math.ceil(t.total_amount / totalMonths),
      totalMonths,
      paidMonths,
      nextDueDate: nextDue.toISOString(),
      status,
    };
  });
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { bg: string; text: string; label: string; icon: React.ReactNode }> = {
    on_time: { 
      bg: "bg-emerald-50 dark:bg-emerald-900/20", 
      text: "text-emerald-700 dark:text-emerald-400", 
      label: "Tepat Waktu",
      icon: <IconCheck className="w-3 h-3" />
    },
    overdue: { 
      bg: "bg-red-50 dark:bg-red-900/20", 
      text: "text-red-700 dark:text-red-400", 
      label: "Terlambat",
      icon: <IconAlertTriangle className="w-3 h-3" />
    },
    paid: { 
      bg: "bg-blue-50 dark:bg-blue-900/20", 
      text: "text-blue-700 dark:text-blue-400", 
      label: "Lunas",
      icon: <IconCheck className="w-3 h-3" />
    },
  };
  
  const c = config[status] || config.on_time;
  
  return (
    <span className={`${c.bg} ${c.text} px-2.5 py-1 rounded-full text-[10px] font-semibold flex items-center gap-1 w-fit`}>
      {c.icon}
      {c.label}
    </span>
  );
}

function ProgressBar({ current, total }: { current: number; total: number }) {
  const pct = Math.min((current / total) * 100, 100);
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] font-medium text-neutral-400">{current}/{total} bulan</span>
        <span className="text-[10px] font-semibold text-neutral-600 dark:text-neutral-300">{Math.round(pct)}%</span>
      </div>
      <div className="h-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
        <div 
          className={`h-full rounded-full transition-all duration-500 ${
            pct >= 100 ? 'bg-blue-500' : pct > 50 ? 'bg-emerald-500' : 'bg-amber-500'
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export default function CreditPage() {
  const [credits, setCredits] = useState<CreditPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "on_time" | "overdue" | "paid">("all");

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/transactions");
      const data = await res.json();
      const transactions: Transaction[] = data.transactions || [];
      setCredits(generateCreditData(transactions));
    } catch {
      console.error("Failed to fetch");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filtered = filter === "all" ? credits : credits.filter(c => c.status === filter);

  const totalCredit = credits.reduce((s, c) => s + c.totalAmount, 0);
  const totalPaid = credits.reduce((s, c) => s + (c.monthlyPayment * c.paidMonths), 0);
  const overdueCount = credits.filter(c => c.status === "overdue").length;
  const paidCount = credits.filter(c => c.status === "paid").length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-neutral-400 font-medium text-sm">Memuat data kredit...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
          Pembayaran Kredit
        </h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
          Kelola cicilan dan status pembayaran kredit customer.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-neutral-900 p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-medium text-neutral-500">Total Kredit</p>
            <div className="bg-violet-500 p-2 rounded-xl text-white shadow-sm">
              <IconCreditCard className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-neutral-900 dark:text-white">{credits.length}</p>
        </div>
        <div className="bg-white dark:bg-neutral-900 p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-medium text-neutral-500">Total Nilai Kredit</p>
            <div className="bg-blue-500 p-2 rounded-xl text-white shadow-sm">
              <IconCurrencyDollar className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl font-bold text-neutral-900 dark:text-white">
            {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(totalCredit)}
          </p>
        </div>
        <div className="bg-white dark:bg-neutral-900 p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-medium text-neutral-500">Total Terbayar</p>
            <div className="bg-emerald-500 p-2 rounded-xl text-white shadow-sm">
              <IconCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl font-bold text-neutral-900 dark:text-white">
            {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(totalPaid)}
          </p>
          <p className="text-[10px] text-emerald-600 font-semibold mt-1">{paidCount} kredit lunas</p>
        </div>
        <div className="bg-white dark:bg-neutral-900 p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-medium text-neutral-500">Terlambat Bayar</p>
            <div className="bg-red-500 p-2 rounded-xl text-white shadow-sm">
              <IconAlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-neutral-900 dark:text-white">{overdueCount}</p>
          {overdueCount > 0 && (
            <p className="text-[10px] text-red-500 font-semibold mt-1">Perlu tindak lanjut</p>
          )}
        </div>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-1 bg-neutral-100 dark:bg-neutral-800/50 p-1 rounded-xl w-fit">
        {[
          { key: "all", label: "Semua" },
          { key: "on_time", label: "Tepat Waktu" },
          { key: "overdue", label: "Terlambat" },
          { key: "paid", label: "Lunas" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key as typeof filter)}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              filter === tab.key 
                ? "bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-sm" 
                : "text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Credit List */}
      {filtered.length === 0 ? (
        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-16 text-center">
          <IconCreditCard className="w-10 h-10 text-neutral-300 dark:text-neutral-600 mx-auto mb-3" />
          <p className="text-sm font-medium text-neutral-400">
            {credits.length === 0 
              ? "Belum ada transaksi dengan metode Kartu Kredit."
              : "Tidak ada kredit dengan status ini."
            }
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neutral-50 dark:bg-neutral-800/30 border-b border-neutral-100 dark:border-neutral-800">
                  <th className="px-5 py-3 text-[10px] font-semibold uppercase tracking-wider text-neutral-400">ID</th>
                  <th className="px-5 py-3 text-[10px] font-semibold uppercase tracking-wider text-neutral-400">Produk</th>
                  <th className="px-5 py-3 text-[10px] font-semibold uppercase tracking-wider text-neutral-400">Total Kredit</th>
                  <th className="px-5 py-3 text-[10px] font-semibold uppercase tracking-wider text-neutral-400">Cicilan/Bulan</th>
                  <th className="px-5 py-3 text-[10px] font-semibold uppercase tracking-wider text-neutral-400">Progress</th>
                  <th className="px-5 py-3 text-[10px] font-semibold uppercase tracking-wider text-neutral-400">Jatuh Tempo</th>
                  <th className="px-5 py-3 text-[10px] font-semibold uppercase tracking-wider text-neutral-400">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-50 dark:divide-neutral-800">
                {filtered.map((credit) => (
                  <tr key={credit.transactionId} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/20 transition-colors">
                    <td className="px-5 py-4">
                      <span className="text-xs font-mono font-medium text-neutral-400">
                        #{credit.transactionId.substring(0, 8)}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                        {credit.productName}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm font-bold text-neutral-900 dark:text-white">
                        {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(credit.totalAmount)}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                        {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(credit.monthlyPayment)}
                      </span>
                    </td>
                    <td className="px-5 py-4 min-w-[150px]">
                      <ProgressBar current={credit.paidMonths} total={credit.totalMonths} />
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5">
                        <IconCalendarDue className="w-3.5 h-3.5 text-neutral-400" />
                        <span className="text-xs text-neutral-500">
                          {credit.status === "paid" ? "Lunas" : new Date(credit.nextDueDate).toLocaleDateString('id-ID', { 
                            day: '2-digit', 
                            month: 'short', 
                            year: 'numeric' 
                          })}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={credit.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
