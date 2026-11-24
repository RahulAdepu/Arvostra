import { BRAND } from "./data";
import { buildMailtoFallback, InquiryPayload } from "./validation";

export type InquiryDeliveryResult =
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

const COOLDOWN_STORAGE_KEY = "arvostra_last_inquiry_v1";
const COOLDOWN_MS = 60_000;

function generateReferenceId(): string {
  const now = new Date();
  const ymd = `${now.getUTCFullYear()}${String(now.getUTCMonth() + 1).padStart(
    2,
    "0"
  )}${String(now.getUTCDate()).padStart(2, "0")}`;
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `ARV-${ymd}-${rand}`;
}

export function getContactEmail(): string {
  return (
    (import.meta.env.VITE_CONTACT_EMAIL as string | undefined)?.trim() ||
    BRAND.contactEmail
  );
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

function checkSessionCooldown(fingerprint: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(COOLDOWN_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { fp?: string; ts?: number };
    if (
      parsed.fp === fingerprint &&
      parsed.ts &&
      Date.now() - parsed.ts < COOLDOWN_MS
    ) {
      return "This exact inquiry was just submitted. Please wait a minute or update your details before sending again.";
    }
  } catch {
    // Ignore storage access errors
  }
  return null;
}

function recordSessionCooldown(fingerprint: string) {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(
      COOLDOWN_STORAGE_KEY,
      JSON.stringify({ fp: fingerprint, ts: Date.now() })
    );
  } catch {
    // Ignore storage access errors
  }
}

export async function submitStaticInquiry(
  payload: InquiryPayload
): Promise<InquiryDeliveryResult> {
  const contactEmail = getContactEmail();
  const mailtoHref = buildMailtoFallback(contactEmail, payload);

  if (payload.websiteTrap && payload.websiteTrap.trim().length > 0) {
    return {
      status: "error",
      message: "Submission rejected by spam protection.",
      mailtoHref,
      contactEmail,
    };
  }

  if (typeof payload.startedAt === "number" && Date.now() - payload.startedAt < 1500) {
    return {
      status: "error",
      message: "Please take a moment to review your inquiry before submitting.",
      mailtoHref,
      contactEmail,
    };
  }

  const fingerprint = `${payload.email.toLowerCase()}|${payload.serviceCategory}|${payload.description.slice(0, 140)}`;
  const cooldownError = checkSessionCooldown(fingerprint);
  if (cooldownError) {
    return {
      status: "error",
      message: cooldownError,
      mailtoHref,
      contactEmail,
    };
  }

  const referenceId = generateReferenceId();
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
          subject: `[Arvostra] ${payload.serviceCategory} — ${payload.name} (${referenceId})`,
          from_name: `${payload.name} via Arvostra`,
          replyto: payload.email,
          botcheck: "",
          reference_id: referenceId,
          name: payload.name,
          email: payload.email,
          service_category: payload.serviceCategory,
          selected_demo: payload.selectedDemo || "None",
          whatsapp: payload.whatsapp || "Not provided",
          estimated_budget: payload.budget || "Not specified",
          desired_timeline: payload.timeline || "Not specified",
          existing_website: payload.existingWebsite || "Not provided",
          reference_urls: payload.referenceUrls || "Not provided",
          project_description: payload.description,
          additional_requirements: payload.additionalRequirements || "None",
        }),
      });
      const json = (await res.json().catch(() => null)) as {
        success?: boolean;
        message?: string;
      } | null;

      if (res.ok && json?.success === true) {
        recordSessionCooldown(fingerprint);
        return { status: "delivered", provider: "web3forms", referenceId };
      }
      return {
        status: "error",
        message:
          json?.message ||
          "The email relay could not deliver your inquiry right now. You can retry or send directly via email below.",
        mailtoHref,
        contactEmail,
      };
    } catch {
      return {
        status: "error",
        message:
          "Network error reaching the form service. Check your connection or use the direct email option below.",
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
          referenceId,
          source: "arvostra.com",
          ...payload,
        }),
      });
      if (res.ok) {
        recordSessionCooldown(fingerprint);
        return {
          status: "delivered",
          provider: formspreeEndpoint ? "formspree" : "webhook",
          referenceId,
        };
      }
      return {
        status: "error",
        message:
          "The configured form endpoint rejected the submission. Please retry or use the direct email option below.",
        mailtoHref,
        contactEmail,
      };
    } catch {
      return {
        status: "error",
        message:
          "Network error while sending your inquiry. You can retry or email directly below.",
        mailtoHref,
        contactEmail,
      };
    }
  }

  if (isNetlifyHost()) {
    try {
      const params = new URLSearchParams();
      params.append("form-name", "arvostra-inquiry");
      params.append("bot-field", "");
      params.append("referenceId", referenceId);
      params.append("name", payload.name);
      params.append("email", payload.email);
      params.append("serviceCategory", payload.serviceCategory);
      params.append("selectedDemo", payload.selectedDemo || "");
      params.append("whatsapp", payload.whatsapp || "");
      params.append("budget", payload.budget || "");
      params.append("timeline", payload.timeline || "");
      params.append("existingWebsite", payload.existingWebsite || "");
      params.append("referenceUrls", payload.referenceUrls || "");
      params.append("description", payload.description);
      params.append(
        "additionalRequirements",
        payload.additionalRequirements || ""
      );

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
        recordSessionCooldown(fingerprint);
        return { status: "delivered", provider: "netlify", referenceId };
      }

      return {
        status: "error",
        message:
          "Netlify Forms did not confirm receipt of this submission. Please use the direct email option below.",
        mailtoHref,
        contactEmail,
      };
    } catch {
      return {
        status: "error",
        message:
          "Network error submitting to Netlify Forms. Please use the direct email option below.",
        mailtoHref,
        contactEmail,
      };
    }
  }

  return {
    status: "unconfigured",
    message:
      "Automated form relay is not yet connected on this static build (set VITE_WEB3FORMS_KEY for GitHub Pages, or deploy to Netlify for built-in Netlify Forms).",
    mailtoHref,
    contactEmail,
  };
}
