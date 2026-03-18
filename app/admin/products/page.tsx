"use client";

import { useEffect, useState, useCallback, startTransition } from "react";
import { 
  IconPlus, 
  IconTrash, 
  IconEdit,
  IconX,
  IconPhoto,
  IconCheck,
  IconSearch
} from "@tabler/icons-react";

interface Product {
  id?: string;
  name: string;
  image: string;
  price: string;
  status: string;
}

const DEFAULT_PRODUCTS: Product[] = [
  { name: "BMW i8 Hybrid", image: "/produk-mobil/car-1.png", price: "Rp. 4.2M", status: "Available" },
  { name: "BMW M4 GT3", image: "/produk-mobil/car-2.png", price: "Rp. 6.5M", status: "Race Ready" },
  { name: "AMG GT Black", image: "/produk-mobil/car-3.png", price: "Rp. 5.8M", status: "Limited" },
  { name: "G-Wagon G63", image: "/produk-mobil/car-4.png", price: "Rp. 7.2M", status: "In Stock" },
  { name: "Aventador SVJ", image: "/produk-mobil/car-5.png", price: "Rp. 12.5M", status: "Exotic" },
  { name: "Ferrari 488 Custom", image: "/produk-mobil/car-6.png", price: "Rp. 12.5M", status: "Exotic" },
  { name: "Ferrari Vision GT", image: "/produk-mobil/car-7.png", price: "Rp. 12.5M", status: "Exotic" },
  { name: "Porsche 911 GT3 RS", image: "/produk-mobil/car-8.png", price: "Rp. 12.5M", status: "Exotic" },
  { name: "Porsche GT3 R", image: "/produk-mobil/car-9.png", price: "Rp. 12.5M", status: "Exotic" },
];

const STATUS_OPTIONS = [
  { value: "Available", label: "Available", color: "bg-emerald-500" },
  { value: "In Stock", label: "In Stock", color: "bg-blue-500" },
  { value: "Limited", label: "Limited", color: "bg-amber-500" },
  { value: "Exotic", label: "Exotic", color: "bg-violet-500" },
  { value: "Race Ready", label: "Race Ready", color: "bg-red-500" },
  { value: "Sold Out", label: "Sold Out", color: "bg-neutral-400" },
];

