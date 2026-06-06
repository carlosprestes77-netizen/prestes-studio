import type { Metadata } from "next";
import { Playfair_Display, Raleway } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
});

const raleway = Raleway({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-raleway",
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
    <html lang="pt-BR" className={`${playfair.variable} ${raleway.variable}`}>
      <body className="bg-paper-200 text-ink font-sans antialiased">{children}</body>
    </html>
  );
}
