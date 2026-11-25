import * as React from "react";
import { createRoot } from "react-dom/client";
import { useReducedMotion } from "./lib/hooks";
import { SubpageShell } from "./components/SubpageShell";
import { ServicesSection } from "./components/ServicesSection";
import { ProcessSection } from "./components/ProcessSection";
import { MarkedText } from "./components/Icons";
import "./styles.css";

function ServicesPageApp() {
  const reduced = useReducedMotion();

  const handleSelectService = (category: string, serviceTitle: string) => {
    const qs = new URLSearchParams({
      service: category,
      note: `Interested in ${serviceTitle}. Here is what I am looking to build: `,
    });
    window.location.href = `./index.html?${qs.toString()}#inquiry`;
  };

  return (
    <SubpageShell
      activePage="services"
      eyebrow="SERVICES • PROCESS • STANDARDS"
      title={<MarkedText text="End-to-end *engineering*, built to ship cleanly" />}
      subtitle="Clear deliverables, direct founder collaboration, and a simple four-step process from initial discovery to production launch."
    >
      <ServicesSection
        reduced={reduced}
        onSelectService={handleSelectService}
      />
      <ProcessSection />
    </SubpageShell>
  );
}

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ServicesPageApp />
  </React.StrictMode>
);
