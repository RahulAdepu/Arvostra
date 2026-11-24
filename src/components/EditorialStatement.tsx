"use client";

import * as React from "react";
import { STUDIO_PILLARS } from "@/lib/data";
import { useSeen, useTween } from "@/lib/hooks";
import { MarkedText } from "./Icons";

function PillarTile({
  value,
  prefix = "",
  suffix = "",
  label,
  reduced,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
  reduced: boolean;
}) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const seen = useSeen(ref);
  const [animated] = useTween([seen ? value : 0], reduced, 1400);

  return (
    <div className="arv-stat" ref={ref}>
      <span className="arv-stat-rule" aria-hidden="true" />
      <b aria-label={`${prefix}${value}${suffix}`}>
        {prefix}
        {Math.round(animated)}
        {suffix}
      </b>
      <span>{label}</span>
    </div>
  );
}

export function EditorialStatement({ reduced }: { reduced: boolean }) {
  return (
    <section className="arv-sec arv-benefits" id="overview" data-sec="overview">
      <div className="arv-wrap arv-split">
        <div className="arv-label">Studio Philosophy</div>
        <div>
          <p className="arv-benefits-text">
            <MarkedText
              text="Software delivery shouldn't require bloated retainers or brittle templates. *Arvostra* designs, automates, and deploys practical web products, AI workflows, and cloud systems built to last."
              wordClass="arv-bword"
            />
          </p>
          <div className="arv-stats">
            {STUDIO_PILLARS.map((item) => (
              <PillarTile
                key={item.label}
                value={item.value}
                prefix={item.prefix}
                suffix={item.suffix}
                label={item.label}
                reduced={reduced}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
