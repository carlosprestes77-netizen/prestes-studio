"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, RotateCcw, ZoomIn, ZoomOut, ChevronLeft, ChevronRight, ArrowRight, X } from "lucide-react";
import { flashItems } from "@/lib/data";

interface TattooTransform {
  x: number;
  y: number;
  scale: number;
  rotation: number;
}

const INITIAL_TRANSFORM: TattooTransform = { x: 0, y: 0, scale: 1, rotation: 0 };

export default function Simulator() {
  const [selectedFlash, setSelectedFlash] = useState<(typeof flashItems)[0] | null>(null);
  const [bodyPhoto, setBodyPhoto] = useState<string | null>(null);
  const [transform, setTransform] = useState<TattooTransform>(INITIAL_TRANSFORM);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [flashPage, setFlashPage] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const flashesPerPage = 3;
  const totalPages = Math.ceil(flashItems.length / flashesPerPage);
  const visibleFlashes = flashItems.slice(
    flashPage * flashesPerPage,
    flashPage * flashesPerPage + flashesPerPage
  );

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setBodyPhoto(ev.target?.result as string);
      setStep(3);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleSelectFlash = (flash: (typeof flashItems)[0]) => {
    setSelectedFlash(flash);
    setTransform(INITIAL_TRANSFORM);
    if (bodyPhoto) {
      setStep(3);
    } else {
      setStep(2);
    }
  };

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      setIsDragging(true);
      setDragStart({ x: e.clientX - transform.x, y: e.clientY - transform.y });
    },
    [transform.x, transform.y]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging) return;
      setTransform((prev) => ({
        ...prev,
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      }));
    },
    [isDragging, dragStart]
  );

  const handleMouseUp = useCallback(() => setIsDragging(false), []);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      const touch = e.touches[0];
      setIsDragging(true);
      setDragStart({ x: touch.clientX - transform.x, y: touch.clientY - transform.y });
    },
    [transform.x, transform.y]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!isDragging) return;
      const touch = e.touches[0];
      setTransform((prev) => ({
        ...prev,
        x: touch.clientX - dragStart.x,
        y: touch.clientY - dragStart.y,
      }));
    },
    [isDragging, dragStart]
  );

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    setTransform((prev) => ({
      ...prev,
      scale: Math.min(3, Math.max(0.3, prev.scale - e.deltaY * 0.001)),
    }));
  }, []);

  const adjustScale = (delta: number) => {
    setTransform((prev) => ({
      ...prev,
      scale: Math.min(3, Math.max(0.3, prev.scale + delta)),
    }));
  };

  const adjustRotation = (delta: number) => {
    setTransform((prev) => ({ ...prev, rotation: prev.rotation + delta }));
  };

  const quoteMessage = selectedFlash
    ? `Olá! Vim do Simulador Virtual e gostei do flash "${selectedFlash.name}". Gostaria de um orçamento.`
    : "";

  return (
    <section id="simulador" className="py-24 lg:py-32 bg-ink-900">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <p className="text-gold text-[10px] tracking-[0.5em] uppercase font-light mb-4">
            02 — Simulador
          </p>
          <h2 className="font-serif text-4xl lg:text-6xl font-light text-ink-100 leading-tight">
            Veja na Sua Pele
          </h2>
          <p className="mt-4 text-ink-400 text-sm leading-relaxed max-w-lg">
            Escolha um flash autoral, envie uma foto do corpo e visualize como ficaria
            antes de marcar a sessão.
          </p>
          <div className="mt-6 w-16 h-px bg-gold" />
        </motion.div>

        {/* Steps indicator */}
        <div className="flex items-center gap-3 mb-12">
          {[
            { n: 1, label: "Escolher flash" },
            { n: 2, label: "Enviar foto" },
            { n: 3, label: "Ajustar" },
          ].map(({ n, label }) => (
            <div key={n} className="flex items-center gap-3">
              <div
                className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-medium transition-all duration-300 ${
                  step >= n
                    ? "bg-gold text-ink-950"
                    : "bg-ink-800 text-ink-600 border border-ink-700"
                }`}
              >
                {n}
              </div>
              <span
                className={`text-xs tracking-wide hidden sm:block transition-colors duration-300 ${
                  step >= n ? "text-ink-300" : "text-ink-600"
                }`}
              >
                {label}
              </span>
              {n < 3 && (
                <div
                  className={`w-8 h-px transition-all duration-300 ${
                    step > n ? "bg-gold" : "bg-ink-700"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-[320px_1fr] gap-8 lg:gap-12">
          {/* Left panel: Flash selector */}
          <div className="space-y-6">
            <h3 className="text-xs tracking-widest uppercase text-ink-400">Flash Disponíveis</h3>

            <AnimatePresence mode="wait">
              <motion.div
                key={flashPage}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.25 }}
                className="grid grid-cols-3 lg:grid-cols-1 gap-3"
              >
                {visibleFlashes.map((flash) => (
                  <motion.button
                    key={flash.id}
                    onClick={() => handleSelectFlash(flash)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`relative group flex lg:flex-row flex-col items-center lg:gap-4 p-3 lg:p-4 border transition-all duration-300 text-left ${
                      selectedFlash?.id === flash.id
                        ? "border-gold bg-gold/5"
                        : "border-ink-800 bg-ink-950 hover:border-ink-600"
                    }`}
                  >
                    {/* Placeholder flash preview */}
                    <div className="w-14 h-14 lg:w-16 lg:h-16 flex-shrink-0 bg-ink-800 flex items-center justify-center text-2xl lg:text-3xl rounded-sm overflow-hidden">
                      {flash.placeholder}
                    </div>
                    <div className="hidden lg:block">
                      <p className="text-sm text-ink-200 font-light">{flash.name}</p>
                      <p className="text-[10px] tracking-wider text-ink-500 uppercase mt-0.5">
                        {flash.style}
                      </p>
                    </div>
                    {selectedFlash?.id === flash.id && (
                      <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-gold" />
                    )}
                  </motion.button>
                ))}
              </motion.div>
            </AnimatePresence>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setFlashPage((p) => Math.max(0, p - 1))}
                  disabled={flashPage === 0}
                  className="p-1.5 border border-ink-700 text-ink-500 hover:text-gold hover:border-gold disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={14} />
                </button>
                <span className="text-[10px] text-ink-600">
                  {flashPage + 1} / {totalPages}
                </span>
                <button
                  onClick={() => setFlashPage((p) => Math.min(totalPages - 1, p + 1))}
                  disabled={flashPage === totalPages - 1}
                  className="p-1.5 border border-ink-700 text-ink-500 hover:text-gold hover:border-gold disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            )}

            {/* Upload button */}
            <div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center justify-center gap-3 py-4 border border-dashed border-ink-700 text-ink-500 hover:border-gold hover:text-gold transition-all duration-300 text-xs tracking-widest uppercase"
              >
                <Upload size={14} />
                {bodyPhoto ? "Trocar foto do corpo" : "Enviar foto do corpo"}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
              />
              <p className="mt-2 text-[10px] text-ink-600 leading-relaxed">
                Sua foto não é enviada a nenhum servidor. Todo o processamento é local.
              </p>
            </div>

            {/* Controls */}
            {selectedFlash && bodyPhoto && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4 pt-4 border-t border-ink-800"
              >
                <h4 className="text-[10px] tracking-widest uppercase text-ink-500">Ajustes</h4>

                {/* Scale */}
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-ink-600 w-16">Tamanho</span>
                  <button
                    onClick={() => adjustScale(-0.1)}
                    className="p-1.5 border border-ink-700 hover:border-gold hover:text-gold text-ink-500 transition-colors"
                  >
                    <ZoomOut size={12} />
                  </button>
                  <div className="flex-1 h-px bg-ink-800 relative">
                    <div
                      className="absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-gold rounded-full"
                      style={{ left: `${((transform.scale - 0.3) / 2.7) * 100}%` }}
                    />
                  </div>
                  <button
                    onClick={() => adjustScale(0.1)}
                    className="p-1.5 border border-ink-700 hover:border-gold hover:text-gold text-ink-500 transition-colors"
                  >
                    <ZoomIn size={12} />
                  </button>
                </div>

                {/* Rotation */}
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-ink-600 w-16">Rotação</span>
                  <button
                    onClick={() => adjustRotation(-15)}
                    className="p-1.5 border border-ink-700 hover:border-gold hover:text-gold text-ink-500 transition-colors"
                  >
                    <RotateCcw size={12} />
                  </button>
                  <span className="flex-1 text-center text-xs text-ink-500">
                    {transform.rotation}°
                  </span>
                  <button
                    onClick={() => adjustRotation(15)}
                    className="p-1.5 border border-ink-700 hover:border-gold hover:text-gold text-ink-500 transition-colors rotate-180"
                  >
                    <RotateCcw size={12} />
                  </button>
                </div>

                {/* Reset */}
                <button
                  onClick={() => setTransform(INITIAL_TRANSFORM)}
                  className="text-[10px] tracking-widest uppercase text-ink-600 hover:text-gold transition-colors flex items-center gap-1.5"
                >
                  <RotateCcw size={10} />
                  Resetar posição
                </button>
              </motion.div>
            )}
          </div>

          {/* Right panel: Canvas */}
          <div className="space-y-4">
            <div
              ref={canvasRef}
              className="relative bg-ink-950 border border-ink-800 overflow-hidden select-none"
              style={{ aspectRatio: "4/3", minHeight: "360px" }}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleMouseUp}
              onWheel={handleWheel}
            >
              {/* Background photo */}
              {bodyPhoto ? (
                <img
                  src={bodyPhoto}
                  alt="Foto do corpo"
                  className="absolute inset-0 w-full h-full object-cover"
                  draggable={false}
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                  <div className="w-16 h-px bg-ink-800" />
                  <p className="text-ink-600 text-xs tracking-widest uppercase text-center px-4">
                    {selectedFlash
                      ? "Envie uma foto do corpo para continuar"
                      : "Selecione um flash para começar"}
                  </p>
                  <div className="w-16 h-px bg-ink-800" />
                  {selectedFlash && (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="mt-4 btn-outline text-[10px] py-3 px-6 flex items-center gap-2"
                    >
                      <Upload size={12} />
                      Enviar foto
                    </button>
                  )}
                </div>
              )}

              {/* Overlay for dimming */}
              {bodyPhoto && (
                <div className="absolute inset-0 bg-ink-950/20 pointer-events-none" />
              )}

              {/* Tattoo overlay */}
              <AnimatePresence>
                {selectedFlash && bodyPhoto && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className={`absolute z-10 ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
                    style={{
                      left: "50%",
                      top: "50%",
                      transform: `translate(calc(-50% + ${transform.x}px), calc(-50% + ${transform.y}px)) scale(${transform.scale}) rotate(${transform.rotation}deg)`,
                      touchAction: "none",
                    }}
                    onMouseDown={handleMouseDown}
                    onTouchStart={handleTouchStart}
                  >
                    {/* Flash preview — uses emoji as placeholder (replace with real PNG) */}
                    <div
                      className="flex items-center justify-center select-none pointer-events-none"
                      style={{ fontSize: "clamp(60px, 10vw, 100px)", lineHeight: 1 }}
                    >
                      {selectedFlash.placeholder}
                    </div>
                    {/* Drag hint */}
                    <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] text-gold/70 tracking-wider whitespace-nowrap">
                      Arraste para posicionar
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Clear photo button */}
              {bodyPhoto && (
                <button
                  onClick={() => {
                    setBodyPhoto(null);
                    setStep(selectedFlash ? 2 : 1);
                  }}
                  className="absolute top-3 right-3 z-20 p-1.5 bg-ink-950/80 border border-ink-700 text-ink-500 hover:text-gold hover:border-gold transition-colors"
                >
                  <X size={12} />
                </button>
              )}
            </div>

            {/* Helper text */}
            <p className="text-[10px] text-ink-600">
              {selectedFlash && bodyPhoto
                ? "Use o scroll do mouse para redimensionar · Arraste para posicionar · Use os botões para rotacionar"
                : ""}
            </p>

            {/* CTA */}
            <AnimatePresence>
              {selectedFlash && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="pt-4"
                >
                  <a
                    href={`#orcamento?flash=${encodeURIComponent(selectedFlash.name)}`}
                    onClick={() => {
                      const el = document.getElementById("flash-selected");
                      if (el) el.setAttribute("data-value", selectedFlash.name);
                    }}
                    data-flash={selectedFlash.name}
                    className="btn-primary inline-flex items-center gap-3"
                  >
                    Quero essa tatuagem
                    <ArrowRight size={14} />
                  </a>
                  <p className="mt-3 text-[10px] text-ink-600">
                    Flash selecionado:{" "}
                    <span className="text-gold">{selectedFlash.name}</span>
                    {" · "}
                    {selectedFlash.style}
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
