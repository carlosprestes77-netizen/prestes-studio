"use client";

import { Instagram, MapPin, Phone } from "lucide-react";
import { ARTIST } from "@/lib/data";

export default function Footer() {
  return (
    <footer className="bg-ink text-paper-300">
      <div className="max-w-7xl mx-auto px-6 lg:px-16 py-14">
        <div className="grid sm:grid-cols-3 gap-10 mb-12">
          <div className="space-y-4">
            <div className="flex flex-col leading-none">
              <span className="font-serif text-lg font-light text-paper-100 tracking-wider">BRUNO BELT</span>
              <span className="text-[8px] tracking-[0.45em] text-paper-500 uppercase font-light mt-0.5">Tattoo</span>
            </div>
            <p className="text-paper-500 text-xs leading-relaxed max-w-xs">
              Arte neo-geométrica e clássica na pele.<br />{ARTIST.location}.
            </p>
          </div>

          <div className="space-y-4">
            <p className="text-[9px] tracking-widest uppercase text-paper-600">Navegação</p>
            <div className="space-y-2.5">
              {[["Portfólio", "#portfolio"], ["Simulador", "#simulador"], ["O Artista", "#estudio"], ["Orçamento", "#orcamento"]].map(([l, h]) => (
                <a key={h} href={h} className="block text-xs text-paper-500 hover:text-paper-200 transition-colors duration-300">{l}</a>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-[9px] tracking-widest uppercase text-paper-600">Contato</p>
            <div className="space-y-3">
              <a href={ARTIST.instagram} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-xs text-paper-500 hover:text-paper-200 transition-colors duration-300">
                <Instagram size={13} /> {ARTIST.handle}
              </a>
              <a href={`https://wa.me/${ARTIST.whatsapp}`} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-xs text-paper-500 hover:text-paper-200 transition-colors duration-300">
                <Phone size={13} /> WhatsApp
              </a>
              <div className="flex items-center gap-2.5 text-xs text-paper-600">
                <MapPin size={13} /> {ARTIST.location}
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-paper-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[9px] text-paper-700 tracking-wider">
            © {new Date().getFullYear()} Bruno Beltrami. Todos os direitos reservados.
          </p>
          <p className="text-[9px] text-paper-800 tracking-wider italic font-serif">
            Arte não se copia. Arte se cria.
          </p>
        </div>
      </div>
    </footer>
  );
}
