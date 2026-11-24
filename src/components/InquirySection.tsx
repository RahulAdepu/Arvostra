"use client";

import * as React from "react";
import { gsap } from "gsap";
import {
  BUDGET_OPTIONS,
  SERVICE_OPTIONS,
  TIMELINE_OPTIONS,
} from "@/lib/data";
import {
  getContactEmail,
  submitStaticInquiry,
} from "@/lib/submitInquiry";
import {
  InquiryPayload,
  validateInquiry,
  ValidationErrors,
} from "@/lib/validation";
import { Icon, ICONS, MarkedText } from "./Icons";

export interface InquiryPrefill {
  serviceCategory?: string;
  description?: string;
  selectedDemo?: string;
  signal: number;
}

interface InquirySectionProps {
  prefill: InquiryPrefill;
  reduced: boolean;
}

type SubmitState =
  | { status: "idle" }
  | { status: "submitting" }
  | {
      status: "success";
      referenceId: string;
      provider: string;
      summary: InquiryPayload;
    }
  | {
      status: "unconfigured";
      message: string;
      mailtoHref: string;
      contactEmail: string;
      payload: InquiryPayload;
    }
  | {
      status: "error";
      message: string;
      mailtoHref?: string;
      contactEmail?: string;
    };

const INITIAL_FORM: InquiryPayload = {
  name: "",
  email: "",
  serviceCategory: "",
  description: "",
  whatsapp: "",
  budget: "",
  timeline: "",
  existingWebsite: "",
  referenceUrls: "",
  additionalRequirements: "",
  selectedDemo: "",
  websiteTrap: "",
};

