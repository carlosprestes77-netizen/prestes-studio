"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { portfolioItems } from "@/lib/data";

const filters = ["Todos", "Neo-Geométrico", "Collage", "Neo-Clássico"];

export default function Portfolio() {
  const [active, setActive] = useState("Todos");

  const filtered =
    active === "Todos" ? portfolioItems : portfolioItems.filter((i) => i.style === active);

  return (
    <section id="portfolio" className="py-24 lg:py-36 bg-paper-200">
      <div className="max-w-7xl mx-auto px-6 lg:px-16">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8 }}
          className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-14"
        >
          <div>
            <p className="label-section mb-4">01 — Portfólio</p>
            <h2
              className="font-serif font-light leading-[0.95] tracking-tight text-ink"
              style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)" }}
            >
              Trabalhos
              <br />
              Selecionados
            </h2>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 flex-wrap">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setActive(f)}
                className={`text-[9px] tracking-widest uppercase px-4 py-2 border transition-all duration-200 font-light ${
                  active === f
                    ? "border-ink bg-ink text-paper-100"
                    : "border-paper-400 text-ink-muted hover:border-ink hover:text-ink"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Masonry grid */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
          {filtered.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              className="break-inside-avoid group relative overflow-hidden"
            >
              <div
                className={`relative overflow-hidden ${
                  item.size === "large" ? "aspect-[3/4]" : item.size === "small" ? "aspect-square" : "aspect-[4/5]"
                }`}
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-[1.04] transition-all duration-700 ease-out"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                {/* Hover info */}
                <div className="absolute inset-0 bg-gradient-to-t from-paper-950/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400">
                  <p className="text-[9px] tracking-widest uppercase text-paper-300 mb-0.5">{item.style}</p>
                  <p className="font-serif text-base text-paper-100">{item.alt}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-16 pt-10 border-t border-paper-300 flex items-center justify-between"
        >
          <p className="text-xs text-ink-faint font-light">Mais de 500 trabalhos realizados</p>
          <a
            href="https://www.instagram.com/bruno.belt"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] tracking-widest uppercase text-ink-muted hover:text-ink transition-colors duration-300"
          >
            Ver Instagram →
          </a>
        </motion.div>
      </div>
    </section>
  );
}
