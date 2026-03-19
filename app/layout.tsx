import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { CartProvider } from "@/components/CartContext";
import CustomerServiceWidget from "@/components/CustomerServiceWidget";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "MG Cyberster Showroom - Dealer Mobil Mewah & Sport Terbaik",
    template: "%s | MG Cyberster Showroom"
  },
  description: "Selamat datang di dealer resmi MG Cyberster Indonesia. Temukan koleksi mobil mewah, sport car, dan hypercar eksklusif dengan pelayanan VVIP.",
  keywords: ["showroom mobil", "dealer mobil mewah", "MG Cyberster Indonesia", "mobil sport Jakarta", "beli mobil mewah", "koleksi mobil sport"],
  authors: [{ name: "MG Cyberster Team" }],
  creator: "MG Cyberster",
  publisher: "MG Cyberster Indonesia",
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://mg-cyberster-showroom.com", // Placeholder
    title: "MG Cyberster Showroom - Koleksi Mobil Mewah Eksklusif",
    description: "Nikmati pengalaman membeli mobil mewah terbaik dengan koleksi MG Cyberster dan brand ternama lainnya.",
    siteName: "MG Cyberster Showroom",
  },
  twitter: {
    card: "summary_large_image",
    title: "MG Cyberster Showroom",
    description: "Dealer Mobil Mewah & Sport Terbaik di Indonesia",
  },
  robots: {
    index: true,
    follow: true,
  }
};

import { Toaster } from "sonner";
import { SmoothCursor } from "@/components/ui/smooth-cursor";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider>
          <CartProvider>
            <SmoothCursor />
            {children}
            <CustomerServiceWidget />
          </CartProvider>
        </ThemeProvider>
        <Toaster richColors position="top-center" expand={false} />
      </body>
    </html>
  );
}

