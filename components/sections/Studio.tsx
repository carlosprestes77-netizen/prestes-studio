"use client";

import { motion } from "framer-motion";

const values = [
  {
    number: "01",
    title: "Arte Autoral",
    description:
      "Cada peça nasce de uma linguagem própria — a fusão de realismo, geometria sagrada e colagem surrealista. Não há cópias aqui.",
  },
  {
    number: "02",
    title: "Higiene Total",
    description:
      "Autoclave, materiais descartáveis e protocolo rigoroso. Seu corpo merece o mesmo cuidado que a arte impressa nele.",
  },
  {
    number: "03",
    title: "Acompanhamento",
    description:
      "Suporte completo na cicatrização e retoques inclusos nos primeiros 60 dias. A relação não termina na sessão.",
  },
];

export default function Studio() {
  return (
    <section id="estudio" className="py-24 lg:py-32 bg-ink-950">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left: Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="relative aspect-[3/4] overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1621111848501-8d3634f82336?w=900&q=85"
                alt="Bruno Beltrami tatuando"
                className="w-full h-full object-cover grayscale-[30%]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950/60 to-transparent" />
            </div>
            {/* Floating stat card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="absolute -bottom-6 -right-6 lg:-right-8 glass-dark border border-ink-700 p-6"
            >
              <p className="font-serif text-4xl text-gold">+500</p>
              <p className="text-xs text-ink-400 tracking-wider mt-1">Clientes satisfeitos</p>
            </motion.div>
            <div className="absolute top-6 left-6 border border-gold/30 p-3">
              <p className="text-[9px] tracking-[0.4em] text-gold uppercase">
                Bruno Beltrami · SC
              </p>
            </div>
          </motion.div>

          {/* Right: Content */}
          <div className="space-y-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
            >
              <p className="text-gold text-[10px] tracking-[0.5em] uppercase font-light mb-4">
                03 — O Estúdio
              </p>
              <h2 className="font-serif text-4xl lg:text-5xl font-light text-ink-100 leading-tight">
                Onde Cada Linha
                <br />
                <em className="text-gradient-gold not-italic">Tem Intenção</em>
              </h2>
              <div className="mt-6 w-16 h-px bg-gold" />
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-ink-400 text-sm leading-relaxed"
            >
              Bruno Beltrami une realismo detalhado com estruturas geométricas
              e referências clássicas — greco-romanas, maçônicas, da natureza.
              Um estilo inconfundível que transforma a pele em composição.
            </motion.p>

            {/* Values */}
            <div className="space-y-8">
              {values.map((v, i) => (
                <motion.div
                  key={v.number}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="flex gap-6"
                >
                  <span className="text-[10px] text-gold/60 font-mono mt-1 flex-shrink-0">
                    {v.number}
                  </span>
                  <div>
                    <h4 className="font-serif text-lg text-ink-100 mb-1">{v.title}</h4>
                    <p className="text-ink-500 text-sm leading-relaxed">{v.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
