"use client";

import * as React from "react";
import { BRAND, DemoSandboxId } from "@/lib/data";
import { series, sparkPath, useTween } from "@/lib/hooks";
import { ArvostraMark, Icon, ICONS } from "./Icons";

type ConsoleTab = "overview" | "scoper" | "modules";

interface HeroWorkspaceProps {
  reduced: boolean;
  onOpenSandbox: (sandboxId: DemoSandboxId) => void;
  onPrefillInquiry: (opts: {
    serviceCategory: string;
    description?: string;
    selectedDemo?: string;
  }) => void;
}

const METRIC_VIEWS = [
  {
    label: "Web",
    seed: 17,
    vol: 0.018,
    drift: 0.004,
    metric: "0.4s LCP",
    delta: "Static + Edge CDN",
    headline: "Fast, accessible marketing & product interfaces",
  },
  {
    label: "AI",
    seed: 31,
    vol: 0.032,
    drift: 0.008,
    metric: "< 1.2s",
    delta: "Structured JSON pipelines",
    headline: "Lead triage, extraction & workflow assistants",
  },
  {
    label: "Cloud",
    seed: 47,
    vol: 0.014,
    drift: 0.003,
    metric: "99.9%",
    delta: "Automated CI/CD & SSL",
    headline: "Zero-downtime deployment & observability",
  },
];

const SERIES_CACHE = METRIC_VIEWS.map((v) => series(v.seed, 32, v.vol, v.drift));

const WORKSPACE_TRACKS = [
  {
    id: "web",
    name: "Web & Product",
    kind: "Next.js · TypeScript · Tailwind",
    sandboxId: "salon-template" as DemoSandboxId,
    share: 42,
    tag: "Live template",
  },
  {
    id: "ai",
    name: "AI Workflows",
    kind: "Assistants · Intake · APIs",
    sandboxId: "ai-lead-triage" as DemoSandboxId,
    share: 33,
    tag: "Interactive sandbox",
  },
  {
    id: "tools",
    name: "Business Tools",
    kind: "Calculators · Dashboards",
    sandboxId: "shift-calculator" as DemoSandboxId,
    share: 25,
    tag: "Working utility",
  },
];

const SCOPE_PRESETS = [
  {
    id: "site",
    label: "Business Website / Landing Page",
    category: "Website / Landing Page",
    stack: "Next.js · Tailwind · SEO · Vercel",
    timeline: "1–2 weeks",
    effort: 35,
  },
  {
    id: "app",
    label: "Custom Web Application",
    category: "Custom Web Application",
    stack: "Next.js · TypeScript · Serverless APIs",
    timeline: "3–6 weeks",
    effort: 72,
  },
  {
    id: "ai",
    label: "AI Assistant & Automation",
    category: "AI Integration",
    stack: "LLM APIs · Structured Pipelines · Webhooks",
    timeline: "2–4 weeks",
    effort: 58,
  },
  {
    id: "cloud",
    label: "Cloud & DevOps Setup",
    category: "Cloud / DevOps",
    stack: "AWS · Docker · CI/CD · DNS & Monitoring",
    timeline: "1–3 weeks",
    effort: 48,
  },
];

const SCOPE_ADDONS = [
  { id: "seo", label: "Technical SEO & Sitemap", bonus: 8 },
  { id: "ai-intake", label: "AI Lead Triage Form", bonus: 14 },
  { id: "analytics", label: "Privacy-First Analytics", bonus: 6 },
  { id: "ci", label: "Automated CI/CD & Staging", bonus: 10 },
];

