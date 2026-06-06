"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section
      ref={ref}
      id="hero"
      className="relative min-h-screen flex items-end pb-20 lg:pb-28 overflow-hidden bg-paper-200"
    >
      {/* Full-bleed background image */}
      <motion.div style={{ y: imgY }} className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center scale-110"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1598971861713-54ad16a7e72e?w=1920&q=85')`,
          }}
        />
        {/* Light-mode overlay: paper tone bleed from bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-paper-200 via-paper-200/60 to-paper-200/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-paper-200/50 via-transparent to-paper-200/30" />
      </motion.div>

      {/* Content */}
      <motion.div
        style={{ y: textY, opacity }}
        className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-16"
      >
        <div className="max-w-3xl">
          {/* Eyebrow */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="label-section mb-6"
          >
            Arte Autoral · Santa Catarina
          </motion.p>

          {/* Title — editorial, large, serif */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="font-serif font-light leading-[0.9] tracking-tight text-ink"
            style={{ fontSize: "clamp(3.5rem, 9vw, 8rem)" }}
          >
            A Arte
            <br />
            <em className="not-italic text-ink-muted">na Pele,</em>
            <br />
            Elevada.
          </motion.h1>

          {/* Thin divider */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 1, ease: "easeOut" }}
            className="origin-left w-20 h-px bg-ink-muted mt-8 mb-8"
          />

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.1 }}
            className="text-ink-muted text-sm font-light leading-relaxed max-w-sm mb-10"
          >
            Tatuagens neo-geométricas e clássicas
            concebidas como obras permanentes.
            Cada composição, uma assinatura.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.2 }}
            className="flex flex-wrap gap-3"
          >
            <a href="#simulador" className="btn-primary">
              Testar Simulador Virtual
            </a>
            <a href="#portfolio" className="btn-outline">
              Ver Portfólio
            </a>
          </motion.div>
        </div>
      </motion.div>

      {/* Right side — vertical label */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center gap-3 z-10">
        <div className="w-px h-12 bg-paper-400" />
        <p
          className="text-ink-faint text-[8px] tracking-[0.4em] uppercase"
          style={{ writingMode: "vertical-rl" }}
        >
          @bruno.belt
        </p>
      </div>
    </section>
  );
}
