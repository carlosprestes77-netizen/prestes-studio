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

const SITE_URL = "https://carlosprestes77-netizen.github.io/prestes-studio";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Bruno Belt — Tatuagens Neo-Geométricas e Clássicas | Florianópolis",
    template: "%s · Bruno Belt Tattoo",
  },
  description:
    "Microrealismo, geometria sagrada e arte clássica na pele. Bruno Beltrami — tatuagens autorais de alto padrão em Florianópolis, Santa Catarina. Simulador virtual, flashes exclusivos e orçamento pelo WhatsApp.",
  keywords: [
    "tatuagem", "tatuador florianópolis", "neo-geométrico", "blackwork",
    "tatuagem clássica", "microrealismo", "geometria sagrada", "flash tattoo",
    "Bruno Beltrami", "Bruno Belt", "tatuagem santa catarina", "fine line",
  ],
  authors: [{ name: "Bruno Beltrami" }],
  creator: "Bruno Beltrami",
  openGraph: {
    title: "Bruno Belt — Tatuagens Neo-Geométricas e Clássicas",
    description:
      "Microrealismo, geometria sagrada e arte clássica na pele. Projetos autorais de alto padrão em Florianópolis, SC.",
    url: SITE_URL,
    siteName: "Bruno Belt Tattoo",
    locale: "pt_BR",
    type: "website",
    images: [
      {
        url: "/portfolio/fortis-fortuna.jpg",
        width: 1200,
        height: 630,
        alt: "Tatuagem neo-geométrica de Bruno Beltrami",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bruno Belt — Tatuagens Neo-Geométricas e Clássicas",
    description: "Microrealismo, geometria sagrada e arte clássica na pele. Florianópolis, SC.",
    images: ["/portfolio/fortis-fortuna.jpg"],
  },
  robots: { index: true, follow: true },
  alternates: { canonical: SITE_URL },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "TattooParlor",
  name: "Bruno Belt Tattoo",
  description:
    "Estúdio de tatuagem especializado em microrealismo, geometria sagrada e arte clássica. Projetos autorais de alto padrão.",
  image: `${SITE_URL}/portfolio/fortis-fortuna.jpg`,
  url: SITE_URL,
  telephone: "+5548998663124",
  founder: { "@type": "Person", name: "Bruno Beltrami" },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Florianópolis",
    addressRegion: "SC",
    addressCountry: "BR",
  },
  sameAs: ["https://www.instagram.com/bruno.belt"],
  priceRange: "$$$",
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "10:00",
      closes: "19:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Saturday",
      opens: "10:00",
      closes: "16:00",
    },
  ],
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "5.0",
    reviewCount: "127",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${playfair.variable} ${raleway.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-paper-200 text-ink font-sans antialiased">{children}</body>
    </html>
  );
}
