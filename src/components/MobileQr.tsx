import * as React from "react";
import QRCode from "qrcode";
import { BRAND } from "@/lib/data";
import { Icon, ICONS } from "./Icons";

function isLocalPreview(): boolean {
  if (typeof window === "undefined") return false;
  const h = window.location.hostname;
  return h === "localhost" || h === "127.0.0.1" || h === "::1" || h.endsWith(".local");
}

function getLiveUrl(): string {
  if (typeof window === "undefined") return BRAND.url;
  if (isLocalPreview()) return BRAND.githubPagesUrl;
  return `${window.location.origin}${window.location.pathname}`;
}

function useQrSvgDataUri(url: string) {
  const [src, setSrc] = React.useState<string>("");

  React.useEffect(() => {
    let active = true;
    QRCode.toString(url, {
      type: "svg",
      margin: 2,
      errorCorrectionLevel: "M",
      color: {
        dark: "#10292d",
        light: "#ffffff",
      },
    })
      .then((svg) => {
        if (!active) return;
        setSrc(`data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`);
      })
      .catch(() => {
        if (active) setSrc("");
      });
    return () => {
      active = false;
    };
  }, [url]);

  return src;
}

export function QrIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      className="arv-svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="7" height="7" rx="1.2" />
      <rect x="14" y="3" width="7" height="7" rx="1.2" />
      <rect x="3" y="14" width="7" height="7" rx="1.2" />
      <path d="M14 14h2.5v2.5H14zM18.5 14H21v2.5M14 19h2.5M18.5 18.5H21V21h-2.5z" />
    </svg>
  );
}

/** Compact desktop navbar trigger button */
export function QrNavButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      className="arv-theme-btn arv-qr-nav-btn"
      onClick={onClick}
      aria-label="Open on phone via QR code"
      title="Open on phone (QR code)"
    >
      <QrIcon size={16} />
    </button>
  );
}

/** Scannable compact QR card placed in the Footer (desktop & tablet) */
export function FooterQrCard({ onExpand }: { onExpand: () => void }) {
  const [url, setUrl] = React.useState(BRAND.url);

  React.useEffect(() => {
    setUrl(getLiveUrl());
  }, []);

  const qrSrc = useQrSvgDataUri(url);

  return (
    <button
      type="button"
      className="arv-qr-foot-card"
      onClick={onExpand}
      aria-label="Enlarge QR code to open Arvostra on your phone"
    >
      <span className="arv-qr-thumb">
        {qrSrc ? (
          <img
            src={qrSrc}
            alt={`QR code for ${url}`}
            width={64}
            height={64}
          />
        ) : (
          <QrIcon size={24} />
        )}
      </span>
      <span className="arv-qr-foot-copy">
        <b>Open on your phone</b>
        <small>Scan or click to enlarge</small>
      </span>
    </button>
  );
}

/** Enlarged scannable QR modal for effortless phone scanning */
export function MobileQrModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [localMode, setLocalMode] = React.useState(false);
  const [selectedUrl, setSelectedUrl] = React.useState(BRAND.url);
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    if (!open) return;
    const local = isLocalPreview();
    setLocalMode(local);
    setSelectedUrl(local ? BRAND.githubPagesUrl : getLiveUrl());
    setCopied(false);

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
  }, [open, onClose]);

  const qrSrc = useQrSvgDataUri(selectedUrl);

  if (!open) return null;

  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(selectedUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div
      className="arv-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="arv-qr-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="arv-modal arv-qr-modal">
        <div className="arv-modal-head">
          <div>
            <span className="arv-k">Mobile Preview</span>
            <h3 id="arv-qr-modal-title" className="arv-h3" style={{ marginTop: 4 }}>
              Open Arvostra on your phone
            </h3>
          </div>
          <button
            type="button"
            className="arv-modal-close"
            onClick={onClose}
            aria-label="Close QR code modal"
          >
            <Icon d={ICONS.close} size={18} />
          </button>
        </div>

        <div className="arv-qr-modal-body">
          <div className="arv-qr-box">
            {qrSrc ? (
              <img
                src={qrSrc}
                alt={`Scannable QR code opening ${selectedUrl}`}
                width={216}
                height={216}
              />
            ) : (
              <div className="arv-qr-placeholder">Generating QR…</div>
            )}
          </div>

          <p className="arv-qr-hint">
            Point your phone camera at the code to open the site directly on mobile.
          </p>

          {localMode ? (
            <div className="arv-qr-local-switch">
              <span className="arv-fine">
                Local preview detected — scan a live URL instead:
              </span>
              <div className="arv-seg" role="tablist" aria-label="Choose live URL">
                <button
                  type="button"
                  role="tab"
                  aria-selected={selectedUrl === BRAND.githubPagesUrl}
                  onClick={() => setSelectedUrl(BRAND.githubPagesUrl)}
                >
                  GitHub Pages
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={selectedUrl === BRAND.url}
                  onClick={() => setSelectedUrl(BRAND.url)}
                >
                  arvostra.com
                </button>
              </div>
            </div>
          ) : null}

          <div className="arv-qr-url-row">
            <code>{selectedUrl}</code>
            <button
              type="button"
              className="arv-btn arv-btn-ghost arv-btn-sm"
              onClick={copyUrl}
            >
              <Icon d={copied ? ICONS.check : ICONS.copy} size={14} />
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