const MODULE_FEED = [
  {
    id: "m1",
    tag: "Template",
    name: "Local Service & Salon Studio",
    stack: "React · Tailwind · Filterable Menu",
    status: "Ready",
    sandboxId: "salon-template" as DemoSandboxId,
    filter: "web",
  },
  {
    id: "m2",
    tag: "Tool",
    name: "Retail Shift & Inventory Calculator",
    stack: "Offline-First · CSV Export · Mobile Keypad",
    status: "Live",
    sandboxId: "shift-calculator" as DemoSandboxId,
    filter: "tools",
  },
  {
    id: "m3",
    tag: "AI",
    name: "AI Lead & Document Triage",
    stack: "Structured Extraction · Priority Routing",
    status: "Sandbox",
    sandboxId: "ai-lead-triage" as DemoSandboxId,
    filter: "ai",
  },
  {
    id: "m4",
    tag: "Tool",
    name: "Executive Operations Dashboard",
    stack: "Interactive Charts · Cost Breakdown",
    status: "Ready",
    sandboxId: "ops-dashboard" as DemoSandboxId,
    filter: "tools",
  },
  {
    id: "m5",
    tag: "AI",
    name: "Support Automation Pipeline",
    stack: "Intent Detection · Human Handoff",
    status: "Sandbox",
    sandboxId: "support-workflow" as DemoSandboxId,
    filter: "ai",
  },
];

const COLORS = ["var(--arv-accent)", "var(--arv-gold)", "var(--arv-chart-c)"];

