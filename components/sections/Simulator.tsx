"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload, RotateCcw, ZoomIn, ZoomOut,
  ChevronLeft, ChevronRight, ArrowRight, X,
} from "lucide-react";
import { flashItems } from "@/lib/data";

interface TattooTransform { x: number; y: number; scale: number; rotation: number }
const INITIAL: TattooTransform = { x: 0, y: 0, scale: 1, rotation: 0 };

export default function Simulator() {
  const [selected, setSelected] = useState<(typeof flashItems)[0] | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [xf, setXf] = useState<TattooTransform>(INITIAL);
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [page, setPage] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);

  const perPage = 3;
  const totalPages = Math.ceil(flashItems.length / perPage);
  const visible = flashItems.slice(page * perPage, page * perPage + perPage);

  const onUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => { setPhoto(ev.target?.result as string); setStep(3); };
    reader.readAsDataURL(file);
  }, []);

  const onSelect = (f: (typeof flashItems)[0]) => {
    setSelected(f); setXf(INITIAL);
    setStep(photo ? 3 : 2);
  };

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault(); setDragging(true);
    setDragStart({ x: e.clientX - xf.x, y: e.clientY - xf.y });
  }, [xf.x, xf.y]);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragging) return;
    setXf(p => ({ ...p, x: e.clientX - dragStart.x, y: e.clientY - dragStart.y }));
  }, [dragging, dragStart]);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    const t = e.touches[0]; setDragging(true);
    setDragStart({ x: t.clientX - xf.x, y: t.clientY - xf.y });
  }, [xf.x, xf.y]);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (!dragging) return;
    const t = e.touches[0];
    setXf(p => ({ ...p, x: t.clientX - dragStart.x, y: t.clientY - dragStart.y }));
  }, [dragging, dragStart]);

  const onWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    setXf(p => ({ ...p, scale: Math.min(3, Math.max(0.3, p.scale - e.deltaY * 0.001)) }));
  }, []);

  return (
    <section id="simulador" className="py-24 lg:py-36 bg-paper-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-16">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8 }}
          className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-14"
        >
          <div>
            <p className="label-section mb-4">02 — Simulador Virtual</p>
            <h2
              className="font-serif font-light leading-[0.95] tracking-tight text-ink"
              style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)" }}
            >
              Veja na
              <br />
              Sua Pele
            </h2>
          </div>
          <p className="text-ink-muted text-sm font-light leading-relaxed max-w-xs">
            Escolha um flash, envie uma foto e posicione a tatuagem. Tudo no browser, sem upload para servidores.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="flex items-center gap-2 mb-12">
          {[{ n: 1, l: "Flash" }, { n: 2, l: "Foto" }, { n: 3, l: "Ajustar" }].map(({ n, l }) => (
            <div key={n} className="flex items-center gap-2">
              <div className={`flex items-center justify-center w-6 h-6 text-[10px] font-medium border transition-all duration-300 ${
                step >= n ? "bg-ink border-ink text-paper-100" : "border-paper-400 text-ink-faint"
              }`}>{n}</div>
              <span className={`text-[10px] tracking-widest uppercase hidden sm:block transition-colors duration-300 ${
                step >= n ? "text-ink" : "text-paper-400"
              }`}>{l}</span>
              {n < 3 && <div className={`w-6 h-px mx-1 transition-all duration-300 ${step > n ? "bg-ink" : "bg-paper-300"}`} />}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-[300px_1fr] gap-8 lg:gap-12">

          {/* Left panel */}
          <div className="space-y-5">
            <p className="text-[9px] tracking-widest uppercase text-ink-faint">Flashes Disponíveis</p>

            <AnimatePresence mode="wait">
              <motion.div
                key={page}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.2 }}
                className="space-y-2"
              >
                {visible.map((f) => (
                  <motion.button
                    key={f.id}
                    onClick={() => onSelect(f)}
                    whileTap={{ scale: 0.99 }}
                    className={`w-full flex items-center gap-4 p-3 border text-left transition-all duration-200 ${
                      selected?.id === f.id
                        ? "border-ink bg-ink/5"
                        : "border-paper-300 bg-paper-50 hover:border-paper-500"
                    }`}
                  >
                    {/* SVG thumbnail — white bg so the ink shows */}
                    <div className="w-14 h-14 flex-shrink-0 bg-white border border-paper-200 flex items-center justify-center overflow-hidden">
                      <img src={f.src} alt={f.name} className="w-12 h-12 object-contain" draggable={false} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-ink font-light">{f.name}</p>
                      <p className="text-[9px] tracking-widest text-ink-faint uppercase mt-0.5">{f.style}</p>
                      <p className="text-[10px] text-ink-muted leading-relaxed mt-1 line-clamp-2">{f.description}</p>
                    </div>
                    {selected?.id === f.id && (
                      <div className="w-1.5 h-1.5 rounded-full bg-ink flex-shrink-0" />
                    )}
                  </motion.button>
                ))}
              </motion.div>
            </AnimatePresence>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center gap-2">
                <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}
                  className="p-1.5 border border-paper-300 text-ink-muted hover:border-ink hover:text-ink disabled:opacity-30 transition-colors">
                  <ChevronLeft size={13} />
                </button>
                <span className="text-[10px] text-ink-faint">{page + 1}/{totalPages}</span>
                <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page === totalPages - 1}
                  className="p-1.5 border border-paper-300 text-ink-muted hover:border-ink hover:text-ink disabled:opacity-30 transition-colors">
                  <ChevronRight size={13} />
                </button>
              </div>
            )}

            {/* Upload */}
            <button onClick={() => fileRef.current?.click()}
              className="w-full flex items-center justify-center gap-2 py-3.5 border border-dashed border-paper-400 text-ink-muted hover:border-ink hover:text-ink transition-all duration-300 text-[10px] tracking-widest uppercase">
              <Upload size={13} />
              {photo ? "Trocar foto" : "Enviar foto do corpo"}
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onUpload} />
            <p className="text-[9px] text-ink-faint leading-relaxed">
              Sua foto não sai do navegador. Processamento 100% local.
            </p>

            {/* Controls */}
            {selected && photo && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="space-y-4 pt-5 border-t border-paper-300">
                <p className="text-[9px] tracking-widest uppercase text-ink-faint">Ajustes</p>

                <div className="flex items-center gap-2">
                  <span className="text-[9px] text-ink-faint w-14">Tamanho</span>
                  <button onClick={() => setXf(p => ({ ...p, scale: Math.max(0.3, p.scale - 0.1) }))}
                    className="p-1.5 border border-paper-300 hover:border-ink text-ink-muted hover:text-ink transition-colors">
                    <ZoomOut size={11} />
                  </button>
                  <div className="flex-1 h-px bg-paper-300 relative">
                    <div className="absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-ink rounded-full"
                      style={{ left: `${((xf.scale - 0.3) / 2.7) * 100}%` }} />
                  </div>
                  <button onClick={() => setXf(p => ({ ...p, scale: Math.min(3, p.scale + 0.1) }))}
                    className="p-1.5 border border-paper-300 hover:border-ink text-ink-muted hover:text-ink transition-colors">
                    <ZoomIn size={11} />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[9px] text-ink-faint w-14">Rotação</span>
                  <button onClick={() => setXf(p => ({ ...p, rotation: p.rotation - 15 }))}
                    className="p-1.5 border border-paper-300 hover:border-ink text-ink-muted hover:text-ink transition-colors">
                    <RotateCcw size={11} />
                  </button>
                  <span className="flex-1 text-center text-[10px] text-ink-muted">{xf.rotation}°</span>
                  <button onClick={() => setXf(p => ({ ...p, rotation: p.rotation + 15 }))}
                    className="p-1.5 border border-paper-300 hover:border-ink text-ink-muted hover:text-ink transition-colors rotate-180">
                    <RotateCcw size={11} />
                  </button>
                </div>

                <button onClick={() => setXf(INITIAL)}
                  className="text-[9px] tracking-widest uppercase text-ink-faint hover:text-ink transition-colors flex items-center gap-1.5">
                  <RotateCcw size={9} /> Resetar
                </button>
              </motion.div>
            )}
          </div>

          {/* Canvas */}
          <div className="space-y-3">
            <div
              className="relative bg-paper-50 border border-paper-300 overflow-hidden select-none"
              style={{ aspectRatio: "4/3", minHeight: "360px" }}
              onMouseMove={onMouseMove}
              onMouseUp={() => setDragging(false)}
              onMouseLeave={() => setDragging(false)}
              onTouchMove={onTouchMove}
              onTouchEnd={() => setDragging(false)}
              onWheel={onWheel}
            >
              {/* Body photo */}
              {photo ? (
                <img src={photo} alt="corpo" className="absolute inset-0 w-full h-full object-cover" draggable={false} />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                  <div className="w-10 h-px bg-paper-300" />
                  <p className="text-ink-faint text-[10px] tracking-widest uppercase text-center px-8">
                    {selected ? "Envie uma foto do corpo" : "Selecione um flash para começar"}
                  </p>
                  <div className="w-10 h-px bg-paper-300" />
                  {selected && (
                    <button onClick={() => fileRef.current?.click()}
                      className="mt-3 btn-outline text-[9px] py-2.5 px-5 flex items-center gap-2">
                      <Upload size={11} /> Enviar foto
                    </button>
                  )}
                </div>
              )}

              {/* Tattoo overlay */}
              <AnimatePresence>
                {selected && photo && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className={`absolute z-10 ${dragging ? "cursor-grabbing" : "cursor-grab"}`}
                    style={{
                      left: "50%", top: "50%",
                      transform: `translate(calc(-50% + ${xf.x}px), calc(-50% + ${xf.y}px)) scale(${xf.scale}) rotate(${xf.rotation}deg)`,
                      touchAction: "none",
                    }}
                    onMouseDown={onMouseDown}
                    onTouchStart={onTouchStart}
                  >
                    <img
                      src={selected.simSrc}
                      alt={selected.name}
                      className="select-none pointer-events-none block"
                      style={{ width: "150px", height: "auto", mixBlendMode: "multiply", filter: "contrast(1.08)", opacity: 0.92 }}
                      draggable={false}
                    />
                    <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-[8px] text-ink-muted tracking-wider whitespace-nowrap pointer-events-none">
                      Arraste para posicionar
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Clear photo */}
              {photo && (
                <button onClick={() => { setPhoto(null); setStep(selected ? 2 : 1); }}
                  className="absolute top-3 right-3 z-20 p-1.5 bg-paper-50/80 border border-paper-300 text-ink-muted hover:text-ink transition-colors">
                  <X size={11} />
                </button>
              )}
            </div>

            <p className="text-[9px] text-ink-faint">
              {selected && photo ? "Scroll → tamanho · Arraste → posição · Botões → rotação" : ""}
            </p>

            <AnimatePresence>
              {selected && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <a href={`#orcamento?flash=${encodeURIComponent(selected.name)}`}
                    className="btn-primary inline-flex items-center gap-3">
                    Quero essa tatuagem <ArrowRight size={13} />
                  </a>
                  <p className="mt-2.5 text-[9px] text-ink-faint">
                    Flash: <span className="text-ink">{selected.name}</span> · {selected.style}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
