"use client";

import React, { useState } from "react";
import { Iphone17Pro } from "@/components/ui/iphone-17-pro";
import { Cover } from "@/components/ui/cover";

export function ContactSection() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatusMsg(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setStatusMsg({ type: "success", text: "Terima kasih! Pesan Anda telah terkirim ke email kami." });
        setFormData({ firstName: "", lastName: "", email: "", phone: "", message: "" });
      } else {
        setStatusMsg({ type: "error", text: data.error || "Gagal mengirim pesan. Silakan coba lagi." });
      }
    } catch {
      setStatusMsg({ type: "error", text: "Terjadi kesalahan jaringan. Silakan coba lagi." });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <section id="contact" className="w-full py-20 px-6 bg-zinc-50 dark:bg-black overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-zinc-900 dark:text-white mb-4">
            <Cover className="px-4 py-2">
              Contact <span className="text-blue-500">Us</span>
            </Cover>
          </h2>
        </div>

        <div className="flex flex-col lg:flex-row bg-white dark:bg-zinc-900 rounded-[40px] shadow-2xl border border-zinc-200 dark:border-white/5 overflow-hidden transition-all duration-500 hover:shadow-blue-500/5">
          {/* Left Side: Form */}
          <div className="flex-1 p-8 md:p-12">
            <div className="mb-10">
              <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">Send us a message</h3>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm">
                Ada pertanyaan tentang koleksi mobil kami? Silakan hubungi kami melalui formulir di bawah ini.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Enter your first name"
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 p-4 rounded-2xl text-zinc-900 dark:text-white outline-none focus:border-blue-500 transition-all font-medium"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Enter your last name"
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 p-4 rounded-2xl text-zinc-900 dark:text-white outline-none focus:border-blue-500 transition-all font-medium"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 p-4 rounded-2xl text-zinc-900 dark:text-white outline-none focus:border-blue-500 transition-all font-medium"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">Phone Details</label>
                  <div className="flex gap-2">
                    <div className="bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 p-4 rounded-2xl text-zinc-500 font-bold flex items-center">
                      +62
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="812 XXXX XXXX"
                      className="flex-1 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 p-4 rounded-2xl text-zinc-900 dark:text-white outline-none focus:border-blue-500 transition-all font-medium"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="How can we help you?"
                  rows={4}
                  className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 p-4 rounded-3xl text-zinc-900 dark:text-white outline-none focus:border-blue-500 transition-all font-medium resize-none"
                  required
                ></textarea>
              </div>

              {/* Status Message */}
              {statusMsg && (
                <div className={`p-4 rounded-2xl text-sm font-bold ${
                  statusMsg.type === "success" 
                    ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400" 
                    : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                }`}>
                  {statusMsg.text}
                </div>
              )}

              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-black uppercase tracking-widest px-10 py-5 rounded-[20px] hover:bg-blue-600 dark:hover:bg-blue-500 hover:text-white transition-all transform active:scale-95 shadow-xl shadow-blue-500/10 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Mengirim..." : "Send a Message"}
                </button>
              </div>
            </form>
          </div>

          {/* Right Side: 3D iPhone Mockup with dark mode glow */}
          <div className="w-full lg:w-[450px] relative flex items-center justify-center py-12 lg:py-0">
            {/* Dark mode background glow for iPhone visibility */}
            <div className="absolute inset-0 hidden dark:flex items-center justify-center pointer-events-none">
              <div className="w-[300px] h-[500px] bg-gradient-to-b from-blue-500/10 via-indigo-500/5 to-transparent rounded-full blur-3xl" />
            </div>
            <div className="absolute inset-0 hidden dark:block pointer-events-none"
              style={{
                background: "radial-gradient(ellipse at center, rgba(59,130,246,0.08) 0%, rgba(99,102,241,0.04) 40%, transparent 70%)",
              }}
            />
            <div className="relative z-10 w-full max-w-[280px] xs:max-w-[320px] mx-auto scale-100 sm:scale-110 lg:scale-100">
              <Iphone17Pro 
                src="/mockups/walpaper.jpg" 
                className="w-full drop-shadow-[0_35px_60px_rgba(0,0,0,0.5)] dark:drop-shadow-[0_35px_70px_rgba(59,130,246,0.3)]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
