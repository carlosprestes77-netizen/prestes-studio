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
  title: "Bruno Belt — Tatuagens Neo-Geométricas e Clássicas",
  description:
    "Arte neo-geométrica, clássica e colagem surrealista na pele. Bruno Beltrami — tatuagens autorais de alto padrão em Santa Catarina.",
  keywords: "tatuagem, neo-geométrico, blackwork, tatuagem clássica, flash tattoo, Bruno Beltrami, Bruno Belt",
  openGraph: {
    title: "Bruno Belt — Tatuagens Neo-Geométricas e Clássicas",
    description: "Arte neo-geométrica, clássica e colagem surrealista na pele.",
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
