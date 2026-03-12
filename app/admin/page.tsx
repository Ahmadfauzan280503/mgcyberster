import { supabaseAdmin } from "@/lib/supabase-server";
import { 
  IconCheck, 
  IconClock, 
  IconPackage, 
  IconCreditCard 
} from "@tabler/icons-react";

// Force dynamic fetch to get latest transactions
export const dynamic = "force-dynamic";

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

export default async function AdminDashboard() {
  const { data: transactions, error } = await supabaseAdmin
    .from("transactions")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
        <h2 className="text-2xl font-bold text-red-500">Error Load Data</h2>
        <p className="text-neutral-500">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-neutral-900 dark:text-white uppercase">
          Manajemen Transaksi
        </h1>
        <p className="text-neutral-500 dark:text-neutral-400 font-medium">
          Daftar pesanan dari pelanggan Showroom MG Cyberster.
        </p>
      </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard 
          title="Total Transaksi" 
          value={transactions?.length || 0} 
          icon={<IconPackage className="w-6 h-6" />}
          color="bg-blue-500"
        />
        <StatsCard 
          title="Pembayaran Berhasil" 
          value={transactions?.filter((t: Transaction) => t.status === 'completed').length || 0} 
          icon={<IconCheck className="w-6 h-6" />}
          color="bg-green-500"
        />
        <StatsCard 
          title="Menunggu Pembayaran" 
          value={transactions?.filter((t: Transaction) => t.status === 'pending').length || 0} 
          icon={<IconClock className="w-6 h-6" />}
          color="bg-orange-500"
        />
      </div>

      <div className="bg-white dark:bg-neutral-900 rounded-[30px] border border-neutral-200 dark:border-neutral-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-neutral-50 dark:bg-neutral-800/50 border-b border-neutral-200 dark:border-neutral-800">
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-neutral-400">ID Transaksi</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-neutral-400">Produk</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-neutral-400">Total</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-neutral-400">Status</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-neutral-400">Metode</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-neutral-400">Tanggal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {transactions && transactions.length > 0 ? (
                (transactions as Transaction[]).map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <span className="text-xs font-bold text-neutral-400 font-mono">
                        #{transaction.id.substring(0, 8)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        {transaction.items && Array.isArray(transaction.items) ? (
                          transaction.items.map((item: TransactionItem, i: number) => (
                            <span key={i} className="text-sm font-bold text-neutral-800 dark:text-neutral-200">
                              {item.name} {item.quantity > 1 ? `(x${item.quantity})` : ''}
                            </span>
                          ))
                        ) : (
                          <span className="text-sm italic text-neutral-400">Tidak ada item</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-black text-neutral-900 dark:text-white">
                        {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(transaction.total_amount)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={transaction.status} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                         <IconCreditCard className="w-4 h-4 text-neutral-400" />
                         <span className="text-xs font-bold uppercase text-neutral-500">
                            {transaction.payment_method || '-'}
                         </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-medium text-neutral-500">
                        {new Date(transaction.created_at).toLocaleDateString('id-ID', { 
                          day: '2-digit', 
                          month: 'short', 
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center text-neutral-400 font-medium">
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

function StatsCard({ title, value, icon, color }: { title: string, value: number | string, icon: React.ReactNode, color: string }) {
  return (
    <div className="bg-white dark:bg-neutral-900 p-6 rounded-[30px] border border-neutral-200 dark:border-neutral-800 shadow-sm flex items-center justify-between">
      <div>
        <p className="text-xs font-black uppercase tracking-widest text-neutral-400 mb-1">{title}</p>
        <p className="text-3xl font-black text-neutral-900 dark:text-white">{value}</p>
      </div>
      <div className={`${color} p-4 rounded-2xl text-white shadow-lg`}>
        {icon}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const isCompleted = status === 'completed';
  return (
    <span className={cn(
      "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 w-fit",
      isCompleted 
        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" 
        : "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
    )}>
      {isCompleted ? <IconCheck className="w-3 h-3" /> : <IconClock className="w-3 h-3" />}
      {status}
    </span>
  );
}

function cn(...inputs: (string | boolean | undefined)[]) {
  return inputs.filter(Boolean).join(" ");
}
