"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { label: "Portfólio", href: "#portfolio" },
  { label: "Simulador", href: "#simulador" },
  { label: "O Estúdio", href: "#estudio" },
  { label: "Orçamento", href: "#orcamento" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          scrolled ? "glass-dark border-b border-ink-800" : "bg-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <a href="#" className="group flex flex-col leading-none">
            <span className="font-serif text-xl lg:text-2xl font-light text-ink-100 tracking-wider group-hover:text-gold transition-colors duration-300">
              PRESTES
            </span>
            <span className="text-[9px] tracking-[0.35em] text-gold uppercase font-light">
              Studio
            </span>
          </a>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8 lg:gap-12">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-xs tracking-widest uppercase text-ink-400 hover:text-gold transition-colors duration-300 relative group"
              >
                {link.label}
                <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-gold transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </div>

          {/* CTA Desktop */}
          <a
            href="#orcamento"
            className="hidden md:inline-flex btn-outline text-[10px] py-3 px-6"
          >
            Agendar
          </a>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-ink-300 hover:text-gold transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-16 z-40 glass-dark border-b border-ink-800 md:hidden"
          >
            <div className="px-6 py-8 flex flex-col gap-6">
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-sm tracking-widest uppercase text-ink-400 hover:text-gold transition-colors duration-300"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="#orcamento"
                onClick={() => setMobileOpen(false)}
                className="btn-outline text-[10px] py-3 w-fit"
              >
                Agendar
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
