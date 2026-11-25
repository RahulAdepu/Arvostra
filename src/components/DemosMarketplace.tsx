"use client";

import * as React from "react";
import {
  DemoCategory,
  DemoItem,
  DEMOS,
  STICKY_SCENES,
} from "@/lib/data";
import { useTween } from "@/lib/hooks";
import { Icon, ICONS, MarkedText } from "./Icons";

interface DemosMarketplaceProps {
  activeCategory: "All" | DemoCategory;
  onCategoryChange: (cat: "All" | DemoCategory) => void;
  activeScene: number;
  reduced: boolean;
  onOpenDemo: (demo: DemoItem) => void;
  onCustomizeDemo: (demo: DemoItem) => void;
}

/* --- Sticky Stage Scene 1: Launch Setup Checklist --- */
const LAUNCH_CHECKS = [
  "Responsive UI & semantic HTML",
  "SEO metadata, sitemap & OpenGraph",
  "Validated inquiry & lead workflows",
  "SSL, DNS & CI/CD edge deployment",
];

function SceneLaunch({ active, reduced }: { active: boolean; reduced: boolean }) {
  const [done, setDone] = React.useState(reduced ? LAUNCH_CHECKS.length : 0);
  const [run, setRun] = React.useState(0);
  const [disabledIdx, setDisabledIdx] = React.useState<number[]>([]);

  React.useEffect(() => {
    if (!active) return;
    if (reduced) {
      setDone(LAUNCH_CHECKS.length);
      return;
    }
    setDone(0);
    setDisabledIdx([]);
    const timers = LAUNCH_CHECKS.map((_, i) =>
      setTimeout(() => setDone(i + 1), 420 + i * 480)
    );
    return () => timers.forEach(clearTimeout);
  }, [active, run, reduced]);

  const ready = LAUNCH_CHECKS.filter(
    (_, i) => i < done && !disabledIdx.includes(i)
  ).length;

  return (
    <div className="arv-scene arv-scene-setup">
      <div className="arv-setup-card">
        <div className="arv-setup-head">
          <span>
            <b>V1 Release Checklist</b>
            <small>arvostra.com production pipeline</small>
          </span>
          <button
            type="button"
            className="arv-btn arv-btn-dark arv-btn-sm"
            onClick={() => setRun((r) => r + 1)}
          >
            Replay <Icon d={ICONS.play} size={12} />
          </button>
        </div>
        <ul className="arv-setup-list">
          {LAUNCH_CHECKS.map((item, i) => {
            const on = i < done && !disabledIdx.includes(i);
            return (
              <li key={item}>
                <button
                  type="button"
                  data-on={on || undefined}
                  data-last={i === LAUNCH_CHECKS.length - 1 || undefined}
                  onClick={() =>
                    i < done
                      ? setDisabledIdx((prev) =>
                          prev.includes(i)
                            ? prev.filter((x) => x !== i)
                            : [...prev, i]
                        )
                      : setDone(i + 1)
                  }
                >
                  <span className="arv-setup-ic">
                    <Icon
                      d={[ICONS.layers, ICONS.compass, ICONS.spark, ICONS.cloud][i % 4]}
                      size={15}
                    />
                  </span>
                  {item}
                  <span className="arv-tick">
                    <Icon d={ICONS.check} size={13} stroke={2.4} />
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
        <div className="arv-setup-foot">
          <span>
            {ready} of {LAUNCH_CHECKS.length} verified
          </span>
          <span className="arv-meter">
            <i style={{ width: `${(ready / LAUNCH_CHECKS.length) * 100}%` }} />
          </span>
          <span>{ready === LAUNCH_CHECKS.length ? "Ready" : "…"}</span>
        </div>
      </div>
    </div>
  );
}

/* --- Sticky Stage Scene 2: Mobile AI Workflow Phone --- */
function SceneAutomation({ active }: { active: boolean }) {
  const [sheetOpen, setSheetOpen] = React.useState(false);
  const [threshold, setThreshold] = React.useState(85);
  const [state, setState] = React.useState<"idle" | "running" | "done">("idle");

  React.useEffect(() => {
    if (!active) setSheetOpen(false);
  }, [active]);

  const runTest = () => {
    setState("running");
    setTimeout(() => setState("done"), 750);
  };

  return (
    <div className="arv-scene arv-scene-phone">
      <span className="arv-bokeh" aria-hidden="true" />
      <div className="arv-chipfloat arv-chipfloat-a" aria-hidden="true">
        <Icon d={ICONS.check} size={12} stroke={2.4} /> Lead parsed · Priority A
      </div>
      <div className="arv-chipfloat arv-chipfloat-b" aria-hidden="true">
        Webhook synced · 340ms
      </div>
      <div className="arv-phone">
        <div className="arv-phone-screen">
          <div className="arv-phone-status">
            <span>9:41</span>
            <i />
          </div>
          <div className="arv-phone-k">AI Intake Queue</div>
          <div className="arv-phone-bal">Active</div>
          <svg
            className="arv-svg arv-phone-chart"
            viewBox="0 0 180 48"
            width="180"
            height="48"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              d="M0 38 C24 34 36 24 54 26 S82 14 102 18 134 8 152 10 168 5 180 6"
              fill="none"
              stroke="var(--arv-gold)"
              strokeWidth="1.8"
            />
          </svg>
          <div className="arv-phone-card">
            <span>Auto-triage confidence</span>
            <b>{threshold}% threshold</b>
          </div>
          <button
            type="button"
            className="arv-phone-btn"
            onClick={() => setSheetOpen(true)}
          >
            {state === "done" ? "Workflow triggered ✓" : "Test AI routing rule"}
          </button>

          <div className="arv-phone-sheet" data-open={sheetOpen || undefined}>
            <div className="arv-phone-grip" />
            {state === "done" ? (
              <div className="arv-phone-sent">
                <span className="arv-done-ic">
                  <Icon d={ICONS.check} size={15} stroke={2.4} />
                </span>
                <b>Route verified</b>
                <small>Confidence ≥ {threshold}% auto-drafts reply</small>
                <button
                  type="button"
                  onClick={() => {
                    setSheetOpen(false);
                    setState("idle");
                  }}
                >
                  Done
                </button>
              </div>
            ) : (
              <>
                <b>Confidence guardrail</b>
                <div className="arv-phone-amt">{threshold}%</div>
                <input
                  type="range"
                  min={60}
                  max={98}
                  value={threshold}
                  onChange={(e) => setThreshold(+e.target.value)}
                  aria-label="Confidence threshold percentage"
                  className="arv-range"
                  style={
                    {
                      "--arv-fill": `${((threshold - 60) / 38) * 100}%`,
                    } as React.CSSProperties
                  }
                  tabIndex={sheetOpen ? 0 : -1}
                />
                <button
                  type="button"
                  onClick={runTest}
                  disabled={state === "running"}
                  tabIndex={sheetOpen ? 0 : -1}
                >
                  {state === "running" ? "Running…" : "Run test trigger"}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* --- Sticky Stage Scene 3: Cloud & Observability --- */
function SceneCloud({
  active,
  reduced,
}: {
  active: boolean;
  reduced: boolean;
}) {
  const [mode, setMode] = React.useState<"infra" | "perf">("infra");
  const items =
    mode === "infra"
      ? [
          { name: "Edge CDN", value: "Global", pct: 48 },
          { name: "Serverless API", value: "Isolated", pct: 32 },
          { name: "DNS & SSL", value: "Managed", pct: 20 },
        ]
      : [
          { name: "HTML / CSS", value: "Static", pct: 38 },
          { name: "Interactive JS", value: "Chunked", pct: 42 },
          { name: "Assets / SVG", value: "Inline", pct: 20 },
        ];

  const widths = useTween(
    items.map((x) => (active ? x.pct : 0)),
    reduced,
    850
  );
  const colors = ["var(--arv-accent)", "var(--arv-gold)", "var(--arv-chart-c)"];

  return (
    <div className="arv-scene arv-scene-report">
      <div className="arv-rep-card arv-rep-back" aria-hidden="true" />
      <div className="arv-rep-card">
        <div className="arv-rep-head">
          <b>System Architecture</b>
          <div className="arv-seg" role="tablist" aria-label="View layer">
            <button
              type="button"
              role="tab"
              aria-selected={mode === "infra"}
              onClick={() => setMode("infra")}
            >
              Cloud
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === "perf"}
              onClick={() => setMode("perf")}
            >
              Bundle
            </button>
          </div>
        </div>
        <div className="arv-k">Deployment posture</div>
        <div className="arv-rep-total">
          {mode === "infra" ? "Zero-Downtime" : "Lean V1 Core"}
        </div>
        <div className="arv-rep-row">
          {items.map((p, i) => (
            <div key={p.name}>
              <span>
                <i style={{ background: colors[i] }} />
                {p.name}
              </span>
              <b>{p.value}</b>
            </div>
          ))}
        </div>
        <div className="arv-break-head">
          <b>Resource profile</b>
          <span>
            {mode === "infra"
              ? "Minimal serverless footprint"
              : "Optimized client payload"}
          </span>
        </div>
        <div className="arv-bar arv-bar-lg">
          {items.map((p, i) => (
            <span
              key={p.name}
              style={{ width: `${widths[i]}%`, background: colors[i] }}
            />
          ))}
        </div>
        <div className="arv-legend">
          {items.map((p, i) => (
            <span key={p.name}>
              <i style={{ background: colors[i] }} />
              {p.pct}% {p.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function StageScene({
  index,
  active,
  reduced,
}: {
  index: number;
  active: boolean;
  reduced: boolean;
}) {
  if (index === 0) return <SceneLaunch active={active} reduced={reduced} />;
  if (index === 1) return <SceneAutomation active={active} />;
  return <SceneCloud active={active} reduced={reduced} />;
}

/* --- Custom Architectural Card Thumbnails (Zero broken images!) --- */
export function DemoThumbnail({ art }: { art: DemoItem["art"] }) {
  if (art === "salon") {
    return (
      <div className="arv-art arv-art-dash" aria-hidden="true">
        <div className="arv-art-win">
          <i />
          <i />
          <i />
          <span className="arv-art-side" />
          <b>Local Studio</b>
          <span className="arv-art-bars">
            <em style={{ width: "44%" }} />
            <em style={{ width: "34%" }} />
            <em style={{ width: "22%" }} />
          </span>
          <span className="arv-art-rows" />
        </div>
      </div>
    );
  }
  if (art === "calculator") {
    return (
      <div className="arv-art arv-art-calc" aria-hidden="true">
        <div className="arv-art-calc-grid">
          <div className="arv-art-calc-head">
            <span>SHIFT TOTAL</span>
            <b>$1,420</b>
          </div>
          <div className="arv-art-calc-keys">
            {["$2", "$5", "$10", "$20", "$50", "CSV"].map((k, i) => (
              <span key={k} data-hi={i === 5 || undefined}>
                {k}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }
  if (art === "ai-triage" || art === "workflow") {
    return (
      <div className="arv-art arv-art-flow" aria-hidden="true">
        <div className="arv-art-nodes">
          <span className="arv-art-node">Input</span>
          <span className="arv-art-line" />
          <span className="arv-art-node arv-art-node-gold">AI Parse</span>
          <span className="arv-art-line" />
          <span className="arv-art-node">Action</span>
        </div>
      </div>
    );
  }
  return (
    <div className="arv-art arv-art-chart" aria-hidden="true">
      <svg
        className="arv-svg"
        viewBox="0 0 240 120"
        width="240"
        height="120"
        preserveAspectRatio="none"
      >
        {[24, 52, 80, 108].map((y) => (
          <line key={y} x1="0" x2="240" y1={y} y2={y} stroke="var(--arv-rule)" />
        ))}
        <path
          d="M0 96 C38 88 64 72 98 68 S154 40 190 36 222 18 240 14"
          fill="none"
          stroke="var(--arv-gold)"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M0 106 C42 98 78 90 118 82 S172 64 206 58 228 46 240 42"
          fill="none"
          stroke="var(--arv-ink)"
          strokeOpacity="0.45"
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}

const CATEGORIES: ("All" | DemoCategory)[] = [
  "All",
  "Website Templates",
  "AI & Automation",
  "Business Tools",
];

export function DemosMarketplace({
  activeCategory,
  onCategoryChange,
  activeScene,
  reduced,
  onOpenDemo,
  onCustomizeDemo,
}: DemosMarketplaceProps) {
  const filteredDemos = DEMOS.filter(
    (d) => activeCategory === "All" || d.category === activeCategory
  );

  return (
    <>
      {/* Live Demos & Marketplace Catalog */}
      <section className="arv-sec arv-demos" id="demos" data-sec="demos">
        <div className="arv-wrap">
          <div className="arv-demos-head">
            <div>
              <div className="arv-label" style={{ marginBottom: 16 }}>
                Live Demos & Marketplace
              </div>
              <h2 className="arv-h2" data-arv-rise="">
                <MarkedText text="Built & *Ready to Deploy*." />
              </h2>
              <p className="arv-sec-sub" data-arv-rise="" style={{ marginTop: 14 }}>
                Explore working solutions, test interactive demos, and discover digital products that can be customized for your business.
              </p>
            </div>

            <div
              className="arv-cat-tabs"
              role="tablist"
              aria-label="Filter demos by category"
              data-arv-rise=""
            >
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  role="tab"
                  aria-selected={activeCategory === cat}
                  onClick={() => onCategoryChange(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {filteredDemos.length === 0 ? (
            <div className="arv-empty-state">
              <p>No demos in this category yet. Request a custom prototype below.</p>
            </div>
          ) : (
            <div className="arv-demo-grid">
              {filteredDemos.map((demo) => (
                <article key={demo.id} className="arv-demo-card" data-arv-rise="">
                  <div className="arv-demo-thumb">
                    <DemoThumbnail art={demo.art} />
                    <span className="arv-demo-cat">{demo.category}</span>
                    {demo.badge ? (
                      <span className="arv-demo-badge">{demo.badge}</span>
                    ) : null}
                  </div>
                  <div className="arv-demo-body">
                    <h3 className="arv-h3">{demo.name}</h3>
                    <p className="arv-demo-desc">{demo.shortDescription}</p>
                    <ul className="arv-demo-feats">
                      {demo.features.map((feat) => (
                        <li key={feat}>
                          <Icon d={ICONS.check} size={13} stroke={2.2} />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="arv-demo-meta">
                      <span className="arv-demo-price">{demo.pricing}</span>
                    </div>
                    <div className="arv-demo-actions">
                      <button
                        type="button"
                        className="arv-btn arv-btn-dark arv-btn-sm"
                        onClick={() => onOpenDemo(demo)}
                      >
                        <Icon d={ICONS.play} size={12} />
                        Live Demo
                      </button>
                      <button
                        type="button"
                        className="arv-btn arv-btn-ghost arv-btn-sm"
                        onClick={() => onCustomizeDemo(demo)}
                      >
                        Customize Similar
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          <p className="arv-fine" style={{ marginTop: 22 }}>
            Demo architecture: <code>arvostra.com</code> serves the main studio showcase, with interactive previews embedded above and standalone apps hosted cleanly on isolated subdomains (e.g., <code>demos.arvostra.com</code>).
          </p>
        </div>
      </section>

      {/* Sticky Unfolding Capabilities Stage (Signature Reference Pattern) */}
      <section className="arv-sec arv-feats" data-sec="capabilities">
        <div className="arv-wrap">
          <div className="arv-label arv-feat-label">How Systems Ship</div>
          <div className="arv-feat-grid">
            <div className="arv-stage-col">
              <div className="arv-stage" data-scene={activeScene % 3}>
                {STICKY_SCENES.map((_, i) => (
                  <div
                    key={i}
                    className="arv-stage-layer"
                    data-on={activeScene === i || undefined}
                    aria-hidden={activeScene !== i}
                  >
                    <StageScene
                      index={i}
                      active={activeScene === i}
                      reduced={reduced}
                    />
                  </div>
                ))}
                <div className="arv-stage-count" aria-hidden="true">
                  <b>{String(activeScene + 1).padStart(2, "0")}</b> /{" "}
                  {String(STICKY_SCENES.length).padStart(2, "0")}
                </div>
              </div>
            </div>

            <div className="arv-feat-copy">
              {STICKY_SCENES.map((scene, i) => (
                <article
                  key={scene.title}
                  className="arv-feat"
                  data-feat={i}
                  data-on={activeScene === i || undefined}
                >
                  <div className="arv-feat-inline">
                    <StageScene
                      index={i}
                      active={activeScene === i}
                      reduced={reduced}
                    />
                  </div>
                  <span className="arv-feat-n">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="arv-h3 arv-feat-title">{scene.title}</h3>
                  <p>{scene.text}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
