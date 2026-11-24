import { BUDGET_OPTIONS, SERVICE_OPTIONS, TIMELINE_OPTIONS } from "./data";

export interface InquiryPayload {
  name: string;
  email: string;
  serviceCategory: string;
  description: string;
  whatsapp?: string;
  budget?: string;
  timeline?: string;
  existingWebsite?: string;
  referenceUrls?: string;
  additionalRequirements?: string;
  selectedDemo?: string;
  /** Spam trap — must remain empty */
  websiteTrap?: string;
  /** Client timestamp when form rendered (anti-bot speed check) */
  startedAt?: number;
}

export interface ValidationErrors {
  name?: string;
  email?: string;
  serviceCategory?: string;
  description?: string;
  whatsapp?: string;
  existingWebsite?: string;
  referenceUrls?: string;
  additionalRequirements?: string;
  form?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^[+\d\s().-]{7,25}$/;

export function normalizeUrl(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return "";
  const candidate = /^https?:\/\//i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;
  try {
    const parsed = new URL(candidate);
    if (
      (parsed.protocol !== "http:" && parsed.protocol !== "https:") ||
      !parsed.hostname.includes(".")
    ) {
      return null;
    }
    return parsed.toString();
  } catch {
    return null;
  }
}

export function validateInquiry(data: InquiryPayload): {
  valid: boolean;
  errors: ValidationErrors;
  sanitized: InquiryPayload;
} {
  const errors: ValidationErrors = {};

  const name = (data.name ?? "").trim();
  const email = (data.email ?? "").trim();
  const serviceCategory = (data.serviceCategory ?? "").trim();
  const description = (data.description ?? "").trim();
  const whatsapp = (data.whatsapp ?? "").trim();
  const budget = (data.budget ?? "").trim();
  const timeline = (data.timeline ?? "").trim();
  const existingWebsite = (data.existingWebsite ?? "").trim();
  const referenceUrls = (data.referenceUrls ?? "").trim();
  const additionalRequirements = (data.additionalRequirements ?? "").trim();
  const selectedDemo = (data.selectedDemo ?? "").trim();

  if (!name) {
    errors.name = "Please enter your name.";
  } else if (name.length < 2) {
    errors.name = "Name must be at least 2 characters.";
  } else if (name.length > 100) {
    errors.name = "Name must be under 100 characters.";
  }

  if (!email) {
    errors.email = "Please enter your email address.";
  } else if (email.length > 160 || !EMAIL_RE.test(email)) {
    errors.email = "Enter a valid email address (e.g., name@company.com).";
  }

  if (
    !serviceCategory ||
    !(SERVICE_OPTIONS as readonly string[]).includes(serviceCategory)
  ) {
    errors.serviceCategory = "Please select a service category.";
  }

  if (!description) {
    errors.description = "Please briefly describe what you're building.";
  } else if (description.length < 15) {
    errors.description =
      "Please share a bit more detail (at least 15 characters).";
  } else if (description.length > 3000) {
    errors.description = "Project description must be under 3,000 characters.";
  }

  if (whatsapp && !PHONE_RE.test(whatsapp)) {
    errors.whatsapp = "Enter a valid phone or WhatsApp number with digits.";
  }

  let normalizedSite = "";
  if (existingWebsite) {
    if (existingWebsite.length > 300) {
      errors.existingWebsite = "URL is too long.";
    } else {
      const n = normalizeUrl(existingWebsite);
      if (n === null) {
        errors.existingWebsite =
          "Enter a valid website URL (e.g., https://yourdomain.com).";
      } else {
        normalizedSite = n;
      }
    }
  }

  let normalizedRefs = "";
  if (referenceUrls) {
    if (referenceUrls.length > 1000) {
      errors.referenceUrls = "Reference URLs must be under 1,000 characters.";
    } else {
      const tokens = referenceUrls
        .split(/[\n,]+/)
        .map((s) => s.trim())
        .filter(Boolean);
      const validTokens: string[] = [];
      for (const tok of tokens) {
        const n = normalizeUrl(tok);
        if (n === null) {
          errors.referenceUrls = `Invalid reference URL: "${tok.slice(0, 40)}"`;
          break;
        }
        validTokens.push(n);
      }
      normalizedRefs = validTokens.join("\n");
    }
  }

  if (additionalRequirements.length > 2000) {
    errors.additionalRequirements =
      "Additional requirements must be under 2,000 characters.";
  }

  const safeBudget = (BUDGET_OPTIONS as readonly string[]).includes(budget)
    ? budget
    : "";
  const safeTimeline = (TIMELINE_OPTIONS as readonly string[]).includes(
    timeline
  )
    ? timeline
    : "";

  return {
    valid: Object.keys(errors).length === 0,
    errors,
    sanitized: {
      name,
      email,
      serviceCategory,
      description,
      whatsapp,
      budget: safeBudget,
      timeline: safeTimeline,
      existingWebsite: normalizedSite,
      referenceUrls: normalizedRefs,
      additionalRequirements,
      selectedDemo: selectedDemo.slice(0, 120),
      websiteTrap: data.websiteTrap ?? "",
      startedAt: data.startedAt,
    },
  };
}

export function buildMailtoFallback(
  toEmail: string,
  payload: InquiryPayload
): string {
  const subject = `[Arvostra Inquiry] ${payload.serviceCategory} — ${payload.name}`;
  const lines = [
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
    `Service: ${payload.serviceCategory}`,
    payload.selectedDemo ? `Demo of Interest: ${payload.selectedDemo}` : "",
    payload.whatsapp ? `WhatsApp: ${payload.whatsapp}` : "",
    payload.budget ? `Estimated Budget: ${payload.budget}` : "",
    payload.timeline ? `Desired Timeline: ${payload.timeline}` : "",
    payload.existingWebsite ? `Existing Website: ${payload.existingWebsite}` : "",
    payload.referenceUrls ? `Reference URLs:\n${payload.referenceUrls}` : "",
    "",
    "Project Description:",
    payload.description,
    payload.additionalRequirements
      ? `\nAdditional Requirements:\n${payload.additionalRequirements}`
      : "",
  ].filter(Boolean);

  return `mailto:${encodeURIComponent(toEmail)}?subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(lines.join("\n"))}`;
}

export type FeedbackType = "Bug Report" | "Suggestion" | "UX / Content";
export type BugSeverity = "Minor UI glitch" | "Broken interaction" | "Blocking / Critical";

export const FEEDBACK_TYPES: readonly FeedbackType[] = [
  "Bug Report",
  "Suggestion",
  "UX / Content",
];

export const FEEDBACK_AREAS = [
  "Main Website",
  "Live Demo Sandbox",
  "Mobile / Responsive Layout",
  "404 / Broken Link",
  "Performance / Loading",
  "New Demo or Tool Idea",
  "Other",
] as const;

export const BUG_SEVERITIES: readonly BugSeverity[] = [
  "Minor UI glitch",
  "Broken interaction",
  "Blocking / Critical",
];

export interface FeedbackPayload {
  type: FeedbackType;
  area: string;
  severity?: string;
  details: string;
  email?: string;
  includeTechContext: boolean;
  techContext?: string;
  /** Spam trap — must remain empty */
  feedbackTrap?: string;
  startedAt?: number;
}

export interface FeedbackErrors {
  type?: string;
  area?: string;
  details?: string;
  email?: string;
  form?: string;
}

export function validateFeedback(data: FeedbackPayload): {
  valid: boolean;
  errors: FeedbackErrors;
  sanitized: FeedbackPayload;
} {
  const errors: FeedbackErrors = {};
  const type = FEEDBACK_TYPES.includes(data.type) ? data.type : "Bug Report";
  const area = (data.area ?? "").trim() || "Main Website";
  const details = (data.details ?? "").trim();
  const email = (data.email ?? "").trim();
  const severity =
    type === "Bug Report" &&
    data.severity &&
    (BUG_SEVERITIES as readonly string[]).includes(data.severity)
      ? data.severity
      : type === "Bug Report"
      ? "Minor UI glitch"
      : "";

  if (!details) {
    errors.details =
      type === "Bug Report"
        ? "Please describe what happened and how to reproduce it."
        : "Please share your suggestion or feedback.";
  } else if (details.length < 10) {
    errors.details = "Please add a little more detail (at least 10 characters).";
  } else if (details.length > 2000) {
    errors.details = "Message must be under 2,000 characters.";
  }

  if (email && (email.length > 160 || !EMAIL_RE.test(email))) {
    errors.email = "Enter a valid email address or leave this blank.";
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
    sanitized: {
      type,
      area: area.slice(0, 80),
      severity,
      details,
      email,
      includeTechContext: Boolean(data.includeTechContext),
      techContext: data.includeTechContext
        ? (data.techContext ?? "").trim().slice(0, 400)
        : "",
      feedbackTrap: data.feedbackTrap ?? "",
      startedAt: data.startedAt,
    },
  };
}

export function formatFeedbackReport(payload: FeedbackPayload): string {
  return [
    `Type: ${payload.type}`,
    `Area: ${payload.area}`,
    payload.severity ? `Severity: ${payload.severity}` : "",
    payload.email ? `Reply Email: ${payload.email}` : "Reply Email: Anonymous",
    payload.includeTechContext && payload.techContext
      ? `Technical Context: ${payload.techContext}`
      : "",
    "",
    "Details:",
    payload.details,
  ]
    .filter(Boolean)
    .join("\n");
}

export function buildFeedbackMailto(
  toEmail: string,
  payload: FeedbackPayload
): string {
  const subject = `[Arvostra ${payload.type}] ${payload.area}`;
  const body = formatFeedbackReport(payload);
  return `mailto:${encodeURIComponent(toEmail)}?subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(body)}`;
}