export function HeroWorkspace({
  reduced,
  onOpenSandbox,
  onPrefillInquiry,
}: HeroWorkspaceProps) {
  const [tab, setTab] = React.useState<ConsoleTab>("overview");
  const [metricIdx, setMetricIdx] = React.useState(0);
  const [focusTrack, setFocusTrack] = React.useState("");
  const [tipIdx, setTipIdx] = React.useState(-1);

  // Scoper state
  const [selectedPreset, setSelectedPreset] = React.useState(SCOPE_PRESETS[0]);
  const [addons, setAddons] = React.useState<string[]>(["seo", "ci"]);

  // Modules filter
  const [modFilter, setModFilter] = React.useState<"all" | "web" | "ai" | "tools">("all");

  // Live floating card telemetry
  const [pipelineState, setPipelineState] = React.useState({
    label: "Live build pipeline",
    detail: "Next.js + Edge",
    from: "Git Commit",
    to: "arvostra.com",
    flash: 0,
  });

  const spark = useTween(SERIES_CACHE[metricIdx], reduced, 680);
  const path = sparkPath(spark, 300, 82);
  const gid = React.useId().replace(/:/g, "");

  const toggleAddon = (id: string) => {
    setAddons((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
    setPipelineState((s) => ({
      ...s,
      label: "Scope updated",
      detail: selectedPreset.timeline,
      from: selectedPreset.label.split(" ")[0],
      to: "V1 Spec",
      flash: s.flash + 1,
    }));
  };

  const handleSelectMetric = (i: number) => {
    setMetricIdx(i);
    setPipelineState((s) => ({
      label: "Architecture mode",
      detail: METRIC_VIEWS[i].metric,
      from: METRIC_VIEWS[i].label + " Layer",
      to: "Production",
      flash: s.flash + 1,
    }));
  };

  const handleSendScope = () => {
    const pickedAddons = SCOPE_ADDONS.filter((a) => addons.includes(a.id)).map(
      (a) => a.label
    );
    onPrefillInquiry({
      serviceCategory: selectedPreset.category,
      description: `Interested in a ${selectedPreset.label} (${selectedPreset.timeline} target). Preferred stack: ${selectedPreset.stack}.${
        pickedAddons.length ? ` Modules: ${pickedAddons.join(", ")}.` : ""
      }`,
    });
  };

  const filteredModules = MODULE_FEED.filter((m) =>
    modFilter === "all" ? true : m.filter === modFilter
  );

  const navItems: { id: ConsoleTab; label: string; icon: string }[] = [
    { id: "overview", label: "Studio Overview", icon: ICONS.grid },
    { id: "scoper", label: "Build Scoper", icon: ICONS.sliders },
    { id: "modules", label: "Live Demos", icon: ICONS.list },
  ];

  return (
    <div className="arv-device-wrap">
      <div className="arv-device">
        <div className="arv-device-bezel">
          <div className="arv-dash">
            <aside className="arv-side">
              <div className="arv-side-brand">
                <ArvostraMark size={18} />
                <span>{BRAND.name} Studio</span>
              </div>
              <div className="arv-side-label">Workspace</div>
              {navItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className="arv-side-item"
                  data-on={tab === item.id || undefined}
                  onClick={() => setTab(item.id)}
                >
                  <Icon d={item.icon} size={14} />
                  {item.label}
                </button>
              ))}

              <div className="arv-side-label">Capabilities</div>
              {WORKSPACE_TRACKS.map((tr, i) => (
                <button
                  key={tr.id}
                  type="button"
                  className="arv-side-acc"
                  data-on={(tab === "overview" && focusTrack === tr.id) || undefined}
                  onClick={() => {
                    setTab("overview");
                    setFocusTrack((prev) => (prev === tr.id ? "" : tr.id));
                  }}
                >
                  <i style={{ background: COLORS[i % COLORS.length] }} />
                  <span>{tr.name}</span>
                  <small>{tr.share}%</small>
                </button>
              ))}

              <button
                type="button"
                className="arv-side-foot"
                onClick={() =>
                  onPrefillInquiry({ serviceCategory: "Website / Landing Page" })
                }
              >
                <Icon d={ICONS.rocket} size={14} />
                Start a Project
              </button>
            </aside>

            <div className="arv-main">
              <div className="arv-crumbs">
                <span>Arvostra</span>
                <span aria-hidden="true">/</span>
                <b>V1 Digital Studio Console</b>
                <span className="arv-live">
                  <i /> Available for builds
                </span>
              </div>

              <div className="arv-tabs-sm" role="tablist" aria-label="Console views">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    role="tab"
                    aria-selected={tab === item.id}
                    onClick={() => setTab(item.id)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              <div className="arv-view" key={tab}>
                {tab === "overview" ? (
                  <>
                    <div className="arv-ov-head">
                      <div>
                        <h2 className="arv-h3">Interactive Studio Preview</h2>
                        <div className="arv-k">Target performance standard</div>
                        <div className="arv-total">
                          {METRIC_VIEWS[metricIdx].metric}
                        </div>
                        <div className="arv-delta">
                          <span>{METRIC_VIEWS[metricIdx].delta}</span> ·{" "}
                          {METRIC_VIEWS[metricIdx].headline}
                        </div>
                      </div>
                      <div className="arv-spark">
                        <div className="arv-seg" role="tablist" aria-label="Architecture layer">
                          {METRIC_VIEWS.map((m, i) => (
                            <button
                              key={m.label}
                              type="button"
                              role="tab"
                              aria-selected={metricIdx === i}
                              onClick={() => handleSelectMetric(i)}
                            >
                              {m.label}
                            </button>
                          ))}
                        </div>
                        <svg
                          className="arv-svg arv-spark-svg"
                          viewBox="0 0 300 82"
                          width="300"
                          height="82"
                          preserveAspectRatio="none"
                          aria-hidden="true"
                        >
                          <defs>
                            <linearGradient
                              id={`${gid}grad`}
                              x1="0"
                              x2="0"
                              y1="0"
                              y2="1"
                            >
                              <stop
                                offset="0"
                                stopColor="var(--arv-gold)"
                                stopOpacity="0.28"
                              />
                              <stop
                                offset="1"
                                stopColor="var(--arv-gold)"
                                stopOpacity="0"
                              />
                            </linearGradient>
                          </defs>
                          <path d={path.area} fill={`url(#${gid}grad)`} />
                          <path
                            d={path.line}
                            fill="none"
                            stroke="var(--arv-gold)"
                            strokeWidth="1.6"
                            vectorEffect="non-scaling-stroke"
                          />
                        </svg>
                      </div>
                    </div>

                    <div className="arv-accs">
                      {WORKSPACE_TRACKS.map((tr, i) => (
                        <button
                          key={tr.id}
                          type="button"
                          className="arv-acc"
                          data-on={focusTrack === tr.id || undefined}
                          data-dim={
                            (focusTrack && focusTrack !== tr.id) || undefined
                          }
                          onClick={() => onOpenSandbox(tr.sandboxId)}
                          aria-label={`Launch ${tr.name} live demo`}
                        >
                          <span className="arv-acc-top">
                            <i style={{ background: COLORS[i % COLORS.length] }} />
                            {tr.name}
                            <Icon
                              d={ICONS.arrow}
                              size={13}
                              className="arv-acc-go"
                            />
                          </span>
                          <span className="arv-acc-bal">{tr.tag}</span>
                          <span className="arv-acc-kind">{tr.kind}</span>
                        </button>
                      ))}
                    </div>

                    <div className="arv-recent">
                      <div className="arv-recent-head">
                        <b>Ready-to-explore prototypes</b>
                        <button
                          type="button"
                          className="arv-link"
                          onClick={() => setTab("modules")}
                        >
                          View all demos
                        </button>
                      </div>
                      {MODULE_FEED.slice(0, 3).map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          className="arv-recent-row arv-recent-btn"
                          onClick={() => onOpenSandbox(item.sandboxId)}
                        >
                          <span className="arv-led-date">{item.tag}</span>
                          <span className="arv-recent-text">{item.name}</span>
                          <span className="arv-led-amt" data-in="true">
                            Launch →
                          </span>
                        </button>
                      ))}
                    </div>

                    <div className="arv-break">
                      <div className="arv-break-head">
                        <b>Typical V1 Delivery Allocation</b>
                        <span>Balanced across UI engineering, automation, and cloud launch</span>
                      </div>
                      <div
                        className="arv-bar"
                        onMouseLeave={() => setTipIdx(-1)}
                      >
                        {WORKSPACE_TRACKS.map((tr, i) => (
                          <span
                            key={tr.id}
                            tabIndex={0}
                            onMouseEnter={() => setTipIdx(i)}
                            onFocus={() => setTipIdx(i)}
                            onBlur={() => setTipIdx(-1)}
                            data-dim={
                              (focusTrack && focusTrack !== tr.id) || undefined
                            }
                            style={{
                              width: `${tr.share}%`,
                              background: COLORS[i % COLORS.length],
                            }}
                            aria-label={`${tr.name} ${tr.share}%`}
                          />
                        ))}
                        {tipIdx >= 0 && WORKSPACE_TRACKS[tipIdx] ? (
                          <em
                            className="arv-tip"
                            style={{
                              left: `${
                                WORKSPACE_TRACKS.slice(0, tipIdx).reduce(
                                  (acc, cur) => acc + cur.share,
                                  0
                                ) +
                                WORKSPACE_TRACKS[tipIdx].share / 2
                              }%`,
                            }}
                          >
                            {WORKSPACE_TRACKS[tipIdx].name} ·{" "}
                            {WORKSPACE_TRACKS[tipIdx].kind}
                          </em>
                        ) : null}
                      </div>
                      <div className="arv-legend">
                        {WORKSPACE_TRACKS.map((tr, i) => (
                          <span key={tr.id}>
                            <i style={{ background: COLORS[i % COLORS.length] }} />
                            {tr.share}% {tr.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </>
                ) : tab === "scoper" ? (
                  <div className="arv-move">
                    <h2 className="arv-h3">Interactive V1 Scope Builder</h2>
                    <p className="arv-fine" style={{ marginBottom: 14 }}>
                      Select a build track and optional modules, then send the summary straight into the inquiry form.
                    </p>
                    <div className="arv-scope-grid">
                      {SCOPE_PRESETS.map((preset) => (
                        <button
                          key={preset.id}
                          type="button"
                          className="arv-pill"
                          aria-pressed={selectedPreset.id === preset.id}
                          onClick={() => {
                            setSelectedPreset(preset);
                            setPipelineState((s) => ({
                              label: "Track selected",
                              detail: preset.timeline,
                              from: preset.label.split(" ")[0],
                              to: "Arvostra V1",
                              flash: s.flash + 1,
                            }));
                          }}
                        >
                          <span>{preset.label}</span>
                          <small>{preset.timeline}</small>
                        </button>
                      ))}
                    </div>

                    <div className="arv-k" style={{ marginTop: 16, marginBottom: 8 }}>
                      Optional V1 modules
                    </div>
                    <div className="arv-chips">
                      {SCOPE_ADDONS.map((ad) => {
                        const active = addons.includes(ad.id);
                        return (
                          <button
                            key={ad.id}
                            type="button"
                            data-on={active || undefined}
                            onClick={() => toggleAddon(ad.id)}
                          >
                            {active ? "✓ " : "+ "}
                            {ad.label}
                          </button>
                        );
                      })}
                    </div>

                    <dl className="arv-dl" style={{ marginTop: 16 }}>
                      <div>
                        <dt>Recommended stack</dt>
                        <dd>{selectedPreset.stack}</dd>
                      </div>
                      <div>
                        <dt>Estimated V1 cadence</dt>
                        <dd>{selectedPreset.timeline}</dd>
                      </div>
                      <div>
                        <dt>Selected modules</dt>
                        <dd>{addons.length} enabled</dd>
                      </div>
                    </dl>

                    <div className="arv-row" style={{ marginTop: 16 }}>
                      <button
                        type="button"
                        className="arv-btn arv-btn-dark"
                        onClick={handleSendScope}
                      >
                        Pre-fill Project Inquiry
                        <Icon d={ICONS.arrow} size={15} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="arv-act">
                    <div className="arv-act-head">
                      <h2 className="arv-h3">Interactive Demos</h2>
                      <div className="arv-seg" role="tablist" aria-label="Filter demos">
                        {(["all", "web", "ai", "tools"] as const).map((f) => (
                          <button
                            key={f}
                            type="button"
                            role="tab"
                            aria-selected={modFilter === f}
                            onClick={() => setModFilter(f)}
                          >
                            {f === "all"
                              ? "All"
                              : f === "web"
                              ? "Web"
                              : f === "ai"
                              ? "AI"
                              : "Tools"}
                          </button>
                        ))}
                      </div>
                    </div>
                    <ul className="arv-ledger">
                      {filteredModules.map((item) => (
                        <li key={item.id}>
                          <span className="arv-led-date">{item.tag}</span>
                          <span className="arv-led-text">
                            {item.name}
                            <small>{item.stack}</small>
                          </span>
                          <span className="arv-led-status" data-s={item.status}>
                            {item.status}
                          </span>
                          <button
                            type="button"
                            className="arv-led-amt arv-led-launch"
                            onClick={() => onOpenSandbox(item.sandboxId)}
                          >
                            Try demo →
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="arv-floats" aria-live="polite">
        <div className="arv-float">
          <div className="arv-float-in">
            <div className="arv-flow" key={pipelineState.flash}>
              <div className="arv-flow-top">
                <span>{pipelineState.label}</span>
                <b>{pipelineState.detail}</b>
              </div>
              <div className="arv-flow-row">
                <span className="arv-flow-chip">
                  <i />
                  {pipelineState.from}
                </span>
                <svg
                  className="arv-svg arv-flow-arrow"
                  width="44"
                  height="10"
                  viewBox="0 0 44 10"
                  aria-hidden="true"
                >
                  <path d="M1 5h38" />
                  <path d="M35 1l4 4-4 4" />
                </svg>
                <span className="arv-flow-chip arv-flow-chip-b">
                  <i />
                  {pipelineState.to}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="arv-float arv-float-2">
          <div className="arv-float-in">
            <div className="arv-flow">
              <div className="arv-flow-top">
                <span>AI workflow</span>
                <b>Automated</b>
                <em>under 1.2s</em>
              </div>
              <div className="arv-flow-row">
                <span className="arv-flow-chip">
                  <i />
                  Client Brief
                </span>
                <svg
                  className="arv-svg arv-flow-arrow"
                  width="44"
                  height="10"
                  viewBox="0 0 44 10"
                  aria-hidden="true"
                >
                  <path d="M1 5h38" />
                  <path d="M35 1l4 4-4 4" />
                </svg>
                <span className="arv-flow-chip arv-flow-chip-b">
                  <i />
                  Scope & Reply
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
