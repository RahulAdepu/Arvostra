"use client";

import * as React from "react";
import { CORE_SERVICES, INCLUDED_STANDARDS } from "@/lib/data";
import { useTween } from "@/lib/hooks";
import { Icon, ICONS, MarkedText } from "./Icons";

interface ServicesSectionProps {
  reduced: boolean;
  onSelectService: (category: string, serviceTitle: string) => void;
}

export function ServicesSection({
  reduced,
  onSelectService,
}: ServicesSectionProps) {
  const [addonOpen, setAddonOpen] = React.useState(false);
  const [featuresCount, setFeaturesCount] = React.useState(4);

  // Illustrative build timeline comparison (weeks): traditional multi-layer agency vs lean Arvostra V1
  const agencyWeeks = Math.round(featuresCount * 2.2 + 4);
  const arvostraWeeks = Math.max(1, Math.round(featuresCount * 0.75 + 0.5));
  const bars = useTween([agencyWeeks, arvostraWeeks], reduced, 550);
  const top = Math.max(agencyWeeks, arvostraWeeks, 1);

  return (
    <section className="arv-sec arv-price" id="services" data-sec="services">
      <span className="arv-price-glow" aria-hidden="true" />
      <div className="arv-wrap">
        <div className="arv-split">
          <div className="arv-label">Core Services</div>
          <div>
            <h2 className="arv-h2 arv-deep-title" data-arv-rise="">
              <MarkedText text="Four focused disciplines, *engineered end-to-end*" />
            </h2>
            <p className="arv-deep-sub" data-arv-rise="">
              From clean conversion websites and custom web applications to AI workflows and production cloud infrastructure.
            </p>
          </div>
        </div>

        <div className="arv-services-grid">
          {CORE_SERVICES.map((svc) => (
            <article
              key={svc.number}
              className="arv-service-card"
              data-arv-rise=""
            >
              <div className="arv-service-num">{svc.number}</div>
              <h3 className="arv-service-title">{svc.title}</h3>
              <p className="arv-service-desc">{svc.description}</p>
              <ul className="arv-service-deliv">
                {svc.deliverables.map((item) => (
                  <li key={item}>
                    <Icon d={ICONS.check} size={14} stroke={2.1} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                className="arv-service-cta"
                onClick={() => onSelectService(svc.inquiryCategory, svc.title)}
              >
                {svc.ctaLabel}
                <Icon d={ICONS.arrow} size={14} />
              </button>
            </article>
          ))}
        </div>

        {/* Every build includes + illustrative timeline comparison */}
        <div className="arv-split" style={{ marginTop: 84 }}>
          <div className="arv-label">Engagement Standard</div>
          <div>
            <p className="arv-price-intro" data-arv-rise="">
              Every Arvostra project — template customization or custom build — includes:
            </p>
            <ul className="arv-price-list">
              {INCLUDED_STANDARDS.map((item) => (
                <li key={item} data-arv-rise="">
                  <svg
                    className="arv-svg arv-price-check"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d={ICONS.check} />
                  </svg>
                  <span>{item}</span>
                </li>
              ))}
              <li className="arv-price-addon" data-arv-rise="">
                <button
                  type="button"
                  aria-expanded={addonOpen}
                  onClick={() => setAddonOpen((o) => !o)}
                >
                  <span className="arv-plus" data-open={addonOpen || undefined}>
                    <Icon d={ICONS.plus} size={16} />
                  </span>
                  Optional ongoing support, monitoring & feature iterations
                </button>
                <div className="arv-collapse" data-open={addonOpen || undefined}>
                  <div>
                    <p>
                      Need post-launch updates, uptime monitoring, or new AI/web features after V1 ships? Add a lightweight monthly retainer or book scoped sprint blocks only when you need them — never required.
                    </p>
                  </div>
                </div>
              </li>
            </ul>

            <div className="arv-compare" data-arv-rise="">
              <div className="arv-compare-head">
                <span>Core V1 modules in scope</span>
                <div className="arv-step">
                  <button
                    type="button"
                    onClick={() => setFeaturesCount((v) => Math.max(1, v - 1))}
                    aria-label="Fewer modules"
                  >
                    −
                  </button>
                  <output aria-live="polite">{featuresCount}</output>
                  <button
                    type="button"
                    onClick={() => setFeaturesCount((v) => Math.min(10, v + 1))}
                    aria-label="More modules"
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="arv-cbar">
                <span>Traditional agency</span>
                <i style={{ width: `${(bars[0] / top) * 100}%` }} />
                <b>~{Math.round(bars[0])} wks</b>
              </div>
              <div className="arv-cbar arv-cbar-us">
                <span>Arvostra V1 studio</span>
                <i style={{ width: `${(bars[1] / top) * 100}%` }} />
                <b>~{Math.round(bars[1])} wks</b>
              </div>
              <p className="arv-fine">
                Illustrative planning comparison: direct founder engineering with reusable foundations vs. multi-handoff agency overhead. Exact timelines are confirmed after discovery.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
