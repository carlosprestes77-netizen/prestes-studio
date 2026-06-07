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
const BASE_PX = 160;

/* ─── Skin-tone pixel classifier ─────────────────────────────── */
function isSkin(r: number, g: number, b: number): boolean {
  const lum = 0.299 * r + 0.587 * g + 0.114 * b;
  if (lum < 22 || lum > 252) return false;   // too dark or too bright
  if (r < b + 5) return false;               // skin always has more red than blue
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  if (delta < 10 || max === 0) return false;  // no saturation → not skin
  const rawH =
    max === r ? 60 * ((g - b) / delta) :
    max === g ? 60 * ((b - r) / delta + 2) :
                60 * ((r - g) / delta + 4);
  const hue = ((rawH % 360) + 360) % 360;
  const sat = delta / max;
  // Skin hue is 0–50° (red-orange) at moderate saturation
  return hue < 52 && sat > 0.09 && sat < 0.94;
}

/* ─── Detect skin density and size tattoo accordingly ────────────
 *
 *  WHY we no longer compute a centroid offset:
 *  Phone JPEGs carry an EXIF orientation tag. The browser's <img> element
 *  auto-rotates the display (so the user sees a portrait forearm). But
 *  canvas.drawImage() ignores EXIF — it draws the raw pixel data, which
 *  for a portrait phone shot is stored as landscape. Any centroid we compute
 *  from that canvas is in the wrong coordinate space and maps to the wrong
 *  position in the displayed (auto-rotated) image. Result: the tattoo lands
 *  in the corner instead of the arm.
 *
 *  The fix: count skin pixels (no coordinates needed) to estimate coverage,
 *  derive an appropriate scale, and ALWAYS place at centre. For a close-up
 *  body-part photo the centre of the frame IS the body part. The user can
 *  drag to fine-tune.
 * ──────────────────────────────────────────────────────────────── */
function detectAndPlace(img: HTMLImageElement, cW: number, cH: number): TattooTransform {
  const S = 128;
  const cv = document.createElement("canvas");
  cv.width = S; cv.height = S;
  const ctx = cv.getContext("2d")!;
  ctx.drawImage(img, 0, 0, S, S);
  const { data } = ctx.getImageData(0, 0, S, S);

  let skinCount = 0;
  for (let i = 0; i < data.length; i += 4) {
    if (isSkin(data[i], data[i + 1], data[i + 2])) skinCount++;
  }

  // skinFrac: 0 = no skin (full-body / complex bg), 1 = skin fills entire frame
  const skinFrac = skinCount / (S * S);

  // Scale: use the LONGER side of the container so the tattoo fills the arm
  // on both portrait and landscape photos. Larger factors = bolder result.
  const longSide = Math.max(cW, cH);
  const fillFactor = skinFrac > 0.30
    ? 0.85                    // close-up: large tattoo covering most of the arm
    : skinFrac > 0.10
      ? 0.68                  // partial body
      : 0.52;                 // full-body scene

  const tgtPx = Math.max(160, Math.min(cW * 0.92, longSide * fillFactor));
  const scale = tgtPx / BASE_PX;

  return { x: 0, y: 0, scale, rotation: 0 };
}

/* ─── Process sim PNG → dark ink on transparent ──────────────── */
function extractTattoo(src: string): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      try {
        const MAX = 900;
        const ratio = Math.min(1, MAX / Math.max(img.width, img.height));
        const w = Math.round(img.width * ratio);
        const h = Math.round(img.height * ratio);
        const cv = document.createElement("canvas");
        cv.width = w; cv.height = h;
        const ctx = cv.getContext("2d")!;
        ctx.drawImage(img, 0, 0, w, h);
        const id = ctx.getImageData(0, 0, w, h);
        const px = id.data;

        // Brightness → ink-alpha ramp. White paper (≈245+) disappears,
        // solid ink (≤55) is fully present, and EVERY value between keeps
        // its tonal weight — preserving the shading/fades that make it
        // look like real ink instead of a flat stamp.
        const BG = 240;   // anything brighter than this is background/paper
        const INK = 80;   // anything darker is solid ink (raised from 55 → steeper ramp)
        for (let i = 0; i < px.length; i += 4) {
          const a = px[i + 3];
          if (a < 16) { px[i + 3] = 0; continue; }
          const lum = 0.299 * px[i] + 0.587 * px[i + 1] + 0.114 * px[i + 2];

          let t = (BG - lum) / (BG - INK);
          t = Math.max(0, Math.min(1, t));
          t = t * t * (3 - 2 * t);                   // smoothstep

          if (t <= 0.004) { px[i + 3] = 0; continue; }

          // Pure cool black — no warm tint — for maximum contrast on any skin tone.
          // Shading gradients survive through the alpha channel.
          px[i] = 8; px[i + 1] = 8; px[i + 2] = 10;
          px[i + 3] = Math.round(t * a * 0.95);
        }
        ctx.putImageData(id, 0, 0);
        resolve(cv.toDataURL("image/png"));
      } catch {
        resolve(src); // canvas tainted or other error → use original
      }
    };
    img.onerror = () => resolve(src);
    img.src = src;
  });
}

