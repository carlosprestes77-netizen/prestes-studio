import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Prestes Studio — Tatuagens Autorais",
  description:
    "Arte exclusiva na pele. Tatuagens autorais de alto padrão. Agende sua consulta e explore o simulador virtual de flash tattoos.",
  keywords: "tatuagem, tattoo, flash tattoo, tatuagem autoral, estúdio de tatuagem",
  openGraph: {
    title: "Prestes Studio — Tatuagens Autorais",
    description: "Arte exclusiva na pele. Tatuagens autorais de alto padrão.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${cormorant.variable} ${inter.variable}`}>
      <body className="bg-ink-950 text-ink-100 font-sans antialiased">{children}</body>
    </html>
  );
}
