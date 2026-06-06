"use client";

import { motion } from "framer-motion";

export default function AgendaBanner() {
  const currentMonth = new Intl.DateTimeFormat("pt-BR", { month: "long" }).format(new Date());
  const capitalizedMonth = currentMonth.charAt(0).toUpperCase() + currentMonth.slice(1);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="relative overflow-hidden bg-ink-900 border-y border-ink-800"
    >
      {/* Subtle gold line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-3.5 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          {/* Pulsing dot */}
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="text-xs font-light text-ink-300 tracking-wider">
            Agenda Aberta para{" "}
            <strong className="text-gold font-medium">{capitalizedMonth}</strong>
            {" "}— Vagas limitadas
          </span>
        </div>

        <a
          href="#orcamento"
          className="text-[10px] tracking-widest uppercase text-gold hover:text-gold-light transition-colors duration-300 flex items-center gap-1.5"
        >
          Garantir minha vaga
          <span className="text-base leading-none">→</span>
        </a>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
    </motion.div>
  );
}
