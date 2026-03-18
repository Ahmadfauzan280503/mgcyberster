"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, MessageCircle, Sparkles, HelpCircle, Wrench, Trash2 } from "lucide-react";

interface Message {
  id: string; // Changed to string for unique IDs
  text: string;
  sender: "bot" | "user";
  timestamp: Date;
}

const quickActions = [
  { label: "MAU KONSULTASI", icon: <Sparkles size={14} /> },
  { label: "PERBAIKAN MOBIL", icon: <Wrench size={14} /> },
  { label: "TANYA LAYANAN", icon: <HelpCircle size={14} /> },
];


export default function CustomerServiceWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "initial-msg",
      text: "Halo! 👋 Ingin langsung terhubung dengan tim MG Cyberster?\nKami siap membantu kebutuhan otomotif kamu kapan saja!",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const generateUID = () => `id-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const addMessage = (text: string, sender: "bot" | "user") => {
    setMessages((prev) => [
      ...prev,
      { id: generateUID(), text, sender, timestamp: new Date() },
    ]);
  };

  const getAIResponse = async (text: string, currentHistory: Message[]) => {
    setIsTyping(true);
    try {
      // Clean history to only include essential fields for the API
      const cleanHistory = currentHistory.slice(-10).map(({ text, sender }) => ({
        text,
        sender,
      }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: cleanHistory,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Specific message for quota limit
        if (response.status === 429) {
          throw new Error("QUOTA_LIMIT");
        }
        throw new Error(data.error || "Gagal menghubungi AI");
      }

      addMessage(data.text, "bot");
    } catch (error: unknown) {
      console.error("Chat Error:", error);
      
      let errorMsg = "Maaf, sepertinya layanan AI kami sedang mengalami kendala. Silakan coba lagi nanti atau hubungi kami via telepon. 📞";
      
      const isQuotaError = 
        (error instanceof Error && error.message === "QUOTA_LIMIT") || 
        (typeof error === "object" && error !== null && ("status" in error) && (error as {status: number}).status === 429);
      
      if (isQuotaError) {
        errorMsg = "Waduh, sepertinya antrean chat sedang penuh (Limit Kuota Terlampaui). 😅\n\nSilakan coba lagi dalam beberapa menit, atau hubungi tim sales kami di nomor WhatsApp: +62 821-7756-1275.";
      }

      addMessage(errorMsg, "bot");
    } finally {
      setIsTyping(false);
    }
  };

  const handleSend = async () => {
    const trimmed = inputValue.trim();
    if (!trimmed || isTyping) return;

    const userMsg: Message = { id: generateUID(), text: trimmed, sender: "user", timestamp: new Date() };
    
    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    
    // Use the updated history
    const currentHistory = [...messages, userMsg];
    await getAIResponse(trimmed, currentHistory);
  };

  const handleQuickAction = async (label: string) => {
    if (isTyping) return;
    
    const userMsg: Message = { id: generateUID(), text: label, sender: "user", timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    
    const currentHistory = [...messages, userMsg];
    await getAIResponse(label, currentHistory);
  };

  const clearChat = () => {
    if (confirm("Hapus seluruh percakapan?")) {
      setMessages([
        {
          id: "initial-msg-reset",
          text: "Percakapan telah dihapus. Ada lagi yang bisa saya bantu? 😊",
          sender: "bot",
          timestamp: new Date(),
        },
      ]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-zinc-900 dark:bg-white rounded-full flex items-center justify-center shadow-2xl shadow-black/30 hover:scale-110 active:scale-95 transition-transform cursor-pointer group"
            aria-label="Open customer service chat"
            id="cs-widget-toggle"
          >
            <MessageCircle
              size={24}
              className="text-white dark:text-black group-hover:rotate-12 transition-transform"
            />
            {/* Pulse indicator */}
            <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-[#BEF264] rounded-full border-2 border-white dark:border-zinc-900 animate-pulse" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-6 right-6 z-50 w-[370px] max-w-[calc(100vw-2rem)] bg-zinc-950 rounded-[28px] shadow-2xl shadow-black/50 border border-zinc-800 flex flex-col overflow-hidden"
            style={{ maxHeight: "min(580px, calc(100vh - 3rem))" }}
            id="cs-widget-panel"
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-zinc-800/80">
              <div className="relative">
                <div className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center">
                  <MessageCircle size={18} className="text-zinc-300" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#BEF264] rounded-full border-2 border-zinc-950" />
              </div>
              <div className="flex-grow">
                <h3 className="text-white text-sm font-bold tracking-tight">
                  MG Cyberster Specialist
                </h3>
                <div className="flex items-center gap-2">
                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#BEF264] flex items-center gap-1">
                    <Sparkles size={10} /> AKTIF 24 JAM
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={clearChat}
                  className="w-8 h-8 rounded-full bg-zinc-800/50 hover:bg-red-500/20 text-zinc-400 hover:text-red-400 flex items-center justify-center transition-all"
                  title="Hapus Chat"
                >
                  <Trash2 size={14} />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center transition-colors"
                  aria-label="Close chat"
                >
                  <X size={16} className="text-zinc-400" />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-grow overflow-y-auto px-4 py-4 space-y-3 scrollbar-thin" style={{ minHeight: "200px" }}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] px-4 py-3 text-[13px] leading-relaxed whitespace-pre-line ${
                      msg.sender === "user"
                        ? "bg-[#BEF264] text-black rounded-[20px] rounded-br-md font-medium"
                        : "bg-zinc-800/80 text-zinc-200 rounded-[20px] rounded-bl-md border border-zinc-700/50"
                    }`}
                  >
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="bg-zinc-800/80 px-4 py-3 rounded-[20px] rounded-bl-md border border-zinc-700/50 flex gap-1">
                    <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0 }} className="w-1.5 h-1.5 bg-zinc-400 rounded-full" />
                    <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-zinc-400 rounded-full" />
                    <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-zinc-400 rounded-full" />
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions */}
            <div className="px-4 pb-2 flex flex-wrap gap-2">
              {quickActions.map((action) => (
                <button
                  key={action.label}
                  onClick={() => handleQuickAction(action.label)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800/70 hover:bg-zinc-700 text-zinc-300 hover:text-white text-[10px] font-bold uppercase tracking-widest rounded-full border border-zinc-700/50 hover:border-zinc-600 transition-all active:scale-95"
                >
                  {action.icon}
                  {action.label}
                </button>
              ))}
            </div>

            {/* Input Area */}
            <div className="px-4 pb-4 pt-2">
              <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-700/60 rounded-full px-4 py-2.5 focus-within:border-[#BEF264]/50 transition-colors">
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Tulis pesan..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-grow bg-transparent text-white text-sm placeholder-zinc-500 outline-none"
                />
                <button
                  onClick={handleSend}
                  disabled={!inputValue.trim() || isTyping}
                  className="w-8 h-8 bg-[#BEF264] hover:bg-[#d4ff7a] disabled:bg-zinc-700 disabled:text-zinc-500 rounded-full flex items-center justify-center text-black transition-all active:scale-90 disabled:cursor-not-allowed"
                  aria-label="Send message"
                >
                  <Send size={14} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Side close button for desktop */}
      <AnimatePresence>
        {isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
            onClick={() => setIsOpen(false)}
            className="fixed bottom-6 right-[412px] hidden lg:flex z-50 w-12 h-12 bg-zinc-900/80 backdrop-blur-md border border-zinc-800 rounded-full items-center justify-center shadow-xl hover:bg-zinc-800 transition-colors"
            aria-label="Close chat"
          >
            <X size={20} className="text-zinc-300" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
