import * as React from "react";
import { BRAND } from "@/lib/data";
import { ArvostraMark, Icon, ICONS } from "./Icons";

export function Footer({
  onNavigate,
}: {
  onNavigate: (href: string) => (e: React.MouseEvent) => void;
}) {
  const columns = [
    {
      title: "Studio",
      links: [
        { label: "Overview", href: "#overview" },
        { label: "Live Demos", href: "#demos" },
        { label: "Core Services", href: "#services" },
        { label: "How It Works", href: "#process" },
      ],
    },
    {
      title: "Solutions",
      links: [
        { label: "Website Templates", href: "#demos" },
        { label: "AI & Automation", href: "#demos" },
        { label: "Business Tools", href: "#demos" },
        { label: "Cloud & DevOps", href: "#services" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "Founder / About", href: "#about" },
        { label: "FAQ", href: "#faq" },
        { label: "Start a Project", href: "#inquiry" },
        { label: "Report a Bug / Feedback", href: "./feedback.html" },
      ],
    },
  ];

  return (
    <footer className="arv-foot">
      <div className="arv-wrap">
        <div className="arv-foot-grid">
          <div className="arv-foot-brand-col">
            <a
              href="#top"
              className="arv-brand"
              onClick={onNavigate("#top")}
              aria-label="Back to top"
            >
              <ArvostraMark size={24} />
              <span>{BRAND.name}</span>
            </a>
            <p className="arv-fine" style={{ marginTop: 12, maxWidth: 280 }}>
              Minimalist Digital Studio & Technology Solutions Marketplace. Built in {BRAND.location}.
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.title} className="arv-foot-col">
              <b>{col.title}</b>
              {col.links.map((link) =>
                link.href.startsWith("#") ? (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={onNavigate(link.href)}
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
          Privacy notice: Information submitted via the project inquiry form is used exclusively to respond to your request and scope potential work. Interactive demo sandboxes run locally in your browser with sample data unless explicitly noted.
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
