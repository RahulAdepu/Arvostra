import * as React from "react";
import { createRoot } from "react-dom/client";
import { SubpageShell } from "./components/SubpageShell";
import { FeedbackSection } from "./components/FeedbackSection";
import { MarkedText } from "./components/Icons";
import "./styles.css";

function FeedbackPageApp() {
  return (
    <SubpageShell
      activePage="feedback"
      eyebrow="FEEDBACK • BUGS • IDEAS"
      title={<MarkedText text="Spot a *bug* or have a *suggestion*?" />}
      subtitle="Report a broken link, share UX feedback, or suggest a new ready-to-deploy demo or business tool — no account required."
    >
      <FeedbackSection standalone />
    </SubpageShell>
  );
}

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <FeedbackPageApp />
  </React.StrictMode>
);
