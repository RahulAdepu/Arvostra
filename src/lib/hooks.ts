"use client";

import * as React from "react";

export function clamp(v: number, a: number, b: number) {
  return Math.min(b, Math.max(a, v));
}

export function easeOutCubic(t: number) {
  const c = clamp(t, 0, 1);
  return 1 - Math.pow(1 - c, 3);
}

export function useReducedMotion() {
  const [reduced, setReduced] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

export function useTween(target: number[], reduced: boolean, ms = 720) {
  const [values, setValues] = React.useState(target);
  const currentRef = React.useRef(target);
  const key = target.join(",");

  React.useEffect(() => {
    const from = currentRef.current;
    if (reduced || from.length !== target.length) {
      currentRef.current = target;
      setValues(target);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const k = easeOutCubic((now - t0) / ms);
      const next = target.map((t, i) => from[i] + (t - from[i]) * k);
      currentRef.current = next;
      setValues(next);
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, reduced]);

  return values;
}

export function useSeen(
  ref: React.RefObject<Element | null>,
  margin = "0px 0px -10% 0px"
) {
  const [seen, setSeen] = React.useState(false);
  React.useEffect(() => {
    const el = ref.current;
    if (!el || seen) return;
    if (typeof IntersectionObserver === "undefined") {
      setSeen(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) setSeen(true);
      },
      { rootMargin: margin }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, seen, margin]);
  return seen;
}

export interface MarkedWord {
  word: string;
  mark: boolean;
  br: boolean;
  glue: boolean;
  tail: string;
}

export function markedWords(text: string): MarkedWord[] {
  const out: MarkedWord[] = [];
  let trail = false;
  text.split("*").forEach((part, i) => {
    const lead = /^\S/.test(part);
    part.split("\n").forEach((line, j) => {
      if (j > 0 && out.length) out[out.length - 1].br = true;
      line.split(/[ \t]+/).forEach((w, k) => {
        if (!w) return;
        if (i > 0 && j === 0 && k === 0 && lead && trail && out.length) {
          out[out.length - 1].glue = true;
        }
        out.push({ word: w, mark: i % 2 === 1, br: false, glue: false, tail: "" });
      });
    });
    if (part) trail = /\S$/.test(part);
  });
  for (let k = 0; k < out.length - 1; k++) {
    const m =
      out[k].glue && !out[k].tail
        ? out[k + 1].word.match(/^[\u2014\u2013.,:;!?]+/)
        : null;
    if (!m) continue;
    out[k].tail = m[0];
    out[k + 1].word = out[k + 1].word.slice(m[0].length);
    if (!out[k + 1].word) {
      out[k].glue = out[k + 1].glue;
      out[k].br = out[k + 1].br;
      out.splice(k + 1, 1);
    }
  }
  return out;
}

function mulberry(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function series(seed: number, n: number, vol: number, drift: number) {
  const r = mulberry(seed);
  const out = [1];
  for (let i = 1; i < n; i++) {
    out.push(out[i - 1] * (1 + drift + (r() - 0.5) * vol));
  }
  const last = out[n - 1];
  return out.map((v) => v / last);
}

export function sparkPath(values: number[], w: number, h: number, pad = 4) {
  if (values.length < 2) return { line: "", area: "" };
  const lo = Math.min(...values);
  const hi = Math.max(...values);
  const span = hi - lo || 1;
  const pts = values.map((v, i) => [
    (i / (values.length - 1)) * w,
    pad + (1 - (v - lo) / span) * (h - pad * 2),
  ]);
  const line = pts
    .map((p, i) => (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1))
    .join("");
  return { line, area: `${line}L${w} ${h}L0 ${h}Z` };
}
