import * as React from "react";
import { createRoot } from "react-dom/client";
import { DemoCategory, DemoItem } from "./lib/data";
import { useReducedMotion } from "./lib/hooks";
import { SubpageShell } from "./components/SubpageShell";
import { DemosMarketplace } from "./components/DemosMarketplace";
import { DemoSandboxModal } from "./components/DemoSandboxModal";
import { MarkedText } from "./components/Icons";
import "./styles.css";

const VALID_CATEGORIES: readonly DemoCategory[] = [
  "Website Templates",
  "AI & Automation",
  "Business Tools",
];

function DemosPageApp() {
  const reduced = useReducedMotion();
  const [category, setCategory] = React.useState<"All" | DemoCategory>("All");
  const [activeScene, setActiveScene] = React.useState(0);
  const [openDemo, setOpenDemo] = React.useState<DemoItem | null>(null);

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cat = params.get("category") as DemoCategory | null;
    if (cat && VALID_CATEGORIES.includes(cat)) {
      setCategory(cat);
    }
  }, []);

  React.useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const blocks = Array.from(
      document.querySelectorAll("[data-feat]")
    ) as HTMLElement[];
    if (!blocks.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveScene(
              Number((entry.target as HTMLElement).dataset.feat ?? 0)
            );
          }
        }
      },
      { rootMargin: "-42% 0px -42% 0px" }
    );
    blocks.forEach((b) => io.observe(b));
    return () => io.disconnect();
  }, []);

  const handleCustomize = (demo: DemoItem) => {
    const qs = new URLSearchParams({
      service: "Customize a Demo",
      demo: demo.name,
      note: `I'd like to customize the "${demo.name}" (${demo.category}) solution for my business.`,
    });
    window.location.href = `./index.html?${qs.toString()}#inquiry`;
  };

  return (
    <SubpageShell
      activePage="demos"
      eyebrow="LIVE DEMOS • READY TO DEPLOY"
      title={<MarkedText text="Interactive *demos* &amp; working prototypes" />}
      subtitle="Try every solution live in your browser, see how Arvostra systems ship, and request a tailored version for your business."
    >
      <DemosMarketplace
        activeCategory={category}
        onCategoryChange={setCategory}
        activeScene={activeScene}
        reduced={reduced}
        onOpenDemo={setOpenDemo}
        onCustomizeDemo={handleCustomize}
      />

      <DemoSandboxModal
        demo={openDemo}
        onClose={() => setOpenDemo(null)}
        onCustomize={handleCustomize}
      />
    </SubpageShell>
  );
}

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <DemosPageApp />
  </React.StrictMode>
);
