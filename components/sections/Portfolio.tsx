"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { portfolioItems } from "@/lib/data";

const filters = ["Todos", "Neo-Geométrico", "Collage", "Neo-Clássico", "Surrealista"];

export default function Portfolio() {
  const [active, setActive] = useState("Todos");

  const filtered =
    active === "Todos"
      ? portfolioItems
      : portfolioItems.filter((i) => i.style === active);

  return (
    <section id="portfolio" className="py-24 lg:py-32 bg-ink-950">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="mb-16 lg:mb-20"
        >
          <p className="text-gold text-[10px] tracking-[0.5em] uppercase font-light mb-4">
            01 — Portfólio
          </p>
          <h2 className="font-serif text-4xl lg:text-6xl font-light text-ink-100 leading-tight">
            Trabalhos Selecionados
          </h2>
          <div className="mt-6 w-16 h-px bg-gold" />
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex items-center gap-3 flex-wrap mb-12"
        >
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActive(f)}
              className={`text-[10px] tracking-widest uppercase px-4 py-2 border transition-all duration-300 ${
                active === f
                  ? "border-gold bg-gold text-ink-950"
                  : "border-ink-700 text-ink-500 hover:border-ink-500 hover:text-ink-300"
              }`}
            >
              {f}
            </button>
          ))}
        </motion.div>

        {/* Masonry-style grid */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
          {filtered.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="break-inside-avoid group relative overflow-hidden cursor-pointer"
            >
              <div
                className={`relative overflow-hidden ${
                  item.size === "large"
                    ? "aspect-[3/4]"
                    : item.size === "small"
                    ? "aspect-square"
                    : "aspect-[4/5]"
                }`}
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  className="object-cover grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Info on hover */}
                <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                  <p className="text-[9px] tracking-widest text-gold uppercase mb-1">
                    {item.style}
                  </p>
                  <p className="font-serif text-lg text-ink-100">{item.alt}</p>
                  <p className="text-ink-400 text-xs">{item.placement}</p>
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
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 text-center"
        >
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs tracking-widest uppercase text-ink-500 hover:text-gold transition-colors duration-300"
          >
            Ver mais no Instagram
            <span className="text-base">→</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
