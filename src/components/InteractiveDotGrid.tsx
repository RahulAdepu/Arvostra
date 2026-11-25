import * as React from "react";
import { useReducedMotion } from "@/lib/hooks";

interface InteractiveDotGridProps {
  spacing?: number;
  radius?: number;
  influence?: number;
}

interface Palette {
  baseRgb: [number, number, number];
  baseAlpha: number;
  activeRgb: [number, number, number];
  activeAlpha: number;
}

const LIGHT_PALETTE: Palette = {
  baseRgb: [16, 41, 45], // #10292d deep-teal ink
  baseAlpha: 0.11,
  activeRgb: [140, 123, 51], // #8c7b33 olive-gold
  activeAlpha: 0.62,
};

const DARK_PALETTE: Palette = {
  baseRgb: [237, 241, 236], // #edf1ec warm bone ink
  baseAlpha: 0.1,
  activeRgb: [201, 180, 88], // #c9b458 brass-gold
  activeAlpha: 0.68,
};

function readCurrentPalette(): Palette {
  if (typeof document === "undefined") return LIGHT_PALETTE;
  return document.documentElement.getAttribute("data-theme") === "dark"
    ? DARK_PALETTE
    : LIGHT_PALETTE;
}

export function InteractiveDotGrid({
  spacing = 28,
  radius = 1.15,
  influence = 140,
}: InteractiveDotGridProps) {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const reduced = useReducedMotion();

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let palette = readCurrentPalette();
    let rafId = 0;

    // Smoothed pointer state (starts off-screen)
    const target = { x: -9999, y: -9999, active: 0 };
    const current = { x: -9999, y: -9999, active: 0 };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      drawFrame();
    };

    const drawFrame = () => {
      ctx.clearRect(0, 0, width, height);

      const cols = Math.ceil(width / spacing) + 1;
      const rows = Math.ceil(height / spacing) + 1;
      const offsetX = ((width - (cols - 1) * spacing) / 2) | 0;
      const offsetY = ((height - (rows - 1) * spacing) / 2) | 0;

      const [br, bg, bb] = palette.baseRgb;
      const [ar, ag, ab] = palette.activeRgb;
      const baseFill = `rgba(${br}, ${bg}, ${bb}, ${palette.baseAlpha})`;
      const infSq = influence * influence;
      const hasPointer = !reduced && current.active > 0.005;

      // Pass 1: crisp base grid (single path for maximum 60fps efficiency)
      ctx.fillStyle = baseFill;
      ctx.beginPath();
      for (let r = 0; r < rows; r++) {
        const y = offsetY + r * spacing;
        for (let c = 0; c < cols; c++) {
          const x = offsetX + c * spacing;
          if (hasPointer) {
            const dx = x - current.x;
            const dy = y - current.y;
            if (dx * dx + dy * dy < infSq) continue;
          }
          ctx.moveTo(x + radius, y);
          ctx.arc(x, y, radius, 0, Math.PI * 2);
        }
      }
      ctx.fill();

      // Pass 2: cursor-reactive neighborhood with gentle magnetic bloom
      if (!hasPointer) return;

      const minC = Math.max(0, Math.floor((current.x - influence - offsetX) / spacing));
      const maxC = Math.min(cols - 1, Math.ceil((current.x + influence - offsetX) / spacing));
      const minR = Math.max(0, Math.floor((current.y - influence - offsetY) / spacing));
      const maxR = Math.min(rows - 1, Math.ceil((current.y + influence - offsetY) / spacing));

      for (let r = minR; r <= maxR; r++) {
        const y = offsetY + r * spacing;
        for (let c = minC; c <= maxC; c++) {
          const x = offsetX + c * spacing;
          const dx = x - current.x;
          const dy = y - current.y;
          const distSq = dx * dx + dy * dy;
          if (distSq >= infSq) continue;

          const dist = Math.sqrt(distSq);
          const falloff = 1 - dist / influence;
          // Smooth cubic ease for organic optical falloff
          const weight = falloff * falloff * (3 - 2 * falloff) * current.active;

          // Subtle gentle push outward from cursor
          const push = dist > 0.5 ? weight * 5.2 : 0;
          const px = x + (dist > 0.5 ? (dx / dist) * push : 0);
          const py = y + (dist > 0.5 ? (dy / dist) * push : 0);

          const dotR = radius + weight * 1.45;
          const cr = Math.round(br + (ar - br) * weight);
          const cg = Math.round(bg + (ag - bg) * weight);
          const cb = Math.round(bb + (ab - bb) * weight);
          const alpha = palette.baseAlpha + (palette.activeAlpha - palette.baseAlpha) * weight;

          ctx.fillStyle = `rgba(${cr}, ${cg}, ${cb}, ${alpha.toFixed(3)})`;
          ctx.beginPath();
          ctx.arc(px, py, dotR, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    const tick = () => {
      rafId = 0;
      const lerp = 0.16;
      if (current.x < -5000 && target.x > -5000) {
        current.x = target.x;
        current.y = target.y;
      } else {
        current.x += (target.x - current.x) * lerp;
        current.y += (target.y - current.y) * lerp;
      }
      current.active += (target.active - current.active) * 0.14;

      drawFrame();

      const dx = Math.abs(target.x - current.x);
      const dy = Math.abs(target.y - current.y);
      const da = Math.abs(target.active - current.active);
      if (dx > 0.25 || dy > 0.25 || da > 0.004) {
        rafId = window.requestAnimationFrame(tick);
      }
    };

    const kick = () => {
      if (reduced) {
        drawFrame();
        return;
      }
      if (!rafId) rafId = window.requestAnimationFrame(tick);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      target.x = e.clientX;
      target.y = e.clientY;
      target.active = 1;
      kick();
    };

    const onPointerLeave = () => {
      target.active = 0;
      kick();
    };

    const syncPalette = () => {
      palette = readCurrentPalette();
      drawFrame();
    };

    const mo = new MutationObserver(syncPalette);
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("pointerleave", onPointerLeave, { passive: true });
    window.addEventListener("blur", onPointerLeave);
    window.addEventListener("arvostra-theme-change", syncPalette);

    resize();

    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      mo.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("blur", onPointerLeave);
      window.removeEventListener("arvostra-theme-change", syncPalette);
    };
  }, [spacing, radius, influence, reduced]);

  return (
    <canvas
      ref={canvasRef}
      className="arv-dot-grid"
      aria-hidden="true"
    />
  );
}
