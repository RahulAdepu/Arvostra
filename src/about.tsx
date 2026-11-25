import * as React from "react";
import { createRoot } from "react-dom/client";
import { useReducedMotion } from "./lib/hooks";
import { SubpageShell } from "./components/SubpageShell";
import { EditorialStatement } from "./components/EditorialStatement";
import { FounderSection } from "./components/FounderSection";
import { FaqSection } from "./components/FaqSection";
import { MarkedText } from "./components/Icons";
import "./styles.css";

function AboutPageApp() {
  const reduced = useReducedMotion();

  const onNavigate = (href: string) => (e: React.MouseEvent) => {
    if (href === "#inquiry") {
      e.preventDefault();
      window.location.href = "./index.html#inquiry";
    }
  };

  return (
    <SubpageShell
      activePage="about"
      eyebrow="STUDIO • FOUNDER • FAQ"
      title={<MarkedText text="Lean engineering, *zero* agency overhead" />}
      subtitle="Arvostra is built by Rahul Adepu in Toronto — combining web product craft, practical AI workflows, and cloud reliability."
    >
      <EditorialStatement reduced={reduced} />
      <FounderSection onNavigate={onNavigate} />
      <FaqSection onNavigate={onNavigate} />
    </SubpageShell>
  );
}

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AboutPageApp />
  </React.StrictMode>
);
