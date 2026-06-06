"use client";

import { motion } from "framer-motion";

const values = [
  { n: "01", title: "Arte Autoral", desc: "Cada peça nasce de uma linguagem própria — fusão de realismo, geometria sagrada e colagem surrealista. Não há cópias." },
  { n: "02", title: "Higiene Total", desc: "Autoclave, materiais descartáveis e protocolo rigoroso. Seu corpo merece o mesmo cuidado que a arte impressa nele." },
  { n: "03", title: "Acompanhamento", desc: "Suporte completo na cicatrização e retoques inclusos nos primeiros 60 dias. A relação não termina na sessão." },
];

export default function Studio() {
  return (
    <section id="estudio" className="py-24 lg:py-36 bg-paper-200">
      <div className="max-w-7xl mx-auto px-6 lg:px-16">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">

          {/* Left: image editorial */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="relative aspect-[3/4] overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1621111848501-8d3634f82336?w=900&q=85"
                alt="Bruno Beltrami"
                className="w-full h-full object-cover grayscale-[20%]"
              />
            </div>
            {/* Offset label card */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="absolute -bottom-6 -right-4 lg:-right-8 bg-ink text-paper-100 p-6"
            >
              <p className="font-serif text-3xl text-paper-100">+500</p>
              <p className="text-[9px] tracking-widest text-paper-400 uppercase mt-1">Trabalhos realizados</p>
            </motion.div>
          </motion.div>

          {/* Right: content */}
          <div className="pt-4 space-y-10">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <p className="label-section mb-4">03 — O Artista</p>
              <h2
                className="font-serif font-light leading-[0.95] tracking-tight text-ink"
                style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)" }}
              >
                Onde Cada
                <br />
                Linha Tem
                <br />
                Intenção
              </h2>
              <div className="divider mt-6" />
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-ink-muted text-sm leading-relaxed"
            >
              Bruno Beltrami une realismo detalhado com estruturas geométricas
              e referências clássicas — greco-romanas, maçônicas, da natureza.
              Um estilo inconfundível que transforma a pele em composição.
            </motion.p>

            <div className="space-y-7">
              {values.map((v, i) => (
                <motion.div
                  key={v.n}
                  initial={{ opacity: 0, x: 16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="flex gap-6 pb-7 border-b border-paper-300 last:border-0 last:pb-0"
                >
                  <span className="text-[9px] text-ink-faint font-mono mt-0.5 flex-shrink-0">{v.n}</span>
                  <div>
                    <h4 className="font-serif text-lg text-ink mb-1">{v.title}</h4>
                    <p className="text-ink-muted text-sm leading-relaxed">{v.desc}</p>
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
