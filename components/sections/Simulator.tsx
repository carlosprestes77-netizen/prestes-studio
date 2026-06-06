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
const BASE_PX = 150;

// --- Coordinate helper ---
function normToContainer(
  nx: number, ny: number, scale: number,
  img: HTMLImageElement, cW: number, cH: number,
): TattooTransform {
  const ia = img.naturalWidth / img.naturalHeight;
  const ca = cW / cH;
  let dW: number, dH: number, cx: number, cy: number;
  if (ia > ca) { dH = cH; dW = cH * ia; cx = (dW - cW) / 2; cy = 0; }
  else          { dW = cW; dH = cW / ia; cx = 0; cy = (dH - cH) / 2; }
  return {
    x: nx * dW - cx - cW / 2,
    y: ny * dH - cy - cH / 2,
    scale, rotation: 0,
  };
}

// --- Fallback: pixel centre-of-mass ---
function pixelFallback(img: HTMLImageElement, cW: number, cH: number): TattooTransform {
  const S = 128;
  const cv = document.createElement("canvas");
  cv.width = S; cv.height = S;
  const ctx = cv.getContext("2d")!;
  ctx.drawImage(img, 0, 0, S, S);
  const { data } = ctx.getImageData(0, 0, S, S);
  let sx = 0, sy = 0, n = 0, x0 = S, x1 = 0;
  for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
    const i = (y * S + x) * 4;
    const r = data[i], g = data[i+1], b = data[i+2];
    const lum = (r+g+b)/3, rng = Math.max(r,g,b)-Math.min(r,g,b);
    if (lum > 238 || lum < 18 || (lum > 200 && rng < 12)) continue;
    sx += x; sy += y; n++;
    if (x < x0) x0 = x; if (x > x1) x1 = x;
  }
  if (n < 80) return INITIAL;
  const bw = (x1 - x0) / S;
  const tgt = Math.max(90, Math.min(280, bw * cW * 0.28));
  return normToContainer(sx/n/S, sy/n/S, tgt/BASE_PX, img, cW, cH);
}

// --- TF.js detector cache (loaded once) ---
let detectorPromise: Promise<any> | null = null;
function getDetector() {
  if (detectorPromise) return detectorPromise;
  detectorPromise = (async () => {
    // Dynamic imports — only loaded when a user uploads a photo
    const tf = await import("@tensorflow/tfjs");
    try { await tf.setBackend("webgl"); } catch { await tf.setBackend("cpu"); }
    await tf.ready();
    const pd = await import("@tensorflow-models/pose-detection");
    return pd.createDetector(pd.SupportedModels.MoveNet, {
      modelType: (pd as any).movenet.modelType.SINGLEPOSE_LIGHTNING,
    });
  })();
  return detectorPromise;
}

const MIN_CONF = 0.25;
type KP = Record<string, { x: number; y: number; score: number }>;

function placementFromPose(kps: KP, img: HTMLImageElement, cW: number, cH: number): TattooTransform {
  const has = (k: string) => (kps[k]?.score ?? 0) > MIN_CONF;
  const mid = (a: string, b: string) => ({ x: (kps[a].x + kps[b].x) / 2, y: (kps[a].y + kps[b].y) / 2 });
  const W = img.naturalWidth, H = img.naturalHeight;

  // Normalize keypoints from pixel → [0,1]
  const nkp: KP = {};
  for (const [name, kp] of Object.entries(kps)) {
    nkp[name] = { x: kp.x / W, y: kp.y / H, score: kp.score };
  }
  const hn = (k: string) => (nkp[k]?.score ?? 0) > MIN_CONF;
  const mn = (a: string, b: string) => ({ x: (nkp[a].x + nkp[b].x)/2, y: (nkp[a].y + nkp[b].y)/2 });

  // Priority: lower arm → upper arm → shoulder → chest → thigh → calf
  if (hn("left_wrist") && hn("left_elbow")) {
    const p = mn("left_wrist", "left_elbow");
    return normToContainer(p.x, p.y, 0.88, img, cW, cH);
  }
  if (hn("right_wrist") && hn("right_elbow")) {
    const p = mn("right_wrist", "right_elbow");
    return normToContainer(p.x, p.y, 0.88, img, cW, cH);
  }
  if (hn("left_elbow") && hn("left_shoulder")) {
    const p = mn("left_elbow", "left_shoulder");
    return normToContainer(p.x, p.y, 1.0, img, cW, cH);
  }
  if (hn("right_elbow") && hn("right_shoulder")) {
    const p = mn("right_elbow", "right_shoulder");
    return normToContainer(p.x, p.y, 1.0, img, cW, cH);
  }
  if (hn("left_shoulder") && hn("right_shoulder")) {
    // Chest: midpoint between shoulders, slight downward shift
    const x = (nkp["left_shoulder"].x + nkp["right_shoulder"].x) / 2;
    const y = (nkp["left_shoulder"].y + nkp["right_shoulder"].y) / 2 + 0.07;
    return normToContainer(x, y, 1.5, img, cW, cH);
  }
  if (hn("left_shoulder") || hn("right_shoulder")) {
    const k = hn("left_shoulder") ? "left_shoulder" : "right_shoulder";
    return normToContainer(nkp[k].x, nkp[k].y, 1.1, img, cW, cH);
  }
  if (hn("left_hip") && hn("left_knee")) {
    const p = mn("left_hip", "left_knee");
    return normToContainer(p.x, p.y, 1.3, img, cW, cH);
  }
  if (hn("right_hip") && hn("right_knee")) {
    const p = mn("right_hip", "right_knee");
    return normToContainer(p.x, p.y, 1.3, img, cW, cH);
  }
  if (hn("left_knee") && hn("left_ankle")) {
    const p = mn("left_knee", "left_ankle");
    return normToContainer(p.x, p.y, 1.0, img, cW, cH);
  }
  if (hn("right_knee") && hn("right_ankle")) {
    const p = mn("right_knee", "right_ankle");
    return normToContainer(p.x, p.y, 1.0, img, cW, cH);
  }
  // No confident keypoints found → pixel fallback
  return pixelFallback(img, cW, cH);
}

