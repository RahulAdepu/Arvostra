import { getContactEmail } from "./submitInquiry";
import { buildFeedbackMailto, FeedbackPayload } from "./validation";

export type FeedbackDeliveryResult =
  | {
      status: "delivered";
      provider: "web3forms" | "netlify" | "formspree" | "webhook";
      referenceId: string;
    }
  | {
      status: "unconfigured";
      message: string;
      mailtoHref: string;
      contactEmail: string;
    }
  | {
      status: "error";
      message: string;
      mailtoHref: string;
      contactEmail: string;
    };

const FEEDBACK_COOLDOWN_KEY = "arvostra_last_feedback_v1";
const COOLDOWN_MS = 45_000;

function generateFeedbackRef(): string {
  const now = new Date();
  const ymd = `${now.getUTCFullYear()}${String(now.getUTCMonth() + 1).padStart(
    2,
    "0"
  )}${String(now.getUTCDate()).padStart(2, "0")}`;
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `ARV-FB-${ymd}-${rand}`;
}

function isLocalhostHost(): boolean {
  if (typeof window === "undefined") return false;
  const h = window.location.hostname;
  return h === "localhost" || h === "127.0.0.1" || h === "::1" || h.endsWith(".local");
}

function isNetlifyHost(): boolean {
  if (import.meta.env.VITE_ENABLE_NETLIFY_FORMS === "true") {
    return !isLocalhostHost();
  }
  if (typeof window === "undefined") return false;
  return window.location.hostname.endsWith(".netlify.app");
}

function checkCooldown(fingerprint: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(FEEDBACK_COOLDOWN_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { fp?: string; ts?: number };
    if (
      parsed.fp === fingerprint &&
      parsed.ts &&
      Date.now() - parsed.ts < COOLDOWN_MS
    ) {
      return "This exact report was just submitted. Update your note to send another.";
    }
  } catch {
    // Ignore restricted storage
  }
  return null;
}

function saveCooldown(fingerprint: string) {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(
      FEEDBACK_COOLDOWN_KEY,
      JSON.stringify({ fp: fingerprint, ts: Date.now() })
    );
  } catch {
    // Ignore restricted storage
  }
}

export async function submitStaticFeedback(
  payload: FeedbackPayload
): Promise<FeedbackDeliveryResult> {
  const contactEmail = getContactEmail();
  const mailtoHref = buildFeedbackMailto(contactEmail, payload);

  if (payload.feedbackTrap && payload.feedbackTrap.trim().length > 0) {
    return {
      status: "error",
      message: "Submission rejected by spam protection.",
      mailtoHref,
      contactEmail,
    };
  }

  if (
    typeof payload.startedAt === "number" &&
    Date.now() - payload.startedAt < 1200
  ) {
    return {
      status: "error",
      message: "Please review your note briefly before submitting.",
      mailtoHref,
      contactEmail,
    };
  }

  const fingerprint = `${payload.type}|${payload.area}|${payload.details.slice(
    0,
    120
  )}`;
  const cooldownErr = checkCooldown(fingerprint);
  if (cooldownErr) {
    return {
      status: "error",
      message: cooldownErr,
      mailtoHref,
      contactEmail,
    };
  }

  const referenceId = generateFeedbackRef();
  const web3FormsKey = (import.meta.env.VITE_WEB3FORMS_KEY as string | undefined)?.trim();
  const formspreeEndpoint = (import.meta.env.VITE_FORMSPREE_ENDPOINT as string | undefined)?.trim();
  const webhookUrl = (import.meta.env.VITE_INQUIRY_WEBHOOK_URL as string | undefined)?.trim();

  if (web3FormsKey) {
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: web3FormsKey,
          subject: `[Arvostra ${payload.type}] ${payload.area} (${referenceId})`,
          from_name: "Arvostra Feedback",
          replyto: payload.email || contactEmail,
          botcheck: "",
          reference_id: referenceId,
          feedback_type: payload.type,
          area: payload.area,
          severity: payload.severity || "N/A",
          reporter_email: payload.email || "Anonymous",
          technical_context: payload.techContext || "Not included",
          details: payload.details,
        }),
      });
      const json = (await res.json().catch(() => null)) as {
        success?: boolean;
        message?: string;
      } | null;

      if (res.ok && json?.success === true) {
        saveCooldown(fingerprint);
        return { status: "delivered", provider: "web3forms", referenceId };
      }
      return {
        status: "error",
        message:
          json?.message ||
          "Could not deliver your report via the relay right now. Use the direct email option below.",
        mailtoHref,
        contactEmail,
      };
    } catch {
      return {
        status: "error",
        message:
          "Network error reaching the form service. Use the direct email option below.",
        mailtoHref,
        contactEmail,
      };
    }
  }

  const externalEndpoint = formspreeEndpoint || webhookUrl;
  if (externalEndpoint) {
    try {
      const res = await fetch(externalEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          kind: "feedback",
          referenceId,
          source: "arvostra.com",
          ...payload,
        }),
      });
      if (res.ok) {
        saveCooldown(fingerprint);
        return {
          status: "delivered",
          provider: formspreeEndpoint ? "formspree" : "webhook",
          referenceId,
        };
      }
      return {
        status: "error",
        message:
          "The configured endpoint rejected the submission. Please retry or email directly below.",
        mailtoHref,
        contactEmail,
      };
    } catch {
      return {
        status: "error",
        message:
          "Network error while sending your report. Please email directly below.",
        mailtoHref,
        contactEmail,
      };
    }
  }

  if (isNetlifyHost()) {
    try {
      const params = new URLSearchParams();
      params.append("form-name", "arvostra-feedback");
      params.append("bot-field", "");
      params.append("referenceId", referenceId);
      params.append("type", payload.type);
      params.append("area", payload.area);
      params.append("severity", payload.severity || "");
      params.append("email", payload.email || "");
      params.append("techContext", payload.techContext || "");
      params.append("details", payload.details);

      const res = await fetch("./__forms.html", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params.toString(),
      });

      const isConfirmedNetlify =
        res.ok &&
        (Boolean(res.headers.get("x-nf-request-id")) ||
          (res.headers.get("server") || "").toLowerCase().includes("netlify") ||
          window.location.hostname.endsWith(".netlify.app") ||
          import.meta.env.VITE_ENABLE_NETLIFY_FORMS === "true");

      if (isConfirmedNetlify) {
        saveCooldown(fingerprint);
        return { status: "delivered", provider: "netlify", referenceId };
      }

      return {
        status: "error",
        message:
          "Netlify Forms did not confirm receipt. Please use the direct email option below.",
        mailtoHref,
        contactEmail,
      };
    } catch {
      return {
        status: "error",
        message:
          "Network error submitting to Netlify Forms. Use the direct email option below.",
        mailtoHref,
        contactEmail,
      };
    }
  }

  return {
    status: "unconfigured",
    message:
      "Automated relay is not connected on this static build (set VITE_WEB3FORMS_KEY for GitHub Pages, or deploy to Netlify for built-in Netlify Forms).",
    mailtoHref,
    contactEmail,
  };
}
