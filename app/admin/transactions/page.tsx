"use client";

import { useEffect, useState, useCallback } from "react";
import { 
  IconCheck, 
  IconClock, 
  IconCreditCard,
  IconTrash,
  IconSearch,
  IconAlertTriangle,
  IconTrashX
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

const PAYMENT_METHODS = [
  { key: "all", label: "Semua", color: "bg-blue-500" },
  { key: "Crypto", label: "Crypto", color: "bg-orange-500" },
  { key: "Mastercard", label: "Mastercard", color: "bg-red-500" },
  { key: "BCA Prioritas", label: "BCA Prioritas", color: "bg-sky-500" },
  { key: "Bank Mandiri", label: "Bank Mandiri", color: "bg-blue-700" },
  { key: "Kartu Kredit", label: "Kartu Kredit", color: "bg-violet-500" },
  { key: "E-Wallet", label: "E-Wallet", color: "bg-emerald-500" },
  { key: "Transfer Bank", label: "Transfer Bank", color: "bg-teal-500" },
];

const STATUS_TABS = [
  { key: "all", label: "Semua" },
  { key: "completed", label: "Selesai" },
  { key: "pending", label: "Pending" },
  { key: "cancelled", label: "Dibatalkan" },
];

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [activePayment, setActivePayment] = useState("all");
  const [activeStatus, setActiveStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [bulkDeleteLoading, setBulkDeleteLoading] = useState(false);

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/transactions");
      const data = await res.json();
      setTransactions(data.transactions || []);
    } catch {
      console.error("Failed to fetch transactions");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus transaksi ini?")) return;
    
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

  // Get expired pending transactions (older than 2 days)
  const twoDaysAgo = new Date();
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
  const expiredPending = transactions.filter(t => 
    t.status === 'pending' && new Date(t.created_at) < twoDaysAgo
  );

  const handleBulkDeleteExpired = async () => {
    if (!confirm(`Hapus ${expiredPending.length} transaksi pending yang sudah lebih dari 2 hari?`)) return;
    
    setBulkDeleteLoading(true);
    try {
      for (const t of expiredPending) {
        await fetch("/api/admin/transactions", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: t.id }),
        });
      }
      setTransactions(prev => prev.filter(t => !expiredPending.find(e => e.id === t.id)));
    } catch {
      alert("Terjadi kesalahan saat menghapus transaksi");
    } finally {
      setBulkDeleteLoading(false);
    }
  };

  // Filter transactions
  const filtered = transactions.filter(t => {
    const matchPayment = activePayment === "all" || t.payment_method === activePayment;
    const matchStatus = activeStatus === "all" || t.status === activeStatus;
    const matchSearch = searchQuery === "" || 
      t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.items && t.items.some(item => item.name.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchPayment && matchStatus && matchSearch;
  });

  const paymentCounts = PAYMENT_METHODS.map(m => ({
    ...m,
    count: m.key === "all" 
      ? transactions.length 
      : transactions.filter(t => t.payment_method === m.key).length,
  })).filter(m => m.key === "all" || m.count > 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
          Daftar Transaksi
        </h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
          Kelola dan filter semua transaksi berdasarkan metode pembayaran.
        </p>
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
              Transaksi ini disarankan untuk dihapus agar tidak menumpuk.
            </p>
          </div>
          <button
            onClick={handleBulkDeleteExpired}
            disabled={bulkDeleteLoading}
            className="flex items-center gap-1.5 bg-amber-600 hover:bg-amber-500 text-white px-3 py-2 rounded-xl text-xs font-semibold transition-colors disabled:opacity-50 whitespace-nowrap"
          >
            <IconTrashX className="w-3.5 h-3.5" />
            {bulkDeleteLoading ? "Menghapus..." : "Hapus Semua"}
          </button>
        </div>
      )}

      {/* Search Bar */}
      <div className="relative">
        <IconSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
        <input
          type="text"
          placeholder="Cari transaksi berdasarkan ID atau nama produk..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 pl-10 pr-4 py-3 rounded-xl text-sm text-neutral-900 dark:text-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all"
        />
      </div>

      {/* Status Tabs */}
      <div className="flex items-center gap-1 bg-neutral-100 dark:bg-neutral-800/50 p-1 rounded-xl w-fit">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveStatus(tab.key)}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeStatus === tab.key 
                ? "bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-sm" 
                : "text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Payment Method Filter */}
      <div className="flex flex-wrap gap-2">
        {paymentCounts.map((method) => (
          <button
            key={method.key}
            onClick={() => setActivePayment(method.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activePayment === method.key 
                ? "bg-blue-600 text-white shadow-sm shadow-blue-500/20" 
                : "bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800"
            }`}
          >
            {method.key !== "all" && (
              <span className={`w-2 h-2 rounded-full ${method.color}`} />
            )}
            {method.label}
            <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${
              activePayment === method.key 
                ? "bg-white/20" 
                : "bg-neutral-100 dark:bg-neutral-800 text-neutral-400"
            }`}>
              {method.count}
            </span>
          </button>
        ))}
      </div>

      {/* Transaction Table */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-neutral-50 dark:bg-neutral-800/30 border-b border-neutral-100 dark:border-neutral-800">
                <th className="px-5 py-3 text-[10px] font-semibold uppercase tracking-wider text-neutral-400">ID Transaksi</th>
                <th className="px-5 py-3 text-[10px] font-semibold uppercase tracking-wider text-neutral-400">Produk</th>
                <th className="px-5 py-3 text-[10px] font-semibold uppercase tracking-wider text-neutral-400">Total</th>
                <th className="px-5 py-3 text-[10px] font-semibold uppercase tracking-wider text-neutral-400">Status</th>
                <th className="px-5 py-3 text-[10px] font-semibold uppercase tracking-wider text-neutral-400">Metode</th>
                <th className="px-5 py-3 text-[10px] font-semibold uppercase tracking-wider text-neutral-400">Tanggal</th>
                <th className="px-5 py-3 text-[10px] font-semibold uppercase tracking-wider text-neutral-400">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-50 dark:divide-neutral-800">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-5 py-16 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                      <span className="text-sm text-neutral-400">Memuat data...</span>
                    </div>
                  </td>
                </tr>
              ) : filtered.length > 0 ? (
                filtered.map((transaction) => {
                  const isExpired = transaction.status === 'pending' && new Date(transaction.created_at) < twoDaysAgo;
                  return (
                    <tr key={transaction.id} className={`hover:bg-neutral-50 dark:hover:bg-neutral-800/20 transition-colors ${isExpired ? 'bg-amber-50/50 dark:bg-amber-900/5' : ''}`}>
                      <td className="px-5 py-3.5">
                        <span className="text-xs font-mono font-medium text-neutral-400">
                          #{transaction.id.substring(0, 8)}
                        </span>
                        {isExpired && (
                          <span className="ml-1.5 text-[9px] font-semibold text-amber-600 bg-amber-100 dark:bg-amber-900/20 px-1.5 py-0.5 rounded">
                            EXPIRED
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex flex-col">
                          {transaction.items && Array.isArray(transaction.items) ? (
                            transaction.items.map((item: TransactionItem, i: number) => (
                              <span key={i} className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                                {item.name} {item.quantity > 1 ? `(x${item.quantity})` : ''}
                              </span>
                            ))
                          ) : (
                            <span className="text-sm italic text-neutral-400">Tidak ada item</span>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-sm font-bold text-neutral-900 dark:text-white">
                          {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(transaction.total_amount)}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={[
                          "px-2.5 py-1 rounded-full text-[10px] font-semibold flex items-center gap-1 w-fit",
                          transaction.status === 'completed' 
                            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400" 
                            : transaction.status === 'cancelled'
                              ? "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                              : "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400"
                        ].filter(Boolean).join(" ")}>
                          {transaction.status === 'completed' ? <IconCheck className="w-3 h-3" /> : <IconClock className="w-3 h-3" />}
                          {transaction.status === 'completed' ? 'Selesai' : transaction.status === 'pending' ? 'Pending' : transaction.status}
                        </span>
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
                            hour: '2-digit',
                            minute: '2-digit'
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
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="px-5 py-16 text-center text-neutral-400 font-medium text-sm">
                    Tidak ada transaksi untuk filter ini.
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
