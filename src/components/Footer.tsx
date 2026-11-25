import * as React from "react";
import { BRAND } from "@/lib/data";
import { ArvostraMark, Icon, ICONS } from "./Icons";
import { FooterQrCard } from "./MobileQr";

export function Footer({
  onNavigate,
  onOpenQr,
}: {
  onNavigate?: (href: string) => (e: React.MouseEvent) => void;
  onOpenQr: () => void;
}) {
  const columns = [
    {
      title: "Studio",
      links: [
        { label: "Home", href: "./index.html" },
        { label: "Live Demos", href: "./demos.html" },
        { label: "Services & Process", href: "./services.html" },
        { label: "About & FAQ", href: "./about.html" },
      ],
    },
    {
      title: "Solutions",
      links: [
        { label: "Website Templates", href: "./demos.html?category=Website%20Templates" },
        { label: "AI & Automation", href: "./demos.html?category=AI%20%26%20Automation" },
        { label: "Business Tools", href: "./demos.html?category=Business%20Tools" },
        { label: "Cloud & DevOps", href: "./services.html#services" },
      ],
    },
    {
      title: "Connect",
      links: [
        { label: "Start a Project", href: "./index.html#inquiry" },
        { label: "Report a Bug / Feedback", href: "./feedback.html" },
        { label: "LinkedIn", href: BRAND.linkedIn, external: true },
        { label: "GitHub", href: BRAND.github, external: true },
      ],
    },
  ];

  return (
    <footer className="arv-foot">
      <div className="arv-wrap">
        <div className="arv-foot-grid">
          <div className="arv-foot-brand-col">
            <a
              href="./index.html"
              className="arv-brand"
              onClick={onNavigate ? onNavigate("#top") : undefined}
              aria-label="Arvostra Home"
            >
              <ArvostraMark size={24} />
              <span>{BRAND.name}</span>
            </a>
            <p className="arv-fine" style={{ marginTop: 12, maxWidth: 280 }}>
              Minimalist Digital Studio &amp; Technology Solutions Marketplace. Built in {BRAND.location}.
            </p>
            <FooterQrCard onExpand={onOpenQr} />
          </div>

          {columns.map((col) => (
            <div key={col.title} className="arv-foot-col">
              <b>{col.title}</b>
              {col.links.map((link) =>
                link.external ? (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {link.label}
                  </a>
                ) : (
                  <a key={link.label} href={link.href}>
                    {link.label}
                  </a>
                )
              )}
            </div>
          ))}
        </div>

        <div className="arv-foot-bar">
          <div className="arv-foot-legal-links">
            <span>© {new Date().getFullYear()} {BRAND.name}</span>
            <span>Founded by {BRAND.founder}</span>
            <a href={`mailto:${BRAND.contactEmail}`}>{BRAND.contactEmail}</a>
            <span>{BRAND.domain}</span>
          </div>
          <div className="arv-social">
            <a
              href={BRAND.linkedIn}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Rahul Adepu on LinkedIn"
            >
              <Icon d={ICONS.linkedin} size={15} />
            </a>
            <a
              href={BRAND.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Rahul Adepu on GitHub"
            >
              <Icon d={ICONS.github} size={15} />
            </a>
            <a
              href={`mailto:${BRAND.contactEmail}`}
              aria-label={`Email ${BRAND.contactEmail}`}
            >
              <Icon d={ICONS.mail} size={15} />
            </a>
          </div>
        </div>

        <p className="arv-legal">
          Privacy notice: Information submitted via the project inquiry or feedback form is used exclusively to respond to your request. Interactive demo sandboxes run locally in your browser with sample data unless noted.
        </p>
      </div>

      <div className="arv-bigmark" aria-hidden="true">
        {BRAND.name.toUpperCase().split("").map((ch, i) => (
          <span key={i}>{ch}</span>
        ))}
      </div>
    </footer>
  );
}
