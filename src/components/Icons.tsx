import * as React from "react";
import { markedWords } from "@/lib/hooks";

export function Icon({
  d,
  size = 16,
  stroke = 1.6,
  className = "",
}: {
  d: string;
  size?: number;
  stroke?: number;
  className?: string;
}) {
  return (
    <svg
      className={`arv-svg ${className}`.trim()}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={d} />
    </svg>
  );
}

export const ICONS = {
  check: "M5 12.5l4.2 4.2L19 7",
  plus: "M12 5v14M5 12h14",
  arrow: "M5 12h14M13 6l6 6-6 6",
  arrowUpRight: "M7 17L17 7M9 7h8v8",
  down: "M6 9l6 6 6-6",
  close: "M6 6l12 12M18 6L6 18",
  menu: "M4 7h16M4 12h16M4 17h16",
  grid: "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z",
  layers: "M12 3l9 4.5-9 4.5-9-4.5L12 3zM3 12l9 4.5 9-4.5M3 16.5L12 21l9-4.5",
  spark: "M12 3l2.2 6.8L21 12l-6.8 2.2L12 21l-2.2-6.8L3 12l6.8-2.2z",
  cloud: "M6.5 19h11a4 4 0 00.8-7.9A5.5 5.5 0 007.2 9.4 3.5 3.5 0 006.5 19z",
  shield: "M12 3l7 3v6c0 4.4-3 7.7-7 9-4-1.3-7-4.6-7-9V6zM9 12l2 2 4-4",
  compass: "M12 21a9 9 0 100-18 9 9 0 000 18zM15.5 8.5l-2.2 5.2-5.3 2.3 2.2-5.2z",
  terminal: "M4 6h16v12H4zM8 10l2.5 2L8 14M13 14h3",
  rocket: "M5 19l4-1 9-9a4.5 4.5 0 00-6-6l-9 9-1 4 3 3zM14 6l4 4",
  play: "M8 5l11 7-11 7V5z",
  sliders: "M4 6h16M4 12h16M4 18h16M9 4v4M15 10v4M10 16v4",
  copy: "M9 9h10v10H9zM5 15H4a1 1 0 01-1-1V4a1 1 0 011-1h10a1 1 0 011 1v1",
  mail: "M4 6h16v12H4zM4 7l8 6 8-6",
  linkedin: "M7 10v7M7 7v.01M11 17v-7M11 13a3 3 0 016 0v4",
  github:
    "M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 00-1.3-3.2 4.2 4.2 0 00-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 00-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 00-.1 3.2A4.6 4.6 0 004 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21",
  list: "M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01",
};

/** Custom geometric Arvostra monogram mark */
export function ArvostraMark({ size = 24 }: { size?: number }) {
  return (
    <svg
      className="arv-svg"
      width={size}
      height={size}
      viewBox="0 0 32 32"
      aria-hidden="true"
    >
      <rect x="1.5" y="1.5" width="29" height="29" rx="8" fill="var(--arv-accent)" />
      <path
        d="M8.5 23L14.4 9h3.2L23.5 23h-3.6l-1.3-3.3h-5.2L12.1 23H8.5zm5.9-6.2h3.2L16 12.6l-1.6 4.2z"
        fill="var(--arv-page)"
      />
      <circle cx="16" cy="22.4" r="1.7" fill="var(--arv-gold)" />
    </svg>
  );
}

export function MarkedText({
  text,
  wordClass,
}: {
  text: string;
  wordClass?: string;
}) {
  const words = markedWords(text);
  return (
    <>
      {words.map((w, i) => (
        <React.Fragment key={i}>
          <span
            className={`${wordClass ?? ""}${w.mark ? " arv-gold" : ""}`.trim()}
          >
            {w.word}
          </span>
          {w.tail ? <span className={wordClass}>{w.tail}</span> : null}
          {w.br ? <br /> : w.glue || i === words.length - 1 ? null : " "}
        </React.Fragment>
      ))}
    </>
  );
}
