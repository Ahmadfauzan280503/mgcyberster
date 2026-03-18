import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Ambil API Key dari environment variable
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// Model utama dan fallback — gemini-1.5-flash-latest sudah deprecated
const PRIMARY_MODEL = "gemini-2.0-flash";
const FALLBACK_MODELS = [
  "gemini-2.0-flash-001",
  "gemini-1.5-flash", 
  "gemini-1.5-flash-8b", 
  "gemini-1.5-pro"
];

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

// Helper: format chat history sesuai dokumentasi Gemini SDK
function formatHistory(history: { sender: string; text: string }[]) {
  const formatted = history.map((h) => ({
    role: h.sender === "user" ? "user" : "model",
    parts: [{ text: h.text }],
  }));

  // History harus dimulai dari role 'user'
  const firstUserIndex = formatted.findIndex((h) => h.role === "user");
  const sliced = firstUserIndex !== -1 ? formatted.slice(firstUserIndex) : [];

  // Pesan terakhir harus 'model' karena sendMessage menambah role 'user'
  if (sliced.length > 0 && sliced[sliced.length - 1].role === "user") {
    sliced.pop();
  }

  return sliced;
}

// Helper: coba kirim pesan dengan model tertentu
async function tryModel(modelName: string, message: string, finalHistory: { role: string; parts: { text: string }[] }[]) {
  const model = genAI.getGenerativeModel({
    model: modelName,
    systemInstruction: SYSTEM_PROMPT,
  });

  const chat = model.startChat({
    history: finalHistory,
    generationConfig: {
      maxOutputTokens: 500,
    },
  });

  const result = await chat.sendMessage(message);
  const response = await result.response;
  return response.text();
}

export async function POST(req: Request) {
  try {
    const { message, history } = await req.json();

    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "YOUR_GEMINI_API_KEY_HERE") {
      return NextResponse.json(
        { error: "Gemini API Key belum dikonfigurasi di .env" },
        { status: 500 }
      );
    }

    const finalHistory = formatHistory(history || []);

    // Coba model utama, lalu fallback jika 404 (not found) atau 429 (quota exceeded)
    const modelsToTry = [PRIMARY_MODEL, ...FALLBACK_MODELS];
    let lastError: any = null;

    for (const modelName of modelsToTry) {
      try {
        console.log(`[Chat API] Mencoba model: ${modelName}`);
        const text = await tryModel(modelName, message, finalHistory);
        return NextResponse.json({ text });
      } catch (err: unknown) {
        lastError = err;
        const errorProxy = err as { status?: number; response?: { status?: number } };
        const status = errorProxy?.status || errorProxy?.response?.status;
        const errorMessage = (err instanceof Error ? err.message : String(err)).toLowerCase();
        
        const isNotFound = status === 404 || errorMessage.includes("not found") || errorMessage.includes("404");
        const isQuotaExceeded = status === 429 || errorMessage.includes("limit") || errorMessage.includes("quota") || errorMessage.includes("429");

        if (isNotFound || isQuotaExceeded) {
          const reason = isQuotaExceeded ? "LIMIT KUOTA" : "TIDAK DITEMUKAN";
          console.warn(`[Chat API] Model "${modelName}" ${reason}. Mencoba fallback...`);
          continue; // Coba model berikutnya
        }

        // Kalau bukan 404/429, tetap catat tapi coba model lain jika mungkin
        console.error(`[Chat API] Error pada model "${modelName}":`, errorMessage);
        continue;
      }
    }

    // Semua model gagal
    throw lastError;
  } catch (error: unknown) {
    console.error("Gemini API Error Akhir:", error);

    const status = (error as { status?: number })?.status;
    const isQuotaError =
      error instanceof Error &&
      (error.message.includes("429") || error.message.includes("quota"));

    if (status === 429 || isQuotaError) {
      return NextResponse.json(
        { error: "Semua model AI sedang mencapai limit kuota (Error 429). Silakan tunggu sebentar atau hubungi admin." },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: "Gagal memproses pesan AI setelah beberapa percobaan. Silakan coba lagi nanti." },
      { status: 500 }
    );
  }
}