export function InquirySection({ prefill, reduced }: InquirySectionProps) {
  const [form, setForm] = React.useState<InquiryPayload>(INITIAL_FORM);
  const [showOptional, setShowOptional] = React.useState(false);
  const [errors, setErrors] = React.useState<ValidationErrors>({});
  const [submitState, setSubmitState] = React.useState<SubmitState>({
    status: "idle",
  });
  const [copiedBrief, setCopiedBrief] = React.useState(false);

  const startedAtRef = React.useRef<number>(Date.now());
  const lastSubmittedFingerprintRef = React.useRef<string>("");
  const inFlightRef = React.useRef<boolean>(false);
  const cardRef = React.useRef<HTMLDivElement | null>(null);
  const nameInputRef = React.useRef<HTMLInputElement | null>(null);

  // Apply prefill when user clicks Customize Demo or a Service CTA
  React.useEffect(() => {
    if (!prefill.signal) return;
    setForm((prev) => ({
      ...prev,
      serviceCategory: prefill.serviceCategory || prev.serviceCategory,
      selectedDemo: prefill.selectedDemo ?? prev.selectedDemo,
      description:
        prefill.description && !prev.description.trim()
          ? prefill.description
          : prefill.description && prefill.selectedDemo
          ? prefill.description
          : prev.description,
    }));
    setErrors((prev) => ({ ...prev, serviceCategory: undefined, form: undefined }));
    if (submitState.status !== "idle") {
      setSubmitState({ status: "idle" });
    }
    const timer = setTimeout(() => {
      nameInputRef.current?.focus({ preventScroll: true });
    }, reduced ? 0 : 620);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefill.signal]);

  // Pointer-lit ambient glows on the inquiry container (reference signature)
  React.useEffect(() => {
    const card = cardRef.current;
    if (!card || reduced) return;
    const blobs = Array.from(card.querySelectorAll(".arv-blob")) as HTMLElement[];
    const movers = blobs.map((b, i) => ({
      x: gsap.quickTo(b, "x", { duration: 1.4 + i * 0.45, ease: "power3.out" }),
      y: gsap.quickTo(b, "y", { duration: 1.4 + i * 0.45, ease: "power3.out" }),
    }));
    const onPointerMove = (e: PointerEvent) => {
      const r = card.getBoundingClientRect();
      const dx = e.clientX - r.left - r.width / 2;
      const dy = e.clientY - r.top - r.height / 2;
      movers.forEach((m, i) => {
        const k = [0.22, -0.18, 0.14][i] ?? 0.15;
        m.x(dx * k);
        m.y(dy * k);
      });
    };
    card.addEventListener("pointermove", onPointerMove);
    return () => {
      card.removeEventListener("pointermove", onPointerMove);
      blobs.forEach((b) => gsap.killTweensOf(b));
    };
  }, [reduced]);

  const updateField = <K extends keyof InquiryPayload>(
    key: K,
    value: InquiryPayload[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (key in errors) {
      setErrors((prev) => ({ ...prev, [key]: undefined, form: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inFlightRef.current) return;

    const payload: InquiryPayload = {
      ...form,
      startedAt: startedAtRef.current,
    };

    const { valid, errors: nextErrors, sanitized } = validateInquiry(payload);
    if (!valid) {
      setErrors(nextErrors);
      setSubmitState({ status: "idle" });
      // Auto-expand optional fields if an optional field had a validation error
      if (
        nextErrors.whatsapp ||
        nextErrors.existingWebsite ||
        nextErrors.referenceUrls ||
        nextErrors.additionalRequirements
      ) {
        setShowOptional(true);
      }
      return;
    }

    const fingerprint = JSON.stringify([
      sanitized.email.toLowerCase(),
      sanitized.serviceCategory,
      sanitized.description,
    ]);
    if (
      lastSubmittedFingerprintRef.current === fingerprint &&
      submitState.status === "success"
    ) {
      setErrors({
        form: "This inquiry was already submitted. Edit your brief to send a new message.",
      });
      return;
    }

    inFlightRef.current = true;
    setErrors({});
    setSubmitState({ status: "submitting" });

    try {
      const result = await submitStaticInquiry(sanitized);

      if (result.status === "delivered") {
        lastSubmittedFingerprintRef.current = fingerprint;
        setSubmitState({
          status: "success",
          referenceId: result.referenceId,
          provider: result.provider,
          summary: sanitized,
        });
        return;
      }

      if (result.status === "unconfigured") {
        setSubmitState({
          status: "unconfigured",
          message: result.message,
          mailtoHref: result.mailtoHref,
          contactEmail: result.contactEmail,
          payload: sanitized,
        });
        return;
      }

      setSubmitState({
        status: "error",
        message: result.message,
        mailtoHref: result.mailtoHref,
        contactEmail: result.contactEmail,
      });
    } catch {
      setSubmitState({
        status: "error",
        message:
          "Unexpected error while submitting your inquiry. Please try again or email directly.",
      });
    } finally {
      inFlightRef.current = false;
    }
  };

  const handleCopyBrief = async (payload: InquiryPayload) => {
    const text = [
      `Name: ${payload.name}`,
      `Email: ${payload.email}`,
      `Service: ${payload.serviceCategory}`,
      payload.selectedDemo ? `Demo: ${payload.selectedDemo}` : "",
      payload.whatsapp ? `WhatsApp: ${payload.whatsapp}` : "",
      payload.budget ? `Budget: ${payload.budget}` : "",
      payload.timeline ? `Timeline: ${payload.timeline}` : "",
      payload.existingWebsite ? `Website: ${payload.existingWebsite}` : "",
      payload.referenceUrls ? `References: ${payload.referenceUrls}` : "",
      `Description: ${payload.description}`,
      payload.additionalRequirements
        ? `Additional: ${payload.additionalRequirements}`
        : "",
    ]
      .filter(Boolean)
      .join("\n");
    try {
      await navigator.clipboard.writeText(text);
      setCopiedBrief(true);
      setTimeout(() => setCopiedBrief(false), 2000);
    } catch {
      setCopiedBrief(false);
    }
  };

  const resetForm = () => {
    setForm(INITIAL_FORM);
    setErrors({});
    setSubmitState({ status: "idle" });
    startedAtRef.current = Date.now();
  };

  return (
    <section className="arv-sec arv-cta-sec" id="inquiry" data-sec="inquiry">
      <div className="arv-wrap">
        <div className="arv-cta" ref={cardRef}>
          <span className="arv-blob arv-blob-a" aria-hidden="true" />
          <span className="arv-blob arv-blob-b" aria-hidden="true" />
          <span className="arv-blob arv-blob-c" aria-hidden="true" />
          <span className="arv-grain" aria-hidden="true" />

          <div className="arv-inq-grid">
            <div className="arv-inq-intro">
              <div className="arv-label">Project Inquiry</div>
              <h2 className="arv-h2" style={{ marginTop: 14 }}>
                <MarkedText text="Tell me what you're *building*." />
              </h2>
              <p className="arv-inq-lead">
                Share your idea or business challenge. I'll review your requirements and respond with the recommended approach, scope, timeline, and pricing.
              </p>

              <ul className="arv-inq-promises">
                <li>
                  <Icon d={ICONS.check} size={15} stroke={2.2} />
                  <span>Direct founder review — no sales script</span>
                </li>
                <li>
                  <Icon d={ICONS.check} size={15} stroke={2.2} />
                  <span>Clear V1 scope, tech stack & transparent estimate</span>
                </li>
                <li>
                  <Icon d={ICONS.check} size={15} stroke={2.2} />
                  <span>Privacy-conscious handling — never shared or sold</span>
                </li>
              </ul>

              {form.selectedDemo ? (
                <div className="arv-selected-demo-pill">
                  <span>
                    Selected demo: <b>{form.selectedDemo}</b>
                  </span>
                  <button
                    type="button"
                    aria-label="Clear selected demo"
                    onClick={() => updateField("selectedDemo", "")}
                  >
                    <Icon d={ICONS.close} size={13} />
                  </button>
                </div>
              ) : null}
            </div>

            <div className="arv-inq-card">
              {submitState.status === "success" ? (
                <div className="arv-inq-status" role="status" aria-live="polite">
                  <span className="arv-done-ic">
                    <Icon d={ICONS.check} size={18} stroke={2.4} />
                  </span>
                  <h3 className="arv-h3">Inquiry received</h3>
                  <p>
                    Thank you, <b>{submitState.summary.name}</b>. Your project brief for{" "}
                    <b>{submitState.summary.serviceCategory}</b> has been delivered. Rahul will review it and reply to{" "}
                    <b>{submitState.summary.email}</b>.
                  </p>
                  <div className="arv-ref-code">
                    Reference ID: <code>{submitState.referenceId}</code>
                  </div>
                  <button
                    type="button"
                    className="arv-btn arv-btn-ghost arv-btn-sm"
                    onClick={resetForm}
                  >
                    Send another inquiry
                  </button>
                </div>
              ) : submitState.status === "unconfigured" ? (
                <div
                  className="arv-inq-status arv-inq-warn"
                  role="alert"
                  aria-live="polite"
                >
                  <span className="arv-warn-ic">
                    <Icon d={ICONS.mail} size={18} />
                  </span>
                  <h3 className="arv-h3">Direct Email Fallback Ready</h3>
                  <p>{submitState.message}</p>
                  <p className="arv-fine">
                    Send your validated brief directly to{" "}
                    <b>{submitState.contactEmail}</b> or copy it below — nothing was falsely marked as sent.
                  </p>
                  <div className="arv-row" style={{ flexWrap: "wrap", marginTop: 8 }}>
                    <a
                      href={submitState.mailtoHref}
                      className="arv-btn arv-btn-dark arv-btn-sm"
                    >
                      <Icon d={ICONS.mail} size={14} />
                      Open Pre-filled Email
                    </a>
                    <button
                      type="button"
                      className="arv-btn arv-btn-ghost arv-btn-sm"
                      onClick={() => handleCopyBrief(submitState.payload)}
                    >
                      <Icon
                        d={copiedBrief ? ICONS.check : ICONS.copy}
                        size={14}
                      />
                      {copiedBrief ? "Brief Copied" : "Copy Project Brief"}
                    </button>
                    <button
                      type="button"
                      className="arv-link"
                      onClick={() => setSubmitState({ status: "idle" })}
                    >
                      Edit form
                    </button>
                  </div>
                </div>
              ) : (
                <form
                  className="arv-inq-form"
                  onSubmit={handleSubmit}
                  noValidate
                >
                  {/* Spam honeypot — invisible to humans */}
                  <div className="arv-hp" aria-hidden="true">
                    <label htmlFor="arv-company-url">Leave this field blank</label>
                    <input
                      id="arv-company-url"
                      name="websiteTrap"
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      value={form.websiteTrap ?? ""}
                      onChange={(e) => updateField("websiteTrap", e.target.value)}
                    />
                  </div>

                  <div className="arv-field-row">
                    <div className="arv-input-group">
                      <label htmlFor="inq-name">
                        Name <span aria-hidden="true">*</span>
                      </label>
                      <input
                        ref={nameInputRef}
                        id="inq-name"
                        name="name"
                        type="text"
                        autoComplete="name"
                        required
                        maxLength={100}
                        placeholder="Your full name"
                        value={form.name}
                        onChange={(e) => updateField("name", e.target.value)}
                        aria-invalid={!!errors.name || undefined}
                        aria-describedby={errors.name ? "inq-name-err" : undefined}
                      />
                      {errors.name ? (
                        <span id="inq-name-err" className="arv-err" role="alert">
                          {errors.name}
                        </span>
                      ) : null}
                    </div>

                    <div className="arv-input-group">
                      <label htmlFor="inq-email">
                        Email <span aria-hidden="true">*</span>
                      </label>
                      <input
                        id="inq-email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        maxLength={160}
                        placeholder="you@company.com"
                        value={form.email}
                        onChange={(e) => updateField("email", e.target.value)}
                        aria-invalid={!!errors.email || undefined}
                        aria-describedby={
                          errors.email ? "inq-email-err" : undefined
                        }
                      />
                      {errors.email ? (
                        <span id="inq-email-err" className="arv-err" role="alert">
                          {errors.email}
                        </span>
                      ) : null}
                    </div>
                  </div>

                  <div className="arv-input-group">
                    <label htmlFor="inq-service">
                      Service category <span aria-hidden="true">*</span>
                    </label>
                    <select
                      id="inq-service"
                      name="serviceCategory"
                      required
                      value={form.serviceCategory}
                      onChange={(e) =>
                        updateField("serviceCategory", e.target.value)
                      }
                      aria-invalid={!!errors.serviceCategory || undefined}
                      aria-describedby={
                        errors.serviceCategory ? "inq-service-err" : undefined
                      }
                    >
                      <option value="">Select what you need…</option>
                      {SERVICE_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                    {errors.serviceCategory ? (
                      <span
                        id="inq-service-err"
                        className="arv-err"
                        role="alert"
                      >
                        {errors.serviceCategory}
                      </span>
                    ) : null}
                  </div>

                  <div className="arv-input-group">
                    <label htmlFor="inq-desc">
                      Project description <span aria-hidden="true">*</span>
                    </label>
                    <textarea
                      id="inq-desc"
                      name="description"
                      rows={4}
                      required
                      maxLength={3000}
                      placeholder="What are you building, what problem should it solve, and what does success look like?"
                      value={form.description}
                      onChange={(e) =>
                        updateField("description", e.target.value)
                      }
                      aria-invalid={!!errors.description || undefined}
                      aria-describedby={
                        errors.description ? "inq-desc-err" : undefined
                      }
                    />
                    <div className="arv-field-meta">
                      {errors.description ? (
                        <span id="inq-desc-err" className="arv-err" role="alert">
                          {errors.description}
                        </span>
                      ) : (
                        <span className="arv-fine">
                          Keep it simple — detailed requirements come during follow-up.
                        </span>
                      )}
                      <span className="arv-fine">
                        {form.description.length}/3000
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="arv-optional-toggle"
                    aria-expanded={showOptional}
                    onClick={() => setShowOptional((s) => !s)}
                  >
                    <span
                      className="arv-plus"
                      data-open={showOptional || undefined}
                    >
                      <Icon d={ICONS.plus} size={14} />
                    </span>
                    {showOptional
                      ? "Hide optional project details"
                      : "Add budget, timeline, WhatsApp, or reference links (optional)"}
                  </button>

                  <div
                    className="arv-collapse"
                    data-open={showOptional || undefined}
                  >
                    <div className="arv-optional-fields">
                      <div className="arv-field-row">
                        <div className="arv-input-group">
                          <label htmlFor="inq-budget">Estimated budget</label>
                          <select
                            id="inq-budget"
                            name="budget"
                            value={form.budget ?? ""}
                            onChange={(e) =>
                              updateField("budget", e.target.value)
                            }
                          >
                            <option value="">Prefer not to say</option>
                            {BUDGET_OPTIONS.map((b) => (
                              <option key={b} value={b}>
                                {b}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="arv-input-group">
                          <label htmlFor="inq-timeline">Desired timeline</label>
                          <select
                            id="inq-timeline"
                            name="timeline"
                            value={form.timeline ?? ""}
                            onChange={(e) =>
                              updateField("timeline", e.target.value)
                            }
                          >
                            <option value="">Select timeline…</option>
                            {TIMELINE_OPTIONS.map((t) => (
                              <option key={t} value={t}>
                                {t}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="arv-field-row">
                        <div className="arv-input-group">
                          <label htmlFor="inq-whatsapp">WhatsApp number</label>
                          <input
                            id="inq-whatsapp"
                            name="whatsapp"
                            type="tel"
                            maxLength={25}
                            placeholder="+1 (416) 555-0199"
                            value={form.whatsapp ?? ""}
                            onChange={(e) =>
                              updateField("whatsapp", e.target.value)
                            }
                            aria-invalid={!!errors.whatsapp || undefined}
                          />
                          {errors.whatsapp ? (
                            <span className="arv-err" role="alert">
                              {errors.whatsapp}
                            </span>
                          ) : null}
                        </div>

                        <div className="arv-input-group">
                          <label htmlFor="inq-website">Existing website</label>
                          <input
                            id="inq-website"
                            name="existingWebsite"
                            type="url"
                            maxLength={300}
                            placeholder="https://yourdomain.com"
                            value={form.existingWebsite ?? ""}
                            onChange={(e) =>
                              updateField("existingWebsite", e.target.value)
                            }
                            aria-invalid={!!errors.existingWebsite || undefined}
                          />
                          {errors.existingWebsite ? (
                            <span className="arv-err" role="alert">
                              {errors.existingWebsite}
                            </span>
                          ) : null}
                        </div>
                      </div>

                      <div className="arv-input-group">
                        <label htmlFor="inq-refs">Reference URLs</label>
                        <input
                          id="inq-refs"
                          name="referenceUrls"
                          type="text"
                          maxLength={1000}
                          placeholder="Comma-separated inspiration links (e.g., https://site1.com, https://site2.com)"
                          value={form.referenceUrls ?? ""}
                          onChange={(e) =>
                            updateField("referenceUrls", e.target.value)
                          }
                          aria-invalid={!!errors.referenceUrls || undefined}
                        />
                        {errors.referenceUrls ? (
                          <span className="arv-err" role="alert">
                            {errors.referenceUrls}
                          </span>
                        ) : null}
                      </div>

                      <div className="arv-input-group">
                        <label htmlFor="inq-extra">
                          Additional requirements
                        </label>
                        <textarea
                          id="inq-extra"
                          name="additionalRequirements"
                          rows={2}
                          maxLength={2000}
                          placeholder="Specific integrations, hosting preferences, or constraints"
                          value={form.additionalRequirements ?? ""}
                          onChange={(e) =>
                            updateField(
                              "additionalRequirements",
                              e.target.value
                            )
                          }
                        />
                      </div>
                    </div>
                  </div>

                  {errors.form || submitState.status === "error" ? (
                    <div className="arv-err arv-err-box" role="alert">
                      <div>
                        {errors.form ||
                          (submitState.status === "error"
                            ? submitState.message
                            : "")}
                      </div>
                      {submitState.status === "error" &&
                      submitState.mailtoHref ? (
                        <div style={{ marginTop: 8 }}>
                          <a
                            href={submitState.mailtoHref}
                            className="arv-link"
                            style={{ color: "inherit", fontWeight: 500 }}
                          >
                            Send directly to {submitState.contactEmail || getContactEmail()} →
                          </a>
                        </div>
                      ) : null}
                    </div>
                  ) : null}

                  <div className="arv-inq-submit-row">
                    <button
                      type="submit"
                      className="arv-btn arv-btn-dark"
                      disabled={submitState.status === "submitting"}
                      data-busy={
                        submitState.status === "submitting" || undefined
                      }
                    >
                      {submitState.status === "submitting" ? (
                        <>
                          <span className="arv-spin" aria-hidden="true" />
                          Sending inquiry…
                        </>
                      ) : (
                        <>
                          Send Project Inquiry
                          <Icon d={ICONS.arrow} size={15} />
                        </>
                      )}
                    </button>
                    <span className="arv-fine">
                      Your details are only used to reply to your inquiry.
                    </span>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
