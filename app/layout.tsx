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
  title: "MG Cyberster Showroom",
  description: "Exclusive automotive showroom with premium collection.",
};

import { Toaster } from "sonner";
import { SmoothCursor } from "@/components/ui/smooth-cursor";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
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