async function detectAndPlace(
  img: HTMLImageElement,
  cW: number, cH: number,
  onStatus: (s: string) => void,
): Promise<TattooTransform> {
  try {
    onStatus("Carregando modelo…");
    const detector = await getDetector();
    onStatus("Analisando corpo…");
    const poses = await detector.estimatePoses(img);
    if (!poses.length) return pixelFallback(img, cW, cH);
    const kps: KP = {};
    for (const kp of poses[0].keypoints) {
      if (kp.name) kps[kp.name] = { x: kp.x, y: kp.y, score: kp.score ?? 0 };
    }
    return placementFromPose(kps, img, cW, cH);
  } catch (err) {
    console.warn("Pose detection failed, using fallback:", err);
    detectorPromise = null; // reset so it can retry next time
    return pixelFallback(img, cW, cH);
  }
}

// ─────────────────────────────────────────────────────────────────

export default function Simulator() {
  const [selected, setSelected] = useState<(typeof flashItems)[0] | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [xf, setXf] = useState<TattooTransform>(INITIAL);
  const [dragging, setDragging] = useState(false);
  const draggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [page, setPage] = useState(0);
  const [detectMsg, setDetectMsg] = useState<string | null>(null);
  const [userMoved, setUserMoved] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const perPage = 3;
  const totalPages = Math.ceil(flashItems.length / perPage);
  const visible = flashItems.slice(page * perPage, page * perPage + perPage);

  const runDetection = useCallback(async (img: HTMLImageElement) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    if (!rect.width) return;
    const result = await detectAndPlace(img, rect.width, rect.height, setDetectMsg);
    setXf(result);
    setDetectMsg(null);
    setUserMoved(false);
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

  const onSelect = (f: (typeof flashItems)[0]) => {
    setSelected(f);
    if (imgRef.current && photo) runDetection(imgRef.current);
    else { setXf(INITIAL); setUserMoved(false); }
    setStep(photo ? 3 : 2);
  };

  // ── drag — refs avoid stale-closure bug where first mousemove fires
  // before React re-render would update the useCallback dependency ────
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

  const stopDrag = useCallback(() => { draggingRef.current = false; setDragging(false); }, []);

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

  const showHint = selected && photo && !detectMsg && !userMoved;

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
            Selecione um flash, envie uma foto — a IA detecta o membro e encaixa automaticamente. 100% local, sem upload.
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

            {/* Manual controls */}
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

          {/* Canvas area */}
          <div className="space-y-3">
            <div
              ref={containerRef}
              className="relative bg-paper-50 border border-paper-300 overflow-hidden select-none"
              style={{ aspectRatio: "4/3", minHeight: "360px" }}
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

              {/* AI detection status */}
              <AnimatePresence>
                {detectMsg && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-paper-950/40 backdrop-blur-sm"
                  >
                    <div className="flex gap-1.5">
                      {[0,1,2].map(i => (
                        <motion.div key={i}
                          className="w-1.5 h-1.5 rounded-full bg-paper-100"
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.2 }}
                        />
                      ))}
                    </div>
                    <p className="text-paper-200 text-[10px] tracking-widest uppercase">{detectMsg}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Tattoo overlay */}
              <AnimatePresence>
                {selected && photo && !detectMsg && (
                  <motion.div
                    key="tattoo-wrapper"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="absolute inset-0 z-10 pointer-events-none"
                  >
                    <div
                      className={`absolute pointer-events-auto ${dragging ? "cursor-grabbing" : "cursor-grab"}`}
                      style={{
                        left: "50%",
                        top: "50%",
                        transform: `translate(calc(-50% + ${xf.x}px), calc(-50% + ${xf.y}px)) scale(${xf.scale}) rotate(${xf.rotation}deg)`,
                        transition: dragging ? "none" : "transform 0.35s cubic-bezier(0.22,1,0.36,1)",
                        touchAction: "none",
                      }}
                      onMouseDown={onMouseDown}
                      onTouchStart={onTouchStart}
                    >
                      <img
                        src={selected.simSrc}
                        alt={selected.name}
                        className="select-none pointer-events-none block"
                        style={{
                          width: `${BASE_PX}px`,
                          height: "auto",
                          mixBlendMode: "multiply",
                          filter: "contrast(1.1) brightness(1.02) blur(0.4px) sepia(0.1)",
                          opacity: 0.82,
                          WebkitMaskImage: "radial-gradient(ellipse 94% 94% at 50% 50%, #000 72%, transparent 100%)",
                          maskImage: "radial-gradient(ellipse 94% 94% at 50% 50%, #000 72%, transparent 100%)",
                        }}
                        draggable={false}
                      />
                      <AnimatePresence>
                        {showHint && (
                          <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ delay: 0.6 }}
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

              {/* Clear */}
              {photo && (
                <button
                  onClick={() => { setPhoto(null); imgRef.current = null; setDetectMsg(null); setStep(selected ? 2 : 1); }}
                  className="absolute top-3 right-3 z-30 p-1.5 bg-paper-50/80 border border-paper-300 text-ink-muted hover:text-ink transition-colors">
                  <X size={11} />
                </button>
              )}
            </div>

            <p className="text-[9px] text-ink-faint">
              {selected && photo && !detectMsg ? "Scroll → tamanho · Arraste → posição · Botões → rotação" : ""}
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
