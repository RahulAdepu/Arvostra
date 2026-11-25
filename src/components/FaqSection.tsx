"use client";

import * as React from "react";
import { BRAND, FAQ_ITEMS } from "@/lib/data";
import { Icon, ICONS, MarkedText } from "./Icons";

export function FaqSection({
  onNavigate,
}: {
  onNavigate: (href: string) => (e: React.MouseEvent) => void;
}) {
  const [openIndex, setOpenIndex] = React.useState<number>(0);

  return (
    <section className="arv-sec arv-faq" id="faq" data-sec="faq">
      <div className="arv-wrap arv-split">
        <div className="arv-label">FAQ</div>
        <div>
          <h2 className="arv-h2 arv-faq-title" data-arv-rise="">
            <MarkedText text={"Clear answers before\nwe *start building*"} />
          </h2>
          <ul className="arv-faq-list">
            {FAQ_ITEMS.map((item, idx) => {
              const isOpen = openIndex === idx;
              return (
                <li key={item.q} data-arv-rise="">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                  >
                    <span>{item.q}</span>
                    <span className="arv-plus" data-open={isOpen || undefined}>
                      <Icon d={ICONS.plus} size={16} />
                    </span>
                  </button>
                  <div className="arv-collapse" data-open={isOpen || undefined}>
                    <div>
                      <p>{item.a}</p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
          <p className="arv-fine arv-faq-more">
            Have a specific technical question?{" "}
            <a href="./index.html#inquiry" onClick={onNavigate("#inquiry")}>
              Send a quick project brief
            </a>{" "}
            or email{" "}
            <a href={`mailto:${BRAND.contactEmail}`}>{BRAND.contactEmail}</a>.
          </p>
        </div>
      </div>
    </section>
  );
}
