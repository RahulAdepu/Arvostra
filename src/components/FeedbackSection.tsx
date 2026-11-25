"use client";

import * as React from "react";
import { submitStaticFeedback } from "@/lib/submitFeedback";
import {
  BUG_SEVERITIES,
  FEEDBACK_AREAS,
  FEEDBACK_TYPES,
  FeedbackErrors,
  FeedbackPayload,
  FeedbackType,
  formatFeedbackReport,
  validateFeedback,
} from "@/lib/validation";
import { Icon, ICONS, MarkedText } from "./Icons";

type FeedbackSubmitState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "success"; referenceId: string; payload: FeedbackPayload }
  | {
      status: "unconfigured";
      message: string;
      mailtoHref: string;
      contactEmail: string;
      payload: FeedbackPayload;
    }
  | {
      status: "error";
      message: string;
      mailtoHref?: string;
      contactEmail?: string;
    };

function detectTechContext(brokenFrom?: string): string {
  if (typeof window === "undefined") return "";
  const url = brokenFrom
    ? `${window.location.origin}${brokenFrom}`
    : `${window.location.origin}${window.location.pathname}`;
  const viewport = `${window.innerWidth}×${window.innerHeight}`;
  const ua = navigator.userAgent;
  const browser = ua.includes("Edg/")
    ? "Edge"
    : ua.includes("Chrome/")
    ? "Chrome"
    : ua.includes("Firefox/")
    ? "Firefox"
    : ua.includes("Safari/")
    ? "Safari"
    : "Browser";
  const os = ua.includes("Windows")
    ? "Windows"
    : ua.includes("Mac OS")
    ? "macOS"
    : ua.includes("Android")
    ? "Android"
    : ua.includes("iPhone") || ua.includes("iPad")
    ? "iOS"
    : ua.includes("Linux")
    ? "Linux"
    : "OS";
  return `${url} · ${viewport} · ${browser}/${os}`;
}

