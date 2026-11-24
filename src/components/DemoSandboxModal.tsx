"use client";

import * as React from "react";
import { DemoItem, DemoSandboxId } from "@/lib/data";
import { Icon, ICONS } from "./Icons";

interface DemoSandboxModalProps {
  demo: DemoItem | null;
  onClose: () => void;
  onCustomize: (demo: DemoItem) => void;
}

/* 1. Local Service & Salon Studio Interactive Preview */
function SalonSandbox() {
  const [cat, setCat] = React.useState<"All" | "Cuts" | "Color" | "Treatments">("All");
  const [selected, setSelected] = React.useState<string>("Women's Cut & Blowdry");
  const services = [
    { name: "Women's Cut & Blowdry", cat: "Cuts", price: "$55", mins: "45 min" },
    { name: "Men's Precision Cut", cat: "Cuts", price: "$32", mins: "30 min" },
    { name: "Full Balayage & Gloss", cat: "Color", price: "$165", mins: "150 min" },
    { name: "Root Touch-Up", cat: "Color", price: "$85", mins: "75 min" },
    { name: "Keratin Smoothing Ritual", cat: "Treatments", price: "$140", mins: "90 min" },
  ];
  const visible = services.filter((s) => cat === "All" || s.cat === cat);

  return (
    <div className="arv-sbx-body">
      <div className="arv-sbx-salon-bar">
        <span>Neighborhood Salon Template</span>
        <span className="arv-live">
          <i /> Open Today · 10 AM – 8 PM
        </span>
      </div>
      <div className="arv-chips" style={{ marginBottom: 14 }}>
        {(["All", "Cuts", "Color", "Treatments"] as const).map((c) => (
          <button
            key={c}
            type="button"
            data-on={cat === c || undefined}
            onClick={() => setCat(c)}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="arv-sbx-list">
        {visible.map((s) => (
          <button
            key={s.name}
            type="button"
            className="arv-sbx-row"
            data-on={selected === s.name || undefined}
            onClick={() => setSelected(s.name)}
          >
            <div>
              <b>{s.name}</b>
              <small>
                {s.cat} · {s.mins}
              </small>
            </div>
            <span className="arv-sbx-price">{s.price}</span>
          </button>
        ))}
      </div>
      <div className="arv-sbx-foot-note">
        Selected service: <b>{selected}</b> — mobile tap-to-call & map directions included in full template.
      </div>
    </div>
  );
}

/* 2. Retail Inventory & Shift Calculator (modeled on real Lottery-Calculator) */
function ShiftCalculatorSandbox() {
  const [rows, setRows] = React.useState([
    { denom: 2, stock: 50, activated: 25, sold: 18 },
    { denom: 5, stock: 40, activated: 20, sold: 14 },
    { denom: 10, stock: 30, activated: 10, sold: 9 },
    { denom: 20, stock: 20, activated: 5, sold: 6 },
    { denom: 50, stock: 10, activated: 0, sold: 2 },
  ]);
  const [copied, setCopied] = React.useState(false);

  const updateRow = (
    idx: number,
    field: "stock" | "activated" | "sold",
    val: string
  ) => {
    const num = Math.max(0, Math.min(9999, parseInt(val || "0", 10) || 0));
    setRows((prev) =>
      prev.map((r, i) => (i === idx ? { ...r, [field]: num } : r))
    );
  };

  const totals = rows.reduce(
    (acc, r) => {
      const closing = r.stock + r.activated - r.sold;
      return {
        soldValue: acc.soldValue + r.sold * r.denom,
        closingValue: acc.closingValue + closing * r.denom,
        hasError: acc.hasError || closing < 0,
      };
    },
    { soldValue: 0, closingValue: 0, hasError: false }
  );

  const copyCsv = async () => {
    const header = "Denomination,Opening,Activated,Sold,Closing,ClosingValue";
    const body = rows
      .map((r) => {
        const closing = r.stock + r.activated - r.sold;
        return `$${r.denom},${r.stock},${r.activated},${r.sold},${closing},$${closing * r.denom}`;
      })
      .join("\n");
    try {
      await navigator.clipboard.writeText(`${header}\n${body}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="arv-sbx-body">
      <div className="arv-sbx-kpis">
        <div>
          <span className="arv-k">Shift Sales Value</span>
          <b>${totals.soldValue.toLocaleString()}</b>
        </div>
        <div>
          <span className="arv-k">Closing Inventory Value</span>
          <b>${totals.closingValue.toLocaleString()}</b>
        </div>
        <div>
          <span className="arv-k">Validation</span>
          <b style={{ color: totals.hasError ? "#b3412e" : "var(--arv-good)" }}>
            {totals.hasError ? "Negative stock!" : "Balanced"}
          </b>
        </div>
      </div>

      <div className="arv-sbx-table-wrap">
        <table className="arv-sbx-table">
          <thead>
            <tr>
              <th>Unit</th>
              <th>Stock</th>
              <th>Activated</th>
              <th>Sold</th>
              <th>Closing</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => {
              const closing = r.stock + r.activated - r.sold;
              return (
                <tr key={r.denom} data-bad={closing < 0 || undefined}>
                  <td>
                    <b>${r.denom}</b>
                  </td>
                  <td>
                    <input
                      type="number"
                      min={0}
                      value={r.stock}
                      aria-label={`$${r.denom} opening stock`}
                      onChange={(e) => updateRow(i, "stock", e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      min={0}
                      value={r.activated}
                      aria-label={`$${r.denom} activated`}
                      onChange={(e) => updateRow(i, "activated", e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      min={0}
                      value={r.sold}
                      aria-label={`$${r.denom} sold`}
                      onChange={(e) => updateRow(i, "sold", e.target.value)}
                    />
                  </td>
                  <td>{closing}</td>
                  <td>${(closing * r.denom).toLocaleString()}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="arv-row" style={{ marginTop: 12, justifyContent: "space-between", flexWrap: "wrap" }}>
        <span className="arv-fine">
          Edit any cell — calculations update instantly with zero backend latency.
        </span>
        <button
          type="button"
          className="arv-btn arv-btn-ghost arv-btn-sm"
          onClick={copyCsv}
        >
          <Icon d={copied ? ICONS.check : ICONS.copy} size={14} />
          {copied ? "CSV Copied" : "Copy CSV"}
        </button>
      </div>
    </div>
  );
}

/* 3. AI Lead & Document Triage Assistant */
const TRIAGE_SAMPLES = [
  {
    label: "Dental Clinic Redesign",
    text: "Hi, we run a 2-location dental clinic in Mississauga. Our WordPress site is slow on mobile and we need an online appointment request form plus automated WhatsApp reminders within 3 weeks. Budget around $2,500.",
  },
  {
    label: "Invoice Automation",
    text: "We receive ~180 supplier PDF invoices weekly via Gmail and manually key totals into Google Sheets. Looking for an AI workflow to parse line items and flag anything over $5,000 for review ASAP.",
  },
  {
    label: "AWS Cost & Deploy Audit",
    text: "Our Node.js app runs on 3 oversized EC2 instances with manual SSH deploys. Need Docker, GitHub Actions CI/CD, and CloudWatch alerts without downtime.",
  },
];

function analyzeText(text: string) {
  const lower = text.toLowerCase();
  const isAi =
    lower.includes("ai") ||
    lower.includes("invoice") ||
    lower.includes("automat") ||
    lower.includes("pdf") ||
    lower.includes("whatsapp");
  const isCloud =
    lower.includes("aws") ||
    lower.includes("ec2") ||
    lower.includes("docker") ||
    lower.includes("ci/cd") ||
    lower.includes("deploy");
  const category = isCloud
    ? "Cloud / DevOps Infrastructure"
    : isAi
    ? "AI & Workflow Automation"
    : "Web & Product Engineering";
  const urgency =
    lower.includes("asap") || lower.includes("urgent") || lower.includes("3 weeks")
      ? "High (Fast-Track)"
      : "Standard";
  const budgetMatch = text.match(/\$[\d,]+(?:\s*[-–]\s*\$?[\d,]+)?/);
  const budget = budgetMatch ? budgetMatch[0] : "To be scoped";
  const channels: string[] = [];
  if (lower.includes("whatsapp")) channels.push("WhatsApp");
  if (lower.includes("gmail") || lower.includes("email")) channels.push("Email/Gmail");
  if (lower.includes("sheets")) channels.push("Google Sheets");
  if (lower.includes("aws") || lower.includes("ec2")) channels.push("AWS");
  if (lower.includes("github")) channels.push("GitHub Actions");
  if (!channels.length) channels.push("Web App / API");

  return {
    category,
    urgency,
    detectedBudget: budget,
    integrations: channels,
    draftReply: `Thanks for reaching out. We can scope a clean V1 for ${category.toLowerCase()} integrating ${channels.join(
      " + "
    )}. Let's confirm your exact success criteria and target launch date so we can share a fixed implementation plan.`,
  };
}

function AiTriageSandbox() {
  const [input, setInput] = React.useState(TRIAGE_SAMPLES[0].text);
  const [result, setResult] = React.useState(() =>
    analyzeText(TRIAGE_SAMPLES[0].text)
  );
  const [running, setRunning] = React.useState(false);

  const runAnalysis = (sourceText: string) => {
    setRunning(true);
    setTimeout(() => {
      setResult(analyzeText(sourceText));
      setRunning(false);
    }, 320);
  };

  return (
    <div className="arv-sbx-body">
      <div className="arv-chips" style={{ marginBottom: 10 }}>
        {TRIAGE_SAMPLES.map((s) => (
          <button
            key={s.label}
            type="button"
            onClick={() => {
              setInput(s.text);
              runAnalysis(s.text);
            }}
          >
            {s.label}
          </button>
        ))}
      </div>
      <textarea
        className="arv-sbx-textarea"
        rows={3}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        aria-label="Sample client message or document snippet"
      />
      <div className="arv-row" style={{ marginTop: 10 }}>
        <button
          type="button"
          className="arv-btn arv-btn-dark arv-btn-sm"
          onClick={() => runAnalysis(input)}
          disabled={running || !input.trim()}
        >
          <Icon d={ICONS.spark} size={14} />
          {running ? "Extracting…" : "Run Structured Triage"}
        </button>
      </div>
      <div className="arv-sbx-output">
        <div className="arv-sbx-kpis">
          <div>
            <span className="arv-k">Detected Track</span>
            <b>{result.category}</b>
          </div>
          <div>
            <span className="arv-k">Priority</span>
            <b>{result.urgency}</b>
          </div>
          <div>
            <span className="arv-k">Budget Signal</span>
            <b>{result.detectedBudget}</b>
          </div>
        </div>
        <div style={{ marginTop: 10 }}>
          <span className="arv-k">Extracted Systems</span>
          <div className="arv-chips" style={{ marginTop: 6 }}>
            {result.integrations.map((tag) => (
              <span key={tag} className="arv-tag-chip">
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div style={{ marginTop: 12 }}>
          <span className="arv-k">Suggested Draft Reply</span>
          <p className="arv-sbx-draft">{result.draftReply}</p>
        </div>
      </div>
    </div>
  );
}

/* 4. Executive Operations Dashboard */
function OpsDashboardSandbox() {
  const [period, setPeriod] = React.useState<"7D" | "30D" | "90D">("30D");
  const data = {
    "7D": { revenue: "$18,420", tickets: "94% on-SLA", hoursSaved: "14 hrs", bars: [48, 32, 20] },
    "30D": { revenue: "$74,900", tickets: "97% on-SLA", hoursSaved: "62 hrs", bars: [54, 28, 18] },
    "90D": { revenue: "$218,500", tickets: "98% on-SLA", hoursSaved: "184 hrs", bars: [58, 26, 16] },
  }[period];

  return (
    <div className="arv-sbx-body">
      <div className="arv-row" style={{ justifyContent: "space-between", marginBottom: 14 }}>
        <b>Operations Overview (Sample Data)</b>
        <div className="arv-seg">
          {(["7D", "30D", "90D"] as const).map((p) => (
            <button
              key={p}
              type="button"
              aria-selected={period === p}
              onClick={() => setPeriod(p)}
            >
              {p}
            </button>
          ))}
        </div>
      </div>
      <div className="arv-sbx-kpis">
        <div>
          <span className="arv-k">Tracked Volume</span>
          <b>{data.revenue}</b>
        </div>
        <div>
          <span className="arv-k">SLA Compliance</span>
          <b>{data.tickets}</b>
        </div>
        <div>
          <span className="arv-k">Automation Saved</span>
          <b>{data.hoursSaved}</b>
        </div>
      </div>
      <div style={{ marginTop: 18 }}>
        <div className="arv-break-head">
          <b>Workload Distribution</b>
          <span>Web Ops · Automated Workflows · Support Queue</span>
        </div>
        <div className="arv-bar arv-bar-lg">
          <span style={{ width: `${data.bars[0]}%`, background: "var(--arv-accent)" }} />
          <span style={{ width: `${data.bars[1]}%`, background: "var(--arv-gold)" }} />
          <span style={{ width: `${data.bars[2]}%`, background: "var(--arv-chart-c)" }} />
        </div>
        <div className="arv-legend">
          <span>
            <i style={{ background: "var(--arv-accent)" }} /> {data.bars[0]}% Core Ops
          </span>
          <span>
            <i style={{ background: "var(--arv-gold)" }} /> {data.bars[1]}% Automated
          </span>
          <span>
            <i style={{ background: "var(--arv-chart-c)" }} /> {data.bars[2]}% Escalated
          </span>
        </div>
      </div>
    </div>
  );
}

/* 5. SaaS Launch & Waitlist System */
function SaasLaunchSandbox() {
  const [annual, setAnnual] = React.useState(true);
  const [email, setEmail] = React.useState("");
  const [joined, setJoined] = React.useState(false);

  return (
    <div className="arv-sbx-body">
      <div className="arv-row" style={{ justifyContent: "space-between", marginBottom: 14 }}>
        <b>Billing Toggle Preview</b>
        <div className="arv-seg">
          <button type="button" aria-selected={!annual} onClick={() => setAnnual(false)}>
            Monthly
          </button>
          <button type="button" aria-selected={annual} onClick={() => setAnnual(true)}>
            Annual (-20%)
          </button>
        </div>
      </div>
      <div className="arv-sbx-plans">
        <div className="arv-sbx-plan">
          <span className="arv-k">Starter</span>
          <b>${annual ? "24" : "30"}/mo</b>
          <small>Core workspace + email alerts</small>
        </div>
        <div className="arv-sbx-plan" data-featured="true">
          <span className="arv-k">Growth</span>
          <b>${annual ? "79" : "99"}/mo</b>
          <small>Automations + custom domain + API</small>
        </div>
      </div>
      <form
        className="arv-sbx-waitlist"
        onSubmit={(e) => {
          e.preventDefault();
          if (email.includes("@")) setJoined(true);
        }}
      >
        <input
          type="email"
          placeholder="Test waitlist input: you@company.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setJoined(false);
          }}
        />
        <button type="submit" className="arv-btn arv-btn-dark arv-btn-sm">
          {joined ? "Captured ✓" : "Test Signup"}
        </button>
      </form>
    </div>
  );
}

/* 6. Support Automation Pipeline */
function SupportWorkflowSandbox() {
  const [step, setStep] = React.useState(3);
  const [ticketType, setTicketType] = React.useState<"billing" | "bug" | "onboarding">("billing");
  const stages = [
    { name: "1. Webhook Trigger", detail: `Received ${ticketType} inquiry via form / inbox` },
    { name: "2. AI Classification", detail: `Tagged intent: ${ticketType.toUpperCase()} · Confidence 0.94` },
    { name: "3. Policy & SLA Check", detail: ticketType === "bug" ? "Escalated to P1 engineering alert" : "Matched verified FAQ playbook" },
    { name: "4. Draft & Handoff", detail: "Prepared response draft for 1-click approval" },
  ];

  const replay = (type: "billing" | "bug" | "onboarding") => {
    setTicketType(type);
    setStep(0);
    [1, 2, 3].forEach((n) => setTimeout(() => setStep(n), n * 280));
  };

  return (
    <div className="arv-sbx-body">
      <div className="arv-chips" style={{ marginBottom: 14 }}>
        {(["billing", "bug", "onboarding"] as const).map((t) => (
          <button
            key={t}
            type="button"
            data-on={ticketType === t || undefined}
            onClick={() => replay(t)}
          >
            Simulate {t} ticket
          </button>
        ))}
      </div>
      <div className="arv-sbx-steps">
        {stages.map((s, idx) => (
          <div key={s.name} className="arv-sbx-step" data-on={idx <= step || undefined}>
            <span className="arv-tick">
              <Icon d={ICONS.check} size={12} stroke={2.4} />
            </span>
            <div>
              <b>{s.name}</b>
              <small>{s.detail}</small>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function renderSandbox(id: DemoSandboxId) {
  switch (id) {
    case "salon-template":
      return <SalonSandbox />;
    case "shift-calculator":
      return <ShiftCalculatorSandbox />;
    case "ai-lead-triage":
      return <AiTriageSandbox />;
    case "ops-dashboard":
      return <OpsDashboardSandbox />;
    case "saas-launch":
      return <SaasLaunchSandbox />;
    case "support-workflow":
      return <SupportWorkflowSandbox />;
  }
}

export function DemoSandboxModal({
  demo,
  onClose,
  onCustomize,
}: DemoSandboxModalProps) {
  React.useEffect(() => {
    if (!demo) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [demo, onClose]);

  if (!demo) return null;

  return (
    <div
      className="arv-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="arv-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="arv-modal">
        <div className="arv-modal-head">
          <div>
            <span className="arv-k">{demo.category} · Interactive Preview</span>
            <h3 id="arv-modal-title" className="arv-h3" style={{ marginTop: 4 }}>
              {demo.name}
            </h3>
          </div>
          <button
            type="button"
            className="arv-modal-close"
            onClick={onClose}
            aria-label="Close demo preview"
          >
            <Icon d={ICONS.close} size={18} />
          </button>
        </div>

        <div className="arv-modal-content">{renderSandbox(demo.sandboxId)}</div>

        <div className="arv-modal-foot">
          <div className="arv-modal-price">{demo.pricing}</div>
          <div className="arv-row" style={{ flexWrap: "wrap" }}>
            {demo.externalUrl ? (
              <a
                href={demo.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="arv-btn arv-btn-ghost arv-btn-sm"
              >
                {demo.externalLabel ?? "Open Live URL"}
                <Icon d={ICONS.arrowUpRight} size={14} />
              </a>
            ) : null}
            <button
              type="button"
              className="arv-btn arv-btn-dark arv-btn-sm"
              onClick={() => {
                onClose();
                onCustomize(demo);
              }}
            >
              Customize / Request Similar
              <Icon d={ICONS.arrow} size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
