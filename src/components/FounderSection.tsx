"use client";

import * as React from "react";
import { BRAND, FOUNDER_SKILLS } from "@/lib/data";
import { Icon, ICONS, MarkedText } from "./Icons";

function PrecisionDial() {
  const ticks = Array.from({ length: 72 }, (_, i) => i);
  return (
    <svg
      className="arv-svg arv-dial"
      viewBox="0 0 320 320"
      width="320"
      height="320"
      aria-hidden="true"
    >
      <circle
        cx="160"
        cy="160"
        r="152"
        fill="none"
        stroke="var(--arv-deep-muted)"
        strokeOpacity="0.35"
      />
      <g className="arv-dial-ticks">
        {ticks.map((i) => {
          const a = (i / ticks.length) * Math.PI * 2;
          const long = i % 6 === 0;
          const r1 = long ? 128 : 136;
          return (
            <line
              key={i}
              x1={160 + Math.cos(a) * r1}
              y1={160 + Math.sin(a) * r1}
              x2={160 + Math.cos(a) * 146}
              y2={160 + Math.sin(a) * 146}
              stroke="var(--arv-deep-ink)"
              strokeOpacity={long ? 0.7 : 0.3}
              strokeWidth={long ? 1.6 : 1}
            />
          );
        })}
      </g>
      <g className="arv-dial-ring">
        <circle
          cx="160"
          cy="160"
          r="112"
          fill="none"
          stroke="var(--arv-deep-muted)"
          strokeOpacity="0.4"
          strokeDasharray="2 6"
        />
        <circle cx="160" cy="48" r="5" fill="var(--arv-gold)" />
        <circle cx="272" cy="160" r="3" fill="var(--arv-deep-ink)" />
      </g>
      <circle
        cx="160"
        cy="160"
        r="88"
        fill="none"
        stroke="var(--arv-deep-muted)"
        strokeOpacity="0.3"
      />
      <circle cx="160" cy="160" r="66" fill="var(--arv-lilac)" />
      <circle
        cx="160"
        cy="160"
        r="44"
        fill="var(--arv-deep)"
        fillOpacity="0.12"
      />
      <g
        transform="translate(136 136)"
        fill="none"
        stroke="var(--arv-lilac-ink)"
        strokeWidth="2.1"
        strokeLinejoin="round"
        strokeLinecap="round"
      >
        <path d="M8 38L20 10h8l12 28M13.5 27h21" />
        <circle cx="24" cy="36" r="2.8" fill="var(--arv-gold)" stroke="none" />
      </g>
    </svg>
  );
}

export function FounderSection({
  onNavigate,
}: {
  onNavigate: (href: string) => (e: React.MouseEvent) => void;
}) {
  return (
    <section className="arv-sec arv-op-sec" id="about" data-sec="about">
      <div className="arv-wrap">
        <div className="arv-op">
          <div className="arv-op-copy">
            <div className="arv-label">Founder & Technical Builder</div>
            <h2 className="arv-h2">
              <MarkedText text="Built by *Rahul Adepu* — practical engineering over agency noise" />
            </h2>
            <p>
              Arvostra is founded and led by Rahul Adepu, a Toronto-based Cloud, DevOps, and full-stack software builder focused on reliable systems, clean product interfaces, and practical AI automation.
            </p>
            <p>
              With production experience in cloud infrastructure, observability, CI/CD, and modern web engineering, every Arvostra build prioritizes speed, maintainability, and clear business outcomes — without bloated overhead.
            </p>
            <div className="arv-skill-tags" aria-label="Core technical stack">
              {FOUNDER_SKILLS.map((skill) => (
                <span key={skill}>{skill}</span>
              ))}
            </div>
            <div className="arv-founder-links">
              <a
                className="arv-link-arrow"
                href="./index.html#inquiry"
                onClick={onNavigate("#inquiry")}
              >
                Work directly with Rahul
                <Icon d={ICONS.arrow} size={15} />
              </a>
              <a
                className="arv-link-arrow"
                href={BRAND.linkedIn}
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn
                <Icon d={ICONS.arrowUpRight} size={14} />
              </a>
              <a
                className="arv-link-arrow"
                href={BRAND.github}
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
                <Icon d={ICONS.arrowUpRight} size={14} />
              </a>
            </div>
          </div>
          <div className="arv-op-art">
            <PrecisionDial />
          </div>
        </div>
      </div>
    </section>
  );
}
