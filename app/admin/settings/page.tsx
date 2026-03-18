"use client";

import { useEffect, useState, startTransition } from "react";
import { 
  IconSettings, 
  IconCheck,
  IconBuilding,
  IconMail,
  IconPhone,
  IconMapPin,
  IconPhoto,
  IconDeviceFloppy
} from "@tabler/icons-react";

interface AdminSettings {
  businessName: string;
  email: string;
  phone: string;
  address: string;
  logoUrl: string;
  description: string;
}

const DEFAULT_SETTINGS: AdminSettings = {
  businessName: "MG Cyberster Showroom",
  email: "ahmadfauzan280503@gmail.com",
  phone: "+62 821 7756 1275",
  address: "Kota Makassar, Sulawesi Selatan, Indonesia",
  logoUrl: "",
  description: "Showroom mobil mewah dan supercar terpercaya di Indonesia.",
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<AdminSettings>(DEFAULT_SETTINGS);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("mgcyberster_admin_settings");
    if (stored) {
      startTransition(() => {
        setSettings(JSON.parse(stored));
      });
    }
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate save delay
    setTimeout(() => {
      localStorage.setItem("mgcyberster_admin_settings", JSON.stringify(settings));
      setSaved(true);
      setLoading(false);
      setTimeout(() => setSaved(false), 3000);
    }, 500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  return (
    <div className="space-y-8 max-w-3xl">
      <div className="flex items-center gap-4">
        <div className="bg-blue-500/10 p-4 rounded-2xl">
          <IconSettings className="w-8 h-8 text-blue-500" />
        </div>
        <div>
          <h1 className="text-3xl font-black tracking-tight text-neutral-900 dark:text-white uppercase">
            Settings
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 font-medium">
            Atur profil bisnis admin Anda.
          </p>
        </div>
      </div>

      {/* Saved notification */}
      {saved && (
        <div className="flex items-center gap-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 p-4 rounded-2xl text-sm font-bold animate-in">
          <IconCheck className="w-4 h-4" />
          Pengaturan berhasil disimpan!
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Business Info Card */}
        <div className="bg-white dark:bg-neutral-900 p-8 rounded-[30px] border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-6">
          <h2 className="text-sm font-black uppercase tracking-widest text-neutral-400 flex items-center gap-2">
            <IconBuilding className="w-4 h-4" />
            Informasi Bisnis
          </h2>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-400">Nama Bisnis</label>
            <input
              type="text"
              name="businessName"
              value={settings.businessName}
              onChange={handleChange}
              className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 p-4 rounded-2xl text-neutral-900 dark:text-white outline-none focus:border-blue-500 transition-all font-medium"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-400">Deskripsi</label>
            <textarea
              name="description"
              value={settings.description}
              onChange={handleChange}
              rows={3}
              className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 p-4 rounded-2xl text-neutral-900 dark:text-white outline-none focus:border-blue-500 transition-all font-medium resize-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1">
              <IconPhoto className="w-3 h-3" /> URL Logo
            </label>
            <input
              type="text"
              name="logoUrl"
              value={settings.logoUrl}
              onChange={handleChange}
              placeholder="https://example.com/logo.png"
              className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 p-4 rounded-2xl text-neutral-900 dark:text-white outline-none focus:border-blue-500 transition-all font-medium"
            />
          </div>

          {settings.logoUrl && (
            <div className="bg-neutral-100 dark:bg-neutral-800 rounded-2xl p-4 flex items-center justify-center h-[80px]">
              <img src={settings.logoUrl} alt="Logo Preview" className="max-h-full object-contain" />
            </div>
          )}
        </div>

        {/* Contact Info Card */}
        <div className="bg-white dark:bg-neutral-900 p-8 rounded-[30px] border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-6">
          <h2 className="text-sm font-black uppercase tracking-widest text-neutral-400 flex items-center gap-2">
            <IconMail className="w-4 h-4" />
            Informasi Kontak
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1">
                <IconMail className="w-3 h-3" /> Email
              </label>
              <input
                type="email"
                name="email"
                value={settings.email}
                onChange={handleChange}
                className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 p-4 rounded-2xl text-neutral-900 dark:text-white outline-none focus:border-blue-500 transition-all font-medium"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1">
                <IconPhone className="w-3 h-3" /> Telepon
              </label>
              <input
                type="text"
                name="phone"
                value={settings.phone}
                onChange={handleChange}
                className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 p-4 rounded-2xl text-neutral-900 dark:text-white outline-none focus:border-blue-500 transition-all font-medium"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1">
              <IconMapPin className="w-3 h-3" /> Alamat
            </label>
            <input
              type="text"
              name="address"
              value={settings.address}
              onChange={handleChange}
              className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 p-4 rounded-2xl text-neutral-900 dark:text-white outline-none focus:border-blue-500 transition-all font-medium"
              required
            />
          </div>
        </div>

        {/* Save Button */}
        <button
          type="submit"
          disabled={loading}
          className="flex items-center justify-center gap-2 w-full bg-blue-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-500 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <IconDeviceFloppy className="w-4 h-4" />
          {loading ? "Menyimpan..." : "Simpan Pengaturan"}
        </button>
      </form>
    </div>
  );
}
