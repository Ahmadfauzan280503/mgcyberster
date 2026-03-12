import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Ambil API Key dari environment variable
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const SYSTEM_PROMPT = `
Anda adalah Customer Service Specialist yang ramah dan profesional dari Showroom Mobil "MG Cyberster".
Tugas Anda adalah membantu pengunjung dengan pertanyaan seputar koleksi mobil mewah kami, layanan servis, konsultasi, dan test drive.

Ketentuan:
1. Gunakan bahasa Indonesia yang santai tapi tetap sopan dan profesional (gunakan "kamu" atau "Anda" sesuai konteks).
2. Fokus pada brand MG Cyberster dan mobil-mobil super/sport lainnya yang ada di showroom kami.
3. Selalu tawarkan bantuan lebih lanjut (konsultasi atau kunjungan showroom).
4. Jika ada pertanyaan di luar topik otomotif atau showroom kami, arahkan kembali dengan sopan ke topik layanan kami.
5. Jawablah dengan singkat, padat, dan informatif agar nyaman dibaca di chat widget.

Konteks Showroom:
- Nama: MG Cyberster Showroom
- Layanan: Exclusive Showroom, Premium Test Drive, Specialized Service.
- Koleksi: MG Cyberster (Electric Sportscar), BMW i8, BMW M4 GT3, AMG GT Black, G-Wagon G63, Aventador SVJ, Ferrari 488, Porsche 911 GT3 RS.
- Lokasi: Jakarta (Simulasi).
- Jam Operasional: 24 Jam Online via Chat.
`;

export async function POST(req: Request) {
  try {
    const { message, history } = await req.json();

    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "YOUR_GEMINI_API_KEY_HERE") {
      return NextResponse.json(
        { error: "Gemini API Key belum dikonfigurasi di .env" },
        { status: 500 }
      );
    }

    // Gunakan model gemini-1.5-flash-latest (lebih stabil dan mendukung v1beta)
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash-latest",
      systemInstruction: SYSTEM_PROMPT 
    });

    // Format history untuk Gemini SDK
    // Sesuai dokumentasi Gemini:
    // 1. History harus dimulai dari role 'user'
    // 2. Role harus bergantian (user, model, user, model...)
    // 3. Pesan terakhir di history HARUS 'model' karena sendMessage akan menambah role 'user'
    
    const formattedHistory = history.map((h: { sender: string; text: string }) => ({
      role: h.sender === "user" ? "user" : "model",
      parts: [{ text: h.text }],
    }));

    // Cari index pesan 'user' pertama
    const firstUserIndex = formattedHistory.findIndex((h: { role: string }) => h.role === "user");
    
    const finalHistory = firstUserIndex !== -1 ? formattedHistory.slice(firstUserIndex) : [];

    // Jika pesan terakhir di history adalah 'user', kita harus membuangnya 
    // karena pesan tersebut adalah 'message' yang sedang dikirim via sendMessage
    if (finalHistory.length > 0 && finalHistory[finalHistory.length - 1].role === "user") {
      finalHistory.pop();
    }

    // Pastikan history tetap bergantian jika ada sisa
    // (Dalam kasus sederhana logikanya sudah cukup, tapi kita jaga-jaga)

    const chat = model.startChat({
      history: finalHistory,
      generationConfig: {
        maxOutputTokens: 500,
      },
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ text });
  } catch (error: unknown) {
    console.error("Gemini API Error:", error);
    
    // Cek jika error 429 (Quota Exceeded)
    const isQuotaError = 
      error instanceof Error && 
      (error.message.includes("429") || error.message.includes("quota"));
    
    // Kadang error datang dalam bentuk object dengan status
    const status = (error as { status?: number })?.status;

    if (status === 429 || isQuotaError) {
      return NextResponse.json(
        { error: "Quota Gemini API Anda telah habis (Error 429). Silakan tunggu beberapa menit atau cek kuota di Google AI Studio." },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: "Gagal memproses pesan AI. Silakan coba lagi nanti." },
      { status: 500 }
    );
  }
}
