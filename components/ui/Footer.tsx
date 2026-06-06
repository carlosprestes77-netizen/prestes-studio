"use client";

import { motion } from "framer-motion";
import { Instagram, MapPin, Phone } from "lucide-react";
import { ARTIST } from "@/lib/data";

export default function Footer() {
  return (
    <footer className="bg-ink-950 border-t border-ink-800">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
        <div className="grid sm:grid-cols-3 gap-8 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <a href="#" className="group flex flex-col leading-none w-fit">
              <span className="font-serif text-xl font-light text-ink-100 tracking-wider group-hover:text-gold transition-colors duration-300">
                BRUNO BELT
              </span>
              <span className="text-[9px] tracking-[0.35em] text-gold uppercase font-light">
                Tattoo Studio
              </span>
            </a>
            <p className="text-ink-600 text-xs leading-relaxed max-w-xs">
              Arte neo-geométrica e clássica na pele.<br />
              {ARTIST.location}.
            </p>
          </div>

          {/* Nav */}
          <div className="space-y-4">
            <h4 className="text-[10px] tracking-widest uppercase text-ink-600">Navegação</h4>
            <div className="space-y-2.5">
              {[
                { label: "Portfólio", href: "#portfolio" },
                { label: "Simulador", href: "#simulador" },
                { label: "O Estúdio", href: "#estudio" },
                { label: "Orçamento", href: "#orcamento" },
              ].map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="block text-xs text-ink-500 hover:text-gold transition-colors duration-300"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="text-[10px] tracking-widest uppercase text-ink-600">Contato</h4>
            <div className="space-y-3">
              <a
                href={ARTIST.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-xs text-ink-500 hover:text-gold transition-colors duration-300"
              >
                <Instagram size={14} />
                {ARTIST.handle}
              </a>
              <a
                href={`https://wa.me/${ARTIST.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-xs text-ink-500 hover:text-gold transition-colors duration-300"
              >
                <Phone size={14} />
                WhatsApp
              </a>
              <div className="flex items-center gap-2.5 text-xs text-ink-500">
                <MapPin size={14} />
                {ARTIST.location}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-ink-900 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[10px] text-ink-700 tracking-wider">
            © {new Date().getFullYear()} Bruno Beltrami. Todos os direitos reservados.
          </p>
          <p className="text-[10px] text-ink-800 tracking-wider">
            Arte não se copia. Arte se cria.
          </p>
        </div>
      </div>
    </footer>
  );
}