function getStatusColor(status: string) {
  const found = STATUS_OPTIONS.find(s => s.value === status);
  return found?.color || "bg-neutral-400";
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState<Product>({ name: "", image: "", price: "", status: "Available" });
  const [saved, setSaved] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());

  // Load products from localStorage or use defaults
  useEffect(() => {
    const stored = localStorage.getItem("mgcyberster_products");
    startTransition(() => {
      if (stored) {
        setProducts(JSON.parse(stored));
      } else {
        setProducts(DEFAULT_PRODUCTS);
        localStorage.setItem("mgcyberster_products", JSON.stringify(DEFAULT_PRODUCTS));
      }
    });
  }, []);

  const saveProducts = useCallback((newProducts: Product[]) => {
    setProducts(newProducts);
    localStorage.setItem("mgcyberster_products", JSON.stringify(newProducts));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }, []);

  const handleAdd = () => {
    setFormData({ name: "", image: "", price: "", status: "Available" });
    setEditingIndex(null);
    setShowModal(true);
  };

  const handleEdit = (idx: number) => {
    setFormData(products[idx]);
    setEditingIndex(idx);
    setShowModal(true);
  };

  const handleDelete = (idx: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus produk ini?")) return;
    const newProducts = products.filter((_, i) => i !== idx);
    saveProducts(newProducts);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingIndex !== null) {
      const newProducts = [...products];
      newProducts[editingIndex] = formData;
      saveProducts(newProducts);
    } else {
      saveProducts([...products, formData]);
    }
    setShowModal(false);
  };

  const handleBulkDelete = () => {
    if (selectedItems.size === 0) return;
    if (!confirm(`Hapus ${selectedItems.size} produk yang dipilih?`)) return;
    const newProducts = products.filter((_, i) => !selectedItems.has(i));
    saveProducts(newProducts);
    setSelectedItems(new Set());
  };

  const toggleSelect = (idx: number) => {
    setSelectedItems(prev => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedItems.size === filteredProducts.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(filteredProducts.map((_, i) => {
        // Map filtered index back to original index
        return products.indexOf(filteredProducts[i]);
      })));
    }
  };

  // Filter products
  const filteredProducts = products.filter(p => {
    const matchSearch = searchQuery === "" || 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.price.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === "all" || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  // Get unique statuses from products
  const uniqueStatuses = Array.from(new Set(products.map(p => p.status)));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Manajemen Produk
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            Kelola produk yang ditampilkan di halaman utama.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {selectedItems.size > 0 && (
            <button
              onClick={handleBulkDelete}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white px-4 py-2.5 rounded-xl font-semibold text-xs transition-colors"
            >
              <IconTrash className="w-4 h-4" />
              Hapus ({selectedItems.size})
            </button>
          )}
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-xl font-semibold text-xs transition-colors shadow-sm"
          >
            <IconPlus className="w-4 h-4" />
            Tambah Produk
          </button>
        </div>
      </div>

      {/* Saved notification */}
      {saved && (
        <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 p-3 rounded-xl text-sm font-semibold">
          <IconCheck className="w-4 h-4" />
          Produk berhasil disimpan!
        </div>
      )}

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <IconSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Cari produk..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 pl-10 pr-4 py-2.5 rounded-xl text-sm text-neutral-900 dark:text-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all"
          />
        </div>
        <div className="flex items-center gap-1 bg-neutral-100 dark:bg-neutral-800/50 p-1 rounded-xl">
          <button
            onClick={() => setStatusFilter("all")}
            className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
              statusFilter === "all" 
                ? "bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-sm" 
                : "text-neutral-500"
            }`}
          >
            Semua
          </button>
          {uniqueStatuses.map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                statusFilter === status 
                  ? "bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-sm" 
                  : "text-neutral-500"
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${getStatusColor(status)}`} />
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Select All */}
      {filteredProducts.length > 0 && (
        <div className="flex items-center gap-3">
          <button 
            onClick={toggleSelectAll}
            className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline"
          >
            {selectedItems.size === filteredProducts.length ? "Batalkan Pilih Semua" : "Pilih Semua"}
          </button>
          <span className="text-xs text-neutral-400">{filteredProducts.length} produk</span>
        </div>
      )}

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProducts.map((product, idx) => {
          const originalIdx = products.indexOf(product);
          const isSelected = selectedItems.has(originalIdx);
          return (
            <div 
              key={idx} 
              className={`bg-white dark:bg-neutral-900 rounded-2xl border shadow-sm overflow-hidden group transition-all ${
                isSelected 
                  ? 'border-blue-500 ring-1 ring-blue-500/20' 
                  : 'border-neutral-200 dark:border-neutral-800 hover:shadow-md'
              }`}
            >
              <div className="h-[180px] bg-neutral-50 dark:bg-neutral-800/50 relative overflow-hidden flex items-center justify-center">
                {/* Checkbox */}
                <button
                  onClick={() => toggleSelect(originalIdx)}
                  className={`absolute top-3 left-3 z-10 w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                    isSelected 
                      ? 'bg-blue-500 border-blue-500 text-white' 
                      : 'border-neutral-300 dark:border-neutral-600 bg-white/80 dark:bg-neutral-800/80 opacity-0 group-hover:opacity-100'
                  }`}
                >
                  {isSelected && <IconCheck className="w-3 h-3" />}
                </button>

                {product.image ? (
                  <img src={product.image} alt={product.name} className="object-contain w-full h-full p-4" />
                ) : (
                  <IconPhoto className="w-10 h-10 text-neutral-300" />
                )}
                {/* Overlay buttons on hover */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={() => handleEdit(originalIdx)}
                    className="bg-white text-neutral-900 p-2.5 rounded-xl hover:bg-blue-500 hover:text-white transition-all shadow-sm"
                  >
                    <IconEdit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(originalIdx)}
                    className="bg-white text-neutral-900 p-2.5 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
                  >
                    <IconTrash className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-1.5">
                  <h3 className="text-sm font-bold text-neutral-900 dark:text-white truncate">{product.name}</h3>
                  <span className={`flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                    getStatusColor(product.status).replace('bg-', 'bg-') + '/10'
                  } ${getStatusColor(product.status).replace('bg-', 'text-').replace('-500', '-600')} dark:${getStatusColor(product.status).replace('bg-', 'text-').replace('-500', '-400')}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${getStatusColor(product.status)}`} />
                    {product.status}
                  </span>
                </div>
                <p className="text-lg font-bold text-neutral-900 dark:text-white">{product.price}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
                {editingIndex !== null ? "Edit Produk" : "Tambah Produk"}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-neutral-400 hover:text-neutral-600 transition-colors p-1">
                <IconX className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-500">Nama Produk</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Contoh: BMW M4 GT3"
                  className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 p-3 rounded-xl text-sm text-neutral-900 dark:text-white outline-none focus:border-blue-500 transition-all"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-500">URL Gambar</label>
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="/produk-mobil/car-1.png"
                  className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 p-3 rounded-xl text-sm text-neutral-900 dark:text-white outline-none focus:border-blue-500 transition-all"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-500">Harga</label>
                  <input
                    type="text"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="Rp. 6.5M"
                    className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 p-3 rounded-xl text-sm text-neutral-900 dark:text-white outline-none focus:border-blue-500 transition-all"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-500">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 p-3 rounded-xl text-sm text-neutral-900 dark:text-white outline-none focus:border-blue-500 transition-all"
                  >
                    {STATUS_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Preview */}
              {formData.image && (
                <div className="bg-neutral-50 dark:bg-neutral-800 rounded-xl p-3 flex items-center justify-center h-[100px]">
                  <img src={formData.image} alt="Preview" className="max-h-full object-contain" />
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl font-semibold text-sm transition-all shadow-sm"
              >
                {editingIndex !== null ? "Simpan Perubahan" : "Tambah Produk"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
