"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown } from "lucide-react";

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section ref={ref} id="hero" className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
      {/* Background with parallax */}
      <motion.div
        style={{ y }}
        className="absolute inset-0 z-0"
      >
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-110"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1598971861713-54ad16a7e72e?w=1920&q=85')`,
          }}
        />
        {/* Multi-layer overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-ink-950/80 via-ink-950/50 to-ink-950/90" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink-950/60 via-transparent to-ink-950/60" />
      </motion.div>

      {/* Content */}
      <motion.div
        style={{ opacity }}
        className="relative z-10 text-center px-6 max-w-5xl mx-auto"
      >
        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0, letterSpacing: "0.3em" }}
          animate={{ opacity: 1, letterSpacing: "0.5em" }}
          transition={{ duration: 1.2, delay: 0.3 }}
          className="text-gold text-[10px] lg:text-xs uppercase font-light tracking-[0.5em] mb-8"
        >
          Arte Autoral · São Paulo
        </motion.p>

        {/* Main heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="font-serif text-5xl sm:text-6xl lg:text-8xl xl:text-9xl font-light text-ink-100 leading-[0.95] tracking-tight mb-6"
        >
          A Arte na Pele,
          <br />
          <em className="text-gradient-gold not-italic">Elevada</em>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-ink-400 text-sm lg:text-base font-light tracking-wide max-w-md mx-auto mb-12 leading-relaxed"
        >
          Tatuagens exclusivas concebidas como obras permanentes.<br />
          Cada traço, uma assinatura.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a href="#simulador" className="btn-primary">
            Testar Simulador Virtual
          </a>
          <a href="#portfolio" className="btn-outline">
            Ver Portfólio
          </a>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <ArrowDown size={16} className="text-ink-500" />
        </motion.div>
        <span className="text-[9px] tracking-[0.4em] text-ink-600 uppercase">Rolar</span>
      </motion.div>

      {/* Side text decorations */}
      <div className="absolute left-6 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center gap-4 z-10">
        <div className="w-px h-16 bg-gradient-to-b from-transparent to-ink-700" />
        <p
          className="text-ink-600 text-[9px] tracking-[0.4em] uppercase"
          style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
        >
          Scroll
        </p>
      </div>
    </section>
  );
}
