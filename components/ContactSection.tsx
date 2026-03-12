"use client";

import React, { useState } from "react";
import { Iphone } from "@/components/ui/iphone";
import { Cover } from "@/components/ui/cover";

export function ContactSection() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);
    // Add logic here for actual submission
    alert("Terima kasih! Pesan Anda telah terkirim.");
    setFormData({ firstName: "", lastName: "", email: "", phone: "", message: "" });
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
ter        </div>

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

              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  className="bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-black uppercase tracking-widest px-10 py-5 rounded-[20px] hover:bg-blue-600 dark:hover:bg-blue-500 hover:text-white transition-all transform active:scale-95 shadow-xl shadow-blue-500/10"
                >
                  Send a Message
                </button>
              </div>
            </form>
          </div>

          {/* Right Side: 3D iPhone Mockup (Clean & Balanced) */}
          <div className="w-full lg:w-[450px] relative flex items-center justify-center py-12 lg:py-0">
            <div className="relative z-10 w-full max-w-[280px]">
              <Iphone 
                src="/mockups/user-screenshot.png" 
                className="w-full drop-shadow-[0_25px_50px_rgba(0,0,0,0.3)] dark:drop-shadow-[0_25px_50px_rgba(0,0,0,0.7)]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
