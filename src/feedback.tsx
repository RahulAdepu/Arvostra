import * as React from "react";
import { createRoot } from "react-dom/client";
import { BRAND } from "./lib/data";
import { ArvostraMark, Icon, ICONS } from "./components/Icons";
import { FeedbackSection } from "./components/FeedbackSection";
import { InteractiveDotGrid } from "./components/InteractiveDotGrid";
import { ThemeToggle } from "./components/ThemeToggle";
import "./styles.css";

function FeedbackPageApp() {
  return (
    <div className="arv-root arv-subpage">
      <InteractiveDotGrid />
      <header className="arv-404-nav arv-page-layer">
        <div className="arv-wrap arv-404-nav-in">
          <a href="./index.html" className="arv-brand" aria-label="Arvostra Home">
            <ArvostraMark size={24} />
            <span>{BRAND.name}</span>
          </a>
          <div className="arv-row">
            <ThemeToggle />
            <a href="./index.html" className="arv-btn arv-btn-ghost arv-btn-sm">
              ← Back to Arvostra
            </a>
          </div>
        </div>
      </header>

      <main className="arv-subpage-main arv-page-layer">
        <FeedbackSection standalone />
      </main>

      <footer className="arv-subpage-foot arv-page-layer">
        <div className="arv-wrap arv-subpage-foot-in">
          <span>
            © {new Date().getFullYear()} {BRAND.name} · Founded by{" "}
            {BRAND.founder}
          </span>
          <div className="arv-row" style={{ gap: 16 }}>
            <a href="./index.html#demos" className="arv-link">
              Live Demos
            </a>
            <a href="./index.html#inquiry" className="arv-link">
              Start a Project
            </a>
            <a href={`mailto:${BRAND.contactEmail}`} className="arv-link">
              {BRAND.contactEmail}
              <Icon
                d={ICONS.arrowUpRight}
                size={12}
                className="arv-inline-ic"
              />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <FeedbackPageApp />
  </React.StrictMode>
);
