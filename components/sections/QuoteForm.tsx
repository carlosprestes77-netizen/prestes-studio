"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Upload, CheckCircle, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { ARTIST } from "@/lib/data";

interface FormData {
  name: string;
  whatsapp: string;
  description: string;
  placement: string;
  size: string;
  references: File[];
  selectedFlash: string;
}

function FloatingInput({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  const [focused, setFocused] = useState(false);
  const floated = focused || value.length > 0;

  return (
    <div className="relative pt-5">
      <label
        className={cn(
          "absolute left-0 transition-all duration-300 pointer-events-none",
          floated
            ? "top-0 text-[10px] tracking-widest uppercase text-gold"
            : "top-5 text-sm text-ink-500"
        )}
      >
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        placeholder={focused ? placeholder : ""}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-transparent border-0 border-b border-ink-700 focus:border-gold outline-none text-ink-100 text-sm py-2 transition-colors duration-300 placeholder-ink-700"
      />
    </div>
  );
}

function FloatingTextarea({
  label,
  name,
  value,
  onChange,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const [focused, setFocused] = useState(false);
  const floated = focused || value.length > 0;

  return (
    <div className="relative pt-5">
      <label
        className={cn(
          "absolute left-0 transition-all duration-300 pointer-events-none",
          floated
            ? "top-0 text-[10px] tracking-widest uppercase text-gold"
            : "top-5 text-sm text-ink-500"
        )}
      >
        {label}
      </label>
      <textarea
        name={name}
        value={value}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        className="w-full bg-transparent border-0 border-b border-ink-700 focus:border-gold outline-none text-ink-100 text-sm py-2 transition-colors duration-300 resize-none"
      />
    </div>
  );
}

function buildWhatsAppMessage(form: FormData): string {
  const lines: string[] = [
    `Olá Bruno! Vim pelo site e quero solicitar um orçamento. 🖤`,
    ``,
    `*Nome:* ${form.name}`,
    form.whatsapp ? `*Meu WhatsApp:* ${form.whatsapp}` : "",
    form.selectedFlash ? `*Flash do Simulador:* ${form.selectedFlash}` : "",
    form.placement ? `*Local do corpo:* ${form.placement}` : "",
    form.size ? `*Tamanho:* ${form.size}` : "",
    ``,
    `*Ideia / Descrição:*`,
    form.description || "(sem descrição)",
  ];

  return lines.filter((l) => l !== undefined).join("\n");
}

export default function QuoteForm() {
  const [form, setForm] = useState<FormData>({
    name: "",
    whatsapp: "",
    description: "",
    placement: "",
    size: "",
    references: [],
    selectedFlash: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // Pre-fill if coming from simulator
  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.split("?")[1] || "");
    const flash = params.get("flash");
    if (flash) {
      setForm((prev) => ({
        ...prev,
        selectedFlash: flash,
        description: `Flash selecionado no Simulador: "${flash}". `,
      }));
    }
  }, []);

  const setField = (field: keyof FormData) => (value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setForm((prev) => ({ ...prev, references: Array.from(e.target.files!) }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const message = buildWhatsAppMessage(form);
    const url = `https://wa.me/${ARTIST.whatsapp}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener,noreferrer");
    setSubmitted(true);
  };

  const placements = [
    "Antebraço", "Braço", "Ombro", "Costela", "Perna",
    "Tornozelo", "Pé", "Pescoço", "Costas", "Outro",
  ];

  const sizes = [
    "Pequeno (até 5cm)",
    "Médio (5–10cm)",
    "Grande (10–20cm)",
    "Full piece (+20cm)",
  ];

  return (
    <section id="orcamento" className="py-24 lg:py-32 bg-ink-900">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left: copy */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div>
              <p className="text-gold text-[10px] tracking-[0.5em] uppercase font-light mb-4">
                04 — Orçamento
              </p>
              <h2 className="font-serif text-4xl lg:text-5xl font-light text-ink-100 leading-tight">
                Vamos Criar
                <br />
                Algo Único
              </h2>
              <div className="mt-6 w-16 h-px bg-gold" />
            </div>

            <p className="text-ink-400 text-sm leading-relaxed">
              Preencha os dados abaixo. Ao enviar, você será direcionado para o
              WhatsApp do Bruno com uma mensagem já formatada — sem copiar e
              colar nada.
            </p>

            <div className="space-y-4">
              {[
                "Projetos com identidade própria têm prioridade",
                "Orçamento sem compromisso",
                "Sessão de briefing gratuita",
                "Retoques inclusos nos primeiros 60 dias",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <span className="w-1 h-1 rounded-full bg-gold mt-2 flex-shrink-0" />
                  <span className="text-sm text-ink-400">{item}</span>
                </div>
              ))}
            </div>

            {/* WhatsApp direct link */}
            <div className="pt-4 border-t border-ink-800">
              <p className="text-[10px] text-ink-600 mb-3 tracking-wider uppercase">
                Ou fale diretamente
              </p>
              <a
                href={`https://wa.me/${ARTIST.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 py-3 px-6 bg-[#25D366]/10 border border-[#25D366]/30 text-[#25D366] text-xs tracking-widest uppercase hover:bg-[#25D366]/20 transition-all duration-300"
              >
                <MessageCircle size={14} />
                Abrir WhatsApp
              </a>
            </div>

            <div className="pt-4 border-t border-ink-800">
              <p className="font-serif text-2xl text-ink-700 italic leading-snug">
                "Tatuagens não são sobre o tatuador.
                <br />
                São sobre quem as carrega."
              </p>
            </div>
          </motion.div>

          {/* Right: Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="h-full flex flex-col items-center justify-center text-center gap-6 py-20"
              >
                <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center">
                  <CheckCircle className="text-gold" size={28} />
                </div>
                <div>
                  <h3 className="font-serif text-3xl text-ink-100 mb-2">
                    WhatsApp Aberto!
                  </h3>
                  <p className="text-ink-500 text-sm max-w-xs mx-auto leading-relaxed">
                    A mensagem já está formatada. Só enviar e aguardar o retorno
                    do Bruno. 🖤
                  </p>
                </div>
                <button
                  onClick={() => setSubmitted(false)}
                  className="text-[10px] tracking-widest uppercase text-ink-600 hover:text-gold transition-colors"
                >
                  Preencher novamente
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                {form.selectedFlash && (
                  <div className="py-3 px-4 bg-gold/5 border border-gold/20 flex items-center gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
                    <p className="text-xs text-ink-400">
                      Flash do Simulador:{" "}
                      <strong className="text-gold">{form.selectedFlash}</strong>
                    </p>
                  </div>
                )}

                <FloatingInput
                  label="Seu nome"
                  name="name"
                  value={form.name}
                  onChange={setField("name")}
                />

                <FloatingInput
                  label="Seu WhatsApp (para retorno)"
                  name="whatsapp"
                  type="tel"
                  value={form.whatsapp}
                  onChange={setField("whatsapp")}
                  placeholder="(48) 99999-9999"
                />

                <FloatingTextarea
                  label="Descreva sua ideia"
                  name="description"
                  value={form.description}
                  onChange={setField("description")}
                />

                {/* Placement */}
                <div className="space-y-3">
                  <label className="text-[10px] tracking-widest uppercase text-gold">
                    Local do corpo
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {placements.map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setField("placement")(p)}
                        className={cn(
                          "text-[10px] tracking-wider uppercase px-3 py-1.5 border transition-all duration-200",
                          form.placement === p
                            ? "border-gold bg-gold/10 text-gold"
                            : "border-ink-700 text-ink-500 hover:border-ink-500"
                        )}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Size */}
                <div className="space-y-3">
                  <label className="text-[10px] tracking-widest uppercase text-gold">
                    Tamanho aproximado
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {sizes.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setField("size")(s)}
                        className={cn(
                          "text-[10px] tracking-wider text-left px-3 py-2.5 border transition-all duration-200",
                          form.size === s
                            ? "border-gold bg-gold/10 text-gold"
                            : "border-ink-700 text-ink-500 hover:border-ink-500"
                        )}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* References upload */}
                <div className="space-y-3">
                  <label className="text-[10px] tracking-widest uppercase text-gold">
                    Imagens de referência{" "}
                    <span className="text-ink-700 normal-case tracking-normal">(opcional)</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="w-full flex items-center gap-3 py-4 border border-dashed border-ink-700 text-ink-500 hover:border-gold hover:text-gold transition-all duration-300 text-xs tracking-widest uppercase px-4"
                  >
                    <Upload size={14} />
                    {form.references.length > 0
                      ? `${form.references.length} arquivo(s) — envie pelo WhatsApp`
                      : "Selecionar imagens"}
                  </button>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  {form.references.length > 0 && (
                    <p className="text-[10px] text-ink-600">
                      As imagens serão enviadas separadamente no WhatsApp após abrir a conversa.
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={!form.name.trim()}
                  className="btn-primary w-full justify-center gap-3 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <MessageCircle size={14} />
                  Enviar via WhatsApp
                </button>

                <p className="text-[10px] text-ink-700 text-center">
                  Ao clicar, o WhatsApp abre com sua mensagem já formatada.
                </p>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