export function FeedbackSection({
  standalone = false,
}: {
  standalone?: boolean;
}) {
  const [type, setType] = React.useState<FeedbackType>("Bug Report");
  const [area, setArea] = React.useState<string>("Main Website");
  const [severity, setSeverity] = React.useState<string>("Minor UI glitch");
  const [details, setDetails] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [includeTechContext, setIncludeTechContext] = React.useState(true);
  const [techContext, setTechContext] = React.useState("");
  const [trap, setTrap] = React.useState("");
  const [errors, setErrors] = React.useState<FeedbackErrors>({});
  const [submitState, setSubmitState] = React.useState<FeedbackSubmitState>({
    status: "idle",
  });
  const [copied, setCopied] = React.useState(false);

  const startedAtRef = React.useRef<number>(Date.now());
  const inFlightRef = React.useRef<boolean>(false);

  // Detect live viewport/browser context and optional ?feedback=404&from=/broken-path pre-fill
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const mode = params.get("feedback");
    const fromPath = params.get("from")?.slice(0, 140) || "";

    if (mode === "404") {
      setType("Bug Report");
      setArea("404 / Broken Link");
      setSeverity("Broken interaction");
      setIncludeTechContext(true);
      if (fromPath) {
        setDetails(`Broken link encountered at "${fromPath}". `);
      }
    }
    setTechContext(detectTechContext(fromPath || undefined));
  }, []);

  const handleTypeChange = (nextType: FeedbackType) => {
    setType(nextType);
    setIncludeTechContext(nextType === "Bug Report");
    if (nextType === "Suggestion" && area === "404 / Broken Link") {
      setArea("New Demo or Tool Idea");
    }
    setErrors((prev) => ({ ...prev, form: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inFlightRef.current) return;

    const liveContext = includeTechContext
      ? techContext || detectTechContext()
      : "";

    const rawPayload: FeedbackPayload = {
      type,
      area,
      severity: type === "Bug Report" ? severity : "",
      details,
      email,
      includeTechContext,
      techContext: liveContext,
      feedbackTrap: trap,
      startedAt: startedAtRef.current,
    };

    const { valid, errors: nextErrors, sanitized } = validateFeedback(rawPayload);
    if (!valid) {
      setErrors(nextErrors);
      setSubmitState({ status: "idle" });
      return;
    }

    inFlightRef.current = true;
    setErrors({});
    setSubmitState({ status: "submitting" });

    try {
      const res = await submitStaticFeedback(sanitized);
      if (res.status === "delivered") {
        setSubmitState({
          status: "success",
          referenceId: res.referenceId,
          payload: sanitized,
        });
        return;
      }
      if (res.status === "unconfigured") {
        setSubmitState({
          status: "unconfigured",
          message: res.message,
          mailtoHref: res.mailtoHref,
          contactEmail: res.contactEmail,
          payload: sanitized,
        });
        return;
      }
      setSubmitState({
        status: "error",
        message: res.message,
        mailtoHref: res.mailtoHref,
        contactEmail: res.contactEmail,
      });
    } catch {
      setSubmitState({
        status: "error",
        message: "Unexpected error submitting feedback. Please try again.",
      });
    } finally {
      inFlightRef.current = false;
    }
  };

  const handleCopy = async (payload: FeedbackPayload) => {
    try {
      await navigator.clipboard.writeText(formatFeedbackReport(payload));
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  const resetForm = () => {
    setDetails("");
    setEmail("");
    setErrors({});
    setSubmitState({ status: "idle" });
    startedAtRef.current = Date.now();
  };

  return (
    <section
      className={`arv-sec arv-fb-sec${standalone ? " arv-fb-standalone" : ""}`}
      id="feedback"
      data-sec="feedback"
    >
      <div className="arv-wrap arv-split">
        <div>
          <div className="arv-label">Bugs & Suggestions</div>
        </div>

        <div className="arv-fb-wrap">
          {!standalone ? (
            <div className="arv-fb-head">
              <div>
                <h2 className="arv-h2 arv-fb-title">
                  <MarkedText text="Spot a *bug* or have a *suggestion*?" />
                </h2>
                <p className="arv-fine" style={{ marginTop: 10, maxWidth: 580, fontSize: 14 }}>
                  Found a broken link, layout glitch, or have an idea for a new ready-to-deploy demo or tool? Send a quick note — no account or email required.
                </p>
              </div>
            </div>
          ) : null}

          <div className="arv-fb-card" style={standalone ? { marginTop: 0 } : undefined}>
            {submitState.status === "success" ? (
              <div className="arv-inq-status" role="status" aria-live="polite">
                <span className="arv-done-ic">
                  <Icon d={ICONS.check} size={17} stroke={2.4} />
                </span>
                <h3 className="arv-h3">Thanks — report logged</h3>
                <p className="arv-fine" style={{ fontSize: 14 }}>
                  Your <b>{submitState.payload.type.toLowerCase()}</b> for{" "}
                  <b>{submitState.payload.area}</b> has been delivered directly to
                  Rahul.
                </p>
                <div className="arv-ref-code">
                  Reference ID: <code>{submitState.referenceId}</code>
                </div>
                <button
                  type="button"
                  className="arv-btn arv-btn-ghost arv-btn-sm"
                  onClick={resetForm}
                >
                  Send another note
                </button>
              </div>
            ) : submitState.status === "unconfigured" ? (
              <div className="arv-inq-status" role="alert" aria-live="polite">
                <span className="arv-warn-ic">
                  <Icon d={ICONS.mail} size={17} />
                </span>
                <h3 className="arv-h3">Direct Report Ready</h3>
                <p className="arv-fine" style={{ fontSize: 13.5 }}>
                  {submitState.message} Send your formatted{" "}
                  <b>{submitState.payload.type.toLowerCase()}</b> directly to{" "}
                  <b>{submitState.contactEmail}</b> or copy it below.
                </p>
                <div className="arv-row" style={{ flexWrap: "wrap", marginTop: 6 }}>
                  <a
                    href={submitState.mailtoHref}
                    className="arv-btn arv-btn-dark arv-btn-sm"
                  >
                    <Icon d={ICONS.mail} size={14} />
                    Email Report
                  </a>
                  <button
                    type="button"
                    className="arv-btn arv-btn-ghost arv-btn-sm"
                    onClick={() => handleCopy(submitState.payload)}
                  >
                    <Icon d={copied ? ICONS.check : ICONS.copy} size={14} />
                    {copied ? "Report Copied" : "Copy Report"}
                  </button>
                  <button
                    type="button"
                    className="arv-link"
                    onClick={() => setSubmitState({ status: "idle" })}
                  >
                    Edit note
                  </button>
                </div>
              </div>
            ) : (
              <form className="arv-inq-form" onSubmit={handleSubmit} noValidate>
                {/* Honeypot spam trap */}
                <div className="arv-hp" aria-hidden="true">
                  <label htmlFor="fb-trap">Leave blank</label>
                  <input
                    id="fb-trap"
                    name="feedbackTrap"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={trap}
                    onChange={(e) => setTrap(e.target.value)}
                  />
                </div>

                {/* Type selector */}
                <div className="arv-fb-type-row">
                  <span className="arv-k">What are you sharing?</span>
                  <div
                    className="arv-cat-tabs arv-fb-tabs"
                    role="tablist"
                    aria-label="Feedback type"
                  >
                    {FEEDBACK_TYPES.map((t) => (
                      <button
                        key={t}
                        type="button"
                        role="tab"
                        aria-selected={type === t}
                        onClick={() => handleTypeChange(t)}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="arv-field-row">
                  <div className="arv-input-group">
                    <label htmlFor="fb-area">Area / Page</label>
                    <select
                      id="fb-area"
                      name="area"
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                    >
                      {FEEDBACK_AREAS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>

                  {type === "Bug Report" ? (
                    <div className="arv-input-group">
                      <label htmlFor="fb-severity">Severity</label>
                      <select
                        id="fb-severity"
                        name="severity"
                        value={severity}
                        onChange={(e) => setSeverity(e.target.value)}
                      >
                        {BUG_SEVERITIES.map((sev) => (
                          <option key={sev} value={sev}>
                            {sev}
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <div className="arv-input-group">
                      <label htmlFor="fb-email-top">
                        Email <span className="arv-opt-tag">(optional)</span>
                      </label>
                      <input
                        id="fb-email-top"
                        name="email"
                        type="email"
                        maxLength={160}
                        placeholder="Only if you want a follow-up"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          setErrors((prev) => ({ ...prev, email: undefined }));
                        }}
                        aria-invalid={!!errors.email || undefined}
                      />
                      {errors.email ? (
                        <span className="arv-err" role="alert">
                          {errors.email}
                        </span>
                      ) : null}
                    </div>
                  )}
                </div>

                <div className="arv-input-group">
                  <label htmlFor="fb-details">
                    {type === "Bug Report"
                      ? "What happened?"
                      : type === "Suggestion"
                      ? "Your suggestion or demo idea"
                      : "Your feedback"}{" "}
                    <span aria-hidden="true">*</span>
                  </label>
                  <textarea
                    id="fb-details"
                    name="details"
                    rows={3}
                    required
                    maxLength={2000}
                    placeholder={
                      type === "Bug Report"
                        ? "Briefly describe the bug and what you clicked or expected to happen…"
                        : type === "Suggestion"
                        ? "Suggest a template, AI workflow, business tool, or improvement you'd like to see…"
                        : "Share what felt confusing, slow, or could be clearer…"
                    }
                    value={details}
                    onChange={(e) => {
                      setDetails(e.target.value);
                      setErrors((prev) => ({ ...prev, details: undefined }));
                    }}
                    aria-invalid={!!errors.details || undefined}
                    aria-describedby={errors.details ? "fb-details-err" : undefined}
                  />
                  <div className="arv-field-meta">
                    {errors.details ? (
                      <span id="fb-details-err" className="arv-err" role="alert">
                        {errors.details}
                      </span>
                    ) : (
                      <span className="arv-fine">
                        Direct to founder — helps improve Arvostra fast.
                      </span>
                    )}
                    <span className="arv-fine">{details.length}/2000</span>
                  </div>
                </div>

                {type === "Bug Report" ? (
                  <div className="arv-input-group">
                    <label htmlFor="fb-email-bug">
                      Follow-up email{" "}
                      <span className="arv-opt-tag">(optional — leave blank to report anonymously)</span>
                    </label>
                    <input
                      id="fb-email-bug"
                      name="email"
                      type="email"
                      maxLength={160}
                      placeholder="you@domain.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setErrors((prev) => ({ ...prev, email: undefined }));
                      }}
                      aria-invalid={!!errors.email || undefined}
                    />
                    {errors.email ? (
                      <span className="arv-err" role="alert">
                        {errors.email}
                      </span>
                    ) : null}
                  </div>
                ) : null}

                <label className="arv-fb-check">
                  <input
                    type="checkbox"
                    checked={includeTechContext}
                    onChange={(e) => setIncludeTechContext(e.target.checked)}
                  />
                  <span>
                    Include technical context for debugging{" "}
                    {techContext ? (
                      <code className="arv-fb-ctx">{techContext}</code>
                    ) : null}
                  </span>
                </label>

                {errors.form || submitState.status === "error" ? (
                  <div className="arv-err arv-err-box" role="alert">
                    <div>
                      {errors.form ||
                        (submitState.status === "error"
                          ? submitState.message
                          : "")}
                    </div>
                    {submitState.status === "error" && submitState.mailtoHref ? (
                      <div style={{ marginTop: 6 }}>
                        <a
                          href={submitState.mailtoHref}
                          className="arv-link"
                          style={{ color: "inherit", fontWeight: 500 }}
                        >
                          Email report directly to {submitState.contactEmail} →
                        </a>
                      </div>
                    ) : null}
                  </div>
                ) : null}

                <div className="arv-inq-submit-row">
                  <button
                    type="submit"
                    className="arv-btn arv-btn-dark arv-btn-sm"
                    disabled={submitState.status === "submitting"}
                  >
                    {submitState.status === "submitting" ? (
                      <>
                        <span className="arv-spin" aria-hidden="true" />
                        Sending…
                      </>
                    ) : type === "Bug Report" ? (
                      <>
                        Submit Bug Report
                        <Icon d={ICONS.arrow} size={14} />
                      </>
                    ) : (
                      <>
                        Send Suggestion
                        <Icon d={ICONS.arrow} size={14} />
                      </>
                    )}
                  </button>
                  <span className="arv-fine">
                    Works anonymously · zero tracking cookies.
                  </span>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