/* ─── Component ──────────────────────────────────────────────── */
export default function Simulator() {
  const [selected, setSelected] = useState<(typeof flashItems)[0] | null>(null);
  const [processedSrc, setProcessedSrc] = useState<string | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [xf, setXf] = useState<TattooTransform>(INITIAL);
  const [dragging, setDragging] = useState(false);
  const draggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [page, setPage] = useState(0);
  const [detecting, setDetecting] = useState(false);
  const [userMoved, setUserMoved] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const perPage = 3;
  const totalPages = Math.ceil(flashItems.length / perPage);
  const visible = flashItems.slice(page * perPage, page * perPage + perPage);

  const runDetection = useCallback((img: HTMLImageElement) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    if (!rect.width) return;
    setDetecting(true);
    // Allow detecting state to render before blocking canvas work
    setTimeout(() => {
      const result = detectAndPlace(img, rect.width, rect.height);
      setXf(result);
      setDetecting(false);
      setUserMoved(false);
    }, 40);
  }, []);

  const onUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const url = ev.target?.result as string;
      setPhoto(url);
      setStep(3);
      const img = new Image();
      img.onload = () => { imgRef.current = img; runDetection(img); };
      img.src = url;
    };
    reader.readAsDataURL(file);
  }, [runDetection]);

  const onSelect = useCallback((f: (typeof flashItems)[0]) => {
    setSelected(f);
    // Start processing immediately, show original until ready
    setProcessedSrc(null);
    extractTattoo(f.simSrc).then(setProcessedSrc);
    if (imgRef.current && photo) runDetection(imgRef.current);
    else { setXf(INITIAL); setUserMoved(false); }
    setStep(photo ? 3 : 2);
  }, [photo, runDetection]);

  /* ── drag — ref-based avoids stale-closure bugs ── */
  const onMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    draggingRef.current = true;
    dragStartRef.current = { x: e.clientX - xf.x, y: e.clientY - xf.y };
    setDragging(true); setUserMoved(true);
  }, [xf.x, xf.y]);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!draggingRef.current) return;
    const { x, y } = dragStartRef.current;
    setXf(p => ({ ...p, x: e.clientX - x, y: e.clientY - y }));
  }, []);

  const stopDrag = useCallback(() => {
    draggingRef.current = false; setDragging(false);
  }, []);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    const t = e.touches[0];
    draggingRef.current = true;
    dragStartRef.current = { x: t.clientX - xf.x, y: t.clientY - xf.y };
    setDragging(true); setUserMoved(true);
  }, [xf.x, xf.y]);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (!draggingRef.current) return;
    const t = e.touches[0];
    const { x, y } = dragStartRef.current;
    setXf(p => ({ ...p, x: t.clientX - x, y: t.clientY - y }));
  }, []);

  const onWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault(); setUserMoved(true);
    setXf(p => ({ ...p, scale: Math.min(3, Math.max(0.3, p.scale - e.deltaY * 0.001)) }));
  }, []);

  const tattooSrc = processedSrc ?? (selected?.simSrc ?? null);
  const overlayVisible = !!(selected && photo && !detecting && tattooSrc);
  const showHint = overlayVisible && !userMoved;

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
            <p className="label-section mb-4">03 — Simulador Virtual</p>
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
            Selecione um flash, envie uma foto e veja como fica na sua pele. Ajuste posição, tamanho e rotação. 100% local, sem upload.
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
                    <div className="w-14 h-14 flex-shrink-0 bg-white border border-paper-200 flex items-center justify-center overflow-hidden">
                      <img src={f.src} alt={f.name} className="w-12 h-12 object-contain" draggable={false} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-ink font-light">{f.name}</p>
                      <p className="text-[9px] tracking-widest text-ink-faint uppercase mt-0.5">{f.style}</p>
                      <p className="text-[10px] text-ink-muted leading-relaxed mt-1 line-clamp-2">{f.description}</p>
                    </div>
                    {selected?.id === f.id && <div className="w-1.5 h-1.5 rounded-full bg-ink flex-shrink-0" />}
                  </motion.button>
                ))}
              </motion.div>
            </AnimatePresence>

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

            <button onClick={() => fileRef.current?.click()}
              className="w-full flex items-center justify-center gap-2 py-3.5 border border-dashed border-paper-400 text-ink-muted hover:border-ink hover:text-ink transition-all duration-300 text-[10px] tracking-widest uppercase">
              <Upload size={13} />
              {photo ? "Trocar foto" : "Enviar foto do corpo"}
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onUpload} />
            <p className="text-[9px] text-ink-faint leading-relaxed">
              Sua foto não sai do dispositivo. Tudo processado localmente.
            </p>

            {/* Fine-tune controls */}
            {selected && photo && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="space-y-4 pt-5 border-t border-paper-300">
                <p className="text-[9px] tracking-widest uppercase text-ink-faint">Ajuste Fino</p>

                <div className="flex items-center gap-2">
                  <span className="text-[9px] text-ink-faint w-14">Tamanho</span>
                  <button onClick={() => { setXf(p => ({ ...p, scale: Math.max(0.3, p.scale - 0.1) })); setUserMoved(true); }}
                    className="p-1.5 border border-paper-300 hover:border-ink text-ink-muted hover:text-ink transition-colors">
                    <ZoomOut size={11} />
                  </button>
                  <div className="flex-1 h-px bg-paper-300 relative">
                    <div className="absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-ink rounded-full"
                      style={{ left: `${((xf.scale - 0.3) / 2.7) * 100}%` }} />
                  </div>
                  <button onClick={() => { setXf(p => ({ ...p, scale: Math.min(3, p.scale + 0.1) })); setUserMoved(true); }}
                    className="p-1.5 border border-paper-300 hover:border-ink text-ink-muted hover:text-ink transition-colors">
                    <ZoomIn size={11} />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[9px] text-ink-faint w-14">Rotação</span>
                  <button onClick={() => { setXf(p => ({ ...p, rotation: p.rotation - 15 })); setUserMoved(true); }}
                    className="p-1.5 border border-paper-300 hover:border-ink text-ink-muted hover:text-ink transition-colors">
                    <RotateCcw size={11} />
                  </button>
                  <span className="flex-1 text-center text-[10px] text-ink-muted">{xf.rotation}°</span>
                  <button onClick={() => { setXf(p => ({ ...p, rotation: p.rotation + 15 })); setUserMoved(true); }}
                    className="p-1.5 border border-paper-300 hover:border-ink text-ink-muted hover:text-ink transition-colors rotate-180">
                    <RotateCcw size={11} />
                  </button>
                </div>

                <button
                  onClick={() => imgRef.current && runDetection(imgRef.current)}
                  className="text-[9px] tracking-widest uppercase text-ink-faint hover:text-ink transition-colors flex items-center gap-1.5">
                  <RotateCcw size={9} /> Detectar novamente
                </button>
              </motion.div>
            )}
          </div>

          {/* Canvas / preview area */}
          <div className="space-y-3">
            <div
              ref={containerRef}
              className="relative bg-paper-50 border border-paper-300 overflow-hidden select-none w-full aspect-square lg:aspect-[4/3] max-h-[600px]"
              onMouseMove={onMouseMove}
              onMouseUp={stopDrag}
              onMouseLeave={stopDrag}
              onTouchMove={onTouchMove}
              onTouchEnd={stopDrag}
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

              {/* Detection overlay */}
              <AnimatePresence>
                {detecting && (
                  <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-paper-950/30 backdrop-blur-[2px]"
                  >
                    <div className="flex gap-1.5">
                      {[0, 1, 2].map(i => (
                        <motion.div key={i} className="w-1.5 h-1.5 rounded-full bg-paper-100"
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.2 }} />
                      ))}
                    </div>
                    <p className="text-paper-200 text-[10px] tracking-widest uppercase">Analisando…</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Tattoo overlay */}
              <AnimatePresence>
                {overlayVisible && (
                  /* Outer wrapper: only animates opacity — never transforms */
                  <motion.div
                    key="tattoo-wrapper"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0 z-10 pointer-events-none"
                  >
                    {/* Inner div: owns all positional transforms — Framer Motion never touches this */}
                    <div
                      className={`absolute pointer-events-auto ${dragging ? "cursor-grabbing" : "cursor-grab"}`}
                      style={{
                        left: "50%",
                        top: "50%",
                        transform: `translate(calc(-50% + ${xf.x}px), calc(-50% + ${xf.y}px)) scale(${xf.scale}) rotate(${xf.rotation}deg)`,
                        transition: dragging ? "none" : "transform 0.4s cubic-bezier(0.22,1,0.36,1)",
                        touchAction: "none",
                      }}
                      onMouseDown={onMouseDown}
                      onTouchStart={onTouchStart}
                    >
                      <img
                        src={tattooSrc!}
                        alt={selected!.name}
                        className="select-none pointer-events-none block"
                        style={{
                          width: `${BASE_PX}px`,
                          height: "auto",
                          // multiply lets the skin's real lighting modulate the
                          // ink; the soft alpha edges from extractTattoo define
                          // the silhouette, so NO vignette mask is needed.
                          mixBlendMode: "multiply",
                          filter: "blur(0.2px) contrast(1.25) brightness(0.82)",
                          opacity: 0.96,
                        }}
                        draggable={false}
                      />
                      <AnimatePresence>
                        {showHint && (
                          <motion.p
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            transition={{ delay: 0.8 }}
                            className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[8px] text-ink-muted tracking-wider bg-paper-50/80 px-2 py-0.5 pointer-events-none"
                          >
                            Encaixada · arraste para ajustar
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Remove photo */}
              {photo && (
                <button
                  onClick={() => {
                    setPhoto(null); imgRef.current = null;
                    setDetecting(false); setStep(selected ? 2 : 1);
                  }}
                  className="absolute top-3 right-3 z-30 p-1.5 bg-paper-50/80 border border-paper-300 text-ink-muted hover:text-ink transition-colors">
                  <X size={11} />
                </button>
              )}
            </div>

            <p className="text-[9px] text-ink-faint">
              {overlayVisible ? "Scroll → tamanho · Arraste → posição · Botões → rotação" : ""}
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
